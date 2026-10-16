import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Plus,
  Minus,
  CheckCircle2,
  Calendar,
  AlertCircle,
  TrendingUp,
  RotateCcw,
  Zap,
  ArrowLeft
} from 'lucide-react';
import {
  EmergencyFundRecord,
  getEmergencyVault,
  saveEmergencyVault,
  getTodayDateString
} from '../data/downbase';

interface EmergencyVaultTabProps {
  onNavigateTab?: (tabId: string) => void;
  onGoBack?: () => void;
}

export const EmergencyVaultTab: React.FC<EmergencyVaultTabProps> = ({
  onNavigateTab,
  onGoBack,
}) => {
  const [vault, setVault] = useState<EmergencyFundRecord>(() => getEmergencyVault());
  const [showAdjustModal, setShowAdjustModal] = useState<boolean>(false);
  const [adjustType, setAdjustType] = useState<'deposit' | 'withdraw'>('deposit');
  const [adjustAmount, setAdjustAmount] = useState<string>('');
  const [adjustNote, setAdjustNote] = useState<string>('');

  const [editExpensesModal, setEditExpensesModal] = useState<boolean>(false);
  const [expenseInput, setExpenseInput] = useState<string>(
    vault.monthly_essential_expenses ? vault.monthly_essential_expenses.toString() : ''
  );
  const [targetMonthsInput, setTargetMonthsInput] = useState<number>(vault.target_months || 6);

  useEffect(() => {
    saveEmergencyVault(vault);
  }, [vault]);

  const targetAmount = (vault.monthly_essential_expenses || 0) * (vault.target_months || 6);
  const progressPercent = targetAmount > 0 
    ? Math.min(100, Math.round((vault.current_saved / targetAmount) * 100))
    : 0;

  const monthsCovered = vault.monthly_essential_expenses > 0
    ? (vault.current_saved / vault.monthly_essential_expenses).toFixed(1)
    : '0.0';

  const handleAdjustBalance = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(adjustAmount);
    if (isNaN(val) || val <= 0) return;

    setVault((prev) => {
      const nextSaved = adjustType === 'deposit'
        ? prev.current_saved + val
        : Math.max(0, prev.current_saved - val);
      return {
        ...prev,
        current_saved: nextSaved,
        last_updated: getTodayDateString(),
        notes: adjustNote.trim() ? adjustNote.trim() : prev.notes,
      };
    });

    setAdjustAmount('');
    setAdjustNote('');
    setShowAdjustModal(false);
  };

  const handleSaveExpenseBaseline = (e: React.FormEvent) => {
    e.preventDefault();
    const expenses = parseFloat(expenseInput) || 0;
    setVault((prev) => ({
      ...prev,
      monthly_essential_expenses: expenses,
      target_months: targetMonthsInput,
      last_updated: getTodayDateString(),
    }));
    setEditExpensesModal(false);
  };

  const handleBack = () => {
    if (onGoBack) {
      onGoBack();
    } else if (onNavigateTab) {
      onNavigateTab('tracker');
    } else {
      window.dispatchEvent(new CustomEvent('credence-navigate-tab', { detail: 'tracker' }));
    }
  };

  return (
    <div className="min-h-full bg-[#0A1931] text-slate-100 p-3 sm:p-4 pb-28 select-none font-sans">
      <div className="w-full max-w-md mx-auto space-y-4">
        
        {/* Top Back Row */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={handleBack}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer py-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Tracker Hub</span>
          </button>
          <span className="text-[10px] font-mono-numeric font-bold text-emerald-400 uppercase tracking-widest">
            Vault Engine
          </span>
        </div>

        {/* Feature Hero Banner */}
        <div className="bg-gradient-to-br from-slate-900/90 via-[#0A1931] to-emerald-950/40 border border-emerald-400/20 rounded-3xl p-5 shadow-2xl space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-400/20 text-emerald-400">
              <ShieldAlert className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-[10px] font-mono-numeric font-extrabold uppercase tracking-widest text-emerald-400">
                Inbuilt Feature 7 · Downbase Table: Emergency_Vault
              </span>
              <h1 className="text-xl font-black text-white tracking-tight">
                Emergency Fund Vault
              </h1>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Your financial shock absorber against unexpected medical bills, car repairs, or income gaps. Eliminates the need to swipe high-APR credit cards during emergencies.
          </p>
        </div>

        {/* Primary Stash Metric Card */}
        <div className="bg-white text-slate-900 rounded-3xl p-5 shadow-2xl border border-slate-100 space-y-4 font-mono-numeric">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Current Liquid Stash
            </span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
              {monthsCovered} Months Covered
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <div className="text-3xl sm:text-4xl font-black text-slate-900">
              ${vault.current_saved.toLocaleString()}
            </div>
            <div className="text-right text-xs text-slate-500">
              Goal: <span className="font-black text-slate-900">${targetAmount.toLocaleString()}</span>
            </div>
          </div>

          {/* Visual Progress Bar */}
          <div className="space-y-1.5">
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold">
              <span>{progressPercent}% Funded</span>
              <span>
                {targetAmount > vault.current_saved 
                  ? `$${(targetAmount - vault.current_saved).toLocaleString()} remaining`
                  : 'Target Milestone Achieved! 🎉'}
              </span>
            </div>
          </div>

          {/* Quick Actions (Deposit / Withdraw) */}
          <div className="grid grid-cols-2 gap-2 pt-1 font-sans">
            <button
              onClick={() => {
                setAdjustType('deposit');
                setShowAdjustModal(true);
              }}
              className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-900/20 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>+ Add Savings</span>
            </button>
            <button
              onClick={() => {
                setAdjustType('withdraw');
                setShowAdjustModal(true);
              }}
              className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Log Withdrawal</span>
            </button>
          </div>
        </div>

        {/* Milestone Levels & Monthly Baseline Config */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Target Expense Baseline</h3>
              <p className="text-[11px] text-slate-400 font-sans">
                {vault.monthly_essential_expenses > 0
                  ? `$${vault.monthly_essential_expenses.toLocaleString()}/mo essential expenses · ${vault.target_months} mos target`
                  : 'Not configured yet. Set your monthly essential cost.'}
              </p>
            </div>
            <button
              onClick={() => setEditExpensesModal(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold cursor-pointer transition-colors"
            >
              Configure
            </button>
          </div>

          {/* 3 Milestone Gates */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono-numeric">
            <div className={`p-3 rounded-2xl border ${Number(monthsCovered) >= 1 ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' : 'bg-slate-800/40 border-slate-800 text-slate-500'}`}>
              <div className="text-[10px] uppercase font-bold">Gate 1</div>
              <div className="text-sm font-black mt-0.5">1 Month</div>
              <div className="text-[9px] mt-1 font-sans">{Number(monthsCovered) >= 1 ? '✓ Unlocked' : 'In Progress'}</div>
            </div>
            <div className={`p-3 rounded-2xl border ${Number(monthsCovered) >= 3 ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' : 'bg-slate-800/40 border-slate-800 text-slate-500'}`}>
              <div className="text-[10px] uppercase font-bold">Gate 2</div>
              <div className="text-sm font-black mt-0.5">3 Months</div>
              <div className="text-[9px] mt-1 font-sans">{Number(monthsCovered) >= 3 ? '✓ Solid Shield' : 'In Progress'}</div>
            </div>
            <div className={`p-3 rounded-2xl border ${Number(monthsCovered) >= 6 ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' : 'bg-slate-800/40 border-slate-800 text-slate-500'}`}>
              <div className="text-[10px] uppercase font-bold">Gate 3</div>
              <div className="text-sm font-black mt-0.5">6 Months</div>
              <div className="text-[9px] mt-1 font-sans">{Number(monthsCovered) >= 6 ? '✓ Iron Fortress' : 'In Progress'}</div>
            </div>
          </div>
        </div>

        {/* Smart Rule Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-slate-300 flex items-start gap-3">
          <Zap className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed font-sans">
            <strong className="text-white">Emergency Fund Rule:</strong> Store this cash in a high-yield savings account (HYSA) or money market yielding 4%–5% APY with instant liquidity. Never invest emergency reserves in volatile assets.
          </p>
        </div>

        {/* Modal: Adjust Balance */}
        {showAdjustModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3">
            <div className="w-full max-w-sm bg-white text-slate-900 rounded-3xl p-5 shadow-2xl border border-slate-100">
              <h3 className="text-base font-black mb-1">
                {adjustType === 'deposit' ? 'Add Deposit to Vault' : 'Log Vault Withdrawal'}
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                {adjustType === 'deposit'
                  ? 'Keep momentum going by recording extra saved cash.'
                  : 'Record funds taken out for a qualifying emergency.'}
              </p>

              <form onSubmit={handleAdjustBalance} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Amount ($)</label>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    required
                    placeholder="e.g. 150"
                    value={adjustAmount}
                    onChange={(e) => setAdjustAmount(e.target.value)}
                    className="w-full px-3 py-2 text-base font-bold font-mono-numeric rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Note (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Paycheck bonus or tire repair"
                    value={adjustNote}
                    onChange={(e) => setAdjustNote(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAdjustModal(false)}
                    className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer"
                  >
                    Confirm
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Configure Baseline Expenses */}
        {editExpensesModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3">
            <div className="w-full max-w-sm bg-white text-slate-900 rounded-3xl p-5 shadow-2xl border border-slate-100">
              <h3 className="text-base font-black mb-1">Configure Vault Target</h3>
              <p className="text-xs text-slate-500 mb-4">
                Calculates your target runway based on mandatory monthly essentials (rent, food, utilities, minimum debt).
              </p>

              <form onSubmit={handleSaveExpenseBaseline} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Monthly Essential Expenses ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    required
                    placeholder="e.g. 2400"
                    value={expenseInput}
                    onChange={(e) => setExpenseInput(e.target.value)}
                    className="w-full px-3 py-2 text-base font-bold font-mono-numeric rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Target Runway Duration
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[3, 6, 9].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setTargetMonthsInput(m)}
                        className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                          targetMonthsInput === m
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {m} Months
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditExpensesModal(false)}
                    className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer"
                  >
                    Save Target
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
