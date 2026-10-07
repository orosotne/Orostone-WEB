import React from 'react';
import { Check, X } from 'lucide-react';
import { SEOHead } from '@/components/UI/SEOHead';
import {
  ActionButton,
  Container,
  Eyebrow,
  FaqList,
  FeatureGrid,
  GoldBand,
  PageHero,
  PageHeroImage,
  ResponsiveImage,
  Section,
  SectionHeader,
  TextLink,
} from '@/components/Design';
import {
  SINTEROVANY_KAMEN_FAQ as FAQ_ITEMS,
  SINTEROVANY_KAMEN_COMPARISON as COMPARISON_DATA,
} from '@/data/pillars/sinterovanyKamen';

/* =============================================================
   FAQ Schema JSON-LD
   ============================================================= */
const faqStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
};

/* =============================================================
   OBSAH SEKCIÍ
   ============================================================= */
const IMG = '/images/stranky';

const STATS = [
  { label: 'Nasiakavosť', value: '< 0,1 %' },
  { label: 'Tvrdosť (Mohs)', value: '6–8' },
  { label: 'Tepelná odolnosť', value: '> 300 °C' },
  { label: 'Zloženie', value: '100 % minerály' },
];

const PROCESS = [
  {
    title: 'Výber minerálov',
    desc: 'Starostlivo vybraný kremeň, živec, íl a kovové oxidy — výlučne prírodné suroviny bez syntetických prímesí.',
    img: 'sk-vyroba-mineraly',
    imgAlt: 'Prírodné minerály použité pri výrobe sinterovaného kameňa',
  },
  {
    title: 'Extrémna kompakcia',
    desc: 'Minerálna zmes sa zlisuje pod tlakom 10 000 – 25 000 ton. To je ekvivalent hmotnosti dvoch a pol Eiffelových veží na jednej doske.',
    img: 'sk-vyroba-lisovanie',
    imgAlt: 'Kompakcia minerálov pod tlakom 25 000 ton',
  },
  {
    title: 'Sintrovanie',
    desc: 'Doska sa vypáli pri teplote nad 1 200 °C. Častice sa spoja na molekulárnej úrovni — vzniká monolitický, nepórovitý povrch.',
    img: 'sk-vyroba-vypal',
    imgAlt: 'Sintrovanie pri teplote 1\u00A0200\u00A0°C',
  },
];

const FEATURES = [
  { title: 'Odolnosť teplu', text: 'Odolá teplotám nad 300 °C. Horúci hrniec priamo na dosku — bez strachu.' },
  { title: 'Odolnosť voči poškriabaniu', text: 'Tvrdosť 6–8 na Mohsovej stupnici. Tvrdší ako žula (6) a väčšina kuchynského náradia.' },
  { title: 'Nasiakavosť pod 0,1 %', text: 'Víno, káva ani olej sa nevsiaknu. Na hladkom, nepórovitom povrchu sa baktérie a plesne nemajú kde uchytiť.' },
  { title: 'UV stabilita', text: 'Farba sa nemení ani na priamom slnku. Ideálne aj pre exteriéry a fasády.' },
  { title: 'Chemická odolnosť', text: 'Trieda A podľa ISO 10545-13. Odolný voči kyselinám, zásadám aj bazénovej chémii.' },
  { title: 'Bez impregnácie', text: 'Nepórovitý povrch netreba tesniť ani impregnovať. Na bežné čistenie stačí vlhká utierka a saponát.' },
  { title: 'Veľké formáty', text: 'Dosky až 3 200 × 1 600 mm. Menej spojov, čistejší dizajn, jednoduchšia montáž.' },
  { title: 'Dizajnová variabilita', text: 'Matný, saténový aj leštený povrch. Dekory s kresbou mramoru, travertínu a kameňa, od bielej po čiernu.' },
];

