import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, Minus, Plus, Ticket, Trash2 } from "lucide-react";
import { useState } from "react";
import { Screen } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { COUPONS, popularDishes } from "@/lib/data";
import { formatBRL, formatFee } from "@/lib/format";
import { cartTotals, usePediu } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/cart")({ component: CartPage });

function CartPage() {
  const cart = usePediu((s) => s.cart);
  const coupon = usePediu((s) => s.coupon);
  const payment = usePediu((s) => s.payment);
  const points = usePediu((s) => s.points);
  const updateQty = usePediu((s) => s.updateQty);
  const clearCart = usePediu((s) => s.clearCart);
  const setCoupon = usePediu((s) => s.setCoupon);
  const addToCart = usePediu((s) => s.addToCart);
  const totals = cartTotals(cart, coupon, payment, points);
  const [code, setCode] = useState(coupon ?? "");
  const restaurant = totals.restaurant;
  const suggestions = restaurant
    ? popularDishes().filter((d) => d.restaurantId === restaurant.id && !cart.some((c) => c.dishId === d.id))
    : [];

  if (!cart.length) {
    return (
      <Screen>
        <div className="px-6 pb-8 pt-[max(1rem,env(safe-area-inset-top))]">
          <Link to="/" className="inline-flex items-center gap-1 text-sm font-semibold">
            <ChevronLeft className="size-4" />
            Início
          </Link>
          <div className="mt-16 text-center">
            <p className="font-display text-2xl font-extrabold">Sacola vazia</p>
            <p className="mt-2 text-sm text-muted">Pede um Flash 99 ou deixa o Sabor do momento escolher.</p>
            <div className="mt-6 flex justify-center gap-2">
              <Button asChild>
                <Link to="/">Ver restaurantes</Link>
              </Button>
            </div>
          </div>
        </div>
      </Screen>
    );
  }

  return (
    <Screen tabs={false}>
      <div className="px-4 pb-36 pt-[max(0.8rem,env(safe-area-inset-top))]">
        <div className="flex items-center justify-between">
          {restaurant ? (
            <Link
              to="/restaurants/$id"
              params={{ id: restaurant.id }}
              className="grid size-11 place-items-center rounded-full bg-surface shadow-card"
              aria-label="Voltar"
            >
              <ChevronLeft className="size-5" />
            </Link>
          ) : (
            <Link to="/" className="grid size-11 place-items-center rounded-full bg-surface shadow-card" aria-label="Voltar">
              <ChevronLeft className="size-5" />
            </Link>
          )}
          <div className="text-center">
            <p className="font-display text-base font-bold">Sacola</p>
            <p className="text-xs text-muted">{restaurant?.name}</p>
          </div>
          <button
            type="button"
            onClick={clearCart}
            className="grid size-11 place-items-center rounded-full bg-surface shadow-card"
            aria-label="Esvaziar"
          >
            <Trash2 className="size-4" />
          </button>
        </div>

        <ul className="mt-5 space-y-2">
          {cart.map((item) => (
            <li key={item.key} className="flex gap-3 rounded-[22px] bg-surface p-2 shadow-card">
              <img src={item.image} alt="" className="size-16 rounded-[16px] object-cover" />
              <div className="min-w-0 flex-1">
                <p className="font-display text-sm font-semibold leading-tight">{item.name}</p>
                {item.extras.length ? (
                  <p className="mt-0.5 truncate text-[11px] text-muted">{item.extras.map((e) => e.name).join(" · ")}</p>
                ) : null}
                <p className="mt-1 font-display text-sm font-bold tabular-nums">{formatBRL(item.unitPrice * item.qty)}</p>
              </div>
              <div className="flex items-center gap-1 self-end">
                <button
                  type="button"
                  className="grid size-9 place-items-center"
                  onClick={() => updateQty(item.key, item.qty - 1)}
                  aria-label="Diminuir"
                >
                  <Minus className="size-4" />
                </button>
                <span className="w-5 text-center font-display text-sm font-bold tabular-nums">{item.qty}</span>
                <button
                  type="button"
                  className="grid size-9 place-items-center"
                  onClick={() => updateQty(item.key, item.qty + 1)}
                  aria-label="Aumentar"
                >
                  <Plus className="size-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>

        {suggestions.length > 0 ? (
          <section className="mt-6">
            <p className="font-display text-sm font-semibold">Leva mais um?</p>
            <div className="no-scrollbar mt-2 flex gap-2 overflow-x-auto">
              {suggestions.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => {
                    addToCart({ dishId: d.id, extras: [], qty: 1, notes: "" });
                    toast.success("Adicionado");
                  }}
                  className="w-36 shrink-0 overflow-hidden rounded-[20px] bg-surface text-left shadow-card"
                >
                  <img src={d.image} alt="" className="h-20 w-full object-cover" />
                  <div className="p-2">
                    <p className="line-clamp-2 font-display text-xs font-semibold">{d.name}</p>
                    <p className="mt-1 text-xs font-bold tabular-nums">{formatBRL(d.price)}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-6 rounded-[24px] bg-surface p-4 shadow-card">
          <p className="inline-flex items-center gap-1.5 font-display text-sm font-semibold">
            <Ticket className="size-4 text-primary" />
            Cupom
          </p>
          <div className="mt-2 flex gap-2">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="PEDIU10"
              className="h-11 flex-1 rounded-[14px] bg-bg px-3 text-sm font-semibold uppercase outline-none"
            />
            <Button
              variant="ink"
              onClick={() => {
                const found = COUPONS.find((c) => c.code === code.trim().toUpperCase());
                if (!found) {
                  toast.error("Cupom inválido");
                  return;
                }
                setCoupon(found.code);
                toast.success(found.label);
              }}
            >
              Aplicar
            </Button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {COUPONS.map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => {
                  setCode(c.code);
                  setCoupon(c.code);
                }}
                className={
                  coupon === c.code
                    ? "rounded-full bg-accent px-2.5 py-1 text-[11px] font-bold text-accent-fg"
                    : "rounded-full bg-bg px-2.5 py-1 text-[11px] font-semibold text-muted"
                }
              >
                {c.code}
              </button>
            ))}
          </div>
        </section>

        <dl className="mt-5 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Subtotal</dt>
            <dd className="tabular-nums">{formatBRL(totals.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Entrega</dt>
            <dd className={totals.deliveryFee === 0 ? "font-semibold text-success" : "tabular-nums"}>
              {formatFee(totals.deliveryFee)}
            </dd>
          </div>
          {totals.discount > 0 ? (
            <div className="flex justify-between text-success">
              <dt>{totals.couponLabel}</dt>
              <dd className="tabular-nums">− {formatBRL(totals.discount)}</dd>
            </div>
          ) : null}
          <div className="flex justify-between font-display text-base font-bold">
            <dt>Total</dt>
            <dd className="tabular-nums">{formatBRL(totals.total)}</dd>
          </div>
        </dl>
      </div>

      <div className="fixed bottom-0 left-1/2 z-40 w-full max-w-phone -translate-x-1/2 bg-gradient-to-t from-bg via-bg to-transparent px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
        <Button asChild className="w-full rounded-full" size="lg">
          <Link to="/checkout">Continuar · {formatBRL(totals.total)}</Link>
        </Button>
      </div>
    </Screen>
  );
}
