/* TIGERFX Academy — shared types */

export type Lang = 'en' | 'ms';

/** Bilingual string */
export interface S {
  en: string;
  ms: string;
}

export interface Candle {
  /** logical time index (minutes from series start) */
  t: number;
  o: number;
  h: number;
  l: number;
  c: number;
}

/* ---------------------------------- chart --------------------------------- */

export type Tool =
  | 'cursor'
  | 'pan'
  | 'hline'
  | 'trendline'
  | 'rect'
  | 'fib'
  | 'arrow'
  | 'text'
  | 'trade'
  | 'eraser';

export type Tone = 'gold' | 'bull' | 'bear' | 'sky' | 'violet' | 'mist';

export interface DrawBase {
  id: string;
  kind: string;
  tone?: Tone;
  label?: string;
  locked?: boolean;
}

export interface HLine extends DrawBase {
  kind: 'hline';
  price: number;
  style?: 'solid' | 'dashed';
}

export interface TrendLine extends DrawBase {
  kind: 'trendline';
  x1: number;
  p1: number;
  x2: number;
  p2: number;
}

export interface RectDraw extends DrawBase {
  kind: 'rect';
  x1: number;
  p1: number;
  x2: number;
  p2: number;
  fill?: number;
}

export interface FibDraw extends DrawBase {
  kind: 'fib';
  x1: number;
  p1: number;
  x2: number;
  p2: number;
}

export interface ArrowDraw extends DrawBase {
  kind: 'arrow';
  x1: number;
  p1: number;
  x2: number;
  p2: number;
}

export interface TextDraw extends DrawBase {
  kind: 'text';
  x: number;
  p: number;
  text: string;
}

export interface TradeDraw extends DrawBase {
  kind: 'trade';
  direction: 'buy' | 'sell';
  x: number;
  entry: number;
  sl: number;
  tp: number;
}

export type Drawing =
  | HLine
  | TrendLine
  | RectDraw
  | FibDraw
  | ArrowDraw
  | TextDraw
  | TradeDraw;

/* ---------------------------------- scene --------------------------------- */

export interface SceneHighlight {
  from: number;
  to: number;
  label?: S;
  tone?: Tone;
  pFrom?: number;
  pTo?: number;
}

export interface SceneNote {
  x: number;
  p: number;
  text: S;
  tone?: Tone;
}

export interface SceneState {
  /** last candle index visible */
  revealTo: number;
  highlights?: SceneHighlight[];
  notes?: SceneNote[];
  drawings?: (Drawing | (Omit<Drawing, 'id' | 'label'> & { label?: S }))[];
  view?: { i0: number; i1: number; pMin?: number; pMax?: number };
}

export interface SceneStep {
  caption: S;
  state: SceneState;
}

export interface SceneSpec {
  id: string;
  candles: Candle[];
  steps: SceneStep[];
  /** hidden until step passes: used for honest replay */
  answers?: { revealAt: number; drawings: Drawing[] };
}

/* -------------------------------- content --------------------------------- */

export interface Callout {
  tone: 'risk' | 'tip' | 'key' | 'note';
  text: S;
}

export type Step =
  | {
      kind: 'text';
      title: S;
      body: S;
      bullets?: S[];
      callout?: Callout;
    }
  | {
      kind: 'scene';
      title: S;
      scene: SceneSpec;
    }
  | {
      kind: 'quiz';
      question: S;
      options: { text: S; correct?: boolean; why: S }[];
      multi?: boolean;
    }
  | {
      kind: 'chartTask';
      title: S;
      instruction: S;
      candles: Candle[];
      target: { x: number; p: number; r: number; label: S };
      hint: S;
      success: S;
      miss: S;
    }
  | {
      kind: 'widget';
      widget:
        | 'candle-anatomy'
        | 'risk-calc'
        | 'session-clock'
        | 'rr-calc'
        | 'structure-builder'
        | 'sweep-spotter'
        | 'fvg-finder'
        | 'mtf-lab'
        | 'news-planner';
      title: S;
      caption: S;
    };

export interface Lesson {
  id: string;
  levelId: string;
  title: S;
  summary: S;
  minutes: number;
  xp: number;
  skills: string[];
  steps: Step[];
  /** extra lesson in the assessment track */
  assessment?: boolean;
}

export interface Level {
  id: string;
  index: number;
  title: S;
  tagline: S;
  description: S;
  color: string;
  lessons: Lesson[];
}

/* ------------------------------- scenarios -------------------------------- */

export type ScenarioTask =
  | {
      type: 'decide';
      question: S;
      options: { id: 'buy' | 'sell' | 'no-trade'; label: S }[];
      correct: 'buy' | 'sell' | 'no-trade';
      explain: { [k in 'buy' | 'sell' | 'no-trade']: S };
    }
  | {
      type: 'identify';
      question: S;
      targets: { x: number; p: number; r: number; label: S }[];
      minHits: number;
      explain: S;
    }
  | {
      type: 'place-trade';
      question: S;
      key: {
        direction: 'buy' | 'sell';
        entryFrom: number;
        entryTo: number;
        slFrom: number;
        slTo: number;
        tpFrom: number;
        tpTo: number;
        minR: number;
      };
      explain: S;
    };

export interface Scenario {
  id: string;
  tier: 'foundation' | 'intermediate' | 'advanced' | 'certification';
  levelId: string;
  title: S;
  context: S;
  candles: Candle[];
  revealTo: number;
  task: ScenarioTask;
  xp: number;
}

/* -------------------------------- progress -------------------------------- */

export interface LessonProgress {
  done: boolean;
  step: number;
  quizBest: number;
  quizTries: number;
  updatedAt: number;
}

export interface ProgressState {
  version: number;
  lang: Lang;
  xp: number;
  lessons: Record<string, LessonProgress>;
  scenarios: Record<string, { attempts: number; best: number; done: boolean }>;
  achievements: string[];
  streak: { last: string; count: number };
  history: { ts: number; kind: string; id: string; label: string }[];
  visits: number;
  lastLesson?: string;
}
