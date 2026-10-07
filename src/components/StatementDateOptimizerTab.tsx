import React, { useState } from 'react';
import { CreditCardAccount } from '../types/credit';
import { 
  Calendar, 
  Clock, 
  TrendingUp, 
  HelpCircle, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight,
  Zap,
  Info
} from 'lucide-react';

interface StatementDateOptimizerProps {
  cards: CreditCardAccount[];
  onToggleCardPaid: (cardId: string) => void;
  onUpdateCardBalance: (cardId: string, newBalance: number) => void;
  onOpenProfileModal?: () => void;
  onAddSampleCards?: () => void;
}

export const StatementDateOptimizerTab: React.FC<StatementDateOptimizerProps> = ({
  cards,
  onToggleCardPaid,
  onUpdateCardBalance,
  onOpenProfileModal,
  onAddSampleCards,
}) => {
  const [azeoModeActive, setAzeoModeActive] = useState<boolean>(true);
  const [showAzeoExplainer, setShowAzeoExplainer] = useState<boolean>(false);

  // Current day of month for calculation
  const currentDay = 4; // Reference day of month

  // Calculate current vs optimized utilization
  const totalLimit = cards.reduce((sum, c) => sum + c.creditLimit, 0);
  const currentTotalBalance = cards.reduce((sum, c) => sum + c.balance, 0);
  const currentUtil = totalLimit > 0 ? (currentTotalBalance / totalLimit) * 100 : 0;

  // AZEO calculation: pick the primary card (lowest APR or highest limit) to hold $15, others $0
  const sortedCards = [...cards].sort((a, b) => b.creditLimit - a.creditLimit);
  const azeoReportingCardId = sortedCards[0]?.id;

  const simulatedTotalBalance = cards.reduce((sum, c) => {
    if (c.isPaidForStatement) {
      return sum + (c.id === azeoReportingCardId ? 15 : 0);
    }
    return sum + c.balance;
  }, 0);
  const simulatedUtil = totalLimit > 0 ? (simulatedTotalBalance / totalLimit) * 100 : 0;

  return (
    <div className="space-y-8 pb-8">
      {/* 1. Header Banner & Education */}
      <div className="bg-emerald-950 dark:bg-emerald-950/80 text-emerald-50 rounded-xl p-6 border border-emerald-900 shadow-xs relative overflow-hidden">
        <div className="max-w-3xl relative z-10">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold mb-2">
            <Zap className="w-4 h-4" />
            <span>The #1 Secret of the US Credit Reporting System</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Statement Closing Date vs. Payment Due Date
          </h2>
          <p className="text-xs sm:text-sm text-emerald-200 mt-2 leading-relaxed">
            Most Americans pay their card on the <strong className="text-white">Payment Due Date</strong>, not realizing that credit card issuers take a balance snapshot on the <strong className="text-white">Statement Closing Date</strong> (usually 21–25 days earlier). Even if you pay off your card in full, high intermediate balances are transmitted to Experian, TransUnion, and Equifax.
          </p>
        </div>

        {/* AZEO Mode Switcher */}
        <div className="mt-6 pt-4 border-t border-emerald-900/80 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setAzeoModeActive(!azeoModeActive)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                azeoModeActive ? 'bg-emerald-500' : 'bg-emerald-900'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  azeoModeActive ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
            <span className="text-sm font-semibold text-white">
              Activate AZEO (All Zero Except One) Strategy
            </span>
            <button
              onClick={() => setShowAzeoExplainer(!showAzeoExplainer)}
              className="text-emerald-400 hover:text-emerald-300 ml-1 text-xs underline cursor-pointer"
            >
              How it works?
            </button>
          </div>

          <div className="text-xs text-emerald-300 font-mono-numeric">
            Impact: <span className="text-white font-bold">{currentUtil.toFixed(1)}%</span> → <span className="text-emerald-400 font-bold">{simulatedUtil.toFixed(1)}%</span> utilization
          </div>
        </div>

        {showAzeoExplainer && (
          <div className="mt-4 p-4 bg-emerald-900/60 rounded-lg text-xs text-emerald-100 leading-relaxed border border-emerald-700/60">
            <h4 className="font-bold text-white mb-1">Why Not $0 on All Cards? (The FICO Zero Penalty)</h4>
            <p>
              If all of your credit cards report a $0 balance on the statement closing date, FICO assesses a 12–18 point penalty for &ldquo;dormant revolving credit usage.&rdquo;
              The optimal mathematical strategy used by credit masters is <strong>AZEO</strong>: pay every card down to $0 before its statement date, except ONE primary card which you leave reporting between $10 and $20 (under 3% utilization). This triggers maximum points for active responsible usage!
            </p>
          </div>
        )}
      </div>

      {/* 2. Real-time Utilization Shift Box */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs transition-colors">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">Current Reported Utilization</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono-numeric">
              {currentUtil.toFixed(1)}%
            </span>
            <span className="text-xs font-medium text-amber-600 dark:text-amber-400">High Risk Threshold</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-mono-numeric">
            Total reported balance: ${currentTotalBalance.toLocaleString()}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs transition-colors">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">Optimized Statement Balance</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono-numeric">
              {simulatedUtil.toFixed(1)}%
            </span>
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded-sm">
              FICO Peak Tier (&lt; 3%)
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-mono-numeric">
            Target reported balance: ${simulatedTotalBalance.toLocaleString()}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col justify-between transition-colors">
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">Estimated Point Surge</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-emerald-700 dark:text-emerald-400 font-mono-numeric flex items-center">
                <TrendingUp className="w-5 h-5 mr-1" />
                +{Math.min(45, Math.max(15, Math.round((currentUtil - simulatedUtil) * 0.75)))}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">points</span>
            </div>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-2">
            Reflected on bureaus within 2–5 days of statement closure.
          </p>
        </div>
      </div>

      {/* 3. Card-by-Card Statement Scheduler */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-2">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Card Statement &amp; Payment Calendar
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Pay the target amount on the recommended date to lock in maximum credit score points.
            </p>
          </div>
          {onOpenProfileModal && (
            <button
              onClick={onOpenProfileModal}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 rounded-lg transition-colors cursor-pointer self-start sm:self-auto"
            >
              + Add Credit Card
            </button>
          )}
        </div>

        {cards.length === 0 ? (
          <div className="py-12 px-4 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-6 h-6 text-slate-400" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">No Credit Cards Logged</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
              Add your open credit cards with their Statement Closing Dates to start calculating your AZEO balances and eliminate utilization reporting penalties.
            </p>
            <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
              {onOpenProfileModal && (
                <button
                  onClick={onOpenProfileModal}
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                >
                  + Add Custom Card
                </button>
              )}
              {onAddSampleCards && (
                <button
                  onClick={onAddSampleCards}
                  className="px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors cursor-pointer border border-emerald-300 shadow-xs"
                >
                  + Quick-Load Sample Cards (Chase &amp; Discover)
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800 mt-2">
            {cards.map((card) => {
              const cardUtil = (card.balance / card.creditLimit) * 100;
              const isAzeoTarget = card.id === azeoReportingCardId;
              const targetBalance = isAzeoTarget ? 15 : 0;
              const recommendedPayment = Math.max(0, card.balance - targetBalance);

              // Days until statement close
              let daysUntilClose = card.statementClosingDay - currentDay;
              if (daysUntilClose < 0) daysUntilClose += 30;

              const isUrgent = daysUntilClose <= 5;

              return (
                <div
                  key={card.id}
                  className="py-5 flex flex-col lg:flex-row lg:items-center justify-between gap-5 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 rounded-lg px-3 transition-colors"
                >
                  {/* Left Card Info */}
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">
                        {card.name}
                      </span>
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        ({card.bank})
                      </span>
                      {isAzeoTarget && azeoModeActive && (
                        <span className="text-xs font-bold px-2 py-0.5 rounded-sm bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                          Primary AZEO Reporting Card ($15 Target)
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-xs font-mono-numeric">
                      <span className="text-slate-600 dark:text-slate-300">
                        Current: <strong className="text-slate-900 dark:text-white">${card.balance.toLocaleString()}</strong> / ${card.creditLimit.toLocaleString()}
                      </span>
                      <span className="text-slate-400">·</span>
                      <span className={cardUtil > 30 ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-slate-600 dark:text-slate-300'}>
                        {cardUtil.toFixed(0)}% Util
                      </span>
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-500 dark:text-slate-400">
                        {card.apr}% APR
                      </span>
                    </div>

                    {/* Timeline visualization */}
                    <div className="text-xs flex items-center gap-2 pt-1">
                      <span className="text-slate-500 dark:text-slate-400">
                        Statement Closes: <strong>Day {card.statementClosingDay}</strong>
                      </span>
                      <span className="text-slate-400">→</span>
                      <span className="text-slate-500 dark:text-slate-400">
                        Due Date: <strong>Day {card.paymentDueDay}</strong>
                      </span>
                      <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-sm ml-2 ${
                        isUrgent ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}>
                        {daysUntilClose} days left
                      </span>
                    </div>
                  </div>

                  {/* Right: The Exact Action Instruction */}
                  <div className="flex items-center justify-between lg:justify-end gap-6 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 shrink-0">
                    <div className="text-left lg:text-right">
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block uppercase tracking-wider">
                        Pay by Day {Math.max(1, card.statementClosingDay - 2)}:
                      </span>
                      <span className="text-lg font-bold text-emerald-700 dark:text-emerald-400 font-mono-numeric">
                        ${recommendedPayment.toLocaleString()}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                        Leave ${targetBalance} balance for bureau
                      </span>
                    </div>

                    <button
                      onClick={() => onToggleCardPaid(card.id)}
                      className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                        card.isPaidForStatement
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                      }`}
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>{card.isPaidForStatement ? 'Paid for Stmt' : 'Mark as Paid'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
