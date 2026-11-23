'use client';

/* Local-first progress store with pub/sub + useSyncExternalStore.
   No signup required — everything persists in localStorage. */

import { useSyncExternalStore } from 'react';
import type { ProgressState } from './types';

const KEY = 'tigerfx.progress.v1';

const DAY = 86400000;

function emptyState(): ProgressState {
  return {
    version: 1,
    lang: 'en',
    xp: 0,
    lessons: {},
    scenarios: {},
    achievements: [],
    streak: { last: '', count: 0 },
    history: [],
    visits: 0,
  };
}

let state: ProgressState = emptyState();
const listeners = new Set<() => void>();
let loaded = false;

function emit() {
  listeners.forEach((l) => l());
}

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignore quota/private mode */
  }
}

function ensureLoaded() {
  if (loaded) return;
  loaded = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as ProgressState;
      state = { ...emptyState(), ...parsed, streak: { ...emptyState().streak, ...parsed.streak } };
    }
  } catch {
    state = emptyState();
  }
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export function bumpStreak() {
  const today = todayStr();
  if (state.streak.last === today) return;
  const yesterday = new Date(Date.now() - DAY).toISOString().slice(0, 10);
  state.streak = {
    last: today,
    count: state.streak.last === yesterday ? state.streak.count + 1 : 1,
  };
}

export const progressActions = {
  init() {
    ensureLoaded();
    state.visits += 1;
    bumpStreak();
    persist();
    emit();
  },
  setLang(lang: 'en' | 'ms') {
    ensureLoaded();
    state.lang = lang;
    persist();
    emit();
  },
  addXp(n: number, label: string, kind = 'xp', id = '') {
    ensureLoaded();
    state.xp += n;
    bumpStreak();
    state.history.unshift({ ts: Date.now(), kind, id, label });
    state.history = state.history.slice(0, 40);
    persist();
    emit();
  },
  updateLesson(id: string, patch: Partial<ProgressState['lessons'][string]>) {
    ensureLoaded();
    const prev = state.lessons[id] ?? { done: false, step: 0, quizBest: 0, quizTries: 0, updatedAt: 0 };
    state.lessons[id] = {
      ...prev,
      ...patch,
      updatedAt: Date.now(),
    };
    persist();
    emit();
  },
  completeLesson(id: string, xp: number, label: string) {
    ensureLoaded();
    const prev = state.lessons[id];
    if (!prev?.done) {
      state.xp += xp;
      bumpStreak();
      state.history.unshift({ ts: Date.now(), kind: 'lesson', id, label });
      state.history = state.history.slice(0, 40);
    }
    state.lessons[id] = {
      done: true,
      step: prev?.step ?? 0,
      quizBest: prev?.quizBest ?? 0,
      quizTries: prev?.quizTries ?? 0,
      updatedAt: Date.now(),
    };
    persist();
    emit();
  },
  recordScenario(id: string, score: number, xp: number, label: string) {
    ensureLoaded();
    const prev = state.scenarios[id] ?? { attempts: 0, best: 0, done: false };
    const first = !prev.done;
    state.scenarios[id] = {
      attempts: prev.attempts + 1,
      best: Math.max(prev.best, score),
      done: prev.done || score >= 60,
    };
    if (first && score >= 60) {
      state.xp += xp;
      bumpStreak();
      state.history.unshift({ ts: Date.now(), kind: 'scenario', id, label });
      state.history = state.history.slice(0, 40);
    }
    persist();
    emit();
  },
  unlock(id: string) {
    ensureLoaded();
    if (!state.achievements.includes(id)) {
      state.achievements.push(id);
      persist();
      emit();
      return true;
    }
    return false;
  },
  setLastLesson(id: string) {
    ensureLoaded();
    state.lastLesson = id;
    persist();
    emit();
  },
  reset() {
    state = emptyState();
    persist();
    emit();
  },
  exportJson() {
    ensureLoaded();
    return JSON.stringify(state, null, 2);
  },
  importJson(json: string) {
    try {
      const parsed = JSON.parse(json) as ProgressState;
      if (typeof parsed.xp !== 'number' || typeof parsed.lessons !== 'object') return false;
      state = { ...emptyState(), ...parsed };
      persist();
      emit();
      return true;
    } catch {
      return false;
    }
  },
};

export function useProgress(): ProgressState {
  return useSyncExternalStore(
    (cb) => {
      ensureLoaded();
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => {
      ensureLoaded();
      return state;
    },
    () => state
  );
}

export function getProgress(): ProgressState {
  ensureLoaded();
  return state;
}

/* -------------------------------- helpers -------------------------------- */

export function lessonCompletion(p: ProgressState, lessonIds: string[]): number {
  if (lessonIds.length === 0) return 0;
  const done = lessonIds.filter((id) => p.lessons[id]?.done).length;
  return done / lessonIds.length;
}

export function levelRank(xp: number): { level: number; title: string; into: number; need: number } {
  const ranks = [
    { min: 0, title: 'Cub' },
    { min: 250, title: 'Scout' },
    { min: 600, title: 'Analyst' },
    { min: 1100, title: 'Strategist' },
    { min: 1800, title: 'Operator' },
    { min: 2600, title: 'Top Trader' },
    { min: 3600, title: 'Market Master' },
  ];
  let idx = 0;
  for (let i = 0; i < ranks.length; i++) if (xp >= ranks[i].min) idx = i;
  const into = xp - ranks[idx].min;
  const need = idx + 1 < ranks.length ? ranks[idx + 1].min - ranks[idx].min : 1;
  return { level: idx + 1, title: ranks[idx].title, into, need };
}
