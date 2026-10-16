import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar,
  Plus,
  Trash2,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  X,
  ArrowLeft,
  Wallet
} from 'lucide-react';
import {
  CashFlowEventRecord,
  getCashFlowEvents,
  insertCashFlowEvent,
  deleteCashFlowEvent,
  getTodayDateString,
  getDateDaysFromNow
} from '../data/downbase';

interface CashFlowForecastTabProps {
  onNavigateTab?: (tabId: string) => void;
  onGoBack?: () => void;
  isEmbedded?: boolean;
}

export const CashFlowForecastTab: React.FC<CashFlowForecastTabProps> = ({
  onNavigateTab,
  onGoBack,
  isEmbedded = false
}) => {
  const [events, setEvents] = useState<CashFlowEventRecord[]>([]);
  const [startingBalance, setStartingBalance] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('chidoniq_cash_flow_starting_balance_v1');
      return saved ? Number(saved) || 0 : 0;
    } catch {
      return 0;
    }
  });
  const [isEditingBalance, setIsEditingBalance] = useState<boolean>(false);
  const [tempBalance, setTempBalance] = useState<string>(startingBalance.toString());

  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [eventDate, setEventDate] = useState<string>(getDateDaysFromNow(3));
  const [eventType, setEventType] = useState<'income' | 'bill' | 'transfer'>('bill');

  const refreshEvents = () => {
    setEvents(getCashFlowEvents());
  };

  useEffect(() => {
    refreshEvents();
  }, []);

  const handleSaveStartingBalance = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(tempBalance);
    const validVal = isNaN(val) ? 0 : val;
    setStartingBalance(validVal);
    try {
      localStorage.setItem('chidoniq_cash_flow_starting_balance_v1', validVal.toString());
    } catch {}
    setIsEditingBalance(false);
  };

  // Compute 30-day timeline with running balance
  const timeline = useMemo(() => {
    const sorted = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    let running = startingBalance;
    let minBalance = startingBalance;
    let minBalanceDate = 'Today';

    const list = sorted.map((evt) => {
      const delta = evt.type === 'income' ? Math.abs(evt.amount) : -Math.abs(evt.amount);
      running += delta;
      if (running < minBalance) {
        minBalance = running;
        minBalanceDate = evt.date;
      }
      return {
        ...evt,
        delta,
        runningBalanceAfter: running,
      };
    });

    return {
      runningEndingBalance: running,
      minBalance,
      minBalanceDate,
      items: list,
      isOverdraftRisk: minBalance < 0,
    };
  }, [events, startingBalance]);

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (!title.trim() || isNaN(amt) || amt <= 0) return;

    insertCashFlowEvent({
      title: title.trim(),
      amount: amt,
      date: eventDate,
      type: eventType,
    });

    setTitle('');
    setAmount('');
    setEventDate(getDateDaysFromNow(3));
    setShowAddModal(false);
    refreshEvents();
  };

  const handleDelete = (id: string) => {
    deleteCashFlowEvent(id);
    refreshEvents();
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
              <div className="p-2.5 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 text-cyan-400">
                <Calendar className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-[10px] font-mono-numeric font-black uppercase tracking-widest text-cyan-400">
                  Feature 13 · 30-Day Predictor
                </span>
                <h1 className="text-xl font-black text-white tracking-tight">
                  Cash Flow Forecast
                </h1>
              </div>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold font-mono-numeric shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Add Event</span>
            </button>
          </div>
        )}

        {/* Forecast Card */}
        <div className="bg-gradient-to-br from-slate-900 via-[#0A1931] to-cyan-950 border border-cyan-500/30 rounded-3xl p-5 shadow-2xl space-y-3 font-mono-numeric">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300 font-bold">Current Bank Balance</span>
              <button
                onClick={() => {
                  setTempBalance(startingBalance.toString());
                  setIsEditingBalance(true);
                }}
                className="text-[10px] text-cyan-400 hover:underline cursor-pointer"
              >
                (Edit)
              </button>
            </div>
            {timeline.isOverdraftRisk ? (
              <span className="px-2 py-0.5 rounded-md bg-rose-500/20 border border-rose-400/30 text-rose-300 text-[10px] font-black">
                ⚠️ Overdraft Risk Detected
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-[10px] font-black">
                ✓ Solvency Verified
              </span>
            )}
          </div>

          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-2xl font-black text-white">
                ${startingBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-xs text-slate-400 ml-2">starting cash</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block">Lowest Point</span>
              <span className={`text-base font-black ${timeline.minBalance < 0 ? 'text-[#FF4D4D]' : 'text-cyan-300'}`}>
                ${timeline.minBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {timeline.isOverdraftRisk && (
            <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>
                Your cash is projected to drop below $0 around <strong>{timeline.minBalanceDate}</strong>. Adjust scheduled bills to avoid bank penalty fees.
              </span>
            </div>
          )}
        </div>

        {/* Edit Starting Balance Modal */}
        {isEditingBalance && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-700 text-white rounded-3xl p-5 w-full max-w-sm shadow-2xl space-y-3 font-mono-numeric">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="font-bold text-sm">Update Current Cash Balance</h3>
                <button onClick={() => setIsEditingBalance(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveStartingBalance} className="space-y-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Checking/Cash Balance ($)</label>
                  <input
                    type="number"
                    step="any"
                    value={tempBalance}
                    onChange={(e) => setTempBalance(e.target.value)}
                    placeholder="e.g. 1500"
                    autoFocus
                    required
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-base focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsEditingBalance(false)}
                    className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl"
                  >
                    Save Cash Balance
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Timeline Events List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-mono-numeric font-bold uppercase text-slate-400">
              Scheduled Cash Inflows & Outflows ({events.length})
            </span>
            <span className="text-[11px] font-mono-numeric text-slate-500">
              Table: Cash_Flow
            </span>
          </div>

          {timeline.items.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center text-slate-400">
              <Wallet className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-white">No Future Cash Events</p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                Log scheduled paychecks, rent payments, and utility bills to see your 30-day cash curve and protect against overdrafts.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-0.5 font-mono-numeric">
              {timeline.items.map((evt) => (
                <div
                  key={evt.id}
                  className="bg-white text-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-slate-900">{evt.title}</h4>
                      <span className={`text-[9px] px-1.5 py-0.2 rounded-md font-bold uppercase ${
                        evt.type === 'income'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}>
                        {evt.type}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span>Date: {evt.date}</span>
                      <span>·</span>
                      <span className="text-slate-400">
                        Running: ${evt.runningBalanceAfter.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`text-base font-black ${
                      evt.type === 'income' ? 'text-emerald-600' : 'text-[#FF4D4D]'
                    }`}>
                      {evt.type === 'income' ? '+' : '-'}${evt.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>

                    <button
                      onClick={() => handleDelete(evt.id)}
                      className="p-1 text-slate-300 hover:text-rose-500 transition-colors cursor-pointer"
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
          <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-700 text-white rounded-3xl p-5 w-full max-w-sm shadow-2xl space-y-3 font-mono-numeric">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-cyan-400" />
                  <h3 className="font-black text-sm">Schedule Cash Event</h3>
                </div>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddEvent} className="space-y-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Event Description</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Paycheck Direct Deposit / Rent"
                    required
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Amount ($)</label>
                    <input
                      type="number"
                      step="any"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="e.g. 1200"
                      required
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Type</label>
                    <select
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400"
                    >
                      <option value="bill">Expense / Bill</option>
                      <option value="income">Income / Deposit</option>
                      <option value="transfer">Transfer</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Expected Date</label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl"
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
