import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { Menu, X, ArrowUpRight, ChevronDown, Search } from "lucide-react";
import ClubMark from "@/components/visual/ClubMark";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { useAuth } from "@/lib/auth/AuthContext";
import { signOutUser } from "@/lib/auth/actions";
import { useSearchStore } from "@/lib/stores/search.store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const PRIMARY_LINKS = [
  { to: "/", label: "Home" },
  { to: "/schedule", label: "Schedule" },
  { to: "/events", label: "Events" },
  { to: "/calendar", label: "Calendar" },
];

const DOJO_MENU_ITEMS = [
  { to: "/sessions", label: "Sessions", desc: "Mat syllabus & attendee logs" },
  {
    to: "/techniques",
    label: "Techniques",
    desc: "Kodokan Gokyo & Ne-waza archive",
  },
  { to: "/members", label: "Our Team", desc: "Registered judoka & grades" },
  { to: "/belts", label: "Belts & Grades", desc: "Kyu–Dan promotion pathway" },
  { to: "/gallery", label: "Photo Gallery", desc: "Visual mat captures" },
];

const SiteHeader = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [mobileDojoOpen, setMobileDojoOpen] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const isCoachOrAdmin =
    user && (user.role === "staff" || user.role === "admin");

  const isDojoActive = DOJO_MENU_ITEMS.some((item) =>
    location.pathname.startsWith(item.to),
  );

  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b transition-all duration-300",
          scrolled
            ? "border-ink/10 bg-background/85 backdrop-blur-xl"
            : "border-transparent bg-background/40 backdrop-blur-sm",
        )}>
        <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-5 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <ClubMark variant="throw" className="h-9 w-9" />
            <span className="leading-none">
              <span className="block font-display text-[15px] font-semibold tracking-[-0.01em]">
                UBa Judo Club
              </span>
              <span className="mt-1 block font-mono text-[9px] uppercase tracking-[0.28em] text-muted-foreground">
                Bambili Campus
              </span>
            </span>
          </Link>

          {/* Desktop Navigation with Dropdown */}
          <nav className="hidden items-center gap-1 md:flex">
            {PRIMARY_LINKS.map((link) => (
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

            {/* Dojo Dropdown Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors outline-none",
                  isDojoActive
                    ? "bg-ink text-paper"
                    : "text-foreground/70 hover:bg-ink/5 hover:text-foreground",
                )}>
                <span>Dojo</span>
                <ChevronDown className="h-3.5 w-3.5 opacity-60 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="start"
                sideOffset={8}
                className="w-56 rounded-xl border border-ink/12 bg-card p-1.5 shadow-xl backdrop-blur-md">
                {DOJO_MENU_ITEMS.map((item) => (
                  <DropdownMenuItem
                    key={item.to}
                    render={<Link to={item.to} />}
                    className="flex flex-col items-start gap-0.5 rounded-lg px-3 py-2 text-left transition-colors hover:bg-secondary/60 focus:bg-secondary/60">
                    <span className="text-[13px] font-medium text-foreground">
                      {item.label}
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {item.desc}
                    </span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Right Actions */}
          <div className="hidden items-center gap-2 md:flex">
            {/* Spotlight Search Trigger (Cmd + K) */}
            <button
              type="button"
              onClick={() => useSearchStore.getState().openSearch()}
              className="group inline-flex items-center gap-2 rounded-full border border-ink/10 bg-secondary/35 px-3 py-1.5 text-[12px] font-medium text-muted-foreground transition-all hover:border-ink/25 hover:bg-secondary/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              title="Search Gokyo throws, belts, sessions, pages (⌘K or /)">
              <Search className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="text-[12px]">Search</span>
              {/* <kbd className="hidden lg:inline-block rounded border border-ink/15 bg-background/80 px-1.5 py-0.2 font-mono text-[10px] text-muted-foreground/80">
              ⌘K
            </kbd> */}
            </button>

            <ThemeToggle />
            {isCoachOrAdmin ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/30 bg-primary/10 size-11 font-mono text-[10px] uppercase tracking-[0.16em] text-primary transition-all hover:bg-primary/20">
                  <span>DC</span>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/join"
                  className="group inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-[13px] font-semibold text-primary-foreground transition-all hover:bg-primary/90">
                  Join a session
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
                <Link
                  to="/login?returnTo=/dashboard"
                  className="rounded-full px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground">
                  Login
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Header Actions */}
          <div className="flex items-center gap-1.5 md:hidden">
            <button
              type="button"
              onClick={() => useSearchStore.getState().openSearch()}
              className="grid h-10 w-10 place-items-center rounded-full border border-ink/12 text-muted-foreground hover:bg-ink/5 hover:text-foreground"
              aria-label="Search dojo curriculum and pages">
              <Search className="h-4 w-4" />
            </button>
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="grid h-10 w-10 place-items-center rounded-full border border-ink/12 text-foreground"
              aria-label={open ? "Close menu" : "Open menu"}>
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>
      {/* Mobile Drawer */}
      {open && (
        <div className="fixed top-16 w-full border-t border-ink/10 bg-background px-5 pb-6 pt-3 md:hidden  z-60">
          {/* Quick Search Button in Mobile Drawer */}
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              useSearchStore.getState().openSearch();
            }}
            className="mb-3 flex w-full items-center gap-2.5 rounded-xl border border-ink/10 bg-secondary/40 px-3.5 py-2.5 text-left text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary/70 hover:text-foreground">
            <Search className="h-4 w-4 text-primary" />
            <span>Search Gokyo throws, belts, sessions...</span>
          </button>

          {PRIMARY_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                cn(
                  "block border-b border-ink/8 py-3.5 font-display text-lg",
                  isActive ? "text-primary font-semibold" : "text-foreground",
                )
              }>
              {link.label}
            </NavLink>
          ))}

          {/* Mobile Dojo Accordion/Section */}
          <div className="border-b border-ink/8 py-3">
            <button
              type="button"
              onClick={() => setMobileDojoOpen((v) => !v)}
              className="flex w-full items-center justify-between font-display text-lg text-foreground">
              <span>Dojo</span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-muted-foreground transition-transform duration-200",
                  mobileDojoOpen && "rotate-180",
                )}
              />
            </button>

            {mobileDojoOpen && (
              <div className="mt-2 space-y-1 pl-3">
                {DOJO_MENU_ITEMS.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      cn(
                        "block rounded-lg px-3 py-2 text-sm transition-colors",
                        isActive
                          ? "bg-secondary text-primary font-medium"
                          : "text-muted-foreground hover:text-foreground",
                      )
                    }>
                    <span className="block font-medium">{item.label}</span>
                    <span className="block text-[11px] opacity-75">
                      {item.desc}
                    </span>
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          <div className="mt-5 flex flex-col gap-2">
            {isCoachOrAdmin ? (
              <div className="flex flex-col gap-2">
                <Link
                  to="/dashboard"
                  className="rounded-full bg-ink px-5 py-3 text-center text-sm font-medium text-paper flex items-center justify-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span>Dashboard</span>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/join"
                  className="rounded-full bg-primary px-5 py-3 text-center text-sm font-semibold text-primary-foreground">
                  Join a session
                </Link>
                <Link
                  to="/login?returnTo=/dashboard"
                  className="rounded-full border border-ink/15 px-5 py-3 text-center text-sm font-medium">
                  Login
                </Link>
              </div>
            )}
            <div className="mt-2 flex items-center justify-between rounded-full border border-ink/12 px-4 py-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Appearance
              </span>
              <ThemeToggle withLabel />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SiteHeader;
