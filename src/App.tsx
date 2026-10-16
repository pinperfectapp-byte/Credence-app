import React, { useState, useEffect, useRef } from 'react';
import { CreditProfile, DerogatoryItem } from './types/credit';
import { ThemeMode, AppSettings } from './types/theme';
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
import { CreditMythsQuizTab } from './components/CreditMythsQuizTab';
import { BudgetTrackerTab } from './components/BudgetTrackerTab';
import { BillGuardTab } from './components/BillGuardTab';
import { DebtDestroyerTab } from './components/DebtDestroyerTab';
import { ScoreBoostLabTab } from './components/ScoreBoostLabTab';
import { SubScrubTab } from './components/SubScrubTab';
import { MoneyStreakTab } from './components/MoneyStreakTab';
import { TrackerHubTab } from './components/TrackerHubTab';
import { EmergencyVaultTab } from './components/EmergencyVaultTab';
import { NetWorthTab } from './components/NetWorthTab';
import { InquiriesShieldTab } from './components/InquiriesShieldTab';
import { SavingsGoalsTab } from './components/SavingsGoalsTab';
import { DisputeClockTab } from './components/DisputeClockTab';
import { InterestBleedTab } from './components/InterestBleedTab';
import { CashFlowForecastTab } from './components/CashFlowForecastTab';
import { RewardsVaultTab } from './components/RewardsVaultTab';
import { NoSpendCalendarTab } from './components/NoSpendCalendarTab';
import { UtilizationMonitorTab } from './components/UtilizationMonitorTab';
import { SinkingFundsTab } from './components/SinkingFundsTab';
import { SplashScreen } from './components/SplashScreen';
import { WelcomeScreen } from './components/WelcomeScreen';
import { FooterLegalModal, LegalModalTab } from './components/FooterLegalModal';
import { SupabaseAuthModal } from './components/SupabaseAuthModal';
import { AuthPage } from './components/AuthPage';
import { useSupabaseAuth } from './context/SupabaseAuthContext';
import { 
  Home,
  PieChart,
  Award,
  LayoutGrid,
  Signal,
  Wifi,
  Battery,
  ArrowLeft,
  ShieldCheck,
  DollarSign,
  Calendar,
  SlidersHorizontal,
  TrendingUp
} from 'lucide-react';

const PROFILE_STORAGE_KEY = 'chidoniq_user_profile_fresh_v9';
const SETTINGS_STORAGE_KEY = 'chidoniq_app_settings_fresh_v9';
const WELCOME_STORAGE_KEY = 'chidoniq_welcome_dismissed_v9_pro';
const AUTH_DISMISSED_KEY = 'chidoniq_auth_dismissed_v1';

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  defaultBureau: 'all',
  statementWarningDays: 3,
  privacyMode: false,
  autoPrivacyOnBlur: false,
  targetScore: 750,
};

// Route mapping for all pages in CHIDONIQ app for direct Google Search indexing
const VALID_TABS: Record<string, string> = {
  dashboard: 'dashboard',
  home: 'dashboard',
  budget: 'budget',
  bills: 'bills',
  billguard: 'bills',
  debt_destroyer: 'debt_destroyer',
  'debt-destroyer': 'debt_destroyer',
  debtdestroyer: 'debt_destroyer',
  score_boost: 'score_boost',
  'score-boost': 'score_boost',
  scoreboost: 'score_boost',
  sub_scrub: 'sub_scrub',
  'sub-scrub': 'sub_scrub',
  subscrub: 'sub_scrub',
  money_streak: 'money_streak',
  'money-streak': 'money_streak',
  moneystreak: 'money_streak',
  tracker: 'tracker',
  trackers: 'tracker',
  'tracker-hub': 'tracker',
  score: 'score',
  score_checker: 'score',
  'credit-score-checker': 'score',
  compare: 'compare',
  cards: 'compare',
  'card-compare': 'compare',
  track: 'track',
  grocery_saver: 'grocery_saver',
  'grocery-saver': 'grocery_saver',
  debt_payoff: 'debt_payoff',
  'debt-payoff': 'debt_payoff',
  credit_builder: 'credit_builder',
  'credit-builder': 'credit_builder',
  loan_comparison: 'loan_comparison',
  'loan-comparison': 'loan_comparison',
  credit_myths: 'credit_myths',
  'credit-myths': 'credit_myths',
  statement_optimizer: 'statement_optimizer',
  'statement-optimizer': 'statement_optimizer',
  azeo: 'statement_optimizer',
  dispute_hub: 'dispute_hub',
  'dispute-hub': 'dispute_hub',
  disputes: 'dispute_hub',
  emergency_vault: 'emergency_vault',
  'emergency-vault': 'emergency_vault',
  net_worth: 'net_worth',
  'net-worth': 'net_worth',
  inquiries_tracker: 'inquiries_tracker',
  'inquiries-shield': 'inquiries_tracker',
  savings_goals: 'savings_goals',
  'savings-goals': 'savings_goals',
  dispute_tracker: 'dispute_tracker',
  'dispute-clock': 'dispute_tracker',
  interest_bleed: 'interest_bleed',
  'interest-bleed': 'interest_bleed',
  cash_flow: 'cash_flow',
  'cash-flow': 'cash_flow',
  rewards_tracker: 'rewards_tracker',
  'rewards-vault': 'rewards_tracker',
  no_spend_tracker: 'no_spend_tracker',
  'no-spend': 'no_spend_tracker',
  utilization_tracker: 'utilization_tracker',
  utilization: 'utilization_tracker',
  sinking_funds: 'sinking_funds',
  'sinking-funds': 'sinking_funds',
  legal_toolkit: 'legal_toolkit',
  simulator: 'simulator',
  roadmap: 'roadmap',
  menu: 'menu',
  more: 'menu',
  profile: 'profile',
  settings: 'settings',
  auth: 'auth',
  login: 'auth',
  signin: 'auth',
  signup: 'auth',
};

