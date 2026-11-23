'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useLang } from '@/lib/i18n';
import type { S } from '@/lib/types';
import { Icon } from '@/components/Icons';
import { Reveal } from '@/components/Reveal';

/* ────────────────────────────────────────────────────────────
   Content copy — bilingual S objects (same pattern as lessons).
   Factual only: no credentials, performance claims or
   qualifications are stated anywhere on this page.
   ──────────────────────────────────────────────────────────── */

const CONTENT = {
  badge: { en: 'MEET THE FOUNDER', ms: 'KENALI PENGASAS' } satisfies S,
  name: { en: 'Fariz', ms: 'Fariz' } satisfies S,
  role: {
    en: 'Founder of TIGERFX Academy | Trading Tools Developer',
    ms: 'Pengasas TIGERFX Academy | Pembangun Alat Dagangan',
  } satisfies S,
  introA: {
    en: 'TIGERFX Academy is my independent education project — a structured, visual-first path from complete beginner to confident, independent trader. Everything here is built around practical chart analysis, Smart Money Concepts, and above all, responsible risk management.',
    ms: 'TIGERFX Academy ialah projek pendidikan bebas saya — satu laluan berstruktur, berfokuskan visual daripada pemula sepenuhnya kepada pedagang yakin dan bebas. Semuanya dibina di sekitar analisis carta praktikal, Konsep Wang Pintar (SMC), dan yang paling utama, pengurusan risiko yang berhemah.',
  } satisfies S,
  introB: {
    en: 'Alongside the academy, I develop trading tools for clients — Expert Advisors, indicators, dashboards and strategy conversions — so traders can execute their rules with discipline instead of emotion. Education stays free; if you want your idea turned into working software, the services below are how we work together.',
    ms: 'Di samping akademi, saya membangunkan alat dagangan untuk klien — Expert Advisor, indicator, dashboard dan penukaran strategi — supaya pedagang boleh melaksanakan peraturan mereka dengan disiplin, bukan emosi. Pendidikan kekal percuma; jika anda mahu idea anda menjadi perisian yang berfungsi, perkhidmatan di bawah ialah cara kita bekerjasama.',
  } satisfies S,
  portraitCaption: {
    en: 'Fariz — Founder, TIGERFX Academy',
    ms: 'Fariz — Pengasas, TIGERFX Academy',
  } satisfies S,
  focusTitle: {
    en: 'What TIGERFX Academy focuses on',
    ms: 'Fokus TIGERFX Academy',
  } satisfies S,
  servicesTitle: { en: 'What I can build for you', ms: 'Apa yang saya boleh bina untuk anda' } satisfies S,
  servicesLead: {
    en: 'Custom trading tools for MT4, MT5 and TradingView — specified with you, built to your rules, delivered with source and setup notes.',
    ms: 'Alat dagangan custom untuk MT4, MT5 dan TradingView — ditentukan bersama anda, dibina mengikut peraturan anda, diserahkan dengan kod sumber dan nota pemasangan.',
  } satisfies S,
  inquiryTitle: {
    en: 'Tell me about your project',
    ms: 'Beritahu saya tentang projek anda',
  } satisfies S,
  inquiryLead: {
    en: 'Fill this in and your email application opens with the full enquiry ready to send. You can also reach me directly any time.',
    ms: 'Isi borang ini dan aplikasi email anda akan dibuka dengan inkuiri penuh sedia untuk dihantar. Anda juga boleh menghubungi saya terus pada bila-bila masa.',
  } satisfies S,
} satisfies Record<string, S>;

/* ── focus pillars ── */
const FOCUS: { icon: string; text: S }[] = [
  {
    icon: 'graduation',
    text: {
      en: 'Visual-first education — see the market, not just read about it',
      ms: 'Pendidikan berfokuskan visual — lihat pasaran, bukan sekadar membaca',
    },
  },
  {
    icon: 'chart',
    text: {
      en: 'Practical chart analysis — structure, liquidity, candlestick behaviour',
      ms: 'Analisis carta praktikal — struktur, tingkah laku liquidity dan candlestick',
    },
  },
  {
    icon: 'layers',
    text: {
      en: 'Smart Money Concepts (SMC) explained in plain language',
      ms: 'Konsep Wang Pintar (SMC) dijelaskan dalam bahasa mudah',
    },
  },
  {
    icon: 'shield',
    text: {
      en: 'Responsible risk management before any entry',
      ms: 'Pengurusan risiko berhemah sebelum sebarang entry',
    },
  },
];

