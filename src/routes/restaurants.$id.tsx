import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, Clock, Heart, MapPin, Star, Zap } from "lucide-react";
import { useMemo, useState } from "react";
import { Drawer } from "vaul";
import { DishSheet } from "@/components/dish-sheet";
import { Screen } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { dishesOf, getRestaurant, hoursFor, isOpenNow, reviewsFor, shownFee, shownRating, type Dish, type Extra } from "@/lib/data";
import { formatBRL, formatFee, formatRange } from "@/lib/format";
import { SHOP_ID } from "@/lib/lane";
import { usePediu } from "@/lib/store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/restaurants/$id")({
  component: RestaurantPage,
});

function RestaurantPage() {
  const { id } = Route.useParams();
  const restaurant = getRestaurant(id);
  const dishes = dishesOf(id);
  const fav = usePediu((s) => s.favorites.includes(id));
  const toggleFav = usePediu((s) => s.toggleFavorite);
  const replaceCartWith = usePediu((s) => s.replaceCartWith);
  const userRating = usePediu((s) => s.ratings?.[id]);
  const points = usePediu((s) => s.points);
  const shopOpen = usePediu((s) => s.shopOpen);
  const pausedDishes = usePediu((s) => s.pausedDishes ?? []);
  const kitchenClosed = id === SHOP_ID && shopOpen === false;
  const [activeCat, setActiveCat] = useState("Tudo");
  const [selected, setSelected] = useState<Dish | null>(null);
  const [conflict, setConflict] = useState<{
    dishId: string;
    extras: Extra[];
    qty: number;
    notes: string;
  } | null>(null);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(dishes.map((d) => d.category)));
    return ["Tudo", ...cats];
  }, [dishes]);

  const visible = activeCat === "Tudo" ? dishes : dishes.filter((d) => d.category === activeCat);
  const shown = restaurant ? shownRating(restaurant.rating, restaurant.reviewCount, userRating) : null;
  const fee = restaurant ? shownFee(restaurant.deliveryFee, restaurant.flash, points) : 0;

  if (!restaurant) {
    return (
      <Screen tabs={false}>
        <div className="px-6 py-24 text-center">
          <p className="font-display text-xl font-bold">Restaurante sumiu</p>
          <Link to="/" className="mt-4 inline-block text-sm font-semibold text-primary">
            Voltar ao início
          </Link>
        </div>
      </Screen>
    );
  }

  return (
    <Screen peek>
      <article>
        <div className="relative h-56">
          <img src={restaurant.image} alt="" className="size-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/10 to-ink/25" />
          <div className="absolute left-3 top-[max(0.7rem,env(safe-area-inset-top))] flex w-[calc(100%-1.5rem)] items-center justify-between">
            <Link
              to="/"
              className="grid size-11 place-items-center rounded-full bg-surface text-fg shadow-card"
              aria-label="Voltar"
            >
              <ChevronLeft className="size-5" />
            </Link>
            <button
              type="button"
              onClick={() => toggleFav(id)}
              className="grid size-11 place-items-center rounded-full bg-surface shadow-card"
              aria-label="Favoritar"
            >
              <Heart className={cn("size-5", fav && "fill-primary text-primary")} />
            </button>
          </div>
        </div>

        <div className="-mt-8 rounded-t-[32px] bg-bg px-4 pb-6 pt-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="font-display text-[1.7rem] font-extrabold leading-tight">{restaurant.name}</h1>
              <p className="mt-1 flex items-center gap-1 text-sm text-muted">
                <MapPin className="size-3.5" />
                {restaurant.cuisine} · {restaurant.neighborhood} · {restaurant.distanceKm.toFixed(1)} km
              </p>
            </div>
            {restaurant.flash ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 font-display text-[11px] font-bold text-accent-fg">
                <Zap className="size-3.5 fill-accent-fg" />
                Flash
              </span>
            ) : null}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
            <span className="inline-flex items-center gap-1 font-display font-semibold">
              <Star className="size-4 fill-accent text-accent" />
              {shown?.score.toFixed(1)}
              <span className="font-sans font-medium text-muted">
                ({shown?.count.toLocaleString("pt-BR")})
              </span>
            </span>
            <span className="inline-flex items-center gap-1 text-muted">
              <Clock className="size-4" />
              {formatRange(restaurant.deliveryMin, restaurant.deliveryMax)}
            </span>
            <span className={fee === 0 ? "font-semibold text-success" : "text-muted"}>
              {formatFee(fee)}
            </span>
            <span className="text-muted">{hoursFor(restaurant.flash)}</span>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-muted">{restaurant.about}</p>

          {kitchenClosed ? (
            <p className="mt-3 rounded-[16px] bg-ink px-3 py-2 text-xs font-semibold text-ink-fg">
              Loja pausada pelo lojista. A cozinha não está aceitando agora.
            </p>
          ) : !isOpenNow(restaurant.flash) ? (
            <p className="mt-3 rounded-[16px] bg-accent px-3 py-2 text-xs font-semibold text-accent-fg">
              Cozinha abre às 10:00. Pode pedir agora — a gente agenda.
            </p>
          ) : null}

          <div className="mt-4 grid gap-2">
            {reviewsFor(restaurant.id).map((rev) => (
              <div key={rev.name} className="rounded-[18px] bg-surface px-3 py-2.5 shadow-card">
                <p className="flex items-center gap-1.5 text-xs font-semibold">
                  {rev.name}
                  <Star className="size-3 fill-accent text-accent" />
                  <span className="tabular-nums">{rev.rating.toFixed(1)}</span>
                </p>
                <p className="mt-0.5 text-sm text-muted">{rev.text}</p>
              </div>
            ))}
          </div>

          <div className="no-scrollbar sticky top-0 z-10 -mx-4 mt-5 flex gap-2 overflow-x-auto bg-bg/95 px-4 py-2 backdrop-blur-sm">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCat(cat)}
                className={cn(
                  "h-9 shrink-0 rounded-full px-3 text-xs font-semibold transition-[background-color,color] duration-150",
                  activeCat === cat ? "bg-ink text-ink-fg" : "bg-surface text-muted shadow-card",
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          <ul className="mt-1 divide-y divide-border">
            {visible.map((dish) => (
              <li key={dish.id}>
                <button
                  type="button"
                  onClick={() => {
                    if (kitchenClosed) {
                      toast.error("Loja pausada");
                      return;
                    }
                    if (pausedDishes.includes(dish.id)) {
                      toast.error("Prato pausado na cozinha");
                      return;
                    }
                    setSelected(dish);
                  }}
                  className="flex w-full gap-3 py-4 text-left"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-display text-[15px] font-semibold leading-tight">{dish.name}</p>
                      {pausedDishes.includes(dish.id) ? (
                        <span className="rounded-full bg-ink px-1.5 py-0.5 text-[10px] font-bold text-ink-fg">pausado</span>
                      ) : dish.popular ? (
                        <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary">
                          popular
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted">{dish.description}</p>
                    <p className="mt-2 font-display text-sm font-bold tabular-nums">{formatBRL(dish.price)}</p>
                  </div>
                  <img src={dish.image} alt="" className="size-[5.5rem] shrink-0 rounded-[18px] object-cover" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </article>

      <DishSheet
        dish={selected}
        restaurant={restaurant}
        open={Boolean(selected)}
        onOpenChange={(o) => {
          if (!o) setSelected(null);
        }}
        onConflict={(payload) => setConflict(payload)}
      />

      <Drawer.Root open={Boolean(conflict)} onOpenChange={(o) => !o && setConflict(null)}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 z-50 bg-ink/50" />
          <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-phone rounded-t-[32px] bg-bg px-5 pb-[max(1.2rem,env(safe-area-inset-bottom))] pt-4">
            <div className="mx-auto h-1.5 w-12 rounded-full bg-border-strong" />
            <Drawer.Title className="mt-4 font-display text-xl font-bold">Trocar de restaurante?</Drawer.Title>
            <Drawer.Description className="mt-2 text-sm text-muted">
              A sacola hoje é de outro lugar. Se continuar, a gente esvazia ela e começa este pedido.
            </Drawer.Description>
            <div className="mt-5 grid gap-2">
              <Button
                onClick={() => {
                  if (!conflict) return;
                  replaceCartWith(conflict);
                  toast.success("Sacola trocada");
                  setConflict(null);
                  setSelected(null);
                }}
              >
                Trocar e adicionar
              </Button>
              <Button variant="surface" onClick={() => setConflict(null)}>
                Manter sacola
              </Button>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </Screen>
  );
}
