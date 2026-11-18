import { AlertTriangle, ChevronRight } from "lucide-react";
import type { Technique } from "@/lib/types/syllabus";

interface TechniqueCardProps {
  technique: Technique;
  onSelect: (technique: Technique) => void;
}

export default function TechniqueCard({
  technique,
  onSelect,
}: TechniqueCardProps) {
  return (
    <div
      onClick={() => onSelect(technique)}
      className="group relative flex h-full cursor-pointer flex-col justify-between rounded-xl border border-ink/10 bg-card p-4 transition-all duration-300 hover:border-primary/40 hover:bg-card/90 hover:shadow-md">
      <div>
        {/* Top Badges & Japanese Kanji */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="rounded-full bg-secondary/80 px-2 py-0.5 font-mono  text-[8.5px] uppercase tracking-[0.14em] text-secondary-foreground font-medium">
              {technique.group}
            </span>
            {technique.gokyoGroup && (
              <span className="rounded-full border border-primary/30 px-2 py-0.5 font-mono text-[9px] text-primary">
                Gokyo {technique.gokyoGroup}
              </span>
            )}
            {technique.shiaiStatus === "banned_leg_grab" && (
              <span className="rounded-full bg-destructive/10 px-2 py-0.5 font-mono text-[8.5px] text-destructive font-medium">
                Kata / Traditional
              </span>
            )}
          </div>

          {technique.kanji && (
            <span className="font-mono text-sm tracking-wider text-muted-foreground/60">
              {technique.kanji}
            </span>
          )}
        </div>

        {/* Technique Title & English Translation */}
        <div className="mt-3">
          <h4 className="font-display text-base font-semibold tracking-[-0.01em] text-foreground transition-colors group-hover:text-primary">
            {technique.name}
          </h4>
          <p className="text-[12.5px] text-muted-foreground mt-0.5">
            {technique.translation}
          </p>
        </div>

        {/* Subtle Safety Indicator if Dangerous */}
        {/* {technique.safety && technique.safety.length > 0 && (
          <div className="mt-2.5 flex items-center gap-1.5 rounded bg-destructive/10 px-2 py-1 text-[11px] text-destructive font-medium">
            <AlertTriangle className="h-3 w-3 shrink-0" />
            <span className="truncate">Safety protocol applies</span>
          </div>
        )} */}
      </div>

      {/* Card Action Link */}
      {/* <div className="mt-4 flex items-center justify-between border-t border-ink/8 pt-2.5 font-mono text-[10px] text-primary font-medium transition-transform group-hover:translate-x-0.5">
        <span>View technique mechanics</span>
        <ChevronRight className="h-3.5 w-3.5" />
      </div> */}
    </div>
  );
}
