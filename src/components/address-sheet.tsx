import { Check, MapPin } from "lucide-react";
import { Drawer } from "vaul";
import { ADDRESSES } from "@/lib/data";
import { usePediu } from "@/lib/store";
import { cn } from "@/lib/utils";

export function AddressSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const addressId = usePediu((s) => s.addressId);
  const setAddress = usePediu((s) => s.setAddress);

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-ink/50" />
        <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-phone rounded-t-3xl bg-bg px-5 pb-[max(1.2rem,env(safe-area-inset-bottom))] pt-4">
          <div className="mx-auto h-1.5 w-12 rounded-full bg-border-strong" />
          <Drawer.Title className="mt-4 font-display text-xl font-bold">Onde entrega?</Drawer.Title>
          <Drawer.Description className="mt-1 text-sm text-muted">
            Troca o endereço e o Flash 99 recalcula na hora.
          </Drawer.Description>
          <ul className="mt-4 grid gap-2">
            {ADDRESSES.map((a) => {
              const on = addressId === a.id;
              return (
                <li key={a.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setAddress(a.id);
                      onOpenChange(false);
                    }}
                    className={cn(
                      "flex w-full items-start gap-3 rounded-2xl px-3 py-3 text-left transition-[background-color,transform] duration-150 ease-out active:scale-[0.98]",
                      on ? "bg-ink text-ink-fg" : "bg-surface shadow-card",
                    )}
                  >
                    <MapPin className="mt-0.5 size-4 shrink-0" />
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-sm font-semibold">{a.label}</span>
                      <span className={cn("text-xs", on ? "text-ink-fg/70" : "text-muted")}>
                        {a.street} · {a.neighborhood}
                        {a.complement ? ` · ${a.complement}` : ""}
                      </span>
                    </span>
                    {on ? (
                      <span className="grid size-6 place-items-center rounded-full bg-accent text-accent-fg">
                        <Check className="size-3.5" />
                      </span>
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
