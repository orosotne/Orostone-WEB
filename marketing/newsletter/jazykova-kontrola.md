# Jazyková kontrola – denník

Sem sa zapisujú pripomienky k textom e-mailov a ich stav.

- Pri **`@codex review`** sú pripomienky priamo v pull requeste. Sem sa prenesie len súhrn kola a pravidlá, ktoré platia ďalej (tie idú aj do `slovnik.md`, sekcia 8).
- Pri úlohe v **aplikácii Codex** zapisuje Codex sporné miesta a návrhy sem, do nového kola.

**Stav:** `nové` → `prijaté` / `zamietnuté` (s dôvodom) → `zapracované`. Zapracúva Claude, sporné prípady rozhoduje Martin.
**Typ:** pravopis · gramatika · interpunkcia · typografia · spisovnosť · štylistika · význam · slovník · otázka.

---

## Kolo 0 – vlastná kontrola Claude (7. 10. 2026, e-maily 01–08)

Pred odovzdaním Codexu. Pravopis a gramatiku predtým kontroloval aj LanguageTool (sk-SK).

| # | E-mail | Pôvodný text | Nový text | Typ | Prečo | Stav |
|---|---|---|---|---|---|---|
| 1 | 06 | Krájajte na doske | Krájajte na doštičke | význam | „Doska“ je v e-mailoch pracovná doska. Veta radila presný opak. | zapracované |
| 2 | 01 | pri vašom svetle a vedľa vašich skriniek | pri svojom svetle a vedľa svojich skriniek | gramatika | Vlastník je podmetom vety, preto *svoj*. | zapracované |
| 3 | 05 | fotku oboch vzoriek vo vašej kuchyni | … vo svojej kuchyni | gramatika | Ako č. 2. | zapracované |
| 4 | 07 | Vzorku preto pozerajte pri vašom svetle | Vzorku si preto pozrite pri svojom svetle | gramatika | Ako č. 2. Dokonavé *pozrite si* je prirodzenejšie. | zapracované |
| 5 | 02 | Medzitým môžete pozrieť realizácie. | Medzitým si môžete pozrieť realizácie. | gramatika | Zvratné sloveso *pozrieť si*. | zapracované |
| 6 | 02 | porovnávanie ceny za meter bez toho, čo v nej je a čo nie | … bez ohľadu na to, čo cena zahŕňa a čo nie | štylistika | Pôvodná väzba bola nejasná. Pozor: list ešte prepíše Marián. | zapracované |
| 7 | 08 | Posielame fotky z prvého dňa a čo bude nasledovať. | Posielame fotky z prvého dňa a prehľad toho, čo bude nasledovať. | štylistika | Sloveso *posielame* sa nehodí k vedľajšej vete „čo bude nasledovať“. | zapracované |
| 8 | 08 | Fotky nižšie sme urobili … takto vaša kuchyňa vyzerala v prvý deň. | Fotky sme urobili … takto vyzerala vaša kuchyňa v prvý deň. | štylistika | „Fotky nižšie“ je kalk z angličtiny. Prirodzenejší slovosled. | zapracované |
| 9 | 01, 08 | jedným klikom · Stačí jeden klik. | jedným kliknutím · Stačí jedno kliknutie. | spisovnosť | *Kliknutie* je neutrálne, *klik* pôsobí hovorovo. | zapracované |
| 10 | 05 | Skôr než skončí v šuplíku | Skôr než ju niekam odložíte | spisovnosť | *Šuplík* je hovorové. *Zásuvka* by sa zas plietla s elektrickou. | zapracované |
| 11 | 04 | ROMAN TRAVERTINE je dekor… | Roman Travertine je dekor… | typografia | V texte sa názov dekoru píše s veľkými začiatočnými písmenami. | zapracované |
| 12 | všetky | dlhá pomlčka — | krátka pomlčka – s medzerami | typografia | Slovenská typografia. Dlhá pomlčka je anglická. | zapracované |
| 13 | 06 | Typ: Po realizácii 2/3 | Typ: Po realizácii 3/4 | otázka | Zosúladené s programom: 08 → starostlivosť → 06 → po 6 mesiacoch. | zapracované |

## Kolo 1 – Codex review v PR #74 (7. 10. 2026)

