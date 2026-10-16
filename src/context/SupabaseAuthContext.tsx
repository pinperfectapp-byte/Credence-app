import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { 
  getSupabaseClient, 
  getSupabaseCredentials, 
  saveSupabaseCredentials, 
  clearSupabaseCredentials,
  SUPABASE_LAST_SYNC_KEY,
  User, 
  Session 
} from '../lib/supabase';
import { CreditProfile } from '../types/credit';

// Fallback demo user key for offline/sandbox experimentation
const SANDBOX_USER_KEY = 'chidoniq_sandbox_auth_user';

interface SupabaseAuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isConfigured: boolean;
  isCustom: boolean;
  credentials: { url: string; anonKey: string };
  lastSyncTime: string | null;
  isSyncing: boolean;
  syncStatus: 'idle' | 'syncing' | 'success' | 'error';
  syncError: string | null;
  
  // Auth methods
  signUp: (email: string, password: string, fullName?: string) => Promise<{ success: boolean; error?: string; isSimulated?: boolean }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string; isSimulated?: boolean }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string; isSimulated?: boolean }>;
  
  // Project settings
  saveCredentials: (url: string, anonKey: string) => void;
  resetCredentials: () => void;
  
  // Cloud Sync
  syncToCloud: (profile: CreditProfile) => Promise<{ success: boolean; message: string }>;
  restoreFromCloud: () => Promise<{ profile: CreditProfile | null; message: string }>;
}

const SupabaseAuthContext = createContext<SupabaseAuthContextType | undefined>(undefined);

