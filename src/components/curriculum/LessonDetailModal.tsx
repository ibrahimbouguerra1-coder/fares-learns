import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  RotateCcw,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Lightbulb,
  Check,
  ShieldAlert,
  Volume2,
  Wand2,
  Loader2,
} from 'lucide-react';
import type { Lesson, Exercise } from '../../types/learning.ts';
import { useLearning } from '../../context/LearningContext.tsx';
import { useAudioSpeaker } from '../../hooks/useAudioSpeaker.ts';
import { AudioButton } from '../common/AudioButton.tsx';
import { playSuccessChime, playWrongTone, playPopSound } from '../../utils/audioEffects.ts';
import { Modal } from '../common/Modal.tsx';
import { FaresMascot } from '../common/FaresMascot.tsx';
import { AlphabetPhonicsStudio } from './AlphabetPhonicsStudio.tsx';
import { generateLessonExercises } from '../../utils/aiChallengeGenerator.ts';

interface LessonDetailModalProps {
  lesson: Lesson | null;
  isOpen: boolean;
  onClose: () => void;
  onCompleteLesson?: (lessonId: string) => void;
}

export const LessonDetailModal: React.FC<LessonDetailModalProps> = ({
  lesson,
  isOpen,
  onClose,
  onCompleteLesson,
}) => {
  const { progress, markLessonComplete, recordPersonalMistake } = useLearning();
  const { isPlaying, playSpeech } = useAudioSpeaker();

  // Tabs: 'learn' (content) | 'exercises' (quiz) | 'summary' (post-quiz)
  const [activeTab, setActiveTab] = useState<'learn' | 'exercises' | 'summary'>('learn');

  // Exercises State & AI Generation
  const [exercises, setExercises] = useState<Exercise[]>(lesson?.exercises || []);
  const [isGeneratingAiEx, setIsGeneratingAiEx] = useState(false);
  const [aiNotice, setAiNotice] = useState<string | null>(null);

  useEffect(() => {
    if (lesson) {
      setExercises(lesson.exercises || []);
      setCurrentExIndex(0);
      setExerciseResults({});
      setAiNotice(null);
    }
  }, [lesson?.id]);

  // Exercise runner state
  const [currentExIndex, setCurrentExIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [textInputAnswer, setTextInputAnswer] = useState('');
  const [scrambleSelectedWords, setScrambleSelectedWords] = useState<string[]>([]);
  const [scrambleAvailableWords, setScrambleAvailableWords] = useState<string[]>([]);
  const [hasEvaluated, setHasEvaluated] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  const [exerciseResults, setExerciseResults] = useState<Record<string, boolean>>({});
  const [retryingExerciseId, setRetryingExerciseId] = useState<string | null>(null);
  const [showEmbeddedPhonics, setShowEmbeddedPhonics] = useState(false);

  if (!lesson) return null;

  const currentEx: Exercise | undefined = exercises[currentExIndex];
  const isLessonCompleted = progress.completedLessonIds.includes(lesson.id);

  // Initialize scrambled words when current exercise changes
  const initScramble = (ex: Exercise) => {
    if (ex.type === 'sentence_scramble' && ex.question) {
      // If question contains slashes like "I / am / a / student"
      const parts = ex.question.includes('/')
        ? ex.question.split('/').map((s: string) => s.trim())
        : ex.question.split(' ');
      // Shuffle slightly
      const shuffled = [...parts].sort(() => 0.5 - Math.random());
      setScrambleAvailableWords(shuffled);
      setScrambleSelectedWords([]);
    }
  };

  const handleStartExercises = () => {
    playPopSound();
    setActiveTab('exercises');
    setCurrentExIndex(0);
    resetCurrentExerciseState(exercises[0]);
  };

  const resetCurrentExerciseState = (ex?: Exercise) => {
    setSelectedOption(null);
    setTextInputAnswer('');
    setHasEvaluated(false);
    setIsAnswerCorrect(false);
    if (ex) {
      initScramble(ex);
    }
  };

  const handleCheckAnswer = () => {
    if (!currentEx) return;

    let correct = false;

    if (currentEx.type === 'multiple_choice') {
      correct = selectedOption === currentEx.correctAnswer;
    } else if (currentEx.type === 'fill_blank' || currentEx.type === 'arabic_to_english' || currentEx.type === 'error_hunt') {
      const userText = textInputAnswer.trim().toLowerCase().replace(/[.,!?;:]/g, '');
      const validAnswers = Array.isArray(currentEx.correctAnswer)
        ? currentEx.correctAnswer.map((a: string | number) => String(a).trim().toLowerCase().replace(/[.,!?;:]/g, ''))
        : [String(currentEx.correctAnswer).trim().toLowerCase().replace(/[.,!?;:]/g, '')];

      correct = validAnswers.some((ans: string) => ans === userText);
    } else if (currentEx.type === 'sentence_scramble') {
      const userSentence = scrambleSelectedWords.join(' ').trim().toLowerCase().replace(/[.,!?;:]/g, '');
      const validAnswers = Array.isArray(currentEx.correctAnswer)
        ? currentEx.correctAnswer.map((a: string | number) => String(a).trim().toLowerCase().replace(/[.,!?;:]/g, ''))
        : [String(currentEx.correctAnswer).trim().toLowerCase().replace(/[.,!?;:]/g, '')];

      correct = validAnswers.some((ans: string) => ans === userSentence);
    }

    setHasEvaluated(true);
    setIsAnswerCorrect(correct);
    setExerciseResults((prev) => ({ ...prev, [currentEx.id]: correct }));

    if (correct) {
      if (progress.soundEffectsEnabled) playSuccessChime();
    } else {
      if (progress.soundEffectsEnabled) playWrongTone();
      // Record in personal mistakes if applicable
      const correctedText = Array.isArray(currentEx.correctAnswer)
        ? String(currentEx.correctAnswer[0])
        : String(currentEx.correctAnswer);
      recordPersonalMistake({
        original: textInputAnswer || scrambleSelectedWords.join(' ') || (currentEx.options && selectedOption !== null ? currentEx.options[selectedOption] : 'إجابة غير صحيحة'),
        corrected: correctedText,
        naturalAlternative: correctedText,
        errorTypeAr: `تمرين: ${lesson.titleAr}`,
        explanationAr: currentEx.explanationAr,
        source: `الدرس: ${lesson.titleEn}`,
      });
    }
  };

  const handleNextExercise = () => {
    playPopSound();
    if (currentExIndex < exercises.length - 1) {
      const nextIdx = currentExIndex + 1;
      setCurrentExIndex(nextIdx);
      resetCurrentExerciseState(exercises[nextIdx]);
    } else {
      // Completed all exercises!
      const correctCount = Object.values(exerciseResults).filter(Boolean).length;
      const earnedXp = Math.max(20, correctCount * 5);
      markLessonComplete(lesson.id, earnedXp);
      if (onCompleteLesson) onCompleteLesson(lesson.id);
      setActiveTab('summary');
    }
  };

  const handleRetryMistakes = () => {
    playPopSound();
    const wrongExIndex = exercises.findIndex((ex) => !exerciseResults[ex.id]);
    if (wrongExIndex !== -1) {
      setCurrentExIndex(wrongExIndex);
      resetCurrentExerciseState(exercises[wrongExIndex]);
      setActiveTab('exercises');
    } else {
      setCurrentExIndex(0);
      resetCurrentExerciseState(exercises[0]);
      setActiveTab('exercises');
    }
  };

  const correctAnswersCount = Object.values(exerciseResults).filter(Boolean).length;
  const totalExercises = exercises.length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-4xl"
      title={
        <div className="flex flex-col text-right">
          <div className="flex items-center gap-2 text-xs font-black text-sky-600 dark:text-sky-400">
            <span className="px-2 py-0.5 rounded-lg bg-sky-100 dark:bg-sky-950/80 font-en font-black">
              {lesson.level}
            </span>
            <span>{lesson.chapterTitleAr}</span>
          </div>
          <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-0.5">
            {lesson.titleAr}
          </span>
        </div>
      }
      subtitle={
        <span className="font-en text-xs text-slate-500 dark:text-slate-400 font-bold">
          {lesson.titleEn}
        </span>
      }
    >
      <div className="space-y-6">
        {/* Navigation Tabs Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                playPopSound();
                setActiveTab('learn');
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                activeTab === 'learn'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              شرح الدرس والقواعد
            </button>
            <button
              type="button"
              onClick={handleStartExercises}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'exercises'
                  ? 'bg-[#58cc02] text-white border-b-2 border-[#46a302] shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <span>التمارين التطبيقية</span>
              <span className="px-1.5 py-0.2 rounded-md bg-white/20 font-en text-xs">
                {exercises.length}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 font-bold">
              <Clock className="w-3.5 h-3.5" />
              <span>{lesson.estimatedMinutes} دقيقة</span>
            </div>
            {isLessonCompleted && (
              <span className="px-2.5 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-xs font-black flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>مكتمل</span>
              </span>
            )}
          </div>
        </div>

        {/* 1. LEARN TAB: In-depth lesson explanation */}
        {activeTab === 'learn' && (
          <div className="space-y-6">
            {/* Learning Objectives */}
            <div className="p-4 sm:p-5 rounded-2xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/40 space-y-2.5">
              <div className="flex items-center gap-2 text-sky-800 dark:text-sky-300 font-black text-xs sm:text-sm">
                <Sparkles className="w-4 h-4 text-sky-600" />
                <span>أهداف الدرس ونواتج التعلم:</span>
              </div>
              <ul className="space-y-1.5 pr-4 list-disc text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                {lesson.objectivesAr.map((obj, i) => (
                  <li key={i}>{obj}</li>
                ))}
              </ul>
            </div>

            {/* Embedded Phonics Explorer for Lesson 0 */}
            {lesson.id === 'lesson-a0-0-alphabet-and-phonics' && (
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => {
                    playPopSound();
                    setShowEmbeddedPhonics(!showEmbeddedPhonics);
                  }}
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#58cc02] hover:bg-[#46a302] text-white border-b-4 border-[#46a302] active:border-b-0 active:translate-y-1 font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md select-none transition-all"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>
                    {showEmbeddedPhonics
                      ? 'إخفاء لوحة الحروف والأصوات التفاعلية'
                      : '🎵 افتح لوحة نطق الحروف الـ 26 وقواعد الفونكس التفاعلية'}
                  </span>
                </button>

                {showEmbeddedPhonics && (
                  <div className="p-3 sm:p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border-2 border-slate-200 dark:border-slate-700 animate-in fade-in">
                    <AlphabetPhonicsStudio />
                  </div>
                )}
              </div>
            )}

            {/* Main Explanation Markdown */}
            <div className="prose prose-slate dark:prose-invert max-w-none text-right font-sans text-xs sm:text-sm leading-relaxed space-y-4">
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs whitespace-pre-line text-slate-800 dark:text-slate-200">
                {lesson.explanationMarkdownAr}
              </div>
            </div>

            {/* Rules and Structures Card */}
            {lesson.rulesAndStructuresAr && (
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 space-y-2">
                <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-black text-xs sm:text-sm">
                  <BookOpen className="w-4 h-4 text-amber-600" />
                  <span>القواعد والهياكل النحوية الأساسية:</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-semibold">
                  {lesson.rulesAndStructuresAr}
                </p>
              </div>
            )}

            {/* Arabic Contrast Point (Crucial for Arabic native learners) */}
            {lesson.arabicContrastPoint && (
              <div className="p-4 sm:p-5 rounded-2xl bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/50 space-y-3">
                <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-black text-xs sm:text-sm">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span>التحدي الخاص بالمتحدث بالعربية: {lesson.arabicContrastPoint.titleAr}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {lesson.arabicContrastPoint.descriptionAr}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-rose-200 dark:border-rose-900 text-xs space-y-1">
                    <span className="font-bold text-rose-600 dark:text-rose-400 block">
                      ✕ الترجمة الحرفية الخاطئة الشائعة:
                    </span>
                    <span className="font-en text-slate-800 dark:text-slate-200 line-through">
                      {lesson.arabicContrastPoint.badArabicHabit}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-emerald-300 dark:border-emerald-800 text-xs space-y-1">
                    <span className="font-bold text-emerald-700 dark:text-emerald-400 block">
                      ✓ الصياغة الإنجليزية الصحيحة الطبيعية:
                    </span>
                    <span className="font-en font-bold text-slate-900 dark:text-white">
                      {lesson.arabicContrastPoint.correctEnglishWay}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Natural Examples with Audio and Arabic Phonetics */}
            {lesson.examples && lesson.examples.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-sky-600" />
                    <span>أمثلة ناطقة من أرض الواقع الإنجليزي:</span>
                  </h4>
                  <span className="text-xs text-slate-400 font-medium">انقر للاستماع للنطق</span>
                </div>

                <div className="space-y-2.5">
                  {lesson.examples.map((ex, i) => {
                    const audioId = `lesson-${lesson.id}-ex-${i}`;
                    return (
                      <div
                        key={i}
                        onClick={() => playSpeech(ex.en, audioId, 0.85)}
                        className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          isPlaying(audioId)
                            ? 'bg-sky-50 dark:bg-sky-950/60 border-sky-400 ring-1 ring-sky-400'
                            : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-sky-300'
                        }`}
                      >
                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex items-start gap-2">
                            <AudioButton
                              size="sm"
                              isPlaying={isPlaying(audioId)}
                              onClick={(e) => {
                                e.stopPropagation();
                                playSpeech(ex.en, audioId, 0.85);
                              }}
                            />
                            <div className="min-w-0 flex-1">
                              <span className="font-en font-bold text-sm sm:text-base text-slate-900 dark:text-white block leading-relaxed break-words" dir="ltr">
                                {ex.en}
                              </span>
                              {ex.phoneticAr && (
                                <span className="text-xs text-emerald-700 dark:text-emerald-400 font-bold block mt-0.5">
                                  نطق تقريبي: {ex.phoneticAr}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="text-xs text-slate-600 dark:text-slate-300 font-medium sm:text-left sm:max-w-xs">
                          {ex.ar}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Core Vocabulary Table */}
            {lesson.vocabulary && lesson.vocabulary.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-sky-600" />
                  <span>المفردات الأساسية المكتسبة في هذا الدرس:</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {lesson.vocabulary.map((v, idx) => {
                    const audioId = `vocab-${lesson.id}-${idx}`;
                    return (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-start justify-between gap-3 shadow-2xs"
                      >
                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex items-baseline gap-2">
                            <span className="font-en text-base font-black text-sky-600 dark:text-sky-400">
                              {v.word}
                            </span>
                            {v.ipa && (
                              <span className="font-en text-xs text-slate-400 font-medium">
                                {v.ipa}
                              </span>
                            )}
                          </div>
                          <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            {v.meaningAr}
                          </div>
                          {v.exampleEn && (
                            <div className="font-en text-[11px] text-slate-500 dark:text-slate-400 leading-tight pt-1 border-t border-slate-100 dark:border-slate-800" dir="ltr">
                              {v.exampleEn}
                            </div>
                          )}
                        </div>
                        <AudioButton
                          size="sm"
                          isPlaying={isPlaying(audioId)}
                          onClick={() => playSpeech(v.word, audioId, 0.85)}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Common Mistakes */}
            {lesson.commonMistakes && lesson.commonMistakes.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-500" />
                  <span>أخطاء شائعة وتحذيرات لتجنبها:</span>
                </h4>
                <div className="space-y-2">
                  {lesson.commonMistakes.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-xs space-y-1.5"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-en text-rose-600 dark:text-rose-400 line-through font-bold">
                          {m.wrong}
                        </span>
                        <span className="text-slate-400">→</span>
                        <span className="font-en text-emerald-600 dark:text-emerald-400 font-black">
                          {m.correct}
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 font-medium">
                        السبب: {m.reasonAr}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Real World Challenge */}
            {lesson.realWorldChallengeAr && (
              <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-black text-xs sm:text-sm">
                  <Lightbulb className="w-4 h-4 text-emerald-600" />
                  <span>تحدي التطبيق في الحياة اليومية:</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                  {lesson.realWorldChallengeAr}
                </p>
              </div>
            )}

            {/* Action Button: Start Exercises */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleStartExercises}
                className="w-full py-4 rounded-2xl bg-[#58cc02] hover:bg-[#46a302] text-white font-black text-base border-b-4 border-[#46a302] active:border-b-0 active:translate-y-1 transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                <span>الانتقال للتمارين التطبيقية ({exercises.length} أسئلة)</span>
                <ArrowLeft className="w-5 h-5 shrink-0" />
              </button>
            </div>
          </div>
        )}

        {/* 2. EXERCISES TAB: Interactive Question Runner */}
        {activeTab === 'exercises' && currentEx && (
          <div className="space-y-6">
            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-black">
                <span className="text-slate-600 dark:text-slate-400">
                  السؤال {currentExIndex + 1} من {totalExercises}
                </span>
                <span className="text-emerald-600 font-bold">
                  الصحيحة: {correctAnswersCount}
                </span>
              </div>
              <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-[#58cc02] rounded-full transition-all duration-300"
                  style={{
                    width: `${((currentExIndex + 1) / totalExercises) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Question Card */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
              <div className="space-y-1 text-right">
                <span className="text-xs font-black text-sky-600 dark:text-sky-400 block">
                  {currentEx.instructionAr}
                </span>
                {currentEx.instructionEn && (
                  <span className="font-en text-xs text-slate-400 block">
                    {currentEx.instructionEn}
                  </span>
                )}
              </div>

              {/* Question text / prompt */}
              <div
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-relaxed"
                dir="ltr"
              >
                {currentEx.question}
              </div>

              {/* Multiple Choice Options */}
              {currentEx.type === 'multiple_choice' && currentEx.options && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" dir="ltr">
                  {currentEx.options.map((opt: string, oIdx: number) => {
                    const isSelected = selectedOption === oIdx;
                    let cls =
                      'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-sky-400';
                    if (hasEvaluated) {
                      if (oIdx === currentEx.correctAnswer) {
                        cls =
                          'bg-emerald-50 dark:bg-emerald-950 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold ring-2 ring-emerald-500/20';
                      } else if (isSelected) {
                        cls =
                          'bg-red-50 dark:bg-red-950 border-red-500 text-red-900 dark:text-red-200 ring-2 ring-red-500/20';
                      }
                    } else if (isSelected) {
                      cls =
                        'bg-sky-50 dark:bg-sky-950 border-sky-500 text-sky-900 dark:text-sky-200 ring-2 ring-sky-500/20';
                    }

                    return (
                      <button
                        key={oIdx}
                        type="button"
                        disabled={hasEvaluated}
                        onClick={() => setSelectedOption(oIdx)}
                        className={`p-4 rounded-2xl border text-left text-sm font-semibold transition-all cursor-pointer min-h-[52px] flex items-center justify-between gap-3 ${cls}`}
                      >
                        <span className="flex-1 break-words">{opt}</span>
                        {hasEvaluated && oIdx === currentEx.correctAnswer && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        )}
                        {hasEvaluated && isSelected && oIdx !== currentEx.correctAnswer && (
                          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Text Input: Fill in blank / Arabic to English / Error Hunt */}
              {(currentEx.type === 'fill_blank' ||
                currentEx.type === 'arabic_to_english' ||
                currentEx.type === 'error_hunt') && (
                <div className="space-y-2" dir="ltr">
                  <input
                    type="text"
                    disabled={hasEvaluated}
                    value={textInputAnswer}
                    onChange={(e) => setTextInputAnswer(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !hasEvaluated && textInputAnswer.trim()) {
                        handleCheckAnswer();
                      }
                    }}
                    placeholder="Type your English answer here..."
                    className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-en text-sm sm:text-base font-semibold focus:ring-2 focus:ring-sky-500 outline-hidden"
                  />
                </div>
              )}

              {/* Sentence Scramble */}
              {currentEx.type === 'sentence_scramble' && (
                <div className="space-y-4" dir="ltr">
                  {/* Selected Words Area */}
                  <div className="min-h-[56px] p-3 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 flex flex-wrap items-center gap-2">
                    {scrambleSelectedWords.length === 0 ? (
                      <span className="text-xs text-slate-400 font-medium">
                        Click the words below in order to build the sentence...
                      </span>
                    ) : (
                      scrambleSelectedWords.map((word, wIdx) => (
                        <button
                          key={wIdx}
                          type="button"
                          disabled={hasEvaluated}
                          onClick={() => {
                            if (hasEvaluated) return;
                            const nextSelected = scrambleSelectedWords.filter((_, i) => i !== wIdx);
                            setScrambleSelectedWords(nextSelected);
                            setScrambleAvailableWords((prev) => [...prev, word]);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-sky-600 text-white font-en font-bold text-sm shadow-xs cursor-pointer hover:bg-sky-700 transition"
                        >
                          {word}
                        </button>
                      ))
                    )}
                  </div>

                  {/* Available Words */}
                  <div className="flex flex-wrap items-center gap-2">
                    {scrambleAvailableWords.map((word, wIdx) => (
                      <button
                        key={wIdx}
                        type="button"
                        disabled={hasEvaluated}
                        onClick={() => {
                          if (hasEvaluated) return;
                          setScrambleSelectedWords((prev) => [...prev, word]);
                          const nextAvail = scrambleAvailableWords.filter((_, i) => i !== wIdx);
                          setScrambleAvailableWords(nextAvail);
                        }}
                        className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-en font-bold text-sm hover:border-sky-400 cursor-pointer shadow-xs transition"
                      >
                        {word}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Duolingo Style Feedback Bottom Drawer */}
              {hasEvaluated && (
                <div
                  className={`p-4 sm:p-5 rounded-2xl border-2 space-y-2 text-right animate-in fade-in ${
                    isAnswerCorrect
                      ? 'bg-[#d7ffb8] dark:bg-emerald-950/80 border-[#58cc02]'
                      : 'bg-[#ffdfe0] dark:bg-rose-950/80 border-[#ff4b4b]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 font-black text-sm sm:text-base">
                    {isAnswerCorrect ? (
                      <>
                        <div className="w-8 h-8 rounded-full bg-[#58cc02] text-white flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <span className="text-emerald-900 dark:text-emerald-200">
                          أحسنت! إجابة صحيحة ومتقنة
                        </span>
                      </>
                    ) : (
                      <>
                        <div className="w-8 h-8 rounded-full bg-[#ff4b4b] text-white flex items-center justify-center shrink-0">
                          <AlertCircle className="w-5 h-5" />
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-rose-900 dark:text-rose-200 block">
                            إجابة غير صحيحة، الإجابة الدقيقة هي:
                          </span>
                          <span className="font-en font-black text-rose-700 dark:text-rose-300 text-sm" dir="ltr">
                            {Array.isArray(currentEx.correctAnswer)
                              ? currentEx.correctAnswer.join(' / ')
                              : currentEx.type === 'multiple_choice' && currentEx.options
                              ? currentEx.options[Number(currentEx.correctAnswer)]
                              : String(currentEx.correctAnswer)}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-semibold pr-10">
                    💡 {currentEx.explanationAr}
                  </p>
                </div>
              )}

              {/* Duolingo Action Footer */}
              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => resetCurrentExerciseState(currentEx)}
                  className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>إعادة المحاولة</span>
                </button>

                {!hasEvaluated ? (
                  <button
                    type="button"
                    onClick={handleCheckAnswer}
                    disabled={
                      currentEx.type === 'multiple_choice'
                        ? selectedOption === null
                        : currentEx.type === 'sentence_scramble'
                        ? scrambleSelectedWords.length === 0
                        : !textInputAnswer.trim()
                    }
                    className="flex-1 py-4 rounded-2xl bg-[#58cc02] hover:bg-[#46a302] disabled:opacity-40 disabled:hover:bg-[#58cc02] text-white font-black text-base border-b-4 border-[#46a302] active:border-b-0 active:translate-y-1 transition-all cursor-pointer shadow-md uppercase tracking-wider"
                  >
                    تحقق
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleNextExercise}
                    className={`flex-1 py-4 rounded-2xl font-black text-base border-b-4 active:border-b-0 active:translate-y-1 transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 ${
                      isAnswerCorrect
                        ? 'bg-[#58cc02] hover:bg-[#46a302] text-white border-[#46a302]'
                        : 'bg-[#ff4b4b] hover:bg-[#ea2b2b] text-white border-[#ea2b2b]'
                    }`}
                  >
                    <span>
                      {currentExIndex < totalExercises - 1 ? 'متابعة' : 'إنهاء الدرس'}
                    </span>
                    <ArrowLeft className="w-5 h-5 shrink-0" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 3. SUMMARY TAB: Celebration & Results */}
        {activeTab === 'summary' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-6">
            <FaresMascot mood={correctAnswersCount >= totalExercises * 0.7 ? 'proud' : 'thinking'} size="lg" />

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                {correctAnswersCount >= totalExercises * 0.7
                  ? 'أحسنت صنعاً! أتممت تمارين الدرس بنجاح'
                  : 'أداء جيد! يمكنك مراجعة الهفوات لترسيخ القواعد'}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                حققت {correctAnswersCount} إجابات صحيحة من أصل {totalExercises} سؤالاً.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                <span className="text-xs text-slate-500 dark:text-slate-400 block font-bold">نسبة الدقة</span>
                <span className="text-2xl font-black text-emerald-600 font-en">
                  {Math.round((correctAnswersCount / totalExercises) * 100)}%
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-[#58cc02]/10 dark:bg-[#58cc02]/20 border border-[#58cc02]/40">
                <span className="text-xs text-slate-500 dark:text-slate-400 block font-bold">حالة الدرس</span>
                <span className="text-sm font-black text-[#58cc02] dark:text-[#58cc02]">
                  درس مكتمل ومتقن ✓
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
              <button
                type="button"
                onClick={handleRetryMistakes}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-black text-sm transition cursor-pointer"
              >
                مراجعة وتصحيح الأخطاء
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#58cc02] hover:bg-[#46a302] text-white font-black text-sm border-b-4 border-[#46a302] active:border-b-0 active:translate-y-1 transition-all cursor-pointer shadow-md"
              >
                متابعة المنهج
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
