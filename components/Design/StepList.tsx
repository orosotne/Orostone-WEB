import React from 'react';

export interface StepItem {
  title: React.ReactNode;
  text: React.ReactNode;
}

interface StepListProps {
  steps: StepItem[];
  className?: string;
}

const COLS: Record<number, string> = { 2: 'lg:grid-cols-2', 3: 'lg:grid-cols-3', 4: 'lg:grid-cols-4', 5: 'lg:grid-cols-5' };

/** A real sequence (order matters), so it is numbered: graphite rule, step number, H3 and description. */
export const StepList: React.FC<StepListProps> = ({ steps, className = '' }) => (
  <ol className={`grid gap-x-[clamp(24px,3vw,40px)] gap-y-10 sm:grid-cols-2 ${COLS[steps.length] ?? 'lg:grid-cols-4'} ${className}`}>
    {steps.map((step, i) => (
      <li key={i} className="grid content-start gap-2.5 border-t border-brand-dark pt-6">
        <span className="text-[clamp(1.5rem,1.9vw,1.9rem)] font-semibold leading-none tracking-[-0.02em]" aria-hidden="true">
          {i + 1}
        </span>
        <h3 className="mt-3 text-[1.2rem] font-medium leading-snug">{step.title}</h3>
        <p className="max-w-[40ch] text-[0.96rem] font-light text-brand-muted">{step.text}</p>
      </li>
    ))}
  </ol>
);
