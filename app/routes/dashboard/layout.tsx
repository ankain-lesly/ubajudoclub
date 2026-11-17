import { useState } from "react";
import { Link, Outlet } from "react-router";
import { Menu, Plus, Globe, ArrowUpRight } from "lucide-react";
import { api } from "@/lib/api/client";
import { useAuth } from "@/lib/auth/AuthContext";
import { useDashboardOverviewQuery } from "@/lib/api/dashboard.queries";
import { CoachSidebar } from "@/components/coach/CoachSidebar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SessionSheet } from "@/components/coach/SessionSheet";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { useMembersQuery } from "@/lib/api/member.queries";
import { useSaveSessionMutation } from "@/lib/api/session.queries";

export default function DashboardLayout() {
  const { user } = useAuth();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [sessionSheetOpen, setSessionSheetOpen] = useState(false);

  const { data: overview } = useDashboardOverviewQuery();
  const { data: members = [] } = useMembersQuery();
  const saveSessionMutation = useSaveSessionMutation();

  // Role access check: only coach and admin permitted
  if (user && user.role !== "admin" && user.role !== "coach") {
    return (
      <div className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-5 py-20">
        <div className="rounded-lg border border-ink/12 bg-card p-8">
          <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-primary">
            Restricted
          </p>
          <h1 className="mt-4 font-display text-2xl font-semibold tracking-[-0.02em]">
            Coach access only
          </h1>
          <p className="mt-3 text-[13.5px] leading-relaxed text-muted-foreground">
            This console holds member records and attendance, so it is limited to the coaching team.
            Ask a club admin to grant you access.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex rounded-full bg-ink px-5 py-2.5 text-[13px] font-semibold text-paper"
          >
            Back to the club site
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:z-30 lg:flex lg:w-64 lg:flex-col">
        <CoachSidebar
          email={user?.email}
          role={user?.role}
          onSignOut={() => api.auth.logout("/")}
          activeSession={overview?.todaySession ?? overview?.nextSession}
          totalMembersCount={overview?.totalMembersCount}
          totalSessionsCount={overview?.totalSessionsCount}
          pendingRequestsCount={overview?.pendingRequestsCount}
          onScheduleNew={() => setSessionSheetOpen(true)}
        />
      </aside>

      {/* Mobile Drawer */}
      <Sheet open={mobileDrawerOpen} onOpenChange={setMobileDrawerOpen}>
        <SheetContent side="left" className="p-0 w-72 bg-band border-r border-ink/20">
          <CoachSidebar
            email={user?.email}
            role={user?.role}
            onSignOut={() => api.auth.logout("/")}
            activeSession={overview?.todaySession ?? overview?.nextSession}
            totalMembersCount={overview?.totalMembersCount}
            totalSessionsCount={overview?.totalSessionsCount}
            pendingRequestsCount={overview?.pendingRequestsCount}
            onScheduleNew={() => setSessionSheetOpen(true)}
            onCloseMobileDrawer={() => setMobileDrawerOpen(false)}
          />
        </SheetContent>
      </Sheet>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0 lg:pl-64">
        {/* Unified Dashboard Header Bar */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-ink/10 bg-card/90 px-4 backdrop-blur-md sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            {/* Mobile Sidebar Hamburger */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setMobileDrawerOpen(true)}
              className="h-9 w-9 text-foreground lg:hidden"
              aria-label="Open sidebar menu"
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Header Titles & Dojo Context */}
            <div className="flex items-center gap-3">
              <span className="font-display text-sm sm:text-base font-semibold tracking-tight text-foreground">
                Coach Console
              </span>
              <span className="hidden h-4 w-px bg-ink/15 sm:inline-block" />
              <div className="hidden sm:flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  UBa Campus Amphi 100
                </span>
              </div>
            </div>
          </div>

          {/* Right Header Controls & Quick Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Public Site Link */}
            <Link
              to="/"
              className="hidden items-center gap-1.5 rounded-full border border-ink/12 bg-background/60 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:inline-flex"
              title="Open Public Club Site"
            >
              <Globe className="h-3.5 w-3.5" />
              <span>Public Site</span>
              <ArrowUpRight className="h-3 w-3 opacity-60" />
            </Link>

            {/* Dark / Light Mode Toggle */}
            <ThemeToggle className="h-8 w-8 p-0 grid place-items-center rounded-full border-ink/15" />

            {/* New Session CTA */}
            <Button
              type="button"
              size="sm"
              onClick={() => setSessionSheetOpen(true)}
              className="h-8 gap-1.5 rounded-full bg-primary px-3 text-xs font-semibold text-white shadow-xs hover:bg-primary/90"
            >
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Schedule Session</span>
              <span className="sm:hidden">Session</span>
            </Button>

            {/* Coach User Chip */}
            {user && (
              <div className="hidden items-center gap-2 border-l border-ink/10 pl-3 md:flex">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary font-mono">
                  {user.email?.charAt(0).toUpperCase() || "C"}
                </span>
                <div className="flex flex-col text-left">
                  <span className="max-w-[130px] truncate font-mono text-[11px] font-medium text-foreground">
                    {user.email}
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-primary">
                    {user.role || "Coach"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Dynamic Nested Route View */}
        <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>

      {/* Global Quick-Schedule Session Sheet */}
      <SessionSheet
        open={sessionSheetOpen}
        session={null}
        members={members}
        onClose={() => setSessionSheetOpen(false)}
        onSave={async (data) => {
          await saveSessionMutation.mutateAsync(data);
          setSessionSheetOpen(false);
        }}
      />
    </div>
  );
}
