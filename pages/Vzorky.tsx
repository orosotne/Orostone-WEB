import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Mail, Phone } from 'lucide-react';
import { SEOHead, createBreadcrumbLD } from '../components/UI/SEOHead';

const SampleLeadSection = React.lazy(() =>
  import('../components/Shop/SampleLeadSection').then((m) => ({ default: m.SampleLeadSection })),
);

export const Vzorky: React.FC = () => {
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

  return (
    <main className="min-h-screen">
      <SEOHead
        title="Vzorky materiálu | OROSTONE — Prémiový sinterovaný kameň"
        description="Objednajte si vzorky sinterovaného kameňa OROSTONE. Vyberte dekor, nechajte kontakt a doručíme vám materiál na rozhodnutie."
        canonical="https://orostone.sk/vzorky"
        structuredData={createBreadcrumbLD([
          { name: 'OROSTONE', url: 'https://orostone.sk/' },
          { name: 'Vzorky', url: 'https://orostone.sk/vzorky' },
        ])}
      />

      <section className="pt-32 pb-16 bg-[#FAFAFA]">
        <div className="container mx-auto px-6 text-center">
          <span className="font-sans text-xs font-bold text-brand-gold tracking-widest uppercase mb-4 block">
            Bezplatné vzorky
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-sans font-bold text-brand-dark mb-6 leading-tight">
            Rozhodujte sa s istotou
          </h1>
          <p className="text-gray-500 text-lg font-light max-w-2xl mx-auto leading-relaxed mb-10">
            Pošleme vám fyzickú vzorku priamo domov — zadarmo, bez záväzkov.
            Presvedčte sa o kvalite a farbe pred každým rozhodnutím.
          </p>

          {/* Expert pin */}
          <div
            ref={pinRef}
            className="inline-flex flex-col items-center transition-all duration-700 ease-out"
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
      </section>

      <Suspense fallback={null}>
        <SampleLeadSection />
      </Suspense>
    </main>
  );
};
