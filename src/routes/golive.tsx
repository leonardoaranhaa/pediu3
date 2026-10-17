import { createFileRoute, Link } from "@tanstack/react-router";
import { Bike, Check, ChevronLeft, ShoppingBasket, Store } from "lucide-react";
import type { ReactNode } from "react";
import { Screen } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { usePediu } from "@/lib/store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/golive")({ component: GoLivePage });

function GoLivePage() {
  const orders = usePediu((s) => s.orders);
  const tickets = usePediu((s) => s.tickets ?? []);
  const runs = usePediu((s) => s.runs ?? []);
  const setQty = usePediu((s) => s.setFeiraQty);
  const setStop = usePediu((s) => s.setFeiraStop);
  const setShop = usePediu((s) => s.setFeiraShop);
  const setOnline = usePediu((s) => s.setMotoOnline);
  const place = usePediu((s) => s.placeFeira);
  const acceptTicket = usePediu((s) => s.acceptTicket);
  const readyTicket = usePediu((s) => s.readyTicket);
  const acceptRun = usePediu((s) => s.acceptRun);
  const advanceRun = usePediu((s) => s.advanceRun);

  const order = orders.find((item) => {
    if (!item.feira) return false;
    const row = tickets.find((ticket) => ticket.orderId === item.id);
    return row?.status !== "rejected";
  });
  const ticket = tickets.find((row) => row.orderId === order?.id);
  const run = runs.find((row) => row.ticketId === ticket?.id);

  const separated = ticket?.status === "preparing" || ticket?.status === "ready" || ticket?.status === "done";
  const counter = ticket?.status === "ready" || ticket?.status === "done" || Boolean(run?.marketReady);
  const riding =
    run?.step === "picked" || run?.step === "to_door" || run?.step === "done" || run?.step === "to_shop";
  const delivered = run?.step === "done";

  const steps = [
    { id: "lista", title: "Cliente monta a lista", done: Boolean(order), hint: "Grade do Mercadinho Central" },
    { id: "separa", title: "Mercado separa", done: separated, hint: "Balcão aceita a lista" },
    { id: "balcao", title: "Pronto pra retirada", done: counter, hint: "O Pediu libera a moto" },
    { id: "moto", title: "Entregador busca e leva", done: riding && run?.step !== "to_shop" && run?.step !== "waiting", hint: "Retira no balcão e deixa em casa" },
    { id: "porta", title: "Cliente recebe", done: delivered, hint: "O valor sai da conta do Pediu" },
  ];
  const current = steps.findIndex((step) => !step.done);

  function openCity() {
    setOnline(true);
    setShop("central");
    setStop("casa");
    setQty("central", "central-arroz", 1);
    setQty("central", "central-leite", 2);
    setQty("central", "central-cafe", 1);
    const created = place("Pode buscar agora", "camila");
    if (!created) {
      toast.error("Não deu para abrir a lista");
      return;
    }
    toast.success("Lista no Mercadinho Central");
  }

  function act() {
    if (!order || !ticket || !run) {
      openCity();
      return;
    }
    if (ticket.status === "new") {
      acceptTicket(ticket.id);
      toast.success("Mercado separando");
      return;
    }
    if (ticket.status === "preparing") {
      readyTicket(ticket.id);
      toast.success("No balcão");
      return;
    }
    if (run.step === "offer") {
      const ok = acceptRun(run.id);
      if (!ok) toast.error("A moto precisa estar online");
      else toast.success("Entregador combinado");
      return;
    }
    if (run.step === "waiting") {
      readyTicket(ticket.id);
      toast.success("Balcão liberou a moto");
      return;
    }
    if (run.step === "to_shop" || run.step === "picked" || run.step === "to_door") {
      advanceRun(run.id);
    }
  }

  const actionLabel = !order
    ? "Abrir o pedido de estreia"
    : ticket?.status === "new"
      ? "Separar no balcão"
      : ticket?.status === "preparing"
        ? "Marcar pronto pra retirada"
        : run?.step === "offer"
          ? "Entregador combina"
          : run?.step === "waiting"
            ? "Liberar a moto no balcão"
            : run?.step === "to_shop"
            ? "Retirei no mercado"
            : run?.step === "picked"
              ? "Saí para a entrega"
              : run?.step === "to_door"
                ? "Entregue na porta"
                : "Cidade aberta";

  return (
    <Screen>
      <main className="px-4 pb-28 pt-[max(0.9rem,env(safe-area-inset-top))]">
        <Link to="/" className="inline-flex items-center gap-1 text-sm font-semibold">
          <ChevronLeft className="size-4" />
          Início
        </Link>
        <p className="mt-4 font-display text-[11px] font-bold uppercase tracking-wider text-primary">Go Live</p>
        <h1 className="mt-1 font-display text-3xl font-extrabold leading-none">Abrir a cidade</h1>
        <p className="mt-2 text-sm text-muted">
          Um pedido de verdade, da grade do mercado até a porta. Cliente, balcão e moto andam na mesma lista.
        </p>

        <div className="mt-5 grid grid-cols-3 gap-2">
          <Door to="/market" icon={<ShoppingBasket className="size-4" />} label="Cliente" />
          <Door to="/feira" icon={<Store className="size-4" />} label="Mercado" />
          <Door to="/moto" icon={<Bike className="size-4" />} label="Moto" />
        </div>

        <ol className="mt-6 grid gap-2">
          {steps.map((step, index) => {
            const on = current === index;
            return (
              <li
                key={step.id}
                className={cn(
                  "flex items-center gap-3 rounded-[20px] px-3 py-3 shadow-card",
                  step.done ? "bg-surface" : on ? "bg-ink text-ink-fg" : "bg-surface text-muted",
                )}
              >
                <span
                  className={cn(
                    "grid size-8 shrink-0 place-items-center rounded-full font-display text-xs font-bold",
                    step.done ? "bg-success text-success-fg" : on ? "bg-accent text-accent-fg" : "bg-bg text-muted",
                  )}
                >
                  {step.done ? <Check className="size-4" /> : index + 1}
                </span>
                <span>
                  <span className="block font-display text-sm font-semibold">{step.title}</span>
                  <span className={cn("text-xs", on ? "text-ink-fg/70" : "text-muted")}>{step.hint}</span>
                </span>
              </li>
            );
          })}
        </ol>

        {order ? (
          <div className="mt-4 flex gap-2">
            <Link to="/order/$id" params={{ id: order.id }} className="text-sm font-semibold text-primary">
              Ver como o cliente
            </Link>
            {run ? (
              <Link to="/moto/$id" params={{ id: run.id }} className="text-sm font-semibold text-primary">
                Abrir a corrida
              </Link>
            ) : null}
          </div>
        ) : null}
      </main>

      <div className="fixed bottom-20 left-1/2 z-40 w-full max-w-phone -translate-x-1/2 px-4">
        <Button className="w-full rounded-full" size="lg" onClick={delivered ? openCity : act}>
          {delivered ? "Abrir outro pedido" : actionLabel}
        </Button>
      </div>
    </Screen>
  );
}

function Door({ to, icon, label }: { to: "/market" | "/feira" | "/moto"; icon: ReactNode; label: string }) {
  return (
    <Link to={to} className="rounded-[18px] bg-surface px-2 py-3 text-center shadow-card active:scale-[0.98]">
      <span className="mx-auto grid size-9 place-items-center rounded-full bg-bg">{icon}</span>
      <span className="mt-2 block font-display text-xs font-bold">{label}</span>
    </Link>
  );
}
