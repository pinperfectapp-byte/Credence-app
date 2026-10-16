import React, { useState, useEffect, useMemo } from 'react';
import {
  Flame,
  CheckCircle2,
  Trophy,
  RotateCcw,
  Check,
  Calendar,
  Gift,
  ArrowLeft
} from 'lucide-react';
import {
  ChallengeRecord,
  getChallengesTable,
  toggleChallengeDone,
  resetChallengesTable,
  getStreakCount,
  getCompletedChallengesCount
} from '../data/downbase';

interface MoneyStreakTabProps {
  onNavigateTab?: (tabId: string) => void;
  onGoBack?: () => void;
  isEmbedded?: boolean;
}

export const MoneyStreakTab: React.FC<MoneyStreakTabProps> = ({
  onNavigateTab,
  onGoBack,
  isEmbedded = false
}) => {
  const [challenges, setChallenges] = useState<ChallengeRecord[]>([]);
  const [celebrationDay, setCelebrationDay] = useState<number | null>(null);

  const refreshChallenges = () => {
    setChallenges(getChallengesTable());
  };

  useEffect(() => {
    refreshChallenges();
  }, []);

  const streak = useMemo(() => {
    return getStreakCount(challenges);
  }, [challenges]);

  const completedCount = useMemo(() => {
    return getCompletedChallengesCount(challenges);
  }, [challenges]);

  const allCompleted = completedCount === 30;

  const handleToggle = (dayNumber: number) => {
    const { isDoneNow } = toggleChallengeDone(dayNumber);
    refreshChallenges();

    if (isDoneNow) {
      setCelebrationDay(dayNumber);
      setTimeout(() => {
        setCelebrationDay(null);
      }, 3000);
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset all 30 days of the challenge to try again?')) {
      resetChallengesTable();
      refreshChallenges();
    }
  };

  return (
    <div className={`w-full ${isEmbedded ? '' : 'min-h-full bg-[#0A1931] text-slate-100 p-3 sm:p-4 pb-24'} select-none relative overflow-hidden`}>
      
      {/* Simple Confetti Animation Overlay when checked */}
      {celebrationDay && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-emerald-500/10 backdrop-blur-xs transition-opacity duration-500" />
          <div className="bg-white text-slate-900 rounded-3xl p-6 shadow-2xl border-2 border-emerald-400 flex flex-col items-center animate-bounce duration-300">
            <span className="text-4xl mb-1">🎉</span>
            <div className="flex items-center gap-1.5 text-emerald-600 font-black text-sm uppercase tracking-wider">
              <Trophy className="w-4 h-4 text-emerald-500" />
              <span>Day {celebrationDay} Completed!</span>
            </div>
            <p className="text-xs text-slate-600 font-bold mt-1">Keep the financial streak alive!</p>
          </div>
        </div>
      )}

      <div className="w-full max-w-md mx-auto space-y-4">

        {/* Header Bar */}
        {!isEmbedded && (
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2.5">
              {onGoBack && (
                <button
                  type="button"
                  onClick={onGoBack}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 transition-colors cursor-pointer"
                  title="Go Back"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              <div className="p-2.5 rounded-2xl bg-orange-500/10 border border-orange-400/20 text-orange-400">
                <Flame className="w-6 h-6 stroke-[2.2] fill-orange-500" />
              </div>
              <div>
                <span className="text-[10px] font-mono-numeric font-extrabold uppercase tracking-widest text-orange-400">
                  Feature 5 · Downbase Table: Challenges
                </span>
                <h1 className="text-xl font-black text-white tracking-tight">
                  MoneyStreak
                </h1>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
              title="Reset 30-Day Challenge"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        )}

        {isEmbedded && (
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-orange-500/20 text-orange-400">
                <Flame className="w-4 h-4 fill-orange-500" />
              </span>
              <h3 className="text-base font-black text-white">MoneyStreak - 30 Day Challenge</h3>
            </div>
            <button
              onClick={handleReset}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        )}

        {/* TOP STATUS CARD: Streak + Progress */}
        <div className="bg-white text-slate-900 rounded-3xl p-5 shadow-2xl border border-slate-100">
          <div className="flex items-center justify-between mb-3">
            {/* Show streak: Fire icon 7 Day Streak = count consecutive is_done=true */}
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-2xl bg-orange-100 text-orange-600">
                <Flame className="w-5 h-5 fill-orange-500" />
              </div>
              <div>
                <span className="text-[10px] font-mono-numeric font-black uppercase tracking-wider text-slate-400 block">
                  Active Streak
                </span>
                <h3 className="text-lg font-black text-slate-900 leading-tight">
                  {streak} Day Streak
                </h3>
              </div>
            </div>

            {/* Show progress: "12/30 Completed" */}
            <div className="text-right">
              <span className="text-[10px] font-mono-numeric font-black uppercase tracking-wider text-slate-400 block">
                Challenge Goal
              </span>
              <span className="text-lg font-black font-mono-numeric text-[#1E90FF]">
                {completedCount}/30 Completed
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1 pt-1">
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-500 transition-all duration-500"
                style={{ width: `${Math.min(100, (completedCount / 30) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-mono-numeric">
              <span>Day 1 Start</span>
              <span className="font-bold text-slate-600">{Math.round((completedCount / 30) * 100)}% Complete</span>
              <span>Day 30 Finish</span>
            </div>
          </div>

          {/* Reward text: If day_number=30 and all done: "You saved ~$300 this month!" */}
          {allCompleted && (
            <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg border border-emerald-400 flex items-center justify-between animate-pulse">
              <div className="flex items-center gap-3">
                <Trophy className="w-7 h-7 text-amber-200 shrink-0" />
                <div>
                  <span className="text-[10px] uppercase font-mono font-black tracking-widest text-emerald-100">
                    Challenge Conquered!
                  </span>
                  <h4 className="text-base font-black">
                    You saved ~$300 this month!
                  </h4>
                </div>
              </div>
              <span className="text-2xl">🏆</span>
            </div>
          )}
        </div>

        {/* 30-Day Tasks List with Checkbox */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-mono-numeric font-bold uppercase text-slate-400">
              Daily Challenge Habits (30 Days)
            </span>
            <span className="text-[11px] font-mono-numeric text-slate-500">
              Check off daily
            </span>
          </div>

          <div className="space-y-2 max-h-[390px] overflow-y-auto pr-0.5">
            {challenges.map((c) => {
              return (
                <div
                  key={c.id}
                  onClick={() => handleToggle(c.day_number)}
                  className={`rounded-2xl p-3 sm:p-3.5 shadow-sm border transition-all flex items-center justify-between cursor-pointer ${
                    c.is_done
                      ? 'bg-white/95 border-emerald-300 text-slate-900'
                      : 'bg-white hover:bg-slate-50 border-slate-100 text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggle(c.day_number);
                      }}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors cursor-pointer border ${
                        c.is_done
                          ? 'bg-emerald-500 border-emerald-600 text-white'
                          : 'bg-slate-50 border-slate-300 hover:border-slate-400 text-transparent'
                      }`}
                      title={c.is_done ? 'Mark as incomplete' : 'Mark completed'}
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black font-mono-numeric px-1.5 py-0.2 rounded-md bg-slate-100 text-slate-600">
                          Day {c.day_number}
                        </span>
                        <h4 className={`text-xs sm:text-sm font-bold ${c.is_done ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                          {c.task}
                        </h4>
                      </div>
                    </div>
                  </div>

                  {c.is_done && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black font-mono shrink-0">
                      DONE
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Milestone Tracker Pill */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center text-xs text-slate-300 font-medium">
          <span>Complete all 30 days to claim the ~$300 monthly savings milestone reward!</span>
        </div>

      </div>
    </div>
  );
};
