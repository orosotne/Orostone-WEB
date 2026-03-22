import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export const PrivacyPolicy = () => {
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
              { id: 'rozsah', label: 'Rozsah údajov' },
              { id: 'doba', label: 'Doba uchovávania' },
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
          {/* Prevádzkovateľ */}
          <motion.section
            id="prevadzkovatel"
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

          {/* Účel spracovania */}
          <motion.section
            id="ucel"
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
                <h2 className="text-xl md:text-2xl font-sans font-bold text-brand-dark mb-2">Účel spracovania osobných údajov</h2>
                <p className="text-gray-500 text-base">Prečo spracovávame vaše údaje</p>
              </div>
            </div>
            <div className="pl-16 text-gray-600 leading-relaxed">
              <p className="mb-4">Vaše osobné údaje spracovávame za týmito účelmi:</p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-brand-gold mt-1">•</span>
                  <span><strong>Vybavenie objednávky</strong> – spracovanie a doručenie vášho tovaru</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-brand-gold mt-1">•</span>
                  <span><strong>Komunikácia</strong> – informovanie o stave objednávky a zodpovedanie dopytov</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-brand-gold mt-1">•</span>
                  <span><strong>Cenové ponuky</strong> – príprava individuálnych kalkulácií a ponúk</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-brand-gold mt-1">•</span>
                  <span><strong>Zákonné povinnosti</strong> – účtovníctvo, daňové účely, archivačné lehoty</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-brand-gold mt-1">•</span>
                  <span><strong>Marketing</strong> – len s vaším výslovným súhlasom (newsletter, ponuky)</span>
                </li>
              </ul>
            </div>
          </motion.section>

          {/* Rozsah údajov */}
          <motion.section
            id="rozsah"
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
                  </ul>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Doba uchovávania */}
          <motion.section
            id="doba"
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

          {/* Vaše práva */}
          <motion.section
            id="prava"
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
                <h2 className="text-xl md:text-2xl font-sans font-bold text-brand-dark mb-2">Vaše práva</h2>
                <p className="text-gray-500 text-base">Práva dotknutej osoby podľa GDPR</p>
              </div>
            </div>
            <div className="pl-16 text-gray-600 leading-relaxed">
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { title: 'Právo na prístup', desc: 'Máte právo vedieť, aké údaje o vás spracovávame' },
                  { title: 'Právo na opravu', desc: 'Môžete požiadať o opravu nesprávnych údajov' },
                  { title: 'Právo na vymazanie', desc: 'Za určitých podmienok môžete žiadať o výmaz' },
                  { title: 'Právo na obmedzenie', desc: 'Môžete obmedziť spracovanie vašich údajov' },
                  { title: 'Právo na prenosnosť', desc: 'Môžete žiadať o prenos údajov k inému subjektu' },
                  { title: 'Právo namietať', desc: 'Môžete namietať proti určitým typom spracovania' },
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
                  Napíšte nám na <span className="text-brand-gold">info@orostone.sk</span>. 
                  Na vašu žiadosť odpovieme do 30 dní.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Cookies */}
          <motion.section
            id="cookies"
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
                <h2 className="text-xl md:text-2xl font-sans font-bold text-brand-dark mb-2">Cookies</h2>
                <p className="text-gray-500 text-base">Používanie súborov cookies</p>
              </div>
            </div>
            <div className="pl-16 text-gray-600 leading-relaxed">
              <p className="mb-4">
                Naša webová stránka používa cookies na zabezpečenie základných funkcií 
                a zlepšenie používateľského zážitku. Podrobné informácie nájdete v našich 
                zásadách používania cookies.
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

          {/* Kontakt */}
          <motion.section
            id="kontakt"
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
              <p className="text-lg font-medium text-brand-dark">01.01.2026</p>
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