Codex našiel 9 chýb (všetky P1). Všetky sú prijaté. Pri troch Claude použil iné znenie, než Codex navrhol, a dôvod je pri nich uvedený.

| # | E-mail | Pôvodný text | Nový text | Typ | Prečo | Stav |
|---|---|---|---|---|---|---|
| 1 | 01 | zadanie, zvolený dekor a ako výsledok vyzerá vo veľkej ploche | zadanie, zvolený dekor a výsledok vo veľkej ploche | štylistika | Výpočet miešal menné spojenia s vedľajšou vetou. Kratšie než návrh „ukážka toho, ako…“. | zapracované s úpravou |
| 1b | 01 | kombinácie so skrinkami a kde funguje najlepšie | … a miesta, kde funguje najlepšie | štylistika | Rovnaká chyba o riadok nižšie, doplnil Claude. | zapracované |
| 2 | 02 | aby výsledok dával zmysel vo vzhľade, používaní aj cene | aby výsledok dobre vyzeral, bol praktický v každodennom používaní a mal rozumnú cenu | štylistika | „Dávať zmysel vo…“ je neprirodzené. Návrh „z hľadiska vzhľadu…“ je úradný, preto slovesá. Rovnaká veta je aj v manuáli copy-orostone. | zapracované s úpravou |
| 3 | 02 | Pripravíme vám ich platne. | Pripravíme vám platne s týmito dekormi. | štylistika | Zámeno „ich“ sa nejasne vzťahovalo na dekory. | zapracované |
| 4 | 03 | v ktorej celý priestor nesie jeden prvok | v ktorej celému priestoru dominuje jeden prvok | štylistika | Pri voľnom slovoslede sa dalo čítať, že priestor nesie prvok. | zapracované |
| 5 | 04 | textúru a materiálový pocit bez prehnane efektného dojmu | textúru a dojem prírodného materiálu bez prehnaného efektu | spisovnosť | „Materiálový pocit“ je kalk. Rovnaké spojenie je aj v manuáli copy-orostone (decors.md). | zapracované |
| 6 | 04 | Kresbu travertínu na veľkej ploche najlepšie posúdite podľa pôdorysu. | Rozloženie kresby travertínu na veľkej ploche najlepšie naplánujete podľa pôdorysu. | význam | Pôdorys slúži na plánovanie rozloženia, nie na posúdenie vzhľadu. | zapracované |
| 7 | 05 | Kvapnite na vzorku a nechajte hodinu pôsobiť. Potom utrite… | Pár kvapiek dajte na vzorku a nechajte ich hodinu pôsobiť. Potom vzorku utrite… | gramatika | Chýbal predmet. Nová veta neopakuje nadpis „Červené víno alebo káva“. Predmet chýbal aj pri „utrite“. | zapracované s úpravou |
| 8 | 06 | ako ste spokojní | ako ste s doskou spokojní | gramatika | „Spokojný“ sa viaže s predložkou „s“. | zapracované |
| 9 | 07 | ktoré pred výberom dekoru prejdeme s každým klientom | ktoré si pred výberom dekoru prejdeme s každým klientom | gramatika | Väzba „prejsť si niečo s niekým“. | zapracované |

## Kolo 2 – Codex review v PR #77 (7. 10. 2026, e-maily 09–21)

Codex našiel 14 chýb (všetky P1). Všetky sú prijaté. Pri piatich Claude použil iné znenie, než Codex navrhol, a dôvod je pri nich uvedený.

