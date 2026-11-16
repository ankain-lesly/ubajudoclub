import { format, isBefore, isSameDay, parseISO, startOfToday } from "date-fns";
import { WEEK } from "@/lib/data/club";
import type { ClubEvent, EventKind } from "@/lib/types";

export const KINDS: EventKind[] = [
  "Competition",
  "Grading",
  "Seminar",
  "Social",
  "Camp",
];

export const KIND_STYLES: Record<EventKind, { chip: string; dot: string }> = {
  Competition: {
    chip: "border-primary/30 bg-primary/10 text-primary",
    dot: "bg-primary",
  },
  Grading: {
    chip: "border-accent/30 bg-accent/10 text-accent dark:border-accent-foreground/30 dark:text-accent-foreground",
    dot: "bg-accent dark:bg-accent-foreground",
  },
  Seminar: { chip: "border-ink/20 bg-ink/[0.07] text-ink", dot: "bg-ink" },
  Social: { chip: "border-gold/50 bg-gold/25 text-ink", dot: "bg-gold" },
  Camp: { chip: "border-ink/25 bg-secondary text-ink/75", dot: "bg-ink/50" },
};

export const kindStyle = (kind?: string) =>
  KIND_STYLES[(kind as EventKind) ?? "Competition"] ?? KIND_STYLES.Competition;

export const eventDate = (event: ClubEvent) => parseISO(event.start_date);
export const dayOf = (value: string) => format(parseISO(value), "d");
export const monthOf = (value: string) => format(parseISO(value), "MMM");
export const longDate = (value: string) =>
  format(parseISO(value), "EEEE d MMMM yyyy");
export const shortDate = (value: string) =>
  format(parseISO(value), "EEE d MMM");

export const isUpcoming = (event: ClubEvent) =>
  !isBefore(eventDate(event), startOfToday());

export const sortByDate = (events: ClubEvent[]) =>
  [...events].sort((a, b) => eventDate(a).getTime() - eventDate(b).getTime());

export const splitEvents = (events: ClubEvent[]) => {
  const sorted = sortByDate(events);
  return {
    upcoming: sorted.filter(isUpcoming),
    past: sorted.filter((event) => !isUpcoming(event)).reverse(),
  };
};

export const eventsOn = (events: ClubEvent[], day: Date) =>
  events.filter((event) => isSameDay(eventDate(event), day));

const WEEKDAY_INDEX: Record<string, number> = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

export const sessionsOn = (day: Date) =>
  WEEK.filter((session) => WEEKDAY_INDEX[session.day] === day.getDay());
