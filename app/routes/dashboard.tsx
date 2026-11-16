import { useState } from "react";
import { Link } from "react-router";
import { Loader2, ClipboardCheck, Users, Activity, Inbox } from "lucide-react";
import { api } from "@/lib/api/client";
import { useAuth } from "@/lib/auth/AuthContext";
import { useCoachData } from "@/lib/hooks/useCoachData";
import CoachHeader from "@/components/coach/CoachHeader";
import CheckInPanel from "@/components/coach/CheckInPanel";
import WrapUpPanel from "@/components/coach/WrapUpPanel";
import AthletesPanel from "@/components/coach/AthletesPanel";
import PromoteDialog from "@/components/coach/PromoteDialog";
import AddMemberDialog from "@/components/coach/AddMemberDialog";
import RequestsPanel from "@/components/coach/RequestsPanel";
import { focusForDate, todayISO } from "@/lib/data/coach";
import type {
  AttendanceRecord,
  Member,
  NewMemberInput,
  Rank,
  TrainingSession,
} from "@/lib/types";
import { cn } from "@/lib/utils";

const TABS = [
  { key: "checkin", label: "Check-in", icon: ClipboardCheck },
  { key: "wrapup", label: "Session wrap-up", icon: Activity },
  { key: "athletes", label: "Athletes", icon: Users },
  { key: "requests", label: "Requests", icon: Inbox },
] as const;

type TabKey = (typeof TABS)[number]["key"];

const Dashboard = () => {
  const { user } = useAuth();
  const { members, sessions, attendance, loading, reload } = useCoachData();
  const [tab, setTab] = useState<TabKey>("checkin");
  const [sessionDate, setSessionDate] = useState(todayISO());
  const [busyId, setBusyId] = useState<string | null>(null);
  const [promoteTarget, setPromoteTarget] = useState<Member | null>(null);
  const [adding, setAdding] = useState(false);

  const session = sessions.find((s) => s.session_date === sessionDate) ?? null;
  const checkedIn = attendance.filter((a) => a.session_date === sessionDate);

  const checkIn = async (member: Member) => {
    setBusyId(member.id);
    try {
      const active: TrainingSession =
        session ??
        ((await api.entities.TrainingSession.create({
          session_date: sessionDate,
          focus: focusForDate(sessionDate),
          attended_count: 0,
        })) as TrainingSession);
      await api.entities.Attendance.create({
        session_id: active.id,
        member_id: member.id,
        member_name: member.full_name,
        session_date: sessionDate,
      });
      await api.entities.Member.update(member.id, {
        sessions_total: (member.sessions_total ?? 0) + 1,
        sessions_since_promotion: (member.sessions_since_promotion ?? 0) + 1,
        last_attended: sessionDate,
      });
      const nextCount =
        attendance.filter((a) => a.session_id === active.id).length + 1;
      await api.entities.TrainingSession.update(active.id, {
        attended_count: nextCount,
      });
      await reload();
    } finally {
      setBusyId(null);
    }
  };

  const undo = async (record: AttendanceRecord) => {
    const member = members.find((m) => m.id === record.member_id);
    setBusyId(record.member_id);
    try {
      await api.entities.Attendance.delete(record.id);
      if (member) {
        await api.entities.Member.update(member.id, {
          sessions_total: Math.max((member.sessions_total ?? 1) - 1, 0),
          sessions_since_promotion: Math.max(
            (member.sessions_since_promotion ?? 1) - 1,
            0,
          ),
        });
      }
      const nextCount =
        attendance.filter((a) => a.session_id === record.session_id).length - 1;
      await api.entities.TrainingSession.update(record.session_id, {
        attended_count: Math.max(nextCount, 0),
      });
      await reload();
    } finally {
      setBusyId(null);
    }
  };

  const promote = async (toRank: Rank, note: string) => {
    if (!promoteTarget) return;
    await api.entities.Promotion.create({
      member_id: promoteTarget.id,
      member_name: promoteTarget.full_name,
      from_rank: promoteTarget.belt_rank,
      to_rank: toRank,
      promoted_on: todayISO(),
      sessions_at_promotion: promoteTarget.sessions_since_promotion ?? 0,
      note,
    });
    await api.entities.Member.update(promoteTarget.id, {
      belt_rank: toRank,
      sessions_since_promotion: 0,
      last_promotion_date: todayISO(),
    });
    await reload();
  };

  const addMember = async (input: NewMemberInput) => {
    await api.entities.Member.create({
      ...input,
      status: "active",
      joined_on: todayISO(),
      sessions_total: 0,
      sessions_since_promotion: 0,
    });
    await reload();
  };

  if (user && user.role !== "admin") {
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
            This console holds member records, so it is limited to the coaching
            team. Ask a club admin to grant you access.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex rounded-full bg-ink px-5 py-2.5 text-[13px] font-semibold text-paper">
            Back to the club site
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <CoachHeader
        email={user?.email}
        onSignOut={() => api.auth.logout("/")}
      />

      <div className="mx-auto max-w-6xl px-5 py-8 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-[clamp(1.7rem,3vw,2.3rem)] font-semibold leading-none tracking-[-0.03em]">
              Mat desk
            </h1>
            <p className="mt-2 text-[13px] text-muted-foreground">
              Bambili Multi-Purpose Sports Hall · {sessionDate}
            </p>
          </div>
          <div className="flex rounded-full border border-ink/15 bg-card p-1">
            {TABS.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setTab(t.key)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[12px] font-medium transition-colors",
                    tab === t.key
                      ? "bg-ink text-paper"
                      : "text-muted-foreground hover:text-foreground",
                  )}>
                  <Icon className="h-3.5 w-3.5" />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8">
          {loading ? (
            <div className="flex items-center gap-3 rounded-lg border border-ink/12 bg-card px-6 py-16 text-[13px] text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading the register…
            </div>
          ) : tab === "checkin" ? (
            <CheckInPanel
              members={members}
              checkedIn={checkedIn}
              sessionDate={sessionDate}
              onDateChange={setSessionDate}
              busyId={busyId}
              onCheckIn={checkIn}
              onUndo={undo}
            />
          ) : tab === "wrapup" ? (
            <WrapUpPanel
              members={members}
              sessions={sessions}
              attendance={attendance}
              sessionDate={sessionDate}
            />
          ) : tab === "athletes" ? (
            <AthletesPanel
              members={members}
              onPromote={setPromoteTarget}
              onAdd={() => setAdding(true)}
            />
          ) : (
            <RequestsPanel />
          )}
        </div>
      </div>

      <PromoteDialog
        member={promoteTarget}
        onClose={() => setPromoteTarget(null)}
        onSubmit={promote}
      />
      <AddMemberDialog
        open={adding}
        onClose={() => setAdding(false)}
        onSubmit={addMember}
      />
    </div>
  );
};

export default Dashboard;
