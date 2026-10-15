import React, { useEffect, useRef } from 'react';
import { Container, Section, SectionHeader, TextLink } from '../Design';
import feed from '../../data/instagram-feed.json';
import { useOffscreen } from './useOffscreen';

const PROFILE = 'https://www.instagram.com/orostone_/';
/** Auto-scroll speed in px/s and how long it waits after the visitor swipes, scrolls or hovers. */
const SPEED = 24;
const RESUME_MS = 2500;
/** The posts are laid out COPIES times and the strip keeps to the middle copy, so there are two copies of runway each way; it hops back by whole copies only once nothing has scrolled for SETTLE_MS. */
const COPIES = 5;
const HOME = 2;
const SETTLE_MS = 300;

/** Latest Instagram posts as portrait 4:5 tiles (as on Instagram) in a slow right-to-left marquee that runs endlessly both ways and can also be swiped or scrolled by hand (it drives scrollLeft, so the strip stays a normal scroller; pauses while touched, hovered, focused, off-screen and with reduced motion). The posts and their 600×750 webp tiles are taken at build time (scripts/sync-instagram.ts), so the strip shows them at once instead of waiting for the Instagram API. */
export const HomeInstagram: React.FC = () => {
  const { ref, off } = useOffscreen<HTMLDivElement>();
  const hold = useRef(0);

  useEffect(() => {
    const el = ref.current;
    const track = el?.firstElementChild as HTMLElement | null;
    if (!el || !track || off || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const hover = window.matchMedia('(hover: hover)');
    let pos = el.scrollLeft;
    let written = pos;
    let speed = 0;
    let last = performance.now();
    let frame = 0;
    let touching = false;
    let input = -Infinity;
    const pause = () => {
      input = performance.now();
      hold.current = input + RESUME_MS;
    };
    const onTouchStart = () => {
      touching = true;
      pause();
    };
    const onTouchEnd = () => {
      touching = false;
      pause();
    };
    // our own writes also fire scroll events; anything else (momentum after a swipe, trackpad) is the visitor
    const onScroll = () => {
      if (Math.abs(el.scrollLeft - written) > 2) pause();
    };
    const tick = (now: number) => {
      const dt = Math.min(now - last, 100);
      last = now;
      const period = el.scrollWidth / COPIES;
      const focused = el.matches(':focus-within');
      const busy = now < hold.current || focused || (el.matches(':hover') && hover.matches);
      if (busy) {
        pos = el.scrollLeft;
        speed = 0;
      } else {
        // eases up to full speed instead of starting with a jolt after a swipe
        speed += (SPEED - speed) * (1 - Math.exp(-dt / 400));
        pos += (speed * dt) / 1000;
      }
      // the copies are identical, so hopping by whole copies back into the middle one is invisible. It waits until the finger is up and the momentum is over (a hop under a swipe fought the browser and the strip blinked out at the left edge) and while a tile has keyboard focus, so focus is not carried off-screen
      if (period > 0 && !touching && !focused && now - input > SETTLE_MS) {
        // 1 px slack: scrollLeft is written rounded down, which would otherwise read as just short of the middle copy and hop again
        while (pos < HOME * period - 1) pos += period;
        while (pos >= (HOME + 1) * period) pos -= period;
      }
      // scrollLeft snaps to whole device pixels (whole CSS pixels in Safari), so 0.4 px a frame came out as a 1 px jump every 2–3 frames; the scroller takes the whole pixels and a transform on the track the remainder
      const whole = Math.floor(pos);
      if (!busy || Math.abs(el.scrollLeft - pos) > 2) {
        if (el.scrollLeft !== whole) el.scrollLeft = whole;
        written = el.scrollLeft;
      }
      track.style.transform = busy ? '' : `translate3d(${(whole - pos).toFixed(3)}px, 0, 0)`;
      frame = requestAnimationFrame(tick);
    };
    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchend', onTouchEnd, { passive: true });
    el.addEventListener('touchcancel', onTouchEnd, { passive: true });
    el.addEventListener('wheel', pause, { passive: true });
    el.addEventListener('pointerdown', pause);
    el.addEventListener('scroll', onScroll, { passive: true });
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      track.style.transform = '';
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchend', onTouchEnd);
      el.removeEventListener('touchcancel', onTouchEnd);
      el.removeEventListener('wheel', pause);
      el.removeEventListener('pointerdown', pause);
      el.removeEventListener('scroll', onScroll);
    };
  }, [off, ref]);

  // the real links sit in the middle copy (where the strip rests); the copies around them are hidden from screen readers and the tab order
  const tile = (copy: number, clone = copy !== HOME) =>
    feed.map((post) => (
      <a
        key={`${copy}-${post.id}`}
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
          {Array.from({ length: COPIES }, (_, copy) => tile(copy))}
        </div>
      </div>
    </Section>
  );
};
