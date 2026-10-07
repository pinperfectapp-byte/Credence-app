import React from 'react';
import { getCreditTier } from '../utils/creditCalculator';
import { ShieldCheck, TrendingUp } from 'lucide-react';

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
  scoreDelta = 0,
  selectedBureau = 'all',
  onSelectBureau,
  privacyMode = false,
}) => {
  const isUninitialized = score === 0;
  const { tier, color, badgeBg } = isUninitialized
    ? {
        tier: 'Uninitialized File',
        color: 'text-slate-500 dark:text-slate-400',
        badgeBg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
      }
    : getCreditTier(score);

  // Score mapping: 300 to 850 (range: 550)
  const normalized = isUninitialized ? 300 : Math.min(Math.max(score, 300), 850);
  const percentage = isUninitialized ? 0 : (normalized - 300) / 550;

  // Arc math for half-circle SVG: -180 deg to 0 deg
  const radius = 90;
  const strokeWidth = 14;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - percentage * circumference;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs transition-colors overflow-hidden text-center">
      {/* Gauge Arc */}
      <div className="relative flex flex-col items-center justify-center shrink-0 mx-auto">
        <svg className="w-52 h-28 overflow-visible" viewBox="0 0 220 120">
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="25%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#0ea5e9" />
              <stop offset="75%" stopColor="#14b8a6" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>

          {/* Background Arc */}
          <path
            d="M 20,110 A 90,90 0 0,1 200,110"
            fill="none"
            stroke="currentColor"
            className="text-slate-200 dark:text-slate-800"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Active Colored Arc */}
          <path
            d="M 20,110 A 90,90 0 0,1 200,110"
            fill="none"
            stroke="url(#scoreGradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Central Score Digits */}
        <div className="text-center -mt-16">
          <div className={`flex items-baseline justify-center gap-1 ${privacyMode ? 'privacy-masked' : ''}`}>
            <span className="text-4xl font-extrabold text-slate-900 dark:text-white font-mono-numeric tracking-tight">
              {isUninitialized ? '--' : score}
            </span>
            <span className="text-xs font-semibold text-slate-400">/ 850</span>
          </div>

          <div className="mt-1 flex items-center justify-center gap-2">
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${badgeBg}`}>
              {tier}
            </span>
            {scoreDelta !== 0 && (
              <span
                className={`text-xs font-semibold flex items-center font-mono-numeric ${
                  scoreDelta > 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                <TrendingUp
                  className={`w-3 h-3 mr-0.5 inline ${
                    scoreDelta < 0 ? 'rotate-180 text-rose-600 dark:text-rose-400' : ''
                  }`}
                />
                {scoreDelta > 0 ? `+${scoreDelta}` : scoreDelta} pts
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Tri-Bureau Selector Tabs: Compact and fits in 9:16 width */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-1.5 text-center font-mono-numeric text-[11px]">
        <button
          type="button"
          onClick={() => onSelectBureau && onSelectBureau('experian')}
          className={`py-1.5 px-1 rounded-xl border transition-all cursor-pointer ${
            selectedBureau === 'experian'
              ? 'bg-emerald-500 text-slate-950 border-emerald-500 font-bold shadow-xs'
              : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
          }`}
        >
          <span className="block text-[9px] uppercase text-slate-400 font-bold">Experian</span>
          <span className={`font-black ${privacyMode ? 'privacy-masked' : ''}`}>
            {isUninitialized ? '--' : (bureaus.experian || score)}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onSelectBureau && onSelectBureau('transUnion')}
          className={`py-1.5 px-1 rounded-xl border transition-all cursor-pointer ${
            selectedBureau === 'transUnion'
              ? 'bg-emerald-500 text-slate-950 border-emerald-500 font-bold shadow-xs'
              : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
          }`}
        >
          <span className="block text-[9px] uppercase text-slate-400 font-bold">TransUnion</span>
          <span className={`font-black ${privacyMode ? 'privacy-masked' : ''}`}>
            {isUninitialized ? '--' : (bureaus.transUnion || score)}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onSelectBureau && onSelectBureau('equifax')}
          className={`py-1.5 px-1 rounded-xl border transition-all cursor-pointer ${
            selectedBureau === 'equifax'
              ? 'bg-emerald-500 text-slate-950 border-emerald-500 font-bold shadow-xs'
              : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
          }`}
        >
          <span className="block text-[9px] uppercase text-slate-400 font-bold">Equifax</span>
          <span className={`font-black ${privacyMode ? 'privacy-masked' : ''}`}>
            {isUninitialized ? '--' : (bureaus.equifax || score)}
          </span>
        </button>
      </div>
    </div>
  );
};
