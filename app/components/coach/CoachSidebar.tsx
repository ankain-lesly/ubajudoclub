import { Link } from "react-router";
import {
  ClipboardCheck,
  Calendar,
  Activity,
  Users,
  Inbox,
  LogOut,
  ArrowUpRight,
  ShieldCheck,
  Plus,
  Clock,
} from "lucide-react";
import ClubMark from "@/components/visual/ClubMark";
import { Button } from "@/components/ui/button";
import type { TrainingSession } from "@/lib/types";
import { shortDate } from "@/lib/data/coach";

export type DashboardTab = "checkin" | "sessions" | "wrapup" | "athletes" | "requests";

interface CoachSidebarProps {
  currentTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  email?: string;
  role?: string;
  onSignOut: () => void;
  activeSession: TrainingSession | null;
  totalMembersCount: number;
  totalSessionsCount: number;
  checkedInCount: number;
  onScheduleNew: () => void;
  onCloseMobileDrawer?: () => void;
}

export function CoachSidebar({
  currentTab,
  onTabChange,
  email,
  role = "admin",
  onSignOut,
  activeSession,
  totalMembersCount,
  totalSessionsCount,
  checkedInCount,
  onScheduleNew,
  onCloseMobileDrawer,
}: CoachSidebarProps) {
  const handleNav = (tab: DashboardTab) => {
    onTabChange(tab);
    onCloseMobileDrawer?.();
  };

  const navGroups = [
    {
      title: "Mat Operations",
      items: [
        {
          key: "checkin" as DashboardTab,
          label: "Mat Check-in",
          icon: ClipboardCheck,
          badge: checkedInCount > 0 ? `${checkedInCount} on mat` : undefined,
          badgeColor: "bg-primary/10 text-primary",
        },
        {
          key: "sessions" as DashboardTab,
          label: "Training Sessions",
          icon: Calendar,
          badge: totalSessionsCount > 0 ? String(totalSessionsCount) : undefined,
          badgeColor: "bg-secondary text-muted-foreground",
        },
        {
          key: "wrapup" as DashboardTab,
          label: "Turnout & Media",
          icon: Activity,
          badge: (activeSession?.media || []).length > 0 ? `${activeSession?.media?.length} files` : undefined,
          badgeColor: "bg-secondary text-muted-foreground",
        },
      ],
    },
    {
      title: "Club Management",
      items: [
        {
          key: "athletes" as DashboardTab,
          label: "Athletes Ledger",
          icon: Users,
          badge: totalMembersCount > 0 ? String(totalMembersCount) : undefined,
          badgeColor: "bg-secondary text-muted-foreground",
        },
        {
          key: "requests" as DashboardTab,
          label: "Join Requests",
          icon: Inbox,
        },
      ],
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
        {navGroups.map((group) => (
          <div key={group.title} className="space-y-1.5">
            <p className="px-3 font-mono text-[9px] uppercase tracking-[0.24em] text-white/40">
              {group.title}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = currentTab === item.key;
                const Icon = item.icon;

                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => handleNav(item.key)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-xs font-medium transition-all ${
                      isActive
                        ? "bg-white/12 text-white shadow-xs"
                        : "text-white/70 hover:bg-white/6 hover:text-white"
                    }`}
                  >
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
                  </button>
                );
              })}
            </div>
          </div>
        ))}

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
                : "Bambili Hall"}
            </p>
          </div>

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
