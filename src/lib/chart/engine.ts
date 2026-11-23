/* TIGERFX Chart Engine — dependency-free canvas candlestick engine with
   drawing tools, replay reveal, lesson overlays and trade planning. */

import type {
  ArrowDraw,
  Candle,
  Drawing,
  FibDraw,
  HLine,
  RectDraw,
  SceneHighlight,
  SceneNote,
  TextDraw,
  Tone,
  Tool,
  TradeDraw,
  TrendLine,
} from '../types';

export interface EngineEvents {
  onClick?: (pt: { x: number; p: number }) => void;
  onDrawingAdded?: (d: Drawing) => void;
  onDrawingsChanged?: (drawings: Drawing[]) => void;
  onHover?: (pt: { x: number; p: number } | null) => void;
}

interface View {
  i0: number;
  i1: number;
  pMin: number;
  pMax: number;
  autoPrice: boolean;
}

const TONE_HEX: Record<Tone, string> = {
  gold: '#F5B942',
  bull: '#22C98B',
  bear: '#FF5C7A',
  sky: '#4CC9F0',
  violet: '#8B7CF6',
  mist: '#97A3B8',
};

const C = {
  bg: '#0B1220',
  grid: 'rgba(148, 163, 184, 0.09)',
  axis: 'rgba(148, 163, 184, 0.55)',
  bull: '#22C98B',
  bullWick: '#22C98B',
  bear: '#FF5C7A',
  bearWick: '#FF5C7A',
  cross: 'rgba(148, 163, 184, 0.5)',
  text: 'rgba(196, 206, 222, 0.9)',
  chipBg: 'rgba(15, 23, 41, 0.92)',
};

const PAD = { top: 16, right: 72, bottom: 28, left: 12 };

let idCounter = 0;
export function drawId(): string {
  return `d${Date.now().toString(36)}${(idCounter++).toString(36)}`;
}

