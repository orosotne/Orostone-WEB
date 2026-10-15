# Jazyková kontrola právnych textov – denník

**Stav:** `nové` → `prijaté` / `zamietnuté` (s dôvodom) → `zapracované`. Zapracúva Claude, sporné prípady a všetko, čo mení právny význam, rozhoduje majiteľ.
**Typ:** pravopis · gramatika · interpunkcia · typografia · spisovnosť · štylistika · význam · otázka.

---

## Kolo 0 – vlastná kontrola Claude (7. 10. 2026)

Pred odovzdaním Codexu, zapracované v PR #70.

| # | Dokument | Pôvodný text | Nový text | Typ | Stav |
|---|---|---|---|---|---|
| 1 | VOP, ochrana súkromia, formulár, rezervačný poplatok | „VOP", „Klient", „Zákon", „Vytlačiť formulár" | „VOP“, „Klient“, „Zákon“, „Vytlačiť formulár“ | typografia | zapracované |
| 2 | VOP, Reklamácie, formulár, Doprava, ochrana súkromia | Z.z. | Z. z. | typografia | zapracované |
| 3 | Doprava | v Všeobecných obchodných podmienkach | vo Všeobecných obchodných podmienkach | gramatika | zapracované |
| 4 | Ochrana súkromia | Ak e-mailovú adresu neposkytne, odoberanie newsletteru nebude možné. | Ak e-mailovú adresu neposkytnete, odber newslettera nebude možný. | gramatika | zapracované |
| 5 | Ochrana súkromia | Newsletter odber zrušíte… | Odber newslettera zrušíte… | štylistika | zapracované |
| 6 | Reklamácie | Zodpovednosť sa nevzťahuje na: Neodborná manipulácia… | … Neodbornú manipuláciu… | gramatika | zapracované |
| 7 | VOP, ochrana súkromia, cookies, Reklamácie | dlhá pomlčka — | krátka pomlčka – s medzerami | typografia | zapracované |
| 8 | Ochrana súkromia, cookies | 26.03.2026 | 7. 10. 2026 (dátum aktualizácie) | typografia | zapracované |

## Kolo 1 – Codex review (7. 10. 2026)

Codex v PR #80 (commit 5452a6a): 29 pripomienok. 25 je zapracovaných, z toho 4 s úpravou (dôvod je v stĺpci Stav). 4 menia právny význam; majiteľ 7. 10. 2026 schválil odporúčané znenia (nižšie) a sú zapracované. Druhé kolo nad opravami (commit b69aa0d) malo 1 pripomienku k č. 19 a je zapracovaná.

