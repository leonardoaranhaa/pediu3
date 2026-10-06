import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Banknote, Check, ChevronLeft, Copy, CreditCard, MapPin, QrCode, Users, WalletCards } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Burst } from "@/components/burst";
import { Screen } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { ADDRESSES, JUNTO, TIP_OPTIONS } from "@/lib/data";
import { formatBRL, formatFee } from "@/lib/format";
import { cartTotals, usePediu } from "@/lib/store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/checkout")({ component: CheckoutPage });

const PIX_CODE = "00020126PEDIU.FLASH.99.SP6304A3F2";
const SLOTS = [
  { id: null, label: "Agora" },
  { id: "+30 min", label: "+30 min" },
  { id: "+1 h", label: "+1 h" },
  { id: "Hoje 20h", label: "Hoje 20h" },
] as const;

function CheckoutPage() {
  const navigate = useNavigate();
  const cart = usePediu((s) => s.cart);
  const coupon = usePediu((s) => s.coupon);
  const payment = usePediu((s) => s.payment);
  const setPayment = usePediu((s) => s.setPayment);
  const addressId = usePediu((s) => s.addressId);
  const setAddress = usePediu((s) => s.setAddress);
  const cpfOnInvoice = usePediu((s) => s.cpfOnInvoice);
  const toggleCpf = usePediu((s) => s.toggleCpf);
  const placeOrder = usePediu((s) => s.placeOrder);
  const tip = usePediu((s) => s.tip);
  const setTip = usePediu((s) => s.setTip);
  const schedule = usePediu((s) => s.schedule);
  const setSchedule = usePediu((s) => s.setSchedule);
  const junto = usePediu((s) => s.junto);
  const toggleJunto = usePediu((s) => s.toggleJunto);
  const wallet = usePediu((s) => s.wallet);
  const points = usePediu((s) => s.points);
  const totals = cartTotals(cart, coupon, payment, points);
  const [placing, setPlacing] = useState(false);
  const grand = totals.total + tip;
  const split = junto ? grand / 3 : grand;

  if (!cart.length) {
    return (
      <Screen>
        <div className="px-6 py-24 text-center">
          <p className="font-display text-xl font-bold">Sacola vazia</p>
          <Link to="/" className="mt-3 inline-block text-sm font-semibold text-primary">
            Pedir agora
          </Link>
        </div>
      </Screen>
    );
  }

  function pay() {
    if (payment === "wallet" && wallet < grand) {
      toast.error("Saldo insuficiente na Pediu Pay");
      return;
    }
    setPlacing(true);
    window.setTimeout(() => {
      const order = placeOrder();
      setPlacing(false);
      if (!order) return;
      toast.success("Pedido no fogo");
      void navigate({ to: "/order/$id", params: { id: order.id } });
    }, 900);
  }

  return (
    <Screen tabs={false}>
      <Burst show={placing} />
      <div className="px-4 pb-36 pt-[max(0.8rem,env(safe-area-inset-top))]">
        <div className="flex items-center gap-3">
          <Link to="/cart" className="grid size-11 place-items-center rounded-full bg-surface shadow-card" aria-label="Voltar">
            <ChevronLeft className="size-5" />
          </Link>
          <h1 className="font-display text-xl font-bold">Fechar pedido</h1>
        </div>

        <section className="mt-5">
          <p className="font-display text-sm font-semibold">Entregar em</p>
          <div className="mt-2 grid gap-2">
            {ADDRESSES.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => setAddress(a.id)}
                className={cn(
                  "flex items-start gap-3 rounded-[20px] px-3 py-3 text-left shadow-card transition-[background-color] duration-150",
                  addressId === a.id ? "bg-ink text-ink-fg" : "bg-surface",
                )}
              >
                <MapPin className="mt-0.5 size-4 shrink-0" />
                <span>
                  <span className="block font-display text-sm font-semibold">{a.label}</span>
                  <span className={cn("text-xs", addressId === a.id ? "text-ink-fg/70" : "text-muted")}>
                    {a.street} · {a.neighborhood}
                    {a.complement ? ` · ${a.complement}` : ""}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="mt-6">
          <p className="font-display text-sm font-semibold">Quando</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {SLOTS.map((s) => (
              <button
                key={s.label}
                type="button"
                onClick={() => setSchedule(s.id)}
                className={cn(
                  "h-9 rounded-full px-3 text-xs font-semibold transition-[background-color,transform] duration-150 active:scale-[0.96]",
                  schedule === s.id ? "bg-ink text-ink-fg" : "bg-surface text-muted shadow-card",
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </section>

        <button
          type="button"
          onClick={toggleJunto}
          className={cn(
            "mt-5 flex w-full items-center justify-between rounded-[20px] px-3 py-3 text-left shadow-card transition-[background-color] duration-150",
            junto ? "bg-accent text-accent-fg" : "bg-surface",
          )}
        >
          <span className="flex items-center gap-3">
            <Users className="size-5" />
            <span>
              <span className="block font-display text-sm font-semibold">Pediu Junto</span>
              <span className={cn("text-xs", junto ? "text-accent-fg/80" : "text-muted")}>
                Divide com Mari e João
              </span>
            </span>
          </span>
          {junto ? (
            <span className="flex -space-x-2">
              {JUNTO.map((f) => (
                <span
                  key={f.id}
                  className="grid size-8 place-items-center rounded-full bg-ink font-display text-xs font-bold text-ink-fg"
                >
                  {f.initial}
                </span>
              ))}
            </span>
          ) : null}
        </button>

        <section className="mt-6">
          <p className="font-display text-sm font-semibold">Pagar com</p>
          <div className="mt-2 grid gap-2">
            <PayOption
              active={payment === "pix"}
              onClick={() => setPayment("pix")}
              icon={<QrCode className="size-5" />}
              title="Pix"
              subtitle="Aprovação na hora · cupom PIX5"
            />
            <PayOption
              active={payment === "wallet"}
              onClick={() => setPayment("wallet")}
              icon={<WalletCards className="size-5" />}
              title="Pediu Pay"
              subtitle={`${formatBRL(wallet)} · 2% de volta`}
            />
            <PayOption
              active={payment === "card"}
              onClick={() => setPayment("card")}
              icon={<CreditCard className="size-5" />}
              title="Cartão •••• 4412"
              subtitle="Crédito em até 3x"
            />
            <PayOption
              active={payment === "cash"}
              onClick={() => setPayment("cash")}
              icon={<Banknote className="size-5" />}
              title="Dinheiro"
              subtitle="Pagar na entrega"
            />
          </div>
        </section>

        {payment === "pix" ? (
          <div className="mt-3 rounded-[22px] bg-surface p-4 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">Copia e cola</p>
            <p className="mt-1 break-all font-display text-xs">{PIX_CODE}</p>
            <Button
              variant="surface"
              size="sm"
              className="mt-3"
              onClick={() => {
                void navigator.clipboard?.writeText(PIX_CODE);
                toast.success("Pix copiado");
              }}
            >
              <Copy className="size-4" />
              Copiar código
            </Button>
          </div>
        ) : null}

        <section className="mt-6">
          <p className="font-display text-sm font-semibold">Gorjeta da moto</p>
          <div className="mt-2 flex gap-2">
            {TIP_OPTIONS.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setTip(n)}
                className={cn(
                  "h-10 flex-1 rounded-full text-xs font-bold tabular-nums transition-[background-color,transform] duration-150 active:scale-[0.96]",
                  tip === n ? "bg-accent text-accent-fg" : "bg-surface text-muted shadow-card",
                )}
              >
                {n === 0 ? "Sem" : formatBRL(n)}
              </button>
            ))}
          </div>
        </section>

        <button
          type="button"
          onClick={toggleCpf}
          className="mt-5 flex w-full items-center justify-between rounded-[18px] bg-surface px-3 py-3 text-sm shadow-card"
        >
          <span>CPF na nota</span>
          <span
            className={cn(
              "grid size-6 place-items-center rounded-full",
              cpfOnInvoice ? "bg-success text-success-fg" : "bg-border",
            )}
          >
            {cpfOnInvoice ? <Check className="size-3.5" /> : null}
          </span>
        </button>

        <dl className="mt-6 space-y-2 text-sm">
          <div className="flex justify-between text-muted">
            <dt>
              {totals.itemCount} itens · {totals.restaurant?.name}
            </dt>
            <dd className="tabular-nums text-fg">{formatBRL(totals.subtotal)}</dd>
          </div>
          <div className="flex justify-between text-muted">
            <dt>Entrega</dt>
            <dd className={totals.deliveryFee === 0 ? "font-semibold text-success" : "tabular-nums text-fg"}>
              {formatFee(totals.deliveryFee)}
            </dd>
          </div>
          {totals.discount > 0 ? (
            <div className="flex justify-between text-success">
              <dt>Cupom</dt>
              <dd className="tabular-nums">− {formatBRL(totals.discount)}</dd>
            </div>
          ) : null}
          {tip > 0 ? (
            <div className="flex justify-between text-muted">
              <dt>Gorjeta</dt>
              <dd className="tabular-nums text-fg">{formatBRL(tip)}</dd>
            </div>
          ) : null}
          {junto ? (
            <div className="flex justify-between text-muted">
              <dt>Sua parte (3)</dt>
              <dd className="tabular-nums font-semibold text-fg">{formatBRL(split)}</dd>
            </div>
          ) : null}
        </dl>
      </div>

      <div className="fixed bottom-0 left-1/2 z-40 w-full max-w-phone -translate-x-1/2 bg-gradient-to-t from-bg via-bg to-transparent px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
        <Button className="w-full rounded-full" size="lg" onClick={pay} disabled={placing}>
          {placing ? "Confirmando…" : `Pedir · ${formatBRL(grand)}`}
        </Button>
      </div>
    </Screen>
  );
}

function PayOption({
  active,
  onClick,
  icon,
  title,
  subtitle,
}: {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-[20px] px-3 py-3 text-left shadow-card",
        active ? "bg-accent text-accent-fg" : "bg-surface",
      )}
    >
      {icon}
      <span>
        <span className="block font-display text-sm font-semibold">{title}</span>
        <span className={cn("text-xs", active ? "text-accent-fg/80" : "text-muted")}>{subtitle}</span>
      </span>
    </button>
  );
}
