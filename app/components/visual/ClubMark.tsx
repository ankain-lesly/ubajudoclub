// import { JudoThrowLogo } from "./JudoThrowLogo";
// import { JudogiCrest } from "./JudogiCrest";
import LogoCrest from "@/assets/ubajudo-logo-crest.png";
import LogoThrow from "@/assets/ubajudo-logo.png";
import { cn } from "cn";

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
  // if (variant === "crest") {
  //   return <JudogiCrest className={className} inverted={inverted} />;
  // }
  // return <JudoThrowLogo className={className} inverted={inverted} />;
  if (variant === "crest") {
    return <img className={cn("w-9 h-9 object-contain", className)} src={LogoCrest} />;
  }
  return <img className={cn("w-9 h-9 object-contain", className)} src={LogoThrow} />;
};

export default ClubMark;
