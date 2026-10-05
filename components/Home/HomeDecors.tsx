import React, { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowIcon, Container, Section, SectionHeader, TextLink } from '../Design';
import { useShopifyProducts } from '../../hooks/useShopifyProducts';
import { BULK_DISCOUNT } from '../../data/pricing';
import { DEFAULT_SLAB_AREA_M2 } from '../../lib/slab';
import { DECOR_FILTERS, HOME_DECORS, decorImage, type DecorGroup } from './homeData';

const eur = (n: number, digits = 2) =>
  new Intl.NumberFormat('sk-SK', { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(n);

let productChunkPrefetched = false;
const prefetchProductPage = () => {
  if (productChunkPrefetched) return;
  productChunkPrefetched = true;
  import('../../pages/ShopProductDetail');
};

/** All 12 decors as whole slabs in true 1 : 2 proportion, a filter, and the whole Givenchy Gold slab with dimensions. */
export const HomeDecors: React.FC = () => {
  const [filter, setFilter] = useState<'all' | DecorGroup>('all');
  const rackRef = useRef<HTMLDivElement>(null);
  const { products } = useShopifyProducts();

  // Lowest price per m² of the sintered-stone catalog (live Shopify data, fallback catalog offline)
  const priceFrom = useMemo(() => {
    const prices = products
      .filter((p) => p.category === 'sintered-stone' && typeof p.pricePerM2 === 'number' && p.pricePerM2 > 0)
      .map((p) => p.pricePerM2);
    return prices.length ? Math.min(...prices) : null;
  }, [products]);

  const reduce = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const choose = (id: 'all' | DecorGroup) => {
    setFilter(id);
    rackRef.current?.scrollTo({ left: 0, behavior: reduce() ? 'auto' : 'smooth' });
  };

  const scrollRack = (dir: 1 | -1) => {
    const rack = rackRef.current;
    if (!rack) return;
    const slab = rack.querySelector<HTMLElement>('.hp-slab:not([hidden])');
    const step = slab ? slab.getBoundingClientRect().width + 22 : 220;
    rack.scrollBy({ left: dir * step * 3, behavior: reduce() ? 'auto' : 'smooth' });
  };

  const counts = (id: 'all' | DecorGroup) => (id === 'all' ? HOME_DECORS.length : HOME_DECORS.filter((d) => d.group === id).length);

  return (
    <Section tone="sand" id="dekory">
      <Container className="hp-row">
        <SectionHeader
          eyebrow="Dekory"
          title="Dekory vo veľkej ploche."
          lead="Pri pracovnej doske rozhoduje kresba vo veľkej ploche, nie malý výrez na vzorke. Preto tu vidíte celé platne."
        />
        <div className="hp-decors-tools">
          <div className="hp-filters" role="group" aria-label="Filtrovať dekory">
            {DECOR_FILTERS.map(({ id, label }) => (
              <button key={id} type="button" className="hp-chip" aria-pressed={filter === id} onClick={() => choose(id)}>
                {label} <span>{counts(id)}</span>
              </button>
            ))}
          </div>
          <div className="hp-rack-nav">
            <button type="button" className="hp-round" aria-label="Predchádzajúce dekory" onClick={() => scrollRack(-1)}>
              <ArrowIcon className="h-[18px] w-[18px] rotate-180" />
            </button>
            <button type="button" className="hp-round" aria-label="Ďalšie dekory" onClick={() => scrollRack(1)}>
              <ArrowIcon className="h-[18px] w-[18px]" />
            </button>
          </div>
        </div>
      </Container>

      <div className="hp-rack" ref={rackRef} tabIndex={0} aria-label="Dvanásť dekorov, posúvajte do strany">
        <div className="hp-scale" aria-hidden="true">
          <i />
          <span>3 200 mm</span>
        </div>
        {HOME_DECORS.map((d) => (
          <Link
            key={d.slug}
            to={`/produkt/${d.slug}`}
            className="hp-slab"
            hidden={filter !== 'all' && d.group !== filter}
            onPointerEnter={prefetchProductPage}
          >
            <span className="hp-slab-img">
              <img src={decorImage(d.slug)} alt="" width={520} height={931} loading="lazy" decoding="async" />
            </span>
            <span className="hp-slab-cap">
              <small>{d.label}</small>
              <b>{d.name}</b>
              <em>Pozrieť dekor</em>
            </span>
          </Link>
        ))}
      </div>

      <Container>
        <div className="hp-decors-foot">
          {priceFrom !== null && (
            <p>
              Ceny od <b>{eur(priceFrom)}&nbsp;€</b> za m² s DPH, celá platňa od {eur(Math.round(priceFrom * DEFAULT_SLAB_AREA_M2), 0)}&nbsp;€.
              {' '}Od {BULK_DISCOUNT.quantity} platní zľava {BULK_DISCOUNT.discountPercent}&nbsp;%.
            </p>
          )}
          <div className="hp-links">
            <TextLink to="/cennik">Celý cenník</TextLink>
            <TextLink to="/vzorky">Objednať vzorku zadarmo</TextLink>
          </div>
        </div>

        <figure className="hp-slab-full">
          <div className="hp-slab-frame">
            <img
              src="/images/home/givenchy-gold-platna-1920.webp"
              srcSet="/images/home/givenchy-gold-platna-1920.webp 1920w, /images/home/givenchy-gold-platna-3840.webp 3840w"
              sizes="(min-width: 1800px) 1550px, 88vw"
              alt="Celá platňa dekoru Givenchy Gold, 3 200 × 1 600 mm"
              width={1920}
              height={960}
              loading="lazy"
              decoding="async"
            />
            <span className="hp-dim hp-dim-h" aria-hidden="true"><span>3 200 mm</span></span>
            <span className="hp-dim hp-dim-v" aria-hidden="true"><span>1 600 mm</span></span>
          </div>
          <figcaption>
            <span>Givenchy Gold · celá platňa, hrúbka 12 mm</span>
            <TextLink to="/produkt/givenchy-gold">Pozrieť dekor</TextLink>
          </figcaption>
        </figure>
      </Container>
    </Section>
  );
};
