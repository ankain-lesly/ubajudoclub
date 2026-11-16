import { useMemo, useState } from "react";
import { Search, Check, Undo2, Loader2, CalendarDays } from "lucide-react";
import type { AttendanceRecord, Member } from "@/lib/types";
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
}

const CheckInPanel = ({
  members,
  checkedIn,
  sessionDate,
  onDateChange,
  busyId,
  onCheckIn,
  onUndo,
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
                Search a name, tap once. No paper sheet.
              </p>
            </div>
            <label className="flex items-center gap-2 rounded-md border border-ink/15 px-3 py-2">
              <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="date"
                value={sessionDate}
                onChange={(e) => onDateChange(e.target.value)}
                className="bg-transparent font-mono text-[11px] outline-none"
              />
            </label>
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
                  <p className="truncate text-sm font-medium">
                    {member.full_name}
                  </p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <BeltBar rank={member.belt_rank} className="h-1.5 w-8" />
                    <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                      {member.belt_rank} · {member.matricule || "no matricule"}
                    </span>
                  </div>
                </div>
                {present ? (
                  <button
                    type="button"
                    onClick={() => record && onUndo(record)}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-ink/15 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground">
                    <Undo2 className="h-3 w-3" />
                    Undo
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onCheckIn(member)}
                    disabled={busyId === member.id}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-[11px] font-semibold text-paper transition-opacity hover:opacity-90 disabled:opacity-50">
                    {busyId === member.id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Check className="h-3 w-3" />
                    )}
                    Check in
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="rounded-lg border border-ink/12 bg-card p-6">
        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
          On the mat now
        </p>
        <p className="mt-3 font-display text-5xl font-semibold leading-none tracking-[-0.04em] tabular-nums">
          {checkedIn.length}
        </p>
        <p className="mt-2 text-[12px] text-muted-foreground">
          athletes checked in for {sessionDate}
        </p>

        <div className="mt-6 space-y-2.5 border-t border-ink/10 pt-5">
          {checkedIn.length === 0 && (
            <p className="text-[12.5px] text-muted-foreground">
              Nobody logged yet. The first tap starts the session.
            </p>
          )}
          {checkedIn.map((record) => (
            <div
              key={record.id}
              className="flex items-center gap-2 text-[12.5px]">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-accent/15 text-accent">
                <Check className="h-3 w-3" />
              </span>
              <span className="truncate">{record.member_name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CheckInPanel;
