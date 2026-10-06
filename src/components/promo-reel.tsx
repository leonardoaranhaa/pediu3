import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { PROMOS, type Promo } from "@/lib/data";
import { cn } from "@/lib/utils";

export function PromoReel() {
  const scroller = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const id = window.setInterval(() => {
      const next = (i + 1) % PROMOS.length;
      const child = el.children[next] as HTMLElement | undefined;
      if (child) el.scrollTo({ left: child.offsetLeft - 16, behavior: "smooth" });
      setI(next);
    }, 4200);
    return () => window.clearInterval(id);
  }, [i]);

  return (
    <section className="mt-5">
      <div
        ref={scroller}
        className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto px-4"
        onScroll={(e) => {
          const el = e.currentTarget;
          const idx = Math.round(el.scrollLeft / Math.max(el.clientWidth - 32, 1));
          if (idx !== i && idx >= 0 && idx < PROMOS.length) setI(idx);
        }}
      >
        {PROMOS.map((p) => (
          <PromoCard key={p.id} promo={p} />
        ))}
      </div>
      <div className="mt-2.5 flex justify-center gap-1.5">
        {PROMOS.map((p, n) => (
          <span
            key={p.id}
            className={cn(
              "h-1.5 rounded-full transition-[width,background-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
              n === i ? "w-5 bg-primary" : "w-1.5 bg-border-strong",
            )}
          />
        ))}
      </div>
    </section>
  );
}

function PromoCard({ promo }: { promo: Promo }) {
  const inner = (
    <article
      className={cn(
        "relative h-36 overflow-hidden rounded-[28px] text-left shadow-card",
        promo.tone === "accent" && "bg-accent text-accent-fg",
        promo.tone === "primary" && "bg-primary text-primary-fg",
        promo.tone === "ink" && "bg-ink text-ink-fg",
      )}
    >
      <img src={promo.image} alt="" className="absolute inset-0 size-full object-cover opacity-35 mix-blend-luminosity" />
      <div
        className={cn(
          "absolute inset-0",
          promo.tone === "accent" && "bg-gradient-to-r from-accent via-accent/80 to-transparent",
          promo.tone === "primary" && "bg-gradient-to-r from-primary via-primary/80 to-transparent",
          promo.tone === "ink" && "bg-gradient-to-r from-ink via-ink/80 to-transparent",
        )}
      />
      <div className="relative flex h-full flex-col justify-end p-4">
        <p className="font-display text-[11px] font-bold uppercase tracking-wider opacity-80">{promo.kicker}</p>
        <p className="mt-1 font-display text-xl font-extrabold leading-tight">{promo.title}</p>
        <p className="mt-1 text-xs opacity-80">{promo.subtitle}</p>
      </div>
    </article>
  );

  const wrap = (node: ReactNode) => (
    <div className="w-[min(100%,20.5rem)] shrink-0 snap-start">{node}</div>
  );

  if (promo.to === "/search") {
    return wrap(
      <Link to="/search" search={{ q: promo.q }} className="block">
        {inner}
      </Link>,
    );
  }
  if (promo.to === "/market") {
    return wrap(
      <Link to="/market" className="block">
        {inner}
      </Link>,
    );
  }
  if (promo.to === "/taste") {
    return wrap(
      <Link to="/taste" className="block">
        {inner}
      </Link>,
    );
  }
  if (promo.to === "/club") {
    return wrap(
      <Link to="/club" className="block">
        {inner}
      </Link>,
    );
  }
  return wrap(
    <Link to="/" className="block">
      {inner}
    </Link>,
  );
}
