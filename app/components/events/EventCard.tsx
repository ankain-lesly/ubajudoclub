import { Link } from "react-router";
import { ArrowUpRight, Clock, MapPin } from "lucide-react";
import { Image } from "@/components/ui/image";
import { dayOf, kindStyle, monthOf, shortDate } from "@/lib/data/events";
import type { ClubEvent } from "@/lib/types";
import { cn } from "@/lib/utils";

interface EventCardProps {
  event: ClubEvent;
  className?: string;
}

const EventCard = ({ event, className }: EventCardProps) => {
  const kind = kindStyle(event.kind);

  return (
    <Link
      to={`/events/${event.id}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-lg border border-ink/12 bg-card transition-all duration-500 hover:-translate-y-1 hover:border-ink/30 hover:shadow-[0_28px_60px_-45px_rgba(20,21,15,0.6)]",
        className,
      )}>
      <div className="relative overflow-hidden bg-ink/10">
        {event.image_url ? (
          <Image
            src={event.image_url}
            alt={event.title}
            className="h-44 w-full transition-transform duration-700 group-hover:scale-[1.04]"
            fittingType="fill"
          />
        ) : (
          <div className="h-44 w-full bg-ink/10" />
        )}
        <span className="absolute left-4 top-4 grid h-14 w-12 place-items-center rounded-md bg-band/95 text-center leading-none text-band-foreground backdrop-blur">
          <span className="block font-display text-lg font-semibold tabular-nums">
            {dayOf(event.start_date)}
          </span>
          <span className="mt-1 block font-mono text-[8px] uppercase tracking-[0.18em] text-band-foreground/60">
            {monthOf(event.start_date)}
          </span>
        </span>
        <span
          className={cn(
            "absolute right-4 top-4 rounded-full border px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.16em] backdrop-blur",
            kind.chip,
          )}>
          {event.kind}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
          {shortDate(event.start_date)}
        </p>
        <h3 className="mt-2 font-display text-[19px] font-semibold leading-[1.15] tracking-[-0.015em] transition-colors group-hover:text-primary">
          {event.title}
        </h3>
        {event.summary && (
          <p className="mt-2.5 text-[13px] leading-relaxed text-muted-foreground">
            {event.summary}
          </p>
        )}

        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-5 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
          {event.start_time && (
            <span className="flex items-center gap-1.5">
              <Clock className="h-3 w-3 text-primary" />
              {event.start_time}
            </span>
          )}
          {event.venue && (
            <span className="flex min-w-0 items-center gap-1.5">
              <MapPin className="h-3 w-3 text-primary" />
              <span className="truncate">{event.venue}</span>
            </span>
          )}
          <ArrowUpRight className="ml-auto h-3.5 w-3.5 shrink-0 text-foreground/40 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