// Kitchen, bathroom, backsplash, fireplace and furniture are visualizations with real Orostone decors.
const APPLICATIONS = [
  {
    title: 'Kuchynské dosky a ostrovčeky',
    desc: 'Odolnosť voči teplu, škvrnám a nožom robí zo sinterovaného kameňa ideálnu pracovnú plochu. Dosky bez spojov vďaka veľkým formátom.',
    img: 'sk-kuchyna',
    imgAlt: 'Kuchyňa s ostrovčekom zo Statuario Diamante a dubovými skrinkami',
  },
  {
    title: 'Kúpeľne',
    desc: 'Nasiakavosť pod 0,1 % bráni rastu plesní a baktérií. Vhodné na obklady, podlahy, vaničky aj umývadlá.',
    img: 'sk-kupelna',
    imgAlt: 'Kúpeľňa s umývadlom a obkladom steny v dekore Taj Mahal',
  },
  {
    title: 'Obklady a zásteny',
    desc: 'Bezšvové riešenia vďaka veľkým formátom dosiek. Jednoduché čistenie a elegantný vzhľad.',
    img: 'sk-zastena',
    imgAlt: 'Kuchynská zástena a pracovná doska v dekore Wild Forest',
  },
  {
    title: 'Fasády',
    desc: 'UV stabilita, mrazuvzdornosť a nízka hmotnosť (od 3 mm). Farba sa nemení ani po rokoch na priamom slnku.',
    img: 'sk-fasada',
    imgAlt: 'Fasáda z veľkoformátových platní sinterovaného kameňa v dekore Astrana Grey (vizualizácia)',
  },
  {
    title: 'Krbové obklady',
    desc: 'Materiál vzniká pri 1 200 °C — teplo z krbu mu neublíži. Bezpečná a estetická voľba.',
    img: 'sk-krb',
    imgAlt: 'Krbová stena obložená dekorom Gothic Gold v obývačke',
  },
  {
    title: 'Nábytok',
    desc: 'Stolové dosky, police, kúpeľňové konzoly. Tenké formáty (6 mm) pre ľahkú a modernú konštrukciu.',
    img: 'sk-nabytok',
    imgAlt: 'Jedálenský stôl s doskou Roman Travertine a čalúnenými stoličkami',
  },
];

const FINISHES = [
  {
    title: 'Matný (Matt)',
    desc: 'Jemný, hladký povrch bez odleskov. Minimalizuje viditeľnosť odtlačkov prstov a poskytuje elegantný, moderný vzhľad. Odolnosť voči škvrnám triedy 5 podľa ISO 10545-14.',
    img: 'sk-povrch-matny',
    imgAlt: 'Matný povrch sinterovaného kameňa v dekore Gothic Gold',
  },
  {
    title: 'Leštený (Polished)',
    desc: 'Vysoko lesklý, zrkadlový povrch, ktorý zvýrazňuje hĺbku a kresbu materiálu. Ideálny pre luxusné interiéry. Vyžaduje pravidelné utieranie do sucha.',
    img: 'sk-povrch-lesteny',
    imgAlt: 'Leštený povrch sinterovaného kameňa v dekore Calacatta Top s odrazom okna',
  },
  {
    title: 'Saténový (Silk)',
    desc: 'Jemne zamatový povrch medzi matným a lešteným. Svetlo odráža mäkko a je zhovievavý k odtlačkom prstov. V ponuke ho majú napríklad dekory Taj Mahal a Super White Extra.',
    img: 'sk-povrch-saten',
    imgAlt: 'Saténový povrch Silk v dekore Taj Mahal',
  },
];

const CARE_YES = [
  'Vlhká mäkká utierka alebo špongia',
  'pH neutrálny čistiaci prostriedok',
  'Bežný saponát s vodou',
  'Utretie do sucha po čistení',
  'Neabrazívny prípravok na tvrdšie nečistoty',
  'Ihneď utierať rozliaty olej alebo víno',
];

const CARE_NO = [
  'Bielidlo a chlórové prípravky',
  'Amoniak a agresívne chemikálie',
  'Brúsne hubky a oceľovú vlnu',
  'Kyselinu fluorovodíkovú',
  'Čističe s voskom, olejom alebo leštenkou',
  'Vysokotlakový čistič na tesniace škáry',
];

const below = 'mt-[clamp(40px,5vw,64px)]';
const th = 'py-4 pr-4 text-left text-[0.82rem] font-semibold text-brand-muted';
const td = 'py-4 pr-4 align-top';
const COLUMNS = [
  { key: 'sintered', label: 'Sinterovaný kameň' },
  { key: 'natural', label: 'Prírodný kameň' },
  { key: 'quartz', label: 'Quartz kompozit' },
  { key: 'ceramic', label: 'Keramika' },
  { key: 'laminate', label: 'Laminát' },
] as const;

