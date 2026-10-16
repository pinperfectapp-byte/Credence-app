import React from 'react';
import { getCreditTier } from '../utils/creditCalculator';
import { Check } from 'lucide-react';

interface ScoreGaugeProps {
  score: number;
  bureaus: {
    experian: number;
    transUnion: number;
    equifax: number;
  };
  scoreDelta?: number;
  selectedBureau?: 'all' | 'experian' | 'transUnion' | 'equifax';
  onSelectBureau?: (bureau: 'all' | 'experian' | 'transUnion' | 'equifax') => void;
  privacyMode?: boolean;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  score,
  bureaus,
  scoreDelta = 12,
  selectedBureau = 'all',
  onSelectBureau,
  privacyMode = false,
}) => {
  const isUninitialized = score === 0;
  const displayScore = isUninitialized ? 742 : score;
  const { tier } = isUninitialized ? { tier: 'Good' } : getCreditTier(displayScore);

  // Score mapping: 300 to 850 (range: 550)
  const normalized = Math.min(Math.max(displayScore, 300), 850);
  const percentage = (normalized - 300) / 550;

  // Full circle geometry (viewBox 0 0 180 180, center 90, 90, radius 70)
  const radius = 70;
  const strokeWidth = 11;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - percentage * circumference;

  return (
    <div className="w-full flex flex-col items-center justify-center text-center select-none">
      {/* Circular Progress Gauge */}
      <div className="relative w-48 h-48 flex items-center justify-center my-1">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 180 180">
          <defs>
            <linearGradient id="gaugeActiveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00D2FF" />
              <stop offset="100%" stopColor="#2563EB" />
            </linearGradient>
          </defs>
          {/* Background circle ring */}
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-200 dark:text-[rgba(30,58,110,0.45)]"
          />

          {/* Active electric cyan/blue arc */}
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            stroke="url(#gaugeActiveGrad)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out dark:drop-shadow-[0_0_10px_rgba(0,210,255,0.6)]"
          />
        </svg>

        {/* Center content inside circular ring */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={`text-4xl sm:text-[44px] font-black text-slate-900 dark:text-white tracking-tight leading-none font-mono-numeric ${
              privacyMode ? 'privacy-masked' : ''
            }`}
          >
            {isUninitialized ? '--' : displayScore}
          </span>

          {/* Tier Pill Badge: Blue with checkmark */}
          <div className="mt-2.5 px-3 py-0.5 rounded-full bg-[#1E88E5] dark:bg-[#0E2A52] text-white dark:text-[#38BDF8] dark:border dark:border-[#38BDF8]/40 text-xs font-bold flex items-center gap-1 shadow-xs">
            <span>{isUninitialized ? 'Good' : tier}</span>
            <Check className="w-3 h-3 stroke-[3]" />
          </div>
        </div>
      </div>

      {/* Subtitle from Image: "Updated today • +12 pts" */}
      <div className="mt-2 text-xs font-medium text-slate-500 dark:text-[#8FA0C0] font-mono-numeric flex items-center justify-center gap-1">
        <span>Updated today</span>
        <span>•</span>
        <span className="text-emerald-500 dark:text-[#00E676] font-bold">
          {scoreDelta >= 0 ? `+${scoreDelta}` : scoreDelta} pts
        </span>
      </div>

      {/* Tri-Bureau Selector Tabs */}
      <div className="w-full mt-4 pt-3 border-t border-slate-100 dark:border-[rgba(56,120,210,0.2)] grid grid-cols-3 gap-2 text-center font-mono-numeric text-[11px]">
        <button
          type="button"
          onClick={() => onSelectBureau && onSelectBureau('experian')}
          className={`py-1.5 px-1 rounded-xl border transition-all cursor-pointer ${
            selectedBureau === 'experian'
              ? 'bg-blue-50 dark:bg-[#0E2A52] text-blue-700 dark:text-[#38BDF8] border-blue-400 dark:border-[#38BDF8]/50 font-bold shadow-xs'
              : 'bg-slate-50 dark:bg-[#0C182F] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-[rgba(56,120,210,0.25)] hover:bg-slate-100 dark:hover:bg-[#102244]'
          }`}
        >
          <span className="block text-[9px] uppercase text-slate-400 dark:text-[#8FA0C0] font-bold">Experian</span>
          <span className={`font-black ${privacyMode ? 'privacy-masked' : ''}`}>
            {isUninitialized ? '--' : (bureaus.experian || displayScore)}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onSelectBureau && onSelectBureau('transUnion')}
          className={`py-1.5 px-1 rounded-xl border transition-all cursor-pointer ${
            selectedBureau === 'transUnion'
              ? 'bg-blue-50 dark:bg-[#0E2A52] text-blue-700 dark:text-[#38BDF8] border-blue-400 dark:border-[#38BDF8]/50 font-bold shadow-xs'
              : 'bg-slate-50 dark:bg-[#0C182F] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-[rgba(56,120,210,0.25)] hover:bg-slate-100 dark:hover:bg-[#102244]'
          }`}
        >
          <span className="block text-[9px] uppercase text-slate-400 dark:text-[#8FA0C0] font-bold">TransUnion</span>
          <span className={`font-black ${privacyMode ? 'privacy-masked' : ''}`}>
            {isUninitialized ? '--' : (bureaus.transUnion || displayScore)}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onSelectBureau && onSelectBureau('equifax')}
          className={`py-1.5 px-1 rounded-xl border transition-all cursor-pointer ${
            selectedBureau === 'equifax'
              ? 'bg-blue-50 dark:bg-[#0E2A52] text-blue-700 dark:text-[#38BDF8] border-blue-400 dark:border-[#38BDF8]/50 font-bold shadow-xs'
              : 'bg-slate-50 dark:bg-[#0C182F] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-[rgba(56,120,210,0.25)] hover:bg-slate-100 dark:hover:bg-[#102244]'
          }`}
        >
          <span className="block text-[9px] uppercase text-slate-400 dark:text-[#8FA0C0] font-bold">Equifax</span>
          <span className={`font-black ${privacyMode ? 'privacy-masked' : ''}`}>
            {isUninitialized ? '--' : (bureaus.equifax || displayScore)}
          </span>
        </button>
      </div>
    </div>
  );
};
