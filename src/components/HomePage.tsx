import React from 'react';
import { CreditProfile } from '../types/credit';
import { CredenceLogo } from './CredenceLogo';
import { 
  ShieldCheck, 
  ArrowRight, 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  Percent, 
  CheckCircle2, 
  Lock, 
  SlidersHorizontal,
  CreditCard
} from 'lucide-react';

interface HomePageProps {
  profile: CreditProfile;
  onNavigate: (pageId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ profile, onNavigate }) => {
  const isProfileUnconfigured = !profile.name && profile.baseScore === 0;

  return (
    <div className="space-y-8 pb-8 max-w-6xl mx-auto">
      {/* 1. Hero Functional Metrics Banner: Math & Action */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-950 text-white p-6 sm:p-10 border border-slate-800 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-2">
              <CredenceLogo size={36} animated={true} />
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold font-mono-numeric">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>100% Client-Side Private</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Slash Card Interest. Grow Your FICO® Score.
            </h1>

            {/* Concise stat pills, NO paragraph walls */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-mono-numeric">
              <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-bold flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                <span>Target: Cut 10%+ APR</span>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-bold flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span>Target: 750+ Prime Score</span>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>FCRA § 1681 Rights</span>
              </span>
            </div>
          </div>

          {/* Quick Metrics Action Buttons */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <button
              onClick={() => onNavigate('compare')}
              className="px-5 py-3 rounded-xl font-black text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <DollarSign className="w-4 h-4 stroke-[3]" />
              <span>Launch Screen 2: Compare APR</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('track')}
              className="px-5 py-3 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer font-mono-numeric"
            >
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Launch Screen 3: Track Graph</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live File Standing Row */}
        <div className="mt-6 pt-5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono-numeric text-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-emerald-400 font-bold">
              <Lock className="w-3.5 h-3.5" /> No Remote Servers
            </span>
            <span>·</span>
            <span className="flex items-center gap-1 text-emerald-400 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" /> Instant Local Math
            </span>
          </div>

          <span className="font-bold text-slate-300">
            {isProfileUnconfigured ? 'Profile: Default Demo File' : `Active Score: ${profile.baseScore}`}
          </span>
        </div>
      </section>

      {/* 2. THE TWO PRIMARY PROBLEM-SOLVING ENGINES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Engine 1: Screen 2 - Compare Cards (Math Engine) */}
        <div
          onClick={() => onNavigate('compare')}
          className="bg-white dark:bg-slate-900 border-2 border-emerald-500 rounded-3xl p-6 shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between space-y-5"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                <DollarSign className="w-6 h-6 stroke-[3]" />
              </div>
              <div>
                <span className="text-[10px] font-mono-numeric font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider block">
                  Screen 2 · Math Engine
                </span>
                <h3 className="font-black text-slate-900 dark:text-white text-lg">
                  Compare Cards &amp; Slash APR
                </h3>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-emerald-500" />
          </div>

          {/* Big Live Number */}
          <div className="text-center py-4 px-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-300 dark:border-emerald-800">
            <span className="text-3xl sm:text-4xl font-black text-emerald-500 font-mono-numeric block">
              Save $200/year
            </span>
            <span className="text-xs font-mono-numeric font-bold text-slate-600 dark:text-slate-400 block mt-1">
              At $2,000 balance: 29% APR drops to 19%
            </span>
          </div>

          {/* Mini Visual Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-mono-numeric font-bold">
              <span className="text-rose-500">Old: 29%</span>
              <span className="text-slate-400">---------&gt;</span>
              <span className="text-emerald-500">New: 19%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden flex">
              <div className="bg-emerald-500 w-2/3 h-full" />
              <div className="bg-rose-500 w-1/3 h-full" />
            </div>
          </div>

          <button className="w-full py-3 rounded-xl text-xs font-black bg-emerald-500 text-slate-950 flex items-center justify-center gap-2 pointer-events-none">
            <DollarSign className="w-4 h-4 stroke-[3]" />
            <span>Open Screen 2: Compare Cards</span>
          </button>
        </div>

        {/* Engine 2: Screen 3 - Track Score (Real Graph) */}
        <div
          onClick={() => onNavigate('track')}
          className="bg-white dark:bg-slate-900 border-2 border-emerald-500 rounded-3xl p-6 shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between space-y-5"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="w-6 h-6 stroke-[3]" />
              </div>
              <div>
                <span className="text-[10px] font-mono-numeric font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider block">
                  Screen 3 · Real Chart
                </span>
                <h3 className="font-black text-slate-900 dark:text-white text-lg">
                  Track Score Progress Graph
                </h3>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-emerald-500" />
          </div>

          {/* Big Live Number */}
          <div className="text-center py-4 px-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-300 dark:border-emerald-800">
            <span className="text-3xl sm:text-4xl font-black text-emerald-500 font-mono-numeric block">
              +42 points total
            </span>
            <span className="text-xs font-mono-numeric font-bold text-slate-600 dark:text-slate-400 block mt-1">
              Average growth pace: +10.5 pts / month
            </span>
          </div>

          {/* Mini Visual Line representation */}
          <div className="h-6 flex items-center justify-between px-2 bg-slate-50 dark:bg-slate-800/60 rounded-lg text-xs font-mono-numeric text-slate-400">
            <span>638</span>
            <span className="text-emerald-500 font-bold">↗ 652</span>
            <span className="text-emerald-500 font-bold">↗ 665</span>
            <span className="text-[#00FF85] font-black">● 680</span>
          </div>

          <button className="w-full py-3 rounded-xl text-xs font-black bg-emerald-500 text-slate-950 flex items-center justify-center gap-2 pointer-events-none">
            <TrendingUp className="w-4 h-4 stroke-[3]" />
            <span>Open Screen 3: Track Score</span>
          </button>
        </div>

      </div>

      {/* 3. Additional Functional Tool Cards: Pure Numbers & Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Card A: Dashboard */}
        <div
          onClick={() => onNavigate('dashboard')}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4.5 hover:border-emerald-500 transition-all cursor-pointer flex items-center justify-between"
        >
          <div className="space-y-1">
            <span className="text-[10px] font-mono-numeric uppercase font-bold text-slate-400 block">
              Diagnostic Audit
            </span>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">
              Score Overview &amp; 5 Pillars
            </h4>
            <span className="text-xs font-mono-numeric font-bold text-emerald-500 block">
              FICO® Diagnostic View
            </span>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400" />
        </div>

        {/* Card B: Statement Dates */}
        <div
          onClick={() => onNavigate('statement_optimizer')}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4.5 hover:border-emerald-500 transition-all cursor-pointer flex items-center justify-between"
        >
          <div className="space-y-1">
            <span className="text-[10px] font-mono-numeric uppercase font-bold text-slate-400 block">
              AZEO Method
            </span>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">
              Statement Closing Dates
            </h4>
            <span className="text-xs font-mono-numeric font-bold text-sky-500 block">
              Report &lt; 3% Utilization
            </span>
          </div>
          <Calendar className="w-4 h-4 text-slate-400" />
        </div>

        {/* Card C: Dispute Hub */}
        <div
          onClick={() => onNavigate('dispute_hub')}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4.5 hover:border-emerald-500 transition-all cursor-pointer flex items-center justify-between"
        >
          <div className="space-y-1">
            <span className="text-[10px] font-mono-numeric uppercase font-bold text-slate-400 block">
              FCRA § 1681
            </span>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">
              Bureau Dispute Hub
            </h4>
            <span className="text-xs font-mono-numeric font-bold text-rose-500 block">
              +48 Points per Deleted Mark
            </span>
          </div>
          <ShieldCheck className="w-4 h-4 text-slate-400" />
        </div>

      </div>

    </div>
  );
};
