import React from 'react';
import { Link } from 'react-router-dom';
import { useCookies } from '../context/CookieContext';
import { SEOHead } from '../components/UI/SEOHead';
import { ActionButton, LEGAL_BOX, LEGAL_LINK, LegalLayout, LegalSection, PageHero } from '../components/Design';

const TOC = [
  { id: 'co-su-cookies', label: 'Čo sú cookies?' },
  { id: 'typy-technologii', label: 'Typy technológií' },
  { id: 'prehlad-cookies', label: 'Prehľad cookies' },
  { id: 'pravny-zaklad', label: 'Právny základ' },
  { id: 'sprava-cookies', label: 'Správa nastavení' },
  { id: 'tretie-strany', label: 'Tretie strany' },
  { id: 'upozornenie', label: 'Upozornenie' },
];

// Consent state chips: graphite when the category is on, outlined when it waits for consent
const stateChip = (on: boolean) =>
  `inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm ${
    on ? 'bg-brand-dark text-brand-light' : 'border border-brand-line text-brand-muted'
  }`;

export const CookiesPolicy = () => {
  const { preferences, openSettings } = useCookies();

  return (
    <div>
      <SEOHead
        title="Zásady používania cookies a podobných technológií | OROSTONE"
        description="Informácie o cookies a podobných technológiách na webe OROSTONE. Typy technológií, účely spracovania a nastavenie vlastných preferencií."
        canonical="https://orostone.sk/cookies"
      />
      <PageHero
        eyebrow="Zásady • Transparentnosť"
        title={<>Zásady používania cookies a&nbsp;podobných technológií</>}
        lead={
          <>
            Táto stránka vysvetľuje, ako používame cookies a podobné technológie na našom webe,
            na aké účely ich používame a ako môžete svoje nastavenia kedykoľvek zmeniť.
            Nevyhnutné technológie používame na zabezpečenie základného fungovania webu;
            analytické a marketingové technológie aktivujeme až po vašom predchádzajúcom súhlase.
          </>
        }
      />

      <LegalLayout
        toc={TOC}
        intro={
          <>
            {/* Prevádzkovateľ */}
            <div className={`${LEGAL_BOX} p-6`}>
              <h2 className="mb-4 text-os-eyebrow uppercase text-brand-muted">
                Prevádzkovateľ webu
              </h2>
              <div className="space-y-1 text-sm font-light leading-relaxed">
                <p className="font-medium text-brand-dark">Orostone s.r.o.</p>
                <p>Landererova 8, 811 09 Bratislava – mestská časť Staré Mesto</p>
                <p>IČO: 55 254 772 • DIČ: 2121930580 • IČ DPH: SK2121930580</p>
                <p>Zapísaná v Obchodnom registri Mestského súdu Bratislava III, oddiel Sro, vložka 167404/B</p>
                <p className="font-medium text-brand-dark">info@orostone.sk</p>
              </div>
            </div>

            {/* Current Status Banner */}
            <div className="flex flex-col gap-4 rounded-[3px] border border-brand-line p-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="mb-3 font-semibold text-brand-dark">Vaše aktuálne nastavenia</h3>
                <div className="flex flex-wrap gap-2.5">
                  <span className={stateChip(true)}>
                    <span className="h-2 w-2 rounded-full bg-current"></span>
                    Nevyhnutné: Vždy aktívne
                  </span>
                  <span className={stateChip(preferences.analytics)}>
                    <span className="h-2 w-2 rounded-full bg-current"></span>
                    Analytické: {preferences.analytics ? 'Povolené' : 'Podľa vášho súhlasu'}
                  </span>
                  <span className={stateChip(preferences.marketing)}>
                    <span className="h-2 w-2 rounded-full bg-current"></span>
                    Marketingové: {preferences.marketing ? 'Povolené' : 'Podľa vášho súhlasu'}
                  </span>
                </div>
              </div>
              <ActionButton size="sm" onClick={openSettings}>
                Zmeniť nastavenia
              </ActionButton>
            </div>
          </>
        }
      >
        {/* Content */}
        <div>
          {/* 1. Čo sú cookies */}
          <LegalSection id="co-su-cookies" number="1" title="Čo sú cookies a podobné technológie?" subtitle="Základné informácie">
              <p>
                Cookies a podobné technológie sú malé dátové súbory alebo technické mechanizmy,
                ktoré sa ukladajú vo vašom zariadení alebo z neho získavajú informácie
                pri používaní webovej stránky.
              </p>
              <p>
                Používajú sa najmä na zabezpečenie základného fungovania webu,
                zapamätanie vašich nastavení, meranie návštevnosti a výkonu webu
                a personalizáciu obsahu a reklamy (ak ste na to udelili súhlas).
              </p>
              <div className={`${LEGAL_BOX} p-4`}>
                <p className="text-sm">
                  Niektoré z týchto technológií môžu obsahovať alebo vytvárať identifikátory,
                  ktoré sa môžu považovať za osobné údaje.
                </p>
              </div>
          </LegalSection>

          {/* 2. Typy technológií */}
          <LegalSection id="typy-technologii" number="2" title="Aké typy technológií používame" subtitle="Rozdelenie podľa účelu">
              {/* Nevyhnutné */}
              <div className="border-l-2 border-brand-dark pl-4">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-brand-dark">Nevyhnutné</h3>
                  <span className="rounded-full bg-brand-dark px-2 py-0.5 text-xs text-brand-light">
                    Vždy aktívne
                  </span>
                </div>
                <p className="text-sm leading-relaxed">
                  Tieto technológie sú potrebné na základné fungovanie webu, bezpečnosť,
                  správne zobrazenie stránky a uloženie vašich nastavení súhlasu.
                  Bez nich by web nefungoval správne.
                </p>
              </div>

              {/* Funkčné */}
              <div className="border-l-2 border-brand-dark pl-4">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-brand-dark">Funkčné</h3>
                  <span className="rounded-full bg-brand-dark px-2 py-0.5 text-xs text-brand-light">
                    Podľa použitia funkcie
                  </span>
                </div>
                <p className="text-sm leading-relaxed">
                  Tieto technológie pomáhajú zapamätať si vaše preferencie
                  a zlepšujú používateľský komfort. Aktivujú sa len v prípadoch,
                  keď je to potrebné na uloženie vami výslovne zvoleného nastavenia.
                </p>
              </div>

              {/* Analytické */}
              <div className={`border-l-2 pl-4 ${preferences.analytics ? 'border-brand-dark' : 'border-brand-line'}`}>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-brand-dark">Analytické</h3>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${
                    preferences.analytics
                      ? 'bg-brand-dark text-brand-light'
                      : 'border border-brand-line text-brand-muted'
                  }`}>
                    {preferences.analytics ? 'Povolené' : 'Podľa vášho súhlasu'}
                  </span>
                </div>
                <p className="text-sm leading-relaxed">
                  Používajú sa na meranie návštevnosti a správania na webe,
                  aby sme vedeli zlepšovať obsah, štruktúru a výkon stránky.
                  Aktivujú sa iba po vašom predchádzajúcom súhlase.
                </p>
              </div>

              {/* Marketingové */}
              <div className={`border-l-2 pl-4 ${preferences.marketing ? 'border-brand-dark' : 'border-brand-line'}`}>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-brand-dark">Marketingové</h3>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${
                    preferences.marketing
                      ? 'bg-brand-dark text-brand-light'
                      : 'border border-brand-line text-brand-muted'
                  }`}>
                    {preferences.marketing ? 'Povolené' : 'Podľa vášho súhlasu'}
                  </span>
                </div>
                <p className="text-sm leading-relaxed">
                  Používajú sa na meranie účinnosti reklamy, remarketing
                  a zobrazovanie relevantnejších reklamných kampaní.
                  Aktivujú sa iba po vašom predchádzajúcom súhlase.
                </p>
              </div>
          </LegalSection>

          {/* 3. Prehľad používaných cookies */}
          <LegalSection id="prehlad-cookies" number="3" title="Prehľad používaných cookies a podobných technológií" subtitle="Podrobný zoznam">
              <div className="overflow-x-auto -mx-2">
                <table className="w-full text-sm min-w-[600px]">
                  <thead>
                    <tr className="border-b border-brand-dark">
                      <th className="py-3 px-2 text-left text-[0.7rem] font-bold uppercase tracking-[0.12em] text-brand-dark">Názov</th>
                      <th className="py-3 px-2 text-left text-[0.7rem] font-bold uppercase tracking-[0.12em] text-brand-dark">Poskytovateľ</th>
                      <th className="py-3 px-2 text-left text-[0.7rem] font-bold uppercase tracking-[0.12em] text-brand-dark">Typ</th>
                      <th className="py-3 px-2 text-left text-[0.7rem] font-bold uppercase tracking-[0.12em] text-brand-dark">Účel</th>
                      <th className="py-3 px-2 text-left text-[0.7rem] font-bold uppercase tracking-[0.12em] text-brand-dark">Doba uloženia</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-line">
                    <tr>
                      <td className="py-3 px-2 align-top font-mono text-xs [overflow-wrap:anywhere]">orostone-cookies</td>
                      <td className="py-3 px-2 align-top">Orostone</td>
                      <td className="py-3 px-2 align-top"><span className="text-xs font-medium text-brand-muted">Nevyhnutné</span></td>
                      <td className="py-3 px-2 align-top">localStorage – uloženie vašich nastavení cookies a záznamu o udelenom alebo odvolanom súhlase</td>
                      <td className="min-w-[8rem] py-3 px-2 align-top">Do zmeny nastavení alebo vymazania prehliadačom</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-2 align-top font-mono text-xs [overflow-wrap:anywhere]">orostone_shopify_cart_id</td>
                      <td className="py-3 px-2 align-top">Orostone / Shopify</td>
                      <td className="py-3 px-2 align-top"><span className="text-xs font-medium text-brand-muted">Nevyhnutné</span></td>
                      <td className="py-3 px-2 align-top">localStorage – zachovanie obsahu nákupného košíka</td>
                      <td className="min-w-[8rem] py-3 px-2 align-top">Do vymazania košíka alebo údajov prehliadača</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-2 align-top font-mono text-xs [overflow-wrap:anywhere]">cf_clearance, __cf_bm</td>
                      <td className="py-3 px-2 align-top">Cloudflare</td>
                      <td className="py-3 px-2 align-top"><span className="text-xs font-medium text-brand-muted">Nevyhnutné</span></td>
                      <td className="py-3 px-2 align-top">Ochrana formulárov a webu pred spamom, botmi a zneužitím; bezpečnostné mechanizmy Cloudflare</td>
                      <td className="min-w-[8rem] py-3 px-2 align-top">Do 30 minút alebo podľa konfigurácie služby</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-2 align-top font-mono text-xs [overflow-wrap:anywhere]">orostone-theme</td>
                      <td className="py-3 px-2 align-top">Orostone</td>
                      <td className="py-3 px-2 align-top"><span className="text-xs font-medium text-brand-muted">Funkčné</span></td>
                      <td className="py-3 px-2 align-top">localStorage – uloženie vami zvolenej preferencie zobrazenia stránky</td>
                      <td className="min-w-[8rem] py-3 px-2 align-top">Do zmeny nastavenia alebo vymazania prehliadačom</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-2 align-top font-mono text-xs [overflow-wrap:anywhere]">orostone-newsletter-popup</td>
                      <td className="py-3 px-2 align-top">Orostone</td>
                      <td className="py-3 px-2 align-top"><span className="text-xs font-medium text-brand-muted">Funkčné</span></td>
                      <td className="py-3 px-2 align-top">localStorage – uloženie informácie o vašej interakcii s vyskakovacím oknom newslettera</td>
                      <td className="min-w-[8rem] py-3 px-2 align-top">Do vymazania prehliadačom alebo podľa nastavenia webu</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-2 align-top font-mono text-xs [overflow-wrap:anywhere]">orostone_installation_data</td>
                      <td className="py-3 px-2 align-top">Orostone</td>
                      <td className="py-3 px-2 align-top"><span className="text-xs font-medium text-brand-muted">Funkčné</span></td>
                      <td className="py-3 px-2 align-top">localStorage – vami zadané údaje kalkulácie montáže, ktoré sa zobrazia v košíku</td>
                      <td className="min-w-[8rem] py-3 px-2 align-top">Do odstránenia z košíka alebo vymazania prehliadačom</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-2 align-top font-mono text-xs [overflow-wrap:anywhere]">_ga</td>
                      <td className="py-3 px-2 align-top">Google</td>
                      <td className="py-3 px-2 align-top"><span className="text-xs font-medium text-brand-muted">Analytické</span></td>
                      <td className="py-3 px-2 align-top">
                        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className={LEGAL_LINK}>Google Analytics</a> – rozlíšenie návštevníkov a meranie návštevnosti (len so súhlasom)
                      </td>
                      <td className="min-w-[8rem] py-3 px-2 align-top">2 roky</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-2 align-top font-mono text-xs [overflow-wrap:anywhere]">_ga_W3ZPVYZ9HQ, _ga_B7PV9X0X8X</td>
                      <td className="py-3 px-2 align-top">Google</td>
                      <td className="py-3 px-2 align-top"><span className="text-xs font-medium text-brand-muted">Analytické</span></td>
                      <td className="py-3 px-2 align-top">Google Analytics – uchovanie stavu relácie</td>
                      <td className="min-w-[8rem] py-3 px-2 align-top">2 roky</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-2 align-top font-mono text-xs [overflow-wrap:anywhere]">orostone_utm</td>
                      <td className="py-3 px-2 align-top">Orostone</td>
                      <td className="py-3 px-2 align-top"><span className="text-xs font-medium text-brand-muted">Analytické</span></td>
                      <td className="py-3 px-2 align-top">sessionStorage – zdroj návštevy z odkazu kampane (UTM), ktorý sa odovzdá pokladni na priradenie objednávky</td>
                      <td className="min-w-[8rem] py-3 px-2 align-top">Do zatvorenia okna prehliadača</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-2 align-top font-mono text-xs [overflow-wrap:anywhere]">orostone_pending_purchase</td>
                      <td className="py-3 px-2 align-top">Orostone</td>
                      <td className="py-3 px-2 align-top"><span className="text-xs font-medium text-brand-muted">Analytické</span></td>
                      <td className="py-3 px-2 align-top">sessionStorage – súhrn objednávky pred presmerovaním do pokladne, aby sa po zaplatení dal zaznamenať nákup</td>
                      <td className="min-w-[8rem] py-3 px-2 align-top">Do zobrazenia potvrdenia objednávky alebo zatvorenia okna</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-2 align-top font-mono text-xs [overflow-wrap:anywhere]">orostone_internal</td>
                      <td className="py-3 px-2 align-top">Orostone</td>
                      <td className="py-3 px-2 align-top"><span className="text-xs font-medium text-brand-muted">Analytické</span></td>
                      <td className="py-3 px-2 align-top">cookie – označenie návštev nášho tímu, aby sa nezapočítavali do štatistík; nastaví sa len cez interný odkaz</td>
                      <td className="min-w-[8rem] py-3 px-2 align-top">1 rok</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-2 align-top font-mono text-xs [overflow-wrap:anywhere]">_fbp</td>
                      <td className="py-3 px-2 align-top">Meta</td>
                      <td className="py-3 px-2 align-top"><span className="text-xs font-medium text-brand-muted">Marketingové</span></td>
                      <td className="py-3 px-2 align-top">
                        <a href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noopener noreferrer" className={LEGAL_LINK}>Meta Pixel</a> – meranie konverzií a remarketing (len so súhlasom)
                      </td>
                      <td className="min-w-[8rem] py-3 px-2 align-top">3 mesiace</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-2 align-top font-mono text-xs [overflow-wrap:anywhere]">_fbc</td>
                      <td className="py-3 px-2 align-top">Meta</td>
                      <td className="py-3 px-2 align-top"><span className="text-xs font-medium text-brand-muted">Marketingové</span></td>
                      <td className="py-3 px-2 align-top">Meta Pixel – identifikátor kliknutia z Meta reklamy (len so súhlasom)</td>
                      <td className="min-w-[8rem] py-3 px-2 align-top">3 mesiace</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-2 align-top font-mono text-xs [overflow-wrap:anywhere]">_gcl_aw, _gcl_au</td>
                      <td className="py-3 px-2 align-top">Google</td>
                      <td className="py-3 px-2 align-top"><span className="text-xs font-medium text-brand-muted">Marketingové</span></td>
                      <td className="py-3 px-2 align-top">Google Ads – uloženie identifikátora kliknutia na reklamu a meranie konverzií</td>
                      <td className="min-w-[8rem] py-3 px-2 align-top">90 dní</td>
                    </tr>
                  </tbody>
                </table>
              </div>
          </LegalSection>

          {/* 4. Právny základ */}
          <LegalSection id="pravny-zaklad" number="4" title="Právny základ" subtitle="Na základe čoho technológie používame">
              <p>
                Používanie <strong>nevyhnutných technológií</strong> je založené na potrebe
                zabezpečiť riadne fungovanie a bezpečnosť webu.
              </p>
              <p>
                Používanie <strong>analytických, funkčných a marketingových technológií</strong> je
                založené na vašom súhlase, ak právne predpisy alebo povaha konkrétnej technológie
                neumožňujú iný režim.
              </p>
              <p>
                Analytické a marketingové technológie sa aktivujú <strong>až po predchádzajúcom súhlase</strong> a
                súhlas možno rovnako ľahko odvolať, ako bol udelený.
                Odvolanie súhlasu nemá vplyv na zákonnosť spracúvania vykonaného pred jeho odvolaním.
              </p>
          </LegalSection>

          {/* 5. Správa nastavení */}
          <LegalSection id="sprava-cookies" number="5" title="Ako spravovať svoje nastavenia?" subtitle="Možnosti kontroly">
              <div>
                <h3 className="mb-2 font-semibold text-brand-dark">Na našej stránke</h3>
                <p className="mb-2">
                  Svoje nastavenia cookies a podobných technológií môžete kedykoľvek zmeniť:
                </p>
                <ul className="text-sm space-y-1 mb-4">
                  <li>• prostredníctvom odkazu „Nastavenia cookies“ v pätičke webu,</li>
                  <li>• prostredníctvom cookie bannera alebo centra preferencií,</li>
                  <li>• vo vašom internetovom prehliadači.</li>
                </ul>
                <ActionButton size="sm" onClick={openSettings}>
                  Otvoriť nastavenia cookies
                </ActionButton>
              </div>

              <div>
                <h3 className="mb-3 font-semibold text-brand-dark">V prehliadači</h3>
                <p className="mb-4 text-sm">
                  Väčšina webových prehliadačov umožňuje kontrolu cookies cez nastavenia.
                  Tu sú odkazy na návody pre najpoužívanejšie prehliadače:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { name: 'Chrome', url: 'https://support.google.com/chrome/answer/95647' },
                    { name: 'Firefox', url: 'https://support.mozilla.org/sk/kb/povolenie-zakazanie-cookies' },
                    { name: 'Safari', url: 'https://support.apple.com/sk-sk/guide/safari/sfri11471/mac' },
                    { name: 'Edge', url: 'https://support.microsoft.com/sk-sk/microsoft-edge/odstraňovanie-súborov-cookie-v-microsoft-edge' },
                  ].map((browser) => (
                    <a
                      key={browser.name}
                      href={browser.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex min-h-[44px] items-center justify-center gap-2 rounded-[3px] bg-brand-sand px-4 py-3 text-sm font-medium transition-colors hover:bg-[#E6E3DA]"
                    >
                      {browser.name}
                      <span className="font-medium text-brand-dark">↗</span>
                    </a>
                  ))}
                </div>
              </div>
          </LegalSection>

          {/* 6. Tretie strany */}
          <LegalSection id="tretie-strany" number="6" title="Tretie strany" subtitle="Technológie tretích strán na našom webe">
              <p>Na našom webe môžu byť používané technológie tretích strán, najmä:</p>
              <div className="space-y-3">
                {[
                  { name: 'Shopify', desc: 'prevádzka e-shopu a košíka' },
                  { name: 'Cloudflare', desc: 'ochrana formulárov a webu' },
                  { name: 'Google (Google Analytics 4, Google Tag Manager, Google Ads)', desc: 'analytika návštevnosti, meranie konverzií a remarketing' },
                  { name: 'Meta (Meta Pixel)', desc: 'remarketing a meranie konverzií' },
                  { name: 'Vercel', desc: 'anonymné meranie návštevnosti a rýchlosti stránok bez cookies' },
                ].map((item) => (
                  <div key={item.name} className={`${LEGAL_BOX} p-3`}>
                    <span className="font-semibold text-brand-dark">{item.name}</span>
                    <span className="text-sm text-brand-muted"> – {item.desc}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm">
                Ak sú technológie tretích strán spojené so spracúvaním osobných údajov,
                viac informácií nájdete v našich{' '}
                <Link to="/ochrana-sukromia" className={LEGAL_LINK}>
                  Zásadách ochrany osobných údajov
                </Link>.
              </p>
          </LegalSection>

          {/* 7. Upozornenie */}
          <LegalSection id="upozornenie" number="7" title="Dôležité upozornenie">
              <div className="rounded-r-[3px] border-l-2 border-brand-dark bg-brand-sand p-4">
                <p className="text-sm leading-relaxed">
                  Blokovanie alebo vypnutie niektorých technológií môže ovplyvniť funkčnosť
                  webu alebo dostupnosť určitých funkcií, najmä košíka, formulárov
                  a bezpečnostných mechanizmov.
                </p>
              </div>
          </LegalSection>
        </div>

        {/* Footer Info */}
        <div className="mt-6 flex flex-col items-start justify-between gap-6 border-t border-brand-line pt-8 md:flex-row md:items-center">
          <div>
            <p className="text-sm text-brand-muted">Posledná aktualizácia</p>
            <p className="text-lg font-medium text-brand-dark">7.&nbsp;10.&nbsp;2026</p>
          </div>
          <div className="flex gap-4">
            <ActionButton variant="outline" onClick={openSettings}>
              Nastavenia cookies
            </ActionButton>
          </div>
        </div>
      </LegalLayout>
    </div>
  );
};
