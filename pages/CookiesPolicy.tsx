import React from 'react';
import { motion } from 'framer-motion';
import { useCookies } from '../context/CookieContext';

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
            Zásady používania Cookies
          </h1>
          <p className="font-sans font-light text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Táto stránka vysvetľuje, ako používame cookies a podobné technológie 
            na našom webe.
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { id: 'co-su-cookies', label: 'Čo sú cookies?' },
              { id: 'typy-cookies', label: 'Typy cookies' },
              { id: 'pouzivane-cookies', label: 'Používané cookies' },
              { id: 'sprava-cookies', label: 'Správa cookies' },
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
                  Nevyhnutné: Aktívne
                </span>
                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                  preferences.analytics 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${preferences.analytics ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                  Analytické: {preferences.analytics ? 'Aktívne' : 'Neaktívne'}
                </span>
                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                  preferences.marketing 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${preferences.marketing ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                  Marketingové: {preferences.marketing ? 'Aktívne' : 'Neaktívne'}
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
          {/* Čo sú cookies */}
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
                <span className="text-2xl">🍪</span>
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-sans font-bold text-brand-dark mb-2">Čo sú cookies?</h2>
                <p className="text-gray-500 text-base">Základné informácie o súboroch cookies</p>
              </div>
            </div>
            <div className="pl-16 text-gray-600 leading-relaxed space-y-4">
              <p>
                Cookies sú malé textové súbory, ktoré sa ukladajú do vášho zariadenia 
                (počítač, tablet, smartfón) pri návšteve webovej stránky.
              </p>
              <p>
                Tieto súbory pomáhajú webovej stránke zapamätať si informácie o vašej 
                návšteve, ako napríklad preferovaný jazyk a iné nastavenia. To môže 
                uľahčiť vašu ďalšiu návštevu a stránka sa stane pre vás užitočnejšou.
              </p>
              <div className="bg-gray-50 rounded-orostone p-4">
                <p className="text-sm">
                  <strong>Dôležité:</strong> Cookies sami o sebe neidentifikujú konkrétnu osobu, 
                  ale identifikujú zariadenie. Nespôsobujú žiadnu škodu vášmu zariadeniu 
                  a neobsahujú vírusy.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Typy cookies */}
          <motion.section
            id="typy-cookies"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-orostone p-8 shadow-sm"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-brand-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">📋</span>
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-sans font-bold text-brand-dark mb-2">Typy cookies, ktoré používame</h2>
                <p className="text-gray-500 text-base">Rozdelenie podľa účelu použitia</p>
              </div>
            </div>
            <div className="pl-16 space-y-6">
              {/* Nevyhnutné */}
              <div className="border-l-4 border-green-500 pl-4">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-sans font-bold text-brand-dark">Nevyhnutné cookies</h3>
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                    Vždy aktívne
                  </span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Tieto cookies sú potrebné pre základné fungovanie stránky. Bez nich by 
                  stránka nefungovala správne. Zahŕňajú napríklad cookies, ktoré umožňujú 
                  zapamätanie vašich nastavení súkromia.
                </p>
              </div>

              {/* Analytické */}
              <div className={`border-l-4 pl-4 ${preferences.analytics ? 'border-green-500' : 'border-gray-300'}`}>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-sans font-bold text-brand-dark">Analytické cookies</h3>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    preferences.analytics 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {preferences.analytics ? 'Aktívne' : 'Neaktívne'}
                  </span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Pomáhajú nám pochopiť, ako návštevníci používajú našu stránku. Údaje sú 
                  anonymizované a používajú sa na zlepšenie funkčnosti a obsahu stránky.
                </p>
              </div>

              {/* Marketingové */}
              <div className={`border-l-4 pl-4 ${preferences.marketing ? 'border-green-500' : 'border-gray-300'}`}>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-sans font-bold text-brand-dark">Marketingové cookies</h3>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    preferences.marketing 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {preferences.marketing ? 'Aktívne' : 'Neaktívne'}
                  </span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Používajú sa na zobrazovanie relevantných reklám a sledovanie účinnosti 
                  reklamných kampaní. Tieto cookies môžu sledovať vaše správanie na viacerých 
                  webových stránkach.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Používané cookies */}
          <motion.section
            id="pouzivane-cookies"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-orostone p-8 shadow-sm"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-brand-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">📊</span>
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-sans font-bold text-brand-dark mb-2">Zoznam používaných cookies</h2>
                <p className="text-gray-500 text-base">Podrobný prehľad cookies na našej stránke</p>
              </div>
            </div>
            <div className="pl-16">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 pr-4 font-medium text-brand-dark">Názov</th>
                      <th className="text-left py-3 pr-4 font-medium text-brand-dark">Typ</th>
                      <th className="text-left py-3 pr-4 font-medium text-brand-dark">Účel</th>
                      <th className="text-left py-3 font-medium text-brand-dark">Platnosť</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600">
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4 font-mono text-xs">cookie_consent</td>
                      <td className="py-3 pr-4">Nevyhnutné</td>
                      <td className="py-3 pr-4">Uloženie vašich preferencií cookies</td>
                      <td className="py-3">1 rok</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4 font-mono text-xs">_ga</td>
                      <td className="py-3 pr-4">Analytické</td>
                      <td className="py-3 pr-4">Google Analytics - rozlíšenie používateľov</td>
                      <td className="py-3">2 roky</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4 font-mono text-xs">_gid</td>
                      <td className="py-3 pr-4">Analytické</td>
                      <td className="py-3 pr-4">Google Analytics - rozlíšenie používateľov</td>
                      <td className="py-3">24 hodín</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 pr-4 font-mono text-xs">_fbp</td>
                      <td className="py-3 pr-4">Marketingové</td>
                      <td className="py-3 pr-4">Facebook Pixel - sledovanie konverzií</td>
                      <td className="py-3">3 mesiace</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </motion.section>

          {/* Správa cookies */}
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
                <span className="text-2xl">⚙️</span>
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-sans font-bold text-brand-dark mb-2">Ako spravovať cookies?</h2>
                <p className="text-gray-500 text-base">Možnosti kontroly vašich cookies</p>
              </div>
            </div>
            <div className="pl-16 text-gray-600 leading-relaxed space-y-6">
              <div>
                <h3 className="font-sans font-bold text-brand-dark mb-2">Na našej stránke</h3>
                <p className="mb-4">
                  Môžete kedykoľvek zmeniť svoje preferencie cookies pomocou tlačidla nižšie 
                  alebo cez odkaz v päte stránky.
                </p>
                <button
                  onClick={openSettings}
                  className="px-6 py-3 bg-brand-gold text-white rounded-full hover:bg-brand-dark transition-colors font-medium"
                >
                  Otvoriť nastavenia cookies
                </button>
              </div>

              <div>
                <h3 className="font-sans font-bold text-brand-dark mb-3">V prehliadači</h3>
                <p className="mb-4">
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

              <div className="bg-amber-50 border-l-4 border-brand-gold rounded-orostone p-4">
                <p className="text-sm">
                  <strong>Upozornenie:</strong> Blokovanie všetkých cookies môže ovplyvniť 
                  fungovanie niektorých funkcií stránky. Nevyhnutné cookies nie je možné 
                  vypnúť, pretože sú potrebné pre základné fungovanie webu.
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
              <p className="text-lg font-medium text-brand-dark">01.01.2026</p>
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
