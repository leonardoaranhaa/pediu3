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
import { deliveryClock, STATUS_LABEL, useNow, type DeliveryStatus } from "@/lib/clock";

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
