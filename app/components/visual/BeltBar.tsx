import { beltFor } from "@/lib/data/club";
import { cn } from "@/lib/utils";

interface BeltBarProps {
  rank?: string;
  className?: string;
}

const BeltBar = ({ rank, className }: BeltBarProps) => {
  const belt = beltFor(rank);
  return (
    <span
      className={cn(
        "inline-flex h-2 w-14 overflow-hidden rounded-full ring-1 ring-inset ring-ink/10",
        className,
      )}
      aria-hidden="true">
      <span className="h-full flex-1" style={{ backgroundColor: belt.color }} />
      <span className="h-full w-2 bg-ink/20" />
    </span>
  );
};

export default BeltBar;
