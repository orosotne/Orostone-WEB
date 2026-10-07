import React, { useEffect, useRef, useState } from 'react';
import { Container, Section, SectionHeader, TextLink } from '../Design';
import { HOME_REALIZATIONS, ORO_KLIENT } from './homeData';

/** Realizations stand side by side like slabs on a showroom rack; one is pulled out at a time (hover on desktop, tap or keyboard everywhere). */
export const HomeRealizations: React.FC = () => {
  const [open, setOpen] = useState(0);
  const [fineHover, setFineHover] = useState(false);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    setFineHover(window.matchMedia('(hover: hover) and (pointer: fine)').matches);
    return () => clearTimeout(hoverTimer.current);
  }, []);

  return (
    <Section tone="sand" id="realizacie">
      <Container>
        <div className="hp-row">
          <SectionHeader
            eyebrow="Realizácie"
            title="Skutočné kuchyne."
            lead="Realizácie stoja vedľa seba ako platne na stojane v showroome. Vysuňte si ktorúkoľvek a uvidíte celý priestor aj použitý dekor."
          />
          <TextLink to="/realizacie">Všetky realizácie</TextLink>
        </div>
        <div className="hp-rk-rack">
          {HOME_REALIZATIONS.map((r, i) => {
            const isOpen = i === open;
            return (
              <article
                key={r.image}
                className={`hp-rk ${isOpen ? 'is-open' : ''}`}
                style={{ '--pos': r.pos } as React.CSSProperties}
                onMouseEnter={fineHover ? () => { hoverTimer.current = setTimeout(() => setOpen(i), 140); } : undefined}
                onMouseLeave={fineHover ? () => clearTimeout(hoverTimer.current) : undefined}
              >
                <img src={`/images/home/realizacie/${r.image}.webp`} alt={r.alt} width={r.width} height={r.height} loading="lazy" decoding="async" />
                <button
                  type="button"
                  className="hp-rk-open"
                  aria-expanded={isOpen}
                  aria-controls={`rk-${i}`}
                  aria-label={`${r.decor}, ${r.text}`}
                  onClick={() => setOpen(i)}
                >
                  <span className="hp-rk-tag">{r.decor}</span>
                </button>
                <div className="hp-rk-cap" id={`rk-${i}`}>
                  <span>
                    <b>{r.decor}</b>
                    <span>{r.text}</span>
                  </span>
                  <TextLink to={ORO_KLIENT('realizacie', r.decorSlug)}>Chcem podobnú kuchyňu</TextLink>
                </div>
              </article>
            );
          })}
        </div>
        <p className="hp-note">Fotky sú z montáží u klientov. Ak je fotka upravená, píšeme to pri nej. Názvy dekorov sú z čias realizácie.</p>
      </Container>
    </Section>
  );
};
