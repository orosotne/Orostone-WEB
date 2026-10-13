// ===========================================
// _shared/auth.ts — funkcie, ktoré smie volať len plánovač (GitHub Actions)
// ===========================================
// Kontrola JWT na platforme (verify_jwt) pustí aj verejný anon kľúč z webu, preto tieto
// funkcie overujú volajúceho aj samy.
//
// Workflowy posielajú legacy service_role JWT (GitHub secret SUPABASE_SERVICE_ROLE_KEY).
// Premenná SUPABASE_SERVICE_ROLE_KEY v prostredí funkcií tohto projektu je však iný kľúč,
// presné porovnanie by workflow odmietlo (13. 10. 2026: 401 v send-daily-analytics).
// Prejde preto aj JWT s rolou service_role. Jeho podpis overí brána, takže funkcia musí
// ostať nasadená s verify_jwt (predvolené). S --no-verify-jwt by sa dal podvrhnúť
// nepodpísaný token.

const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

/** Volá funkciu plánovač so service-role oprávnením? */
export function isServiceRole(req: Request): boolean {
  const authHeader = req.headers.get('authorization') ?? '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  if (!token) return false;
  if (SERVICE_KEY && token === SERVICE_KEY) return true;
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(payload))?.role === 'service_role';
  } catch {
    return false;
  }
}
