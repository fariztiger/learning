'use client';

/* Structure Builder + click-games (Sweep Spotter / FVG Finder) */

import { useMemo, useRef, useState } from 'react';
import { findFVGs, findSwings } from '@/lib/chart/analysis';
import { makeTrend, makeRange, injectEqualHighs, injectSweep, compose, injectFVG, mulberry32, hashSeed } from '@/lib/chart/builders';
import type { Candle, S } from '@/lib/types';
import { useLang } from '@/lib/i18n';
import { ChartCanvas } from '../ChartCanvas';
import { Icon } from '../../Icons';
import { s } from '@/content/helpers';

/* --------------------------- Structure Builder --------------------------- */

export function StructureBuilder() {
  const { t, lang } = useLang();
  const [round, setRound] = useState(0);
  const [hits, setHits] = useState<number[]>([]);
  const [msg, setMsg] = useState<string>('');

  const candles = useMemo(() => {
    const seed = 8100 + round * 17;
    return round % 2 === 0
      ? makeTrend({ seed, start: 2360, count: 46, dir: 1, strength: 1.25, vol: 2.0 })
      : makeTrend({ seed, start: 2440, count: 46, dir: -1, strength: 1.25, vol: 2.0 });
  }, [round]);

  const pivots = useMemo(() => findSwings(candles, 3).filter((_, i) => i % 2 === 0).slice(0, 6), [candles]);
  const remaining = pivots.filter((p) => !hits.includes(p.index));

  return (
    <div className="card p-6">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-300">
        {lang === 'ms' ? 'LATIHAN INTERAKTIF' : 'INTERACTIVE DRILL'}
      </div>
      <h3 className="mt-2 font-display text-xl font-bold">{t('w.structure.title')}</h3>
      <p className="mt-1.5 text-[13.5px] text-mist-300">
        {lang === 'ms'
          ? 'Klik setiap swing high dan swing low pada carta. Anda memerlukan keenam-enamnya.'
          : 'Click every swing high and swing low on the chart. You need all six.'}
      </p>

      <div className="mt-4 rounded-xl bg-white/[0.03] p-3">
        <ChartCanvas
          candles={candles}
          height={340}
          showCrosshair
          events={{
            onClick: (pt) => {
              const near = pivots.find((p) => Math.abs(p.index - pt.x) < 2.2 && Math.abs(p.price - pt.p) < 4.5);
              if (near && !hits.includes(near.index)) {
                const next = [...hits, near.index];
                setHits(next);
                setMsg(
                  lang === 'ms'
                    ? `✓ ${near.kind === 'high' ? 'Swing high' : 'Swing low'} pada ${near.price.toFixed(2)}`
                    : `✓ ${near.kind === 'high' ? 'Swing high' : 'Swing low'} at ${near.price.toFixed(2)}`
                );
                if (next.length === pivots.length) {
                  setMsg(lang === 'ms' ? '✓ Semua swing ditemui — struktur lengkap!' : '✓ All swings found — structure complete!');
                }
              } else if (!near) {
                setMsg(
                  lang === 'ms'
                    ? 'Swing ialah titik pusingan jelas — klik puncak atau lembah tempat harga berpatah.'
                    : 'Swings are clear turning points — click the peaks or troughs where price reversed.'
                );
              }
            },
          }}
        />
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="text-[13px] text-mist-300">
          {hits.length} / {pivots.length} {lang === 'ms' ? 'ditemui' : 'found'}
          {msg && <div className="mt-1 text-[12.5px] text-gold-200">{msg}</div>}
        </div>
        <button
          className="btn-ghost !py-2"
          onClick={() => {
            setRound((r) => r + 1);
            setHits([]);
            setMsg('');
          }}
        >
          <Icon name="refresh" className="w-4 h-4" />
          {lang === 'ms' ? 'Carta baharu' : 'New chart'}
        </button>
      </div>
    </div>
  );
}

/* ------------------------------ Click Game ------------------------------ */

interface GameRound {
  candles: Candle[];
  targets: { x: number; p: number; r: number; label: S }[];
  success: S;
  miss: S;
}

function makeSweepRound(seed: number): GameRound {
  let base = makeRange({ seed, lo: 2388, hi: 2402, count: 22 });
  base = injectEqualHighs(base, { indices: [7, 13, 18], level: 2401, seed: seed + 1 });
  base = injectSweep(base, { at: 20, level: 2401, side: 'high', seed: seed + 2, hold: 2 });
  const candles = compose([base, makeTrend({ seed: seed + 3, start: 2396, count: 14, dir: -1, strength: 1.25, vol: 1.9 })]);
  return {
    candles,
    targets: [
      {
        x: 12,
        p: 2401,
        r: 6,
        label: s('The pool: equal highs', 'Kolam: high sama'),
      },
    ],
    success: s(
      'Correct — the equal highs are the liquidity pool (BSL). Stops and breakout orders cluster exactly there, which is why price returns.',
      'Betul — high sama ialah kolam kecairan (BSL). Stop dan order breakout berkelompok tepat di situ, sebab itu harga kembali.'
    ),
    miss: s(
      'The pool is the LEVEL built by the repeated equal highs near the top of the range — where orders cluster.',
      'Kolam ialah PARAS yang dibina oleh high sama berulang berhampiran atas range — tempat order berkelompok.'
    ),
  };
}

