import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router";
import {
  Search,
  X,
  Layers,
  Award,
  BookOpen,
  Calendar,
  CalendarDays,
  Users,
  Camera,
  ArrowUpRight,
  Clock,
  Sparkles,
  ArrowRight,
  CornerDownLeft,
} from "lucide-react";
import { useSearchStore, type SearchCategory } from "@/lib/stores/search.store";
import {
  getAllTechniques,
  ORDERED_SLUGS,
  type EnrichedTechnique,
} from "@/lib/data/syllabus";
import { BELTS } from "@/lib/data/club";
import BeltBar from "@/components/visual/BeltBar";
import { cn } from "@/lib/utils";

interface SearchResultItem {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  to: string;
  category: "techniques" | "belts" | "pages";
  badge?: string;
  badgeColor?: string;
  rank?: string;
  icon?: typeof Search;
  japanese?: string;
}

const PAGE_ITEMS: SearchResultItem[] = [
  {
    id: "page-schedule",
    title: "Training Schedule",
    subtitle: "Weekly Sessions & Times",
    description:
      "Monday morning start at 8:00 AM, evening and weekend mat times",
    to: "/schedule",
    category: "pages",
    badge: "Timetable",
    icon: Clock,
  },
  {
    id: "page-techniques",
    title: "Techniques & Gokyo Archive",
    subtitle: "76 Kodokan Throws & Holds",
    description:
      "Explore throws (Tachi-waza), groundwork (Ne-waza), and breakfalls (Ukemi)",
    to: "/techniques",
    category: "pages",
    badge: "Curriculum",
    icon: BookOpen,
  },
  {
    id: "page-belts",
    title: "Belts & Kyu–Dan Pathway",
    subtitle: "7 Grades · White to Black",
    description:
      "Seven belts, session attendance targets, and technical promotion criteria",
    to: "/belts",
    category: "pages",
    badge: "Grading",
    icon: Award,
  },
  {
    id: "page-sessions",
    title: "Mat Sessions & Logbook",
    subtitle: "Public Attendance Records",
    description:
      "Every session recorded with syllabus focus and athlete turnout",
    to: "/sessions",
    category: "pages",
    badge: "Records",
    icon: Calendar,
  },
  {
    id: "page-events",
    title: "Club Events & Year",
    subtitle: "Upcoming Tournaments & Camps",
    description:
      "Passage de grade exams, varsity tournaments, and training seminars",
    to: "/events",
    category: "pages",
    badge: "Events",
    icon: Sparkles,
  },
  {
    id: "page-calendar",
    title: "Calendar & Schedule Matrix",
    subtitle: "Interactive Month View",
    description:
      "Full monthly view of dojo training sessions and club fixtures",
    to: "/calendar",
    category: "pages",
    badge: "Calendar",
    icon: CalendarDays,
  },
  {
    id: "page-members",
    title: "Club Members Directory",
    subtitle: "Registered Judoka",
    description: "Search university judoka, active kyu grades, and black belts",
    to: "/members",
    category: "pages",
    badge: "Registry",
    icon: Users,
  },
  {
    id: "page-gallery",
    title: "Photo & Mat Gallery",
    subtitle: "Amphi 100 Captures",
    description:
      "Cinematic frames and visual captures from training and competitions",
    to: "/gallery",
    category: "pages",
    badge: "Media",
    icon: Camera,
  },
  {
    id: "page-join",
    title: "Join the Mat",
    subtitle: "Beginner & Student Admissions",
    description:
      "Register your interest, membership details, and dojo orientation",
    to: "/join",
    category: "pages",
    badge: "Admissions",
    icon: ArrowUpRight,
  },
];

