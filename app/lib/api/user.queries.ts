import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Member, UserRole } from "@/lib/types";

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string | null;
  role?: UserRole;
  avatar_url?: string | null;
  created_at?: string;
  updated_at?: string;
  linkedMember?: Member | null;
}

export const USER_PROFILE_QUERY_KEY = ["user_profile"] as const;
export const SYSTEM_USERS_QUERY_KEY = ["system_users"] as const;

/**
 * Hook to fetch the currently authenticated user's profile and linked member record.
 */
export function useUserProfileQuery() {
  return useQuery({
    queryKey: USER_PROFILE_QUERY_KEY,
    queryFn: async (): Promise<UserProfile | null> => {
      const supabase = getSupabaseBrowserClient();
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        return null;
      }

      // 1. Fetch profile record
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        console.warn("Could not load user profile:", profileError.message);
      }

      // 2. Fetch linked club member record if exists
      const { data: member } = await supabase
        .from("members")
        .select("*")
        .eq("profile_id", user.id)
        .maybeSingle();

      const rawRole = (profile?.role || (user.user_metadata?.role as string) || "member").toLowerCase();
      const role: UserRole =
        rawRole === "admin" ? "admin" : rawRole === "staff" || rawRole === "coach" ? "staff" : "member";

      return {
        id: user.id,
        email: user.email || "",
        full_name: profile?.full_name || (user.user_metadata?.full_name as string) || "",
        role,
        avatar_url: profile?.avatar_url || null,
        created_at: profile?.created_at || user.created_at,
        updated_at: profile?.updated_at,
        linkedMember: (member as Member) || null,
      };
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to update the user's personal profile (name, metadata).
 */
export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      fullName,
    }: {
      fullName: string;
    }) => {
      const supabase = getSupabaseBrowserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("You must be logged in to update your profile.");
      }

      const cleanName = fullName.trim();

      // 1. Update public.profiles
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: cleanName,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (profileError) {
        throw new Error(`Profile update failed: ${profileError.message}`);
      }

      // 2. Keep Supabase Auth metadata synchronized
      await supabase.auth.updateUser({
        data: { full_name: cleanName },
      });

      return { fullName: cleanName };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_PROFILE_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: SYSTEM_USERS_QUERY_KEY });
    },
  });
}

/**
 * Hook to change user password safely via Supabase Auth.
 */
export function useChangePasswordMutation() {
  return useMutation({
    mutationFn: async ({ newPassword }: { newPassword: string }) => {
      const supabase = getSupabaseBrowserClient();
      if (!newPassword || newPassword.length < 8) {
        throw new Error("Password must be at least 8 characters long.");
      }

      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        throw new Error(error.message || "Failed to update password.");
      }

      return data;
    },
  });
}

/**
 * Hook for staff/admins to view system users and roles.
 */
export function useSystemUsersQuery() {
  return useQuery({
    queryKey: SYSTEM_USERS_QUERY_KEY,
    queryFn: async () => {
      const supabase = getSupabaseBrowserClient();
      const [profilesRes, membersRes] = await Promise.all([
        supabase.from("profiles").select("*").order("created_at", { ascending: false }),
        supabase.from("members").select("id, profile_id, full_name, belt_rank"),
      ]);

      if (profilesRes.error) {
        throw new Error(`Failed to load system profiles: ${profilesRes.error.message}`);
      }

      const members = membersRes.data || [];
      const memberMap = new Map(members.map((m) => [m.profile_id, m]));

      return (profilesRes.data || []).map((p) => {
        const raw = (p.role || "member").toLowerCase();
        const normalizedRole: UserRole =
          raw === "admin" ? "admin" : raw === "staff" || raw === "coach" ? "staff" : "member";
        return {
          ...p,
          role: normalizedRole,
          linkedMember: memberMap.get(p.id) || null,
        };
      }) as UserProfile[];
    },
    staleTime: 1000 * 60 * 3,
  });
}

/**
 * Hook for administrators to update a user's role.
 * Standardized strictly lowercase: 'admin' | 'staff' | 'member'.
 */
export function useUpdateUserRoleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      role,
    }: {
      userId: string;
      role: UserRole;
    }) => {
      const supabase = getSupabaseBrowserClient();
      const normalizedRole = role.toLowerCase();
      const { error } = await supabase
        .from("profiles")
        .update({
          role: normalizedRole,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (error) {
        throw new Error(`Failed to update role: ${error.message}`);
      }

      return { userId, role: normalizedRole };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SYSTEM_USERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: USER_PROFILE_QUERY_KEY });
    },
  });
}

export interface CreateStaffUserInput {
  email: string;
  password: string;
  fullName: string;
  role: "staff" | "admin";
  linkedMemberId?: string | null;
}

/**
 * Hook for administrators to invite/create a new staff user.
 * Uses an isolated Supabase client with persistSession: false
 * so the logged-in administrator is NOT signed out.
 */
export function useCreateStaffUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      email,
      password,
      fullName,
      role,
      linkedMemberId,
    }: CreateStaffUserInput) => {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error("Missing Supabase configuration");
      }

      // Isolated ephemeral client so current session is unaffected
      const isolatedClient = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      });

      const cleanEmail = email.trim().toLowerCase();
      const cleanName = fullName.trim();
      const targetRole = role.toLowerCase() as "staff" | "admin";

      const { data, error } = await isolatedClient.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            full_name: cleanName,
            role: targetRole,
          },
        },
      });

      if (error) {
        throw new Error(error.message || "Failed to create staff account");
      }

      const newUserId = data.user?.id;

      if (newUserId) {
        const adminClient = getSupabaseBrowserClient();
        const { error: profileError } = await adminClient
          .from("profiles")
          .update({
            role: targetRole,
            full_name: cleanName,
            updated_at: new Date().toISOString(),
          })
          .eq("id", newUserId);

        if (profileError) {
          console.warn("Could not update profile role directly:", profileError.message);
        }

        if (linkedMemberId) {
          const { error: memberError } = await adminClient
            .from("members")
            .update({ profile_id: newUserId })
            .eq("id", linkedMemberId);

          if (memberError) {
            console.warn("Could not link member to new profile:", memberError.message);
          }
        }
      }

      return data.user;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SYSTEM_USERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
  });
}