const TAB_SEO_TITLES: Record<string, string> = {
  auth: 'Sign In & Encrypted Vault Account - CHIDONIQ | chidoniq.com.ng',
  dashboard: 'CHIDONIQ - Free Credit Score & Budget Tracker USA | chidoniq.com.ng',
  budget: 'Budget Tracker ($1,250 Left) - CHIDONIQ | chidoniq.com.ng',
  bills: 'BillGuard Due Date Tracker - CHIDONIQ | chidoniq.com.ng',
  debt_destroyer: 'DebtDestroyer Snowball Calculator - CHIDONIQ | chidoniq.com.ng',
  score_boost: 'ScoreBoost Lab Credit Simulator - CHIDONIQ | chidoniq.com.ng',
  sub_scrub: 'SubScrub Subscription Killer - CHIDONIQ | chidoniq.com.ng',
  money_streak: 'MoneyStreak 30-Day Challenge - CHIDONIQ | chidoniq.com.ng',
  tracker: '17-in-1 Sovereign Financial Tracker Hub - CHIDONIQ | chidoniq.com.ng',
  score: 'Free Credit Score Checker & Card Recommender - CHIDONIQ | chidoniq.com.ng',
  compare: 'APR Slash & Credit Card Comparison - CHIDONIQ | chidoniq.com.ng',
  track: 'Track Credit Score History & Projection - CHIDONIQ | chidoniq.com.ng',
  statement_optimizer: 'AZEO Statement Date Optimizer - CHIDONIQ | chidoniq.com.ng',
  dispute_hub: 'FCRA Credit Bureau Dispute Hub - CHIDONIQ | chidoniq.com.ng',
  emergency_vault: 'Emergency Fund Vault - CHIDONIQ | chidoniq.com.ng',
  net_worth: 'Net Worth Tracking Ledger - CHIDONIQ | chidoniq.com.ng',
  inquiries_tracker: 'Credit Inquiry Hard Pull Shield - CHIDONIQ | chidoniq.com.ng',
  savings_goals: 'Multi-Vault Savings Goals - CHIDONIQ | chidoniq.com.ng',
  dispute_tracker: '30-Day FCRA Dispute Timer - CHIDONIQ | chidoniq.com.ng',
  interest_bleed: 'APR Daily Interest Bleed Monitor - CHIDONIQ | chidoniq.com.ng',
  cash_flow: '30-Day Cash Flow Forecast - CHIDONIQ | chidoniq.com.ng',
  rewards_tracker: 'Cashback & Points Rewards Vault - CHIDONIQ | chidoniq.com.ng',
  no_spend_tracker: 'No-Spend Days Streak Calendar - CHIDONIQ | chidoniq.com.ng',
  utilization_tracker: 'Revolving Credit Utilization Watchdog - CHIDONIQ | chidoniq.com.ng',
  sinking_funds: 'Sinking Funds Envelope Allocator - CHIDONIQ | chidoniq.com.ng',
  credit_builder: 'Credit Builder for Beginners - CHIDONIQ | chidoniq.com.ng',
  loan_comparison: 'Personal Loan APR Comparison - CHIDONIQ | chidoniq.com.ng',
  credit_myths: 'Credit Myths & Realities Quiz - CHIDONIQ | chidoniq.com.ng',
  grocery_saver: 'Grocery Card Reward Maximizer - CHIDONIQ | chidoniq.com.ng',
  debt_payoff: 'Debt Payoff Free Date Calculator - CHIDONIQ | chidoniq.com.ng',
  simulator: 'Interactive What-If Score Simulator - CHIDONIQ | chidoniq.com.ng',
  roadmap: 'Personalized Action Roadmap - CHIDONIQ | chidoniq.com.ng',
  menu: 'Financial Tools & Utilities - CHIDONIQ | chidoniq.com.ng',
  profile: 'My Credit Profile - CHIDONIQ | chidoniq.com.ng',
  settings: 'Security & App Settings - CHIDONIQ | chidoniq.com.ng',
};

