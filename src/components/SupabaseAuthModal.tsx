import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User as UserIcon, 
  CheckCircle2, 
  AlertCircle, 
  LogOut, 
  RefreshCw, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  ArrowRight,
  Database,
  KeyRound,
  Shield,
  ChevronRight
} from 'lucide-react';
import { CreditProfile } from '../types/credit';
import { useSupabaseAuth } from '../context/SupabaseAuthContext';
import { ChidoniqLogo } from './ChidoniqLogo';
import { validateRealEmail, validateStrongPassword, isGoogleGmail } from '../utils/authValidator';

interface SupabaseAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeProfile: CreditProfile;
  onProfileRestored?: (restoredProfile: CreditProfile) => void;
  onUpdateProfile?: (updatedProfile: CreditProfile) => void;
}

export const SupabaseAuthModal: React.FC<SupabaseAuthModalProps> = ({
  isOpen,
  onClose,
  activeProfile,
  onProfileRestored,
  onUpdateProfile,
}) => {
  const { 
    user, 
    session, 
    loading, 
    isConfigured, 
    credentials, 
    lastSyncTime, 
    isSyncing,
    signIn, 
    signUp, 
    signOut, 
    resetPassword, 
    syncToCloud, 
    restoreFromCloud
  } = useSupabaseAuth();

  const [activeTab, setActiveTab] = useState<'signin' | 'signup' | 'forgot' | 'custom_creds'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Custom URL & Anon Key fields
  const [customUrl, setCustomUrl] = useState(credentials.url || '');
  const [customKey, setCustomKey] = useState(credentials.anonKey || '');
  
  // UI action states
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  if (!isOpen) return null;

  // Handle Sign In
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setFeedback({ type: 'error', message: 'Please enter both your email address and password.' });
      return;
    }

    const emailCheck = validateRealEmail(email);
    if (!emailCheck.valid) {
      setFeedback({ type: 'error', message: emailCheck.error || 'Please provide a valid authentic email.' });
      return;
    }

    setActionLoading(true);
    setFeedback(null);
    try {
      const res = await signIn(email, password);
      if (res.success) {
        setFeedback({ 
          type: 'success', 
          message: 'Welcome back! Signed in to your encrypted vault.' 
        });
        setTimeout(() => {
          onClose();
        }, 600);
      } else {
        setFeedback({ type: 'error', message: res.error || 'Invalid credentials. Please verify your password.' });
      }
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Sign Up
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setFeedback({ type: 'error', message: 'Email and strong password are required.' });
      return;
    }

    const emailCheck = validateRealEmail(email);
    if (!emailCheck.valid) {
      setFeedback({ type: 'error', message: emailCheck.error || 'Please enter a valid authentic email (e.g. name@gmail.com).' });
      return;
    }

    const passCheck = validateStrongPassword(password);
    if (!passCheck.valid) {
      setFeedback({ type: 'error', message: passCheck.error || 'Strong password required: minimum 8 characters with letters & numbers.' });
      return;
    }

    if (password !== confirmPassword) {
      setFeedback({ type: 'error', message: 'Passwords do not match.' });
      return;
    }

    setActionLoading(true);
    setFeedback(null);
    try {
      const res = await signUp(email, password, fullName);
      if (res.success) {
        setFeedback({ 
          type: 'success', 
          message: 'Account created! Authenticated immediately without confirmation.' 
        });
        setTimeout(() => {
          onClose();
        }, 700);
      } else {
        setFeedback({ type: 'error', message: res.error || 'Registration failed.' });
      }
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Forgot Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setFeedback({ type: 'error', message: 'Please enter your account email address.' });
      return;
    }

    setActionLoading(true);
    setFeedback(null);
    try {
      const res = await resetPassword(email);
      if (res.success) {
        setFeedback({ 
          type: 'success', 
          message: res.error || `Password recovery link sent to ${email}. Check your inbox.` 
        });
      } else {
        setFeedback({ type: 'error', message: res.error || 'Failed to send recovery link.' });
      }
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Sync Now
  const handleManualSync = async () => {
    setFeedback(null);
    const res = await syncToCloud(activeProfile);
    setFeedback({
      type: res.success ? 'success' : 'error',
      message: res.message
    });
  };

  // Handle Restore Now
  const handleManualRestore = async () => {
    setFeedback(null);
    const res = await restoreFromCloud();
    if (res.profile) {
      if (onProfileRestored) onProfileRestored(res.profile);
      if (onUpdateProfile) onUpdateProfile(res.profile);
    }
    setFeedback({
      type: res.profile ? 'success' : 'error',
      message: res.message
    });
  };

  const formatLastSync = (timestamp: string | null) => {
    if (!timestamp) return 'Never';
    try {
      return new Date(timestamp).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return timestamp;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-pop-in select-none">
      <div className="relative w-full max-w-md bg-white dark:bg-black border border-neutral-300 dark:border-neutral-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Top Header */}
        <div className="p-5 pb-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ChidoniqLogo size={28} animated={false} />
            <div>
              <h2 className="text-base font-bold text-black dark:text-white flex items-center gap-2">
                CHIDONIQ Vault Account
                <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 px-2 py-0.5 rounded-full font-semibold">
                  256-Bit Encrypted
                </span>
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Email / Password Authentication &amp; Sovereign Vault Sync
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-xl transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div className={`mx-5 mt-4 p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
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
            <div className="flex-1 leading-relaxed">{feedback.message}</div>
          </div>
        )}

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4">

          {/* User is Authenticated */}
          {user ? (
            <div className="space-y-4">
              {/* Account Summary Card */}
              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-bold text-lg shadow-md">
                    {user.email ? user.email[0].toUpperCase() : 'U'}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-black dark:text-white flex items-center gap-2">
                      {user.user_metadata?.full_name || activeProfile.name || 'CHIDONIQ Member'}
                    </div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">
                      {user.email}
                    </div>
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Active Vault Sync
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={signOut}
                  className="px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-rose-50 hover:text-rose-600 dark:bg-neutral-800 dark:hover:bg-rose-950/40 text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>

              {/* Vault Sync Status & Actions */}
              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                    <div>
                      <h4 className="text-xs font-bold text-black dark:text-white uppercase tracking-wider">
                        Encrypted Vault Sync
                      </h4>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                        Last Backup: <span className="text-neutral-800 dark:text-neutral-200 font-medium">{formatLastSync(lastSyncTime)}</span>
                      </p>
                    </div>
                  </div>
                  {isSyncing && (
                    <div className="flex items-center gap-1 text-xs text-sky-500">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Syncing...</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleManualSync}
                    disabled={isSyncing}
                    className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-all disabled:opacity-50"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Sync to Vault Now</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleManualRestore}
                    disabled={isSyncing}
                    className="py-2.5 px-3 rounded-xl bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-black dark:text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-neutral-300 dark:border-neutral-700 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Database className="w-3.5 h-3.5" />
                    <span>Restore from Vault</span>
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2.5 rounded-xl bg-black dark:bg-white text-white dark:text-black font-bold text-xs cursor-pointer hover:opacity-90 transition-all"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* User NOT Authenticated: Tabs for Sign In / Sign Up */
            <div className="space-y-4">
              {/* Tab Navigation */}
              {activeTab !== 'forgot' && (
                <div className="flex items-center p-1 bg-neutral-100 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800">
                  <button
                    type="button"
                    onClick={() => { setActiveTab('signin'); setFeedback(null); }}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      activeTab === 'signin'
                        ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                        : 'text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => { setActiveTab('signup'); setFeedback(null); }}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      activeTab === 'signup'
                        ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                        : 'text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white'
                    }`}
                  >
                    Create Account
                  </button>
                </div>
              )}

              {/* Sign In Form */}
              {activeTab === 'signin' && (
                <form onSubmit={handleSignIn} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-800 dark:text-neutral-300 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-3 pointer-events-none" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@domain.com"
                        className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-xl pl-9 pr-3 py-2 text-xs text-black dark:text-white placeholder-neutral-400 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
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
                        onClick={() => { setActiveTab('forgot'); setFeedback(null); }}
                        className="text-[11px] text-sky-600 dark:text-sky-400 hover:underline cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-3 pointer-events-none" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-xl pl-9 pr-9 py-2 text-xs text-black dark:text-white placeholder-neutral-400 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="w-full py-2.5 px-4 rounded-xl bg-black text-white dark:bg-white dark:text-black hover:opacity-90 font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-all disabled:opacity-50"
                  >
                    {actionLoading ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Signing in...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Sign Up Form */}
              {activeTab === 'signup' && (
                <form onSubmit={handleSignUp} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-800 dark:text-neutral-300 mb-1">
                      Full Name (Optional)
                    </label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-neutral-400 absolute left-3 top-3 pointer-events-none" />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-xl pl-9 pr-3 py-2 text-xs text-black dark:text-white placeholder-neutral-400 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-800 dark:text-neutral-300 mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-3 pointer-events-none" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@domain.com"
                        className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-xl pl-9 pr-3 py-2 text-xs text-black dark:text-white placeholder-neutral-400 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-800 dark:text-neutral-300 mb-1">
                      Strong Password * (Min. 8 chars, letters &amp; numbers)
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-3 pointer-events-none" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-xl pl-9 pr-9 py-2 text-xs text-black dark:text-white placeholder-neutral-400 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-800 dark:text-neutral-300 mb-1">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-3 pointer-events-none" />
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-xl pl-9 pr-3 py-2 text-xs text-black dark:text-white placeholder-neutral-400 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="w-full py-2.5 px-4 rounded-xl bg-black text-white dark:bg-white dark:text-black hover:opacity-90 font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-all disabled:opacity-50"
                  >
                    {actionLoading ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Creating account...</span>
                      </>
                    ) : (
                      <>
                        <span>Create Free Vault Account</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Forgot Password Form */}
              {activeTab === 'forgot' && (
                <form onSubmit={handleResetPassword} className="space-y-3.5">
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold text-black dark:text-white">
                      Password Recovery
                    </h3>
                    <p className="text-[11px] text-neutral-500">
                      Enter the email address registered with your vault account. We'll send you a password recovery link.
                    </p>
                  </div>

                  <div>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-3 pointer-events-none" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@domain.com"
                        className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-xl pl-9 pr-3 py-2 text-xs text-black dark:text-white placeholder-neutral-400 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="w-full py-2.5 px-4 rounded-xl bg-black text-white dark:bg-white dark:text-black hover:opacity-90 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                  >
                    {actionLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Send Recovery Link'}
                  </button>

                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={() => { setActiveTab('signin'); setFeedback(null); }}
                      className="text-xs text-neutral-500 hover:text-black dark:hover:text-white underline cursor-pointer"
                    >
                      Back to Sign In
                    </button>
                  </div>
                </form>
              )}

              {/* Working Skip Button Inside Modal */}
              <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2.5 px-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-black dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-white border border-neutral-200 dark:border-neutral-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>Skip for Now (Continue as Guest)</span>
                  <ChevronRight className="w-4 h-4 text-neutral-400" />
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Note */}
        <div className="p-3 bg-neutral-50 dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-500 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Zero SSN Required • 100% Sovereign Privacy</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-500 hover:text-black dark:hover:text-white font-medium cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
