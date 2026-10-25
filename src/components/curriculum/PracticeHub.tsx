import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Layers,
  ShieldAlert,
  Mic,
  Headphones,
  Blocks,
} from 'lucide-react';
import { PronunciationStudio } from './PronunciationStudio.tsx';
import { ListeningStudio } from './ListeningStudio.tsx';
import { VocabularyStudio } from './VocabularyStudio.tsx';
import { ReadingStudio } from './ReadingStudio.tsx';
import { PersonalMistakesStudio } from './PersonalMistakesStudio.tsx';
import { SentenceBuilderStudio } from './SentenceBuilderStudio.tsx';
import { playPopSound } from '../../utils/audioEffects.ts';

export type SkillLabTab =
  | 'pronunciation'
  | 'sentence_builder'
  | 'listening'
  | 'reading'
  | 'vocabulary'
  | 'mistakes';

interface PracticeHubProps {
  activeTab?: string;
}

export const PracticeHub: React.FC<PracticeHubProps> = ({ activeTab }) => {
  const resolveLab = (tab?: string): SkillLabTab => {
    if (tab === 'sentence_builder') return 'sentence_builder';
    if (tab === 'vocabulary') return 'vocabulary';
    if (tab === 'reading_listening') return 'listening';
    if (tab === 'pronunciation') return 'pronunciation';
    return 'pronunciation';
  };

  const [activeLab, setActiveLab] = useState<SkillLabTab>(() => resolveLab(activeTab));

  useEffect(() => {
    if (activeTab === 'sentence_builder') setActiveLab('sentence_builder');
    else if (activeTab === 'vocabulary') setActiveLab('vocabulary');
    else if (activeTab === 'reading_listening') setActiveLab('listening');
    else if (activeTab === 'pronunciation') setActiveLab('pronunciation');
  }, [activeTab]);

  const handleTabChange = (tab: SkillLabTab) => {
    playPopSound();
    setActiveLab(tab);
  };

  return (
    <div className="space-y-6">
      {/* Navigation Pills (Duolingo 3D Button Style) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {/* 1. Pronunciation Lab */}
        <button
          type="button"
          onClick={() => handleTabChange('pronunciation')}
          className={`px-4 py-3 min-h-[48px] rounded-2xl border-2 border-b-4 text-xs font-black transition cursor-pointer select-none flex items-center gap-2 whitespace-nowrap ${
            activeLab === 'pronunciation'
              ? 'bg-[#1cb0f6] border-[#1cb0f6] border-b-[#1899d6] text-white shadow-sm translate-y-[-2px]'
              : 'bg-white dark:bg-slate-900 border-slate-200 border-b-slate-300 dark:border-slate-800 dark:border-b-slate-950 text-slate-700 dark:text-slate-300 hover:border-sky-300 active:translate-y-0.5'
          }`}
        >
          <Mic className="w-4 h-4" />
          <span>مختبر النطق والأصوات</span>
        </button>

        {/* 2. Sentence Builder (Duolingo Word Tiles) */}
        <button
          type="button"
          onClick={() => handleTabChange('sentence_builder')}
          className={`px-4 py-3 min-h-[48px] rounded-2xl border-2 border-b-4 text-xs font-black transition cursor-pointer select-none flex items-center gap-2 whitespace-nowrap ${
            activeLab === 'sentence_builder'
              ? 'bg-[#58cc02] border-[#58cc02] border-b-[#46a302] text-white shadow-sm translate-y-[-2px]'
              : 'bg-white dark:bg-slate-900 border-slate-200 border-b-slate-300 dark:border-slate-800 dark:border-b-slate-950 text-slate-700 dark:text-slate-300 hover:border-emerald-300 active:translate-y-0.5'
          }`}
        >
          <Blocks className="w-4 h-4" />
          <span>مختبر تركيب وبناء الجمل</span>
        </button>

        {/* 3. Listening Lab */}
        <button
          type="button"
          onClick={() => handleTabChange('listening')}
          className={`px-4 py-3 min-h-[48px] rounded-2xl border-2 border-b-4 text-xs font-black transition cursor-pointer select-none flex items-center gap-2 whitespace-nowrap ${
            activeLab === 'listening'
              ? 'bg-[#ff9600] border-[#ff9600] border-b-[#e58700] text-white shadow-sm translate-y-[-2px]'
              : 'bg-white dark:bg-slate-900 border-slate-200 border-b-slate-300 dark:border-slate-800 dark:border-b-slate-950 text-slate-700 dark:text-slate-300 hover:border-amber-300 active:translate-y-0.5'
          }`}
        >
          <Headphones className="w-4 h-4" />
          <span>مختبر الاستماع والإملاء</span>
        </button>

        {/* 4. Reading Studio */}
        <button
          type="button"
          onClick={() => handleTabChange('reading')}
          className={`px-4 py-3 min-h-[48px] rounded-2xl border-2 border-b-4 text-xs font-black transition cursor-pointer select-none flex items-center gap-2 whitespace-nowrap ${
            activeLab === 'reading'
              ? 'bg-[#ce82ff] border-[#ce82ff] border-b-[#b85eff] text-white shadow-sm translate-y-[-2px]'
              : 'bg-white dark:bg-slate-900 border-slate-200 border-b-slate-300 dark:border-slate-800 dark:border-b-slate-950 text-slate-700 dark:text-slate-300 hover:border-purple-300 active:translate-y-0.5'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>استوديو القراءة والاستيعاب</span>
        </button>

        {/* 5. Vocabulary SRS (Before Last) */}
        <button
          type="button"
          onClick={() => handleTabChange('vocabulary')}
          className={`px-4 py-3 min-h-[48px] rounded-2xl border-2 border-b-4 text-xs font-black transition cursor-pointer select-none flex items-center gap-2 whitespace-nowrap ${
            activeLab === 'vocabulary'
              ? 'bg-[#2b70c9] border-[#2b70c9] border-b-[#1e549c] text-white shadow-sm translate-y-[-2px]'
              : 'bg-white dark:bg-slate-900 border-slate-200 border-b-slate-300 dark:border-slate-800 dark:border-b-slate-950 text-slate-700 dark:text-slate-300 hover:border-blue-300 active:translate-y-0.5'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>استوديو المفردات (SRS)</span>
        </button>

        {/* 6. Mistakes Clinic (Last) */}
        <button
          type="button"
          onClick={() => handleTabChange('mistakes')}
          className={`px-4 py-3 min-h-[48px] rounded-2xl border-2 border-b-4 text-xs font-black transition cursor-pointer select-none flex items-center gap-2 whitespace-nowrap ${
            activeLab === 'mistakes'
              ? 'bg-[#ff4b4b] border-[#ff4b4b] border-b-[#d43f3f] text-white shadow-sm translate-y-[-2px]'
              : 'bg-white dark:bg-slate-900 border-slate-200 border-b-slate-300 dark:border-slate-800 dark:border-b-slate-950 text-slate-700 dark:text-slate-300 hover:border-rose-300 active:translate-y-0.5'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>عيادة الأخطاء والمراجعة</span>
        </button>
      </div>

      {/* Render Active Studio */}
      {activeLab === 'pronunciation' && <PronunciationStudio />}
      {activeLab === 'sentence_builder' && <SentenceBuilderStudio />}
      {activeLab === 'listening' && <ListeningStudio />}
      {activeLab === 'reading' && <ReadingStudio />}
      {activeLab === 'vocabulary' && <VocabularyStudio />}
      {activeLab === 'mistakes' && <PersonalMistakesStudio />}
    </div>
  );
};
