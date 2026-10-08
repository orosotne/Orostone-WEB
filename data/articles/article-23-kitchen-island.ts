import { BlogArticle, BLOG_AUTHOR_OROSTONE } from '../blogTypes';
import { INSTALLATION_RATE_PER_M2, SLAB_TOTAL_MIN, SLAB_TOTAL_MAX, formatEurWhole } from '../pricing';

// Orostone sells material only (whole slabs, live Shopify prices); fabrication
// and installation are done and invoiced by the partner stonemason.
const ONE_SLAB = `${formatEurWhole(SLAB_TOTAL_MIN)} – ${formatEurWhole(SLAB_TOTAL_MAX)}`;
const TWO_SLABS = `${formatEurWhole(2 * SLAB_TOTAL_MIN)} – ${formatEurWhole(2 * SLAB_TOTAL_MAX)}`;
const enEurWhole = (n: number): string => `€${Math.round(n).toLocaleString('en-US')}`;
const ONE_SLAB_EN = `${enEurWhole(SLAB_TOTAL_MIN)}–${enEurWhole(SLAB_TOTAL_MAX)}`;

export const ARTICLE_23: BlogArticle = {
  id: 'kitchen-island-sintered-stone',
  slug: 'kuchynsky-ostrovcek-zo-sinterovaneho-kamena',
  category: 'identity-aesthetics',
  publishDate: '2026-04-12',
  lastModified: '2026-10-08',
  readTimeMinutes: 10,
  heroImage: '/images/blog/article-23/hero.webp',
  author: BLOG_AUTHOR_OROSTONE,
  tags: ['kuchynský ostrovček', 'sinterovaný kameň', 'kuchyňa', 'dizajn', 'ostrov', 'pracovná doska', 'waterfall'],

  sk: {
    title: 'Kuchynský ostrovček zo sinterovaného kameňa – kompletný sprievodca',
    subtitle: 'Od rozmeru cez hrúbku po waterfall hrany: všetko, čo potrebujete vedieť pred objednaním',
    excerpt: 'Kuchynský ostrovček zo sinterovaného kameňa je vizuálna dominanta modernej kuchyne. Poradíme s rozmermi, hrúbkou platne, profilom hrán a waterfall vyhotovením.',
    metaTitle: 'Ostrovček so sedením zo sinterovaného kameňa | OROSTONE',
    metaDescription: 'Koľko miesta potrebuje ostrovček so sedením, aký previs a hrúbku zvoliť, waterfall hrany, podpera a cena materiálu. Praktický sprievodca pred objednaním.',
    directAnswer: `Kuchynský ostrovček zo sinterovaného kameňa sa robí z 12\u00A0mm platne. Previs nad 200\u00A0mm, napríklad pre barové sedenie, potrebuje podpernú konštrukciu z nerezovej ocele a výrezy sa robia presne na CNC. Pre waterfall efekt sa používa spojenie pod 45° uhlom s farebne zladeným lepidlom. Materiál sú 1 – 2 celé platne po ${ONE_SLAB}, výrobu a montáž robí a fakturuje partnerský kamenár.`,
    content: `
<p class="article-tldr-label">Zhrnutie článku</p>
<ul class="article-tldr">
  <li>Sinterovaný kameň je ideálny materiál pre kuchynské ostrovčeky – odolný, ľahko udržiavateľný, dizajnovo flexibilný</li>
  <li>Ostrovček sa robí z 12\u00A0mm platne – previs nad 200\u00A0mm, napríklad pre barové sedenie, potrebuje nerezové konzoly</li>
  <li>Waterfall (kaskádové hrany) pôsobia výrazne – spoj pod 45° je takmer neviditeľný</li>
  <li>Maximálna veľkosť jedného kusu: 3\u00A0200\u00A0×\u00A01\u00A0600\u00A0mm (závisí od výrobcu)</li>
  <li>Materiál: 1 – 2 celé platne po ${ONE_SLAB}, výrobu a montáž nacení partnerský kamenár</li>
</ul>

<p>Kuchynský ostrovček je srdcom modernej otvorenej kuchyne. Je to miesto, kde sa varí, raňajkuje, pracuje na notebooku a debatuje s návštevami. A materiál, z ktorého je vyrobený, definuje celý charakter priestoru.</p>

<p><strong class="gold">Sinterovaný kameň</strong> sa stal prvou voľbou pre prémiové kuchynské ostrovčeky – a nie je to náhoda. Kombinuje vizuálnu eleganciu prírodného mramoru s odolnosťou, ktorá zvládne každodenné používanie bez impregnácie a s jednoduchou údržbou.</p>

<div class="article-quote">
  <p>Ostrovček nie je len pracovná plocha – je to najviditeľnejší kus nábytku v otvorenej kuchyni. Materiál, ktorý si zvolíte, vidíte celý deň.</p>
</div>

<h2 id="preco-sinterovany-kamen">Prečo sinterovaný kameň na ostrovček?</h2>

<p>Kuchynský ostrovček má špecifické požiadavky, ktoré ho odlišujú od bežnej pracovnej dosky pri stene:</p>

<ul>
  <li><strong>Viditeľné hrany zo všetkých strán</strong> – materiál musí vyzerať dobre nielen zhora, ale aj z boku</li>
  <li><strong>Previsy pre barové sedenie</strong> – previs 300 – 400\u00A0mm musí bezpečne uniesť aj oprenie sa o hranu, preto potrebuje podpernú konštrukciu</li>
  <li><strong>Vysoká expozícia</strong> – ostrovček je v centre pozornosti, každá škvrna a škrabanec je viditeľný</li>
  <li><strong>Kontakt s jedlom</strong> – príprava jedál priamo na doske vyžaduje hygienický, nepórovitý povrch</li>
</ul>

<p>Sinterovaný kameň spĺňa všetky tieto kritériá:</p>

<div class="article-highlight">
  <ul>
    <li><strong>Pórovitosť pod 0,1\u00A0%</strong> – baktérie a škvrny neprenikajú do povrchu</li>
    <li><strong>Odolnosť voči škrabancom</strong> – tvrdosť 6 – 7 Mohs (nôž kameň nepoškriabe)</li>
    <li><strong>Tepelná odolnosť nad 300\u00A0°C</strong> – horúce hrnce priamo na dosku</li>
    <li><strong>UV stabilita</strong> – farba sa nemení ani pri priamom slnečnom svetle (dôležité pri ostrovčeku pri okne)</li>
    <li><strong>Veľkoformátové platne</strong> – jeden kus až do 3\u00A0200\u00A0×\u00A01\u00A0600\u00A0mm = menej spojov</li>
  </ul>
</div>

<figure class="article-figure">
  <img src="/images/blog/article-23/island-overview.webp" alt="Pohľad zhora na kuchynský ostrovček zo sinterovaného kameňa s prípravou jedla na čistej kamennej ploche" width="1408" height="792" loading="lazy" />
  <figcaption>Veľkoformátová platňa bez jediného spoja – celá pracovná plocha ostrovčeka z jedného kusu sinterovaného kameňa.</figcaption>
</figure>

<h2 id="rozmery">Aké rozmery zvoliť?</h2>

<p>Správne rozmery ostrovčeka závisia od veľkosti kuchyne a plánovaného využitia:</p>

<div class="article-highlight">
  <p><strong>Odporúčané rozmery ostrovčeka:</strong></p>
  <ul>
    <li><strong>Minimálna šírka:</strong> 600\u00A0mm (len pracovná plocha) / 900\u00A0mm (s varičom alebo drezom)</li>
    <li><strong>Minimálna dĺžka:</strong> 1\u00A0200\u00A0mm (2 osoby) / 2\u00A0400\u00A0mm (4 osoby pri barových stoličkách)</li>
    <li><strong>Previs pre barové sedenie:</strong> 300 – 400\u00A0mm (optimum 350\u00A0mm)</li>
    <li><strong>Výška pracovnej plochy:</strong> 900\u00A0mm (štandard) / 1\u00A0050\u00A0mm (barová výška)</li>
    <li><strong>Odstup od okolitého nábytku:</strong> minimum 900\u00A0mm (ideálne 1\u00A0200\u00A0mm)</li>
  </ul>
</div>

<p>Pri sinterovanom kameni máte výhodu veľkoformátových platní. Ostrovček do 3\u00A0200\u00A0×\u00A01\u00A0600\u00A0mm sa dá vyrobiť z jedného kusu – <strong>bez jediného spoja na hornej ploche</strong>. Pre väčšie ostrovčeky sa platne spájajú s presnosťou na desatiny milimetra.</p>

<figure class="article-figure">
  <img src="/images/blog/article-23/dimensions.webp" alt="Kuchynský ostrovček s barovým sedením – barové stoličky pod previsom sinterovanej dosky" width="1408" height="792" loading="lazy" />
  <figcaption>Barový previs 350\u00A0mm – optimálne proporcie pre pohodlné sedenie. Previs takejto dĺžky potrebuje nerezové konzoly.</figcaption>
</figure>

<h2 id="ostrovcek-so-sedenim">Kuchynský ostrovček so sedením: koľko miesta a aký previs</h2>

<p>Ak má ostrovček slúžiť aj na raňajky alebo posedenie s návštevou, rozhodujú štyri čísla. Keď ich zanedbáte, pri ostrovčeku sa sedí bokom a obsadené stoličky zablokujú priechod.</p>

<ul>
  <li><strong>Dĺžka na osobu:</strong> počítajte 600\u00A0mm – pre 2 osoby aspoň 1\u00A0200\u00A0mm, pre 4 osoby 2\u00A0400\u00A0mm.</li>
  <li><strong>Previs pre kolená:</strong> 300 – 400\u00A0mm, optimum je 350\u00A0mm.</li>
  <li><strong>Výška plochy a stoličky:</strong> pri štandardnej výške 900\u00A0mm sa hodia stoličky so sedákom okolo 650\u00A0mm, pri barovej výške 1\u00A0050\u00A0mm okolo 750\u00A0mm.</li>
  <li><strong>Priestor za stoličkami:</strong> aspoň 900\u00A0mm, ideálne 1\u00A0200\u00A0mm, aby sa dalo prejsť aj pri obsadených miestach.</li>
</ul>

<p>Previs pre sedenie kladie nároky na hrúbku platne a jej podporu. Čo platí pri 12\u00A0mm a 20\u00A0mm platni a kedy sú potrebné konzoly, rozoberáme v častiach <a href="#hrubka">12\u00A0mm alebo 20\u00A0mm?</a> a <a href="#podpera">Podperná konštrukcia</a>. Riešenie pre vašu kuchyňu navrhne kamenár podľa dĺžky previsu.</p>

<h2 id="hrubka">12\u00A0mm alebo 20\u00A0mm?</h2>

<p>Voľba hrúbky je pri ostrovčeku kritickejšia ako pri bežnej doske. Na trhu sú 12\u00A0mm aj 20\u00A0mm platne:</p>

<ul>
  <li><strong>20\u00A0mm:</strong> pevnosť v ohybe 16\u00A0000\u00A0N, masívnejší vzhľad. Orostone 20\u00A0mm platne nepredáva.</li>
  <li><strong>12\u00A0mm:</strong> ľahšia a subtílnejšia. Bez podpery znesie previs do 200\u00A0mm, dlhší previs nesú nerezové konzoly. Je to aj hrúbka pre <a href="/blog/neviditelna-varna-doska-v-sinterovanom-kamene">neviditeľné varné dosky</a>.</li>
</ul>

<p>V Orostone pracujeme výhradne s 12\u00A0mm platňami. Ostrovček so sedením je s nimi bežné riešenie – podmienkou je súvislá podkladová konštrukcia a pri previse nad 200\u00A0mm <strong>vždy konštrukčná podpera</strong>. Bez nej hrozí prasknutie pod bodovým zaťažením (napríklad keď sa niekto oprie o hranu).</p>

<h2 id="waterfall">Waterfall (kaskádové) hrany</h2>

<p>Waterfall efekt znamená, že sinterovaný kameň pokračuje z hornej plochy zvisle nadol po boku ostrovčeka – až k podlahe. Výsledok je monolitický blok kameňa, ktorý pôsobí ako vytesaný z jedného kusu.</p>

<p>Ako sa to robí:</p>

<ol>
  <li><strong>Rez pod 45°</strong> – oba kusy (horizontálny a vertikálny) sa narežú pod presným uhlom</li>
  <li><strong>Lepenie farebne zladeným lepidlom</strong> – spoj je po vytvrdnutí takmer neviditeľný</li>
  <li><strong>Brúsenie a leštenie spoja</strong> – finálna úprava zladí textúru cez celý roh</li>
</ol>

<p>Waterfall hrany sú možné na jednej, dvoch alebo všetkých štyroch stranách. Najčastejšie sa robia na dvoch kratších stranách – vytvárajú elegantný rám pre celý ostrovček.</p>

<div class="article-highlight">
  <p><strong>Waterfall vs. štandardná hrana – cenový rozdiel:</strong></p>
  <ul>
    <li><strong>Štandardná hrana (rovná, zaoblená alebo skosená):</strong> zahrnutá v cene fabrikácie</li>
    <li><strong>Waterfall na 1 strane:</strong> +400 – 800\u00A0€ (materiál + fabrikácia + lepenie)</li>
    <li><strong>Waterfall na 2 stranách:</strong> +700 – 1\u00A0400\u00A0€</li>
    <li><strong>Full waterfall (4 strany):</strong> +1\u00A0200 – 2\u00A0400\u00A0€ (používa sa zriedka)</li>
  </ul>
</div>

<figure class="article-figure">
  <img src="/images/blog/article-23/waterfall-detail.webp" alt="Detail waterfall hrany na kuchynskom ostrovčeku – spoj pod 45° s plynulým prechodom žíl cez roh" width="1408" height="792" loading="lazy" />
  <figcaption>Waterfall hrana zblízka – žily prechádzajú plynulo z hornej plochy cez 45° spoj na vertikálnu stenu. Spoj je po vybrúsení takmer neviditeľný.</figcaption>
</figure>

<h2 id="profily-hran">Profily hrán pre ostrovček</h2>

<p>Okrem waterfall efektu si pri ostrovčeku volíte aj profil samotnej hrany. Pre ostrovček odporúčame:</p>

<ul>
  <li><strong>Half bullnose (polkruhová):</strong> najbezpečnejšia voľba – zaoblená hrana minimalizuje riziko chipovania aj pri náraze. Ideálna pre rodiny s deťmi.</li>
  <li><strong>Chamfer (skosená 2 – 3\u00A0mm):</strong> moderný, čistý vzhľad. Dobrý kompromis medzi estetikou a odolnosťou.</li>
  <li><strong>Rovná 90°:</strong> najostrejší dizajn, ale najnáchylnejšia na chipovanie. Vhodná len pre ostrovčeky bez barového previsu. Viac o profiloch v našom <a href="/blog/hrany-a-profily-chipovanie">sprievodcovi hranami</a>.</li>
</ul>

<h2 id="podpera">Podperná konštrukcia</h2>

<p>Sinterovaný kameň je pevný, ale nie je samonosný na veľkých plochách. Ostrovček potrebuje:</p>

<ul>
  <li><strong>Kuchynský korpus</strong> – štandardná skrinka (IKEA, Decodom, na mieru) tvorí jadro ostrovčeka</li>
  <li><strong>Nerezové konzoly pre previsy</strong> – pri barových previsoch nad 200\u00A0mm sú konzoly povinné. Montujú sa pod dosku, skryté za obkladovým panelom.</li>
  <li><strong>Podlepenie MDF doskou</strong> – pod celou plochou kamennej dosky pre rovnomerný tlak a elimináciu bodového zaťaženia</li>
</ul>

<h2 id="instalacia">Inštalácia ostrovčeka krok za krokom</h2>

<ol>
  <li><strong>Zameranie</strong> – technik zmeria finálne rozmery po osadení korpusu (nie podľa plánu kuchyne)</li>
  <li><strong>Fabrikácia</strong> – CNC rez, výrezy pre drez/varič, profilovanie hrán, waterfall rezy (5 – 7 pracovných dní)</li>
  <li><strong>Doprava</strong> – špeciálny transport vo vertikálnej A-frame prepravke (platne sa nikdy neprepravujú na plocho)</li>
  <li><strong>Montáž</strong> – osadenie na silikón, lepenie waterfall sekcií, napojenie drezu a variča (3 – 5 hodín)</li>
  <li><strong>Finalizácia</strong> – silikónové tesnenie, čistenie, kontrola (1 hodina)</li>
</ol>

<p>Celý proces od objednávky po hotový ostrovček trvá <strong>10 – 15 pracovných dní</strong>. Viac o procese v našom <a href="/blog/od-merania-po-instalaciu-proces-orostone">10-krokovom sprievodcovi</a>.</p>

<figure class="article-figure">
  <img src="/images/blog/article-23/installation.webp" alt="Dvaja technici osádzajú sinterovanú kamennú dosku na kuchynský ostrovček pomocou prísaviek" width="1408" height="792" loading="lazy" />
  <figcaption>Montáž ostrovčeka – technici ukladajú kamennú platňu na korpus pomocou vákuových prísaviek. Na doske vodováha a silikón pre presné osadenie.</figcaption>
</figure>

<h2 id="cena">Koľko stojí ostrovček zo sinterovaného kameňa?</h2>

<div class="article-highlight">
  <p><strong>Materiál na ostrovček (s DPH, podľa dekoru):</strong></p>
  <ul>
    <li><strong>Ostrovček do 3\u00A0200\u00A0×\u00A01\u00A0600\u00A0mm bez waterfall hrán:</strong> 1 platňa – ${ONE_SLAB}</li>
    <li><strong>Ostrovček s waterfall hranami alebo väčší ostrovček:</strong> podľa rozmerov 1 – 2 platne, pri 2 platniach ${TWO_SLABS}</li>
  </ul>
  <p>Orostone predáva materiál – celé platne. Výrobu (rezy, výrezy, waterfall hrany) a montáž robí a fakturuje partnerský kamenár, orientačne za ${INSTALLATION_RATE_PER_M2}\u00A0€/m² s DPH. Ceny všetkých dekorov nájdete v <a href="/cennik">cenníku</a>.</p>
</div>

<p>Cena závisí predovšetkým od dekóru (niektoré vzory sú drahšie), počtu waterfall hrán a zložitosti výrezov. <a href="/kontakt">Kontaktujte nás</a> pre nezáväznú cenovú ponuku na mieru.</p>

<h2 id="odporucane-dekory">Odporúčané dekóry pre ostrovčeky</h2>

<p>Pre kuchynský ostrovček odporúčame dekóry s výrazným vzorom, ktorý vynikne na veľkej ploche:</p>

<ul>
  <li><a href="/produkt/calacatta-top"><strong>Calacatta Top</strong></a> – klasický mramorový vzor so zlatými žilami. Najobľúbenejší dekór pre ostrovčeky.</li>
  <li><a href="/produkt/wild-forest"><strong>Wild Forest</strong></a> – dramatické tmavé žily na šedom podklade. Výrazný akcent pre moderné interiéry.</li>
  <li><a href="/produkt/statuario-diamante"><strong>Statuario Diamante</strong></a> – biely základ s výraznými sivými žilami. Klasický mramorový vzhľad.</li>
  <li><a href="/produkt/nero-margiua"><strong>Nero Margiua</strong></a> – čierny mramor pre odvážne priestory. Waterfall hrany v čiernej sú vizuálne najsilnejšie.</li>
</ul>

<p>Nie ste si istí dekórom? <a href="/vzorky">Objednajte si vzorky</a> – prvá je zadarmo, každá ďalšia stojí 4,90\u00A0€ a doprava 2,50\u00A0€. Vzorka 10\u00A0×\u00A010\u00A0cm ukáže farbu a povrch, celý priebeh kresby uvidíte na veľkej platni v showroome v Bošanoch.</p>

<figure class="article-figure">
  <img src="/images/blog/article-23/decor-lifestyle.webp" alt="Luxusný Calacatta ostrovček s waterfall hranami vo večernej atmosfére – pár s vínom pri barovom sedení" width="1408" height="792" loading="lazy" />
  <figcaption>Calacatta ostrovček s waterfall hranami – sinterovaný kameň je stredobodom celého obytného priestoru.</figcaption>
</figure>

<div class="article-quote">
  <p>Kuchynský ostrovček zo sinterovaného kameňa nie je len pracovná plocha. Je to stredobod celého obytného priestoru – investícia do každodenného zážitku.</p>
</div>
`,
    faqs: [
      {
        question: 'Koľko miesta potrebuje kuchynský ostrovček so sedením?',
        answer: 'Na jednu osobu počítajte 600\u00A0mm dĺžky ostrovčeka, previs pre kolená 300 – 400\u00A0mm (optimum 350\u00A0mm) a za stoličkami aspoň 900\u00A0mm voľného priestoru. Pri výške plochy 900\u00A0mm sa hodia stoličky so sedákom okolo 650\u00A0mm, pri barovej výške 1\u00A0050\u00A0mm okolo 750\u00A0mm.',
      },
      {
        question: 'Aká hrúbka sinterovaného kameňa je vhodná pre kuchynský ostrovček?',
        answer: 'Orostone predáva 12\u00A0mm platne a ostrovček so sedením sa z nich robí bežne. Bez podpery znesie 12\u00A0mm platňa previs do 200\u00A0mm; barové sedenie potrebuje previs 300 – 400\u00A0mm, preto ho nesú nerezové konzoly. Podmienkou je súvislá podkladová konštrukcia.',
      },
      {
        question: 'Koľko stojí kuchynský ostrovček zo sinterovaného kameňa?',
        answer: `Materiál na ostrovček je podľa rozmerov a waterfall hrán 1 – 2 celé platne: jedna platňa u Orostone stojí ${ONE_SLAB} s DPH podľa dekoru. Výrobu a montáž robí a fakturuje partnerský kamenár, orientačne za ${INSTALLATION_RATE_PER_M2}\u00A0€/m². Cena závisí od dekóru, počtu waterfall hrán a zložitosti výrezov.`,
      },
      {
        question: 'Čo je waterfall hrana na ostrovčeku?',
        answer: 'Waterfall (kaskádová) hrana znamená, že kameň pokračuje z hornej plochy zvisle nadol po boku ostrovčeka. Dva kusy sa spájajú pod 45° uhlom farebne zladeným lepidlom – výsledok vyzerá ako monolitický blok kameňa.',
      },
      {
        question: 'Aký veľký môže byť ostrovček z jedného kusu?',
        answer: 'Maximálna veľkosť jednej sinterovanej platne je typicky 3\u00A0200\u00A0×\u00A01\u00A0600\u00A0mm. Ostrovček do tejto veľkosti sa dá vyrobiť z jedného kusu bez spojov na hornej ploche.',
      },
      {
        question: 'Potrebuje ostrovček zo sinterovaného kameňa špeciálnu podperu?',
        answer: 'Áno. Ostrovček potrebuje kuchynský korpus ako jadro, podlepenie MDF doskou pre rovnomerný tlak a nerezové konzoly pri barových previsoch nad 200\u00A0mm. Konzoly sa montujú pod dosku a sú skryté za obkladom.',
      },
      {
        question: 'Ako dlho trvá výroba a montáž ostrovčeka?',
        answer: 'Od zamerania po hotový ostrovček počítajte s 10 – 15 pracovnými dňami. Samotná montáž na mieste trvá 3 – 5 hodín vrátane lepenia waterfall sekcií a napojenia drezu.',
      },
    ],
  },

  en: {
    title: 'Kitchen Island in Sintered Stone — Complete Guide',
    subtitle: 'From dimensions to thickness to waterfall edges: everything you need to know before ordering',
    excerpt: 'A sintered stone kitchen island is the visual centerpiece of a modern kitchen. We advise on dimensions, slab thickness, edge profiles and waterfall execution.',
    directAnswer: `A sintered stone kitchen island is made from a 12 mm slab. An overhang above 200 mm, such as for bar seating, needs a stainless steel support structure, and cutouts are made precisely on a CNC machine. For the waterfall effect, slabs are joined at a 45° angle with color-matched adhesive. The material is 1–2 whole slabs at ${ONE_SLAB_EN} each; fabrication and installation are done and invoiced by the partner stonemason.`,
    content: '<p>Article available in Slovak. <a href="/blog/kuchynsky-ostrovcek-zo-sinterovaneho-kamena">Čítať po slovensky</a></p>',
    faqs: [
      { question: 'What thickness of sintered stone is needed for a kitchen island?', answer: 'Orostone supplies 12 mm slabs, and islands with seating are commonly made from them. Without support, a 12 mm slab takes an overhang of up to 200 mm; bar seating needs a 300–400 mm overhang, so it is carried by stainless steel brackets. A continuous substrate is required.' },
      { question: 'How much does a sintered stone kitchen island cost?', answer: `Depending on its size and waterfall edges, an island needs 1–2 whole slabs; one Orostone slab costs ${ONE_SLAB_EN} incl. VAT depending on the decor. Fabrication and installation are done and invoiced by the partner stonemason, at roughly €${INSTALLATION_RATE_PER_M2}/m².` },
      { question: 'What is a waterfall edge?', answer: 'A waterfall edge means the stone continues from the top surface vertically down the side of the island, joined at a 45° angle with color-matched adhesive for a monolithic look.' },
    ],
  },
};
