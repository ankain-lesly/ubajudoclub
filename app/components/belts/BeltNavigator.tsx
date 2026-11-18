import { Link } from "react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { BeltSlug } from "@/lib/types/syllabus";
import { getBeltView } from "@/lib/data/syllabus";
import Reveal from "@/components/visual/Reveal";

interface BeltNavigatorProps {
  prevSlug?: BeltSlug;
  nextSlug?: BeltSlug;
}

export default function BeltNavigator({
  prevSlug,
  nextSlug,
}: BeltNavigatorProps) {
  const prevBelt = prevSlug ? getBeltView(prevSlug) : null;
  const nextBelt = nextSlug ? getBeltView(nextSlug) : null;

  if (!prevBelt && !nextBelt) return null;

  return (
    <section className="border-t border-ink/10 bg-secondary/30 py-12">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <Reveal>
          <div className="grid gap-6 sm:grid-cols-2">
            {prevBelt ? (
              <Link
                to={`/belts/${prevBelt.slug}`}
                className="group flex items-center gap-4 rounded-xl border border-ink/12 bg-card p-5 transition-all duration-300 hover:border-ink/30 hover:bg-card/90">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-secondary/60 text-foreground transition-transform group-hover:-translate-x-1">
                  <ArrowLeft className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                    Previous Grade
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <span
                      className="h-2 w-5 rounded-full"
                      style={{ backgroundColor: prevBelt.color }}
                    />
                    <span className="font-display text-base font-semibold text-foreground">
                      {prevBelt.rankName}
                    </span>
                  </div>
                </div>
              </Link>
            ) : (
              <div />
            )}

            {nextBelt && (
              <Link
                to={`/belts/${nextBelt.slug}`}
                className="group flex items-center justify-between gap-4 rounded-xl border border-ink/12 bg-card p-5 text-right transition-all duration-300 hover:border-ink/30 hover:bg-card/90 sm:col-start-2">
                <div className="text-left sm:text-right">
                  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                    Next Target Grade
                  </p>
                  <div className="mt-1 flex items-center gap-2 sm:justify-end">
                    <span className="font-display text-base font-semibold text-foreground">
                      {nextBelt.rankName}
                    </span>
                    <span
                      className="h-2 w-5 rounded-full"
                      style={{ backgroundColor: nextBelt.color }}
                    />
                  </div>
                </div>
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-secondary/60 text-foreground transition-transform group-hover:translate-x-1">
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
