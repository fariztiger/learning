import type { Candle, S, SceneSpec, SceneState, Step } from '@/lib/types';

/** terse bilingual string helper */
export const s = (en: string, ms: string): S => ({ en, ms });

/** scene builder helper */
export function scene(id: string, candles: Candle[], steps: { caption: S; state: SceneState }[]): SceneSpec {
  return { id, candles, steps };
}

export const q = (
  question: S,
  options: { text: S; correct?: boolean; why: S }[],
  multi = false
): Step => ({ kind: 'quiz', question, options, multi });

export const txt = (title: S, body: S, extra?: { bullets?: S[]; callout?: { tone: 'risk' | 'tip' | 'key' | 'note'; text: S } }): Step => ({
  kind: 'text',
  title,
  body,
  ...extra,
});

export const scn = (title: S, spec: SceneSpec): Step => ({ kind: 'scene', title, scene: spec });

export const widget = (
  w: Extract<Step, { kind: 'widget' }>['widget'],
  title: S,
  caption: S
): Step => ({ kind: 'widget', widget: w, title, caption });
