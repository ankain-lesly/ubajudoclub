import { motion } from "framer-motion";
import { Image } from "@/components/ui/image";
import Reveal from "@/components/visual/Reveal";
import Aura from "@/components/visual/Aura";
import SectionBackdrop from "@/components/visual/SectionBackdrop";

const GRIP_IMAGE =
  "/images/132f87024_generated_5ca68e15.avif";

const notes = [
  {
    n: "01",
    title: "Tsurite — the lapel",
    body: "Fingers inside the collar, thumb and index taking the seam. It steers the partner and builds the collar grip for every forward throw.",
  },
  {
    n: "02",
    title: "Hikite — the sleeve",
    body: "The second hand owns the sleeve, just below the elbow. It pulls, lifts and turns — half of the throw is decided here.",
  },
  {
    n: "03",
    title: "Kuzushi — the tension",
    body: "Before the entry there is a moment of quiet pull. Break the balance first; the technique only finishes what the grip started.",
  },
];

const markers = [
  { n: "01", x: "20%", y: "30%" },
  { n: "02", x: "74%", y: "44%" },
  { n: "03", x: "47%", y: "74%" },
];

const KumiKata = () => (
  <section className="relative overflow-hidden border-y border-ink/10">
    <SectionBackdrop variant="hatch" className="opacity-70" />
    <Aura className="opacity-70" />
    <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-8 lg:py-28">
      <Reveal>
        <figure className="relative overflow-hidden rounded-xl border border-ink/12 bg-band">
          <Image
            src={GRIP_IMAGE}
            alt="Close view of two judoka gripping gi lapel and sleeve — kumi-kata"
            className="h-[320px] w-full grayscale contrast-105 sm:h-[420px] lg:h-[520px]"
            fittingType="fill"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-band/45 via-transparent to-transparent" />
          {markers.map((marker, i) => (
            <motion.span
              key={marker.n}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: 0.35 + i * 0.15 }}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: marker.x, top: marker.y }}>
              <span className="relative grid h-9 w-9 place-items-center rounded-full border border-band-foreground/60 bg-band/55 font-mono text-[10px] text-band-foreground backdrop-blur-sm">
                {marker.n}
                <span className="absolute inset-0 animate-ping rounded-full border border-band-foreground/30 [animation-duration:3.4s]" />
              </span>
            </motion.span>
          ))}
          <figcaption className="absolute inset-x-0 bottom-0 flex items-baseline justify-between gap-4 px-4 pb-4 font-mono text-[8.5px] uppercase tracking-[0.2em] text-band-foreground/70 sm:px-6">
            <span>Kumi-kata study</span>
            <span>Bambili dojo</span>
          </figcaption>
        </figure>
      </Reveal>

      <div>
        <Reveal delay={0.05}>
          <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.32em] text-primary">
            <span className="h-px w-8 bg-primary" />
            Where judo actually begins
          </p>
          <h2 className="mt-6 max-w-lg font-display text-[clamp(2rem,4vw,3.2rem)] font-semibold leading-[0.98] tracking-[-0.03em] text-balance">
            Before the first throw, the grip.
          </h2>
          <p className="mt-6 max-w-md text-[14.5px] leading-relaxed text-muted-foreground">
            Every new member spends their opening weeks on kumi-kata — where the
            hands go, how much they pull, and how to read the answer. It is the
            least photographed part of the sport and the one that decides every
            randori.
          </p>
        </Reveal>

        <div className="mt-10 divide-y divide-ink/12 border-y border-ink/12">
          {notes.map((note, i) => (
            <Reveal key={note.n} delay={0.08 + i * 0.07}>
              <div className="group grid grid-cols-[auto_1fr] gap-x-5 py-5">
                <span className="font-mono text-[10px] tracking-[0.24em] text-primary">
                  {note.n}
                </span>
                <div>
                  <h3 className="font-display text-[17px] font-semibold tracking-[-0.01em] transition-colors group-hover:text-primary">
                    {note.title}
                  </h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
                    {note.body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default KumiKata;
