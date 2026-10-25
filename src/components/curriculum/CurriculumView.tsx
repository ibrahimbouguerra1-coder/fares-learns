import React, { useState, useRef, useEffect } from 'react';
import {
  Check,
  Star,
  BookOpen,
  Lock,
  Sparkles,
  Award,
  ChevronDown,
  X,
  ArrowLeft,
} from 'lucide-react';
import type { CEFRLevel, Lesson } from '../../types/learning.ts';
import { CURRICULUM_LESSONS } from '../../data/curriculum.ts';
import { useLearning } from '../../context/LearningContext.tsx';
import { LessonDetailModal } from './LessonDetailModal.tsx';
import { LevelCheckpointModal } from './LevelCheckpointModal.tsx';
import { FaresMascot } from '../common/FaresMascot.tsx';
import { playPopSound } from '../../utils/audioEffects.ts';

const LEVEL_TABS: { id: CEFRLevel; titleAr: string; descAr: string; color: string; border: string }[] = [
  { id: 'A0', titleAr: 'المستوى A0: من الصفر', descAr: 'الأبجدية، مخارج الحروف، وجمل النجاة', color: '#58cc02', border: '#46a302' },
  { id: 'A1', titleAr: 'المستوى A1: مبتدئ', descAr: 'الجمل البسيطة، فعل to be، والمضارع البسيط', color: '#1cb0f6', border: '#1899d6' },
  { id: 'A2', titleAr: 'المستوى A2: ابتدائي', descAr: 'الماضي البسيط، حروف الجر، والمقارنات', color: '#ce82ff', border: '#b85eff' },
  { id: 'B1', titleAr: 'المستوى B1: متوسط', descAr: 'المضارع التام، الماضي المستمر، والشروط', color: '#ff9600', border: '#e58700' },
  { id: 'B2', titleAr: 'المستوى B2: فوق المتوسط', descAr: 'الماضي التام، المبني للمجهول، والكلام المنقول', color: '#ff4b4b', border: '#ea2b2b' },
  { id: 'C1', titleAr: 'المستوى C1: متقدم', descAr: 'القلب النحوي البلاغي، صيغة Subjunctive، والجمل المشقوقة', color: '#2b70c9', border: '#1e549c' },
  { id: 'C2', titleAr: 'المستوى C2: احترافي وبلاغي', descAr: 'الفروق الدلالية الدقيقة، التوازي، ونثر النخبة', color: '#ffc800', border: '#e5b400' },
];

const UNIT_THEME_COLORS = [
  { bg: 'bg-[#58cc02]', border: 'border-[#46a302]', text: 'text-white', light: 'bg-[#58cc02]/10', stroke: '#58cc02' },
  { bg: 'bg-[#1cb0f6]', border: 'border-[#1899d6]', text: 'text-white', light: 'bg-[#1cb0f6]/10', stroke: '#1cb0f6' },
  { bg: 'bg-[#ce82ff]', border: 'border-[#b85eff]', text: 'text-white', light: 'bg-[#ce82ff]/10', stroke: '#ce82ff' },
  { bg: 'bg-[#ff9600]', border: 'border-[#e58700]', text: 'text-white', light: 'bg-[#ff9600]/10', stroke: '#ff9600' },
  { bg: 'bg-[#ff4b4b]', border: 'border-[#ea2b2b]', text: 'text-white', light: 'bg-[#ff4b4b]/10', stroke: '#ff4b4b' },
];

// Horizontal offsets for Duolingo winding serpentine curve
const SERPENTINE_OFFSETS = [0, 48, 80, 48, 0, -48, -80, -48];

