import React from 'react';
import { CreditProfile } from '../types/credit';
import { 
  User, 
  Settings, 
  ArrowLeft,
  PieChart,
  ShieldCheck,
  Eye,
  EyeOff,
  Sun,
  Moon,
  KeyRound,
  Shield,
  Share2,
  Check
} from 'lucide-react';
import { ChidoniqLogo } from './ChidoniqLogo';

interface HeaderProps {
  currentTab: string;
  onSelectTab: (tabId: string) => void;
  onGoBack?: () => void;
  activeProfile: CreditProfile;
  privacyMode?: boolean;
  onTogglePrivacyMode?: () => void;
  onOpenSettings?: () => void;
  onOpenProfile?: () => void;
  onOpenAuth?: () => void;
  canGoBack?: boolean;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onGoBack,
  activeProfile,
  privacyMode = false,
  onTogglePrivacyMode,
  onOpenSettings,
  onOpenProfile,
  onOpenAuth,
  canGoBack = false,
  theme = 'dark',
  onToggleTheme,
}) => {
  const isDark = theme === 'dark';
  const [copiedShare, setCopiedShare] = React.useState(false);

  const handleShare = async () => {
    const shareData = {
      title: 'CHIDONIQ - Free Credit Score & Budget Tracker USA',
      text: 'Track your 742 credit score, $1,250 money left, bills, debt payoff, and subscriptions 100% privately with zero SSN on CHIDONIQ!',
      url: 'https://chidoniq.com.ng',
    };
    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText('https://chidoniq.com.ng');
        setCopiedShare(true);
        setTimeout(() => setCopiedShare(false), 2500);
      }
    } catch {
      try {
        await navigator.clipboard.writeText('https://chidoniq.com.ng');
        setCopiedShare(true);
        setTimeout(() => setCopiedShare(false), 2500);
      } catch {}
    }
  };

  // Screen 2: Budget Tracker header
  if (currentTab === 'budget') {
    return (
      <header className="h-14 bg-white text-black dark:bg-black dark:text-white px-4 flex items-center justify-between shrink-0 no-print select-none border-b border-neutral-200 dark:border-neutral-800 transition-colors">
        <button
          type="button"
          onClick={onGoBack || (() => onSelectTab('dashboard'))}
          className="p-1.5 -ml-1 rounded-xl text-black hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-900 transition-colors cursor-pointer flex items-center justify-center"
          title="Back"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
        </button>

        <h1 className="text-base font-bold text-black dark:text-white tracking-tight">
          Budget Tracker
        </h1>

        <div className="flex items-center gap-1.5 -mr-1">
          {onToggleTheme && (
            <button
              type="button"
              onClick={onToggleTheme}
              className="p-1.5 rounded-xl text-neutral-600 hover:text-black hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-neutral-900 transition-colors cursor-pointer"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-neutral-700" />}
            </button>
          )}
          <button
            type="button"
            onClick={() => onSelectTab('budget')}
            className="p-1.5 rounded-xl text-black hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-900 transition-colors cursor-pointer flex items-center justify-center"
            title="Budget Charts & Categories"
            aria-label="Budget Charts"
          >
            <PieChart className="w-5 h-5" />
          </button>
        </div>
      </header>
    );
  }

  // Screen 3: All-in-One header
  if (currentTab === 'menu' || currentTab === 'more' || currentTab === 'tools') {
    return (
      <header className="pt-3 pb-2 px-4 bg-white text-black dark:bg-black dark:text-white flex items-center justify-between shrink-0 no-print select-none border-b border-neutral-200 dark:border-neutral-800 transition-colors">
        <div className="w-8">
          {onToggleTheme && (
            <button
              type="button"
              onClick={onToggleTheme}
              className="p-1.5 rounded-xl text-neutral-600 hover:text-black hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-neutral-900 transition-colors cursor-pointer"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-neutral-700" />}
            </button>
          )}
        </div>

        <div className="text-center">
          <h1 className="text-lg font-bold text-black dark:text-white tracking-tight leading-tight">
            All-in-One
          </h1>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
            Your financial safety tools
          </p>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onOpenSettings || (() => onSelectTab('settings'))}
            className="p-1.5 rounded-xl text-black hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-900 transition-colors cursor-pointer"
            title="Settings"
            aria-label="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>
    );
  }

  // Deep Sub-Tool Header with Back button
  if (canGoBack && currentTab !== 'dashboard') {
    const formatTitle = (tab: string) => {
      switch (tab) {
        case 'bills': return 'BillGuard';
        case 'debt_destroyer': return 'DebtDestroyer';
        case 'score_boost': return 'ScoreBoost Lab';
        case 'sub_scrub': return 'SubScrub';
        case 'money_streak': return 'MoneyStreak';
        case 'emergency_vault': return 'Emergency Vault';
        case 'net_worth': return 'Net Worth';
        case 'inquiries_tracker': return 'Inquiry Shield';
        case 'savings_goals': return 'Savings Goals';
        case 'dispute_tracker': return 'Dispute Clock';
        case 'interest_bleed': return 'Interest Bleed';
        case 'cash_flow': return 'Cash Flow';
        case 'rewards_tracker': return 'Rewards Vault';
        case 'no_spend_tracker': return 'No-Spend Days';
        case 'utilization_tracker': return 'Utilization';
        case 'sinking_funds': return 'Sinking Funds';
        case 'compare': return 'Card Compare';
        case 'track': return 'Track Score';
        case 'statement_optimizer': return 'AZEO Optimizer';
        case 'grocery_saver': return 'Grocery Saver';
        case 'settings': return 'Settings';
        case 'profile': return 'Profile';
        case 'score': return 'Credit Score';
        default: return tab.replace(/_/g, ' ');
      }
    };

    return (
      <header className="h-14 bg-white text-black dark:bg-black dark:text-white px-4 flex items-center justify-between shrink-0 no-print select-none border-b border-neutral-200 dark:border-neutral-800 transition-colors">
        <button
          type="button"
          onClick={onGoBack || (() => onSelectTab('dashboard'))}
          className="p-1.5 -ml-1 rounded-xl text-black hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-900 transition-colors cursor-pointer flex items-center gap-1.5"
          title="Back"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">Back</span>
        </button>

        <h1 className="text-sm font-bold text-black dark:text-white tracking-tight capitalize truncate max-w-[180px]">
          {formatTitle(currentTab)}
        </h1>

        <div className="flex items-center gap-1.5">
          {/* Light / Dark Mode Toggle */}
          {onToggleTheme && (
            <button
              type="button"
              onClick={onToggleTheme}
              className="p-1.5 rounded-xl text-neutral-600 hover:text-black hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-neutral-900 transition-colors cursor-pointer"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-neutral-700" />}
            </button>
          )}

          {/* Secure Vault Account */}
          {onOpenAuth && (
            <button
              type="button"
              onClick={onOpenAuth}
              className="p-1.5 rounded-xl text-sky-600 hover:text-sky-500 hover:bg-neutral-100 dark:text-sky-400 dark:hover:text-sky-300 dark:hover:bg-neutral-900 transition-colors cursor-pointer flex items-center justify-center"
              title="Encrypted Vault Account"
              aria-label="Vault Account"
            >
              <KeyRound className="w-4 h-4" />
            </button>
          )}

          {/* Privacy Toggle */}
          {onTogglePrivacyMode && (
            <button
              type="button"
              onClick={onTogglePrivacyMode}
              className="p-1.5 rounded-xl text-neutral-600 hover:text-black hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-neutral-900 transition-colors cursor-pointer"
              title={privacyMode ? 'Privacy Mode Active' : 'Toggle Privacy'}
              aria-label="Privacy mode"
            >
              {privacyMode ? <EyeOff className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Eye className="w-4 h-4" />}
            </button>
          )}

          {/* Profile Avatar */}
          <button
            type="button"
            onClick={onOpenProfile || (() => onSelectTab('profile'))}
            className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 flex items-center justify-center text-black dark:text-white transition-colors cursor-pointer"
            title="Profile"
            aria-label="Profile"
          >
            <User className="w-4 h-4" />
          </button>
        </div>
      </header>
    );
  }

  // Main Home Header: Logo top left + Theme Toggle + Vault Account + Privacy + Profile avatar
  return (
    <header className="h-14 bg-white text-black dark:bg-black dark:text-white px-4 flex items-center justify-between shrink-0 no-print select-none border-b border-neutral-200 dark:border-neutral-800 transition-colors">
      {/* CHIDONIQ Logo top left */}
      <button
        type="button"
        onClick={() => onSelectTab('dashboard')}
        className="flex items-center gap-2 cursor-pointer group"
      >
        <ChidoniqLogo size={28} animated={false} />
        <span className="text-lg font-black tracking-tight text-black dark:text-white font-sans uppercase">
          CHIDONIQ
        </span>
      </button>

      {/* Right Action Icons: Theme Toggle, Vault Account, Privacy, Profile */}
      <div className="flex items-center gap-1.5">
        {/* Working Light / Dark Mode Switch */}
        {onToggleTheme && (
          <button
            type="button"
            onClick={onToggleTheme}
            className="p-1.5 rounded-xl text-neutral-700 hover:text-black hover:bg-neutral-100 dark:text-neutral-300 dark:hover:text-white dark:hover:bg-neutral-900 transition-all cursor-pointer border border-transparent hover:border-neutral-200 dark:hover:border-neutral-800"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-neutral-800" />}
          </button>
        )}

        {/* Viral Share Button: chidoniq.com.ng */}
        <button
          type="button"
          onClick={handleShare}
          className="p-1.5 rounded-xl text-neutral-700 hover:text-black hover:bg-neutral-100 dark:text-neutral-300 dark:hover:text-white dark:hover:bg-neutral-900 transition-all cursor-pointer border border-transparent hover:border-neutral-200 dark:hover:border-neutral-800"
          title={copiedShare ? 'Link Copied: chidoniq.com.ng' : 'Share CHIDONIQ (chidoniq.com.ng)'}
          aria-label="Share CHIDONIQ"
        >
          {copiedShare ? (
            <Check className="w-4 h-4 text-emerald-500" />
          ) : (
            <Share2 className="w-4 h-4" />
          )}
        </button>

        {/* Encrypted Vault Account Button */}
        {onOpenAuth && (
          <button
            type="button"
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-900 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-800 transition-all cursor-pointer text-xs font-semibold shadow-xs"
            title="Encrypted Vault Sync &amp; Account"
            aria-label="Vault Account"
          >
            <KeyRound className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span className="text-[11px]">Vault</span>
          </button>
        )}

        {/* Privacy Blur Toggle */}
        {onTogglePrivacyMode && (
          <button
            type="button"
            onClick={onTogglePrivacyMode}
            className="p-1.5 rounded-xl text-neutral-700 hover:text-black hover:bg-neutral-100 dark:text-neutral-300 dark:hover:text-white dark:hover:bg-neutral-900 transition-colors cursor-pointer"
            title={privacyMode ? 'Privacy Mode Active' : 'Toggle Privacy'}
            aria-label="Privacy mode"
          >
            {privacyMode ? <EyeOff className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Eye className="w-4 h-4" />}
          </button>
        )}

        {/* Profile Avatar Icon */}
        <button
          type="button"
          onClick={onOpenProfile || (() => onSelectTab('profile'))}
          className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 flex items-center justify-center text-black dark:text-white transition-colors cursor-pointer shadow-xs"
          title={activeProfile.name ? activeProfile.name : "Your Profile"}
          aria-label="Profile"
        >
          <User className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
