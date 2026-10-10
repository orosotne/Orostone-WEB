import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ActionButton } from '../Design';

// Pages without the bar: product detail has its own sticky cart bar, checkout and legal pages stay clean.
const HIDDEN_PREFIXES = ['/produkt/', '/vzorky', '/checkout', '/objednavka-dokoncena', '/vop', '/ochrana-sukromia', '/cookies', '/odstupenie-od-zmluvy', '/reklamacie', '/doprava', '/podmienky-rezervacie-ceny'];

/** Mobile/tablet bottom bar (below lg): gold price CTA + phone. Slides in after 400 px of scroll. */
export const MobileCtaBar: React.FC = () => {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setVisible((prev) => (prev ? y > 350 : y > 400));
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (HIDDEN_PREFIXES.some((p) => pathname.startsWith(p))) return null;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-[60] flex gap-2.5 border-t border-brand-line bg-brand-light px-4 pb-[calc(10px+env(safe-area-inset-bottom,0px))] pt-2.5 transition-transform duration-300 [transition-timing-function:cubic-bezier(.2,.7,.2,1)] motion-reduce:transition-none lg:hidden ${visible ? 'translate-y-0' : 'translate-y-[110%]'}`}
      aria-hidden={!visible}
      // inert while slid away: its links must not be reachable by Tab or a screen reader
      inert={!visible}
    >
      <ActionButton variant="gold" to="https://oro-klient.orostone.sk/?od=mobil-lista" className="min-h-[50px] flex-1">
        Získať orientačnú cenu
      </ActionButton>
      <a
        href="tel:+421917588738"
        aria-label="Zavolať +421 917 588 738"
        className="os-press grid h-[50px] w-[50px] flex-none place-items-center rounded-[10px] bg-brand-dark text-brand-light"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <path fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" d="M5.2 3.5h3.1l1.6 4.2-2 1.3a11 11 0 0 0 5.1 5.1l1.3-2 4.2 1.6v3.1a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 3.2 5.7a2 2 0 0 1 2-2.2Z" />
        </svg>
      </a>
    </div>
  );
};
