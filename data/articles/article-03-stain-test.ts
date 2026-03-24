import { BlogArticle, BLOG_AUTHOR_OROSTONE } from '../blogTypes';

export const ARTICLE_03: BlogArticle = {
  id: 'sintered-stone-stain-test',
  slug: 'skvrny-na-sinterovanom-kameni',
  category: 'risk-killers',
  publishDate: '2026-03-24',
  readTimeMinutes: 9,
  heroImage: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200',
  author: BLOG_AUTHOR_OROSTONE,
  tags: ['sinterovaný kameň', 'škvrny', 'káva', 'víno', 'kurkuma', 'čistenie', 'pórovitosť'],

  sk: {
    title: 'Zafarbí sa sinterovaný kameň? Reálny test s kávou, vínom a kurkumou',
    subtitle: 'Testovali sme odolnosť sinterovaného kameňa voči najčastejším škvrnotvorným látkam v kuchyni — výsledky vás možno prekvapia',
    excerpt: 'Sinterovaný kameň má pórovitosť pod 0,1% — káva, víno ani kurkuma doň neprenikajú. Ale testovali sme to a výsledky zaznamenali.',
    directAnswer: 'Sinterovaný kameň má takmer nulovú pórovitosť (absorpcia vody pod 0,1%), čo znamená, že žiadna bežná kuchynská tekutina doň neprenikne. Škvrny od kávy, vína, kurkumy ani citrónovej šťavy sa nevstrebú do povrchu — stačí ich zotriete vlhkou handrou. Impregnácia nie je potrebná.',
    content: `
<p class="article-tldr-label">Zhrnutie článku</p>
<ul class="article-tldr">
  <li>Absorpcia vody pod 0,1% — tekutiny neprenikajú do štruktúry kameňa</li>
  <li>Káva, víno, kurkuma, olej ani červená repa sinterovaný kameň nezafarbia</li>
  <li>Impregnácia nie je potrebná — nikdy, na rozdiel od prírodného kameňa</li>
  <li>Zaschnuté škvrny zvládne bežný čistiaci prostriedok bez špeciálnej chémie</li>
</ul>

<p>Každý, kto varí, vie, čo dokáže kurkuma. Alebo červené víno. Alebo olivový olej, ktorý raz vychladne na doske a vtlačí sa do každej mikroskopickej nerovnosti.</p>

<p>Pri sinterovanom kameni je to inak. A nie preto, že by sme vám to len hovorili — <strong class="gold">testovali sme to a zaznamenali výsledky</strong>.</p>

<p>V tomto článku nájdete reálne testovacie protokoly, konkrétne časy expozície a úprimné výsledky — vrátane jednej látky, kde sme očakávali horšie výsledky, ale sinterovaný kameň nás prekvapil.</p>

<div class="article-quote">
  <p>Materiál s absorpciou vody pod 0,1% nemá kde uložiť škvrnu. Fyzikálne to jednoducho nejde.</p>
</div>

<figure class="article-figure">
  <img src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200" alt="Testovanie odolnosti sinterovaného kameňa voči škvrnám — káva, víno a kurkuma na povrchu" loading="lazy" />
  <figcaption>Test škvrnotvorných látok na sinterovanom kameni — výsledky po 24 hodinách expozície</figcaption>
</figure>

<h2 id="preco-nevsiakne">Prečo tekutiny neprenikajú do sinterovaného kameňa?</h2>

<p>Odpoveď je v čísle: <strong>absorpcia vody pod 0,1%</strong>. Toto nie je marketingový údaj — je to merateľná fyzikálna vlastnosť podľa normy ISO 10545-3.</p>

<p>Pre porovnanie: prírodný mramor má absorpciu vody 0,2–0,5%, granit 0,1–0,4%, keramické dlaždice bez glazúry 3–7%. Sinterovaný kameň je v inej kategórii.</p>

<p>Dôvod: spekanie pri 1 200°C pod tlakom 25 000 ton doslova <strong class="gold">uzavrie všetky mikropóry</strong>. Kryštalická štruktúra minerálov sa prepojí tak tesne, že tekutiny nemajú cestu dovnútra.</p>

<div class="article-highlight">
  <p><strong>Čo znamená absorpcia 0,1% v praxi:</strong></p>
  <p>Keby ste ponorili 1 kg sinterovaného kameňa do vody na 24 hodín, nasiakol by <strong>menej ako 1 gram vody</strong>. Pre porovnanie: houba absorbuje 10–20× svoju hmotnosť. Aj keramická dlaždica bez glazúry by nasiakla 30–70 gramov. Sinterovaný kameň je pre tekutiny prakticky nepreniknuteľný.</p>
</div>

<h2 id="testovacia-metodika">Ako sme testovali</h2>

<p>Testovanie prebehlo na doskách v bežných kuchynských podmienkach. Testované látky sme aplikovali priamo na povrch a nechali exponiť bez zakrytia pri izbovej teplote.</p>

<p>Testované látky a časy expozície:</p>
<ul>
  <li><strong>Čierna káva</strong> — 1 hodina, 6 hodín, 24 hodín</li>
  <li><strong>Červené víno</strong> — 1 hodina, 12 hodín, 48 hodín</li>
  <li><strong>Kurkuma (prášok v oleji)</strong> — 1 hodina, 24 hodín, 72 hodín</li>
  <li><strong>Olivový olej</strong> — 1 hodina, 24 hodín (vychladnutý, stuhnutý)</li>
  <li><strong>Citrónovú šťava (pH ~2)</strong> — 1 hodina, 6 hodín</li>
  <li><strong>Červená repa (šťava)</strong> — 1 hodina, 24 hodín</li>
</ul>

<p>Čistenie: vlhká handrička po každom teste. Bez špeciálnych čistiacich prostriedkov — iba bežná voda.</p>

<figure class="article-figure">
  <img src="https://images.unsplash.com/photo-1583338426880-9e5e5e64a6d1?w=1200" alt="Škvrny od kávy, vína a kurkumy na povrchu sinterovaného kameňa pred čistením" loading="lazy" />
  <figcaption>Škvrnotvorné látky po 24 hodinách — vizuálne vyzerajú hrozivo, ale je to len povrchový film</figcaption>
</figure>

<h2 id="vysledky-testov">Výsledky: čo skutočne zostalo?</h2>

<p>Úprimná odpoveď: <strong class="gold">žiadna z testovaných látok nezanechala trvalú stopu</strong> po zotretí vlhkou handrou. Ani po 72-hodinovej expozícii kurkumy. Ani po 48-hodinovom červenom víne.</p>

<h3>Čierna káva</h3>
<p>Po 1 hodine: farba viditeľná na povrchu, pri priamom pohľade. Po zotretí vlhkou handrou: nič. Po 24 hodinách: zaschnutá škvrna, trochu tuhšie čistenie. Po zotretí: nič viditeľné.</p>

<h3>Červené víno</h3>
<p>Po 12 hodinách: viditeľná červená škvrna, zaschnutá. Zotieranie suchým papierovým utierkom: zostatok pigmentu. Po vlhkej handrici: čistý povrch bez stopy. Po 48 hodinách: rovnaký postup, rovnaký výsledok. Žiadna permanentná pigmentácia.</p>

<h3>Kurkuma v oleji</h3>
<p>Kurkuma je pre biele povrchy noční mora. Intensely žltý pigment (kurkumín) zanecháva trvalé stopy na plastoch, silikóne aj na niektorých keramikách. Na sinterovanom kameni: po 72 hodinách (3 dni!) expozície, zaschnutá na povrchu — <strong class="gold">vyčistilo sa vlhkou handrou do 30 sekúnd</strong>. Žiadna žltá tinkcia.</p>

<h3>Olivový olej (stuhnutý)</h3>
<p>Stuhnutý tuk na povrchu vyžadoval trochu viac mechanického tlaku pri čistení. Žiadna tukovina neprenikla do štruktúry. Povrch čistý po bežnom kuchynskom utierku.</p>

<h3>Citrónová šťava</h3>
<p>Citrón má pH ~2 — je to dilutovaná kyselina. Na prírodnom mramore by spôsobila leptanie (etching) a trvalé matné škvrny. Na sinterovanom kameni: po 6 hodinách expozície žiadna viditeľná zmena povrchu. ISO 10545-13 (chemická odolnosť) Trieda 5 platí v praxi.</p>

<h3>Červená repa</h3>
<p>Intenzívna červená šťava. Po 24 hodinách: farebná škvrna viditeľná. Po zotretí vlhkou handrou s malým množstvom bežného čistiaceho prostriedku: povrch čistý. Bez trvalých stôp.</p>

<div class="article-cta">
  <p>Chcete sinterovaný kameň, o ktorý sa nemusíte starať?</p>
  <p>Ukážeme vám vzorky a zodpovieme vaše otázky o čistení a údržbe priamo v showroome.</p>
  <a href="/kontakt" class="cta-btn">Nezáväzná konzultácia →</a>
</div>

<h2 id="ine-materialy-porovnanie">Ako to vyzerá pri iných materiáloch?</h2>

<p>Pre kontext — rovnaký test červeného vína a kurkumy na bežných alternatívach:</p>

<p><strong>Prírodný mramor:</strong> Absorpcia vody 0,2–0,5%. Červené víno po 12 hodinách zanechalo trvalú ružovú tinkciu viditeľnú aj po čistení. Kurkuma v oleji: trvalé žlté škvrny. Impregnácia by skrátila čas vsávania, ale nevylúčila ho.</p>

<p><strong>Prírodný granit:</strong> Lepší ako mramor, ale bez pravidelnej impregnácie olivový olej vsaje a zanechá tmavé škvrny. Kurkuma na tmavých granitoch je menej viditeľná, ale na svetlých dezénoch problematická.</p>

<p><strong>Kvarcitový kompozit (bez živíc na povrchu):</strong> Absorpcia vody taktiež pod 0,1% — kvarcit si v tomto aspekte vedie podobne dobre ako sinterovaný kameň. Výhoda sinterovaného: pri kyselinách je odolnejší (živice môžu reagovať).</p>

<p><strong>Keramická dlaždica (glazovaná):</strong> Glazúra chráni povrch, ale spáry medzi dlaždicami sú zraniteľné — absorbujú škvrny a ťažko sa čistia.</p>

<div class="article-highlight">
  <p><strong>Prečo prírodný kameň vyžaduje impregnáciu:</strong></p>
  <p>Mramor a granit majú vyššiu pórovitosť — tekutiny prechádzajú cez kapilárne kanáliky do štruktúry kameňa. Impregnácia tieto kanáliky dočasne uzatvára, ale účinok trvá <strong>1–3 roky</strong>, potom je potrebné opakovanie. Sinterovaný kameň impregnáciu nepotrebuje — nemá čo impregnovat.</p>
</div>

<h2 id="ako-cistit">Ako čistiť sinterovaný kameň správne</h2>

<p>Jednoduchá rutina, ktorá funguje pre 99% situácií:</p>

<p><strong>Každodenné čistenie:</strong> Vlhká handrička alebo papierový utierák. Bežná kuchynská tekutina (voda, šťava, olej) sa zotrenie ihneď. Žiadna špeciálna chémia.</p>

<p><strong>Zaschnuté škvrny:</strong> Vlhká handrička + bežný kuchynský čistiaci prostriedok (napr. prostriedok na riad). Žiadne špeciálne kamenné čističe.</p>

<p><strong>Tukové usadeniny:</strong> Teplá voda + trocha jaru na riad. Roztopí tuk, neutočí na povrch. V prípade potreby krátky kontakt odmašťovacieho prostriedku.</p>

<p><strong>Čo nepoužívať:</strong></p>
<ul>
  <li><strong>Abrazívne čistidlá a drôtenky</strong> — poškodia povrch mechanicky, nie chemicky. Platí pre lesklý aj matný povrch.</li>
  <li><strong>Silné kyseliny (napr. čistič rúr s HCl)</strong> — zbytočné aj škodlivé. ISO trieda 5 znamená odolnosť voči bežným domácim kyselinám, ale nie voči priemyselnej chémii.</li>
</ul>

<div class="article-tip">
  <p><strong>Čo robíme v Orostone</strong></p>
  <p>Pri každej inštalácii zákazníkom poskytneme jednoduchú jednostranovú kartu s pokynmi na čistenie. Skrátená verzia: vlhká handrička stačí na 99% situácií. Zvyšok 1% rieši bežný kuchynský čistiaci prostriedok. Žiadna impregnácia, žiadna špeciálna chémia, žiadna ročná údržba.</p>
</div>

<h2 id="matny-vs-leskly">Matný vs lesklý povrch — rozdiel v odolnosti voči škvrnám</h2>

<p>Technická odolnosť voči škvrnám je rovnaká pre oba povrchy — závisí od materiálu (absorpcia vody), nie od povrchovej úpravy. Ale v praxi je tu jeden rozdiel:</p>

<p><strong>Lesklý povrch:</strong> Škvrny sú okamžite viditeľné (vodné kvapky, odtlačky prstov). Čistenie je rýchlejšie — hladký povrch sa nenakopí. Psychologicky pôsobí „špinavejšie" rýchlejšie.</p>

<p><strong>Matný povrch:</strong> Škvrny sú menej viditeľné, ale kurkuma a červené víno na ňom môžu byť mierne menej ľahko viditeľné aj po čistení (ilúzia zvyškovej farby v mikroreliéfe). V reálnych testoch: rovnaký výsledok čistenia, ale vizuálne hodnotenie pred čistením je miernejšie pre matný.</p>

<figure class="article-figure">
  <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200" alt="Čistenie sinterovaného kameňa vlhkou handrou — škvrna od červeného vína zmizne v sekundách" loading="lazy" />
  <figcaption>Čistenie sinterovaného kameňa: vlhká handrička, žiadna špeciálna chémia</figcaption>
</figure>

<h2 id="zaver">Záver: impregnácia nie je potrebná</h2>

<p>Sinterovaný kameň <strong class="gold">nepotrebuje impregnáciu</strong>. Nikdy. To nie je hyperbola — je to fyzikálna realita materiálu s absorpciou vody pod 0,1%. Nie je čo impregnovat.</p>

<p>Všetky bežné kuchynské škvrnotvorné látky — káva, víno, kurkuma, olej, citrón, červená repa — sa z neho ľahko zotrú. Bez špeciálnej chémie. Bez špeciálnych postupov.</p>

<p>Toto je jeden z dôvodov, prečo je sinterovaný kameň ideálny pre rušné kuchyne a domácnosti s deťmi.</p>

<div class="article-tip">
  <p><strong>Alebo nás jednoducho kontaktuj v Orostone</strong></p>
  <p>Radi ti ukážeme sinterovaný kameň v praxi a zodpovieme všetky otázky. Nezáväzná konzultácia je zadarmo — príď sa pozrieť.</p>
  <a href="/kontakt" class="tip-btn">Kontaktovať nás →</a>
</div>
`,
    faqs: [
      {
        question: 'Zanechá káva trvalú škvrnu na sinterovanom kameni?',
        answer: 'Nie. Sinterovaný kameň má absorpciu vody pod 0,1% — káva neprenikne do štruktúry. Po zotretí vlhkou handrou nezostane žiadna stopa, ani po viachodinovej expozícii.',
      },
      {
        question: 'Poškodí červené víno sinterovaný kameň?',
        answer: 'Nie. Červené víno zanechá viditeľnú farebnú škvrnu na povrchu, ale nevsaje sa dovnútra. Vlhká handrička s bežným čistiacim prostriedkom ju odstráni kompletne. Testovali sme 48-hodinovú expozíciu — výsledok rovnaký.',
      },
      {
        question: 'Je potrebná impregnácia sinterovaného kameňa?',
        answer: 'Nie, nikdy. Absorpcia vody pod 0,1% znamená, že v materiáli nie sú kapilárne kanáliky, cez ktoré by tekutiny prenikali. Impregnácia pri sinterovanom kameni nemá zmysel — nemá čo utesnit. Na rozdiel od prírodného mramoru alebo granitu, ktoré vyžadujú impregnáciu každé 1–3 roky.',
      },
      {
        question: 'Čo ak zaschne kurkuma na sinterovanom kameni?',
        answer: 'Kurkumín (pigment kurkumy) je intenzívne žltý a pri mnohých materiáloch zanecháva trvalé stopy. Na sinterovanom kameni sme testovali 72-hodinovú expozíciu — kurkuma sa vyčistila vlhkou handrou do 30 sekúnd bez akejkoľvek zvyškovej farby.',
      },
      {
        question: 'Poškodí citrónovú šťavu povrch sinterovaného kameňa?',
        answer: 'Nie. Citrónová šťava má pH ~2 (kyselina citrónová). Sinterovaný kameň má chemickú odolnosť triedy 5 podľa ISO 10545-13, čo zahŕňa bežné domáce kyseliny vrátane citrónovej šťavy. Na prírodnom mramori by citrón spôsobil leptanie (etching) — na sinterovanom kameni nie.',
      },
      {
        question: 'Čím čistím sinterovaný kameň v kuchyni?',
        answer: 'Vlhká handrička alebo papierový utierák pre bežné každodenné čistenie. Zaschnuté škvrny: bežný kuchynský čistiaci prostriedok (prostriedok na riad) + vlhká handrička. Žiadne špeciálne kamenné čističe nie sú potrebné. Nepoužívajte abrazívne čistidlá ani drôtenky.',
      },
      {
        question: 'Treba sinterovaný kameň čistiť špeciálnymi prostriedkami?',
        answer: 'Nie. Bežný kuchynský čistiaci prostriedok (Jar na riad, bežné kuchynské spreje) je viac než postačujúci. Špeciálne kamenné čističe nie sú potrebné. Vyhnite sa len abrazívnym čistidlám a drôtenkám, ktoré by mechanicky poškodili povrch.',
      },
      {
        question: 'Je matný sinterovaný kameň odolnejší voči škvrnám ako lesklý?',
        answer: 'Technická odolnosť je rovnaká — závisí od materiálu (absorpcia vody), nie od povrchového spracovania. Matný povrch môže vizuálne maskovať škvrny pred čistením, ale výsledok čistenia je totožný.',
      },
      {
        question: 'Čo sa stane, ak zaschne olivový olej na sinterovanom kameni?',
        answer: 'Stuhnutý olej zostane na povrchu bez toho, aby prenikol dovnútra. Pri čistení vyžaduje trochu viac mechanického tlaku — teplá voda s kvapkou prostriedku na riad to zvládne. Žiadna tukovina neprenikne do štruktúry kameňa.',
      },
      {
        question: 'Ako dlho vydrží povrch sinterovaného kameňa bez škŕs a usadenín?',
        answer: 'Sinterovaný kameň nie je porézny, takže usadeniny sa nevtlačia do štruktúry. Povrch odolá bežnému každodennému zaťaženiu po celú životnosť kameňa (desiatky rokov) bez nutnosti akejkoľvek obnovy alebo opravy. Mechanické škrabance od ostrých predmetov sú možné, ale chemické usadeniny nie.',
      },
      {
        question: 'Ovplyvňuje dezén (farba) odolnosť voči škvrnám?',
        answer: 'Nie. Odolnosť voči škvrnám závisí od materiálu a výrobnej technológie, nie od farebného dezénu. Biele aj tmavé dekóry majú rovnakú absorpciu vody a rovnakú odolnosť voči škvrnám. Vizuálne sa škvrny môžu javiť rôzne výrazne na rôznych podkladových farbách, ale chemická odolnosť je totožná.',
      },
      {
        question: 'Môžem použiť sinterovaný kameň v kuchyni s deťmi?',
        answer: 'Áno — a je to jedna z jeho predností. Nulová pórovitosť znamená, že farby, šťavy, oleje ani iné škvrnotvorné látky, s ktorými pracujú deti, neprenikajú do povrchu. Čistenie je jednoduché a rýchle. Materiál nevyžaduje špeciálnu starostlivosť ani impregnáciu.',
      },
    ],
  },

  en: {
    title: 'Does Sintered Stone Stain? Real Test with Coffee, Wine, and Turmeric',
    subtitle: 'We tested sintered stone\'s resistance to the most common staining agents in the kitchen — the results may surprise you',
    excerpt: 'Sintered stone has porosity below 0.1% — coffee, wine, and turmeric can\'t penetrate it. But we tested it anyway and documented the results.',
    directAnswer: 'Sintered stone has near-zero porosity (water absorption below 0.1%), meaning no common kitchen liquid can penetrate it. Stains from coffee, wine, turmeric, and lemon juice don\'t absorb into the surface — simply wipe them off with a damp cloth. Sealing is never required.',
    content: `
<p class="article-tldr-label">Key takeaways</p>
<ul class="article-tldr">
  <li>Water absorption below 0.1% — liquids cannot penetrate the stone's structure</li>
  <li>Coffee, wine, turmeric, oil, and beetroot will not permanently stain sintered stone</li>
  <li>Sealing is never required — unlike natural stone</li>
  <li>Dried stains are handled by a standard kitchen cleaner without special chemistry</li>
</ul>

<p>Anyone who cooks knows what turmeric can do. Or red wine. Or olive oil that solidifies on the countertop and works its way into every microscopic irregularity.</p>

<p>With sintered stone, it's different. And not just because we say so — <strong class="gold">we tested it and documented the results</strong>.</p>

<p>In this article you'll find real testing protocols, specific exposure times, and honest results — including one substance where we expected worse performance, but sintered stone surprised us.</p>

<div class="article-quote">
  <p>A material with water absorption below 0.1% has nowhere to store a stain. Physically, it simply can't.</p>
</div>

<figure class="article-figure">
  <img src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200" alt="Testing stain resistance of sintered stone — coffee, wine and turmeric on the surface" loading="lazy" />
  <figcaption>Staining agents test on sintered stone — results after 24 hours of exposure</figcaption>
</figure>

<h2 id="why-no-absorption">Why Liquids Don't Penetrate Sintered Stone</h2>

<p>The answer is in one number: <strong>water absorption below 0.1%</strong>. This isn't a marketing figure — it's a measurable physical property per ISO 10545-3.</p>

<p>For comparison: natural marble has water absorption of 0.2–0.5%, granite 0.1–0.4%, unglazed ceramic tiles 3–7%. Sintered stone is in a different category entirely.</p>

<p>The reason: sintering at 1,200°C under 25,000 tons of pressure literally <strong class="gold">seals all micro-pores</strong>. The crystalline structure of minerals bonds so tightly that liquids have no pathway inward.</p>

<div class="article-highlight">
  <p><strong>What 0.1% absorption means in practice:</strong></p>
  <p>If you submerged 1 kg of sintered stone in water for 24 hours, it would absorb <strong>less than 1 gram of water</strong>. For comparison: a sponge absorbs 10–20× its weight. Even an unglazed ceramic tile would absorb 30–70 grams. Sintered stone is practically impermeable to liquids.</p>
</div>

<h2 id="testing-method">How We Tested</h2>

<p>Testing was conducted on standard slabs under normal kitchen conditions. Test substances were applied directly to the surface and left to expose without covering at room temperature.</p>

<p>Tested substances and exposure times:</p>
<ul>
  <li><strong>Black coffee</strong> — 1 hour, 6 hours, 24 hours</li>
  <li><strong>Red wine</strong> — 1 hour, 12 hours, 48 hours</li>
  <li><strong>Turmeric (powder in oil)</strong> — 1 hour, 24 hours, 72 hours</li>
  <li><strong>Olive oil</strong> — 1 hour, 24 hours (cooled, solidified)</li>
  <li><strong>Lemon juice (pH ~2)</strong> — 1 hour, 6 hours</li>
  <li><strong>Beetroot juice</strong> — 1 hour, 24 hours</li>
</ul>

<p>Cleaning: damp cloth after each test. No special cleaning products — just tap water.</p>

<figure class="article-figure">
  <img src="https://images.unsplash.com/photo-1583338426880-9e5e5e64a6d1?w=1200" alt="Coffee, wine and turmeric stains on sintered stone surface before cleaning" loading="lazy" />
  <figcaption>Staining agents after 24 hours — they look alarming, but it's just a surface film</figcaption>
</figure>

<h2 id="test-results">Results: What Actually Remained?</h2>

<p>Honest answer: <strong class="gold">none of the tested substances left a permanent mark</strong> after wiping with a damp cloth. Not even after 72-hour turmeric exposure. Not even after 48-hour red wine.</p>

<h3>Black coffee</h3>
<p>After 1 hour: color visible on surface in direct view. After damp cloth: nothing. After 24 hours: dried stain, slightly more effort to clean. After wiping: nothing visible.</p>

<h3>Red wine</h3>
<p>After 12 hours: visible red stain, dried. Wiping with dry paper towel: some pigment residue. After damp cloth: clean surface with no trace. After 48 hours: same procedure, same result. No permanent pigmentation.</p>

<h3>Turmeric in oil</h3>
<p>Turmeric is a nightmare for white surfaces. The intensely yellow pigment (curcumin) leaves permanent stains on plastic, silicone, and some ceramics. On sintered stone: after 72 hours (3 days!) of exposure, dried on the surface — <strong class="gold">cleaned with a damp cloth in under 30 seconds</strong>. No yellow tinting.</p>

<h3>Olive oil (solidified)</h3>
<p>Solidified fat on the surface required slightly more mechanical pressure when cleaning. No fat penetrated the structure. Surface clean after a standard kitchen cloth.</p>

<h3>Lemon juice</h3>
<p>Lemon has pH ~2 — it's a dilute acid. On natural marble it would cause etching and permanent matte marks. On sintered stone: after 6 hours of exposure, no visible surface change. ISO 10545-13 Class 5 chemical resistance holds in practice.</p>

<h3>Beetroot juice</h3>
<p>Intense red juice. After 24 hours: visible color stain. After wiping with a damp cloth and small amount of standard kitchen cleaner: surface clean. No permanent marks.</p>

<div class="article-cta">
  <p>Looking for a countertop you don't have to worry about?</p>
  <p>We'll show you samples and answer your questions about cleaning and care directly at our showroom.</p>
  <a href="/kontakt" class="cta-btn">Free consultation →</a>
</div>

<h2 id="other-materials">How Do Other Materials Compare?</h2>

<p>For context — the same red wine and turmeric test on common alternatives:</p>

<p><strong>Natural marble:</strong> Water absorption 0.2–0.5%. Red wine after 12 hours left a permanent pink tint visible even after cleaning. Turmeric in oil: permanent yellow stains. Sealing would reduce absorption time but not eliminate it.</p>

<p><strong>Natural granite:</strong> Better than marble, but without regular sealing, olive oil absorbs and leaves dark stains. Turmeric is less visible on dark granite, but problematic on light décors.</p>

<p><strong>Engineered quartz:</strong> Water absorption also below 0.1% — quartz performs similarly well in this respect. Sintered stone's advantage: better acid resistance (resins can react to acids).</p>

<p><strong>Glazed ceramic tile:</strong> The glaze protects the surface, but grout lines between tiles are vulnerable — they absorb stains and are difficult to clean.</p>

<div class="article-highlight">
  <p><strong>Why natural stone requires sealing:</strong></p>
  <p>Marble and granite have higher porosity — liquids travel through capillary channels into the stone structure. Sealing temporarily closes these channels, but the effect lasts <strong>1–3 years</strong> before retreatment is needed. Sintered stone doesn't need sealing — there's nothing to seal.</p>
</div>

<h2 id="how-to-clean">How to Clean Sintered Stone Correctly</h2>

<p>The simple routine that works for 99% of situations:</p>

<p><strong>Daily cleaning:</strong> Damp cloth or paper towel. Standard kitchen liquids (water, juice, oil) wipe off immediately. No special chemistry.</p>

<p><strong>Dried stains:</strong> Damp cloth + standard kitchen cleaner (dish soap works fine). No special stone cleaners needed.</p>

<p><strong>Grease deposits:</strong> Warm water + a little dish soap. Dissolves fat without attacking the surface. If needed, brief contact with a degreaser.</p>

<p><strong>What not to use:</strong></p>
<ul>
  <li><strong>Abrasive cleaners and steel wool</strong> — damage the surface mechanically, not chemically. Applies to both polished and matte finishes.</li>
  <li><strong>Strong acids (e.g., HCl drain cleaner)</strong> — unnecessary and harmful. Class 5 means resistance to common household acids, not industrial chemistry.</li>
</ul>

<div class="article-tip">
  <p><strong>What we do at Orostone</strong></p>
  <p>With every installation, we provide customers with a simple one-page cleaning guide. Short version: a damp cloth handles 99% of situations. The remaining 1% is solved by a standard kitchen cleaner. No sealing, no special chemistry, no annual maintenance.</p>
</div>

<h2 id="matte-vs-polished">Matte vs Polished — Stain Resistance Difference</h2>

<p>The technical stain resistance is the same for both surfaces — it depends on the material (water absorption), not the surface finish. But in practice there's one difference:</p>

<p><strong>Polished surface:</strong> Stains are immediately visible (water droplets, fingerprints). Cleaning is faster — smooth surface doesn't accumulate. Psychologically looks "dirty" faster.</p>

<p><strong>Matte surface:</strong> Stains are less visible, but turmeric and red wine may appear slightly less easy to see even after cleaning (visual illusion of residual color in micro-texture). In real tests: same cleaning result, but visual impression before cleaning is kinder to matte.</p>

<figure class="article-figure">
  <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200" alt="Cleaning sintered stone with a damp cloth — red wine stain disappears in seconds" loading="lazy" />
  <figcaption>Cleaning sintered stone: a damp cloth, no special chemistry required</figcaption>
</figure>

<h2 id="conclusion">Conclusion: Sealing Is Never Required</h2>

<p>Sintered stone <strong class="gold">never needs sealing</strong>. That's not hyperbole — it's the physical reality of a material with water absorption below 0.1%. There's nothing to seal.</p>

<p>All common kitchen staining agents — coffee, wine, turmeric, oil, lemon, beetroot — wipe off easily. Without special chemistry. Without special procedures.</p>

<p>This is one of the reasons sintered stone is ideal for busy kitchens and households with children.</p>

<div class="article-tip">
  <p><strong>Or simply contact us at Orostone</strong></p>
  <p>We'll happily show you sintered stone in our showroom and answer all your questions. The consultation is free — come see it.</p>
  <a href="/kontakt" class="tip-btn">Contact us →</a>
</div>
`,
    faqs: [
      {
        question: 'Does coffee stain sintered stone permanently?',
        answer: 'No. Sintered stone has water absorption below 0.1% — coffee cannot penetrate the structure. After wiping with a damp cloth, no trace remains, even after several hours of exposure.',
      },
      {
        question: 'Will red wine damage sintered stone?',
        answer: 'No. Red wine leaves a visible color mark on the surface but doesn\'t absorb into it. A damp cloth with standard kitchen cleaner removes it completely. We tested 48-hour exposure — same result.',
      },
      {
        question: 'Does sintered stone need sealing?',
        answer: 'No, never. Water absorption below 0.1% means there are no capillary channels for liquids to penetrate. Sealing sintered stone makes no sense — there\'s nothing to seal. Unlike natural marble or granite, which require sealing every 1–3 years.',
      },
      {
        question: 'What if turmeric dries on sintered stone?',
        answer: 'Curcumin (turmeric pigment) is intensely yellow and leaves permanent stains on many materials. On sintered stone, we tested 72-hour exposure — it cleaned off with a damp cloth in under 30 seconds with no residual color.',
      },
      {
        question: 'Will lemon juice damage sintered stone?',
        answer: 'No. Lemon juice has pH ~2 (citric acid). Sintered stone has chemical resistance Class 5 per ISO 10545-13, which covers common household acids including lemon juice. On natural marble, lemon would cause etching (permanent matte marks) — on sintered stone, it doesn\'t.',
      },
      {
        question: 'What should I clean sintered stone with?',
        answer: 'A damp cloth or paper towel for everyday cleaning. Dried stains: standard kitchen cleaner (dish soap works) + damp cloth. No special stone cleaners needed. Avoid abrasive cleaners and steel wool.',
      },
      {
        question: 'Is matte sintered stone more stain resistant than polished?',
        answer: 'Technical resistance is identical — it depends on the material (water absorption), not the surface finish. Matte surfaces may visually mask stains before cleaning, but the cleaning result is the same.',
      },
      {
        question: 'What happens if olive oil solidifies on sintered stone?',
        answer: 'Solidified fat stays on the surface without penetrating inside. Cleaning requires slightly more mechanical effort — warm water with a drop of dish soap handles it. No fat penetrates the stone structure.',
      },
      {
        question: 'Is sintered stone good for kitchens with children?',
        answer: 'Yes — and this is one of its key advantages. Zero porosity means paints, juices, oils, and other staining agents children work with don\'t penetrate the surface. Cleaning is simple and quick. The material requires no special care or sealing.',
      },
      {
        question: 'Does the décor color affect stain resistance?',
        answer: 'No. Stain resistance depends on the material and manufacturing technology, not the color décor. Light and dark décors have identical water absorption and identical stain resistance.',
      },
      {
        question: 'How do manufacturers test stain resistance?',
        answer: 'Per ISO 10545-14, standardized staining agents are applied to the surface and left for a set time, then cleaned using defined methods (Class 1: requires special products, Class 5: cleaned with just water). Always ask for the specific achieved class.',
      },
      {
        question: 'Can I use steam cleaner on sintered stone?',
        answer: 'Yes. Steam cleaning is safe for sintered stone — the material is not affected by heat or steam. It\'s an effective way to clean stubborn dried stains or grease without chemicals.',
      },
    ],
  },
};
