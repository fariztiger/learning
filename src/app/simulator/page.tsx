'use client';

/* TIGERFX Chart Simulator — replay-first practice terminal with
   drawing tools, structural feedback and guided tasks. */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Candle, Drawing, Tool } from '@/lib/types';
import type { UIKey } from '@/lib/ui';
import {
  compose,
  injectEqualHighs,
  injectEqualLows,
  injectFVG,
  injectSweep,
  makeRange,
  makeTrend,
  makeWalk,
  hashSeed,
} from '@/lib/chart/builders';
import {
  describeStructure,
  evaluateDrawing,
  findEqualLevels,
  findFVGs,
  findSweeps,
  findSwings,
  priceTolerance,
  type Feedback,
} from '@/lib/chart/analysis';
import { useLang } from '@/lib/i18n';
import { progressActions } from '@/lib/progress';
import { ChartCanvas, type ChartCanvasHandle } from '@/components/learn/ChartCanvas';
import { Icon } from '@/components/Icons';
import type { EngineEvents } from '@/lib/chart/engine';

const TOOLS: { id: Tool; key: UIKey }[] = [
  { id: 'cursor', key: 'sim.tool.cursor' },
  { id: 'pan', key: 'sim.tool.pan' },
  { id: 'hline', key: 'sim.tool.hline' },
  { id: 'trendline', key: 'sim.tool.trendline' },
  { id: 'rect', key: 'sim.tool.rect' },
  { id: 'fib', key: 'sim.tool.fib' },
  { id: 'arrow', key: 'sim.tool.arrow' },
  { id: 'text', key: 'sim.tool.text' },
  { id: 'trade', key: 'sim.tool.trade' },
  { id: 'eraser', key: 'sim.tool.eraser' },
];

function buildMarket(seed: number): Candle[] {
  const mode = seed % 4;
  if (mode === 0) {
    let base = makeRange({ seed, lo: 2388, hi: 2402, count: 24 });
    base = injectEqualHighs(base, { indices: [8, 15, 21], level: 2401, seed: seed + 1 });
    base = injectSweep(base, { at: 23, level: 2401, side: 'high', seed: seed + 2, hold: 2 });
    return compose([base, makeTrend({ seed: seed + 3, start: 2396, count: 20, dir: -1, strength: 1.2, vol: 1.9 }), makeWalk({ seed: seed + 4, start: 2372, count: 14, vol: 1.6, drift: 0.3 })]);
  }
  if (mode === 1) {
    let base = makeRange({ seed, lo: 2378, hi: 2394, count: 22 });
    base = injectEqualLows(base, { indices: [7, 14, 19], level: 2379, seed: seed + 1 });
    base = injectSweep(base, { at: 21, level: 2379, side: 'low', seed: seed + 2, hold: 2 });
    return compose([base, makeTrend({ seed: seed + 3, start: 2385, count: 20, dir: 1, strength: 1.25, vol: 2.0 }), makeWalk({ seed: seed + 4, start: 2410, count: 12, vol: 1.5, drift: -0.2 })]);
  }
  if (mode === 2) {
    const trend = makeTrend({ seed, start: 2350, count: 34, dir: 1, strength: 1.25, vol: 2.0 });
    const f = injectFVG(trend, { at: 20, direction: 'bull', seed: seed + 1 });
    return compose([f, makeWalk({ seed: seed + 2, start: f[f.length - 1].c, count: 20, vol: 1.7, drift: -0.15 })]);
  }
  return compose([
    makeRange({ seed, lo: 2385, hi: 2405, count: 18 }),
    makeTrend({ seed: seed + 1, start: 2395, count: 16, dir: -1, strength: 1.3, vol: 2.1 }),
    makeRange({ seed: seed + 2, lo: 2368, hi: 2382, count: 18 }),
    makeTrend({ seed: seed + 3, start: 2375, count: 14, dir: 1, strength: 1.15, vol: 1.9 }),
  ]);
}

