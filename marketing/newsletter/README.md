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
```

## E-maily

Stav: **skontrolované** = prešlo kontrolou Claude aj Codexom · **na kontrole** = text sa zmenil a čaká na Codex. Za čiarkou je, čo ešte treba urobiť pred odoslaním.

| # | E-mail | Kam patrí | Predmet | Stav |
|---|---|---|---|---|
| 01 | Vitajte | Welcome 1/4 – hneď po prihlásení | Vitajte v Orostone. Toto vám budeme posielať | skontrolované, v Shopify treba vytvoriť kód VITAJTE |
| 02 | List od Mariána | Welcome 2/4 – o 2 dni | Dve chyby, ktoré vidím pri výbere dosky | skontrolované, Marián list schválil |
| 07 | Ako vybrať dekor | Welcome 3/4 – o 5 dní | Tri otázky pred výberom dekoru | skontrolované |
| 09 | Tri kuchyne | Welcome 4/4 – o 9 dní | Tri kuchyne, tri rôzne rozhodnutia | skontrolované |
| 05 | Vzorka je doma | Vzorky 2/4 – 2 dni po doručení | Vzorka je doma. Skúste s ňou 4 veci | skontrolované |
| 10 | Veľká plocha | Vzorky 3/4 – 7 dní po doručení | Ako váš dekor vyzerá vo veľkej ploche | skontrolované |
| 11 | Marián (čistý text) | Vzorky 4/4 – 14 dní po doručení | Pomôžem vám s výberom? | skontrolované |
| 12 | Ako čítať ponuku | Dopyt → ponuka 2/4 – deň po ponuke | Ako čítať cenovú ponuku | skontrolované |
| 13 | Showroom | Dopyt → ponuka 3/4 – 5 dní po ponuke | Pozrite si platne naživo | skontrolované |
| 14 | Marián (čistý text) | Dopyt → ponuka 4/4 – 14 dní po ponuke | Je niečo, čo vám bráni rozhodnúť sa? | skontrolované |
| 15 | Košík | Opustený košík 1/2 – o hodinu | Vaša vzorka zostala v košíku | skontrolované |
| 16 | Marián (čistý text) | Opustený košík 2/2 – o deň | Váhate medzi dekormi? | skontrolované |
| 08 | Hotovo | Po realizácii 1/4 – deň montáže | Hotovo: fotky z vašej montáže | skontrolované |
| 17 | Starostlivosť | Po realizácii 2/4 – 7 dní po montáži | Starostlivosť o dosku v skratke | skontrolované |
| 06 | Ako sa vám žije | Po realizácii 3/4 – 30 dní po montáži | Ako sa vám žije s novou doskou? | skontrolované |
| 03 | Realizácia mesiaca | Kampaň október | Taj Mahal na dlhom ostrovčeku s drezom | skontrolované |
| 04 | Dekor v detaile | Kampaň október | Roman Travertine: travertín bez impregnácie | skontrolované |
| 18 | Zo zákulisia | Kampaň november | Ako vzniká sinterovaný kameň | skontrolované |
| 19 | Sprievodca | Kampaň november | Čo je v cene pracovnej dosky | skontrolované |
| 20 | Realizácia mesiaca | Kampaň december | Biela doska a tmavé drevo | skontrolované, klient so zverejnením súhlasí |
| 21 | Poďakovanie | Kampaň december | Ďakujeme za rok 2026 | skontrolované |

**Ešte nenapísané (plán na rok 2027):** Po realizácii 4/4 (tip po 6 mesiacoch), Výročie, Reaktivácia (3 e-maily), B2B (3 e-maily), kampane január – marec (6 e-mailov). Potvrdenie objednávky vzorky posiela Shopify a potvrdenie dopytu web, tie netreba písať.

Program newslettera, typy e-mailov a kalendár sú v skille `orostone-newsletter` (`references/program-a-typy.md`).
Vizuálne pravidlá e-mailu sú v skille `orostone-kreativy` (`references/newsletter-vizual.md`).

## Zástupné texty

- `[v hranatých zátvorkách]` – doplní sa pred odoslaním. Dnes ich má len e-mail 08 (meno, dátum montáže, dekor – pre každého zákazníka iné).
- Realizácia mesiaca (03, 20) uvádza len fakty z fotiek a zo stránky Realizácie. Lokalitu, kamenára a citát klienta doplníme, keď ich Marián potvrdí (citát len so súhlasom klienta).
- Uvítacia odmena je **prvá vzorka bez poštovného**, kód `VITAJTE` (rozhodnutie 7. 10. 2026, nahrádza WELCOME5). Kód musí v Shopify existovať skôr, než ho e-mail sľúbi.
- Fotky vybral Martin 7. 10. 2026 v troch kolách. Zábery výroby v 18 sú ilustračné (Higgsfield) a vychádzajú z fotiek skutočných fabrík na sinterovaný kameň. Kaštieľ v 13 je skutočná fotka z titulnej stránky webu.
- Obrázky sú v `public/images/email/` a web ich zverejní na `https://orostone.sk/images/email/`. Nový obrázok pridajte do tohto priečinka (JPG, dvojnásobná šírka oproti zobrazeniu, najviac okolo 150 KB).
- Odkaz na odhlásenie a ďalšie premenné doplní rozosielací nástroj.
