import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AnimatePresence } from "motion/react";
import { Toaster } from "sonner";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { Splash } from "@/components/splash";
import { usePediu } from "@/lib/store";
import appCss from "../styles.css?url";

const APP_NAME = "Pediu";

function RootChrome() {
  const seen = usePediu((s) => s.seenSplash);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let alive = true;
    const result = usePediu.persist.rehydrate();
    void Promise.resolve(result).then(() => {
      if (alive) setHydrated(true);
    });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <>
      <AnimatePresence>{hydrated && !seen ? <Splash key="splash" /> : null}</AnimatePresence>
      <Outlet />
      <Toaster
        position="top-center"
        toastOptions={{
          className: "font-sans",
          style: {
            background: "#111111",
            color: "#fff4e8",
            border: "none",
            borderRadius: "18px",
          },
        }}
      />
    </>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: APP_NAME },
      { name: "theme-color", content: "#E20D2A" },
      {
        name: "description",
        content: "Pediu — delivery de comida e mercado. Pediu, chegou.",
      },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
    ],
  }),
  component: () => (
    <html lang="pt-BR" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <PreviewHostBridge />
        <AuthProvider>
          <RootChrome />
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  ),
});
