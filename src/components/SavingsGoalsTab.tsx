import React, { useState, useEffect, useMemo } from 'react';
import {
  Target,
  Plus,
  Trash2,
  DollarSign,
  Calendar,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  X,
  ArrowLeft,
  PiggyBank
} from 'lucide-react';
import {
  SavingsGoalRecord,
  getSavingsGoalsTable,
  insertSavingsGoal,
  updateSavingsGoalBalance,
  deleteSavingsGoal,
  getDateDaysFromNow
} from '../data/downbase';

interface SavingsGoalsTabProps {
  onNavigateTab?: (tabId: string) => void;
  onGoBack?: () => void;
  isEmbedded?: boolean;
}

export const SavingsGoalsTab: React.FC<SavingsGoalsTabProps> = ({
  onNavigateTab,
  onGoBack,
  isEmbedded = false
}) => {
  const [goals, setGoals] = useState<SavingsGoalRecord[]>([]);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [adjustGoalId, setAdjustGoalId] = useState<string | null>(null);
  const [adjustAmount, setAdjustAmount] = useState<string>('');
  const [adjustType, setAdjustType] = useState<'deposit' | 'withdraw'>('deposit');

  // New goal form
  const [name, setName] = useState<string>('');
  const [targetAmount, setTargetAmount] = useState<string>('');
  const [currentAmount, setCurrentAmount] = useState<string>('');
  const [targetDate, setTargetDate] = useState<string>(getDateDaysFromNow(180));
  const [category, setCategory] = useState<SavingsGoalRecord['category']>('General');

  const refreshGoals = () => {
    setGoals(getSavingsGoalsTable());
  };

  useEffect(() => {
    refreshGoals();
  }, []);

  const totalTarget = useMemo(() => goals.reduce((s, g) => s + g.target_amount, 0), [goals]);
  const totalSaved = useMemo(() => goals.reduce((s, g) => s + g.current_amount, 0), [goals]);
  const totalProgress = totalTarget > 0 ? Math.min(100, Math.round((totalSaved / totalTarget) * 100)) : 0;

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseFloat(targetAmount);
    if (!name.trim() || isNaN(target) || target <= 0) return;

    insertSavingsGoal({
      name: name.trim(),
      target_amount: target,
      current_amount: parseFloat(currentAmount) || 0,
      target_date: targetDate,
      category,
    });

    setName('');
    setTargetAmount('');
    setCurrentAmount('');
    setTargetDate(getDateDaysFromNow(180));
    setShowAddModal(false);
    refreshGoals();
  };

  const handleAdjustBalance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustGoalId) return;
    const delta = parseFloat(adjustAmount);
    if (isNaN(delta) || delta <= 0) return;

    const targetGoal = goals.find((g) => g.id === adjustGoalId);
    if (!targetGoal) return;

    const nextBalance = adjustType === 'deposit'
      ? targetGoal.current_amount + delta
      : Math.max(0, targetGoal.current_amount - delta);

    updateSavingsGoalBalance(adjustGoalId, nextBalance);
    setAdjustGoalId(null);
    setAdjustAmount('');
    refreshGoals();
  };

  const handleDelete = (id: string) => {
    deleteSavingsGoal(id);
    refreshGoals();
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
              <div className="p-2.5 rounded-2xl bg-teal-500/20 border border-teal-400/30 text-teal-400">
                <PiggyBank className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-[10px] font-mono-numeric font-black uppercase tracking-widest text-teal-400">
                  Feature 10 · Multi-Vault Goals
                </span>
                <h1 className="text-xl font-black text-white tracking-tight">
                  Savings Goals
                </h1>
              </div>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold font-mono-numeric shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>New Goal</span>
            </button>
          </div>
        )}

        {/* Aggregate Overview Card */}
        <div className="bg-gradient-to-br from-slate-900 via-[#0A1931] to-teal-950 border border-teal-500/20 rounded-3xl p-4.5 shadow-xl space-y-3 font-mono-numeric">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300">
              Total Goals Portfolio
            </span>
            <span className="px-2 py-0.5 rounded-md bg-teal-500/20 border border-teal-400/30 text-teal-300 text-[10px] font-black">
              {totalProgress}% Complete
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-2xl font-black text-white">
                ${totalSaved.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-xs text-slate-400 ml-2">
                saved of ${totalTarget.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <span className="text-xs text-teal-400 font-bold">
              ${Math.max(0, totalTarget - totalSaved).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} left
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-teal-500 to-emerald-400 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${totalProgress}%` }}
            />
          </div>
        </div>

        {/* Goals List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-mono-numeric font-bold uppercase text-slate-400">
              Target Vaults ({goals.length})
            </span>
            <span className="text-[11px] font-mono-numeric text-slate-500">
              Table: Savings_Goals
            </span>
          </div>

          {goals.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center text-slate-400">
              <PiggyBank className="w-8 h-8 text-teal-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-white">No Savings Goals Set</p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                Create dedicated savings targets for emergencies, house down payments, travel, or vehicle maintenance.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-0.5">
              {goals.map((goal) => {
                const percent = Math.min(100, Math.round((goal.current_amount / goal.target_amount) * 100));
                
                // Days left until target date
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const target = new Date(goal.target_date + 'T00:00:00');
                const diffTime = target.getTime() - today.getTime();
                const daysLeft = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
                const monthsLeft = Math.max(0.5, daysLeft / 30.4);
                const remaining = Math.max(0, goal.target_amount - goal.current_amount);
                const requiredPerMonth = Math.ceil(remaining / monthsLeft);

                return (
                  <div
                    key={goal.id}
                    className="bg-white text-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 space-y-2.5 font-mono-numeric"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-black text-slate-900">{goal.name}</h4>
                          <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-teal-50 text-teal-700 font-bold uppercase">
                            {goal.category}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500">
                          Target Date: {goal.target_date} ({daysLeft} days)
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-base font-black text-slate-900">
                          ${goal.current_amount.toLocaleString()}
                        </span>
                        <span className="text-[11px] text-slate-400 block">
                          / ${goal.target_amount.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-teal-500 h-2 rounded-full transition-all"
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-0.5 border-t border-slate-100">
                      <span className="text-slate-600">
                        {percent >= 100 ? (
                          <strong className="text-emerald-600">✓ Goal Reached!</strong>
                        ) : (
                          <>Save <strong className="text-teal-700">${requiredPerMonth}/mo</strong> to hit deadline</>
                        )}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setAdjustGoalId(goal.id);
                            setAdjustType('deposit');
                          }}
                          className="px-2 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-bold transition-colors cursor-pointer"
                        >
                          + Deposit
                        </button>
                        <button
                          onClick={() => {
                            setAdjustGoalId(goal.id);
                            setAdjustType('withdraw');
                          }}
                          className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition-colors cursor-pointer"
                        >
                          - Withdraw
                        </button>
                        <button
                          onClick={() => handleDelete(goal.id)}
                          className="p-1 text-slate-300 hover:text-rose-500 transition-colors cursor-pointer"
                          title="Delete Goal"
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
        {adjustGoalId && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-700 text-white rounded-3xl p-5 w-full max-w-sm shadow-2xl space-y-3 font-mono-numeric">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="font-bold text-sm">
                  {adjustType === 'deposit' ? 'Add Deposit to Vault' : 'Withdraw from Vault'}
                </h3>
                <button onClick={() => setAdjustGoalId(null)} className="text-slate-400 hover:text-white">
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
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-base focus:outline-none focus:border-teal-400"
                  />
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setAdjustGoalId(null)}
                    className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl"
                  >
                    Confirm {adjustType === 'deposit' ? 'Deposit' : 'Withdraw'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Create Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-700 text-white rounded-3xl p-5 w-full max-w-sm shadow-2xl space-y-3 font-mono-numeric">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <PiggyBank className="w-5 h-5 text-teal-400" />
                  <h3 className="font-black text-sm">Create Savings Goal</h3>
                </div>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateGoal} className="space-y-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Goal Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Emergency 6-Month Reserve"
                    required
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-teal-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Target ($)</label>
                    <input
                      type="number"
                      step="any"
                      value={targetAmount}
                      onChange={(e) => setTargetAmount(e.target.value)}
                      placeholder="e.g. 5000"
                      required
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-teal-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Current Saved ($)</label>
                    <input
                      type="number"
                      step="any"
                      value={currentAmount}
                      onChange={(e) => setCurrentAmount(e.target.value)}
                      placeholder="e.g. 500"
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-teal-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-teal-400"
                    >
                      <option value="Emergency">Emergency</option>
                      <option value="Down Payment">Down Payment</option>
                      <option value="Vehicle">Vehicle</option>
                      <option value="Vacation">Vacation</option>
                      <option value="Taxes">Taxes</option>
                      <option value="General">General</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Target Date</label>
                    <input
                      type="date"
                      value={targetDate}
                      onChange={(e) => setTargetDate(e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-teal-400"
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
                    className="flex-1 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl"
                  >
                    Save Goal
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
