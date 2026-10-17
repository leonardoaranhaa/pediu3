import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { CourierMap } from "@/components/courier-map";
import { PhoneFrame } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { formatBRL } from "@/lib/format";
import { RUN_LABEL, type RunStep } from "@/lib/lane";
import { usePediu, type OrderStatus } from "@/lib/store";

export const Route = createFileRoute("/moto/$id")({ component: RunPage });

const MAP: Record<RunStep, OrderStatus> = {
  offer: "received",
  waiting: "received",
  to_shop: "preparing",
  picked: "on_the_way",
  to_door: "arriving",
  done: "delivered",
};

const NEXT: Partial<Record<RunStep, string>> = {
  to_shop: "Retirei na loja",
  picked: "Saí para a entrega",
  to_door: "Entregue na porta",
};

function RunPage() {
  const { id } = Route.useParams();
  const run = usePediu((s) => (s.runs ?? []).find((item) => item.id === id));
  const advance = usePediu((s) => s.advanceRun);

  if (!run) {
    return (
      <PhoneFrame>
        <div className="px-6 py-24 text-center">
          <p className="font-display text-xl font-bold">Corrida não encontrada</p>
          <Link to="/moto" className="mt-3 inline-block text-sm font-semibold text-primary">
            Voltar ao radar
          </Link>
        </div>
      </PhoneFrame>
    );
  }

  const action = NEXT[run.step];

  return (
    <PhoneFrame>
      <div className="bg-ink pb-4 text-ink-fg">
        <div className="flex items-center gap-3 px-4 pt-[max(0.8rem,env(safe-area-inset-top))]">
          <Link to="/moto" className="grid size-11 place-items-center rounded-full bg-ink-fg/10" aria-label="Voltar">
            <ChevronLeft className="size-5" />
          </Link>
          <div className="min-w-0 flex-1">
            <p className="font-display text-sm font-bold">{RUN_LABEL[run.step]}</p>
            <p className="text-xs text-ink-fg/60">{run.shop}</p>
          </div>
          <p className="font-display text-sm font-bold tabular-nums">{formatBRL(run.payout)}</p>
        </div>
        <div className="px-4 pt-4">
          <p className="font-display text-3xl font-extrabold leading-none">{run.customer}</p>
          <p className="mt-1 text-sm text-ink-fg/70">
            {run.pickup} → {run.dropoff}
          </p>
        </div>
        <div className="mt-4 px-4">
          <CourierMap status={MAP[run.step]} />
        </div>
      </div>
      <div className="px-4 pb-10 pt-5">
        <ol className="grid gap-2 text-sm">
          <Step on={run.step !== "offer"} label={run.feira ? "Combinado" : "Aceita"} />
          <Step on={run.step === "picked" || run.step === "to_door" || run.step === "done"} label={run.feira ? "Retirada no mercado" : "Retirada na loja"} />
          <Step on={run.step === "to_door" || run.step === "done"} label="A caminho do cliente" />
          <Step on={run.step === "done"} label="Entregue" />
        </ol>
        {run.note ? <p className="mt-4 rounded-[18px] bg-surface px-3 py-3 text-sm shadow-card">Recado: {run.note}</p> : null}
        {run.step === "waiting" ? (
          <p className="mt-6 rounded-[18px] bg-surface px-3 py-3 text-sm shadow-card">
            Combinado. O mercado ainda está separando. Quando marcar no balcão, a corrida libera.
          </p>
        ) : action ? (
          <Button className="mt-6 w-full rounded-full" size="lg" onClick={() => advance(run.id)}>
            {run.feira && run.step === "to_shop" ? "Retirei no mercado" : action}
          </Button>
        ) : (
          <p className="mt-6 text-center font-display text-lg font-bold">Corrida fechada. Bom trabalho.</p>
        )}
        {run.step === "done" ? (
          <Link to="/moto" className="mt-3 block text-center text-sm font-semibold text-primary">
            Voltar ao radar
          </Link>
        ) : null}
      </div>
    </PhoneFrame>
  );
}

function Step({ on, label }: { on: boolean; label: string }) {
  return (
    <li className={on ? "font-semibold" : "text-subtle"}>
      <span className={on ? "mr-2 text-primary" : "mr-2"}>{on ? "●" : "○"}</span>
      {label}
    </li>
  );
}
