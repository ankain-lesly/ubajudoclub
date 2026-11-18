import { useState } from "react";
import {
  CheckCircle,
  Circle,
  FileCheck2,
  Flame,
  HelpCircle,
  ListOrdered,
  Users,
} from "lucide-react";
import type { PassageDeGradeExam } from "@/lib/types/syllabus";
import SpotlightCard from "@/components/visual/SpotlightCard";
import Reveal from "@/components/visual/Reveal";

interface PassageDeGradeSectionProps {
  exam: PassageDeGradeExam;
  rankName: string;
}

export default function PassageDeGradeSection({
  exam,
  rankName,
}: PassageDeGradeSectionProps) {
  // Client-side self-readiness toggle checklist
  const [checkedTasks, setCheckedTasks] = useState<Record<string, boolean>>({});

  const allTasks = exam.evaluationModules.flatMap((m) => m.tasks);
  const totalTasks = allTasks.length;
  const completedTasksCount =
    Object.values(checkedTasks).filter(Boolean).length;
  const progressPercentage =
    totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 0;

  const toggleTask = (taskId: string) => {
    setCheckedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  return (
    <div className="space-y-12">
      {/* Overview & Prerequisites Card */}
      <Reveal>
        <div className="rounded-2xl border border-ink/12 bg-secondary/30 p-7 lg:p-9">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-primary">
                Official Examination Protocol
              </p>
              <h3 className="mt-2 font-display text-2xl font-semibold tracking-[-0.02em]">
                Passage de Grade — {rankName}
              </h3>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-ink/15 bg-card px-4 py-2 font-mono text-[11px]">
              <span className="text-muted-foreground">Readiness:</span>
              <span className="font-semibold text-primary">
                {completedTasksCount} / {totalTasks} tasks ({progressPercentage}%)
              </span>
            </div>
          </div>

          <p className="mt-4 text-[14px] leading-relaxed text-muted-foreground">
            Grade promotions at UBa Judo Club adhere to FECAJUDO and Kodokan
            standards. Attendance unlocks eligibility; the technical examination
            board validates proficiency, composure, and mat safety.
          </p>

          <div className="mt-7 grid gap-6 border-t border-ink/10 pt-6 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                Minimum Sessions
              </p>
              <p className="mt-1 font-display text-xl font-semibold">
                {exam.minimumSessions} Training Sessions
              </p>
              <p className="mt-1 text-[12px] text-muted-foreground">
                Verified attendance logged at the dojo entrance
              </p>
            </div>

            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                Time in Grade
              </p>
              <p className="mt-1 font-display text-xl font-semibold">
                {exam.minimumTimeMonths} Months Floor
              </p>
              <p className="mt-1 text-[12px] text-muted-foreground">
                Maturing muscle memory & technique absorption
              </p>
            </div>

            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                Coaching Sign-Off
              </p>
              <p className="mt-1 font-display text-xl font-semibold text-primary">
                Mandatory
              </p>
              <p className="mt-1 text-[12px] text-muted-foreground">
                Signed by Head Coach / Technical Board
              </p>
            </div>
          </div>

          {/* Prerequisites */}
          <div className="mt-6 rounded-lg bg-card/60 p-4">
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-foreground font-semibold">
              Formal Prerequisites:
            </p>
            <ul className="mt-2 space-y-1 text-[13px] text-muted-foreground">
              {exam.prerequisites.map((p, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>

      {/* Evaluation Modules & Self-Checklist */}
      <div>
        <Reveal>
          <div className="flex items-end justify-between">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-primary">
                Technical Syllabus Checklist
              </p>
              <h4 className="mt-1 font-display text-2xl font-semibold tracking-[-0.02em]">
                Examination Rubrics & Self-Assessment
              </h4>
            </div>
            <p className="hidden font-mono text-[10px] text-muted-foreground sm:block">
              Interactive preparation tool
            </p>
          </div>
        </Reveal>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {exam.evaluationModules.map((module, mIdx) => (
            <Reveal key={module.title} delay={mIdx * 0.05}>
              <SpotlightCard className="h-full rounded-xl border border-ink/12 bg-card p-6">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <ListOrdered className="h-4 w-4 text-primary" />
                    <span className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-primary">
                      Module 0{mIdx + 1}
                    </span>
                  </div>
                  {module.weightPercentage && (
                    <span className="font-mono text-[9px] text-muted-foreground">
                      Weight: {module.weightPercentage}%
                    </span>
                  )}
                </div>

                <h5 className="mt-3 font-display text-lg font-semibold tracking-[-0.01em]">
                  {module.title}
                </h5>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
                  {module.description}
                </p>

                <div className="mt-5 space-y-2.5 border-t border-ink/10 pt-4">
                  {module.tasks.map((task, tIdx) => {
                    const taskId = `${mIdx}-${tIdx}`;
                    const isChecked = Boolean(checkedTasks[taskId]);
                    return (
                      <button
                        key={taskId}
                        type="button"
                        onClick={() => toggleTask(taskId)}
                        className="flex w-full items-start gap-3 rounded-lg p-2 text-left transition-colors hover:bg-secondary/40">
                        {isChecked ? (
                          <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        ) : (
                          <Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/50" />
                        )}
                        <span
                          className={`text-[12.5px] leading-snug ${
                            isChecked
                              ? "text-foreground line-through opacity-70"
                              : "text-foreground/90"
                          }`}>
                          {task}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Randori / Sparring Requirement Card */}
      <Reveal>
        <div className="rounded-xl border border-ink/12 bg-band p-6 text-band-foreground lg:p-8">
          <div className="flex items-center gap-2 text-primary">
            <Flame className="h-5 w-5" />
            <span className="font-mono text-[9.5px] uppercase tracking-[0.24em]">
              Combat & Randori Examination
            </span>
          </div>

          <h4 className="mt-3 font-display text-xl font-semibold tracking-[-0.015em]">
            Fighting Spirit & Composure Assessment
          </h4>

          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            <div className="rounded-lg bg-white/5 p-4">
              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-band-foreground/60">
                Tachi-waza Randori
              </p>
              <p className="mt-1 font-display text-2xl font-semibold">
                {exam.randoriRequirement.tachiWazaMinutes} Minutes
              </p>
              <p className="mt-1 text-[11.5px] text-band-foreground/75">
                Standing free sparring with shifting partners
              </p>
            </div>

            <div className="rounded-lg bg-white/5 p-4">
              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-band-foreground/60">
                Ne-waza Randori
              </p>
              <p className="mt-1 font-display text-2xl font-semibold">
                {exam.randoriRequirement.neWazaMinutes} Minutes
              </p>
              <p className="mt-1 text-[11.5px] text-band-foreground/75">
                Groundwork sparring starting from knees
              </p>
            </div>

            <div className="rounded-lg bg-white/5 p-4">
              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-band-foreground/60">
                Coaching Evaluation Focus
              </p>
              <p className="mt-1 text-[12.5px] leading-relaxed text-band-foreground/85">
                {exam.randoriRequirement.focus}
              </p>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
