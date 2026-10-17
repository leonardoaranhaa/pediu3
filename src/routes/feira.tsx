import { createFileRoute, Link } from "@tanstack/react-router";
import { Store } from "lucide-react";
import { LaneBar } from "@/components/lane-bar";
import { PhoneFrame } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { formatBRL } from "@/lib/format";
import { FEIRA_MARKETS, getMarket } from "@/lib/feira";
import { type TicketStatus } from "@/lib/lane";
import { usePediu } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/feira")({ component: FeiraBalcao });

const COLUMNS: { id: TicketStatus; label: string }[] = [
  { id: "new", label: "Listas novas" },
  { id: "preparing", label: "Separando" },
  { id: "ready", label: "No balcão" },
];

function FeiraBalcao() {
  const tickets = usePediu((s) => s.tickets ?? []);
  const accept = usePediu((s) => s.acceptTicket);
  const reject = usePediu((s) => s.rejectTicket);
  const ready = usePediu((s) => s.readyTicket);
  const shopId = usePediu((s) => s.feiraShopId);
  const setShop = usePediu((s) => s.setFeiraShop);
  const shop = getMarket(shopId) ?? FEIRA_MARKETS[0];
  const lists = tickets.filter(
    (ticket) =>
      ticket.kind === "feira" &&
      ticket.shop === shop.name &&
      ticket.status !== "done" &&
      ticket.status !== "rejected",
  );

  return (
    <PhoneFrame>
      <div className="flex min-h-dvh flex-col">
        <main className="flex-1 px-4 pb-4 pt-[max(0.9rem,env(safe-area-inset-top))]">
          <p className="font-display text-[11px] font-bold uppercase tracking-wider text-primary">Pediu Entregas</p>
          <div className="mt-1 flex items-start justify-between gap-3">
            <div>
              <h1 className="font-display text-2xl font-extrabold leading-none">{shop.name}</h1>
              <p className="mt-1 text-sm text-muted">{shop.keeper} · separa a grade</p>
            </div>
            <span className="inline-flex h-11 items-center gap-2 rounded-full bg-accent px-3 text-xs font-bold text-accent-fg">
              <Store className="size-4" />
              Aberto
            </span>
          </div>

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

          <Link to="/feira/fiado" className="mt-3 inline-flex h-9 items-center rounded-full bg-surface px-3 text-xs font-bold shadow-card">
            Clientes e fiado
          </Link>

          <div className="mt-5 grid gap-5">
            {COLUMNS.map((column) => {
              const list = lists.filter((ticket) => ticket.status === column.id);
              return (
                <section key={column.id}>
                  <h2 className="font-display text-sm font-semibold">
                    {column.label}
                    <span className="ml-2 text-muted">{list.length}</span>
                  </h2>
                  <div className="mt-2 grid gap-2">
                    {list.length === 0 ? (
                      <p className="rounded-[18px] bg-surface px-3 py-3 text-sm text-muted shadow-card">Nada nesta etapa.</p>
                    ) : (
                      list.map((ticket) => (
                        <article key={ticket.id} className="rounded-[22px] bg-surface p-3 shadow-card">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-display text-sm font-bold">{ticket.customer}</p>
                              <p className="text-xs text-muted">
                                {ticket.shop} · {ticket.neighborhood}
                              </p>
                            </div>
                            <p className="font-display text-sm font-bold tabular-nums">{formatBRL(ticket.total)}</p>
                          </div>
                          <ul className="mt-2 text-sm">
                            {ticket.items.map((item) => (
                              <li key={item.name}>
                                {item.qty}× {item.name}
                              </li>
                            ))}
                          </ul>
                          {ticket.note ? <p className="mt-2 text-xs font-semibold text-primary">Combinado: {ticket.note}</p> : null}
                          <p className="mt-1 text-xs text-muted">Pediu recebeu. Libera quando a moto retira.</p>
                          {ticket.status === "new" ? (
                            <div className="mt-3 grid grid-cols-2 gap-2">
                              <Button size="sm" onClick={() => accept(ticket.id)}>
                                Separar
                              </Button>
                              <Button size="sm" variant="surface" onClick={() => reject(ticket.id)}>
                                Recusar
                              </Button>
                            </div>
                          ) : null}
                          {ticket.status === "preparing" ? (
                            <Button size="sm" className="mt-3 w-full" variant="accent" onClick={() => ready(ticket.id)}>
                              Pronto pra retirada
                            </Button>
                          ) : null}
                          {ticket.status === "ready" ? (
                            <p className="mt-3 text-xs font-semibold text-success">No balcão. O radar da moto já vê.</p>
                          ) : null}
                        </article>
                      ))
                    )}
                  </div>
                </section>
              );
            })}
          </div>
        </main>
        <LaneBar lane="feira" />
      </div>
    </PhoneFrame>
  );
}
