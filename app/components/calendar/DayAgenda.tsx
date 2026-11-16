import { Link } from "react-router";
import { format } from "date-fns";
import { ArrowUpRight, Clock } from "lucide-react";
import { VENUE } from "@/lib/data/club";
import { eventsOn, kindStyle, sessionsOn } from "@/lib/data/events";
import type { ClubEvent } from "@/lib/types";
import { cn } from "@/lib/utils";

interface DayAgendaProps {
  day: Date;
  events: ClubEvent[];
}

const DayAgenda = ({ day, events }: DayAgendaProps) => {
  const sessions = sessionsOn(day);
  const dayEvents = eventsOn(events, day);
  const empty = !sessions.length && !dayEvents.length;

  return (
    <div className="rounded-lg border border-ink/12 bg-card">
      <div className="border-b border-ink/10 px-5 py-4">
        <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-muted-foreground">
          Selected day
        </p>
        <p className="mt-2 font-display text-xl font-semibold leading-none tracking-[-0.015em]">
          {format(day, "EEEE d MMMM")}
        </p>
      </div>

      <div className="divide-y divide-ink/8">
        {sessions.map((session) => (
          <div key={session.day} className="px-5 py-4">
            <p className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-primary">
              <Clock className="h-3 w-3" />
              {session.time} · Training
            </p>
            <p className="mt-2 text-[13.5px] font-medium">{session.focus}</p>
            <p className="mt-1 text-[12px] text-muted-foreground">
              {session.group} · {VENUE.name}
            </p>
          </div>
        ))}

        {dayEvents.map((event) => (
          <Link
            key={event.id}
            to={`/events/${event.id}`}
            className="group block px-5 py-4 transition-colors hover:bg-secondary/50">
            <span
              className={cn(
                "inline-flex rounded-full border px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.14em]",
                kindStyle(event.kind).chip,
              )}>
              {event.kind}
            </span>
            <p className="mt-2 flex items-center gap-1.5 text-[13.5px] font-medium transition-colors group-hover:text-primary">
              {event.title}
              <ArrowUpRight className="h-3.5 w-3.5 opacity-40" />
            </p>
            <p className="mt-1 text-[12px] text-muted-foreground">
              {event.start_time ? `${event.start_time} · ` : ""}
              {event.venue ?? VENUE.name}
            </p>
          </Link>
        ))}

        {empty && (
          <p className="px-5 py-10 text-center text-[13px] leading-relaxed text-muted-foreground">
            Nothing on the mat this day. Rest is part of the programme.
          </p>
        )}
      </div>
    </div>
  );
};

export default DayAgenda;
