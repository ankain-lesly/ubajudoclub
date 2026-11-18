interface LogoProps {
  className?: string;
  inverted?: boolean;
}

/**
 * Concept 02: Dynamic Judo Throw (Main App Logo)
 * Features Tori (thrower in White Gi) executing an Ippon Seoi-Nage throw
 * on Uke (in Blue Gi with flying Red Belt).
 * Fully optimized for both Light and Dark modes.
 */
export const JudoThrowLogo = ({
  className = "h-10 w-10",
  inverted = false,
}: LogoProps) => (
  <svg
    viewBox="0 0 48 48"
    className={className}
    role="img"
    aria-label="UBa Judo Club Logo — Dynamic Throw"
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

    {/* Subtle Tatami Grounding Arc */}
    <path
      d="M7 39C13 41 35 41 41 39"
      className={inverted ? "stroke-ink/20" : "stroke-paper/20 dark:stroke-white/15"}
      strokeWidth="1.2"
      strokeLinecap="round"
    />

    {/* UKE (Airborne Judoka in International Blue Gi) */}
    {/* Uke Head */}
    <circle
      cx="33"
      cy="13.5"
      r="3.2"
      fill="#2563EB"
      className="dark:fill-[#3B82F6]"
    />

    {/* Uke Blue Gi - Torso/Shoulders Sweeping Arc */}
    <path
      d="M34.5 17.5C33 21.5 28.5 25 21.5 24.5C23.5 22 28 19 32.5 17L34.5 17.5Z"
      fill="#1D4ED8"
      className="dark:fill-[#2563EB]"
    />

    {/* Uke Blue Gi - Sweeping Leg / Flying Body Extension */}
    <path
      d="M21.5 24.5C24.5 22.5 30.5 19 37.5 18.5C39.5 18.5 41.5 20 40.5 22C37.5 25 30.5 26.5 24 26L21.5 24.5Z"
      fill="#2563EB"
      className="dark:fill-[#3B82F6]"
    />

    {/* Uke Red Competition Belt (Aka-Obi - Dynamic Flowing Ribbon) */}
    <path
      d="M19 25.5C24 24.5 30 23.5 35.5 25.5C37.5 26.5 39 28.5 38 30C36.5 31.5 34 30 32 28.5C27.5 26 22 25.5 18 26"
      stroke="#DE3B26"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Belt Knot Tails */}
    <path
      d="M23 25.5L24.5 29.5M25.5 25.5L27.5 29"
      stroke="#DE3B26"
      strokeWidth="1.8"
      strokeLinecap="round"
    />

    {/* TORI (Thrower Planted on Tatami in Crisp White Gi) */}
    {/* Tori Planted Stance / Legs driving through */}
    <path
      d="M14 39L18 29.5L22 39"
      className={
        inverted
          ? "stroke-ink"
          : "stroke-[#E8E2D8] dark:stroke-[#F6F1E9]"
      }
      strokeWidth="2.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Tori White Gi Torso & Pivot Core */}
    <path
      d="M17 19C15 21 14 24 14.5 28C15 29 18 29.5 21 29C23 28.5 23.5 27 23 25C22.5 22 20.5 19.5 17 19Z"
      className={
        inverted
          ? "fill-paper stroke-ink"
          : "fill-[#F6F1E9] dark:fill-[#FFFFFF] stroke-[#14150F]/30 dark:stroke-black/50"
      }
      strokeWidth="0.9"
    />

    {/* Tori Gi Lapels (Crossed V Collar) */}
    <path
      d="M16 19.5L19.5 25M19 19.5L16.5 24.5"
      className={inverted ? "stroke-ink" : "stroke-[#14150F]/75 dark:stroke-[#14150F]/90"}
      strokeWidth="1.2"
      strokeLinecap="round"
    />

    {/* Tori Black Belt (Kuro-Obi) */}
    <path
      d="M14.5 28C17 28.5 19.5 28.5 22.5 28"
      className={inverted ? "stroke-ink" : "stroke-[#0B0C08] dark:stroke-[#050504]"}
      strokeWidth="2.2"
      strokeLinecap="round"
    />

    {/* Tori Head (Focal Point, Driving Forward) */}
    <circle
      cx="17"
      cy="14"
      r="3.2"
      className={
        inverted
          ? "fill-paper stroke-ink"
          : "fill-[#F6F1E9] dark:fill-[#FFFFFF] stroke-[#14150F]/30 dark:stroke-black/50"
      }
      strokeWidth="0.9"
    />

    {/* Kuzushi (Off-balancing Motion Arc Accent) */}
    <path
      d="M29 8.5C35 10 40 14 42 19"
      stroke="#DE3B26"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeDasharray="2 3"
      opacity="0.8"
    />
  </svg>
);

export default JudoThrowLogo;
