import { createFileRoute } from "@tanstack/react-router";
import { Store } from "lucide-react";
import { LaneBar } from "@/components/lane-bar";
import { PhoneFrame } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { getRestaurant } from "@/lib/data";
import { formatBRL } from "@/lib/format";
import { SHOP_ID, type TicketStatus } from "@/lib/lane";
import { usePediu } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/loja")({ component: LojaPage });

const COLUMNS: { id: TicketStatus; label: string }[] = [
  { id: "new", label: "Na fila" },
  { id: "preparing", label: "No fogo" },
  { id: "ready", label: "Na bancada" },
];

function LojaPage() {
  const shop = getRestaurant(SHOP_ID);
  const open = usePediu((s) => s.shopOpen);
  const setOpen = usePediu((s) => s.setShopOpen);
  const tickets = usePediu((s) => s.tickets ?? []);
  const accept = usePediu((s) => s.acceptTicket);
  const reject = usePediu((s) => s.rejectTicket);
  const ready = usePediu((s) => s.readyTicket);
  const live = tickets.filter(
    (ticket) => ticket.status !== "done" && ticket.status !== "rejected" && ticket.kind !== "feira",
  );
  const billed = tickets
    .filter((ticket) => ticket.status !== "rejected")
    .reduce((sum, ticket) => sum + ticket.total, 0);

  return (
    <PhoneFrame>
      <div className="flex min-h-dvh flex-col">
        <main className="flex-1 px-4 pb-4 pt-[max(0.9rem,env(safe-area-inset-top))]">
          <p className="font-display text-[11px] font-bold uppercase tracking-wider text-primary">Lojista</p>
          <div className="mt-1 flex items-start justify-between gap-3">
            <div>
              <h1 className="font-display text-2xl font-extrabold leading-none">{shop?.name}</h1>
              <p className="mt-1 text-sm text-muted">Cozinha · Consolação</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(!open)}
              className={cn(
                "inline-flex h-11 items-center gap-2 rounded-full px-3 text-xs font-bold",
                open ? "bg-success text-success-fg" : "bg-ink text-ink-fg",
              )}
            >
              <Store className="size-4" />
              {open ? "Aberta" : "Pausada"}
            </button>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <Stat label="Na fila" value={String(tickets.filter((t) => t.status === "new").length)} />
            <Stat label="No fogo" value={String(tickets.filter((t) => t.status === "preparing").length)} />
            <Stat label="Hoje" value={formatBRL(billed)} />
          </div>

          {!open ? (
            <p className="mt-4 rounded-[18px] bg-ink px-3 py-3 text-sm text-ink-fg">
              A loja está pausada. O cliente vê o aviso e não fecha pedido novo.
            </p>
          ) : null}

          <div className="mt-5 grid gap-5">
            {COLUMNS.map((column) => {
              const list = live.filter((ticket) => ticket.status === column.id);
              return (
                <section key={column.id}>
                  <h2 className="font-display text-sm font-semibold">
                    {column.label}
                    <span className="ml-2 text-muted">{list.length}</span>
                  </h2>
                  <div className="mt-2 grid gap-2">
                    {list.length === 0 ? (
                      <p className="rounded-[18px] bg-surface px-3 py-3 text-sm text-muted shadow-card">Nada aqui.</p>
                    ) : (
                      list.map((ticket) => (
                        <article key={ticket.id} className="rounded-[22px] bg-surface p-3 shadow-card">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-display text-sm font-bold">
                                {ticket.customer}
                                {ticket.flash ? <span className="ml-2 text-[10px] uppercase text-primary">Flash</span> : null}
                              </p>
                              <p className="text-xs text-muted">{ticket.neighborhood}</p>
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
                          {ticket.status === "new" ? (
                            <div className="mt-3 grid grid-cols-2 gap-2">
                              <Button size="sm" onClick={() => accept(ticket.id)}>
                                Aceitar
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
                            <p className="mt-3 text-xs font-semibold text-success">Na bancada. O radar da moto já vê.</p>
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
        <LaneBar lane="loja" />
      </div>
    </PhoneFrame>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] bg-surface px-2 py-3 text-center shadow-card">
      <p className="font-display text-sm font-bold tabular-nums">{value}</p>
      <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted">{label}</p>
    </div>
  );
}
