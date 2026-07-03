// ===========================================
// _shared/turnstile.ts — SERVER-SIDE Cloudflare Turnstile verification
// ===========================================
// REFACTOR (findings f02 + f10): anti-bot verification was client-orchestrated —
// the standalone `verify-turnstile` edge function returned {success} only to the
// browser, and submit-quote/subscribe-newsletter never received or checked a
// token. Anyone with the public anon key (shipped in the bundle) could POST
// directly and bypass both Turnstile and the honeypot. This module moves the
// trust boundary to the server: callers verify the token BEFORE any DB write.
//
// ENV: TURNSTILE_SECRET_KEY (Cloudflare dashboard → Turnstile → secret key).
// Fold verify-turnstile/index.ts into this and delete the standalone function
// (also drops the ~168 KB supabase-js SDK that useTurnstile's functions.invoke
// pulled into the client bundle). Keep the client-side check as UX only.

const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export interface TurnstileResult {
  success: boolean;
  errorCodes?: string[];
}

/**
 * Verify a Turnstile token against Cloudflare. Pass the client IP from
 * `req.headers.get('x-forwarded-for')` (first hop) for stronger validation.
 * Fails CLOSED on any transport error — a lead form must not accept bot traffic
 * because Cloudflare was briefly unreachable.
 */
export async function verifyTurnstile(token: unknown, remoteIp?: string | null): Promise<TurnstileResult> {
  const secret = Deno.env.get('TURNSTILE_SECRET_KEY');
  if (!secret) {
    console.error('[turnstile] TURNSTILE_SECRET_KEY not set — rejecting');
    return { success: false, errorCodes: ['missing-secret'] };
  }
  if (typeof token !== 'string' || !token) {
    return { success: false, errorCodes: ['missing-token'] };
  }

  const form = new URLSearchParams();
  form.set('secret', secret);
  form.set('response', token);
  if (remoteIp) form.set('remoteip', remoteIp.split(',')[0].trim());

  try {
    const res = await fetch(SITEVERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form,
      signal: AbortSignal.timeout(5_000),
    });
    const data = await res.json();
    return { success: data.success === true, errorCodes: data['error-codes'] };
  } catch (err) {
    console.error('[turnstile] siteverify failed:', err instanceof Error ? err.message : String(err));
    return { success: false, errorCodes: ['siteverify-unreachable'] };
  }
}

/** First client IP from the forwarded chain, for `verifyTurnstile(token, clientIp(req))`. */
export const clientIp = (req: Request): string | null => req.headers.get('x-forwarded-for');
