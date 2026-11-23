'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLang } from '@/lib/i18n';
import { Reveal } from '@/components/Reveal';
import { Icon } from '@/components/Icons';

const EMAIL = 'tigerhyip@gmail.com';
const TELEGRAM = 'https://t.me/fariztiger';

const services = [
  {
    icon: 'chart',
    title: { en: 'Custom Expert Advisors', ms: 'Expert Advisor Tempahan' },
    detail: { en: 'MT4 / MT5 strategy automation, risk controls, order management and trading panels.', ms: 'Automasi strategi MT4 / MT5, kawalan risiko, pengurusan order dan trading panel.' },
  },
  {
    icon: 'target',
    title: { en: 'Indicators & Chart Tools', ms: 'Indicator & Alat Carta' },
    detail: { en: 'Custom SMC, liquidity, support/resistance, supply/demand and visual dashboards.', ms: 'Indicator SMC, liquidity, support/resistance, supply/demand dan dashboard visual mengikut spesifikasi.' },
  },
  {
    icon: 'candle',
    title: { en: 'TradingView / Pine Script', ms: 'TradingView / Pine Script' },
    detail: { en: 'Pine Script indicators, alerts, strategy prototyping and MT4/MT5 conversion feasibility.', ms: 'Pembangunan Pine Script, alerts, prototaip strategi dan penilaian conversion MT4/MT5.' },
  },
  {
    icon: 'shield',
    title: { en: 'Debugging & Strategy Research', ms: 'Baiki Kod & Research Strategi' },
    detail: { en: 'Code audits, backtest instrumentation, trade logs, risk analytics and troubleshooting.', ms: 'Audit kod, sistem backtest, trade logger, analisis risiko dan penyelesaian bug.' },
  },
];

