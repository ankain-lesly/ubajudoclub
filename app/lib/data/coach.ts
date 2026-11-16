import { beltFor, BELTS } from "@/lib/data/club";
import type { AttendanceRecord, Member, Rank } from "@/lib/types";

export const todayISO = (): string => new Date().toISOString().slice(0, 10);

const WEEKDAY_FOCUS: Record<number, string> = {
  1: "Ukemi and fundamentals",
  3: "Tachi-waza and randori",
  5: "Ne-waza and grading prep",
  6: "Kata and open mat",
};

export const focusForDate = (iso: string): string => {
  const day = new Date(`${iso}T12:00:00`).getDay();
  return WEEKDAY_FOCUS[day] ?? "Open randori";
};

export const averageOf = (values: number[]): number =>
  values.length
    ? Math.round(values.reduce((a, b) => a + b, 0) / values.length)
    : 0;

export const shortDate = (iso?: string | null): string => {
  if (!iso) return "—";
  const d = new Date(`${iso.slice(0, 10)}T12:00:00`);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
};

export const nextRank = (rank?: string): Rank | null => {
  const i = BELTS.findIndex((b) => b.rank === rank);
  if (i < 0 || i === BELTS.length - 1) return null;
  return BELTS[i + 1].rank;
};

export const sessionsNeeded = (member: Member): number =>
  beltFor(member.belt_rank).sessions;

export const eligibleForPromotion = (members: Member[]): Member[] =>
  members.filter(
    (m) =>
      m.status === "active" &&
      (m.sessions_since_promotion ?? 0) >= sessionsNeeded(m),
  );

export const absentRegulars = (
  members: Member[],
  recentSessionIds: string[],
  attendance: AttendanceRecord[],
  lookback = 3,
): Member[] => {
  if (recentSessionIds.length < lookback) return [];
  const windowIds = recentSessionIds.slice(0, lookback);
  const present = new Set(
    attendance
      .filter((a) => windowIds.includes(a.session_id))
      .map((a) => a.member_id),
  );
  return members.filter(
    (m) =>
      m.status === "active" &&
      (m.sessions_total ?? 0) >= 5 &&
      !present.has(m.id),
  );
};

export const beltCounts = (members: Member[]) =>
  BELTS.map((b) => ({
    rank: b.rank,
    count: members.filter((m) => m.belt_rank === b.rank).length,
  })).filter((b) => b.count > 0);
