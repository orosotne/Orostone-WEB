import React from 'react';
import { Container, Section, SectionHeader, TextLink } from '../Design';
import feed from '../../data/instagram-feed.json';
import { useOffscreen } from './useOffscreen';

const PROFILE = 'https://www.instagram.com/orostone_/';

/** Latest Instagram posts as portrait 4:5 tiles (as on Instagram) in a slow right-to-left marquee (pauses on hover, focus, off-screen and with reduced motion). The posts and their 600×750 webp tiles are taken at build time (scripts/sync-instagram.ts), so the strip shows them at once instead of waiting for the Instagram API. */
export const HomeInstagram: React.FC = () => {
  const { ref, off } = useOffscreen<HTMLDivElement>();

  const tile = (clone: boolean) =>
    feed.map((post) => (
      <a
        key={`${clone ? 'c' : 'o'}-${post.id}`}
        className={`hp-ig ${clone ? 'hp-ig-clone' : ''}`}
        href={post.permalink || PROFILE}
        target="_blank"
        rel="noopener noreferrer"
        aria-hidden={clone || undefined}
        tabIndex={clone ? -1 : undefined}
        aria-label={clone ? undefined : 'Príspevok Orostone na Instagrame'}
      >
        {/* eager: the strip moves sideways, so lazy images would come in blank; low priority keeps them behind the photos higher up */}
        <img src={post.image} alt="" loading="eager" fetchPriority="low" decoding="async" width={280} height={350} />
      </a>
    ));

  return (
    <Section tone="sand" aria-label="Instagram" className="overflow-x-clip">
      <Container>
        <div className="hp-row">
          <SectionHeader
            eyebrow="@orostone_"
            title="Sledujte nás na Instagrame."
            lead="Realizácie, nové dekory a odpovede na otázky, ktoré pri kuchyni riešite."
          />
          <TextLink to={PROFILE}>Sledovať @orostone_</TextLink>
        </div>
      </Container>
      <div ref={ref} className={`hp-ig-marquee ${off ? 'is-off' : ''}`}>
        <div className="hp-ig-track">
          {tile(false)}
          {tile(true)}
        </div>
      </div>
    </Section>
  );
};
