import React from 'react';
import { Truck, CreditCard, Clock, Package, MapPin, Phone, Mail } from 'lucide-react';
import { SEOHead } from '../components/UI/SEOHead';

export const DopravaAPlatba: React.FC = () => {
  return (
    <main className="bg-white">
      <SEOHead
        title="Doprava a platba | OROSTONE E-Shop"
        description="Informácie o doprave, platobných metódach a časoch expedície. Paletová preprava po celom Slovensku."
        canonical="https://orostone.sk/doprava"
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
              Veľkoformátové platne doručujeme na paletách bezpečne a spoľahlivo po celom Slovensku.
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
                  <h3 className="font-bold text-brand-dark">Paletová preprava</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Platne sú veľkoformátové (3200 × 1600 mm) a ťažké — prepravujeme ich výhradne na palete s profesionálnym dopravcom.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-brand-gold mt-0.5">✦</span>
                    Doručenie priamo na vami zvolenú adresu
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-gold mt-0.5">✦</span>
                    Vozidlo so zadným zdvíhacím čelom
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-gold mt-0.5">✦</span>
                    Preberanie platní je potrebné zabezpečiť na mieste (min. 2 osoby)
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border border-gray-200 p-6 bg-white shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <Clock size={20} className="text-brand-gold" />
                  <h3 className="font-bold text-brand-dark">Čas expedície</h3>
                </div>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-brand-gold mt-0.5">✦</span>
                    <span><strong className="text-brand-dark">Skladové platne:</strong> expedícia do 5 pracovných dní od prijatia platby</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-gold mt-0.5">✦</span>
                    <span><strong className="text-brand-dark">Na objednávku:</strong> 3–6 týždňov (závisí od dostupnosti u výrobcu)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-gold mt-0.5">✦</span>
                    O expedícii vás informujeme emailom s číslom zásielky
                  </li>
                </ul>
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
                      <th className="text-left py-3 font-semibold text-brand-dark">Poznámka</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="py-3 pr-6 text-gray-700">Bratislava a okolie (do 50 km)</td>
                      <td className="py-3 pr-6 font-medium text-brand-dark">od 80 EUR</td>
                      <td className="py-3 text-gray-500">Závisí od počtu paliet</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-6 text-gray-700">Celé Slovensko</td>
                      <td className="py-3 pr-6 font-medium text-brand-dark">od 120 EUR</td>
                      <td className="py-3 text-gray-500">Závisí od vzdialenosti a počtu paliet</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-6 text-gray-700">Česká republika</td>
                      <td className="py-3 pr-6 font-medium text-brand-dark">na dopyt</td>
                      <td className="py-3 text-gray-500">Kontaktujte nás pred objednaním</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-400 mt-4">
                * Presná cena dopravy sa zobrazí v objednávkovom procese na stránke Shopify. Ceny sú orientačné a môžu sa líšiť podľa aktuálneho cenníka prepravcu.
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
                  Bezpečná platba cez Shopify Payments. Akceptujeme Visa a Mastercard. Platba prebehne na zabezpečenej Shopify stránke.
                </p>
              </div>
              <div className="rounded-2xl border border-gray-200 p-6 bg-white shadow-sm">
                <h3 className="font-bold text-brand-dark mb-3">Apple Pay / Google Pay</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Rýchla a bezpečná platba cez Apple Pay alebo Google Pay priamo v prehliadači alebo zariadení.
                </p>
              </div>
              <div className="rounded-2xl border border-gray-200 p-6 bg-white shadow-sm">
                <h3 className="font-bold text-brand-dark mb-3">Bankový prevod</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Pre väčšie objednávky alebo firemných zákazníkov vieme dohodnúť platbu bankovým prevodom na faktúru. Kontaktujte nás pred objednaním.
                </p>
              </div>
              <div className="rounded-2xl border border-gray-200 p-6 bg-white shadow-sm">
                <h3 className="font-bold text-brand-dark mb-3">DPH a fakturácia</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Sme platitelia DPH (IČ DPH: SK2121930580). Na požiadanie vystavíme faktúru s DPH. Pre firemných zákazníkov uveďte IČO pri objednávke do poznámky.
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
