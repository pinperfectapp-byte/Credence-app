import React, { useState, useRef } from 'react';
import { AppSettings, ThemeMode } from '../types/theme';
import { CreditProfile } from '../types/credit';
import { 
  Settings, 
  Sun, 
  Moon, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Database, 
  Download, 
  Upload, 
  Trash2, 
  Check, 
  AlertTriangle,
  Scale,
  Lock,
  FileCheck,
  Target,
  Trophy,
  Award,
  TrendingUp,
  CheckCircle2,
  RefreshCw,
  LogOut,
  KeyRound
} from 'lucide-react';
import { LegalModalTab } from './FooterLegalModal';
import { DownbaseFooter } from './DownbaseFooter';
import { useSupabaseAuth } from '../context/SupabaseAuthContext';

interface SettingsPageProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  profile: CreditProfile;
  onResetData: () => void;
  onImportBackup?: (importedProfile: CreditProfile, importedSettings: AppSettings) => void;
  onOpenLegal?: (tab: LegalModalTab) => void;
  onNavigateTab?: (tabId: string) => void;
  onReopenWelcome?: () => void;
  onReplaySplash?: () => void;
  onOpenAuthModal?: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  settings,
  onUpdateSettings,
  profile,
  onResetData,
  onImportBackup,
  onOpenLegal,
  onNavigateTab,
  onReopenWelcome,
  onReplaySplash,
  onOpenAuthModal,
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Supabase Auth & Cloud Sync
  const {
    user,
    lastSyncTime,
    isSyncing,
    syncToCloud,
    restoreFromCloud,
    signOut,
    isConfigured,
    credentials,
  } = useSupabaseAuth();
  const [supabaseMsg, setSupabaseMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleCloudSync = async () => {
    const res = await syncToCloud(profile);
    setSupabaseMsg({ type: res.success ? 'success' : 'error', text: res.message });
    setTimeout(() => setSupabaseMsg(null), 4000);
  };

  const handleCloudRestore = async () => {
    const res = await restoreFromCloud();
    if (res.profile && onImportBackup) {
      onImportBackup(res.profile, settings);
    }
    setSupabaseMsg({ type: res.profile ? 'success' : 'error', text: res.message });
    setTimeout(() => setSupabaseMsg(null), 4000);
  };

  const handleToggleTheme = (theme: ThemeMode) => {
    onUpdateSettings({ ...settings, theme });
  };

  const handleBureauChange = (bureau: 'all' | 'experian' | 'transUnion' | 'equifax') => {
    onUpdateSettings({ ...settings, defaultBureau: bureau });
  };

  const handleTogglePrivacyMode = () => {
    onUpdateSettings({ ...settings, privacyMode: !settings.privacyMode });
  };

  const handleToggleAutoBlur = () => {
    onUpdateSettings({ ...settings, autoPrivacyOnBlur: !settings.autoPrivacyOnBlur });
  };

  const handleTargetScoreChange = (score: number) => {
    const clamped = Math.min(850, Math.max(300, score));
    onUpdateSettings({ ...settings, targetScore: clamped });
  };

  // Target Score Calculations
  const currentScore = profile.baseScore > 0 ? profile.baseScore : 650;
  const targetScore = settings.targetScore || 800;
  const gap = targetScore - currentScore;
  const isGoalReached = currentScore >= targetScore;

  // Circular progress calculation: percentage of journey from 300 to targetScore
  const normalizedCurrent = Math.max(0, currentScore - 300);
  const normalizedTarget = Math.max(1, targetScore - 300);
  const progressRatio = Math.min(1, Math.max(0, normalizedCurrent / normalizedTarget));
  const progressPercent = Math.round(progressRatio * 100);

  // SVG circular bar parameters
  const circleRadius = 72;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * circleRadius; // ~452.39
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  // Milestone tier definition based on target score
  const getMilestonePerks = (score: number) => {
    if (score >= 800) {
      return {
        title: 'Top 1% Exceptional Credit Tier',
        savings: 'Saves ~$72,000 in lifetime financing interest',
        perks: [
          'Guaranteed best 30-year fixed mortgage rates (Tier-1 Prime)',
          'Top-tier premium metal travel & cash-back rewards credit cards',
          'Zero-security deposit waivers on luxury apartments and utilities',
        ],
      };
    }
    if (score >= 760) {
      return {
        title: 'Prime Mortgage Rate Tier',
        savings: 'Saves ~$68,000 on average $350k home mortgage',
        perks: [
          'Lowest available conventional home loan interest rate bracket',
          'Fast-track automated underwriting approvals',
          'Instant credit limit approvals up to $25,000+',
        ],
      };
    }
    if (score >= 720) {
      return {
        title: 'Prime Tier-1 Auto Lending',
        savings: 'Saves ~$3,400 on average $32k auto loan',
        perks: [
          'Sub-5% vehicle financing APRs without requiring co-signers',
          'High approval odds on prime airline and hotel credit cards',
          'Low introductory 0% APR balance transfer promotions',
        ],
      };
    }
    return {
      title: 'Conventional Approval Tier',
      savings: 'Escapes subprime fee traps and security deposits',
      perks: [
        'Standard conventional home mortgage qualification threshold',
        'Eliminates need for high-deposit secured cards',
        'Approval for standard non-predatory credit cards',
      ],
    };
  };

  const targetPerks = getMilestonePerks(targetScore);

  // Download Backup feature
  const handleDownloadBackup = () => {
    const today = new Date().toISOString().split('T')[0];
    const backupPayload = {
      app: 'CHIDONIQ',
      version: '2.0.0',
      exportedAt: new Date().toISOString(),
      profile,
      settings,
    };

    const dataBlob = new Blob([JSON.stringify(backupPayload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(dataBlob);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.href = url;
    downloadAnchor.download = `chidoniq_full_backup_${today}.json`;
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3500);
  };

  // Import Backup feature
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);

        if (!parsed.profile) {
          throw new Error('Invalid backup file: missing profile object');
        }

        if (onImportBackup) {
          onImportBackup(parsed.profile, parsed.settings || settings);
          setImportSuccess(true);
          setImportError(null);
          setTimeout(() => setImportSuccess(false), 3500);
        }
      } catch (err: any) {
        setImportError('Failed to parse backup JSON. Please ensure it is a valid CHIDONIQ backup file.');
        setTimeout(() => setImportError(null), 4000);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-8 pb-8 max-w-4xl mx-auto">
      {/* 1. Header Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-6 shadow-sm border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <Settings className="w-4 h-4 text-emerald-400" />
              <span>Application Configuration &amp; Financial Targets</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Settings &amp; Dream Score Goal
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Define your dream credit score, visualize the point gap with a circular progress gauge, configure privacy shields, and export manual data backups.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Target Score Feature with Circular Progress Bar (User Request) */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-6 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Dream Credit Score Target &amp; Gap Visualizer
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Track how close you are to your aspirational credit score milestone.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Target Score:</span>
            <input
              type="number"
              min="300"
              max="850"
              value={targetScore}
              onChange={(e) => handleTargetScoreChange(parseInt(e.target.value) || 750)}
              className="w-20 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1 text-slate-900 dark:text-white font-mono-numeric font-bold text-sm text-center focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Circular Gauge & Gap Breakdown Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Left Column: Circular Progress Bar SVG */}
          <div className="md:col-span-5 flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="relative flex items-center justify-center">
              <svg width="190" height="190" viewBox="0 0 190 190" className="transform -rotate-90">
                <defs>
                  <linearGradient id="targetScoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#00e676" />
                  </linearGradient>
                </defs>

                {/* Track Circle */}
                <circle
                  cx="95"
                  cy="95"
                  r={circleRadius}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={strokeWidth}
                  className="text-slate-200 dark:text-slate-700"
                />

                {/* Animated Progress Circle */}
                <circle
                  cx="95"
                  cy="95"
                  r={circleRadius}
                  fill="none"
                  stroke="url(#targetScoreGrad)"
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-700 ease-out"
                />
              </svg>

              {/* Inner Circle Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
                {isGoalReached ? (
                  <>
                    <Trophy className="w-6 h-6 text-amber-500 mb-1 animate-bounce" />
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                      Goal Met!
                    </span>
                    <span className="text-xl font-black text-slate-900 dark:text-white font-mono-numeric">
                      {currentScore}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono-numeric">
                      +{Math.abs(gap)} pts ahead
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Score Gap
                    </span>
                    <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono-numeric tracking-tight">
                      +{gap}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      pts to reach {targetScore}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Progress Percentage Badge */}
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-mono-numeric border border-emerald-300 dark:border-emerald-800">
                {progressPercent}% Complete
              </span>
            </div>
          </div>

          {/* Right Column: Score Breakdown & Presets */}
          <div className="md:col-span-7 space-y-4 text-xs">
            {/* Quick Presets Buttons */}
            <div>
              <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                Popular Dream Score Presets:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { score: 720, label: '720 Prime Auto' },
                  { score: 760, label: '760 Prime Mortgage' },
                  { score: 800, label: '800 Top 1% Tier' },
                  { score: 850, label: '850 Perfect Score' },
                ].map((preset) => (
                  <button
                    key={preset.score}
                    type="button"
                    onClick={() => handleTargetScoreChange(preset.score)}
                    className={`px-2.5 py-1.5 rounded-lg border text-center transition-all cursor-pointer font-mono-numeric text-[11px] ${
                      targetScore === preset.score
                        ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Slider */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-slate-600 dark:text-slate-400">Adjust Target Score Slider:</span>
                <span className="font-bold text-slate-900 dark:text-white font-mono-numeric">{targetScore}</span>
              </div>
              <input
                type="range"
                min="500"
                max="850"
                step="5"
                value={targetScore}
                onChange={(e) => handleTargetScoreChange(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono-numeric mt-1">
                <span>500 (Fair)</span>
                <span>670 (Good)</span>
                <span>740 (Very Good)</span>
                <span>800 (Exceptional)</span>
                <span>850 (Max)</span>
              </div>
            </div>

            {/* Unlocked Benefits at Target Score */}
            <div className="p-3.5 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Unlocked at {targetScore}: {targetPerks.title}</span>
                </span>
                <span className="font-mono-numeric text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                  {targetPerks.savings}
                </span>
              </div>

              <ul className="space-y-1 text-[11px] text-slate-700 dark:text-slate-300">
                {targetPerks.perks.map((perk, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Theme Preferences (Light Mode & Dark Mode) */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-4 transition-colors">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <Sun className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Appearance &amp; Theme
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Choose your preferred visual mode for daytime clarity or nighttime comfort.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Light Mode Card */}
          <div
            onClick={() => handleToggleTheme('light')}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
              settings.theme === 'light'
                ? 'border-emerald-600 bg-emerald-50/40 dark:bg-emerald-950/20'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-slate-900 dark:text-white text-xs block">
                  Light Mode
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Clean, high-contrast crisp day palette
                </span>
              </div>
            </div>

            {settings.theme === 'light' && (
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                <Check className="w-3 h-3" />
              </span>
            )}
          </div>

          {/* Dark Mode Card */}
          <div
            onClick={() => handleToggleTheme('dark')}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
              settings.theme === 'dark'
                ? 'border-emerald-500 bg-slate-900 text-white'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-800 text-slate-200 flex items-center justify-center">
                <Moon className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-slate-900 dark:text-white text-xs block">
                  Dark Mode
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Deep obsidian &amp; emerald neon for low-light
                </span>
              </div>
            </div>

            {settings.theme === 'dark' && (
              <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center">
                <Check className="w-3 h-3 font-bold" />
              </span>
            )}
          </div>
        </div>
      </section>

      {/* 4. Privacy Mode & Screen Shield */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-4 transition-colors">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Privacy Mode &amp; Public Screen Shield
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Blurs sensitive credit scores, debt balances, and limits for protection in coffee shops, offices, and flights.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Main Privacy Blur Toggle */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className={`p-2.5 rounded-lg shrink-0 ${
                settings.privacyMode 
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400' 
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}>
                {settings.privacyMode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </div>
              <div>
                <span className="font-bold text-slate-900 dark:text-white text-xs block">
                  Privacy Mode (Blur Sensitive Numbers)
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                  When enabled, all credit scores, card balances, and debt figures are blurred. Hovering any number temporarily reveals it for 2 seconds.
                </p>
                <div className="mt-2 inline-flex items-center gap-2 text-xs">
                  <span className="text-[11px] text-slate-400">Preview:</span>
                  <span className={`font-mono-numeric font-bold text-slate-900 dark:text-white px-2 py-0.5 rounded-sm bg-slate-200 dark:bg-slate-700 ${
                    settings.privacyMode ? 'privacy-masked' : ''
                  }`}>
                    Score 742 · $14,250
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleTogglePrivacyMode}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer shrink-0 self-start sm:self-center ${
                settings.privacyMode
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs'
                  : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200'
              }`}
            >
              {settings.privacyMode ? 'Privacy Active (On)' : 'Activate Privacy (Off)'}
            </button>
          </div>

          {/* Auto-Activate on App Inactive / Tab Switch */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <span className="font-bold text-slate-900 dark:text-white text-xs block">
                Auto-Activate Privacy When App / Window Loses Focus
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Automatically masks sensitive balances whenever you switch tabs or minimize the browser window.
              </p>
            </div>

            <button
              onClick={handleToggleAutoBlur}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                settings.autoPrivacyOnBlur ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  settings.autoPrivacyOnBlur ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </section>

      {/* 5. Default Bureau View */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-4 transition-colors">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Default Credit Bureau Display
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Select which bureau disclosure opens by default on the Score Dashboard.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {[
            { id: 'all', label: 'All Bureaus (Average)' },
            { id: 'experian', label: 'Experian (TX)' },
            { id: 'transUnion', label: 'TransUnion (PA)' },
            { id: 'equifax', label: 'Equifax (GA)' },
          ].map((b) => (
            <button
              key={b.id}
              onClick={() => handleBureauChange(b.id as any)}
              className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                settings.defaultBureau === b.id
                  ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 font-bold'
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <span>{b.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 5.5. Encrypted Vault Sync & Member Account */}
      <section className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-xs space-y-4 transition-colors">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-black dark:text-white">
                  Encrypted Vault Sync &amp; Member Account
                </h2>
                {user ? (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 px-2 py-0.5 rounded-full font-semibold">
                    Vault Active
                  </span>
                ) : (
                  <span className="text-[10px] bg-neutral-100 text-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 px-2 py-0.5 rounded-full font-semibold">
                    Private Local Storage
                  </span>
                )}
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Email/Password authentication &amp; encrypted sovereign backup for your credit scores and budgets.
              </p>
            </div>
          </div>

          {onOpenAuthModal && (
            <button
              type="button"
              onClick={onOpenAuthModal}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>{user ? 'Account' : 'Sign In'}</span>
            </button>
          )}
        </div>

        {supabaseMsg && (
          <div className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
            supabaseMsg.type === 'success' 
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-200 dark:border-emerald-800' 
              : 'bg-rose-50 text-rose-800 border border-rose-300 dark:bg-rose-950/60 dark:text-rose-200 dark:border-rose-800'
          }`}>
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{supabaseMsg.text}</span>
          </div>
        )}

        {user ? (
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-bold text-sm shadow-xs">
                  {user.email ? user.email[0].toUpperCase() : 'U'}
                </div>
                <div>
                  <div className="text-xs font-bold text-black dark:text-white">
                    {user.email}
                  </div>
                  <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    Last Vault Sync: {lastSyncTime ? new Date(lastSyncTime).toLocaleString() : 'Never'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCloudSync}
                  disabled={isSyncing}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-black text-white dark:bg-white dark:text-black hover:opacity-90 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 shadow-xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{isSyncing ? 'Syncing...' : 'Sync to Vault'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleCloudRestore}
                  disabled={isSyncing}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-black dark:text-white flex items-center gap-1.5 border border-neutral-300 dark:border-neutral-700 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Database className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>Restore</span>
                </button>
                <button
                  type="button"
                  onClick={signOut}
                  className="px-2.5 py-1.5 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="font-bold text-black dark:text-white text-xs block">
                Connect with Encrypted Vault Authentication
              </span>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Sign in with your email and password to sync your credit cards, dream score, and Downbase budget envelopes to your encrypted personal vault.
              </p>
            </div>

            {onOpenAuthModal && (
              <button
                type="button"
                onClick={onOpenAuthModal}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition-all cursor-pointer shrink-0 shadow-xs"
              >
                Sign In / Sign Up
              </button>
            )}
          </div>
        )}
      </section>

      {/* 6. Download Backup & Restore */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-4 transition-colors">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <Database className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Manual Data Backup &amp; Portability
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Download your complete credit profile, cards, target score, dispute history, and preferences to a portable JSON file.
            </p>
          </div>
        </div>

        {downloadSuccess && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 rounded-lg text-emerald-900 dark:text-emerald-300 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Complete JSON backup downloaded to your device! Keep this file secure.</span>
          </div>
        )}

        {importSuccess && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 rounded-lg text-emerald-900 dark:text-emerald-300 text-xs flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Backup successfully imported and restored! All profile data updated.</span>
          </div>
        )}

        {importError && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-800 rounded-lg text-rose-900 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
            <span>{importError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {/* Download Backup Card */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex flex-col justify-between space-y-3">
            <div className="space-y-1">
              <span className="font-bold text-slate-900 dark:text-white text-xs block">
                Download Backup (JSON)
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Exports all {profile.cards.length} cards, {profile.derogatoryItems.length} dispute items, scores, dream target ({targetScore}), personal info, and settings into a standardized JSON file.
              </p>
            </div>

            <button
              onClick={handleDownloadBackup}
              className="px-4 py-2 text-xs font-bold text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Backup (JSON)</span>
            </button>
          </div>

          {/* Import / Restore Backup Card */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex flex-col justify-between space-y-3">
            <div className="space-y-1">
              <span className="font-bold text-slate-900 dark:text-white text-xs block">
                Restore from Backup (JSON)
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Load a previously saved CHIDONIQ JSON backup file to instantly restore your accounts, scores, and settings.
              </p>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept=".json,application/json"
              onChange={handleFileChange}
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors border border-slate-300 dark:border-slate-700 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>Upload &amp; Restore Backup</span>
            </button>
          </div>
        </div>

        {/* Wipe Stored Data */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Need to delete everything on this browser?
          </span>

          {showClearConfirm ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-rose-600 dark:text-rose-400 font-semibold">
                Delete all stored data?
              </span>
              <button
                onClick={() => {
                  onResetData();
                  setShowClearConfirm(false);
                }}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-md cursor-pointer"
              >
                Yes, Wipe Everything
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-2 py-1.5 text-xs text-slate-500 hover:text-slate-700 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              {onReplaySplash && (
                <button
                  type="button"
                  onClick={onReplaySplash}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-bold"
                >
                  Replay 5s App Logo Splash
                </button>
              )}
              {onReopenWelcome && (
                <button
                  type="button"
                  onClick={onReopenWelcome}
                  className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer font-bold"
                >
                  Replay 1-Time Welcome Page
                </button>
              )}
              <button
                onClick={() => setShowClearConfirm(true)}
                className="text-xs text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1.5 cursor-pointer ml-auto"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Wipe Stored Data</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Downbase Footer Features */}
      {onOpenLegal && (
        <DownbaseFooter
          onOpenLegal={onOpenLegal}
          onNavigateTab={onNavigateTab}
          showThreeBadges={true}
        />
      )}
    </div>
  );
};
