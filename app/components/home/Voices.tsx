import Reveal from "@/components/visual/Reveal";
import SectionBackdrop from "@/components/visual/SectionBackdrop";
import { VOICES } from "@/lib/data/club";

const Voices = () => (
  <section className="relative overflow-hidden border-y border-ink/10 bg-secondary/40">
    <SectionBackdrop variant="weave" />
    <div className="relative mx-auto max-w-6xl px-5 py-20 lg:px-8 lg:py-24">
      <p className="font-mono text-[10px] uppercase tracking-[0.34em] text-primary">
        From the mat
      </p>
      <div className="mt-10 grid gap-10 md:grid-cols-3">
        {VOICES.map((voice, i) => (
          <Reveal key={voice.name} delay={i * 0.08}>
            <figure className="flex h-full flex-col">
              <span
                aria-hidden="true"
                className="font-display text-[44px] leading-[0.6] text-primary/30">
                “
              </span>
              <blockquote className="mt-3 font-display text-[19px] leading-[1.45] tracking-[-0.01em] text-balance">
                “{voice.quote}”
              </blockquote>
              <figcaption className="mt-auto flex items-center gap-3 pt-7">
                <span className="grid h-8 w-8 place-items-center rounded-full border border-ink/25 font-mono text-[10px]">
                  {voice.name}
                </span>
                <span className="font-mono text-[9px] uppercase leading-relaxed tracking-[0.16em] text-muted-foreground">
                  {voice.detail}
                </span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export default Voices;
