import { Scroll } from "lucide-react";
import type { KataSet } from "@/lib/types/syllabus";
import SpotlightCard from "@/components/visual/SpotlightCard";
import Reveal from "@/components/visual/Reveal";

interface KataSectionProps {
  kataList?: KataSet[];
}

export default function KataSection({ kataList }: KataSectionProps) {
  if (!kataList || kataList.length === 0) return null;

  return (
    <div className="space-y-6">
      <Reveal>
        <div>
          <h4 className="font-display text-lg font-semibold tracking-[-0.01em]">
            Kata
          </h4>
          <p className="text-[12.5px] text-muted-foreground">
            Formal Prearranged Patterns & Ceremonial Forms
          </p>
        </div>
      </Reveal>

      <div className="grid gap-5">
        {kataList.map((k, i) => (
          <Reveal key={k.series} delay={i * 0.05}>
            <SpotlightCard className="rounded-xl border border-ink/10 bg-card p-5 lg:p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 font-mono text-[9px] text-primary font-medium">
                    Role: {k.role}
                  </span>
                  <span className="text-[12px] text-muted-foreground">
                    {k.series}
                  </span>
                </div>
                {k.kanji && (
                  <span className="font-mono text-sm tracking-widest text-muted-foreground/60">
                    {k.kanji}
                  </span>
                )}
              </div>

              <h5 className="mt-3 font-display text-xl font-semibold tracking-[-0.01em]">
                {k.name}
              </h5>
              <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                {k.focus}
              </p>

              <div className="mt-5 border-t border-ink/10 pt-4">
                <p className="text-[12px] font-semibold text-foreground">
                  Required Techniques in Sequence:
                </p>
                <div className="mt-2.5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {k.techniques.map((tech, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 rounded-lg bg-secondary/35 px-3 py-1.5 text-[12px] text-foreground/90">
                      <span className="font-mono text-[10px] text-primary font-medium">
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
