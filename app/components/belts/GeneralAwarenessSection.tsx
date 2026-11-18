import { BookOpen, ShieldAlert, Sparkles, Scale } from "lucide-react";
import type { GeneralAwareness } from "@/lib/types/syllabus";
import SpotlightCard from "@/components/visual/SpotlightCard";
import Reveal from "@/components/visual/Reveal";

interface GeneralAwarenessSectionProps {
  awareness: GeneralAwareness;
  reiho: {
    title: string;
    description: string;
    elements: string[];
  };
}

export default function GeneralAwarenessSection({
  awareness,
  reiho,
}: GeneralAwarenessSectionProps) {
  return (
    <div className="space-y-10">
      {/* Reiho / Etiquette Card */}
      <Reveal>
        <div className="rounded-xl border border-ink/12 bg-secondary/25 p-7 lg:p-8">
          <div className="flex items-center gap-2 text-primary">
            <Sparkles className="h-4 w-4" />
            <p className="font-mono text-[9px] uppercase tracking-[0.24em]">
              Mat Protocol & Respect
            </p>
          </div>
          <h3 className="mt-2 font-display text-2xl font-semibold tracking-[-0.015em]">
            {reiho.title}
          </h3>
          <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-muted-foreground">
            {reiho.description}
          </p>

          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {reiho.elements.map((el, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 rounded-lg border border-ink/10 bg-card p-3 text-[13px] leading-relaxed text-muted-foreground">
                <span className="font-mono text-[10px] text-primary">
                  0{i + 1}.
                </span>
                <span>{el}</span>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      {/* Vocabulary Glossary */}
      <Reveal>
        <div>
          <div className="flex items-center gap-2 text-primary">
            <BookOpen className="h-4 w-4" />
            <p className="font-mono text-[9px] uppercase tracking-[0.24em]">
              Japanese Terminology
            </p>
          </div>
          <h3 className="mt-1 font-display text-2xl font-semibold tracking-[-0.02em]">
            Essential Vocabulary
          </h3>
          <p className="mt-2 text-[14px] text-muted-foreground">
            Standard terms required for dojo communication and technical exams.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {awareness.vocabulary.map((v, i) => (
              <SpotlightCard
                key={i}
                className="rounded-xl border border-ink/12 bg-card p-4 transition-colors hover:border-ink/25">
                <div className="flex items-center justify-between">
                  <h4 className="font-display text-base font-semibold text-foreground">
                    {v.term}
                  </h4>
                  {v.kanji && (
                    <span className="font-mono text-sm tracking-wider text-muted-foreground/60">
                      {v.kanji}
                    </span>
                  )}
                </div>
                <p className="mt-1.5 text-[12.5px] leading-snug text-muted-foreground">
                  {v.meaning}
                </p>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Philosophy, Rules & Safety Columns */}
      <div className="grid gap-6 md:grid-cols-3">
        <Reveal delay={0.04}>
          <SpotlightCard className="h-full rounded-xl border border-ink/12 bg-card p-6">
            <div className="flex items-center gap-2 text-primary">
              <Sparkles className="h-4 w-4" />
              <p className="font-mono text-[9px] uppercase tracking-[0.2em]">
                Budo Philosophy
              </p>
            </div>
            <h4 className="mt-2 font-display text-lg font-semibold">
              Principles & Heritage
            </h4>
            <ul className="mt-4 space-y-2.5 text-[12.5px] leading-relaxed text-muted-foreground">
              {awareness.philosophyAndHistory.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </SpotlightCard>
        </Reveal>

        <Reveal delay={0.08}>
          <SpotlightCard className="h-full rounded-xl border border-ink/12 bg-card p-6">
            <div className="flex items-center gap-2 text-primary">
              <Scale className="h-4 w-4" />
              <p className="font-mono text-[9px] uppercase tracking-[0.2em]">
                Contest Rules
              </p>
            </div>
            <h4 className="mt-2 font-display text-lg font-semibold">
              Arbitrage & Scoring
            </h4>
            <ul className="mt-4 space-y-2.5 text-[12.5px] leading-relaxed text-muted-foreground">
              {awareness.rulesAndRefereeing.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </SpotlightCard>
        </Reveal>

        <Reveal delay={0.12}>
          <SpotlightCard className="h-full rounded-xl border border-ink/12 bg-card p-6">
            <div className="flex items-center gap-2 text-primary">
              <ShieldAlert className="h-4 w-4" />
              <p className="font-mono text-[9px] uppercase tracking-[0.2em]">
                Hygiene & Safety
              </p>
            </div>
            <h4 className="mt-2 font-display text-lg font-semibold">
              Mat Care & Well-being
            </h4>
            <ul className="mt-4 space-y-2.5 text-[12.5px] leading-relaxed text-muted-foreground">
              {awareness.hygieneAndSafety.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </SpotlightCard>
        </Reveal>
      </div>
    </div>
  );
}
