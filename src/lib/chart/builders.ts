/* Deterministic market-data builders for lessons, scenarios and the simulator.
   All series are SYNTHETIC teaching data — never real market feeds. */

import type { Candle } from '../types';

/** mulberry32 — tiny fast seeded PRNG */
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashSeed(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export interface SeriesOpts {
  seed: number;
  start?: number;
  count?: number;
  tf?: number; // minutes per candle
  startTime?: number;
}

type Rand = () => number;

/** Build one candle around a close price with volatility */
function step(rnd: Rand, prevClose: number, drift: number, vol: number): Candle {
  const o = prevClose;
  const c = o + drift + (rnd() - 0.5) * vol;
  const wick = vol * (0.4 + rnd() * 0.9);
  const h = Math.max(o, c) + rnd() * wick;
  const l = Math.min(o, c) - rnd() * wick;
  return { t: 0, o: round2(o), h: round2(h), l: round2(l), c: round2(c) };
}

export function round2(n: number) {
  return Math.round(n * 100) / 100;
}

function stamp(candles: Candle[], tf: number, startTime: number) {
  candles.forEach((c, i) => (c.t = startTime + i * tf));
  return candles;
}

/** Random-walk series with constant drift */
export function makeWalk(opts: SeriesOpts & { drift?: number; vol?: number }): Candle[] {
  const rnd = mulberry32(opts.seed);
  const count = opts.count ?? 80;
  const vol = opts.vol ?? 2.2;
  const drift = opts.drift ?? 0;
  let price = opts.start ?? 2400;
  const out: Candle[] = [];
  for (let i = 0; i < count; i++) {
    const c = step(rnd, price, drift, vol);
    c.t = i;
    out.push(c);
    price = c.c;
  }
  return stamp(out, opts.tf ?? 15, opts.startTime ?? 0);
}

/** Higher highs / higher lows uptrend (or inverted) */
export function makeTrend(
  opts: SeriesOpts & { dir?: 1 | -1; strength?: number; vol?: number }
): Candle[] {
  const rnd = mulberry32(opts.seed);
  const count = opts.count ?? 60;
  const dir = opts.dir ?? 1;
  const strength = opts.strength ?? 1.15;
  const vol = opts.vol ?? 1.9;
  let price = opts.start ?? 2400;
  const out: Candle[] = [];
  let swing = 0;
  for (let i = 0; i < count; i++) {
    // gentle swing rhythm so structure is readable
    swing += 0.35;
    const wave = Math.sin(swing) * vol * 0.75;
    const c = step(rnd, price, dir * strength + wave * 0.18, vol);
    c.t = i;
    out.push(c);
    price = c.c;
  }
  return stamp(out, opts.tf ?? 15, opts.startTime ?? 0);
}

/** Range / consolidation between two prices */
export function makeRange(
  opts: SeriesOpts & { lo: number; hi: number }
): Candle[] {
  const rnd = mulberry32(opts.seed);
  const count = opts.count ?? 60;
  const mid = (opts.lo + opts.hi) / 2;
  let price = mid;
  const out: Candle[] = [];
  for (let i = 0; i < count; i++) {
    const pull = (mid - price) * 0.16;
    const c = step(rnd, price + pull, 0, (opts.hi - opts.lo) * 0.32);
    // soft clamp into the box with occasional deep wicks
    c.h = Math.min(c.h, opts.hi + (rnd() < 0.12 ? (opts.hi - opts.lo) * 0.12 : 0.4));
    c.l = Math.max(c.l, opts.lo - (rnd() < 0.12 ? (opts.hi - opts.lo) * 0.12 : 0.4));
    c.o = round2(c.o);
    c.c = round2(c.c);
    c.h = round2(c.h);
    c.l = round2(c.l);
    c.t = i;
    out.push(c);
    price = c.c;
  }
  return stamp(out, opts.tf ?? 15, opts.startTime ?? 0);
}

/** Append a liquidity sweep: wick above equal highs then close back below */
export function injectSweep(
  series: Candle[],
  opts: { at: number; level: number; side: 'high' | 'low'; seed: number; hold?: number }
): Candle[] {
  const rnd = mulberry32(opts.seed);
  const out = series.slice();
  const at = Math.min(Math.max(opts.at, 2), out.length - 4);
  const wickSize = 2.4 + rnd() * 2.2;
  const side = opts.side;
  for (let i = at; i < at + (opts.hold ?? 3) && i < out.length; i++) {
    const c = { ...out[i] };
    if (side === 'high') {
      c.h = round2(Math.max(c.h, opts.level + wickSize * (i === at ? 1 : 0.35)));
      c.c = round2(Math.min(c.c, opts.level - 1.2 - rnd()));
      c.o = round2(Math.min(c.o, opts.level - 0.4));
    } else {
      c.l = round2(Math.min(c.l, opts.level - wickSize * (i === at ? 1 : 0.35)));
      c.c = round2(Math.max(c.c, opts.level + 1.2 + rnd()));
      c.o = round2(Math.max(c.o, opts.level + 0.4));
    }
    out[i] = c;
  }
  return out;
}

/** Create equal highs (liquidity) across candles ending at `end` */
export function injectEqualHighs(
  series: Candle[],
  opts: { indices: number[]; level: number; seed: number }
): Candle[] {
  const rnd = mulberry32(opts.seed);
  const out = series.slice();
  for (const i of opts.indices) {
    if (i < 0 || i >= out.length) continue;
    const c = { ...out[i] };
    c.h = round2(opts.level + rnd() * 0.35);
    if (c.c > c.h - 0.6) c.c = round2(c.h - 0.8 - rnd() * 0.8);
    if (c.o > c.h - 0.6) c.o = round2(c.h - 1.2 - rnd() * 0.8);
    if (c.l > Math.min(c.o, c.c) - 0.4) c.l = round2(Math.min(c.o, c.c) - 0.6 - rnd());
    out[i] = c;
  }
  return out;
}

export function injectEqualLows(
  series: Candle[],
  opts: { indices: number[]; level: number; seed: number }
): Candle[] {
  const rnd = mulberry32(opts.seed);
  const out = series.slice();
  for (const i of opts.indices) {
    if (i < 0 || i >= out.length) continue;
    const c = { ...out[i] };
    c.l = round2(opts.level - rnd() * 0.35);
    if (c.c < c.l + 0.6) c.c = round2(c.l + 0.8 + rnd() * 0.8);
    if (c.o < c.l + 0.6) c.o = round2(c.l + 1.2 + rnd() * 0.8);
    if (c.h < Math.max(c.o, c.c) + 0.4) c.h = round2(Math.max(c.o, c.c) + 0.6 + rnd());
    out[i] = c;
  }
  return out;
}

/** Displacement candle that leaves a fair value gap (FVG) with the previous candle */
export function injectFVG(
  series: Candle[],
  opts: { at: number; direction: 'bull' | 'bear'; seed: number; gap?: number }
): Candle[] {
  const rnd = mulberry32(opts.seed);
  const out = series.slice();
  const at = Math.min(Math.max(opts.at, 3), out.length - 3);
  const gap = opts.gap ?? 3.2 + rnd() * 1.6;
  const prev = out[at - 1];
  const big = { ...out[at] };
  const next = { ...out[at + 1] };
  if (opts.direction === 'bull') {
    const base = prev.h;
    big.o = round2(Math.min(prev.c, base - gap * 0.2));
    big.c = round2(base + gap + 3 + rnd() * 2);
    big.h = round2(big.c + 1 + rnd() * 1.4);
    big.l = round2(big.o - 0.8 - rnd());
    next.o = round2(big.c + 0.4);
    next.c = round2(big.c + 1.2 + rnd() * 1.6);
    next.h = round2(next.c + 1.2);
    next.l = round2(big.c - 1.1);
  } else {
    const base = prev.l;
    big.o = round2(Math.max(prev.c, base + gap * 0.2));
    big.c = round2(base - gap - 3 - rnd() * 2);
    big.l = round2(big.c - 1 - rnd() * 1.4);
    big.h = round2(big.o + 0.8 + rnd());
    next.o = round2(big.c - 0.4);
    next.c = round2(big.c - 1.2 - rnd() * 1.6);
    next.l = round2(next.c - 1.2);
    next.h = round2(big.c + 1.1);
  }
  out[at] = big;
  out[at + 1] = next;
  return out;
}

/** Break of structure: push through a swing level with a strong candle */
export function injectBreak(
  series: Candle[],
  opts: { at: number; level: number; direction: 'up' | 'down'; seed: number }
): Candle[] {
  const rnd = mulberry32(opts.seed);
  const out = series.slice();
  const at = Math.min(Math.max(opts.at, 2), out.length - 2);
  const c = { ...out[at] };
  const push = 2.6 + rnd() * 1.8;
  if (opts.direction === 'up') {
    c.o = round2(Math.min(c.o, opts.level - 1.2));
    c.c = round2(opts.level + push);
    c.h = round2(c.c + 0.9 + rnd());
    c.l = round2(c.o - 0.7);
  } else {
    c.o = round2(Math.max(c.o, opts.level + 1.2));
    c.c = round2(opts.level - push);
    c.l = round2(c.c - 0.9 - rnd());
    c.h = round2(c.o + 0.7);
  }
  out[at] = c;
  return out;
}

/** Concatenate pieces and stamp timestamps */
export function compose(
  pieces: Candle[][],
  opts?: { tf?: number; startTime?: number; bridge?: number }
): Candle[] {
  const out: Candle[] = [];
  for (let p = 0; p < pieces.length; p++) {
    let piece = pieces[p];
    if (p > 0 && opts?.bridge) {
      const from = out[out.length - 1].c;
      const to = piece[0].o;
      const gapN = opts.bridge;
      const bridge: Candle[] = [];
      for (let i = 0; i < gapN; i++) {
        const k = (i + 1) / (gapN + 1);
        const price = from + (to - from) * k;
        bridge.push({ t: 0, o: round2(price), h: round2(price + 0.4), l: round2(price - 0.4), c: round2(price + 0.2) });
      }
      piece = bridge.concat(piece);
    }
    out.push(...piece.map((c) => ({ ...c })));
  }
  return stamp(out, opts?.tf ?? 15, opts?.startTime ?? 0);
}

/** Shift series prices so the first close equals `start` */
export function rebase(series: Candle[], start: number): Candle[] {
  const delta = start - series[0].c;
  return series.map((c) => ({
    ...c,
    o: round2(c.o + delta),
    h: round2(c.h + delta),
    l: round2(c.l + delta),
    c: round2(c.c + delta),
  }));
}

/** Format candle time (series minutes) as HH:MM given tf */
export function fmtTime(t: number, tf = 15, startHour = 8): string {
  const total = startHour * 60 + t;
  const h = Math.floor(total / 60) % 24;
  const m = Math.floor(total % 60);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}
