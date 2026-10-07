import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowIcon } from './ArrowIcon';

export interface ArticleLinkItem {
  /** Internal path, e.g. /blog/12mm-vs-20mm-hrubka */
  to: string;
  title: React.ReactNode;
  text: React.ReactNode;
}

interface ArticleLinksProps {
  items: ArticleLinkItem[];
  className?: string;
}

/** Related blog articles as quiet hairline cards (work on chalk and sand). */
export const ArticleLinks: React.FC<ArticleLinksProps> = ({ items, className = '' }) => (
  <ul className={`grid gap-5 md:grid-cols-3 ${className}`}>
    {items.map((item) => (
      <li key={item.to}>
        <Link
          to={item.to}
          className="group grid h-full content-start gap-3 rounded-[3px] border border-brand-line p-7 no-underline transition-colors duration-300 hover:border-brand-dark focus-visible:border-brand-dark"
        >
          <span className="text-os-eyebrow uppercase text-brand-muted">Článok</span>
          <h3 className="text-[1.2rem] font-semibold leading-snug">{item.title}</h3>
          <p className="text-[0.96rem] font-light text-brand-muted">{item.text}</p>
          <span className="mt-2 inline-flex items-center gap-2 text-[0.92rem] font-medium">
            Čítať článok
            <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </Link>
      </li>
    ))}
  </ul>
);
