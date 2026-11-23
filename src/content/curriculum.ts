/* Curriculum assembler */
import type { Level, Lesson } from '@/lib/types';
import { level1 } from './levels/level1';
import { level2 } from './levels/level2';
import { level3 } from './levels/level3';
import { level4 } from './levels/level4';
import { level5 } from './levels/level5';

export const LEVELS: Level[] = [level1, level2, level3, level4, level5];

export const ALL_LESSONS: Lesson[] = LEVELS.flatMap((l) => l.lessons);

export function getLevel(id: string): Level | undefined {
  return LEVELS.find((l) => l.id === id);
}

export function getLesson(levelId: string, lessonId: string): Lesson | undefined {
  return getLevel(levelId)?.lessons.find((l) => l.id === lessonId);
}

export function getLessonById(lessonId: string): Lesson | undefined {
  return ALL_LESSONS.find((l) => l.id === lessonId);
}

export function nextLesson(lessonId: string): { level: Level; lesson: Lesson } | null {
  const idx = ALL_LESSONS.findIndex((l) => l.id === lessonId);
  if (idx < 0 || idx + 1 >= ALL_LESSONS.length) return null;
  const lesson = ALL_LESSONS[idx + 1];
  const level = getLevel(lesson.levelId)!;
  return { level, lesson };
}

export function levelLessonIds(levelId: string): string[] {
  return (getLevel(levelId)?.lessons ?? []).map((l) => l.id);
}

export const TOTAL_LESSONS = ALL_LESSONS.length;
export const TOTAL_MINUTES = ALL_LESSONS.reduce((s, l) => s + l.minutes, 0);
export const TOTAL_XP = ALL_LESSONS.reduce((s, l) => s + l.xp, 0);
