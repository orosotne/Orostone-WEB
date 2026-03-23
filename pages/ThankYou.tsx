import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ShoppingBag } from 'lucide-react';
import { popPendingPurchase, trackMetaEvent } from '../hooks/useMetaPixel';
import { trackGA4Purchase } from '../hooks/useGA4Ecommerce';
import { SEOHead } from '../components/UI/SEOHead';

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
    <main className="min-h-screen bg-[#F9F9F7] flex items-center justify-center px-6">
      <SEOHead title="Objednávka dokončená | OROSTONE" description="Ďakujeme za vašu objednávku." noindex={true} />
      <div className="text-center max-w-md">
        <CheckCircle size={64} className="mx-auto text-green-500 mb-6" />
        <h1 className="text-3xl font-bold text-brand-dark mb-4">Ďakujeme za objednávku!</h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Vaša objednávka bola úspešne prijatá. Potvrdenie vám príde e-mailom.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-brand-dark text-white px-8 py-4 rounded-full font-semibold hover:bg-brand-gold hover:text-brand-dark transition-all"
        >
          <ShoppingBag size={18} />
          Späť do obchodu
        </Link>
      </div>
    </main>
  );
};
