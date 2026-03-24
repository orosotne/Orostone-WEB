import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SEOHead } from '../components/UI/SEOHead';
import { FileText, ArrowLeft, Printer } from 'lucide-react';

/**
 * Vzorový formulár na odstúpenie od zmluvy
 * Príloha č. 3 zákona č. 102/2014 Z.z. o ochrane spotrebiteľa pri predaji na diaľku
 */
export const OdstupeniOdZmluvy: React.FC = () => {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#F9F9F7]">
      <SEOHead
        title="Formulár na odstúpenie od zmluvy | OROSTONE"
        description="Vzorový formulár na odstúpenie od kúpnej zmluvy uzavretej na diaľku podľa zákona č. 102/2014 Z.z. OROSTONE e-shop."
        canonical="https://orostone.sk/odstupenie-od-zmluvy"
        noindex={false}
      />
      <div className="container mx-auto px-6 max-w-3xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="font-sans text-brand-gold text-xs font-bold tracking-widest uppercase mb-4 block">
            Práva spotrebiteľa • Zákon č. 102/2014 Z.z.
          </span>
          <h1 className="text-3xl md:text-4xl font-sans font-bold text-brand-dark mb-4">
            Formulár na odstúpenie od zmluvy
          </h1>
          <p className="text-gray-500 font-light leading-relaxed max-w-2xl mx-auto">
            Vzorový formulár podľa prílohy č. 3 zákona č. 102/2014 Z.z. o ochrane spotrebiteľa
            pri predaji tovaru na základe zmluvy uzavretej na diaľku.
          </p>
        </motion.div>

        {/* Info box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-amber-50 border-l-4 border-brand-gold rounded-orostone p-6 mb-8"
        >
          <p className="text-sm text-gray-700 leading-relaxed">
            <strong className="text-brand-dark">Ako postupovať:</strong> Tento formulár vyplňte a zašlite e-mailom na{' '}
            <a href="mailto:info@orostone.sk" className="text-brand-gold hover:underline font-medium">info@orostone.sk</a>{' '}
            alebo poštou na adresu sídla spoločnosti pred uplynutím 14-dňovej lehoty od prevzatia tovaru.
            Lehota na odstúpenie je dodržaná, ak zašlete oznámenie pred jej uplynutím.
          </p>
        </motion.div>

        {/* Formulár */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-orostone shadow-sm p-8 md:p-12 print:shadow-none print:p-0"
        >
          {/* Hlavička formulára */}
          <div className="flex items-start gap-4 mb-8 pb-6 border-b border-gray-100">
            <div className="w-12 h-12 bg-brand-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
              <FileText size={22} className="text-brand-gold" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-brand-dark mb-1">
                Oznámenie o odstúpení od zmluvy
              </h2>
              <p className="text-sm text-gray-500">
                Príloha č. 3 zákona č. 102/2014 Z.z. (vzorový formulár)
              </p>
            </div>
          </div>

          {/* Adresát */}
          <div className="mb-8">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Adresát (predávajúci)</p>
            <div className="bg-gray-50 rounded-xl p-5 text-sm text-gray-700 leading-relaxed">
              <p className="font-semibold text-brand-dark">Orostone s.r.o.</p>
              <p>Landererova 8, 811 09 Bratislava</p>
              <p>IČO: 55 254 772</p>
              <p>E-mail: <a href="mailto:info@orostone.sk" className="text-brand-gold hover:underline">info@orostone.sk</a></p>
              <p>Tel.: <a href="tel:+421917588738" className="text-brand-gold hover:underline">+421 917 588 738</a></p>
            </div>
          </div>

          {/* Obsah formulára */}
          <div className="space-y-6 text-sm text-gray-700 leading-relaxed">

            <p className="text-base font-medium text-brand-dark">
              Týmto oznamujem, že odstupujem od zmluvy o kúpe tohto tovaru:
            </p>

            {/* Polia na vyplnenie */}
            <div className="space-y-4">

              <div>
                <p className="font-medium text-brand-dark mb-1">Číslo objednávky / popis objednaného tovaru:</p>
                <div className="border-b-2 border-dashed border-gray-300 h-8 w-full mt-2"></div>
                <div className="border-b-2 border-dashed border-gray-300 h-8 w-full mt-3"></div>
              </div>

              <div>
                <p className="font-medium text-brand-dark mb-1">Dátum objednania:</p>
                <div className="border-b-2 border-dashed border-gray-300 h-8 w-full mt-2"></div>
              </div>

              <div>
                <p className="font-medium text-brand-dark mb-1">Dátum prevzatia tovaru:</p>
                <div className="border-b-2 border-dashed border-gray-300 h-8 w-full mt-2"></div>
              </div>

              <div>
                <p className="font-medium text-brand-dark mb-1">Meno a priezvisko spotrebiteľa:</p>
                <div className="border-b-2 border-dashed border-gray-300 h-8 w-full mt-2"></div>
              </div>

              <div>
                <p className="font-medium text-brand-dark mb-1">Adresa spotrebiteľa:</p>
                <div className="border-b-2 border-dashed border-gray-300 h-8 w-full mt-2"></div>
                <div className="border-b-2 border-dashed border-gray-300 h-8 w-full mt-3"></div>
              </div>

              <div>
                <p className="font-medium text-brand-dark mb-1">Číslo bankového účtu (IBAN) pre vrátenie platby:</p>
                <div className="border-b-2 border-dashed border-gray-300 h-8 w-full mt-2"></div>
              </div>

            </div>

            {/* Dátum a podpis */}
            <div className="flex flex-col sm:flex-row gap-8 pt-4 border-t border-gray-100">
              <div className="flex-1">
                <p className="font-medium text-brand-dark mb-1">Dátum:</p>
                <div className="border-b-2 border-dashed border-gray-300 h-8 w-full mt-2"></div>
              </div>
              <div className="flex-1">
                <p className="font-medium text-brand-dark mb-1">Podpis spotrebiteľa <span className="text-gray-400 font-normal">(len ak sa zasiela písomne)</span>:</p>
                <div className="border-b-2 border-dashed border-gray-300 h-8 w-full mt-2"></div>
              </div>
            </div>

          </div>

          {/* Tlač */}
          <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-3 print:hidden">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-5 py-2.5 bg-brand-dark text-white text-sm font-semibold rounded-xl hover:bg-brand-gold hover:text-brand-dark transition-all"
            >
              <Printer size={16} />
              Vytlačiť formulár
            </button>
            <a
              href="mailto:info@orostone.sk?subject=Odst%C3%BApenie%20od%20zmluvy&body=Dobr%C3%BD%20de%C5%88%2C%0A%0AT%C3%BDmto%20oznamujem%2C%20%C5%BEe%20odst%C3%BApu%jem%20od%20zmluvy%20o%20k%C3%BApe%20tovaru%3A%0A%0A%C4%8C%C3%ADslo%20objedn%C3%A1vky%3A%20%0APopis%20tovaru%3A%20%0AD%C3%A1tum%20objedn%C3%A1nia%3A%20%0AD%C3%A1tum%20prevzatia%3A%20%0AMeno%20a%20priezvisko%3A%20%0AAdresa%3A%20%0AIBAN%3A%20"
              className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 text-brand-dark text-sm font-semibold rounded-xl hover:border-brand-dark transition-all"
            >
              Odoslať e-mailom
            </a>
          </div>

        </motion.div>

        {/* Info o lehote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-orostone shadow-sm p-6 mt-6"
        >
          <h3 className="font-bold text-brand-dark mb-3 text-sm uppercase tracking-wider">Dôležité informácie</h3>
          <ul className="space-y-2 text-sm text-gray-600 leading-relaxed">
            <li>• Lehota na odstúpenie je <strong>14 dní</strong> od prevzatia tovaru.</li>
            <li>• Tovar musí byť vrátený nepoužitý, nepoškodený, v pôvodnom obale.</li>
            <li>• Náklady na vrátenie tovaru znáša spotrebiteľ.</li>
            <li>• Orostone vráti platbu vrátane nákladov na doručenie (najlacnejší spôsob) do <strong>14 dní</strong> od doručenia oznámenia o odstúpení, nie skôr ako po prevzatí vráteného tovaru.</li>
            <li>• Právo na odstúpenie sa nevzťahuje na tovar zhotovený podľa osobitných požiadaviek.</li>
          </ul>
          <p className="mt-4 text-xs text-gray-400">
            Podľa § 7 zákona č. 102/2014 Z.z. o ochrane spotrebiteľa pri predaji tovaru na základe zmluvy uzavretej na diaľku.
          </p>
        </motion.div>

        {/* Späť */}
        <div className="mt-8 flex gap-4 print:hidden">
          <Link
            to="/reklamacie"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-dark transition-colors"
          >
            <ArrowLeft size={14} />
            Reklamácie a vrátenie
          </Link>
          <Link
            to="/vop"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-dark transition-colors"
          >
            <ArrowLeft size={14} />
            Obchodné podmienky
          </Link>
        </div>

      </div>
    </div>
  );
};
