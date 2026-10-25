/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { Lesson, Exercise } from '../types/learning.ts';

export async function generateLessonExercises(lesson: Lesson): Promise<Exercise[]> {
  try {
    const res = await fetch('/api/gemini/generate-challenges', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        activity: 'sentence_builder',
        level: lesson.level,
        topic: lesson.titleEn,
        recentPrompts: lesson.exercises.map((e) => e.question),
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.challenges) && data.challenges.length > 0) {
        const aiExercises: Exercise[] = data.challenges.map((c: any, idx: number) => ({
          id: `ai-gen-ex-${lesson.id}-${idx}-${Date.now()}`,
          type: 'sentence_scramble',
          instructionAr: `رتّب الكلمات الإنجليزية لتكوين جملة تعبر عن: "${c.promptAr}"`,
          instructionEn: 'Arrange the tiles to form the correct sentence:',
          question: c.wordTiles?.join(' / ') || c.correctSentence,
          correctAnswer: c.correctSentence,
          explanationAr: c.explanationAr || 'جملة صحيحة قواعدياً ومناسبة لسياق الدرس.',
          grammarFocusAr: c.grammarFocusAr || lesson.rulesAndStructuresAr,
        }));
        return [...lesson.exercises, ...aiExercises];
      }
    }
  } catch (err) {
    console.warn('AI exercise generation fallback to lesson defaults:', err);
  }

  return lesson.exercises || [];
}
