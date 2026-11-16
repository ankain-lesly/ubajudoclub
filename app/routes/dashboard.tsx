import { useState } from "react";
import { Link } from "react-router";
import { Loader2, ClipboardCheck, Users, Activity, Inbox, Plus, Calendar } from "lucide-react";
import { api } from "@/lib/api/client";
import { useAuth } from "@/lib/auth/AuthContext";
import { useCoachData } from "@/lib/hooks/useCoachData";
import CoachHeader from "@/components/coach/CoachHeader";
import CheckInPanel from "@/components/coach/CheckInPanel";
import WrapUpPanel from "@/components/coach/WrapUpPanel";
import AthletesPanel from "@/components/coach/AthletesPanel";
import PromoteDialog from "@/components/coach/PromoteDialog";
import { MemberSheet } from "@/components/coach/MemberSheet";
import { SessionSheet } from "@/components/coach/SessionSheet";
import RequestsPanel from "@/components/coach/RequestsPanel";
import { focusForDate, todayISO } from "@/lib/data/coach";
import { uploadMultipleSessionMedia } from "@/lib/supabase/storage";
import type {
  AttendanceRecord,
  Member,
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

  // Sheets and dialogs state
  const [memberSheetOpen, setMemberSheetOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [sessionSheetOpen, setSessionSheetOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<TrainingSession | null>(null);
  const [promoteTarget, setPromoteTarget] = useState<Member | null>(null);

  const session = sessions.find((s) => s.session_date === sessionDate) ?? null;
  const checkedIn = attendance.filter((a) => {
    if (session) return a.session_id === session.id;
    return a.session_date === sessionDate;
  });

  // Check-in: normalized insertion into attendances
  const checkIn = async (member: Member) => {
    setBusyId(member.id);
    try {
      const active: TrainingSession =
        session ??
        ((await api.entities.TrainingSession.create({
          start_time: new Date(`${sessionDate}T17:00:00Z`).toISOString(),
          focus: focusForDate(sessionDate),
        })) as TrainingSession);

      await api.entities.Attendance.create({
        session_id: active.id,
        member_id: member.id,
      });

      await reload();
    } finally {
      setBusyId(null);
    }
  };

  // Undo check-in: normalized deletion with zero counter drift
  const undo = async (record: AttendanceRecord) => {
    setBusyId(record.member_id);
    try {
      await api.entities.Attendance.delete(record.id);
      await reload();
    } finally {
      setBusyId(null);
    }
  };

  // Belt promotion: updates current belt directly
  const promote = async (toRank: Rank, _note?: string) => {
    if (!promoteTarget) return;
    await api.entities.Member.update(promoteTarget.id, {
      belt_rank: toRank,
      current_belt: toRank.toUpperCase(),
      belt_awarded_date: todayISO(),
    });
    await reload();
  };

  // Save / Update member via Shadcn Sheet
  const handleSaveMember = async (data: Partial<Member>) => {
    if (editingMember?.id) {
      await api.entities.Member.update(editingMember.id, data);
    } else {
      await api.entities.Member.create({
        ...data,
        status: data.status || "active",
        joined_on: data.joined_on || todayISO(),
      });
    }
    await reload();
  };

  // Save / Update session, coordinators, and staged media via Shadcn Sheet
  const handleSaveSession = async ({
    start_time,
    end_time,
    focus,
    notes,
    coordinatorIds,
    stagedFiles,
  }: {
    start_time: string;
    end_time: string | null;
    focus: string;
    notes: string;
    coordinatorIds: string[];
    stagedFiles?: File[];
  }) => {
    let activeSessionId = editingSession?.id;

    if (activeSessionId) {
      await api.entities.TrainingSession.update(activeSessionId, {
        start_time,
        end_time,
        focus,
        notes,
      });
    } else {
      const created = await api.entities.TrainingSession.create({
        start_time,
        end_time,
        focus,
        notes,
      });
      activeSessionId = created.id;
    }

    // Synchronize coordinators in session_coordinators
    if (activeSessionId) {
      // Remove previous coordinators for this session
      const existing = await api.entities.SessionCoordinator.filter({ session_id: activeSessionId });
      for (const item of existing.items) {
        await api.entities.SessionCoordinator.delete(item.id);
      }
      // Insert selected coordinators
      for (const memberId of coordinatorIds) {
        await api.entities.SessionCoordinator.create({
          session_id: activeSessionId,
          member_id: memberId,
          role: "Coordinator",
        });
      }

      // If files were staged when scheduling a new session, upload them directly to Supabase storage
      if (stagedFiles && stagedFiles.length > 0) {
        await uploadMultipleSessionMedia(activeSessionId, stagedFiles);
      }
    }

    await reload();
  };

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
            This console holds member records and attendance, so it is limited to the coaching
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
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setEditingSession(session);
                setSessionSheetOpen(true);
              }}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-card px-3.5 py-2 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:border-ink/30 transition-colors"
            >
              <Calendar className="w-3.5 h-3.5 text-primary" />
              {session ? "Edit Session" : "Schedule Session"}
            </button>
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
              activeSession={session}
              onOpenSessionSheet={() => {
                setEditingSession(session);
                setSessionSheetOpen(true);
              }}
            />
          ) : tab === "wrapup" ? (
            <WrapUpPanel
              members={members}
              sessions={sessions}
              attendance={attendance}
              sessionDate={sessionDate}
              onMediaChanged={reload}
              onEditSession={(s) => {
                setEditingSession(s);
                setSessionSheetOpen(true);
              }}
            />
          ) : tab === "athletes" ? (
            <AthletesPanel
              members={members}
              onPromote={setPromoteTarget}
              onAdd={() => {
                setEditingMember(null);
                setMemberSheetOpen(true);
              }}
              onEdit={(m) => {
                setEditingMember(m);
                setMemberSheetOpen(true);
              }}
            />
          ) : (
            <RequestsPanel />
          )}
        </div>
      </div>

      {/* Slide-out Sheets for Members and Sessions */}
      <MemberSheet
        open={memberSheetOpen}
        member={editingMember}
        onClose={() => {
          setMemberSheetOpen(false);
          setEditingMember(null);
        }}
        onSave={handleSaveMember}
      />

      <SessionSheet
        open={sessionSheetOpen}
        session={editingSession}
        members={members}
        onClose={() => {
          setSessionSheetOpen(false);
          setEditingSession(null);
        }}
        onSave={handleSaveSession}
        onMediaChanged={reload}
      />

      <PromoteDialog
        member={promoteTarget}
        onClose={() => setPromoteTarget(null)}
        onSubmit={promote}
      />
    </div>
  );
};

export default Dashboard;
