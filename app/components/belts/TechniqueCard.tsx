import { AlertTriangle, ChevronRight } from "lucide-react";
import BeltBar from "@/components/visual/BeltBar";
import type { Technique } from "@/lib/types/syllabus";
import type { Rank } from "@/lib/types";

interface TechniqueCardProps {
  technique: Technique;
  onSelect: (technique: Technique) => void;
  beltRank?: Rank;
  beltColor?: string;
  showBelt?: boolean;
}

export default function TechniqueCard({
  technique,
  onSelect,
  beltRank,
  beltColor,
  showBelt = false,
}: TechniqueCardProps) {
  return (
    <div
      onClick={() => onSelect(technique)}
      className="group relative flex h-full cursor-pointer flex-col justify-between rounded-xl border border-ink/10 bg-card p-4 transition-all duration-300 hover:border-primary/40 hover:bg-card/90 hover:shadow-md">
      <div>
        {/* Top Badges & Japanese Kanji */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="rounded-full bg-secondary/80 px-2 py-0.5 font-mono text-[8.5px] uppercase tracking-[0.14em] text-secondary-foreground font-medium">
              {technique.group}
            </span>
            {technique.gokyoGroup && (
              <span className="rounded-full border border-primary/30 bg-primary/5 px-2 py-0.5 font-mono text-[9px] text-primary font-medium">
                Gokyo {technique.gokyoGroup}
              </span>
            )}
            {technique.shiaiStatus === "banned_leg_grab" && (
              <span className="rounded-full bg-destructive/10 px-2 py-0.5 font-mono text-[8.5px] text-destructive font-medium">
                Traditional / Kata
              </span>
            )}
            {(showBelt || beltRank) && beltRank && (
              <div
                className="inline-flex items-center"
                title={`${beltRank} Belt Syllabus`}
                aria-label={`${beltRank} Belt`}
              >
                <BeltBar rank={beltRank} color={beltColor} className="h-3.5 w-auto" />
              </div>
            )}
          </div>

          {technique.kanji && (
            <span className="font-mono text-sm tracking-wider text-muted-foreground/60 select-none">
              {technique.kanji}
            </span>
          )}
        </div>

        {/* Technique Title & English Translation */}
        <div className="mt-3">
          <h4 className="font-display text-base font-semibold tracking-[-0.01em] text-foreground transition-colors group-hover:text-primary">
            {technique.name}
          </h4>
          <p className="text-[12.5px] text-muted-foreground mt-0.5 line-clamp-1">
            {technique.translation}
          </p>
        </div>

        {/* Key execution cue preview */}
        {technique.cues && technique.cues[0] && (
          <p className="mt-3 text-[11.5px] leading-relaxed text-muted-foreground/80 line-clamp-2 border-t border-ink/6 pt-2">
            {technique.cues[0]}
          </p>
        )}
      </div>

      {/* Card Action Link */}
      <div className="mt-3.5 flex items-center justify-between border-t border-ink/8 pt-2 font-mono text-[10px] text-primary font-medium transition-transform group-hover:translate-x-0.5">
        <span>View mechanics</span>
        <ChevronRight className="h-3.5 w-3.5" />
      </div>
    </div>
  );
}
