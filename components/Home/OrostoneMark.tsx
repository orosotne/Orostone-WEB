import React from 'react';

/** The striped Orostone mark (logo symbol), drawn in currentColor. */
export const OrostoneMarkPaths: React.FC = () => (
  <>
    <path fill="currentColor" d="M0,21.07c0-5.43,2.05-10.38,5.42-14.11v28.23C2.05,31.45,0,26.5,0,21.07Z" />
    <path fill="currentColor" d="M7.69,4.78c1.51-1.24,3.19-2.28,5-3.07v38.71c-1.82-.79-3.5-1.82-5-3.07V4.78Z" />
    <path fill="currentColor" d="M14.96.88c1.6-.49,3.27-.79,5.01-.88v42.14c-1.73-.09-3.41-.39-5.01-.88,0,0,0-40.38,0-40.38Z" />
    <path fill="currentColor" d="M22.24,0c1.73.09,3.41.39,5,.88v40.39c-1.6.49-3.27.79-5,.88V0Z" />
    <path fill="currentColor" d="M29.51,1.71c1.82.79,3.5,1.83,5,3.07v32.58c-1.51,1.24-3.19,2.28-5,3.07V1.71Z" />
    <path fill="currentColor" d="M42.2,21.07c0,5.43-2.05,10.38-5.42,14.12V6.96c3.37,3.74,5.42,8.68,5.42,14.11Z" />
  </>
);

export const OrostoneMark: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 42.15 42.15" aria-hidden="true">
    <OrostoneMarkPaths />
  </svg>
);
