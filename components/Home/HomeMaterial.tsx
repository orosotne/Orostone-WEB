import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowIcon, Container, Eyebrow, Section } from '../Design';
import { HOME_DECORS, decorImage } from './homeData';
import { OrostoneMark } from './OrostoneMark';

const START = HOME_DECORS.findIndex((d) => d.slug === 'calacatta-top');

/** Why sintered stone: one whole slab with four properties pinned to it; the slab can be switched through all 12 decors. */
export const HomeMaterial: React.FC = () => {
  const [index, setIndex] = useState(START < 0 ? 0 : START);
  const [shown, setShown] = useState(index);
  const [swapping, setSwapping] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Fade the slab out, change the decor, fade back in (instant with reduced motion)
  useEffect(() => {
    if (index === shown) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setSwapping(true);
    timer.current = setTimeout(() => {
      setShown(index);
      setSwapping(false);
    }, reduce ? 0 : 180);
    return () => clearTimeout(timer.current);
  }, [index, shown]);

  const step = (dir: 1 | -1) => setIndex((i) => (i + dir + HOME_DECORS.length) % HOME_DECORS.length);
  const d = HOME_DECORS[index];
  const visible = HOME_DECORS[shown];

  return (
    <Section tone="graphite" id="material" className="os-on-dark hp-noise">
      <Container>
        <div className="hp-mat-head">
          <OrostoneMark className="hp-mark" />
          <Eyebrow gold>Prečo sinterovaný kameň</Eyebrow>
          <h2 className="text-os-h2">Kameň, ktorý netreba impregnovať.</h2>
          <p className="hp-mat-lead">
            Minerály sa lisujú pod obrovským tlakom a spájajú teplom do jednej dosky. Víno, olej ani káva sa preto nemajú kam vpiť a povrch zvládne každodenné varenie bez ochranných náterov.
          </p>
        </div>
        <div className="hp-mat-stage">
          <ul className="hp-pins hp-pins-l">
            <li><b>&lt; 0,1&nbsp;%</b><span>nasiakavosť, škvrny ostanú na povrchu</span></li>
            <li><b>300&nbsp;°C</b><span>horúci hrniec položíte priamo na dosku</span></li>
          </ul>
          <figure className="hp-viewer-slab">
            <img
              src={decorImage(visible.slug)}
              alt={`Celá platňa ${visible.name}`}
              width={520}
              height={931}
              loading="lazy"
              decoding="async"
              className={swapping ? 'is-swap' : undefined}
            />
          </figure>
          <ul className="hp-pins hp-pins-r">
            <li><b>Mohs 7+</b><span>povrch odolá bežnému poškriabaniu</span></li>
            <li><b>UV</b><span>stabilná farba, ani pri veľkom okne nebledne</span></li>
          </ul>
          <div className="hp-viewer-bar">
            <button type="button" className="hp-round hp-round-dark" aria-label="Predchádzajúci dekor" onClick={() => step(-1)}>
              <ArrowIcon className="h-[18px] w-[18px] rotate-180" />
            </button>
            <div className="hp-viewer-name" aria-live="polite">
              <small>{d.label}</small>
              <b>{d.name}</b>
              <span>{index + 1} / {HOME_DECORS.length} · 3&nbsp;200&nbsp;×&nbsp;1&nbsp;600&nbsp;mm</span>
              <Link className="hp-viewer-link" to={`/produkt/${d.slug}`}>Pozrieť dekor</Link>
            </div>
            <button type="button" className="hp-round hp-round-dark" aria-label="Ďalší dekor" onClick={() => step(1)}>
              <ArrowIcon className="h-[18px] w-[18px]" />
            </button>
          </div>
        </div>
        <p className="hp-claim">Krása kameňa. Sila technológie.</p>
      </Container>
    </Section>
  );
};
