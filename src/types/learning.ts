/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type CEFRLevel = 'A0' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type EnglishAccent = 'US' | 'UK';

export type LearningGoal =
  | 'fluent_speaking'
  | 'career_business'
  | 'ielts_toefl'
  | 'travel'
  | 'academic'
  | 'basics';

export type LearningMode = 'arabic_assisted' | 'immersion' | 'bilingual';

export interface SkillLevels {
  grammar: CEFRLevel;
  vocabulary: CEFRLevel;
  reading: CEFRLevel;
  listening: CEFRLevel;
  speaking: CEFRLevel;
  writing: CEFRLevel;
}

export interface MistakeRecord {
  id: string;
  original: string;
  corrected: string;
  naturalAlternative?: string;
  errorTypeAr?: string;
  explanationAr: string;
  source?: string;
  createdAt: string;
}

export interface UserBadge {
  id: string;
  titleAr: string;
  descriptionAr: string;
  unlockedAt: string;
}

export interface VocabularyItem {
  id: string;
  word: string;
  ipa?: string;
  arabicPhonetic?: string;
  partOfSpeech?: string;
  arabicMeaning: string;
  englishDefinition?: string;
  exampleEn?: string;
  exampleAr?: string;
  collocations?: string[];
  arabicMistakeWarning?: string;
  level?: CEFRLevel;
  category?: string;
  repetitions: number;
  intervalDays: number;
  easeFactor: number;
  nextReviewDate: string;
  lastReviewed?: string;
  mastered: boolean;
  isAiGenerated?: boolean;
}

export interface ExampleItem {
  en: string;
  ar: string;
  phoneticAr?: string;
  noteAr?: string;
}

export interface LessonVocabItem {
  word: string;
  ipa?: string;
  partOfSpeech?: string;
  meaningAr: string;
  exampleEn?: string;
  exampleAr?: string;
}

export interface CommonMistakeItem {
  wrong: string;
  correct: string;
  reasonAr: string;
}

export interface ArabicContrastPoint {
  titleAr: string;
  descriptionAr: string;
  badArabicHabit: string;
  correctEnglishWay: string;
}

export interface Exercise {
  id: string;
  type: 'multiple_choice' | 'fill_blank' | 'sentence_scramble' | 'error_hunt' | 'arabic_to_english';
  instructionAr: string;
  instructionEn?: string;
  question: string;
  options?: string[];
  correctAnswer: number | string | string[];
  explanationAr: string;
  grammarFocusAr?: string;
}

export interface Lesson {
  id: string;
  level: CEFRLevel;
  order: number;
  chapterOrder: number;
  chapterTitleAr: string;
  chapterTitleEn: string;
  titleAr: string;
  titleEn: string;
  category: string;
  iconName: string;
  estimatedMinutes: number;
  objectivesAr: string[];
  explanationMarkdownAr: string;
  rulesAndStructuresAr: string;
  summaryAr: string;
  arabicContrastPoint?: ArabicContrastPoint;
  examples: ExampleItem[];
  vocabulary: LessonVocabItem[];
  commonMistakes: CommonMistakeItem[];
  realWorldChallengeAr: string;
  exercises: Exercise[];
}

export interface ReadingPassage {
  id: string;
  titleAr: string;
  titleEn: string;
  level: CEFRLevel;
  topic: string;
  textEn: string;
  translationAr: string;
  sentencePairs?: { en: string; ar: string }[];
  comprehensionQuestions: {
    id: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanationAr: string;
  }[];
  isAiGenerated?: boolean;
}

export interface UserProgress {
  hasCompletedOnboarding: boolean;
  name: string;
  estimatedLevel: CEFRLevel;
  skills: SkillLevels;
  primaryGoal: LearningGoal;
  dailyGoalMinutes: number;
  learningMode: LearningMode;
  preferredAccent: EnglishAccent;
  activeFocusAreas: string[];
  arabicDialect?: 'fusha' | 'gulf' | 'egyptian' | 'levantine' | 'maghrebi';
  industryInterests?: string[];
  soundEffectsEnabled: boolean;
  theme: 'light' | 'dark';
  speechPace: number;
  xp: number;
  streakDays: number;
  lastActiveDate: string;
  completedLessonIds: string[];
  savedVocabulary: VocabularyItem[];
  todayMinutesSpent: number;
  personalMistakes: MistakeRecord[];
  completedWorkoutsCount: number;
  badges: UserBadge[];
  avatarUrl?: string;
}

export const LEVEL_PACE_MAP: Record<CEFRLevel, number> = {
  A0: 0.8,
  A1: 0.85,
  A2: 0.9,
  B1: 0.95,
  B2: 1.0,
  C1: 1.0,
  C2: 1.05,
};
