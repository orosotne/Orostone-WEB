import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Section = ({ id, number, title, children }: { id: string; number: string; title: string; children: React.ReactNode }) => (
  <motion.section
    id={id}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="bg-white rounded-orostone p-8 shadow-sm"
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
            Tieto všeobecné obchodné podmienky upravujú vzťahy medzi spoločnosťou Orostone, s.r.o. a jej klientmi pri predaji a dodaní sinterovaného kameňa Orostone®.
          </p>
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
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
            {[
              { id: 'uvodne-ustanovenia', label: '1. Úvodné ustanovenia' },
              { id: 'objednavky', label: '2. Objednávky' },
              { id: 'ceny', label: '3. Ceny' },
              { id: 'platobne-podmienky', label: '4. Platobné podmienky' },
              { id: 'dodacie-podmienky', label: '5. Dodacie podmienky' },
              { id: 'doprava', label: '6. Doprava' },
              { id: 'vlastnicke-pravo', label: '7. Vlastnícke právo' },
              { id: 'zaruka-reklamacie', label: '8. Záruka a reklamácie' },
              { id: 'prava-zodpovednost', label: '9. Práva a zodpovednosť' },
              { id: 'odporucanie-realizatora', label: '10. Odporúčanie realizátora' },
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
          <div className="border-t border-gray-100 pt-4 mt-2">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">E-shop sekcie</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3" id="vop-eshop">
              {[
                { id: 'eshop-zmluva', label: '11. E-shop: Uzatvorenie zmluvy' },
                { id: 'eshop-platba', label: '12. E-shop: Cena a platba' },
                { id: 'eshop-dodanie', label: '13. E-shop: Dodanie tovaru' },
                { id: 'eshop-odstupenie', label: '14. E-shop: Odstúpenie od zmluvy' },
                { id: 'eshop-reklamacie', label: '15. E-shop: Reklamácie' },
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
          </div>
        </motion.div>

        {/* Content */}
        <div className="space-y-8">
          {/* 1. Úvodné ustanovenia */}
          <Section id="uvodne-ustanovenia" number="1" title="Úvodné ustanovenia">
            <SubSection number="1.1">
              Tieto všeobecné obchodné podmienky (ďalej len „VOP") ustanovujú podmienky predaja a dodania platní sinterovaného kameňa Orostone® (ďalej len „kameň Orostone®" alebo „tovar").
            </SubSection>
            <SubSection number="1.2">
              Kameň Orostone® je na území Slovenskej a Českej republiky distribuovaný spoločnosťou:
              <div className="bg-gray-50 rounded-orostone p-4 mt-3 font-medium">
                <p className="text-brand-dark">Orostone, s.r.o.</p>
                <p>Landererova 8, 811 09 Bratislava - mestská časť Staré Mesto</p>
                <p>IČO: 55 254 772</p>
                <p className="text-sm text-gray-500 mt-2">Zapísaná v Obchodnom registri Mestského súdu Bratislava III, Oddiel: Sro, Vložka číslo: 167404/B</p>
              </div>
            </SubSection>
            <SubSection number="1.3">
              Tieto VOP sú neoddeliteľnou súčasťou každej Objednávky klienta. <strong>Klientom</strong> sa rozumie každá fyzická a/alebo právnická osoba, ktorá potvrdením objednávky a uhradením zálohy prejavila nespornú vôľu zakúpiť si v objednávke špecifikovaný kameň Orostone® (ďalej len „Klient").
            </SubSection>
            <SubSection number="1.4">
              Účelom týchto VOP je vymedzenie vzájomných práv a povinností medzi spoločnosťou Orostone a Klientom.
            </SubSection>
            <SubSection number="1.5">
              Ustanovenia týchto VOP sú v plnom rozsahu záväzné pre spoločnosť Orostone aj pre Klienta. Osobitné podmienky odlišné od týchto VOP sú platné len v prípade, ak boli písomne potvrdené spoločnosťou Orostone aj Klientom.
            </SubSection>
            <SubSection number="1.6" highlight>
              <strong>Právny režim:</strong> Objednávka je v podmienkach spoločnosti Orostone <strong>kúpnou zmluvou</strong> – v prípade Klienta – spotrebiteľa (fyzická osoba) sa spravuje ustanoveniami § 588 a nasl. Občianskeho zákonníka; v prípade Klienta – podnikateľa (právnická osoba alebo fyzická osoba – podnikateľ) sa spravuje ustanoveniami § 409 a nasl. Obchodného zákonníka.
            </SubSection>
            <SubSection number="1.7">
              Klient bol pred uzatvorením kúpnej zmluvy oboznámený s týmito VOP prostredníctvom ich zverejnenia na webovom sídle spoločnosti Orostone <a href="https://www.orostone.sk" className="text-brand-gold hover:underline">www.orostone.sk</a>.
            </SubSection>
          </Section>

          {/* 2. Objednávky */}
          <Section id="objednavky" number="2" title="Objednávky">
            <SubSection number="2.1">
              Dodanie kameňa Orostone® sa uskutočňuje na základe písomnej objednávky Klienta.
            </SubSection>
            <SubSection number="2.2">
              Písomná objednávka Klienta môže byť v podmienkach spoločnosti Orostone zadaná výlučne v elektronickej podobe prostredníctvom elektronickej pošty na objednávkovom formulári spoločnosti Orostone vo formáte PDF (ďalej len „Objednávka").
            </SubSection>
            <SubSection number="2.3">
              Objednávkový formulár obsahuje minimálne: dodaciu adresu, špecifikáciu objednaného kameňa Orostone® (druh, množstvo, rozmery) a konečnú cenu vrátane aktuálnej sadzby DPH.
            </SubSection>
            <SubSection number="2.4">
              Návrh Objednávky Klienta vypracuje spoločnosť Orostone na základe požiadaviek Klienta. Návrh Objednávky zašle spoločnosť Orostone na adresu elektronickej pošty Klienta.
            </SubSection>
            <SubSection number="2.5" highlight>
              Objednávka sa považuje za <strong>úplnú a záväznú</strong> dňom jej bezvýhradného potvrdenia zo strany Klienta prostredníctvom elektronickej pošty.
            </SubSection>
            <SubSection number="2.6">
              Bezvýhradným potvrdením Objednávky Klient zároveň súhlasí, že spoločnosť Orostone vystaví Klientovi zálohovú faktúru v dohodnutej výške.
            </SubSection>
            <SubSection number="2.7">
              Ak boli po potvrdení Objednávky ústne dojednané akékoľvek doplnky alebo zmeny, vyžadujú si vždy písomné potvrdenie zo strany spoločnosti Orostone prostredníctvom elektronickej pošty. Takýmto písomným potvrdením zaniká pôvodný záväzok a nahrádza sa novým záväzkom.
            </SubSection>
          </Section>

          {/* 3. Ceny */}
          <Section id="ceny" number="3" title="Ceny">
            <SubSection number="3.1">
              Ceny v Objednávke sú uvádzané v mene EUR vrátane aktuálnej sadzby DPH.
            </SubSection>
            <SubSection number="3.2">
              Cena uvedená v úplnej Objednávke sa považuje za konečnú, pokiaľ nedošlo k doplneniu alebo zmene Objednávky (ďalej len „Cena").
            </SubSection>
            <SubSection number="3.3" highlight>
              <strong>Platnosť cenovej ponuky:</strong> Platnosť Ceny garantovanej v Objednávke zaniká dňom uplynutia splatnosti vystavenej zálohovej faktúry, ktorú Klient v stanovenej lehote neuhradil.
            </SubSection>
          </Section>

          {/* 4. Platobné podmienky */}
          <Section id="platobne-podmienky" number="4" title="Platobné podmienky">
            <SubSection number="4.1">
              Po bezvýhradnom potvrdení Objednávky zo strany Klienta vystaví spoločnosť Orostone zálohovú faktúru v dohodnutej výške.
            </SubSection>
            <SubSection number="4.2">
              Spoločnosť Orostone vyžaduje zaplatenie zálohy na dodávaný kameň Orostone® vo výške stanovenej zálohovou faktúrou.
            </SubSection>
            <SubSection number="4.3">
              Nárok na doplatenie Ceny vzniká spoločnosti Orostone v momente splnenia všetkých náležitostí stanovených Objednávkou. Podkladom pre platbu je daňový doklad – faktúra vystavená spoločnosťou Orostone.
            </SubSection>
            <SubSection number="4.4" highlight>
              <strong>Spôsob platby:</strong> Platby je možné realizovať výlučne na bankový účet spoločnosti Orostone uvedený v zálohovej faktúre, resp. faktúre. <strong>Ceny nie je možné uhradiť platbou v hotovosti.</strong>
            </SubSection>
            <SubSection number="4.5">
              Splatnosť zálohovej faktúry, resp. faktúry je spravidla <strong>14 dní</strong> odo dňa jej vystavenia, ak nebolo dohodnuté inak. Klient sa zaväzuje uhradiť Cenu včas, v plnej výške a bez akejkoľvek zrážky. Bankové poplatky za prevod sú hradené Klientom.
            </SubSection>
            <SubSection number="4.6">
              Za deň zaplatenia sa považuje deň pripísania platby v prospech bankového účtu spoločnosti Orostone.
            </SubSection>
            <SubSection number="4.7">
              Pokiaľ bude Klient s úhradou faktúry v omeškaní o viac než 10 dní, sú všetky pohľadávky splatné okamžite. Spoločnosť Orostone je oprávnená postúpiť svoje pohľadávky tretím stranám.
            </SubSection>
          </Section>

          {/* 5. Dodacie podmienky */}
          <Section id="dodacie-podmienky" number="5" title="Dodacie podmienky">
            <SubSection number="5.1">
              Dodacia lehota objednaného kameňa Orostone® je spravidla <strong>15 pracovných dní</strong> odo dňa bezvýhradného potvrdenia Objednávky a pripísania platby vo výške stanovenej zálohovou faktúrou v prospech bankového účtu spoločnosti Orostone.
            </SubSection>
            <SubSection number="5.2">
              V prípade nadštandardných zákaziek môže byť dodacia lehota spravidla <strong>20 pracovných dní</strong>.
            </SubSection>
            <SubSection number="5.3">
              Dodacia lehota objednaného kameňa Orostone®, ktorý spoločnosť Orostone nemá skladom, sa dohodne osobitne a uvedie sa v texte Objednávky.
            </SubSection>
            <SubSection number="5.4">
              Po splnení podmienok informuje spoločnosť Orostone Klienta o dátume možného dodania kameňa Orostone®.
            </SubSection>
            <SubSection number="5.5">
              V prípade, ak spoločnosť Orostone eviduje voči Klientovi pohľadávku po splatnosti z predchádzajúcej objednávky, dodacia lehota sa predlžuje do doby vysporiadania nedoplatku.
            </SubSection>
            <SubSection number="5.6" highlight>
              <strong>Spôsob dodania:</strong> Objednávka môže byť splnená: a) dodaním kameňa Orostone® na miesto určené Klientom, b) osobným prevzatím Klientom, c) naložením kameňa na prepravný prostriedok a odovzdaním prvému prepravcovi.
            </SubSection>
            <SubSection number="5.7">
              Spoločnosť Orostone si vyhradzuje právo na zmenu dodacej lehoty. Termín dodania bude predmetom rokovania pred zadaním Objednávky.
            </SubSection>
          </Section>

          {/* 6. Doprava */}
          <Section id="doprava" number="6" title="Doprava">
            <SubSection number="6.1">
              Cena dopravy sa účtuje k cene kameňa Orostone® a zahŕňa náklady na prepravu a manipuláciu s tovarom.
            </SubSection>
            <SubSection number="6.2">
              V prípade, že spoločnosť Orostone nie je v dôsledku okolností vylučujúcich zodpovednosť (tzv. vyššej moci) schopná splniť svoj záväzok v dodacej lehote, vrátane oneskorenia dodávok od jej dodávateľov, nebude toto omeškanie považované za porušenie podmienok Objednávky a dodacia lehota sa primerane predĺži.
            </SubSection>
            <SubSection number="6.3" highlight>
              <strong>Prevzatie tovaru:</strong> Klient je povinný pri prevzatí tovaru skontrolovať jeho stav a neporušenosť obalu. Prípadné zjavné poškodenie je potrebné <strong>bezodkladne</strong> zaznamenať do dodacieho listu a oznámiť dopravcovi/spoločnosti Orostone.
            </SubSection>
          </Section>

          {/* 7. Prechod vlastníckeho práva */}
          <Section id="vlastnicke-pravo" number="7" title="Prechod vlastníckeho práva ku kameňu Orostone®">
            <SubSection number="7.1">
              Vlastnícke právo ku kameňu Orostone® vzniká Klientovi úplným zaplatením kúpnej ceny dohodnutej v Objednávke.
            </SubSection>
            <SubSection number="7.2" highlight>
              <strong>Výhrada vlastníctva:</strong> Kameň Orostone® zostáva vo vlastníctve spoločnosti Orostone a Klient k nemu nadobudne vlastnícke právo až úplným zaplatením čiastky dohodnutej v Objednávke.
            </SubSection>
            <SubSection number="7.3">
              Až do nadobudnutia vlastníckeho práva nie je Klient oprávnený kameň Orostone® založiť, poskytnúť ako istinu, prenajať alebo inak zaťažiť právami tretích osôb.
            </SubSection>
          </Section>

          {/* 8. Garancia kvality, záruka a reklamácie */}
          <Section id="zaruka-reklamacie" number="8" title="Garancia kvality, záruka a reklamácie">
            <SubSection number="8.1">
              Kameň Orostone® je neporézny, preto ho nie je potrebné impregnovať a nie je schopný absorbovať žiadne kvapaliny, čoho výsledkom sú vynikajúce hygienické parametre a jednoduchá údržba.
            </SubSection>
            <SubSection number="8.2">
              Farebný odtieň a kresba vzorky z kameňa Orostone® sa môžu mierne líšiť od skutočne dodaného kameňa Orostone® v dôsledku výrobného procesu.
            </SubSection>
            <SubSection number="8.3" highlight>
              <strong>Záručná doba:</strong> 24 mesiacov odo dňa prevzatia Objednávky Klientom.
            </SubSection>
            <SubSection number="8.4">
              Poskytnutie záruky sa týka len nedostatkov na dodanom kameni Orostone®, ktoré vznikli <strong>chybou výroby alebo materiálu</strong>.
            </SubSection>
            <SubSection number="8.5">
              <strong>Záruka sa neposkytuje</strong> na vady, ktoré vznikli čo i len jedným z nasledujúcich dôvodov:
              <ul className="list-disc ml-6 mt-2 space-y-1 text-sm">
                <li>chybné zadanie Klienta</li>
                <li>používanie kameňa v rozpore s dodaným Technickým manuálom</li>
                <li>chybná montáž alebo uvedenie do používania Klientom alebo treťou osobou</li>
                <li>škody spôsobené pokračovaním v používaní kameňa napriek prejavenej chybe</li>
                <li>následkom živelnej pohromy</li>
                <li>mechanickým poškodením</li>
              </ul>
            </SubSection>
            <SubSection number="8.6">
              Prípadné zjavné vady na kameni Orostone® je potrebné zaznamenať bezodkladne pri preberaní spolu s fotodokumentáciou.
            </SubSection>
            <SubSection number="8.7" highlight>
              <strong>Uplatnenie reklamácie:</strong> Reklamácie sa uplatňujú písomne e-mailom na info@orostone.sk s uvedením čísla objednávky, popisu vady a fotodokumentácie. Spoločnosť Orostone potvrdí prijatie reklamácie do 3 pracovných dní a rozhodne o nej do 30 dní.
            </SubSection>
            <SubSection number="8.8">
              Klient je po vzájomnej dohode povinný poskytnúť dostatočný čas a príležitosť na vykonanie všetkých potrebných opráv.
            </SubSection>
          </Section>

          {/* 9. Práva a zodpovednosti */}
          <Section id="prava-zodpovednost" number="9" title="Práva a zodpovednosti">
            <SubSection number="9.1">
              Spoločnosť Orostone nezodpovedá za nesplnenie povinností z potvrdených Objednávok, ak sa tak stane z dôvodu nepredvídaných a neodvrátiteľných okolností (vyššia moc).
            </SubSection>
            <SubSection number="9.2">
              Spoločnosť Orostone nezodpovedá Klientovi za škody následné alebo nepriame.
            </SubSection>
            <SubSection number="9.3" highlight>
              <strong>Zrušenie objednávky Klientom (B2B):</strong> V prípade zrušenia Objednávky zo strany Klienta – podnikateľa má spoločnosť Orostone nárok na náhradu preukázateľných nákladov spojených s prípravou a spracovaním objednávky.
            </SubSection>
            <SubSection number="9.4">
              <strong>Zrušenie objednávky spotrebiteľom:</strong> Pre Klientov – spotrebiteľov platia ustanovenia o odstúpení od zmluvy podľa príslušných právnych predpisov (viď sekcia 14 pre e-shop objednávky).
            </SubSection>
          </Section>

          {/* 10. Odporúčanie realizátora */}
          <Section id="odporucanie-realizatora" number="10" title="Odporúčanie realizátora">
            <div className="bg-amber-50 -mx-4 px-4 py-4 border-l-4 border-brand-gold rounded-orostone mb-4">
              <p className="font-medium text-brand-dark mb-2">Dôležité upozornenie</p>
              <p className="text-sm">
                Spoločnosť Orostone <strong>neposkytuje služby montáže, rezania ani opracovania kameňa</strong>. 
                Spoločnosť Orostone je výlučne dodávateľom materiálu (kameňa Orostone®) a dopravy.
              </p>
            </div>
            <SubSection number="10.1">
              Na požiadanie Klienta môže spoločnosť Orostone poskytnúť <strong>nezáväzné odporúčanie</strong> na externých kamenárov/realizátorov, ktorí sa špecializujú na spracovanie a montáž sinterovaného kameňa.
            </SubSection>
            <SubSection number="10.2" highlight>
              Toto odporúčanie má <strong>výlučne informatívny charakter</strong>. Spoločnosť Orostone nezodpovedá za kvalitu práce, termíny, ceny ani iné aspekty služieb poskytovaných odporúčanými realizátormi.
            </SubSection>
            <SubSection number="10.3">
              Klient vstupuje do zmluvného vzťahu s odporúčaným realizátorom priamo a na vlastnú zodpovednosť. Akékoľvek reklamácie týkajúce sa montáže, rezania alebo opracovania kameňa je potrebné uplatniť priamo u príslušného realizátora.
            </SubSection>
            <SubSection number="10.4">
              Spoločnosť Orostone vystavuje Klientovi <strong>iba faktúru za dodaný materiál (kameň)</strong>. Služby realizátora sú predmetom samostatnej fakturácie medzi Klientom a realizátorom.
            </SubSection>
          </Section>

          {/* E-SHOP SECTIONS DIVIDER */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="py-8"
          >
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent"></div>
              <span className="text-brand-gold font-semibold tracking-wider uppercase text-sm">E-shop sekcie</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent"></div>
            </div>
            <p className="text-center text-gray-500 text-sm mt-4">
              Nasledujúce ustanovenia sa vzťahujú výlučne na nákupy realizované prostredníctvom e-shopu na <a href="https://www.orostone.sk" className="text-brand-gold hover:underline">www.orostone.sk</a>
            </p>
          </motion.div>

          {/* 11. E-shop: Uzatvorenie zmluvy */}
          <Section id="eshop-zmluva" number="11" title="E-shop: Uzatvorenie zmluvy na diaľku">
            <SubSection number="11.1">
              Prostredníctvom e-shopu je možné objednať výlučne <strong>skladové platne kameňa Orostone® bez úprav</strong> (rezania, opracovania).
            </SubSection>
            <SubSection number="11.2">
              Objednávka Klienta odoslaná prostredníctvom e-shopu je návrhom na uzatvorenie kúpnej zmluvy.
            </SubSection>
            <SubSection number="11.3" highlight>
              <strong>Vznik zmluvy:</strong> Kúpna zmluva vzniká momentom, keď spoločnosť Orostone potvrdí objednávku e-mailom (automatické potvrdenie o prijatí objednávky nie je potvrdením objednávky).
            </SubSection>
            <SubSection number="11.4">
              Spoločnosť Orostone si vyhradzuje právo odmietnuť objednávku, najmä ak tovar nie je dostupný alebo ak existujú pochybnosti o pravdivosti údajov uvedených Klientom.
            </SubSection>
          </Section>

          {/* 12. E-shop: Cena, platba */}
          <Section id="eshop-platba" number="12" title="E-shop: Cena, platba a daňové doklady">
            <SubSection number="12.1">
              Ceny tovaru v e-shope sú uvedené vrátane DPH. Cena dopravy je uvedená samostatne pred dokončením objednávky.
            </SubSection>
            <SubSection number="12.2" highlight>
              <strong>Spôsoby platby:</strong> Bankový prevod alebo platba kartou online. <strong>Dobierka nie je možná.</strong>
            </SubSection>
            <SubSection number="12.3">
              Tovar je expedovaný až po pripísaní platby na účet spoločnosti Orostone.
            </SubSection>
            <SubSection number="12.4">
              V prípade neuhradenia objednávky do 5 pracovných dní od jej potvrdenia sa objednávka automaticky ruší.
            </SubSection>
            <SubSection number="12.5">
              Daňový doklad (faktúra) bude zaslaný elektronicky na e-mailovú adresu Klienta.
            </SubSection>
          </Section>

          {/* 13. E-shop: Dodanie tovaru */}
          <Section id="eshop-dodanie" number="13" title="E-shop: Dodanie tovaru a prechod rizika">
            <SubSection number="13.1">
              Dodacia lehota pre e-shop objednávky je spravidla <strong>5 pracovných dní</strong> od pripísania platby, ak je tovar skladom.
            </SubSection>
            <SubSection number="13.2">
              Tovar je doručovaný prepravnou spoločnosťou na adresu uvedenú Klientom v objednávke.
            </SubSection>
            <SubSection number="13.3" highlight>
              <strong>Prechod rizika:</strong> Nebezpečenstvo škody na tovare prechádza na Klienta momentom prevzatia tovaru od dopravcu.
            </SubSection>
            <SubSection number="13.4">
              Klient je povinný pri prevzatí skontrolovať neporušenosť obalu a stav tovaru. Poškodenie zásielky je potrebné <strong>ihneď</strong> oznámiť dopravcovi a spoločnosti Orostone.
            </SubSection>
            <SubSection number="13.5">
              Skryté poškodenie zistené po rozbalení je potrebné nahlásiť spoločnosti Orostone do <strong>24 hodín</strong> od prevzatia, spolu s fotodokumentáciou.
            </SubSection>
          </Section>

          {/* 14. E-shop: Odstúpenie od zmluvy */}
          <Section id="eshop-odstupenie" number="14" title="E-shop: Odstúpenie od zmluvy (spotrebiteľ)">
            <SubSection number="14.1">
              Klient – spotrebiteľ má právo odstúpiť od zmluvy bez uvedenia dôvodu do <strong>14 dní</strong> odo dňa prevzatia tovaru.
            </SubSection>
            <SubSection number="14.2">
              Odstúpenie od zmluvy je potrebné zaslať písomne na e-mail info@orostone.sk alebo poštou na adresu sídla spoločnosti.
            </SubSection>
            <SubSection number="14.3" highlight>
              <strong>Podmienky vrátenia:</strong> Tovar musí byť nepoužitý, nepoškodený a v pôvodnom obale. Klient znáša náklady na vrátenie tovaru.
            </SubSection>
            <SubSection number="14.4">
              Spoločnosť Orostone vráti Klientovi všetky platby do 14 dní od doručenia vráteného tovaru, a to rovnakým spôsobom, akým boli prijaté.
            </SubSection>
            <SubSection number="14.5">
              Právo na odstúpenie od zmluvy sa nevzťahuje na tovar zhotovený podľa osobitných požiadaviek Klienta (v e-shope sa štandardne nepredáva).
            </SubSection>
          </Section>

          {/* 15. E-shop: Reklamácie */}
          <Section id="eshop-reklamacie" number="15" title="E-shop: Reklamácie tovaru">
            <SubSection number="15.1">
              Spoločnosť Orostone zodpovedá za vady materiálu, ktoré mal tovar pri prevzatí Klientom, alebo ktoré sa prejavia počas záručnej doby (24 mesiacov).
            </SubSection>
            <SubSection number="15.2" highlight>
              <strong>Spoločnosť Orostone nezodpovedá</strong> za vady vzniknuté v dôsledku montáže, rezania, opracovania alebo iného zásahu do tovaru vykonaného Klientom alebo treťou osobou.
            </SubSection>
            <SubSection number="15.3">
              Reklamáciu je potrebné uplatniť písomne na info@orostone.sk s uvedením čísla objednávky, popisu vady a fotodokumentácie.
            </SubSection>
            <SubSection number="15.4">
              Spoločnosť Orostone rozhodne o reklamácii ihneď, v zložitých prípadoch do 3 pracovných dní. Vybavenie reklamácie vrátane odstránenia vady nebude trvať dlhšie ako 30 dní.
            </SubSection>
          </Section>

          {/* Záverečné ustanovenia */}
          <Section id="zaverecne-ustanovenia" number="16" title="Záverečné ustanovenia">
            <SubSection number="16.1">
              Spoločnosť Orostone si vyhradzuje právo na zmenu týchto VOP. Aktuálne znenie VOP je vždy zverejnené na <a href="https://www.orostone.sk/vop" className="text-brand-gold hover:underline">www.orostone.sk/vop</a>.
            </SubSection>
            <SubSection number="16.2">
              Vzťahy neupravené týmito VOP sa riadia príslušnými ustanoveniami Občianskeho zákonníka, Obchodného zákonníka a zákona č. 250/2007 Z.z. o ochrane spotrebiteľa.
            </SubSection>
            <SubSection number="16.3">
              Pre riešenie sporov je príslušný súd Slovenskej republiky podľa sídla spoločnosti Orostone.
            </SubSection>
            <SubSection number="16.4">
              V prípade spotrebiteľských sporov má Klient – spotrebiteľ právo obrátiť sa na subjekt alternatívneho riešenia sporov (SOI – Slovenská obchodná inšpekcia).
            </SubSection>
            <SubSection number="16.5">
              Ak sa akékoľvek ustanovenie týchto VOP stane neplatným alebo nevymáhateľným, nemá to vplyv na platnosť ostatných ustanovení.
            </SubSection>
          </Section>

          {/* Signature Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-orostone p-8 text-center"
          >
            <p className="text-gray-600 mb-6">
              Tieto Všeobecné obchodné podmienky spoločnosti Orostone, s.r.o. nadobúdajú platnosť a účinnosť dňa:
            </p>
            <p className="text-2xl font-light text-brand-dark mb-8">01.01.2026</p>
            <div className="inline-block">
              <div className="w-32 h-px bg-brand-gold mb-4 mx-auto"></div>
              <p className="text-brand-dark font-medium">JUDr. Martin Miškeje</p>
              <p className="text-gray-500 text-sm">konateľ</p>
              <p className="text-gray-500 text-sm">Orostone, s.r.o.</p>
            </div>
          </motion.div>
        </div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-16 pt-8 border-t border-gray-200"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <p className="text-sm text-gray-500">Platnosť a účinnosť</p>
              <p className="text-lg font-medium text-brand-dark">01.01.2026</p>
            </div>
            <div className="flex gap-4">
              <Link 
                to="/kontakt"
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-gold text-white rounded-full hover:bg-brand-dark transition-colors"
              >
                <span>Kontaktujte nás</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
