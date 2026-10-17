import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { PhoneFrame } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { FEIRA_MARKETS, getMarket } from "@/lib/feira";
import { formatBRL } from "@/lib/format";
import { usePediu } from "@/lib/store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/feira/fiado")({ component: FiadoPage });

function FiadoPage() {
  const shopId = usePediu((s) => s.feiraShopId);
  const clients = usePediu((s) => s.fiadoClients ?? []);
  const add = usePediu((s) => s.addFiadoClient);
  const setLimit = usePediu((s) => s.setFiadoLimit);
  const toggle = usePediu((s) => s.toggleFiadoBlock);
  const shop = getMarket(shopId) ?? FEIRA_MARKETS[0];
  const mine = clients.filter((client) => client.shopId === shop.id);
  const owed = mine.reduce((sum, client) => sum + client.balance, 0);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [limit, setLimitField] = useState("80");
  const [picked, setPicked] = useState<string | null>(null);
  const [nextLimit, setNextLimit] = useState("");

  return (
    <PhoneFrame>
      <main className="px-4 pb-10 pt-[max(0.9rem,env(safe-area-inset-top))]">
        <Link to="/feira" className="inline-flex items-center gap-1 text-sm font-semibold">
          <ChevronLeft className="size-4" />
          Balcão
        </Link>
        <p className="mt-4 font-display text-[11px] font-bold uppercase tracking-wider text-primary">Relacionamento</p>
        <h1 className="mt-1 font-display text-3xl font-extrabold leading-none">Clientes e fiado</h1>
        <p className="mt-2 text-sm text-muted">{shop.name} anota o crédito. O cliente paga a lista no nome cadastrado.</p>

        <div className="mt-4 rounded-[22px] bg-ink p-4 text-ink-fg">
          <p className="text-xs text-ink-fg/70">Saldo em aberto</p>
          <p className="mt-1 font-display text-3xl font-extrabold tabular-nums text-accent">{formatBRL(owed)}</p>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="mt-3 h-11 w-full rounded-full bg-surface text-sm font-semibold shadow-card"
        >
          {open ? "Fechar cadastro" : "Cadastrar cliente"}
        </button>
        {open ? (
          <form
            className="mt-3 grid gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              const value = Number(limit.replace(",", "."));
              const ok = add(shop.id, name, phone, value);
              if (!ok) {
                toast.error("Confere o nome e o limite");
                return;
              }
              setName("");
              setPhone("");
              setOpen(false);
              toast.success("Cliente no fiado");
            }}
          >
            <Field label="Nome" value={name} onChange={setName} />
            <Field label="Telefone" value={phone} onChange={setPhone} />
            <Field label="Limite de fiado" value={limit} onChange={setLimitField} />
            <Button type="submit" className="rounded-full">
              Salvar cliente
            </Button>
          </form>
        ) : null}

        <ul className="mt-5 grid gap-2">
          {mine.length === 0 ? <li className="text-sm text-muted">Nenhum cliente neste mercado.</li> : null}
          {mine.map((client) => {
            const on = picked === client.id;
            return (
              <li key={client.id} className="rounded-[20px] bg-surface p-3 shadow-card">
                <button
                  type="button"
                  className="w-full text-left"
                  onClick={() => {
                    setPicked(on ? null : client.id);
                    setNextLimit(client.limit.toFixed(2).replace(".", ","));
                  }}
                >
                  <span className="block font-display text-sm font-bold">{client.name}</span>
                  <span className="text-xs text-muted">
                    {client.blocked ? "Bloqueado" : "Ativo"} · Saldo {formatBRL(client.balance)} · Limite {formatBRL(client.limit)}
                  </span>
                </button>
                {on ? (
                  <div className="mt-3 grid gap-2">
                    <Field label="Novo limite" value={nextLimit} onChange={setNextLimit} />
                    <Button
                      className="rounded-full"
                      onClick={() => {
                        setLimit(client.id, Number(nextLimit.replace(",", ".")));
                        toast.success("Limite atualizado");
                      }}
                    >
                      Atualizar limite
                    </Button>
                    <button
                      type="button"
                      onClick={() => toggle(client.id)}
                      className={cn("h-11 rounded-full text-sm font-semibold", client.blocked ? "bg-accent text-accent-fg" : "bg-bg")}
                    >
                      {client.blocked ? "Desbloquear cliente" : "Bloquear cliente"}
                    </button>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      </main>
    </PhoneFrame>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="text-[11px] font-bold uppercase tracking-wider text-muted">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 h-11 w-full rounded-[16px] bg-surface px-3 text-sm shadow-card outline-none"
      />
    </label>
  );
}
