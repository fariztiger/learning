'use client';

import Link from 'next/link';
import { useLang } from '@/lib/i18n';
import { LEVEL_META } from '@/content/levelMeta';
import { HeroChart } from '@/components/HeroChart';
import { Reveal } from '@/components/Reveal';
import { Icon } from '@/components/Icons';
import { useProgress, levelRank } from '@/lib/progress';

const TICKER = [
  'MARKET STRUCTURE', 'LIQUIDITY SWEEPS', 'FAIR VALUE GAPS', 'ORDER BLOCKS', 'RISK MANAGEMENT',
  'BOS & CHoCH', 'POSITION SIZING', 'PREMIUM / DISCOUNT', 'MULTI-TIMEFRAME', 'TRADING PSYCHOLOGY',
  'XAUUSD', 'SUPPORT & RESISTANCE', 'REWARD-TO-RISK', 'BACKTESTING',
];

export default function HomePage() {
  const { t, L, lang } = useLang();
  const progress = useProgress();
  const rank = levelRank(progress.xp);
  const hasProgress = progress.xp > 0 || Object.keys(progress.lessons).length > 0;

  return (
    <div className="overflow-hidden">
      {/* ---------------------------- HERO ---------------------------- */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-4 pt-14 pb-10 sm:px-6 lg:px-8 lg:pt-20">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
            <div>
              <Reveal>
                <div className="chip-gold mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
                  {t('hero.badge')}
                </div>
              </Reveal>
              <Reveal delay={80}>
                <h1 className="h-display text-[clamp(2.35rem,5.2vw,4.15rem)] leading-[1.04] text-balance">
                  {t('hero.title1')}
                  <span className="block bg-gradient-to-r from-gold-300 via-gold-400 to-gold-200 bg-clip-text text-transparent">
                    {t('hero.title2')}
                  </span>
                </h1>
              </Reveal>
              <Reveal delay={150}>
                <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-mist-200">{t('hero.sub')}</p>
              </Reveal>
              <Reveal delay={220}>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link href="/learn" className="btn-primary text-[15px] !px-7 !py-4">
                    {t('cta.start')}
                    <Icon name="arrow-right" className="w-4 h-4" />
                  </Link>
                  <Link href="/simulator" className="btn-ghost text-[15px] !px-7 !py-4">
                    <Icon name="chart" className="w-4 h-4" />
                    {t('cta.simulator')}
                  </Link>
                </div>
              </Reveal>
              <Reveal delay={280}>
                <div className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    ['34+', 'hero.stat1'],
                    ['11', 'hero.stat2'],
                    ['10', 'hero.stat3'],
                    ['100%', 'hero.stat4'],
                  ].map(([n, k]) => (
                    <div key={k} className="card px-4 py-3.5">
                      <div className="font-display text-2xl font-bold text-gold-300">{n}</div>
                      <div className="mt-0.5 text-[11.5px] leading-tight text-mist-300">{t(k as never)}</div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            <Reveal delay={180} className="relative">
              <HeroChart />
              <div className="absolute -bottom-5 -left-2 sm:left-6 card px-4 py-3 flex items-center gap-3 animate-float">
                <div className="w-9 h-9 rounded-xl bg-bull/15 text-bull flex items-center justify-center">
                  <Icon name="check" />
                </div>
                <div>
                  <div className="text-[11px] text-mist-400">{lang === 'ms' ? 'Kaedah visual-first' : 'Visual-first method'}</div>
                  <div className="text-[13px] font-semibold">{lang === 'ms' ? 'Lihat → Cuba → Faham' : 'See it → Try it → Get it'}</div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* ticker */}
        <div className="mt-12 border-y border-white/[0.06] bg-ink-900/50 py-3.5 overflow-hidden">
          <div className="ticker-track gap-8">
            {[...TICKER, ...TICKER].map((w, i) => (
              <span key={i} className="flex items-center gap-8 text-[11.5px] font-semibold tracking-[0.22em] text-mist-400">
                {w}
                <span className="w-1.5 h-1.5 rounded-full bg-gold-400/50" />
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------- LEARNING PATH ------------------------- */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mb-3 chip">{lang === 'ms' ? 'KURIKULUM' : 'CURRICULUM'}</div>
          <h2 className="h-display text-[clamp(1.9rem,3.6vw,2.8rem)] text-balance">{t('home.path.title')}</h2>
          <p className="mt-3 max-w-2xl text-mist-300">{t('home.path.sub')}</p>
        </Reveal>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {LEVEL_META.map((lv, i) => {
            const doneCount = progress.lessons ? 0 : 0;
            return (
              <Reveal key={lv.id} delay={i * 70}>
                <Link
                  href={`/learn/${lv.id}`}
                  className="card card-hover block h-full p-6 group"
                >
                  <div className="flex items-start justify-between">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center"
                      style={{ background: `${lv.color}1c`, color: lv.color }}
                    >
                      <Icon name={lv.icon} className="w-6 h-6" />
                    </div>
                    <div className="text-[11px] font-bold tracking-[0.18em] text-mist-400">
                      {t('common.level')} {lv.index}
                    </div>
                  </div>
                  <h3 className="mt-4 font-display text-xl font-bold group-hover:text-gold-300 transition-colors">
                    {L(lv.title)}
                  </h3>
                  <div className="mt-1 text-[13px] font-medium" style={{ color: lv.color }}>
                    {L(lv.tagline)}
                  </div>
                  <p className="mt-3 text-[13.5px] leading-relaxed text-mist-300">{L(lv.description)}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {lv.skills.map((s, j) => (
                      <span key={j} className="chip !text-[10.5px] !py-1">{L(s)}</span>
                    ))}
                  </div>
                  <div className="mt-5 flex items-center gap-2 text-[13px] font-semibold text-gold-300">
                    {t('learn.startLevel')}
                    <Icon name="arrow-right" className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              </Reveal>
            );
          })}

          {/* assessment card */}
          <Reveal delay={360}>
            <div className="card h-full p-6 border-gold-400/25 bg-gradient-to-b from-gold-400/[0.08] to-transparent">
              <div className="w-12 h-12 rounded-2xl bg-gold-400/15 text-gold-300 flex items-center justify-center">
                <Icon name="graduation" className="w-6 h-6" />
              </div>
              <h3 className="mt-4 font-display text-xl font-bold">{t('learn.assessment')}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-mist-300">
                {lang === 'ms'
                  ? 'Ujian praktikal akhir menggabungkan semua kemahiran: struktur, kecairan, entri, risiko dan disiplin — dengan maklum balas penuh.'
                  : 'A final practical assessment combining every skill: structure, liquidity, entries, risk and discipline — with full feedback.'}
              </p>
              <Link href="/arena" className="btn-primary mt-5 !py-2.5">
                {t('cta.practice')}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* --------------------------- FEATURES --------------------------- */}
      <section className="relative py-20 bg-ink-900/40 border-y border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mb-3 chip">{lang === 'ms' ? 'PLATFORM' : 'PLATFORM'}</div>
            <h2 className="h-display text-[clamp(1.9rem,3.6vw,2.8rem)]">{t('home.features.title')}</h2>
            <p className="mt-3 max-w-2xl text-mist-300">{t('home.features.sub')}</p>
          </Reveal>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: 'candle',
                title: { en: 'Visual-first interactive lessons', ms: 'Pelajaran interaktif visual-first' },
                body: {
                  en: 'Animated chart stories teach every concept before the technical explanation. Answer questions, build candles, and get targeted feedback on mistakes.',
                  ms: 'Cerita carta beranimasi mengajar setiap konsep sebelum penjelasan teknikal. Jawab soalan, bina lilin, dan dapatkan maklum balas tepat atas kesilapan.',
                },
                tone: 'text-sky2 bg-sky2/[0.12]',
              },
              {
                icon: 'chart',
                title: { en: 'Professional chart simulator', ms: 'Simulator carta profesional' },
                body: {
                  en: 'Candle-by-candle replay with drawing tools, Fibonacci, zones, trade planning with live risk/reward and structural feedback on your analysis.',
                  ms: 'Replay lilin demi lilin dengan alat lukisan, Fibonacci, zon, perancangan dagangan dengan risiko/ganjaran langsung serta maklum balas struktur.',
                },
                tone: 'text-bull bg-bull/[0.12]',
              },
              {
                icon: 'target',
                title: { en: 'Practice Arena with reasoning', ms: 'Arena latihan dengan pemikiran' },
                body: {
                  en: 'Scenario drills that explain WHY an answer works — sweeps, structure shifts, invalid setups, trade placement and certification runs.',
                  ms: 'Latihan skenario yang menerangkan KENAPA jawapan berfungsi — sweep, anjakan struktur, setup tidak sah, penempatan dagangan dan larian pensijilan.',
                },
                tone: 'text-violet2 bg-violet2/[0.12]',
              },
              {
                icon: 'shield',
                title: { en: 'Risk-first toolkit', ms: 'Kit alat utamakan risiko' },
                body: {
                  en: 'Position sizing sandbox, reward-to-risk builder, session clock in Malaysia time and a news planning guide — with every assumption stated.',
                  ms: 'Sandbox saiz posisi, pembina ganjaran-risiko, jam sesi dalam waktu Malaysia serta panduan perancangan berita — semua andaian dinyatakan.',
                },
                tone: 'text-gold-300 bg-gold-400/[0.12]',
              },
              {
                icon: 'globe',
                title: { en: 'True bilingual experience', ms: 'Pengalaman dwibahasa sebenar' },
                body: {
                  en: 'Bahasa Melayu and English everywhere — lessons, quizzes, feedback, tools and achievements — with progress preserved when switching.',
                  ms: 'Bahasa Melayu dan English di mana-mana — pelajaran, kuiz, maklum balas, alat dan pencapaian — dengan kemajuan dipelihara semasa menukar.',
                },
                tone: 'text-bear bg-bear/[0.12]',
              },
              {
                icon: 'trophy',
                title: { en: 'Dashboard & gamification', ms: 'Papan pemuka & gamifikasi' },
                body: {
                  en: 'Roadmap, skill profiles, achievements, streaks and personalised suggestions — all local-first with no mandatory signup.',
                  ms: 'Peta hala tuju, profil kemahiran, pencapaian, streak dan cadangan peribadi — semua local-first tanpa pendaftaran wajib.',
                },
                tone: 'text-gold-200 bg-gold-300/[0.12]',
              },
            ].map((f, i) => (
              <Reveal key={i} delay={i * 60}>
                <div className="card card-hover h-full p-6">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${f.tone}`}>
                    <Icon name={f.icon} />
                  </div>
                  <h3 className="mt-4 font-display text-[17px] font-bold">{L(f.title)}</h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-mist-300">{L(f.body)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------- HOW IT WORKS ------------------------- */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <div className="chip mb-3">{lang === 'ms' ? 'KAEDAH' : 'METHOD'}</div>
            <h2 className="h-display text-[clamp(1.9rem,3.6vw,2.6rem)] text-balance">
              {lang === 'ms'
                ? 'Setiap konsep diajar seperti anda berada di sebelah juruanalisis'
                : 'Every concept taught like you are sitting next to an analyst'}
            </h2>
            <div className="mt-8 space-y-6">
              {[
                {
                  n: '01',
                  t: { en: 'See it happen', ms: 'Lihat ia berlaku' },
                  b: {
                    en: 'Candles form in front of you while annotations explain what to look for — no wall of text.',
                    ms: 'Lilin terbentuk di depan anda sambil anotasi menerangkan apa yang perlu dilihat — tiada dinding teks.',
                  },
                },
                {
                  n: '02',
                  t: { en: 'Try it yourself', ms: 'Cuba sendiri' },
                  b: {
                    en: 'Identify the sweep, place the stop, size the position. Interactive tasks grade your reasoning, not just your clicks.',
                    ms: 'Kenal pasti sweep, letak stop, saizkan posisi. Tugasan interaktif menilai pemikiran anda, bukan sekadar klikan.',
                  },
                },
                {
                  n: '03',
                  t: { en: 'Get coached on mistakes', ms: 'Dibimbing atas kesilapan' },
                  b: {
                    en: 'Wrong answers trigger targeted explanations so the gap in your understanding is closed immediately.',
                    ms: 'Jawapan salah mencetuskan penjelasan tepat supaya jurang kefahaman anda ditutup serta-merta.',
                  },
                },
              ].map((s, i) => (
                <div key={i} className="flex gap-5">
                  <div className="font-display text-2xl font-bold text-gold-400/70 pt-0.5">{s.n}</div>
                  <div>
                    <div className="font-semibold text-[16px]">{L(s.t)}</div>
                    <p className="mt-1.5 text-[14px] leading-relaxed text-mist-300">{L(s.b)}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={140}>
            <div className="card p-7 border-gold-400/20">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gold-400/15 text-gold-300 flex items-center justify-center">
                  <Icon name="info" />
                </div>
                <h3 className="font-display text-xl font-bold">{t('home.promise.title')}</h3>
              </div>
              <p className="mt-4 text-[14.5px] leading-relaxed text-mist-200">{t('home.promise.body')}</p>
              <div className="divider my-6" />
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-bear/[0.12] text-bear flex items-center justify-center shrink-0">
                  <Icon name="shield" className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-bear">{t('home.risk.title')}</div>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-mist-400">{t('home.risk.body')}</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ----------------------------- CTA ----------------------------- */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[28px] border border-gold-400/25 bg-gradient-to-br from-ink-800 via-ink-850 to-ink-900 p-10 sm:p-14">
            <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-gold-400/10 blur-3xl" />
            <div className="absolute -left-20 bottom-[-6rem] w-80 h-80 rounded-full bg-sky2/10 blur-3xl" />
            <div className="relative max-w-2xl">
              <div className="font-display text-[clamp(1.8rem,3.4vw,2.5rem)] font-bold leading-tight">
                {lang === 'ms'
                  ? 'Anda tidak perlu tahu apa-apa untuk bermula. Anda hanya perlu bermula.'
                  : 'You do not need to know anything to start. You only need to start.'}
              </div>
              <p className="mt-4 text-mist-200 text-[15.5px] leading-relaxed">
                {lang === 'ms'
                  ? 'Percuma, dwibahasa, tanpa pendaftaran wajib. Buka pelajaran pertama dalam beberapa saat — dan lihat betapa mudahnya konsep pasaran apabila ia dijelaskan dengan betul.'
                  : 'Free, bilingual, no signup required. Open your first lesson in seconds — and see how easy market concepts become when they are explained properly.'}
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/learn" className="btn-primary text-[15px] !px-7 !py-4">
                  {hasProgress ? t('cta.continue') : t('cta.start')}
                  <Icon name="arrow-right" className="w-4 h-4" />
                </Link>
                <Link href="/arena" className="btn-ghost text-[15px] !px-7 !py-4">
                  {t('cta.practice')}
                </Link>
              </div>
              {hasProgress && (
                <div className="mt-6 text-[13px] text-mist-300">
                  {lang === 'ms' ? 'Kedudukan anda' : 'Your rank'}:{' '}
                  <span className="text-gold-300 font-semibold">
                    {lang === 'ms' ? 'Tahap' : 'Level'} {rank.level} · {rank.title}
                  </span>{' '}
                  · {progress.xp} XP
                </div>
              )}
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
