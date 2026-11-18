import { useSearchParams, Link, data } from "react-router";
import { ArrowLeft, Layers, ShieldCheck } from "lucide-react";
import type { Route } from "./+types/belts.$color";
import { getBeltView, isValidBeltSlug } from "@/lib/data/syllabus";
import SyllabusHero from "@/components/belts/SyllabusHero";
import TechniqueGrid from "@/components/belts/TechniqueGrid";
import PassageDeGradeSection from "@/components/belts/PassageDeGradeSection";
import KataSection from "@/components/belts/KataSection";
import GeneralAwarenessSection from "@/components/belts/GeneralAwarenessSection";
import BeltNavigator from "@/components/belts/BeltNavigator";
import SectionBackdrop from "@/components/visual/SectionBackdrop";
import { cn } from "@/lib/utils";

export async function loader({ params }: Route.LoaderArgs) {
  const { color } = params;
  if (!color || !isValidBeltSlug(color)) {
    throw data(null, { status: 404 });
  }

  const view = getBeltView(color);
  if (!view) {
    throw data(null, { status: 404 });
  }

  return { view };
}

export function meta({ loaderData }: Route.MetaArgs) {
  if (!loaderData) {
    return [{ title: "Belt Syllabus Not Found — UBa Judo Club" }];
  }
  const { view } = loaderData;
  return [
    { title: `${view.rankName} (${view.kyuTitle}) Syllabus & Passage de Grade — UBa Judo Club` },
    {
      name: "description",
      content: `${view.rankName} syllabus for UBa Judo Club: Kodokan Gokyo throws, Ne-waza groundwork, Kata, breakfalls, and Passage de Grade examination criteria.`,
    },
    { property: "og:title", content: `${view.rankName} Syllabus — UBa Judo Club` },
    {
      property: "og:description",
      content: `Full technical curriculum and exam requirements for ${view.rankName} at University of Bamenda Judo Club.`,
    },  
  ];
}

export function ErrorBoundary() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-24 text-center lg:px-8 lg:py-32">
      <p className="font-mono text-[10px] text-primary">
        Grade Syllabus Not Found
      </p>
      <h1 className="mt-4 font-display text-[clamp(2rem,4vw,3rem)] font-semibold tracking-[-0.03em]">
        That belt rank does not exist on the pathway.
      </h1>
      <p className="mt-2 text-[14px] text-muted-foreground">
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

type ViewMode = "curriculum" | "passage-de-grade";

export default function BeltSyllabusDetail({ loaderData }: Route.ComponentProps) {
  const { view } = loaderData;
  const [searchParams, setSearchParams] = useSearchParams();

  // Exactly two primary views: 'curriculum' (default) and 'passage-de-grade'
  const currentView = searchParams.get("view");
  const activeMode: ViewMode =
    currentView === "passage-de-grade" ? "passage-de-grade" : "curriculum";

  const setMode = (mode: ViewMode) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (mode === "curriculum") {
        next.delete("view");
      } else {
        next.set("view", mode);
      }
      return next;
    });
  };

  const isBlack = view.slug === "black";
  const totalTechniques = view.resolvedThrows.length + view.resolvedGroundwork.length;

  return (
    <div>
      <SyllabusHero view={view} />

      {/* Sticky Clean 2-Tab Navigation (Pinned cleanly at top-[72px] below fixed header) */}
      <section className="sticky top-[72px] z-30 border-b border-ink/10 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-1.5 rounded-full border border-ink/12 bg-secondary/35 p-1 text-[12px]">
              {/* Tab 1: Curriculum */}
              <button
                type="button"
                onClick={() => setMode("curriculum")}
                className={cn(
                  "flex items-center gap-2 rounded-full px-4 py-1.5 font-medium transition-all",
                  activeMode === "curriculum"
                    ? "bg-primary text-primary-foreground shadow-sm font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                )}>
                <Layers className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Curriculum</span>
                <span className="sm:hidden">Techniques</span>
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[10px] font-mono",
                    activeMode === "curriculum"
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-ink/8 text-muted-foreground"
                  )}>
                  {totalTechniques}
                </span>
              </button>

              {/* Tab 2: Passage de Grade */}
              <button
                type="button"
                onClick={() => setMode("passage-de-grade")}
                className={cn(
                  "flex items-center gap-2 rounded-full px-4 py-1.5 font-medium transition-all",
                  activeMode === "passage-de-grade"
                    ? "bg-primary text-primary-foreground shadow-sm font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                )}>
                <ShieldCheck className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">
                  {isBlack ? "Dan Degree" : `Passage de Grade → ${view.nextRankName}`}
                </span>
                <span className="sm:hidden">
                  {isBlack ? "Dan Degree" : "Exam"}
                </span>
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-[12px] text-muted-foreground font-medium">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: view.color }}
              />
              <span>{view.rankName}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <section className="relative mx-auto max-w-6xl px-5 py-10 lg:px-8 lg:py-16">
        <SectionBackdrop variant="weave" className="opacity-35" />

        <div className="relative space-y-16">
          {/* Tab 1: Curriculum & Techniques + Kata + Theory Terms at the end */}
          {activeMode === "curriculum" && (
            <div className="space-y-16 animate-rise">
              <TechniqueGrid
                throws={view.resolvedThrows}
                groundwork={view.resolvedGroundwork}
                ukemi={view.resolvedUkemi}
                combinations={view.combinations}
                counters={view.counters}
                cumulativeReviewThrows={view.cumulativeReviewThrows}
                cumulativeReviewGroundwork={view.cumulativeReviewGroundwork}
              />

              {view.kata && view.kata.length > 0 && (
                <div className="border-t border-ink/10 pt-12">
                  <KataSection kataList={view.kata} />
                </div>
              )}

              {/* Theory and Terms cleanly integrated at the end of curriculum */}
              <GeneralAwarenessSection
                terms={view.terms}
                rules={view.rules}
              />
            </div>
          )}

          {/* Tab 2: Passage de Grade Exam Rubrics & Preparation */}
          {activeMode === "passage-de-grade" && (
            <div className="animate-rise">
              <PassageDeGradeSection view={view} />
            </div>
          )}
        </div>
      </section>

      {/* Prev / Next Grade Stepper Footer */}
      <BeltNavigator
        prevSlug={view.prevSlug}
        nextSlug={view.nextSlug}
      />
    </div>
  );
}
