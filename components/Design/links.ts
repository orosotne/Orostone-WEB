/** Orientačná cena on oro-klient. `od` names the place of the click (?od=, never UTM); `dekor` preselects a decor. */
export const oroKlientUrl = (od: string, dekor?: string): string =>
  `https://oro-klient.orostone.sk/?od=${od}${dekor ? `&dekor=${dekor}` : ''}`;

export const PHONE_HREF = 'tel:+421917588738';
export const PHONE_LABEL = '+421 917 588 738';

// Verejný 3D konfigurátor beží v CRM (orosotne/orostone-crm, /konfigurator). Je informačný:
// návrh posúdi obchodný zástupca, cenu ani termín nesľubuje.
export const CONFIGURATOR_URL = 'https://crm.orostone.sk/konfigurator';
