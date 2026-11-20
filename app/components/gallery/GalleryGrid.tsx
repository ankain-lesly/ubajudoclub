import { Play } from "lucide-react";
import { Image } from "@/components/ui/image";
import type { GalleryItem } from "@/lib/types";

interface GalleryGridProps {
  items: GalleryItem[];
  onOpen: (index: number) => void;
}

const heights = [
  "h-[200px] sm:h-[280px] lg:h-[300px]",
  "h-[260px] sm:h-[340px] lg:h-[360px]",
  "h-[180px] sm:h-[240px] lg:h-[260px]",
  "h-[230px] sm:h-[310px] lg:h-[330px]",
];

const GalleryGrid = ({ items, onOpen }: GalleryGridProps) => (
  <div className="columns-2 gap-3 sm:gap-4 md:columns-3 lg:columns-4">
    {items.map((item, index) => {
      const isVideo = item.mediaType === "VIDEO" || item.src.endsWith(".mp4") || item.src.endsWith(".mov");
      const previewSrc = item.thumbnailUrl || item.src;

      return (
        <figure
          key={item.id ? `${item.id}-${index}` : `${item.caption}-${index}`}
          className="mb-4 break-inside-avoid">
          <button
            type="button"
            onClick={() => onOpen(index)}
            className="group relative block w-full overflow-hidden rounded-lg border border-ink/12 bg-ink/10 cursor-pointer text-left"
            aria-label={`Open ${item.caption}`}>
            <Image
              src={previewSrc}
              alt={item.alt}
              className={`${heights[index % heights.length]} w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]`}
              fittingType="fill"
            />

            {/* Video Play Indicator Badge */}
            {isVideo && (
              <div className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white shadow-md backdrop-blur-xs transition-transform duration-300 group-hover:scale-110">
                <Play className="h-3.5 w-3.5 fill-current ml-0.5" />
              </div>
            )}

            <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-band/90 via-band/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-3 p-4 text-left opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
              <span className="block font-mono text-[8.5px] uppercase tracking-[0.18em] text-band-foreground/60">
                {item.category} {item.year ? `· ${item.year}` : ""}
              </span>
              <span className="mt-1 block text-[13px] font-medium leading-snug text-band-foreground line-clamp-2">
                {item.caption}
              </span>
            </span>
          </button>
        </figure>
      );
    })}
  </div>
);

export default GalleryGrid;
