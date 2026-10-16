import React, { useState } from 'react';
import { 
  Mail, 
  Lock, 
  User as UserIcon, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ChevronRight,
  Sun,
  Moon,
  KeyRound,
  Shield
} from 'lucide-react';
import { useSupabaseAuth } from '../context/SupabaseAuthContext';
import { ChidoniqLogo } from './ChidoniqLogo';

interface AuthPageProps {
  onSuccess?: () => void;
  onSkip: () => void;
  initialMode?: 'signin' | 'signup';
}

export const AuthPage: React.FC<AuthPageProps> = ({
  onSuccess,
  onSkip,
  initialMode = 'signin',
}) => {
  const { 
    signIn, 
    signUp, 
    resetPassword, 
    user, 
    signOut 
  } = useSupabaseAuth();

  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Theme toggle on Auth Screen
  const [isDark, setIsDark] = useState<boolean>(() => {
    return document.documentElement.classList.contains('dark');
  });

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      localStorage.setItem('chidoniq_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.setItem('chidoniq_theme', 'light');
    }
  };

  // If already logged in, show authenticated member status and continue button
  if (user) {
    return (
      <div className="min-h-screen w-full bg-white text-black dark:bg-black dark:text-white flex flex-col items-center justify-center p-4 selection:bg-blue-600 selection:text-white transition-colors">
        <div className="w-full max-w-md bg-white dark:bg-black border border-neutral-300 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-xl text-center space-y-6 animate-pop-in">
          <div className="flex justify-center">
            <ChidoniqLogo size={52} animated={false} />
          </div>

          <div className="space-y-1">
            <h1 className="text-xl font-black tracking-tight text-black dark:text-white uppercase font-sans">
              CHIDONIQ Vault Account
            </h1>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              Authenticated &amp; Encrypted
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center gap-3 text-left">
            <div className="w-12 h-12 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-bold text-lg shrink-0 shadow-md">
              {user.email ? user.email[0].toUpperCase() : 'U'}
            </div>
            <div className="overflow-hidden">
              <div className="text-sm font-bold text-black dark:text-white truncate">
                {user.user_metadata?.full_name || 'CHIDONIQ Member'}
              </div>
              <div className="text-xs text-neutral-600 dark:text-neutral-400 font-mono truncate">
                {user.email}
              </div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active Vault Sync
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={onSuccess || onSkip}
              className="w-full py-3 px-4 rounded-xl bg-black text-white dark:bg-white dark:text-black hover:opacity-90 font-bold text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all active:scale-[0.98]"
            >
              <span>Continue to Financial Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={signOut}
              className="w-full py-2.5 px-4 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 text-xs font-semibold cursor-pointer transition-colors"
            >
              Sign Out &amp; Switch Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setFeedback({ type: 'error', text: 'Please enter both your email address and password.' });
      return;
    }

    setLoading(true);
    setFeedback(null);
    try {
      const res = await signIn(email, password);
      if (res.success) {
        setFeedback({ type: 'success', text: 'Welcome back! Signed into your vault.' });
        setTimeout(() => {
          if (onSuccess) onSuccess();
          else onSkip();
        }, 600);
      } else {
        setFeedback({ type: 'error', text: res.error || 'Invalid email or password.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setFeedback({ type: 'error', text: 'Email and password are required.' });
      return;
    }
    if (password.length < 6) {
      setFeedback({ type: 'error', text: 'Password must be at least 6 characters long.' });
      return;
    }
    if (password !== confirmPassword) {
      setFeedback({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    setLoading(true);
    setFeedback(null);
    try {
      const res = await signUp(email, password, fullName);
      if (res.success) {
        setFeedback({ type: 'success', text: 'Account created successfully! Loading your vault...' });
        setTimeout(() => {
          if (onSuccess) onSuccess();
          else onSkip();
        }, 800);
      } else {
        setFeedback({ type: 'error', text: res.error || 'Registration failed. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setFeedback({ type: 'error', text: 'Please enter your email address to receive password reset instructions.' });
      return;
    }

    setLoading(true);
    setFeedback(null);
    try {
      const res = await resetPassword(email);
      if (res.success) {
        setFeedback({ type: 'success', text: `Password recovery link sent to ${email}. Please check your inbox.` });
      } else {
        setFeedback({ type: 'error', text: res.error || 'Failed to send recovery link.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white text-black dark:bg-black dark:text-white flex flex-col items-center justify-center p-4 sm:p-6 selection:bg-blue-600 selection:text-white font-sans antialiased transition-colors">
      
      {/* Top Bar with Theme Switcher */}
      <div className="absolute top-4 right-4 z-20">
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-800 transition-all cursor-pointer shadow-xs"
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle Theme"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-neutral-700" />}
        </button>
      </div>

      {/* Main Auth Card */}
      <div className="relative w-full max-w-md bg-white dark:bg-black border border-neutral-300 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-pop-in">
        
        {/* Top Header: Logo + App Name + Security Vault Badge */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <ChidoniqLogo size={52} animated={false} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-black dark:text-white uppercase font-sans">
              CHIDONIQ
            </h1>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">
              Sovereign Financial Utility • Credit &amp; Budget Tracker
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-700 dark:text-neutral-300 font-medium">
            <KeyRound className="w-3.5 h-3.5 text-sky-500" />
            <span>Encrypted Vault Authentication</span>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 animate-fade-in ${
            feedback.type === 'success' 
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800 dark:bg-emerald-950/60 dark:border-emerald-500/40 dark:text-emerald-200' 
              : feedback.type === 'error'
              ? 'bg-rose-50 border-rose-300 text-rose-800 dark:bg-rose-950/60 dark:border-rose-500/40 dark:text-rose-200'
              : 'bg-neutral-100 border-neutral-300 text-neutral-800 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-200'
          }`}>
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            )}
            <div className="flex-1 leading-relaxed">{feedback.text}</div>
          </div>
        )}

        {/* Tab Switcher (Sign In vs Create Account) */}
        {mode !== 'forgot' && (
          <div className="flex items-center p-1 bg-neutral-100 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800">
            <button
              type="button"
              onClick={() => { setMode('signin'); setFeedback(null); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                mode === 'signin'
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
                  : 'text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setFeedback(null); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                mode === 'signup'
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
                  : 'text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {/* MODE 1: Sign In Form */}
        {mode === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-800 dark:text-neutral-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-xl pl-10 pr-3 py-2.5 text-sm text-black dark:text-white placeholder-neutral-400 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-neutral-800 dark:text-neutral-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => { setMode('forgot'); setFeedback(null); }}
                  className="text-[11px] text-sky-600 dark:text-sky-400 hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-xl pl-10 pr-10 py-2.5 text-sm text-black dark:text-white placeholder-neutral-400 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-black text-white dark:bg-white dark:text-black hover:opacity-90 font-bold text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all disabled:opacity-50 active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* MODE 2: Sign Up Form */}
        {mode === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-neutral-800 dark:text-neutral-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-xl pl-10 pr-3 py-2.5 text-sm text-black dark:text-white placeholder-neutral-400 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-800 dark:text-neutral-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-xl pl-10 pr-3 py-2.5 text-sm text-black dark:text-white placeholder-neutral-400 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-800 dark:text-neutral-300 mb-1">
                Password (min. 6 characters)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-xl pl-10 pr-10 py-2.5 text-sm text-black dark:text-white placeholder-neutral-400 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-800 dark:text-neutral-300 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-xl pl-10 pr-3 py-2.5 text-sm text-black dark:text-white placeholder-neutral-400 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-black text-white dark:bg-white dark:text-black hover:opacity-90 font-bold text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all disabled:opacity-50 active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Free Vault Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* MODE 3: Forgot Password Form */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-black dark:text-white">
                Reset Password
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                Enter your account email. We will send a secure password recovery link to your inbox.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-800 dark:text-neutral-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-xl pl-10 pr-3 py-2.5 text-sm text-black dark:text-white placeholder-neutral-400 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-black text-white dark:bg-white dark:text-black font-bold text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Send Recovery Email'}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => { setMode('signin'); setFeedback(null); }}
                className="text-xs text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white underline cursor-pointer"
              >
                Back to Sign In
              </button>
            </div>
          </form>
        )}

        {/* WORKING SKIP BUTTON */}
        <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 text-center space-y-2">
          <button
            type="button"
            onClick={onSkip}
            className="w-full py-3 px-4 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-black dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-white border border-neutral-300 dark:border-neutral-700 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-[0.98]"
          >
            <span>Skip for now (Continue as Guest)</span>
            <ChevronRight className="w-4 h-4 text-neutral-500" />
          </button>
          
          <p className="text-[11px] text-neutral-500 leading-tight">
            You can use all 17 features offline. Sign in anytime from the menu to sync your data.
          </p>
        </div>

        {/* Security & Zero SSN Guarantee */}
        <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-neutral-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Zero SSN Required • 256-Bit Encrypted Sovereign Storage</span>
        </div>

      </div>

    </div>
  );
};
