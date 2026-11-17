import { useState } from "react";
import { Link } from "react-router";
import {
  Users,
  Activity,
  Calendar,
  Inbox,
  ArrowRight,
  Clock,
  Sparkles,
  ChevronRight,
  Plus,
} from "lucide-react";
import MetricCard from "@/components/coach/MetricCard";
import { Button } from "@/components/ui/button";
import {
  useMembersQuery,
} from "@/lib/api/member.queries";
import { shortDate } from "@/lib/data/coach";
import { SessionSheet } from "@/components/coach/SessionSheet";
import { useDashboardOverviewQuery } from "@/lib/api/dashboard.queries";
import { useSaveSessionMutation } from "@/lib/api/session.queries";

export default function DashboardOverviewRoute() {
  const { data: overview, isLoading } = useDashboardOverviewQuery();
  const { data: members = [] } = useMembersQuery();
  const saveSessionMutation = useSaveSessionMutation();
  const [sessionSheetOpen, setSessionSheetOpen] = useState(false);

  const activeSession = overview?.todaySession ?? overview?.nextSession;

  return (
    <div className="space-y-8">
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-muted-foreground">
              Dojo Command Cockpit
            </p>
          </div>
          <h1 className="mt-1 font-display text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-foreground">
            Overview & Operations
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            onClick={() => setSessionSheetOpen(true)}
            className="gap-2 bg-primary text-white hover:bg-primary/90 text-xs shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Schedule Session</span>
          </Button>
        </div>
      </div>

      {/* Hero: Active or Next Mat Session */}
      <div className="overflow-hidden rounded-xl border border-ink/15 bg-card p-6 shadow-xs relative">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-linear-to-l from-primary/5 to-transparent pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 font-mono text-[10px] font-medium text-primary">
                <Clock className="h-3 w-3" />
                {overview?.todaySession ? "Live Mat Today" : "Next Scheduled Practice"}
              </span>
              {activeSession && (
                <span className="font-mono text-xs text-muted-foreground">
                  {shortDate(
                    activeSession.session_date ||
                      (activeSession.start_time
                        ? activeSession.start_time.split("T")[0]
                        : "")
                  )}
                </span>
              )}
            </div>

            <h2 className="font-display text-xl sm:text-2xl font-semibold text-foreground">
              {activeSession?.focus || "Open Mat Randori & Technique Drills"}
            </h2>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {activeSession?.notes ||
                "Official training session of the University of Bamenda Judo Club. Mat readiness, attendance check-in, and technique review."}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {activeSession ? (
              <Link
                to={`/dashboard/sessions/${activeSession.id}`}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-primary/90 transition-all"
              >
                <span>Enter Mat Desk</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <Button
                type="button"
                onClick={() => setSessionSheetOpen(true)}
                className="gap-2 bg-primary text-white text-xs"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Schedule Today's Mat</span>
              </Button>
            )}

            <Link
              to="/dashboard/sessions"
              className="inline-flex items-center gap-1.5 rounded-lg border border-ink/15 bg-secondary/50 px-4 py-2.5 text-xs font-medium text-foreground hover:bg-secondary transition-all"
            >
              <span>All Sessions</span>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard
          label="Active Athletes"
          value={isLoading ? "..." : (overview?.activeMembersCount ?? 0)}
          hint="Registered judoka on roster"
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        />
        <MetricCard
          label="Avg Turnout"
          value={isLoading ? "..." : `${overview?.avgTurnout ?? 0}`}
          hint="Athletes per session (last 6)"
          tone="good"
          icon={<Activity className="h-4 w-4 text-accent" />}
        />
        <MetricCard
          label="Practices Run"
          value={isLoading ? "..." : (overview?.totalSessionsCount ?? 0)}
          hint="Completed & scheduled"
          icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
        />
        <MetricCard
          label="Pending Inquiries"
          value={isLoading ? "..." : (overview?.pendingRequestsCount ?? 0)}
          hint="Prospects awaiting review"
          tone={overview?.pendingRequestsCount ? "warn" : "default"}
          icon={<Inbox className="h-4 w-4 text-primary" />}
        />
      </div>

      {/* Two Column Section: Recent Sessions & Quick Pipelines */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Sessions */}
        <div className="rounded-xl border border-ink/12 bg-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-ink/8 pb-3">
            <h3 className="font-display text-sm font-semibold text-foreground">
              Recent Training Sessions
            </h3>
            <Link
              to="/dashboard/sessions"
              className="font-mono text-[10px] text-primary hover:underline flex items-center gap-1"
            >
              <span>View Ledger</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="space-y-2">
            {(overview?.recentSessions ?? []).length === 0 ? (
              <p className="py-6 text-center text-xs text-muted-foreground">
                No recent sessions found.
              </p>
            ) : (
              overview?.recentSessions.map((session) => (
                <Link
                  key={session.id}
                  to={`/dashboard/sessions/${session.id}`}
                  className="flex items-center justify-between rounded-lg border border-ink/6 p-3 hover:border-ink/20 hover:bg-secondary/40 transition-all group"
                >
                  <div className="min-w-0 pr-3">
                    <p className="truncate text-xs font-medium text-foreground group-hover:text-primary transition-colors">
                      {session.focus || "Open Practice"}
                    </p>
                    <p className="font-mono text-[10px] text-muted-foreground mt-0.5">
                      {shortDate(
                        session.session_date ||
                          (session.start_time ? session.start_time.split("T")[0] : "")
                      )}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {session.attended_count ?? 0} judoka
                    </span>
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Dojo Athletes Quick Snapshot */}
        <div className="rounded-xl border border-ink/12 bg-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-ink/8 pb-3">
            <h3 className="font-display text-sm font-semibold text-foreground">
              Athletes Roster Snapshot
            </h3>
            <Link
              to="/dashboard/athletes"
              className="font-mono text-[10px] text-primary hover:underline flex items-center gap-1"
            >
              <span>View Athletes</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="space-y-2">
            {(overview?.recentMembers ?? []).length === 0 ? (
              <p className="py-6 text-center text-xs text-muted-foreground">
                No athletes registered yet.
              </p>
            ) : (
              overview?.recentMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between rounded-lg border border-ink/6 p-3"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-foreground">
                      {member.full_name}
                    </p>
                    <p className="font-mono text-[10px] text-muted-foreground">
                      {member.matricule || "No matricule"}
                      {member.program ? ` · ${member.program}` : ""}
                    </p>
                  </div>

                  <span className="rounded bg-secondary px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                    {member.belt_rank || "White"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Global Session Sheet */}
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
