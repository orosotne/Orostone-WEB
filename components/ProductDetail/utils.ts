import React from 'react';
import { LucideIcon, Sparkles, Waves, Square, Gem, Palette, Grid3x3, ScanLine, Fingerprint, SquareDot } from 'lucide-react';
import type { ShopProduct } from '../../constants';

export const ThicknessIcon: React.FC<{ size?: number; className?: string }> = ({ size = 24, className }) => (
  React.createElement('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    className,
    'aria-hidden': 'true',
  },
    React.createElement('path', { strokeWidth: 2, d: 'M12,16.17v6.75' }),
    React.createElement('path', { strokeWidth: 2, d: 'M14.95,18.3l-2.95-2.9-2.95,2.9' }),
    React.createElement('path', { strokeWidth: 2, d: 'M12,7.83V1.08' }),
    React.createElement('path', { strokeWidth: 2, d: 'M9.05,5.7l2.95,2.9,2.95-2.9' }),
    React.createElement('path', { strokeWidth: 3, d: 'M19.65,12H4.35' }),
  )
);

export const calculateSlabPrice = (pricePerM2: number, dimensions: string): number => {
  const match = dimensions.match(/(\d+)\s*x\s*(\d+)/i);
  if (match) {
    const width = parseInt(match[1]) / 1000;
    const height = parseInt(match[2]) / 1000;
    return Math.round(pricePerM2 * width * height * 100) / 100;
  }
  return Math.round(pricePerM2 * 5.12 * 100) / 100;
};

export const shopifyImageUrl = (url: string, width: number): string => {
  const base = url.replace(/(\?.*)?$/, '');
  return `${base}?width=${width}&quality=80`;
};

export const shopifySrcSet = (url: string): string | undefined => {
  if (!url || !url.includes('cdn.shopify.com')) return undefined;
  const widths = [400, 600, 800, 1200, 1600];
  return widths.map(w => `${shopifyImageUrl(url, w)} ${w}w`).join(', ');
};

export const productImageAlt = (product: ShopProduct, index?: number): string => {
  const base = `${product.name} veľkoformátová platňa`;
  const suffix = product.metaDescription ? ` – ${product.metaDescription.split('.')[0]}` : '';
  const num = index != null ? ` ${index + 1}` : '';
  return `${base}${suffix}${num}`;
};

const FINISH_LABEL_MAP: [RegExp, string][] = [
  [/4d\s*marble/i, '4D Marble'],
];

export const shortFinish = (finish?: string): string => {
  const raw = (finish || 'Leštený').split('(')[0].trim();
  for (const [pattern, label] of FINISH_LABEL_MAP) {
    if (pattern.test(raw)) return `${label} - Leštený`;
  }
  return raw;
};

export const getFinishIcon = (finish?: string): LucideIcon => {
  const f = (finish || '').toLowerCase();
  if (f.includes('lešten') || f.includes('polish') || f.includes('leskl')) return Sparkles;
  if (f.includes('silk'))                                                    return Waves;
  if (f.includes('matt') || f.includes('matný') || f.includes('matte'))     return Square;
  if (f.includes('diamond') || f.includes('micro'))                         return Gem;
  if (f.includes('color') || f.includes('body'))                            return Palette;
  if (f.includes('textur') || f.includes('štruktúr'))                       return Grid3x3;
  if (f.includes('hladk') || f.includes('smooth'))                          return ScanLine;
  if (f.includes('4d') || f.includes('marble'))                             return Fingerprint;
  return SquareDot;
};
