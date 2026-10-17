import { Link, useRouterState } from "@tanstack/react-router";
import { Bike, ChefHat, House, LayoutGrid, Store, UtensilsCrossed } from "lucide-react";
import { cn } from "@/lib/utils";

const LOJA = [
  { to: "/loja" as const, label: "Cozinha", icon: ChefHat, match: (p: string) => p === "/loja" },
  { to: "/loja/cardapio" as const, label: "Cardápio", icon: UtensilsCrossed, match: (p: string) => p.startsWith("/loja/cardapio") },
  { to: "/" as const, label: "Cliente", icon: House, match: () => false },
];

const MOTO = [
  { to: "/moto" as const, label: "Radar", icon: Bike, match: (p: string) => p === "/moto" || p.startsWith("/moto/") },
  { to: "/" as const, label: "Cliente", icon: House, match: () => false },
];

const FEIRA = [
  { to: "/feira" as const, label: "Balcão", icon: Store, match: (p: string) => p === "/feira" },
  { to: "/feira/grade" as const, label: "Grade", icon: LayoutGrid, match: (p: string) => p.startsWith("/feira/grade") },
  { to: "/market" as const, label: "Cliente", icon: House, match: () => false },
];

export function LaneBar({ lane }: { lane: "loja" | "moto" | "feira" }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const tabs = lane === "loja" ? LOJA : lane === "moto" ? MOTO : FEIRA;

  return (
    <nav className="sticky bottom-0 z-40 px-3 pb-[max(0.6rem,env(safe-area-inset-bottom))] pt-2">
      <div className="mx-auto flex h-16 items-center justify-around rounded-[28px] bg-ink px-2 text-ink-fg shadow-float">
        {tabs.map((tab) => {
          const active = tab.match(pathname);
          const Icon = tab.icon;
          const className = cn(
            "flex h-12 min-w-16 flex-col items-center justify-center gap-0.5 rounded-full px-3",
            active ? "bg-accent text-accent-fg" : "text-ink-fg/55",
          );
          if (tab.to === "/loja/cardapio") {
            return (
              <Link key={tab.label} to="/loja/cardapio" className={className} aria-label={tab.label}>
                <Icon className="size-5" strokeWidth={active ? 2.4 : 2} />
                <span className="font-display text-[10px] font-semibold">{tab.label}</span>
              </Link>
            );
          }
          if (tab.to === "/loja") {
            return (
              <Link key={tab.label} to="/loja" className={className} aria-label={tab.label}>
                <Icon className="size-5" strokeWidth={active ? 2.4 : 2} />
                <span className="font-display text-[10px] font-semibold">{tab.label}</span>
              </Link>
            );
          }
          if (tab.to === "/feira/grade") {
            return (
              <Link key={tab.label} to="/feira/grade" className={className} aria-label={tab.label}>
                <Icon className="size-5" strokeWidth={active ? 2.4 : 2} />
                <span className="font-display text-[10px] font-semibold">{tab.label}</span>
              </Link>
            );
          }
          if (tab.to === "/feira") {
            return (
              <Link key={tab.label} to="/feira" className={className} aria-label={tab.label}>
                <Icon className="size-5" strokeWidth={active ? 2.4 : 2} />
                <span className="font-display text-[10px] font-semibold">{tab.label}</span>
              </Link>
            );
          }
          if (tab.to === "/market") {
            return (
              <Link key={tab.label} to="/market" className={className} aria-label={tab.label}>
                <Icon className="size-5" strokeWidth={2} />
                <span className="font-display text-[10px] font-semibold">{tab.label}</span>
              </Link>
            );
          }
          if (tab.to === "/moto") {
            return (
              <Link key={tab.label} to="/moto" className={className} aria-label={tab.label}>
                <Icon className="size-5" strokeWidth={active ? 2.4 : 2} />
                <span className="font-display text-[10px] font-semibold">{tab.label}</span>
              </Link>
            );
          }
          return (
            <Link key={tab.label} to="/" className={className} aria-label={tab.label}>
              <Icon className="size-5" strokeWidth={2} />
              <span className="font-display text-[10px] font-semibold">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
