'use client';

/* Multi-Timeframe Lab + News Planner */

import { useMemo, useState } from 'react';
import { makeWalk, mulberry32, round2 } from '@/lib/chart/builders';
import type { Candle, S } from '@/lib/types';
import { useLang } from '@/lib/i18n';
import { ChartCanvas } from '../ChartCanvas';
import { Icon } from '../../Icons';
import { s } from '@/content/helpers';

/* aggregate M15 candles into higher timeframes */
function aggregate(candles: Candle[], factor: number): Candle[] {
  const out: Candle[] = [];
  for (let i = 0; i + factor <= candles.length; i += factor) {
    const slice = candles.slice(i, i + factor);
    out.push({
      t: slice[0].t,
      o: slice[0].o,
      h: Math.max(...slice.map((c) => c.h)),
      l: Math.min(...slice.map((c) => c.l)),
      c: slice[slice.length - 1].c,
    });
  }
  return out;
}

export function MtfLab() {
  const { t, lang } = useLang();
  const [answered, setAnswered] = useState<number | null>(null);
  const [seed, setSeed] = useState(1);

  const base = useMemo(() => makeWalk({ seed: 9100 + seed * 7, start: 2400, count: 96, vol: 2.2, drift: 0.22 }), [seed]);
  const htf = useMemo(() => aggregate(base, 8), [base]);
  const mtf = useMemo(() => aggregate(base, 4), [base]);
  const ltf = useMemo(() => aggregate(base, 2), [base]);

  const options = [
    {
      i: 0,
      text: s('Read HTF first for direction, then use LTF for entry timing only.', 'Baca HTF dahulu untuk arah, kemudian guna LTF untuk masa entri sahaja.'),
      correct: true,
      why: s('Top-down is the professional workflow: the HTF sets the mission, the LTF chooses the moment. Reversing that order is the classic beginner trap.', 'Atas-ke-bawah ialah aliran kerja profesional: HTF menetapkan misi, LTF memilih saat. Membalikkan susunan itu ialah perangkap klasik pemula.'),
    },
    {
      i: 1,
      text: s('The LTF has the most candles, so it decides everything.', 'LTF mempunyai paling banyak lilin, jadi ia menentukan segalanya.'),
      why: s('More candles ≠ more authority. LTF detail without HTF context is how traders get chopped up.', 'Lebih banyak lilin ≠ lebih banyak autoriti. Butiran LTF tanpa konteks HTF ialah bagaimana trader dihancurkan.'),
    },
    {
      i: 2,
      text: s('Ignore the HTF — it is too slow to matter.', 'Abaikan HTF — ia terlalu perlahan untuk penting.'),
      why: s('The slow timeframe defines WHERE price is going. Without it, LTF signals are coin flips with extra steps.', 'Timeframe perlahan mentakrifkan KE MANA harga menuju. Tanpanya, isyarat LTF ialah lantingan syiling dengan langkah tambahan.'),
    },
  ];

  return (
    <div className="card p-6">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-300">
        {lang === 'ms' ? 'MAKMAL INTERAKTIF' : 'INTERACTIVE LAB'}
      </div>
      <h3 className="mt-2 font-display text-xl font-bold">{t('w.mtf.title')}</h3>
      <p className="mt-1.5 text-[13.5px] text-mist-300">{t('w.mtf.caption')}</p>

      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        {[
          { label: lang === 'ms' ? 'TF Tinggi (konteks)' : 'High TF (context)', data: htf, tone: 'border-gold-400/30' },
          { label: lang === 'ms' ? 'TF Sederhana (struktur)' : 'Mid TF (structure)', data: mtf, tone: 'border-sky2/30' },
          { label: lang === 'ms' ? 'TF Rendah (pencetus)' : 'Low TF (trigger)', data: ltf, tone: 'border-bull/30' },
        ].map((col) => (
          <div key={col.label} className={`rounded-xl border ${col.tone} bg-white/[0.02] p-2`}>
            <div className="px-2 pb-1.5 pt-1 text-[11px] font-semibold text-mist-300">{col.label}</div>
            <ChartCanvas candles={col.data} height={190} interactive={false} showCrosshair={false} />
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-xl border border-white/[0.08] bg-white/[0.03] p-4">
        <div className="text-[13.5px] font-semibold">
          {lang === 'ms'
            ? 'Soalan: HTF menunjukkan downtrend dalam premium. LTF menunjukkan corak bullish cantik. Apa yang anda lakukan?'
            : 'Question: HTF shows a downtrend in premium. LTF shows a beautiful bullish pattern. What do you do?'}
        </div>
        <div className="mt-3 space-y-2">
          {options.map((opt) => (
            <button
              key={opt.i}
              onClick={() => setAnswered(opt.i)}
              className={`w-full rounded-xl border p-3.5 text-left text-[13.5px] transition-all ${
                answered === opt.i
                  ? opt.correct
                    ? 'border-bull/70 bg-bull/[0.12]'
                    : 'border-bear/70 bg-bear/[0.12]'
                  : answered !== null && opt.correct
                  ? 'border-bull/70 bg-bull/[0.08]'
                  : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05]'
              }`}
            >
              {lang === 'ms' ? opt.text.ms : opt.text.en}
            </button>
          ))}
        </div>
        {answered !== null && (
          <div className="mt-3 rounded-xl border-l-2 border-gold-400 bg-gold-400/[0.07] p-3.5 text-[13px] leading-relaxed text-mist-200 animate-fade-in">
            {lang === 'ms' ? options[answered].why.ms : options[answered].why.en}
          </div>
        )}
      </div>

      <button
        className="btn-ghost mt-4 !py-2"
        onClick={() => {
          setSeed((s) => s + 1);
          setAnswered(null);
        }}
      >
        <Icon name="refresh" className="w-4 h-4" />
        {lang === 'ms' ? 'Pasaran baharu' : 'New market'}
      </button>
    </div>
  );
}

/* ------------------------------ News Planner ----------------------------- */

interface NewsEvent {
  name: string;
  when: S;
  impact: S;
  gold: S;
}

const EVENTS: NewsEvent[] = [
  {
    name: 'US Non-Farm Payrolls (NFP)',
    when: s('First Friday of each month, 8:30 pm MYT (9:30 pm DST)', 'Jumaat pertama setiap bulan, 8:30 mlm MYT (9:30 mlm DST)'),
    impact: s('Very high — US employment health; drives Fed policy expectations.', 'Sangat tinggi — kesihatan pekerjaan AS; menggerakkan jangkaan dasar Fed.'),
    gold: s('Violent two-way moves on gold and USD. Spread widening typical.', 'Pergerakan dua hala hebat pada emas dan USD. Pelebaran spread biasa.'),
  },
  {
    name: 'US CPI (Inflation)',
    when: s('Usually mid-month, 8:30 pm MYT', 'Biasanya pertengahan bulan, 8:30 mlm MYT'),
    impact: s('Very high — inflation is the Fed\'s mandate input.', 'Sangat tinggi — inflasi ialah input mandat Fed.'),
    gold: s('Gold is highly sensitive: hot CPI often pressures gold via dollar/rates.', 'Emas sangat sensitif: CPI panas sering menekan emas melalui dolar/kadar.'),
  },
  {
    name: 'FOMC Rate Decision + Press Conference',
    when: s('8 times per year, 2:00 am MYT (statement) / 2:30 am (conference)', '8 kali setahun, 2:00 pagi MYT (kenyataan) / 2:30 pagi (sidang)'),
    impact: s('Extreme — the single biggest scheduled event for gold.', 'Melampau — peristiwa terjadual terbesar untuk emas.'),
    gold: s('Trends can reverse for days. Trade AFTER the dust settles, not during.', 'Trend boleh berbalik selama berhari-hari. Dagangkan SELEPAS reda, bukan semasa.'),
  },
  {
    name: 'US PPI / GDP / Jobless Claims',
    when: s('Monthly/weekly, usually 8:30 pm MYT', 'Bulanan/mingguan, biasanya 8:30 mlm MYT'),
    impact: s('Medium to high depending on surprise vs forecast.', 'Sederhana hingga tinggi bergantung pada kejutan berbanding ramalan.'),
    gold: s('Short spikes; watch how the spike is absorbed in the following hour.', 'Lonjakan singkat; perhatikan bagaimana lonjakan diserap dalam jam berikutnya.'),
  },
  {
    name: 'China data (PMI, Trade Balance)',
    when: s('Monthly, morning MYT', 'Bulanan, waktu pagi MYT'),
    impact: s('Medium — global demand signals.', 'Sederhana — isyarat permintaan global.'),
    gold: s('Affects risk sentiment; gold may move as a safe haven.', 'Mempengaruhi sentimen risiko; emas mungkin bergerak sebagai tempat selamat.'),
  },
];

export function NewsPlanner() {
  const { t, lang } = useLang();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="card p-6">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-300">
        {lang === 'ms' ? 'PANDUAN PENDIDIKAN' : 'EDUCATIONAL GUIDE'}
      </div>
      <h3 className="mt-2 font-display text-xl font-bold">{t('tools.news')}</h3>
      <p className="mt-1.5 text-[13.5px] text-mist-300">{t('tools.newsSub')}</p>

      <div className="mt-2 rounded-xl border border-sky2/25 bg-sky2/[0.06] p-3 text-[12px] leading-relaxed text-mist-300">
        <Icon name="info" className="mr-1.5 inline w-4 h-4 text-sky2 align-[-2px]" />
        {lang === 'ms'
          ? 'Ini panduan peristiwa berulang untuk perancangan — bukan data langsung. Semak kalendar ekonomi broker anda untuk tarikh sebenar.'
          : 'This is a recurring-event planning guide — not live data. Check your broker economic calendar for actual dates.'}
      </div>

      <div className="mt-4 space-y-2.5">
        {EVENTS.map((ev, i) => (
          <div key={ev.name} className="overflow-hidden rounded-xl border border-white/[0.08]">
            <button
              className="flex w-full items-center gap-3 bg-white/[0.02] p-4 text-left transition hover:bg-white/[0.05]"
              onClick={() => setOpen(open === i ? null : i)}
              aria-expanded={open === i}
            >
              <div className="h-2 w-2 shrink-0 rounded-full bg-gold-400" />
              <div className="flex-1">
                <div className="text-[14px] font-semibold">{ev.name}</div>
                <div className="mt-0.5 font-mono text-[11px] text-mist-400">{lang === 'ms' ? ev.when.ms : ev.when.en}</div>
              </div>
              <Icon name={open === i ? 'x' : 'arrow-right'} className="w-4 h-4 text-mist-400" />
            </button>
            {open === i && (
              <div className="border-t border-white/[0.06] bg-ink-900/40 p-4 text-[13px] leading-relaxed text-mist-200 animate-fade-in">
                <div>
                  <span className="font-semibold text-gold-300">{lang === 'ms' ? 'Kesan:' : 'Impact:'}</span>{' '}
                  {lang === 'ms' ? ev.impact.ms : ev.impact.en}
                </div>
                <div className="mt-2">
                  <span className="font-semibold text-gold-300">XAUUSD:</span> {lang === 'ms' ? ev.gold.ms : ev.gold.en}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-xl border-l-2 border-bear bg-bear/[0.07] p-4 text-[12.5px] leading-relaxed text-mist-200">
        <span className="font-semibold text-bear">{lang === 'ms' ? 'Peraturan berita:' : 'News rules:'}</span>{' '}
        {lang === 'ms'
          ? '1) Semak kalendar sebelum setiap sesi. 2) Jangan masuk tepat sebelum pelepasan impak tinggi. 3) Jangan lebarkan stop untuk "terselamat". 4) Rancang untuk berdagang struktur SELEPAS berita.'
          : '1) Check the calendar before every session. 2) Do not enter right before high-impact releases. 3) Never widen stops to "survive". 4) Plan to trade the POST-news structure.'}
      </div>
    </div>
  );
}
