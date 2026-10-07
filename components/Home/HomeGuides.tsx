import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Container, Section, SectionHeader, TextLink } from '../Design';
import { BLOG_ARTICLES_META } from '../../data/blogArticlesMeta';
import { BLOG_CATEGORY_LABELS } from '../../data/blogTypes';
import { HOME_GUIDES } from './homeData';

const easeWave = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const A = 7; // wave amplitude in %

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

/** Blog card: on hover/focus (on touch screens when scrolled into view) a gold wave pulls the article's hero photo up. */
const GuideCard: React.FC<GuideCardProps> = ({ slug, title, titleEm, image, category, minutes }) => {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const photoRef = useRef<HTMLSpanElement>(null);
  const waveRef = useRef<HTMLSpanElement>(null);
  const anim = useRef({ p: 0, from: 0, to: 0, start: 0, dur: 1, raf: 0 });

  const run = (target: 0 | 1) => {
    const card = cardRef.current;
    const photo = photoRef.current;
    const wave = waveRef.current;
    if (!card || !photo || !wave) return;
    card.classList.toggle('is-on', target === 1);
    const a = anim.current;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      a.p = target;
      photo.style.clipPath = wave.style.clipPath = target ? 'none' : '';
      return;
    }
    a.from = a.p;
    a.to = target;
    a.start = performance.now();
    a.dur = (target ? 1100 : 800) * Math.max(0.4, Math.abs(a.to - a.from));
    const frame = (now: number) => {
      const k = Math.min(1, (now - a.start) / a.dur);
      const phase = now / 520;
      a.p = a.from + (a.to - a.from) * easeWave(k);
      photo.style.clipPath = wavePoly(a.p, phase);
      wave.style.clipPath = wavePoly(Math.min(1, a.p + 0.025 * Math.sin(Math.PI * a.p)), phase + 0.25);
      a.raf = k < 1 ? requestAnimationFrame(frame) : 0;
    };
    if (!a.raf) a.raf = requestAnimationFrame(frame);
  };

  useEffect(() => {
    const a = anim.current;
    const card = cardRef.current;
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
      onMouseLeave={() => run(0)}
      onFocus={() => run(1)}
      onBlur={() => run(0)}
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
