import React from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../components/UI/SEOHead';
import {
  LEGAL_BOX,
  LEGAL_LINK,
  LegalClause as SubSection,
  LegalLayout,
  LegalSection as Section,
  PageHero,
} from '../components/Design';

const TOC = [
  { id: 'obchodnik', label: '1. Obchodník' },
  { id: 'predmet-sluzby', label: '2. Predmet služby' },
  { id: 'vyska-poplatku', label: '3. Výška rezervačného poplatku' },
  { id: 'uplatnenie-poplatku', label: '4. Uplatnenie poplatku' },
  { id: 'nevyuzitie-rezervacie', label: '5. Nevyužitie rezervácie' },
  { id: 'nevratnost', label: '6. Nevratnosť poplatku' },
  { id: 'suhlas-zacatie-sluzby', label: '7. Súhlas so začatím služby' },
  { id: 'zrusenie-orostone', label: '8. Zrušenie zo strany Orostone' },
  { id: 'vztah-k-objednavke', label: '9. Vzťah k budúcej objednávke' },
  { id: 'doklad-o-uhrade', label: '10. Doklad o úhrade' },
  { id: 'kontakt', label: '11. Kontakt' },
];

export const PodmienkyRezervaceCeny = () => {
  return (
    <div>
      <SEOHead
        title="Podmienky rezervačného poplatku Orostone – 99 € | OROSTONE"
        description="Podmienky úhrady a použitia rezervačného poplatku 99 € za garanciu ceny produktov Orostone na 6 mesiacov. Informácie o nevratnosti poplatku a súhlase so začatím poskytovania služby."
        canonical="https://orostone.sk/podmienky-rezervacie-ceny"
      />
      <PageHero
        eyebrow="Právne dokumenty • Rezervačný poplatok"
        title="Podmienky rezervačného poplatku Orostone – 99 €"
        lead={
          <>
            Tieto podmienky upravujú úhradu a použitie rezervačného poplatku za garantovanie ceny produktov Orostone. Tvoria neoddeliteľnú súčasť zmluvy o poskytnutí služby <em>Rezervácia ceny Orostone</em>, ktorá vzniká úhradou rezervačného poplatku.
          </>
        }
        actions={<p className="text-[0.9rem] font-normal text-brand-muted">Účinné od: 1. 5. 2026</p>}
      />

      <LegalLayout toc={TOC}>
        {/* Content */}
        <div>

          {/* 1. Obchodník */}
          <Section id="obchodnik" number="1" title="Obchodník">
            <SubSection number="1.1">
              Obchodníkom je:
              <div className={`${LEGAL_BOX} mt-3 p-4 font-normal`}>
                <p className="text-brand-dark">Orostone s.r.o.</p>
                <p>Landererova 8, 811 09 Bratislava – mestská časť Staré Mesto</p>
                <p>Slovenská republika</p>
                <p>IČO: 55 254 772</p>
                <p>DIČ: 2121930580</p>
                <p>IČ DPH: SK2121930580</p>
                <p className="mt-2 text-sm text-brand-muted">
                  Zapísaná v Obchodnom registri Mestského súdu Bratislava III, oddiel Sro, vložka č. 167404/B
                </p>
                <p className="mt-2">E-mail: <a href="mailto:info@orostone.sk" className={LEGAL_LINK}>info@orostone.sk</a></p>
                <p>Telefón: <a href="tel:+421917588738" className={LEGAL_LINK}>+421 917 588 738</a></p>
                <p>Web: <a href="https://orostone.sk" className={LEGAL_LINK}>www.orostone.sk</a></p>
              </div>
            </SubSection>
            <SubSection number="1.2">
              ďalej len „Orostone“ alebo „obchodník“.
            </SubSection>
          </Section>

          {/* 2. Predmet služby */}
          <Section id="predmet-sluzby" number="2" title="Predmet služby">
            <SubSection number="2.1">
              Zákazník úhradou rezervačného poplatku vo výške <strong>99 € vrátane DPH</strong> získava službu:
              <div className={`${LEGAL_BOX} mt-3 p-4`}>
                <p className="text-brand-dark font-semibold mb-3">Rezervácia ceny Orostone</p>
                <p className="mb-3">Táto služba zahŕňa:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>zaevidovanie zákazníka do systému rezervácie ceny,</li>
                  <li>garantovanie aktuálne platnej ceny produktov Orostone na obdobie <strong>6 mesiacov</strong> odo dňa úhrady rezervačného poplatku,</li>
                  <li>možnosť uplatniť zaplatený rezervačný poplatok ako kredit alebo zľavu pri budúcej objednávke platne Orostone.</li>
                </ul>
              </div>
            </SubSection>
            <SubSection number="2.2">
              Rezervačný poplatok nie je samostatnou objednávkou kamennej platne, kuchynskej pracovnej dosky, zásteny, ostrovčeka ani iného fyzického produktu.
            </SubSection>
          </Section>

          {/* 3. Výška rezervačného poplatku */}
          <Section id="vyska-poplatku" number="3" title="Výška rezervačného poplatku">
            <SubSection number="3.1">
              Cena rezervačného poplatku je:
            </SubSection>
            <SubSection number="3.2" highlight>
              <p className="text-lg font-semibold text-brand-dark">99 € vrátane DPH</p>
            </SubSection>
            <SubSection number="3.3">
              Cena je konečná. Úhradou poplatku zákazník nevytvára objednávku konkrétneho fyzického produktu, ale objednáva si službu rezervácie ceny.
            </SubSection>
          </Section>

          {/* 4. Uplatnenie rezervačného poplatku */}
          <Section id="uplatnenie-poplatku" number="4" title="Uplatnenie rezervačného poplatku">
            <SubSection number="4.1">
              Po vytvorení objednávky produktov Orostone možno rezervačný poplatok uplatniť ako kredit alebo zľavu z celkovej ceny objednávky.
            </SubSection>
            <SubSection number="4.2">
              Uplatnenie rezervačného poplatku je možné iba pri objednávke produktov Orostone.
            </SubSection>
            <SubSection number="4.3">
              Rezervačný poplatok nie je možné zameniť za hotovosť.
            </SubSection>
          </Section>

          {/* 5. Nevyužitie rezervácie */}
          <Section id="nevyuzitie-rezervacie" number="5" title="Nevyužitie rezervácie">
            <SubSection number="5.1">
              Ak zákazník v lehote <strong>6 mesiacov</strong> od úhrady rezervačného poplatku neuskutoční objednávku produktu Orostone, rezervačný poplatok zaniká bez nároku na jeho vrátenie.
            </SubSection>
            <SubSection number="5.2">
              Po uplynutí tejto lehoty už zákazník nemá nárok na odpočítanie rezervačného poplatku z budúcej objednávky.
            </SubSection>
          </Section>

          {/* 6. Nevratnosť rezervačného poplatku */}
          <Section id="nevratnost" number="6" title="Nevratnosť rezervačného poplatku">
            <SubSection number="6.1">
              Rezervačný poplatok je poplatkom za <em>službu rezervácie a garantovania ceny</em>. Služba je zákazníkovi poskytnutá okamžite po potvrdení platby tým, že Orostone zákazníka zaeviduje do systému rezervácie ceny a aktivuje mu garanciu ceny na dohodnuté obdobie.
            </SubSection>
            <SubSection number="6.2" highlight>
              <p className="text-brand-dark">
                Zákazník berie na vedomie, že po úplnom poskytnutí tejto služby je rezervačný poplatok <strong>nevratný</strong>.
              </p>
            </SubSection>
          </Section>

          {/* 7. Súhlas so začatím poskytovania služby pred uplynutím lehoty na odstúpenie */}
          <Section id="suhlas-zacatie-sluzby" number="7" title="Súhlas so začatím poskytovania služby pred uplynutím lehoty na odstúpenie">
            <SubSection number="7.1" highlight>
              <p className="text-brand-dark">
                Ak je zákazník spotrebiteľom, úhradou rezervačného poplatku a potvrdením týchto podmienok <strong>výslovne žiada</strong>, aby Orostone začal poskytovať službu rezervácie ceny okamžite po prijatí platby, teda <strong>pred uplynutím zákonnej lehoty na odstúpenie od zmluvy</strong>.
              </p>
            </SubSection>
            <SubSection number="7.2" highlight>
              <p className="text-brand-dark">
                Zákazník zároveň výslovne potvrdzuje, že <strong>bol poučený o tom, že po úplnom poskytnutí služby stráca právo na odstúpenie od zmluvy</strong> a na vrátenie rezervačného poplatku.
              </p>
            </SubSection>
          </Section>

          {/* 8. Zrušenie zo strany Orostone */}
          <Section id="zrusenie-orostone" number="8" title="Zrušenie zo strany Orostone">
            <SubSection number="8.1">
              Ak by Orostone z objektívnych dôvodov nevedel zákazníkovi umožniť uplatnenie rezervácie ceny v dohodnutej lehote, môže zákazníkovi ponúknuť náhradné riešenie alebo vrátenie rezervačného poplatku.
            </SubSection>
            <SubSection number="8.2">
              Toto ustanovenie sa nevzťahuje na prípady, keď zákazník rezerváciu nevyužije z vlastného rozhodnutia alebo v stanovenej lehote neuskutoční objednávku.
            </SubSection>
          </Section>

          {/* 9. Vzťah k budúcej objednávke */}
          <Section id="vztah-k-objednavke" number="9" title="Vzťah k budúcej objednávke">
            <SubSection number="9.1">
              Budúca objednávka produktov Orostone sa bude riadiť samostatnou cenovou ponukou, technickou špecifikáciou, dostupnosťou materiálu a obchodnými podmienkami platnými v čase uzavretia zmluvy o dodaní, ak nebolo výslovne písomne potvrdené inak.
            </SubSection>
          </Section>

          {/* 10. Doklad o úhrade */}
          <Section id="doklad-o-uhrade" number="10" title="Doklad o úhrade">
            <SubSection number="10.1">
              Po úhrade rezervačného poplatku bude zákazníkovi vystavené potvrdenie o platbe alebo faktúra/daňový doklad podľa údajov zadaných pri platbe.
            </SubSection>
          </Section>

          {/* 11. Kontakt */}
          <Section id="kontakt" number="11" title="Kontakt">
            <SubSection number="11.1">
              V prípade otázok k rezervácii ceny môže zákazník kontaktovať Orostone:
              <div className={`${LEGAL_BOX} mt-3 p-4 font-normal`}>
                <p>E-mail: <a href="mailto:info@orostone.sk" className={LEGAL_LINK}>info@orostone.sk</a></p>
                <p>Telefón: <a href="tel:+421917588738" className={LEGAL_LINK}>+421 917 588 738</a></p>
                <p>Web: <a href="https://orostone.sk" className={LEGAL_LINK}>www.orostone.sk</a></p>
              </div>
            </SubSection>
          </Section>

        </div>

        {/* Footer note */}
        <div className="mt-6 border-t border-brand-line pt-8">
          <p className="text-sm font-light leading-relaxed text-brand-dark/85">
            Tieto podmienky rezervačného poplatku sú účinné od 1. 5. 2026. Tvoria neoddeliteľnú súčasť zmluvy uzavretej úhradou rezervačného poplatku. V otázkach, ktoré tieto podmienky neupravujú, sa primerane uplatnia <Link to="/vop" className={LEGAL_LINK}>Všeobecné obchodné podmienky Orostone</Link>.
          </p>
          <p className="mt-3 text-sm text-brand-muted">
            Orostone s.r.o. • Landererova 8, 811 09 Bratislava • IČO: 55 254 772 • DIČ: 2121930580
          </p>
        </div>
      </LegalLayout>
    </div>
  );
};
