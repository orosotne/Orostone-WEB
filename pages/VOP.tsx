import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SEOHead } from '../components/UI/SEOHead';

const Section = ({ id, number, title, children }: { id: string; number: string; title: string; children: React.ReactNode }) => (
  <motion.section
    id={id}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="bg-white rounded-orostone p-8 shadow-sm scroll-mt-[72px] lg:scroll-mt-[128px]"
  >
    <div className="flex items-start gap-4 mb-6">
      <div className="w-12 h-12 bg-brand-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
        <span className="text-brand-gold font-semibold text-sm">{number}</span>
      </div>
      <h2 className="text-xl md:text-2xl font-sans font-bold text-brand-dark pt-2">{title}</h2>
    </div>
    <div className="text-gray-600 leading-relaxed space-y-4 pl-[52px]">
      {children}
    </div>
  </motion.section>
);

const SubSection = ({ number, children, highlight = false }: { number: string; children: React.ReactNode; highlight?: boolean }) => (
  <div className={`flex gap-3 ${highlight ? 'bg-amber-50 -mx-4 px-4 py-3 border-l-4 border-brand-gold' : ''}`} style={highlight ? { borderRadius: 'var(--radius-card, 0)' } : {}}>
    <span className="font-semibold text-brand-gold min-w-[2.5rem]">{number}</span>
    <div className="flex-1">{children}</div>
  </div>
);

