// ===========================================
// _shared/resend.ts — one Resend email helper
// ===========================================
// REFACTOR (finding f10): sendEmail was triplicated with divergent contracts —
// two variants warn-and-return when RESEND_API_KEY is missing, one throws. That
// inconsistency means the same missing-key condition silently no-ops in one flow
// and 500s in another. One helper, one explicit policy per call.

const RESEND_ENDPOINT = 'https://api.resend.com/emails';

export interface SendEmailOptions {
  from: string;
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
  /**
   * What to do when RESEND_API_KEY is absent:
   *  - 'skip'  → log a warning and resolve { skipped: true } (non-critical mail)
   *  - 'throw' → throw (critical path that must surface the misconfig)
   * Default 'throw' so a missing key is never silently swallowed by accident.
   */
  onMissingKey?: 'skip' | 'throw';
}

export interface SendEmailResult {
  ok: boolean;
  skipped?: boolean;
  id?: string;
  error?: string;
}

export async function sendEmail(opts: SendEmailOptions): Promise<SendEmailResult> {
  const apiKey = Deno.env.get('RESEND_API_KEY');
  if (!apiKey) {
    if (opts.onMissingKey === 'skip') {
      console.warn('[resend] RESEND_API_KEY missing — skipping email:', opts.subject);
      return { ok: false, skipped: true };
    }
    throw new Error('RESEND_API_KEY not configured');
  }

  const res = await fetch(RESEND_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: opts.from,
      to: Array.isArray(opts.to) ? opts.to : [opts.to],
      subject: opts.subject,
      html: opts.html,
      ...(opts.replyTo ? { reply_to: opts.replyTo } : {}),
    }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error('[resend] send failed:', res.status, body.slice(0, 500));
    return { ok: false, error: `resend ${res.status}` };
  }

  const data = await res.json().catch(() => ({}));
  return { ok: true, id: data?.id };
}
