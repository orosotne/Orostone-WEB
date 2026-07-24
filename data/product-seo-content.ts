import { INSTALLATION_RATE_PER_M2, SLAB_PRICES, formatEur } from './pricing';
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
    answer: 'Áno. Porcelánové veľkoformátové platne majú takmer nulovú nasiakavosť (porozita < 0,1 %), takže sú ideálne do kúpeľní, sprchových kútov aj wellness priestorov. Nevyžadujú impregnaciu a odolajú trvalému kontaktu s vodou.',
  },
  {
    question: 'Ako sa o platne starať?',
    answer: 'Údržba je minimálna – stačí teplá voda a jemný saponát. Materiál je nenasiakavý, nepotrebuje impregnaciu ani špeciálne vosky. Odolá bežným čistiacim prostriedkom vrátane kyselín.',
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
    answer: `Áno. Zabezpečíme kompletnú realizáciu — zameranie, dopravu, opracovanie hrán, leštenie a montáž — za ${INSTALLATION_RATE_PER_M2} €/m² s DPH. Výrobu a montáž realizujú partnerskí kamenári so skúsenosťou s veľkoformátovými platňami zo sinterovaného kameňa.`,
  },
];

/**
 * Centralized SEO content for all 12 large-format slab designs.
 * Keyed by product handle (Shopify handle or local `id`).
 * Used by shopify.service.ts, ShopProductDetail.tsx, and static SEO files.
 */
