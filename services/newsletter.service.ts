import { supabase, isSupabaseConfigured } from '../lib/supabase';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export interface NewsletterSubscribeData {
  email: string;
  name?: string;
  source: string;
}

export interface NewsletterSubscribeResult {
  success: boolean;
  alreadySubscribed?: boolean;
  error?: string;
}

function sendWelcomeEmail(email: string, name?: string) {
  fetch(`${SUPABASE_URL}/functions/v1/send-newsletter-welcome`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ email, name }),
  }).catch((err) => console.warn('[newsletter] Welcome email zlyhal:', err));
}

export async function subscribeToNewsletter(
  data: NewsletterSubscribeData,
): Promise<NewsletterSubscribeResult> {
  if (!isSupabaseConfigured()) {
    if (import.meta.env.DEV) {
      await new Promise((r) => setTimeout(r, 800));
      console.log('[newsletter DEV] Simulovaný subscribe pre:', data.email);
      return { success: true };
    }
    return { success: false, error: 'Služba momentálne nie je dostupná.' };
  }

  const { email, name, source } = data;
  const normalizedEmail = email.toLowerCase().trim();

  // Skontroluj či už existuje
  const { data: existing } = await supabase
    .from('newsletter_subscribers')
    .select('id, is_active')
    .eq('email', normalizedEmail)
    .maybeSingle();

  if (existing) {
    if (existing.is_active) {
      return { success: true, alreadySubscribed: true };
    }
    // Reaktivuj — pošli welcome email znova
    const { error } = await supabase
      .from('newsletter_subscribers')
      .update({ is_active: true, unsubscribed_at: null, subscribed_at: new Date().toISOString() })
      .eq('id', existing.id);

    if (error) return { success: false, error: error.message };
    sendWelcomeEmail(normalizedEmail, name);
    return { success: true };
  }

  // Nový subscriber
  const { error } = await supabase.from('newsletter_subscribers').insert({
    email: normalizedEmail,
    name: name || null,
    source,
  });

  if (error) return { success: false, error: error.message };
  sendWelcomeEmail(normalizedEmail, name);
  return { success: true };
}