| # | Dokument | Pôvodný text | Nový text | Typ | Stav |
|---|---|---|---|---|---|
| 1 | Cookies – prevádzkovateľ | Bratislava - mestská časť Staré Mesto | Bratislava – mestská časť Staré Mesto | typografia | zapracované |
| 2 | Cookies – tabuľka (košík) | Do vymazania košíka alebo prehliadačom | Do vymazania košíka alebo údajov prehliadača | gramatika | zapracované |
| 3 | Cookies – tabuľka (Cloudflare) | bezpečnostné a anti-abuse mechanizmy Cloudflare | bezpečnostné mechanizmy Cloudflare | spisovnosť | zapracované s úpravou: ochrana pred zneužitím je už v prvej časti vety, návrh Codexu by ju opakoval |
| 4 | Cookies – tabuľka (newsletter) | interakcii s newsletter popupom | interakcii s vyskakovacím oknom newslettera | spisovnosť | zapracované |
| 5 | Doprava – prevzatie | primerané podmienky…, vrátane najmenej 2 osôb na asistenciu pri prevzatí | primerané podmienky… a najmenej dve osoby, ktoré pri prevzatí pomôžu | štylistika | zapracované s úpravou: povinnosť zabezpečiť osoby zostáva výslovne na kupujúcom |
| 6 | Doprava – odstúpenie | …nájdete na stránke Reklamácie a vrátenie alebo vyplňte formulár… | …nájdete na stránke Reklamácie a vrátenie; môžete tiež vyplniť formulár… | gramatika | zapracované |
| 7 | Ochrana súkromia – prevádzkovateľ, kontakt | Bratislava - mestská časť Staré Mesto (2×) | Bratislava – mestská časť Staré Mesto | typografia | zapracované |
| 8 | Ochrana súkromia, čl. 2 | Vaše osobné údaje spracovávame za týmito účelmi | Vaše osobné údaje spracúvame na tieto účely | gramatika | zapracované |
| 9 | Ochrana súkromia, čl. 2 | odpovede na dopyty a cenovú ponuku | odpovedanie na dopyty a poskytovanie cenových ponúk | gramatika | zapracované |
| 10 | Ochrana súkromia – sprostredkovatelia | E-shop platforma | E-shopová platforma | spisovnosť | zapracované |
| 11 | Ochrana súkromia – Cloudflare | fingerprint prehliadača | odtlačok prehliadača | spisovnosť | zapracované |
| 12 | Ochrana súkromia – práva | právo byť zabudnutý | právo na zabudnutie | spisovnosť | zapracované (tak ho pomenúva aj slovenské znenie GDPR, čl. 17) |
| 13 | Ochrana súkromia – práva | prenos vašich údajov k inému prevádzkovateľovi | prenos vašich údajov inému prevádzkovateľovi | gramatika | zapracované |
| 14 | Ochrana súkromia – práva | namietať voči spracovaniu | namietať proti spracovaniu | gramatika | zapracované s úpravou: podstatné meno „spracovanie“ zostáva, aby sa zhodovalo s ostatnými právami v zozname |
| 15 | Formulár na odstúpenie | (naskenovaný/odfotený) | (naskenovaný alebo odfotografovaný) | spisovnosť | zapracované |
| 16 | Rezervácia ceny 5.1 | rezervačný poplatok zaniká bez nároku na jeho vrátenie | právo uplatniť rezervačný poplatok ako kredit alebo zľavu zaniká a zákazník nemá nárok na jeho vrátenie | význam | zapracované (O4, schválil majiteľ) |
| 17 | Rezervácia ceny 11.1 | môže zákazník kontaktovať Orostone na: | môže zákazník kontaktovať Orostone: | gramatika | zapracované s úpravou: zoznam kontaktov pod vetou zostáva, aby zostali odkazy na e-mail a telefón |
| 18 | Reklamácie – úvod | Reklamácie vybavujeme a právo na odstúpenie od zmluvy uplatňujeme v súlade… | Reklamácie vybavujeme a pri uplatnení práva na odstúpenie od zmluvy postupujeme v súlade… | štylistika | zapracované |
| 19 | Reklamácie – kontrola pred spracovaním | nemožno úspešne uplatňovať tie vady alebo vlastnosti | nemožno úspešne uplatniť reklamáciu založenú na vadách alebo vlastnostiach | gramatika | zapracované podľa návrhu Codexu (kratšia verzia „reklamovať vlastnosti“ neprešla 2. kolom) |
| 20 | Reklamácie – postup | Reklamáciu alebo vytknutie vady môžete uplatniť e-mailom | Reklamáciu môžete uplatniť alebo vadu vytknúť e-mailom | gramatika | zapracované |
| 21 | Reklamácie – vrátenie platieb | na základe alebo v súvislosti so zmluvou | na základe zmluvy alebo v súvislosti s ňou | gramatika | zapracované |
| 22 | VOP 1.3 | …povolania, považuje sa za spotrebiteľa | …povolania, sa považuje za spotrebiteľa | gramatika | zapracované |
| 23 | VOP 2.4 | Vzorka vs. celá platňa | Vzorka a celá platňa | spisovnosť | zapracované |
| 24 | VOP 2.7 | neposkytuje projektovú, … ani montážnu zodpovednosť…, pokiaľ takáto služba… | neposkytuje projektové, … ani montážne služby a za takéto riešenie použitia Tovaru nezodpovedá, pokiaľ takáto služba… | význam | zapracované (O2, schválil majiteľ) |
| 25 | VOP 3.7 | individuálna, nadštandardná, neštandardných rozmerov, mimo bežného skladového sortimentu… | individuálna alebo nadštandardná, ak sa týka Tovaru neštandardných rozmerov či Tovaru mimo bežného skladového sortimentu alebo ak je viazaná… | význam | zapracované (O3, schválil majiteľ) |
| 26 | VOP 10.4 | popis vady | opis vady | spisovnosť | zapracované |
| 27 | VOP 12.1 | Predávajúci nezodpovedá…, ak takáto zodpovednosť nemôže byť podľa kogentných právnych predpisov vylúčená | Predávajúci v rozsahu, v akom to pripúšťajú kogentné právne predpisy, nezodpovedá… | význam | zapracované (O1, schválil majiteľ) |
| 28 | VOP 12.2 | obmedzuje najviac do výšky ceny | obmedzuje na výšku ceny | gramatika | zapracované (zvratné „sa“ vo vete už je) |
| 29 | VOP 13.2 | Po dobu trvania okolností | Počas trvania okolností | spisovnosť | zapracované |

### Doplnené Claude – ten istý jav na ďalších miestach

| # | Dokument | Pôvodný text | Nový text | Typ | Stav |
|---|---|---|---|---|---|
| 30 | Ochrana súkromia – podnadpisy čl. 1 a 2, právo na prístup | spracováva, spracovávame | spracúva, spracúvame | spisovnosť | zapracované (kodifikovaná podoba je „spracúvať“, ako v č. 8) |
| 31 | VOP 3.5, Reklamácie – postup | popise Tovaru, Popis vady a dátum zistenia | opise Tovaru, Opis vady a dátum zistenia | spisovnosť | zapracované (ako v č. 26) |
| 32 | Pätička webu | Bratislava - mestská časť Staré Mesto | Bratislava – mestská časť Staré Mesto | typografia | zapracované (ako v č. 1) |
| 33 | Rezervácia ceny 2.1 | kredit/zľavu | kredit alebo zľavu | štylistika | zapracované (rovnako ako v bode 4.1) |
| 34 | Reklamácie – postup | (detail + celkový pohľad) | (detail aj celkový pohľad) | štylistika | zapracované |
| 35 | Cookies – tabuľka (Cloudflare) | Do 30 min / podľa konfigurácie služby | Do 30 minút alebo podľa konfigurácie služby | štylistika | zapracované |

### Otázky pre majiteľa (rozhodnuté 7. 10. 2026)

