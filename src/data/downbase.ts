/**
 * Downbase Client-Side Database Engine for Credence
 * 
 * 100% Offline, LocalStorage-backed Sovereign Financial Engine
 * Zero Mock Data - Starts 100% Clean & Untouched
 * 
 * Tables:
 * 1. Budget_Settings
 * 2. Daily_Spending
 * 3. Bills
 * 4. Debts
 * 5. Subscriptions
 * 6. Challenges
 * 7. Emergency_Vault
 * 8. Net_Worth_Assets & Net_Worth_Liabilities
 * 9. Credit_Inquiries
 * 10. Savings_Goals
 * 11. Dispute_Cases
 * 12. Interest_Bleed_Accounts
 * 13. Cash_Flow_Events
 * 14. Reward_Programs
 * 15. No_Spend_Days
 */

export type SpendingCategory = 'Rent' | 'Food' | 'Transport' | 'Fun' | 'Bills' | 'Other';
export type SubscriptionCategory = 'Entertainment' | 'Food' | 'App' | 'Utilities' | 'Other';

/* =========================================================================
   TABLE INTERFACES
   ========================================================================= */

// 1. Budget Settings
export interface BudgetSettingsRecord {
  id: string;
  month: string;
  income: number;
  rent: number;
  food: number;
  transport: number;
  fun: number;
  bills: number;
}

// 2. Daily Spending
export interface DailySpendingRecord {
  id: string;
  date: string; // YYYY-MM-DD
  category: SpendingCategory;
  amount: number;
  note?: string;
}

// 3. Bills (BillGuard)
export interface BillRecord {
  id: string;
  name: string;
  amount: number;
  due_date: string; // YYYY-MM-DD
  is_paid: boolean;
  frequency?: 'Monthly' | 'Bi-weekly' | 'Annual' | 'One-time';
  is_autopay?: boolean;
}

// 4. Debts (DebtDestroyer)
export interface DebtRecord {
  id: string;
  name: string;
  total_owed: number;
  min_payment: number;
  interest_rate: number;
  account_type?: 'Credit Card' | 'Personal Loan' | 'Auto Loan' | 'Student Loan' | 'Medical';
}

// 5. Subscriptions (SubScrub)
export interface SubscriptionRecord {
  id: string;
  name: string;
  amount: number;
  renewal_date: string; // YYYY-MM-DD
  category: SubscriptionCategory;
  is_essential?: boolean;
}

// 6. Challenges (MoneyStreak)
export interface ChallengeRecord {
  id: string;
  day_number: number;
  task: string;
  is_done: boolean;
}

// 7. Emergency Fund Vault
export interface EmergencyFundRecord {
  id: string;
  target_months: number; // 3, 6, or 9 months
  monthly_essential_expenses: number;
  current_saved: number;
  last_updated: string;
  notes?: string;
}

// 8. Net Worth Items
export interface NetWorthItem {
  id: string;
  name: string;
  type: 'asset' | 'liability';
  category: 'Cash & Checking' | 'High-Yield Savings' | 'Investments / 401k' | 'Real Estate' | 'Vehicles' | 'Credit Cards' | 'Auto Loans' | 'Student Loans' | 'Mortgage' | 'Other';
  value: number;
  updated_at: string;
}

// 9. Credit Inquiries (Hard-Pull Shield)
export interface CreditInquiryRecord {
  id: string;
  creditor: string;
  bureau: 'Experian' | 'TransUnion' | 'Equifax' | 'All Bureaus';
  inquiry_date: string; // YYYY-MM-DD
  type: 'Credit Card' | 'Auto Loan' | 'Mortgage' | 'Personal Loan' | 'Unrecognized';
  notes?: string;
}

// 10. Savings Goals (Multi-Vault)
export interface SavingsGoalRecord {
  id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  target_date: string; // YYYY-MM-DD
  category: 'Emergency' | 'Down Payment' | 'Vehicle' | 'Vacation' | 'Taxes' | 'General';
}

// 11. Dispute Cases (30-Day Statutory Clock)
export interface DisputeCaseRecord {
  id: string;
  creditor_name: string;
  bureau: 'Experian' | 'TransUnion' | 'Equifax';
  sent_date: string; // YYYY-MM-DD
  tracking_number?: string;
  status: 'Sent' | 'Under Investigation' | 'Deleted' | 'Verified / Disputed';
  reason: 'Inaccurate Balance' | 'Unverified Account' | 'Identity Dispute' | 'Late Payment Error' | 'Zombie Debt';
}

// 12. APR Interest Bleed
export interface InterestBleedRecord {
  id: string;
  account_name: string;
  balance: number;
  apr: number;
}