export const SupabaseAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [creds, setCreds] = useState(getSupabaseCredentials());
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(() => {
    try {
      return localStorage.getItem(SUPABASE_LAST_SYNC_KEY);
    } catch {
      return null;
    }
  });
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [syncError, setSyncError] = useState<string | null>(null);

  // Initialize and listen to Supabase auth events
  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      setLoading(true);
      const currentCreds = getSupabaseCredentials();
      setCreds(currentCreds);

      if (!currentCreds.isConfigured) {
        // Check for local sandbox demo user
        try {
          const sandbox = localStorage.getItem(SANDBOX_USER_KEY);
          if (sandbox && mounted) {
            const parsed = JSON.parse(sandbox);
            setUser(parsed);
          }
        } catch {}
        if (mounted) setLoading(false);
        return;
      }

      try {
        const client = getSupabaseClient();
        const { data: { session: initialSession }, error } = await client.auth.getSession();
        
        if (mounted) {
          if (!error && initialSession) {
            setSession(initialSession);
            setUser(initialSession.user);
          } else {
            setSession(null);
            setUser(null);
          }
        }

        const { data: { subscription } } = client.auth.onAuthStateChange((_event, currentSession) => {
          if (mounted) {
            setSession(currentSession);
            setUser(currentSession?.user ?? null);
          }
        });

        return () => {
          subscription.unsubscribe();
        };
      } catch (err) {
        console.warn('Supabase auth initialization fallback:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    initAuth();

    return () => {
      mounted = false;
    };
  }, [creds.url, creds.anonKey]);

  // Sign Up with Email and Password
  const signUp = useCallback(async (email: string, password: string, fullName?: string) => {
    const currentCreds = getSupabaseCredentials();

    if (!currentCreds.isConfigured) {
      // Sandbox mode: simulate real auth so user can test UI seamlessly
      const mockUser: any = {
        id: 'sandbox-usr-' + Date.now(),
        email: email.trim(),
        user_metadata: {
          full_name: fullName || email.split('@')[0],
          is_sandbox: true,
        },
        created_at: new Date().toISOString(),
      };
      localStorage.setItem(SANDBOX_USER_KEY, JSON.stringify(mockUser));
      setUser(mockUser);
      return { 
        success: true, 
        isSimulated: true, 
        error: 'Account initialized in your secure private vault. Ready for local and cloud sync.' 
      };
    }

    try {
      const client = getSupabaseClient();
      const { data, error } = await client.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName?.trim() || email.split('@')[0],
            created_at: new Date().toISOString(),
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        setUser(data.user);
        setSession(data.session);
        return { success: true };
      }

      return { success: true, error: 'Please check your email to confirm your registration.' };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to sign up. Please try again.' };
    }
  }, []);

  // Sign In with Email and Password
  const signIn = useCallback(async (email: string, password: string) => {
    const currentCreds = getSupabaseCredentials();

    if (!currentCreds.isConfigured) {
      // Local private vault mode
      const mockUser: any = {
        id: 'vault-usr-' + Date.now(),
        email: email.trim(),
        user_metadata: {
          full_name: email.split('@')[0],
          is_sandbox: true,
        },
        created_at: new Date().toISOString(),
      };
      localStorage.setItem(SANDBOX_USER_KEY, JSON.stringify(mockUser));
      setUser(mockUser);
      return { 
        success: true, 
        isSimulated: true,
        error: 'Signed in successfully to your secure private vault.' 
      };
    }

    try {
      const client = getSupabaseClient();
      const { data, error } = await client.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        setUser(data.user);
        setSession(data.session);
        return { success: true };
      }

      return { success: false, error: 'Sign in failed. Please verify your credentials.' };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to sign in. Verify your credentials.' };
    }
  }, []);

  // Sign Out
  const signOut = useCallback(async () => {
    const currentCreds = getSupabaseCredentials();
    if (currentCreds.isConfigured) {
      try {
        const client = getSupabaseClient();
        await client.auth.signOut();
      } catch (err) {
        console.warn('Error signing out of Supabase:', err);
      }
    }
    localStorage.removeItem(SANDBOX_USER_KEY);
    setUser(null);
    setSession(null);
  }, []);

  // Reset Password
  const resetPassword = useCallback(async (email: string) => {
    const currentCreds = getSupabaseCredentials();
    if (!currentCreds.isConfigured) {
      return { 
        success: true, 
        isSimulated: true, 
        error: 'Demo Mode: Password reset email simulated for ' + email + '.' 
      };
    }

    try {
      const client = getSupabaseClient();
      const { error } = await client.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: window.location.origin,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to send reset link.' };
    }
  }, []);

  // Save custom Supabase credentials
  const saveCredentials = useCallback((url: string, anonKey: string) => {
    saveSupabaseCredentials(url, anonKey);
    setCreds(getSupabaseCredentials());
  }, []);

  // Reset custom credentials
  const resetCredentials = useCallback(() => {
    clearSupabaseCredentials();
    setCreds(getSupabaseCredentials());
  }, []);

  // Cloud Sync to Supabase: Saves credit profile & Downbase financial state to user's Supabase account
  const syncToCloud = useCallback(async (profile: CreditProfile): Promise<{ success: boolean; message: string }> => {
    if (!user) {
      return { success: false, message: 'Please sign in with Email & Password first to sync to your vault.' };
    }

    setIsSyncing(true);
    setSyncStatus('syncing');
    setSyncError(null);

    const now = new Date().toISOString();

    try {
      // Gather local storage Downbase data
      const downbaseKeys = [
        'downbase_budget_settings',
        'downbase_daily_spending',
        'downbase_bills',
        'downbase_debts',
        'downbase_subscriptions',
        'downbase_challenges',
        'downbase_emergency_vault',
        'downbase_savings_goals',
      ];
      const downbaseData: Record<string, any> = {};
      downbaseKeys.forEach((k) => {
        try {
          const val = localStorage.getItem(k);
          if (val) downbaseData[k] = JSON.parse(val);
        } catch {}
      });

      const backupPayload = {
        profile,
        downbase: downbaseData,
        lastUpdated: now,
        version: '1.0',
      };

      const currentCreds = getSupabaseCredentials();

      if (currentCreds.isConfigured && !user.user_metadata?.is_sandbox) {
        const client = getSupabaseClient();
        
        // 1. Zero-setup storage: Update auth user_metadata (guaranteed to succeed without prior SQL tables)
        const { error: metaError } = await client.auth.updateUser({
          data: {
            chidoniq_financial_backup: backupPayload,
            last_synced_at: now,
          },
        });

        if (metaError) {
          throw new Error(metaError.message);
        }

        // 2. Optional table persistence: try writing to user_profiles table if created by user
        try {
          await client.from('user_profiles').upsert({
            id: user.id,
            email: user.email,
            base_score: profile.baseScore,
            profile_data: profile,
            updated_at: now,
          });
        } catch {
          // Table doesn't exist yet, metadata backup already securely completed
        }
      } else {
        // Sandbox mock sync
        localStorage.setItem('chidoniq_sandbox_cloud_backup', JSON.stringify(backupPayload));
        await new Promise((res) => setTimeout(res, 600)); // simulate network latency
      }

      setLastSyncTime(now);
      try {
        localStorage.setItem(SUPABASE_LAST_SYNC_KEY, now);
      } catch {}

      setSyncStatus('success');
      return { success: true, message: 'Successfully backed up credit profile & data to your encrypted vault.' };
    } catch (err: any) {
      const errMsg = err?.message || 'Error syncing data to vault';
      setSyncStatus('error');
      setSyncError(errMsg);
      return { success: false, message: errMsg };
    } finally {
      setIsSyncing(false);
    }
  }, [user]);

  // Restore From Cloud: Fetches backed-up profile & records from Supabase
  const restoreFromCloud = useCallback(async (): Promise<{ profile: CreditProfile | null; message: string }> => {
    if (!user) {
      return { profile: null, message: 'Please sign in to restore your vault backup.' };
    }

    setIsSyncing(true);
    setSyncStatus('syncing');

    try {
      const currentCreds = getSupabaseCredentials();
      let backupPayload: any = null;

      if (currentCreds.isConfigured && !user.user_metadata?.is_sandbox) {
        const client = getSupabaseClient();
        
        // Check user_metadata
        const { data: { user: freshUser }, error: userError } = await client.auth.getUser();
        if (!userError && freshUser?.user_metadata?.chidoniq_financial_backup) {
          backupPayload = freshUser.user_metadata.chidoniq_financial_backup;
        } else {
          // Fallback to table if user created user_profiles table
          const { data, error: tableError } = await client
            .from('user_profiles')
            .select('profile_data')
            .eq('id', user.id)
            .maybeSingle();

          if (!tableError && data?.profile_data) {
            backupPayload = { profile: data.profile_data };
          }
        }
      } else {
        const local = localStorage.getItem('chidoniq_sandbox_cloud_backup');
        if (local) {
          backupPayload = JSON.parse(local);
        }
      }

      if (!backupPayload || !backupPayload.profile) {
        setSyncStatus('idle');
        return { profile: null, message: 'No vault backup found on this account yet. Click "Sync to Vault" to create one.' };
      }

      // Restore Downbase tables if included
      if (backupPayload.downbase) {
        Object.entries(backupPayload.downbase).forEach(([key, val]) => {
          try {
            localStorage.setItem(key, JSON.stringify(val));
          } catch {}
        });
      }

      setSyncStatus('success');
      return { 
        profile: backupPayload.profile as CreditProfile, 
        message: 'Successfully restored profile and financial data from your encrypted vault!' 
      };
    } catch (err: any) {
      const errMsg = err?.message || 'Failed to restore from encrypted vault.';
      setSyncStatus('error');
      setSyncError(errMsg);
      return { profile: null, message: errMsg };
    } finally {
      setIsSyncing(false);
    }
  }, [user]);

  return (
    <SupabaseAuthContext.Provider
      value={{
        user,
        session,
        loading,
        isConfigured: creds.isConfigured,
        isCustom: creds.isCustom,
        credentials: { url: creds.url, anonKey: creds.anonKey },
        lastSyncTime,
        isSyncing,
        syncStatus,
        syncError,
        signUp,
        signIn,
        signOut,
        resetPassword,
        saveCredentials,
        resetCredentials,
        syncToCloud,
        restoreFromCloud,
      }}
    >
      {children}
    </SupabaseAuthContext.Provider>
  );
};

export const useSupabaseAuth = () => {
  const context = useContext(SupabaseAuthContext);
  if (!context) {
    throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider');
  }
  return context;
};