export default function SimulatorPage() {
  const { t, L, lang } = useLang();
  const [marketSeed, setMarketSeed] = useState(() => Math.floor(Math.random() * 100000));
  const candles = useMemo(() => buildMarket(marketSeed), [marketSeed]);

  const [visibleTo, setVisibleTo] = useState(20);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [tool, setTool] = useState<Tool>('cursor');
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const [guidMode, setGuidMode] = useState<'guided' | 'independent'>('guided');
  const [taskIdx, setTaskIdx] = useState(0);
  const [taskMsg, setTaskMsg] = useState<Feedback | null>(null);
  const chartHandle = useRef<ChartCanvasHandle>(null);

  const total = candles.length;

  /* replay loop */
  useEffect(() => {
    if (!playing) return;
    if (visibleTo >= total - 1) {
      setPlaying(false);
      return;
    }
    const id = setTimeout(() => setVisibleTo((v) => Math.min(total - 1, v + 1)), 1200 / speed);
    return () => clearTimeout(id);
  }, [playing, visibleTo, speed, total]);

  const rewind = () => {
    setPlaying(false);
    setVisibleTo((v) => Math.max(15, v - 10));
  };

  /* structural analysis of revealed candles */
  const analysis = useMemo(() => {
    const revealed = candles.slice(0, visibleTo + 1);
    const struct = describeStructure(revealed, 3);
    const pools = findEqualLevels(revealed, priceTolerance(revealed), 3);
    const fvgs = findFVGs(revealed, revealed.length - 1).slice(-3);
    const sweeps = findSweeps(revealed, 3).slice(-3);
    return { struct, pools, fvgs, sweeps };
  }, [candles, visibleTo]);

  /* drawing feedback */
  const feedbacks = useMemo(() => {
    return drawings.map((d) => ({ d, fb: evaluateDrawing(d, candles, visibleTo) }));
  }, [drawings, candles, visibleTo]);

  /* guided tasks derived from data */
  const tasks = useMemo(() => {
    const revealed = candles.slice(0, Math.min(candles.length, 40));
    const tol = priceTolerance(revealed);
    const pools = findEqualLevels(revealed, tol, 3);
    const sweeps = findSweeps(revealed, 3);
    const fvgs = findFVGs(revealed, revealed.length - 1);
    const list: {
      title: string;
      desc: string;
      check: () => Feedback;
    }[] = [];

    if (pools.length > 0) {
      const pool = pools[0];
      list.push({
        title: lang === 'ms' ? 'Tanda kolam kecairan' : 'Mark the liquidity pool',
        desc:
          lang === 'ms'
            ? `Lukis garisan mendatar pada ${pool.price.toFixed(2)} — paras ${pool.kind === 'high' ? 'high' : 'rendah'} sama yang membentuk kolam kecairan.`
            : `Draw a horizontal line at ${pool.price.toFixed(2)} — the equal ${pool.kind === 'high' ? 'highs' : 'lows'} forming the liquidity pool.`,
        check: () => {
          const hlines = drawings.filter((d) => d.kind === 'hline') as Extract<Drawing, { kind: 'hline' }>[];
          const hit = hlines.some((h) => Math.abs(h.price - pool.price) <= tol * 1.4);
          return hit
            ? {
                tone: 'good',
                headline: lang === 'ms' ? 'Kolam ditanda dengan betul' : 'Pool correctly marked',
                detail:
                  lang === 'ms'
                    ? 'Garisan anda sepadan dengan kelompok swing yang membentuk kolam. Ini kawasan order berkelompok.'
                    : 'Your line matches the swing cluster forming the pool. This is where orders concentrate.',
              }
            : {
                tone: 'warn',
                headline: lang === 'ms' ? 'Belum pada paras' : 'Not on the level yet',
                detail:
                  lang === 'ms'
                    ? `Cari paras di mana ${pool.kind === 'high' ? 'high' : 'rendah'} hampir sama berulang, sekitar ${pool.price.toFixed(2)}.`
                    : `Find the level where equal ${pool.kind === 'high' ? 'highs' : 'lows'} repeat, around ${pool.price.toFixed(2)}.`,
              };
        },
      });
    }

    if (sweeps.length > 0) {
      const sw = sweeps[0];
      list.push({
        title: lang === 'ms' ? 'Kesan sweep' : 'Tag the sweep',
        desc:
          lang === 'ms'
            ? 'Gunakan alat anak panah atau teks untuk menanda lilin yang menyapu paras dan ditutup semula ke dalam.'
            : 'Use the arrow or text tool to tag the candle that swept the level and closed back inside.',
        check: () => {
          const marks = drawings.filter((d) => {
            const x = d.kind === 'text' ? d.x : d.kind === 'arrow' ? d.x1 : null;
            return (d.kind === 'arrow' || d.kind === 'text') && x !== null && Math.abs(x - sw.index) < 3;
          });
          return marks.length > 0
            ? {
                tone: 'good',
                headline: lang === 'ms' ? 'Sweep ditanda' : 'Sweep tagged',
                detail:
                  lang === 'ms'
                    ? 'Anda menandakan detik apabila kecairan diambil. Ini antara isyarat paling berharga pada carta.'
                    : 'You marked the liquidity-taking moment. This is one of the highest-value signals on any chart.',
              }
            : {
                tone: 'warn',
                headline: lang === 'ms' ? 'Cari lilin sweep' : 'Find the sweep candle',
                detail:
                  lang === 'ms'
                    ? 'Lilin yang bayangnya melepasi paras swing kemudian ditutup semula ke dalam.'
                    : 'The candle whose wick exceeds the swing level and closes back inside.',
              };
        },
      });
    }

    if (fvgs.length > 0) {
      const f = fvgs[0];
      list.push({
        title: lang === 'ms' ? 'Lukis zon FVG' : 'Draw the FVG zone',
        desc:
          lang === 'ms'
            ? 'Gunakan alat Zon (segi empat) untuk melukis jurang antara bayang lilin 1 dan 3 pergerakan pantas.'
            : 'Use the Zone tool (rectangle) to draw the gap between the wicks of candles 1 and 3 of the fast move.',
        check: () => {
          const rects = drawings.filter((d) => d.kind === 'rect') as Extract<Drawing, { kind: 'rect' }>[];
          const hit = rects.some((r) => {
            const top = Math.max(r.p1, r.p2);
            const bot = Math.min(r.p1, r.p2);
            return bot <= f.top + 1 && top >= f.bottom - 1;
          });
          return hit
            ? {
                tone: 'good',
                headline: lang === 'ms' ? 'Zon FVG ditemui' : 'FVG zone found',
                detail:
                  lang === 'ms'
                    ? 'Zon anda meliputi ketidakseimbangan. Zon ketat = definisi risiko lebih baik.'
                    : 'Your zone covers the imbalance. Tighter zones = better risk definition.',
              }
            : {
                tone: 'warn',
                headline: lang === 'ms' ? 'Zon belum tepat' : 'Zone not on the gap',
                detail:
                  lang === 'ms'
                    ? 'Cari kawasan kosong antara bayang lilin sebelum dan selepas lilin besar.'
                    : 'Look for the empty area between wicks before and after the big candle.',
              };
        },
      });
    }

    list.push({
      title: lang === 'ms' ? 'Rancang dagangan' : 'Plan a trade',
      desc:
        lang === 'ms'
          ? 'Gunakan alat Dagangan (klik entry → stop → sasaran) untuk merancang setup mengikut struktur semasa.'
          : 'Use the Trade tool (click entry → stop → target) to plan a setup along the current structure.',
      check: () => {
        const trades = drawings.filter((d) => d.kind === 'trade') as Extract<Drawing, { kind: 'trade' }>[];
        if (trades.length === 0) {
          return {
            tone: 'warn',
            headline: lang === 'ms' ? 'Belum ada pelan' : 'No plan yet',
            detail:
              lang === 'ms'
                ? 'Alat dagangan: klik 1 = entry, klik 2 = stop (di bawah/atas struktur), klik 3 = sasaran.'
                : 'Trade tool: click 1 = entry, click 2 = stop (beyond structure), click 3 = target.',
          };
        }
        return evaluateDrawing(trades[trades.length - 1], candles, visibleTo);
      },
    });

    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [candles, drawings, lang, visibleTo]);

  const runTaskCheck = () => {
    const fb = tasks[taskIdx]?.check();
    setTaskMsg(fb ?? null);
    if (fb?.tone === 'good') {
      progressActions.addXp(15, lang === 'ms' ? 'Tugasan simulator' : 'Simulator task', 'sim-task', `task-${taskIdx}`);
      setTimeout(() => {
        setTaskIdx((i) => Math.min(tasks.length - 1, i + 1));
        setTaskMsg(null);
      }, 2200);
    }
  };

  const events: EngineEvents = useMemo(
    () => ({
      onDrawingsChanged: (d) => setDrawings([...d]),
    }),
    []
  );

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6">
      {/* header */}
      <div className="flex flex-wrap items-start gap-4">
        <div>
          <div className="chip-gold">{t('sim.title')}</div>
          <h1 className="mt-2 font-display text-[clamp(1.7rem,3vw,2.4rem)] font-bold">{t('sim.title')}</h1>
          <p className="mt-1.5 max-w-2xl text-[14px] leading-relaxed text-mist-300">{t('sim.sub')}</p>
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <div className="flex rounded-xl border border-white/[0.12] bg-white/[0.04] p-1">
            {(['guided', 'independent'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setGuidMode(m)}
                className={`rounded-lg px-3.5 py-2 text-[12px] font-semibold transition ${
                  guidMode === m ? 'bg-gold-400 text-ink-950' : 'text-mist-300 hover:text-white'
                }`}
              >
                {t(m === 'guided' ? 'sim.guided' : 'sim.independent')}
              </button>
            ))}
          </div>
          <button
            className="btn-ghost !py-2.5 text-[12.5px]"
            onClick={() => {
              setMarketSeed(Math.floor(Math.random() * 100000));
              setVisibleTo(20);
              setDrawings([]);
              setTaskIdx(0);
              setTaskMsg(null);
              setPlaying(false);
            }}
          >
            <Icon name="refresh" className="w-4 h-4" />
            {t('sim.newData')}
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[1fr_340px]">
        {/* ------------------------------ chart card ------------------------------ */}
        <div className="card overflow-hidden">
          {/* toolbar */}
          <div className="flex flex-wrap items-center gap-1.5 border-b border-white/[0.07] p-2.5">
            {TOOLS.map((tl) => (
              <button
                key={tl.id}
                onClick={() => setTool(tl.id)}
                title={t(tl.key)}
                aria-pressed={tool === tl.id}
                className={`rounded-lg px-2.5 py-2 text-[11.5px] font-medium transition ${
                  tool === tl.id
                    ? 'bg-gold-400/20 text-gold-200 shadow-inner-glow'
                    : 'text-mist-300 hover:bg-white/[0.06] hover:text-white'
                }`}
              >
                {t(tl.key)}
              </button>
            ))}
            <div className="mx-1 h-6 w-px bg-white/10" />
            <button
              className="rounded-lg px-2.5 py-2 text-[11.5px] text-mist-300 hover:bg-white/[0.06]"
              onClick={() => chartHandle.current?.engine?.undo()}
              title={t('sim.undo')}
            >
              ↶ {t('sim.undo')}
            </button>
            <button
              className="rounded-lg px-2.5 py-2 text-[11.5px] text-mist-300 hover:bg-white/[0.06]"
              onClick={() => chartHandle.current?.engine?.redo()}
              title={t('sim.redo')}
            >
              ↷ {t('sim.redo')}
            </button>
            <button
              className="rounded-lg px-2.5 py-2 text-[11.5px] text-bear/90 hover:bg-bear/10"
              onClick={() => chartHandle.current?.engine?.clearDrawings()}
              title={t('sim.clear')}
            >
              ✕ {t('sim.clear')}
            </button>
            <div className="ml-auto hidden items-center gap-2 text-[10.5px] text-mist-400 lg:flex">
              <Icon name="info" className="w-3.5 h-3.5" />
              {t('sim.zoomHint')}
            </div>
          </div>

          {/* chart */}
          <div id="sim-canvas" className="relative bg-ink-900/40">
            <ChartCanvas
              ref={chartHandle}
              candles={candles}
              visibleTo={visibleTo}
              tool={tool}
              height={520}
              events={events}
              ariaLabel="Chart simulator — candle replay with drawing tools"
            />
            <div className="pointer-events-none absolute left-3 top-3 rounded-lg border border-white/10 bg-ink-950/70 px-2.5 py-1.5 font-mono text-[10.5px] text-mist-300">
              XAUUSD · M15 · {lang === 'ms' ? 'DATA SIMULASI' : 'SIMULATED DATA'}
            </div>
            <div className="pointer-events-none absolute right-3 top-3 rounded-lg border border-gold-400/25 bg-ink-950/70 px-2.5 py-1.5 text-[10.5px] text-gold-200">
              🔒 {t('sim.hiddenFuture')}
            </div>
          </div>

          {/* replay controls */}
          <div className="flex flex-wrap items-center gap-3 border-t border-white/[0.07] p-3.5">
            <button
              className="btn-primary !px-4 !py-2.5"
              onClick={() => setPlaying((p) => !p)}
            >
              <Icon name={playing ? 'pause' : 'play'} className="w-4 h-4" />
              {playing ? t('sim.pause') : t('sim.play')}
            </button>
            <button className="btn-ghost !px-3 !py-2.5" onClick={() => { setPlaying(false); setVisibleTo((v) => Math.max(15, v - 1)); }}>
              ◀◀ {t('sim.step')}
            </button>
            <button className="btn-ghost !px-3 !py-2.5" onClick={() => { setPlaying(false); setVisibleTo((v) => Math.min(total - 1, v + 1)); }}>
              {t('sim.step')} ▶▶
            </button>
            <button className="btn-ghost !px-3 !py-2.5" onClick={rewind}>
              ⟲ {t('sim.rewind')}
            </button>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-mist-400">{t('sim.speed')}</span>
              {[0.5, 1, 2, 4].map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition ${
                    speed === s ? 'bg-gold-400/20 text-gold-200' : 'text-mist-300 hover:bg-white/[0.06]'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>

            <div className="ml-auto flex min-w-[220px] flex-1 items-center gap-2.5">
              <input
                type="range"
                min={15}
                max={total - 1}
                value={visibleTo}
                onChange={(e) => {
                  setPlaying(false);
                  setVisibleTo(Number(e.target.value));
                }}
                className="flex-1 accent-gold-400"
                aria-label="Replay position"
              />
              <span className="font-mono text-[11px] text-mist-400">
                {visibleTo + 1}/{total}
              </span>
            </div>
          </div>
        </div>

        {/* ------------------------------ sidebar ------------------------------ */}
        <div className="flex flex-col gap-4">
          {/* guided task */}
          {guidMode === 'guided' && (
            <div className="card border-gold-400/25 p-5">
              <div className="flex items-center gap-2 text-gold-300">
                <Icon name="target" className="w-5 h-5" />
                <div className="text-[11px] font-semibold uppercase tracking-[0.15em]">{t('sim.guideTask')}</div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div className="font-display text-[15px] font-bold">
                  {tasks[taskIdx]?.title}
                </div>
                <span className="chip !text-[10px]">
                  {taskIdx + 1}/{tasks.length}
                </span>
              </div>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-mist-300">{tasks[taskIdx]?.desc}</p>
              <button className="btn-primary mt-3 w-full !py-2.5 text-[12.5px]" onClick={runTaskCheck}>
                {t('common.check')}
              </button>
              {taskMsg && (
                <div
                  className={`mt-3 rounded-xl border-l-2 p-3 text-[12px] leading-relaxed animate-fade-in ${
                    taskMsg.tone === 'good'
                      ? 'border-bull bg-bull/[0.08]'
                      : taskMsg.tone === 'ok'
                      ? 'border-gold-400 bg-gold-400/[0.08]'
                      : 'border-bear bg-bear/[0.08]'
                  }`}
                >
                  <div className="font-semibold">{taskMsg.headline}</div>
                  <div className="mt-1 text-mist-300">{taskMsg.detail}</div>
                </div>
              )}
            </div>
          )}

          {/* structural analysis */}
          <div className="card p-5">
            <div className="flex items-center gap-2 text-sky2">
              <Icon name="chart" className="w-5 h-5" />
              <div className="text-[11px] font-semibold uppercase tracking-[0.15em]">{t('sim.analysisTitle')}</div>
            </div>
            <div className="mt-3 space-y-2.5 text-[12px]">
              <Row label={lang === 'ms' ? 'Struktur' : 'Structure'} value={
                analysis.struct.trend === 'up'
                  ? lang === 'ms' ? 'Uptrend (HH/HL)' : 'Uptrend (HH/HL)'
                  : analysis.struct.trend === 'down'
                  ? lang === 'ms' ? 'Downtrend (LH/LL)' : 'Downtrend (LH/LL)'
                  : lang === 'ms' ? 'Range / tidak jelas' : 'Range / unclear'
              } />
              <Row
                label={lang === 'ms' ? 'Swing terakhir' : 'Last swings'}
                value={
                  analysis.struct.lastHigh && analysis.struct.lastLow
                    ? `H ${analysis.struct.lastHigh.price.toFixed(2)} · L ${analysis.struct.lastLow.price.toFixed(2)}`
                    : '—'
                }
              />
              <Row
                label={lang === 'ms' ? 'Kolam kecairan' : 'Liquidity pools'}
                value={
                  analysis.pools.length > 0
                    ? analysis.pools
                        .slice(0, 2)
                        .map((p) => `${p.kind === 'high' ? 'BSL' : 'SSL'} ${p.price.toFixed(2)}`)
                        .join(' · ')
                    : (lang === 'ms' ? 'tiada dikesan' : 'none detected')
                }
              />
              <Row
                label="FVG"
                value={
                  analysis.fvgs.length > 0
                    ? analysis.fvgs
                        .slice(0, 2)
                        .map((f) => `${f.direction === 'bull' ? '▲' : '▼'} ${f.bottom.toFixed(2)}–${f.top.toFixed(2)}`)
                        .join(' · ')
                    : (lang === 'ms' ? 'tiada dalam skop' : 'none in view')
                }
              />
              <Row
                label={lang === 'ms' ? 'Sweep terkini' : 'Recent sweeps'}
                value={
                  analysis.sweeps.length > 0
                    ? analysis.sweeps
                        .slice(0, 2)
                        .map((sw) => `#${sw.index} ${sw.side === 'high' ? 'BSL' : 'SSL'}`)
                        .join(' · ')
                    : (lang === 'ms' ? 'tiada' : 'none')
                }
              />
            </div>
            <p className="mt-3 text-[10.5px] leading-relaxed text-mist-500">
              {lang === 'ms'
                ? 'Analisis berasaskan peraturan struktur pada lilin yang DIDEDAHKAN sahaja — tiada data masa depan digunakan.'
                : 'Rule-based structural analysis of the REVEALED candles only — no future data is used.'}
            </p>
          </div>

          {/* drawing feedback */}
          <div className="card p-5">
            <div className="flex items-center gap-2 text-bull">
              <Icon name="pen" className="w-5 h-5" />
              <div className="text-[11px] font-semibold uppercase tracking-[0.15em]">{t('sim.feedback')}</div>
            </div>
            <div className="mt-3 space-y-2.5">
              {feedbacks.length === 0 && (
                <p className="text-[12px] leading-relaxed text-mist-400">{t('sim.feedbackEmpty')}</p>
              )}
              {feedbacks.map(({ d, fb }, i) => (
                <div
                  key={d.id}
                  className={`rounded-xl border-l-2 p-3 ${
                    fb.tone === 'good' ? 'border-bull bg-bull/[0.06]' : fb.tone === 'ok' ? 'border-gold-400 bg-gold-400/[0.06]' : 'border-bear bg-bear/[0.06]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-mist-400">
                      {d.kind} {i + 1}
                    </div>
                    <button
                      className="text-mist-500 hover:text-bear transition"
                      aria-label="Remove drawing"
                      onClick={() => setDrawings((ds) => ds.filter((x) => x.id !== d.id))}
                    >
                      <Icon name="x" className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="mt-1 text-[12.5px] font-semibold">{fb.headline}</div>
                  <div className="mt-1 text-[11.5px] leading-relaxed text-mist-300">{fb.detail}</div>
                </div>
              ))}
            </div>
          </div>

          {/* tool help */}
          <div className="card p-4">
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-mist-400">
              {lang === 'ms' ? 'Bantuan alat' : 'Tool help'}
            </div>
            <p className="mt-2 text-[11.5px] leading-relaxed text-mist-400">{t('sim.tradeHelp')}</p>
            <p className="mt-1.5 text-[11.5px] leading-relaxed text-mist-400">
              {lang === 'ms'
                ? 'Dwi-klik carta untuk penuhkan paparan. Ctrl+Z untuk buat asal. Pilih alat pemadam atau tekan Delete untuk membuang lukisan terpilih.'
                : 'Double-click the chart to fit the view. Ctrl+Z to undo. Use the eraser tool or press Delete to remove a selected drawing.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-lg bg-white/[0.03] px-3 py-2">
      <span className="text-mist-400">{label}</span>
      <span className="text-right font-mono text-[11.5px] text-mist-200">{value}</span>
    </div>
  );
}
