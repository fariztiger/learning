'use client';

/* Candle Anatomy Lab — shape candles and learn their names */

import { useState } from 'react';
import { useLang } from '@/lib/i18n';
import { s } from '@/content/helpers';
import type { S } from '@/lib/types';

function nameCandle(o: number, h: number, l: number, c: number): { name: S; meaning: S } {
  const body = Math.abs(c - o);
  const range = Math.max(0.01, h - l);
  const upper = h - Math.max(o, c);
  const lower = Math.min(o, c) - l;
  const bull = c >= o;

  if (body / range < 0.08)
    return {
      name: s('Doji', 'Doji'),
      meaning: s('Open and close nearly equal — indecision between buyers and sellers.', 'Buka dan tutup hampir sama — kebimbangan antara pembeli dan penjual.'),
    };
  if (lower > body * 2 && upper < body * 0.6 && body / range < 0.35)
    return {
      name: bull ? s('Hammer', 'Hammer') : s('Hanging Man', 'Hanging Man'),
      meaning: s('Long lower wick — sellers pushed down but were rejected. Meaning depends on where it forms (a hammer at a low is a classic rejection).', 'Bayang bawah panjang — penjual menolak turun tetapi ditolak balik. Maknanya bergantung di mana ia terbentuk (hammer pada rendah ialah penolakan klasik).'),
    };
  if (upper > body * 2 && lower < body * 0.6 && body / range < 0.35)
    return {
      name: s('Shooting Star', 'Shooting Star'),
      meaning: s('Long upper wick — buyers pushed up but were rejected. After a rise, this often warns of exhaustion.', 'Bayang atas panjang — pembeli menolak naik tetapi ditolak balik. Selepas kenaikan, ini sering memberi amaran keletihan.'),
    };
  if (body / range > 0.85)
    return {
      name: bull ? s('Bullish Marubozu', 'Marubozu Bullish') : s('Bearish Marubozu', 'Marubozu Bearish'),
      meaning: s('Near-full body with tiny wicks — one side dominated the whole period. Shows conviction.', 'Badan hampir penuh dengan bayang kecil — satu pihak menguasai seluruh tempoh. Menunjukkan keyakinan.'),
    };
  if (body / range < 0.3)
    return {
      name: s('Spinning Top', 'Spinning Top'),
      meaning: s('Small body with wicks on both sides — a balanced fight, waiting for the next candle.', 'Badan kecil dengan bayang kedua-dua belah — pertarungan seimbang, menunggu lilin seterusnya.'),
    };
  return {
    name: bull ? s('Bullish Candle', 'Lilin Bullish') : s('Bearish Candle', 'Lilin Bearish'),
    meaning: bull
      ? s('Buyers won this period — the close finished above the open.', 'Pembeli memenangi tempoh ini — penutupan tamat di atas pembukaan.')
      : s('Sellers won this period — the close finished below the open.', 'Penjual memenangi tempoh ini — penutupan tamat di bawah pembukaan.'),
  };
}

export function CandleAnatomyLab() {
  const { L, t, lang } = useLang();
  const [vals, setVals] = useState({ o: 2400, h: 2408, l: 2393, c: 2406 });

  const { o, h, l, c } = vals;
  const clamped = {
    o,
    h: Math.max(h, o, c),
    l: Math.min(l, o, c),
    c,
  };
  const info = nameCandle(clamped.o, clamped.h, clamped.l, clamped.c);
  const bull = clamped.c >= clamped.o;

  const set = (k: keyof typeof vals) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setVals((v) => ({ ...v, [k]: Number(e.target.value) }));
  };

  // SVG candle geometry
  const minY = 2388;
  const maxY = 2413;
  const y = (p: number) => 20 + ((maxY - p) / (maxY - minY)) * 220;

  return (
    <div className="card p-6">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-300">
        {lang === 'ms' ? 'MAKMAL INTERAKTIF' : 'INTERACTIVE LAB'}
      </div>
      <h3 className="mt-2 font-display text-xl font-bold">{t('w.candle.title')}</h3>
      <p className="mt-1.5 text-[13.5px] text-mist-300">{t('w.candle.caption')}</p>

      <div className="mt-5 grid gap-6 sm:grid-cols-[180px_1fr]">
        <div className="rounded-2xl border border-white/[0.07] bg-ink-900/60 p-3">
          <svg viewBox="0 0 120 260" className="w-full">
            <line x1="60" y1={y(clamped.h)} x2="60" y2={y(clamped.l)} stroke={bull ? '#22C98B' : '#FF5C7A'} strokeWidth="3" />
            <rect
              x="42"
              y={y(Math.max(clamped.o, clamped.c))}
              width="36"
              height={Math.max(3, Math.abs(y(clamped.o) - y(clamped.c)))}
              rx="3"
              fill={bull ? '#22C98B' : '#FF5C7A'}
            />
            <text x="4" y={y(clamped.h) - 4} fill="#97A3B8" fontSize="9" fontFamily="monospace">
              H {clamped.h.toFixed(1)}
            </text>
            <text x="4" y={y(clamped.l) + 12} fill="#97A3B8" fontSize="9" fontFamily="monospace">
              L {clamped.l.toFixed(1)}
            </text>
            <text x="82" y={y(clamped.o) + (bull ? 12 : -4)} fill="#C4CEDE" fontSize="9" fontFamily="monospace">
              O {clamped.o.toFixed(1)}
            </text>
            <text x="82" y={y(clamped.c) + (bull ? -4 : 12)} fill="#C4CEDE" fontSize="9" fontFamily="monospace">
              C {clamped.c.toFixed(1)}
            </text>
          </svg>
        </div>

        <div>
          <div className="space-y-4">
            {(
              [
                ['o', 'Open / Buka', '#4CC9F0'],
                ['h', 'High / Tinggi', '#22C98B'],
                ['l', 'Low / Rendah', '#FF5C7A'],
                ['c', 'Close / Tutup', '#F5B942'],
              ] as const
            ).map(([k, label, color]) => (
              <div key={k}>
                <div className="flex items-center justify-between">
                  <label className="label !mb-0" htmlFor={`candle-${k}`}>
                    {label}
                  </label>
                  <span className="font-mono text-[12px]" style={{ color }}>
                    {vals[k].toFixed(1)}
                  </span>
                </div>
                <input
                  id={`candle-${k}`}
                  type="range"
                  min={2388}
                  max={2413}
                  step={0.5}
                  value={vals[k]}
                  onChange={set(k)}
                  className="mt-1.5 w-full accent-gold-400"
                />
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-xl border border-gold-400/25 bg-gold-400/[0.07] p-4 animate-fade-in">
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gold-300">
              {lang === 'ms' ? 'ANDA MEMBINA' : 'YOU BUILT'}
            </div>
            <div className="mt-1 font-display text-lg font-bold">{L(info.name)}</div>
            <p className="mt-1.5 text-[13px] leading-relaxed text-mist-200">{L(info.meaning)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