// 13. Cash Flow Outlook
export interface CashFlowEventRecord {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  amount: number; // positive for income, negative for expense
  type: 'income' | 'bill' | 'transfer';
}

// 14. Reward Points & Cashback Vault
export interface RewardProgramRecord {
  id: string;
  card_name: string;
  reward_type: 'Cash Back ($)' | 'Travel Points' | 'Airline Miles';
  balance: number;
  cents_per_point: number; // e.g. 1.0 or 1.5
  expiration_date?: string;
}

// 15. No-Spend Days Tracker
export interface NoSpendDayRecord {
  id: string;
  date: string; // YYYY-MM-DD
  saved_amount_estimate: number;
  note?: string;
}

// 16. Sinking Funds Allocator
export interface SinkingFundRecord {
  id: string;
  name: string;
  target_amount: number;
  current_saved: number;
  frequency: 'Annual' | 'Semi-Annual' | 'Quarterly' | 'Custom';
  target_date: string;
  category: 'Car Maintenance' | 'Insurance' | 'Taxes' | 'Holiday/Gifts' | 'Home Repair' | 'Medical' | 'Other';
}

/* =========================================================================
   STORAGE KEYS
   ========================================================================= */

const STORAGE_CLEAN_INIT_KEY = 'chidoniq_clean_v12_pristine_init';

const STORAGE_KEY_BUDGET_SETTINGS = 'chidoniq_downbase_budget_settings_v5';
const STORAGE_KEY_DAILY_SPENDING = 'chidoniq_downbase_daily_spending_v5';
const STORAGE_KEY_BILLS = 'chidoniq_downbase_bills_v5';
const STORAGE_KEY_DEBTS = 'chidoniq_downbase_debts_v5';
const STORAGE_KEY_SUBSCRIPTIONS = 'chidoniq_downbase_subscriptions_v5';
const STORAGE_KEY_CHALLENGES = 'chidoniq_downbase_challenges_v5';
const STORAGE_KEY_EMERGENCY_VAULT = 'chidoniq_downbase_emergency_vault_v5';
const STORAGE_KEY_NET_WORTH = 'chidoniq_downbase_net_worth_v5';
const STORAGE_KEY_INQUIRIES = 'chidoniq_downbase_inquiries_v5';
const STORAGE_KEY_SAVINGS_GOALS = 'chidoniq_downbase_savings_goals_v5';
const STORAGE_KEY_DISPUTES = 'chidoniq_downbase_disputes_v5';
const STORAGE_KEY_INTEREST_BLEED = 'chidoniq_downbase_interest_bleed_v5';
const STORAGE_KEY_CASH_FLOW = 'chidoniq_downbase_cash_flow_v5';
const STORAGE_KEY_REWARDS = 'chidoniq_downbase_rewards_v5';
const STORAGE_KEY_NO_SPEND = 'chidoniq_downbase_no_spend_v5';
const STORAGE_KEY_SINKING_FUNDS = 'chidoniq_downbase_sinking_funds_v5';

/* =========================================================================
   PRISTINE CLEANING: Purge Old Mock Data Once
   ========================================================================= */

function ensurePristineCleanState(): void {
  try {
    const isClean = localStorage.getItem(STORAGE_CLEAN_INIT_KEY);
    if (!isClean) {
      // Purge legacy mock data keys so app starts newly created and untouched
      const legacyKeys = [
        'credence_downbase_budget_settings_v1',
        'credence_downbase_daily_spending_v1',
        'credence_downbase_bills_v1',
        'credence_downbase_debts_v1',
        'credence_downbase_subscriptions_v1',
        'credence_downbase_challenges_v1',
        'credence_downbase_budget_settings_v2',
        'credence_downbase_daily_spending_v2',
        'credence_downbase_bills_v2',
        'credence_downbase_debts_v2',
        'credence_downbase_subscriptions_v2',
        'credence_downbase_challenges_v2',
        'credence_downbase_budget_settings_v3',
        'credence_downbase_daily_spending_v3',
        'credence_downbase_bills_v3',
        'credence_downbase_debts_v3',
        'credence_downbase_subscriptions_v3',
        'credence_downbase_challenges_v3',
        'credence_downbase_emergency_vault_v3',
        'credence_downbase_net_worth_v3',
        'credence_downbase_inquiries_v3',
        'credence_downbase_savings_goals_v3',
        'credence_downbase_disputes_v3',
        'credence_downbase_interest_bleed_v3',
        'credence_downbase_cash_flow_v3',
        'credence_downbase_rewards_v3',
        'credence_downbase_no_spend_v3',
        'credence_downbase_sinking_funds_v3',
        'credence_profile_v6_fresh',
        'credence_clean_v11_pristine_init'
      ];
      legacyKeys.forEach((k) => localStorage.removeItem(k));
      localStorage.setItem(STORAGE_CLEAN_INIT_KEY, 'true');
    }
  } catch (err) {
    console.warn('Storage purge error:', err);
  }
}

