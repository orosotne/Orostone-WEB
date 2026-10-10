import React from 'react';
import { photoFade, usePhotoLayers } from '../../hooks/usePhotoLayers';
import { shopifyImageUrl, shopifySrcSet } from './utils';

/** `sizes` of the desktop main photo, shared with the preloader so both pick the same srcset candidate */
export const MAIN_PHOTO_SIZES = '(max-width: 768px) 100vw, 58vw';

interface MainPhotoProps {
  images: string[];
  index: number;
  alt: (index: number) => string;
}

/**
 * The large product photo on desktop. The new photo fades in on top of the current one once it has decoded, and the
 * one under it stays fully opaque until then (see usePhotoLayers): switching never shows the grey frame behind it.
 */
export const MainPhoto: React.FC<MainPhotoProps> = ({ images, index, alt }) => {
  const { layers, reveal, settle } = usePhotoLayers(index);
  const top = layers[layers.length - 1];

  return (
    <>
      {layers.map((layer) => {
        const src = images[layer.item];
        const isTop = layer === top;
        return (
          <img
            key={layer.id}
            src={shopifyImageUrl(src, 1200)}
            srcSet={shopifySrcSet(src)}
            sizes={MAIN_PHOTO_SIZES}
            width={1200}
            height={1200}
            alt={isTop ? alt(layer.item) : ''}
            aria-hidden={isTop ? undefined : true}
            fetchPriority={layer.item === 0 ? 'high' : 'auto'}
            onLoad={layer.ready ? undefined : (e) => reveal(e.currentTarget, layer.id)}
            onError={layer.ready ? undefined : (e) => reveal(e.currentTarget, layer.id)}
            style={{ opacity: layer.ready ? 1 : 0, transition: photoFade() }}
            onTransitionEnd={(e) => {
              if (e.propertyName === 'opacity' && layer.ready) settle(layer.id);
            }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        );
      })}
    </>
  );
};
