import React from 'react';
import { Mail, Phone, MapPin, AlertTriangle } from 'lucide-react';

export const EshopContact: React.FC = () => {
  return (
    <main className="bg-white">
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block text-xs font-bold tracking-[0.18em] uppercase text-brand-gold mb-4">
              Kontakt
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-dark mb-6">
              Sme tu pre vás
            </h1>
            <p className="text-gray-600 leading-relaxed text-base sm:text-lg">
              Pre cenovú ponuku alebo konzultáciu nás kontaktujte emailom alebo telefonicky.
              Odpovedáme čo najskôr.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-16 lg:pb-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            <article className="rounded-2xl border border-gray-200 p-6 sm:p-8 bg-white shadow-sm">
              <div className="w-12 h-12 rounded-full bg-brand-gold/15 flex items-center justify-center mb-5">
                <MapPin className="text-brand-dark" size={20} />
              </div>
              <h2 className="text-xl font-bold text-brand-dark mb-3">Adresa</h2>
              <p className="text-gray-700 leading-relaxed">
                Orostone s.r.o.
                <br />
                Landererova 8, 811 09 Bratislava
                <br />
                mestská časť Staré Mesto
              </p>
              <div className="mt-4 space-y-1 text-sm text-gray-600">
                <p>IČO: 55 254 772</p>
                <p>DIČ: 2121930580</p>
                <p>IČ DPH: SK2121930580</p>
                <p>Platiteľ DPH podľa §4 od 11. 4. 2023</p>
                <p>Zapísaná v Obchodnom registri Mestského súdu Bratislava III, oddiel Sro, vložka 167404/B</p>
              </div>
              <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                <p className="text-sm text-amber-900 flex items-start gap-2">
                  <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
                  <span>Pozor: nejedná sa o adresu showroomu.</span>
                </p>
              </div>
            </article>

            <article className="rounded-2xl border border-gray-200 p-6 sm:p-8 bg-white shadow-sm">
              <div className="w-12 h-12 rounded-full bg-brand-gold/15 flex items-center justify-center mb-5">
                <Mail className="text-brand-dark" size={20} />
              </div>
              <h2 className="text-xl font-bold text-brand-dark mb-3">Cenová ponuka</h2>
              <p className="text-gray-600 leading-relaxed mb-5">
                Pre vyžiadanie cenovej ponuky nám neváhajte zaslať email.
              </p>
              <a
                href="mailto:info@orostone.sk"
                className="inline-flex items-center gap-2 text-brand-dark font-semibold hover:text-brand-gold transition-colors"
              >
                <Mail size={16} />
                info@orostone.sk
              </a>
            </article>

            <article className="rounded-2xl border border-gray-200 p-6 sm:p-8 bg-white shadow-sm">
              <div className="w-12 h-12 rounded-full bg-brand-gold/15 flex items-center justify-center mb-5">
                <Phone className="text-brand-dark" size={20} />
              </div>
              <h2 className="text-xl font-bold text-brand-dark mb-3">Konzultácie</h2>
              <p className="text-gray-600 leading-relaxed mb-5">
                Máte otázky k výberu materiálu, realizácii alebo objednávke? Kontaktujte nás a člen nášho tímu sa vám v krátkom čase ozve s odborným odporúčaním.
              </p>
              <a
                href="tel:+421917588738"
                className="inline-flex items-center gap-2 text-brand-dark font-semibold hover:text-brand-gold transition-colors"
              >
                <Phone size={16} />
                +421 917 588 738
              </a>
            </article>

            <article className="rounded-2xl border border-brand-gold/40 p-6 sm:p-8 bg-brand-gold/10">
              <div className="w-14 h-14 rounded-full overflow-hidden mb-5">
                <img
                  src="/images/marian-brazdil.png"
                  alt="Marián Brázdil"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <h2 className="text-xl font-bold text-brand-dark mb-1">Kto odpovedá na vašu správu</h2>
              <p className="text-brand-dark font-semibold">Marián Brázdil</p>
              <p className="text-gray-600 text-sm mb-5">Špecialista na sinterovaný kameň</p>
              <div className="flex flex-col gap-2">
                <a
                  href="mailto:marian.brazdil@orostone.sk"
                  className="inline-flex items-center gap-2 text-brand-dark hover:text-brand-gold transition-colors"
                >
                  <Mail size={16} />
                  marian.brazdil@orostone.sk
                </a>
                <a
                  href="tel:+421911891875"
                  className="inline-flex items-center gap-2 text-brand-dark hover:text-brand-gold transition-colors"
                >
                  <Phone size={16} />
                  0911 891 875
                </a>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="pb-16 lg:pb-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto rounded-2xl bg-brand-dark text-white px-6 py-8 sm:px-10 sm:py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div>
              <h3 className="text-2xl font-bold mb-2">Potrebujete rýchlu odpoveď?</h3>
              <p className="text-gray-300">Kontaktujte nás emailom alebo telefonicky.</p>
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
      </section>
    </main>
  );
};
