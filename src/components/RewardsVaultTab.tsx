import React, { useState, useEffect, useMemo } from 'react';
import {
  Award,
  Plus,
  Trash2,
  DollarSign,
  Gift,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Plane,
  CreditCard,
  X,
  ArrowLeft
} from 'lucide-react';
import {
  RewardProgramRecord,
  getRewardPrograms,
  insertRewardProgram,
  deleteRewardProgram
} from '../data/downbase';

interface RewardsVaultTabProps {
  onNavigateTab?: (tabId: string) => void;
  onGoBack?: () => void;
  isEmbedded?: boolean;
}

export const RewardsVaultTab: React.FC<RewardsVaultTabProps> = ({
  onNavigateTab,
  onGoBack,
  isEmbedded = false
}) => {
  const [programs, setPrograms] = useState<RewardProgramRecord[]>([]);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // Form state
  const [cardName, setCardName] = useState<string>('');
  const [rewardType, setRewardType] = useState<RewardProgramRecord['reward_type']>('Cash Back ($)');
  const [balance, setBalance] = useState<string>('');
  const [centsPerPoint, setCentsPerPoint] = useState<string>('1.0');
  const [expirationDate, setExpirationDate] = useState<string>('');

  const refreshPrograms = () => {
    setPrograms(getRewardPrograms());
  };

  useEffect(() => {
    refreshPrograms();
  }, []);

  // Compute live cash value across all reward balances
  const totalCashValue = useMemo(() => {
    return programs.reduce((sum, p) => {
      const pts = Number(p.balance) || 0;
      if (p.reward_type === 'Cash Back ($)') {
        return sum + pts;
      }
      const val = (pts * (Number(p.cents_per_point) || 1.0)) / 100;
      return sum + val;
    }, 0);
  }, [programs]);

  const handleAddProgram = (e: React.FormEvent) => {
    e.preventDefault();
    const balNum = parseFloat(balance);
    if (!cardName.trim() || isNaN(balNum) || balNum < 0) return;

    insertRewardProgram({
      card_name: cardName.trim(),
      reward_type: rewardType,
      balance: balNum,
      cents_per_point: parseFloat(centsPerPoint) || 1.0,
      expiration_date: expirationDate.trim(),
    });

    setCardName('');
    setBalance('');
    setCentsPerPoint('1.0');
    setExpirationDate('');
    setShowAddModal(false);
    refreshPrograms();
  };

  const handleDelete = (id: string) => {
    deleteRewardProgram(id);
    refreshPrograms();
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
              <div className="p-2.5 rounded-2xl bg-amber-500/20 border border-amber-400/30 text-amber-400">
                <Award className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-[10px] font-mono-numeric font-black uppercase tracking-widest text-amber-400">
                  Feature 14 · Points & Cashback
                </span>
                <h1 className="text-xl font-black text-white tracking-tight">
                  Rewards Vault
                </h1>
              </div>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold font-mono-numeric shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Add Vault</span>
            </button>
          </div>
        )}

        {/* Total Rewards Value Hero Card */}
        <div className="bg-gradient-to-br from-slate-900 via-[#0A1931] to-amber-950 border border-amber-500/30 rounded-3xl p-5 shadow-2xl space-y-3 font-mono-numeric">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300">
              Total Real Cash Value
            </span>
            <span className="px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-400/30 text-amber-300 text-[10px] font-black">
              Unclaimed Liquidity
            </span>
          </div>

          <div>
            <span className="text-3xl font-black text-amber-400">
              ${totalCashValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-xs text-slate-400 ml-2">in rewards equity</span>
          </div>

          <p className="text-[11px] text-slate-300 leading-relaxed bg-white/5 p-2.5 rounded-xl border border-white/5">
            Credit card points and miles are real currency. Keep track of card balances and expiration dates so you never forfeit cash back.
          </p>
        </div>

        {/* Programs List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-mono-numeric font-bold uppercase text-slate-400">
              Tracked Reward Programs ({programs.length})
            </span>
            <span className="text-[11px] font-mono-numeric text-slate-500">
              Table: Reward_Programs
            </span>
          </div>

          {programs.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center text-slate-400">
              <Gift className="w-8 h-8 text-amber-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-white">No Reward Programs Logged</p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                Record points, miles, and cashback balances across your credit cards to track cash redemption value.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-0.5 font-mono-numeric">
              {programs.map((p) => {
                const dollarValue = p.reward_type === 'Cash Back ($)'
                  ? p.balance
                  : (p.balance * p.cents_per_point) / 100;

                return (
                  <div
                    key={p.id}
                    className="bg-white text-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-black text-slate-900">{p.card_name}</h4>
                        <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-amber-50 text-amber-700 font-bold uppercase">
                          {p.reward_type}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-slate-500">
                        <span>Balance: {p.balance.toLocaleString()} {p.reward_type === 'Cash Back ($)' ? '' : 'pts'}</span>
                        {p.reward_type !== 'Cash Back ($)' && (
                          <>
                            <span>·</span>
                            <span>{p.cents_per_point}¢/pt valuation</span>
                          </>
                        )}
                      </div>

                      {p.expiration_date && (
                        <div className="text-[10px] text-slate-400">
                          Expires: {p.expiration_date}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-base font-black text-amber-600">
                          ${dollarValue.toFixed(2)}
                        </span>
                        <span className="text-[10px] text-slate-400 block">cash value</span>
                      </div>

                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-1 text-slate-300 hover:text-rose-500 transition-colors cursor-pointer"
                        title="Delete Program"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-700 text-white rounded-3xl p-5 w-full max-w-sm shadow-2xl space-y-3 font-mono-numeric">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  <h3 className="font-black text-sm">Add Reward Program</h3>
                </div>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddProgram} className="space-y-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Card / Loyalty Program Name</label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="e.g. Sapphire Travel Vault / Cash Card"
                    required
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Reward Type</label>
                    <select
                      value={rewardType}
                      onChange={(e) => setRewardType(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                    >
                      <option value="Cash Back ($)">Cash Back ($)</option>
                      <option value="Travel Points">Travel Points</option>
                      <option value="Airline Miles">Airline Miles</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Current Balance</label>
                    <input
                      type="number"
                      step="any"
                      value={balance}
                      onChange={(e) => setBalance(e.target.value)}
                      placeholder="e.g. 45000"
                      required
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {rewardType !== 'Cash Back ($)' && (
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Valuation (cents per point)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={centsPerPoint}
                      onChange={(e) => setCentsPerPoint(e.target.value)}
                      placeholder="e.g. 1.25"
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400"
                    />
                  </div>
                )}

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Points Expiration (Optional)</label>
                  <input
                    type="date"
                    value={expirationDate}
                    onChange={(e) => setExpirationDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
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
                    className="flex-1 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl"
                  >
                    Save Rewards
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
