/* Market-structure analysis: swings, liquidity, FVGs, sweeps and
   rule-based feedback for student drawings (no black-box "AI" claims). */

import type { Candle, Drawing, HLine, RectDraw, TradeDraw, TrendLine } from '../types';

export interface Pivot {
  index: number;
  price: number;
  kind: 'high' | 'low';
}

/** Fractal swing detection with symmetric lookback */
export function findSwings(candles: Candle[], lookback = 3): Pivot[] {
  const pivots: Pivot[] = [];
  for (let i = lookback; i < candles.length - lookback; i++) {
    let isHigh = true;
    let isLow = true;
    for (let j = i - lookback; j <= i + lookback; j++) {
      if (j === i) continue;
      if (candles[j].h >= candles[i].h) isHigh = false;
      if (candles[j].l <= candles[i].l) isLow = false;
    }
    if (isHigh) pivots.push({ index: i, price: candles[i].h, kind: 'high' });
    if (isLow) pivots.push({ index: i, price: candles[i].l, kind: 'low' });
  }
  return pivots;
}

export interface FVG {
  index: number;
  top: number;
  bottom: number;
  direction: 'bull' | 'bear';
}

/** 3-candle fair value gaps present in candles[0..upTo] */
export function findFVGs(candles: Candle[], upTo = candles.length - 1): FVG[] {
  const out: FVG[] = [];
  const end = Math.min(upTo, candles.length - 1);
  for (let i = 1; i < end; i++) {
    const a = candles[i - 1];
    const c = candles[i + 1];
    if (c.l > a.h) {
      out.push({ index: i, top: c.l, bottom: a.h, direction: 'bull' });
    } else if (c.h < a.l) {
      out.push({ index: i, top: a.l, bottom: c.h, direction: 'bear' });
    }
  }
  return out;
}

export interface Sweep {
  index: number;
  level: number;
  side: 'high' | 'low';
}

/** Wick beyond a recent swing extreme that closes back inside */
export function findSweeps(candles: Candle[], lookback = 3): Sweep[] {
  const pivots = findSwings(candles, lookback);
  const out: Sweep[] = [];
  for (const p of pivots) {
    for (let i = p.index + 1; i < candles.length; i++) {
      const c = candles[i];
      if (p.kind === 'high' && c.h > p.price && c.c < p.price) {
        out.push({ index: i, level: p.price, side: 'high' });
        break;
      }
      if (p.kind === 'low' && c.l < p.price && c.c > p.price) {
        out.push({ index: i, level: p.price, side: 'low' });
        break;
      }
    }
  }
  return out;
}

/** Cluster of swing highs/lows within tolerance → liquidity pool */
export function findEqualLevels(
  candles: Candle[],
  tolerance: number,
  lookback = 3
): { price: number; kind: 'high' | 'low'; indices: number[] }[] {
  const pivots = findSwings(candles, lookback);
  const used = new Set<number>();
  const pools: { price: number; kind: 'high' | 'low'; indices: number[] }[] = [];
  pivots.forEach((p, i) => {
    if (used.has(i)) return;
    const cluster = [p];
    pivots.forEach((q, j) => {
      if (i === j || used.has(j) || q.kind !== p.kind) return;
      if (Math.abs(q.price - p.price) <= tolerance) cluster.push(q);
    });
    if (cluster.length >= 2) {
      cluster.forEach((_, k) => used.add(pivots.indexOf(cluster[k])));
      pools.push({
        price: cluster.reduce((s, c) => s + c.price, 0) / cluster.length,
        kind: p.kind,
        indices: cluster.map((c) => c.index),
      });
    }
  });
  return pools;
}

/** Simple structure readout: HH/HL/LH/LL over most recent swings */
export function describeStructure(candles: Candle[], lookback = 3): {
  trend: 'up' | 'down' | 'range';
  lastHigh?: Pivot;
  lastLow?: Pivot;
  prevHigh?: Pivot;
  prevLow?: Pivot;
} {
  const pivots = findSwings(candles, lookback);
  const highs = pivots.filter((p) => p.kind === 'high');
  const lows = pivots.filter((p) => p.kind === 'low');
  const lastHigh = highs[highs.length - 1];
  const prevHigh = highs[highs.length - 2];
  const lastLow = lows[lows.length - 1];
  const prevLow = lows[lows.length - 2];
  let trend: 'up' | 'down' | 'range' = 'range';
  if (lastHigh && prevHigh && lastLow && prevLow) {
    const hh = lastHigh.price > prevHigh.price;
    const hl = lastLow.price > prevLow.price;
    const lh = lastHigh.price < prevHigh.price;
    const ll = lastLow.price < prevLow.price;
    if (hh && hl) trend = 'up';
    else if (lh && ll) trend = 'down';
  }
  return { trend, lastHigh, lastLow, prevHigh, prevLow };
}

