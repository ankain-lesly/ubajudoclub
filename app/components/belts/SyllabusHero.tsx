import { Link } from "react-router";
import { ArrowLeft, Clock, ShieldCheck, Target, Award } from "lucide-react";
import type { BeltSyllabus } from "@/lib/types/syllabus";
import Reveal from "@/components/visual/Reveal";
import Aura from "@/components/visual/Aura";
import RingField from "@/components/visual/RingField";

interface SyllabusHeroProps {
  syllabus: BeltSyllabus;
}

export default function SyllabusHero({ syllabus }: SyllabusHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-ink/10">
      <div className="pointer-events-none absolute inset-0 tatami opacity-60" />
      <Aura grid={false} />
      <div className="pointer-events-none absolute -right-32 -top-28 hidden h-[480px] w-[480px] opacity-60 lg:block">
        <RingField />
      </div>

      <div className="relative mx-auto max-w-6xl px-5 py-12 lg:px-8 lg:py-20">
        <Reveal>
          <Link
            to="/belts"
            className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Belt Pathway
          </Link>
        </Reveal>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <Reveal delay={0.04}>
            <div className="flex items-center gap-3">
              <span
                className="h-3 w-10 rounded-full shadow-sm ring-1 ring-ink/20"
                style={{ backgroundColor: syllabus.color }}
              />
              <span className="font-mono text-[10px] uppercase tracking-[0.26em] text-primary">
                {syllabus.kyuRank}
              </span>
            </div>

            <h1 className="mt-4 font-display text-[clamp(2.4rem,5.2vw,4.2rem)] font-semibold leading-[0.95] tracking-[-0.035em] text-balance">
              {syllabus.rank} Syllabus & Grade Transition
            </h1>

            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
              {syllabus.summary}
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="rounded-xl border border-ink/12 bg-card/80 p-6 backdrop-blur-sm">
              <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
                Passage De Grade Key Metrics
              </p>

              <div className="mt-5 grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Target className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-display text-2xl font-semibold tabular-nums">
                      {syllabus.targetSessions}
                    </span>
                    <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
                      Session Floor
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-display text-2xl font-semibold tabular-nums">
                      {syllabus.examRequirements.minimumTimeMonths} mo
                    </span>
                    <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
                      Minimum Time
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-display text-2xl font-semibold tabular-nums">
                      {syllabus.examRequirements.evaluationModules.length}
                    </span>
                    <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
                      Exam Modules
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Award className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-display text-2xl font-semibold tabular-nums">
                      {syllabus.tachiWaza.length + syllabus.neWaza.length}
                    </span>
                    <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
                      Techniques
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
