import React, { useState } from 'react';
import { CreditProfile } from '../types/credit';
import { LegalModalTab } from './FooterLegalModal';
import { calculateUtilization, getCreditTier } from '../utils/creditCalculator';
import { FinancialHealthReportModal } from './FinancialHealthReportModal';
import { DownbaseFooter } from './DownbaseFooter';
import { ChidoniqLogo } from './ChidoniqLogo';
import { WhatUsersSay } from './WhatUsersSay';
import { 
  CreditCard, 
  DollarSign, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Lightbulb, 
  Printer, 
  TrendingUp, 
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  Zap,
  ShoppingCart,
  Calendar,
  Lock,
} from 'lucide-react';

interface ScoreOverviewTabProps {
  profile: CreditProfile;
  onNavigateTab: (tabId: string) => void;
  privacyMode?: boolean;
  targetScore?: number;
  onUpdateBaseScore?: (score: number) => void;
  onOpenLegal?: (tab: LegalModalTab) => void;
}

export const ScoreOverviewTab: React.FC<ScoreOverviewTabProps> = ({
  profile,
  onNavigateTab,
  privacyMode = false,
  targetScore = 750,
  onUpdateBaseScore,
  onOpenLegal,
}) => {
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [showScoreModal, setShowScoreModal] = useState<boolean>(false);
  const [customScoreInput, setCustomScoreInput] = useState<string>('');

  // Use score from profile, default to 742 if unconfigured
  const activeScore = profile.baseScore > 0 ? profile.baseScore : 742;
  const { totalBalance, totalLimit, utilizationRate } = calculateUtilization(profile.cards);
  const { tier } = getCreditTier(activeScore);

  // Utilization text from Downbase or 18% as baseline
  const displayUtilization = profile.cards.length > 0 ? `${utilizationRate}%` : '18%';
  const displayAge = profile.creditAgeYears > 0 ? `${profile.creditAgeYears}y 0m` : '4y 2m';

  // SVG Circular Gauge Math
  const radius = 64;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  // Score range 300 to 850
  const scorePercent = Math.min(1, Math.max(0, (activeScore - 300) / 550));
  const strokeDashoffset = circumference - scorePercent * circumference;

  const handleSaveCustomScore = (score: number) => {
    if (onUpdateBaseScore) {
      onUpdateBaseScore(score);
    }
    setShowScoreModal(false);
  };

  return (
    <div className="w-full space-y-5 pb-6 select-none font-sans text-black dark:text-white transition-colors">
      
      {/* ========================================================================= */}
      {/* CHIDONIQ Primary Identity Banner: Pure Light/Dark Contrast */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-3xl p-5 flex items-center justify-between shadow-xs transition-colors">
        <div className="flex items-center gap-3">
          <ChidoniqLogo size={38} animated={false} />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black tracking-tight uppercase text-black dark:text-white font-sans">
                CHIDONIQ
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-black tracking-widest bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 uppercase font-mono-numeric">
                PRO ENGINE
              </span>
            </div>
            <p className="text-[11px] text-neutral-600 dark:text-neutral-400 font-medium">
              Sovereign Credit Solver &amp; In-Browser Financial Hub
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold font-mono-numeric">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>100% PRIVATE</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CARD 1: Credit Score Circular Gauge */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 shadow-xs relative overflow-hidden transition-all">
        {/* Title & Adjust Trigger */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="text-[10px] uppercase font-mono-numeric font-black tracking-wider text-blue-600 dark:text-blue-400">
              Tri-Bureau Baseline
            </span>
            <h2 className="text-xl font-black text-black dark:text-white tracking-tight">
              Credit Score
            </h2>
          </div>
          
          <button
            type="button"
            onClick={() => setShowScoreModal(true)}
            className="px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 text-xs font-bold text-neutral-900 dark:text-neutral-100 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
            title="Adjust Base Score"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Adjust</span>
          </button>
        </div>

        {/* Circular Blue Progress Ring */}
        <div className="flex flex-col items-center justify-center my-3">
          <div className="relative w-44 h-44 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
              {/* Background ring */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="stroke-neutral-200 dark:stroke-neutral-800"
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              {/* Vibrant active progress ring */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke="#2563EB"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-700 ease-out"
              />
            </svg>

            {/* Inside the Ring: Bold Score Number + Score Tier Pill */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className={`text-4xl font-extrabold text-black dark:text-white tracking-tight font-sans transition-all ${
                privacyMode ? 'blur-md' : ''
              }`}>
                {activeScore}
              </span>
              
              <div className="mt-1.5 px-3 py-0.5 rounded-full bg-blue-600 text-white text-[11px] font-bold tracking-wide flex items-center gap-1 shadow-sm">
                <span>{activeScore >= 740 ? 'Very Good' : activeScore >= 670 ? 'Good' : 'Fair'}</span>
                <span>✓</span>
              </div>
            </div>
          </div>

          {/* Subtext below ring */}
          <div className="mt-2 text-xs text-neutral-600 dark:text-neutral-400 font-medium flex items-center gap-2 font-mono-numeric">
            <span>Experian · TransUnion · Equifax</span>
            <span>•</span>
            <span className="text-blue-600 dark:text-blue-400 font-bold">Target: {targetScore}</span>
          </div>
        </div>

        {/* Quick action button inside Card 1 */}
        <div className="mt-4 pt-3.5 border-t border-neutral-100 dark:border-neutral-900 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={() => onNavigateTab('compare')}
            className="text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <DollarSign className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Card Compare &amp; APR Savings</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab('compare')}
            className="text-blue-600 dark:text-blue-400 font-bold flex items-center gap-0.5 cursor-pointer"
          >
            <span>Open Tool</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CARD 2: Score Factors (3 Core Drivers) */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-3xl p-5 shadow-xs space-y-4 transition-colors">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-black dark:text-white tracking-tight">
            FICO Score Factors
          </h3>
          <span className="text-[10px] font-mono-numeric text-neutral-500">
            Weighted Algorithm
          </span>
        </div>

        <div className="space-y-3 text-xs font-semibold">
          {/* Row 1: Payment History • 35% Weight */}
          <div 
            onClick={() => onNavigateTab('bills')}
            className="flex items-center justify-between p-3 rounded-2xl bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-900/60 dark:hover:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-black dark:text-white">Payment History (35%)</span>
                <span className="text-neutral-400">•</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  {profile.derogatoryItems.length === 0 ? 'Excellent · 100% On-Time' : `${profile.derogatoryItems.length} Issues`}
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400" />
          </div>

          {/* Row 2: Credit Utilization • 30% Weight */}
          <div 
            onClick={() => onNavigateTab('statement_optimizer')}
            className="flex items-center justify-between p-3 rounded-2xl bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-900/60 dark:hover:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <CreditCard className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-black dark:text-white">Credit Utilization (30%)</span>
                <span className="text-neutral-400">•</span>
                <span className={`text-blue-600 dark:text-blue-400 font-bold ${privacyMode ? 'blur-xs' : ''}`}>
                  {displayUtilization} (Target &lt; 9%)
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400" />
          </div>

          {/* Row 3: Account Age • 15% Weight */}
          <div 
            onClick={() => onNavigateTab('track')}
            className="flex items-center justify-between p-3 rounded-2xl bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-900/60 dark:hover:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-black dark:text-white">Credit Age (15%)</span>
                <span className="text-neutral-400">•</span>
                <span className="text-neutral-700 dark:text-neutral-300">
                  {displayAge} Average
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400" />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* COMPREHENSIVE CREDIT PROBLEM-SOLVER HUB: 6 Specialized Solvers */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-3xl p-5 shadow-xs space-y-3.5 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-black dark:text-white tracking-tight">
                Solve Any Credit Problem
              </h3>
              <p className="text-[10px] text-neutral-500">
                Immediate, mathematical credit solutions
              </p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-[10px] font-bold text-blue-600 dark:text-blue-400 font-mono-numeric">
            6 Specialized Solvers
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Solver 1: High Utilization & Instant Points */}
          <div
            onClick={() => onNavigateTab('statement_optimizer')}
            className="p-3.5 rounded-2xl bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-900/60 dark:hover:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 transition-all cursor-pointer flex flex-col justify-between space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-bold text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  AZEO Balance Optimizer
                </span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-bold font-mono-numeric">
                +20 to +45 pts
              </span>
            </div>
            <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-snug">
              Eliminate the FICO utilization penalty by reporting $5 on 1 card and $0 on all others before statement close.
            </p>
            <div className="flex items-center gap-1 text-[10px] font-bold text-blue-600 dark:text-blue-400">
              <span>Calculate AZEO Dates</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* Solver 2: Bureau Disputes & Derogatory Marks */}
          <div
            onClick={() => onNavigateTab('bureau_disputes')}
            className="p-3.5 rounded-2xl bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-900/60 dark:hover:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 transition-all cursor-pointer flex flex-col justify-between space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-bold text-black dark:text-white group-hover:text-amber-500 transition-colors">
                  FCRA § 1681 Dispute Hub
                </span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 font-bold font-mono-numeric">
                30-Day Clock
              </span>
            </div>
            <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-snug">
              Force credit bureaus to verify or delete unverified late marks, collections, or inaccuracies under federal law.
            </p>
            <div className="flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400">
              <span>Generate Audit Letters</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* Solver 3: High APR Interest Trap */}
          <div
            onClick={() => onNavigateTab('compare')}
            className="p-3.5 rounded-2xl bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-900/60 dark:hover:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 transition-all cursor-pointer flex flex-col justify-between space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-bold text-black dark:text-white group-hover:text-emerald-600 transition-colors">
                  Slash High APR &amp; Compare
                </span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-bold font-mono-numeric">
                Cut 10%+ APR
              </span>
            </div>
            <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-snug">
              Model balance transfers from 29% APR down to 0% promo rates. Save hundreds annually in compound interest.
            </p>
            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
              <span>Run APR Savings Math</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* Solver 4: Unauthorized Hard Inquiries */}
          <div
            onClick={() => onNavigateTab('inquiries_tracker')}
            className="p-3.5 rounded-2xl bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-900/60 dark:hover:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 transition-all cursor-pointer flex flex-col justify-between space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-indigo-500" />
                <span className="text-xs font-bold text-black dark:text-white group-hover:text-indigo-500 transition-colors">
                  Inquiry Shield &amp; Timer
                </span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold font-mono-numeric">
                24-Mo Clock
              </span>
            </div>
            <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-snug">
              Track hard pulls across bureaus, dispute inquiries lacking permissible purpose, and view recovery dates.
            </p>
            <div className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
              <span>View Inquiry Shield</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* Solver 5: Score Under 720 / Thin File */}
          <div
            onClick={() => onNavigateTab('score_boost')}
            className="p-3.5 rounded-2xl bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-900/60 dark:hover:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 transition-all cursor-pointer flex flex-col justify-between space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-sky-500" />
                <span className="text-xs font-bold text-black dark:text-white group-hover:text-sky-500 transition-colors">
                  ScoreBoost Lab &amp; Simulator
                </span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-400 font-bold font-mono-numeric">
                Pre-Test Actions
              </span>
            </div>
            <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-snug">
              Simulate credit actions (paying down balances, opening trade lines) before taking them to avoid score penalties.
            </p>
            <div className="flex items-center gap-1 text-[10px] font-bold text-sky-600 dark:text-sky-400">
              <span>Simulate Score Impact</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* Solver 6: Due Date Missed Prevention (35% Factor) */}
          <div
            onClick={() => onNavigateTab('bills')}
            className="p-3.5 rounded-2xl bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-900/60 dark:hover:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 transition-all cursor-pointer flex flex-col justify-between space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-bold text-black dark:text-white group-hover:text-emerald-600 transition-colors">
                  BillGuard On-Time Watchdog
                </span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-bold font-mono-numeric">
                Zero Late Marks
              </span>
            </div>
            <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-snug">
              A single 30-day late mark can drop a 750 score by 60-110 points. BillGuard keeps your payment record flawless.
            </p>
            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
              <span>Open BillGuard</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CARD 4: Insights */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-3xl p-5 shadow-xs flex items-center justify-between gap-4 transition-colors">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-mono-numeric font-black tracking-wider text-blue-600 dark:text-blue-400">
              Automated Analysis
            </span>
          </div>
          <h3 className="text-sm font-extrabold text-black dark:text-white tracking-tight">
            Algorithm Optimization Insight
          </h3>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Your file is prime. Maintain statement balances under 3% and keep existing trade lines active to reach 780+.
          </p>
        </div>

        <div className="w-10 h-10 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center shrink-0">
          <Lightbulb className="w-5 h-5 text-amber-500 stroke-[2]" />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FEATURED: Grocery Card Saver (Cashback Optimizer across 12 US Cards) */}
      {/* ========================================================================= */}
      <div 
        onClick={() => onNavigateTab('grocery_saver')}
        className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 hover:border-black dark:hover:border-white rounded-3xl p-4.5 shadow-xs flex items-center justify-between gap-3 transition-all cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <ShoppingCart className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-extrabold text-black dark:text-white">
                Grocery Card Saver
              </h3>
              <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold font-mono-numeric">
                6% Max
              </span>
            </div>
            <p className="text-[11px] text-neutral-600 dark:text-neutral-400 line-clamp-1">
              Pure math calculator: Compare 12 supermarket credit cards
            </p>
          </div>
        </div>

        <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 shrink-0">
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>

      {/* Supplementary Financial Health Report Drawer Button */}
      <div className="pt-1 flex items-center justify-between px-1 text-xs">
        <button
          type="button"
          onClick={() => setShowReportModal(true)}
          className="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer py-1"
        >
          <Printer className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>Export Print-Ready Credit Dossier (PDF)</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigateTab('statement_optimizer')}
          className="text-neutral-600 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 transition-colors cursor-pointer py-1"
        >
          <span>AZEO Optimizer</span>
          <ArrowRight className="w-3 h-3 text-blue-600 dark:text-blue-400" />
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SOCIAL PROOF: WHAT USERS SAY (DYNAMIC TESTIMONIALS & ZERO MOCK DATA) */}
      {/* ========================================================================= */}
      <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
        <WhatUsersSay />
      </div>

      {/* Adjust Score Modal */}
      {showScoreModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 font-sans"
          onClick={() => setShowScoreModal(false)}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-black border border-neutral-300 dark:border-neutral-800 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl text-black dark:text-white animate-pop-in"
          >
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
              <h3 className="font-extrabold text-base">Adjust Tri-Bureau Score</h3>
              <span className="text-xs font-mono-numeric font-bold text-blue-600 dark:text-blue-400">
                {activeScore}
              </span>
            </div>

            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              Select a standard score or type your custom bureau credit score:
            </p>

            <div className="grid grid-cols-4 gap-2">
              {[620, 680, 742, 780].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleSaveCustomScore(s)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer font-mono-numeric ${
                    activeScore === s
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-800'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="pt-2">
              <label className="block text-[11px] font-bold text-neutral-600 dark:text-neutral-400 uppercase mb-1">
                Custom Score (300 - 850)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="300"
                  max="850"
                  value={customScoreInput}
                  onChange={(e) => setCustomScoreInput(e.target.value)}
                  placeholder="e.g. 742"
                  className="flex-1 px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-xl text-sm font-bold text-black dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    const parsed = parseInt(customScoreInput, 10);
                    if (parsed >= 300 && parsed <= 850) {
                      handleSaveCustomScore(parsed);
                    }
                  }}
                  className="px-4 py-2 bg-black hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-black text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-md"
                >
                  Apply
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowScoreModal(false)}
              className="w-full py-2 text-center text-xs font-bold text-neutral-500 hover:text-black dark:hover:text-white transition-colors cursor-pointer pt-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Print-Ready PDF Report Modal */}
      {showReportModal && (
        <FinancialHealthReportModal
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          profile={profile}
        />
      )}

      {/* Downbase Footer Features Section */}
      <div className="pt-2">
        <DownbaseFooter
          onOpenLegal={onOpenLegal || (() => {})}
          onNavigateTab={onNavigateTab}
        />
      </div>

    </div>
  );
};
