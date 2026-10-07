import { CreditCardAccount, CreditProfile, CreditTier } from '../types/credit';

export function getCreditTier(score: number): {
  tier: CreditTier;
  color: string;
  badgeBg: string;
  description: string;
} {
  if (score >= 800) {
    return {
      tier: 'Exceptional',
      color: 'text-emerald-700',
      badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      description: 'Top 1% lending terms. Guaranteed best APRs on mortgages, premium travel cards, and auto loans.',
    };
  }
  if (score >= 740) {
    return {
      tier: 'Very Good',
      color: 'text-teal-700',
      badgeBg: 'bg-teal-50 text-teal-800 border-teal-200',
      description: 'Qualifies for Tier-1 prime loan rates and competitive balance transfer offers.',
    };
  }
  if (score >= 670) {
    return {
      tier: 'Good',
      color: 'text-sky-700',
      badgeBg: 'bg-sky-50 text-sky-800 border-sky-200',
      description: 'US median credit range. Most conventional lenders approve without co-signers.',
    };
  }
  if (score >= 580) {
    return {
      tier: 'Fair',
      color: 'text-amber-700',
      badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
      description: 'Subprime rates apply. High interest on auto loans and lower credit limits.',
    };
  }
  return {
    tier: 'Poor',
    color: 'text-rose-700',
    badgeBg: 'bg-rose-50 text-rose-800 border-rose-200',
    description: 'Immediate rebuilding needed. High risk of loan denial and secured-card deposits required.',
  };
}

export function calculateUtilization(cards: CreditCardAccount[]): {
  totalBalance: number;
  totalLimit: number;
  utilizationRate: number;
  isHigh: boolean;
} {
  const totalBalance = cards.reduce((sum, card) => sum + (card.isPaidForStatement ? 15 : card.balance), 0);
  const totalLimit = cards.reduce((sum, card) => sum + card.creditLimit, 0);
  const utilizationRate = totalLimit > 0 ? (totalBalance / totalLimit) * 100 : 0;
  return {
    totalBalance,
    totalLimit,
    utilizationRate: Number(utilizationRate.toFixed(1)),
    isHigh: utilizationRate > 29.0,
  };
}

export interface CreditPillarDetail {
  id: string;
  name: string;
  weightPercent: number;
  scoreStatus: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  metricLabel: string;
  targetBenchmark: string;
  actionAdvice: string;
}

export function evaluatePillars(profile: CreditProfile): CreditPillarDetail[] {
  const { utilizationRate } = calculateUtilization(profile.cards);
  const lateItems = profile.derogatoryItems.filter(
    (d) => d.itemType === 'late_payment_30' && d.status !== 'Removed'
  );
  const collections = profile.derogatoryItems.filter(
    (d) => (d.itemType === 'collection' || d.itemType === 'medical_debt') && d.status !== 'Removed'
  );

  // 1. Payment History (35%)
  const hasNegativePayment = lateItems.length > 0 || collections.length > 0;
  const paymentStatus: 'Excellent' | 'Good' | 'Fair' | 'Poor' = 
    collections.length > 0 ? 'Poor' : lateItems.length > 0 ? 'Fair' : 'Excellent';

  // 2. Amounts Owed / Utilization (30%)
  const utilStatus: 'Excellent' | 'Good' | 'Fair' | 'Poor' =
    utilizationRate < 9.0
      ? 'Excellent'
      : utilizationRate <= 28.9
      ? 'Good'
      : utilizationRate <= 49.0
      ? 'Fair'
      : 'Poor';

  // 3. Length of Credit History (15%)
  const ageStatus: 'Excellent' | 'Good' | 'Fair' | 'Poor' =
    profile.creditAgeYears >= 7
      ? 'Excellent'
      : profile.creditAgeYears >= 4
      ? 'Good'
      : profile.creditAgeYears >= 2
      ? 'Fair'
      : 'Poor';

  // 4. Credit Mix (10%)
  const mixStatus: 'Excellent' | 'Good' | 'Fair' | 'Poor' =
    profile.cards.length >= 2 && profile.hasInstallmentLoan
      ? 'Excellent'
      : profile.cards.length >= 1
      ? 'Good'
      : 'Fair';

  // 5. New Credit / Inquiries (10%)
  const inqStatus: 'Excellent' | 'Good' | 'Fair' | 'Poor' =
    profile.totalInquiries <= 1
      ? 'Excellent'
      : profile.totalInquiries <= 3
      ? 'Good'
      : 'Fair';

  return [
    {
      id: 'payment_history',
      name: 'Payment History',
      weightPercent: 35,
      scoreStatus: paymentStatus,
      metricLabel: hasNegativePayment
        ? `${lateItems.length + collections.length} Derogatory Mark(s)`
        : '100% On-Time Record',
      targetBenchmark: '0 late payments across 24+ billing cycles',
      actionAdvice: hasNegativePayment
        ? 'Send FCRA 609 verification or Goodwill letters to erase eligible derogatory marks.'
        : 'Set all active accounts to Autopay (Minimum Due) to safeguard your record forever.',
    },
    {
      id: 'utilization',
      name: 'Credit Utilization',
      weightPercent: 30,
      scoreStatus: utilStatus,
      metricLabel: `${utilizationRate}% Reported`,
      targetBenchmark: 'Under 9% aggregate and under 28.9% per card',
      actionAdvice:
        utilizationRate > 28.9
          ? 'Pay balances before the Statement Closing Date, not the due date, to report < 6%.'
          : 'Maintain AZEO (All Zero Except One) reporting for peak algorithmic scoring.',
    },
    {
      id: 'credit_age',
      name: 'Credit Age & History',
      weightPercent: 15,
      scoreStatus: ageStatus,
      metricLabel: `${profile.creditAgeYears} Years Avg. Age`,
      targetBenchmark: '7+ years average credit file depth',
      actionAdvice:
        profile.creditAgeYears < 4
          ? 'Keep oldest zero-fee card active with an occasional micro-charge. Consider Authorized User piggybacking.'
          : 'Excellent account seasoning. Avoid closing older tradelines even if rarely used.',
    },
    {
      id: 'credit_mix',
      name: 'Credit Mix',
      weightPercent: 10,
      scoreStatus: mixStatus,
      metricLabel: `${profile.cards.length} Revolving + ${profile.hasInstallmentLoan ? '1 Installment' : '0 Installment'}`,
      targetBenchmark: 'At least 2 revolving cards + 1 installment loan',
      actionAdvice: !profile.hasInstallmentLoan
        ? 'Consider a zero-penalty credit-builder certificate of deposit loan (e.g., Self) to diversify file.'
        : 'Healthy portfolio of revolving lines and installment lending.',
    },
    {
      id: 'inquiries',
      name: 'Hard Inquiries',
      weightPercent: 10,
      scoreStatus: inqStatus,
      metricLabel: `${profile.totalInquiries} Inquiries (Past 2 yrs)`,
      targetBenchmark: 'Fewer than 2 inquiries in the last 12 months',
      actionAdvice:
        profile.totalInquiries > 2
          ? 'Pause credit applications. Inquiries stop impacting score at 12 months and delete at 24 months.'
          : 'Low inquiry count preserves clean file stability for upcoming lending.',
    },
  ];
}

