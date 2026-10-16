import React, { useState } from 'react';
import { CreditProfile } from '../types/credit';
import { getCreditTier, calculateFinancialImpact } from '../utils/creditCalculator';
import { 
  Sliders, 
  RotateCcw, 
  TrendingUp, 
  TrendingDown, 
  ShieldAlert, 
  DollarSign, 
  Award, 
  UserPlus, 
  CreditCard,
  Building,
  Check
} from 'lucide-react';

interface ScoreSimulatorTabProps {
  profile: CreditProfile;
}

export const ScoreSimulatorTab: React.FC<ScoreSimulatorTabProps> = ({ profile }) => {
  // Simulator states
  const totalRevolvingDebt = profile.cards.reduce((sum, c) => sum + c.balance, 0);
  const totalLimit = profile.cards.reduce((sum, c) => sum + c.creditLimit, 0);

  const [paydownAmount, setPaydownAmount] = useState<number>(Math.min(500, totalRevolvingDebt));
  const [creditLimitIncrease, setCreditLimitIncrease] = useState<number>(0);
  const [removeDerogatory, setRemoveDerogatory] = useState<boolean>(profile.derogatoryItems.length > 0);
  const [authorizedUserBonus, setAuthorizedUserBonus] = useState<boolean>(false);
  const [rentReportingBonus, setRentReportingBonus] = useState<boolean>(false);
  const [newHardInquiry, setNewHardInquiry] = useState<boolean>(false);
  const [missedPaymentTest, setMissedPaymentTest] = useState<boolean>(false);

  // Compute simulated score
  let delta = 0;

  // 1. Debt paydown impact
  const actualPaydown = Math.min(paydownAmount, totalRevolvingDebt);
  if (totalLimit > 0) {
    const originalUtil = (totalRevolvingDebt / totalLimit) * 100;
    const newUtil = Math.max(0, ((totalRevolvingDebt - actualPaydown) / (totalLimit + creditLimitIncrease)) * 100);
    const utilDrop = originalUtil - newUtil;
    delta += Math.round(utilDrop * 0.7); // 1% util drop ~ 0.7 score pts on average
  }

  // 2. Soft-pull limit increase impact
  if (creditLimitIncrease > 0 && totalLimit > 0) {
    delta += Math.min(18, Math.round((creditLimitIncrease / totalLimit) * 10));
  }

  // 3. Removal of derogatory mark
  if (removeDerogatory && profile.derogatoryItems.length > 0) {
    delta += 48; // Seminal point surge for wiping clean a collection/medical item
  }

  // 4. Authorized user seasoned tradeline
  if (authorizedUserBonus) {
    delta += 24; // Piggybacking onto seasoned card
  }

  // 5. Rent & utility reporting
  if (rentReportingBonus) {
    delta += 14; // Experian Boost / RentTrack
  }

  // 6. Hard inquiry penalty
  if (newHardInquiry) {
    delta -= 7;
  }

  // 7. Catastrophic 30-day late payment mark
  if (missedPaymentTest) {
    delta -= 75; // Severe penalty on prime scores
  }

  const base = profile.baseScore > 0 ? profile.baseScore : 650;
  const simulatedScore = Math.min(850, Math.max(300, base + delta));
  const currentTierInfo = getCreditTier(base);
  const simulatedTierInfo = getCreditTier(simulatedScore);

  // Financial impact calculation
  const currentSavings = calculateFinancialImpact(base);
  const simulatedSavings = calculateFinancialImpact(simulatedScore);
  const monthlyMortgageSavings = Math.max(0, currentSavings.mortgageMonthly - simulatedSavings.mortgageMonthly);
  const lifetimeMortgageSavings = Math.max(0, currentSavings.mortgageLifetimeSavings - simulatedSavings.mortgageLifetimeSavings);

  const resetAll = () => {
    setPaydownAmount(Math.min(500, totalRevolvingDebt));
    setCreditLimitIncrease(0);
    setRemoveDerogatory(profile.derogatoryItems.length > 0);
    setAuthorizedUserBonus(false);
    setRentReportingBonus(false);
    setNewHardInquiry(false);
    setMissedPaymentTest(false);
  };

  return (
    <div className="space-y-8 pb-8">
      {/* 1. Simulator Header & Reset */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
              <Sliders className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Real-Time US Credit Algorithm Engine</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Interactive Credit Score Simulator
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-xl leading-relaxed">
              Test potential financial decisions before making them. See how paying debt, wiping collections, or asking for credit line increases impacts your score and loan costs.
            </p>
          </div>

          <button
            onClick={resetAll}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5 self-start sm:self-center shrink-0 cursor-pointer border border-slate-200 dark:border-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>Reset Simulation</span>
          </button>
        </div>
      </div>

      {/* 2. Side-by-side Score Projection Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-900 text-white rounded-xl p-6 shadow-sm border border-slate-800">
        {/* Current Score */}
        <div className="flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800 pb-4 md:pb-0 md:pr-4">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Current Score
          </span>
          <div className="my-2">
            <span className="text-4xl sm:text-5xl font-extrabold font-mono-numeric text-white">
              {profile.baseScore > 0 ? profile.baseScore : '--'}
            </span>
            <span className="text-xs text-slate-400 block mt-1">
              Tier: <strong className="text-slate-200">{currentTierInfo.tier}</strong>
            </span>
          </div>
          <span className="text-xs text-slate-400">
            Based on active consumer report
          </span>
        </div>

        {/* Projected Score with Delta */}
        <div className="flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800 pb-4 md:pb-0 md:pr-4">
          <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">
            Projected Score
          </span>
          <div className="my-2 flex items-baseline gap-3">
            <span className="text-4xl sm:text-5xl font-extrabold font-mono-numeric text-emerald-400">
              {simulatedScore}
            </span>
            <div
              className={`text-sm font-bold font-mono-numeric flex items-center ${
                delta >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {delta >= 0 ? (
                <>
                  <TrendingUp className="w-4 h-4 mr-1 inline" />
                  +{delta} pts
                </>
              ) : (
                <>
                  <TrendingDown className="w-4 h-4 mr-1 inline" />
                  {delta} pts
                </>
              )}
            </div>
          </div>
          <span className="text-xs text-slate-300">
            Projected Tier: <strong className="text-white">{simulatedTierInfo.tier}</strong>
          </span>
        </div>

        {/* Real Savings Yield */}
        <div className="flex flex-col justify-between">
          <span className="text-xs font-medium text-sky-400 uppercase tracking-wider">
            Mortgage Impact ($350k)
          </span>
          <div className="my-2">
            <div className="text-2xl sm:text-3xl font-bold font-mono-numeric text-white">
              ${monthlyMortgageSavings > 0 ? `${monthlyMortgageSavings}/mo` : '$0/mo'}
            </div>
            <span className="text-xs text-sky-300 block mt-1">
              {lifetimeMortgageSavings > 0
                ? `Saves $${lifetimeMortgageSavings.toLocaleString()} in interest`
                : 'Maintain current rate tier'}
            </span>
          </div>
          <span className="text-xs text-slate-400 font-mono-numeric">
            New APR: {simulatedSavings.mortgageApr}% (was {currentSavings.mortgageApr}%)
          </span>
        </div>
      </div>

      {/* 3. Interactive Scenario Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Financial Balances & Limits */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-6 transition-colors">
          <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Balances &amp; Credit Limits</span>
          </h3>

          {/* Slider 1: Pay Down Debt */}
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-slate-800 dark:text-slate-300">
                Pay Down Revolving Debt:
              </span>
              <span className="font-mono-numeric font-bold text-emerald-700 dark:text-emerald-400 text-sm">
                ${paydownAmount.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max={Math.max(5000, totalRevolvingDebt)}
              step="100"
              value={paydownAmount}
              onChange={(e) => setPaydownAmount(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-mono-numeric">
              <span>$0</span>
              <span>Total Current: ${totalRevolvingDebt.toLocaleString()}</span>
              <span>${Math.max(5000, totalRevolvingDebt).toLocaleString()}</span>
            </div>
          </div>

          {/* Slider 2: Soft Pull Limit Increase */}
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-slate-800 dark:text-slate-300">
                Request Soft-Pull Credit Limit Increase:
              </span>
              <span className="font-mono-numeric font-bold text-sky-700 dark:text-sky-400 text-sm">
                +${creditLimitIncrease.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="10000"
              step="500"
              value={creditLimitIncrease}
              onChange={(e) => setCreditLimitIncrease(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-mono-numeric">
              <span>$0</span>
              <span>+$5,000</span>
              <span>+$10,000</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Expanding your total credit limit lowers your utilization ratio without spending cash.
            </p>
          </div>
        </div>

        {/* Right: Positive Boost Strategies & Warnings */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-4 transition-colors">
          <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Bureau Strategies &amp; Events</span>
          </h3>

          {/* Toggle: Disputed Item Removal */}
          {profile.derogatoryItems.length > 0 && (
            <div
              onClick={() => setRemoveDerogatory(!removeDerogatory)}
              className={`p-3.5 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                removeDerogatory
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750'
              }`}
            >
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  Erase Disputed Collection / Late Mark
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Full removal via FCRA Section 611 30-day reinvestigation.
                </span>
              </div>
              <span className="text-xs font-bold font-mono-numeric text-emerald-700 dark:text-emerald-400">
                +48 pts
              </span>
            </div>
          )}

          {/* Toggle: Authorized User */}
          <div
            onClick={() => setAuthorizedUserBonus(!authorizedUserBonus)}
            className={`p-3.5 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
              authorizedUserBonus
                ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750'
            }`}
          >
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                Add Seasoned Authorized User Tradeline
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Inherit 5+ years of perfect on-time history from a family member.
              </span>
            </div>
            <span className="text-xs font-bold font-mono-numeric text-emerald-700 dark:text-emerald-400">
              +24 pts
            </span>
          </div>

          {/* Toggle: Rent Reporting */}
          <div
            onClick={() => setRentReportingBonus(!rentReportingBonus)}
            className={`p-3.5 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
              rentReportingBonus
                ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750'
            }`}
          >
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                Opt-in Utility &amp; Rent Reporting (Experian Boost)
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Reports telecom, power, and rent as positive tradelines.
              </span>
            </div>
            <span className="text-xs font-bold font-mono-numeric text-emerald-700 dark:text-emerald-400">
              +14 pts
            </span>
          </div>

          {/* Toggle: Hard Inquiry */}
          <div
            onClick={() => setNewHardInquiry(!newHardInquiry)}
            className={`p-3.5 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
              newHardInquiry
                ? 'bg-rose-50/70 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800'
                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750'
            }`}
          >
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                Apply for New Credit Card (Hard Pull)
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Lenders assess small risk penalty for new credit applications.
              </span>
            </div>
            <span className="text-xs font-bold font-mono-numeric text-rose-700 dark:text-rose-400">
              -7 pts
            </span>
          </div>

          {/* Toggle: Missed Payment */}
          <div
            onClick={() => setMissedPaymentTest(!missedPaymentTest)}
            className={`p-3.5 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
              missedPaymentTest
                ? 'bg-rose-50/70 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800'
                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750'
            }`}
          >
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                Miss a 30-Day Payment Deadline
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Warning: First late payment severely damages high scores.
              </span>
            </div>
            <span className="text-xs font-bold font-mono-numeric text-rose-700 dark:text-rose-400">
              -75 pts
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
