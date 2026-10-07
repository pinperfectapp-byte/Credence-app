import React, { useState, useMemo } from 'react';
import { 
  DollarSign, 
  Percent, 
  Calendar, 
  ArrowRight, 
  ExternalLink, 
  CheckCircle2, 
  ShieldCheck, 
  TrendingDown,
  Building2,
  Clock,
  Zap
} from 'lucide-react';

interface LoanProvider {
  id: string;
  name: string;
  minApr: number;
  maxApr: number;
  minScore: number;
  originationFee: string;
  fundingSpeed: string;
  bestFor: string;
  applyLink: string;
}

const LOAN_PROVIDERS: LoanProvider[] = [
  {
    id: 'sofi',
    name: 'SoFi Personal Loans',
    minApr: 8.99,
    maxApr: 25.81,
    minScore: 680,
    originationFee: '$0 (Fee-Free Option)',
    fundingSpeed: 'Same-day funding',
    bestFor: 'Good-to-Excellent Credit (680+)',
    applyLink: 'https://www.sofi.com/personal-loans/',
  },
  {
    id: 'marcus',
    name: 'Marcus by Goldman Sachs',
    minApr: 6.99,
    maxApr: 24.99,
    minScore: 660,
    originationFee: 'Zero Fees Always',
    fundingSpeed: '1-3 Business Days',
    bestFor: 'Direct Creditor Payoff',
    applyLink: 'https://www.marcus.com/us/en/personal-loans',
  },
  {
    id: 'lightstream',
    name: 'LightStream',
    minApr: 7.49,
    maxApr: 22.49,
    minScore: 720,
    originationFee: '$0 Fees',
    fundingSpeed: 'Same-day available',
    bestFor: 'Lowest APR for Prime Borrowers',
    applyLink: 'https://www.lightstream.com/',
  },
  {
    id: 'upgrade',
    name: 'Upgrade Personal Loans',
    minApr: 8.49,
    maxApr: 35.99,
    minScore: 580,
    originationFee: '1.85% - 9.99%',
    fundingSpeed: 'Next Business Day',
    bestFor: 'Fair Credit & Rebuilding (580+)',
    applyLink: 'https://www.upgrade.com/personal-loans/',
  },
  {
    id: 'lendingclub',
    name: 'LendingClub',
    minApr: 9.57,
    maxApr: 35.99,
    minScore: 600,
    originationFee: '3% - 8%',
    fundingSpeed: '2 Business Days',
    bestFor: 'Credit Card Debt Consolidation',
    applyLink: 'https://www.lendingclub.com/personal-loan',
  },
  {
    id: 'upstart',
    name: 'Upstart',
    minApr: 7.80,
    maxApr: 35.99,
    minScore: 560,
    originationFee: '0% - 12%',
    fundingSpeed: 'Next Day',
    bestFor: 'Young Borrowers / Thin Credit File',
    applyLink: 'https://www.upstart.com/',
  },
];

