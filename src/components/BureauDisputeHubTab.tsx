import React, { useState } from 'react';
import { CreditProfile, DerogatoryItem, DisputeLetterType } from '../types/credit';
import { BUREAUS, generateDisputeLetter } from '../utils/disputeLetters';
import { 
  FileText, 
  Copy, 
  Printer, 
  Check, 
  AlertCircle, 
  Scale, 
  Send, 
  Trash2, 
  ShieldAlert,
  HelpCircle,
  Plus
} from 'lucide-react';

interface BureauDisputeHubTabProps {
  profile: CreditProfile;
  onUpdateDerogatoryStatus: (itemId: string, newStatus: 'Reported' | 'Disputed' | 'Pending Verification' | 'Removed') => void;
  onAddDerogatoryItem: (newItem: DerogatoryItem) => void;
}

export const BureauDisputeHubTab: React.FC<BureauDisputeHubTabProps> = ({
  profile,
  onUpdateDerogatoryStatus,
  onAddDerogatoryItem,
}) => {
  const [selectedItemId, setSelectedItemId] = useState<string>(
    profile.derogatoryItems[0]?.id || ''
  );
  const [selectedBureau, setSelectedBureau] = useState<'Experian' | 'Equifax' | 'TransUnion'>('Experian');
  const [letterType, setLetterType] = useState<DisputeLetterType>('fcra_609');
  const [copied, setCopied] = useState<boolean>(false);
  const [settlementOffer, setSettlementOffer] = useState<number>(180);

  // New item modal state
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newCreditor, setNewCreditor] = useState<string>('');
  const [newBalance, setNewBalance] = useState<string>('250');
  const [newType, setNewType] = useState<'medical_debt' | 'late_payment_30' | 'collection' | 'unauthorized_inquiry'>('medical_debt');

  const selectedItem = profile.derogatoryItems.find((item) => item.id === selectedItemId);

  // Auto-switch default letter type when selecting an item
  const handleSelectItem = (item: DerogatoryItem) => {
    setSelectedItemId(item.id);
    if (item.itemType === 'medical_debt' && item.balance < 500) {
      setLetterType('cfpb_medical');
    } else if (item.itemType === 'late_payment_30') {
      setLetterType('goodwill_late');
    } else if (item.itemType === 'unauthorized_inquiry') {
      setLetterType('unauthorized_inquiry');
    } else {
      setLetterType('fcra_609');
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generatedLetterObj = selectedItem
    ? generateDisputeLetter(
        profile,
        selectedItem,
        selectedBureau,
        letterType,
        settlementOffer
      )
    : null;

  const letterBody = generatedLetterObj ? generatedLetterObj.body : '';

  const handleCreateNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCreditor.trim()) return;

    const newItem: DerogatoryItem = {
      id: `custom_${Date.now()}`,
      accountName: newCreditor,
      originalCreditor: newCreditor,
      accountNumberMasked: '...4912',
      itemType: newType,
      balance: parseFloat(newBalance) || 0,
      dateReported: new Date().toISOString().split('T')[0],
      bureausReported: ['Experian', 'Equifax', 'TransUnion'],
      status: 'Reported',
      isEligibleFor609: true,
      notes: 'User-reported inaccuracy slated for statutory investigation.',
    };

    onAddDerogatoryItem(newItem);
    setSelectedItemId(newItem.id);
    handleSelectItem(newItem);
    setShowAddModal(false);
    setNewCreditor('');
  };

  return (
    <div className="space-y-8 pb-8">
      {/* 1. Federal Rights Overview Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
              <Scale className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Federal Fair Credit Reporting Act (15 U.S.C. § 1681)</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Bureau Dispute &amp; Legal Deletion Suite
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Federal law places the burden of proof on the credit bureaus. If an agency cannot produce original physical proof of your debt within 30 statutory days, or if an item violates CFPB rules, it <strong className="text-slate-900 dark:text-white">must be deleted</strong> by law.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 rounded-lg transition-colors flex items-center gap-1.5 self-start md:self-center shrink-0 cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Disputed Item</span>
          </button>
        </div>
      </div>

      {/* 2. Derogatory Items Inventory */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs transition-colors">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Reported Negative Marks &amp; Inaccuracies ({profile.derogatoryItems.length})
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Select an account below to generate its customized legal dispute packet.
            </p>
          </div>
        </div>

        {profile.derogatoryItems.length === 0 ? (
          <div className="py-12 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">No Negative Marks Found</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
              Your credit report is 100% clean of collections, late payments, and unauthorized inquiries.
            </p>
            <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                + Add Account to Audit
              </button>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800 mt-2">
            {profile.derogatoryItems.map((item) => {
              const isSelected = item.id === selectedItemId;
              const isRemoved = item.status === 'Removed';

              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectItem(item)}
                  className={`py-4 px-3 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 shadow-xs'
                      : 'hover:bg-slate-50/60 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">{item.accountName}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-mono-numeric">
                        ({item.accountNumberMasked})
                      </span>
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-sm ${
                          isRemoved
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 line-through'
                            : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-400'
                        }`}
                      >
                        {item.itemType.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className="text-xs font-mono-numeric font-bold text-slate-900 dark:text-white">
                        ${item.balance.toLocaleString()}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300">{item.notes}</p>

                    <div className="flex items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500 pt-0.5">
                      <span>Bureaus: {item.bureausReported.join(', ')}</span>
                      <span>·</span>
                      <span>Reported: {item.dateReported}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={item.status}
                      onChange={(e) =>
                        onUpdateDerogatoryStatus(item.id, e.target.value as any)
                      }
                      className="text-xs font-semibold rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-2.5 py-1.5 focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="Reported">Status: Reported</option>
                      <option value="Disputed">Status: Disputed</option>
                      <option value="Pending Verification">Status: Pending (30-Day Clock)</option>
                      <option value="Removed">Status: Removed (+48 pts!)</option>
                    </select>

                    <button
                      onClick={() => handleSelectItem(item)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                        isSelected
                          ? 'bg-slate-900 dark:bg-emerald-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      Select
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 3. Letter Generator Pane */}
      {selectedItem && (
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-4 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 gap-2">
            <div>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                Target: {selectedItem.accountName}
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Formal Statutory Dispute Package
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy(letterBody)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Letter'}</span>
              </button>
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer border border-slate-700"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Formal Letter</span>
              </button>
            </div>
          </div>

          {/* Letter Type Tabs */}
          <div className="flex flex-wrap gap-2 text-xs">
            <button
              onClick={() => setLetterType('fcra_609')}
              className={`px-3 py-1.5 rounded-lg border font-medium transition-colors cursor-pointer ${
                letterType === 'fcra_609'
                  ? 'bg-slate-900 dark:bg-emerald-600 text-white border-slate-900 dark:border-emerald-600 font-bold'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750'
              }`}
            >
              FCRA 609 / 611 Method of Verification
            </button>
            <button
              onClick={() => setLetterType('cfpb_medical')}
              className={`px-3 py-1.5 rounded-lg border font-medium transition-colors cursor-pointer ${
                letterType === 'cfpb_medical'
                  ? 'bg-slate-900 dark:bg-emerald-600 text-white border-slate-900 dark:border-emerald-600 font-bold'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750'
              }`}
            >
              CFPB Medical Debt &lt; $500 Rule
            </button>
            <button
              onClick={() => setLetterType('goodwill_late')}
              className={`px-3 py-1.5 rounded-lg border font-medium transition-colors cursor-pointer ${
                letterType === 'goodwill_late'
                  ? 'bg-slate-900 dark:bg-emerald-600 text-white border-slate-900 dark:border-emerald-600 font-bold'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750'
              }`}
            >
              Goodwill Late Adjustment
            </button>
            <button
              onClick={() => setLetterType('pay_for_delete')}
              className={`px-3 py-1.5 rounded-lg border font-medium transition-colors cursor-pointer ${
                letterType === 'pay_for_delete'
                  ? 'bg-slate-900 dark:bg-emerald-600 text-white border-slate-900 dark:border-emerald-600 font-bold'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750'
              }`}
            >
              Pay-for-Delete Settlement Offer
            </button>
          </div>

          {/* Letter Body Display */}
          <div className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-6 font-mono text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed max-h-[500px] overflow-y-auto shadow-inner">
            {letterBody}
          </div>
        </section>
      )}

      {/* New Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-md w-full p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Add Disputed Negative Item
            </h3>
            <form onSubmit={handleCreateNewItem} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Creditor or Collection Agency Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Portfolio Recovery Associates"
                  value={newCreditor}
                  onChange={(e) => setNewCreditor(e.target.value)}
                  required
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Item Category
                </label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white"
                >
                  <option value="medical_debt">Medical Debt (Under $500 CFPB Rule)</option>
                  <option value="late_payment_30">Late Payment (30-day mark)</option>
                  <option value="collection">Third-Party Collection Agency</option>
                  <option value="unauthorized_inquiry">Unauthorized Hard Inquiry</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Reported Balance ($)
                </label>
                <input
                  type="number"
                  min="0"
                  value={newBalance}
                  onChange={(e) => setNewBalance(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white font-mono-numeric"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 rounded-md cursor-pointer"
                >
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
