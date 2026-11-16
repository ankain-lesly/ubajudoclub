import type { ReactNode } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  as?: "div" | "article";
}

/** A surface that carries a soft vermilion light under the pointer. */
const SpotlightCard = ({
  children,
  className,
  as = "div",
}: SpotlightCardProps) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const glow = useMotionTemplate`radial-gradient(340px circle at ${x}px ${y}px, hsl(var(--primary) / 0.14), transparent 72%)`;
  const Tag = as === "article" ? motion.article : motion.div;

  return (
    <Tag
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        x.set(event.clientX - rect.left);
        y.set(event.clientY - rect.top);
      }}
      className={cn("group/spot relative overflow-hidden", className)}>
      <motion.span
        aria-hidden="true"
        style={{ background: glow }}
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/spot:opacity-100"
      />
      {children}
    </Tag>
  );
};

export default SpotlightCard;
