import { Image } from "@/components/ui/image";
import Reveal from "@/components/visual/Reveal";

const HERO_IMAGE =
  "/images/1ea126a4b_generated_image.avif";

const MatBand = () => (
  <section className="mx-auto max-w-6xl px-5 pt-4 lg:px-8">
    <Reveal>
      <figure className="relative overflow-hidden rounded-xl border border-ink/10">
        <Image
          src={HERO_IMAGE}
          alt="Two UBa judo athletes mid-throw on the tatami in UBa Campus Amphi 100"
          className="h-[280px] w-full transition-transform duration-1000 ease-out hover:scale-[1.03] sm:h-[400px] lg:h-[500px]"
          fittingType="fill"
        />
        <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-band/90 via-band/40 to-transparent p-6 sm:p-10">
          <p className="max-w-lg font-display text-[clamp(1.15rem,2.2vw,1.7rem)] font-medium leading-snug text-band-foreground text-balance">
            “You learn the fall before the throw. Everything else at this club
            follows from that.”
          </p>
          <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.24em] text-band-foreground/60">
            UBa Campus Amphi 100 · Friday ne-waza
          </p>
        </figcaption>
      </figure>
    </Reveal>
  </section>
);

export default MatBand;
