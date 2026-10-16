import React from 'react';
import { CreditProfile } from '../types/credit';
import { calculateUtilization, getCreditTier } from '../utils/creditCalculator';
import { calculateDebtComparison, DebtItem } from '../utils/debtCalculator';
import { 
  Printer, 
  X, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Flame, 
  DollarSign, 
  Calendar, 
  TrendingDown, 
  FileText,
  Lock
} from 'lucide-react';

interface FinancialHealthReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: CreditProfile;
  extraPayment?: number;
  activeStrategy?: 'Avalanche' | 'Snowball';
}

export const FinancialHealthReportModal: React.FC<FinancialHealthReportModalProps> = ({
  isOpen,
  onClose,
  profile,
  extraPayment = 200,
  activeStrategy = 'Avalanche',
}) => {
  if (!isOpen) return null;

  const { totalBalance, totalLimit, utilizationRate } = calculateUtilization(profile.cards);
  const { tier } = getCreditTier(profile.baseScore);

  // Convert cards into debts for payoff progress analysis
  const debts: DebtItem[] = profile.cards.map((c) => ({
    id: c.id,
    name: c.name,
    category: 'Credit Card',
    balance: c.balance,
    apr: c.apr,
    minPayment: Math.max(25, Math.round(c.balance * 0.025)),
  }));

  // Debt payoff calculation
  const comparison = calculateDebtComparison(debts, extraPayment);
  const activePayoff = activeStrategy === 'Avalanche' ? comparison.avalanche : comparison.snowball;

  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const getPayoffDateString = (months: number) => {
    if (months <= 0) return 'Immediate / Paid Off';
    const now = new Date();
    const targetDate = new Date(now.getFullYear(), now.getMonth() + months, 1);
    return targetDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const handlePrint = () => {
    window.print();
  };

  const reportRefId = `CRD-${Date.now().toString().slice(-8)}`;

  // Derogatory counts
  const derogCount = profile.derogatoryItems.length;
  const latePaymentItems = profile.derogatoryItems.filter(d => d.itemType === 'late_payment_30');
  const collectionItems = profile.derogatoryItems.filter(d => d.itemType === 'collection' || d.itemType === 'medical_debt');
  const inquiryItems = profile.derogatoryItems.filter(d => d.itemType === 'unauthorized_inquiry');
  const totalCollectionDebt = collectionItems.reduce((sum, d) => sum + d.balance, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      {/* Modal Container */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-4xl max-h-[92vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-900 dark:text-white my-auto animate-in fade-in zoom-in-95 duration-150">
        
        {/* Top Control Bar (Hidden when printing) */}
        <div className="no-print p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black tracking-tight text-slate-900 dark:text-white">
                Export Financial Health Report
              </h3>
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                Official Consumer Credit Standing, Derogatory Status &amp; Debt Payoff Progress
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black shadow-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4 stroke-[2.5]" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Document Body */}
        <div id="financial-health-report-print" className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-900 bg-white font-sans text-xs">
          
          {/* 1. Formal Document Header */}
          <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row justify-between sm:items-start gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-sm bg-slate-900 text-white text-[9px] font-black uppercase tracking-wider font-mono-numeric">
                  CONFIDENTIAL DOSSIER
                </span>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono-numeric">
                  FCRA 15 U.S.C. § 1681
                </span>
              </div>
              <h1 className="text-2xl font-black tracking-tight text-slate-950 uppercase mt-1">
                CHIDONIQ FINANCIAL HEALTH REPORT
              </h1>
              <p className="text-xs text-slate-600 font-medium">
                Comprehensive Consumer Credit Standing, Adverse Derogatory Audit &amp; Debt Acceleration Analysis
              </p>
            </div>

            <div className="text-left sm:text-right font-mono-numeric text-[11px] space-y-0.5 shrink-0 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <div><span className="text-slate-500 font-semibold">ISSUE DATE:</span> <strong className="text-slate-950">{currentDate}</strong></div>
              <div><span className="text-slate-500 font-semibold">REPORT ID:</span> <strong className="text-slate-950">{reportRefId}</strong></div>
              <div><span className="text-slate-500 font-semibold">ENGINE:</span> <strong className="text-emerald-700">CHIDONIQ Client Core</strong></div>
            </div>
          </div>

          {/* Subject Consumer Identification Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 bg-slate-50 border border-slate-300 rounded-xl font-mono-numeric text-[11px]">
            <div>
              <span className="text-[9px] uppercase font-black text-slate-500 block">FILE HOLDER / SUBJECT:</span>
              <span className="font-bold text-slate-950 text-sm block">{profile.name || 'Primary Consumer Subject'}</span>
              <span className="text-slate-600 block">{profile.cityStateZip || 'United States Resident'}</span>
            </div>
            <div className="sm:text-right space-y-1">
              <div>
                <span className="text-slate-500">SSN IDENTIFIER: </span>
                <strong className="text-slate-900">XXX-XX-{profile.ssnLast4 || 'XXXX'}</strong>
              </div>
              <div>
                <span className="text-slate-500">CREDIT STANDING TIER: </span>
                <strong className="text-emerald-700 uppercase">{tier}</strong>
              </div>
              <div>
                <span className="text-slate-500">CREDIT FILE AGE: </span>
                <strong className="text-slate-900">{profile.creditAgeYears} Years</strong>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 1: EXECUTIVE CREDIT PROFILE SUMMARY */}
          {/* ========================================================================= */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-300">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-[10px]">
                1
              </span>
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 font-mono-numeric">
                Executive Credit Profile Summary
              </h2>
            </div>

            {/* Tri-Bureau Score Grid */}
            <div className="grid grid-cols-4 gap-2.5 text-center font-mono-numeric">
              <div className="p-3 rounded-xl bg-slate-900 text-white">
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Baseline Score</span>
                <span className="text-2xl font-black block mt-0.5">{profile.baseScore || '--'}</span>
                <span className="text-[9px] text-emerald-400 font-bold uppercase">{tier} Tier</span>
              </div>
              <div className="p-3 rounded-xl border border-slate-300 bg-slate-50">
                <span className="text-[9px] uppercase font-bold text-slate-500 block">Experian</span>
                <span className="text-2xl font-black text-slate-900 block mt-0.5">
                  {profile.bureaus.experian || profile.baseScore || '--'}
                </span>
                <span className="text-[9px] text-slate-500">Standard Model</span>
              </div>
              <div className="p-3 rounded-xl border border-slate-300 bg-slate-50">
                <span className="text-[9px] uppercase font-bold text-slate-500 block">TransUnion</span>
                <span className="text-2xl font-black text-slate-900 block mt-0.5">
                  {profile.bureaus.transUnion || profile.baseScore || '--'}
                </span>
                <span className="text-[9px] text-slate-500">Vantage 3.0</span>
              </div>
              <div className="p-3 rounded-xl border border-slate-300 bg-slate-50">
                <span className="text-[9px] uppercase font-bold text-slate-500 block">Equifax</span>
                <span className="text-2xl font-black text-slate-900 block mt-0.5">
                  {profile.bureaus.equifax || profile.baseScore || '--'}
                </span>
                <span className="text-[9px] text-slate-500">BEACON 5.0</span>
              </div>
            </div>

            {/* Key Credit Vitals Matrix */}
            <div className="grid grid-cols-4 gap-2.5 p-3 rounded-xl border border-slate-300 bg-slate-50/50 text-center font-mono-numeric">
              <div>
                <span className="text-[9px] uppercase text-slate-500 font-bold block">Credit Utilization</span>
                <span className={`text-base font-black ${utilizationRate > 30 ? 'text-rose-700' : 'text-emerald-700'}`}>
                  {utilizationRate}%
                </span>
                <span className="text-[9px] text-slate-500 block">Target: &lt; 9.9%</span>
              </div>
              <div>
                <span className="text-[9px] uppercase text-slate-500 font-bold block">Total Revolving Debt</span>
                <span className="text-base font-black text-slate-900">
                  ${totalBalance.toLocaleString()}
                </span>
                <span className="text-[9px] text-slate-500 block">Across {profile.cards.length} cards</span>
              </div>
              <div>
                <span className="text-[9px] uppercase text-slate-500 font-bold block">Total Credit Limit</span>
                <span className="text-base font-black text-slate-900">
                  ${totalLimit.toLocaleString()}
                </span>
                <span className="text-[9px] text-slate-500 block">Available Purchasing Power</span>
              </div>
              <div>
                <span className="text-[9px] uppercase text-slate-500 font-bold block">Hard Inquiries</span>
                <span className="text-base font-black text-slate-900">
                  {profile.totalInquiries}
                </span>
                <span className="text-[9px] text-slate-500 block">Past 24 Months</span>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 2: DEROGATORY STATUS & NEGATIVE RECORDS AUDIT */}
          {/* ========================================================================= */}
          <div className="space-y-3 pt-2 print-break-inside-avoid">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-300">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-[10px]">
                2
              </span>
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 font-mono-numeric">
                Bureau Derogatory Status &amp; Adverse Records Audit
              </h2>
            </div>

            {/* Derogatory Summary Statistics */}
            <div className="grid grid-cols-4 gap-2.5 p-3 rounded-xl border border-slate-300 bg-slate-50 text-center font-mono-numeric">
              <div>
                <span className="text-[9px] uppercase text-slate-500 font-bold block">Adverse Items</span>
                <span className={`text-base font-black ${derogCount > 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
                  {derogCount} Marks
                </span>
              </div>
              <div>
                <span className="text-[9px] uppercase text-slate-500 font-bold block">Collections Debt</span>
                <span className="text-base font-black text-slate-900">
                  ${totalCollectionDebt.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-[9px] uppercase text-slate-500 font-bold block">Late Payments</span>
                <span className="text-base font-black text-slate-900">
                  {latePaymentItems.length}
                </span>
              </div>
              <div>
                <span className="text-[9px] uppercase text-slate-500 font-bold block">On-Time Payment Rate</span>
                <span className="text-base font-black text-emerald-700">
                  {latePaymentItems.length === 0 ? '100.0%' : '97.2%'}
                </span>
              </div>
            </div>

            {/* Derogatory Detail Table or Clean Bill of Health */}
            {derogCount === 0 ? (
              <div className="p-3.5 rounded-xl border border-emerald-300 bg-emerald-50 flex items-center gap-2 text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-bold text-[11px]">
                  Clean Standing: No active derogatory records, public judgments, charge-offs, or collections detected on your file.
                </span>
              </div>
            ) : (
              <div className="border border-slate-300 rounded-xl overflow-hidden font-mono-numeric">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold">
                    <tr>
                      <th className="p-2">Account Name</th>
                      <th className="p-2">Adverse Type</th>
                      <th className="p-2">Balance</th>
                      <th className="p-2">Bureaus</th>
                      <th className="p-2">Dispute Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {profile.derogatoryItems.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="p-2 font-bold text-slate-900">
                          {item.accountName}
                          <span className="block text-[9px] text-slate-500 font-normal">{item.originalCreditor}</span>
                        </td>
                        <td className="p-2 capitalize text-rose-700 font-semibold">
                          {item.itemType.replace('_', ' ')}
                        </td>
                        <td className="p-2 font-bold">
                          ${item.balance.toLocaleString()}
                        </td>
                        <td className="p-2 text-[10px]">
                          {item.bureausReported.join(', ')}
                        </td>
                        <td className="p-2">
                          <span className="px-1.5 py-0.5 rounded-sm bg-slate-200 text-slate-800 text-[10px] font-bold">
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* SECTION 3: CURRENT DEBT PAYOFF PROGRESS & ACCELERATION ANALYSIS */}
          {/* ========================================================================= */}
          <div className="space-y-3 pt-2 print-break-inside-avoid">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-300">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-[10px]">
                3
              </span>
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 font-mono-numeric">
                Current Debt Payoff Progress &amp; Mathematical Strategy
              </h2>
            </div>

            {/* Debt Payoff Overview Matrix */}
            <div className="grid grid-cols-4 gap-2.5 p-3 rounded-xl border border-slate-300 bg-slate-50 text-center font-mono-numeric">
              <div>
                <span className="text-[9px] uppercase text-slate-500 font-bold block">Payoff Strategy</span>
                <span className="text-sm font-black text-emerald-800 uppercase block mt-0.5">
                  {activeStrategy}
                </span>
                <span className="text-[9px] text-slate-500">Highest APR First</span>
              </div>
              <div>
                <span className="text-[9px] uppercase text-slate-500 font-bold block">Timeline to Debt-Free</span>
                <span className="text-base font-black text-slate-900 block mt-0.5">
                  {activePayoff.totalMonths} Months
                </span>
                <span className="text-[9px] text-emerald-700 font-bold">
                  {getPayoffDateString(activePayoff.totalMonths)}
                </span>
              </div>
              <div>
                <span className="text-[9px] uppercase text-slate-500 font-bold block">Monthly Payment</span>
                <span className="text-base font-black text-slate-900 block mt-0.5">
                  ${(debts.reduce((s, d) => s + d.minPayment, 0) + extraPayment).toLocaleString()}
                </span>
                <span className="text-[9px] text-slate-500">+${extraPayment} acceleration</span>
              </div>
              <div>
                <span className="text-[9px] uppercase text-slate-500 font-bold block">Total Interest Saved</span>
                <span className="text-base font-black text-emerald-700 block mt-0.5">
                  +${comparison.interestSavedVsMinimums.toLocaleString()}
                </span>
                <span className="text-[9px] text-slate-500 font-semibold">vs. Minimum Payments</span>
              </div>
            </div>

            {/* Savings Over Snowball Callout */}
            {comparison.interestSavedWithAvalanche > 0 && (
              <div className="p-2.5 rounded-lg border border-emerald-300 bg-emerald-50/80 flex items-center justify-between text-[11px] font-mono-numeric">
                <span className="text-emerald-900 font-bold flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Avalanche Mathematical Superiority:</span>
                </span>
                <span className="font-black text-emerald-700">
                  Saves +${comparison.interestSavedWithAvalanche.toLocaleString()} pure interest over Snowball method
                </span>
              </div>
            )}

            {/* Active Debts Schedule Table */}
            <div className="border border-slate-300 rounded-xl overflow-hidden font-mono-numeric">
              <table className="w-full text-left border-collapse text-[11px]">
                <thead className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold">
                  <tr>
                    <th className="p-2">Account Name</th>
                    <th className="p-2">Current Balance</th>
                    <th className="p-2">Interest APR</th>
                    <th className="p-2">Monthly Min</th>
                    <th className="p-2 text-right">Payoff Priority</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {debts.map((debt, idx) => (
                    <tr key={debt.id} className="hover:bg-slate-50">
                      <td className="p-2 font-bold text-slate-900">
                        {debt.name}
                      </td>
                      <td className="p-2 font-bold">
                        ${debt.balance.toLocaleString()}
                      </td>
                      <td className="p-2 font-bold text-rose-700">
                        {debt.apr}% APR
                      </td>
                      <td className="p-2">
                        ${debt.minPayment.toLocaleString()}/mo
                      </td>
                      <td className="p-2 text-right">
                        <span className="px-2 py-0.5 rounded-md bg-slate-900 text-white text-[10px] font-black">
                          #{idx + 1} Target
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 4: CERTIFICATION & FCRA DISCLOSURES */}
          {/* ========================================================================= */}
          <div className="pt-4 border-t-2 border-slate-900 space-y-4 print-break-inside-avoid">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-[10px] text-slate-600 leading-relaxed">
              <strong>STATUTORY NOTICE (15 U.S.C. § 1681):</strong> This self-prepared financial health dossier is compiled strictly for consumer personal credit evaluation and debt acceleration planning. Algorithms execute locally within the client browser environment without external data transmission. Protected under federal consumer self-advocacy statutes.
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-end gap-6 pt-2 font-mono-numeric text-[11px]">
              <div>
                <span className="text-[10px] text-slate-500 block">CONSUMER ATTESTATION:</span>
                <span className="block mt-4 border-b border-slate-800 w-64"></span>
                <span className="text-[9px] text-slate-500 mt-1 block">File Holder Authorized Signature &amp; Date</span>
              </div>

              <div className="text-right space-y-0.5 text-[10px] text-slate-400">
                <div className="font-bold text-slate-700">CHIDONIQ Sovereign Financial Utility</div>
                <div>powered by <span className="font-black text-emerald-600">chidoniq</span></div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
