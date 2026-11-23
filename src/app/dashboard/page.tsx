'use client';

/* Learning dashboard — roadmap, skills, achievements, streaks */

import { useRef } from 'react';
import Link from 'next/link';
import { useLang } from '@/lib/i18n';
import { progressActions, useProgress, levelRank, lessonCompletion } from '@/lib/progress';
import { LEVELS, ALL_LESSONS, levelLessonIds, getLessonById } from '@/content/curriculum';
import { ACHIEVEMENTS } from '@/content/achievements';
import { Reveal } from '@/components/Reveal';
import { Icon } from '@/components/Icons';

const SKILL_LABELS: Record<string, { en: string; ms: string }> = {
  basics: { en: 'Market Basics', ms: 'Asas Pasaran' },
  candles: { en: 'Candle Reading', ms: 'Membaca Lilin' },
  structure: { en: 'Market Structure', ms: 'Struktur Pasaran' },
  levels: { en: 'Levels & Zones', ms: 'Paras & Zon' },
  liquidity: { en: 'Liquidity', ms: 'Kecairan' },
  smc: { en: 'Smart Money', ms: 'Wang Pintar' },
  risk: { en: 'Risk Management', ms: 'Pengurusan Risiko' },
  execution: { en: 'Execution', ms: 'Pelaksanaan' },
  process: { en: 'Process & Discipline', ms: 'Proses & Disiplin' },
  psychology: { en: 'Psychology', ms: 'Psikologi' },
};