try {
  ensurePristineCleanState();
} catch {}

/* =========================================================================
   DATE UTILITIES
   ========================================================================= */

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getCurrentMonthName(): string {
  return new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export function getMonthFromDateString(dateStr: string): string {
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const monthIndex = parseInt(parts[1], 10) - 1;
      const d = new Date(year, monthIndex, 1);
      return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
  } catch {}
  return getCurrentMonthName();
}

export function getDateDaysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDaysDifference(targetDateStr: string): number {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(targetDateStr + 'T00:00:00');
    const diffTime = target.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  } catch {
    return 0;
  }
}

export function getDaysRemainingInMonth(): number {
  try {
    const now = new Date();
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    return Math.max(0, lastDay - now.getDate());
  } catch {
    return 14;
  }
}

/* =========================================================================
   GENERIC STORAGE HELPERS
   ========================================================================= */

function readTable<T>(key: string, defaultVal: T[] = []): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error(`Downbase error reading ${key}:`, err);
  }
  return defaultVal;
}

function writeTable<T>(key: string, data: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Downbase error writing ${key}:`, err);
  }
}

/* =========================================================================
   TABLE 1: Budget_Settings (Starts 100% Clean)
   ========================================================================= */

export function getBudgetSettingsTable(): BudgetSettingsRecord[] {
  return readTable<BudgetSettingsRecord>(STORAGE_KEY_BUDGET_SETTINGS);
}

export function saveBudgetSettingsTable(records: BudgetSettingsRecord[]): void {
  writeTable(STORAGE_KEY_BUDGET_SETTINGS, records);
}

export function getLatestBudgetSettings(): BudgetSettingsRecord | null {
  const records = getBudgetSettingsTable();
  if (records.length === 0) return null;
  return records[records.length - 1];
}

export function insertBudgetSettings(data: Omit<BudgetSettingsRecord, 'id'>): BudgetSettingsRecord {
  const records = getBudgetSettingsTable();
  const newRecord: BudgetSettingsRecord = {
    id: `bs_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    month: data.month || getCurrentMonthName(),
    income: Math.max(0, Number(data.income) || 0),
    rent: Math.max(0, Number(data.rent) || 0),
    food: Math.max(0, Number(data.food) || 0),
    transport: Math.max(0, Number(data.transport) || 0),
    fun: Math.max(0, Number(data.fun) || 0),
    bills: Math.max(0, Number(data.bills) || 0),
  };

  const existingIndex = records.findIndex(
    (r) => r.month.trim().toLowerCase() === newRecord.month.trim().toLowerCase()
  );

  if (existingIndex >= 0) {
    records[existingIndex] = { ...newRecord, id: records[existingIndex].id };
    saveBudgetSettingsTable(records);
    return records[existingIndex];
  } else {
    records.push(newRecord);
    saveBudgetSettingsTable(records);
    return newRecord;
  }
}

export function updateBudgetSettings(
  id: string,
  updates: Partial<Omit<BudgetSettingsRecord, 'id'>>
): BudgetSettingsRecord | null {
  const records = getBudgetSettingsTable();
  const index = records.findIndex((r) => r.id === id);
  if (index === -1) return null;

  records[index] = {
    ...records[index],
    ...updates,
  };
  saveBudgetSettingsTable(records);
  return records[index];
}

export function clearBudgetSettingsTable(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_BUDGET_SETTINGS);
  } catch {}
}

/* =========================================================================
   TABLE 2: Daily_Spending (Starts 100% Clean)
   ========================================================================= */

export function getDailySpendingTable(): DailySpendingRecord[] {
  return readTable<DailySpendingRecord>(STORAGE_KEY_DAILY_SPENDING);
}

export function saveDailySpendingTable(records: DailySpendingRecord[]): void {
  writeTable(STORAGE_KEY_DAILY_SPENDING, records);
}

