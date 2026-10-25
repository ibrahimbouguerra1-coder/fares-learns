import React, { useState } from 'react';
import {
  Settings,
  Download,
  Upload,
  Volume2,
  VolumeX,
  RotateCcw,
  ShieldCheck,
  Check,
  Cloud,
  LogIn,
  LogOut,
  RefreshCw,
  UserCheck,
} from 'lucide-react';
import { useLearning } from '../../context/LearningContext.tsx';
import { Modal } from '../common/Modal.tsx';
import { playSuccessChime } from '../../utils/audioEffects.ts';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const {
    progress,
    updateUserProfile,
    resetSpecificData,
    resetProgress,
    exportData,
    importData,
    currentUser,
    isSyncing,
    isCloudSynced,
    loginGoogle,
    loginGuest,
    logout,
    syncNow,
  } = useLearning();

  const [importJson, setImportJson] = useState('');
  const [showImportArea, setShowImportArea] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleExport = () => {
    const dataStr = exportData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fares-english-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    setMessage('تم تصدير نسخة احتياطية بنجاح!');
  };

  const handleImport = () => {
    if (!importJson.trim()) return;
    const ok = importData(importJson);
    if (ok) {
      setMessage('تم استيراد بياناتك بنجاح!');
      playSuccessChime();
      setShowImportArea(false);
      setImportJson('');
    } else {
      setMessage('فشل الاستيراد: يرجى التأكد من صحة ملف JSON.');
    }
  };

  const handleGoogleLogin = async () => {
    setAuthError(null);
    try {
      await loginGoogle();
      playSuccessChime();
      setMessage('تم تسجيل الدخول ومزامنة تقدمك سحابياً بنجاح!');
    } catch (e: any) {
      setAuthError('تعذر تسجيل الدخول بحساب Google. يمكنك المتابعة بحساب ضيف سحابي.');
    }
  };

  const handleGuestLogin = async () => {
    setAuthError(null);
    try {
      await loginGuest();
      playSuccessChime();
      setMessage('تم تفعيل الحساب السحابي بنجاح!');
    } catch (e: any) {
      setAuthError('تعذر الاتصال بقاعدة البيانات السحابية.');
    }
  };

  const handleManualSync = async () => {
    setAuthError(null);
    const ok = await syncNow();
    if (ok) {
      playSuccessChime();
      setMessage('تم تحديث ومزامنة بياناتك مع السحابة فوراً!');
    } else {
      setAuthError('تعذر إجراء المزامنة السحابية حالياً.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="الإعدادات والمزامنة السحابية"
      subtitle="حفظ تقدمك عبر الأجهزة وإدارة المؤثرات الصوتية"
      icon={<Settings className="w-5 h-5 text-slate-700 dark:text-slate-200" />}
      maxWidth="max-w-lg"
    >
      <div className="space-y-6">
        {message && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs font-bold text-emerald-800 dark:text-emerald-300 text-center animate-in fade-in">
            {message}
          </div>
        )}
        {authError && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-xs font-bold text-rose-800 dark:text-rose-300 text-center animate-in fade-in">
            {authError}
          </div>
        )}

        {/* 1. Cloud Sync Section */}
        <div className="p-4 rounded-3xl bg-sky-50/70 dark:bg-sky-950/30 border-2 border-sky-200 dark:border-sky-900/60 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-2xl bg-sky-500 text-white flex items-center justify-center shadow-xs">
                <Cloud className="w-5 h-5" />
              </div>
              <div className="text-right">
                <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                  المزامنة السحابية الذكية (Cloud Sync)
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  حفظ تقدمك عبر جميع أجهزتك وهاتفك الذكي
                </p>
              </div>
            </div>
            {currentUser && isCloudSynced && (
              <span className="px-2 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-black flex items-center gap-1">
                <Check className="w-3 h-3" />
                متزامن
              </span>
            )}
          </div>

          {currentUser ? (
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-slate-900 border border-sky-100 dark:border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[180px]">
                    {currentUser.email || currentUser.displayName || 'حساب متعلم متصل'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={logout}
                  className="text-[11px] font-bold text-rose-600 hover:text-rose-700 underline cursor-pointer"
                >
                  تسجيل الخروج
                </button>
              </div>
              <button
                type="button"
                onClick={handleManualSync}
                disabled={isSyncing}
                className="w-full py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer transition"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'جاري المزامنة مع السحابة...' : 'مزامنة فورية الآن'}</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isSyncing}
                className="w-full py-3 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold text-xs border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2.5 cursor-pointer shadow-xs transition"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24Z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.97 0 12s.45 3.82 1.25 5.42l4.03-3.15Z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"
                  />
                </svg>
                <span>تسجيل الدخول بحساب Google لحفظ التقدم</span>
              </button>
              <button
                type="button"
                onClick={handleGuestLogin}
                disabled={isSyncing}
                className="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>متابعة كحساب سحابي سريع بدون تسجيل دخول</span>
              </button>
            </div>
          )}
        </div>

        {/* Audio Effects Toggle */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
          <div className="space-y-0.5 text-right">
            <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white block">
              المؤثرات الصوتية وأصوات التفاعل
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              أصوات التشجيع والإجابة الصحيحة
            </span>
          </div>
          <button
            type="button"
            onClick={() =>
              updateUserProfile({ soundEffectsEnabled: !progress.soundEffectsEnabled })
            }
            className={`w-12 h-7 rounded-full transition-colors relative cursor-pointer ${
              progress.soundEffectsEnabled ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-xs absolute top-1 transition-transform ${
                progress.soundEffectsEnabled ? 'right-1' : 'right-6'
              }`}
            />
          </button>
        </div>

        {/* Data Backup & Restore */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
            النسخ الاحتياطي ونقل البيانات:
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleExport}
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-sky-400 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
            >
              <Download className="w-4 h-4 text-sky-600" />
              <span>تصدير ملف التقدم</span>
            </button>
            <button
              type="button"
              onClick={() => setShowImportArea(!showImportArea)}
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-sky-400 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
            >
              <Upload className="w-4 h-4 text-purple-600" />
              <span>استيراد ملف</span>
            </button>
          </div>

          {showImportArea && (
            <div className="space-y-2 pt-2 animate-in fade-in">
              <textarea
                rows={4}
                value={importJson}
                onChange={(e) => setImportJson(e.target.value)}
                placeholder="الصق محتوى ملف النسخة الاحتياطية (JSON) هنا..."
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-mono bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-sky-500"
              />
              <button
                type="button"
                onClick={handleImport}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold cursor-pointer"
              >
                تطبيق واستعادة التقدم
              </button>
            </div>
          )}
        </div>

        {/* Reset Actions */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <label className="block text-xs font-bold text-red-600 dark:text-red-400">
            منطقة إعادة التعيين:
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                resetSpecificData({ resetLessons: true });
                setMessage('تمت إعادة تعيين سجل إتمام الدروس.');
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 cursor-pointer"
            >
              تصفير الدروس فقط
            </button>
            <button
              type="button"
              onClick={() => {
                resetSpecificData({ resetVocab: true });
                setMessage('تمت استعادة الكلمات الافتراضية.');
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 cursor-pointer"
            >
              استعادة الكلمات الافتراضية
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
