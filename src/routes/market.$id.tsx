import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChevronLeft, Minus, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { Screen } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { FEIRA_STOPS, ENTREGADORES, getMarket, HANDOFFS, productsOf } from "@/lib/feira";
import { applyCoupon } from "@/lib/data";
import { formatBRL } from "@/lib/format";
import { usePediu } from "@/lib/store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/market/$id")({ component: MarketGrid });

function MarketGrid() {
  const { id } = Route.useParams();
  const market = getMarket(id);
  const navigate = useNavigate();
  const products = productsOf(id);
  const aisles = market?.aisles ?? [];
  const [aisle, setAisle] = useState(aisles[0] ?? "");
  const [query, setQuery] = useState("");
  const [openList, setOpenList] = useState(false);
  const [note, setNote] = useState<(typeof HANDOFFS)[number]>(HANDOFFS[0]);
  const [riderId, setRiderId] = useState(ENTREGADORES[0].id);
  const qty = usePediu((s) => s.feiraQty ?? {});
  const marketId = usePediu((s) => s.feiraMarketId);
  const out = usePediu((s) => s.feiraOut ?? []);
  const stopId = usePediu((s) => s.feiraStopId);
  const setStop = usePediu((s) => s.setFeiraStop);
  const setQty = usePediu((s) => s.setFeiraQty);
  const place = usePediu((s) => s.placeFeira);
  const payment = usePediu((s) => s.payment);
  const setPayment = usePediu((s) => s.setPayment);
  const wallet = usePediu((s) => s.wallet);
  const name = usePediu((s) => s.name);
  const coupon = usePediu((s) => s.coupon);
  const clients = usePediu((s) => s.fiadoClients ?? []);

  const mine = marketId === id ? qty : {};
  const lines = useMemo(
    () =>
      products
        .map((product) => ({ product, count: mine[product.id] ?? 0 }))
        .filter((line) => line.count > 0 && !out.includes(line.product.id)),
    [products, mine, out],
  );
  const subtotal = lines.reduce((sum, line) => sum + line.product.price * line.count, 0);
  const rider = ENTREGADORES.find((item) => item.id === riderId) ?? ENTREGADORES[0];
  const priced = applyCoupon(coupon, subtotal, rider.fee, false, payment);
  const total = market ? Math.max(0, subtotal - priced.discount) + priced.deliveryFee : subtotal;
  const account = clients.find(
    (client) => client.shopId === id && !client.blocked && client.name.trim().toLowerCase() === name.trim().toLowerCase(),
  );
  const room = account ? Math.max(0, account.limit - account.balance) : 0;
  const needle = query.trim().toLowerCase();
  const visible = needle
    ? products.filter((product) => product.name.toLowerCase().includes(needle))
    : products.filter((product) => product.aisle === aisle);

  if (!market) {
    return (
      <Screen>
        <div className="px-6 py-24 text-center">
          <p className="font-display text-xl font-bold">Mercado não encontrado</p>
          <Link to="/market" className="mt-3 inline-block text-sm font-semibold text-primary">
            Ver feira
          </Link>
        </div>
      </Screen>
    );
  }

  return (
    <Screen tabs={false}>
      <main className="px-4 pb-36 pt-[max(0.8rem,env(safe-area-inset-top))]">
        <div className="flex items-center gap-3">
          <Link to="/market" className="grid size-11 place-items-center rounded-full bg-surface shadow-card" aria-label="Voltar">
            <ChevronLeft className="size-5" />
          </Link>
          <div className="min-w-0">
            <p className="font-display text-[11px] font-bold uppercase tracking-wider text-primary">Pediu Entregas</p>
            <h1 className="truncate font-display text-xl font-extrabold leading-tight">{market.name}</h1>
          </div>
        </div>
        <p className="mt-3 text-sm text-muted">
          Grade de {market.keeper}. O que ela marcar em falta some da prateleira na hora.
        </p>

        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="O que falta em casa?"
          className="mt-4 h-12 w-full rounded-full bg-surface px-4 text-sm shadow-card outline-none"
        />

        <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto">
          {aisles.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => setAisle(name)}
              className={
                aisle === name
                  ? "h-9 shrink-0 rounded-full bg-ink px-3 text-xs font-semibold text-ink-fg"
                  : "h-9 shrink-0 rounded-full bg-surface px-3 text-xs font-semibold text-muted shadow-card"
              }
            >
              {name}
            </button>
          ))}
        </div>

        <ul className="mt-4 grid grid-cols-2 gap-2.5">
          {visible.map((product) => {
            const count = mine[product.id] ?? 0;
            const missing = out.includes(product.id);
            return (
              <li key={product.id} className="overflow-hidden rounded-[22px] bg-surface shadow-card">
                <div className="relative">
                  <img src={product.image} alt="" className={cn("h-28 w-full object-cover", missing && "opacity-40")} />
                  {count > 0 ? (
                    <span className="absolute right-2 top-2 grid size-7 place-items-center rounded-full bg-primary font-display text-xs font-bold text-primary-fg">
                      {count}
                    </span>
                  ) : null}
                </div>
                <div className="p-2.5">
                  <p className="font-display text-sm font-semibold leading-tight">{product.name}</p>
                  <p className="mt-0.5 text-xs text-muted">
                    {product.unit}
                    {missing ? " · em falta" : ""}
                  </p>
                  <div className="mt-2 flex items-center justify-between gap-1">
                    <span className="font-display text-sm font-bold tabular-nums">
                      {missing ? "—" : formatBRL(product.price)}
                    </span>
                    {missing ? null : (
                      <span className="flex items-center">
                        <button
                          type="button"
                          aria-label="Diminuir"
                          onClick={() => setQty(market.id, product.id, count - 1)}
                          className="grid size-9 place-items-center rounded-full bg-bg"
                        >
                          <Minus className="size-4" />
                        </button>
                        <button
                          type="button"
                          aria-label="Aumentar"
                          onClick={() => setQty(market.id, product.id, count + 1)}
                          className="grid size-9 place-items-center rounded-full bg-accent text-accent-fg"
                        >
                          <Plus className="size-4" />
                        </button>
                      </span>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        {visible.length === 0 ? <p className="mt-6 text-sm text-muted">Nada com esse nome nesta grade.</p> : null}
      </main>

      {lines.length > 0 ? (
        <div className="fixed bottom-0 left-1/2 z-40 w-full max-w-phone -translate-x-1/2 bg-gradient-to-t from-bg via-bg to-transparent px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
          <Button className="w-full rounded-full" size="lg" onClick={() => setOpenList(true)}>
            Fechar a lista · {formatBRL(total)}
          </Button>
        </div>
      ) : null}

      {openList ? (
        <div className="fixed inset-0 z-50 mx-auto flex max-w-phone items-end bg-ink/50">
          <div className="max-h-[85dvh] w-full overflow-y-auto rounded-t-[28px] bg-bg px-4 pb-[max(1.2rem,env(safe-area-inset-bottom))] pt-4">
            <p className="font-display text-lg font-bold">Combinar com o entregador</p>
            <p className="mt-1 text-sm text-muted">
              O {market.name} separa a grade. O Pediu segura {formatBRL(total)} até {rider.name.split(" ")[0]} retirar no balcão.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              {lines.map((line) => (
                <li key={line.product.id} className="flex justify-between gap-3">
                  <span>
                    {line.count}× {line.product.name}
                  </span>
                  <span className="tabular-nums">{formatBRL(line.product.price * line.count)}</span>
                </li>
              ))}
              <li className="flex justify-between text-muted">
                <span>Entrega · {rider.name.split(" ")[0]}</span>
                <span className="tabular-nums">{formatBRL(priced.deliveryFee)}</span>
              </li>
              {priced.discount > 0 ? (
                <li className="flex justify-between text-primary">
                  <span>{priced.label}</span>
                  <span className="tabular-nums">− {formatBRL(priced.discount)}</span>
                </li>
              ) : null}
            </ul>

            <p className="mt-4 font-display text-sm font-semibold">Pagar com</p>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {(
                [
                  ["pix", "Pix"],
                  ["wallet", "Pay"],
                  ["fiado", "Fiado"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setPayment(id)}
                  className={cn(
                    "h-10 rounded-full text-xs font-bold",
                    payment === id ? "bg-ink text-ink-fg" : "bg-surface text-muted shadow-card",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted">
              {payment === "fiado"
                ? account
                  ? `No nome ${account.name}. Cabe mais ${formatBRL(room)}.`
                  : "O mercado precisa cadastrar o seu nome no fiado."
                : payment === "wallet"
                  ? `Pediu Pay com ${formatBRL(wallet)}.`
                  : "O Pediu segura o Pix até a moto retirar."}
            </p>

            <p className="mt-4 font-display text-sm font-semibold">Deixar em</p>
            <div className="mt-2 grid gap-2">
              {FEIRA_STOPS.map((stop) => (
                <button
                  key={stop.id}
                  type="button"
                  onClick={() => setStop(stop.id)}
                  className={cn(
                    "rounded-[16px] px-3 py-2 text-left text-sm",
                    stopId === stop.id ? "bg-ink text-ink-fg" : "bg-surface shadow-card",
                  )}
                >
                  <span className="block font-semibold">{stop.label}</span>
                  <span className={stopId === stop.id ? "text-xs text-ink-fg/70" : "text-xs text-muted"}>
                    {stop.street} · {stop.neighborhood}
                  </span>
                </button>
              ))}
            </div>

            <p className="mt-4 font-display text-sm font-semibold">Quem busca</p>
            <div className="mt-2 grid gap-2">
              {ENTREGADORES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setRiderId(item.id)}
                  className={cn(
                    "flex items-center gap-3 rounded-[18px] px-3 py-2.5 text-left",
                    riderId === item.id ? "bg-ink text-ink-fg" : "bg-surface shadow-card",
                  )}
                >
                  <span
                    className="grid size-10 shrink-0 place-items-center rounded-full font-display text-sm font-bold text-ink-fg"
                    style={{ background: `hsl(${item.hue} 70% 32%)` }}
                  >
                    {item.name.slice(0, 1)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-sm font-semibold">{item.name}</span>
                    <span className={riderId === item.id ? "text-xs text-ink-fg/70" : "text-xs text-muted"}>
                      {item.vehicle} · {item.eta}
                    </span>
                  </span>
                  <span className="font-display text-sm font-bold tabular-nums">{formatBRL(item.fee)}</span>
                </button>
              ))}
            </div>

            <p className="mt-4 font-display text-sm font-semibold">Quando buscar</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {HANDOFFS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setNote(item)}
                  className={cn(
                    "h-9 rounded-full px-3 text-xs font-semibold",
                    note === item ? "bg-accent text-accent-fg" : "bg-surface text-muted shadow-card",
                  )}
                >
                  {item}
                </button>
              ))}
            </div>

            <Button
              className="mt-5 w-full rounded-full"
              size="lg"
              onClick={() => {
                if (payment === "wallet" && wallet < total) {
                  toast.error("Saldo insuficiente na Pediu Pay");
                  return;
                }
                if (payment === "fiado" && !account) {
                  toast.error("Peça o mercado cadastrar seu nome no fiado");
                  return;
                }
                if (payment === "fiado" && account && account.balance + total > account.limit) {
                  toast.error("Passou do limite de fiado");
                  return;
                }
                const order = place(note, rider.id);
                if (!order) return;
                toast.success(`Combinado com ${rider.name.split(" ")[0]}`);
                void navigate({ to: "/order/$id", params: { id: order.id } });
              }}
            >
              Combinar com {rider.name.split(" ")[0]} · {formatBRL(total)}
            </Button>
            <button type="button" onClick={() => setOpenList(false)} className="mt-2 h-11 w-full text-sm font-semibold text-muted">
              Voltar à grade
            </button>
          </div>
        </div>
      ) : null}
    </Screen>
  );
}
