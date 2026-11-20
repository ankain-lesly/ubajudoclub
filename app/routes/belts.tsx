import { Link } from "react-router";
import { ArrowUpRight } from "lucide-react";
import SectionHeading from "@/components/visual/SectionHeading";
import Reveal from "@/components/visual/Reveal";
import Aura from "@/components/visual/Aura";
import RingField from "@/components/visual/RingField";
import HeroBackdrop from "@/components/visual/HeroBackdrop";
import heroBeltDiscipline from "@/assets/images/hero-belt-discipline.jpg";
import SpotlightCard from "@/components/visual/SpotlightCard";
import BeltLadder from "@/components/home/BeltLadder";
import BeltBar from "@/components/visual/BeltBar";
import { BELTS } from "@/lib/data/club";

const steps = [
  {
    n: "01",
    title: "Session target",
    body: "Every attendance is logged at the door. The count towards your next rank runs continuously, term after term.",
  },
  {
    n: "02",
    title: "Technical board",
    body: "At target, a coach reviews your ukemi, throws, groundwork and mat etiquette against the syllabus for that kyu.",
  },
  {
    n: "03",
    title: "Grading day",
    body: "Assessments run in the last week of term. Pass and you are awarded the belt on the mat, with the club watching.",
  },
];

const Belts = () => (
  <div>
    <section className="relative overflow-hidden border-b border-ink/10">
      {/* Cinematic Belt Tying & Discipline Background */}
      <HeroBackdrop
        src={heroBeltDiscipline}
        imageClassName="object-[center_35%]"
        opacityClassName="opacity-55 dark:opacity-65"
      />
      <Aura grid={false} />
      <div className="pointer-events-none absolute -right-44 -top-36 hidden h-[560px] w-[560px] opacity-70 lg:block">
        <RingField />
      </div>
      <div className="relative mx-auto grid max-w-6xl gap-10 px-5 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:px-8 lg:py-24">
        <Reveal>
          <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.32em] text-primary">
            <span className="h-px w-8 bg-primary" />
            Kyu to Dan
          </p>
          <h1 className="mt-6 font-display text-[clamp(2.4rem,5.5vw,4.2rem)] font-semibold leading-[0.94] tracking-[-0.035em] text-balance">
            Seven belts, each with a number in front of it.
          </h1>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="text-[15px] leading-relaxed text-muted-foreground">
            Grading at UBa Judo is continuous, not seasonal guesswork.
            Attendance is the spine of it — the technical assessment then
            decides the day.
          </p>
        </Reveal>
      </div>
    </section>

    <BeltLadder />

    <section className="border-y border-ink/10 bg-secondary/40">
      <div className="mx-auto max-w-6xl px-5 py-20 lg:px-8 lg:py-24">
        <Reveal>
          <SectionHeading
            eyebrow="How a belt is earned"
            title="Three steps, no shortcuts."
          />
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {steps.map((step, i) => (
            <Reveal key={step.n} delay={i * 0.08}>
              <SpotlightCard className="h-full rounded-lg border border-ink/12 bg-card p-7 transition-colors duration-500 hover:border-ink/30">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-1 -top-7 font-display text-[80px] font-semibold leading-none text-ink/[0.045] transition-colors duration-500 group-hover/spot:text-primary/[0.12]">
                  {step.n}
                </span>
                <span className="relative font-mono text-[10px] tracking-[0.3em] text-primary">
                  {step.n}
                </span>
                <h3 className="relative mt-7 font-display text-lg font-semibold tracking-[-0.01em]">
                  {step.title}
                </h3>
                <p className="relative mt-3 text-[13px] leading-relaxed text-muted-foreground">
                  {step.body}
                </p>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-6xl px-5 py-20 lg:px-8 lg:py-24">
      <Reveal>
        <div className="overflow-hidden rounded-lg border border-ink/12">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-band text-band-foreground">
              <tr className="font-mono text-[9px] uppercase tracking-[0.2em]">
                <th className="px-5 py-4 font-normal">Rank</th>
                <th className="px-5 py-4 font-normal">Grade</th>
                <th className="px-5 py-4 font-normal">Sessions</th>
                <th className="hidden px-5 py-4 font-normal sm:table-cell">
                  Technical focus
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10 bg-card">
              {BELTS.map((belt) => (
                <tr
                  key={belt.rank}
                  className="group transition-colors duration-300 hover:bg-secondary/50">
                  <td className="whitespace-nowrap px-5 py-4">
                    <Link
                      to={`/belts/${belt.rank.toLowerCase()}`}
                      className="flex items-center gap-3 font-medium transition-colors group-hover:text-primary">
                      <BeltBar rank={belt.rank} className="h-5 w-auto" />
                      <span>{belt.rank}</span>
                      <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                    </Link>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">
                    {belt.kyu}
                  </td>
                  <td className="px-5 py-4 font-mono tabular-nums">
                    {belt.sessions}
                  </td>
                  <td className="hidden px-5 py-4 text-muted-foreground sm:table-cell">
                    <Link
                      to={`/belts/${belt.rank.toLowerCase()}`}
                      className="transition-colors hover:text-foreground">
                      {belt.focus}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <div className="relative mt-10 flex flex-wrap items-center justify-between gap-5 overflow-hidden rounded-lg bg-primary px-7 py-7 text-primary-foreground">
          <div className="pointer-events-none absolute -right-10 -top-14 h-48 w-48 rounded-full bg-primary-foreground/20 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:repeating-linear-gradient(135deg,hsl(var(--primary-foreground))_0_1px,transparent_1px_14px)]" />
          <p className="relative max-w-md font-display text-xl font-semibold leading-snug tracking-[-0.015em]">
            Targets are a floor, not a promise. The mat decides the rest.
          </p>
          <Link
            to="/join"
            className="group relative inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-[13px] font-semibold text-paper">
            Start at white belt
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </Reveal>
    </section>
  </div>
);

export default Belts;