export const CurriculumView: React.FC = () => {
  const { progress } = useLearning();
  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel>(progress.estimatedLevel || 'A0');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [selectedNodeLesson, setSelectedNodeLesson] = useState<Lesson | null>(null);
  const [isCheckpointOpen, setIsCheckpointOpen] = useState(false);
  const [showGuidebookForChapter, setShowGuidebookForChapter] = useState<string | null>(null);

  const popupRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!selectedNodeLesson) return;
    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setSelectedNodeLesson(null);
      }
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [selectedNodeLesson]);

  const levelLessons = CURRICULUM_LESSONS.filter((l) => l.level === selectedLevel);

  // Group lessons by Chapter
  const chaptersMap: Record<string, Lesson[]> = {};
  levelLessons.forEach((lesson) => {
    const ch = lesson.chapterTitleAr || 'الوحدة التعليمية';
    if (!chaptersMap[ch]) chaptersMap[ch] = [];
    chaptersMap[ch].push(lesson);
  });

  const completedInLevel = levelLessons.filter((l) =>
    progress.completedLessonIds.includes(l.id)
  ).length;
  const levelProgressPercent =
    levelLessons.length > 0 ? Math.round((completedInLevel / levelLessons.length) * 100) : 0;

  // Find the first uncompleted lesson in the level
  const firstUncompletedId =
    levelLessons.find((l) => !progress.completedLessonIds.includes(l.id))?.id ||
    levelLessons[0]?.id;

  const currentLevelTab =
    LEVEL_TABS.find((t) => t.id === selectedLevel) || LEVEL_TABS[0];

  let globalLessonCounter = 0;

  return (
    <div className="space-y-8 max-w-3xl mx-auto pb-12">
      {/* 1. Level Switcher Banner (Duolingo Section Header) */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border-2 border-b-6 border-slate-200 border-b-slate-300 dark:border-slate-800 dark:border-b-slate-950 p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1 text-right">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
              مسار التعلّم الحالي
            </span>
            <div className="flex items-center gap-2">
              <span
                className="px-3 py-1 rounded-xl text-white font-en font-black text-xs shadow-xs"
                style={{ backgroundColor: currentLevelTab.color }}
              >
                {selectedLevel}
              </span>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                {currentLevelTab.titleAr}
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">
              {currentLevelTab.descAr}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Checkpoint Exam */}
            <button
              type="button"
              onClick={() => {
                playPopSound();
                setIsCheckpointOpen(true);
              }}
              className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-900 border-2 border-b-4 border-amber-500 border-b-amber-600 active:border-b-2 active:translate-y-0.5 text-xs font-black flex items-center gap-1.5 cursor-pointer select-none shadow-xs"
            >
              <Award className="w-4 h-4 text-slate-900" />
              <span>اختبار الترقية</span>
            </button>
          </div>
        </div>

        {/* Progress Bar & Level Chips */}
        <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs font-black text-slate-500 dark:text-slate-400">
            <span>نسبة إنجاز المستوى: {levelProgressPercent}%</span>
            <span>
              {completedInLevel} من {levelLessons.length} دروس مكتملة
            </span>
          </div>
          <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200/60 dark:border-slate-700/60">
            <div
              className="h-full bg-[#58cc02] rounded-full transition-all duration-500 shadow-inner"
              style={{ width: `${levelProgressPercent}%` }}
            />
          </div>
        </div>

        {/* Level Tabs Selection (A0 to C2) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1">
          {LEVEL_TABS.map((tab) => {
            const isSelected = selectedLevel === tab.id;
            const completedCount = CURRICULUM_LESSONS.filter(
              (l) => l.level === tab.id && progress.completedLessonIds.includes(l.id)
            ).length;
            const totalCount = CURRICULUM_LESSONS.filter((l) => l.level === tab.id).length;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  playPopSound();
                  setSelectedLevel(tab.id);
                  setSelectedNodeLesson(null);
                }}
                className={`px-3 py-2 rounded-2xl border-2 border-b-4 text-xs font-black whitespace-nowrap cursor-pointer select-none transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#58cc02] text-white border-[#46a302] border-b-[#368002] shadow-sm translate-y-[-2px]'
                    : 'bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200 border-b-slate-300 dark:border-slate-700 dark:border-b-slate-900 hover:bg-white active:translate-y-0.5'
                }`}
              >
                <span className="font-en">{tab.id}</span>
                <span className="text-[10px] opacity-80">
                  ({completedCount}/{totalCount})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. THE DUOLINGO SERPENTINE WINDING PATH */}
      <div className="space-y-12">
        {Object.entries(chaptersMap).map(([chapterTitle, chapterLessons], chIdx) => {
          const theme = UNIT_THEME_COLORS[chIdx % UNIT_THEME_COLORS.length];

          const hasSelectedLesson = chapterLessons.some((l) => l.id === selectedNodeLesson?.id);

          return (
            <div key={chIdx} className={`space-y-6 relative ${hasSelectedLesson ? 'z-30' : 'z-10'}`}>
              {/* Duolingo Unit Header Banner */}
              <div
                className={`p-5 rounded-3xl ${theme.bg} ${theme.text} border-b-6 ${theme.border} shadow-md flex items-center justify-between gap-4`}
              >
                <div className="space-y-1 text-right flex-1 min-w-0">
                  <span className="text-xs font-black uppercase tracking-wider opacity-90 block">
                    الوحدة {chIdx + 1}
                  </span>
                  <h3 className="text-base sm:text-lg font-black leading-snug break-words">
                    {chapterTitle}
                  </h3>
                  <span className="text-xs opacity-90 block font-medium">
                    {chapterLessons.length} دروس في هذه الوحدة
                  </span>
                </div>

                {/* Duolingo Guidebook button */}
                <button
                  type="button"
                  onClick={() => {
                    playPopSound();
                    setShowGuidebookForChapter(
                      showGuidebookForChapter === chapterTitle ? null : chapterTitle
                    );
                  }}
                  className="px-3.5 py-2 rounded-2xl bg-white/20 hover:bg-white/30 text-white border-2 border-white/30 text-xs font-black flex items-center gap-1.5 cursor-pointer select-none transition-all shrink-0 active:scale-95 shadow-xs"
                >
                  <BookOpen className="w-4 h-4" />
                  <span className="hidden sm:inline">دليل القواعد</span>
                </button>
              </div>

              {/* Guidebook Dropdown Drawer */}
              {showGuidebookForChapter === chapterTitle && (
                <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 space-y-4 shadow-sm animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                    <div className="flex items-center gap-2 font-black text-slate-900 dark:text-white text-sm">
                      <BookOpen className="w-4 h-4 text-sky-500" />
                      <span>دليل القواعد والملاحظات اللغوية: {chapterTitle}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowGuidebookForChapter(null)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {chapterLessons.map((l) => (
                      <div
                        key={l.id}
                        className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1 text-right"
                      >
                        <span className="font-bold text-xs text-sky-600 dark:text-sky-400 block">
                          {l.titleAr}
                        </span>
                        {l.rulesAndStructuresAr && (
                          <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                            {l.rulesAndStructuresAr}
                          </p>
                        )}
                        {l.arabicContrastPoint && (
                          <p className="text-[11px] text-rose-600 dark:text-rose-400 font-bold">
                            ⚠️ انتبه: {l.arabicContrastPoint.titleAr}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Serpentine Stepping Stone Nodes */}
              <div className="relative py-4 flex flex-col items-center space-y-8 sm:space-y-10">
                {chapterLessons.map((lesson) => {
                  const nodeIndex = globalLessonCounter++;
                  const horizontalOffset =
                    SERPENTINE_OFFSETS[nodeIndex % SERPENTINE_OFFSETS.length];
                  const isCompleted = progress.completedLessonIds.includes(lesson.id);
                  const isCurrent = lesson.id === firstUncompletedId;
                  const isLocked = !isCompleted && !isCurrent;
                  const isSelected = selectedNodeLesson?.id === lesson.id;

                  return (
                    <div
                      key={lesson.id}
                      className={`relative flex flex-col items-center ${isSelected ? 'z-50' : 'z-10'}`}
                      style={{
                        transform: `translateX(${horizontalOffset}px)`,
                        transition: 'transform 0.3s ease',
                      }}
                    >
                      {/* Floating Duo Mascot beside the current active lesson node */}
                      {isCurrent && (
                        <div className="absolute -top-12 -left-28 sm:-left-32 z-20 flex items-center gap-1.5 animate-bounce pointer-events-none">
                          <FaresMascot mood="cheering" size="sm" />
                          <div className="bg-white dark:bg-slate-800 px-3 py-1.5 rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-md font-black text-xs text-slate-900 dark:text-white whitespace-nowrap">
                            ابدأ هنا!
                          </div>
                        </div>
                      )}

                      {/* Circular Duolingo Node Button */}
                      <button
                        type="button"
                        onClick={() => {
                          playPopSound();
                          setSelectedNodeLesson(lesson);
                        }}
                        className={`relative w-20 h-20 sm:w-22 sm:h-22 rounded-full flex items-center justify-center cursor-pointer select-none transition-all active:scale-95 group ${
                          isCompleted
                            ? 'bg-[#58cc02] border-4 border-b-8 border-[#46a302] border-b-[#368002] shadow-md hover:scale-105 active:border-b-4'
                            : isCurrent
                            ? 'bg-[#58cc02] border-4 border-b-8 border-[#46a302] border-b-[#368002] shadow-xl hover:scale-105 ring-4 ring-[#58cc02]/30 active:border-b-4'
                            : 'bg-slate-200 dark:bg-slate-800 border-4 border-b-8 border-slate-300 border-b-slate-400 dark:border-slate-700 dark:border-b-slate-900 hover:border-slate-400 active:border-b-4'
                        }`}
                        title={lesson.titleAr}
                      >
                        {/* Icon inside the circular node */}
                        {isCompleted ? (
                          <Check className="w-10 h-10 text-white stroke-[3.5]" />
                        ) : isCurrent ? (
                          <Star className="w-10 h-10 text-white fill-white" />
                        ) : (
                          <Lock className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                        )}

                        {/* Top crown / badge for completed node */}
                        {isCompleted && (
                          <div className="absolute -top-2 right-1/2 translate-x-1/2 px-2 py-0.5 rounded-full bg-amber-400 border border-amber-500 text-slate-900 font-en text-[10px] font-black shadow-xs">
                            ✓
                          </div>
                        )}
                      </button>

                      {/* Small lesson title label beneath node */}
                      <span className="text-[11px] font-black text-slate-700 dark:text-slate-300 mt-2 max-w-[120px] text-center truncate">
                        {lesson.titleAr}
                      </span>

                      {/* Duolingo Floating Popup Card when node is clicked */}
                      {isSelected && (
                        <div
                          ref={popupRef}
                          className="absolute top-[104px] z-50 w-72 sm:w-80 max-w-[calc(100vw-2rem)] p-5 rounded-3xl bg-white dark:bg-slate-900 border-2 border-b-6 border-slate-200 border-b-slate-300 dark:border-slate-800 dark:border-b-slate-950 shadow-2xl space-y-3.5 text-right animate-in fade-in zoom-in-95"
                        >
                          {/* Triangle Arrow pointing up */}
                          <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-5 h-5 bg-white dark:bg-slate-900 border-t-2 border-l-2 border-slate-200 dark:border-slate-800 rotate-45 rounded-tl-sm pointer-events-none" />

                            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                              <span className="font-en px-2 py-0.5 rounded-md bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-black text-xs">
                                {lesson.level} • {lesson.category}
                              </span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedNodeLesson(null);
                                }}
                                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="space-y-1">
                              <h4 className="text-base font-black text-slate-900 dark:text-white leading-snug">
                                {lesson.titleAr}
                              </h4>
                              <p className="font-en text-xs text-slate-400 font-bold truncate" dir="ltr">
                                {lesson.titleEn}
                              </p>
                            </div>

                            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-bold">
                              <span>الوقت: {lesson.estimatedMinutes} دقيقة</span>
                              <span>{lesson.exercises ? lesson.exercises.length : 0} تمارين</span>
                            </div>

                            {isLocked ? (
                              <div className="space-y-2">
                                <div className="w-full py-3 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold text-xs flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700">
                                  <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                                  <span>الدرس مغلق • أكمل الدرس السابق لفتحه</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    playPopSound();
                                    setActiveLesson(lesson);
                                    setSelectedNodeLesson(null);
                                  }}
                                  className="w-full py-2 text-center text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer"
                                >
                                  أو افتح للمعاينة المباشرة
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  playPopSound();
                                  setActiveLesson(lesson);
                                  setSelectedNodeLesson(null);
                                }}
                                className="w-full py-3.5 rounded-2xl bg-[#58cc02] hover:bg-[#46a302] text-white font-black text-sm border-b-4 border-[#46a302] active:border-b-0 active:translate-y-1 transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
                              >
                                <span>{isCompleted ? 'مراجعة الدرس' : 'ابدأ الدرس الآن'}</span>
                                <ArrowLeft className="w-4 h-4 shrink-0" />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Level End Checkpoint Castle Node */}
        <div className="flex flex-col items-center space-y-3 pt-6 pb-4">
          <button
            type="button"
            onClick={() => {
              playPopSound();
              setIsCheckpointOpen(true);
            }}
            className="w-24 h-24 rounded-3xl bg-amber-400 hover:bg-amber-500 border-4 border-b-8 border-amber-500 border-b-amber-600 active:border-b-4 active:translate-y-1 flex items-center justify-center cursor-pointer shadow-xl transition-all"
            title="اختبار نهاية المستوى"
          >
            <Award className="w-12 h-12 text-slate-900" />
          </button>
          <div className="text-center">
            <span className="font-black text-sm text-slate-900 dark:text-white block">
              اختبار كفاءة نهاية المستوى {selectedLevel}
            </span>
            <span className="text-xs text-slate-400 font-bold">
              تأكيد الانتقال للمستوى التالي
            </span>
          </div>
        </div>
      </div>

      {/* Lesson Detail Modal */}
      {activeLesson && (
        <LessonDetailModal
          lesson={activeLesson}
          isOpen={true}
          onClose={() => setActiveLesson(null)}
        />
      )}

      {/* Level Checkpoint Modal */}
      {isCheckpointOpen && (
        <LevelCheckpointModal
          level={selectedLevel}
          isOpen={isCheckpointOpen}
          onClose={() => setIsCheckpointOpen(false)}
          onLevelPassed={(next) => {
            setSelectedLevel(next);
            setIsCheckpointOpen(false);
          }}
        />
      )}
    </div>
  );
};
