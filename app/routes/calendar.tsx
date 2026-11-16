import { useMemo, useState } from "react";
import { Link } from "react-router";
import {
  addMonths,
  format,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfToday,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Route } from "./+types/calendar";
import { listEvents } from "@/lib/api/public";
import { KINDS, isUpcoming, kindStyle, sortByDate } from "@/lib/data/events";
import MonthCalendar from "@/components/calendar/MonthCalendar";
import DayAgenda from "@/components/calendar/DayAgenda";
import Aura from "@/components/visual/Aura";
import RingField from "@/components/visual/RingField";
import SectionBackdrop from "@/components/visual/SectionBackdrop";
import Reveal from "@/components/visual/Reveal";
import { cn } from "@/lib/utils";

export async function loader() {
  return { events: await listEvents() };
}

export function meta() {
  return [{ title: "Calendar — UBa Judo Club" }];
}

const Calendar = ({ loaderData }: Route.ComponentProps) => {
  const { events } = loaderData;
  const [month, setMonth] = useState(() => startOfMonth(new Date()));
  const [selected, setSelected] = useState(() => startOfToday());
  const list = useMemo(() => events ?? [], [events]);

  const thisMonth = list.filter((event) =>
    isSameMonth(parseISO(event.start_date), month),
  );
  const nextUp = useMemo(
    () => sortByDate(list).filter(isUpcoming).slice(0, 4),
    [list],
  );

  const go = (delta: number) => {
    const next = delta > 0 ? addMonths(month, 1) : subMonths(month, 1);
    setMonth(startOfMonth(next));
  };

  return (
    <>
      <section className="relative overflow-hidden border-b border-ink/10">
        <div className="pointer-events-none absolute inset-0 tatami opacity-60" />
        <SectionBackdrop variant="hatch" />
        <Aura grid={false} />
        <div className="pointer-events-none absolute -right-40 -top-36 hidden h-[500px] w-[500px] opacity-60 lg:block">
          <RingField />
        </div>

        <div className="relative mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-24">
          <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.32em] text-primary">
            <span className="h-px w-8 bg-primary" />
            Calendar view
          </p>
          <h1 className="mt-7 max-w-2xl font-display text-[clamp(2.4rem,5.4vw,4rem)] font-semibold leading-[0.94] tracking-[-0.035em] text-balance">
            The month, mat nights and all.
          </h1>
          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
            Training runs every Monday, Wednesday, Friday and Saturday.
            Everything else — gradings, seminars, championships — sits alongside
            it. Pick a day to see what is happening.
          </p>
        </div>
      </section>

      <section className="relative overflow-hidden">
        <SectionBackdrop variant="rings" className="opacity-70" />
        <div className="relative mx-auto max-w-6xl px-5 py-14 lg:px-8 lg:py-20">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => go(-1)}
                className="grid h-10 w-10 place-items-center rounded-full border border-ink/15 transition-colors hover:border-ink/40 hover:bg-ink/5"
                aria-label="Previous month">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <p className="min-w-[190px] text-center font-display text-[22px] font-semibold tracking-[-0.02em]">
                {format(month, "MMMM yyyy")}
              </p>
              <button
                type="button"
                onClick={() => go(1)}
                className="grid h-10 w-10 place-items-center rounded-full border border-ink/15 transition-colors hover:border-ink/40 hover:bg-ink/5"
                aria-label="Next month">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
                {thisMonth.length} event{thisMonth.length === 1 ? "" : "s"} this
                month
              </p>
              <button
                type="button"
                onClick={() => {
                  setMonth(startOfMonth(new Date()));
                  setSelected(startOfToday());
                }}
                className="rounded-full border border-ink/15 px-4 py-2 font-mono text-[9px] uppercase tracking-[0.16em] transition-colors hover:border-ink/40 hover:bg-ink/5">
                Today
              </button>
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.65fr_0.85fr] lg:items-start">
            <Reveal>
              <MonthCalendar
                month={month}
                events={list}
                selected={selected}
                onSelect={setSelected}
              />

              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
                <span className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-ink/30" />
                  Training night
                </span>
                {KINDS.map((kind) => (
                  <span
                    key={kind}
                    className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        kindStyle(kind).dot,
                      )}
                    />
                    {kind}
                  </span>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <DayAgenda day={selected} events={list} />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-ink/10 bg-secondary/40">
        <SectionBackdrop variant="dots" className="opacity-60" />
        <div className="relative mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-20">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-primary">
                On the horizon
              </p>
              <h2 className="mt-4 font-display text-[clamp(1.6rem,2.8vw,2.2rem)] font-semibold tracking-[-0.025em]">
                Next four dates
              </h2>
            </div>
            <Link
              to="/events"
              className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
              All events
            </Link>
          </div>

          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {nextUp.map((event) => (
              <li
                key={event.id}
                className="flex items-center gap-4 rounded-lg border border-ink/12 bg-card px-5 py-4">
                <span
                  className={cn(
                    "h-2 w-2 shrink-0 rounded-full",
                    kindStyle(event.kind).dot,
                  )}
                />
                <span className="min-w-0">
                  <span className="block truncate text-[13.5px] font-medium">
                    {event.title}
                  </span>
                  <span className="mt-0.5 block font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                    {format(parseISO(event.start_date), "EEE d MMM")} ·{" "}
                    {event.kind}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
};

export default Calendar;
