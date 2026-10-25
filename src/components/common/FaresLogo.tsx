import React from 'react';

interface FaresLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
}

export const FaresLogo: React.FC<FaresLogoProps> = ({
  className = '',
  size = 'md',
  animated = true,
}) => {
  const sizeMap = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${sizeMap[size]} ${className}`}
    >
      {/* Crisp Vector Emblem without blurry aura or dark grey square */}
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full drop-shadow-sm transition-transform duration-300 ${
          animated ? 'group-hover:scale-105 group-hover:rotate-1' : ''
        }`}
      >
        <defs>
          <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="50%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="wingGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#e0f2fe" />
          </linearGradient>
          <linearGradient id="sparkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
        </defs>

        {/* Clean rounded squircle shield */}
        <rect
          x="6"
          y="6"
          width="88"
          height="88"
          rx="24"
          fill="url(#shieldGrad)"
        />
        <rect
          x="6"
          y="6"
          width="88"
          height="88"
          rx="24"
          stroke="#ffffff"
          strokeOpacity="0.25"
          strokeWidth="2"
          fill="none"
        />

        {/* Stem of F */}
        <path
          d="M 28 24 C 28 21.5, 30 20, 33 20 L 42 20 C 44.5 20, 46 21.5, 46 24 L 46 76 C 46 78.5, 44 80, 41 80 L 33 80 C 30 80, 28 78, 28 75 Z"
          fill="#ffffff"
          opacity="0.96"
        />
        {/* Top Wing */}
        <path
          d="M 42 20 L 72 20 C 76 20, 78 22, 76 26 L 68 38 C 66.5 40, 64 41, 61 41 L 46 41 L 42 20 Z"
          fill="url(#wingGrad)"
        />
        {/* Middle Wing */}
        <path
          d="M 44 47 L 64 47 C 67.5 47, 69.5 48.5, 68 51.5 L 63 60 C 61.5 62, 59 63, 56 63 L 45 63 L 44 47 Z"
          fill="#ffffff"
          opacity="0.95"
        />
        {/* Golden Star Crest */}
        <path
          d="M 76 17 L 78 22 L 83 24 L 78 26 L 76 31 L 74 26 L 69 24 L 74 22 Z"
          fill="url(#sparkGrad)"
        />
        {/* Sonic Arc */}
        <path
          d="M 74 44 C 77 47, 77 53, 74 56"
          stroke="#ffffff"
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity="0.9"
        />
        <path
          d="M 80 40 C 85 45, 85 55, 80 60"
          stroke="#fef08a"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.9"
        />
      </svg>
    </div>
  );
};
