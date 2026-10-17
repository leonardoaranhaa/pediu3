import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Bike, Zap } from "lucide-react";
import { LaneBar } from "@/components/lane-bar";
import { PhoneFrame } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { formatBRL } from "@/lib/format";
import { RIDER_NAME, RUN_LABEL } from "@/lib/lane";
import { usePediu } from "@/lib/store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/moto")({ component: MotoPage });

function MotoPage() {
  const navigate = useNavigate();
  const online = usePediu((s) => s.motoOnline);
  const setOnline = usePediu((s) => s.setMotoOnline);
  const runs = usePediu((s) => s.runs ?? []);
  const earnings = usePediu((s) => s.motoEarnings);
  const trips = usePediu((s) => s.motoTrips);
  const accept = usePediu((s) => s.acceptRun);
  const offers = runs.filter((run) => run.step === "offer");
  const active = runs.find((run) => run.step !== "offer" && run.step !== "done");
  const done = runs.filter((run) => run.step === "done");

  return (
    <PhoneFrame>
      <div className="flex min-h-dvh flex-col">
        <main className="flex-1 px-4 pb-6 pt-[max(0.9rem,env(safe-area-inset-top))]">
          <p className="font-display text-[11px] font-bold uppercase tracking-wider text-primary">Motoboy</p>
          <div className="mt-1 flex items-start justify-between gap-3">
            <div>
              <h1 className="font-display text-2xl font-extrabold leading-none">{RIDER_NAME.split(" ")[0]}</h1>
              <p className="mt-1 text-sm text-muted">Moto Flash · Consolação</p>
            </div>
            <button
              type="button"
              onClick={() => setOnline(!online)}
              className={cn(
                "inline-flex h-11 items-center gap-2 rounded-full px-3 text-xs font-bold",
                online ? "bg-accent text-accent-fg" : "bg-ink text-ink-fg",
              )}
            >
              <Bike className="size-4" />
              {online ? "Online" : "Offline"}
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="rounded-[20px] bg-ink p-3 text-ink-fg">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-fg/60">Hoje</p>
              <p className="mt-1 font-display text-xl font-extrabold tabular-nums">{formatBRL(earnings)}</p>
            </div>
            <div className="rounded-[20px] bg-surface p-3 shadow-card">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">Corridas</p>
              <p className="mt-1 font-display text-xl font-extrabold tabular-nums">{trips}</p>
            </div>
          </div>

          {active ? (
            <Link
              to="/moto/$id"
              params={{ id: active.id }}
              className="mt-4 block rounded-[22px] bg-primary p-4 text-primary-fg shadow-red"
            >
              <p className="text-[11px] font-bold uppercase tracking-wider">Corrida ativa</p>
              <p className="mt-1 font-display text-lg font-bold">{active.customer}</p>
              <p className="text-sm text-primary-fg/80">
                {RUN_LABEL[active.step]} · {active.dropoff}
              </p>
            </Link>
          ) : null}

          <section className="mt-5">
            <h2 className="font-display text-sm font-semibold">Radar</h2>
            <div className="mt-2 grid gap-2">
              {offers.length === 0 ? (
                <p className="rounded-[18px] bg-surface px-3 py-3 text-sm text-muted shadow-card">
                  Nenhuma combinação aberta. Lista de mercado e pedido pronto da cozinha caem aqui.
                </p>
              ) : (
                offers.map((run) => (
                  <article key={run.id} className="rounded-[22px] bg-surface p-3 shadow-card">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-display text-sm font-bold">
                          {run.shop}
                          {run.flash ? <Zap className="ml-1 inline size-3.5 fill-accent text-accent" /> : null}
                        </p>
                        <p className="text-xs text-muted">
                          {run.pickup} → {run.dropoff}
                        </p>
                      </div>
                      <p className="font-display text-sm font-bold tabular-nums">{formatBRL(run.payout)}</p>
                    </div>
                    <p className="mt-2 text-xs text-muted">
                      {run.itemCount} itens · {run.km.toFixed(1)} km · {run.customer}
                      {run.feira ? " · mercado" : ""}
                    </p>
                    {run.note ? <p className="mt-1 text-xs font-semibold text-primary">{run.note}</p> : null}
                    <Button
                      size="sm"
                      className="mt-3 w-full"
                      onClick={() => {
                        const ok = accept(run.id);
                        if (!ok) {
                          toast.error("Fique online para aceitar");
                          return;
                        }
                        toast.success(run.feira ? "Combinado. Espera o balcão." : "Corrida sua");
                        void navigate({ to: "/moto/$id", params: { id: run.id } });
                      }}
                    >
                      {run.feira ? "Combinar esta entrega" : "Aceitar"}
                    </Button>
                  </article>
                ))
              )}
            </div>
          </section>

          {done.length > 0 ? (
            <section className="mt-5">
              <h2 className="font-display text-sm font-semibold">Entregues agora</h2>
              <ul className="mt-2 grid gap-2">
                {done.map((run) => (
                  <li key={run.id} className="flex items-center justify-between rounded-[18px] bg-surface px-3 py-3 text-sm shadow-card">
                    <span>
                      {run.customer}
                      <span className="block text-xs text-muted">{run.dropoff}</span>
                    </span>
                    <span className="font-display font-bold tabular-nums text-success">+{formatBRL(run.payout)}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </main>
        <LaneBar lane="moto" />
      </div>
    </PhoneFrame>
  );
}
