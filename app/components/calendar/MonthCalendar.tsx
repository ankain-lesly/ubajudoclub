import {
  addDays,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { eventsOn, kindStyle, sessionsOn } from "@/lib/data/events";
import type { ClubEvent } from "@/lib/types";
import { cn } from "@/lib/utils";

interface MonthCalendarProps {
  month: Date;
  events: ClubEvent[];
  selected: Date;
  onSelect: (day: Date) => void;
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const MonthCalendar = ({
  month,
  events,
  selected,
  onSelect,
}: MonthCalendarProps) => {
  const start = startOfWeek(startOfMonth(month), { weekStartsOn: 1 });
  const end = endOfWeek(endOfMonth(month), { weekStartsOn: 1 });

  const days: Date[] = [];
  for (let d = start; d <= end; d = addDays(d, 1)) days.push(d);

  return (
    <div className="overflow-hidden rounded-lg border border-ink/12 bg-card">
      <div className="border-b border-ink/10 px-5 py-4">
        <p className="font-display text-xl font-semibold leading-none tracking-[-0.015em]">
          {format(month, "MMMM yyyy")}
        </p>
      </div>

      <div className="grid grid-cols-7 border-b border-ink/10">
        {WEEKDAYS.map((label) => (
          <div
            key={label}
            className="py-2 text-center font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {days.map((day) => {
          const dayEvents = eventsOn(events, day);
          const training = sessionsOn(day).length > 0;
          const inMonth = isSameMonth(day, month);
          const active = isSameDay(day, selected);

          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => onSelect(day)}
              aria-pressed={active}
              aria-label={format(day, "EEEE d MMMM")}
              className={cn(
                "flex min-h-[64px] flex-col items-start gap-1.5 border-b border-r border-ink/8 p-2 text-left transition-colors hover:bg-secondary/60",
                !inMonth && "text-muted-foreground/50",
                active && "bg-primary/10 ring-1 ring-inset ring-primary",
              )}>
              <span
                className={cn(
                  "text-[12px] font-medium",
                  isToday(day) && "text-primary",
                )}>
                {format(day, "d")}
              </span>
              <span className="flex flex-wrap gap-1">
                {training && (
                  <span className="h-1.5 w-1.5 rounded-full bg-ink/30" />
                )}
                {dayEvents.map((event) => (
                  <span
                    key={event.id}
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      kindStyle(event.kind).dot,
                    )}
                  />
                ))}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MonthCalendar;