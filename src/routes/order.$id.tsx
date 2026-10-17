import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, ChevronLeft, MessageCircle, Phone, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Burst } from "@/components/burst";
import { CourierChat } from "@/components/courier-chat";
import { CourierMap } from "@/components/courier-map";
import { Screen } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { deliveryClock, useNow, type DeliveryStatus } from "@/lib/clock";
import { getAddress } from "@/lib/data";
import { formatBRL, formatRemain } from "@/lib/format";
import { type DeliveryRun, type KitchenTicket } from "@/lib/lane";
import { STATUS_LABEL, usePediu, type Order } from "@/lib/store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/order/$id")({ component: OrderTracking });

const STEPS: { id: DeliveryStatus; label: string }[] = [
  { id: "received", label: "Recebido" },
  { id: "preparing", label: "Preparando" },
  { id: "on_the_way", label: "Saiu" },
  { id: "arriving", label: "Chegando" },
  { id: "delivered", label: "Entregue" },
];

const COURIER_LINES: Record<DeliveryStatus, string> = {
  received: "Pedido confirmado na loja.",
  preparing: "A cozinha pegou. Cheiro bom daqui.",
  on_the_way: "Saí pra entrega. Vou pelo caminho mais curto.",
  arriving: "Tô na sua rua. Desço em instantes.",
  delivered: "Entregue. Bom apetite!",
};