/* --------------------------- drawing evaluation --------------------------- */

export interface Feedback {
  tone: 'good' | 'ok' | 'warn';
  headline: string;
  detail: string;
}

function near(a: number, b: number, tol: number) {
  return Math.abs(a - b) <= tol;
}

export function evaluateHLine(
  d: HLine,
  candles: Candle[],
  upTo: number
): Feedback {
  const slice = candles.slice(0, upTo + 1);
  const tol = priceTolerance(slice);
  const pivots = findSwings(slice, 3);
  const touchesHigh = pivots.filter((p) => p.kind === 'high' && near(p.price, d.price, tol)).length;
  const touchesLow = pivots.filter((p) => p.kind === 'low' && near(p.price, d.price, tol)).length;
  const touches = touchesHigh + touchesLow;
  const last = slice[slice.length - 1];
  const dist = Math.abs(last.c - d.price) / tol;

  if (touches >= 2) {
    return {
      tone: 'good',
      headline: 'Strong level',
      detail: `Price has reacted near this level ${touches} times${
        touchesHigh >= 2 && touchesLow === 0
          ? ' (equal highs — a liquidity pool above the market)'
          : touchesLow >= 2 && touchesHigh === 0
          ? ' (equal lows — a liquidity pool below the market)'
          : ''
      }. Levels with multiple reactions are more meaningful than a single touch.`,
    };
  }
  if (touches === 1) {
    return {
      tone: 'ok',
      headline: 'Plausible level',
      detail:
        'One swing reacts to this line so far. A single touch is a candidate level — wait for further reactions before trusting it.',
    };
  }
  if (dist < 1.2) {
    return {
      tone: 'warn',
      headline: 'No structure here yet',
      detail:
        'This line sits near current price but no swing high/low has reacted to it. Avoid drawing lines in empty space — anchor levels to visible reactions.',
    };
  }
  return {
    tone: 'warn',
    headline: 'Weak placement',
    detail:
      'No swing points align with this line. Try placing horizontal lines at clear swing highs or lows where price turned.',
  };
}

export function evaluateTrendLine(d: TrendLine, candles: Candle[], upTo: number): Feedback {
  const slice = candles.slice(0, upTo + 1);
  const tol = priceTolerance(slice) * 1.1;
  const pivots = findSwings(slice, 3);
  const dirUp = d.p2 > d.p1;
  const wanted = dirUp ? 'low' : 'high';
  let fits = 0;
  for (const p of pivots) {
    if (p.kind !== wanted) continue;
    if (p.index < Math.min(d.x1, d.x2) - 1 || p.index > Math.max(d.x1, d.x2) + 1) continue;
    const t = (p.index - d.x1) / (d.x2 - d.x1 || 1);
    const lineP = d.p1 + (d.p2 - d.p1) * t;
    if (Math.abs(lineP - p.price) <= tol * 1.6) fits++;
  }
  const slope = (d.p2 - d.p1) / (d.x2 - d.x1 || 1);
  if (fits >= 2 && Math.abs(slope) > 0.02) {
    return {
      tone: 'good',
      headline: 'Trendline fits the structure',
      detail: `This line touches ${fits} swing ${wanted === 'low' ? 'lows' : 'highs'}. ${
        dirUp ? 'Rising support' : 'Falling resistance'} lines work best when they connect at least two clear swing points.`,
    };
  }
  if (fits === 1) {
    return {
      tone: 'ok',
      headline: 'Needs a second touch',
      detail: 'One swing point fits. Extend the line to connect two or more swings before treating it as valid.',
    };
  }
  return {
    tone: 'warn',
    headline: 'Line misses the swings',
    detail: `Try connecting consecutive swing ${wanted === 'low' ? 'lows' : 'highs'} — a trendline is only useful when price actually respects it.`,
  };
}