function makeFvgRound(seed: number): GameRound {
  let base = makeTrend({ seed, start: 2400, count: 12, dir: -1, strength: 1.1, vol: 1.8 });
  const fvgIndex = 7;
  base = injectFVG(base, { at: fvgIndex, direction: 'bear', seed: seed + 1, gap: 3.5 });
  const candles = compose([base, makeRange({ seed: seed + 2, lo: 2380, hi: 2388, count: 10 })]);
  return {
    candles,
    targets: [{ x: fvgIndex, p: 2394, r: 5, label: s('Fair Value Gap', 'Fair Value Gap') }],
    success: s(
      'Yes — the gap between candle 1 and candle 3 wicks of the fast fall. This imbalance is the FVG.',
      'Ya — jurang antara bayang lilin 1 dan 3 kejatuhan pantas. Ketidakseimbangan ini ialah FVG.'
    ),
    miss: s(
      'Look INSIDE the strongest fall: the empty area between the wick of the candle before the big one and the wick of the candle after it.',
      'Lihat DI DALAM kejatuhan terkuat: kawasan kosong antara bayang lilin sebelum yang besar dan bayang lilin selepasnya.'
    ),
  };
}

export function ClickGame({ kind }: { kind: 'sweep' | 'fvg' }) {
  const { t, lang } = useLang();
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [doneRounds, setDoneRounds] = useState(0);
  const [feedback, setFeedback] = useState<{ ok: boolean; text: S } | null>(null);
  const totalRounds = 3;

  const data = useMemo(() => {
    const seed = (kind === 'sweep' ? 8200 : 8300) + round * 31;
    return kind === 'sweep' ? makeSweepRound(seed) : makeFvgRound(seed);
  }, [kind, round]);

  const finished = doneRounds >= totalRounds;

  return (
    <div className="card p-6">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-300">
        {lang === 'ms' ? 'MINI-PERMAINAN' : 'MINI-GAME'}
      </div>
      <h3 className="mt-2 font-display text-xl font-bold">{kind === 'sweep' ? t('w.sweep.title') : t('w.fvg.title')}</h3>
      <p className="mt-1.5 text-[13.5px] text-mist-300">
        {kind === 'sweep'
          ? lang === 'ms'
            ? 'Tiga carta, satu tugas: klik kolam kecairan (high/rendah sama) pada setiap satu.'
            : 'Three charts, one job: click the liquidity pool (equal highs/lows) on each.'
          : lang === 'ms'
          ? 'Tiga carta, satu tugas: klik Fair Value Gap pada setiap satu.'
          : 'Three charts, one job: click the Fair Value Gap on each.'}
      </p>

      {finished ? (
        <div className="mt-6 rounded-2xl border border-gold-400/30 bg-gold-400/[0.07] p-6 text-center animate-scale-in">
          <Icon name="trophy" className="mx-auto w-10 h-10 text-gold-300" />
          <div className="mt-3 font-display text-2xl font-bold">
            {score} / {totalRounds}
          </div>
          <p className="mt-2 text-[13.5px] text-mist-300">
            {score >= 2
              ? lang === 'ms'
                ? 'Mata tajam! Anda mengenali pola kecairan dengan baik.'
                : 'Sharp eye! You recognise liquidity patterns well.'
              : lang === 'ms'
              ? 'Cuba lagi — ulangi pelajaran berkaitan dan perhatikan di mana harga berpatah.'
              : 'Try again — review the related lesson and watch where price turns.'}
          </p>
          <button
            className="btn-primary mt-4"
            onClick={() => {
              setRound(0);
              setScore(0);
              setDoneRounds(0);
              setFeedback(null);
            }}
          >
            <Icon name="refresh" className="w-4 h-4" />
            {lang === 'ms' ? 'Main semula' : 'Play again'}
          </button>
        </div>
      ) : (
        <>
          <div className="mt-4 rounded-xl bg-white/[0.03] p-3">
            <ChartCanvas
              candles={data.candles}
              height={320}
              showCrosshair
              events={{
                onClick: (pt) => {
                  if (feedback?.ok) return;
                  const hit = data.targets.some(
                    (tg) => ((pt.x - tg.x) / (tg.r * 2)) ** 2 + ((pt.p - tg.p) / (tg.r * 3)) ** 2 <= 1
                  );
                  setFeedback({ ok: hit, text: hit ? data.success : data.miss });
                  if (hit) setScore((sc) => sc + 1);
                  setTimeout(() => {
                    setDoneRounds((d) => d + 1);
                    setRound((r) => r + 1);
                    setFeedback(null);
                  }, hit ? 1600 : 3200);
                },
              }}
            />
          </div>

          <div className="mt-3 flex items-center justify-between text-[12.5px]">
            <div className="text-mist-400">
              {lang === 'ms' ? 'Pusingan' : 'Round'} {Math.min(round + 1, totalRounds)} / {totalRounds} ·{' '}
              {lang === 'ms' ? 'Skor' : 'Score'}: {score}
            </div>
          </div>

          {feedback && (
            <div
              className={`mt-2 rounded-xl border-l-2 p-3.5 text-[13px] leading-relaxed animate-fade-in ${
                feedback.ok ? 'border-bull bg-bull/[0.08]' : 'border-gold-400 bg-gold-400/[0.08]'
              }`}
            >
              <span className={`font-semibold ${feedback.ok ? 'text-bull' : 'text-gold-300'}`}>
                {feedback.ok ? t('common.correct') : t('common.incorrect')}:
              </span>{' '}
              {lang === 'ms' ? feedback.text.ms : feedback.text.en}
            </div>
          )}
        </>
      )}
    </div>
  );
}
