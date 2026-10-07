import React from 'react';

export type SectionTone = 'chalk' | 'sand' | 'graphite' | 'gold';

const TONE_CLASSES: Record<SectionTone, string> = {
  chalk: 'bg-brand-light text-brand-dark',
  sand: 'bg-brand-sand text-brand-dark',
  graphite: 'bg-brand-dark text-brand-light',
  gold: 'bg-brand-gold text-brand-dark',
};

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  /** Light bands alternate chalk / sand; graphite and gold are used sparingly. */
  tone?: SectionTone;
  /** Vertical padding --os-band (default); off for full-bleed media sections. */
  band?: boolean;
}

export const Section: React.FC<SectionProps> = ({ tone = 'chalk', band = true, className = '', ...props }) => (
  <section
    data-tone={tone}
    className={`${TONE_CLASSES[tone]} ${band ? 'py-[var(--os-band)]' : ''} ${className}`}
    {...props}
  />
);
