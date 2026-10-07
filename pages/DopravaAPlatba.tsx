import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail } from 'lucide-react';
import { SEOHead } from '../components/UI/SEOHead';
import { ActionButton, Container, LEGAL_LINK, PageHero, Section } from '../components/Design';

export const DopravaAPlatba: React.FC = () => {
  return (
    <div>
      <SEOHead
        title="Doprava veľkoformátových platní | OROSTONE"
        description="Informácie o doprave, platbe a špeciálnej preprave veľkoformátových platní a vzoriek sinterovaného kameňa po celom Slovensku."
        canonical="https://orostone.sk/doprava"
      />

      <PageHero
        eyebrow="Logistika"
        title="Doprava a platba"
        lead="Veľkoformátové platne Orostone doručujeme bezpečne na špeciálnom prepravnom vozíku prostredníctvom zmluvného dopravcu v rámci Slovenskej republiky."
      />

      {/* Doprava */}
      <Section tone="chalk" className="!pt-0">
        <Container>
          <div className="max-w-[1040px]">

            <h2 className="mb-10 text-os-h2">
              Doprava
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div className="rounded-[3px] border border-brand-line bg-white/60 p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-[1.1rem] font-semibold text-brand-dark">Špeciálna preprava platní</h3>
                </div>
                <p className="mb-4 text-[0.95rem] font-light leading-relaxed text-brand-dark/85">
                  Platne majú veľkoformátový rozmer 3&nbsp;200&nbsp;×&nbsp;1&nbsp;600&nbsp;mm a vysokú hmotnosť. Prepravujeme ich výlučne na špeciálnom prepravnom vozíku s kolieskami, kde sú platne bezpečne uchytené popruhmi.
                </p>
                <p className="mb-4 text-[0.95rem] font-light leading-relaxed text-brand-dark/85">
                  <strong className="text-brand-dark">Štandardná doprava zahŕňa</strong> doručenie na adresu uvedenú v objednávke, na miesto prístupné pre nákladné vozidlo, spravidla na prízemie alebo k vozidlu.
                </p>
                <p className="mb-4 text-[0.95rem] font-light leading-relaxed text-brand-dark/85">
                  <strong className="text-brand-dark">Súčasťou štandardnej dopravy nie je</strong> vnútorná manipulácia, vynáška, presun po schodoch, vykládka pomocou žeriava, vysokozdvižnej techniky ani iná nadštandardná manipulácia, ak nebolo písomne dohodnuté inak.
                </p>
                <p className="mb-4 text-[0.95rem] font-light leading-relaxed text-brand-dark/85">
                  Kupujúci je povinný zabezpečiť na mieste prevzatia primerané podmienky na bezpečné prevzatie tovaru, vrátane najmenej 2 osôb na asistenciu pri prevzatí.
                </p>
                <div className="rounded-r-[3px] border-l-2 border-brand-dark bg-brand-sand p-4 text-[0.95rem] leading-relaxed">
                  Ak kupujúci nezabezpečí prevzatie tovaru, prístup na miesto doručenia alebo potrebnú súčinnosť, spoločnosť Orostone je oprávnená požadovať náhradu nákladov márneho doručenia, opätovného doručenia a primeraných nákladov na skladovanie.
                </div>
              </div>

              <div className="rounded-[3px] border border-brand-line bg-white/60 p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-[1.1rem] font-semibold text-brand-dark">Dodacie lehoty</h3>
                </div>
                <ul className="space-y-4 text-[0.95rem] font-light text-brand-dark/85">
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-brand-dark/40">✦</span>
                    <span><strong className="text-brand-dark">Skladové platne:</strong> expedujeme spravidla do 5 pracovných dní od prijatia platby</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-brand-dark/40">✦</span>
                    <span><strong className="text-brand-dark">Na objednávku:</strong> expedujeme spravidla v lehote 3 až 6 týždňov v závislosti od dostupnosti u výrobcu</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-brand-dark/40">✦</span>
                    <span>Ak to spôsob dopravy umožňuje, o expedícii vás budeme informovať e-mailom</span>
                  </li>
                </ul>
                <p className="mt-5 text-xs leading-relaxed text-brand-muted">
                  Uvedené lehoty sú orientačné a môžu sa meniť v závislosti od skladovej dostupnosti, výrobcu, logistiky a okolností, ktoré spoločnosť Orostone nemôže primerane ovplyvniť.
                </p>
              </div>
            </div>

            <div className="mb-6 rounded-[3px] border border-brand-line bg-white/60 p-6 sm:p-8">
              <h3 className="mb-4 text-[1.1rem] font-semibold text-brand-dark">
                Cena dopravy
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-brand-dark">
                      <th className="py-3 pr-6 text-left text-[0.7rem] font-bold uppercase tracking-[0.12em] text-brand-dark">Oblasť</th>
                      <th className="py-3 pr-6 text-left text-[0.7rem] font-bold uppercase tracking-[0.12em] text-brand-dark">Cena (s DPH)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-line">
                    <tr>
                      <td className="py-3 pr-6 font-light">Bratislava a okolie (do 50 km)</td>
                      <td className="py-3 pr-6 font-medium text-brand-dark">od 150 EUR</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-6 font-light">Ostatné územie Slovenskej republiky</td>
                      <td className="py-3 pr-6 font-medium text-brand-dark">od 350 EUR</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-brand-muted">
                Konečná cena dopravy sa určuje podľa adresy doručenia, počtu platní, hmotnosti zásielky a prípadných osobitných požiadaviek na manipuláciu. Presná cena dopravy bude zobrazená alebo potvrdená pred odoslaním záväznej objednávky. Doručujeme výlučne na území Slovenskej republiky.
              </p>
<p className="mt-2 text-xs text-brand-muted">
                Úplné obchodné podmienky vrátane podmienok dodania nájdete vo{' '}
                <Link to="/vop" className={LEGAL_LINK}>Všeobecných obchodných podmienkach</Link>.
              </p>
            </div>

            {/* Vzorky */}
            <div className="mb-6 rounded-[3px] border border-brand-line bg-white/60 p-6 sm:p-8">
              <h3 className="mb-4 text-[1.1rem] font-semibold text-brand-dark">
                Vzorky
              </h3>
              <p className="mb-3 text-[0.95rem] font-light leading-relaxed text-brand-dark/85">
                Vzorky dekorov s rozmerom 10&nbsp;×&nbsp;10&nbsp;cm posielame zásielkou na adresu na Slovensku. <strong className="text-brand-dark">Prvá vzorka je zadarmo</strong>, každá ďalšia stojí 4,90&nbsp;€ a doprava 2,50&nbsp;€ (ceny s DPH). Celkovú cenu vidíte pri výbere vzoriek a v pokladni pred zaplatením, platí sa rovnakými spôsobmi ako pri platniach.
              </p>
              <p className="text-xs leading-relaxed text-brand-muted">
                Vzorky môžete v lehote na odstúpenie od zmluvy vrátiť bežnou poštovou zásielkou, náklady na vrátenie znáša kupujúci.{' '}
                <Link to="/vzorky" className={LEGAL_LINK}>Vybrať vzorky</Link>
              </p>
            </div>

            {/* Vrátenie tovaru — náklady */}
            <div className="mb-6 rounded-r-[3px] border-l-2 border-brand-dark bg-brand-sand p-6 sm:p-8">
              <h3 className="mb-4 text-[1.1rem] font-semibold text-brand-dark">
                Náklady na vrátenie tovaru
              </h3>
              <p className="mb-3 text-[0.95rem] font-light leading-relaxed text-brand-dark/85">
                Vzhľadom na povahu, hmotnosť a rozmery platní (3&nbsp;200&nbsp;×&nbsp;1&nbsp;600&nbsp;mm) <strong>nie je možné platne vrátiť bežnou poštou</strong>. V prípade odstúpenia od zmluvy znáša náklady na vrátenie tovaru kupujúci. Vzorky môžete vrátiť aj bežnou poštovou zásielkou.
              </p>
              <p className="mb-4 text-[0.95rem] font-light leading-relaxed text-brand-dark/85">
                Orientačné náklady na spätný zvoz tovaru:
              </p>
              <div className="overflow-x-auto mb-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-brand-dark">
                      <th className="py-2 pr-6 text-left text-[0.7rem] font-bold uppercase tracking-[0.12em] text-brand-dark">Oblasť vyzdvihnutia</th>
                      <th className="py-2 text-left text-[0.7rem] font-bold uppercase tracking-[0.12em] text-brand-dark">Odhadované náklady (s DPH)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-dark/10">
                    <tr>
                      <td className="py-2 pr-6 font-light">Bratislava a okolie (do 50 km)</td>
                      <td className="py-2 font-medium text-brand-dark">od 150 EUR</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-6 font-light">Ostatné územie Slovenskej republiky</td>
                      <td className="py-2 font-medium text-brand-dark">od 350 EUR</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs leading-relaxed text-brand-muted">
                Presná výška nákladov na vrátenie závisí od miesta vyzdvihnutia, počtu kusov a spôsobu prepravy a bude potvrdená pred odoslaním záväznej objednávky. Táto informácia je poskytovaná v súlade s § 3 ods. 1 písm. i) zákona č. 108/2024 Z.&nbsp;z. o ochrane spotrebiteľa.
              </p>
              <p className="mt-3 text-xs leading-relaxed text-brand-muted">
                Podrobný postup pri odstúpení od zmluvy nájdete na stránke{' '}
                <Link to="/reklamacie" className={LEGAL_LINK}>Reklamácie a vrátenie</Link>{' '}
                alebo vyplňte{' '}
                <Link to="/odstupenie-od-zmluvy" className={LEGAL_LINK}>formulár na odstúpenie od zmluvy</Link>.
              </p>
            </div>

          </div>
        </Container>
      </Section>

      {/* Platba */}
      <Section tone="sand">
        <Container>
          <div className="max-w-[1040px]">

            <h2 className="mb-10 text-os-h2">
              Platobné metódy
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div className="rounded-[3px] border border-brand-line bg-white/60 p-6 sm:p-8">
                <h3 className="mb-3 text-[1.1rem] font-semibold text-brand-dark">Online platba kartou</h3>
                <p className="text-[0.95rem] font-light leading-relaxed text-brand-dark/85">
                  Bezpečná platba prostredníctvom zabezpečenej platobnej brány. Akceptujeme Visa a Mastercard.
                </p>
              </div>
              <div className="rounded-[3px] border border-brand-line bg-white/60 p-6 sm:p-8">
                <h3 className="mb-3 text-[1.1rem] font-semibold text-brand-dark">Apple Pay / Google Pay</h3>
                <p className="text-[0.95rem] font-light leading-relaxed text-brand-dark/85">
                  Rýchla platba cez Apple Pay alebo Google Pay, ak sú na zariadení kupujúceho dostupné.
                </p>
              </div>
              <div className="rounded-[3px] border border-brand-line bg-white/60 p-6 sm:p-8">
                <h3 className="mb-3 text-[1.1rem] font-semibold text-brand-dark">Bankový prevod</h3>
                <p className="text-[0.95rem] font-light leading-relaxed text-brand-dark/85">
                  Bankový prevod je možný, ak to spoločnosť Orostone v konkrétnom prípade umožní. Pri väčších objednávkach alebo pri firemných zákazníkoch si spoločnosť Orostone vyhradzuje právo určiť individuálne platobné podmienky, vrátane úhrady zálohy alebo platby vopred.
                </p>
              </div>
              <div className="rounded-[3px] border border-brand-line bg-white/60 p-6 sm:p-8">
                <h3 className="mb-3 text-[1.1rem] font-semibold text-brand-dark">DPH a fakturácia</h3>
                <p className="text-[0.95rem] font-light leading-relaxed text-brand-dark/85">
                  Spoločnosť Orostone je platiteľom DPH (IČ DPH: SK2121930580). Daňový doklad zasielame elektronicky. Ak kupujúci požaduje vystavenie faktúry na podnikateľský subjekt, je povinný uviesť správne fakturačné údaje pri objednávke. Neskoršia zmena fakturačných údajov je možná len v rozsahu pripustenom príslušnými právnymi predpismi.
                </p>
              </div>
            </div>

          </div>
        </Container>
      </Section>

      {/* Kontakt */}
      <Section tone="chalk">
        <Container>
          <div className="max-w-[1040px]">
            <div className="flex flex-col gap-6 rounded-[3px] bg-brand-sand px-6 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-10 sm:py-10">
              <div>
                <h3 className="mb-2 text-os-h3">Otázky k doprave?</h3>
                <p className="font-light text-brand-muted">Radi vám poradíme pred objednaním.</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <ActionButton to="tel:+421917588738">
                  <Phone size={16} />
                  Zavolať
                </ActionButton>
                <ActionButton to="mailto:info@orostone.sk" variant="outline">
                  <Mail size={16} />
                  Napísať e-mail
                </ActionButton>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
};
