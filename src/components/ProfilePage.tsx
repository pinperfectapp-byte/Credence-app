import React, { useState } from 'react';
import { CreditProfile, CreditCardAccount } from '../types/credit';
import { 
  User, 
  CreditCard, 
  Shield, 
  Plus, 
  Trash2, 
  Save, 
  Download, 
  RotateCcw, 
  Check, 
  AlertCircle,
  DollarSign,
  Calendar,
  Building2,
  Database,
  RefreshCw,
  LogOut,
  KeyRound,
  CheckCircle2
} from 'lucide-react';
import { useSupabaseAuth } from '../context/SupabaseAuthContext';

interface ProfilePageProps {
  profile: CreditProfile;
  onUpdateProfile: (updated: CreditProfile) => void;
  onResetToBlank: () => void;
  onOpenAuthModal?: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  profile,
  onUpdateProfile,
  onResetToBlank,
  onOpenAuthModal,
}) => {
  // Personal Details
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [address, setAddress] = useState(profile.address);
  const [cityStateZip, setCityStateZip] = useState(profile.cityStateZip);
  const [ssnLast4, setSsnLast4] = useState(profile.ssnLast4);

  // Credit Metrics
  const [baseScore, setBaseScore] = useState<number | ''>(profile.baseScore === 0 ? '' : profile.baseScore);
  const [creditAgeYears, setCreditAgeYears] = useState(profile.creditAgeYears);
  const [totalInquiries, setTotalInquiries] = useState(profile.totalInquiries);
  const [hasInstallmentLoan, setHasInstallmentLoan] = useState(profile.hasInstallmentLoan);
  const [annualIncome, setAnnualIncome] = useState(profile.annualIncome);

  // Cards List
  const [cards, setCards] = useState<CreditCardAccount[]>(profile.cards);

  // New Card Form
  const [showAddCard, setShowAddCard] = useState(false);
  const [newCardBank, setNewCardBank] = useState('');
  const [newCardName, setNewCardName] = useState('');
  const [newCardBalance, setNewCardBalance] = useState('');
  const [newCardLimit, setNewCardLimit] = useState('');
  const [newCardStatementDay, setNewCardStatementDay] = useState('14');
  const [newCardDueDay, setNewCardDueDay] = useState('9');
  const [newCardApr, setNewCardApr] = useState('24.99');

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Supabase Auth & Cloud Sync
  const { 
    user, 
    lastSyncTime, 
    isSyncing, 
    syncToCloud, 
    restoreFromCloud, 
    isConfigured 
  } = useSupabaseAuth();
  const [cloudMsg, setCloudMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleProfileSync = async () => {
    const res = await syncToCloud(profile);
    setCloudMsg({ type: res.success ? 'success' : 'error', text: res.message });
    setTimeout(() => setCloudMsg(null), 4500);
  };

  const handleProfileRestore = async () => {
    const res = await restoreFromCloud();
    if (res.profile) {
      onUpdateProfile(res.profile);
      setName(res.profile.name);
      setEmail(res.profile.email);
      setAddress(res.profile.address);
      setCityStateZip(res.profile.cityStateZip);
      setSsnLast4(res.profile.ssnLast4);
      setBaseScore(res.profile.baseScore);
      setCreditAgeYears(res.profile.creditAgeYears);
      setTotalInquiries(res.profile.totalInquiries);
      setCards(res.profile.cards);
    }
    setCloudMsg({ type: res.profile ? 'success' : 'error', text: res.message });
    setTimeout(() => setCloudMsg(null), 4500);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedScore = typeof baseScore === 'number' && baseScore > 0 
      ? Math.min(850, Math.max(300, baseScore)) 
      : 680;

    const updated: CreditProfile = {
      ...profile,
      name: name.trim() || 'My Credit Profile',
      email: email.trim(),
      address: address.trim(),
      cityStateZip: cityStateZip.trim(),
      ssnLast4: ssnLast4.trim(),
      baseScore: parsedScore,
      bureaus: {
        experian: parsedScore,
        transUnion: parsedScore,
        equifax: parsedScore,
      },
      creditAgeYears: Math.max(0, creditAgeYears),
      totalInquiries: Math.max(0, totalInquiries),
      hasInstallmentLoan,
      annualIncome: Math.max(0, annualIncome),
      cards,
    };

    onUpdateProfile(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardName.trim()) return;

    const balanceNum = Math.max(0, parseFloat(newCardBalance) || 0);
    const limitNum = Math.max(100, parseFloat(newCardLimit) || 1000);

    const newCard: CreditCardAccount = {
      id: `card_${Date.now()}`,
      bank: newCardBank.trim() || 'Major Bank',
      name: newCardName.trim(),
      balance: balanceNum,
      creditLimit: limitNum,
      statementClosingDay: Math.min(31, Math.max(1, parseInt(newCardStatementDay) || 15)),
      paymentDueDay: Math.min(31, Math.max(1, parseInt(newCardDueDay) || 10)),
      apr: Math.max(0, parseFloat(newCardApr) || 24.99),
      isPaidForStatement: false,
    };

    const updatedCards = [...cards, newCard];
    setCards(updatedCards);
    setNewCardBank('');
    setNewCardName('');
    setNewCardBalance('');
    setNewCardLimit('');
    setShowAddCard(false);
  };

  const handleRemoveCard = (cardId: string) => {
    setCards(cards.filter((c) => c.id !== cardId));
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(profile, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `chidoniq_profile_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-8 pb-8 max-w-4xl mx-auto">
      {/* 1. Header Banner */}
      <div className="bg-white dark:bg-neutral-900 text-black dark:text-white rounded-2xl p-6 shadow-xs border border-neutral-200 dark:border-neutral-800 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Personal Consumer Credit Profile</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-black dark:text-white tracking-tight">
              Profile &amp; Tradelines Manager
            </h1>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
              Configure your credit standing, scores, and active revolving card lines. Data is stored solely in your local browser storage.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJSON}
              className="px-3 py-1.5 text-xs font-semibold text-neutral-800 dark:text-neutral-200 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-xl border border-neutral-200 dark:border-neutral-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Export JSON</span>
            </button>
          </div>
        </div>
      </div>

      {/* Encrypted Vault Synchronization Banner */}
      <div className="bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-xs space-y-3 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center shadow-xs">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-black dark:text-white">
                  Encrypted Vault Synchronization
                </h3>
                {user ? (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 px-2 py-0.5 rounded-full font-semibold">
                    Vault Connected
                  </span>
                ) : (
                  <span className="text-[10px] bg-neutral-200 text-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-700 px-2 py-0.5 rounded-full font-semibold">
                    Local Device Storage
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
                {user 
                  ? `Signed in as ${user.email} • Encrypted backup active` 
                  : 'Sync your cards, budget envelopes, and debt goals with 256-bit encrypted authentication.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <button
                  type="button"
                  onClick={handleProfileSync}
                  disabled={isSyncing}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-black dark:bg-white dark:text-black hover:opacity-90 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{isSyncing ? 'Syncing...' : 'Sync to Vault'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleProfileRestore}
                  disabled={isSyncing}
                  className="px-3 py-1.5 text-xs font-semibold text-black dark:text-white bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Database className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>Restore</span>
                </button>
                {onOpenAuthModal && (
                  <button
                    type="button"
                    onClick={onOpenAuthModal}
                    className="px-2.5 py-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl transition-colors cursor-pointer"
                  >
                    Manage
                  </button>
                )}
              </>
            ) : (
              onOpenAuthModal && (
                <button
                  type="button"
                  onClick={onOpenAuthModal}
                  className="px-3.5 py-2 text-xs font-bold text-white bg-black dark:bg-white dark:text-black hover:opacity-90 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Sign In / Create Account</span>
                </button>
              )
            )}
          </div>
        </div>

        {cloudMsg && (
          <div className={`p-2.5 rounded-lg text-xs flex items-center gap-2 ${
            cloudMsg.type === 'success' 
              ? 'bg-emerald-50 border border-emerald-300 text-emerald-800 dark:bg-emerald-950/60 dark:border-emerald-500/40 dark:text-emerald-200' 
              : 'bg-rose-50 border border-rose-300 text-rose-800 dark:bg-rose-950/60 dark:border-rose-500/40 dark:text-rose-200'
          }`}>
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{cloudMsg.text}</span>
          </div>
        )}
      </div>

      {/* 2. Main Form */}
      <form onSubmit={handleSaveProfile} className="space-y-8">
        {/* Section A: Personal Consumer Details */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Personal Information (Used for Formal 609 Letters)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Full Legal Name
              </label>
              <input
                type="text"
                placeholder="e.g. Johnathan Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Email Address (Optional)
              </label>
              <input
                type="email"
                placeholder="e.g. john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Street Address
              </label>
              <input
                type="text"
                placeholder="e.g. 123 Main Street, Apt 4B"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                City, State &amp; Zip
              </label>
              <input
                type="text"
                placeholder="e.g. Austin, TX 78701"
                value={cityStateZip}
                onChange={(e) => setCityStateZip(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                SSN (Last 4 Digits Only)
              </label>
              <input
                type="text"
                maxLength={4}
                placeholder="e.g. 1234"
                value={ssnLast4}
                onChange={(e) => setSsnLast4(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white font-mono-numeric focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:border-emerald-500"
              />
            </div>
          </div>
        </section>

        {/* Section B: Credit Scores & Metric Disclosures */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Credit Score &amp; File Factors
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Credit Score (300–850)
              </label>
              <input
                type="number"
                min="300"
                max="850"
                placeholder="e.g. 680"
                value={baseScore}
                onChange={(e) => setBaseScore(e.target.value === '' ? '' : parseInt(e.target.value) || 300)}
                className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white font-mono-numeric font-bold focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Average Credit Age (Years)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={creditAgeYears}
                onChange={(e) => setCreditAgeYears(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white font-mono-numeric focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Hard Inquiries (Past 24 Mo)
              </label>
              <input
                type="number"
                min="0"
                value={totalInquiries}
                onChange={(e) => setTotalInquiries(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white font-mono-numeric focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Estimated Annual Income ($)
              </label>
              <input
                type="number"
                min="0"
                step="1000"
                value={annualIncome}
                onChange={(e) => setAnnualIncome(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white font-mono-numeric focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            <div className="sm:col-span-2 flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={hasInstallmentLoan}
                  onChange={(e) => setHasInstallmentLoan(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded-sm focus:ring-emerald-500"
                />
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Has Open Installment Loan (Auto Loan, Mortgage, or Student Loan for Credit Mix)
                </span>
              </label>
            </div>
          </div>
        </section>

        {/* Section C: Credit Cards & Tradelines */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Active Credit Card Lines ({cards.length})
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Used by the Statement Date Optimizer and Debt Payoff engine.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowAddCard(!showAddCard)}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer border border-slate-700"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Credit Card</span>
            </button>
          </div>

          {/* Add Card Form */}
          {showAddCard && (
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
              <span className="font-bold text-slate-900 dark:text-white block">
                Add New Credit Card Tradeline
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Issuing Bank
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. National Bank / Premier Card"
                    value={newCardBank}
                    onChange={(e) => setNewCardBank(e.target.value)}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md px-2.5 py-1.5 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Card Product Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Freedom Unlimited"
                    value={newCardName}
                    onChange={(e) => setNewCardName(e.target.value)}
                    required
                    className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md px-2.5 py-1.5 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Current Balance ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={newCardBalance}
                    onChange={(e) => setNewCardBalance(e.target.value)}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md px-2.5 py-1.5 text-slate-900 dark:text-white font-mono-numeric"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Credit Limit ($)
                  </label>
                  <input
                    type="number"
                    min="100"
                    placeholder="2500"
                    value={newCardLimit}
                    onChange={(e) => setNewCardLimit(e.target.value)}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md px-2.5 py-1.5 text-slate-900 dark:text-white font-mono-numeric"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Statement Day (1–31)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={newCardStatementDay}
                    onChange={(e) => setNewCardStatementDay(e.target.value)}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md px-2.5 py-1.5 text-slate-900 dark:text-white font-mono-numeric"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Payment Due Day (1–31)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={newCardDueDay}
                    onChange={(e) => setNewCardDueDay(e.target.value)}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md px-2.5 py-1.5 text-slate-900 dark:text-white font-mono-numeric"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCard(false)}
                  className="px-3 py-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddCard}
                  className="px-4 py-1.5 font-semibold text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 rounded-md cursor-pointer"
                >
                  Add Card
                </button>
              </div>
            </div>
          )}

          {/* Cards Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-2.5 px-3">Bank &amp; Card</th>
                  <th className="py-2.5 px-3 text-right">Balance</th>
                  <th className="py-2.5 px-3 text-right">Limit</th>
                  <th className="py-2.5 px-3 text-right">Util %</th>
                  <th className="py-2.5 px-3 text-right">Stmt Day</th>
                  <th className="py-2.5 px-3 text-right">Due Day</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono-numeric">
                {cards.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400 font-sans">
                      No credit cards added yet. Click &quot;Add Credit Card&quot; to begin optimizing.
                    </td>
                  </tr>
                ) : (
                  cards.map((c) => {
                    const util = Math.round((c.balance / c.creditLimit) * 100);
                    return (
                      <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="py-3 px-3 font-sans">
                          <span className="font-bold text-slate-900 dark:text-white block">{c.name}</span>
                          <span className="text-[11px] text-slate-400">{c.bank}</span>
                        </td>
                        <td className="py-3 px-3 text-right font-bold text-slate-900 dark:text-white">
                          ${c.balance.toLocaleString()}
                        </td>
                        <td className="py-3 px-3 text-right text-slate-600 dark:text-slate-400">
                          ${c.creditLimit.toLocaleString()}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <span className={`font-semibold ${util > 30 ? 'text-amber-500' : 'text-emerald-500'}`}>
                            {util}%
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right text-slate-600 dark:text-slate-400">
                          Day {c.statementClosingDay}
                        </td>
                        <td className="py-3 px-3 text-right text-slate-600 dark:text-slate-400">
                          Day {c.paymentDueDay}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleRemoveCard(c.id)}
                            className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer transition-colors"
                            title="Remove card"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Action Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div>
            {showResetConfirm ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-rose-600 dark:text-rose-400 font-semibold">
                  Confirm reset all data to blank?
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onResetToBlank();
                    setShowResetConfirm(false);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-md cursor-pointer"
                >
                  Yes, Reset
                </button>
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  className="px-2 py-1.5 text-xs text-slate-500 hover:text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className="text-xs text-slate-400 hover:text-rose-600 flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Blank File</span>
              </button>
            )}
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all shadow-md hover:shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer"
          >
            {savedSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{savedSuccess ? 'Profile Saved Successfully!' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
