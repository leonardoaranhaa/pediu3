import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChevronRight, RotateCcw } from "lucide-react";
import { Screen } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { deliveryClock, useNow } from "@/lib/clock";
import { formatBRL } from "@/lib/format";
import { STATUS_LABEL, usePediu, type Order } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/orders")({ component: OrdersPage });

function OrdersPage() {
  const orders = usePediu((s) => s.orders);
  const addToCart = usePediu((s) => s.addToCart);
  const clearCart = usePediu((s) => s.clearCart);
  const navigate = useNavigate();
  const now = useNow();

  const active = orders.filter((o) => deliveryClock(o, now).status !== "delivered");
  const past = orders.filter((o) => deliveryClock(o, now).status === "delivered");

  return (
    <Screen>
      <main className="px-4 pb-8 pt-[max(0.9rem,env(safe-area-inset-top))]">
        <h1 className="font-display text-2xl font-extrabold">Pedidos</h1>
        {orders.length === 0 ? (
          <div className="mt-16 text-center">
            <p className="font-display text-lg font-bold">Nenhum pedido ainda</p>
            <p className="mt-1 text-sm text-muted">O primeiro chega mais rápido do que parece.</p>
            <Button asChild className="mt-5">
              <Link to="/">Explorar</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-5 space-y-6">
            {active.length > 0 ? (
              <section>
                <p className="text-xs font-bold uppercase tracking-wider text-primary">Ao vivo</p>
                <div className="mt-2 grid gap-2">
                  {active.map((o) => (
                    <OrderCard key={o.id} order={o} live now={now} />
                  ))}
                </div>
              </section>
            ) : null}
            {past.length > 0 ? (
              <section>
                <p className="text-xs font-bold uppercase tracking-wider text-muted">Anteriores</p>
                <div className="mt-2 grid gap-2">
                  {past.map((o) => (
                    <div key={o.id} className="rounded-[22px] bg-surface p-3 shadow-card">
                      <OrderCard order={o} live={false} nested now={now} />
                      <Button
                        variant="surface"
                        size="sm"
                        className="mt-2 w-full"
                        onClick={() => {
                          clearCart();
                          o.items.forEach((item) => {
                            addToCart({
                              dishId: item.dishId,
                              extras: item.extras,
                              qty: item.qty,
                              notes: item.notes,
                            });
                          });
                          toast.success("Montamos de novo");
                          void navigate({ to: "/cart" });
                        }}
                      >
                        <RotateCcw className="size-4" />
                        Pedir de novo
                      </Button>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        )}
      </main>
    </Screen>
  );
}

function OrderCard({
  order,
  live,
  nested,
  now,
}: {
  order: Order;
  live: boolean;
  nested?: boolean;
  now: number;
}) {
  const status = deliveryClock(order, now).status;
  return (
    <Link
      to="/order/$id"
      params={{ id: order.id }}
      className={nested ? "flex items-center gap-3" : "flex items-center gap-3 rounded-[22px] bg-surface p-3 shadow-card"}
    >
      <img src={order.restaurantImage} alt="" className="size-14 rounded-[16px] object-cover" />
      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-sm font-semibold">{order.restaurantName}</p>
        <p className="text-xs text-muted">
          {STATUS_LABEL[status]} · {formatBRL(order.total)}
        </p>
        <p className="text-[11px] text-subtle tabular-nums">{order.id}</p>
      </div>
      {live ? (
        <span className="relative grid size-4 place-items-center">
          <span className="absolute size-4 rounded-full bg-primary/40 pulse-live" />
          <span className="size-2 rounded-full bg-primary" />
        </span>
      ) : (
        <ChevronRight className="size-4 text-subtle" />
      )}
    </Link>
  );
}
