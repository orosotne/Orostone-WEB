import React from 'react';
import { ActionButton, Container, Eyebrow } from '../Design';
import { useCookies } from '../../context/CookieContext';
import { DINING_TABLES_URL, trackDiningTablesPromotionClick } from '../../services/diningTablesAnalytics';

/** A separate shop entry, without changing the slab catalogue or its purchase flow. */
export const HomeDiningTables: React.FC = () => {
  const { hasConsented, preferences } = useCookies();

  return (
  <section className="hp-dining" aria-labelledby="dining-tables-heading">
    <Container className="hp-dining-in">
      <div className="hp-dining-copy">
        <Eyebrow className="hp-dining-eyebrow">Orotable · Jedálenské stoly</Eyebrow>
        <h2 id="dining-tables-heading">Orostone má aj<br />jedálenské stoly.</h2>
        <p>Pevné aj rozkladacie modely. Pozrite si celú kolekciu a vyberte si stôl pre svoj priestor.</p>
        <div className="hp-dining-action">
          <ActionButton
            to={DINING_TABLES_URL}
            arrow
            onClick={() => trackDiningTablesPromotionClick(hasConsented, preferences.analytics)}
          >Pozrieť jedálenské stoly</ActionButton>
        </div>
      </div>
      <figure className="hp-dining-image">
        <span className="hp-dining-new">Novinka</span>
        <img
          src="/images/home/orotable-pisa-tower-960.webp"
          srcSet="/images/home/orotable-pisa-tower-960.webp 960w, /images/home/orotable-pisa-tower-1600.webp 1600w"
          sizes="(max-width: 760px) calc(100vw - 40px), (max-width: 1800px) 48vw, 800px"
          width={1600}
          height={1200}
          alt="Jedálenský stôl Pisa Tower: celá oválna doska so svetlou kresbou a naklonená centrálna podnož."
          loading="lazy"
          decoding="async"
        />
        <figcaption>Pisa Tower <span>z kolekcie Orotable</span></figcaption>
      </figure>
    </Container>
  </section>
  );
};
