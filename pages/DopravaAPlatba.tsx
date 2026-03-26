import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, CreditCard, Clock, Package, MapPin, Phone, Mail, RotateCcw } from 'lucide-react';
import { SEOHead } from '../components/UI/SEOHead';

export const DopravaAPlatba: React.FC = () => {
  return (
    <main className="bg-white">
      <SEOHead
        title="Doprava a platba | OROSTONE E-Shop"
        description="Informácie o doprave, platobných metódach a časoch expedície. Špeciálna preprava veľkoformátových platní po celom Slovensku."
        canonical="https://eshop.orostone.sk/doprava"
      />

      {/* Header */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block text-xs font-bold tracking-[0.18em] uppercase text-brand-gold mb-4">
              Logistika
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-dark mb-6">
              Doprava a platba
            </h1>
            <p className="text-gray-600 leading-relaxed text-base sm:text-lg">
              Veľkoformátové platne Orostone doručujeme bezpečne na špeciálnom prepravnom vozíku prostredníctvom zmluvného dopravcu v rámci Slovenskej republiky.
            </p>
          </div>
        </div>
      </section>

      {/* Doprava */}
      <section className="pb-12 lg:pb-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">

            <h2 className="text-2xl font-bold text-brand-dark mb-8 flex items-center gap-3">
              <Truck className="text-brand-gold" size={28} />
              Doprava
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div className="rounded-2xl border border-gray-200 p-6 bg-white shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <Package size={20} className="text-brand-gold" />
                  <h3 className="font-bold text-brand-dark">Špeciálna preprava platní</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Platne majú veľkoformátový rozmer 3&nbsp;200&nbsp;×&nbsp;1&nbsp;600&nbsp;mm a vysokú hmotnosť. Prepravujeme ich výlučne na špeciálnom prepravnom vozíku s kolieskami, kde sú platne bezpečne uchytené popruhmi.
                </p>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  <strong className="text-brand-dark">Štandardná doprava zahŕňa</strong> doručenie na adresu uvedenú v objednávke, na miesto prístupné pre nákladné vozidlo, spravidla na prízemie alebo k vozidlu.
                </p>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  <strong className="text-brand-dark">Súčasťou štandardnej dopravy nie je</strong> vnútorná manipulácia, vynáška, presun po schodoch, vykládka pomocou žeriava, vysokozdvižnej techniky ani iná nadštandardná manipulácia, ak nebolo písomne dohodnuté inak.
                </p>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Kupujúci je povinný zabezpečiť na mieste prevzatia primerané podmienky na bezpečné prevzatie tovaru, vrátane najmenej 2 osôb na asistenciu pri prevzatí.
                </p>
                <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-900 leading-relaxed">
                  Ak kupujúci nezabezpečí prevzatie tovaru, prístup na miesto doručenia alebo potrebnú súčinnosť, spoločnosť Orostone je oprávnená požadovať náhradu nákladov márneho doručenia, opätovného doručenia a primeraných nákladov na skladovanie.
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 p-6 bg-white shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <Clock size={20} className="text-brand-gold" />
                  <h3 className="font-bold text-brand-dark">Dodacie lehoty</h3>
                </div>
                <ul className="space-y-4 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-brand-gold mt-0.5">✦</span>
                    <span><strong className="text-brand-dark">Skladové platne:</strong> expedujeme spravidla do 5 pracovných dní od prijatia platby</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-gold mt-0.5">✦</span>
                    <span><strong className="text-brand-dark">Na objednávku:</strong> expedujeme spravidla v lehote 3 až 6 týždňov v závislosti od dostupnosti u výrobcu</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-gold mt-0.5">✦</span>
                    <span>Ak to spôsob dopravy umožňuje, o expedícii vás budeme informovať e-mailom</span>
                  </li>
                </ul>
                <p className="text-xs text-gray-400 mt-5 leading-relaxed">
                  Uvedené lehoty sú orientačné a môžu sa meniť v závislosti od skladovej dostupnosti, výrobcu, logistiky a okolností, ktoré spoločnosť Orostone nemôže primerane ovplyvniť.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 p-6 bg-white shadow-sm mb-6">
              <h3 className="font-bold text-brand-dark mb-4 flex items-center gap-2">
                <MapPin size={18} className="text-brand-gold" />
                Cena dopravy
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 pr-6 font-semibold text-brand-dark">Oblasť</th>
                      <th className="text-left py-3 pr-6 font-semibold text-brand-dark">Cena (s DPH)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="py-3 pr-6 text-gray-700">Bratislava a okolie (do 50 km)</td>
                      <td className="py-3 pr-6 font-medium text-brand-dark">od 150 EUR</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-6 text-gray-700">Ostatné územie Slovenskej republiky</td>
                      <td className="py-3 pr-6 font-medium text-brand-dark">od 350 EUR</td>
                    </tr>
                    <tr className="bg-amber-50">
                      <td className="py-3 pr-6 font-semibold text-brand-dark">Pri 3 a viac platniach</td>
                      <td className="py-3 pr-6 font-bold text-emerald-700">Doprava zadarmo*</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-500 mt-4 leading-relaxed">
                Konečná cena dopravy sa určuje podľa adresy doručenia, počtu platní, hmotnosti zásielky a prípadných osobitných požiadaviek na manipuláciu. Presná cena dopravy bude zobrazená alebo potvrdená pred odoslaním záväznej objednávky. Doručujeme výlučne na území Slovenskej republiky.
              </p>
              <p className="text-xs text-gray-400 mt-2">
                * Doprava zadarmo pri 3 a viac platniach, ak nie je pri konkrétnej objednávke uvedené inak.
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Úplné obchodné podmienky vrátane podmienok dodania nájdete v{' '}
                <Link to="/vop" className="text-brand-gold hover:underline">Všeobecných obchodných podmienkach</Link>.
              </p>
            </div>

            {/* Vrátenie tovaru — náklady */}
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 mb-6">
              <h3 className="font-bold text-brand-dark mb-4 flex items-center gap-2">
                <RotateCcw size={18} className="text-amber-600" />
                Náklady na vrátenie tovaru
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                Vzhľadom na povahu, hmotnosť a rozmery platní (3&nbsp;200&nbsp;×&nbsp;1&nbsp;600&nbsp;mm) <strong>nie je možné tovar vrátiť bežnou poštou</strong>. V prípade odstúpenia od zmluvy znáša náklady na vrátenie tovaru kupujúci.
              </p>
              <p className="text-sm text-gray-700 leading-relaxed mb-4">
                Orientačné náklady na spätný zvoz tovaru:
              </p>
              <div className="overflow-x-auto mb-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-amber-200">
                      <th className="text-left py-2 pr-6 font-semibold text-brand-dark">Oblasť vyzdvihnutia</th>
                      <th className="text-left py-2 font-semibold text-brand-dark">Odhadované náklady (s DPH)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-100">
                    <tr>
                      <td className="py-2 pr-6 text-gray-700">Bratislava a okolie (do 50 km)</td>
                      <td className="py-2 font-medium text-brand-dark">od 150 EUR</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-6 text-gray-700">Ostatné územie Slovenskej republiky</td>
                      <td className="py-2 font-medium text-brand-dark">od 350 EUR</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Presná výška nákladov na vrátenie závisí od miesta vyzdvihnutia, počtu kusov a spôsobu prepravy a bude potvrdená pred odoslaním záväznej objednávky. Táto informácia je poskytovaná v súlade s § 3 ods. 1 písm. i) zákona č. 108/2024 Z.z. o ochrane spotrebiteľa.
              </p>
              <p className="text-xs text-gray-500 mt-3 leading-relaxed">
                Podrobný postup pri odstúpení od zmluvy nájdete na stránke{' '}
                <Link to="/reklamacie" className="text-brand-gold hover:underline">Reklamácie a vrátenie</Link>{' '}
                alebo vyplňte{' '}
                <Link to="/odstupenie-od-zmluvy" className="text-brand-gold hover:underline">formulár na odstúpenie od zmluvy</Link>.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Platba */}
      <section className="pb-12 lg:pb-16 bg-[#F9F9F7]">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto pt-12">

            <h2 className="text-2xl font-bold text-brand-dark mb-8 flex items-center gap-3">
              <CreditCard className="text-brand-gold" size={28} />
              Platobné metódy
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div className="rounded-2xl border border-gray-200 p-6 bg-white shadow-sm">
                <h3 className="font-bold text-brand-dark mb-3">Online platba kartou</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Bezpečná platba prostredníctvom zabezpečenej platobnej brány. Akceptujeme Visa a Mastercard.
                </p>
              </div>
              <div className="rounded-2xl border border-gray-200 p-6 bg-white shadow-sm">
                <h3 className="font-bold text-brand-dark mb-3">Apple Pay / Google Pay</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Rýchla platba cez Apple Pay alebo Google Pay, ak sú na zariadení kupujúceho dostupné.
                </p>
              </div>
              <div className="rounded-2xl border border-gray-200 p-6 bg-white shadow-sm">
                <h3 className="font-bold text-brand-dark mb-3">Bankový prevod</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Bankový prevod je možný, ak to spoločnosť Orostone v konkrétnom prípade umožní. Pri väčších objednávkach alebo pri firemných zákazníkoch si spoločnosť Orostone vyhradzuje právo určiť individuálne platobné podmienky, vrátane úhrady zálohy alebo platby vopred.
                </p>
              </div>
              <div className="rounded-2xl border border-gray-200 p-6 bg-white shadow-sm">
                <h3 className="font-bold text-brand-dark mb-3">DPH a fakturácia</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Spoločnosť Orostone je platiteľom DPH (IČ DPH: SK2121930580). Daňový doklad zasielame elektronicky. Ak kupujúci požaduje vystavenie faktúry na podnikateľský subjekt, je povinný uviesť správne fakturačné údaje pri objednávke. Neskoršia zmena fakturačných údajov je možná len v rozsahu pripustenom príslušnými právnymi predpismi.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Kontakt */}
      <section className="pb-16 lg:pb-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="rounded-2xl bg-brand-dark text-white px-6 py-8 sm:px-10 sm:py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
              <div>
                <h3 className="text-2xl font-bold mb-2">Otázky k doprave?</h3>
                <p className="text-gray-300">Radi vám poradíme pred objednaním.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="tel:+421917588738"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-gold text-brand-dark px-6 py-3 text-sm font-bold uppercase tracking-wider hover:bg-white transition-colors"
                >
                  <Phone size={16} />
                  Zavolať
                </a>
                <a
                  href="mailto:info@orostone.sk"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 text-white px-6 py-3 text-sm font-bold uppercase tracking-wider hover:bg-white hover:text-brand-dark transition-colors"
                >
                  <Mail size={16} />
                  Napísať email
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
