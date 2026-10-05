import React from 'react';
import { ActionButton } from './ActionButton';
import { Container } from './Container';
import { oroKlientUrl, PHONE_HREF, PHONE_LABEL } from './links';

interface GoldBandProps {
  /** ?od= value of the oro-klient link, e.g. "kuchyne" */
  od: string;
  title?: React.ReactNode;
  text?: React.ReactNode;
}

/** The only gold surface of a page: the last call to action before the footer (orientačná cena on oro-klient). */
export const GoldBand: React.FC<GoldBandProps> = ({
  od,
  title = 'Koľko bude stáť vaša doska?',
  text = 'Štyri krátke otázky, vyplníte ich za minútu. Orientačnú cenu pošleme spravidla nasledujúci pracovný deň.',
}) => (
  <section className="bg-brand-gold py-[clamp(64px,8vw,108px)] text-brand-dark" aria-label="Orientačná cena">
    <Container className="flex flex-wrap items-center justify-between gap-x-12 gap-y-7">
      <div>
        <h2 className="text-os-h2">{title}</h2>
        <p className="mt-3.5 max-w-[48ch] text-[1.08rem] font-normal">{text}</p>
      </div>
      <div className="grid justify-items-start gap-3.5">
        <ActionButton variant="dark" to={oroKlientUrl(od)} arrow>
          Získať orientačnú cenu
        </ActionButton>
        <a className="text-[0.95rem] font-medium tabular-nums underline underline-offset-[5px]" href={PHONE_HREF}>
          alebo zavolajte {PHONE_LABEL}
        </a>
      </div>
    </Container>
  </section>
);
