import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  // Public site: header/footer shell
  layout("components/site/SiteLayout.tsx", [
    index("routes/home.tsx"),
    route("events", "routes/events.tsx"),
    route("events/:id", "routes/event.$id.tsx"),
    route("calendar", "routes/calendar.tsx"),
    route("schedule", "routes/schedule.tsx"),
    route("sessions", "routes/sessions.tsx"),
    route("sessions/:id", "routes/session.$id.tsx"),
    route("members", "routes/members.tsx"),
    route("belts", "routes/belts.tsx"),
    route("gallery", "routes/gallery.tsx"),
    route("join", "routes/join.tsx"),

    // Coach area: guarded
    layout("components/ProtectedRoute.tsx", [
      route("dashboard", "routes/dashboard.tsx"),
    ]),
  ]),

  // Auth screens: standalone layout
  route("login", "routes/login.tsx"),
  route("register", "routes/register.tsx"),
  route("forgot-password", "routes/forgot-password.tsx"),
  route("password-reset", "routes/password-reset.tsx"),

  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
