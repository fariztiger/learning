'use client';

import Link from 'next/link';
import { useLang } from '@/lib/i18n';
import { LEVELS, TOTAL_LESSONS, TOTAL_MINUTES, levelLessonIds } from '@/content/curriculum';
import { useProgress, levelRank, lessonCompletion } from '@/lib/progress';
import { Reveal } from '@/components/Reveal';
import { Icon } from '@/components/Icons';

export default function LearnPage() {
  const { t, L, lang } = useLang();
  const progress = useProgress();
  const rank = levelRank(progress.xp);
  const overall = LEVELS.reduce((acc, lv) => acc + lessonCompletion(progress, levelLessonIds(lv.id)), 0) / LEVELS.length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Reveal>
        <div className="chip mb-3">{lang === 'ms' ? 'KURIKULUM' : 'CURRICULUM'}</div>
        <h1 className="h-display text-[clamp(2rem,4vw,3rem)]">{t('learn.title')}</h1>
        <p className="mt-3 max-w-2xl text-mist-300">{t('learn.sub')}</p>
      </Reveal>

      {/* summary strip */}
      <Reveal delay={80}>
        <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="card p-4">
            <div className="text-[11px] uppercase tracking-[0.13em] text-mist-400">{t('common.progress')}</div>
            <div className="mt-1 font-display text-2xl font-bold text-gold-300">{Math.round(overall * 100)}%</div>
            <div className="mt-1.5 h-1.5 rounded-full bg-white/[0.07]">
              <div className="h-full rounded-full bg-gold-400 transition-all" style={{ width: `${overall * 100}%` }} />
            </div>
          </div>
          <div className="card p-4">
            <div className="text-[11px] uppercase tracking-[0.13em] text-mist-400">{lang === 'ms' ? 'Jumlah pelajaran' : 'Total lessons'}</div>
            <div className="mt-1 font-display text-2xl font-bold">{TOTAL_LESSONS}</div>
            <div className="mt-1 text-[11px] text-mist-400">≈ {TOTAL_MINUTES} {t('common.minutes')}</div>
          </div>
          <div className="card p-4">
            <div className="text-[11px] uppercase tracking-[0.13em] text-mist-400">{t('common.xp')}</div>
            <div className="mt-1 font-display text-2xl font-bold text-gold-300">{progress.xp}</div>
            <div className="mt-1 text-[11px] text-mist-400">
              {lang === 'ms' ? 'Tahap' : 'Level'} {rank.level} · {rank.title}
            </div>
          </div>
          <div className="card p-4">
            <div className="text-[11px] uppercase tracking-[0.13em] text-mist-400">{t('dash.streakTitle')}</div>
            <div className="mt-1 font-display text-2xl font-bold text-gold-300">
              {progress.streak.count} 🔥
            </div>
            <div className="mt-1 text-[11px] text-mist-400">{t('common.streak')}</div>
          </div>
        </div>
      </Reveal>

      <div className="mt-4 text-[12.5px] text-mist-400">{t('learn.locked')}</div>

      {/* levels */}
      <div className="mt-6 space-y-5">
        {LEVELS.map((lv, i) => {
          const ids = levelLessonIds(lv.id);
          const done = ids.filter((id) => progress.lessons[id]?.done).length;
          const pct = Math.round((done / ids.length) * 100);
          return (
            <Reveal key={lv.id} delay={i * 60}>
              <div className="card overflow-hidden">
                <div className="flex flex-col gap-5 p-6 lg:flex-row lg:items-center">
                  <div
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl"
                    style={{ background: `${lv.color}1c`, color: lv.color }}
                  >
                    <span className="font-display text-xl font-bold">{lv.index}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h2 className="font-display text-xl font-bold">{L(lv.title)}</h2>
                      <span className="chip !text-[10px]" style={{ borderColor: `${lv.color}44`, color: lv.color }}>
                        {ids.length} {t('learn.lessonsCount')}
                      </span>
                      {pct === 100 && (
                        <span className="chip border-bull/40 !text-[10px] text-bull">
                          <Icon name="check" className="w-3 h-3" /> {t('common.completed')}
                        </span>
                      )}
                    </div>
                    <div className="mt-1 text-[13px] font-medium" style={{ color: lv.color }}>
                      {L(lv.tagline)}
                    </div>
                    <p className="mt-2 max-w-2xl text-[13.5px] leading-relaxed text-mist-300">{L(lv.description)}</p>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.07]">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${pct}%`, background: lv.color }}
                        />
                      </div>
                      <span className="font-mono text-[11px] text-mist-400">
                        {done}/{ids.length}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/learn/${lv.id}`}
                    className="btn-primary shrink-0 !py-2.5"
                  >
                    {pct > 0 && pct < 100 ? t('learn.review') : t('learn.startLevel')}
                    <Icon name="arrow-right" className="w-4 h-4" />
                  </Link>
                </div>

                {/* lesson chips */}
                <div className="border-t border-white/[0.06] bg-ink-900/30 px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    {lv.lessons.map((lesson, j) => {
                      const st = progress.lessons[lesson.id];
                      return (
                        <Link
                          key={lesson.id}
                          href={`/learn/${lv.id}/${lesson.id}`}
                          className={`group flex items-center gap-2 rounded-xl border px-3 py-2 text-[12px] transition-all ${
                            st?.done
                              ? 'border-bull/35 bg-bull/[0.08] text-bull'
                              : st?.step
                              ? 'border-gold-400/35 bg-gold-400/[0.07] text-gold-200'
                              : 'border-white/[0.08] bg-white/[0.02] text-mist-300 hover:border-white/25'
                          }`}
                        >
                          <span className="opacity-60 font-mono">{j + 1}</span>
                          {L(lesson.title)}
                          {st?.done && <Icon name="check" className="w-3.5 h-3.5" />}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      {/* assessment CTA */}
      <Reveal>
        <div className="card mt-8 border-gold-400/25 bg-gradient-to-r from-gold-400/[0.08] to-transparent p-7">
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <div className="w-12 h-12 rounded-2xl bg-gold-400/15 text-gold-300 flex items-center justify-center shrink-0">
              <Icon name="graduation" className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-display text-xl font-bold">{t('learn.assessment')}</h3>
              <p className="mt-1 text-[13.5px] text-mist-300">
                {lang === 'ms'
                  ? 'Gabungkan semua kemahiran dalam larian pensijilan Arena — dengan gred dan maklum balas penuh.'
                  : 'Combine every skill in the Arena certification run — with grading and full feedback.'}
              </p>
            </div>
            <Link href="/arena" className="btn-primary">
              {t('cta.practice')}
            </Link>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
