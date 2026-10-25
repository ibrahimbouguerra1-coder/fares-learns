import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import {
  ENGLISH_ALPHABET,
  GOLDEN_PHONICS_RULES,
  SURVIVAL_PHRASE_CATEGORIES,
} from '../../data/alphabetPhonicsData.ts';
import { useLearning } from '../../context/LearningContext.tsx';
import { playSuccessChime, playWrongTone, playPopSound } from '../../utils/audioEffects.ts';
import { useAudioSpeaker } from '../../hooks/useAudioSpeaker.ts';
import { AudioButton } from '../common/AudioButton.tsx';

const PHONICS_QUIZ = [
  {
    id: 'pqz-1',
    questionAr: 'أي من الحروف التالية يخرج بصوت الشين الصافي /ʃ/؟',
    options: ['SH (مثل Shop)', 'CH (مثل Chair)', 'PH (مثل Phone)', 'TH (مثل Three)'],
    correctIndex: 0,
    explanationAr: 'الحرفان SH يعطيان دائماً صوت الشين الصافي كما في She و Shop.',
  },
  {
    id: 'pqz-2',
    questionAr: 'كيف ننطق المقطع الختامي (-tion) في كلمات مثل Information و Station؟',
    options: ['تي-أون', 'شَن (صوت الشين المفتوح)', 'سي-أون', 'تين'],
    correctIndex: 1,
    explanationAr: 'المقطع -tion ينطق دائماً (شن/ʃən).',
  },
  {
    id: 'pqz-3',
    questionAr: 'ما هو الدور السحري لحرف (e) الصامت في نهاية كلمات مثل Name و Hate؟',
    options: [
      'يجعل الكلمة مؤنثة',
      'يمدد نطق الحرف المتحرك الذي قبله لينطق باسمه الطويل',
      'يجعل الحرف الأخير ساكناً جداً',
      'يحول الكلمة إلى زمن الماضي',
    ],
    correctIndex: 1,
    explanationAr: 'حرف E السحري الصامت يمد حركة العلة السابقة لينطق الحرف باسمه الطويل (Hat -> Hate).',
  },
  {
    id: 'pqz-4',
    questionAr: 'كيف ينطق المقطع المركب (PH) في كلمات مثل Phone و Photo؟',
    options: ['مثل حرف الـ P', 'مثل حرف الفاء (F)', 'مثل حرف الهاء (H)', 'مثل الباء (B)'],
    correctIndex: 1,
    explanationAr: 'المقطع المركب PH ينطق دائماً كصوت الفاء (F).',
  },
];

function highlightTargetLetterInWord(word: string, letterUpper: string) {
  const target = letterUpper.toLowerCase();
  return word.split('').map((ch, idx) => {
    if (ch.toLowerCase() === target) {
      return (
        <span
          key={idx}
          className="text-sky-600 dark:text-sky-400 underline decoration-2 decoration-sky-500 underline-offset-4 font-black"
        >
          {ch}
        </span>
      );
    }
    return <span key={idx}>{ch}</span>;
  });
}

