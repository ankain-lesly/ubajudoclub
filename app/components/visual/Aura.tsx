import { cn } from "@/lib/utils";

interface AuraProps {
  className?: string;
  tone?: "paper" | "ink";
  grid?: boolean;
}

/** Soft drifting light fields that sit behind public page content. */
const Aura = ({ className, tone = "paper", grid = true }: AuraProps) => {
  const ink = tone === "ink";

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}>
      <div
        className={cn(
          "animate-drift absolute -left-28 -top-32 h-[520px] w-[520px] rounded-full blur-[100px]",
          ink ? "bg-primary/25" : "bg-primary/[0.14]",
        )}
      />
      <div
        className={cn(
          "animate-drift absolute -right-24 top-[16%] h-[430px] w-[430px] rounded-full blur-[110px] [animation-delay:-9s]",
          ink ? "bg-gold/20" : "bg-gold/[0.18]",
        )}
      />
      <div
        className={cn(
          "animate-drift absolute -bottom-40 left-[32%] h-[470px] w-[470px] rounded-full blur-[120px] [animation-delay:-17s]",
          ink ? "bg-band-foreground/[0.12]" : "bg-accent/[0.10]",
        )}
      />
      {grid && (
        <div
          className={cn(
            "grid-fine absolute inset-0",
            ink
              ? "text-band-foreground/[0.10] opacity-40"
              : "text-ink/[0.09] opacity-50",
          )}
        />
      )}
    </div>
  );
};

export default Aura;
