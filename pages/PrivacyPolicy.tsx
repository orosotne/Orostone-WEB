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
                      <td className="py-3 px-3 align-top">Newsletter, automatické e-maily, remarketingové ponuky a meranie účinnosti reklám v Google Ads a na Facebooku či Instagrame, všetko len s vaším výslovným súhlasom. Automatické e-maily vám môžeme poslať napríklad po prihlásení na newsletter, keď si objednáte vzorku alebo keď ako odberateľ newslettera 90&nbsp;dní neotvoríte žiadny z našich e-mailov ani v nich na nič nekliknete. Výnimkou je pripomenutie nedokončeného nákupu, ktoré posielame aj bez súhlasu (pozri nasledujúci riadok).</td>
                      <td className="py-3 px-3 align-top">čl. 6 ods. 1 písm. a) – súhlas</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 font-semibold text-brand-dark align-top">Pripomenutie nedokončeného nákupu</td>
                      <td className="py-3 px-3 align-top">Ak v pokladni e-shopu zadáte e-mailovú adresu a nákup nedokončíte, platforma Shopify vám v našom mene pošle k tomuto nákupu jeden e-mail s prehľadom tovaru, ktorý ste v pokladni nechali, a s odkazom na dokončenie nákupu. E-mail môže obsahovať aj zľavový kód na dokončenie tohto nákupu. Pripomenutie vám pošleme aj vtedy, ak ste súhlas s e-mailovým marketingom nedali. Odmietnuť pripomenutie môžete kedykoľvek, bezplatne a bez udania dôvodu odkazom na odhlásenie v e-maile alebo správou na info@orostone.sk. Ide o námietku proti priamemu marketingu (viac v časti Vaše práva).</td>
                      <td className="py-3 px-3 align-top">čl. 6 ods. 1 písm. f) – oprávnený záujem (pripomenutie nákupu, ktorý ste v našom e-shope začali) v spojení s §&nbsp;116 ods.&nbsp;15 zákona č.&nbsp;452/2021 Z.&nbsp;z. o elektronických komunikáciách v znení neskorších predpisov</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 font-semibold text-brand-dark align-top">Prehľad objednávok a meranie e-mailov</td>
                      <td className="py-3 px-3 align-top">Meno, kontaktné a dodacie údaje, ako aj údaje o objednávkach a o nákupoch nedokončených v pokladni prenášame z e-shopu do služby Klaviyo pri všetkých zákazníkoch, aj pri tých, ktorí súhlas s e-mailovým marketingom nedali. Slúžia na prehľad objednávok a na meranie, ako naše e-maily prispievajú k objednávkam. Prenášame aj stav súhlasu s e-mailovým marketingom, aby sme zákazníkom bez súhlasu neposielali newsletter ani automatické e-maily cez službu Klaviyo. Proti tomuto spracovaniu môžete kedykoľvek namietať (viac v časti Vaše práva).</td>
                      <td className="py-3 px-3 align-top">čl. 6 ods. 1 písm. f) – oprávnený záujem (prehľad objednávok a meranie výsledkov e-mailov)</td>
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
                Automatizované rozhodovanie, ktoré by malo pre vás právne alebo podobne významné účinky (čl. 22 GDPR), <strong>nevykonávame</strong>.
                Ktoré marketingové e-maily vám pošleme, určujeme podľa jednoduchých pravidiel, napríklad podľa toho, či ste nedokončili nákup v pokladni,
                akú odpoveď ste v e-maile zvolili alebo či ste 90&nbsp;dní neotvorili žiadny z našich e-mailov ani v nich na nič neklikli. Ak v e-maile
                zvolíte, že kuchyňu riešite do 3&nbsp;mesiacov, dostane o tom upozornenie náš obchodník, aby vám mohol osobne napísať. Proti takémuto spracovaniu môžete kedykoľvek
                namietať alebo sa z e-mailov odhlásiť.
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
                    Súhlas s e-mailovým marketingom môžete dať aj v pokladni e-shopu zaškrtnutím políčka „Chcem dostávať novinky a ponuky e-mailom“. Políčko nie je vopred zaškrtnuté a nakúpiť môžete aj bez súhlasu.
                    Súhlas možno kedykoľvek odvolať kliknutím na odkaz v e-maile. Bez ohľadu na súhlas vám ku každému nákupu, ktorý v pokladni nedokončíte, môže prísť jedno pripomenutie (pozri časť Účel spracovania). Pripomenutie môžete kedykoľvek odmietnuť a na vaše nákupy to nemá vplyv.
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
                      purpose: 'E-shopová platforma, spracovanie objednávok a platieb pri nákupe cez e-shop, odoslanie pripomenutia nedokončeného nákupu, záznam súhlasu s e-mailovým marketingom, ak ho dáte v pokladni',
                      location: 'Kanada / USA',
                      note: 'Shopify je certifikovaný PCI DSS spracovateľ platieb. Službe Klaviyo automaticky odovzdáva údaje o zákazníkoch a objednávkach (aj o nákupoch nedokončených v pokladni) a stav súhlasu s e-mailovým marketingom. Vlastné zásady: privacy.shopify.com',
                    },
                    {
                      name: 'Supabase Inc.',
                      purpose: 'Databáza zákazníkov, ukladanie dopytov a cenových ponúk, autentifikácia',
                      location: 'EÚ (Frankfurt, Nemecko)',
                      note: 'Dáta sú uložené na serveroch v EÚ. Prenos mimo EHP sa nevykonáva.',
                    },
                    {
                      name: 'Resend Inc.',
                      purpose: 'Odosielanie e-mailov – potvrdenia dopytov, notifikácie o objednávke a uvítací e-mail newslettera, ak ho nemôže poslať Klaviyo',
                      location: 'USA',
                      note: 'E-mailová adresa príjemcu sa zdieľa iba na doručenie správy.',
                    },
                    {
                      name: 'Klaviyo, Inc.',
                      purpose: 'Odosielanie newslettera a automatických e-mailov, správa odberu a odhlásení, meranie otvorení a kliknutí v e-mailoch, prehľad objednávok z e-shopu',
                      location: 'USA',
                      note: 'Spracúva e-mailovú adresu, meno (ak ho uvediete), odkiaľ ste sa prihlásili a odpovede, ktoré v e-mailoch zvolíte. Z e-shopu na platforme Shopify dostáva o všetkých zákazníkoch, aj o tých, ktorí súhlas s e-mailovým marketingom nedali, tieto údaje: meno, kontaktné a dodacie údaje, objednávky, nákupy nedokončené v pokladni a stav súhlasu s e-mailovým marketingom. Marketingové e-maily cez Klaviyo posielame len tým, ktorí s nimi súhlasili. Pripomenutie nedokončeného nákupu neposiela Klaviyo, ale Shopify. Vlastné zásady: klaviyo.com/legal/privacy',
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
                      purpose: 'Remarketing a meranie konverzií cez Meta Pixel – zobrazovanie relevantných reklám',
                      location: 'USA',
                      note: 'Meta Pixel sa aktivuje iba po vašom súhlase s marketingovými cookies. Meta spracúva údaje podľa vlastných zásad súkromia.',
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
                    <li>• Nákupy nedokončené v pokladni</li>
                    <li>• Platobné údaje</li>
                  </ul>
                </div>
                <div className={`${LEGAL_BOX} p-4`}>
                  <h4 className="mb-2 font-semibold text-brand-dark">E-mailová komunikácia</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Súhlas s e-mailovým marketingom a odhlásenie</li>
                    <li>• Odoslanie pripomenutí nedokončeného nákupu a ich odmietnutie</li>
                    <li>• Otvorenia e-mailov a kliknutia v nich</li>
                    <li>• Odpovede, ktoré v e-mailoch zvolíte</li>
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
                <div className={`${LEGAL_BOX} flex items-start gap-4 p-4`}>
                  <span className="min-w-[2.5rem] text-center text-2xl font-light tabular-nums text-brand-dark">3</span>
                  <div>
                    <p className="font-semibold text-brand-dark">roky</p>
                    <p className="text-sm">Údaje z e-shopu v službe Klaviyo – profil zákazníka s údajmi o objednávkach a nákupoch nedokončených v pokladni uchovávame 3&nbsp;roky od poslednej objednávky (ak ste u nás ešte nič neobjednali, od posledného nákupu nedokončeného v pokladni). Potom profil najneskôr do 3&nbsp;mesiacov vymažeme. Kým však odoberáte newsletter alebo platí váš súhlas s e-mailovým marketingom, profil aj s údajmi o objednávkach ostáva; ak lehota medzitým uplynula, vymažeme ho najneskôr do 3&nbsp;mesiacov po odvolaní súhlasu. Ak ste sa z e-mailov odhlásili, po vymazaní profilu ponecháme v službe Klaviyo len vašu e-mailovú adresu s označením, že ste sa odhlásili, aby vám marketingové e-maily už neprišli (oprávnený záujem). Tento záznam uchovávame, kým marketingové e-maily posielame, a na požiadanie ho vymažeme.</p>
                  </div>
                </div>
                <div className={`${LEGAL_BOX} flex items-center gap-4 p-4`}>
                  <span className="min-w-[2.5rem] text-center text-2xl font-light tabular-nums text-brand-dark">2</span>
                  <div>
                    <p className="font-semibold text-brand-dark">roky</p>
                    <p className="text-sm">Zodpovednosť za vady – údaje na vybavenie reklamácií</p>
                  </div>
                </div>
                <div className={`${LEGAL_BOX} flex items-start gap-4 p-4`}>
                  <span className="min-w-[2.5rem] text-center text-2xl font-light tabular-nums text-brand-dark">3</span>
                  <div>
                    <p className="font-semibold text-brand-dark">mesiace</p>
                    <p className="text-sm">Nákupy nedokončené v pokladni – platforma Shopify ich spravidla po 3&nbsp;mesiacoch automaticky vymaže. Záznam o tom, že ste pripomenutia odmietli, uchovávame, kým ich posielame, aby vám ďalšie už neprišli.</p>
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
                    <p className="text-sm">Newsletter – e-mailová adresa sa uchováva do odvolania súhlasu. Po odvolaní súhlasu ju spolu s ďalšími údajmi o odbere do 30&nbsp;dní vymažeme z databázy webu. V službe Klaviyo, cez ktorú newsletter posielame, ostane váš profil s označením, že ste sa odhlásili, aby vám newsletter už neprišiel (oprávnený záujem). Uchovávame ho, kým newsletter posielame, a na požiadanie ho vymažeme. Ak sú vo vašom profile aj údaje z e-shopu (objednávky alebo nákupy nedokončené v pokladni), po uplynutí lehoty 3&nbsp;roky uvedenej vyššie profil vymažeme a ponecháme len vašu e-mailovú adresu s označením, že ste sa odhlásili.</p>
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
                Každý prenos sa opiera o rozhodnutie Európskej komisie o primeranosti (čl. 45 GDPR) alebo o primerané záruky (čl. 46 GDPR):
              </p>
              <div className="overflow-x-auto -mx-2">
                <table className="w-full text-sm border-collapse min-w-[480px]">
                  <thead>
                    <tr className="border-b border-brand-dark">
                      <th className="py-2 px-3 text-left text-[0.7rem] font-bold uppercase tracking-[0.12em] text-brand-dark">Poskytovateľ</th>
                      <th className="py-2 px-3 text-left text-[0.7rem] font-bold uppercase tracking-[0.12em] text-brand-dark">Krajina</th>
                      <th className="py-2 px-3 text-left text-[0.7rem] font-bold uppercase tracking-[0.12em] text-brand-dark">Základ prenosu</th>
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
                      <td className="py-3 px-3 font-semibold text-brand-dark align-top">Klaviyo, Inc.</td>
                      <td className="py-3 px-3 align-top">USA</td>
                      <td className="py-3 px-3 align-top">EU–US Data Privacy Framework + SCC</td>
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
                  Supabase (databáza dopytov a cenových ponúk) beží výhradne na serveroch v <strong>Nemecku (EÚ)</strong>, takže údaje
                  uložené v tejto databáze zostávajú v EHP. Ostatní poskytovatelia v tabuľke spracúvajú údaje aj mimo EHP, napríklad Shopify spracúva
                  objednávky z e-shopu a nákupy nedokončené v pokladni (Kanada / USA) a Klaviyo profily zákazníkov a odberateľov (USA). Prenos údajov týmto poskytovateľom sa opiera
                  o rozhodnutie o primeranosti alebo o záruky uvedené v tabuľke vyššie.
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
                  { title: 'Právo namietať (čl. 21)', desc: 'Môžete namietať proti spracovaniu na základe oprávneného záujmu a proti spracovaniu na účely priameho marketingu vrátane súvisiaceho profilovania. Námietkou odmietnete aj pripomenutie nedokončeného nákupu. Podrobnosti sú v rámčeku nižšie.' },
                  { title: 'Právo odvolať súhlas (čl. 7 ods. 3)', desc: 'Ak spracovanie prebieha na základe súhlasu, môžete ho kedykoľvek odvolať bez ujmy na zákonnosti spracovania pred odvolaním. Odber newslettera aj ďalších marketingových e-mailov, na ktoré ste dali súhlas, zrušíte kliknutím na odkaz v e-maile.' },
                ].map((item, index) => (
                  <div key={index} className={`${LEGAL_BOX} p-4`}>
                    <h4 className="mb-1 font-semibold text-brand-dark">{item.title}</h4>
                    <p className="text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-r-[3px] border-l-2 border-brand-dark bg-brand-sand p-4">
                <p className="text-sm">
                  <strong>Právo namietať (čl. 21 GDPR)</strong><br />
                  Z dôvodov týkajúcich sa vašej konkrétnej situácie môžete kedykoľvek namietať proti spracovaniu na základe oprávneného záujmu,
                  napríklad proti prenosu vašich údajov z e-shopu (meno, kontaktné a dodacie údaje, objednávky a nákupy nedokončené v pokladni)
                  do služby Klaviyo na prehľad objednávok a meranie e-mailov. Spracovanie, proti ktorému ste namietali, potom ukončíme, ibaže preukážeme nevyhnutné oprávnené dôvody, ktoré
                  prevažujú nad vašimi záujmami, právami a slobodami, alebo dôvody na preukazovanie, uplatňovanie či obhajovanie právnych nárokov.
                  Proti spracovaniu na účely priameho marketingu vrátane súvisiaceho profilovania môžete namietať kedykoľvek a bez udania dôvodu;
                  vaše údaje potom na tieto účely ďalej nespracúvame. Pripomenutie nedokončeného nákupu je priamy marketing, ktorý posielame na základe
                  oprávneného záujmu. Pripomenutie môžete kedykoľvek, bezplatne a bez udania dôvodu odmietnuť kliknutím na odkaz na odhlásenie v samotnom
                  pripomenutí; ďalšie pripomenutia vám potom neposielame. Každú námietku môžete poslať na{' '}
                  <a href="mailto:info@orostone.sk" className={LEGAL_LINK}>info@orostone.sk</a>. Odhlásenie z newslettera zastaví len e-maily zo služby
                  Klaviyo, nie pripomenutie nedokončeného nákupu. Ani jeden z týchto krokov nezastaví prenos údajov z e-shopu do služby Klaviyo.
                </p>
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
            <p className="text-lg font-medium text-brand-dark">14.&nbsp;10.&nbsp;2026</p>
          </div>
          <ActionButton to="/kontakt" variant="outline" arrow>
            Kontaktujte nás
          </ActionButton>
        </div>
      </LegalLayout>
    </div>
  );
};
