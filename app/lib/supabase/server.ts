import { createServerClient, parseCookieHeader, serializeCookieHeader } from "@supabase/ssr";
import { env } from "@/lib/env";
import type { Database } from "./types";

export function getSupabaseServerClient(request?: Request) {
  const headers = new Headers();
  const supabaseUrl = env.supabaseUrl;
  const supabaseAnonKey = env.supabaseAnonKey;

  const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return parseCookieHeader(request?.headers?.get("Cookie") ?? "");
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          headers.append(
            "Set-Cookie",
            serializeCookieHeader(name, value, options),
          ),
        );
      },
    },
  });

  return { supabase, headers };
}
