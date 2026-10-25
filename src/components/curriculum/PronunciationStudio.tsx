import React, { useState } from 'react';
import {
  Volume2,
  Sparkles,
  BookOpen,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  Mic,
  RotateCcw,
} from 'lucide-react';
import { PRONUNCIATION_TOPICS } from '../../data/pronunciationData.ts';
import { useAudioSpeaker } from '../../hooks/useAudioSpeaker.ts';
import { AudioButton } from '../common/AudioButton.tsx';
import { playSuccessChime, playWrongTone, playPopSound } from '../../utils/audioEffects.ts';
import { useLearning } from '../../context/LearningContext.tsx';
import { AlphabetPhonicsStudio } from './AlphabetPhonicsStudio.tsx';

export const PronunciationStudio: React.FC = () => {
  const { progress } = useLearning();
  const { isPlaying, playSpeech } = useAudioSpeaker();

  // Top subtab: Alphabet Phonics vs Minimal Pairs
  const [activeSection, setActiveSection] = useState<'minimal_pairs' | 'alphabet_phonics'>('minimal_pairs');
  const [selectedTopicId, setSelectedTopicId] = useState<string>(PRONUNCIATION_TOPICS[0].id);

  // Speech Recognition state
  const [isRecording, setIsRecording] = useState(false);
  const [spokenTranscript, setSpokenTranscript] = useState('');
  const [testTargetWord, setTestTargetWord] = useState('');
  const [micFeedback, setMicFeedback] = useState<'success' | 'retry' | 'unsupported' | null>(null);

  const activeTopic =
    PRONUNCIATION_TOPICS.find((t) => t.id === selectedTopicId) || PRONUNCIATION_TOPICS[0];

  const handleStartMic = (targetWord: string) => {
    setTestTargetWord(targetWord);
    setSpokenTranscript('');
    setMicFeedback(null);

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setMicFeedback('unsupported');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = progress.preferredAccent === 'UK' ? 'en-GB' : 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsRecording(true);
        playPopSound();
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.trim().toLowerCase();
        setSpokenTranscript(transcript);
        const targetClean = targetWord.toLowerCase().trim();

        if (transcript === targetClean || transcript.includes(targetClean)) {
          setMicFeedback('success');
          if (progress.soundEffectsEnabled) playSuccessChime();
        } else {
          setMicFeedback('retry');
          if (progress.soundEffectsEnabled) playWrongTone();
        }
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
    } catch (e) {
      setIsRecording(false);
      console.warn('Speech recognition error:', e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Toggle: Minimal Pairs vs Alphabet Soundboard */}
      <div className="flex items-center justify-between flex-wrap gap-3 p-3 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              playPopSound();
              setActiveSection('minimal_pairs');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-black cursor-pointer transition select-none flex items-center gap-1.5 ${
              activeSection === 'minimal_pairs'
                ? 'bg-[#1cb0f6] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Mic className="w-4 h-4" />
            <span>الأزواج الصوتية الصعبة والتسجيل المباشر</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playPopSound();
              setActiveSection('alphabet_phonics');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-black cursor-pointer transition select-none flex items-center gap-1.5 ${
              activeSection === 'alphabet_phonics'
                ? 'bg-[#58cc02] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>لوحة الأبجدية وقواعد الفونكس التأسيسية</span>
          </button>
        </div>
      </div>

      {/* Render Alphabet Phonics Studio if selected */}
      {activeSection === 'alphabet_phonics' ? (
        <AlphabetPhonicsStudio />
      ) : (
        <>
          {/* Header Banner */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-b-6 border-slate-200 border-b-slate-300 dark:border-slate-800 dark:border-b-slate-950 space-y-2 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-black text-[#1cb0f6]">
              <Sparkles className="w-4 h-4 text-[#1cb0f6]" />
              <span>مختبر الصوتيات وعلاج صعوبات النطق للمتحدث العربي</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              إتقان النطق ومخارج الحروف مع التسجيل الصوتي المباشر
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
              استمع لأزواج الكلمات المتقاربة صوتياً (Minimal Pairs) وسجّل نطقك بالميكروفون لاختبار دقة مخارج الحروف.
            </p>
          </div>

          {/* Voice Recognition Feedback Card (if active) */}
          {(isRecording || micFeedback) && (
            <div
              className={`p-5 rounded-3xl border-2 space-y-3 text-right animate-in fade-in ${
                isRecording
                  ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-400'
                  : micFeedback === 'success'
                  ? 'bg-[#d7ffb8] dark:bg-emerald-950/80 border-[#58cc02]'
                  : micFeedback === 'unsupported'
                  ? 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700'
                  : 'bg-[#ffdfe0] dark:bg-rose-950/80 border-[#ff4b4b]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isRecording ? (
                    <>
                      <div className="w-4 h-4 rounded-full bg-red-500 animate-ping" />
                      <span className="font-black text-sm text-amber-900 dark:text-amber-200">
                        جاري الاستماع... انطق كلمة "{testTargetWord}" الآن!
                      </span>
                    </>
                  ) : micFeedback === 'success' ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-[#58cc02]" />
                      <span className="font-black text-sm text-emerald-900 dark:text-emerald-200">
                        نطق ممتاز ومطابق 100%!
                      </span>
                    </>
                  ) : micFeedback === 'unsupported' ? (
                    <>
                      <AlertTriangle className="w-5 h-5 text-amber-500" />
                      <span className="font-black text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                        التعرف الصوتي غير متاح في هذا المتصفح. يمكنك الاستماع لمقارنة النطق الصوتي بالزر الصوتي.
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-5 h-5 text-[#ff4b4b]" />
                      <span className="font-black text-sm text-rose-900 dark:text-rose-200">
                        سمعنا: "{spokenTranscript || 'صوت غير واضح'}" والمطلوب: "{testTargetWord}"
                      </span>
                    </>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleStartMic(testTargetWord)}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-xs font-bold border border-slate-200 dark:border-slate-700 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>إعادة التجربة</span>
                </button>
              </div>
            </div>
          )}

          {/* Topic Selection Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {PRONUNCIATION_TOPICS.map((topic) => {
              const isSelected = selectedTopicId === topic.id;
              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => {
                    playPopSound();
                    setSelectedTopicId(topic.id);
                    setMicFeedback(null);
                  }}
                  className={`px-4 py-2.5 rounded-2xl border-2 text-xs font-black whitespace-nowrap cursor-pointer transition select-none ${
                    isSelected
                      ? 'bg-[#1cb0f6] border-[#1899d6] text-white shadow-xs'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-sky-300'
                  }`}
                >
                  {topic.titleAr}
                </button>
              );
            })}
          </div>

          {/* Active Topic Content */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border-2 border-b-6 border-slate-200 border-b-slate-300 dark:border-slate-800 dark:border-b-slate-950 p-5 sm:p-6 space-y-6 shadow-xs">
            <div className="space-y-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center justify-between">
                <span className="font-en text-xs font-bold text-[#1cb0f6]">
                  {activeTopic.titleEn}
                </span>
                <span className="font-en px-2.5 py-0.5 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-black text-xs">
                  {activeTopic.phonemePair}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                {activeTopic.titleAr}
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                {activeTopic.summaryAr}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/80 text-xs text-amber-900 dark:text-amber-200 space-y-1">
                  <span className="font-black flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                    <span>حركة الفم ومخرج الصوت:</span>
                  </span>
                  <p className="font-medium leading-relaxed">{activeTopic.mouthPositionAr}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/80 text-xs text-rose-900 dark:text-rose-200 space-y-1">
                  <span className="font-black flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    <span>الخطأ الشائع عند العرب:</span>
                  </span>
                  <p className="font-medium leading-relaxed">{activeTopic.arabicTransferWarningAr}</p>
                </div>
              </div>
            </div>

            {/* Minimal Pairs Drill Table */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-sky-500" />
                  <span>تدريب الأزواج المتقاربة صوتياً (استمع وقارن وسجل):</span>
                </h4>
                <span className="text-xs text-slate-400 font-bold">
                  {activeTopic.minimalPairs.length} أزواج تدريبية
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {activeTopic.minimalPairs.map((pair, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 hover:border-sky-300 transition-colors flex flex-col sm:flex-row items-center justify-between gap-4"
                  >
                    {/* Word A */}
                    <div className="flex-1 w-full flex items-center justify-between sm:justify-start gap-3 p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <span className="font-en font-black text-base text-slate-900 dark:text-white">
                            {pair.wordA}
                          </span>
                          <span className="font-en text-xs text-sky-600 dark:text-sky-400 font-bold">
                            {pair.ipaA}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">
                          {pair.meaningArA}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <AudioButton
                          size="sm"
                          isPlaying={isPlaying(`pair-a-${idx}`)}
                          onClick={() => playSpeech(pair.wordA, `pair-a-${idx}`)}
                        />
                        <button
                          type="button"
                          onClick={() => handleStartMic(pair.wordA)}
                          className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 text-sky-600 dark:text-sky-400 cursor-pointer"
                          title={`اختبر نطقك لكلمة ${pair.wordA}`}
                        >
                          <Mic className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="text-slate-400 font-black text-xs shrink-0 select-none">
                      مقابل VS
                    </div>

                    {/* Word B */}
                    <div className="flex-1 w-full flex items-center justify-between sm:justify-start gap-3 p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <span className="font-en font-black text-base text-slate-900 dark:text-white">
                            {pair.wordB}
                          </span>
                          <span className="font-en text-xs text-purple-600 dark:text-purple-400 font-bold">
                            {pair.ipaB}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">
                          {pair.meaningArB}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <AudioButton
                          size="sm"
                          isPlaying={isPlaying(`pair-b-${idx}`)}
                          onClick={() => playSpeech(pair.wordB, `pair-b-${idx}`)}
                        />
                        <button
                          type="button"
                          onClick={() => handleStartMic(pair.wordB)}
                          className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 text-purple-600 dark:text-purple-400 cursor-pointer"
                          title={`اختبر نطقك لكلمة ${pair.wordB}`}
                        >
                          <Mic className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
