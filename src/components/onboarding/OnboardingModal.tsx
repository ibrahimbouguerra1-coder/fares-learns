import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  ArrowLeft,
  Volume2,
  GraduationCap,
  HelpCircle,
  MessageSquareText,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useLearning } from '../../context/LearningContext.tsx';
import type {
  CEFRLevel,
  EnglishAccent,
  LearningGoal,
  SkillLevels,
} from '../../types/learning.ts';
import { Modal } from '../common/Modal.tsx';

interface PlacementQuestion {
  id: number;
  skill: keyof SkillLevels;
  level: CEFRLevel;
  questionAr: string;
  sentenceEn: string;
  options: string[];
  correctIndex: number;
}

const QUICK_PLACEMENT_QUESTIONS: PlacementQuestion[] = [
  {
    id: 1,
    skill: 'grammar',
    level: 'A1',
    questionAr: 'اختر تصريف فعل الكينونة المناسب:',
    sentenceEn: 'Where ___ you from?',
    options: ['is', 'are', 'am', 'be'],
    correctIndex: 1,
  },
  {
    id: 2,
    skill: 'vocabulary',
    level: 'A2',
    questionAr: 'اختر الكلمة المتلازمة مع mistake:',
    sentenceEn: "Don't worry, everyone ___ mistakes when learning.",
    options: ['does', 'makes', 'takes', 'gives'],
    correctIndex: 1,
  },
  {
    id: 3,
    skill: 'grammar',
    level: 'B1',
    questionAr: 'اختر الزمن المناسب لحدث ممتد من الماضي للحاضر:',
    sentenceEn: 'I ___ at this company for five years now.',
    options: ['work', 'worked', 'have worked', 'am working'],
    correctIndex: 2,
  },
  {
    id: 4,
    skill: 'grammar',
    level: 'B2',
    questionAr: 'اختر التركيب الشرطي الثاني الافتراضي:',
    sentenceEn: 'If I ___ in your position, I would negotiate.',
    options: ['am', 'was to', 'were', 'had been'],
    correctIndex: 2,
  },
  {
    id: 5,
    skill: 'grammar',
    level: 'C1',
    questionAr: 'اختر صيغة القلب النحوي بعد عبارة النفي Not only:',
    sentenceEn: 'Not only ___ the target, but they also cut costs.',
    options: ['did they meet', 'they met', 'they did meet', 'had they met'],
    correctIndex: 0,
  },
];

export const LEVEL_DETAILS: {
  id: CEFRLevel;
  badge: string;
  titleAr: string;
  descAr: string;
  chatDifficultyAr: string;
}[] = [
  {
    id: 'A0',
    badge: 'A0 مبتدئ من الصفر',
    titleAr: 'تأسيس من الصفر - A0',
    descAr: 'الأبجدية الإنجليزية، مخارج الحروف، التمييز بين P و B، والأرقام والتحيات الأساسية.',
    chatDifficultyAr: 'جمل بسيطة وقصيرة (3-5 كلمات مع ترجمة فورية).',
  },
  {
    id: 'A1',
    badge: 'A1 مبتدئ مكتسب',
    titleAr: 'المبتدئ المكتسب - A1',
    descAr: 'فعل الكينونة To Be، المضارع البسيط، أدوات النكرة a/an، والسؤال عن المعلومات اليومية.',
    chatDifficultyAr: 'جمل واضحة حول الروتين والحياة اليومية.',
  },
  {
    id: 'A2',
    badge: 'A2 ابتدائي',
    titleAr: 'المستوى الابتدائي - A2',
    descAr: 'الماضي البسيط والأفعال الشاذة، حروف الجر in/on/at، وصيغ المقارنة والمستقبل.',
    chatDifficultyAr: 'محادثة ممتدة حول المواقف الحياتية والعمل.',
  },
  {
    id: 'B1',
    badge: 'B1 متوسط',
    titleAr: 'المستوى المتوسط - B1',
    descAr: 'المضارع التام، الماضي المستمر، الشروط، الأفعال المركبة، والمبني للمجهول.',
    chatDifficultyAr: 'محادثات متقدمة في بيئة العمل والنقاشات المهنية.',
  },
  {
    id: 'B2',
    badge: 'B2 فوق المتوسط',
    titleAr: 'فوق المتوسط - B2',
    descAr: 'الماضي التام، الشرطية الثالثة، الكلام المنقول، وجمل الوصل المتقدمة وتجنب الضمير العائد.',
    chatDifficultyAr: 'نقاشات معمقة ومفاوضات باللغة الإنجليزية المتخصصة.',
  },
  {
    id: 'C1',
    badge: 'C1 متقدم واحترافي',
    titleAr: 'المستوى المتقدم - C1',
    descAr: 'القلب النحوي البلاغي (Inversion)، صيغة Subjunctive، الجمل المشقوقة، والتحفظ الأكاديمي.',
    chatDifficultyAr: 'خطاب أكاديمي ورصانة تنفيذية ونبرة محكمة.',
  },
  {
    id: 'C2',
    badge: 'C2 إتقان تام وطلاقة مطلقة',
    titleAr: 'الإتقان والبلاغة - C2',
    descAr: 'الفروق الدلالية الدقيقة، التوازي والقلب المتقاطع (Chiasmus)، ونثر النخبة العالمية.',
    chatDifficultyAr: 'أدب رفيع وبلاغة المتحدث الأصلي المتمكن.',
  },
];

