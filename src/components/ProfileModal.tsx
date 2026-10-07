import React, { useState, useEffect } from 'react';
import { CreditCardAccount, CreditProfile } from '../types/credit';
import { User, Plus, Trash2, X, RotateCcw, CreditCard, Shield, MapPin } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeProfile: CreditProfile;
  onUpdateProfile: (updatedProfile: CreditProfile) => void;
  onResetToBlank: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  activeProfile,
  onUpdateProfile,
  onResetToBlank,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'cards'>('profile');

  // Personal & Credit details state
  const [name, setName] = useState(activeProfile.name);
  const [email, setEmail] = useState(activeProfile.email);
  const [address, setAddress] = useState(activeProfile.address);
  const [cityStateZip, setCityStateZip] = useState(activeProfile.cityStateZip);
  const [ssnLast4, setSsnLast4] = useState(activeProfile.ssnLast4);
  const [baseScore, setBaseScore] = useState(activeProfile.baseScore);
  const [creditAgeYears, setCreditAgeYears] = useState(activeProfile.creditAgeYears);
  const [totalInquiries, setTotalInquiries] = useState(activeProfile.totalInquiries);
  const [hasInstallmentLoan, setHasInstallmentLoan] = useState(activeProfile.hasInstallmentLoan);

  // Cards state
  const [cards, setCards] = useState<CreditCardAccount[]>(activeProfile.cards);

  // New card form inputs
  const [newCardName, setNewCardName] = useState('');
  const [newCardBank, setNewCardBank] = useState('');
  const [newCardBalance, setNewCardBalance] = useState('');
  const [newCardLimit, setNewCardLimit] = useState('');
  const [newCardStatementDay, setNewCardStatementDay] = useState('15');
  const [newCardDueDay, setNewCardDueDay] = useState('10');
  const [newCardApr, setNewCardApr] = useState('24.99');

  // Sync state whenever activeProfile changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setName(activeProfile.name);
      setEmail(activeProfile.email);
      setAddress(activeProfile.address);
      setCityStateZip(activeProfile.cityStateZip);
      setSsnLast4(activeProfile.ssnLast4);
      setBaseScore(activeProfile.baseScore);
      setCreditAgeYears(activeProfile.creditAgeYears);
      setTotalInquiries(activeProfile.totalInquiries);
      setHasInstallmentLoan(activeProfile.hasInstallmentLoan);
      setCards(activeProfile.cards);
    }
  }, [isOpen, activeProfile]);

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const clampedScore = baseScore > 0 ? Math.min(850, Math.max(300, baseScore)) : 680;
    const updated: CreditProfile = {
      ...activeProfile,
      name: name.trim() || 'My Credit Profile',
      email: email.trim(),
      address: address.trim(),
      cityStateZip: cityStateZip.trim(),
      ssnLast4: ssnLast4.trim(),
      baseScore: clampedScore,
      bureaus: {
        experian: clampedScore,
        transUnion: clampedScore,
        equifax: clampedScore,
      },
      creditAgeYears: Math.max(0, creditAgeYears),
      totalInquiries: Math.max(0, totalInquiries),
      hasInstallmentLoan,
      cards,
    };
    onUpdateProfile(updated);
    onClose();
  };

  const handleAddCard = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newCardName.trim()) return;

    const limit = Math.max(100, parseFloat(newCardLimit) || 1000);
    const balance = Math.max(0, parseFloat(newCardBalance) || 0);

    const newCard: CreditCardAccount = {
      id: `card_${Date.now()}`,
      name: newCardName.trim(),
      bank: newCardBank.trim() || 'Credit Card Issuer',
      balance,
      creditLimit: limit,
      statementClosingDay: Math.min(31, Math.max(1, parseInt(newCardStatementDay) || 15)),
      paymentDueDay: Math.min(31, Math.max(1, parseInt(newCardDueDay) || 10)),
      apr: parseFloat(newCardApr) || 24.99,
      isPaidForStatement: false,
    };

    setCards([...cards, newCard]);
    setNewCardName('');
    setNewCardBank('');
    setNewCardBalance('');
    setNewCardLimit('');
  };

  const handleRemoveCard = (cardId: string) => {
    setCards(cards.filter((c) => c.id !== cardId));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl max-w-xl w-full p-6 shadow-xl border border-slate-200 space-y-5 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-base">My Credit Profile &amp; Accounts</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 cursor-pointer text-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Personal &amp; Credit Scores
          </button>
          <button
            onClick={() => setActiveTab('cards')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              activeTab === 'cards'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Credit Cards ({cards.length})
          </button>
        </div>

        {activeTab === 'profile' ? (
          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            {/* Identity & Legal Info */}
            <div className="space-y-3">
              <span className="font-bold text-slate-900 block text-xs flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>Identity &amp; Legal Address (For FCRA Bureau Letters)</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Your Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="e.g. john.doe@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-700 block mb-1">Street Address</label>
                  <input
                    type="text"
                    placeholder="e.g. 123 Main Street, Apt 4B"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">City, State &amp; Zip</label>
                  <input
                    type="text"
                    placeholder="e.g. Austin, TX 78701"
                    value={cityStateZip}
                    onChange={(e) => setCityStateZip(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">SSN (Last 4 Digits Only)</label>
                  <input
                    type="text"
                    maxLength={4}
                    placeholder="e.g. 1234"
                    value={ssnLast4}
                    onChange={(e) => setSsnLast4(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono-numeric focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Credit Score & Bureau Factors */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <span className="font-bold text-slate-900 block text-xs flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                <span>Credit Scores &amp; Credit File Metrics</span>
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">FICO® Score (300–850)</label>
                  <input
                    type="number"
                    min="300"
                    max="850"
                    placeholder="e.g. 680"
                    value={baseScore === 0 ? '' : baseScore}
                    onChange={(e) => setBaseScore(parseInt(e.target.value) || 0)}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono-numeric font-bold focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Average Credit Age (Yrs)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={creditAgeYears}
                    onChange={(e) => setCreditAgeYears(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono-numeric focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Hard Inquiries (Past 2 Yrs)</label>
                  <input
                    type="number"
                    min="0"
                    value={totalInquiries}
                    onChange={(e) => setTotalInquiries(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono-numeric focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Installment Loan Switch */}
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 mt-2">
                <div>
                  <span className="font-semibold text-slate-800 block text-xs">
                    Do you have an Installment Loan?
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Auto loan, student loan, or mortgage (fulfills 10% credit mix)
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={hasInstallmentLoan}
                  onChange={(e) => setHasInstallmentLoan(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded-sm border-slate-300 focus:ring-emerald-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={onResetToBlank}
                className="text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1 font-medium cursor-pointer"
                title="Completely wipe all saved cards and debts to start completely fresh"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Clean Slate</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-2 text-xs text-slate-600 hover:text-slate-800 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                >
                  Save Profile
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="space-y-4 text-xs">
            {/* Active Cards List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 block text-xs">
                  Your Credit Cards ({cards.length})
                </span>
                <span className="text-[11px] text-slate-500">
                  Total Limit: ${cards.reduce((sum, c) => sum + c.creditLimit, 0).toLocaleString()}
                </span>
              </div>

              {cards.length === 0 ? (
                <div className="p-6 bg-slate-50 rounded-lg border border-dashed border-slate-200 text-center">
                  <CreditCard className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="font-semibold text-slate-700">No credit cards added yet</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Use the form below to add your open credit cards and track Statement Closing Dates.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {cards.map((c) => (
                    <div
                      key={c.id}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between font-mono-numeric"
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900">{c.name}</span>
                          <span className="text-slate-500 font-sans text-[11px]">({c.bank})</span>
                        </div>
                        <span className="text-slate-600 text-[11px] block mt-0.5">
                          Balance: <strong>${c.balance.toLocaleString()}</strong> / Limit: ${c.creditLimit.toLocaleString()} · Statement Day: {c.statementClosingDay}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveCard(c.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer transition-colors"
                        title="Delete Card"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add New Card Form */}
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
              <span className="font-bold text-slate-900 block text-xs flex items-center gap-1">
                <Plus className="w-3.5 h-3.5 text-emerald-600" />
                <span>Add a Credit Card</span>
              </span>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Card Nickname</label>
                  <input
                    type="text"
                    placeholder="e.g. Sapphire Preferred"
                    value={newCardName}
                    onChange={(e) => setNewCardName(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-md px-2.5 py-1.5 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Issuing Bank</label>
                  <input
                    type="text"
                    placeholder="e.g. Chase / Amex / Discover"
                    value={newCardBank}
                    onChange={(e) => setNewCardBank(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-md px-2.5 py-1.5 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Current Balance ($)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={newCardBalance}
                    onChange={(e) => setNewCardBalance(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-md px-2.5 py-1.5 text-xs text-slate-900 font-mono-numeric"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Credit Limit ($)</label>
                  <input
                    type="number"
                    min="100"
                    placeholder="2500"
                    value={newCardLimit}
                    onChange={(e) => setNewCardLimit(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-md px-2.5 py-1.5 text-xs text-slate-900 font-mono-numeric"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Statement Close Day (1–31)</label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    placeholder="15"
                    value={newCardStatementDay}
                    onChange={(e) => setNewCardStatementDay(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-md px-2.5 py-1.5 text-xs text-slate-900 font-mono-numeric"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Payment Due Day (1–31)</label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    placeholder="10"
                    value={newCardDueDay}
                    onChange={(e) => setNewCardDueDay(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-md px-2.5 py-1.5 text-xs text-slate-900 font-mono-numeric"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={handleAddCard}
                  disabled={!newCardName.trim()}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors cursor-pointer"
                >
                  + Add Card to List
                </button>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                Done Managing Cards
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
