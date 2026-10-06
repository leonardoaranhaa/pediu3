import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Drawer } from "vaul";
import { Button } from "@/components/ui/button";
import { CANNED_REPLIES } from "@/lib/data";
import { usePediu } from "@/lib/store";

export function CourierChat({
  orderId,
  courierName,
  open,
  onOpenChange,
}: {
  orderId: string;
  courierName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const messages = usePediu((s) => s.chats[orderId] ?? []);
  const send = usePediu((s) => s.sendChat);
  const [draft, setDraft] = useState("");
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => {
    end.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  function push(text: string) {
    send(orderId, text, "me");
    setDraft("");
    window.setTimeout(() => {
      send(orderId, "Combinado. Te aviso na porta.", "courier");
    }, 900);
  }

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-ink/50" />
        <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 mx-auto flex h-[min(86dvh,36rem)] max-w-phone flex-col rounded-t-3xl bg-bg outline-none">
          <div className="mx-auto mt-2 h-1.5 w-12 shrink-0 rounded-full bg-border-strong" />
          <Drawer.Title className="shrink-0 px-5 pt-4 font-display text-lg font-bold">
            Chat com {courierName.split(" ")[0]}
          </Drawer.Title>
          <Drawer.Description className="shrink-0 px-5 text-xs text-muted">
            Mensagens da entrega em tempo real
          </Drawer.Description>
          <div className="mt-3 min-h-0 flex-1 space-y-2 overflow-y-auto px-5 pb-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={
                  m.from === "me"
                    ? "ml-10 rounded-[18px] rounded-br-sm bg-primary px-3 py-2 text-sm text-primary-fg"
                    : "mr-10 rounded-[18px] rounded-bl-sm bg-surface px-3 py-2 text-sm shadow-card"
                }
              >
                {m.text}
              </div>
            ))}
            <div ref={end} />
          </div>
          <div className="flex shrink-0 flex-wrap gap-1.5 px-5">
            {CANNED_REPLIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => push(c)}
                className="h-8 rounded-full bg-surface px-3 text-[11px] font-semibold shadow-card"
              >
                {c}
              </button>
            ))}
          </div>
          <form
            className="flex shrink-0 gap-2 px-5 py-3 pb-[max(1rem,env(safe-area-inset-bottom))]"
            onSubmit={(e) => {
              e.preventDefault();
              if (draft.trim()) push(draft);
            }}
          >
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Escreve pra moto…"
              className="h-11 flex-1 rounded-full bg-surface px-4 text-sm shadow-card outline-none placeholder:text-subtle"
            />
            <Button type="submit" size="icon" aria-label="Enviar">
              <Send className="size-4" />
            </Button>
          </form>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
