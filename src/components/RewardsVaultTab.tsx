import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Plus, 
  Trash2, 
  ArrowLeft, 
  Gift, 
  DollarSign, 
  Sparkles, 
  X, 
  HelpCircle,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { 
  getRewardPrograms, 
  saveRewardProgram, 
  deleteRewardProgram, 
  RewardProgramRow 
} from '../data/downbase';

interface RewardsVaultTabProps {
  onNavigateTab?: (tabId: string) => void;
  onGoBack?: () => void;
  isEmbedded?: boolean;
}

export const RewardsVaultTab: React.FC<RewardsVaultTabProps> = ({
  onNavigateTab: _onNavigateTab,
  onGoBack,
  isEmbedded = false
}) => {
  const [programs, setPrograms] = useState<RewardProgramRow[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [cardName, setCardName] = useState('');
  const [rewardType, setRewardType] = useState<'Cash Back ($)' | 'Travel Points' | 'Airline Miles'>('Cash Back ($)');
  const [balance, setBalance] = useState('');
  const [centsPerPoint, setCentsPerPoint] = useState('1.0');
  const [expirationDate, setExpirationDate] = useState('');

  const refreshPrograms = () => {
    setPrograms(getRewardPrograms());
  };

  useEffect(() => {
    refreshPrograms();
  }, []);

  // Compute Total Cash Value across all rewards programs
  const totalCashValue = programs.reduce((sum, p) => {
    if (p.reward_type === 'Cash Back ($)') {
      return sum + p.balance;
    }
    return sum + (p.balance * (p.cents_per_point || 1.0)) / 100;
  }, 0);

  const handleAddProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardName.trim() || !balance) return;

    saveRewardProgram({
      card_name: cardName.trim(),
      reward_type: rewardType,
      balance: parseFloat(balance) || 0,
      cents_per_point: rewardType === 'Cash Back ($)' ? 1.0 : parseFloat(centsPerPoint) || 1.0,
      expiration_date: expirationDate || undefined
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
    <div className={`w-full ${isEmbedded ? '' : 'min-h-full bg-white text-black dark:bg-black dark:text-white p-3 sm:p-4 pb-28'} select-none font-sans transition-colors`}>
      <div className="w-full max-w-md mx-auto space-y-4">

        {/* Top Header */}
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
              <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-400/30 text-amber-600 dark:text-amber-400">
                <Award className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-[10px] font-mono-numeric font-black uppercase tracking-widest text-amber-600 dark:text-amber-400">
                  Feature 14 · Points &amp; Cashback
                </span>
                <h1 className="text-xl font-black text-black dark:text-white tracking-tight">
                  Rewards Vault
                </h1>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="px-3 py-1.5 rounded-xl bg-black text-white dark:bg-white dark:text-black text-xs font-bold font-mono-numeric shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Add Vault</span>
            </button>
          </div>
        )}

        {/* Total Rewards Value Hero Card */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-5 shadow-sm space-y-3 font-mono-numeric text-black dark:text-white transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-600 dark:text-neutral-400">
              Total Real Cash Value
            </span>
            <span className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-[10px] font-black">
              Unclaimed Liquidity
            </span>
          </div>

          <div>
            <span className="text-3xl font-black text-amber-600 dark:text-amber-400">
              ${totalCashValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-xs text-neutral-500 dark:text-neutral-400 ml-2">in rewards equity</span>
          </div>

          <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-tight">
            Consolidates your credit card points, miles, and cashback. Points lose up to 15% value annually if left unredeemed.
          </p>
        </div>

        {/* Programs List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-mono-numeric font-bold uppercase text-neutral-500 dark:text-neutral-400">
              Tracked Reward Programs ({programs.length})
            </span>
            <span className="text-[11px] font-mono-numeric text-neutral-400">
              Table: Reward_Programs
            </span>
          </div>

          {programs.length === 0 ? (
            <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 text-center text-neutral-500 dark:text-neutral-400">
              <Gift className="w-8 h-8 text-amber-500 mx-auto mb-2" />
              <p className="text-sm font-bold text-black dark:text-white">No Reward Programs Logged</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-xs mx-auto">
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
                    className="bg-white dark:bg-neutral-900 text-black dark:text-white rounded-2xl p-4 shadow-xs border border-neutral-200 dark:border-neutral-800 flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-black text-black dark:text-white">{p.card_name}</h4>
                        <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-bold uppercase border border-amber-200 dark:border-amber-800">
                          {p.reward_type}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-neutral-600 dark:text-neutral-400">
                        <span>Balance: {p.balance.toLocaleString()} {p.reward_type === 'Cash Back ($)' ? '' : 'pts'}</span>
                        {p.reward_type !== 'Cash Back ($)' && (
                          <>
                            <span>·</span>
                            <span>{p.cents_per_point}¢/pt valuation</span>
                          </>
                        )}
                      </div>

                      {p.expiration_date && (
                        <div className="text-[10px] text-neutral-400">
                          Expires: {p.expiration_date}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-base font-black text-amber-600 dark:text-amber-400">
                          ${dollarValue.toFixed(2)}
                        </span>
                        <span className="text-[10px] text-neutral-400 block">cash value</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDelete(p.id)}
                        className="p-1 text-neutral-400 hover:text-rose-500 transition-colors cursor-pointer"
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
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-pop-in">
            <div className="bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 text-black dark:text-white rounded-3xl p-5 w-full max-w-sm shadow-2xl space-y-3 font-mono-numeric">
              <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-2">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  <h3 className="font-black text-sm text-black dark:text-white">Add Reward Program</h3>
                </div>
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)} 
                  className="text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddProgram} className="space-y-3">
                <div>
                  <label className="text-xs text-neutral-700 dark:text-neutral-300 block mb-1">Card / Loyalty Program Name</label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="e.g. Sapphire Travel Vault / Cash Card"
                    required
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-black dark:text-white text-sm focus:outline-none focus:border-black dark:focus:border-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-neutral-700 dark:text-neutral-300 block mb-1">Reward Type</label>
                    <select
                      value={rewardType}
                      onChange={(e) => setRewardType(e.target.value as any)}
                      className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-black dark:text-white text-xs focus:outline-none focus:border-black dark:focus:border-white"
                    >
                      <option value="Cash Back ($)">Cash Back ($)</option>
                      <option value="Travel Points">Travel Points</option>
                      <option value="Airline Miles">Airline Miles</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-neutral-700 dark:text-neutral-300 block mb-1">Current Balance</label>
                    <input
                      type="number"
                      step="any"
                      value={balance}
                      onChange={(e) => setBalance(e.target.value)}
                      placeholder="e.g. 45000"
                      required
                      className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-black dark:text-white text-sm focus:outline-none focus:border-black dark:focus:border-white"
                    />
                  </div>
                </div>

                {rewardType !== 'Cash Back ($)' && (
                  <div>
                    <label className="text-xs text-neutral-700 dark:text-neutral-300 block mb-1">Valuation (cents per point)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={centsPerPoint}
                      onChange={(e) => setCentsPerPoint(e.target.value)}
                      placeholder="e.g. 1.25"
                      className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-black dark:text-white text-sm focus:outline-none focus:border-black dark:focus:border-white"
                    />
                  </div>
                )}

                <div>
                  <label className="text-xs text-neutral-700 dark:text-neutral-300 block mb-1">Points Expiration (Optional)</label>
                  <input
                    type="date"
                    value={expirationDate}
                    onChange={(e) => setExpirationDate(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-black dark:text-white text-xs focus:outline-none focus:border-black dark:focus:border-white"
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-200 text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-black hover:opacity-90 text-white dark:bg-white dark:text-black text-xs font-bold rounded-xl cursor-pointer"
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
