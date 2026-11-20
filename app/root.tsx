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
  "The University of Bamenda judo club at UBa Campus Amphi 100. Monday morning training starting at 8:00 AM, weekly evening and weekend sessions, a clear Kyu–Dan belt pathway, and open turnout metrics.";

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
    href: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Crect width='48' height='48' rx='10' fill='%2314150F'/%3E%3Cpath d='M14 39l4-9.5 4 9.5' stroke='%23F6F1E9' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M17 19c-2 2-3 5-2.5 9 1 1 3.5 1.5 6.5 1 2-.5 2.5-2 2-4-.5-3-2.5-5.5-6-6z' fill='%23F6F1E9'/%3E%3Ccircle cx='17' cy='14' r='3.2' fill='%23F6F1E9'/%3E%3Ccircle cx='33' cy='13.5' r='3.2' fill='%232563EB'/%3E%3Cpath d='M34.5 17.5C33 21.5 28.5 25 21.5 24.5C23.5 22 28 19 32.5 17z' fill='%231D4ED8'/%3E%3Cpath d='M21.5 24.5C24.5 22.5 30.5 19 37.5 18.5c2 0 4 1.5 3 3.5-3 3-10 4.5-16.5 4z' fill='%232563EB'/%3E%3Cpath d='M19 25.5c5-1 11-2 16.5 0 2 1 3.5 3 2.5 4.5-1.5 1.5-4 0-6-1.5-4.5-2.5-10-3-14-2.5' stroke='%23DE3B26' stroke-width='2.4' stroke-linecap='round'/%3E%3C/svg%3E",
  },
  { rel: "manifest", href: "/manifest.json" },
];

export function meta(): Route.MetaDescriptors {

  const content =
    "Judo at UBa Campus Amphi 100: weekly sessions with Monday morning start at 8:00 AM, the Kyu–Dan pathway, and anonymised club turnout.";

  return [
    { title: TITLE },
    { name: "description", content: DESCRIPTION },
    { name: "color-scheme", content: "light dark" },
    { name: "theme-color", content: "#14150F" },
    { property: "og:title", content: TITLE },
    {
      property: "og:description",
      content:
        "Judo at UBa Campus Amphi 100: weekly sessions with Monday morning start at 8:00 AM, the Kyu–Dan pathway, and anonymised club turnout.",
    },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "UBa Judo Club" },
    { name: "twitter:card", content: "summary_large_image" },
    { property: "og:image", content: "/images/ubajudo-banner.jpg" },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:type", content: "image/jpeg" },
    {
      property: "og:image:alt",
      content,
    },
    { name: "twitter:image" },
  ];
}

// Applies the saved (or device) colour scheme before first paint. Defaults to dark.
const THEME_SCRIPT = `(function(){try{var s=localStorage.getItem('uba-theme');var d=s?s==='dark':true;document.documentElement.classList.toggle('dark',d);document.documentElement.style.colorScheme=d?'dark':'light';}catch(e){}})();`;

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className="dark"
      style={{ colorScheme: "dark" }}
      suppressHydrationWarning>
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
