import React from 'react';
import { LegalModalTab } from './FooterLegalModal';
import { 
  Lock, 
  Scale, 
  HelpCircle, 
  MessageSquare, 
  Mail, 
  Zap, 
  ChevronRight,
} from 'lucide-react';

interface DownbaseFooterProps {
  onOpenLegal: (tab: LegalModalTab) => void;
  onNavigateTab?: (tabId: string) => void;
  showThreeBadges?: boolean;
}

export const DownbaseFooter: React.FC<DownbaseFooterProps> = ({
  onOpenLegal,
  showThreeBadges = true,
}) => {
  // Exact legal order requested:
  // 1. Privacy Policy, 2. Terms of use, 3. FAQ, 4. Feedback, 5. Contact us, 6. solutions
  const legalItems: { id: LegalModalTab; label: string; icon: React.ReactNode }[] = [
    { id: 'privacy', label: 'Privacy Policy', icon: <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> },
    { id: 'terms', label: 'Terms of use', icon: <Scale className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" /> },
    { id: 'faq', label: 'FAQ', icon: <HelpCircle className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> },
    { id: 'feedback', label: 'Feedback', icon: <MessageSquare className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" /> },
    { id: 'contact', label: 'Contact us', icon: <Mail className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" /> },
    { id: 'solutions', label: 'solutions', icon: <Zap className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> },
  ];

  return (
    <footer className="w-full pt-4 pb-8 border-t border-neutral-200 dark:border-neutral-800 text-center space-y-4 no-print select-none font-sans text-neutral-800 dark:text-neutral-200 transition-colors">
      
      {/* 1. TOP VERIFICATION BADGES: 3 SMALL PILLS WITH TEXT */}
      {showThreeBadges && (
        <div className="flex items-center justify-center gap-2.5 sm:gap-4 py-2 px-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl text-[11px] font-mono-numeric font-bold text-neutral-700 dark:text-neutral-300 shadow-xs flex-wrap transition-colors">
          <span className="flex items-center gap-1.5 hover:text-black dark:hover:text-white transition-colors">
            <span>🔒</span>
            <span>No SSN Needed</span>
          </span>
          <span className="text-neutral-400 dark:text-neutral-600 hidden sm:inline" aria-hidden="true">·</span>
          <span className="flex items-center gap-1.5 hover:text-black dark:hover:text-white transition-colors">
            <span>🚫</span>
            <span>No Bank Login</span>
          </span>
          <span className="text-neutral-400 dark:text-neutral-600 hidden sm:inline" aria-hidden="true">·</span>
          <span className="flex items-center gap-1.5 hover:text-black dark:hover:text-white transition-colors">
            <span>💯</span>
            <span>100% In-Browser Privacy</span>
          </span>
        </div>
      )}

      {/* 2. PRIVACY POLICY (PP) & CONSUMER PROTECTION CARD */}
      <div className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-3xl p-5 text-left space-y-2.5 shadow-xs transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Lock className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h4 className="text-xs font-black text-black dark:text-white tracking-tight flex items-center gap-1.5">
                <span>Privacy Policy (PP)</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono-numeric font-bold">
                  Verified In-Browser
                </span>
              </h4>
              <p className="text-[10px] text-neutral-500">
                100% LocalStorage Sovereignty · Zero Remote Tracking
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onOpenLegal('privacy')}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer active:scale-95 shadow-xs"
          >
            <span>Read PP</span>
            <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
          </button>
        </div>

        <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
          CHIDONIQ processes all credit estimations, budget math, and dispute letters directly inside your browser on this device. No personal data, Social Security Numbers, or bank credentials are ever collected, transmitted, or sold.
        </p>
      </div>

      {/* 3. LEGAL & SUPPORT DIRECTORY */}
      <div className="space-y-1.5 pt-1">
        <div className="flex flex-wrap items-center justify-center gap-x-3.5 gap-y-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300 font-mono-numeric">
          {legalItems.map((item, idx) => (
            <React.Fragment key={item.id}>
              <button
                type="button"
                onClick={() => onOpenLegal(item.id)}
                className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-all cursor-pointer py-1 flex items-center gap-1.5 active:scale-95 group"
              >
                <span className="group-hover:scale-110 transition-transform">
                  {item.icon}
                </span>
                <span className={item.id === 'privacy' ? 'font-black text-emerald-600 dark:text-emerald-400 underline underline-offset-2' : item.id === 'solutions' ? 'font-black text-emerald-600 dark:text-emerald-400' : 'text-neutral-700 dark:text-neutral-300 group-hover:text-black dark:group-hover:text-white'}>
                  {item.label}
                </span>
              </button>
              {idx < legalItems.length - 1 && (
                <span className="text-neutral-300 dark:text-neutral-700" aria-hidden="true">·</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* 4. STATUTORY COMPLIANCE NOTICE */}
      <div className="px-2 pt-1 text-[10px] text-neutral-500 leading-normal space-y-1 max-w-lg mx-auto">
        <p>
          <strong className="text-neutral-700 dark:text-neutral-300">Regulatory &amp; Trademark Disclosures:</strong> CHIDONIQ is an independent educational and personal financial planning software tool. CHIDONIQ is not a Credit Repair Organization (CROA, 15 U.S.C. § 1679) and does not provide legal or financial counseling. Experian®, TransUnion®, Equifax®, and FICO® are registered trademarks of their respective owners; their reference does not imply endorsement or affiliation.
        </p>
      </div>

      {/* 5. LOCALSTORAGE SOVEREIGNTY & COPYRIGHT */}
      <div className="space-y-0.5 text-[10px] text-neutral-500 font-mono-numeric pt-1">
        <div>CHIDONIQ Sovereign Financial Utility · In-Browser LocalStorage</div>
        <div className="text-[9px] text-neutral-400 font-medium">
          Support: <a href="mailto:pinperfectapp@gmail.com" className="hover:underline text-neutral-600 dark:text-neutral-300">pinperfectapp@gmail.com</a> · CHIDONIQ © 2026
        </div>
      </div>
    </footer>
  );
};
