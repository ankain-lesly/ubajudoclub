import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { api, NotImplementedError } from "@/lib/api/client";

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role?: "coach" | "member" | "admin";
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

/**
 * Skeleton provider: always signed out.
 * TODO: back with a real session (cookie + root loader) when the backend exists.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const checkUserAuth = useCallback(async () => {}, []);
  const login = useCallback(async (_email: string, _password: string) => {
    throw new NotImplementedError("login");
  }, []);
  const register = useCallback(async (_email: string, _password: string) => {
    throw new NotImplementedError("register");
  }, []);
  const logout = useCallback(async (redirectTo?: string) => {
    await api.auth.logout(redirectTo);
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      user: null,
      isAuthenticated: false,
      isLoadingAuth: false,
      authChecked: true,
      authError: null,
      checkUserAuth,
      login,
      register,
      logout,
    }),
    [checkUserAuth, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