export function evaluateRect(d: RectDraw, candles: Candle[], upTo: number): Feedback {
  const slice = candles.slice(0, upTo + 1);
  const top = Math.max(d.p1, d.p2);
  const bottom = Math.min(d.p1, d.p2);
  const i0 = Math.max(0, Math.floor(Math.min(d.x1, d.x2)));
  const i1 = Math.min(slice.length - 1, Math.ceil(Math.max(d.x1, d.x2)));
  let reactions = 0;
  for (let i = i0; i <= i1; i++) {
    const c = slice[i];
    if (c.h >= bottom && c.l <= top) reactions++;
  }
  const fvg = findFVGs(slice, upTo).find(
    (f) => overlap(f.bottom, f.top, bottom, top) / Math.max(0.01, top - bottom) > 0.4
  );
  const width = Math.abs(d.x2 - d.x1);
  const height = top - bottom;
  const tol = priceTolerance(slice);

  if (fvg) {
    return {
      tone: 'good',
      headline: 'Zone overlaps a Fair Value Gap',
      detail: `Your rectangle overlaps an imbalance between candles — this is the type of zone price often revisits. Keep the zone tight to the gap instead of covering many candles.`,
    };
  }
  if (reactions >= 3 && height <= tol * 6 && width >= 2) {
    return {
      tone: 'good',
      headline: 'Meaningful zone',
      detail: `${reactions} candles interact with this zone and its height is controlled. Tight zones are easier to trade than oversized boxes.`,
    };
  }
  if (height > tol * 12) {
    return {
      tone: 'warn',
      headline: 'Zone is too large',
      detail:
        'A box that covers most of the price action gives no decision value. Shrink it to the last strong candles that caused an imbalance or reaction.',
    };
  }
  return {
    tone: 'ok',
    headline: 'Reasonable box',
    detail: `${reactions} candles interact with this zone. Look for the origin of a strong move (the last down/up candles before displacement) when drawing supply/demand zones.`,
  };
}

export function evaluateTrade(d: TradeDraw, candles: Candle[], upTo: number): Feedback {
  const slice = candles.slice(0, upTo + 1);
  const struct = describeStructure(slice, 3);
  const risk = Math.abs(d.entry - d.sl);
  const reward = Math.abs(d.tp - d.entry);
  const rr = reward / (risk || 0.01);
  const tol = priceTolerance(slice);
  const notes: string[] = [];
  let tone: Feedback['tone'] = 'good';

  if (risk <= 0) {
    return {
      tone: 'warn',
      headline: 'Invalid risk',
      detail: 'Stop loss must differ from the entry price.',
    };
  }
  if (d.direction === 'buy' && d.sl >= d.entry) {
    return { tone: 'warn', headline: 'Stop on the wrong side', detail: 'For a BUY, the stop loss goes below the entry.' };
  }
  if (d.direction === 'sell' && d.sl <= d.entry) {
    return { tone: 'warn', headline: 'Stop on the wrong side', detail: 'For a SELL, the stop loss goes above the entry.' };
  }
  if (d.direction === 'buy' && d.tp <= d.entry) {
    return { tone: 'warn', headline: 'Target on the wrong side', detail: 'For a BUY, take profit goes above the entry.' };
  }
  if (d.direction === 'sell' && d.tp >= d.entry) {
    return { tone: 'warn', headline: 'Target on the wrong side', detail: 'For a SELL, take profit goes below the entry.' };
  }

  // structural stop: beyond the last opposing swing
  const lastSwingLow = struct.lastLow?.price;
  const lastSwingHigh = struct.lastHigh?.price;
  if (d.direction === 'buy' && lastSwingLow !== undefined) {
    if (d.sl < lastSwingLow - tol * 0.4) notes.push('Your stop sits below the last swing low — structurally protected.');
    else if (d.sl > lastSwingLow) {
      notes.push('Your stop sits above the last swing low — a normal pullback could hit it before the idea is proven wrong.');
      tone = 'warn';
    }
  }
  if (d.direction === 'sell' && lastSwingHigh !== undefined) {
    if (d.sl > lastSwingHigh + tol * 0.4) notes.push('Your stop sits above the last swing high — structurally protected.');
    else if (d.sl < lastSwingHigh) {
      notes.push('Your stop sits below the last swing high — a normal pullback could hit it before the idea is proven wrong.');
      tone = 'warn';
    }
  }

  if (rr >= 2) notes.push(`Reward-to-risk is ${rr.toFixed(2)}R — at or above the 2R guideline.`);
  else if (rr >= 1.2) {
    notes.push(`Reward-to-risk is ${rr.toFixed(2)}R — acceptable, but 2R+ gives more room for error.`);
    if (tone === 'good') tone = 'ok';
  } else {
    notes.push(`Reward-to-risk is only ${rr.toFixed(2)}R — below 1.2R the setup needs an exceptionally high win rate.`);
    tone = 'warn';
  }

  if (risk > tol * 10) {
    notes.push('The stop is very wide relative to recent volatility — consider tightening it to structure or skipping the trade.');
    if (tone === 'good') tone = 'ok';
  }

  return {
    tone,
    headline: rr >= 2 && tone === 'good' ? 'Well-structured trade plan' : 'Trade plan needs review',
    detail: notes.join(' '),
  };
}

