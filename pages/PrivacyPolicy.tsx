import React from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../components/UI/SEOHead';
import { ActionButton, LEGAL_BOX, LEGAL_LINK, LegalLayout, LegalSection, PageHero } from '../components/Design';

const TOC = [
  { id: 'prevadzkovatel', label: 'Prevádzkovateľ' },
  { id: 'ucel', label: 'Účel spracovania' },
  { id: 'neposkytnutie', label: 'Neposkytnutie údajov' },
  { id: 'tretie-strany', label: 'Tretie strany' },
  { id: 'rozsah', label: 'Rozsah údajov' },
  { id: 'doba', label: 'Doba uchovávania' },
  { id: 'medzinarodny-prenos', label: 'Medzinárodný prenos' },
  { id: 'prava', label: 'Vaše práva' },
  { id: 'cookies', label: 'Cookies' },
  { id: 'kontakt', label: 'Kontakt' },
];

export const PrivacyPolicy = () => {
  return (
    <div>
      <SEOHead
        title="Ochrana osobných údajov | OROSTONE"
        description="Zásady ochrany osobných údajov spoločnosti OROSTONE s.r.o. Spracúvanie údajov v súlade s GDPR — účely, právny základ a vaše práva."
        canonical="https://orostone.sk/ochrana-sukromia"
      />
      <PageHero
        eyebrow="GDPR • Ochrana údajov"
        title="Ochrana osobných údajov"
        lead={
          <>
            Snažíme sa o to, aby ste sa pri nás cítili v bezpečí, preto sme prijali
            primerané technické a organizačné opatrenia
            na ochranu vašich osobných údajov.
          </>
        }
      />

      <LegalLayout toc={TOC}>
        {/* Content */}
        <div>
          {/* 1. Prevádzkovateľ */}
          <LegalSection id="prevadzkovatel" number="1" title="Prevádzkovateľ" subtitle="Kto spracúva vaše údaje">
              <p>
                Prevádzkovateľom osobných údajov podľa § 5 písm. o) zákona č. 18/2018 Z.&nbsp;z.
                o ochrane osobných údajov v znení neskorších predpisov (ďalej len „Zákon“) je:
              </p>
              <div className={`${LEGAL_BOX} p-6 font-normal`}>
                <p className="text-brand-dark text-lg mb-2">Orostone s.r.o.</p>
                <p>IČO: 55 254 772</p>
                <p>DIČ: 2121930580</p>
                <p>IČ DPH: SK2121930580</p>
                <p>Landererova 8, 811 09 Bratislava – mestská časť Staré Mesto</p>
                <p className="mt-2 text-sm text-brand-muted">Zapísaná v Obchodnom registri Mestského súdu Bratislava III, oddiel Sro, vložka 167404/B</p>
                <p className="mt-4 font-medium text-brand-dark">info@orostone.sk</p>
              </div>
          </LegalSection>

          {/* 2. Účel spracovania */}
          <LegalSection id="ucel" number="2" title="Účel spracovania osobných údajov" subtitle="Prečo spracúvame vaše údaje">
              <p className="mb-4">Vaše osobné údaje spracúvame na tieto účely:</p>
              <div className="overflow-x-auto -mx-2">
                <table className="w-full text-sm border-collapse min-w-[500px]">
                  <thead>
                    <tr className="border-b border-brand-dark">
                      <th className="py-2 px-3 text-left text-[0.7rem] font-bold uppercase tracking-[0.12em] text-brand-dark">Účel</th>
                      <th className="py-2 px-3 text-left text-[0.7rem] font-bold uppercase tracking-[0.12em] text-brand-dark">Opis</th>
                      <th className="py-2 px-3 text-left text-[0.7rem] font-bold uppercase tracking-[0.12em] text-brand-dark">Právny základ (GDPR čl. 6)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-line">
                    <tr>
                      <td className="py-3 px-3 font-semibold text-brand-dark align-top">Vybavenie objednávky</td>
                      <td className="py-3 px-3 align-top">Spracovanie a doručenie objednaného tovaru</td>
                      <td className="py-3 px-3 align-top">čl. 6 ods. 1 písm. b) – plnenie zmluvy</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 font-semibold text-brand-dark align-top">Komunikácia</td>
                      <td className="py-3 px-3 align-top">Informovanie o stave objednávky, odpovedanie na dopyty a poskytovanie cenových ponúk</td>
                      <td className="py-3 px-3 align-top">čl. 6 ods. 1 písm. b) – plnenie zmluvy / čl. 6 ods. 1 písm. f) – oprávnený záujem (vybavenie dopytu zákazníka a poskytnutie cenovej ponuky)</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 font-semibold text-brand-dark align-top">Zákonné povinnosti</td>
                      <td className="py-3 px-3 align-top">Vedenie účtovníctva, plnenie daňových a archivačných povinností</td>
                      <td className="py-3 px-3 align-top">čl. 6 ods. 1 písm. c) – zákonná povinnosť</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 font-semibold text-brand-dark align-top">Bezpečnosť</td>
                      <td className="py-3 px-3 align-top">Ochrana formulárov pred automatizovanými útokmi (Cloudflare Turnstile)</td>
                      <td className="py-3 px-3 align-top">čl. 6 ods. 1 písm. f) – oprávnený záujem (ochrana webovej stránky a formulárov pred zneužitím)</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 font-semibold text-brand-dark align-top">Marketing</td>
                      <td className="py-3 px-3 align-top">Newsletter, remarketingové ponuky a meranie účinnosti reklám v Google Ads a na Facebooku či Instagrame (len s výslovným súhlasom)</td>
                      <td className="py-3 px-3 align-top">čl. 6 ods. 1 písm. a) – súhlas</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 font-semibold text-brand-dark align-top">Analytika</td>
                      <td className="py-3 px-3 align-top">Meranie návštevnosti a správania na webe (Google Analytics 4) po udelení súhlasu</td>
                      <td className="py-3 px-3 align-top">čl. 6 ods. 1 písm. a) – súhlas</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs text-brand-muted">
                Automatizované rozhodovanie ani profilovanie v zmysle čl. 22 GDPR <strong>nevykonávame</strong>.
              </p>
          </LegalSection>

          {/* 3. Dôsledky neposkytnutia údajov */}
          <LegalSection id="neposkytnutie" number="3" title="Dôsledky neposkytnutia osobných údajov" subtitle="Čo sa stane, ak nám údaje neposkytnete (čl. 13 ods. 2 písm. e) GDPR)">
              <div className="space-y-3">
                <div className={`${LEGAL_BOX} p-4`}>
                  <h4 className="mb-2 font-semibold text-brand-dark">Objednávka a dopyt</h4>
                  <p className="text-sm">
                    Poskytnutie kontaktných a dodacích údajov je <strong>zmluvnou požiadavkou</strong> potrebnou na spracovanie objednávky a doručenie tovaru.
                    Bez ich poskytnutia nie je možné uzatvoriť kúpnu zmluvu ani objednávku vybaviť.
                  </p>
                </div>
                <div className={`${LEGAL_BOX} p-4`}>
                  <h4 className="mb-2 font-semibold text-brand-dark">Newsletter</h4>
                  <p className="text-sm">
                    Prihlásenie na newsletter je <strong>dobrovoľné</strong>. Ak e-mailovú adresu neposkytnete, odber newslettera nebude možný.
                    Súhlas možno kedykoľvek odvolať kliknutím na odkaz v e-maile.
                  </p>
                </div>
                <div className={`${LEGAL_BOX} p-4`}>
                  <h4 className="mb-2 font-semibold text-brand-dark">Analytické a marketingové cookies</h4>
                  <p className="text-sm">
                    Súhlas s analytickými a marketingovými cookies je <strong>dobrovoľný</strong>. Web funguje aj bez nich – len nevyhnutné cookies sú aktívne vždy.
                  </p>
                </div>
              </div>
          </LegalSection>

          {/* 4. Tretie strany a sprostredkovatelia */}
          <LegalSection id="tretie-strany" number="4" title="Tretie strany a sprostredkovatelia" subtitle="Komu môžeme vaše údaje poskytnúť">

              {/* Sprostredkovatelia */}
              <div>
                <h3 className="mb-3 text-base font-semibold text-brand-dark">
                  Sprostredkovatelia (čl. 28 GDPR)
                </h3>
                <p className="mb-3 text-sm text-brand-muted">
                  Nasledujúce subjekty spracúvajú osobné údaje v mene Orostone na základe písomnej zmluvy o spracúvaní osobných údajov a výlučne podľa našich pokynov:
                </p>
                <div className="space-y-3">
                  {[
                    {
                      name: 'Shopify Inc.',
                      purpose: 'E-shopová platforma, spracovanie objednávok a platieb pri nákupe cez e-shop',
                      location: 'Kanada / USA',
                      note: 'Shopify je certifikovaný PCI DSS spracovateľ platieb. Vlastné zásady: privacy.shopify.com',
                    },
                    {
                      name: 'Supabase Inc.',
                      purpose: 'Databáza zákazníkov, ukladanie dopytov a cenových ponúk, autentifikácia',
                      location: 'EÚ (Frankfurt, Nemecko)',
                      note: 'Dáta sú uložené na serveroch v EÚ. Prenos mimo EHP sa nevykonáva.',
                    },
                    {
                      name: 'Resend Inc.',
                      purpose: 'Odosielanie e-mailov – potvrdenia dopytov, notifikácie o objednávke a newsletter',
                      location: 'USA',
                      note: 'E-mailová adresa príjemcu sa zdieľa iba na doručenie správy.',
                    },
                    {
                      name: 'Vercel Inc.',
                      purpose: 'Hosting a doručovanie webovej stránky orostone.sk, anonymné meranie návštevnosti a rýchlosti stránok (Vercel Web Analytics, Speed Insights)',
                      location: 'USA',
                      note: 'IP adresa a technické údaje návštevníka môžu byť dočasne spracované. Meranie návštevnosti a rýchlosti nepoužíva cookies.',
                    },
                  ].map((item) => (
                    <div key={item.name} className={`${LEGAL_BOX} p-4`}>
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-1 mb-1">
                        <h4 className="font-semibold text-brand-dark">{item.name}</h4>
                        <span className="shrink-0 text-xs font-medium text-brand-muted">{item.location}</span>
                      </div>
                      <p className="text-sm mb-1">{item.purpose}</p>
                      <p className="text-xs italic text-brand-muted">{item.note}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Príjemcovia / samostatní prevádzkovatelia */}
              <div>
                <h3 className="mb-3 text-base font-semibold text-brand-dark">
                  Príjemcovia / samostatní prevádzkovatelia
                </h3>
                <p className="mb-3 text-sm text-brand-muted">
                  Nasledujúce subjekty môžu pri poskytovaní svojich služieb vystupovať ako samostatní prevádzkovatelia a spracúvať osobné údaje podľa vlastných zásad ochrany súkromia:
                </p>
                <div className="space-y-3">
                  {[
                    {
                      name: 'Cloudflare, Inc.',
                      purpose: 'Ochrana formulárov pred botmi a automatizovanými útokmi (Turnstile CAPTCHA)',
                      location: 'USA',
                      note: 'Spracúva technické signály zariadenia (IP adresu, odtlačok prehliadača). Cloudflare môže tieto údaje dočasne uchovávať na účely bezpečnostnej analýzy.',
                    },
                    {
                      name: 'Meta Platforms, Inc. (Facebook / Instagram)',
                      purpose: 'Remarketing a meranie konverzií cez Meta Pixel – zobrazovanie relevantných reklám; zobrazenie príspevkov z nášho Instagramu na webe',
                      location: 'USA',
                      note: 'Meta Pixel sa aktivuje iba po vašom súhlase s marketingovými cookies. Obrázky príspevkov z Instagramu sa načítavajú zo serverov Meta, ktoré pri tom spracúvajú IP adresu návštevníka. Meta spracúva údaje podľa vlastných zásad súkromia.',
                    },
                    {
                      name: 'Google LLC',
                      purpose: 'Analytika návštevnosti (Google Analytics 4), správa meracích kódov (Google Tag Manager), meranie konverzií a remarketing (Google Ads)',
                      location: 'USA',
                      note: 'Google Analytics sa aktivuje iba po súhlase s analytickými cookies. Google Ads používa identifikátor kliknutia na reklamu (cookies _gcl_aw, _gcl_au) na priradenie dopytov a objednávok ku kampaniam. Google spracúva údaje podľa svojich zásad ochrany súkromia.',
                    },
                  ].map((item) => (
                    <div key={item.name} className={`${LEGAL_BOX} p-4`}>
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-1 mb-1">
                        <h4 className="font-semibold text-brand-dark">{item.name}</h4>
                        <span className="shrink-0 text-xs font-medium text-brand-muted">{item.location}</span>
                      </div>
                      <p className="text-sm mb-1">{item.purpose}</p>
                      <p className="text-xs italic text-brand-muted">{item.note}</p>
                    </div>
                  ))}
                </div>
              </div>
          </LegalSection>

          {/* 5. Rozsah údajov */}
          <LegalSection id="rozsah" number="5" title="Rozsah spracovaných údajov" subtitle="Aké údaje zhromažďujeme">
              <div className="grid md:grid-cols-2 gap-4">
                <div className={`${LEGAL_BOX} p-4`}>
                  <h4 className="mb-2 font-semibold text-brand-dark">Identifikačné údaje</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Meno a priezvisko</li>
                    <li>• Fakturačná adresa</li>
                    <li>• Dodacia adresa</li>
                    <li>• IČO, DIČ (pri firmách)</li>
                  </ul>
                </div>
                <div className={`${LEGAL_BOX} p-4`}>
                  <h4 className="mb-2 font-semibold text-brand-dark">Kontaktné údaje</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Telefónne číslo</li>
                    <li>• E-mailová adresa</li>
                  </ul>
                </div>
                <div className={`${LEGAL_BOX} p-4`}>
                  <h4 className="mb-2 font-semibold text-brand-dark">Údaje o objednávke</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Objednaný tovar</li>
                    <li>• História objednávok</li>
                    <li>• Platobné údaje</li>
                  </ul>
                </div>
                <div className={`${LEGAL_BOX} p-4`}>
                  <h4 className="mb-2 font-semibold text-brand-dark">Technické údaje</h4>
                  <ul className="text-sm space-y-1">
                    <li>• IP adresa</li>
                    <li>• Cookies (podľa súhlasu)</li>
                    <li>• Údaje o prehliadači</li>
                    <li>• Meta Pixel ID (len so súhlasom)</li>
                    <li>• Identifikátor kliknutia na reklamu (Google Ads, Meta)</li>
                    <li>• Zdroj návštevy z odkazu kampane (UTM)</li>
                  </ul>
                </div>
              </div>
          </LegalSection>

          {/* 6. Doba uchovávania */}
          <LegalSection id="doba" number="6" title="Doba uchovávania údajov" subtitle="Ako dlho vaše údaje uchovávame">
              <div className="space-y-3">
                <div className={`${LEGAL_BOX} flex items-center gap-4 p-4`}>
                  <span className="min-w-[2.5rem] text-center text-2xl font-light tabular-nums text-brand-dark">10</span>
                  <div>
                    <p className="font-semibold text-brand-dark">rokov</p>
                    <p className="text-sm">Účtovné a daňové doklady (zákonná povinnosť)</p>
                  </div>
                </div>
                <div className={`${LEGAL_BOX} flex items-center gap-4 p-4`}>
                  <span className="min-w-[2.5rem] text-center text-2xl font-light tabular-nums text-brand-dark">5</span>
                  <div>
                    <p className="font-semibold text-brand-dark">rokov</p>
                    <p className="text-sm">Obchodná korešpondencia, cenové ponuky a kontaktné formuláre</p>
                  </div>
                </div>
                <div className={`${LEGAL_BOX} flex items-center gap-4 p-4`}>
                  <span className="min-w-[2.5rem] text-center text-2xl font-light tabular-nums text-brand-dark">2</span>
                  <div>
                    <p className="font-semibold text-brand-dark">roky</p>
                    <p className="text-sm">Zodpovednosť za vady – údaje na vybavenie reklamácií</p>
                  </div>
                </div>
                <div className={`${LEGAL_BOX} flex items-center gap-4 p-4`}>
                  <span className="min-w-[2.5rem] text-center text-2xl font-light tabular-nums text-brand-dark">90</span>
                  <div>
                    <p className="font-semibold text-brand-dark">dní</p>
                    <p className="text-sm">Bezpečnostné a technické logy (ochrana pred zneužitím)</p>
                  </div>
                </div>
                <div className={`${LEGAL_BOX} flex items-start gap-4 p-4`}>
                  <span className="min-w-[2.5rem] pt-1 text-center text-sm font-normal text-brand-dark">∞ /</span>
                  <div>
                    <p className="font-semibold text-brand-dark">Do odvolania súhlasu</p>
                    <p className="text-sm">Newsletter – e-mailová adresa sa uchováva do odvolania súhlasu. Po odvolaní súhlasu sú údaje vymazané do 30 dní.</p>
                  </div>
                </div>
                <div className={`${LEGAL_BOX} flex items-start gap-4 p-4`}>
                  <span className="min-w-[2.5rem] pt-1 text-center text-sm font-normal text-brand-dark">→</span>
                  <div>
                    <p className="font-semibold text-brand-dark">Cookies</p>
                    <p className="text-sm">
                      Doba platnosti cookies sa líši podľa typu. Podrobnosti nájdete v{' '}
                      <Link to="/cookies" className={LEGAL_LINK}>zásadách cookies</Link>.
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-sm italic mt-4">
                Po uplynutí príslušných lehôt sú údaje bezpečne vymazané.
              </p>
          </LegalSection>

          {/* 7. Medzinárodný prenos údajov */}
          <LegalSection id="medzinarodny-prenos" number="7" title="Medzinárodný prenos údajov" subtitle="Prenos údajov mimo Európskeho hospodárskeho priestoru">
              <p>
                Niektorí naši sprostredkovatelia a partneri sídlia mimo Európskeho hospodárskeho priestoru (EHP).
                Pre každý prenos je zabezpečená príslušná záruka v súlade s čl. 46 GDPR:
              </p>
              <div className="overflow-x-auto -mx-2">
                <table className="w-full text-sm border-collapse min-w-[480px]">
                  <thead>
                    <tr className="border-b border-brand-dark">
                      <th className="py-2 px-3 text-left text-[0.7rem] font-bold uppercase tracking-[0.12em] text-brand-dark">Poskytovateľ</th>
                      <th className="py-2 px-3 text-left text-[0.7rem] font-bold uppercase tracking-[0.12em] text-brand-dark">Krajina</th>
                      <th className="py-2 px-3 text-left text-[0.7rem] font-bold uppercase tracking-[0.12em] text-brand-dark">Záruka prenosu</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-line">
                    <tr>
                      <td className="py-3 px-3 font-semibold text-brand-dark align-top">Shopify Inc.</td>
                      <td className="py-3 px-3 align-top">Kanada / USA</td>
                      <td className="py-3 px-3 align-top">Rozhodnutie o primeranosti (Kanada); EU–US Data Privacy Framework (USA)</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 font-semibold text-brand-dark align-top">Vercel Inc.</td>
                      <td className="py-3 px-3 align-top">USA</td>
                      <td className="py-3 px-3 align-top">Štandardné zmluvné doložky (SCC)</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 font-semibold text-brand-dark align-top">Resend Inc.</td>
                      <td className="py-3 px-3 align-top">USA</td>
                      <td className="py-3 px-3 align-top">Štandardné zmluvné doložky (SCC)</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 font-semibold text-brand-dark align-top">Cloudflare, Inc.</td>
                      <td className="py-3 px-3 align-top">USA</td>
                      <td className="py-3 px-3 align-top">EU–US Data Privacy Framework + SCC</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 font-semibold text-brand-dark align-top">Google LLC</td>
                      <td className="py-3 px-3 align-top">USA</td>
                      <td className="py-3 px-3 align-top">EU–US Data Privacy Framework</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 font-semibold text-brand-dark align-top">Meta Platforms, Inc.</td>
                      <td className="py-3 px-3 align-top">USA</td>
                      <td className="py-3 px-3 align-top">EU–US Data Privacy Framework</td>
                    </tr>
                    <tr className="bg-brand-sand/70">
                      <td className="py-3 px-3 font-semibold text-brand-dark align-top">Supabase Inc.</td>
                      <td className="py-3 px-3 align-top">EÚ (Frankfurt)</td>
                      <td className="py-3 px-3 align-top font-medium text-brand-dark">Prenos mimo EHP sa nevykonáva</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-4 rounded-r-[3px] border-l-2 border-brand-dark bg-brand-sand p-4">
                <p className="text-sm">
                  Supabase (databáza dopytov a objednávok) je prevádzkovaná výhradne na serveroch v <strong>Nemecku (EÚ)</strong>, takže vaše dáta
                  z dopytov a objednávok zostávajú primárne v EHP.
                </p>
              </div>
          </LegalSection>

          {/* 8. Vaše práva */}
          <LegalSection id="prava" number="8" title="Vaše práva" subtitle="Práva dotknutej osoby podľa GDPR">
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { title: 'Právo na prístup (čl. 15)', desc: 'Máte právo vedieť, aké údaje o vás spracúvame, na aký účel a ako dlho' },
                  { title: 'Právo na opravu (čl. 16)', desc: 'Môžete požiadať o opravu nesprávnych alebo neúplných osobných údajov' },
                  { title: 'Právo na vymazanie (čl. 17)', desc: 'Za určitých podmienok môžete žiadať o výmaz svojich údajov (právo na zabudnutie)' },
                  { title: 'Právo na obmedzenie (čl. 18)', desc: 'Môžete žiadať o obmedzenie spracovania vašich údajov počas riešenia sporu' },
                  { title: 'Právo na prenosnosť (čl. 20)', desc: 'Môžete žiadať o prenos vašich údajov inému prevádzkovateľovi v štruktúrovanom formáte' },
                  { title: 'Právo namietať (čl. 21)', desc: 'Môžete namietať proti spracovaniu na základe oprávneného záujmu alebo na účely priameho marketingu' },
                  { title: 'Právo odvolať súhlas (čl. 7 ods. 3)', desc: 'Ak spracovanie prebieha na základe súhlasu, môžete ho kedykoľvek odvolať bez ujmy na zákonnosti spracovania pred odvolaním. Odber newslettera zrušíte kliknutím na odkaz v e-maile.' },
                ].map((item, index) => (
                  <div key={index} className={`${LEGAL_BOX} p-4`}>
                    <h4 className="mb-1 font-semibold text-brand-dark">{item.title}</h4>
                    <p className="text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-r-[3px] border-l-2 border-brand-dark bg-brand-sand p-4">
                <p className="text-sm">
                  <strong>Ako uplatniť svoje práva?</strong><br />
                  Napíšte nám na <a href="mailto:info@orostone.sk" className={LEGAL_LINK}>info@orostone.sk</a> alebo
                  zavolajte na <a href="tel:+421917588738" className={LEGAL_LINK}>+421 917 588 738</a>.
                  Na vašu žiadosť odpovieme do 30 dní (podľa čl. 12 ods. 3 GDPR).
                </p>
                <p className="text-sm mt-3">
                  <strong>Sťažnosť dozornému orgánu:</strong> Máte právo podať sťažnosť Úradu na ochranu osobných údajov SR:{' '}
                  Námestie 1. mája 18, 811 06 Bratislava,{' '}
                  <a href="https://dataprotection.gov.sk" target="_blank" rel="noopener noreferrer" className={LEGAL_LINK}>dataprotection.gov.sk</a>.
                </p>
              </div>
          </LegalSection>

          {/* 9. Cookies */}
          <LegalSection id="cookies" number="9" title="Cookies" subtitle="Používanie súborov cookies">
              <p>
                Naša webová stránka používa cookies na zabezpečenie základných funkcií
                a zlepšenie používateľského zážitku. Cookies rozdeľujeme do troch kategórií:
              </p>
              <div className="space-y-3">
                <div className={`${LEGAL_BOX} p-4`}>
                  <h4 className="mb-1 font-semibold text-brand-dark">Nevyhnutné cookies</h4>
                  <p className="text-sm">Technicky nutné pre fungovanie webu (napr. košík, súhlas s cookies). Aktívne vždy – nevyžadujú súhlas.</p>
                </div>
                <div className={`${LEGAL_BOX} p-4`}>
                  <h4 className="mb-1 font-semibold text-brand-dark">Analytické cookies</h4>
                  <p className="text-sm">Google Analytics 4 – meranie návštevnosti a správania na webe. Aktivujú sa iba po vašom súhlase.</p>
                </div>
                <div className={`${LEGAL_BOX} p-4`}>
                  <h4 className="mb-1 font-semibold text-brand-dark">Marketingové cookies</h4>
                  <p className="text-sm">Meta Pixel – remarketing a meranie konverzií. Aktivujú sa iba po vašom súhlase.</p>
                </div>
              </div>
              <Link
                to="/cookies"
                className={`inline-flex items-center gap-2 ${LEGAL_LINK}`}
              >
                <span>Zobraziť úplné zásady cookies</span>
                <span>→</span>
              </Link>
          </LegalSection>

          {/* 10. Kontakt */}
          <LegalSection id="kontakt" number="10" title="Kontakt" subtitle="V prípade otázok nás kontaktujte">
              <div className={`${LEGAL_BOX} p-6`}>
                <p className="font-medium text-brand-dark text-lg mb-4">Orostone s.r.o.</p>
                <div className="space-y-2">
                  <p>📍 Landererova 8, 811 09 Bratislava – mestská časť Staré Mesto</p>
                  <p>IČO: 55 254 772</p>
                  <p>DIČ: 2121930580</p>
                  <p>IČ DPH: SK2121930580</p>
                  <p className="text-sm text-brand-muted">Zapísaná v Obchodnom registri Mestského súdu Bratislava III, oddiel Sro, vložka 167404/B</p>
                  <p>📧 <a href="mailto:info@orostone.sk" className={LEGAL_LINK}>info@orostone.sk</a></p>
                  <p>📞 <a href="tel:+421917588738" className={LEGAL_LINK}>+421 917 588 738</a></p>
                </div>
              </div>
              <p className="mt-4 text-sm">
                Ak sa domnievate, že spracovanie vašich osobných údajov je v rozpore so zákonom,
                máte právo podať sťažnosť na <strong>Úrad na ochranu osobných údajov SR</strong>{' '}
                (Námestie 1. mája 18, 811 06 Bratislava,{' '}
                <a href="https://dataprotection.gov.sk" target="_blank" rel="noopener noreferrer" className={LEGAL_LINK}>dataprotection.gov.sk</a>).
              </p>
          </LegalSection>
        </div>

        {/* Footer Info */}
        <div className="mt-6 flex flex-col items-start justify-between gap-6 border-t border-brand-line pt-8 md:flex-row md:items-center">
          <div>
            <p className="text-sm text-brand-muted">Posledná aktualizácia</p>
            <p className="text-lg font-medium text-brand-dark">7.&nbsp;10.&nbsp;2026</p>
          </div>
          <ActionButton to="/kontakt" variant="outline" arrow>
            Kontaktujte nás
          </ActionButton>
        </div>
      </LegalLayout>
    </div>
  );
};
