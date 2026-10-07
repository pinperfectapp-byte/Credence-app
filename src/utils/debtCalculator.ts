export interface DebtItem {
  id: string;
  name: string;
  category: 'Credit Card' | 'Auto Loan' | 'Student Loan' | 'Personal Loan' | 'Medical Debt';
  balance: number;
  apr: number; // e.g. 24.99
  minPayment: number;
}

export interface PayoffMilestone {
  debtId: string;
  debtName: string;
  monthPaid: number;
  totalInterestPaid: number;
}

export interface PayoffMethodResult {
  method: 'Avalanche' | 'Snowball';
  totalMonths: number;
  totalInterest: number;
  totalPrincipal: number;
  totalCost: number;
  payoffMilestones: PayoffMilestone[];
  monthlyTimeline: { month: number; totalRemaining: number }[];
}

export interface ComparisonResult {
  avalanche: PayoffMethodResult;
  snowball: PayoffMethodResult;
  minimumOnly: {
    totalMonths: number;
    totalInterest: number;
    totalCost: number;
  };
  interestSavedWithAvalanche: number;
  monthsSavedVsMinimums: number;
  interestSavedVsMinimums: number;
}

export function simulatePayoffMethod(
  initialDebts: DebtItem[],
  extraMonthlyBudget: number,
  strategy: 'Avalanche' | 'Snowball'
): PayoffMethodResult {
  if (initialDebts.length === 0) {
    return {
      method: strategy,
      totalMonths: 0,
      totalInterest: 0,
      totalPrincipal: 0,
      totalCost: 0,
      payoffMilestones: [],
      monthlyTimeline: [],
    };
  }

  // Deep clone debts
  let currentDebts = initialDebts.map((d) => ({
    ...d,
    remaining: d.balance,
    accruedInterest: 0,
  }));

  const totalPrincipal = currentDebts.reduce((sum, d) => sum + d.balance, 0);
  const baseTotalMinPayment = currentDebts.reduce((sum, d) => sum + d.minPayment, 0);
  const totalMonthlyBudget = baseTotalMinPayment + extraMonthlyBudget;

  let month = 0;
  let totalInterest = 0;
  const milestones: PayoffMilestone[] = [];
  const monthlyTimeline: { month: number; totalRemaining: number }[] = [];

  const maxMonths = 360; // 30-year safety ceiling

  while (currentDebts.some((d) => d.remaining > 0.01) && month < maxMonths) {
    month++;
    let monthExtraCash = extraMonthlyBudget;

    // 1. Accrue monthly interest
    for (const debt of currentDebts) {
      if (debt.remaining > 0) {
        const monthlyRate = debt.apr / 100 / 12;
        const interest = debt.remaining * monthlyRate;
        debt.remaining += interest;
        debt.accruedInterest += interest;
        totalInterest += interest;
      }
    }

    // 2. Pay minimums first on all active debts
    for (const debt of currentDebts) {
      if (debt.remaining > 0) {
        // Standard minimum payment calculation
        const payment = Math.min(debt.remaining, debt.minPayment);
        debt.remaining -= payment;

        // If min payment exceeded balance, roll difference to extra cash
        if (debt.minPayment > payment) {
          monthExtraCash += (debt.minPayment - payment);
        }

        // Check if paid off
        if (debt.remaining <= 0.01 && !milestones.some((m) => m.debtId === debt.id)) {
          debt.remaining = 0;
          milestones.push({
            debtId: debt.id,
            debtName: debt.name,
            monthPaid: month,
            totalInterestPaid: Math.round(debt.accruedInterest),
          });
        }
      } else {
        // Debt already paid off! Freed-up minimum payment snowballs/avalanches to extra cash!
        monthExtraCash += debt.minPayment;
      }
    }

    // 3. Apply all extra cash to the primary target debt
    while (monthExtraCash > 0.01 && currentDebts.some((d) => d.remaining > 0.01)) {
      // Pick target based on strategy
      const activeDebts = currentDebts.filter((d) => d.remaining > 0.01);
      
      let targetDebt = activeDebts[0];
      if (strategy === 'Avalanche') {
        // Highest APR first
        targetDebt = activeDebts.reduce((highest, curr) => (curr.apr > highest.apr ? curr : highest), activeDebts[0]);
      } else {
        // Lowest balance first (Snowball)
        targetDebt = activeDebts.reduce((lowest, curr) => (curr.remaining < lowest.remaining ? curr : lowest), activeDebts[0]);
      }

      const extraPayment = Math.min(targetDebt.remaining, monthExtraCash);
      targetDebt.remaining -= extraPayment;
      monthExtraCash -= extraPayment;

      if (targetDebt.remaining <= 0.01 && !milestones.some((m) => m.debtId === targetDebt.id)) {
        targetDebt.remaining = 0;
        milestones.push({
          debtId: targetDebt.id,
          debtName: targetDebt.name,
          monthPaid: month,
          totalInterestPaid: Math.round(targetDebt.accruedInterest),
        });
      }
    }

    // Record timeline step (every 3 months or final months)
    const remainingTotal = currentDebts.reduce((sum, d) => sum + Math.max(0, d.remaining), 0);
    monthlyTimeline.push({
      month,
      totalRemaining: Math.round(remainingTotal),
    });
  }

  return {
    method: strategy,
    totalMonths: month,
    totalInterest: Math.round(totalInterest),
    totalPrincipal: Math.round(totalPrincipal),
    totalCost: Math.round(totalPrincipal + totalInterest),
    payoffMilestones: milestones,
    monthlyTimeline,
  };
}

export function calculateDebtComparison(
  debts: DebtItem[],
  extraMonthlyBudget: number
): ComparisonResult {
  const avalanche = simulatePayoffMethod(debts, extraMonthlyBudget, 'Avalanche');
  const snowball = simulatePayoffMethod(debts, extraMonthlyBudget, 'Snowball');
  const minimumOnly = simulatePayoffMethod(debts, 0, 'Avalanche');

  const interestSavedWithAvalanche = Math.max(0, snowball.totalInterest - avalanche.totalInterest);
  const monthsSavedVsMinimums = Math.max(0, minimumOnly.totalMonths - avalanche.totalMonths);
  const interestSavedVsMinimums = Math.max(0, minimumOnly.totalInterest - avalanche.totalInterest);

  return {
    avalanche,
    snowball,
    minimumOnly: {
      totalMonths: minimumOnly.totalMonths,
      totalInterest: minimumOnly.totalInterest,
      totalCost: minimumOnly.totalCost,
    },
    interestSavedWithAvalanche,
    monthsSavedVsMinimums,
    interestSavedVsMinimums,
  };
}
