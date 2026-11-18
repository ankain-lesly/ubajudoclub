interface CrestProps {
  className?: string;
  inverted?: boolean;
}

/**
 * Concept 03: The Judogi & Obi Crest (Secondary UI Logo)
 * Features traditional crossed Judogi lapels (left-over-right),
 * Kodokan Rising Sun red emblem, and the tied Obi knot.
 * Designed for crisp legibility at small sizes in footers, badges, and sidebars.
 * Fully optimized for Light and Dark modes.
 */
export const JudogiCrest = ({
  className = "h-10 w-10",
  inverted = false,
}: CrestProps) => (
  <svg
    viewBox="0 0 48 48"
    className={className}
    role="img"
    aria-label="UBa Judo Club Crest — Judogi & Obi"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Base Shield Container */}
    <rect
      width="48"
      height="48"
      rx="11"
      className={
        inverted
          ? "fill-card stroke-ink/15 dark:stroke-white/15"
          : "fill-ink dark:fill-[#0E0F0A] stroke-ink/10 dark:stroke-white/10"
      }
      strokeWidth="1"
    />

    {/* Kodokan Red Sun Emblem Accent */}
    <circle
      cx="24"
      cy="20"
      r="10"
      fill="#DE3B26"
      className="dark:fill-[#E0432E]"
    />

    {/* Inner Sun Accent / Ring (Subtle Kodokan Flower Motif) */}
    <circle
      cx="24"
      cy="20"
      r="7"
      stroke="#FFFFFF"
      strokeWidth="0.8"
      strokeDasharray="2.5 1.5"
      opacity="0.45"
    />

    {/* Judogi - Back Collar / Shoulders */}
    <path
      d="M14 18C14 12 18 10 24 10C30 10 34 12 34 18"
      className={
        inverted
          ? "stroke-ink/30"
          : "stroke-[#F6F1E9]/40 dark:stroke-white/30"
      }
      strokeWidth="1.2"
      strokeLinecap="round"
    />

    {/* Judogi Left & Right Body Panels (White Gi) */}
    {/* Under lapel (Right side / wearer's right) */}
    <path
      d="M13 18L19 32H29L35 18C33 16 30 14 24 14C18 14 15 16 13 18Z"
      className={
        inverted
          ? "fill-paper stroke-ink/20"
          : "fill-[#F6F1E9] dark:fill-[#FFFFFF] stroke-black/20"
      }
      strokeWidth="0.8"
    />

    {/* Traditional Left-Over-Right Lapel Crossing (Hidarimae) */}
    {/* Right lapel going down-left */}
    <path
      d="M17 14L28 32"
      className={
        inverted
          ? "stroke-ink"
          : "stroke-[#14150F]/70 dark:stroke-[#14150F]/90"
      }
      strokeWidth="2.4"
      strokeLinecap="round"
    />

    {/* Left lapel crossing OVER going down-right */}
    <path
      d="M31 14L20 32"
      className={
        inverted
          ? "stroke-ink"
          : "stroke-[#14150F] dark:stroke-[#050504]"
      }
      strokeWidth="2.8"
      strokeLinecap="round"
    />

    {/* Inner Collar Fold Highlighting */}
    <path
      d="M29.5 15.5L21.5 28.5"
      stroke="#DE3B26"
      strokeWidth="1.2"
      strokeLinecap="round"
      opacity="0.9"
    />

    {/* Obi (Belt) Band across the waist */}
    <rect
      x="12"
      y="31"
      width="24"
      height="4.5"
      rx="1.5"
      className={
        inverted
          ? "fill-ink stroke-ink"
          : "fill-[#14150F] dark:fill-[#0A0B08] stroke-black/30"
      }
      strokeWidth="0.6"
    />

    {/* Obi Center Knot (Koma-musubi Square Knot) */}
    <rect
      x="21.5"
      y="30"
      width="5"
      height="6.5"
      rx="1.2"
      className={
        inverted
          ? "fill-ink stroke-paper"
          : "fill-[#0B0C08] dark:fill-[#000000] stroke-white/20"
      }
      strokeWidth="0.6"
    />

    {/* Knot Center Accent Core */}
    <path
      d="M23 31.5H25"
      stroke="#DE3B26"
      strokeWidth="1.4"
      strokeLinecap="round"
    />

    {/* Hanging Belt Ends */}
    {/* Left belt tail */}
    <path
      d="M22.5 36.5L20 42"
      className={
        inverted
          ? "stroke-ink"
          : "stroke-[#14150F] dark:stroke-[#0A0B08]"
      }
      strokeWidth="2.4"
      strokeLinecap="round"
    />
    {/* Right belt tail */}
    <path
      d="M25.5 36.5L28 41.5"
      className={
        inverted
          ? "stroke-ink"
          : "stroke-[#14150F] dark:stroke-[#0A0B08]"
      }
      strokeWidth="2.4"
      strokeLinecap="round"
    />

    {/* Red Rank Stripe on hanging belt tip */}
    <path
      d="M20.6 40.5L20 42"
      stroke="#DE3B26"
      strokeWidth="2.4"
      strokeLinecap="round"
    />
  </svg>
);

export default JudogiCrest;