export function insertDailySpending(data: Omit<DailySpendingRecord, 'id'>): DailySpendingRecord {
  const records = getDailySpendingTable();
  const newRecord: DailySpendingRecord = {
    id: `ds_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    date: data.date || getTodayDateString(),
    category: data.category || 'Other',
    amount: Math.max(0, Number(data.amount) || 0),
    note: data.note?.trim() || '',
  };
  records.unshift(newRecord);
  saveDailySpendingTable(records);
  return newRecord;
}

export function deleteDailySpending(id: string): void {
  const records = getDailySpendingTable();
  saveDailySpendingTable(records.filter((r) => r.id !== id));
}

export function clearDailySpendingTable(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_DAILY_SPENDING);
  } catch {}
}

/* =========================================================================
   TABLE 3: Bills (BillGuard - Starts 100% Clean)
   ========================================================================= */

export function getBillsTable(): BillRecord[] {
  return readTable<BillRecord>(STORAGE_KEY_BILLS);
}

export function saveBillsTable(records: BillRecord[]): void {
  writeTable(STORAGE_KEY_BILLS, records);
}

export function insertBill(data: Omit<BillRecord, 'id' | 'is_paid'> & { is_paid?: boolean; frequency?: BillRecord['frequency']; is_autopay?: boolean }): BillRecord {
  const records = getBillsTable();
  const newRecord: BillRecord = {
    id: `bill_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name: data.name.trim(),
    amount: Math.max(0, Number(data.amount) || 0),
    due_date: data.due_date || getTodayDateString(),
    is_paid: Boolean(data.is_paid),
    frequency: data.frequency || 'Monthly',
    is_autopay: Boolean(data.is_autopay),
  };
  records.push(newRecord);
  saveBillsTable(records);
  return newRecord;
}

export function toggleBillPaid(id: string): BillRecord | null {
  const records = getBillsTable();
  const target = records.find((b) => b.id === id);
  if (!target) return null;
  target.is_paid = !target.is_paid;
  saveBillsTable(records);
  return target;
}

export function deleteBill(id: string): void {
  const records = getBillsTable();
  saveBillsTable(records.filter((b) => b.id !== id));
}

export function clearBillsTable(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_BILLS);
  } catch {}
}

/* =========================================================================
   TABLE 4: Debts (DebtDestroyer - Starts 100% Clean)
   ========================================================================= */

export function getDebtsTable(): DebtRecord[] {
  return readTable<DebtRecord>(STORAGE_KEY_DEBTS);
}

export function saveDebtsTable(records: DebtRecord[]): void {
  writeTable(STORAGE_KEY_DEBTS, records);
}

