import { Link, data } from "react-router";
import type { Route } from "./+types/not-found";

export function meta() {
  return [{ title: "Page not found — UBa Judo Club" }];
}

export function loader() {
  throw data(null, { status: 404 });
}

export default function NotFound() {
  return null;
}

export function ErrorBoundary(_props: Route.ErrorBoundaryProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-md space-y-6 text-center">
        <h1 className="text-7xl font-light text-ink/25">404</h1>
        <h2 className="text-2xl font-medium text-foreground">Page not found</h2>
        <p className="leading-relaxed text-muted-foreground">
          The page you are looking for doesn&apos;t exist.
        </p>
        <Link
          to="/"
          className="inline-flex items-center rounded-full bg-ink px-6 py-3 text-sm font-semibold text-paper"
        >
          Back home
        </Link>
      </div>
    </div>
  );
}
