import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
  tone?: "light" | "dark";
}

const SectionHeading = ({
  eyebrow,
  title,
  description,
  className,
  tone = "light",
}: SectionHeadingProps) => (
  <div className={cn("max-w-2xl", className)}>
    <p
      className={cn(
        "font-mono text-[10px] uppercase tracking-[0.34em]",
        tone === "dark" ? "text-primary" : "text-primary",
      )}>
      {eyebrow}
    </p>
    <h2
      className={cn(
        "mt-5 font-display text-[clamp(1.9rem,3.6vw,3.1rem)] font-semibold leading-[1.02] tracking-[-0.025em] text-balance",
        tone === "dark" ? "text-band-foreground" : "text-foreground",
      )}>
      {title}
    </h2>
    {description && (
      <p
        className={cn(
          "mt-5 text-[15px] leading-relaxed",
          tone === "dark" ? "text-band-foreground/60" : "text-muted-foreground",
        )}>
        {description}
      </p>
    )}
  </div>
);

export default SectionHeading;
