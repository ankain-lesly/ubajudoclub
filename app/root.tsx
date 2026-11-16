import { useState } from "react";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

import type { Route } from "./+types/root";
import "./app.css";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { createQueryClient } from "@/lib/query-client";

const TITLE = "UBa Judo Club — University of Bamenda";
const DESCRIPTION =
  "The University of Bamenda judo club at Bambili Campus. Training three evenings and one Saturday a week, a clear Kyu–Dan belt pathway, and open turnout metrics that never expose member identities.";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  {
    rel: "icon",
    type: "image/svg+xml",
    href: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' rx='9' fill='%2314150F'/%3E%3Ccircle cx='20' cy='15' r='6' fill='none' stroke='%23DE3B26' stroke-width='2.4'/%3E%3Cpath d='M11 26.5h18' stroke='%23F6F1E9' stroke-width='2.4' stroke-linecap='round'/%3E%3Cpath d='M14 32h12' stroke='%23DE3B26' stroke-width='2.4' stroke-linecap='round'/%3E%3C/svg%3E",
  },
  { rel: "manifest", href: "/manifest.json" },
];

export function meta(): Route.MetaDescriptors {
  return [
    { title: TITLE },
    { name: "description", content: DESCRIPTION },
    { name: "color-scheme", content: "light dark" },
    { name: "theme-color", content: "#14150F" },
    { property: "og:title", content: TITLE },
    {
      property: "og:description",
      content:
        "Judo at Bambili Campus: weekly sessions, the Kyu–Dan pathway, and anonymised club turnout.",
    },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "UBa Judo Club" },
    { name: "twitter:card", content: "summary_large_image" },
  ];
}

// Applies the saved (or device) colour scheme before first paint. Defaults to dark.
const THEME_SCRIPT = `(function(){try{var s=localStorage.getItem('uba-theme');var d=s?s==='dark':true;document.documentElement.classList.toggle('dark',d);document.documentElement.style.colorScheme=d?'dark':'light';}catch(e){}})();`;

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: "dark" }} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  // One client per request on the server, one per session in the browser.
  const [queryClient] = useState(createQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Outlet />
        <Toaster position="top-center" />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