export const VOP = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#F9F9F7]">
      <SEOHead
        title="Všeobecné obchodné podmienky | OROSTONE E-Shop"
        description="Všeobecné obchodné podmienky e-shopu OROSTONE. Informácie o objednávke, platbe, doprave, reklamáciách a právach spotrebiteľa podľa zákona č. 108/2024 Z.z."
        canonical="https://orostone.sk/vop"
      />
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="font-sans text-brand-gold text-xs font-bold tracking-widest uppercase mb-4 block">
            Právne dokumenty • Obchodné podmienky
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold text-brand-dark mb-6">
            Všeobecné obchodné podmienky
          </h1>
          <p className="font-sans font-light text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Tieto všeobecné obchodné podmienky upravujú vzťahy medzi spoločnosťou Orostone s.r.o. a jej zákazníkmi pri predaji tovaru prostredníctvom webového sídla <a href="https://orostone.sk" className="text-brand-gold hover:underline">www.orostone.sk</a>, ako aj pri individuálnych objednávkach realizovaných mimo e-shopu.
          </p>
          <p className="font-sans text-sm text-gray-400 mt-4">Účinné od: 24. 3. 2026</p>
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
              { id: 'zakladne-ustanovenia', label: '1. Základné ustanovenia' },
              { id: 'tovar-vlastnosti', label: '2. Tovar a jeho vlastnosti' },
              { id: 'objednavka-zmluva', label: '3. Objednávka a uzatvorenie zmluvy' },
              { id: 'cena-platba', label: '4. Cena a platobné podmienky' },
              { id: 'dodanie-tovaru', label: '5. Dodanie Tovaru' },
              { id: 'prechod-nebezpecenstva', label: '6. Prechod nebezpečenstva škody' },
              { id: 'b2b-ustanovenia', label: '7. Individuálne a B2B objednávky' },
              { id: 'eshop-zmluva', label: '8. E-shop a zmluva na diaľku' },
              { id: 'odstupenie-zmluvy', label: '9. Odstúpenie od zmluvy' },
              { id: 'vady-reklamacie', label: '10. Vady a reklamácie' },
              { id: 'externe-sluzby', label: '11. Externé služby' },
              { id: 'obmedzenie-zodpovednosti', label: '12. Obmedzenie zodpovednosti' },
              { id: 'vyssia-moc', label: '13. Vyššia moc' },
              { id: 'riesenie-sporov', label: '14. Riešenie sporov' },
              { id: 'ochrana-udajov', label: '15. Ochrana osobných údajov' },
              { id: 'zaverecne-ustanovenia', label: '16. Záverečné ustanovenia' },
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
        <div className="space-y-8">

          {/* 1. Základné ustanovenia */}
          <Section id="zakladne-ustanovenia" number="1" title="Základné ustanovenia">
            <SubSection number="1.1">
              Predávajúcim je:
              <div className="bg-gray-50 rounded-orostone p-4 mt-3 font-medium">
                <p className="text-brand-dark">Orostone s.r.o.</p>
                <p>Landererova 8, 811 09 Bratislava – mestská časť Staré Mesto</p>
                <p>Slovenská republika</p>
                <p>IČO: 55 254 772</p>
                <p>DIČ: 2121930580</p>
                <p>IČ DPH: SK2121930580</p>
                <p className="text-sm text-gray-500 mt-2">Zapísaná v Obchodnom registri Mestského súdu Bratislava III, oddiel Sro, vložka č. 167404/B</p>
                <p className="mt-2">E-mail: <a href="mailto:info@orostone.sk" className="text-brand-gold hover:underline">info@orostone.sk</a></p>
                <p>Telefón: <a href="tel:+421917588738" className="text-brand-gold hover:underline">+421 917 588 738</a></p>
                <p>Web: <a href="https://orostone.sk" className="text-brand-gold hover:underline">www.orostone.sk</a></p>
              </div>
            </SubSection>
            <SubSection number="1.2">
              Tieto všeobecné obchodné podmienky (ďalej len „VOP") upravujú:
              <br />a) predaj tovaru prostredníctvom e-shopu na webovom sídle <a href="https://orostone.sk" className="text-brand-gold hover:underline">www.orostone.sk</a>,
              <br />b) predaj tovaru na základe individuálnej písomnej objednávky, cenovej ponuky alebo objednávkového formulára.
            </SubSection>
            <SubSection number="1.3">
              Kupujúcim je každá fyzická osoba alebo právnická osoba, ktorá uzatvorí s predávajúcim kúpnu zmluvu alebo odošle objednávku (ďalej len „Klient"). Klient, ktorý pri uzatváraní a plnení zmluvy nekoná v rámci predmetu svojej podnikateľskej činnosti, zamestnania alebo povolania, považuje sa za spotrebiteľa (ďalej len „Spotrebiteľ").
            </SubSection>
            <SubSection number="1.4">
              Spotrebiteľom v zmysle týchto VOP je fyzická osoba, ktorá pri uzatváraní a plnení zmluvy nekoná v rámci predmetu svojej obchodnej činnosti alebo inej podnikateľskej činnosti, zamestnania alebo povolania.
            </SubSection>
            <SubSection number="1.5">
              Ak je Klient podnikateľom, právnickou osobou alebo fyzickou osobou – podnikateľom, na zmluvný vzťah sa primerane použijú aj ustanovenia Obchodného zákonníka a osobitné ustanovenia týchto VOP pre B2B režim.
            </SubSection>
            <SubSection number="1.6" highlight>
              Tieto VOP sú neoddeliteľnou súčasťou každej objednávky, cenovej ponuky potvrdenej Klientom a každej kúpnej zmluvy, ak nebolo medzi stranami výslovne a písomne dohodnuté inak.
            </SubSection>
            <SubSection number="1.7">
              Ak je medzi predávajúcim a Klientom uzatvorená osobitná písomná dohoda, cenová ponuka alebo individuálne obchodné podmienky, majú prednosť pred týmito VOP.
            </SubSection>
            <SubSection number="1.8">
              Tieto VOP sa primárne vzťahujú na predaj s miestom dodania na území Slovenskej republiky. Dodanie mimo územia Slovenskej republiky je možné len na základe osobitnej dohody.
            </SubSection>
          </Section>

          {/* 2. Tovar a jeho vlastnosti */}
          <Section id="tovar-vlastnosti" number="2" title="Tovar a jeho vlastnosti">
            <SubSection number="2.1">
              Predmetom predaja sú najmä platne sinterovaného kameňa, dlaždice, obkladové materiály, ich vzorky a súvisiaci tovar ponúkaný predávajúcim (ďalej len „Tovar").
            </SubSection>
            <SubSection number="2.2" highlight>
              Klient berie na vedomie, že Tovar je materiál určený na <strong>ďalšie odborné spracovanie, manipuláciu a montáž</strong>, pričom vzhľadom na svoju povahu, hmotnosť, rozmery a spôsob použitia vyžaduje odbornú manipuláciu, odborné rezanie, odborné opracovanie a odbornú montáž.
            </SubSection>
            <SubSection number="2.3">
              Vyobrazenie Tovaru na webovom sídle, v katalógoch, na sociálnych sieťach, v reklamných materiáloch alebo vo vzorkovníkoch je informatívne. Predávajúci nezodpovedá za drobné rozdiely vo farbe, kresbe, štruktúre povrchu, lesku alebo inom vizuálnom prejave Tovaru spôsobené:
              <br />a) výrobným procesom,
              <br />b) charakterom materiálu,
              <br />c) rozdielnym zobrazením na monitoroch a mobilných zariadeniach,
              <br />d) rozdielom medzi vzorkou a celou platňou.
            </SubSection>
            <SubSection number="2.4" highlight>
              <strong>Vzorka vs. celá platňa:</strong> Vzorka Tovaru slúži len na orientačné posúdenie farby, štruktúry a povrchu. Vzorka nemusí zobrazovať celý priebeh kresby, žilovania, opakovanie dekoru ani všetky vizuálne vlastnosti celej platne. Predávajúci nenesie zodpovednosť za rozdiely medzi vzorkou a dodanou platňou, ktoré sú dôsledkom prirodzenej variability materiálu.
            </SubSection>
            <SubSection number="2.5">
              Ak nie je osobitne písomne dohodnuté inak, predávajúci negarantuje zhodu kresby viacerých platní, nadväznosť dekoru, tzv. bookmatch efekt ani iné špecifické estetické vlastnosti.
            </SubSection>
            <SubSection number="2.6">
              Rozmery, hrúbka, povrch, hmotnosť a ostatné parametre Tovaru sa posudzujú v rámci obvyklých výrobných a technických tolerancií výrobcu.
            </SubSection>
            <SubSection number="2.7">
              Predávajúci neposkytuje projektovú, architektonickú, statickú, stavebnú ani montážnu zodpovednosť za použitie Tovaru, pokiaľ takáto služba nebola osobitne písomne objednaná a písomne potvrdená.
            </SubSection>
            <SubSection number="2.8">
              Predávajúci nevykonáva montáž, rezanie ani opracovanie Tovaru, ak nie je písomne dohodnuté inak.
            </SubSection>
          </Section>

          {/* 3. Objednávka a uzatvorenie zmluvy */}
          <Section id="objednavka-zmluva" number="3" title="Objednávka a uzatvorenie zmluvy">
            <SubSection number="3.1">
              Klient môže objednať Tovar:
              <br />a) prostredníctvom e-shopu na <a href="https://orostone.sk" className="text-brand-gold hover:underline">www.orostone.sk</a>,
              <br />b) e-mailom,
              <br />c) na základe individuálnej cenovej ponuky alebo objednávkového formulára.
            </SubSection>
            <SubSection number="3.2">
              Objednávka Klienta musí obsahovať najmä identifikačné údaje Klienta, kontaktné údaje, presnú špecifikáciu Tovaru, množstvo, miesto dodania a prípadné osobitné požiadavky.
            </SubSection>
            <SubSection number="3.3">
              Odoslaná objednávka Klienta predstavuje návrh na uzatvorenie kúpnej zmluvy.
            </SubSection>
            <SubSection number="3.4" highlight>
              Kúpna zmluva je uzatvorená až okamihom, keď predávajúci objednávku <strong>výslovne potvrdí</strong>. Automatické potvrdenie o prijatí objednávky do systému sa nepovažuje za akceptáciu objednávky.
            </SubSection>
            <SubSection number="3.5">
              Predávajúci je oprávnený objednávku neprijať alebo zrušiť, najmä ak:
              <br />a) Tovar nie je dostupný,
              <br />b) došlo k zjavnej chybe v cene, technickom údaji alebo popise Tovaru,
              <br />c) Klient uviedol neúplné, nepravdivé alebo neoveriteľné údaje,
              <br />d) Klient v minulosti porušil svoje povinnosti voči predávajúcemu,
              <br />e) predávajúci má dôvodné pochybnosti o serióznosti objednávky.
            </SubSection>
            <SubSection number="3.6">
              Klient zodpovedá za správnosť a úplnosť údajov uvedených v objednávke. Predávajúci nezodpovedá za škodu, omeškanie alebo nemožnosť dodania spôsobenú nesprávnymi údajmi Klienta.
            </SubSection>
            <SubSection number="3.7">
              Ak je objednávka individuálna, nadštandardná, neštandardných rozmerov, mimo bežného skladového sortimentu alebo viazaná na osobitné požiadavky Klienta, kúpna zmluva vzniká až okamihom výslovného písomného potvrdenia objednávky zo strany predávajúceho. Ak predávajúci požaduje zálohu, jej úhrada je podmienkou plnenia, ak nebolo písomne dohodnuté inak.
            </SubSection>
          </Section>

          {/* 4. Cena a platobné podmienky */}
          <Section id="cena-platba" number="4" title="Cena a platobné podmienky">
            <SubSection number="4.1">
              Všetky ceny sú uvádzané v mene EUR. Ak nie je uvedené inak, ceny v e-shope sú uvádzané vrátane DPH.
            </SubSection>
            <SubSection number="4.2">
              Cena Tovaru nezahŕňa cenu dopravy, vynášky, manipulácie, skladovania, opätovného doručenia ani iných doplnkových služieb, pokiaľ nie je výslovne uvedené inak.
            </SubSection>
            <SubSection number="4.3">
              Predávajúci je oprávnený požadovať úhradu zálohy, a to najmä pri individuálnych, nadštandardných alebo B2B objednávkach.
            </SubSection>
            <SubSection number="4.4" highlight>
              Predávajúci je oprávnený dodať Tovar až po <strong>úplnom zaplatení ceny alebo dohodnutej zálohy</strong>.
            </SubSection>
            <SubSection number="4.5">
              Platbu je možné vykonať spôsobmi uvedenými na webovom sídle alebo v zálohovej faktúre, najmä:
              <br />a) bankovým prevodom,
              <br />b) platbou kartou online,
              <br />c) iným spôsobom, ktorý predávajúci výslovne umožní.
            </SubSection>
            <SubSection number="4.6">
              Dobierka sa neposkytuje, ak predávajúci výslovne neurčí inak.
            </SubSection>
            <SubSection number="4.7">
              Splatnosť faktúr je uvedená na daňovom doklade. Ak nie je uvedené inak, splatnosť zálohovej faktúry je <strong>7 dní</strong> odo dňa jej vystavenia.
            </SubSection>
            <SubSection number="4.8">
              Za deň zaplatenia sa považuje deň pripísania celej sumy na bankový účet predávajúceho.
            </SubSection>
            <SubSection number="4.9">
              Predávajúci si vyhradzuje vlastnícke právo k Tovaru až do úplného zaplatenia celej kúpnej ceny a všetkých súvisiacich nárokov voči Klientovi.
            </SubSection>
            <SubSection number="4.10">
              Ak je Klient v omeškaní s úhradou, predávajúci je oprávnený pozastaviť ďalšie dodávky, nevydávať Tovar, jednostranne zmeniť termín dodania a uplatniť si zákonné úroky z omeškania a náklady spojené s vymáhaním pohľadávky.
            </SubSection>
          </Section>

          {/* 5. Dodanie Tovaru */}
          <Section id="dodanie-tovaru" number="5" title="Dodanie Tovaru">
            <SubSection number="5.1">
              Dodacia lehota závisí najmä od skladovej dostupnosti Tovaru, potvrdenia objednávky, úhrady ceny alebo zálohy a od logistických možností predávajúceho alebo zmluvného dopravcu.
            </SubSection>
            <SubSection number="5.2">
              Ak nie je pri konkrétnom Tovare alebo v potvrdení objednávky uvedené inak, dodacia lehota je orientačná. Pri Spotrebiteľovi je dodacia lehota uvedená pri Tovare, v objednávkovom procese alebo v potvrdení objednávky; ak nebola medzi stranami dohodnutá osobitná lehota dodania, predávajúci dodá Tovar bez zbytočného odkladu, <strong>najneskôr do 30 dní od uzavretia zmluvy</strong>.
            </SubSection>
            <SubSection number="5.3">
              Predávajúci nezodpovedá za omeškanie dodania spôsobené:
              <br />a) vyššou mocou,
              <br />b) omeškaním výrobcu alebo dodávateľa,
              <br />c) dopravnými obmedzeniami,
              <br />d) neposkytnutím súčinnosti zo strany Klienta,
              <br />e) nesprávnymi údajmi v objednávke.
            </SubSection>
            <SubSection number="5.4">
              Predávajúci zabezpečuje prepravu Tovaru prostredníctvom zmluvného dopravcu podľa vlastného výberu. Podrobnosti o spôsobe, rozsahu a cenách dopravy sú uvedené na stránke{' '}
              <Link to="/doprava" className="text-brand-gold hover:underline">Doprava a platba</Link>.
            </SubSection>
            <SubSection number="5.5">
              Klient je povinný zabezpečiť, aby bolo miesto dodania prístupné pre doručovacie vozidlo a aby boli splnené podmienky bezpečného vyloženia Tovaru.
            </SubSection>
            <SubSection number="5.6" highlight>
              Ak si povaha Tovaru vyžaduje osobitnú manipuláciu, techniku, zdvíhacie zariadenie, viac osôb na prevzatie alebo iný špeciálny režim, <strong>Klient je povinný zabezpečiť potrebnú súčinnosť</strong>, ak nebolo písomne dohodnuté, že ju zabezpečí predávajúci.
            </SubSection>
            <SubSection number="5.7">
              <strong>Štandardná doprava zahŕňa doručenie Tovaru na prízemie, k vozidlu alebo na miesto obvykle dostupné pre nákladné vozidlo.</strong> Vynáška, vykladanie na poschodie, presun do interiéru alebo iná nadštandardná manipulácia nie sú súčasťou štandardnej dopravy, ak nebolo písomne dohodnuté inak.
            </SubSection>
            <SubSection number="5.8">
              Ak sa dodanie alebo odovzdanie Tovaru neuskutoční z dôvodov na strane Klienta, najmä pre jeho neprítomnosť, neprístupnosť miesta dodania, nezabezpečenie prevzatia alebo nezabezpečenie potrebnej manipulácie, predávajúci je oprávnený požadovať:
              <br />a) náhradu skutočne vzniknutých nákladov na márny výjazd,
              <br />b) náhradu nákladov na opätovné doručenie,
              <br />c) primerané náklady na skladovanie Tovaru.
            </SubSection>
            <SubSection number="5.9">
              Pri Spotrebiteľovi sa náhrada podľa bodu 5.8 uplatní len v rozsahu skutočne, primerane a preukázateľne vzniknutých nákladov.
            </SubSection>
          </Section>

          {/* 6. Prechod nebezpečenstva škody a prevzatie Tovaru */}
          <Section id="prechod-nebezpecenstva" number="6" title="Prechod nebezpečenstva škody a prevzatie Tovaru">
            <SubSection number="6.1">
              Pri Spotrebiteľovi prechádza nebezpečenstvo škody na Tovare okamihom, keď Spotrebiteľ alebo ním určená tretia osoba, iná ako dopravca, prevezme Tovar.
            </SubSection>
            <SubSection number="6.2">
              Ak si Spotrebiteľ zabezpečí prepravu sám a nejde o dopravcu ponúknutého predávajúcim, nebezpečenstvo škody na Tovare prechádza odovzdaním Tovaru tomuto dopravcovi.
            </SubSection>
            <SubSection number="6.3">
              Pri Klientovi – podnikateľovi prechádza nebezpečenstvo škody na Tovare okamihom jeho odovzdania prvému dopravcovi alebo okamihom, keď si Klient Tovar prevezme, podľa toho, čo nastane skôr.
            </SubSection>
            <SubSection number="6.4" highlight>
              Klient je povinný pri prevzatí Tovaru bezodkladne skontrolovať:
              <br />a) neporušenosť obalu zásielky,
              <br />b) množstvo a druh dodaného Tovaru podľa dodacieho listu,
              <br />c) zjavné vady a poškodenia Tovaru.
            </SubSection>
            <SubSection number="6.5">
              Ak je pri prevzatí zistené zjavné poškodenie zásielky alebo Tovaru, Klient je povinný túto skutočnosť bezodkladne vyznačiť v dodacom liste alebo inom prepravnom doklade a bezodkladne o tom informovať predávajúceho.
            </SubSection>
            <SubSection number="6.6" highlight>
              Klient je povinný <strong>pred akýmkoľvek rezaním, montážou, opracovaním alebo iným zásahom do Tovaru</strong> vykonať dôkladnú kontrolu Tovaru, najmä kontrolu rozmeru, dekoru, odtieňa, povrchu a zjavných vád.
            </SubSection>
            <SubSection number="6.7">
              Po rezaní, opracovaní, montáži alebo inom zásahu do Tovaru <strong>nemožno úspešne uplatňovať reklamáciu</strong> tých vlastností alebo vád, ktoré boli zjavné alebo zistiteľné pri primeranej kontrole pred spracovaním Tovaru.
            </SubSection>
          </Section>

          {/* 7. Osobitné ustanovenia pre individuálne a B2B objednávky */}
          <Section id="b2b-ustanovenia" number="7" title="Osobitné ustanovenia pre individuálne a B2B objednávky">
            <SubSection number="7.1">
              Pri individuálnych objednávkach, zákazkách mimo bežného skladového sortimentu, špeciálnych povrchoch, neštandardných množstvách alebo Tovare zabezpečovanom osobitne pre Klienta je predávajúci oprávnený požadovať zálohu až do výšky <strong>100 % ceny</strong>.
            </SubSection>
            <SubSection number="7.2">
              Pri Klientovi – podnikateľovi je predávajúci v prípade zrušenia individuálnej objednávky po jej potvrdení oprávnený započítať prijatú zálohu na preukázateľne vzniknuté náklady, najmä na zabezpečenie Tovaru, rezerváciu výroby alebo skladových zásob, dopravu, balenie, skladovanie a administratívne spracovanie objednávky. Ak preukázateľná škoda alebo náklady presahujú výšku prijatej zálohy, predávajúci je oprávnený požadovať aj náhradu škody v prevyšujúcej časti.
            </SubSection>
            <SubSection number="7.3" highlight>
              Pri Spotrebiteľovi sa zrušenie individuálnej objednávky, vrátenie zálohy a právo na odstúpenie od zmluvy spravujú kogentnými ustanoveniami právnych predpisov. Ak ide o Tovar vyrobený podľa osobitných požiadaviek Spotrebiteľa, Tovar vyrobený na mieru alebo Tovar zabezpečovaný osobitne pre konkrétneho Spotrebiteľa, predávajúci je oprávnený odmietnuť storno objednávky alebo vrátenie Tovaru v rozsahu pripustenom zákonom.
            </SubSection>
            <SubSection number="7.4">
              Ak Klient – podnikateľ mešká s prevzatím Tovaru viac ako 5 pracovných dní od dohodnutého termínu, predávajúci je oprávnený účtovať primerané skladné, náklady ďalšej manipulácie a ďalšie preukázateľne vzniknuté náklady súvisiace s omeškaným prevzatím.
            </SubSection>
          </Section>

          {/* 8. E-shop a zmluva uzatvorená na diaľku */}
          <Section id="eshop-zmluva" number="8" title="E-shop a zmluva uzatvorená na diaľku">
            <SubSection number="8.1">
              Predaj prostredníctvom e-shopu sa uskutočňuje ako zmluva uzatvorená na diaľku v zmysle zákona č. 108/2024 Z.z. o ochrane spotrebiteľa.
            </SubSection>
            <SubSection number="8.2">
              Pred odoslaním objednávky je Klient povinný oboznámiť sa s obsahom objednávky, cenou, nákladmi na dopravu a týmito VOP.
            </SubSection>
            <SubSection number="8.3" highlight>
              Objednávka uskutočnená prostredníctvom e-shopu predstavuje návrh na uzatvorenie kúpnej zmluvy. <strong>Klient pred odoslaním objednávky potvrdzuje, že berie na vedomie, že odoslanie objednávky je spojené s povinnosťou platby.</strong> Kúpna zmluva je uzavretá až potvrdením objednávky zo strany predávajúceho.
            </SubSection>
            <SubSection number="8.4">
              Predávajúci je povinný poskytnúť Spotrebiteľovi pred odoslaním objednávky najmä informácie o:
              <br />a) totožnosti predávajúceho,
              <br />b) hlavných vlastnostiach Tovaru,
              <br />c) celkovej cene Tovaru vrátane DPH a nákladov na dopravu,
              <br />d) podmienkach, lehote a postupe na uplatnenie práva na odstúpenie od zmluvy,
              <br />e) skutočnosti, že Spotrebiteľ znáša náklady na vrátenie Tovaru.
            </SubSection>
            <SubSection number="8.5">
              Predávajúci zašle Spotrebiteľovi potvrdenie o uzatvorení zmluvy najneskôr pri dodaní Tovaru. Toto potvrdenie obsahuje úplné informácie podľa § 17 zákona č. 108/2024 Z.z., vrátane odkazu na tieto VOP.
            </SubSection>
            <SubSection number="8.6">
              Predávajúci uchováva uzatvorenú zmluvu v elektronickej podobe. Zmluva nie je prístupná tretím osobám.
            </SubSection>
          </Section>

          {/* 9. Odstúpenie od zmluvy Spotrebiteľom pri nákupe na diaľku */}
          <Section id="odstupenie-zmluvy" number="9" title="Odstúpenie od zmluvy Spotrebiteľom pri nákupe na diaľku">
            <SubSection number="9.1" highlight>
              Spotrebiteľ má právo odstúpiť od zmluvy uzatvorenej na diaľku <strong>bez uvedenia dôvodu do 14 dní</strong> odo dňa prevzatia Tovaru.
            </SubSection>
            <SubSection number="9.2">
              Spotrebiteľ môže odstúpenie od zmluvy zaslať:
              <br />a) e-mailom na adresu <a href="mailto:info@orostone.sk" className="text-brand-gold hover:underline">info@orostone.sk</a>,
              <br />b) poštou na adresu sídla predávajúceho,
              <br />c) použitím vzorového formulára na odstúpenie od zmluvy zverejneného na webovom sídle predávajúceho — <Link to="/odstupenie-od-zmluvy" className="text-brand-gold hover:underline">Formulár na odstúpenie od zmluvy</Link>.
            </SubSection>
            <SubSection number="9.3">
              Spotrebiteľ je povinný najneskôr do 14 dní odo dňa odstúpenia od zmluvy zaslať Tovar späť alebo ho odovzdať predávajúcemu, ak predávajúci nenavrhne jeho osobné vyzdvihnutie.
            </SubSection>
            <SubSection number="9.4" highlight>
              <strong>Náklady na vrátenie Tovaru znáša Spotrebiteľ</strong>, vrátane priamych nákladov na vrátenie Tovaru. Keďže Tovar vzhľadom na svoju povahu, hmotnosť a rozmery nemožno spravidla vrátiť prostredníctvom bežnej poštovej služby, priame náklady na jeho vrátenie prepravou sa spravidla pohybujú v rozmedzí od <strong>150 € do 350 € s DPH</strong> v závislosti od miesta vyzdvihnutia, počtu kusov a spôsobu prepravy. Presná výška týchto nákladov bude Spotrebiteľovi zobrazená alebo oznámená najneskôr pred odoslaním záväznej objednávky, ak sa konkrétny Tovar vzhľadom na svoju povahu a spôsob dodania riadi individuálnym dopravným režimom.
            </SubSection>
            <SubSection number="9.5">
              Predávajúci vráti Spotrebiteľovi všetky platby, ktoré od neho prijal na základe zmluvy alebo v súvislosti s ňou, vrátane nákladov na dodanie v rozsahu najlacnejšieho bežného spôsobu dodania ponúkaného predávajúcim, a to bez zbytočného odkladu, najneskôr do 14 dní odo dňa doručenia oznámenia o odstúpení od zmluvy.
            </SubSection>
            <SubSection number="9.6">
              Predávajúci nie je povinný vrátiť platby podľa bodu 9.5 skôr, ako mu bude Tovar doručený späť alebo kým Spotrebiteľ nepreukáže odoslanie Tovaru späť, podľa toho, čo nastane skôr.
            </SubSection>
            <SubSection number="9.7">
              Spotrebiteľ zodpovedá len za zníženie hodnoty Tovaru, ktoré vzniklo v dôsledku takého zaobchádzania s Tovarom, ktoré je nad rámec zaobchádzania potrebného na zistenie vlastností a funkčnosti Tovaru.
            </SubSection>
            <SubSection number="9.8" highlight>
              <strong>Výnimky z práva na odstúpenie:</strong> Spotrebiteľ nemá právo odstúpiť od zmluvy, ak ide o:
              <br />a) Tovar vyrobený podľa osobitných požiadaviek Spotrebiteľa,
              <br />b) Tovar vyrobený na mieru alebo upravený pre konkrétneho Spotrebiteľa,
              <br />c) Tovar, ktorý bol po dodaní nenávratne zmiešaný s iným tovarom.
            </SubSection>
            <SubSection number="9.9">
              Právo Spotrebiteľa na odstúpenie od zmluvy sa riadi zákonom č. 108/2024 Z.z. o ochrane spotrebiteľa.
            </SubSection>
          </Section>

          {/* 10. Zodpovednosť za vady a reklamácie */}
          <Section id="vady-reklamacie" number="10" title="Zodpovednosť za vady a reklamácie">
            <SubSection number="10.1">
              Predávajúci zodpovedá za vady, ktoré má Tovar pri prevzatí, a za vady, ktoré sa prejavia v zákonnej dobe zodpovednosti za vady.
            </SubSection>
            <SubSection number="10.2" highlight>
              Predávajúci <strong>nezodpovedá</strong> za vady alebo poškodenia spôsobené najmä:
              <br />a) neodbornou manipuláciou,
              <br />b) neodborným rezaním, opracovaním alebo montážou,
              <br />c) použitím nevhodných montážnych postupov, podkladov, lepidiel, náradia alebo technológie,
              <br />d) mechanickým poškodením po prevzatí Tovaru,
              <br />e) používaním v rozpore s účelom Tovaru alebo technickými odporúčaniami výrobcu,
              <br />f) zásahom tretej osoby,
              <br />g) prirodzenými, obvyklými alebo technologicky podmienenými rozdielmi vo farbe, kresbe, žilovaní, štruktúre alebo povrchu,
              <br />h) vadou alebo nevhodnosťou podkladu, stavby alebo priestoru, do ktorého bol Tovar osadený,
              <br />i) tým, že Klient spracoval, narezal alebo namontoval Tovar napriek tomu, že vada alebo nesúlad boli zjavné alebo zistiteľné pred spracovaním.
            </SubSection>
            <SubSection number="10.3">
              Klient je povinný vadu vytknúť bez zbytočného odkladu po jej zistení. Klient – podnikateľ je povinný prezrieť Tovar s odbornou starostlivosťou bezodkladne po jeho prevzatí a zjavné vady vytknúť bezodkladne, najneskôr pri prevzatí Tovaru alebo bezprostredne po ňom; skryté vady je povinný vytknúť bez zbytočného odkladu po ich zistení. Pri Spotrebiteľovi sa práva zo zodpovednosti za vady spravujú kogentnými ustanoveniami právnych predpisov; tým nie je dotknutá povinnosť Spotrebiteľa vytknúť vadu bez zbytočného odkladu po jej zistení.
            </SubSection>
            <SubSection number="10.4">
              Reklamáciu vady je potrebné uplatniť písomne, najmä e-mailom na <a href="mailto:info@orostone.sk" className="text-brand-gold hover:underline">info@orostone.sk</a>, a uviesť:
              <br />a) identifikáciu objednávky alebo faktúry,
              <br />b) popis vady,
              <br />c) dátum zistenia vady,
              <br />d) fotodokumentáciu alebo inú primeranú dokumentáciu, ak je to vzhľadom na povahu vady možné.
            </SubSection>
            <SubSection number="10.5">
              Predávajúci je oprávnený požadovať doplnenie informácií, fotodokumentácie alebo obhliadku Tovaru, ak je to potrebné na posúdenie reklamácie.
            </SubSection>
            <SubSection number="10.6" highlight>
              Ak ide o Spotrebiteľa, predávajúci poskytne <strong>bezodkladne po vytknutí vady písomné potvrdenie o vytknutí vady</strong> a uvedie primeranú lehotu, v ktorej vadu odstráni alebo vybaví uplatnené právo zo zodpovednosti za vady. Táto lehota <strong>nesmie presiahnuť 30 dní</strong> odo dňa vytknutia vady, ak dlhšia lehota nie je odôvodnená objektívnym dôvodom, ktorý predávajúci nemôže ovplyvniť.
            </SubSection>
            <SubSection number="10.7">
              Ak je na riadne posúdenie reklamácie potrebné sprístupnenie Tovaru, obhliadka na mieste, odobratie vzorky, súčinnosť realizátora alebo predloženie technických podkladov, Klient je povinný takúto primeranú súčinnosť poskytnúť.
            </SubSection>
            <SubSection number="10.8">
              Predávajúci nezodpovedá za škodu vzniknutú tým, že Klient pokračoval v používaní alebo spracovaní Tovaru napriek zistenej alebo oznámenej vade, alebo napriek tomu, že vada bola zrejmá.
            </SubSection>
            <SubSection number="10.9">
              Podrobný postup a praktické informácie k uplatneniu práv zo zodpovednosti za vady a k odstúpeniu od zmluvy sú dostupné na stránke{' '}
              <Link to="/reklamacie" className="text-brand-gold hover:underline">Reklamácie a vrátenie tovaru</Link>.
            </SubSection>
          </Section>

          {/* 11. Externé služby a tretie osoby */}
          <Section id="externe-sluzby" number="11" title="Externé služby a tretie osoby">
            <SubSection number="11.1">
              Predávajúci neposkytuje montážne služby, kamenárske práce ani stavebné práce, pokiaľ nebolo písomne dohodnuté inak.
            </SubSection>
            <SubSection number="11.2">
              Ak predávajúci Klientovi odporučí externého realizátora, kamenára, montážnika alebo inú tretiu osobu, ide výlučne o <strong>nezáväzné odporúčanie</strong>.
            </SubSection>
            <SubSection number="11.3" highlight>
              Predávajúci <strong>nezodpovedá</strong> za kvalitu práce, termíny, cenu, vady montáže, vady opracovania, škody ani akékoľvek iné nároky vyplývajúce zo služieb poskytnutých externým realizátorom.
            </SubSection>
            <SubSection number="11.4">
              Zmluvný vzťah medzi Klientom a externým realizátorom vzniká priamo medzi nimi a na ich vlastnú zodpovednosť.
            </SubSection>
          </Section>

          {/* 12. Obmedzenie zodpovednosti */}
          <Section id="obmedzenie-zodpovednosti" number="12" title="Obmedzenie zodpovednosti">
            <SubSection number="12.1">
              Predávajúci nezodpovedá za nepriame škody, následné škody, ušlý zisk, prestoje, stratu zákazky, náklady tretích osôb ani iné následné ekonomické ujmy, ak takáto zodpovednosť nemôže byť podľa kogentných právnych predpisov vylúčená.
            </SubSection>
            <SubSection number="12.2" highlight>
              Pri Klientovi – podnikateľovi sa celková zodpovednosť predávajúceho obmedzuje <strong>najviac do výšky ceny realizovanej objednávky</strong>, z ktorej škoda vznikla.
            </SubSection>
            <SubSection number="12.3">
              Nič v týchto VOP nevylučuje ani neobmedzuje práva Spotrebiteľa podľa kogentných ustanovení právnych predpisov.
            </SubSection>
          </Section>

          {/* 13. Vyššia moc */}
          <Section id="vyssia-moc" number="13" title="Vyššia moc">
            <SubSection number="13.1">
              Predávajúci nezodpovedá za porušenie povinnosti, ak bolo spôsobené okolnosťami vylučujúcimi zodpovednosť, najmä vyššou mocou, vojnovým stavom, štrajkom, pandémiou, výpadkom dopravy, výpadkom dodávateľského reťazca, zásahom orgánov verejnej moci alebo inou nepredvídateľnou a neodvrátiteľnou okolnosťou.
            </SubSection>
            <SubSection number="13.2">
              Po dobu trvania okolností podľa bodu 13.1 sa primerane predlžujú lehoty na plnenie.
            </SubSection>
          </Section>

          {/* 14. Alternatívne riešenie sporov a orgán dozoru */}
          <Section id="riesenie-sporov" number="14" title="Alternatívne riešenie sporov a orgán dozoru">
            <SubSection number="14.1">
              Spotrebiteľ má právo obrátiť sa na predávajúceho so žiadosťou o nápravu, ak nie je spokojný so spôsobom, ktorým predávajúci vybavil jeho reklamáciu alebo ak sa domnieva, že predávajúci porušil jeho práva.
            </SubSection>
            <SubSection number="14.2">
              Ak predávajúci na žiadosť Spotrebiteľa odpovie zamietavo alebo na ňu neodpovie do 30 dní odo dňa jej odoslania, Spotrebiteľ má právo podať návrh na začatie alternatívneho riešenia sporu (ďalej len „ARS") príslušnému subjektu ARS. Návrh na začatie ARS sa podáva písomne na adresu subjektu ARS alebo prostredníctvom jeho webového sídla.
            </SubSection>
            <SubSection number="14.3">
              Subjektom alternatívneho riešenia sporov je najmä Slovenská obchodná inšpekcia alebo iný oprávnený subjekt zapísaný v zozname subjektov alternatívneho riešenia sporov.
            </SubSection>
            <SubSection number="14.4" highlight>
              <strong>Orgánom dozoru</strong> je:
              <div className="mt-2">
                <p className="font-medium text-brand-dark">Slovenská obchodná inšpekcia (SOI)</p>
                <p>Inšpektorát SOI pre Bratislavský kraj</p>
                <p>Bajkalská 21/A, 827 99 Bratislava</p>
                <a href="https://www.soi.sk" target="_blank" rel="noopener noreferrer" className="text-brand-gold hover:underline">www.soi.sk</a>
              </div>
            </SubSection>
          </Section>

          {/* 15. Ochrana osobných údajov */}
          <Section id="ochrana-udajov" number="15" title="Ochrana osobných údajov">
            <SubSection number="15.1">
              Informácie o spracúvaní osobných údajov sú uvedené v samostatnom dokumente{' '}
              <Link to="/ochrana-sukromia" className="text-brand-gold hover:underline">
                Zásady ochrany osobných údajov
              </Link>{' '}
              zverejnenom na webovom sídle predávajúceho. Informácie o používaní cookies a podobných technológií sú uvedené v{' '}
              <Link to="/cookies" className="text-brand-gold hover:underline">Zásadách používania cookies</Link>.
            </SubSection>
          </Section>

          {/* 16. Záverečné ustanovenia */}
          <Section id="zaverecne-ustanovenia" number="16" title="Záverečné ustanovenia">
            <SubSection number="16.1">
              Právne vzťahy neupravené týmito VOP sa riadia príslušnými ustanoveniami právneho poriadku Slovenskej republiky.
            </SubSection>
            <SubSection number="16.2" highlight>
              Na Spotrebiteľa sa vzťahujú kogentné ustanovenia právnych predpisov na ochranu spotrebiteľa. Ak je niektoré ustanovenie týchto VOP v rozpore s kogentným právnym predpisom, použije sa príslušný právny predpis; tým nie je dotknutá platnosť ostatných ustanovení VOP.
            </SubSection>
            <SubSection number="16.3">
              Ak sa niektoré ustanovenie týchto VOP ukáže ako neplatné alebo nevymáhateľné, nemá to vplyv na platnosť a účinnosť ostatných ustanovení.
            </SubSection>
            <SubSection number="16.4">
              Predávajúci je oprávnený tieto VOP meniť alebo dopĺňať. Na zmluvný vzťah sa použije znenie VOP účinné v čase odoslania objednávky, ak kogentný právny predpis neustanovuje inak.
            </SubSection>
            <SubSection number="16.5">
              Tieto VOP nadobúdajú platnosť a účinnosť dňa <strong>24. 3. 2026</strong>.
            </SubSection>
          </Section>

        </div>

        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 bg-white rounded-orostone p-6 shadow-sm text-center"
        >
          <p className="text-sm text-gray-500">
            Orostone s.r.o. • Landererova 8, 811 09 Bratislava • IČO: 55 254 772 • DIČ: 2121930580
          </p>
          <p className="text-xs text-gray-400 mt-2">
            V Bratislave, 24. 3. 2026 — JUDr. Martin Miškeje, konateľ Orostone s.r.o.
          </p>
        </motion.div>

      </div>
    </div>
  );
};
