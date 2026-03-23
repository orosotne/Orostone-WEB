import React from 'react';
import { ShieldCheck, RotateCcw, AlertTriangle, Clock, Mail, Phone } from 'lucide-react';
import { SEOHead } from '../components/UI/SEOHead';

export const ReklamacieAVratenie: React.FC = () => {
  return (
    <main className="bg-white">
      <SEOHead
        title="Reklamácie a vrátenie | OROSTONE E-Shop"
        description="Reklamačný poriadok, podmienky vrátenia tovaru a postup pri reklamácii. OROSTONE poskytuje 24-mesačnú záruku na všetky produkty."
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
              Reklamácie a vrátenie
            </h1>
            <p className="text-gray-600 leading-relaxed text-base sm:text-lg">
              Vaša spokojnosť je pre nás prioritou. V prípade akýchkoľvek problémov sme tu pre vás.
            </p>
          </div>
        </div>
      </section>

      {/* Záruka */}
      <section className="pb-12 lg:pb-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">

            <h2 className="text-2xl font-bold text-brand-dark mb-8 flex items-center gap-3">
              <ShieldCheck className="text-brand-gold" size={28} />
              Záručné podmienky
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div className="rounded-2xl border border-gray-200 p-6 bg-white shadow-sm">
                <h3 className="font-bold text-brand-dark mb-3">Dĺžka záruky</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Na všetky sinterované platne poskytujeme <strong className="text-brand-dark">24-mesačnú záruku</strong> na materiál v súlade s platnou legislatívou SR (zákon č. 40/1964 Zb., § 620).
                </p>
              </div>
              <div className="rounded-2xl border border-gray-200 p-6 bg-white shadow-sm">
                <h3 className="font-bold text-brand-dark mb-3">Čo záruka kryje</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-brand-gold mt-0.5">✦</span>
                    Výrobné vady materiálu (praskliny, bubliny, štrukturálne defekty)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-gold mt-0.5">✦</span>
                    Farebné odchýlky presahujúce normu výrobcu
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-gold mt-0.5">✦</span>
                    Vady vzniknuté pri výrobe alebo skladovaní
                  </li>
                </ul>
              </div>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 mb-10">
              <div className="flex items-start gap-3">
                <AlertTriangle size={20} className="text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-amber-900 mb-2">Čo záruka nekryje</h3>
                  <ul className="space-y-1 text-sm text-amber-800">
                    <li>• Poškodenie spôsobené nesprávnou montážou alebo opracovaním</li>
                    <li>• Mechanické poškodenie pri doprave (preto je dôležité skontrolovať tovar pri prevzatí)</li>
                    <li>• Bežné opotrebenie pri správnom používaní</li>
                    <li>• Poškodenie spôsobené chemikáliami nevhodnými pre sinterovaný kameň</li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Vrátenie tovaru */}
      <section className="pb-12 lg:pb-16 bg-[#F9F9F7]">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto pt-12">

            <h2 className="text-2xl font-bold text-brand-dark mb-8 flex items-center gap-3">
              <RotateCcw className="text-brand-gold" size={28} />
              Vrátenie tovaru
            </h2>

            <div className="rounded-2xl border border-gray-200 p-6 bg-white shadow-sm mb-6">
              <h3 className="font-bold text-brand-dark mb-3 flex items-center gap-2">
                <Clock size={18} className="text-brand-gold" />
                14-dňová lehota na vrátenie
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                V súlade so zákonom č. 102/2014 Z.z. máte právo vrátiť tovar zakúpený cez internet bez udania dôvodu do <strong className="text-brand-dark">14 kalendárnych dní</strong> od prevzatia tovaru.
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                Tovar musí byť vrátený v pôvodnom nepoškodenom stave, nepoužitý a v pôvodnom balení (alebo ekvivalentnom). Náklady na vrátenie znáša zákazník.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 p-6 bg-white shadow-sm mb-6">
              <h3 className="font-bold text-brand-dark mb-4">Postup pri vrátení tovaru</h3>
              <ol className="space-y-3">
                {[
                  'Kontaktujte nás emailom na info@orostone.sk s číslom objednávky a dôvodom vrátenia.',
                  'My vám potvrdíme prijatie žiadosti a poskytneme inštrukcie k vráteniu (adresa, balenie).',
                  'Zabezpečte vhodnú paletovú prepravu tovaru späť (veľkoformátové platne vyžadujú špeciálne zaobchádzanie).',
                  'Po prijatí a skontrolovaní tovaru vrátime platbu na váš bankový účet do 14 dní.',
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                    <span className="w-6 h-6 rounded-full bg-brand-gold/20 text-brand-dark font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

          </div>
        </div>
      </section>

      {/* Reklamácia */}
      <section className="pb-12 lg:pb-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto pt-12">

            <h2 className="text-2xl font-bold text-brand-dark mb-8">Postup pri reklamácii</h2>

            <div className="rounded-2xl border border-gray-200 p-6 bg-white shadow-sm mb-6">
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                Reklamáciu uplatnite emailom na <a href="mailto:info@orostone.sk" className="text-brand-dark font-semibold hover:text-brand-gold transition-colors">info@orostone.sk</a>. V emaile uveďte:
              </p>
              <ul className="space-y-2 text-sm text-gray-600 mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-brand-gold mt-0.5">✦</span>
                  Číslo objednávky
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-gold mt-0.5">✦</span>
                  Popis vady a kedy ste ju zistili
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-gold mt-0.5">✦</span>
                  Fotografie vady (detail + celkový pohľad)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-gold mt-0.5">✦</span>
                  Váš preferovaný spôsob vybavenia (oprava, výmena, vrátenie peňazí)
                </li>
              </ul>
              <p className="text-gray-600 text-sm leading-relaxed">
                Reklamáciu vybavíme v zákonnej lehote <strong className="text-brand-dark">30 dní</strong> od jej doručenia. O postupe vás budeme informovať emailom.
              </p>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 mb-10">
              <div className="flex items-start gap-3">
                <AlertTriangle size={20} className="text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-amber-900 mb-2">Dôležité — skontrolujte tovar pri prevzatí</h3>
                  <p className="text-sm text-amber-800 leading-relaxed">
                    Pri prevzatí palety si dôkladne prezrite stav tovaru a balenia. Viditeľné poškodenie <strong>okamžite</strong> zaznamenajte v dodacom liste dopravcu a odfotografujte. Poškodenie pri doprave, ktoré nebolo zaznamenané pri prevzatí, môže byť ťažšie reklamovateľné.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-16 lg:pb-24 bg-[#F9F9F7]">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="rounded-2xl bg-brand-dark text-white px-6 py-8 sm:px-10 sm:py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
              <div>
                <h3 className="text-2xl font-bold mb-2">Máte otázku k reklamácii?</h3>
                <p className="text-gray-300">Sme tu pre vás od pondelka do piatku 8:00 – 17:00.</p>
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
