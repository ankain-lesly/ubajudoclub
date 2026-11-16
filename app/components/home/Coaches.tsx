import Reveal from "@/components/visual/Reveal";
import SectionHeading from "@/components/visual/SectionHeading";
import SpotlightCard from "@/components/visual/SpotlightCard";
import SectionBackdrop from "@/components/visual/SectionBackdrop";
import { COACHES } from "@/lib/data/club";

const Coaches = () => (
  <section className="relative mx-auto max-w-6xl overflow-hidden px-5 py-20 lg:px-8 lg:py-28">
    <SectionBackdrop variant="dots" className="opacity-70" />
    <Reveal>
      <SectionHeading
        eyebrow="On the edge of the mat"
        title="The people counting the sessions."
      />
    </Reveal>

    <div className="mt-14 grid gap-5 md:grid-cols-3">
      {COACHES.map((coach, i) => (
        <Reveal key={coach.name} delay={i * 0.08}>
          <SpotlightCard
            as="article"
            className="flex h-full flex-col justify-between rounded-lg border border-ink/12 bg-card p-7 transition-colors duration-500 hover:border-ink/30">
            <span className="relative grid h-14 w-14 place-items-center rounded-full bg-ink font-display text-base font-semibold text-paper">
              {coach.initials}
              <span className="absolute -inset-1.5 rounded-full border border-dashed border-primary/30 transition-transform duration-700 group-hover/spot:rotate-90" />
            </span>
            <div className="relative mt-10">
              <h3 className="font-display text-lg font-semibold tracking-[-0.01em]">
                {coach.name}
              </h3>
              <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.18em] text-primary">
                {coach.role}
              </p>
              <p className="mt-4 text-[13px] leading-relaxed text-muted-foreground">
                {coach.detail}
              </p>
            </div>
          </SpotlightCard>
        </Reveal>
      ))}
    </div>
  </section>
);

export default Coaches;
