import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export class NotImplementedError extends Error {
  constructor(what: string) {
    super(`${what} is not implemented yet.`);
    this.name = "NotImplementedError";
  }
}

export interface ListOptions {
  sort?: string;
  limit?: number;
}

export interface Page<T> {
  items: T[];
}

export interface EntityApi<T = any> {
  list(options?: ListOptions): Promise<Page<T>>;
  filter(query?: Record<string, unknown>, options?: ListOptions): Promise<Page<T>>;
  get(id: string): Promise<T>;
  create(data: Partial<T> & Record<string, unknown>): Promise<T>;
  update(id: string, data: Partial<T> & Record<string, unknown>): Promise<T>;
  delete(id: string): Promise<void>;
}

interface TableConfig {
  readTable: string;
  writeTable: string;
}

const TABLE_CONFIGS: Record<string, TableConfig> = {
  ClubEvent: { readTable: "events", writeTable: "events" },
  Member: { readTable: "members_with_stats", writeTable: "members" },
  TrainingSession: { readTable: "sessions_with_turnout", writeTable: "training_sessions" },
  Attendance: { readTable: "attendances", writeTable: "attendances" },
  SessionCoordinator: { readTable: "session_coordinators", writeTable: "session_coordinators" },
  SessionMedia: { readTable: "session_media", writeTable: "session_media" },
  JoinRequest: { readTable: "join_requests", writeTable: "join_requests" },
};

const createEntity = <T = any>(name: string): EntityApi<T> => {
  const config = TABLE_CONFIGS[name] || { readTable: name.toLowerCase(), writeTable: name.toLowerCase() };

  return {
    list: async (options?: ListOptions) => {
      const supabase = getSupabaseBrowserClient();
      let query = supabase.from(config.readTable as any).select("*");

      if (options?.sort) {
        const isDesc = options.sort.startsWith("-");
        const column = isDesc ? options.sort.slice(1) : options.sort;
        query = query.order(column, { ascending: !isDesc });
      }

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;
      if (error) {
        console.error(`Error listing ${name}:`, error);
        return { items: [] };
      }
      return { items: (data ?? []) as T[] };
    },

    filter: async (criteria?: Record<string, unknown>, options?: ListOptions) => {
      const supabase = getSupabaseBrowserClient();
      let query = supabase.from(config.readTable as any).select("*");

      if (criteria) {
        for (const [key, val] of Object.entries(criteria)) {
          if (val !== undefined) {
            query = query.eq(key, val);
          }
        }
      }

      if (options?.sort) {
        const isDesc = options.sort.startsWith("-");
        const column = isDesc ? options.sort.slice(1) : options.sort;
        query = query.order(column, { ascending: !isDesc });
      }

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;
      if (error) {
        console.error(`Error filtering ${name}:`, error);
        return { items: [] };
      }
      return { items: (data ?? []) as T[] };
    },

    get: async (id: string) => {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase
        .from(config.readTable as any)
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        throw new Error(`${name} "${id}" not found`);
      }
      return data as T;
    },

    create: async (payload: Partial<T> & Record<string, unknown>) => {
      const supabase = getSupabaseBrowserClient();
      // Remove any view-calculated fields if present in payload
      const sanitized = { ...payload };
      delete (sanitized as any).sessions_total;
      delete (sanitized as any).sessions_since_promotion;
      delete (sanitized as any).last_attended;
      delete (sanitized as any).attended_count;

      const { data, error } = await supabase
        .from(config.writeTable as any)
        .insert(sanitized as any)
        .select()
        .single();

      if (error) {
        throw error;
      }
      return data as T;
    },

    update: async (id: string, payload: Partial<T> & Record<string, unknown>) => {
      const supabase = getSupabaseBrowserClient();
      const sanitized = { ...payload };
      delete (sanitized as any).sessions_total;
      delete (sanitized as any).sessions_since_promotion;
      delete (sanitized as any).last_attended;
      delete (sanitized as any).attended_count;

      const { data, error } = await supabase
        .from(config.writeTable as any)
        .update(sanitized as any)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw error;
      }
      return data as T;
    },

    delete: async (id: string) => {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.from(config.writeTable as any).delete().eq("id", id);
      if (error) {
        throw error;
      }
    },
  };
};

export const api = {
  entities: {
    ClubEvent: createEntity("ClubEvent"),
    Member: createEntity("Member"),
    TrainingSession: createEntity("TrainingSession"),
    Attendance: createEntity("Attendance"),
    SessionCoordinator: createEntity("SessionCoordinator"),
    SessionMedia: createEntity("SessionMedia"),
    JoinRequest: createEntity("JoinRequest"),
  },
  auth: {
    me: async () => {
      const supabase = getSupabaseBrowserClient();
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        throw new Error("Not authenticated");
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      return {
        id: user.id,
        email: user.email ?? "",
        name: profile?.full_name ?? user.user_metadata?.full_name,
        role: (profile?.role?.toLowerCase() as "coach" | "member" | "admin") ?? "member",
      };
    },
    register: async ({ email, password, full_name, role }: { email: string; password: string; full_name?: string; role?: string }) => {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: full_name || splitEmail(email),
            role: role || "MEMBER",
          },
        },
      });
      if (error) throw error;
      return data;
    },
    verifyOtp: async ({ email, token, type }: { email: string; token: string; type: any }) => {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase.auth.verifyOtp({ email, token, type });
      if (error) throw error;
      return data;
    },
    resendOtp: async ({ email, type }: { email: string; type: any }) => {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase.auth.resend({ email, type });
      if (error) throw error;
      return data;
    },
    resetPasswordRequest: async (email: string) => {
      const supabase = getSupabaseBrowserClient();
      const redirectTo = typeof window !== "undefined" ? `${window.location.origin}/password-reset` : undefined;
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });
      if (error) throw error;
      return data;
    },
    resetPassword: async ({ newPassword }: { resetToken?: string | null; newPassword: string }) => {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
      return data;
    },
    loginViaEmailPassword: async ({ email, password }: { email: string; password: string }) => {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return data;
    },
    setToken: (_token: string) => {},
    logout: async (redirectTo?: string) => {
      const supabase = getSupabaseBrowserClient();
      await supabase.auth.signOut();
      if (redirectTo && typeof window !== "undefined") {
        window.location.assign(redirectTo);
      }
    },
  },
  functions: {
    invoke: async (name: string, payload?: unknown): Promise<{ data: unknown }> => {
      const supabase = getSupabaseBrowserClient();
      if (name === "publicStats") {
        const { data, error } = await supabase.rpc("get_public_stats");
        if (error) {
          console.error("Error invoking get_public_stats RPC:", error);
          return { data: null };
        }
        return { data };
      }

      try {
        const { data, error } = await supabase.functions.invoke(name, {
          body: (payload ?? {}) as any,
        });
        if (error) throw error;
        return { data };
      } catch (err) {
        console.warn(`Function ${name} invocation fallback:`, err);
        return { data: null };
      }
    },
  },
};

function splitEmail(email: string): string {
  const part = email.split("@")[0] || "Member";
  return part.charAt(0).toUpperCase() + part.slice(1);
}
