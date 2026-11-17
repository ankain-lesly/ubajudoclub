import { useState, useMemo } from "react";
import { Link, useParams, useSearchParams } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Calendar,
  Clock,
  ShieldCheck,
  Settings2,
  Users,
  Film,
  ClipboardCheck,
  Image as ImageIcon,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import CheckInPanel from "@/components/coach/CheckInPanel";
import WrapUpPanel from "@/components/coach/WrapUpPanel";
import { SessionMediaPanel } from "@/components/coach/SessionMediaPanel";
import { SessionSheet } from "@/components/coach/SessionSheet";
import {
  useSessionDetailQuery,
  useSessionAttendanceQuery,
  useSessionsQuery,
  useCheckInMutation,
  useUndoCheckInMutation,
  useSaveSessionMutation,
} from "@/lib/api/session.queries";
import { shortDate, todayISO } from "@/lib/data/coach";
import type { AttendanceRecord, Member } from "@/lib/types";
import { useMembersQuery } from "@/lib/api/member.queries";

export default function DashboardSessionDetailRoute() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const currentTab = searchParams.get("tab") || "checkin";
  const [sessionSheetOpen, setSessionSheetOpen] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  // Queries
  const {
    data: session,
    isLoading: sessionLoading,
    error: sessionError,
  } = useSessionDetailQuery(id);
  const { data: attendance = [], isLoading: attendanceLoading } =
    useSessionAttendanceQuery(id);
  const { data: members = [] } = useMembersQuery();
  const { data: allSessions = [] } = useSessionsQuery();

  // Mutations
  const checkInMutation = useCheckInMutation(id);
  const undoMutation = useUndoCheckInMutation(id);
  const saveSessionMutation = useSaveSessionMutation();

  const sessionDate =
    session?.session_date ||
    (session?.start_time ? session.start_time.split("T")[0] : todayISO());

  const memberNameMap = useMemo(
    () => new Map(members.map((m) => [m.id, m.full_name])),
    [members]
  );

  const enrichedAttendance = useMemo(() => {
    return attendance.map((a: any) => ({
      ...a,
      member_name: a.member_name || memberNameMap.get(a.member_id) || "Athlete",
      session_date: a.session_date || sessionDate,
    })) as AttendanceRecord[];
  }, [attendance, memberNameMap, sessionDate]);

  const handleCheckIn = async (member: Member) => {
    setBusyId(member.id);
    try {
      await checkInMutation.mutateAsync({
        memberId: member.id,
        sessionDate,
      });
    } finally {
      setBusyId(null);
    }
  };

  const handleUndo = async (record: AttendanceRecord) => {
    setBusyId(record.member_id);
    try {
      await undoMutation.mutateAsync(record.id);
    } finally {
      setBusyId(null);
    }
  };

  if (sessionLoading) {
    return (
      <div className="flex min-h-100 flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          Loading Mat Workspace...
        </p>
      </div>
    );
  }

  if (sessionError || !session) {
    return (
      <div className="rounded-xl border border-dashed border-ink/15 bg-card p-12 text-center">
        <AlertCircle className="mx-auto h-10 w-10 text-destructive/50" />
        <h2 className="mt-3 font-display text-base font-semibold text-foreground">
          Session Not Found
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          The requested training session ID could not be loaded or was deleted.
        </p>
        <Link
          to="/dashboard/sessions"
          className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Sessions Ledger</span>
        </Link>
      </div>
    );
  }

  const isToday = sessionDate === todayISO();
  const coords = session.coordinators || [];
  const mediaCount = (session.media || []).length;
  const checkedInCount = enrichedAttendance.length;

  return (
    <div className="space-y-6">
      {/* Sticky Mat Header & Quick Actions */}
      <div className="rounded-xl border border-ink/12 bg-card p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                to="/dashboard/sessions"
                className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors mr-1"
              >
                <ArrowLeft className="h-3 w-3" />
                <span>Sessions</span>
              </Link>

              <span className="text-muted-foreground/30">•</span>

              <span className="font-mono text-xs font-semibold text-foreground">
                {shortDate(sessionDate)}
              </span>

              {isToday ? (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider text-primary">
                  Today's Mat
                </span>
              ) : (
                <span className="rounded-full bg-secondary px-2 py-0.5 font-mono text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
                  Scheduled
                </span>
              )}

              {session.start_time && (
                <span className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {new Date(session.start_time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              )}
            </div>

            <h1 className="font-display text-xl sm:text-2xl font-semibold tracking-[-0.02em] text-foreground">
              {session.focus || "Open Mat Randori & Technique Drills"}
            </h1>

            {session.notes && (
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl">
                {session.notes}
              </p>
            )}

            {/* Assigned Coordinators */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              {coords.length > 0 ? (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                  <span className="font-medium text-foreground">
                    Coordinators:{" "}
                    {coords.map((c) => c.member?.full_name || "Coach").join(", ")}
                  </span>
                </div>
              ) : (
                <span className="text-xs italic text-muted-foreground/60">
                  No coordinators assigned
                </span>
              )}

              <span className="text-ink/15">•</span>

              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Users className="h-3.5 w-3.5 text-accent" />
                <span className="font-mono font-medium text-foreground">
                  {checkedInCount}
                </span>
                <span>present on mat</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setSessionSheetOpen(true)}
              className="h-8.5 gap-1.5 text-xs border-ink/15 hover:bg-secondary"
            >
              <Settings2 className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Edit Details</span>
            </Button>
          </div>
        </div>

        {/* Operational Desk Segmented Navigation */}
        <div className="mt-6 flex items-center gap-1.5 border-t border-ink/8 pt-4 overflow-x-auto">
          <button
            type="button"
            onClick={() => setSearchParams({ tab: "checkin" })}
            className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition-all ${
              currentTab === "checkin"
                ? "bg-primary text-white shadow-xs font-semibold"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <ClipboardCheck className="h-3.5 w-3.5" />
            <span>Attendance Desk</span>
            <span
              className={`rounded-full px-1.5 py-0.2 font-mono text-[9px] ${
                currentTab === "checkin"
                  ? "bg-white/20 text-white"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {checkedInCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSearchParams({ tab: "wrapup" })}
            className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition-all ${
              currentTab === "wrapup"
                ? "bg-primary text-white shadow-xs font-semibold"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <Film className="h-3.5 w-3.5" />
            <span>Turnout & Wrap-up</span>
          </button>

          <button
            type="button"
            onClick={() => setSearchParams({ tab: "media" })}
            className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition-all ${
              currentTab === "media"
                ? "bg-primary text-white shadow-xs font-semibold"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <ImageIcon className="h-3.5 w-3.5" />
            <span>Media Vault</span>
            {mediaCount > 0 && (
              <span
                className={`rounded-full px-1.5 py-0.2 font-mono text-[9px] ${
                  currentTab === "media"
                    ? "bg-white/20 text-white"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {mediaCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Workspace Body */}
      {currentTab === "checkin" ? (
        <CheckInPanel
          members={members}
          checkedIn={enrichedAttendance}
          sessionDate={sessionDate}
          onDateChange={() => {}}
          busyId={busyId}
          onCheckIn={handleCheckIn}
          onUndo={handleUndo}
          activeSession={session}
          onOpenSessionSheet={() => setSessionSheetOpen(true)}
        />
      ) : currentTab === "wrapup" ? (
        <WrapUpPanel
          members={members}
          sessions={allSessions}
          attendance={enrichedAttendance}
          sessionDate={sessionDate}
          activeSession={session}
          onEditSession={() => setSessionSheetOpen(true)}
          onMediaChanged={() => {
            queryClient.invalidateQueries({ queryKey: ["session", id] });
            queryClient.invalidateQueries({ queryKey: ["session_media", id] });
          }}
        />
      ) : (
        <div className="rounded-xl border border-ink/12 bg-card p-6 shadow-xs space-y-4">
          <div>
            <h2 className="font-display text-lg font-semibold tracking-[-0.015em] text-foreground">
              Session Media & Technique Captures
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Upload photos and video clips from this practice directly into the UBa Judo Club Supabase Storage vault.
            </p>
          </div>

          <SessionMediaPanel
            sessionId={session.id}
            media={session.media || []}
            onMediaChanged={() => {
              queryClient.invalidateQueries({ queryKey: ["session", id] });
              queryClient.invalidateQueries({ queryKey: ["session_media", id] });
            }}
          />
        </div>
      )}

      {/* Ephemeral Edit Session Details Sheet */}
      <SessionSheet
        open={sessionSheetOpen}
        session={session}
        members={members}
        onClose={() => setSessionSheetOpen(false)}
        onSave={async (data) => {
          await saveSessionMutation.mutateAsync({
            id: session.id,
            ...data,
          });
          setSessionSheetOpen(false);
        }}
        onMediaChanged={() => {
          queryClient.invalidateQueries({ queryKey: ["session", id] });
          queryClient.invalidateQueries({ queryKey: ["session_media", id] });
        }}
      />
    </div>
  );
}
