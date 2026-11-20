import { Link } from "react-router";
import { motion } from "framer-motion";
import type { BeltSlug } from "@/lib/types/syllabus";
import { ORDERED_SLUGS } from "@/lib/data/syllabus";
import { BELTS } from "@/lib/data/club";
import BeltBar from "@/components/visual/BeltBar";
import { cn } from "@/lib/utils";

interface KyuDanSpineProps {
  currentSlug: BeltSlug;
  className?: string;
}

/**
 * Cleanly Compact Kyu-to-Dan Belt Progression Spine
 * Uses the authentic tied BeltBar design across all 7 grades in a sleek,
 * minimal horizontal progression rack.
 */
export default function KyuDanSpine({ currentSlug, className }: KyuDanSpineProps) {
  const currentIdx = ORDERED_SLUGS.indexOf(currentSlug);

  return (
    <nav
      aria-label="Kyu to Dan belt progression"
      className={cn("w-full", className)}
    >
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {ORDERED_SLUGS.map((slug, i) => {
          const belt = BELTS[i];
          const isCurrent = slug === currentSlug;
          const isPassed = i < currentIdx;

          return (
            <Link
              key={slug}
              to={`/belts/${slug}`}
              className={cn(
                "group relative flex flex-col items-center justify-between rounded-lg py-1.5 px-0.5 sm:px-1 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                isCurrent
                  ? "bg-secondary/70 shadow-xs"
                  : "hover:bg-secondary/35 opacity-70 hover:opacity-100",
              )}
              title={`${belt.rank} Belt (${belt.kyu})`}
            >
              {/* Authentic Mini Belt (Tied Obi Design) */}
              <div className="flex h-6 sm:h-7 items-center justify-center">
                <BeltBar
                  rank={belt.rank}
                  className={cn(
                    "transition-transform duration-200",
                    isCurrent
                      ? "h-4.5 sm:h-5.5 scale-110 drop-shadow-sm"
                      : "h-3.5 sm:h-4.5 group-hover:scale-105",
                  )}
                />
              </div>

              {/* Minimal Rank Label */}
              <span
                className={cn(
                  "mt-1 font-mono text-[9px] sm:text-[10px] tracking-tight uppercase transition-colors truncate max-w-full",
                  isCurrent
                    ? "font-bold text-primary"
                    : isPassed
                    ? "text-foreground/80 font-medium"
                    : "text-muted-foreground group-hover:text-foreground",
                )}
              >
                {belt.rank}
              </span>

              {/* Active Indicator Underline */}
              <div className="h-1 w-full flex items-center justify-center mt-0.5">
                {isCurrent ? (
                  <motion.div
                    layoutId="active-spine-pill"
                    className="h-0.5 w-4 sm:w-6 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 450, damping: 32 }}
                  />
                ) : (
                  <div className="h-0.5 w-1 rounded-full bg-transparent group-hover:bg-ink/15 dark:group-hover:bg-paper/15" />
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
