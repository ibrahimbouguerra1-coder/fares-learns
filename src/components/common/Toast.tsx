import React from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
  type?: 'success' | 'error' | 'info';
}

export const Toast: React.FC<ToastProps> = ({ message, onClose, type = 'success' }) => {
  if (!message) return null;

  const bgClasses = {
    success: 'bg-emerald-600 text-white',
    error: 'bg-red-600 text-white',
    info: 'bg-sky-600 text-white',
  }[type];

  return (
    <div
      role="status"
      className={`p-3.5 rounded-2xl shadow-xl flex items-center justify-between text-xs font-bold gap-3 animate-in fade-in slide-in-from-top-2 duration-200 ${bgClasses}`}
    >
      <div className="flex items-center gap-2 min-w-0 flex-1">
        {type === 'error' ? (
          <AlertCircle className="w-4 h-4 shrink-0" />
        ) : (
          <CheckCircle2 className="w-4 h-4 shrink-0" />
        )}
        <span className="break-words leading-snug">{message}</span>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="text-white/80 hover:text-white p-1 rounded-md transition cursor-pointer shrink-0"
        title="إغلاق"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
