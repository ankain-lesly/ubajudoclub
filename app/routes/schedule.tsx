import { Link } from "react-router";
import { ArrowUpRight, MapPin, Clock, Shirt, Info } from "lucide-react";
import SectionHeading from "@/components/visual/SectionHeading";
import Reveal from "@/components/visual/Reveal";
import Aura from "@/components/visual/Aura";
import RingField from "@/components/visual/RingField";
import { VENUE, WEEK } from "@/lib/data/club";

const Schedule = () => (
  <div>
    <section className="relative overflow-hidden border-b border-ink/10">
      <div className="pointer-events-none absolute inset-0 tatami opacity-60" />
      <Aura grid={false} />
      <div className="pointer-events-none absolute -right-40 -top-32 hidden h-[520px] w-[520px] opacity-70 lg:block">
        <RingField />
      </div>
      <div className="relative mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-24">
        <Reveal>
          <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.32em] text-primary">
            <span className="h-px w-8 bg-primary" />
            The training week
          </p>
          <h1 className="mt-6 max-w-2xl font-display text-[clamp(2.4rem,5.5vw,4.2rem)] font-semibold leading-[0.94] tracking-[-0.035em] text-balance">
            Four sessions. One mat.
          </h1>
          <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
            Sessions run through the university term. Arrive ten minutes early
            to help lay the mats — it is part of the etiquette.
          </p>
        </Reveal>
      </div>
    </section>

    <section className="mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-20">
      <div className="grid gap-12 lg:grid-cols-[1.35fr_0.65fr]">
        <div>
          <Reveal>
            <div className="divide-y divide-ink/12 border-y border-ink/12">
              {WEEK.map((session) => (
                <div
                  key={session.day}
                  className="group relative grid gap-x-6 gap-y-1.5 py-7 md:grid-cols-[120px_1fr_auto] md:items-center">
                  <span className="pointer-events-none absolute inset-x-[-1.25rem] inset-y-0 rounded-md bg-primary/[0.055] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <p className="relative flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary/40 transition-colors duration-300 group-hover:bg-primary" />
                    {session.day}
                  </p>
                  <div className="relative">
                    <p className="font-display text-xl font-semibold tracking-[-0.015em] transition-colors duration-300 group-hover:text-primary">
                      {session.focus}
                    </p>
                    <p className="mt-1 text-[13px] text-muted-foreground">
                      {session.group}
                    </p>
                  </div>
                  <p className="relative font-mono text-[12px] tabular-nums text-foreground/80 md:text-right">
                    {session.time}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-ink/12 bg-card p-6">
                <Shirt className="h-4 w-4 text-primary" />
                <h3 className="mt-4 font-display text-base font-semibold">
                  What to bring
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                  A t-shirt and shorts for your first session. Loaner gis are
                  available every size from 150cm up.
                </p>
              </div>
              <div className="rounded-lg border border-ink/12 bg-card p-6">
                <Info className="h-4 w-4 text-primary" />
                <h3 className="mt-4 font-display text-base font-semibold">
                  Term breaks
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                  The mat closes during university examination weeks and reopens
                  the Monday after results are published.
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <aside className="relative sticky top-24 overflow-hidden rounded-lg bg-band p-7 text-band-foreground">
            <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-primary/25 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-16 h-44 w-44 rounded-full border border-band-foreground/10" />
            <p className="relative font-mono text-[9px] uppercase tracking-[0.24em] text-band-foreground/50">
              Venue
            </p>
            <h2 className="relative mt-4 font-display text-2xl font-semibold leading-tight tracking-[-0.02em]">
              {VENUE.name}
            </h2>
            <p className="relative mt-3 flex items-start gap-2 text-[13px] leading-relaxed text-band-foreground/65">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
              {VENUE.campus}, {VENUE.region}
            </p>
            <p className="relative mt-5 flex items-start gap-2 text-[13px] leading-relaxed text-band-foreground/65">
              <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
              {VENUE.note}
            </p>
            <Link
              to="/join"
              className="group relative mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-[13px] font-semibold text-primary-foreground">
              Tell a coach you're coming
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </aside>
        </Reveal>
      </div>
    </section>
  </div>
);

export default Schedule;
