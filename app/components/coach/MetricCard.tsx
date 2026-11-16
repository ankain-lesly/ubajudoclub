import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string | number;
  hint?: string;
  icon?: ReactNode;
  tone?: "default" | "good" | "warn";
}

const tones = {
  default: "text-foreground",
  good: "text-accent",
  warn: "text-primary",
};

const MetricCard = ({
  label,
  value,
  hint,
  icon,
  tone = "default",
}: MetricCardProps) => (
  <div className="rounded-lg border border-ink/12 bg-card p-5">
    <div className="flex items-center justify-between">
      <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      {icon}
    </div>
    <p
      className={cn(
        "mt-4 font-display text-3xl font-semibold leading-none tracking-[-0.03em] tabular-nums",
        tones[tone],
      )}>
      {value}
    </p>
    {hint && (
      <p className="mt-2 text-[11.5px] leading-relaxed text-muted-foreground">
        {hint}
      </p>
    )}
  </div>
);

export default MetricCard;
