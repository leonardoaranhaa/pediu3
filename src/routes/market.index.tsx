import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, ShoppingBasket } from "lucide-react";
import { Screen } from "@/components/shell";
import { FEIRA_MARKETS, FEIRA_TOWN } from "@/lib/feira";
import { usePediu } from "@/lib/store";

export const Route = createFileRoute("/market/")({ component: MarketPage });

function MarketPage() {
  const qty = usePediu((s) => s.feiraQty ?? {});
  const marketId = usePediu((s) => s.feiraMarketId);
  const count = Object.values(qty).reduce((sum, n) => sum + n, 0);
  const open = FEIRA_MARKETS.find((market) => market.id === marketId);

  return (
    <Screen>
      <main className="px-4 pb-8 pt-[max(0.9rem,env(safe-area-inset-top))]">
        <p className="font-display text-[11px] font-bold uppercase tracking-wider text-primary">Pediu Entregas · {FEIRA_TOWN}</p>
        <h1 className="mt-1 font-display text-3xl font-extrabold leading-none">Mercados da cidade</h1>
        <p className="mt-2 max-w-[22rem] text-sm text-muted">
          O mercado abre a grade. Você marca o que falta em casa. Um entregador da cidade busca no balcão e deixa na porta. O Pediu segura o pagamento até a retirada.
        </p>

        <ol className="mt-4 grid grid-cols-3 gap-2">
          {[
            ["1", "Grade"],
            ["2", "Sua lista"],
            ["3", "Entregador"],
          ].map(([n, label]) => (
            <li key={n} className="rounded-[18px] bg-surface px-2 py-3 text-center shadow-card">
              <span className="font-display text-lg font-extrabold text-primary">{n}</span>
              <span className="mt-1 block text-[11px] font-semibold">{label}</span>
            </li>
          ))}
        </ol>

        <div className="mt-5 grid gap-3">
          {FEIRA_MARKETS.map((market) => (
            <Link
              key={market.id}
              to="/market/$id"
              params={{ id: market.id }}
              className="overflow-hidden rounded-[24px] bg-surface shadow-card transition-transform duration-150 ease-out active:scale-[0.98]"
            >
              <img src={market.image} alt="" className="h-28 w-full object-cover" />
              <div className="p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-base font-bold leading-tight">{market.name}</p>
                    <p className="mt-0.5 text-xs text-muted">{market.keeper}</p>
                  </div>
                  <p className="font-display text-xs font-bold">Combinar</p>
                </div>
                <p className="mt-2 text-sm text-muted">{market.blurb}</p>
                <p className="mt-2 inline-flex items-center gap-1 text-xs font-semibold">
                  <MapPin className="size-3.5 text-primary" />
                  {market.street} · {market.km.toFixed(1)} km
                </p>
              </div>
            </Link>
          ))}
        </div>
      </main>
      {count > 0 && open ? (
        <div className="sticky bottom-20 z-30 px-4">
          <Link
            to="/market/$id"
            params={{ id: open.id }}
            className="flex items-center justify-between rounded-[22px] bg-primary px-4 py-3 text-primary-fg shadow-red"
          >
            <span className="inline-flex items-center gap-2 font-display text-sm font-semibold">
              <ShoppingBasket className="size-4" />
              Lista no {open.name}
            </span>
            <span className="font-display text-sm font-bold tabular-nums">{count}</span>
          </Link>
        </div>
      ) : null}
    </Screen>
  );
}