Tieto opravy menia alebo spresňujú právny význam. Majiteľ schválil všetky odporúčané znenia a sú zapracované. Bod 12.2 (strop zodpovednosti pri podnikateľoch) zostal bez vecnej zmeny; poznámka k § 386 ods. 1 Obchodného zákonníka pri O1 platí aj preň.

- **O1 – VOP 12.1 (Codex P1).** Teraz: „Predávajúci nezodpovedá za nepriame škody, …, ak takáto zodpovednosť nemôže byť podľa kogentných právnych predpisov vylúčená.“ Doslova to znamená, že predávajúci nezodpovedá práve vtedy, keď zákon vylúčenie zodpovednosti zakazuje, teda podmienka je obrátená. Odporúčané: „Predávajúci v rozsahu, v akom to pripúšťajú kogentné právne predpisy, nezodpovedá za nepriame škody, následné škody, ušlý zisk, prestoje, stratu zákazky, náklady tretích osôb ani iné následné ekonomické ujmy.“ Pri 12.1 aj 12.2 treba zvážiť aj § 386 ods. 1 Obchodného zákonníka (nároku na náhradu škody sa nemožno vzdať vopred).
- **O2 – VOP 2.7.** Teraz: „Predávajúci neposkytuje projektovú, architektonickú, statickú, stavebnú ani montážnu zodpovednosť za použitie Tovaru, pokiaľ takáto služba nebola…“ Zodpovednosť sa neposkytuje a veta ju potom nazýva službou. Odporúčané (pokrýva služby aj zodpovednosť): „Predávajúci neposkytuje projektové, architektonické, statické, stavebné ani montážne služby a za takéto riešenie použitia Tovaru nezodpovedá, pokiaľ takáto služba nebola osobitne písomne objednaná a písomne potvrdená.“
- **O3 – VOP 3.7.** Výpočet mieša vlastnosti objednávky a Tovaru. Odporúčané: „Ak je objednávka individuálna alebo nadštandardná, ak sa týka Tovaru neštandardných rozmerov či Tovaru mimo bežného skladového sortimentu alebo ak je viazaná na osobitné požiadavky Klienta, kúpna zmluva vzniká až…“ (zvyšok vety bez zmeny).
- **O4 – Rezervácia ceny 5.1.** Teraz: „…rezervačný poplatok zaniká bez nároku na jeho vrátenie.“ Zaplatený poplatok sám nezaniká; zaniká možnosť uplatniť ho. Odporúčané (v súlade s bodmi 4.1 a 5.2): „…, právo uplatniť rezervačný poplatok ako kredit alebo zľavu zaniká a zákazník nemá nárok na jeho vrátenie.“

## Kolo 2 – Codex review PR #110 (11. 10. 2026)

Codex v PR #110 (commit d022f6d): 1 pripomienka k zásadám ochrany súkromia, zapracovaná v tom istom PR. Druhé kolo nad opravou (commit b1d9998) malo 1 jazykovú pripomienku (č. 2) a je zapracovaná. Znenie spresňuje, čo sa po odhlásení vymaže a čo ostane v Klaviyu, a dopĺňa právny základ a kritérium uchovania. Mení teda právny význam, preto ho musel potvrdiť majiteľ. Majiteľ ho potvrdil 12. 10. 2026.

| # | Dokument | Pôvodný text | Nový text | Typ | Stav |
|---|---|---|---|---|---|
| 1 | Ochrana súkromia – doba uchovávania (newsletter) | Po odvolaní súhlasu sú údaje vymazané do 30 dní. V Klaviyu ostane e-mailová adresa označená ako odhlásená, aby vám newsletter už neprišiel. | Po odvolaní súhlasu ju spolu s ďalšími údajmi o odbere do 30 dní vymažeme z databázy webu. V službe Klaviyo, cez ktorú newsletter posielame, ostane váš profil s označením, že ste sa odhlásili, aby vám newsletter už neprišiel (oprávnený záujem). Uchovávame ho, kým newsletter posielame, a na požiadanie ho vymažeme. | význam | zapracované, majiteľ potvrdil 12. 10. 2026. Pôvodné vety si protirečili: výmaz do 30 dní a zároveň adresa ostáva v Klaviyu. Nové znenie oddeľuje výmaz z databázy webu od záznamu v Klaviyu. V Klaviyu ostáva celý profil, nielen adresa, preto „profil“. |
| 2 | Ochrana súkromia – doba uchovávania (newsletter) | V Klaviyu, cez ktorý newsletter posielame | V službe Klaviyo, cez ktorú newsletter posielame | gramatika | zapracované (Codex k b1d9998: zámeno „ktorý“ nemalo vo vete mužský antecedent) |

## Kolo 3 – zásady: pokladňa Shopify a Klaviyo, PR #140 (14. 10. 2026)

Vlastná kontrola Claude (dve nezávislé kolá: právo, jazyk, regresie) pred odovzdaním Codexu. Vecné zmeny vychádzajú z rozhodnutí majiteľa zo 14. 10. 2026: údaje o objednávkach všetkých zákazníkov idú do Klaviya na základe oprávneného záujmu (prehľad objednávok a meranie výsledkov e-mailov), marketingové e-maily len so súhlasom, uchovávanie v Klaviyu 3 roky od poslednej objednávky, právo namietať. Body 3 a 5 z týchto rozhodnutí vyplývali, no majiteľ ich najprv výslovne neschválil (pripomienka Codexu P1 k 8f6a779). Majiteľ ich potvrdil 14. 10. 2026: pri platnom súhlase má súhlas prednosť pred lehotou 3 roky a obchodník kontaktuje odberateľa len e-mailom. K pripomienke Codexu P1 k 2bf6bd8 majiteľ 14. 10. 2026 schválil body 6 a 7; bod 11 neschválil, preto sa nezapracoval.

