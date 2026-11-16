import { useEffect, useState } from "react";
import { Link, data } from "react-router";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  MapPin,
  Users,
  ShieldCheck,
  Camera,
  Share2,
  Check,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { getPublicSessionById } from "@/lib/api/public";
import { Image } from "@/components/ui/image";
import Aura from "@/components/visual/Aura";
import Reveal from "@/components/visual/Reveal";
import SectionBackdrop from "@/components/visual/SectionBackdrop";
import { VENUE } from "@/lib/data/club";
import { cn } from "@/lib/utils";
import type { Route } from "./+types/session.$id";

export async function loader({ params, request }: Route.LoaderArgs) {
  const { session, others } = await getPublicSessionById(params.id, request);
  if (!session) {
    throw data(null, { status: 404 });
  }
  return { session, others };
}

export function meta({ loaderData }: Route.MetaArgs) {
  if (!loaderData) {
    return [{ title: "Session not found — UBa Judo Club" }];
  }
  const { session } = loaderData;
  // Get first media of type IMAGE, otherwise fallback to the first media item
  const selectedMedia =
    session.media?.find((m) => m.media_type === "IMAGE") ??
    session.media?.[0];
  const firstMediaImage = selectedMedia?.thumbnail_url || selectedMedia?.url;
  const title = `${session.focus || "Training Session"} — UBa Judo Club`;
  
  // Compact social description under 125 characters with high-converting CTA
  const baseDesc = session.notes ? session.notes.replace(/\s+/g, ' ').trim() : "";
  const description =
    baseDesc.length > 0 && baseDesc.length <= 118
      ? baseDesc
      : baseDesc.length > 118
        ? `${baseDesc.slice(0, 115).trim()}…`
        : `Bambili mat session with ${session.coach || "coaches"}. Explore syllabus & photos.`;

  return [
    { title },
    { name: "description", content: description },
    { property: "og:site_name", content: "UBa Judo Club" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "article" },
    ...(firstMediaImage
      ? [
          { property: "og:image", content: firstMediaImage },
          { property: "og:image:width", content: "1200" },
          { property: "og:image:height", content: "630" },
          { property: "og:image:type", content: "image/jpeg" },
          { property: "og:image:alt", content: `${session.focus || "Session"} — UBa Judo Club Bambili Mat` },
          { name: "twitter:image", content: firstMediaImage },
        ]
      : []),
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
  ];
}

export function ErrorBoundary() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-24 text-center lg:px-8 lg:py-32">
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">
        Session not found
      </p>
      <h1 className="mt-5 font-display text-[clamp(2rem,4vw,3rem)] font-semibold tracking-[-0.03em]">
        That mat record does not exist.
      </h1>
      <p className="mx-auto mt-4 max-w-md text-sm text-muted-foreground">
        The session you are looking for may have been rescheduled or removed from
        the public log.
      </p>
      <Link
        to="/sessions"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-paper"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to all sessions
      </Link>
    </section>
  );
}

