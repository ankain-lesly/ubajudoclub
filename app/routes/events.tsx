import { useMemo, useState } from "react";
import { Link } from "react-router";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Clock,
  MapPin,
} from "lucide-react";
import { Image } from "@/components/ui/image";
import type { Route } from "./+types/events";
import { listEvents } from "@/lib/server/public";
import {
  KINDS,
  dayOf,
  kindStyle,
  longDate,
  monthOf,
  splitEvents,
} from "@/lib/data/events";
import EventCard from "@/components/events/EventCard";
import Aura from "@/components/visual/Aura";
import RingField from "@/components/visual/RingField";
import Reveal from "@/components/visual/Reveal";
import SectionBackdrop from "@/components/visual/SectionBackdrop";
import { cn } from "@/lib/utils";

export async function loader() {
  return { events: await listEvents() };
}

export function meta() {
  return [{ title: "Events — UBa Judo Club" }];
}

const Events = ({ loaderData }: Route.ComponentProps) => {
  const { events } = loaderData;
  const [filter, setFilter] = useState<string>("All");

  const { upcoming, past } = useMemo(
    () => (events ? splitEvents(events) : { upcoming: [], past: [] }),
    [events],
  );

  const featured = upcoming.find((event) => event.featured) ?? upcoming[0];
  const rest = upcoming.filter((event) => event.id !== featured?.id);
  const filtered =
    filter === "All" ? rest : rest.filter((event) => event.kind === filter);

  return (
    <>
      <section className="relative overflow-hidden border-b border-ink/10">
        <div className="pointer-events-none absolute inset-0 tatami opacity-60" />
        <SectionBackdrop variant="weave" />
        <Aura grid={false} />
        <div className="pointer-events-none absolute -right-40 -top-32 hidden h-[520px] w-[520px] opacity-70 lg:block">
          <RingField />
        </div>

        <div className="relative mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-24">
          <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.32em] text-primary">
            <span className="h-px w-8 bg-primary" />
            Events & club year
          </p>
          <h1 className="mt-7 max-w-2xl font-display text-[clamp(2.4rem,5.4vw,4rem)] font-semibold leading-[0.94] tracking-[-0.035em] text-balance">
            Everything with a date on it.
          </h1>
          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
            Championships, grading boards, seminars and the evenings we simply
            share food. Guests are welcome at all of them — come and watch, or
            ask a coach what you need to take part.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/calendar"
              className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-paper transition-transform hover:-translate-y-0.5">
              <CalendarDays className="h-4 w-4" />
              Calendar view
            </Link>
            <Link
              to="/join"
              className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-6 py-3.5 text-sm font-medium transition-colors hover:border-ink/40 hover:bg-ink/5">
              Join the club
            </Link>
          </div>
        </div>
      </section>

      {events === null && (
        <div className="mx-auto max-w-6xl px-5 py-20 lg:px-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Loading the club year…
          </p>
        </div>
      )}

      {featured && (
        <section className="relative overflow-hidden border-b border-ink/10 bg-secondary/40">
          <SectionBackdrop variant="hatch" className="opacity-80" />
          <div className="relative mx-auto max-w-6xl px-5 py-14 lg:px-8 lg:py-20">
            <Reveal>
              <Link
                to={`/events/${featured.id}`}
                className="group grid gap-0 overflow-hidden rounded-xl border border-ink/12 bg-card lg:grid-cols-[1fr_1.05fr]">
                <div className="relative min-h-[240px] overflow-hidden bg-ink/10 lg:min-h-[360px]">
                  {featured.image_url && (
                    <Image
                      src={featured.image_url}
                      alt={featured.title}
                      className="absolute inset-0 h-full w-full transition-transform duration-700 group-hover:scale-[1.04]"
                      fittingType="fill"
                    />
                  )}
                  <span className="absolute left-5 top-5 rounded-full border border-band-foreground/40 bg-band/60 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-band-foreground backdrop-blur">
                    Next up
                  </span>
                </div>

                <div className="p-6 sm:p-9">
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "rounded-full border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em]",
                        kindStyle(featured.kind).chip,
                      )}>
                      {featured.kind}
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
                      {longDate(featured.start_date)}
                    </span>
                  </div>

                  <h2 className="mt-5 font-display text-[clamp(1.7rem,3vw,2.5rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
                    {featured.title}
                  </h2>
                  {featured.summary && (
                    <p className="mt-4 max-w-md text-[13.5px] leading-relaxed text-muted-foreground">
                      {featured.summary}
                    </p>
                  )}

                  <dl className="mt-7 grid gap-3 border-t border-ink/10 pt-5 sm:grid-cols-2">
                    {featured.start_time && (
                      <div className="flex items-center gap-2 text-[12.5px]">
                        <Clock className="h-3.5 w-3.5 text-primary" />
                        {featured.start_time}
                      </div>
                    )}
                    {featured.venue && (
                      <div className="flex items-center gap-2 text-[12.5px] text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
                        <span className="truncate">{featured.venue}</span>
                      </div>
                    )}
                  </dl>

                  <span className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                    Event details
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            </Reveal>
          </div>
        </section>
      )}

      {upcoming.length > 0 && (
        <section className="relative overflow-hidden">
          <SectionBackdrop variant="dots" className="opacity-70" />
          <div className="relative mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-24">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-primary">
                  Upcoming
                </p>
                <h2 className="mt-4 font-display text-[clamp(1.7rem,3.2vw,2.6rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
                  {upcoming.length} dates ahead
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {["All", ...KINDS].map((kind) => (
                  <button
                    key={kind}
                    type="button"
                    onClick={() => setFilter(kind)}
                    className={cn(
                      "rounded-full border px-3.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] transition-colors",
                      filter === kind
                        ? "border-ink bg-ink text-paper"
                        : "border-ink/15 text-muted-foreground hover:border-ink/35 hover:text-foreground",
                    )}>
                    {kind}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((event, i) => (
                <Reveal key={event.id} delay={i * 0.05}>
                  <EventCard event={event} className="h-full" />
                </Reveal>
              ))}
            </div>

            {filtered.length === 0 && (
              <p className="mt-10 text-[13px] text-muted-foreground">
                No {filter.toLowerCase()} dates on the board yet.
              </p>
            )}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section className="relative overflow-hidden border-y border-ink/10 bg-band text-band-foreground">
          <SectionBackdrop variant="dots" tone="ink" className="opacity-70" />
          <div className="relative mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-20">
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-primary">
              Already run
            </p>
            <h2 className="mt-4 font-display text-[clamp(1.6rem,2.8vw,2.2rem)] font-semibold tracking-[-0.025em]">
              The season behind us
            </h2>

            <ul className="mt-8 divide-y divide-band-foreground/12 border-y border-band-foreground/12">
              {past.map((event) => (
                <li key={event.id}>
                  <Link
                    to={`/events/${event.id}`}
                    className="group flex items-center gap-5 py-4">
                    <span className="grid h-12 w-11 shrink-0 place-items-center rounded-md border border-band-foreground/20 text-center leading-none">
                      <span className="block font-display text-base font-semibold tabular-nums">
                        {dayOf(event.start_date)}
                      </span>
                      <span className="mt-1 block font-mono text-[8px] uppercase tracking-[0.14em] text-band-foreground/50">
                        {monthOf(event.start_date)}
                      </span>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-display text-[16px] font-medium transition-colors group-hover:text-primary">
                        {event.title}
                      </span>
                      <span className="mt-1 block font-mono text-[9px] uppercase tracking-[0.14em] text-band-foreground/45">
                        {event.kind} · {event.venue ?? "Bambili"}
                      </span>
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-band-foreground/30 transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="relative mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-20">
        <div className="flex flex-wrap items-center justify-between gap-6 rounded-lg border border-ink/12 bg-card px-7 py-8">
          <div>
            <p className="font-display text-xl font-semibold tracking-[-0.02em]">
              Plan the term in one screen.
            </p>
            <p className="mt-2 text-[13px] text-muted-foreground">
              The calendar shows every training night alongside these dates.
            </p>
          </div>
          <Link
            to="/calendar"
            className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground">
            Open the calendar
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </>
  );
};

export default Events;