| # | Dokument | Pôvodný text | Nový text | Typ | Stav |
|---|---|---|---|---|---|
| 1 | Ochrana súkromia, čl. 2 | – | Nový účel „Prehľad objednávok a meranie e-mailov“, čl. 6 ods. 1 písm. f) | význam | zapracované, majiteľ rozhodol 14. 10. 2026 |
| 2 | Ochrana súkromia, čl. 6 | – | 3 roky od poslednej objednávky (údaje z e-shopu v službe Klaviyo) | význam | zapracované, majiteľ potvrdil 14. 10. 2026 |
| 3 | Ochrana súkromia, čl. 6 | – | Kto ešte nič neobjednal, lehota plynie od posledného nákupu nedokončeného v pokladni. Kým platí súhlas, profil aj s objednávkami ostáva; ak lehota medzitým uplynula, vymaže sa po odvolaní súhlasu. Po odhlásení ostane len e-mailová adresa s označením odhlásenia (oprávnený záujem), kým marketingové e-maily posielame (znenie z Kola 2 rozšírené na súhlas z pokladne) | význam | zapracované, majiteľ potvrdil 14. 10. 2026 (súhlas má prednosť; rieši aj pripomienku Codexu P2 k 8f6a779) |
| 4 | Ochrana súkromia, čl. 8 | Môžete namietať proti spracovaniu na základe oprávneného záujmu alebo na účely priameho marketingu | Samostatný rámček „Právo namietať (čl. 21 GDPR)“ (čl. 21 ods. 4 GDPR: jasne a oddelene od iných informácií) | význam | zapracované, majiteľ rozhodol 14. 10. 2026 (právo namietať) |
| 5 | Ochrana súkromia, čl. 2 | Automatizované rozhodovanie ani profilovanie v zmysle čl. 22 GDPR nevykonávame. | Automatizované rozhodovanie s právnymi alebo podobne významnými účinkami nevykonávame; výber e-mailov podľa jednoduchých pravidiel; upozornenie obchodníkovi pri odpovedi „do 3 mesiacov“, „aby vám mohol osobne napísať“ | význam | zapracované, majiteľ potvrdil 14. 10. 2026 (obchodník kontaktuje len e-mailom) |
| 6 | Ochrana súkromia, čl. 7 | záruka v súlade s čl. 46 GDPR; stĺpec „Záruka prenosu“ | rozhodnutie o primeranosti (čl. 45) alebo primerané záruky (čl. 46); stĺpec „Základ prenosu“ | význam | zapracované, majiteľ schválil 14. 10. 2026 (Kanada a EU–US Data Privacy Framework sú rozhodnutia podľa čl. 45, nie záruky podľa čl. 46) |
| 7 | Ochrana súkromia, čl. 2 a 4 | pri nedokončenej objednávke v pokladni | nákup nedokončený v pokladni | význam | zapracované, majiteľ 14. 10. 2026 schválil odporúčané znenie (objednávka vzniká až odoslaním v poslednom kroku, Checkout.tsx) |
| 8 | Ochrana súkromia, čl. 3 | Políčko nie je vopred zaškrtnuté a nákup je možný aj bez neho. | … a nakúpiť môžete aj bez súhlasu. | gramatika | zapracované („neho“ sa vzťahovalo na políčko) |
| 9 | Ochrana súkromia – Klaviyo | Z e-shopu Shopify do nej prechádzajú… z nej posielame | Z e-shopu na platforme Shopify dostáva… cez Klaviyo posielame | gramatika | zapracované (zámeno „nej“ nemalo antecedent, ako v Kole 2 č. 2) |
| 10 | Ochrana súkromia, čl. 7 | Pri prenose údajov k nim | Prenos údajov týmto poskytovateľom | gramatika | zapracované (ako v Kole 1 č. 13) |
| 11 | Ochrana súkromia, čl. 7 | – | Kópiu štandardných zmluvných doložiek si môžete vyžiadať e-mailom na info@orostone.sk. | význam | zamietnuté: majiteľ 14. 10. 2026 neschválil, veta sa odstránila. Otvorené: čl. 13 ods. 1 písm. f) GDPR žiada uviesť, ako získať kópiu záruk podľa čl. 46 |
| 12 | Ochrana súkromia, čl. 8 – právo namietať | Po námietke vaše údaje na tento účel ďalej nespracúvame | Spracovanie, proti ktorému ste namietali, potom ukončíme; pri priamom marketingu „na tieto účely“ | gramatika | zapracované (nejasný antecedent, zhoda čísla podľa čl. 21 ods. 3 GDPR) |
| 13 | Ochrana súkromia, čl. 6 – 3 roky | Potom profil vymažeme. … vymažeme ho po odvolaní súhlasu. | Potom profil najneskôr do 3 mesiacov vymažeme. … najneskôr do 3 mesiacov po odvolaní súhlasu. | význam | zapracované, majiteľ potvrdil 14. 10. 2026 (mazanie raz za štvrťrok; pripomienka Codexu P2 k 1357cac) |
| 14 | Ochrana súkromia, čl. 6 – newsletter | Pre profil s údajmi o objednávkach a nákupoch nedokončených v pokladni platí vyššie uvedená lehota 3 roky. | Ak sú vo vašom profile aj údaje z e-shopu (…), po uplynutí lehoty 3 roky uvedenej vyššie profil vymažeme a ponecháme len vašu e-mailovú adresu s označením, že ste sa odhlásili. | štylistika | zapracované (pripomienka Codexu P2 k 9644d44). Význam sa nemení: odhlásený odberateľ bez údajov z e-shopu má profil, kým newsletter posielame (Kolo 2 č. 1, majiteľ 12. 10. 2026); pri údajoch z e-shopu ostane po 3 rokoch len e-mail s označením (č. 3, majiteľ 14. 10. 2026) |

