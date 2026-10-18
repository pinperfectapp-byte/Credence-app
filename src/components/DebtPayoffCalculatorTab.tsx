import React, { useState, useMemo } from 'react';
import { CreditProfile } from '../types/credit';
import { 
  DebtItem, 
  calculateDebtComparison, 
  ComparisonResult 
} from '../utils/debtCalculator';
import { DebtPayoffVisualizer } from './DebtPayoffVisualizer';
import { AvalancheInterestSavingsCard } from './AvalancheInterestSavingsCard';
import { 
  Flame, 
  Snowflake, 
  Plus, 
  Trash2, 
  RotateCcw, 
  TrendingDown, 
  DollarSign, 
  Calendar, 
  CheckCircle, 
  ArrowRight,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

interface DebtPayoffCalculatorTabProps {
  profile: CreditProfile;
}

export const DebtPayoffCalculatorTab: React.FC<DebtPayoffCalculatorTabProps> = ({ profile }) => {
  // Convert profile credit cards into DebtItems initially if present, else start clean
  const initialDebtsFromProfile: DebtItem[] = useMemo(() => {
    if (profile.cards.length > 0) {
      return profile.cards.map((c) => ({
        id: c.id,
        name: c.name,
        category: 'Credit Card',
        balance: c.balance,
        apr: c.apr,
        minPayment: Math.max(25, Math.round(c.balance * 0.025)),
      }));
    }
    return [];
  }, [profile.cards]);

  const [debts, setDebts] = useState<DebtItem[]>(initialDebtsFromProfile);
  const [extraPayment, setExtraPayment] = useState<number>(0);
  const [activeStrategyView, setActiveStrategyView] = useState<'Avalanche' | 'Snowball'>('Avalanche');

  // New debt form state
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [newDebtName, setNewDebtName] = useState<string>('');
  const [newCategory, setNewCategory] = useState<'Credit Card' | 'Auto Loan' | 'Student Loan' | 'Personal Loan' | 'Medical Debt'>('Credit Card');
  const [newBalance, setNewBalance] = useState<string>('');
  const [newApr, setNewApr] = useState<string>('');
  const [newMinPayment, setNewMinPayment] = useState<string>('');

  // Compute comparison
  const comparison: ComparisonResult = useMemo(() => {
    return calculateDebtComparison(debts, extraPayment);
  }, [debts, extraPayment]);

  const totalDebtBalance = debts.reduce((sum, d) => sum + d.balance, 0);
  const totalMinPayments = debts.reduce((sum, d) => sum + d.minPayment, 0);

  const handleSyncProfileCards = () => {
    if (profile.cards.length === 0) return;
    const synced = profile.cards.map((c) => ({
      id: c.id,
      name: c.name,
      category: 'Credit Card' as const,
      balance: c.balance,
      apr: c.apr,
      minPayment: Math.max(25, Math.round(c.balance * 0.025)),
    }));
    setDebts(synced);
  };

  const handleAddDebt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDebtName.trim()) return;

    const bal = Math.max(0, parseFloat(newBalance) || 0);
    const apr = Math.max(0, parseFloat(newApr) || 0);
    const minP = Math.max(10, parseFloat(newMinPayment) || Math.round(bal * 0.025));

    const item: DebtItem = {
      id: `debt_${Date.now()}`,
      name: newDebtName.trim(),
      category: newCategory,
      balance: bal,
      apr,
      minPayment: minP,
    };

    setDebts([...debts, item]);
    setNewDebtName('');
    setNewBalance('2000');
    setNewApr('24.99');
    setNewMinPayment('60');
    setShowAddForm(false);
  };

  const handleRemoveDebt = (id: string) => {
    setDebts(debts.filter((d) => d.id !== id));
  };

  const getDebtFreeDateString = (months: number) => {
    if (months <= 0) return 'Immediate';
    const now = new Date();
    const targetDate = new Date(now.getFullYear(), now.getMonth() + months, 1);
    return targetDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const currentResult = activeStrategyView === 'Avalanche' ? comparison.avalanche : comparison.snowball;

  return (
    <div className="space-y-8 pb-8">
      {/* 1. Header Banner */}
      <div className="bg-white dark:bg-neutral-900 text-black dark:text-white rounded-2xl p-6 shadow-xs border border-neutral-200 dark:border-neutral-800 transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <TrendingDown className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>US Consumer Debt Acceleration Engine</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-black dark:text-white tracking-tight">
              Debt Avalanche vs. Debt Snowball Calculator
            </h2>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
              Find the fastest path to becoming 100% debt-free. Compare the mathematical precision of the <strong className="text-black dark:text-white">Avalanche method</strong> (highest APR first) against the psychological momentum of the <strong className="text-black dark:text-white">Snowball method</strong> (lowest balance first).
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center">
            {profile.cards.length > 0 && (
              <button
                onClick={handleSyncProfileCards}
                className="px-3 py-1.5 text-xs font-semibold text-neutral-800 dark:text-neutral-200 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-xl border border-neutral-200 dark:border-neutral-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Sync open credit cards from your profile"
              >
                <RefreshCw className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Sync My Profile Cards</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Interactive Debt Payoff Visualizer & Avalanche Savings Summary Card */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <div className="xl:col-span-8">
          <DebtPayoffVisualizer
            debts={debts}
            extraPayment={extraPayment}
            onExtraPaymentChange={setExtraPayment}
            activeStrategyView={activeStrategyView}
            onSelectStrategyView={setActiveStrategyView}
          />
        </div>
        <div className="xl:col-span-4 sticky top-6">
          <AvalancheInterestSavingsCard
            debts={debts}
            extraPayment={extraPayment}
            comparison={comparison}
            onSelectStrategyView={setActiveStrategyView}
            activeStrategyView={activeStrategyView}
          />
        </div>
      </div>

      {/* 3. Side-by-Side Comparison Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Avalanche Card */}
        <div
          onClick={() => setActiveStrategyView('Avalanche')}
          className={`bg-white dark:bg-slate-900 border rounded-xl p-6 shadow-xs cursor-pointer transition-all ${
            activeStrategyView === 'Avalanche'
              ? 'border-emerald-600 ring-2 ring-emerald-600/20'
              : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Flame className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-base">Debt Avalanche</h4>
                <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                  Mathematically Fastest · Highest APR First
                </span>
              </div>
            </div>
            {activeStrategyView === 'Avalanche' && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-sm bg-emerald-600 text-white">
                Active View
              </span>
            )}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 block font-bold">Debt-Free Time</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white font-mono-numeric">
                {comparison.avalanche.totalMonths}
                <span className="text-xs font-normal text-slate-500 dark:text-slate-400 ml-1">Months</span>
              </span>
              <span className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 block font-mono-numeric mt-0.5">
                Debt-Free by {getDebtFreeDateString(comparison.avalanche.totalMonths)}
              </span>
            </div>

            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 block">Total Interest Paid</span>
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono-numeric">
                ${comparison.avalanche.totalInterest.toLocaleString()}
              </span>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold block">
                Lowest Total Cost
              </span>
            </div>
          </div>

          <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-300 space-y-1">
            <div className="flex items-center justify-between font-bold">
              <span>Savings vs. Snowball:</span>
              <span className="font-mono-numeric">
                +${comparison.interestSavedWithAvalanche.toLocaleString()} saved
              </span>
            </div>
            <p className="text-[11px] text-emerald-800 dark:text-emerald-400 leading-relaxed">
              Targeting highest APRs stops compounding interest immediately, saving thousands over the loan lifetime.
            </p>
          </div>
        </div>

        {/* Snowball Card */}
        <div
          onClick={() => setActiveStrategyView('Snowball')}
          className={`bg-white dark:bg-slate-900 border rounded-xl p-6 shadow-xs cursor-pointer transition-all ${
            activeStrategyView === 'Snowball'
              ? 'border-sky-600 ring-2 ring-sky-600/20'
              : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                <Snowflake className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-base">Debt Snowball</h4>
                <span className="text-[11px] text-sky-700 dark:text-sky-400 font-semibold">
                  Behavioral Momentum · Smallest Balance First
                </span>
              </div>
            </div>
            {activeStrategyView === 'Snowball' && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-sm bg-sky-600 text-white">
                Active View
              </span>
            )}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 block font-bold">Debt-Free Time</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white font-mono-numeric">
                {comparison.snowball.totalMonths}
                <span className="text-xs font-normal text-slate-500 dark:text-slate-400 ml-1">Months</span>
              </span>
              <span className="text-[11px] font-black text-sky-600 dark:text-sky-400 block font-mono-numeric mt-0.5">
                Debt-Free by {getDebtFreeDateString(comparison.snowball.totalMonths)}
              </span>
            </div>

            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 block">Total Interest Paid</span>
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono-numeric">
                ${comparison.snowball.totalInterest.toLocaleString()}
              </span>
              <span className="text-[11px] text-sky-600 dark:text-sky-400 font-bold block">
                Quickest Early Wins
              </span>
            </div>
          </div>

          <div className="mt-4 p-3 bg-sky-50 dark:bg-sky-950/40 rounded-lg border border-sky-200 dark:border-sky-800 text-xs text-sky-900 dark:text-sky-300 space-y-1">
            <div className="flex items-center justify-between font-bold">
              <span>First Account Knocked Out:</span>
              <span className="font-mono-numeric">
                Month {comparison.snowball.payoffMilestones[0]?.monthPaid || 1}
              </span>
            </div>
            <p className="text-[11px] text-sky-800 dark:text-sky-400 leading-relaxed">
              Eliminating entire accounts quickly provides emotional wins and frees up monthly minimum obligations.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Warning Comparison: Minimum Payments Only */}
      <div className="bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-5 text-xs text-amber-900 dark:text-amber-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="font-bold text-amber-950 dark:text-amber-300 flex items-center gap-1.5 text-sm">
            <span>The Danger of Paying Only Minimums:</span>
          </span>
          <p className="text-amber-800 dark:text-amber-300 leading-relaxed max-w-2xl">
            Paying only mandatory minimums will drag your debt out to <strong className="text-amber-950 dark:text-amber-200">{comparison.minimumOnly.totalMonths} months ({(comparison.minimumOnly.totalMonths / 12).toFixed(1)} years)</strong> and cost <strong className="text-amber-950 dark:text-amber-200">${comparison.minimumOnly.totalInterest.toLocaleString()} in interest</strong>.
            Your extra ${extraPayment}/month saves you <strong className="text-emerald-800 dark:text-emerald-400">${comparison.interestSavedVsMinimums.toLocaleString()} in pure interest</strong> and cuts {(comparison.monthsSavedVsMinimums / 12).toFixed(1)} years off your debt sentence!
          </p>
        </div>
      </div>

      {/* 5. Active Strategy Milestones & Timeline */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-4 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{activeStrategyView} Payoff Order &amp; Milestones</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Exact sequence in which your accounts will reach $0 balance.
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <button
              onClick={() => setActiveStrategyView('Avalanche')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                activeStrategyView === 'Avalanche'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Avalanche View
            </button>
            <button
              onClick={() => setActiveStrategyView('Snowball')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                activeStrategyView === 'Snowball'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Snowball View
            </button>
          </div>
        </div>

        {currentResult.payoffMilestones.length === 0 ? (
          <p className="text-xs text-slate-500 dark:text-slate-400 py-4">No active debts to simulate.</p>
        ) : (
          <div className="space-y-3">
            {currentResult.payoffMilestones.map((m, idx) => (
              <div
                key={m.debtId}
                className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-slate-900 dark:bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    {idx + 1}
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{m.debtName}</span>
                    <span className="text-slate-500 dark:text-slate-400 text-[11px] block">
                      Target #{idx + 1} in {activeStrategyView} method
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 font-mono-numeric">
                  <div className="text-left sm:text-right">
                    <span className="text-[11px] text-slate-400 block uppercase">Paid In Full</span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">Month {m.monthPaid}</span>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-[11px] text-slate-400 block uppercase">Interest Accrued</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">${m.totalInterestPaid.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 6. Manage Debts Inventory Table */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-4 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Your Active Debt Inventory ({debts.length})
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Add all credit cards, auto loans, personal loans, or medical debts to include in calculations.
            </p>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer border border-slate-700"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Debt Account</span>
          </button>
        </div>

        {/* Inline Add Debt Form */}
        {showAddForm && (
          <form
            onSubmit={handleAddDebt}
            className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 text-xs space-y-3"
          >
            <span className="font-bold text-slate-900 dark:text-white block">Add New Debt or Loan</span>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              <div className="sm:col-span-2">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Debt Name / Account</label>
                <input
                  type="text"
                  placeholder="e.g. Primary Credit Card / Auto Loan"
                  value={newDebtName}
                  onChange={(e) => setNewDebtName(e.target.value)}
                  required
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md px-2.5 py-1.5 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md px-2.5 py-1.5 text-slate-900 dark:text-white"
                >
                  <option value="Credit Card">Credit Card</option>
                  <option value="Auto Loan">Auto Loan</option>
                  <option value="Student Loan">Student Loan</option>
                  <option value="Personal Loan">Personal Loan</option>
                  <option value="Medical Debt">Medical Debt</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Balance ($)</label>
                <input
                  type="number"
                  min="0"
                  value={newBalance}
                  onChange={(e) => setNewBalance(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md px-2.5 py-1.5 text-slate-900 dark:text-white font-mono-numeric"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">APR (%)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={newApr}
                  onChange={(e) => setNewApr(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md px-2.5 py-1.5 text-slate-900 dark:text-white font-mono-numeric"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">Minimum Monthly Due ($):</span>
                <input
                  type="number"
                  min="10"
                  value={newMinPayment}
                  onChange={(e) => setNewMinPayment(e.target.value)}
                  className="w-20 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md px-2 py-1 text-slate-900 dark:text-white font-mono-numeric"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 rounded-md cursor-pointer"
                >
                  Add to Calculator
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Debts Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-2.5 px-3">Account Name</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3 text-right">Balance</th>
                <th className="py-2.5 px-3 text-right">APR</th>
                <th className="py-2.5 px-3 text-right">Min Payment</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono-numeric">
              {debts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 font-sans">
                    No debts or loans logged yet. Click &quot;Add Debt Account&quot; to calculate your payoff timeline.
                  </td>
                </tr>
              ) : (
                debts.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 font-sans font-bold text-slate-900 dark:text-white">{d.name}</td>
                    <td className="py-3 px-3 font-sans text-slate-500 dark:text-slate-400">{d.category}</td>
                    <td className="py-3 px-3 text-right font-bold text-slate-900 dark:text-white">
                      ${d.balance.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right font-semibold text-slate-700 dark:text-slate-300">
                      {d.apr}%
                    </td>
                    <td className="py-3 px-3 text-right text-slate-600 dark:text-slate-400">
                      ${d.minPayment}/mo
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleRemoveDebt(d.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer transition-colors"
                        title="Remove debt"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
