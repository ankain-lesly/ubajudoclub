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
import { env } from "@/lib/env";

const TITLE = "UBa Judo Club — University of Bamenda";
const DESCRIPTION =
  "The University of Bamenda judo club at UBa Campus Amphi 100. Monday morning training starting at 8:00 AM, weekly evening and weekend sessions, a clear Kyu–Dan belt pathway, and open turnout metrics.";

export const links: Route.LinksFunction = () => [
  // { rel: "preconnect", href: "https://fonts.googleapis.com" },
  // {
  //   rel: "preconnect",
  //   href: "https://fonts.gstatic.com",
  //   crossOrigin: "anonymous",
  // },
  // {
  //   rel: "stylesheet",
  //   href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  // },
  // {
  //   rel: "icon",
  //   type: "image/png",
  //   sizes: "32x32",
  //   href: "/favicon-32x32.png",
  // },
  // {
  //   rel: "icon",
  //   type: "image/png",
  //   sizes: "16x16",
  //   href: "/favicon-16x16.png",
  // },
  // {
  //   rel: "apple-touch-icon",
  //   sizes: "180x180",
  //   href: "/apple-touch-icon.png",
  // },
  { rel: "manifest", href: "/manifest.json" },
];

export function meta(): Route.MetaDescriptors {
  const content =
    "Judo at UBa Campus Amphi 100: weekly sessions with Monday morning start at 8:00 AM, the Kyu–Dan pathway, and anonymised club turnout.";
  const ogImageUrl = `${env.siteUrl}/images/ubajudo-banner.jpg`;

  return [
    { title: TITLE },
    { name: "description", content: DESCRIPTION },
    { name: "color-scheme", content: "light dark" },
    { name: "theme-color", content: "#14150F" },
    { property: "og:title", content: TITLE },
    {
      property: "og:description",
      content,
    },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "UBa Judo Club" },
    { property: "og:image", content: ogImageUrl },
    { property: "og:image:secure_url", content: ogImageUrl },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:type", content: "image/jpeg" },
    {
      property: "og:image:alt",
      content: "UBa Judo Club — University of Bamenda Dojo & Athletes",
    },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: TITLE },
    { name: "twitter:description", content: DESCRIPTION },
    { name: "twitter:image", content: ogImageUrl },
    {
      name: "twitter:image:alt",
      content: "UBa Judo Club — University of Bamenda Dojo & Athletes",
    },
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