| # | E-mail | Pôvodný text | Nový text | Typ | Prečo | Stav |
|---|---|---|---|---|---|---|
| 1 | 09 | Pokojná plocha, tmavý kontrast a výrazná kresba. Čo rozhodlo pri každej z nich. | Pri jednej rozhodla pokojná plocha, pri druhej tmavý kontrast a pri tretej výrazná kresba. | štylistika | Preheader má byť celá veta (slovník, sekcia 6). Kratšie než návrh Codexu (106 znakov). | zapracované s úpravou |
| 2 | 09 | Zlaté žily … nesú celú kuchyňu. | Zlaté žily … sú hlavným prvkom celej kuchyne. | štylistika | Metafora „niesť kuchyňu“ je neprirodzená. Nové znenie nadväzuje na citát „Každá kuchyňa má jeden hlavný prvok“. | zapracované |
| 3 | 09 | Ktorá z troch kuchýň je vám najbližšie? | Ktorá z troch kuchýň je vám najbližšia? | gramatika | Prísudkové prídavné meno sa zhoduje s podmetom „ktorá“. | zapracované |
| 4 | 09 | dekory, ktoré k nej fungujú najlepšie | dekory, ktoré sa k nej hodia najlepšie | spisovnosť | „Fungovať k niečomu“ je kalk. | zapracované |
| 5 | 12 | Čo je v cene, čo porovnávať a na čo sa pýtať… | Vysvetlíme, čo je v cene, čo porovnávať a na čo sa pýtať… | štylistika | Preheader ako celá veta. | zapracované |
| 6 | 12 | Prečítať celý sprievodca | Prečítať celého sprievodcu | gramatika | Akuzatív, *sprievodca* sa skloňuje podľa vzoru hrdina. Tlačidlo je širšie, aby sa text v Outlooku nezalomil. | zapracované |
| 7 | 16 | Pošlite mi odpoveďou fotku kuchyne… | V odpovedi mi pošlite fotku kuchyne… | štylistika | Ustálená väzba je „v odpovedi“. | zapracované |
| 7b | 01 | pošlite ho odpoveďou na tento e-mail | pošlite nám ho v odpovedi na tento e-mail | štylistika | Rovnaká chyba, doplnil Claude. | zapracované |
| 8 | 17 | Jediná bežná chémia, ktorá povrch poškodí. Býva v niektorých odstraňovačoch hrdze… | Sú to jediné bežne dostupné prostriedky, ktoré povrch poškodia. Patria k nim niektoré odstraňovače hrdze… | spisovnosť | „Chémia“ je odbor, nie látka, a vete chýbal prísudok. Návrh „bežne používaná chemikália“ by vecne nesedel: kyselina fluorovodíková sa bežne nepoužíva, len býva v niektorých prípravkoch. „Bežne dostupné“ zodpovedá článku na webe. | zapracované s úpravou |
| 9 | 18 | Minerály, tlak do 25 000 ton a teplota nad 1 200 °C. Prečo potom doska nepotrebuje impregnáciu. | Minerály sa lisujú a potom spekajú pri teplote nad 1 200 °C. Preto doska nepotrebuje impregnáciu. | štylistika | Preheader ako celá veta. Návrh Codexu mal vyše 110 znakov. | zapracované s úpravou |
| 10 | 18 | prírodnému kameňu trvá vznik milióny rokov | prírodný kameň sa tvorí milióny rokov | štylistika | Neprirodzená datívna väzba. Návrh „vznik prírodného kameňa trvá“ by opakoval *vznik – vzniká* v nasledujúcej vete. | zapracované s úpravou |
| 11 | 19 | Materiál, opracovanie, doprava a montáž. A prečo dve ponuky … nemusia byť porovnateľné. | Cenu tvorí materiál, opracovanie, doprava a montáž. Ukážeme, ako porovnať dve ponuky. | štylistika | Preheader ako celá veta. Návrh Codexu opakoval predmet („cena pracovnej dosky“), čo sekcia 6 nepovoľuje. | zapracované s úpravou |
| 12 | 19 | Rozdiel medzi spodnou a hornou hranicou robia tieto tri položky. | O tom, či bude cena pri spodnej alebo hornej hranici, rozhodujú tieto tri položky. | spisovnosť | „Robiť rozdiel“ je kalk. | zapracované |
| 13 | 19 | Prečítať celý sprievodca | Prečítať celého sprievodcu | gramatika | Ako č. 6. | zapracované |
| 14 | 21 | objednať vzorky, poslať pôdorys a mať dekor vybraný v pokoji | objednať si vzorky, poslať pôdorys a v pokoji si vybrať dekor | štylistika | Jednotná stavba výpočtu a zvratné *si*. | zapracované |

### Doplnil Claude: preheader ako celá veta vo všetkých e-mailoch

Pripomienky 1, 5, 9 a 11 vychádzajú zo sekcie 6 slovníka. Rovnaké pravidlo Claude uplatnil aj na ostatné preheadery, aby ho Codex nemusel hlásiť po jednom.

