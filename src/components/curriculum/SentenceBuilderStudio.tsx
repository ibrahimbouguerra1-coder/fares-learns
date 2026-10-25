import React, { useState } from 'react';
import {
  Sparkles,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  Volume2,
  Check,
} from 'lucide-react';
import { SENTENCE_BUILDER_CHALLENGES, type SentenceBuilderChallenge } from '../../data/sentenceBuilderData.ts';
import { useAudioSpeaker } from '../../hooks/useAudioSpeaker.ts';
import { playSuccessChime, playWrongTone, playPopSound } from '../../utils/audioEffects.ts';
import { useLearning } from '../../context/LearningContext.tsx';
import type { CEFRLevel } from '../../types/learning.ts';

const LEVEL_FILTERS: (CEFRLevel | 'ALL')[] = ['ALL', 'A0', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export const SentenceBuilderStudio: React.FC = () => {
  const { progress } = useLearning();
  const { isPlaying, playSpeech } = useAudioSpeaker();

  const [allChallenges, setAllChallenges] = useState<SentenceBuilderChallenge[]>(SENTENCE_BUILDER_CHALLENGES);
  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel | 'ALL'>('ALL');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [showHint, setShowHint] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiMessage, setAiMessage] = useState<string | null>(null);

  const filteredChallenges =
    selectedLevel === 'ALL'
      ? allChallenges
      : allChallenges.filter((c) => c.level === selectedLevel);

  const currentChallenge: SentenceBuilderChallenge =
    filteredChallenges[currentIdx % (filteredChallenges.length || 1)] || allChallenges[0];

  // Available tiles minus already selected tiles (accounting for duplicate words)
  const availableTiles = [...currentChallenge.wordTiles];
  selectedWords.forEach((word) => {
    const idx = availableTiles.indexOf(word);
    if (idx !== -1) {
      availableTiles.splice(idx, 1);
    }
  });

  const handleGenerateAiChallenges = async (levelToGenerate?: CEFRLevel) => {
    if (isGeneratingAi) return;
    setIsGeneratingAi(true);
    setAiMessage(null);
    playPopSound();

    const targetLevel = levelToGenerate || (selectedLevel !== 'ALL' ? selectedLevel : progress.estimatedLevel || 'A1');

    try {
      const res = await fetch('/api/gemini/generate-challenges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activity: 'sentence_builder',
          level: targetLevel,
          recentPrompts: filteredChallenges.slice(-15).map((c) => `${c.correctSentence} (${c.promptAr})`),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.challenges) && data.challenges.length > 0) {
          const newChallenges: SentenceBuilderChallenge[] = data.challenges;
          setAllChallenges((prev) => [...prev, ...newChallenges]);
          setAiMessage(`تم توليد ${newChallenges.length} تحديات جديدة لمستوى ${targetLevel} بنجاح! 🚀`);
          playSuccessChime();
          // Advance directly to the newly generated challenge
          setSelectedWords([]);
          setStatus('idle');
          setShowHint(false);
          setCurrentIdx(filteredChallenges.length);
          return;
        }
      }
      setAiMessage('تم توليد التحديات بنجاح!');
    } catch {
      setAiMessage('تعذر الاتصال بالذكاء الاصطناعي، يرجى المحاولة لاحقاً.');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleSelectWord = (word: string) => {
    if (status !== 'idle') return;
    playPopSound();
    setSelectedWords((prev) => [...prev, word]);
  };

  const handleRemoveWord = (indexToRemove: number) => {
    if (status !== 'idle') return;
    playPopSound();
    setSelectedWords((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  const handleCheck = () => {
    const builtSentence = selectedWords.join(' ').trim();
    const correctClean = currentChallenge.correctSentence.trim();

    // Check sentence match (case-insensitive and punctuation tolerant)
    const normalize = (s: string) =>
      s
        .toLowerCase()
        .replace(/[.,/#!$%^&*;:{}=\-_`~()?]/g, '')
        .replace(/\s+/g, ' ')
        .trim();

    if (normalize(builtSentence) === normalize(correctClean)) {
      setStatus('correct');
      if (progress.soundEffectsEnabled) playSuccessChime();
      playSpeech(currentChallenge.correctSentence, `sb-${currentChallenge.id}`);
    } else {
      setStatus('wrong');
      if (progress.soundEffectsEnabled) playWrongTone();
    }
  };

  const handleReset = () => {
    playPopSound();
    setSelectedWords([]);
    setStatus('idle');
    setShowHint(false);
  };

  const handleNext = () => {
    playPopSound();
    setSelectedWords([]);
    setStatus('idle');
    setShowHint(false);

    // If at the end of the filtered challenges, trigger AI generation automatically!
    if (currentIdx >= filteredChallenges.length - 1) {
      handleGenerateAiChallenges();
    } else {
      setCurrentIdx((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    playPopSound();
    setSelectedWords([]);
    setStatus('idle');
    setShowHint(false);
    setCurrentIdx((prev) => (prev - 1 + filteredChallenges.length) % filteredChallenges.length);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-b-6 border-slate-200 border-b-slate-300 dark:border-slate-800 dark:border-b-slate-950 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div className="space-y-1 text-right">
          <div className="flex items-center gap-2 text-xs font-black text-[#58cc02] dark:text-[#58cc02]">
            <Sparkles className="w-4 h-4 text-[#58cc02]" />
            <span>بناء وتكوين الجمل على طريقة دوولينجو (Word Tiles)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            مختبر تركيب وبناء الجمل الإنجليزية
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
            رتب الكلمات في الترتيب النحوي الصحيح (SVO) لبناء جملة إنجليزية فصيحة وطبيعية مع توليد لا نهائي بالذكاء الاصطناعي.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
          {/* AI Generator Button */}
          <button
            type="button"
            onClick={() => handleGenerateAiChallenges()}
            disabled={isGeneratingAi}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-95 disabled:opacity-50"
            title="توليد 3 تحديات جديدة خصيصاً لمستواك بالذكاء الاصطناعي"
          >
            <Sparkles className={`w-4 h-4 ${isGeneratingAi ? 'animate-spin' : ''}`} />
            <span>
              {isGeneratingAi ? 'جاري التوليد بالذكاء الاصطناعي...' : '✨ توليد تحديات بالذكاء الاصطناعي'}
            </span>
          </button>
        </div>
      </div>

      {/* Level Filters */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {LEVEL_FILTERS.map((lvl) => (
          <button
            key={lvl}
            type="button"
            onClick={() => {
              playPopSound();
              setSelectedLevel(lvl);
              setCurrentIdx(0);
              setSelectedWords([]);
              setStatus('idle');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black cursor-pointer transition-all border-2 ${
              selectedLevel === lvl
                ? 'bg-[#58cc02] border-[#46a302] text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            {lvl === 'ALL' ? 'الكل' : lvl}
          </button>
        ))}
      </div>

      {/* AI Notification Message if any */}
      {aiMessage && (
        <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-xs font-bold text-purple-900 dark:text-purple-300 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
            <span>{aiMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setAiMessage(null)}
            className="text-xs text-purple-500 hover:text-purple-700 dark:hover:text-purple-200 cursor-pointer font-bold px-1"
          >
            إغلاق
          </button>
        </div>
      )}

      {/* Main Challenge Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-b-6 border-slate-200 border-b-slate-300 dark:border-slate-800 dark:border-b-slate-950 shadow-sm space-y-6">
        {/* Level Badge and Counter */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-en font-black text-xs border border-sky-200 dark:border-sky-800">
              {currentChallenge.level} • {currentChallenge.grammarFocusAr}
            </span>
            {(currentChallenge as any).isAiGenerated && (
              <span className="px-2.5 py-1 rounded-xl bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 font-black text-[11px] border border-purple-200 dark:border-purple-800 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-purple-500" />
                <span>مولّد بالذكاء الاصطناعي</span>
              </span>
            )}
          </div>
          <span className="text-xs font-bold text-slate-400">
            تحدي {currentIdx + 1} من {filteredChallenges.length}
          </span>
        </div>

        {/* Arabic Prompt Prompt */}
        <div className="text-right p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 block">
            ركّب الجملة الإنجليزية المقابلة للمعنى:
          </span>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-relaxed">
            {currentChallenge.promptAr}
          </h3>
        </div>

        {/* Selected Words Dropzone (Building Area) */}
        <div className="min-h-24 p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-950/60 border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-wrap items-center gap-2 content-start transition-all" dir="ltr">
          {selectedWords.length === 0 ? (
            <span className="text-xs text-slate-400 font-medium select-none italic p-2">
              اضغط على الكلمات بالأسفل لترتيبها هنا بالترتيب الصحيح...
            </span>
          ) : (
            selectedWords.map((word, idx) => (
              <button
                key={`${word}-${idx}`}
                type="button"
                onClick={() => handleRemoveWord(idx)}
                className="px-3.5 py-2 rounded-2xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-2 border-b-4 border-slate-300 border-b-slate-400 dark:border-slate-700 dark:border-b-slate-900 active:border-b-2 font-en font-bold text-sm shadow-xs cursor-pointer hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:border-rose-300 transition-all select-none"
              >
                {word}
              </button>
            ))
          )}
        </div>

        {/* Available Word Tiles (Word Bank) */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-400 block text-right">
            بنك الكلمات المتاحة:
          </span>
          <div className="flex flex-wrap items-center gap-2.5 p-3 rounded-2xl bg-slate-100/60 dark:bg-slate-800/40 min-h-20" dir="ltr">
            {currentChallenge.wordTiles.map((word, idx) => {
              // Determine if this specific occurrence is already placed in selected dropzone
              const priorOccurrences = currentChallenge.wordTiles.slice(0, idx).filter((w) => w === word).length;
              const usedCount = selectedWords.filter((w) => w === word).length;
              const isUsed = usedCount > priorOccurrences;

              return (
                <button
                  key={`${word}-${idx}`}
                  type="button"
                  disabled={isUsed || status !== 'idle'}
                  onClick={() => handleSelectWord(word)}
                  className={`px-4 py-2.5 rounded-2xl font-en font-bold text-sm border-2 border-b-4 transition-all cursor-pointer select-none ${
                    isUsed
                      ? 'bg-slate-200 dark:bg-slate-800/30 border-transparent text-transparent pointer-events-none'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border-slate-200 border-b-slate-300 dark:border-slate-700 dark:border-b-slate-900 hover:border-[#58cc02] active:border-b-2 active:translate-y-0.5 shadow-xs'
                  }`}
                >
                  {word}
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback Section if checked */}
        {status === 'correct' && (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-400 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 space-y-2 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-black text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span>إجابة ممتازة! ترتيب الجملة سليم 100%</span>
              </div>
              <button
                type="button"
                onClick={() => playSpeech(currentChallenge.correctSentence, `sb-play-${currentChallenge.id}`)}
                className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 hover:bg-emerald-200 text-emerald-700 dark:text-emerald-300 cursor-pointer"
                title="استمع للجملة بصوت بشري نقي"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs sm:text-sm font-medium leading-relaxed">
              {currentChallenge.explanationAr}
            </p>
          </div>
        )}

        {status === 'wrong' && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-400 dark:border-rose-700 text-rose-900 dark:text-rose-200 space-y-2 animate-in fade-in">
            <div className="flex items-center gap-2 font-black text-sm">
              <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              <span>ترتيب الجملة غير دقيق، حاول مجدداً!</span>
            </div>
            <p className="text-xs sm:text-sm font-medium leading-relaxed">
              الجملة الصحيحة هي:{' '}
              <span className="font-en font-bold underline" dir="ltr">
                "{currentChallenge.correctSentence}"
              </span>
            </p>
            <p className="text-xs text-rose-700 dark:text-rose-300 font-medium">
              {currentChallenge.explanationAr}
            </p>
          </div>
        )}

        {showHint && (
          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300 text-xs font-medium flex items-center gap-2">
            <HelpCircle className="w-4 h-4 shrink-0 text-amber-600" />
            <span>تلميح: الجملة تبدأ بـ: "{currentChallenge.correctSentence.split(' ')[0]}"</span>
          </div>
        )}

        {/* Controls Footer */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleReset}
              className="px-3.5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-black flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>إعادة المحاولة</span>
            </button>
            <button
              type="button"
              onClick={() => setShowHint(!showHint)}
              className="px-3.5 py-2.5 rounded-2xl bg-amber-100 hover:bg-amber-200 dark:bg-amber-950 dark:hover:bg-amber-900 text-amber-800 dark:text-amber-300 text-xs font-black flex items-center gap-1.5 cursor-pointer"
            >
              <HelpCircle className="w-4 h-4" />
              <span>تلميح</span>
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handlePrev}
              className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
              title="التحدي السابق"
            >
              <ArrowRight className="w-4 h-4" />
            </button>

            {status === 'correct' ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={isGeneratingAi}
                className="flex-1 sm:flex-initial px-6 py-3 rounded-2xl bg-[#58cc02] hover:bg-[#46a302] text-white border-b-4 border-[#46a302] active:border-b-0 active:translate-y-1 font-black text-sm cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                <span>
                  {currentIdx < filteredChallenges.length - 1
                    ? 'التحدي التالي'
                    : isGeneratingAi
                    ? 'جاري توليد تحديات جديدة بالذكاء الاصطناعي...'
                    : 'توليد تحديات جديدة بالذكاء الاصطناعي ✨'}
                </span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={selectedWords.length === 0}
                onClick={handleCheck}
                className="flex-1 sm:flex-initial px-6 py-3 rounded-2xl bg-[#58cc02] hover:bg-[#46a302] text-white border-b-4 border-[#46a302] active:border-b-0 active:translate-y-1 disabled:opacity-50 disabled:pointer-events-none font-black text-sm cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>تحقق من الجملة</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              disabled={isGeneratingAi}
              className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
              title={currentIdx < filteredChallenges.length - 1 ? 'التحدي التالي' : 'توليد المزيد بالذكاء الاصطناعي'}
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