interface OnboardingModalProps {
  onComplete: () => void;
  canClose?: boolean;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  onComplete,
  canClose = true,
}) => {
  const { progress, completeOnboarding, resetProgress } = useLearning();
  const [mode, setMode] = useState<'select_level' | 'quiz'>('select_level');
  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel>(
    progress.hasCompletedOnboarding ? progress.estimatedLevel : 'A0'
  );
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [name, setName] = useState(
    progress.name && progress.name !== 'متعلم جديد' ? progress.name : ''
  );
  const [goal] = useState<LearningGoal>(progress.primaryGoal || 'fluent_speaking');
  const [accent, setAccent] = useState<EnglishAccent>(progress.preferredAccent || 'US');
  const [confirmFullReset, setConfirmFullReset] = useState(false);

  useEffect(() => {
    if (progress.hasCompletedOnboarding) {
      setSelectedLevel(progress.estimatedLevel);
    }
  }, [progress.estimatedLevel, progress.hasCompletedOnboarding]);

  const handleNextQuestion = () => {
    if (selectedOption === null) return;
    const q = QUICK_PLACEMENT_QUESTIONS[currentQ];
    const updatedAnswers = { ...answers, [q.id]: selectedOption };
    setAnswers(updatedAnswers);
    setSelectedOption(null);

    if (currentQ < QUICK_PLACEMENT_QUESTIONS.length - 1) {
      setCurrentQ((prev) => prev + 1);
    } else {
      let score = 0;
      QUICK_PLACEMENT_QUESTIONS.forEach((question) => {
        if (updatedAnswers[question.id] === question.correctIndex) {
          score += 1;
        }
      });
      const computedLevel: CEFRLevel =
        score === 0 ? 'A0' : score === 1 ? 'A1' : score === 2 ? 'A2' : score === 3 ? 'B1' : score === 4 ? 'B2' : 'C1';
      setSelectedLevel(computedLevel);
      setMode('select_level');
    }
  };

  const handleSaveAndStart = () => {
    const skills: SkillLevels = {
      grammar: selectedLevel,
      vocabulary: selectedLevel,
      reading: selectedLevel,
      listening: selectedLevel,
      speaking: selectedLevel,
      writing: selectedLevel,
    };

    completeOnboarding({
      name: name.trim() || 'متعلم فارس',
      level: selectedLevel,
      skills,
      goal,
      dailyMinutes: 15,
      mode:
        selectedLevel === 'B2' || selectedLevel === 'C1' || selectedLevel === 'C2'
          ? 'immersion'
          : 'arabic_assisted',
      accent,
      focusAreas: ['p_vs_b', 'verb_to_be_omission', 'present_perfect', 'prepositions'],
      arabicDialect: 'fusha',
      industryInterests: ['daily', 'business', 'tech'],
    });

    onComplete();
  };

  const handleFullReset = () => {
    resetProgress();
    setSelectedLevel('A0');
    setName('');
    setConfirmFullReset(false);
  };

  const activeLevelInfo =
    LEVEL_DETAILS.find((l) => l.id === selectedLevel) || LEVEL_DETAILS[0];

  return (
    <Modal
      isOpen={true}
      onClose={() => {
        if (canClose && progress.hasCompletedOnboarding) {
          onComplete();
        }
      }}
      title="مرحباً بك في منصة فارس لتعليم الإنجليزية"
      subtitle="حدد مستواك الحالي للانطلاق في مسارك التعليمي المخصص بدقة"
      icon={<GraduationCap className="w-6 h-6 text-sky-600" />}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-5">
        {mode === 'select_level' ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 break-words">
                اختر مستواك مباشرة أو قم بإجراء اختبار تحديد المستوى السريع:
              </span>
              <button
                type="button"
                onClick={() => {
                  setCurrentQ(0);
                  setAnswers({});
                  setSelectedOption(null);
                  setMode('quiz');
                }}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-400/40 hover:bg-amber-500/25 text-xs font-extrabold flex items-center gap-1.5 transition cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5 shrink-0" />
                <span className="break-words">اختبار تحديد المستوى (5 أسئلة)</span>
              </button>
            </div>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {LEVEL_DETAILS.map((lvl) => {
                const isSelected = selectedLevel === lvl.id;
                return (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setSelectedLevel(lvl.id)}
                    className={`w-full p-4 rounded-2xl border text-right transition flex flex-col gap-2 cursor-pointer min-w-0 ${
                      isSelected
                        ? 'border-sky-500 bg-sky-50/90 dark:bg-sky-950/50 ring-2 ring-sky-500/20'
                        : 'border-slate-200 dark:border-slate-800 hover:border-sky-300 bg-white dark:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <span
                          className={`px-2.5 py-1 rounded-xl font-en font-black text-xs shrink-0 ${
                            isSelected
                              ? 'bg-sky-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {lvl.id}
                        </span>
                        <span className="font-extrabold text-sm text-slate-900 dark:text-white break-words">
                          {lvl.titleAr}
                        </span>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'border-sky-600 bg-sky-600 text-white'
                            : 'border-slate-300 dark:border-slate-600'
                        }`}
                      >
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 break-words leading-relaxed">
                      {lvl.descAr}
                    </p>
                    <div
                      className={`p-2 rounded-xl text-[11px] flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 ${
                        isSelected
                          ? 'bg-white/90 dark:bg-slate-900/90 border border-sky-200 dark:border-sky-800/80'
                          : 'bg-slate-50 dark:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold min-w-0">
                        <MessageSquareText className="w-3.5 h-3.5 shrink-0" />
                        <span className="break-words">مستوى المحادثة: {lvl.chatDifficultyAr}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  اسمك الكريم:
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="اكتب اسمك هنا..."
                  className="w-full px-3.5 py-2.5 min-h-[42px] rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-sky-500 outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  اللهجة الإنجليزية المفضلة:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'US', label: 'أمريكية US' },
                    { id: 'UK', label: 'بريطانية UK' },
                  ].map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => setAccent(a.id as EnglishAccent)}
                      className={`py-2.5 px-3 min-h-[42px] rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                        accent === a.id
                          ? 'border-sky-600 bg-sky-50 dark:bg-sky-950/60 text-sky-900 dark:text-sky-200'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <Volume2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                      <span className="break-words">{a.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 space-y-2.5">
              <button
                type="button"
                onClick={handleSaveAndStart}
                className="w-full py-3.5 px-4 min-h-[50px] rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-sky-600/20 transition cursor-pointer"
              >
                <Sparkles className="w-4 h-4 shrink-0" />
                <span className="break-words">
                  بدء التعلم في المستوى المختار: {activeLevelInfo.id}
                </span>
              </button>

              {progress.hasCompletedOnboarding && (
                <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 gap-2">
                  {!confirmFullReset ? (
                    <button
                      type="button"
                      onClick={() => setConfirmFullReset(true)}
                      className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                      <span>إعادة تعيين التقدم بالكامل للصفر</span>
                    </button>
                  ) : (
                    <div className="flex flex-wrap items-center justify-between w-full bg-red-50 dark:bg-red-950/40 px-3 py-2 rounded-xl border border-red-200 dark:border-red-800 text-xs gap-2">
                      <span className="font-bold text-red-800 dark:text-red-200 break-words">
                        هل أنت متأكد من تصفير جميع الدروس والمفردات المحفوظة؟
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleFullReset}
                          className="px-3 py-1 rounded-lg bg-red-600 text-white font-bold cursor-pointer"
                        >
                          نعم، صفّر الآن
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmFullReset(false)}
                          className="px-2 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
                        >
                          إلغاء
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-sky-600 dark:text-sky-400">
                السؤال {currentQ + 1} من {QUICK_PLACEMENT_QUESTIONS.length}
              </span>
              <button
                type="button"
                onClick={() => setMode('select_level')}
                className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white font-semibold cursor-pointer"
              >
                العودة لاختيار المستوى
              </button>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300 break-words">
                {QUICK_PLACEMENT_QUESTIONS[currentQ].questionAr}
              </p>
              <div
                dir="ltr"
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 font-en text-base sm:text-lg font-bold text-slate-900 dark:text-white text-left break-words"
              >
                {QUICK_PLACEMENT_QUESTIONS[currentQ].sentenceEn}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5" dir="ltr">
              {QUICK_PLACEMENT_QUESTIONS[currentQ].options.map((opt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedOption(idx)}
                  className={`p-3.5 min-h-[48px] rounded-xl font-en font-semibold text-left border transition flex items-center justify-between gap-2 cursor-pointer ${
                    selectedOption === idx
                      ? 'border-sky-600 bg-sky-50 dark:bg-sky-950/70 text-sky-900 dark:text-sky-200 ring-2 ring-sky-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <span className="break-words whitespace-normal">{opt}</span>
                  {selectedOption === idx && (
                    <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                  )}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between pt-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedLevel('A0');
                  setMode('select_level');
                }}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                تخطي والبدء من الصفر (A0)
              </button>
              <button
                type="button"
                disabled={selectedOption === null}
                onClick={handleNextQuestion}
                className="px-6 py-3 min-h-[46px] rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-40 text-white font-bold text-sm flex items-center gap-2 transition cursor-pointer"
              >
                <span>
                  {currentQ < QUICK_PLACEMENT_QUESTIONS.length - 1
                    ? 'السؤال التالي'
                    : 'عرض النتيجة وتحديد المستوى'}
                </span>
                <ArrowLeft className="w-4 h-4 shrink-0" />
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
