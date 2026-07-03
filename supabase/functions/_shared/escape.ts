// ===========================================
// _shared/escape.ts — one HTML escaper for all email templates
// ===========================================
// REFACTOR (finding f10): there were THREE escaping behaviours across the
// functions — h() (escapes apostrophes), escapeHtml() (does not), and
// send-newsletter-welcome (NO escaper at all, interpolating a user-supplied
// first name raw into the email <h1> → HTML/phishing injection from an
// orostone.sk-branded address). This is the single, complete escaper; every
// template must route user-controlled strings through it.

export function escapeHtml(input: unknown): string {
  const s = String(input ?? '');
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Tagged-template convenience: html`<h1>Vitajte, ${firstName}!</h1>` auto-escapes interpolations. */
export function html(strings: TemplateStringsArray, ...values: unknown[]): string {
  return strings.reduce((acc, str, i) => acc + str + (i < values.length ? escapeHtml(values[i]) : ''), '');
}
