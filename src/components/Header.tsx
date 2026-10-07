import React from 'react';
import { CreditProfile } from '../types/credit';
import { ThemeMode } from '../types/theme';
import { CredenceLogo } from './CredenceLogo';
import { 
  User, 
  Sun, 
  Moon, 
  Eye, 
  EyeOff,
  Settings
} from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  onSelectTab: (tabId: string) => void;
  activeProfile: CreditProfile;
  theme: ThemeMode;
  onToggleTheme: () => void;
  privacyMode?: boolean;
  onTogglePrivacyMode?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  activeProfile,
  theme,
  onToggleTheme,
  privacyMode = false,
  onTogglePrivacyMode,
}) => {
  const isProfileUnconfigured = !activeProfile.name && activeProfile.baseScore === 0;

  return (
    <header className="h-14 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 flex items-center justify-between shrink-0 no-print transition-colors select-none">
      {/* Brand Logo & Name */}
      <button
        onClick={() => onSelectTab('dashboard')}
        className="text-base font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2 cursor-pointer group"
      >
        <CredenceLogo size={28} animated={false} />
        <span className="font-extrabold tracking-tight">Credence</span>
      </button>

      {/* Right Action Icons: Privacy, Theme, Profile (Notification icon removed as requested!) */}
      <div className="flex items-center gap-1.5">
        {/* Privacy Mode Quick Toggle */}
        {onTogglePrivacyMode && (
          <button
            onClick={onTogglePrivacyMode}
            className={`p-2 rounded-xl transition-colors border cursor-pointer ${
              privacyMode
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800'
            }`}
            title={privacyMode ? 'Privacy Mode Active (Numbers blurred)' : 'Blur sensitive numbers'}
            aria-label="Toggle privacy mode"
          >
            {privacyMode ? (
              <EyeOff className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        )}

        {/* Theme Toggle Button */}
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-800 cursor-pointer"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          aria-label="Toggle theme mode"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-700" />
          )}
        </button>

        {/* Visible Settings Navigation Button */}
        <button
          onClick={() => onSelectTab('settings')}
          className={`p-2 rounded-xl transition-colors border cursor-pointer ${
            currentTab === 'settings'
              ? 'bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950 border-slate-900 dark:border-emerald-500 shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800'
          }`}
          title="Open Settings & Preferences"
          aria-label="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Profile Pill */}
        <button
          onClick={() => onSelectTab('profile')}
          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 rounded-xl transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer font-mono-numeric"
          title="Open credit file profile"
        >
          <User className="w-3.5 h-3.5 text-emerald-500" />
          {isProfileUnconfigured ? (
            <span className="text-emerald-600 dark:text-emerald-400 text-[11px]">New</span>
          ) : (
            <span className={`text-[11px] ${privacyMode ? 'privacy-masked' : ''}`}>
              {activeProfile.baseScore || '--'}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
