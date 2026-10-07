import React from 'react';
import { ActionButton, Container, Eyebrow, Section, SectionHeader, TextLink } from '../Design';
import { OrostoneMarkPaths } from './OrostoneMark';
import { GOOGLE_RATING, GOOGLE_REVIEWS_URL, HOME_REVIEWS, MAPS_URL, PHONE_HREF } from './homeData';
import { useOffscreen } from './useOffscreen';

/** Rotating seal over the castle photo: the text ring turns, the logo stays upright. */
const Seal: React.FC = () => {
  const { ref, off } = useOffscreen<SVGSVGElement>();
  return (
    <svg ref={ref} className={`hp-seal ${off ? 'is-off' : ''}`} viewBox="0 0 120 120" aria-hidden="true">
      <defs>
        <path id="hp-seal-path" d="M60,60 m-45,0 a45,45 0 1,1 90,0 a45,45 0 1,1 -90,0" />
      </defs>
      <circle cx="60" cy="60" r="59" fill="#1A1A1A" />
      <g className="hp-seal-ring">
        <text>
          <textPath href="#hp-seal-path" textLength="276" lengthAdjust="spacing">
            Renesančný kaštieľ ✦ Bošany ✦{' '}
          </textPath>
        </text>
      </g>
      <circle cx="60" cy="60" r="37.5" fill="none" stroke="#ECD488" strokeOpacity=".35" strokeWidth=".6" />
      <g transform="translate(37.85 37.87) scale(1.05)" style={{ color: '#ECD488' }}>
        <OrostoneMarkPaths />
      </g>
    </svg>
  );
};

// Only real, verbatim reviews from the Google profile (EU rules on consumer reviews: say where they come from)
const REVIEWS = HOME_REVIEWS;

/** The strongest proof of the brand: the showroom in the castle, and what clients say. */
export const HomeShowroom: React.FC = () => (
  <Section tone="sand" id="showroom" className="overflow-x-clip">
    <Container className="hp-show-in">
      <figure className="hp-show-img">
        <Seal />
        <img src="/images/home/showroom-kastiel.webp" alt="Renesančný kaštieľ v Bošanoch, showroom Orostone" width={1448} height={1086} loading="lazy" decoding="async" />
      </figure>
      <div className="hp-show-txt">
        <SectionHeader
          eyebrow="Showroom"
          title="Platne si pozriete v kaštieli."
          lead="V renesančnom kaštieli v Bošanoch sú vystavené celé platne. Pri dennom svetle porovnáte dekory vo veľkej ploche a vyberiete si konkrétnu platňu, nielen dekor."
        />
        <dl className="hp-show-meta">
          <div><dt>Adresa</dt><dd>SNP 113/1, 956 18 Bošany</dd></div>
          <div><dt>Otvorené</dt><dd>Po–Pia 9:00–17:00, cez víkend po dohode</dd></div>
        </dl>
        <div className="hp-cta-row">
          <ActionButton variant="dark" to={PHONE_HREF}>Dohodnúť návštevu</ActionButton>
          <TextLink to={MAPS_URL}>Zobraziť na mape</TextLink>
        </div>
      </div>
    </Container>

    <Container className="hp-reviews">
      <h3 className="text-os-h3 mb-6">Čo hovoria klienti</h3>
      <div className={`hp-rev-in ${REVIEWS.length ? '' : 'hp-rev-solo'}`}>
        <div className="hp-rating hp-noise os-on-dark">
          <Eyebrow gold>Recenzie</Eyebrow>
          <p className="hp-rating-score">
            <b>{GOOGLE_RATING.value}</b>
            <span className="hp-rating-stars" aria-hidden="true">★★★★★</span>
            <span className="sr-only">z 5 hviezdičiek</span>
          </p>
          <p className="hp-rating-text">
            Hodnotenie z {GOOGLE_RATING.count} recenzií na Google. Klienti oceňujú hlavne vysvetlenie rozdielov medzi materiálmi a možnosť pozrieť si platne naživo.
          </p>
          <TextLink to={GOOGLE_REVIEWS_URL}>Všetky recenzie na Google</TextLink>
        </div>
        {REVIEWS.length > 0 && <div className="hp-quotes">
          {REVIEWS.map((t) => (
            <blockquote key={t.name}>
              <p>„{t.quote}“</p>
              <footer>
                <b>{t.name}</b>
                <span>Recenzia na Google</span>
              </footer>
            </blockquote>
          ))}
        </div>}
      </div>
    </Container>
  </Section>
);