function OrderTracking() {
  const { id } = Route.useParams();
  const order = usePediu((s) => s.orders.find((o) => o.id === id));
  const tickets = usePediu((s) => s.tickets ?? []);
  const runs = usePediu((s) => s.runs ?? []);
  const seed = usePediu((s) => s.seedCourierChat);
  const rateOrder = usePediu((s) => s.rateOrder);
  const now = useNow();
  const [chatOpen, setChatOpen] = useState(false);
  const [hoverRate, setHoverRate] = useState(0);

  const clock = order ? deliveryClock(order, now) : null;
  const status = clock?.status ?? "received";

  useEffect(() => {
    if (!order || order.feira) return;
    seed(order.id, COURIER_LINES[status]);
  }, [order, status, seed]);

  if (!order || !clock) {
    return (
      <Screen>
        <div className="px-6 py-24 text-center">
          <p className="font-display text-xl font-bold">Pedido não encontrado</p>
          <Link to="/orders" className="mt-3 inline-block text-sm font-semibold text-primary">
            Ver pedidos
          </Link>
        </div>
      </Screen>
    );
  }

  if (order.feira) {
    return <FeiraTrack order={order} tickets={tickets} runs={runs} />;
  }

  const moving = status === "on_the_way" || status === "arriving";
  const stepIndex = STEPS.findIndex((s) => s.id === status);
  const address = getAddress(order.addressId);
  const remain = clock.remainMins;
  const initial = order.courier.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");

  return (
    <Screen tabs={false}>
      <Burst show={status === "delivered"} />
      <div className="bg-ink pb-4 text-ink-fg">
        <div className="flex items-center gap-3 px-4 pt-[max(0.8rem,env(safe-area-inset-top))]">
          <Link to="/orders" className="grid size-11 place-items-center rounded-full bg-ink-fg/10" aria-label="Voltar">
            <ChevronLeft className="size-5" />
          </Link>
          <div className="min-w-0 flex-1">
            <p className="font-display text-sm font-bold">
              {order.flash ? "Flash 99" : "Entrega Pediu"}
              {order.junto ? " · Junto" : ""}
            </p>
            <p className="text-xs text-ink-fg/60 tabular-nums">{order.id}</p>
          </div>
          <EtaBadge progress={clock.progress} remain={remain} status={status} />
        </div>
        <div className="px-4 pt-4">
          <p className="font-display text-3xl font-extrabold leading-none tabular-nums">
            {status === "delivered" ? "Chegou." : order.scheduled ? order.scheduled : formatRemain(remain)}
          </p>
          <p className="mt-1 text-sm text-ink-fg/70">
            {status === "delivered"
              ? "Bom apetite."
              : moving
                ? `${order.courier.name} · ${order.courier.vehicle}`
                : "A cozinha pegou o seu pedido."}
          </p>
        </div>
        <div className="mt-4 px-4">
          <CourierMap status={status} />
        </div>
      </div>

      <div className="-mt-4 rounded-t-[28px] bg-bg px-4 pb-10 pt-5">
        <ol className="flex justify-between">
          {STEPS.map((s, i) => (
            <li key={s.id} className="flex flex-1 flex-col items-center gap-1">
              <span
                className={cn(
                  "grid size-7 place-items-center rounded-full text-[10px] font-bold transition-[background-color,color] duration-300",
                  i <= stepIndex ? "bg-primary text-primary-fg" : "bg-surface text-subtle shadow-card",
                )}
              >
                {i < stepIndex ? <Check className="size-3.5" /> : i + 1}
              </span>
              <span className={cn("text-[10px] font-semibold", i <= stepIndex ? "text-fg" : "text-subtle")}>
                {s.label}
              </span>
            </li>
          ))}
        </ol>

        <div className="mt-5 flex items-center gap-3 rounded-[22px] bg-surface p-3 shadow-card">
          <span
            className="grid size-12 place-items-center rounded-full font-display text-sm font-bold text-ink-fg"
            style={{ background: `hsl(${order.courier.hue ?? 12} 70% 28%)` }}
          >
            {initial}
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-display text-sm font-semibold">{order.courier.name}</p>
            <p className="text-xs text-muted">
              {order.courier.vehicle} · {order.courier.plate ?? "RFL-0A99"} · {order.courier.rating ?? 4.9}
            </p>
          </div>
          <span className="rounded-full bg-accent px-2 py-1 font-display text-[10px] font-bold text-accent-fg">
            {STATUS_LABEL[status]}
          </span>
        </div>

        <div className="mt-3 rounded-[22px] bg-surface p-4 shadow-card">
          <p className="font-display text-sm font-semibold">{order.restaurantName}</p>
          <p className="mt-1 text-xs text-muted">
            {address.street} · {address.neighborhood}
          </p>
          <ul className="mt-3 space-y-1.5 text-sm">
            {order.items.map((item) => (
              <li key={item.key} className="flex justify-between gap-3">
                <span className="min-w-0 truncate">
                  {item.qty}× {item.name}
                </span>
                <span className="tabular-nums">{formatBRL(item.unitPrice * item.qty)}</span>
              </li>
            ))}
          </ul>
          {order.tip ? (
            <div className="mt-2 flex justify-between text-xs text-muted">
              <span>Gorjeta</span>
              <span className="tabular-nums">{formatBRL(order.tip)}</span>
            </div>
          ) : null}
          {order.cashback ? (
            <div className="mt-2 flex justify-between text-xs text-success">
              <span>Cashback Pediu Pay</span>
              <span className="tabular-nums">+ {formatBRL(order.cashback)}</span>
            </div>
          ) : null}
          <div className="mt-3 flex justify-between font-display text-sm font-bold">
            <span>Total</span>
            <span className="tabular-nums">{formatBRL(order.total)}</span>
          </div>
        </div>

        {status === "delivered" ? (
          <div className="mt-3 rounded-[22px] bg-surface p-4 shadow-card">
            <p className="font-display text-sm font-semibold">Como foi?</p>
            <p className="mt-0.5 text-xs text-muted">Sua nota entra no ranking Flash 99.</p>
            <div className="mt-3 flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onMouseEnter={() => setHoverRate(n)}
                  onMouseLeave={() => setHoverRate(0)}
                  onClick={() => {
                    rateOrder(order.id, n);
                    toast.success("Valeu pela nota");
                  }}
                  className="grid size-11 place-items-center rounded-full bg-bg"
                  aria-label={`${n} estrelas`}
                >
                  <Star
                    className={cn(
                      "size-6 transition-transform duration-150",
                      n <= (order.rating ?? hoverRate) ? "fill-accent text-accent scale-100" : "text-subtle",
                    )}
                  />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => toast.message(`Ligando para ${order.courier.name.split(" ")[0]}…`)}
              className="flex h-12 items-center justify-center gap-2 rounded-[16px] bg-surface text-sm font-semibold shadow-card"
            >
              <Phone className="size-4" />
              Ligar
            </button>
            <button
              type="button"
              onClick={() => setChatOpen(true)}
              className="flex h-12 items-center justify-center gap-2 rounded-[16px] bg-ink text-sm font-semibold text-ink-fg"
            >
              <MessageCircle className="size-4" />
              Chat
            </button>
          </div>
        )}

        {status === "delivered" ? (
          <Button asChild className="mt-4 w-full rounded-full">
            <Link to="/">Pedir de novo</Link>
          </Button>
        ) : null}
      </div>

      <CourierChat
        orderId={order.id}
        courierName={order.courier.name}
        open={chatOpen}
        onOpenChange={setChatOpen}
      />
    </Screen>
  );
}

