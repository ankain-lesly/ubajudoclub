import { Link, NavLink, useLocation } from "react-router";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Inbox,
  LogOut,
  ArrowUpRight,
  ShieldCheck,
  Plus,
  Clock,
  Globe,
} from "lucide-react";
import ClubMark from "@/components/visual/ClubMark";
import { Button } from "@/components/ui/button";
import type { TrainingSession } from "@/lib/types";
import { shortDate } from "@/lib/data/coach";

interface CoachSidebarProps {
  email?: string;
  role?: string;
  onSignOut: () => void;
  activeSession?: TrainingSession | null;
  totalMembersCount?: number;
  totalSessionsCount?: number;
  pendingRequestsCount?: number;
  onScheduleNew?: () => void;
  onCloseMobileDrawer?: () => void;
}

export function CoachSidebar({
  email,
  role = "admin",
  onSignOut,
  activeSession,
  totalMembersCount,
  totalSessionsCount,
  pendingRequestsCount,
  onScheduleNew,
  onCloseMobileDrawer,
}: CoachSidebarProps) {
  const location = useLocation();

  const navItems = [
    {
      to: "/dashboard",
      end: true,
      label: "Overview",
      icon: LayoutDashboard,
    },
    {
      to: "/dashboard/sessions",
      end: false,
      label: "Sessions",
      icon: Calendar,
      badge:
        typeof totalSessionsCount === "number" && totalSessionsCount > 0
          ? String(totalSessionsCount)
          : undefined,
      badgeColor: "bg-white/10 text-white/80",
    },
    {
      to: "/dashboard/athletes",
      end: false,
      label: "Athletes Ledger",
      icon: Users,
      badge:
        typeof totalMembersCount === "number" && totalMembersCount > 0
          ? String(totalMembersCount)
          : undefined,
      badgeColor: "bg-white/10 text-white/80",
    },
    {
      to: "/dashboard/requests",
      end: false,
      label: "Join Requests",
      icon: Inbox,
      badge:
        typeof pendingRequestsCount === "number" && pendingRequestsCount > 0
          ? String(pendingRequestsCount)
          : undefined,
      badgeColor: "bg-primary text-white",
    },
  ];

  return (
    <div className="flex h-full w-full flex-col justify-between bg-band text-band-foreground border-r border-ink/15">
      {/* Top Brand Section */}
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <ClubMark className="h-9 w-9" inverted />
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-[15px] font-semibold leading-tight tracking-[-0.01em] text-white">
              UBa Judo Club
            </h1>
            <div className="mt-1 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/50">
                Coach Console
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
        <div className="space-y-1.5">
          <p className="px-3 font-mono text-[9px] uppercase tracking-[0.24em] text-white/40">
            Dojo Operations
          </p>
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => onCloseMobileDrawer?.()}
                  className={({ isActive }) =>
                    `flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-xs font-medium transition-all ${
                      isActive
                        ? "bg-white/12 text-white shadow-xs"
                        : "text-white/70 hover:bg-white/6 hover:text-white"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon
                          className={`h-4 w-4 shrink-0 ${
                            isActive ? "text-primary" : "text-white/60"
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>

                      {item.badge && (
                        <span
                          className={`rounded-full px-2 py-0.5 font-mono text-[9px] font-medium ${item.badgeColor}`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Public Website Bridge */}
        <div className="space-y-1.5">
          <p className="px-3 font-mono text-[9px] uppercase tracking-[0.24em] text-white/40">
            Club Public Site
          </p>
          <Link
            to="/"
            onClick={() => onCloseMobileDrawer?.()}
            className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-white/70 hover:bg-white/6 hover:text-white transition-all"
          >
            <div className="flex items-center gap-2.5">
              <Globe className="h-4 w-4 text-white/50" />
              <span>Public Website</span>
            </div>
            <ArrowUpRight className="h-3.5 w-3.5 text-white/40" />
          </Link>
        </div>

        {/* Active Session Mini Card */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-white/50">
              <Clock className="h-3 w-3 text-primary" />
              <span>Active Mat Session</span>
            </div>
            {activeSession && (
              <span className="rounded bg-primary/20 px-1.5 py-0.5 font-mono text-[8.5px] uppercase tracking-wider text-primary">
                Live
              </span>
            )}
          </div>

          <div>
            <p className="font-display text-xs font-medium text-white truncate">
              {activeSession ? (activeSession.focus || "Open Mat Training") : "No session scheduled today"}
            </p>
            <p className="font-mono text-[10px] text-white/60">
              {activeSession
                ? shortDate(activeSession.session_date || (activeSession.start_time ? activeSession.start_time.split("T")[0] : ""))
                : "UBa Campus Amphi 100"}
            </p>
          </div>

          {activeSession ? (
            <Link
              to={`/dashboard/sessions/${activeSession.id}`}
              onClick={() => onCloseMobileDrawer?.()}
              className="inline-flex items-center justify-center w-full h-7 gap-1 rounded bg-primary text-white text-[11px] font-medium hover:bg-primary/90 transition-colors"
            >
              Enter Mat Desk
            </Link>
          ) : (
            onScheduleNew && (
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  onScheduleNew();
                  onCloseMobileDrawer?.();
                }}
                className="w-full h-7 gap-1 bg-white/10 text-white text-[11px] hover:bg-white/20 shadow-none border border-white/10"
              >
                <Plus className="h-3 w-3" />
                Schedule Session
              </Button>
            )
          )}
        </div>
      </div>

      {/* Footer / Account Section */}
      <div className="border-t border-white/10 p-3.5 space-y-3">
        <div className="flex items-center justify-between px-1.5">
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-white">
              {email || "Coach Account"}
            </p>
            <div className="mt-0.5 flex items-center gap-1 text-[10px] text-white/50">
              <ShieldCheck className="h-3 w-3 text-primary" />
              <span className="capitalize">{role}</span>
            </div>
          </div>

          <Link
            to="/"
            className="flex h-7 w-7 items-center justify-center rounded-md border border-white/10 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
            title="Open Public Site"
          >
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <button
          type="button"
          onClick={onSignOut}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-white/6 px-3 py-2 text-xs font-medium text-white/75 transition-colors hover:bg-white/12 hover:text-white"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Sign out</span>
        </button>
      </div>
    </div>
  );
}
