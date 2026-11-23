'use client';

/* Practice Arena — scenario drills with reasoning feedback */

import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import type { Drawing, Scenario, TradeDraw } from '@/lib/types';
import { SCENARIOS, getScenario } from '@/content/scenarios';
import { gradeTradePlacement, hitTarget } from '@/lib/chart/analysis';
import { useLang } from '@/lib/i18n';
import { progressActions, useProgress } from '@/lib/progress';
import { afterScenario } from '@/lib/achievements';
import { ChartCanvas, type ChartCanvasHandle } from '@/components/learn/ChartCanvas';
import { Icon } from '@/components/Icons';

type Phase = 'browse' | 'run' | 'result';

const TIER_ORDER: Scenario['tier'][] = ['foundation', 'intermediate', 'advanced', 'certification'];

export default function ArenaPage() {
  const { t, L, lang } = useLang();
  const progress = useProgress();
  const [phase, setPhase] = useState<Phase>('browse');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [pick, setPick] = useState<'buy' | 'sell' | 'no-trade' | null>(null);
  const [hits, setHits] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [notes, setNotes] = useState<string[]>([]);
  const [explain, setExplain] = useState<string>('');
  const chartHandle = useRef<ChartCanvasHandle>(null);

  const active = activeId ? getScenario(activeId) : null;

  const startScenario = (id: string) => {
    setActiveId(id);
    setPick(null);
    setHits([]);
    setScore(0);
    setNotes([]);
    setExplain('');
    setPhase('run');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submitDecide = (sc: Scenario) => {
    if (!pick || sc.task.type !== 'decide') return;
    const correct = sc.task.correct === pick;
    const s = correct ? 100 : 35;
    setScore(s);
    setNotes([lang === 'ms' ? sc.task.explain[pick].ms : sc.task.explain[pick].en]);
    setExplain(lang === 'ms' ? sc.task.explain[sc.task.correct].ms : sc.task.explain[sc.task.correct].en);
    finish(sc, s);
  };

  const submitIdentify = (sc: Scenario) => {
    if (sc.task.type !== 'identify') return;
    const s = Math.round((hits.length / sc.task.targets.length) * 100);
    setScore(s);
    setNotes([lang === 'ms' ? sc.task.explain.ms : sc.task.explain.en]);
    finish(sc, s);
  };

  const submitTrade = (sc: Scenario) => {
    if (sc.task.type !== 'place-trade') return;
    const drawings = chartHandle.current?.engine?.getDrawings() ?? [];
    const trade = [...drawings].reverse().find((d) => d.kind === 'trade') as TradeDraw | undefined;
    if (!trade) {
      setNotes([
        lang === 'ms'
          ? 'Gunakan alat Dagangan pada carta dahulu: klik entry → stop → sasaran.'
          : 'Use the Trade tool on the chart first: click entry → stop → target.',
      ]);
      return;
    }
    const g = gradeTradePlacement(trade, sc.task.key);
    setScore(g.score);
    setNotes(g.notes);
    setExplain(lang === 'ms' ? sc.task.explain.ms : sc.task.explain.en);
    finish(sc, g.score);
  };

  const finish = (sc: Scenario, s: number) => {
    progressActions.recordScenario(sc.id, s, sc.xp, sc.title[lang]);
    afterScenario(sc.id, s, sc.tier, lang);
    setPhase('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* ------------------------------ browse ------------------------------ */
  if (phase === 'browse' || !active) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="chip mb-3">{lang === 'ms' ? 'LATIHAN' : 'PRACTICE'}</div>
        <h1 className="h-display text-[clamp(2rem,4vw,2.9rem)]">{t('arena.title')}</h1>
        <p className="mt-3 max-w-2xl text-mist-300">{t('arena.sub')}</p>

        <div className="mt-9 space-y-10">
          {TIER_ORDER.map((tier) => {
            const list = SCENARIOS.filter((sc) => sc.tier === tier);
            return (
              <div key={tier}>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      tier === 'certification' ? 'bg-gold-400' : tier === 'advanced' ? 'bg-bear' : tier === 'intermediate' ? 'bg-violet2' : 'bg-sky2'
                    }`}
                  />
                  <h2 className="font-display text-xl font-bold">{t(`arena.tier.${tier}`)}</h2>
                  <div className="h-px flex-1 bg-white/[0.08]" />
                  <span className="text-[11px] text-mist-400">
                    {list.filter((sc) => progress.scenarios[sc.id]?.done).length}/{list.length}{' '}
                    {lang === 'ms' ? 'lulus' : 'passed'}
                  </span>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {list.map((sc) => {
                    const st = progress.scenarios[sc.id];
                    return (
                      <div key={sc.id} className="card card-hover flex flex-col p-5">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="font-display text-[16.5px] font-bold leading-snug">{L(sc.title)}</h3>
                          {st?.done && (
                            <span className="chip border-bull/40 !text-[10px] shrink-0 text-bull">
                              <Icon name="check" className="w-3 h-3" />
                              {st.best}%
                            </span>
                          )}
                        </div>
                        <p className="mt-2 flex-1 text-[12.5px] leading-relaxed text-mist-300">{L(sc.context)}</p>
                        <div className="mt-3 flex items-center gap-2 text-[10.5px] text-mist-400">
                          <span className="chip !text-[10px] !py-1">
                            {sc.task.type === 'decide'
                              ? lang === 'ms'
                                ? 'Keputusan'
                                : 'Decision'
                              : sc.task.type === 'identify'
                              ? lang === 'ms'
                                ? 'Kenal pasti'
                                : 'Identify'
                              : lang === 'ms'
                              ? 'Rancang dagangan'
                              : 'Trade plan'}
                          </span>
                          <span>+{sc.xp} XP</span>
                          {st && st.attempts > 0 && (
                            <span>
                              · {st.attempts} {t('arena.attempts')}
                            </span>
                          )}
                        </div>
                        <button className="btn-primary mt-4 w-full !py-2.5" onClick={() => startScenario(sc.id)}>
                          {st?.done ? t('arena.review') : t('arena.start')}
                          <Icon name="arrow-right" className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  /* ------------------------------- run ------------------------------- */
  const task = active.task;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <button
        className="btn-ghost !px-3 !py-2 text-[12.5px]"
        onClick={() => setPhase('browse')}
      >
        <Icon name="arrow-left" className="w-4 h-4" />
        {t('arena.title')}
      </button>

      <div className="mt-4">
        <div className="chip-gold">{t(`arena.tier.${active.tier}`)}</div>
        <h1 className="mt-2 font-display text-[clamp(1.6rem,3vw,2.2rem)] font-bold">{L(active.title)}</h1>
        <p className="mt-2 max-w-3xl text-[14px] leading-relaxed text-mist-300">{L(active.context)}</p>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_380px]">
        <div className="card overflow-hidden">
          <ChartCanvas
            ref={chartHandle}
            candles={active.candles}
            visibleTo={active.revealTo}
            tool={task.type === 'place-trade' ? 'trade' : task.type === 'identify' ? 'cursor' : 'cursor'}
            height={480}
            ariaLabel="Scenario chart"
            events={{
              onClick: (pt) => {
                if (phase !== 'run' || task.type !== 'identify') return;
                task.targets.forEach((tg, i) => {
                  if (!hits.includes(i) && hitTarget(pt.x, pt.p, tg)) {
                    setHits((h) => [...h, i]);
                  }
                });
              },
            }}
          />
          <div className="border-t border-white/[0.07] px-4 py-2.5 text-[10.5px] text-mist-400">
            {t('common.simulated')} · {t('sim.hiddenFuture')}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="card p-5">
            <div className="text-[11px] font-semibold uppercase tracking-[0.15em] text-gold-300">
              {lang === 'ms' ? 'TUGASAN' : 'TASK'}
            </div>
            <p className="mt-2.5 text-[14px] leading-relaxed">{L(task.question)}</p>

            {task.type === 'decide' && (
              <div className="mt-4 space-y-2.5">
                {task.options.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setPick(opt.id)}
                    disabled={phase === 'result'}
                    className={`w-full rounded-xl border p-4 text-left text-[13.5px] transition-all ${
                      pick === opt.id
                        ? 'border-gold-400/70 bg-gold-400/[0.12]'
                        : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.07]'
                    }`}
                  >
                    {L(opt.label)}
                  </button>
                ))}
                <button
                  className="btn-primary w-full"
                  disabled={!pick || phase === 'result'}
                  onClick={() => submitDecide(active)}
                >
                  {t('arena.submit')}
                </button>
              </div>
            )}

            {task.type === 'identify' && (
              <div className="mt-4">
                <div className="rounded-xl bg-white/[0.04] p-3.5 text-[12.5px] text-mist-300">
                  {lang === 'ms' ? 'Sasaran ditemui' : 'Targets found'}:{' '}
                  <span className="font-mono text-gold-300">
                    {hits.length}/{task.targets.length}
                  </span>
                </div>
                <button
                  className="btn-primary mt-3 w-full"
                  disabled={phase === 'result'}
                  onClick={() => submitIdentify(active)}
                >
                  {t('arena.submit')}
                </button>
              </div>
            )}

            {task.type === 'place-trade' && (
              <div className="mt-4">
                <div className="rounded-xl border border-gold-400/25 bg-gold-400/[0.06] p-3.5 text-[12px] leading-relaxed text-mist-200">
                  {t('sim.tradeHelp')}
                </div>
                <button
                  className="btn-primary mt-3 w-full"
                  disabled={phase === 'result'}
                  onClick={() => submitTrade(active)}
                >
                  {t('arena.submit')}
                </button>
              </div>
            )}
          </div>

          {/* result */}
          {phase === 'result' && (
            <div className="card border-gold-400/25 p-5 animate-fade-up">
              <div className="flex items-center justify-between">
                <div className="text-[11px] font-semibold uppercase tracking-[0.15em] text-mist-400">
                  {t('arena.grade')}
                </div>
                <div
                  className={`font-display text-2xl font-bold ${
                    score >= 80 ? 'text-bull' : score >= 60 ? 'text-gold-300' : 'text-bear'
                  }`}
                >
                  {score}%
                </div>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/[0.07]">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    score >= 80 ? 'bg-bull' : score >= 60 ? 'bg-gold-400' : 'bg-bear'
                  }`}
                  style={{ width: `${score}%` }}
                />
              </div>

              {notes.length > 0 && (
                <div className="mt-4">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gold-300">
                    {t('arena.reasoning')}
                  </div>
                  <ul className="mt-2 space-y-2">
                    {notes.map((n, i) => (
                      <li key={i} className="flex items-start gap-2 text-[12.5px] leading-relaxed text-mist-200">
                        <Icon name="check" className="mt-0.5 w-3.5 h-3.5 shrink-0 text-gold-300" />
                        {n}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {explain && (
                <div className="mt-4 rounded-xl border-l-2 border-gold-400 bg-gold-400/[0.07] p-3.5 text-[12.5px] leading-relaxed text-mist-200">
                  {explain}
                </div>
              )}

              <div className="mt-5 flex flex-col gap-2.5">
                <button className="btn-ghost w-full" onClick={() => startScenario(active.id)}>
                  <Icon name="refresh" className="w-4 h-4" />
                  {lang === 'ms' ? 'Cuba lagi' : 'Try again'}
                </button>
                <button className="btn-primary w-full" onClick={() => setPhase('browse')}>
                  {t('arena.nextScenario')}
                  <Icon name="arrow-right" className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
