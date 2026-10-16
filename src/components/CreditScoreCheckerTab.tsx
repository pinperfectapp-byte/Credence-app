import React, { useState, useMemo } from 'react';
import { 
  CreditCard, 
  DollarSign, 
  CheckCircle2, 
  ExternalLink, 
  ArrowRight, 
  Filter, 
  Percent, 
  Award,
  Zap,
  Lock
} from 'lucide-react';

interface MatchedCard {
  id: string;
  name: string;
  issuer: string;
  minScore: number;
  maxScore: number;
  tier: 'Poor' | 'Fair' | 'Good' | 'Very Good' | 'Exceptional';
  annualFee: number;
  cashbackOrPerk: string;
  regularApr: string;
  category: 'cashback' | 'travel' | 'no_fee' | 'builder';
  introBonus: string;
  applyLink: string;
}

const CARDS_DATABASE: MatchedCard[] = [
  // Exceptional (800+)
  {
    id: 'csr',
    name: 'Sapphire Reserve Elite Card',
    issuer: 'Premier Bank',
    minScore: 750,
    maxScore: 850,
    tier: 'Exceptional',
    annualFee: 550,
    cashbackOrPerk: '3x Travel & Dining · $300 Annual Travel Credit',
    regularApr: '22.49% - 29.49%',
    category: 'travel',
    introBonus: '$900 in Travel Value',
    applyLink: '#',
  },
  {
    id: 'amex_plat',
    name: 'Platinum Travel & Dining Card',
    issuer: 'Premier Issuer',
    minScore: 740,
    maxScore: 850,
    tier: 'Exceptional',
    annualFee: 695,
    cashbackOrPerk: '5x Flights · $200 Hotel Credit · Lounge Access',
    regularApr: 'See Pay Over Time APR',
    category: 'travel',
    introBonus: '80,000 Membership Rewards Pts',
    applyLink: '#',
  },

  // Very Good (740-799)
  {
    id: 'csp',
    name: 'Sapphire Preferred Travel Card',
    issuer: 'Premier Bank',
    minScore: 700,
    maxScore: 850,
    tier: 'Very Good',
    annualFee: 95,
    cashbackOrPerk: '3x Dining · 2x Travel · 25% Boost in Portal',
    regularApr: '21.49% - 28.49%',
    category: 'travel',
    introBonus: '$750 in Travel Value',
    applyLink: '#',
  },
  {
    id: 'amex_bcp',
    name: 'Preferred 6% Supermarket Card',
    issuer: 'Premier Issuer',
    minScore: 690,
    maxScore: 850,
    tier: 'Very Good',
    annualFee: 95,
    cashbackOrPerk: '6% Supermarkets · 6% Streaming · 3% Transit',
    regularApr: '19.24% - 29.99%',
    category: 'cashback',
    introBonus: '$250 Statement Credit',
    applyLink: '#',
  },
  {
    id: 'venture_x',
    name: 'Venture Travel Rewards Card',
    issuer: 'National Issuer',
    minScore: 740,
    maxScore: 850,
    tier: 'Very Good',
    annualFee: 395,
    cashbackOrPerk: '2x Miles on all purchases · $300 Annual Travel Credit',
    regularApr: '19.99% - 29.99%',
    category: 'travel',
    introBonus: '75,000 Bonus Miles',
    applyLink: '#',
  },

  // Good (670-739)
  {
    id: 'citi_double',
    name: 'Double Cash Back 2% Card',
    issuer: 'National Issuer',
    minScore: 670,
    maxScore: 850,
    tier: 'Good',
    annualFee: 0,
    cashbackOrPerk: '2% Flat Cash Back (1% at swipe + 1% when paid)',
    regularApr: '19.24% - 29.24%',
    category: 'no_fee',
    introBonus: '$200 Cash Bonus',
    applyLink: '#',
  },
  {
    id: 'cfu',
    name: 'Unlimited Freedom 1.5% Card',
    issuer: 'Premier Bank',
    minScore: 670,
    maxScore: 850,
    tier: 'Good',
    annualFee: 0,
    cashbackOrPerk: '1.5% Unlimited · 3% Dining · 5% Travel',
    regularApr: '20.49% - 29.24%',
    category: 'cashback',
    introBonus: '$200 Cash Bonus',
    applyLink: '#',
  },
  {
    id: 'apple_card',
    name: 'Digital Titanium Cashback Card',
    issuer: 'Digital Bank',
    minScore: 650,
    maxScore: 850,
    tier: 'Good',
    annualFee: 0,
    cashbackOrPerk: '3% Select Stores · 2% Digital Wallet · Zero Late Fees',
    regularApr: '19.24% - 29.49%',
    category: 'no_fee',
    introBonus: 'Daily Cash Paid Every 24 Hours',
    applyLink: '#',
  },
  {
    id: 'citi_custom',
    name: 'Custom Top Category 5% Card',
    issuer: 'National Issuer',
    minScore: 670,
    maxScore: 850,
    tier: 'Good',
    annualFee: 0,
    cashbackOrPerk: '5% Cash Back on your highest eligible spend category',
    regularApr: '19.24% - 29.24%',
    category: 'cashback',
    introBonus: '$200 Cash Bonus',
    applyLink: '#',
  },

  // Fair (580-669)
  {
    id: 'capone_quicksilverone',
    name: 'Everyday 1.5% Builder Card',
    issuer: 'National Issuer',
    minScore: 580,
    maxScore: 669,
    tier: 'Fair',
    annualFee: 39,
    cashbackOrPerk: '1.5% Unlimited Cash Back on all purchases',
    regularApr: '29.99%',
    category: 'cashback',
    introBonus: 'Automatic Credit Line Review after 6 mos',
    applyLink: '#',
  },
  {
    id: 'petal_2',
    name: 'Modern Cash Back Builder Card',
    issuer: 'Direct Bank',
    minScore: 580,
    maxScore: 680,
    tier: 'Fair',
    annualFee: 0,
    cashbackOrPerk: '1% to 1.5% Cash Back · No Annual Fee · No Late Fees',
    regularApr: '18.24% - 32.24%',
    category: 'no_fee',
    introBonus: 'Cash Flow Underwriting (No SSN credit history)',
    applyLink: '#',
  },
  {
    id: 'mission_lane',
    name: 'Clear Terms Credit Builder Card',
    issuer: 'Community Issuer',
    minScore: 570,
    maxScore: 660,
    tier: 'Fair',
    annualFee: 0,
    cashbackOrPerk: 'Reports to all 3 credit bureaus · Clear terms',
    regularApr: '26.99% - 29.99%',
    category: 'builder',
    introBonus: 'Higher Line Opportunities',
    applyLink: '#',
  },

  // Poor / Rebuilding (<580)
  {
    id: 'discover_secured',
    name: 'Secured 2% Cashback Card',
    issuer: 'Direct Issuer',
    minScore: 300,
    maxScore: 620,
    tier: 'Poor',
    annualFee: 0,
    cashbackOrPerk: '2% Gas & Dining · 100% Refundable Deposit in 7 Mos',
    regularApr: '28.24%',
    category: 'builder',
    introBonus: 'Cashback Match (Doubles all 1st year cash)',
    applyLink: '#',
  },
  {
    id: 'capone_plat_secured',
    name: 'Zero-Fee Secured Builder Card',
    issuer: 'National Issuer',
    minScore: 300,
    maxScore: 600,
    tier: 'Poor',
    annualFee: 0,
    cashbackOrPerk: '$49, $99, or $200 deposit for initial $200 limit',
    regularApr: '29.99%',
    category: 'builder',
    introBonus: 'No Annual Fee · Automatic Line Increase',
    applyLink: '#',
  },
  {
    id: 'opensky',
    name: 'No-Credit-Check Secured Card',
    issuer: 'Direct Issuer',
    minScore: 300,
    maxScore: 570,
    tier: 'Poor',
    annualFee: 35,
    cashbackOrPerk: 'Zero Credit Check · 85% Approval Rate · 3 Bureaus',
    regularApr: '29.74%',
    category: 'builder',
    introBonus: 'Dedicated Credit Reporting',
    applyLink: '#',
  },
];

