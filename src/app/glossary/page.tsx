'use client';

/* Bilingual flip-card glossary with search */

import { useMemo, useState } from 'react';
import { GLOSSARY } from '@/content/glossary';
import { useLang } from '@/lib/i18n';
import { Reveal } from '@/components/Reveal';
import { Icon } from '@/components/Icons';

const CATS = [
  { id: 'all', en: 'All', ms: 'Semua' },
  { id: 'basics', en: 'Basics', ms: 'Asas' },
  { id: 'price-action', en: 'Price Action', ms: 'Tindakan Harga' },
  { id: 'smc', en: 'Smart Money', ms: 'Wang Pintar' },
  { id: 'risk', en: 'Risk', ms: 'Risiko' },
  { id: 'process', en: 'Process', ms: 'Proses' },
] as const;

export default function GlossaryPage() {
  const { t, L, lang } = useLang();
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState<(typeof CATS)[number]['id']>('all');
  const [flipped, setFlipped] = useState<Set<string>>(new Set());

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return GLOSSARY.filter((g) => {
      if (cat !== 'all' && g.category !== cat) return false;
      if (!q) return true;
      return (
        g.term.en.toLowerCase().includes(q) ||
        g.term.ms.toLowerCase().includes(q) ||
        g.short.en.toLowerCase().includes(q) ||
        g.short.ms.toLowerCase().includes(q)
      );
    });
  }, [query, cat]);

  const toggle = (id: string) => {
    setFlipped((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Reveal>
        <div className="chip mb-3">{lang === 'ms' ? 'RUJUKAN' : 'REFERENCE'}</div>
        <h1 className="h-display text-[clamp(2rem,4vw,2.9rem)]">{t('glossary.title')}</h1>
        <p className="mt-3 max-w-2xl text-mist-300">{t('glossary.sub')}</p>
      </Reveal>

      <Reveal delay={80}>
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Icon name="search" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-mist-400" />
            <input
              className="input !pl-10"
              placeholder={t('glossary.search')}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label={t('glossary.search')}
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {CATS.map((c) => (
              <button
                key={c.id}
                onClick={() => setCat(c.id)}
                className={`rounded-xl px-3.5 py-2 text-[12px] font-medium transition ${
                  cat === c.id ? 'bg-gold-400 text-ink-950' : 'bg-white/[0.05] text-mist-300 hover:bg-white/[0.1]'
                }`}
              >
                {lang === 'ms' ? c.ms : c.en}
              </button>
            ))}
          </div>
        </div>
      </Reveal>

      <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((g, i) => {
          const isFlipped = flipped.has(g.id);
          return (
            <Reveal key={g.id} delay={(i % 6) * 50}>
              <button
                className={`flip-card w-full text-left ${isFlipped ? 'flipped' : ''}`}
                onClick={() => toggle(g.id)}
                aria-pressed={isFlipped}
              >
                <div className="flip-inner h-[190px]">
                  <div className="flip-face card h-full p-5">
                    <div className="flex items-start justify-between">
                      <h3 className="font-display text-[17px] font-bold">{L(g.term)}</h3>
                      <span className="chip !text-[9px] !py-0.5 uppercase">{g.category}</span>
                    </div>
                    <p className="mt-3 text-[13px] leading-relaxed text-mist-300">{L(g.short)}</p>
                    <div className="absolute bottom-4 left-5 flex items-center gap-1.5 text-[10.5px] text-gold-300">
                      <Icon name="refresh" className="w-3 h-3" />
                      {lang === 'ms' ? 'Ketik untuk penjelasan penuh' : 'Tap for the full explanation'}
                    </div>
                  </div>
                  <div className="flip-back flip-face card border-gold-400/25 p-5">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gold-300">
                      {L(g.term)}
                    </div>
                    <p className="mt-2.5 overflow-auto max-h-[135px] text-[12px] leading-relaxed text-mist-200">
                      {L(g.long)}
                    </p>
                  </div>
                </div>
              </button>
            </Reveal>
          );
        })}
      </div>

      {list.length === 0 && (
        <div className="card mt-8 p-10 text-center">
          <Icon name="search" className="mx-auto w-8 h-8 text-mist-500" />
          <p className="mt-3 text-mist-400">
            {lang === 'ms' ? 'Tiada istilah sepadan ditemui.' : 'No matching terms found.'}
          </p>
        </div>
      )}
    </div>
  );
}
