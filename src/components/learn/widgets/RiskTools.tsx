'use client';

/* Risk Sandbox + R:R Builder — position sizing with stated assumptions */

import { useMemo, useState } from 'react';
import { useLang } from '@/lib/i18n';

export function RiskCalculator() {
  const { t, lang } = useLang();
  const [account, setAccount] = useState(1000);
  const [riskPct, setRiskPct] = useState(1);
  const [entry, setEntry] = useState(2400);
  const [sl, setSl] = useState(2390);
  const [tp, setTp] = useState(2422);
  const [leverage, setLeverage] = useState(100);

  const out = useMemo(() => {
    const riskMoney = (account * riskPct) / 100;
    const dist = Math.abs(entry - sl);
    const lots = dist > 0 ? riskMoney / (100 * dist) : 0;
    const oz = lots * 100;
    const rr = dist > 0 ? Math.abs(tp - entry) / dist : 0;
    const notional = oz * entry;
    const margin = leverage > 0 ? notional / leverage : 0;
    const rewardMoney = oz * Math.abs(tp - entry);
    return { riskMoney, dist, lots, oz, rr, notional, margin, rewardMoney };
  }, [account, riskPct, entry, sl, tp, leverage]);

  const f2 = (n: number, d = 2) => n.toFixed(d);

  return (
    <div className="card p-6">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-300">
        {lang === 'ms' ? 'ALAT INTERAKTIF' : 'INTERACTIVE TOOL'}
      </div>
      <h3 className="mt-2 font-display text-xl font-bold">{t('tools.risk')}</h3>
      <p className="mt-1.5 text-[13.5px] text-mist-300">{t('w.risk.caption')}</p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field label={lang === 'ms' ? 'Saiz akaun ($)' : 'Account size ($)'} value={account} onChange={setAccount} step={100} />
        <Field label={lang === 'ms' ? 'Risiko setiap dagangan (%)' : 'Risk per trade (%)'} value={riskPct} onChange={setRiskPct} step={0.1} />
        <Field label={lang === 'ms' ? 'Harga entry' : 'Entry price'} value={entry} onChange={setEntry} step={0.5} />
        <Field label={lang === 'ms' ? 'Stop loss' : 'Stop loss'} value={sl} onChange={setSl} step={0.5} />
        <Field label={lang === 'ms' ? 'Take profit' : 'Take profit'} value={tp} onChange={setTp} step={0.5} />
        <Field label={lang === 'ms' ? 'Leveraj' : 'Leverage'} value={leverage} onChange={setLeverage} step={1} />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label={lang === 'ms' ? 'Wang berisiko' : 'Money at risk'} value={`$${f2(out.riskMoney)}`} tone="bear" />
        <Stat label={lang === 'ms' ? 'Saiz posisi (lot)' : 'Position size (lots)'} value={f2(out.lots, 3)} tone="gold" sub={`${f2(out.oz, 1)} oz`} />
        <Stat label="R:R" value={`${f2(out.rr)}R`} tone="bull" />
        <Stat label={lang === 'ms' ? 'Margin anggaran' : 'Est. margin'} value={`$${f2(out.margin, 0)}`} tone="sky" sub={`${f2(out.notional, 0)} notional`} />
      </div>

      {/* visual bar */}
      <div className="mt-5">
        <div className="label">{lang === 'ms' ? 'Risiko vs ganjaran' : 'Risk vs reward'}</div>
        <div className="flex h-9 overflow-hidden rounded-xl border border-white/10">
          <div
            className="flex items-center justify-center bg-bear/25 text-bear text-xs font-semibold"
            style={{ width: `${Math.min(60, 60 / Math.max(1, out.rr))}%` }}
          >
            {lang === 'ms' ? 'Risiko' : 'Risk'} ${f2(out.riskMoney, 0)}
          </div>
          <div
            className="flex items-center justify-center bg-bull/25 text-bull text-xs font-semibold"
            style={{ width: `${Math.min(80, (60 * out.rr) / Math.max(1, out.rr))}%` }}
          >
            {lang === 'ms' ? 'Ganjaran' : 'Reward'} ${f2(out.rewardMoney, 0)}
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-white/[0.08] bg-white/[0.03] p-4">
        <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-mist-400">
          {t('tools.assumptions')}
        </div>
        <ul className="mt-2 space-y-1.5 text-[12px] leading-relaxed text-mist-400">
          <li>• XAUUSD: 1 standard lot = 100 troy oz. P&amp;L = lots × 100 × price change.</li>
          <li>• {lang === 'ms' ? 'Spread, komisen dan gelinciran diabaikan — hasil sebenar berbeza.' : 'Spread, commission and slippage ignored — real fills differ.'}</li>
          <li>• {lang === 'ms' ? 'Saiz lot dibundarkan ke bawah kepada 0.01 — sentiasa semak spesifikasi kontrak broker anda.' : 'Lots floor-rounded to 0.01 — always verify your broker contract specifications.'}</li>
          <li>• {lang === 'ms' ? 'Alat ini untuk perancangan pendidikan, bukan nasihat kewangan.' : 'This tool is for educational planning, not financial advice.'}</li>
        </ul>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  step,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  step: number;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <input
        type="number"
        className="input font-mono"
        value={value}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

function Stat({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string;
  sub?: string;
  tone: 'bear' | 'bull' | 'gold' | 'sky';
}) {
  const tones = {
    bear: 'text-bear border-bear/25',
    bull: 'text-bull border-bull/25',
    gold: 'text-gold-300 border-gold-400/25',
    sky: 'text-sky2 border-sky2/25',
  };
  return (
    <div className={`rounded-xl border bg-white/[0.03] p-4 ${tones[tone]}`}>
      <div className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-mist-400">{label}</div>
      <div className="mt-1 font-display text-xl font-bold">{value}</div>
      {sub && <div className="mt-0.5 text-[11px] text-mist-400">{sub}</div>}
    </div>
  );
}

export function RRBuilder() {
  const { t, lang } = useLang();
  const [entry, setEntry] = useState(2400);
  const [sl, setSl] = useState(2394);
  const [tp, setTp] = useState(2414);
  const risk = Math.abs(entry - sl) || 1;
  const reward = Math.abs(tp - entry);
  const rr = reward / risk;

  return (
    <div className="card p-6">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-300">
        {lang === 'ms' ? 'ALAT INTERAKTIF' : 'INTERACTIVE TOOL'}
      </div>
      <h3 className="mt-2 font-display text-xl font-bold">{t('w.rr.title')}</h3>
      <p className="mt-1.5 text-[13.5px] text-mist-300">
        {lang === 'ms'
          ? 'Susun entry, stop dan sasaran. Lihat bagaimana R berubah — dan mengapa 2R mengubah matematik kelangsungan.'
          : 'Arrange entry, stop and target. See how R changes — and why 2R changes the survival maths.'}
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <Field label="Entry" value={entry} onChange={setEntry} step={0.5} />
        <Field label={lang === 'ms' ? 'Stop loss' : 'Stop loss'} value={sl} onChange={setSl} step={0.5} />
        <Field label={lang === 'ms' ? 'Take profit' : 'Take profit'} value={tp} onChange={setTp} step={0.5} />
      </div>

      {/* visual */}
      <div className="mt-6 space-y-2">
        {[
          { label: `TP · ${tp.toFixed(2)}`, p: tp, color: '#22C98B' },
          { label: `Entry · ${entry.toFixed(2)}`, p: entry, color: '#E8EDF7' },
          { label: `SL · ${sl.toFixed(2)}`, p: sl, color: '#FF5C7A' },
        ]
          .sort((a, b) => b.p - a.p)
          .map((row) => (
            <div key={row.label} className="flex items-center gap-3">
              <div className="w-28 font-mono text-[11px] text-mist-400">{row.label}</div>
              <div className="h-6 flex-1 rounded-lg" style={{ background: `${row.color}22`, border: `1px solid ${row.color}55` }} />
            </div>
          ))}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <Stat label="Reward-to-Risk" value={`${rr.toFixed(2)}R`} tone={rr >= 2 ? 'bull' : rr >= 1.2 ? 'gold' : 'bear'} />
        <Stat
          label={lang === 'ms' ? 'Kadar kemenangan untuk impas' : 'Breakeven win rate'}
          value={`${((risk / (risk + reward)) * 100).toFixed(1)}%`}
          tone="sky"
          sub={lang === 'ms' ? 'pada saiz tetap' : 'at fixed size'}
        />
      </div>

      <div className="mt-4 rounded-xl border-l-2 border-gold-400 bg-gold-400/[0.07] p-4 text-[13px] leading-relaxed text-mist-200">
        {rr >= 2
          ? lang === 'ms'
            ? '2R+ — anda boleh salah separuh masa dan masih kekal. Inilah zon dagangan profesional.'
            : '2R+ — you can be wrong half the time and still survive. This is the professional zone.'
          : rr >= 1.2
          ? lang === 'ms'
            ? '1.2–2R — boleh diterima, tetapi cari lokasi yang memberi lebih banyak ruang bernafas.'
            : '1.2–2R — acceptable, but look for locations that give more breathing room.'
          : lang === 'ms'
          ? 'Di bawah 1.2R — anda perlukan kadar kemenangan sangat tinggi. Pertimbang semula sasaran atau lokasi entri.'
          : 'Below 1.2R — you need an exceptionally high win rate. Reconsider the target or entry location.'}
      </div>
    </div>
  );
}
