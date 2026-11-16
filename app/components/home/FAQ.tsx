import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import Reveal from "@/components/visual/Reveal";
import SectionHeading from "@/components/visual/SectionHeading";
import SectionBackdrop from "@/components/visual/SectionBackdrop";
import { FAQS } from "@/lib/data/club";
import { cn } from "@/lib/utils";

const Faq = () => {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="relative overflow-hidden border-t border-ink/10 bg-background">
      <SectionBackdrop variant="grid" />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-5 py-20 lg:grid-cols-[0.8fr_1.2fr] lg:px-8 lg:py-28">
        <Reveal>
          <SectionHeading
            eyebrow="Before you come"
            title="Questions from the door."
          />
        </Reveal>

        <Reveal delay={0.08}>
          <div className="divide-y divide-ink/12 border-y border-ink/12">
            {FAQS.map((item, i) => {
              const isOpen = open === i;
              return (
                <div key={item.q}>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-start justify-between gap-6 py-5 text-left"
                    aria-expanded={isOpen}>
                    <span
                      className={cn(
                        "font-display text-[17px] font-medium tracking-[-0.01em] transition-colors",
                        isOpen ? "text-primary" : "text-foreground",
                      )}>
                      {item.q}
                    </span>
                    {isOpen ? (
                      <Minus className="mt-1 h-4 w-4 shrink-0 text-primary" />
                    ) : (
                      <Plus className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
                    )}
                  </button>
                  <div
                    className={cn(
                      "grid transition-all duration-300",
                      isOpen
                        ? "grid-rows-[1fr] pb-6 opacity-100"
                        : "grid-rows-[0fr] opacity-0",
                    )}>
                    <p className="overflow-hidden pr-8 text-[13.5px] leading-relaxed text-muted-foreground">
                      {item.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default Faq;
