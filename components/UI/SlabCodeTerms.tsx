import React from 'react';
import { SLAB_CODE_TERMS } from '../../lib/discountPopup';

/**
 * The short terms of WELCOME5, shared by both newsletter pop-ups (text in lib/discountPopup.ts).
 * Hyphenated words („e-shope“) never break at the hyphen.
 */
export const SlabCodeTerms: React.FC = () => (
  <>
    {SLAB_CODE_TERMS.split(/(\S+-\S+)/).map((part, i) =>
      i % 2 === 1 ? <span key={i} className="whitespace-nowrap">{part}</span> : part,
    )}
  </>
);
