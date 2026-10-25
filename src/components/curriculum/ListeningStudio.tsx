import React, { useState } from 'react';
import {
  Volume2,
  Headphones,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Sparkles,
  Snail,
  Rabbit,
  ArrowLeft,
  Check,
} from 'lucide-react';
import type { CEFRLevel } from '../../types/learning.ts';
import { useAudioSpeaker } from '../../hooks/useAudioSpeaker.ts';
import { playSuccessChime, playWrongTone, playPopSound } from '../../utils/audioEffects.ts';
import { useLearning } from '../../context/LearningContext.tsx';

interface ListeningChallenge {
  id: string;
  level: CEFRLevel;
  sentenceEn: string;
  translationAr: string;
  phoneticAr: string;
  hintAr: string;
  wordsBank: string[];
}

const LISTENING_CHALLENGES: ListeningChallenge[] = [
  {
    id: 'list-1',
    level: 'A0',
    sentenceEn: 'Hello, my name is Fares.',
    translationAr: 'مرحباً، اسمي فارس.',
    phoneticAr: 'هَلُو، ماي نَيْم إِز فارِس',
    hintAr: 'ابدأ بكلمة التحية ثم صفة الملكية my',
    wordsBank: ['Hello,', 'my', 'is', 'name', 'Fares.', 'your', 'are', 'am'],
  },
  {
    id: 'list-2',
    level: 'A1',
    sentenceEn: 'I drink coffee every morning.',
    translationAr: 'أنا أشرب القهوة كل صباح.',
    phoneticAr: 'آي دْرِنْك كُوفِي إِڤْرِي مُورْنِنْغ',
    hintAr: 'مضارع بسيط يعبر عن عادة صباحية يومية',
    wordsBank: ['I', 'drink', 'coffee', 'every', 'morning.', 'drinks', 'tea', 'at'],
  },
  {
    id: 'list-3',
    level: 'A2',
    sentenceEn: 'She bought a new laptop yesterday.',
    translationAr: 'هي اشترت حاسوباً محمولاً جديداً بالأمس.',
    phoneticAr: 'شِي بُوت أَه نْيُو لَابْتُوب يَسْتَرْدَاي',
    hintAr: 'فعل الماضي الشاذ من buy هو bought',
    wordsBank: ['She', 'bought', 'a', 'new', 'laptop', 'yesterday.', 'buy', 'the', 'car'],
  },
  {
    id: 'list-4',
    level: 'B1',
    sentenceEn: 'I have lived here for five years.',
    translationAr: 'لقد عشت هنا لمدة خمس سنوات.',
    phoneticAr: 'آي هَاڤ لِيڤْد هِير فُور فايڤ يِيرْز',
    hintAr: 'المضارع التام مع for لتحديد مدة زمنية مستمرة',
    wordsBank: ['I', 'have', 'lived', 'here', 'for', 'five', 'years.', 'since', 'am', 'living'],
  },
  {
    id: 'list-5',
    level: 'B2',
    sentenceEn: 'If I had known, I would have helped you.',
    translationAr: 'لو كنت أعلم، لكنت قد ساعدتك.',
    phoneticAr: 'إِف آي هَاد نُون، آي وُود هَاڤ هِلْبْت يُو',
    hintAr: 'الشرطية الثالثة للتعبير عن الندم في الماضي',
    wordsBank: ['If', 'I', 'had', 'known,', 'I', 'would', 'have', 'helped', 'you.', 'will', 'knew'],
  },
  {
    id: 'list-6',
    level: 'C1',
    sentenceEn: 'Rarely have I seen such dedication.',
    translationAr: 'نادراً ما رأيت مثل هذا التفاني والإخلاص.',
    phoneticAr: 'رِيرْلِي هَاڤ آي سِين سَاتش دِيدِيكَييْشَن',
    hintAr: 'القلب النحوي البلاغي بعد ظرف النفي Rarely',
    wordsBank: ['Rarely', 'have', 'I', 'seen', 'such', 'dedication.', 'never', 'did', 'saw'],
  },
  {
    id: 'list-7',
    level: 'C2',
    sentenceEn: 'Securing consensus was no small achievement.',
    translationAr: 'لم يكن تأمين الإجماع إنجازاً هيناً.',
    phoneticAr: 'سِكْيُورِينْج كُونْسِنْسَس وَاز نُو سْمُول أَتْشِيڤْمَنْت',
    hintAr: 'أسلوب نفي النقيض البلاغي (Litotes) للتوكيد الرفيع',
    wordsBank: ['Securing', 'consensus', 'was', 'no', 'small', 'achievement.', 'a', 'great', 'feat'],
  },
];

