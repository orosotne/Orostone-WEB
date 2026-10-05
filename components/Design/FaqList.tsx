import React from 'react';

export interface FaqItem {
  question: string;
  answer: React.ReactNode;
}

interface FaqListProps {
  items: FaqItem[];
  className?: string;
}

/**
 * Questions as native <details>: answers stay in the DOM (FAQPage JSON-LD and crawlers see them),
 * keyboard and screen readers work without script. The plus turns into a minus when open.
 */
export const FaqList: React.FC<FaqListProps> = ({ items, className = '' }) => (
  <div className={`border-t border-brand-line ${className}`}>
    {items.map((item) => (
      <details key={item.question} className="group border-b border-brand-line">
        <summary className="flex min-h-[44px] cursor-pointer list-none items-start justify-between gap-6 py-6 text-[1.06rem] font-medium leading-snug [&::-webkit-details-marker]:hidden">
          {item.question}
          <span
            aria-hidden="true"
            className="relative mt-[0.45em] h-3.5 w-3.5 flex-none before:absolute before:left-0 before:top-1/2 before:h-px before:w-full before:bg-current after:absolute after:left-1/2 after:top-0 after:h-full after:w-px after:bg-current after:transition-transform after:duration-300 group-open:after:scale-y-0"
          />
        </summary>
        <div className="max-w-[68ch] pb-7 font-light leading-relaxed text-brand-muted">{item.answer}</div>
      </details>
    ))}
  </div>
);
