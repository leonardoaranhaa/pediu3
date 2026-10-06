import { useMemo } from "react";

export function Burst({ show }: { show: boolean }) {
  const bits = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        i,
        x: (i % 6) * 16 + 8,
        delay: (i % 9) * 40,
        color: i % 3 === 0 ? "var(--color-primary)" : i % 3 === 1 ? "var(--color-accent)" : "var(--color-ink-fg)",
        size: 6 + (i % 4),
      })),
    [],
  );
  if (!show) return null;
  return (
    <div className="pointer-events-none fixed inset-y-0 left-1/2 z-[90] w-full max-w-phone -translate-x-1/2 overflow-hidden">
      {bits.map((b) => (
        <span
          key={b.i}
          className="burst-bit absolute left-1/2 top-[42%] rounded-full"
          style={{
            width: b.size,
            height: b.size,
            background: b.color,
            animationDelay: `${b.delay}ms`,
            ["--dx" as string]: `${(b.i % 2 === 0 ? 1 : -1) * (40 + (b.i * 13) % 120)}px`,
            ["--dy" as string]: `${-60 - (b.i * 17) % 140}px`,
          }}
        />
      ))}
    </div>
  );
}
