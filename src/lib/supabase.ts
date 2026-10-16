import { createClient, SupabaseClient, User, Session, AuthError } from '@supabase/supabase-js';

// Storage keys for user-configured Supabase project credentials
export const SUPABASE_URL_KEY = 'chidoniq_supabase_url';
export const SUPABASE_KEY_STORAGE = 'chidoniq_supabase_anon_key';
export const SUPABASE_LAST_SYNC_KEY = 'chidoniq_supabase_last_sync';

// Default / fallback placeholder credentials so client initialization never throws
const DEFAULT_FALLBACK_URL = 'https://chidoniq-project.supabase.co';
const DEFAULT_FALLBACK_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder_anon_key';

/**
 * Retrieve the active Supabase URL and Anon Key.
 * Priority:
 * 1. User runtime config from localStorage
 * 2. Vite environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
 * 3. Safe fallback defaults
 */
export function getSupabaseCredentials(): { url: string; anonKey: string; isConfigured: boolean; isCustom: boolean } {
  const envUrl = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_SUPABASE_URL : undefined;
  const envKey = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_SUPABASE_ANON_KEY : undefined;

  const localUrl = typeof window !== 'undefined' ? localStorage.getItem(SUPABASE_URL_KEY) : null;
  const localKey = typeof window !== 'undefined' ? localStorage.getItem(SUPABASE_KEY_STORAGE) : null;

  // 1. Live environment variables from project configuration
  if (envUrl && envKey && envUrl.startsWith('https://') && !envUrl.includes('placeholder') && !envUrl.includes('your-project')) {
    return {
      url: envUrl.trim(),
      anonKey: envKey.trim(),
      isConfigured: true,
      isCustom: false,
    };
  }

  // 2. User-entered credentials in browser local storage
  if (localUrl && localKey && localUrl.startsWith('https://') && !localUrl.includes('placeholder')) {
    return {
      url: localUrl.trim(),
      anonKey: localKey.trim(),
      isConfigured: true,
      isCustom: true,
    };
  }

  return {
    url: envUrl || DEFAULT_FALLBACK_URL,
    anonKey: envKey || DEFAULT_FALLBACK_KEY,
    isConfigured: false,
    isCustom: false,
  };
}

let activeClient: SupabaseClient | null = null;
let currentClientUrl = '';
let currentClientKey = '';

/**
 * Get or initialize the Supabase client instance.
 * Automatically recreates client if credentials change.
 */
export function getSupabaseClient(): SupabaseClient {
  const { url, anonKey } = getSupabaseCredentials();

  if (!activeClient || currentClientUrl !== url || currentClientKey !== anonKey) {
    activeClient = createClient(url, anonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        storageKey: 'chidoniq_supabase_auth_session',
      },
    });
    currentClientUrl = url;
    currentClientKey = anonKey;
  }

  return activeClient;
}

/**
 * Persist custom Supabase credentials from the UI
 */
export function saveSupabaseCredentials(url: string, anonKey: string): void {
  const cleanUrl = url.trim().replace(/\/+$/, '');
  const cleanKey = anonKey.trim();
  localStorage.setItem(SUPABASE_URL_KEY, cleanUrl);
  localStorage.setItem(SUPABASE_KEY_STORAGE, cleanKey);
  // Invalidate cached client to recreate on next call
  activeClient = null;
  currentClientUrl = '';
  currentClientKey = '';
}

/**
 * Clear custom credentials and revert to env defaults
 */
export function clearSupabaseCredentials(): void {
  localStorage.removeItem(SUPABASE_URL_KEY);
  localStorage.removeItem(SUPABASE_KEY_STORAGE);
  activeClient = null;
  currentClientUrl = '';
  currentClientKey = '';
}

// Export singleton client for direct imports
export const supabase = getSupabaseClient();
export type { User, Session, AuthError };
