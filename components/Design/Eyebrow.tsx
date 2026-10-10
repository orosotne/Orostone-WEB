import React from 'react';

interface EyebrowProps {
  children: React.ReactNode;
  /** Gold label, only on graphite sections. */
  gold?: boolean;
  /** h2/h3 where the label is the section's heading (product detail sections). */
  as?: 'p' | 'span' | 'h2' | 'h3';
  id?: string;
  className?: string;
}

/** Small uppercase label with a short rule before it. */
export const Eyebrow: React.FC<EyebrowProps> = ({ children, gold = false, as: Tag = 'p', id, className = '' }) => (
  <Tag
    id={id}
    className={`inline-flex items-center gap-3.5 text-os-eyebrow uppercase before:h-px before:w-7 before:bg-current before:opacity-75 before:content-[''] ${gold ? 'text-brand-gold' : ''} ${className}`}
  >
    {children}
  </Tag>
);
