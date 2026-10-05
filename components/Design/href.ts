/** Absolute URLs, tel: and mailto: render as <a>; everything else is an internal route. */
export const isExternalHref = (to: string): boolean => /^(https?:|tel:|mailto:)/.test(to);

/** Absolute http(s) links open in a new tab. */
export const newTabProps = (to: string): { target?: string; rel?: string } =>
  to.startsWith('http') ? { target: '_blank', rel: 'noopener' } : {};
