import React, { useState, useEffect } from 'react';
import { 
  Scissors, 
  Plus, 
  Trash2, 
  Calendar, 
  Zap, 
  AlertCircle, 
  CheckCircle2, 
  Tv, 
  Utensils, 
  Smartphone, 
  Sparkles,
  ArrowLeft,
  X
} from 'lucide-react';
import { 
  getSubscriptionsTable, 
  insertSubscription, 
  cancelSubscriptionRow, 
  SubscriptionRow, 
  SubscriptionCategory 
} from '../data/downbase';

interface SubScrubTabProps {
  onNavigateTab?: (tabId: string) => void;
  onGoBack?: () => void;
  isEmbedded?: boolean;
}

export const SubScrubTab: React.FC<SubScrubTabProps> = ({
  onNavigateTab,
  onGoBack,
  isEmbedded = false
}) => {
  const [subscriptions, setSubscriptions] = useState<SubscriptionRow[]>([]);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [savedToast, setSavedToast] = useState<{ name: string; amountYear: number } | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formAmount, setFormAmount] = useState('');
  const [formCategory, setFormCategory] = useState<SubscriptionCategory>('Entertainment');
  const [formRenewalDate, setFormRenewalDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });

  const refreshList = () => {
    setSubscriptions(getSubscriptionsTable());
  };

  useEffect(() => {
    refreshList();
  }, []);

  // Compute total monthly and yearly drain
  const monthlyTotal = subscriptions.reduce((sum, s) => sum + s.amount, 0);
  const yearlyTotal = Math.round(monthlyTotal * 12);

  // Cancel Handler: deletes row & triggers savings banner
  const handleCancelSub = (sub: SubscriptionRow) => {
    const annualSaved = Math.round(sub.amount * 12);
    cancelSubscriptionRow(sub.id);
    refreshList();

    // Show animation/toast
    setSavedToast({
      name: sub.name,
      amountYear: annualSaved
    });

    setTimeout(() => {
      setSavedToast(null);
    }, 4500);
  };

  // Add Handler
  const handleAddSub = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(formAmount);
    if (!formName.trim() || isNaN(parsedAmount) || parsedAmount <= 0) return;

    insertSubscription({
      name: formName.trim(),
      amount: parsedAmount,
      renewal_date: formRenewalDate,
      category: formCategory
    });

    setFormName('');
    setFormAmount('');
    setShowAddModal(false);
    refreshList();
  };

  const getCategoryIcon = (category: SubscriptionCategory) => {
    switch (category) {
      case 'Entertainment':
        return <Tv className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      case 'Food':
        return <Utensils className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      case 'App':
        return <Smartphone className="w-4 h-4 text-blue-600 dark:text-sky-400" />;
      default:
        return <Scissors className="w-4 h-4 text-rose-600 dark:text-rose-400" />;
    }
  };

  return (
    <div className={`w-full ${isEmbedded ? '' : 'min-h-full bg-white text-black dark:bg-black dark:text-white p-3 sm:p-4 pb-24'} select-none font-sans transition-colors`}>
      <div className="w-full max-w-md mx-auto space-y-4">

        {/* Header Bar */}
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
              <div className="p-2.5 rounded-2xl bg-rose-500/10 border border-rose-400/20 text-rose-600 dark:text-rose-400">
                <Scissors className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-[10px] font-mono-numeric font-extrabold uppercase tracking-widest text-rose-600 dark:text-rose-400">
                  Feature 4 · Downbase Table: Subscriptions
                </span>
                <h1 className="text-xl font-black text-black dark:text-white tracking-tight">
                  SubScrub
                </h1>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-2 rounded-xl bg-black dark:bg-white text-white dark:text-black text-xs font-black flex items-center gap-1.5 shadow-md transition-all cursor-pointer hover:opacity-90 active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add Sub</span>
            </button>
          </div>
        )}

        {isEmbedded && (
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
                <Scissors className="w-4 h-4" />
              </span>
              <h3 className="text-base font-black text-black dark:text-white">SubScrub - Subscription Killer</h3>
            </div>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="px-2.5 py-1.5 rounded-lg bg-black text-white dark:bg-white dark:text-black text-[11px] font-bold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Sub</span>
            </button>
          </div>
        )}

        {/* Cancellation Saved Banner / Animation Toast */}
        {savedToast && (
          <div className="bg-emerald-50 border border-emerald-300 dark:bg-emerald-950/80 dark:border-emerald-500/40 text-emerald-900 dark:text-emerald-200 rounded-2xl p-4 shadow-xl flex items-center justify-between animate-pop-in">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/60 rounded-xl">
                <Zap className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono-numeric font-black tracking-wider text-emerald-700 dark:text-emerald-300">
                  Cancelled {savedToast.name}
                </span>
                <h4 className="text-sm font-black">
                  You just saved ${savedToast.amountYear}/year!
                </h4>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSavedToast(null)}
              className="text-neutral-500 hover:text-black dark:hover:text-white cursor-pointer p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* TOP TOTAL CARD: "You spend $87/mo on subscriptions = $1044/year" */}
        <div className="bg-white dark:bg-neutral-900 text-black dark:text-white rounded-3xl p-5 shadow-sm border border-neutral-200 dark:border-neutral-800 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono-numeric font-black uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Subscription Drain
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-[10px] font-black font-mono-numeric border border-rose-200 dark:border-rose-800">
              {subscriptions.length} Active Services
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-black dark:text-white tracking-tight leading-tight">
            You spend <span className="text-blue-600 dark:text-sky-400 font-mono-numeric">${monthlyTotal}</span>/mo on subscriptions = <span className="text-rose-600 dark:text-rose-400 font-mono-numeric">${yearlyTotal}</span>/year
          </h2>

          <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 font-mono-numeric">
            <span>Monthly Run-rate: ${monthlyTotal.toFixed(2)}</span>
            <span>5-Year Cost: ${(yearlyTotal * 5).toLocaleString()}</span>
          </div>
        </div>

        {/* LIST ALL SUBS: with icon, amount, renewal_date, and Cancel button */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-mono-numeric font-bold uppercase text-neutral-500 dark:text-neutral-400">
              Active Recurring Subscriptions ({subscriptions.length})
            </span>
            <span className="text-[11px] font-mono-numeric text-neutral-400">
              Tap Cancel to eliminate
            </span>
          </div>

          <div className="space-y-2 max-h-[380px] overflow-y-auto pr-0.5">
            {subscriptions.length === 0 ? (
              <div className="bg-neutral-50 dark:bg-neutral-900 rounded-2xl p-6 text-center text-neutral-500 dark:text-neutral-400 shadow-sm border border-neutral-200 dark:border-neutral-800">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-sm font-bold text-black dark:text-white">Zero Subscriptions Left!</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">You scrubbed all recurring memberships clean.</p>
              </div>
            ) : (
              subscriptions.map((sub) => {
                const subYearly = Math.round(sub.amount * 12);

                return (
                  <div
                    key={sub.id}
                    className="bg-white dark:bg-neutral-900 text-black dark:text-white rounded-2xl p-3.5 sm:p-4 shadow-xs border border-neutral-200 dark:border-neutral-800 flex items-center justify-between transition-all hover:border-black dark:hover:border-white"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                        {getCategoryIcon(sub.category)}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-black text-black dark:text-white">{sub.name}</h4>
                          <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-bold uppercase">
                            {sub.category}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-[11px] text-neutral-500 dark:text-neutral-400 font-mono-numeric mt-0.5">
                          <span>Renews: {sub.renewal_date}</span>
                          <span>·</span>
                          <span className="text-neutral-400">${subYearly}/yr</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-base font-black font-mono-numeric text-black dark:text-white">
                        ${sub.amount.toFixed(2)}<span className="text-xs font-normal text-neutral-400">/mo</span>
                      </span>

                      <button
                        type="button"
                        onClick={() => handleCancelSub(sub)}
                        className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-500 text-rose-600 hover:text-white dark:bg-rose-950/60 dark:text-rose-300 dark:hover:bg-rose-600 dark:hover:text-white text-xs font-black transition-colors cursor-pointer border border-rose-200 dark:border-rose-800 flex items-center gap-1"
                        title={`Cancel ${sub.name} & save $${subYearly}/year`}
                      >
                        <Scissors className="w-3 h-3" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* TIP AT BOTTOM */}
        {monthlyTotal > 100 ? (
          <div className="bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 text-amber-800 dark:text-amber-200 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <p className="text-xs font-semibold leading-relaxed">
              Cancel 2 to save $500/year. Your recurring subscriptions exceed $100/mo. Cutting the bottom 2 lowest-used services frees immediate liquid cash for high-interest debt payoffs.
            </p>
          </div>
        ) : (
          <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-3.5 text-neutral-600 dark:text-neutral-300 text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-sky-400 shrink-0" />
            <span>Monthly subscriptions are streamlined under $100. Keep reviewing trial dates regularly.</span>
          </div>
        )}

        {/* Modal: + Add Subscription */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-pop-in">
            <div className="w-full max-w-sm bg-white dark:bg-neutral-900 text-black dark:text-white rounded-3xl p-5 shadow-2xl border border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center justify-between mb-4 border-b border-neutral-200 dark:border-neutral-800 pb-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                    <Scissors className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-black dark:text-white">Add Subscription</h3>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400">Saves to Downbase Table: Subscriptions</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="p-1 rounded-full text-neutral-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddSub} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    Subscription Name (e.g. Streaming, Music, Gym)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Streaming Video"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-black dark:text-white focus:outline-hidden focus:border-black dark:focus:border-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                      Monthly Cost ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      required
                      placeholder="15.99"
                      value={formAmount}
                      onChange={(e) => setFormAmount(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-black dark:text-white font-mono-numeric focus:outline-hidden focus:border-black dark:focus:border-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                      Category
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as SubscriptionCategory)}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-black dark:text-white focus:outline-hidden focus:border-black dark:focus:border-white"
                    >
                      <option value="Entertainment">Entertainment</option>
                      <option value="Food">Food</option>
                      <option value="App">App</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    Renewal Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formRenewalDate}
                    onChange={(e) => setFormRenewalDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-black dark:text-white font-mono-numeric focus:outline-hidden focus:border-black dark:focus:border-white"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-xs font-bold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-black text-white dark:bg-white dark:text-black text-xs font-black shadow-md transition-colors cursor-pointer hover:opacity-90 active:scale-95"
                  >
                    Save Subscription
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
