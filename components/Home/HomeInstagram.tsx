import React, { useEffect, useRef } from 'react';
import { Container, Section, SectionHeader, TextLink } from '../Design';
import feed from '../../data/instagram-feed.json';
import { useOffscreen } from './useOffscreen';

const PROFILE = 'https://www.instagram.com/orostone_/';
/** Auto-scroll speed in px/s and how long it waits after the visitor swipes, scrolls or hovers. */
const SPEED = 24;
const RESUME_MS = 2500;

/** Latest Instagram posts as portrait 4:5 tiles (as on Instagram) in a slow right-to-left marquee that can also be swiped or scrolled by hand (it drives scrollLeft, so the strip stays a normal scroller; pauses while touched, hovered, focused, off-screen and with reduced motion). The posts and their 600×750 webp tiles are taken at build time (scripts/sync-instagram.ts), so the strip shows them at once instead of waiting for the Instagram API. */
export const HomeInstagram: React.FC = () => {
  const { ref, off } = useOffscreen<HTMLDivElement>();
  const hold = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || off || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let pos = el.scrollLeft;
    let written = pos;
    let last = performance.now();
    let frame = 0;
    const pause = () => {
      hold.current = performance.now() + RESUME_MS;
    };
    // our own writes also fire scroll events; anything else (momentum after a swipe, trackpad) is the visitor
    const onScroll = () => {
      if (Math.abs(el.scrollLeft - written) > 2) pause();
    };
    const tick = (now: number) => {
      const dt = Math.min(now - last, 100);
      last = now;
      const half = el.scrollWidth / 2;
      const busy = now < hold.current || el.matches(':focus-within') || (el.matches(':hover') && matchMedia('(hover: hover)').matches);
      if (busy) {
        pos = el.scrollLeft;
      } else {
        pos += (SPEED * dt) / 1000;
      }
      // the second half repeats the first, so jumping by half keeps the loop seamless in both directions
      if (pos >= half) pos -= half;
      else if (pos <= 0 && busy) pos += half;
      if (!busy || Math.abs(el.scrollLeft - pos) > 2) {
        el.scrollLeft = pos;
        written = el.scrollLeft;
      }
      frame = requestAnimationFrame(tick);
    };
    el.addEventListener('touchstart', pause, { passive: true });
    el.addEventListener('wheel', pause, { passive: true });
    el.addEventListener('pointerdown', pause);
    el.addEventListener('scroll', onScroll, { passive: true });
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener('touchstart', pause);
      el.removeEventListener('wheel', pause);
      el.removeEventListener('pointerdown', pause);
      el.removeEventListener('scroll', onScroll);
    };
  }, [off, ref]);

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
