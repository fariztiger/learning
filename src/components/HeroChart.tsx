'use client';

/* Animated hero chart — lightweight bespoke canvas loop (no engine dependency)
   showing a liquidity sweep + FVG narrative, looping smoothly. */

import { useEffect, useRef } from 'react';
import { compose, injectEqualHighs, injectFVG, injectSweep, makeRange, makeTrend, mulberry32 } from '@/lib/chart/builders';

export function HeroChart() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const dpr = Math.min(2, window.devicePixelRatio || 1);

    // deterministic story: range → equal highs → sweep → FVG expansion
    let series = makeRange({ seed: 7, lo: 2380, hi: 2402, count: 26 });
    series = injectEqualHighs(series, { indices: [10, 16, 21], level: 2401, seed: 3 });
    series = injectSweep(series, { at: 24, level: 2401, side: 'high', seed: 9 });
    const trend = makeTrend({ seed: 11, start: 2394, count: 16, dir: 1, strength: 1.35, vol: 2.1 });
    series = compose([series, trend]);
    series = injectFVG(series, { at: 30, direction: 'bull', seed: 5 });

    const W = 640;
    const H = 380;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = '100%';
    canvas.style.aspectRatio = '640 / 380';

    let start = performance.now();
    let raf = 0;

    const draw = (now: number) => {
      const t = ((now - start) / 1000) % 11;
      const reveal = Math.min(series.length, Math.floor(6 + t * 4.6));
      const glows = Math.max(0, Math.min(1, (t - 4.2) / 1.2));
      const fvgGlow = Math.max(0, Math.min(1, (t - 6.2) / 1.2));

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      // background grid
      ctx.strokeStyle = 'rgba(148,163,184,0.08)';
      ctx.lineWidth = 1;
      for (let y = 30; y < H - 20; y += 38) {
        ctx.beginPath();
        ctx.moveTo(20, y);
        ctx.lineTo(W - 20, y);
        ctx.stroke();
      }

      const vis = series.slice(0, reveal);
      let lo = Infinity;
      let hi = -Infinity;
      vis.forEach((c) => {
        lo = Math.min(lo, c.l);
        hi = Math.max(hi, c.h);
      });
      lo -= 4;
      hi += 6;
      const x = (i: number) => 26 + (i * (W - 60)) / (series.length + 2);
      const y = (p: number) => 24 + ((hi - p) / (hi - lo)) * (H - 56);
      const bw = Math.max(3, ((W - 60) / (series.length + 2)) * 0.55);

      // liquidity level hint
      if (glows > 0) {
        ctx.strokeStyle = `rgba(245,185,66,${0.34 * glows})`;
        ctx.setLineDash([6, 5]);
        ctx.beginPath();
        ctx.moveTo(26, y(2401));
        ctx.lineTo(W - 26, y(2401));
        ctx.stroke();
        ctx.setLineDash([]);
        if (glows > 0.65) {
          ctx.fillStyle = `rgba(245,185,66,${(glows - 0.65) / 0.35})`;
          ctx.font = '600 11px ui-sans-serif, system-ui, sans-serif';
          ctx.fillText('Equal highs → liquidity', 34, y(2401) - 9);
        }
      }

      // FVG band
      if (fvgGlow > 0 && reveal > 32) {
        const fTop = y(series[31].l);
        const fBot = y(series[29].h);
        ctx.fillStyle = `rgba(76,201,240,${0.16 * fvgGlow})`;
        ctx.fillRect(x(28) - 6, fTop, W - x(28) - 30, Math.max(8, fBot - fTop));
        ctx.strokeStyle = `rgba(76,201,240,${0.5 * fvgGlow})`;
        ctx.strokeRect(x(28) - 6, fTop, W - x(28) - 30, Math.max(8, fBot - fTop));
        if (fvgGlow > 0.6) {
          ctx.fillStyle = `rgba(76,201,240,${(fvgGlow - 0.6) / 0.4})`;
          ctx.font = '600 11px ui-sans-serif, system-ui, sans-serif';
          ctx.fillText('Fair Value Gap', x(33), fTop - 8);
        }
      }

      // candles
      vis.forEach((c, i) => {
        const up = c.c >= c.o;
        const col = up ? '#22C98B' : '#FF5C7A';
        const isNew = i > reveal - 3;
        ctx.globalAlpha = isNew ? 0.85 : 1;
        ctx.strokeStyle = col;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(x(i), y(c.h));
        ctx.lineTo(x(i), y(c.l));
        ctx.stroke();
        ctx.fillStyle = col;
        const top = y(Math.max(c.o, c.c));
        const hgt = Math.max(2, y(Math.min(c.o, c.c)) - top);
        ctx.beginPath();
        if (typeof ctx.roundRect === 'function') ctx.roundRect(x(i) - bw / 2, top, bw, hgt, 2);
        else ctx.rect(x(i) - bw / 2, top, bw, hgt);
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // sweep marker
      if (reveal > 26) {
        const sx = x(24);
        const sy = y(series[24].h) - 16;
        const pulse = 0.5 + 0.5 * Math.sin(now / 300);
        ctx.fillStyle = `rgba(255,92,122,${0.65 + 0.3 * pulse})`;
        ctx.beginPath();
        ctx.arc(sx, sy, 5 + pulse * 2, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="relative">
      <div className="absolute -inset-4 rounded-[28px] bg-gradient-to-br from-gold-400/[0.12] via-transparent to-sky2/10 blur-2xl" />
      <div className="card relative overflow-hidden p-3 sm:p-4">
        <div className="mb-2 flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-bear/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-gold-400/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-bull/80" />
            <span className="ml-2 font-mono text-[11px] text-mist-300">XAUUSD · M15 · {useDemoLabel()}</span>
          </div>
          <span className="chip !py-0.5 !text-[10px] border-gold-400/30 text-gold-200">LIVE LESSON PREVIEW</span>
        </div>
        <canvas ref={ref} className="w-full rounded-xl" aria-label="Animated candlestick chart showing a liquidity sweep and fair value gap" />
        <div className="mt-2 flex items-center gap-4 px-2 pb-1 text-[11px] text-mist-400">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-gold-400" /> Liquidity</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-sky2" /> FVG</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-bear" /> Sweep</span>
          <span className="ml-auto">Simulated data</span>
        </div>
      </div>
    </div>
  );
}

function useDemoLabel() {
  return 'DEMO';
}
