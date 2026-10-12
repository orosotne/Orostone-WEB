-- ===========================================
-- Newsletter: kedy nočná synchronizácia overila pokus o odber v Klaviyu
-- ===========================================
-- sync-newsletter-unsubscribes v noci overí každý pokus o odber (klaviyo_attempted_at)
-- starší ako hodinu: je e-mail v zozname „Newsletter – web“ prihlásený? Pokus je overený,
-- keď klaviyo_checked_at >= klaviyo_attempted_at. Vynechaný alebo neúspešný nočný beh tak
-- nič nevynechá: neoverený pokus počká na najbližší úspešný beh. Nový pokus (opakované
-- odoslanie formulára) posunie klaviyo_attempted_at a overí sa znova.
--
-- Stĺpec je voliteľný a subscribe-newsletter ho nepoužíva. Migráciu treba spustiť pred
-- nasadením sync-newsletter-unsubscribes, ktorý stĺpec číta aj zapisuje.

ALTER TABLE public.newsletter_subscribers
  ADD COLUMN IF NOT EXISTS klaviyo_checked_at TIMESTAMPTZ;

COMMENT ON COLUMN public.newsletter_subscribers.klaviyo_checked_at IS
  'Kedy sync-newsletter-unsubscribes overil v Klaviyu posledný pokus o odber. Pokus je overený, keď klaviyo_checked_at >= klaviyo_attempted_at.';