/**
 * Calculates mortgage and auto loan savings based on credit score.
 */
export function calculateFinancialImpact(score: number): {
  mortgageApr: number;
  mortgageMonthly: number;
  mortgageTotalInterest: number;
  mortgageLifetimeSavings: number;
  autoApr: number;
  autoMonthly: number;
  autoTotalInterest: number;
} {
  const homeLoanAmount = 350000;
  const autoLoanAmount = 32000;

  // Mortgage APR brackets (30-year fixed)
  let mortgageApr = 6.12;
  if (score < 620) mortgageApr = 8.15;
  else if (score < 660) mortgageApr = 7.45;
  else if (score < 700) mortgageApr = 6.95;
  else if (score < 760) mortgageApr = 6.45;
  else mortgageApr = 6.12;

  // Auto APR brackets (60-month loan)
  let autoApr = 5.25;
  if (score < 580) autoApr = 16.85;
  else if (score < 660) autoApr = 11.45;
  else if (score < 720) autoApr = 7.85;
  else autoApr = 5.25;

  // Monthly mortgage calculation: M = P [ i(1 + i)^n ] / [ (1 + i)^n – 1]
  const mRate = mortgageApr / 100 / 12;
  const mMonths = 360;
  const mortgageMonthly =
    (homeLoanAmount * (mRate * Math.pow(1 + mRate, mMonths))) /
    (Math.pow(1 + mRate, mMonths) - 1);
  const mortgageTotalInterest = mortgageMonthly * mMonths - homeLoanAmount;

  // Compare to subprime base (620 score at 8.15%)
  const subprimeRate = 0.0815 / 12;
  const subprimeMonthly =
    (homeLoanAmount * (subprimeRate * Math.pow(1 + subprimeRate, mMonths))) /
    (Math.pow(1 + subprimeRate, mMonths) - 1);
  const subprimeTotalInterest = subprimeMonthly * mMonths - homeLoanAmount;
  const mortgageLifetimeSavings = Math.max(0, Math.round(subprimeTotalInterest - mortgageTotalInterest));

  // Auto monthly
  const aRate = autoApr / 100 / 12;
  const aMonths = 60;
  const autoMonthly =
    (autoLoanAmount * (aRate * Math.pow(1 + aRate, aMonths))) /
    (Math.pow(1 + aRate, aMonths) - 1);
  const autoTotalInterest = autoMonthly * aMonths - autoLoanAmount;

  return {
    mortgageApr,
    mortgageMonthly: Math.round(mortgageMonthly),
    mortgageTotalInterest: Math.round(mortgageTotalInterest),
    mortgageLifetimeSavings,
    autoApr,
    autoMonthly: Math.round(autoMonthly),
    autoTotalInterest: Math.round(autoTotalInterest),
  };
}
