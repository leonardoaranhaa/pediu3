import { createFileRoute } from "@tanstack/react-router";
import { LaneBar } from "@/components/lane-bar";
import { PhoneFrame } from "@/components/shell";
import { dishesOf } from "@/lib/data";
import { formatBRL } from "@/lib/format";
import { SHOP_ID } from "@/lib/lane";
import { usePediu } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/loja/cardapio")({ component: CardapioPage });

function CardapioPage() {
  const dishes = dishesOf(SHOP_ID);
  const paused = usePediu((s) => s.pausedDishes ?? []);
  const toggle = usePediu((s) => s.toggleDishPause);

  return (
    <PhoneFrame>
      <div className="flex min-h-dvh flex-col">
        <main className="flex-1 px-4 pb-6 pt-[max(0.9rem,env(safe-area-inset-top))]">
          <p className="font-display text-[11px] font-bold uppercase tracking-wider text-primary">Lojista</p>
          <h1 className="mt-1 font-display text-2xl font-extrabold leading-none">Cardápio</h1>
          <p className="mt-2 text-sm text-muted">Pausar tira o prato da sacola do cliente na hora.</p>
          <ul className="mt-4 grid gap-2">
            {dishes.map((dish) => {
              const off = paused.includes(dish.id);
              return (
                <li key={dish.id}>
                  <button
                    type="button"
                    onClick={() => toggle(dish.id)}
                    className="flex w-full items-center gap-3 rounded-[20px] bg-surface p-2 text-left shadow-card active:scale-[0.98]"
                  >
                    <img src={dish.image} alt="" className={cn("size-14 rounded-[14px] object-cover", off && "opacity-40")} />
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-sm font-semibold">{dish.name}</span>
                      <span className="text-xs text-muted">{formatBRL(dish.price)}</span>
                    </span>
                    <span
                      className={cn(
                        "mr-1 rounded-full px-2.5 py-1 text-[11px] font-bold",
                        off ? "bg-ink text-ink-fg" : "bg-success text-success-fg",
                      )}
                    >
                      {off ? "Pausado" : "No ar"}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </main>
        <LaneBar lane="loja" />
      </div>
    </PhoneFrame>
  );
}
