import React from 'react';
import {
  Award,
  Flame,
  CheckCircle2,
  Clock,
  BookOpen,
  Sparkles,
  Layers,
  GraduationCap,
  ShieldCheck,
} from 'lucide-react';
import { useLearning } from '../../context/LearningContext.tsx';
import { CURRICULUM_LESSONS } from '../../data/curriculum.ts';
import { FaresMascot } from '../common/FaresMascot.tsx';

interface ProgressViewProps {
  onOpenProfile: () => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({ onOpenProfile }) => {
  const { progress } = useLearning();

  const totalLessons = CURRICULUM_LESSONS.length;
  const completedLessonsCount = progress.completedLessonIds.length;
  const overallPercentage = Math.round((completedLessonsCount / totalLessons) * 100);
  const masteredVocabCount = progress.savedVocabulary.filter((v) => v.mastered).length;

  const skillsList = [
    { label: 'القواعد والتراكيب (Grammar)', key: 'grammar', level: progress.skills?.grammar || progress.estimatedLevel, percent: 75 },
    { label: 'المفردات وحصيلة الكلمات (Vocabulary)', key: 'vocabulary', level: progress.skills?.vocabulary || progress.estimatedLevel, percent: 80 },
    { label: 'الفهم القرائي (Reading)', key: 'reading', level: progress.skills?.reading || progress.estimatedLevel, percent: 70 },
    { label: 'الاستماع ومخارج الأصوات (Listening)', key: 'listening', level: progress.skills?.listening || progress.estimatedLevel, percent: 65 },
    { label: 'المحادثة والطلاقة (Speaking)', key: 'speaking', level: progress.skills?.speaking || progress.estimatedLevel, percent: 60 },
    { label: 'الصياغة والكتابة (Writing)', key: 'writing', level: progress.skills?.writing || progress.estimatedLevel, percent: 68 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-white via-white to-amber-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800/80 border border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
        <div className="space-y-2 text-right flex-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-xl bg-amber-500 text-slate-900 font-en font-black text-xs">
              المستوى الحالي: {progress.estimatedLevel}
            </span>
            <span className="text-xs font-bold text-slate-400">
              {progress.name && progress.name !== 'متعلم جديد' ? progress.name : 'متعلم فارس'}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            تقرير التقدم والإنجاز اللغوي
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
            أنت تحرز تقدماً رائعاً في مسارك نحو الإتقان والطلاقة. واصل الحماس اليومي!
          </p>
        </div>

        <FaresMascot mood="proud" size="md" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-right space-y-1 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">وقت التعلم</span>
            <Clock className="w-5 h-5 text-emerald-500" />
          </div>
          <span className="font-en text-2xl font-black text-slate-900 dark:text-white block">
            {progress.todayMinutesSpent || 15} دقيقة
          </span>
          <span className="text-[10px] text-emerald-600 font-bold block">ممارسة نشطة اليوم</span>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-right space-y-1 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">أيام الحماس</span>
            <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
          </div>
          <span className="font-en text-2xl font-black text-slate-900 dark:text-white block">
            {progress.streakDays || 1} يوم
          </span>
          <span className="text-[10px] text-amber-600 font-bold block">مستمر بلا انقطاع</span>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-right space-y-1 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">الدروس المنجزة</span>
            <CheckCircle2 className="w-5 h-5 text-sky-500" />
          </div>
          <span className="font-en text-2xl font-black text-slate-900 dark:text-white block">
            {completedLessonsCount} / {totalLessons}
          </span>
          <span className="text-[10px] text-sky-600 font-bold block">{overallPercentage}% من المنهج</span>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-right space-y-1 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">الكلمات المتقنة</span>
            <Layers className="w-5 h-5 text-purple-500" />
          </div>
          <span className="font-en text-2xl font-black text-slate-900 dark:text-white block">
            {progress.savedVocabulary.length} كلمة
          </span>
          <span className="text-[10px] text-purple-600 font-bold block">{masteredVocabCount} راسخة بالذاكرة</span>
        </div>
      </div>

      {/* Skills Matrix */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="space-y-0.5 text-right">
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              مصفوفة المهارات اللغوية (CEFR Sub-skills)
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              توزيع كفاءتك عبر محاور اللغة الإنجليزية الستة
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenProfile}
            className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer"
          >
            تعديل المستويات
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skillsList.map((skill) => (
            <div
              key={skill.key}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-2 text-right"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {skill.label}
                </span>
                <span className="font-en px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 text-sky-600 font-black text-xs border border-slate-200 dark:border-slate-800">
                  {skill.level}
                </span>
              </div>
              <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-sky-500 rounded-full"
                  style={{ width: `${skill.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Badges and Medals Showcase */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 text-right">
          <Award className="w-5 h-5 text-amber-500" />
          <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
            الأوسمة والشهادات التقديرية
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(progress.badges || []).map((badge) => (
            <div
              key={badge.id}
              className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-center space-y-2"
            >
              <div className="w-12 h-12 mx-auto rounded-full bg-amber-100 dark:bg-amber-900/60 border border-amber-300 dark:border-amber-700 flex items-center justify-center text-amber-600 dark:text-amber-300">
                <Award className="w-6 h-6" />
              </div>
              <span className="text-xs font-black text-slate-900 dark:text-white block">
                {badge.titleAr}
              </span>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                {badge.descriptionAr}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
