import React, { useState } from 'react';
import { CreditProfile, ActionPlanItem } from '../types/credit';
import { 
  CheckSquare, 
  Square, 
  ShieldCheck, 
  Layers, 
  ExternalLink, 
  ArrowUpRight,
  TrendingUp,
  Clock,
  ArrowRight
} from 'lucide-react';

interface ActionPlanTabProps {
  profile: CreditProfile;
  onNavigateTab: (tabId: string) => void;
}

export const ActionPlanTab: React.FC<ActionPlanTabProps> = ({ profile, onNavigateTab }) => {
  // Dynamically generate action plan based on user's real credit state
  const highestUtilCard = [...profile.cards].sort(
    (a, b) => (b.balance / (b.creditLimit || 1)) - (a.balance / (a.creditLimit || 1))
  )[0];

  const firstDerogatory = profile.derogatoryItems.find((d) => d.status !== 'Removed');

  const dynamicItems: ActionPlanItem[] = [
    {
      id: 'step_1',
      title: 'Opt-Out of Bureau Lead Lists (Prevent Predatory Hard Pulls)',
      estimatedPoints: 0,
      category: 'Maintenance',
      timeframe: 'Day 1 (5 mins)',
      description: 'Visit OptOutPrescreen.com (the official joint CRA site) or call 1-888-5-OPTOUT to stop bureaus from selling your inquiries to subprime trigger lenders.',
      completed: true,
      impact: 'Medium',
    },
    highestUtilCard && highestUtilCard.balance > 0
      ? {
          id: 'step_2',
          title: `Pre-Pay ${highestUtilCard.name} Before Statement Closes`,
          estimatedPoints: 28,
          category: 'Utilization',
          timeframe: `Day ${Math.max(1, highestUtilCard.statementClosingDay - 3)} of month`,
          description: `Pay balance down to under $20 before the statement closing date (Day ${highestUtilCard.statementClosingDay}) to force the bank to report < 3% utilization to bureaus.`,
          completed: highestUtilCard.isPaidForStatement || false,
          impact: 'Critical',
        }
      : {
          id: 'step_2_alt',
          title: 'Establish Primary Revolving Tradeline',
          estimatedPoints: 35,
          category: 'Building',
          timeframe: 'Week 1',
          description: 'Open a no-annual-fee secured card (Discover it Secured / Capital One Platinum) or credit builder line to begin generating on-time monthly payment data.',
          completed: profile.cards.length > 0,
          impact: 'Critical',
        },
    firstDerogatory
      ? {
          id: 'step_3',
          title: `Mail Section 609 Dispute on ${firstDerogatory.accountName}`,
          estimatedPoints: 48,
          category: 'Dispute',
          timeframe: 'Days 3–7',
          description: `Print formal Certified Mail demand under 15 U.S.C. § 1681i requiring the bureau to verify original contract files or permanently purge the tradeline.`,
          completed: firstDerogatory.status === 'Disputed' || firstDerogatory.status === 'Pending Verification',
          impact: 'Critical',
        }
      : {
          id: 'step_3_alt',
          title: 'Audit Annual Disclosures for Hidden Duplicate Tradelines',
          estimatedPoints: 12,
          category: 'Dispute',
          timeframe: 'Week 2',
          description: 'Download free weekly disclosures at AnnualCreditReport.com and verify all 3 bureaus have identical spelling, addresses, and zero zombie inquiries.',
          completed: false,
          impact: 'High',
        },
    {
      id: 'step_4',
      title: 'Request Soft-Pull Credit Line Increases',
      estimatedPoints: 15,
      category: 'Utilization',
      timeframe: 'Days 15–20',
      description: 'Log into issuer apps (Amex, Discover, Apple Card) and submit soft-inquiry limit increases. Expanding total limit drops utilization automatically.',
      completed: false,
      impact: 'High',
    },
    {
      id: 'step_5',
      title: 'Enroll in Utility & Rent Payment Reporting',
      estimatedPoints: 14,
      category: 'Building',
      timeframe: 'Days 25–30',
      description: 'Connect monthly rent, power, and mobile phone bills to Experian Boost or Self Financial to register positive payment history on non-debt accounts.',
      completed: false,
      impact: 'Medium',
    },
  ];

  const [items, setItems] = useState<ActionPlanItem[]>(dynamicItems);

  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const completedCount = items.filter((i) => i.completed).length;
  const totalPointsPotential = items.reduce((sum, i) => sum + i.estimatedPoints, 0);
  const earnedPoints = items
    .filter((i) => i.completed)
    .reduce((sum, i) => sum + i.estimatedPoints, 0);

  return (
    <div className="space-y-8 pb-8">
      {/* 1. Header Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-6 shadow-sm border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Personalized Tactical Execution Plan</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              30-Day Score Elevation Blueprint
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Step-by-step checklist of high-impact maneuvers to execute during your upcoming credit reporting cycle. Follow this sequence to maximize point yield.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/80 self-start sm:self-auto shrink-0 font-mono-numeric">
            <div>
              <span className="text-[11px] text-slate-400 block uppercase">Completed</span>
              <span className="text-xl font-bold text-white">
                {completedCount} / {items.length}
              </span>
            </div>
            <div className="border-l border-slate-700 pl-4">
              <span className="text-[11px] text-slate-400 block uppercase">Points Yield</span>
              <span className="text-xl font-bold text-emerald-400">
                +{earnedPoints} <span className="text-xs font-normal text-slate-400">/ +{totalPointsPotential}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Checklist Items */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-4 transition-colors">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Action Items ({items.length})
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Check off steps as you execute them
          </span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className="py-4 flex items-start gap-4 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/40 rounded-lg px-2 transition-colors"
            >
              <button
                type="button"
                className="mt-0.5 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                {item.completed ? (
                  <CheckSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Square className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                )}
              </button>

              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`font-bold text-sm ${
                      item.completed
                        ? 'text-slate-400 dark:text-slate-500 line-through'
                        : 'text-slate-900 dark:text-white'
                    }`}
                  >
                    {item.title}
                  </span>

                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm ${
                      item.impact === 'Critical'
                        ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-400'
                        : item.impact === 'High'
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-400'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {item.impact}
                  </span>

                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 font-mono-numeric">
                    +{item.estimatedPoints} pts
                  </span>

                  <span className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1 font-mono-numeric ml-auto">
                    <Clock className="w-3 h-3" />
                    <span>{item.timeframe}</span>
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Deep Dive Jump Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          onClick={() => onNavigateTab('statement_optimizer')}
          className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs hover:border-emerald-500 dark:hover:border-emerald-500 transition-all cursor-pointer flex items-center justify-between"
        >
          <div>
            <span className="text-xs font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
              Tool #1
            </span>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">
              AZEO Statement Date Optimizer
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Calculate exact pre-payment amounts before statement closure dates.
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400" />
        </div>

        <div
          onClick={() => onNavigateTab('legal_toolkit')}
          className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs hover:border-emerald-500 dark:hover:border-emerald-500 transition-all cursor-pointer flex items-center justify-between"
        >
          <div>
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              Tool #2
            </span>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">
              FCRA Section 609 Letter Generator
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Generate certified mail dispute letters with statutory citations.
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400" />
        </div>
      </div>
    </div>
  );
};
