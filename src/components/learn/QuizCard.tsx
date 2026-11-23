'use client';

/* Quiz engine with per-option explanations and targeted feedback */

import { useState } from 'react';
import type { S } from '@/lib/types';
import { useLang } from '@/lib/i18n';
import { Icon } from '../Icons';

interface Option {
  text: S;
  correct?: boolean;
  why: S;
}

export function QuizCard({
  question,
  options,
  multi = false,
  onSolved,
}: {
  question: S;
  options: Option[];
  multi?: boolean;
  onSolved?: (perfect: boolean) => void;
}) {
  const { L, t } = useLang();
  const [selected, setSelected] = useState<number[]>([]);
  const [checked, setChecked] = useState(false);
  const [solved, setSolved] = useState(false);

  const toggle = (i: number) => {
    if (solved) return;
    if (multi) {
      setSelected((sel) => (sel.includes(i) ? sel.filter((x) => x !== i) : [...sel, i]));
    } else {
      setSelected([i]);
    }
  };

  const check = () => {
    if (selected.length === 0) return;
    setChecked(true);
    const allCorrect = selected.every((i) => options[i].correct) && selected.length === options.filter((o) => o.correct).length;
    if (allCorrect) {
      setSolved(true);
      onSolved?.(true);
    }
  };

  const retry = () => {
    setChecked(false);
    setSelected([]);
    if (!solved) onSolved?.(false);
  };

  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 text-gold-300">
        <Icon name="target" className="w-5 h-5" />
        <div className="text-[11px] font-semibold uppercase tracking-[0.16em]">{t('lesson.quizTitle')}</div>
      </div>
      <h3 className="mt-3 font-display text-lg font-bold leading-snug">{L(question)}</h3>
      <div className="mt-4 space-y-2.5">
        {options.map((opt, i) => {
          const isSelected = selected.includes(i);
          const isCorrect = !!opt.correct;
          let stateCls = 'border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]';
          if (isSelected && !checked) stateCls = 'border-gold-400/70 bg-gold-400/10';
          if (checked && isCorrect) stateCls = 'border-bull/70 bg-bull/[0.12]';
          if (checked && isSelected && !isCorrect) stateCls = 'border-bear/70 bg-bear/[0.12]';
          return (
            <div key={i}>
              <button
                onClick={() => toggle(i)}
                disabled={solved}
                className={`w-full rounded-xl border p-4 text-left transition-all ${stateCls} focus-ring`}
                aria-pressed={isSelected}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                      isSelected ? 'border-gold-400 bg-gold-400 text-ink-950' : 'border-white/25'
                    }`}
                  >
                    {isSelected && <Icon name="check" className="w-3 h-3" />}
                  </div>
                  <div className="text-[14.5px] leading-relaxed">{L(opt.text)}</div>
                </div>
              </button>
              {checked && (isSelected || isCorrect) && (
                <div
                  className={`mt-1.5 ml-2 rounded-xl border-l-2 pl-3.5 pr-3 py-2.5 text-[13px] leading-relaxed animate-fade-in ${
                    isCorrect
                      ? 'border-bull bg-bull/[0.07] text-mist-200'
                      : 'border-bear bg-bear/[0.07] text-mist-200'
                  }`}
                >
                  <span className={`font-semibold ${isCorrect ? 'text-bull' : 'text-bear'}`}>
                    {isCorrect ? t('common.correct') : t('common.incorrect')} — {t('lesson.quizExplain')}:
                  </span>{' '}
                  {L(opt.why)}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-5 flex items-center gap-3">
        {!checked && (
          <button className="btn-primary" onClick={check} disabled={selected.length === 0}>
            {t('common.check')}
          </button>
        )}
        {checked && !solved && (
          <button className="btn-ghost" onClick={retry}>
            <Icon name="refresh" className="w-4 h-4" />
            {t('common.tryAgain')}
          </button>
        )}
        {solved && (
          <div className="flex items-center gap-2 rounded-xl bg-bull/[0.12] px-4 py-2.5 text-bull font-semibold text-sm animate-scale-in">
            <Icon name="check" className="w-4 h-4" />
            {t('common.correct')}!
          </div>
        )}
      </div>
    </div>
  );
}