/* ── the 6 requested services ── */
const SERVICES: { icon: string; title: S; desc: S }[] = [
  {
    icon: 'code',
    title: {
      en: 'Custom Expert Advisors (MQL4/MQL5)',
      ms: 'Expert Advisor Custom (MQL4/MQL5)',
    },
    desc: {
      en: 'Automated strategies coded to your rules: entries, exits, filters and trade management running on MT4 or MT5.',
      ms: 'Strategi automatik dikod mengikut peraturan anda: entry, exit, filter dan pengurusan dagangan berjalan di MT4 atau MT5.',
    },
  },
  {
    icon: 'chart',
    title: {
      en: 'Custom Trading Indicators (MT4/MT5)',
      ms: 'Indicator Dagangan Custom (MT4/MT5)',
    },
    desc: {
      en: 'Your chart logic visualised: confluence tools, alerts, session markers, dashboard readouts — anything you can describe.',
      ms: 'Logik carta anda divisualkan: alat konfluens, alert, penanda sesi, paparan dashboard — apa sahaja yang anda boleh huraikan.',
    },
  },
  {
    icon: 'grid',
    title: {
      en: 'Trading Dashboards & Manual Panels',
      ms: 'Dashboard Dagangan & Panel Manual',
    },
    desc: {
      en: 'On-chart control panels for manual traders: one-click execution, position management, statistics and account readouts.',
      ms: 'Panel kawalan di carta untuk pedagang manual: pelaksanaan satu klik, pengurusan posisi, statistik dan paparan akaun.',
    },
  },
  {
    icon: 'pen',
    title: {
      en: 'Pine Script / TradingView Development',
      ms: 'Pembangunan Pine Script / TradingView',
    },
    desc: {
      en: 'Indicators, strategies and screeners in Pine Script — for analysis on TradingView or as a blueprint before automation.',
      ms: 'Indicator, strategi dan screener dalam Pine Script — untuk analisis di TradingView atau sebagai pelan sebelum automasi.',
    },
  },
  {
    icon: 'swap',
    title: {
      en: 'Strategy Conversion',
      ms: 'Penukaran Strategi',
    },
    desc: {
      en: 'Turn a TradingView strategy into an MT4/MT5 EA, an EA into a dashboard workflow, or a manual method into consistent automation.',
      ms: 'Tukar strategi TradingView kepada EA MT4/MT5, EA kepada aliran kerja dashboard, atau kaedah manual kepada automasi yang konsisten.',
    },
  },
  {
    icon: 'wrench',
    title: {
      en: 'Backtesting, Debugging & Optimization',
      ms: 'Backtesting, Debugging & Pengoptimuman',
    },
    desc: {
      en: 'Honest performance testing on real historical data, bug fixing in existing code, and parameter studies with realistic costs.',
      ms: 'Prestasi ujian jujur pada data sejarah sebenar, pembaikan pepijat dalam kod sedia ada, dan kajian parameter dengan kos realistik.',
    },
  },
];

/* ── form option sets ── */
const CATEGORIES: { v: string; l: S }[] = [
  { v: 'Custom Expert Advisor', l: { en: 'Custom Expert Advisor', ms: 'Expert Advisor Custom' } },
  { v: 'Custom Indicator', l: { en: 'Custom Indicator', ms: 'Indicator Custom' } },
  { v: 'Dashboard / Panel', l: { en: 'Dashboard / Panel', ms: 'Dashboard / Panel' } },
  { v: 'Pine Script', l: { en: 'Pine Script / TradingView', ms: 'Pine Script / TradingView' } },
  { v: 'Strategy Conversion', l: { en: 'Strategy Conversion', ms: 'Penukaran Strategi' } },
  { v: 'Backtest / Debug / Optimize', l: { en: 'Backtest / Debug / Optimize', ms: 'Backtest / Debug / Optimum' } },
  { v: 'Other', l: { en: 'Other', ms: 'Lain-lain' } },
];

