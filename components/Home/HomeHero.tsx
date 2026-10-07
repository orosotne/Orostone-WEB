import React from 'react';
import { ActionButton, TextLink } from '../Design';

const IMG = '/images/home/hero-nero';

/** Quiet hero: one real-decor visualization, headline on the plaster wall, free-sample button + decors link. */
export const HomeHero: React.FC = () => (
  <section className="hp-hero" aria-label="Úvod">
    <picture>
      <source media="(max-width: 900px)" type="image/avif" srcSet={`${IMG}-tall.avif`} />
      <source media="(max-width: 900px)" type="image/webp" srcSet={`${IMG}-tall.webp`} />
      <source type="image/avif" srcSet={`${IMG}-2560.avif 2560w, ${IMG}-3840.avif 3840w`} sizes="100vw" />
      <source type="image/webp" srcSet={`${IMG}-2560.webp 2560w, ${IMG}-3840.webp 3840w`} sizes="100vw" />
      <img
        className="hp-hero-img"
        src={`${IMG}-2560.jpg`}
        alt="Kuchyňa s ostrovčekom ako čierny monolit v dekore Nero Margiua, čelný pohľad"
        width={2560}
        height={1086}
        fetchPriority="high"
        decoding="async"
      />
    </picture>
    <div className="hp-hero-in">
      <h1>
        Sinterovaný kameň pre kuchyne, kde nechcete robiť <em>kompromis.</em>
      </h1>
      <p className="hp-hero-lead">Pracovné dosky, ostrovčeky a zásteny.</p>
      <p className="hp-hero-links">
        <ActionButton to="/vzorky" arrow>
          Prvá vzorka zadarmo
        </ActionButton>
        <TextLink to="#dekory">Pozrieť dekory</TextLink>
      </p>
    </div>
    <p className="hp-hero-credit">Vizualizácia s dekorom Nero Margiua</p>
  </section>
);
