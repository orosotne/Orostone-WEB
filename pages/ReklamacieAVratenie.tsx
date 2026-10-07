import React from 'react';
import { Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../components/UI/SEOHead';
import { ActionButton, Container, LEGAL_LINK, PageHero, Section } from '../components/Design';

export const ReklamacieAVratenie: React.FC = () => {
  return (
    <div>
      <SEOHead
        title="Reklamácie a vrátenie tovaru | OROSTONE"
        description="Reklamačný poriadok OROSTONE, postup pri reklamácii, vrátenie tovaru a zákonná zodpovednosť za vady pri nákupe cez e-shop."
        canonical="https://orostone.sk/reklamacie"
      />

      <PageHero
        eyebrow="Zákaznícky servis"
        title="Reklamácie a vrátenie tovaru"
        lead={
          <>
            Ak máte otázky k dodanému tovaru, kontaktujte nás na{' '}
            <a href="mailto:info@orostone.sk" className={LEGAL_LINK}>info@orostone.sk</a>.
            Reklamácie vybavujeme a pri uplatnení práva na odstúpenie od zmluvy postupujeme v súlade s platnými právnymi predpismi Slovenskej republiky.
          </>
        }
      />

      {/* Zodpovednosť za vady */}
      <Section tone="chalk" className="!pt-0">
        <Container>
          <div className="max-w-[1040px]">

            <h2 className="mb-10 text-os-h2">
              Zodpovednosť za vady
            </h2>

            <div className="mb-6 rounded-[3px] border border-brand-line bg-white/60 p-6 sm:p-8">
              <p className="mb-4 text-[0.95rem] font-light leading-relaxed text-brand-dark/85">
                Pri spotrebiteľskom predaji spoločnosť Orostone zodpovedá za vady, ktoré má tovar v čase dodania a ktoré sa prejavia do <strong className="text-brand-dark">24 mesiacov</strong> od dodania tovaru. Nejde o dobrovoľnú obchodnú záruku navyše, ale o zákonnú zodpovednosť za vady.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="rounded-[3px] border border-brand-line bg-white/60 p-6 sm:p-8">
                <h3 className="mb-3 text-[1.1rem] font-semibold text-brand-dark">Čo sa za vadu nepovažuje</h3>
                <ul className="space-y-2 text-[0.95rem] font-light text-brand-dark/85">
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-brand-muted">—</span>
                    Bežné, prirodzené a technologicky podmienené rozdiely vo farbe, kresbe, žilovaní, štruktúre alebo povrchu sinterovaného kameňa
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-brand-muted">—</span>
                    Rozdiely medzi vzorkou a celou platňou
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-brand-muted">—</span>
                    Rozdiely spôsobené zobrazením na monitore alebo mobilnom zariadení
                  </li>
                </ul>
              </div>

              <div className="rounded-r-[3px] border-l-2 border-brand-dark bg-brand-sand p-6 sm:p-8">
                <div className="flex items-start gap-3">
                  <div>
                    <h3 className="mb-2 text-[1.1rem] font-semibold text-brand-dark">Zodpovednosť sa nevzťahuje na</h3>
                    <ul className="space-y-1 text-[0.95rem] font-light text-brand-dark/85">
                      <li>• Neodbornú manipuláciu, rezanie, opracovanie alebo montáž</li>
                      <li>• Nevhodné montážne postupy, podklady, lepidlá, náradie alebo technológie</li>
                      <li>• Mechanické poškodenie po prevzatí tovaru</li>
                      <li>• Použitie nevhodných chemických prípravkov</li>
                      <li>• Spracovanie alebo montáž napriek zjavnej vade alebo nesúladu</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6 rounded-r-[3px] border-l-2 border-brand-dark bg-brand-sand p-6 sm:p-8">
              <div className="flex items-start gap-3">
                <div>
                  <h3 className="mb-2 text-[1.1rem] font-semibold text-brand-dark">Kontrola pred spracovaním</h3>
                  <p className="text-[0.95rem] font-light leading-relaxed text-brand-dark/85">
                    Kupujúci je povinný <strong>pred akýmkoľvek rezaním, opracovaním alebo montážou</strong> dôkladne skontrolovať najmä rozmer, dekor, odtieň, povrch a zjavné vady tovaru. Po spracovaní tovaru nemožno úspešne reklamovať vady alebo vlastnosti, ktoré boli zjavné alebo zistiteľné pred spracovaním.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </Container>
      </Section>

      {/* Uplatnenie reklamácie */}
      <Section tone="sand">
        <Container>
          <div className="max-w-[1040px]">

            <h2 className="mb-10 text-os-h2">
              Uplatnenie reklamácie
            </h2>

            <div className="mb-6 rounded-[3px] border border-brand-line bg-white/60 p-6 sm:p-8">
              <p className="mb-4 text-[0.95rem] font-light leading-relaxed text-brand-dark/85">
                Reklamáciu môžete uplatniť alebo vadu vytknúť e-mailom na{' '}
                <a href="mailto:info@orostone.sk" className={LEGAL_LINK}>info@orostone.sk</a>.
                Pre rýchlejšie vybavenie odporúčame uviesť:
              </p>
              <ul className="mb-6 space-y-2 text-[0.95rem] font-light text-brand-dark/85">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-brand-dark/40">✦</span>
                  Číslo objednávky alebo faktúry
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-brand-dark/40">✦</span>
                  Opis vady a dátum zistenia
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-brand-dark/40">✦</span>
                  Fotodokumentáciu vady (detail aj celkový pohľad), ak je to vzhľadom na povahu vady možné
                </li>
              </ul>

              <div className="space-y-3 rounded-[3px] bg-brand-sand p-5 text-[0.95rem] font-light leading-relaxed text-brand-dark/85">
                <p>
                  Po vytknutí vady vám spoločnosť Orostone <strong className="text-brand-dark">bezodkladne zašle písomné potvrdenie o vytknutí vady</strong> a uvedie lehotu, v ktorej vadu odstráni alebo vybaví uplatnené právo zo zodpovednosti za vady.
                </p>
                <p>
                  Táto lehota <strong className="text-brand-dark">nesmie presiahnuť 30 dní</strong> odo dňa vytknutia vady, ak dlhšia lehota nie je odôvodnená objektívnym dôvodom, ktorý nemožno ovplyvniť.
                </p>
                <p>
                  Ak je na riadne posúdenie vady potrebné sprístupnenie tovaru, obhliadka na mieste, odobratie vzorky, súčinnosť realizátora alebo predloženie technických podkladov, kupujúci je povinný poskytnúť primeranú súčinnosť. Ak spoločnosť Orostone zodpovednosť za vadu odmietne, oznámi dôvody odmietnutia písomne.
                </p>
              </div>
            </div>

          </div>
        </Container>
      </Section>

      {/* Odstúpenie od zmluvy */}
      <Section tone="chalk">
        <Container>
          <div className="max-w-[1040px]">

            <h2 className="mb-10 text-os-h2">
              Odstúpenie od zmluvy pri nákupe na diaľku
            </h2>

            <div className="mb-6 rounded-[3px] border border-brand-line bg-white/60 p-6 sm:p-8">
              <div className="flex items-start gap-3 mb-4">
                <h3 className="text-[1.1rem] font-semibold text-brand-dark">14-dňová lehota na odstúpenie</h3>
              </div>
              <p className="mb-4 text-[0.95rem] font-light leading-relaxed text-brand-dark/85">
                Ak ste spotrebiteľ a nakúpili ste cez internet, máte právo odstúpiť od zmluvy <strong className="text-brand-dark">bez uvedenia dôvodu do 14 dní</strong> od prevzatia tovaru.
              </p>
              <p className="mb-4 text-[0.95rem] font-light leading-relaxed text-brand-dark/85">
                Odstúpenie môžete zaslať:
              </p>
              <ul className="mb-4 space-y-2 text-[0.95rem] font-light text-brand-dark/85">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-brand-dark/40">✦</span>
                  E-mailom na <a href="mailto:info@orostone.sk" className={LEGAL_LINK}>info@orostone.sk</a>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-brand-dark/40">✦</span>
                  Poštou na adresu sídla spoločnosti
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-brand-dark/40">✦</span>
                  Prostredníctvom{' '}
                  <Link to="/odstupenie-od-zmluvy" className={LEGAL_LINK}>
                    vzorového formulára na odstúpenie od zmluvy
                  </Link>
                </li>
              </ul>
              <p className="text-[0.95rem] font-light leading-relaxed text-brand-dark/85">
                Spotrebiteľ je povinný najneskôr do 14 dní odo dňa odstúpenia zaslať tovar späť alebo ho odovzdať spoločnosti Orostone, ak spoločnosť Orostone nenavrhne iný spôsob prevzatia.
              </p>
            </div>

            {/* Náklady na vrátenie */}
            <div className="mb-6 rounded-r-[3px] border-l-2 border-brand-dark bg-brand-sand p-6 sm:p-8">
              <h3 className="mb-3 text-[1.1rem] font-semibold text-brand-dark">
                Náklady na vrátenie tovaru
              </h3>
              <p className="mb-3 text-[0.95rem] font-light leading-relaxed text-brand-dark/85">
                <strong>Náklady na vrátenie tovaru znáša spotrebiteľ.</strong> Keďže veľkoformátové platne vzhľadom na svoju povahu, hmotnosť a rozmery nemožno spravidla vrátiť bežnou poštovou službou, vracajú sa primeranou prepravou.
              </p>
              <p className="mb-3 text-[0.95rem] font-light leading-relaxed text-brand-dark/85">
                Priame náklady na vrátenie platní sú spravidla <strong className="text-brand-dark">od 150&nbsp;€ s DPH</strong> v Bratislave a okolí (do 50&nbsp;km) a <strong className="text-brand-dark">od 350&nbsp;€ s DPH</strong> na ostatnom území Slovenska, v závislosti od miesta vyzdvihnutia, počtu kusov a spôsobu dopravy. Vzorky môžete vrátiť aj bežnou poštovou zásielkou.
              </p>
            </div>

            {/* Stav vráteného tovaru */}
            <div className="mb-6 rounded-[3px] border border-brand-line bg-white/60 p-6 sm:p-8">
              <h3 className="mb-3 text-[1.1rem] font-semibold text-brand-dark">Stav vráteného tovaru</h3>
              <p className="mb-3 text-[0.95rem] font-light leading-relaxed text-brand-dark/85">
                Spotrebiteľ zodpovedá len za zníženie hodnoty tovaru, ktoré vzniklo v dôsledku takého zaobchádzania s tovarom, ktoré je nad rámec potrebný na zistenie vlastností a funkčnosti tovaru.
              </p>
              <p className="text-[0.95rem] font-light leading-relaxed text-brand-dark/85">
                Z dôvodu bezpečnej spätnej prepravy odporúčame tovar vrátiť v pôvodnom obale alebo v rovnocennom ochrannom balení. Absencia pôvodného obalu sama osebe nevylučuje platné odstúpenie od zmluvy, môže však mať vplyv na posúdenie zodpovednosti za poškodenie vzniknuté pri spätnom transporte.
              </p>
            </div>

            {/* Vrátenie platieb */}
            <div className="mb-6 rounded-[3px] border border-brand-line bg-white/60 p-6 sm:p-8">
              <h3 className="mb-3 text-[1.1rem] font-semibold text-brand-dark">Vrátenie platieb</h3>
              <p className="text-[0.95rem] font-light leading-relaxed text-brand-dark/85">
                Spoločnosť Orostone vráti spotrebiteľovi všetky platby, ktoré od neho prijala na základe zmluvy alebo v súvislosti s ňou, vrátane nákladov na dodanie v rozsahu najlacnejšieho bežného spôsobu dodania ponúkaného spoločnosťou Orostone, a to <strong className="text-brand-dark">do 14 dní</strong> od doručenia oznámenia o odstúpení od zmluvy. Spoločnosť Orostone nie je povinná vrátiť platby skôr, ako jej bude tovar doručený späť alebo kým spotrebiteľ nepreukáže jeho odoslanie späť, podľa toho, čo nastane skôr.
              </p>
            </div>

            {/* Formulár CTA */}
            <div className="mb-6 rounded-[3px] border border-brand-dark p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div>
                    <h3 className="mb-1 text-[1.1rem] font-semibold text-brand-dark">Vzorový formulár na odstúpenie od zmluvy</h3>
                    <p className="text-sm font-light text-brand-muted">
                      Podľa zákona č. 108/2024 Z.&nbsp;z. o ochrane spotrebiteľa
                    </p>
                  </div>
                </div>
                <Link
                  to="/odstupenie-od-zmluvy"
                  className="inline-flex min-h-[50px] flex-shrink-0 items-center justify-center gap-2 rounded-[10px] bg-brand-dark px-6 text-[0.74rem] font-bold uppercase tracking-[0.12em] text-brand-light no-underline transition-colors hover:bg-[#333331]"
                >
                  Otvoriť formulár
                </Link>
              </div>
            </div>

          </div>
        </Container>
      </Section>

      {/* Dôležité pri prevzatí */}
      <Section tone="sand">
        <Container>
          <div className="max-w-[1040px]">
            <div className="rounded-r-[3px] border-l-2 border-brand-dark bg-brand-light p-6 sm:p-8">
              <div className="flex items-start gap-3">
                <div>
                  <h3 className="mb-2 text-[1.1rem] font-semibold text-brand-dark">Dôležité – skontrolujte tovar pri prevzatí</h3>
                  <p className="text-[0.95rem] font-light leading-relaxed text-brand-dark/85">
                    Pri prevzatí zásielky si dôkladne skontrolujte stav balenia aj samotného tovaru. Viditeľné poškodenie je potrebné <strong>bezodkladne zaznamenať v dodacom liste</strong> alebo inom prepravnom doklade dopravcu a zdokumentovať fotografiami. Poškodenie pri doprave, ktoré nebolo zaznamenané pri prevzatí, môže byť následne podstatne ťažšie preukázateľné.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Súvisiace dokumenty */}
      <Section tone="chalk" className="!pb-0">
        <Container>
          <div className="max-w-[1040px]">
            <div className="border-y border-brand-line py-5">
              <p className="mb-3 text-os-eyebrow uppercase text-brand-muted">Súvisiace dokumenty</p>
              <div className="flex flex-wrap gap-4 text-sm">
                <Link to="/vop" className={LEGAL_LINK}>Všeobecné obchodné podmienky</Link>
                <span className="text-brand-line">|</span>
                <Link to="/doprava" className={LEGAL_LINK}>Doprava a platba</Link>
                <span className="text-brand-line">|</span>
                <Link to="/odstupenie-od-zmluvy" className={LEGAL_LINK}>Formulár na odstúpenie od zmluvy</Link>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section tone="chalk" className="!pt-10">
        <Container>
          <div className="max-w-[1040px]">
            <div className="flex flex-col gap-6 rounded-[3px] bg-brand-sand px-6 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-10 sm:py-10">
              <div>
                <h3 className="mb-2 text-os-h3">Máte otázku k reklamácii?</h3>
                <p className="font-light text-brand-muted">Sme tu pre vás.</p>
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
