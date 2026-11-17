/**
 * Application Environment Configuration
 *
 * Provides a unified, SSR-safe way to read environment variables across both
 * client (Vite bundle) and server (Node/Bun SSR runtime).
 *
 * Architecture:
 * 1. Client (Vite Bundle):
 *    - Vite replaces `import.meta.env.VITE_*` with string literals at build time.
 *    - Browsers do NOT have a `process` object. Calling `process.env` throws ReferenceError.
 * 2. Server (React Router SSR in Node/Bun):
 *    - Server loaders and actions run on the server runtime where `process.env` is populated.
 *    - Vite also provides `import.meta.env` in SSR mode.
 *
 * Using static accessors (e.g. `import.meta.env.VITE_XYZ`) allows Vite to replace
 * values at compile time, while the safe fallback to `process.env` ensures production
 * container runtime variables work seamlessly.
 */

function readEnv(viteValue: string | undefined, processKey: string): string {
  if (viteValue) return viteValue;
  if (typeof process !== "undefined" && process?.env && process.env[processKey]) {
    return process.env[processKey] as string;
  }
  return "";
}

export const env = {
  get supabaseUrl(): string {
    return readEnv(import.meta.env.VITE_SUPABASE_URL, "VITE_SUPABASE_URL");
  },
  get supabaseAnonKey(): string {
    return readEnv(import.meta.env.VITE_SUPABASE_ANON_KEY, "VITE_SUPABASE_ANON_KEY");
  },
  get cloudinaryCloudName(): string {
    return readEnv(import.meta.env.VITE_CLOUDINARY_CLOUD_NAME, "VITE_CLOUDINARY_CLOUD_NAME");
  },
  get cloudinaryUploadPreset(): string {
    return readEnv(import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET, "VITE_CLOUDINARY_UPLOAD_PRESET");
  },
  get isProduction(): boolean {
    return import.meta.env.PROD;
  },
  get isDevelopment(): boolean {
    return import.meta.env.DEV;
  },
};

// Expose on window for easy DevTools console inspection in development
// if (typeof window !== "undefined" && import.meta.env.DEV) {
//   (window as any).__ENV__ = env;
// }