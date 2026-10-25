import React from 'react';
import {
  Compass,
  Sparkles,
  MessageSquareText,
  Award,
} from 'lucide-react';
import { playPopSound } from '../../utils/audioEffects.ts';

export type NavTab =
  | 'dashboard'
  | 'practice'
  | 'ai_tutor'
  | 'progress'
  // Compatibility aliases
  | 'curriculum'
  | 'skills_labs'
  | 'practice_hub'
  | 'vocabulary'
  | 'pronunciation'
  | 'sentence_builder'
  | 'reading_listening'
  | 'writing_coach';

interface TabBarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const TabBar: React.FC<TabBarProps> = ({ activeTab, onTabChange }) => {
  const isDashboardActive = activeTab === 'dashboard' || activeTab === 'curriculum';
  const isPracticeActive =
    activeTab === 'practice' ||
    activeTab === 'skills_labs' ||
    activeTab === 'practice_hub' ||
    activeTab === 'vocabulary' ||
    activeTab === 'pronunciation' ||
    activeTab === 'sentence_builder' ||
    activeTab === 'reading_listening' ||
    activeTab === 'writing_coach';
  const isAiTutorActive = activeTab === 'ai_tutor';
  const isProgressActive = activeTab === 'progress';

  const handleTabClick = (tab: NavTab) => {
    playPopSound();
    onTabChange(tab);
  };

  return (
    <nav
      aria-label="التنقل الرئيسي"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t-2 border-slate-200 dark:border-slate-800 py-2 px-3 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
    >
      <div className="max-w-xl mx-auto grid grid-cols-4 gap-2 items-center">
        {/* 1. مسار المنهج */}
        <button
          type="button"
          onClick={() => handleTabClick('dashboard')}
          className={`min-h-[54px] px-2 py-1.5 flex flex-col items-center justify-center rounded-2xl transition-all cursor-pointer select-none ${
            isDashboardActive
              ? 'bg-[#58cc02] text-white border-b-4 border-[#46a302] shadow-sm translate-y-[-2px]'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 active:translate-y-1'
          }`}
        >
          <Compass className={`w-5 h-5 shrink-0 transition-transform ${isDashboardActive ? 'scale-115 animate-bounce' : ''}`} />
          <span className="text-[10px] sm:text-xs font-black mt-1 text-center truncate max-w-full">
            المنهج
          </span>
        </button>

        {/* 2. مختبر المهارات */}
        <button
          type="button"
          onClick={() => handleTabClick('practice')}
          className={`min-h-[54px] px-2 py-1.5 flex flex-col items-center justify-center rounded-2xl transition-all cursor-pointer select-none ${
            isPracticeActive
              ? 'bg-[#1cb0f6] text-white border-b-4 border-[#1899d6] shadow-sm translate-y-[-2px]'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 active:translate-y-1'
          }`}
        >
          <Sparkles className={`w-5 h-5 shrink-0 transition-transform ${isPracticeActive ? 'scale-115 animate-bounce' : ''}`} />
          <span className="text-[10px] sm:text-xs font-black mt-1 text-center truncate max-w-full">
            المهارات
          </span>
        </button>

        {/* 3. المعلم الذكي */}
        <button
          type="button"
          onClick={() => handleTabClick('ai_tutor')}
          className={`min-h-[54px] px-2 py-1.5 flex flex-col items-center justify-center rounded-2xl transition-all cursor-pointer select-none ${
            isAiTutorActive
              ? 'bg-[#ce82ff] text-white border-b-4 border-[#b85eff] shadow-sm translate-y-[-2px]'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 active:translate-y-1'
          }`}
        >
          <MessageSquareText className={`w-5 h-5 shrink-0 transition-transform ${isAiTutorActive ? 'scale-115 animate-bounce' : ''}`} />
          <span className="text-[10px] sm:text-xs font-black mt-1 text-center truncate max-w-full">
            المعلم الذكي
          </span>
        </button>

        {/* 4. التقدم والإنجاز */}
        <button
          type="button"
          onClick={() => handleTabClick('progress')}
          className={`min-h-[54px] px-2 py-1.5 flex flex-col items-center justify-center rounded-2xl transition-all cursor-pointer select-none ${
            isProgressActive
              ? 'bg-[#ffc800] text-slate-900 border-b-4 border-[#e5b400] shadow-sm translate-y-[-2px]'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 active:translate-y-1'
          }`}
        >
          <Award className={`w-5 h-5 shrink-0 transition-transform ${isProgressActive ? 'scale-115 animate-bounce' : ''}`} />
          <span className="text-[10px] sm:text-xs font-black mt-1 text-center truncate max-w-full">
            التقدم
          </span>
        </button>
      </div>
    </nav>
  );
};
