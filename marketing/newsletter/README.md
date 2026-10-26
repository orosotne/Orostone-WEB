# Newsletter Orostone – spoločný priečinok pre Claude a Codex

Texty a HTML šablóny e-mailov Orostone. Priečinok zdieľajú dvaja AI pomocníci a každý má svoju úlohu:

| Kto | Čo robí |
|---|---|
| **Claude** (Claude Code) | píše e-maily a šablóny, zapracúva pripomienky do textov, šablón aj skillov |
| **Codex** (ChatGPT) | jazyková kontrola: spisovná slovenčina, gramatika, štylistika, slovník značky |
| **Martin** | rozhoduje sporné prípady a schvaľuje (merge). Marián dopĺňa fakty a svoj list (02). |

Na webový e-shop priečinok nemá vplyv. Build ho nespracúva.

## Postup

1. **Claude napíše** – nový alebo upravený e-mail pridá do `texty/` a `sablony/` a otvorí pull request.
2. **Codex skontroluje** – do pull requestu napíšte komentár `@codex review`. Codex prejde zmenené texty podľa `AGENTS.md` a pripomienky pripíše k riadkom.
3. **Claude zapracuje** – opraví texty, šablóny aj skilly a na každú pripomienku odpovie: prijaté, alebo zamietnuté a prečo.
4. **Martin schváli** – pozrie výsledok a pull request zlúči.

### Ak chcete kontrolu bez pull requestu

V aplikácii Codex (chatgpt.com/codex) vyberte repozitár `orosotne/Orostone-WEB` a vetvu s textami. Potom zadajte:

> Urob jazykovú kontrolu e-mailov v `marketing/newsletter/` podľa `marketing/newsletter/AGENTS.md`. Jednoznačné chyby oprav v `texty/`, sporné miesta zapíš do `jazykova-kontrola.md` a otvor pull request.

Claude potom opravy prenesie do šablón.

## Čo je kde

| Cesta | Obsah |
|---|---|
| `texty/` | text každého e-mailu: predmet, preheader a bloky v poradí, ako sa zobrazia. **Tu prebieha kontrola.** |
| `sablony/` | hotové HTML šablóny (600 px, inline štýly) na nahratie do rozosielacieho nástroja |
| `slovnik.md` | jazykové pravidlá a slovník značky. Platí pre Claude aj Codex a dopĺňa sa. |
| `jazykova-kontrola.md` | denník pripomienok a ich stav |
| `AGENTS.md` | pokyny pre Codex vrátane pravidiel pre jeho code review |
| `nastroje/` | `build_emails.py` generuje šablóny, `extract_copy.py` z nich vytiahne texty |

`sablony/` a `texty/` sa generujú. Ručne sa neupravujú, inak by sa pri ďalšom generovaní zmeny stratili:

```bash
python3 marketing/newsletter/nastroje/build_emails.py   # sablony/
python3 marketing/newsletter/nastroje/extract_copy.py   # texty/
python3 marketing/newsletter/nastroje/check_images.py   # obrázky len z orostone.sk a v public/images/
```

Obrázky v e-mailoch sú len z `orostone.sk` a ich súbory sú v repozitári (`public/images/email/`), aj fotky dekorov z e-shopu (`dekor-<názov>-<šírka>.jpg`, do 150 kB). Cudzí hosting ako GitHub alebo CDN e-shopu zhoršuje doručiteľnosť a obrázok sa môže stratiť. Šablóny sú pripravené pre Klaviyo: odhlásenie `{% unsubscribe_link %}`, voľby horizontu `{% update_property_link %}`.

## E-maily

Stav: **skontrolované** = prešlo kontrolou Claude aj Codexom · **na kontrole** = text sa zmenil a čaká na Codex. Za čiarkou je, čo ešte treba urobiť pred odoslaním.

