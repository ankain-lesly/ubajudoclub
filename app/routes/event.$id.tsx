import { Link, data } from "react-router";
import { ArrowLeft, CalendarDays, Clock, MapPin, Ticket } from "lucide-react";
import type { Route } from "./+types/event.$id";
import { Image } from "@/components/ui/image";
import { getEvent, listEvents } from "@/lib/server/public";
import { dayOf, isUpcoming, kindStyle, longDate, monthOf } from "@/lib/data/events";
import EventCard from "@/components/events/EventCard";
import Aura from "@/components/visual/Aura";
import Reveal from "@/components/visual/Reveal";
import SectionBackdrop from "@/components/visual/SectionBackdrop";
import { cn } from "@/lib/utils";
import { getOgImageUrl } from "@/lib/media/cloudinary";

export async function loader({ params }: Route.LoaderArgs) {
  const [event, all] = await Promise.all([getEvent(params.id), listEvents(30)]);
  if (!event) throw data(null, { status: 404 });
  const others = all
    .filter((item) => item.id !== event.id && isUpcoming(item))
    .slice(0, 2);
  return { event, others };
}

export function meta({ loaderData }: Route.MetaArgs) {
  if (!loaderData) return [{ title: "Event not found — UBa Judo Club" }];
  const { event } = loaderData;
  const description = event.summary ?? event.description ?? undefined;
  const ogImage = event.image_url ? getOgImageUrl(event.image_url, "image") : undefined;
  return [
    { title: `${event.title} — UBa Judo Club` },
    ...(description ? [{ name: "description", content: description }] : []),
    { property: "og:site_name", content: "UBa Judo Club" },
    { property: "og:title", content: event.title },
    ...(description ? [{ property: "og:description", content: description }] : []),
    ...(ogImage
      ? [
          { property: "og:image", content: ogImage },
          { property: "og:image:width", content: "1200" },
          { property: "og:image:height", content: "630" },
          { property: "og:image:type", content: "image/jpeg" },
          { name: "twitter:card", content: "summary_large_image" },
          { name: "twitter:image", content: ogImage },
        ]
      : []),
  ];
}

export function ErrorBoundary() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-24 text-center lg:px-8 lg:py-32">
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">
        Event not found
      </p>
      <h1 className="mt-5 font-display text-[clamp(2rem,4vw,3rem)] font-semibold tracking-[-0.03em]">
        That date has left the board.
      </h1>
      <Link
        to="/events"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-paper">
        <ArrowLeft className="h-4 w-4" />
        Back to all events
      </Link>
    </section>
  );
}

const EventDetail = ({ loaderData }: Route.ComponentProps) => {
  const { event, others } = loaderData;
  const paragraphs = (event.description ?? event.summary ?? "")
    .split("\n\n")
    .filter(Boolean);

  return (
    <>
      <section className="relative overflow-hidden border-b border-ink/10">
        <SectionBackdrop variant="rings" className="opacity-80" />
        <Aura grid={false} className="opacity-80" />
        <div className="relative mx-auto max-w-6xl px-5 py-12 lg:px-8 lg:py-20">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="h-3.5 w-3.5" />
            All events
          </Link>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14">
            <div className="animate-rise">
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={cn(
                    "rounded-full border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em]",
                    kindStyle(event.kind).chip,
                  )}>
                  {event.kind}
                </span>
                <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                  {longDate(event.start_date)}
                </span>
              </div>

              <h1 className="mt-6 font-display text-[clamp(2.1rem,4.6vw,3.5rem)] font-semibold leading-[0.96] tracking-[-0.035em] text-balance">
                {event.title}
              </h1>
              {event.summary && (
                <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
                  {event.summary}
                </p>
              )}

              <dl className="mt-9 grid gap-4 border-t border-ink/10 pt-6 sm:grid-cols-2">
                <div className="flex items-start gap-2.5">
                  <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <div>
                    <dt className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                      Date
                    </dt>
                    <dd className="mt-1 text-[13px] font-medium">
                      {longDate(event.start_date)}
                    </dd>
                  </div>
                </div>
                {event.start_time && (
                  <div className="flex items-start gap-2.5">
                    <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <div>
                      <dt className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                        Start
                      </dt>
                      <dd className="mt-1 text-[13px] font-medium">
                        {event.start_time}
                      </dd>
                    </div>
                  </div>
                )}
                {event.venue && (
                  <div className="flex items-start gap-2.5">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <div>
                      <dt className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                        Venue
                      </dt>
                      <dd className="mt-1 text-[13px] font-medium">
                        {event.venue}
                      </dd>
                    </div>
                  </div>
                )}
                {event.entry_note && (
                  <div className="flex items-start gap-2.5">
                    <Ticket className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <div>
                      <dt className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                        Entry
                      </dt>
                      <dd className="mt-1 text-[13px] font-medium">
                        {event.entry_note}
                      </dd>
                    </div>
                  </div>
                )}
              </dl>
            </div>

            <div className="relative animate-rise [animation-delay:120ms]">
              <figure className="relative overflow-hidden rounded-xl border border-ink/12 bg-band">
                {event.image_url ? (
                  <Image
                    src={event.image_url}
                    alt={event.title}
                    className="h-[300px] w-full sm:h-[420px]"
                    fittingType="fill"
                  />
                ) : (
                  <div className="h-[300px] w-full sm:h-[420px]" />
                )}
                <figcaption className="absolute left-4 top-4 grid h-16 w-14 place-items-center rounded-md bg-band/95 text-center leading-none text-band-foreground backdrop-blur">
                  <span className="block font-display text-xl font-semibold tabular-nums">
                    {dayOf(event.start_date)}
                  </span>
                  <span className="mt-1 block font-mono text-[8px] uppercase tracking-[0.16em] text-band-foreground/60">
                    {monthOf(event.start_date)}
                  </span>
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden">
        <SectionBackdrop variant="weave" className="opacity-70" />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-5 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-24">
          <Reveal>
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-primary">
              About this event
            </p>
            <div className="mt-6 space-y-4">
              {paragraphs.map((paragraph, i) => (
                <p
                  key={i}
                  className="text-[14.5px] leading-[1.75] text-foreground/85">
                  {paragraph}
                </p>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="rounded-lg border border-ink/12 bg-card p-6">
              <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
                Taking part
              </p>
              <p className="mt-4 text-[13px] leading-relaxed text-muted-foreground">
                {event.entry_note ??
                  "Open to club members and guests. Speak to a coach at any training night for the details."}
              </p>
              <div className="mt-6 flex flex-col gap-2">
                <Link
                  to="/calendar"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-[13px] font-semibold text-paper transition-transform hover:-translate-y-0.5">
                  <CalendarDays className="h-4 w-4" />
                  See it on the calendar
                </Link>
                <Link
                  to="/join"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/20 px-5 py-3 text-[13px] font-medium transition-colors hover:border-ink/40 hover:bg-ink/5">
                  Train with us first
                </Link>
              </div>
              <p className="mt-5 border-t border-ink/10 pt-4 font-mono text-[9px] uppercase leading-relaxed tracking-[0.14em] text-muted-foreground">
                Bambili Campus · North West Region
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {others.length > 0 && (
        <section className="border-t border-ink/10 bg-secondary/40">
          <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-20">
            <div className="flex items-end justify-between gap-6">
              <h2 className="font-display text-[clamp(1.5rem,2.6vw,2rem)] font-semibold tracking-[-0.025em]">
                Also ahead
              </h2>
              <Link
                to="/events"
                className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
                All events
              </Link>
            </div>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {others.map((item) => (
                <EventCard key={item.id} event={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default EventDetail;