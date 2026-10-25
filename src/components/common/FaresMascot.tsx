import React from 'react';

export type MascotMood = 'happy' | 'cheering' | 'thinking' | 'proud' | 'wave';

interface FaresMascotProps {
  mood?: MascotMood;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  speechText?: string;
}

export const FaresMascot: React.FC<FaresMascotProps> = ({
  mood = 'happy',
  size = 'md',
  className = '',
  speechText,
}) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-28 h-28',
    xl: 'w-36 h-36',
  };

  return (
    <div className={`relative inline-flex items-center gap-3 select-none ${className}`}>
      {/* Speech Bubble if present */}
      {speechText && (
        <div className="relative px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs sm:text-sm font-extrabold border-2 border-b-4 border-slate-200 border-b-slate-300 dark:border-slate-700 dark:border-b-slate-900 shadow-md max-w-xs animate-in fade-in zoom-in-95 duration-200">
          <span>{speechText}</span>
          <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-0 h-0 border-y-8 border-y-transparent border-l-8 border-l-slate-200 dark:border-l-slate-700" />
          <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-0 h-0 border-y-7 border-y-transparent border-l-7 border-l-white dark:border-l-slate-800" />
        </div>
      )}

      {/* Vector Mascot Character */}
      <div className={`relative shrink-0 ${sizeClasses[size]}`}>
        <svg
          viewBox="0 0 120 120"
          className="w-full h-full drop-shadow-md hover:scale-105 transition-transform duration-300 cursor-pointer"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Ground shadow */}
          <ellipse cx="60" cy="112" rx="36" ry="7" fill="#000000" fillOpacity="0.15" />
          {/* Cape */}
          <path
            d="M32 55 C20 70, 24 98, 48 102 C40 90, 40 70, 48 58 Z"
            fill="#0284c7"
          />
          {/* Body */}
          <ellipse cx="60" cy="68" rx="38" ry="36" fill="#10b981" />
          {/* Belly */}
          <ellipse cx="60" cy="74" rx="26" ry="24" fill="#a7f3d0" />
          {/* Feet */}
          <ellipse cx="46" cy="104" rx="10" ry="6" fill="#f59e0b" />
          <ellipse cx="74" cy="104" rx="10" ry="6" fill="#f59e0b" />
          {/* Crest */}
          <path
            d="M60 10 C50 10, 46 22, 52 28 C48 30, 52 38, 60 38 C68 38, 72 30, 68 28 C74 22, 70 10, 60 10 Z"
            fill="#f59e0b"
          />
          {/* Visor */}
          <path
            d="M36 40 C44 34, 76 34, 84 40 C80 46, 40 46, 36 40 Z"
            fill="#38bdf8"
          />
          <circle cx="60" cy="38" r="4" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />

          {/* Eyes */}
          {mood === 'cheering' ? (
            <>
              <path
                d="M44 54 Q 50 46, 56 54"
                stroke="#1f2937"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M64 54 Q 70 46, 76 54"
                stroke="#1f2937"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />
            </>
          ) : (
            <>
              <circle cx="48" cy="54" r="8" fill="#ffffff" stroke="#047857" strokeWidth="2" />
              <circle cx="49" cy="54" r="5" fill="#0f172a" />
              <circle cx="47" cy="52" r="2" fill="#ffffff" />
              <circle cx="72" cy="54" r="8" fill="#ffffff" stroke="#047857" strokeWidth="2" />
              <circle cx="71" cy="54" r="5" fill="#0f172a" />
              <circle cx="69" cy="52" r="2" fill="#ffffff" />
            </>
          )}

          {/* Cheeks */}
          <ellipse cx="37" cy="64" rx="5" ry="3" fill="#f43f5e" fillOpacity="0.4" />
          <ellipse cx="83" cy="64" rx="5" ry="3" fill="#f43f5e" fillOpacity="0.4" />

          {/* Beak / Smile */}
          <path
            d="M54 62 Q 60 70, 66 62 Z"
            fill="#f59e0b"
            stroke="#d97706"
            strokeWidth="1.5"
          />

          {/* Wings */}
          {mood === 'wave' ? (
            <>
              <path d="M24 64 C20 74, 28 84, 34 78 Z" fill="#059669" />
              <path d="M86 64 C96 52, 106 58, 98 72 Z" fill="#059669" />
            </>
          ) : mood === 'proud' ? (
            <>
              <path d="M26 66 C20 74, 30 82, 36 76 Z" fill="#059669" />
              <path d="M94 66 C100 74, 90 82, 84 76 Z" fill="#059669" />
            </>
          ) : (
            <>
              <path d="M26 68 C22 76, 30 84, 36 78 Z" fill="#059669" />
              <path d="M94 68 C98 76, 90 84, 84 78 Z" fill="#059669" />
            </>
          )}

          {/* Golden Badge */}
          <polygon
            points="60,78 62,82 66,83 63,86 64,90 60,88 56,90 57,86 54,83 58,82"
            fill="#fbbf24"
            stroke="#b45309"
            strokeWidth="1"
          />
        </svg>
      </div>
    </div>
  );
};
