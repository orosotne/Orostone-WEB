// ===========================================
// _shared/auth.ts — funkcie, ktoré smie volať len plánovač (GitHub Actions)
// ===========================================
// Legacy kľúče (anon, service_role JWT) Supabase vypne koncom 2026. Workflowy preto posielajú
// nový tajný kľúč sb_secret_… v hlavičke apikey (GitHub secret SUPABASE_SECRET_KEY). Nie je to
// JWT, kontrola verify_jwt ho nevie overiť, preto sú tieto funkcie nasadené s verify_jwt = false
// (supabase/config.toml) a kľúč overuje táto funkcia. Prejde len presná zhoda s kľúčom
// `default` zo SUPABASE_SECRET_KEYS, všetko ostatné (anon, publishable, legacy JWT) dostane 401.

const SECRET_KEY: string = (() => {
  try {
    return JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS') ?? '{}')?.default ?? '';
  } catch {
    return '';
  }
})();

/** Porovnanie v konštantnom čase: trvá rovnako dlho bez ohľadu na to, kde sa reťazce líšia. */
function timingSafeEqual(given: string, expected: string): boolean {
  const a = new TextEncoder().encode(given);
  const b = new TextEncoder().encode(expected);
  let diff = a.length ^ b.length;
  for (let i = 0; i < b.length; i++) diff |= (a[i] ?? 0) ^ b[i];
  return diff === 0;
}

/** Volá funkciu plánovač s tajným kľúčom projektu? */
export function isServiceRole(req: Request): boolean {
  if (!SECRET_KEY) return false;
  return timingSafeEqual(req.headers.get('apikey') ?? '', SECRET_KEY);
}
