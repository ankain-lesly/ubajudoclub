import { cn } from "@/lib/utils";

interface RingFieldProps {
  className?: string;
  tone?: "paper" | "ink";
}

/** The club's tatami motif: concentric rings, tracing dashes and a centre mark. */
const RingField = ({ className, tone = "paper" }: RingFieldProps) => {
  const ink = tone === "ink";

  return (
    <svg
      viewBox="0 0 560 560"
      aria-hidden="true"
      className={cn("h-full w-full", className)}>
      <g className={ink ? "text-band-foreground/25" : "text-ink/20"}>
        <g className="animate-spin-slow">
          {[262, 208, 154].map((r) => (
            <circle
              key={r}
              cx="280"
              cy="280"
              r={r}
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
          ))}
        </g>
        <g className="animate-spin-slower">
          <circle
            cx="280"
            cy="280"
            r="100"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="2 9"
          />
          <circle
            cx="280"
            cy="280"
            r="304"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="1 22"
          />
        </g>
        <circle
          cx="280"
          cy="280"
          r="46"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="1.5"
          opacity="0.5"
          className="animate-trace"
        />
      </g>
      <circle
        cx="280"
        cy="280"
        r="6"
        fill="hsl(var(--primary))"
        opacity="0.85"
      />
      <path
        d="M18 486 L542 58"
        stroke="hsl(var(--primary))"
        strokeWidth="1.5"
        opacity={ink ? 0.28 : 0.2}
        strokeDasharray="1 7"
      />
    </svg>
  );
};

export default RingField;
