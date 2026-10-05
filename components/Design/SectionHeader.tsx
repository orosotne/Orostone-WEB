import React from 'react';
import { Eyebrow } from './Eyebrow';

interface SectionHeaderProps {
  title: React.ReactNode;
  eyebrow?: React.ReactNode;
  lead?: React.ReactNode;
  /** h2 by default; h1 only for the page's main heading. */
  as?: 'h1' | 'h2';
  id?: string;
  /** Section on graphite: gold eyebrow, lighter lead. */
  onDark?: boolean;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  eyebrow,
  lead,
  as: Heading = 'h2',
  id,
  onDark = false,
  className = '',
}) => (
  <div className={`grid max-w-[640px] gap-4 ${className}`}>
    {eyebrow && <Eyebrow gold={onDark}>{eyebrow}</Eyebrow>}
    <Heading id={id} className={`${Heading === 'h1' ? 'text-os-h1' : 'text-os-h2'} [text-wrap:balance]`}>
      {title}
    </Heading>
    {lead && (
      <p className={`max-w-[54ch] text-os-lead font-light ${onDark ? 'text-brand-light/80' : 'text-brand-muted'}`}>{lead}</p>
    )}
  </div>
);
