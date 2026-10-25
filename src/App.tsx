/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LearningProvider, useLearning } from './context/LearningContext.tsx';
import { Header } from './components/navigation/Header.tsx';
import { TabBar, type NavTab } from './components/navigation/TabBar.tsx';
import { CurriculumView } from './components/curriculum/CurriculumView.tsx';
import { PracticeHub } from './components/curriculum/PracticeHub.tsx';
import { AiTutorView } from './components/ai/AiTutorView.tsx';
import { ProgressView } from './components/curriculum/ProgressView.tsx';
import { OnboardingModal } from './components/onboarding/OnboardingModal.tsx';
import { ProfileModal } from './components/curriculum/ProfileModal.tsx';
import { SettingsModal } from './components/curriculum/SettingsModal.tsx';
import { OfflineIndicator } from './components/pwa/OfflineIndicator.tsx';

function MainApp() {
  const { progress, isLoading } = useLearning();

  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-500 font-bold">
          <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
          <span>جاري تحميل منصة فارس لتعليم الإنجليزية...</span>
        </div>
      </div>
    );
  }

  // If user hasn't completed onboarding yet, show the onboarding modal
  const shouldShowOnboarding = !progress.hasCompletedOnboarding || isOnboardingOpen;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors pb-24">
      {/* Offline Status Pill */}
      <OfflineIndicator />

      {/* Sticky Header */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenLevelSelector={() => setIsProfileOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6">
        {/* 1. CURRICULUM TAB */}
        {(activeTab === 'dashboard' || activeTab === 'curriculum') && (
          <CurriculumView />
        )}

        {/* 2. PRACTICE & SKILLS HUB TAB */}
        {(activeTab === 'practice' ||
          activeTab === 'skills_labs' ||
          activeTab === 'practice_hub' ||
          activeTab === 'vocabulary' ||
          activeTab === 'pronunciation' ||
          activeTab === 'sentence_builder' ||
          activeTab === 'writing_coach' ||
          activeTab === 'reading_listening') && (
          <PracticeHub activeTab={activeTab} />
        )}

        {/* 3. AI TUTOR CONVERSATION TAB */}
        {activeTab === 'ai_tutor' && <AiTutorView />}

        {/* 4. PROGRESS & STATS TAB */}
        {activeTab === 'progress' && (
          <ProgressView onOpenProfile={() => setIsProfileOpen(true)} />
        )}
      </main>

      {/* Bottom Sticky Navigation */}
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Onboarding Placement Modal */}
      {shouldShowOnboarding && (
        <OnboardingModal
          onComplete={() => setIsOnboardingOpen(false)}
          canClose={progress.hasCompletedOnboarding}
        />
      )}

      {/* Profile & Level Selector Modal */}
      {isProfileOpen && (
        <ProfileModal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
        />
      )}

      {/* Settings & Backup Modal */}
      {isSettingsOpen && (
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <LearningProvider>
      <MainApp />
    </LearningProvider>
  );
}
