import React, { useEffect, useState } from 'react';
import { Container } from './Container';
import { Section } from './Section';

// Building blocks of the legal and policy documents (VOP, ochrana súkromia, cookies, odstúpenie, rezervácia ceny).
// Text, headings, ids and tables stay exactly as written by the lawyer; only the presentation is shared.

/** Inline link inside legal text — the same treatment as links in blog articles. */
export const LEGAL_LINK =
  'font-medium text-brand-dark underline decoration-brand-gold decoration-2 underline-offset-4 transition-colors hover:decoration-brand-dark';

/** Sand box for company details, examples and other blocks set apart from the running text. */
export const LEGAL_BOX = 'rounded-[3px] bg-brand-sand';

export interface LegalTocItem {
  id: string;
  label: string;
}

interface LegalLayoutProps {
  /** Heading of the table of contents (kept as the page's H2) */
  tocTitle?: string;
  toc: LegalTocItem[];
  /** Blocks before the first article, e.g. the operator's details */
  intro?: React.ReactNode;
  children: React.ReactNode;
}

/** Document body: table of contents beside the text from 1280 px (sticky, marks the section in view), above it on smaller screens. */
export const LegalLayout: React.FC<LegalLayoutProps> = ({ tocTitle = 'Rýchla navigácia', toc, intro, children }) => {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && setActive(entry.target.id)),
      { rootMargin: '-20% 0px -70% 0px' },
    );
    toc.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [toc]);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <Section tone="chalk" className="!pt-[clamp(8px,2vw,32px)]">
      <Container className="xl:grid xl:grid-cols-[230px_minmax(0,780px)] xl:justify-center xl:gap-x-20">
        <aside className="mb-12 xl:mb-0">
          <div className="border-y border-brand-line py-5 xl:sticky xl:top-28 xl:max-h-[calc(100dvh-8rem)] xl:overflow-y-auto xl:border-0 xl:py-0">
            <h2 className="mb-3 text-os-eyebrow uppercase text-brand-muted">{tocTitle}</h2>
            <nav aria-label={tocTitle} className="grid gap-x-8 sm:grid-cols-2 xl:grid-cols-1 xl:border-l xl:border-brand-line">
              {toc.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={go(item.id)}
                  className={`py-1.5 text-[0.9rem] leading-snug no-underline transition-colors duration-200 xl:-ml-px xl:border-l-2 xl:pl-4 xl:text-[0.86rem] ${
                    active === item.id
                      ? 'font-medium text-brand-dark xl:border-brand-dark'
                      : 'font-normal text-brand-muted hover:text-brand-dark xl:border-transparent'
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        <div className="min-w-0 max-w-[780px]">
          {intro && <div className="mb-12 space-y-6">{intro}</div>}
          {children}
        </div>
      </Container>
    </Section>
  );
};

interface LegalSectionProps {
  id: string;
  /** Article number shown before the heading (not part of the H2 text) */
  number?: string;
  title: React.ReactNode;
  /** One-line explanation under the heading */
  subtitle?: React.ReactNode;
  children: React.ReactNode;
}

/** One article of a legal document: number, H2, optional subtitle, then the text. */
export const LegalSection: React.FC<LegalSectionProps> = ({ id, number, title, subtitle, children }) => (
  <section id={id} className="scroll-mt-28 border-t border-brand-line py-10 first:border-t-0 first:pt-0 lg:py-12">
    <div className="mb-6 flex items-baseline gap-4">
      {number && (
        <span className="min-w-[2.25rem] flex-none text-[clamp(1.2rem,1.7vw,1.5rem)] font-semibold tabular-nums leading-tight text-brand-muted">
          {number}.
        </span>
      )}
      <div>
        <h2 className="text-[clamp(1.25rem,1.7vw,1.5rem)] font-semibold leading-tight tracking-[-0.01em]">{title}</h2>
        {subtitle && <p className="mt-1.5 font-light text-brand-muted">{subtitle}</p>}
      </div>
    </div>
    <div className="space-y-4 font-light leading-[1.75] text-brand-dark/85">{children}</div>
  </section>
);

interface LegalClauseProps {
  number: string;
  /** Clause the reader must not miss: sand background, graphite rule */
  highlight?: boolean;
  children: React.ReactNode;
}

/** Numbered clause (1.1, 1.2 …); the numbers stay in one column, a highlighted clause keeps that alignment. */
export const LegalClause: React.FC<LegalClauseProps> = ({ number, highlight = false, children }) => (
  <div
    className={`flex gap-3 sm:gap-4 ${
      highlight ? 'rounded-r-[3px] border-l-2 border-brand-dark bg-brand-sand py-4 pl-3.5 pr-4 sm:-ml-[18px] sm:pl-4 sm:pr-5' : ''
    }`}
  >
    <span className="min-w-[2.25rem] flex-none font-semibold tabular-nums text-brand-dark sm:min-w-[2.75rem]">{number}</span>
    <div className="min-w-0 flex-1">{children}</div>
  </div>
);
