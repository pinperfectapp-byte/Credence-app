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
  ShoppingCart,
  TrendingUp,
  FileText,
  DollarSign,
  Search,
  KeyRound,
  Share2,
  Check,
  CheckCircle2,
  Globe
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
  const [copiedShare, setCopiedShare] = useState<boolean>(false);

  const handleShareApp = async () => {
    const shareData = {
      title: 'CHIDONIQ - Free Credit Score & Budget Tracker USA',
      text: 'Track your 742 credit score, $1,250 money left, bills, debt payoff, and subscriptions 100% privately with zero SSN on CHIDONIQ!',
      url: 'https://chidoniq.com.ng',
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText('https://chidoniq.com.ng');
        setCopiedShare(true);
        setTimeout(() => setCopiedShare(false), 3000);
      }
    } catch {
      try {
        await navigator.clipboard.writeText('https://chidoniq.com.ng');
        setCopiedShare(true);
        setTimeout(() => setCopiedShare(false), 3000);
      } catch {}
    }
  };

  // 5 Hero Cards
  const heroCards = [
    {
      id: 'bills',
      title: 'BillGuard',
      subtitle: 'Bill tracking & alerts',
      icon: <ShieldCheck className="w-7 h-7 text-emerald-600 dark:text-emerald-400 stroke-[2.2]" />,
      badge: 'Alerts',
    },
    {
      id: 'debt_destroyer',
      title: 'DebtDestroyer',
      subtitle: 'Payoff plans & strategy',
      icon: <ArrowDownCircle className="w-7 h-7 text-blue-600 dark:text-blue-400 stroke-[2.2]" />,
      badge: 'Snowball',
    },
    {
      id: 'score_boost',
      title: 'ScoreBoost Lab',
      subtitle: 'Credit tips & simulations',
      icon: <FlaskConical className="w-7 h-7 text-cyan-600 dark:text-cyan-400 stroke-[2.2]" />,
      badge: '+35 Pts',
    },
    {
      id: 'sub_scrub',
      title: 'SubScrub',
      subtitle: 'Cancel subscriptions',
      icon: <Trash2 className="w-7 h-7 text-teal-600 dark:text-teal-400 stroke-[2.2]" />,
      badge: 'Cancel Leak',
    },
    {
      id: 'money_streak',
      title: 'MoneyStreak',
      subtitle: 'Daily savings streak',
      icon: <Flame className="w-7 h-7 text-amber-500 fill-amber-400/20 stroke-[2.2]" />,
      badge: 'Active Streak',
    },
  ];

  // Complete Catalog of ALL CHIDONIQ Features
  const allFeaturesCatalog: FeatureDirectoryItem[] = [
    {
      id: 'auth',
      name: 'CHIDONIQ Vault Account',
      desc: 'Email & Password authentication and sovereign vault database synchronization',
      category: 'Featured',
      badge: 'Encrypted Vault',
      icon: <KeyRound className="w-4 h-4 text-sky-500" />,
    },
    {
      id: 'grocery_saver',
      name: 'Grocery Card Saver',
      desc: 'Cashback optimizer comparing 12 supermarket cards up to 6% back',
      category: 'Featured',
      badge: '6% Cash Back',
      icon: <ShoppingCart className="w-4 h-4 text-amber-500" />,
    },
    {
      id: 'statement_optimizer',
      name: 'AZEO Statement Date Optimizer',
      desc: 'All-Zero-Except-One algorithm to report <3% utilization on bureaus',
      category: 'Credit & Score',
      badge: 'AZEO Algorithm',
      icon: <Calendar className="w-4 h-4 text-blue-500" />,
    },
    {
      id: 'track',
      name: 'Credit Score Trajectory Graph',
      desc: 'Interactive 300-850 historical curve with 750 target goal projection',
      category: 'Credit & Score',
      badge: 'Curve Math',
      icon: <TrendingUp className="w-4 h-4 text-emerald-500" />,
    },
    {
      id: 'compare',
      name: 'Card Compare & APR Refinance',
      desc: 'Calculate real-time dollar savings dropping 29% APR to 0% promo rates',
      category: 'Budget & Debt',
      badge: 'Slash APR',
      icon: <DollarSign className="w-4 h-4 text-emerald-500" />,
    },
    {
      id: 'bureau_disputes',
      name: 'FCRA Bureau Dispute Generator',
      desc: 'Federal audit dispute letters (609, 611, 623) under 15 U.S.C. § 1681i',
      category: 'Dispute & Legal',
      badge: 'FCRA § 1681',
      icon: <Scale className="w-4 h-4 text-amber-500" />,
    },
    {
      id: 'legal_toolkit',
      name: 'Pay-for-Delete & Debt Letters',
      desc: 'Certified collector negotiation pacts and statute of limitations auditor',
      category: 'Dispute & Legal',
      badge: 'Statutory Pack',
      icon: <FileText className="w-4 h-4 text-amber-500" />,
    },
    {
      id: 'score_checker',
      name: 'Tri-Bureau Score Checker',
      desc: 'Side-by-side Experian, TransUnion, and Equifax score calibration',
      category: 'Credit & Score',
      badge: 'Tri-Bureau',
      icon: <Award className="w-4 h-4 text-blue-500" />,
    },
    {
      id: 'credit_builder',
      name: 'Credit Builder for Beginners',
      desc: 'Step-by-step roadmap: secured cards, AU piggybacking, credit-builder loans',
      category: 'Credit & Score',
      badge: 'Step-by-Step',
      icon: <Compass className="w-4 h-4 text-blue-500" />,
    },
    {
      id: 'loan_comparison',
      name: 'Auto & Personal Loan Analyzer',
      desc: 'Amortization schedule and credit score tier interest cost calculator',
      category: 'Budget & Debt',
      badge: 'Amortization',
      icon: <Percent className="w-4 h-4 text-teal-500" />,
    },
    {
      id: 'emergency_vault',
      name: 'Emergency Fund Reserve Planner',
      desc: '3-to-6 month living expense runway calculator and liquid vault target',
      category: 'Wealth & Savings',
      badge: 'Safety Net',
      icon: <PiggyBank className="w-4 h-4 text-emerald-500" />,
    },
    {
      id: 'net_worth',
      name: 'Net Worth Balance Sheet',
      desc: 'Real-time assets vs liabilities balance sheet and net worth growth',
      category: 'Wealth & Savings',
      badge: 'Balance Sheet',
      icon: <TrendingUp className="w-4 h-4 text-blue-500" />,
    },
    {
      id: 'inquiries_tracker',
      name: 'Credit Inquiry Shield',
      desc: 'FCRA 2-year drop-off timer and scoring impact tracker for hard pulls',
      category: 'Credit & Score',
      badge: '2-Yr Dropoff',
      icon: <ShieldAlert className="w-4 h-4 text-indigo-500" />,
    },
    {
      id: 'savings_goals',
      name: 'Multi-Vault Savings Goals',
      desc: 'Target savings milestones with auto-calculated weekly savings pace',
      category: 'Wealth & Savings',
      badge: 'Goals',
      icon: <Wallet className="w-4 h-4 text-teal-500" />,
    },
    {
      id: 'dispute_tracker',
      name: 'FCRA 30-Day Dispute Clock',
      desc: '15 U.S.C. § 1681i 30-day investigation deadline timer for credit bureaus',
      category: 'Dispute & Legal',
      badge: '30 Days',
      icon: <Clock className="w-4 h-4 text-amber-500" />,
    },
    {
      id: 'interest_bleed',
      name: 'APR Interest Bleed Monitor',
      desc: 'Calculate exact daily and monthly dollar loss to credit card APR interest',
      category: 'Budget & Debt',
      badge: 'Daily Bleed',
      icon: <TrendingDown className="w-4 h-4 text-rose-500" />,
    },
    {
      id: 'cash_flow',
      name: 'Cash Flow Forecaster',
      desc: '30-day forward liquidity calendar to prevent bank overdraft fees',
      category: 'Budget & Debt',
      badge: '30-Day Flow',
      icon: <Calendar className="w-4 h-4 text-blue-500" />,
    },
    {
      id: 'rewards_tracker',
      name: 'Reward Points & Cashback Vault',
      desc: 'Track cash back, miles, points and expiration schedules in one place',
      category: 'Wealth & Savings',
      badge: 'Rewards',
      icon: <Award className="w-4 h-4 text-amber-500" />,
    },
    {
      id: 'no_spend_tracker',
      name: 'No-Spend Days Calendar',
      desc: 'Calendar of zero-discretionary spending days and impulse money saved',
      category: 'Budget & Debt',
      badge: 'Habit',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
    },
    {
      id: 'utilization_tracker',
      name: 'Revolving Utilization Monitor',
      desc: 'Per-card and aggregate utilization heatmap to keep balances under 9%',
      category: 'Credit & Score',
      badge: 'Under 9%',
      icon: <Percent className="w-4 h-4 text-cyan-500" />,
    },
    {
      id: 'sinking_funds',
      name: 'Sinking Funds Allocator',
      desc: 'Reserve pools for irregular expenses like auto insurance and taxes',
      category: 'Wealth & Savings',
      badge: 'Funds',
      icon: <Layers className="w-4 h-4 text-violet-500" />,
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
    <div className="w-full space-y-4 pb-8 select-none font-sans text-black dark:text-white transition-colors">
      
      {/* ========================================================================= */}
      {/* VIRAL SHARE & DOMAIN SPOTLIGHT: CHIDONIQ.COM.NG */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-3xl p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors">
        <div className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-[10px] font-bold text-blue-600 dark:text-blue-400 font-mono-numeric">
            <Globe className="w-3.5 h-3.5" />
            <span>Official Domain: chidoniq.com.ng</span>
          </div>
          <h2 className="text-base font-black tracking-tight text-black dark:text-white">
            Share CHIDONIQ with Friends
          </h2>
          <p className="text-xs text-neutral-600 dark:text-neutral-400">
            Help friends boost their credit score and eliminate credit card debt. 100% private.
          </p>
        </div>

        <button
          type="button"
          onClick={handleShareApp}
          className="px-4 py-2.5 rounded-2xl bg-black dark:bg-white text-white dark:text-black hover:opacity-90 transition-all font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md shrink-0 active:scale-95"
        >
          {copiedShare ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Link Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4" />
              <span>Share App</span>
            </>
          )}
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 2-COLUMN GRID OF HERO CARDS */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 gap-3">
        {heroCards.map((card) => (
          <button
            key={card.id}
            type="button"
            onClick={() => onNavigate(card.id)}
            className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 hover:border-black dark:hover:border-white rounded-3xl p-4.5 shadow-xs flex flex-col items-center justify-center text-center transition-all cursor-pointer group min-h-[140px]"
          >
            {/* Centered Large Icon Well */}
            <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 group-hover:scale-105 transition-transform shadow-xs">
              {card.icon}
            </div>

            {/* Title */}
            <h3 className="text-sm font-black text-black dark:text-white mt-2.5 tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {card.title}
            </h3>

            {/* Subtitle */}
            <p className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400 mt-0.5 leading-tight">
              {card.subtitle}
            </p>
          </button>
        ))}

        {/* 6th Slot in Grid: Tracker Hub Engine */}
        <button
          type="button"
          onClick={() => onNavigate('tracker')}
          className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 hover:border-black dark:hover:border-white rounded-3xl p-4.5 shadow-xs flex flex-col items-center justify-center text-center transition-all cursor-pointer group min-h-[140px]"
        >
          <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform shadow-xs">
            <Compass className="w-7 h-7 stroke-[2.2]" />
          </div>
          <h3 className="text-sm font-black text-black dark:text-white mt-2.5 tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            Tracker Hub
          </h3>
          <p className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400 mt-0.5 leading-tight">
            All 17 Inbuilt Engines
          </p>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* FEATURED SPOTLIGHT: Grocery Card Saver */}
      {/* ========================================================================= */}
      <div 
        onClick={() => onNavigate('grocery_saver')}
        className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 hover:border-black dark:hover:border-white rounded-3xl p-4.5 shadow-xs flex items-center justify-between gap-3 transition-all cursor-pointer"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <ShoppingCart className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-black dark:text-white">
                Grocery Card Saver
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-bold font-mono-numeric">
                Up to 6% Back
              </span>
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5 leading-snug">
              Compare 12 US supermarket credit cards &amp; stop losing money to debit cards
            </p>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 shrink-0">
          <ChevronRight className="w-4 h-4 stroke-[2.5]" />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* COMPLETE ALL-IN-ONE EXTENDED FINANCIAL ENGINES DIRECTORY */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-3xl p-5 shadow-xs space-y-3.5 transition-colors">
        
        {/* Header & Feature Count */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h4 className="text-xs font-black text-black dark:text-white uppercase tracking-wider font-mono-numeric">
              All Financial Engines ({allFeaturesCatalog.length})
            </h4>
          </div>
          <span className="text-[10px] font-mono-numeric font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full">
            100% Client-Side
          </span>
        </div>

        {/* Search Input for Quick Access */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3.5 top-3 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search engines (e.g. AZEO, 609, Avalanche, Groceries)..."
            className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl pl-9 pr-4 py-2 text-xs font-medium text-black dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs font-bold font-mono-numeric">
          {(['All', 'Featured', 'Credit & Score', 'Budget & Debt', 'Dispute & Legal', 'Wealth & Savings'] as FeatureCategory[]).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-xl shrink-0 transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                  : 'bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* List of Features */}
        <div className="space-y-1.5 pt-1 divide-y divide-neutral-100 dark:divide-neutral-900 max-h-[460px] overflow-y-auto pr-1">
          {filteredFeatures.map((tool) => (
            <button
              key={tool.id}
              type="button"
              onClick={() => onNavigate(tool.id)}
              className="w-full pt-2.5 pb-2 flex items-center justify-between text-left hover:bg-neutral-50 dark:hover:bg-neutral-900/60 px-2.5 rounded-2xl transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shrink-0 group-hover:scale-105 transition-transform">
                  {tool.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {tool.name}
                    </span>
                    {tool.badge && (
                      <span className="text-[9px] font-mono-numeric font-bold px-1.5 py-0.2 rounded-md bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800">
                        {tool.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-neutral-600 dark:text-neutral-400 line-clamp-1">
                    {tool.desc}
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors shrink-0" />
            </button>
          ))}

          {filteredFeatures.length === 0 && (
            <div className="py-6 text-center text-xs text-neutral-500">
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
