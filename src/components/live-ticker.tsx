import { Link } from "@tanstack/react-router";
import { flashRestaurants, getAddress } from "@/lib/data";
import { usePediu } from "@/lib/store";

export function LiveTicker() {
  const addressId = usePediu((s) => s.addressId);
  const neighborhood = getAddress(addressId).neighborhood;
  const fastest = flashRestaurants()
    .filter((r) => r.id !== "mercado-pediu")
    .slice()
    .sort((a, b) => a.deliveryMax - b.deliveryMax)[0];
  const mins = fastest?.deliveryMax ?? 12;
  const lines = [
    `Moto livre a 620 m · Flash 99 · ${mins} min`,
    `${neighborhood} · motos na rua agora`,
    "Smash Club · taxa grátis no Flash",
    "Mercado Pediu · 25 min na Consolação",
    "PEDIU10 · 10% acima de R$ 40",
  ];

  return (
    <Link
      to="/search"
      search={{ q: "flash" }}
      className="mt-4 block overflow-hidden border-y border-border bg-accent/35 py-2"
      aria-label="Flash 99 ao vivo"
    >
      <div className="marquee-track gap-10 pr-10 text-[11px] font-semibold tracking-wide text-fg">
        {[...lines, ...lines].map((line, i) => (
          <span key={`${line}-${i}`} className="shrink-0">
            {line}
          </span>
        ))}
      </div>
    </Link>
  );
}
