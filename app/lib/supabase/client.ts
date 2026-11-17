import { createBrowserClient } from "@supabase/ssr";
import { env } from "@/lib/env";
import type { Database } from "./types";

let browserClient: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function getSupabaseBrowserClient() {
  if (typeof window === "undefined") {
    return createBrowserClient<Database>(env.supabaseUrl, env.supabaseAnonKey);
  }

  if (!browserClient) {
    browserClient = createBrowserClient<Database>(env.supabaseUrl, env.supabaseAnonKey);
  }

  return browserClient;
}

export const supabase = getSupabaseBrowserClient();
