interface TickerProps {
  items: string[];
}

const Ticker = ({ items }: TickerProps) => {
  const row = [...items, ...items];
  return (
    <div className="overflow-hidden border-y border-ink/15 bg-band py-3.5">
      <div className="flex w-max animate-marquee items-center">
        {row.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="flex items-center whitespace-nowrap">
            <span className="px-7 font-mono text-[10px] uppercase tracking-[0.34em] text-band-foreground/75">
              {item}
            </span>
            <span className="h-1.5 w-1.5 rotate-45 bg-primary" />
          </span>
        ))}
      </div>
    </div>
  );
};

export default Ticker;
