import { useState, useMemo } from "react";
import { Link } from "react-router";
import { ArrowRight, Film, Image as ImageIcon } from "lucide-react";
import { getPublicGalleryItems } from "@/lib/server/public";
import GalleryGrid from "@/components/gallery/GalleryGrid";
import Lightbox from "@/components/gallery/LightBox";
import Aura from "@/components/visual/Aura";
import RingField from "@/components/visual/RingField";
import SectionBackdrop from "@/components/visual/SectionBackdrop";
import HeroBackdrop from "@/components/visual/HeroBackdrop";
import heroJudoAction from "@/assets/images/1ea126a4b_generated_image.avif";
import { env } from "@/lib/env";
import { cn } from "@/lib/utils";
import type { Route } from "./+types/gallery";

export async function loader({ request }: Route.LoaderArgs) {
  const items = await getPublicGalleryItems(request);
  return { items };
}

export function meta({ loaderData }: Route.MetaArgs): Route.MetaDescriptors {
  const items = loaderData?.items || [];
  const firstPhoto = items.find((i) => i.mediaType !== "VIDEO") || items[0];
  const ogImageUrl = firstPhoto?.src || `${env.siteUrl}/images/ubajudo-banner.jpg`;
  const description =
    "Explore photography, mat captures, and training videos from UBa Judo Club at UBa Campus Amphi 100.";

  return [
    { title: "Mat Gallery & Visual Archive | UBa Judo Club" },
    { name: "description", content: description },
    { property: "og:site_name", content: "UBa Judo Club" },
    { property: "og:title", content: "Mat Gallery & Visual Archive | UBa Judo Club" },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:image", content: ogImageUrl },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Mat Gallery & Visual Archive | UBa Judo Club" },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: ogImageUrl },
  ];
}

const Gallery = ({ loaderData }: Route.ComponentProps) => {
  const { items } = loaderData;
  const [filter, setFilter] = useState<string>("All");
  const [open, setOpen] = useState<number | null>(null);

  // Derive unique filter categories from persisted items
  const filterOptions = useMemo(() => {
    const categories = new Set<string>();
    let hasVideos = false;
    let hasPhotos = false;

    items.forEach((item) => {
      if (item.mediaType === "VIDEO") {
        hasVideos = true;
      } else {
        hasPhotos = true;
      }
      if (item.category && item.category !== "Videos" && item.category !== "Photos") {
        categories.add(item.category);
      }
    });

    const list = ["All"];
    if (hasPhotos) list.push("Photos");
    if (hasVideos) list.push("Videos");
    categories.forEach((c) => list.push(c));
    return list;
  }, [items]);

  const filteredItems = useMemo(() => {
    if (filter === "All") return items;
    if (filter === "Photos") return items.filter((i) => i.mediaType !== "VIDEO");
    if (filter === "Videos") return items.filter((i) => i.mediaType === "VIDEO");
    return items.filter((i) => i.category === filter);
  }, [items, filter]);

  const step = (delta: number) =>
    setOpen((current) =>
      current === null
        ? current
        : (current + delta + filteredItems.length) % filteredItems.length,
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
            Gallery · {items.length} {items.length === 1 ? "frame" : "frames"}
          </p>
          <h1 className="mt-7 max-w-2xl font-display text-[clamp(2.4rem,5.4vw,4rem)] font-semibold leading-[0.94] tracking-[-0.035em] text-balance">
            The mat, in pictures.
          </h1>
          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
            Grip work, grading days, the walk to the hall at dusk. Photographs
            and video captures from members and coaches on the tatami.
          </p>
        </div>
      </section>

      <section className="relative overflow-hidden">
        <SectionBackdrop variant="weave" className="opacity-70" />
        <div className="relative mx-auto max-w-6xl px-5 py-12 lg:px-8 lg:py-16">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {filterOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setFilter(option);
                    setOpen(null);
                  }}
                  className={cn(
                    "rounded-full border px-4 py-2 font-mono text-[9px] uppercase tracking-[0.14em] transition-colors cursor-pointer",
                    filter === option
                      ? "border-ink bg-ink text-paper"
                      : "border-ink/15 text-muted-foreground hover:border-ink/35 hover:text-foreground",
                  )}>
                  {option}
                </button>
              ))}
            </div>
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
              {filteredItems.length} {filteredItems.length === 1 ? "capture" : "captures"}
            </p>
          </div>

          <div className="mt-9">
            <GalleryGrid items={filteredItems} onOpen={setOpen} />
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
          items={filteredItems}
          index={open}
          onClose={() => setOpen(null)}
          onStep={step}
        />
      )}
    </>
  );
};

export default Gallery;
