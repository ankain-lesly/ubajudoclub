import Reveal from "@/components/visual/Reveal";
import SectionHeading from "@/components/visual/SectionHeading";
import SpotlightCard from "@/components/visual/SpotlightCard";
import SectionBackdrop from "@/components/visual/SectionBackdrop";
import { PILLARS } from "@/lib/data/club";

const Pillars = () => (
  <section className="relative mx-auto max-w-6xl overflow-hidden px-5 py-20 lg:px-8 lg:py-28">
    <SectionBackdrop variant="rings" className="opacity-80" />
    <Reveal>
      <SectionHeading
        eyebrow="Why this club runs on data"
        title="A paperless mat, and a record that finally adds up."
        description="Sign-in sheets told us who was in the room. They never told us who was drifting away, or who had quietly earned their next belt. So we rebuilt the way the club counts."
      />
    </Reveal>

    <div className="relative mt-14 grid gap-5 md:grid-cols-3">
      {PILLARS.map((pillar, i) => (
        <Reveal key={pillar.n} delay={i * 0.09}>
          <SpotlightCard
            as="article"
            className="group h-full rounded-lg border border-ink/12 bg-card p-7 transition-colors duration-500 hover:border-ink/30">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -right-1 -top-7 font-display text-[92px] font-semibold leading-none text-ink/[0.045] transition-colors duration-500 group-hover/spot:text-primary/[0.12]">
              {pillar.n}
            </span>
            <span className="relative font-mono text-[10px] tracking-[0.3em] text-primary">
              {pillar.n}
            </span>
            <h3 className="relative mt-8 font-display text-[22px] font-semibold leading-[1.15] tracking-[-0.015em]">
              {pillar.title}
            </h3>
            <p className="relative mt-4 text-[13.5px] leading-relaxed text-muted-foreground">
              {pillar.body}
            </p>
            <span className="absolute inset-x-7 bottom-0 h-px origin-left scale-x-0 bg-primary transition-transform duration-500 group-hover/spot:scale-x-100" />
          </SpotlightCard>
        </Reveal>
      ))}
    </div>
  </section>
);

export default Pillars;
