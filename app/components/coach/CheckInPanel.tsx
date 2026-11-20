import { useMemo, useState } from "react";
import { Search, Check, Undo2, Loader2, CalendarDays, Settings2, Clock, Users } from "lucide-react";
import type { AttendanceRecord, Member, TrainingSession } from "@/lib/types";
import BeltBar from "@/components/visual/BeltBar";
import { cn } from "@/lib/utils";

interface CheckInPanelProps {
  members: Member[];
  checkedIn: AttendanceRecord[];
  sessionDate: string;
  onDateChange: (value: string) => void;
  busyId: string | null;
  onCheckIn: (member: Member) => void;
  onUndo: (record: AttendanceRecord) => void;
  activeSession?: TrainingSession | null;
  onOpenSessionSheet?: () => void;
  sessions?: TrainingSession[];
  onSelectSession?: (session: TrainingSession) => void;
}

const CheckInPanel = ({
  members,
  checkedIn,
  sessionDate,
  onDateChange,
  busyId,
  onCheckIn,
  onUndo,
  activeSession,
  onOpenSessionSheet,
  sessions,
  onSelectSession,
}: CheckInPanelProps) => {
  const [query, setQuery] = useState("");
  const checkedIds = useMemo(
    () => new Set(checkedIn.map((a) => a.member_id)),
    [checkedIn],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return members
      .filter((m) => m.status === "active")
      .filter(
        (m) =>
          !q ||
          m.full_name.toLowerCase().includes(q) ||
          (m.matricule ?? "").toLowerCase().includes(q),
      )
      .sort(
        (a, b) =>
          Number(checkedIds.has(a.id)) - Number(checkedIds.has(b.id)) ||
          a.full_name.localeCompare(b.full_name),
      );
  }, [members, query, checkedIds]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
      <div className="rounded-lg border border-ink/12 bg-card">
        <div className="border-b border-ink/10 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-display text-lg font-semibold tracking-[-0.015em]">
                Mat-side check-in
              </p>
              <p className="mt-1 text-[12px] text-muted-foreground">
                Search a name, tap once. Instant ledger updates with zero counter drift.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {sessions && sessions.length > 0 && onSelectSession && (
                <select
                  value={activeSession?.id || ""}
                  onChange={(e) => {
                    const found = sessions.find((s) => s.id === e.target.value);
                    if (found) onSelectSession(found);
                  }}
                  className="rounded-md border border-ink/15 bg-background px-2.5 py-1.5 text-xs font-medium outline-none max-w-[210px] truncate"
                >
                  <option value="" disabled>
                    Switch Session...
                  </option>
                  {sessions.map((s) => {
                    const sDate =
                      s.session_date || (s.start_time ? s.start_time.split("T")[0] : "");
                    return (
                      <option key={s.id} value={s.id}>
                        {sDate} · {s.focus || "Session"}
                      </option>
                    );
                  })}
                </select>
              )}

              <label className="flex items-center gap-2 rounded-md border border-ink/15 px-3 py-1.5 bg-background">
                <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="date"
                  value={sessionDate}
                  onChange={(e) => onDateChange(e.target.value)}
                  className="bg-transparent font-mono text-[11px] outline-none"
                />
              </label>

              {onOpenSessionSheet && (
                <button
                  type="button"
                  onClick={onOpenSessionSheet}
                  className="inline-flex items-center gap-1.5 rounded-md border border-ink/15 px-3 py-1.5 text-[11px] font-mono hover:border-primary hover:text-primary transition-colors bg-background"
                  title="Edit session focus, times, coordinators"
                >
                  <Settings2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Session Details</span>
                </button>
              )}
            </div>
          </div>

          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or matricule"
              className="w-full rounded-md border border-ink/15 bg-background py-2.5 pl-9 pr-3 text-sm outline-none transition-colors focus:border-primary"
            />
          </div>
        </div>

        <ul className="max-h-[520px] divide-y divide-ink/8 overflow-y-auto">
          {filtered.length === 0 && (
            <li className="px-5 py-10 text-center text-[13px] text-muted-foreground">
              No athlete matches “{query}”.
            </li>
          )}
          {filtered.map((member) => {
            const present = checkedIds.has(member.id);
            const record = checkedIn.find((a) => a.member_id === member.id);
            return (
              <li
                key={member.id}
                className={cn(
                  "flex items-center justify-between gap-4 px-5 py-3.5 transition-colors",
                  present && "bg-accent/[0.06]",
                )}>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-[13.5px] font-medium">
                      {member.full_name}
                    </p>
                    {present && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-accent dark:text-accent-foreground font-semibold">
                        <Check className="h-2.5 w-2.5" />
                        On Mat
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <BeltBar rank={member.belt_rank} className="h-4 w-auto" />
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                      {member.belt_rank} · {member.matricule || "No matricule"}
                    </span>
                  </div>
                </div>

                <div>
                  {present ? (
                    <button
                      type="button"
                      disabled={busyId === member.id}
                      onClick={() => record && onUndo(record)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-ink/20 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:border-destructive hover:text-destructive">
                      {busyId === member.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Undo2 className="h-3 w-3" />
                      )}
                      Undo
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={busyId === member.id}
                      onClick={() => onCheckIn(member)}
                      className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-paper transition-opacity hover:opacity-90 disabled:opacity-50">
                      {busyId === member.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Check className="h-3 w-3" />
                      )}
                      Check in
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="rounded-lg border border-ink/12 bg-card p-5 self-start">
        <div className="flex items-center justify-between border-b border-ink/10 pb-4">
          <div>
            <p className="font-display text-base font-semibold">
              On the tatami
            </p>
            <p className="mt-0.5 text-[11.5px] text-muted-foreground">
              {checkedIn.length} judokas checked in
            </p>
          </div>
          <span className="rounded-full bg-primary/10 px-3 py-1 font-mono text-xs font-semibold text-primary">
            {checkedIn.length}
          </span>
        </div>

        {activeSession?.focus && (
          <div className="mt-3 p-2.5 rounded bg-secondary/50 border border-ink/8 text-xs">
            <p className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">Syllabus Focus</p>
            <p className="font-medium text-foreground mt-0.5">{activeSession.focus}</p>
          </div>
        )}

        <ul className="mt-4 max-h-[440px] divide-y divide-ink/8 overflow-y-auto">
          {checkedIn.length === 0 && (
            <li className="py-8 text-center text-[12px] text-muted-foreground">
              No one checked in yet for this date.
            </li>
          )}
          {checkedIn.map((record) => {
            const member = members.find((m) => m.id === record.member_id);
            return (
              <li
                key={record.id}
                className="flex items-center justify-between gap-3 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-[12.5px] font-medium">
                    {member?.full_name || record.member_name || "Athlete"}
                  </p>
                  <p className="font-mono text-[9px] uppercase text-muted-foreground">
                    {member?.belt_rank || "Member"}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={busyId === record.member_id}
                  onClick={() => onUndo(record)}
                  className="rounded p-1 text-muted-foreground transition-colors hover:text-destructive">
                  <Undo2 className="h-3 w-3" />
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default CheckInPanel;
