import { useState, useMemo } from "react";
import {
  Calendar,
  Clock,
  Plus,
  Users,
  Film,
  Image as ImageIcon,
  CheckCircle2,
  MoreVertical,
  Search,
  Trash2,
  Edit3,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Member, TrainingSession } from "@/lib/types";
import { shortDate } from "@/lib/data/coach";

interface SessionsPanelProps {
  sessions: TrainingSession[];
  members: Member[];
  onScheduleNew: () => void;
  onEditSession: (session: TrainingSession) => void;
  onDeleteSession: (sessionId: string) => Promise<void>;
  onSelectSessionForCheckIn: (session: TrainingSession) => void;
  onSelectSessionForWrapUp: (session: TrainingSession) => void;
}

export function SessionsPanel({
  sessions,
  members,
  onScheduleNew,
  onEditSession,
  onDeleteSession,
  onSelectSessionForCheckIn,
  onSelectSessionForWrapUp,
}: SessionsPanelProps) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "recent" | "upcoming">("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const todayStr = new Date().toISOString().split("T")[0];

  const filteredSessions = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sessions
      .filter((s) => {
        const sDate = s.session_date || (s.start_time ? s.start_time.split("T")[0] : "");
        if (filter === "recent") return sDate <= todayStr;
        if (filter === "upcoming") return sDate > todayStr;
        return true;
      })
      .filter((s) => {
        if (!q) return true;
        const sDate = s.session_date || (s.start_time ? s.start_time.split("T")[0] : "");
        const sFocus = (s.focus || "").toLowerCase();
        const sNotes = (s.notes || "").toLowerCase();
        const coordinators = (s.coordinators || [])
          .map((c) => (c.member?.full_name || "").toLowerCase())
          .join(" ");
        return sDate.includes(q) || sFocus.includes(q) || sNotes.includes(q) || coordinators.includes(q);
      })
      .sort((a, b) => {
        const dateA = a.start_time || a.session_date || "";
        const dateB = b.start_time || b.session_date || "";
        return dateB.localeCompare(dateA);
      });
  }, [sessions, query, filter, todayStr]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this training session and its records?")) {
      return;
    }
    setDeletingId(id);
    try {
      await onDeleteSession(id);
    } finally {
      setDeletingId(null);
    }
  };

  const formatSessionTime = (startTime?: string | null, endTime?: string | null) => {
    if (!startTime) return "17:00 – 19:00";
    try {
      const start = new Date(startTime).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      });
      if (!endTime) return `${start} – Ongoing`;
      const end = new Date(endTime).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      });
      return `${start} – ${end}`;
    } catch {
      return "17:00 – 19:00";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Title and Schedule Action */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-[-0.02em] text-foreground">
            Training Sessions ({sessions.length})
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Manage scheduled dojo sessions, track attendance turnout, assign coordinators, and inspect session media.
          </p>
        </div>

        <Button
          type="button"
          onClick={onScheduleNew}
          className="h-9 gap-1.5 bg-primary px-4 text-xs font-semibold text-white shadow-xs hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Schedule Session
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search date, syllabus, coordinator..."
            className="h-8.5 pl-8 text-xs bg-card"
          />
        </div>

        <div className="flex items-center gap-1.5 rounded-lg border border-ink/10 bg-card p-1">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
              filter === "all"
                ? "bg-primary text-white shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All Sessions ({sessions.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("recent")}
            className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
              filter === "recent"
                ? "bg-primary text-white shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Recent / Past
          </button>
          <button
            type="button"
            onClick={() => setFilter("upcoming")}
            className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
              filter === "upcoming"
                ? "bg-primary text-white shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Upcoming
          </button>
        </div>
      </div>

      {/* Sessions Grid / List */}
      {filteredSessions.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-ink/15 bg-card py-16 text-center">
          <Calendar className="h-10 w-10 text-muted-foreground/30" />
          <h3 className="mt-3 font-display text-sm font-semibold text-foreground">
            No training sessions found
          </h3>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            {query ? "Try adjusting your search query." : "Schedule your first session to track attendance and media."}
          </p>
          {!query && (
            <Button
              type="button"
              onClick={onScheduleNew}
              className="mt-4 h-8 gap-1.5 bg-primary px-3 text-xs text-white"
            >
              <Plus className="h-3.5 w-3.5" />
              Schedule First Session
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-3.5">
          {filteredSessions.map((s) => {
            const sDate = s.session_date || (s.start_time ? s.start_time.split("T")[0] : "");
            const isToday = sDate === todayStr;
            const isFuture = sDate > todayStr;
            const mediaCount = (s.media || []).length;
            const turnout = Number(s.attended_count) || 0;
            const coords = s.coordinators || [];
            const isDeleting = deletingId === s.id;

            return (
              <div
                key={s.id}
                className={`group relative flex flex-col justify-between gap-4 rounded-xl border bg-card p-4.5 transition-all hover:border-ink/25 hover:shadow-sm sm:flex-row sm:items-center ${
                  isToday
                    ? "border-primary/40 bg-primary/[0.02]"
                    : "border-ink/10"
                }`}
              >
                {/* Left Section: Date, Time & Syllabus */}
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-foreground">
                      {shortDate(sDate)}
                    </span>
                    {isToday && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider text-primary">
                        Today's Mat
                      </span>
                    )}
                    {isFuture && (
                      <span className="rounded-full bg-secondary px-2 py-0.5 font-mono text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
                        Upcoming
                      </span>
                    )}
                    <span className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatSessionTime(s.start_time, s.end_time)}
                    </span>
                  </div>

                  <h4 className="font-display text-base font-semibold text-foreground">
                    {s.focus || "Open Mat & Randori Drills"}
                  </h4>

                  {s.notes && (
                    <p className="line-clamp-1 text-xs text-muted-foreground">
                      {s.notes}
                    </p>
                  )}

                  {/* Coordinators & Metadata badges */}
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    {coords.length > 0 ? (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                        <span className="font-medium text-foreground">
                          {coords.map((c) => c.member?.full_name || "Coordinator").join(", ")}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[11px] text-muted-foreground/60 italic">
                        No coordinators assigned
                      </span>
                    )}

                    <span className="text-ink/15">•</span>

                    {/* Turnout badge */}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Users className="h-3.5 w-3.5 text-accent" />
                      <span className="font-mono font-medium text-foreground">{turnout}</span>
                      <span>checked in</span>
                    </div>

                    <span className="text-ink/15">•</span>

                    {/* Media badge */}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <ImageIcon className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="font-mono font-medium text-foreground">{mediaCount}</span>
                      <span>files</span>
                    </div>
                  </div>
                </div>

                {/* Right Section: Action Controls */}
                <div className="flex items-center gap-2 border-t border-ink/8 pt-3 sm:border-t-0 sm:pt-0 shrink-0">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => onSelectSessionForCheckIn(s)}
                    className="h-8 gap-1.5 text-xs border-ink/15 hover:bg-secondary"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                    <span>Check-in</span>
                  </Button>

                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => onSelectSessionForWrapUp(s)}
                    className="h-8 gap-1.5 text-xs border-ink/15 hover:bg-secondary"
                  >
                    <Film className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>Wrap-up & Media</span>
                  </Button>

                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => onEditSession(s)}
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    title="Edit Session details"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </Button>

                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    disabled={isDeleting}
                    onClick={(e) => handleDelete(s.id, e)}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    title="Delete session"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