| E-mail | Pôvodný preheader | Nový preheader |
|---|---|---|
| 01 | Dvakrát do mesiaca jedna vec, ktorá pomôže pri výbere pracovnej dosky. Bez výpredajov. | Dvakrát do mesiaca vám pošleme jednu vec, ktorá pomôže pri výbere pracovnej dosky. Výpredaje neposielame. |
| 02 | Prečo pri pracovnej doske nestačí malá vzorka a cena za meter – a čo s tým robíme. | Vysvetlím, prečo pri pracovnej doske nestačí malá vzorka a cena za meter – a čo s tým robíme. |
| 03 | Realizácia mesiaca: prečo krémový dekor a ako pôsobí vo veľkej ploche. | V realizácii mesiaca ukážeme, prečo padla voľba na krémový dekor a ako pôsobí vo veľkej ploche. |
| 04 | Ako dekor vyzerá na celej platni, s čím ho kombinovať a na čo myslieť pri smere kresby. | Ukážeme, ako dekor vyzerá na celej platni, s čím ho kombinovať a na čo myslieť pri smere kresby. |
| 05 | Víno, citrón, hrnček horúcej vody a vaše svetlo. Desať minút, ktoré povedia viac než katalóg. | Stačí víno, citrón, hrnček horúcej vody a vaše svetlo. Za desať minút zistíte viac než z katalógu. |
| 06 | Dve minúty, ktoré pomôžu ďalším pri výbere. A prosba o jednu fotku. | Hodnotenie vám zaberie dve minúty a pomôže ďalším pri výbere. Budeme radi aj za jednu fotku. |
| 07 | Svetlo, skrinky a veľkosť plochy. A jedna otázka pre nás. | Týkajú sa svetla, skriniek a veľkosti plochy. Na konci sa vás opýtame, kedy plánujete novú kuchyňu. |
| 10 | Celá platňa, realizácie a showroom. Tri spôsoby, ako vidieť kresbu v mierke kuchyne. | Kresbu v mierke kuchyne uvidíte na fotke celej platne, v realizáciách alebo v showroome. |
| 13 | Realizácia s podobným riešením a pozvanie do showroomu v Bošanoch, kde vám pripravíme celé platne. | Ukážeme realizáciu s podobným riešením. V showroome v Bošanoch vám pripravíme celé platne. |
| 14 | Žiadny tlak, len otázka. | Nechcem na vás tlačiť, len sa pýtam. |
| 17 | Utierka, saponát a štyri veci, ktorým sa vyhnúť. Viac vaša doska nepotrebuje. | Doske stačí utierka a saponát. Pozor si dajte len na štyri veci. |
| 20 | Realizácia mesiaca: ostrovček, kde kontrast drží celý priestor pokope. | V realizácii mesiaca ukážeme ostrovček, kde kontrast drží celý priestor pokope. |
| 21 | Otváracie hodiny cez sviatky a jedna rada, ak plánujete kuchyňu na jar. | Posielame otváracie hodiny cez sviatky a jednu radu, ak plánujete kuchyňu na jar. |

## Kolo 3 – Codex review v PR #77 (7. 10. 2026, po opravách kola 2)

Codex skontroloval opravy z kola 2 a všetky preheadery bez pripomienok. Našiel 4 nové chyby (P1), všetky sú prijaté.

| # | E-mail | Pôvodný text | Nový text | Typ | Prečo | Stav |
|---|---|---|---|---|---|---|
| 1 | 12 | či sú všetky ceny s DPH, alebo bez nej | či sú všetky ceny s DPH alebo bez nej | interpunkcia | *Alebo* tu spája dva vetné členy, nie vety. | zapracované |
| 2 | 17 | Celý návod na čistenie (tlačidlo) | Prečítať celý návod | slovník | Tlačidlo je neurčitok (sekcia 5). Kratšie než návrh „Prečítať celý návod na čistenie“, aby sa tlačidlo na mobile nezalomilo. Že ide o čistenie, hovorí poznámka pod tlačidlom. | zapracované s úpravou |
| 3 | 18 | Sinterovaný kameň vzniká podobne, z minerálov, tlaku a teploty. | Sinterovaný kameň vzniká podobne – pôsobením tlaku a teploty na minerály. | význam | Tlak a teplota nie sú suroviny. Namiesto „podobným procesom“ je „podobne“, aby sa slovo *proces* neopakovalo v nasledujúcej vete. | zapracované s úpravou |
| 4 | 18 | Viac o sinterovanom kameni (odkaz) | Prečítať viac o sinterovanom kameni | slovník | Aj textový odkaz pod tlačidlom je neurčitok (sekcia 5). | zapracované |

