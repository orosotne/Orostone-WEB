import React from 'react';
import { useDrawIn } from './LineIcon';

export interface FeatureItem {
  title: React.ReactNode;
  text: React.ReactNode;
  /** A line icon from LineIcon.tsx; it draws itself in when the grid scrolls into view. */
  icon?: React.FC<{ className?: string }>;
}

interface FeatureGridProps {
  items: FeatureItem[];
  /** Columns from 1024 px (2 below, 1 on phones) */
  columns?: 2 | 3 | 4;
  /** On a graphite section */
  onDark?: boolean;
  className?: string;
}

const COLS = { 2: 'lg:grid-cols-2', 3: 'lg:grid-cols-3', 4: 'lg:grid-cols-4' } as const;

/** Short benefits or facts: hairline on top, optional line icon, H3 title and a sentence or two. */
export const FeatureGrid: React.FC<FeatureGridProps> = ({ items, columns = 3, onDark = false, className = '' }) => {
  const draw = useDrawIn<HTMLUListElement>();
  return (
    <ul
      ref={draw.ref}
      className={`grid gap-x-[clamp(24px,3vw,48px)] gap-y-10 sm:grid-cols-2 ${COLS[columns]} ${onDark ? 'os-on-dark' : ''} ${draw.className} ${className}`}
    >
      {items.map((item, i) => (
        <li
          key={i}
          className={`os-ico-item grid content-start gap-2.5 border-t pt-6 ${onDark ? 'border-brand-light/20' : 'border-brand-line'}`}
        >
          {item.icon && <item.icon className="mb-2 h-11 w-11" />}
          <h3 className="text-[1.15rem] font-semibold leading-snug">{item.title}</h3>
          <p className={`max-w-[46ch] font-light ${onDark ? 'text-brand-light/75' : 'text-brand-muted'}`}>{item.text}</p>
        </li>
      ))}
    </ul>
  );
};
