import { useMemo, useState } from "react";
import { Link } from "react-router";
import {
  CalendarDays,
  Clock,
  Users,
  Camera,
  ArrowRight,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { getMockSessions } from "@/lib/data/sessions";
import { Image } from "@/components/ui/image";
import Aura from "@/components/visual/Aura";
import RingField from "@/components/visual/RingField";
import Reveal from "@/components/visual/Reveal";
import SectionBackdrop from "@/components/visual/SectionBackdrop";
import { cn } from "@/lib/utils";
import type { Route } from "./+types/sessions";

export function meta(): Route.MetaDescriptors {
  const sessions = getMockSessions();
  const firstSession = sessions[0];
  const firstImage = firstSession?.media?.[0]?.url;

  return [
    { title: "Mat Sessions — UBa Judo Club" },
    {
      name: "description",
      content:
        "Every training night and Saturday morning on the Bambili Campus tatami. Syllabus, focus notes, attendee counts, and mat photography.",
    },
    { property: "og:title", content: "Mat Sessions — UBa Judo Club" },
    {
      property: "og:description",
      content:
        "Explore training logs, technical syllabus focuses, and photography from UBa Judo Club sessions.",
    },
    ...(firstImage ? [{ property: "og:image", content: firstImage }] : []),
    { name: "twitter:card", content: "summary_large_image" },
  ];
}

export async function loader() {
  const sessions = getMockSessions();
  return { sessions };
}

function formatDate(isoString?: string) {
  if (!isoString) return "";
  const d = new Date(`${isoString}T12:00:00`);
  return d.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const Sessions = ({ loaderData }: Route.ComponentProps) => {
  const { sessions } = loaderData;
  const [filter, setFilter] = useState<"all" | "recent" | "upcoming">("all");

  const today = new Date().toISOString().slice(0, 10);

  const filteredSessions = useMemo(() => {
    if (filter === "recent") {
      return sessions.filter((s) => (s.session_date || "") <= today);
    }
    if (filter === "upcoming") {
      return sessions.filter((s) => (s.session_date || "") > today);
    }
    return sessions;
  }, [sessions, filter, today]);

  const totalAttendees = useMemo(
    () => sessions.reduce((acc, s) => acc + (s.attended_count || 0), 0),
    [sessions],
  );

  const totalMedia = useMemo(
    () => sessions.reduce((acc, s) => acc + (s.media?.length || 0), 0),
    [sessions],
  );

  return (
    <>
      {/* Hero Section */}
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
            Bambili Tatami Logs
          </p>
          <h1 className="mt-7 max-w-2xl font-display text-[clamp(2.4rem,5.4vw,4rem)] font-semibold leading-[0.94] tracking-[-0.035em] text-balance">
            Every session on the record.
          </h1>
          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
            From beginners’ ukemi rolls to senior grading randori. View the
            technical focus, coaching rosters, attendee counts, and mat
            photography from each session.
          </p>

          {/* Stat Strip */}
          <div className="mt-10 flex flex-wrap items-center gap-6 border-t border-ink/10 pt-8 sm:gap-12">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                Sessions Logged
              </p>
              <p className="mt-1 font-display text-2xl font-semibold tracking-tight">
                {sessions.length}
              </p>
            </div>
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                Total Check-ins
              </p>
              <p className="mt-1 font-display text-2xl font-semibold tracking-tight">
                {totalAttendees}
              </p>
            </div>
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                Mat Captures
              </p>
              <p className="mt-1 font-display text-2xl font-semibold tracking-tight">
                {totalMedia} photos
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Tabs & Content */}
      <section className="mx-auto max-w-6xl px-5 py-12 lg:px-8 lg:py-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            {(["all", "recent", "upcoming"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                className={cn(
                  "rounded-full px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] transition-all",
                  filter === tab
                    ? "bg-ink text-paper shadow-sm"
                    : "border border-ink/12 text-muted-foreground hover:border-ink/30 hover:text-foreground",
                )}
              >
                {tab === "all"
                  ? "All Sessions"
                  : tab === "recent"
                    ? "Completed"
                    : "Upcoming"}
              </button>
            ))}
          </div>

          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Showing {filteredSessions.length} sessions
          </p>
        </div>

        {/* Sessions Grid */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {filteredSessions.map((session) => {
            const firstMedia = session.media?.[0];
            const isUpcoming = (session.session_date || "") > today;

            return (
              <Link
                key={session.id}
                to={`/sessions/${session.id}`}
                className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-ink/12 bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-ink/35 hover:shadow-[0_20px_40px_-25px_rgba(20,21,15,0.4)]"
              >
                <div>
                  {/* Top Bar: Date & Status */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {formatDate(session.session_date)}
                    </span>
                    <span
                      className={cn(
                        "rounded-full border px-2.5 py-0.5 font-mono text-[8.5px] uppercase tracking-[0.14em]",
                        isUpcoming
                          ? "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400"
                          : "border-primary/20 bg-primary/10 text-primary",
                      )}
                    >
                      {isUpcoming ? "Scheduled" : "Concluded"}
                    </span>
                  </div>

                  {/* Focus Title */}
                  <h2 className="mt-4 font-display text-xl font-semibold leading-snug tracking-[-0.015em] transition-colors group-hover:text-primary">
                    {session.focus}
                  </h2>

                  {/* Coach & Times */}
                  <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5 font-mono text-[11px]">
                      <Clock className="h-3 w-3 text-primary/70" />
                      {session.start_time} – {session.end_time}
                    </span>
                    <span>•</span>
                    <span className="font-medium text-foreground/80">
                      {session.coach}
                    </span>
                  </div>

                  {/* Notes snippet */}
                  {session.notes && (
                    <p className="mt-3 line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">
                      {session.notes}
                    </p>
                  )}

                  {/* First Media Preview Thumbnail */}
                  {firstMedia && (
                    <div className="relative mt-5 overflow-hidden rounded-lg border border-ink/10 bg-band">
                      <Image
                        src={firstMedia.url}
                        alt={firstMedia.caption || session.focus || "Session photo"}
                        className="h-36 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-band/75 via-transparent to-transparent" />
                      <div className="absolute bottom-2.5 left-3 flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-band-foreground">
                        <Camera className="h-3 w-3" />
                        <span>{session.media?.length} photo capture{session.media?.length === 1 ? "" : "s"}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                <div className="mt-6 flex items-center justify-between border-t border-ink/8 pt-4">
                  <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                    <Users className="h-3.5 w-3.5 text-primary/70" />
                    <span>
                      {session.attended_count
                        ? `${session.attended_count} Judoka checked in`
                        : "Turnout pending"}
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary transition-transform group-hover:translate-x-1">
                    Details
                    <ChevronRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
};

export default Sessions;
