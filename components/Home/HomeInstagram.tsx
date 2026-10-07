import React, { useEffect, useState } from 'react';
import { Container, Section, SectionHeader, TextLink } from '../Design';
import { useInstagramFeed, getPostImageUrl } from '../../hooks/useInstagramFeed';
import { useOffscreen } from './useOffscreen';

const PROFILE = 'https://www.instagram.com/orostone_/';

/** Latest Instagram posts as portrait 4:5 tiles (as on Instagram) in a slow right-to-left marquee (pauses on hover, focus, off-screen and with reduced motion). */
export const HomeInstagram: React.FC = () => {
  const { ref, off } = useOffscreen<HTMLDivElement>();
  const [enabled, setEnabled] = useState(false);
  const { posts } = useInstagramFeed(8, enabled);

  // Fetch the feed only when the section gets close to the viewport
  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) {
      setEnabled(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setEnabled(true);
          io.disconnect();
        }
      },
      { rootMargin: '600px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);

  const tile = (clone: boolean) =>
    posts.map((post) => (
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
        {/* eager: the strip moves sideways, so lazy images would come in blank; the feed itself loads only near the viewport */}
        <img src={getPostImageUrl(post)} alt="" loading="eager" decoding="async" width={280} height={350} />
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
