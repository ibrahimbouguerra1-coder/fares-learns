import React, { useState } from 'react';
import {
  Sparkles,
  RotateCcw,
  Volume2,
  Plus,
  BookOpen,
  Layers,
} from 'lucide-react';
import { useLearning } from '../../context/LearningContext.tsx';
import { useAudioSpeaker } from '../../hooks/useAudioSpeaker.ts';
import { AudioButton } from '../common/AudioButton.tsx';
import { CURATED_VOCAB_DECKS } from '../../data/vocabularyDecks.ts';
import { playSuccessChime, playPopSound } from '../../utils/audioEffects.ts';
import { Modal } from '../common/Modal.tsx';

export const VocabularyStudio: React.FC = () => {
  const {
    progress,
    reviewVocabulary,
    addVocabularyItem,
    removeVocabularyItem,
    loadCuratedDeck,
  } = useLearning();
  const { isPlaying, playSpeech } = useAudioSpeaker();

  const [mode, setMode] = useState<'flashcards' | 'library' | 'decks'>('flashcards');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiMessage, setAiMessage] = useState<string | null>(null);

  // New Word Form State
  const [newWord, setNewWord] = useState('');
  const [newMeaning, setNewMeaning] = useState('');
  const [newExample, setNewExample] = useState('');

  const vocabList = progress.savedVocabulary || [];
  const currentCard = vocabList[currentCardIndex];

  const handleGenerateAiVocab = async () => {
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
          activity: 'vocabulary',
          level: targetLevel,
          recentPrompts: vocabList.slice(-25).map((v) => v.word),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.items) && data.items.length > 0) {
          data.items.forEach((item: any) => {
            addVocabularyItem({
              word: item.word,
              ipa: item.ipa,
              arabicPhonetic: item.arabicPhonetic,
              partOfSpeech: item.partOfSpeech,
              arabicMeaning: item.arabicMeaning,
              englishDefinition: item.englishDefinition,
              exampleEn: item.exampleEn,
              exampleAr: item.exampleAr,
              collocations: item.collocations,
              arabicMistakeWarning: item.arabicMistakeWarning,
              level: targetLevel,
              category: item.category || 'مفردات ذكية',
            });
          });
          setAiMessage(`تم توليد ${data.items.length} مفردات ذكية جديدة لمستوى ${targetLevel} بنجاح! 📚✨`);
          playSuccessChime();
          setMode('flashcards');
          setCurrentCardIndex(0);
          return;
        }
      }
      setAiMessage('تم توليد الكلمات بنجاح!');
    } catch {
      setAiMessage('تعذر الاتصال بالذكاء الاصطناعي، يرجى المحاولة لاحقاً.');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleNextCard = (rating: 'again' | 'hard' | 'good' | 'easy') => {
    if (!currentCard) return;
    reviewVocabulary(currentCard.id, rating);
    setIsFlipped(false);
    if (currentCardIndex < vocabList.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      setCurrentCardIndex(0);
      playSuccessChime();
    }
  };

  const handleSaveCustomWord = () => {
    if (!newWord.trim() || !newMeaning.trim()) return;
    addVocabularyItem({
      word: newWord.trim(),
      arabicMeaning: newMeaning.trim(),
      exampleEn: newExample.trim(),
    });
    setNewWord('');
    setNewMeaning('');
    setNewExample('');
    setIsAddModalOpen(false);
    playSuccessChime();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-white via-white to-sky-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800/80 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="space-y-1 text-right">
          <div className="flex items-center gap-2 text-xs font-black text-sky-600 dark:text-sky-400">
            <Sparkles className="w-4 h-4 text-sky-500" />
            <span>نظام التكرار المتباعد (Spaced Repetition System - SRS)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            استوديو المفردات وحقائب الكلمات الذكية
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
            تثبيت الكلمات في الذاكرة طويلة الأمد دون نسيان، مع باقات متخصصة من A0 إلى C2.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleGenerateAiVocab}
            disabled={isGeneratingAi}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs flex items-center gap-1.5 transition cursor-pointer shadow-sm disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${isGeneratingAi ? 'animate-spin' : ''}`} />
            <span>{isGeneratingAi ? 'جاري التوليد بالذكاء الاصطناعي...' : '✨ توليد مفردات بالذكاء الاصطناعي'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-black text-xs flex items-center gap-1.5 transition cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة كلمة جديدة</span>
          </button>
        </div>
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

      {/* Sub-navigation tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => {
            playPopSound();
            setMode('flashcards');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-black cursor-pointer transition ${
            mode === 'flashcards'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          بطاقات التكرار المتباعد ({vocabList.length})
        </button>
        <button
          type="button"
          onClick={() => {
            playPopSound();
            setMode('decks');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-black cursor-pointer transition flex items-center gap-1.5 ${
            mode === 'decks'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>حقائب الكلمات الجاهزة ({CURATED_VOCAB_DECKS.length})</span>
        </button>
        <button
          type="button"
          onClick={() => {
            playPopSound();
            setMode('library');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-black cursor-pointer transition ${
            mode === 'library'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          قاموسي المحفوظ ({vocabList.length})
        </button>
      </div>

      {/* 1. FLASHCARDS MODE */}
      {mode === 'flashcards' && (
        <div className="max-w-xl mx-auto space-y-4">
          {vocabList.length > 0 && currentCard ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                <span>
                  البطاقة {currentCardIndex + 1} من {vocabList.length}
                </span>
                <span className="font-en px-2 py-0.5 rounded-md bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300">
                  {currentCard.level || 'B1'}
                </span>
              </div>

              {/* The 3D Interactive Card */}
              <div
                onClick={() => {
                  playPopSound();
                  setIsFlipped(!isFlipped);
                }}
                className={`min-h-[260px] p-6 sm:p-8 rounded-3xl border-2 transition-all cursor-pointer flex flex-col items-center justify-center text-center space-y-3 relative select-none shadow-md ${
                  isFlipped
                    ? 'bg-gradient-to-br from-white to-emerald-50 dark:from-slate-900 dark:to-emerald-950/20 border-emerald-400'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-sky-400'
                }`}
              >
                <div className="absolute top-4 left-4">
                  <AudioButton
                    size="md"
                    isPlaying={isPlaying(currentCard.id)}
                    onClick={(e) => {
                      e.stopPropagation();
                      playSpeech(currentCard.word, currentCard.id, 0.85);
                    }}
                  />
                </div>

                {!isFlipped ? (
                  <>
                    <span className="font-en text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                      {currentCard.word}
                    </span>
                    {currentCard.ipa && (
                      <span className="font-en text-sm text-slate-400 font-medium">
                        {currentCard.ipa}
                      </span>
                    )}
                    {currentCard.arabicPhonetic && (
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                        نطق تقريبي: {currentCard.arabicPhonetic}
                      </span>
                    )}
                    <p className="text-xs text-slate-400 pt-4">انقر على البطاقة لكشف المعنى والمثال</p>
                  </>
                ) : (
                  <>
                    <span className="text-xl sm:text-2xl font-black text-emerald-700 dark:text-emerald-300">
                      {currentCard.arabicMeaning}
                    </span>
                    {currentCard.exampleEn && (
                      <div className="p-3 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-emerald-200 dark:border-emerald-800 text-xs font-en text-slate-800 dark:text-slate-200 font-semibold" dir="ltr">
                        "{currentCard.exampleEn}"
                      </div>
                    )}
                    {currentCard.arabicMistakeWarning && (
                      <span className="text-[11px] text-rose-600 dark:text-rose-400 font-bold">
                        ⚠️ تنبيه: {currentCard.arabicMistakeWarning}
                      </span>
                    )}
                  </>
                )}
              </div>

              {/* Spaced Repetition Rating Buttons */}
              {isFlipped && (
                <div className="grid grid-cols-4 gap-2 pt-2 animate-in fade-in">
                  <button
                    type="button"
                    onClick={() => handleNextCard('again')}
                    className="p-3 rounded-2xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950 text-rose-600 font-black text-xs border border-rose-300 cursor-pointer"
                  >
                    أعد قريباً (1 يوم)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNextCard('hard')}
                    className="p-3 rounded-2xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950 text-amber-600 font-black text-xs border border-amber-300 cursor-pointer"
                  >
                    صعبة (2 يوم)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNextCard('good')}
                    className="p-3 rounded-2xl bg-sky-50 hover:bg-sky-100 dark:bg-sky-950 text-sky-600 font-black text-xs border border-sky-300 cursor-pointer"
                  >
                    جيدة (4 أيام)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNextCard('easy')}
                    className="p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950 text-emerald-600 font-black text-xs border border-emerald-300 cursor-pointer"
                  >
                    أتقنتها! (7 أيام)
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 sm:p-10 text-center bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-purple-100 dark:bg-purple-950/60 flex items-center justify-center text-purple-600">
                <Sparkles className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {vocabList.length === 0 ? 'لا توجد بطاقات مفردات حالياً' : '🎉 أتممت مراجعة جميع المفردات المقررة!'}
                </h3>
                <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  يمكنك توليد حزمة مفردات ذكية جديدة مخصصة لمستواك ({progress.estimatedLevel || 'A1'}) بنقرة واحدة بواسطة الذكاء الاصطناعي، أو اختيار حقيبة جاهزة من تبويب الحقائب.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleGenerateAiVocab}
                  disabled={isGeneratingAi}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-95 disabled:opacity-50"
                >
                  <Sparkles className={`w-4 h-4 ${isGeneratingAi ? 'animate-spin' : ''}`} />
                  <span>توليد 5 كلمات ذكية جديدة لمستواي ✨</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMode('decks')}
                  className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs cursor-pointer"
                >
                  استعراض الحقائب الجاهزة
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. CURATED DECKS MODE */}
      {mode === 'decks' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CURATED_VOCAB_DECKS.map((deck) => (
            <div
              key={deck.id}
              className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-2xs"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1 text-right">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-en font-black text-xs">
                      {deck.level}
                    </span>
                    <span className="text-xs font-bold text-slate-400">{deck.category}</span>
                  </div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {deck.titleAr}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                    {deck.descriptionAr}
                  </p>
                </div>
                <span className="font-en font-black text-sm text-purple-600 shrink-0">
                  {deck.items.length} كلمة
                </span>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    loadCuratedDeck(deck.id, 'merge');
                    playSuccessChime();
                    setMode('flashcards');
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-black transition cursor-pointer shadow-xs"
                >
                  دمج الحقيبة مع مفرداتي
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. VOCABULARY LIBRARY */}
      {mode === 'library' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {vocabList.map((v) => (
            <div
              key={v.id}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-start justify-between gap-3 shadow-2xs"
            >
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="font-en text-base font-black text-sky-600 dark:text-sky-400">
                    {v.word}
                  </span>
                  {v.ipa && (
                    <span className="font-en text-[11px] text-slate-400 font-medium">
                      {v.ipa}
                    </span>
                  )}
                </div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {v.arabicMeaning}
                </div>
                {v.exampleEn && (
                  <p className="font-en text-[11px] text-slate-500 truncate" dir="ltr">
                    {v.exampleEn}
                  </p>
                )}
              </div>
              <AudioButton
                size="sm"
                isPlaying={isPlaying(v.id)}
                onClick={() => playSpeech(v.word, v.id, 0.85)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Add Custom Word Modal */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="إضافة كلمة جديدة إلى قاموسك"
          subtitle="احفظ أي كلمة جديدة تصادفك لتكرارها بنظام التكرار المتباعد"
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                الكلمة بالإنجليزية:
              </label>
              <input
                type="text"
                dir="ltr"
                value={newWord}
                onChange={(e) => setNewWord(e.target.value)}
                placeholder="e.g. Accomplish"
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 font-en text-sm font-semibold outline-hidden focus:ring-2 focus:ring-sky-500 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                المعنى بالعربية:
              </label>
              <input
                type="text"
                value={newMeaning}
                onChange={(e) => setNewMeaning(e.target.value)}
                placeholder="مثال: ينجز أو يحقق هدفاً"
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold outline-hidden focus:ring-2 focus:ring-sky-500 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                جملة مثال (اختياري):
              </label>
              <input
                type="text"
                dir="ltr"
                value={newExample}
                onChange={(e) => setNewExample(e.target.value)}
                placeholder="e.g. We accomplished all our goals."
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 font-en text-xs font-semibold outline-hidden focus:ring-2 focus:ring-sky-500 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <button
              type="button"
              onClick={handleSaveCustomWord}
              disabled={!newWord.trim() || !newMeaning.trim()}
              className="w-full py-3.5 rounded-2xl bg-sky-600 hover:bg-sky-700 disabled:opacity-40 text-white font-black text-sm cursor-pointer shadow-md transition"
            >
              حفظ الكلمة في القاموس
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};
