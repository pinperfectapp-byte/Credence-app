import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldAlert,
  Plus,
  Trash2,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  X,
  ArrowLeft,
  Info,
  ShieldCheck,
  FileText
} from 'lucide-react';
import {
  CreditInquiryRecord,
  getInquiriesTable,
  insertInquiry,
  deleteInquiry,
  getTodayDateString
} from '../data/downbase';

interface InquiriesShieldTabProps {
  onNavigateTab?: (tabId: string) => void;
  onGoBack?: () => void;
  isEmbedded?: boolean;
}

export const InquiriesShieldTab: React.FC<InquiriesShieldTabProps> = ({
  onNavigateTab,
  onGoBack,
  isEmbedded = false
}) => {
  const [inquiries, setInquiries] = useState<CreditInquiryRecord[]>([]);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // Form state
  const [creditor, setCreditor] = useState<string>('');
  const [bureau, setBureau] = useState<CreditInquiryRecord['bureau']>('Experian');
  const [inquiryDate, setInquiryDate] = useState<string>(getTodayDateString());
  const [inquiryType, setInquiryType] = useState<CreditInquiryRecord['type']>('Credit Card');
  const [notes, setNotes] = useState<string>('');

  const refreshInquiries = () => {
    setInquiries(getInquiriesTable());
  };

  useEffect(() => {
    refreshInquiries();
  }, []);

  // Compute days and months elapsed and remaining until 24-month statutory fall-off
  const enrichedInquiries = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return inquiries.map((item) => {
      const inqDate = new Date(item.inquiry_date + 'T00:00:00');
      const diffTime = today.getTime() - inqDate.getTime();
      const daysElapsed = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
      const monthsElapsed = Math.floor(daysElapsed / 30.4);

      // FCRA § 605: hard pulls drop off after 730 days (24 months)
      const daysRemaining = Math.max(0, 730 - daysElapsed);
      const monthsRemaining = Math.max(0, Math.ceil(daysRemaining / 30.4));

      // Impact on scoring algorithms is typically only active during first 12 months (365 days)
      const hasScoreImpact = daysElapsed <= 365;

      return {
        ...item,
        daysElapsed,
        monthsElapsed,
        daysRemaining,
        monthsRemaining,
        hasScoreImpact,
      };
    });
  }, [inquiries]);

  // Scoring impact tier
  const activeCount = enrichedInquiries.filter((i) => i.hasScoreImpact).length;
  const impactTier = useMemo(() => {
    if (activeCount === 0) return { label: 'Optimal / Zero Impact', color: 'text-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/30' };
    if (activeCount <= 2) return { label: 'Low Impact (-0 to -10 pts)', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' };
    if (activeCount <= 4) return { label: 'Moderate Impact (-10 to -25 pts)', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' };
    return { label: 'Elevated Impact (-30+ pts)', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/30' };
  }, [activeCount]);

  const handleAddInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!creditor.trim() || !inquiryDate) return;

    insertInquiry({
      creditor: creditor.trim(),
      bureau,
      inquiry_date: inquiryDate,
      type: inquiryType,
      notes: notes.trim(),
    });

    setCreditor('');
    setNotes('');
    setInquiryDate(getTodayDateString());
    setShowAddModal(false);
    refreshInquiries();
  };

  const handleDelete = (id: string) => {
    deleteInquiry(id);
    refreshInquiries();
  };

  return (
    <div className={`w-full ${isEmbedded ? '' : 'min-h-full bg-[#0A1931] text-slate-100 p-3 sm:p-4 pb-28'} select-none`}>
      <div className="w-full max-w-md mx-auto space-y-4">

        {/* Top Header */}
        {!isEmbedded && (
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2.5">
              {onGoBack && (
                <button
                  onClick={onGoBack}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 transition-colors cursor-pointer"
                  title="Go Back"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              <div className="p-2.5 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-400">
                <ShieldAlert className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-[10px] font-mono-numeric font-black uppercase tracking-widest text-indigo-400">
                  Feature 9 · Hard-Pull Shield
                </span>
                <h1 className="text-xl font-black text-white tracking-tight">
                  Inquiry Shield
                </h1>
              </div>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold font-mono-numeric shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Log Inquiry</span>
            </button>
          </div>
        )}

        {/* Status Card */}
        <div className="bg-gradient-to-br from-slate-900 via-[#0A1931] to-indigo-950 border border-indigo-500/20 rounded-3xl p-4.5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 font-mono-numeric">
              Active Hard Inquiries (&lt; 12 mos)
            </span>
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-black font-mono-numeric border ${impactTier.bg} ${impactTier.color}`}>
              {impactTier.label}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-[10px] text-slate-400 font-mono block">Total Logged</span>
              <span className="text-lg font-black font-mono-numeric text-white">{inquiries.length}</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-[10px] text-slate-400 font-mono block">Active Impact</span>
              <span className="text-lg font-black font-mono-numeric text-amber-400">{activeCount}</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-[10px] text-slate-400 font-mono block">Aging Out</span>
              <span className="text-lg font-black font-mono-numeric text-emerald-400">
                {enrichedInquiries.filter((i) => !i.hasScoreImpact).length}
              </span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-white/5 text-[11px] text-slate-300 flex items-start gap-2 leading-relaxed">
            <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <span>
              Under FCRA § 605, hard inquiries must legally be removed after <strong>24 months (730 days)</strong>. Scoring algorithms only factor them into point scoring for the first <strong>12 months</strong>.
            </span>
          </div>
        </div>

        {/* Inquiries List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-mono-numeric font-bold uppercase text-slate-400">
              Logged Hard Pulls ({inquiries.length})
            </span>
            <span className="text-[11px] font-mono-numeric text-slate-500">
              Downbase Table: Credit_Inquiries
            </span>
          </div>

          {enrichedInquiries.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center text-slate-400">
              <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-white">Clean Inquiry File</p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                No credit inquiries recorded in Downbase. Tap "+ Log Inquiry" when you apply for a credit card or loan to monitor the 24-month expiration clock.
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-0.5">
              {enrichedInquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="bg-white text-slate-900 rounded-2xl p-3.5 shadow-sm border border-slate-100 flex items-center justify-between transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-slate-900">{inq.creditor}</h4>
                      <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-indigo-50 text-indigo-700 font-bold font-mono">
                        {inq.bureau}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono-numeric">
                      <span>{inq.type}</span>
                      <span>·</span>
                      <span>Pulled: {inq.inquiry_date}</span>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] font-mono-numeric">
                      {inq.daysRemaining === 0 ? (
                        <span className="text-emerald-600 font-bold">✓ 24 Months Reached — Eligible for Removal</span>
                      ) : (
                        <span className="text-slate-600">
                          Expires in <strong className="text-indigo-600">{inq.monthsRemaining} mos</strong> ({inq.daysRemaining} days)
                        </span>
                      )}
                      <span className="text-slate-300">·</span>
                      <span className={inq.hasScoreImpact ? 'text-amber-600 font-semibold' : 'text-slate-400'}>
                        {inq.hasScoreImpact ? 'Active point impact' : 'Zero score impact'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(inq.id)}
                    className="p-2 text-slate-300 hover:text-rose-500 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Delete Inquiry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-700 text-white rounded-3xl p-5 w-full max-w-sm shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-indigo-400" />
                  <h3 className="font-black text-base">Record Hard Inquiry</h3>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddInquiry} className="space-y-3 font-mono-numeric">
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Creditor / Bank Name</label>
                  <input
                    type="text"
                    value={creditor}
                    onChange={(e) => setCreditor(e.target.value)}
                    placeholder="e.g. National Financial Bank"
                    required
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-slate-300 block mb-1">Bureau</label>
                    <select
                      value={bureau}
                      onChange={(e) => setBureau(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-400"
                    >
                      <option value="Experian">Experian</option>
                      <option value="TransUnion">TransUnion</option>
                      <option value="Equifax">Equifax</option>
                      <option value="All Bureaus">All Bureaus</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 block mb-1">Inquiry Date</label>
                    <input
                      type="date"
                      value={inquiryDate}
                      onChange={(e) => setInquiryDate(e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1">Account Category</label>
                  <select
                    value={inquiryType}
                    onChange={(e) => setInquiryType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-400"
                  >
                    <option value="Credit Card">Credit Card</option>
                    <option value="Auto Loan">Auto Loan</option>
                    <option value="Mortgage">Mortgage</option>
                    <option value="Personal Loan">Personal Loan</option>
                    <option value="Unrecognized">Unrecognized (Dispute)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1">Notes (Optional)</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Rate shopping for new auto"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-400"
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-md"
                  >
                    Save Inquiry
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
