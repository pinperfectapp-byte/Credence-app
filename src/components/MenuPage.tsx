import React, { useState, useMemo } from 'react';
import { LegalModalTab } from './FooterLegalModal';
import { DownbaseFooter } from './DownbaseFooter';
import { 
  ShieldCheck, 
  ArrowDownCircle, 
  FlaskConical, 
  Trash2, 
  Flame, 
  Compass, 
  Settings, 
  ChevronRight, 
  Wallet, 
  Scale, 
  PiggyBank, 
  Clock, 
  TrendingDown, 
  Calendar, 
  Award, 
  Layers, 
  Percent, 
  ShieldAlert,
  Info,
  ShoppingCart,
  TrendingUp,
  SlidersHorizontal,
  HelpCircle,
  CheckCircle2,
  FileText,
  Target,
  Zap,
  DollarSign,
  PieChart,
  Search,
  KeyRound
} from 'lucide-react';

interface MenuPageProps {
  onNavigate: (pageId: string) => void;
  onOpenLegal?: (tab: LegalModalTab) => void;
}

type FeatureCategory = 'All' | 'Featured' | 'Credit & Score' | 'Budget & Debt' | 'Dispute & Legal' | 'Wealth & Savings';

interface FeatureDirectoryItem {
  id: string;
  name: string;
  desc: string;
  category: FeatureCategory;
  badge?: string;
  icon: React.ReactNode;
}