export const ListeningStudio: React.FC = () => {
  const { progress } = useLearning();
  const { isPlaying, playSpeech } = useAudioSpeaker();

  const [challenges, setChallenges] = useState<ListeningChallenge[]>(LISTENING_CHALLENGES);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [inputMode, setInputMode] = useState<'tiles' | 'typing'>('tiles');
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>([]);
  const [typedText, setTypedText] = useState('');
  const [hasEvaluated, setHasEvaluated] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiMessage, setAiMessage] = useState<string | null>(null);

  const currentChallenge = challenges[currentIdx % (challenges.length || 1)] || LISTENING_CHALLENGES[0];

  // Initialize words whenever challenge changes
  React.useEffect(() => {
    resetChallenge();
  }, [currentIdx, challenges]);

  const resetChallenge = () => {
    const ch = challenges[currentIdx % (challenges.length || 1)] || LISTENING_CHALLENGES[0];
    const shuffled = [...ch.wordsBank].sort(() => 0.5 - Math.random());
    setAvailableWords(shuffled);
    setSelectedWords([]);
    setTypedText('');
    setHasEvaluated(false);
    setIsCorrect(false);
  };

  const handleGenerateAiListening = async () => {
    if (isGeneratingAi) return;
    setIsGeneratingAi(true);
    setAiMessage(null);
    playPopSound();

    const targetLevel = progress.estimatedLevel || 'A1';

    try {
      const res = await fetch('/api/gemini/generate-challenges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activity: 'listening',
          level: targetLevel,
          recentPrompts: challenges.slice(-15).map((c) => `${c.sentenceEn} (${c.translationAr})`),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.challenges) && data.challenges.length > 0) {
          const newChs: ListeningChallenge[] = data.challenges;
          setChallenges((prev) => [...prev, ...newChs]);
          setAiMessage(`تم توليد ${newChs.length} تحديات استماع جديدة لمستوى ${targetLevel} بنجاح! 🎧✨`);
          playSuccessChime();
          // Advance directly to the newly generated challenge
          setCurrentIdx(challenges.length);
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

  const handlePlayAudio = (speed: number) => {
    playSpeech(currentChallenge.sentenceEn, `listening-${currentChallenge.id}-${speed}`, speed);
  };

  const handleCheckAnswer = () => {
    const targetClean = currentChallenge.sentenceEn
      .toLowerCase()
      .replace(/[.,!?;:]/g, '')
      .trim();

    let userClean = '';
    if (inputMode === 'tiles') {
      userClean = selectedWords
        .join(' ')
        .toLowerCase()
        .replace(/[.,!?;:]/g, '')
        .trim();
    } else {
      userClean = typedText
        .toLowerCase()
        .replace(/[.,!?;:]/g, '')
        .trim();
    }

    const correct = userClean === targetClean;
    setHasEvaluated(true);
    setIsCorrect(correct);

    if (correct) {
      if (progress.soundEffectsEnabled) playSuccessChime();
    } else {
      if (progress.soundEffectsEnabled) playWrongTone();
    }
  };

  const handleNextChallenge = () => {
    playPopSound();
    if (currentIdx < challenges.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      // Reached the end! Auto-generate with AI!
      handleGenerateAiListening();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-white via-white to-sky-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800/80 border border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 text-right">
          <div className="flex items-center gap-2 text-xs font-black text-sky-600 dark:text-sky-400">
            <Headphones className="w-4 h-4 text-sky-500" />
            <span>مختبر الاستماع والإملاء السمعي (Audio Dictation)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            استمع واكتب ما تسمعه بدقة
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
            تدريب الأذن على التقاط مخارج الكلمات ونبرات المتحدثين الأصليين، مع توليد ذكي لا نهائي يتكيف مع مستواك.
          </p>
        </div>

        <button
          type="button"
          onClick={handleGenerateAiListening}
          disabled={isGeneratingAi}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-95 disabled:opacity-50 shrink-0"
        >
          <Sparkles className={`w-4 h-4 ${isGeneratingAi ? 'animate-spin' : ''}`} />
          <span>
            {isGeneratingAi ? 'جاري التوليد بالذكاء الاصطناعي...' : '✨ توليد تحديات استماع جديدة'}
          </span>
        </button>
      </div>

      {/* AI Notification Message if any */}
      {aiMessage && (
        <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs font-bold text-amber-900 dark:text-amber-300 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>{aiMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setAiMessage(null)}
            className="text-xs text-amber-600 hover:text-amber-800 dark:hover:text-amber-200 cursor-pointer font-bold px-1"
          >
            إغلاق
          </button>
        </div>
      )}

      {/* Progress & Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-en font-black text-xs border border-amber-200 dark:border-amber-800">
            {currentChallenge.level}
          </span>
          {(currentChallenge as any).isAiGenerated && (
            <span className="px-2.5 py-1 rounded-xl bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 font-black text-[11px] border border-purple-200 dark:border-purple-800 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-purple-500" />
              <span>مولّد بالذكاء الاصطناعي</span>
            </span>
          )}
        </div>
        <span className="text-xs font-bold text-slate-400">
          تحدي {currentIdx + 1} من {challenges.length}
        </span>
      </div>

      {/* Progress & Speed Switcher */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-black text-slate-500 dark:text-slate-400">
          التحدي {currentIdx + 1} من {LISTENING_CHALLENGES.length} • المستوى {currentChallenge.level}
        </span>
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold">
          <button
            type="button"
            onClick={() => setInputMode('tiles')}
            className={`px-3 py-1 rounded-lg transition cursor-pointer ${
              inputMode === 'tiles' ? 'bg-sky-600 text-white font-black' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            بنك الكلمات
          </button>
          <button
            type="button"
            onClick={() => setInputMode('typing')}
            className={`px-3 py-1 rounded-lg transition cursor-pointer ${
              inputMode === 'typing' ? 'bg-sky-600 text-white font-black' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            كتابة حرة
          </button>
        </div>
      </div>

      {/* Audio Playback Controls (Duolingo Style: Normal + Turtle Snail) */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-b-6 border-slate-200 border-b-slate-300 dark:border-slate-800 dark:border-b-slate-950 flex flex-col items-center justify-center space-y-4 shadow-sm text-center">
        <div className="flex items-center gap-4">
          {/* Normal Speed Button */}
          <button
            type="button"
            onClick={() => handlePlayAudio(1.0)}
            className="w-18 h-18 rounded-3xl bg-[#1cb0f6] hover:bg-[#1899d6] border-4 border-b-8 border-[#1899d6] border-b-[#127bb0] active:border-b-4 active:translate-y-1 text-white flex flex-col items-center justify-center gap-1 cursor-pointer shadow-md transition-all group"
            title="استمع بالسرعة العادية"
          >
            <Volume2 className="w-8 h-8 group-hover:scale-110 transition-transform" />
          </button>

          {/* Snail Slow Speed Button */}
          <button
            type="button"
            onClick={() => handlePlayAudio(0.7)}
            className="w-14 h-14 rounded-2xl bg-amber-400 hover:bg-amber-500 border-4 border-b-6 border-amber-500 border-b-amber-600 active:border-b-4 active:translate-y-1 text-slate-900 flex flex-col items-center justify-center gap-0.5 cursor-pointer shadow-md transition-all group"
            title="استمع ببطء شديد"
          >
            <Snail className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </button>
        </div>

        <p className="text-xs text-slate-400 font-bold">
          انقر على زر الصوت للاستماع، أو زر السلحفاة للاستماع ببطء شديد
        </p>
      </div>

      {/* Answer Area */}
      {inputMode === 'tiles' ? (
        <div className="space-y-4">
          {/* Selected Words Canvas */}
          <div className="min-h-[70px] p-4 rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 flex flex-wrap items-center gap-2" dir="ltr">
            {selectedWords.length === 0 ? (
              <span className="text-xs text-slate-400 font-medium">
                Click the word tiles below in the correct spoken order...
              </span>
            ) : (
              selectedWords.map((word, wIdx) => (
                <button
                  key={wIdx}
                  type="button"
                  disabled={hasEvaluated}
                  onClick={() => {
                    if (hasEvaluated) return;
                    setSelectedWords(selectedWords.filter((_, i) => i !== wIdx));
                    setAvailableWords((prev) => [...prev, word]);
                  }}
                  className="px-4 py-2 rounded-2xl bg-sky-600 text-white font-en font-bold text-sm shadow-xs cursor-pointer hover:bg-sky-700 active:scale-95 transition"
                >
                  {word}
                </button>
              ))
            )}
          </div>

          {/* Available Word Bank */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2" dir="ltr">
            {availableWords.map((word, wIdx) => (
              <button
                key={wIdx}
                type="button"
                disabled={hasEvaluated}
                onClick={() => {
                  if (hasEvaluated) return;
                  setSelectedWords((prev) => [...prev, word]);
                  setAvailableWords(availableWords.filter((_, i) => i !== wIdx));
                }}
                className="px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border-2 border-b-4 border-slate-200 border-b-slate-300 dark:border-slate-700 dark:border-b-slate-900 text-slate-800 dark:text-slate-200 font-en font-bold text-sm hover:border-sky-400 active:border-b-2 active:translate-y-0.5 cursor-pointer shadow-xs transition"
              >
                {word}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-2" dir="ltr">
          <textarea
            rows={3}
            disabled={hasEvaluated}
            value={typedText}
            onChange={(e) => setTypedText(e.target.value)}
            placeholder="Type what you hear in English..."
            className="w-full p-4 rounded-3xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-en font-bold text-base outline-hidden focus:ring-2 focus:ring-sky-500"
          />
        </div>
      )}

      {/* Validation Banner (Duolingo Style) */}
      {hasEvaluated && (
        <div
          className={`p-4 sm:p-5 rounded-2xl border-2 space-y-2 text-right animate-in fade-in ${
            isCorrect
              ? 'bg-[#d7ffb8] dark:bg-emerald-950/80 border-[#58cc02]'
              : 'bg-[#ffdfe0] dark:bg-rose-950/80 border-[#ff4b4b]'
          }`}
        >
          <div className="flex items-center gap-2 font-black text-sm sm:text-base">
            {isCorrect ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-[#58cc02]" />
                <span className="text-emerald-900 dark:text-emerald-200">
                  ممتاز! استماع وكتابة متقنة 100%
                </span>
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5 text-[#ff4b4b]" />
                <div className="space-y-0.5">
                  <span className="text-rose-900 dark:text-rose-200 block">
                    الصياغة الصحيحة المسموعة:
                  </span>
                  <span className="font-en font-black text-rose-700 dark:text-rose-300 text-sm" dir="ltr">
                    {currentChallenge.sentenceEn}
                  </span>
                </div>
              </>
            )}
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold pr-7">
            المعنى: {currentChallenge.translationAr} ({currentChallenge.phoneticAr})
          </p>
        </div>
      )}

      {/* Action Footer */}
      <div className="pt-2 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={resetChallenge}
          className="px-4 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
        >
          <RotateCcw className="w-4 h-4" />
          <span>إعادة المحاولة</span>
        </button>

        {!hasEvaluated ? (
          <button
            type="button"
            onClick={handleCheckAnswer}
            disabled={inputMode === 'tiles' ? selectedWords.length === 0 : !typedText.trim()}
            className="flex-1 py-4 rounded-2xl bg-[#58cc02] hover:bg-[#46a302] disabled:opacity-40 text-white font-black text-base border-b-4 border-[#46a302] active:border-b-0 active:translate-y-1 transition-all cursor-pointer shadow-md uppercase"
          >
            تحقق
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNextChallenge}
            disabled={isGeneratingAi}
            className="flex-1 py-4 rounded-2xl bg-[#58cc02] hover:bg-[#46a302] text-white font-black text-base border-b-4 border-[#46a302] active:border-b-0 active:translate-y-1 transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
          >
            <span>
              {currentIdx < challenges.length - 1
                ? 'التحدي التالي'
                : isGeneratingAi
                ? 'جاري توليد تحديات استماع جديدة بالذكاء الاصطناعي...'
                : 'توليد تحديات استماع جديدة بالذكاء الاصطناعي ✨'}
            </span>
            <ArrowLeft className="w-4 h-4 shrink-0" />
          </button>
        )}
      </div>
    </div>
  );
};
