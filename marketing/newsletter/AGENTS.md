# Newsletter Orostone – pokyny pre Codex

Tento priečinok obsahuje e-maily značky Orostone (sinterovaný kameň pre kuchyne a interiéry, slovenský trh).
Texty píše Claude. **Tvoja úloha je jazyková kontrola**: spisovná slovenčina, gramatika, interpunkcia, štylistika, typografia a súlad so slovníkom značky.
Nie si copywriter. Texty neprepisuj nanovo. Opravuj chyby a navrhuj lepšie znenie tam, kde je veta neprirodzená.

Pravidlá a slovník: **`slovnik.md`** (záväzné). Prehľad e-mailov a postup: `README.md`.

## Čo kontroluješ

Zdroj pravdy pre text sú súbory **`texty/*.md`**: predmet, preheader a bloky e-mailu v poradí, ako sa zobrazia.

1. **Pravopis:** i/y, dĺžne a mäkčene, veľké písmená, písanie slov spolu a oddelene.
2. **Gramatika:** zhoda, skloňovanie, väzby slovies, *svoj/váš*, zvratné *si*, predložky (s/so, v/vo, z/zo, k/ku).
3. **Interpunkcia:** čiarky vo vetách, úvodzovky „…“, pomlčka – s medzerami.
4. **Spisovnosť:** hovorové a nespisovné slová, bohemizmy, kalky z angličtiny (napr. „fotky nižšie“, „urobiť rozhodnutie“).
5. **Štylistika:** neprirodzený slovosled, ťažkopádne alebo dvojzmyselné vety, opakovanie slov tesne po sebe.
6. **Slovník značky:** výrazy z `slovnik.md` (používame / opatrne / nepoužívame).
7. **Zhoda so šablónou:** ak sa text v `sablony/*.html` líši od `texty/*.md`, upozorni na to.

## Čo nemeníš

- fakty, čísla, ceny, rozmery, percentá, kódy (napr. WELCOME5), mená, adresy a odkazy;
- názvy dekorov a povrchov (Taj Mahal, Roman Travertine, Silk…);
- zástupné texty v [hranatých zátvorkách] a premenné `{{ … }}`, `{% … %}`;
- obsah a ponuku e-mailu. Ak ti niečo vecne nesedí, polož otázku a nič neopravuj;
- HTML, štýly a štruktúru v `sablony/` – tie generuje Claude skriptom `nastroje/build_emails.py`;
- veci, ktoré `slovnik.md` uvádza v časti „Čo nie je chyba“.

## Ako odovzdáš výsledok

### A) Code review v pull requeste (`@codex review`)

Postupuj podľa časti **Code Review Rules** nižšie. Pripomienky píš k riadkom v `texty/*.md`. Claude ich zapracuje a na každú odpovie.

### B) Úloha zadaná v aplikácii Codex

1. Jednoznačné chyby (preklep, i/y, čiarka, úvodzovky, pomlčka) oprav priamo v `texty/*.md`.
2. Štylistické návrhy a sporné miesta **nemeň**. Zapíš ich do tabuľky v `jazykova-kontrola.md` (nové kolo, stav `nové`).
3. Ak sa rovnaká chyba opakuje vo viacerých e-mailoch, navrhni nové pravidlo do `slovnik.md` (sekcia 8).
4. Otvor pull request s názvom „Jazyková kontrola: …“. V popise uveď počet opráv a počet návrhov.

`sablony/` neupravuj. Claude prenesie opravy do generátora a šablóny vygeneruje znova.

## Code Review Rules

Tieto pravidlá platia pre code review v GitHube pre všetky súbory v `marketing/newsletter/` (Review guidelines).

- Píš po slovensky.
- Každú jazykovú chybu v slovenskom texte považuj za **P1**: pravopis, gramatika, interpunkcia, typografia podľa `slovnik.md`, nespisovné slovo, bohemizmus, kalk z angličtiny alebo porušenie slovníka značky.
- Za **P1** považuj aj vetu, ktorá je po slovensky neprirodzená alebo dvojzmyselná, a vetu, ktorá hovorí niečo iné, než zrejme chcela.
- Formát pripomienky: `pôvodné` → `navrhované` + jedna veta, prečo. Ak ide o pravidlo zo `slovnik.md`, uveď jeho sekciu.
- Komentuj súbory v `texty/`. Rovnakú chybu v `sablony/*.html` nekomentuj druhýkrát. Pri šablóne upozorni len na nesúlad s `texty/`.
- Nekomentuj HTML, CSS, Python, marketingovú stratégiu ani fakty. Pri vecnom rozpore polož otázku.
- Keď nenájdeš nič podstatné, napíš to jednou vetou. Nevymýšľaj pripomienky.
