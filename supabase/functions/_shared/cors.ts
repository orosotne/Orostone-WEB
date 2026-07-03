// ===========================================
// _shared/cors.ts — one CORS contract for all edge functions
// ===========================================
// REFACTOR (finding f10): corsHeaders was copy-pasted into all 8 functions and
// had already drifted (some allow `apikey`, some don't; verify-turnstile used a
// different lowercase set). One definition, imported everywhere.

export const corsHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey',
} as const;

/** Standard preflight response. Return this for `req.method === 'OPTIONS'`. */
export const preflight = (): Response => new Response(null, { status: 204, headers: corsHeaders });

/** JSON response helper that always carries the shared CORS headers. */
export const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), { status, headers: corsHeaders });
