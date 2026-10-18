import React, { useState, useEffect, useMemo } from 'react';
import {
  TrendingUp,
  Plus,
  Trash2,
  DollarSign,
  ArrowLeft,
  PieChart,
  ShieldCheck,
  CheckCircle2,
  X,
  Layers
} from 'lucide-react';
import {
  NetWorthItem,
  getNetWorthItems,
  insertNetWorthItem,
  deleteNetWorthItem,
  getTodayDateString
} from '../data/downbase';

interface NetWorthTabProps {
  onNavigateTab?: (tabId: string) => void;
  onGoBack?: () => void;
}

export const NetWorthTab: React.FC<NetWorthTabProps> = ({
  onNavigateTab,
  onGoBack,
}) => {
  const [items, setItems] = useState<NetWorthItem[]>(() => getNetWorthItems());
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [formType, setFormType] = useState<'asset' | 'liability'>('asset');
  const [formName, setFormName] = useState<string>('');
  const [formCategory, setFormCategory] = useState<NetWorthItem['category']>('Cash & Checking');
  const [formValue, setFormValue] = useState<string>('');

  const refreshItems = () => {
    setItems(getNetWorthItems());
  };

  const assets = useMemo(() => items.filter((i) => i.type === 'asset'), [items]);
  const liabilities = useMemo(() => items.filter((i) => i.type === 'liability'), [items]);

  const totalAssets = useMemo(() => assets.reduce((s, i) => s + i.value, 0), [assets]);
  const totalLiabilities = useMemo(() => liabilities.reduce((s, i) => s + i.value, 0), [liabilities]);
  const netWorth = totalAssets - totalLiabilities;

  const liquidAssets = useMemo(() => {
    return assets
      .filter((i) => i.category === 'Cash & Checking' || i.category === 'High-Yield Savings')
      .reduce((s, i) => s + i.value, 0);
  }, [assets]);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(formValue);
    if (!formName.trim() || isNaN(val) || val <= 0) return;

    insertNetWorthItem({
      name: formName.trim(),
      type: formType,
      category: formCategory,
      value: val,
    });

    setFormName('');
    setFormValue('');
    setShowAddModal(false);
    refreshItems();
  };

  const handleDeleteItem = (id: string) => {
    deleteNetWorthItem(id);
    refreshItems();
  };

  const handleBack = () => {
    if (onGoBack) {
      onGoBack();
    } else if (onNavigateTab) {
      onNavigateTab('tracker');
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
          <span className="text-[10px] font-mono-numeric font-bold text-blue-600 dark:text-sky-400 uppercase tracking-widest">
            Wealth Ledger
          </span>
        </div>

        {/* Header Hero Banner */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-5 shadow-sm space-y-3 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-sky-400">
                <TrendingUp className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-[10px] font-mono-numeric font-extrabold uppercase tracking-widest text-blue-600 dark:text-sky-400">
                  Inbuilt Feature 8 · Downbase Table: Net_Worth
                </span>
                <h1 className="text-xl font-black text-black dark:text-white tracking-tight">
                  Net Worth Tracker
                </h1>
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-2 rounded-xl bg-black dark:bg-white text-white dark:text-black text-xs font-black flex items-center gap-1 shadow-md transition-all cursor-pointer hover:opacity-90 active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Add Item</span>
            </button>
          </div>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
            The ultimate benchmark of financial freedom. Calculates your true balance sheet by tracking what you own (Assets) minus what you owe (Liabilities).
          </p>
        </div>

        {/* Primary Net Worth Display */}
        <div className="bg-white text-slate-900 rounded-3xl p-5 shadow-2xl border border-slate-100 space-y-4 font-mono-numeric">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Net Worth
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
              netWorth >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
            }`}>
              {netWorth >= 0 ? 'Positive Wealth' : 'Debt Exceeds Assets'}
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <div className={`text-3xl sm:text-4xl font-black ${
              netWorth >= 0 ? 'text-slate-900' : 'text-rose-600'
            }`}>
              ${netWorth.toLocaleString()}
            </div>
            <div className="text-right text-xs text-slate-500 font-sans">
              Liquid: <strong className="font-mono-numeric text-slate-900">${liquidAssets.toLocaleString()}</strong>
            </div>
          </div>

          {/* Breakdown Grid */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
            <div className="p-3 bg-emerald-50/70 rounded-2xl border border-emerald-100">
              <span className="text-[10px] uppercase font-bold text-emerald-700 block">Total Assets</span>
              <span className="text-lg font-black text-emerald-800 block mt-0.5">
                +${totalAssets.toLocaleString()}
              </span>
              <span className="text-[10px] text-emerald-600 font-sans">{assets.length} items logged</span>
            </div>
            <div className="p-3 bg-rose-50/70 rounded-2xl border border-rose-100">
              <span className="text-[10px] uppercase font-bold text-rose-700 block">Total Liabilities</span>
              <span className="text-lg font-black text-rose-800 block mt-0.5">
                -${totalLiabilities.toLocaleString()}
              </span>
              <span className="text-[10px] text-rose-600 font-sans">{liabilities.length} debts logged</span>
            </div>
          </div>
        </div>

        {/* Assets Section */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-5 space-y-3 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <h3 className="text-sm font-bold text-black dark:text-white uppercase tracking-wider font-mono-numeric">
                Assets ({assets.length})
              </h3>
            </div>
            <span className="text-xs font-mono-numeric font-bold text-emerald-600 dark:text-emerald-400">
              ${totalAssets.toLocaleString()}
            </span>
          </div>

          {assets.length === 0 ? (
            <div className="py-6 text-center text-xs text-neutral-500 dark:text-neutral-400 space-y-2 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl p-4">
              <p>No assets recorded yet.</p>
              <button
                onClick={() => {
                  setFormType('asset');
                  setShowAddModal(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-bold transition-colors cursor-pointer"
              >
                + Add Checking / Savings / 401k
              </button>
            </div>
          ) : (
            <div className="space-y-2 font-mono-numeric">
              {assets.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/60 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-black dark:text-white block">{item.name}</span>
                    <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-sans">{item.category}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-black text-emerald-600 dark:text-emerald-400">+${item.value.toLocaleString()}</span>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="text-neutral-400 hover:text-rose-500 cursor-pointer p-1"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Liabilities Section */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-5 space-y-3 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <h3 className="text-sm font-bold text-black dark:text-white uppercase tracking-wider font-mono-numeric">
                Liabilities &amp; Debts ({liabilities.length})
              </h3>
            </div>
            <span className="text-xs font-mono-numeric font-bold text-rose-600 dark:text-rose-400">
              ${totalLiabilities.toLocaleString()}
            </span>
          </div>

          {liabilities.length === 0 ? (
            <div className="py-6 text-center text-xs text-neutral-500 dark:text-neutral-400 space-y-2 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl p-4">
              <p>No liabilities or debts recorded.</p>
              <button
                onClick={() => {
                  setFormType('liability');
                  setShowAddModal(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 text-xs font-bold transition-colors cursor-pointer"
              >
                + Add Card Balance / Loan
              </button>
            </div>
          ) : (
            <div className="space-y-2 font-mono-numeric">
              {liabilities.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/60 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-black dark:text-white block">{item.name}</span>
                    <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-sans">{item.category}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-black text-rose-600 dark:text-rose-400">-${item.value.toLocaleString()}</span>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="text-neutral-400 hover:text-rose-500 cursor-pointer p-1"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal: Add Net Worth Item */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-pop-in">
            <div className="w-full max-w-sm bg-white dark:bg-neutral-900 text-black dark:text-white rounded-3xl p-5 shadow-2xl border border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center justify-between mb-3 border-b border-neutral-200 dark:border-neutral-800 pb-2">
                <h3 className="text-base font-black text-black dark:text-white">Add Balance Sheet Item</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-neutral-400 hover:text-black dark:hover:text-white p-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Type Toggle: Asset vs Liability */}
              <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-xl mb-3 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => {
                    setFormType('asset');
                    setFormCategory('Cash & Checking');
                  }}
                  className={`py-2 rounded-lg transition-colors cursor-pointer ${
                    formType === 'asset'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Asset (You Own)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFormType('liability');
                    setFormCategory('Credit Cards');
                  }}
                  className={`py-2 rounded-lg transition-colors cursor-pointer ${
                    formType === 'liability'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Liability (You Owe)
                </button>
              </div>

              <form onSubmit={handleAddItem} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Account / Item Name</label>
                  <input
                    type="text"
                    required
                    placeholder={formType === 'asset' ? 'e.g. High-Yield Savings Account' : 'e.g. Primary Credit Card'}
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-sky-500 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-sky-500 text-slate-900"
                  >
                    {formType === 'asset' ? (
                      <>
                        <option value="Cash & Checking">Cash &amp; Checking</option>
                        <option value="High-Yield Savings">High-Yield Savings</option>
                        <option value="Investments / 401k">Investments / 401k</option>
                        <option value="Real Estate">Real Estate</option>
                        <option value="Vehicles">Vehicles</option>
                        <option value="Other">Other Asset</option>
                      </>
                    ) : (
                      <>
                        <option value="Credit Cards">Credit Cards</option>
                        <option value="Auto Loans">Auto Loans</option>
                        <option value="Student Loans">Student Loans</option>
                        <option value="Mortgage">Mortgage</option>
                        <option value="Other">Other Debt</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Current Value / Balance ($)</label>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    required
                    placeholder="e.g. 5200"
                    value={formValue}
                    onChange={(e) => setFormValue(e.target.value)}
                    className="w-full px-3 py-2 text-base font-bold font-mono-numeric rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-sky-500 text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-2.5 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold cursor-pointer"
                  >
                    Save to Downbase
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
