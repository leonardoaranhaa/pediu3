import { Link } from "@tanstack/react-router";
import { Bell } from "lucide-react";
import { Drawer } from "vaul";
import { usePediu, type Notif } from "@/lib/store";

export function NotifSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const notifications = usePediu((s) => s.notifications);
  const mark = usePediu((s) => s.markNotifsRead);

  return (
    <Drawer.Root
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (v) mark();
      }}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-ink/50" />
        <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 mx-auto max-h-[80dvh] max-w-phone overflow-y-auto rounded-t-3xl bg-bg px-5 pb-[max(1.2rem,env(safe-area-inset-bottom))] pt-4">
          <div className="mx-auto h-1.5 w-12 rounded-full bg-border-strong" />
          <Drawer.Title className="mt-4 inline-flex items-center gap-2 font-display text-xl font-bold">
            <Bell className="size-5 text-primary" />
            Avisos
          </Drawer.Title>
          <Drawer.Description className="sr-only">Cupons, Flash 99 e status dos pedidos</Drawer.Description>
          {notifications.length === 0 ? (
            <p className="mt-6 text-sm text-muted">Nada por agora. Quando o Flash sair, pinga aqui.</p>
          ) : (
            <ul className="mt-4 grid gap-2">
              {notifications.map((n) => (
                <li key={n.id}>
                  <NotifRow n={n} onClose={() => onOpenChange(false)} />
                </li>
              ))}
            </ul>
          )}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

function NotifRow({ n, onClose }: { n: Notif; onClose: () => void }) {
  const body = (
    <div className="rounded-2xl bg-surface px-3 py-3 shadow-card">
      <p className="font-display text-sm font-semibold">{n.title}</p>
      <p className="mt-0.5 text-xs leading-relaxed text-muted">{n.body}</p>
    </div>
  );
  if (n.to === "/search") {
    return (
      <Link to="/search" search={{ q: n.q }} onClick={onClose} className="block">
        {body}
      </Link>
    );
  }
  if (n.to === "/market") {
    return (
      <Link to="/market" onClick={onClose} className="block">
        {body}
      </Link>
    );
  }
  if (n.to === "/taste") {
    return (
      <Link to="/taste" onClick={onClose} className="block">
        {body}
      </Link>
    );
  }
  if (n.to === "/club") {
    return (
      <Link to="/club" onClick={onClose} className="block">
        {body}
      </Link>
    );
  }
  if (n.to === "/wallet") {
    return (
      <Link to="/wallet" onClick={onClose} className="block">
        {body}
      </Link>
    );
  }
  if (n.to === "/help") {
    return (
      <Link to="/help" onClick={onClose} className="block">
        {body}
      </Link>
    );
  }
  if (n.to === "/orders") {
    return (
      <Link to="/orders" onClick={onClose} className="block">
        {body}
      </Link>
    );
  }
  return body;
}
