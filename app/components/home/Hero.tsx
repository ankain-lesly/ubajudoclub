import { Link } from "react-router";
import { ArrowUpRight, MapPin, Clock } from "lucide-react";
import { VENUE, WEEK } from "@/lib/data/club";
import Aura from "@/components/visual/Aura";
import RingField from "@/components/visual/RingField";
import HeroBackdrop from "@/components/visual/HeroBackdrop";
import heroJudoAction from "@/assets/images/1ea126a4b_generated_image.avif";

const bars = [58, 72, 64, 81, 69, 88];

const Hero = () => (
  <section className="relative overflow-hidden">
    {/* Cinematic Judo Action Background */}
    <HeroBackdrop
      src={heroJudoAction}
      imageClassName="object-[center_35%]"
      opacityClassName="opacity-50 dark:opacity-60"
    />

    <Aura grid={false} />
    <div className="pointer-events-none absolute -right-40 -top-28 hidden h-[600px] w-[600px] opacity-75 lg:block">
      <RingField />
    </div>
    <div className="pointer-events-none absolute -left-36 bottom-4 hidden h-[360px] w-[360px] opacity-40 lg:block">
      <RingField />
    </div>
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0">
      <div className="rule-fade mx-auto h-px max-w-6xl" />
    </div>

    <div className="relative mx-auto grid max-w-6xl gap-14 px-5 pb-20 pt-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12 lg:px-8 lg:pb-28 lg:pt-24">
      <div className="animate-rise">
        <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.32em] text-primary">
          <span className="h-px w-8 bg-primary" />
          UBa Judo Club · Bambili
        </p>

        <h1 className="mt-7 font-display text-[clamp(2.8rem,7vw,5.3rem)] font-semibold leading-[0.9] tracking-[-0.035em] text-balance">
          Fall soft.
          <br />
          Rise <span className="text-primary">strong.</span>
        </h1>

        <p className="mt-8 max-w-md text-[15px] leading-relaxed text-muted-foreground">
          The University of Bamenda's judo club trains weekly in
          UBa Campus Amphi 100 — ukemi, newaza, and the long
          discipline of grading from white belt to dan.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <Link
            to="/join"
            className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-paper transition-transform hover:-translate-y-0.5">
            Join your first session
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
          <Link
            to="/belts"
            className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-6 py-3.5 text-sm font-medium transition-colors hover:border-ink/40 hover:bg-ink/5">
            The belt pathway
          </Link>
        </div>

        <dl className="mt-12 flex flex-wrap gap-x-10 gap-y-5 border-t border-ink/10 pt-6">
          <div>
            <dt className="font-mono text-[9px] uppercase tracking-[0.24em] text-muted-foreground">
              Mat
            </dt>
            <dd className="mt-1.5 flex items-center gap-1.5 text-[13px] font-medium">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              {VENUE.name}
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[9px] uppercase tracking-[0.24em] text-muted-foreground">
              First whistle
            </dt>
            <dd className="mt-1.5 flex items-center gap-1.5 text-[13px] font-medium">
              <Clock className="h-3.5 w-3.5 text-primary" />
              Mondays · 8:00 AM
            </dd>
          </div>
        </dl>
      </div>

      <div className="relative animate-rise [animation-delay:150ms]">
        <div className="rounded-lg border border-ink/12 bg-card/90 backdrop-blur-md p-6 shadow-[0_30px_80px_-50px_rgba(20,21,15,0.55)]">
          <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.24em] text-muted-foreground">
            <span>Next on the mat</span>
            <span className="flex items-center gap-1.5 text-accent">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
              Open
            </span>
          </div>

          <p className="mt-5 font-display text-[28px] font-semibold leading-none tracking-[-0.02em]">
            Wednesday · 17:30
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            {WEEK[1].focus} — {WEEK[1].group.toLowerCase()}
          </p>

          <div
            className="mt-6 flex items-end justify-between gap-1.5"
            aria-hidden="true">
            {bars.map((h, i) => (
              <span
                key={i}
                className="flex-1 rounded-t-[3px] bg-ink/85 transition-all duration-500"
                style={{ height: `${h * 0.7}px`, opacity: 0.35 + i * 0.11 }}
              />
            ))}
          </div>
          <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
            Attendance · last 6 sessions
          </p>

          <div className="mt-6 border-t border-ink/10 pt-5">
            <p className="text-[13px] leading-relaxed text-muted-foreground">
              Beginners welcome — loaner gis in every size, and no sparring
              until you can fall safely.
            </p>
            <Link
              to="/schedule"
              className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary">
              See the full training week
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Hero;
