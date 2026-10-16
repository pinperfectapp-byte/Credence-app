import React, { useState, useEffect, useMemo } from 'react';
import {
  Utensils,
  Home,
  Gamepad2,
  Car,
  Receipt,
  Plus,
  Trash2,
  Calendar,
  X,
  PieChart,
  DollarSign,
  ArrowLeft,
  SlidersHorizontal,
  CheckCircle2,
  AlertTriangle,
  ShoppingCart,
  ChevronRight
} from 'lucide-react';
import { DownbaseFooter } from './DownbaseFooter';
import {
  BudgetSettingsRecord,
  DailySpendingRecord,
  SpendingCategory,
  getBudgetSettingsTable,
  getLatestBudgetSettings,
  insertBudgetSettings,
  getDailySpendingTable,
  insertDailySpending,
  deleteDailySpending,
  calculateBudgetMonthSummary,
  getCurrentMonthName,
  getTodayDateString,
  getDaysRemainingInMonth
} from '../data/downbase';

interface BudgetTrackerTabProps {
  onNavigateTab?: (tabId: string) => void;
  onGoBack?: () => void;
  isEmbedded?: boolean;
}

export const BudgetTrackerTab: React.FC<BudgetTrackerTabProps> = ({
  onNavigateTab,
  onGoBack,
  isEmbedded = false,
}) => {
  // Downbase state
  const [budgetSettingsList, setBudgetSettingsList] = useState<BudgetSettingsRecord[]>([]);
  const [dailySpendingList, setDailySpendingList] = useState<DailySpendingRecord[]>([]);
  
  // Modals
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState<boolean>(false);
  const [isEditBudgetOpen, setIsEditBudgetOpen] = useState<boolean>(false);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);

  // Form Inputs: Add Expense
  const [expenseAmount, setExpenseAmount] = useState<string>('');
  const [expenseCategory, setExpenseCategory] = useState<SpendingCategory>('Food');
  const [expenseNote, setExpenseNote] = useState<string>('');
  const [expenseDate, setExpenseDate] = useState<string>(getTodayDateString());
  const [formError, setFormError] = useState<string | null>(null);

  // Form Inputs: Edit Budget
  const [inputIncome, setInputIncome] = useState<string>('3200');
  const [inputRent, setInputRent] = useState<string>('1200');
  const [inputFood, setInputFood] = useState<string>('720');
  const [inputFun, setInputFun] = useState<string>('300');
  const [inputTransport, setInputTransport] = useState<string>('400');
  const [inputBills, setInputBills] = useState<string>('580');

  // Load Downbase on mount
  const refreshDownbaseState = () => {
    const settings = getBudgetSettingsTable();
    const spending = getDailySpendingTable();
    setBudgetSettingsList(settings);
    setDailySpendingList(spending);
  };

  useEffect(() => {
    refreshDownbaseState();
  }, []);

  const activeSetting = budgetSettingsList.length > 0 ? budgetSettingsList[budgetSettingsList.length - 1] : null;

  // Initialize input fields if activeSetting exists
  useEffect(() => {
    if (activeSetting) {
      setInputIncome(String(activeSetting.income));
      setInputRent(String(activeSetting.rent));
      setInputFood(String(activeSetting.food));
      setInputFun(String(activeSetting.fun));
      setInputTransport(String(activeSetting.transport));
      setInputBills(String(activeSetting.bills));
    }
  }, [activeSetting]);

  // Compute metrics for active budget
  const summary = useMemo(() => {
    if (!activeSetting) return null;
    return calculateBudgetMonthSummary(activeSetting, dailySpendingList);
  }, [activeSetting, dailySpendingList]);

  // Baseline Fallbacks to Match Exact Image Design ($1,250 money left / $3,200 total budget, 62% used)
  const totalBudget = activeSetting ? activeSetting.income : 3200;
  
  // Dynamic calculation or image exact numbers if clean
  const actualSpent = summary ? summary.totalSpent : 0;
  const hasUserExpenses = dailySpendingList.length > 0;

  // Starts 100% clean with zero fake numbers when untouched
  const displayTotalBudget = activeSetting ? activeSetting.income : 0;
  const displayMoneyLeft = summary ? summary.moneyLeft : 0;
  const displayPercentUsed = summary && displayTotalBudget > 0
    ? Math.min(100, Math.round((summary.totalSpent / displayTotalBudget) * 100))
    : 0;
  const daysRemaining = getDaysRemainingInMonth() || 14;

  // Category values: purely calculated from real user spending
  const foodCategory = summary ? summary.categoryBreakdown.find((c) => c.category === 'Food') : null;
  const foodSpent = foodCategory ? foodCategory.spent : 0;
  const foodPct = foodCategory && displayTotalBudget > 0 ? Math.round((foodSpent / displayTotalBudget) * 100) : 0;

  const rentCategory = summary ? summary.categoryBreakdown.find((c) => c.category === 'Rent') : null;
  const rentSpent = rentCategory ? rentCategory.spent : 0;
  const rentPct = rentCategory && displayTotalBudget > 0 ? Math.round((rentSpent / displayTotalBudget) * 100) : 0;

  const funCategory = summary ? summary.categoryBreakdown.find((c) => c.category === 'Fun') : null;
  const funSpent = funCategory ? funCategory.spent : 0;
  const funPct = funCategory && displayTotalBudget > 0 ? Math.round((funSpent / displayTotalBudget) * 100) : 0;

  // Handle "+ Add Expense"
  const handleAddExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const amountNum = parseFloat(expenseAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setFormError('Please enter a valid amount greater than $0.');
      return;
    }

    insertDailySpending({
      amount: amountNum,
      category: expenseCategory,
      note: expenseNote.trim() || undefined,
      date: expenseDate || getTodayDateString(),
    });

    refreshDownbaseState();
    setExpenseAmount('');
    setExpenseNote('');
    setIsAddExpenseOpen(false);
  };

  // Handle Save Budget Configuration
  const handleSaveBudgetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const incomeNum = parseFloat(inputIncome) || 3000;
    
    insertBudgetSettings({
      month: getCurrentMonthName(),
      income: incomeNum,
      rent: parseFloat(inputRent) || 0,
      food: parseFloat(inputFood) || 0,
      transport: parseFloat(inputTransport) || 0,
      fun: parseFloat(inputFun) || 0,
      bills: parseFloat(inputBills) || 0,
    });

    refreshDownbaseState();
    setIsEditBudgetOpen(false);
  };

  return (
    <div className="w-full space-y-4 pb-6 select-none font-sans text-slate-900 dark:text-white">
      
      {/* ========================================================================= */}
      {/* CARD 1: Money Left (Exact match to Middle Screen in image) */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-[#0C182F] rounded-[20px] p-6 shadow-md border border-slate-100 dark:border-[rgba(56,120,210,0.22)] text-center relative overflow-hidden feature-interactive-card">
        {/* Top pill badge: "Money Left" */}
        <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-slate-100 dark:bg-[#102244] text-slate-700 dark:text-[#38BDF8] border border-transparent dark:border-[rgba(56,120,210,0.25)] text-xs font-bold mb-3 shadow-2xs">
          Money Left
        </div>

        {/* Big Bold Amount */}
        <div className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-sans">
          ${displayMoneyLeft.toLocaleString()}
        </div>

        {/* Subtitle */}
        <div className="text-xs font-semibold text-[#6B7280] dark:text-[#8FA0C0] mt-1">
          {displayTotalBudget > 0 ? `/ $${displayTotalBudget.toLocaleString()} total budget` : 'Budget not set · Tap to calibrate'}
        </div>

        {/* Blue Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-[#081326] rounded-full h-3.5 mt-4 overflow-hidden p-0.5 border border-transparent dark:border-[rgba(56,120,210,0.15)]">
          <div
            className="bg-[#2563EB] h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${Math.min(100, Math.max(displayTotalBudget > 0 ? 2 : 0, displayPercentUsed))}%` }}
          />
        </div>

        {/* Subtext below bar */}
        <div className="text-xs font-medium text-[#6B7280] dark:text-[#8FA0C0] mt-2.5">
          {displayTotalBudget > 0 ? `${displayPercentUsed}% used • ${daysRemaining} days remaining` : 'Clean untouched ledger'}
        </div>

        {/* Manage limits link */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-[rgba(56,120,210,0.18)] flex items-center justify-center gap-4 text-[11px] text-[#2563EB] dark:text-[#38BDF8] font-bold">
          <button
            type="button"
            onClick={() => setIsEditBudgetOpen(true)}
            className="hover:underline cursor-pointer flex items-center gap-1"
          >
            <SlidersHorizontal className="w-3 h-3" />
            <span>Configure Budget Limits</span>
          </button>
          {dailySpendingList.length > 0 && (
            <button
              type="button"
              onClick={() => setShowHistoryModal(true)}
              className="hover:underline cursor-pointer text-slate-500 dark:text-[#8FA0C0]"
            >
              <span>{dailySpendingList.length} Expenses Logged</span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CARD 2: Spending by Category (Exact match to Middle Screen in image) */}
      {/* 3 rows: Food $720 • 23%, Rent $1,200 • 38%, Fun $30 • 1% with color bars */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-[20px] p-5 shadow-md shadow-black/5 space-y-4 text-left feature-interactive-card">
        <h3 className="text-sm font-extrabold text-[#111827] tracking-tight">
          Spending by Category
        </h3>

        <div className="space-y-4">
          {/* Row 1: Food ($720 spent • 23%) with orange food icon + orange progress bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#FFEDD5] text-[#F97316] flex items-center justify-center shrink-0">
                  <Utensils className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-[#111827]">
                  Food
                </span>
              </div>
              <div className="text-xs font-semibold text-[#111827]">
                <span className="font-bold text-slate-900 dark:text-white">${foodSpent.toLocaleString()} spent</span>
                <span className="text-[#6B7280] dark:text-[#8FA0C0]"> • {foodPct}%</span>
              </div>
            </div>
            {/* Orange bar */}
            <div className="w-full bg-slate-100 dark:bg-[#081326] rounded-full h-2 overflow-hidden border border-transparent dark:border-[rgba(56,120,210,0.1)]">
              <div
                className="bg-[#F97316] h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(foodSpent > 0 ? 3 : 0, foodPct))}%` }}
              />
            </div>
          </div>

          {/* Row 2: Rent with blue home icon + blue bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-[#38BDF8] flex items-center justify-center shrink-0">
                  <Home className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  Rent
                </span>
              </div>
              <div className="text-xs font-semibold">
                <span className="font-bold text-slate-900 dark:text-white">${rentSpent.toLocaleString()} spent</span>
                <span className="text-[#6B7280] dark:text-[#8FA0C0]"> • {rentPct}%</span>
              </div>
            </div>
            {/* Blue bar */}
            <div className="w-full bg-slate-100 dark:bg-[#081326] rounded-full h-2 overflow-hidden border border-transparent dark:border-[rgba(56,120,210,0.1)]">
              <div
                className="bg-[#2563EB] h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(rentSpent > 0 ? 3 : 0, rentPct))}%` }}
              />
            </div>
          </div>

          {/* Row 3: Fun with purple game icon + purple bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                  <Gamepad2 className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  Fun
                </span>
              </div>
              <div className="text-xs font-semibold">
                <span className="font-bold text-slate-900 dark:text-white">${funSpent.toLocaleString()} spent</span>
                <span className="text-[#6B7280] dark:text-[#8FA0C0]"> • {funPct}%</span>
              </div>
            </div>
            {/* Purple bar */}
            <div className="w-full bg-slate-100 dark:bg-[#081326] rounded-full h-2 overflow-hidden border border-transparent dark:border-[rgba(56,120,210,0.1)]">
              <div
                className="bg-purple-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(funSpent > 0 ? 3 : 0, funPct))}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BOTTOM BUTTON: "+ Add Expense" */}
      {/* ========================================================================= */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setIsAddExpenseOpen(true)}
          className="w-full py-3.5 px-6 rounded-[20px] bg-white dark:bg-[#0C182F] text-[#2563EB] dark:text-[#38BDF8] font-bold text-sm shadow-md border border-blue-100 dark:border-[rgba(56,120,210,0.25)] hover:bg-blue-50/80 dark:hover:bg-[#102244] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer feature-interactive-card"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add Expense</span>
        </button>
      </div>

      {/* Grocery Card Saver Cross-Engine Shortcut */}
      <div 
        onClick={() => onNavigateTab && onNavigateTab('grocery_saver')}
        className="bg-white dark:bg-[#0C182F] rounded-[20px] p-4 shadow-md border border-slate-100 dark:border-[rgba(56,120,210,0.22)] flex items-center justify-between gap-3 feature-interactive-card hover:border-amber-200 dark:hover:border-amber-500/40 transition-all cursor-pointer text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <ShoppingCart className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">
                Optimize Grocery Cashback
              </h4>
              <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold">
                Up to 6%
              </span>
            </div>
            <p className="text-[11px] text-[#6B7280] dark:text-[#8FA0C0]">
              Save on Food &amp; Supermarket spending with 12 US credit cards
            </p>
          </div>
        </div>
        <div className="p-2 rounded-xl bg-slate-100 dark:bg-[#102244] text-slate-700 dark:text-slate-200 shrink-0">
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: + Add Expense */}
      {/* ========================================================================= */}
      {isAddExpenseOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0C182F] rounded-[20px] p-6 max-w-sm w-full space-y-4 shadow-2xl border border-slate-100 dark:border-[rgba(56,120,210,0.22)] text-slate-900 dark:text-white animate-pop-in">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[rgba(56,120,210,0.18)] pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-50 text-[#2563EB]">
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                </div>
                <h3 className="text-base font-bold text-[#111827]">
                  Add Daily Expense
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddExpenseOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="p-2.5 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleAddExpenseSubmit} className="space-y-3.5">
              {/* Amount */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Amount ($)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-bold">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    autoFocus
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Category
                </label>
                <select
                  value={expenseCategory}
                  onChange={(e) => setExpenseCategory(e.target.value as SpendingCategory)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                >
                  <option value="Food">Food &amp; Dining (Orange)</option>
                  <option value="Rent">Rent &amp; Housing (Blue)</option>
                  <option value="Fun">Fun &amp; Entertainment (Purple)</option>
                  <option value="Transport">Transport &amp; Fuel</option>
                  <option value="Bills">Utility Bills</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Note / Vendor */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Note / Merchant (Optional)
                </label>
                <input
                  type="text"
                  value={expenseNote}
                  onChange={(e) => setExpenseNote(e.target.value)}
                  placeholder="e.g. Grocery store, Netflix"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={expenseDate}
                  onChange={(e) => setExpenseDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                />
              </div>

              {/* Buttons */}
              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddExpenseOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: Configure Budget Limits (Saves into Downbase Budget_Settings table) */}
      {/* ========================================================================= */}
      {isEditBudgetOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[20px] p-6 max-w-sm w-full space-y-4 shadow-2xl border border-slate-100 text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-[#111827]">
                Configure Budget Targets
              </h3>
              <button
                type="button"
                onClick={() => setIsEditBudgetOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveBudgetSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Monthly Total Budget ($)
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={inputIncome}
                  onChange={(e) => setInputIncome(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                    Rent / Housing ($)
                  </label>
                  <input
                    type="number"
                    value={inputRent}
                    onChange={(e) => setInputRent(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                    Food ($)
                  </label>
                  <input
                    type="number"
                    value={inputFood}
                    onChange={(e) => setInputFood(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                    Fun ($)
                  </label>
                  <input
                    type="number"
                    value={inputFun}
                    onChange={(e) => setInputFun(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                    Transport ($)
                  </label>
                  <input
                    type="number"
                    value={inputTransport}
                    onChange={(e) => setInputTransport(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditBudgetOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Save Budget
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: View Logged Daily Expenses */}
      {/* ========================================================================= */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[20px] p-6 max-w-sm w-full space-y-3 shadow-2xl border border-slate-100 text-slate-900 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-[#111827]">
                Logged Daily Expenses ({dailySpendingList.length})
              </h3>
              <button
                type="button"
                onClick={() => setShowHistoryModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1 divide-y divide-slate-100">
              {dailySpendingList.map((exp) => (
                <div key={exp.id} className="pt-2 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-[#111827] capitalize block">
                      {exp.category} {exp.note ? `• ${exp.note}` : ''}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {exp.date}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#2563EB]">
                      ${exp.amount.toFixed(2)}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        deleteDailySpending(exp.id);
                        refreshDownbaseState();
                      }}
                      className="p-1 text-slate-300 hover:text-rose-500 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Downbase Footer Features */}
      <div className="pt-4">
        <DownbaseFooter
          onOpenLegal={() => {}}
          onNavigateTab={onNavigateTab}
        />
      </div>

    </div>
  );
};
