import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check, ChevronLeft, Copy, Users } from "lucide-react";
import { motion } from "motion/react";
import { getDish, getRestaurant, MESA } from "@/lib/data";
import { formatBRL } from "@/lib/format";
import { usePediu } from "@/lib/store";
import { Screen } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/mesa")({ component: MesaPage });

function MesaPage() {
  const navigate = useNavigate();
  const picks = usePediu((s) => s.mesaPicks ?? []);
  const name = usePediu((s) => s.name);
  const toggle = usePediu((s) => s.toggleMesaPick);
  const loadMesa = usePediu((s) => s.loadMesa);
  const restaurant = getRestaurant(MESA.restaurantId);
  const mine = picks
    .map((id) => getDish(id))
    .filter((dish) => Boolean(dish));
  const friendTotal = MESA.seats.reduce((sum, seat) => sum + (getDish(seat.dishId)?.price ?? 0), 0);
  const mineTotal = mine.reduce((sum, dish) => sum + (dish?.price ?? 0), 0);
  const total = friendTotal + mineTotal;
  const people = 2 + (mine.length > 0 ? 1 : 0);
  const share = total / people;
  const initial = (name || "Você").slice(0, 1).toUpperCase();

  return (
    <Screen tabs={false}>
      <main className="px-4 pb-36 pt-[max(0.8rem,env(safe-area-inset-top))]">
        <div className="flex items-center gap-3">
          <Link to="/" className="grid size-11 place-items-center rounded-full bg-surface shadow-card" aria-label="Voltar">
            <ChevronLeft className="size-5" />
          </Link>
          <div className="min-w-0 flex-1">
            <p className="font-display text-[11px] font-bold uppercase tracking-wider text-primary">Mesa ao vivo</p>
            <h1 className="font-display text-xl font-extrabold leading-tight">Pediu Junto</h1>
          </div>
          <button
            type="button"
            onClick={() => {
              void navigator.clipboard?.writeText(MESA.code);
              toast.success("Código da mesa copiado");
            }}
            className="inline-flex h-11 items-center gap-1.5 rounded-full bg-ink px-3 font-display text-xs font-bold text-ink-fg"
          >
            {MESA.code}
            <Copy className="size-3.5" />
          </button>
        </div>

        <section className="relative mt-5 overflow-hidden rounded-[28px] bg-ink px-4 py-5 text-ink-fg shadow-ink">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-8 -top-10 size-40 rounded-full border border-accent/40"
            style={{ animation: "mesa-spin 18s linear infinite" }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -left-10 bottom-0 size-28 rounded-full bg-primary/30 blur-2xl"
          />
          <div className="relative flex items-center gap-4">
            <div className="relative grid size-20 shrink-0 place-items-center">
              <span
                className="absolute inset-0 rounded-full border-2 border-accent/70"
                style={{ animation: "mesa-pulse 2.4s var(--ease-out-soft) infinite" }}
              />
              <img
                src={restaurant?.image}
                alt=""
                className="size-16 rounded-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="inline-flex items-center gap-1.5 font-display text-[11px] font-bold uppercase tracking-wider text-accent">
                <Users className="size-3.5" />
                {people} na mesa
              </p>
              <p className="mt-1 font-display text-2xl font-extrabold leading-none">{restaurant?.name}</p>
              <p className="mt-1 text-sm text-ink-fg/70">Flash 99 · divide a conta em partes iguais</p>
            </div>
          </div>
          <div className="relative mt-5 flex items-center">
            <Seat initial="M" label="Mari" delay={0} />
            <Seat initial="J" label="João" delay={80} />
            <Seat initial={initial} label="Você" delay={160} you={mine.length > 0} />
          </div>
        </section>

        <section className="mt-6">
          <p className="font-display text-sm font-semibold">Já na mesa</p>
          <ul className="mt-2 grid gap-2">
            {MESA.seats.map((seat, index) => {
              const dish = getDish(seat.dishId);
              if (!dish) return null;
              return (
                <motion.li
                  key={seat.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 * index, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-center gap-3 rounded-[20px] bg-surface p-2 shadow-card"
                >
                  <img src={dish.image} alt="" className="size-14 rounded-[14px] object-cover" />
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-sm font-semibold">{dish.name}</span>
                    <span className="block truncate text-xs text-muted">
                      {seat.name}
                      {seat.note ? ` · ${seat.note}` : ""}
                    </span>
                  </span>
                  <span className="pr-2 font-display text-sm font-bold tabular-nums">{formatBRL(dish.price)}</span>
                </motion.li>
              );
            })}
          </ul>
        </section>

        <section className="mt-6">
          <p className="font-display text-sm font-semibold">Entra você</p>
          <p className="mt-0.5 text-xs text-muted">Toque pra colocar o seu na mesma sacola.</p>
          <div className="mt-2 grid gap-2">
            {MESA.offers.map((id) => {
              const dish = getDish(id);
              if (!dish) return null;
              const on = picks.includes(id);
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => toggle(id)}
                  className={cn(
                    "flex items-center gap-3 rounded-[20px] p-2 text-left shadow-card transition-[transform,background-color] duration-150 active:scale-[0.98]",
                    on ? "bg-accent text-accent-fg" : "bg-surface",
                  )}
                >
                  <img src={dish.image} alt="" className="size-14 rounded-[14px] object-cover" />
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-sm font-semibold">{dish.name}</span>
                    <span className={cn("block text-xs", on ? "text-accent-fg/75" : "text-muted")}>
                      {formatBRL(dish.price)}
                    </span>
                  </span>
                  <span
                    className={cn(
                      "mr-1 grid size-8 place-items-center rounded-full",
                      on ? "bg-ink text-ink-fg" : "bg-bg text-muted",
                    )}
                  >
                    {on ? <Check className="size-4" /> : <span className="text-lg leading-none">+</span>}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <dl className="mt-6 space-y-2 text-sm">
          <div className="flex justify-between text-muted">
            <dt>Mesa inteira</dt>
            <dd className="tabular-nums text-fg">{formatBRL(total)}</dd>
          </div>
          <div className="flex justify-between text-muted">
            <dt>Sua parte · {people}</dt>
            <dd className="font-display font-bold tabular-nums text-fg">{formatBRL(share)}</dd>
          </div>
        </dl>
      </main>

      <div className="fixed bottom-0 left-1/2 z-40 w-full max-w-phone -translate-x-1/2 bg-gradient-to-t from-bg via-bg to-transparent px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
        <Button
          className="w-full rounded-full"
          size="lg"
          onClick={() => {
            const ok = loadMesa();
            if (!ok) return;
            toast.success("Mesa na sacola");
            void navigate({ to: "/cart" });
          }}
        >
          Levar a mesa · {formatBRL(share)}
        </Button>
      </div>
    </Screen>
  );
}

function Seat({
  initial,
  label,
  delay,
  you,
}: {
  initial: string;
  label: string;
  delay: number;
  you?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay / 1000, duration: 0.35 }}
      className="mr-4 flex items-center gap-2"
    >
      <span
        className={cn(
          "grid size-10 place-items-center rounded-full font-display text-sm font-bold",
          you ? "bg-accent text-accent-fg" : "bg-ink-fg/15 text-ink-fg",
        )}
      >
        {initial}
      </span>
      <span className="text-xs font-semibold">{label}</span>
    </motion.div>
  );
}
