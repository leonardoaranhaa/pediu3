import { useEffect } from "react";
import { motion } from "motion/react";
import { LogoMark, Wordmark } from "@/components/logo";
import { usePediu } from "@/lib/store";

export function Splash() {
  const seen = usePediu((s) => s.seenSplash);
  const mark = usePediu((s) => s.markSplashSeen);

  useEffect(() => {
    if (seen) return;
    const t = window.setTimeout(mark, 2200);
    return () => window.clearTimeout(t);
  }, [seen, mark]);

  if (seen) return null;

  return (
    <motion.div
      className="fixed inset-y-0 left-1/2 z-[80] flex w-full max-w-phone -translate-x-1/2 items-center justify-center overflow-hidden bg-primary"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      onClick={mark}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") mark();
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-ink"
        style={{ animation: "splash-wipe 1000ms var(--ease-out-soft) both" }}
      />
      <motion.span
        className="pointer-events-none absolute size-64 rounded-full bg-primary/35"
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1.35, opacity: 0 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      />
      <div className="relative flex flex-col items-center gap-4 text-ink-fg">
        <motion.div
          initial={{ scale: 0.7, opacity: 0, filter: "blur(8px)" }}
          animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
          transition={{ type: "spring", duration: 0.7, bounce: 0 }}
          className="text-primary"
        >
          <LogoMark className="size-16" />
        </motion.div>
        <motion.div
          initial={{ y: 12, opacity: 0, filter: "blur(6px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          transition={{ delay: 0.18, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center"
        >
          <Wordmark className="text-3xl text-ink-fg" />
          <p className="mt-1 font-sans text-sm text-ink-fg/70">Pediu, chegou.</p>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.35 }}
          className="text-[11px] font-medium tracking-wide text-ink-fg/45"
        >
          toque para entrar
        </motion.p>
      </div>
    </motion.div>
  );
}
