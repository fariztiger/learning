'use client';

/* Lesson player — step engine with progress persistence */

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import type { Lesson, Level, Step } from '@/lib/types';
import { useLang } from '@/lib/i18n';
import { progressActions, useProgress } from '@/lib/progress';
import { afterLessonComplete, afterQuiz } from '@/lib/achievements';
import { nextLesson } from '@/content/curriculum';
import { ChartScene } from './ChartScene';
import { QuizCard } from './QuizCard';
import { ChartTaskCard } from './ChartTaskCard';
import { WidgetRouter } from './WidgetRouter';
import { Icon } from '../Icons';

export function LessonPlayer({ level, lesson }: { level: Level; lesson: Lesson }) {
  const { L, t, lang } = useLang();
  const progress = useProgress();
  const [step, setStep] = useState(0);
  const [justFinished, setJustFinished] = useState(false);

  const saved = progress.lessons[lesson.id];
  const total = lesson.steps.length;

  useEffect(() => {
    const s = progress.lessons[lesson.id]?.step ?? 0;
    setStep(Math.min(s, total - 1));
    setJustFinished(false);
    progressActions.setLastLesson(lesson.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson.id]);

  useEffect(() => {
    if (!justFinished) progressActions.updateLesson(lesson.id, { step });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const goto = (n: number) => {
    const clamped = Math.max(0, Math.min(total - 1, n));
    setStep(clamped);
    if (clamped === total - 1 && !saved?.done) {
      progressActions.completeLesson(lesson.id, lesson.xp, lesson.title[lang]);
      afterLessonComplete(lesson.id, lang);
      setJustFinished(true);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const nxt = nextLesson(lesson.id);
  const current: Step = lesson.steps[step];
  const pct = Math.round(((step + 1) / total) * 100);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {/* header */}
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href={`/learn/${level.id}`}
          className="btn-ghost !px-3 !py-2 text-[12.5px]"
        >
          <Icon name="arrow-left" className="w-4 h-4" />
          {t('learn.title')}
        </Link>
        <div className="chip" style={{ borderColor: `${level.color}55`, color: level.color }}>
          {t('common.level')} {level.index} · {L(level.title)}
        </div>
        <div className="ml-auto flex items-center gap-2 text-[12px] text-mist-400">
          <Icon name="clock" className="w-4 h-4" />
          {lesson.minutes} {t('common.minutes')}
          <span className="mx-1 opacity-40">·</span>
          <span className="text-gold-300">+{lesson.xp} {t('common.xp')}</span>
        </div>
      </div>

      <h1 className="mt-4 font-display text-[clamp(1.65rem,3.4vw,2.35rem)] font-bold leading-tight">
        {L(lesson.title)}
      </h1>
      <p className="mt-2 text-[15px] leading-relaxed text-mist-300">{L(lesson.summary)}</p>

      {/* progress bar */}
      <div className="mt-6">
        <div className="flex items-center justify-between text-[11.5px] text-mist-400">
          <span>
            {t('common.step')} {step + 1} {t('common.of')} {total}
          </span>
          <span>{pct}%</span>
        </div>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-gold-400 to-gold-300 transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {lesson.steps.map((s, i) => (
            <button
              key={i}
              onClick={() => goto(i)}
              aria-label={`${t('common.step')} ${i + 1}`}
              className={`rounded-full px-2.5 py-1 text-[10.5px] font-semibold transition ${
                i === step
                  ? 'bg-gold-400 text-ink-950'
                  : i < step
                  ? 'bg-gold-400/15 text-gold-200 hover:bg-gold-400/25'
                  : 'bg-white/[0.05] text-mist-400 hover:bg-white/[0.1]'
              }`}
            >
              {s.kind === 'quiz' ? 'Q' : s.kind === 'scene' ? '▶' : s.kind === 'chartTask' ? '◎' : s.kind === 'widget' ? '⚙' : '§'}
            </button>
          ))}
        </div>
      </div>

      {/* step body */}
      <div className="mt-7 animate-fade-in" key={step}>
        {current.kind === 'text' && (
          <article className="card p-7">
            <h2 className="font-display text-2xl font-bold leading-snug">{L(current.title)}</h2>
            <p className="mt-4 text-[15.5px] leading-[1.85] text-mist-200">{L(current.body)}</p>
            {current.bullets && (
              <ul className="mt-5 space-y-3">
                {current.bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-gold-400/15 text-gold-300">
                      <Icon name="check" className="w-3 h-3" />
                    </div>
                    <span className="text-[14.5px] leading-relaxed text-mist-200">{L(b)}</span>
                  </li>
                ))}
              </ul>
            )}
            {current.callout && (
              <div
                className={`mt-6 rounded-xl border-l-[3px] p-4 text-[14px] leading-relaxed ${
                  current.callout.tone === 'risk'
                    ? 'border-bear bg-bear/[0.07] text-mist-200'
                    : current.callout.tone === 'key'
                    ? 'border-gold-400 bg-gold-400/[0.07] text-mist-200'
                    : current.callout.tone === 'tip'
                    ? 'border-bull bg-bull/[0.07] text-mist-200'
                    : 'border-sky2 bg-sky2/[0.07] text-mist-200'
                }`}
              >
                <span
                  className={`font-semibold ${
                    current.callout.tone === 'risk'
                      ? 'text-bear'
                      : current.callout.tone === 'key'
                      ? 'text-gold-300'
                      : current.callout.tone === 'tip'
                      ? 'text-bull'
                      : 'text-sky2'
                  }`}
                >
                  {current.callout.tone === 'risk'
                    ? lang === 'ms'
                      ? '⚠ Risiko'
                      : '⚠ Risk'
                    : current.callout.tone === 'key'
                    ? lang === 'ms'
                      ? '★ Konsep utama'
                      : '★ Key concept'
                    : current.callout.tone === 'tip'
                    ? lang === 'ms'
                      ? '✦ Petua'
                      : '✦ Tip'
                    : lang === 'ms'
                    ? '• Nota'
                    : '• Note'}
                  :
                </span>{' '}
                {L(current.callout.text)}
              </div>
            )}
          </article>
        )}

        {current.kind === 'scene' && (
          <div>
            <h2 className="mb-3 font-display text-2xl font-bold">{L(current.title)}</h2>
            <ChartScene scene={current.scene} />
            <p className="mt-2 px-1 text-[11.5px] text-mist-400">{t('common.simulated')}</p>
          </div>
        )}

        {current.kind === 'quiz' && (
          <QuizCard
            question={current.question}
            options={current.options}
            multi={current.multi}
            onSolved={(perfect) => afterQuiz(perfect, lang)}
          />
        )}

        {current.kind === 'chartTask' && (
          <ChartTaskCard
            title={current.title}
            instruction={current.instruction}
            candles={current.candles}
            target={current.target}
            hint={current.hint}
            success={current.success}
            miss={current.miss}
          />
        )}

        {current.kind === 'widget' && (
          <div>
            <WidgetRouter widget={current.widget} title={current.title} caption={current.caption} />
            <p className="mt-2 px-1 text-[11.5px] text-mist-400">{t('lesson.widgetTry')}</p>
          </div>
        )}
      </div>

      {/* nav */}
      <div className="mt-8 flex items-center gap-3">
        <button className="btn-ghost" onClick={() => goto(step - 1)} disabled={step === 0}>
          <Icon name="arrow-left" className="w-4 h-4" />
          {t('common.back')}
        </button>
        {step < total - 1 ? (
          <button className="btn-primary ml-auto" onClick={() => goto(step + 1)}>
            {t('common.next')}
            <Icon name="arrow-right" className="w-4 h-4" />
          </button>
        ) : (
          <button className="btn-primary ml-auto" onClick={() => goto(step)}>
            {saved?.done ? t('common.completed') : t('common.finish')}
            <Icon name="check" className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* complete panel */}
      {(justFinished || (step === total - 1 && saved?.done)) && (
        <div className="card mt-8 border-gold-400/30 bg-gradient-to-b from-gold-400/[0.08] to-transparent p-7 animate-fade-up">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gold-400/15 text-gold-300 flex items-center justify-center">
              <Icon name="trophy" className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display text-xl font-bold">{t('lesson.done')}</h3>
              <p className="text-[13px] text-mist-300">{t('lesson.doneSub')}</p>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            {nxt && (
              <Link href={`/learn/${nxt.level.id}/${nxt.lesson.id}`} className="btn-primary">
                {t('lesson.nextLesson')}: {L(nxt.lesson.title)}
                <Icon name="arrow-right" className="w-4 h-4" />
              </Link>
            )}
            <Link href="/learn" className="btn-ghost">
              {t('lesson.backCurriculum')}
            </Link>
            <Link href="/arena" className="btn-ghost">
              {t('cta.practice')}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
