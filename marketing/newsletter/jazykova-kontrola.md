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

Ďalšie kolo pridajte ako novú sekciu s rovnakou tabuľkou.