export default function DashboardPage() {
  const { t, L, lang } = useLang();
  const progress = useProgress();
  const rank = levelRank(progress.xp);
  const fileRef = useRef<HTMLInputElement>(null);

  const doneLessons = ALL_LESSONS.filter((l) => progress.lessons[l.id]?.done);
  const overall = doneLessons.length / ALL_LESSONS.length;

  // skills profile: fraction of lessons with that skill completed
  const skills = Object.keys(SKILL_LABELS).map((key) => {
    const withSkill = ALL_LESSONS.filter((l) => l.skills.includes(key));
    const done = withSkill.filter((l) => progress.lessons[l.id]?.done).length;
    return {
      key,
      pct: withSkill.length ? Math.round((done / withSkill.length) * 100) : 0,
      count: withSkill.length,
    };
  });

  const nextUp =
    ALL_LESSONS.find((l) => !progress.lessons[l.id]?.done) ?? ALL_LESSONS[0];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-start gap-5">
        <div>
          <div className="chip">{t('dash.title')}</div>
          <h1 className="mt-2.5 font-display text-[clamp(2rem,4vw,2.8rem)] font-bold">
            {t('dash.welcome')} 👋
          </h1>
          <p className="mt-2 text-mist-300">{t('dash.noAccount')}</p>
        </div>
        <div className="ml-auto flex flex-wrap gap-2">
          <button className="btn-ghost !py-2.5 text-[12px]" onClick={() => {
            const blob = new Blob([progressActions.exportJson()], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'tigerfx-progress.json';
            a.click();
            URL.revokeObjectURL(url);
          }}>
            {t('dash.export')}
          </button>
          <button className="btn-ghost !py-2.5 text-[12px]" onClick={() => fileRef.current?.click()}>
            {t('dash.import')}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (f) {
                const text = await f.text();
                progressActions.importJson(text);
              }
            }}
          />
          <button
            className="btn-danger !py-2.5 text-[12px]"
            onClick={() => {
              if (confirm(t('dash.resetConfirm'))) progressActions.reset();
            }}
          >
            {t('dash.reset')}
          </button>
        </div>
      </div>

      {/* top stats */}
      <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Reveal>
          <div className="card p-5">
            <div className="text-[11px] uppercase tracking-[0.13em] text-mist-400">{t('dash.level')}</div>
            <div className="mt-1.5 font-display text-2xl font-bold text-gold-300">
              {lang === 'ms' ? 'Tahap' : 'Level'} {rank.level}
            </div>
            <div className="text-[12.5px] text-mist-300">{rank.title}</div>
            <div className="mt-3 h-1.5 rounded-full bg-white/[0.07]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-gold-400 to-gold-300"
                style={{ width: `${Math.min(100, (rank.into / rank.need) * 100)}%` }}
              />
            </div>
            <div className="mt-1.5 font-mono text-[10.5px] text-mist-400">
              {progress.xp} / {rank.into + (rank.need === 1 ? 0 : rank.need)} XP
            </div>
          </div>
        </Reveal>
        <Reveal delay={60}>
          <div className="card p-5">
            <div className="text-[11px] uppercase tracking-[0.13em] text-mist-400">{t('common.progress')}</div>
            <div className="mt-1.5 font-display text-2xl font-bold">{Math.round(overall * 100)}%</div>
            <div className="text-[12.5px] text-mist-300">
              {doneLessons.length}/{ALL_LESSONS.length} {lang === 'ms' ? 'pelajaran' : 'lessons'}
            </div>
            <div className="mt-3 h-1.5 rounded-full bg-white/[0.07]">
              <div className="h-full rounded-full bg-bull" style={{ width: `${overall * 100}%` }} />
            </div>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div className="card p-5">
            <div className="text-[11px] uppercase tracking-[0.13em] text-mist-400">{t('dash.streakTitle')}</div>
            <div className="mt-1.5 font-display text-2xl font-bold text-gold-300">
              {progress.streak.count} 🔥
            </div>
            <div className="text-[12.5px] text-mist-300">
              {progress.streak.count >= 7
                ? lang === 'ms' ? 'Luar biasa!' : 'Outstanding!'
                : progress.streak.count >= 3
                ? lang === 'ms' ? 'Bagus, teruskan!' : 'Great, keep going!'
                : lang === 'ms' ? 'Belajar setiap hari untuk streak.' : 'Learn daily to build a streak.'}
            </div>
          </div>
        </Reveal>
        <Reveal delay={180}>
          <div className="card border-gold-400/25 bg-gradient-to-b from-gold-400/[0.07] to-transparent p-5">
            <div className="text-[11px] uppercase tracking-[0.13em] text-gold-300">{t('dash.suggested')}</div>
            <div className="mt-1.5 font-display text-[15.5px] font-bold leading-snug">{L(nextUp.title)}</div>
            <Link href={`/learn/${nextUp.levelId}/${nextUp.id}`} className="btn-primary mt-3 w-full !py-2 text-[12px]">
              {progress.lessons[nextUp.id]?.step ? t('cta.continue') : t('cta.start')}
              <Icon name="arrow-right" className="w-3.5 h-3.5" />
            </Link>
          </div>
        </Reveal>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        {/* roadmap */}
        <Reveal>
          <div className="card p-6">
            <div className="flex items-center gap-2">
              <Icon name="compass" className="w-5 h-5 text-gold-300" />
              <h2 className="font-display text-lg font-bold">{t('dash.roadmap')}</h2>
            </div>
            <div className="mt-5 space-y-4">
              {LEVELS.map((lv) => {
                const pct = lessonCompletion(progress, levelLessonIds(lv.id)) * 100;
                return (
                  <div key={lv.id} className="flex items-center gap-4">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-display text-sm font-bold"
                      style={{ background: `${lv.color}1c`, color: lv.color }}
                    >
                      {pct === 100 ? <Icon name="check" className="w-4 h-4" /> : lv.index}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <Link href={`/learn/${lv.id}`} className="text-[13.5px] font-semibold hover:text-gold-300 transition-colors">
                          {L(lv.title)}
                        </Link>
                        <span className="font-mono text-[11px] text-mist-400">{Math.round(pct)}%</span>
                      </div>
                      <div className="mt-1.5 h-1.5 rounded-full bg-white/[0.07]">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${pct}%`, background: lv.color }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>

        {/* skills */}
        <Reveal delay={80}>
          <div className="card p-6">
            <div className="flex items-center gap-2">
              <Icon name="target" className="w-5 h-5 text-gold-300" />
              <h2 className="font-display text-lg font-bold">{t('dash.skills')}</h2>
            </div>
            <div className="mt-5 space-y-3">
              {skills
                .filter((s) => s.count > 0)
                .map((s) => (
                  <div key={s.key}>
                    <div className="flex items-center justify-between text-[12px]">
                      <span className="text-mist-300">
                        {SKILL_LABELS[s.key][lang] ?? SKILL_LABELS[s.key].en}
                      </span>
                      <span className="font-mono text-mist-400">{s.pct}%</span>
                    </div>
                    <div className="mt-1 h-1.5 rounded-full bg-white/[0.07]">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          s.pct >= 80 ? 'bg-bull' : s.pct >= 40 ? 'bg-gold-400' : 'bg-sky2'
                        }`}
                        style={{ width: `${s.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
            </div>
            <p className="mt-4 text-[11px] leading-relaxed text-mist-500">
              {lang === 'ms'
                ? 'Kemahiran dikira daripada pelajaran yang diselesaikan. Kelemahan = cadangan fokus anda.'
                : 'Skills are computed from completed lessons. Weak areas = your suggested focus.'}
            </p>
          </div>
        </Reveal>
      </div>

      {/* achievements */}
      <Reveal>
        <div className="card mt-6 p-6">
          <div className="flex items-center gap-2">
            <Icon name="trophy" className="w-5 h-5 text-gold-300" />
            <h2 className="font-display text-lg font-bold">{t('dash.achievements')}</h2>
            <span className="chip ml-auto !text-[10px]">
              {progress.achievements.length}/{ACHIEVEMENTS.length}
            </span>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {ACHIEVEMENTS.map((a) => {
              const unlocked = progress.achievements.includes(a.id);
              return (
                <div
                  key={a.id}
                  className={`rounded-2xl border p-4 text-center transition-all ${
                    unlocked
                      ? 'border-gold-400/35 bg-gold-400/[0.08]'
                      : 'border-white/[0.06] bg-white/[0.02] opacity-55'
                  }`}
                  title={L(a.desc)}
                >
                  <div
                    className={`mx-auto flex h-10 w-10 items-center justify-center rounded-xl ${
                      unlocked ? 'bg-gold-400/20 text-gold-300' : 'bg-white/[0.05] text-mist-500'
                    }`}
                  >
                    <Icon name={unlocked ? a.icon : 'star'} className="w-5 h-5" />
                  </div>
                  <div className="mt-2 text-[11.5px] font-semibold leading-tight">{L(a.title)}</div>
                  <div className="mt-1 text-[10px] text-mist-400">+{a.xp} XP</div>
                </div>
              );
            })}
          </div>
        </div>
      </Reveal>

      {/* history */}
      <Reveal>
        <div className="card mt-6 p-6">
          <div className="flex items-center gap-2">
            <Icon name="clock" className="w-5 h-5 text-gold-300" />
            <h2 className="font-display text-lg font-bold">{t('dash.recent')}</h2>
          </div>
          <div className="mt-4 space-y-2">
            {progress.history.length === 0 && (
              <p className="text-[13px] text-mist-400">
                {lang === 'ms'
                  ? 'Belum ada aktiviti — mula pelajaran pertama anda!'
                  : 'No activity yet — start your first lesson!'}
              </p>
            )}
            {progress.history.slice(0, 8).map((h, i) => {
              const lesson = h.kind === 'lesson' ? getLessonById(h.id) : undefined;
              return (
                <div key={i} className="flex items-center gap-3 rounded-xl bg-white/[0.025] px-4 py-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gold-400/[0.12] text-gold-300 flex items-center justify-center">
                    <Icon name={h.kind === 'scenario' ? 'target' : h.kind === 'achievement' ? 'trophy' : 'book'} className="w-4 h-4" />
                  </div>
                  <div className="flex-1 text-[12.5px]">
                    {h.kind === 'lesson' && lesson ? L(lesson.title) : h.label}
                  </div>
                  <div className="text-[10.5px] text-mist-500">
                    {new Date(h.ts).toLocaleDateString(lang === 'ms' ? 'ms-MY' : 'en-GB')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Reveal>
    </div>
  );
}