export function insertDebt(data: Omit<DebtRecord, 'id'>): DebtRecord {
  const records = getDebtsTable();
  const newRecord: DebtRecord = {
    id: `debt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name: data.name.trim(),
    total_owed: Math.max(0, Number(data.total_owed) || 0),
    min_payment: Math.max(1, Number(data.min_payment) || 25),
    interest_rate: Math.max(0, Number(data.interest_rate) || 0),
    account_type: data.account_type || 'Credit Card',
  };
  records.push(newRecord);
  saveDebtsTable(records);
  return newRecord;
}

export function deleteDebt(id: string): void {
  const records = getDebtsTable();
  saveDebtsTable(records.filter((d) => d.id !== id));
}

export function clearDebtsTable(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_DEBTS);
  } catch {}
}

/* =========================================================================
   TABLE 5: Subscriptions (SubScrub - Starts 100% Clean)
   ========================================================================= */

export function getSubscriptionsTable(): SubscriptionRecord[] {
  return readTable<SubscriptionRecord>(STORAGE_KEY_SUBSCRIPTIONS);
}

export function saveSubscriptionsTable(records: SubscriptionRecord[]): void {
  writeTable(STORAGE_KEY_SUBSCRIPTIONS, records);
}

export function insertSubscription(data: Omit<SubscriptionRecord, 'id'>): SubscriptionRecord {
  const records = getSubscriptionsTable();
  const newRecord: SubscriptionRecord = {
    id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name: data.name.trim(),
    amount: Math.max(0, Number(data.amount) || 0),
    renewal_date: data.renewal_date || getDateDaysFromNow(30),
    category: data.category || 'Entertainment',
    is_essential: Boolean(data.is_essential),
  };
  records.push(newRecord);
  saveSubscriptionsTable(records);
  return newRecord;
}

export function deleteSubscription(id: string): SubscriptionRecord | null {
  const records = getSubscriptionsTable();
  const target = records.find((s) => s.id === id);
  saveSubscriptionsTable(records.filter((s) => s.id !== id));
  return target || null;
}

export function clearSubscriptionsTable(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_SUBSCRIPTIONS);
  } catch {}
}

/* =========================================================================
   TABLE 6: Challenges (MoneyStreak - Starts Clean with All Unchecked)
   ========================================================================= */

export function generateClean30Challenges(): ChallengeRecord[] {
  const tasks = [
    "Track all expenses today without missing any receipt",
    "Prepare home-cooked meals for lunch & dinner",
    "Review active credit utilization across all cards",
    "Skip discretionary beverage or coffee takeout",
    "Audit 1 recurring subscription or membership",
    "Transfer $5 or more into emergency savings",
    "Pack snacks in advance to prevent impulse buys",
    "Check statement closing dates on your financial calendar",
    "Unsubscribe from 3 commercial promotional sales emails",
    "Review credit reports for unauthorized inquiries",
    "Call a utility or internet service to negotiate lower tier",
    "Prepare dinner tonight strictly using pantry staples",
    "Calculate your exact total debt payoff timeline",
    "Identify 1 unused household item to sell or donate",
    "Enforce a 24-hour waiting rule before any online checkout",
    "Verify zero late fees across all active billing accounts",
    "Deposit a $10 micro-saving transfer into high-yield savings",
    "Compare grocery prices before heading to the supermarket",
    "Combine errands into 1 trip to conserve fuel and transport",
    "Conduct a full Zero-Discretionary Spend Day",
    "Audit auto-renew settings across streaming and app accounts",
    "Round up today's grocery spending into savings",
    "Allocate an extra payment toward your highest-interest balance",
    "Meal prep 3 upcoming lunches in advance",
    "Review electric/utility usage and lower climate thermostat 1°",
    "Establish a strict weekly cash spending boundary",
    "Transfer a $15 milestone deposit into your emergency vault",
    "Confirm on-time payment scheduling for upcoming bills",
    "Calculate this month's net cash savings rate percentage",
    "Celebrate 30 consecutive days of financial mindfulness!"
  ];

  return tasks.map((task, idx) => ({
    id: `chal_${idx + 1}`,
    day_number: idx + 1,
    task,
    is_done: false, // 100% clean, never touched
  }));
}

export function getChallengesTable(): ChallengeRecord[] {
  const raw = readTable<ChallengeRecord>(STORAGE_KEY_CHALLENGES);
  if (raw.length === 30) return raw;
  const initial = generateClean30Challenges();
  saveChallengesTable(initial);
  return initial;
}

export function saveChallengesTable(records: ChallengeRecord[]): void {
  writeTable(STORAGE_KEY_CHALLENGES, records);
}

export function toggleChallengeDone(dayNumber: number): { record: ChallengeRecord | null; isDoneNow: boolean } {
  const records = getChallengesTable();
  const target = records.find((c) => c.day_number === dayNumber);
  if (!target) return { record: null, isDoneNow: false };
  target.is_done = !target.is_done;
  saveChallengesTable(records);
  return { record: target, isDoneNow: target.is_done };
}

export function resetChallengesTable(): ChallengeRecord[] {
  const defaults = generateClean30Challenges();
  saveChallengesTable(defaults);
  return defaults;
}

export function getStreakCount(challenges: ChallengeRecord[]): number {
  const sorted = [...challenges].sort((a, b) => a.day_number - b.day_number);
  let streak = 0;
  for (const item of sorted) {
    if (item.is_done) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export function getCompletedChallengesCount(challenges: ChallengeRecord[]): number {
  return challenges.filter((c) => c.is_done).length;
}

/* =========================================================================
   TABLE 7: Emergency Fund Vault (Feature 7)
   ========================================================================= */

export function getEmergencyVault(): EmergencyFundRecord {
  const records = readTable<EmergencyFundRecord>(STORAGE_KEY_EMERGENCY_VAULT);
  if (records.length > 0) return records[0];
  return {
    id: 'vault_primary',
    target_months: 6,
    monthly_essential_expenses: 0,
    current_saved: 0,
    last_updated: getTodayDateString(),
  };
}

export function saveEmergencyVault(data: EmergencyFundRecord): void {
  writeTable(STORAGE_KEY_EMERGENCY_VAULT, [data]);
}

/* =========================================================================
   TABLE 8: Net Worth Tracker (Feature 8)
   ========================================================================= */

export function getNetWorthItems(): NetWorthItem[] {
  return readTable<NetWorthItem>(STORAGE_KEY_NET_WORTH);
}

export function saveNetWorthItems(items: NetWorthItem[]): void {
  writeTable(STORAGE_KEY_NET_WORTH, items);
}

export function insertNetWorthItem(item: Omit<NetWorthItem, 'id' | 'updated_at'>): NetWorthItem {
  const items = getNetWorthItems();
  const newItem: NetWorthItem = {
    id: `nw_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name: item.name.trim(),
    type: item.type,
    category: item.category,
    value: Math.max(0, Number(item.value) || 0),
    updated_at: getTodayDateString(),
  };
  items.push(newItem);
  saveNetWorthItems(items);
  return newItem;
}

