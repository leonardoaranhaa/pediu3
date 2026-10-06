import { useEffect, useState } from "react";

export type DeliveryStatus = "received" | "preparing" | "on_the_way" | "arriving" | "delivered";

export const STATUS_LABEL: Record<DeliveryStatus, string> = {
  received: "Recebido",
  preparing: "Preparando",
  on_the_way: "A caminho",
  arriving: "Chegando",
  delivered: "Entregue",
};

export type ClockOrder = {
  createdAt: number;
  etaMins?: number;
  scheduled?: string;
};

function etaMs(order: ClockOrder) {
  return Math.max(1, order.etaMins ?? 30) * 60_000;
}

/** Moment the order should arrive. Scheduled slots replace the restaurant ETA. */
export function deliveryTarget(order: ClockOrder) {
  const eta = etaMs(order);
  const start = order.createdAt;
  if (!order.scheduled) return start + eta;
  if (order.scheduled === "+30 min") return start + 30 * 60_000;
  if (order.scheduled === "+1 h") return start + 60 * 60_000;
  if (order.scheduled === "Hoje 20h") {
    const target = new Date(start);
    target.setHours(20, 0, 0, 0);
    if (target.getTime() <= start + 60_000) target.setDate(target.getDate() + 1);
    return target.getTime();
  }
  return start + eta;
}

/**
 * One clock for the status steps and the remaining time.
 * Cooking occupies the last ETA of the window, so a later slot stays "Recebido"
 * until the kitchen actually needs to start.
 */
export function deliveryClock(order: ClockOrder, now = Date.now()) {
  const eta = etaMs(order);
  const target = deliveryTarget(order);
  const span = Math.max(60_000, target - order.createdAt);
  const cookMs = Math.min(eta, span);
  const cookStart = target - cookMs;
  const remainMs = Math.max(0, target - now);
  const remainMins = remainMs === 0 ? 0 : Math.ceil(remainMs / 60_000);
  let progress = 0;
  if (now >= target) progress = 1;
  else if (now > cookStart) progress = (now - cookStart) / cookMs;

  let status: DeliveryStatus = "received";
  if (progress >= 1) status = "delivered";
  else if (progress >= 0.78) status = "arriving";
  else if (progress >= 0.4) status = "on_the_way";
  else if (progress >= 0.12) status = "preparing";

  return { status, remainMins, progress };
}

export function useNow(interval = 1000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), interval);
    return () => window.clearInterval(id);
  }, [interval]);
  return now;
}
