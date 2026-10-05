import React, { useEffect, useRef, useState } from 'react';

// Line icons of the new design. Strokes draw themselves in (pathLength=1 + dashoffset) once the
// strip they sit in scrolls into view; gold parts pop in after. Styles: .os-ico in index.css.

const canDraw = (): boolean =>
  typeof window !== 'undefined' &&
  'IntersectionObserver' in window &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Put `ref` and `className` on the element that wraps a row of icons. */
export function useDrawIn<T extends HTMLElement>(threshold = 0.35) {
  const ref = useRef<T>(null);
  const [state, setState] = useState(() => (canDraw() ? 'os-will-draw' : ''));
  useEffect(() => {
    const el = ref.current;
    if (!el || !canDraw()) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState('os-will-draw os-is-in');
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, className: state };
}

type IconProps = { className?: string };
const v = (n: number) => ({ '--j': n }) as React.CSSProperties;

export const IconCastle: React.FC<IconProps> = ({ className = '' }) => (
  <svg className={`os-ico ${className}`} viewBox="0 0 48 48" aria-hidden="true">
    <g className="ln">
      <path pathLength={1} d="M3 41.5h42" />
      <path pathLength={1} d="M6.5 41.5V21h9v20.5M32.5 41.5V21h9v20.5" />
      <path pathLength={1} d="M5 21l6-11.5L17 21M31 21l6-11.5L43 21" />
      <path pathLength={1} d="M15.5 26h17l-2-3h-13z" />
      <path pathLength={1} d="M11 9.5V6M37 9.5V6M11 27v4M37 27v4M20 30v3M28 30v3" />
    </g>
    <path className="au" d="M21.5 41.5v-5a2.5 2.5 0 0 1 5 0v5z" />
  </svg>
);

export const IconSlabs: React.FC<IconProps> = ({ className = '' }) => (
  <svg className={`os-ico ${className}`} viewBox="0 0 48 48" aria-hidden="true">
    <g className="ln">
      <rect pathLength={1} x="7.5" y="6.5" width="17" height="30" rx=".8" />
      <rect className="fill" pathLength={1} x="14.5" y="9.5" width="17" height="30" rx=".8" />
    </g>
    <g className="slab-front">
      <rect className="au" x="21.5" y="12.5" width="17" height="30" rx=".8" />
      <path className="vein" d="M24 41c3-6 4.5-9.5 7.5-13s4.5-7 6-10.5" />
    </g>
  </svg>
);

export const IconPriceClock: React.FC<IconProps> = ({ className = '' }) => (
  <svg className={`os-ico ${className}`} viewBox="0 0 48 48" aria-hidden="true">
    <g className="ln">
      <path pathLength={1} d="M10.5 6.5h16l7 7v27h-23z" />
      <path pathLength={1} d="M26.5 6.5v7h7" />
      <path pathLength={1} d="M15.5 19h13M15.5 24h13M15.5 29h6" />
    </g>
    <g className="au">
      <circle cx="33.5" cy="34.5" r="8.5" />
    </g>
    <path className="hand" d="M33.5 34.5l3 2" />
    <path className="hand min" d="M33.5 34.5V29.5" />
  </svg>
);

export const IconFabrication: React.FC<IconProps> = ({ className = '' }) => (
  <svg className={`os-ico ${className}`} viewBox="0 0 48 48" aria-hidden="true">
    <g className="ln">
      <path pathLength={1} d="M4.5 32.5h39v5h-39z" />
      <path pathLength={1} d="M8.5 37.5V43M39.5 37.5V43" />
      <rect className="fill" pathLength={1} x="9.5" y="21.5" width="29" height="7" rx="1.5" />
      <path pathLength={1} d="M14 21.5v7M34 21.5v7" />
    </g>
    <rect className="au" x="19.5" y="23" width="9" height="4" rx="2" />
    <circle className="bubble" cx="24" cy="25" r="1.1" />
  </svg>
);

export const IconWarranty: React.FC<IconProps> = ({ className = '' }) => (
  <svg className={`os-ico ${className}`} viewBox="0 0 48 48" aria-hidden="true">
    <g className="ln">
      <rect className="fill" pathLength={1} x="8.5" y="4.5" width="21" height="34" rx=".8" />
      <path pathLength={1} d="M12.5 33c3-5.5 5.5-9 8.5-12s4.5-6 5.5-9" />
    </g>
    <g className="badge">
      <path className="au" d="M28.8 37.6l-2.3 7.4 3.1-1.4 2 2.6 1.8-6.4z" />
      <path className="au" d="M37.2 37.6l2.3 7.4-3.1-1.4-2 2.6-1.8-6.4z" />
      <circle className="au" cx="33" cy="32" r="8" />
      <path className="hand" d="M29.6 32.3l2.3 2.3 4.5-4.7" />
    </g>
  </svg>
);

export const IconDispatch: React.FC<IconProps> = ({ className = '' }) => (
  <svg className={`os-ico ${className}`} viewBox="0 0 48 48" aria-hidden="true">
    <g className="ln">
      <rect className="fill" pathLength={1} x="4.5" y="8.5" width="39" height="32" rx="2" />
      <path pathLength={1} d="M4.5 16h39" />
      <path pathLength={1} d="M14 5v7M34 5v7" />
      <rect pathLength={1} x="32.4" y="21.5" width="4" height="4" rx=".6" />
      <rect pathLength={1} x="37.6" y="21.5" width="4" height="4" rx=".6" />
      <path pathLength={1} d="M8.4 31h.01 M13.6 31h.01 M18.8 31h.01 M24.0 31h.01 M29.2 31h.01 M34.4 31h.01 M39.6 31h.01 M8.4 36h.01 M13.6 36h.01 M18.8 36h.01 M24.0 36h.01 M29.2 36h.01 M34.4 36h.01 M39.6 36h.01" />
    </g>
    <g className="days">
      <rect className="au" style={v(0)} x="6.4" y="21.5" width="4" height="4" rx=".6" />
      <rect className="au" style={v(1)} x="11.6" y="21.5" width="4" height="4" rx=".6" />
      <rect className="au" style={v(2)} x="16.8" y="21.5" width="4" height="4" rx=".6" />
      <rect className="au" style={v(3)} x="22.0" y="21.5" width="4" height="4" rx=".6" />
      <rect className="au" style={v(4)} x="27.2" y="21.5" width="4" height="4" rx=".6" />
    </g>
  </svg>
);

export const IconDelivery: React.FC<IconProps> = ({ className = '' }) => (
  <svg className={`os-ico ${className}`} viewBox="0 0 48 48" aria-hidden="true">
    <g className="truck">
      <g className="ln">
        <path pathLength={1} d="M3.5 31h29v3.5h-29z" />
        <path pathLength={1} d="M32.5 34.5V20.5h6l5 7v7z" />
        <path pathLength={1} d="M34.5 22.5h3.2l3 4.3h-6.2z" />
        <path pathLength={1} d="M10 31l6-16 6 16M12.6 24h6.8" />
        <circle className="fill" pathLength={1} cx="10" cy="37" r="3.2" />
        <circle className="fill" pathLength={1} cx="36.5" cy="37" r="3.2" />
      </g>
      <path className="au" d="M16.6 14.6L19 13.7 25.4 31h-2.8z" />
    </g>
    <g className="ln">
      <path pathLength={1} d="M.5 21h4M1.5 25.5h3" />
    </g>
  </svg>
);

/** Payment card with a gold shield — same drawing rules as the prototype icons. */
export const IconSecurePay: React.FC<IconProps> = ({ className = '' }) => (
  <svg className={`os-ico ${className}`} viewBox="0 0 48 48" aria-hidden="true">
    <g className="ln">
      <rect className="fill" pathLength={1} x="4.5" y="10.5" width="32" height="22" rx="2" />
      <path pathLength={1} d="M4.5 16.5h32" />
      <path pathLength={1} d="M9.5 26h8M9.5 29h5" />
    </g>
    <g className="badge">
      <path className="au" d="M34 24.5l8 3v5.6c0 5.2-3.4 8.7-8 10.4-4.6-1.7-8-5.2-8-10.4v-5.6z" />
      <path className="hand" d="M30.6 33.4l2.4 2.4 4.4-4.6" />
    </g>
  </svg>
);
