import React, { useState, useEffect, useRef } from 'react';
import { CreditProfile, DerogatoryItem } from './types/credit';
import { ThemeMode, AppSettings } from './types/theme';
import { InAppNotification } from './types/notification';
import { getApproachingStatementNotifications, createDerogatoryStatusNotification } from './utils/notifications';
import { DEFAULT_USER_PROFILE } from './data/defaultProfile';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { ScoreOverviewTab } from './components/ScoreOverviewTab';
import { MenuPage } from './components/MenuPage';
import { ProfilePage } from './components/ProfilePage';
import { SettingsPage } from './components/SettingsPage';
import { StatementDateOptimizerTab } from './components/StatementDateOptimizerTab';
import { BureauDisputeHubTab } from './components/BureauDisputeHubTab';
import { ScoreSimulatorTab } from './components/ScoreSimulatorTab';
import { ActionPlanTab } from './components/ActionPlanTab';
import { DebtPayoffCalculatorTab } from './components/DebtPayoffCalculatorTab';
import { LegalDisputeToolkitTab } from './components/LegalDisputeToolkitTab';
import { CardCompareTab } from './components/CardCompareTab';
import { ScoreTrackChartTab } from './components/ScoreTrackChartTab';
import { GroceryCardSaverTab } from './components/GroceryCardSaverTab';
import { CreditScoreCheckerTab } from './components/CreditScoreCheckerTab';
import { CreditBuilderBeginnersTab } from './components/CreditBuilderBeginnersTab';
import { LoanComparisonTab } from './components/LoanComparisonTab';
import { SplashScreen } from './components/SplashScreen';
import { WelcomeScreen } from './components/WelcomeScreen';
import { FooterLegalModal, LegalModalTab } from './components/FooterLegalModal';
import { NotificationToast } from './components/NotificationCenter';
import { 
  LayoutDashboard, 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  Compass,
  ArrowLeft
} from 'lucide-react';

const PROFILE_STORAGE_KEY = 'credence_user_profile_fresh_v8';
const SETTINGS_STORAGE_KEY = 'credence_app_settings_fresh_v8';
const WELCOME_STORAGE_KEY = 'credence_welcome_dismissed_v9_pro';

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'light',
  defaultBureau: 'all',
  statementWarningDays: 3,
  privacyMode: false,
  autoPrivacyOnBlur: true,
  targetScore: 750,
};

