import React, { useState, useEffect, useMemo } from 'react';
import {
  Scale,
  Plus,
  Trash2,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  X,
  ArrowLeft,
  ShieldCheck,
  FileText,
  Send,
  ExternalLink
} from 'lucide-react';
import {
  DisputeCaseRecord,
  getDisputeCasesTable,
  insertDisputeCase,
  updateDisputeStatus,
  deleteDisputeCase,
  getTodayDateString
} from '../data/downbase';

interface DisputeClockTabProps {
  onNavigateTab?: (tabId: string) => void;
  onGoBack?: () => void;
  isEmbedded?: boolean;
}

export const DisputeClockTab: React.FC<DisputeClockTabProps> = ({
  onNavigateTab,
  onGoBack,
  isEmbedded = false
}) => {
  const [cases, setCases] = useState<DisputeCaseRecord[]>([]);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // Form state
  const [creditorName, setCreditorName] = useState<string>('');
  const [bureau, setBureau] = useState<DisputeCaseRecord['bureau']>('Experian');
  const [sentDate, setSentDate] = useState<string>(getTodayDateString());
  const [trackingNumber, setTrackingNumber] = useState<string>('');
  const [reason, setReason] = useState<DisputeCaseRecord['reason']>('Inaccurate Balance');

  const refreshCases = () => {
    setCases(getDisputeCasesTable());
  };

  useEffect(() => {
    refreshCases();
  }, []);

  // Compute 30-day clock for each dispute case
  const enrichedCases = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return cases.map((item) => {
      const sent = new Date(item.sent_date + 'T00:00:00');
      const diffTime = today.getTime() - sent.getTime();
      const daysElapsed = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
      const daysRemaining = Math.max(0, 30 - daysElapsed);
      const isPast30Days = daysElapsed >= 30;

      return {
        ...item,
        daysElapsed,
        daysRemaining,
        isPast30Days,
      };
    });
  }, [cases]);

  const activeCasesCount = enrichedCases.filter((c) => c.status !== 'Deleted').length;
  const deletedCount = enrichedCases.filter((c) => c.status === 'Deleted').length;

  const handleAddCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!creditorName.trim() || !sentDate) return;

    insertDisputeCase({
      creditor_name: creditorName.trim(),
      bureau,
      sent_date: sentDate,
      tracking_number: trackingNumber.trim(),
      status: 'Sent',
      reason,
    });

    setCreditorName('');
    setTrackingNumber('');
    setSentDate(getTodayDateString());
    setShowAddModal(false);
    refreshCases();
  };

  const handleStatusChange = (id: string, status: DisputeCaseRecord['status']) => {
    updateDisputeStatus(id, status);
    refreshCases();
  };

  const handleDelete = (id: string) => {
    deleteDisputeCase(id);
    refreshCases();
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
              <div className="p-2.5 rounded-2xl bg-amber-500/20 border border-amber-400/30 text-amber-400">
                <Scale className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-[10px] font-mono-numeric font-black uppercase tracking-widest text-amber-400">
                  Feature 11 · FCRA Statutory Clock
                </span>
                <h1 className="text-xl font-black text-white tracking-tight">
                  Dispute Clock
                </h1>
              </div>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold font-mono-numeric shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Track Letter</span>
            </button>
          </div>
        )}

        {/* Legal Context Card */}
        <div className="bg-gradient-to-br from-slate-900 via-[#0A1931] to-amber-950 border border-amber-500/20 rounded-3xl p-4.5 shadow-xl space-y-3 font-mono-numeric">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300">
              15 U.S.C. § 1681i Statutory Window
            </span>
            <span className="px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-400/30 text-amber-300 text-[10px] font-black">
              30-Day Mandatory Limit
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-[10px] text-slate-400 font-mono block">In Investigation</span>
              <span className="text-lg font-black text-amber-400">{activeCasesCount}</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-[10px] text-slate-400 font-mono block">Successfully Deleted</span>
              <span className="text-lg font-black text-emerald-400">{deletedCount}</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-white/5 text-[11px] text-slate-300 leading-relaxed">
            By federal law, credit bureaus must investigate disputes within <strong>30 calendar days</strong> of receiving your certified letter. If unverified within 30 days, they <strong>must delete</strong> the tradeline.
          </div>
        </div>

        {/* Dispute Cases List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-mono-numeric font-bold uppercase text-slate-400">
              Tracked Disputes ({cases.length})
            </span>
            <span className="text-[11px] font-mono-numeric text-slate-500">
              Table: Dispute_Cases
            </span>
          </div>

          {enrichedCases.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center text-slate-400">
              <Scale className="w-8 h-8 text-amber-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-white">No Active Dispute Clocks</p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                Sent a dispute letter via USPS Certified Mail? Log it here to run the statutory 30-day countdown timer.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-0.5">
              {enrichedCases.map((c) => {
                const percentComplete = Math.min(100, Math.round((c.daysElapsed / 30) * 100));

                return (
                  <div
                    key={c.id}
                    className="bg-white text-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 space-y-2.5 font-mono-numeric"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-black text-slate-900">{c.creditor_name}</h4>
                          <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-amber-50 text-amber-700 font-bold uppercase">
                            {c.bureau}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500">
                          Reason: {c.reason} · Sent {c.sent_date}
                        </span>
                      </div>

                      <div className="text-right">
                        {c.status === 'Deleted' ? (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black">
                            ✓ DELETED
                          </span>
                        ) : c.isPast30Days ? (
                          <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 text-[10px] font-black">
                            ⏰ 30 DAYS EXPIRED
                          </span>
                        ) : (
                          <span className="text-sm font-black text-amber-600">
                            Day {c.daysElapsed} / 30
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar of 30 days */}
                    {c.status !== 'Deleted' && (
                      <div className="space-y-1">
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              c.isPast30Days ? 'bg-rose-500' : 'bg-amber-500'
                            }`}
                            style={{ width: `${percentComplete}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-500">
                          <span>
                            {c.isPast30Days
                              ? 'Statutory deadline passed! Bureau must delete.'
                              : `${c.daysRemaining} days remaining for bureau response`}
                          </span>
                          {c.tracking_number && <span>Tracking: {c.tracking_number}</span>}
                        </div>
                      </div>
                    )}

                    {/* Status updater buttons */}
                    <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleStatusChange(c.id, 'Deleted')}
                          className="px-2 py-0.5 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] font-black transition-colors cursor-pointer"
                        >
                          Mark Deleted
                        </button>
                        <button
                          onClick={() => handleStatusChange(c.id, 'Under Investigation')}
                          className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold transition-colors cursor-pointer"
                        >
                          Investigating
                        </button>
                        <button
                          onClick={() => handleStatusChange(c.id, 'Verified / Disputed')}
                          className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold transition-colors cursor-pointer"
                        >
                          Verified
                        </button>
                      </div>

                      <button
                        onClick={() => handleDelete(c.id)}
                        className="p-1 text-slate-300 hover:text-rose-500 transition-colors cursor-pointer"
                        title="Delete Case"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-700 text-white rounded-3xl p-5 w-full max-w-sm shadow-2xl space-y-3 font-mono-numeric">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <Scale className="w-5 h-5 text-amber-400" />
                  <h3 className="font-black text-sm">Start 30-Day Dispute Clock</h3>
                </div>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddCase} className="space-y-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Creditor or Collection Agency</label>
                  <input
                    type="text"
                    value={creditorName}
                    onChange={(e) => setCreditorName(e.target.value)}
                    placeholder="e.g. Portfolio Recovery / Credit Bureau"
                    required
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Bureau</label>
                    <select
                      value={bureau}
                      onChange={(e) => setBureau(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                    >
                      <option value="Experian">Experian</option>
                      <option value="TransUnion">TransUnion</option>
                      <option value="Equifax">Equifax</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Date Letter Sent</label>
                    <input
                      type="date"
                      value={sentDate}
                      onChange={(e) => setSentDate(e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Dispute Basis (FCRA § 611)</label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                  >
                    <option value="Inaccurate Balance">Inaccurate Balance / Account Amount</option>
                    <option value="Unverified Account">Unverified Account / Missing Promissory Note</option>
                    <option value="Identity Dispute">Identity Dispute / Not My Account</option>
                    <option value="Late Payment Error">Late Payment Error (Never 30 Days Late)</option>
                    <option value="Zombie Debt">Zombie Debt / Past Statute of Limitations</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">USPS Certified Tracking # (Optional)</label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="e.g. 7020 0640 0001 2345 6789"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl"
                  >
                    Start 30-Day Clock
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