export const MenuPage: React.FC<MenuPageProps> = ({ 
  onNavigate, 
  onOpenLegal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<FeatureCategory>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 5 Hero Cards strictly matching the dashboard color scheme
  const heroCards = [
    {
      id: 'bills',
      title: 'BillGuard',
      subtitle: 'Bill tracking & alerts',
      icon: <ShieldCheck className="w-7 h-7 text-emerald-400 stroke-[2.2]" />,
      badge: 'Alerts',
    },
    {
      id: 'debt_destroyer',
      title: 'DebtDestroyer',
      subtitle: 'Payoff plans & strategy',
      icon: <ArrowDownCircle className="w-7 h-7 text-[#38BDF8] stroke-[2.2]" />,
      badge: 'Snowball',
    },
    {
      id: 'score_boost',
      title: 'ScoreBoost Lab',
      subtitle: 'Credit tips & simulations',
      icon: <FlaskConical className="w-7 h-7 text-cyan-400 stroke-[2.2]" />,
      badge: '+35 Pts',
    },
    {
      id: 'sub_scrub',
      title: 'SubScrub',
      subtitle: 'Cancel subscriptions',
      icon: <Trash2 className="w-7 h-7 text-teal-400 stroke-[2.2]" />,
      badge: 'Cancel Leak',
    },
    {
      id: 'money_streak',
      title: 'MoneyStreak',
      subtitle: 'Daily savings streak • 7 days',
      icon: <Flame className="w-7 h-7 text-amber-400 stroke-[2.2] fill-amber-400/20" />,
      badge: 'Active Streak',
    },
  ];

  // Complete Catalog of ALL Credence Features
  const allFeaturesCatalog: FeatureDirectoryItem[] = [
    {
      id: 'auth',
      name: 'Encrypted Vault Account',
      desc: 'Email & Password authentication and sovereign vault database synchronization',
      category: 'Featured',
      badge: 'Encrypted Vault',
      icon: <KeyRound className="w-4 h-4 text-sky-400" />,
    },
    {
      id: 'grocery_saver',
      name: 'Grocery Card Saver',
      desc: 'Cashback optimizer comparing 12 supermarket cards up to 6% back',
      category: 'Featured',
      badge: '6% Cash Back',
      icon: <ShoppingCart className="w-4 h-4 text-amber-400" />,
    },
    {
      id: 'statement_optimizer',
      name: 'AZEO Statement Date Optimizer',
      desc: 'All-Zero-Except-One algorithm to report <3% utilization on bureaus',
      category: 'Credit & Score',
      badge: 'AZEO Algorithm',
      icon: <Calendar className="w-4 h-4 text-[#38BDF8]" />,
    },
    {
      id: 'track',
      name: 'Credit Score Trajectory Graph',
      desc: 'Interactive 300-850 historical curve with 750 target goal projection',
      category: 'Credit & Score',
      badge: 'Curve Math',
      icon: <TrendingUp className="w-4 h-4 text-emerald-400" />,
    },
    {
      id: 'compare',
      name: 'Card Compare & APR Refinance',
      desc: 'Calculate real-time dollar savings dropping 29% APR to 0% promo rates',
      category: 'Budget & Debt',
      badge: 'Slash APR',
      icon: <DollarSign className="w-4 h-4 text-emerald-400" />,
    },
    {
      id: 'bureau_disputes',
      name: 'FCRA Bureau Dispute Generator',
      desc: 'Federal audit dispute letters (609, 611, 623) under 15 U.S.C. § 1681i',
      category: 'Dispute & Legal',
      badge: 'FCRA § 1681',
      icon: <Scale className="w-4 h-4 text-amber-400" />,
    },
    {
      id: 'legal_toolkit',
      name: 'Pay-for-Delete & Debt Letters',
      desc: 'Certified collector negotiation pacts and statute of limitations auditor',
      category: 'Dispute & Legal',
      badge: 'Statutory Pack',
      icon: <FileText className="w-4 h-4 text-amber-400" />,
    },
    {
      id: 'score_checker',
      name: 'Tri-Bureau Score Checker',
      desc: 'Side-by-side Experian, TransUnion, and Equifax score calibration',
      category: 'Credit & Score',
      badge: 'Tri-Bureau',
      icon: <Award className="w-4 h-4 text-[#38BDF8]" />,
    },
    {
      id: 'credit_builder',
      name: 'Credit Builder for Beginners',
      desc: 'Step-by-step roadmap: secured cards, AU piggybacking, credit-builder loans',
      category: 'Credit & Score',
      badge: 'Step-by-Step',
      icon: <Compass className="w-4 h-4 text-[#38BDF8]" />,
    },
    {
      id: 'loan_comparison',
      name: 'Auto & Personal Loan Analyzer',
      desc: 'Amortization schedule and credit score tier interest cost calculator',
      category: 'Budget & Debt',
      badge: 'Amortization',
      icon: <Percent className="w-4 h-4 text-teal-400" />,
    },
    {
      id: 'credit_myths',
      name: 'Credit Myths & Scoring Rules Quiz',
      desc: 'Interactive 8-question algorithm quiz explaining closing accounts & utilization',
      category: 'Credit & Score',
      badge: 'Mastery Quiz',
      icon: <HelpCircle className="w-4 h-4 text-indigo-400" />,
    },
    {
      id: 'action_plan',
      name: 'Personalized Score Action Plan',
      desc: 'Algorithmic checklist of the 3 fastest mathematical score improvements',
      category: 'Credit & Score',
      badge: 'Plan Check',
      icon: <Target className="w-4 h-4 text-[#38BDF8]" />,
    },
    {
      id: 'budget',
      name: 'Budget Tracker Ledger',
      desc: 'Zero-based budgeting envelopes with local downbase ledger tracking',
      category: 'Budget & Debt',
      badge: 'Downbase',
      icon: <PieChart className="w-4 h-4 text-emerald-400" />,
    },
    {
      id: 'debt_destroyer',
      name: 'Debt Destroyer (Avalanche / Snowball)',
      desc: 'Payoff date projections and total interest saved under Avalanche ranking',
      category: 'Budget & Debt',
      badge: 'Avalanche',
      icon: <ArrowDownCircle className="w-4 h-4 text-[#38BDF8]" />,
    },
    {
      id: 'bills',
      name: 'BillGuard Payment Watchdog',
      desc: 'Schedule recurring bills and maintain 100% on-time payment history',
      category: 'Budget & Debt',
      badge: '35% Factor',
      icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
    },
    {
      id: 'score_boost',
      name: 'ScoreBoost Lab Simulator',
      desc: 'What-if test lab: simulate paying debts, opening trade lines, or inquiries',
      category: 'Credit & Score',
      badge: 'Simulation',
      icon: <FlaskConical className="w-4 h-4 text-cyan-400" />,
    },
    {
      id: 'sub_scrub',
      name: 'SubScrub Leak Stopper',
      desc: 'Unused subscription audit and annual dollar waste calculator',
      category: 'Budget & Debt',
      badge: 'Audit Leak',
      icon: <Trash2 className="w-4 h-4 text-teal-400" />,
    },
    {
      id: 'money_streak',
      name: 'MoneyStreak Savings Habit',
      desc: 'Daily consecutive financial check-in streak and milestones',
      category: 'Wealth & Savings',
      badge: 'Gamified',
      icon: <Flame className="w-4 h-4 text-amber-400" />,
    },
    {
      id: 'emergency_vault',
      name: 'Emergency Fund Vault',
      desc: '3-to-6 month bare-bones expense buffer calculator and funding meter',
      category: 'Wealth & Savings',
      badge: 'Safety Net',
      icon: <PiggyBank className="w-4 h-4 text-emerald-400" />,
    },
    {
      id: 'net_worth',
      name: 'Net Worth Balance Sheet',
      desc: 'Real-time assets vs liabilities balance sheet and net worth growth',
      category: 'Wealth & Savings',
      badge: 'Balance Sheet',
      icon: <TrendingUp className="w-4 h-4 text-[#38BDF8]" />,
    },
    {
      id: 'inquiries_tracker',
      name: 'Credit Inquiry Shield',
      desc: 'FCRA 2-year drop-off timer and scoring impact tracker for hard pulls',
      category: 'Credit & Score',
      badge: '2-Yr Dropoff',
      icon: <ShieldAlert className="w-4 h-4 text-indigo-400" />,
    },
    {
      id: 'savings_goals',
      name: 'Multi-Vault Savings Goals',
      desc: 'Target savings milestones with auto-calculated weekly savings pace',
      category: 'Wealth & Savings',
      badge: 'Goals',
      icon: <Wallet className="w-4 h-4 text-teal-400" />,
    },
    {
      id: 'dispute_tracker',
      name: 'FCRA 30-Day Dispute Clock',
      desc: '15 U.S.C. § 1681i 30-day investigation deadline timer for credit bureaus',
      category: 'Dispute & Legal',
      badge: '30 Days',
      icon: <Clock className="w-4 h-4 text-amber-400" />,
    },
    {
      id: 'interest_bleed',
      name: 'APR Interest Bleed Monitor',
      desc: 'Calculate exact daily and monthly dollar loss to credit card APR interest',
      category: 'Budget & Debt',
      badge: 'Daily Bleed',
      icon: <TrendingDown className="w-4 h-4 text-rose-400" />,
    },
    {
      id: 'cash_flow',
      name: 'Cash Flow Forecaster',
      desc: '30-day forward liquidity calendar to prevent bank overdraft fees',
      category: 'Budget & Debt',
      badge: '30-Day Flow',
      icon: <Calendar className="w-4 h-4 text-blue-400" />,
    },
    {
      id: 'rewards_tracker',
      name: 'Reward Points & Cashback Vault',
      desc: 'Track cash back, miles, points and expiration schedules in one place',
      category: 'Wealth & Savings',
      badge: 'Rewards',
      icon: <Award className="w-4 h-4 text-yellow-400" />,
    },
    {
      id: 'no_spend_tracker',
      name: 'No-Spend Days Calendar',
      desc: 'Calendar of zero-discretionary spending days and impulse money saved',
      category: 'Budget & Debt',
      badge: 'Habit',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
    },
    {
      id: 'utilization_tracker',
      name: 'Revolving Utilization Monitor',
      desc: 'Per-card and aggregate utilization heatmap to keep balances under 9%',
      category: 'Credit & Score',
      badge: 'Under 9%',
      icon: <Percent className="w-4 h-4 text-cyan-400" />,
    },
    {
      id: 'sinking_funds',
      name: 'Sinking Funds Allocator',
      desc: 'Reserve pools for irregular expenses like auto insurance and taxes',
      category: 'Wealth & Savings',
      badge: 'Funds',
      icon: <Layers className="w-4 h-4 text-violet-400" />,
    },
  ];

  const filteredFeatures = useMemo(() => {
    return allFeaturesCatalog.filter((f) => {
      const matchesCategory = selectedCategory === 'All' || f.category === selectedCategory || (selectedCategory === 'Featured' && ['grocery_saver', 'statement_optimizer', 'track', 'tracker', 'budget'].includes(f.id));
      const matchesSearch = searchQuery.trim() === '' || 
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        f.desc.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="w-full space-y-4 pb-8 select-none font-sans text-slate-100">
      
      {/* ========================================================================= */}
      {/* 2-COLUMN GRID OF HERO CARDS (Dashboard Color Palette) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 gap-3">
        {heroCards.map((card) => (
          <button
            key={card.id}
            type="button"
            onClick={() => onNavigate(card.id)}
            className="bg-[#0C182F] border border-[rgba(56,120,210,0.25)] hover:border-[#38BDF8]/60 rounded-3xl p-4.5 shadow-xl flex flex-col items-center justify-center text-center feature-interactive-card transition-all cursor-pointer group min-h-[140px]"
          >
            {/* Centered Large Icon Well */}
            <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-[#102244] border border-[rgba(56,120,210,0.2)] group-hover:scale-105 transition-transform shadow-inner">
              {card.icon}
            </div>

            {/* Title */}
            <h3 className="text-sm font-black text-white mt-2.5 tracking-tight group-hover:text-[#38BDF8] transition-colors">
              {card.title}
            </h3>

            {/* Subtitle */}
            <p className="text-[11px] font-medium text-[#8FA0C0] mt-0.5 leading-tight">
              {card.subtitle}
            </p>
          </button>
        ))}

        {/* 6th Slot in Grid: Tracker Hub Engine */}
        <button
          type="button"
          onClick={() => onNavigate('tracker')}
          className="bg-[#0C182F] border border-[rgba(56,120,210,0.25)] hover:border-[#38BDF8]/60 rounded-3xl p-4.5 shadow-xl flex flex-col items-center justify-center text-center feature-interactive-card transition-all cursor-pointer group min-h-[140px]"
        >
          <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-[#102244] border border-[rgba(56,120,210,0.2)] text-[#38BDF8] group-hover:scale-105 transition-transform shadow-inner">
            <Compass className="w-7 h-7 stroke-[2.2]" />
          </div>
          <h3 className="text-sm font-black text-white mt-2.5 tracking-tight group-hover:text-[#38BDF8] transition-colors">
            Tracker Hub
          </h3>
          <p className="text-[11px] font-medium text-[#8FA0C0] mt-0.5 leading-tight">
            All 17 Inbuilt Engines
          </p>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* FEATURED SPOTLIGHT: Grocery Card Saver */}
      {/* ========================================================================= */}
      <div 
        onClick={() => onNavigate('grocery_saver')}
        className="bg-[#0C182F] border border-[rgba(56,120,210,0.25)] hover:border-amber-400/50 rounded-3xl p-4.5 shadow-xl flex items-center justify-between gap-3 feature-interactive-card transition-all cursor-pointer"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-400/30 text-amber-400 flex items-center justify-center shrink-0">
            <ShoppingCart className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-white">
                Grocery Card Saver
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold font-mono-numeric">
                Up to 6% Back
              </span>
            </div>
            <p className="text-xs text-[#8FA0C0] mt-0.5 leading-snug">
              Compare 12 US supermarket credit cards &amp; stop losing money to debit cards
            </p>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-[#102244] text-[#38BDF8] shrink-0 border border-[rgba(56,120,210,0.2)]">
          <ChevronRight className="w-4 h-4 stroke-[2.5]" />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* COMPLETE ALL-IN-ONE EXTENDED FINANCIAL ENGINES DIRECTORY */}
      {/* ========================================================================= */}
      <div className="bg-[#0C182F] border border-[rgba(56,120,210,0.25)] rounded-3xl p-5 shadow-xl space-y-3.5">
        
        {/* Header & Feature Count */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#38BDF8]" />
            <h4 className="text-xs font-black text-white uppercase tracking-wider font-mono-numeric">
              All Financial Engines ({allFeaturesCatalog.length})
            </h4>
          </div>
          <span className="text-[10px] font-mono-numeric font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
            100% Client-Side
          </span>
        </div>

        {/* Search Input for Quick Access */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3.5 top-3 text-[#8FA0C0]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search all tools (e.g. Grocery, Dispute, Budget, AZEO...)"
            className="w-full pl-9 pr-3 py-2 bg-[#102244] border border-[rgba(56,120,210,0.25)] rounded-xl text-xs font-semibold text-white placeholder:text-[#8FA0C0] focus:outline-none focus:ring-2 focus:ring-[#38BDF8]"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar text-[11px] font-bold">
          {(['All', 'Featured', 'Credit & Score', 'Budget & Debt', 'Dispute & Legal', 'Wealth & Savings'] as FeatureCategory[]).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg shrink-0 transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#2563EB] text-white shadow-xs border border-[#38BDF8]/50'
                  : 'bg-[#102244] hover:bg-[#152e5c] text-[#8FA0C0] hover:text-white border border-transparent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* List of Features */}
        <div className="space-y-1.5 pt-1 divide-y divide-[rgba(56,120,210,0.15)] max-h-[460px] overflow-y-auto pr-1">
          {filteredFeatures.map((tool) => (
            <button
              key={tool.id}
              type="button"
              onClick={() => onNavigate(tool.id)}
              className="w-full pt-2.5 pb-2 flex items-center justify-between text-left hover:bg-[#102244]/60 px-2.5 rounded-xl transition-all cursor-pointer feature-interactive-card group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#102244] border border-[rgba(56,120,210,0.2)] shrink-0 group-hover:scale-105 transition-transform">
                  {tool.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-white group-hover:text-[#38BDF8] transition-colors">
                      {tool.name}
                    </span>
                    {tool.badge && (
                      <span className="text-[9px] font-mono-numeric font-bold px-1.5 py-0.2 rounded-md bg-[#102244] text-[#8FA0C0] border border-[rgba(56,120,210,0.2)]">
                        {tool.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-[#8FA0C0] line-clamp-1">
                    {tool.desc}
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#38BDF8] transition-colors shrink-0" />
            </button>
          ))}

          {filteredFeatures.length === 0 && (
            <div className="py-6 text-center text-xs text-[#8FA0C0]">
              No tools matched &quot;{searchQuery}&quot;. Try another search term.
            </div>
          )}
        </div>
      </div>

      {/* Downbase Footer Features Section */}
      <div className="pt-2">
        <DownbaseFooter
          onOpenLegal={onOpenLegal || (() => {})}
          onNavigateTab={onNavigate}
        />
      </div>

    </div>
  );
};
