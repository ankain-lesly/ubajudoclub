import { useState } from "react";
import { ChevronDown, History } from "lucide-react";
import type { Technique, ResolvedBeltView } from "@/lib/types/syllabus";
import TechniqueCard from "./TechniqueCard";
import TechniqueSheet from "./TechniqueSheet";
import BeltBar from "@/components/visual/BeltBar";
import Reveal from "@/components/visual/Reveal";
import { cn } from "@/lib/utils";

interface TechniqueGridProps {
  throws: Technique[];
  groundwork: Technique[];
  ukemi: Technique[];
  combinations?: ResolvedBeltView["combinations"];
  counters?: ResolvedBeltView["counters"];
  cumulativeReviewThrows: ResolvedBeltView["cumulativeReviewThrows"];
  cumulativeReviewGroundwork: ResolvedBeltView["cumulativeReviewGroundwork"];
}

type FilterType = "all" | "throws" | "groundwork" | "combinations";

export default function TechniqueGrid({
  throws,
  groundwork,
  ukemi,
  combinations,
  counters,
  cumulativeReviewThrows,
  cumulativeReviewGroundwork,
}: TechniqueGridProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [selectedTechnique, setSelectedTechnique] = useState<Technique | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);

  const handleSelectTechnique = (t: Technique) => {
    setSelectedTechnique(t);
    setSheetOpen(true);
  };

  const showThrows = activeFilter === "all" || activeFilter === "throws";
  const showGroundwork = activeFilter === "all" || activeFilter === "groundwork";
  const showCombos =
    activeFilter === "all" || activeFilter === "combinations";

  const totalNewCount = throws.length + groundwork.length;
  const totalReviewCount =
    cumulativeReviewThrows.length + cumulativeReviewGroundwork.length;

  return (
    <div className="space-y-12">
      {/* Category Sub-Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink/10 pb-4">
        <div>
          <h3 className="font-display text-xl font-semibold tracking-[-0.015em]">
            New Techniques
          </h3>
          <p className="text-[13px] text-muted-foreground mt-0.5">
            Techniques introduced at this grade for technical assessment
          </p>
        </div>

        <div className="flex items-center gap-1 rounded-full border border-ink/12 bg-secondary/30 p-1 text-[11.5px]">
          <button
            type="button"
            onClick={() => setActiveFilter("all")}
            className={cn(
              "rounded-full px-3 py-1 font-medium transition-all",
              activeFilter === "all"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}>
            All ({totalNewCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("throws")}
            className={cn(
              "rounded-full px-3 py-1 font-medium transition-all",
              activeFilter === "throws"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}>
            Throws ({throws.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("groundwork")}
            className={cn(
              "rounded-full px-3 py-1 font-medium transition-all",
              activeFilter === "groundwork"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}>
            Groundwork ({groundwork.length})
          </button>
          {((combinations && combinations.length > 0) ||
            (counters && counters.length > 0)) && (
            <button
              type="button"
              onClick={() => setActiveFilter("combinations")}
              className={cn(
                "rounded-full px-3 py-1 font-medium transition-all",
                activeFilter === "combinations"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}>
              Combos & Counters
            </button>
          )}
        </div>
      </div>

      {/* Ukemi Section */}
      {ukemi.length > 0 && activeFilter === "all" && (
        <Reveal>
          <div className="space-y-3">
            <div>
              <h4 className="font-display text-lg font-semibold tracking-[-0.01em]">
                Ukemi-waza
              </h4>
              <p className="text-[12.5px] text-muted-foreground">
                Breakfall Foundations & Mat Safety
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {ukemi.map((u) => (
                <TechniqueCard
                  key={u.id}
                  technique={u}
                  onSelect={handleSelectTechnique}
                />
              ))}
            </div>
          </div>
        </Reveal>
      )}

      {/* Tachi-waza Section */}
      {showThrows && throws.length > 0 && (
        <Reveal>
          <div className="space-y-3">
            <div>
              <h4 className="font-display text-lg font-semibold tracking-[-0.01em]">
                Tachi-waza
              </h4>
              <p className="text-[12.5px] text-muted-foreground">
                Standing Techniques & Throws
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {throws.map((t) => (
                <TechniqueCard
                  key={t.id}
                  technique={t}
                  onSelect={handleSelectTechnique}
                />
              ))}
            </div>
          </div>
        </Reveal>
      )}

      {/* Combinations & Counters */}
      {showCombos &&
        ((combinations && combinations.length > 0) ||
          (counters && counters.length > 0)) && (
          <Reveal>
            <div className="space-y-3">
              <div>
                <h4 className="font-display text-lg font-semibold tracking-[-0.01em]">
                  Renraku-waza & Kaeshi-waza
                </h4>
                <p className="text-[12.5px] text-muted-foreground">
                  Combination Chains & Counter Reversals
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {combinations?.map((c) => (
                  <div
                    key={c.id}
                    className="rounded-xl border border-ink/10 bg-card p-4">
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 font-mono text-[9px] text-primary font-medium">
                      Combination
                    </span>
                    <h5 className="mt-2 font-display text-base font-semibold">
                      {c.fromTechnique.name} → {c.toTechnique.name}
                    </h5>
                    <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground">
                      {c.cue}
                    </p>
                  </div>
                ))}

                {counters?.map((k) => (
                  <div
                    key={k.id}
                    className="rounded-xl border border-ink/10 bg-card p-4">
                    <span className="rounded-full bg-secondary px-2 py-0.5 font-mono text-[9px] text-foreground font-medium">
                      Counter
                    </span>
                    <h5 className="mt-2 font-display text-base font-semibold">
                      Against {k.againstTechnique.name} → {k.counterTechnique.name}
                    </h5>
                    <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground">
                      {k.cue}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        )}

      {/* Ne-waza Section */}
      {showGroundwork && groundwork.length > 0 && (
        <Reveal>
          <div className="space-y-3">
            <div>
              <h4 className="font-display text-lg font-semibold tracking-[-0.01em]">
                Ne-waza
              </h4>
              <p className="text-[12.5px] text-muted-foreground">
                Groundwork, Pins & Submissions
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {groundwork.map((g) => (
                <TechniqueCard
                  key={g.id}
                  technique={g}
                  onSelect={handleSelectTechnique}
                />
              ))}
            </div>
          </div>
        </Reveal>
      )}

      {/* Cumulative Review Accordion */}
      {totalReviewCount > 0 && (
        <Reveal>
          <div className="rounded-xl border border-ink/10 bg-secondary/20 p-4 sm:p-5">
            <button
              type="button"
              onClick={() => setReviewOpen((prev) => !prev)}
              className="flex w-full items-center justify-between text-left">
              <div className="flex items-center gap-2.5">
                <History className="h-4 w-4 text-primary" />
                <div>
                  <h4 className="font-display text-base font-semibold">
                    Cumulative Review from Earlier Grades ({totalReviewCount} techniques)
                  </h4>
                  <p className="text-[12px] text-muted-foreground">
                    Exams test mastery across all prior ranks. Click to review previous curriculum.
                  </p>
                </div>
              </div>
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-muted-foreground transition-transform duration-200",
                  reviewOpen && "rotate-180"
                )}
              />
            </button>

            {reviewOpen && (
              <div className="mt-5 space-y-5 border-t border-ink/10 pt-4 animate-rise">
                <div>
                  <p className="text-[12px] font-semibold text-foreground">
                    Previously Studied Throws:
                  </p>
                  <div className="mt-2.5 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                    {cumulativeReviewThrows.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-lg bg-card p-3 border border-ink/10 text-[12px]">
                        <span className="flex items-center gap-1.5 font-mono text-[8.5px] text-primary font-medium">
                          <BeltBar rank={item.beltRank} className="h-3 w-auto" />
                          {item.beltRank} Belt
                        </span>
                        <p className="font-semibold text-foreground mt-0.5">
                          {item.name}
                        </p>
                        <p className="text-[11.5px] text-muted-foreground">
                          {item.translation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {cumulativeReviewGroundwork.length > 0 && (
                  <div>
                    <p className="text-[12px] font-semibold text-foreground">
                      Previously Studied Groundwork:
                    </p>
                    <div className="mt-2.5 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                      {cumulativeReviewGroundwork.map((item) => (
                        <div
                          key={item.id}
                          className="rounded-lg bg-card p-3 border border-ink/10 text-[12px]">
                          <span className="flex items-center gap-1.5 font-mono text-[8.5px] text-primary font-medium">
                            <BeltBar rank={item.beltRank} className="h-3 w-auto" />
                            {item.beltRank} Belt
                          </span>
                          <p className="font-semibold text-foreground mt-0.5">
                            {item.name}
                          </p>
                          <p className="text-[11.5px] text-muted-foreground">
                            {item.translation}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </Reveal>
      )}

      {/* Slide-out Sheet for Technique Details */}
      <TechniqueSheet
        technique={selectedTechnique}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </div>
  );
}