export default function SpotlightSearch() {
  const { isOpen, closeSearch, query, setQuery, category, setCategory } =
    useSearchStore();
  const navigate = useNavigate();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Load all techniques once
  const techniques = useMemo(() => {
    try {
      return getAllTechniques();
    } catch {
      return [];
    }
  }, []);

  // Belt Items mapped with authentic mini BeltBar info
  const beltItems = useMemo<SearchResultItem[]>(() => {
    return ORDERED_SLUGS.map((slug, i) => {
      const belt = BELTS[i];
      return {
        id: `belt-${slug}`,
        title: `${belt.rank} Belt`,
        subtitle: belt.kyu,
        description: `Target: ${belt.sessions} sessions. Focus: ${belt.focus}`,
        to: `/belts/${slug}`,
        category: "belts",
        badge: `${belt.sessions} Sessions`,
        badgeColor: belt.color,
        rank: belt.rank,
      };
    });
  }, []);

  // Technique Items mapped with Gokyo and belt data
  const techniqueItems = useMemo<SearchResultItem[]>(() => {
    return techniques.map((t: EnrichedTechnique) => ({
      id: `tech-${t.id}`,
      title: t.name,
      subtitle: `${t.kanji || ""} · ${t.group || t.primaryCategory}`,
      description: t.translation || `${t.beltRank} Belt requirement`,
      to: `/techniques?tech=${t.id}`,
      category: "techniques",
      badge: `${t.beltRank} Belt`,
      badgeColor: t.beltColor,
      rank: t.beltRank,
      japanese: t.kanji,
    }));
  }, [techniques]);

  // Combined and filtered search results
  const filteredResults = useMemo(() => {
    const q = query.trim().toLowerCase();

    const matchesQuery = (item: SearchResultItem) => {
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
        item.description.toLowerCase().includes(q) ||
        (item.japanese && item.japanese.includes(q)) ||
        (item.rank && item.rank.toLowerCase().includes(q))
      );
    };

    let items: SearchResultItem[] = [];

    if (category === "all" || category === "pages") {
      items = items.concat(PAGE_ITEMS.filter(matchesQuery));
    }
    if (category === "all" || category === "belts") {
      items = items.concat(beltItems.filter(matchesQuery));
    }
    if (category === "all" || category === "techniques") {
      items = items.concat(techniqueItems.filter(matchesQuery));
    }

    // Sort: exact matches first, then starts-with, then general
    if (q) {
      items.sort((a, b) => {
        const aTitle = a.title.toLowerCase();
        const bTitle = b.title.toLowerCase();
        if (aTitle === q) return -1;
        if (bTitle === q) return 1;
        if (aTitle.startsWith(q) && !bTitle.startsWith(q)) return -1;
        if (!aTitle.startsWith(q) && bTitle.startsWith(q)) return 1;
        return 0;
      });
    }

    return items;
  }, [query, category, beltItems, techniqueItems]);

  // Reset selected index when query or category changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query, category]);

  // Global Keyboard listener for opening with Cmd+K, Ctrl+K or /
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        useSearchStore.getState().toggleSearch();
        return;
      }

      // Quick slash "/" when not focused on an input or textarea
      if (
        e.key === "/" &&
        !["INPUT", "TEXTAREA", "SELECT"].includes(
          (document.activeElement?.tagName || "").toUpperCase(),
        )
      ) {
        e.preventDefault();
        useSearchStore.getState().openSearch();
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle keyboard navigation within the search dialog
  const handleDialogKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      closeSearch();
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        filteredResults.length === 0 ? 0 : (prev + 1) % filteredResults.length,
      );
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        filteredResults.length === 0
          ? 0
          : (prev - 1 + filteredResults.length) % filteredResults.length,
      );
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      const selected = filteredResults[selectedIndex];
      if (selected) {
        closeSearch();
        navigate(selected.to);
      }
    }
  };

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.children[selectedIndex] as
        | HTMLElement
        | undefined;
      if (activeEl) {
        activeEl.scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Spotlight Search & Quick Navigation"
      className="fixed inset-0 z-70 flex items-start justify-center p-3 sm:p-6 md:p-12 overflow-y-auto pt-20"
      onKeyDown={handleDialogKeyDown}>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-md transition-opacity animate-fade-in"
        onClick={closeSearch}
        aria-hidden="true"
      />

      <button
        type="button"
        onClick={closeSearch}
        className="absolute right-5 top-5 text-muted-foreground hover:text-foreground">
        <X className="h-6 w-6" />
      </button>

      {/* Search Modal Panel */}
      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-ink/15 bg-card/95 shadow-2xl backdrop-blur-xl animate-scale-in">
        {/* Search Input Bar */}
        <div className="relative flex items-center border-b border-ink/10 px-4 py-3.5">
          <Search className="h-5 w-5 shrink-0 text-muted-foreground mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Gokyo throws, belts, sessions, events, or pages..."
            className="w-full bg-transparent text-[15px] font-medium text-foreground placeholder:text-muted-foreground focus:outline-none"
            aria-autocomplete="list"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="grid h-6 w-6 place-items-center rounded-full text-muted-foreground hover:bg-ink/5 hover:text-foreground">
              <X className="h-3.5 w-3.5" />
            </button>
          ) : (
            <span className="hidden sm:inline-flex items-center gap-1 rounded-md border border-ink/15 bg-secondary/50 px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
              ESC
            </span>
          )}
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 border-b border-ink/8 px-4 py-2 bg-secondary/20 overflow-x-auto no-scrollbar">
          {(
            [
              { id: "all", label: "All" },
              { id: "techniques", label: "Techniques" },
              { id: "belts", label: "Belts & Grades" },
              { id: "pages", label: "Club Pages" },
            ] as const
          ).map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategory(cat.id)}
              className={cn(
                "rounded-full px-3 py-1 font-mono text-[11px] font-medium transition-colors shrink-0",
                category === cat.id
                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:bg-ink/5 hover:text-foreground",
              )}>
              {cat.label}
            </button>
          ))}
          <span className="ml-auto hidden text-[11px] font-mono text-muted-foreground sm:inline">
            {filteredResults.length}{" "}
            {filteredResults.length === 1 ? "result" : "results"}
          </span>
        </div>

        {/* Results List */}
        <div
          ref={listRef}
          className="max-h-[380px] overflow-y-auto p-2 divide-y divide-ink/5 focus:outline-none"
          role="listbox">
          {filteredResults.length > 0 ? (
            filteredResults.map((item, index) => {
              const isSelected = index === selectedIndex;
              const IconComponent = item.icon || Layers;

              return (
                <div
                  key={item.id}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    closeSearch();
                    navigate(item.to);
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={cn(
                    "group flex cursor-pointer items-center justify-between gap-3 rounded-xl p-3 transition-colors",
                    isSelected
                      ? "bg-secondary/70 shadow-xs"
                      : "hover:bg-secondary/40",
                  )}>
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Item Icon / Mini Belt Preview */}
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-ink/10 bg-background/80">
                      {item.category === "belts" && item.rank ? (
                        <BeltBar rank={item.rank} className="h-4 w-auto" />
                      ) : (
                        <IconComponent className="h-4 w-4 text-primary" />
                      )}
                    </div>

                    {/* Titles & Descriptions */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "truncate text-[13px] font-semibold leading-tight",
                            isSelected ? "text-primary" : "text-foreground",
                          )}>
                          {item.title}
                        </span>
                        {item.subtitle && (
                          <span className="hidden truncate font-mono text-[11px] text-muted-foreground sm:inline">
                            · {item.subtitle}
                          </span>
                        )}
                      </div>
                      <p className="truncate text-[12px] text-muted-foreground mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Badge & Arrow */}
                  <div className="flex items-center gap-2 shrink-0">
                    {item.badge && (
                      <span
                        className="rounded-full px-2 py-0.5 font-mono text-[10px] font-medium border"
                        style={{
                          borderColor: item.badgeColor
                            ? `${item.badgeColor}40`
                            : undefined,
                          color: item.badgeColor ? item.badgeColor : undefined,
                        }}>
                        {item.badge}
                      </span>
                    )}
                    <ArrowRight
                      className={cn(
                        "h-3.5 w-3.5 transition-transform",
                        isSelected
                          ? "translate-x-0.5 text-primary opacity-100"
                          : "opacity-0 group-hover:opacity-60",
                      )}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center">
              <Search className="mx-auto h-8 w-8 text-muted-foreground/40" />
              <p className="mt-3 font-display text-[15px] font-medium text-foreground">
                No results found for “{query}”
              </p>
              <p className="mt-1 text-[13px] text-muted-foreground">
                Try searching for a Gokyo throw like “Seoi”, a belt like
                “Yellow”, or “Schedule”.
              </p>
            </div>
          )}
        </div>

        {/* Footer Navigation Hints */}
        <div className="flex items-center justify-between border-t border-ink/8 bg-secondary/30 px-4 py-2 text-[11px] font-mono text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1">
              <kbd className="rounded bg-background px-1.5 py-0.5 border border-ink/15 text-[10px]">
                ↑
              </kbd>
              <kbd className="rounded bg-background px-1.5 py-0.5 border border-ink/15 text-[10px]">
                ↓
              </kbd>
              <span>to navigate</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <kbd className="rounded bg-background px-1.5 py-0.5 border border-ink/15 text-[10px] inline-flex items-center gap-0.5">
                <CornerDownLeft className="h-2.5 w-2.5" />
              </kbd>
              <span>to select</span>
            </span>
          </div>

          <span className="hidden sm:inline">UBa Judo Club Search</span>
        </div>
      </div>
    </div>
  );
}
