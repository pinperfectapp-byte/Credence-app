import React, { useState } from 'react';
import { CreditCardAccount } from '../types/credit';
import { 
  Percent, 
  Flame, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Zap, 
  Info,
  DollarSign,
  ChevronRight
} from 'lucide-react';

interface UtilizationHeatmapProps {
  cards: CreditCardAccount[];
  onNavigateTab?: (tabId: string) => void;
}

export const UtilizationHeatmap: React.FC<UtilizationHeatmapProps> = ({
  cards,
  onNavigateTab,
}) => {
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  // Totals
  const totalLimit = cards.reduce((sum, c) => sum + c.creditLimit, 0);
  const totalBalance = cards.reduce((sum, c) => sum + c.balance, 0);
  const overallUtil = totalLimit > 0 ? (totalBalance / totalLimit) * 100 : 0;

  // Determine utilization heat tier
  const getTierInfo = (rate: number) => {
    if (rate < 10) {
      return {
        name: 'Optimal',
        range: '0% – 9%',
        color: 'emerald',
        bgBadge: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
        scoreImpact: '+30 to +45 pts',
        impactType: 'positive',
        headline: 'Prime Scoring Zone (No Penalty)',
        desc: 'Major credit scoring algorithms reward consumers reporting under 10% with peak available credit points.',
      };
    }
    if (rate < 30) {
      return {
        name: 'Good',
        range: '10% – 29%',
        color: 'sky',
        bgBadge: 'bg-sky-100 dark:bg-sky-950/80 text-sky-800 dark:text-sky-300 border-sky-300 dark:border-sky-800',
        scoreImpact: '+5 to +15 pts',
        impactType: 'neutral-positive',
        headline: 'Safe Healthy Baseline',
        desc: 'Meets the standard 30% guideline without severe penalties, though dropping under 10% unlocks further gains.',
      };
    }
    if (rate < 50) {
      return {
        name: 'Caution',
        range: '30% – 49%',
        color: 'amber',
        bgBadge: 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800',
        scoreImpact: '-10 to -25 pts',
        impactType: 'negative',
        headline: 'First Penalty Threshold Breached',
        desc: 'Crossing 30% flags elevated revolving credit usage, causing immediate 10 to 25 point score compression.',
      };
    }
    if (rate < 75) {
      return {
        name: 'High Risk',
        range: '50% – 74%',
        color: 'orange',
        bgBadge: 'bg-orange-100 dark:bg-orange-950/80 text-orange-800 dark:text-orange-300 border-orange-300 dark:border-orange-800',
        scoreImpact: '-25 to -50 pts',
        impactType: 'severe',
        headline: 'Elevated Risk Drag',
        desc: 'Bureaus interpret carrying over half your available limit as potential debt distress.',
      };
    }
    return {
      name: 'Critical',
      range: '75%+',
      color: 'rose',
      bgBadge: 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800',
      scoreImpact: '-50 to -85+ pts',
      impactType: 'critical',
      headline: 'Severe Maxed-Out Penalty',
      desc: 'Severely damages creditworthiness. Pay down immediately before the next statement closing date.',
    };
  };

  const currentTier = getTierInfo(overallUtil);

  // Cards sorted by highest utilization first (biggest opportunities)
  const cardsWithUtil = cards.map((c) => {
    const rate = c.creditLimit > 0 ? (c.balance / c.creditLimit) * 100 : 0;
    const tier = getTierInfo(rate);

    // Paydown targets
    // Target 1: Under 30% (limit * 0.29)
    const target30Balance = Math.round(c.creditLimit * 0.29);
    const paydownFor30 = Math.max(0, c.balance - target30Balance);

    // Target 2: Under 10% (limit * 0.09)
    const target10Balance = Math.round(c.creditLimit * 0.09);
    const paydownFor10 = Math.max(0, c.balance - target10Balance);

    return {
      ...c,
      rate,
      tier,
      paydownFor30,
      paydownFor10,
    };
  }).sort((a, b) => b.rate - a.rate);

  // Target card for primary guidance (highest utilization card that is > 30% or highest overall)
  const topHighUtilCard = cardsWithUtil.find(c => c.rate >= 30) || cardsWithUtil[0];

  return (
    <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-emerald-500 text-slate-950">
              <Percent className="w-4 h-4 stroke-[2.5]" />
            </span>
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300 font-mono-numeric">
              Credit Score Vitals Engine
            </span>
          </div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
            Color-Coded Utilization Heatmap
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold">
            Credit utilization controls 30% of your total credit score. Monitor your heat level and eliminate score drag.
          </p>
        </div>

        {/* Current Standing Badge */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className={`px-3 py-1 rounded-xl text-xs font-black font-mono-numeric border ${currentTier.bgBadge}`}>
            {currentTier.name} ({overallUtil.toFixed(1)}%)
          </span>
        </div>
      </div>

      {/* 1. Interactive Heatmap Spectrum Bar */}
      <div className="space-y-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
        <div className="flex items-center justify-between text-xs font-mono-numeric font-bold">
          <span className="text-slate-700 dark:text-slate-300">
            Overall Debt-to-Limit Ratio: <strong className="text-slate-950 dark:text-white text-base font-black">${totalBalance.toLocaleString()}</strong> / ${totalLimit.toLocaleString()}
          </span>
          <span className={`font-black ${
            overallUtil >= 30 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
          }`}>
            Score Drag: {currentTier.scoreImpact}
          </span>
        </div>

        {/* Spectrum Gradient Bar with Dynamic Needle */}
        <div className="relative pt-4 pb-2">
          {/* Heat Gradient Track */}
          <div className="h-4 rounded-full overflow-hidden flex shadow-inner">
            <div className="h-full bg-emerald-500 flex-1" title="0-9% Optimal" />
            <div className="h-full bg-sky-500 flex-2" title="10-29% Good" />
            <div className="h-full bg-amber-500 flex-2" title="30-49% Caution" />
            <div className="h-full bg-orange-500 flex-2" title="50-74% High Risk" />
            <div className="h-full bg-rose-600 flex-2" title="75%+ Critical" />
          </div>

          {/* Current Needle Indicator */}
          <div 
            className="absolute top-1 transform -translate-x-1/2 flex flex-col items-center transition-all duration-500"
            style={{ left: `${Math.min(98, Math.max(2, overallUtil))}%` }}
          >
            <div className="px-1.5 py-0.5 rounded-md bg-slate-950 text-white text-[9px] font-black font-mono-numeric shadow-md whitespace-nowrap">
              You: {overallUtil.toFixed(1)}%
            </div>
            <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-slate-950" />
          </div>
        </div>

        {/* Spectrum Legend Labels */}
        <div className="grid grid-cols-5 text-center text-[10px] font-mono-numeric font-bold gap-1 pt-1 text-slate-500 dark:text-slate-400">
          <div className="text-emerald-700 dark:text-emerald-400 font-black">
            <span>&lt; 10%</span>
            <span className="block text-[9px] opacity-75">+45 pts</span>
          </div>
          <div className="text-sky-700 dark:text-sky-400">
            <span>10–29%</span>
            <span className="block text-[9px] opacity-75">+15 pts</span>
          </div>
          <div className="text-amber-700 dark:text-amber-400">
            <span>30–49%</span>
            <span className="block text-[9px] opacity-75">-25 pts</span>
          </div>
          <div className="text-orange-700 dark:text-orange-400">
            <span>50–74%</span>
            <span className="block text-[9px] opacity-75">-50 pts</span>
          </div>
          <div className="text-rose-700 dark:text-rose-400 font-black">
            <span>75%+</span>
            <span className="block text-[9px] opacity-75">-85+ pts</span>
          </div>
        </div>
      </div>

      {/* 2. Card-by-Card Heatmap Breakdown */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white font-mono-numeric flex items-center gap-1.5">
          <Flame className="w-3.5 h-3.5 text-rose-500" />
          <span>Card-by-Card Heatmap Grid</span>
        </h4>

        {cards.length === 0 ? (
          <div className="p-4 text-center text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 rounded-2xl">
            No credit cards loaded. Add cards in your profile to visualize your utilization heatmap.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {cardsWithUtil.map((card) => {
              const isSelected = selectedCardId === card.id;

              // Color classes based on tier
              const barColor = 
                card.tier.color === 'emerald' ? 'bg-emerald-500' :
                card.tier.color === 'sky' ? 'bg-sky-500' :
                card.tier.color === 'amber' ? 'bg-amber-500' :
                card.tier.color === 'orange' ? 'bg-orange-500' :
                'bg-rose-600';

              const borderGlow = 
                card.tier.color === 'rose' || card.tier.color === 'orange'
                  ? 'border-rose-300 dark:border-rose-900/60'
                  : 'border-slate-200 dark:border-slate-800';

              return (
                <div
                  key={card.id}
                  onClick={() => setSelectedCardId(isSelected ? null : card.id)}
                  className={`p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border transition-all cursor-pointer hover:shadow-xs ${borderGlow} ${
                    isSelected ? 'ring-2 ring-emerald-500/40' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 pb-1.5">
                    <div>
                      <h5 className="font-black text-slate-900 dark:text-white text-xs">
                        {card.name}
                      </h5>
                      <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                        {card.bank}
                      </span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black font-mono-numeric border ${card.tier.bgBadge}`}>
                      {card.rate.toFixed(1)}% {card.tier.name}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1 mt-1">
                    <div className="w-full bg-slate-100 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden p-0.5">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                        style={{ width: `${Math.min(100, Math.max(4, card.rate))}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] font-mono-numeric font-bold text-slate-500 dark:text-slate-400">
                      <span>${card.balance.toLocaleString()} balance</span>
                      <span>${card.creditLimit.toLocaleString()} limit</span>
                    </div>
                  </div>

                  {/* Quick drag impact */}
                  <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[10px] font-mono-numeric">
                    <span className="text-slate-500">Impact:</span>
                    <span className={`font-bold ${
                      card.rate >= 30 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                    }`}>
                      {card.tier.scoreImpact}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. Actionable Guidance on Lowering Specific High-Utilization Cards */}
      {topHighUtilCard && (
        <div className="p-4.5 rounded-2xl bg-gradient-to-br from-emerald-50/80 via-emerald-50/40 to-slate-50 dark:from-emerald-950/40 dark:via-slate-900 dark:to-slate-900 border-2 border-emerald-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-xl bg-emerald-500 text-slate-950">
                <Zap className="w-4 h-4 stroke-[2.5]" />
              </span>
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white font-mono-numeric">
                Priority Action Guidance: Lower {topHighUtilCard.name}
              </h4>
            </div>

            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 font-mono-numeric uppercase">
              Largest Score Boost Opportunity
            </span>
          </div>

          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-relaxed">
            <strong className="text-slate-900 dark:text-white">{topHighUtilCard.name}</strong> is currently at <strong className="text-rose-600 dark:text-rose-400 font-black font-mono-numeric">{topHighUtilCard.rate.toFixed(1)}% utilization</strong> (${topHighUtilCard.balance.toLocaleString()} / ${topHighUtilCard.creditLimit.toLocaleString()}). Prioritize this card to eliminate score drag:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono-numeric">
            {/* Step 1: Drop under 30% */}
            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-500 block">
                Target 1: Drop Under 30% Threshold
              </span>
              <div className="text-lg font-black text-slate-900 dark:text-white">
                {topHighUtilCard.paydownFor30 > 0 ? (
                  <>Pay <span className="text-emerald-600 dark:text-emerald-400">${topHighUtilCard.paydownFor30.toLocaleString()}</span></>
                ) : (
                  <span className="text-emerald-600 dark:text-emerald-400">Already &lt; 30%</span>
                )}
              </div>
              <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block">
                Stops negative bureau penalty, estimated <strong className="text-emerald-600 dark:text-emerald-400">+15 to +25 pt recovery</strong>.
              </span>
            </div>

            {/* Step 2: Drop under 10% */}
            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-500 block">
                Target 2: Prime Golden &lt; 10% Zone
              </span>
              <div className="text-lg font-black text-slate-900 dark:text-white">
                {topHighUtilCard.paydownFor10 > 0 ? (
                  <>Pay <span className="text-emerald-600 dark:text-emerald-400">${topHighUtilCard.paydownFor10.toLocaleString()}</span></>
                ) : (
                  <span className="text-emerald-600 dark:text-emerald-400">Already &lt; 10%</span>
                )}
              </div>
              <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block">
                Triggers maximum score algorithm boost, estimated <strong className="text-emerald-600 dark:text-emerald-400">+30 to +45 pt boost</strong>.
              </span>
            </div>
          </div>

          {/* Quick Launcher Action */}
          {onNavigateTab && (
            <div className="pt-2 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onNavigateTab('statement_optimizer')}
                className="px-3.5 py-2 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-500 text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Optimize Statement Closing Date (AZEO)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onNavigateTab('debt_calculator')}
                className="px-3.5 py-2 rounded-xl text-xs font-black bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-50 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <span>Payoff Acceleration Calculator</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
