import { useState } from "react";
import { Link } from "react-router";
import {
  Loader2,
  Menu,
  Plus,
  Calendar,
  ClipboardCheck,
  Activity,
  Users,
  Inbox,
} from "lucide-react";
import { api } from "@/lib/api/client";
import { useAuth } from "@/lib/auth/AuthContext";
import { useCoachData } from "@/lib/hooks/useCoachData";
import { CoachSidebar, type DashboardTab } from "@/components/coach/CoachSidebar";
import CheckInPanel from "@/components/coach/CheckInPanel";
import { SessionsPanel } from "@/components/coach/SessionsPanel";
import WrapUpPanel from "@/components/coach/WrapUpPanel";
import AthletesPanel from "@/components/coach/AthletesPanel";
import RequestsPanel from "@/components/coach/RequestsPanel";
import PromoteDialog from "@/components/coach/PromoteDialog";
import { MemberSheet } from "@/components/coach/MemberSheet";
import { SessionSheet } from "@/components/coach/SessionSheet";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { focusForDate, todayISO } from "@/lib/data/coach";
import { uploadMultipleSessionMedia } from "@/lib/supabase/storage";
import type {
  AttendanceRecord,
  Member,
  Rank,
  TrainingSession,
} from "@/lib/types";

const Dashboard = () => {
  const { user } = useAuth();
  const { members, sessions, attendance, loading, reload } = useCoachData();

  const [tab, setTab] = useState<DashboardTab>("checkin");
  const [sessionDate, setSessionDate] = useState(todayISO());
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Sheets and dialogs state
  const [memberSheetOpen, setMemberSheetOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [sessionSheetOpen, setSessionSheetOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<TrainingSession | null>(null);
  const [promoteTarget, setPromoteTarget] = useState<Member | null>(null);

  // Derive active session
  const activeSession =
    (selectedSessionId ? sessions.find((s) => s.id === selectedSessionId) : null) ??
    sessions.find((s) => s.session_date === sessionDate) ??
    sessions[0] ??
    null;

  const checkedIn = attendance.filter((a) => {
    if (activeSession) return a.session_id === activeSession.id;
    return a.session_date === sessionDate;
  });

  const handleSelectSession = (s: TrainingSession) => {
    setSelectedSessionId(s.id);
    const date = s.session_date || (s.start_time ? s.start_time.split("T")[0] : "");
    if (date) {
      setSessionDate(date);
    }
  };

  // Check-in: normalized insertion into attendances
  const checkIn = async (member: Member) => {
    setBusyId(member.id);
    try {
      const active: TrainingSession =
        activeSession ??
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
      setSelectedSessionId(created.id);
    }

    // Synchronize coordinators in session_coordinators
    if (activeSessionId) {
      const existing = await api.entities.SessionCoordinator.filter({
        session_id: activeSessionId,
      });
      for (const item of existing.items) {
        await api.entities.SessionCoordinator.delete(item.id);
      }
      for (const memberId of coordinatorIds) {
        await api.entities.SessionCoordinator.create({
          session_id: activeSessionId,
          member_id: memberId,
          role: "Coordinator",
        });
      }

      if (stagedFiles && stagedFiles.length > 0) {
        await uploadMultipleSessionMedia(activeSessionId, stagedFiles);
      }
    }

    await reload();
  };

  // Delete session handler
  const handleDeleteSession = async (sessionId: string) => {
    await api.entities.TrainingSession.delete(sessionId);
    if (selectedSessionId === sessionId) {
      setSelectedSessionId(null);
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
          currentTab={tab}
          onTabChange={setTab}
          email={user?.email}
          role={user?.role}
          onSignOut={() => api.auth.logout("/")}
          activeSession={activeSession}
          totalMembersCount={members.length}
          totalSessionsCount={sessions.length}
          checkedInCount={checkedIn.length}
          onScheduleNew={() => {
            setEditingSession(null);
            setSessionSheetOpen(true);
          }}
        />
      </aside>

      {/* Mobile Drawer (Shadcn Sheet) */}
      <Sheet open={mobileDrawerOpen} onOpenChange={setMobileDrawerOpen}>
        <SheetContent side="left" className="p-0 w-72 bg-band border-r border-ink/20">
          <CoachSidebar
            currentTab={tab}
            onTabChange={setTab}
            email={user?.email}
            role={user?.role}
            onSignOut={() => api.auth.logout("/")}
            activeSession={activeSession}
            totalMembersCount={members.length}
            totalSessionsCount={sessions.length}
            checkedInCount={checkedIn.length}
            onScheduleNew={() => {
              setEditingSession(null);
              setSessionSheetOpen(true);
            }}
            onCloseMobileDrawer={() => setMobileDrawerOpen(false)}
          />
        </SheetContent>
      </Sheet>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0 lg:pl-64">
        {/* Mobile Top Bar */}
        <header className="flex h-14 items-center justify-between border-b border-ink/10 bg-card px-4 lg:hidden">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setMobileDrawerOpen(true)}
            className="h-9 w-9 text-foreground"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <span className="font-display text-sm font-semibold tracking-tight">
            UBa Judo · Coach Console
          </span>

          <Button
            type="button"
            size="sm"
            onClick={() => {
              setEditingSession(null);
              setSessionSheetOpen(true);
            }}
            className="h-7 gap-1 bg-primary px-2.5 text-[11px] text-white"
          >
            <Plus className="h-3 w-3" />
            <span>Session</span>
          </Button>
        </header>

        {/* View Content Body */}
        <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          {tab === "checkin" ? (
            <CheckInPanel
              members={members}
              checkedIn={checkedIn}
              sessionDate={sessionDate}
              onDateChange={setSessionDate}
              busyId={busyId}
              onCheckIn={checkIn}
              onUndo={undo}
              activeSession={activeSession}
              onOpenSessionSheet={() => {
                setEditingSession(activeSession);
                setSessionSheetOpen(true);
              }}
              sessions={sessions}
              onSelectSession={handleSelectSession}
            />
          ) : tab === "sessions" ? (
            <SessionsPanel
              sessions={sessions}
              members={members}
              onScheduleNew={() => {
                setEditingSession(null);
                setSessionSheetOpen(true);
              }}
              onEditSession={(s) => {
                setEditingSession(s);
                setSessionSheetOpen(true);
              }}
              onDeleteSession={handleDeleteSession}
              onSelectSessionForCheckIn={(s) => {
                handleSelectSession(s);
                setTab("checkin");
              }}
              onSelectSessionForWrapUp={(s) => {
                handleSelectSession(s);
                setTab("wrapup");
              }}
            />
          ) : tab === "wrapup" ? (
            <WrapUpPanel
              members={members}
              sessions={sessions}
              attendance={attendance}
              sessionDate={sessionDate}
              activeSession={activeSession}
              onSelectSession={handleSelectSession}
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
            <RequestsPanel onMemberAdded={reload} />
          )}
        </main>
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
