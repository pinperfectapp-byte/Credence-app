import React, { useMemo, useState, useRef, useEffect } from 'react';
import { DebtItem, calculateDebtComparison, ComparisonResult } from '../utils/debtCalculator';
import { 
  Flame, 
  Snowflake, 
  DollarSign, 
  Calendar, 
  TrendingDown, 
  Zap, 
  ArrowRight,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Info
} from 'lucide-react';

interface DebtPayoffVisualizerProps {
  debts: DebtItem[];
  extraPayment: number;
  onExtraPaymentChange: (amount: number) => void;
  activeStrategyView?: 'Avalanche' | 'Snowball';
  onSelectStrategyView?: (strategy: 'Avalanche' | 'Snowball') => void;
}

export const DebtPayoffVisualizer: React.FC<DebtPayoffVisualizerProps> = ({
  debts,
  extraPayment,
  onExtraPaymentChange,
  activeStrategyView = 'Avalanche',
  onSelectStrategyView
}) => {
  // Real-time calculation based on debts and current extraPayment
  const comparison: ComparisonResult = useMemo(() => {
    return calculateDebtComparison(debts, extraPayment);
  }, [debts, extraPayment]);

  const [showInterestTooltip, setShowInterestTooltip] = useState(false);
  const interestTooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (interestTooltipRef.current && !interestTooltipRef.current.contains(event.target as Node)) {
        setShowInterestTooltip(false);
      }
    };
    if (showInterestTooltip) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showInterestTooltip]);

  const totalBalance = debts.reduce((sum, d) => sum + d.balance, 0);
  const totalMinPayment = debts.reduce((sum, d) => sum + d.minPayment, 0);
  const totalMonthlyCommitment = totalMinPayment + extraPayment;

  // Helper date formatter
  const getPayoffDate = (months: number) => {
    if (months <= 0) return 'Immediate';
    const now = new Date();
    const targetDate = new Date(now.getFullYear(), now.getMonth() + months, 1);
    return targetDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const avalancheMonths = comparison.avalanche.totalMonths;
  const snowballMonths = comparison.snowball.totalMonths;
  const minimumMonths = comparison.minimumOnly.totalMonths;

  const avalancheInterest = comparison.avalanche.totalInterest;
  const snowballInterest = comparison.snowball.totalInterest;
  const minimumInterest = comparison.minimumOnly.totalInterest;

  // Max bounds for relative percentage scaling of animated bars
  const maxMonthsBound = Math.max(1, minimumMonths, avalancheMonths, snowballMonths);
  const maxInterestBound = Math.max(1, minimumInterest, avalancheInterest, snowballInterest);

  const avalancheMonthPct = Math.min(100, Math.max(8, (avalancheMonths / maxMonthsBound) * 100));
  const snowballMonthPct = Math.min(100, Math.max(8, (snowballMonths / maxMonthsBound) * 100));
  const minimumMonthPct = Math.min(100, Math.max(8, (minimumMonths / maxMonthsBound) * 100));

  const avalancheInterestPct = Math.min(100, Math.max(8, (avalancheInterest / maxInterestBound) * 100));
  const snowballInterestPct = Math.min(100, Math.max(8, (snowballInterest / maxInterestBound) * 100));
  const minimumInterestPct = Math.min(100, Math.max(8, (minimumInterest / maxInterestBound) * 100));

  const quickPresets = [0, 50, 100, 200, 350, 500, 1000];

  return (
    <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-6">
      {/* Visualizer Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-[10px] font-black uppercase tracking-wider font-mono-numeric">
              Dynamic Visualizer Engine
            </span>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
              Live Real-Time Math
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
            Snowball vs. Avalanche Payoff Visualizer
          </h3>
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
            Adjust monthly payment in real time to see your debt-free date and total dollar savings update dynamically.
          </p>
        </div>

        {/* Quick Strategy Switcher */}
        {onSelectStrategyView && (
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl shrink-0 self-start sm:self-auto">
            <button
              onClick={() => onSelectStrategyView('Avalanche')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                activeStrategyView === 'Avalanche'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Avalanche</span>
            </button>
            <button
              onClick={() => onSelectStrategyView('Snowball')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                activeStrategyView === 'Snowball'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Snowflake className="w-3.5 h-3.5" />
              <span>Snowball</span>
            </button>
          </div>
        )}
      </div>

      {/* Interactive Monthly Payment Amount Controller */}
      <div className="p-4.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <label className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5 font-mono-numeric">
              <DollarSign className="w-4 h-4 text-emerald-500" />
              <span>Extra Monthly Payment Towards Debt</span>
            </label>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mt-0.5">
              Added directly to target account on top of mandatory ${totalMinPayment.toLocaleString()} minimums
            </span>
          </div>

          <div className="flex items-baseline gap-2 self-start sm:self-auto">
            <div className="flex items-center gap-1 px-3 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 shadow-xs">
              <span className="text-sm font-black text-slate-400 font-mono-numeric">+$</span>
              <input
                type="number"
                min="0"
                max="5000"
                step="25"
                value={extraPayment}
                onChange={(e) => onExtraPaymentChange(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-20 bg-transparent text-slate-900 dark:text-white font-mono-numeric font-black text-base focus:outline-hidden text-right"
              />
              <span className="text-xs font-bold text-slate-400">/mo</span>
            </div>
          </div>
        </div>

        {/* Real-time slider */}
        <div className="space-y-1.5">
          <input
            type="range"
            min="0"
            max="1500"
            step="25"
            value={extraPayment}
            onChange={(e) => onExtraPaymentChange(parseInt(e.target.value) || 0)}
            className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500 transition-all"
          />
          <div className="flex justify-between text-[10px] font-mono-numeric font-bold text-slate-400">
            <span>$0 (Minimums Only)</span>
            <span>+$250/mo</span>
            <span>+$500/mo</span>
            <span>+$1,000/mo</span>
            <span>+$1,500/mo</span>
          </div>
        </div>

        {/* Quick Presets Bar */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 font-mono-numeric mr-1">
            Quick Presets:
          </span>
          {quickPresets.map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => onExtraPaymentChange(amt)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono-numeric font-bold transition-all cursor-pointer ${
                extraPayment === amt
                  ? 'bg-emerald-600 text-white font-black shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              {amt === 0 ? '$0 Extra' : `+$${amt}/mo`}
            </button>
          ))}
        </div>

        {/* Total Monthly Cash Flow Box */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20 text-xs font-mono-numeric">
          <span className="text-emerald-800 dark:text-emerald-300 font-bold">
            Total Monthly Outflow (Minimums + Extra):
          </span>
          <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
            ${totalMonthlyCommitment.toLocaleString()}/month
          </span>
        </div>
      </div>

      {/* DYNAMIC ANIMATED BAR CHART 1: MONTHS TO DEBT-FREE */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-500" />
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white font-mono-numeric">
              Payoff Speed & Debt-Free Date (Months)
            </h4>
          </div>
          <span className="text-[11px] font-bold text-slate-400">
            Shorter is faster
          </span>
        </div>

        <div className="space-y-3 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
          {/* Bar 1: Avalanche Strategy */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-black">
                <Flame className="w-3.5 h-3.5" />
                <span>Debt Avalanche (Highest APR First)</span>
              </span>
              <div className="flex items-center gap-2 font-mono-numeric">
                <span className="text-emerald-600 dark:text-emerald-400 font-black text-sm">
                  {avalancheMonths} mos
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-black">
                  {getPayoffDate(avalancheMonths)}
                </span>
              </div>
            </div>

            <div className="w-full bg-slate-200 dark:bg-slate-700 h-6 rounded-xl overflow-hidden p-0.5">
              <div
                className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-full rounded-lg transition-all duration-500 ease-out flex items-center justify-end px-2 text-[10px] font-black text-slate-950 font-mono-numeric shadow-xs"
                style={{ width: `${avalancheMonthPct}%` }}
              >
                {avalancheMonths} Months
              </div>
            </div>
          </div>

          {/* Bar 2: Snowball Strategy */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-1.5 text-sky-700 dark:text-sky-400 font-black">
                <Snowflake className="w-3.5 h-3.5" />
                <span>Debt Snowball (Smallest Balance First)</span>
              </span>
              <div className="flex items-center gap-2 font-mono-numeric">
                <span className="text-sky-600 dark:text-sky-400 font-black text-sm">
                  {snowballMonths} mos
                </span>
                <span className="px-2 py-0.5 rounded-md bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 text-[10px] font-black">
                  {getPayoffDate(snowballMonths)}
                </span>
              </div>
            </div>

            <div className="w-full bg-slate-200 dark:bg-slate-700 h-6 rounded-xl overflow-hidden p-0.5">
              <div
                className="bg-gradient-to-r from-sky-500 to-sky-400 h-full rounded-lg transition-all duration-500 ease-out flex items-center justify-end px-2 text-[10px] font-black text-slate-950 font-mono-numeric shadow-xs"
                style={{ width: `${snowballMonthPct}%` }}
              >
                {snowballMonths} Months
              </div>
            </div>
          </div>

          {/* Bar 3: Minimum Payments Only (Baseline) */}
          <div className="space-y-1 opacity-75">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-500 dark:text-slate-400 font-semibold">
                Baseline (Mandatory Minimum Payments Only)
              </span>
              <div className="flex items-center gap-2 font-mono-numeric">
                <span className="text-slate-600 dark:text-slate-300 font-bold text-xs">
                  {minimumMonths} mos
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px]">
                  {getPayoffDate(minimumMonths)}
                </span>
              </div>
            </div>

            <div className="w-full bg-slate-200 dark:bg-slate-700 h-4 rounded-lg overflow-hidden p-0.5">
              <div
                className="bg-slate-400 dark:bg-slate-500 h-full rounded-md transition-all duration-500 ease-out flex items-center justify-end px-2 text-[9px] font-black text-white font-mono-numeric"
                style={{ width: `${minimumMonthPct}%` }}
              >
                {minimumMonths} mos
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DYNAMIC ANIMATED BAR CHART 2: TOTAL INTEREST PAID IN DOLLARS ($) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-emerald-500" />
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white font-mono-numeric">
              Total Pure Interest Burned ($ In Real Cash)
            </h4>
          </div>
          <div className="relative" ref={interestTooltipRef}>
            <button
              type="button"
              onClick={() => setShowInterestTooltip(!showInterestTooltip)}
              onMouseEnter={() => setShowInterestTooltip(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 hover:border-emerald-400 text-xs font-black font-mono-numeric transition-all cursor-pointer shadow-2xs"
            >
              <span>Save +${comparison.interestSavedWithAvalanche.toLocaleString()} with Avalanche</span>
              <Info className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            </button>

            {/* Dynamic Tooltip Popover */}
            {showInterestTooltip && (
              <div 
                className="absolute right-0 top-8 z-50 w-72 max-w-[calc(100vw-2rem)] p-3.5 bg-slate-900 text-white rounded-2xl shadow-xl border border-emerald-500/40 text-xs space-y-2 animate-in fade-in zoom-in-95 duration-150"
                onMouseLeave={() => setShowInterestTooltip(false)}
              >
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 text-emerald-400 font-black uppercase text-[10px] font-mono-numeric">
                  <span>Exact Interest Calculation</span>
                  <span className="text-slate-400 font-normal">Snowball vs. Avalanche</span>
                </div>
                <div className="space-y-1 font-mono-numeric text-[11px] bg-slate-950/80 p-2 rounded-xl">
                  <div className="flex justify-between text-sky-400">
                    <span>Snowball Interest:</span>
                    <span>${snowballInterest.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-emerald-400">
                    <span>Avalanche Interest:</span>
                    <span>-${avalancheInterest.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-800 text-emerald-300 font-black">
                    <span>Exact Cash Kept:</span>
                    <span>+${comparison.interestSavedWithAvalanche.toLocaleString()}</span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-300 leading-normal">
                  Avalanche targets higher APRs first, reducing compounding interest charges over the life of your debt.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
          {/* Avalanche Interest */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-emerald-700 dark:text-emerald-400 font-black">
                Avalanche Interest
              </span>
              <span className="font-mono-numeric font-black text-emerald-600 dark:text-emerald-400 text-sm">
                ${avalancheInterest.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-6 rounded-xl overflow-hidden p-0.5">
              <div
                className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-full rounded-lg transition-all duration-500 ease-out flex items-center justify-end px-2 text-[10px] font-black text-slate-950 font-mono-numeric shadow-xs"
                style={{ width: `${avalancheInterestPct}%` }}
              >
                ${avalancheInterest.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Snowball Interest */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-sky-700 dark:text-sky-400 font-black">
                Snowball Interest
              </span>
              <div className="flex items-center gap-1 font-mono-numeric">
                <span className="font-black text-sky-600 dark:text-sky-400 text-sm">
                  ${snowballInterest.toLocaleString()}
                </span>
                {comparison.interestSavedWithAvalanche > 0 && (
                  <span className="text-[10px] text-rose-500 font-bold ml-1">
                    (+${comparison.interestSavedWithAvalanche.toLocaleString()})
                  </span>
                )}
              </div>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-6 rounded-xl overflow-hidden p-0.5">
              <div
                className="bg-gradient-to-r from-sky-500 to-sky-400 h-full rounded-lg transition-all duration-500 ease-out flex items-center justify-end px-2 text-[10px] font-black text-slate-950 font-mono-numeric shadow-xs"
                style={{ width: `${snowballInterestPct}%` }}
              >
                ${snowballInterest.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Minimums Interest */}
          <div className="space-y-1 opacity-75">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-rose-600 dark:text-rose-400 font-semibold">
                Minimums Only Interest Trap
              </span>
              <span className="font-mono-numeric font-bold text-rose-600 dark:text-rose-400 text-xs">
                ${minimumInterest.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-4 rounded-lg overflow-hidden p-0.5">
              <div
                className="bg-rose-500 h-full rounded-md transition-all duration-500 ease-out flex items-center justify-end px-2 text-[9px] font-black text-white font-mono-numeric"
                style={{ width: `${minimumInterestPct}%` }}
              >
                ${minimumInterest.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real-Time Live Mathematical Insight Callout */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border-2 border-emerald-500/30 flex items-start gap-3">
        <div className="p-2 rounded-xl bg-emerald-500 text-slate-950 shrink-0 mt-0.5">
          <Zap className="w-4 h-4 stroke-[2.5]" />
        </div>
        <div className="space-y-1 text-xs">
          <span className="font-black text-slate-900 dark:text-white uppercase tracking-wider block font-mono-numeric">
            Real-Time Mathematical Verdict
          </span>
          <p className="font-semibold text-slate-700 dark:text-slate-300 leading-relaxed">
            By committing <strong className="text-emerald-600 dark:text-emerald-400 font-black font-mono-numeric">+${extraPayment}/mo</strong>, you become completely debt-free by{' '}
            <strong className="text-slate-950 dark:text-white font-black">{getPayoffDate(avalancheMonths)}</strong>. You eliminate{' '}
            <strong className="text-emerald-600 dark:text-emerald-400 font-black font-mono-numeric">${comparison.interestSavedVsMinimums.toLocaleString()}</strong> in predatory bank interest and shave{' '}
            <strong className="text-slate-950 dark:text-white font-black font-mono-numeric">{comparison.monthsSavedVsMinimums} months</strong> off your debt timeline compared to minimums.
          </p>
        </div>
      </div>
    </div>
  );
};
