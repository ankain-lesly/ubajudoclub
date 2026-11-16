import { useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import type { GalleryItem } from "@/lib/types";

interface LightboxProps {
  items: GalleryItem[];
  index: number;
  onClose: () => void;
  onStep: (delta: number) => void;
}

const Lightbox = ({ items, index, onClose, onStep }: LightboxProps) => {
  const item = items[index];

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") onStep(1);
      if (event.key === "ArrowLeft") onStep(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, onStep]);

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-[70] flex flex-col bg-band/94 px-4 py-6 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between text-band-foreground">
        <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-band-foreground/50">
          {String(index + 1).padStart(2, "0")} /{" "}
          {String(items.length).padStart(2, "0")}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="grid h-10 w-10 place-items-center rounded-full border border-band-foreground/25 text-band-foreground transition-colors hover:bg-band-foreground/10"
          aria-label="Close gallery">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="relative mx-auto flex w-full max-w-5xl flex-1 items-center justify-center gap-3 py-4">
        <button
          type="button"
          onClick={() => onStep(-1)}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-band-foreground/25 text-band-foreground transition-colors hover:bg-band-foreground/10"
          aria-label="Previous image">
          <ChevronLeft className="h-4 w-4" />
        </button>

        <figure className="flex min-w-0 flex-1 flex-col items-center">
          <Image
            src={item.src}
            alt={item.alt}
            className="h-[58vh] w-full sm:h-[66vh]"
            fittingType="fit"
          />
          <figcaption className="mt-4 text-center">
            <p className="font-display text-[15px] text-band-foreground">
              {item.caption}
            </p>
            <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.18em] text-band-foreground/50">
              {item.category} · {item.year}
            </p>
          </figcaption>
        </figure>

        <button
          type="button"
          onClick={() => onStep(1)}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-band-foreground/25 text-band-foreground transition-colors hover:bg-band-foreground/10"
          aria-label="Next image">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default Lightbox;