export function deleteNetWorthItem(id: string): void {
  const items = getNetWorthItems();
  saveNetWorthItems(items.filter((i) => i.id !== id));
}

/* =========================================================================
   TABLE 9: Credit Inquiries & Hard-Pull Shield (Feature 9)
   ========================================================================= */

export function getInquiriesTable(): CreditInquiryRecord[] {
  return readTable<CreditInquiryRecord>(STORAGE_KEY_INQUIRIES);
}

export function saveInquiriesTable(items: CreditInquiryRecord[]): void {
  writeTable(STORAGE_KEY_INQUIRIES, items);
}

export function insertInquiry(item: Omit<CreditInquiryRecord, 'id'>): CreditInquiryRecord {
  const items = getInquiriesTable();
  const newItem: CreditInquiryRecord = {
    id: `inq_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    creditor: item.creditor.trim(),
    bureau: item.bureau,
    inquiry_date: item.inquiry_date || getTodayDateString(),
    type: item.type,
    notes: item.notes?.trim() || '',
  };
  items.unshift(newItem);
  saveInquiriesTable(items);
  return newItem;
}

export function deleteInquiry(id: string): void {
  const items = getInquiriesTable();
  saveInquiriesTable(items.filter((i) => i.id !== id));
}

/* =========================================================================
   TABLE 10: Savings Goals Multi-Vault (Feature 10)
   ========================================================================= */

export function getSavingsGoalsTable(): SavingsGoalRecord[] {
  return readTable<SavingsGoalRecord>(STORAGE_KEY_SAVINGS_GOALS);
}

export function saveSavingsGoalsTable(items: SavingsGoalRecord[]): void {
  writeTable(STORAGE_KEY_SAVINGS_GOALS, items);
}

export function insertSavingsGoal(goal: Omit<SavingsGoalRecord, 'id'>): SavingsGoalRecord {
  const items = getSavingsGoalsTable();
  const newGoal: SavingsGoalRecord = {
    id: `goal_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name: goal.name.trim(),
    target_amount: Math.max(1, Number(goal.target_amount) || 100),
    current_amount: Math.max(0, Number(goal.current_amount) || 0),
    target_date: goal.target_date || getDateDaysFromNow(180),
    category: goal.category || 'General',
  };
  items.push(newGoal);
  saveSavingsGoalsTable(items);
  return newGoal;
}

export function updateSavingsGoalBalance(id: string, newBalance: number): void {
  const items = getSavingsGoalsTable();
  const target = items.find((g) => g.id === id);
  if (target) {
    target.current_amount = Math.max(0, newBalance);
    saveSavingsGoalsTable(items);
  }
}

export function deleteSavingsGoal(id: string): void {
  const items = getSavingsGoalsTable();
  saveSavingsGoalsTable(items.filter((g) => g.id !== id));
}

/* =========================================================================
   TABLE 11: Dispute Cases & 30-Day Legal Clock (Feature 11)
   ========================================================================= */

export function getDisputeCasesTable(): DisputeCaseRecord[] {
  return readTable<DisputeCaseRecord>(STORAGE_KEY_DISPUTES);
}

export function saveDisputeCasesTable(items: DisputeCaseRecord[]): void {
  writeTable(STORAGE_KEY_DISPUTES, items);
}

export function insertDisputeCase(item: Omit<DisputeCaseRecord, 'id'>): DisputeCaseRecord {
  const items = getDisputeCasesTable();
  const newItem: DisputeCaseRecord = {
    id: `disp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    creditor_name: item.creditor_name.trim(),
    bureau: item.bureau,
    sent_date: item.sent_date || getTodayDateString(),
    tracking_number: item.tracking_number?.trim() || '',
    status: item.status || 'Sent',
    reason: item.reason,
  };
  items.unshift(newItem);
  saveDisputeCasesTable(items);
  return newItem;
}

export function updateDisputeStatus(id: string, status: DisputeCaseRecord['status']): void {
  const items = getDisputeCasesTable();
  const target = items.find((d) => d.id === id);
  if (target) {
    target.status = status;
    saveDisputeCasesTable(items);
  }
}

export function deleteDisputeCase(id: string): void {
  const items = getDisputeCasesTable();
  saveDisputeCasesTable(items.filter((d) => d.id !== id));
}

/* =========================================================================
   TABLE 12: APR Interest Bleed Monitor (Feature 12)
   ========================================================================= */

export function getInterestBleedAccounts(): InterestBleedRecord[] {
  return readTable<InterestBleedRecord>(STORAGE_KEY_INTEREST_BLEED);
}

export function saveInterestBleedAccounts(items: InterestBleedRecord[]): void {
  writeTable(STORAGE_KEY_INTEREST_BLEED, items);
}

export function insertInterestBleedAccount(item: Omit<InterestBleedRecord, 'id'>): InterestBleedRecord {
  const items = getInterestBleedAccounts();
  const newItem: InterestBleedRecord = {
    id: `bleed_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    account_name: item.account_name.trim(),
    balance: Math.max(0, Number(item.balance) || 0),
    apr: Math.max(0, Number(item.apr) || 0),
  };
  items.push(newItem);
  saveInterestBleedAccounts(items);
  return newItem;
}

