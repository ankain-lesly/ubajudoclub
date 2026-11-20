import { useMemo, useState } from "react";
import {
  Search,
  Users,
  GraduationCap,
} from "lucide-react";
import { getPublicMembers } from "@/lib/server/public";
import { BELTS, beltFor } from "@/lib/data/club";
import type { Rank } from "@/lib/types";
import Aura from "@/components/visual/Aura";
import RingField from "@/components/visual/RingField";
import Reveal from "@/components/visual/Reveal";
import SectionBackdrop from "@/components/visual/SectionBackdrop";
import BeltBar from "@/components/visual/BeltBar";
import HeroBackdrop from "@/components/visual/HeroBackdrop";
import heroBeltDiscipline from "@/assets/images/hero-belt-discipline.jpg";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Route } from "./+types/members";

export function meta(): Route.MetaDescriptors {
  const description =
    "Search registered university judoka, active kyu grades, and black belts at UBa Judo Club.";

  return [
    { title: "Club Members Directory — UBa Judo Club" },
    { name: "description", content: description },
    { property: "og:site_name", content: "UBa Judo Club" },
    { property: "og:title", content: "Club Members Directory — UBa Judo Club" },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Club Members Directory — UBa Judo Club" },
    { name: "twitter:description", content: description },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const members = await getPublicMembers(request);
  return { members };
}

const Members = ({ loaderData }: Route.ComponentProps) => {
  const { members } = loaderData;
  const [search, setSearch] = useState("");
  const [selectedRank, setSelectedRank] = useState<Rank | "All">("All");

  const filteredMembers = useMemo(() => {
    let result = members;

    if (selectedRank !== "All") {
      result = result.filter((m) => m.belt_rank === selectedRank);
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (m) =>
          m.full_name.toLowerCase().includes(q) ||
          (m.matricule && m.matricule.toLowerCase().includes(q)) ||
          (m.program && m.program.toLowerCase().includes(q)),
      );
    }

    return result;
  }, [members, search, selectedRank]);

  // Aggregate stats
  const totalSessions = useMemo(
    () => members.reduce((sum, m) => sum + (m.sessions_total || 0), 0),
    [members],
  );

  const blackBelts = useMemo(
    () => members.filter((m) => m.belt_rank === "Black").length,
    [members],
  );

  return (
    <>
      {/* Header Banner */}
      <section className="relative overflow-hidden border-b border-ink/10">
        <HeroBackdrop src={heroBeltDiscipline} imageClassName="object-[center_35%]" opacityClassName="opacity-50 dark:opacity-60" />
        <Aura grid={false} />
        <div className="pointer-events-none absolute -right-36 -top-28 hidden h-[480px] w-[480px] opacity-70 lg:block">
          <RingField />
        </div>

        <div className="relative mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-24">
          <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.32em] text-primary">
            <span className="h-px w-8 bg-primary" />
            Club Registry & Judoka
          </p>
          <h1 className="mt-7 max-w-2xl font-display text-[clamp(2.4rem,5.4vw,4rem)] font-semibold leading-[0.94] tracking-[-0.035em] text-balance">
            Athletes of the Bambili mat.
          </h1>
          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
            Search our registered university students, senior ranks, and alumni.
            Every session attended is logged towards their next Kyu and Dan promotion.
          </p>

          {/* Quick Metrics */}
          <div className="mt-10 flex flex-wrap items-center gap-6 border-t border-ink/10 pt-8 sm:gap-12">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                Registered Athletes
              </p>
              <p className="mt-1 font-display text-2xl font-semibold tracking-tight">
                {members.length}
              </p>
            </div>
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                Total Mat Hours
              </p>
              <p className="mt-1 font-display text-2xl font-semibold tracking-tight">
                {totalSessions * 1.5} hrs
              </p>
            </div>
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                Black Belts (Yudansha)
              </p>
              <p className="mt-1 font-display text-2xl font-semibold tracking-tight">
                {blackBelts}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filter Controls */}
      <section className="mx-auto max-w-6xl px-5 py-10 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          {/* Live Search Input */}
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name, matricule, program..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 rounded-full border-ink/15 bg-card pl-10 pr-4 text-sm focus-visible:border-primary focus-visible:ring-primary/20"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 font-mono text-[10px] text-muted-foreground hover:text-foreground"
              >
                Clear
              </button>
            )}
          </div>

          {/* Belt Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              type="button"
              onClick={() => setSelectedRank("All")}
              className={cn(
                "rounded-full px-3.5 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.14em] transition-all",
                selectedRank === "All"
                  ? "bg-ink text-paper shadow-sm"
                  : "border border-ink/12 text-muted-foreground hover:border-ink/30 hover:text-foreground",
              )}
            >
              All Belts
            </button>
            {BELTS.map((b) => (
              <button
                key={b.rank}
                type="button"
                onClick={() => setSelectedRank(b.rank)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.14em] transition-all",
                  selectedRank === b.rank
                    ? "bg-ink text-paper shadow-sm"
                    : "border border-ink/12 text-muted-foreground hover:border-ink/30 hover:text-foreground",
                )}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: b.color }}
                />
                {b.rank}
              </button>
            ))}
          </div>
        </div>

        {/* Member Directory Grid */}
        <div className="mt-8">
          <div className="flex items-center justify-between pb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            <span>Athlete List</span>
            <span>{filteredMembers.length} judoka found</span>
          </div>

          {filteredMembers.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredMembers.map((member) => {
                const beltInfo = beltFor(member.belt_rank);

                return (
                  <div
                    key={member.id}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-ink/12 bg-card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-ink/30 hover:shadow-md"
                  >
                    <div>
                      {/* Top Rank Badge */}
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 rounded-full border border-ink/10 bg-secondary/60 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em]">
                          <BeltBar rank={member.belt_rank} className="h-3.5 w-auto" />
                          {member.belt_rank} Belt
                        </span>

                        {member.matricule && (
                          <span className="font-mono text-[10px] text-muted-foreground/75">
                            {member.matricule}
                          </span>
                        )}
                      </div>

                      {/* Name */}
                      <h3 className="mt-4 font-display text-lg font-semibold leading-tight tracking-[-0.015em] transition-colors group-hover:text-primary">
                        {member.full_name}
                      </h3>

                      {/* University Faculty / Program */}
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <GraduationCap className="h-3.5 w-3.5 text-primary/70 shrink-0" />
                        <span className="truncate">{member.program || "Student"}</span>
                      </p>
                    </div>

                    {/* Footer Info */}
                    <div className="mt-6 border-t border-ink/8 pt-3.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono text-[10.5px] text-muted-foreground">
                          Mat Check-ins
                        </span>
                        <span className="font-mono text-[11px] font-semibold tabular-nums text-foreground">
                          {member.sessions_total || 0} sessions
                        </span>
                      </div>

                      {member.last_attended && (
                        <div className="mt-1 flex items-center justify-between font-mono text-[9.5px] text-muted-foreground/70">
                          <span>Last trained</span>
                          <span>{member.last_attended}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-ink/15 p-12 text-center">
              <Users className="mx-auto h-8 w-8 text-muted-foreground/50" />
              <p className="mt-3 font-display text-base font-semibold">
                No judoka matching &ldquo;{search}&rdquo;
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Try searching with another name, faculty, or selecting &ldquo;All Belts&rdquo;.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSelectedRank("All");
                }}
                className="mt-4 rounded-full bg-ink px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-paper"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Members;
