/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type {
  CEFRLevel,
  EnglishAccent,
  LearningGoal,
  LearningMode,
  SkillLevels,
} from '../types/learning.ts';

export interface ProfilePreset {
  id: string;
  titleAr: string;
  descriptionAr: string;
  estimatedLevel: CEFRLevel;
  skills: SkillLevels;
  primaryGoal: LearningGoal;
  dailyGoalMinutes: number;
  learningMode: LearningMode;
  preferredAccent: EnglishAccent;
  activeFocusAreas: string[];
  arabicDialect?: 'fusha' | 'gulf' | 'egyptian' | 'levantine' | 'maghrebi';
  industryInterests: string[];
  speechPace: number;
}

export const PROFILE_PRESETS: ProfilePreset[] = [
  {
    id: 'preset-zero-starter',
    titleAr: 'تأسيس من الصفر المطلق',
    descriptionAr: 'مسار مخصص للبدء بالحروف والمخارج الصوتية وأساسيات تكوين الجمل البسيطة.',
    estimatedLevel: 'A0',
    skills: {
      grammar: 'A0',
      vocabulary: 'A0',
      reading: 'A0',
      listening: 'A0',
      speaking: 'A0',
      writing: 'A0',
    },
    primaryGoal: 'basics',
    dailyGoalMinutes: 15,
    learningMode: 'arabic_assisted',
    preferredAccent: 'US',
    activeFocusAreas: ['p_vs_b', 'alphabet_phonics', 'survival_phrases'],
    arabicDialect: 'fusha',
    industryInterests: ['daily'],
    speechPace: 0.8,
  },
  {
    id: 'preset-daily-speaker',
    titleAr: 'الطلاقة اليومية والتحدث الحي',
    descriptionAr: 'التركيز على المحادثات اليومية السلسة وكسر حاجز الخوف من التحدث بالإنجليزية.',
    estimatedLevel: 'A2',
    skills: {
      grammar: 'A2',
      vocabulary: 'A2',
      reading: 'A2',
      listening: 'B1',
      speaking: 'A2',
      writing: 'A1',
    },
    primaryGoal: 'fluent_speaking',
    dailyGoalMinutes: 20,
    learningMode: 'arabic_assisted',
    preferredAccent: 'US',
    activeFocusAreas: ['daily_conversation', 'phrasal_verbs', 'confidence'],
    arabicDialect: 'fusha',
    industryInterests: ['daily', 'travel'],
    speechPace: 0.9,
  },
  {
    id: 'preset-business-pro',
    titleAr: 'إنجليزية الأعمال والشركات',
    descriptionAr: 'احتراف الاجتماعات، العروض التقديمية، والمراسلات المهنية باللغة الإنجليزية.',
    estimatedLevel: 'B2',
    skills: {
      grammar: 'B2',
      vocabulary: 'B2',
      reading: 'B2',
      listening: 'B2',
      speaking: 'B2',
      writing: 'B2',
    },
    primaryGoal: 'career_business',
    dailyGoalMinutes: 25,
    learningMode: 'immersion',
    preferredAccent: 'US',
    activeFocusAreas: ['business_negotiation', 'email_etiquette', 'executive_presence'],
    arabicDialect: 'fusha',
    industryInterests: ['business', 'tech'],
    speechPace: 0.95,
  },
  {
    id: 'preset-academic-ielts',
    titleAr: 'الإعداد لاختبارات آيلتس وتوفل',
    descriptionAr: 'تطوير القراءة التحليلية، الكتابة الأكاديمية الرسمية، والمفردات المتقدمة.',
    estimatedLevel: 'B2',
    skills: {
      grammar: 'B2',
      vocabulary: 'C1',
      reading: 'C1',
      listening: 'B2',
      speaking: 'B2',
      writing: 'B2',
    },
    primaryGoal: 'ielts_toefl',
    dailyGoalMinutes: 30,
    learningMode: 'immersion',
    preferredAccent: 'UK',
    activeFocusAreas: ['ielts_task2', 'academic_collocations', 'coherence'],
    arabicDialect: 'fusha',
    industryInterests: ['academic'],
    speechPace: 1.0,
  },
  {
    id: 'preset-c2-mastery',
    titleAr: 'البلاغة والنثر الإنجليزي الرفيع',
    descriptionAr: 'إتقان الفروق الدلالية الدقيقة، الأدوات البلاغية كالتوازي، والأسلوب الدبلوماسي.',
    estimatedLevel: 'C2',
    skills: {
      grammar: 'C2',
      vocabulary: 'C2',
      reading: 'C2',
      listening: 'C2',
      speaking: 'C2',
      writing: 'C2',
    },
    primaryGoal: 'academic',
    dailyGoalMinutes: 20,
    learningMode: 'immersion',
    preferredAccent: 'UK',
    activeFocusAreas: ['rhetoric', 'litotes', 'parallelism', 'stylistic_polish'],
    arabicDialect: 'fusha',
    industryInterests: ['academic', 'business'],
    speechPace: 1.0,
  },
];
