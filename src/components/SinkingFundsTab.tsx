import React, { useState, useEffect, useMemo } from 'react';
import {
  Layers,
  Plus,
  Trash2,
  DollarSign,
  Calendar,
  CheckCircle2,
  TrendingUp,
  X,
  ArrowLeft,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';
import {
  SinkingFundRecord,
  getSinkingFundsTable,
  insertSinkingFund,
  updateSinkingFundSaved,
  deleteSinkingFund,
  getDateDaysFromNow
} from '../data/downbase';

interface SinkingFundsTabProps {
  onNavigateTab?: (tabId: string) => void;
  onGoBack?: () => void;
  isEmbedded?: boolean;
}

export const SinkingFundsTab: React.FC<SinkingFundsTabProps> = ({
  onNavigateTab,
  onGoBack,
  isEmbedded = false
}) => {
  const [funds, setFunds] = useState<SinkingFundRecord[]>([]);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [adjustFundId, setAdjustFundId] = useState<string | null>(null);
  const [adjustAmount, setAdjustAmount] = useState<string>('');
  const [adjustType, setAdjustType] = useState<'deposit' | 'withdraw'>('deposit');

  // Form
  const [name, setName] = useState<string>('');
  const [targetAmount, setTargetAmount] = useState<string>('');
  const [currentSaved, setCurrentSaved] = useState<string>('');
  const [frequency, setFrequency] = useState<SinkingFundRecord['frequency']>('Annual');
  const [targetDate, setTargetDate] = useState<string>(getDateDaysFromNow(180));
  const [category, setCategory] = useState<SinkingFundRecord['category']>('Car Maintenance');

  const refreshFunds = () => {
    setFunds(getSinkingFundsTable());
  };

  useEffect(() => {
    refreshFunds();
  }, []);

  const totalTarget = useMemo(() => funds.reduce((s, f) => s + f.target_amount, 0), [funds]);
  const totalSaved = useMemo(() => funds.reduce((s, f) => s + f.current_saved, 0), [funds]);
  const totalMonthlyNeed = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return funds.reduce((sum, f) => {
      const target = new Date(f.target_date + 'T00:00:00');
      const diffTime = target.getTime() - today.getTime();
      const monthsLeft = Math.max(0.5, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) / 30.4);
      const remaining = Math.max(0, f.target_amount - f.current_saved);
      return sum + Math.ceil(remaining / monthsLeft);
    }, 0);
  }, [funds]);

  const handleAddFund = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseFloat(targetAmount);
    if (!name.trim() || isNaN(target) || target <= 0) return;

    insertSinkingFund({
      name: name.trim(),
      target_amount: target,
      current_saved: parseFloat(currentSaved) || 0,
      frequency,
      target_date: targetDate,
      category,
    });

    setName('');
    setTargetAmount('');
    setCurrentSaved('');
    setTargetDate(getDateDaysFromNow(180));
    setShowAddModal(false);
    refreshFunds();
  };

  const handleAdjustBalance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustFundId) return;
    const delta = parseFloat(adjustAmount);
    if (isNaN(delta) || delta <= 0) return;

    const targetFund = funds.find((f) => f.id === adjustFundId);
    if (!targetFund) return;

    const nextSaved = adjustType === 'deposit'
      ? targetFund.current_saved + delta
      : Math.max(0, targetFund.current_saved - delta);

    updateSinkingFundSaved(adjustFundId, nextSaved);
    setAdjustFundId(null);
    setAdjustAmount('');
    refreshFunds();
  };

  const handleDelete = (id: string) => {
    deleteSinkingFund(id);
    refreshFunds();
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
              <div className="p-2.5 rounded-2xl bg-violet-500/20 border border-violet-400/30 text-violet-400">
                <Layers className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-[10px] font-mono-numeric font-black uppercase tracking-widest text-violet-400">
                  Feature 17 · Irregular Expenses
                </span>
                <h1 className="text-xl font-black text-white tracking-tight">
                  Sinking Funds
                </h1>
              </div>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold font-mono-numeric shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Create Pool</span>
            </button>
          </div>
        )}

        {/* Overview Hero Card */}
        <div className="bg-gradient-to-br from-slate-900 via-[#0A1931] to-violet-950 border border-violet-500/30 rounded-3xl p-5 shadow-2xl space-y-3 font-mono-numeric">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300">
              Total Sinking Funds Buffer
            </span>
            <span className="px-2 py-0.5 rounded-md bg-violet-500/20 border border-violet-400/30 text-violet-300 text-[10px] font-black">
              Table: Sinking_Funds
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-2xl font-black text-white">
                ${totalSaved.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-xs text-slate-400 ml-2">
                reserved of ${totalTarget.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block">Monthly Allocation</span>
              <span className="text-base font-black text-violet-300">
                ${totalMonthlyNeed}/mo
              </span>
            </div>
          </div>

          <p className="text-[11px] text-slate-300 leading-relaxed bg-white/5 p-2.5 rounded-xl border border-white/5">
            <strong>Sinking funds</strong> prevent emergencies by saving small monthly amounts for predictable large annual costs (car insurance, registration, holiday gifts, home maintenance).
          </p>
        </div>

        {/* Sinking Pools List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-mono-numeric font-bold uppercase text-slate-400">
              Allocated Expense Pools ({funds.length})
            </span>
            <span className="text-[11px] font-mono-numeric text-slate-500">
              Downbase Reserve Ledger
            </span>
          </div>

          {funds.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center text-slate-400">
              <Layers className="w-8 h-8 text-violet-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-white">No Sinking Funds Configured</p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                Create dedicated sinking pools for auto insurance, property taxes, holiday budgets, or vet bills to buffer against unexpected expenses.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-0.5 font-mono-numeric">
              {funds.map((fund) => {
                const percent = Math.min(100, Math.round((fund.current_saved / fund.target_amount) * 100));

                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const target = new Date(fund.target_date + 'T00:00:00');
                const diffTime = target.getTime() - today.getTime();
                const daysLeft = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
                const monthsLeft = Math.max(0.5, daysLeft / 30.4);
                const remaining = Math.max(0, fund.target_amount - fund.current_saved);
                const neededPerMonth = Math.ceil(remaining / monthsLeft);

                return (
                  <div
                    key={fund.id}
                    className="bg-white text-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-black text-slate-900">{fund.name}</h4>
                          <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-violet-50 text-violet-700 font-bold uppercase">
                            {fund.category}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500">
                          Due: {fund.target_date} ({daysLeft} days) · {fund.frequency}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-base font-black text-slate-900">
                          ${fund.current_saved.toLocaleString()}
                        </span>
                        <span className="text-[11px] text-slate-400 block">
                          / ${fund.target_amount.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-violet-500 h-2 rounded-full transition-all"
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-0.5 border-t border-slate-100">
                      <span className="text-slate-600">
                        {percent >= 100 ? (
                          <strong className="text-emerald-600">✓ Fully Funded!</strong>
                        ) : (
                          <>Allocate <strong className="text-violet-700">${neededPerMonth}/mo</strong></>
                        )}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setAdjustFundId(fund.id);
                            setAdjustType('deposit');
                          }}
                          className="px-2 py-1 rounded-lg bg-violet-50 hover:bg-violet-100 text-violet-700 text-xs font-bold transition-colors cursor-pointer"
                        >
                          + Deposit
                        </button>
                        <button
                          onClick={() => {
                            setAdjustFundId(fund.id);
                            setAdjustType('withdraw');
                          }}
                          className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition-colors cursor-pointer"
                        >
                          - Withdraw
                        </button>
                        <button
                          onClick={() => handleDelete(fund.id)}
                          className="p-1 text-slate-300 hover:text-rose-500 transition-colors cursor-pointer"
                          title="Delete Pool"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Deposit/Withdraw Modal */}
        {adjustFundId && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-700 text-white rounded-3xl p-5 w-full max-w-sm shadow-2xl space-y-3 font-mono-numeric">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="font-bold text-sm">
                  {adjustType === 'deposit' ? 'Add Deposit to Pool' : 'Withdraw from Pool'}
                </h3>
                <button onClick={() => setAdjustFundId(null)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAdjustBalance} className="space-y-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Amount ($)</label>
                  <input
                    type="number"
                    step="any"
                    value={adjustAmount}
                    onChange={(e) => setAdjustAmount(e.target.value)}
                    placeholder="e.g. 50"
                    autoFocus
                    required
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-base focus:outline-none focus:border-violet-400"
                  />
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setAdjustFundId(null)}
                    className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold rounded-xl"
                  >
                    Confirm {adjustType === 'deposit' ? 'Deposit' : 'Withdraw'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-700 text-white rounded-3xl p-5 w-full max-w-sm shadow-2xl space-y-3 font-mono-numeric">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-violet-400" />
                  <h3 className="font-black text-sm">Create Sinking Pool</h3>
                </div>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddFund} className="space-y-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Expense Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Annual Auto Insurance"
                    required
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-violet-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Target Amount ($)</label>
                    <input
                      type="number"
                      step="any"
                      value={targetAmount}
                      onChange={(e) => setTargetAmount(e.target.value)}
                      placeholder="e.g. 1200"
                      required
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-violet-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Current Saved ($)</label>
                    <input
                      type="number"
                      step="any"
                      value={currentSaved}
                      onChange={(e) => setCurrentSaved(e.target.value)}
                      placeholder="e.g. 200"
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-violet-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-violet-400"
                    >
                      <option value="Car Maintenance">Car Maintenance</option>
                      <option value="Insurance">Insurance</option>
                      <option value="Taxes">Taxes</option>
                      <option value="Holiday/Gifts">Holiday/Gifts</option>
                      <option value="Home Repair">Home Repair</option>
                      <option value="Medical">Medical</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Due Date</label>
                    <input
                      type="date"
                      value={targetDate}
                      onChange={(e) => setTargetDate(e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-violet-400"
                    />
                  </div>
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
                    className="flex-1 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold rounded-xl"
                  >
                    Save Sinking Pool
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