const PLATFORMS: { v: string; l: S }[] = [
  { v: 'MT4', l: { en: 'MT4', ms: 'MT4' } },
  { v: 'MT5', l: { en: 'MT5', ms: 'MT5' } },
  { v: 'TradingView', l: { en: 'TradingView', ms: 'TradingView' } },
  { v: 'Python', l: { en: 'Python', ms: 'Python' } },
  { v: 'Other', l: { en: 'Other', ms: 'Lain-lain' } },
];

const BUDGETS: { v: string; l: S }[] = [
  { v: 'Discuss first', l: { en: 'Discuss first', ms: 'Bincang dahulu' } },
  { v: 'Under $100', l: { en: 'Under $100', ms: 'Bawah $100' } },
  { v: '$100 - $300', l: { en: '$100 – $300', ms: '$100 – $300' } },
  { v: '$300 - $800', l: { en: '$300 – $800', ms: '$300 – $800' } },
  { v: '$800+', l: { en: '$800+', ms: '$800+' } },
];

const EMAIL = 'tigerhyip@gmail.com';
const TELEGRAM = 'https://t.me/fariztiger';

/* ──────────────────────────────────────────────────────────── */

export default function AboutPage() {
  const { t, lang, L } = useLang();
  const [photoOk, setPhotoOk] = useState(true);

  /* form state */
  const [f, setF] = useState({
    name: '',
    contact: '',
    category: CATEGORIES[0].v,
    platform: PLATFORMS[0].v,
    strategy: '',
    features: '',
    budget: BUDGETS[0].v,
    description: '',
  });
  const [composed, setComposed] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setF((p) => ({ ...p, [k]: e.target.value }));

  const enquiryText = useMemo(() => {
    return [
      `Name: ${f.name}`,
      `Contact: ${f.contact}`,
      `Project category: ${f.category}`,
      `Platform: ${f.platform}`,
      '',
      'Strategy requirements:',
      f.strategy,
      '',
      'Additional features:',
      f.features || '(none specified)',
      '',
      `Budget range: ${f.budget}`,
      '',
      'Project description:',
      f.description,
      '',
      '— sent from the TIGERFX Academy About page',
    ].join('\n');
  }, [f]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!f.name.trim() || !f.contact.trim() || !f.strategy.trim() || !f.description.trim()) {
      setError(
        lang === 'ms'
          ? 'Sila isi nama, maklumat hubungan, keperluan strategi dan penerangan projek.'
          : 'Please fill in your name, contact info, strategy requirements and project description.',
      );
      return;
    }
    const subject = `Custom tool inquiry — ${f.category} — ${f.name}`;
    const mailto = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(enquiryText)}`;
    /* Honest behaviour: open the visitor's own email application.
       Nothing is submitted to any server; nothing is sent until they
       press send inside their email app. */
    window.location.href = mailto;
    setComposed(enquiryText);
    setCopied(false);
  };

  const copy = async () => {
    if (!composed) return;
    try {
      await navigator.clipboard.writeText(composed);
      setCopied(true);
    } catch {
      setError(lang === 'ms' ? 'Salinan gagal — sila pilih dan salin teks secara manual.' : 'Copy failed — please select and copy the text manually.');
    }
  };

  return (
    <div className="animate-fade-in">
      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-60 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] [background-size:34px_34px]" />
        <div className="absolute -top-32 right-0 -z-10 h-[420px] w-[420px] rounded-full bg-gold-400/[0.08] blur-3xl" />
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-20 lg:px-8">
          <div>
            <Reveal>
              <div className="chip chip-gold">{L(CONTENT.badge)}</div>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="mt-5 font-display text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl">
                {L(CONTENT.name)}
                <span className="block bg-gradient-gold bg-clip-text text-transparent">
                  {lang === 'ms' ? 'Pengasas & Pembangun Alat Dagangan' : 'Founder & Trading Tools Developer'}
                </span>
              </h1>
            </Reveal>
            <Reveal delay={140}>
              <p className="mt-2 text-sm font-semibold uppercase tracking-[0.18em] text-gold-400">{L(CONTENT.role)}</p>
            </Reveal>
            <Reveal delay={200}>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-mist-200">{L(CONTENT.introA)}</p>
            </Reveal>
            <Reveal delay={260}>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-mist-300">{L(CONTENT.introB)}</p>
            </Reveal>
            <Reveal delay={320}>
              <div className="mt-7 flex flex-wrap gap-2.5">
                <a href="#inquiry" className="btn-primary">
                  <Icon name="send" className="h-4 w-4" />
                  {t('about.cta')}
                </a>
                <a href={TELEGRAM} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                  <Icon name="send" className="h-4 w-4" />
                  {t('about.contactTg')}
                </a>
                <a href={`mailto:${EMAIL}`} className="btn-ghost">
                  <Icon name="mail" className="h-4 w-4" />
                  {t('about.contactMail')}
                </a>
              </div>
            </Reveal>
          </div>

          {/* founder portrait — real committed SVG asset */}
          <Reveal delay={220}>
            <figure className="relative mx-auto w-full max-w-[380px]">
              <div className="absolute -inset-1.5 rounded-[28px] bg-gradient-gold opacity-60 blur-[2px]" aria-hidden />
              <div className="relative overflow-hidden rounded-[26px] border border-white/[0.1] bg-ink-800">
                {photoOk ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src="/images/tigerfx-founder-suit.jpg"
                    alt={lang === 'ms' ? 'Fariz, pengasas TIGERFX Academy, dalam sut' : 'Fariz, founder of TIGERFX Academy, in a suit'}
                    width={240}
                    height={319}
                    className="mx-auto block w-full max-w-[300px] py-6"
                    onError={() => setPhotoOk(false)}
                  />
                ) : (
                  <div className="flex aspect-[3/4] flex-col items-center justify-center gap-3">
                    <Icon name="user" className="h-16 w-16 text-gold-400" />
                    <div className="text-sm text-mist-300">Fariz</div>
                  </div>
                )}
                <figcaption className="border-t border-white/[0.07] bg-white/[0.03] px-5 py-3.5 text-center text-xs font-medium text-mist-300">
                  {L(CONTENT.portraitCaption)}
                </figcaption>
              </div>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* ═══ FOCUS PILLARS ═══ */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{L(CONTENT.focusTitle)}</h2>
        </Reveal>
        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FOCUS.map((p, i) => (
            <Reveal key={i} delay={i * 70}>
              <div className="card h-full p-5">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gold-400/[0.12] text-gold-400">
                  <Icon name={p.icon} />
                </div>
                <p className="text-sm leading-relaxed text-mist-200">{L(p.text)}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══ SERVICES ═══ */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{L(CONTENT.servicesTitle)}</h2>
          <p className="mt-3 max-w-2xl text-mist-300">{L(CONTENT.servicesLead)}</p>
        </Reveal>
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <Reveal key={i} delay={(i % 3) * 80}>
              <article className="card group h-full p-6 transition-transform duration-300 hover:-translate-y-1">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-400/[0.12] text-gold-400 transition-colors group-hover:bg-gold-400/[0.2]">
                  <Icon name={s.icon} />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold">{L(s.title)}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-mist-300">{L(s.desc)}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══ CTA BAND ═══ */}
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Reveal>
          <div className="card relative overflow-hidden p-8 sm:p-10">
            <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gold-400/[0.12] blur-3xl" aria-hidden />
            <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                  {lang === 'ms' ? 'Ada idea strategi?' : 'Got a strategy idea?'}
                </h2>
                <p className="mt-2 max-w-xl text-mist-300">
                  {lang === 'ms'
                    ? 'Huraikan peraturan anda — saya akan semak kebolehlaksanaan dan cadangkan bentuk yang sesuai (EA, indicator atau panel), tanpa kos awal.'
                    : 'Describe your rules — I will review feasibility and suggest the right form (EA, indicator or panel), at no upfront cost.'}
                </p>
              </div>
              <a href="#inquiry" className="btn-primary shrink-0 !px-7 !py-4 text-base">
                <Icon name="send" />
                {t('about.cta')}
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ═══ INQUIRY FORM ═══ */}
      <section id="inquiry" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr]">
          <div>
            <Reveal>
              <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{L(CONTENT.inquiryTitle)}</h2>
              <p className="mt-3 max-w-2xl text-mist-300">{L(CONTENT.inquiryLead)}</p>
            </Reveal>

            <Reveal delay={100}>
              <form onSubmit={onSubmit} noValidate className="card mt-7 space-y-5 p-6 sm:p-8">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="f-name" className="mb-1.5 block text-sm font-medium text-mist-200">
                      {t('about.field.name')} <span className="text-gold-400">*</span>
                    </label>
                    <input id="f-name" type="text" required value={f.name} onChange={set('name')} className="input w-full" autoComplete="name" />
                  </div>
                  <div>
                    <label htmlFor="f-contact" className="mb-1.5 block text-sm font-medium text-mist-200">
                      {t('about.field.contact')} <span className="text-gold-400">*</span>
                    </label>
                    <input id="f-contact" type="text" required value={f.contact} onChange={set('contact')} className="input w-full" placeholder="email atau @telegram" autoComplete="email" />
                  </div>
                  <div>
                    <label htmlFor="f-category" className="mb-1.5 block text-sm font-medium text-mist-200">
                      {t('about.field.category')}
                    </label>
                    <select id="f-category" value={f.category} onChange={set('category')} className="input w-full">
                      {CATEGORIES.map((c) => (
                        <option key={c.v} value={c.v}>{L(c.l)}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="f-platform" className="mb-1.5 block text-sm font-medium text-mist-200">
                      {t('about.field.platform')}
                    </label>
                    <select id="f-platform" value={f.platform} onChange={set('platform')} className="input w-full">
                      {PLATFORMS.map((p) => (
                        <option key={p.v} value={p.v}>{L(p.l)}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="f-strategy" className="mb-1.5 block text-sm font-medium text-mist-200">
                    {t('about.field.strategy')} <span className="text-gold-400">*</span>
                  </label>
                  <textarea id="f-strategy" required rows={3} value={f.strategy} onChange={set('strategy')} className="input w-full resize-y"
                    placeholder={lang === 'ms' ? 'Contoh: entry pada retracement ke order block H1 selepas BOS, SL di bawah OB, TP 2R…' : 'e.g. entry on H1 order-block retracement after BOS, SL below OB, TP at 2R…'} />
                </div>

                <div>
                  <label htmlFor="f-features" className="mb-1.5 block text-sm font-medium text-mist-200">
                    {t('about.field.features')} <span className="text-mist-400">({t('about.field.optional')})</span>
                  </label>
                  <textarea id="f-features" rows={2} value={f.features} onChange={set('features')} className="input w-full resize-y"
                    placeholder={lang === 'ms' ? 'Contoh: alert Telegram, trailing stop, paparan dashboard, pengurusan risiko auto…' : 'e.g. Telegram alerts, trailing stop, dashboard display, auto risk management…'} />
                </div>

                <div>
                  <label htmlFor="f-budget" className="mb-1.5 block text-sm font-medium text-mist-200">
                    {t('about.field.budget')} <span className="text-mist-400">({t('about.field.optional')})</span>
                  </label>
                  <select id="f-budget" value={f.budget} onChange={set('budget')} className="input w-full sm:max-w-[280px]">
                    {BUDGETS.map((b) => (
                      <option key={b.v} value={b.v}>{L(b.l)}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="f-desc" className="mb-1.5 block text-sm font-medium text-mist-200">
                    {t('about.field.description')} <span className="text-gold-400">*</span>
                  </label>
                  <textarea id="f-desc" required rows={4} value={f.description} onChange={set('description')} className="input w-full resize-y"
                    placeholder={lang === 'ms' ? 'Terangkan matlamat projek, gaya dagangan dan sebarang keperluan khas…' : 'Describe the project goal, your trading style and any special requirements…'} />
                </div>

                {/* honest disclosure — always visible */}
                <p className="flex items-start gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] p-3.5 text-xs leading-relaxed text-mist-300">
                  <Icon name="info" className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                  {t('about.mailtoNote')}
                </p>

                {error && (
                  <p role="alert" className="rounded-xl border border-rose-400/[0.3] bg-rose-400/[0.08] p-3 text-sm text-rose-200">
                    {error}
                  </p>
                )}

                <button type="submit" className="btn-primary w-full !py-4 text-base">
                  <Icon name="send" />
                  {t('about.submit')}
                </button>
              </form>
            </Reveal>

            {/* post-submit honest state */}
            {composed && (
              <Reveal>
                <div className="card mt-5 p-6">
                  <p className="flex items-start gap-2.5 text-sm leading-relaxed text-mist-200">
                    <Icon name="info" className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                    <span>
                      {t('about.emailOpened')}{' '}
                      <a className="font-semibold text-gold-300 hover:text-gold-200" href={`mailto:${EMAIL}`}>{EMAIL}</a>.
                    </span>
                  </p>
                  <textarea readOnly rows={8} value={composed} className="input mt-4 w-full resize-y text-xs leading-relaxed text-mist-300" aria-label={t('about.formTitle')} />
                  <div className="mt-4 flex flex-wrap gap-2.5">
                    <button type="button" onClick={copy} className="btn-ghost">
                      <Icon name={copied ? 'check' : 'layers'} className="h-4 w-4" />
                      {copied ? t('about.copied') : t('about.copyText')}
                    </button>
                    <a href={`mailto:${EMAIL}`} className="btn-ghost">
                      <Icon name="mail" className="h-4 w-4" />
                      {t('about.contactMail')}
                    </a>
                    <a href={TELEGRAM} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                      <Icon name="send" className="h-4 w-4" />
                      {t('about.orTelegram')}
                    </a>
                  </div>
                </div>
              </Reveal>
            )}
          </div>

          {/* contact cards */}
          <aside className="space-y-5">
            <Reveal delay={160}>
              <div className="card p-6">
                <h3 className="font-display text-lg font-semibold">{t('nav.contact')}</h3>
                <ul className="mt-4 space-y-3.5 text-sm">
                  <li>
                    <a href={`mailto:${EMAIL}`} className="flex items-center gap-3 text-mist-200 transition hover:text-gold-300">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold-400/[0.12] text-gold-400"><Icon name="mail" className="h-4 w-4" /></span>
                      {EMAIL}
                    </a>
                  </li>
                  <li>
                    <a href={TELEGRAM} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-mist-200 transition hover:text-gold-300">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold-400/[0.12] text-gold-400"><Icon name="send" className="h-4 w-4" /></span>
                      @fariztiger
                    </a>
                  </li>
                </ul>
                <a href={TELEGRAM} target="_blank" rel="noopener noreferrer" className="btn-primary mt-5 w-full">
                  {t('about.contactTg')}
                </a>
              </div>
            </Reveal>

            <Reveal delay={220}>
              <div className="card p-6">
                <h3 className="font-display text-lg font-semibold">
                  {lang === 'ms' ? 'Broker Valetax (opsyenal)' : 'Valetax Broker (optional)'}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-mist-300">
                  {lang === 'ms'
                    ? 'Jika anda memerlukan broker untuk amalan langsung, anda boleh meneroka pendaftaran Valetax. Ia tidak pernah diperlukan untuk mana-mana bahan pendidikan di sini.'
                    : 'If you need a broker for live practice, you can explore Valetax registration. It is never required for any educational material here.'}
                </p>
                <Link href="/broker" className="btn-primary mt-4 w-full">
                  {t('about.ctaBroker')}
                </Link>
                <p className="mt-4 text-xs leading-relaxed text-mist-400">
                  <span className="font-semibold text-mist-300">{t('about.disclosureTitle')}:{' '}</span>
                  {lang === 'ms'
                    ? 'Pautan pendaftaran Valetax di halaman Broker menggunakan kod rujukan TIGERFX Academy (kod: hH45rM8BFKetIFihM9x1vNpHhyUWZQEBI5buovZ16aZAsEnIJA/RoF5pzYXc74x/C3uNdOitzA8oi386TAMxcaLf3gq0e2GYsun0wrToL9LMT8zpQt+KeZB8jGbuxptQ). Kami mungkin menerima komisen daripada perdagangan jika anda mendaftar melalui pautan ini — tiada kos tambahan kepada anda.'
                    : 'The Valetax registration link on the Broker page uses the TIGERFX Academy referral code (code: hH45rM8BFKetIFihM9x1vNpHhyUWZQEBI5buovZ16aZAsEnIJA/RoF5pzYXc74x/C3uNdOitzA8oi386TAMxcaLf3gq0e2GYsun0wrToL9LMT8zpQt+KeZB8jGbuxptQ). We may receive a commission from trading if you register through this link — at no extra cost to you.'}
                </p>
                <p className="mt-3 text-xs leading-relaxed text-mist-400">
                  <span className="font-semibold text-mist-300">{lang === 'ms' ? 'Amaran risiko' : 'Risk warning'}:{' '}</span>
                  {t('about.riskShort')}
                </p>
              </div>
            </Reveal>
          </aside>
        </div>
      </section>
    </div>
  );
}
