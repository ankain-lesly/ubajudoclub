import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { AlertTriangle, CheckCircle2, ShieldAlert } from "lucide-react";
import type { Technique } from "@/lib/types/syllabus";

interface TechniqueSheetProps {
  technique: Technique | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TechniqueSheet({
  technique,
  open,
  onOpenChange,
}: TechniqueSheetProps) {
  if (!technique) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg overflow-y-auto p-6 sm:p-8">
        <SheetHeader className="text-left border-b border-ink/10 pb-5 px-0">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-secondary/80 px-2.5 py-0.5 font-mono text-[9.5px] text-secondary-foreground font-medium uppercase">
              {technique.group}
            </span>
            {technique.gokyoGroup && (
              <span className="rounded-full border border-primary/30 px-2 py-0.5 font-mono text-[9px] text-primary">
                Gokyo Group {technique.gokyoGroup}
              </span>
            )}
            {technique.kanji && (
              <span className="ml-auto font-mono text-base tracking-widest text-muted-foreground/60">
                {technique.kanji}
              </span>
            )}
          </div>

          <SheetTitle className="font-display text-2xl font-semibold tracking-[-0.02em] mt-2">
            {technique.name}
          </SheetTitle>
          <SheetDescription className="text-[13.5px] text-muted-foreground font-medium mt-0.5">
            {technique.translation}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Legality Notice */}
          {technique.shiaiStatus === "banned_leg_grab" && (
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3.5 text-[12.5px] text-destructive">
              <div className="flex items-center gap-2 font-mono text-[10px] font-semibold">
                <ShieldAlert className="h-4 w-4" />
                IJF Contest Legality Note:
              </div>
              <p className="mt-1 leading-relaxed">
                Direct leg-grab attacks are prohibited in modern IJF shiai competition. This throw remains a core pillar of the Kodokan Judo syllabus and Nage-no-Kata.
              </p>
            </div>
          )}

          {/* Key Execution Cues */}
          <div className="space-y-2">
            <h5 className="font-mono text-[10px] text-primary font-semibold tracking-wider">
              Essential Execution Cues:
            </h5>
            <ul className="space-y-2">
              {technique.cues.map((cue, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-[13px] leading-relaxed text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                  <span>{cue}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 3 Mechanical Execution Phases */}
          <div className="space-y-3">
            <h5 className="font-mono text-[10px] text-foreground font-semibold tracking-wider">
              Biomechanical Progression:
            </h5>

            <div className="rounded-lg border border-ink/10 bg-secondary/20 p-4 space-y-3.5">
              <div>
                <p className="font-mono text-[9.5px] text-foreground font-semibold">
                  Phase 1: Kuzushi (Balance Break)
                </p>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  {technique.details.kuzushi}
                </p>
              </div>

              <div className="border-t border-ink/10 pt-3">
                <p className="font-mono text-[9.5px] text-foreground font-semibold">
                  Phase 2: Tsukuri (Positioning & Fit)
                </p>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  {technique.details.tsukuri}
                </p>
              </div>

              <div className="border-t border-ink/10 pt-3">
                <p className="font-mono text-[9.5px] text-foreground font-semibold">
                  Phase 3: Kake (Execution & Finish)
                </p>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  {technique.details.kake}
                </p>
              </div>
            </div>
          </div>

          {/* Common Mistakes */}
          {technique.details.mistakes && technique.details.mistakes.length > 0 && (
            <div className="space-y-2 border-t border-ink/10 pt-4">
              <h5 className="font-mono text-[10px] text-foreground font-semibold tracking-wider">
                Common Traps to Avoid:
              </h5>
              <ul className="list-inside list-disc space-y-1.5 text-[12.5px] text-muted-foreground">
                {technique.details.mistakes.map((m, idx) => (
                  <li key={idx}>{m}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Safety Warnings */}
          {technique.safety && technique.safety.length > 0 && (
            <div className="rounded-lg bg-destructive/10 p-3.5 text-destructive border border-destructive/20">
              <div className="flex items-center gap-1.5 font-mono text-[10px] font-semibold">
                <AlertTriangle className="h-4 w-4" />
                Safety Alert:
              </div>
              <ul className="mt-1.5 list-inside list-disc space-y-1 text-[12px]">
                {technique.safety.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Coaching Note / History */}
          {technique.details.coachingNote && (
            <p className="border-l-2 border-primary/50 pl-3 font-mono text-[11.5px] leading-relaxed text-muted-foreground italic">
              {technique.details.coachingNote}
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
