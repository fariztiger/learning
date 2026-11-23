'use client';

/* Click-the-chart task with hint + feedback */

import { useMemo, useRef, useState } from 'react';
import type { Candle, S } from '@/lib/types';
import { hitTarget } from '@/lib/chart/analysis';
import { useLang } from '@/lib/i18n';
import { ChartCanvas, type ChartCanvasHandle } from './ChartCanvas';
import { Icon } from '../Icons';

export function ChartTaskCard({
  title,
  instruction,
  candles,
  target,
  hint,
  success,
  miss,
  onSolved,
}: {
  title: S;
  instruction: S;
  candles: Candle[];
  target: { x: number; p: number; r: number; label: S };
  hint: S;
  success: S;
  miss: S;
  onSolved?: () => void;
}) {
  const { L, t } = useLang();
  const [done, setDone] = useState(false);
  const [misses, setMisses] = useState(0);
  const [feedback, setFeedback] = useState<{ ok: boolean; text: S } | null>(null);
  const [marker, setMarker] = useState<{ x: number; p: number } | null>(null);
  const handle = useRef<ChartCanvasHandle>(null);

  const drawings = useMemo(() => {
    const base = done && marker
      ? [
          {
            id: 'task-hit',
            kind: 'text' as const,
            x: target.x,
            p: target.p,
            text: '✓ ' + L(target.label),
            tone: 'bull' as const,
          },
        ]
      : [];
    return base;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done, marker, target]);

  return (
    <div className="card overflow-hidden">
      <div className="p-5 pb-3">
        <div className="flex items-center gap-2 text-sky2">
          <Icon name="target" className="w-5 h-5" />
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em]">{t('lesson.taskTap')}</div>
        </div>
        <h3 className="mt-2 font-display text-lg font-bold">{L(title)}</h3>
        <p className="mt-1.5 text-[14px] leading-relaxed text-mist-300">{L(instruction)}</p>
      </div>
      <div className="px-3">
        <ChartCanvas
          ref={handle}
          candles={candles}
          height={360}
          drawings={drawings}
          showCrosshair
          interactive
          ariaLabel="Chart task — click where the described event happens"
          events={{
            onClick: (pt) => {
              if (done) return;
              const hit = hitTarget(pt.x, pt.p, target);
              if (hit) {
                setDone(true);
                setMarker(pt);
                setFeedback({ ok: true, text: success });
                onSolved?.();
              } else {
                const n = misses + 1;
                setMisses(n);
                setFeedback({ ok: false, text: n >= 2 ? hint : miss });
              }
            },
          }}
        />
      </div>
      <div className="p-4">
        {feedback && (
          <div
            className={`rounded-xl border-l-2 p-4 text-[13.5px] leading-relaxed animate-fade-in ${
              feedback.ok ? 'border-bull bg-bull/[0.08]' : 'border-gold-400 bg-gold-400/[0.08]'
            }`}
          >
            <span className={`font-semibold ${feedback.ok ? 'text-bull' : 'text-gold-300'}`}>
              {feedback.ok ? t('common.correct') : misses >= 2 ? t('common.hint') : t('common.incorrect')}:
            </span>{' '}
            {L(feedback.text)}
          </div>
        )}
        {done && (
          <div className="mt-3 flex items-center gap-2 text-bull text-sm font-semibold">
            <Icon name="check" className="w-4 h-4" />
            {t('common.completed')}
          </div>
        )}
      </div>
    </div>
  );
}
