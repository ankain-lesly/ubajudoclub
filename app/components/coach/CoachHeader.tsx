import { LogOut, ArrowUpRight, ShieldCheck } from "lucide-react";
import { Link } from "react-router";
import ClubMark from "@/components/visual/ClubMark";

interface CoachHeaderProps {
  email?: string;
  onSignOut: () => void;
}

const CoachHeader = ({ email, onSignOut }: CoachHeaderProps) => (
  <div className="border-b border-ink/15 bg-band text-band-foreground">
    <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-5 lg:px-8">
      <div className="flex items-center gap-3">
        <ClubMark variant="crest" className="h-9 w-9" inverted />
        <div>
          <p className="font-display text-[15px] font-semibold leading-none tracking-[-0.01em]">
            Staff console
          </p>
          <p className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.24em] text-band-foreground/45">
            {email || "Signed in staff"}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 rounded-full border border-band-foreground/20 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-band-foreground/70 transition-colors hover:text-band-foreground">
          Public site
          <ArrowUpRight className="h-3 w-3" />
        </Link>
        <button
          type="button"
          onClick={onSignOut}
          className="inline-flex items-center gap-1.5 rounded-full bg-band-foreground/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-band-foreground/80 transition-colors hover:bg-band-foreground/20">
          <LogOut className="h-3 w-3" />
          Sign out
        </button>
      </div>
    </div>
    <div className="mx-auto flex max-w-6xl items-center gap-2 px-5 pb-4 lg:px-8">
      <ShieldCheck className="h-3.5 w-3.5 text-primary" />
      <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-band-foreground/40">
        Member records are private to the staff team
      </p>
    </div>
  </div>
);

export default CoachHeader;
