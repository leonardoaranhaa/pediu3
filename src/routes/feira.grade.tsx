import { createFileRoute } from "@tanstack/react-router";
import { LaneBar } from "@/components/lane-bar";
import { PhoneFrame } from "@/components/shell";
import { FEIRA_MARKETS, getMarket, productsOf } from "@/lib/feira";
import { formatBRL } from "@/lib/format";
import { usePediu } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/feira/grade")({ component: GradePage });

function GradePage() {
  const out = usePediu((s) => s.feiraOut ?? []);
  const toggle = usePediu((s) => s.toggleFeiraOut);
  const shopId = usePediu((s) => s.feiraShopId);
  const setShop = usePediu((s) => s.setFeiraShop);
  const shop = getMarket(shopId) ?? FEIRA_MARKETS[0];
  const products = productsOf(shop.id);

  return (
    <PhoneFrame>
      <div className="flex min-h-dvh flex-col">
        <main className="flex-1 px-4 pb-6 pt-[max(0.9rem,env(safe-area-inset-top))]">
          <p className="font-display text-[11px] font-bold uppercase tracking-wider text-primary">Pediu Entregas</p>
          <h1 className="mt-1 font-display text-2xl font-extrabold leading-none">Grade</h1>
          <p className="mt-1 text-sm text-muted">O que o cliente vê em {shop.name}. Toque para tirar da prateleira.</p>
          <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto">
            {FEIRA_MARKETS.map((market) => (
              <button
                key={market.id}
                type="button"
                onClick={() => setShop(market.id)}
                className={cn(
                  "h-9 shrink-0 rounded-full px-3 text-xs font-semibold",
                  shop.id === market.id ? "bg-ink text-ink-fg" : "bg-surface text-muted shadow-card",
                )}
              >
                {market.name}
              </button>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            {products.map((product) => {
              const missing = out.includes(product.id);
              return (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => toggle(product.id)}
                  className={cn(
                    "overflow-hidden rounded-[22px] text-left shadow-card",
                    missing ? "bg-ink text-ink-fg" : "bg-surface",
                  )}
                >
                  <img src={product.image} alt="" className={cn("h-24 w-full object-cover", missing && "opacity-40")} />
                  <span className="block p-2.5">
                    <span className="block font-display text-sm font-semibold leading-tight">{product.name}</span>
                    <span className={cn("mt-0.5 block text-xs", missing ? "text-ink-fg/70" : "text-muted")}>
                      {product.aisle} · {product.unit}
                    </span>
                    <span className="mt-2 block text-xs font-bold">{missing ? "Em falta" : formatBRL(product.price)}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </main>
        <LaneBar lane="feira" />
      </div>
    </PhoneFrame>
  );
}
