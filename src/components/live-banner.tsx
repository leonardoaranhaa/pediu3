import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { deliveryClock, useNow } from "@/lib/clock";
import { formatRemain } from "@/lib/format";
import { STATUS_LABEL, usePediu } from "@/lib/store";

export function LiveBanner() {
  const orders = usePediu((s) => s.orders);
  const now = useNow();
  const active = orders.find((o) => deliveryClock(o, now).status !== "delivered");
  if (!active) return null;
  const clock = deliveryClock(active, now);
  const status = clock.status;
  const remainLabel = formatRemain(clock.remainMins);

  return (
    <div className="px-4 pt-4">
      <Link
        to="/order/$id"
        params={{ id: active.id }}
        className="flex items-center gap-3 overflow-hidden rounded-[22px] bg-ink px-3 py-3 text-ink-fg shadow-ink"
      >
        <span className="relative grid size-10 place-items-center">
          <span className="absolute inset-0 rounded-full bg-primary/40 pulse-live" />
          <span className="relative size-2.5 rounded-full bg-primary" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-display text-sm font-semibold">
            {STATUS_LABEL[status]} · {remainLabel}
          </span>
          <span className="block truncate text-xs text-ink-fg/65">{active.restaurantName}</span>
        </span>
        <ChevronRight className="size-4 shrink-0 text-ink-fg/50" />
      </Link>
    </div>
  );
}
