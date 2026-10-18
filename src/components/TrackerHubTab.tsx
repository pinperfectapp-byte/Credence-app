import React, { useState } from 'react';
import {
  Wallet,
  ShieldCheck,
  Target,
  Zap,
  Scissors,
  Flame,
  ArrowRight,
  Layers,
  Database,
  Calendar,
  DollarSign,
  TrendingUp,
  Percent,
  Award,
  Scale,
  Clock,
  ShieldAlert,
  PiggyBank,
  CheckCircle2,
  ChevronRight,
  SlidersHorizontal,
  Compass,
  ShoppingCart
} from 'lucide-react';
import { TrackerIcon } from './TrackerIcon';
import { DownbaseFooter } from './DownbaseFooter';
import {
  getBudgetSettingsTable,
  getDailySpendingTable,
  getBillsTable,
  getDebtsTable,
  getSubscriptionsTable,
  getChallengesTable,
  getEmergencyVault,
  getNetWorthItems,
  getInquiriesTable,
  getSavingsGoalsTable,
  getDisputeCasesTable,
  getInterestBleedAccounts,
  getCashFlowEvents,
  getRewardPrograms,
  getNoSpendDays,
  getSinkingFundsTable,
  getStreakCount
} from '../data/downbase';

interface TrackerHubTabProps {
  onNavigateTab?: (tabId: string) => void;
  userScore?: number;
}

type CategoryFilter = 'All' | 'Budget & Cash' | 'Debt & Payoff' | 'Credit & Disputes' | 'Wealth & Savings';

interface TrackerFeatureItem {
  id: string;
  num: number;
  name: string;
  category: CategoryFilter;
  tableTag: string;
  desc: string;
  icon: React.ReactNode;
  accentColor: string;
  badgeBg: string;
  getLiveStatus: () => string;
}

