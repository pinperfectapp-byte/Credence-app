import React, { useState, useMemo } from 'react';
import { CreditCardAccount } from '../types/credit';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  Flame, 
  Info, 
  Zap, 
  ShieldCheck, 
  DollarSign,
  ArrowRight,
  Filter
} from 'lucide-react';

interface PaymentDateCalendarProps {
  cards: CreditCardAccount[];
  onToggleCardPaid?: (cardId: string) => void;
  onOpenProfileModal?: () => void;
}

export const PaymentDateCalendar: React.FC<PaymentDateCalendarProps> = ({
  cards,
  onToggleCardPaid,
  onOpenProfileModal,
}) => {
  // Calendar month state
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(() => new Date().getDate());
  const [viewMode, setViewMode] = useState<'calendar' | 'schedule'>('calendar');

  const today = new Date();
  const isCurrentMonth = 
    currentDate.getMonth() === today.getMonth() && 
    currentDate.getFullYear() === today.getFullYear();
  const currentDayOfMonth = isCurrentMonth ? today.getDate() : -1;

  // Navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  const handleToday = () => {
    setCurrentDate(new Date());
    setSelectedDay(new Date().getDate());
  };

  // Month metadata
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 = Sun

  // Pre-calculate upcoming due dates within next 10 days to PREVENT LATE PAYMENTS
  const urgentDueDates = useMemo(() => {
    const todayDay = today.getDate();
    return cards.map((c) => {
      let daysUntilDue = c.paymentDueDay - todayDay;
      if (daysUntilDue < 0) daysUntilDue += 30; // wrapped to next cycle
      const minPayment = Math.max(25, Math.round(c.balance * 0.025));
      return {
        card: c,
        daysUntilDue,
        minPayment,
        isUrgent: daysUntilDue <= 7 && !c.isPaidForStatement,
      };
    }).sort((a, b) => a.daysUntilDue - b.daysUntilDue);
  }, [cards, today]);

  // Day metadata lookup
  const dayEvents = useMemo(() => {
    const map: Record<number, {
      closingCards: CreditCardAccount[];
      dueCards: CreditCardAccount[];
      azeoPrePayCards: CreditCardAccount[];
    }> = {};

    for (let day = 1; day <= daysInMonth; day++) {
      const closing = cards.filter((c) => c.statementClosingDay === day);
      const due = cards.filter((c) => c.paymentDueDay === day);
      const azeo = cards.filter((c) => {
        const prepayDay = Math.max(1, c.statementClosingDay - 2);
        return prepayDay === day;
      });

      if (closing.length > 0 || due.length > 0 || azeo.length > 0) {
        map[day] = {
          closingCards: closing,
          dueCards: due,
          azeoPrePayCards: azeo,
        };
      }
    }
    return map;
  }, [cards, daysInMonth]);

  // Selected day items
  const selectedDayData = selectedDay ? dayEvents[selectedDay] : null;

  return (
    <div className="bg-white dark:bg-[#0C182F] border border-slate-100 dark:border-[rgba(56,120,210,0.22)] rounded-[20px] p-5 sm:p-6 shadow-md space-y-6">
      {/* 1. Header with View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-[rgba(56,120,210,0.18)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-[#2563EB] text-white">
              <CalendarIcon className="w-4 h-4 stroke-[2.5]" />
            </span>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#2563EB] dark:text-[#38BDF8] font-mono-numeric">
              Smart Bill Protection
            </span>
          </div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
            Credit Card Payment &amp; Statement Calendar
          </h3>
          <p className="text-xs text-slate-500 dark:text-[#8FA0C0] font-semibold">
            Track statement closing dates &amp; payment due dates in real time to avoid late fees and protect your score.
          </p>
        </div>

        {/* View Switcher & Today button */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center p-1 bg-slate-100 dark:bg-[#102244] rounded-xl border border-transparent dark:border-[rgba(56,120,210,0.2)]">
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                viewMode === 'calendar'
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'text-slate-600 dark:text-[#8FA0C0] hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Calendar Grid
            </button>
            <button
              onClick={() => setViewMode('schedule')}
              className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                viewMode === 'schedule'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Schedule List
            </button>
          </div>

          <button
            onClick={handleToday}
            className="px-2.5 py-1 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all cursor-pointer"
          >
            Today
          </button>
        </div>
      </div>

      {/* 2. LATE PAYMENT PREVENTION WARNING BANNER */}
      {urgentDueDates.some((u) => u.isUrgent) && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-500/40 text-amber-950 dark:text-amber-200 space-y-2">
          <div className="flex items-center gap-2 font-black text-xs font-mono-numeric uppercase tracking-wider text-amber-800 dark:text-amber-300">
            <AlertTriangle className="w-4 h-4 text-amber-600 stroke-[2.5]" />
            <span>Late Payment Prevention Alert: Action Required</span>
          </div>

          <div className="space-y-1.5 text-xs">
            {urgentDueDates
              .filter((u) => u.isUrgent)
              .map((u) => (
                <div 
                  key={u.card.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-2 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-amber-300 dark:border-amber-800 font-mono-numeric gap-1"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-900 dark:text-white">{u.card.name}</span>
                    <span className="text-[11px] text-amber-700 dark:text-amber-400 font-bold">
                      due in {u.daysUntilDue} days (Day {u.card.paymentDueDay})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-600 dark:text-slate-300 text-[11px]">
                      Minimum Required: <strong className="text-slate-900 dark:text-white">${u.minPayment.toLocaleString()}</strong>
                    </span>
                    {onToggleCardPaid && (
                      <button
                        onClick={() => onToggleCardPaid(u.card.id)}
                        className="px-2 py-0.5 rounded-lg bg-emerald-600 text-white text-[10px] font-black hover:bg-emerald-500 transition-colors cursor-pointer"
                      >
                        {u.card.isPaidForStatement ? 'Paid' : 'Mark Paid'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>

          <p className="text-[11px] text-amber-800 dark:text-amber-300 font-medium">
            <strong>Credit Scoring Fact:</strong> A single 30-day late payment can decrease a prime score by <strong>60 to 110 points</strong> and remains visible to lenders for 7 years under FCRA rules. Pay at least the minimum on time!
          </p>
        </div>
      )}

      {/* 3. CALENDAR MONTH NAVIGATION HEADER */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevMonth}
            className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-slate-700 dark:text-slate-300"
            title="Previous month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-black text-base sm:text-lg text-slate-900 dark:text-white font-mono-numeric">
            {monthName}
          </span>
          <button
            onClick={handleNextMonth}
            className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-slate-700 dark:text-slate-300"
            title="Next month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Legend */}
        <div className="hidden sm:flex items-center gap-3 text-[10px] font-mono-numeric font-bold">
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" />
            <span>Statement Closes</span>
          </span>
          <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400">
            <span className="w-2.5 h-2.5 rounded-sm bg-rose-500 inline-block" />
            <span>Payment Due</span>
          </span>
          <span className="flex items-center gap-1 text-sky-600 dark:text-sky-400">
            <span className="w-2.5 h-2.5 rounded-sm bg-sky-500 inline-block" />
            <span>AZEO Pre-Pay</span>
          </span>
        </div>
      </div>

      {/* 4. CALENDAR GRID VIEW */}
      {viewMode === 'calendar' ? (
        <div className="space-y-4">
          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xs">
            {/* Days of week */}
            <div className="grid grid-cols-7 bg-slate-50 dark:bg-slate-800/80 text-center text-[11px] font-black uppercase text-slate-500 dark:text-slate-400 py-2 border-b border-slate-200 dark:border-slate-800 font-mono-numeric">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            {/* Calendar Days Matrix */}
            <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
              {/* Empty offset days for start of month */}
              {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
                <div key={`empty-${idx}`} className="min-h-[70px] sm:min-h-[85px] bg-slate-50/40 dark:bg-slate-950/40 p-1" />
              ))}

              {/* Month days 1 to daysInMonth */}
              {Array.from({ length: daysInMonth }).map((_, idx) => {
                const dayNum = idx + 1;
                const events = dayEvents[dayNum];
                const isToday = isCurrentMonth && dayNum === currentDayOfMonth;
                const isSelected = selectedDay === dayNum;

                const hasClosing = events && events.closingCards.length > 0;
                const hasDue = events && events.dueCards.length > 0;
                const hasAzeo = events && events.azeoPrePayCards.length > 0;

                return (
                  <div
                    key={`day-${dayNum}`}
                    onClick={() => setSelectedDay(dayNum)}
                    className={`min-h-[70px] sm:min-h-[85px] p-1.5 transition-all cursor-pointer relative flex flex-col justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                      isToday ? 'bg-emerald-50/40 dark:bg-emerald-950/20' : ''
                    } ${isSelected ? 'ring-2 ring-emerald-500 ring-inset bg-emerald-50/20' : ''}`}
                  >
                    {/* Day number & indicators */}
                    <div className="flex items-center justify-between font-mono-numeric text-xs">
                      <span className={`font-bold rounded-full w-5 h-5 flex items-center justify-center text-[11px] ${
                        isToday 
                          ? 'bg-emerald-600 text-white font-black' 
                          : 'text-slate-800 dark:text-slate-200'
                      }`}>
                        {dayNum}
                      </span>

                      {/* Status dots on mobile */}
                      <div className="flex gap-0.5 sm:hidden">
                        {hasClosing && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                        {hasDue && <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />}
                      </div>
                    </div>

                    {/* Event badges on desktop/tablet */}
                    <div className="space-y-1 mt-1">
                      {hasDue && events.dueCards.map((c) => (
                        <div
                          key={`due-${c.id}`}
                          className="px-1 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-900 text-rose-800 dark:text-rose-300 text-[9px] font-black truncate font-mono-numeric"
                          title={`${c.name} Payment Due`}
                        >
                          Due: {c.name.split(' ')[0]}
                        </div>
                      ))}

                      {hasClosing && events.closingCards.map((c) => (
                        <div
                          key={`close-${c.id}`}
                          className="px-1 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-[9px] font-black truncate font-mono-numeric"
                          title={`${c.name} Statement Closes`}
                        >
                          Stmt: {c.name.split(' ')[0]}
                        </div>
                      ))}

                      {hasAzeo && !hasDue && events.azeoPrePayCards.map((c) => (
                        <div
                          key={`azeo-${c.id}`}
                          className="px-1 py-0.5 rounded-md bg-sky-100 dark:bg-sky-950/80 border border-sky-300 dark:border-sky-800 text-sky-800 dark:text-sky-300 text-[9px] font-black truncate font-mono-numeric hidden sm:block"
                          title={`AZEO Pre-Pay deadline for ${c.name}`}
                        >
                          Pay: {c.name.split(' ')[0]}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 5. SELECTED DAY INSPECTOR DRAWER */}
          {selectedDay && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3 font-mono-numeric">
              <div className="flex items-center justify-between">
                <span className="font-black text-sm text-slate-900 dark:text-white">
                  Schedule for Day {selectedDay} ({monthName.split(' ')[0]} {selectedDay})
                </span>
                {isCurrentMonth && selectedDay === currentDayOfMonth && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-[10px] font-black">
                    Today
                  </span>
                )}
              </div>

              {selectedDayData ? (
                <div className="space-y-2">
                  {/* Due cards */}
                  {selectedDayData.dueCards.map((c) => (
                    <div 
                      key={c.id}
                      className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-rose-600 text-white text-[10px] font-black">
                            PAYMENT DUE
                          </span>
                          <span className="font-black text-slate-900 dark:text-white text-xs">{c.name}</span>
                          <span className="text-[10px] text-slate-500">({c.bank})</span>
                        </div>
                        <span className="text-[11px] text-slate-600 dark:text-slate-400 block">
                          Current Balance: ${c.balance.toLocaleString()} · Minimum Due: <strong>${Math.max(25, Math.round(c.balance * 0.025)).toLocaleString()}</strong>
                        </span>
                      </div>

                      {onToggleCardPaid && (
                        <button
                          onClick={() => onToggleCardPaid(c.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                            c.isPaidForStatement
                              ? 'bg-emerald-600 text-white'
                              : 'bg-rose-600 hover:bg-rose-500 text-white shadow-xs'
                          }`}
                        >
                          {c.isPaidForStatement ? 'Marked as Paid' : 'Confirm Paid'}
                        </button>
                      )}
                    </div>
                  ))}

                  {/* Statement closing cards */}
                  {selectedDayData.closingCards.map((c) => (
                    <div 
                      key={c.id}
                      className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-black">
                            STATEMENT CLOSES
                          </span>
                          <span className="font-black text-slate-900 dark:text-white text-xs">{c.name}</span>
                          <span className="text-[10px] text-slate-500">({c.bank})</span>
                        </div>
                        <span className="text-[11px] text-slate-600 dark:text-slate-400 block">
                          Bank captures balance snapshot today for Experian, Equifax &amp; TransUnion bureaus!
                        </span>
                      </div>

                      <div className="text-right text-xs">
                        <span className="text-[10px] text-slate-500 uppercase block">Reported Balance</span>
                        <span className="font-black text-slate-900 dark:text-white">${c.balance.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}

                  {/* AZEO pre-pay reminder */}
                  {selectedDayData.azeoPrePayCards.map((c) => (
                    <div 
                      key={c.id}
                      className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-300 dark:border-sky-800 text-[11px] text-sky-900 dark:text-sky-300 flex items-center justify-between"
                    >
                      <span>
                        AZEO Window: Pay down <strong>{c.name}</strong> 2 days before statement closing on Day {c.statementClosingDay} to force &lt; 3% reporting!
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-slate-500 dark:text-slate-400 py-1">
                  No statement closures or payment deadlines scheduled on Day {selectedDay}.
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* SCHEDULE LIST VIEW */
        <div className="space-y-2 font-mono-numeric">
          <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
            {cards.map((card) => {
              const minPayment = Math.max(25, Math.round(card.balance * 0.025));
              return (
                <div key={card.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-slate-900 dark:text-white">{card.name}</span>
                      <span className="text-xs text-slate-500">({card.bank})</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
                      <span>Statement Date: <strong className="text-emerald-600 dark:text-emerald-400">Day {card.statementClosingDay}</strong></span>
                      <span>·</span>
                      <span>Payment Due Date: <strong className="text-rose-600 dark:text-rose-400">Day {card.paymentDueDay}</strong></span>
                      <span>·</span>
                      <span>Min Due: <strong>${minPayment.toLocaleString()}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    {onToggleCardPaid && (
                      <button
                        onClick={() => onToggleCardPaid(card.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                          card.isPaidForStatement
                            ? 'bg-emerald-600 text-white'
                            : 'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {card.isPaidForStatement ? 'Paid' : 'Mark as Paid'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
