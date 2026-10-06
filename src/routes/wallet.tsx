import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, Plus, WalletCards } from "lucide-react";
import { Screen } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { formatBRL } from "@/lib/format";
import { usePediu } from "@/lib/store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/wallet")({ component: WalletPage });

const TOPUPS = [20, 50, 100] as const;

function WalletPage() {
  const wallet = usePediu((s) => s.wallet);
  const tx = usePediu((s) => s.walletTx);
  const topUp = usePediu((s) => s.topUp);
  const setPayment = usePediu((s) => s.setPayment);
  const payment = usePediu((s) => s.payment);

  return (
    <Screen>
      <main className="px-4 pb-10 pt-[max(0.8rem,env(safe-area-inset-top))]">
        <Link to="/profile" className="inline-flex items-center gap-1 text-sm font-semibold">
          <ChevronLeft className="size-4" />
          Perfil
        </Link>

        <div className="relative mt-4 overflow-hidden rounded-[28px] bg-ink p-5 text-ink-fg shadow-ink">
          <span className="pointer-events-none absolute -right-8 -top-10 size-36 rounded-full bg-primary/30" />
          <span className="pointer-events-none absolute -bottom-12 right-10 size-28 rounded-full bg-accent/25" />
          <p className="inline-flex items-center gap-1.5 font-display text-[11px] font-bold uppercase tracking-wider text-accent">
            <WalletCards className="size-3.5" />
            Pediu Pay
          </p>
          <p className="mt-4 font-display text-4xl font-extrabold tabular-nums leading-none">{formatBRL(wallet)}</p>
          <p className="mt-2 text-sm text-ink-fg/65">2% de cashback em todo pedido. Paga como Pix, sem abrir o banco.</p>
          <div className="mt-5 flex gap-2">
            {TOPUPS.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => {
                  topUp(n);
                  toast.success(`+ ${formatBRL(n)} na carteira`);
                }}
                className="flex h-10 flex-1 items-center justify-center gap-1 rounded-full bg-ink-fg/10 text-xs font-bold tabular-nums transition-transform duration-150 ease-out active:scale-[0.96]"
              >
                <Plus className="size-3.5" />
                {n}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setPayment("wallet");
            toast.success("Pediu Pay no checkout");
          }}
          className={cn(
            "mt-4 flex w-full items-center justify-between rounded-[20px] px-4 py-3 text-left shadow-card",
            payment === "wallet" ? "bg-accent text-accent-fg" : "bg-surface",
          )}
        >
          <span>
            <span className="block font-display text-sm font-semibold">Pagar com Pediu Pay</span>
            <span className={cn("text-xs", payment === "wallet" ? "text-accent-fg/80" : "text-muted")}>
              {payment === "wallet" ? "Selecionado no próximo pedido" : "Um toque no checkout"}
            </span>
          </span>
        </button>

        <h2 className="mt-7 font-display text-lg font-bold">Movimentações</h2>
        {tx.length === 0 ? (
          <p className="mt-2 text-sm text-muted">Nada ainda. O primeiro cashback cai depois do pedido.</p>
        ) : (
          <ul className="mt-3 grid gap-2">
            {tx.map((t) => (
              <li key={t.id} className="flex items-center justify-between rounded-[18px] bg-surface px-3 py-3 shadow-card">
                <span>
                  <span className="block font-display text-sm font-semibold">{t.label}</span>
                  <span className="text-[11px] text-subtle">
                    {new Date(t.at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </span>
                <span
                  className={cn(
                    "font-display text-sm font-bold tabular-nums",
                    t.amount < 0 ? "text-fg" : "text-success",
                  )}
                >
                  {t.amount < 0 ? "− " : "+ "}
                  {formatBRL(Math.abs(t.amount))}
                </span>
              </li>
            ))}
          </ul>
        )}

        <Button asChild className="mt-6 w-full rounded-full">
          <Link to="/">Pedir com a carteira</Link>
        </Button>
      </main>
    </Screen>
  );
}
