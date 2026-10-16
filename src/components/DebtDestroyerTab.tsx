import React, { useState, useEffect, useMemo } from 'react';
import {
  Flame,
  Plus,
  Trash2,
  X,
  Target,
  ArrowRight,
  ShieldCheck,
  TrendingDown,
  DollarSign,
  Percent,
  ArrowLeft
} from 'lucide-react';
import {
  DebtRecord,
  getDebtsTable,
  insertDebt,
  deleteDebt
} from '../data/downbase';

interface DebtDestroyerTabProps {
  onNavigateTab?: (tabId: string) => void;
  onGoBack?: () => void;
  isEmbedded?: boolean;
}

export const DebtDestroyerTab: React.FC<DebtDestroyerTabProps> = ({
  onNavigateTab,
  onGoBack,
  isEmbedded = false
}) => {
  const [debts, setDebts] = useState<DebtRecord[]>([]);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // Add Debt Form
  const [formName, setFormName] = useState<string>('');
  const [formTotalOwed, setFormTotalOwed] = useState<string>('');
  const [formMinPayment, setFormMinPayment] = useState<string>('');
  const [formInterestRate, setFormInterestRate] = useState<string>('');

  const refreshDebts = () => {
    setDebts(getDebtsTable());
  };

  useEffect(() => {
    refreshDebts();
  }, []);

  // Sort debts by total_owed smallest to largest (snowball method)
  const sortedDebts = useMemo(() => {
    return [...debts].sort((a, b) => a.total_owed - b.total_owed);
  }, [debts]);

  // Card on top: "Focus On: [Smallest Debt Name]"
  const smallestDebt = sortedDebts.length > 0 ? sortedDebts[0] : null;

  // Calculation: months_left = total_owed / min_payment
  const monthsLeft = smallestDebt && smallestDebt.min_payment > 0
    ? Math.ceil(smallestDebt.total_owed / smallestDebt.min_payment)
    : 0;

  // Calculation: Pay $50 extra and be free in X months where X = total_owed / (min_payment + 50)
  const monthsLeftWithExtra50 = smallestDebt
    ? Math.max(1, Math.ceil(smallestDebt.total_owed / (smallestDebt.min_payment + 50)))
    : 0;

  const totalAllOwed = useMemo(() => {
    return sortedDebts.reduce((sum, d) => sum + d.total_owed, 0);
  }, [sortedDebts]);

  const totalMinPayments = useMemo(() => {
    return sortedDebts.reduce((sum, d) => sum + d.min_payment, 0);
  }, [sortedDebts]);

  const handleDelete = (id: string) => {
    deleteDebt(id);
    refreshDebts();
  };

  const handleAddDebt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formTotalOwed || Number(formTotalOwed) <= 0) return;

    const owed = parseFloat(formTotalOwed);
    const apr = parseFloat(formInterestRate) || 0;
    insertDebt({
      name: formName.trim(),
      total_owed: owed,
      min_payment: Math.max(1, parseFloat(formMinPayment) || 25),
      interest_rate: apr,
    });

    setFormName('');
    setFormTotalOwed('');
    setFormMinPayment('');
    setFormInterestRate('');
    setShowAddModal(false);
    refreshDebts();
  };

  return (
    <div className={`w-full ${isEmbedded ? '' : 'min-h-full bg-slate-50/70 dark:bg-[#070D1E] text-slate-900 dark:text-white p-3 sm:p-4 pb-24'} select-none font-sans`}>
      <div className="w-full max-w-md mx-auto space-y-4">
        
        {/* Header Bar */}
        {!isEmbedded && (
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2.5">
              {onGoBack && (
                <button
                  type="button"
                  onClick={onGoBack}
                  className="p-2 rounded-xl bg-slate-200 dark:bg-[#102244] hover:bg-slate-300 dark:hover:bg-[#152e5c] text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                  title="Go Back"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              <div className="p-2.5 rounded-2xl bg-amber-500/15 border border-amber-400/30 text-amber-400">
                <Target className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-[10px] font-mono-numeric font-extrabold uppercase tracking-widest text-amber-400">
                  Feature 2 · Downbase Table: Debts
                </span>
                <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  DebtDestroyer
                </h1>
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-600 text-white text-xs font-black flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add Debt</span>
            </button>
          </div>
        )}

        {isEmbedded && (
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                <Target className="w-4 h-4" />
              </span>
              <h3 className="text-base font-black text-slate-900 dark:text-white">DebtDestroyer - Snowball Payoff</h3>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-2.5 py-1.5 rounded-lg bg-[#2563EB] hover:bg-blue-600 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Debt</span>
            </button>
          </div>
        )}

        {/* CARD ON TOP: "Focus On: [Smallest Debt Name]" */}
        {smallestDebt ? (
          <div className="bg-white dark:bg-[#0C182F] text-slate-900 dark:text-white rounded-[20px] p-5 shadow-md border border-slate-100 dark:border-[rgba(56,120,210,0.22)] relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-amber-500/10 text-amber-500">
                  <Flame className="w-4 h-4 fill-amber-500 stroke-amber-500" />
                </span>
                <span className="text-[11px] font-mono-numeric font-black uppercase tracking-wider text-amber-500">
                  Snowball Target #1
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-[10px] font-bold font-mono-numeric border border-amber-200 dark:border-amber-500/30">
                Smallest Balance
              </span>
            </div>

            <h2 className="text-xl font-black text-slate-900 dark:text-white leading-tight">
              Focus On: {smallestDebt.name}
            </h2>

            <div className="grid grid-cols-2 gap-3 my-3">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#081326] border border-slate-100 dark:border-[rgba(56,120,210,0.2)]">
                <span className="text-[10px] text-slate-400 dark:text-[#8FA0C0] font-mono-numeric uppercase font-bold block">
                  Total Owed
                </span>
                <span className="text-lg font-black font-mono-numeric text-slate-900 dark:text-white">
                  ${smallestDebt.total_owed.toLocaleString()}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#081326] border border-slate-100 dark:border-[rgba(56,120,210,0.2)]">
                <span className="text-[10px] text-slate-400 dark:text-[#8FA0C0] font-mono-numeric uppercase font-bold block">
                  Months Left (Standard)
                </span>
                <span className="text-lg font-black font-mono-numeric text-[#2563EB] dark:text-[#38BDF8]">
                  {monthsLeft} months
                </span>
              </div>
            </div>

            {/* Prompt text requirement: "Pay $50 extra and be free in X months" */}
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-900 dark:text-emerald-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <p className="text-xs font-extrabold leading-snug">
                  Pay $50 extra and be free in <span className="underline decoration-emerald-500 font-black text-sm text-emerald-700 dark:text-emerald-300">{monthsLeftWithExtra50} months</span>
                </p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-mono-numeric shrink-0">
                Save {Math.max(0, monthsLeft - monthsLeftWithExtra50)} mos!
              </span>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-[#0C182F] border border-slate-100 dark:border-[rgba(56,120,210,0.22)] rounded-[20px] p-5 text-center">
            <Target className="w-8 h-8 text-amber-400 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-900 dark:text-white">No Active Debts</p>
            <p className="text-xs text-slate-500 dark:text-[#8FA0C0] mt-0.5">Add cards or loans to see your Snowball strategy order.</p>
          </div>
        )}

        {/* LIST DEBTS: Sorted by total_owed smallest to largest */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-mono-numeric font-bold uppercase text-slate-400">
              Snowball Payoff Order ({sortedDebts.length})
            </span>
            <span className="text-[11px] font-mono-numeric text-slate-500">
              Smallest to largest
            </span>
          </div>

          <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-0.5">
            {sortedDebts.map((debt, idx) => {
              // Simple progress bar logic: visually showing proportion relative to total debt pool
              const shareOfAllDebt = totalAllOwed > 0 ? (debt.total_owed / totalAllOwed) * 100 : 0;
              const debtMonths = debt.min_payment > 0 ? Math.ceil(debt.total_owed / debt.min_payment) : 0;

              return (
                <div
                  key={debt.id}
                  className="bg-white dark:bg-[#0C182F] text-slate-900 dark:text-white rounded-[20px] p-4 shadow-sm border border-slate-100 dark:border-[rgba(56,120,210,0.22)] transition-all space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-[#102244] flex items-center justify-center text-xs font-black font-mono-numeric text-slate-700 dark:text-[#38BDF8]">
                        #{idx + 1}
                      </span>
                      <div>
                        <h4 className="text-sm font-black text-slate-900 dark:text-white">{debt.name}</h4>
                        <span className="text-[11px] text-slate-500 dark:text-[#8FA0C0] font-mono-numeric">
                          Min: ${debt.min_payment}/mo · {debt.interest_rate}% APR
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <span className="text-base font-black font-mono-numeric text-slate-900 dark:text-white">
                          ${debt.total_owed.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-[#8FA0C0] block font-mono-numeric">
                          {debtMonths} mos left
                        </span>
                      </div>
                      <button
                        onClick={() => handleDelete(debt.id)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-[#102244] text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                        title="Delete debt"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Visual only progress bar for each debt */}
                  <div className="space-y-1">
                    <div className="w-full bg-slate-100 dark:bg-[#081326] rounded-full h-2 overflow-hidden flex">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          idx === 0
                            ? 'bg-amber-500'
                            : idx === 1
                            ? 'bg-[#2563EB]'
                            : 'bg-[#38BDF8]'
                        }`}
                        style={{ width: `${Math.min(100, Math.max(12, shareOfAllDebt))}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 dark:text-[#8FA0C0] font-mono-numeric">
                      <span>Snowball priority #{idx + 1}</span>
                      <span>Total: ${debt.total_owed.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Summary Card */}
        <div className="bg-white dark:bg-[#0C182F] rounded-[20px] p-4 border border-slate-100 dark:border-[rgba(56,120,210,0.22)] shadow-md flex items-center justify-between text-slate-900 dark:text-white">
          <div>
            <span className="text-[10px] font-mono-numeric uppercase tracking-wider text-slate-400 dark:text-[#8FA0C0] block">
              Cumulative Debt Pool
            </span>
            <span className="text-sm font-extrabold text-slate-700 dark:text-slate-200">
              Total Remaining:
            </span>
          </div>
          <div className="text-right">
            <span className="text-xl font-black font-mono-numeric text-[#2563EB] dark:text-[#38BDF8]">
              ${totalAllOwed.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-400 dark:text-[#8FA0C0] block font-mono-numeric">
              Combined Min: ${totalMinPayments}/mo
            </span>
          </div>
        </div>

        {/* Modal: + Add Debt */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in duration-150">
            <div className="w-full max-w-sm bg-white dark:bg-[#0C182F] text-slate-900 dark:text-white rounded-3xl p-5 shadow-2xl border border-slate-100 dark:border-[rgba(56,120,210,0.22)]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-amber-100 text-amber-600">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">Add New Debt</h3>
                    <p className="text-[11px] text-slate-500">Saves to Downbase Table: Debts</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddDebt} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Debt Name (e.g. Credit Card, Student Loan)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Premier Rewards Card"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#1E90FF] text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Total Owed ($)
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    required
                    placeholder="1200"
                    value={formTotalOwed}
                    onChange={(e) => setFormTotalOwed(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#1E90FF] text-slate-900 font-mono-numeric"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Min Payment ($)
                    </label>
                    <input
                      type="number"
                      step="1"
                      min="1"
                      required
                      placeholder="35"
                      value={formMinPayment}
                      onChange={(e) => setFormMinPayment(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#1E90FF] text-slate-900 font-mono-numeric"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      APR Rate (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      placeholder="24.99"
                      value={formInterestRate}
                      onChange={(e) => setFormInterestRate(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#1E90FF] text-slate-900 font-mono-numeric"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-[#1E90FF] hover:bg-sky-500 text-white text-xs font-black shadow-md transition-colors cursor-pointer"
                  >
                    Save Debt
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
