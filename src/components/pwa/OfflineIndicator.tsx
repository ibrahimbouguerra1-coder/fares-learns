import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus.ts';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="alert"
      className="fixed bottom-20 lg:bottom-4 left-4 right-4 sm:right-auto z-50 flex items-center gap-2 rounded-xl bg-amber-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xl border border-amber-500 animate-in fade-in"
    >
      <WifiOff className="w-4 h-4 shrink-0" />
      <span className="break-words leading-snug">أنت حالياً دون اتصال بالإنترنت (الدروس المحفوظة تعمل بوضع الأوفلاين)</span>
    </div>
  );
};
