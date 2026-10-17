import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Bell, ChevronDown, ChevronRight, MapPin, Radio, RotateCcw, ScanSearch, Sparkles, Store, Users, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { AddressSheet } from "@/components/address-sheet";
import { DealsStrip } from "@/components/deals-strip";
import { FlashRadar } from "@/components/flash-radar";
import { LiveBanner } from "@/components/live-banner";
import { LiveTicker } from "@/components/live-ticker";
import { NotifSheet } from "@/components/notif-sheet";
import { PromoReel } from "@/components/promo-reel";
import { RestaurantCard } from "@/components/restaurant-card";
import { Screen } from "@/components/shell";
import { Stories } from "@/components/stories";
import { deliveryClock, useNow } from "@/lib/clock";
import {
  CATEGORIES,
  collectionsForHour,
  flashRestaurants,
  getAddress,
  isOpenNow,
  RESTAURANTS,
  shownFee,
  shownRating,
  type Restaurant,
} from "@/lib/data";
import { greetingForHour, hungerLine } from "@/lib/format";
import { usePediu } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const addressId = usePediu((s) => s.addressId);
  const name = usePediu((s) => s.name);
  const points = usePediu((s) => s.points);
  const ratings = usePediu((s) => s.ratings);
  const unread = usePediu((s) => s.notifications.filter((n) => !n.read).length);
  const orders = usePediu((s) => s.orders);
  const addToCart = usePediu((s) => s.addToCart);
  const clearCart = usePediu((s) => s.clearCart);
  const navigate = useNavigate();
  const now = useNow();
  const address = getAddress(addressId);
  const hour = new Date().getHours();
  const greet = greetingForHour(hour);
  const collection = collectionsForHour(hour);
  const featured = useMemo(
    () =>
      collection.ids
        .map((id) => RESTAURANTS.find((r) => r.id === id))
        .filter((r): r is Restaurant => Boolean(r)),
    [collection.ids],
  );
  const flash = flashRestaurants().filter((r) => r.id !== "mercado-pediu");
  const [filter, setFilter] = useState<"all" | "flash" | "free" | "top" | "open">("all");
  const [addrOpen, setAddrOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const lastDone = orders.find((o) => deliveryClock(o, now).status === "delivered");

  const list = RESTAURANTS.filter((r) => {
    if (r.id === "mercado-pediu") return false;
    if (filter === "flash") return r.flash;
    if (filter === "free") return shownFee(r.deliveryFee, r.flash, points) === 0;
    if (filter === "top") return shownRating(r.rating, r.reviewCount, ratings?.[r.id]).score >= 4.7;
    if (filter === "open") return isOpenNow(r.flash);
    return true;
  });

  return (
    <Screen peek>
      <main className="pb-4">
        <header className="flex items-start justify-between px-4 pt-[max(0.9rem,env(safe-area-inset-top))]">
          <div>
            <button
              type="button"
              onClick={() => setAddrOpen(true)}
              className="flex items-center gap-1.5 text-muted transition-transform duration-150 ease-out active:scale-[0.96]"
            >
              <MapPin className="size-4 text-primary" />
              <span className="text-xs font-medium">{address.label}</span>
              <ChevronDown className="size-3.5" />
            </button>
            <motion.p
              initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="mt-2 font-display text-3xl font-extrabold leading-[1.1] tracking-tight"
            >
              {greet}
              {name !== "Você" ? `, ${name.split(" ")[0]}` : ""}.
            </motion.p>
            <p className="mt-1 text-sm text-muted">{hungerLine(hour)}</p>
          </div>
          <button
            type="button"
            onClick={() => setNotifOpen(true)}
            className="relative mt-1 grid size-11 place-items-center rounded-full bg-surface shadow-card"
            aria-label="Avisos"
          >
            <Bell className="size-5" />
            {unread > 0 ? (
              <span className="absolute right-1.5 top-1.5 size-2.5 rounded-full bg-primary" />
            ) : null}
          </button>
        </header>

        <Link
          to="/search"
          search={{ q: undefined }}
          className="mx-4 mt-4 flex h-12 items-center gap-3 rounded-full bg-surface px-4 shadow-card transition-transform duration-150 ease-out active:scale-[0.98]"
        >
          <ScanSearch className="size-5 text-muted" />
          <span className="text-sm text-subtle">Pizza, açaí, feijoada, mercado…</span>
        </Link>

        <LiveTicker />
        <LiveBanner />

        {lastDone ? (
          <section className="px-4 pt-4">
            <button
              type="button"
              onClick={() => {
                clearCart();
                lastDone.items.forEach((item) => {
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
              className="flex w-full items-center gap-3 rounded-[22px] bg-surface px-3 py-3 text-left shadow-card transition-transform duration-150 ease-out active:scale-[0.98]"
            >
              <img src={lastDone.restaurantImage} alt="" className="size-12 rounded-[14px] object-cover" />
              <span className="min-w-0 flex-1">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-muted">Pedir de novo</span>
                <span className="block truncate font-display text-sm font-semibold">{lastDone.restaurantName}</span>
              </span>
              <RotateCcw className="size-4 text-primary" />
            </button>
          </section>
        ) : null}

        <section className="mt-5">
          <Stories />
        </section>

        <PromoReel />

        <DealsStrip />

        <section className="mt-5 px-4">
          <div className="grid grid-cols-2 gap-2.5">
            <Link
              to="/taste"
              className="relative overflow-hidden rounded-[24px] bg-primary p-4 text-primary-fg shadow-red transition-transform duration-150 ease-out active:scale-[0.97]"
            >
              <Sparkles className="size-5" />
              <p className="mt-6 font-display text-base font-bold leading-tight">O que pedir?</p>
              <p className="mt-1 text-xs text-primary-fg/80">Sabor do momento</p>
            </Link>
            <Link
              to="/market"
              className="relative overflow-hidden rounded-[24px] bg-ink p-4 text-ink-fg transition-transform duration-150 ease-out active:scale-[0.97]"
            >
              <Store className="size-5 text-accent" />
              <p className="mt-6 font-display text-base font-bold leading-tight">Pediu Entregas</p>
              <p className="mt-1 text-xs text-ink-fg/70">Lista do mercado</p>
            </Link>
          </div>
          <FlashRadar />
          <Link
            to="/golive"
            className="mt-2.5 flex items-center justify-between rounded-[22px] bg-accent px-4 py-3 text-accent-fg shadow-card active:scale-[0.98]"
          >
            <span>
              <span className="block font-display text-[11px] font-bold uppercase tracking-wider">Go Live</span>
              <span className="block font-display text-sm font-bold">Abrir a cidade</span>
            </span>
            <Radio className="size-5" />
          </Link>
          <Link
            to="/mesa"
            className="mt-2.5 flex items-center gap-3 rounded-[24px] bg-ink p-3 text-ink-fg shadow-ink transition-transform duration-150 ease-out active:scale-[0.98]"
          >
            <span className="relative grid size-14 shrink-0 place-items-center">
              <span
                className="absolute inset-1 rounded-full border border-accent"
                style={{ animation: "mesa-pulse 2.2s var(--ease-out-soft) infinite" }}
              />
              <span className="grid size-9 place-items-center rounded-full bg-accent font-display text-sm font-bold text-accent-fg">
                <Users className="size-4" />
              </span>
            </span>
            <span className="min-w-0">
              <span className="block font-display text-[11px] font-bold uppercase tracking-wider text-accent">
                Mesa ao vivo · AUG-7K
              </span>
              <span className="block font-display text-base font-bold leading-tight">Mari e João já pediram</span>
              <span className="block text-xs text-ink-fg/70">Smash Club · divide a conta</span>
            </span>
          </Link>
        </section>

        <section className="mt-5">
          <div className="no-scrollbar flex gap-3 overflow-x-auto px-4">
            {CATEGORIES.map((cat) =>
              cat.special === "market" ? (
                <Link key={cat.id} to="/market" className="flex w-[4.5rem] shrink-0 flex-col items-center gap-1.5">
                  <span className="size-[4.5rem] overflow-hidden rounded-[22px] shadow-card">
                    <img src={cat.image} alt="" className="size-full object-cover" />
                  </span>
                  <span className="text-center text-[11px] font-semibold">{cat.label}</span>
                </Link>
              ) : (
                <Link
                  key={cat.id}
                  to="/search"
                  search={{ q: cat.cuisine ?? "flash" }}
                  className="flex w-[4.5rem] shrink-0 flex-col items-center gap-1.5"
                >
                  <span className="size-[4.5rem] overflow-hidden rounded-[22px] shadow-card">
                    <img src={cat.image} alt="" className="size-full object-cover" />
                  </span>
                  <span className="text-center text-[11px] font-semibold">{cat.label}</span>
                </Link>
              ),
            )}
          </div>
        </section>

        <section className="mt-6">
          <div className="mb-3 flex items-end justify-between px-4">
            <div>
              <p className="inline-flex items-center gap-1 font-display text-xs font-bold uppercase tracking-wider text-fg">
                <Zap className="size-3.5 fill-accent text-accent" />
                Flash 99
              </p>
              <h2 className="font-display text-lg font-bold">Chega quase agora</h2>
            </div>
            <Link to="/search" search={{ q: "flash" }} className="text-sm font-semibold text-primary">
              Ver
            </Link>
          </div>
          <div className="no-scrollbar flex gap-3 overflow-x-auto px-4">
            {flash.map((r) => (
              <div key={r.id} className="w-[18.5rem] shrink-0">
                <RestaurantCard restaurant={r} featured />
              </div>
            ))}
          </div>
        </section>

        <section className="mt-7 px-4">
          <div className="mb-3 flex items-end justify-between">
            <h2 className="font-display text-lg font-bold">{collection.title}</h2>
            <ChevronRight className="size-5 text-subtle" />
          </div>
          <div className="grid gap-3">
            {featured.map((r) => (
              <RestaurantCard key={r.id} restaurant={r} />
            ))}
          </div>
        </section>

        <section className="mt-7 px-4 pb-2">
          <h1 className="sr-only">Pediu</h1>
          <h2 className="font-display text-lg font-bold">Perto de você</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {(
              [
                ["all", "Tudo"],
                ["open", "Aberto"],
                ["flash", "Flash"],
                ["free", "Entrega grátis"],
                ["top", "Nota 4.7+"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setFilter(id)}
                className={
                  filter === id
                    ? "h-9 rounded-full bg-ink px-3 text-xs font-semibold text-ink-fg"
                    : "h-9 rounded-full bg-surface px-3 text-xs font-semibold text-muted shadow-card"
                }
              >
                {label}
              </button>
            ))}
          </div>
          <div className="mt-3 grid gap-3">
            {list.map((r) => (
              <RestaurantCard key={r.id} restaurant={r} />
            ))}
          </div>
        </section>
      </main>
      <AddressSheet open={addrOpen} onOpenChange={setAddrOpen} />
      <NotifSheet open={notifOpen} onOpenChange={setNotifOpen} />
    </Screen>
  );
}