function formatDate(isoString?: string) {
  if (!isoString) return "";
  const d = new Date(`${isoString}T12:00:00`);
  return d.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const SessionDetail = ({ loaderData }: Route.ComponentProps) => {
  const { session, others } = loaderData;
  const [activeMediaIndex, setActiveMediaIndex] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const firstMedia = session.media?.[0];

  useEffect(() => {
    if (activeMediaIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveMediaIndex(null);
      } else if (e.key === "ArrowLeft") {
        setActiveMediaIndex((i) => (i !== null && i > 0 ? i - 1 : i));
      } else if (e.key === "ArrowRight") {
        setActiveMediaIndex((i) =>
          i !== null && session.media && i < session.media.length - 1 ? i + 1 : i,
        );
      }
    };
    window.addEventListener("keydown", onKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [activeMediaIndex, session.media]);

  const handleShare = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {}
  };

  return (
    <>
      <section className="relative overflow-hidden border-b border-ink/10">
        <SectionBackdrop variant="rings" className="opacity-80" />
        <Aura grid={false} className="opacity-80" />

        <div className="relative mx-auto max-w-6xl px-5 py-12 lg:px-8 lg:py-20">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center justify-between">
            <Link
              to="/sessions"
              className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              All Sessions
            </Link>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 rounded-full border border-ink/12 bg-card px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 text-emerald-500" />
                  Copied link
                </>
              ) : (
                <>
                  <Share2 className="h-3 w-3" />
                  Share Session
                </>
              )}
            </button>
          </div>

          {/* Session Header Intel */}
          <div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-14">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-primary">
                  {formatDate(session.session_date)}
                </span>
                {session.attended_count ? (
                  <span className="flex items-center gap-1.5 rounded-full border border-ink/12 bg-secondary/50 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
                    <Users className="h-3 w-3" />
                    {session.attended_count} Checked in
                  </span>
                ) : null}
              </div>

              <h1 className="mt-5 font-display text-[clamp(2.2rem,4.5vw,3.5rem)] font-semibold leading-[0.96] tracking-[-0.03em] text-balance">
                {session.focus}
              </h1>

              <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="font-mono text-xs tabular-nums text-foreground/80">
                    {session.start_time} – {session.end_time}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>{VENUE.name}</span>
                </div>
              </div>

              {/* Coach and Coordinators bar */}
              <div className="mt-8 rounded-xl border border-ink/10 bg-card p-5">
                <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
                  Head Instructor & Roster
                </p>
                <p className="mt-2 font-display text-lg font-semibold text-foreground">
                  {session.coach}
                </p>

                {session.coordinators && session.coordinators.length > 0 && (
                  <div className="mt-4 border-t border-ink/8 pt-3">
                    <p className="font-mono text-[8.5px] uppercase tracking-[0.18em] text-muted-foreground">
                      Assisting Coordinators
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {session.coordinators.map((c) => (
                        <span
                          key={c.id}
                          className="inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-secondary/40 px-3 py-1 text-xs"
                        >
                          <ShieldCheck className="h-3 w-3 text-primary" />
                          <span className="font-medium">
                            {c.member?.full_name || "Club Coordinator"}
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            ({c.role})
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* First Session Media (Featured Banner) */}
            <div>
              {firstMedia ? (
                <figure className="group relative overflow-hidden rounded-2xl border border-ink/12 bg-band shadow-[0_30px_70px_-35px_rgba(20,21,15,0.7)]">
                  <Image
                    src={firstMedia.url}
                    alt={firstMedia.caption || session.focus || "Session banner"}
                    className="h-[340px] w-full object-cover transition-transform duration-700 group-hover:scale-105 sm:h-[420px]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-band/90 via-band/20 to-transparent" />
                  <figcaption className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                    <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-primary">
                      Official Session Capture
                    </p>
                    <p className="mt-1 text-sm font-medium leading-snug text-band-foreground">
                      {firstMedia.caption}
                    </p>
                  </figcaption>
                  <button
                    type="button"
                    onClick={() => setActiveMediaIndex(0)}
                    className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-band/75 text-band-foreground backdrop-blur-md transition-transform hover:scale-110"
                    aria-label="View photo fullscreen"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                </figure>
              ) : (
                <div className="flex h-[320px] w-full flex-col items-center justify-center rounded-2xl border border-ink/12 bg-card p-8 text-center text-muted-foreground">
                  <Camera className="h-8 w-8 text-muted-foreground/40" />
                  <p className="mt-3 font-display text-base font-medium">
                    No visual media attached to this session
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Syllabus Notes & Full Media Gallery */}
      <section className="mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          {/* Notes column */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-primary">
              Technical Syllabus & Debrief
            </p>
            <h2 className="mt-3 font-display text-2xl font-semibold tracking-[-0.02em]">
              Coach's Mat Briefing
            </h2>
            <div className="mt-6 rounded-xl border border-ink/10 bg-card p-6 leading-relaxed text-muted-foreground sm:p-8">
              <p className="text-[15px] leading-relaxed text-foreground/90">
                {session.notes}
              </p>
              <div className="mt-8 border-t border-ink/8 pt-6">
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                  Dojo Protocol Reminder
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Attendance is logged immediately after final bow (Rei-ho). Ensure
                  your clean white or blue judogi is folded neatly before stepping
                  off the tatami.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Prominent Large Media Cards Section */}
        {session.media && session.media.length > 0 && (
          <div className="mt-16 border-t border-ink/10 pt-14">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-primary">
                  Visual Archive & Mat Captures
                </p>
                <h2 className="mt-2 font-display text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">
                  Session Photography ({session.media.length})
                </h2>
              </div>
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Click any frame for interactive fullscreen preview
              </p>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {session.media.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveMediaIndex(idx)}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-ink/12 bg-card text-left transition-all duration-300 hover:-translate-y-1 hover:border-ink/30 hover:shadow-2xl"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-band">
                    <Image
                      src={item.thumbnail_url || item.url}
                      alt={item.caption || `Capture frame ${idx + 1}`}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-band/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <span className="absolute right-3.5 top-3.5 grid h-9 w-9 place-items-center rounded-full bg-band/75 text-band-foreground backdrop-blur-md transition-transform duration-300 group-hover:scale-110">
                      <Camera className="h-4 w-4" />
                    </span>
                    <span className="absolute bottom-3 left-3 rounded-full border border-band-foreground/20 bg-band/70 px-2.5 py-0.5 font-mono text-[8.5px] uppercase tracking-[0.16em] text-band-foreground backdrop-blur-sm">
                      Frame {String(idx + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col justify-between p-5">
                    <p className="text-[13.5px] font-medium leading-snug text-foreground/90 transition-colors group-hover:text-primary">
                      {item.caption || "Mat work & tactical sequence demonstration"}
                    </p>
                    <div className="mt-4 flex items-center justify-between border-t border-ink/8 pt-3 text-[11px] text-muted-foreground">
                      <span className="font-mono uppercase tracking-[0.14em]">
                        {item.media_type}
                      </span>
                      <span className="font-medium text-primary group-hover:underline">
                        Expand photo →
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Other Sessions Carousel/Preview */}
        {others.length > 0 && (
          <div className="mt-20 border-t border-ink/10 pt-14">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-primary">
                  Nearby on the calendar
                </p>
                <h3 className="mt-1 font-display text-xl font-semibold">
                  Other Recent Sessions
                </h3>
              </div>
              <Link
                to="/sessions"
                className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary hover:underline"
              >
                View all sessions →
              </Link>
            </div>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {others.map((s) => (
                <Link
                  key={s.id}
                  to={`/sessions/${s.id}`}
                  className="group flex items-center justify-between rounded-xl border border-ink/12 bg-card p-5 transition-all hover:border-ink/30"
                >
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-primary">
                      {formatDate(s.session_date)}
                    </span>
                    <h4 className="mt-1 font-display text-base font-semibold transition-colors group-hover:text-primary">
                      {s.focus}
                    </h4>
                    <span className="mt-1 block font-mono text-[11px] text-muted-foreground">
                      {s.attended_count} Judoka checked in
                    </span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* High-Visibility Fullscreen Preview Modal */}
      {activeMediaIndex !== null && session.media && session.media[activeMediaIndex] && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex flex-col justify-between bg-black/92 p-4 backdrop-blur-xl sm:p-6"
          onClick={() => setActiveMediaIndex(null)}
        >
          {/* Header Bar */}
          <div
            className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-white">
                Frame {activeMediaIndex + 1} / {session.media.length}
              </span>
              <span className="hidden font-mono text-[10px] text-white/50 sm:inline">
                Use ← → arrow keys to navigate, Esc to close
              </span>
            </div>

            <button
              type="button"
              onClick={() => setActiveMediaIndex(null)}
              className="grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-white/10 text-white transition-all hover:scale-105 hover:bg-white/20"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Centered Image with Lateral Controls */}
          <div
            className="relative mx-auto flex w-full max-w-6xl flex-1 items-center justify-center gap-2 py-4 sm:gap-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              disabled={activeMediaIndex === 0}
              onClick={() => setActiveMediaIndex((i) => (i !== null && i > 0 ? i - 1 : i))}
              className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-white/20 bg-white/10 text-white shadow-xl transition-all hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-20"
              aria-label="Previous photo"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <figure className="flex max-h-[80vh] w-full flex-col items-center justify-center">
              <Image
                src={session.media[activeMediaIndex].url}
                alt={session.media[activeMediaIndex].caption || "Session Photo"}
                className="max-h-[70vh] w-auto max-w-full rounded-xl object-contain shadow-2xl ring-1 ring-white/10"
              />
              {session.media[activeMediaIndex].caption && (
                <figcaption className="mt-4 max-w-2xl text-center text-sm font-medium leading-relaxed text-white/90">
                  {session.media[activeMediaIndex].caption}
                </figcaption>
              )}
            </figure>

            <button
              type="button"
              disabled={activeMediaIndex === session.media.length - 1}
              onClick={() =>
                setActiveMediaIndex((i) =>
                  i !== null && session.media && i < session.media.length - 1
                    ? i + 1
                    : i,
                )
              }
              className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-white/20 bg-white/10 text-white shadow-xl transition-all hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-20"
              aria-label="Next photo"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

          {/* Footer Thumbnails Strip */}
          <div
            className="relative z-10 mx-auto flex w-full max-w-4xl justify-center gap-2 overflow-x-auto py-2"
            onClick={(e) => e.stopPropagation()}
          >
            {session.media.map((thumb, idx) => (
              <button
                key={thumb.id}
                type="button"
                onClick={() => setActiveMediaIndex(idx)}
                className={cn(
                  "relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border transition-all",
                  activeMediaIndex === idx
                    ? "border-primary ring-2 ring-primary"
                    : "border-white/20 opacity-50 hover:opacity-100",
                )}
              >
                <Image
                  src={thumb.thumbnail_url || thumb.url}
                  alt={thumb.caption || `Thumbnail ${idx + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default SessionDetail;
