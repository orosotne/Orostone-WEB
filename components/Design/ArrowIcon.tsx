import React from 'react';

export const ArrowIcon: React.FC<{ className?: string }> = ({ className = 'h-3.5 w-3.5' }) => (
  <svg className={`flex-none ${className}`} viewBox="0 0 16 16" aria-hidden="true" focusable="false">
    <path d="M1.5 8h12.5M9.5 3.5 14 8l-4.5 4.5" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
