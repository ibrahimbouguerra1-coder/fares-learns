import React, { useState } from 'react';
import {
  User,
  GraduationCap,
  Volume2,
  Sparkles,
  Check,
  Target,
} from 'lucide-react';
import type { CEFRLevel, EnglishAccent } from '../../types/learning.ts';
import { useLearning } from '../../context/LearningContext.tsx';
import { PROFILE_PRESETS } from '../../data/profilePresets.ts';
import { Modal } from '../common/Modal.tsx';
import { playSuccessChime } from '../../utils/audioEffects.ts';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { progress, updateUserProfile, applyProfilePreset } = useLearning();

  const [name, setName] = useState(progress.name || 'متعلم فارس');
  const [level, setLevel] = useState<CEFRLevel>(progress.estimatedLevel || 'A0');
  const [accent, setAccent] = useState<EnglishAccent>(progress.preferredAccent || 'US');

  const handleSave = () => {
    updateUserProfile({
      name: name.trim() || 'متعلم فارس',
      estimatedLevel: level,
      preferredAccent: accent,
    });
    playSuccessChime();
    onClose();
  };

  const handleApplyPreset = (presetId: string) => {
    applyProfilePreset(presetId);
    playSuccessChime();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="الملف الشخصي ومسار التعلم"
      subtitle="تخصيص مستواك، لهجتك، وأهدافك التعليمية في منصة فارس"
      icon={<User className="w-5 h-5 text-sky-600" />}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              الاسم الكريم:
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-xs sm:text-sm outline-hidden focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              المستوى المستهدف (CEFR Level):
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {(['A0', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as CEFRLevel[]).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setLevel(lvl)}
                  className={`p-2.5 rounded-xl border-2 font-en font-black text-xs transition cursor-pointer ${
                    level === lvl
                      ? 'bg-sky-600 border-sky-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              اللهجة الإنجليزية المفضلة:
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'US', label: 'الإنجليزية الأمريكية (US)' },
                { id: 'UK', label: 'الإنجليزية البريطانية (UK)' },
              ].map((acc) => (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => setAccent(acc.id as EnglishAccent)}
                  className={`p-3 rounded-xl border-2 text-xs font-bold transition cursor-pointer flex items-center justify-between ${
                    accent === acc.id
                      ? 'border-sky-600 bg-sky-50 dark:bg-sky-950 text-sky-900 dark:text-sky-200'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span>{acc.label}</span>
                  {accent === acc.id && <Check className="w-4 h-4 text-sky-600" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Preset Profiles */}
        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
            أو اختر مساراً جاهزاً بضغطة واحدة:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {PROFILE_PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleApplyPreset(p.id)}
                className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-sky-400 bg-white dark:bg-slate-900 text-right space-y-1 transition cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">
                    {p.titleAr}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-[10px] font-black">
                    {p.estimatedLevel}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                  {p.descriptionAr}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Save button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleSave}
            className="w-full py-3.5 rounded-2xl bg-[#58cc02] hover:bg-[#46a302] text-white font-black text-sm border-b-4 border-[#46a302] active:border-b-0 active:translate-y-1 transition-all cursor-pointer shadow-md"
          >
            حفظ التغييرات
          </button>
        </div>
      </div>
    </Modal>
  );
};
