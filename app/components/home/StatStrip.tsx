import type { PublicStats } from "@/lib/types";
import Reveal from "@/components/visual/Reveal";
import CountUp from "@/components/visual/CountUp";
import SectionBackdrop from "@/components/visual/SectionBackdrop";

interface StatStripProps {
  stats: PublicStats | null;
}

const StatStrip = ({ stats }: StatStripProps) => {
  const items = [
    {
      value: stats?.active_athletes ?? null,
      label: "Active athletes",
      note: "On the mat this term",
    },
    {
      value: stats?.sessions_logged ?? null,
      label: "Sessions logged",
      note: "Since the club began",
    },
    {
      value: stats?.average_turnout ?? null,
      label: "Average turnout",
      note: "Athletes per session",
    },
    {
      value: stats?.promotions_this_term ?? null,
      label: "Promotions",
      note: "Graded this term",
    },
  ];

  return (
    <section className="relative overflow-hidden border-b border-ink/10 bg-background">
      <SectionBackdrop variant="weave" />
      <div className="relative mx-auto grid max-w-6xl grid-cols-2 gap-y-10 px-5 py-12 lg:grid-cols-4 lg:px-8 lg:py-14">
        {items.map((item, i) => (
          <Reveal key={item.label} delay={i * 0.07}>
            <div
              className={
                i > 0
                  ? "group px-1 lg:border-l lg:border-ink/10 lg:pl-8"
                  : "group px-1"
              }>
              <p className="font-display text-[clamp(2.1rem,4vw,3rem)] font-semibold leading-none tracking-[-0.04em]">
                {typeof item.value === "number" ? (
                  <CountUp value={item.value} />
                ) : (
                  "—"
                )}
              </p>
              <span className="mt-4 block h-px w-8 origin-left bg-primary transition-transform duration-500 group-hover:scale-x-[2.6]" />
              <p className="mt-3 text-[13px] font-medium">{item.label}</p>
              <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                {item.note}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
};

export default StatStrip;
