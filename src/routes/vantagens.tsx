import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChevronLeft, Ticket } from "lucide-react";
import { Screen } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { COUPONS } from "@/lib/data";
import { usePediu } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/vantagens")({ component: VantagensPage });

function offer(type: string, value: number) {
  if (type === "percent") return `${value}% de desconto`;
  if (type === "delivery") return "Entrega por conta do Pediu";
  return `R$ ${value.toFixed(2).replace(".", ",")} de desconto`;
}

function VantagensPage() {
  const setCoupon = usePediu((s) => s.setCoupon);
  const cart = usePediu((s) => s.cart);
  const navigate = useNavigate();

  return (
    <Screen>
      <main className="px-4 pb-10 pt-[max(0.9rem,env(safe-area-inset-top))]">
        <Link to="/profile" className="inline-flex items-center gap-1 text-sm font-semibold">
          <ChevronLeft className="size-4" />
          Perfil
        </Link>
        <div className="mt-4 rounded-[28px] bg-ink p-5 text-ink-fg shadow-ink">
          <p className="font-display text-[11px] font-bold uppercase tracking-wider text-accent">Vantagens reais</p>
          <h1 className="mt-2 font-display text-3xl font-extrabold leading-none">Leve uma vantagem no próximo pedido.</h1>
          <p className="mt-2 text-sm text-ink-fg/70">O código entra no fechamento. Se o pedido não atingir o mínimo, o desconto não aplica.</p>
        </div>
        <div className="mt-4 grid gap-2">
          {COUPONS.map((coupon) => (
            <article key={coupon.code} className="rounded-[22px] bg-surface p-3 shadow-card">
              <div className="flex items-start gap-3">
                <span className="grid size-11 shrink-0 place-items-center rounded-[16px] bg-primary/10 text-primary">
                  <Ticket className="size-5" />
                </span>
                <div>
                  <p className="font-display text-base font-bold">{offer(coupon.type, coupon.value)}</p>
                  <p className="text-sm text-muted">
                    Código <span className="font-bold text-primary">{coupon.code}</span>
                  </p>
                  <p className="text-xs text-muted">{coupon.description}</p>
                </div>
              </div>
              <Button
                className="mt-3 w-full rounded-full"
                onClick={() => {
                  setCoupon(coupon.code);
                  toast.success(`${coupon.code} no pedido`);
                  if (cart.length) void navigate({ to: "/checkout" });
                }}
              >
                Usar no checkout
              </Button>
            </article>
          ))}
        </div>
      </main>
    </Screen>
  );
}
