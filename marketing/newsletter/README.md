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

| # | E-mail | Kam patrí | Predmet | Stav |
|---|---|---|---|---|
| 01 | Vitajte | Welcome 1/4 – hneď po prihlásení | Vitajte v Orostone. Toto vám budeme posielať | čaká na kontrolu |
| 02 | List od Mariána | Welcome 2/4 – o 2 dni | Krátky list namiesto reklamy | čaká na kontrolu, potom ho prepíše Marián |
| 07 | Ako vybrať dekor | Welcome 3/4 – o 5 dní | Tri otázky pred výberom dekoru | čaká na kontrolu |
| 05 | Vzorka je doma | Vzorky 2/3 – 2 dni po doručení | Vzorka je doma. Skúste s ňou 4 veci | čaká na kontrolu |
| 08 | Hotovo | Po realizácii 1/4 – deň montáže | Hotovo: fotky z vašej montáže | čaká na kontrolu |
| 06 | Ako sa vám žije | Po realizácii 3/4 – 30 dní po montáži | Ako sa vám žije s novou doskou? | čaká na kontrolu |
| 03 | Realizácia mesiaca | Kampaň, 1× mesačne | Taj Mahal na dlhom ostrovčeku s drezom | čaká na kontrolu a fakty [ ] |
| 04 | Dekor v detaile | Kampaň, 1× mesačne | Roman Travertine: travertín bez impregnácie | čaká na kontrolu |

Program newslettera, typy e-mailov a kalendár sú v skille `orostone-newsletter` (`references/program-a-typy.md`).
Vizuálne pravidlá e-mailu sú v skille `orostone-kreativy` (`references/newsletter-vizual.md`).

## Zástupné texty

- `[v hranatých zátvorkách]` – doplní Marián pred odoslaním (lokalita, citát klienta, dátum montáže…).
- Obrázky sa načítavajú z `https://orostone.sk/images/email/`. Pred prvým odoslaním ich treba nahrať na web.
- Odkaz na odhlásenie a ďalšie premenné doplní rozosielací nástroj.
