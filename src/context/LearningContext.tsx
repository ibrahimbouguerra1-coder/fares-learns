import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import type {
  CEFRLevel,
  EnglishAccent,
  LearningGoal,
  LearningMode,
  MistakeRecord,
  SkillLevels,
  UserProgress,
  VocabularyItem,
  Lesson,
} from '../types/learning.ts';
import { LEVEL_PACE_MAP } from '../types/learning.ts';
import { INITIAL_VOCABULARY } from '../data/vocabulary.ts';
import { CURATED_VOCAB_DECKS } from '../data/vocabularyDecks.ts';
import { PROFILE_PRESETS } from '../data/profilePresets.ts';
import {
  auth,
  onAuthStateChanged,
  loginWithGoogle,
  loginAnonymously,
  logoutUser,
  syncProgressToCloud,
  fetchProgressFromCloud,
} from '../services/firebase.ts';

const STORAGE_KEY = 'fares_english_learner_state_v1';
const LEGACY_STORAGE_KEY = 'bayan_english_learner_state_v3';

const DEFAULT_SKILLS: SkillLevels = {
  grammar: 'A0',
  vocabulary: 'A0',
  reading: 'A0',
  listening: 'A0',
  speaking: 'A0',
  writing: 'A0',
};

const INITIAL_MISTAKES: MistakeRecord[] = [
  {
    id: 'mistake-seed-1',
    original: 'I am agree with your opinion.',
    corrected: 'I agree with your opinion.',
    naturalAlternative: 'I completely agree with your point.',
    errorTypeAr: 'فعل الكينونة الزائد مع agree',
    explanationAr: 'الفعل agree فعل صريح في الإنجليزية ولا يحتاج إلى فعل الكينونة am قبله.',
    source: 'المحادثة الذكية',
    createdAt: new Date().toISOString(),
  },
];

const DEFAULT_PROGRESS: UserProgress = {
  hasCompletedOnboarding: false,
  name: 'متعلم جديد',
  estimatedLevel: 'A0',
  skills: DEFAULT_SKILLS,
  primaryGoal: 'fluent_speaking',
  dailyGoalMinutes: 15,
  learningMode: 'arabic_assisted',
  preferredAccent: 'US',
  activeFocusAreas: ['p_vs_b', 'verb_to_be_omission', 'present_perfect', 'prepositions', 'phrasal_verbs'],
  arabicDialect: 'fusha',
  industryInterests: ['tech', 'business', 'daily'],
  soundEffectsEnabled: true,
  theme: 'light',
  speechPace: 0.9,
  xp: 0,
  streakDays: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
  completedLessonIds: [],
  savedVocabulary: INITIAL_VOCABULARY,
  todayMinutesSpent: 0,
  personalMistakes: INITIAL_MISTAKES,
  completedWorkoutsCount: 0,
  badges: [
    {
      id: 'welcome',
      titleAr: 'بداية الرحلة',
      descriptionAr: 'الانضمام لمنصة فارس لتعليم الإنجليزية',
      unlockedAt: new Date().toISOString(),
    },
  ],
};

interface LearningContextType {
  progress: UserProgress;
  isLoading: boolean;
  completeOnboarding: (data: {
    name: string;
    level: CEFRLevel;
    skills: SkillLevels;
    goal: LearningGoal;
    dailyMinutes: number;
    mode: LearningMode;
    accent: EnglishAccent;
    focusAreas: string[];
    arabicDialect?: 'fusha' | 'gulf' | 'egyptian' | 'levantine' | 'maghrebi';
    industryInterests?: string[];
  }) => void;
  updateUserProfile: (data: Partial<UserProgress>) => void;
  toggleTheme: () => void;
  markLessonComplete: (lessonId: string, earnedXp?: number) => void;
  toggleLessonCompletion: (lessonId: string) => void;
  reviewVocabulary: (vocabId: string, rating: 'again' | 'hard' | 'good' | 'easy') => void;
  addVocabularyItem: (item: Partial<VocabularyItem> & { word: string; arabicMeaning: string }) => void;
  removeVocabularyItem: (vocabId: string) => void;
  addMistakeRecord: (record: Omit<MistakeRecord, 'id' | 'createdAt'>) => void;
  recordPersonalMistake: (record: Omit<MistakeRecord, 'id' | 'createdAt'>) => void;
  removeMistakeRecord: (id: string) => void;
  recordWorkoutCompletion: () => void;
  loadCuratedDeck: (deckId: string, mode?: 'merge' | 'replace') => void;
  applyProfilePreset: (presetId: string) => void;
  resetSpecificData: (options: { resetVocab?: boolean; resetLessons?: boolean; resetXp?: boolean; resetMistakes?: boolean }) => void;
  setLearningMode: (mode: LearningMode) => void;
  setPreferredAccent: (accent: EnglishAccent) => void;
  awardXp: (amount: number, badgeTitleAr?: string) => void;
  resetProgress: () => void;
  exportData: () => string;
  importData: (jsonString: string) => boolean;
  currentUser: User | null;
  isSyncing: boolean;
  isCloudSynced: boolean;
  loginGoogle: () => Promise<void>;
  loginGuest: () => Promise<void>;
  logout: () => Promise<void>;
  syncNow: () => Promise<boolean>;
}

