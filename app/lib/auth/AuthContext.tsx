import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role?: "coach" | "member" | "admin";
  linkedMemberId?: string | null;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoadingAuth: boolean;
  authChecked: boolean;
  authError: { type: string; message?: string } | null;
  checkUserAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: (redirectTo?: string) => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [authError, setAuthError] = useState<{ type: string; message?: string } | null>(null);

  const fetchUserProfile = useCallback(async (userId: string, email: string): Promise<AuthUser> => {
    try {
      const supabase = getSupabaseBrowserClient();
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, role")
        .eq("id", userId)
        .maybeSingle();

      const { data: member } = await supabase
        .from("members")
        .select("id")
        .eq("profile_id", userId)
        .maybeSingle();

      const rawRole = (profile?.role || "member").toLowerCase();
      const role: AuthUser["role"] =
        rawRole === "coach" || rawRole === "admin" ? (rawRole as AuthUser["role"]) : "member";

      return {
        id: userId,
        email,
        name: profile?.full_name ?? email.split("@")[0],
        role,
        linkedMemberId: member?.id ?? null,
      };
    } catch {
      return {
        id: userId,
        email,
        name: email.split("@")[0],
        role: "member",
        linkedMemberId: null,
      };
    }
  }, []);

  const checkUserAuth = useCallback(async () => {
    setIsLoadingAuth(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const { data: { user: sbUser }, error } = await supabase.auth.getUser();

      if (error || !sbUser) {
        setUser(null);
      } else {
        const fullUser = await fetchUserProfile(sbUser.id, sbUser.email ?? "");
        setUser(fullUser);
      }
    } catch (err: any) {
      setUser(null);
      setAuthError({ type: "check_auth_failed", message: err?.message });
    } finally {
      setIsLoadingAuth(false);
      setAuthChecked(true);
    }
  }, [fetchUserProfile]);

  useEffect(() => {
    let isMounted = true;
    const supabase = getSupabaseBrowserClient();

    // Check initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!isMounted) return;
      if (session?.user) {
        const fullUser = await fetchUserProfile(session.user.id, session.user.email ?? "");
        if (isMounted) {
          setUser(fullUser);
          setIsLoadingAuth(false);
          setAuthChecked(true);
        }
      } else {
        if (isMounted) {
          setUser(null);
          setIsLoadingAuth(false);
          setAuthChecked(true);
        }
      }
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!isMounted) return;
      if (session?.user) {
        const fullUser = await fetchUserProfile(session.user.id, session.user.email ?? "");
        if (isMounted) {
          setUser(fullUser);
          setIsLoadingAuth(false);
          setAuthChecked(true);
        }
      } else {
        if (isMounted) {
          setUser(null);
          setIsLoadingAuth(false);
          setAuthChecked(true);
        }
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [fetchUserProfile]);

  const login = useCallback(async (email: string, password: string) => {
    setAuthError(null);
    setIsLoadingAuth(true);
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setIsLoadingAuth(false);
      setAuthError({ type: "login_error", message: error.message });
      throw error;
    }

    if (data.user) {
      const fullUser = await fetchUserProfile(data.user.id, data.user.email ?? "");
      setUser(fullUser);
    }
    setIsLoadingAuth(false);
    setAuthChecked(true);
  }, [fetchUserProfile]);

  const register = useCallback(async (email: string, password: string) => {
    setAuthError(null);
    setIsLoadingAuth(true);
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setIsLoadingAuth(false);
      setAuthError({ type: "register_error", message: error.message });
      throw error;
    }

    if (data.user) {
      const fullUser = await fetchUserProfile(data.user.id, data.user.email ?? "");
      setUser(fullUser);
    }
    setIsLoadingAuth(false);
    setAuthChecked(true);
  }, [fetchUserProfile]);

  const logout = useCallback(async (redirectTo?: string) => {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    setUser(null);
    if (redirectTo && typeof window !== "undefined") {
      window.location.assign(redirectTo);
    }
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoadingAuth,
      authChecked,
      authError,
      checkUserAuth,
      login,
      register,
      logout,
    }),
    [user, isLoadingAuth, authChecked, authError, checkUserAuth, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
