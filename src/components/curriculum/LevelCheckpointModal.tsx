import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  Award,
  ArrowLeft,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import type { CEFRLevel } from '../../types/learning.ts';
import { LEVEL_CHECKPOINTS } from '../../data/levelCheckpoints.ts';
import { useLearning } from '../../context/LearningContext.tsx';
import { playSuccessChime, playWrongTone, playPopSound } from '../../utils/audioEffects.ts';
import { Modal } from '../common/Modal.tsx';
import { FaresMascot } from '../common/FaresMascot.tsx';

interface LevelCheckpointModalProps {
  level: CEFRLevel;
  isOpen: boolean;
  onClose: () => void;
  onLevelPassed?: (newLevel: CEFRLevel) => void;
}

export const LevelCheckpointModal: React.FC<LevelCheckpointModalProps> = ({
  level,
  isOpen,
  onClose,
  onLevelPassed,
}) => {
  const { progress, awardXp, updateUserProfile } = useLearning();
  const checkpoint = LEVEL_CHECKPOINTS.find((c) => c.level === level) || LEVEL_CHECKPOINTS[0];

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [isFinished, setIsFinished] = useState(false);

  if (!isOpen) return null;

  const currentQ = checkpoint.questions[currentIdx];
  const totalQuestions = checkpoint.questions.length;

  const handleSelectOption = (optIdx: number) => {
    setSelectedOption(optIdx);
    playPopSound();
  };

  const handleConfirmNext = () => {
    if (selectedOption === null) return;
    const isCorrect = selectedOption === currentQ.correctIndex;
    if (isCorrect) {
      if (progress.soundEffectsEnabled) playSuccessChime();
    } else {
      if (progress.soundEffectsEnabled) playWrongTone();
    }

    const nextAnswers = { ...userAnswers, [currentIdx]: selectedOption };
    setUserAnswers(nextAnswers);
    setSelectedOption(null);

    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setIsFinished(true);
      // Evaluate score
      let correct = 0;
      checkpoint.questions.forEach((q, idx) => {
        if (nextAnswers[idx] === q.correctIndex) correct++;
      });
      const passed = correct >= checkpoint.passingScore;
      if (passed) {
        awardXp(100, `اجتياز اختبار كفاءة ${checkpoint.level}`);
        if (onLevelPassed) {
          onLevelPassed(checkpoint.nextLevel);
        }
        updateUserProfile({ estimatedLevel: checkpoint.nextLevel });
      }
    }
  };

  const calculateScore = () => {
    let score = 0;
    checkpoint.questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIndex) score++;
    });
    return score;
  };

  const finalScore = calculateScore();
  const hasPassed = finalScore >= checkpoint.passingScore;

  const handleRestart = () => {
    playPopSound();
    setCurrentIdx(0);
    setSelectedOption(null);
    setUserAnswers({});
    setIsFinished(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-2xl"
      title={
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500 shrink-0" />
          <span className="font-black text-slate-900 dark:text-white">
            {checkpoint.titleAr}
          </span>
        </div>
      }
      subtitle={
        <span className="font-en text-xs text-slate-400 font-bold">
          {checkpoint.titleEn}
        </span>
      }
    >
      <div className="space-y-6">
        {!isFinished ? (
          <div className="space-y-5">
            {/* Progress */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
                <span>
                  السؤال {currentIdx + 1} من {totalQuestions}
                </span>
                <span>درجة النجاح المطلوبة: {checkpoint.passingScore} من {totalQuestions}</span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-300"
                  style={{ width: `${((currentIdx + 1) / totalQuestions) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Box */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <span className="text-xs font-black text-slate-500 dark:text-slate-400 block">
                {currentQ.questionAr || 'اختر الإجابة الإنجليزية الصحيحة:'}
              </span>
              <div
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 font-en text-sm sm:text-base font-bold text-slate-900 dark:text-white"
                dir="ltr"
              >
                {currentQ.questionEn || currentQ.question}
              </div>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" dir="ltr">
              {currentQ.options.map((opt, oIdx) => {
                const isSelected = selectedOption === oIdx;
                return (
                  <button
                    key={oIdx}
                    type="button"
                    onClick={() => handleSelectOption(oIdx)}
                    className={`p-4 rounded-xl border text-left text-sm font-semibold transition cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 ring-2 ring-amber-500/20'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <span className="flex-1 break-words">{opt}</span>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Next button */}
            <div className="pt-2">
              <button
                type="button"
                disabled={selectedOption === null}
                onClick={handleConfirmNext}
                className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-slate-900 font-black text-sm border-b-4 border-amber-600 active:border-b-0 active:translate-y-1 transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                <span>{currentIdx < totalQuestions - 1 ? 'السؤال التالي' : 'إنهاء الاختبار وتقييم المستوى'}</span>
                <ArrowLeft className="w-4 h-4 shrink-0" />
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center space-y-6">
            <FaresMascot mood={hasPassed ? 'cheering' : 'thinking'} size="lg" />

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                {hasPassed
                  ? checkpoint.level === 'C2'
                    ? '🎉 مبارك التخرج والوصول إلى البراعة اللغوية C2 Mastery!'
                    : `تهانينا! اجتزت اختبار الانتقال إلى ${checkpoint.nextLevel} بنجاح`
                  : 'لم توفق هذه المرة، راجع دروس المستوى وأعد المحاولة!'}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                حققت {finalScore} من أصل {totalQuestions} سؤالاً (المطلوب {checkpoint.passingScore}).
              </p>
            </div>

            {hasPassed ? (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>
                  {checkpoint.level === 'C2'
                    ? 'أنت الآن في أعلى مراتب الطلاقة والتمكن بالإنجليزية (Native-level Proficiency)!'
                    : `تمت ترقية مستواك واعتماد انتقالك بنجاح إلى المستوى ${checkpoint.nextLevel}!`}
                </span>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 font-bold text-xs">
                ننصحك بمراجعة شرح القواعد والتمارين في هذا المستوى قبل المحاولة القادمة.
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              {!hasPassed && (
                <button
                  type="button"
                  onClick={handleRestart}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-sm transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>إعادة الاختبار</span>
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#58cc02] hover:bg-[#46a302] text-white font-black text-sm border-b-4 border-[#46a302] active:border-b-0 active:translate-y-1 transition-all cursor-pointer shadow-md"
              >
                متابعة التعلم
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
