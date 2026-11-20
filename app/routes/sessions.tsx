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
  Film,
  Play,
} from "lucide-react";
import { getPublicSessions } from "@/lib/server/public";
import { Image } from "@/components/ui/image";
import Aura from "@/components/visual/Aura";
import RingField from "@/components/visual/RingField";
import Reveal from "@/components/visual/Reveal";
import HeroBackdrop from "@/components/visual/HeroBackdrop";
import heroMatAction from "@/assets/images/132f87024_generated_5ca68e15.avif";
import { cn } from "@/lib/utils";
import { getOgImageUrl, isVideoUrl } from "@/lib/media/cloudinary";
import type { Route } from "./+types/sessions";

export function meta({ loaderData }: Route.MetaArgs): Route.MetaDescriptors {
  const sessions = loaderData?.sessions || [];
  const firstSession = sessions[0];
  const selectedMedia =
    firstSession?.media?.find((m) => m.media_type === "IMAGE") ??
    firstSession?.media?.[0];
  const firstImage = selectedMedia
    ? getOgImageUrl(selectedMedia.url, selectedMedia.media_type)
    : undefined;
  const description =
    "Explore training logs, syllabus focuses, and photo captures from UBa Judo Club at UBa Campus Amphi 100.";

  return [
    { title: "Mat Sessions — UBa Judo Club" },
    { name: "description", content: description },
    { property: "og:site_name", content: "UBa Judo Club" },
    { property: "og:title", content: "Mat Sessions — UBa Judo Club" },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    ...(firstImage
      ? [
          { property: "og:image", content: firstImage },
          { property: "og:image:width", content: "1200" },
          { property: "og:image:height", content: "630" },
          { property: "og:image:type", content: "image/jpeg" },
          { property: "og:image:alt", content: "UBa Judo Club Mat Sessions" },
          { name: "twitter:image", content: firstImage },
        ]
      : []),
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Mat Sessions — UBa Judo Club" },
    { name: "twitter:description", content: description },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const sessions = await getPublicSessions(request);
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
        {/* Cinematic Kumi-Kata Mat Action Background */}
        <HeroBackdrop
          src={heroMatAction}
          imageClassName="object-[center_30%]"
          opacityClassName="opacity-50 dark:opacity-60"
        />

        <Aura grid={false} />
        <div className="pointer-events-none absolute -right-40 -top-32 hidden h-[520px] w-[520px] opacity-70 lg:block">
          <RingField />
        </div>

        <div className="relative mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-24">
          <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.32em] text-primary">
            <span className="h-px w-8 bg-primary" />
            UBa Judo Sessions
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
          <div className="mt-10 inline-flex flex-wrap items-center gap-6 rounded-2xl border border-ink/10 bg-card/60 p-6 backdrop-blur-md sm:gap-12">
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
                  {firstMedia && (() => {
                    const isVideo = firstMedia.media_type === "VIDEO" || isVideoUrl(firstMedia.url);
                    const hasImageThumb = firstMedia.thumbnail_url && !isVideoUrl(firstMedia.thumbnail_url);

                    return (
                      <div className="relative mt-5 overflow-hidden rounded-lg border border-ink/10 bg-band">
                        {isVideo && !hasImageThumb ? (
                          <video
                            src={firstMedia.url}
                            preload="metadata"
                            muted
                            playsInline
                            className="h-36 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <Image
                            src={firstMedia.thumbnail_url || firstMedia.url}
                            alt={firstMedia.caption || session.focus || "Session preview"}
                            className="h-36 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-band/75 via-transparent to-transparent pointer-events-none" />
                        {isVideo && (
                          <div className="absolute top-2.5 right-3 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[9px] font-mono text-white backdrop-blur-xs pointer-events-none">
                            <Film className="h-3 w-3" />
                            <span>VIDEO</span>
                          </div>
                        )}
                        <div className="absolute bottom-2.5 left-3 flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-band-foreground pointer-events-none">
                          <Camera className="h-3 w-3" />
                          <span>{session.media?.length} capture{session.media?.length === 1 ? "" : "s"}</span>
                        </div>
                      </div>
                    );
                  })()}
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
