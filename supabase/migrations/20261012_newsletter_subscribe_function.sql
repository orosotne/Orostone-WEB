-- ===========================================
-- Newsletter: odber so stropom v jednej transakcii
-- ===========================================
-- subscribe-newsletter zapisuje odber len cez túto funkciu. Zámok (pg_advisory_xact_lock)
-- pustí naraz jeden odber, takže počet odberov v okne a zápis sú atomické: pri súbežnom
-- návale prejde presne prvých p_hour_max odberov za hodinu a p_day_max za 24 hodín, ďalšie
-- dostanú 'limit' a nič sa nezapíše. Pri pár odberoch týždenne zámok nič nebrzdí.
--
-- Výsledok (jsonb) { outcome, id, over }:
--   'inserted'    nový odber,
--   'reactivated' neaktívny riadok je znova aktívny,
--   'active'      e-mail je už aktívny a nič sa nemení; over = strop je plný
--                 (subscribe-newsletter vtedy Klaviyo znova nevolá),
--   'limit'       strop je plný a nový ani obnovený odber sa nezapísal.
-- p_stamp_attempt zapíše čas pokusu o odber v Klaviyu (klaviyo_attempted_at).
--
-- Volá ju len service_role (subscribe-newsletter). Verejné kľúče ju volať nesmú, inak by
-- obišli validáciu funkcie.
-- Migráciu treba spustiť pred nasadením subscribe-newsletter, ktorá funkciu volá.

CREATE OR REPLACE FUNCTION public.newsletter_subscribe(
  p_email TEXT,
  p_name TEXT,
  p_source TEXT,
  p_stamp_attempt BOOLEAN,
  p_hour_max INTEGER,
  p_day_max INTEGER
) RETURNS JSONB
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  v_id UUID;
  v_active BOOLEAN;
  v_over BOOLEAN;
BEGIN
  PERFORM pg_advisory_xact_lock(hashtext('newsletter_subscribe'));

  SELECT id, is_active INTO v_id, v_active
    FROM newsletter_subscribers
   WHERE email = p_email;

  v_over := (SELECT count(*) FROM newsletter_subscribers WHERE subscribed_at > now() - interval '1 hour') >= p_hour_max
         OR (SELECT count(*) FROM newsletter_subscribers WHERE subscribed_at > now() - interval '24 hours') >= p_day_max;

  IF v_id IS NOT NULL AND v_active IS TRUE THEN
    RETURN jsonb_build_object('outcome', 'active', 'id', v_id, 'over', v_over);
  END IF;

  IF v_over THEN
    RETURN jsonb_build_object('outcome', 'limit', 'id', v_id, 'over', true);
  END IF;

  IF v_id IS NOT NULL THEN
    UPDATE newsletter_subscribers
       SET is_active = true,
           unsubscribed_at = NULL,
           subscribed_at = now(),
           klaviyo_attempted_at = CASE WHEN p_stamp_attempt THEN now() ELSE klaviyo_attempted_at END
     WHERE id = v_id;
    RETURN jsonb_build_object('outcome', 'reactivated', 'id', v_id, 'over', false);
  END IF;

  INSERT INTO newsletter_subscribers (email, name, source, klaviyo_attempted_at)
  VALUES (p_email, p_name, p_source, CASE WHEN p_stamp_attempt THEN now() END)
  RETURNING id INTO v_id;
  RETURN jsonb_build_object('outcome', 'inserted', 'id', v_id, 'over', false);
END;
$$;

REVOKE ALL ON FUNCTION public.newsletter_subscribe(TEXT, TEXT, TEXT, BOOLEAN, INTEGER, INTEGER) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.newsletter_subscribe(TEXT, TEXT, TEXT, BOOLEAN, INTEGER, INTEGER) TO service_role;
