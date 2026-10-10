import React, { useState, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
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
import { ActionButton, Container, Eyebrow } from '../Design';
import { REVEAL, SPRING, FADE } from '../../lib/motion';
import { LIGHT_TONE_BG, type LightTone } from './types';

interface ArchitectBlockProps {
  product: ShopProduct;
  tone?: LightTone;
}

export const ArchitectBlock: React.FC<ArchitectBlockProps> = ({ product, tone = 'sand' }) => {
  const { addItem, sampleCount, isSampleInCart } = useCart();
  const { turnstileRef, turnstileToken, setTurnstileToken } = useTurnstile();
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
    // Turnstile verified SERVER-SIDE in submit-quote (finding f02); forward the
    // single-use token instead of redeeming it here. Presence gate above still
    // blocks submit until the widget is solved.
    setBimSubmitting(true);
    await submitQuote({
      name: 'BIM/CAD Request',
      phone: '',
      email: bimEmail,
      description: `Záujem o BIM / CAD High-Res Textúry — produkt: ${product.name}`,
      files: [],
    }, turnstileToken);
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
    <section className={`py-10 lg:py-16 ${LIGHT_TONE_BG[tone]}`}>
      <Container>
        <m.div {...REVEAL}>
          <div className="border border-brand-line bg-white">
            <div className="p-5 lg:p-8 border-b border-brand-line">
              <Eyebrow as="h2" className="mb-2 text-brand-dark">
                Pre architektov a dizajnérov
              </Eyebrow>
              <p className="text-brand-muted">
                Materiály a podpora pre profesionálov
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-brand-line">
              <div className="p-5 lg:p-8">
                <h3 className="font-bold text-brand-dark mb-4">Vzorky materiálu</h3>
                <p className="text-sm text-brand-muted mb-6">
                  Objednajte si fyzickú vzorku pre presné posúdenie farby, textúry a povrchu.
                </p>
                <button
                  type="button"
                  onClick={handleAddSample}
                  aria-disabled={!product.sampleShopifyVariantId || undefined}
                  className={cn(
                    "os-press flex min-h-[48px] items-center gap-3 rounded-[10px] px-6 text-[0.78rem] font-bold uppercase tracking-[0.12em]",
                    sampleInCart
                      ? "border border-brand-dark bg-brand-sand text-brand-dark cursor-default"
                      : !product.sampleShopifyVariantId
                        ? "border border-brand-line text-brand-muted cursor-not-allowed"
                        : "bg-brand-dark text-brand-light hover:bg-[#333331]"
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
                    href="/documents/TDS_orostone.pdf"
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="os-press w-full flex items-center justify-between p-4 bg-[#F2F0EA] hover:bg-brand-sand group"
                  >
                    <span className="flex items-center gap-3 text-sm text-brand-dark">
                      <FileText size={16} className="text-brand-dark" />
                      Technický list (TDS)
                    </span>
                    <Download size={14} className="text-brand-muted group-hover:text-brand-dark" />
                  </a>
                  <button
                    type="button"
                    onClick={() => { setIsBimModalOpen(true); setBimEmail(''); setBimSubmitted(false); }}
                    className="os-press w-full flex items-center justify-between p-4 bg-[#F2F0EA] hover:bg-brand-sand group"
                  >
                    <span className="flex items-center gap-3 text-sm text-brand-dark">
                      <FileText size={16} className="text-brand-dark" />
                      BIM / CAD Textúry (High-Res)
                    </span>
                    <Mail size={14} className="text-brand-muted group-hover:text-brand-dark" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-5 lg:p-8 bg-[#F2F0EA] border-t border-brand-line">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-medium text-brand-dark mb-1">Potrebujete konzultáciu?</h4>
                    <p className="text-sm text-brand-muted">Poradíme s výberom materiálu pre váš projekt. Odpoveď do 24h.</p>
                  </div>
                  <ActionButton variant="outline" size="sm" to="/kontakt">
                    <MessageSquare size={16} aria-hidden="true" />
                    Kontaktovať
                  </ActionButton>
                </div>
                <div className="flex flex-wrap gap-4 text-sm">
                  <a href="tel:+421917588738" className="flex min-h-[44px] items-center gap-2 text-brand-muted transition-colors hover:text-brand-dark">
                    <Phone size={14} />
                    +421 917 588 738
                  </a>
                  <a href="mailto:dopyt@orostone.sk" className="flex min-h-[44px] items-center gap-2 text-brand-muted transition-colors hover:text-brand-dark">
                    <Mail size={14} />
                    dopyt@orostone.sk
                  </a>
                </div>
              </div>
            </div>
          </div>
        </m.div>
      </Container>

      <AnimatePresence>
        {isBimModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 max-h-[100dvh] overflow-y-auto overscroll-contain">
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={FADE}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm touch-none overscroll-none"
              onClick={handleBimModalClose}
            />
            <m.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={SPRING}
              role="dialog"
              aria-modal="true"
              aria-labelledby="bim-dialog-title"
              className="relative z-10 w-full max-w-md max-h-[90dvh] flex flex-col bg-white rounded-[3px] shadow-2xl overflow-hidden"
            >
              <div className="bg-brand-dark px-6 py-5 flex items-start justify-between gap-4 flex-shrink-0">
                <div>
                  <h3 id="bim-dialog-title" className="text-white font-bold text-lg leading-tight">BIM / CAD High-Res Textúry</h3>
                  <p className="text-white/60 text-sm mt-1">{product.name}</p>
                </div>
                <button
                  type="button"
                  onClick={handleBimModalClose}
                  aria-label="Zavrieť"
                  className="os-press -mr-2 -mt-1.5 grid h-11 w-11 flex-shrink-0 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="px-6 py-6 overflow-y-auto overscroll-contain flex-1 min-h-0">
                {!bimSubmitted ? (
                  <>
                    <p className="text-brand-muted text-sm mb-5">
                      Nechajte nám svoj e-mail a my vám BIM / CAD textúry v plnom rozlíšení zašleme obratom. Súbory sú dostupné pre registrovaných architektov a dizajnérov.
                    </p>
                    <form onSubmit={handleBimSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-brand-dark uppercase tracking-wide mb-1.5">
                          Váš e-mail
                        </label>
                        <div className="relative">
                          <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" />
                          <input
                            type="email"
                            required
                            value={bimEmail}
                            onChange={e => setBimEmail(e.target.value)}
                            placeholder="vas@email.sk"
                            className="w-full pl-9 pr-4 py-2.5 border border-brand-line rounded-[3px] text-base focus:outline-none focus:ring-2 focus:ring-brand-dark/30 focus:border-brand-dark transition-colors"
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
                        className="w-full bg-brand-dark hover:bg-brand-dark/90 text-brand-light font-semibold text-sm py-3 rounded-[10px] transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
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
                    <p className="text-brand-muted text-sm">
                      Súbory vám zašleme na <span className="font-medium text-brand-dark">{bimEmail}</span> do 24 hodín.
                    </p>
                    <button
                      onClick={handleBimModalClose}
                      className="mt-5 text-sm text-brand-dark hover:underline font-medium"
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
