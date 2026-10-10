import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Container, Section, SectionHeader, TextLink } from '../Design';
import { BLOG_ARTICLES_META } from '../../data/blogArticlesMeta';
import { BLOG_CATEGORY_LABELS } from '../../data/blogTypes';
import { HOME_GUIDES } from './homeData';

const easeWave = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const A = 7; // wave amplitude in %
// At rest the photo already peeks in under a thin gold wave, so the cards are not three empty dark blocks
const REST = 0.2;

/** clip-path polygon: a wavy edge that rises from the bottom (prog 0) to the top (prog 1) */
const wavePoly = (prog: number, phase: number) => {
  const env = Math.sin(Math.PI * prog);
  const base = 100 + A - prog * (100 + 2 * A);
  const pts: string[] = [];
  for (let i = 0; i <= 24; i++) {
    const x = (i / 24) * 100;
    const y = base + A * env * Math.sin((x / 100) * Math.PI * 2.3 + phase);
    pts.push(`${x.toFixed(2)}% ${y.toFixed(2)}%`);
  }
  pts.push('100% 150%', '0% 150%');
  return `polygon(${pts.join(',')})`;
};

interface GuideCardProps {
  slug: string;
  title: string;
  titleEm: string;
  image: string;
  category: string;
  minutes: number;
}

/** Wave edge of the photo layer and, a hair above it, of the gold layer. */
const paint = (photo: HTMLElement, wave: HTMLElement, prog: number, phase: number) => {
  photo.style.clipPath = wavePoly(prog, phase);
  wave.style.clipPath = wavePoly(Math.min(1, prog + 0.025 * Math.sin(Math.PI * prog)), phase + 0.25);
};

/**
 * Blog card: the article's hero photo peeks in at the bottom under a gold wave; on hover/focus (on touch screens
 * when scrolled into view) the wave pulls the photo all the way up.
 */
const GuideCard: React.FC<GuideCardProps> = ({ slug, title, titleEm, image, category, minutes }) => {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const photoRef = useRef<HTMLSpanElement>(null);
  const waveRef = useRef<HTMLSpanElement>(null);
  const anim = useRef({ p: REST, from: REST, to: REST, start: 0, dur: 1, raf: 0 });

  const run = (target: number) => {
    const card = cardRef.current;
    const photo = photoRef.current;
    const wave = waveRef.current;
    if (!card || !photo || !wave) return;
    card.classList.toggle('is-on', target === 1);
    const a = anim.current;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      a.p = target;
      if (target === 1) photo.style.clipPath = wave.style.clipPath = 'none';
      else paint(photo, wave, target, 0);
      return;
    }
    a.from = a.p;
    a.to = target;
    a.start = performance.now();
    a.dur = (target === 1 ? 1100 : 800) * Math.max(0.4, Math.abs(a.to - a.from));
    const frame = (now: number) => {
      const k = Math.min(1, (now - a.start) / a.dur);
      const phase = now / 520;
      a.p = a.from + (a.to - a.from) * easeWave(k);
      paint(photo, wave, a.p, phase);
      a.raf = k < 1 ? requestAnimationFrame(frame) : 0;
    };
    if (!a.raf) a.raf = requestAnimationFrame(frame);
  };

  useEffect(() => {
    const a = anim.current;
    const card = cardRef.current;
    if (photoRef.current && waveRef.current) paint(photoRef.current, waveRef.current, REST, 0);
    let io: IntersectionObserver | undefined;
    if (card && window.matchMedia('(hover: none)').matches && 'IntersectionObserver' in window) {
      io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            run(1);
            io?.disconnect();
          }
        },
        { threshold: 0.6 },
      );
      io.observe(card);
    }
    return () => {
      io?.disconnect();
      cancelAnimationFrame(a.raf);
    };
    // run only reads refs
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Link
      ref={cardRef}
      to={`/blog/${slug}`}
      className="hp-guide hp-noise"
      onMouseEnter={() => run(1)}
      onMouseLeave={() => run(REST)}
      onFocus={() => run(1)}
      onBlur={() => run(REST)}
    >
      <span ref={waveRef} className="hp-g-layer hp-g-wave" aria-hidden="true" />
      <span ref={photoRef} className="hp-g-layer hp-g-photo" aria-hidden="true">
        <img src={image} alt="" width={900} height={765} loading="lazy" decoding="async" />
      </span>
      <span className="hp-g-cat">{category}</span>
      <h3>
        {title} <em>{titleEm}</em>
      </h3>
      <span className="hp-g-time">{minutes} min čítania</span>
    </Link>
  );
};

export const HomeGuides: React.FC = () => {
  const cards = HOME_GUIDES.map((g) => {
    const meta = BLOG_ARTICLES_META.find((m) => m.slug === g.slug);
    return meta ? { ...g, image: meta.heroImage, category: BLOG_CATEGORY_LABELS[meta.category].sk, minutes: meta.readTimeMinutes } : null;
  }).filter((c): c is NonNullable<typeof c> => c !== null);

  return (
    <Section tone="chalk" aria-label="Poradňa">
      <Container>
        <div className="hp-row">
          <SectionHeader eyebrow="Poradňa" title="Skôr než sa rozhodnete." />
          <TextLink to="/blog">Všetky články</TextLink>
        </div>
        <div className="hp-guide-grid">
          {cards.map((c) => (
            <GuideCard key={c.slug} {...c} />
          ))}
        </div>
      </Container>
    </Section>
  );
};