| # | E-mail | Kam patrí | Predmet | Stav |
|---|---|---|---|---|
| 01 | Vitajte | Welcome 1/4 – hneď po prihlásení | Vitajte v Orostone. Posielame vaše dva uvítacie kódy | skontrolované (Codex, PR #163), naživo od 16. 10. 2026 07:01 UTC (správa VLzuhC vo flowe SNJKTh, šablóna UJFWQt) s novým predmetom aj novým textom v poli Preview text; kódy VITAJTE a WELCOME5 v Shopify existujú. Pop-up B s WELCOME5 a sľub kódov na webe sú v PR #165, záložný e-mail cez Resend (`send-newsletter-welcome`) má oba kódy od 16. 10. 2026. Šablónu, ktorú správa vo flowe používa, Klaviyo cez API prepísať nedovolí: pri zmene nahrať novú šablónu a priradiť ju správe VLzuhC. Klaviyo z nej spraví vlastnú kópiu s novým ID, ktoré treba zapísať sem aj do `automatizacie-plan.md` |
| 02 | List od Mariána | Welcome 2/4 – o 2 dni | Dve chyby, ktoré vidím pri výbere dosky | skontrolované, Marián list schválil |
| 07 | Ako vybrať dekor | Welcome 3/4 – o 5 dní | Tri otázky pred výberom dekoru | skontrolované |
| 09 | Tri kuchyne | Welcome 4/4 – o 9 dní | Tri kuchyne, tri rôzne rozhodnutia | skontrolované |
| 05 | Vzorka je doma | Vzorky 2/4 – 4 dni po odoslaní, o 9:00 | Vzorka je doma. Skúste s ňou 4 veci | skontrolované, naživo od 14. 10. 2026 (flow Tp45w8) |
| 10 | Veľká plocha | Vzorky 3/4 – o 5 dní, o 9:00 | Ako váš dekor vyzerá vo veľkej ploche | skontrolované, dekor, fotka platne a odkaz podľa prvej vzorky z objednávky, naživo od 14. 10. 2026 (flow Tp45w8) |
| 11 | Marián (čistý text) | Vzorky 4/4 – o 7 dní, o 9:00 | Pomôžem vám s výberom? | skontrolované, naživo od 14. 10. 2026 (flow Tp45w8), ide všetkým bez podmienky „neposlal dopyt“ (Martin, 14. 10.) |
| 12 | Ako čítať ponuku | Dopyt → ponuka 2/4 – deň po ponuke | Ako čítať cenovú ponuku | skontrolované |
| 13 | Showroom | Dopyt → ponuka 3/4 – 5 dní po ponuke | Pozrite si platne naživo | skontrolované |
| 14 | Marián (čistý text) | Dopyt → ponuka 4/4 – 14 dní po ponuke | Je niečo, čo vám bráni rozhodnúť sa? | skontrolované |
| 15 | Košík | Opustený košík 1/2 – o hodinu | Vaša vzorka zostala v košíku | skontrolované, tlačidlo vedie na rozpracovanú objednávku, preheader bez vety o doprave; nespustené, e-mail o opustenej pokladni posiela Shopify všetkým zákazníkom, aj bez súhlasu (Martin, 14. 10.; zásady PR #144), pozri plán A4 |
| 16 | Marián (čistý text) | Opustený košík 2/2 – o deň | Váhate medzi dekormi? | skontrolované, odkaz „tu“ vedie na rozpracovanú objednávku; nespustené (pozri 15) |
| 36 | Dekor čaká v košíku, so zľavou | Košík z webu – na druhý deň o 9:00 po vložení dekoru do košíka na orostone.sk, bez pokladne, objednávky a vyprázdnenia košíka | Zľava 5 % na dekor vo vašom košíku | skontrolované (Codex, PR #148), naživo od 15. 10. 2026 11:49 UTC (flow WV6K3N); zľava v predmete, hlavičke, tmavom páse aj na banneri `kosik-zlava-5-<dekor>.jpg` (12 dekorov, kuchyňa z detailu produktu); dekor, fotky, položky a tlačidlá dynamické z udalosti Added to Cart z webu; kód KOSIK5 (Shopify, 5 % z celej objednávky, raz na zákazníka) sa v pokladni doplní z odkazu a platí len pri objednávke na orostone.sk; len odberatelia so súhlasom, ktorých web rozpoznal po príchode z e-mailu (plán A4b) |
| 37 | Prezeraný dekor, vzorka zadarmo | Prezeraný dekor – na druhý deň o 9:00 po prezretí dekoru na orostone.sk, ak ho človek nevložil do košíka, nezačal pokladňu a neobjednal; najviac raz za 30 dní | Vzorka dekoru {{ event.ProductName }} zadarmo | na kontrole; bez zľavy, ponukou je prvá vzorka zadarmo; banner `vzorka-zadarmo-<dekor>.jpg` (12 dekorov); dekor, fotky a odkazy dynamické z udalosti Viewed Product z webu; len odberatelia so súhlasom, ktorých web rozpoznal po príchode z e-mailu (plán A9) |
| 08 | Hotovo | Po realizácii 1/3 – deň montáže | Hotovo: fotky z vašej montáže | na kontrole: nové P. S. s osobným kódom programu Odporučte Orostone (26. 10. 2026) |
| 17 | Starostlivosť | Po realizácii 2/3 – 7 dní po montáži | Starostlivosť o dosku v skratke | skontrolované |
| 06 | Ako sa vám žije | Po realizácii 3/3 – 30 dní po montáži | Ako sa vám žije s novou doskou? | skontrolované |
| 40 | Kód pre známych | Po realizácii – 45 dní po montáži (15 dní po 06), len zákazník s kódom v CRM | Poznáte niekoho, kto rieši kuchyňu? | na kontrole; program Odporučte Orostone (schválil Martin 26. 10. 2026), kým séria po montáži nie je zapojená, kód posiela Marián e-mailom 41 |
| 22 | Riešite ešte kuchyňu? | Reaktivácia 1/3 – 90 dní bez aktivity | Riešite ešte kuchyňu? | skontrolované |
| 23 | Tri realizácie | Reaktivácia 2/3 – 120 dní bez aktivity | Tri realizácie, na ktoré sme hrdí | skontrolované, klienti so zverejnením súhlasia |
| 24 | Máme vám ešte písať? | Reaktivácia 3/3 – 180 dní bez aktivity | Máme vám ešte písať? | skontrolované |
| 25 | Technické podklady | B2B 1/3 – hneď po pridaní tagu | Technický list a textúry pre váš projekt | skontrolované |
| 26 | Vzorky pre štúdio | B2B 2/3 – o 7 dní | Vzorky dekorov pre vaše štúdio | skontrolované |
| 27 | Showroom s klientom | B2B 3/3 – o 21 dní | Príďte s klientom vybrať konkrétnu platňu | skontrolované |
| 35 | Pre doterajších odberateľov | Kampaň – jednorazovo, st 14. 10. 2026 (naplánovaná) | Odteraz vám budeme písať dvakrát do mesiaca | skontrolované |
| 03 | Realizácia mesiaca | Kampaň – st 21. 10. 2026 (naplánovaná) | Taj Mahal na dlhom ostrovčeku s drezom | skontrolované |
| 04 | Dekor v detaile | Kampaň – pi 30. 10. 2026 (naplánovaná) | Roman Travertine: travertín bez impregnácie | skontrolované |
| 18 | Zo zákulisia | Kampaň – ut 24. 11. 2026 (naplánovaná) | Ako vzniká sinterovaný kameň | skontrolované |
| 19 | Sprievodca | Kampaň – pi 13. 11. 2026 (naplánovaná) | Čo je v cene pracovnej dosky | skontrolované |
| 20 | Realizácia mesiaca | Kampaň – št 3. 12. 2026 (naplánovaná) | Biela doska a tmavé drevo | skontrolované, klient so zverejnením súhlasí |
| 21 | Poďakovanie | Kampaň – ut 15. 12. 2026 (naplánovaná) | Ďakujeme za rok 2026 | skontrolované |
| 28 | Kuchyňa na jar | Kampaň – ut 12. 1. 2027 (naplánovaná) | Nová kuchyňa na jar: kedy začať | skontrolované |
| 29 | Dekor v detaile | Kampaň – ut 26. 1. 2027 (naplánovaná) | Appennino: svetlá plocha s jemnou kresbou | skontrolované |
| 30 | Realizácia mesiaca | Kampaň február 2027 | Biela doska v ružovej kuchyni | skontrolované, klient so zverejnením súhlasí |
| 31 | Pozvánka do showroomu | Kampaň február 2027 | Celé platne naživo v kaštieli v Bošanoch | skontrolované |
| 39 | Sprievodca | Kampaň február 2027 | Čo pracovná doska zvládne v bežnej kuchyni | na kontrole, termín určí Martin (vo februári idú aj 30 a 31, najviac 3 kampane do mesiaca); hlavná fotka je ilustračný záber z blogu (`sprievodca-panvica-gothic-gold.jpg`) |
| 32 | Dekor v detaile | Kampaň marec 2027 | Wild Forest: kresba pre veľké plochy | skontrolované |
| 33 | Spolupráca so štúdiom | Kampaň marec 2027 | Návrh kuchyne a doska: ako ich zladiť | skontrolované |
| 34 | Otázka k dopytu (čistý text) | CRM – jednorazovo, po schválení Mariánom | Krátka otázka k vašej pracovnej doske | skontrolované, v CRM zapojený (panel Otázka k dopytu v `/komunikacia`, migrácia `20261009160000` je na produkcii); k 19. 10. 2026 ešte nevznikol ani neodišiel žiadny návrh. Po zmene v CRM vynechá aj odberateľov newslettera a ľudí, ktorí e-maily nechcú (odpoveď „3“ alebo „nie“ si CRM zapamätá natrvalo). Dávky sa spustia až po tejto zmene a dopyty z apríla a mája 2026 ostávajú mimo (rozhodnutia Martina z 19. 10. 2026) |
| 38 | Tri krátke odpovede (čistý text) | CRM – odpoveď Mariána tým, ktorí na 34 odpísali „1 – stále vyberám“, po schválení Mariánom | Tri krátke odpovede k pracovnej doske | na kontrole; ide len tým, komu odišiel 34 (teda po jeho vylúčeniach), najviac raz na človeka a nikdy nie ľuďom, ktorí e-maily nechcú. Odberateľov newslettera nevylučuje, o odpoveď požiadali sami. Text treba meniť spolu s kópiou v CRM (orostone-crm, `web/lib`) |
| 41 | Kód pre známych (čistý text) | CRM – Marián tlačidlom na /admin/odporucania: súčasným zákazníkom po montáži a potom každému po montáži | Keď sa Vás známi pýtajú na dosku | na kontrole; kópia textu je v orostone-crm (web/lib) |
| 42 | Odmena za odporúčanie (čistý text) | CRM – Marián tlačidlom, keď vznikne nárok na odmenu (30 dní po úplnom zaplatení materiálu novým zákazníkom) | Váš kód použil nový zákazník | na kontrole; kópia textu je v orostone-crm (web/lib) |

**Odkiaľ idú:** Dopyt → ponuka (12–14) a Po realizácii (08, 17, 06) pôjdu z CRM ako koncepty so schválením, rovnako ako 34 a 38, nie z Klaviya (rozhodnutie Martina zo 14. 10. 2026). Pred spustením 12–14 treba s Martinom potvrdiť, či ich zásady ochrany súkromia pokrývajú ako komunikáciu k dopytu a cenovej ponuke (oprávnený záujem), alebo potrebujú súhlas. Automatické e-maily z Klaviya idú len ľuďom so súhlasom.

**Neposielame:** tip šesť mesiacov po montáži a Výročie (rozhodnutie Martina zo 7. 10. 2026). Potvrdenie objednávky vzorky posiela Shopify a potvrdenie dopytu web, tie netreba písať.

Program newslettera, typy e-mailov a kalendár sú v skille `orostone-newsletter` (`references/program-a-typy.md`).
Vizuálne pravidlá e-mailu sú v skille `orostone-kreativy` (`references/newsletter-vizual.md`).

## Komu posielame (skupiny v Klaviyu)

Kontakty v Klaviyu sme 12. 10. 2026 na žiadosť Martina upratali do dvoch oddelených skupín. Kto patrí do oboch, je len medzi odberateľmi, aby nedostával e-maily dvakrát.

| Skupina | Zoznam v Klaviyu | Kto v nej je | Čo dostáva |
|---|---|---|---|
| Odberatelia newslettera | Newsletter – web (`VSrLFs`) | Prihlásili sa na odber na webe (pätička, pop-up, formulár na vzorku so súhlasom). Nových pridáva web sám. | Uvítaciu sériu 01, 02, 07, 09 (beží od 12. 10. 2026) a kampane |
| Dopyty | Dopyty – LP1, LP2, e-mail (len k dopytu) (`TKAHuh`) | Napísali nám cez formulár LP1 (aj cez starší formulár TILDA), LP2 alebo priamo e-mailom. V CRM majú otvorený dopyt alebo otvorený obchod a dopyt poslali za posledných 6 mesiacov. Vlastnosť profilu `zdroj_dopytu` je LP1, LP2 alebo E-mail. Po upratovaní 12. 10. 2026 ich je 373, nové dopyty sa do zoznamu samy nepridávajú. Kto sa na webe prihlási na odber, toho web z tohto zoznamu sám vyradí. | Len e-maily k ich dopytu, napríklad 12–14, 34 a 38. Tie idú z CRM ako koncepty so schválením Mariána, nie ako automatizácia v Klaviyu (rozhodnutie Martina zo 14. 10. 2026). Súhlas s newsletterom nedali, preto im neposielame kampane ani uvítaciu sériu. |

Pravidlá kampaní (rozhodnutia Martina z 12. 10. 2026):

- Kampane idú o 9:00 len zoznamu Newsletter – web, najviac 3 do mesiaca. Termíny do januára 2027 sú v tabuľke vyššie.
- Kampane dostávajú aj odberatelia, ktorí už u nás kúpili. Zákazníci, ktorí sa na odber neprihlásili, ich nedostávajú.
- Kampane vylučujú segment `RdLKj8` (prihlásení za posledných 10 dní, teda ešte v uvítacej sérii) a pre istotu aj zoznam Dopyty (`TKAHuh`).
- Všetkých deväť kampaní do 26. 1. 2027 je v Klaviyu naplánovaných (12. 10. 2026).
- Potvrdenia z 12. 10. 2026: showroom je cez sviatky otvorený bežne (21), tlačidlo vzorky v 20 ostáva na stránke vzoriek, platne Appennino budú v januári v showroome (29) a odpovede na ahoj@orostone.sk niekto číta.
- Deň pred každou kampaňou kontrolujeme limit aktívnych kontaktov (500), počet príjemcov, odhlásenia a sťažnosti na spam po predchádzajúcej kampani. Ak sa odhlási viac ako 1 % príjemcov alebo príde sťažnosť na spam, hneď to napíšeme Martinovi s návrhom, či ďalšiu kampaň zastaviť. Miesto uvoľňujeme len mazaním Dopytov a len po súhlase Martina, nikdy nie odberateľov.

- 28 ľudí bolo v oboch skupinách, ostali len medzi odberateľmi.
- 13 ľudí, ktorí sa odhlásili alebo majú nedoručiteľnú adresu, ostalo v Klaviyu potlačených, aby im nič neodišlo. Firemné adresy info@ a marian.brazdil@ ostali. Ostatné staré kontakty (importy z Meta Ads, monday.com, LEADS_2026 a ďalšie) sú zmazané aj so starými zoznamami.
- 5 adries z CRM má preklep (napríklad „gmail.comd“), preto do Klaviya nešli. Treba ich opraviť v CRM.
- Z 515 dopytov sme 12. 10. 2026 zmazali 69 najstarších (dopyt od 12. 4. do 13. 5. 2026), ktorí nám nikdy neodpísali (v CRM nemajú žiadnu prichádzajúcu správu), aby sme ostali v limite 500 aktívnych kontaktov v Klaviyu.
- 12. 10. 2026 večer sme na rozhodnutie Martina zmazali z Klaviya ďalších 73 dopytov, ktoré nám v CRM nikdy neodpísali (žiadna prichádzajúca správa pri dopyte ani obchode). V CRM ostávajú a e-mail 34 im môže ísť ďalej. Pravidlo „mazať dopyty s uzavretým alebo prehratým obchodom“ k 12. 10. neuvoľnilo nič, všetkých 446 malo otvorený dopyt alebo obchod. Odberateľov sa mazanie netýkalo.

## Zástupné texty

- `[v hranatých zátvorkách]` – doplní sa pred odoslaním. Majú ich e-mail 08 (meno, dátum montáže, dekor – pre každého zákazníka iné) a e-mail 34 (mesiac dopytu v 6. páde a dekor; tri varianty prvej vety sú v hlavičke šablóny). Odkaz na prihlásenie v e-maile 34 vedie na formulár v pätičke webu.
- Realizácia mesiaca (03, 20) uvádza len fakty z fotiek a zo stránky Realizácie. Lokalitu, kamenára a citát klienta doplníme, keď ich Marián potvrdí (citát len so súhlasom klienta).
- Uvítacie odmeny sú dve a e-mail 01 ich dáva každému, kto sa na odber prihlási formulárom na webe orostone.sk (zoznam `VSrLFs`; rozhodnutie Martina z 15. 10. 2026): **prvá vzorka bez poštovného**, kód `VITAJTE` (od 7. 10. 2026), a **zľava 5 % na platne**, kód `WELCOME5`. Predmet e-mailu 01 kódy spomína (rozhodnutie Martina z 15. 10. 2026). Oba kódy v Shopify existujú (overené 15. 10. 2026): VITAJTE je zľava na dopravu do 3 € (teda len vzorky), WELCOME5 je 5 % na 12 dekorov. Oba platia raz na zákazníka, nekombinujú sa s inou zľavou (ani s automatickou 20 % od troch platní) a platia len pri objednávke na orostone.sk, nie po telefóne ani na základe cenovej ponuky. Vzorky sú v Shopify samostatný produkt `vzorky-orostone`, na ktorý WELCOME5 neplatí (overené 15. 10. 2026); e-mail preto radí zadať na vzorku VITAJTE a na platne WELCOME5. Pri novom dekore v e-shope ho pridať do WELCOME5 a upraviť počet v 01. Kampane 18, 20, 28, 30 a 35 spomínajú len VITAJTE a ostávajú bez zmeny.
- Fotky vybral Martin 7. 10. 2026 v troch kolách. Zábery výroby v 18 sú ilustračné (Higgsfield) a vychádzajú z fotiek skutočných fabrík na sinterovaný kameň. Kaštieľ v 13 je skutočná fotka z titulnej stránky webu.
- Obrázky sú v `public/images/email/` a web ich zverejní na `https://orostone.sk/images/email/`. Nový obrázok pridajte do tohto priečinka (JPG, dvojnásobná šírka oproti zobrazeniu, najviac okolo 150 KB).
- Gmail nezobrazí SVG a ignoruje `position` aj záporné okraje. Ikony sociálnych sietí sú preto PNG (`instagram-white.png`, `facebook-white.png`), popis hlavnej fotky je pod fotkou a odznak v podpise stojí v riadku medzi dvoma čiarami. Na mobile sa pri hlavnej fotke zmenší len bočný okraj. Horný ostáva, aby fotka nepriliehala k tmavému pásu.
- Preheader v e-mailoch s dizajnom začína emoji 🪨 (rozhodnutie Martina z 12. 10. 2026). Predmet je bez emoji a osobné listy Mariána (čistý text) emoji nemajú, aby vyzerali ako bežný e-mail. Pri vlastnej HTML šablóne Klaviyo berie preheader zo skrytého riadku na začiatku šablóny, nie z poľa „Preview text“. Pole preto vypĺňame rovnako, no rozhoduje šablóna.
- Odkaz na odhlásenie je tag Klaviyo `{% unsubscribe_link %}`, ktorý vloží len adresu, a preto patrí do `href`. Tag `{% unsubscribe %}` vkladá celý odkaz, takže v `href` by odkaz rozbil. Ďalšie premenné doplní rozosielací nástroj.
