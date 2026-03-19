import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { CheckCircle, Loader2 } from 'lucide-react';
import { useShopifyProducts } from '../../hooks/useShopifyProducts';
import { RotatingBadge } from '../UI/RotatingBadge';

const TESTIMONIAL = {
  quote: 'Bezplatná vzorka nám ušetrila množstvo času. Videli sme aj cítili kvalitu materiálu ešte pred objednávkou — klienti boli presvedčení okamžite.',
  name: 'Arch. Zuzana Nováková',
  role: 'Studio Z, Bratislava',
  avatar: 'https://i.pravatar.cc/64?img=47',
};

const LIFESTYLE_IMAGE = '/images/sample-lead.webp';

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

export const SampleLeadSection: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const { products } = useShopifyProducts();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;

    setStatus('loading');
    setErrorMsg('');

    try {
      await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID || '',
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '',
        formRef.current,
        { publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '' },
      );
      setStatus('success');
    } catch {
      setStatus('error');
      setErrorMsg('Niečo sa nepodarilo. Skúste nás kontaktovať priamo na info@orostone.sk');
    }
  };

  return (
    <section className="relative bg-[#ECD488]" style={{ overflow: 'clip', overflowX: 'hidden' }}>

      {/* Top wave — animated by horizontal translate */}
      <div className="absolute top-0 left-0 w-full leading-none pointer-events-none" style={{ height: '80px', overflow: 'clip' }}>
        <svg
          viewBox="0 0 2880 80"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute top-0 left-0 h-full"
          style={{ width: '200%', animation: 'waveSlideLeft 8s linear infinite' }}
          preserveAspectRatio="none"
        >
          {/* two full cycles side by side so the loop is seamless */}
          <path
            d="M0,40 C180,80 360,0 540,40 C720,80 900,0 1080,40 C1260,80 1440,0 1620,40 C1800,80 1980,0 2160,40 C2340,80 2520,0 2700,40 C2880,80 2880,0 2880,0 L0,0 Z"
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
            d="M0,40 C180,0 360,80 540,40 C720,0 900,80 1080,40 C1260,0 1440,80 1620,40 C1800,0 1980,80 2160,40 C2340,0 2520,80 2700,40 C2880,0 2880,80 2880,80 L0,80 Z"
            fill="#FAFAFA"
          />
        </svg>
      </div>

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

          {/* Left — lifestyle photo + testimonial overlay */}
          <div className="relative">
            <div className="badge-blink-delay-1 absolute -top-16 -left-16 z-30 pointer-events-none hidden lg:block">
              <RotatingBadge variant="dark-white" />
            </div>
            <div className="relative rounded-2xl overflow-hidden aspect-[4/5] lg:aspect-auto lg:h-[600px]">
              <img
                src={LIFESTYLE_IMAGE}
                alt="Prémiové vzorky sinterovaného kameňa OROSTONE v elegantnom balení"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-brand-dark/10 to-transparent" />

              {/* Testimonial card */}
            <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-brand-gold fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-white text-sm lg:text-base font-light leading-relaxed italic mb-4">
                "{TESTIMONIAL.quote}"
              </p>
              <div className="flex items-center gap-3">
                <img
                  src={TESTIMONIAL.avatar}
                  alt={TESTIMONIAL.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-brand-gold"
                />
                <div>
                  <p className="text-white text-sm font-semibold">{TESTIMONIAL.name}</p>
                  <p className="text-gray-400 text-xs">{TESTIMONIAL.role}</p>
                </div>
              </div>
            </div>
          </div>
          </div>

          {/* Right — form */}
          <div className="bg-white rounded-2xl shadow-sm p-8 lg:p-10">
            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center text-center py-12 gap-4">
                <CheckCircle className="w-14 h-14 text-brand-gold" strokeWidth={1.5} />
                <h3 className="text-2xl font-bold text-brand-dark">Vzorka je na ceste!</h3>
                <p className="text-gray-500 text-base font-light">
                  Ozveme sa vám do 24 hodín s potvrdením a detailmi doručenia.
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
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-brand-dark placeholder-gray-300 focus:outline-none focus:border-brand-gold transition-colors"
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
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-brand-dark placeholder-gray-300 focus:outline-none focus:border-brand-gold transition-colors"
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
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-brand-dark placeholder-gray-300 focus:outline-none focus:border-brand-gold transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                      Vybrať dekor *
                    </label>
                    <select
                      name="dekor"
                      required
                      defaultValue=""
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-brand-dark focus:outline-none focus:border-brand-gold transition-colors appearance-none bg-white"
                    >
                      <option value="" disabled>Vyberte dekor...</option>
                      {products.map(p => (
                        <option key={p.id} value={p.name}>
                          {p.name} — €{p.pricePerM2}/m²
                        </option>
                      ))}
                    </select>
                  </div>

                  {status === 'error' && (
                    <p className="text-red-500 text-sm">{errorMsg}</p>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'loading'}
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
                  {['Doprava zadarmo', 'Bez záväzkov', 'Odpovieme do 24h'].map(item => (
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