const TAB_SEO_DESCRIPTIONS: Record<string, string> = {
  dashboard: 'CHIDONIQ (chidoniq.com.ng) - Track your 742 credit score, $1,250 money left, bills, debt payoff, subscriptions. The all-in-one finance app Americans trust.',
  budget: 'Track category budget envelopes and real-time safe money remaining with zero SSN required. Private daily spending ledger on CHIDONIQ.',
  bills: 'BillGuard Sentinel: Never miss a due date. Track upcoming recurring bills, autopay dates, and obligations with calendar alerts.',
  debt_destroyer: 'DebtDestroyer Snowball & Avalanche calculator. Calculate your exact debt-free date and save thousands on credit card interest.',
  score_boost: 'ScoreBoost Lab: What-If credit simulator. Test balance paydowns, credit limit increases, and authorized user boosts in real time.',
  sub_scrub: 'SubScrub Subscription Killer: Audit recurring subscriptions, calculate annual waste, and reclaim your cash flow.',
  money_streak: 'MoneyStreak: 30-Day financial habit challenge. Build daily money-saving streaks and earn financial discipline milestones.',
  tracker: '17-in-1 Sovereign Financial Tracker Hub: Access all credit, savings, debt, and wealth planning tools from one central command center.',
  score: 'Check your credit score range and discover best-fit credit cards and loans with zero hard inquiry credit impact.',
  compare: 'Compare credit cards, slash high interest rates, and evaluate balance transfer math to eliminate compounding interest.',
  track: 'Track credit score history and projected trends over time with visual chart telemetry and milestone tracking.',
  statement_optimizer: 'AZEO (All Zero Except One) statement date optimizer. Maximize FICO credit scores by timing card statement closing dates.',
  dispute_hub: 'FCRA Credit Bureau Dispute Hub: Generate certified 30-day investigation dispute letters for Equifax, Experian, and TransUnion.',
  emergency_vault: 'Emergency Fund Vault: Calculate your 3-to-6 month safety reserve runway and safeguard your household finances.',
  net_worth: 'Net Worth Ledger: Monitor total assets and liabilities to calculate personal equity and long-term financial independence.',
  inquiries_tracker: 'Credit Inquiry Shield: Track hard vs soft inquiries, monitor 2-year expiration timers, and protect your credit score.',
  savings_goals: 'Multi-Vault Savings Goals: Set target dates and automated progress tracking for vacations, homes, and emergency cushions.',
  dispute_tracker: '30-Day FCRA Dispute Clock: Track statutory investigation countdowns and creditor compliance deadlines under federal law.',
  interest_bleed: 'APR Daily Interest Bleed: Track how much interest compounding credit card balances cost you every single day.',
  cash_flow: '30-Day Cash Flow Forecast: Predict upcoming liquidity gaps and manage income vs expenses seamlessly.',
  rewards_tracker: 'Cashback & Points Rewards Vault: Maximize reward points and card perks across grocery, dining, and travel categories.',
  no_spend_tracker: 'No-Spend Days Calendar: Track zero-discretionary spending days and accelerate your emergency fund accumulation.',
  utilization_tracker: 'Revolving Credit Utilization Watchdog: Monitor card balances and maintain optimal credit utilization under 6%.',
  sinking_funds: 'Sinking Funds Allocator: Plan ahead for irregular expenses like car repairs, insurance premiums, and holiday spending.',
  credit_builder: 'Credit Builder for Beginners: Complete guide for building credit with thin files, secured cards, and credit builder loans.',
  loan_comparison: 'Compare personal loans, interest rates, APR terms, and monthly payment options to find the lowest cost financing.',
  credit_myths: 'Credit Myths & Scoring Realities: Test your financial IQ on credit score myths, hard inquiries, and interest calculations.',
  grocery_saver: 'Grocery Card Saver: Pure math calculator across 12 US supermarket cards to maximize your grocery store cashback.',
  debt_payoff: 'Comprehensive multi-account debt payoff calculator comparing snowball vs avalanche payoff strategies.',
  simulator: 'Interactive What-If Credit Simulator: Test credit limit changes, inquiries, new trade lines, and balance paydowns.',
  roadmap: 'Personalized Action Roadmap: Follow prioritized steps to repair credit, slash debt, and build sovereign wealth.',
  auth: 'Sign in to your sovereign CHIDONIQ account with Email & Password to back up your credit score, budget, and debt payoff plans to your encrypted personal vault.',
};