export class ChartEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private dpr = 1;
  private w = 0;
  private h = 0;

  private data: Candle[] = [];
  private visibleTo = Number.MAX_SAFE_INTEGER;
  private view: View = { i0: 0, i1: 60, pMin: 0, pMax: 1, autoPrice: true };

  private drawings: Drawing[] = [];
  private undoStack: Drawing[][] = [];
  private redoStack: Drawing[][] = [];

  private highlights: SceneHighlight[] = [];
  private notes: SceneNote[] = [];

  private tool: Tool = 'cursor';
  private events: EngineEvents = {};

  private hover: { x: number; p: number; px: number; py: number } | null = null;
  private selectedId: string | null = null;
  private drag:
    | { kind: 'pan'; startX: number; i0: number; i1: number }
    | { kind: 'create'; draft: Drawing; sx: number; sy: number }
    | { kind: 'move'; id: string; startX: number; startY: number; orig: Drawing }
    | null = null;

  private tradeDraft: { direction: 'buy' | 'sell'; entry: number; sl?: number; stage: 1 | 2 | 3 } | null = null;
  private textPrompt: ((pt: { x: number; p: number }) => void) | null = null;

  private raf = 0;
  private animUntil = 0;
  private revealAnimFrom = -1;
  private revealAnimStart = 0;

  showCrosshair = true;
  interactive = true;

  constructor(canvas: HTMLCanvasElement, events: EngineEvents = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.events = events;
    canvas.tabIndex = 0;
    this.bind();
    this.resize();
  }

  /* ------------------------------ public API ----------------------------- */

  setEvents(e: EngineEvents) {
    this.events = e;
  }

  setTextPrompt(fn: ((pt: { x: number; p: number }) => void) | null) {
    this.textPrompt = fn;
  }

  setData(candles: Candle[], opts?: { fit?: boolean; revealAll?: boolean }) {
    this.data = candles;
    if (opts?.revealAll !== false) this.visibleTo = candles.length - 1;
    if (opts?.fit !== false) this.fitView();
    else this.clampView();
    this.requestRender();
  }

  setVisibleTo(i: number) {
    const prev = this.visibleTo;
    this.visibleTo = Math.max(-1, Math.min(i, this.data.length - 1));
    if (this.visibleTo > prev) {
      this.revealAnimFrom = prev;
      this.revealAnimStart = performance.now();
    }
    this.requestRender();
  }

  getVisibleTo() {
    return this.visibleTo;
  }

  setTool(tool: Tool) {
    this.tool = tool;
    this.tradeDraft = null;
    this.selectedId = null;
    if (tool !== 'cursor') this.selectedId = null;
    this.requestRender();
  }

  getTool() {
    return this.tool;
  }

  setDrawings(d: Drawing[]) {
    this.drawings = d.map((x) => ({ ...x }));
    this.requestRender();
  }

  getDrawings(): Drawing[] {
    return this.drawings;
  }

  addDrawing(d: Drawing) {
    this.pushUndo();
    this.drawings.push(d);
    this.events.onDrawingAdded?.(d);
    this.events.onDrawingsChanged?.(this.drawings);
    this.requestRender();
  }

  removeDrawing(id: string) {
    this.pushUndo();
    this.drawings = this.drawings.filter((d) => d.id !== id);
    if (this.selectedId === id) this.selectedId = null;
    this.events.onDrawingsChanged?.(this.drawings);
    this.requestRender();
  }

  clearDrawings() {
    this.pushUndo();
    this.drawings = [];
    this.selectedId = null;
    this.events.onDrawingsChanged?.(this.drawings);
    this.requestRender();
  }

  undo() {
    const prev = this.undoStack.pop();
    if (!prev) return;
    this.redoStack.push(this.drawings.map((d) => ({ ...d })));
    this.drawings = prev;
    this.events.onDrawingsChanged?.(this.drawings);
    this.requestRender();
  }

  redo() {
    const next = this.redoStack.pop();
    if (!next) return;
    this.undoStack.push(this.drawings.map((d) => ({ ...d })));
    this.drawings = next;
    this.events.onDrawingsChanged?.(this.drawings);
    this.requestRender();
  }

  setHighlights(h: SceneHighlight[]) {
    this.highlights = h;
    this.requestRender();
  }

  setNotes(n: SceneNote[]) {
    this.notes = n;
    this.requestRender();
  }

  fitView() {
    const n = this.data.length;
    if (n === 0) return;
    this.view.i0 = 0;
    this.view.i1 = Math.max(20, n + 3);
    this.view.autoPrice = true;
    this.fitPrice();
    this.requestRender();
  }

  focusRange(i0: number, i1: number) {
    this.view.i0 = i0;
    this.view.i1 = i1;
    this.fitPrice();
    this.requestRender();
  }

  resize() {
    const parent = this.canvas.parentElement;
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    this.dpr = Math.min(2.5, window.devicePixelRatio || 1);
    this.w = Math.max(240, rect.width);
    this.h = Math.max(180, rect.height);
    this.canvas.width = Math.round(this.w * this.dpr);
    this.canvas.height = Math.round(this.h * this.dpr);
    this.canvas.style.width = `${this.w}px`;
    this.canvas.style.height = `${this.h}px`;
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.requestRender();
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    this.unbind();
  }

  /* ------------------------------- rendering ------------------------------ */

  private get cw() {
    return (this.w - PAD.left - PAD.right) / Math.max(1, this.view.i1 - this.view.i0);
  }
  private get ch() {
    return (this.h - PAD.top - PAD.bottom) / Math.max(0.001, this.view.pMax - this.view.pMin);
  }
  xToPx(x: number) {
    return PAD.left + (x - this.view.i0) * this.cw;
  }
  pxToX(px: number) {
    return this.view.i0 + (px - PAD.left) / this.cw;
  }
  pToPx(p: number) {
    return PAD.top + (this.view.pMax - p) * this.ch;
  }
  pxToP(py: number) {
    return this.view.pMax - (py - PAD.top) / this.ch;
  }

  private fitPrice() {
    if (!this.view.autoPrice) return;
    let lo = Infinity;
    let hi = -Infinity;
    const i0 = Math.max(0, Math.floor(this.view.i0) - 2);
    const i1 = Math.min(this.data.length - 1, Math.ceil(this.view.i1) + 2);
    for (let i = i0; i <= i1; i++) {
      if (i > this.visibleTo) break;
      lo = Math.min(lo, this.data[i].l);
      hi = Math.max(hi, this.data[i].h);
    }
    if (!isFinite(lo) || !isFinite(hi)) {
      lo = 0;
      hi = 1;
    }
    const pad = (hi - lo) * 0.12 || 1;
    this.view.pMin = lo - pad;
    this.view.pMax = hi + pad;
  }

  private clampView() {
    const n = Math.max(2, this.data.length + 3);
    const span = this.view.i1 - this.view.i0;
    if (this.view.i0 < -2) {
      this.view.i0 = -2;
      this.view.i1 = this.view.i0 + span;
    }
    if (this.view.i1 > n) {
      this.view.i1 = n;
      this.view.i0 = Math.max(-2, this.view.i1 - span);
    }
    this.fitPrice();
  }

  private requestRender() {
    this.animUntil = performance.now() + 500;
    if (this.raf) return;
    const loop = () => {
      this.render();
      if (performance.now() < this.animUntil) {
        this.raf = requestAnimationFrame(loop);
      } else {
        this.raf = 0;
      }
    };
    this.raf = requestAnimationFrame(loop);
  }

  private render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.w, this.h);
    this.drawGrid();
    this.drawHighlights();
    this.drawCandles();
    this.drawDrawings();
    this.drawNotes();
    this.drawAxis();
    if (this.showCrosshair && this.hover) this.drawCrosshair();
    if (this.tradeDraft) this.drawTradeDraft();
  }

  private drawGrid() {
    const ctx = this.ctx;
    ctx.save();
    ctx.strokeStyle = C.grid;
    ctx.lineWidth = 1;
    const span = this.view.pMax - this.view.pMin;
    const step = niceStep(span / 6);
    const start = Math.ceil(this.view.pMin / step) * step;
    ctx.font = '11px ui-sans-serif, system-ui, sans-serif';
    ctx.textBaseline = 'middle';
    for (let p = start; p < this.view.pMax; p += step) {
      const y = Math.round(this.pToPx(p)) + 0.5;
      ctx.beginPath();
      ctx.moveTo(PAD.left, y);
      ctx.lineTo(this.w - PAD.right, y);
      ctx.stroke();
    }
    const iSpan = this.view.i1 - this.view.i0;
    const iStep = Math.max(1, Math.round(iSpan / 8));
    for (let i = Math.ceil(this.view.i0 / iStep) * iStep; i < this.view.i1; i += iStep) {
      const x = Math.round(this.xToPx(i)) + 0.5;
      ctx.beginPath();
      ctx.moveTo(x, PAD.top);
      ctx.lineTo(x, this.h - PAD.bottom);
      ctx.stroke();
    }
    ctx.restore();
  }

  private drawCandles() {
    const ctx = this.ctx;
    const half = Math.max(1, this.cw * 0.32);
    const i0 = Math.max(0, Math.floor(this.view.i0) - 1);
    const i1 = Math.min(this.data.length - 1, Math.ceil(this.view.i1) + 1);
    const animT = this.revealAnimFrom >= 0 ? Math.min(1, (performance.now() - this.revealAnimStart) / 260) : 1;

    for (let i = i0; i <= i1; i++) {
      if (i > this.visibleTo) break;
      const k = this.data[i];
      const x = this.xToPx(i);
      let alpha = 1;
      if (this.revealAnimFrom >= 0 && i > this.revealAnimFrom) {
        alpha = Math.max(0.15, animT);
      }
      ctx.globalAlpha = alpha;
      const up = k.c >= k.o;
      const col = up ? C.bull : C.bear;
      const bodyTop = this.pToPx(Math.max(k.o, k.c));
      const bodyBot = this.pToPx(Math.min(k.o, k.c));
      const bodyH = Math.max(1.2, bodyBot - bodyTop);

      ctx.strokeStyle = up ? C.bullWick : C.bearWick;
      ctx.lineWidth = Math.max(1, Math.min(2, this.cw * 0.12));
      ctx.beginPath();
      ctx.moveTo(x, this.pToPx(k.h));
      ctx.lineTo(x, this.pToPx(k.l));
      ctx.stroke();

      ctx.fillStyle = col;
      roundRect(ctx, x - half, bodyTop, half * 2, bodyH, Math.min(2, half * 0.5));
      ctx.fill();

      if (i === this.visibleTo && i > 0) {
        ctx.globalAlpha = 0.16 * alpha;
        ctx.fillStyle = col;
        roundRect(ctx, x - half - 3, bodyTop - 3, half * 2 + 6, bodyH + 6, 5);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
  }

  private drawHighlights() {
    const ctx = this.ctx;
    for (const hl of this.highlights) {
      const tone = TONE_HEX[hl.tone ?? 'gold'];
      const x1 = this.xToPx(hl.from) - this.cw * 0.55;
      const x2 = this.xToPx(hl.to) + this.cw * 0.55;
      const y1 = hl.pFrom !== undefined ? this.pToPx(hl.pFrom) : PAD.top;
      const y2 = hl.pTo !== undefined ? this.pToPx(hl.pTo) : this.h - PAD.bottom;
      const top = Math.min(y1, y2);
      const hgt = Math.abs(y2 - y1);
      ctx.save();
      ctx.fillStyle = hexA(tone, 0.13);
      roundRect(ctx, x1, top, x2 - x1, hgt, 8);
      ctx.fill();
      ctx.strokeStyle = hexA(tone, 0.5);
      ctx.lineWidth = 1.2;
      ctx.setLineDash([5, 4]);
      roundRect(ctx, x1, top, x2 - x1, hgt, 8);
      ctx.stroke();
      ctx.setLineDash([]);
      if (hl.label) {
        const label = hl.label.en;
        ctx.font = '600 11px ui-sans-serif, system-ui, sans-serif';
        const tw = ctx.measureText(label).width;
        const cx = (x1 + x2) / 2;
        const ly = top + 4;
        ctx.fillStyle = hexA(tone, 0.92);
        roundRect(ctx, cx - tw / 2 - 8, ly, tw + 16, 20, 10);
        ctx.fill();
        ctx.fillStyle = '#0B1220';
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.fillText(label, cx, ly + 10.5);
        ctx.textAlign = 'left';
      }
      ctx.restore();
    }
  }

  private drawDrawings() {
    for (const d of this.drawings) this.drawOne(d, d.id === this.selectedId);
  }

  private drawOne(d: Drawing, selected: boolean) {
    const ctx = this.ctx;
    const tone = TONE_HEX[d.tone ?? 'sky'];
    ctx.save();
    if (selected) {
      ctx.shadowColor = hexA(tone, 0.55);
      ctx.shadowBlur = 10;
    }
    switch (d.kind) {
      case 'hline': {
        const y = this.pToPx(d.price);
        ctx.strokeStyle = tone;
        ctx.lineWidth = selected ? 2.2 : 1.5;
        ctx.setLineDash(d.style === 'solid' ? [] : [7, 5]);
        ctx.beginPath();
        ctx.moveTo(PAD.left, y);
        ctx.lineTo(this.w - PAD.right, y);
        ctx.stroke();
        ctx.setLineDash([]);
        this.chip(this.w - PAD.right + 4, y, d.price.toFixed(2), tone);
        if (d.label) this.tag(PAD.left + 8, y - 20, d.label, tone);
        break;
      }
      case 'trendline':
      case 'arrow': {
        const x1 = this.xToPx(d.x1);
        const y1 = this.pToPx(d.p1);
        const x2 = this.xToPx(d.x2);
        const y2 = this.pToPx(d.p2);
        ctx.strokeStyle = tone;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        if (d.kind === 'arrow') this.arrowHead(x1, y1, x2, y2, tone);
        else {
          ctx.fillStyle = tone;
          ctx.beginPath();
          ctx.arc(x1, y1, 3, 0, Math.PI * 2);
          ctx.arc(x2, y2, 3, 0, Math.PI * 2);
          ctx.fill();
        }
        if (d.label) this.tag((x1 + x2) / 2, (y1 + y2) / 2 - 22, d.label, tone);
        break;
      }
      case 'rect': {
        const x1 = this.xToPx(Math.min(d.x1, d.x2));
        const x2 = this.xToPx(Math.max(d.x1, d.x2));
        const y1 = this.pToPx(Math.max(d.p1, d.p2));
        const y2 = this.pToPx(Math.min(d.p1, d.p2));
        ctx.fillStyle = hexA(tone, d.fill ?? 0.16);
        roundRect(ctx, x1, y1, x2 - x1, y2 - y1, 4);
        ctx.fill();
        ctx.strokeStyle = hexA(tone, 0.8);
        ctx.lineWidth = 1.4;
        roundRect(ctx, x1, y1, x2 - x1, y2 - y1, 4);
        ctx.stroke();
        if (d.label) this.tag(x1 + 8, y1 + 4, d.label, tone);
        break;
      }
      case 'fib': {
        const levels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];
        const x1 = this.xToPx(Math.min(d.x1, d.x2));
        const x2 = this.xToPx(Math.max(d.x1, d.x2));
        ctx.font = '10px ui-monospace, monospace';
        for (const lv of levels) {
          const p = d.p1 + (d.p2 - d.p1) * lv;
          const y = this.pToPx(p);
          const strong = lv === 0.5 || lv === 0.618 || lv === 0 || lv === 1;
          ctx.strokeStyle = strong ? hexA(tone, 0.85) : hexA(tone, 0.4);
          ctx.lineWidth = strong ? 1.5 : 1;
          ctx.beginPath();
          ctx.moveTo(x1, y);
          ctx.lineTo(x2, y);
          ctx.stroke();
          ctx.fillStyle = hexA(tone, 0.95);
          ctx.fillText(`${(lv * 100).toFixed(1)}%  ${p.toFixed(2)}`, x2 + 4, y + 3);
        }
        break;
      }
      case 'text': {
        const x = this.xToPx(d.x);
        const y = this.pToPx(d.p);
        this.tag(x, y, d.text, tone);
        break;
      }
      case 'trade': {
        const ex = this.xToPx(d.x);
        const yE = this.pToPx(d.entry);
        const yS = this.pToPx(d.sl);
        const yT = this.pToPx(d.tp);
        const width = Math.min(190, (this.w - PAD.right - ex) * 0.62);
        // risk box
        ctx.fillStyle = 'rgba(255, 92, 122, 0.18)';
        ctx.fillRect(ex, Math.min(yE, yS), width, Math.abs(yS - yE));
        // reward box
        ctx.fillStyle = 'rgba(34, 201, 139, 0.18)';
        ctx.fillRect(ex, Math.min(yE, yT), width, Math.abs(yT - yE));
        const rr = Math.abs(d.tp - d.entry) / Math.max(0.001, Math.abs(d.entry - d.sl));
        // lines
        drawLevel(ex, yE, width, '#E8EDF7', `Entry ${d.entry.toFixed(2)}`, true);
        drawLevel(ex, yS, width, C.bear, `SL ${d.sl.toFixed(2)}`, true);
        drawLevel(ex, yT, width, C.bull, `TP ${d.tp.toFixed(2)}`, true);
        ctx.fillStyle = '#E8EDF7';
        roundRect(ctx, ex + width + 6, (yE + yT) / 2 - 11, 54, 22, 6);
        ctx.fill();
        ctx.fillStyle = '#0B1220';
        ctx.font = '700 11px ui-sans-serif, system-ui, sans-serif';
        ctx.fillText(`${rr.toFixed(2)}R`, ex + width + 16, (yE + yT) / 2 + 3);
        if (d.label) this.tag(ex + 6, Math.min(yE, yS, yT) - 24, d.label, tone);
        break;
      }
    }
    ctx.restore();
    return;

    function drawLevel(x: number, y: number, w2: number, color: string, label: string, dashed: boolean) {
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.6;
      if (dashed) ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + w2, y);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = color;
      roundRect(ctx, x - 66, y - 10, 62, 20, 5);
      ctx.fill();
      ctx.fillStyle = '#0B1220';
      ctx.font = '700 10px ui-sans-serif, system-ui, sans-serif';
      ctx.fillText(label, x - 61, y + 3.5);
    }
  }

  private drawTradeDraft() {
    const d = this.tradeDraft!;
    const y = this.pToPx(d.entry);
    const ctx = this.ctx;
    ctx.save();
    ctx.strokeStyle = '#E8EDF7';
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(PAD.left, y);
    ctx.lineTo(this.w - PAD.right, y);
    ctx.stroke();
    ctx.setLineDash([]);
    this.tag(PAD.left + 10, y - 26, `Entry ${d.entry.toFixed(2)} — click stop`, '#E8EDF7');
    if (d.sl !== undefined) {
      const ys = this.pToPx(d.sl);
      ctx.strokeStyle = C.bear;
      ctx.beginPath();
      ctx.moveTo(PAD.left, ys);
      ctx.lineTo(this.w - PAD.right, ys);
      ctx.stroke();
      this.tag(PAD.left + 10, ys + 8, `SL ${d.sl.toFixed(2)} — click target`, C.bear);
    }
    ctx.restore();
  }

  private drawNotes() {
    for (const n of this.notes) {
      const tone = TONE_HEX[n.tone ?? 'gold'];
      const x = this.xToPx(n.x);
      const y = this.pToPx(n.p);
      this.ctx.save();
      this.ctx.fillStyle = tone;
      this.ctx.beginPath();
      this.ctx.arc(x, y, 3.5, 0, Math.PI * 2);
      this.ctx.fill();
      this.tag(x + 10, y - 12, n.text.en, tone);
      this.ctx.restore();
    }
  }

  private drawAxis() {
    const ctx = this.ctx;
    ctx.save();
    // price labels
    ctx.font = '11px ui-monospace, monospace';
    ctx.fillStyle = C.axis;
    ctx.textBaseline = 'middle';
    const span = this.view.pMax - this.view.pMin;
    const step = niceStep(span / 6);
    const start = Math.ceil(this.view.pMin / step) * step;
    for (let p = start; p < this.view.pMax; p += step) {
      ctx.fillText(p.toFixed(2), this.w - PAD.right + 8, this.pToPx(p));
    }
    // current price tag
    const last = this.data[this.visibleTo];
    if (last) {
      const y = this.pToPx(last.c);
      const up = last.c >= last.o;
      ctx.fillStyle = up ? C.bull : C.bear;
      roundRect(ctx, this.w - PAD.right + 2, y - 11, PAD.right - 8, 22, 5);
      ctx.fill();
      ctx.fillStyle = '#0B1220';
      ctx.font = '700 11px ui-monospace, monospace';
      ctx.fillText(last.c.toFixed(2), this.w - PAD.right + 8, y);
    }
    // time labels
    ctx.fillStyle = C.axis;
    ctx.font = '10px ui-monospace, monospace';
    const iSpan = this.view.i1 - this.view.i0;
    const iStep = Math.max(1, Math.round(iSpan / 8));
    for (let i = Math.ceil(this.view.i0 / iStep) * iStep; i < this.view.i1; i += iStep) {
      if (i < 0 || i > this.visibleTo) continue;
      const c = this.data[Math.floor(i)];
      if (!c) continue;
      const total = 8 * 60 + c.t;
      const hh = String(Math.floor(total / 60) % 24).padStart(2, '0');
      const mm = String(Math.floor(total % 60)).padStart(2, '0');
      ctx.fillText(`${hh}:${mm}`, this.xToPx(i) - 14, this.h - PAD.bottom / 2 - 1);
    }
    ctx.restore();
  }

  private drawCrosshair() {
    const ctx = this.ctx;
    const { px, py } = this.hover!;
    ctx.save();
    ctx.strokeStyle = C.cross;
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(px, PAD.top);
    ctx.lineTo(px, this.h - PAD.bottom);
    ctx.moveTo(PAD.left, py);
    ctx.lineTo(this.w - PAD.right, py);
    ctx.stroke();
    ctx.setLineDash([]);
    this.chip(this.w - PAD.right + 4, py, this.hover!.p.toFixed(2), '#97A3B8');
    ctx.restore();
  }

  private chip(x: number, y: number, text: string, color: string) {
    const ctx = this.ctx;
    ctx.font = '700 11px ui-monospace, monospace';
    const tw = Math.max(52, ctx.measureText(text).width + 12);
    ctx.fillStyle = color;
    roundRect(ctx, x, y - 11, tw, 22, 5);
    ctx.fill();
    ctx.fillStyle = '#0B1220';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x + 6, y);
  }

  private tag(x: number, y: number, text: string, color: string) {
    const ctx = this.ctx;
    ctx.font = '600 11px ui-sans-serif, system-ui, sans-serif';
    const tw = ctx.measureText(text).width;
    ctx.fillStyle = C.chipBg;
    roundRect(ctx, x, y, tw + 14, 20, 6);
    ctx.fill();
    ctx.strokeStyle = hexA(color, 0.85);
    ctx.lineWidth = 1;
    roundRect(ctx, x, y, tw + 14, 20, 6);
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x + 7, y + 10.5);
  }

  private arrowHead(x1: number, y1: number, x2: number, y2: number, color: string) {
    const ctx = this.ctx;
    const ang = Math.atan2(y2 - y1, x2 - x1);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - 10 * Math.cos(ang - 0.42), y2 - 10 * Math.sin(ang - 0.42));
    ctx.lineTo(x2 - 10 * Math.cos(ang + 0.42), y2 - 10 * Math.sin(ang + 0.42));
    ctx.closePath();
    ctx.fill();
  }

  /* ------------------------------ interaction ----------------------------- */

  private bind() {
    this.canvas.addEventListener('pointerdown', this.onDown);
    this.canvas.addEventListener('pointermove', this.onMove);
    this.canvas.addEventListener('pointerup', this.onUp);
    this.canvas.addEventListener('pointerleave', this.onLeave);
    this.canvas.addEventListener('wheel', this.onWheel, { passive: false });
    this.canvas.addEventListener('keydown', this.onKey);
    this.canvas.addEventListener('dblclick', this.onDbl);
  }

  private unbind() {
    this.canvas.removeEventListener('pointerdown', this.onDown);
    this.canvas.removeEventListener('pointermove', this.onMove);
    this.canvas.removeEventListener('pointerup', this.onUp);
    this.canvas.removeEventListener('pointerleave', this.onLeave);
    this.canvas.removeEventListener('wheel', this.onWheel);
    this.canvas.removeEventListener('keydown', this.onKey);
    this.canvas.removeEventListener('dblclick', this.onDbl);
  }

  private evtPoint(e: PointerEvent | MouseEvent | WheelEvent) {
    const rect = this.canvas.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    return { px, py, x: this.pxToX(px), p: this.pxToP(py) };
  }

  private onDown = (e: PointerEvent) => {
    if (!this.interactive) return;
    this.canvas.focus();
    this.canvas.setPointerCapture(e.pointerId);
    const pt = this.evtPoint(e);

    if (e.button === 1 || this.tool === 'pan') {
      this.drag = { kind: 'pan', startX: pt.px, i0: this.view.i0, i1: this.view.i1 };
      return;
    }

    if (this.tool === 'trade') {
      const stage = this.tradeDraft?.stage ?? 1;
      if (stage === 1) {
        this.tradeDraft = { direction: 'buy', entry: pt.p, stage: 2 };
      } else if (stage === 2) {
        const d = this.tradeDraft!;
        d.sl = pt.p;
        d.direction = pt.p < d.entry ? 'buy' : 'sell';
        d.stage = 3;
      } else {
        const d = this.tradeDraft!;
        const td: TradeDraw = {
          id: drawId(),
          kind: 'trade',
          direction: d.direction,
          x: Math.max(0, pt.x),
          entry: d.entry,
          sl: d.sl!,
          tp: pt.p,
          tone: d.direction === 'buy' ? 'bull' : 'bear',
        };
        this.tradeDraft = null;
        this.addDrawing(td);
        this.events.onDrawingAdded?.(td);
        return;
      }
      this.requestRender();
      return;
    }

    if (this.tool === 'text') {
      if (this.textPrompt) {
        this.textPrompt({ x: pt.x, p: pt.p });
      } else {
        const td: TextDraw = {
          id: drawId(),
          kind: 'text',
          x: pt.x,
          p: pt.p,
          text: 'Note',
          tone: 'gold',
        };
        this.addDrawing(td);
      }
      return;
    }

    if (this.tool === 'hline') {
      const d: HLine = { id: drawId(), kind: 'hline', price: pt.p, tone: 'sky', style: 'dashed' };
      this.addDrawing(d);
      return;
    }

    if (this.tool === 'eraser') {
      const hit = this.hitTest(pt.px, pt.py);
      if (hit) this.removeDrawing(hit);
      return;
    }

    if (this.tool === 'trendline' || this.tool === 'rect' || this.tool === 'fib' || this.tool === 'arrow') {
      const base = { id: drawId(), x1: pt.x, p1: pt.p, x2: pt.x, p2: pt.p, tone: 'sky' as Tone };
      let draft: Drawing;
      if (this.tool === 'rect') {
        draft = { ...base, kind: 'rect', fill: 0.16 } as RectDraw;
      } else if (this.tool === 'fib') {
        draft = { ...base, kind: 'fib' } as FibDraw;
      } else if (this.tool === 'arrow') {
        draft = { ...base, kind: 'arrow' } as ArrowDraw;
      } else {
        draft = { ...base, kind: 'trendline' } as TrendLine;
      }
      this.drag = { kind: 'create', draft, sx: pt.px, sy: pt.py };
      return;
    }

    // cursor tool: select / move / pan
    const hit = this.hitTest(pt.px, pt.py);
    if (hit) {
      this.selectedId = hit;
      const orig = this.drawings.find((d) => d.id === hit)!;
      this.drag = { kind: 'move', id: hit, startX: pt.px, startY: pt.py, orig: { ...orig } };
      this.requestRender();
    } else {
      this.selectedId = null;
      this.drag = { kind: 'pan', startX: pt.px, i0: this.view.i0, i1: this.view.i1 };
      this.requestRender();
    }
  };

  private onMove = (e: PointerEvent) => {
    const pt = this.evtPoint(e);
    this.hover = { x: pt.x, p: pt.p, px: pt.px, py: pt.py };
    this.events.onHover?.({ x: pt.x, p: pt.p });

    if (this.drag?.kind === 'pan') {
      const dx = pt.px - this.drag.startX;
      const span = this.drag.i1 - this.drag.i0;
      const shift = (-dx / (this.w - PAD.left - PAD.right)) * span;
      this.view.i0 = this.drag.i0 + shift;
      this.view.i1 = this.drag.i1 + shift;
      this.clampView();
    } else if (this.drag?.kind === 'create') {
      const d = this.drag.draft as unknown as { x2: number; p2: number };
      d.x2 = pt.x;
      d.p2 = pt.p;
    } else if (this.drag?.kind === 'move') {
      const dragMove = this.drag;
      const d = this.drawings.find((x) => x.id === dragMove.id);
      if (d) {
        const dxI = (pt.px - dragMove.startX) / this.cw;
        const dp = -(pt.py - dragMove.startY) / this.ch;
        moveBy(d, dragMove.orig, dxI, dp);
      }
    }
    this.requestRender();
  };

  private onUp = (e: PointerEvent) => {
    const drag = this.drag;
    if (drag?.kind === 'create') {
      const d = drag.draft as unknown as { x1: number; p1: number; x2: number; p2: number };
      const valid = Math.abs(d.x2 - d.x1) > 0.4 || Math.abs(d.p2 - d.p1) > 0.2;
      if (valid) {
        this.pushUndo();
        this.drawings.push(drag.draft);
        this.events.onDrawingAdded?.(drag.draft);
        this.events.onDrawingsChanged?.(this.drawings);
      }
    } else if (drag?.kind === 'move') {
      // we mutated in place — build undo from the stored original
      this.undoStack.push(
        this.drawings.map((d) => (d.id === drag.id ? { ...drag.orig } : { ...d }))
      );
      if (this.undoStack.length > 60) this.undoStack.shift();
      this.redoStack = [];
      this.events.onDrawingsChanged?.(this.drawings);
    }
    this.drag = null;
    this.requestRender();
    try {
      this.canvas.releasePointerCapture(e.pointerId);
    } catch {
      /* noop */
    }
  };

  private onLeave = () => {
    this.hover = null;
    this.events.onHover?.(null);
    this.requestRender();
  };

  private onWheel = (e: WheelEvent) => {
    e.preventDefault();
    const pt = this.evtPoint(e);
    const factor = e.deltaY > 0 ? 1.12 : 0.89;
    const span = this.view.i1 - this.view.i0;
    const newSpan = Math.min(Math.max(12, this.data.length + 8), span * factor);
    const anchor = pt.x;
    this.view.i0 = anchor - ((anchor - this.view.i0) / span) * newSpan;
    this.view.i1 = this.view.i0 + newSpan;
    this.clampView();
    this.requestRender();
  };

  private onKey = (e: KeyboardEvent) => {
    if (e.key === 'Delete' || e.key === 'Backspace') {
      if (this.selectedId) {
        this.removeDrawing(this.selectedId);
        e.preventDefault();
      }
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
      e.shiftKey ? this.redo() : this.undo();
      e.preventDefault();
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
      this.redo();
      e.preventDefault();
    }
  };

  private onDbl = () => {
    this.fitView();
  };

  private hitTest(px: number, py: number): string | null {
    for (let i = this.drawings.length - 1; i >= 0; i--) {
      const d = this.drawings[i];
      if (this.hitOne(d, px, py)) return d.id;
    }
    return null;
  }

  private hitOne(d: Drawing, px: number, py: number): boolean {
    switch (d.kind) {
      case 'hline':
        return Math.abs(this.pToPx(d.price) - py) < 6;
      case 'trendline':
      case 'arrow': {
        const x1 = this.xToPx(d.x1);
        const y1 = this.pToPx(d.p1);
        const x2 = this.xToPx(d.x2);
        const y2 = this.pToPx(d.p2);
        return distToSeg(px, py, x1, y1, x2, y2) < 8;
      }
      case 'rect':
      case 'fib': {
        const x1 = this.xToPx(Math.min(d.x1, d.x2));
        const x2 = this.xToPx(Math.max(d.x1, d.x2));
        const y1 = this.pToPx(Math.max(d.p1, d.p2));
        const y2 = this.pToPx(Math.min(d.p1, d.p2));
        return px >= x1 - 4 && px <= x2 + 4 && py >= y1 - 4 && py <= y2 + 4;
      }
      case 'text': {
        const x = this.xToPx(d.x);
        const y = this.pToPx(d.p);
        return Math.abs(px - x) < 60 && Math.abs(py - y) < 16;
      }
      case 'trade': {
        const x1 = this.xToPx(d.x);
        const y1 = this.pToPx(Math.min(d.entry, d.sl, d.tp));
        const y2 = this.pToPx(Math.max(d.entry, d.sl, d.tp));
        return px >= x1 - 6 && px <= x1 + 200 && py >= y1 - 4 && py <= y2 + 4;
      }
    }
    return false;
  }

  private pushUndo() {
    this.undoStack.push(this.drawings.map((d) => ({ ...d })));
    if (this.undoStack.length > 60) this.undoStack.shift();
    this.redoStack = [];
  }

  /** Screen coords helper for external overlays (task targets) */
  project(x: number, p: number): { px: number; py: number } {
    return { px: this.xToPx(x), py: this.pToPx(p) };
  }
}

