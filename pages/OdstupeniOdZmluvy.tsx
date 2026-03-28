import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SEOHead } from '../components/UI/SEOHead';
import { FileText, ArrowLeft, Printer, Mail } from 'lucide-react';

const inputClass = 'w-full border-b-2 border-dashed border-gray-300 bg-transparent py-1.5 text-sm text-brand-dark outline-none focus:border-brand-gold transition-colors print:border-solid print:border-gray-400';

/**
 * Vzorový formulár na odstúpenie od zmluvy
 * Podľa zákona č. 108/2024 Z.z. o ochrane spotrebiteľa
 */
export const OdstupeniOdZmluvy: React.FC = () => {
  const [form, setForm] = useState({
    meno: '',
    adresa: '',
    email: '',
    telefon: '',
    nazovTovaru: '',
    pocetKusov: '',
    cisloObjednavky: '',
    cisloFaktury: '',
    datumObjednania: '',
    datumPrevzatia: '',
    dovod: '',
    iban: '',
  });

  const update = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  const buildMailtoHref = () => {
    const subject = encodeURIComponent('Odstúpenie od zmluvy');
    const body = encodeURIComponent(
      `Dobrý deň,\n\nTýmto oznamujem, že odstupujem od zmluvy o kúpe tovaru:\n\n` +
      `— ÚDAJE O TOVARE —\n` +
      `Názov tovaru: ${form.nazovTovaru}\n` +
      `Počet kusov: ${form.pocetKusov}\n` +
      `Číslo objednávky: ${form.cisloObjednavky}\n` +
      `Číslo faktúry: ${form.cisloFaktury}\n` +
      `Dátum objednania: ${form.datumObjednania}\n` +
      `Dátum prevzatia tovaru: ${form.datumPrevzatia}\n\n` +
      `— MOJE ÚDAJE —\n` +
      `Meno a priezvisko: ${form.meno}\n` +
      `Adresa: ${form.adresa}\n` +
      `E-mail: ${form.email}\n` +
      `Telefón: ${form.telefon}\n\n` +
      `— VRÁTENIE PLATBY —\n` +
      `IBAN: ${form.iban}\n\n` +
      `— DÔVOD ODSTÚPENIA (nepovinné) —\n` +
      `${form.dovod}\n\n` +
      `S pozdravom,\n${form.meno}`
    );
    return `mailto:info@orostone.sk?subject=${subject}&body=${body}`;
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#F9F9F7]">
      <SEOHead
        title="Formulár na odstúpenie od zmluvy | OROSTONE"
        description="Vzorový formulár na odstúpenie od kúpnej zmluvy uzavretej na diaľku podľa zákona č. 108/2024 Z.z. o ochrane spotrebiteľa. OROSTONE e-shop."
        canonical="https://orostone.sk/odstupenie-od-zmluvy"
        noindex={false}
      />
      <div className="container mx-auto px-6 max-w-3xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 print:hidden"
        >
          <span className="font-sans text-brand-gold text-xs font-bold tracking-widest uppercase mb-4 block">
            Práva spotrebiteľa • Zákon č. 108/2024 Z.z.
          </span>
          <h1 className="text-3xl md:text-4xl font-sans font-bold text-brand-dark mb-4">
            Formulár na odstúpenie od zmluvy
          </h1>
          <p className="text-gray-500 font-light leading-relaxed max-w-2xl mx-auto">
            Vyplňte formulár priamo na tejto stránke, vytlačte ho, podpíšte a zašlite e-mailom na{' '}
            <a href="mailto:info@orostone.sk" className="text-brand-gold hover:underline font-medium">info@orostone.sk</a>{' '}
            alebo poštou na adresu sídla spoločnosti.
          </p>
        </motion.div>

        {/* Info box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-amber-50 border-l-4 border-brand-gold rounded-orostone p-6 mb-8 print:hidden"
        >
          <p className="text-sm text-gray-700 leading-relaxed">
            <strong className="text-brand-dark">Ako postupovať:</strong> 1. Vyplňte všetky polia nižšie. 2. Kliknite na „Vytlačiť formulár". 3. Vytlačený formulár podpíšte. 4. Podpísaný formulár nám zašlite e-mailom (naskenovaný/odfotený) alebo poštou pred uplynutím 14-dňovej lehoty od prevzatia tovaru.
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
                Vzorový formulár podľa zákona č. 108/2024 Z.z. o ochrane spotrebiteľa
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

            {/* Údaje spotrebiteľa */}
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-6 mb-3">Údaje spotrebiteľa</p>
            <div className="space-y-4 break-inside-avoid">
              <div>
                <label className="font-medium text-brand-dark mb-1 block">Meno a priezvisko:</label>
                <input type="text" value={form.meno} onChange={update('meno')} className={inputClass} />
              </div>
              <div>
                <label className="font-medium text-brand-dark mb-1 block">Adresa:</label>
                <input type="text" value={form.adresa} onChange={update('adresa')} className={inputClass} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-medium text-brand-dark mb-1 block">E-mail:</label>
                  <input type="email" value={form.email} onChange={update('email')} className={inputClass} />
                </div>
                <div>
                  <label className="font-medium text-brand-dark mb-1 block">Telefón:</label>
                  <input type="tel" value={form.telefon} onChange={update('telefon')} className={inputClass} />
                </div>
              </div>
            </div>

            {/* Údaje o tovare */}
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-8 mb-3">Údaje o tovare</p>
            <div className="space-y-4 break-inside-avoid">
              <div>
                <label className="font-medium text-brand-dark mb-1 block">Názov tovaru:</label>
                <input type="text" value={form.nazovTovaru} onChange={update('nazovTovaru')} className={inputClass} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-medium text-brand-dark mb-1 block">Počet kusov:</label>
                  <input type="text" value={form.pocetKusov} onChange={update('pocetKusov')} className={inputClass} />
                </div>
                <div>
                  <label className="font-medium text-brand-dark mb-1 block">Číslo objednávky:</label>
                  <input type="text" value={form.cisloObjednavky} onChange={update('cisloObjednavky')} className={inputClass} />
                </div>
              </div>
              <div>
                <label className="font-medium text-brand-dark mb-1 block">Číslo faktúry <span className="text-gray-400 font-normal">(ak bolo vystavené)</span>:</label>
                <input type="text" value={form.cisloFaktury} onChange={update('cisloFaktury')} className={inputClass} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-medium text-brand-dark mb-1 block">Dátum objednania:</label>
                  <input type="text" value={form.datumObjednania} onChange={update('datumObjednania')} placeholder="dd.mm.rrrr" className={inputClass} />
                </div>
                <div>
                  <label className="font-medium text-brand-dark mb-1 block">Dátum prevzatia tovaru:</label>
                  <input type="text" value={form.datumPrevzatia} onChange={update('datumPrevzatia')} placeholder="dd.mm.rrrr" className={inputClass} />
                </div>
              </div>
              <div>
                <label className="font-medium text-brand-dark mb-1 block">Dôvod odstúpenia <span className="text-gray-400 font-normal">(nepovinné)</span>:</label>
                <textarea value={form.dovod} onChange={update('dovod')} rows={2} className="w-full border-2 border-dashed border-gray-300 bg-transparent rounded-lg p-2.5 text-sm text-brand-dark outline-none focus:border-brand-gold transition-colors resize-none print:border-solid print:border-gray-400" />
              </div>
            </div>

            {/* Vrátenie platby */}
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-8 mb-3">Vrátenie platby</p>
            <div>
              <label className="font-medium text-brand-dark mb-1 block">Číslo bankového účtu (IBAN):</label>
              <input type="text" value={form.iban} onChange={update('iban')} placeholder="SK00 0000 0000 0000 0000 0000" className={inputClass} />
            </div>

            {/* Dátum a podpis */}
            <div className="flex flex-col sm:flex-row gap-8 pt-4 border-t border-gray-100 mt-6 break-inside-avoid">
              <div className="flex-1">
                <p className="font-medium text-brand-dark mb-1">Dátum:</p>
                <p className="text-sm text-gray-600 py-1.5 border-b-2 border-dashed border-gray-300 print:border-solid print:border-gray-400">
                  {new Date().toLocaleDateString('sk-SK')}
                </p>
              </div>
              <div className="flex-1">
                <p className="font-medium text-brand-dark mb-1">Podpis spotrebiteľa:</p>
                <div className="border-b-2 border-dashed border-gray-300 h-12 w-full mt-2 print:border-solid print:border-gray-400"></div>
                <p className="text-xs text-gray-400 mt-1">Vytlačte formulár a podpíšte ho tu</p>
              </div>
            </div>

          </div>

          {/* Tlačidlá */}
          <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-3 print:hidden">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-5 py-2.5 bg-brand-dark text-white text-sm font-semibold rounded-xl hover:bg-brand-gold hover:text-brand-dark transition-all"
            >
              <Printer size={16} />
              Vytlačiť formulár
            </button>
            <a
              href={buildMailtoHref()}
              className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 text-brand-dark text-sm font-semibold rounded-xl hover:border-brand-dark transition-all"
            >
              <Mail size={16} />
              Odoslať e-mailom
            </a>
          </div>

        </motion.div>

        {/* Info o lehote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-orostone shadow-sm p-6 mt-6 print:hidden"
        >
          <h3 className="font-bold text-brand-dark mb-3 text-sm uppercase tracking-wider">Dôležité informácie</h3>
          <ul className="space-y-2 text-sm text-gray-600 leading-relaxed">
            <li>• Spotrebiteľ môže odstúpiť od zmluvy do <strong>14 dní</strong> od prevzatia tovaru.</li>
            <li>• Tovar je potrebné zaslať späť najneskôr do 14 dní odo dňa odstúpenia od zmluvy.</li>
            <li>• Náklady na vrátenie tovaru znáša spotrebiteľ.</li>
            <li>• Veľkoformátové platne vzhľadom na svoju povahu, hmotnosť a rozmery nemožno spravidla vrátiť bežnou poštovou službou; vracajú sa primeranou prepravou.</li>
            <li>• Predpokladané priame náklady na vrátenie tovaru sa spravidla pohybujú v rozmedzí <strong>150 € až 350 € s DPH</strong> podľa miesta vyzdvihnutia, počtu kusov a spôsobu dopravy.</li>
            <li>• Spoločnosť Orostone vráti spotrebiteľovi platby najneskôr do <strong>14 dní</strong> od doručenia oznámenia o odstúpení od zmluvy, nie však skôr, ako jej bude tovar doručený späť alebo ako spotrebiteľ preukáže jeho odoslanie späť.</li>
            <li>• Právo na odstúpenie sa nevzťahuje na tovar vyrobený podľa osobitných požiadaviek spotrebiteľa, tovar vyrobený na mieru alebo upravený pre konkrétneho spotrebiteľa.</li>
          </ul>
          <p className="mt-4 text-xs text-gray-400">
            Podľa zákona č. 108/2024 Z.z. o ochrane spotrebiteľa.
          </p>
          <p className="mt-3 text-xs text-gray-400">
            Informácie o spracúvaní vašich osobných údajov nájdete v{' '}
            <Link to="/ochrana-sukromia" className="text-brand-gold hover:underline">Ochrane osobných údajov</Link>.
          </p>
        </motion.div>

        {/* Späť */}
        <div className="mt-8 flex gap-4 print:hidden" aria-label="Navigácia">
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