export function deleteInterestBleedAccount(id: string): void {
  const items = getInterestBleedAccounts();
  saveInterestBleedAccounts(items.filter((i) => i.id !== id));
}

/* =========================================================================
   TABLE 13: Cash Flow Forecaster (Feature 13)
   ========================================================================= */

export function getCashFlowEvents(): CashFlowEventRecord[] {
  return readTable<CashFlowEventRecord>(STORAGE_KEY_CASH_FLOW);
}

export function saveCashFlowEvents(items: CashFlowEventRecord[]): void {
  writeTable(STORAGE_KEY_CASH_FLOW, items);
}

export function insertCashFlowEvent(item: Omit<CashFlowEventRecord, 'id'>): CashFlowEventRecord {
  const items = getCashFlowEvents();
  const newItem: CashFlowEventRecord = {
    id: `cf_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    date: item.date || getTodayDateString(),
    title: item.title.trim(),
    amount: Number(item.amount) || 0,
    type: item.type || 'bill',
  };
  items.push(newItem);
  saveCashFlowEvents(items);
  return newItem;
}

export function deleteCashFlowEvent(id: string): void {
  const items = getCashFlowEvents();
  saveCashFlowEvents(items.filter((c) => c.id !== id));
}

/* =========================================================================
   TABLE 14: Reward Points & Cashback Vault (Feature 14)
   ========================================================================= */

export function getRewardPrograms(): RewardProgramRecord[] {
  return readTable<RewardProgramRecord>(STORAGE_KEY_REWARDS);
}

export function saveRewardPrograms(items: RewardProgramRecord[]): void {
  writeTable(STORAGE_KEY_REWARDS, items);
}

export function insertRewardProgram(item: Omit<RewardProgramRecord, 'id'>): RewardProgramRecord {
  const items = getRewardPrograms();
  const newItem: RewardProgramRecord = {
    id: `rew_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    card_name: item.card_name.trim(),
    reward_type: item.reward_type,
    balance: Math.max(0, Number(item.balance) || 0),
    cents_per_point: Math.max(0.1, Number(item.cents_per_point) || 1.0),
    expiration_date: item.expiration_date || '',
  };
  items.push(newItem);
  saveRewardPrograms(items);
  return newItem;
}

export function deleteRewardProgram(id: string): void {
  const items = getRewardPrograms();
  saveRewardPrograms(items.filter((r) => r.id !== id));
}

/* =========================================================================
   TABLE 15: No-Spend Days Tracker (Feature 15)
   ========================================================================= */

export function getNoSpendDays(): NoSpendDayRecord[] {
  return readTable<NoSpendDayRecord>(STORAGE_KEY_NO_SPEND);
}

export function saveNoSpendDays(items: NoSpendDayRecord[]): void {
  writeTable(STORAGE_KEY_NO_SPEND, items);
}

