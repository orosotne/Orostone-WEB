import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';

// Supabase konfigurácia — credentials MUSIA byť v .env súbore
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Kontrola prítomnosti env premenných
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Supabase] Chýbajú environment premenné VITE_SUPABASE_URL a/alebo VITE_SUPABASE_ANON_KEY. ' +
    'Supabase funkcie nebudú dostupné. Skopírujte .env.example do .env a vyplňte hodnoty.'
  );
}

// Vytvoríme klienta len ak sú credentials k dispozícii, inak dummy klienta
export const supabase: SupabaseClient<Database> = supabaseUrl && supabaseAnonKey
  ? createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : createClient<Database>('https://placeholder.supabase.co', 'placeholder-key', {
      auth: { persistSession: false },
    });

// Helper pre kontrolu či je Supabase nakonfigurovaný
export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.includes('supabase.co') &&
    supabaseAnonKey.startsWith('eyJ')
  );
};

