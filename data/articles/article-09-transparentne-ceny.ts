import { BlogArticle, BLOG_AUTHOR_OROSTONE } from '../blogTypes';
import {
  SLAB_PRICES,
  SLAB_PRICE_MIN,
  SLAB_PRICE_MAX,
  INSTALLATION_RATE_PER_M2,
  COUNTERTOP_PER_BM,
  formatEur,
} from '../pricing';

// Live prices — interpolated at build time from the Shopify-synced catalog,
// so the article can never contradict the e-shop or /cennik.
const skEur = (n: number): string => formatEur(n);
const enEur = (n: number): string => `€${n.toFixed(2)}`;

const skPriceRows = [...SLAB_PRICES]
  .sort((a, b) => a.pricePerM2 - b.pricePerM2)
  .map((p) => `<tr><td><a href="/produkt/${p.id}">${p.name}</a></td><td>${skEur(p.pricePerM2)}/m²</td></tr>`)
  .join('');

const enPriceRows = [...SLAB_PRICES]
  .sort((a, b) => a.pricePerM2 - b.pricePerM2)
  .map((p) => `<tr><td><a href="/produkt/${p.id}">${p.name}</a></td><td>${enEur(p.pricePerM2)}/m²</td></tr>`)
  .join('');

export const ARTICLE_09: BlogArticle = {
  id: 'transparent-pricing-quote',
  slug: 'transparentne-ceny-cenova-ponuka',
  category: 'trust-builders',
  publishDate: '2026-07-24',
  lastModified: '2026-07-24',
  readTimeMinutes: 8,
  heroImage: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200',
  author: BLOG_AUTHOR_OROSTONE,
  tags: ['sinterovaný kameň', 'ceny', 'cenová ponuka', 'transparentnosť', 'cena za bežný meter'],

  sk: {
    title: 'Transparentné ceny: čo musí obsahovať tvoja cenová ponuka',
    subtitle: 'Sprievodca cenovou ponukou na sinterovaný kameň — bez skrytých poplatkov a prekvapení na faktúre',
    excerpt:
      'Dve ponuky na tú istú kuchyňu sa môžu líšiť o stovky eur — a lacnejšia môže byť v skutočnosti drahšia. Zisti, čo musí férová ponuka obsahovať a na čo si dať pozor.',
    metaTitle: 'Cenová ponuka na sinterovaný kameň: čo musí obsahovať | OROSTONE',
    metaDescription: `Čo musí obsahovať férová cenová ponuka na pracovnú dosku zo sinterovaného kameňa. Reálne ceny ${Math.round(COUNTERTOP_PER_BM.min)}–${Math.round(COUNTERTOP_PER_BM.max)} €/bm, rozpis položiek a skryté náklady, na ktoré si dať pozor.`,
    directAnswer: `Férová cenová ponuka na pracovnú dosku zo sinterovaného kameňa musí obsahovať rozpis: materiál, fabrikáciu (výrezy, hrany), dopravu, montáž a DPH. Kompletná doska vychádza orientačne ${COUNTERTOP_PER_BM.min}–${COUNTERTOP_PER_BM.max} €/bm vrátane fabrikácie a montáže. Pri ponuke bez rozpisu položiek porovnávaš jablká s hruškami.`,
    content: `
<p class="article-tldr-label">Zhrnutie článku</p>
<ul class="article-tldr">
  <li>Kompletná pracovná doska vychádza orientačne <strong>${COUNTERTOP_PER_BM.min}–${COUNTERTOP_PER_BM.max} €/bm</strong> vrátane fabrikácie a montáže</li>
  <li>Materiál (platňa 3200 × 1600 × 12 mm) stojí <strong>${skEur(SLAB_PRICE_MIN)}–${skEur(SLAB_PRICE_MAX)}/m² s DPH</strong> podľa dekoru</li>
  <li>Férová ponuka má rozpis: materiál, výrezy, hrana, doprava, montáž — každá položka zvlášť</li>
  <li>Najčastejšie skryté náklady: výrezy, opracovanie hrán, výnos do bytu a využitie platne</li>
</ul>

<p>Povedzme si to na rovinu: väčšina dodávateľov kameňa ceny nezverejňuje. „Napíšte nám a pripravíme ponuku na mieru." Znie to ústretovo, ale v praxi to znamená jedno — nemáš sa čoho chytiť a dve ponuky nevieš porovnať.</p>

<p>V Orostone sme sa rozhodli ísť opačnou cestou. Ceny všetkých dekorov máš na webe, sadzbu za realizáciu tiež. V tomto článku ti ukážem, ako sa cena pracovnej dosky reálne skladá — aby si každú ponuku, aj od konkurencie, vedel prečítať ako profík.</p>

<h2 id="kolko-stoji">Koľko stojí sinterovaný kameň? Reálne čísla</h2>

<p>Začnime materiálom. Platňa sinterovaného kameňa má formát <strong>3200 × 1600 mm</strong> a hrúbku <strong>12 mm</strong>. Toto sú aktuálne ceny všetkých dekorov v našej ponuke (synchronizované s e-shopom):</p>

<table>
  <thead><tr><th>Dekor</th><th>Cena za m² s DPH</th></tr></thead>
  <tbody>${skPriceRows}</tbody>
</table>

<p>Kompletný prehľad vrátane cien za celú platňu nájdeš v <a href="/cennik">cenníku</a>.</p>

<div class="article-highlight">
  <strong>Pozor na jednotky.</strong> Cena materiálu sa uvádza za m². Cena hotovej dosky sa uvádza za bežný meter (€/bm) — a práve tá ťa zaujíma, lebo obsahuje aj prácu.
</div>

<h2 id="cena-za-bezny-meter">Čo znamená cena za bežný meter (€/bm)?</h2>

<p>Bežný meter je meter dĺžky hotovej dosky v štandardnej hĺbke kuchynskej linky (~60 cm) — vrátane rezania, výrezov, hrán, dopravy a montáže. Je to jediná jednotka, v ktorej sa dajú ponuky medzi dodávateľmi férovo porovnať.</p>

<p>Pri sinterovanom kameni a kvalitnej fabrikácii počítaj orientačne:</p>

<ul>
  <li><strong>okolo ${COUNTERTOP_PER_BM.min} €/bm</strong> — vstupná hladina: jednoduchá rovná linka, základný dekor, rovná hrana, málo výrezov</li>
  <li><strong>okolo 400 €/bm</strong> — stredná hladina: prémiový dekor alebo viac výrezov a náročnejšia hrana</li>
  <li><strong>${COUNTERTOP_PER_BM.max} €/bm a viac</strong> — prémiová hladina: výrazný dekor, ostrovček, book-match, mitrované hrany</li>
</ul>

<p><strong>Ponuka výrazne pod ${COUNTERTOP_PER_BM.min} €/bm by ťa mala zaujímať, nie potešiť.</strong> Niečo v procese sa pravdepodobne škrtá — slabšie podlepenie, jednoduchšia hrana, alebo doprava a montáž „prekvapivo" nie sú v cene. Viac o cenových hladinách sme písali v článku o <a href="/blog/umely-kamen-pracovna-doska">umelom kameni na pracovnú dosku</a>.</p>

<h2 id="co-musi-obsahovat">Čo musí obsahovať férová cenová ponuka</h2>

<p>Toto je kľúčové. Ak ponuka obsahuje len jedno číslo, nevieš, čo v ňom je — a čo ti prídu doúčtovať pri montáži. Žiadaj rozpis týchto položiek:</p>

<ul>
  <li><strong>Materiál</strong> — dekor, počet platní a cena za platňu alebo m²</li>
  <li><strong>Fabrikácia</strong> — rezanie, výrezy (drez, varná doska, batéria), opracovanie hrán, leštenie</li>
  <li><strong>Doprava</strong> — vrátane výnosu na miesto montáže (poschodie bez výťahu je iná cena než prízemie)</li>
  <li><strong>Montáž</strong> — osadenie, lepenie spojov, škárovanie</li>
  <li><strong>DPH</strong> — jasne uvedené, či sú ceny s DPH alebo bez</li>
</ul>

<div class="article-tip">
  <strong>Tip:</strong> Ak dodávateľ rozpis odmieta („to je všetko v cene"), pýtaj sa, čo sa stane, keď sa počas realizácie objaví výrez navyše alebo ťažší prístup. Práve tam vznikajú doúčtovania.
</div>

<h2 id="skryte-naklady">Skryté náklady, na ktoré si daj pozor</h2>

<p>A teraz to dôležité — položky, ktoré v lacných ponukách „chýbajú" najčastejšie:</p>

<ul>
  <li><strong>Výrezy.</strong> Drez, varná doska a batéria sú tri výrezy. Pri cene 40–80 € za výrez je to rozdiel, ktorý v ponuke vidieť musíš.</li>
  <li><strong>Opracovanie hrán.</strong> Rovná hrana je základ; skosená, zaoblená alebo mitrovaná hrana stojí viac. Ktorá je v cene?</li>
  <li><strong>Využitie platne.</strong> Platíš za celé platne, nie za výslednú dosku. Dobrý dodávateľ navrhne rozloženie tak, aby odpad bol čo najmenší — a povie ti, koľko platní projekt potrebuje.</li>
  <li><strong>Doprava a výnos.</strong> Platňa váži okolo 148 kg. Výnos na 3. poschodie bez výťahu nie je detail.</li>
  <li><strong>Spoje.</strong> Počet spojov ovplyvňuje prácnosť aj vzhľad. Kde budú a koľko ich bude?</li>
</ul>

<h2 id="priklad-z-praxe">Príklad z praxe: lacnejšia ponuka za viac peňazí</h2>

<p>Predstav si, že máš na kuchyňu s ostrovčekom dve ponuky: <strong>350 €/bm</strong> a <strong>420 €/bm</strong>. Prvá vyzerá jasne výhodnejšie.</p>

<p>Potom si vyžiadaš rozpis. Prvá ponuka: materiál + rezanie. Výrezy 3 × 60 €, mitrovaná hrana ostrovčeka 180 €, doprava s výnosom 120 € a montáž 250 € — „podľa skutočnosti". Druhá ponuka: všetko v cene.</p>

<p><strong>Pri 5 bm je prvá ponuka po doúčtovaní drahšia o viac ako 300 €</strong> — a to si sa to dozvedel až pri montáži. Presne preto je rozpis položiek dôležitejší než výsledné číslo.</p>

<h2 id="ako-to-robime">Ako to robíme v Orostone</h2>

<p>Jednoducho — čísla máš vopred:</p>

<ul>
  <li><strong>Ceny dekorov</strong> sú verejné na <a href="/cennik">/cennik</a> aj pri každom produkte, synchronizované s e-shopom.</li>
  <li><strong>Kompletná realizácia</strong> — zameranie, doprava, opracovanie hrán, leštenie a montáž — sa počíta sadzbou <strong>${INSTALLATION_RATE_PER_M2} €/m² s DPH</strong>. Výrobu a montáž realizujú partnerskí kamenári so skúsenosťou so sinterovaným kameňom.</li>
  <li><strong>Ponuka s rozpisom</strong> — materiál, fabrikácia, doprava a montáž zvlášť. Žiadne „všetko v cene" bez detailov.</li>
  <li><strong>Garancia ceny</strong> — rezervačný poplatok 99 € ti <a href="/podmienky-rezervacie-ceny">garantuje aktuálnu cenu na 6 mesiacov</a>, ak sa rozhoduješ dlhšie.</li>
</ul>

<p>Či sa sinterovaný kameň oplatí aj z pohľadu dlhodobých nákladov, sme rozobrali v článku <a href="/blog/oplati-sa-sinterovany-kamen">Oplatí sa sinterovaný kameň?</a> — spoiler: pri 25-ročnom horizonte vychádza lacnejšie ako žula.</p>

<h2 id="ako-ziskat-ponuku">Ako získať presnú ponuku</h2>

<p>Stačia dve veci: <strong>pôdorys alebo základné rozmery</strong> a <strong>počet výrezov</strong> (drez, varná doska, batéria). Pošli nám ich cez <a href="/kontakt">kontaktný formulár</a> — pripravíme rozpis, ktorý vieš položka po položke porovnať s čímkoľvek na trhu.</p>

<p>A ak si najprv chceš dekor potvrdiť naživo, <a href="/vzorky">objednaj si vzorku zadarmo</a> alebo príď do showroomu v Bošanoch porovnať celé platne pri dennom svetle.</p>
`,
    faqs: [
      {
        question: 'Čo by mala obsahovať cenová ponuka na sinterovaný kameň?',
        answer:
          'Rozpis piatich položiek: materiál (dekor a počet platní), fabrikáciu (rezanie, výrezy, hrany), dopravu vrátane výnosu, montáž a DPH. Ponuka s jedným číslom bez rozpisu sa nedá porovnať a najčastejšie končí doúčtovaním pri montáži.',
      },
      {
        question: 'Koľko stojí kompletná pracovná doska zo sinterovaného kameňa?',
        answer: `Orientačne ${COUNTERTOP_PER_BM.min}–${COUNTERTOP_PER_BM.max} €/bm vrátane fabrikácie a montáže. Vstupná hladina okolo ${COUNTERTOP_PER_BM.min} €/bm je jednoduchá linka so základným dekorom; horná hranica patrí prémiovým dekorom, ostrovčekom a mitrovaným hranám.`,
      },
      {
        question: 'Koľko stojí samotný materiál?',
        answer: `Platňa sinterovaného kameňa 3200 × 1600 × 12 mm stojí ${skEur(SLAB_PRICE_MIN)}–${skEur(SLAB_PRICE_MAX)}/m² s DPH podľa dekoru. Aktuálne ceny všetkých dekorov sú verejné na stránke /cennik a synchronizujú sa s e-shopom.`,
      },
      {
        question: 'Aké skryté náklady mám v ponuke hľadať?',
        answer:
          'Najčastejšie chýbajú: výrezy (drez, varná doska, batéria — 40–80 € za kus), opracovanie hrán nad rámec rovnej hrany, výnos pri doprave a počet potrebných platní (platíš za celé platne, nie za výslednú dosku). Žiadaj ich v rozpise zvlášť.',
      },
      {
        question: 'Prečo sa ceny medzi dodávateľmi tak líšia?',
        answer:
          'Lebo každý do „ceny" zahŕňa niečo iné. Jedna ponuka za 350 €/bm môže byť len materiál s rezaním, iná za 420 €/bm komplet vrátane montáže. Líši sa aj kvalita fabrikácie — podlepenie hrán, počet spojov a presnosť výrezov vidno až pri používaní.',
      },
      {
        question: 'Je cena uvedená na webe konečná?',
        answer:
          'Ceny dekorov na webe sú konečné ceny materiálu s DPH. Finálna cena projektu závisí od rozmerov, počtu výrezov, typu hrany a dopravy — preto presnú ponuku pripravujeme z pôdorysu, s rozpisom položiek.',
      },
      {
        question: 'Viem si aktuálnu cenu garantovať, ak sa ešte rozhodujem?',
        answer:
          'Áno. Rezervačný poplatok 99 € garantuje aktuálnu cenu produktov Orostone na 6 mesiacov. Podmienky nájdeš na stránke Podmienky rezervácie ceny.',
      },
      {
        question: 'Čo potrebujete na prípravu presnej ponuky?',
        answer:
          'Pôdorys alebo základné rozmery dosky a počet výrezov (drez, varná doska, batéria). Z toho pripravíme rozpis: materiál, fabrikácia, doprava a montáž — každá položka zvlášť.',
      },
    ],
  },

  en: {
    title: 'Transparent Pricing: What Your Quote Must Include',
    subtitle: 'A guide to sintered stone quotes — no hidden fees, no surprises on the invoice',
    excerpt:
      'Two quotes for the same kitchen can differ by hundreds of euros — and the cheaper one may actually cost more. Learn what a fair quote must include and what to watch out for.',
    metaTitle: 'Sintered Stone Quote: What It Must Include | OROSTONE',
    metaDescription: `What a fair quote for a sintered stone countertop must include. Real prices €${COUNTERTOP_PER_BM.min}–${COUNTERTOP_PER_BM.max} per running meter, itemized breakdown, and the hidden costs to watch for.`,
    directAnswer: `A fair sintered stone countertop quote must itemize: material, fabrication (cutouts, edges), transport, installation and VAT. A complete countertop runs roughly €${COUNTERTOP_PER_BM.min}–${COUNTERTOP_PER_BM.max} per running meter including fabrication and installation. A quote without an itemized breakdown means you are comparing apples to oranges.`,
    content: `
<p class="article-tldr-label">Article Summary</p>
<ul class="article-tldr">
  <li>A complete countertop runs roughly <strong>€${COUNTERTOP_PER_BM.min}–${COUNTERTOP_PER_BM.max} per running meter</strong> including fabrication and installation</li>
  <li>Material (3200 × 1600 × 12 mm slab) costs <strong>${enEur(SLAB_PRICE_MIN)}–${enEur(SLAB_PRICE_MAX)}/m² incl. VAT</strong> depending on the decor</li>
  <li>A fair quote itemizes material, cutouts, edges, transport and installation separately</li>
  <li>Most common hidden costs: cutouts, edge profiling, carry-up delivery and slab utilization</li>
</ul>

<p>Let's be honest: most stone suppliers don't publish prices. "Contact us for a custom quote" sounds helpful, but in practice it means one thing — you have nothing to anchor on and no way to compare two offers.</p>

<p>At Orostone we went the opposite way. Every decor price is public, and so is the realization rate. This article shows you how a countertop price is actually built — so you can read any quote, including a competitor's, like a pro.</p>

<h2 id="how-much">How much does sintered stone cost? Real numbers</h2>

<p>Let's start with material. A sintered stone slab measures <strong>3200 × 1600 mm</strong> at <strong>12 mm</strong> thickness. These are the current prices of every decor in our catalog (synced with the e-shop):</p>

<table>
  <thead><tr><th>Decor</th><th>Price per m² incl. VAT</th></tr></thead>
  <tbody>${enPriceRows}</tbody>
</table>

<p>The full overview including whole-slab prices is in our <a href="/cennik">price list</a>.</p>

<div class="article-highlight">
  <strong>Mind the units.</strong> Material is priced per m². A finished countertop is priced per running meter (€/rm) — and that's the number you care about, because it includes the work.
</div>

<h2 id="running-meter">What does price per running meter (€/rm) mean?</h2>

<p>A running meter is one meter of finished countertop length at standard kitchen depth (~60 cm) — including cutting, cutouts, edges, transport and installation. It is the only unit in which quotes from different suppliers can be fairly compared.</p>

<p>For sintered stone with quality fabrication, expect roughly:</p>

<ul>
  <li><strong>around €${COUNTERTOP_PER_BM.min}/rm</strong> — entry tier: simple straight run, entry decor, flat edge, few cutouts</li>
  <li><strong>around €400/rm</strong> — mid tier: premium decor or more cutouts and a more demanding edge</li>
  <li><strong>€${COUNTERTOP_PER_BM.max}/rm and up</strong> — premium tier: statement decor, island, book-match, mitered edges</li>
</ul>

<p><strong>A quote well below €${COUNTERTOP_PER_BM.min}/rm should make you curious, not happy.</strong> Something in the process is probably being cut — weaker substrate bonding, a simpler edge, or transport and installation that "surprisingly" aren't included. More on price tiers in our guide to <a href="/blog/umely-kamen-pracovna-doska">engineered stone countertops</a>.</p>

<h2 id="what-to-include">What a fair quote must include</h2>

<p>This is the key part. If a quote is a single number, you don't know what's in it — or what will be added at installation. Ask for these items separately:</p>

<ul>
  <li><strong>Material</strong> — decor, number of slabs and price per slab or m²</li>
  <li><strong>Fabrication</strong> — cutting, cutouts (sink, hob, tap), edge profiling, polishing</li>
  <li><strong>Transport</strong> — including carry-up (a third floor without a lift is not the same as ground floor)</li>
  <li><strong>Installation</strong> — setting, seam bonding, grouting</li>
  <li><strong>VAT</strong> — clearly stated whether prices include it</li>
</ul>

<div class="article-tip">
  <strong>Tip:</strong> If a supplier refuses an itemized breakdown ("it's all included"), ask what happens when an extra cutout or harder access shows up during the project. That's exactly where surcharges are born.
</div>

<h2 id="hidden-costs">Hidden costs to watch for</h2>

<ul>
  <li><strong>Cutouts.</strong> Sink, hob and tap are three cutouts. At €40–80 each, that difference must be visible in the quote.</li>
  <li><strong>Edge profiling.</strong> A flat edge is the baseline; chamfered, rounded or mitered edges cost more. Which one is included?</li>
  <li><strong>Slab utilization.</strong> You pay for whole slabs, not the finished top. A good supplier plans the layout to minimize waste — and tells you how many slabs the project needs.</li>
  <li><strong>Transport and carry-up.</strong> A slab weighs about 148 kg. Carrying it to the third floor without a lift is not a detail.</li>
  <li><strong>Seams.</strong> The number of seams affects both labour and looks. Where will they be and how many?</li>
</ul>

<h2 id="real-example">Real-world example: the cheaper quote that costs more</h2>

<p>Imagine two quotes for a kitchen with an island: <strong>€350/rm</strong> and <strong>€420/rm</strong>. The first one looks like a clear winner.</p>

<p>Then you request the breakdown. Quote one: material plus cutting. Cutouts 3 × €60, mitered island edge €180, transport with carry-up €120 and installation €250 — "billed as incurred". Quote two: everything included.</p>

<p><strong>At 5 running meters, the first quote ends up over €300 more expensive after surcharges</strong> — and you find out at installation. That's why the itemized breakdown matters more than the headline number.</p>

<h2 id="how-we-do-it">How we do it at Orostone</h2>

<ul>
  <li><strong>Decor prices</strong> are public on <a href="/cennik">/cennik</a> and on every product page, synced with the e-shop.</li>
  <li><strong>Complete realization</strong> — templating, transport, edge fabrication, polishing and installation — is priced at <strong>€${INSTALLATION_RATE_PER_M2}/m² incl. VAT</strong>. Fabrication and installation are carried out by partner stonemasons experienced with sintered stone.</li>
  <li><strong>Itemized quotes</strong> — material, fabrication, transport and installation listed separately. No "all inclusive" without details.</li>
  <li><strong>Price guarantee</strong> — a €99 reservation fee <a href="/podmienky-rezervacie-ceny">locks the current price for 6 months</a> if you need more time to decide.</li>
</ul>

<p>Whether sintered stone pays off long-term is covered in <a href="/blog/oplati-sa-sinterovany-kamen">Is Sintered Stone Worth It?</a> — spoiler: over a 25-year horizon it beats granite on total cost.</p>

<h2 id="get-a-quote">How to get an exact quote</h2>

<p>Two things are enough: <strong>a floor plan or basic dimensions</strong> and <strong>the number of cutouts</strong> (sink, hob, tap). Send them via the <a href="/kontakt">contact form</a> — we'll prepare a breakdown you can compare line by line against anything on the market.</p>

<p>And if you want to confirm the decor first, <a href="/vzorky">order a free sample</a> or visit the Bošany showroom to compare full slabs in daylight.</p>
`,
    faqs: [
      {
        question: 'What should a sintered stone quote include?',
        answer:
          'An itemized breakdown of five things: material (decor and slab count), fabrication (cutting, cutouts, edges), transport including carry-up, installation, and VAT. A single-number quote cannot be compared and most often ends with surcharges at installation.',
      },
      {
        question: 'How much does a complete sintered stone countertop cost?',
        answer: `Roughly €${COUNTERTOP_PER_BM.min}–${COUNTERTOP_PER_BM.max} per running meter including fabrication and installation. The entry tier around €${COUNTERTOP_PER_BM.min}/rm is a simple run with an entry decor; the upper end covers premium decors, islands and mitered edges.`,
      },
      {
        question: 'How much does the material itself cost?',
        answer: `A 3200 × 1600 × 12 mm sintered stone slab costs ${enEur(SLAB_PRICE_MIN)}–${enEur(SLAB_PRICE_MAX)}/m² incl. VAT depending on the decor. Current prices for every decor are public at /cennik and synced with the e-shop.`,
      },
      {
        question: 'What hidden costs should I look for?',
        answer:
          'Most commonly missing: cutouts (sink, hob, tap — €40–80 each), edge profiling beyond a flat edge, carry-up delivery, and the number of slabs needed (you pay for whole slabs, not the finished top). Ask for each as a separate line.',
      },
      {
        question: 'Why do prices vary so much between suppliers?',
        answer:
          'Because everyone includes something different in "the price". One €350/rm quote may be material and cutting only; another at €420/rm may be truly all-in. Fabrication quality also differs — edge bonding, seam count and cutout precision only show up in daily use.',
      },
      {
        question: 'Are the prices on your website final?',
        answer:
          'Decor prices on the website are final material prices incl. VAT. The final project price depends on dimensions, cutouts, edge type and transport — which is why we prepare exact quotes from a floor plan, itemized.',
      },
      {
        question: 'Can I lock in the current price while I decide?',
        answer:
          'Yes. A €99 reservation fee guarantees the current Orostone prices for 6 months. See the Price Reservation Terms page for details.',
      },
      {
        question: 'What do you need to prepare an exact quote?',
        answer:
          'A floor plan or basic dimensions and the number of cutouts (sink, hob, tap). From that we prepare an itemized breakdown: material, fabrication, transport and installation.',
      },
    ],
  },
};