const getInitialTabFromLocation = (): { tab: string; hasExplicitParam: boolean } => {
  try {
    const searchParams = new URLSearchParams(window.location.search);
    const tabParam = searchParams.get('tab') || searchParams.get('page');
    if (tabParam && VALID_TABS[tabParam.toLowerCase()]) {
      return { tab: VALID_TABS[tabParam.toLowerCase()], hasExplicitParam: true };
    }

    const path = window.location.pathname.replace(/^\/+/, '').toLowerCase();
    if (path && VALID_TABS[path]) {
      return { tab: VALID_TABS[path], hasExplicitParam: true };
    }

    const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
    if (hash && VALID_TABS[hash]) {
      return { tab: VALID_TABS[hash], hasExplicitParam: true };
    }
  } catch {}
  return { tab: 'dashboard', hasExplicitParam: false };
};

export default function App() {
  const initialLocation = useRef(getInitialTabFromLocation());
  const { user, restoreFromCloud } = useSupabaseAuth();

  // 1. First Page: App Logo displayed for 5 seconds on root home, but skipped if a direct subpage was requested
  const [showSplash, setShowSplash] = useState<boolean>(() => !initialLocation.current.hasExplicitParam);

  // 1.5 Simple Email/Password Authentication Page State (with working skip button)
  const [showAuthScreen, setShowAuthScreen] = useState<boolean>(() => {
    if (initialLocation.current.hasExplicitParam) return false;
    try {
      return !localStorage.getItem(AUTH_DISMISSED_KEY);
    } catch {
      return false;
    }
  });

  const handleSkipAuth = () => {
    setShowAuthScreen(false);
    try {
      localStorage.setItem(AUTH_DISMISSED_KEY, 'true');
      const alreadySeen = localStorage.getItem(WELCOME_STORAGE_KEY);
      if (!alreadySeen) {
        setShowWelcome(true);
      }
    } catch {
      setShowWelcome(true);
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthScreen(false);
    try {
      localStorage.setItem(AUTH_DISMISSED_KEY, 'true');
    } catch {}
  };

  // Legal Modal State (Privacy Policy, Terms of Use, FAQ, Feedback, Contact Us, Solutions)
  const [legalModalOpen, setLegalModalOpen] = useState<boolean>(false);
  const [legalModalTab, setLegalModalTab] = useState<LegalModalTab>('privacy');

  const handleOpenLegal = (tab: LegalModalTab) => {
    setLegalModalTab(tab);
    setLegalModalOpen(true);
  };

  // Supabase Auth & Cloud Sync Modal State
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);

  // Welcome Screen State (One-Time Professional Welcome Page with skip button)
  const [showWelcome, setShowWelcome] = useState<boolean>(false);

  // Theme & Settings
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_STORAGE_KEY) || localStorage.getItem('credence_app_settings_fresh_v8');
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_SETTINGS, ...parsed, privacyMode: false, autoPrivacyOnBlur: false };
      }
    } catch {
      // Fallback
    }
    return DEFAULT_SETTINGS;
  });

  // Apply light / dark mode to document HTML element & body
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
      localStorage.setItem('chidoniq_theme', settings.theme);
    } catch {
      // Storage unavailable
    }

    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      document.body.style.backgroundColor = '#000000';
      document.body.style.color = '#FFFFFF';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      document.body.style.backgroundColor = '#FFFFFF';
      document.body.style.color = '#000000';
    }
  }, [settings.theme]);

  // Public Screen Shield: Auto-activate privacy blur only when top-level (not in iframe preview)
  useEffect(() => {
    if (!settings.autoPrivacyOnBlur) return;
    try {
      if (window.self !== window.top) return;
    } catch {}

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
    const nextMode = !settings.privacyMode;
    setSettings((prev) => ({ ...prev, privacyMode: nextMode }));
  };

  // Ensure any legacy notification storage keys are cleared
  useEffect(() => {
    try {
      [
        'chidoniq_live_notifications_v1',
        'chidoniq_live_notifications_v6',
        'chidoniq_live_notifications_v8',
        'chidoniq_realtime_notifications_v1',
        'credence_notifications'
      ].forEach((key) => localStorage.removeItem(key));
    } catch {}
  }, []);

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

  // Auto-connect Supabase authenticated user with active profile & restore cloud data
  useEffect(() => {
    if (user && user.email) {
      setProfile((prev) => {
        if (prev.email === user.email) return prev;
        return {
          ...prev,
          email: user.email!,
          name: user.user_metadata?.full_name || prev.name || user.email!.split('@')[0],
        };
      });

      restoreFromCloud().then((res) => {
        if (res.profile) {
          setProfile(res.profile);
        }
      });
    }
  }, [user]);

  // Navigation tab state (starts on requested subpage or dashboard)
  const [currentTab, setCurrentTab] = useState<string>(() => initialLocation.current.tab);
  const [navHistory, setNavHistory] = useState<string[]>([]);
  const [featureSessionKey, setFeatureSessionKey] = useState<number>(0);
  const mainScrollRef = useRef<HTMLElement>(null);

  // Dynamic SEO Synchronization for Google Search Indexing across all pages
  useEffect(() => {
    const pageTitle = TAB_SEO_TITLES[currentTab] || 'CHIDONIQ - Free Credit Score & Budget Tracker USA | chidoniq.com.ng';
    const pageDesc = TAB_SEO_DESCRIPTIONS[currentTab] || 'CHIDONIQ (chidoniq.com.ng) - Track your 742 credit score, $1,250 money left, bills, debt payoff, subscriptions. The all-in-one finance app Americans trust.';
    document.title = pageTitle;

    // Sync meta description
    const metaDescEl = document.querySelector('meta[name="description"]');
    if (metaDescEl) metaDescEl.setAttribute('content', pageDesc);

    // Sync canonical tag for Google Search indexing
    const canonicalEl = document.querySelector('link[rel="canonical"]');
    const targetCanonical = currentTab === 'dashboard' 
      ? 'https://chidoniq.com.ng' 
      : `https://chidoniq.com.ng/?tab=${currentTab}`;
    if (canonicalEl) {
      canonicalEl.setAttribute('href', targetCanonical);
    }

    // Sync Open Graph & Twitter URL tags
    const ogUrlEl = document.querySelector('meta[property="og:url"]');
    if (ogUrlEl) ogUrlEl.setAttribute('content', targetCanonical);
    const ogDescEl = document.querySelector('meta[property="og:description"]');
    if (ogDescEl) ogDescEl.setAttribute('content', pageDesc);
    const ogTitleEl = document.querySelector('meta[property="og:title"]');
    if (ogTitleEl) ogTitleEl.setAttribute('content', pageTitle);

    const twitterUrlEl = document.querySelector('meta[name="twitter:url"]');
    if (twitterUrlEl) twitterUrlEl.setAttribute('content', targetCanonical);
    const twitterDescEl = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescEl) twitterDescEl.setAttribute('content', pageDesc);
    const twitterTitleEl = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitleEl) twitterTitleEl.setAttribute('content', pageTitle);

    // Sync window URL search param without triggering page reload
    try {
      const currentUrl = new URL(window.location.href);
      const currentTabParam = currentUrl.searchParams.get('tab');
      if (currentTab === 'dashboard') {
        if (currentTabParam) {
          currentUrl.searchParams.delete('tab');
          const cleanUrl = currentUrl.pathname + (currentUrl.search ? currentUrl.search : '');
          window.history.replaceState({ tab: 'dashboard' }, pageTitle, cleanUrl);
        }
      } else if (currentTabParam !== currentTab) {
        currentUrl.searchParams.set('tab', currentTab);
        window.history.pushState({ tab: currentTab }, pageTitle, currentUrl.pathname + currentUrl.search);
      }
    } catch {}
  }, [currentTab]);

  // Handle browser Back / Forward buttons (popstate)
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (e.state && e.state.tab && VALID_TABS[e.state.tab]) {
        handleSelectTab(VALID_TABS[e.state.tab], false);
      } else {
        const loc = getInitialTabFromLocation();
        handleSelectTab(loc.tab, false);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

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

  // Global tab navigation listener for DownbaseFooter or other child components
  useEffect(() => {
    const handleNavEvent = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        handleSelectTab(customEvent.detail);
      }
    };
    window.addEventListener('chidoniq-navigate-tab', handleNavEvent);
    window.addEventListener('credence-navigate-tab', handleNavEvent);
    return () => {
      window.removeEventListener('chidoniq-navigate-tab', handleNavEvent);
      window.removeEventListener('credence-navigate-tab', handleNavEvent);
    };
  }, []);

  const handleSelectTab = (tabId: string, pushToHistory: boolean = true) => {
    if (tabId === currentTab) return;
    if (pushToHistory) {
      setNavHistory((prev) => [...prev, currentTab]);
    }
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

  const handleGoBack = () => {
    setNavHistory((prev) => {
      if (prev.length === 0) {
        const isTrackerChild = [
          'budget', 'bills', 'debt_destroyer', 'score_boost', 'sub_scrub', 'money_streak',
          'emergency_vault', 'net_worth', 'inquiries_tracker', 'savings_goals',
          'dispute_tracker', 'interest_bleed', 'cash_flow', 'rewards_tracker',
          'no_spend_tracker', 'utilization_tracker', 'sinking_funds'
        ].includes(currentTab);
        setCurrentTab(isTrackerChild ? 'tracker' : 'dashboard');
        return [];
      }
      const nextHistory = [...prev];
      const previousPage = nextHistory.pop() || 'dashboard';
      setCurrentTab(previousPage);
      return nextHistory;
    });
    setFeatureSessionKey((prev) => prev + 1);
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTop = 0;
      mainScrollRef.current.scrollLeft = 0;
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
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

  // Update derogatory status and recalculate score bonus
  const handleUpdateDerogatoryStatus = (
    itemId: string,
    newStatus: 'Reported' | 'Disputed' | 'Pending Verification' | 'Removed'
  ) => {

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
    const delta = score - profile.baseScore;
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
    'budget',
    'score',
    'menu',
    'more',
  ].includes(currentTab);

  const previousTab = navHistory.length > 0 ? navHistory[navHistory.length - 1] : null;

  const getPageTitle = (tab: string | null): string => {
    if (!tab) return 'Previous Page';
    switch (tab) {
      case 'tracker': return 'Tracker Hub';
      case 'dashboard': return 'Home';
      case 'menu': return 'More';
      case 'more': return 'More';
      case 'budget': return 'Budget';
      case 'score': return 'Score';
      case 'compare': return 'Compare';
      case 'track': return 'Track';
      case 'statement_optimizer': return 'AZEO';
      case 'settings': return 'Settings';
      case 'profile': return 'Profile';
      case 'bills': return 'BillGuard';
      case 'debt_destroyer': return 'DebtDestroyer';
      case 'score_boost': return 'ScoreBoost';
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
      default: return tab.replace(/_/g, ' ');
    }
  };

  // 1. First Page: App Logo displayed for 5 seconds before taking users to Auth or Welcome Page
  if (showSplash) {
    return (
      <SplashScreen
        onComplete={() => {
          setShowSplash(false);
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
          try {
            const authDismissed = localStorage.getItem(AUTH_DISMISSED_KEY);
            if (authDismissed) {
              const alreadySeen = localStorage.getItem(WELCOME_STORAGE_KEY);
              if (!alreadySeen) {
                setShowWelcome(true);
              }
            }
          } catch {
            // fallback
          }
        }}
      />
    );
  }

  // 1.5 Simple Email/Password Authentication Page (with working skip button)
  if (showAuthScreen && !user) {
    return (
      <AuthPage
        onSkip={handleSkipAuth}
        onSuccess={handleAuthSuccess}
      />
    );
  }

  // 5 Bottom Navigation Dock Items: Home, AZEO Tool, Track, Score, More
  // Replaces budget tracker icon with AZEO tool and Track on Downbase
  const dockItems = [
    { id: 'dashboard', label: 'Home', icon: <Home className="w-5 h-5 stroke-[2.2]" /> },
    { id: 'statement_optimizer', label: 'AZEO', icon: <SlidersHorizontal className="w-5 h-5 stroke-[2.2]" /> },
    { id: 'track', label: 'Track', icon: <TrendingUp className="w-5 h-5 stroke-[2.2]" /> },
    { id: 'score', label: 'Score', icon: <Award className="w-5 h-5 stroke-[2.2]" /> },
    { id: 'menu', label: 'More', icon: <LayoutGrid className="w-5 h-5 stroke-[2.2]" /> },
  ];

  return (
    /* Native Clean Responsive Web App Container (Zero Phone Frame, Zero Fake Status Bar) */
    <div className="min-h-screen w-full bg-white text-black dark:bg-black dark:text-white flex flex-col items-center selection:bg-blue-600 selection:text-white font-sans antialiased transition-colors">
      
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

      {/* Main Responsive Web App Wrapper */}
      <div className="w-full max-w-xl min-h-screen flex flex-col relative bg-white text-black dark:bg-black dark:text-white shadow-2xl transition-colors">

        {/* Sticky Top Header Bar */}
        <div className="sticky top-0 z-40 w-full bg-white dark:bg-black border-b border-neutral-200 dark:border-neutral-800 transition-colors">
          <Header
            currentTab={currentTab}
            onSelectTab={handleSelectTab}
            onGoBack={handleGoBack}
            activeProfile={profile}
            privacyMode={settings.privacyMode}
            onTogglePrivacyMode={handleTogglePrivacyMode}
            onOpenSettings={() => handleSelectTab('settings')}
            onOpenProfile={() => handleSelectTab('profile')}
            onOpenAuth={() => setAuthModalOpen(true)}
            canGoBack={navHistory.length > 0 || isDeepTool}
            theme={settings.theme}
            onToggleTheme={handleToggleTheme}
          />
        </div>

        {/* Main Scrollable Content Area: Vertical Only, Pop-In Animation */}
        <main
          ref={mainScrollRef}
          key={`${currentTab}-${featureSessionKey}`}
          className="flex-1 overflow-y-auto overflow-x-hidden p-4 pb-28 space-y-4 bg-white dark:bg-black transition-colors animate-pop-in"
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

          {/* Core Feature 1: Budget Tracker (Downbase Tables: Budget_Settings & Daily_Spending) */}
          {currentTab === 'budget' && (
            <BudgetTrackerTab
              onNavigateTab={(tab) => handleSelectTab(tab)}
              onGoBack={handleGoBack}
            />
          )}

          {/* Core Feature 2: BillGuard - Never Miss a Bill (Table: Bills) */}
          {currentTab === 'bills' && (
            <BillGuardTab
              onNavigateTab={(tab) => handleSelectTab(tab)}
              onGoBack={handleGoBack}
            />
          )}

          {/* Core Feature 3: DebtDestroyer - Snowball Payoff (Table: Debts) */}
          {currentTab === 'debt_destroyer' && (
            <DebtDestroyerTab
              onNavigateTab={(tab) => handleSelectTab(tab)}
              onGoBack={handleGoBack}
            />
          )}

          {/* Core Feature 4: ScoreBoost Lab - What If Simulator */}
          {currentTab === 'score_boost' && (
            <ScoreBoostLabTab
              initialScore={profile.baseScore}
              onNavigateTab={(tab) => handleSelectTab(tab)}
              onGoBack={handleGoBack}
            />
          )}

          {/* Core Feature 5: SubScrub - Subscription Killer (Table: Subscriptions) */}
          {currentTab === 'sub_scrub' && (
            <SubScrubTab
              onNavigateTab={(tab) => handleSelectTab(tab)}
              onGoBack={handleGoBack}
            />
          )}

          {/* Core Feature 6: MoneyStreak - 30 Day Challenge (Table: Challenges) */}
          {currentTab === 'money_streak' && (
            <MoneyStreakTab
              onNavigateTab={(tab) => handleSelectTab(tab)}
              onGoBack={handleGoBack}
            />
          )}

          {/* Sovereign Engine: Tracker Hub (All 17 Features Vertically Listed & Clickable) */}
          {currentTab === 'tracker' && (
            <TrackerHubTab
              userScore={profile.baseScore}
              onNavigateTab={(tab) => handleSelectTab(tab)}
            />
          )}

          {/* Inbuilt Feature 7: Emergency Fund Vault (Table: Emergency_Vault) */}
          {currentTab === 'emergency_vault' && (
            <EmergencyVaultTab
              onNavigateTab={(tab) => handleSelectTab(tab)}
              onGoBack={handleGoBack}
            />
          )}

          {/* Inbuilt Feature 8: Net Worth Ledger (Table: Net_Worth) */}
          {currentTab === 'net_worth' && (
            <NetWorthTab
              onNavigateTab={(tab) => handleSelectTab(tab)}
              onGoBack={handleGoBack}
            />
          )}

          {/* Inbuilt Feature 9: Credit Inquiry Shield (Table: Credit_Inquiries) */}
          {currentTab === 'inquiries_tracker' && (
            <InquiriesShieldTab
              onNavigateTab={(tab) => handleSelectTab(tab)}
              onGoBack={handleGoBack}
            />
          )}

          {/* Inbuilt Feature 10: Multi-Vault Savings Goals (Table: Savings_Goals) */}
          {currentTab === 'savings_goals' && (
            <SavingsGoalsTab
              onNavigateTab={(tab) => handleSelectTab(tab)}
              onGoBack={handleGoBack}
            />
          )}

          {/* Inbuilt Feature 11: FCRA 30-Day Dispute Clock (Table: Dispute_Cases) */}
          {currentTab === 'dispute_tracker' && (
            <DisputeClockTab
              onNavigateTab={(tab) => handleSelectTab(tab)}
              onGoBack={handleGoBack}
            />
          )}

          {/* Inbuilt Feature 12: APR Interest Bleed Monitor (Table: Interest_Bleed) */}
          {currentTab === 'interest_bleed' && (
            <InterestBleedTab
              onNavigateTab={(tab) => handleSelectTab(tab)}
              onGoBack={handleGoBack}
            />
          )}

          {/* Inbuilt Feature 13: Cash Flow Forecaster (Table: Cash_Flow) */}
          {currentTab === 'cash_flow' && (
            <CashFlowForecastTab
              onNavigateTab={(tab) => handleSelectTab(tab)}
              onGoBack={handleGoBack}
            />
          )}

          {/* Inbuilt Feature 14: Reward Points & Cashback Vault (Table: Reward_Programs) */}
          {currentTab === 'rewards_tracker' && (
            <RewardsVaultTab
              onNavigateTab={(tab) => handleSelectTab(tab)}
              onGoBack={handleGoBack}
            />
          )}

          {/* Inbuilt Feature 15: No-Spend Days Calendar & Streak (Table: No_Spend_Days) */}
          {currentTab === 'no_spend_tracker' && (
            <NoSpendCalendarTab
              onNavigateTab={(tab) => handleSelectTab(tab)}
              onGoBack={handleGoBack}
            />
          )}

          {/* Inbuilt Feature 16: Revolving Utilization Monitor (Revolving Ledger) */}
          {currentTab === 'utilization_tracker' && (
            <UtilizationMonitorTab
              onNavigateTab={(tab) => handleSelectTab(tab)}
              onGoBack={handleGoBack}
            />
          )}

          {/* Inbuilt Feature 17: Sinking Funds Allocator (Table: Sinking_Funds) */}
          {currentTab === 'sinking_funds' && (
            <SinkingFundsTab
              onNavigateTab={(tab) => handleSelectTab(tab)}
              onGoBack={handleGoBack}
            />
          )}

          {/* Screen 4: Track Score Real Graph */}
          {currentTab === 'track' && (
            <ScoreTrackChartTab currentProfileScore={profile.baseScore} />
          )}

          {/* Grocery Card Saver: Pure Math Calculator for US Supermarkets (12 Cards Sheet) */}
          {currentTab === 'grocery_saver' && (
            <GroceryCardSaverTab onBackToDashboard={handleGoBack} />
          )}

          {/* Feature 1: Credit Score Checker (User enters credit, app shows best cards they can get) */}
          {(currentTab === 'score' || currentTab === 'score_checker' || currentTab === 'credit_score_checker') && (
            <CreditScoreCheckerTab
              initialScore={profile.baseScore || 742}
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

          {/* Feature 5: Credit Myths & Realities Interactive Quiz */}
          {currentTab === 'credit_myths' && (
            <CreditMythsQuizTab onNavigateTab={(tab) => handleSelectTab(tab)} />
          )}

          {/* Specialized Problem-Solver 1: AZEO Statement Optimizer */}
          {currentTab === 'statement_optimizer' && (
            <StatementDateOptimizerTab
              cards={profile.cards}
              onToggleCardPaid={handleToggleCardPaid}
              onUpdateCardBalance={handleUpdateCardBalance}
              onOpenProfileModal={() => handleSelectTab('profile')}
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

          {/* Page 3: Tools / More Menu (With DebtDestroyer, SubScrub, MoneyStreak, ScoreBoost cards) */}
          {(currentTab === 'menu' || currentTab === 'more') && (
            <MenuPage
              onNavigate={(page) => handleSelectTab(page)}
              onOpenLegal={handleOpenLegal}
            />
          )}

          {/* Page 4: Profile Page */}
          {currentTab === 'profile' && (
            <ProfilePage
              profile={profile}
              onUpdateProfile={(updated) => setProfile(updated)}
              onResetToBlank={handleResetToBlank}
              onOpenAuthModal={() => setAuthModalOpen(true)}
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
              onNavigateTab={(tab) => handleSelectTab(tab)}
              onReopenWelcome={() => setShowWelcome(true)}
              onReplaySplash={() => setShowSplash(true)}
              onOpenAuthModal={() => setAuthModalOpen(true)}
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

          {/* Supabase Email/Password Authentication & Cloud Sync Page */}
          {currentTab === 'auth' && (
            <AuthPage
              onSkip={() => handleSelectTab('dashboard')}
              onSuccess={() => handleSelectTab('dashboard')}
            />
          )}
        </main>

        {/* Native Fixed Bottom Dock Navigation Bar */}
        <nav className="fixed bottom-0 left-0 right-0 z-40 flex justify-center no-print select-none">
          <div className="w-full max-w-xl h-16 bg-white/95 text-black dark:bg-black/95 dark:text-white backdrop-blur-md border-t border-neutral-200 dark:border-neutral-800 px-3 flex items-center justify-around shadow-lg transition-colors">
            {dockItems.map((item) => {
              const isActive = currentTab === item.id || (item.id === 'menu' && (currentTab === 'more' || currentTab === 'tools'));
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectTab(item.id)}
                  className={`flex flex-col items-center justify-center gap-1 px-3 py-1.5 transition-all cursor-pointer relative active:scale-95 ${
                    isActive
                      ? 'text-black dark:text-white font-black'
                      : 'text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white font-medium'
                  }`}
                >
                  {isActive && (
                    <span className="absolute top-0 w-8 h-1 rounded-full bg-black dark:bg-white shadow-xs" />
                  )}
                  <div className={`transition-transform duration-200 ${isActive ? 'scale-110 -translate-y-0.5' : ''}`}>
                    {item.icon}
                  </div>
                  <span className="text-[10px] tracking-tight">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Simple Privacy Policy, Terms of Use, and About Us Modal */}
      <FooterLegalModal
        isOpen={legalModalOpen}
        onClose={() => setLegalModalOpen(false)}
        initialTab={legalModalTab}
      />

      {/* Encrypted Vault Email/Password Authentication Modal */}
      <SupabaseAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        activeProfile={profile}
        onUpdateProfile={(updated: CreditProfile) => setProfile(updated)}
      />
    </div>
  );
}
