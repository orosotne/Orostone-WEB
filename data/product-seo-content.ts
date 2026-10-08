import { BULK_DISCOUNT, INSTALLATION_RATE_PER_M2, SLAB_PRICES, formatEur, formatEurWhole } from './pricing';
import { calculateSlabPrice } from '../lib/slab';

export interface ProductFAQ {
  question: string;
  answer: string;
}

export interface ProductSEOContent {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  shortDescription: string;
  longDescription: string;
  keyBenefits: string[];
  faqs?: ProductFAQ[];
}

/**
 * Generic product FAQs applicable to all large-format slabs.
 * Merged with product-specific FAQs (if any) on the detail page.
 */
export const GENERIC_PRODUCT_FAQS: ProductFAQ[] = [
  {
    question: 'Je tento materiál vhodný do kúpeľne?',
    answer: 'Áno. Sinterovaný kameň má takmer nulovú nasiakavosť (porozita < 0,1 %), takže je vhodný do kúpeľní, sprchových kútov aj wellness priestorov. Nevyžaduje impregnáciu a odolá trvalému kontaktu s vodou.',
  },
  {
    question: 'Ako sa o platne starať?',
    answer: 'Údržba je minimálna – stačí teplá voda a jemný saponát. Materiál je nenasiakavý, nepotrebuje impregnáciu ani špeciálne vosky. Odolá bežným čistiacim prostriedkom vrátane kyselín.',
  },
  {
    question: 'Môžem položiť horúci hrniec priamo na povrch?',
    answer: 'Áno. Sinterovaný kameň odoláva teplotám až do 300 °C. Horúci hrniec alebo panvicu môžete položiť priamo na povrch bez obáv z poškodenia alebo zmeny farby.',
  },
  {
    question: 'Aká je dodacia lehota?',
    answer: 'Skladové platne dodávame spravidla do 5 pracovných dní po úhrade. Projekty na mieru (s rezaním, opracovaním) dodávame do 15 pracovných dní.',
  },
  {
    question: 'Zabezpečujete aj montáž?',
    answer: `Montáž nepredávame, sprostredkujeme ju. Zameranie, výrobu a montáž robí overený partnerský kamenár so skúsenosťou s veľkoformátovými platňami zo sinterovaného kameňa, orientačne za ${INSTALLATION_RATE_PER_M2} €/m² s DPH. Cenu montáže platíte priamo kamenárovi; od nás kupujete materiál.`,
  },
];

/**
 * Centralized SEO content for all 12 large-format slab designs.
 * Keyed by product handle (Shopify handle or local `id`).
 * Used by shopify.service.ts, ShopProductDetail.tsx, and static SEO files.
 */
