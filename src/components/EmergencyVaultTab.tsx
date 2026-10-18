import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  ArrowLeft, 
  Plus, 
  Minus, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle,
  Lock,
  Calendar,
  Sparkles,
  Zap,
  Target,
  Edit2
} from 'lucide-react';
import { 
  getEmergencyVault, 
  adjustVaultBalance, 
  saveVaultTarget, 
  EmergencyVaultRow 
} from '../data/downbase';

interface EmergencyVaultTabProps {
  onNavigateTab?: (tabId: string) => void;
  onGoBack?: () => void;
}

export const EmergencyVaultTab: React.FC<EmergencyVaultTabProps> = ({ onNavigateTab: _onNavigateTab, onGoBack }) => {
  const [vault, setVault] = useState<EmergencyVaultRow>(() => getEmergencyVault());
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [adjustType, setAdjustType] = useState<'deposit' | 'withdrawal'>('deposit');
  const [adjustAmount, setAdjustAmount] = useState('');
  const [adjustNote, setAdjustNote] = useState('');

  // Target config modal state
  const [editExpensesModal, setEditExpensesModal] = useState(false);
  const [expenseInput, setExpenseInput] = useState(vault.monthly_essential_expenses.toString());
  const [targetMonthsInput, setTargetMonthsInput] = useState(vault.target_months);

  const refreshVault = () => {
    setVault(getEmergencyVault());
  };

  useEffect(() => {
    refreshVault();
  }, []);

  const targetAmount = vault.monthly_essential_expenses * vault.target_months;
  const progressPct = targetAmount > 0 
    ? Math.min(100, Math.round((vault.current_balance / targetAmount) * 100))
    : 0;

  const monthsCovered = vault.monthly_essential_expenses > 0
    ? (vault.current_balance / vault.monthly_essential_expenses).toFixed(1)
    : '0.0';

  const handleAdjustBalance = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(adjustAmount);
    if (isNaN(val) || val <= 0) return;

    adjustVaultBalance(adjustType, val, adjustNote.trim() || undefined);
    setAdjustAmount('');
    setAdjustNote('');
    setShowAdjustModal(false);
    refreshVault();
  };

  const handleSaveExpenseBaseline = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(expenseInput);
    if (isNaN(val) || val < 0) return;

    saveVaultTarget(val, targetMonthsInput);
    setEditExpensesModal(false);
    refreshVault();
  };

  const handleBack = () => {
    if (onGoBack) {
      onGoBack();
    } else {
      window.dispatchEvent(new CustomEvent('chidoniq-navigate-tab', { detail: 'tracker' }));
      window.dispatchEvent(new CustomEvent('credence-navigate-tab', { detail: 'tracker' }));
    }
  };

  return (
    <div className="min-h-full bg-white text-black dark:bg-black dark:text-white p-3 sm:p-4 pb-28 select-none font-sans transition-colors">
      <div className="w-full max-w-md mx-auto space-y-4">
        
        {/* Top Back Row */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={handleBack}
            className="flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white transition-colors cursor-pointer py-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Tracker Hub</span>
          </button>
          <span className="text-[10px] font-mono-numeric font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
            Vault Engine
          </span>
        </div>

        {/* Feature Hero Banner */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-5 shadow-sm space-y-3 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400">
              <ShieldAlert className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-[10px] font-mono-numeric font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                Inbuilt Feature 7 · Downbase Table: Emergency_Vault
              </span>
              <h1 className="text-xl font-black text-black dark:text-white tracking-tight">
                Emergency Fund Vault
              </h1>
            </div>
          </div>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Your financial shock absorber against unexpected medical bills, car repairs, or income gaps. Eliminates the need to swipe high-APR credit cards during emergencies.
          </p>
        </div>

        {/* Primary Stash Metric Card */}
        <div className="bg-white dark:bg-neutral-900 text-black dark:text-white rounded-3xl p-5 shadow-sm border border-neutral-200 dark:border-neutral-800 space-y-4 font-mono-numeric transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Current Liquid Stash
            </span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
              {monthsCovered} Months Covered
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <div className="text-3xl sm:text-4xl font-black text-black dark:text-white">
              ${vault.current_balance.toLocaleString()}
            </div>
            <div className="text-right text-xs text-neutral-500 dark:text-neutral-400 font-sans">
              Goal: <strong className="font-mono-numeric text-black dark:text-white">${targetAmount.toLocaleString()}</strong>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-neutral-500 dark:text-neutral-400 font-bold">
              <span>{progressPct}% Funded</span>
              <span>{vault.target_months}-Month Cushion</span>
            </div>
            <div className="w-full h-3 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
              <div 
                className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Action Buttons: Add Stash vs Log Withdrawal */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={() => {
                setAdjustType('deposit');
                setShowAdjustModal(true);
              }}
              className="py-2.5 px-3 rounded-xl bg-black text-white dark:bg-white dark:text-black hover:opacity-90 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Stash</span>
            </button>
            <button
              onClick={() => {
                setAdjustType('withdrawal');
                setShowAdjustModal(true);
              }}
              className="py-2.5 px-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <Minus className="w-4 h-4 text-rose-500" />
              <span>Withdraw</span>
            </button>
          </div>
        </div>

        {/* Milestone Levels & Monthly Baseline Config */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-5 space-y-4 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-black dark:text-white">Target Expense Baseline</h3>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-sans">
                {vault.monthly_essential_expenses > 0
                  ? `$${vault.monthly_essential_expenses.toLocaleString()}/mo essential expenses · ${vault.target_months} mos target`
                  : 'Not configured yet. Set your monthly essential cost.'}
              </p>
            </div>
            <button
              onClick={() => setEditExpensesModal(true)}
              className="px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-200 text-xs font-bold cursor-pointer transition-colors"
            >
              Configure
            </button>
          </div>

          {/* 3 Milestone Gates */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono-numeric">
            <div className={`p-3 rounded-2xl border ${Number(monthsCovered) >= 1 ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-500/40 dark:text-emerald-300' : 'bg-neutral-50 border-neutral-200 text-neutral-400 dark:bg-neutral-800/40 dark:border-neutral-700 dark:text-neutral-500'}`}>
              <div className="text-[10px] uppercase font-bold">Gate 1</div>
              <div className="text-sm font-black mt-0.5">1 Month</div>
              <div className="text-[9px] mt-1 font-sans">{Number(monthsCovered) >= 1 ? '✓ Unlocked' : 'In Progress'}</div>
            </div>
            <div className={`p-3 rounded-2xl border ${Number(monthsCovered) >= 3 ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-500/40 dark:text-emerald-300' : 'bg-neutral-50 border-neutral-200 text-neutral-400 dark:bg-neutral-800/40 dark:border-neutral-700 dark:text-neutral-500'}`}>
              <div className="text-[10px] uppercase font-bold">Gate 2</div>
              <div className="text-sm font-black mt-0.5">3 Months</div>
              <div className="text-[9px] mt-1 font-sans">{Number(monthsCovered) >= 3 ? '✓ Solid Shield' : 'In Progress'}</div>
            </div>
            <div className={`p-3 rounded-2xl border ${Number(monthsCovered) >= 6 ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-500/40 dark:text-emerald-300' : 'bg-neutral-50 border-neutral-200 text-neutral-400 dark:bg-neutral-800/40 dark:border-neutral-700 dark:text-neutral-500'}`}>
              <div className="text-[10px] uppercase font-bold">Gate 3</div>
              <div className="text-sm font-black mt-0.5">6 Months</div>
              <div className="text-[9px] mt-1 font-sans">{Number(monthsCovered) >= 6 ? '✓ Iron Fortress' : 'In Progress'}</div>
            </div>
          </div>
        </div>

        {/* Smart Rule Card */}
        <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 text-xs text-neutral-600 dark:text-neutral-300 flex items-start gap-3">
          <Zap className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <p className="leading-relaxed font-sans">
            <strong className="text-black dark:text-white">Emergency Fund Rule:</strong> Store this cash in a high-yield savings account (HYSA) or money market yielding 4%–5% APY with instant liquidity. Never invest emergency reserves in volatile assets.
          </p>
        </div>

        {/* Modal: Adjust Balance */}
        {showAdjustModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-pop-in">
            <div className="w-full max-w-sm bg-white dark:bg-neutral-900 text-black dark:text-white rounded-3xl p-5 shadow-2xl border border-neutral-200 dark:border-neutral-800">
              <h3 className="text-base font-black mb-1">
                {adjustType === 'deposit' ? 'Add Deposit to Vault' : 'Log Vault Withdrawal'}
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">
                {adjustType === 'deposit'
                  ? 'Keep momentum going by recording extra saved cash.'
                  : 'Record funds taken out for a qualifying emergency.'}
              </p>

              <form onSubmit={handleAdjustBalance} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">Amount ($)</label>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    required
                    placeholder="e.g. 150"
                    value={adjustAmount}
                    onChange={(e) => setAdjustAmount(e.target.value)}
                    className="w-full px-3 py-2 text-base font-bold font-mono-numeric rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-black dark:text-white focus:outline-hidden focus:border-black dark:focus:border-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">Note (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Paycheck bonus or tire repair"
                    value={adjustNote}
                    onChange={(e) => setAdjustNote(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-black dark:text-white focus:outline-hidden focus:border-black dark:focus:border-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAdjustModal(false)}
                    className="py-2.5 px-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-200 text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-2.5 px-3 rounded-xl bg-black text-white dark:bg-white dark:text-black text-xs font-bold cursor-pointer hover:opacity-90"
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
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-pop-in">
            <div className="w-full max-w-sm bg-white dark:bg-neutral-900 text-black dark:text-white rounded-3xl p-5 shadow-2xl border border-neutral-200 dark:border-neutral-800">
              <h3 className="text-base font-black mb-1">Configure Vault Target</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">
                Calculates your target runway based on mandatory monthly essentials (rent, food, utilities, minimum debt).
              </p>

              <form onSubmit={handleSaveExpenseBaseline} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
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
                    className="w-full px-3 py-2 text-base font-bold font-mono-numeric rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-black dark:text-white focus:outline-hidden focus:border-black dark:focus:border-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
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
                            ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white'
                            : 'bg-neutral-50 text-neutral-800 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-200 dark:border-neutral-700 hover:bg-neutral-100'
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
                    className="py-2.5 px-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-200 text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-2.5 px-3 rounded-xl bg-black text-white dark:bg-white dark:text-black text-xs font-bold cursor-pointer hover:opacity-90"
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
