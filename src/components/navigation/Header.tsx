import React, { useState } from 'react';
import {
  GraduationCap,
  Volume2,
  Sun,
  Moon,
  Settings,
  Flame,
  X,
  ShieldCheck,
  Cloud,
  RefreshCw,
} from 'lucide-react';
import { useLearning } from '../../context/LearningContext.tsx';
import type { NavTab } from './TabBar.tsx';
import { FaresLogo } from '../common/FaresLogo.tsx';

interface HeaderProps {
  activeTab: NavTab;
  activeStudio?: NavTab;
  onTabChange: (tab: NavTab) => void;
  onOpenProfile: () => void;
  onOpenSettings?: () => void;
  onOpenLevelSelector?: () => void;
  onOpenPhonics?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onTabChange,
  onOpenProfile,
  onOpenSettings,
  onOpenLevelSelector,
}) => {
  const { progress, toggleTheme, currentUser, isSyncing, isCloudSynced, syncNow } = useLearning();
  const [activeModal, setActiveModal] = useState<'streak' | null>(null);

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b-2 border-slate-200/90 dark:border-slate-800/90 transition-colors shadow-xs">
        <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 min-h-16 py-2.5 flex items-center justify-between gap-2 sm:gap-3">
          {/* Duolingo-styled Brand Wordmark */}
          <button
            type="button"
            onClick={() => onTabChange('dashboard')}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer text-right group active:scale-95 transition-transform shrink-0"
          >
            <FaresLogo size="md" />
            <div className="flex flex-col text-right">
              <span className="font-black leading-tight text-slate-900 dark:text-white text-base sm:text-lg tracking-tight whitespace-nowrap flex items-center gap-1.5">
                <span>فارس</span>
                <span className="font-en text-xs sm:text-sm font-black text-[#58cc02] dark:text-[#58cc02] whitespace-nowrap">| FARES</span>
              </span>
              <span className="text-[10px] text-slate-400 font-bold hidden sm:inline whitespace-nowrap">
                الإنجليزية من الصفر حتى الإتقان
              </span>
            </div>
          </button>

          {/* Duolingo Status Bar (Streak Flame + CEFR Level + Settings) */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* 1. Streak Flame */}
            <button
              type="button"
              onClick={() => setActiveModal('streak')}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-2xl bg-amber-50 hover:bg-amber-100/90 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-2 border-b-4 border-amber-300 border-b-amber-500 dark:border-amber-700 dark:border-b-amber-600 active:border-b-2 active:translate-y-0.5 transition-all cursor-pointer shadow-xs shrink-0 whitespace-nowrap"
              title="أيام الحماس المتتالية"
            >
              <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-bounce shrink-0" />
              <span className="font-en font-black text-xs sm:text-sm whitespace-nowrap">{progress.streakDays || 1}</span>
            </button>

            {/* 2. CEFR Level Flag / Course Badge */}
            {onOpenLevelSelector && (
              <button
                type="button"
                onClick={onOpenLevelSelector}
                className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-2xl bg-[#58cc02]/10 hover:bg-[#58cc02]/20 text-[#58cc02] border-2 border-b-4 border-[#58cc02]/40 border-b-[#46a302] active:border-b-2 active:translate-y-0.5 transition-all cursor-pointer shadow-xs shrink-0 whitespace-nowrap"
                title="تحديد المستوى المستهدف"
              >
                <GraduationCap className="w-4 h-4 text-[#58cc02] shrink-0" />
                <span className="text-xs font-black font-en whitespace-nowrap">{progress.estimatedLevel}</span>
              </button>
            )}

            {/* 3. Accent Selector */}
            <button
              type="button"
              onClick={onOpenProfile}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-slate-100 hover:bg-slate-200/90 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-2 border-b-4 border-slate-200 border-b-slate-300 dark:border-slate-700 dark:border-b-slate-900 active:border-b-2 active:translate-y-0.5 transition-all text-xs font-black cursor-pointer shadow-xs"
              title="اللهجة المفضلة"
            >
              <Volume2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="font-en text-[11px]">{progress.preferredAccent}</span>
            </button>

            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border-2 border-b-4 border-slate-200 border-b-slate-300 dark:border-slate-700 dark:border-b-slate-900 active:border-b-2 active:translate-y-0.5 transition-all cursor-pointer shadow-xs shrink-0"
              title="تغيير المظهر"
            >
              {progress.theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {/* Cloud Sync Button */}
            <button
              type="button"
              onClick={currentUser ? () => syncNow() : onOpenSettings}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl border-2 border-b-4 active:border-b-2 active:translate-y-0.5 transition-all text-xs font-bold cursor-pointer shadow-xs shrink-0 ${
                currentUser && isCloudSynced
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 border-b-emerald-500'
                  : currentUser
                  ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-300 border-b-sky-500'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 border-b-slate-300 dark:border-slate-700 dark:border-b-slate-900'
              }`}
              title={
                isSyncing
                  ? 'جاري المزامنة السحابية...'
                  : currentUser && isCloudSynced
                  ? 'التقدم متزامن سحابياً بنجاح (اضغط لإعادة المزامنة)'
                  : currentUser
                  ? 'اضغط للمزامنة السحابية'
                  : 'تسجيل الدخول للمزامنة السحابية'
              }
            >
              {isSyncing ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-sky-600" />
              ) : (
                <Cloud className={`w-3.5 h-3.5 ${currentUser && isCloudSynced ? 'text-emerald-600' : 'text-slate-500'}`} />
              )}
              <span className="hidden md:inline text-[11px]">
                {isSyncing ? 'مزامنة...' : currentUser && isCloudSynced ? 'سحابي' : 'مزامنة'}
              </span>
            </button>

            {/* Settings Button */}
            {onOpenSettings && (
              <button
                type="button"
                onClick={onOpenSettings}
                className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border-2 border-b-4 border-slate-200 border-b-slate-300 dark:border-slate-700 dark:border-b-slate-900 active:border-b-2 active:translate-y-0.5 transition-all cursor-pointer shadow-xs shrink-0"
                title="الإعدادات والمزامنة"
              >
                <Settings className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Streak Info Modal */}
      {activeModal === 'streak' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 p-6 text-center border-2 border-b-6 border-slate-200 border-b-slate-300 dark:border-slate-700 dark:border-b-slate-900 shadow-2xl space-y-4">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="absolute top-4 left-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-3 pt-2">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-100 dark:bg-amber-950/60 border-2 border-b-4 border-amber-300 border-b-amber-500 flex items-center justify-center text-amber-500">
                <Flame className="w-9 h-9 fill-amber-500 animate-bounce" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                أيام الحماس: {progress.streakDays || 1} يوم
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                أنت مستمر في التعلم يومياً! التدرب اليومي لمدة 15 دقيقة يضاعف سرعة إتقان الإنجليزية ويحافظ على حماسك.
              </p>
              <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-bold flex items-center gap-2 justify-center">
                <ShieldCheck className="w-4 h-4 shrink-0 text-amber-600" />
                <span>حماية الحماس مفعلة اليوم تلقائياً</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="w-full py-3.5 rounded-2xl bg-[#58cc02] hover:bg-[#46a302] text-white font-black text-sm border-b-4 border-[#46a302] active:border-b-0 active:translate-y-1 transition-all cursor-pointer shadow-md"
            >
              متابعة التعلم
            </button>
          </div>
        </div>
      )}
    </>
  );
};
