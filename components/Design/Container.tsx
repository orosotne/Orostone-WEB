import React from 'react';

interface ContainerProps extends React.HTMLAttributes<HTMLElement> {
  as?: 'div' | 'header' | 'footer' | 'nav';
}

/** The one content grid of the new design: max 1800 px wide, side margin --os-edge. */
export const Container: React.FC<ContainerProps> = ({ as: Tag = 'div', className = '', ...props }) => (
  <Tag className={`mx-auto w-full max-w-os px-[var(--os-edge)] ${className}`} {...props} />
);