## Kolo 4 – zásady: pripomenutie nedokončeného nákupu aj bez súhlasu, PR #144 (14. 10. 2026)

Vecná zmena z rozhodnutia majiteľa zo 14. 10. 2026. Pripomenutie nedokončeného nákupu, ktoré posiela platforma Shopify, pôjde aj zákazníkom bez súhlasu s e-mailovým marketingom. Pre tento jeden e-mail to mení rozhodnutie z Kola 3 „marketingové e-maily len so súhlasom“; newsletter a automatické e-maily cez službu Klaviyo ostávajú len so súhlasom. Majiteľ zmenu zásad výslovne zadal a prevzal za ňu zodpovednosť (14. 10. 2026, doslovne, po upozornení, že posielanie všetkým zákazníkom je v rozpore s vtedajšími zásadami): „chcem automaticky posielat aj ked je to proti nasim zasadam ochrany osobnych udajov, zmeni tie zasady alebo preformuluij, prosim ta sprav to je to na moju zdpovednost“. Formuláciu zveril Claude. Konkrétne znenie majiteľ výslovne potvrdil 15. 10. 2026 odpoveďou „Áno, potvrdzujem“ na otázku s týmito bodmi: (1) ku každému nedokončenému nákupu príde najviac jeden e-mail s pripomenutím; (2) Shopify nedokončené nákupy vymaže spravidla po 3 mesiacoch, záznam o odmietnutí uchovávame, kým pripomenutia posielame; (3) pripomenutie je priamy marketing, odmietnuť ho dá kedykoľvek, bezplatne a bez udania dôvodu (odkazom v e-maile alebo na info@orostone.sk); (4) pri tlačidlách do pokladne bude veta „Ak v pokladni zadáte e-mail a nákup nedokončíte, pošleme vám k nemu jedno pripomenutie, aj keď nezaškrtnete súhlas s novinkami. Pripomenutie máte právo kedykoľvek bezplatne odmietnuť odkazom v ňom alebo na info@orostone.sk.“; (5) pripomenutie posiela Shopify, nie Klaviyo (A4 sa nespúšťa). Majiteľ 14. 10. 2026 zároveň rozhodol, že pripomenutie posiela Shopify a flow A4 v službe Klaviyo sa nespúšťa (marketing/newsletter/automatizacie-plan.md, PR #143). Preto z riadku Marketing ubudol príklad s pokladňou (č. 1) a pri službe Klaviyo pribudla veta, že pripomenutie neposiela (č. 5).

Právny základ: § 116 ods. 15 zákona č. 452/2021 Z. z. (znenie overené na Slov-Lexe, verzia účinná od 18. 8. 2026) v spojení s čl. 6 ods. 1 písm. f) GDPR. Či sa výnimka podľa § 116 ods. 15 vzťahuje aj na človeka, ktorý nákup nedokončil, je sporné: smernica 2002/58/ES hovorí o „zákazníkoch“ a nemecké dozorné orgány (LDI NRW 2025, HBDI 2024) pri takýchto pripomenutiach vyžadujú súhlas. Majiteľ toto riziko vedome prijal. Zákon vyžaduje ponúknuť odmietnutie už pri získaní e-mailu. E-mail sa zadáva až v pokladni Shopify, preto pribudlo upozornenie pri každom tlačidle na webe, ktoré do nej vedie (č. 11).

Predpoklady pred zapnutím v Shopify (majiteľ, až po merge a nasadení): jeden e-mail ku každému nedokončenému nákupu, len tovar z pokladne, bez zľavy a iného tovaru, odkaz na odhlásenie a v e-maile samostatná veta o práve namietať; ak to Shopify dovolí, rovnaká veta ako v upozornení aj v pokladni pri poli e-mail. Testom treba overiť a sem zapísať s dátumom: (a) po kliknutí na odkaz na odhlásenie Shopify na tú istú adresu nepošle ďalšie pripomenutie ani pri novom nedokončenom nákupe; (b) postup, ako odmietnutie doručené na info@orostone.sk zapíšeme v Shopify, aby pripomenutie neodišlo. Ak (a) alebo (b) nejde, treba pred zapnutím zmeniť vety „ďalšie pripomenutia vám potom neposielame“ (čl. 6 a 8) a odmietnutie cez info@orostone.sk (upozornenie, čl. 2).

