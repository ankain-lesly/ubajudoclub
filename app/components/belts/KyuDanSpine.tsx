import { Link } from "react-router";
import { motion } from "framer-motion";
import type { BeltSlug } from "@/lib/types/syllabus";
import { ORDERED_SLUGS } from "@/lib/data/syllabus";
import { BELTS } from "@/lib/data/club";

interface KyuDanSpineProps {
  currentSlug: BeltSlug;
}

export default function KyuDanSpine({ currentSlug }: KyuDanSpineProps) {
  const currentIdx = ORDERED_SLUGS.indexOf(currentSlug);
  const totalSteps = ORDERED_SLUGS.length;
  const progressRatio = currentIdx / (totalSteps - 1);

  return (
    <div className="relative w-full py-4">
      {/* Visual Vector Pathway Container */}
      <div className="relative flex items-center justify-between">
        {/* Background Track Line */}
        <div className="absolute left-3 right-3 top-1/2 h-0.5 -translate-y-1/2 bg-ink/15 dark:bg-paper/15" />

        {/* Animated Active Progress Line */}
        <motion.div
          className="absolute left-3 top-1/2 h-0.5 -translate-y-1/2 bg-primary origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: progressRatio }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ width: "calc(100% - 24px)" }}
        />

        {/* 7 Kyu-to-Dan Nodes */}
        {ORDERED_SLUGS.map((slug, i) => {
          const beltInfo = BELTS[i];
          const isCurrent = slug === currentSlug;
          const isPassed = i < currentIdx;

          return (
            <Link
              key={slug}
              to={`/belts/${slug}`}
              className="group relative z-10 flex flex-col items-center focus:outline-none"
              title={`${beltInfo.rank} (${beltInfo.kyu})`}>
              {/* Outer Pulsing Ring on Current */}
              <div className="relative flex h-8 w-8 items-center justify-center">
                {isCurrent && (
                  <motion.span
                    layoutId="current-spine-ring"
                    className="absolute inset-0 rounded-full border-2 border-primary"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1.25, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                )}

                {/* Node Dot / Belt Color Pip */}
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full border transition-all duration-300 ${
                    isCurrent
                      ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-110 shadow-md"
                      : isPassed
                      ? "border-primary/50 opacity-90 hover:scale-105"
                      : "border-ink/20 opacity-60 hover:opacity-100 hover:scale-105"
                  }`}
                  style={{ backgroundColor: beltInfo.color }}>
                  {isCurrent && (
                    <span className="h-1.5 w-1.5 rounded-full bg-ink dark:bg-paper" />
                  )}
                </div>
              </div>

              {/* Belt Rank Label */}
              <span
                className={`mt-1 font-mono text-[9px] uppercase tracking-[0.16em] transition-colors ${
                  isCurrent
                    ? "font-bold text-primary"
                    : isPassed
                    ? "text-foreground/80 font-medium"
                    : "text-muted-foreground/60 group-hover:text-foreground"
                }`}>
                {beltInfo.rank}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
