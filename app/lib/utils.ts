export { cn } from "cn";

/** SSR-safe: only true in a browser inside an iframe. */
export const isIframe = (): boolean =>
  typeof window !== "undefined" && window.self !== window.top;
