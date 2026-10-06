import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronDown, ChevronLeft, MessageCircle } from "lucide-react";
import { useState } from "react";
import { Screen } from "@/components/shell";
import { HELP_TOPICS } from "@/lib/data";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/help")({ component: HelpPage });

function HelpPage() {
  const [open, setOpen] = useState<string | null>("pedido-0");

  return (
    <Screen>
      <main className="px-4 pb-10 pt-[max(0.8rem,env(safe-area-inset-top))]">
        <Link to="/profile" className="inline-flex items-center gap-1 text-sm font-semibold">
          <ChevronLeft className="size-4" />
          Perfil
        </Link>
        <h1 className="mt-3 font-display text-3xl font-extrabold leading-none">Ajuda</h1>
        <p className="mt-2 text-sm text-muted">Pedido, moto, carteira e mercado — sem enrolação.</p>

        <div className="mt-5 space-y-5">
          {HELP_TOPICS.map((topic) => (
            <section key={topic.id}>
              <h2 className="font-display text-sm font-bold uppercase tracking-wider text-muted">{topic.title}</h2>
              <div className="mt-2 grid gap-2">
                {topic.items.map((item, i) => {
                  const id = `${topic.id}-${i}`;
                  const on = open === id;
                  return (
                    <div key={id} className="rounded-[20px] bg-surface shadow-card">
                      <button
                        type="button"
                        onClick={() => setOpen(on ? null : id)}
                        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                      >
                        <span className="font-display text-sm font-semibold">{item.q}</span>
                        <ChevronDown
                          className={cn(
                            "size-4 shrink-0 text-subtle transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
                            on && "rotate-180",
                          )}
                        />
                      </button>
                      <div
                        className={cn(
                          "grid transition-[grid-template-rows] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
                          on ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                        )}
                      >
                        <p className="overflow-hidden px-4 text-sm leading-relaxed text-muted">
                          <span className="block pb-3">{item.a}</span>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        <button
          type="button"
          onClick={() => toast.message("Chat com o Pediu · resposta em até 2 min.")}
          className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink font-display text-sm font-semibold text-ink-fg"
        >
          <MessageCircle className="size-4" />
          Falar com o Pediu
        </button>
      </main>
    </Screen>
  );
}
