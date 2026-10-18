import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Plus, 
  Trash2, 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  X,
  Edit2
} from 'lucide-react';
import { 
  getCashFlowEvents, 
  saveCashFlowEvent, 
  deleteCashFlowEvent, 
  CashFlowEventRow, 
  getStartingBalance, 
  saveStartingBalance,
  calculate30DayCashFlow 
} from '../data/downbase';

interface CashFlowForecastTabProps {
  onNavigateTab?: (tabId: string) => void;
  onGoBack?: () => void;
  isEmbedded?: boolean;
}

export const CashFlowForecastTab: React.FC<CashFlowForecastTabProps> = ({
  onNavigateTab: _onNavigateTab,
  onGoBack,
  isEmbedded = false
}) => {
  const [events, setEvents] = useState<CashFlowEventRow[]>([]);
  const [startingBalance, setStartingBalanceState] = useState<number>(() => getStartingBalance());
  const [isEditingBalance, setIsEditingBalance] = useState(false);
  const [tempBalance, setTempBalance] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [eventType, setEventType] = useState<'income' | 'bill' | 'transfer'>('bill');
  const [eventDate, setEventDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });

  const refreshEvents = () => {
    setEvents(getCashFlowEvents());
  };

  useEffect(() => {
    refreshEvents();
  }, []);

  const timeline = calculate30DayCashFlow();

  const handleSaveBalance = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(tempBalance);
    if (!isNaN(parsed)) {
      saveStartingBalance(parsed);
      setStartingBalanceState(parsed);
      setIsEditingBalance(false);
      refreshEvents();
    }
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!title.trim() || isNaN(parsedAmount) || parsedAmount <= 0) return;

    saveCashFlowEvent({
      title: title.trim(),
      amount: parsedAmount,
      date: eventDate,
      type: eventType,
      is_recurring: false
    });

    setTitle('');
    setAmount('');
    setShowAddModal(false);
    refreshEvents();
  };

  const handleDelete = (id: string) => {
    deleteCashFlowEvent(id);
    refreshEvents();
  };

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
              <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 text-cyan-600 dark:text-cyan-400">
                <Calendar className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-[10px] font-mono-numeric font-black uppercase tracking-widest text-cyan-600 dark:text-cyan-400">
                  Feature 13 · 30-Day Predictor
                </span>
                <h1 className="text-xl font-black text-black dark:text-white tracking-tight">
                  Cash Flow Forecast
                </h1>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="px-3 py-1.5 rounded-xl bg-black text-white dark:bg-white dark:text-black text-xs font-bold font-mono-numeric shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Add Event</span>
            </button>
          </div>
        )}

        {/* Forecast Card */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-5 shadow-sm space-y-3 font-mono-numeric text-black dark:text-white transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-600 dark:text-neutral-400 font-bold">Current Bank Balance</span>
              <button
                type="button"
                onClick={() => {
                  setTempBalance(startingBalance.toString());
                  setIsEditingBalance(true);
                }}
                className="text-[10px] text-blue-600 dark:text-sky-400 hover:underline cursor-pointer"
              >
                (Edit)
              </button>
            </div>
            {timeline.isOverdraftRisk ? (
              <span className="px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-[10px] font-black">
                ⚠️ Overdraft Risk Detected
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-md bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800 text-cyan-700 dark:text-cyan-300 text-[10px] font-black">
                ✓ Solvency Verified
              </span>
            )}
          </div>

          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-2xl font-black text-black dark:text-white">
                ${startingBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400 ml-2">starting cash</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400 block">Lowest 30-Day Point</span>
              <span className={`text-xl font-black ${
                timeline.lowestBalance < 0 ? 'text-[#FF4D4D]' : 'text-emerald-600 dark:text-emerald-400'
              }`}>
                ${timeline.lowestBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Edit starting balance inline form */}
          {isEditingBalance && (
            <form onSubmit={handleSaveBalance} className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center gap-2">
              <input
                type="number"
                step="any"
                value={tempBalance}
                onChange={(e) => setTempBalance(e.target.value)}
                placeholder="Enter checking balance"
                className="flex-1 px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-xs text-black dark:text-white focus:outline-none"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-black text-white dark:bg-white dark:text-black rounded-xl text-xs font-bold cursor-pointer"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsEditingBalance(false)}
                className="px-2 py-1.5 text-xs text-neutral-500 cursor-pointer"
              >
                Cancel
              </button>
            </form>
          )}

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800 text-[11px]">
            <div className="p-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
              <span className="text-neutral-500 dark:text-neutral-400 block">Projected Inflow</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">+${timeline.totalInflow.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="p-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
              <span className="text-neutral-500 dark:text-neutral-400 block">Projected Outflow</span>
              <span className="font-bold text-rose-600 dark:text-rose-400">-${timeline.totalOutflow.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>

        {/* 30-Day Event Schedule */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-mono-numeric font-bold uppercase text-neutral-500 dark:text-neutral-400">
              Scheduled Cash Events ({events.length})
            </span>
            <span className="text-[11px] font-mono-numeric text-neutral-400">
              Table: Cash_Flow
            </span>
          </div>

          {events.length === 0 ? (
            <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 text-center text-neutral-500 dark:text-neutral-400">
              <Calendar className="w-8 h-8 text-cyan-600 dark:text-cyan-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-black dark:text-white">No Future Cash Events Logged</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-xs mx-auto">
                Schedule your next paycheck, rent, and card payments to predict liquid checking balance day-by-day.
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-0.5 font-mono-numeric">
              {timeline.timelineEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="bg-white dark:bg-neutral-900 text-black dark:text-white rounded-2xl p-3.5 sm:p-4 shadow-xs border border-neutral-200 dark:border-neutral-800 flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className={`p-1 rounded-md text-[10px] font-bold uppercase ${
                        evt.type === 'income' ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300' : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                      }`}>
                        {evt.type}
                      </span>
                      <h4 className="text-sm font-black text-black dark:text-white">{evt.title}</h4>
                      <span className="text-[10px] text-neutral-400">
                        ({evt.daysAway === 0 ? 'Today' : `in ${evt.daysAway}d`})
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-neutral-500 dark:text-neutral-400">
                      <span>Date: {evt.date}</span>
                      <span>·</span>
                      <span className="text-neutral-400">
                        Running: ${evt.runningBalanceAfter.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`text-base font-black ${
                      evt.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                    }`}>
                      {evt.type === 'income' ? '+' : '-'}${evt.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleDelete(evt.id)}
                      className="p-1 text-neutral-400 hover:text-rose-500 transition-colors cursor-pointer"
                      title="Delete Event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-pop-in">
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-black dark:text-white rounded-3xl p-5 w-full max-w-sm shadow-2xl space-y-3 font-mono-numeric">
              <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                  <h3 className="font-black text-sm text-black dark:text-white">Schedule Cash Event</h3>
                </div>
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)} 
                  className="text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddEvent} className="space-y-3">
                <div>
                  <label className="text-xs text-neutral-700 dark:text-neutral-300 block mb-1">Event Description</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Paycheck Direct Deposit / Rent"
                    required
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-black dark:text-white text-sm focus:outline-none focus:border-black dark:focus:border-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-neutral-700 dark:text-neutral-300 block mb-1">Amount ($)</label>
                    <input
                      type="number"
                      step="any"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="e.g. 1200"
                      required
                      className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-black dark:text-white text-sm focus:outline-none focus:border-black dark:focus:border-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-neutral-700 dark:text-neutral-300 block mb-1">Type</label>
                    <select
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value as any)}
                      className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-black dark:text-white text-xs focus:outline-none focus:border-black dark:focus:border-white"
                    >
                      <option value="bill">Expense / Bill</option>
                      <option value="income">Income / Deposit</option>
                      <option value="transfer">Transfer</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-neutral-700 dark:text-neutral-300 block mb-1">Expected Date</label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-black dark:text-white text-xs focus:outline-none focus:border-black dark:focus:border-white"
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-200 text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-black hover:opacity-90 text-white dark:bg-white dark:text-black text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Save Cash Event
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