/* --------------------------------- utils --------------------------------- */

function moveBy(d: Drawing, orig: Drawing, dx: number, dp: number) {
  switch (d.kind) {
    case 'hline':
      d.price = (orig as HLine).price + dp;
      break;
    case 'text':
      d.x = (orig as TextDraw).x + dx;
      d.p = (orig as TextDraw).p + dp;
      break;
    case 'trade': {
      const o = orig as TradeDraw;
      d.entry = o.entry + dp;
      d.sl = o.sl + dp;
      d.tp = o.tp + dp;
      d.x = o.x + dx;
      break;
    }
    default: {
      const o = orig as TrendLine;
      d.x1 = o.x1 + dx;
      d.p1 = o.p1 + dp;
      d.x2 = o.x2 + dx;
      d.p2 = o.p2 + dp;
    }
  }
}

function distToSeg(px: number, py: number, x1: number, y1: number, x2: number, y2: number) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = dx * dx + dy * dy || 1;
  let t = ((px - x1) * dx + (py - y1) * dy) / len;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
}

function niceStep(raw: number) {
  const pow = Math.pow(10, Math.floor(Math.log10(Math.max(0.0001, raw))));
  const n = raw / pow;
  const step = n >= 5 ? 5 : n >= 2 ? 2 : 1;
  return step * pow;
}

function hexA(hex: string, a: number) {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}