export const PRODUCT_SEO_CONTENT: Record<string, ProductSEOContent> = {
  'statuario-diamante': {
    metaTitle: 'Statuario Diamante — biely mramorový dekor | OROSTONE',
    metaDescription: 'Biely sinterovaný kameň s jemným šedým žilkovaním. Pre kuchyne, kde má plocha priniesť svetlo bez toho, aby zaťažila výraz. Vzorka na vyžiadanie.',
    keywords: [
      'statuario diamante',
      'biely mramor obklad',
      'veľkoformátové platne bratislava',
      'luxusné obklady',
      'porcelánové platne',
    ],
    shortDescription:
      'Biely dekor so strieborno-sivým žilkovaním v duchu talianskeho mramoru Statuario. Kresba je čitateľná, ale vedená pokojne, takže plocha pridá svetlo a výraz priestoru nezaťaží. Hodí sa na pracovné dosky, ostrovčeky, zásteny, obklad stien aj podlahy — v kuchyni, kúpeľni, obývačke aj vstupnej hale.',
    longDescription:
      '<p>STATUARIO DIAMANTE vychádza z talianskeho mramoru Statuario — biely základ, cez ktorý prechádzajú strieborno-sivé žilky. Kontrast tvorí kresba, nie farba, takže plocha ostáva svetlá a prehľadná. Povrch 4D Marble s belosťou 72° drží biely tón čistý a kresbu presnú aj na veľkej ploche.</p>' +
      '<p>Vo svetlej kuchyni dekor funguje s bielymi aj drevenými frontmi — pridá plochu s vlastným charakterom, ktorá neprebíja zvyšok zostavy. Platňa 3200 × 1600 mm pokryje dosku aj ostrovček s minimom spojov a kresbu je možné napájať (book-match). Zástena aj obklad steny sa dajú urobiť z rovnakého dekoru, takže línia ostane súvislá.</p>' +
      '<p>Ako sinterovaný kameň má nasiakavosť pod 0,1 % — víno, olej ani káva sa do povrchu nevpijú a impregnácia nie je potrebná. Znesie horúci hrniec, odolá poškriabaniu aj vlhkosti a je UV stabilný, takže nebledne ani na presvetlenej terase. Na dennú údržbu stačí vlhká utierka s neutrálnym saponátom.</p>',
    keyBenefits: [
      'Biely základ so strieborno-sivým žilkovaním v duchu mramoru Statuario',
      'Povrch 4D Marble 72° drží biely tón čistý a kresbu presnú',
      'Nasiakavosť pod 0,1 % — škvrny sa nevpíjajú, impregnáciu netreba',
      'Odolný voči teplu, poškriabaniu, vlhkosti aj UV — nebledne vnútri ani vonku',
      'Platňa 3200 × 1600 mm pokryje dosku aj ostrovček s minimom spojov',
    ],
  },

  'calacatta-top': {
    metaTitle: 'Calacatta Top — biely mramorový dekor | OROSTONE',
    metaDescription: 'Biely mramorový dekor so zlatistými žilkami. Pre kuchyne a kúpeľne, kde má plocha pôsobiť reprezentatívne, ale nie efektne. Pošlite pôdorys, vyrátame cenu.',
    keywords: [
      'calacatta obklad',
      'calacatta mramor platne',
      'luxusné dlažby bratislava',
      'kuchynský obklad calacatta',
      'prémiové obklady',
    ],
    shortDescription:
      'Biely mramorový dekor s teplými zlatohnedými žilkami, ktorým lesklý povrch dodáva hĺbku. Hodí sa na kuchynské dosky, ostrovčeky, zásteny aj steny kúpeľne, kde má plocha pôsobiť reprezentatívne. Sinterovaný kameň, ktorý nepotrebuje impregnáciu.',
    longDescription:
      '<p>CALACATTA TOP je biely mramorový dekor s teplými zlatohnedými žilkami. Lesklá úprava Nanotech Polished kresbe dodáva hĺbku a jej vyznenie sa mení so svetlom — ráno pôsobí inak než pri večernom teplom svetle. Kresbu mramoru tak dostanete bez starostí, ktoré pravý mramor prináša.</p>' +
      '<p>Hodí sa na pracovné dosky a ostrovčeky, kde má byť doska dominantou kuchyne, rovnako na zásteny, umývadlové dosky, steny kúpeľne aj podlahy. Ladí s bielymi kuchynskými frontmi, prírodným drevom a bronzovými detailmi. Pri väčších plochách si platne pozrite osobne v showroome v Bošanoch — záleží, ako na sebe kresba nadväzuje.</p>' +
      '<p>Sinterovaný kameň má nasiakavosť pod 0,1 %, takže víno, káva ani citrón sa do povrchu nevpijú a doska nepotrebuje impregnáciu. Odoláva teplu aj UV žiareniu — horúci hrniec plochu nepoškodí a odtieň pri okne nevybledne. Lesklý povrch ukáže odtlačky skôr než matný, zotriete ich vlhkou utierkou.</p>',
    keyBenefits: [
      'Biely mramorový dekor s teplými zlatohnedými žilkami',
      'Lesklý povrch Nanotech zvýrazňuje kresbu a jej hĺbku',
      'Nasiakavosť pod 0,1 % — škvrny sa nevpíjajú, bez impregnácie',
      'Odolný voči teplu aj UV, odtieň pri okne nevybledne',
      'Na dosky, ostrovčeky, zásteny, steny kúpeľne aj podlahy',
    ],
  },

  'givenchy-gold': {
    metaTitle: 'Givenchy Gold — zlatistý mramorový dekor | OROSTONE',
    metaDescription: 'Biely dekor s výrazným zlatobéžovým žilkovaním. Pre interiéry, kde má dekor niesť vlastnú váhu — kúpeľne, akcentové steny, ostrovčeky. Veľká platňa v showroome Bošany.',
    keywords: [
      'givenchy gold obklad',
      'zlaté mramorové platne',
      'luxusné interiéry bratislava',
      'zlatý dizajn podlahy',
      'prémiové platne',
    ],
    shortDescription:
      'Biely podklad s výrazným zlatobéžovým žilkovaním, ktoré sa miestami vetví. Hodí sa tam, kde má mať plocha vlastnú váhu — na kuchynskú dosku, ostrovček, umývadlovú dosku alebo obklad steny. Kresba nesie priestor sama, preto okolie znesie pokojnejšie riešenie.',
    longDescription:
      '<p>GIVENCHY GOLD má biely podklad s výrazným zlatobéžovým žilkovaním. Tenké línie sa miestami rozširujú a vetvia, takže kresba vynikne aj na veľkom ostrovčeku. Povrch 4D Marble kreslí vzor na základni s vysokou belosťou (72°), takže zlaté tóny ostávajú čisté. Ako dekor reaguje na svetlo, si najlepšie overíte na vzorke alebo na celej platni.</p>' +
      '<p>Zlato-okrové tóny ladia s dubom a orechom; kontrast dodá matná čierna batéria alebo úchytky a k zlatu sadne aj akcentové osvetlenie. Dekor funguje na kuchynskej doske a ostrovčeku, na umývadlovej doske aj na obklade steny. Keďže kresba nesie priestor sama, okolie nechajte jednoduchšie, aby dostala miesto.</p>' +
      '<p>Ako sinterovaný kameň má nasiakavosť pod 0,1 % — káva, víno ani citrónová šťava sa do povrchu nevpijú a stačí ich zotrieť. Povrch znesie horúci hrniec zo sporáka, odolá bežnému poškriabaniu od riadu aj kuchynským kyselinám. Impregnáciu nepotrebuje; na údržbu stačí vlhká utierka a neutrálny saponát.</p>',
    keyBenefits: [
      'Výrazné zlatobéžové žilkovanie na bielom podklade',
      'Veľký formát drží súvislú kresbu na doske aj obklade',
      'Nasiakavosť pod 0,1 % — škvrny sa do povrchu nevpíjajú',
      'Odolný voči teplu, poškriabaniu aj kuchynským kyselinám',
      'Bez impregnácie — stačí vlhká utierka a neutrálny saponát',
    ],
  },

  'roman-travertine': {
    metaTitle: 'Roman Travertine — travertínový dekor | OROSTONE',
    metaDescription: 'Roman Travertine prináša prirodzenú textúru travertínu — bez nasiakavosti, bez impregnácie a bez údržby, ktorú by si reálny travertín vyžadoval.',
    keywords: [
      'travertín obklad',
      'travertínové platne bratislava',
      'béžové dlažby',
      'stredomorský interiér',
      'rímsky travertín',
    ],
    shortDescription:
      'Teplé krémové až béžové odtiene s vrstvenou kresbou travertínu a jemným reliéfom. Plocha pôsobí prirodzene a hrejivo, bez ostrých kontrastov. Hodí sa na pracovné dosky, obklady, podlahy aj terasy a ako sinterovaný kameň nepotrebuje impregnáciu, akú si žiada pravý travertín.',
    longDescription:
      '<p>ROMAN TRAVERTINE má teplé krémové až béžové odtiene a vrstvenú kresbu travertínu. Jemný reliéf dáva ploche hĺbku, kresba je pritom pokojná — vo formáte 3200 × 1600 mm pôsobí plocha celistvo, s minimom spojov. Matný povrch Ultrasoft je mäkký na dotyk a svetlo skôr rozptyľuje, než aby ho vracal v ostrých odleskoch.</p>' +
      '<p>Dekor funguje na kuchynských pracovných doskách a ostrovčekoch vrátane plôch so vstavaným varičom, aj na obkladoch stien, podlahách a v kúpeľniach. Ako sinterovaný kameň je mrazuvzdorný a UV stabilný, takže obstojí aj na terase, fasáde či vo vonkajšej kuchyni. Ladí so svetlým drevom, bielymi stenami a ľanovými textíliami.</p>' +
      '<p>Nasiakavosť pod 0,1 % znamená, že škvrny sa nevpíjajú — olej či víno ostanú na povrchu a zotriete ich vlhkou utierkou. Pravý travertín je pórovitý a treba ho pravidelne impregnovať; tu impregnácia odpadá. Povrch odolá teplu odloženého hrnca aj bežnému poškriabaniu a na priamom slnku nebledne.</p>',
    keyBenefits: [
      'Teplé krémové až béžové odtiene s vrstvenou kresbou travertínu',
      'Matný povrch Ultrasoft, mäkký na dotyk a bez ostrých odleskov',
      'Nasiakavosť pod 0,1 % — škvrny sa nevpíjajú, stačí vlhká utierka',
      'Bez impregnácie — pravý travertín ju potrebuje pravidelne',
      'Mrazuvzdorný a UV stabilný — vhodný na terasy aj vonkajšie kuchyne',
    ],
  },

  'taj-mahal': {
    metaTitle: 'Taj Mahal — krémový sinterovaný kameň | OROSTONE',
    metaDescription: 'Krémový mramorový dekor s mäkkou kresbou. Pre kuchyne s teplými drevenými frontami a interiéry, kde má povrch hriať, nie chladiť. Vzorka aj poradenstvo bez záväzku.',
    keywords: [
      'taj mahal obklad',
      'krémový mramor',
      'spa kúpeľňa obklad',
      'mramorové platne',
      'krémové obklady bratislava',
    ],
    shortDescription:
      'Krémovo-biely dekor s mäkkým zlatistým žilkovaním. Pôsobí teplejšie než studená biela a kresba plochu nerozbíja. Hodí sa do kúpeľní, predsiení aj kuchýň s drevenými frontami — tam, kde má povrch hriať, nie chladiť.',
    longDescription:
      '<p>TAJ MAHAL vychádza z kresby jemného svetlého mramoru. Krémovo-biely základ nesie delikátne zlatisté žilkovanie, ktoré sa po ploche rozbieha pomaly a bez ostrých kontrastov. Na veľkoformátovej platni tak vzniká pokojná plocha — kresba je čitateľná zblízka, z odstupu splynie do jednoliateho teplého tónu.</p>' +
      '<p>Teplý podtón určuje, s čím dekor ladí: krémová, béžová, svetlé drevo, mosadzné a zlaté detaily. V kúpeľni funguje ako celoplošný obklad okolo vane aj za umývadlom — pokojnú, kúpeľovú atmosféru udrží aj na veľkej ploche. V kuchyni je to doska k dreveným frontám, v predsieni prvá plocha, ktorú vidíte po vstupe. Pri mäkkom osvetlení pôsobia žilky jemnejšie než pri ostrom svetle.</p>' +
      '<p>Ako sinterovaný kameň má nasiakavosť pod 0,1 % — povrch je nepórovitý a hygienický, vlhkosť ani škvrny sa doň nevpíjajú a plesne nemajú kde rásť, takže impregnácia nie je potrebná. Povrch Silk je jemne zamatový, medzi matom a leskom: príjemný na dotyk a zhovievavý k odtlačkom prstov. Odolá teplu aj poškriabaniu a na údržbu stačí vlhká utierka s bežným saponátom.</p>',
    keyBenefits: [
      'Krémovo-biely základ s mäkkým zlatistým žilkovaním',
      'Teplý tón — ladí s drevom, béžovou a mosadznými detailmi',
      'Povrch Silk: jemne zamatový, zhovievavý k odtlačkom prstov',
      'Nasiakavosť pod 0,1 % — nepórovitý, hygienický povrch bez impregnácie',
      'Odolný voči teplu a poškriabaniu, údržba vlhkou utierkou',
    ],
  },

  'appennino': {
    metaTitle: 'Appennino — svetlý sinterovaný kameň | OROSTONE',
    metaDescription: 'Pokojný svetlý dekor pre kuchyne, kde má plocha pôsobiť čisto a vyvážene. Bez agresívnej kresby a bez impregnácie. Vzorka Appennino na vyžiadanie.',
    keywords: [
      'appennino obklad',
      'prírodný kameň dizajn',
      'akcentová stena obklad',
      'veľkoformátové platne',
      'svetlý sinterovaný kameň',
    ],
    shortDescription:
      'Svetlý, takmer biely dekor s hustou, ale jemnou zlatobéžovou kresbou. Žilkovanie je detailné a pritom nízkokontrastné, takže plocha pôsobí čisto a vyvážene a nesúperí so zvyškom kuchyne. Určený na pracovné dosky, ostrovčeky, obklad stien, podlahy aj kúpeľne.',
    longDescription:
      '<p>APPENNINO je svetlý, takmer biely sinterovaný kameň s hustou sieťou jemných zlatobéžových žiliek. Kresba je detailná, no vedená v nízkom kontraste, takže z odstupu plocha pôsobí pokojne a celistvo. Každá platňa má vlastný priebeh žilkovania — dve rovnaké dosky neexistujú, konkrétnu platňu si viete vybrať v showroome v Bošanoch.</p>' +
      '<p>Hodí sa do kuchýň, kde má plocha priniesť svetlo a nie pozornosť. Jemná kresba znesie jednofarebné aj drevené fronty a funguje rovnako v industriálnom interiéri — s betónom, kovom a tmavším drevom. Určený je na pracovné dosky, ostrovčeky, obklad stien, podlahy aj kúpeľne; veľkoformátové platne udržia kresbu súvislú s minimom spojov.</p>' +
      '<p>Nasiakavosť pod 0,1 % znamená, že škvrny od vína, oleja či kávy sa nemajú kam vpiť — stačí vlhká utierka s bežným saponátom, bez impregnácie a voskov. Doska znesie teplo do 300 °C, takže odložený horúci hrniec jej neublíži, a tvrdosť Mohs 7+ ju chráni pred bežnými škrabancami. Povrch s úpravou Gluetech je UV stabilný, odtieň nebledne ani pri veľkom okne.</p>',
    keyBenefits: [
      'Svetlý takmer biely základ s jemnou zlatobéžovou kresbou',
      'Každá platňa má vlastnú kresbu — dve rovnaké dosky neexistujú',
      'Nasiakavosť pod 0,1 %, škvrny sa nevpíjajú a netreba impregnáciu',
      'Odolnosť voči teplu do 300 °C, tvrdosť Mohs 7+ a UV stabilita',
      'Na pracovné dosky, ostrovčeky, obklad stien, podlahy aj kúpeľne',
    ],
  },

  'astrana-grey': {
    metaTitle: 'Astrana Grey — sivý sinterovaný kameň | OROSTONE',
    metaDescription: 'Astrana Grey je vyrovnaný sivý dekor s jemnou kresbou. Funguje v kuchyniach, kde má pracovná doska držať pokojnú líniu interiéru. Vzorka aj poradenstvo bez záväzku.',
    keywords: [
      'sivé mramorové platne',
      'astrana grey',
      'moderné obklady bratislava',
      'šedý mramor',
      'sivé dlažby',
    ],
    shortDescription:
      'Vyrovnaná sivá s jemným gradovaním odtieňov a diskrétnym svetlejším žilkovaním. Plocha drží pokojnú líniu a nepreťahuje pozornosť na seba. Hodí sa na pracovné dosky, ostrovčeky aj zásteny v interiéroch, kde má byť tichým podkladom, nie hlavnou témou.',
    longDescription:
      '<p>ASTRANA GREY je svetlosivý dekor bez ostrých kontrastov. Jemné gradovanie odtieňov, diskrétne svetlejšie žilkovanie a miestami béžové detaily sú čitateľné zblízka, z odstupu sa plocha číta ako jeden pokojný tón. Dekor nemá dominantné žily, takže neurčuje charakter miestnosti — necháva ho na nábytku, svetle a materiáloch okolo.</p>' +
      '<p>Sivá znesie teplé aj studené okolie. Dobre sadne k dubu, bielemu lakovanému sklu aj matnému čiernemu kovaniu a funguje v škandinávskom rovnako ako v talianskom minimalizme. V otvorenej dispozícii, kde kuchyňu vidno z obývačky, plocha nerobí vizuálny zlom — z veľkoformátových platní vyjde doska, ostrovček aj zástena z jedného dekoru s minimom viditeľných spojov.</p>' +
      '<p>Sinterovaný kameň s povrchom Gluetech má nasiakavosť pod 0,1 %: káva, víno ani olej sa doň nevpijú a impregnácia nie je potrebná. Tvrdosť Mohs 7+ znamená, že doska odolá bežnej práci s riadom a náradím, a teplotná odolnosť do 300 °C znesie aj hrniec odložený priamo na plochu. UV stabilita drží odtieň aj pri okne. V rodinnej kuchyni v dennej prevádzke tak na údržbu stačí vlhká utierka s neutrálnym saponátom.</p>',
    keyBenefits: [
      'Vyrovnaná sivá bez výraznej kresby, plocha nepreťahuje pozornosť',
      'Ladí s dubom, bielym sklom aj matným čiernym kovaním',
      'Nasiakavosť pod 0,1 % — škvrny sa nevpíjajú, netreba impregnáciu',
      'Odolá teplu do 300 °C aj poškriabaniu — tvrdosť Mohs 7+',
      'Platne 3200 × 1600 mm pre súvislú plochu s minimom spojov',
    ],
  },

  'super-white-extra': {
    metaTitle: 'Super White Extra — čistý biely dekor | OROSTONE',
    metaDescription: 'Svetlý biely sinterovaný kameň s jemným sivým žilkovaním. Pre kuchyne, kde má plocha zostať svetlá a pritom si udržať mramorový výraz. Vzorka na vyžiadanie.',
    keywords: [
      'biele mramorové platne',
      'super white obklad',
      'biele dlažby',
      'minimalistický interiér platne',
      'biele obklady bratislava',
    ],
    shortDescription:
      'Svetlý biely základ pretkaný sivými žilami — niektoré tenké a nenápadné, iné výraznejšie. Doska si tak udrží mramorový výraz aj v kuchyni, kde prevláda biela, a svetlá plocha zároveň opticky zväčší menšiu či tmavšiu miestnosť.',
    longDescription:
      '<p>SUPER WHITE EXTRA je svetlá biela pretkaná sivými žilami — niektoré sú tenké a nenápadné, iné výraznejšie, takže plocha si drží mramorový výraz a nepôsobí ako jednoliaty tón. Povrch Silk (Velvet) leží medzi matom a leskom: svetlo neláme do ostrých odleskov, ale ani ho nepohltí. Vo formáte 3200 × 1600 mm to znamená plochu s minimom škár.</p>' +
      '<p>Hodí sa do kuchýň a kúpeľní, kde má byť plocha svetlá, ale nie prázdna. So sivými skrinkami ladí farebne, dubové drevo jej dodá teplejší nádych, a znesie aj farebné akcenty, umenie či rastliny — vymeníte textílie či obrazy a plocha ostane rovnaká. Použiť sa dá na kuchynskú dosku, obklad aj dlažbu, od predsiene po kúpeľňu.</p>' +
      '<p>Nasiakavosť pod 0,1 % znamená, že káva, víno ani olej sa do bielej plochy nevpijú — povrch je nepórovitý a hygienický, stačí vlhká utierka a impregnácia nie je potrebná. Sinterovaný kameň je UV stabilný podľa DIN 51094, takže biela nezažltne ani pri celoročnom dennom svetle. Odolá poškriabaniu a zamatový Silk nezvýrazňuje odtlačky prstov.</p>',
    keyBenefits: [
      'Svetlá biela so sivým žilkovaním — drží mramorový výraz',
      'Povrch Silk (Velvet): zamatový, nezvýrazňuje odtlačky prstov',
      'Nasiakavosť pod 0,1 % — škvrny sa nevpíjajú, bez impregnácie',
      'UV stabilný podľa DIN 51094, biela nezažltne pri dennom svetle',
      'Opticky zväčšuje menšie a tmavšie miestnosti, na obklad aj dlažbu',
    ],
  },

  'gothic-gold': {
    metaTitle: 'Gothic Gold — tmavý dekor so zlatistou kresbou | OROSTONE',
    metaDescription: 'Gothic Gold je tmavý dekor so zlatistými žilkami. Pre kuchyne, kde má pracovná doska niesť dramatickejšiu líniu. Pozrite veľkú platňu v showroome Bošany.',
    keywords: [
      'gothic gold obklad',
      'tmavé mramorové platne',
      'zlaté žilky obklad',
      'dark luxury interiér',
      'dramatické obklady',
    ],
    shortDescription:
      'GOTHIC GOLD je tmavý dekor so zlatistou kresbou, ktorá sa cez plochu tiahne v nepravidelných žilkách. Hodí sa tam, kde má mať priestor jasný stred — na ostrovček, pracovnú dosku, zástenu aj obklad steny. Povrch je matný, s úpravou Microtech.',
    longDescription:
      '<p>GOTHIC GOLD má hlboký tmavý podklad, cez ktorý sa ťahajú zlatisté žilky. Kresba je nepravidelná a výraznejšia než pri svetlých dekoroch s jemným žilkovaním, takže plocha nepôsobí neutrálne. Pod bodovým svetlom žilky vystúpia, pri tlmenom osvetlení sa povrch upokojí a prevládne tmavý tón.</p>' +
      '<p>Najlepšie funguje tam, kde má jedna plocha niesť priestor: kuchynský ostrovček, pracovná doska, zástena za varnou doskou, obklad steny alebo kúpeľňa. Okolie nechajte pokojnejšie — so svetlým okolím pôsobí dekor ako prirodzený stred miestnosti. Vo veľkoformátovej platni kresba pokračuje bez prerušenia, takže doska a zástena držia jednu líniu.</p>' +
      '<p>Sinterovaný kameň má nasiakavosť pod 0,1 %, takže víno, olej ani káva sa do plochy nevpijú a škvrnu stačí zotrieť vlhkou utierkou. Povrch je odolný voči teplu aj poškriabaniu, znesie horúci hrniec a nepotrebuje impregnáciu. Matný povrch s úpravou Microtech je príjemný na dotyk a nezvýrazňuje odtlačky prstov, čo je pri tmavom dekore podstatné.</p>',
    keyBenefits: [
      'Tmavý podklad so zlatistými žilkami a výraznou kresbou',
      'Matný povrch s úpravou Microtech, nezvýrazňuje odtlačky',
      'Nasiakavosť pod 0,1 % — škvrny sa do plochy nevpíjajú',
      'Odolný voči teplu a poškriabaniu, bez impregnácie',
      'Vhodný na ostrovček, dosku, zástenu aj obklad steny',
    ],
  },

  'wild-forest': {
    metaTitle: 'Wild Forest — výrazný dekor pre veľké plochy | OROSTONE',
    metaDescription: 'Wild Forest je výrazný dekor s veľkoplošnou kresbou. Vzorka 10×10 cm ho nezachytí — odporúčame pozrieť veľkú platňu v showroome Bošany.',
    keywords: [
      'prírodný kameň obklad',
      'wild forest platne',
      'organický dizajn interiér',
      'kamenné obklady bratislava',
      'wellness obklady',
    ],
    shortDescription:
      'WILD FOREST je výrazný dekor v sivohnedých a zemitých tónoch s kresbou, ktorá pripomína kamenné plochy v lese. Vzor je veľkoplošný, preto vynikne na väčšej súvislej ploche — na ostrovčeku, celoplošnom obklade steny aj v kúpeľni a wellness zóne.',
    longDescription:
      '<p>WILD FOREST je dekor v sivohnedej a zemitej palete s výraznou, nepravidelnou kresbou, ktorá pripomína kamenné plochy v lese. Vzor je veľkoplošný — celý jeho priebeh sa rozvinie až na platni vo formáte 3200 × 1600 mm. Povrch je matný, s úpravou Microtech: je príjemný na dotyk, neleskne sa a necháva vyniknúť textúru.</p>' +
      '<p>Najviac vynikne na väčšej súvislej ploche: na ostrovčeku, na pracovnej doske s nadväzujúcim obkladom steny alebo na obklade kúpeľne. Ladí s dubovým drevom, zeleňou a textúrovanými tkaninami, doma je aj vo wellness priestoroch a saunách. Vzorka 10×10 cm ukáže farbu a povrch, celý priebeh kresby uvidíte na veľkej platni v showroome v Bošanoch.</p>' +
      '<p>Ide o sinterovaný kameň s nasiakavosťou pod 0,1 % — olej, víno ani káva sa doň nevpijú a povrch nepotrebuje impregnáciu, stačí bežné čistenie. Odolá teplu aj poškriabaniu, takže horúci hrniec môžete odložiť priamo na dosku. Vďaka odolnosti voči vlhkosti a plesniam sa hodí aj na obklad kúpeľne či umývadlovú dosku.</p>',
    keyBenefits: [
      'Sivohnedé zemité tóny s výraznou, nepravidelnou kresbou',
      'Veľkoplošný vzor vynikne na ostrovčeku aj celoplošnom obklade',
      'Matný povrch Microtech — príjemný na dotyk, nezvýrazňuje odtlačky',
      'Nasiakavosť pod 0,1 % — škvrny sa nevpíjajú, bez impregnácie',
      'Odolný voči vlhkosti a plesniam — vhodný do kúpeľne aj sauny',
    ],
  },

  'nero-margiua': {
    metaTitle: 'Nero Margiua — čierny sinterovaný kameň | OROSTONE',
    metaDescription: 'Čierny mramorový dekor s bielou žilkovou kresbou. Pre kuchyne, kde má pracovná doska byť kontrastom proti svetlým frontom. Veľká platňa v showroome Bošany.',
    keywords: [
      'čierny mramor obklad',
      'nero margiua',
      'čierne mramorové platne',
      'luxury čierna kúpeľňa',
      'tmavé obklady',
    ],
    shortDescription:
      'Hlboká čierna so strieborno-bielymi žilkami, ktoré kresbu len jemne rozjasnia. Plocha pôsobí pokojne aj vo veľkom formáte. Funguje ako kuchynská doska či ostrovček, akcentová stena aj celoplošný obklad kúpeľne — všade tam, kde má tmavá plocha tvoriť kontrast voči svetlému okoliu.',
    longDescription:
      '<p>NERO MARGIUA je čierny mramorový dekor s hlbokou, sýtou základňou a jemnými strieborno-bielymi žilkami. Kresba je tichá — nepýta si pozornosť, len rozbíja súvislú čiernu a dáva ploche hĺbku. Matný povrch Diamondglass svetlo skôr pohlcuje než odráža, takže čierna pôsobí hlboko a bez ostrých odleskov.</p>' +
      '<p>Najlepšie funguje ako kontrast: proti bielym alebo svetlým frontom, svetlému drevu a mosadzným či zlatým detailom, v kúpeľni proti bielej sanite a zlatým batériám. Strieborno-biele žilky prepoja čiernu plochu so svetlejším okolím, takže priestor nepôsobí ťažko. V menšej kuchyni ho odporúčame skôr na ostrovček alebo zástenu než na všetky plochy — tmavý povrch pohlcuje svetlo.</p>' +
      '<p>Sinterovaný kameň má nasiakavosť pod 0,1 %, takže olej, víno ani citrón sa do povrchu nevpijú a doska nepotrebuje impregnáciu. Znesie odloženie horúceho hrnca, odoláva poškriabaniu aj UV žiareniu. Matný povrch je navyše k odtlačkom zhovievavejší než lesk — a pri čiernej ploche to rozhoduje o tom, ako často ju budete utierať.</p>',
    keyBenefits: [
      'Hlboká čierna s jemným strieborno-bielym žilkovaním',
      'Matný povrch Diamondglass zvýrazňuje odtlačky menej než lesk',
      'Nasiakavosť pod 0,1 % — škvrny sa nevpíjajú, bez impregnácie',
      'Odolný voči teplu, poškriabaniu aj UV, čierna nevybledne',
      'Kontrast k svetlým frontom, svetlému drevu a mosadzným detailom',
    ],
  },

  'yabo-white': {
    metaTitle: 'Yabo White — teplý biely sinterovaný kameň | OROSTONE',
    metaDescription: 'Yabo White je teplý biely dekor s mäkkou textúrou. Pre kuchyne, kde má svetlá plocha pôsobiť obytne, nie sterilne. Vzorka Yabo White na vyžiadanie.',
    keywords: [
      'biele obklady bratislava',
      'yabo white',
      'teplé biele dlažby',
      'krémová biela kúpeľňa',
      'moderné biele platne',
    ],
    shortDescription:
      'YABO WHITE je teplá biela s krémovým podtónom a jemnou textúrou. Pôsobí mäkšie než studená čistá biela a priestor pritom ostáva svetlý a vzdušný. Neutrálna kresba z neho robí základ, ktorý funguje v kuchyni, kúpeľni aj v chodbe.',
    longDescription:
      '<p>Základom je teplá biela s krémovým podtónom. Namiesto výraznej kresby má plocha jemnú textúru, ktorá sa ukáže až zblízka — z odstupu pôsobí pokojne a celistvo. Oproti studenej čistej bielej je mäkšia a obytnejšia, svetlosť a vzdušnosť si však zachováva. Povrchová úprava Matt (Diamondglass) je matná, bez lesku.</p>' +
      '<p>Ako svetlá pokojná plocha sa hodí na pracovnú dosku, zástenu aj celoplošný obklad — v kuchyni, kúpeľni či v chodbe. Neutrálna kresba ladí s väčšinou interiérov, takže farby, textílie a doplnky okolo nej môžete časom meniť bez toho, aby ste menili obklad alebo dosku.</p>' +
      '<p>Ako sinterovaný kameň má nasiakavosť pod 0,1 % — káva, víno ani olej sa doň nevpíjajú a povrch nepotrebuje impregnáciu. Tvrdosť Mohs 7+ a tepelná odolnosť do 300 °C znamenajú, že odložený horúci hrniec ani denná prevádzka mu neuškodia. Matný povrch nezvýrazňuje odtlačky a na údržbu stačí vlhká utierka s neutrálnym saponátom.</p>',
    keyBenefits: [
      'Teplá biela s krémovým podtónom, mäkšia než studená čistá biela',
      'Jemná textúra bez výraznej kresby — plocha pôsobí pokojne a celistvo',
      'Neutrálny základ do kuchyne, kúpeľne aj chodby, ladí s väčšinou interiérov',
      'Nasiakavosť pod 0,1 % — škvrny sa nevpíjajú, bez impregnácie',
      'Tvrdosť Mohs 7+ a teplo do 300 °C, matný povrch nezvýrazňuje odtlačky',
    ],
  },
};