export const PRODUCT_SEO_CONTENT: Record<string, ProductSEOContent> = {
  'statuario-diamante': {
    metaTitle: 'STATUARIO DIAMANTE | Luxusné veľkoformátové platne',
    metaDescription: 'Biely mramor s diamantovými žilkami. Veľkoformátové platne pre luxusné interiéry v Bratislave. Skladom, doprava po celom SR. Vzorky zadarmo.',
    keywords: [
      'statuario diamante',
      'biely mramor obklad',
      'veľkoformátové platne bratislava',
      'luxusné obklady',
      'porcelánové platne',
    ],
    shortDescription:
      'Statuario Diamante – čistá biela elegancia s dramatickými strieborno-sivými žilkami typickými pre prémiový taliansky mramor. Táto veľkoformátová platňa prináša do vášho domova dokonalú sofistikovanosť. Ideálna pre luxusné kúpeľne, salóny alebo obývacie izby v Bratislave – všade tam, kde chcete vytvoriť priestor, ktorý zanechá nezabudnuteľný dojem.',
    longDescription:
      '<p>Inšpirovaný legendárnym talianskym mramorom Statuario, dizajn STATUARIO DIAMANTE uchváti každého na prvý pohľad. Žiarivá biela základňa s kontrastnými strieborno-sivými žilkami evokuje najexkluzívnejšie priestory – od milánských galérií po penthousy v bratislavskom Starom Meste.</p>' +
      '<p>Veľkoformátové platne eliminujú škáry a vytvárajú dojem neprerušenej luxusnej plochy, aká bola až donedávna dostupná iba v najdrahších projektoch. Porcelánová technológia zaručuje výnimočnú odolnosť proti poškriabaniu, vlhkosti a škvrnám.</p>' +
      '<p>Tento dizajn transformuje každý priestor – obývacia izba, kúpeľňa, kuchyňa alebo vstupná hala – v skutočné umelecké dielo. V Bratislave čoraz viac interiérových dizajnérov siaha po Statuario Diamante ako po prvej voľbe pre klientov, ktorí chcú skutočnú luxusnú nehnuteľnosť.</p>',
    keyBenefits: [
      'Žiarivá biela základňa s dramatickými strieborno-sivými žilkami',
      'Bezšvová optika vďaka veľkému formátu – žiadne rušivé škáry',
      'Výnimočná odolnosť voči vlhkosti, škvrnam a poškriabaniu',
      'Ľahká údržba – stačí vlhká utierka',
      'Vhodný na podlahy aj obklady stien',
    ],
  },

  'calacatta-top': {
    metaTitle: 'Calacatta Top | Prémiový mramorový obklad',
    metaDescription: 'Originálny Calacatta vzor pre vaše interiéry. Teplé zlaté žilky na bielom pozadí. Ideálny na kuchyne a kúpeľne. Skladom, objednajte vzorky zadarmo.',
    keywords: [
      'calacatta obklad',
      'calacatta mramor platne',
      'luxusné dlažby bratislava',
      'kuchynský obklad calacatta',
      'prémiové obklady',
    ],
    shortDescription:
      'Calacatta Top je synonymom absolútneho luxusu. Biela základňa ozdobená teplými zlatohnedými žilkami predstavuje vrchol talianskeho kameňárskeho umenia. Pre majiteľov nehnuteľností v Bratislave, ktorí nechcú robiť kompromisy – toto je voľba, ktorá zvýši hodnotu vašej nehnuteľnosti aj vášho každodenného zážitku z bývania.',
    longDescription:
      '<p>Calacatta mramor bol od pradávna symbolom moci a bohatstva – zdobil paláce rímskych cisárov a dnes zdobí najhonosnejšie rezidencie sveta. CALACATTA TOP prináša túto legendárnu estetiku do vášho domova bez kompromisov v kvalite.</p>' +
      '<p>Teplé zlatohnedé žilky na žiarivom bielom pozadí vytvárajú jedinečný vizuálny efekt, ktorý s rôznym osvetlením neustále mení svoju podobu – ranné slnko ho rozžiari inak ako večerné teplé svetlo.</p>' +
      '<p>Ideálny pre majiteľov novostavieb v bratislavských prémiových projektoch, ktorí chcú zvýšiť hodnotu svojej nehnuteľnosti. Porcelánová platňa odolá každodennému používaniu, pritom si zachováva krásu prírodného kameňa bez nutnosti impregnácie alebo špeciálnej starostlivosti. Skvele sa kombinuje s bronzovými prvkami, bielymi kuchyňami a prírodným drevom.</p>',
    keyBenefits: [
      'Calacatta vzor – jeden z najexkluzívnejších mramorových dizajnov na svete',
      'Teplé zlatohnedé žilky dodávajú priestoru hrejivosť a sofistikovanosť',
      'Preukázateľne zvyšuje trhovú hodnotu nehnuteľnosti',
      'Ľahká údržba bez nutnosti impregnácie',
      'Vhodný na kuchynské ostrovy, kúpeľňové steny aj podlahy',
    ],
  },

  'givenchy-gold': {
    metaTitle: 'Givenchy Gold | Zlatý mramor pre luxusné interiéry',
    metaDescription: 'Teplé zlaté mramorové platne Givenchy Gold. Luxusné obklady pre kúpeľne a obývacie izby v Bratislave. Skladom, doprava po celom Slovensku.',
    keywords: [
      'givenchy gold obklad',
      'zlaté mramorové platne',
      'luxusné interiéry bratislava',
      'zlatý dizajn podlahy',
      'prémiové platne',
    ],
    shortDescription:
      'Inšpirovaný svetom haute couture, GIVENCHY GOLD prináša do vašich priestorov výzvu zlatej éry luxusu. Teplé zlaté tóny s jemnými žilkami vytvárajú atmosféru exkluzívnych hotelov a penthousy. Pre tých, pre ktorých bývanie nie je len funkcia – je to prejav osobnosti.',
    longDescription:
      '<p>Keď francúzsky módny dom Givenchy definoval dokonalý vkus, tento dizajn to zachytil v kamennom materiáli. GIVENCHY GOLD s teplými zlatookrovými odtieňmi a delikátnymi žilkami prináša do každého priestoru luxus, ktorý je cítiť na prvý pohľad.</p>' +
      '<p>Ideálny pre tie bratislavské interiéry, kde chcete vytvoriť atmosféru päťhviezdičkového hotela. Zlaté tóny harmonujú s matným čiernym kovaním, luxusnými textíliami a akcentovým osvetlením.</p>' +
      '<p>Veľkoformátové platne eliminujú prerušenia, čím vytvárajú plynulú zlatú plochu, ktorá opticky zväčšuje priestor. Certifikovaná porcelánová technológia zaručuje odolnosť a dlhovekosť. Toto nie je len obklad – je to investícia do životného štýlu.</p>',
    keyBenefits: [
      'Teplé zlaté tóny pre okamžitú elegantnú atmosféru',
      'Bezšvový efekt veľkoformátových platní zväčšuje priestor',
      'Perfektná kombinácia s tmavými kovaním a prírodnými drevami',
      'Odolný voči kyselinám a škvrnám',
      'Exkluzívny dizajn inšpirovaný svetom haute couture',
    ],
  },

  'roman-travertine': {
    metaTitle: 'Roman Travertine | Klasický travertín pre domov',
    metaDescription: 'Teplý travertínový dizajn pre podlahy aj obklady. Roman Travertine – stredomorská elegancia bez kompromisov. Skladom, doprava po celom SR.',
    keywords: [
      'travertín obklad',
      'travertínové platne bratislava',
      'béžové dlažby',
      'stredomorský interiér',
      'rímsky travertín',
    ],
    shortDescription:
      'ROMAN TRAVERTINE evokuje nadčasovú krásu rímskej architektúry. Teplé béžové odtiene s charakteristickou travertínovou štruktúrou prinášajú do vášho domova stredomorskú elegáciu a nádych histórie. Keď vstúpite domov, máte pocit, že ste dorazili niekam špeciálnym.',
    longDescription:
      '<p>Travertín zdobil Kolosseum, rímske kúpele a tisíce palácov po celej Európe tisíce rokov. ROMAN TRAVERTINE zachytáva túto prírodnú dokonalosť v keramickej platni, ktorá prekoná prírodný materiál v praktičnosti.</p>' +
      '<p>Teplé krémové až béžové odtiene s jemným reliéfom vytvárajú hrejivú atmosféru vhodnú do moderných aj klasicky zariadených bratislavských domácností. Na rozdiel od pravého travertínu nevyžaduje impregnaciu, odolá vlhkosti a je ľahko udržiavateľný.</p>' +
      '<p>Perfektný výber pre podlahy v obývacích izbách, vstupných halách alebo vonkajších terasách. Bratislavskí architekti ho čoraz viac využívajú v projektoch víl a väčších bytov, kde chcú dosiahnuť autentický stredomorský feeling. Kombinácia s bielymi stenami, ľanovými textíliami a drevenými detailmi vytvára nadčasový interiér.</p>',
    keyBenefits: [
      'Autentická travertínová štruktúra s hĺbkou a charakterom',
      'Teplé béžové tóny pre hrejivú a pohostinnú atmosféru',
      'Vhodný do interiéru aj exteriéru (terasy, balkóny)',
      'Nevyžaduje impregnaciu na rozdiel od prírodného travertínu',
      'Stredomorský štýl vhodný do rôznych interiérových konceptov',
    ],
  },

  'taj-mahal': {
    metaTitle: 'TAJ MAHAL | Krémový mramor pre luxusné kúpeľne',
    metaDescription: 'Krémovo-biela elegancia Taj Mahal. Veľkoformátové mramorové platne pre kúpeľne a interiéry. Skladom, doprava po celom SR. Vzorky zadarmo.',
    keywords: [
      'taj mahal obklad',
      'krémový mramor',
      'spa kúpeľňa obklad',
      'mramorové platne',
      'krémové obklady bratislava',
    ],
    shortDescription:
      'Inšpirovaný jedným z divov sveta, TAJ MAHAL je ikonou čistoty a elegancie. Krémovo-biela základňa s jemnými zlatistými žilkami prináša pokojný luxus, ktorý nikdy nevyjde z módy. Pre kúpeľne, kde sa chcete každé ráno cítiť ako v luxusnom spa.',
    longDescription:
      '<p>Taj Mahal bol postavený z najjemnejšieho indického mramoru ako symbol večnej krásy. TAJ MAHAL – dizajn, ktorý nesie toto dedičstvo – prináša rovnaký pocit pokoja a luxusu do vášho domova.</p>' +
      '<p>Krémovo-biela paleta s delikátnymi zlatistými žilkami pôsobí upokojujúco a zároveň sofistikovane. Tento dizajn je perfektný pre kúpeľne, kde chcete vytvoriť spa atmosféru, alebo pre predsiene, kde má zaujať na prvý pohľad.</p>' +
      '<p>V Bratislave sa stal obľúbenou voľbou architektov pracujúcich na high-end rezidenciálnych projektoch – v kombinácii so zlatými batériami, drevenými príslušenstvami a mäkkým osvetlením vytvára priestor, do ktorého sa budete vracať s radosťou. Odolná porcelánová platňa vydrží desiatky rokov bez straty pôvodnej krásy.</p>',
    keyBenefits: [
      'Krémovo-biela farba pre upokojujúcu, harmonickú atmosféru',
      'Jemné zlatisté žilky dodávajú priestoru sofistikovanosť',
      'Ideálny pre kúpeľne so spa atmosférou',
      'Odolné porcelánové prevedenie na desiatky rokov',
      'Obľúbená voľba bratislavských architektov pre high-end projekty',
    ],
  },

  'appennino': {
    metaTitle: 'Appennino | Prírodný kameň pre moderné interiéry',
    metaDescription: 'Dynamický kamenný dizajn Appennino. Veľkoformátové platne pre akcentové steny aj podlahy. Skladom, objednajte online. Doprava po celom Slovensku.',
    keywords: [
      'appennino obklad',
      'prírodný kameň dizajn',
      'akcentová stena obklad',
      'veľkoformátové platne',
      'talianske kamenné platne',
    ],
    shortDescription:
      'APPENNINO prináša živú krásu talianskych hôr priamo do vášho interiéru. Dynamické žilkovanie a prirodzená farebnosť vytvárajú autentický kamenný vzhľad, ktorý okamžite pritiahne zrak a stane sa ústredným bodom každej miestnosti.',
    longDescription:
      '<p>Apeninský polostrov je domovom niektorých z najkrajších prírodných kameňov na svete. APPENNINO zachytáva tento divoký, ale sofistikovaný charakter – dynamické vzory, živé žilkovanie a prírodná farebnosť, ktorá každý kúsok robí vizuálne jedinečným.</p>' +
      '<p>Tento dizajn je ideálny pre tie interiéry, kde chcete vytvoriť výrazné vizuálne centrum miestnosti. Akcentová stena v obývacej izbe, celá kúpeľňa alebo exkluzívny kuchynský ostrov – všade tam APPENNINO zaujme a vyvolá obdiv hostí.</p>' +
      '<p>Veľkoformátové platne zdôrazňujú kontinuitu vzoru, ako keby ste mali priamo v izbe kus živej horniny. Výborná voľba pre bratislavské lofty, moderné byty s vysokými stropmi a priestory s industriálnymi prvkami.</p>',
    keyBenefits: [
      'Dynamický prírodný kamenný vzor s výrazným charakterom',
      'Vizuálne výrazný – ideálny pre akcentové steny',
      'Autentický vzhľad prírodného kameňa',
      'Skvelá kombinácia s industriálnymi a loftovými interiérmi',
      'Každý záber vzoru pôsobí ako originálne umelecké dielo',
    ],
  },

  'astrana-grey': {
    metaTitle: 'Astrana Grey | Moderné sivé mramorové platne',
    metaDescription: 'Sivé mramorové platne Astrana Grey pre moderné interiéry. Škandinávska elegancia pre podlahy a obklady. Skladom, doprava po celom SR.',
    keywords: [
      'sivé mramorové platne',
      'astrana grey',
      'moderné obklady bratislava',
      'šedý mramor',
      'sivé dlažby',
    ],
    shortDescription:
      'ASTRANA GREY je definíciou modernej elegancie. Jemné sivé odtiene s diskrétnymi žilkami vytvárajú súčasný, nadčasový priestor, ktorý sa hodí k akémukoľvek štýlu zariadenia. Pre tých, ktorí vedia, že menej je viac – a chcú to najlepšie z menej.',
    longDescription:
      '<p>Sivá farba je v súčasnom interiérovom dizajne kráľom palety – flexibilná, sofistikovaná a neomylne moderná. ASTRANA GREY prináša túto estetiku na najvyššiu úroveň.</p>' +
      '<p>Jemné gradovanie sivých odtieňov s diskrétnymi svetlejšími žilkami vytvára priestor, ktorý pôsobí upokojujúco a zároveň exkluzívne. Perfektný pre otvorené dispozície bratislavských novostavieb, kde jedna plocha prechádza cez obývačku, jedáleň aj kuchyňu.</p>' +
      '<p>Interiéroví dizajnéri ho radi kombinujú s bielym lacobel sklom, matným čiernym kovaním a prírodnou dubovou dyhou – kombinácia, ktorá definuje moderný škandinávsko-taliansky štýl. Ľahko udržiavateľný, odolný a vizuálne nepresýtený – ideálny pre rodiny s deťmi.</p>',
    keyBenefits: [
      'Neutrálna sivá základňa vhodná do každého interiérového štýlu',
      'Moderný škandinávsky/minimalistický vzhľad',
      'Ideálny pre otvorené dispozície – prechod z izby do izby',
      'Skvelá kombinácia s dubovým drevom a matným čiernym kovaním',
      'Dlhá životnosť a nenáročná údržba',
    ],
  },

  'super-white-extra': {
    metaTitle: 'Super White Extra | Biele veľkoformátové platne',
    metaDescription: 'Dokonale biele obklady Super White Extra. Zväčšite priestor svetlom. Prémiové porcelánové platne pre kúpeľne a kuchyne. Skladom, vzorky zadarmo.',
    keywords: [
      'biele mramorové platne',
      'super white obklad',
      'biele dlažby',
      'minimalistický interiér platne',
      'biele obklady bratislava',
    ],
    shortDescription:
      'SUPER WHITE EXTRA je ultimátna odpoveď na minimalizmus. Oslnivá bielota prináša do každého priestoru čistotu, svetlo a absolútnu modernosť. V bratislavských bytoch, kde každý meter štvorcový svitu počíta, je toto strategická voľba.',
    longDescription:
      '<p>Biela je viac než farba – je to filozofia. SUPER WHITE EXTRA prináša do každého priestoru nekonečné svetlo a čistotu, ktorá opticky zväčšuje miestnosť a vytvára pocit slobody.</p>' +
      '<p>V Bratislave, kde mnohé bytové dispozície nedostávajú dostatok prirodzeného svetla, je Super White Extra strategickým nástrojom interiérového dizajnéra. Maximálne biela základňa s minimálnym, takmer neviditeľným vzorovaním je ideálna na dlažby aj obklady – od predsiene po kúpeľňu.</p>' +
      '<p>Poskytuje skvelé plátno pre farebné akcentové prvky, umenie, rastliny alebo výrazný nábytok. Technologicky: porcelánová platňa s maximálnou odolnosťou voči znečisteniu a jednoduchým každodenným čistením.</p>',
    keyBenefits: [
      'Oslnivá biela pre maximálne prirodzené aj umelé svetlo',
      'Opticky zväčšuje každý priestor – ideálne pre menšie byty',
      'Perfektné plátno pre akékoľvek dekoračné prvky',
      'Maximálna odolnosť voči škvrnám a ľahké čistenie',
      'Vhodný pre celý byt – od predsiene po kúpeľňu',
    ],
  },

  'gothic-gold': {
    metaTitle: 'Gothic Gold | Tmavé luxusné obklady so zlatými žilkami',
    metaDescription: 'Dramatický Gothic Gold – tmavý mramor so zlatými žilkami. Luxusné platne pre odvážnych. Skladom, objednajte online. Doprava po celom Slovensku.',
    keywords: [
      'gothic gold obklad',
      'tmavé mramorové platne',
      'zlaté žilky obklad',
      'dark luxury interiér',
      'dramatické obklady',
    ],
    shortDescription:
      'GOTHIC GOLD je pre tých, ktorí sa neboja mať interiér s charakterom. Dramatická tmavá základňa s okázalými zlatými žilkami vytvára priestor, ktorý nikto nezabudne. Jeden pohľad a vaši hostia budú vedieť, že ste si nešetrili.',
    longDescription:
      '<p>Niektoré interiéry majú byť svetlom a vzduchom – ale iné majú byť príbehom. GOTHIC GOLD patrí do druhej kategórie. Hlboká tmavá základňa s ohnivými zlatými žilkami vytvára dramatickú krásu, akú nájdete v päťhviezdičkových hoteloch alebo súkromných bratislavských vilách.</p>' +
      '<p>Akcentová stena za postelkou, exkluzívna kúpeľňa alebo barový pult – kdekoľvek Gothic Gold umiestnite, stane sa nepopierateľným stredobodom priestoru.</p>' +
      '<p>Zlaté žilky reagujú na osvetlenie fascinujúcim spôsobom – sviečkové svetlo vytvára romantickú atmosféru, zatiaľ čo spotové svetlá zvýraznia dynamiku vzoru. Odvážna voľba pre odvážnych ľudí, ktorí chcú mať domov, nie len byt.</p>',
    keyBenefits: [
      'Dramatický kontrast tmavej základne a zlatých žiliek',
      'Stáva sa vizuálnym centrom každej izby',
      'Fascinujúca hra s rôznymi typmi osvetlenia',
      'Ideálny pre akcentové steny, luxury kúpeľne a barové pulty',
      'Premium look rezervovaný pre najexkluzívnejšie rezidencie',
    ],
  },

  'wild-forest': {
    metaTitle: 'Wild Forest | Prírodný kamenný dizajn pre domov',
    metaDescription: 'Divá krása prírody vo vašom interiéri. Wild Forest – expresívny kamenný vzor pre moderné domovy. Skladom, doprava po celom SR. Vzorky zadarmo.',
    keywords: [
      'prírodný kameň obklad',
      'wild forest platne',
      'organický dizajn interiér',
      'kamenné obklady bratislava',
      'wellness obklady',
    ],
    shortDescription:
      'WILD FOREST prináša silu a krásu divej prírody do vášho domova. Sivohnedé tóny s expresívnymi kamenistými vzormi evokujú horskú krajinu a prírodný charakter. Pre tých, ktorí milujú prírodu aj moderný dizajn – a nechcú si vyberať.',
    longDescription:
      '<p>V dobe, keď ľudia túžia po autentickosti a prírode, WILD FOREST ponúka dokonalý most medzi biofíliou a moderným dizajnom. Expresívne vzory v sivohnedých a teplých zemitých odtieňoch evokujú kamenné plochy v hlbokom lese – autentické, divoké a dokonale krásne.</p>' +
      '<p>Tento dizajn je mimoriadne populárny v bratislavských novostavbách s veľkými panoramatickými oknami a výhľadom do zelene, kde chcete, aby interiér a exteriér splývali do jedného celku.</p>' +
      '<p>Kombinuje sa skvele s dubovým drevom, zelenými rastlinami a textúrovanými tkaninami. Rovnako doma je vo wellness priestoroch, saunách alebo kúpeľniach s voľne stojacu vaňou.</p>',
    keyBenefits: [
      'Prírodný, organický kamenný vzor plný života a pohybu',
      'Zemité tóny pre biofíliálny dizajn blízky prírode',
      'Skvelý do wellness priestorov, saún a relaxačných kúpeľní',
      'Harmonická kombinácia s drevom a prírodnými materiálmi',
      'Spája interiér s vonkajšou prírodou – ideálny pre domy s výhľadom',
    ],
  },

  'nero-margiua': {
    metaTitle: 'Nero Margiua | Čierny mramor pre exkluzívne interiéry',
    metaDescription: 'Čierne mramorové platne Nero Margiua pre luxury interiéry. Sofistikovaná čierna so striebornými žilkami. Skladom, doprava po celom Slovensku.',
    keywords: [
      'čierny mramor obklad',
      'nero margiua',
      'čierne mramorové platne',
      'luxury čierna kúpeľňa',
      'tmavé obklady',
    ],
    shortDescription:
      'NERO MARGIUA je pre tých, ktorí chápu luxus inak. Hlboká čierna so subtilnými striebornobelými žilkami je absolútnou výpoveďou sofistikovaného vkusu. Keď vstúpite do priestoru s Nero Margiua, je jasné – toto je domov niekoho, kto vie, čo chce.',
    longDescription:
      '<p>Čierna farba v interiéri nikdy nevyšla z módy – práve naopak, stala sa synonymom dospelého, sebavedomého a nadčasového štýlu. NERO MARGIUA s hlbokou čiernou základňou a jemnými striebornobelými žilkami je výsledkom dlhoročnej skúsenosti v luxusnom dizajne.</p>' +
      '<p>V bratislavských penthousoch, vilách a prémiových kúpeľniach tento dizajn vytvára nezameniteľnú atmosféru exkluzivity.</p>' +
      '<p>Rovnako impresívny ako akcentová stena aj ako celoplošný obklad celej kúpeľne. Kontrastuje perfektne s bielymi sanitárnymi zariadeniami, zlatými batériami alebo drevenými prvkami. Pre tých, ktorí nechcú byť priemerní.</p>',
    keyBenefits: [
      'Hlboká čierna základňa pre absolútnu sofistikovanosť',
      'Striebristá žilkovanie vytvára dynamiku a hĺbku',
      'Ideálny pre luxury kúpeľne, šatníky a akcentové steny',
      'Nezameniteľná atmosféra exkluzivity a prestíže',
      'Dokonalý kontrast s bielymi prvkami a zlatými kovaniami',
    ],
  },

  'yabo-white': {
    metaTitle: 'YABO WHITE | Teplé biele obklady pre každý priestor',
    metaDescription: 'Nadčasovo biely Yabo White pre kúpeľne a kuchyne. Teplá, vzdušná biela vhodná pre celý byt. Skladom, doprava po celom SR. Objednajte online.',
    keywords: [
      'biele obklady bratislava',
      'yabo white',
      'teplé biele dlažby',
      'krémová biela kúpeľňa',
      'moderné biele platne',
    ],
    shortDescription:
      'YABO WHITE je čistota v jej najdokonalejšej forme. Jemná biela textúra s teplými krémovými odtieňmi prináša do každého priestoru sviežosť, pokoj a nadčasový šarm. Dizajn, ktorý nikdy nezastará – a vždy bude správny.',
    longDescription:
      '<p>YABO WHITE je odpoveďou na jednu z najčastejších otázok interiérového dizajnu: ako vytvoriť priestor, ktorý bude vždy aktuálny? Jemná biela s krémovými odtieňmi a subtílnymi textúrami prináša teplejší pocit ako studená čistá biela, ale zachováva všetku svielosť a vzdušnosť.</p>' +
      '<p>Ideálny pre bratislavské byty, kde chcete dlhodobo funkčný základ, na ktorom môžete meniť dekor, farby a textílie bez nutnosti meniť obklady.</p>' +
      '<p>Kúpeľňa, predsieň, kuchyňa – Yabo White funguje všade bez výnimky. Porcelánová technológia zaručuje maximálnu hygienu, odolnosť a ľahké čistenie. Investícia do obkladu raz a navždy – pretože dobrý vkus nestarne.</p>',
    keyBenefits: [
      'Teplá biela pre sviežu, vzdušnú a pritom hrejivú atmosféru',
      'Nadčasový dizajn – nikdy nevyjde z módy',
      'Flexibilný základ pre meniace sa dekorácie a trendy',
      'Maximálna hygiena a ľahká každodenná údržba',
      'Vhodný pre celý byt – predsieň, kuchyňa, kúpeľňa',
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
    answer: `Aktuálna cena je ${formatEur(p.pricePerM2)}/m² s DPH; platňa ${p.dimensions} (hrúbka ${p.thickness}) vychádza ≈ ${formatEur(
      calculateSlabPrice(p.pricePerM2, p.dimensions),
    )} s DPH. Kompletná realizácia — zameranie, doprava, opracovanie hrán, leštenie a montáž — sa počíta sadzbou ${INSTALLATION_RATE_PER_M2} €/m². Ceny všetkých dekorov nájdete na stránke /cennik.`,
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
          'Je to čistá biela s minimálnou kresbou — neutrálny základ, ktorý opticky zväčší menšie alebo tmavšie priestory a nechá vyniknúť zvyšok interiéru.',
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