interface CreditScoreCheckerTabProps {
  initialScore?: number;
  onNavigateTab?: (tabId: string) => void;
}

export const CreditScoreCheckerTab: React.FC<CreditScoreCheckerTabProps> = ({
  initialScore = 680,
  onNavigateTab,
}) => {
  const [userScore, setUserScore] = useState<number>(
    initialScore > 0 ? initialScore : 680
  );
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'cashback' | 'travel' | 'no_fee' | 'builder'>('all');

  // Calculate score tier
  const tierInfo = useMemo(() => {
    if (userScore >= 800) return { name: 'Exceptional', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/50', border: 'border-emerald-500', odds: '98% Approval Odds' };
    if (userScore >= 740) return { name: 'Very Good', color: 'text-emerald-400', bg: 'bg-emerald-50/80 dark:bg-emerald-950/40', border: 'border-emerald-400', odds: '90% Approval Odds' };
    if (userScore >= 670) return { name: 'Good', color: 'text-sky-500', bg: 'bg-sky-50 dark:bg-sky-950/40', border: 'border-sky-500', odds: '82% Approval Odds' };
    if (userScore >= 580) return { name: 'Fair', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/40', border: 'border-amber-500', odds: '70% Approval Odds' };
    return { name: 'Poor / Rebuilding', color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-950/40', border: 'border-rose-500', odds: 'Guaranteed Secured Cards' };
  }, [userScore]);

  // Match eligible cards
  const eligibleCards = useMemo(() => {
    return CARDS_DATABASE.filter((card) => {
      const matchesScore = userScore >= card.minScore;
      const matchesFilter = selectedFilter === 'all' || card.category === selectedFilter;
      return matchesScore && matchesFilter;
    }).sort((a, b) => b.minScore - a.minScore);
  }, [userScore, selectedFilter]);

  // Average Rewards Potential in Dollars
  const dollarPotential = useMemo(() => {
    if (userScore >= 740) return { rewardsPerYear: 650, welcomeBonusValue: 900 };
    if (userScore >= 670) return { rewardsPerYear: 380, welcomeBonusValue: 200 };
    if (userScore >= 580) return { rewardsPerYear: 180, welcomeBonusValue: 50 };
    return { rewardsPerYear: 90, welcomeBonusValue: 0 };
  }, [userScore]);

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-6 font-sans select-none pb-8">
      
      {/* Title & Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-6 border border-slate-800 shadow-md space-y-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-500 text-slate-950 font-black">
            <Award className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-[10px] font-mono-numeric font-black uppercase tracking-wider text-emerald-400 block">
              Feature 1 · Card Eligibility Matcher
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Credit Score Checker
            </h1>
          </div>
        </div>

        <p className="text-xs text-slate-300 font-semibold leading-relaxed">
          Enter your current credit score below. Our algorithm instantly matches the <strong className="text-white">highest-reward cards</strong> you can get approved for without dinging your credit.
        </p>
      </div>

      {/* Interactive Credit Score Input & Live Dial */}
      <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider font-mono-numeric">
            Your Credit Score
          </span>
          <div className="flex items-center gap-2 font-mono-numeric">
            <span className={`text-3xl sm:text-4xl font-black ${tierInfo.color}`}>
              {userScore}
            </span>
            <span className="text-xs font-bold text-slate-400">/ 850</span>
          </div>
        </div>

        {/* Live Slider: 300 to 850 */}
        <div className="space-y-1.5">
          <input
            type="range"
            min="300"
            max="850"
            step="5"
            value={userScore}
            onChange={(e) => setUserScore(parseInt(e.target.value))}
            className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />

          <div className="flex justify-between text-[10px] font-mono-numeric font-bold text-slate-400">
            <span>300 (Poor)</span>
            <span>580 (Fair)</span>
            <span>670 (Good)</span>
            <span>740 (Very Good)</span>
            <span>850 (Prime)</span>
          </div>
        </div>

        {/* Quick Tier Selection Buttons */}
        <div className="grid grid-cols-5 gap-1 pt-1 font-mono-numeric">
          {[
            { label: '540', val: 540 },
            { label: '620', val: 620 },
            { label: '690', val: 690 },
            { label: '760', val: 760 },
            { label: '820', val: 820 },
          ].map((preset) => (
            <button
              key={preset.val}
              type="button"
              onClick={() => setUserScore(preset.val)}
              className={`py-2 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                Math.abs(userScore - preset.val) < 20
                  ? 'bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950 border-slate-900 dark:border-emerald-500 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Tier Standing & Odds Banner */}
        <div className={`p-4 rounded-2xl border-2 ${tierInfo.border} ${tierInfo.bg} flex items-center justify-between`}>
          <div>
            <span className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 block font-mono-numeric">
              Current Standing Tier
            </span>
            <span className={`text-base sm:text-lg font-black ${tierInfo.color}`}>
              {tierInfo.name} Tier
            </span>
          </div>

          <div className="text-right">
            <span className="text-xs font-black font-mono-numeric text-slate-900 dark:text-white block">
              {tierInfo.odds}
            </span>
            <span className="text-[10px] text-slate-500 font-mono-numeric">
              {eligibleCards.length} Qualified Cards
            </span>
          </div>
        </div>
      </div>

      {/* Real-Time Dollar Calculator Box */}
      <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-slate-950 rounded-3xl p-5 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <DollarSign className="w-5 h-5 stroke-[3]" />
            <h3 className="text-sm font-black uppercase tracking-wider">
              Your Annual Cash Value
            </h3>
          </div>
          <span className="text-[10px] font-mono-numeric font-black bg-slate-950 text-white px-2.5 py-0.5 rounded-full">
            Pure Math
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 font-mono-numeric">
          <div className="p-3 bg-white/20 rounded-2xl border border-white/30 backdrop-blur-xs">
            <span className="text-[10px] font-bold uppercase text-emerald-950 block">
              Estimated Rewards / Year
            </span>
            <span className="text-2xl sm:text-3xl font-black text-slate-950 block mt-0.5">
              ${dollarPotential.rewardsPerYear}
            </span>
            <span className="text-[9px] text-emerald-950 block mt-0.5">
              Based on US average spend
            </span>
          </div>

          <div className="p-3 bg-white/20 rounded-2xl border border-white/30 backdrop-blur-xs">
            <span className="text-[10px] font-bold uppercase text-emerald-950 block">
              Welcome Bonuses Available
            </span>
            <span className="text-2xl sm:text-3xl font-black text-slate-950 block mt-0.5">
              ${dollarPotential.welcomeBonusValue}
            </span>
            <span className="text-[9px] text-emerald-950 block mt-0.5">
              Immediate signup cash value
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-black text-slate-500 font-mono-numeric">
          <span className="uppercase tracking-wider">Filter Matched Cards</span>
          <span>{eligibleCards.length} Cards Found</span>
        </div>

        <div className="flex overflow-x-auto gap-1.5 pb-1 text-xs font-mono-numeric scrollbar-none">
          {[
            { id: 'all', label: 'All Cards' },
            { id: 'cashback', label: 'Cash Back ($)' },
            { id: 'travel', label: 'Travel Points' },
            { id: 'no_fee', label: '$0 Annual Fee' },
            { id: 'builder', label: 'Credit Builder' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedFilter(cat.id as any)}
              className={`py-2 px-3 rounded-xl font-bold whitespace-nowrap cursor-pointer transition-all border ${
                selectedFilter === cat.id
                  ? 'bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950 border-slate-900 dark:border-emerald-500 shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cards List in Big Bold Visual Format */}
      <div className="space-y-3.5">
        {eligibleCards.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
            <CreditCard className="w-8 h-8 text-slate-400 mx-auto" />
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              No cards matched this category
            </h4>
            <p className="text-xs text-slate-500">
              Try selecting &quot;All Cards&quot; or increase your credit score.
            </p>
          </div>
        ) : (
          eligibleCards.map((card) => (
            <div
              key={card.id}
              className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 rounded-3xl p-4 sm:p-5 shadow-xs space-y-3.5 transition-all"
            >
              {/* Top Row: Issuer & Approval Indicator */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                <div>
                  <span className="text-[10px] font-mono-numeric font-bold text-slate-400 uppercase block">
                    {card.issuer} · Min Score {card.minScore}
                  </span>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {card.name}
                  </h3>
                </div>

                <div className="text-right shrink-0">
                  <span className="inline-flex items-center gap-1 text-[11px] font-black font-mono-numeric text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-900">
                    <CheckCircle2 className="w-3 h-3 stroke-[3]" />
                    <span>Eligible</span>
                  </span>
                </div>
              </div>

              {/* Main Perks Box */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-[10px] font-black uppercase text-slate-400 font-mono-numeric block">
                  Primary Earning Reward
                </span>
                <p className="text-xs font-black text-slate-900 dark:text-white">
                  {card.cashbackOrPerk}
                </p>
                <div className="flex items-center gap-1.5 text-[11px] font-mono-numeric font-bold text-emerald-600 dark:text-emerald-400 pt-0.5">
                  <Zap className="w-3 h-3" />
                  <span>Bonus: {card.introBonus}</span>
                </div>
              </div>

              {/* Vitals Grid: Fee & APR */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono-numeric">
                <div className="p-2.5 rounded-xl bg-slate-100/60 dark:bg-slate-800/40">
                  <span className="text-[10px] text-slate-400 block font-bold">Annual Fee</span>
                  <span className="text-sm font-black text-slate-900 dark:text-white">
                    {card.annualFee === 0 ? '$0 (No Fee)' : `$${card.annualFee}/year`}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-100/60 dark:bg-slate-800/40">
                  <span className="text-[10px] text-slate-400 block font-bold">Purchase APR</span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white truncate block">
                    {card.regularApr}
                  </span>
                </div>
              </div>

              {/* Apply Action Link */}
              <a
                href={card.applyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-2xl font-black text-xs bg-slate-900 hover:bg-slate-800 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>View Card Terms &amp; Apply</span>
                <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
              </a>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
