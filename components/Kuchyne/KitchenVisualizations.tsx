import React, { useCallback, useRef, useState } from 'react';
import { m } from 'framer-motion';
import { Eyebrow, TextLink } from '@/components/Design';
import { ProductLightbox, type LightboxOrigin } from '@/components/ProductDetail/ProductLightbox';
import { REVEAL } from '@/lib/motion';
import {
  KITCHEN_VIEWS,
  KITCHEN_VISUALIZATIONS,
  kitchenImage,
  type KitchenView,
  type KitchenVisualization,
} from '@/data/pillars/kuchyne';

/**
 * Where each view sits in the mosaic. Phones: the front view across, then the side view and the detail side by side
 * (columns 3 : 4, so a 3:4 and a 1:1 photo end up equally tall), then the room across. From 768 px: three columns,
 * a wide photo and a narrow one per row; every other kitchen is mirrored. The wide photo's ratio sets the row height,
 * the narrow one fills it.
 */
const SLOTS: Record<KitchenView, readonly [string, string]> = {
  spredu: ['col-span-2 aspect-[3/2] md:col-start-1 md:row-start-1', 'col-span-2 aspect-[3/2] md:col-start-2 md:row-start-1'],
  zboku: ['aspect-[3/4] md:col-start-3 md:row-start-1 md:aspect-auto', 'aspect-[3/4] md:col-start-1 md:row-start-1 md:aspect-auto'],
  hrana: ['aspect-square md:col-start-1 md:row-start-2 md:aspect-auto', 'aspect-square md:col-start-3 md:row-start-2 md:aspect-auto'],
  priestor: ['col-span-2 aspect-video md:col-start-2 md:row-start-2', 'col-span-2 aspect-video md:col-start-1 md:row-start-2'],
};

const GAP_X = 'gap-x-[clamp(8px,1vw,16px)]';

const SIZES: Record<KitchenView, string> = {
  spredu: '(min-width: 1800px) 1060px, (min-width: 768px) 60vw, 100vw',
  zboku: '(min-width: 1800px) 530px, (min-width: 768px) 30vw, 43vw',
  hrana: '(min-width: 1800px) 530px, (min-width: 768px) 30vw, 57vw',
  priestor: '(min-width: 1800px) 1060px, (min-width: 768px) 60vw, 100vw',
};

const srcSet = (decorSlug: string, view: KitchenView, widths: readonly [number, number], ext: 'avif' | 'webp') =>
  widths.map((w) => `${kitchenImage(decorSlug, view, w, ext)} ${w}w`).join(', ');

/** The largest WebP of each view, for the lightbox. */
const fullImages = (k: KitchenVisualization) => KITCHEN_VIEWS.map((v) => kitchenImage(k.decorSlug, v.view, v.widths[1], 'webp'));

interface Opened {
  kitchen: number;
  index: number;
}

/**
 * Kitchen visualizations: one block per kitchen (decor, title, text, link to the decor) and a mosaic of its four
 * views. A photo opens the product lightbox, which grows out of it and shrinks back into it.
 */
