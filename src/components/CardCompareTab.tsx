import React, { useState, useMemo } from 'react';
import { 
  DollarSign, 
  Percent, 
  X, 
  CreditCard, 
  TrendingDown, 
  Search, 
  ExternalLink, 
  Zap, 
  Calendar, 
  ShieldCheck, 
  ArrowRight, 
  Filter, 
  CheckCircle2, 
  SlidersHorizontal 
} from 'lucide-react';
import { CURRENT_REAL_TIME_CARDS, ComparisonCard } from '../data/realTimeComparisonCards';

interface CardCompareTabProps {
  initialBalance?: number;
  initialApr?: number;
}

export const CardCompareTab: React.FC<CardCompareTabProps> = ({
  initialBalance = 2500,
  initialApr = 29.0,
}) => {
  const [balance, setBalance] = useState<number>(initialBalance);
  const [currentApr, setCurrentApr] = useState<number>(initialApr);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'savings' | 'apr' | 'intro'>('savings');
  const [savingsMode, setSavingsMode] = useState<'annual' | 'intro_promo'>('annual');
  const [selectedCardForMath, setSelectedCardForMath] = useState<ComparisonCard | null>(null);

  // Real-time Current Interest Burns
  const monthlyCurrentInterest = useMemo(() => {
    return balance * (currentApr / 100 / 12);
  }, [balance, currentApr]);

  const yearlyCurrentInterest = useMemo(() => {
    return balance * (currentApr / 100);
  }, [balance, currentApr]);

  // Real-time Savings Calculator for any card
  const calculateCardSavings = (card: ComparisonCard) => {
    const monthlyNew = balance * (card.ongoingApr / 100 / 12);
    const monthlySaving = Math.max(0, monthlyCurrentInterest - monthlyNew);
    const yearlySaving = Math.max(0, Math.round(monthlySaving * 12));

    // Promo 0% APR cash saved across the full intro period
    const promoMonths = card.introPeriodMonths || 0;
    const promoTotalSaving = card.introApr === 0 
      ? Math.round(monthlyCurrentInterest * promoMonths)
      : Math.round((monthlyCurrentInterest - (balance * (card.introApr / 100 / 12))) * promoMonths);

    return {
      monthlyNew,
      monthlySaving,
      yearlySaving,
      promoTotalSaving: Math.max(0, promoTotalSaving),
    };
  };

  // Filtered & Sorted Cards in Real Time
  const processedCards = useMemo(() => {
    return CURRENT_REAL_TIME_CARDS
      .filter((card) => {
        // Category filter
        if (selectedCategory !== 'all') {
          if (selectedCategory === 'balance_transfer' && card.category !== 'balance_transfer') return false;
          if (selectedCategory === 'credit_union' && card.category !== 'credit_union' && card.category !== 'low_apr') return false;
          if (selectedCategory === 'cash_back' && card.category !== 'cash_back') return false;
        }

        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = card.name.toLowerCase().includes(q);
          const matchBank = card.bank.toLowerCase().includes(q);
          const matchCat = card.category.toLowerCase().includes(q);
          return matchName || matchBank || matchCat;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'savings') {
          const savingsA = calculateCardSavings(a).yearlySaving;
          const savingsB = calculateCardSavings(b).yearlySaving;
          return savingsB - savingsA;
        }
        if (sortBy === 'apr') {
          return a.ongoingApr - b.ongoingApr;
        }
        if (sortBy === 'intro') {
          return b.introPeriodMonths - a.introPeriodMonths;
        }
        return 0;
      });
  }, [selectedCategory, searchQuery, sortBy, balance, currentApr]);

  const categories = [
    { id: 'all', label: 'All 16 Cards' },
    { id: 'balance_transfer', label: '0% Balance Transfer' },
    { id: 'credit_union', label: 'Low APR Credit Unions' },
    { id: 'cash_back', label: 'Cash Back & Rewards' },
  ];

  const balancePresets = [1000, 2500, 5000, 7500, 10000];
  const aprPresets = [24.99, 28.99, 29.99, 32.99];

  return (
    <div className="space-y-4 w-full max-w-full overflow-x-hidden font-sans pb-8 text-slate-100 select-none animate-fade-in">
      {/* Title & Real-Time Header Banner (Dashboard Colors) */}
      <div className="bg-[#0C182F] text-white rounded-3xl p-5 sm:p-6 border border-[rgba(56,120,210,0.3)] shadow-xl space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase tracking-wider font-mono-numeric">
                Live Engine · Verified Cards
              </span>
              <span className="text-[11px] font-bold text-[#8FA0C0]">
                16 Prime Issuers
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
              APR Slash &amp; Card Compare Engine
            </h1>
            <p className="text-xs sm:text-sm text-[#CBD5E1] font-medium leading-relaxed">
              Calculate live dollar interest reductions in real time across the nation&apos;s most current 0% balance transfer and low APR credit cards.
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-[#102244] border border-[rgba(56,120,210,0.3)] text-[#38BDF8] font-black shrink-0 shadow-inner">
            <DollarSign className="w-6 h-6 stroke-[2.5]" />
          </div>
        </div>

        {/* Calculation Mode Toggle */}
        <div className="flex items-center gap-2 pt-2 border-t border-[rgba(56,120,210,0.18)]">
          <button
            type="button"
            onClick={() => setSavingsMode('annual')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              savingsMode === 'annual'
                ? 'bg-[#2563EB] text-white shadow-md shadow-blue-500/25 border border-[#38BDF8]/40'
                : 'bg-[#102244] text-[#8FA0C0] hover:text-white border border-transparent'
            }`}
          >
            <span>Annual Ongoing Savings</span>
          </button>
          <button
            type="button"
            onClick={() => setSavingsMode('intro_promo')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              savingsMode === 'intro_promo'
                ? 'bg-[#2563EB] text-white shadow-md shadow-blue-500/25 border border-[#38BDF8]/40'
                : 'bg-[#102244] text-[#8FA0C0] hover:text-white border border-transparent'
            }`}
          >
            <span>0% Promo Window Total Saved</span>
          </button>
        </div>
      </div>

      {/* Real-Time Dollar Current Interest Burning Box */}
      <div className="bg-[#181124] border border-rose-500/30 rounded-3xl p-4.5 space-y-2 shadow-xl">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider text-rose-400 block font-mono-numeric">
            Current Cash Bleeding to Credit Card Company
          </span>
          <span className="text-[10px] font-bold text-[#8FA0C0] font-mono-numeric">
            Based on {currentApr}% APR &amp; ${balance.toLocaleString()} balance
          </span>
        </div>

        <div className="flex items-baseline justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl sm:text-4xl font-black text-rose-400 font-mono-numeric tracking-tight">
                ${monthlyCurrentInterest.toFixed(0)}
              </span>
              <span className="text-xs font-bold text-rose-300/80">/ month in pure interest</span>
            </div>
            <span className="text-xs font-bold text-[#CBD5E1] block mt-0.5">
              ${yearlyCurrentInterest.toFixed(0)}/year wasted that builds zero equity
            </span>
          </div>

          <div className="text-right shrink-0">
            <span className="text-xs font-mono-numeric font-black text-rose-300 bg-rose-500/20 px-2.5 py-1 rounded-lg border border-rose-500/40 block">
              {currentApr}% APR
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Controls Panel: Live Balance & Current APR Sliders */}
      <div className="bg-[#0C182F] border border-[rgba(56,120,210,0.25)] rounded-3xl p-5 shadow-xl space-y-5">
        {/* Input 1: Debt Balance Slider & Direct Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5 font-mono-numeric">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Credit Card Balance to Refinance</span>
            </label>
            <div className="flex items-center gap-1 px-3 py-1 bg-[#102244] border border-[rgba(56,120,210,0.3)] rounded-xl">
              <span className="text-xs font-black text-[#8FA0C0] font-mono-numeric">$</span>
              <input
                type="number"
                min="100"
                max="50000"
                step="100"
                value={balance}
                onChange={(e) => setBalance(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-20 bg-transparent text-white font-mono-numeric font-black text-base focus:outline-none text-right"
              />
            </div>
          </div>

          <input
            type="range"
            min="500"
            max="15000"
            step="100"
            value={balance}
            onChange={(e) => setBalance(parseInt(e.target.value) || 0)}
            className="w-full h-2.5 bg-[#102244] rounded-lg appearance-none cursor-pointer accent-[#38BDF8] transition-all"
          />

          <div className="flex justify-between text-[10px] font-mono-numeric font-bold text-[#8FA0C0]">
            <span>$500</span>
            <span>$2.5k</span>
            <span>$5k</span>
            <span>$10k</span>
            <span>$15k</span>
          </div>

          {/* Quick Balance Presets */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[10px] font-black uppercase text-[#8FA0C0] font-mono-numeric mr-1">
              Presets:
            </span>
            {balancePresets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setBalance(preset)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono-numeric font-bold transition-all cursor-pointer ${
                  balance === preset
                    ? 'bg-[#2563EB] text-white font-black shadow-xs border border-[#38BDF8]/50'
                    : 'bg-[#102244] text-[#CBD5E1] hover:text-white border border-[rgba(56,120,210,0.2)]'
                }`}
              >
                ${preset.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        {/* Input 2: Current APR Input & Presets */}
        <div className="space-y-2 pt-2 border-t border-[rgba(56,120,210,0.18)]">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5 font-mono-numeric">
              <Percent className="w-4 h-4 text-rose-400" />
              <span>Current Card Annual APR</span>
            </label>
            <div className="flex items-center gap-1 px-3 py-1 bg-[#102244] border border-[rgba(56,120,210,0.3)] rounded-xl">
              <input
                type="number"
                step="0.01"
                min="5"
                max="45"
                value={currentApr}
                onChange={(e) => setCurrentApr(parseFloat(e.target.value) || 0)}
                className="w-16 bg-transparent text-rose-400 font-mono-numeric font-black text-base focus:outline-none text-right"
              />
              <span className="text-xs font-black text-[#8FA0C0] font-mono-numeric">%</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-black uppercase text-[#8FA0C0] font-mono-numeric mr-1">
              Common APRs:
            </span>
            {aprPresets.map((rate) => (
              <button
                key={rate}
                type="button"
                onClick={() => setCurrentApr(rate)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono-numeric font-bold transition-all cursor-pointer ${
                  currentApr === rate
                    ? 'bg-rose-600 text-white font-black shadow-xs border border-rose-400/50'
                    : 'bg-[#102244] text-[#CBD5E1] hover:text-white border border-[rgba(56,120,210,0.2)]'
                }`}
              >
                {rate}%
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Pills, Search Bar & Sorting */}
      <div className="space-y-3">
        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#8FA0C0] absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search bank or card category (Low APR, Balance Transfer)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#0C182F] border border-[rgba(56,120,210,0.25)] text-xs font-semibold text-white placeholder:text-[#8FA0C0] focus:outline-none focus:ring-2 focus:ring-[#38BDF8]"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs font-bold">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#2563EB] text-white font-black shadow-xs border border-[#38BDF8]/50'
                  : 'bg-[#102244] text-[#8FA0C0] hover:text-white border border-[rgba(56,120,210,0.2)]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Sorting Bar */}
        <div className="flex items-center justify-between text-xs font-bold text-[#8FA0C0] px-1 font-mono-numeric">
          <span>Showing {processedCards.length} Verified Working Cards</span>
          <div className="flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#38BDF8]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#102244] text-white font-bold text-xs cursor-pointer focus:outline-none px-2 py-1 rounded-lg border border-[rgba(56,120,210,0.25)]"
            >
              <option value="savings">Highest Savings First</option>
              <option value="apr">Lowest Ongoing APR</option>
              <option value="intro">Longest 0% Intro Period</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cards List in Real Time */}
      <div className="space-y-3.5">
        {processedCards.map((card) => {
          const { yearlySaving, monthlySaving, promoTotalSaving } = calculateCardSavings(card);
          const displayedSaving = savingsMode === 'intro_promo' ? promoTotalSaving : yearlySaving;

          return (
            <div
              key={card.id}
              className="bg-[#0C182F] border border-[rgba(56,120,210,0.25)] hover:border-[#38BDF8]/60 rounded-3xl p-5 shadow-xl space-y-3.5 transition-all"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3 border-b border-[rgba(56,120,210,0.18)] pb-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase tracking-wider font-mono-numeric">
                      {card.badge}
                    </span>
                    <span className="text-[10px] font-bold text-[#8FA0C0] uppercase font-mono-numeric">
                      {card.bank}
                    </span>
                  </div>
                  <h3 className="font-black text-white text-base leading-snug">
                    {card.name}
                  </h3>
                  <span className="text-xs text-[#CBD5E1] block font-medium">
                    {card.highlight}
                  </span>
                </div>

                <div className="p-2 rounded-xl bg-[#102244] text-emerald-400 border border-[rgba(56,120,210,0.2)] shrink-0">
                  <CreditCard className="w-5 h-5" />
                </div>
              </div>

              {/* Big Savings Number Display */}
              <div className="text-center py-3.5 bg-gradient-to-b from-[#102244] to-[#0A162B] rounded-2xl border border-[rgba(56,120,210,0.3)] space-y-0.5 shadow-inner">
                <span className="text-[10px] uppercase font-black tracking-widest text-[#8FA0C0] font-mono-numeric block">
                  {savingsMode === 'intro_promo' ? '0% Intro Period Cash Kept' : 'Estimated Annual Savings'}
                </span>
                <span className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono-numeric tracking-tight block">
                  Save ${displayedSaving.toLocaleString()}
                </span>
                <span className="text-xs font-bold text-[#CBD5E1] font-mono-numeric block">
                  {savingsMode === 'intro_promo' 
                    ? `Save $${monthlySaving.toFixed(0)}/mo over ${card.introPeriodMonths} months` 
                    : `Saves $${monthlySaving.toFixed(0)} every single month`}
                </span>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono-numeric">
                <div className="p-2.5 rounded-xl bg-[#102244]/70 border border-[rgba(56,120,210,0.2)] space-y-0.5">
                  <span className="text-[10px] text-[#8FA0C0] font-bold uppercase block">
                    Ongoing APR
                  </span>
                  <span className="text-sm font-black text-white block">
                    {card.ongoingApr}%
                  </span>
                  <span className="text-[10px] text-[#8FA0C0] block">
                    Current: {currentApr}%
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#102244]/70 border border-[rgba(56,120,210,0.2)] space-y-0.5">
                  <span className="text-[10px] text-[#8FA0C0] font-bold uppercase block">
                    0% Intro Period
                  </span>
                  <span className="text-sm font-black text-[#38BDF8] block">
                    {card.introPeriodMonths > 0 ? `${card.introPeriodMonths} Months` : 'None'}
                  </span>
                  <span className="text-[10px] text-[#8FA0C0] block">
                    Intro APR: {card.introApr}%
                  </span>
                </div>
              </div>

              {/* Mini Visual Bar Comparison */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono-numeric font-bold">
                  <span className="text-rose-400 bg-rose-500/20 px-2 py-0.5 rounded-md border border-rose-500/40">
                    Old: ${monthlyCurrentInterest.toFixed(0)}/mo
                  </span>
                  <span className="text-slate-500">---------&gt;</span>
                  <span className="text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-md border border-emerald-500/40">
                    New: ${(balance * (card.ongoingApr / 100 / 12)).toFixed(0)}/mo
                  </span>
                </div>
                <div className="w-full bg-[#102244] h-2.5 rounded-full overflow-hidden flex border border-[rgba(56,120,210,0.25)]">
                  <div 
                    style={{ width: `${Math.min(100, Math.max(15, (card.ongoingApr / currentApr) * 100))}%` }}
                    className="bg-emerald-500 h-full transition-all duration-300"
                  />
                  <div 
                    style={{ width: `${Math.max(0, 100 - (card.ongoingApr / currentApr) * 100)}%` }}
                    className="bg-rose-500 h-full transition-all duration-300 flex items-center justify-center text-[8px] text-white font-mono font-bold"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setSelectedCardForMath(card)}
                  className="flex-1 py-2.5 px-3 rounded-xl font-black text-xs bg-[#2563EB] hover:bg-blue-600 text-white transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-white text-white" />
                  <span>Show Real Math</span>
                </button>

                <a
                  href={card.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 rounded-xl font-bold text-xs bg-[#102244] hover:bg-[#152e5c] border border-[rgba(56,120,210,0.3)] text-[#38BDF8] hover:text-white transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <span>Issuer Info</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Real Math Breakdown Modal */}
      {selectedCardForMath && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 font-sans animate-fade-in"
          onClick={() => setSelectedCardForMath(null)}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0C182F] border border-[rgba(56,120,210,0.3)] rounded-3xl max-w-sm w-full p-5 shadow-2xl space-y-4 text-white"
          >
            <div className="flex items-center justify-between border-b border-[rgba(56,120,210,0.18)] pb-2.5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#2563EB] text-white">
                  <DollarSign className="w-4 h-4 stroke-[3]" />
                </div>
                <div>
                  <h4 className="font-black text-white text-xs uppercase tracking-wider font-mono-numeric">
                    Real-Time Math Engine
                  </h4>
                  <span className="text-[10px] font-bold text-[#8FA0C0] block">
                    {selectedCardForMath.name}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCardForMath(null)}
                className="text-[#8FA0C0] hover:text-white p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Step-by-Step Math Engine Output */}
            {(() => {
              const { monthlyNew, monthlySaving, yearlySaving, promoTotalSaving } = calculateCardSavings(selectedCardForMath);
              return (
                <div className="space-y-2.5 font-mono-numeric text-xs">
                  {/* Step 1 */}
                  <div className="p-3 bg-[#102244]/70 border border-[rgba(56,120,210,0.2)] rounded-xl space-y-0.5">
                    <span className="text-[#8FA0C0] text-[9px] uppercase font-bold block">
                      1. Old Monthly Interest Formula: Balance × (APR / 12)
                    </span>
                    <span className="text-rose-400 font-bold block text-xs">
                      ${balance.toLocaleString()} × ({currentApr}% / 12) = ${monthlyCurrentInterest.toFixed(2)}/mo
                    </span>
                  </div>

                  {/* Step 2 */}
                  <div className="p-3 bg-[#102244]/70 border border-[rgba(56,120,210,0.2)] rounded-xl space-y-0.5">
                    <span className="text-[#8FA0C0] text-[9px] uppercase font-bold block">
                      2. New Ongoing Monthly Interest: Balance × (New APR / 12)
                    </span>
                    <span className="text-emerald-400 font-bold block text-xs">
                      ${balance.toLocaleString()} × ({selectedCardForMath.ongoingApr}% / 12) = ${monthlyNew.toFixed(2)}/mo
                    </span>
                  </div>

                  {/* Step 3 */}
                  <div className="p-3 bg-[#102244]/70 border border-[rgba(56,120,210,0.2)] rounded-xl space-y-0.5">
                    <span className="text-[#8FA0C0] text-[9px] uppercase font-bold block">
                      3. Net Cash Kept in Pocket Each Month
                    </span>
                    <span className="text-[#CBD5E1] font-bold block text-xs">
                      ${monthlyCurrentInterest.toFixed(2)} − ${monthlyNew.toFixed(2)} = ${monthlySaving.toFixed(2)}/mo
                    </span>
                  </div>

                  {/* Step 4: Final Annual Result */}
                  <div className="p-3.5 bg-emerald-500/15 border border-emerald-500/40 rounded-xl text-center space-y-0.5">
                    <span className="text-emerald-300 text-[10px] uppercase font-bold block">
                      4. Total Annual Cash Kept in Wallet:
                    </span>
                    <span className="text-2xl sm:text-3xl font-black text-emerald-400 block">
                      Save ${yearlySaving.toLocaleString()}/year
                    </span>
                  </div>

                  {/* 0% Intro Promo Callout if applicable */}
                  {selectedCardForMath.introPeriodMonths > 0 && (
                    <div className="p-3 bg-blue-500/15 border border-blue-500/30 rounded-xl space-y-0.5">
                      <span className="text-[#38BDF8] text-[10px] uppercase font-black block">
                        5. Bonus: 0% Promo Period ({selectedCardForMath.introPeriodMonths} Months)
                      </span>
                      <span className="text-[#CBD5E1] font-bold block text-xs">
                        Zero interest charged! You save a massive <strong className="text-white">${promoTotalSaving.toLocaleString()}</strong> across the promo window.
                      </span>
                    </div>
                  )}
                </div>
              );
            })()}

            <button
              type="button"
              onClick={() => setSelectedCardForMath(null)}
              className="w-full py-2.5 rounded-xl font-black text-xs bg-[#102244] hover:bg-[#152e5c] text-white border border-[rgba(56,120,210,0.3)] cursor-pointer"
            >
              Close Math Breakdown
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
