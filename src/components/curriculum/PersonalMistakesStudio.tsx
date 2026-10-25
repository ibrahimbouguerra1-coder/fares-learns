import React, { useState } from 'react';
import {
  ShieldAlert,
  Trash2,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { useLearning } from '../../context/LearningContext.tsx';
import { useAudioSpeaker } from '../../hooks/useAudioSpeaker.ts';
import { AudioButton } from '../common/AudioButton.tsx';
import { playSuccessChime, playPopSound } from '../../utils/audioEffects.ts';

const COMMON_ARABIC_TRANSFER_ERRORS = [
  {
    wrong: 'I am agree with you.',
    correct: 'I agree with you.',
    type: 'فعل الكينونة الزائد',
    explanationAr: 'الفعل agree فعل مستقل ولا يسبق بـ am.',
  },
  {
    wrong: 'He is engineer.',
    correct: 'He is an engineer.',
    type: 'إغفال أدوات النكرة a / an',
    explanationAr: 'في الإنجليزية كل اسم مهنة مفرد معدود يجب أن يسبق بـ a أو an.',
  },
  {
    wrong: 'The car which I bought it.',
    correct: 'The car which I bought.',
    type: 'الضمير العائد الزائد (Resumptive Pronoun)',
    explanationAr: 'في جمل الوصل الإنجليزية لا نكرر الضمير العائد على الاسم الموصول.',
  },
  {
    wrong: 'I will call you when I will arrive.',
    correct: 'I will call you when I arrive.',
    type: 'المستقبل المضاعف في جمل الشرط والوقت',
    explanationAr: 'بعد when و if نستخدم المضارع البسيط للتعبير عن المستقبل.',
  },
  {
    wrong: 'I have 25 years old.',
    correct: 'I am 25 years old.',
    type: 'التعبير عن العمر بفعل الملكية',
    explanationAr: 'في الإنجليزية نستخدم فعل الكينونة To Be للتعبير عن العمر وليس Have.',
  },
];

export const PersonalMistakesStudio: React.FC = () => {
  const { progress, removeMistakeRecord } = useLearning();
  const { isPlaying, playSpeech } = useAudioSpeaker();
  const [tab, setTab] = useState<'personal' | 'common'>('personal');

  const mistakes = progress.personalMistakes || [];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-white via-white to-rose-50/40 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800/80 border border-slate-200/80 dark:border-slate-800 space-y-2 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-black text-rose-600 dark:text-rose-400">
          <ShieldAlert className="w-4 h-4 text-rose-500" />
          <span>عيادة الأخطاء والمراجعة الذكية</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          سجل الأخطاء الشخصية والفخاخ اللغوية
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
          الخطأ هو أسرع طريق للإتقان! هنا تُحفظ كل هفوة تصدر أثناء حل التمارين لتراجعها وتتجاوزها نهائياً.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => {
            playPopSound();
            setTab('personal');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-black cursor-pointer transition ${
            tab === 'personal'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          أخطائي الشخصية المسجلة ({mistakes.length})
        </button>
        <button
          type="button"
          onClick={() => {
            playPopSound();
            setTab('common');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-black cursor-pointer transition ${
            tab === 'common'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          أشهر فخاخ المتحدثين بالعربية ({COMMON_ARABIC_TRANSFER_ERRORS.length})
        </button>
      </div>

      {tab === 'personal' && (
        <div className="space-y-3">
          {mistakes.length > 0 ? (
            mistakes.map((m) => (
              <div
                key={m.id}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-rose-600 dark:text-rose-400">
                    {m.errorTypeAr || 'تمرين تم حله بشكل غير دقيق'}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeMistakeRecord(m.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition cursor-pointer"
                    title="حذف من السجل بعد الإتقان"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" dir="ltr">
                  <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs space-y-1">
                    <span className="text-[11px] font-bold text-red-600 dark:text-red-400 block" dir="rtl">
                      الصياغة الخاطئة:
                    </span>
                    <span className="font-en text-slate-800 dark:text-slate-200 line-through font-semibold">
                      {m.original}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-xs space-y-1">
                    <div className="flex items-center justify-between" dir="rtl">
                      <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                        الصياغة الصحيحة المعتمدة:
                      </span>
                      <AudioButton
                        size="sm"
                        isPlaying={isPlaying(m.id)}
                        onClick={() => playSpeech(m.corrected, m.id, 0.85)}
                      />
                    </div>
                    <span className="font-en font-bold text-slate-900 dark:text-white block">
                      {m.corrected}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                  💡 الشرح: {m.explanationAr}
                </p>
              </div>
            ))
          ) : (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <h4 className="font-bold text-slate-800 dark:text-slate-200">
                سجل أخطائك نظيف تماماً!
              </h4>
              <p className="text-xs text-slate-500 font-medium">
                استمر في حل تمارين الدروس، وأي خطأ ترتكبه سيضاف هنا لتتمكن من مراجعته بدقة.
              </p>
            </div>
          )}
        </div>
      )}

      {tab === 'common' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {COMMON_ARABIC_TRANSFER_ERRORS.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-2xs"
            >
              <div className="flex items-center gap-2 text-xs font-black text-amber-600 dark:text-amber-400">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{item.type}</span>
              </div>

              <div className="grid grid-cols-1 gap-2" dir="ltr">
                <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs">
                  <span className="font-en text-rose-600 dark:text-rose-400 line-through font-semibold">
                    {item.wrong}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-xs">
                  <span className="font-en font-bold text-emerald-700 dark:text-emerald-300">
                    {item.correct}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                {item.explanationAr}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
