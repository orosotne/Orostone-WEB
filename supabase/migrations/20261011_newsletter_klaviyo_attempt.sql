-- ===========================================
-- Newsletter: čas posledného pokusu o odber v Klaviyu
-- ===========================================
-- subscribe-newsletter pri opakovanom odoslaní formulára volá Klaviyo, len keď posledný
-- pokus bol pred viac ako 30 minútami (Klaviyo radí najviac jednu úlohu odberu na profil
-- za 30 minút). Podmienený UPDATE nad týmto stĺpcom pustí z dvoch súbežných požiadaviek
-- len jednu. Dátum súhlasu ostáva v subscribed_at.
--
-- Stĺpec je voliteľný a starší kód ho ignoruje. Migráciu treba spustiť pred nasadením
-- subscribe-newsletter: odber zapisuje funkcia newsletter_subscribe (migrácia
-- 20261011_newsletter_subscribe_function.sql), ktorá stĺpec používa.

ALTER TABLE public.newsletter_subscribers
  ADD COLUMN IF NOT EXISTS klaviyo_attempted_at TIMESTAMPTZ;

COMMENT ON COLUMN public.newsletter_subscribers.klaviyo_attempted_at IS
  'Čas posledného pokusu o odber v Klaviyu (subscribe-newsletter). Dátum súhlasu je v subscribed_at.';
