import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Calendar as CalendarIcon, 
  Flame, 
  ArrowLeft, 
  DollarSign, 
  Sparkles,
  Zap,
  Info
} from 'lucide-react';
import { getNoSpendDays, toggleNoSpendDay } from '../data/downbase';

interface NoSpendCalendarTabProps {
  onNavigateTab?: (tabId: string) => void;
  onGoBack?: () => void;
  isEmbedded?: boolean;
}

export const NoSpendCalendarTab: React.FC<NoSpendCalendarTabProps> = ({
  onNavigateTab: _onNavigateTab,
  onGoBack,
  isEmbedded = false
}) => {
  const [noSpendDays, setNoSpendDays] = useState<string[]>([]);
  const [currentDate, setCurrentDate] = useState(() => new Date());

  const refreshDays = () => {
    setNoSpendDays(getNoSpendDays().map((d) => d.date));
  };

  useEffect(() => {
    refreshDays();
  }, []);

  const currentYear = currentDate.getFullYear();
  const currentMonthIndex = currentDate.getMonth();

  const daysInMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonthIndex, 1).getDay();

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonthIndex - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonthIndex + 1, 1));
  };

  const handleToggleDay = (day: number) => {
    const formattedDate = `${currentYear}-${String(currentMonthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    toggleNoSpendDay(formattedDate);
    refreshDays();
  };

  const noSpendSet = new Set(noSpendDays);

  // Compute how many no-spend days in this displayed month
  const thisMonthPrefix = `${currentYear}-${String(currentMonthIndex + 1).padStart(2, '0')}`;
  const thisMonthCount = noSpendDays.filter((d) => d.startsWith(thisMonthPrefix)).length;

  // Estimated money conserved ($35 average discretionary spend per day saved)
  const estimatedSaved = thisMonthCount * 35;

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  return (
    <div className={`w-full ${isEmbedded ? '' : 'min-h-full bg-white text-black dark:bg-black dark:text-white p-3 sm:p-4 pb-28'} select-none font-sans transition-colors`}>
      <div className="w-full max-w-md mx-auto space-y-4">

        {/* Top Header */}
        {!isEmbedded && (
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2.5">
              {onGoBack && (
                <button
                  type="button"
                  onClick={onGoBack}
                  className="p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-200 transition-colors cursor-pointer"
                  title="Go Back"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-400/30 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-[10px] font-mono-numeric font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                  Feature 15 · Zero Spend Tracker
                </span>
                <h1 className="text-xl font-black text-black dark:text-white tracking-tight">
                  No-Spend Days
                </h1>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                const todayParts = todayStr.split('-');
                handleToggleDay(parseInt(todayParts[2], 10));
              }}
              className="px-3 py-1.5 rounded-xl bg-black text-white dark:bg-white dark:text-black text-xs font-bold font-mono-numeric shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Log Today</span>
            </button>
          </div>
        )}

        {/* Hero Card */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-5 shadow-sm space-y-3 font-mono-numeric text-black dark:text-white transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-600 dark:text-neutral-400">
              {monthName} Discipline Log
            </span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-[10px] font-black">
              Table: No_Spend_Days
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                {thisMonthCount}
              </span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400 ml-2">No-Spend Days</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400 block">Est. Saved</span>
              <span className="text-xl font-black text-black dark:text-white">
                ~${estimatedSaved}
              </span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/60 text-[11px] text-neutral-600 dark:text-neutral-300 flex items-start gap-2 leading-relaxed">
            <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <span>
              A <strong>No-Spend Day</strong> means zero discretionary purchases (takeout, shopping, coffee). Average consumers conserve <strong>~$35/day</strong> by eating at home and skipping impulse buys.
            </span>
          </div>
        </div>

        {/* Monthly Calendar Grid */}
        <div className="bg-white dark:bg-neutral-900 text-black dark:text-white rounded-3xl p-4.5 shadow-sm border border-neutral-200 dark:border-neutral-800 space-y-3 font-mono-numeric transition-colors">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1 rounded-lg text-neutral-500 hover:text-black dark:hover:text-white cursor-pointer text-xs font-bold"
            >
              ← Prev
            </button>
            <h3 className="font-black text-sm text-black dark:text-white">{monthName}</h3>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1 rounded-lg text-neutral-500 hover:text-black dark:hover:text-white cursor-pointer text-xs font-bold"
            >
              Next →
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1.5 text-center">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
              <span key={idx} className="text-[10px] font-bold text-neutral-400 py-1">
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
                  type="button"
                  onClick={() => handleToggleDay(dayNum)}
                  className={`aspect-square rounded-xl flex flex-col items-center justify-center text-xs font-bold transition-all cursor-pointer ${
                    isChecked
                      ? 'bg-emerald-500 text-white shadow-xs font-black'
                      : isToday
                      ? 'border-2 border-emerald-500 text-black dark:text-white bg-emerald-50/50 dark:bg-emerald-950/30'
                      : 'bg-neutral-50 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                  }`}
                  title={`${dateStr}: ${isChecked ? 'No-Spend Day (Click to toggle)' : 'Regular Spend (Click to mark)'}`}
                >
                  <span>{dayNum}</span>
                  {isChecked && <span className="text-[8px] leading-none">✓</span>}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400 pt-2 border-t border-neutral-100 dark:border-neutral-800">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-emerald-500 inline-block" />
              <span>= Zero Discretionary Spend</span>
            </span>
            <span className="text-neutral-400">Tap day to toggle</span>
          </div>
        </div>

      </div>
    </div>
  );
};
