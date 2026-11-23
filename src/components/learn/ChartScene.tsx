'use client';

/* Lesson scene player — candle-by-candle animated teaching scenes */

import { useEffect, useMemo, useRef, useState } from 'react';
import type { Drawing, SceneSpec, SceneState } from '@/lib/types';
import { useLang } from '@/lib/i18n';
import { ChartCanvas } from './ChartCanvas';
import { Icon } from '../Icons';

export function ChartScene({ scene }: { scene: SceneSpec }) {
  const { L, t } = useLang();
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const total = scene.steps.length;
  const state: SceneState = scene.steps[step]?.state ?? { revealTo: 0 };

  const drawings = useMemo(() => {
    return (state.drawings ?? []).map((d, i) => {
      const anyD = d as Drawing & { label?: { en: string; ms: string } };
      return {
        ...anyD,
        id: anyD.id ?? `scene-${step}-${i}`,
        label: anyD.label ? L(anyD.label) : undefined,
      } as Drawing;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, step]);

  useEffect(() => {
    setPlaying(false);
    if (timer.current) clearTimeout(timer.current);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [scene.id]);

  useEffect(() => {
    if (!playing) return;
    if (step >= total - 1) {
      setPlaying(false);
      return;
    }
    timer.current = setTimeout(() => setStep((s) => Math.min(total - 1, s + 1)), 3400);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [playing, step, total]);

  return (
    <div className="card overflow-hidden">
      <ChartCanvas
        candles={scene.candles}
        visibleTo={state.revealTo}
        highlights={state.highlights}
        notes={state.notes}
        drawings={drawings}
        height={380}
        interactive={false}
        showCrosshair={false}
        ariaLabel="Animated teaching chart"
      />
      <div className="scene-caption m-3 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 w-8 h-8 shrink-0 rounded-lg bg-gold-400/15 text-gold-300 flex items-center justify-center font-display font-bold text-sm">
            {step + 1}
          </div>
          <p className="text-[14.5px] leading-relaxed text-mist-100">{L(scene.steps[step].caption)}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 px-4 pb-4">
        <button
          className="btn-ghost !px-3 !py-2"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          aria-label={t('common.back')}
        >
          <Icon name="arrow-left" className="w-4 h-4" />
        </button>
        <button
          className="btn-ghost !px-3 !py-2"
          onClick={() => {
            setPlaying((p) => !p);
          }}
          aria-label={playing ? t('sim.pause') : t('sim.play')}
        >
          <Icon name={playing ? 'pause' : 'play'} className="w-4 h-4" />
        </button>
        <button
          className="btn-primary !px-4 !py-2"
          onClick={() => setStep((s) => Math.min(total - 1, s + 1))}
          disabled={step >= total - 1}
        >
          {t('common.next')}
          <Icon name="arrow-right" className="w-4 h-4" />
        </button>
        <div className="ml-auto flex items-center gap-1.5">
          {scene.steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              aria-label={`${t('common.step')} ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === step ? 'w-6 bg-gold-400' : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
