import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldCheck,
  Plus,
  Calendar,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Clock,
  Trash2,
  X,
  CreditCard,
  Zap,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import {
  BillRecord,
  getBillsTable,
  insertBill,
  toggleBillPaid,
  deleteBill,
  getDaysDifference,
  getMonthFromDateString,
  getCurrentMonthName,
  getTodayDateString,
  getDateDaysFromNow
} from '../data/downbase';

interface BillGuardTabProps {
  onNavigateTab?: (tabId: string) => void;
  onGoBack?: () => void;
  isEmbedded?: boolean;
}

export const BillGuardTab: React.FC<BillGuardTabProps> = ({
  onNavigateTab,
  onGoBack,
  isEmbedded = false
}) => {
  const [bills, setBills] = useState<BillRecord[]>([]);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  
  // New Bill Form State
  const [formName, setFormName] = useState<string>('');
  const [formAmount, setFormAmount] = useState<string>('');
  const [formDueDate, setFormDueDate] = useState<string>(getDateDaysFromNow(7));

  const refreshBills = () => {
    setBills(getBillsTable());
  };

  useEffect(() => {
    refreshBills();
  }, []);

  // Sort bills by due_date ascending
  const sortedBills = useMemo(() => {
    return [...bills].sort((a, b) => {
      const dateA = new Date(a.due_date).getTime();
      const dateB = new Date(b.due_date).getTime();
      return dateA - dateB;
    });
  }, [bills]);

  // Top card: "Next Bill Due" = bill with closest due_date and is_paid=false
  const nextBillDue = useMemo(() => {
    return sortedBills.find((b) => !b.is_paid) || null;
  }, [sortedBills]);

  const nextBillDaysLeft = useMemo(() => {
    if (!nextBillDue) return null;
    return getDaysDifference(nextBillDue.due_date);
  }, [nextBillDue]);

  // If due_date is within 3 days, show RED badge "Due Soon!" and background #FF4D4D10
  const isDueSoon = nextBillDaysLeft !== null && nextBillDaysLeft <= 3 && nextBillDaysLeft >= 0;
  const isOverdue = nextBillDaysLeft !== null && nextBillDaysLeft < 0;

  // Bottom total: "Total Bills This Month: $XXX"
  const currentMonthName = getCurrentMonthName().trim().toLowerCase();
  const totalBillsThisMonth = useMemo(() => {
    return sortedBills
      .filter((b) => {
        const billMonth = getMonthFromDateString(b.due_date).trim().toLowerCase();
        return billMonth === currentMonthName;
      })
      .reduce((sum, b) => sum + (Number(b.amount) || 0), 0);
  }, [sortedBills, currentMonthName]);

  const handleTogglePaid = (id: string) => {
    toggleBillPaid(id);
    refreshBills();
  };

  const handleDelete = (id: string) => {
    deleteBill(id);
    refreshBills();
  };

  const handleAddBill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formAmount || Number(formAmount) <= 0) return;

    const amt = parseFloat(formAmount);
    insertBill({
      name: formName.trim(),
      amount: amt,
      due_date: formDueDate || getTodayDateString(),
      is_paid: false,
    });

    setFormName('');
    setFormAmount('');
    setFormDueDate(getDateDaysFromNow(7));
    setShowAddModal(false);
    refreshBills();
  };

  return (
    <div className={`w-full ${isEmbedded ? '' : 'min-h-full bg-slate-50/70 dark:bg-[#070D1E] text-slate-900 dark:text-white p-3 sm:p-4 pb-24'} select-none`}>
      <div className="w-full max-w-md mx-auto space-y-4">
        
        {/* Header Bar */}
        {!isEmbedded && (
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2.5">
              {onGoBack && (
                <button
                  type="button"
                  onClick={onGoBack}
                  className="p-2 rounded-xl bg-slate-200 dark:bg-[#102244] hover:bg-slate-300 dark:hover:bg-[#152e5c] text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                  title="Go Back"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-[#102244] border border-blue-200 dark:border-[rgba(56,120,210,0.3)] text-[#2563EB] dark:text-[#38BDF8]">
                <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-[10px] font-mono-numeric font-extrabold uppercase tracking-widest text-[#2563EB] dark:text-[#38BDF8]">
                  Feature 1 · Downbase Table: Bills
                </span>
                <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  BillGuard
                </h1>
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-600 text-white text-xs font-black flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add Bill</span>
            </button>
          </div>
        )}

        {isEmbedded && (
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400">
                <ShieldCheck className="w-4 h-4" />
              </span>
              <h3 className="text-base font-black text-white">BillGuard - Never Miss a Bill</h3>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-2.5 py-1.5 rounded-lg bg-[#1E90FF] hover:bg-sky-500 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Bill</span>
            </button>
          </div>
        )}

        {/* TOP CARD: "Next Bill Due" */}
        {nextBillDue ? (
          <div
            className={`rounded-2xl p-4 sm:p-5 shadow-md transition-all border ${
              isDueSoon || isOverdue
                ? 'bg-rose-500/10 border-rose-500/40 text-slate-900 dark:text-white'
                : 'bg-white dark:bg-[#0C182F] border-slate-100 dark:border-[rgba(56,120,210,0.22)] text-slate-900 dark:text-white'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Clock className={`w-4 h-4 ${isDueSoon || isOverdue ? 'text-rose-400' : 'text-slate-400 dark:text-[#8FA0C0]'}`} />
                <span className={`text-[11px] font-mono-numeric font-black uppercase tracking-wider ${
                  isDueSoon || isOverdue ? 'text-rose-400' : 'text-slate-500 dark:text-[#8FA0C0]'
                }`}>
                  Next Bill Due
                </span>
              </div>

              {/* RED badge "Due Soon!" if within 3 days */}
              {isDueSoon && (
                <span className="px-2.5 py-1 rounded-full bg-rose-500 text-white text-[10px] font-black uppercase tracking-wider animate-pulse flex items-center gap-1 shadow-xs">
                  <AlertCircle className="w-3 h-3" />
                  Due Soon!
                </span>
              )}
              {isOverdue && (
                <span className="px-2.5 py-1 rounded-full bg-rose-500 text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-xs">
                  <AlertCircle className="w-3 h-3" />
                  Overdue
                </span>
              )}
              {!isDueSoon && !isOverdue && (
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-[#102244] text-slate-600 dark:text-[#38BDF8] text-[10px] font-bold font-mono-numeric border border-transparent dark:border-[rgba(56,120,210,0.25)]">
                  In {nextBillDaysLeft} days
                </span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  {nextBillDue.name}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-medium text-slate-500 dark:text-[#8FA0C0]">
                    Due {nextBillDue.due_date}
                  </span>
                  <span className="text-slate-400 text-xs">·</span>
                  <span className={`text-xs font-mono font-bold ${isDueSoon || isOverdue ? 'text-rose-400' : 'text-slate-700 dark:text-slate-200'}`}>
                    {nextBillDaysLeft === 0 ? 'Today' : nextBillDaysLeft === 1 ? 'Tomorrow' : `${nextBillDaysLeft} days left`}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className={`text-2xl font-black font-mono-numeric ${isDueSoon || isOverdue ? 'text-rose-400' : 'text-[#2563EB] dark:text-[#38BDF8]'}`}>
                  ${nextBillDue.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <button
                  onClick={() => handleTogglePaid(nextBillDue.id)}
                  className="mt-1 block text-right w-full text-[11px] font-bold text-emerald-500 dark:text-emerald-400 hover:underline cursor-pointer font-mono-numeric"
                >
                  ✓ Quick Mark Paid
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-[#0C182F] border border-slate-100 dark:border-[rgba(56,120,210,0.22)] rounded-2xl p-4 text-center">
            <CheckCircle2 className="w-7 h-7 text-emerald-400 mx-auto mb-1.5" />
            <p className="text-sm font-bold text-slate-900 dark:text-white">All Caught Up!</p>
            <p className="text-xs text-slate-500 dark:text-[#8FA0C0]">No unpaid upcoming bills recorded in Downbase.</p>
          </div>
        )}

        {/* LIST BILLS: sorted by due_date ascending */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-mono-numeric font-bold uppercase text-slate-500 dark:text-[#8FA0C0]">
              Scheduled Bills ({sortedBills.length})
            </span>
            <span className="text-[11px] font-mono-numeric text-slate-400 dark:text-slate-500">
              Sorted by due date
            </span>
          </div>

          <div className="space-y-2 max-h-[360px] overflow-y-auto pr-0.5">
            {sortedBills.length === 0 ? (
              <div className="bg-white dark:bg-[#0C182F] rounded-2xl p-6 text-center text-slate-500 shadow-sm border border-slate-100 dark:border-[rgba(56,120,210,0.22)]">
                <Calendar className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">No Bills Listed</p>
                <p className="text-xs text-slate-400 dark:text-[#8FA0C0] mt-1">Tap "+ Add Bill" to record an upcoming expense.</p>
              </div>
            ) : (
              sortedBills.map((bill) => {
                const daysDiff = getDaysDifference(bill.due_date);
                const isItemDueSoon = !bill.is_paid && daysDiff <= 3 && daysDiff >= 0;
                const isItemOverdue = !bill.is_paid && daysDiff < 0;

                return (
                  <div
                    key={bill.id}
                    className={`rounded-2xl p-3.5 sm:p-4 shadow-sm border transition-all flex items-center justify-between ${
                      bill.is_paid
                        ? 'bg-slate-50 dark:bg-[#0C182F]/60 border-slate-200 dark:border-[rgba(56,120,210,0.12)] opacity-70'
                        : isItemDueSoon
                        ? 'bg-rose-500/10 border-rose-500/40 text-slate-900 dark:text-white'
                        : 'bg-white dark:bg-[#0C182F] border-slate-100 dark:border-[rgba(56,120,210,0.22)]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Checkbox: Mark as Paid -> sets is_paid=true */}
                      <input
                        type="checkbox"
                        checked={bill.is_paid}
                        onChange={() => handleTogglePaid(bill.id)}
                        className="w-5 h-5 rounded-md text-emerald-600 focus:ring-emerald-500 border-slate-300 cursor-pointer transition-transform hover:scale-105"
                        title={bill.is_paid ? 'Mark as Unpaid' : 'Mark as Paid'}
                      />

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className={`text-sm font-bold ${
                            bill.is_paid
                              ? 'line-through text-slate-400 dark:text-slate-500'
                              : isItemDueSoon
                              ? 'text-slate-900 dark:text-white font-extrabold'
                              : 'text-slate-900 dark:text-white'
                          }`}>
                            {bill.name}
                          </h4>

                          {isItemDueSoon && (
                            <span className="px-1.5 py-0.5 rounded-full bg-[#FF4D4D] text-white text-[9px] font-black uppercase tracking-wider">
                              Due Soon!
                            </span>
                          )}

                          {bill.is_paid && (
                            <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[9px] font-black font-mono">
                              PAID
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-[11px] font-mono-numeric mt-0.5">
                          <span className={bill.is_paid ? 'text-slate-400' : isItemDueSoon ? 'text-rose-200' : 'text-slate-500'}>
                            Due: {bill.due_date}
                          </span>
                          {!bill.is_paid && (
                            <>
                              <span className="text-slate-300">·</span>
                              <span className={isItemDueSoon ? 'text-rose-300 font-bold' : isItemOverdue ? 'text-rose-400 font-bold' : 'text-slate-600'}>
                                {daysDiff === 0 ? 'Today' : daysDiff < 0 ? `${Math.abs(daysDiff)}d overdue` : `${daysDiff}d left`}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-base font-black font-mono-numeric ${
                        bill.is_paid
                          ? 'text-slate-400 line-through'
                          : isItemDueSoon
                          ? 'text-rose-200'
                          : 'text-[#1E90FF]'
                      }`}>
                        ${bill.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                      <button
                        onClick={() => handleDelete(bill.id)}
                        className="p-1 rounded-lg hover:bg-slate-100 text-slate-300 hover:text-rose-500 transition-colors cursor-pointer"
                        title="Delete bill"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* BOTTOM TOTAL: "Total Bills This Month: $XXX" */}
        <div className="bg-white text-slate-900 rounded-2xl p-4 shadow-xl border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-50 text-[#1E90FF]">
              <DollarSign className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[10px] font-mono-numeric font-bold uppercase tracking-wider text-slate-400">
                Monthly Commitment
              </span>
              <h3 className="text-sm font-extrabold text-slate-900">
                Total Bills This Month:
              </h3>
            </div>
          </div>
          <span className="text-xl font-black font-mono-numeric text-[#1E90FF]">
            ${totalBillsThisMonth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>

        {/* Modal: + Add Bill */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in duration-150">
            <div className="w-full max-w-sm bg-white text-slate-900 rounded-3xl p-5 shadow-2xl border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-sky-100 text-[#1E90FF]">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">Add New Bill</h3>
                    <p className="text-[11px] text-slate-500">Saves to Downbase Table: Bills</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddBill} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Bill Name (e.g. Electric, Rent, Wifi)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Electric Utility"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#1E90FF] text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Amount ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    placeholder="120.00"
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#1E90FF] text-slate-900 font-mono-numeric"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formDueDate}
                    onChange={(e) => setFormDueDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#1E90FF] text-slate-900 font-mono-numeric"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-[#1E90FF] hover:bg-sky-500 text-white text-xs font-black shadow-md transition-colors cursor-pointer"
                  >
                    Save Bill
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
