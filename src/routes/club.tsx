import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, Copy, Ticket, WalletCards, Zap } from "lucide-react";
import { Screen } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { clubTier, REFERRAL_CODE } from "@/lib/data";
import { formatBRL } from "@/lib/format";
import { usePediu } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/club")({ component: ClubPage });

const PERKS = [
  { title: "Pontos em todo pedido", body: "R$ 1 vira 1 ponto. No Prata, 1,2×." },
  { title: "Flash na frente", body: "Pedidos Flash 99 pulam a fila da moto." },
  { title: "Cupom de aniversário", body: "FOME20 no mês do seu Pediu." },
  { title: "Mercado relâmpago", body: "Taxa menor no Mercado Pediu depois das 22h." },
];

function ClubPage() {
  const points = usePediu((s) => s.points);
  const orders = usePediu((s) => s.orders);
  const name = usePediu((s) => s.name);
  const redeem = usePediu((s) => s.redeemPoints);
  const tier = clubTier(points);
  const progress = tier.next ? Math.min(1, points / tier.next) : 1;
  const spent = orders.reduce((s, o) => s + o.total, 0);

  return (
    <Screen>
      <main className="px-4 pb-10 pt-[max(0.8rem,env(safe-area-inset-top))]">
        <Link to="/profile" className="inline-flex items-center gap-1 text-sm font-semibold">
          <ChevronLeft className="size-4" />
          Perfil
        </Link>
        <div className="mt-4 overflow-hidden rounded-[28px] bg-ink p-5 text-ink-fg shadow-ink">
          <p className="inline-flex items-center gap-1 font-display text-[11px] font-bold uppercase tracking-wider text-accent">
            <Zap className="size-3.5 fill-accent" />
            Clube Pediu · {tier.name}
          </p>
          <h1 className="mt-3 font-display text-4xl font-extrabold tabular-nums leading-none">{points}</h1>
          <p className="mt-2 text-sm text-ink-fg/70">pontos de {name === "Você" ? "sua fome" : name.split(" ")[0]}</p>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-ink-fg/15">
            <div className="h-full rounded-full bg-accent transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" style={{ width: `${progress * 100}%` }} />
          </div>
          <p className="mt-2 text-xs text-ink-fg/60">
            {tier.next ? `Faltam ${tier.next - points} pts para o próximo nível` : "Você está no topo Flash 99"}
          </p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-[22px] bg-surface p-4 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">Pedidos</p>
            <p className="mt-1 font-display text-2xl font-bold tabular-nums">{orders.length}</p>
          </div>
          <div className="rounded-[22px] bg-surface p-4 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">Já pediu</p>
            <p className="mt-1 font-display text-2xl font-bold tabular-nums">{formatBRL(spent)}</p>
          </div>
        </div>

        <h2 className="mt-7 font-display text-lg font-bold">Trocar pontos</h2>
        <div className="mt-3 grid gap-2">
          <button
            type="button"
            onClick={() => {
              const ok = redeem(100, 8);
              toast[ok ? "success" : "error"](ok ? "R$ 8 na Pediu Pay" : "Pontos insuficientes");
            }}
            className="flex items-center justify-between rounded-[20px] bg-surface px-4 py-3 text-left shadow-card transition-transform duration-150 ease-out active:scale-[0.98]"
          >
            <span>
              <span className="block font-display text-sm font-semibold">100 pts → R$ 8</span>
              <span className="text-xs text-muted">Cai na carteira agora</span>
            </span>
            <WalletCards className="size-5 text-primary" />
          </button>
          <button
            type="button"
            onClick={() => {
              const ok = redeem(250, 20);
              toast[ok ? "success" : "error"](ok ? "R$ 20 na Pediu Pay" : "Pontos insuficientes");
            }}
            className="flex items-center justify-between rounded-[20px] bg-surface px-4 py-3 text-left shadow-card transition-transform duration-150 ease-out active:scale-[0.98]"
          >
            <span>
              <span className="block font-display text-sm font-semibold">250 pts → R$ 20</span>
              <span className="text-xs text-muted">Vale um jantar Flash</span>
            </span>
            <WalletCards className="size-5 text-primary" />
          </button>
        </div>

        <h2 className="mt-7 font-display text-lg font-bold">Indique e ganhe</h2>
        <div className="mt-3 rounded-[22px] bg-accent px-4 py-4 text-accent-fg">
          <p className="font-display text-sm font-semibold">R$ 15 pra você e pra quem chegar</p>
          <p className="mt-1 text-xs text-accent-fg/80">O código vale no primeiro pedido acima de R$ 40.</p>
          <button
            type="button"
            onClick={() => {
              void navigator.clipboard?.writeText(REFERRAL_CODE);
              toast.success(`${REFERRAL_CODE} copiado`);
            }}
            className="mt-3 inline-flex h-10 items-center gap-2 rounded-full bg-ink px-4 font-display text-sm font-bold text-ink-fg"
          >
            <Copy className="size-4" />
            {REFERRAL_CODE}
          </button>
        </div>

        <h2 className="mt-7 font-display text-lg font-bold">Vantagens</h2>
        <ul className="mt-3 grid gap-2">
          {PERKS.map((p) => (
            <li key={p.title} className="rounded-[20px] bg-surface px-4 py-3 shadow-card">
              <p className="font-display text-sm font-semibold">{p.title}</p>
              <p className="mt-0.5 text-xs text-muted">{p.body}</p>
            </li>
          ))}
        </ul>

        <Button asChild className="mt-6 w-full rounded-full">
          <Link to="/search" search={{ q: undefined }}>
            <Ticket className="size-4" />
            Usar pontos agora
          </Link>
        </Button>
      </main>
    </Screen>
  );
}
