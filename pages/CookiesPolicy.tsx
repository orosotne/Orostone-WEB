import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCookies } from '../context/CookieContext';
import { SEOHead } from '../components/UI/SEOHead';

export const CookiesPolicy = () => {
  const { preferences, openSettings } = useCookies();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#F9F9F7]">
      <SEOHead
        title="Zásady používania cookies a podobných technológií | OROSTONE"
        description="Informácie o cookies a podobných technológiách na webe OROSTONE. Typy technológií, účely spracovania a nastavenie vlastných preferencií."
        canonical="https://orostone.sk/cookies"
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
            Zásady • Transparentnosť
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold text-brand-dark mb-6">
            Zásady používania cookies a&nbsp;podobných technológií
          </h1>
          <p className="font-sans font-light text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Táto stránka vysvetľuje, ako používame cookies a podobné technológie na našom webe,
            na aké účely ich používame a ako môžete svoje nastavenia kedykoľvek zmeniť.
            Nevyhnutné technológie používame na zabezpečenie základného fungovania webu;
            analytické a marketingové technológie aktivujeme až po vašom predchádzajúcom súhlase.
          </p>
        </motion.div>

        {/* Prevádzkovateľ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="bg-white rounded-orostone p-6 shadow-sm mb-12"
        >
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
            Prevádzkovateľ webu
          </h2>
          <div className="space-y-1 text-sm text-gray-600 leading-relaxed">
            <p className="font-medium text-brand-dark">Orostone s.r.o.</p>
            <p>Landererova 8, 811 09 Bratislava - mestská časť Staré Mesto</p>
            <p>IČO: 55 254 772 • DIČ: 2121930580 • IČ DPH: SK2121930580</p>
            <p>Zapísaná v Obchodnom registri Mestského súdu Bratislava III, oddiel Sro, vložka 167404/B</p>
            <p className="text-brand-gold">info@orostone.sk</p>
          </div>
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { id: 'co-su-cookies', label: 'Čo sú cookies?' },
              { id: 'typy-technologii', label: 'Typy technológií' },
              { id: 'prehlad-cookies', label: 'Prehľad cookies' },
              { id: 'pravny-zaklad', label: 'Právny základ' },
              { id: 'sprava-cookies', label: 'Správa nastavení' },
              { id: 'tretie-strany', label: 'Tretie strany' },
              { id: 'upozornenie', label: 'Upozornenie' },
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

        {/* Current Status Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="bg-gradient-to-r from-brand-gold/10 to-brand-gold/5 rounded-orostone p-6 mb-12"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="font-sans font-bold text-brand-dark mb-2">Vaše aktuálne nastavenia</h3>
              <div className="flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Nevyhnutné: Vždy aktívne
                </span>
                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                  preferences.analytics
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${preferences.analytics ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                  Analytické: {preferences.analytics ? 'Povolené' : 'Podľa vášho súhlasu'}
                </span>
                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                  preferences.marketing
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${preferences.marketing ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                  Marketingové: {preferences.marketing ? 'Povolené' : 'Podľa vášho súhlasu'}
                </span>
              </div>
            </div>
            <button
              onClick={openSettings}
              className="px-5 py-2.5 bg-brand-gold text-white rounded-full hover:bg-brand-dark transition-colors text-sm font-medium"
            >
              Zmeniť nastavenia
            </button>
          </div>
        </motion.div>

        {/* Content */}
        <div className="space-y-12">
          {/* 1. Čo sú cookies */}
          <motion.section
            id="co-su-cookies"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-orostone p-8 shadow-sm"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-brand-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-brand-gold font-semibold">1</span>
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-sans font-bold text-brand-dark mb-2">Čo sú cookies a podobné technológie?</h2>
                <p className="text-gray-500 text-base">Základné informácie</p>
              </div>
            </div>
            <div className="pl-16 text-gray-600 leading-relaxed space-y-4">
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
              <div className="bg-gray-50 rounded-orostone p-4">
                <p className="text-sm">
                  Niektoré z týchto technológií môžu obsahovať alebo vytvárať identifikátory,
                  ktoré sa môžu považovať za osobné údaje.
                </p>
              </div>
            </div>
          </motion.section>

          {/* 2. Typy technológií */}
          <motion.section
            id="typy-technologii"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-orostone p-8 shadow-sm"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-brand-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-brand-gold font-semibold">2</span>
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-sans font-bold text-brand-dark mb-2">Aké typy technológií používame</h2>
                <p className="text-gray-500 text-base">Rozdelenie podľa účelu</p>
              </div>
            </div>
            <div className="pl-16 space-y-6">
              {/* Nevyhnutné */}
              <div className="border-l-4 border-green-500 pl-4">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-sans font-bold text-brand-dark">Nevyhnutné</h3>
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                    Vždy aktívne
                  </span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Tieto technológie sú potrebné na základné fungovanie webu, bezpečnosť,
                  správne zobrazenie stránky a uloženie vašich nastavení súhlasu.
                  Bez nich by web nefungoval správne.
                </p>
              </div>

              {/* Funkčné */}
              <div className="border-l-4 border-blue-400 pl-4">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-sans font-bold text-brand-dark">Funkčné</h3>
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-full">
                    Podľa použitia funkcie
                  </span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Tieto technológie pomáhajú zapamätať si vaše preferencie
                  a zlepšujú používateľský komfort. Aktivujú sa len v prípadoch,
                  keď je to potrebné na uloženie vami výslovne zvoleného nastavenia.
                </p>
              </div>

              {/* Analytické */}
              <div className={`border-l-4 pl-4 ${preferences.analytics ? 'border-green-500' : 'border-gray-300'}`}>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-sans font-bold text-brand-dark">Analytické</h3>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    preferences.analytics
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {preferences.analytics ? 'Povolené' : 'Podľa vášho súhlasu'}
                  </span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Používajú sa na meranie návštevnosti a správania na webe,
                  aby sme vedeli zlepšovať obsah, štruktúru a výkon stránky.
                  Aktivujú sa iba po vašom predchádzajúcom súhlase.
                </p>
              </div>

              {/* Marketingové */}
              <div className={`border-l-4 pl-4 ${preferences.marketing ? 'border-green-500' : 'border-gray-300'}`}>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-sans font-bold text-brand-dark">Marketingové</h3>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    preferences.marketing
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {preferences.marketing ? 'Povolené' : 'Podľa vášho súhlasu'}
                  </span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Používajú sa na meranie účinnosti reklamy, remarketing
                  a zobrazovanie relevantnejších reklamných kampaní.
                  Aktivujú sa iba po vašom predchádzajúcom súhlase.
                </p>
              </div>
            </div>
          </motion.section>

          {/* 3. Prehľad používaných cookies */}
          <motion.section
            id="prehlad-cookies"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-orostone p-8 shadow-sm"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-brand-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-brand-gold font-semibold">3</span>
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-sans font-bold text-brand-dark mb-2">Prehľad používaných cookies a podobných technológií</h2>
                <p className="text-gray-500 text-base">Podrobný zoznam</p>
              </div>
            </div>
            <div className="pl-16">
              <div className="overflow-x-auto -mx-2">
                <table className="w-full text-sm min-w-[600px]">
                  <thead>
                    <tr className="border-b-2 border-brand-gold/30">
                      <th className="text-left py-3 px-2 font-bold text-brand-dark text-xs uppercase tracking-wider">Názov</th>
                      <th className="text-left py-3 px-2 font-bold text-brand-dark text-xs uppercase tracking-wider">Poskytovateľ</th>
                      <th className="text-left py-3 px-2 font-bold text-brand-dark text-xs uppercase tracking-wider">Typ</th>
                      <th className="text-left py-3 px-2 font-bold text-brand-dark text-xs uppercase tracking-wider">Účel</th>
                      <th className="text-left py-3 px-2 font-bold text-brand-dark text-xs uppercase tracking-wider">Doba uloženia</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 divide-y divide-gray-100">
                    <tr>
                      <td className="py-3 px-2 font-mono text-xs align-top">orostone-cookies</td>
                      <td className="py-3 px-2 align-top">Orostone</td>
                      <td className="py-3 px-2 align-top"><span className="text-green-700 text-xs font-medium">Nevyhnutné</span></td>
                      <td className="py-3 px-2 align-top">localStorage — uloženie vašich nastavení cookies a záznamu o udelenom alebo odvolanom súhlase</td>
                      <td className="py-3 px-2 align-top whitespace-nowrap">Do zmeny nastavení alebo vymazania prehliadačom</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-2 font-mono text-xs align-top">orostone_shopify_cart_id</td>
                      <td className="py-3 px-2 align-top">Orostone / Shopify</td>
                      <td className="py-3 px-2 align-top"><span className="text-green-700 text-xs font-medium">Nevyhnutné</span></td>
                      <td className="py-3 px-2 align-top">localStorage — zachovanie obsahu nákupného košíka</td>
                      <td className="py-3 px-2 align-top whitespace-nowrap">Do vymazania košíka alebo prehliadačom</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-2 font-mono text-xs align-top">cf_clearance, __cf_bm</td>
                      <td className="py-3 px-2 align-top">Cloudflare</td>
                      <td className="py-3 px-2 align-top"><span className="text-green-700 text-xs font-medium">Nevyhnutné</span></td>
                      <td className="py-3 px-2 align-top">Ochrana formulárov a webu pred spamom, botmi a zneužitím; bezpečnostné a anti-abuse mechanizmy Cloudflare</td>
                      <td className="py-3 px-2 align-top whitespace-nowrap">Do 30 min / podľa konfigurácie služby</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-2 font-mono text-xs align-top">orostone-theme</td>
                      <td className="py-3 px-2 align-top">Orostone</td>
                      <td className="py-3 px-2 align-top"><span className="text-blue-600 text-xs font-medium">Funkčné</span></td>
                      <td className="py-3 px-2 align-top">localStorage — uloženie vami zvolenej preferencie zobrazenia stránky</td>
                      <td className="py-3 px-2 align-top whitespace-nowrap">Do zmeny nastavenia alebo vymazania prehliadačom</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-2 font-mono text-xs align-top">orostone-newsletter-popup</td>
                      <td className="py-3 px-2 align-top">Orostone</td>
                      <td className="py-3 px-2 align-top"><span className="text-blue-600 text-xs font-medium">Funkčné</span></td>
                      <td className="py-3 px-2 align-top">localStorage — uloženie informácie o vašej interakcii s newsletter popupom</td>
                      <td className="py-3 px-2 align-top whitespace-nowrap">Do vymazania prehliadačom alebo podľa nastavenia webu</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-2 font-mono text-xs align-top">_ga</td>
                      <td className="py-3 px-2 align-top">Google</td>
                      <td className="py-3 px-2 align-top"><span className="text-amber-700 text-xs font-medium">Analytické</span></td>
                      <td className="py-3 px-2 align-top">
                        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-brand-gold hover:underline">Google Analytics</a> — rozlíšenie návštevníkov a meranie návštevnosti (len so súhlasom)
                      </td>
                      <td className="py-3 px-2 align-top whitespace-nowrap">2 roky</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-2 font-mono text-xs align-top">_gid</td>
                      <td className="py-3 px-2 align-top">Google</td>
                      <td className="py-3 px-2 align-top"><span className="text-amber-700 text-xs font-medium">Analytické</span></td>
                      <td className="py-3 px-2 align-top">Google Analytics — rozlíšenie relácií návštevníkov (len so súhlasom)</td>
                      <td className="py-3 px-2 align-top whitespace-nowrap">24 hodín</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-2 font-mono text-xs align-top">_fbp</td>
                      <td className="py-3 px-2 align-top">Meta</td>
                      <td className="py-3 px-2 align-top"><span className="text-purple-700 text-xs font-medium">Marketingové</span></td>
                      <td className="py-3 px-2 align-top">
                        <a href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noopener noreferrer" className="text-brand-gold hover:underline">Meta Pixel</a> — meranie konverzií a remarketing (len so súhlasom)
                      </td>
                      <td className="py-3 px-2 align-top whitespace-nowrap">3 mesiace</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-2 font-mono text-xs align-top">_fbc</td>
                      <td className="py-3 px-2 align-top">Meta</td>
                      <td className="py-3 px-2 align-top"><span className="text-purple-700 text-xs font-medium">Marketingové</span></td>
                      <td className="py-3 px-2 align-top">Meta Pixel — identifikátor kliknutia z Meta reklamy (len so súhlasom)</td>
                      <td className="py-3 px-2 align-top whitespace-nowrap">2 roky</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </motion.section>

          {/* 4. Právny základ */}
          <motion.section
            id="pravny-zaklad"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-orostone p-8 shadow-sm"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-brand-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-brand-gold font-semibold">4</span>
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-sans font-bold text-brand-dark mb-2">Právny základ</h2>
                <p className="text-gray-500 text-base">Na základe čoho technológie používame</p>
              </div>
            </div>
            <div className="pl-16 text-gray-600 leading-relaxed space-y-4">
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
            </div>
          </motion.section>

          {/* 5. Správa nastavení */}
          <motion.section
            id="sprava-cookies"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-orostone p-8 shadow-sm"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-brand-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-brand-gold font-semibold">5</span>
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-sans font-bold text-brand-dark mb-2">Ako spravovať svoje nastavenia?</h2>
                <p className="text-gray-500 text-base">Možnosti kontroly</p>
              </div>
            </div>
            <div className="pl-16 text-gray-600 leading-relaxed space-y-6">
              <div>
                <h3 className="font-sans font-bold text-brand-dark mb-2">Na našej stránke</h3>
                <p className="mb-2">
                  Svoje nastavenia cookies a podobných technológií môžete kedykoľvek zmeniť:
                </p>
                <ul className="text-sm space-y-1 mb-4">
                  <li>• prostredníctvom odkazu „Nastavenia cookies" v pätičke webu,</li>
                  <li>• prostredníctvom cookie bannera alebo centra preferencií,</li>
                  <li>• vo vašom internetovom prehliadači.</li>
                </ul>
                <button
                  onClick={openSettings}
                  className="px-6 py-3 bg-brand-gold text-white rounded-full hover:bg-brand-dark transition-colors font-medium"
                >
                  Otvoriť nastavenia cookies
                </button>
              </div>

              <div>
                <h3 className="font-sans font-bold text-brand-dark mb-3">V prehliadači</h3>
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
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 rounded-orostone hover:bg-gray-100 transition-colors text-sm"
                    >
                      {browser.name}
                      <span className="text-brand-gold">↗</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>

          {/* 6. Tretie strany */}
          <motion.section
            id="tretie-strany"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-orostone p-8 shadow-sm"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-brand-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-brand-gold font-semibold">6</span>
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-sans font-bold text-brand-dark mb-2">Tretie strany</h2>
                <p className="text-gray-500 text-base">Technológie tretích strán na našom webe</p>
              </div>
            </div>
            <div className="pl-16 text-gray-600 leading-relaxed space-y-4">
              <p>Na našom webe môžu byť používané technológie tretích strán, najmä:</p>
              <div className="space-y-3">
                {[
                  { name: 'Shopify', desc: 'prevádzka e-shopu a košíka' },
                  { name: 'Cloudflare', desc: 'ochrana formulárov a webu' },
                  { name: 'Google (Google Analytics 4)', desc: 'analytika návštevnosti' },
                  { name: 'Meta (Meta Pixel)', desc: 'remarketing a meranie konverzií' },
                ].map((item) => (
                  <div key={item.name} className="bg-gray-50 rounded-orostone p-3">
                    <span className="font-sans font-bold text-brand-dark">{item.name}</span>
                    <span className="text-sm text-gray-500"> — {item.desc}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm">
                Ak sú technológie tretích strán spojené so spracúvaním osobných údajov,
                viac informácií nájdete v našich{' '}
                <Link to="/ochrana-sukromia" className="text-brand-gold hover:underline">
                  Zásadách ochrany osobných údajov
                </Link>.
              </p>
            </div>
          </motion.section>

          {/* 7. Upozornenie */}
          <motion.section
            id="upozornenie"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-orostone p-8 shadow-sm"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-brand-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-brand-gold font-semibold">7</span>
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-sans font-bold text-brand-dark mb-2">Dôležité upozornenie</h2>
              </div>
            </div>
            <div className="pl-16">
              <div className="bg-amber-50 border-l-4 border-brand-gold rounded-orostone p-4">
                <p className="text-sm text-gray-700 leading-relaxed">
                  Blokovanie alebo vypnutie niektorých technológií môže ovplyvniť funkčnosť
                  webu alebo dostupnosť určitých funkcií, najmä košíka, formulárov
                  a bezpečnostných mechanizmov.
                </p>
              </div>
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
              <p className="text-lg font-medium text-brand-dark">26.03.2026</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={openSettings}
                className="px-6 py-3 border border-brand-gold text-brand-gold rounded-full hover:bg-brand-gold hover:text-white transition-colors"
              >
                Nastavenia cookies
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
