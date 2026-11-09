// ===========================================
// ODPORÚČTE OROSTONE — odporúčací program (schválil Martin 26. 10. 2026)
// ===========================================
// Jeden zdroj pre stránku /odporucte (pages/Odporucte.tsx) aj jej prerender
// (scripts/prerender.ts). Rovnaké sumy a pravidlá používa CRM (orosotne/orostone-crm,
// docs/odporucaci-program.md) a e-maily 08, 40, 41 a 42 v marketing/newsletter:
// pri zmene sumy alebo pravidla treba zmeniť aj tie.
import { BULK_DISCOUNT } from './pricing';
import type { PillarFaq } from './pillars/vyhody';

/** Odpočet z ceny materiálu pre nového zákazníka (s DPH). */
export const REFERRAL_FRIEND_EUR = 100;
/** Odmena odporúčajúcemu na účet. */
export const REFERRAL_REWARD_EUR = 150;
/** Odmena ako odpočet pri vlastnej ďalšej objednávke platní (s DPH). */
export const REFERRAL_CREDIT_EUR = 200;
export const REFERRAL_VALID_UNTIL = '30. 6. 2027';

const eur = (value: number) => `${value} €`;
const bulk = `${BULK_DISCOUNT.discountPercent} % od ${BULK_DISCOUNT.quantity} platní`;

export const ODPORUCTE_TITLE = 'Odporučte Orostone – odporúčací program | Orostone';
export const ODPORUCTE_DESCRIPTION =
  `Máte od Orostone pracovnú dosku? Dajte známemu svoj kód: pri objednávke platní dostane ${REFERRAL_FRIEND_EUR} € z ceny materiálu a vy ${REFERRAL_REWARD_EUR} €, keď zákazku zaplatí.`;
export const ODPORUCTE_H1 = 'Odporučte Orostone';
export const ODPORUCTE_LEAD =
  `Máte od nás pracovnú dosku a pýta sa vás na ňu niekto zo známych? Dajte mu svoj kód. Pri objednávke platní dostane ${eur(REFERRAL_FRIEND_EUR)} z ceny materiálu a vy ${eur(REFERRAL_REWARD_EUR)}, keď zákazku zaplatí.`;

export const ODPORUCTE_STEPS: { title: string; text: string }[] = [
  {
    title: 'Známy uvedie kód',
    text: 'Pri žiadosti o orientačnú cenu, v e-maile alebo telefonicky, najneskôr pred zaplatením zálohy.',
  },
  {
    title: 'V ponuke má odpočet',
    text: `${eur(REFERRAL_FRIEND_EUR)} z ceny materiálu. Sčíta sa aj s množstevnou zľavou ${bulk}.`,
  },
  {
    title: `Vy dostanete ${eur(REFERRAL_REWARD_EUR)}`,
    text: 'Mesiac po tom, čo známy zaplatí materiál, vám napíšeme kvôli číslu účtu.',
  },
];

export interface ReferralRule {
  id: string;
  number: string;
  title: string;
  clauses: string[];
}

