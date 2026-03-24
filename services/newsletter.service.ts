import { supabase, isSupabaseConfigured } from '../lib/supabase';

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

export async function subscribeToNewsletter(
  data: NewsletterSubscribeData,
): Promise<NewsletterSubscribeResult> {
  if (!isSupabaseConfigured()) {
    if (import.meta.env.DEV) {
      await new Promise((r) => setTimeout(r, 800));
      return { success: true };
    }
    return { success: false, error: 'Služba momentálne nie je dostupná.' };
  }

  const { email, name, source } = data;

  // Skontroluj či už existuje
  const { data: existing } = await supabase
    .from('newsletter_subscribers')
    .select('id, is_active')
    .eq('email', email.toLowerCase().trim())
    .maybeSingle();

  if (existing) {
    if (existing.is_active) {
      return { success: true, alreadySubscribed: true };
    }
    // Reaktivuj
    const { error } = await supabase
      .from('newsletter_subscribers')
      .update({ is_active: true, unsubscribed_at: null, subscribed_at: new Date().toISOString() })
      .eq('id', existing.id);

    if (error) return { success: false, error: error.message };
    return { success: true };
  }

  // Nový subscriber
  const { error } = await supabase.from('newsletter_subscribers').insert({
    email: email.toLowerCase().trim(),
    name: name || null,
    source,
  });

  if (error) return { success: false, error: error.message };
  return { success: true };
}
