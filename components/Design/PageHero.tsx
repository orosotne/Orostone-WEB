import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from './Container';
import { Eyebrow } from './Eyebrow';
import { Section, type SectionTone } from './Section';

export interface BreadcrumbItem {
  label: string;
  /** Omitted for the current page (the last item) */
  to?: string;
}

interface PageHeroProps {
  /** The page H1 */
  title: React.ReactNode;
  eyebrow?: React.ReactNode;
  /** Shown in place of the eyebrow; mirrors the page's BreadcrumbList JSON-LD */
  breadcrumb?: BreadcrumbItem[];
  lead?: React.ReactNode;
  /** One dark ActionButton and/or TextLinks */
  actions?: React.ReactNode;
  /** A photo (or figure) shown beside the text on desktop and under it on mobile */
  media?: React.ReactNode;
  tone?: SectionTone;
  /** Full-width content under the hero text, e.g. a FeatureGrid */
  children?: React.ReactNode;
}

/** Opening band of a subpage: eyebrow, H1, lead and actions on the left edge, optional photo beside them. */
export const PageHero: React.FC<PageHeroProps> = ({ title, eyebrow, breadcrumb, lead, actions, media, tone = 'chalk', children }) => (
  <Section tone={tone} band={false} className="pb-[var(--os-band)] pt-[clamp(40px,5vw,88px)]">
    <Container>
      <div
        className={
          media ? 'grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-[clamp(48px,6vw,104px)]' : ''
        }
      >
        <div className="grid max-w-[660px] justify-items-start gap-5">
          {breadcrumb ? (
            <nav aria-label="Navigačná cesta">
              <ol className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-os-eyebrow uppercase before:mr-1 before:h-px before:w-7 before:bg-current before:opacity-75 before:content-['']">
                {breadcrumb.map((item, i) => (
                  <li key={item.label} className="flex items-center gap-2.5">
                    {i > 0 && <span aria-hidden="true" className="font-normal text-brand-muted">/</span>}
                    {item.to ? (
                      <Link to={item.to} className="text-brand-muted no-underline transition-colors hover:text-brand-dark">
                        {item.label}
                      </Link>
                    ) : (
                      <span aria-current="page">{item.label}</span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          ) : (
            eyebrow && <Eyebrow>{eyebrow}</Eyebrow>
          )}
          <h1 className="text-os-h1 [text-wrap:balance]">{title}</h1>
          {lead && <p className="max-w-[54ch] text-os-lead font-light text-brand-muted">{lead}</p>}
          {actions && <div className="mt-3 flex flex-wrap items-center gap-x-8 gap-y-4">{actions}</div>}
        </div>
        {media}
      </div>
      {children}
    </Container>
  </Section>
);

interface PageHeroImageProps {
  /** Square source without size and extension: `${base}-800|1600.avif|webp` (made by temp_redizajn/page-assets.mjs) */
  base: string;
  alt: string;
  /** Small credit under the photo, e.g. "Vizualizácia s dekorom Taj Mahal" */
  caption?: React.ReactNode;
  /** object-position of the 4:3 crop on phones and tablets */
  position?: string;
}

const HERO_SIZES = '(min-width: 1800px) 800px, (min-width: 1024px) 46vw, 100vw';

/** The hero photo: square beside the text from 1024 px, 4:3 under it on smaller screens; above the fold, so not lazy. */
export const PageHeroImage: React.FC<PageHeroImageProps> = ({ base, alt, caption, position }) => (
  <figure className="m-0 grid gap-3">
    <picture>
      <source type="image/avif" srcSet={`${base}-800.avif 800w, ${base}-1600.avif 1600w`} sizes={HERO_SIZES} />
      <source type="image/webp" srcSet={`${base}-800.webp 800w, ${base}-1600.webp 1600w`} sizes={HERO_SIZES} />
      <img
        src={`${base}-800.webp`}
        alt={alt}
        width={1600}
        height={1600}
        fetchPriority="high"
        decoding="async"
        className="aspect-[4/3] w-full rounded-[3px] object-cover lg:aspect-square"
        style={position ? { objectPosition: position } : undefined}
      />
    </picture>
    {caption && <figcaption className="text-[0.8rem] font-normal text-brand-muted">{caption}</figcaption>}
  </figure>
);
