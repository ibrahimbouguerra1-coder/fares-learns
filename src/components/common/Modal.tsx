import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  maxWidth?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  maxWidth = 'max-w-lg',
  children,
  footer,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className={`w-full ${maxWidth} rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col text-right my-auto max-h-[92vh]`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        {(title || icon) && (
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-3 shrink-0">
            <div className="flex items-start gap-2.5 min-w-0 flex-1">
              {icon && <div className="shrink-0 mt-0.5">{icon}</div>}
              <div className="min-w-0 flex-1">
                {title && (
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white break-words leading-snug">
                    {title}
                  </h2>
                )}
                {subtitle && (
                  <p className="text-xs text-slate-500 mt-0.5 break-words leading-relaxed">{subtitle}</p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer shrink-0"
              title="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Modal Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">{children}</div>

        {/* Modal Footer */}
        {footer && (
          <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
