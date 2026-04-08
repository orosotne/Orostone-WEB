import React from 'react';

// Memoized — purely visual, nikdy sa nemusí re-renderovať po mounte.
// Zabráni re-rendrovaniu pri každej SPA navigácii.
export const NoiseOverlay = React.memo(() => (
  <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.4] mix-blend-overlay bg-noise" />
));