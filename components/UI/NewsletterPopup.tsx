import React, { useEffect, useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { X, Loader2, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { subscribeToNewsletter } from '../../services/newsletter.service';
import { trackGA4Event } from '../../hooks/useGA4Ecommerce';

const LS_KEY = 'orostone-newsletter-popup';
const DELAY_MS = 8000;

function getPopupState(): string | null {
  try { return localStorage.getItem(LS_KEY); } catch { return null; }
}

function setPopupState(value: string) {
  try { localStorage.setItem(LS_KEY, value); } catch { /* ignore */ }
}

export const NewsletterPopup: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (getPopupState()) return;

    const timer = setTimeout(() => setVisible(true), DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setVisible(false);
    setPopupState('dismissed');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');

    const result = await subscribeToNewsletter({ email, source: 'popup' });

    if (result.success) {
      trackGA4Event('sign_up', { method: 'newsletter_popup' });
      setStatus('success');
      setPopupState('done');
    } else {
      setStatus('error');
      setErrorMsg(result.error || 'Niečo sa nepodarilo. Skúste to znova.');
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <m.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={dismiss}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[10000]"
          />

          {/* Modal */}
          <m.div
            key="popup"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 flex items-center justify-center z-[10001] px-4 pointer-events-none"
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full pointer-events-auto overflow-hidden">

              {/* Gold header bar */}
              <div className="bg-brand-gold px-8 pt-8 pb-6 relative">
                <button
                  onClick={dismiss}
                  className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 transition-colors"
                  aria-label="Zavrieť"
                >
                  <X size={16} className="text-brand-dark" />
                </button>
                <span className="text-xs font-bold tracking-widest uppercase text-brand-dark/70 mb-2 block">
                  Exkluzívna ponuka
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-brand-dark leading-tight">
                  Zľava 5&nbsp;% na<br />prvý nákup
                </h2>
              </div>

              {/* Content */}
              <div className="px-8 py-6">
                {status === 'success' ? (
                  <div className="text-center py-4">
                    <CheckCircle className="w-12 h-12 text-brand-gold mx-auto mb-3" strokeWidth={1.5} />
                    <p className="font-bold text-brand-dark text-lg mb-1">Výborne!</p>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      Skontrolujte email — váš kód <strong className="text-brand-dark">WELCOME5</strong> je na ceste.
                    </p>
                    <button
                      onClick={dismiss}
                      className="mt-5 text-sm text-gray-400 hover:text-brand-dark transition-colors underline"
                    >
                      Zavrieť
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="text-gray-500 text-sm leading-relaxed mb-5">
                      Prihláste sa na odber noviniek a získajte zľavový kód <strong className="text-brand-dark">WELCOME5</strong> na váš prvý nákup v e-shope.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-3">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="vas@email.sk"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-brand-dark placeholder-gray-300 focus:outline-none focus:border-brand-gold transition-colors"
                      />
                      {status === 'error' && (
                        <p className="text-red-500 text-xs">{errorMsg}</p>
                      )}
                      <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="w-full bg-brand-dark text-white py-3 rounded-xl text-sm font-bold tracking-wider uppercase hover:bg-brand-gold hover:text-brand-dark transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2"
                      >
                        {status === 'loading' ? (
                          <><Loader2 size={16} className="animate-spin" /> Odosielam...</>
                        ) : (
                          'Získať 5% zľavu'
                        )}
                      </button>
                    </form>

                    <p className="text-xs text-gray-400 leading-relaxed mt-4">
                      Prihlásením súhlasíte so zasielaním noviniek. Odhlásiť sa môžete kedykoľvek.{' '}
                      <Link to="/ochrana-sukromia" target="_blank" className="underline hover:text-brand-dark">
                        Ochrana súkromia
                      </Link>
                    </p>

                    <button
                      onClick={dismiss}
                      className="mt-3 w-full text-center text-xs text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      Nie, ďakujem
                    </button>
                  </>
                )}
              </div>

            </div>
          </m.div>
        </>
      )}
    </AnimatePresence>
  );
};
