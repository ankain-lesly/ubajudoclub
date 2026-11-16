import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/visual/Reveal";
import SectionHeading from "@/components/visual/SectionHeading";
import SectionBackdrop from "@/components/visual/SectionBackdrop";
import { VENUE, WEEK } from "@/lib/data/club";

const SchedulePreview = () => (
  <section className="relative overflow-hidden border-y border-ink/10 bg-secondary/50">
    <SectionBackdrop variant="hatch" />
    <div className="relative mx-auto max-w-6xl px-5 py-20 lg:px-8 lg:py-28">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="The training week"
            title="Four sessions. One mat."
          />
          <Link
            to="/schedule"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-primary">
            Full week and venue
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </Reveal>

      <div className="mt-12 divide-y divide-ink/12 border-y border-ink/12">
        {WEEK.map((session, i) => (
          <Reveal key={session.day} delay={i * 0.05}>
            <div className="group relative grid grid-cols-[auto_1fr] items-baseline gap-x-6 gap-y-2 py-6 md:grid-cols-[110px_1fr_1fr_auto] md:items-center">
              <span className="pointer-events-none absolute inset-x-[-1rem] inset-y-0 -z-0 rounded-md bg-primary/[0.055] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <p className="relative flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-primary/40 transition-colors duration-300 group-hover:bg-primary" />
                {session.day}
              </p>
              <p className="relative font-display text-xl font-semibold tracking-[-0.015em] transition-colors duration-300 group-hover:text-primary md:text-[22px]">
                {session.focus}
              </p>
              <p className="relative col-start-2 text-[13px] text-muted-foreground md:col-start-3">
                {session.group}
              </p>
              <p className="relative col-start-2 font-mono text-[12px] tabular-nums text-foreground/80 md:col-start-4">
                {session.time}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        {VENUE.name} · {VENUE.campus}
      </p>
    </div>
  </section>
);

export default SchedulePreview;
