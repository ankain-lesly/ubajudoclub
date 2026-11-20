import { useState, useMemo, useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import {
  Search,
  X,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Sparkles,
  BookOpen,
  ShieldAlert,
  ArrowUpDown,
  Filter,
  RotateCcw,
  Award,
} from "lucide-react";
import SectionHeading from "@/components/visual/SectionHeading";
import Reveal from "@/components/visual/Reveal";
import Aura from "@/components/visual/Aura";
import RingField from "@/components/visual/RingField";
import HeroBackdrop from "@/components/visual/HeroBackdrop";
import BeltBar from "@/components/visual/BeltBar";
import heroTechniqueDemo from "@/assets/images/judo-technique-demo.webp";
import TechniqueCard from "@/components/belts/TechniqueCard";
import TechniqueSheet from "@/components/belts/TechniqueSheet";
import { getAllTechniques, type EnrichedTechnique } from "@/lib/data/syllabus";
import { BELTS } from "@/lib/data/club";
import type { TechniqueGroup } from "@/lib/types/syllabus";
import type { Rank } from "@/lib/types";
import { env } from "@/lib/env";
import { cn } from "@/lib/utils";
import type { Route } from "./+types/techniques";

export function meta(): Route.MetaDescriptors {
  const ogImageUrl = new URL(heroTechniqueDemo, env.siteUrl).href;

  return [
    { title: "Judo Techniques & Gokyo Archive | UBa Judo Club" },
    {
      name: "description",
      content:
        "Explore the complete 76-technique Kodokan Judo syllabus archive at UBa Judo Club. Search and filter standing throws (Tachi-waza), groundwork holds, strangles, armbars (Ne-waza), and breakfalls (Ukemi).",
    },
    { property: "og:title", content: "Judo Techniques & Gokyo Archive | UBa Judo Club" },
    {
      property: "og:description",
      content:
        "Explore the complete 76-technique Kodokan Judo syllabus archive at UBa Judo Club. Search and filter standing throws, groundwork, and breakfalls.",
    },
    { property: "og:image", content: ogImageUrl },
    { property: "og:image:type", content: "image/webp" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:image", content: ogImageUrl },
  ];
}

export async function loader() {
  const techniques = getAllTechniques();
  return { techniques };
}

const SUBGROUP_LABELS: Record<TechniqueGroup, { label: string; short: string; category: "throws" | "groundwork" | "ukemi" }> = {
  "te-waza": { label: "Hand Techniques (Te-waza)", short: "Te-waza", category: "throws" },
  "koshi-waza": { label: "Hip Techniques (Koshi-waza)", short: "Koshi-waza", category: "throws" },
  "ashi-waza": { label: "Foot & Leg Techniques (Ashi-waza)", short: "Ashi-waza", category: "throws" },
  "ma-sutemi-waza": { label: "Rear Sacrifice Throws (Ma-sutemi-waza)", short: "Ma-sutemi", category: "throws" },
  "yoko-sutemi-waza": { label: "Side Sacrifice Throws (Yoko-sutemi-waza)", short: "Yoko-sutemi", category: "throws" },
  "osaekomi-waza": { label: "Hold-Down Pins (Osaekomi-waza)", short: "Osaekomi", category: "groundwork" },
  "shime-waza": { label: "Strangles & Chokes (Shime-waza)", short: "Shime-waza", category: "groundwork" },
  "kansetsu-waza": { label: "Joint Locks & Armbars (Kansetsu-waza)", short: "Kansetsu-waza", category: "groundwork" },
  "turnovers": { label: "Turnover Sequences", short: "Turnovers", category: "groundwork" },
  "escapes": { label: "Pin Escapes (Ebi)", short: "Escapes", category: "groundwork" },
  "ukemi": { label: "Breakfalls (Ukemi)", short: "Ukemi", category: "ukemi" },
};

const BELT_ORDER: Record<Rank, number> = {
  White: 1,
  Yellow: 2,
  Orange: 3,
  Green: 4,
  Blue: 5,
  Brown: 6,
  Black: 7,
};

export default function TechniquesRoute({ loaderData }: Route.ComponentProps) {
  const { techniques } = loaderData;
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [primaryFilter, setPrimaryFilter] = useState<"all" | "throws" | "groundwork" | "ukemi">("all");
  const [subgroupFilter, setSubgroupFilter] = useState<string>("all");
  const [beltFilter, setBeltFilter] = useState<string>("all");
  const [gokyoFilter, setGokyoFilter] = useState<string>("all");
  const [shiaiFilter, setShiaiFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"belt" | "name" | "gokyo" | "group">("belt");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Selected technique for Slide-over Sheet
  const selectedTechniqueId = searchParams.get("selected");
  const selectedTechnique = useMemo(() => {
    if (!selectedTechniqueId) return null;
    return techniques.find((t) => t.id === selectedTechniqueId) || null;
  }, [techniques, selectedTechniqueId]);

  const handleSelectTechnique = (t: EnrichedTechnique | null) => {
    if (t) {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set("selected", t.id);
        return next;
      });
    } else {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.delete("selected");
        return next;
      });
    }
  };

  // High-level category totals
  const counts = useMemo(() => {
    let throws = 0;
    let groundwork = 0;
    let ukemi = 0;
    techniques.forEach((t) => {
      if (t.primaryCategory === "throws") throws++;
      else if (t.primaryCategory === "groundwork") groundwork++;
      else if (t.primaryCategory === "ukemi") ukemi++;
    });
    return { all: techniques.length, throws, groundwork, ukemi };
  }, [techniques]);

  // Subgroups applicable to current primary filter
  const availableSubgroups = useMemo(() => {
    return (Object.keys(SUBGROUP_LABELS) as TechniqueGroup[]).filter((key) => {
      if (primaryFilter === "all") return true;
      return SUBGROUP_LABELS[key].category === primaryFilter;
    });
  }, [primaryFilter]);

  // Filter & sort logic
  const filteredTechniques = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return techniques
      .filter((t) => {
        // Search text matching
        if (q) {
          const matchName = t.name.toLowerCase().includes(q);
          const matchTrans = t.translation.toLowerCase().includes(q);
          const matchKanji = t.kanji?.toLowerCase().includes(q);
          const matchGroup = t.group.toLowerCase().includes(q);
          const matchCues = t.cues?.some((c) => c.toLowerCase().includes(q));
          if (!matchName && !matchTrans && !matchKanji && !matchGroup && !matchCues) {
            return false;
          }
        }

        // Primary Category
        if (primaryFilter !== "all" && t.primaryCategory !== primaryFilter) {
          return false;
        }

        // Subgroup
        if (subgroupFilter !== "all" && t.group !== subgroupFilter) {
          return false;
        }

        // Belt Filter
        if (beltFilter !== "all" && t.beltRank !== beltFilter) {
          return false;
        }

        // Gokyo Filter
        if (gokyoFilter !== "all") {
          const groupNum = parseInt(gokyoFilter, 10);
          if (t.gokyoGroup !== groupNum) return false;
        }

        // Shiai Legality
        if (shiaiFilter !== "all") {
          if (shiaiFilter === "banned_leg_grab" && t.shiaiStatus !== "banned_leg_grab") {
            return false;
          }
          if (shiaiFilter === "allowed" && t.shiaiStatus === "banned_leg_grab") {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "name") {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === "gokyo") {
          const gA = a.gokyoGroup ?? 99;
          const gB = b.gokyoGroup ?? 99;
          if (gA !== gB) return gA - gB;
          return a.name.localeCompare(b.name);
        }
        if (sortBy === "group") {
          if (a.group !== b.group) return a.group.localeCompare(b.group);
          return a.name.localeCompare(b.name);
        }
        // Default: Belt Order White -> Black
        const orderA = BELT_ORDER[a.beltRank] ?? 99;
        const orderB = BELT_ORDER[b.beltRank] ?? 99;
        if (orderA !== orderB) return orderA - orderB;
        return a.name.localeCompare(b.name);
      });
  }, [
    techniques,
    searchQuery,
    primaryFilter,
    subgroupFilter,
    beltFilter,
    gokyoFilter,
    shiaiFilter,
    sortBy,
  ]);

  const hasActiveFilters =
    searchQuery !== "" ||
    primaryFilter !== "all" ||
    subgroupFilter !== "all" ||
    beltFilter !== "all" ||
    gokyoFilter !== "all" ||
    shiaiFilter !== "all";

  const handleResetFilters = () => {
    setSearchQuery("");
    setPrimaryFilter("all");
    setSubgroupFilter("all");
    setBeltFilter("all");
    setGokyoFilter("all");
    setShiaiFilter("all");
    setSortBy("belt");
  };

  return (
    <div>
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden border-b border-ink/10">
        <HeroBackdrop
          src={heroTechniqueDemo}
          imageClassName="object-[center_35%]"
          opacityClassName="opacity-45 dark:opacity-55"
          gradientVariant="left"
        />
        <Aura grid={false} />

        <div className="pointer-events-none absolute -right-44 -top-36 hidden h-[560px] w-[560px] opacity-70 lg:block">
          <RingField />
        </div>

        <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-24 lg:px-8">
          <Reveal>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary font-semibold">
                Kodokan Gokyo & Ne-waza Library
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span className="font-mono text-[11px] text-muted-foreground/75 tracking-wider select-none">
                柔道技
              </span>
            </div>

            <h1 className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-[-0.03em] text-foreground leading-[1.08]">
              The Complete Technique Archive
            </h1>

            <p className="mt-4 max-w-2xl text-[15px] sm:text-[16.5px] leading-relaxed text-muted-foreground">
              Master the standing throws (Tachi-waza), groundwork hold-downs,
              strangles, joint locks (Ne-waza), and breakfalls (Ukemi) of the
              Kodokan curriculum practiced at the University of Bamenda.
            </p>

            {/* Quick Stats Strip */}
            <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-6 pt-4 border-t border-ink/10">
              <div className="flex items-center gap-2">
                <span className="font-mono text-2xl font-bold text-foreground">
                  76
                </span>
                <span className="text-xs text-muted-foreground leading-tight">
                  Cataloged
                  <br />
                  Techniques
                </span>
              </div>
              <div className="h-6 w-px bg-ink/10 hidden sm:block" />
              <div className="flex items-center gap-2">
                <span className="font-mono text-2xl font-bold text-foreground">
                  42
                </span>
                <span className="text-xs text-muted-foreground leading-tight">
                  Tachi-waza
                  <br />
                  Throws
                </span>
              </div>
              <div className="h-6 w-px bg-ink/10 hidden sm:block" />
              <div className="flex items-center gap-2">
                <span className="font-mono text-2xl font-bold text-foreground">
                  28
                </span>
                <span className="text-xs text-muted-foreground leading-tight">
                  Ne-waza
                  <br />
                  Groundwork
                </span>
              </div>
              <div className="h-6 w-px bg-ink/10 hidden sm:block" />
              <div className="flex items-center gap-2">
                <span className="font-mono text-2xl font-bold text-foreground">
                  5
                </span>
                <span className="text-xs text-muted-foreground leading-tight">
                  Gokyo
                  <br />
                  Groups
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 2. SEARCH & FILTER TOOLBAR */}
      <section className="sticky top-0 z-50 border-b border-ink/10 bg-background/95 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-5 py-4 lg:px-8 space-y-3.5">
          {/* Top row: Search input + View mode toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Japanese name, translation, kanji, or execution cue..."
                className="w-full rounded-full border border-ink/15 bg-card py-2 pl-9 pr-9 text-xs sm:text-[13px] outline-none transition-colors focus:border-primary shadow-xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* View controls */}
            <div className="flex items-center gap-2 self-end sm:self-auto w-full sm:w-auto">
              {/* Sort By Dropdown */}
              <div className="flex w-full items-center gap-1.5 rounded-full border border-ink/15 bg-card px-3 py-1.5 text-xs">
                <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground hidden sm:inline">
                  Sort:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent w-full font-medium text-foreground outline-none cursor-pointer">
                  <option value="belt">Belt Grade</option>
                  <option value="name">Name (A → Z)</option>
                  <option value="gokyo">Gokyo Group (1 → 5)</option>
                  <option value="group">Technique Sub-group</option>
                </select>
              </div>

              {/* View Grid/Table Mode */}
              <div className="flex rounded-full border border-ink/15 bg-card p-0.5">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "rounded-full p-1.5 transition-colors",
                    viewMode === "grid"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                  title="Grid View">
                  <LayoutGrid className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("table")}
                  className={cn(
                    "rounded-full p-1.5 transition-colors",
                    viewMode === "table"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                  title="Table / List View">
                  <List className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Category Tabs Strip */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-ink/8 pt-3">
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => {
                  setPrimaryFilter("all");
                  setSubgroupFilter("all");
                }}
                className={cn(
                  "rounded-full px-3 py-1.5 font-medium transition-all",
                  primaryFilter === "all"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-card text-muted-foreground hover:text-foreground border border-ink/10",
                )}>
                All ({counts.all})
              </button>
              <button
                type="button"
                onClick={() => {
                  setPrimaryFilter("throws");
                  setSubgroupFilter("all");
                }}
                className={cn(
                  "rounded-full px-3 py-1.5 font-medium transition-all",
                  primaryFilter === "throws"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-card text-muted-foreground hover:text-foreground border border-ink/10",
                )}>
                Throws / Tachi-waza ({counts.throws})
              </button>
              <button
                type="button"
                onClick={() => {
                  setPrimaryFilter("groundwork");
                  setSubgroupFilter("all");
                }}
                className={cn(
                  "rounded-full px-3 py-1.5 font-medium transition-all",
                  primaryFilter === "groundwork"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-card text-muted-foreground hover:text-foreground border border-ink/10",
                )}>
                Groundwork / Ne-waza ({counts.groundwork})
              </button>
              <button
                type="button"
                onClick={() => {
                  setPrimaryFilter("ukemi");
                  setSubgroupFilter("all");
                }}
                className={cn(
                  "rounded-full px-3 py-1.5 font-medium transition-all",
                  primaryFilter === "ukemi"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-card text-muted-foreground hover:text-foreground border border-ink/10",
                )}>
                Breakfalls / Ukemi ({counts.ukemi})
              </button>
            </div>

            {/* Toggle mobile advanced filters */}
            <button
              type="button"
              onClick={() => setMobileFiltersOpen((o) => !o)}
              className="inline-flex sm:hidden items-center gap-1.5 rounded-full border border-ink/15 bg-card px-3 py-1 text-xs text-muted-foreground">
              <Filter className="h-3 w-3" />
              <span>More Filters</span>
            </button>
          </div>

          {/* Sub-group and Advanced Facets (Belt, Gokyo, Shiai) */}
          <div
            className={cn(
              "space-y-2.5 pt-1",
              mobileFiltersOpen ? "block" : "hidden sm:block",
            )}>
            <div className="flex flex-wrap items-center gap-2">
              {/* Sub-group selector */}
              {availableSubgroups.length > 1 && (
                <div className="flex items-center gap-1 text-[11px] rounded-full border border-ink/12 bg-card p-1">
                  <span className="px-2 text-muted-foreground font-mono text-[9px] uppercase tracking-wider">
                    Group:
                  </span>
                  <select
                    value={subgroupFilter}
                    onChange={(e) => setSubgroupFilter(e.target.value)}
                    className="bg-transparent font-medium text-foreground outline-none cursor-pointer pr-2">
                    <option value="all">All Groups</option>
                    {availableSubgroups.map((group) => (
                      <option key={group} value={group}>
                        {SUBGROUP_LABELS[group].short}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Belt Grade Selector */}
              <div className="flex items-center gap-1 text-[11px] rounded-full border border-ink/12 bg-card p-1">
                <span className="px-2 text-muted-foreground font-mono text-[9px] uppercase tracking-wider">
                  Belt:
                </span>
                <select
                  value={beltFilter}
                  onChange={(e) => setBeltFilter(e.target.value)}
                  className="bg-transparent font-medium text-foreground outline-none cursor-pointer pr-2">
                  <option value="all">All Grades</option>
                  {BELTS.map((b) => (
                    <option key={b.rank} value={b.rank}>
                      {b.rank} Belt
                    </option>
                  ))}
                </select>
              </div>

              {/* Gokyo Group Selector (Only applicable for throws) */}
              {(primaryFilter === "all" || primaryFilter === "throws") && (
                <div className="flex items-center gap-1 text-[11px] rounded-full border border-ink/12 bg-card p-1">
                  <span className="px-2 text-muted-foreground font-mono text-[9px] uppercase tracking-wider">
                    Gokyo:
                  </span>
                  <select
                    value={gokyoFilter}
                    onChange={(e) => setGokyoFilter(e.target.value)}
                    className="bg-transparent font-medium text-foreground outline-none cursor-pointer pr-2">
                    <option value="all">All Gokyo Sets</option>
                    <option value="1">Dai Ikkyo (Group 1)</option>
                    <option value="2">Dai Nikyo (Group 2)</option>
                    <option value="3">Dai Sankyo (Group 3)</option>
                    <option value="4">Dai Yonkyo (Group 4)</option>
                    <option value="5">Dai Gokyo (Group 5)</option>
                  </select>
                </div>
              )}

              {/* Shiai Legality Filter */}
              <div className="flex items-center gap-1 text-[11px] rounded-full border border-ink/12 bg-card p-1">
                <span className="px-2 text-muted-foreground font-mono text-[9px] uppercase tracking-wider">
                  Contest Rule:
                </span>
                <select
                  value={shiaiFilter}
                  onChange={(e) => setShiaiFilter(e.target.value)}
                  className="bg-transparent font-medium text-foreground outline-none cursor-pointer pr-2">
                  <option value="all">All Techniques</option>
                  <option value="allowed">IJF Contest Legal</option>
                  <option value="banned_leg_grab">
                    Traditional / Kata Only
                  </option>
                </select>
              </div>

              {/* Reset Filters button if any active */}
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[11px] font-mono text-primary hover:bg-primary/20 transition-colors">
                  <RotateCcw className="h-3 w-3" />
                  <span>Reset Filters</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. TECHNIQUES RESULTS CONTAINER */}
      <section className="mx-auto max-w-6xl px-5 py-10 lg:px-8">
        {/* Results Count & Current Active Filters summary */}
        <div className="flex items-center justify-between border-b border-ink/8 pb-4 text-xs text-muted-foreground">
          <p>
            Showing{" "}
            <strong className="text-foreground font-mono">
              {filteredTechniques.length}
            </strong>{" "}
            of {techniques.length} techniques
          </p>

          <p className="hidden sm:block font-mono text-[11px]">
            Click any technique for biomechanical cues (Kuzushi, Tsukuri, Kake)
          </p>
        </div>

        {/* Empty State */}
        {filteredTechniques.length === 0 ? (
          <div className="my-16 flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink/15 p-12 text-center">
            <BookOpen className="h-10 w-10 text-muted-foreground/40" />
            <h3 className="mt-4 font-display text-lg font-semibold text-foreground">
              No techniques matched your filters
            </h3>
            <p className="mt-1 max-w-sm text-xs text-muted-foreground">
              Try broadening your search query or reset the filters to browse
              all 76 techniques in the syllabus.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground">
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        ) : viewMode === "grid" ? (
          /* GRID VIEW */
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTechniques.map((technique) => (
              <TechniqueCard
                key={technique.id}
                technique={technique}
                onSelect={(t) => handleSelectTechnique(t as EnrichedTechnique)}
                beltRank={technique.beltRank}
                beltColor={technique.beltColor}
                showBelt={true}
              />
            ))}
          </div>
        ) : (
          /* TABLE VIEW */
          <div className="mt-6 overflow-hidden rounded-xl border border-ink/12 bg-card shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-ink/10 bg-muted/40 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-5 py-3.5 font-medium">Technique</th>
                    <th className="px-5 py-3.5 font-medium">
                      Japanese / Kanji
                    </th>
                    <th className="px-5 py-3.5 font-medium">Sub-group</th>
                    <th className="px-5 py-3.5 font-medium">Belt Tested</th>
                    <th className="px-5 py-3.5 font-medium scale-0 absolute sm:scale-1 sm:relative">
                      Gokyo
                    </th>
                    <th className="px-5 py-3.5 font-medium scale-0 absolute sm:scale-1 sm:relative">
                      Primary Cue
                    </th>
                    <th className="px-5 py-3.5 font-medium text-right scale-0 absolute sm:scale-1 sm:relative">
                      Legality
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/8">
                  {filteredTechniques.map((technique) => (
                    <tr
                      key={technique.id}
                      onClick={() => handleSelectTechnique(technique)}
                      className="cursor-pointer hover:bg-muted/40 transition-colors">
                      <td className="px-5 py-3.5">
                        <p className="font-semibold text-foreground hover:text-primary transition-colors">
                          {technique.name}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {technique.translation}
                        </p>
                      </td>

                      <td className="px-5 py-3.5 font-mono text-sm text-muted-foreground/75">
                        {technique.kanji || "—"}
                      </td>

                      <td className="px-5 py-3.5">
                        <span className="rounded-full bg-secondary/80 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider font-medium text-secondary-foreground">
                          {technique.group}
                        </span>
                      </td>

                      <td className="px-5 py-3.5">
                        <div
                          className="inline-flex items-center"
                          title={`${technique.beltRank} Belt Syllabus`}
                          aria-label={`${technique.beltRank} Belt`}>
                          <BeltBar
                            rank={technique.beltRank}
                            color={technique.beltColor}
                            className="h-4 w-auto"
                          />
                        </div>
                      </td>

                      <td className="px-5 py-3.5 font-mono text-xs scale-0 absolute sm:scale-1 sm:relative">
                        {technique.gokyoGroup ? (
                          <span className="rounded border border-primary/30 px-1.5 py-0.5 text-primary text-[10px]">
                            Group {technique.gokyoGroup}
                          </span>
                        ) : (
                          <span className="text-muted-foreground/50">—</span>
                        )}
                      </td>

                      <td className="px-5 py-3.5 text-[11px] text-muted-foreground max-w-xs truncate scale-0 absolute sm:scale-1 sm:relative">
                        {technique.cues && technique.cues[0]
                          ? technique.cues[0]
                          : "—"}
                      </td>

                      <td className="px-5 py-3.5 text-right font-mono text-[10px] scale-0 absolute sm:scale-1 sm:relative">
                        {technique.shiaiStatus === "banned_leg_grab" ? (
                          <span className="rounded bg-destructive/10 px-2 py-0.5 text-destructive font-medium">
                            Traditional
                          </span>
                        ) : (
                          <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                            Legal
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* 4. TECHNIQUE SLIDE-OVER SHEET */}
      <TechniqueSheet
        technique={selectedTechnique}
        open={Boolean(selectedTechnique)}
        onOpenChange={(isOpen) => {
          if (!isOpen) handleSelectTechnique(null);
        }}
        beltRank={selectedTechnique?.beltRank}
        beltSlug={selectedTechnique?.beltSlug}
        beltColor={selectedTechnique?.beltColor}
      />
    </div>
  );
}
