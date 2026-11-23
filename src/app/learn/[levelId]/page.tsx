'use client';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useLang } from '@/lib/i18n';
import { getLevel } from '@/content/curriculum';
import { useProgress } from '@/lib/progress';
import { Icon } from '@/components/Icons';

export default function LevelPage({ params }: { params: { levelId: string } }) {
  const level = getLevel(params.levelId);
  const { t, L, lang } = useLang();
  const progress = useProgress();

  if (!level) return notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <Link href="/learn" className="btn-ghost !px-3 !py-2 text-[12.5px]">
        <Icon name="arrow-left" className="w-4 h-4" />
        {t('learn.title')}
      </Link>

      <div className="mt-5 flex items-start gap-4">
        <div
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl"
          style={{ background: `${level.color}1c`, color: level.color }}
        >
          <Icon name="book" className="w-7 h-7" />
        </div>
        <div>
          <div className="chip" style={{ borderColor: `${level.color}55`, color: level.color }}>
            {t('common.level')} {level.index}
          </div>
          <h1 className="mt-2 font-display text-[clamp(1.8rem,3.6vw,2.6rem)] font-bold">{L(level.title)}</h1>
          <p className="mt-1.5 text-[15px] text-mist-300">{L(level.description)}</p>
        </div>
      </div>

      <div className="mt-8 space-y-3">
        {level.lessons.map((lesson, i) => {
          const st = progress.lessons[lesson.id];
          const started = st && st.step > 0;
          return (
            <Link
              key={lesson.id}
              href={`/learn/${level.id}/${lesson.id}`}
              className="card card-hover group flex items-center gap-4 p-5"
            >
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-display font-bold ${
                  st?.done ? 'bg-bull/15 text-bull' : started ? 'bg-gold-400/15 text-gold-300' : 'bg-white/[0.06] text-mist-300'
                }`}
              >
                {st?.done ? <Icon name="check" className="w-5 h-5" /> : i + 1}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-[15.5px] group-hover:text-gold-300 transition-colors">
                  {L(lesson.title)}
                </div>
                <div className="mt-1 text-[12.5px] text-mist-400">{L(lesson.summary)}</div>
                <div className="mt-2 flex items-center gap-2.5 text-[11px] text-mist-400">
                  <span className="flex items-center gap-1">
                    <Icon name="clock" className="w-3.5 h-3.5" /> {lesson.minutes} {t('common.minutes')}
                  </span>
                  <span className="text-gold-300/80">+{lesson.xp} XP</span>
                  {started && !st?.done && (
                    <span className="chip-gold !py-0.5 !text-[10px]">
                      {lang === 'ms' ? 'sedang berjalan' : 'in progress'}
                    </span>
                  )}
                </div>
              </div>
              <Icon name="arrow-right" className="w-5 h-5 text-mist-500 transition-transform group-hover:translate-x-1 group-hover:text-gold-300" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
