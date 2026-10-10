import React from 'react';
import { Container, useDrawIn, IconCastle, IconSlabs, IconPriceClock, IconFabrication } from '../Design';

const FACTS = [
  { Icon: IconCastle, title: 'Showroom v kaštieli', text: 'Celé platne pri dennom svetle, Bošany' },
  { Icon: IconSlabs, title: '12 dekorov skladom', text: 'Platne 3\u00A0200\u00A0×\u00A01\u00A0600\u00A0mm, hrúbka 12\u00A0mm' },
  { Icon: IconPriceClock, title: 'Orientačná cena do druhého dňa', text: 'Štyri krátke otázky, vyplníte ich za minútu' },
  { Icon: IconFabrication, title: 'Výroba a montáž', text: 'Zabezpečia skúsení partnerskí kamenári' },
] as const;

/** Four answers a client looks for first: where to see it, what is in stock, when the price comes, who builds it. */
export const HomeFacts: React.FC = () => {
  const draw = useDrawIn<HTMLDivElement>();
  return (
    <section className="hp-facts" aria-label="Prečo Orostone">
      <Container>
        <div ref={draw.ref} className={`hp-facts-in ${draw.className}`}>
          {FACTS.map(({ Icon, title, text }, i) => (
            <div key={title} className="hp-fact os-ico-item" style={{ '--d': `${i * 0.07}s` } as React.CSSProperties}>
              <Icon className="hp-fact-ico" />
              <b>{title}</b>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
