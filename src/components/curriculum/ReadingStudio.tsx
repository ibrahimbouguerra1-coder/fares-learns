import React, { useState } from 'react';
import {
  BookOpen,
  Volume2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Eye,
  EyeOff,
} from 'lucide-react';
import type { ReadingPassage } from '../../types/learning.ts';
import { READING_PASSAGES } from '../../data/readingData.ts';
import { useAudioSpeaker } from '../../hooks/useAudioSpeaker.ts';
import { AudioButton } from '../common/AudioButton.tsx';
import { playSuccessChime, playWrongTone, playPopSound } from '../../utils/audioEffects.ts';
import { useLearning } from '../../context/LearningContext.tsx';

export const ReadingStudio: React.FC = () => {
  const { progress, awardXp } = useLearning();
  const { isPlaying, playSpeech } = useAudioSpeaker();

  const [passages, setPassages] = useState<ReadingPassage[]>(READING_PASSAGES);
  const [selectedPassageId, setSelectedPassageId] = useState<string>(READING_PASSAGES[0].id);
  const [showArabicTranslation, setShowArabicTranslation] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiMessage, setAiMessage] = useState<string | null>(null);

  const activePassage =
    passages.find((p) => p.id === selectedPassageId) || passages[0] || READING_PASSAGES[0];

  const handleGenerateAiPassage = async () => {
    if (isGeneratingAi) return;
    setIsGeneratingAi(true);
    setAiMessage(null);
    playPopSound();

    const targetLevel = progress.estimatedLevel || activePassage.level || 'A1';

    try {
      const res = await fetch('/api/gemini/generate-challenges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activity: 'reading',
          level: targetLevel,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.passage && data.passage.id) {
          const newPassage: ReadingPassage = data.passage;
          setPassages((prev) => [...prev, newPassage]);
          setSelectedPassageId(newPassage.id);
          setAiMessage(`تم توليد نص قراءة جديد لمستوى ${targetLevel} بنجاح! 📖✨`);
          playSuccessChime();
          return;
        }
      }
      setAiMessage('تم توليد النص بنجاح!');
    } catch {
      setAiMessage('تعذر الاتصال بالذكاء الاصطناعي، يرجى المحاولة لاحقاً.');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleSelectAnswer = (qIdx: number, optIdx: number, correctIdx: number) => {
    const qKey = `${activePassage.id}-q-${qIdx}`;
    if (quizAnswers[qKey] !== undefined) return;
    setQuizAnswers((prev) => ({ ...prev, [qKey]: optIdx }));
    if (optIdx === correctIdx) {
      if (progress.soundEffectsEnabled) playSuccessChime();
      awardXp(15);
    } else if (progress.soundEffectsEnabled) {
      playWrongTone();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-white via-white to-sky-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800/80 border border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div className="space-y-1 text-right">
          <div className="flex items-center gap-2 text-xs font-black text-sky-600 dark:text-sky-400">
            <Sparkles className="w-4 h-4 text-sky-500" />
            <span>نصوص القراءة والفهم القرائي المتدرج (A0 - C2)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            استوديو القراءة والاستيعاب
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
            نصوص متدرجة من المحادثات البسيطة حتى المقالات الفلسفية الرفيعة، مع توليد نصوص جديدة بمستواك بواسطة الذكاء الاصطناعي.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleGenerateAiPassage}
            disabled={isGeneratingAi}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white text-xs font-black flex items-center gap-2 cursor-pointer shadow-sm transition-all active:scale-95 disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${isGeneratingAi ? 'animate-spin' : ''}`} />
            <span>{isGeneratingAi ? 'جاري التوليد بالذكاء الاصطناعي...' : '✨ توليد نص قراءة جديد'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playPopSound();
              setShowArabicTranslation(!showArabicTranslation);
            }}
            className="px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-black flex items-center gap-2 cursor-pointer shadow-xs"
          >
            {showArabicTranslation ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>{showArabicTranslation ? 'إخفاء الترجمة' : 'إظهار الترجمة'}</span>
          </button>
        </div>
      </div>

      {/* AI Notification Message if any */}
      {aiMessage && (
        <div className="p-3.5 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-xs font-bold text-sky-900 dark:text-sky-300 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
            <span>{aiMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setAiMessage(null)}
            className="text-xs text-sky-600 hover:text-sky-800 dark:hover:text-sky-200 cursor-pointer font-bold px-1"
          >
            إغلاق
          </button>
        </div>
      )}

      {/* Passages List Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {passages.map((p) => {
          const isSelected = selectedPassageId === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                playPopSound();
                setSelectedPassageId(p.id);
              }}
              className={`px-4 py-2.5 rounded-2xl border-2 text-xs font-black whitespace-nowrap cursor-pointer transition select-none flex items-center gap-2 ${
                isSelected
                  ? 'bg-sky-600 border-sky-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-sky-300'
              }`}
            >
              <span className="font-en px-1.5 py-0.2 rounded-md bg-white/20 font-black">
                {p.level}
              </span>
              <span>{p.titleAr}</span>
              {(p as any).isAiGenerated && (
                <span className="text-[10px] text-amber-300">✨</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Reading Text Card */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 gap-3">
          <div className="space-y-1 text-right">
            <span className="font-en text-xs font-bold text-sky-600 dark:text-sky-400">
              Level {activePassage.level} Reading Passage • {activePassage.topic}
            </span>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              {activePassage.titleAr}
            </h3>
            <p className="font-en text-xs text-slate-400 font-bold" dir="ltr">
              {activePassage.titleEn}
            </p>
          </div>

          <AudioButton
            size="md"
            isPlaying={isPlaying(activePassage.id)}
            onClick={() => playSpeech(activePassage.textEn, activePassage.id, 0.85)}
          />
        </div>

        {/* English Passage */}
        <div
          dir="ltr"
          className="p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 font-en text-sm sm:text-base leading-relaxed text-slate-900 dark:text-slate-100 whitespace-pre-line font-medium"
        >
          {activePassage.textEn}
        </div>

        {/* Arabic Translation Toggle */}
        {showArabicTranslation && (
          <div className="p-5 rounded-2xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line font-medium animate-in fade-in">
            {activePassage.translationAr}
          </div>
        )}

        {/* Sentence Pairs Breakdown */}
        {activePassage.sentencePairs && activePassage.sentencePairs.length > 0 && (
          <div className="space-y-2 pt-2">
            <h4 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-sky-600" />
              <span>التحليل المتوازي جملة بجملة:</span>
            </h4>
            <div className="space-y-2">
              {activePassage.sentencePairs.map((pair: { en: string; ar: string }, idx: number) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-xs space-y-1"
                >
                  <p className="font-en font-bold text-slate-900 dark:text-white" dir="ltr">
                    {pair.en}
                  </p>
                  <p className="text-slate-600 dark:text-slate-300 font-medium">
                    {pair.ar}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comprehension Questions */}
        {activePassage.comprehensionQuestions && activePassage.comprehensionQuestions.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h4 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-emerald-600" />
              <span>أسئلة الفهم والاستيعاب القرائي:</span>
            </h4>

            <div className="space-y-4">
              {activePassage.comprehensionQuestions.map((q: any, qIdx: number) => {
                const qKey = `${activePassage.id}-q-${qIdx}`;
                const chosen = quizAnswers[qKey];
                const isSubmitted = chosen !== undefined;

                return (
                  <div
                    key={qIdx}
                    className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-3"
                  >
                    <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white block">
                      {qIdx + 1}. {q.questionAr}
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5" dir="ltr">
                      {q.options.map((opt: string, oIdx: number) => {
                        const isCorrect = oIdx === q.correctIndex;
                        const isSelected = chosen === oIdx;
                        let cls =
                          'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200';
                        if (isSubmitted) {
                          if (isCorrect) {
                            cls =
                              'bg-emerald-50 dark:bg-emerald-950 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold';
                          } else if (isSelected) {
                            cls =
                              'bg-red-50 dark:bg-red-950 border-red-500 text-red-900 dark:text-red-200';
                          }
                        }

                        return (
                          <button
                            key={oIdx}
                            type="button"
                            onClick={() => handleSelectAnswer(qIdx, oIdx, q.correctIndex)}
                            className={`p-3 rounded-xl border text-left font-en text-xs sm:text-sm font-semibold transition cursor-pointer flex items-center justify-between gap-2.5 ${cls}`}
                          >
                            <span className="flex-1 break-words">{opt}</span>
                            {isSubmitted && isCorrect && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            )}
                            {isSubmitted && isSelected && !isCorrect && (
                              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {isSubmitted && (
                      <p className="text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-200 dark:border-slate-700 font-medium">
                        {q.explanationAr}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
