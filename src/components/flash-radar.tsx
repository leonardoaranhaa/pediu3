import { Link } from "@tanstack/react-router";
import { Zap } from "lucide-react";
import { flashRestaurants } from "@/lib/data";

export function FlashRadar() {
  const flash = flashRestaurants().filter((r) => r.id !== "mercado-pediu");
  return (
    <Link
      to="/search"
      search={{ q: "flash" }}
      className="relative mt-3 block overflow-hidden rounded-[28px] bg-ink text-ink-fg shadow-ink"
    >
      <svg viewBox="0 0 360 148" className="block w-full" aria-hidden="true">
        <rect width="360" height="148" fill="#111111" />
        <g fill="none" stroke="#2a241c" strokeWidth="8">
          <path d="M0 44 H360" />
          <path d="M0 92 H360" />
          <path d="M70 0 V148" />
          <path d="M180 0 V148" />
          <path d="M290 0 V148" />
        </g>
        <circle cx="180" cy="76" r="54" className="radar-ring" fill="none" stroke="#ffc400" strokeWidth="1.5" />
        <circle cx="180" cy="76" r="28" className="radar-ring-delay" fill="none" stroke="#e20d2a" strokeWidth="1.2" />
        <circle cx="180" cy="76" r="6" fill="#ffc400" />
        <g className="radar-sweep" style={{ transformOrigin: "180px 76px" }}>
          <path d="M180 76 L180 22" stroke="#ffc400" strokeWidth="2" opacity="0.85" />
        </g>
        <circle cx="118" cy="52" r="5" fill="#e20d2a" className="pin-pulse" />
        <circle cx="248" cy="96" r="5" fill="#ffc400" className="pin-pulse-delay" />
        <circle cx="214" cy="40" r="4" fill="#e20d2a" className="pin-pulse" />
      </svg>
      <div className="pointer-events-none absolute inset-0 flex items-end justify-between p-4">
        <div>
          <p className="inline-flex items-center gap-1 font-display text-[11px] font-bold uppercase tracking-wider text-accent">
            <Zap className="size-3.5 fill-accent" />
            Radar Flash
          </p>
          <p className="mt-1 font-display text-lg font-bold leading-tight">{flash.length} motos a menos de 1 km</p>
          <p className="text-xs text-ink-fg/65">Toque pra pedir o que chega agora</p>
        </div>
      </div>
    </Link>
  );
}
