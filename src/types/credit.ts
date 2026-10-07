export type CreditTier = 'Poor' | 'Fair' | 'Good' | 'Very Good' | 'Exceptional';

export interface CreditCardAccount {
  id: string;
  name: string;
  bank: string;
  balance: number;
  creditLimit: number;
  statementClosingDay: number; // Day of month (e.g. 14)
  paymentDueDay: number; // Day of month (e.g. 9)
  apr: number;
  isPaidForStatement?: boolean;
}

export interface DerogatoryItem {
  id: string;
  accountName: string;
  originalCreditor: string;
  accountNumberMasked: string;
  itemType: 'medical_debt' | 'late_payment_30' | 'collection' | 'unauthorized_inquiry';
  balance: number;
  dateReported: string;
  bureausReported: ('Experian' | 'Equifax' | 'TransUnion')[];
  status: 'Reported' | 'Disputed' | 'Pending Verification' | 'Removed';
  isEligibleFor609: boolean;
  notes: string;
}

export interface CreditProfile {
  id: string;
  name: string;
  email: string;
  address: string;
  cityStateZip: string;
  ssnLast4: string;
  persona: string;
  baseScore: number;
  bureaus: {
    experian: number;
    transUnion: number;
    equifax: number;
  };
  cards: CreditCardAccount[];
  derogatoryItems: DerogatoryItem[];
  creditAgeYears: number;
  totalInquiries: number;
  hasInstallmentLoan: boolean;
  annualIncome: number;
}

export type DisputeLetterType = 
  | 'fcra_609'
  | 'goodwill_late'
  | 'cfpb_medical'
  | 'pay_for_delete'
  | 'unauthorized_inquiry';

export interface BureauInfo {
  name: 'Experian' | 'TransUnion' | 'Equifax';
  department: string;
  address: string;
  cityStateZip: string;
}

export interface ActionPlanItem {
  id: string;
  title: string;
  estimatedPoints: number;
  category: 'Utilization' | 'Dispute' | 'Building' | 'Maintenance';
  timeframe: string;
  description: string;
  completed: boolean;
  impact: 'High' | 'Medium' | 'Critical';
}

export interface ScoreHistoryEntry {
  id: string;
  date: string;
  score: number;
  note?: string;
}

export interface SavingsCard {
  id: string;
  name: string;
  bank: string;
  apr: number; // regular ongoing APR
  introApr?: number;
  introPeriodMonths?: number;
  annualFee: number;
  creditTier: string;
}
