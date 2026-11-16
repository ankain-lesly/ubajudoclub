import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import type { ClubEvent } from "@/lib/types";
import { dayOf, kindStyle, monthOf, splitEvents } from "@/lib/data/events";
import Reveal from "@/components/visual/Reveal";
import SectionBackdrop from "@/components/visual/SectionBackdrop";
import { cn } from "@/lib/utils";

const EventsPreview = ({ events }: { events: ClubEvent[] }) => {
  const upcoming = splitEvents(events).upcoming.slice(0, 3);

  if (!upcoming.length) return null;

  return (
    <section className="relative overflow-hidden border-y border-ink/10 bg-background">
      <SectionBackdrop variant="rings" className="opacity-70" />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-5 py-16 lg:grid-cols-[0.7fr_1.3fr] lg:px-8 lg:py-20">
        <Reveal>
          <p className="font-mono text-[10px] uppercase tracking-[0.34em] text-primary">
            What is coming
          </p>
          <h2 className="mt-5 font-display text-[clamp(1.8rem,3.4vw,2.6rem)] font-semibold leading-[1] tracking-[-0.03em]">
            Dates on the wall.
          </h2>
          <p className="mt-4 max-w-xs text-[13.5px] leading-relaxed text-muted-foreground">
            Gradings, seminars, championships and the odd shared meal — the club
            year is open to watch.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <Link
              to="/events"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
              All events
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/calendar"
              className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground">
              Calendar view
            </Link>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <ul className="divide-y divide-ink/12 border-y border-ink/12">
            {upcoming.map((event) => (
              <li key={event.id}>
                <Link
                  to={`/events/${event.id}`}
                  className="group flex items-center gap-5 py-4">
                  <span className="grid h-14 w-12 shrink-0 place-items-center rounded-md border border-ink/12 bg-card text-center leading-none">
                    <span className="block font-display text-lg font-semibold tabular-nums">
                      {dayOf(event.start_date)}
                    </span>
                    <span className="mt-1 block font-mono text-[8px] uppercase tracking-[0.16em] text-muted-foreground">
                      {monthOf(event.start_date)}
                    </span>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span
                        className={cn(
                          "rounded-full border px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.14em]",
                          kindStyle(event.kind).chip,
                        )}>
                        {event.kind}
                      </span>
                      {event.start_time && (
                        <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                          {event.start_time}
                        </span>
                      )}
                    </span>
                    <span className="mt-1.5 block truncate font-display text-[17px] font-semibold tracking-[-0.01em] transition-colors group-hover:text-primary">
                      {event.title}
                    </span>
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-foreground/30 transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
};

export default EventsPreview;
