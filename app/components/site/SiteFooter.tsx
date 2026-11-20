import { Link } from "react-router";
import ClubMark from "@/components/visual/ClubMark";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { VENUE, WEEK } from "@/lib/data/club";

const SiteFooter = () => (
  <footer className="border-t border-ink/10 bg-background">
    <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
      <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <ClubMark variant="throw" className="h-10 w-10" />
            <span className="font-display text-lg font-semibold tracking-[-0.01em]">
              UBa Judo Club
            </span>
          </div>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">
            The University of Bamenda judo club. Training sessions weekly at
            UBa Campus Amphi 100.
          </p>
          <p className="mt-6 font-mono text-[10px] uppercase leading-relaxed tracking-[0.2em] text-muted-foreground">
            {VENUE.name}
            <br />
            {VENUE.campus}
          </p>
        </div>

        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
            On the mat
          </p>
          <ul className="mt-5 space-y-2.5 text-sm">
            {WEEK.map((s, i) => (
              <li
                key={i}
                className="flex justify-between gap-4 text-foreground/80">
                <span>{s.day.slice(0, 3)}</span>
                <span className="font-mono text-[11px] text-muted-foreground">
                  {s.time}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
            Club
          </p>
          <ul className="mt-5 space-y-2.5 text-sm">
            {[
              { to: "/", label: "The club" },
              { to: "/sessions", label: "Mat Sessions" },
              { to: "/schedule", label: "Training week" },
              { to: "/events", label: "Events & Tournaments" },
              { to: "/calendar", label: "Calendar" },
              { to: "/members", label: "Members Directory" },
              { to: "/gallery", label: "Gallery" },
              { to: "/belts", label: "Belt pathway" },
              { to: "/join", label: "Join the mat" },
              { to: "/login", label: "Coach console" },
            ].map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="text-foreground/80 transition-colors hover:text-primary">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-14 flex flex-col gap-3 border-t border-ink/10 pt-6 text-[11px] text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p className="font-mono uppercase tracking-[0.16em]">
          © {new Date().getFullYear()} UBa Judo Club · Bambili
        </p>
        <p>Public pages show turnout counts only — never member identities.</p>
        <ThemeToggle withLabel className="self-start md:self-auto" />
      </div>
    </div>
  </footer>
);

export default SiteFooter;