/* =============================================================
   HLAVNÝ KOMPONENT
   ============================================================= */
export const SinterovanyKamen = () => {
  return (
    <div>
      <SEOHead
        title="Sinterovaný kameň: cena, výhody, použitie | OROSTONE"
        description="Čo je sinterovaný kameň, koľko stojí a kedy dáva zmysel ako pracovná doska. Praktický sprievodca pre kuchyňu, kde nechcete robiť kompromis."
        canonical="https://orostone.sk/sinterovany-kamen"
        structuredData={faqStructuredData}
        maxVideoPreview={0}
      />

      {/* 1. HERO */}
      <PageHero
        eyebrow="O materiáli"
        title="Sinterovaný kameň"
        lead="Prírodné minerály spečené pri vysokej teplote a tlaku. Výsledkom je hustý povrch, ktorý odolá teplu, škvrnám aj poškriabaniu a nepotrebuje impregnáciu."
        actions={
          <>
            <ActionButton variant="dark" to="/kategoria/sintered-stone" arrow>
              Pozrieť kolekcie
            </ActionButton>
            <TextLink to="/vzorky">Vyžiadať vzorku</TextLink>
          </>
        }
        media={
          <PageHeroImage
            base={`${IMG}/sk-calacatta-top`}
            alt="Pracovná doska Calacatta Top so zapusteným drezom, keramickou miskou a ľanovou utierkou, pohľad zhora"
            caption="Vizualizácia s dekorom Calacatta Top"
            position="50% 40%"
          />
        }
      />

      {/* 2. ČO JE SINTEROVANÝ KAMEŇ */}
      <Section tone="sand">
        <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-[clamp(48px,6vw,104px)]">
          <div className="grid justify-items-start gap-6">
            <Eyebrow>Definícia</Eyebrow>
            <h2 className="text-os-h2">Čo je sinterovaný kameň</h2>
            <p className="max-w-[58ch] text-os-lead font-light text-brand-muted">
              Sinterovaný kameň je pokročilý povrchový materiál vyrobený výhradne z prírodných minerálov — kremenca, živca, ílu a
              kovových oxidov. Výrobný proces napodobňuje geologické formovanie hornín v zemskej kôre, no namiesto miliónov rokov
              trvá len niekoľko hodín.
            </p>
            <p className="max-w-[58ch] text-os-lead font-light text-brand-muted">
              Na rozdiel od quartzových kompozitov neobsahuje žiadne živice ani syntetické spojivá. Výsledkom je plne
              vitrifikovaný, nepórovitý povrch s výnimočnou odolnosťou voči teplu, škvrnám, poškriabaniu a UV žiareniu.
            </p>
            <dl className="mt-2 grid w-full grid-cols-2 gap-x-[clamp(24px,3vw,48px)] gap-y-7">
              {STATS.map((s) => (
                <div key={s.label} className="grid content-start gap-2 border-t border-brand-dark pt-5">
                  <dt className="order-2 text-[0.88rem] font-normal text-brand-muted">{s.label}</dt>
                  <dd className="order-1 m-0 text-[clamp(1.5rem,2.2vw,2rem)] font-semibold leading-none tracking-[-0.02em] tabular-nums">
                    {s.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <figure className="m-0 grid gap-3">
            <ResponsiveImage
              base={`${IMG}/sk-platne`}
              widths={[640, 1200]}
              ratio={0.8}
              alt="Tri veľkoformátové platne sinterovaného kameňa opreté o stenu na dubovom podstavci"
              sizes="(min-width: 1024px) 46vw, 100vw"
              className="aspect-[4/5] w-full rounded-[3px] object-cover"
            />
            <figcaption className="text-[0.8rem] font-normal text-brand-muted">Vizualizácia veľkoformátových platní Orostone</figcaption>
          </figure>
        </Container>
      </Section>

      {/* 3. AKO SA VYRÁBA */}
      <Section tone="graphite">
        <Container>
          <SectionHeader
            onDark
            eyebrow="Výrobný proces"
            title="Ako sa sinterovaný kameň vyrába"
            lead="Tri kroky, v ktorých sa z prírodných minerálov stane hustý a odolný povrch."
          />
          <ol className={`${below} grid gap-x-[clamp(24px,3vw,40px)] gap-y-12 md:grid-cols-3`}>
            {PROCESS.map((item, i) => (
              <li key={item.title} className="grid content-start gap-3">
                <ResponsiveImage
                  base={`${IMG}/${item.img}`}
                  widths={[640, 1200]}
                  ratio={1.5}
                  alt={item.imgAlt}
                  sizes="(min-width: 768px) 30vw, 100vw"
                  className="mb-3 aspect-[3/2] w-full rounded-[3px] object-cover"
                />
                <span className="border-t border-brand-light/20 pt-5 text-[clamp(1.5rem,1.9vw,1.9rem)] font-semibold leading-none tracking-[-0.02em]" aria-hidden="true">
                  {i + 1}
                </span>
                <h3 className="mt-2 text-[1.2rem] font-medium leading-snug">{item.title}</h3>
                <p className="max-w-[44ch] font-light text-brand-light/75">{item.desc}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* 4. VÝHODY */}
      <Section tone="chalk">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
            <SectionHeader
              title="Výhody sinterovaného kameňa"
              lead="Prečo si ho vyberajú architekti, kuchynské štúdiá aj nároční majitelia domov."
            />
            <TextLink to="/vyhody">Zistiť viac o výhodách</TextLink>
          </div>
          <FeatureGrid items={FEATURES} columns={4} className={below} />
        </Container>
      </Section>

      {/* 5. POROVNANIE S ALTERNATÍVAMI */}
      <Section tone="sand">
        <Container>
          <SectionHeader
            title="Porovnanie s inými materiálmi"
            lead="Objektívne porovnanie kľúčových parametrov. Bez marketingových fráz — len overené fakty."
          />
          {/* Desktop Table */}
          <div className={`${below} hidden lg:block`}>
            <table className="w-full border-collapse text-[0.95rem]">
              <thead>
                <tr className="border-b border-brand-dark">
                  <th className={th}>Vlastnosť</th>
                  {COLUMNS.map((c, i) => (
                    <th key={c.key} className={`${th} ${i === 0 ? 'bg-brand-light px-4 text-brand-dark' : 'pl-4'}`}>
                      {c.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON_DATA.map((row) => (
                  <tr key={row.property} className="border-b border-brand-line">
                    <td className={`${td} font-medium`}>{row.property}</td>
                    {COLUMNS.map((c, i) => (
                      <td key={c.key} className={`${td} ${i === 0 ? 'bg-brand-light px-4 font-semibold' : 'pl-4 font-light text-brand-muted'}`}>
                        {row[c.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Mobile Cards */}
          <div className={`${below} grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:hidden`}>
            {COMPARISON_DATA.map((row) => (
              <div key={row.property} className="border-t border-brand-dark pt-4">
                <h4 className="mb-3 font-semibold">{row.property}</h4>
                <dl className="m-0 grid gap-1.5 text-[0.92rem]">
                  {COLUMNS.map((c, i) => (
                    <div key={c.key} className="flex items-baseline justify-between gap-4">
                      <dt className={i === 0 ? 'font-semibold' : 'font-normal text-brand-muted'}>{c.label}</dt>
                      <dd className={`m-0 text-right ${i === 0 ? 'font-semibold' : 'font-light text-brand-muted'}`}>{row[c.key]}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* 6. POUŽITIE V INTERIÉRI */}
      <Section tone="chalk">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
            <SectionHeader
              eyebrow="Aplikácie"
              title="Kde sa sinterovaný kameň používa"
              lead="Od kuchynských dosiek až po fasády. Jeden materiál, nekonečné možnosti."
            />
            <TextLink to="/realizacie">Pozrieť realizácie</TextLink>
          </div>
          <ul className={`${below} grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3`}>
            {APPLICATIONS.map((item) => (
              <li key={item.title} className="grid content-start gap-3">
                <ResponsiveImage
                  base={`${IMG}/${item.img}`}
                  widths={[640, 1200]}
                  ratio={4 / 3}
                  alt={item.imgAlt}
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 100vw"
                  className="mb-2 aspect-[4/3] w-full rounded-[3px] object-cover"
                />
                <h3 className="text-[1.2rem] font-semibold leading-snug">{item.title}</h3>
                <p className="max-w-[48ch] font-light text-brand-muted">{item.desc}</p>
              </li>
            ))}
          </ul>
          <p className="mt-10 text-[0.84rem] font-normal text-brand-muted">
            Ilustračné vizualizácie. V kuchyni, kúpeľni, na zástene, fasáde, krbe a stole je skutočný dekor Orostone: Statuario Diamante,
            Taj Mahal, Wild Forest, Astrana Grey, Gothic Gold a Roman Travertine.
          </p>
        </Container>
      </Section>

      {/* 7. POVRCHY A VZHĽADY */}
      <Section tone="sand">
        <Container>
          <SectionHeader
            title="Povrchové úpravy"
            lead="Každý povrch mení charakter materiálu. Vyberte si ten, ktorý najlepšie ladí s vaším interiérom."
          />
          <ul className={`${below} grid gap-x-5 gap-y-12 md:grid-cols-3`}>
            {FINISHES.map((item) => (
              <li key={item.title} className="grid content-start gap-3">
                <ResponsiveImage
                  base={`${IMG}/${item.img}`}
                  widths={[640, 1200]}
                  ratio={4 / 3}
                  alt={item.imgAlt}
                  sizes="(min-width: 768px) 30vw, 100vw"
                  className="mb-2 aspect-[4/3] w-full rounded-[3px] object-cover"
                />
                <h3 className="text-[1.2rem] font-semibold leading-snug">{item.title}</h3>
                <p className="max-w-[48ch] font-light text-brand-muted">{item.desc}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* 8. ÚDRŽBA A ČISTENIE */}
      <Section tone="chalk">
        <Container>
          <SectionHeader
            title="Údržba a čistenie"
            lead="Minimálna starostlivosť, maximálny výsledok. Žiadna impregnácia, žiadne špeciálne prípravky."
          />
          <div className={`${below} grid gap-x-[clamp(32px,5vw,80px)] gap-y-12 md:grid-cols-2`}>
            {[
              { title: 'Odporúčame', items: CARE_YES, Icon: Check },
              { title: 'Nepoužívajte', items: CARE_NO, Icon: X },
            ].map(({ title, items, Icon }) => (
              <div key={title} className="grid content-start gap-4">
                <h3 className="flex items-center gap-3 text-os-h3">
                  <span className="grid h-9 w-9 place-items-center rounded-full border border-brand-dark" aria-hidden="true">
                    <Icon size={17} strokeWidth={1.75} />
                  </span>
                  {title}
                </h3>
                <ul className="border-t border-brand-line">
                  {items.map((item) => (
                    <li key={item} className="flex items-start gap-3 border-b border-brand-line py-3 font-light">
                      <Icon size={15} strokeWidth={1.75} className="mt-1 flex-none text-brand-muted" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* 9. FAQ */}
      <Section tone="sand">
        <Container className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-[clamp(48px,6vw,104px)]">
          <SectionHeader title="Často kladené otázky" lead="Odpovede na najčastejšie otázky o sinterovanom kameni." />
          <FaqList items={FAQ_ITEMS} asHeadings />
        </Container>
      </Section>

      {/* 10. ZÁVER + CTA */}
      <Section tone="chalk">
        <Container className="grid items-end gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <SectionHeader
            title="Pripravený na sinterovaný kameň?"
            lead="Pozrite si materiál zblízka: objednajte si vzorku, alebo pošlite pôdorys a získajte orientačnú cenu."
          />
          <div className="grid gap-5 lg:justify-items-end">
            <ActionButton variant="dark" to="/vzorky" arrow>
              Objednať vzorku zadarmo
            </ActionButton>
            <div className="flex flex-wrap gap-x-8 gap-y-3 lg:justify-end">
              <TextLink to="/kategoria/sintered-stone">Prezrieť kolekcie</TextLink>
              <TextLink to="/realizacie">Pozrieť realizácie</TextLink>
              <TextLink to="/kontakt">Kontaktujte nás</TextLink>
            </div>
          </div>
        </Container>
      </Section>

      <GoldBand od="sinterovany-kamen" />
    </div>
  );
};

export default SinterovanyKamen;