const LearningContext = createContext<LearningContextType | undefined>(undefined);

function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

export const LearningProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<UserProgress>(DEFAULT_PROGRESS);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isCloudSynced, setIsCloudSynced] = useState<boolean>(false);

  // Monitor Firebase Auth state & sync progress
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        setIsSyncing(true);
        try {
          const cloudProgress = await fetchProgressFromCloud(user.uid);
          if (cloudProgress) {
            setProgress((local) => {
              const mergedLessons = Array.from(
                new Set([...(local.completedLessonIds || []), ...(cloudProgress.completedLessonIds || [])])
              );
              const mergedXp = Math.max(local.xp || 0, cloudProgress.xp || 0);
              const mergedStreak = Math.max(local.streakDays || 1, cloudProgress.streakDays || 1);
              return {
                ...local,
                ...cloudProgress,
                name: cloudProgress.name || user.displayName || local.name,
                completedLessonIds: mergedLessons,
                xp: mergedXp,
                streakDays: mergedStreak,
              };
            });
            setIsCloudSynced(true);
          } else {
            // First time this user logs in; sync current local progress up to cloud
            await syncProgressToCloud(user.uid, progress);
            setIsCloudSynced(true);
          }
        } catch (err) {
          console.warn('Initial cloud progress fetch error:', err);
        } finally {
          setIsSyncing(false);
        }
      } else {
        setIsCloudSynced(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (!parsed.savedVocabulary || parsed.savedVocabulary.length === 0) {
          parsed.savedVocabulary = INITIAL_VOCABULARY;
        }
        if (!Array.isArray(parsed.personalMistakes)) {
          parsed.personalMistakes = INITIAL_MISTAKES;
        }
        if (typeof parsed.speechPace !== 'number') {
          parsed.speechPace = 0.95;
        }
        const todayStr = getTodayDateString();
        const lastDateStr = (parsed.lastActiveDate || '').split('T')[0];
        if (lastDateStr && lastDateStr !== todayStr) {
          const lastDate = new Date(lastDateStr);
          const todayDate = new Date(todayStr);
          const diffDays = Math.round((todayDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));
          if (diffDays === 1) {
            parsed.streakDays = (parsed.streakDays || 1) + 1;
          } else if (diffDays > 1) {
            parsed.streakDays = 1;
          }
          parsed.todayMinutesSpent = 1;
          parsed.lastActiveDate = todayStr;
        }
        setProgress({ ...DEFAULT_PROGRESS, ...parsed });
      }
    } catch (e) {
      console.warn('Failed to load stored progress:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save to local storage immediately and debounce sync to Firestore
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
      } catch (e) {
        console.warn('Failed to persist progress to localStorage:', e);
      }

      if (currentUser) {
        const timer = setTimeout(async () => {
          try {
            setIsSyncing(true);
            const ok = await syncProgressToCloud(currentUser.uid, progress);
            if (ok) setIsCloudSynced(true);
          } catch (e) {
            console.warn('Debounced cloud sync error:', e);
          } finally {
            setIsSyncing(false);
          }
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [progress, isLoading, currentUser]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        setProgress((prev) => ({
          ...prev,
          todayMinutesSpent: (prev.todayMinutesSpent || 0) + 1,
          lastActiveDate: getTodayDateString(),
        }));
      }
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [progress.theme]);

  const toggleTheme = () => {
    setProgress((prev) => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark',
    }));
  };

  const updateUserProfile = (data: Partial<UserProgress>) => {
    setProgress((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const completeOnboarding = (data: {
    name: string;
    level: CEFRLevel;
    skills: SkillLevels;
    goal: LearningGoal;
    dailyMinutes: number;
    mode: LearningMode;
    accent: EnglishAccent;
    focusAreas: string[];
    arabicDialect?: 'fusha' | 'gulf' | 'egyptian' | 'levantine' | 'maghrebi';
    industryInterests?: string[];
  }) => {
    setProgress((prev) => ({
      ...prev,
      hasCompletedOnboarding: true,
      name: data.name || prev.name,
      estimatedLevel: data.level,
      skills: data.skills,
      primaryGoal: data.goal,
      dailyGoalMinutes: data.dailyMinutes,
      learningMode: data.mode,
      preferredAccent: data.accent,
      activeFocusAreas: data.focusAreas,
      arabicDialect: data.arabicDialect || prev.arabicDialect,
      industryInterests: data.industryInterests || prev.industryInterests,
      speechPace: LEVEL_PACE_MAP[data.level] || 0.95,
    }));
  };

  const markLessonComplete = (lessonId: string, earnedXp: number = 30) => {
    setProgress((prev) => {
      const alreadyDone = prev.completedLessonIds.includes(lessonId);
      const newCompleted = alreadyDone
        ? prev.completedLessonIds
        : [...prev.completedLessonIds, lessonId];
      return {
        ...prev,
        completedLessonIds: newCompleted,
        xp: (prev.xp || 0) + (alreadyDone ? 5 : earnedXp),
        todayMinutesSpent: (prev.todayMinutesSpent || 0) + 3,
      };
    });
  };

  const toggleLessonCompletion = (lessonId: string) => {
    setProgress((prev) => {
      const isCompleted = prev.completedLessonIds.includes(lessonId);
      const newCompleted = isCompleted
        ? prev.completedLessonIds.filter((id) => id !== lessonId)
        : [...prev.completedLessonIds, lessonId];
      return {
        ...prev,
        completedLessonIds: newCompleted,
      };
    });
  };

  const reviewVocabulary = (vocabId: string, rating: 'again' | 'hard' | 'good' | 'easy') => {
    setProgress((prev) => {
      const updatedList = prev.savedVocabulary.map((item) => {
        if (item.id !== vocabId) return item;
        let { repetitions, intervalDays, easeFactor } = item;
        easeFactor = easeFactor || 2.5;
        let nextInterval = 1;
        let mastered = item.mastered;

        switch (rating) {
          case 'again':
            repetitions = 0;
            nextInterval = 1;
            easeFactor = Math.max(1.3, easeFactor - 0.2);
            mastered = false;
            break;
          case 'hard':
            repetitions += 1;
            nextInterval = Math.max(1, Math.round(intervalDays * 1.2));
            easeFactor = Math.max(1.3, easeFactor - 0.15);
            break;
          case 'good':
            repetitions += 1;
            if (repetitions === 1) nextInterval = 1;
            else if (repetitions === 2) nextInterval = 3;
            else nextInterval = Math.round(intervalDays * easeFactor);
            break;
          case 'easy':
            repetitions += 1;
            if (repetitions === 1) nextInterval = 3;
            else if (repetitions === 2) nextInterval = 7;
            else nextInterval = Math.round(intervalDays * easeFactor * 1.3);
            easeFactor = easeFactor + 0.15;
            if (repetitions >= 4) mastered = true;
            break;
        }

        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + nextInterval);

        return {
          ...item,
          repetitions,
          intervalDays: nextInterval,
          easeFactor,
          nextReviewDate: nextDate.toISOString(),
          lastReviewed: new Date().toISOString(),
          mastered,
        };
      });

      return {
        ...prev,
        savedVocabulary: updatedList,
      };
    });
  };

  const addVocabularyItem = (item: Partial<VocabularyItem> & { word: string; arabicMeaning: string }) => {
    setProgress((prev) => {
      const exists = prev.savedVocabulary.some((v) => v.word.toLowerCase() === item.word.toLowerCase());
      if (exists) {
        return {
          ...prev,
          savedVocabulary: prev.savedVocabulary.map((v) =>
            v.word.toLowerCase() === item.word.toLowerCase()
              ? {
                  ...v,
                  arabicMeaning: item.arabicMeaning || v.arabicMeaning,
                  ipa: item.ipa || v.ipa,
                  exampleEn: item.exampleEn || v.exampleEn,
                  collocations: item.collocations || v.collocations,
                }
              : v
          ),
        };
      }

      const newItem: VocabularyItem = {
        id: `vocab-custom-${Date.now()}`,
        word: item.word,
        ipa: item.ipa || '',
        arabicPhonetic: item.arabicPhonetic,
        partOfSpeech: item.partOfSpeech || 'noun',
        arabicMeaning: item.arabicMeaning,
        englishDefinition: item.englishDefinition || '',
        exampleEn: item.exampleEn || `We use "${item.word}" in daily communication.`,
        exampleAr: item.exampleAr || '',
        collocations: item.collocations || [],
        arabicMistakeWarning: item.arabicMistakeWarning,
        level: item.level || 'B1',
        category: item.category || 'مفردات مضافة',
        repetitions: 0,
        intervalDays: 1,
        easeFactor: 2.5,
        nextReviewDate: new Date().toISOString(),
        mastered: false,
      };

      return {
        ...prev,
        savedVocabulary: [newItem, ...prev.savedVocabulary],
      };
    });
  };

  const removeVocabularyItem = (vocabId: string) => {
    setProgress((prev) => ({
      ...prev,
      savedVocabulary: prev.savedVocabulary.filter((v) => v.id !== vocabId),
    }));
  };

  const addMistakeRecord = (record: Omit<MistakeRecord, 'id' | 'createdAt'>) => {
    setProgress((prev) => {
      const filtered = (prev.personalMistakes || []).filter(
        (m) => m.original.toLowerCase().trim() !== record.original.toLowerCase().trim()
      );
      const newRecord: MistakeRecord = {
        ...record,
        id: `mistake-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      return {
        ...prev,
        personalMistakes: [newRecord, ...filtered].slice(0, 50),
      };
    });
  };

  const recordPersonalMistake = addMistakeRecord;

  const removeMistakeRecord = (id: string) => {
    setProgress((prev) => ({
      ...prev,
      personalMistakes: (prev.personalMistakes || []).filter((m) => m.id !== id),
    }));
  };

  const recordWorkoutCompletion = () => {
    setProgress((prev) => ({
      ...prev,
      completedWorkoutsCount: (prev.completedWorkoutsCount || 0) + 1,
      todayMinutesSpent: (prev.todayMinutesSpent || 0) + 5,
    }));
  };

  const setLearningMode = (mode: LearningMode) => {
    setProgress((prev) => ({ ...prev, learningMode: mode }));
  };

  const setPreferredAccent = (accent: EnglishAccent) => {
    setProgress((prev) => ({ ...prev, preferredAccent: accent }));
  };

  const awardXp = (amount: number, badgeTitleAr?: string) => {
    setProgress((prev) => {
      const updatedBadges = [...prev.badges];
      if (badgeTitleAr && !updatedBadges.some((b) => b.titleAr === badgeTitleAr)) {
        updatedBadges.push({
          id: `badge-${Date.now()}`,
          titleAr: badgeTitleAr,
          descriptionAr: 'وسام تقديري للمثابرة والإنجاز',
          unlockedAt: new Date().toISOString(),
        });
      }
      return {
        ...prev,
        xp: (prev.xp || 0) + (amount || 0),
        badges: updatedBadges,
      };
    });
  };

  const loadCuratedDeck = (deckId: string, mode: 'merge' | 'replace' = 'merge') => {
    const deck = CURATED_VOCAB_DECKS.find((d) => d.id === deckId);
    if (!deck) return;
    const todayStr = new Date().toISOString();
    const newItems: VocabularyItem[] = deck.items.map((item, idx) => ({
      ...item,
      id: `vocab-${deck.id}-${idx}-${Date.now()}`,
      repetitions: 0,
      intervalDays: 1,
      easeFactor: 2.5,
      nextReviewDate: todayStr,
      mastered: false,
    }));

    setProgress((prev) => {
      let updatedVocab: VocabularyItem[];
      if (mode === 'replace') {
        updatedVocab = newItems;
      } else {
        const existingWords = new Set(prev.savedVocabulary.map((v) => v.word.toLowerCase()));
        const uniqueNew = newItems.filter((v) => !existingWords.has(v.word.toLowerCase()));
        updatedVocab = [...uniqueNew, ...prev.savedVocabulary];
      }
      return {
        ...prev,
        savedVocabulary: updatedVocab,
      };
    });
  };

  const applyProfilePreset = (presetId: string) => {
    const preset = PROFILE_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setProgress((prev) => ({
      ...prev,
      hasCompletedOnboarding: true,
      estimatedLevel: preset.estimatedLevel,
      skills: preset.skills,
      primaryGoal: preset.primaryGoal,
      dailyGoalMinutes: preset.dailyGoalMinutes,
      learningMode: preset.learningMode,
      preferredAccent: preset.preferredAccent,
      activeFocusAreas: preset.activeFocusAreas,
      arabicDialect: preset.arabicDialect,
      industryInterests: preset.industryInterests,
      speechPace: preset.speechPace,
    }));
  };

  const resetSpecificData = (options: {
    resetVocab?: boolean;
    resetLessons?: boolean;
    resetXp?: boolean;
    resetMistakes?: boolean;
  }) => {
    setProgress((prev) => ({
      ...prev,
      savedVocabulary: options.resetVocab ? INITIAL_VOCABULARY : prev.savedVocabulary,
      completedLessonIds: options.resetLessons ? [] : prev.completedLessonIds,
      personalMistakes: options.resetMistakes ? [] : prev.personalMistakes,
    }));
  };

  const resetProgress = () => {
    setProgress({
      ...DEFAULT_PROGRESS,
      hasCompletedOnboarding: false,
    });
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(LEGACY_STORAGE_KEY);
      localStorage.removeItem('fares_custom_ai_lessons_v1');
      localStorage.removeItem('bayan_custom_ai_lessons_v1');
    } catch (e) {
      console.warn('Reset error:', e);
    }
  };

  const loginGoogle = async () => {
    setIsSyncing(true);
    try {
      const user = await loginWithGoogle();
      if (user) {
        setCurrentUser(user);
        const cloudProgress = await fetchProgressFromCloud(user.uid);
        if (cloudProgress) {
          setProgress((prev) => ({
            ...prev,
            ...cloudProgress,
            name: cloudProgress.name || user.displayName || prev.name,
          }));
        } else {
          await syncProgressToCloud(user.uid, progress);
        }
        setIsCloudSynced(true);
      }
    } finally {
      setIsSyncing(false);
    }
  };

  const loginGuest = async () => {
    setIsSyncing(true);
    try {
      const user = await loginAnonymously();
      if (user) {
        setCurrentUser(user);
        await syncProgressToCloud(user.uid, progress);
        setIsCloudSynced(true);
      }
    } finally {
      setIsSyncing(false);
    }
  };

  const logout = async () => {
    await logoutUser();
    setCurrentUser(null);
    setIsCloudSynced(false);
  };

  const syncNow = async (): Promise<boolean> => {
    if (!currentUser) return false;
    setIsSyncing(true);
    try {
      const ok = await syncProgressToCloud(currentUser.uid, progress);
      if (ok) setIsCloudSynced(true);
      return ok;
    } finally {
      setIsSyncing(false);
    }
  };

  const exportData = () => {
    return JSON.stringify(progress, null, 2);
  };

  const importData = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && typeof parsed.xp === 'number') {
        setProgress({ ...DEFAULT_PROGRESS, ...parsed });
        return true;
      }
    } catch (e) {
      console.error('Invalid import data:', e);
    }
    return false;
  };

  return (
    <LearningContext.Provider
      value={{
        progress,
        isLoading,
        completeOnboarding,
        updateUserProfile,
        toggleTheme,
        markLessonComplete,
        toggleLessonCompletion,
        reviewVocabulary,
        addVocabularyItem,
        removeVocabularyItem,
        addMistakeRecord,
        recordPersonalMistake,
        removeMistakeRecord,
        recordWorkoutCompletion,
        loadCuratedDeck,
        applyProfilePreset,
        resetSpecificData,
        setLearningMode,
        setPreferredAccent,
        awardXp,
        resetProgress,
        exportData,
        importData,
        currentUser,
        isSyncing,
        isCloudSynced,
        loginGoogle,
        loginGuest,
        logout,
        syncNow,
      }}
    >
      {children}
    </LearningContext.Provider>
  );
};

export function useLearning(): LearningContextType {
  const context = useContext(LearningContext);
  if (!context) {
    throw new Error('useLearning must be used within a LearningProvider');
  }
  return context;
}