/**
 * Lookup helper: tries exact handle match first, then normalized.
 * Covers cases where Shopify handle differs slightly from local id.
 */
export function getProductSEOContent(handle: string): ProductSEOContent | undefined {
  const key = PRODUCT_SEO_CONTENT[handle] ? handle : handle.toLowerCase().replace(/[\s_]+/g, '-');
  const entry = PRODUCT_SEO_CONTENT[key];
  if (!entry) return undefined;
  const faqs = entry.faqs ?? PRODUCT_FAQS[key];
  return faqs ? { ...entry, faqs } : entry;
}

// ===========================================
// PRODUCT-SPECIFIC FAQs (dekor-špecifické otázky)
// ===========================================
// 3 curated Q&A per decor + a generated price Q&A with live numbers from
// data/pricing.ts (never hardcoded — synced from Shopify on every build).
// Merged into getProductSEOContent(), so both ProductFAQSection (client)
// and prerenderProduct (static HTML + FAQPage JSON-LD) serve them.

/** Generated price FAQ — live price from the catalog snapshot. */
function priceFaq(id: string, name: string): ProductFAQ {
  const p = SLAB_PRICES.find((s) => s.id === id);
  if (!p) {
    return {
      question: `Koľko stojí ${name}?`,
      answer: 'Aktuálnu cenu nájdete v cenníku na stránke /cennik alebo priamo pri produkte.',
    };
  }
  return {
    question: `Koľko stojí ${name}?`,
    answer: `Aktuálna cena je ${formatEur(p.pricePerM2)}/m² s DPH; celá platňa ${p.dimensions} (hrúbka ${p.thickness}) stojí ≈ ${formatEurWhole(
      calculateSlabPrice(p.pricePerM2, p.dimensions),
    )} s DPH, od ${BULK_DISCOUNT.quantity} platní so zľavou ${BULK_DISCOUNT.discountPercent} %. Predávame materiál — výrobu a montáž robí a fakturuje partnerský kamenár. Ceny všetkých dekorov nájdete na stránke /cennik.`,
  };
}