export default function AboutPage() {
  const { lang } = useLang();
  const bm = lang === 'ms';
  const [photoFailed, setPhotoFailed] = useState(false);
  const [service, setService] = useState('Custom Expert Advisor');
  const [platform, setPlatform] = useState('MT4');
  const [details, setDetails] = useState('');
  const [name, setName] = useState('');

  const message = [
    'Hi TIGERFX Academy, I would like to enquire about a coding project.',
    'Name: ' + (name.trim() || 'Not provided'),
    'Service: ' + service,
    'Platform: ' + platform,
    'Requirements: ' + (details.trim() || 'Please contact me to discuss.'),
  ].join('\n');
  const mailto = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent('TIGERFX Academy — Project Enquiry: ' + service) + '&body=' + encodeURIComponent(message);

  return (
    <div className="overflow-hidden">
      <section className="relative border-b border-white/[0.07] bg-gradient-to-br from-ink-900 via-ink-950 to-ink-950">
        <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-gold-400/[0.065] blur-[100px]" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-24">
          <Reveal>
            <div className="relative mx-auto max-w-[420px]">
              <div className="absolute -inset-3 rounded-[2.25rem] bg-gradient-to-tr from-gold-400/30 via-sky2/10 to-transparent blur-2xl" />
              <div className="relative overflow-hidden rounded-[2rem] border border-gold-400/25 bg-gradient-to-b from-[#243042] to-[#090d15] shadow-2xl" style={{aspectRatio: '4 / 5'}}>
                {!photoFailed ? (
                  <img
                    src="/images/tigerfx-founder-suit.svg"
                    alt={bm ? 'Potret pengasas TIGERFX Academy' : 'Portrait of TIGERFX Academy founder'}
                    onError={() => setPhotoFailed(true)}
                    className="h-full w-full object-cover object-top"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center bg-gradient-to-b from-[#1c2b3e] via-[#0b1725] to-[#05080f] px-8 text-center">
                    <div className="mb-7 flex h-32 w-32 items-center justify-center rounded-full border-2 border-gold-400/35 bg-gold-400/[0.09] text-6xl">🐯</div>
                    <span className="font-display text-4xl font-bold tracking-wide text-gold-300">TIGERFX</span>
                    <span className="mt-2 text-xs uppercase tracking-[0.35em] text-mist-300">ACADEMY</span>
                  </div>
                )}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-7 pt-24">
                  <div className="text-xl font-bold text-white">Fariz</div>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">{bm ? 'Pengasas • Developer Trading Tools' : 'Founder • Trading Tools Developer'}</p>
                </div>
              </div>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <span className="chip-gold">{bm ? 'KENALI PENGASAS' : 'MEET THE FOUNDER'}</span>
            <h1 className="h-display mt-5 text-[clamp(2.4rem,5vw,4.2rem)] leading-[1.08]">
              {bm ? 'Di sebalik ' : 'The person behind '}
              <span className="text-gold-300">TIGERFX Academy.</span>
            </h1>
            <p className="mt-6 max-w-xl text-[16px] leading-8 text-mist-200">
              {bm
                ? 'Saya Fariz. Saya membangunkan TIGERFX Academy untuk menjadikan pembelajaran Forex, XAUUSD dan Smart Money Concepts lebih mudah difahami melalui penerangan visual, latihan praktikal dan simulasi interaktif.'
                : 'I am Fariz. I created TIGERFX Academy to make Forex, XAUUSD and Smart Money Concepts easier to understand through visual explanations, hands-on practice and interactive simulation.'}
            </p>
            <p className="mt-4 max-w-xl text-[15px] leading-7 text-mist-300">
              {bm
                ? 'Saya juga membangunkan Expert Advisors, custom indicators dan trading dashboards untuk MT4, MT5 dan TradingView. Fokus saya ialah sistem yang jelas, boleh diuji dan mempunyai kawalan risiko — bukan janji keuntungan.'
                : 'I also build Expert Advisors, custom indicators and trading dashboards for MT4, MT5 and TradingView. My focus is on transparent, testable systems with risk controls — not promises of profits.'}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={TELEGRAM} target="_blank" rel="noopener noreferrer" className="btn-primary">
                <Icon name="send" className="h-4 w-4" />
                {bm ? 'Hubungi di Telegram' : 'Contact on Telegram'}
              </a>
              <a href={'mailto:' + EMAIL} className="btn-ghost">
                <Icon name="mail" className="h-4 w-4" />
                {bm ? 'Hantar Email' : 'Send Email'}
              </a>
            </div>
            <p className="mt-5 text-xs text-mist-400">Telegram: @fariztiger · {EMAIL}</p>
          </Reveal>
        </div>
      </section>

      <section id="services" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal>
          <div className="chip">{bm ? 'SERVIS PEMBANGUNAN' : 'DEVELOPMENT SERVICES'}</div>
          <h2 className="h-display mt-4 text-[clamp(1.9rem,3.6vw,2.8rem)]">
            {bm ? 'Ada idea untuk EA atau indicator?' : 'Have an EA or indicator idea?'}
          </h2>
          <p className="mt-3 max-w-3xl text-mist-300">
            {bm
              ? 'Dari idea kepada tool yang boleh diuji. Beritahu platform, strategi dan ciri yang diperlukan — kita bincang skop, feasibility dan quotation sebelum mula.'
              : 'From an idea to a testable tool. Share the platform, strategy and required features — we will discuss scope, feasibility and quotation before starting.'}
          </p>
        </Reveal>
        <div className="mt-9 grid gap-4 md:grid-cols-2">
          {services.map((item, i) => (
            <Reveal key={item.title.en} delay={i * 65}>
              <div className="card card-hover h-full p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-400/[0.12] text-gold-300">
                  <Icon name={item.icon} />
                </div>
                <h3 className="mt-4 font-display text-lg font-bold">{bm ? item.title.ms : item.title.en}</h3>
                <p className="mt-2 text-sm leading-7 text-mist-300">{bm ? item.detail.ms : item.detail.en}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="quote" className="border-y border-white/[0.07] bg-ink-900/50 py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <Reveal>
            <span className="chip-gold">{bm ? 'MINTA QUOTATION' : 'REQUEST A QUOTE'}</span>
            <h2 className="h-display mt-4 text-3xl">{bm ? 'Ceritakan projek anda.' : 'Tell me about your project.'}</h2>
            <p className="mt-4 leading-7 text-mist-300">
              {bm
                ? 'Isi ringkasan ini dan klik Hantar Email. Email anda akan terbuka dengan butiran projek yang telah diisi. Untuk perbincangan pantas, terus hubungi Telegram.'
                : 'Fill in this short brief and select Send Email. Your email app will open with a prepared project enquiry. For a quick discussion, contact me on Telegram.'}
            </p>
            <div className="mt-8 space-y-3 text-sm">
              <a href={TELEGRAM} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gold-300 hover:text-gold-200"><Icon name="send" /> @fariztiger</a>
              <a href={'mailto:' + EMAIL} className="flex items-center gap-3 text-gold-300 hover:text-gold-200"><Icon name="mail" /> {EMAIL}</a>
            </div>
            <p className="mt-7 text-xs leading-6 text-mist-400">
              {bm
                ? 'Ini ialah borang penyedia email, bukan sistem penghantaran di server. Tiada butiran projek disimpan oleh halaman ini.'
                : 'This form prepares an email; it does not submit to our server. No project details are stored by this page.'}
            </p>
          </Reveal>
          <Reveal delay={80}>
            <form className="card space-y-5 p-6 sm:p-8" onSubmit={(e) => { e.preventDefault(); window.location.href = mailto; }}>
              <label className="block">
                <span className="mb-2 block text-sm font-medium">{bm ? 'Nama / Username' : 'Name / Username'}</span>
                <input value={name} onChange={(e) => setName(e.target.value)} maxLength={80} placeholder="Your name" className="w-full rounded-xl border border-white/15 bg-ink-950 px-4 py-3 text-white outline-none focus:border-gold-400" />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium">{bm ? 'Jenis servis' : 'Service type'}</span>
                  <select value={service} onChange={(e) => setService(e.target.value)} className="w-full rounded-xl border border-white/15 bg-ink-950 px-4 py-3 text-white outline-none focus:border-gold-400">
                    <option>Custom Expert Advisor</option>
                    <option>Custom Indicator</option>
                    <option>Trading Dashboard</option>
                    <option>Pine Script / Conversion</option>
                    <option>Debugging / Backtest Research</option>
                  </select>
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium">Platform</span>
                  <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="w-full rounded-xl border border-white/15 bg-ink-950 px-4 py-3 text-white outline-none focus:border-gold-400">
                    <option>MT4</option><option>MT5</option><option>TradingView</option><option>Python</option><option>Other</option>
                  </select>
                </label>
              </div>
              <label className="block">
                <span className="mb-2 block text-sm font-medium">{bm ? 'Penerangan projek' : 'Project details'}</span>
                <textarea value={details} onChange={(e) => setDetails(e.target.value)} maxLength={1800} rows={5} placeholder={bm ? 'Contoh: EA XAUUSD M5, EMA + liquidity sweep, auto SL/TP, trailing dan dashboard...' : 'Example: XAUUSD M5 EA, EMA + liquidity sweep, auto SL/TP, trailing and dashboard...'} className="w-full resize-y rounded-xl border border-white/15 bg-ink-950 px-4 py-3 text-white outline-none focus:border-gold-400" />
              </label>
              <button type="submit" className="btn-primary w-full justify-center"><Icon name="mail" /> {bm ? 'Hantar Inquiry melalui Email' : 'Send Enquiry via Email'}</button>
              <a href={TELEGRAM} target="_blank" rel="noopener noreferrer" className="btn-ghost w-full justify-center">{bm ? 'Atau Chat di Telegram' : 'Or Chat on Telegram'}</a>
            </form>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal>
          <div className="card flex flex-col items-start gap-6 border-gold-400/25 bg-gradient-to-r from-gold-400/[0.07] to-transparent p-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="chip-gold">{bm ? 'SUMBER PILIHAN' : 'OPTIONAL RESOURCE'}</div>
              <h2 className="font-display mt-3 text-2xl font-bold">{bm ? 'Nak terokai pendaftaran broker?' : 'Interested in broker registration?'}</h2>
              <p className="mt-3 text-sm leading-7 text-mist-300">
                {bm
                  ? 'TIGERFX Academy menyediakan pembelajaran percuma tanpa wajib daftar broker. Jika mahu terokai Valetax, buka halaman berasingan untuk maklumat referral, risiko dan borang rasmi.'
                  : 'TIGERFX Academy provides free education without requiring a broker account. If you wish to explore Valetax, visit the separate page for referral disclosures, risks and its official form.'}
              </p>
              <p className="mt-3 text-xs text-mist-400">{bm ? 'Pautan ini mungkin memberi ganjaran referral. Dagangan forex/CFD berisiko tinggi.' : 'This link may provide a referral benefit. Forex/CFD trading carries significant risk.'}</p>
            </div>
            <Link href="/broker" className="btn-primary shrink-0">{bm ? 'Lihat Pilihan Valetax' : 'Explore Valetax Option'} <Icon name="arrow-right" /></Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
