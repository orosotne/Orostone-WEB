import React from 'react';
import { ShieldCheck, RotateCcw, AlertTriangle, Clock, Mail, Phone, FileText, Package, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../components/UI/SEOHead';

export const ReklamacieAVratenie: React.FC = () => {
  return (
    <main className="bg-white">
      <SEOHead
        title="Reklamácie a vrátenie tovaru | OROSTONE E-Shop"
        description="Reklamačný poriadok, podmienky vrátenia tovaru a postup pri reklamácii. Zákonná zodpovednosť za vady 24 mesiacov. Vzorový formulár na odstúpenie od zmluvy."
        canonical="https://orostone.sk/reklamacie"
      />

      {/* Header */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block text-xs font-bold tracking-[0.18em] uppercase text-brand-gold mb-4">
              Zákaznícky servis
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-dark mb-6">
              Reklamácie a vrátenie tovaru
            </h1>
            <p className="text-gray-600 leading-relaxed text-base sm:text-lg">
              Ak máte otázky k dodanému tovaru, kontaktujte nás na{' '}
              <a href="mailto:info@orostone.sk" className="text-brand-dark font-semibold hover:text-brand-gold transition-colors">info@orostone.sk</a>.
              Reklamácie vybavujeme a právo na odstúpenie od zmluvy uplatňujeme v súlade s platnými právnymi predpismi Slovenskej republiky.
            </p>
          </div>
        </div>
      </section>

      {/* Zodpovednosť za vady */}
      <section className="pb-12 lg:pb-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">

            <h2 className="text-2xl font-bold text-brand-dark mb-8 flex items-center gap-3">
              <ShieldCheck className="text-brand-gold" size={28} />
              Zodpovednosť za vady
            </h2>

            <div className="rounded-2xl border border-gray-200 p-6 bg-white shadow-sm mb-6">
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Pri spotrebiteľskom predaji spoločnosť Orostone zodpovedá za vady, ktoré má tovar v čase dodania a ktoré sa prejavia do <strong className="text-brand-dark">24 mesiacov</strong> od dodania tovaru. Nejde o dobrovoľnú obchodnú záruku navyše, ale o zákonnú zodpovednosť za vady.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="rounded-2xl border border-gray-200 p-6 bg-white shadow-sm">
                <h3 className="font-bold text-brand-dark mb-3">Čo sa za vadu nepovažuje</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-0.5">—</span>
                    Bežné, prirodzené a technologicky podmienené rozdiely vo farbe, kresbe, žilovaní, štruktúre alebo povrchu sinterovaného kameňa
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-0.5">—</span>
                    Rozdiely medzi vzorkou a celou platňou
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-0.5">—</span>
                    Rozdiely spôsobené zobrazením na monitore alebo mobilnom zariadení
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle size={20} className="text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-amber-900 mb-2">Zodpovednosť sa nevzťahuje na</h3>
                    <ul className="space-y-1 text-sm text-amber-800">
                      <li>• Neodborná manipulácia, rezanie, opracovanie alebo montáž</li>
                      <li>• Nevhodné montážne postupy, podklady, lepidlá, náradie alebo technológie</li>
                      <li>• Mechanické poškodenie po prevzatí tovaru</li>
                      <li>• Použitie nevhodných chemických prípravkov</li>
                      <li>• Spracovanie alebo montáž napriek zjavnej vade alebo nesúladu</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6 mb-6">
              <div className="flex items-start gap-3">
                <CheckCircle size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-blue-900 mb-2">Kontrola pred spracovaním</h3>
                  <p className="text-sm text-blue-800 leading-relaxed">
                    Kupujúci je povinný <strong>pred akýmkoľvek rezaním, opracovaním alebo montážou</strong> dôkladne skontrolovať najmä rozmer, dekor, odtieň, povrch a zjavné vady tovaru. Po spracovaní tovaru nemožno úspešne uplatňovať tie vady alebo vlastnosti, ktoré boli zjavné alebo zistiteľné pred spracovaním.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Uplatnenie reklamácie */}
      <section className="pb-12 lg:pb-16 bg-[#F9F9F7]">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto pt-12">

            <h2 className="text-2xl font-bold text-brand-dark mb-8 flex items-center gap-3">
              <Mail className="text-brand-gold" size={28} />
              Uplatnenie reklamácie
            </h2>

            <div className="rounded-2xl border border-gray-200 p-6 bg-white shadow-sm mb-6">
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Reklamáciu alebo vytknutie vady môžete uplatniť e-mailom na{' '}
                <a href="mailto:info@orostone.sk" className="text-brand-dark font-semibold hover:text-brand-gold transition-colors">info@orostone.sk</a>.
                Pre rýchlejšie vybavenie odporúčame uviesť:
              </p>
              <ul className="space-y-2 text-sm text-gray-600 mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-brand-gold mt-0.5">✦</span>
                  Číslo objednávky alebo faktúry
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-gold mt-0.5">✦</span>
                  Popis vady a dátum zistenia
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-gold mt-0.5">✦</span>
                  Fotodokumentáciu vady (detail + celkový pohľad), ak je to vzhľadom na povahu vady možné
                </li>
              </ul>

              <div className="rounded-xl bg-gray-50 p-5 text-sm text-gray-700 leading-relaxed space-y-3">
                <p>
                  Po vytknutí vady vám spoločnosť Orostone <strong className="text-brand-dark">bezodkladne zašle písomné potvrdenie o vytknutí vady</strong> a uvedie lehotu, v ktorej vadu odstráni alebo vybaví uplatnené právo zo zodpovednosti za vady.
                </p>
                <p>
                  Táto lehota <strong className="text-brand-dark">nesmie presiahnuť 30 dní</strong> odo dňa vytknutia vady, ak dlhšia lehota nie je odôvodnená objektívnym dôvodom, ktorý nemožno ovplyvniť.
                </p>
                <p>
                  Ak je na riadne posúdenie vady potrebné sprístupnenie tovaru, obhliadka na mieste, odobratie vzorky, súčinnosť realizátora alebo predloženie technických podkladov, kupujúci je povinný poskytnúť primeranú súčinnosť. Ak spoločnosť Orostone zodpovednosť za vadu odmietne, oznámi dôvody odmietnutia písomne.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Odstúpenie od zmluvy */}
      <section className="pb-12 lg:pb-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto pt-12">

            <h2 className="text-2xl font-bold text-brand-dark mb-8 flex items-center gap-3">
              <RotateCcw className="text-brand-gold" size={28} />
              Odstúpenie od zmluvy pri nákupe na diaľku
            </h2>

            <div className="rounded-2xl border border-gray-200 p-6 bg-white shadow-sm mb-6">
              <div className="flex items-start gap-3 mb-4">
                <Clock size={20} className="text-brand-gold mt-0.5 flex-shrink-0" />
                <h3 className="font-bold text-brand-dark">14-dňová lehota na odstúpenie</h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Ak ste spotrebiteľ a nakúpili ste cez internet, máte právo odstúpiť od zmluvy <strong className="text-brand-dark">bez uvedenia dôvodu do 14 dní</strong> od prevzatia tovaru.
              </p>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Odstúpenie môžete zaslať:
              </p>
              <ul className="space-y-2 text-sm text-gray-600 mb-4">
                <li className="flex items-start gap-2">
                  <span className="text-brand-gold mt-0.5">✦</span>
                  E-mailom na <a href="mailto:info@orostone.sk" className="text-brand-dark font-semibold hover:text-brand-gold transition-colors">info@orostone.sk</a>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-gold mt-0.5">✦</span>
                  Poštou na adresu sídla spoločnosti
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-gold mt-0.5">✦</span>
                  Prostredníctvom{' '}
                  <Link to="/odstupenie-od-zmluvy" className="text-brand-gold hover:underline font-semibold">
                    vzorového formulára na odstúpenie od zmluvy
                  </Link>
                </li>
              </ul>
              <p className="text-gray-600 text-sm leading-relaxed">
                Spotrebiteľ je povinný najneskôr do 14 dní odo dňa odstúpenia zaslať tovar späť alebo ho odovzdať spoločnosti Orostone, ak spoločnosť Orostone nenavrhne iný spôsob prevzatia.
              </p>
            </div>

            {/* Náklady na vrátenie */}
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 mb-6">
              <h3 className="font-bold text-brand-dark mb-3 flex items-center gap-2">
                <Package size={18} className="text-amber-600" />
                Náklady na vrátenie tovaru
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                <strong>Náklady na vrátenie tovaru znáša spotrebiteľ.</strong> Keďže veľkoformátové platne vzhľadom na svoju povahu, hmotnosť a rozmery nemožno spravidla vrátiť bežnou poštovou službou, vracajú sa primeranou prepravou.
              </p>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                Priame náklady na vrátenie sa spravidla pohybujú v rozmedzí <strong className="text-brand-dark">150 € až 350 € s DPH</strong> v závislosti od miesta vyzdvihnutia, počtu kusov a spôsobu dopravy.
              </p>
            </div>

            {/* Stav vráteného tovaru */}
            <div className="rounded-2xl border border-gray-200 p-6 bg-white shadow-sm mb-6">
              <h3 className="font-bold text-brand-dark mb-3">Stav vráteného tovaru</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-3">
                Spotrebiteľ zodpovedá len za zníženie hodnoty tovaru, ktoré vzniklo v dôsledku takého zaobchádzania s tovarom, ktoré je nad rámec potrebný na zistenie vlastností a funkčnosti tovaru.
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                Z dôvodu bezpečnej spätnej prepravy odporúčame tovar vrátiť v pôvodnom obale alebo v rovnocennom ochrannom balení. Absencia pôvodného obalu sama osebe nevylučuje platné odstúpenie od zmluvy, môže však mať vplyv na posúdenie zodpovednosti za poškodenie vzniknuté pri spätnom transporte.
              </p>
            </div>

            {/* Vrátenie platieb */}
            <div className="rounded-2xl border border-gray-200 p-6 bg-white shadow-sm mb-6">
              <h3 className="font-bold text-brand-dark mb-3">Vrátenie platieb</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Spoločnosť Orostone vráti spotrebiteľovi všetky platby, ktoré od neho prijala na základe alebo v súvislosti so zmluvou, vrátane nákladov na dodanie v rozsahu najlacnejšieho bežného spôsobu dodania ponúkaného spoločnosťou Orostone, a to <strong className="text-brand-dark">do 14 dní</strong> od doručenia oznámenia o odstúpení od zmluvy. Spoločnosť Orostone nie je povinná vrátiť platby skôr, ako jej bude tovar doručený späť alebo kým spotrebiteľ nepreukáže jeho odoslanie späť, podľa toho, čo nastane skôr.
              </p>
            </div>

            {/* Formulár CTA */}
            <div className="rounded-2xl border-2 border-brand-gold/30 bg-brand-gold/5 p-6 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-start gap-3">
                  <FileText size={22} className="text-brand-gold mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-brand-dark mb-1">Vzorový formulár na odstúpenie od zmluvy</h3>
                    <p className="text-sm text-gray-600">
                      Podľa zákona č. 108/2024 Z.z. o ochrane spotrebiteľa
                    </p>
                  </div>
                </div>
                <Link
                  to="/odstupenie-od-zmluvy"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-gold text-brand-dark px-6 py-3 text-sm font-bold uppercase tracking-wider hover:bg-brand-dark hover:text-white transition-colors flex-shrink-0"
                >
                  Otvoriť formulár
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Dôležité pri prevzatí */}
      <section className="pb-12 lg:pb-16 bg-[#F9F9F7]">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto pt-12">
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle size={20} className="text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-amber-900 mb-2">Dôležité — skontrolujte tovar pri prevzatí</h3>
                  <p className="text-sm text-amber-800 leading-relaxed">
                    Pri prevzatí zásielky si dôkladne skontrolujte stav balenia aj samotného tovaru. Viditeľné poškodenie je potrebné <strong>bezodkladne zaznamenať v dodacom liste</strong> alebo inom prepravnom doklade dopravcu a zdokumentovať fotografiami. Poškodenie pri doprave, ktoré nebolo zaznamenané pri prevzatí, môže byť následne podstatne ťažšie preukázateľné.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Súvisiace dokumenty */}
      <section className="pb-8 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="rounded-2xl border border-gray-200 p-5 bg-[#F9F9F7]">
              <p className="text-sm text-gray-500 mb-3 font-medium">Súvisiace dokumenty</p>
              <div className="flex flex-wrap gap-4 text-sm">
                <Link to="/vop" className="text-brand-gold hover:underline">Všeobecné obchodné podmienky</Link>
                <span className="text-gray-300">|</span>
                <Link to="/doprava" className="text-brand-gold hover:underline">Doprava a platba</Link>
                <span className="text-gray-300">|</span>
                <Link to="/odstupenie-od-zmluvy" className="text-brand-gold hover:underline">Formulár na odstúpenie od zmluvy</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-16 lg:pb-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="rounded-2xl bg-brand-dark text-white px-6 py-8 sm:px-10 sm:py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
              <div>
                <h3 className="text-2xl font-bold mb-2">Máte otázku k reklamácii?</h3>
                <p className="text-gray-300">Sme tu pre vás.</p>
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
