import { Scroll, Award, CheckCircle2 } from "lucide-react";
import type { KataRequirement } from "@/lib/types/syllabus";
import SpotlightCard from "@/components/visual/SpotlightCard";
import Reveal from "@/components/visual/Reveal";

interface KataSectionProps {
  kataList?: KataRequirement[];
}

export default function KataSection({ kataList }: KataSectionProps) {
  if (!kataList || kataList.length === 0) return null;

  return (
    <div className="space-y-6">
      <Reveal>
        <div className="flex items-center gap-2">
          <Scroll className="h-4 w-4 text-primary" />
          <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-primary">
            Forms & Ceremonial Traditions
          </p>
        </div>
        <h3 className="mt-1 font-display text-2xl font-semibold tracking-[-0.02em]">
          Formal Kata Syllabus
        </h3>
        <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-muted-foreground">
          Kata preserves the purest principles of balance, timing, and posture
          inherited from the Kodokan. It demands mental focus, ceremonial
          exactitude, and trust between partners.
        </p>
      </Reveal>

      <div className="grid gap-6">
        {kataList.map((k, i) => (
          <Reveal key={k.set} delay={i * 0.05}>
            <SpotlightCard className="rounded-xl border border-ink/12 bg-card p-6 lg:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-primary/10 px-3 py-1 font-mono text-[9.5px] uppercase tracking-[0.16em] text-primary">
                    Role: {k.role}
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground">
                    {k.set}
                  </span>
                </div>
                {k.japaneseKanji && (
                  <span className="font-mono text-sm tracking-widest text-muted-foreground/60">
                    {k.japaneseKanji}
                  </span>
                )}
              </div>

              <h4 className="mt-4 font-display text-2xl font-semibold tracking-[-0.015em]">
                {k.name}
              </h4>
              <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
                {k.focusDescription}
              </p>

              <div className="mt-6 border-t border-ink/10 pt-5">
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-foreground font-semibold">
                  Techniques Performed in Sequence:
                </p>
                <div className="mt-3 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                  {k.techniquesCovered.map((tech, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 rounded-lg bg-secondary/35 px-3 py-2 text-[12.5px] text-foreground/90">
                      <span className="font-mono text-[10px] text-primary">
                        0{idx + 1}.
                      </span>
                      <span>{tech}</span>
                    </div>
                  ))}
                </div>
              </div>
            </SpotlightCard>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
