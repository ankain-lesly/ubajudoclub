interface ClubMarkProps {
  className?: string;
  inverted?: boolean;
}

const ClubMark = ({
  className = "h-10 w-10",
  inverted = false,
}: ClubMarkProps) => (
  <svg
    viewBox="0 0 40 40"
    className={className}
    role="img"
    aria-label="UBa Judo Club crest">
    <rect
      width="40"
      height="40"
      rx="9"
      fill={inverted ? "hsl(var(--paper))" : "hsl(var(--ink))"}
    />
    <circle
      cx="20"
      cy="15"
      r="6"
      fill="none"
      stroke="hsl(var(--primary))"
      strokeWidth="2.4"
    />
    <path
      d="M11 26.5h18"
      stroke={inverted ? "hsl(var(--ink))" : "hsl(var(--paper))"}
      strokeWidth="2.4"
      strokeLinecap="round"
    />
    <path
      d="M14 32h12"
      stroke="hsl(var(--primary))"
      strokeWidth="2.4"
      strokeLinecap="round"
    />
  </svg>
);

export default ClubMark;
