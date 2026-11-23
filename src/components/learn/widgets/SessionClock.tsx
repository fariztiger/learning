'use client';

/* Live market session clock — MYT (GMT+8) with automatic DST handling via Intl */

import { useEffect, useState } from 'react';
import { useLang } from '@/lib/i18n';

interface SessionInfo {
  id: string;
  name: string;
  nameMs: string;
  tz: string;
  openHour: number;
  closeHour: number;
}

const SESSIONS: SessionInfo[] = [
  { id: 'tokyo', name: 'Asian (Tokyo)', nameMs: 'Asia (Tokyo)', tz: 'Asia/Tokyo', openHour: 9, closeHour: 18 },
  { id: 'london', name: 'London', nameMs: 'London', tz: 'Europe/London', openHour: 8, closeHour: 17 },
  { id: 'ny', name: 'New York', nameMs: 'New York', tz: 'America/New_York', openHour: 8, closeHour: 17 },
];

function partsIn(tz: string, date: Date) {
  const fmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: tz,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    weekday: 'short',
  });
  const map: Record<string, string> = {};
  fmt.formatToParts(date).forEach((p) => (map[p.type] = p.value));
  return {
    hour: Number(map.hour),
    minute: Number(map.minute),
    weekday: map.weekday,
    label: `${map.hour}:${map.minute}`,
  };
}

function mytParts(date: Date) {
  return partsIn('Asia/Kuala_Lumpur', date);
}

export function SessionClock() {
  const { t, lang } = useLang();
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);

  if (!now) {
    return (
      <div className="card p-6">
        <div className="h-64 animate-pulse rounded-xl bg-white/[0.04]" />
      </div>
    );
  }

  const myt = mytParts(now);
  const weekend = myt.weekday === 'Sat' || myt.weekday === 'Sun';

  const rows = SESSIONS.map((s) => {
    const p = partsIn(s.tz, now);
    const open = !weekend && p.hour >= s.openHour && p.hour < s.closeHour;
    // myt window display: compute myt hours by offset difference
    const offsetH = (p.hour + p.minute / 60) - (myt.hour + myt.minute / 60);
    let mytOpen = (s.openHour - offsetH + 24) % 24;
    let mytClose = (s.closeHour - offsetH + 24) % 24;
    return { ...s, local: p, open, mytOpen, mytClose };
  });

  const londonRow = rows.find((r) => r.id === 'london')!;
  const nyRow = rows.find((r) => r.id === 'ny')!;
  const overlap = londonRow.open && nyRow.open;

  return (
    <div className="card p-6">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-300">
        {lang === 'ms' ? 'MASA NYATA' : 'REAL TIME'}
      </div>
      <h3 className="mt-2 font-display text-xl font-bold">{t('tools.sessions')}</h3>
      <p className="mt-1.5 text-[13.5px] text-mist-300">{t('tools.sessionsSub')}</p>

      <div className="mt-5 rounded-2xl border border-white/[0.08] bg-ink-900/60 p-4">
        <div className="flex items-baseline justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-[0.14em] text-mist-400">
              {lang === 'ms' ? 'Waktu Malaysia (GMT+8)' : 'Malaysia Time (GMT+8)'}
            </div>
            <div className="font-display text-3xl font-bold text-gold-300">{myt.label}</div>
          </div>
          {weekend ? (
            <div className="chip border-bear/30 text-bear">{lang === 'ms' ? 'Pasaran Forex hujung minggu (tutup)' : 'Forex weekend (closed)'}</div>
          ) : (
            <div className="chip border-bull/30 text-bull">{lang === 'ms' ? 'Pasaran dibuka' : 'Market open'}</div>
          )}
        </div>
      </div>

      <div className="mt-4 space-y-2.5">
        {rows.map((r) => (
          <div
            key={r.id}
            className={`flex items-center gap-3 rounded-xl border p-3.5 transition-all ${
              r.open ? 'border-gold-400/35 bg-gold-400/[0.07]' : 'border-white/[0.07] bg-white/[0.02]'
            }`}
          >
            <div className={`h-2.5 w-2.5 rounded-full ${r.open ? 'bg-bull shadow-[0_0_10px_rgba(34,201,139,0.8)]' : 'bg-mist-500'}`} />
            <div className="flex-1">
              <div className="text-sm font-semibold">{lang === 'ms' ? r.nameMs : r.name}</div>
              <div className="mt-0.5 font-mono text-[11px] text-mist-400">
                {String(r.mytOpen).padStart(2, '0')}:00–{String(Math.round(r.mytClose)).padStart(2, '0')}:00 MYT ·{' '}
                {lang === 'ms' ? 'setempat' : 'local'} {r.local.label}
              </div>
            </div>
            <div className={`chip !text-[10px] ${r.open ? 'border-bull/40 text-bull' : ''}`}>
              {r.open ? (lang === 'ms' ? 'DIBUKA' : 'OPEN') : (lang === 'ms' ? 'TUTUP' : 'CLOSED')}
            </div>
          </div>
        ))}
      </div>

      {overlap && !weekend && (
        <div className="mt-4 rounded-xl border border-gold-400/30 bg-gold-400/[0.08] p-4 text-[13px] leading-relaxed text-mist-200">
          <span className="font-semibold text-gold-300">⚡ {lang === 'ms' ? 'Tindihan London–New York' : 'London–New York overlap'}:</span>{' '}
          {lang === 'ms'
            ? 'tetingkap isipadu tertinggi dalam sehari — pergerakan emas paling ketara, tetapi spread dan risiko juga lebih tinggi. Ini waktu utama untuk setup yang telah dipelajari.'
            : 'the highest-volume window of the day — gold moves most visibly here, but spreads and risk are also elevated. This is prime time for the setups you have learned.'}
        </div>
      )}

      <div className="mt-4 text-[11.5px] leading-relaxed text-mist-400">
        {lang === 'ms'
          ? 'Pengiraan masa menggunakan zon sebenar (Europe/London, America/New_York) jadi pelarasan waktu siang (DST) dikendalikan secara automatik. Waktu sesi boleh berbeza mengikut broker dan musim.'
          : 'Times are computed from real zones (Europe/London, America/New_York) so daylight-saving shifts are handled automatically. Session hours can vary by broker and season.'}
      </div>
    </div>
  );
}
