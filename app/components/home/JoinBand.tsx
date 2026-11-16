import { Link } from "react-router";
import { ArrowUpRight, Check } from "lucide-react";
import Reveal from "@/components/visual/Reveal";

const points = [
  "Loaner gi for your first month",
  "No sparring until you can fall safely",
  "Student dues, university insurance included",
];

const JoinBand = () => (
  <section className="mx-auto max-w-6xl px-5 py-20 lg:px-8 lg:py-24">
    <Reveal>
      <div className="relative overflow-hidden rounded-xl bg-primary px-7 py-12 text-primary-foreground sm:px-12 lg:py-16">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full border border-primary-foreground/20" />
        <div className="pointer-events-none absolute -bottom-24 -left-10 h-72 w-72 rounded-full border border-primary-foreground/15" />
        <div className="animate-sheen pointer-events-none absolute -right-20 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-primary-foreground/25 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:repeating-linear-gradient(135deg,hsl(var(--primary-foreground))_0_1px,transparent_1px_14px)]" />

        <div className="relative grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary-foreground/70">
              Recruitment · 2026 intake
            </p>
            <h2 className="mt-5 max-w-xl font-display text-[clamp(2rem,4.4vw,3.4rem)] font-semibold leading-[0.98] tracking-[-0.03em] text-balance">
              The mat is open. Come once and decide.
            </h2>
            <p className="mt-5 max-w-md text-[14px] leading-relaxed text-primary-foreground/80">
              Turn up in a t-shirt for any Monday session, or send your details
              and a coach will meet you at the door.
            </p>
          </div>

          <div>
            <ul className="space-y-2.5">
              {points.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-2.5 text-[13px] text-primary-foreground/85">
                  <Check className="mt-0.5 h-4 w-4 shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
            <Link
              to="/join"
              className="group mt-7 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-paper transition-transform hover:-translate-y-0.5">
              Sign up for a session
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </Reveal>
  </section>
);

export default JoinBand;
