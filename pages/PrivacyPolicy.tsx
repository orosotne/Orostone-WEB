import React from 'react';
import { m } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SEOHead } from '../components/UI/SEOHead';

export const PrivacyPolicy = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="pt-32 pb-24 min-h-dvh bg-[#F9F9F7]">
      <SEOHead
        title="Ochrana osobných údajov | OROSTONE"
        description="Zásady ochrany osobných údajov spoločnosti OROSTONE s.r.o. Spracúvanie údajov v súlade s GDPR — účely, právny základ a vaše práva."
        canonical="https://orostone.sk/ochrana-sukromia"
      />
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Header */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="font-sans text-brand-gold text-xs font-bold tracking-widest uppercase mb-4 block">
            GDPR • Ochrana údajov
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold text-brand-dark mb-6">
            Ochrana osobných údajov
          </h1>
          <p className="font-sans font-light text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Snažíme sa o to, aby ste sa pri nás cítili v bezpečí, preto sme prijali
            primerané technické a organizačné opatrenia
            na ochranu vašich osobných údajov.
          </p>
        </m.div>

        {/* Quick Navigation */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-orostone p-6 shadow-sm mb-12"
        >
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
            Rýchla navigácia
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
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
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-left text-sm text-gray-600 hover:text-brand-gold transition-colors py-2 px-3 rounded-orostone hover:bg-gray-50"
              >
                → {item.label}
              </button>
            ))}
          </div>
        </m.div>

        {/* Content */}
        <div className="space-y-12">
          {/* 1. Prevádzkovateľ */}
          <m.section
            id="prevadzkovatel"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-orostone p-8 shadow-sm scroll-mt-[72px] lg:scroll-mt-[128px]"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-brand-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-brand-gold font-semibold">1</span>
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-sans font-bold text-brand-dark mb-2">Prevádzkovateľ</h2>
                <p className="text-gray-500 text-base">Kto spracováva vaše údaje</p>
              </div>
            </div>
            <div className="pl-16 text-gray-600 leading-relaxed space-y-4">
              <p>
                Prevádzkovateľom osobných údajov podľa § 5 písm. o) zákona č. 18/2018 Z.z.
                o ochrane osobných údajov v znení neskorších predpisov (ďalej len „Zákon") je:
              </p>
              <div className="bg-gray-50 rounded-orostone p-6 font-medium">
                <p className="text-brand-dark text-lg mb-2">Orostone s.r.o.</p>
                <p>IČO: 55 254 772</p>
                <p>DIČ: 2121930580</p>
                <p>IČ DPH: SK2121930580</p>
                <p>Landererova 8, 811 09 Bratislava - mestská časť Staré Mesto</p>
                <p className="text-sm text-gray-500 mt-2">Zapísaná v Obchodnom registri Mestského súdu Bratislava III, oddiel Sro, vložka 167404/B</p>
                <p className="mt-4 text-brand-gold">info@orostone.sk</p>
              </div>
            </div>
          </m.section>

          {/* 2. Účel spracovania */}
          <m.section
            id="ucel"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-orostone p-8 shadow-sm scroll-mt-[72px] lg:scroll-mt-[128px]"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-brand-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-brand-gold font-semibold">2</span>
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-sans font-bold text-brand-dark mb-2">Účel spracovania osobných údajov</h2>
                <p className="text-gray-500 text-base">Prečo spracovávame vaše údaje</p>
              </div>
            </div>
            <div className="pl-16 text-gray-600 leading-relaxed">
              <p className="mb-4">Vaše osobné údaje spracovávame za týmito účelmi:</p>
              <div className="overflow-x-auto -mx-2">
                <table className="w-full text-sm border-collapse min-w-[500px]">
                  <thead>
                    <tr className="border-b-2 border-brand-gold/30">
                      <th className="text-left py-2 px-3 text-brand-dark font-bold text-xs uppercase tracking-wider">Účel</th>
                      <th className="text-left py-2 px-3 text-brand-dark font-bold text-xs uppercase tracking-wider">Opis</th>
                      <th className="text-left py-2 px-3 text-brand-dark font-bold text-xs uppercase tracking-wider">Právny základ (GDPR čl. 6)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="py-3 px-3 font-semibold text-brand-dark align-top">Vybavenie objednávky</td>
                      <td className="py-3 px-3 text-gray-600 align-top">Spracovanie a doručenie objednaného tovaru</td>
                      <td className="py-3 px-3 text-gray-600 align-top">čl. 6 ods. 1 písm. b) — plnenie zmluvy</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 font-semibold text-brand-dark align-top">Komunikácia</td>
                      <td className="py-3 px-3 text-gray-600 align-top">Informovanie o stave objednávky, odpovede na dopyty a cenovú ponuku</td>
                      <td className="py-3 px-3 text-gray-600 align-top">čl. 6 ods. 1 písm. b) — plnenie zmluvy / čl. 6 ods. 1 písm. f) — oprávnený záujem (vybavenie dopytu zákazníka a poskytnutie cenovej ponuky)</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 font-semibold text-brand-dark align-top">Zákonné povinnosti</td>
                      <td className="py-3 px-3 text-gray-600 align-top">Vedenie účtovníctva, plnenie daňových a archivačných povinností</td>
                      <td className="py-3 px-3 text-gray-600 align-top">čl. 6 ods. 1 písm. c) — zákonná povinnosť</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 font-semibold text-brand-dark align-top">Bezpečnosť</td>
                      <td className="py-3 px-3 text-gray-600 align-top">Ochrana formulárov pred automatizovanými útokmi (Cloudflare Turnstile)</td>
                      <td className="py-3 px-3 text-gray-600 align-top">čl. 6 ods. 1 písm. f) — oprávnený záujem (ochrana webovej stránky a formulárov pred zneužitím)</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 font-semibold text-brand-dark align-top">AI vizualizácia</td>
                      <td className="py-3 px-3 text-gray-600 align-top">
                        Spracovanie obrázkov cez AI vizualizér (len pri aktívnom spustení funkcie). Obrázok sa odosiela na servery Google (Gemini API) v USA na jednorazové spracovanie. Orostone obrázok neuchováva po skončení relácie.
                      </td>
                      <td className="py-3 px-3 text-gray-600 align-top">čl. 6 ods. 1 písm. a) — súhlas (aktívnym kliknutím na funkciu)</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 font-semibold text-brand-dark align-top">Marketing</td>
                      <td className="py-3 px-3 text-gray-600 align-top">Newsletter a remarketingové ponuky (len s výslovným súhlasom)</td>
                      <td className="py-3 px-3 text-gray-600 align-top">čl. 6 ods. 1 písm. a) — súhlas</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 font-semibold text-brand-dark align-top">Analytika</td>
                      <td className="py-3 px-3 text-gray-600 align-top">Meranie návštevnosti a správania na webe (Google Analytics 4) po udelení súhlasu</td>
                      <td className="py-3 px-3 text-gray-600 align-top">čl. 6 ods. 1 písm. a) — súhlas</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-400 mt-3">
                Automatizované rozhodovanie ani profilovanie v zmysle čl. 22 GDPR <strong>nevykonávame</strong>.
              </p>
            </div>
          </m.section>

          {/* 3. Dôsledky neposkytnutia údajov */}
          <m.section
            id="neposkytnutie"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-orostone p-8 shadow-sm scroll-mt-[72px] lg:scroll-mt-[128px]"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-brand-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-brand-gold font-semibold">3</span>
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-sans font-bold text-brand-dark mb-2">Dôsledky neposkytnutia osobných údajov</h2>
                <p className="text-gray-500 text-base">Čo sa stane, ak nám údaje neposkytnete (čl. 13 ods. 2 písm. e) GDPR)</p>
              </div>
            </div>
            <div className="pl-16 text-gray-600 leading-relaxed space-y-4">
              <div className="space-y-3">
                <div className="bg-gray-50 rounded-orostone p-4">
                  <h4 className="font-sans font-bold text-brand-dark mb-2">Objednávka a dopyt</h4>
                  <p className="text-sm">
                    Poskytnutie kontaktných a dodacích údajov je <strong>zmluvnou požiadavkou</strong> potrebnou na spracovanie objednávky a doručenie tovaru.
                    Bez ich poskytnutia nie je možné uzatvoriť kúpnu zmluvu ani objednávku vybaviť.
                  </p>
                </div>
                <div className="bg-gray-50 rounded-orostone p-4">
                  <h4 className="font-sans font-bold text-brand-dark mb-2">Newsletter</h4>
                  <p className="text-sm">
                    Prihlásenie na newsletter je <strong>dobrovoľné</strong>. Ak e-mailovú adresu neposkytne, odoberanie newsletteru nebude možné.
                    Súhlas možno kedykoľvek odvolať kliknutím na odkaz v e-maile.
                  </p>
                </div>
                <div className="bg-gray-50 rounded-orostone p-4">
                  <h4 className="font-sans font-bold text-brand-dark mb-2">AI vizualizér</h4>
                  <p className="text-sm">
                    Použitie AI vizualizéra je <strong>dobrovoľné</strong>. Ak obrázok nenahrá, funkcia nebude dostupná, ostatné časti webu nie sú dotknuté.
                  </p>
                </div>
                <div className="bg-gray-50 rounded-orostone p-4">
                  <h4 className="font-sans font-bold text-brand-dark mb-2">Analytické a marketingové cookies</h4>
                  <p className="text-sm">
                    Súhlas s analytickými a marketingovými cookies je <strong>dobrovoľný</strong>. Web funguje aj bez nich — len nevyhnutné cookies sú aktívne vždy.
                  </p>
                </div>
              </div>
            </div>
          </m.section>

          {/* 4. Tretie strany a sprostredkovatelia */}
          <m.section
            id="tretie-strany"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-orostone p-8 shadow-sm scroll-mt-[72px] lg:scroll-mt-[128px]"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-brand-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-brand-gold font-semibold">4</span>
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-sans font-bold text-brand-dark mb-2">Tretie strany a sprostredkovatelia</h2>
                <p className="text-gray-500 text-base">Komu môžeme vaše údaje poskytnúť</p>
              </div>
            </div>
            <div className="pl-16 text-gray-600 leading-relaxed space-y-6">

              {/* Sprostredkovatelia */}
              <div>
                <h3 className="font-sans font-bold text-brand-dark mb-3 text-base">
                  Sprostredkovatelia (čl. 28 GDPR)
                </h3>
                <p className="text-sm mb-3 text-gray-500">
                  Nasledujúce subjekty spracúvajú osobné údaje v mene Orostone na základe písomnej zmluvy o spracúvaní osobných údajov a výlučne podľa našich pokynov:
                </p>
                <div className="space-y-3">
                  {[
                    {
                      name: 'Shopify Inc.',
                      purpose: 'E-shop platforma, spracovanie objednávok a platieb pri nákupe cez e-shop',
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
                      purpose: 'Odosielanie transakčných emailov — potvrdenia dopytov, notifikácie o objednávke',
                      location: 'USA',
                      note: 'Emailová adresa príjemcu je zdieľaná iba za účelom doručenia správy.',
                    },
                    {
                      name: 'Vercel Inc.',
                      purpose: 'Hosting a doručovanie webovej stránky orostone.sk',
                      location: 'USA',
                      note: 'IP adresa a technické údaje návštevníka môžu byť dočasne spracované.',
                    },
                  ].map((item) => (
                    <div key={item.name} className="bg-gray-50 rounded-orostone p-4">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-1 mb-1">
                        <h4 className="font-sans font-bold text-brand-dark">{item.name}</h4>
                        <span className="text-xs text-gray-400 font-medium shrink-0">{item.location}</span>
                      </div>
                      <p className="text-sm mb-1">{item.purpose}</p>
                      <p className="text-xs text-gray-400 italic">{item.note}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Príjemcovia / samostatní prevádzkovatelia */}
              <div>
                <h3 className="font-sans font-bold text-brand-dark mb-3 text-base">
                  Príjemcovia / samostatní prevádzkovatelia
                </h3>
                <p className="text-sm mb-3 text-gray-500">
                  Nasledujúce subjekty môžu pri poskytovaní svojich služieb vystupovať ako samostatní prevádzkovatelia a spracúvať osobné údaje podľa vlastných zásad ochrany súkromia:
                </p>
                <div className="space-y-3">
                  {[
                    {
                      name: 'Cloudflare, Inc.',
                      purpose: 'Ochrana formulárov pred botmi a automatizovanými útokmi (Turnstile CAPTCHA)',
                      location: 'USA',
                      note: 'Spracúva technické signály zariadenia (IP adresu, fingerprint prehliadača). Cloudflare môže tieto údaje dočasne uchovávať na účely bezpečnostnej analýzy.',
                    },
                    {
                      name: 'Meta Platforms, Inc. (Facebook / Instagram)',
                      purpose: 'Remarketing a meranie konverzií cez Meta Pixel — zobrazovanie relevantných reklám',
                      location: 'USA',
                      note: 'Aktivuje sa iba po vašom súhlase s marketingovými cookies. Meta spracúva údaje podľa vlastných zásad súkromia.',
                    },
                    {
                      name: 'Google LLC',
                      purpose: 'Analytika návštevnosti (Google Analytics 4) a AI vizualizér (Google Gemini API)',
                      location: 'USA',
                      note: 'Google Analytics sa aktivuje iba po súhlase s analytickými cookies. Gemini API spracúva nahraný obrázok jednorazovo; Google môže spracúvať metadáta podľa svojich podmienok služby.',
                    },
                  ].map((item) => (
                    <div key={item.name} className="bg-gray-50 rounded-orostone p-4">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-1 mb-1">
                        <h4 className="font-sans font-bold text-brand-dark">{item.name}</h4>
                        <span className="text-xs text-gray-400 font-medium shrink-0">{item.location}</span>
                      </div>
                      <p className="text-sm mb-1">{item.purpose}</p>
                      <p className="text-xs text-gray-400 italic">{item.note}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </m.section>

          {/* 5. Rozsah údajov */}
          <m.section
            id="rozsah"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-orostone p-8 shadow-sm scroll-mt-[72px] lg:scroll-mt-[128px]"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-brand-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-brand-gold font-semibold">5</span>
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-sans font-bold text-brand-dark mb-2">Rozsah spracovaných údajov</h2>
                <p className="text-gray-500 text-base">Aké údaje zhromažďujeme</p>
              </div>
            </div>
            <div className="pl-16 text-gray-600 leading-relaxed">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-orostone p-4">
                  <h4 className="font-sans font-bold text-brand-dark mb-2">Identifikačné údaje</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Meno a priezvisko</li>
                    <li>• Fakturačná adresa</li>
                    <li>• Dodacia adresa</li>
                    <li>• IČO, DIČ (pri firmách)</li>
                  </ul>
                </div>
                <div className="bg-gray-50 rounded-orostone p-4">
                  <h4 className="font-sans font-bold text-brand-dark mb-2">Kontaktné údaje</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Telefónne číslo</li>
                    <li>• E-mailová adresa</li>
                  </ul>
                </div>
                <div className="bg-gray-50 rounded-orostone p-4">
                  <h4 className="font-sans font-bold text-brand-dark mb-2">Údaje o objednávke</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Objednaný tovar</li>
                    <li>• História objednávok</li>
                    <li>• Platobné údaje</li>
                  </ul>
                </div>
                <div className="bg-gray-50 rounded-orostone p-4">
                  <h4 className="font-sans font-bold text-brand-dark mb-2">Technické údaje</h4>
                  <ul className="text-sm space-y-1">
                    <li>• IP adresa</li>
                    <li>• Cookies (podľa súhlasu)</li>
                    <li>• Údaje o prehliadači</li>
                    <li>• Meta Pixel ID (len so súhlasom)</li>
                    <li>• Nahrané obrázky (AI vizualizér, len na vašu žiadosť, neuchováva sa)</li>
                  </ul>
                </div>
              </div>
            </div>
          </m.section>

          {/* 6. Doba uchovávania */}
          <m.section
            id="doba"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-orostone p-8 shadow-sm scroll-mt-[72px] lg:scroll-mt-[128px]"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-brand-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-brand-gold font-semibold">6</span>
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-sans font-bold text-brand-dark mb-2">Doba uchovávania údajov</h2>
                <p className="text-gray-500 text-base">Ako dlho vaše údaje uchovávame</p>
              </div>
            </div>
            <div className="pl-16 text-gray-600 leading-relaxed">
              <div className="space-y-3">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-orostone">
                  <span className="text-2xl font-light text-brand-gold min-w-[2.5rem] text-center">10</span>
                  <div>
                    <p className="font-sans font-bold text-brand-dark">rokov</p>
                    <p className="text-sm">Účtovné a daňové doklady (zákonná povinnosť)</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-orostone">
                  <span className="text-2xl font-light text-brand-gold min-w-[2.5rem] text-center">5</span>
                  <div>
                    <p className="font-sans font-bold text-brand-dark">rokov</p>
                    <p className="text-sm">Obchodná korešpondencia, cenové ponuky a kontaktné formuláre</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-orostone">
                  <span className="text-2xl font-light text-brand-gold min-w-[2.5rem] text-center">2</span>
                  <div>
                    <p className="font-sans font-bold text-brand-dark">roky</p>
                    <p className="text-sm">Záručná doba — údaje pre vybavenie reklamácií</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-orostone">
                  <span className="text-2xl font-light text-brand-gold min-w-[2.5rem] text-center">90</span>
                  <div>
                    <p className="font-sans font-bold text-brand-dark">dní</p>
                    <p className="text-sm">Bezpečnostné a technické logy (ochrana pred zneužitím)</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-orostone">
                  <span className="text-sm font-light text-brand-gold min-w-[2.5rem] text-center pt-1">∞ /</span>
                  <div>
                    <p className="font-sans font-bold text-brand-dark">Do odvolania súhlasu</p>
                    <p className="text-sm">Newsletter — e-mailová adresa sa uchováva do odvolania súhlasu. Po odvolaní súhlasu sú údaje vymazané do 30 dní.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-orostone">
                  <span className="text-sm font-light text-brand-gold min-w-[2.5rem] text-center pt-1">→</span>
                  <div>
                    <p className="font-sans font-bold text-brand-dark">Cookies</p>
                    <p className="text-sm">
                      Doba platnosti cookies sa líši podľa typu. Podrobnosti nájdete v{' '}
                      <Link to="/cookies" className="text-brand-gold hover:underline">zásadách cookies</Link>.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-orostone">
                  <span className="text-sm font-light text-brand-gold min-w-[2.5rem] text-center pt-1">0</span>
                  <div>
                    <p className="font-sans font-bold text-brand-dark">AI vizualizér</p>
                    <p className="text-sm">Nahrané obrázky sa po skončení relácie neuchovávajú. Spracovanie prebieha jednorazovo cez Google Gemini API.</p>
                  </div>
                </div>
              </div>
              <p className="text-sm italic mt-4">
                Po uplynutí príslušných lehôt sú údaje bezpečne vymazané.
              </p>
            </div>
          </m.section>

          {/* 7. Medzinárodný prenos údajov */}
          <m.section
            id="medzinarodny-prenos"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-orostone p-8 shadow-sm scroll-mt-[72px] lg:scroll-mt-[128px]"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-brand-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-brand-gold font-semibold">7</span>
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-sans font-bold text-brand-dark mb-2">Medzinárodný prenos údajov</h2>
                <p className="text-gray-500 text-base">Prenos údajov mimo Európskeho hospodárskeho priestoru</p>
              </div>
            </div>
            <div className="pl-16 text-gray-600 leading-relaxed space-y-4">
              <p>
                Niektorí naši sprostredkovatelia a partneri sídlia mimo Európskeho hospodárskeho priestoru (EHP).
                Pre každý prenos je zabezpečená príslušná záruka v súlade s čl. 46 GDPR:
              </p>
              <div className="overflow-x-auto -mx-2">
                <table className="w-full text-sm border-collapse min-w-[480px]">
                  <thead>
                    <tr className="border-b-2 border-brand-gold/30">
                      <th className="text-left py-2 px-3 text-brand-dark font-bold text-xs uppercase tracking-wider">Poskytovateľ</th>
                      <th className="text-left py-2 px-3 text-brand-dark font-bold text-xs uppercase tracking-wider">Krajina</th>
                      <th className="text-left py-2 px-3 text-brand-dark font-bold text-xs uppercase tracking-wider">Záruka prenosu</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="py-3 px-3 font-semibold text-brand-dark align-top">Shopify Inc.</td>
                      <td className="py-3 px-3 text-gray-600 align-top">Kanada / USA</td>
                      <td className="py-3 px-3 text-gray-600 align-top">Rozhodnutie o primeranosti (Kanada); EU–US Data Privacy Framework (USA)</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 font-semibold text-brand-dark align-top">Vercel Inc.</td>
                      <td className="py-3 px-3 text-gray-600 align-top">USA</td>
                      <td className="py-3 px-3 text-gray-600 align-top">Štandardné zmluvné doložky (SCC)</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 font-semibold text-brand-dark align-top">Resend Inc.</td>
                      <td className="py-3 px-3 text-gray-600 align-top">USA</td>
                      <td className="py-3 px-3 text-gray-600 align-top">Štandardné zmluvné doložky (SCC)</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 font-semibold text-brand-dark align-top">Cloudflare, Inc.</td>
                      <td className="py-3 px-3 text-gray-600 align-top">USA</td>
                      <td className="py-3 px-3 text-gray-600 align-top">EU–US Data Privacy Framework + SCC</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 font-semibold text-brand-dark align-top">Google LLC</td>
                      <td className="py-3 px-3 text-gray-600 align-top">USA</td>
                      <td className="py-3 px-3 text-gray-600 align-top">EU–US Data Privacy Framework</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 font-semibold text-brand-dark align-top">Meta Platforms, Inc.</td>
                      <td className="py-3 px-3 text-gray-600 align-top">USA</td>
                      <td className="py-3 px-3 text-gray-600 align-top">EU–US Data Privacy Framework</td>
                    </tr>
                    <tr className="bg-emerald-50">
                      <td className="py-3 px-3 font-semibold text-brand-dark align-top">Supabase Inc.</td>
                      <td className="py-3 px-3 text-gray-600 align-top">EÚ (Frankfurt)</td>
                      <td className="py-3 px-3 text-emerald-700 align-top font-medium">Prenos mimo EHP sa nevykonáva</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-4 p-4 bg-amber-50 border-l-4 border-brand-gold rounded-orostone">
                <p className="text-sm">
                  Supabase (databáza dopytov a objednávok) je prevádzkovaná výhradne na serveroch v <strong>Nemecku (EÚ)</strong>
                  — vaše dáta z dopytov a objednávok zostávajú primárne v EHP.
                </p>
              </div>
            </div>
          </m.section>

          {/* 8. Vaše práva */}
          <m.section
            id="prava"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-orostone p-8 shadow-sm scroll-mt-[72px] lg:scroll-mt-[128px]"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-brand-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-brand-gold font-semibold">8</span>
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-sans font-bold text-brand-dark mb-2">Vaše práva</h2>
                <p className="text-gray-500 text-base">Práva dotknutej osoby podľa GDPR</p>
              </div>
            </div>
            <div className="pl-16 text-gray-600 leading-relaxed">
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { title: 'Právo na prístup (čl. 15)', desc: 'Máte právo vedieť, aké údaje o vás spracovávame, na aký účel a ako dlho' },
                  { title: 'Právo na opravu (čl. 16)', desc: 'Môžete požiadať o opravu nesprávnych alebo neúplných osobných údajov' },
                  { title: 'Právo na vymazanie (čl. 17)', desc: 'Za určitých podmienok môžete žiadať o výmaz svojich údajov (právo byť zabudnutý)' },
                  { title: 'Právo na obmedzenie (čl. 18)', desc: 'Môžete žiadať o obmedzenie spracovania vašich údajov počas riešenia sporu' },
                  { title: 'Právo na prenosnosť (čl. 20)', desc: 'Môžete žiadať o prenos vašich údajov k inému prevádzkovateľovi v štruktúrovanom formáte' },
                  { title: 'Právo namietať (čl. 21)', desc: 'Môžete namietať voči spracovaniu na základe oprávneného záujmu alebo na účely priameho marketingu' },
                  { title: 'Právo odvolať súhlas (čl. 7 ods. 3)', desc: 'Ak spracovanie prebieha na základe súhlasu, môžete ho kedykoľvek odvolať bez ujmy na zákonnosti spracovania pred odvolaním. Newsletter odber zrušíte kliknutím na odkaz v e-maile.' },
                ].map((item, index) => (
                  <div key={index} className="bg-gray-50 rounded-orostone p-4">
                    <h4 className="font-sans font-bold text-brand-dark mb-1">{item.title}</h4>
                    <p className="text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-amber-50 border-l-4 border-brand-gold rounded-orostone">
                <p className="text-sm">
                  <strong>Ako uplatniť svoje práva?</strong><br />
                  Napíšte nám na <a href="mailto:info@orostone.sk" className="text-brand-gold hover:underline">info@orostone.sk</a> alebo
                  zavolajte na <a href="tel:+421917588738" className="text-brand-gold hover:underline">+421 917 588 738</a>.
                  Na vašu žiadosť odpovieme do 30 dní (podľa čl. 12 ods. 3 GDPR).
                </p>
                <p className="text-sm mt-3">
                  <strong>Sťažnosť dozornému orgánu:</strong> Máte právo podať sťažnosť Úradu na ochranu osobných údajov SR:{' '}
                  Námestie 1. mája 18, 811 06 Bratislava,{' '}
                  <a href="https://dataprotection.gov.sk" target="_blank" rel="noopener noreferrer" className="text-brand-gold hover:underline">dataprotection.gov.sk</a>.
                </p>
              </div>
            </div>
          </m.section>

          {/* 9. Cookies */}
          <m.section
            id="cookies"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-orostone p-8 shadow-sm scroll-mt-[72px] lg:scroll-mt-[128px]"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-brand-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-brand-gold font-semibold">9</span>
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-sans font-bold text-brand-dark mb-2">Cookies</h2>
                <p className="text-gray-500 text-base">Používanie súborov cookies</p>
              </div>
            </div>
            <div className="pl-16 text-gray-600 leading-relaxed space-y-4">
              <p>
                Naša webová stránka používa cookies na zabezpečenie základných funkcií
                a zlepšenie používateľského zážitku. Cookies rozdeľujeme do troch kategórií:
              </p>
              <div className="space-y-3">
                <div className="bg-gray-50 rounded-orostone p-4">
                  <h4 className="font-sans font-bold text-brand-dark mb-1">Nevyhnutné cookies</h4>
                  <p className="text-sm">Technicky nutné pre fungovanie webu (napr. košík, súhlas s cookies). Aktívne vždy — nevyžadujú súhlas.</p>
                </div>
                <div className="bg-gray-50 rounded-orostone p-4">
                  <h4 className="font-sans font-bold text-brand-dark mb-1">Analytické cookies</h4>
                  <p className="text-sm">Google Analytics 4 — meranie návštevnosti a správania na webe. Aktivujú sa iba po vašom súhlase.</p>
                </div>
                <div className="bg-gray-50 rounded-orostone p-4">
                  <h4 className="font-sans font-bold text-brand-dark mb-1">Marketingové cookies</h4>
                  <p className="text-sm">Meta Pixel — remarketing a meranie konverzií. Aktivujú sa iba po vašom súhlase.</p>
                </div>
              </div>
              <Link
                to="/cookies"
                className="inline-flex items-center gap-2 text-brand-gold hover:text-brand-dark transition-colors"
              >
                <span>Zobraziť úplné zásady cookies</span>
                <span>→</span>
              </Link>
            </div>
          </m.section>

          {/* 10. Kontakt */}
          <m.section
            id="kontakt"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-orostone p-8 shadow-sm scroll-mt-[72px] lg:scroll-mt-[128px]"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-brand-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-brand-gold font-semibold">10</span>
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-sans font-bold text-brand-dark mb-2">Kontakt</h2>
                <p className="text-gray-500 text-base">V prípade otázok nás kontaktujte</p>
              </div>
            </div>
            <div className="pl-16 text-gray-600 leading-relaxed">
              <div className="bg-gray-50 rounded-orostone p-6">
                <p className="font-medium text-brand-dark text-lg mb-4">Orostone s.r.o.</p>
                <div className="space-y-2">
                  <p>📍 Landererova 8, 811 09 Bratislava - mestská časť Staré Mesto</p>
                  <p>IČO: 55 254 772</p>
                  <p>DIČ: 2121930580</p>
                  <p>IČ DPH: SK2121930580</p>
                  <p className="text-sm text-gray-500">Zapísaná v Obchodnom registri Mestského súdu Bratislava III, oddiel Sro, vložka 167404/B</p>
                  <p>📧 <a href="mailto:info@orostone.sk" className="text-brand-gold hover:underline">info@orostone.sk</a></p>
                  <p>📞 <a href="tel:+421917588738" className="text-brand-gold hover:underline">+421 917 588 738</a></p>
                </div>
              </div>
              <p className="mt-4 text-sm">
                Ak sa domnievate, že spracovanie vašich osobných údajov je v rozpore so zákonom,
                máte právo podať sťažnosť na <strong>Úrad na ochranu osobných údajov SR</strong>{' '}
                (Námestie 1. mája 18, 811 06 Bratislava,{' '}
                <a href="https://dataprotection.gov.sk" target="_blank" rel="noopener noreferrer" className="text-brand-gold hover:underline">dataprotection.gov.sk</a>).
              </p>
            </div>
          </m.section>
        </div>

        {/* Footer Info */}
        <m.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-16 pt-8 border-t border-gray-200"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <p className="text-sm text-gray-500">Posledná aktualizácia</p>
              <p className="text-lg font-medium text-brand-dark">26.03.2026</p>
            </div>
            <Link
              to="/kontakt"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-gold text-white rounded-full hover:bg-brand-dark transition-colors"
            >
              <span>Kontaktujte nás</span>
              <span>→</span>
            </Link>
          </div>
        </m.div>
      </div>
    </div>
  );
};
