import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle, Loader2, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useShopifyProducts } from '../../hooks/useShopifyProducts';
import { submitSampleLead } from '../../services/quotes.service';
import { trackMetaEvent } from '../../hooks/useMetaPixel';
import { trackGA4Event } from '../../hooks/useGA4Ecommerce';
import { subscribeToNewsletter } from '../../services/newsletter.service';
import { RotatingBadge } from '../UI/RotatingBadge';
import { useHoneypot } from '../../hooks/useHoneypot';
import { useTurnstile } from '../../hooks/useTurnstile';
import { Turnstile } from '@marsidev/react-turnstile';

const TESTIMONIAL = {
  quote: 'Vzorka nás presvedčila ešte pred objednávkou — klienti ocenili kvalitu okamžite.',
  name: 'Ing. arch. Martin Štefánik',
  role: 'MS Interiors, Bratislava',
};

const LIFESTYLE_IMAGE = '/images/sample-lead-hero.png';

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

interface SampleLeadSectionProps {
  preselectedDekor?: string;
}

export const SampleLeadSection: React.FC<SampleLeadSectionProps> = ({ preselectedDekor = '' }) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [agreedToVOP, setAgreedToVOP] = useState(false);
  const [newsletterConsent, setNewsletterConsent] = useState(false);
  const [dekorValue, setDekorValue] = useState('');
  const { products } = useShopifyProducts();

  useEffect(() => {
    if (preselectedDekor) setDekorValue(preselectedDekor);
  }, [preselectedDekor]);
  const { honeypotValue, setHoneypotValue, isBot } = useHoneypot();
  const { turnstileRef, turnstileToken, setTurnstileToken, verifyToken, reset: resetTurnstile } = useTurnstile();
  const [showPin, setShowPin] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const pinRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowPin(true), 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!expanded) return;
    const handleClick = (e: MouseEvent) => {
      if (pinRef.current && !pinRef.current.contains(e.target as Node)) setExpanded(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [expanded]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isBot) return;
    if (!turnstileToken) { setStatus('error'); setErrorMsg('Prosím, potvrďte, že nie ste robot.'); return; }
    if (!formRef.current) return;

    setStatus('loading');
    setErrorMsg('');

    const fd = new FormData(formRef.current);
    const name = String(fd.get('from_name') ?? '').trim();
    const email = String(fd.get('from_email') ?? '').trim();
    const phone = String(fd.get('phone') ?? '').trim();
    const dekor = String(fd.get('dekor') ?? '').trim();

    if (!agreedToVOP) {
      setStatus('error');
      setErrorMsg('Prosím, súhlaste s VOP a ochranou osobných údajov.');
      return;
    }

    const valid = await verifyToken(turnstileToken);
    if (!valid) { setStatus('error'); setErrorMsg('Overenie zlyhalo, skúste znova.'); resetTurnstile(); return; }

    const result = await submitSampleLead({
      name,
      email,
      phone: phone || undefined,
      dekor,
    });

    if (result.success) {
      trackMetaEvent('Lead', {
        content_name: dekor,
        content_category: 'Sample Request',
      });
      trackGA4Event('generate_lead', {
        currency: 'EUR',
        value: 20,
        lead_source: 'sample_request',
        item_name: dekor,
      });
      if (newsletterConsent) {
        await subscribeToNewsletter({ email, name, source: 'sample_lead' });
      }
      setStatus('success');
    } else {
      setStatus('error');
      setErrorMsg(
        result.error
          ? `${result.error} Skúste nás kontaktovať priamo na info@orostone.sk`
          : 'Niečo sa nepodarilo. Skúste nás kontaktovať priamo na info@orostone.sk',
      );
    }
  };

  return (
    <section id="vzorka" className="relative overflow-x-hidden bg-[#ECD488]">

      {/* Top wave — animated by horizontal translate */}
      <div className="absolute top-0 left-0 w-full leading-none pointer-events-none" style={{ height: '80px', overflow: 'clip' }}>
        <svg
          viewBox="0 0 2880 80"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute top-0 left-0 h-full"
          style={{ width: '200%', animation: 'waveSlideLeft 8s linear infinite' }}
          preserveAspectRatio="none"
        >
          {/* 4 half-periods of 720 units each → half-SVG = 1440 = 2 full cycles, loop is seamless */}
          <path
            d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 C1680,80 1920,0 2160,40 C2400,80 2640,0 2880,40 L2880,0 L0,0 Z"
            fill="#FAFAFA"
          />
        </svg>
      </div>

      {/* Bottom wave — animated in opposite direction */}
      <div className="absolute bottom-0 left-0 w-full leading-none pointer-events-none" style={{ height: '80px', overflow: 'clip' }}>
        <svg
          viewBox="0 0 2880 80"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute bottom-0 left-0 h-full"
          style={{ width: '200%', animation: 'waveSlideRight 8s linear infinite' }}
          preserveAspectRatio="none"
        >
          <path
            d="M0,40 C240,0 480,80 720,40 C960,0 1200,80 1440,40 C1680,0 1920,80 2160,40 C2400,0 2640,80 2880,40 L2880,80 L0,80 Z"
            fill="#FAFAFA"
          />
        </svg>
      </div>

      {/* Sub-pixel hairline between sections (mobile): mask last row of yellow under the wave */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-[5] h-[2px] bg-[#FAFAFA]"
        aria-hidden
      />

      <style>{`
        @keyframes waveSlideLeft {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes waveSlideRight {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>

      <div className="relative z-10 py-28 lg:py-36">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">

          {/* Left — photo shifted up; testimonial half on image, half on yellow (#ECD488) */}
          <div className="relative z-10 -mt-3 lg:-mt-14 order-2 lg:order-1">
            <div className="relative">
              <div
                className="badge-blink-delay-1 absolute z-30 pointer-events-none
                  top-[8%] left-[11%]
                  lg:top-[6%] lg:left-[10%]"
              >
                <div className="origin-top-left scale-[0.82] sm:scale-90 lg:scale-100">
                  <RotatingBadge variant="dark-white" />
                </div>
              </div>
              <div className="relative rounded-2xl overflow-hidden aspect-[4/5] lg:aspect-auto lg:h-[580px]">
                <img
                  src={LIFESTYLE_IMAGE}
                  alt="Vzorky sinterovaného kameňa OROSTONE v elegantnom balení"
                  width={800}
                  height={1000}
                  className="w-full h-full object-cover lg:object-[50%_30%]"
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 z-20 translate-y-[62%] px-3 sm:px-4 lg:px-5">
                <div className="rounded-xl bg-brand-dark/75 backdrop-blur-md px-5 py-5 lg:px-7 lg:py-6 shadow-lg ring-1 ring-white/10">
                  <div className="flex gap-0.5 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-brand-gold fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-white text-sm lg:text-base font-light leading-relaxed italic mb-4 text-pretty">
                    "{TESTIMONIAL.quote}"
                  </p>
                  <div>
                    <p className="text-white text-sm font-semibold">{TESTIMONIAL.name}</p>
                    <p className="text-gray-300 text-xs">{TESTIMONIAL.role}</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Reserve space so the bottom half of the card sits on section yellow, not under the form */}
            <div className="h-44 sm:h-56 lg:h-56" aria-hidden />

            {/* Expert pin */}
            <div
              ref={pinRef}
              className="flex flex-col items-center transition-all duration-700 ease-out"
              style={{
                opacity: showPin ? 1 : 0,
                transform: showPin ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.95)',
              }}
            >
              <button
                onClick={() => setExpanded((v) => !v)}
                className="inline-flex items-center gap-4 bg-white rounded-full pl-1.5 pr-6 py-1.5 shadow-lg ring-1 ring-black/5 hover:shadow-xl hover:ring-brand-gold/30 transition-all duration-300 cursor-pointer"
              >
                <img
                  src="/images/marian-brazdil.png"
                  alt="Marián Brázdil"
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-brand-gold/30"
                />
                <div className="text-left">
                  <p className="text-sm font-bold text-brand-dark leading-tight">Marián Brázdil</p>
                  <p className="text-xs text-gray-400 font-light">Expert na kuchynské povrchy — rád vám poradí</p>
                </div>
                <span className="flex h-2.5 w-2.5 relative ml-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
                </span>
              </button>

              {/* Contact options */}
              <div
                className="flex gap-3 pt-3 transition-all duration-300 ease-out"
                style={{
                  opacity: expanded ? 1 : 0,
                  visibility: expanded ? 'visible' : 'hidden',
                  transform: expanded ? 'translateY(0)' : 'translateY(-6px)',
                  pointerEvents: expanded ? 'auto' : 'none',
                }}
              >
                <a
                  href="mailto:info@orostone.sk?subject=Otázka k vzorkám"
                  className="inline-flex items-center gap-2 bg-white rounded-full px-5 py-2.5 text-sm font-semibold text-brand-dark shadow-md ring-1 ring-black/8 hover:ring-brand-gold/40 hover:shadow-lg transition-all duration-200"
                >
                  <Mail size={15} className="text-brand-gold" />
                  Napísať email
                </a>
                <a
                  href="tel:+421917588738"
                  className="inline-flex items-center gap-2 bg-brand-dark rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-brand-gold hover:text-brand-dark transition-all duration-200"
                >
                  <Phone size={15} />
                  Zavolať
                </a>
              </div>
            </div>
          </div>

          {/* Right — form */}
          <div className="bg-white rounded-2xl shadow-sm p-8 lg:p-10 order-1 lg:order-2">
            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center text-center py-12 gap-4">
                <CheckCircle className="w-14 h-14 text-brand-gold" strokeWidth={1.5} />
                <h3 className="text-2xl font-bold text-brand-dark">Vzorka je na ceste!</h3>
                <p className="text-gray-500 text-base font-light">
                  Vzorku odošleme do 2–3 pracovných dní. Potvrdenie pošleme emailom.
                </p>
              </div>
            ) : (
              <>
                <span className="text-xs tracking-[0.3em] uppercase text-brand-gold font-bold mb-3 block">
                  Zadarmo
                </span>
                <h2 className="text-2xl lg:text-3xl font-bold text-brand-dark mb-2 leading-tight">
                  Zažite kameň naživo
                </h2>
                <p className="text-gray-500 text-base font-light leading-relaxed mb-7">
                  Pošleme vám fyzickú vzorku priamo domov — zadarmo, bez záväzkov. Presvedčte sa o kvalite pred nákupom.
                </p>

                <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                      Meno a priezvisko *
                    </label>
                    <input
                      type="text"
                      name="from_name"
                      required
                      placeholder="Ján Novák"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base text-brand-dark placeholder-gray-300 focus:outline-none focus:border-brand-gold transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="from_email"
                      required
                      placeholder="jan.novak@email.sk"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base text-brand-dark placeholder-gray-300 focus:outline-none focus:border-brand-gold transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                      Telefón <span className="font-normal normal-case text-gray-400">(nepovinné)</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="+421 9XX XXX XXX"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base text-brand-dark placeholder-gray-300 focus:outline-none focus:border-brand-gold transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                      Vybrať dekor *
                    </label>
                    <select
                      name="dekor"
                      required
                      value={dekorValue}
                      onChange={(e) => setDekorValue(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base text-brand-dark focus:outline-none focus:border-brand-gold transition-colors appearance-none bg-white"
                    >
                      <option value="" disabled>Vyberte dekor...</option>
                      {products.map(p => (
                        <option key={p.id} value={p.name}>
                          {p.name} — €{p.pricePerM2}/m²
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* VOP súhlas — povinný */}
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreedToVOP}
                      onChange={(e) => setAgreedToVOP(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-gray-300 accent-brand-gold cursor-pointer flex-shrink-0"
                    />
                    <span className="text-xs text-gray-500">
                      Súhlasím s{' '}
                      <Link to="/vop" target="_blank" rel="noopener noreferrer" className="underline hover:text-brand-dark">
                        obchodnými podmienkami
                      </Link>
                      {' '}a{' '}
                      <Link to="/ochrana-sukromia" target="_blank" rel="noopener noreferrer" className="underline hover:text-brand-dark">
                        ochranou osobných údajov
                      </Link>
                      {' '}*
                    </span>
                  </label>

                  {/* Newsletter súhlas — voliteľný */}
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newsletterConsent}
                      onChange={(e) => setNewsletterConsent(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-gray-300 accent-brand-gold cursor-pointer flex-shrink-0"
                    />
                    <span className="text-xs text-gray-500">
                      Súhlasím so zasielaním noviniek a marketingových ponúk na moju emailovú adresu (voliteľné)
                    </span>
                  </label>

                  {status === 'error' && (
                    <p className="text-red-500 text-sm">{errorMsg}</p>
                  )}

                  {/* Honeypot — skryté pred používateľmi, odhalí boty */}
                  <input type="text" name="website" value={honeypotValue} onChange={(e) => setHoneypotValue(e.target.value)} style={{ display: 'none' }} tabIndex={-1} autoComplete="off" aria-hidden="true" />

                  {/* Turnstile CAPTCHA */}
                  <Turnstile
                    ref={turnstileRef}
                    siteKey={import.meta.env.VITE_TURNSTILE_SITEKEY}
                    onSuccess={setTurnstileToken}
                    onExpire={() => setTurnstileToken(null)}
                    options={{ theme: 'light', language: 'sk' }}
                  />

                  <button
                    type="submit"
                    disabled={status === 'loading' || !agreedToVOP}
                    className="w-full flex items-center justify-center gap-3 bg-brand-dark text-white px-8 py-4 rounded-full text-sm font-bold uppercase tracking-wider hover:bg-brand-gold hover:text-brand-dark transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Odosielam...
                      </>
                    ) : (
                      'Chcem vzorku zadarmo →'
                    )}
                  </button>
                </form>

                {/* Trust badges */}
                <div className="mt-6 pt-6 border-t border-gray-100 flex flex-wrap gap-x-5 gap-y-2">
                  {['Vzorka zadarmo', 'Bez záväzkov', 'Odpovieme do 24h'].map(item => (
                    <span key={item} className="flex items-center gap-1.5 text-xs text-gray-400">
                      <span className="text-brand-gold text-[10px]">✦</span>
                      {item}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>

        </div>
      </div>
      </div>
    </section>
  );
};
