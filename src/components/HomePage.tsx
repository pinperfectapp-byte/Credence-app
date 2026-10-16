import React from 'react';
import { CreditProfile } from '../types/credit';
import { ChidoniqLogo } from './ChidoniqLogo';
import { WhatUsersSay } from './WhatUsersSay';
import { 
  ShieldCheck, 
  ArrowRight, 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  CheckCircle2, 
  Lock, 
  SlidersHorizontal,
  KeyRound,
  Zap,
  Award
} from 'lucide-react';

interface HomePageProps {
  profile: CreditProfile;
  onNavigate: (pageId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ profile, onNavigate }) => {
  const isProfileUnconfigured = !profile.name && profile.baseScore === 0;

  return (
    <div className="space-y-8 pb-10 max-w-6xl mx-auto transition-colors">
      
      {/* 1. Hero Functional Metrics Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-neutral-50 dark:bg-black text-black dark:text-white p-6 sm:p-10 border border-neutral-200 dark:border-neutral-800 shadow-sm transition-colors">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-2">
              <ChidoniqLogo size={36} animated={false} />
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs font-bold font-mono-numeric">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>100% Client-Side Private</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-black dark:text-white tracking-tight">
              Slash Card Interest. Grow Your Credit Score.
            </h1>

            {/* Concise stat pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-mono-numeric">
              <span className="px-2.5 py-1 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 font-bold flex items-center gap-1.5 shadow-xs">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Target: Cut 10%+ APR</span>
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 font-bold flex items-center gap-1.5 shadow-xs">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Target: 750+ Prime Score</span>
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 font-bold flex items-center gap-1.5 shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>FCRA § 1681 Rights</span>
              </span>
            </div>
          </div>

          {/* Quick Metrics Action Buttons */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('compare')}
              className="px-5 py-3 rounded-xl font-black text-xs bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              <DollarSign className="w-4 h-4 stroke-[2.5]" />
              <span>Launch APR Slasher</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('track')}
              className="px-5 py-3 rounded-xl font-bold text-xs bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-black dark:text-white border border-neutral-300 dark:border-neutral-700 transition-colors flex items-center justify-center gap-2 cursor-pointer font-mono-numeric active:scale-[0.98]"
            >
              <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Track Score Trajectory</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live File Standing Row */}
        <div className="mt-6 pt-5 border-t border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono-numeric text-neutral-600 dark:text-neutral-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
              <Lock className="w-3.5 h-3.5" /> No Remote Tracking
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" /> Instant Local Math
            </span>
          </div>

          <span className="font-bold text-black dark:text-white">
            {isProfileUnconfigured ? 'Profile: Active Sovereign Vault' : `Active Score: ${profile.baseScore}`}
          </span>
        </div>
      </section>

      {/* 2. THE TWO PRIMARY PROBLEM-SOLVING ENGINES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Engine 1: Screen 2 - Compare Cards (Math Engine) */}
        <div
          onClick={() => onNavigate('compare')}
          className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 hover:border-black dark:hover:border-white rounded-3xl p-6 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-5"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                <DollarSign className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-[10px] font-mono-numeric font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider block">
                  Dollar Savings Engine
                </span>
                <h3 className="font-black text-black dark:text-white text-lg">
                  Compare Cards &amp; Slash APR
                </h3>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-neutral-400" />
          </div>

          {/* Big Live Number */}
          <div className="text-center py-4 px-3 bg-neutral-50 dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800">
            <span className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400 font-mono-numeric block">
              Save $200/year
            </span>
            <span className="text-xs font-mono-numeric font-bold text-neutral-600 dark:text-neutral-400 block mt-1">
              At $2,000 balance: 29% APR drops to 19%
            </span>
          </div>

          {/* Mini Visual Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-mono-numeric font-bold">
              <span className="text-rose-500">Old: 29%</span>
              <span className="text-neutral-400">---------&gt;</span>
              <span className="text-emerald-600 dark:text-emerald-400">New: 19%</span>
            </div>
            <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-2 rounded-full overflow-hidden flex">
              <div className="bg-emerald-500 w-2/3 h-full" />
              <div className="bg-rose-500 w-1/3 h-full" />
            </div>
          </div>

          <button 
            type="button"
            className="w-full py-3 rounded-xl text-xs font-black bg-black text-white dark:bg-white dark:text-black flex items-center justify-center gap-2 pointer-events-none"
          >
            <DollarSign className="w-4 h-4 stroke-[2.5]" />
            <span>Open APR Card Comparison</span>
          </button>
        </div>

        {/* Engine 2: Screen 3 - Track Score (Real Graph) */}
        <div
          onClick={() => onNavigate('track')}
          className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 hover:border-black dark:hover:border-white rounded-3xl p-6 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-5"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400">
                <TrendingUp className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-[10px] font-mono-numeric font-black uppercase text-sky-600 dark:text-sky-400 tracking-wider block">
                  Historical Telemetry
                </span>
                <h3 className="font-black text-black dark:text-white text-lg">
                  Track Score Progress Graph
                </h3>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-neutral-400" />
          </div>

          {/* Big Live Number */}
          <div className="text-center py-4 px-3 bg-neutral-50 dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800">
            <span className="text-3xl sm:text-4xl font-black text-sky-600 dark:text-sky-400 font-mono-numeric block">
              +42 points total
            </span>
            <span className="text-xs font-mono-numeric font-bold text-neutral-600 dark:text-neutral-400 block mt-1">
              Average growth pace: +10.5 pts / month
            </span>
          </div>

          {/* Mini Visual Line representation */}
          <div className="h-6 flex items-center justify-between px-2 bg-neutral-100 dark:bg-neutral-900 rounded-lg text-xs font-mono-numeric text-neutral-500">
            <span>638</span>
            <span className="text-sky-600 dark:text-sky-400 font-bold">↗ 652</span>
            <span className="text-sky-600 dark:text-sky-400 font-bold">↗ 665</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-black">● 680</span>
          </div>

          <button 
            type="button"
            className="w-full py-3 rounded-xl text-xs font-black bg-black text-white dark:bg-white dark:text-black flex items-center justify-center gap-2 pointer-events-none"
          >
            <TrendingUp className="w-4 h-4 stroke-[2.5]" />
            <span>Open Progress Trajectory</span>
          </button>
        </div>

      </div>

      {/* 3. Additional Functional Tool Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Card A: Dashboard */}
        <div
          onClick={() => onNavigate('dashboard')}
          className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 hover:border-black dark:hover:border-white rounded-2xl p-4.5 transition-all cursor-pointer flex items-center justify-between shadow-xs"
        >
          <div className="space-y-1">
            <span className="text-[10px] font-mono-numeric uppercase font-bold text-neutral-500 block">
              Diagnostic Audit
            </span>
            <h4 className="font-bold text-black dark:text-white text-sm">
              Score Overview &amp; 5 Pillars
            </h4>
            <span className="text-xs font-mono-numeric font-bold text-emerald-600 dark:text-emerald-400 block">
              Credit Score Diagnostic View
            </span>
          </div>
          <ArrowRight className="w-4 h-4 text-neutral-400" />
        </div>

        {/* Card B: Statement Dates */}
        <div
          onClick={() => onNavigate('statement_optimizer')}
          className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 hover:border-black dark:hover:border-white rounded-2xl p-4.5 transition-all cursor-pointer flex items-center justify-between shadow-xs"
        >
          <div className="space-y-1">
            <span className="text-[10px] font-mono-numeric uppercase font-bold text-neutral-500 block">
              AZEO Method
            </span>
            <h4 className="font-bold text-black dark:text-white text-sm">
              Statement Closing Dates
            </h4>
            <span className="text-xs font-mono-numeric font-bold text-sky-600 dark:text-sky-400 block">
              Report &lt; 3% Utilization
            </span>
          </div>
          <Calendar className="w-4 h-4 text-neutral-400" />
        </div>

        {/* Card C: Dispute Hub */}
        <div
          onClick={() => onNavigate('dispute_hub')}
          className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 hover:border-black dark:hover:border-white rounded-2xl p-4.5 transition-all cursor-pointer flex items-center justify-between shadow-xs"
        >
          <div className="space-y-1">
            <span className="text-[10px] font-mono-numeric uppercase font-bold text-neutral-500 block">
              FCRA § 1681
            </span>
            <h4 className="font-bold text-black dark:text-white text-sm">
              Bureau Dispute Hub
            </h4>
            <span className="text-xs font-mono-numeric font-bold text-rose-600 dark:text-rose-400 block">
              +48 Points per Deleted Mark
            </span>
          </div>
          <ShieldCheck className="w-4 h-4 text-neutral-400" />
        </div>

      </div>

      {/* 4. DYNAMIC 'WHAT USERS SAY' SOCIAL PROOF & TESTIMONIALS */}
      <WhatUsersSay />

    </div>
  );
};
