import { Link } from "react-router";
import { ArrowLeft, Clock, ShieldCheck, Target, Award, ArrowRight } from "lucide-react";
import type { ResolvedBeltView } from "@/lib/types/syllabus";
import KyuDanSpine from "./KyuDanSpine";
import Reveal from "@/components/visual/Reveal";
import Aura from "@/components/visual/Aura";
import RingField from "@/components/visual/RingField";

interface SyllabusHeroProps {
  view: ResolvedBeltView;
}

export default function SyllabusHero({ view }: SyllabusHeroProps) {
  const isBlack = view.slug === "black";

  return (
    <section className="relative overflow-hidden border-b border-ink/10">
      <div className="pointer-events-none absolute inset-0 tatami opacity-60" />
      {/* <Aura grid={false} /> */}
      <div className="pointer-events-none absolute -right-32 -top-28 hidden h-[480px] w-[480px] opacity-60 lg:block">
        <RingField />
      </div>

      <div className="relative mx-auto max-w-6xl px-5 py-8 lg:px-8 lg:py-14">
        <Reveal>
          <div className="flex items-center justify-between">
            <Link
              to="/belts"
              className="inline-flex items-center gap-2 font-mono text-[11px] text-muted-foreground transition-colors hover:text-foreground">
              <ArrowLeft className="h-3.5 w-3.5" />
              All Belts & Pathway
            </Link>
          </div>
        </Reveal>

        {/* Main Hero Details */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <Reveal delay={0.04}>
            <div className="flex items-center gap-3">
              <span
                className="h-3 w-10 rounded-full shadow-sm ring-1 ring-ink/20"
                style={{ backgroundColor: view.color }}
              />
              <span className="font-mono text-[11px] text-primary font-semibold">
                {view.kyuTitle}
              </span>
            </div>

            <h1 className="mt-3 font-display text-[clamp(2.2rem,4.5vw,3.8rem)] font-semibold leading-[0.96] tracking-[-0.03em] text-balance">
              {view.rankName} Syllabus
            </h1>

            <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-muted-foreground">
              {view.intent}
            </p>

            {view.leadershipNote && (
              <p className="mt-3 max-w-xl border-l-2 border-primary/40 pl-3 text-[12px] leading-relaxed text-foreground/80">
                {view.leadershipNote}
              </p>
            )}
          </Reveal>

          <Reveal delay={0.08}>
            <div className="rounded-xl border border-ink/10 bg-card/85 p-5 backdrop-blur-sm shadow-sm">
              <div className="flex items-center justify-between">
                <p className="font-mono text-[10px] text-muted-foreground">
                  {isBlack ? "Yudansha Credentials" : "Passage de Grade Target"}
                </p>
                {view.nextRankName && (
                  <span className="flex items-center gap-1.5 font-mono text-[10px] text-primary font-semibold">
                    <span>Target: {view.nextRankName}</span>
                    <ArrowRight className="h-3 w-3" />
                  </span>
                )}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3.5">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Target className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-display text-xl font-semibold tabular-nums">
                      {view.sessions}
                    </span>
                    <p className="text-[11px] text-muted-foreground">
                      Session Floor
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-display text-xl font-semibold tabular-nums">
                      {view.exam ? `${view.exam.minMonths} mo` : "Lifetime"}
                    </span>
                    <p className="text-[11px] text-muted-foreground">
                      {view.exam ? "Time in Grade" : "Judo Mastery"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Award className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-display text-xl font-semibold tabular-nums">
                      {isBlack ? 40 : view.resolvedThrows.length}
                    </span>
                    <p className="text-[11px] text-muted-foreground">
                      {isBlack ? "Gokyo Throws" : "New Throws"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-display text-xl font-semibold tabular-nums">
                      {view.exam ? view.exam.technical.length : 15}
                    </span>
                    <p className="text-[11px] text-muted-foreground">
                      {view.exam ? "Exam Tasks" : "Katame Holds"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Bespoke Kyu-to-Dan Vector Spine Stepper */}
        <div className="mt-6">
          <KyuDanSpine currentSlug={view.slug} />
        </div>
      </div>
    </section>
  );
}
