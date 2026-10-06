import { Link } from "@tanstack/react-router";
import { Clock, Heart, Star, Zap } from "lucide-react";
import { isOpenNow, shownFee, shownRating, type Restaurant } from "@/lib/data";
import { formatFee, formatRange } from "@/lib/format";
import { usePediu } from "@/lib/store";
import { cn } from "@/lib/utils";

export function RestaurantCard({
  restaurant,
  featured = false,
}: {
  restaurant: Restaurant;
  featured?: boolean;
}) {
  const fav = usePediu((s) => s.favorites.includes(restaurant.id));
  const toggle = usePediu((s) => s.toggleFavorite);
  const userRating = usePediu((s) => s.ratings?.[restaurant.id]);
  const points = usePediu((s) => s.points);
  const shown = shownRating(restaurant.rating, restaurant.reviewCount, userRating);
  const fee = shownFee(restaurant.deliveryFee, restaurant.flash, points);

  return (
    <Link
      to="/restaurants/$id"
      params={{ id: restaurant.id }}
      className={cn(
        "group relative block overflow-hidden bg-surface shadow-card transition-[transform,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.98]",
        featured ? "rounded-[28px]" : "rounded-[24px]",
      )}
    >
      <div className={cn("relative overflow-hidden", featured ? "h-44" : "h-36")}>
        <img
          src={restaurant.image}
          alt=""
          className="size-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/0 to-ink/10" />
        {restaurant.flash ? (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 font-display text-[11px] font-bold text-accent-fg">
            <Zap className="size-3.5 fill-accent-fg" />
            Flash {restaurant.deliveryMax} min
          </span>
        ) : !isOpenNow(restaurant.flash) ? (
          <span className="absolute left-3 top-3 rounded-full bg-ink/70 px-2.5 py-1 font-display text-[11px] font-bold text-ink-fg backdrop-blur-sm">
            Abre às 10:00
          </span>
        ) : null}
        <button
          type="button"
          aria-label={fav ? "Remover dos favoritos" : "Favoritar"}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggle(restaurant.id);
          }}
          className="absolute right-3 top-3 grid size-10 place-items-center rounded-full bg-ink/45 text-ink-fg backdrop-blur-sm"
        >
          <Heart className={cn("size-4", fav && "fill-primary text-primary")} />
        </button>
        <div className="absolute bottom-3 left-3 right-3 text-ink-fg">
          <p className="font-display text-lg font-bold leading-tight">{restaurant.name}</p>
          <p className="text-xs text-ink-fg/80">
            {restaurant.cuisine} · {restaurant.neighborhood}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 px-3 py-3 text-xs font-medium text-muted">
        <span className="inline-flex items-center gap-1 text-fg">
          <Star className="size-3.5 fill-accent text-accent" />
          <span className="tabular-nums font-display font-semibold">{shown.score.toFixed(1)}</span>
          {userRating ? <span className="text-primary">· você {userRating}</span> : null}
          <span className="text-subtle">({shown.count.toLocaleString("pt-BR")})</span>
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock className="size-3.5" />
          {formatRange(restaurant.deliveryMin, restaurant.deliveryMax)}
        </span>
        <span className={cn("ml-auto", fee === 0 && "text-success font-semibold")}>{formatFee(fee)}</span>
      </div>
    </Link>
  );
}

export function RestaurantRow({ restaurant }: { restaurant: Restaurant }) {
  const fav = usePediu((s) => s.favorites.includes(restaurant.id));
  const userRating = usePediu((s) => s.ratings?.[restaurant.id]);
  const points = usePediu((s) => s.points);
  const shown = shownRating(restaurant.rating, restaurant.reviewCount, userRating);
  const fee = shownFee(restaurant.deliveryFee, restaurant.flash, points);
  return (
    <Link
      to="/restaurants/$id"
      params={{ id: restaurant.id }}
      className="flex gap-3 rounded-[22px] bg-surface p-2 shadow-card transition-transform duration-150 ease-out active:scale-[0.98]"
    >
      <img src={restaurant.image} alt="" className="size-20 shrink-0 rounded-[16px] object-cover" />
      <div className="min-w-0 flex-1 py-0.5">
        <div className="flex items-start justify-between gap-2">
          <p className="font-display text-sm font-semibold leading-tight">{restaurant.name}</p>
          {fav ? <Heart className="size-3.5 fill-primary text-primary" /> : null}
        </div>
        <p className="mt-0.5 truncate text-xs text-muted">
          {restaurant.cuisine} · {restaurant.neighborhood}
        </p>
        <div className="mt-2 flex items-center gap-2 text-[11px] text-muted">
          <span className="inline-flex items-center gap-0.5 font-display font-semibold text-fg">
            <Star className="size-3 fill-accent text-accent" />
            {shown.score.toFixed(1)}
          </span>
          <span>{formatRange(restaurant.deliveryMin, restaurant.deliveryMax)}</span>
          {restaurant.flash ? (
            <span className="rounded-full bg-accent px-1.5 py-0.5 font-display text-[10px] font-bold text-accent-fg">
              Flash
            </span>
          ) : null}
          <span className={cn("ml-auto", fee === 0 && "font-semibold text-success")}>{formatFee(fee)}</span>
        </div>
      </div>
    </Link>
  );
}
