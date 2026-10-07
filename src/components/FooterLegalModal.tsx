import React, { useState } from 'react';
import { CredenceLogo } from './CredenceLogo';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  FileText, 
  Scale, 
  CheckCircle2, 
  Printer, 
  HelpCircle, 
  MessageSquare, 
  Mail, 
  Zap,
  Star,
  DollarSign,
  TrendingUp,
  Calendar,
  Send,
  ShoppingCart
} from 'lucide-react';

export type LegalModalTab = 'privacy' | 'terms' | 'faq' | 'feedback' | 'contact' | 'solutions';

interface FooterLegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: LegalModalTab;
  onNavigateTab?: (tabId: string) => void;
}

export const FooterLegalModal: React.FC<FooterLegalModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'privacy',
  onNavigateTab,
}) => {
  const [activeTab, setActiveTab] = useState<LegalModalTab>(initialTab);

  // Interactive feedback state
  const [rating, setRating] = useState<number>(5);
  const [feedbackCategory, setFeedbackCategory] = useState<string>('Success Story');
  const [feedbackText, setFeedbackText] = useState<string>('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<boolean>(false);

  // Sync activeTab when initialTab changes
  React.useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    try {
      const existing = JSON.parse(localStorage.getItem('credence_user_feedback_v1') || '[]');
      const newFeedback = {
        id: `fb-${Date.now()}`,
        rating,
        category: feedbackCategory,
        text: feedbackText.trim(),
        date: new Date().toISOString(),
      };
      localStorage.setItem('credence_user_feedback_v1', JSON.stringify([newFeedback, ...existing]));
    } catch {
      // Storage unavailable
    }

    setFeedbackSubmitted(true);
  };

  const navOrder: { id: LegalModalTab; label: string; icon: React.ReactNode }[] = [
    { id: 'privacy', label: 'Privacy Policy', icon: <Lock className="w-3.5 h-3.5" /> },
    { id: 'terms', label: 'Terms of use', icon: <Scale className="w-3.5 h-3.5" /> },
    { id: 'faq', label: 'FAQ', icon: <HelpCircle className="w-3.5 h-3.5" /> },
    { id: 'feedback', label: 'Feedback', icon: <MessageSquare className="w-3.5 h-3.5" /> },
    { id: 'contact', label: 'Contact us', icon: <Mail className="w-3.5 h-3.5" /> },
    { id: 'solutions', label: 'solutions', icon: <Zap className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn select-none">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[90vh]">
        
        {/* Header Bar */}
        <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-2">
            <CredenceLogo size={28} animated={false} />
            <div>
              <span className="font-black text-slate-900 dark:text-white text-sm tracking-tight block">
                Credence Downbase
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono-numeric">
                Downbase Footer Features
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handlePrint}
              className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 rounded-lg transition-colors cursor-pointer"
              title="Print document"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 rounded-lg transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation in EXACT requested order: Privacy Policy, Terms of use, FAQ, Feedback, Contact us, solutions */}
        <div className="flex overflow-x-auto border-b border-slate-200 dark:border-slate-800 px-3 bg-slate-50/50 dark:bg-slate-900/50 text-xs shrink-0 scrollbar-none font-mono-numeric">
          {navOrder.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setFeedbackSubmitted(false);
                }}
                className={`py-2.5 px-3 border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 font-bold ${
                  isActive
                    ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 font-black'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Body Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs flex-1">
          
          {/* TAB 1: Privacy Policy */}
          {activeTab === 'privacy' && (
            <div className="space-y-3 animate-fadeIn">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <Lock className="w-4 h-4" />
                <h3 className="font-extrabold text-sm uppercase tracking-wide">
                  Simple Privacy Policy
                </h3>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-1">
                <span className="font-black text-emerald-700 dark:text-emerald-300 block text-xs">
                  Zero SSN · Zero Bank Logins · 100% In-Browser Privacy
                </span>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">
                  Credence executes all algorithms directly inside your device browser using LocalStorage. No credit data is transmitted to external cloud databases.
                </p>
              </div>

              <div className="space-y-2">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="font-bold text-slate-900 dark:text-white block text-xs">
                    1. No Identity Verification Tracking
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    We never ask for your Social Security Number, date of birth, or online banking credentials.
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="font-bold text-slate-900 dark:text-white block text-xs">
                    2. Complete Data Deletion Rights
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    You can purge your entire credit file instantly anytime via Settings &gt; Reset Data.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Terms of use */}
          {activeTab === 'terms' && (
            <div className="space-y-3 animate-fadeIn">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <Scale className="w-4 h-4" />
                <h3 className="font-extrabold text-sm uppercase tracking-wide">
                  Terms of Use
                </h3>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="font-bold text-slate-900 dark:text-white block text-xs">
                  Sovereign Consumer Self-Advocacy Utility
                </span>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">
                  Credence provides mathematical estimation models and FCRA document templates for direct consumer self-advocacy.
                </p>
              </div>

              <div className="space-y-2 text-[11px] text-slate-600 dark:text-slate-300">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="font-bold text-slate-900 dark:text-white block text-xs">
                    Statutory Federal Grounding
                  </span>
                  <p className="text-slate-500 dark:text-slate-400">
                    All dispute frameworks are modeled under the Fair Credit Reporting Act (15 U.S.C. § 1681) and Fair Debt Collection Practices Act (15 U.S.C. § 1692).
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="font-bold text-slate-900 dark:text-white block text-xs">
                    Direct Self-Representation
                  </span>
                  <p className="text-slate-500 dark:text-slate-400">
                    You represent yourself directly before credit bureaus. Credence does not act as a credit repair organization charging recurring monthly fees.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FAQ */}
          {activeTab === 'faq' && (
            <div className="space-y-3 animate-fadeIn">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <HelpCircle className="w-4 h-4" />
                <h3 className="font-extrabold text-sm uppercase tracking-wide">
                  Frequently Asked Questions
                </h3>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="font-bold text-slate-900 dark:text-white block text-xs">
                    Q: How does the Compare Engine save me money?
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    It calculates the exact math between your 29% APR debt and lower APR balance cards (10–19%), calculating annual cash savings live on balance slider adjustments.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="font-bold text-slate-900 dark:text-white block text-xs">
                    Q: What is the AZEO method?
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    All-Zero-Except-One: credit bureaus take snapshots on the Statement Closing Date, not the due date. Paying before statement close drops utilization to &lt; 3%, unlocking +20 to +45 points.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="font-bold text-slate-900 dark:text-white block text-xs">
                    Q: How do FCRA § 609 disputes force removals?
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Under 15 U.S.C. § 1681i, bureaus have 30 statutory days to verify disputed accounts with the original creditor. If unverified, they are legally required to delete it.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="font-bold text-slate-900 dark:text-white block text-xs">
                    Q: How do I export my credit summary report?
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Tap &quot;Export Report&quot; on the dashboard or &quot;Export Credit Profile Dossier&quot; in Tools to download a clean, official PDF dossier.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Feedback (Interactive working form!) */}
          {activeTab === 'feedback' && (
            <div className="space-y-3 animate-fadeIn">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <MessageSquare className="w-4 h-4" />
                <h3 className="font-extrabold text-sm uppercase tracking-wide">
                  Submit In-App Feedback
                </h3>
              </div>

              {feedbackSubmitted ? (
                <div className="p-6 text-center space-y-2 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-300 dark:border-emerald-800">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                  <h4 className="font-black text-sm text-slate-900 dark:text-white">
                    Feedback Received!
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Thank you for helping us improve Credence. Your rating and remarks have been recorded locally.
                  </p>
                  <button
                    onClick={() => {
                      setFeedbackSubmitted(false);
                      setFeedbackText('');
                    }}
                    className="mt-2 px-4 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white font-bold text-xs"
                  >
                    Submit Another Note
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFeedbackSubmit} className="space-y-3">
                  {/* Rating Stars */}
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1 font-mono-numeric">
                      Rating
                    </label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1 cursor-pointer transition-transform hover:scale-110"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-300 dark:text-slate-700'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs font-mono-numeric font-bold text-slate-500 ml-2">
                        {rating} / 5 Stars
                      </span>
                    </div>
                  </div>

                  {/* Feedback Category */}
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1 font-mono-numeric">
                      Category
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {['Success Story', 'Feature Idea', 'Improvement'].map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setFeedbackCategory(cat)}
                          className={`py-1.5 px-2 rounded-xl border text-[11px] font-mono-numeric font-bold cursor-pointer transition-all ${
                            feedbackCategory === cat
                              ? 'bg-emerald-500 text-slate-950 border-emerald-500 shadow-xs'
                              : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comments */}
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1 font-mono-numeric">
                      Your Comments &amp; Results
                    </label>
                    <textarea
                      rows={3}
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      required
                      placeholder="Share your score surge, interest savings, or suggestions..."
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500 font-sans"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl font-black text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Submit Feedback</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 5: Contact us */}
          {activeTab === 'contact' && (
            <div className="space-y-3 animate-fadeIn">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <Mail className="w-4 h-4" />
                <h3 className="font-extrabold text-sm uppercase tracking-wide">
                  Contact Us
                </h3>
              </div>

              <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-mono-numeric">
                  Developer &amp; Support Contact
                </span>
                <div className="flex items-center gap-2 font-mono-numeric font-bold text-slate-900 dark:text-white text-xs">
                  <Mail className="w-4 h-4 text-emerald-500" />
                  <span>pinperfectapp@gmail.com</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Questions regarding mathematical formulas, dispute letter generator syntax, or client-side storage? Send an email for rapid support.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                <span className="font-bold text-slate-900 dark:text-white block text-xs">
                  Official Consumer Hotlines &amp; Agency Portals:
                </span>
                <p>• CFPB (Consumer Financial Protection Bureau): <strong>consumerfinance.gov</strong></p>
                <p>• FTC Consumer Response Center: <strong>reportfraud.ftc.gov</strong></p>
                <p>• Free Annual Credit Reports: <strong>annualcreditreport.com</strong></p>
              </div>
            </div>
          )}

          {/* TAB 6: solutions */}
          {activeTab === 'solutions' && (
            <div className="space-y-3 animate-fadeIn">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <Zap className="w-4 h-4" />
                <h3 className="font-extrabold text-sm uppercase tracking-wide">
                  The 4 Credit Problem Solutions
                </h3>
              </div>

              <div className="space-y-2">
                {/* Solution 1 */}
                <div
                  onClick={() => {
                    onClose();
                    onNavigateTab && onNavigateTab('compare');
                  }}
                  className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition-colors cursor-pointer flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase font-mono-numeric">
                      Solution 1 · Interest Cutter
                    </span>
                    <h4 className="font-black text-slate-900 dark:text-white text-xs">
                      Compare Cards Math Engine
                    </h4>
                    <span className="text-[10px] text-slate-500 block">
                      Save $200–$384+/yr dropping 29% APR to 10–19%
                    </span>
                  </div>
                  <DollarSign className="w-4 h-4 text-emerald-500" />
                </div>

                {/* Solution 2 */}
                <div
                  onClick={() => {
                    onClose();
                    onNavigateTab && onNavigateTab('statement_optimizer');
                  }}
                  className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition-colors cursor-pointer flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 uppercase font-mono-numeric">
                      Solution 2 · Utilization Fix
                    </span>
                    <h4 className="font-black text-slate-900 dark:text-white text-xs">
                      AZEO Statement Closing Trick
                    </h4>
                    <span className="text-[10px] text-slate-500 block">
                      Report &lt; 3% utilization for instant +20 to +45 score surge
                    </span>
                  </div>
                  <Calendar className="w-4 h-4 text-sky-500" />
                </div>

                {/* Solution 3 */}
                <div
                  onClick={() => {
                    onClose();
                    onNavigateTab && onNavigateTab('dispute_hub');
                  }}
                  className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition-colors cursor-pointer flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase font-mono-numeric">
                      Solution 3 · Negative Marks
                    </span>
                    <h4 className="font-black text-slate-900 dark:text-white text-xs">
                      FCRA § 609 Legal Dispute Hub
                    </h4>
                    <span className="text-[10px] text-slate-500 block">
                      Enforces 30-day statutory clocks for mandatory deletions (+48 pts)
                    </span>
                  </div>
                  <Scale className="w-4 h-4 text-rose-500" />
                </div>

                {/* Solution 4 */}
                <div
                  onClick={() => {
                    onClose();
                    onNavigateTab && onNavigateTab('track');
                  }}
                  className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition-colors cursor-pointer flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase font-mono-numeric">
                      Solution 4 · Score Tracking
                    </span>
                    <h4 className="font-black text-slate-900 dark:text-white text-xs">
                      FICO® Progression Line Curve
                    </h4>
                    <span className="text-[10px] text-slate-500 block">
                      Goal 750 Prime Line, points gained, monthly pace
                    </span>
                  </div>
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                </div>

                {/* Solution 5: Grocery Card Saver */}
                <div
                  onClick={() => {
                    onClose();
                    onNavigateTab && onNavigateTab('grocery_saver');
                  }}
                  className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition-colors cursor-pointer flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-[#00C853] uppercase font-mono-numeric">
                      Solution 5 · Grocery Cashback
                    </span>
                    <h4 className="font-black text-slate-900 dark:text-white text-xs">
                      Grocery Card Saver (Pure Math)
                    </h4>
                    <span className="text-[10px] text-slate-500 block">
                      Calculate top cards for US Supermarkets (Save $193–$240/yr)
                    </span>
                  </div>
                  <ShoppingCart className="w-4 h-4 text-[#00C853]" />
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer with the 3 Privacy Badges */}
        <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2 text-[10px] font-mono-numeric font-bold text-slate-500 dark:text-slate-400">
            <span>🔒 No SSN Needed</span>
            <span>·</span>
            <span>🚫 No Bank Login</span>
            <span>·</span>
            <span>💯 100% Private</span>
          </div>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-1.5 rounded-xl font-bold text-xs bg-slate-900 dark:bg-slate-800 text-white cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
