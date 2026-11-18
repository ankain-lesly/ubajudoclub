import { getSupabaseBrowserClient } from "@/lib/supabase/client";

/**
 * Sends a password reset email via Supabase Auth.
 */
export async function requestPasswordReset(email: string) {
  const supabase = getSupabaseBrowserClient();
  const redirectTo =
    typeof window !== "undefined"
      ? `${window.location.origin}/password-reset`
      : undefined;

  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });

  if (error) throw error;
  return data;
}

/**
 * Updates the user's password once they follow the reset link.
 */
export async function updatePassword(newPassword: string) {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) throw error;
  return data;
}

/**
 * Signs out the current user and optionally redirects.
 */
export async function signOutUser(redirectTo?: string) {
  const supabase = getSupabaseBrowserClient();
  await supabase.auth.signOut();
  if (redirectTo && typeof window !== "undefined") {
    window.location.assign(redirectTo);
  }
}
