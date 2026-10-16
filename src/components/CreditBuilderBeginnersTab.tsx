import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  DollarSign, 
  TrendingUp, 
  ArrowRight, 
  CheckCircle2, 
  ExternalLink, 
  Calendar, 
  Users, 
  Award,
  BookOpen,
  Lock,
  Zap
} from 'lucide-react';

export const CreditBuilderBeginnersTab: React.FC = () => {
  // Authorized User Calculator State
  const [piggybackLimit, setPiggybackLimit] = useState<number>(10000);
  const [piggybackAge, setPiggybackAge] = useState<number>(7);

  // Beginner Car Loan Dollar Savings State
  const [carLoanAmount, setCarLoanAmount] = useState<number>(18000);

  // Piggyback Math
  const piggybackScoreBoost = useMemo(() => {
    const base = 45;
    const limitBonus = Math.min(35, Math.round((piggybackLimit / 10000) * 20));
    const ageBonus = Math.min(30, piggybackAge * 4);
    return base + limitBonus + ageBonus;
  }, [piggybackLimit, piggybackAge]);

  // Car loan interest math comparison (Beginner 550 vs 720 Score)
  const carLoanMath = useMemo(() => {
    // 550 Score: Subprime APR ~19.5%
    // 720 Score: Prime APR ~6.5%
    const rateSubprime = 0.195 / 12;
    const ratePrime = 0.065 / 12;
    const n = 60; // 5-year loan

    const paymentSubprime = (carLoanAmount * rateSubprime) / (1 - Math.pow(1 + rateSubprime, -n));
    const totalSubprime = paymentSubprime * n;
    const interestSubprime = totalSubprime - carLoanAmount;

    const paymentPrime = (carLoanAmount * ratePrime) / (1 - Math.pow(1 + ratePrime, -n));
    const totalPrime = paymentPrime * n;
    const interestPrime = totalPrime - carLoanAmount;

    const dollarSavings = Math.round(interestSubprime - interestPrime);

    return {
      monthlySubprime: Math.round(paymentSubprime),
      monthlyPrime: Math.round(paymentPrime),
      dollarSavings,
    };
  }, [carLoanAmount]);

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-6 font-sans select-none pb-8">
      
      {/* Title & Header Banner */}
      <div className="bg-gradient-to-r from-[#0f244c] via-[#143166] to-[#0f244c] dark:from-[#0C182F] dark:via-[#102244] dark:to-[#0C182F] text-white rounded-[20px] p-5 sm:p-6 border border-blue-500/30 dark:border-[rgba(56,120,210,0.3)] shadow-lg shadow-black/20 space-y-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-[#2563EB] text-white font-black">
            <BookOpen className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-[10px] font-mono-numeric font-black uppercase tracking-wider text-[#38BDF8] block">
              Feature 3 · Ages 18–21 Starter Guide
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Credit Builder for Beginners
            </h1>
          </div>
        </div>

        <p className="text-xs text-blue-200/90 font-semibold leading-relaxed">
          Starting with <strong className="text-white">zero credit history or an empty file</strong>? Follow this step-by-step master roadmap to reach a <strong className="text-emerald-400">720+ Credit Score</strong> in 6 months without debt.
        </p>
      </div>

      {/* Beginner Fast Track: The 4 Proven Pillars */}
      <div className="space-y-3">
        <span className="text-xs font-black uppercase text-slate-500 dark:text-[#8FA0C0] tracking-wider font-mono-numeric block">
          The 4 Fast Tracks for Beginners
        </span>

        {/* Track 1: Secured Credit Cards */}
        <div className="bg-white dark:bg-[#0C182F] border border-slate-100 dark:border-[rgba(56,120,210,0.22)] rounded-[20px] p-5 space-y-3 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-blue-50 dark:bg-[#102244] text-[#2563EB] dark:text-[#38BDF8] flex items-center justify-center font-bold text-xs border border-transparent dark:border-[rgba(56,120,210,0.25)]">
                1
              </div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                Secured Cards (100% Deposit Return)
              </h3>
            </div>
            <span className="text-[10px] font-mono-numeric font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
              Guaranteed Approval
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-[#8FA0C0] font-medium">
            You place a refundable deposit ($200) that becomes your credit limit. Spend $10/mo on groceries and pay it off immediately. The bank reports to all 3 credit bureaus monthly.
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono-numeric pt-1">
            <div className="p-3 bg-slate-50 dark:bg-[#081326] rounded-2xl border border-slate-200 dark:border-[rgba(56,120,210,0.2)]">
              <span className="font-bold text-slate-900 dark:text-white block">Secured 2% Cashback Card</span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block mt-0.5">2% Cash Back · Deposit refunded in 7 mos</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
              <span className="font-bold text-slate-900 dark:text-white block">Platinum Secured Builder Card</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">$49 deposit for $200 line · Auto credit line increases</span>
            </div>
          </div>
        </div>

        {/* Track 2: Authorized User Piggybacking */}
        <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                Authorized User &quot;Piggybacking&quot;
              </h3>
            </div>
            <span className="text-[10px] font-mono-numeric font-bold px-2 py-0.5 rounded-md bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-400">
              Instant Day 1 Boost
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
            A parent or relative adds you as an Authorized User on an old, high-limit card with 100% on-time payments. You inherit their account age and limit instantly!
          </p>

          {/* Interactive Boost Calculator */}
          <div className="p-4 rounded-2xl bg-sky-50/50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900 space-y-3 font-mono-numeric">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Card Limit: ${piggybackLimit.toLocaleString()}
              </span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Card Age: {piggybackAge} Years
              </span>
            </div>

            <input
              type="range"
              min="2000"
              max="25000"
              step="1000"
              value={piggybackLimit}
              onChange={(e) => setPiggybackLimit(parseInt(e.target.value))}
              className="w-full h-2 bg-sky-200 dark:bg-sky-900 rounded-lg appearance-none cursor-pointer accent-sky-600"
            />

            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-sky-200 dark:border-sky-800 text-center">
              <span className="text-[10px] font-black uppercase text-sky-600 block">
                Estimated Day 1 Score Leap
              </span>
              <span className="text-2xl sm:text-3xl font-black text-sky-600 block mt-0.5">
                +{piggybackScoreBoost} Points
              </span>
              <span className="text-[10px] text-slate-500 block">
                Appears on your report within 1 billing cycle
              </span>
            </div>
          </div>
        </div>

        {/* Track 3: Credit Builder Loans (Self & Kikoff) */}
        <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xs">
                3
              </div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                Credit Builder Accounts (No Upfront Cash)
              </h3>
            </div>
            <span className="text-[10px] font-mono-numeric font-bold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400">
              Builds Installment History
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
            Credit builder loans hold funds in a locked CD account while you make small monthly contributions ($25/mo). When finished, the cash unlocks and you get the money back!
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono-numeric pt-1">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
              <span className="font-bold text-slate-900 dark:text-white block">Self Credit Builder</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">$25/mo savings loan · Builds 24 mos of positive history</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
              <span className="font-bold text-slate-900 dark:text-white block">Kikoff Credit Line</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">$5/mo revolving line · 0% interest rate · Instant approval</span>
            </div>
          </div>
        </div>

        {/* Track 4: Student Credit Cards */}
        <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                4
              </div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                Student Credit Cards (Ages 18–21)
              </h3>
            </div>
            <span className="text-[10px] font-mono-numeric font-bold px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400">
              No Security Deposit
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
            Specifically approved for college and vocational students with part-time or seasonal income.
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono-numeric pt-1">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
              <span className="font-bold text-slate-900 dark:text-white block">Student 5% Cashback Card</span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block mt-0.5">5% Rotating · Good Grade incentive</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
              <span className="font-bold text-slate-900 dark:text-white block">Student Dining &amp; Grocery Card</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">3% Dining &amp; Grocery · $0 Annual fee</span>
            </div>
          </div>
        </div>
      </div>

      {/* 6-Month Beginner Timeline */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 space-y-4 border border-slate-800">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase text-emerald-400 font-mono-numeric">
            The 6-Month 720 Credit Score Roadmap
          </span>
          <span className="text-xs font-bold text-slate-400 font-mono-numeric">6 Months to Prime</span>
        </div>

        <div className="space-y-3 font-mono-numeric text-xs">
          <div className="flex items-start gap-3 p-3 bg-slate-800/80 rounded-2xl border border-slate-700">
            <span className="px-2 py-0.5 rounded-md bg-emerald-500 text-slate-950 font-black shrink-0">
              M1
            </span>
            <div>
              <strong className="text-white block">Open 1 Secured Card + 1 Builder Account</strong>
              <span className="text-slate-400 text-[11px]">First official credit score is generated (~620 to 640).</span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-slate-800/80 rounded-2xl border border-slate-700">
            <span className="px-2 py-0.5 rounded-md bg-emerald-500 text-slate-950 font-black shrink-0">
              M3
            </span>
            <div>
              <strong className="text-white block">Enforce AZEO Utilization Under 3%</strong>
              <span className="text-slate-400 text-[11px]">Pay before statement closing date. Score surges to ~675+.</span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-slate-800/80 rounded-2xl border border-slate-700">
            <span className="px-2 py-0.5 rounded-md bg-emerald-500 text-slate-950 font-black shrink-0">
              M6
            </span>
            <div>
              <strong className="text-emerald-400 block">Graduate to Unsecured &amp; Unlock 720+</strong>
              <span className="text-slate-300 text-[11px]">Bank refunds your $200 deposit. You are now officially Prime!</span>
            </div>
          </div>
        </div>
      </div>

      {/* The Dollar Payoff for Beginners */}
      <div className="bg-white dark:bg-slate-900 border-2 border-emerald-500 rounded-3xl p-5 space-y-3 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <DollarSign className="w-5 h-5 text-emerald-500" />
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
              Beginner Dollar Savings (Car Loan Math)
            </h3>
          </div>
          <span className="text-xs font-black font-mono-numeric text-emerald-600 dark:text-emerald-400">
            Saved: ${carLoanMath.dollarSavings.toLocaleString()}
          </span>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          Comparing a ${carLoanAmount.toLocaleString()} vehicle loan with bad credit (19.5% APR) vs 720 Prime credit (6.5% APR):
        </p>

        <div className="grid grid-cols-2 gap-2 text-center font-mono-numeric">
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 rounded-2xl border border-rose-200 dark:border-rose-900">
            <span className="text-[10px] text-rose-600 block uppercase font-bold">550 Score (Bad)</span>
            <span className="text-xl font-black text-rose-600 block mt-0.5">
              ${carLoanMath.monthlySubprime}/mo
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">19.5% Subprime APR</span>
          </div>

          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-900">
            <span className="text-[10px] text-emerald-600 block uppercase font-bold">720 Score (Prime)</span>
            <span className="text-xl font-black text-emerald-600 block mt-0.5">
              ${carLoanMath.monthlyPrime}/mo
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">6.5% Prime APR</span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-emerald-500 text-slate-950 text-center font-mono-numeric">
          <span className="text-[10px] font-black uppercase tracking-wider block">
            Net Cash Stays in Your Pocket
          </span>
          <span className="text-2xl font-black block mt-0.5">
            Save ${carLoanMath.dollarSavings.toLocaleString()} in Cash
          </span>
        </div>
      </div>

    </div>
  );
};