| # | Dokument | Pôvodný text | Nový text | Typ | Stav |
|---|---|---|---|---|---|
| 1 | Ochrana súkromia, čl. 2 – Marketing | Automatické e-maily vám môžeme poslať napríklad … keď nedokončíte nákup v pokladni e-shopu alebo … | … keď si objednáte vzorku alebo … Výnimkou je pripomenutie nedokončeného nákupu, ktoré posielame aj bez súhlasu (pozri nasledujúci riadok). | význam | zapracované, majiteľ potvrdil 15. 10. 2026 (bod 5) |
| 2 | Ochrana súkromia, čl. 2 | – | Nový účel „Pripomenutie nedokončeného nákupu“: … platforma Shopify vám v našom mene pošle k tomuto nákupu jeden e-mail s prehľadom tovaru, ktorý ste v pokladni nechali, a s odkazom na dokončenie nákupu. Pripomenutie vám pošleme aj vtedy, ak ste súhlas s e-mailovým marketingom nedali. Odmietnuť pripomenutie môžete kedykoľvek, bezplatne a bez udania dôvodu odkazom na odhlásenie v e-maile alebo správou na info@orostone.sk. Ide o námietku proti priamemu marketingu …; čl. 6 ods. 1 písm. f) – oprávnený záujem (pripomenutie nákupu, ktorý ste v našom e-shope začali) v spojení s § 116 ods. 15 zákona č. 452/2021 Z. z. … v znení neskorších predpisov | význam | zapracované, majiteľ potvrdil 15. 10. 2026 (body 1 a 3) |
| 3 | Ochrana súkromia, čl. 2 – Prehľad objednávok | aby sme zákazníkom bez súhlasu marketingové e-maily neposielali | aby sme zákazníkom bez súhlasu neposielali newsletter ani automatické e-maily cez službu Klaviyo | význam | zapracované, vyplýva z bodu 5 potvrdeného majiteľom 15. 10. 2026 (pôvodná veta by po č. 2 neplatila; nový záväzok nepridáva) |
| 4 | Ochrana súkromia, čl. 3 – Newsletter | – | Bez ohľadu na súhlas vám ku každému nákupu, ktorý v pokladni nedokončíte, môže prísť jedno pripomenutie (pozri časť Účel spracovania). Pripomenutie môžete kedykoľvek odmietnuť a na vaše nákupy to nemá vplyv. | význam | zapracované, majiteľ potvrdil 15. 10. 2026 (body 1 a 3; čl. 13 ods. 2 písm. e) GDPR) |
| 5 | Ochrana súkromia, čl. 4 – Shopify, Klaviyo | – | Shopify: „odoslanie pripomenutia nedokončeného nákupu“. Klaviyo: „Pripomenutie nedokončeného nákupu neposiela Klaviyo, ale Shopify.“ | význam | zapracované, majiteľ potvrdil 15. 10. 2026 (bod 5) |
| 6 | Ochrana súkromia, čl. 5 – E-mailová komunikácia | – | Odoslanie pripomenutí nedokončeného nákupu a ich odmietnutie | význam | zapracované, vyplýva z bodov 1 a 3 potvrdených majiteľom 15. 10. 2026 (kategória údajov; nový záväzok nepridáva) |
| 7 | Ochrana súkromia, čl. 6 | – | 3 mesiace – Nákupy nedokončené v pokladni – platforma Shopify ich spravidla po 3 mesiacoch automaticky vymaže. Záznam o tom, že ste pripomenutia odmietli, uchovávame, kým ich posielame, aby vám ďalšie už neprišli. | význam | zapracované, majiteľ potvrdil 15. 10. 2026 (bod 2; lehota podľa pomocníka Shopify: opustené pokladne staršie ako 3 mesiace sa automaticky mažú) |
| 8 | Ochrana súkromia, čl. 7 – rámček | Shopify spracúva objednávky z e-shopu (Kanada / USA) | Shopify spracúva objednávky z e-shopu a nákupy nedokončené v pokladni (Kanada / USA) | význam | zapracované, vyplýva z bodu 5 potvrdeného majiteľom 15. 10. 2026 (úplnosť po č. 2; nový záväzok nepridáva) |
| 9 | Ochrana súkromia, čl. 8 – dlaždice | … vrátane súvisiaceho profilovania. / Odber newslettera aj ďalších marketingových e-mailov zrušíte … | … vrátane súvisiaceho profilovania. Námietkou odmietnete aj pripomenutie nedokončeného nákupu. / … marketingových e-mailov, na ktoré ste dali súhlas, zrušíte … | význam | zapracované, majiteľ potvrdil 15. 10. 2026 (bod 3; pripomenutie sa odmieta námietkou, nie odvolaním súhlasu) |
| 10 | Ochrana súkromia, čl. 8 – právo namietať | Námietku pošlite na info@orostone.sk. Odhlásenie z e-mailov zastaví len marketingové e-maily, nie prenos údajov z e-shopu do služby Klaviyo. | Pripomenutie nedokončeného nákupu je priamy marketing, ktorý posielame na základe oprávneného záujmu. Pripomenutie môžete kedykoľvek, bezplatne a bez udania dôvodu odmietnuť kliknutím na odkaz na odhlásenie v samotnom pripomenutí; ďalšie pripomenutia vám potom neposielame. Každú námietku môžete poslať na info@orostone.sk. Odhlásenie z newslettera zastaví len e-maily zo služby Klaviyo, nie pripomenutie nedokončeného nákupu. Ani jeden z týchto krokov nezastaví prenos údajov z e-shopu do služby Klaviyo. | význam | zapracované, majiteľ potvrdil 15. 10. 2026 (bod 3; čl. 21 ods. 2 až 4 GDPR; odhlásenia medzi službami Klaviyo a Shopify sa nesynchronizujú) |
| 11 | Pokladňa (/checkout), bočný košík, objednávka vzoriek (/vzorky) | – | Ak v pokladni zadáte e-mail a nákup nedokončíte, pošleme vám k nemu jedno pripomenutie, aj keď nezaškrtnete súhlas s novinkami. Pripomenutie máte právo kedykoľvek bezplatne odmietnuť odkazom v ňom alebo na info@orostone.sk. Ochrana súkromia | význam | zapracované, majiteľ potvrdil 15. 10. 2026 (bod 4; § 116 ods. 15: odmietnutie treba ponúknuť pri získaní e-mailu) |

