import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  applyCoupon,
  clubTier,
  COURIERS,
  dishesOf,
  getAddress,
  getDish,
  getRestaurant,
  MESA,
  shownFee,
  type Extra,
} from "@/lib/data";
import { getFeiraProduct, getMarket, getRider, getStop } from "@/lib/feira";
import { deliveryClock, STATUS_LABEL, useNow, type DeliveryStatus } from "@/lib/clock";
import {
  offerFromTicket,
  SEED_RUNS,
  SEED_TICKETS,
  ticketFromOrder,
  type DeliveryRun,
  type KitchenTicket,
} from "@/lib/lane";

export type CartItem = {
  key: string;
  dishId: string;
  restaurantId: string;
  name: string;
  image: string;
  unitPrice: number;
  extras: Extra[];
  qty: number;
  notes: string;
};

export type PaymentMethod = "pix" | "card" | "cash" | "wallet";

export type OrderStatus = DeliveryStatus;

export type ChatMsg = {
  id: string;
  from: "me" | "courier";
  text: string;
  at: number;
};

export type Notif = {
  id: string;
  title: string;
  body: string;
  at: number;
  read: boolean;
  to?: "/" | "/search" | "/market" | "/taste" | "/club" | "/orders" | "/wallet" | "/help";
  q?: string;
};

export type WalletTx = {
  id: string;
  label: string;
  amount: number;
  at: number;
};

export type Order = {
  id: string;
  restaurantId: string;
  restaurantName: string;
  restaurantImage: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  tip: number;
  total: number;
  cashback: number;
  status: OrderStatus;
  createdAt: number;
  etaMins: number;
  payment: PaymentMethod;
  addressId: string;
  coupon?: string;
  courier: { name: string; vehicle: string; plate: string; rating: number; trips: number; hue: number };
  flash: boolean;
  scheduled?: string;
  junto?: boolean;
  rating?: number;
  feira?: boolean;
  handoff?: string;
  dropoff?: string;
};

type AddPayload = {
  dishId: string;
  extras: Extra[];
  qty: number;
  notes: string;
};

type PediuState = {
  name: string;
  addressId: string;
  favorites: string[];
  cart: CartItem[];
  coupon: string | null;
  payment: PaymentMethod;
  cpfOnInvoice: boolean;
  orders: Order[];
  recentSearches: string[];
  seenSplash: boolean;
  points: number;
  tip: number;
  schedule: string | null;
  junto: boolean;
  chats: Record<string, ChatMsg[]>;
  notifications: Notif[];
  wallet: number;
  walletTx: WalletTx[];
  ratings: Record<string, number>;
  mesaPicks: string[];
  shopOpen: boolean;
  pausedDishes: string[];
  tickets: KitchenTicket[];
  runs: DeliveryRun[];
  motoOnline: boolean;
  motoEarnings: number;
  motoTrips: number;
  feiraMarketId: string | null;
  feiraQty: Record<string, number>;
  feiraOut: string[];
  feiraStopId: string;
  feiraShopId: string;
  setName: (name: string) => void;
  setAddress: (id: string) => void;
  setPayment: (p: PaymentMethod) => void;
  toggleCpf: () => void;
  toggleFavorite: (id: string) => void;
  setCoupon: (code: string | null) => void;
  setTip: (n: number) => void;
  setSchedule: (s: string | null) => void;
  toggleJunto: () => void;
  addToCart: (payload: AddPayload) => "ok" | "conflict";
  replaceCartWith: (payload: AddPayload) => void;
  updateQty: (key: string, qty: number) => void;
  clearCart: () => void;
  addSearch: (q: string) => void;
  markSplashSeen: () => void;
  placeOrder: () => Order | null;
  orderById: (id: string) => Order | undefined;
  rateOrder: (id: string, rating: number) => void;
  sendChat: (orderId: string, text: string, from?: ChatMsg["from"]) => void;
  seedCourierChat: (orderId: string, text: string) => void;
  markNotifsRead: () => void;
  topUp: (amount: number) => void;
  redeemPoints: (cost: number, reais: number) => boolean;
  toggleMesaPick: (dishId: string) => void;
  loadMesa: () => boolean;
  setShopOpen: (open: boolean) => void;
  toggleDishPause: (dishId: string) => void;
  acceptTicket: (id: string) => void;
  rejectTicket: (id: string) => void;
  readyTicket: (id: string) => void;
  setMotoOnline: (online: boolean) => void;
  acceptRun: (id: string) => boolean;
  advanceRun: (id: string) => void;
  setFeiraQty: (marketId: string, productId: string, qty: number) => void;
  clearFeira: () => void;
  toggleFeiraOut: (productId: string) => void;
  setFeiraStop: (id: string) => void;
  setFeiraShop: (id: string) => void;
  placeFeira: (note: string, riderId: string) => Order | null;
};

