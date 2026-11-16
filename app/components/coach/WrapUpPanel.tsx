import { useMemo } from "react";
import {
  Users,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  Award,
} from "lucide-react";
import type { AttendanceRecord, Member, TrainingSession } from "@/lib/types";
import MetricCard from "@/components/coach/MetricCard";
import BeltBar from "@/components/visual/BeltBar";
import {
  absentRegulars,
  averageOf,
  beltCounts,
  eligibleForPromotion,
  sessionsNeeded,
  shortDate,
} from "@/lib/data/coach";
import { beltFor } from "@/lib/data/club";

interface WrapUpPanelProps {
  members: Member[];
  sessions: TrainingSession[];
  attendance: AttendanceRecord[];
  sessionDate: string;
}

const WrapUpPanel = ({
  members,
  sessions,
  attendance,
  sessionDate,
}: WrapUpPanelProps) => {
  const current = sessions.find((s) => s.session_date === sessionDate) ?? null;
  const past = useMemo(
    () => sessions.filter((s) => s.session_date !== sessionDate),
    [sessions, sessionDate],
  );
  const previousAverage = averageOf(
    past.slice(0, 6).map((s) => Number(s.attended_count) || 0),
  );
  const today = Number(current?.attended_count) || 0;
  const delta = previousAverage
    ? Math.round(((today - previousAverage) / previousAverage) * 100)
    : 0;

  const absent = useMemo(
    () =>
      absentRegulars(
        members,
        past.slice(0, 3).map((s) => s.id),
        attendance,
      ),
    [members, past, attendance],
  );
  const eligible = useMemo(() => eligibleForPromotion(members), [members]);
  const belts = useMemo(() => beltCounts(members), [members]);
  const totalBelts = belts.reduce((sum, b) => sum + b.count, 0) || 1;

  const DeltaIcon = delta > 0 ? TrendingUp : delta < 0 ? TrendingDown : Minus;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Turnout today"
          value={today}
          hint={
            current
              ? current.focus || "Session logged"
              : "No session logged for this date"
          }
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        />
        <MetricCard
          label="6-session average"
          value={previousAverage}
          hint="Athletes per previous session"
          icon={<Minus className="h-4 w-4 text-muted-foreground" />}
        />
        <MetricCard
          label="Against average"
          value={current ? `${delta > 0 ? "+" : ""}${delta}%` : "—"}
          tone={!current ? "default" : delta >= 0 ? "good" : "warn"}
          hint={
            current
              ? "Today versus the club's recent norm"
              : "Check in a session to compare"
          }
          icon={<DeltaIcon className="h-4 w-4 text-muted-foreground" />}
        />
        <MetricCard
          label="Promotion-ready"
          value={eligible.length}
          tone={eligible.length ? "warn" : "default"}
          hint="Athletes past their session target"
          icon={<Award className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-ink/12 bg-card">
          <div className="flex items-center gap-2 border-b border-ink/10 px-5 py-4">
            <AlertTriangle className="h-3.5 w-3.5 text-primary" />
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
              Regulars missing · last 3 sessions
            </p>
          </div>
          <ul className="divide-y divide-ink/8">
            {absent.length === 0 && (
              <li className="px-5 py-8 text-center text-[13px] text-muted-foreground">
                No regular has missed three sessions in a row.
              </li>
            )}
            {absent.slice(0, 8).map((member) => (
              <li
                key={member.id}
                className="flex items-center justify-between gap-4 px-5 py-3.5">
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium">
                    {member.full_name}
                  </p>
                  <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                    {member.belt_rank} · last seen{" "}
                    {shortDate(member.last_attended)}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-primary">
                  3 missed
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-ink/12 bg-card">
          <div className="flex items-center gap-2 border-b border-ink/10 px-5 py-4">
            <Award className="h-3.5 w-3.5 text-accent" />
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
              Eligible for grading
            </p>
          </div>
          <ul className="divide-y divide-ink/8">
            {eligible.length === 0 && (
              <li className="px-5 py-8 text-center text-[13px] text-muted-foreground">
                Nobody has hit their session target yet.
              </li>
            )}
            {eligible.slice(0, 8).map((member) => {
              const target = sessionsNeeded(member);
              const done = member.sessions_since_promotion ?? 0;
              return (
                <li key={member.id} className="px-5 py-3.5">
                  <div className="flex items-center justify-between gap-4">
                    <p className="truncate text-[13px] font-medium">
                      {member.full_name}
                    </p>
                    <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
                      {done}/{target}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <BeltBar rank={member.belt_rank} className="h-1.5 w-8" />
                    <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                      {beltFor(member.belt_rank).kyu}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="rounded-lg border border-ink/12 bg-card p-5">
        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
          Belt spread · active athletes
        </p>
        <div className="mt-4 flex h-3 overflow-hidden rounded-full bg-ink/10">
          {belts.map((belt) => (
            <span
              key={belt.rank}
              style={{
                width: `${(belt.count / totalBelts) * 100}%`,
                backgroundColor: beltFor(belt.rank).color,
              }}
            />
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
          {belts.map((belt) => (
            <span
              key={belt.rank}
              className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: beltFor(belt.rank).color }}
              />
              {belt.rank} {belt.count}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WrapUpPanel;
