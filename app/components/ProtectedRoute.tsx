import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "@/lib/auth/AuthContext";

/**
 * Layout route that guards its children.
 * TODO: client-side only skeleton. Move to a server session check in a
 * loader (redirect("/login")) once a real backend/session exists.
 */
export default function ProtectedRoute() {
  const { isAuthenticated, isLoadingAuth, authChecked } = useAuth();
  const location = useLocation();

  if (isLoadingAuth || !authChecked) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-foreground" />
      </div>
    );
  }

  if (!isAuthenticated) {
    const returnTo = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?returnTo=${returnTo}`} replace />;
  }

  return <Outlet />;
}