const CUSTOM_PRODUCT_FAQS: Record<string, { name: string; faqs: ProductFAQ[] }> = {
  'statuario-diamante': {
    name: 'STATUARIO DIAMANTE',
    faqs: [
      {
        question: 'Hodí sa STATUARIO DIAMANTE do bielej kuchyne?',
        answer:
          'Áno. Biely základ s výrazným strieborno-sivým žilkovaním funguje so svetlými skrinkami ako pokojný celok — kontrast dodáva kresba, nie farba. Vo veľkej ploche kresba vynikne, preto odporúčame pozrieť si celú platňu v showroome, nie len vzorku.',
      },
      {
        question: 'Ako pôsobí žilkovanie STATUARIO DIAMANTE vo veľkej ploche?',
        answer:
          'Kresba je vedená naprieč platňou 3200 × 1600 mm, takže doska aj ostrovček ostávajú vizuálne súvislé s minimom spojov. Pri ostrovčeku sa dá kresba napájať (book-match) — spomeňte to pri dopyte, ovplyvňuje počet potrebných platní.',
      },
      {
        question: 'Môžem mať z dekoru STATUARIO DIAMANTE aj zástenu?',
        answer:
          'Áno, dekor je určený na pracovné dosky, zásteny aj obklad stien. Zástena z rovnakého dekoru opticky spojí líniu s doskou; pri návrhu počítame s formátom platne tak, aby sa minimalizoval odpad.',
      },
    ],
  },
  'calacatta-top': {
    name: 'CALACATTA TOP',
    faqs: [
      {
        question: 'Čím je kresba CALACATTA TOP výnimočná?',
        answer:
          'Teplé zlatohnedé žilkovanie na žiarivo bielom základe patrí k najžiadanejším mramorovým vzorom. Na rozdiel od prírodného mramoru nevyžaduje impregnáciu a odoláva kyselinám aj škvrnám — kresbu mramoru dostanete bez jeho starostí.',
      },
      {
        question: 'Je lesklý povrch CALACATTA TOP praktický v kuchyni?',
        answer:
          'Nanotech leštený povrch zvýrazní kresbu a hĺbku dekoru. V dennej prevádzke počítajte s viditeľnejšími odtlačkami než pri matnom povrchu — stačí ich zotrieť vlhkou utierkou, povrch je nenasiakavý.',
      },
      {
        question: 'Kam sa CALACATTA TOP hodí najviac?',
        answer:
          'Na ostrovčeky a zásteny, kde kresba pôsobí ako dominanta kuchyne; funguje aj na stenách kúpeľne. Pri väčších plochách odporúčame vybrať konkrétne platne osobne kvôli nadväznosti kresby.',
      },
    ],
  },
  'givenchy-gold': {
    name: 'GIVENCHY GOLD',
    faqs: [
      {
        question: 'Ako pôsobí GIVENCHY GOLD v kombinácii s drevom?',
        answer:
          'Teplé zlato-okrové žilkovanie prirodzene ladí s dubom a orechom; kontrast vytvorí matná čierna batéria alebo úchytky. Dekor nesie priestor — okolie nechajte jednoduchšie, aby kresba dostala miesto.',
      },
      {
        question: 'Je GIVENCHY GOLD vhodný do kuchyne aj kúpeľne?',
        answer:
          'Áno. Nasiakavosť pod 0,1 % a odolnosť voči kyselinám znamenajú, že povrch funguje na pracovnej doske, umývadlovej doske aj obklade steny — bez impregnácie.',
      },
      {
        question: 'Čo znamená povrch 4D Marble pri GIVENCHY GOLD?',
        answer:
          'Označenie 4D Marble odkazuje na technológiu kresby s vysokou belosťou základu (72°). Ako dekor reaguje na svetlo si najlepšie overíte na vzorke alebo na celej platni v showroome v Bošanoch.',
      },
    ],
  },
  'roman-travertine': {
    name: 'ROMAN TRAVERTINE',
    faqs: [
      {
        question: 'Je ROMAN TRAVERTINE vhodný aj do exteriéru?',
        answer:
          'Áno. Na rozdiel od prírodného travertínu je mrazuvzdorný, UV stabilný a nevyžaduje impregnáciu — vhodný na terasy, fasády aj vonkajšie kuchyne.',
      },
      {
        question: 'Ako pôsobí travertínová textúra vo veľkej ploche?',
        answer:
          'Vrstvená kresba dodáva ploche prirodzený stredomorský charakter — bez pórovitosti prírodného travertínu, takže škvrny sa nevpíjajú a údržba je jednoduchá.',
      },
      {
        question: 'S čím ROMAN TRAVERTINE kombinovať?',
        answer:
          'So svetlým drevom, bielymi stenami a prírodnými textíliami. Dekor funguje na pracovných doskách, ostrovčekoch (aj s varičom), obkladoch stien a v kúpeľniach.',
      },
    ],
  },
  'taj-mahal': {
    name: 'TAJ MAHAL',
    faqs: [
      {
        question: 'Ako pôsobí TAJ MAHAL v kúpeľni?',
        answer:
          'Krémový základ s jemným zlatým žilkovaním vytvára pokojnú, kúpeľovú atmosféru. Nasiakavosť pod 0,1 % znamená odolnosť voči vlhkosti a plesniam bez impregnácie.',
      },
      {
        question: 'S akými farbami TAJ MAHAL ladí?',
        answer:
          'S teplými tónmi — krémová, béžová, svetlé drevo, mosadzné detaily. Vhodný tam, kde chcete mäkší dojem než pri čisto bielych dekoroch.',
      },
      {
        question: 'Aký je povrch Silk na dotyk?',
        answer:
          'Jemne zamatový, medzi matom a leskom. Je príjemný na dotyk, zhovievavý k odtlačkom a na údržbu stačí vlhká utierka s bežným saponátom.',
      },
    ],
  },
  appennino: {
    name: 'APPENNINO',
    faqs: [
      {
        question: 'Je APPENNINO vhodný ako výrazný akcent kuchyne?',
        answer:
          'Áno. Dynamická kresba robí z dosky alebo ostrovčeka prirodzený stred priestoru. Ak chcete pokojnejší celok, kombinujte ho s jednofarebnými skrinkami bez výrazného dekoru.',
      },
      {
        question: 'Ako vyzerá kresba APPENNINO vo veľkej ploche?',
        answer:
          'Každá platňa má prirodzene jedinečnú kresbu. Vo formáte 3200 × 1600 mm vynikne kontinuita žilkovania — preto odporúčame vybrať si konkrétnu platňu v showroome v Bošanoch.',
      },
      {
        question: 'Hodí sa APPENNINO do industriálneho interiéru?',
        answer:
          'Áno, prirodzená kresba funguje s betónom, kovom aj tmavším drevom. Dekor je určený na pracovné dosky, ostrovčeky, kúpeľne aj obklad stien.',
      },
    ],
  },
  'astrana-grey': {
    name: 'ASTRANA GREY',
    faqs: [
      {
        question: 'Hodí sa ASTRANA GREY do škandinávskeho interiéru?',
        answer:
          'Áno. Jemná sivá s decentným žilkovaním je preň typická voľba a funguje aj v talianskom minimalizme. Plocha pôsobí pokojne a nepreťahuje pozornosť na seba.',
      },
      {
        question: 'Je ASTRANA GREY vhodná pre rodinnú kuchyňu?',
        answer:
          'Áno. Nenáročná údržba (vlhká utierka s bežným saponátom), odolnosť voči škvrnám a škrabancom — vlastnosti, ktoré v dennej prevádzke rozhodujú viac než dizajn.',
      },
      {
        question: 'Môže jedna plocha ASTRANA GREY prechádzať z kuchyne do obývačky?',
        answer:
          'Áno. Veľkoformátové platne 3200 × 1600 mm umožňujú súvislé plochy v open-plan dispozíciách s minimom viditeľných spojov.',
      },
    ],
  },
  'super-white-extra': {
    name: 'SUPER WHITE EXTRA',
    faqs: [
      {
        question: 'Je SUPER WHITE EXTRA úplne biely alebo má kresbu?',
        answer:
          'Kresbu má — svetlý biely základ pretkaný sivými žilami, niektoré tenké a nenápadné, iné výraznejšie. Plocha ostáva svetlá a opticky zväčší menšie alebo tmavšie priestory, no drží mramorový výraz.',
      },
      {
        question: 'Nezažltne biely povrch časom?',
        answer:
          'Nie. Sinterovaný kameň je UV stabilný (certifikované podľa DIN 51094) — farba sa nemení ani pri celoročnom dennom svetle, na rozdiel od bielych quartzových kompozitov pri oknách.',
      },
      {
        question: 'Aký je povrch Silk (Velvet) na dotyk?',
        answer:
          'Jemne zamatový, medzi matom a leskom. Nezvýrazňuje odtlačky a dobre znáša každodenné čistenie bežným saponátom.',
      },
    ],
  },
  'gothic-gold': {
    name: 'GOTHIC GOLD',
    faqs: [
      {
        question: 'Kam sa hodí dramatický GOTHIC GOLD?',
        answer:
          'Na plochy, ktoré majú niesť priestor: ostrovček, zástena alebo stena. V kombinácii so svetlým okolím pôsobí ako prirodzený stred kuchyne.',
      },
      {
        question: 'Ako reagujú zlaté žilky GOTHIC GOLD na svetlo?',
        answer:
          'Pod bodovým svetlom kresba vystúpi, pri tlmenom osvetlení pôsobí povrch pokojnejšie. Odporúčame pozrieť si platňu pri rôznom osvetlení v showroome v Bošanoch.',
      },
      {
        question: 'Je tmavý matný povrch náročný na údržbu?',
        answer:
          'Nie. Matný povrch s Microtech úpravou nezvýrazňuje odtlačky a vďaka nasiakavosti pod 0,1 % sa škvrny nevpíjajú — stačí vlhká utierka.',
      },
    ],
  },
  'wild-forest': {
    name: 'WILD FOREST',
    faqs: [
      {
        question: 'Do akého interiéru sa WILD FOREST hodí?',
        answer:
          'K biofilnému dizajnu — dub, zeleň, textúrované textílie. Zemité tóny fungujú v novostavbách s veľkými oknami aj vo wellness zónach a kúpeľniach s voľne stojacou vaňou.',
      },
      {
        question: 'Je matný povrch WILD FOREST praktický v kuchyni?',
        answer:
          'Áno. Matný povrch s Microtech úpravou je príjemný na dotyk, nezvýrazňuje odtlačky a škvrny sa vďaka nasiakavosti pod 0,1 % nevpíjajú.',
      },
      {
        question: 'Funguje WILD FOREST aj v kúpeľni alebo saune?',
        answer:
          'Áno — odolnosť voči vlhkosti a plesniam robí z dekoru vhodnú voľbu na obklady, umývadlové dosky aj wellness priestory.',
      },
    ],
  },
  'nero-margiua': {
    name: 'NERO MARGIUA',
    faqs: [
      {
        question: 'Hodí sa čierny NERO MARGIUA aj do menšej kuchyne?',
        answer:
          'Áno, s rozvahou. Tmavý povrch pohlcuje svetlo, preto ho v menších priestoroch odporúčame kombinovať so svetlými skrinkami, alebo použiť len na ostrovček či zástenu ako akcent. V showroome si overíte, ako dekor reaguje na denné svetlo.',
      },
      {
        question: 'Vidno na čiernom matnom povrchu odtlačky a škvrny?',
        answer:
          'Matný povrch Diamondglass je k odtlačkom zhovievavejší než lesk a nasiakavosť pod 0,1 % znamená, že škvrny sa nevpíjajú. Na dennú údržbu stačí vlhká utierka s neutrálnym saponátom.',
      },
      {
        question: 'S čím NERO MARGIUA kombinovať?',
        answer:
          'So svetlým drevom, bielymi skrinkami a mosadznými alebo zlatými detailmi. Jemné strieborno-biele žilky prepoja čiernu dosku so svetlejším okolím, takže priestor nepôsobí ťažko.',
      },
    ],
  },
  'yabo-white': {
    name: 'YABO WHITE',
    faqs: [
      {
        question: 'Čím sa YABO WHITE líši od čisto bielych dekorov?',
        answer:
          'Teplý biely základ s krémovým podtónom pôsobí mäkšie než studená biela — univerzálny základ, ktorý funguje v kuchyni, chodbe aj kúpeľni.',
      },
      {
        question: 'Je YABO WHITE vhodný ako prvý sinterovaný kameň do bytu?',
        answer:
          'Áno. Je to cenovo najdostupnejší dekor v ponuke a jeho neutrálna kresba ladí s väčšinou interiérov — rozumný vstup do kategórie bez kompromisu vo vlastnostiach materiálu.',
      },
      {
        question: 'Ako sa povrch YABO WHITE čistí?',
        answer:
          'Vlhkou utierkou s bežným saponátom. Bez impregnácie a špeciálnych prípravkov — povrch Diamondglass je nenasiakavý a hygienický.',
      },
    ],
  },
};

export const PRODUCT_FAQS: Record<string, ProductFAQ[]> = Object.fromEntries(
  Object.entries(CUSTOM_PRODUCT_FAQS).map(([id, { name, faqs }]) => [
    id,
    [...faqs, priceFaq(id, name)],
  ]),
);

/**
 * All product handles that have SEO content (used by sitemap, llms.txt generation).
 */
export const SEO_PRODUCT_HANDLES = Object.keys(PRODUCT_SEO_CONTENT);