function EtaBadge({
  progress,
  remain,
  status,
}: {
  progress: number;
  remain: number;
  status: DeliveryStatus;
}) {
  const p = status === "delivered" ? 1 : Math.min(1, Math.max(0.08, progress));
  const r = 16;
  const c = 2 * Math.PI * r;
  return (
    <span className="relative grid size-12 place-items-center">
      <svg viewBox="0 0 40 40" className="absolute inset-0 size-12 -rotate-90" aria-hidden="true">
        <circle cx="20" cy="20" r={r} fill="none" stroke="currentColor" className="text-ink-fg/15" strokeWidth="3" />
        <circle
          cx="20"
          cy="20"
          r={r}
          fill="none"
          stroke="currentColor"
          className="text-accent transition-[stroke-dashoffset] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - p)}
        />
      </svg>
      <span className="font-display text-[10px] font-bold tabular-nums">
        {status === "delivered" ? "ok" : `${remain}`}
      </span>
    </span>
  );
}

function FeiraTrack({
  order,
  tickets,
  runs,
}: {
  order: Order;
  tickets: KitchenTicket[];
  runs: DeliveryRun[];
}) {
  const [chatOpen, setChatOpen] = useState(false);
  const address = getAddress(order.addressId);
  const ticket = tickets.find((item) => item.orderId === order.id);
  const run = runs.find((item) => item.ticketId === ticket?.id);
  const phase =
    run?.step === "done" || ticket?.status === "done"
      ? "Entregue"
      : run?.step === "to_door" || run?.step === "picked"
        ? "Moto a caminho"
        : run?.step === "to_shop"
          ? "Moto indo buscar"
          : run?.step === "waiting"
        ? `Combinado com ${order.courier.name.split(" ")[0]}`
        : ticket?.status === "ready"
            ? "No balcão"
            : ticket?.status === "preparing"
              ? "Separando"
              : ticket?.status === "rejected"
                ? "Recusada"
                : "Lista no mercado";

  return (
    <Screen tabs={false}>
      <div className="bg-ink px-4 pb-6 pt-[max(0.9rem,env(safe-area-inset-top))] text-ink-fg">
        <Link to="/orders" className="grid size-11 place-items-center rounded-full bg-ink-fg/10" aria-label="Voltar">
          <ChevronLeft className="size-5" />
        </Link>
        <p className="mt-4 font-display text-[11px] font-bold uppercase tracking-wider text-accent">Pediu Entregas</p>
        <h1 className="mt-1 font-display text-3xl font-extrabold leading-none">{phase}</h1>
        <p className="mt-2 text-sm text-ink-fg/70">
          {order.restaurantName} separa a grade. {order.courier.name.split(" ")[0]} busca no balcão e deixa em{" "}
          {order.dropoff ?? address.neighborhood}. O Pediu segura {formatBRL(order.total)} até a retirada.
        </p>
      </div>
      <div className="px-4 pb-10 pt-5">
        <div className="rounded-[22px] bg-surface p-4 shadow-card">
          <p className="font-display text-sm font-semibold">{order.courier.name}</p>
          <p className="mt-1 text-sm text-muted">
            {order.courier.vehicle} · {order.handoff}
          </p>
          <ul className="mt-3 space-y-1.5 text-sm">
            {order.items.map((item) => (
              <li key={item.key} className="flex justify-between gap-3">
                <span>
                  {item.qty}× {item.name}
                </span>
                <span className="tabular-nums">{formatBRL(item.unitPrice * item.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex justify-between text-xs text-muted">
            <span>Entrega</span>
            <span className="tabular-nums">{formatBRL(order.deliveryFee)}</span>
          </div>
          <div className="mt-2 flex justify-between font-display text-sm font-bold">
            <span>Total</span>
            <span className="tabular-nums">{formatBRL(order.total)}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setChatOpen(true)}
          className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-[16px] bg-ink text-sm font-semibold text-ink-fg"
        >
          <MessageCircle className="size-4" />
          Combinar com a moto
        </button>
      </div>
      <CourierChat orderId={order.id} courierName={order.courier.name} open={chatOpen} onOpenChange={setChatOpen} />
    </Screen>
  );
}
