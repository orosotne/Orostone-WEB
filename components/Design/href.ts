/** Absolute URLs, tel:, mailto: and in-page #anchors render as a plain <a>; everything else is an internal route. */
export const isPlainHref = (to: string): boolean => /^(https?:|tel:|mailto:|#)/.test(to);

/** Absolute http(s) links open in a new tab. */
export const newTabProps = (to: string): { target?: string; rel?: string } =>
  to.startsWith('http') ? { target: '_blank', rel: 'noopener' } : {};
