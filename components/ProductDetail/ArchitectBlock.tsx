import React, { useState, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Check,
  Package,
  FileText,
  MessageSquare,
  Download,
  X,
  Mail,
  Phone,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { MAX_SAMPLES } from '../../constants';
import type { ShopProduct } from '../../constants';
import { submitQuote } from '../../services/quotes.service';
import { useCart } from '../../context/CartContext';
import { useScrollLock } from '../../hooks/useScrollLock';
import { trackGA4Event } from '../../services/analytics';
import { useTurnstile } from '../../hooks/useTurnstile';
import { Turnstile } from '@marsidev/react-turnstile';

interface ArchitectBlockProps {
  product: ShopProduct;
}

export const ArchitectBlock: React.FC<ArchitectBlockProps> = ({ product }) => {
  const { addItem, sampleCount, isSampleInCart } = useCart();
  const { turnstileRef, turnstileToken, setTurnstileToken, verifyToken, reset: resetTurnstile } = useTurnstile();
  const [sampleError, setSampleError] = useState<string | null>(null);
  const [isBimModalOpen, setIsBimModalOpen] = useState(false);
  const [bimEmail, setBimEmail] = useState('');
  const [bimSubmitted, setBimSubmitted] = useState(false);
  const [bimSubmitting, setBimSubmitting] = useState(false);
  const [bimError, setBimError] = useState<string | null>(null);

  const handleBimModalClose = () => {
    (document.activeElement as HTMLElement)?.blur();
    setIsBimModalOpen(false);
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isBimModalOpen) handleBimModalClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isBimModalOpen]);

  useScrollLock(isBimModalOpen);

  const handleBimSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBimError(null);

    if (!turnstileToken) {
      setBimError('Prosím, dokončite overenie (CAPTCHA).');
      return;
    }
    const isHuman = await verifyToken(turnstileToken);
    if (!isHuman) {
      resetTurnstile();
      setBimError('Overenie zlyhalo. Skúste to znova.');
      return;
    }

    setBimSubmitting(true);
    await submitQuote({
      name: 'BIM/CAD Request',
      phone: '',
      email: bimEmail,
      description: `Záujem o BIM / CAD High-Res Textúry — produkt: ${product.name}`,
      files: [],
    });
    trackGA4Event('generate_lead', {
      currency: 'EUR',
      value: 30,
      lead_source: 'bim_cad_request',
      item_name: product.name,
    });
    setBimSubmitting(false);
    setBimSubmitted(true);
  };

  const handleAddSample = () => {
    if (!product.sampleShopifyVariantId) {
      setSampleError('Vzorka pre tento produkt nie je momentálne dostupná.');
      setTimeout(() => setSampleError(null), 5000);
      return;
    }
    if (isSampleInCart(product.id)) return;
    if (sampleCount >= MAX_SAMPLES) {
      setSampleError(`Dosiahli ste maximum ${MAX_SAMPLES} vzoriek. Odoberte niektorú pred pridaním novej.`);
      setTimeout(() => setSampleError(null), 5000);
      return;
    }
    setSampleError(null);
    addItem(product.sampleShopifyVariantId, 1);
  };

  const sampleInCart = isSampleInCart(product.id);

  return (
    <section className="py-10 lg:py-16">
      <div className="container mx-auto px-6">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="border border-gray-200 bg-white">
            <div className="p-5 lg:p-8 border-b border-gray-200">
              <h2 className="text-xs lg:text-[11px] font-bold tracking-[0.2em] uppercase text-brand-gold mb-2">
                Pre architektov a dizajnérov
              </h2>
              <p className="text-gray-600">
                Materiály a podpora pre profesionálov
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200">
              <div className="p-5 lg:p-8">
                <h3 className="font-bold text-brand-dark mb-4">Vzorky materiálu</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Objednajte si fyzickú vzorku pre presné posúdenie farby, textúry a povrchu.
                </p>
                <button
                  onClick={handleAddSample}
                  className={cn(
                    "flex items-center gap-3 px-6 py-3 text-sm font-semibold tracking-wider uppercase transition-colors",
                    sampleInCart
                      ? "bg-emerald-600 text-white cursor-default"
                      : !product.sampleShopifyVariantId
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-brand-dark text-white hover:bg-black"
                  )}
                >
                  {sampleInCart ? (
                    <>
                      <Check size={16} />
                      Vzorka v košíku
                    </>
                  ) : (
                    <>
                      <Package size={16} />
                      Pridať vzorku
                    </>
                  )}
                </button>
                {sampleError && (
                  <p className="mt-2 text-xs text-red-600">{sampleError}</p>
                )}
              </div>

              <div className="p-5 lg:p-8">
                <h3 className="font-bold text-brand-dark mb-4">Technická dokumentácia</h3>
                <div className="space-y-3">
                  <a
                    href={`mailto:dopyt@orostone.sk?subject=Technický list (TDS) — ${encodeURIComponent(product.name)}&body=Dobrý deň,%0A%0Aprosíme o zaslanie technického listu (TDS) pre produkt: ${encodeURIComponent(product.name)}.%0A%0AĎakujeme.`}
                    className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors group"
                  >
                    <span className="flex items-center gap-3 text-sm text-brand-dark">
                      <FileText size={16} className="text-brand-gold" />
                      Technický list (TDS)
                    </span>
                    <Download size={14} className="text-gray-400 group-hover:text-brand-dark" />
                  </a>
                  <button
                    onClick={() => { setIsBimModalOpen(true); setBimEmail(''); setBimSubmitted(false); }}
                    className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors group"
                  >
                    <span className="flex items-center gap-3 text-sm text-brand-dark">
                      <FileText size={16} className="text-brand-gold" />
                      BIM / CAD Textúry (High-Res)
                    </span>
                    <Mail size={14} className="text-gray-400 group-hover:text-brand-dark" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-5 lg:p-8 bg-gray-50 border-t border-gray-200">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-medium text-brand-dark mb-1">Potrebujete konzultáciu?</h4>
                    <p className="text-sm text-gray-600">Poradíme s výberom materiálu pre váš projekt. Odpoveď do 24h.</p>
                  </div>
                  <Link to="/kontakt">
                    <button className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-brand-dark text-sm font-semibold tracking-wider uppercase hover:border-brand-gold hover:text-brand-gold transition-colors">
                      <MessageSquare size={16} />
                      Kontaktovať
                    </button>
                  </Link>
                </div>
                <div className="flex flex-wrap gap-4 text-sm">
                  <a href="tel:+421917588738" className="flex items-center gap-2 text-gray-600 hover:text-brand-gold transition-colors">
                    <Phone size={14} />
                    +421 917 588 738
                  </a>
                  <a href="mailto:dopyt@orostone.sk" className="flex items-center gap-2 text-gray-600 hover:text-brand-gold transition-colors">
                    <Mail size={14} />
                    dopyt@orostone.sk
                  </a>
                </div>
              </div>
            </div>
          </div>
        </m.div>
      </div>

      <AnimatePresence>
        {isBimModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 max-h-[100dvh] overflow-y-auto overscroll-contain">
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm touch-none overscroll-none"
              onClick={handleBimModalClose}
            />
            <m.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 w-full max-w-md max-h-[90dvh] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="bg-brand-dark px-6 py-5 flex items-start justify-between gap-4 flex-shrink-0">
                <div>
                  <h3 className="text-white font-bold text-lg leading-tight">BIM / CAD High-Res Textúry</h3>
                  <p className="text-white/60 text-sm mt-1">{product.name}</p>
                </div>
                <button
                  onClick={handleBimModalClose}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors flex-shrink-0 mt-0.5"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="px-6 py-6 overflow-y-auto overscroll-contain flex-1 min-h-0">
                {!bimSubmitted ? (
                  <>
                    <p className="text-gray-600 text-sm mb-5">
                      Nechajte nám váš email a my vám BIM / CAD textúry v plnom rozlíšení zašleme obratom. Súbory sú dostupné pre registrovaných architektov a dizajnérov.
                    </p>
                    <form onSubmit={handleBimSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-brand-dark uppercase tracking-wide mb-1.5">
                          Váš email
                        </label>
                        <div className="relative">
                          <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="email"
                            required
                            value={bimEmail}
                            onChange={e => setBimEmail(e.target.value)}
                            placeholder="vas@email.sk"
                            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold transition-colors"
                          />
                        </div>
                      </div>
                      <Turnstile
                        ref={turnstileRef}
                        siteKey={import.meta.env.VITE_TURNSTILE_SITEKEY}
                        onSuccess={setTurnstileToken}
                        onExpire={() => setTurnstileToken(null)}
                        options={{ size: 'flexible' }}
                      />
                      {bimError && (
                        <p className="text-red-500 text-xs">{bimError}</p>
                      )}
                      <button
                        type="submit"
                        disabled={bimSubmitting || !turnstileToken}
                        className="w-full bg-brand-dark hover:bg-brand-dark/90 text-brand-gold font-semibold text-sm py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                      >
                        {bimSubmitting ? (
                          <>
                            <Loader2 size={15} className="animate-spin" />
                            Odosielam...
                          </>
                        ) : (
                          <>
                            <Mail size={15} />
                            Poslať žiadosť
                          </>
                        )}
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle size={28} className="text-green-500" />
                    </div>
                    <h4 className="font-bold text-brand-dark text-lg mb-2">Ďakujeme!</h4>
                    <p className="text-gray-600 text-sm">
                      Súbory vám zašleme na <span className="font-medium text-brand-dark">{bimEmail}</span> do 24 hodín.
                    </p>
                    <button
                      onClick={handleBimModalClose}
                      className="mt-5 text-sm text-brand-gold hover:underline font-medium"
                    >
                      Zavrieť
                    </button>
                  </div>
                )}
              </div>
            </m.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
