import React from 'react';

interface CredenceLogoProps {
  className?: string;
  size?: number; // Size in px
  showText?: boolean;
  animated?: boolean;
}

export const CredenceLogo: React.FC<CredenceLogoProps> = ({
  className = '',
  size = 64,
  showText = false,
  animated = false,
}) => {
  return (
    <div
      className={`inline-flex flex-col items-center justify-center ${
        animated ? 'animate-logo-float' : ''
      } ${className}`}
    >
      {/* Exact Vector Match of Credence Icon */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 drop-shadow-md transition-transform ${
          animated ? 'hover:scale-105' : ''
        }`}
      >
        <defs>
          {/* Radial aura glow */}
          <radialGradient id="credenceGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#080f1e" stopOpacity="0" />
          </radialGradient>

          {/* Green Gradient */}
          <linearGradient id="emeraldGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00e676" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>

          {/* Gold Gradient */}
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>

          {/* Arrow Shadow */}
          <filter id="arrowShadow" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* Squircle Dark Navy Background */}
        <rect
          x="6"
          y="6"
          width="188"
          height="188"
          rx="52"
          fill="#0c1326"
          stroke={animated ? '#10b981' : '#1e293b'}
          strokeWidth="2.5"
          className={animated ? 'transition-colors duration-1000' : ''}
        />

        {/* Soft radial inner glow */}
        <circle cx="100" cy="95" r="75" fill="url(#credenceGlow)" className={animated ? 'animate-pulse' : ''} />

        {/* Speedometer Gauge Arc (Neon Green) */}
        {/* Arc sweeping from ~220deg to ~40deg */}
        <path
          d="M 52,130 A 62,62 0 1,1 146,132"
          fill="none"
          stroke="#00e676"
          strokeWidth="8"
          strokeLinecap="round"
          className={animated ? 'drop-shadow-[0_0_8px_rgba(0,230,118,0.7)]' : ''}
        />

        {/* Speedometer Notch Ticks (Gold at top-right quadrant) */}
        {/* Radiating ticks from angle -50deg to 15deg */}
        <g stroke="url(#goldGrad)" strokeWidth="3" strokeLinecap="round" className={animated ? 'animate-tick-gleam' : ''}>
          <line x1="68" y1="62" x2="73" y2="67" />
          <line x1="78" y1="53" x2="82" y2="59" />
          <line x1="89" y1="46" x2="92" y2="53" />
          <line x1="101" y1="42" x2="102" y2="49" />
          <line x1="113" y1="41" x2="113" y2="49" />
          <line x1="126" y1="44" x2="124" y2="52" strokeWidth="3.5" />
          <line x1="138" y1="49" x2="134" y2="57" strokeWidth="4" />
          <line x1="149" y1="58" x2="143" y2="65" strokeWidth="4.5" />
        </g>

        {/* Trend Zigzag Line with Upward Arrow */}
        {/* Path: starts at lower-left, rises, dips, shoots up to top right */}
        <g filter="url(#arrowShadow)" className={animated ? 'animate-arrow-surge' : ''}>
          {/* Main zigzag polyline */}
          <path
            d="M 64,122 L 84,98 L 105,122 L 138,82"
            fill="none"
            stroke="#00e676"
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Upward Arrowhead (Emerald with Gold Facet) */}
          <polygon
            points="142,66 122,86 136,88"
            fill="#00e676"
          />
          <polygon
            points="142,66 136,88 150,88"
            fill="url(#goldGrad)"
          />
        </g>
      </svg>

      {/* Optional Wordmark */}
      {showText && (
        <span className="font-extrabold tracking-tight text-slate-900 dark:text-white mt-2 font-sans text-xl">
          Credence
        </span>
      )}
    </div>
  );
};
