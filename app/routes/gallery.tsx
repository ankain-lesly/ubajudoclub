import { useState } from "react";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { GALLERY, GALLERY_FILTERS } from "@/lib/data/gallery";
import GalleryGrid from "@/components/gallery/GalleryGrid";
import Lightbox from "@/components/gallery/LightBox";
import Aura from "@/components/visual/Aura";
import RingField from "@/components/visual/RingField";
import SectionBackdrop from "@/components/visual/SectionBackdrop";
import HeroBackdrop from "@/components/visual/HeroBackdrop";
import heroJudoAction from "@/assets/images/1ea126a4b_generated_image.avif";
import { cn } from "@/lib/utils";

const Gallery = () => {
  const [filter, setFilter] = useState<string>("All");
  const [open, setOpen] = useState<number | null>(null);

  const items =
    filter === "All"
      ? GALLERY
      : GALLERY.filter((item) => item.category === filter);

  const step = (delta: number) =>
    setOpen((current) =>
      current === null
        ? current
        : (current + delta + items.length) % items.length,
    );

  return (
    <>
      <section className="relative overflow-hidden border-b border-ink/10">
        <HeroBackdrop src={heroJudoAction} imageClassName="object-[center_35%]" opacityClassName="opacity-55 dark:opacity-65" />
        <Aura grid={false} />
        <div className="pointer-events-none absolute -right-44 -top-32 hidden h-[540px] w-[540px] opacity-70 lg:block">
          <RingField />
        </div>

        <div className="relative mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-24">
          <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.32em] text-primary">
            <span className="h-px w-8 bg-primary" />
            Gallery · {GALLERY.length} frames
          </p>
          <h1 className="mt-7 max-w-2xl font-display text-[clamp(2.4rem,5.4vw,4rem)] font-semibold leading-[0.94] tracking-[-0.035em] text-balance">
            The mat, in pictures.
          </h1>
          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
            Grip work, grading days, the walk to the hall at dusk. Photographs
            from members and coaches, gathered across the seasons.
          </p>
        </div>
      </section>

      <section className="relative overflow-hidden">
        <SectionBackdrop variant="weave" className="opacity-70" />
        <div className="relative mx-auto max-w-6xl px-5 py-12 lg:px-8 lg:py-16">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {GALLERY_FILTERS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setFilter(option);
                    setOpen(null);
                  }}
                  className={cn(
                    "rounded-full border px-4 py-2 font-mono text-[9px] uppercase tracking-[0.14em] transition-colors",
                    filter === option
                      ? "border-ink bg-ink text-paper"
                      : "border-ink/15 text-muted-foreground hover:border-ink/35 hover:text-foreground",
                  )}>
                  {option}
                </button>
              ))}
            </div>
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
              {items.length} image{items.length === 1 ? "" : "s"}
            </p>
          </div>

          <div className="mt-9">
            <GalleryGrid items={items} onOpen={setOpen} />
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-between gap-6 rounded-lg border border-ink/12 bg-card px-7 py-8">
            <div>
              <p className="font-display text-xl font-semibold tracking-[-0.02em]">
                Most of these start on a Monday.
              </p>
              <p className="mt-2 text-[13px] text-muted-foreground">
                Come and stand in one of these frames.
              </p>
            </div>
            <Link
              to="/join"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground">
              Join a session
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {open !== null && (
        <Lightbox
          items={items}
          index={open}
          onClose={() => setOpen(null)}
          onStep={step}
        />
      )}
    </>
  );
};

export default Gallery;
