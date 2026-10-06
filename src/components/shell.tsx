import { Link, useRouterState } from "@tanstack/react-router";
import { ClipboardList, House, Search, User } from "lucide-react";
import type { ReactNode } from "react";
import { LogoMark, Wordmark } from "@/components/logo";
import { cn } from "@/lib/utils";
import { usePediu } from "@/lib/store";
import { cartTotals } from "@/lib/store";
import { formatBRL } from "@/lib/format";

const TABS = [
  { to: "/", label: "Início", icon: House, match: (p: string) => p === "/" },
  { to: "/search", label: "Busca", icon: Search, match: (p: string) => p.startsWith("/search") || p.startsWith("/taste") },
  { to: "/orders", label: "Pedidos", icon: ClipboardList, match: (p: string) => p.startsWith("/orders") || p.startsWith("/order") },
  { to: "/profile", label: "Perfil", icon: User, match: (p: string) => p.startsWith("/profile") || p.startsWith("/club") || p.startsWith("/wallet") || p.startsWith("/help") },
] as const;

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-ink">
      <div className="relative mx-auto min-h-dvh w-full max-w-phone overflow-x-hidden bg-bg text-fg shadow-ink">
        {children}
      </div>
    </div>
  );
}

export function TabBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="pointer-events-none sticky bottom-0 z-40 px-3 pb-[max(0.6rem,env(safe-area-inset-bottom))] pt-2">
      <div className="pointer-events-auto mx-auto flex h-16 items-center justify-around rounded-[28px] bg-ink px-2 text-ink-fg shadow-float">
        {TABS.map((tab) => {
          const active = tab.match(pathname);
          const Icon = tab.icon;
          const className = cn(
            "relative flex h-12 min-w-12 flex-col items-center justify-center gap-0.5 rounded-full px-3 transition-[background-color,color,transform] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
            active ? "bg-primary text-primary-fg" : "text-ink-fg/55",
          );
          if (tab.to === "/search") {
            return (
              <Link key={tab.to} to="/search" search={{ q: undefined }} aria-label={tab.label} className={className}>
                <Icon className="size-5" strokeWidth={active ? 2.4 : 2} />
                <span className="font-display text-[10px] font-semibold tracking-wide">{tab.label}</span>
              </Link>
            );
          }
          return (
            <Link key={tab.to} to={tab.to} aria-label={tab.label} className={className}>
              <Icon className="size-5" strokeWidth={active ? 2.4 : 2} />
              <span className="font-display text-[10px] font-semibold tracking-wide">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function CartPeek() {
  const cart = usePediu((s) => s.cart);
  const coupon = usePediu((s) => s.coupon);
  const payment = usePediu((s) => s.payment);
  const points = usePediu((s) => s.points);
  const totals = cartTotals(cart, coupon, payment, points);
  if (!totals.itemCount) return null;

  return (
    <div className="sticky bottom-20 z-30 px-4">
      <Link
        to="/cart"
        className="flex items-center justify-between rounded-[22px] bg-primary px-4 py-3 text-primary-fg shadow-red transition-transform duration-150 ease-out active:scale-[0.96]"
      >
        <div className="flex items-center gap-3">
          <span
            key={totals.itemCount}
            className="grid size-9 place-items-center rounded-full bg-primary-fg/15 font-display text-sm font-bold tabular-nums"
            style={{ animation: "cart-pop 380ms var(--ease-pop)" }}
          >
            {totals.itemCount}
          </span>
          <div>
            <p className="font-display text-sm font-semibold">Ver sacola</p>
            <p className="text-xs text-primary-fg/80">{totals.restaurant?.name}</p>
          </div>
        </div>
        <p className="font-display text-sm font-bold tabular-nums">{formatBRL(totals.total)}</p>
      </Link>
    </div>
  );
}

export function TopBrand({ right }: { right?: ReactNode }) {
  return (
    <header className="flex items-center justify-between px-4 pt-[max(0.8rem,env(safe-area-inset-top))] pb-2">
      <div className="flex items-center gap-2 text-primary">
        <LogoMark className="size-9" />
        <Wordmark />
      </div>
      {right}
    </header>
  );
}

export function Screen({
  children,
  tabs = true,
  peek,
  className,
}: {
  children: ReactNode;
  tabs?: boolean;
  peek?: boolean;
  className?: string;
}) {
  const showPeek = peek ?? tabs;
  return (
    <PhoneFrame>
      <div className={cn("flex min-h-dvh flex-col", className)}>
        <div className="flex-1">{children}</div>
        {showPeek ? <CartPeek /> : null}
        {tabs ? <TabBar /> : null}
      </div>
    </PhoneFrame>
  );
}
