import { useState, useEffect } from "react";
import {
  CheckCircle,
  Circle,
  Clock,
  Flame,
  ShieldCheck,
  Target,
  Sparkles,
} from "lucide-react";
import type { ResolvedBeltView } from "@/lib/types/syllabus";
import Reveal from "@/components/visual/Reveal";

interface PassageDeGradeSectionProps {
  view: ResolvedBeltView;
}

export default function PassageDeGradeSection({
  view,
}: PassageDeGradeSectionProps) {
  const { exam, rankName } = view;

  // SSR-safe client-side preparation checklist stored in localStorage
  const storageKey = `uba:belt-readiness:${view.slug}:v2`;
  const [checkedTasks, setCheckedTasks] = useState<Record<string, boolean>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setCheckedTasks(JSON.parse(stored));
      }
    } catch {
      // ignore storage access errors
    }
  }, [storageKey]);

  const toggleTask = (taskId: string) => {
    setCheckedTasks((prev) => {
      const next = { ...prev, [taskId]: !prev[taskId] };
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        // ignore storage errors
      }
      return next;
    });
  };

  if (!exam) {
    // For Black Belt / Yudansha
    return (
      <div className="rounded-2xl border border-ink/10 bg-secondary/30 p-8 text-center max-w-2xl mx-auto">
        <Sparkles className="h-8 w-8 text-primary mx-auto" />
        <h3 className="mt-3 font-display text-xl font-semibold">
          Yudansha Degree (Shodan & Beyond)
        </h3>
        <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">
          Black belt promotions are governed by national and continental grading commissions (FECAJUDO / African Judo Union). Athletes prepare by compiling competitive points, technical kata mastery, and dedicated coaching hours.
        </p>
      </div>
    );
  }

  const totalTasks = exam.technical.length;
  const completedCount = mounted
    ? Object.values(checkedTasks).filter(Boolean).length
    : 0;
  const progressPercent =
    totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  return (
    <div className="space-y-12">
      {/* 3-Pillar Grade Transition Header */}
      <Reveal>
        <div className="rounded-2xl border border-ink/10 bg-secondary/30 p-6 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-display text-xl font-semibold tracking-[-0.015em]">
                Passage de Grade — {rankName} → {exam.nextRankTitle}
              </h3>
              <p className="text-[13px] text-muted-foreground mt-0.5">
                Promotion requirements and technical evaluation criteria
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-ink/12 bg-card px-3.5 py-1 text-[12px]">
              <span className="text-muted-foreground">Self-readiness:</span>
              <span className="font-semibold text-primary">
                {completedCount} / {totalTasks} ({progressPercent}%)
              </span>
            </div>
          </div>

          <p className="mt-3 text-[13.5px] leading-relaxed text-muted-foreground">
            Attendance unlocks testing eligibility at UBa Judo Club. The technical examination board then evaluates execution quality, balance control, and partner safety.
          </p>

          {/* 3 Pillars Overview */}
          <div className="mt-6 grid gap-4 sm:grid-cols-3 border-t border-ink/10 pt-5">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                <Target className="h-4 w-4" />
              </div>
              <div>
                <span className="font-display text-lg font-semibold">
                  {exam.targetSessions} Sessions
                </span>
                <p className="text-[11.5px] text-muted-foreground">
                  Pillar 1: Attendance Floor
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <span className="font-display text-lg font-semibold">
                  {exam.minMonths} Months
                </span>
                <p className="text-[11.5px] text-muted-foreground">
                  Pillar 2: Maturation Time
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <span className="font-display text-lg font-semibold">
                  Technical Board
                </span>
                <p className="text-[11.5px] text-muted-foreground">
                  Pillar 3: Coach Sign-off
                </p>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Interactive Preparation Checklist */}
      <Reveal>
        <div className="space-y-3">
          <div className="flex items-end justify-between">
            <div>
              <h4 className="font-display text-lg font-semibold tracking-[-0.01em]">
                Examination Rubric & Preparation
              </h4>
              <p className="text-[12.5px] text-muted-foreground">
                Technical requirements assessed during grading day
              </p>
            </div>
            <p className="hidden text-[11.5px] text-muted-foreground sm:block">
              Click items as you master them on the tatami
            </p>
          </div>

          <div className="grid gap-2.5 sm:grid-cols-2">
            {exam.technical.map((task, idx) => {
              const isChecked = Boolean(checkedTasks[task.id]);
              return (
                <button
                  key={task.id}
                  type="button"
                  onClick={() => toggleTask(task.id)}
                  className={`flex items-start gap-3 rounded-xl border p-3.5 text-left transition-all ${
                    isChecked
                      ? "border-primary/40 bg-primary/5"
                      : "border-ink/10 bg-card hover:border-ink/25"
                  }`}>
                  {isChecked ? (
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  ) : (
                    <Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/40" />
                  )}
                  <div>
                    <span className="font-mono text-[9px] text-primary font-medium">
                      Requirement 0{idx + 1}
                    </span>
                    <p
                      className={`text-[12.5px] leading-snug mt-0.5 ${
                        isChecked
                          ? "line-through text-muted-foreground"
                          : "text-foreground font-medium"
                      }`}>
                      {task.label}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </Reveal>

      {/* Combat & Randori Evaluation Card */}
      <Reveal>
        <div className="rounded-xl border border-ink/10 bg-band p-5 sm:p-6 text-band-foreground">
          <div className="flex items-center gap-2 text-primary">
            <Flame className="h-4 w-4" />
            <span className="text-[12px] font-medium tracking-wide">
              Combat Evaluation & Fighting Spirit
            </span>
          </div>

          <h4 className="mt-2 font-display text-lg font-semibold">
            Randori Duration & Board Assessment
          </h4>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-white/5 p-3.5">
              <p className="text-[11px] text-band-foreground/60">
                Tachi-waza (Standing)
              </p>
              <p className="mt-1 font-display text-xl font-semibold">
                {exam.randori.standingMin} Minutes
              </p>
              <p className="mt-0.5 text-[11px] text-band-foreground/75">
                Standing free sparring with partner rotation
              </p>
            </div>

            <div className="rounded-lg bg-white/5 p-3.5">
              <p className="text-[11px] text-band-foreground/60">
                Ne-waza (Groundwork)
              </p>
              <p className="mt-1 font-display text-xl font-semibold">
                {exam.randori.groundMin} Minutes
              </p>
              <p className="mt-0.5 text-[11px] text-band-foreground/75">
                Groundwork sparring initiated from knees
              </p>
            </div>

            <div className="rounded-lg bg-white/5 p-3.5">
              <p className="text-[11px] text-band-foreground/60">
                Coaching Evaluation Focus
              </p>
              <p className="mt-1 text-[11.5px] leading-relaxed text-band-foreground/85">
                {exam.randori.focus}
              </p>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
