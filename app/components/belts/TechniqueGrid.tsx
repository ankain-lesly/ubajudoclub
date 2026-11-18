import { useState } from "react";
import { ChevronDown, AlertTriangle, CheckCircle2 } from "lucide-react";
import type { TechniqueItem } from "@/lib/types/syllabus";
import SpotlightCard from "@/components/visual/SpotlightCard";
import Reveal from "@/components/visual/Reveal";
import { cn } from "@/lib/utils";

interface TechniqueGridProps {
  techniques: TechniqueItem[];
  title?: string;
  eyebrow?: string;
}

export default function TechniqueGrid({
  techniques,
  title,
  eyebrow,
}: TechniqueGridProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6">
      {(title || eyebrow) && (
        <Reveal>
          <div>
            {eyebrow && (
              <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-primary">
                {eyebrow}
              </p>
            )}
            {title && (
              <h3 className="mt-1 font-display text-2xl font-semibold tracking-[-0.02em]">
                {title}
              </h3>
            )}
          </div>
        </Reveal>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        {techniques.map((tech, i) => {
          const isExpanded = expandedId === tech.id;
          return (
            <Reveal key={tech.id} delay={i * 0.04}>
              <SpotlightCard className="flex h-full flex-col justify-between rounded-xl border border-ink/12 bg-card p-6 transition-all duration-300 hover:border-ink/25">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {tech.subgroup && (
                        <span className="rounded-full bg-secondary/80 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-secondary-foreground">
                          {tech.subgroup}
                        </span>
                      )}
                      {tech.gokyoGroup && (
                        <span className="rounded-full border border-primary/30 px-2 py-0.5 font-mono text-[8.5px] uppercase tracking-[0.12em] text-primary">
                          Gokyo Grp {tech.gokyoGroup}
                        </span>
                      )}
                    </div>
                    {tech.japaneseKanji && (
                      <span className="font-mono text-sm tracking-widest text-muted-foreground/60">
                        {tech.japaneseKanji}
                      </span>
                    )}
                  </div>

                  <h4 className="mt-4 font-display text-xl font-semibold tracking-[-0.015em]">
                    {tech.name}
                  </h4>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
                    {tech.translation}
                  </p>

                  <p className="mt-3 text-[13.5px] leading-relaxed text-muted-foreground">
                    {tech.description}
                  </p>

                  {/* Key coaching execution cues */}
                  <div className="mt-5 space-y-2 border-t border-ink/10 pt-4">
                    <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-foreground/80 font-semibold">
                      Key Execution Points:
                    </p>
                    <ul className="space-y-1.5">
                      {tech.keyPoints.map((point, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-[12.5px] leading-relaxed text-muted-foreground">
                          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary/80" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Expandable Common Mistakes & Safety Warnings */}
                  {isExpanded && (
                    <div className="mt-4 space-y-3 rounded-lg bg-secondary/30 p-3.5 text-[12px] animate-rise">
                      {tech.commonMistakes && tech.commonMistakes.length > 0 && (
                        <div>
                          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-foreground font-semibold">
                            Common Traps:
                          </p>
                          <ul className="mt-1 list-inside list-disc space-y-1 text-muted-foreground">
                            {tech.commonMistakes.map((m, idx) => (
                              <li key={idx}>{m}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {tech.safetyWarnings && tech.safetyWarnings.length > 0 && (
                        <div className="border-t border-ink/10 pt-2 text-destructive">
                          <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.16em] font-semibold">
                            <AlertTriangle className="h-3 w-3 shrink-0" />
                            Safety Alert:
                          </div>
                          <ul className="mt-1 list-inside list-disc space-y-1">
                            {tech.safetyWarnings.map((w, idx) => (
                              <li key={idx}>{w}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {(tech.commonMistakes || tech.safetyWarnings) && (
                  <button
                    type="button"
                    onClick={() => toggleExpand(tech.id)}
                    className="mt-5 inline-flex items-center justify-between border-t border-ink/10 pt-3 text-left font-mono text-[9.5px] uppercase tracking-[0.16em] text-primary transition-colors hover:text-foreground">
                    <span>
                      {isExpanded ? "Hide coaching traps" : "View common traps & safety"}
                    </span>
                    <ChevronDown
                      className={cn(
                        "h-3.5 w-3.5 transition-transform duration-200",
                        isExpanded && "rotate-180"
                      )}
                    />
                  </button>
                )}
              </SpotlightCard>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