function overlap(a1: number, a2: number, b1: number, b2: number) {
  return Math.max(0, Math.min(a2, b2) - Math.max(a1, b1));
}

/** Price tolerance scaled to recent volatility (about 1 ATR-ish) */
export function priceTolerance(candles: Candle[]): number {
  const n = Math.min(candles.length, 40);
  if (n === 0) return 1;
  let sum = 0;
  for (let i = candles.length - n; i < candles.length; i++) {
    sum += candles[i].h - candles[i].l;
  }
  return Math.max(0.4, (sum / n) * 1.1);
}

/** Grade an "identify" click against a target */
export function hitTarget(
  clickX: number,
  clickP: number,
  target: { x: number; p: number; r: number }
): boolean {
  const dx = (clickX - target.x) / Math.max(1, target.r * 1.9);
  const dp = (clickP - target.p) / Math.max(0.5, target.r * 2.6);
  return dx * dx + dp * dp <= 1;
}

/** Grade a trade placement against an answer key */
export function gradeTradePlacement(
  d: TradeDraw,
  key: {
    direction: 'buy' | 'sell';
    entryFrom: number;
    entryTo: number;
    slFrom: number;
    slTo: number;
    tpFrom: number;
    tpTo: number;
    minR: number;
  }
): { score: number; notes: string[] } {
  const notes: string[] = [];
  let score = 0;
  const inRange = (v: number, a: number, b: number) => v >= Math.min(a, b) && v <= Math.max(a, b);

  if (d.direction === key.direction) {
    score += 25;
    notes.push('Direction matches the scenario.');
  } else {
    notes.push(`Direction is off — this scenario calls for a ${key.direction.toUpperCase()}.`);
  }
  if (inRange(d.entry, key.entryFrom, key.entryTo)) {
    score += 25;
    notes.push('Entry is inside the logical entry zone.');
  } else {
    notes.push('Entry is outside the logical entry zone (look for the pullback area, not the breakout candle).');
  }
  if (inRange(d.sl, key.slFrom, key.slTo)) {
    score += 25;
    notes.push('Stop placement protects the invalidation point.');
  } else {
    notes.push('Stop is not at the structural invalidation point.');
  }
  if (inRange(d.tp, key.tpFrom, key.tpTo)) {
    score += 15;
    notes.push('Target is realistic for this scenario.');
  } else {
    notes.push('Target misses the liquidity/structure objective.');
  }
  const rr = Math.abs(d.tp - d.entry) / Math.max(0.01, Math.abs(d.entry - d.sl));
  if (rr >= key.minR) {
    score += 10;
    notes.push(`Reward-to-risk ${rr.toFixed(2)}R meets the ${key.minR}R minimum.`);
  } else {
    notes.push(`Reward-to-risk ${rr.toFixed(2)}R is below the ${key.minR}R minimum.`);
  }
  return { score: Math.min(100, score), notes };
}

/** Grading for chart-level drawings in scenario mode */
export function evaluateDrawing(d: Drawing, candles: Candle[], upTo: number): Feedback {
  switch (d.kind) {
    case 'hline':
      return evaluateHLine(d, candles, upTo);
    case 'trendline':
      return evaluateTrendLine(d, candles, upTo);
    case 'rect':
      return evaluateRect(d, candles, upTo);
    case 'trade':
      return evaluateTrade(d, candles, upTo);
    default:
      return {
        tone: 'ok',
        headline: 'Annotation saved',
        detail: 'Use the analysis tools for structural feedback on levels, zones and trade plans.',
      };
  }
}
