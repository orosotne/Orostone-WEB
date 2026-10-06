import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../components/UI/SEOHead';
import { FileText, ArrowLeft, Printer, Mail } from 'lucide-react';
import { Container, LEGAL_LINK, PageHero, Section } from '../components/Design';

const inputClass = 'w-full border-b-2 border-dashed border-brand-dark/25 bg-transparent py-1.5 text-sm text-brand-dark outline-none focus:border-brand-dark transition-colors print:border-solid print:border-gray-400';
const groupLabel = 'text-os-eyebrow uppercase text-brand-muted';

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
    <div>
      <SEOHead
        title="Formulár na odstúpenie od zmluvy | OROSTONE"
        description="Vzorový formulár na odstúpenie od kúpnej zmluvy uzavretej na diaľku podľa zákona č. 108/2024 Z.z. o ochrane spotrebiteľa. OROSTONE e-shop."
        canonical="https://orostone.sk/odstupenie-od-zmluvy"
        noindex={false}
      />
      <div className="print:hidden">
        <PageHero
          eyebrow="Práva spotrebiteľa • Zákon č. 108/2024 Z.z."
          title="Formulár na odstúpenie od zmluvy"
          lead={
            <>
              Vyplňte formulár priamo na tejto stránke, vytlačte ho, podpíšte a zašlite e-mailom na{' '}
              <a href="mailto:info@orostone.sk" className={LEGAL_LINK}>info@orostone.sk</a>{' '}
              alebo poštou na adresu sídla spoločnosti.
            </>
          }
        />
      </div>

      <Section tone="chalk" className="!pt-0 print:!py-0">
      <Container className="print:px-0">
      <div className="max-w-[860px]">
        {/* Info box */}
        <div className="mb-8 rounded-r-[3px] border-l-2 border-brand-dark bg-brand-sand p-6 print:hidden">
          <p className="text-sm font-light leading-relaxed">
            <strong className="text-brand-dark">Ako postupovať:</strong> 1. Vyplňte všetky polia nižšie. 2. Kliknite na „Vytlačiť formulár". 3. Vytlačený formulár podpíšte. 4. Podpísaný formulár nám zašlite e-mailom (naskenovaný/odfotený) alebo poštou pred uplynutím 14-dňovej lehoty od prevzatia tovaru.
          </p>
        </div>

        {/* Formulár */}
        <div className="rounded-[3px] border border-brand-line bg-white p-6 sm:p-8 md:p-12 print:border-0 print:p-0">
          {/* Hlavička formulára */}
          <div className="mb-8 flex items-start gap-4 border-b border-brand-line pb-6">
            <div className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-full bg-brand-sand">
              <FileText size={22} strokeWidth={1.5} className="text-brand-dark" />
            </div>
            <div>
              <h2 className="mb-1 text-[1.25rem] font-semibold text-brand-dark">
                Oznámenie o odstúpení od zmluvy
              </h2>
              <p className="text-sm font-light text-brand-muted">
                Vzorový formulár podľa zákona č. 108/2024 Z.z. o ochrane spotrebiteľa
              </p>
            </div>
          </div>

          {/* Adresát */}
          <div className="mb-8">
            <p className={`${groupLabel} mb-3`}>Adresát (predávajúci)</p>
            <div className="rounded-[3px] bg-brand-sand p-5 text-sm font-light leading-relaxed">
              <p className="font-semibold text-brand-dark">Orostone s.r.o.</p>
              <p>Landererova 8, 811 09 Bratislava</p>
              <p>IČO: 55 254 772</p>
              <p>E-mail: <a href="mailto:info@orostone.sk" className={LEGAL_LINK}>info@orostone.sk</a></p>
              <p>Tel.: <a href="tel:+421917588738" className={LEGAL_LINK}>+421 917 588 738</a></p>
            </div>
          </div>

          {/* Obsah formulára */}
          <div className="space-y-6 text-sm leading-relaxed">

            <p className="text-base font-medium text-brand-dark">
              Týmto oznamujem, že odstupujem od zmluvy o kúpe tohto tovaru:
            </p>

            {/* Údaje spotrebiteľa */}
            <p className={`${groupLabel} mb-3 mt-6`}>Údaje spotrebiteľa</p>
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
            <p className={`${groupLabel} mb-3 mt-8`}>Údaje o tovare</p>
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
                <label className="font-medium text-brand-dark mb-1 block">Číslo faktúry <span className="font-normal text-brand-muted">(ak bolo vystavené)</span>:</label>
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
                <label className="font-medium text-brand-dark mb-1 block">Dôvod odstúpenia <span className="font-normal text-brand-muted">(nepovinné)</span>:</label>
                <textarea value={form.dovod} onChange={update('dovod')} rows={2} className="w-full resize-none rounded-[3px] border-2 border-dashed border-brand-dark/25 bg-transparent p-2.5 text-sm text-brand-dark outline-none transition-colors focus:border-brand-dark print:border-solid print:border-gray-400" />
              </div>
            </div>

            {/* Vrátenie platby */}
            <p className={`${groupLabel} mb-3 mt-8`}>Vrátenie platby</p>
            <div>
              <label className="font-medium text-brand-dark mb-1 block">Číslo bankového účtu (IBAN):</label>
              <input type="text" value={form.iban} onChange={update('iban')} placeholder="SK00 0000 0000 0000 0000 0000" className={inputClass} />
            </div>

            {/* Dátum a podpis */}
            <div className="mt-6 flex flex-col gap-8 border-t border-brand-line pt-4 break-inside-avoid sm:flex-row">
              <div className="flex-1">
                <p className="font-medium text-brand-dark mb-1">Dátum:</p>
                <p className="border-b-2 border-dashed border-brand-dark/25 py-1.5 text-sm print:border-solid print:border-gray-400">
                  {new Date().toLocaleDateString('sk-SK')}
                </p>
              </div>
              <div className="flex-1">
                <p className="font-medium text-brand-dark mb-1">Podpis spotrebiteľa:</p>
                <div className="mt-2 h-12 w-full border-b-2 border-dashed border-brand-dark/25 print:border-solid print:border-gray-400"></div>
                <p className="mt-1 text-xs text-brand-muted">Vytlačte formulár a podpíšte ho tu</p>
              </div>
            </div>

          </div>

          {/* Tlačidlá */}
          <div className="mt-8 flex flex-col gap-3 border-t border-brand-line pt-6 sm:flex-row print:hidden">
            <button
              onClick={() => window.print()}
              className="inline-flex min-h-[50px] items-center justify-center gap-2.5 rounded-[10px] bg-brand-dark px-6 text-[0.74rem] font-bold uppercase tracking-[0.12em] text-brand-light transition-colors hover:bg-[#333331]"
            >
              <Printer size={16} />
              Vytlačiť formulár
            </button>
            <a
              href={buildMailtoHref()}
              className="inline-flex min-h-[50px] items-center justify-center gap-2.5 rounded-[10px] border border-brand-dark px-6 text-[0.74rem] font-bold uppercase tracking-[0.12em] text-brand-dark no-underline transition-colors hover:bg-brand-dark/5"
            >
              <Mail size={16} />
              Odoslať e-mailom
            </a>
          </div>

        </div>

        {/* Info o lehote */}
        <div className="mt-8 border-t border-brand-line pt-8 print:hidden">
          <h3 className="mb-3 text-os-eyebrow uppercase text-brand-dark">Dôležité informácie</h3>
          <ul className="space-y-2 text-sm font-light leading-relaxed text-brand-dark/85">
            <li>• Spotrebiteľ môže odstúpiť od zmluvy do <strong>14 dní</strong> od prevzatia tovaru.</li>
            <li>• Tovar je potrebné zaslať späť najneskôr do 14 dní odo dňa odstúpenia od zmluvy.</li>
            <li>• Náklady na vrátenie tovaru znáša spotrebiteľ.</li>
            <li>• Veľkoformátové platne vzhľadom na svoju povahu, hmotnosť a rozmery nemožno spravidla vrátiť bežnou poštovou službou; vracajú sa primeranou prepravou.</li>
            <li>• Predpokladané priame náklady na vrátenie tovaru sa spravidla pohybujú v rozmedzí <strong>150 € až 350 € s DPH</strong> podľa miesta vyzdvihnutia, počtu kusov a spôsobu dopravy.</li>
            <li>• Spoločnosť Orostone vráti spotrebiteľovi platby najneskôr do <strong>14 dní</strong> od doručenia oznámenia o odstúpení od zmluvy, nie však skôr, ako jej bude tovar doručený späť alebo ako spotrebiteľ preukáže jeho odoslanie späť.</li>
            <li>• Právo na odstúpenie sa nevzťahuje na tovar vyrobený podľa osobitných požiadaviek spotrebiteľa, tovar vyrobený na mieru alebo upravený pre konkrétneho spotrebiteľa.</li>
          </ul>
          <p className="mt-4 text-xs text-brand-muted">
            Podľa zákona č. 108/2024 Z.z. o ochrane spotrebiteľa.
          </p>
          <p className="mt-3 text-xs text-brand-muted">
            Informácie o spracúvaní vašich osobných údajov nájdete v{' '}
            <Link to="/ochrana-sukromia" className={LEGAL_LINK}>Ochrane osobných údajov</Link>.
          </p>
        </div>

        {/* Späť */}
        <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2 print:hidden" aria-label="Navigácia">
          <Link
            to="/reklamacie"
            className="inline-flex min-h-[44px] items-center gap-2 text-sm font-medium text-brand-muted no-underline transition-colors hover:text-brand-dark"
          >
            <ArrowLeft size={14} />
            Reklamácie a vrátenie
          </Link>
          <Link
            to="/vop"
            className="inline-flex min-h-[44px] items-center gap-2 text-sm font-medium text-brand-muted no-underline transition-colors hover:text-brand-dark"
          >
            <ArrowLeft size={14} />
            Obchodné podmienky
          </Link>
        </div>

      </div>
      </Container>
      </Section>
    </div>
  );
};