## Kolo 4 – Codex review v PR #77 (7. 10. 2026, po opravách kola 3)

Codex našiel 2 chyby (P1), obe sú prijaté. Iné výskyty rovnakých chýb v e-mailoch nie sú.

| # | E-mail | Pôvodný text | Nový text | Typ | Prečo | Stav |
|---|---|---|---|---|---|---|
| 1 | 12 | Prejdeme ju spolu položku po položke. | Prejdeme si ju spolu položku po položke. | gramatika | Väzba *prejsť si niečo* (slovník, sekcia 8). | zapracované |
| 2 | 20 | kde sa stretáva biela doska … a tmavé orechové drevo | kde sa stretávajú biela doska … a tmavé orechové drevo | gramatika | Dva podmety spojené spojkou *a* → prísudok v množnom čísle. | zapracované |

## Kolo 5 – Codex review v PR #77 (7. 10. 2026, po opravách kola 4)

Codex našiel 11 pripomienok (P1, jedna dvakrát). Šesť je prijatých, štyri zamietnuté s dôvodom. Zamietnuté vznikli z pravidla o zhode, ktoré Claude v kole 4 zapísal do slovníka príliš prísne. Pravidlo je teraz presnejšie (sekcia 8).

| # | E-mail | Pôvodný text | Nový text | Typ | Prečo | Stav |
|---|---|---|---|---|---|---|
| 1 | 05 | Stačí víno, citrón, hrnček horúcej vody a vaše svetlo. | bez zmeny | gramatika | Prísudok stojí pred viacnásobným podmetom. Zhoda s najbližším členom je správna a znie prirodzenejšie než „Stačia víno…“. | zamietnuté |
| 2 | 09 | Poslať pôdorys a získať orientačnú cenu (tlačidlo) | Získať orientačnú cenu | slovník | Tlačidlo do ~25 znakov (sekcia 5). Rovnako Claude skrátil tlačidlá v 10 (Pozrieť celú platňu) a 13 (Dohodnúť návštevu). | zapracované |
| 3 | 16 | ktoré má zmysel objednať ako vzorky | ktoré má zmysel objednať si ako vzorky | gramatika | Zvratné *si* (sekcia 2). Rovnaká veta je aj v 07. | zapracované |
| 4 | 17 | Doske stačí utierka a saponát. · Stačí bežný prostriedok na riad a mäkká utierka z mikrovlákna. | bez zmeny | gramatika | Ako č. 1 (dve pripomienky). | zamietnuté |
| 5 | 18 | 100 % minerály | 100 % minerálov | gramatika | Po percentách nasleduje genitív. Codex to nahlásil dvakrát. | zapracované |
| 6 | 19 | Cenu tvorí materiál, opracovanie, doprava a montáž. | bez zmeny | gramatika | Ako č. 1. | zamietnuté |
| 7 | 20 | presne pre váš rozmer | presne pre vašu kuchyňu | význam | Pôdorys má viac rozmerov. Návrh „podľa vašich rozmerov“ by opakoval „s rozmermi“ z tej istej vety. Rovnaká veta je aj v 03. | zapracované s úpravou |
| 8 | 21 | Každá otázka a každá fotka hotovej kuchyne nám pomáha… | bez zmeny | gramatika | Pri *každý … a každý* je prísudok v jednotnom čísle. | zamietnuté |
| 9 | 12 | Rezanie, výrezy pre drez, varnú dosku a batériu a profil hrany. | Rezanie, profil hrany a výrezy pre drez, varnú dosku a batériu. | štylistika | Dve spojky *a* znejasňovali výpočet. Rovnako je upravený zoznam v 19. | zapracované |

### Nový obsah (7. 10. 2026, Martin)

Popri kole 5 pribudol obsah, ktorý skontroluje ďalšie kolo:

