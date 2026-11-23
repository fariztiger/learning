'use client';

/* Global toast host */

import { useEffect, useState } from 'react';
import { Icon } from './Icons';

interface Toast {
  id: number;
  title: string;
  desc: string;
  kind: string;
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    let counter = 0;
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as { title: string; desc: string; kind?: string };
      const id = ++counter;
      setToasts((ts) => [...ts, { id, title: detail.title, desc: detail.desc, kind: detail.kind ?? 'achievement' }]);
      setTimeout(() => setToasts((ts) => ts.filter((t) => t.id !== id)), 6000);
    };
    window.addEventListener('tigerfx-toast', handler);
    return () => window.removeEventListener('tigerfx-toast', handler);
  }, []);

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[100] flex w-[min(360px,calc(100vw-2.5rem))] flex-col gap-2.5">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto flex items-start gap-3 rounded-2xl border border-gold-400/35 bg-ink-850/95 p-4 shadow-glow animate-fade-up backdrop-blur"
          role="status"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gold-400/15 text-gold-300">
            <Icon name="trophy" className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-gold-400">{t.title}</div>
            <div className="mt-0.5 text-[12.5px] leading-relaxed text-mist-200">{t.desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
