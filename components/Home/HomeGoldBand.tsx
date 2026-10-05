import React from 'react';
import { ActionButton, Container } from '../Design';
import { ORO_KLIENT, PHONE_HREF, PHONE_LABEL } from './homeData';

/** The only gold surface on the page: the last call to action before the footer. */
export const HomeGoldBand: React.FC = () => (
  <section className="hp-gold" aria-label="Orientačná cena">
    <Container className="hp-gold-in">
      <div>
        <h2 className="text-os-h2">Koľko bude stáť vaša doska?</h2>
        <p>Štyri krátke otázky, vyplníte ich za minútu. Orientačnú cenu pošleme spravidla nasledujúci pracovný deň.</p>
      </div>
      <div className="hp-gold-cta">
        <ActionButton variant="dark" to={ORO_KLIENT('zlaty-pas')} arrow>
          Získať orientačnú cenu
        </ActionButton>
        <a className="hp-gold-phone" href={PHONE_HREF}>alebo zavolajte {PHONE_LABEL}</a>
      </div>
    </Container>
  </section>
);