export const LoanComparisonTab: React.FC = () => {
  // Input Controls
  const [loanAmount, setLoanAmount] = useState<number>(10000);
  const [termMonths, setTermMonths] = useState<number>(36);
  const [userScore, setUserScore] = useState<number>(680);

  // Amortization Formula:
  // M = P * [r(1+r)^n] / [(1+r)^n - 1]
  const calculateLoanMetrics = (apr: number) => {
    const monthlyRate = apr / 100 / 12;
    if (monthlyRate === 0) {
      const payment = loanAmount / termMonths;
      return { monthlyPayment: payment, totalInterest: 0, totalPaid: loanAmount };
    }
    const payment = (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, termMonths))) /
      (Math.pow(1 + monthlyRate, termMonths) - 1);
    const totalPaid = payment * termMonths;
    const totalInterest = totalPaid - loanAmount;

    return {
      monthlyPayment: Math.round(payment),
      totalInterest: Math.round(totalInterest),
      totalPaid: Math.round(totalPaid),
    };
  };

  // Estimate APR based on user's credit score
  const resolveEstimatedApr = (provider: LoanProvider) => {
    // Score ratio between 560 and 850
    const ratio = Math.max(0, Math.min(1, (850 - userScore) / (850 - 560)));
    const estimated = provider.minApr + ratio * (provider.maxApr - provider.minApr);
    return Math.round(estimated * 10) / 10;
  };

  // Debt Consolidation Comparison: 29% APR Card vs 11% APR Personal Loan
  const cardAt29 = calculateLoanMetrics(29.0);
  const loanAt11 = calculateLoanMetrics(11.0);
  const consolidationSavings = Math.max(0, cardAt29.totalInterest - loanAt11.totalInterest);

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-6 font-sans select-none pb-8">
      
      {/* Title & Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-6 border border-slate-800 shadow-md space-y-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-500 text-slate-950 font-black">
            <Building2 className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-[10px] font-mono-numeric font-black uppercase tracking-wider text-emerald-400 block">
              Feature 4 · Personal Loans Engine
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Personal Loan Comparison
            </h1>
          </div>
        </div>

        <p className="text-xs text-slate-300 font-semibold leading-relaxed">
          Consolidate high-interest credit card balances into a fixed-rate loan. Compare <strong className="text-white">top US lenders</strong> and calculate exact dollar interest savings.
        </p>
      </div>

      {/* Input Calculator Panel */}
      <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-5 shadow-sm">
        
        {/* Input 1: Loan Amount */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-slate-500 tracking-wider font-mono-numeric">
              Loan Amount
            </span>
            <span className="text-2xl font-black font-mono-numeric text-slate-950 dark:text-white">
              ${loanAmount.toLocaleString()}
            </span>
          </div>

          <input
            type="range"
            min="2000"
            max="50000"
            step="1000"
            value={loanAmount}
            onChange={(e) => setLoanAmount(parseInt(e.target.value))}
            className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />

          <div className="flex justify-between text-[10px] font-mono-numeric font-bold text-slate-400">
            <span>$2k</span>
            <span>$15k</span>
            <span>$30k</span>
            <span>$50k</span>
          </div>
        </div>

        {/* Input 2: Loan Term */}
        <div className="space-y-2">
          <span className="text-xs font-black uppercase text-slate-500 tracking-wider font-mono-numeric block">
            Repayment Term
          </span>

          <div className="grid grid-cols-4 gap-1.5 font-mono-numeric">
            {[24, 36, 48, 60].map((months) => (
              <button
                key={months}
                type="button"
                onClick={() => setTermMonths(months)}
                className={`py-2 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                  termMonths === months
                    ? 'bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950 border-slate-900 dark:border-emerald-500 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {months} Mos ({months / 12}y)
              </button>
            ))}
          </div>
        </div>

        {/* Input 3: Credit Score Tier */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-slate-500 tracking-wider font-mono-numeric">
              Your Credit Score
            </span>
            <span className="text-base font-black font-mono-numeric text-emerald-600 dark:text-emerald-400">
              {userScore} FICO®
            </span>
          </div>

          <input
            type="range"
            min="560"
            max="850"
            step="10"
            value={userScore}
            onChange={(e) => setUserScore(parseInt(e.target.value))}
            className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
        </div>
      </div>

      {/* Consolidation Savings Banner: Big Green Dollars */}
      <div className="bg-emerald-500 text-slate-950 rounded-3xl p-5 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider bg-slate-950 text-white px-2.5 py-0.5 rounded-full font-mono-numeric">
            Debt Consolidation Math
          </span>
          <span className="text-xs font-bold font-mono-numeric text-emerald-950">
            Term: {termMonths} Months
          </span>
        </div>

        <div>
          <span className="text-3xl sm:text-4xl font-black font-mono-numeric block tracking-tight">
            Save ${consolidationSavings.toLocaleString()} in Interest
          </span>
          <span className="text-xs font-bold text-emerald-950 block mt-0.5">
            By replacing 29% credit card APR with an estimated 11% personal loan
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1 font-mono-numeric text-xs">
          <div className="p-2.5 bg-black/10 rounded-xl">
            <span className="text-[10px] text-emerald-950 block uppercase font-bold">29% Card Interest</span>
            <span className="text-base font-black">${cardAt29.totalInterest.toLocaleString()}</span>
          </div>
          <div className="p-2.5 bg-black/10 rounded-xl">
            <span className="text-[10px] text-emerald-950 block uppercase font-bold">11% Loan Interest</span>
            <span className="text-base font-black">${loanAt11.totalInterest.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Ranked Lenders List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-black text-slate-500 font-mono-numeric">
          <span className="uppercase tracking-wider">Top US Personal Loan Providers</span>
          <span>Sorted by Best APR</span>
        </div>

        <div className="space-y-3">
          {LOAN_PROVIDERS.map((provider) => {
            const estimatedApr = resolveEstimatedApr(provider);
            const metrics = calculateLoanMetrics(estimatedApr);
            const isEligible = userScore >= provider.minScore;

            return (
              <div
                key={provider.id}
                className={`bg-white dark:bg-slate-900 border-2 rounded-3xl p-5 space-y-3.5 shadow-xs transition-all ${
                  isEligible
                    ? 'border-slate-200 dark:border-slate-800 hover:border-emerald-500'
                    : 'border-slate-200/60 dark:border-slate-800/60 opacity-70'
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      {provider.name}
                    </h3>
                    <span className="text-[11px] font-mono-numeric text-slate-400 font-bold block mt-0.5">
                      {provider.bestFor}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-lg font-black font-mono-numeric text-emerald-600 dark:text-emerald-400 block">
                      {estimatedApr}% APR
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono-numeric">
                      Range: {provider.minApr}% - {provider.maxApr}%
                    </span>
                  </div>
                </div>

                {/* Key Numbers Grid */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono-numeric">
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                    <span className="text-[10px] text-slate-400 block font-bold">Monthly</span>
                    <span className="text-sm font-black text-slate-900 dark:text-white mt-0.5 block">
                      ${metrics.monthlyPayment}/mo
                    </span>
                  </div>

                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                    <span className="text-[10px] text-slate-400 block font-bold">Total Interest</span>
                    <span className="text-sm font-black text-slate-900 dark:text-white mt-0.5 block">
                      ${metrics.totalInterest.toLocaleString()}
                    </span>
                  </div>

                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                    <span className="text-[10px] text-slate-400 block font-bold">Funding Speed</span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white mt-0.5 block truncate">
                      {provider.fundingSpeed}
                    </span>
                  </div>
                </div>

                {/* Action Link */}
                <a
                  href={provider.applyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-2xl font-black text-xs bg-slate-900 hover:bg-slate-800 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Check Rate with {provider.name.split(' ')[0]}</span>
                  <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
                </a>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
