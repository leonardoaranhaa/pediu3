import { createFileRoute, Link } from "@tanstack/react-router";
import { Bike, ChevronRight, Heart, HelpCircle, MapPin, ShoppingBasket, Store, Ticket, UserRound, Users, WalletCards, Zap } from "lucide-react";
import { useState } from "react";
import { RestaurantRow } from "@/components/restaurant-card";
import { Screen } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { ADDRESSES, clubTier, COUPONS, getRestaurant } from "@/lib/data";
import { formatBRL } from "@/lib/format";
import { usePediu } from "@/lib/store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/profile")({ component: ProfilePage });

function ProfilePage() {
  const name = usePediu((s) => s.name);
  const setName = usePediu((s) => s.setName);
  const addressId = usePediu((s) => s.addressId);
  const setAddress = usePediu((s) => s.setAddress);
  const favorites = usePediu((s) => s.favorites);
  const points = usePediu((s) => s.points);
  const wallet = usePediu((s) => s.wallet);
  const [draft, setDraft] = useState(name);
  const favRestaurants = favorites.map(getRestaurant).filter((r) => Boolean(r));
  const tier = clubTier(points);
  const progress = tier.next ? Math.min(1, points / tier.next) : 1;

  return (
    <Screen>
      <main className="px-4 pb-10 pt-[max(0.9rem,env(safe-area-inset-top))]">
        <div className="flex items-center gap-3">
          <div className="grid size-14 place-items-center rounded-[20px] bg-primary text-primary-fg">
            <UserRound className="size-7" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-extrabold leading-tight">{name}</h1>
            <p className="text-sm text-muted">
              Clube {tier.name} · {points} pts
            </p>
          </div>
        </div>

        <Link
          to="/club"
          className="mt-5 block overflow-hidden rounded-[24px] bg-ink p-4 text-ink-fg shadow-ink transition-transform duration-150 ease-out active:scale-[0.98]"
        >
          <p className="inline-flex items-center gap-1 font-display text-[11px] font-bold uppercase tracking-wider text-accent">
            <Zap className="size-3.5 fill-accent" />
            Clube Pediu
          </p>
          <p className="mt-2 font-display text-lg font-bold">{tier.perk}</p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ink-fg/15">
            <div className="h-full rounded-full bg-accent" style={{ width: `${progress * 100}%` }} />
          </div>
          <p className="mt-2 text-xs text-ink-fg/65">
            {tier.next ? `${points} / ${tier.next} para o próximo nível` : "Nível máximo Flash 99"}
          </p>
        </Link>

        <Link
          to="/mesa"
          className="mt-3 flex items-center justify-between rounded-[22px] bg-surface px-4 py-3 shadow-card transition-transform duration-150 ease-out active:scale-[0.98]"
        >
          <span className="inline-flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-full bg-ink text-accent">
              <Users className="size-5" />
            </span>
            <span>
              <span className="block font-display text-sm font-semibold">Pediu Mesa</span>
              <span className="text-xs text-muted">AUG-7K · Mari e João</span>
            </span>
          </span>
          <ChevronRight className="size-4 text-subtle" />
        </Link>

        <Link
          to="/wallet"
          className="mt-3 flex items-center justify-between rounded-[22px] bg-surface px-4 py-3 shadow-card transition-transform duration-150 ease-out active:scale-[0.98]"
        >
          <span className="inline-flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-full bg-accent text-accent-fg">
              <WalletCards className="size-5" />
            </span>
            <span>
              <span className="block font-display text-sm font-semibold">Pediu Pay</span>
              <span className="text-xs text-muted">Carteira · cashback 2%</span>
            </span>
          </span>
          <span className="font-display text-sm font-bold tabular-nums">{formatBRL(wallet)}</span>
        </Link>

        <label className="mt-5 block rounded-[22px] bg-surface p-4 shadow-card">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">Como te chamamos</span>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={() => setName(draft)}
            className="mt-1 w-full bg-transparent font-display text-lg font-semibold outline-none"
          />
        </label>

        <section className="mt-5">
          <p className="inline-flex items-center gap-1.5 font-display text-sm font-semibold">
            <MapPin className="size-4 text-primary" />
            Endereços
          </p>
          <div className="mt-2 grid gap-2">
            {ADDRESSES.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => setAddress(a.id)}
                className={cn(
                  "rounded-[18px] px-3 py-3 text-left transition-[background-color] duration-150",
                  addressId === a.id ? "bg-ink text-ink-fg" : "bg-surface shadow-card",
                )}
              >
                <p className="font-display text-sm font-semibold">{a.label}</p>
                <p className={addressId === a.id ? "text-xs text-ink-fg/70" : "text-xs text-muted"}>
                  {a.street} · {a.neighborhood}
                </p>
              </button>
            ))}
          </div>
        </section>

        <section className="mt-5">
          <p className="inline-flex items-center gap-1.5 font-display text-sm font-semibold">
            <Ticket className="size-4 text-primary" />
            Cupons
          </p>
          <div className="mt-2 grid gap-2">
            {COUPONS.map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => {
                  void navigator.clipboard?.writeText(c.code);
                  toast.success(`${c.code} copiado`);
                }}
                className="flex items-center justify-between rounded-[18px] bg-surface px-3 py-3 text-left shadow-card"
              >
                <span>
                  <span className="block font-display text-sm font-bold">{c.code}</span>
                  <span className="text-xs text-muted">{c.description}</span>
                </span>
                <span className="text-xs font-semibold text-primary">{c.label}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="mt-5">
          <p className="inline-flex items-center gap-1.5 font-display text-sm font-semibold">
            <Heart className="size-4 text-primary" />
            Favoritos
          </p>
          {favRestaurants.length === 0 ? (
            <p className="mt-2 text-sm text-muted">Nada salvo ainda. Toque no coração na loja.</p>
          ) : (
            <div className="mt-2 grid gap-2">
              {favRestaurants.map((r) => (r ? <RestaurantRow key={r.id} restaurant={r} /> : null))}
            </div>
          )}
        </section>

        <section className="mt-5">
          <p className="font-display text-sm font-semibold">Trabalhar no Pediu</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <Link to="/loja" className="rounded-[22px] bg-ink p-3 text-ink-fg shadow-ink active:scale-[0.98]">
              <Store className="size-5 text-accent" />
              <span className="mt-6 block font-display text-sm font-bold">Lojista</span>
              <span className="text-xs text-ink-fg/70">Cozinha Smash</span>
            </Link>
            <Link to="/moto" className="rounded-[22px] bg-primary p-3 text-primary-fg shadow-red active:scale-[0.98]">
              <Bike className="size-5" />
              <span className="mt-6 block font-display text-sm font-bold">Motoboy</span>
              <span className="text-xs text-primary-fg/80">Radar Flash</span>
            </Link>
          </div>
          <Link to="/feira" className="mt-2 flex items-center gap-3 rounded-[22px] bg-accent p-3 text-accent-fg active:scale-[0.98]">
            <ShoppingBasket className="size-5" />
            <span>
              <span className="block font-display text-sm font-bold">Balcão do mercado</span>
              <span className="text-xs text-accent-fg/80">Grade, lista e retirada</span>
            </span>
          </Link>
        </section>

        <Link
          to="/help"
          className="mt-5 flex w-full items-center justify-between rounded-[18px] bg-surface px-3 py-3 text-sm font-semibold shadow-card"
        >
          <span className="inline-flex items-center gap-2">
            <HelpCircle className="size-4" />
            Ajuda
          </span>
          <ChevronRight className="size-4 text-subtle" />
        </Link>

        <p className="mt-6 text-center text-xs text-subtle">Pediu · comida e mercado · São Paulo</p>
        <Button asChild variant="ghost" className="mx-auto mt-1">
          <Link to="/taste">Sabor do momento</Link>
        </Button>
      </main>
    </Screen>
  );
}
