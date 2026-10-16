import React, { useState, useEffect, useMemo } from 'react';
import {
  CreditCard,
  Plus,
  Trash2,
  DollarSign,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  X,
  ArrowLeft,
  Percent,
  Edit3
} from 'lucide-react';
import { CreditCardAccount } from '../types/credit';

interface UtilizationMonitorTabProps {
  onNavigateTab?: (tabId: string) => void;
  onGoBack?: () => void;
  isEmbedded?: boolean;
}

const STORAGE_KEY_UTIL_CARDS = 'chidoniq_utilization_standalone_cards_clean_v10';

export const UtilizationMonitorTab: React.FC<UtilizationMonitorTabProps> = ({
  onNavigateTab,
  onGoBack,
  isEmbedded = false
}) => {
  const [cards, setCards] = useState<CreditCardAccount[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_UTIL_CARDS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  });

  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [editBalance, setEditBalance] = useState<string>('');

  // Form
  const [name, setName] = useState<string>('');
  const [balance, setBalance] = useState<string>('');
  const [creditLimit, setCreditLimit] = useState<string>('');
  const [statementDay, setStatementDay] = useState<string>('15');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_UTIL_CARDS, JSON.stringify(cards));
    } catch {}
  }, [cards]);

  // Calculations
  const totalBalance = useMemo(() => cards.reduce((s, c) => s + c.balance, 0), [cards]);
  const totalLimit = useMemo(() => cards.reduce((s, c) => s + c.creditLimit, 0), [cards]);
  const aggregateRatio = totalLimit > 0 ? (totalBalance / totalLimit) * 100 : 0;

  // Target paydowns
  const target30Balance = Math.floor(totalLimit * 0.29);
  const target10Balance = Math.floor(totalLimit * 0.09);
  const target3Balance = Math.floor(totalLimit * 0.029);

  const paydownTo30 = Math.max(0, totalBalance - target30Balance);
  const paydownTo10 = Math.max(0, totalBalance - target10Balance);

  const getTierBadge = (ratio: number) => {
    if (ratio <= 3) return { label: 'Peak Zone (< 3%)', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' };
    if (ratio <= 9) return { label: 'Prime Zone (< 9%)', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' };
    if (ratio <= 29) return { label: 'Safe Zone (< 30%)', color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/30' };
    if (ratio <= 49) return { label: 'Warning Tier (30-49%)', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' };
    return { label: 'Scoring Penalty (50%+)', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/30' };
  };

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    const bal = parseFloat(balance) || 0;
    const lim = parseFloat(creditLimit);
    if (!name.trim() || isNaN(lim) || lim <= 0) return;

    const newCard: CreditCardAccount = {
      id: `card_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim(),
      bank: 'Revolving Issuer',
      balance: bal,
      creditLimit: lim,
      apr: 24.99,
      statementClosingDay: parseInt(statementDay, 10) || 15,
      paymentDueDay: 12,
      isPaidForStatement: false,
    };

    setCards((prev) => [...prev, newCard]);
    setName('');
    setBalance('');
    setCreditLimit('');
    setShowAddModal(false);
  };

  const handleUpdateBalance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCardId) return;
    const newBal = parseFloat(editBalance);
    if (isNaN(newBal) || newBal < 0) return;

    setCards((prev) =>
      prev.map((c) => (c.id === editingCardId ? { ...c, balance: newBal } : c))
    );
    setEditingCardId(null);
    setEditBalance('');
  };

  const handleDelete = (id: string) => {
    setCards((prev) => prev.filter((c) => c.id !== id));
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
              <div className="p-2.5 rounded-2xl bg-sky-500/20 border border-sky-400/30 text-sky-400">
                <Percent className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-[10px] font-mono-numeric font-black uppercase tracking-widest text-sky-400">
                  Feature 16 · Revolving Ratio Engine
                </span>
                <h1 className="text-xl font-black text-white tracking-tight">
                  Utilization Monitor
                </h1>
              </div>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold font-mono-numeric shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Add Card</span>
            </button>
          </div>
        )}

        {/* Aggregate Hero Card */}
        <div className="bg-gradient-to-br from-slate-900 via-[#0A1931] to-sky-950 border border-sky-500/30 rounded-3xl p-5 shadow-2xl space-y-3 font-mono-numeric">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300">
              Aggregate Revolving Utilization
            </span>
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-black border ${getTierBadge(aggregateRatio).bg} ${getTierBadge(aggregateRatio).color}`}>
              {getTierBadge(aggregateRatio).label}
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <div>
              <span className={`text-3xl font-black ${
                aggregateRatio > 30 ? 'text-[#FF4D4D]' : 'text-sky-300'
              }`}>
                {aggregateRatio.toFixed(1)}%
              </span>
              <span className="text-xs text-slate-400 ml-2">
                (${totalBalance.toLocaleString()} / ${totalLimit.toLocaleString()})
              </span>
            </div>
            <span className="text-xs text-slate-300 font-bold">
              ${Math.max(0, totalLimit - totalBalance).toLocaleString()} credit available
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-2.5 rounded-full transition-all duration-500 ${
                aggregateRatio <= 9 ? 'bg-emerald-400' : aggregateRatio <= 29 ? 'bg-sky-400' : 'bg-rose-500'
              }`}
              style={{ width: `${Math.min(100, aggregateRatio)}%` }}
            />
          </div>

          {/* Target Paydown Advices */}
          {paydownTo30 > 0 && (
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between">
              <span>Pay down <strong>${paydownTo30.toLocaleString()}</strong> to cross under 30%</span>
              <span className="font-bold text-[10px] bg-amber-500/20 px-1.5 py-0.5 rounded-md">+15 to +25 Pts</span>
            </div>
          )}
        </div>

        {/* Card Accounts List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-mono-numeric font-bold uppercase text-slate-400">
              Active Revolving Cards ({cards.length})
            </span>
            <span className="text-[11px] font-mono-numeric text-slate-500">
              Downbase Revolving Ledger
            </span>
          </div>

          {cards.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center text-slate-400">
              <CreditCard className="w-8 h-8 text-sky-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-white">No Revolving Cards Added</p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                Add your credit card balances and credit limits to track revolving ratio tiers and calculate optimal paydowns.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-0.5 font-mono-numeric">
              {cards.map((card) => {
                const ratio = card.creditLimit > 0 ? (card.balance / card.creditLimit) * 100 : 0;
                const badge = getTierBadge(ratio);

                return (
                  <div
                    key={card.id}
                    className="bg-white text-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-black text-slate-900">{card.name}</h4>
                          <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-slate-100 text-slate-700 font-bold uppercase">
                            Day {card.statementClosingDay} Close
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500">
                          Limit: ${card.creditLimit.toLocaleString()}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className={`text-base font-black ${ratio > 30 ? 'text-[#FF4D4D]' : 'text-slate-900'}`}>
                          {ratio.toFixed(1)}%
                        </span>
                        <span className="text-[11px] text-slate-400 block">
                          ${card.balance.toLocaleString()} owed
                        </span>
                      </div>
                    </div>

                    {/* Bar */}
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          ratio <= 9 ? 'bg-emerald-500' : ratio <= 29 ? 'bg-sky-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${Math.min(100, ratio)}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                      <button
                        onClick={() => {
                          setEditingCardId(card.id);
                          setEditBalance(card.balance.toString());
                        }}
                        className="text-xs text-sky-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Update Balance</span>
                      </button>

                      <button
                        onClick={() => handleDelete(card.id)}
                        className="p-1 text-slate-300 hover:text-rose-500 transition-colors cursor-pointer"
                        title="Delete Card"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Update Balance Modal */}
        {editingCardId && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-700 text-white rounded-3xl p-5 w-full max-w-sm shadow-2xl space-y-3 font-mono-numeric">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="font-bold text-sm">Update Card Balance</h3>
                <button onClick={() => setEditingCardId(null)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateBalance} className="space-y-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Current Balance ($)</label>
                  <input
                    type="number"
                    step="any"
                    value={editBalance}
                    onChange={(e) => setEditBalance(e.target.value)}
                    placeholder="e.g. 450"
                    autoFocus
                    required
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-base focus:outline-none focus:border-sky-400"
                  />
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setEditingCardId(null)}
                    className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl"
                  >
                    Save Balance
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Card Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-700 text-white rounded-3xl p-5 w-full max-w-sm shadow-2xl space-y-3 font-mono-numeric">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-sky-400" />
                  <h3 className="font-black text-sm">Add Revolving Card</h3>
                </div>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddCard} className="space-y-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Card Nickname</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Premier Cash Rewards"
                    required
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-sky-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Credit Limit ($)</label>
                    <input
                      type="number"
                      step="any"
                      value={creditLimit}
                      onChange={(e) => setCreditLimit(e.target.value)}
                      placeholder="e.g. 5000"
                      required
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-sky-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Current Balance ($)</label>
                    <input
                      type="number"
                      step="any"
                      value={balance}
                      onChange={(e) => setBalance(e.target.value)}
                      placeholder="e.g. 850"
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-sky-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Statement Close Day of Month (1-31)</label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={statementDay}
                    onChange={(e) => setStatementDay(e.target.value)}
                    placeholder="15"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-sky-400"
                  />
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
                    className="flex-1 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl"
                  >
                    Save Card
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
