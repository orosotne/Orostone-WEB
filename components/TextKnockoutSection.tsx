import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ChevronDown } from 'lucide-react';

export function TextKnockoutSection() {
  // Outer wrapper provides the scroll distance; inner section uses `position: sticky`
  // so GSAP drives the animation via scrub without creating a `.pin-spacer`
  // (native pin-spacer would cause full-viewport CLS every ScrollTrigger.refresh()).
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const goldSvgRef = useRef<HTMLDivElement>(null);

  // Start video playback when near viewport
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0, rootMargin: '300px' }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  // Responsive GSAP animations via matchMedia
  useGSAP(() => {
    if (!wrapperRef.current || !svgRef.current || !goldSvgRef.current) return;

    const mm = gsap.matchMedia();

    // ── Desktop: sticky-driven scrub, scale 700 zoom ───────────────────────
    mm.add('(min-width: 1024px)', () => {
      gsap.set(svgRef.current!, { scale: 700 });
      gsap.set(goldSvgRef.current!, { opacity: 0 });

      gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current!,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5,
        },
      })
      .to(svgRef.current!, { scale: 1, duration: 0.35, ease: 'power4.out' }, 0)
      .to(goldSvgRef.current!, { opacity: 1, duration: 0.1, ease: 'power2.inOut' }, 0.5)
      .to(goldSvgRef.current!, { opacity: 0, duration: 0.25, ease: 'power2.inOut' }, 0.85);
    });

    // ── Mobile: IntersectionObserver-driven one-shot reveal ───────────────
    // Previously this used scrollTrigger with scrub:true, which caused a
    // ~54ms forced reflow at o.enable() and continuous layout queries during
    // scroll → visible scroll jank on mid-range phones. IO is a native API
    // that runs off the main thread; one-shot timeline keeps the zoom-out
    // effect without any scroll-position-tied DOM queries.
    mm.add('(max-width: 1023px)', () => {
      gsap.set(svgRef.current!, { scale: 230, willChange: 'transform' });
      gsap.set(goldSvgRef.current!, { opacity: 0 });

      let played = false;
      const io = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting || played) return;
          played = true;
          io.disconnect();
          gsap.timeline()
            .to(svgRef.current!, { scale: 1, duration: 1.6, ease: 'power3.out', clearProps: 'willChange' }, 0)
            .to(goldSvgRef.current!, { opacity: 1, duration: 0.4, ease: 'power2.inOut' }, '-=0.5')
            .to(goldSvgRef.current!, { opacity: 0, duration: 0.5, ease: 'power2.inOut' }, '+=0.6');
        },
        { threshold: 0.25 }
      );
      io.observe(wrapperRef.current!);
      return () => io.disconnect();
    });

    return () => mm.revert();

  }, { scope: wrapperRef });

  return (
    // Outer wrapper reserves scroll distance: 100vh (sticky) + 60% (mobile) / 130% (desktop)
    <div
      ref={wrapperRef}
      className="relative w-full h-[160vh] lg:h-[230vh] bg-black"
    >
    <section
      ref={containerRef}
      className="sticky top-0 isolate h-screen w-full overflow-x-clip overflow-hidden bg-black"
    >
      {/* Layer 1: Background video */}
      <video
        ref={videoRef}
        src="/videos/knockout-bg.mp4"
        poster="/videos/knockout-bg-poster.jpg"
        muted
        playsInline
        loop
        preload="none"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Layer 2: Black SVG "OROSTONE" — starts at scale 700, zooms to 1 on scroll */}
      <svg
        ref={svgRef}
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full"
        style={{ transformOrigin: 'center center' }}
      >
        <path d="M949.72,535.56c-3.02,0-5.34.9-7.01,2.69-1.66,1.79-2.5,4.14-2.5,7.04s.84,5.25,2.5,7.04c1.66,1.79,3.99,2.69,7.01,2.69s5.34-.9,7.01-2.69c1.66-1.79,2.5-4.14,2.5-7.04s-.84-5.25-2.5-7.04c-1.66-1.79-3.99-2.69-7.01-2.69Z" fill="black"/>
        <path d="M1055.6,535.56c-3.02,0-5.34.9-7.01,2.69s-2.5,4.14-2.5,7.04.84,5.25,2.5,7.04c1.66,1.79,3.99,2.69,7.01,2.69s5.34-.9,7.01-2.69c1.66-1.79,2.5-4.14,2.5-7.04s-.84-5.25-2.5-7.04c-1.66-1.79-3.99-2.69-7.01-2.69Z" fill="black"/>
        <path d="M879,535.58c-3.02,0-5.34.9-7.01,2.69-1.66,1.79-2.5,4.14-2.5,7.04s.84,5.25,2.5,7.04c1.66,1.79,3.99,2.69,7.01,2.69s5.34-.9,7.01-2.69c1.66-1.79,2.5-4.14,2.5-7.04s-.84-5.25-2.5-7.04c-1.66-1.79-3.99-2.69-7.01-2.69Z" fill="black"/>
        <path d="M1139.34,533.69c-1.32,0-2.48.21-3.47.63-1.01.42-1.85.95-2.58,1.62-.71.67-1.26,1.43-1.66,2.29-.4.88-.63,1.78-.67,2.73h15.67c.06-2-.61-3.72-1.99-5.13-1.37-1.43-3.13-2.14-5.31-2.14Z" fill="black"/>
        <path d="M0,0v1080h1920V0H0ZM771.86,566.94c-6.43-7.14-10.35-16.59-10.35-26.95s3.91-19.81,10.35-26.93v53.89ZM785.73,576.93c-3.47-1.51-6.68-3.47-9.54-5.86v-62.17c2.88-2.37,6.09-4.35,9.54-5.86v73.89ZM799.63,580.21c-3.3-.17-6.51-.74-9.56-1.68,0,0,0-77.08,0-77.08,3.05-.94,6.24-1.51,9.56-1.68v80.44ZM813.51,578.55c-3.05.94-6.24,1.51-9.54,1.68v-80.46c3.3.17,6.51.74,9.54,1.68v77.1ZM827.38,571.09c-2.88,2.37-6.09,4.35-9.54,5.86v-73.91c3.47,1.51,6.68,3.49,9.54,5.86v62.19ZM831.72,566.94v-53.89c6.43,7.14,10.35,16.57,10.35,26.93s-3.91,19.81-10.35,26.95ZM898.68,553.62c-1.11,2.48-2.63,4.6-4.54,6.38-1.93,1.78-4.2,3.13-6.81,4.08-2.62.95-5.4,1.43-8.34,1.43s-5.75-.48-8.34-1.43c-2.62-.95-4.89-2.31-6.81-4.08s-3.44-3.89-4.54-6.38c-1.11-2.48-1.66-5.25-1.66-8.3s.55-5.82,1.66-8.3c1.11-2.48,2.62-4.6,4.54-6.38s4.2-3.13,6.81-4.07c2.62-.95,5.4-1.43,8.34-1.43s5.75.48,8.34,1.43c2.62.95,4.89,2.31,6.81,4.07,1.93,1.78,3.44,3.89,4.54,6.38,1.11,2.48,1.66,5.25,1.66,8.3s-.55,5.82-1.66,8.3ZM926.82,536.31c-.63-.08-1.26-.11-1.93-.11-2.27,0-4.07.32-5.38.95-1.32.63-2.33,1.53-3.04,2.65-.73,1.15-1.18,2.5-1.39,4.08-.21,1.58-.31,3.32-.31,5.23v16.05h-11.87v-38.46h11.87v6.17h.15c1.26-2.37,2.77-4.16,4.5-5.34,1.74-1.18,3.93-1.78,6.57-1.78.69,0,1.37.04,2.06.08h-.02c.69.06,2.42.04,5.65,1.41-.48.36-.95.76-1.41,1.18-2.21,2.02-3.95,4.49-5.23,7.33-.08.19-.15.36-.23.55ZM969.42,553.6c-1.11,2.48-2.62,4.6-4.54,6.38s-4.18,3.13-6.8,4.08-5.38,1.43-8.34,1.43-5.75-.48-8.36-1.43c-2.6-.95-4.87-2.31-6.8-4.08s-3.44-3.89-4.54-6.38c-1.11-2.48-1.66-5.25-1.66-8.3s.55-5.82,1.66-8.3c.94-2.12,2.18-3.99,3.72-5.57.27-.29.53-.53.82-.8,1.93-1.76,4.18-3.11,6.8-4.07,2.62-.95,5.42-1.43,8.36-1.43s5.73.48,8.34,1.43c2.6.94,4.87,2.31,6.8,4.07,1.93,1.78,3.44,3.89,4.54,6.38,1.11,2.48,1.66,5.25,1.66,8.3s-.55,5.82-1.66,8.3ZM1003.65,558.96c-1.07,1.6-2.46,2.9-4.14,3.87-1.7.97-3.61,1.66-5.71,2.06-2.12.4-4.2.59-6.26.59-2.69,0-5.4-.38-8.15-1.15-2.39-.67-4.45-1.76-6.18-3.32l7.1-7.98c.92.99,1.93,1.78,3,2.35,1.36.73,2.92,1.07,4.71,1.07,1.37,0,2.62-.21,3.72-.59,1.11-.4,1.66-1.13,1.66-2.18,0-.99-.5-1.76-1.47-2.25s-2.21-.92-3.72-1.26c-1.37-.31-2.86-.65-4.43-1.01-.11-.04-.25-.08-.38-.1-1.72-.4-3.32-.99-4.83-1.78-1.51-.78-2.75-1.91-3.72-3.36-.99-1.45-1.47-3.38-1.47-5.8,0-2.27.46-4.22,1.37-5.86.94-1.64,2.14-3,3.65-4.05s3.24-1.83,5.19-2.33c1.95-.52,3.93-.76,5.94-.76,2.54,0,5.1.36,7.67,1.11,1.81.53,3.42,1.34,4.85,2.42l-6.72,7.54c-1.57-1.36-3.47-2.04-5.73-2.04-.99,0-1.97.25-2.92.73-.95.46-1.43,1.28-1.43,2.44,0,.95.5,1.66,1.47,2.1.97.44,2.21.84,3.72,1.18.27.06.53.13.8.19,1.28.29,2.62.59,4.03.92,1.72.38,3.32,1.01,4.83,1.85,1.51.84,2.75,1.99,3.72,3.44h-.02c.97,1.45,1.47,3.34,1.47,5.82s-.53,4.5-1.62,6.13ZM1034.24,564.29c-1.32.48-2.67.8-4.1.95s-2.83.23-4.2.23c-2,0-3.86-.21-5.54-.63-1.68-.42-3.17-1.09-4.43-2.02-1.28-.92-2.27-2.12-2.98-3.59-.71-1.47-1.07-3.26-1.07-5.38v-18.27h-7.6v-9.51h7.6v-11.4h11.87v11.4h17.43c-1.09.69-2.1,1.47-3.04,2.33-2.18,1.99-3.89,4.37-5.15,7.16h-9.22v12.81c0,1.07.06,2.02.15,2.9.1.86.32,1.62.71,2.25.36.63.94,1.13,1.7,1.47.76.34,1.78.52,3.04.52.65,0,1.47-.06,2.5-.19.42-.06.8-.13,1.13-.25.48-.17.9-.38,1.2-.67v9.89ZM1075.3,553.6c-1.13,2.48-2.63,4.6-4.56,6.38-1.91,1.78-4.18,3.13-6.8,4.08s-5.38,1.43-8.34,1.43-5.73-.48-8.34-1.43-4.89-2.31-6.81-4.08-3.44-3.89-4.54-6.38c-1.11-2.48-1.66-5.25-1.66-8.3s.55-5.82,1.66-8.3c.21-.5.44-.97.71-1.43,1.01-1.87,2.29-3.51,3.84-4.94,1.93-1.76,4.2-3.11,6.81-4.07.48-.17.97-.34,1.47-.48,2.18-.65,4.47-.95,6.87-.95,2.96,0,5.73.48,8.34,1.43,2.62.94,4.87,2.31,6.8,4.07,1.93,1.78,3.45,3.89,4.56,6.38,1.11,2.48,1.66,5.25,1.66,8.3s-.55,5.82-1.66,8.3ZM1116.53,564.54h-11.87v-18.84c0-1.11-.04-2.25-.11-3.44-.08-1.18-.32-2.29-.71-3.28-.4-.99-1.01-1.81-1.81-2.46-.82-.63-1.99-.95-3.51-.95s-2.77.29-3.72.84c-.95.55-1.68,1.3-2.18,2.21-.5.92-.84,1.97-.99,3.13-.15,1.16-.23,2.37-.23,3.65v19.15h-11.87v-38.46h11.38v5.23h.15c.36-.74.9-1.47,1.58-2.21s1.51-1.39,2.46-1.99c.95-.57,2.02-1.05,3.25-1.43,1.22-.36,2.54-.55,3.95-.55,3.02,0,5.44.46,7.27,1.39,1.85.92,3.28,2.2,4.31,3.84,1.03,1.64,1.72,3.57,2.1,5.78.36,2.21.55,4.62.55,7.2v21.21ZM1158.49,549.02h-27.54c.48,2.27,1.51,4.07,3.09,5.42,1.58,1.36,3.53,2.02,5.86,2.02,1.95,0,3.61-.44,4.94-1.3,1.34-.86,2.52-1.99,3.51-3.36l8.3,6.09h.02c-1.89,2.42-4.29,4.29-7.2,5.61-2.9,1.32-5.92,1.99-9.03,1.99s-5.75-.48-8.34-1.43c-2.61-.95-4.89-2.31-6.81-4.08-1.93-1.78-3.44-3.89-4.54-6.38-1.11-2.48-1.66-5.25-1.66-8.3s.55-5.82,1.66-8.3,2.62-4.6,4.54-6.38c1.93-1.78,4.2-3.13,6.81-4.07,2.62-.95,5.4-1.43,8.34-1.43,2.75,0,5.23.48,7.48,1.43,2.23.95,4.14,2.31,5.69,4.07,1.57,1.78,2.75,3.89,3.61,6.38.84,2.48,1.26,5.25,1.26,8.30v3.72Z" fill="black"/>
      </svg>

      {/* Layer 3: Gold SVG logo — fades in after zoom, then fades out */}
      <div
        ref={goldSvgRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0 }}
      >
        <img
          src="/orostone-gold.svg"
          alt="Orostone Gold"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Scroll hint — fades out as soon as user starts scrolling */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-white/50 pointer-events-none"
      >
        <div className="flex flex-col items-center gap-2 animate-bounce">
          <span className="font-sans text-xs tracking-widest uppercase">Scroll</span>
          <ChevronDown size={28} />
        </div>
      </div>
    </section>
    </div>
  );
}
