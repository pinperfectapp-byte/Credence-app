import React, { useState } from 'react';
import { CreditProfile } from '../types/credit';
import { ScoreGauge } from './ScoreGauge';
import { DownbaseFooter } from './DownbaseFooter';
import { LegalModalTab } from './FooterLegalModal';
import { calculateUtilization, evaluatePillars, calculateFinancialImpact, getCreditTier } from '../utils/creditCalculator';
import { 
  CreditCard, 
  DollarSign, 
  Home, 
  Car, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle,
  Calendar,
  Printer,
  ShieldCheck,
  FileDown,
  Target,
  Trophy,
  TrendingUp,
  Percent,
  Scale,
  Zap,
  ShoppingCart
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
  const [selectedBureau, setSelectedBureau] = useState<'all' | 'experian' | 'transUnion' | 'equifax'>('all');

  // Core Math Diagnostics
  const { totalBalance, totalLimit, utilizationRate, isHigh } = calculateUtilization(profile.cards);
  const pillars = evaluatePillars(profile);
  const savings = calculateFinancialImpact(profile.baseScore);
  const { tier } = getCreditTier(profile.baseScore);

  // Selected bureau score resolution
  const displayScore = 
    selectedBureau === 'experian' ? profile.bureaus.experian :
    selectedBureau === 'transUnion' ? profile.bureaus.transUnion :
    selectedBureau === 'equifax' ? profile.bureaus.equifax :
    profile.baseScore;

  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // Export Report Feature: triggers browser window.print() using print stylesheet for clean PDF export
  const handleExportReport = () => {
    window.print();
  };

  // Target score gap calculations
  const effectiveCurrentScore = profile.baseScore > 0 ? profile.baseScore : 650;
  const scoreGap = targetScore - effectiveCurrentScore;
  const isGoalReached = effectiveCurrentScore >= targetScore;
  const normalizedCurr = Math.max(0, effectiveCurrentScore - 300);
  const normalizedTgt = Math.max(1, targetScore - 300);
  const targetProgressRatio = Math.min(1, Math.max(0, normalizedCurr / normalizedTgt));
  const targetProgressPct = Math.round(targetProgressRatio * 100);

  // SVG mini circular progress
  const miniRadius = 20;
  const miniCircumference = 2 * Math.PI * miniRadius;
  const miniOffset = miniCircumference - (targetProgressPct / 100) * miniCircumference;

  const isBrandNewFile = profile.baseScore === 0;

  return (
    <div className="space-y-4 w-full max-w-full overflow-x-hidden">
      {/* ========================================================================= */}
      {/* PRINT-ONLY EXECUTIVE DOSSIER VIEW (Appears exclusively when exporting PDF) */}
      {/* ========================================================================= */}
      <div className="print-only space-y-4 text-slate-900 bg-white p-4">
        {/* Print Header */}
        <div className="border-b-2 border-slate-900 pb-3 flex justify-between items-start">
          <div>
            <h1 className="text-xl font-black tracking-tight text-slate-950 uppercase">
              CREDENCE CONSUMER CREDIT DOSSIER
            </h1>
            <p className="text-[10px] text-slate-600 mt-0.5">
              Official Tri-Bureau Standing &amp; Mathematical Evaluation
            </p>
          </div>
          <div className="text-right text-[10px]">
            <span className="font-bold block">DATE: {currentDate}</span>
            <span className="text-slate-500 font-mono-numeric">REF: CRD-{Date.now().toString().slice(-8)}</span>
          </div>
        </div>

        {/* Consumer Subject Identification */}
        <div className="grid grid-cols-2 gap-3 text-xs p-3 bg-slate-50 border border-slate-300 rounded-lg">
          <div>
            <span className="text-slate-500 uppercase font-semibold text-[9px] block">Subject:</span>
            <span className="font-bold text-slate-900 text-xs">{profile.name || 'Primary File Holder'}</span>
            <p className="text-slate-700 text-[10px]">{profile.cityStateZip || 'United States Resident'}</p>
          </div>
          <div className="text-right space-y-0.5 text-[10px]">
            <div>
              <span className="text-slate-500">SSN Identifier: </span>
              <span className="font-mono-numeric font-bold">XXX-XX-{profile.ssnLast4 || 'XXXX'}</span>
            </div>
            <div>
              <span className="text-slate-500">Standing Tier: </span>
              <span className="font-bold text-slate-900">{tier}</span>
            </div>
          </div>
        </div>

        {/* Tri-Bureau Scores Summary Box */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="border border-slate-300 p-2 rounded-lg bg-slate-50">
            <span className="text-[9px] uppercase font-bold text-slate-500 block">Experian</span>
            <span className="text-2xl font-black font-mono-numeric text-slate-900 block mt-0.5">
              {profile.bureaus.experian > 0 ? profile.bureaus.experian : profile.baseScore || '--'}
            </span>
          </div>
          <div className="border border-slate-300 p-2 rounded-lg bg-slate-50">
            <span className="text-[9px] uppercase font-bold text-slate-500 block">TransUnion</span>
            <span className="text-2xl font-black font-mono-numeric text-slate-900 block mt-0.5">
              {profile.bureaus.transUnion > 0 ? profile.bureaus.transUnion : profile.baseScore || '--'}
            </span>
          </div>
          <div className="border border-slate-300 p-2 rounded-lg bg-slate-50">
            <span className="text-[9px] uppercase font-bold text-slate-500 block">Equifax</span>
            <span className="text-2xl font-black font-mono-numeric text-slate-900 block mt-0.5">
              {profile.bureaus.equifax > 0 ? profile.bureaus.equifax : profile.baseScore || '--'}
            </span>
          </div>
        </div>

        {/* Key Vitals Matrix */}
        <div className="grid grid-cols-4 gap-2 text-[10px] border border-slate-300 p-2.5 rounded-lg text-center font-mono-numeric">
          <div>
            <span className="text-slate-500 text-[9px] block uppercase">Utilization</span>
            <span className="font-bold text-slate-900">{utilizationRate}%</span>
          </div>
          <div>
            <span className="text-slate-500 text-[9px] block uppercase">Debt</span>
            <span className="font-bold text-slate-900">${totalBalance.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-slate-500 text-[9px] block uppercase">Limit</span>
            <span className="font-bold text-slate-900">${totalLimit.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-slate-500 text-[9px] block uppercase">Derogatory</span>
            <span className="font-bold text-slate-900">{profile.derogatoryItems.length}</span>
          </div>
        </div>

        <div className="pt-2 text-[9px] text-slate-500 border-t border-slate-200">
          Generated via Credence Client-Side Sovereign Financial Utility. Protected under FCRA 15 U.S.C. § 1681.
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 9:16 SCREEN VIEW: Strictly Stagnant, Problem-Solving, Clean */}
      {/* ========================================================================= */}
      <div className="no-print space-y-4">
        
        {/* Top Header Bar with Prominent "Export Report" Button */}
        <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <h2 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                FICO® Standing
              </h2>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono-numeric">
              {currentDate}
            </span>
          </div>

          {/* Prominent Export Report Button (triggers window.print() for PDF) */}
          <button
            onClick={handleExportReport}
            className="px-3 py-1.5 text-xs font-black text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer border border-emerald-300"
            title="Export clean PDF credit summary"
          >
            <FileDown className="w-3.5 h-3.5 stroke-[3]" />
            <span>Export Report</span>
          </button>
        </div>

        {/* Brand New File Prompt: If score is 0, let user initialize with 1 tap */}
        {isBrandNewFile && (
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-slate-950 p-4 rounded-2xl shadow-md space-y-3">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 stroke-[2.5]" />
              <h3 className="font-black text-sm">
                Initialize Your Credit File
              </h3>
            </div>
            <p className="text-xs font-semibold text-emerald-950">
              Select or enter your baseline FICO® score to activate tools:
            </p>
            <div className="grid grid-cols-4 gap-1.5">
              {[580, 640, 700, 750].map((score) => (
                <button
                  key={score}
                  type="button"
                  onClick={() => onUpdateBaseScore && onUpdateBaseScore(score)}
                  className="py-2 rounded-xl bg-slate-950 text-white font-mono-numeric font-black text-xs hover:bg-slate-900 cursor-pointer shadow-xs"
                >
                  {score}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 1. Hero Score Visualizer */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <ScoreGauge
            score={displayScore > 0 ? displayScore : 680}
            bureaus={profile.bureaus}
            selectedBureau={selectedBureau}
            onSelectBureau={setSelectedBureau}
            privacyMode={privacyMode}
          />
        </div>

        {/* 2. Dream Target Gap Banner */}
        <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            {/* Circular Progress Ring */}
            <div className="relative shrink-0 flex items-center justify-center">
              <svg width="44" height="44" viewBox="0 0 44 44" className="transform -rotate-90">
                <circle
                  cx="22"
                  cy="22"
                  r={miniRadius}
                  fill="none"
                  stroke="#1e293b"
                  strokeWidth="4"
                />
                <circle
                  cx="22"
                  cy="22"
                  r={miniRadius}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="4"
                  strokeDasharray={miniCircumference}
                  strokeDashoffset={miniOffset}
                  strokeLinecap="round"
                  className="transition-all duration-500 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-mono-numeric font-black text-[10px] text-emerald-400">
                {targetProgressPct}%
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[10px] font-bold text-emerald-400 uppercase font-mono-numeric">
                  Dream Goal: {targetScore}
                </span>
              </div>
              <span className="text-xs font-bold text-slate-200 block">
                {isGoalReached ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <Trophy className="w-3.5 h-3.5 text-amber-400" /> Goal Reached!
                  </span>
                ) : (
                  <span>
                    <strong className="text-emerald-400 font-mono-numeric">+{scoreGap} pts</strong> to Prime tier
                  </span>
                )}
              </span>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('settings')}
            className="px-2.5 py-1.5 text-[10px] font-bold text-emerald-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-1 cursor-pointer shrink-0"
          >
            <span>Goal</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* 3. The 4 Real Problems Credence Solves Immediately */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-mono-numeric">
            USA Credit Problem Solvers
          </span>

          <div className="grid grid-cols-2 gap-2">
            {/* Problem 1: High APR Interest */}
            <div
              onClick={() => onNavigateTab('compare')}
              className="bg-white dark:bg-slate-900 border-2 border-emerald-500/50 hover:border-emerald-500 rounded-2xl p-3 shadow-xs cursor-pointer flex flex-col justify-between space-y-2 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                  <DollarSign className="w-4 h-4 stroke-[3]" />
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <div>
                <span className="text-[9px] font-mono-numeric font-black text-emerald-600 uppercase block">
                  Problem 1 · High APR
                </span>
                <span className="text-sm font-black text-slate-900 dark:text-white block">
                  Save $200/yr
                </span>
                <span className="text-[10px] text-slate-500 font-mono-numeric block mt-0.5">
                  Drop 29% to 19%
                </span>
              </div>
            </div>

            {/* Problem 2: Statement Closing Date Trap (AZEO) */}
            <div
              onClick={() => onNavigateTab('statement_optimizer')}
              className="bg-white dark:bg-slate-900 border-2 border-emerald-500/50 hover:border-emerald-500 rounded-2xl p-3 shadow-xs cursor-pointer flex flex-col justify-between space-y-2 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="p-1.5 rounded-lg bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400">
                  <Calendar className="w-4 h-4" />
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-sky-500" />
              </div>
              <div>
                <span className="text-[9px] font-mono-numeric font-black text-sky-600 uppercase block">
                  Problem 2 · High Util
                </span>
                <span className="text-sm font-black text-slate-900 dark:text-white block">
                  +20 to +45 Pts
                </span>
                <span className="text-[10px] text-slate-500 font-mono-numeric block mt-0.5">
                  Report &lt; 3% AZEO
                </span>
              </div>
            </div>

            {/* Problem 3: Negative Marks / Collections */}
            <div
              onClick={() => onNavigateTab('dispute_hub')}
              className="bg-white dark:bg-slate-900 border-2 border-emerald-500/50 hover:border-emerald-500 rounded-2xl p-3 shadow-xs cursor-pointer flex flex-col justify-between space-y-2 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
                  <Scale className="w-4 h-4" />
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-rose-500" />
              </div>
              <div>
                <span className="text-[9px] font-mono-numeric font-black text-rose-600 uppercase block">
                  Problem 3 · Bureau Errors
                </span>
                <span className="text-sm font-black text-slate-900 dark:text-white block">
                  FCRA § 609
                </span>
                <span className="text-[10px] text-slate-500 font-mono-numeric block mt-0.5">
                  30-Day Deletions
                </span>
              </div>
            </div>

            {/* Problem 4: Track Progress Line */}
            <div
              onClick={() => onNavigateTab('track')}
              className="bg-white dark:bg-slate-900 border-2 border-emerald-500/50 hover:border-emerald-500 rounded-2xl p-3 shadow-xs cursor-pointer flex flex-col justify-between space-y-2 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                  <TrendingUp className="w-4 h-4 stroke-[3]" />
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <div>
                <span className="text-[9px] font-mono-numeric font-black text-emerald-600 uppercase block">
                  Problem 4 · Score Stuck
                </span>
                <span className="text-sm font-black text-slate-900 dark:text-white block">
                  Live FICO Chart
                </span>
                <span className="text-[10px] text-slate-500 font-mono-numeric block mt-0.5">
                  Goal: 750 Prime
                </span>
              </div>
            </div>

            {/* Feature: Grocery Card Saver (Pure Math 12 Cards Sheet) */}
            <div
              onClick={() => onNavigateTab('grocery_saver')}
              className="col-span-2 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent hover:from-emerald-500/20 border-2 border-[#00C853] rounded-2xl p-3 shadow-xs cursor-pointer flex items-center justify-between transition-all"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#00C853] text-black">
                  <ShoppingCart className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-mono-numeric font-black uppercase text-[#00C853]">
                      NEW · 12 Cards Sheet
                    </span>
                    <h4 className="font-black text-xs text-slate-900 dark:text-white">
                      Grocery Card Saver
                    </h4>
                  </div>
                  <span className="text-[11px] font-mono-numeric font-extrabold text-[#00C853] block">
                    Save $193–$240/yr on Groceries (Pure Math)
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs font-black text-[#00C853] font-mono-numeric">
                <span>Calculate</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            </div>
          </div>
        </div>

        {/* 4. Key Vital Metrics Bar */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-xs">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block">
              Utilization Rate
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className={`text-xl font-black font-mono-numeric ${isHigh ? 'text-amber-500' : 'text-emerald-500'} ${privacyMode ? 'privacy-masked' : ''}`}>
                {utilizationRate}%
              </span>
              <span className="text-[10px] text-slate-400 font-mono-numeric">Goal &lt; 9%</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-xs">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block">
              Revolving Debt
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className={`text-xl font-black text-slate-900 dark:text-white font-mono-numeric ${privacyMode ? 'privacy-masked' : ''}`}>
                ${totalBalance.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-xs">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block">
              Credit Limits
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className={`text-xl font-black text-slate-900 dark:text-white font-mono-numeric ${privacyMode ? 'privacy-masked' : ''}`}>
                ${totalLimit.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-xs">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block">
              Negative Marks
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className={`text-xl font-black font-mono-numeric ${profile.derogatoryItems.length > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                {profile.derogatoryItems.length}
              </span>
              <span className="text-[10px] text-slate-400">items</span>
            </div>
          </div>
        </div>

        {/* 5. The 5 FICO Pillars Compact List */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
              The 5 FICO® Scoring Pillars
            </h3>
            <span className="text-[10px] font-mono-numeric text-emerald-500 font-bold">100% Weight</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {pillars.map((pillar) => (
              <div key={pillar.id} className="py-2 flex items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900 dark:text-white text-xs">
                      {pillar.name}
                    </span>
                    <span className="text-[9px] font-mono-numeric font-bold px-1.5 py-0.5 rounded-sm bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {pillar.weightPercent}%
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                    {pillar.targetBenchmark}
                  </span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                  pillar.scoreStatus === 'Excellent' || pillar.scoreStatus === 'Good'
                    ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60'
                    : 'text-amber-600 bg-amber-50 dark:bg-amber-950/60'
                }`}>
                  {pillar.scoreStatus}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 6. Export Official Report Banner Action */}
        <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 flex items-center justify-between gap-3 shadow-xs">
          <div>
            <h4 className="font-extrabold text-xs">
              Official PDF Credit Summary
            </h4>
            <span className="text-[10px] text-slate-400 block font-mono-numeric">
              Printer-optimized dossier export
            </span>
          </div>

          <button
            onClick={handleExportReport}
            className="px-3.5 py-2 rounded-xl text-xs font-black bg-emerald-400 hover:bg-emerald-300 text-slate-950 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
        </div>

        {/* 7. Downbase Footer Features & 3 Privacy Badges */}
        {onOpenLegal && (
          <DownbaseFooter
            onOpenLegal={onOpenLegal}
            onNavigateTab={onNavigateTab}
            showThreeBadges={true}
          />
        )}

      </div>
    </div>
  );
};
