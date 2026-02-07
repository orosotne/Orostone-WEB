import React from 'react';
import { Shield, AlertTriangle, Package, Hammer, Phone, Mail, MapPin, CheckCircle, Download, Printer } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
  <motion.section variants={fadeIn} className="p-6 md:p-8 bg-white border border-gray-100 shadow-sm space-y-4" style={{ borderRadius: 'var(--radius-card, 0)' }}>
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-brand-gold/15 flex items-center justify-center" style={{ borderRadius: 'var(--radius-button, 0)' }}>
        {icon}
      </div>
      <h3 className="text-xl md:text-2xl font-sans font-bold text-brand-dark">{title}</h3>
    </div>
    <div className="text-gray-700 space-y-3 leading-relaxed text-sm md:text-base">
      {children}
    </div>
  </motion.section>
);

export const KeyFacts: React.FC = () => {
  const specs = [
    { label: 'Rozmer', value: '3200 mm × 1600 mm' },
    { label: 'Hrúbka', value: '12 mm' },
    { label: 'Povrchy', value: 'Lesklý • Matný • Polo-matný' },
    { label: 'Kolekcie', value: 'Bianco • Lusso • Marbelito • Marmo • Unita' },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#F9F9F7]">
      <div className="container mx-auto px-6 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-10 relative"
        >
          {/* Header Actions */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 no-print">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-2 bg-black text-white text-xs font-semibold tracking-widest uppercase" style={{ borderRadius: 'var(--radius-button, 0)' }}>
                Iba skladové platne bez úprav
              </div>
              <h1 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-sans font-bold text-brand-dark">Key facts & limitations</h1>
              <p className="mt-3 text-gray-600 text-lg leading-relaxed max-w-3xl">
                Stručný súhrn k sinterovanému kameňu Orostone® (skladové platne). Pri rozpore platia:
                <span className="font-semibold text-brand-dark"> (1) písomná dohoda</span>, <span className="font-semibold text-brand-dark">(2) TDS / Montážny manuál</span>,
                <span className="font-semibold text-brand-dark"> (3) VOP</span>.
              </p>
            </div>
            
            <div className="flex gap-3">
              <a
                href="/documents/Key facts_2026.pdf"
                download="Orostone_Key_Facts_2026.pdf"
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-gold text-brand-dark hover:bg-brand-dark hover:text-white transition-colors shadow-lg shadow-brand-gold/20 font-medium text-sm whitespace-nowrap"
                style={{ borderRadius: 'var(--radius-button, 0)' }}
              >
                <Download size={16} />
                Stiahnuť PDF
              </a>
              
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-brand-dark hover:bg-gray-50 transition-colors shadow-sm font-medium text-sm whitespace-nowrap"
                style={{ borderRadius: 'var(--radius-button, 0)' }}
              >
                <Printer size={16} />
                Tlačiť
              </button>
            </div>
          </div>

          {/* Print Only Header */}
          <div className="print-only-header hidden">
            <img src="/images/logo.png" alt="OROSTONE" className="print-logo-img" />
            <div className="text-right text-xs leading-tight">
              <p className="font-bold uppercase tracking-wider mb-1">Key Facts & Limitations</p>
              <p>Verzia 01/2026</p>
            </div>
          </div>
          
          {/* Print Intro Text */}
          <div className="print-only-header" style={{ border: 'none', marginBottom: '15px', paddingBottom: '0', display: 'none' }}>
             <p className="text-sm italic text-gray-600">
                Platí pre: Sinterovaný kameň Orostone® – iba skladové platne bez úprav.
             </p>
          </div>
        </motion.div>

        {/* Specs Grid */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="specs-container grid md:grid-cols-3 gap-4 mb-10"
        >
          {specs.map((item) => (
            <div key={item.label} className="specs-item p-4 bg-white border border-gray-100 shadow-sm" style={{ borderRadius: 'var(--radius-card, 0)' }}>
              <span className="specs-label">{item.label}</span>
              <span className="specs-value">{item.value}</span>
            </div>
          ))}
        </motion.div>

        {/* Content Grid - using CSS columns in print */}
        <div className="content-grid grid gap-6">
          <Section title="Čo materiál je" icon={<CheckCircle className="w-5 h-5 text-green-600" />}>
            <ul className="list-disc list-inside space-y-1">
              <li>Sinterovaný (spekaný) kameň – veľkoformátové platne pre odborné spracovanie a montáž.</li>
              <li>Neporézny; vhodný pre interiér (a podľa typu aj exteriér) pri dodržaní TDS.</li>
            </ul>
          </Section>

          <Section title="Čo materiál nie je" icon={<AlertTriangle className="w-5 h-5 text-amber-500" />}>
            <ul className="list-disc list-inside space-y-1">
              <li>Nie je "nezničiteľný" – poškodenie môže vzniknúť nárazom, pádom, nesprávnou manipuláciou alebo chybným opracovaním.</li>
              <li>Nie je služba zamerania, rezania ani montáže – platňa je polotovar; výsledok závisí od realizátora.</li>
              <li>Nie je garancia nulovej vizuálnej variability – dekor/odtieň/lesk sa môže líšiť od vzorky.</li>
            </ul>
          </Section>

          <Section title="Vizuálna variabilita (nie je vadou)" icon={<Shield className="w-5 h-5 text-brand-gold" />}>
            <ul className="list-disc list-inside space-y-1">
              <li>Rozdiely v kresbe, žilovaní, "mrakoch", odtieni a lesku/mate medzi šaržami a podľa smeru svetla.</li>
              <li>Bookmatch/continuity nie je garantovaný bez písomnej dohody.</li>
            </ul>
          </Section>

          <Section title="Kontrola pri prevzatí (do 24 h)" icon={<Package className="w-5 h-5 text-blue-600" />}>
            <ul className="list-disc list-inside space-y-1">
              <li>Skontrolovať zjavné poškodenie (praskliny, odštiepky, škrabance), počet kusov, označenie/šaržu, obal/uloženie.</li>
              <li>Poškodenie/nezrovnalosti zdokumentovať (foto + poznámka v prepravnom liste) a nahlásiť <strong>najneskôr do 24 hodín</strong>.</li>
            </ul>
          </Section>

          <Section title="Manipulácia a skladovanie" icon={<Package className="w-5 h-5 text-brand-dark" />}>
            <ul className="list-disc list-inside space-y-1">
              <li>Platne sú ťažké a krehké na hrane – používať vhodný rám/A-frame, odborná manipulácia.</li>
              <li>Nesprávne zdvíhanie, prehnutie, bodové podopretie alebo otras môže spôsobiť mikrotrhliny (neskôr prasknutie).</li>
            </ul>
          </Section>

          <Section title="Opracovanie a montáž (zodpovednosť realizátora)" icon={<Hammer className="w-5 h-5 text-rose-600" />}>
            <ul className="list-disc list-inside space-y-1">
              <li>Rezanie, brúsenie, výrezy, lepenie, podopretie, dilatácie: <strong>podľa TDS a montážneho manuálu</strong>.</li>
              <li>Vady z opracovania/montáže (výrezy, rohy, hrany, podopretie, dilatácie) nesie realizátor.</li>
              <li>Realizátor pred montážou platne vizuálne skontroluje; montážou potvrdzuje akceptáciu vzhľadu.</li>
            </ul>
          </Section>

          <Section title="Používanie a údržba – čo záruka typicky nekryje" icon={<AlertTriangle className="w-5 h-5 text-red-600" />}>
            <ul className="list-disc list-inside space-y-1">
              <li>Mechanické poškodenie po prevzatí (náraz, pád, odštiepenie hrany).</li>
              <li>Škrabance / stopy nad rámec bežného opotrebenia (najmä lesk).</li>
              <li>Poškodenie agresívnymi chemikáliami alebo abrazívnym čistením; tepelný šok.</li>
              <li>Postupujte vždy podľa dokumentu "Údržba & čistenie".</li>
            </ul>
          </Section>

          <Section title="Bezpečnosť pri opracovaní" icon={<Shield className="w-5 h-5 text-slate-600" />}>
            <ul className="list-disc list-inside space-y-1">
              <li>Pri dry-cut/grind vzniká prach – používať OOPP, odsávanie alebo mokré rezanie podľa interných BOZP pravidiel realizátora.</li>
            </ul>
          </Section>

          <Section title="Reklamácie – kontakt" icon={<Mail className="w-5 h-5 text-emerald-600" />}>
            <ul className="list-disc list-inside space-y-1">
              <li>Email: <a className="text-brand-dark underline" href="mailto:info@orostone.sk">info@orostone.sk</a></li>
              <li>Telefón: <a className="text-brand-dark" href="tel:+421917588738">+421 917 588 738</a></li>
              <li>Korešpondenčná adresa: SNP 113/1, 956 18 Bošany</li>
              <li>Uveďte: číslo objednávky, popis vady, fotodokumentáciu, šaržu/označenie platne a informáciu, či prebehlo opracovanie/montáž.</li>
            </ul>
          </Section>
        </div>

        {/* Footer/Disclaimer */}
        <div className="mt-6">
          <motion.section
            variants={fadeIn}
            className="p-6 md:p-8 bg-brand-dark text-white space-y-3 web-footer-section"
            style={{ borderRadius: 'var(--radius-card, 0)' }}
          >
            <p className="uppercase text-xs tracking-widest text-brand-gold font-semibold">Orostone, s.r.o.</p>
            <p>IČO: 55 254 772</p>
            <p>Zapísaná v OR Mestského súdu Bratislava III, Oddiel: Sro, Vložka: 167404/B</p>
            <p>Adresa sídla: Landererova 8, 811 09 Bratislava - Staré Mesto</p>
            <p className="text-gray-300 text-sm">
              Tento dokument je stručné zhrnutie. Pri rozpore platí: (1) individuálna písomná dohoda,
              (2) TDS / montážny manuál, (3) VOP.
            </p>
          </motion.section>

          {/* Print Footer */}
          <div className="print-footer hidden">
            <p>© Orostone, s.r.o. | IČO: 55 254 772 | Landererova 8, Bratislava | www.orostone.sk</p>
          </div>
        </div>
      </div>
    </div>
  );
};

