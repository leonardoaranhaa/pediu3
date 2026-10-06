import { Link } from "@tanstack/react-router";
import { Timer, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { FLASH_DEALS, getRestaurant } from "@/lib/data";

function remainLabel(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function DealsStrip() {
  const [remain, setRemain] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setRemain(20 * 60 * 1000 - (Date.now() % (20 * 60 * 1000)));
    tick();
    const t = window.setInterval(tick, 1000);
    return () => window.clearInterval(t);
  }, []);

  return (
    <section className="mt-5">
      <div className="mb-3 flex items-end justify-between px-4">
        <div>
          <p className="inline-flex items-center gap-1 font-display text-xs font-bold uppercase tracking-wider text-primary">
            <Zap className="size-3.5 fill-primary" />
            Relâmpago
          </p>
          <h2 className="font-display text-lg font-bold">Ofertas que correm</h2>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-ink px-2.5 py-1 font-display text-[11px] font-bold tabular-nums text-ink-fg">
          <Timer className="size-3.5 text-accent" />
          {remain === null ? "--:--" : remainLabel(remain)}
        </span>
      </div>
      <div className="no-scrollbar flex gap-3 overflow-x-auto px-4">
        {FLASH_DEALS.map((d) => {
          const r = getRestaurant(d.restaurantId);
          if (!r) return null;
          return (
            <Link
              key={d.restaurantId}
              to="/restaurants/$id"
              params={{ id: r.id }}
              className="w-[11.5rem] shrink-0 overflow-hidden rounded-[22px] bg-surface shadow-card transition-transform duration-150 ease-out active:scale-[0.97]"
            >
              <div className="relative h-24">
                <img src={r.image} alt="" className="size-full object-cover" />
                <span className="absolute left-2 top-2 rounded-full bg-primary px-2 py-0.5 font-display text-[11px] font-bold text-primary-fg">
                  −{d.off}%
                </span>
              </div>
              <div className="p-2.5">
                <p className="truncate font-display text-sm font-semibold">{r.name}</p>
                <p className="mt-0.5 truncate text-[11px] text-muted">{d.dish}</p>
                <p className="mt-1 text-[11px] font-semibold text-success">Flash · taxa grátis</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
