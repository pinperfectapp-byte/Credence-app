import React, { useState, useEffect, useMemo } from 'react';
import {
  Scissors,
  Plus,
  Trash2,
  Tv,
  Music,
  ShoppingBag,
  Smartphone,
  CheckCircle2,
  Calendar,
  AlertCircle,
  X,
  DollarSign,
  Zap,
  ArrowLeft
} from 'lucide-react';
import {
  SubscriptionRecord,
  SubscriptionCategory,
  getSubscriptionsTable,
  insertSubscription,
  deleteSubscription,
  getDateDaysFromNow
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
  const [subscriptions, setSubscriptions] = useState<SubscriptionRecord[]>([]);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  
  // Animation / Toast state for cancel
  const [savedToast, setSavedToast] = useState<{ amountYear: number; name: string } | null>(null);

  // Form State
  const [formName, setFormName] = useState<string>('');
  const [formAmount, setFormAmount] = useState<string>('');
  const [formRenewalDate, setFormRenewalDate] = useState<string>(getDateDaysFromNow(14));
  const [formCategory, setFormCategory] = useState<SubscriptionCategory>('Entertainment');

  const refreshSubscriptions = () => {
    setSubscriptions(getSubscriptionsTable());
  };

  useEffect(() => {
    refreshSubscriptions();
  }, []);

  // Top total calculation: SUM(amount) monthly and * 12 yearly
  const monthlyTotal = useMemo(() => {
    return subscriptions.reduce((sum, s) => sum + (Number(s.amount) || 0), 0);
  }, [subscriptions]);

  const yearlyTotal = useMemo(() => {
    return Math.round(monthlyTotal * 12);
  }, [monthlyTotal]);

  const handleCancelSub = (sub: SubscriptionRecord) => {
    const yearlySavings = Math.round(sub.amount * 12);
    deleteSubscription(sub.id);
    refreshSubscriptions();

    // Show animation: "You just saved $X/year"
    setSavedToast({ amountYear: yearlySavings, name: sub.name });
    setTimeout(() => {
      setSavedToast(null);
    }, 4000);
  };

  const handleAddSub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formAmount || Number(formAmount) <= 0) return;

    insertSubscription({
      name: formName.trim(),
      amount: parseFloat(formAmount),
      renewal_date: formRenewalDate,
      category: formCategory,
    });

    setFormName('');
    setFormAmount('');
    setFormRenewalDate(getDateDaysFromNow(14));
    setFormCategory('Entertainment');
    setShowAddModal(false);
    refreshSubscriptions();
  };

  const getCategoryIcon = (category: SubscriptionCategory) => {
    switch (category) {
      case 'Entertainment':
        return <Tv className="w-4 h-4 text-purple-500" />;
      case 'Food':
        return <ShoppingBag className="w-4 h-4 text-emerald-500" />;
      case 'App':
        return <Smartphone className="w-4 h-4 text-sky-500" />;
      default:
        return <DollarSign className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <div className={`w-full ${isEmbedded ? '' : 'min-h-full bg-[#0A1931] text-slate-100 p-3 sm:p-4 pb-24'} select-none`}>
      <div className="w-full max-w-md mx-auto space-y-4">

        {/* Header Bar */}
        {!isEmbedded && (
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2.5">
              {onGoBack && (
                <button
                  type="button"
                  onClick={onGoBack}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 transition-colors cursor-pointer"
                  title="Go Back"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              <div className="p-2.5 rounded-2xl bg-rose-500/10 border border-rose-400/20 text-rose-400">
                <Scissors className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-[10px] font-mono-numeric font-extrabold uppercase tracking-widest text-rose-400">
                  Feature 4 · Downbase Table: Subscriptions
                </span>
                <h1 className="text-xl font-black text-white tracking-tight">
                  SubScrub
                </h1>
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-2 rounded-xl bg-[#1E90FF] hover:bg-sky-500 text-white text-xs font-black flex items-center gap-1.5 shadow-lg shadow-sky-900/40 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add Sub</span>
            </button>
          </div>
        )}

        {isEmbedded && (
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400">
                <Scissors className="w-4 h-4" />
              </span>
              <h3 className="text-base font-black text-white">SubScrub - Subscription Killer</h3>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-2.5 py-1.5 rounded-lg bg-[#1E90FF] hover:bg-sky-500 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Sub</span>
            </button>
          </div>
        )}

        {/* Cancellation Saved Banner / Animation Toast */}
        {savedToast && (
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl p-4 shadow-xl border border-emerald-400 flex items-center justify-between animate-bounce duration-300">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-white/20 rounded-xl">
                <Zap className="w-5 h-5 text-amber-200" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono-numeric font-black tracking-wider text-emerald-200">
                  Cancelled {savedToast.name}
                </span>
                <h4 className="text-sm font-black">
                  You just saved ${savedToast.amountYear}/year!
                </h4>
              </div>
            </div>
            <button
              onClick={() => setSavedToast(null)}
              className="text-white/80 hover:text-white cursor-pointer p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* TOP TOTAL CARD: "You spend $87/mo on subscriptions = $1044/year" */}
        <div className="bg-white text-slate-900 rounded-3xl p-5 shadow-2xl border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono-numeric font-black uppercase tracking-wider text-slate-400">
              Subscription Drain
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-black font-mono-numeric border border-rose-100">
              {subscriptions.length} Active Services
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
            You spend <span className="text-[#1E90FF] font-mono-numeric">${monthlyTotal}</span>/mo on subscriptions = <span className="text-rose-600 font-mono-numeric">${yearlyTotal}</span>/year
          </h2>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono-numeric">
            <span>Monthly Run-rate: ${monthlyTotal.toFixed(2)}</span>
            <span>5-Year Cost: ${(yearlyTotal * 5).toLocaleString()}</span>
          </div>
        </div>

        {/* LIST ALL SUBS: with icon, amount, renewal_date, and Cancel button */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-mono-numeric font-bold uppercase text-slate-400">
              Active Recurring Subscriptions ({subscriptions.length})
            </span>
            <span className="text-[11px] font-mono-numeric text-slate-500">
              Tap Cancel to eliminate
            </span>
          </div>

          <div className="space-y-2 max-h-[380px] overflow-y-auto pr-0.5">
            {subscriptions.length === 0 ? (
              <div className="bg-white rounded-2xl p-6 text-center text-slate-500 shadow-sm border border-slate-100">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-800">Zero Subscriptions Left!</p>
                <p className="text-xs text-slate-400 mt-1">You scrubbed all recurring memberships clean.</p>
              </div>
            ) : (
              subscriptions.map((sub) => {
                const subYearly = Math.round(sub.amount * 12);

                return (
                  <div
                    key={sub.id}
                    className="bg-white text-slate-900 rounded-2xl p-3.5 sm:p-4 shadow-sm border border-slate-100 flex items-center justify-between transition-all hover:border-slate-300"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        {getCategoryIcon(sub.category)}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-black text-slate-900">{sub.name}</h4>
                          <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-slate-100 text-slate-600 font-bold uppercase">
                            {sub.category}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono-numeric mt-0.5">
                          <span>Renews: {sub.renewal_date}</span>
                          <span>·</span>
                          <span className="text-slate-400">${subYearly}/yr</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-base font-black font-mono-numeric text-slate-900">
                        ${sub.amount.toFixed(2)}<span className="text-xs font-normal text-slate-400">/mo</span>
                      </span>

                      {/* Swipe or button: "Cancel" -> deletes row and shows animation "You just saved $X/year" */}
                      <button
                        onClick={() => handleCancelSub(sub)}
                        className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-500 text-rose-600 hover:text-white text-xs font-black transition-colors cursor-pointer border border-rose-200 hover:border-rose-500 flex items-center gap-1"
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

        {/* TIP AT BOTTOM: If SUM > 100, show "Cancel 2 to save $500/year" */}
        {monthlyTotal > 100 ? (
          <div className="bg-amber-500/10 border border-amber-400/30 rounded-2xl p-4 text-amber-300 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
            <p className="text-xs font-bold leading-relaxed">
              Cancel 2 to save $500/year. Your recurring subscriptions exceed $100/mo. Cutting the bottom 2 lowest-used services frees immediate liquid cash for high-interest debt payoffs.
            </p>
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 text-slate-300 text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
            <span>Monthly subscriptions are streamlined under $100. Keep reviewing trial dates regularly.</span>
          </div>
        )}

        {/* Modal: + Add Subscription */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in duration-150">
            <div className="w-full max-w-sm bg-white text-slate-900 rounded-3xl p-5 shadow-2xl border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-rose-100 text-rose-600">
                    <Scissors className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">Add Subscription</h3>
                    <p className="text-[11px] text-slate-500">Saves to Downbase Table: Subscriptions</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddSub} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Subscription Name (e.g. Streaming, Music, Gym)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Streaming Video"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#1E90FF] text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
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
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#1E90FF] text-slate-900 font-mono-numeric"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Category
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as SubscriptionCategory)}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#1E90FF] text-slate-900"
                    >
                      <option value="Entertainment">Entertainment</option>
                      <option value="Food">Food</option>
                      <option value="App">App</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Renewal Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formRenewalDate}
                    onChange={(e) => setFormRenewalDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#1E90FF] text-slate-900 font-mono-numeric"
                  />
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