function itemKey(dishId: string, extras: Extra[], notes: string) {
  const extraIds = extras
    .map((e) => e.id)
    .sort()
    .join(",");
  return `${dishId}|${extraIds}|${notes.trim().toLowerCase()}`;
}

function extraSum(extras: Extra[]) {
  return extras.reduce((s, e) => s + e.price, 0);
}

function roundMoney(n: number) {
  return Math.round(n * 100) / 100;
}

export function cartTotals(cart: CartItem[], coupon: string | null, payment: PaymentMethod, points = 0) {
  const subtotal = cart.reduce((s, i) => s + i.unitPrice * i.qty, 0);
  const restaurantId = cart[0]?.restaurantId;
  const restaurant = restaurantId ? getRestaurant(restaurantId) : undefined;
  const baseFee = restaurant?.deliveryFee ?? 0;
  const applied = applyCoupon(coupon, subtotal, baseFee, Boolean(restaurant?.flash), payment);
  const deliveryFee = shownFee(applied.deliveryFee, Boolean(restaurant?.flash), points);
  const total = Math.max(0, roundMoney(subtotal + deliveryFee - applied.discount));
  return {
    subtotal,
    deliveryFee,
    discount: applied.discount,
    total,
    restaurant,
    couponLabel: applied.label,
    itemCount: cart.reduce((s, i) => s + i.qty, 0),
    clubFree: deliveryFee === 0 && applied.deliveryFee > 0 && clubTier(points).id === "flash",
  };
}

export function liveStatusFrom(order: { createdAt: number; etaMins?: number; scheduled?: string }, now = Date.now()): OrderStatus {
  return deliveryClock(order, now).status;
}

export { deliveryClock, STATUS_LABEL, useNow };

function buildItem(payload: AddPayload): CartItem | null {
  const dish = getDish(payload.dishId);
  if (!dish) return null;
  const extras = payload.extras;
  return {
    key: itemKey(payload.dishId, extras, payload.notes),
    dishId: dish.id,
    restaurantId: dish.restaurantId,
    name: dish.name,
    image: dish.image,
    unitPrice: dish.price + extraSum(extras),
    extras,
    qty: payload.qty,
    notes: payload.notes.trim(),
  };
}

const STARTER_NOTIFS: Notif[] = [
  {
    id: "n-flash",
    title: "Flash 99 na Augusta",
    body: "Cinco motos livres a menos de 1 km. Smash e coxinha saem agora.",
    at: Date.now() - 42 * 60_000,
    read: false,
    to: "/search",
    q: "flash",
  },
  {
    id: "n-cupom",
    title: "PEDIU10 te espera",
    body: "10% na sacola acima de R$ 40. Vale hoje.",
    at: Date.now() - 5 * 3600_000,
    read: false,
    to: "/search",
  },
  {
    id: "n-pay",
    title: "R$ 15 na Pediu Pay",
    body: "Boas-vindas na carteira. Paga o próximo Flash sem abrir o banco.",
    at: Date.now() - 26 * 3600_000,
    read: false,
    to: "/wallet",
  },
];

const STARTER_TX: WalletTx[] = [
  { id: "w1", label: "Boas-vindas Pediu Pay", amount: 15, at: Date.now() - 26 * 3600_000 },
  { id: "w2", label: "Pix recebido", amount: 16.7, at: Date.now() - 8 * 3600_000 },
  { id: "w3", label: "Cashback Smash Club", amount: 1.2, at: Date.now() - 3 * 3600_000 },
];