export default function App() {
  // 5-Second Animated Starting Splash Screen
  const [showSplash, setShowSplash] = useState<boolean>(true);

  // Legal Modal State (Privacy Policy, Terms of Use, FAQ, Feedback, Contact Us, Solutions)
  const [legalModalOpen, setLegalModalOpen] = useState<boolean>(false);
  const [legalModalTab, setLegalModalTab] = useState<LegalModalTab>('privacy');

  const handleOpenLegal = (tab: LegalModalTab) => {
    setLegalModalTab(tab);
    setLegalModalOpen(true);
  };

  // Professional One-Time Welcome Page State
  const [showWelcome, setShowWelcome] = useState<boolean>(() => {
    try {
      return localStorage.getItem(WELCOME_STORAGE_KEY) !== 'true';
    } catch {
      return true;
    }
  });

  // Theme & Settings
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch {
      // Fallback
    }
    return DEFAULT_SETTINGS;
  });

  // Apply dark mode to document HTML element
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // Storage unavailable
    }

    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);

  // Public Screen Shield: Auto-activate privacy blur when window loses focus
  useEffect(() => {
    if (!settings.autoPrivacyOnBlur) return;

    const handleWindowBlur = () => {
      setSettings((prev) => ({ ...prev, privacyMode: true }));
    };

    window.addEventListener('blur', handleWindowBlur);
    return () => {
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [settings.autoPrivacyOnBlur]);

  const handleToggleTheme = () => {
    const nextTheme: ThemeMode = settings.theme === 'dark' ? 'light' : 'dark';
    setSettings((prev) => ({ ...prev, theme: nextTheme }));
  };

  const handleTogglePrivacyMode = () => {
    setSettings((prev) => ({ ...prev, privacyMode: !prev.privacyMode }));
  };

  // User Credit Profile: starts clean and untouched (zero mock data)
  const [profile, setProfile] = useState<CreditProfile>(() => {
    try {
      const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback on error
    }
    return DEFAULT_USER_PROFILE;
  });

  // Navigation tab state (starts on dashboard with live math numbers)
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [featureSessionKey, setFeatureSessionKey] = useState<number>(0);
  const mainScrollRef = useRef<HTMLElement>(null);

  // In-App Notifications State (Statement date warnings & Derogatory status changes)
  const [notifications, setNotifications] = useState<InAppNotification[]>([]);
  const [activeToast, setActiveToast] = useState<InAppNotification | null>(null);

  // Strictly enforce scrolling to top on mount and tab changes
  useEffect(() => {
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTop = 0;
      mainScrollRef.current.scrollLeft = 0;
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [currentTab, showSplash, showWelcome]);

  const handleSelectTab = (tabId: string) => {
    setCurrentTab(tabId);
    setFeatureSessionKey((prev) => prev + 1);
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTop = 0;
      mainScrollRef.current.scrollLeft = 0;
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  // Check statement dates approaching on profile or warning days change
  useEffect(() => {
    if (profile.cards.length > 0) {
      const statementNotifs = getApproachingStatementNotifications(
        profile.cards,
        settings.statementWarningDays || 3
      );
      
      setNotifications((prev) => {
        const existingDerog = prev.filter((n) => n.type === 'derogatory_changed');
        return [...statementNotifs, ...existingDerog];
      });

      const urgent = statementNotifs.find((n) => n.severity === 'warning');
      if (urgent && !activeToast) {
        setActiveToast(urgent);
      }
    }
  }, [profile.cards, settings.statementWarningDays]);

  const handleDismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (activeToast?.id === id) {
      setActiveToast(null);
    }
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
    setActiveToast(null);
  };

  // Persist profile changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    } catch {
      // Storage unavailable
    }
  }, [profile]);

  // Early payment toggler for statement optimizer
  const handleToggleCardPaid = (cardId: string) => {
    setProfile((prev) => ({
      ...prev,
      cards: prev.cards.map((c) =>
        c.id === cardId ? { ...c, isPaidForStatement: !c.isPaidForStatement } : c
      ),
    }));
  };

  const handleUpdateCardBalance = (cardId: string, newBalance: number) => {
    setProfile((prev) => ({
      ...prev,
      cards: prev.cards.map((c) =>
        c.id === cardId ? { ...c, balance: newBalance } : c
      ),
    }));
  };

  // Update derogatory status, alert user with in-app notification, and recalculate score bonus
  const handleUpdateDerogatoryStatus = (
    itemId: string,
    newStatus: 'Reported' | 'Disputed' | 'Pending Verification' | 'Removed'
  ) => {
    const item = profile.derogatoryItems.find((d) => d.id === itemId);
    if (item) {
      const statusNotif = createDerogatoryStatusNotification(item, newStatus);
      setNotifications((prev) => [statusNotif, ...prev.filter((n) => n.id !== statusNotif.id)]);
      setActiveToast(statusNotif);
    }

    setProfile((prev) => {
      const itm = prev.derogatoryItems.find((d) => d.id === itemId);
      if (!itm) return prev;

      const wasRemoved = itm.status === 'Removed';
      const isNowRemoved = newStatus === 'Removed';

      let scoreDelta = 0;
      if (!wasRemoved && isNowRemoved) {
        scoreDelta = 48;
      } else if (wasRemoved && !isNowRemoved) {
        scoreDelta = -48;
      }

      const newBaseScore = Math.min(850, Math.max(0, prev.baseScore + scoreDelta));

      return {
        ...prev,
        baseScore: newBaseScore,
        bureaus: {
          experian: Math.min(850, prev.bureaus.experian + scoreDelta),
          transUnion: Math.min(850, prev.bureaus.transUnion + scoreDelta),
          equifax: Math.min(850, prev.bureaus.equifax + scoreDelta),
        },
        derogatoryItems: prev.derogatoryItems.map((d) =>
          d.id === itemId ? { ...d, status: newStatus } : d
        ),
      };
    });
  };

  const handleAddDerogatoryItem = (newItem: DerogatoryItem) => {
    setProfile((prev) => ({
      ...prev,
      derogatoryItems: [newItem, ...prev.derogatoryItems],
    }));
  };

  const handleUpdateBaseScore = (score: number) => {
    setProfile((prev) => ({
      ...prev,
      baseScore: score,
      bureaus: {
        experian: score,
        transUnion: score,
        equifax: score,
      },
    }));
  };

  const handleResetToBlank = () => {
    setProfile(DEFAULT_USER_PROFILE);
    try {
      localStorage.removeItem(PROFILE_STORAGE_KEY);
    } catch {
      // Storage unavailable
    }
  };

  const handleLoadSampleCards = () => {
    setProfile((prev) => ({
      ...prev,
      cards: [
        {
          id: 'card_chase_1',
          name: 'Chase Freedom Unlimited',
          bank: 'JPMorgan Chase',
          balance: 1850,
          creditLimit: 4000,
          apr: 28.99,
          statementClosingDay: 18,
          paymentDueDay: 15,
          isPaidForStatement: false,
          color: '#1e3a8a',
        },
        {
          id: 'card_discover_2',
          name: 'Discover it Cash Back',
          bank: 'Discover',
          balance: 320,
          creditLimit: 3000,
          apr: 24.99,
          statementClosingDay: 8,
          paymentDueDay: 5,
          isPaidForStatement: false,
          color: '#ea580c',
        },
      ],
    }));
  };

  const handleImportBackup = (importedProfile: CreditProfile, importedSettings: AppSettings) => {
    setProfile(importedProfile);
    setSettings(importedSettings);
  };

  const handleDismissWelcome = () => {
    setShowWelcome(false);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    try {
      localStorage.setItem(WELCOME_STORAGE_KEY, 'true');
    } catch {
      // Storage unavailable
    }
  };

  const isDeepTool = ![
    'dashboard',
    'compare',
    'track',
    'statement_optimizer',
    'menu',
  ].includes(currentTab);

  // 1. Initial 5-Second Splash Screen
  if (showSplash) {
    return (
      <SplashScreen
        onComplete={() => {
          setShowSplash(false);
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
        }}
      />
    );
  }

  // Main 5 Navigation Dock Items inside 9:16 phone layout
  const dockItems = [
    { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'compare', label: 'Compare', icon: <DollarSign className="w-5 h-5" /> },
    { id: 'track', label: 'Track', icon: <TrendingUp className="w-5 h-5" /> },
    { id: 'statement_optimizer', label: 'AZEO', icon: <Calendar className="w-5 h-5" /> },
    { id: 'menu', label: 'Tools', icon: <Compass className="w-5 h-5" /> },
  ];

  return (
    /* Outer Desktop Canvas: Centers the Strictly Stagnant 9:16 App Frame */
    <div className="fixed inset-0 w-full h-full bg-slate-950 flex items-center justify-center overflow-hidden font-sans antialiased select-none">
      
      {/* 2. One-Time Professional Welcome Screen */}
      {showWelcome && (
        <WelcomeScreen
          onDismiss={handleDismissWelcome}
          onSetScore={(score) => {
            setProfile((prev) => ({
              ...prev,
              baseScore: score,
              bureaus: { experian: score, transUnion: score, equifax: score },
            }));
          }}
          currentScore={profile.baseScore}
          onSelectProblem={(tabId) => handleSelectTab(tabId)}
          onOpenLegal={handleOpenLegal}
        />
      )}

      {/* FULLY CROPPED 9:16 MOBILE APP CONTAINER (STRICTLY STAGNANT: NO LEFT/RIGHT MOVEMENT) */}
      <div className={`w-full max-w-[420px] h-[100dvh] max-h-[890px] aspect-[9/16] flex flex-col relative overflow-hidden shadow-2xl border-x sm:border border-slate-200 dark:border-slate-800 rounded-none sm:rounded-[36px] transition-colors ${
        settings.theme === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}>
        
        {/* Top Header Bar (Notification icon removed as requested!) */}
        <Header
          currentTab={currentTab}
          onSelectTab={handleSelectTab}
          activeProfile={profile}
          theme={settings.theme}
          onToggleTheme={handleToggleTheme}
          privacyMode={settings.privacyMode}
          onTogglePrivacyMode={handleTogglePrivacyMode}
        />

        {/* In-App Toast Alert Popup */}
        <NotificationToast
          notification={activeToast}
          onDismiss={() => setActiveToast(null)}
          onNavigate={handleSelectTab}
        />

        {/* Deep Tool Back Row */}
        {isDeepTool && (
          <div className="bg-white/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 px-3 py-2 flex items-center justify-between shrink-0 no-print">
            <button
              onClick={() => handleSelectTab('menu')}
              className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Tools</span>
            </button>
            <span className="text-[10px] font-mono-numeric font-bold text-slate-400 uppercase">
              {currentTab.replace('_', ' ')}
            </span>
          </div>
        )}

        {/* Strictly Stagnant Scrollable Content Area: Vertical Only, Zero Horizontal Moving */}
        <main
          ref={mainScrollRef}
          key={`${currentTab}-${featureSessionKey}`}
          className="flex-1 overflow-y-auto overflow-x-hidden p-3.5 space-y-4"
        >
          
          {/* Page 1: Dashboard (Overview, Problem Solvers, Export Report) */}
          {currentTab === 'dashboard' && (
            <ScoreOverviewTab
              profile={profile}
              onNavigateTab={(tab) => handleSelectTab(tab)}
              privacyMode={settings.privacyMode}
              targetScore={settings.targetScore}
              onUpdateBaseScore={handleUpdateBaseScore}
              onOpenLegal={handleOpenLegal}
            />
          )}

          {/* Screen 2: Real-Time Dollar Credit & APR Calculator */}
          {currentTab === 'compare' && (
            <CardCompareTab
              initialBalance={profile.cards.reduce((sum, c) => sum + c.balance, 0) || 2000}
              initialApr={profile.cards.length > 0 ? Math.max(...profile.cards.map((c) => c.apr)) : 29.0}
            />
          )}

          {/* Screen 3: Track Score Real Graph */}
          {currentTab === 'track' && (
            <ScoreTrackChartTab currentProfileScore={profile.baseScore} />
          )}

          {/* Grocery Card Saver: Pure Math Calculator for US Supermarkets (12 Cards Sheet) */}
          {currentTab === 'grocery_saver' && (
            <GroceryCardSaverTab onBackToDashboard={() => handleSelectTab('dashboard')} />
          )}

          {/* Feature 1: Credit Score Checker (User enters credit, app shows best cards they can get) */}
          {(currentTab === 'score_checker' || currentTab === 'credit_score_checker') && (
            <CreditScoreCheckerTab
              initialScore={profile.baseScore}
              onNavigateTab={(tab) => handleSelectTab(tab)}
            />
          )}

          {/* Feature 2: Debt Payoff Calculator (Snowball vs Avalanche & date debt-free) */}
          {currentTab === 'debt_payoff' && (
            <DebtPayoffCalculatorTab profile={profile} />
          )}

          {/* Feature 3: Credit Builder for Beginners (18-21 yr olds with no credit) */}
          {currentTab === 'credit_builder' && (
            <CreditBuilderBeginnersTab />
          )}

          {/* Feature 4: Loan Comparison (Personal loans, best APR) */}
          {currentTab === 'loan_comparison' && (
            <LoanComparisonTab />
          )}

          {/* Specialized Problem-Solver 1: AZEO Statement Optimizer */}
          {currentTab === 'statement_optimizer' && (
            <StatementDateOptimizerTab
              cards={profile.cards}
              onToggleCardPaid={handleToggleCardPaid}
              onUpdateCardBalance={handleUpdateCardBalance}
              onOpenProfileModal={() => handleSelectTab('profile')}
              onAddSampleCards={handleLoadSampleCards}
            />
          )}

          {/* Specialized Problem-Solver 2: Bureau Dispute Hub */}
          {currentTab === 'dispute_hub' && (
            <BureauDisputeHubTab
              profile={profile}
              onUpdateDerogatoryStatus={handleUpdateDerogatoryStatus}
              onAddDerogatoryItem={handleAddDerogatoryItem}
            />
          )}

          {/* Page 3: Tools Menu (With Working Notification Center Feature) */}
          {currentTab === 'menu' && (
            <MenuPage
              onNavigate={(page) => handleSelectTab(page)}
              onOpenLegal={handleOpenLegal}
              notifications={notifications}
              onDismissNotification={handleDismissNotification}
              onClearAllNotifications={handleClearAllNotifications}
            />
          )}

          {/* Page 4: Profile Page */}
          {currentTab === 'profile' && (
            <ProfilePage
              profile={profile}
              onUpdateProfile={(updated) => setProfile(updated)}
              onResetToBlank={handleResetToBlank}
            />
          )}

          {/* Page 5: Settings Page */}
          {currentTab === 'settings' && (
            <SettingsPage
              settings={settings}
              onUpdateSettings={setSettings}
              profile={profile}
              onResetData={handleResetToBlank}
              onImportBackup={handleImportBackup}
              onOpenLegal={handleOpenLegal}
              onReopenWelcome={() => setShowWelcome(true)}
            />
          )}

          {/* Legal Dispute Toolkit */}
          {currentTab === 'legal_toolkit' && (
            <LegalDisputeToolkitTab profile={profile} />
          )}

          {/* What-If Simulator */}
          {currentTab === 'simulator' && (
            <ScoreSimulatorTab profile={profile} />
          )}

          {/* Action Roadmap */}
          {currentTab === 'roadmap' && (
            <ActionPlanTab
              profile={profile}
              onNavigateTab={(tab) => handleSelectTab(tab)}
            />
          )}
        </main>

        {/* Strictly Stagnant 9:16 Bottom Dock Navigation Bar */}
        <nav className="h-15 border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-2 flex items-center justify-around shrink-0 no-print select-none">
          {dockItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  isActive
                    ? 'text-emerald-500 font-black'
                    : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                {item.icon}
                <span className="text-[10px] font-mono-numeric font-bold tracking-tight">
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

      </div>

      {/* Simple Privacy Policy, Terms of Use, and About Us Modal */}
      <FooterLegalModal
        isOpen={legalModalOpen}
        onClose={() => setLegalModalOpen(false)}
        initialTab={legalModalTab}
      />
    </div>
  );
}
