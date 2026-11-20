import { useEffect } from "react";
import { Link } from "react-router";
import { X, ChevronLeft, ChevronRight, ArrowUpRight, Calendar, User } from "lucide-react";
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

  const isVideo =
    item.mediaType === "VIDEO" ||
    item.src.endsWith(".mp4") ||
    item.src.endsWith(".mov") ||
    item.src.includes("/video/upload/");

  return (
    <div className="fixed inset-0 z-[70] flex flex-col bg-band/95 px-4 py-6 backdrop-blur-md">
      {/* Top Header */}
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between text-band-foreground">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-band-foreground/60">
          {String(index + 1).padStart(2, "0")} /{" "}
          {String(items.length).padStart(2, "0")}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="grid h-10 w-10 place-items-center rounded-full border border-band-foreground/25 text-band-foreground transition-colors hover:bg-band-foreground/10 cursor-pointer"
          aria-label="Close gallery">
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="relative mx-auto flex w-full max-w-5xl flex-1 items-center justify-center gap-3 py-4">
        <button
          type="button"
          onClick={() => onStep(-1)}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-band-foreground/25 text-band-foreground transition-colors hover:bg-band-foreground/10 cursor-pointer"
          aria-label="Previous capture">
          <ChevronLeft className="h-4 w-4" />
        </button>

        <figure className="flex min-w-0 flex-1 flex-col items-center">
          {isVideo ? (
            <video
              src={item.src}
              poster={item.thumbnailUrl}
              controls
              autoPlay
              playsInline
              className="h-[56vh] max-w-full rounded-xl object-contain sm:h-[64vh] shadow-2xl"
            />
          ) : (
            <Image
              src={item.src}
              alt={item.alt}
              className="h-[56vh] w-full sm:h-[64vh]"
              fittingType="fit"
            />
          )}

          <figcaption className="mt-4 max-w-xl text-center space-y-1.5">
            <p className="font-display text-base font-medium text-band-foreground leading-snug">
              {item.caption}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-band-foreground/60 font-mono text-[9px] uppercase tracking-[0.16em]">
              <span>{item.category}</span>
              {item.sessionDate && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {item.sessionDate}
                  </span>
                </>
              )}
              {item.coach && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {item.coach}
                  </span>
                </>
              )}
            </div>

            {/* Direct Parent Session Deep Link */}
            {item.sessionId && (
              <div className="pt-2">
                <Link
                  to={`/sessions/${item.sessionId}`}
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3.5 py-1 text-xs font-medium text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <span>View Mat Session Details</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}
          </figcaption>
        </figure>

        <button
          type="button"
          onClick={() => onStep(1)}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-band-foreground/25 text-band-foreground transition-colors hover:bg-band-foreground/10 cursor-pointer"
          aria-label="Next capture">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default Lightbox;