export const usePediu = create<PediuState>()(
  persist(
    (set, get) => ({
      name: "Você",
      addressId: "augusta",
      favorites: ["smash-club", "napoli-di-roma"],
      cart: [],
      coupon: null,
      payment: "pix",
      cpfOnInvoice: false,
      orders: [],
      recentSearches: ["pizza", "açaí", "flash"],
      seenSplash: false,
      points: 268,
      tip: 2,
      schedule: null,
      junto: false,
      chats: {},
      notifications: STARTER_NOTIFS,
      wallet: 32.9,
      walletTx: STARTER_TX,
      ratings: {},
      mesaPicks: [],
      shopOpen: true,
      pausedDishes: [],
      tickets: SEED_TICKETS,
      runs: SEED_RUNS,
      motoOnline: true,
      motoEarnings: 86.4,
      motoTrips: 6,
      feiraMarketId: null,
      feiraQty: {},
      feiraOut: [],
      feiraStopId: "casa",
      feiraShopId: "central",
      setName: (name) => set({ name: name.trim() || "Você" }),
      setAddress: (id) => set({ addressId: id }),
      setPayment: (p) => set({ payment: p }),
      toggleCpf: () => set({ cpfOnInvoice: !get().cpfOnInvoice }),
      toggleFavorite: (id) =>
        set({
          favorites: get().favorites.includes(id)
            ? get().favorites.filter((f) => f !== id)
            : [...get().favorites, id],
        }),
      setCoupon: (code) => set({ coupon: code }),
      setTip: (n) => set({ tip: n }),
      setSchedule: (s) => set({ schedule: s }),
      toggleJunto: () => set({ junto: !get().junto }),
      addToCart: (payload) => {
        const next = buildItem(payload);
        if (!next) return "ok";
        const { cart } = get();
        const currentRest = cart[0]?.restaurantId;
        if (currentRest && currentRest !== next.restaurantId) return "conflict";
        const existing = cart.find((i) => i.key === next.key);
        set({
          cart: existing
            ? cart.map((i) => (i.key === next.key ? { ...i, qty: i.qty + next.qty } : i))
            : [...cart, next],
        });
        return "ok";
      },
      replaceCartWith: (payload) => {
        const next = buildItem(payload);
        if (!next) return;
        set({ cart: [next], coupon: null });
      },
      updateQty: (key, qty) =>
        set({
          cart: qty <= 0 ? get().cart.filter((i) => i.key !== key) : get().cart.map((i) => (i.key === key ? { ...i, qty } : i)),
        }),
      clearCart: () => set({ cart: [], coupon: null }),
      addSearch: (q) => {
        const t = q.trim();
        if (!t) return;
        set({
          recentSearches: [t, ...get().recentSearches.filter((s) => s.toLowerCase() !== t.toLowerCase())].slice(0, 8),
        });
      },
      markSplashSeen: () => set({ seenSplash: true }),
      placeOrder: () => {
        const { cart, coupon, payment, addressId, orders, tip, schedule, junto, points, notifications, wallet, walletTx } =
          get();
        if (!cart.length) return null;
        const totals = cartTotals(cart, coupon, payment, points);
        const restaurant = totals.restaurant;
        if (!restaurant) return null;
        const grand = totals.total + tip;
        if (payment === "wallet" && wallet < grand) return null;
        const courier = COURIERS[Math.floor(Math.random() * COURIERS.length)]!;
        const earned = Math.max(1, Math.floor(totals.total));
        const cashback = roundMoney(grand * 0.02);
        const order: Order = {
          id: `PD-${Date.now().toString(36).toUpperCase()}`,
          restaurantId: restaurant.id,
          restaurantName: restaurant.name,
          restaurantImage: restaurant.image,
          items: cart,
          subtotal: totals.subtotal,
          deliveryFee: totals.deliveryFee,
          discount: totals.discount,
          tip,
          total: grand,
          cashback,
          status: "received",
          createdAt: Date.now(),
          etaMins: restaurant.deliveryMax,
          payment,
          addressId,
          coupon: coupon ?? undefined,
          courier,
          flash: restaurant.flash,
          scheduled: schedule ?? undefined,
          junto,
        };
        const hello: ChatMsg = {
          id: `${order.id}-hi`,
          from: "courier",
          text: `Oi, aqui é ${courier.name.split(" ")[0]}. Peguei seu Pediu.`,
          at: Date.now(),
        };
        const debit: WalletTx[] =
          payment === "wallet"
            ? [{ id: `d-${order.id}`, label: `Pedido ${restaurant.name}`, amount: -grand, at: Date.now() }]
            : [];
        const credit: WalletTx = {
          id: `c-${order.id}`,
          label: `Cashback ${restaurant.name}`,
          amount: cashback,
          at: Date.now(),
        };
        const nextWallet = (payment === "wallet" ? wallet - grand : wallet) + cashback;
        const { tickets } = get();
        const incoming = ticketFromOrder(order);
        set({
          orders: [order, ...orders],
          cart: [],
          coupon: null,
          schedule: null,
          junto: false,
          points: points + earned,
          wallet: roundMoney(nextWallet),
          walletTx: [...debit, credit, ...walletTx].slice(0, 20),
          chats: { ...get().chats, [order.id]: [hello] },
          tickets: incoming ? [incoming, ...tickets.filter((ticket) => ticket.id !== incoming.id)] : tickets,
          notifications: [
            {
              id: `n-${order.id}`,
              title: junto ? "Pediu Junto no fogo" : "Pedido no fogo",
              body: `${restaurant.name} · ${earned} pts · cashback ${cashback.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`,
              at: Date.now(),
              read: false,
              to: "/orders" as const,
            },
            ...notifications,
          ].slice(0, 12),
        });
        return order;
      },
      orderById: (id) => get().orders.find((o) => o.id === id),
      rateOrder: (id, rating) => {
        const order = get().orders.find((o) => o.id === id);
        set({
          orders: get().orders.map((o) => (o.id === id ? { ...o, rating } : o)),
          ratings: order ? { ...(get().ratings ?? {}), [order.restaurantId]: rating } : (get().ratings ?? {}),
        });
      },
      sendChat: (orderId, text, from = "me") => {
        const t = text.trim();
        if (!t) return;
        const prev = get().chats[orderId] ?? [];
        const msg: ChatMsg = { id: `${orderId}-${Date.now()}`, from, text: t, at: Date.now() };
        set({ chats: { ...get().chats, [orderId]: [...prev, msg] } });
      },
      seedCourierChat: (orderId, text) => {
        const prev = get().chats[orderId] ?? [];
        if (prev.some((m) => m.from === "courier" && m.text === text)) return;
        const msg: ChatMsg = { id: `${orderId}-c-${Date.now()}`, from: "courier", text, at: Date.now() };
        set({ chats: { ...get().chats, [orderId]: [...prev, msg] } });
      },
      markNotifsRead: () =>
        set({
          notifications: get().notifications.map((n) => ({ ...n, read: true })),
        }),
      topUp: (amount) => {
        if (amount <= 0) return;
        const { wallet, walletTx } = get();
        set({
          wallet: roundMoney(wallet + amount),
          walletTx: [
            { id: `t-${Date.now()}`, label: "Recarga Pediu Pay", amount, at: Date.now() },
            ...walletTx,
          ].slice(0, 20),
        });
      },
      redeemPoints: (cost, reais) => {
        const { points, wallet, walletTx } = get();
        if (points < cost) return false;
        set({
          points: points - cost,
          wallet: roundMoney(wallet + reais),
          walletTx: [
            { id: `r-${Date.now()}`, label: `Clube · ${cost} pts`, amount: reais, at: Date.now() },
            ...walletTx,
          ].slice(0, 20),
        });
        return true;
      },
      toggleMesaPick: (dishId) => {
        if (!MESA.offers.includes(dishId)) return;
        const picks = get().mesaPicks ?? [];
        set({
          mesaPicks: picks.includes(dishId) ? picks.filter((id) => id !== dishId) : [...picks, dishId],
        });
      },
      loadMesa: () => {
        const picks = (get().mesaPicks ?? []).filter((id) => MESA.offers.includes(id));
        const rows = [
          ...MESA.seats.map((seat) => ({ dishId: seat.dishId, notes: seat.note })),
          ...picks.map((dishId) => ({ dishId, notes: "" })),
        ];
        const cart: CartItem[] = [];
        for (const row of rows) {
          const built = buildItem({ dishId: row.dishId, extras: [], qty: 1, notes: row.notes });
          if (!built) continue;
          const existing = cart.find((item) => item.key === built.key);
          if (existing) existing.qty += 1;
          else cart.push(built);
        }
        if (!cart.length) return false;
        set({ cart, coupon: null, junto: true });
        return true;
      },
      setShopOpen: (open) => set({ shopOpen: open }),
      toggleDishPause: (dishId) => {
        const paused = get().pausedDishes ?? [];
        set({
          pausedDishes: paused.includes(dishId) ? paused.filter((id) => id !== dishId) : [...paused, dishId],
        });
      },
      acceptTicket: (id) =>
        set({
          tickets: get().tickets.map((ticket) =>
            ticket.id === id && ticket.status === "new" ? { ...ticket, status: "preparing" } : ticket,
          ),
        }),
      rejectTicket: (id) =>
        set({
          tickets: get().tickets.map((ticket) =>
            ticket.id === id && ticket.status === "new" ? { ...ticket, status: "rejected" } : ticket,
          ),
        }),
      readyTicket: (id) => {
        const tickets = get().tickets.map((ticket) =>
          ticket.id === id && ticket.status === "preparing" ? { ...ticket, status: "ready" as const } : ticket,
        );
        const ready = tickets.find((ticket) => ticket.id === id && ticket.status === "ready");
        const runs = get().runs ?? [];
        const existing = runs.find((run) => run.ticketId === id);
        const nextRuns = !ready
          ? runs
          : existing
            ? runs.map((run) =>
                run.ticketId === id
                  ? { ...run, marketReady: true, step: run.step === "waiting" ? ("to_shop" as const) : run.step }
                  : run,
              )
            : [offerFromTicket(ready), ...runs];
        set({ tickets, runs: nextRuns });
      },
      setMotoOnline: (online) => set({ motoOnline: online }),
      acceptRun: (id) => {
        if (!get().motoOnline) return false;
        const runs = get().runs ?? [];
        if (!runs.some((run) => run.id === id && run.step === "offer")) return false;
        set({
          runs: runs.map((run) =>
            run.id === id ? { ...run, step: run.feira && !run.marketReady ? "waiting" : "to_shop" } : run,
          ),
        });
        return true;
      },
      advanceRun: (id) => {
        const runs = get().runs ?? [];
        const run = runs.find((item) => item.id === id);
        if (!run) return;
        const next: Record<DeliveryRun["step"], DeliveryRun["step"] | null> = {
          offer: null,
          waiting: null,
          to_shop: "picked",
          picked: "to_door",
          to_door: "done",
          done: null,
        };
        const step = next[run.step];
        if (!step) return;
        const finished = step === "done";
        set({
          runs: runs.map((item) => (item.id === id ? { ...item, step } : item)),
          tickets: finished
            ? get().tickets.map((ticket) => (ticket.id === run.ticketId ? { ...ticket, status: "done" } : ticket))
            : get().tickets,
          motoEarnings: finished ? roundMoney(get().motoEarnings + run.payout) : get().motoEarnings,
          motoTrips: finished ? get().motoTrips + 1 : get().motoTrips,
        });
      },
      setFeiraQty: (marketId, productId, qty) => {
        const currentId = get().feiraMarketId;
        const same = !currentId || currentId === marketId;
        const next = same ? { ...(get().feiraQty ?? {}) } : {};
        if (qty <= 0) delete next[productId];
        else next[productId] = qty;
        const empty = Object.keys(next).length === 0;
        set({ feiraQty: next, feiraMarketId: empty ? null : marketId });
      },
      clearFeira: () => set({ feiraQty: {}, feiraMarketId: null }),
      toggleFeiraOut: (productId) => {
        const out = get().feiraOut ?? [];
        set({
          feiraOut: out.includes(productId) ? out.filter((id) => id !== productId) : [...out, productId],
        });
      },
      setFeiraStop: (id) => set({ feiraStopId: id }),
      setFeiraShop: (id) => set({ feiraShopId: id }),
      placeFeira: (note, riderId) => {
        const marketId = get().feiraMarketId;
        const market = getMarket(marketId);
        const rider = getRider(riderId);
        if (!market || !rider) return null;
        const qty = get().feiraQty ?? {};
        const out = get().feiraOut ?? [];
        const lines = Object.entries(qty)
          .map(([id, count]) => ({ product: getFeiraProduct(id), count }))
          .filter((line) => line.product && line.count > 0 && !out.includes(line.product.id));
        if (!lines.length) return null;
        const { payment, orders, points, notifications, wallet, walletTx, name, feiraStopId } = get();
        const stop = getStop(feiraStopId);
        const subtotal = roundMoney(lines.reduce((sum, line) => sum + line.product!.price * line.count, 0));
        const total = roundMoney(subtotal + rider.fee);
        if (payment === "wallet" && wallet < total) return null;
        const items: CartItem[] = lines.map((line) => ({
          key: line.product!.id,
          dishId: line.product!.id,
          restaurantId: market.id,
          name: line.product!.name,
          image: line.product!.image,
          unitPrice: line.product!.price,
          extras: [],
          qty: line.count,
          notes: line.product!.unit,
        }));
        const order: Order = {
          id: `PD-${Date.now().toString(36).toUpperCase()}`,
          restaurantId: market.id,
          restaurantName: market.name,
          restaurantImage: market.image,
          items,
          subtotal,
          deliveryFee: rider.fee,
          discount: 0,
          tip: 0,
          total,
          cashback: roundMoney(total * 0.02),
          status: "received",
          createdAt: Date.now(),
          etaMins: 50,
          payment,
          addressId: stop.id,
          courier: {
            name: rider.name,
            vehicle: rider.vehicle,
            plate: rider.plate,
            rating: rider.rating,
            trips: rider.trips,
            hue: rider.hue,
          },
          flash: false,
          feira: true,
          handoff: note,
          dropoff: `${stop.label} · ${stop.street}`,
        };
        const ticket: KitchenTicket = {
          id: `fr-${order.id}`,
          kind: "feira",
          shop: market.name,
          pickup: market.street,
          note,
          orderId: order.id,
          customer: name.trim() || "Cliente",
          neighborhood: stop.neighborhood,
          items: items.map((item) => ({ name: `${item.name} (${item.notes})`, qty: item.qty })),
          total,
          status: "new",
          flash: false,
          createdAt: order.createdAt,
        };
        const run: DeliveryRun = {
          id: `run-${ticket.id}`,
          ticketId: ticket.id,
          shop: market.name,
          pickup: market.street,
          dropoff: `${stop.street} · ${stop.neighborhood}`,
          customer: ticket.customer,
          payout: rider.fee,
          km: market.km,
          itemCount: items.reduce((sum, item) => sum + item.qty, 0),
          step: "offer",
          flash: false,
          feira: true,
          note,
          marketReady: false,
        };
        const hello: ChatMsg = {
          id: `${order.id}-hi`,
          from: "courier",
          text: `${rider.name.split(" ")[0]} aqui. ${note}. Busco no ${market.name} quando separarem.`,
          at: Date.now(),
        };
        const cashback = order.cashback;
        const debit: WalletTx[] =
          payment === "wallet" ? [{ id: `d-${order.id}`, label: `Entrega ${market.name}`, amount: -total, at: Date.now() }] : [];
        set({
          orders: [order, ...orders],
          feiraQty: {},
          feiraMarketId: null,
          points: points + Math.max(1, Math.floor(subtotal)),
          wallet: roundMoney((payment === "wallet" ? wallet - total : wallet) + cashback),
          walletTx: [
            ...debit,
            { id: `c-${order.id}`, label: `Cashback ${market.name}`, amount: cashback, at: Date.now() },
            ...walletTx,
          ].slice(0, 20),
          chats: { ...get().chats, [order.id]: [hello] },
          tickets: [ticket, ...get().tickets],
          runs: [run, ...(get().runs ?? [])],
          notifications: [
            {
              id: `n-${order.id}`,
              title: `Combinado com ${rider.name.split(" ")[0]}`,
              body: `${market.name} separa a lista. O Pediu segura o valor até a moto retirar.`,
              at: Date.now(),
              read: false,
              to: "/orders" as const,
            },
            ...notifications,
          ].slice(0, 12),
        });
        return order;
      },
    }),
    {
      name: "pediu-v2",
      skipHydration: true,
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<PediuState>;
        return {
          ...current,
          ...p,
          ratings: p.ratings ?? {},
          chats: p.chats ?? {},
          notifications: p.notifications ?? current.notifications,
          walletTx: p.walletTx ?? current.walletTx,
          wallet: typeof p.wallet === "number" ? p.wallet : current.wallet,
          mesaPicks: p.mesaPicks ?? [],
          shopOpen: p.shopOpen ?? true,
          pausedDishes: p.pausedDishes ?? [],
          tickets: p.tickets ?? current.tickets,
          runs: p.runs ?? current.runs,
          motoOnline: p.motoOnline ?? true,
          motoEarnings: typeof p.motoEarnings === "number" ? p.motoEarnings : current.motoEarnings,
          motoTrips: typeof p.motoTrips === "number" ? p.motoTrips : current.motoTrips,
          feiraMarketId: p.feiraMarketId ?? null,
          feiraQty: p.feiraQty ?? {},
          feiraOut: p.feiraOut ?? [],
          feiraStopId: p.feiraStopId ?? "casa",
          feiraShopId: p.feiraShopId ?? "central",
        };
      },
    },
  ),
);

export function useHydratePediu() {
  if (typeof window === "undefined") return;
  if (!usePediu.persist.hasHydrated()) {
    void usePediu.persist.rehydrate();
  }
}

export { getAddress, dishesOf };
