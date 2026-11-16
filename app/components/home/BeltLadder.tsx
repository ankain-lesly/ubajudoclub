import { motion } from "framer-motion";
import Reveal from "@/components/visual/Reveal";
import SectionHeading from "@/components/visual/SectionHeading";
import SectionBackdrop from "@/components/visual/SectionBackdrop";
import { BELTS } from "@/lib/data/club";

const BeltLadder = () => (
  <section className="relative mx-auto max-w-6xl overflow-hidden px-5 py-20 lg:px-8 lg:py-28">
    <SectionBackdrop variant="rings" className="opacity-70" />
    <div className="pointer-events-none absolute inset-x-5 top-0 hidden justify-end lg:flex">
      <span className="h-24 w-px bg-gradient-to-b from-transparent via-primary/40 to-transparent" />
    </div>
    <Reveal>
      <SectionHeading
        eyebrow="Kyu to Dan"
        title="Seven belts, each with a number in front of it."
        description="Attendance is the spine of grading at UBa. Reach the session target for your rank and the technical board schedules your assessment at the end of term."
      />
    </Reveal>

    <div className="mt-14 grid gap-px overflow-hidden rounded-lg border border-ink/12 bg-ink/12 sm:grid-cols-2 lg:grid-cols-4">
      {BELTS.map((belt, i) => (
        <Reveal key={belt.rank} delay={i * 0.04} className="bg-card">
          <div className="group h-full p-6 transition-colors hover:bg-secondary/60">
            <div className="flex items-center justify-between">
              <span className="font-display text-lg font-semibold tracking-[-0.01em]">
                {belt.rank}
              </span>
              <motion.span
                initial={{ width: 0 }}
                whileInView={{ width: 36 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.85,
                  delay: 0.12 + i * 0.05,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="h-1.5 rounded-full"
                style={{ backgroundColor: belt.color }}
              />
            </div>
            <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
              {belt.kyu}
            </p>
            <p className="mt-6 flex items-baseline gap-1.5">
              <span className="font-display text-3xl font-semibold tabular-nums tracking-[-0.03em]">
                {belt.sessions}
              </span>
              <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                sessions
              </span>
            </p>
            <p className="mt-3 text-[12.5px] leading-relaxed text-muted-foreground">
              {belt.focus}
            </p>
          </div>
        </Reveal>
      ))}
      <div className="flex flex-col justify-between bg-band p-6 text-band-foreground sm:col-span-2 lg:col-span-1">
        <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-band-foreground/50">
          Grading board
        </p>
        <p className="mt-6 text-[13px] leading-relaxed text-band-foreground/75">
          Targets are a floor, not a promise. Technique, safety and mat
          etiquette are assessed on the day.
        </p>
      </div>
    </div>
  </section>
);

export default BeltLadder;
