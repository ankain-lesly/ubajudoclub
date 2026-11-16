import { Lock, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import type { PublicStats } from "@/lib/types";
import Reveal from "@/components/visual/Reveal";
import SectionHeading from "@/components/visual/SectionHeading";
import Aura from "@/components/visual/Aura";
import SectionBackdrop from "@/components/visual/SectionBackdrop";
import { beltFor } from "@/lib/data/club";

interface TurnoutPanelProps {
  stats: PublicStats | null;
}

const TurnoutPanel = ({ stats }: TurnoutPanelProps) => {
  const series = stats?.turnout_series ?? [];
  const max = Math.max(...series.map((p) => p.value), 1);
  const beltTotal =
    (stats?.belt_distribution ?? []).reduce((sum, b) => sum + b.count, 0) || 1;
  const attendanceRate = stats
    ? Math.round(
        (stats.average_turnout / Math.max(stats.active_athletes, 1)) * 100,
      )
    : 0;

  return (
    <section className="relative overflow-hidden border-y border-ink/10 bg-band text-band-foreground">
      <SectionBackdrop variant="dots" tone="ink" className="opacity-80" />
      <Aura tone="ink" className="opacity-80" />
      <div className="pointer-events-none absolute -right-24 top-1/2 hidden h-[420px] w-[420px] -translate-y-1/2 rounded-full border border-band-foreground/10 lg:block">
        <div className="h-full w-full animate-spin-slow rounded-full border border-dashed border-band-foreground/10" />
      </div>
      <div className="relative mx-auto grid max-w-6xl gap-14 px-5 py-20 lg:grid-cols-[0.85fr_1.15fr] lg:px-8 lg:py-28">
        <Reveal>
          <SectionHeading
            tone="dark"
            eyebrow="Open metrics"
            title="Transparency, without names."
            description="We publish how the club is breathing — turnout, growth, belts awarded. Not who was in the room. That record belongs to the athlete and their coach."
          />
          <div className="mt-9 flex items-start gap-3 rounded-md border border-band-foreground/15 bg-band-foreground/[0.04] p-4">
            <Lock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <p className="text-[12.5px] leading-relaxed text-band-foreground/65">
              Individual attendance, absence flags and grading notes are visible
              only to signed-in coaches.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="rounded-lg border border-band-foreground/15 bg-band-foreground/[0.03] p-6 lg:p-8">
            <div className="flex items-baseline justify-between gap-4">
              <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-band-foreground/50">
                Turnout · last six sessions
              </p>
              <p className="flex items-center gap-1.5 font-mono text-[10px] text-primary">
                <TrendingUp className="h-3.5 w-3.5" />
                {stats ? `${attendanceRate}% of roster` : "syncing"}
              </p>
            </div>

            <div className="mt-8 flex h-40 items-end gap-2 sm:gap-3">
              {(series.length
                ? series
                : Array.from({ length: 6 }, (_, i) => ({
                    label: "—",
                    value: 0,
                  }))
              ).map((point, i) => (
                <div
                  key={`${point.label}-${i}`}
                  className="group flex flex-1 flex-col items-center justify-end gap-2">
                  <span className="font-mono text-[10px] tabular-nums text-band-foreground/50 transition-colors group-hover:text-band-foreground">
                    {point.value || "–"}
                  </span>
                  <motion.span
                    initial={{ height: "4%" }}
                    whileInView={{
                      height: `${Math.max((point.value / max) * 100, 6)}%`,
                    }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{
                      duration: 0.9,
                      delay: 0.08 * i,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="w-full rounded-t-[3px] bg-gradient-to-t from-band-foreground/15 to-band-foreground/55 transition-colors duration-500 group-hover:from-primary/40 group-hover:to-primary"
                  />
                  <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-band-foreground/35">
                    {point.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-8 border-t border-band-foreground/12 pt-6">
              <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-band-foreground/50">
                Belt distribution
              </p>
              <div className="mt-4 flex h-2.5 overflow-hidden rounded-full bg-band-foreground/10">
                {(stats?.belt_distribution ?? []).map((belt) => (
                  <span
                    key={belt.rank}
                    title={`${belt.rank}: ${belt.count}`}
                    style={{
                      width: `${(belt.count / beltTotal) * 100}%`,
                      backgroundColor: beltFor(belt.rank).color,
                    }}
                  />
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                {(stats?.belt_distribution ?? []).map((belt) => (
                  <span
                    key={belt.rank}
                    className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.1em] text-band-foreground/55">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: beltFor(belt.rank).color }}
                    />
                    {belt.rank} {belt.count}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default TurnoutPanel;
