import { beltFor } from "@/lib/data/club";
import { cn } from "@/lib/utils";

export interface BeltBarProps {
  rank?: string;
  color?: string;
  className?: string;
  title?: string;
}

/**
 * Authentic Tied Judo Belt (Obi) Component
 * Features the traditional tied koma-musubi square knot, wrapped waist loop,
 * and hanging belt ends with realistic depth shading.
 * Fully responsive and optimized for both light and dark modes.
 */
export const BeltBar = ({
  rank,
  color: customColor,
  className,
  title,
}: BeltBarProps) => {
  const belt = beltFor(rank);
  const baseColor = customColor || belt.color;
  const isWhite = (rank || "").toLowerCase().includes("white") || baseColor.toUpperCase() === "#F0E7D6";
  const isBlack = (rank || "").toLowerCase().includes("black") || baseColor === "#14150F";

  // Palette tuning for contrast across themes
  const fillColor = isWhite
    ? "fill-[#F4EFEA] dark:fill-[#FBF8F3]"
    : isBlack
    ? "fill-[#1E1F19] dark:fill-[#12130E]"
    : "";

  const strokeColor = isWhite
    ? "stroke-[#2D2E24] dark:stroke-[#424436]"
    : isBlack
    ? "stroke-[#14150F] dark:stroke-[#5A5C4E]"
    : "stroke-[#181913] dark:stroke-[#0B0C07]";

  const label = title || (rank ? `${rank} Belt` : "Judo Belt");

  return (
    <svg
      viewBox="0 0 478.619 184.762"
      className={cn("h-5 w-auto shrink-0 select-none overflow-visible", className)}
      role="img"
      aria-label={label}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{label}</title>
      <g
        className={strokeColor}
        strokeWidth="5"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        {/* 1. Folded Back Tuck (behind waist loop) */}
        <path
          d="M192.044 46.054c0 0-1.475 4.952 0.21 7.375 1.686 2.423 24.86 1.791 24.86 1.791L205.845 45l-13.801 1.054z"
          className={fillColor}
          fill={fillColor ? undefined : baseColor}
        />
        <path
          d="M192.044 46.054c0 0-1.475 4.952 0.21 7.375 1.686 2.423 24.86 1.791 24.86 1.791L205.845 45l-13.801 1.054z"
          fill="black"
          fillOpacity="0.25"
          stroke="none"
        />

        {/* 2. Main Belt Waist Loop (curves around back and hips) */}
        <path
          d="M9.831 23.198c0 0 119.181 32.087 233.779 32.087 114.598 0 214.679-51.187 218.5-53.479 3.819-2.292 12.987 38.963 0.765 48.131-12.225 9.168-80.983 48.896-216.208 48.896-135.226 0-233.015-21.392-239.892-29.032C-0.101 62.161-0.101 31.602 9.831 23.198z"
          className={fillColor}
          fill={fillColor ? undefined : baseColor}
        />
        {/* Subtle top edge highlight on waist loop */}
        <path
          d="M9.831 23.198c0 0 119.181 32.087 233.779 32.087 114.598 0 214.679-51.187 218.5-53.479 3.819-2.292 12.987 16 0.765 24-12.225 9-80.983 30-216.208 30C100 55 10 35 9.831 23.198z"
          fill="white"
          fillOpacity={isWhite ? "0.4" : "0.18"}
          stroke="none"
        />

        {/* 3. Knot Fold Underlayer */}
        <path
          d="M252.014 126.336c0 0-22.156-6.112-28.268-21.392-6.111-15.279 58.827-29.795 58.827-29.795l-6.112 31.324-24.447 19.863z"
          className={fillColor}
          fill={fillColor ? undefined : baseColor}
        />
        <path
          d="M252.014 126.336c0 0-22.156-6.112-28.268-21.392-6.111-15.279 58.827-29.795 58.827-29.795l-6.112 31.324-24.447 19.863z"
          fill="black"
          fillOpacity="0.22"
          stroke="none"
        />

        {/* 4. Left Loop of Tied Knot */}
        <path
          d="M195.479 102.652c0 0 30.56 21.392 35.143 19.1 4.584-2.292 58.827-36.671 58.827-36.671L243.61 51.465l-50.423 38.2 2.292 12.987z"
          className={fillColor}
          fill={fillColor ? undefined : baseColor}
        />

        {/* 5. Left Hanging Belt Tail (streaming down-left) */}
        <path
          d="M22.818 152.312c0 0 125.293-76.398 200.928-106.958 75.635-30.56 30.56 29.031 30.56 29.031s-78.69 38.199-110.778 57.299-81.746 50.424-87.858 51.188c-5.112-9.237-31.852-40.56-31.852-40.56z"
          className={fillColor}
          fill={fillColor ? undefined : baseColor}
        />
        {/* Shadow under left loop overlapping left tail */}
        <path
          d="M170 85c-20 15-45 32-75 48-18 10-38 18-50 20 8-15 28-35 52-48 24-14 50-20 73-20z"
          fill="black"
          fillOpacity="0.16"
          stroke="none"
        />

        {/* 6. Top Knot Lip Fold */}
        <path
          d="M255.967 27.303c0 0-5.29-1.851-14.146 8.46-8.857 10.312 15.07 8.197 15.07 8.197l-.924-16.657z"
          className={fillColor}
          fill={fillColor ? undefined : baseColor}
        />

        {/* 7. Right Hanging Belt Tail (streaming down-right) */}
        <path
          d="M232.15 28.546c0 0 94.734 49.659 127.586 60.355 32.851 10.696 113.832 46.603 116.889 55.771s-27.503 30.559-27.503 30.559-23.685-21.391-54.243-34.379c-30.56-12.987-83.274-34.379-112.306-48.131-29.031-13.751-89.387-47.367-89.387-47.367L232.15 28.546z"
          className={fillColor}
          fill={fillColor ? undefined : baseColor}
        />

        {/* 8. Knot Core Center Wrap (the square wrap holding the knot) */}
        <path
          d="M255.834 27.782c0 0-2.292 92.442-4.584 97.026-2.293 4.584 42.783-12.987 43.546-18.335 0.765-5.349 6.877-50.423 2.293-55.007s-36.672-25.976-41.255-23.684z"
          className={fillColor}
          fill={fillColor ? undefined : baseColor}
        />
        {/* Knot core dimensional shading */}
        <path
          d="M255.834 27.782c0 0-2.292 92.442-4.584 97.026-2.293 4.584 15-5 22-10-2-25-3-55-1-80-6-3-12-6-16.416-7.026z"
          fill="black"
          fillOpacity="0.18"
          stroke="none"
        />
      </g>
    </svg>
  );
};

export const JudoBelt = BeltBar;
export default BeltBar;
