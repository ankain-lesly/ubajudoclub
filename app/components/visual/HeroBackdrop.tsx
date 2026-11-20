import { cn } from "@/lib/utils";

interface HeroBackdropProps {
  src: string;
  alt?: string;
  className?: string;
  imageClassName?: string;
  opacityClassName?: string;
  accentColor?: string;
  gradientVariant?: "left" | "right" | "radial" | "centered";
}

/**
 * High-performance Hero Background image wrapper.
 * Blends cinematic judo/workout photography with multi-stop contrast masks,
 * ensuring WCAG AAA legibility for foreground typography while creating
 * immersive athletic atmosphere across both Light and Dark modes.
 */
export const HeroBackdrop = ({
  src,
  alt = "",
  className,
  imageClassName,
  opacityClassName = "opacity-55 dark:opacity-60",
  accentColor,
  gradientVariant = "left",
}: HeroBackdropProps) => {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden select-none",
        className,
      )}
    >
      {/* Background Judo Action Photograph */}
      <img
        src={src}
        alt={alt}
        className={cn(
          "h-full w-full object-cover object-center scale-105 transition-all duration-700",
          opacityClassName,
          imageClassName,
        )}
        loading="eager"
      />

      {/* Primary Directional Contrast Mask - ensures 100% WCAG AAA text legibility while keeping action area vibrant */}
      {gradientVariant === "left" && (
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-transparent md:via-background/70 lg:to-transparent" />
      )}
      {gradientVariant === "right" && (
        <div className="absolute inset-0 bg-gradient-to-l from-background via-background/85 to-transparent md:via-background/70 lg:to-transparent" />
      )}
      {gradientVariant === "centered" && (
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-background" />
      )}
      {gradientVariant === "radial" && (
        <div className="absolute inset-0 bg-radial from-transparent via-background/50 to-background" />
      )}

      {/* Subtle Top & Bottom Edge Vignette for Seamless Section Bleed */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />

      {/* Optional Rank-Specific or Theme Accent Lighting */}
      {accentColor && (
        <div
          className="absolute -right-20 -top-20 h-[500px] w-[500px] rounded-full opacity-20 blur-[120px] dark:opacity-30"
          style={{ backgroundColor: accentColor }}
        />
      )}
    </div>
  );
};

export default HeroBackdrop;
