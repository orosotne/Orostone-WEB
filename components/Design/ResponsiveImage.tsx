import React from 'react';

interface ResponsiveImageProps {
  /** Path without size and extension: `${base}-<w>.avif|webp` (made by temp_redizajn/page-assets.mjs) */
  base: string;
  /** The two widths that exist, small first, e.g. [640, 1200] */
  widths: readonly [number, number];
  /** Aspect of the files (w / h) — sets width/height so the layout does not jump */
  ratio: number;
  alt: string;
  sizes: string;
  className?: string;
}

/** AVIF with a WebP fallback in two sizes, lazy (below the fold). */
export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({ base, widths, ratio, alt, sizes, className = '' }) => {
  const [small, large] = widths;
  return (
    <picture>
      <source type="image/avif" srcSet={`${base}-${small}.avif ${small}w, ${base}-${large}.avif ${large}w`} sizes={sizes} />
      <img
        src={`${base}-${small}.webp`}
        srcSet={`${base}-${small}.webp ${small}w, ${base}-${large}.webp ${large}w`}
        sizes={sizes}
        alt={alt}
        width={large}
        height={Math.round(large / ratio)}
        loading="lazy"
        decoding="async"
        className={className}
      />
    </picture>
  );
};
