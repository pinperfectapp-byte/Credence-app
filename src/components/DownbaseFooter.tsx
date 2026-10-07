import React from 'react';
import { LegalModalTab } from './FooterLegalModal';
import { 
  Lock, 
  Scale, 
  HelpCircle, 
  MessageSquare, 
  Mail, 
  Zap,
  ShieldCheck
} from 'lucide-react';

interface DownbaseFooterProps {
  onOpenLegal: (tab: LegalModalTab) => void;
  onNavigateTab?: (tabId: string) => void;
  showThreeBadges?: boolean;
}

export const DownbaseFooter: React.FC<DownbaseFooterProps> = ({
  onOpenLegal,
  onNavigateTab,
  showThreeBadges = true,
}) => {
  // Exact order requested:
  // 1. Privacy Policy, 2. Terms of use, 3. FAQ, 4. Feedback, 5. Contact us, 6. solutions
  const footerItems: { id: LegalModalTab; label: string; icon: React.ReactNode }[] = [
    { id: 'privacy', label: 'Privacy Policy', icon: <Lock className="w-3.5 h-3.5 text-emerald-500" /> },
    { id: 'terms', label: 'Terms of use', icon: <Scale className="w-3.5 h-3.5 text-slate-400" /> },
    { id: 'faq', label: 'FAQ', icon: <HelpCircle className="w-3.5 h-3.5 text-sky-400" /> },
    { id: 'feedback', label: 'Feedback', icon: <MessageSquare className="w-3.5 h-3.5 text-amber-400" /> },
    { id: 'contact', label: 'Contact us', icon: <Mail className="w-3.5 h-3.5 text-indigo-400" /> },
    { id: 'solutions', label: 'solutions', icon: <Zap className="w-3.5 h-3.5 text-emerald-400" /> },
  ];

  return (
    <footer className="w-full pt-4 pb-6 border-t border-slate-200 dark:border-slate-800 text-center space-y-3.5 no-print select-none">
      {/* AT BOTTOM OF FIRST SCREEN / DOWNBASE: 3 SMALL ICONS WITH TEXT */}
      {showThreeBadges && (
        <div className="flex items-center justify-center gap-3 sm:gap-4 py-2 px-3 bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl text-[11px] font-mono-numeric font-bold text-slate-600 dark:text-slate-300">
          <span className="flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white transition-colors">
            <span>🔒</span>
            <span>No SSN Needed</span>
          </span>
          <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">·</span>
          <span className="flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white transition-colors">
            <span>🚫</span>
            <span>No Bank Login</span>
          </span>
          <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">·</span>
          <span className="flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white transition-colors">
            <span>💯</span>
            <span>100% Private</span>
          </span>
        </div>
      )}

      {/* Downbase Footer Features Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono-numeric uppercase font-extrabold tracking-wider text-slate-400 dark:text-slate-500">
          <ShieldCheck className="w-3 h-3 text-emerald-500" />
          <span>Downbase Footer Features</span>
        </div>

        {/* 6 Downbase Links in Exact Requested Order */}
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 font-mono-numeric">
          {footerItems.map((item, idx) => (
            <React.Fragment key={item.id}>
              <button
                type="button"
                onClick={() => onOpenLegal(item.id)}
                className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors cursor-pointer py-1 flex items-center gap-1"
              >
                {item.icon}
                <span className={item.id === 'solutions' ? 'font-black text-emerald-600 dark:text-emerald-400' : ''}>
                  {item.label}
                </span>
              </button>
              {idx < footerItems.length - 1 && (
                <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">·</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="text-[10px] text-slate-400 font-mono-numeric">
        Credence Sovereign Financial Utility · In-Browser LocalStorage
      </div>
    </footer>
  );
};
