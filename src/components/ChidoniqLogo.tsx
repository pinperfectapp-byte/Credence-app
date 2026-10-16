import React from 'react';

export interface ChidoniqLogoProps {
  className?: string;
  size?: number; // Size in px
  showText?: boolean;
  textColor?: 'dark' | 'light' | 'auto';
  animated?: boolean;
}

/**
 * Official CHIDONIQ Sovereign Logo
 * Exact vector replication of the brand emblem:
 * - Cobalt to Midnight Navy gradient shield
 * - Credit score speedometer arc gauge with radial tick marks
 * - Ascending milestone staircase
 * - Dynamic 45-degree upward breakthrough arrow
 * - Dual 4-point sparkle stars
 * - Modern geometric uppercase CHIDONIQ wordmark
 */
export const ChidoniqLogo: React.FC<ChidoniqLogoProps> = ({
  className = '',
  size = 48,
  showText = false,
  textColor = 'auto',
  animated = false,
}) => {
  const textClass =
    textColor === 'dark'
      ? 'text-[#0B1B3D]'
      : textColor === 'light'
      ? 'text-white'
      : 'text-[#0B1B3D] dark:text-white';

  return (
    <div
      className={`inline-flex items-center gap-2.5 select-none ${
        animated ? 'animate-logo-float' : ''
      } ${className}`}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 240 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-200"
      >
        <defs>
          {/* Official Royal Blue to Deep Navy Shield Gradient */}
          <linearGradient id="chLogoGrad" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="25%" stopColor="#2563EB" />
            <stop offset="60%" stopColor="#1D4ED8" />
            <stop offset="100%" stopColor="#0B1B3D" />
          </linearGradient>

          {/* Brighter Accent Gradient for Arrow & Gauge */}
          <linearGradient id="chArrowGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1D4ED8" />
            <stop offset="50%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#38BDF8" />
          </linearGradient>
        </defs>

        <g transform="translate(15, 8)">
          {/* 1. UPPER-LEFT SHIELD FRAME & ROOF */}
          <path
            d="M 44 146
               L 44 62
               L 110 38
               L 142 56
               L 142 68
               L 110 50
               L 58 68
               L 58 136
               Z"
            fill="url(#chLogoGrad)"
          />

          {/* 2. ASCENDING STAIRS (4 Progress Milestones leading to the arrow) */}
          {/* Stair Step 1 */}
          <path
            d="M 58 136 L 76 136 L 76 122 L 58 122 Z"
            fill="url(#chLogoGrad)"
          />
          {/* Stair Step 2 */}
          <path
            d="M 76 122 L 96 122 L 96 108 L 76 108 Z"
            fill="url(#chLogoGrad)"
          />
          {/* Stair Step 3 */}
          <path
            d="M 96 108 L 116 108 L 116 94 L 96 94 Z"
            fill="url(#chLogoGrad)"
          />
          {/* Stair Step 4 (Merges into the diagonal arrow base) */}
          <path
            d="M 116 94 L 132 94 L 132 84 L 116 84 Z"
            fill="url(#chLogoGrad)"
          />

          {/* Stair Base Support connecting to bottom shield */}
          <path
            d="M 58 136 L 126 136 L 112 152 L 44 146 Z"
            fill="url(#chLogoGrad)"
          />

          {/* 3. SPEEDOMETER / CREDIT SCORE ARC GAUGE */}
          {/* Left continuous arc line */}
          <path
            d="M 68 102
               C 68 80, 84 66, 102 66"
            stroke="url(#chArrowGrad)"
            strokeWidth="5.5"
            strokeLinecap="round"
          />

          {/* Radial Segmented Ticks (Top & Right Score Indicator Blocks) */}
          {/* Tick 1 */}
          <path
            d="M 107 65.5 C 112 66, 116 67.5, 120 70"
            stroke="url(#chArrowGrad)"
            strokeWidth="5.5"
            strokeLinecap="round"
          />
          {/* Tick 2 */}
          <path
            d="M 124 73 C 127 75.5, 129.5 78.5, 131 82"
            stroke="url(#chArrowGrad)"
            strokeWidth="5.5"
            strokeLinecap="round"
          />
          {/* Tick 3 */}
          <path
            d="M 133 86 C 134.5 89.5, 135 93, 135 96.5"
            stroke="url(#chArrowGrad)"
            strokeWidth="5.5"
            strokeLinecap="round"
          />

          {/* 4. DYNAMIC BREAKTHROUGH ARROW (Ascending up-right at ~45 degrees) */}
          {/* Lower pointed wedge & shaft */}
          <path
            d="M 92 168
               L 154 78
               L 142 70
               L 182 50
               L 174 92
               L 162 84
               L 106 168
               Z"
            fill="url(#chArrowGrad)"
          />

          {/* 5. LOWER-RIGHT SHIELD WING */}
          <path
            d="M 110 188
               C 134 176, 168 144, 168 98
               L 156 102
               C 156 132, 132 156, 116 168
               Z"
            fill="url(#chLogoGrad)"
          />

          {/* Bottom Shield Apex Tip */}
          <path
            d="M 110 188
               C 106 186, 92 176, 88 170
               L 98 162
               C 102 166, 108 174, 110 188
               Z"
            fill="url(#chLogoGrad)"
          />

          {/* 6. CLEAN GEOMETRIC SOVEREIGN MILESTONE ACCENT (Zero AI stars) */}
          <circle cx="166" cy="46" r="3.5" fill="#38BDF8" />
          <circle cx="152" cy="62" r="2.5" fill="#60A5FA" opacity="0.8" />
        </g>
      </svg>

      {showText && (
        <div className="flex flex-col text-left leading-none">
          <span
            className={`font-black tracking-[0.06em] text-xl uppercase ${textClass}`}
          >
            CHIDONIQ
          </span>
          <span className="text-[10px] font-bold text-blue-600 dark:text-sky-400 font-mono-numeric tracking-wider uppercase mt-0.5">
            Credit &amp; Budget Engine
          </span>
        </div>
      )}
    </div>
  );
};

export const CredenceLogo = ChidoniqLogo;
export default ChidoniqLogo;
