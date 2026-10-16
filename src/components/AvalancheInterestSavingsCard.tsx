import React, { useState, useRef, useEffect } from 'react';
import { DebtItem, ComparisonResult } from '../utils/debtCalculator';
import { 
  Flame, 
  Snowflake, 
  DollarSign, 
  TrendingDown, 
  Info, 
  HelpCircle, 
  Zap, 
  CheckCircle2, 
  ArrowRight, 
  Percent, 
  ShieldCheck,
  X
} from 'lucide-react';

interface AvalancheInterestSavingsCardProps {
  debts: DebtItem[];
  extraPayment: number;
  comparison: ComparisonResult;
  onSelectStrategyView?: (strategy: 'Avalanche' | 'Snowball') => void;
  activeStrategyView?: 'Avalanche' | 'Snowball';
}

export const AvalancheInterestSavingsCard: React.FC<AvalancheInterestSavingsCardProps> = ({
  debts,
  extraPayment,
  comparison,
  onSelectStrategyView,
  activeStrategyView = 'Avalanche',
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Close tooltip if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setShowTooltip(false);
      }
    };
    if (showTooltip) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTooltip]);

  const avalancheInterest = comparison.avalanche.totalInterest;
  const snowballInterest = comparison.snowball.totalInterest;
  const interestSaved = comparison.interestSavedWithAvalanche;
  const avalancheMonths = comparison.avalanche.totalMonths;
  const snowballMonths = comparison.snowball.totalMonths;
  const monthDifference = Math.max(0, snowballMonths - avalancheMonths);

  // Percentage saved relative to snowball interest
  const percentSaved = snowballInterest > 0 
    ? Math.round((interestSaved / snowballInterest) * 100) 
    : 0;

  // Payoff date helper
  const getPayoffDate = (months: number) => {
    if (months <= 0) return 'Immediate';
    const now = new Date();
    const targetDate = new Date(now.getFullYear(), now.getMonth() + months, 1);
    return targetDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="relative bg-gradient-to-br from-white to-emerald-50/40 dark:from-slate-900 dark:to-emerald-950/20 border-2 border-emerald-500/30 rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      {/* Top Header Badge & Tooltip Trigger */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="p-1.5 rounded-xl bg-emerald-500 text-slate-950">
              <Flame className="w-4 h-4 stroke-[2.5]" />
            </span>
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300 font-mono-numeric">
              Avalanche Advantage
            </span>
          </div>

          {/* Interactive Dynamic Tooltip Trigger */}
          <div className="relative" ref={tooltipRef}>
            <button
              type="button"
              onClick={() => setShowTooltip(!showTooltip)}
              onMouseEnter={() => setShowTooltip(true)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-300 transition-all text-xs font-bold cursor-pointer shadow-2xs"
              aria-label="View exact math breakdown"
            >
              <Info className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-[11px]">How it's calculated</span>
            </button>

            {/* Dynamic Tooltip Popover */}
            {showTooltip && (
              <div 
                className="absolute right-0 top-8 z-50 w-80 max-w-[calc(100vw-2rem)] p-4 bg-slate-900 text-white rounded-2xl shadow-2xl border border-emerald-500/40 text-xs space-y-3 animate-in fade-in zoom-in-95 duration-150"
                onMouseLeave={() => setShowTooltip(false)}
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-black font-mono-numeric uppercase tracking-wider text-[11px]">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Exact Formula Breakdown</span>
                  </div>
                  <button 
                    onClick={() => setShowTooltip(false)}
                    className="text-slate-400 hover:text-white p-0.5 rounded cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Math calculation lines */}
                <div className="space-y-1.5 font-mono-numeric bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-[11px]">
                  <div className="flex justify-between items-center text-sky-400">
                    <span>Snowball Total Interest:</span>
                    <span className="font-bold">${snowballInterest.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-emerald-400">
                    <span>Avalanche Total Interest:</span>
                    <span className="font-bold">-${avalancheInterest.toLocaleString()}</span>
                  </div>
                  <div className="pt-1 border-t border-slate-800 flex justify-between items-center text-white font-black">
                    <span className="text-emerald-300 font-bold">Net Cash Saved:</span>
                    <span className="text-emerald-400 text-sm font-black">+${interestSaved.toLocaleString()}</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed">
                  The <strong className="text-white">Avalanche method</strong> aggressively knocks out balances with the highest Annual Percentage Rates (APR) first. This prevents maximum daily compounding interest charges, mathematically minimizing your lifetime finance fees.
                </p>

                <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-[10px] text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Updates instantly as you slide monthly extra payment!</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Big Highlight: Exact Interest Saved */}
        <div className="space-y-1">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block font-mono-numeric">
            Exact Pure Interest Saved
          </span>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight font-mono-numeric">
              +${interestSaved.toLocaleString()}
            </span>
            {percentSaved > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[11px] font-black font-mono-numeric">
                {percentSaved}% less interest
              </span>
            )}
          </div>

          <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            {interestSaved > 0 ? (
              <>
                You keep <strong className="text-emerald-600 dark:text-emerald-400 font-black font-mono-numeric">${interestSaved.toLocaleString()}</strong> in your pocket instead of surrendering it to bank finance charges.
              </>
            ) : (
              <>
                Avalanche and Snowball produce equivalent total interest on current card balances.
              </>
            )}
          </p>
        </div>

        {/* Side-by-Side Comparison Box */}
        <div className="p-3.5 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-3 font-mono-numeric">
          <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100 dark:border-slate-700/60">
            <div className="flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-emerald-500" />
              <span className="font-bold text-slate-800 dark:text-slate-200">Avalanche Total Interest:</span>
            </div>
            <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">
              ${avalancheInterest.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100 dark:border-slate-700/60">
            <div className="flex items-center gap-1.5">
              <Snowflake className="w-3.5 h-3.5 text-sky-500" />
              <span className="font-bold text-slate-800 dark:text-slate-200">Snowball Total Interest:</span>
            </div>
            <span className="font-bold text-sky-600 dark:text-sky-400 text-sm">
              ${snowballInterest.toLocaleString()}
            </span>
          </div>

          {/* Payoff Date Comparison */}
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 pt-0.5">
            <span>Avalanche Payoff Date:</span>
            <span className="font-black text-slate-900 dark:text-white">
              {getPayoffDate(avalancheMonths)} ({avalancheMonths} mos)
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <span>Snowball Payoff Date:</span>
            <span className="font-bold text-slate-700 dark:text-slate-300">
              {getPayoffDate(snowballMonths)} ({snowballMonths} mos)
            </span>
          </div>
        </div>

        {/* Real-World Perspective */}
        <div className="p-3 rounded-xl bg-emerald-100/60 dark:bg-emerald-950/40 border border-emerald-500/20 text-xs text-emerald-900 dark:text-emerald-300 flex items-start gap-2">
          <Zap className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-black block">What ${interestSaved.toLocaleString()} means for you:</span>
            <span className="text-[11px] font-medium text-emerald-800 dark:text-emerald-400">
              {interestSaved >= 1000 
                ? `That's equivalent to ${(interestSaved / 400).toFixed(1)} months of emergency groceries or an entire month of rent saved from bank pockets!`
                : interestSaved > 0
                ? `Direct savings that remain in your checking account immediately as your high-APR debt melts away.`
                : `Both strategies will clear your current balance in the exact same timeline.`}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Strategy Quick Action */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 mt-4">
        {onSelectStrategyView && (
          <button
            type="button"
            onClick={() => onSelectStrategyView('Avalanche')}
            className={`w-full py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
              activeStrategyView === 'Avalanche'
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>
              {activeStrategyView === 'Avalanche'
                ? 'Active: Viewing Avalanche Schedule'
                : 'Switch to Avalanche Strategy'}
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
