import { getAddress } from "@/lib/data";

export const SHOP_ID = "smash-club";
export const RIDER_NAME = "Camila Souza";

export type TicketStatus = "new" | "preparing" | "ready" | "done" | "rejected";

export type KitchenTicket = {
  id: string;
  customer: string;
  neighborhood: string;
  items: { name: string; qty: number }[];
  total: number;
  status: TicketStatus;
  flash: boolean;
  createdAt: number;
  orderId?: string;
  kind?: "cozinha" | "feira";
  shop?: string;
  pickup?: string;
  note?: string;
};

export type RunStep = "offer" | "waiting" | "to_shop" | "picked" | "to_door" | "done";

export type DeliveryRun = {
  id: string;
  ticketId: string;
  shop: string;
  pickup: string;
  dropoff: string;
  customer: string;
  payout: number;
  km: number;
  itemCount: number;
  step: RunStep;
  flash: boolean;
  feira?: boolean;
  note?: string;
  marketReady?: boolean;
};

const now = Date.now();

export const SEED_TICKETS: KitchenTicket[] = [
  {
    id: "kj-441",
    customer: "Helena",
    neighborhood: "Consolação",
    items: [
      { name: "Double smash", qty: 1 },
      { name: "Batata smash", qty: 1 },
    ],
    total: 55.8,
    status: "new",
    flash: true,
    createdAt: now - 3 * 60_000,
  },
  {
    id: "kj-438",
    customer: "Pedro",
    neighborhood: "Bela Vista",
    items: [{ name: "Triple smash", qty: 2 }],
    total: 93.8,
    status: "preparing",
    flash: true,
    createdAt: now - 8 * 60_000,
  },
  {
    id: "kj-430",
    customer: "Lívia",
    neighborhood: "Jardins",
    items: [
      { name: "Chicken smash", qty: 1 },
      { name: "Shake de doce de leite", qty: 1 },
    ],
    total: 53.8,
    status: "ready",
    flash: true,
    createdAt: now - 12 * 60_000,
  },
  {
    id: "fr-lucia",
    kind: "feira",
    shop: "Mercadinho Central",
    pickup: "Rua do Comércio, 40",
    note: "Buscar no fim da tarde",
    customer: "Dona Lúcia",
    neighborhood: "Centro",
    items: [
      { name: "Arroz tipo 1", qty: 1 },
      { name: "Leite integral", qty: 2 },
    ],
    total: 39.88,
    status: "preparing",
    flash: false,
    createdAt: now - 6 * 60_000,
  },
];

export function offerFromTicket(ticket: KitchenTicket): DeliveryRun {
  const items = ticket.items.reduce((sum, item) => sum + item.qty, 0);
  return {
    id: `run-${ticket.id}`,
    ticketId: ticket.id,
    shop: ticket.shop ?? "Smash Club",
    pickup: ticket.pickup ?? "Rua Augusta, 920",
    dropoff: ticket.neighborhood,
    customer: ticket.customer,
    payout: ticket.kind === "feira" ? 7.5 : ticket.flash ? 8.5 : 6.4,
    km: ticket.kind === "feira" ? 1.4 : ticket.flash ? 1.1 : 2.3,
    itemCount: items,
    step: "offer",
    flash: ticket.flash,
    feira: ticket.kind === "feira",
    note: ticket.note,
    marketReady: ticket.kind === "feira",
  };
}

export const SEED_RUNS: DeliveryRun[] = [
  ...SEED_TICKETS.filter((ticket) => ticket.status === "ready").map(offerFromTicket),
  {
    id: "run-fr-lucia",
    ticketId: "fr-lucia",
    shop: "Mercadinho Central",
    pickup: "Rua do Comércio, 40",
    dropoff: "Centro",
    customer: "Dona Lúcia",
    payout: 6,
    km: 1.2,
    itemCount: 3,
    step: "offer",
    flash: false,
    feira: true,
    note: "Buscar no fim da tarde",
    marketReady: false,
  },
];

export function ticketFromOrder(order: {
  id: string;
  restaurantId: string;
  addressId: string;
  items: { name: string; qty: number }[];
  total: number;
  flash: boolean;
  createdAt: number;
}): KitchenTicket | null {
  if (order.restaurantId !== SHOP_ID) return null;
  const address = getAddress(order.addressId);
  return {
    id: `kj-${order.id}`,
    orderId: order.id,
    customer: "Cliente Pediu",
    neighborhood: address.neighborhood,
    items: order.items.map((item) => ({ name: item.name, qty: item.qty })),
    total: order.total,
    status: "new",
    flash: order.flash,
    createdAt: order.createdAt,
  };
}

export const RUN_LABEL: Record<RunStep, string> = {
  offer: "Disponível",
  waiting: "Esperando o balcão",
  to_shop: "Indo buscar",
  picked: "Pedido na bag",
  to_door: "A caminho",
  done: "Entregue",
};
