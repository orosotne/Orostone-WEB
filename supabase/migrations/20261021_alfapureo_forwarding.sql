-- ===========================================
-- Vzorky: či objednávka dorazila do Alfapurea
-- ===========================================
-- alfapureo-order po každom odoslaní objednávky vzoriek do Alfapurea zapíše výsledok (jeden
-- riadok na objednávku). Prehľad vzoriek (funkcia sample-status → CRM, ranná kontrola) podľa
-- neho ukáže „dorazila do Alfapurea“. Objednávka, ku ktorej riadok chýba, k nám nedorazila
-- (napr. zlý podpis Shopify 18.–21. 10. 2026) alebo sa ešte posiela.
--
-- Bez osobných údajov: len číslo objednávky, časy a odpoveď Alfapurea (HTTP status, chyba
-- spojenia). Zapisuje a číta len service role (edge funkcie), anon ani prihlásení nič.
--
-- Migráciu treba spustiť pred nasadením alfapureo-order a sample-status, ktoré tabuľku používajú.

CREATE TABLE IF NOT EXISTS public.alfapureo_forwarding (
  order_id BIGINT PRIMARY KEY,
  order_name TEXT NOT NULL,
  forwarded_at TIMESTAMPTZ,
  last_attempt_at TIMESTAMPTZ NOT NULL,
  last_http_status INTEGER,
  last_attempts INTEGER NOT NULL,
  last_error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.alfapureo_forwarding IS
  'Odoslanie zaplatených objednávok vzoriek do Alfapurea (alfapureo-order). Len service role, bez osobných údajov.';
COMMENT ON COLUMN public.alfapureo_forwarding.order_id IS 'Shopify ID objednávky (legacy, číslo).';
COMMENT ON COLUMN public.alfapureo_forwarding.forwarded_at IS
  'Kedy Alfapureo naposledy prijalo objednávku (HTTP 2xx). Neskorší neúspešný pokus ho nemaže.';
COMMENT ON COLUMN public.alfapureo_forwarding.last_http_status IS 'HTTP status poslednej odpovede Alfapurea, NULL pri chybe spojenia.';
COMMENT ON COLUMN public.alfapureo_forwarding.last_attempts IS 'Počet pokusov pri poslednom odoslaní (najviac 3).';
COMMENT ON COLUMN public.alfapureo_forwarding.last_error IS 'Chyba spojenia pri poslednom neúspešnom odoslaní, inak NULL.';

ALTER TABLE public.alfapureo_forwarding ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.alfapureo_forwarding FROM anon, authenticated;

-- ORO-1014 a ORO-1015 (zlý podpis Shopify) poslal Claude Alfapureu ručne 21. 10. 2026 dopoludnia,
-- obe HTTP 200. Čas je približný.
INSERT INTO public.alfapureo_forwarding (order_id, order_name, forwarded_at, last_attempt_at, last_http_status, last_attempts)
VALUES
  (8481964425562, 'ORO-1014', '2026-10-21T08:00:00Z', '2026-10-21T08:00:00Z', 200, 1),
  (8486029099354, 'ORO-1015', '2026-10-21T08:00:00Z', '2026-10-21T08:00:00Z', 200, 1)
ON CONFLICT (order_id) DO NOTHING;
