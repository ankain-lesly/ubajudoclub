import { JudoThrowLogo } from "./JudoThrowLogo";
import { JudogiCrest } from "./JudogiCrest";

export { JudoThrowLogo } from "./JudoThrowLogo";
export { JudogiCrest } from "./JudogiCrest";

export interface ClubMarkProps {
  className?: string;
  inverted?: boolean;
  variant?: "throw" | "crest";
}

/**
 * UBa Judo Club Official Mark / Logo
 * - variant="throw" (default): Concept 02 — Dynamic Judo Throw (White Tori throwing Blue Uke with Red Belt)
 * - variant="crest": Concept 03 — Judogi Lapel & Obi Crest with Kodokan Sun (Secondary UI)
 */
export const ClubMark = ({
  className = "h-10 w-10",
  inverted = false,
  variant = "throw",
}: ClubMarkProps) => {
  if (variant === "crest") {
    return <JudogiCrest className={className} inverted={inverted} />;
  }
  return <JudoThrowLogo className={className} inverted={inverted} />;
};

export default ClubMark;
