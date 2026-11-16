import { cn } from "@/lib/utils";

type Variant = "weave" | "rings" | "dots" | "hatch" | "grid";
type Tone = "paper" | "ink";

interface SectionBackdropProps {
  variant?: Variant;
  tone?: Tone;
  className?: string;
}

/**
 * Layered section grounds — tatami weave, ring echoes, halftone dots and hairline
 * hatches stacked in print-like layers instead of a single flat gradient.
 */
const SectionBackdrop = ({
  variant = "weave",
  tone = "paper",
  className,
}: SectionBackdropProps) => {
  const ink = tone === "ink";
  const weave = ink ? "weave-paper" : "weave";
  const rings = ink ? "ring-echo-paper" : "ring-echo";
  const hatch = ink ? "hatch-paper" : "hatch";
  const dotColor = ink ? "text-band-foreground" : "text-ink";
  const rule = ink ? "bg-band-foreground/12" : "bg-ink/10";

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}>
      {variant === "weave" && (
        <>
          <div className={cn("absolute inset-0 opacity-90", weave)} />
          <div
            className={cn(
              "dot-field edge-mask absolute inset-0 opacity-[0.14]",
              dotColor,
            )}
          />
          <div
            className={cn(
              "absolute -right-24 top-0 h-[320px] w-[320px] rounded-full border",
              ink ? "border-band-foreground/10" : "border-ink/10",
            )}
          />
        </>
      )}

      {variant === "rings" && (
        <>
          <div
            className={cn(
              "absolute inset-0 opacity-70 [--echo-x:88%] [--echo-y:-16%]",
              rings,
            )}
          />
          <div
            className={cn(
              "absolute inset-0 opacity-40 [--echo-x:6%] [--echo-y:112%]",
              rings,
            )}
          />
          <div className={cn("absolute inset-0 opacity-30", weave)} />
        </>
      )}

      {variant === "dots" && (
        <>
          <div
            className={cn(
              "dot-field absolute inset-0 opacity-[0.16] [background-size:22px_22px]",
              dotColor,
            )}
          />
          <div
            className={cn(
              "absolute inset-0 opacity-45 [--echo-x:-10%] [--echo-y:120%]",
              rings,
            )}
          />
          <div className={cn("absolute inset-x-0 top-0 h-px", rule)} />
        </>
      )}

      {variant === "hatch" && (
        <>
          <div className={cn("absolute inset-0 opacity-60", hatch)} />
          <div
            className={cn(
              "dot-field edge-mask absolute inset-0 opacity-[0.12]",
              dotColor,
            )}
          />
          <div
            className={cn(
              "absolute inset-y-0 left-[18%] hidden w-px lg:block",
              rule,
            )}
          />
        </>
      )}

      {variant === "grid" && (
        <>
          <div
            className={cn(
              "grid-fine absolute inset-0 opacity-50",
              ink ? "text-band-foreground/[0.12]" : "text-ink/[0.09]",
            )}
          />
          <div
            className={cn(
              "dot-field edge-mask absolute inset-0 opacity-[0.16]",
              dotColor,
            )}
          />
          <div
            className={cn(
              "absolute -left-32 bottom-0 h-[360px] w-[360px] rounded-full border",
              ink ? "border-band-foreground/10" : "border-ink/10",
            )}
          />
        </>
      )}
    </div>
  );
};

export default SectionBackdrop;
