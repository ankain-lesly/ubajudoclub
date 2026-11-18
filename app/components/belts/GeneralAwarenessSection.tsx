import { useState } from "react";
import { BookOpen, Scale, Sparkles, ChevronRight } from "lucide-react";
import type { VocabularyTerm } from "@/lib/types/syllabus";
import { DOJO_FOUNDATIONS } from "@/lib/data/syllabus/foundations";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import SpotlightCard from "@/components/visual/SpotlightCard";
import Reveal from "@/components/visual/Reveal";

interface GeneralAwarenessSectionProps {
  terms: VocabularyTerm[];
  rules: string[];
}

export default function GeneralAwarenessSection({
  terms,
  rules,
}: GeneralAwarenessSectionProps) {
  const [foundationsOpen, setFoundationsOpen] = useState(false);

  return (
    <div className="space-y-10 border-t border-ink/10 pt-12">
      {/* Section Header */}
      <div>
        <h4 className="font-display text-lg font-semibold tracking-[-0.01em]">
          Judo Theory & Terms
        </h4>
        <p className="text-[12.5px] text-muted-foreground">
          Vocabulary, contest rules and heritage associated with this rank
        </p>
      </div>

      {/* Dojo Foundations Banner Trigger */}
      <Reveal>
        <div
          onClick={() => setFoundationsOpen(true)}
          className="group flex cursor-pointer flex-wrap items-center justify-between gap-4 rounded-xl border border-primary/25 bg-primary/5 p-5 transition-all hover:border-primary/50 hover:bg-primary/10">
          <div className="flex items-center gap-3.5">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h5 className="font-display text-base font-semibold">
                Dojo Foundations: Reiho, Hygiene & The Judo Moral Code
              </h5>
              <p className="text-[12.5px] text-muted-foreground">
                Read the universal etiquette and historical principles shared across all ranks.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 font-mono text-[10px] text-primary group-hover:translate-x-1 transition-transform font-medium">
            <span>Read Protocol</span>
            <ChevronRight className="h-4 w-4" />
          </div>
        </div>
      </Reveal>

      {/* Rank-Specific Terminology */}
      <Reveal>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            <h5 className="font-display text-sm font-semibold text-foreground">
              Japanese Terminology Introduced at this Grade
            </h5>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {terms.map((v) => (
              <SpotlightCard
                key={v.id}
                className="rounded-xl border border-ink/10 bg-card p-3.5">
                <div className="flex items-center justify-between">
                  <h6 className="font-display text-sm font-semibold text-foreground">
                    {v.term}
                  </h6>
                  {v.kanji && (
                    <span className="font-mono text-sm tracking-wider text-muted-foreground/60">
                      {v.kanji}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-[12px] leading-snug text-muted-foreground">
                  {v.meaning}
                </p>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Rank-Specific Arbitrage & Safety Rules */}
      {rules.length > 0 && (
        <Reveal>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Scale className="h-4 w-4 text-primary" />
              <h5 className="font-display text-sm font-semibold text-foreground">
                Contest Rules & Mat Etiquette
              </h5>
            </div>

            <div className="rounded-xl border border-ink/10 bg-card p-5 space-y-2.5">
              {rules.map((rule, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 text-[12.5px] leading-relaxed text-muted-foreground border-b border-ink/5 pb-2.5 last:border-b-0 last:pb-0">
                  <span className="font-mono text-[9px] text-primary font-semibold shrink-0 mt-0.5">
                    0{idx + 1}.
                  </span>
                  <span>{rule}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      )}

      {/* Dojo Foundations Slide-Over Sheet */}
      <Sheet open={foundationsOpen} onOpenChange={setFoundationsOpen}>
        <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto p-6 sm:p-8">
          <SheetHeader className="text-left border-b border-ink/10 pb-5 px-0">
            <SheetTitle className="font-display text-2xl font-semibold mt-1">
              {DOJO_FOUNDATIONS.title}
            </SheetTitle>
            <SheetDescription className="text-[13px] leading-relaxed text-muted-foreground mt-1">
              {DOJO_FOUNDATIONS.subtitle}
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            {/* History */}
            <div>
              <h6 className="font-display text-sm font-semibold text-foreground">
                History & Origins
              </h6>
              <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                {DOJO_FOUNDATIONS.historySummary}
              </p>
            </div>

            {/* Principles */}
            <div className="space-y-3 border-t border-ink/10 pt-5">
              <h6 className="font-display text-sm font-semibold text-foreground">
                Fundamental Principles
              </h6>
              {DOJO_FOUNDATIONS.principles.map((p, i) => (
                <div key={i} className="rounded-lg bg-secondary/30 p-3.5">
                  <p className="font-display text-sm font-semibold">{p.title}</p>
                  <p className="font-mono text-[10px] text-primary">{p.meaning}</p>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">{p.description}</p>
                </div>
              ))}
            </div>

            {/* Moral Code */}
            <div className="border-t border-ink/10 pt-5">
              <h6 className="font-display text-sm font-semibold text-foreground">
                The Judo Moral Code
              </h6>
              <div className="mt-3 grid grid-cols-2 gap-2 text-[12px]">
                {DOJO_FOUNDATIONS.moralCode.map((m, i) => (
                  <div key={i} className="rounded border border-ink/10 bg-card p-2.5">
                    <p className="font-semibold text-foreground">{m.value}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{m.meaning}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Reiho */}
            <div className="border-t border-ink/10 pt-5">
              <h6 className="font-display text-sm font-semibold text-foreground">
                Reiho (Dojo Etiquette)
              </h6>
              <ul className="mt-3 space-y-2 text-[12.5px] text-muted-foreground">
                {DOJO_FOUNDATIONS.reiho.map((r, i) => (
                  <li key={i} className="rounded bg-secondary/20 p-2.5">
                    <span className="font-semibold text-foreground">{r.title}: </span>
                    <span>{r.detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
