import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface AudioButtonProps {
  isPlaying?: boolean;
  onClick: (e: React.MouseEvent) => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  title?: string;
}

export const AudioButton: React.FC<AudioButtonProps> = ({
  isPlaying = false,
  onClick,
  size = 'md',
  className = '',
  title = 'استمع للنطق الصوتي',
}) => {
  const sizeClasses = {
    sm: 'min-h-[36px] min-w-[36px] p-1.5 rounded-lg',
    md: 'min-h-[42px] min-w-[42px] p-2 rounded-xl',
    lg: 'min-h-[48px] min-w-[48px] p-2.5 rounded-2xl',
  }[size];

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }[size];

  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`flex items-center justify-center transition shrink-0 cursor-pointer ${sizeClasses} ${
        isPlaying
          ? 'bg-sky-600 text-white ring-2 ring-sky-400'
          : 'bg-slate-100 hover:bg-sky-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-sky-600 dark:text-sky-400 border border-slate-200 dark:border-slate-700'
      } ${className}`}
    >
      {isPlaying ? (
        <VolumeX className={iconSizes} />
      ) : (
        <Volume2 className={iconSizes} />
      )}
    </button>
  );
};