export const KitchenVisualizations: React.FC<{ className?: string }> = ({ className = '' }) => {
  // The lightbox keeps the last kitchen while it closes, so it can fly back into the right photo
  const [opened, setOpened] = useState<Opened>({ kitchen: 0, index: 0 });
  const [isOpen, setIsOpen] = useState(false);
  const openedRef = useRef(opened);
  const frames = useRef<Record<string, HTMLElement | null>>({});

  const show = (next: Opened) => {
    openedRef.current = next;
    setOpened(next);
  };

  const getOrigin = useCallback((): LightboxOrigin | null => {
    const { kitchen, index } = openedRef.current;
    const frame = frames.current[`${kitchen}-${index}`];
    if (!frame) return null;
    const rect = frame.getBoundingClientRect();
    const img = frame.querySelector('img');
    const loaded = img && img.naturalWidth > 0 ? img : null;
    const aspect = loaded ? loaded.naturalWidth / loaded.naturalHeight : rect.width / rect.height;
    // the page photo (already loaded) lies under the full-size one until it arrives
    return { rect, aspect, src: loaded?.currentSrc };
  }, []);

  const active = KITCHEN_VISUALIZATIONS[opened.kitchen];
  const last = KITCHEN_VIEWS.length - 1;

  return (
    <div className={`grid gap-[clamp(72px,9vw,136px)] ${className}`}>
      {KITCHEN_VISUALIZATIONS.map((k, ki) => {
        const mirrored = ki % 2 === 1;
        return (
          <m.article key={k.decorSlug} id={`vizualizacia-${k.decorSlug}`} {...REVEAL} className="grid gap-[clamp(20px,2.4vw,32px)]">
            {/* Same three columns as the mosaic below, so the text starts on a photo edge */}
            <header className={`grid gap-y-4 lg:grid-cols-3 lg:items-end ${GAP_X}`}>
              <div className="grid gap-3 lg:pr-6">
                <Eyebrow>
                  <span className="tabular-nums">{String(ki + 1).padStart(2, '0')}</span>
                  <span aria-hidden="true" className="opacity-50">/</span>
                  {k.decor}
                </Eyebrow>
                <h3 className="text-os-h3 [text-wrap:balance]">{k.title}</h3>
              </div>
              <div className="grid justify-items-start gap-4 lg:col-span-2">
                <p className="max-w-[58ch] font-light text-brand-muted">{k.text}</p>
                <TextLink to={`/produkt/${k.decorSlug}`}>Pozrieť dekor {k.decor}</TextLink>
              </div>
            </header>

            <figure className="m-0 grid gap-3">
              <ul className={`grid grid-cols-[minmax(0,3fr)_minmax(0,4fr)] gap-y-[clamp(8px,1vw,16px)] md:grid-cols-3 ${GAP_X}`}>
                {KITCHEN_VIEWS.map(({ view, label, widths, ratio }, vi) => (
                  <li
                    key={view}
                    ref={(el) => {
                      frames.current[`${ki}-${vi}`] = el;
                    }}
                    className={`relative overflow-hidden rounded-[3px] bg-brand-line has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand-dark ${SLOTS[view][mirrored ? 1 : 0]}`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        show({ kitchen: ki, index: vi });
                        setIsOpen(true);
                      }}
                      className="os-press group absolute inset-0 block h-full w-full cursor-zoom-in outline-none [--os-press-scale:0.99]"
                      aria-label={`Zväčšiť fotku: ${k.decor}, ${label}`}
                    >
                      <picture>
                        <source type="image/avif" srcSet={srcSet(k.decorSlug, view, widths, 'avif')} sizes={SIZES[view]} />
                        <img
                          src={kitchenImage(k.decorSlug, view, widths[0], 'webp')}
                          srcSet={srcSet(k.decorSlug, view, widths, 'webp')}
                          sizes={SIZES[view]}
                          alt={k.alts[view]}
                          width={widths[1]}
                          height={Math.round(widths[1] / ratio)}
                          loading="lazy"
                          decoding="async"
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 [transition-timing-function:cubic-bezier(0.2,0.7,0.2,1)] motion-safe:group-hover:scale-[1.025]"
                        />
                      </picture>
                    </button>
                  </li>
                ))}
              </ul>
              <figcaption className="text-[0.8rem] font-normal text-brand-muted">Vizualizácia s dekorom {k.decor}</figcaption>
            </figure>
          </m.article>
        );
      })}

      <ProductLightbox
        images={fullImages(active)}
        alts={KITCHEN_VIEWS.map((v) => active.alts[v.view])}
        currentIndex={opened.index}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onPrevious={() => show({ ...openedRef.current, index: Math.max(0, openedRef.current.index - 1) })}
        onNext={() => show({ ...openedRef.current, index: Math.min(last, openedRef.current.index + 1) })}
        productName={`Kuchyňa v dekore ${active.decor}`}
        getOrigin={getOrigin}
      />
    </div>
  );
};
