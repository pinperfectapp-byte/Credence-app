import React, { useState, useEffect, useMemo } from 'react';
import {
  TrendingDown,
  Plus,
  Trash2,
  DollarSign,
  AlertTriangle,
  Percent,
  CreditCard,
  X,
  ArrowLeft,
  Flame,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import {
  InterestBleedRecord,
  getInterestBleedAccounts,
  insertInterestBleedAccount,
  deleteInterestBleedAccount
} from '../data/downbase';

interface InterestBleedTabProps {
  onNavigateTab?: (tabId: string) => void;
  onGoBack?: () => void;
  isEmbedded?: boolean;
}

export const InterestBleedTab: React.FC<InterestBleedTabProps> = ({
  onNavigateTab,
  onGoBack,
  isEmbedded = false
}) => {
  const [accounts, setAccounts] = useState<InterestBleedRecord[]>([]);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // Form state
  const [accountName, setAccountName] = useState<string>('');
  const [balance, setBalance] = useState<string>('');
  const [apr, setApr] = useState<string>('24.99');

  const refreshAccounts = () => {
    setAccounts(getInterestBleedAccounts());
  };

  useEffect(() => {
    refreshAccounts();
  }, []);

  // Compute live mathematical interest bleed
  const bleedStats = useMemo(() => {
    let totalBal = 0;
    let dailyBleed = 0;
    let monthlyBleed = 0;
    let yearlyBleed = 0;

    const breakdown = accounts.map((acc) => {
      const b = Number(acc.balance) || 0;
      const rate = (Number(acc.apr) || 0) / 100;
      const yearly = b * rate;
      const daily = yearly / 365;
      const monthly = daily * 30.416;

      totalBal += b;
      dailyBleed += daily;
      monthlyBleed += monthly;
      yearlyBleed += yearly;

      return {
        ...acc,
        daily,
        monthly,
        yearly,
      };
    });

    return {
      totalBalance: totalBal,
      dailyBleed,
      monthlyBleed,
      yearlyBleed,
      breakdown,
    };
  }, [accounts]);

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    const balNum = parseFloat(balance);
    const aprNum = parseFloat(apr);
    if (!accountName.trim() || isNaN(balNum) || balNum <= 0) return;

    insertInterestBleedAccount({
      account_name: accountName.trim(),
      balance: balNum,
      apr: isNaN(aprNum) ? 24.99 : aprNum,
    });

    setAccountName('');
    setBalance('');
    setApr('24.99');
    setShowAddModal(false);
    refreshAccounts();
  };

  const handleDelete = (id: string) => {
    deleteInterestBleedAccount(id);
    refreshAccounts();
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
              <div className="p-2.5 rounded-2xl bg-rose-500/20 border border-rose-400/30 text-rose-400">
                <Flame className="w-6 h-6 stroke-[2.2] fill-rose-500/30" />
              </div>
              <div>
                <span className="text-[10px] font-mono-numeric font-black uppercase tracking-widest text-rose-400">
                  Feature 12 · Daily Cash Leak
                </span>
                <h1 className="text-xl font-black text-white tracking-tight">
                  Interest Bleed
                </h1>
              </div>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold font-mono-numeric shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Track Card</span>
            </button>
          </div>
        )}

        {/* Hero Bleed Metric Card */}
        <div className="bg-gradient-to-br from-slate-900 via-[#0A1931] to-rose-950 border border-rose-500/30 rounded-3xl p-5 shadow-2xl space-y-3.5 font-mono-numeric">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300">
              Daily Loss to Credit Card APR
            </span>
            <span className="px-2 py-0.5 rounded-md bg-rose-500/20 border border-rose-400/30 text-rose-300 text-[10px] font-black">
              Pure Financial Leak
            </span>
          </div>

          <div>
            <span className="text-3xl font-black text-[#FF4D4D]">
              ${bleedStats.dailyBleed.toFixed(2)}
            </span>
            <span className="text-xs text-slate-300 ml-2">/ day thrown away</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center pt-1 border-t border-white/10">
            <div className="p-2 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-[10px] text-slate-400 block">Monthly Bleed</span>
              <span className="text-base font-black text-rose-300">
                ${bleedStats.monthlyBleed.toFixed(2)}/mo
              </span>
            </div>
            <div className="p-2 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-[10px] text-slate-400 block">Yearly Bleed</span>
              <span className="text-base font-black text-rose-400">
                ${bleedStats.yearlyBleed.toFixed(2)}/yr
              </span>
            </div>
          </div>

          <p className="text-[11px] text-slate-300 leading-relaxed bg-white/5 p-2.5 rounded-xl border border-white/5">
            Credit card interest compounds daily on revolving balances. Eliminating this balance saves you <strong className="text-emerald-400">${bleedStats.yearlyBleed.toFixed(0)}/year</strong> in pure cold cash.
          </p>
        </div>

        {/* Accounts Breakdown List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-mono-numeric font-bold uppercase text-slate-400">
              Monitored Balances ({accounts.length})
            </span>
            <span className="text-[11px] font-mono-numeric text-slate-500">
              Table: Interest_Bleed
            </span>
          </div>

          {bleedStats.breakdown.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center text-slate-400">
              <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-white">Zero Interest Bleed</p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                No credit balances logged. Tap "+ Track Card" to calculate exactly how much money high APR interest drains from your pocket each day.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-0.5">
              {bleedStats.breakdown.map((acc) => (
                <div
                  key={acc.id}
                  className="bg-white text-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between font-mono-numeric"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-slate-900">{acc.account_name}</h4>
                      <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-rose-50 text-rose-700 font-bold">
                        {acc.apr}% APR
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span>Balance: ${acc.balance.toLocaleString()}</span>
                      <span>·</span>
                      <span className="text-rose-600 font-bold">${acc.daily.toFixed(2)}/day</span>
                    </div>

                    <div className="text-[10px] text-slate-400">
                      Costs ${acc.monthly.toFixed(2)}/month · ${acc.yearly.toFixed(2)}/year
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(acc.id)}
                    className="p-2 text-slate-300 hover:text-rose-500 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Remove Account"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Account Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-700 text-white rounded-3xl p-5 w-full max-w-sm shadow-2xl space-y-3 font-mono-numeric">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-rose-400" />
                  <h3 className="font-black text-sm">Track Balance APR Bleed</h3>
                </div>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddAccount} className="space-y-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Card / Loan Name</label>
                  <input
                    type="text"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    placeholder="e.g. Premier Cash Card"
                    required
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-rose-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Balance Owed ($)</label>
                    <input
                      type="number"
                      step="any"
                      value={balance}
                      onChange={(e) => setBalance(e.target.value)}
                      placeholder="e.g. 2500"
                      required
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-rose-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1">APR (%)</label>
                    <input
                      type="number"
                      step="any"
                      value={apr}
                      onChange={(e) => setApr(e.target.value)}
                      placeholder="e.g. 24.99"
                      required
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-rose-400"
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
                    className="flex-1 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl"
                  >
                    Calculate Bleed
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
