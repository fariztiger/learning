'use client';

/* Achievement engine — checks conditions and unlocks with toasts */

import { getProgress, progressActions } from './progress';
import { getAchievement } from '@/content/achievements';
import { ALL_LESSONS, levelLessonIds } from '@/content/curriculum';
import type { Lang } from './types';

export function emitToast(title: string, desc: string, kind: 'achievement' | 'info' = 'achievement') {
  window.dispatchEvent(new CustomEvent('tigerfx-toast', { detail: { title, desc, kind } }));
}

function unlock(id: string, lang: Lang) {
  const first = progressActions.unlock(id);
  if (first) {
    const a = getAchievement(id);
    if (a) {
      progressActions.addXp(a.xp, a.title[lang], 'achievement', id);
      emitToast(a.title[lang], a.desc[lang]);
    }
  }
}

export function afterLessonComplete(lessonId: string, lang: Lang) {
  const p = getProgress();
  unlock('first-lesson', lang);
  if (lessonId === 'l1-candles') unlock('candle-whisperer', lang);
  if (lessonId === 'l4-sizing') unlock('risk-guardian', lang);

  const l2done = levelLessonIds('l2').every((id) => p.lessons[id]?.done);
  if (l2done) unlock('structure-hunter', lang);

  const l3done = levelLessonIds('l3').every((id) => p.lessons[id]?.done);
  if (l3done) unlock('liquidity-master', lang);

  const allDone = ALL_LESSONS.every((l) => p.lessons[l.id]?.done);
  if (allDone) unlock('graduate', lang);

  if (p.streak.count >= 3) unlock('streak-3', lang);
  if (p.streak.count >= 7) unlock('streak-7', lang);
}

export function afterQuiz(perfect: boolean, lang: Lang) {
  if (perfect) unlock('quiz-ace', lang);
}

export function afterScenario(scenarioId: string, score: number, tier: string, lang: Lang) {
  if (score >= 60) unlock('arena-debut', lang);
  if (tier === 'certification' && score >= 70) unlock('certified', lang);
  if (tier === 'foundation') {
    const p = getProgress();
    const allFoundation = ['sc-support', 'sc-candle', 'sc-trend'].every((id) => p.scenarios[id]?.done);
    if (allFoundation) unlock('arena-champion', lang);
  }
  const st = getProgress().streak;
  if (st.count >= 3) unlock('streak-3', lang);
  if (st.count >= 7) unlock('streak-7', lang);
}

export function afterLangSwitch(lang: Lang) {
  unlock('bilingual', lang);
}
