import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { Menu, X, ArrowUpRight } from "lucide-react";
import ClubMark from "@/components/visual/ClubMark";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { cn } from "@/lib/utils";

const LINKS = [
  { to: "/", label: "Club" },
  { to: "/schedule", label: "Schedule" },
  { to: "/events", label: "Events" },
  { to: "/calendar", label: "Calendar" },
  { to: "/gallery", label: "Gallery" },
  { to: "/belts", label: "Belts" },
];

const SiteHeader = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-all duration-300",
        scrolled
          ? "border-ink/10 bg-background/85 backdrop-blur-xl"
          : "border-transparent bg-background/40 backdrop-blur-sm",
      )}>
      <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-5 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <ClubMark className="h-9 w-9" />
          <span className="leading-none">
            <span className="block font-display text-[15px] font-semibold tracking-[-0.01em]">
              UBa Judo Club
            </span>
            <span className="mt-1 block font-mono text-[9px] uppercase tracking-[0.28em] text-muted-foreground">
              Bambili Campus
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                cn(
                  "rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors",
                  isActive
                    ? "bg-ink text-paper"
                    : "text-foreground/70 hover:bg-ink/5 hover:text-foreground",
                )
              }>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <Link
            to="/login?returnTo=/dashboard"
            className="rounded-full px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground">
            Coach login
          </Link>
          <Link
            to="/join"
            className="group inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-[13px] font-semibold text-primary-foreground transition-all hover:bg-primary/90">
            Join a session
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-full border border-ink/12 md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}>
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-ink/10 bg-background px-5 pb-6 pt-2 md:hidden">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                cn(
                  "block border-b border-ink/8 py-3.5 font-display text-lg",
                  isActive ? "text-primary" : "text-foreground",
                )
              }>
              {link.label}
            </NavLink>
          ))}
          <div className="mt-5 flex flex-col gap-2">
            <Link
              to="/join"
              className="rounded-full bg-primary px-5 py-3 text-center text-sm font-semibold text-primary-foreground">
              Join a session
            </Link>
            <Link
              to="/login?returnTo=/dashboard"
              className="rounded-full border border-ink/15 px-5 py-3 text-center text-sm font-medium">
              Coach login
            </Link>
            <div className="mt-2 flex items-center justify-between rounded-full border border-ink/12 px-4 py-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Appearance
              </span>
              <ThemeToggle withLabel />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default SiteHeader;
