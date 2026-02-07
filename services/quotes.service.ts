import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { uploadQuoteFiles } from './storage.service';
import type { 
  CustomerInsert, 
  QuoteInsert, 
  QuoteFormData,
  Customer,
  Quote 
} from '../types/database.types';

// ===========================================
// QUOTE SERVICE
// ===========================================

export interface SubmitQuoteResult {
  success: boolean;
  quoteId?: string;
  error?: string;
}

/**
 * Odošle kompletný dopyt do Supabase
 * 1. Vytvorí/nájde zákazníka
 * 2. Vytvorí dopyt
 * 3. Nahrá súbory (ak existujú)
 */
export async function submitQuote(formData: QuoteFormData): Promise<SubmitQuoteResult> {
  // Kontrola či je Supabase nakonfigurovaný
  if (!isSupabaseConfigured()) {
    console.warn('Supabase nie je nakonfigurovaný - simulujem odoslanie');
    // Simulácia pre development bez Supabase
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, quoteId: 'demo-' + Date.now() });
      }, 1500);
    });
  }

  try {
    // 1. Vytvor alebo nájdi zákazníka
    const customer = await findOrCreateCustomer({
      email: formData.email,
      name: formData.name,
      phone: formData.phone || undefined,
    });

    if (!customer) {
      return { success: false, error: 'Nepodarilo sa vytvoriť zákazníka' };
    }

    // 2. Vytvor dopyt
    const quoteData: QuoteInsert = {
      customer_id: customer.id,
      project_type: 'Dopyt z webu',
      dimensions: formData.description || undefined,
    };

    const { data: quote, error: quoteError } = await supabase
      .from('quotes')
      .insert(quoteData)
      .select()
      .single();

    if (quoteError || !quote) {
      console.error('Error creating quote:', quoteError);
      return { success: false, error: 'Nepodarilo sa vytvoriť dopyt' };
    }

    // 3. Nahraj súbory (ak existujú)
    if (formData.files && formData.files.length > 0) {
      const uploadResult = await uploadQuoteFiles(quote.id, formData.files);
      if (!uploadResult.success) {
        console.warn('Niektoré súbory sa nepodarilo nahrať:', uploadResult.errors);
        // Pokračujeme aj keď upload zlyhal - dopyt je už vytvorený
      }
    }

    return { success: true, quoteId: quote.id };

  } catch (error) {
    console.error('Unexpected error in submitQuote:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Neočakávaná chyba' 
    };
  }
}

/**
 * Nájde existujúceho zákazníka podľa emailu alebo vytvorí nového
 */
async function findOrCreateCustomer(data: CustomerInsert): Promise<Customer | null> {
  // Najprv skús nájsť existujúceho zákazníka
  const { data: existing } = await supabase
    .from('customers')
    .select()
    .eq('email', data.email)
    .single();

  if (existing) {
    // Aktualizuj údaje ak sa zmenili
    const { data: updated } = await supabase
      .from('customers')
      .update({
        name: data.name,
        phone: data.phone,
        city: data.city,
      })
      .eq('id', existing.id)
      .select()
      .single();

    return updated || existing;
  }

  // Vytvor nového zákazníka
  const { data: newCustomer, error } = await supabase
    .from('customers')
    .insert(data)
    .select()
    .single();

  if (error) {
    console.error('Error creating customer:', error);
    return null;
  }

  return newCustomer;
}

// ===========================================
// ADMIN FUNCTIONS (pre budúci admin panel)
// ===========================================

/**
 * Získa všetky dopyty (vyžaduje autentifikáciu)
 */
export async function getQuotes(status?: string): Promise<Quote[]> {
  let query = supabase
    .from('quotes')
    .select('*, customers(*)')
    .order('created_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching quotes:', error);
    return [];
  }

  return data || [];
}

/**
 * Aktualizuje status dopytu
 */
export async function updateQuoteStatus(
  quoteId: string, 
  status: string, 
  adminNotes?: string
): Promise<boolean> {
  const { error } = await supabase
    .from('quotes')
    .update({ 
      status, 
      admin_notes: adminNotes 
    })
    .eq('id', quoteId);

  if (error) {
    console.error('Error updating quote:', error);
    return false;
  }

  return true;
}

