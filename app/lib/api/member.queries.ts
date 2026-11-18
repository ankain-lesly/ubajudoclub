import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { todayISO } from "@/lib/data/coach";
import type { JoinRequest, Member, Rank } from "@/lib/types";

export const MEMBERS_QUERY_KEY = ["members"] as const;

export function useMembersQuery(options?: { sort?: string; limit?: number }) {
  return useQuery({
    queryKey: [...MEMBERS_QUERY_KEY, options?.sort ?? "full_name"],
    queryFn: async () => {
      const supabase = getSupabaseBrowserClient();
      const rawSort = options?.sort ?? "full_name";
      const ascending = !rawSort.startsWith("-");
      const sortCol = rawSort.startsWith("-") ? rawSort.slice(1) : rawSort;

      const { data, error } = await supabase
        .from("members_with_stats")
        .select("*")
        .order(sortCol, { ascending })
        .limit(options?.limit ?? 500);

      if (error) throw error;
      return (data ?? []) as Member[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useCreateMemberMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Member>) => {
      if (!data.full_name?.trim()) {
        throw new Error("Full name is required to create a member");
      }
      const supabase = getSupabaseBrowserClient();
      const insertPayload = {
        full_name: data.full_name.trim(),
        belt_rank: data.belt_rank || "White",
        status: data.status || "active",
        joined_on: data.joined_on || todayISO(),
        matricule: data.matricule || null,
        program: data.program || null,
        phone: data.phone || null,
        email: data.email || null,
        notes: data.notes || null,
        profile_id: data.profile_id || null,
      };

      const { data: member, error } = await supabase
        .from("members")
        .insert(insertPayload)
        .select()
        .single();

      if (error) throw error;
      return member as Member;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEMBERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["dashboard_overview"] });
    },
  });
}

export function useUpdateMemberMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Member> }) => {
      const supabase = getSupabaseBrowserClient();
      const {
        sessions_total,
        sessions_since_promotion,
        last_attended,
        id: _id,
        created_at,
        updated_at,
        ...updateFields
      } = data;

      const { data: member, error } = await supabase
        .from("members")
        .update({
          ...updateFields,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return member as Member;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEMBERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["dashboard_overview"] });
    },
  });
}

export function usePromoteMemberMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      memberId,
      toRank,
      note,
    }: {
      memberId: string;
      toRank: Rank;
      note?: string;
    }) => {
      const supabase = getSupabaseBrowserClient();
      const { data: member, error } = await supabase
        .from("members")
        .update({
          belt_rank: toRank,
          ...(note ? { notes: note } : {}),
        })
        .eq("id", memberId)
        .select()
        .single();

      if (error) throw error;
      return member as Member;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEMBERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["dashboard_overview"] });
    },
  });
}

export const JOIN_REQUESTS_QUERY_KEY = ["join_requests"] as const;

/**
 * Public write-only mutation for prospective athletes submitting the /join form.
 * Directly inserts via Supabase without requiring SELECT permissions, preventing
 * RLS violations for unauthenticated visitors.
 */
export function useSubmitJoinRequestMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      full_name: string;
      email: string;
      phone?: string | null;
      program?: string | null;
      experience?: string | null;
      message?: string | null;
      status?: string;
    }) => {
      const supabase = getSupabaseBrowserClient();
      const sanitized = {
        full_name: payload.full_name.trim(),
        email: payload.email.trim().toLowerCase(),
        phone: payload.phone?.trim() || null,
        program: payload.program?.trim() || null,
        experience: payload.experience || "beginner",
        message: payload.message?.trim() || null,
        status: payload.status || "new",
      };

      const { error } = await supabase.from("join_requests").insert(sanitized);

      if (error) {
        throw new Error(error.message || "Failed to submit join request");
      }

      return sanitized;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: JOIN_REQUESTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["dashboard_overview"] });
    },
  });
}

export function useJoinRequestsQuery(status?: string) {
  return useQuery({
    queryKey: [...JOIN_REQUESTS_QUERY_KEY, status ?? "all"],
    queryFn: async () => {
      const supabase = getSupabaseBrowserClient();
      let query = supabase
        .from("join_requests")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);

      if (status && status !== "all") {
        query = query.eq("status", status);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as JoinRequest[];
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function useUpdateJoinRequestStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: "new" | "contacted" | "joined" | "declined";
    }) => {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase
        .from("join_requests")
        .update({ status })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as JoinRequest;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: JOIN_REQUESTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["dashboard_overview"] });
    },
  });
}

export function useConvertJoinRequestMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      request,
      memberData,
    }: {
      request: JoinRequest;
      memberData?: Partial<Member>;
    }) => {
      const supabase = getSupabaseBrowserClient();

      // 1. Create the member
      const { data: member, error: memberErr } = await supabase
        .from("members")
        .insert({
          full_name: memberData?.full_name || request.full_name,
          email: memberData?.email || request.email,
          phone: memberData?.phone || request.phone,
          matricule: memberData?.matricule || null,
          status: "active",
          belt_rank: memberData?.belt_rank || "White",
          joined_on: todayISO(),
          program: memberData?.program || request.program || null,
          notes: memberData?.notes || null,
        })
        .select()
        .single();

      if (memberErr) throw memberErr;

      // 2. Mark the join request as joined
      if (request.id) {
        const { error: reqErr } = await supabase
          .from("join_requests")
          .update({
            status: "joined",
            converted_member_id: member.id,
          })
          .eq("id", request.id);

        if (reqErr) throw reqErr;
      }

      return member as Member;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: JOIN_REQUESTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: MEMBERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["dashboard_overview"] });
    },
  });
}

export function useDeleteJoinRequestMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.from("join_requests").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: JOIN_REQUESTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["dashboard_overview"] });
    },
  });
}
