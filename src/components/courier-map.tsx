import { Bike, House, Store } from "lucide-react";
import type { OrderStatus } from "@/lib/store";
import { cn } from "@/lib/utils";

const PATH = "M 36 210 C 90 180, 70 120, 130 110 S 210 70, 250 96 S 310 150, 348 86";

export function CourierMap({ status }: { status: OrderStatus }) {
  const moving = status === "on_the_way" || status === "arriving";
  const done = status === "delivered";
  const kitchen = status === "received" || status === "preparing";

  return (
    <div className="relative overflow-hidden rounded-[28px] bg-ink shadow-ink">
      <svg viewBox="0 0 390 260" className="block aspect-[390/260] w-full" aria-hidden="true">
        <defs>
          <linearGradient id="mapGlow" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffc400" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#e20d2a" stopOpacity="0.12" />
          </linearGradient>
        </defs>
        <rect width="390" height="260" fill="#1a1612" />
        <rect width="390" height="260" fill="url(#mapGlow)" />
        <g stroke="#3d3428" strokeWidth="14" fill="none">
          <path d="M0 70 H390" />
          <path d="M0 140 H390" />
          <path d="M0 200 H390" />
          <path d="M70 0 V260" />
          <path d="M160 0 V260" />
          <path d="M250 0 V260" />
          <path d="M330 0 V260" />
        </g>
        <g stroke="#5c5348" strokeWidth="2" strokeDasharray="8 12" fill="none">
          <path d="M0 70 H390" />
          <path d="M0 140 H390" />
          <path d="M160 0 V260" />
        </g>
        <rect x="86" y="84" width="52" height="38" rx="6" fill="#245c3a" />
        <rect x="268" y="154" width="46" height="32" rx="6" fill="#245c3a" />
        <rect x="178" y="168" width="40" height="28" rx="6" fill="#3a2a1c" />
        <circle cx="210" cy="48" r="18" fill="#ffc400" opacity="0.14" />
        <text x="78" y="58" fill="#cbbba8" fontSize="11" fontFamily="Manrope, sans-serif">
          Augusta
        </text>
        <text x="236" y="128" fill="#cbbba8" fontSize="11" fontFamily="Manrope, sans-serif">
          Consolação
        </text>
        <path d={PATH} fill="none" stroke="#ffc400" strokeWidth="4" strokeDasharray="7 9" opacity="0.55" />
        <path
          d={PATH}
          fill="none"
          stroke="#e20d2a"
          strokeWidth="4"
          strokeDasharray="240"
          strokeDashoffset="240"
          style={{ animation: moving ? "dash-draw 7.5s var(--ease-out-soft) infinite alternate" : undefined }}
        />
        <g>
          <circle cx="36" cy="210" r="16" fill="#ffc400" opacity="0.22" className={kitchen ? "pin-pulse" : undefined} />
          <circle cx="36" cy="210" r="8" fill="#ffc400" />
        </g>
        <g>
          <circle cx="348" cy="86" r="16" fill="#e20d2a" opacity="0.25" className="pin-pulse-delay" />
          <circle cx="348" cy="86" r="8" fill="#e20d2a" />
        </g>
        {kitchen ? (
          <g>
            <circle cx="36" cy="196" r="4" fill="#fff4e8" opacity="0.55" className="steam" />
            <circle cx="44" cy="192" r="3" fill="#fff4e8" opacity="0.4" className="steam steam-delay" />
          </g>
        ) : null}
      </svg>

      <div
        className={cn(
          "pointer-events-none absolute size-9",
          moving && "courier-ride",
          !moving && !done && "left-[6%] top-[72%]",
          done && "right-[8%] top-[24%]",
        )}
      >
        <span className="grid size-9 place-items-center rounded-full bg-accent text-accent-fg shadow-float">
          <Bike className="size-4" />
        </span>
      </div>

      <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-ink/80 px-2.5 py-1 text-[11px] font-semibold text-ink-fg backdrop-blur-sm">
        <Store className="size-3.5 text-accent" />
        Loja
      </div>
      <div className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-ink/80 px-2.5 py-1 text-[11px] font-semibold text-ink-fg backdrop-blur-sm">
        <House className="size-3.5 text-primary" />
        Você
      </div>
      {moving ? (
        <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-6 items-center gap-1 rounded-full bg-accent px-2.5 py-1 font-display text-[11px] font-bold text-accent-fg">
          <Bike className="size-3.5" />
          a caminho
        </div>
      ) : null}
      {kitchen ? (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-6 rounded-full bg-primary px-2.5 py-1 font-display text-[11px] font-bold text-primary-fg">
          {status === "received" ? "na cozinha" : "no fogão"}
        </div>
      ) : null}
    </div>
  );
}
