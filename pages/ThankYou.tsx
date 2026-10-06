import React, { useEffect, useRef } from 'react';
import { Check } from 'lucide-react';
import { popPendingPurchase, trackMetaEvent } from '../hooks/useMetaPixel';
import { trackGA4Purchase } from '../hooks/useGA4Ecommerce';
import { SEOHead } from '../components/UI/SEOHead';
import { ActionButton, Container, PHONE_HREF, PHONE_LABEL, Section } from '../components/Design';

export const ThankYou: React.FC = () => {
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;

    const purchase = popPendingPurchase();
    if (purchase) {
      trackMetaEvent('Purchase', {
        value: purchase.value,
        currency: purchase.currency,
        content_ids: purchase.content_ids,
        content_type: 'product',
        num_items: purchase.num_items,
      });
      trackGA4Purchase({
        value: purchase.value,
        items: purchase.items ?? purchase.content_ids.map(id => ({ item_id: id })),
      });
    }
  }, []);

  return (
    <Section tone="chalk" className="flex min-h-[calc(100dvh-4rem)] items-center lg:min-h-[calc(100dvh-5rem)]">
      <SEOHead title="Objednávka dokončená | OROSTONE" description="Ďakujeme za vašu objednávku." noindex={true} />
      <Container className="grid justify-items-start gap-5">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-brand-dark text-brand-light" aria-hidden="true">
          <Check size={28} strokeWidth={1.75} />
        </span>
        <h1 className="text-os-h1">Ďakujeme za objednávku!</h1>
        <p className="max-w-[54ch] text-os-lead font-light text-brand-muted">
          Vaša objednávka bola úspešne prijatá. Potvrdenie vám príde e-mailom.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-x-8 gap-y-4">
          <ActionButton to="/" arrow>
            Späť do obchodu
          </ActionButton>
          <a href={PHONE_HREF} className="text-[0.95rem] font-medium tabular-nums underline decoration-1 underline-offset-[6px]">
            Otázky k objednávke: {PHONE_LABEL}
          </a>
        </div>
      </Container>
    </Section>
  );
};
