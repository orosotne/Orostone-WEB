import React from 'react';
import { motion } from 'framer-motion';
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
    <div className="pt-32 pb-24 min-h-screen bg-[#F9F9F7]">
      <SEOHead
        title="Ochrana osobných údajov | OROSTONE"
        description="Zásady ochrany osobných údajov spoločnosti OROSTONE s.r.o. Spracúvanie údajov v súlade s GDPR — účely, právny základ a vaše práva."
        canonical="https://orostone.sk/ochrana-sukromia"
      />
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Header */}
        <motion.div
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
            Snažíme sa o to, aby ste sa pri nás cítili v bezpečí, preto potvrdzujeme,
            že sme implementovali všetky potrebné technické a organizačné opatrenia
            na ochranu vašich osobných údajov.
          </p>
        </motion.div>

        {/* Quick Navigation */}
        <motion.div
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
        </motion.div>

        {/* Content */}
        <div className="space-y-12">
          {/* 1. Prevádzkovateľ */}
          <motion.section
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
          </motion.section>

          {/* 2. Účel spracovania */}
          <motion.section
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
                      <td className="py-3 px-3 text-gray-600 align-top">čl. 6 ods. 1 písm. b) — plnenie zmluvy / čl. 6 ods. 1 písm. f) — oprávnený záujem</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 font-semibold text-brand-dark align-top">Zákonné povinnosti</td>
                      <td className="py-3 px-3 text-gray-600 align-top">Vedenie účtovníctva, plnenie daňových a archivačných povinností</td>
                      <td className="py-3 px-3 text-gray-600 align-top">čl. 6 ods. 1 písm. c) — zákonná povinnosť</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 font-semibold text-brand-dark align-top">Bezpečnosť</td>
                      <td className="py-3 px-3 text-gray-600 align-top">Ochrana formulárov pred automatizovanými útokmi (Cloudflare Turnstile)</td>
                      <td className="py-3 px-3 text-gray-600 align-top">čl. 6 ods. 1 písm. f) — oprávnený záujem (bezpečnosť systémov)</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 font-semibold text-brand-dark align-top">AI vizualizácia</td>
                      <td className="py-3 px-3 text-gray-600 align-top">Spracovanie obrázkov cez AI vizualizér (len pri spustení funkcie)</td>
                      <td className="py-3 px-3 text-gray-600 align-top">čl. 6 ods. 1 písm. a) — súhlas</td>
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
          </motion.section>

          {/* 3. Tretie strany a sprostredkovatelia */}
          <motion.section
            id="tretie-strany"
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
                <h2 className="text-xl md:text-2xl font-sans font-bold text-brand-dark mb-2">Tretie strany a sprostredkovatelia</h2>
                <p className="text-gray-500 text-base">Komu môžeme vaše údaje poskytnúť</p>
              </div>
            </div>
            <div className="pl-16 text-gray-600 leading-relaxed space-y-4">
              <p>
                Na prevádzku našich služieb využívame nasledujúcich sprostredkovateľov a partnerov,
                ktorým môžu byť vaše osobné údaje sprístupnené v rozsahu nevyhnutnom na poskytnutie danej služby:
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
                    note: 'Dáta sú uložené na serveroch v EÚ.',
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
                  {
                    name: 'Cloudflare, Inc.',
                    purpose: 'Ochrana formulárov pred botmi a automatizovanými útokmi (Turnstile CAPTCHA)',
                    location: 'USA',
                    note: 'Zbierajú technické signály zariadenia bez uloženia osobne identifikovateľných údajov.',
                  },
                  {
                    name: 'Meta Platforms, Inc. (Facebook / Instagram)',
                    purpose: 'Remarketing a meranie konverzií cez Meta Pixel — zobrazovanie relevantných reklám',
                    location: 'USA',
                    note: 'Aktivuje sa iba po vašom súhlase s marketingovými cookies.',
                  },
                  {
                    name: 'Google LLC',
                    purpose: 'Analytika návštevnosti (Google Analytics) a AI vizualizér (Google Gemini API)',
                    location: 'USA',
                    note: 'Analytics sa aktivuje iba po súhlase s analytickými cookies. Gemini API spracuje obrázok, ktorý nahráte v AI vizualizéri.',
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
          </motion.section>

          {/* 4. Rozsah údajov */}
          <motion.section
            id="rozsah"
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
                    <li>• Nahrané obrázky (AI vizualizér, len na vašu žiadosť)</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.section>

          {/* 5. Doba uchovávania */}
          <motion.section
            id="doba"
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
                <h2 className="text-xl md:text-2xl font-sans font-bold text-brand-dark mb-2">Doba uchovávania údajov</h2>
                <p className="text-gray-500 text-base">Ako dlho vaše údaje uchovávame</p>
              </div>
            </div>
            <div className="pl-16 text-gray-600 leading-relaxed">
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-orostone">
                  <span className="text-2xl font-light text-brand-gold">10</span>
                  <div>
                    <p className="font-sans font-bold text-brand-dark">rokov</p>
                    <p className="text-sm">Účtovné a daňové doklady (zákonná povinnosť)</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-orostone">
                  <span className="text-2xl font-light text-brand-gold">5</span>
                  <div>
                    <p className="font-sans font-bold text-brand-dark">rokov</p>
                    <p className="text-sm">Obchodná korešpondencia a cenové ponuky</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-orostone">
                  <span className="text-2xl font-light text-brand-gold">2</span>
                  <div>
                    <p className="font-medium text-brand-dark">roky</p>
                    <p className="text-sm">Záručná doba - údaje pre reklamácie</p>
                  </div>
                </div>
                <p className="text-sm italic">
                  Po uplynutí týchto lehôt sú údaje bezpečne vymazané alebo anonymizované.
                </p>
              </div>
            </div>
          </motion.section>

          {/* 6. Medzinárodný prenos údajov */}
          <motion.section
            id="medzinarodny-prenos"
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
                <h2 className="text-xl md:text-2xl font-sans font-bold text-brand-dark mb-2">Medzinárodný prenos údajov</h2>
                <p className="text-gray-500 text-base">Prenos údajov mimo Európskeho hospodárskeho priestoru</p>
              </div>
            </div>
            <div className="pl-16 text-gray-600 leading-relaxed space-y-4">
              <p>
                Niektorí naši sprostredkovatelia (Shopify, Resend, Vercel, Cloudflare, Meta, Google)
                sídlia v USA alebo Kanade, teda mimo Európskeho hospodárskeho priestoru (EHP).
                Prenos vašich osobných údajov do týchto krajín je zabezpečený jedným z nasledujúcich mechanizmov:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-brand-gold mt-1">•</span>
                  <span><strong>Štandardné zmluvné doložky (SCC)</strong> – schválené Európskou komisiou, zaväzujú príjemcu dodržiavať úroveň ochrany porovnateľnú s EÚ</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-brand-gold mt-1">•</span>
                  <span><strong>Rozhodnutie o primeranosti</strong> – Kanada je krajina uznaná Európskou komisiou za poskytujúcu primeranú ochranu údajov</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-brand-gold mt-1">•</span>
                  <span><strong>EU–US Data Privacy Framework</strong> – certifikácia platná pre niektorých amerických poskytovateľov (Google, Meta)</span>
                </li>
              </ul>
              <div className="mt-4 p-4 bg-amber-50 border-l-4 border-brand-gold rounded-orostone">
                <p className="text-sm">
                  Supabase (databáza) je prevádzkovaná na serveroch v <strong>Nemecku (EÚ)</strong>
                  — vaše dáta z dopytov a objednávok zostávajú primárne v EHP.
                </p>
              </div>
            </div>
          </motion.section>

          {/* 7. Vaše práva */}
          <motion.section
            id="prava"
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
                  Hraničná 12, 820 07 Bratislava 27,{' '}
                  <a href="https://dataprotection.gov.sk" target="_blank" rel="noopener noreferrer" className="text-brand-gold hover:underline">dataprotection.gov.sk</a>.
                </p>
              </div>
            </div>
          </motion.section>

          {/* 8. Cookies */}
          <motion.section
            id="cookies"
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
                <h2 className="text-xl md:text-2xl font-sans font-bold text-brand-dark mb-2">Cookies</h2>
                <p className="text-gray-500 text-base">Používanie súborov cookies</p>
              </div>
            </div>
            <div className="pl-16 text-gray-600 leading-relaxed">
              <p className="mb-4">
                Naša webová stránka používa cookies na zabezpečenie základných funkcií
                a zlepšenie používateľského zážitku. Analytické a marketingové cookies
                (Google Analytics, Meta Pixel) aktivujeme iba po vašom súhlase.
                Podrobné informácie nájdete v našich zásadách používania cookies.
              </p>
              <Link
                to="/cookies"
                className="inline-flex items-center gap-2 text-brand-gold hover:text-brand-dark transition-colors"
              >
                <span>Zobraziť zásady cookies</span>
                <span>→</span>
              </Link>
            </div>
          </motion.section>

          {/* 9. Kontakt */}
          <motion.section
            id="kontakt"
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
                máte právo podať sťažnosť na <strong>Úrad na ochranu osobných údajov SR</strong>.
              </p>
            </div>
          </motion.section>
        </div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-16 pt-8 border-t border-gray-200"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <p className="text-sm text-gray-500">Posledná aktualizácia</p>
              <p className="text-lg font-medium text-brand-dark">24.03.2026</p>
            </div>
            <Link
              to="/kontakt"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-gold text-white rounded-full hover:bg-brand-dark transition-colors"
            >
              <span>Kontaktujte nás</span>
              <span>→</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