function highlightPhonicsCombo(word: string, combination: string) {
  if (combination === 'Magic E') {
    return word.split('').map((ch, idx, arr) => {
      const isTrailingE = ch.toLowerCase() === 'e' && (idx === arr.length - 1 || arr[idx + 1] === ' ');
      return isTrailingE ? (
        <span
          key={idx}
          className="px-1 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-black"
        >
          {ch}
        </span>
      ) : (
        <span key={idx}>{ch}</span>
      );
    });
  }

  const combos = combination
    .split('/')
    .map((c) => c.trim().replace(/^-/, ''))
    .filter(Boolean);
  const escaped = combos.map((c) => c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  if (!escaped) return word;
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = word.split(regex);
  return parts.map((part, idx) => {
    const isMatch = combos.some((c) => c.toLowerCase() === part.toLowerCase());
    if (isMatch) {
      return (
        <span
          key={idx}
          className="px-1 rounded-md bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-black underline decoration-sky-500 decoration-2 underline-offset-4"
        >
          {part}
        </span>
      );
    }
    return <span key={idx}>{part}</span>;
  });
}

function highlightFirstPhraseStarter(phraseEn: string) {
  const starters = [
    'Hello,',
    'I am',
    'My name is',
    'Nice to',
    'Where are',
    'Excuse me,',
    'Thank you',
    'You are',
    'No problem',
    'I want',
    'I need',
    'Where is',
    'How much',
    'How do I',
    'Can you',
    'I do not',
  ];
  for (const starter of starters) {
    if (phraseEn.toLowerCase().startsWith(starter.toLowerCase())) {
      const head = phraseEn.slice(0, starter.length);
      const tail = phraseEn.slice(starter.length);
      return (
        <>
          <span className="px-1.5 py-0.5 rounded-lg bg-sky-100 dark:bg-sky-950/90 text-sky-700 dark:text-sky-300 font-black">
            {head}
          </span>
          <span>{tail}</span>
        </>
      );
    }
  }
  return <span className="text-sky-700 dark:text-sky-300 font-black">{phraseEn}</span>;
}

export const AlphabetPhonicsStudio: React.FC = () => {
  const { progress } = useLearning();
  const { isPlaying, playSpeech } = useAudioSpeaker();
  const [subTab, setSubTab] = useState<'alphabet' | 'phonics' | 'survival' | 'quiz'>('alphabet');
  const [filterVowelsOnly, setFilterVowelsOnly] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});

  const handleSelectQuiz = (qId: string, optIdx: number, correctIdx: number) => {
    if (quizAnswers[qId] !== undefined) return;
    setQuizAnswers((prev) => ({ ...prev, [qId]: optIdx }));
    if (optIdx === correctIdx) {
      if (progress.soundEffectsEnabled) playSuccessChime();
    } else if (progress.soundEffectsEnabled) {
      playWrongTone();
    }
  };

  const displayedLetters = filterVowelsOnly
    ? ENGLISH_ALPHABET.filter((l) => l.isVowel)
    : ENGLISH_ALPHABET;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-br from-white via-white to-sky-50/40 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800/60 border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 space-y-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="min-w-0 flex-1 text-right">
            <div className="text-xs font-black text-sky-600 dark:text-sky-400 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 shrink-0 text-sky-500" />
              <span className="break-words">استوديو الصوتيات التأسيسي الشامل (A0)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white break-words leading-snug">
              مخارج الحروف، القواعد الصوتية الذهبية، وجمل النجاة
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 break-words leading-relaxed font-medium">
              استمع للنطق الصوتي البشري لكل حرف وقارن بين اسمه وصوته، مع تدريبات عملية للأصوات التي تشكل تحدياً للمتحدث العربي.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border-2 border-slate-200 dark:border-slate-700 text-xs font-black">
            <button
              type="button"
              onClick={() => {
                playPopSound();
                setSubTab('alphabet');
              }}
              className={`px-3.5 py-2 min-h-[42px] rounded-xl transition-all cursor-pointer select-none ${
                subTab === 'alphabet'
                  ? 'bg-[#58cc02] text-white border-b-4 border-[#46a302] shadow-sm translate-y-[-2px]'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 active:translate-y-0.5'
              }`}
            >
              1. الحروف الأبجدية (26)
            </button>
            <button
              type="button"
              onClick={() => {
                playPopSound();
                setSubTab('phonics');
              }}
              className={`px-3.5 py-2 min-h-[42px] rounded-xl transition-all cursor-pointer select-none ${
                subTab === 'phonics'
                  ? 'bg-[#1cb0f6] text-white border-b-4 border-[#1899d6] shadow-sm translate-y-[-2px]'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 active:translate-y-0.5'
              }`}
            >
              2. القواعد الصوتية المركبة
            </button>
            <button
              type="button"
              onClick={() => {
                playPopSound();
                setSubTab('survival');
              }}
              className={`px-3.5 py-2 min-h-[42px] rounded-xl transition-all cursor-pointer select-none ${
                subTab === 'survival'
                  ? 'bg-[#ce82ff] text-white border-b-4 border-[#b85eff] shadow-sm translate-y-[-2px]'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 active:translate-y-0.5'
              }`}
            >
              3. عبارات النجاة الأساسية
            </button>
            <button
              type="button"
              onClick={() => {
                playPopSound();
                setSubTab('quiz');
              }}
              className={`px-3.5 py-2 min-h-[42px] rounded-xl transition-all cursor-pointer select-none ${
                subTab === 'quiz'
                  ? 'bg-[#ffc800] text-slate-900 border-b-4 border-[#e5b400] shadow-sm translate-y-[-2px]'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 active:translate-y-0.5'
              }`}
            >
              4. اختبار الفهم الصوتي
            </button>
          </div>
        </div>
      </div>

      {subTab === 'survival' && (
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-sky-50/80 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1 text-xs sm:text-sm min-w-0">
              <div className="font-bold text-sky-900 dark:text-sky-200 break-words">
                عبارات النجاة اليومية للبدء المباشر
              </div>
              <p className="text-sky-950 dark:text-sky-100 leading-relaxed break-words">
                انقر على أي عبارة للاستماع لنطقها النموذجي. تم تمييز بدايات الجمل الأساسية (مثل <span className="font-en font-bold">I want</span> و <span className="font-en font-bold">Where is</span>) لتساعدك على تركيب الجمل بسهولة.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SURVIVAL_PHRASE_CATEGORIES.map((cat, catIdx) => (
              <div
                key={cat.id}
                className={`rounded-3xl bg-white dark:bg-slate-900 border p-6 space-y-4 min-w-0 ${
                  catIdx === 0
                    ? 'border-sky-400 dark:border-sky-700 ring-1 ring-sky-400/30'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white break-words">
                    {cat.titleAr}
                  </h3>
                  {catIdx === 0 && (
                    <span className="text-xs font-bold text-sky-600 dark:text-sky-400">
                      أساسي للتعارف
                    </span>
                  )}
                </div>

                <div className="space-y-3">
                  {cat.phrases.map((p, idx) => {
                    const audioId = `${cat.id}-${idx}`;
                    return (
                      <div
                        key={idx}
                        onClick={() => playSpeech(p.en, audioId, 0.85)}
                        className={`p-3.5 rounded-2xl border space-y-1.5 cursor-pointer transition min-w-0 ${
                          isPlaying(audioId)
                            ? 'bg-sky-50 dark:bg-sky-950/50 border-sky-500 ring-1 ring-sky-500'
                            : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700 hover:border-sky-400'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-en text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-relaxed break-words flex-1">
                            {highlightFirstPhraseStarter(p.en)}
                          </span>
                          <AudioButton
                            size="sm"
                            isPlaying={isPlaying(audioId)}
                            onClick={(e) => {
                              e.stopPropagation();
                              playSpeech(p.en, audioId, 0.85);
                            }}
                          />
                        </div>
                        <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 break-words">
                          نطق تقريبي: {p.phoneticAr}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-300 font-medium break-words">
                          المعنى: {p.ar}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {subTab === 'alphabet' && (
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-slate-100/80 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1 text-xs sm:text-sm min-w-0 flex-1">
              <div className="font-bold text-slate-900 dark:text-white break-words">
                الأبجدية الإنجليزية ومخارج الأصوات
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed break-words">
                استمع لنطق اسم الحرف بمفرده أو نطق الكلمة الدالة عليه. تمييز الحروف المتحركة مهم جداً لضبط قواعد النطق والقراءة.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-1 p-1 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shrink-0">
              <button
                type="button"
                onClick={() => setFilterVowelsOnly(false)}
                className={`px-3 py-1.5 min-h-[36px] rounded-lg text-xs font-bold transition cursor-pointer ${
                  !filterVowelsOnly
                    ? 'bg-sky-600 text-white'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                جميع الحروف (26)
              </button>
              <button
                type="button"
                onClick={() => setFilterVowelsOnly(true)}
                className={`px-3 py-1.5 min-h-[36px] rounded-lg text-xs font-bold transition cursor-pointer ${
                  filterVowelsOnly
                    ? 'bg-sky-600 text-white'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                الحروف المتحركة (A, E, I, O, U)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedLetters.map((item) => {
              const audioId = `let-${item.upper}`;
              const letterAudioId = `let-single-${item.upper}`;
              const wordAudioId = `let-word-${item.upper}`;
              return (
                <div
                  key={item.upper}
                  className={`p-5 rounded-3xl border transition-all flex flex-col justify-between space-y-3.5 bg-white dark:bg-slate-900 min-w-0 shadow-2xs ${
                    isPlaying(audioId) || isPlaying(letterAudioId) || isPlaying(wordAudioId)
                      ? 'border-sky-500 ring-2 ring-sky-500/50 dark:border-sky-400'
                      : 'border-slate-200/80 dark:border-slate-800 hover:border-sky-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-wrap items-baseline gap-2 min-w-0 flex-1">
                      <span className="font-en text-3xl font-black text-sky-600 dark:text-sky-400">
                        {item.upper} {item.lower}
                      </span>
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400 break-words">
                        اسم الحرف: {item.nameAr}
                      </span>
                      {item.isVowel && (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300">
                          حرف متحرك Vowel
                        </span>
                      )}
                    </div>
                    <AudioButton
                      size="sm"
                      isPlaying={isPlaying(audioId)}
                      onClick={() => {
                        playSpeech(`${item.upper}. ${item.exampleWord.replace('/', ', ')}`, audioId, 0.85);
                      }}
                    />
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2">
                    <div className="min-w-0">
                      <span className="font-en text-base sm:text-lg font-bold text-slate-900 dark:text-white break-words">
                        {highlightTargetLetterInWord(item.exampleWord, item.upper)}
                      </span>
                      <span className="mx-1.5 text-slate-400">•</span>
                      <span className="text-xs text-emerald-700 dark:text-emerald-400 font-bold break-words">
                        ({item.examplePhoneticAr})
                      </span>
                    </div>
                    <span className="text-xs text-slate-700 dark:text-slate-300 font-bold break-words">
                      {item.exampleMeaningAr}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 pt-1 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => playSpeech(item.upper, letterAudioId, 0.8)}
                      className="flex-1 py-1.5 px-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-sky-950/60 text-slate-700 dark:text-slate-200 hover:text-sky-700 text-xs font-bold transition-all active:scale-95 cursor-pointer text-center"
                    >
                      نطق اسم الحرف
                    </button>
                    <button
                      type="button"
                      onClick={() => playSpeech(item.exampleWord.replace('/', ', '), wordAudioId, 0.85)}
                      className="flex-1 py-1.5 px-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-sky-950/60 text-slate-700 dark:text-slate-200 hover:text-sky-700 text-xs font-bold transition-all active:scale-95 cursor-pointer text-center"
                    >
                      نطق الكلمة الدالة
                    </button>
                  </div>

                  <div className="text-xs space-y-1">
                    <div className="font-semibold text-slate-600 dark:text-slate-300 break-words">
                      صوت الحرف في الكلمة:{' '}
                      <span className="font-bold text-slate-900 dark:text-white">{item.soundAr}</span>
                    </div>
                    {item.arabicNote && (
                      <p className="text-sky-700 dark:text-sky-300 text-[11px] font-medium break-words leading-relaxed">
                        تنبيه صوتي: {item.arabicNote}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {subTab === 'phonics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {GOLDEN_PHONICS_RULES.map((rule) => (
            <div
              key={rule.id}
              className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 space-y-4 min-w-0 shadow-2xs"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="min-w-0">
                  <span className="text-xs text-slate-500 dark:text-slate-400 block break-words font-medium">{rule.titleAr}</span>
                  <div className="flex flex-wrap items-baseline gap-3 mt-0.5">
                    <span className="font-en text-2xl font-black text-sky-600 dark:text-sky-400 break-words">
                      {rule.combination}
                    </span>
                    <span className="text-sm font-black text-slate-900 dark:text-white break-words">
                      = صوت ({rule.soundAr})
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed break-words font-medium">
                {rule.explanationAr}
              </p>

              <div className="space-y-2 pt-1">
                {rule.examples.map((ex, i) => {
                  const audioId = `${rule.id}-${i}`;
                  const cleanPronounce = ex.word.replace('/', ', ');
                  return (
                    <div
                      key={i}
                      onClick={() => playSpeech(cleanPronounce, audioId, 0.85)}
                      className={`p-3 rounded-2xl border flex flex-wrap items-center justify-between gap-2 cursor-pointer transition-all ${
                        isPlaying(audioId)
                          ? 'bg-sky-50 dark:bg-sky-950/60 border-sky-400 ring-1 ring-sky-400'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700 hover:border-sky-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <AudioButton
                          size="sm"
                          isPlaying={isPlaying(audioId)}
                          onClick={(e) => {
                            e.stopPropagation();
                            playSpeech(cleanPronounce, audioId, 0.85);
                          }}
                        />
                        <div className="min-w-0">
                          <span className="font-en font-bold text-sm sm:text-base text-slate-900 dark:text-white break-words">
                            {highlightPhonicsCombo(ex.word, rule.combination)}
                          </span>
                          <span className="mx-2 text-slate-400">•</span>
                          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 break-words">
                            {ex.phoneticAr}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs text-slate-600 dark:text-slate-400 font-medium break-words">
                        {ex.meaningAr}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {subTab === 'quiz' && (
        <div className="max-w-3xl mx-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-sky-600 shrink-0" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white break-words">
              اختبار الفهم الصوتي السريع (A0)
            </h3>
          </div>

          <div className="space-y-5">
            {PHONICS_QUIZ.map((q, qIdx) => {
              const chosen = quizAnswers[q.id];
              const isSubmitted = chosen !== undefined;
              return (
                <div
                  key={q.id}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3"
                >
                  <div className="text-sm font-bold text-slate-900 dark:text-white break-words">
                    {qIdx + 1}. {q.questionAr}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {q.options.map((opt, oIdx) => {
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
                          onClick={() => handleSelectQuiz(q.id, oIdx, q.correctIndex)}
                          className={`p-3.5 min-h-[46px] rounded-xl border text-start text-xs sm:text-sm flex items-center justify-between gap-2.5 transition cursor-pointer ${cls}`}
                        >
                          <span className="flex-1 break-words whitespace-normal leading-snug">{opt}</span>
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
                    <p className="text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-200 dark:border-slate-700 break-words leading-relaxed">
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
  );
};