- **01** – uvítacia odmena je vzorka bez poštovného (kód VITAJTE) namiesto 5 % (WELCOME5).
- **02** – list je v prvej osobe (Marián), s telefónom.
- **03, 20** – fakty z fotiek a zo stránky Realizácie namiesto zátvoriek [ ]; blok „Slovami klienta“ nahradila „Hlavná myšlienka“.
- **06** – tlačidlo vedie priamo na napísanie recenzie na Google.
- **21** – otváracie hodiny podľa stránky Kontakt a lehota odoslania vzoriek podľa webu.

## Kolo 6 – Codex review v PR #82 (7. 10. 2026, po opravách kola 5)

Codex skontroloval opravy z kola 5 aj nový obsah (01, 02, 03, 06, 20, 21) a nenašiel žiadne pripomienky (commit `c9a27df`). Jazyková kontrola e-mailov 01–21 je tým hotová. Čo ešte treba urobiť pred odoslaním, je v README v stĺpci Stav.

## Kolo 7 – Codex review v PR #82 (7. 10. 2026, po označení PR ako pripraveného)

Codex pri poslednej kontrole (commit `7d36a0b`) našiel jednu pripomienku. PR bol medzitým zlúčený, oprava je preto v novom PR.

| # | E-mail | Pôvodný text | Nový text | Typ | Prečo | Stav |
|---|---|---|---|---|---|---|
| 1 | 21 | Cez víkend a sviatky po dohode na +421 917 588 738. | Cez víkend a sviatky po dohode na čísle +421 917 588 738. | štylistika | Bez slova *čísle* sa predložka *na* neprirodzene viaže priamo s telefónnym číslom. Pri slovese *volať* je väzba prirodzená, preto „zavolajte na +421…“ v 02 ostáva. | zapracované |

## Kolo 8 – Codex review v PR #84 (7. 10. 2026, po oprave z kola 7)

| # | E-mail | Pôvodný text | Nový text | Typ | Prečo | Stav |
|---|---|---|---|---|---|---|
| 1 | 21 | Cez víkend a sviatky po dohode na čísle +421 917 588 738. | Cez víkend a sviatky po dohode na telefónnom čísle +421 917 588 738. | štylistika | Spojenie *na čísle* pôsobí v informačnom texte elipticky, *na telefónnom čísle* jednoznačne pomenúva spôsob kontaktu. Pravidlo v `slovnik.md`, sekcia 8, je spresnené. | zapracované |

### Nový obsah (7. 10. 2026, výber fotiek)

S novými fotkami sa zmenil aj text, ktorý skontroluje ďalšie kolo:

- **09** – štítky kariet nesú názvy dekorov (Yabo White, Nero Margiua, Arden Gold); karta 2 má nový text a popis fotky čiernej dosky.
- **13** – nový preheader, popis fotky kaštieľa, štítok „Showroom v Bošanoch“ a odkaz „Pozrieť realizácie“.
- **18** – nové popisy fotiek surovín a pece.
- **21** – nový popis fotky (vianočné pečenie).

## Kolo 9 – Codex review v PR #88 (7. 10. 2026, výber fotiek)

| # | E-mail | Pôvodný text | Nový text | Typ | Prečo | Stav |
|---|---|---|---|---|---|---|
| 1 | 21 | [alt] Vianočné pečenie na ostrovčeku zo sinterovaného kameňa, v pozadí vianočný stromček | [alt] Vianočné pečenie na ostrovčeku zo sinterovaného kameňa so stromčekom v pozadí | štylistika | Slovo *vianočný* sa opakovalo tesne po sebe a dodatok za čiarkou bol ťažkopádny. | zapracované |

## Kolo 10 – Codex review v PR #88 (7. 10. 2026, po oprave z kola 9)

Codex na `d7465f0` nenašiel žiadne pripomienky. Texty k novým fotkám v 09, 13, 18 a 21 sú skontrolované.

### Na kontrolu: celý e-mail 02 (7. 10. 2026, Martin)

Marián list 02 schválil. Martin chce ešte samostatnú jazykovú kontrolu celého textu `texty/02-welcome-list-od-mariana.md` vrátane riadkov, ktoré sa v tomto PR nemenia. Codex ho naposledy kontroloval v kole 6 bez pripomienok.

Ďalšie kolo pridajte ako novú sekciu s rovnakou tabuľkou.