export function toggleNoSpendDay(date: string, estimatedSaving: number = 35): boolean {
  const items = getNoSpendDays();
  const existingIndex = items.findIndex((d) => d.date === date);
  if (existingIndex >= 0) {
    items.splice(existingIndex, 1);
    saveNoSpendDays(items);
    return false;
  } else {
    items.push({
      id: `nsd_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      date,
      saved_amount_estimate: estimatedSaving,
    });
    saveNoSpendDays(items);
    return true;
  }
}

/* =========================================================================
   TABLE 16: Sinking Funds Allocator (Feature 16)
   ========================================================================= */

export function getSinkingFundsTable(): SinkingFundRecord[] {
  return readTable<SinkingFundRecord>(STORAGE_KEY_SINKING_FUNDS);
}

export function saveSinkingFundsTable(items: SinkingFundRecord[]): void {
  writeTable(STORAGE_KEY_SINKING_FUNDS, items);
}

export function insertSinkingFund(fund: Omit<SinkingFundRecord, 'id'>): SinkingFundRecord {
  const items = getSinkingFundsTable();
  const newFund: SinkingFundRecord = {
    id: `sf_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name: fund.name.trim(),
    target_amount: Math.max(1, Number(fund.target_amount) || 100),
    current_saved: Math.max(0, Number(fund.current_saved) || 0),
    frequency: fund.frequency || 'Annual',
    target_date: fund.target_date || getDateDaysFromNow(180),
    category: fund.category || 'Other',
  };
  items.push(newFund);
  saveSinkingFundsTable(items);
  return newFund;
}

export function updateSinkingFundSaved(id: string, newSaved: number): void {
  const items = getSinkingFundsTable();
  const target = items.find((f) => f.id === id);
  if (target) {
    target.current_saved = Math.max(0, newSaved);
    saveSinkingFundsTable(items);
  }
}

export function deleteSinkingFund(id: string): void {
  const items = getSinkingFundsTable();
  saveSinkingFundsTable(items.filter((f) => f.id !== id));
}

/* =========================================================================
   COMPUTED BUDGET METRICS HELPER
   ========================================================================= */

export interface BudgetMonthSummary {
  month: string;
  income: number;
  totalSpent: number;
  moneyLeft: number;
  spentPercent: number;
  categoryBreakdown: {
    category: SpendingCategory;
    limit: number;
    spent: number;
    percentOfLimit: number;
    isOver80Percent: boolean;
  }[];
  isFunOver30Percent: boolean;
  smartTipText: string;
  spendingCount: number;
}

export function calculateBudgetMonthSummary(
  settings: BudgetSettingsRecord | null,
  allSpending: DailySpendingRecord[]
): BudgetMonthSummary {
  if (!settings) {
    return {
      month: getCurrentMonthName(),
      income: 0,
      totalSpent: 0,
      moneyLeft: 0,
      spentPercent: 0,
      categoryBreakdown: [],
      isFunOver30Percent: false,
      smartTipText: 'Configure your monthly income and category caps to activate live budget analysis.',
      spendingCount: 0,
    };
  }

  const activeMonthName = settings.month.trim().toLowerCase();

  const monthSpending = allSpending.filter((item) => {
    const itemMonth = getMonthFromDateString(item.date).trim().toLowerCase();
    return itemMonth === activeMonthName;
  });

  const totalSpent = monthSpending.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const income = Number(settings.income) || 0;
  const moneyLeft = income - totalSpent;
  const spentPercent = income > 0 ? (totalSpent / income) * 100 : 0;

  const spendingByCategory: Record<SpendingCategory, number> = {
    Rent: 0,
    Food: 0,
    Transport: 0,
    Fun: 0,
    Bills: 0,
    Other: 0,
  };

  monthSpending.forEach((item) => {
    if (spendingByCategory[item.category] !== undefined) {
      spendingByCategory[item.category] += Number(item.amount) || 0;
    } else {
      spendingByCategory['Other'] += Number(item.amount) || 0;
    }
  });

  const limits: Record<SpendingCategory, number> = {
    Rent: settings.rent || 0,
    Food: settings.food || 0,
    Transport: settings.transport || 0,
    Fun: settings.fun || 0,
    Bills: settings.bills || 0,
    Other: 0,
  };

  const categories: SpendingCategory[] = ['Rent', 'Food', 'Transport', 'Fun', 'Bills'];
  if (spendingByCategory['Other'] > 0) {
    categories.push('Other');
  }

  const categoryBreakdown = categories.map((cat) => {
    const limit = limits[cat] || 0;
    const spent = spendingByCategory[cat] || 0;
    const percentOfLimit = limit > 0 ? (spent / limit) * 100 : spent > 0 ? 100 : 0;
    const isOver80Percent = limit > 0 && spent > limit * 0.8;

    return {
      category: cat,
      limit,
      spent,
      percentOfLimit,
      isOver80Percent,
    };
  });

  const funSpent = spendingByCategory['Fun'] || 0;
  const funLimit = settings.fun || 0;
  const isFunOver30Percent = income > 0 && (funSpent > income * 0.30 || funLimit > income * 0.30);

  const smartTipText = isFunOver30Percent
    ? "You're spending a notable portion on non-essential fun. Trimming $100 frees liquid cash for emergency buffer."
    : "Your budget metrics are balanced. Consistent budgeting accelerates credit score gains.";

  return {
    month: settings.month,
    income,
    totalSpent,
    moneyLeft,
    spentPercent,
    categoryBreakdown,
    isFunOver30Percent,
    smartTipText,
    spendingCount: monthSpending.length,
  };
}
