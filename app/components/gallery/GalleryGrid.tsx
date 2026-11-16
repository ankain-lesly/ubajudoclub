import { Image } from "@/components/ui/image";
import type { GalleryItem } from "@/lib/types";

interface GalleryGridProps {
  items: GalleryItem[];
  onOpen: (index: number) => void;
}

const heights = ["h-[300px]", "h-[380px]", "h-[260px]", "h-[340px]"];

const GalleryGrid = ({ items, onOpen }: GalleryGridProps) => (
  <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
    {items.map((item, index) => (
      <figure
        key={`${item.caption}-${index}`}
        className="mb-4 break-inside-avoid">
        <button
          type="button"
          onClick={() => onOpen(index)}
          className="group relative block w-full overflow-hidden rounded-lg border border-ink/12 bg-ink/10"
          aria-label={`Open ${item.caption}`}>
          <Image
            src={item.src}
            alt={item.alt}
            className={`${heights[index % heights.length]} w-full transition-transform duration-700 group-hover:scale-[1.05]`}
            fittingType="fill"
          />
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-band/85 via-band/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-3 p-4 text-left opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            <span className="block font-mono text-[8px] uppercase tracking-[0.18em] text-band-foreground/60">
              {item.category} · {item.year}
            </span>
            <span className="mt-1.5 block text-[13px] leading-snug text-band-foreground">
              {item.caption}
            </span>
          </span>
        </button>
      </figure>
    ))}
  </div>
);

export default GalleryGrid;
