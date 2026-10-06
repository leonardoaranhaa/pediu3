import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import { RESTAURANTS, type Restaurant } from "@/lib/data";
import { cn } from "@/lib/utils";

const STORY_IDS = [
  "smash-club",
  "napoli-di-roma",
  "acai-do-parque",
  "brasa-da-vila",
  "nikkei-88",
  "coxinha-da-esquina",
];

export function Stories() {
  const stories = STORY_IDS.map((id) => RESTAURANTS.find((r) => r.id === id)).filter(
    (r): r is Restaurant => Boolean(r),
  );
  const [open, setOpen] = useState<number | null>(null);

  return (
    <>
      <div className="no-scrollbar flex gap-3 overflow-x-auto px-4">
        {stories.map((r, i) => (
          <button
            key={r.id}
            type="button"
            onClick={() => setOpen(i)}
            className="flex w-[4.6rem] shrink-0 flex-col items-center gap-1.5"
          >
            <span
              className={cn(
                "relative grid size-[4.35rem] place-items-center rounded-full p-[3px]",
                r.flash
                  ? "bg-[conic-gradient(from_120deg,#ffc400,#e20d2a,#ffc400)]"
                  : "bg-[conic-gradient(from_80deg,#e20d2a,#ff8a7a,#e20d2a)]",
              )}
            >
              <img src={r.image} alt="" className="size-full rounded-full object-cover outline-2 outline-bg" />
            </span>
            <span className="w-full truncate text-center text-[11px] font-medium">{r.name.split(" ")[0]}</span>
          </button>
        ))}
      </div>
      {open !== null && stories[open] ? (
        <StoryViewer
          index={open}
          onClose={() => setOpen(null)}
          onNext={() => setOpen((i) => (i === null ? i : i + 1 >= stories.length ? null : i + 1))}
          onPrev={() => setOpen((i) => (i === null ? i : i - 1 < 0 ? i : i - 1))}
        />
      ) : null}
    </>
  );
}

function StoryViewer({
  index,
  onClose,
  onNext,
  onPrev,
}: {
  index: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  const stories = STORY_IDS.map((id) => RESTAURANTS.find((r) => r.id === id)).filter(
    (r): r is Restaurant => Boolean(r),
  );
  const r = stories[index];

  useEffect(() => {
    const t = window.setTimeout(onNext, 4200);
    return () => window.clearTimeout(t);
  }, [index, onNext]);

  if (!r) return null;

  return (
    <div className="fixed inset-y-0 left-1/2 z-[70] flex w-full max-w-phone -translate-x-1/2 flex-col bg-ink text-ink-fg">
      <div className="flex gap-1 px-3 pt-[max(0.8rem,env(safe-area-inset-top))]">
        {stories.map((_, i) => (
          <div key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-ink-fg/20">
            {i < index ? <div className="h-full bg-ink-fg" /> : null}
            {i === index ? <div className="story-fill h-full bg-ink-fg" /> : null}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between px-4 py-3">
        <p className="font-display text-sm font-semibold">{r.name}</p>
        <button type="button" onClick={onClose} className="grid size-10 place-items-center" aria-label="Fechar">
          <X className="size-5" />
        </button>
      </div>
      <div className="relative min-h-0 flex-1">
        <img src={r.image} alt="" className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-ink/30" />
        <div className="absolute inset-x-0 bottom-0 space-y-4 p-5 pb-8">
          <p className="font-display text-2xl font-bold leading-tight">{r.story}</p>
          <Link
            to="/restaurants/$id"
            params={{ id: r.id }}
            onClick={onClose}
            className="inline-flex h-12 items-center rounded-full bg-primary px-5 font-display text-sm font-semibold text-primary-fg shadow-red"
          >
            Pedir agora
          </Link>
        </div>
        <button type="button" className="absolute inset-y-0 left-0 w-1/3" aria-label="Anterior" onClick={onPrev} />
        <button type="button" className="absolute inset-y-0 right-0 w-1/3" aria-label="Próxima" onClick={onNext} />
      </div>
    </div>
  );
}
