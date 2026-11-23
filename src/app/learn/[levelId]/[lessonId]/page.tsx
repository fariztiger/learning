'use client';

import { notFound } from 'next/navigation';
import { getLesson, getLevel } from '@/content/curriculum';
import { LessonPlayer } from '@/components/learn/LessonPlayer';

export default function LessonPage({
  params,
}: {
  params: { levelId: string; lessonId: string };
}) {
  const lesson = getLesson(params.levelId, params.lessonId);
  const level = getLevel(params.levelId);
  if (!lesson || !level) return notFound();
  return <LessonPlayer level={level} lesson={lesson} />;
}
