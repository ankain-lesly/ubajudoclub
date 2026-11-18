import { useState } from "react";
import { Link, data } from "react-router";
import { ArrowLeft, BookOpen, Layers, ShieldCheck, Sparkles, Swords } from "lucide-react";
import type { Route } from "./+types/belts.$color";
import { getSyllabusBySlug, isValidBeltSlug } from "@/lib/data/syllabus";
import SyllabusHero from "@/components/belts/SyllabusHero";
import TechniqueGrid from "@/components/belts/TechniqueGrid";
import PassageDeGradeSection from "@/components/belts/PassageDeGradeSection";
import KataSection from "@/components/belts/KataSection";
import GeneralAwarenessSection from "@/components/belts/GeneralAwarenessSection";
import BeltNavigator from "@/components/belts/BeltNavigator";
import SectionBackdrop from "@/components/visual/SectionBackdrop";
import Reveal from "@/components/visual/Reveal";
import { cn } from "@/lib/utils";

export async function loader({ params }: Route.LoaderArgs) {
  const { color } = params;
  if (!color || !isValidBeltSlug(color)) {
    throw data(null, { status: 404 });
  }

  const syllabus = getSyllabusBySlug(color);
  if (!syllabus) {
    throw data(null, { status: 404 });
  }

  return { syllabus };
}

export function meta({ loaderData }: Route.MetaArgs) {
  if (!loaderData) {
    return [{ title: "Belt Syllabus Not Found — UBa Judo Club" }];
  }
  const { syllabus } = loaderData;
  return [
    { title: `${syllabus.rank} (${syllabus.kyuRank}) Syllabus & Passage de Grade — UBa Judo Club` },
    {
      name: "description",
      content: `${syllabus.rank} syllabus for UBa Judo Club: Gokyo throwing techniques, Ne-waza groundwork, Kata, breakfalls, and Passage de Grade examination criteria.`,
    },
    { property: "og:title", content: `${syllabus.rank} Syllabus — UBa Judo Club` },
    {
      property: "og:description",
      content: `Full technical curriculum and exam requirements for ${syllabus.rank} at University of Bamenda Judo Club.`,
    },
  ];
}

export function ErrorBoundary() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-24 text-center lg:px-8 lg:py-32">
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">
        Grade Syllabus Not Found
      </p>
      <h1 className="mt-5 font-display text-[clamp(2rem,4vw,3rem)] font-semibold tracking-[-0.03em]">
        That belt program does not exist on the ladder.
      </h1>
      <p className="mt-3 text-[14px] text-muted-foreground">
        Choose from White, Yellow, Orange, Green, Blue, Brown, or Black.
      </p>
      <Link
        to="/belts"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-paper">
        <ArrowLeft className="h-4 w-4" />
        Back to Belt Pathway
      </Link>
    </section>
  );
}

type TabType =
  | "all"
  | "tachi-waza"
  | "ne-waza"
  | "kata"
  | "ukemi-reiho"
  | "theory"
  | "exam";

export default function BeltSyllabusDetail({ loaderData }: Route.ComponentProps) {
  const { syllabus } = loaderData;
  const [activeTab, setActiveTab] = useState<TabType>("all");

  const tabs: Array<{ id: TabType; label: string; icon: any; count?: number }> = [
    { id: "all", label: "Full Syllabus", icon: Layers },
    {
      id: "tachi-waza",
      label: "Throws (Tachi-waza)",
      icon: Swords,
      count: syllabus.tachiWaza.length,
    },
    {
      id: "ne-waza",
      label: "Groundwork (Ne-waza)",
      icon: Swords,
      count: syllabus.neWaza.length,
    },
    ...(syllabus.kata && syllabus.kata.length > 0
      ? [{ id: "kata" as TabType, label: "Kata", icon: BookOpen, count: syllabus.kata.length }]
      : []),
    {
      id: "ukemi-reiho",
      label: "Ukemi & Reiho",
      icon: Sparkles,
      count: syllabus.ukemi.length,
    },
    {
      id: "theory",
      label: "Culture & Rules",
      icon: BookOpen,
      count: syllabus.generalAwareness.vocabulary.length,
    },
    {
      id: "exam",
      label: "Passage de Grade",
      icon: ShieldCheck,
      count: syllabus.examRequirements.evaluationModules.length,
    },
  ];

  return (
    <div>
      <SyllabusHero syllabus={syllabus} />

      {/* Sticky Tab Navigation Bar */}
      <section className="sticky top-0 z-30 border-b border-ink/10 bg-background/95 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <div className="flex space-x-2 overflow-x-auto py-3 scrollbar-none">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-[12px] font-medium transition-all",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-secondary/40 text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}>
                  <Icon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span
                      className={cn(
                        "rounded-full px-1.5 py-0.2 font-mono text-[9px] tabular-nums",
                        isActive
                          ? "bg-primary-foreground/20 text-primary-foreground"
                          : "bg-ink/10 text-muted-foreground"
                      )}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <section className="relative mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-24">
        <SectionBackdrop variant="weave" className="opacity-50" />

        <div className="relative space-y-20">
          {/* Tachi-waza (Standing Throws) */}
          {(activeTab === "all" || activeTab === "tachi-waza") && (
            <div id="tachi-waza">
              <TechniqueGrid
                techniques={syllabus.tachiWaza}
                eyebrow="Tachi-waza Syllabus"
                title="Standing Techniques & Throws"
              />
            </div>
          )}

          {/* Combinations & Counters (if applicable) */}
          {(activeTab === "all" || activeTab === "tachi-waza") &&
            syllabus.renrakuKaeshiWaza &&
            syllabus.renrakuKaeshiWaza.length > 0 && (
              <div id="combinations">
                <TechniqueGrid
                  techniques={syllabus.renrakuKaeshiWaza}
                  eyebrow="Renraku-waza & Kaeshi-waza"
                  title="Combinations & Counter-Throws"
                />
              </div>
            )}

          {/* Ne-waza (Groundwork) */}
          {(activeTab === "all" || activeTab === "ne-waza") && (
            <div id="ne-waza">
              <TechniqueGrid
                techniques={syllabus.neWaza}
                eyebrow="Ne-waza Syllabus"
                title="Groundwork, Pins & Submissions"
              />
            </div>
          )}

          {/* Kata (Forms) */}
          {(activeTab === "all" || activeTab === "kata") && syllabus.kata && (
            <div id="kata">
              <KataSection kataList={syllabus.kata} />
            </div>
          )}

          {/* Ukemi & Reiho */}
          {(activeTab === "all" || activeTab === "ukemi-reiho") && (
            <div id="ukemi-reiho" className="space-y-12">
              <TechniqueGrid
                techniques={syllabus.ukemi}
                eyebrow="Ukemi-waza"
                title="Breakfall Mastery"
              />
            </div>
          )}

          {/* Theory, Rules & Culture */}
          {(activeTab === "all" || activeTab === "theory") && (
            <div id="theory">
              <GeneralAwarenessSection
                awareness={syllabus.generalAwareness}
                reiho={syllabus.reihoAndEtiquette}
              />
            </div>
          )}

          {/* Passage de Grade Exam Rubrics */}
          {(activeTab === "all" || activeTab === "exam") && (
            <div id="exam">
              <PassageDeGradeSection
                exam={syllabus.examRequirements}
                rankName={syllabus.rank}
              />
            </div>
          )}
        </div>
      </section>

      {/* Prev / Next Belt Stepper Navigator */}
      <BeltNavigator
        prevSlug={syllabus.prevBeltSlug}
        nextSlug={syllabus.nextBeltSlug}
      />
    </div>
  );
}