### Stav predpokladov pred zapnutím (15. 10. 2026)

- Splnené a overené v Shopify 15. 10. 2026: automatizácia aj jej jediný e-mail sú Active, príjemcovia All customers; e-mail obsahuje len tovar z pokladne, zľavový kód DOKONCIT10 na dokončenie nákupu (Kolo 6, podmienky v e-maile), odkaz na odhlásenie v päte a samostatný odsek o práve namietať. Podrobnosti: `marketing/newsletter/automatizacie-plan.md`, A4 › 4.
- Veta „Ak to Shopify dovolí, rovnaká veta ako v upozornení aj v pokladni pri poli e-mail“: nezapracované, neoverené, či to Shopify pri tomto pláne dovolí.
- Test (a), odhlásenie zastaví ďalšie pripomenutia aj pri novom nedokončenom nákupe: **otvorené**, čaká na test majiteľa na vlastnej adrese.
- Test (b), postup pre odmietnutie doručené na info@orostone.sk: **otvorené**. Návrh: zákazníkovi v Shopify › Customers nastaviť e-mailový marketing na odhlásený (ak v Shopify ešte nie je, založiť ho); či to zabráni pripomenutiu pri príjemcoch „All customers“, ukáže test (a).

## Kolo 5 – zásady: pripomenutie košíka cez Klaviyo (15. 10. 2026)

Vecná zmena zo zadania majiteľa z 15. 10. 2026: odberateľom newslettera, ktorí si na webe vložia dekor do košíka a objednávku nedokončia, pošle služba Klaviyo pripomenutie košíka. Ide o ďalší automatický e-mail v rámci súhlasu s e-mailovým marketingom, ktorý odberateľ už dal (Kolo 3: marketingové e-maily cez Klaviyo len so súhlasom). Web preto načíta skript Klaviyo (`hooks/useKlaviyo.ts`, len pri povolených marketingových cookies) a cookie `__kla_id` rozpozná odberateľa, ktorý prišiel z odkazu v našom e-maile; pri pridaní do košíka web pošle udalosť Added to Cart (`context/CartContext.tsx`). Pripomenutie nákupu nedokončeného v pokladni ďalej posiela Shopify bez ohľadu na súhlas (Kolo 4); v textoch sa preto rozlišuje „pripomenutie košíka“ (Klaviyo, so súhlasom) a „pripomenutie nedokončeného nákupu“ (Shopify). Konkrétne znenie majiteľ výslovne potvrdil 15. 10. 2026 odpoveďou „Áno, potvrdzujem“ na otázku s citovanými vetami čl. 2, 4 a 9 a riadkom cookie `__kla_id`; platnosť cookie `__kla_id` je podľa pomocníka Klaviyo „About cookies in Klaviyo“ (do 2 rokov, Safari a Firefox ju skracujú).