export const TrackerHubTab: React.FC<TrackerHubTabProps> = ({
  onNavigateTab,
  userScore = 680
}) => {
  const [selectedFilter, setSelectedFilter] = useState<CategoryFilter>('All');

  const handleLaunchFeature = (featureId: string) => {
    if (onNavigateTab) {
      onNavigateTab(featureId);
    } else {
      window.dispatchEvent(new CustomEvent('chidoniq-navigate-tab', { detail: featureId }));
      window.dispatchEvent(new CustomEvent('credence-navigate-tab', { detail: featureId }));
    }
  };

  // Full catalog of the 17 enhanced & new inbuilt features
  const trackerFeatures: TrackerFeatureItem[] = [
    // 1. Budget Tracker
    {
      id: 'budget',
      num: 1,
      name: 'Budget Tracker',
      category: 'Budget & Cash',
      tableTag: 'Budget_Settings & Daily_Spending',
      desc: 'Monthly income category envelopes (Rent, Food, Transport, Fun, Bills) & daily spending ledger with live limit meters.',
      icon: <Wallet className="w-5 h-5 text-sky-400" />,
      accentColor: 'border-sky-500/30 hover:border-sky-400',
      badgeBg: 'bg-sky-500/10 text-sky-400 border-sky-400/20',
      getLiveStatus: () => {
        const settings = getBudgetSettingsTable();
        const spending = getDailySpendingTable();
        if (settings.length > 0) return `$${settings[settings.length - 1].income.toLocaleString()} Budget · ${spending.length} Entries`;
        return 'Ready to Configure';
      }
    },
    // 2. BillGuard
    {
      id: 'bills',
      num: 2,
      name: 'BillGuard - Never Miss a Bill',
      category: 'Budget & Cash',
      tableTag: 'Bills',
      desc: 'Upcoming due dates timeline, urgent 3-day due soon alerts, and 1-tap paid status tracking.',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
      accentColor: 'border-emerald-500/30 hover:border-emerald-400',
      badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-400/20',
      getLiveStatus: () => {
        const b = getBillsTable();
        const unpaid = b.filter((x) => !x.is_paid).length;
        if (b.length > 0) return `${unpaid} Unpaid Bills · ${b.length} Scheduled`;
        return '0 Bills Logged';
      }
    },
    // 3. DebtDestroyer
    {
      id: 'debt_destroyer',
      num: 3,
      name: 'DebtDestroyer - Snowball Payoff',
      category: 'Debt & Payoff',
      tableTag: 'Debts',
      desc: 'Mathematical debt snowball order (smallest to largest balance) with +$50 acceleration countdown.',
      icon: <Flame className="w-5 h-5 text-amber-400" />,
      accentColor: 'border-amber-500/30 hover:border-amber-400',
      badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-400/20',
      getLiveStatus: () => {
        const d = getDebtsTable();
        if (d.length > 0) {
          const total = d.reduce((s, x) => s + x.total_owed, 0);
          return `${d.length} Debts · $${total.toLocaleString()} Owed`;
        }
        return '0 Active Debts';
      }
    },
    // 4. ScoreBoost Lab
    {
      id: 'score_boost',
      num: 4,
      name: 'ScoreBoost Lab - What-If Simulator',
      category: 'Credit & Disputes',
      tableTag: 'Score_Simulations',
      desc: 'Simulate score impacts: paying $200 off balance (+15 pts), missing payment (-80 pts), or keeping under 30%.',
      icon: <Zap className="w-5 h-5 text-teal-400" />,
      accentColor: 'border-teal-500/30 hover:border-teal-400',
      badgeBg: 'bg-teal-500/10 text-teal-400 border-teal-400/20',
      getLiveStatus: () => 'Interactive Scoring Simulator'
    },
    // 5. SubScrub
    {
      id: 'sub_scrub',
      num: 5,
      name: 'SubScrub - Subscription Killer',
      category: 'Budget & Cash',
      tableTag: 'Subscriptions',
      desc: 'Audit recurring streaming and app subscriptions, annual money leaks, and 1-click cancel script generator.',
      icon: <Scissors className="w-5 h-5 text-purple-400" />,
      accentColor: 'border-purple-500/30 hover:border-purple-400',
      badgeBg: 'bg-purple-500/10 text-purple-400 border-purple-400/20',
      getLiveStatus: () => {
        const s = getSubscriptionsTable();
        if (s.length > 0) {
          const yr = Math.round(s.reduce((sum, x) => sum + x.amount, 0) * 12);
          return `${s.length} Subs · $${yr}/yr Total`;
        }
        return '0 Subscriptions';
      }
    },
    // 6. MoneyStreak
    {
      id: 'money_streak',
      num: 6,
      name: 'MoneyStreak - 30-Day Habit Challenge',
      category: 'Wealth & Savings',
      tableTag: 'Challenges',
      desc: '30-day sovereign financial mindfulness challenge. Build daily money habits with zero cloud telemetry.',
      icon: <Award className="w-5 h-5 text-orange-400" />,
      accentColor: 'border-orange-500/30 hover:border-orange-400',
      badgeBg: 'bg-orange-500/10 text-orange-400 border-orange-400/20',
      getLiveStatus: () => {
        const c = getChallengesTable();
        const streak = getStreakCount(c);
        return `Current Streak: ${streak} Days Active`;
      }
    },
    // 7. Emergency Fund Vault
    {
      id: 'emergency_vault',
      num: 7,
      name: 'Emergency Fund Vault',
      category: 'Wealth & Savings',
      tableTag: 'Emergency_Vault',
      desc: '3, 6, or 9-month essential expense runway calculator, deposit/withdraw ledger, and safety tier indicator.',
      icon: <ShieldAlert className="w-5 h-5 text-emerald-400" />,
      accentColor: 'border-emerald-500/30 hover:border-emerald-400',
      badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-400/20',
      getLiveStatus: () => {
        const v = getEmergencyVault();
        if (v.monthly_essential_expenses > 0) {
          const mos = (v.current_saved / v.monthly_essential_expenses).toFixed(1);
          return `$${v.current_saved.toLocaleString()} Saved · ${mos} Mos Covered`;
        }
        return `$${v.current_saved.toLocaleString()} Saved · Configure Runway`;
      }
    },
    // 8. Net Worth Tracker
    {
      id: 'net_worth',
      num: 8,
      name: 'Net Worth Ledger',
      category: 'Wealth & Savings',
      tableTag: 'Net_Worth',
      desc: 'Real-time assets vs liabilities balance sheet, liquid cash breakdown, and net worth milestone growth.',
      icon: <TrendingUp className="w-5 h-5 text-sky-400" />,
      accentColor: 'border-sky-500/30 hover:border-sky-400',
      badgeBg: 'bg-sky-500/10 text-sky-400 border-sky-400/20',
      getLiveStatus: () => {
        const items = getNetWorthItems();
        if (items.length > 0) {
          const a = items.filter((i) => i.type === 'asset').reduce((s, i) => s + i.value, 0);
          const l = items.filter((i) => i.type === 'liability').reduce((s, i) => s + i.value, 0);
          return `Net Worth: $${(a - l).toLocaleString()} · ${items.length} Items`;
        }
        return 'Ready to Map Portfolio';
      }
    },
    // 9. Credit Inquiry Shield
    {
      id: 'inquiries_tracker',
      num: 9,
      name: 'Credit Inquiry Shield',
      category: 'Credit & Disputes',
      tableTag: 'Credit_Inquiries',
      desc: 'Track hard credit inquiries with 12-month scoring impact and 24-month FCRA statutory drop-off countdown.',
      icon: <ShieldAlert className="w-5 h-5 text-indigo-400" />,
      accentColor: 'border-indigo-500/30 hover:border-indigo-400',
      badgeBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-400/20',
      getLiveStatus: () => {
        const inq = getInquiriesTable();
        return `${inq.length} Logged Hard Pulls`;
      }
    },
    // 10. Multi-Vault Savings Goals
    {
      id: 'savings_goals',
      num: 10,
      name: 'Multi-Vault Savings Goals',
      category: 'Wealth & Savings',
      tableTag: 'Savings_Goals',
      desc: 'Target savings milestones with auto-calculated monthly/weekly required savings to hit goal dates.',
      icon: <PiggyBank className="w-5 h-5 text-teal-400" />,
      accentColor: 'border-teal-500/30 hover:border-teal-400',
      badgeBg: 'bg-teal-500/10 text-teal-400 border-teal-400/20',
      getLiveStatus: () => {
        const g = getSavingsGoalsTable();
        if (g.length > 0) {
          const total = g.reduce((s, x) => s + x.current_amount, 0);
          return `${g.length} Goals Active · $${total.toLocaleString()} Saved`;
        }
        return '0 Savings Goals';
      }
    },
    // 11. FCRA 30-Day Dispute Clock
    {
      id: 'dispute_tracker',
      num: 11,
      name: 'FCRA 30-Day Dispute Clock',
      category: 'Credit & Disputes',
      tableTag: 'Dispute_Cases',
      desc: '15 U.S.C. § 1681i 30-day statutory countdown timer for credit bureau certified mail investigation responses.',
      icon: <Scale className="w-5 h-5 text-amber-400" />,
      accentColor: 'border-amber-500/30 hover:border-amber-400',
      badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-400/20',
      getLiveStatus: () => {
        const c = getDisputeCasesTable();
        const active = c.filter((x) => x.status !== 'Deleted').length;
        return `${active} Active Dispute Clocks`;
      }
    },
    // 12. APR Interest Bleed Monitor
    {
      id: 'interest_bleed',
      num: 12,
      name: 'APR Interest Bleed Monitor',
      category: 'Debt & Payoff',
      tableTag: 'Interest_Bleed',
      desc: 'Calculates the exact dollars and cents lost every single day to compounding credit card APR interest.',
      icon: <TrendingUp className="w-5 h-5 text-rose-400" />,
      accentColor: 'border-rose-500/30 hover:border-rose-400',
      badgeBg: 'bg-rose-500/10 text-rose-400 border-rose-400/20',
      getLiveStatus: () => {
        const acc = getInterestBleedAccounts();
        if (acc.length > 0) {
          const daily = acc.reduce((s, x) => s + (x.balance * (x.apr / 100)) / 365, 0);
          return `$${daily.toFixed(2)} / Day Lost to APR`;
        }
        return '0 Balances Logged';
      }
    },
    // 13. Cash Flow Forecaster
    {
      id: 'cash_flow',
      num: 13,
      name: 'Cash Flow Forecaster',
      category: 'Budget & Cash',
      tableTag: 'Cash_Flow',
      desc: '30-day rolling cash inflow vs scheduled bills balance projection to prevent bank overdraft fees.',
      icon: <Calendar className="w-5 h-5 text-cyan-400" />,
      accentColor: 'border-cyan-500/30 hover:border-cyan-400',
      badgeBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-400/20',
      getLiveStatus: () => {
        const evts = getCashFlowEvents();
        return `${evts.length} Scheduled Cash Events`;
      }
    },
    // 14. Reward Points & Cashback Vault
    {
      id: 'rewards_tracker',
      num: 14,
      name: 'Reward Points & Cashback Vault',
      category: 'Wealth & Savings',
      tableTag: 'Reward_Programs',
      desc: 'Monitor credit card cash back, points, and miles with real dollar conversion and expiration tracking.',
      icon: <Award className="w-5 h-5 text-amber-400" />,
      accentColor: 'border-amber-500/30 hover:border-amber-400',
      badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-400/20',
      getLiveStatus: () => {
        const rew = getRewardPrograms();
        return `${rew.length} Reward Vaults`;
      }
    },
    // 15. No-Spend Days Calendar & Streak
    {
      id: 'no_spend_tracker',
      num: 15,
      name: 'No-Spend Days Calendar',
      category: 'Budget & Cash',
      tableTag: 'No_Spend_Days',
      desc: 'Interactive monthly calendar of zero-discretionary spending days and cumulative impulse dollars saved.',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
      accentColor: 'border-emerald-500/30 hover:border-emerald-400',
      badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-400/20',
      getLiveStatus: () => {
        const days = getNoSpendDays();
        return `${days.length} Total No-Spend Days`;
      }
    },
    // 16. Revolving Utilization Monitor
    {
      id: 'utilization_tracker',
      num: 16,
      name: 'Revolving Utilization Monitor',
      category: 'Credit & Disputes',
      tableTag: 'Revolving_Ledger',
      desc: 'Individual card & aggregate revolving credit utilization with target paydowns to cross under 30%.',
      icon: <Percent className="w-5 h-5 text-sky-400" />,
      accentColor: 'border-sky-500/30 hover:border-sky-400',
      badgeBg: 'bg-sky-500/10 text-sky-400 border-sky-400/20',
      getLiveStatus: () => 'Peak Scoring Zones (< 3% / < 9%)'
    },
    // 17. Sinking Funds Allocator
    {
      id: 'sinking_funds',
      num: 17,
      name: 'Sinking Funds Allocator',
      category: 'Budget & Cash',
      tableTag: 'Sinking_Funds',
      desc: 'Dedicated reserve pots for irregular annual expenses (auto insurance, property taxes, holidays).',
      icon: <Layers className="w-5 h-5 text-violet-400" />,
      accentColor: 'border-violet-500/30 hover:border-violet-400',
      badgeBg: 'bg-violet-500/10 text-violet-400 border-violet-400/20',
      getLiveStatus: () => {
        const f = getSinkingFundsTable();
        return `${f.length} Sinking Pools`;
      }
    },
    // 18. Grocery Card Saver
    {
      id: 'grocery_saver',
      num: 18,
      name: 'Grocery Card Saver',
      category: 'Budget & Cash',
      tableTag: 'Grocery_Rewards_12_Cards',
      desc: 'US supermarket cashback optimizer. Compares 12 credit cards (Amex Gold 4x, Blue Cash 6%, SavorOne 3%) against debit cards.',
      icon: <ShoppingCart className="w-5 h-5 text-amber-400" />,
      accentColor: 'border-amber-500/30 hover:border-amber-400',
      badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-400/20',
      getLiveStatus: () => '12 US Supermarket Cards Active'
    }
  ];

  const filteredFeatures = trackerFeatures.filter((f) => {
    if (selectedFilter === 'All') return true;
    return f.category === selectedFilter;
  });

  return (
    <div className="min-h-full bg-white text-black dark:bg-black dark:text-white p-3 sm:p-4 pb-28 select-none font-sans transition-colors">
      <div className="w-full max-w-md mx-auto space-y-4">

        {/* HERO BANNER: TRACKER HUB */}
        <div className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-3xl p-5 shadow-sm text-black dark:text-white relative overflow-hidden transition-colors">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-blue-600 dark:text-sky-400">
                <TrackerIcon className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-[10px] font-mono-numeric font-black uppercase tracking-widest text-blue-600 dark:text-sky-400">
                  Sovereign Engine · 17 Inbuilt Trackers
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-black dark:text-white tracking-tight">
                  Tracker Hub
                </h1>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-[10px] font-black font-mono-numeric border border-emerald-200 dark:border-emerald-800">
              100% PRIVATE
            </span>
          </div>

          <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed mt-1">
            All 17 Sovereign Financial Trackers listed vertically below. Each tool has its own dedicated page with pure local persistence and zero cloud tracking.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-800 text-center font-mono-numeric">
            <div className="p-2 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <span className="text-[9px] text-neutral-500 dark:text-neutral-400 block uppercase font-bold">Inbuilt Tools</span>
              <span className="text-sm font-black text-black dark:text-white">17 Engines</span>
            </div>
            <div className="p-2 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <span className="text-[9px] text-neutral-500 dark:text-neutral-400 block uppercase font-bold">Downbase</span>
              <span className="text-sm font-black text-blue-600 dark:text-sky-400">Zero Cloud</span>
            </div>
            <div className="p-2 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <span className="text-[9px] text-neutral-500 dark:text-neutral-400 block uppercase font-bold">Telemetry</span>
              <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">0% External</span>
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar text-[11px] font-mono-numeric font-bold">
          {(['All', 'Budget & Cash', 'Debt & Payoff', 'Credit & Disputes', 'Wealth & Savings'] as CategoryFilter[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedFilter(cat)}
              className={`px-3 py-1.5 rounded-xl shrink-0 transition-all cursor-pointer ${
                selectedFilter === cat
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs font-black'
                  : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* VERTICALLY ARRANGED LIST OF ALL TRACKER FEATURES */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-mono-numeric font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Available Trackers ({filteredFeatures.length})
            </span>
            <span className="text-[11px] font-mono-numeric text-neutral-400">
              Tap any tool to launch
            </span>
          </div>

          {filteredFeatures.map((feature) => (
            <div
              key={feature.id}
              onClick={() => handleLaunchFeature(feature.id)}
              className="bg-white dark:bg-black rounded-3xl p-5 shadow-sm border border-neutral-200 dark:border-neutral-800 hover:border-black dark:hover:border-white transition-all cursor-pointer space-y-2.5 text-black dark:text-white feature-interactive-card"
            >
              {/* Header row: Number, Icon, Title, Category */}
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 text-black dark:text-white shrink-0 border border-neutral-200 dark:border-neutral-800">
                    {feature.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-mono-numeric font-bold text-neutral-400 dark:text-neutral-500">
                        #{feature.num}
                      </span>
                      <h3 className="text-base font-extrabold text-black dark:text-white leading-tight">
                        {feature.name}
                      </h3>
                    </div>
                    <span className="text-[10px] font-semibold text-neutral-500 dark:text-neutral-400 block mt-0.5">
                      Downbase: {feature.tableTag}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 shrink-0">
                  {feature.category}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
                {feature.desc}
              </p>

              {/* Bottom row: Live Status & Clickable Action Button */}
              <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-[11px] text-neutral-700 dark:text-neutral-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-semibold">{feature.getLiveStatus()}</span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLaunchFeature(feature.id);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-black text-white dark:bg-white dark:text-black text-xs font-bold transition-all flex items-center gap-1 shadow-xs cursor-pointer active:scale-95"
                >
                  <span>Open Tracker</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Downbase Footer Features */}
        <div className="pt-4">
          <DownbaseFooter
            onOpenLegal={() => {}}
            onNavigateTab={onNavigateTab}
          />
        </div>

      </div>
    </div>
  );
};
