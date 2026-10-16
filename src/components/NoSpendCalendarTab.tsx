import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  RotateCcw,
  Flame,
  ArrowLeft,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';
import {
  NoSpendDayRecord,
  getNoSpendDays,
  toggleNoSpendDay,
  getTodayDateString,
  getCurrentMonthName
} from '../data/downbase';

interface NoSpendCalendarTabProps {
  onNavigateTab?: (tabId: string) => void;
  onGoBack?: () => void;
  isEmbedded?: boolean;
}

export const NoSpendCalendarTab: React.FC<NoSpendCalendarTabProps> = ({
  onNavigateTab,
  onGoBack,
  isEmbedded = false
}) => {
  const [noSpendDays, setNoSpendDays] = useState<NoSpendDayRecord[]>([]);
  const [currentYear, setCurrentYear] = useState<number>(() => new Date().getFullYear());
  const [currentMonthIndex, setCurrentMonthIndex] = useState<number>(() => new Date().getMonth());

  const refreshDays = () => {
    setNoSpendDays(getNoSpendDays());
  };

  useEffect(() => {
    refreshDays();
  }, []);

  const todayStr = getTodayDateString();

  // Calendar dates generation
  const daysInMonth = useMemo(() => {
    return new Date(currentYear, currentMonthIndex + 1, 0).getDate();
  }, [currentYear, currentMonthIndex]);

  const monthName = useMemo(() => {
    return new Date(currentYear, currentMonthIndex, 1).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  }, [currentYear, currentMonthIndex]);

  // Set of no-spend dates for quick lookup
  const noSpendSet = useMemo(() => {
    return new Set(noSpendDays.map((d) => d.date));
  }, [noSpendDays]);

  // Current month's count
  const monthPrefix = `${currentYear}-${String(currentMonthIndex + 1).padStart(2, '0')}`;
  const thisMonthCount = useMemo(() => {
    return noSpendDays.filter((d) => d.date.startsWith(monthPrefix)).length;
  }, [noSpendDays, monthPrefix]);

  const estimatedSaved = thisMonthCount * 35;

  const handleToggleDay = (dayNum: number) => {
    const dateStr = `${currentYear}-${String(currentMonthIndex + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    toggleNoSpendDay(dateStr, 35);
    refreshDays();
  };

  const handlePrevMonth = () => {
    if (currentMonthIndex === 0) {
      setCurrentMonthIndex(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonthIndex((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonthIndex === 11) {
      setCurrentMonthIndex(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonthIndex((m) => m + 1);
    }
  };

  return (
    <div className={`w-full ${isEmbedded ? '' : 'min-h-full bg-[#0A1931] text-slate-100 p-3 sm:p-4 pb-28'} select-none`}>
      <div className="w-full max-w-md mx-auto space-y-4">

        {/* Top Header */}
        {!isEmbedded && (
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2.5">
              {onGoBack && (
                <button
                  onClick={onGoBack}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 transition-colors cursor-pointer"
                  title="Go Back"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              <div className="p-2.5 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-400">
                <CheckCircle2 className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-[10px] font-mono-numeric font-black uppercase tracking-widest text-emerald-400">
                  Feature 15 · Zero Spend Tracker
                </span>
                <h1 className="text-xl font-black text-white tracking-tight">
                  No-Spend Days
                </h1>
              </div>
            </div>

            <button
              onClick={() => {
                const todayParts = todayStr.split('-');
                handleToggleDay(parseInt(todayParts[2], 10));
              }}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold font-mono-numeric shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Log Today</span>
            </button>
          </div>
        )}

        {/* Hero Card */}
        <div className="bg-gradient-to-br from-slate-900 via-[#0A1931] to-emerald-950 border border-emerald-500/30 rounded-3xl p-5 shadow-2xl space-y-3 font-mono-numeric">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300">
              {monthName} Discipline Log
            </span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-black">
              Table: No_Spend_Days
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-3xl font-black text-emerald-400">
                {thisMonthCount}
              </span>
              <span className="text-xs text-slate-400 ml-2">No-Spend Days</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block">Est. Saved</span>
              <span className="text-xl font-black text-white">
                ~${estimatedSaved}
              </span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-white/5 text-[11px] text-slate-300 flex items-start gap-2 leading-relaxed">
            <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              A <strong>No-Spend Day</strong> means zero discretionary purchases (takeout, shopping, coffee). Average consumers conserve <strong>~$35/day</strong> by eating at home and skipping impulse buys.
            </span>
          </div>
        </div>

        {/* Monthly Calendar Grid */}
        <div className="bg-white text-slate-900 rounded-3xl p-4.5 shadow-sm border border-slate-100 space-y-3 font-mono-numeric">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <button
              onClick={handlePrevMonth}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer text-xs font-bold"
            >
              ← Prev
            </button>
            <h3 className="font-black text-sm text-slate-900">{monthName}</h3>
            <button
              onClick={handleNextMonth}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer text-xs font-bold"
            >
              Next →
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1.5 text-center">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
              <span key={idx} className="text-[10px] font-bold text-slate-400 py-1">
                {day}
              </span>
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateStr = `${currentYear}-${String(currentMonthIndex + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const isChecked = noSpendSet.has(dateStr);
              const isToday = dateStr === todayStr;

              return (
                <button
                  key={dayNum}
                  onClick={() => handleToggleDay(dayNum)}
                  className={`aspect-square rounded-xl flex flex-col items-center justify-center text-xs font-bold transition-all cursor-pointer ${
                    isChecked
                      ? 'bg-emerald-500 text-white shadow-xs scale-102 font-black'
                      : isToday
                      ? 'border-2 border-emerald-500 text-slate-900 bg-emerald-50/50'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                  title={`${dateStr}: ${isChecked ? 'No-Spend Day (Click to toggle)' : 'Regular Spend (Click to mark)'}`}
                >
                  <span>{dayNum}</span>
                  {isChecked && <span className="text-[8px] leading-none">✓</span>}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-emerald-500 inline-block" />
              <span>= Zero Discretionary Spend</span>
            </span>
            <span className="text-slate-400">Tap day to toggle</span>
          </div>
        </div>

      </div>
    </div>
  );
};