export const ODPORUCTE_RULES: ReferralRule[] = [
  {
    id: 'kto-moze-odporucat',
    number: '1',
    title: 'Kto môže odporúčať',
    clauses: [
      'Zákazník, ktorý od Orostone kúpil platne a zákazku zaplatil (ďalej „odporúčajúci“).',
      'Program nie je určený pre kamenárstva, kuchynské štúdiá, architektov a dizajnérov, s ktorými spolupracujeme, ani pre zamestnancov Orostone a partnerských kamenárov.',
    ],
  },
  {
    id: 'osobny-kod',
    number: '2',
    title: 'Osobný kód',
    clauses: [
      'Odporúčajúci dostane osobný kód (napríklad JANA-482) a odkaz, v ktorom je kód vyplnený.',
      'Kód môže dať ľubovoľnému počtu známych. Kontakty na známych od neho nežiadame.',
    ],
  },
  {
    id: 'novy-zakaznik',
    number: '3',
    title: 'Nový zákazník',
    clauses: [
      'Fyzická osoba alebo firma, ktorá od Orostone ešte nekúpila platne.',
      'Nový zákazník nemôže byť ten istý človek ani tá istá domácnosť ako odporúčajúci a zákazka nemôže byť na tej istej adrese realizácie.',
    ],
  },
  {
    id: 'uplatnenie-kodu',
    number: '4',
    title: 'Ako uplatniť kód',
    clauses: [
      'Nový zákazník uvedie kód pri žiadosti o orientačnú cenu, v e-maile alebo telefonicky, najneskôr pred zaplatením zálohy.',
      'Po zaplatení zálohy sa kód uplatniť nedá.',
      'Na jednu zákazku platí jeden kód.',
    ],
  },
  {
    id: 'odpocet',
    number: '5',
    title: 'Čo dostane nový zákazník',
    clauses: [
      `Nový zákazník dostane v cenovej ponuke odpočet ${eur(REFERRAL_FRIEND_EUR)} s DPH z ceny materiálu, ak objedná aspoň jednu celú platňu.`,
      'Odpočet platí len na materiál od Orostone. Neplatí na vzorky ani na zameranie, výrobu, dopravu a montáž, ktoré robí a fakturuje partnerský kamenár.',
      `Odpočet sa sčíta s množstevnou zľavou ${bulk}; najprv sa uplatní zľava, potom odpočet. S inými zľavovými kódmi sa nesčíta.`,
      'Ak chcete nakúpiť cez e-shop orostone.sk, napíšte nám pred objednávkou. Pripravíme vám ponuku s odpočtom.',
    ],
  },
  {
    id: 'odmena',
    number: '6',
    title: 'Čo dostane odporúčajúci',
    clauses: [
      `Odporúčajúci dostane ${eur(REFERRAL_REWARD_EUR)} na bankový účet za každého nového zákazníka, ktorý uplatnil jeho kód a zaplatil celú cenu materiálu.`,
      `Namiesto peňazí si môže zvoliť odpočet ${eur(REFERRAL_CREDIT_EUR)} s DPH z ceny materiálu pri vlastnej ďalšej objednávke platní. Odpočet platí 24 mesiacov.`,
      'Nárok na odmenu vzniká 30 dní po tom, čo nový zákazník zaplatí celú cenu materiálu, ak medzitým zákazku nezrušil ani neodstúpil od zmluvy.',
      'Odmenu pošleme do 14 dní od chvíle, keď nám odporúčajúci oznámi číslo účtu.',
      'Počet odmien nie je obmedzený.',
      'Odmena nezávisí od hodnotenia na Google ani od zverejnenia fotiek kuchyne.',
    ],
  },
  {
    id: 'sukromie',
    number: '7',
    title: 'Súkromie',
    clauses: [
      'Odporúčajúcemu oznámime len to, že jeho kód bol uplatnený a odmena je pripravená. Meno, adresu ani sumu zákazky nového zákazníka mu neoznámime.',
      'Číslo účtu použijeme len na vyplatenie odmeny.',
    ],
  },
  {
    id: 'zneuzitie-a-zmeny',
    number: '8',
    title: 'Zneužitie a zmeny',
    clauses: [
      'Ak je odporúčanie zjavne účelové, napríklad ide o tú istú osobu pod iným menom alebo o tú istú adresu realizácie, nárok na odpočet ani na odmenu nevzniká.',
      'Orostone môže program zmeniť alebo ukončiť. Kódy uplatnené pred zmenou dokončíme za pôvodných podmienok.',
    ],
  },
];

export const ODPORUCTE_FAQ: PillarFaq[] = [
  {
    question: 'Komu môžem kód dať?',
    answer: 'Komukoľvek, kto od Orostone ešte nekúpil platne – rodine, susedom aj kolegom. Kontakty na nich od vás nepotrebujeme.',
  },
  {
    question: 'Musím napísať hodnotenie alebo poslať fotky?',
    answer: 'Nie. Odmena od hodnotenia ani od fotiek nezávisí.',
  },
  {
    question: 'Kedy dostanem odmenu?',
    answer: '30 dní po tom, čo známy zaplatí celú cenu materiálu. Napíšeme vám kvôli číslu účtu a peniaze pošleme do 14 dní.',
  },
  {
    question: 'Platí odpočet aj na výrobu a montáž?',
    answer: 'Nie. Odpočet je z ceny materiálu od Orostone. Zameranie, výrobu a montáž robí a fakturuje partnerský kamenár.',
  },
  {
    question: 'Koľkým známym môžem kód dať?',
    answer: 'Koľkým chcete. Odmenu dostanete za každého, kto zákazku zaplatí.',
  },
];