| # | Dokument | Pôvodný text | Nový text | Typ | Stav |
|---|---|---|---|---|---|
| 1 | Ochrana súkromia, čl. 2 – Marketing | … keď si objednáte vzorku alebo keď ako odberateľ newslettera 90 dní … | … keď si objednáte vzorku, keď si ako odberateľ newslettera vložíte dekor do košíka e-shopu a objednávku nedokončíte (pripomenutie košíka) alebo keď ako odberateľ newslettera 90 dní … Odberateľa newslettera v e-shope rozpoznáme len vtedy, ak prišiel z odkazu v našom e-maile a povolil marketingové cookies (pozri časť Cookies). | význam | zapracované, majiteľ potvrdil 15. 10. 2026 |
| 2 | Ochrana súkromia, čl. 4 – Klaviyo | Pripomenutie nedokončeného nákupu neposiela Klaviyo, ale Shopify. | Ak povolíte marketingové cookies, skript služby Klaviyo na našom webe rozpozná odberateľa newslettera, ktorý prišiel z odkazu v našom e-maile, a zaznamená, že si vložil dekor do košíka; Klaviyo mu potom pošle pripomenutie košíka. Pripomenutie nákupu nedokončeného v pokladni neposiela Klaviyo, ale Shopify. | význam | zapracované, majiteľ potvrdil 15. 10. 2026 |
| 3 | Ochrana súkromia, čl. 9 – Marketingové cookies | Meta Pixel – remarketing a meranie konverzií. Aktivujú sa iba po vašom súhlase. | Meta Pixel – remarketing a meranie konverzií. Klaviyo – rozpoznanie odberateľa newslettera, ktorý prišiel z nášho e-mailu, a pripomenutie košíka. Aktivujú sa iba po vašom súhlase. | význam | zapracované, majiteľ potvrdil 15. 10. 2026 |
| 4 | Cookies – tabuľka cookies | – | Nový riadok `__kla_id` (Klaviyo, marketingové): rozpoznanie odberateľa newslettera, ktorý prišiel z odkazu v našom e-maile, a záznam vloženia dekoru do košíka pre pripomenutie košíka (len so súhlasom); do 2 rokov, Safari a Firefox platnosť skracujú na dni až týždne | význam | zapracované, majiteľ potvrdil 15. 10. 2026 |
| 5 | Cookies – marketingové cookies a tretie strany | … remarketing a zobrazovanie relevantnejších reklamných kampaní. / zoznam tretích strán bez Klaviyo | … a na rozpoznanie odberateľa newslettera, ktorý prišiel z nášho e-mailu (pripomenutie košíka). / Klaviyo – newsletter a automatické e-maily, rozpoznanie odberateľa newslettera na webe pre pripomenutie košíka | význam | zapracované, majiteľ potvrdil 15. 10. 2026 |
| 6 | Cookies – tabuľka cookies | – | Nový riadok `__kla_off` (Orostone, nevyhnutné): cookie – záznam, že ste marketingové cookies odmietli alebo súhlas odvolali, aby Klaviyo na webe nesledovalo; nastaví sa len vtedy, ak už Klaviyo na webe bežalo; 1 rok | význam | zapracované po Codex review (P1: odvolanie súhlasu musí Klaviyo vypnúť). Opisuje technickú cookie, ktorou web pri odvolaní súhlasu vypína sledovanie Klaviya; nový záväzok nepridáva. Majiteľovi oznámené 15. 10. 2026 |

## Kolo 6 – zásady: zľavový kód v pripomenutí nedokončeného nákupu, PR #149 (15. 10. 2026)

Vecná zmena z rozhodnutia majiteľa z 15. 10. 2026. Pripomenutie nedokončeného nákupu zo Shopify (Kolo 4) bude obsahovať zľavový kód 10 % na dokončenie nákupu cez e-shop a e-mail vysvetlí podmienky zľavy. Majiteľ 15. 10. 2026 doslovne: „ako to mam spravit, že nakup nebol doknčeny a poslat 10% zlavovy kod ked bude objednvka spracovna cez eshop, a vysveltit to aj tomu zakaznikovi v emiale, lebo pride mi zbytocne posielat len emial ze nakup nebol dokonceny ale treba ho motivovat to kupit“. Predpoklad z Kola 4 „bez zľavy“ tým pre pripomenutie nedokončeného nákupu neplatí. Ostatné predpoklady ostávajú (jeden e-mail, len tovar z pokladne, odkaz na odhlásenie, samostatná veta o práve namietať). Podmienky zľavy musí e-mail uviesť jasne (§ 4 ods. 5 zákona č. 22/2004 Z. z.): výška, platnosť len pri objednávke cez e-shop, jedno použitie na zákazníka a či sa dá kombinovať s inými zľavami. Kolo nadväzuje na Kolo 5 (PR #148).

| # | Dokument | Pôvodný text | Nový text | Typ | Stav |
|---|---|---|---|---|---|
| 1 | Ochrana súkromia, čl. 2 – Pripomenutie nedokončeného nákupu | … a s odkazom na dokončenie nákupu. | … a s odkazom na dokončenie nákupu. E-mail môže obsahovať aj zľavový kód na dokončenie tohto nákupu. | význam | zapracované, majiteľ rozhodol 15. 10. 2026 |

## Kolo 7 – zásady: uvítacia zľava pre nových odberateľov, PR #??? (15. 10. 2026)

Vecná zmena z rozhodnutia majiteľa z 15. 10. 2026. Každý nový odberateľ newslettera dostane v uvítacom e-maile dva zľavové kódy: VITAJTE (doprava prvej vzorky zadarmo) a WELCOME5 (5 % zľava na platne). Každý kód platí raz na zákazníka a len pri objednávke v e-shope orostone.sk; WELCOME5 sa nedá kombinovať s inými zľavami. Na webe pribudol druhý pop-up „5 % na kameň“ (`components/UI/DiscountPopup.tsx`), ktorý podmienky zľavy uvádza pri formulári. Majiteľ 15. 10. 2026 doslovne: „teda ano sprav aj toto: Zľava 5 % za prihlásenie na newsletter (odporúčam). … Do zásad stačí jedna veta o zľave pre nových odberateľov.“ Kolo nadväzuje na Kolo 6 (PR #149).

| # | Dokument | Pôvodný text | Nový text | Typ | Stav |
|---|---|---|---|---|---|
| 1 | Ochrana súkromia, čl. 3 – Newsletter | … odber newslettera nebude možný. | … odber newslettera nebude možný. Novým odberateľom newslettera pošleme v uvítacom e-maile zľavové kódy na dopravu prvej vzorky zadarmo a na 5 % zľavu na platne; každý z nich možno použiť raz. | význam | zapracované, majiteľ rozhodol 15. 10. 2026 |
