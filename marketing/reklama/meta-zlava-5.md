# Meta reklama: zľava 5 % na platne (retargeting)

Podklad na nastavenie reklamy na Facebooku a Instagrame. Stav k 15. 10. 2026: **nič nie je spustené ani vytvorené v Ads Manageri.** Kampaň spúšťa len Martin a rozpočet určuje on. O načítaní Pixelu bez odpovede na lištu cookies Martin rozhodol 15. 10. 2026 (časť Rozhodnuté).

Súvisí s rozhodnutiami Martina z 15. 10. 2026: popup B „5 % na váš kameň“ (kód WELCOME5) a uvítací e-mail 01, v ktorom každý nový odberateľ webu dostane oba kódy, VITAJTE aj WELCOME5. Správanie popupu B je opísané podľa vetvy `claude/popup-zlava5`.

## 1. Cieľ a ponuka

**Cieľ:** priviesť späť ľudí, ktorí boli na orostone.sk za posledných 30 dní, a získať ich ako odberateľov newslettera. Kód WELCOME5 im potom pomôže dokončiť objednávku platní.

**Ponuka v reklame:** zľava 5 % na platne vášho dekoru. Kód WELCOME5 sa po prihlásení na newsletter v popupe B ukáže na obrazovke a novému odberateľovi príde aj e-mailom spolu s VITAJTE.

**Vstupná stránka:** detail dekoru s parametrom `ponuka=zlava5`. Popup B sa ukáže 3 s po načítaní, a ak lišta cookies ešte nemá odpoveď, 3 s po odpovedi na ňu. Vo vstavanom prehliadači Facebooku a Instagramu príde lišta takmer vždy, lebo má vlastné úložisko.
- Pravidlo troch dní pre reklamu neplatí. Popup sa ukáže aj tomu, kto ho predtým zavrel, najviac raz za návštevu. V tej istej návšteve sa nezobrazí popup A.
- Len na úvodnej stránke, detaile produktu, v kategórii a v článku blogu. Nikdy na pokladni, stránke poďakovania, `/vzorky`, právnych stránkach a nikdy tomu, koho prehliadač pozná ako odberateľa.
- Ak sa popup B neukáže, rovnaké dva kódy dá prihlásenie v pätičke: uvítací e-mail dostane každý nový odberateľ.

| Variant | Vstupná stránka (`utm_source` je `facebook` alebo `instagram` podľa sady reklám) |
|---|---|
| A | `https://orostone.sk/produkt/appennino?ponuka=zlava5&utm_source=facebook&utm_medium=paid_social&utm_campaign=retargeting-zlava5&utm_content=a-appennino` |
| B | `https://orostone.sk/produkt/roman-travertine?ponuka=zlava5&utm_source=facebook&utm_medium=paid_social&utm_campaign=retargeting-zlava5&utm_content=b-roman-travertine` |
| C | `https://orostone.sk/produkt/wild-forest?ponuka=zlava5&utm_source=facebook&utm_medium=paid_social&utm_campaign=retargeting-zlava5&utm_content=c-wild-forest` |

Všetky tri stránky na produkcii vracajú 200 a ich titulky zodpovedajú dekorom (overené 15. 10. 2026). Neexistujúci dekor od PR #159 vracia 404. `utm_medium=paid_social` zaradí GA4 návštevy do kanála Paid Social.

**Prečo kód v reklame nie je:**
- WELCOME5 je odmena za prihlásenie na newsletter. Vytlačený v reklame by sa šíril bez prihlásenia (zdieľanie, zľavové weby) a reklama by prestala privádzať odberateľov.
- Shopify ho pustí raz na zákazníka. To bráni opakovanému použitiu, nie tomu, aby ho použil ktokoľvek bez prihlásenia.
- Reklama má tak jeden ďalší krok: otvoriť dekor, prihlásiť sa v popupe. Kód sa ukáže v popupe a novému odberateľovi príde e-mailom spolu s VITAJTE.

**Čo reklama nesmie sľúbiť:** zľava platí raz, na platne (12 dekorov), nie na vzorky ani dopravu. Nekombinuje sa s inými zľavami vrátane automatickej 20 % pri 3 a viac platniach, VITAJTE ani KOSIK5. Platí len pri objednávke v e-shope orostone.sk, nie pri objednávke telefonicky ani na cenovú ponuku. Preto píšeme „zľava 5 % na platne“, nikdy „5 % navyše“ ani „na celý nákup“. Podmienky ukáže popup B (krátke znenie z konštanty `SLAB_CODE_TERMS` v `lib/discountPopup.ts`) a uvítací e-mail.

## 2. Publikum

| | Nastavenie |
|---|---|
| **Zahrnúť** | Vlastné publikum z webu: Meta Pixel `712209907542673` (ID z produkčného webu, overené 15. 10. 2026), všetci návštevníci za posledných 30 dní |
| **Vylúčiť** | „Nákup nad 100 €“: udalosť `Purchase` spresnená parametrom `value` väčší ako 100 (EUR), posledných 180 dní |
| **Vylúčiť, ak sa schváli** | Odberatelia newslettera, zoznam Newsletter – web (`VSrLFs`) synchronizovaný z Klaviya. Dnes nie: zásady ochrany súkromia odovzdanie zoznamov nepokrývajú, pozri nižšie. |
| **Vylúčiť (voliteľné)** | Tím Orostone: `PageView` s parametrom `internal_traffic` (web ho posiela pri cookie `orostone_internal`) |
| **Krajina** | Slovensko (ľudia, ktorí tu žijú). Česko rozhodne Martin, pozri nižšie. |
| **Vek** | 25–65 |
| **Rozšírenie publika** | Vypnuté. Advantage+ publikum by reklamu ukázalo aj mimo návštevníkov webu, preto použiť pôvodné možnosti publika. |

Na čo myslieť:
- **Pixel a GA4 sa dnes načítajú aj bez odpovede na lištu cookies.** `context/CookieContext.tsx` má predvolené `analytics: true` a `marketing: true`, kým návštevník na lištu neodpovie, a `hooks/useMetaPixel.ts` kontroluje len `preferences.marketing`. Pixel preto pošle `PageView` asi 5 s po načítaní alebo pri prvej interakcii každému, kto cookies neodmietol. GA4 sa správa rovnako (`hooks/useAnalytics.ts`). Martin to ponechal (PR #148: „Predvolené nastavenie cookies sa nemení (rozhodnutie majiteľa, znova potvrdené 15. 10.)“) a 15. 10. 2026 rozhodol spustiť kampaň s týmto nastavením (časť Rozhodnuté). Publikum „Web 30 dní“ preto obsahuje aj návštevníkov, ktorí na lištu neodpovedali.
- **Veľkosť publika** ukáže Ads Manager po vytvorení. Bude menšia ako návštevnosť: chýbajú tí, čo cookies odmietli alebo odišli skôr, než sa Pixel načítal, a Meta do publík z webu nezaradí ľudí v EÚ, ktorí si zvolili menej prispôsobené reklamy. Pod 100 ľudí Meta reklamu nedoručí. Pri publiku pod 1 000 ľudí treba rozhodnúť, či okno predĺžiť na 60 dní.
- **Prečo `value` > 100 pri vylúčení kupujúcich:** `Purchase` posiela web zo stránky poďakovania (`pages/ThankYou.tsx`) pri platniach aj pri vzorkách. Objednávka vzoriek ho pošle s hodnotou najviac 12,30 € (najviac 3 vzorky) a jej `content_ids` sú handle dekorov, rovnaké ako pri platniach, takže podľa nich sa nákupy nerozlíšia. Najlacnejšia platňa stojí vyše 1 600 €. S podmienkou `value` > 100 ostanú v publiku kupujúci vzoriek, teda najteplejší záujemcovia o zľavu na platne.
- **Vylúčenie kupujúcich je neúplné.** Pixel nevidí nákupy tých, čo cookies odmietli. Serverová záloha (`api/shopify-order-webhook.ts`) posiela nákupy len do GA4. Či Shopify posiela `Purchase` aj cez Conversions API (kanál Facebook & Instagram na tom istom Pixeli), treba overiť v Events Manageri; ak áno, skontrolovať aj tam, že nesie `value`.
- **Odberatelia:** kto už odoberá a v popupe B sa prihlási znova, kód uvidí na obrazovke a popup mu napíše, že nový e-mail mu nepríde (`subscribe-newsletter` vráti `alreadySubscribed` a druhý uvítací e-mail nepošle). Vylúčiť ich odporúčam kvôli rozpočtu: reklama za nich platí, hoci odberateľov nepribudne. Web si stav popupov pamätá len v prehliadači, kde sa človek prihlásil. Vstavaný prehliadač Facebooku a Instagramu má vlastné úložisko, takže odberateľ z reklamy popup B uvidí.
- **Synchronizácia zoznamu z Klaviya do Mety nie je v zásadách ochrany súkromia.** Zásady pri Mete uvádzajú len Meta Pixel, nie odovzdanie e-mailových adries na tvorbu publík. Pred zapnutím synchronizácie treba zásady doplniť (právny text, rozhoduje Martin); dovtedy ostáva vypnutá (kontrola v bode 0 časti 4). Druhá možnosť je udalosť Pixelu pri odbere a vylúčenie podľa nej. Dnes ju neposiela pätička, popup A ani popup B.
- **Česko:** e-shop doručuje platne výlučne na území Slovenska (stránka Doprava a platba). Na začiatok odporúčam len Slovensko.

## 3. Kreatíva

Každý variant ide v troch formátoch. Copy sa riadi skillom `copy-orostone`: najprv hodnota alebo dekor, potom zľava, „sinterovaný kameň“ aspoň v jednom texte každého variantu (§ 7.4), bez výkričníkov, bez falošnej naliehavosti, bez slova luxus. Vizuál sa riadi skillom `orostone-kreativy`.

### Texty

| | A – Appennino | B – Roman Travertine | C – Wild Forest |
|---|---|---|---|
| **Hlavný text** (do 125 znakov, celý viditeľný) | Pracovnú dosku zo sinterovaného kameňa budete denne používať aj vidieť. Za odber newslettera dostanete na platne zľavu 5 %. (123) | Roman Travertine je sinterovaný kameň s kresbou travertínu, bez impregnácie. Za odber newslettera máte na platne zľavu 5 %. (123) | Sinterovaný kameň Wild Forest sa naplno ukáže až vo veľkej ploche. Za odber newslettera dostanete na platne zľavu 5 %. (118) |
| **Nadpis** (FB do 27, IG do 40) | Váš dekor so zľavou 5 % (23) | Roman Travertine, zľava 5 % (27) | Wild Forest so zľavou 5 % (25) |
| **Popis** (do 30) | Pri objednávke na orostone.sk (29) | Kód vám príde e-mailom (22) | Platí pre objednávky v e-shope (30) |
| **Tlačidlo** | Learn more („Zistiť viac“) | Shop now („Nakupovať“) | Learn more („Zistiť viac“) |
| **Text na obrázku**, riadok 1: Montserrat Bold | Pokojná svetlá plocha (21) | Kresba travertínu bez impregnácie (33) | Kresba pre veľkú plochu (23) |
| riadok 2: Montserrat Light Italic | 5 % za odber newslettera (24) | 5 % za odber newslettera (24) | 5 % za odber newslettera (24) |
| **Popisok na obrázku**: Montserrat Light | Vizualizácia s dekorom Appennino | Vizualizácia s dekorom Roman Travertine | Vizualizácia s dekorom Wild Forest |
| **`utm_content`** | `a-appennino` | `b-roman-travertine` | `c-wild-forest` |

- Čísla v zátvorkách sú počty znakov vrátane medzier, prepočítané skriptom 15. 10. 2026. Pred % patrí pevná medzera, aby sa „5 %“ nezalomilo.
- Nadpis nad 27 znakov Facebook v kanáli skráti, Instagram ukáže do 40.
- Slovenské popisy tlačidiel sa riadia rozhraním Mety, vyberá sa z jej zoznamu. „Get offer“ nepoužívať: v slovenčine je to „Získať ponuku“ a číta sa ako cenová ponuka, na ktorú zľava neplatí.
- Popis sa na Instagrame často nezobrazí, preto to, že zľava je za odber newslettera a na platne, hovorí už hlavný text.

### Formáty a bezpečné zóny

| Formát | Rozmer | Kde sa zobrazí | Bez textu a loga | Rozmiestnenie |
|---|---|---|---|---|
| Kanál 4:5 (hlavný) | 1080 × 1350 | FB a IG kanál na mobile | 250 px hore aj dole, 60 px po stranách | logo vpravo hore pod hornou zónou, text v strede ±15 % |
| Kanál 1:1 | 1080 × 1080 | FB kanál na počítači, záloha | 100 px dookola | logo 100–150 px od horného okraja |
| Stories a Reels 9:16 | 1080 × 1920 | FB a IG Stories a Reels | 270 px hore, 670 px dole, 65 px po stranách | logo 300–400 px od horného okraja, text v strednej osi, pod 1250 px nič |

Pre Stories aj Reels platí jedna kreatíva navrhnutá podľa prísnejšej zóny Reels. Tlačidlo dopĺňa Meta, na obrázok sa nekreslí.

### Obrázky (súbory overené v repozitári 15. 10. 2026)

| Variant | 4:5 a 9:16 | 1:1 |
|---|---|---|
| A | `public/images/kuchyne/appennino-zboku-1440.webp` (1440 × 1920) | `public/images/kuchyne/appennino-spredu-1920.webp` (1920 × 1280) |
| B | `public/images/kuchyne/roman-travertine-zboku-1440.webp` (1440 × 1920) | `public/images/kuchyne/roman-travertine-hrana-1440.webp` (1440 × 1440, detail kresby) |
| C | `public/images/kuchyne/wild-forest-zboku-1440.webp` (1440 × 1920) | `public/images/kuchyne/wild-forest-spredu-1920.webp` (1920 × 1280, celý ostrovček) |

- Výrezy bez zväčšovania: 4:5 = výrez 1440 × 1800 zmenšený na 1080 × 1350; 9:16 = výrez 1080 × 1920 z toho istého súboru; 1:1 = výrez 1280 × 1280 (alebo celý štvorec 1440 × 1440) zmenšený na 1080 × 1080.
- Logo: `public/images/orostone-logo-main.svg` (vektor), na tmavom podklade `public/images/email/orostone-logo-white.png`. Najviac 30 % šírky (324 px).
- Súbory v `public/images/kuchyne/` sú vizualizácie z Higgsfieldu so skutočným dekorom (`data/pillars/kuchyne.ts`). V reklame ich nevolajte realizácia ani kuchyňa klienta a označte ich popiskom (Pravidlá vizuálu).
- Nepoužívať: `public/images/email/kosik-zlava-5-*.jpg` (1040 px, patria k e-mailu s kódom KOSIK5), `public/images/vzorky/*.webp` (400 px), `public/images/home/dekory/*.webp` (520 px).
- **Popup B má jednu fotku pre všetky varianty:** `/images/kuchyne/roman-travertine-hrana` s popiskom „Vizualizácia s dekorom Roman Travertine“ (konštanta `DISCOUNT_POPUP_IMAGE` v `lib/discountPopup.ts`). Pri variante B nadväzuje na reklamu, pri A a C nie; to zatiaľ akceptujeme. Keď príde finálna grafika z Higgsfieldu, dá sa konštanta vymeniť. Fotka podľa dekoru vstupnej stránky by bola zmena kódu popupu.

### Pravidlá vizuálu

- Text najviac 20 % plochy, žiadne VEĽKÉ PÍSMENÁ vo vetách, žiadny výkričník a žiadny kód na obrázku.
- Každý obrázok nesie malý popisok „Vizualizácia s dekorom Appennino / Roman Travertine / Wild Forest“ (Montserrat Light, asi 22–26 px, vnútri bezpečnej zóny, nie je súčasťou dvoch riadkov textu), ako vyžaduje `STYLE_GUIDE.md` › Photos. Meta môže pri obrázkoch z AI nástrojov sama pridať označenie „AI info“ (podľa metadát súboru).
- Písmo len Montserrat. Paleta: `#1A1A1A`, `#F9F9F7`, `#F5F5F0`, jediný akcent zlatá `#ECD488`. Zlatý text len na tmavom podklade (graphite pás alebo tmavý prechod cez fotku), nikdy na svetlom.
- Export PNG (ostrý text). Pred odovzdaním prejsť checklist zo skillu `orostone-kreativy`.

## 4. Postup v Meta Ads Manageri

Celý postup končí uložením konceptu. Zverejniť (Publish) môže len Martin.

**0. Pred spustením musí platiť všetko:**
- Popup B je na produkcii a reaguje na `?ponuka=zlava5`. V tej istej návšteve sa nezobrazí popup A.
- WELCOME5 je v Shopify aktívny s dohodnutými podmienkami.
- Uvítací e-mail 01 s oboma kódmi beží v Klaviyu a záložné odoslanie (`send-newsletter-welcome`) je nasadené z `main`. Predmet oboch: „Vitajte v Orostone. Posielame vaše dva uvítacie kódy“.
- Veta o zľave pre nových odberateľov je v zásadách ochrany súkromia na produkcii.
- Martin v Klaviyu › Integrations › Meta Ads overil, že nebeží synchronizácia žiadneho zoznamu ani segmentu do publík Mety (zásady ochrany súkromia odovzdanie zoznamov nepokrývajú), a nechal ju vypnutú.
- Martin v Events Manageri (zdroje udalostí) overil, či Shopify posiela `Purchase` cez Conversions API (časť 2).
- Test na mobile, vo vstavanom prehliadači Instagramu aj Facebooku: lišta cookies, po 3 s popup B, prihlásenie, kód na obrazovke, e-mail s oboma kódmi, WELCOME5 v pokladni pri jednej platni. Potom s e-mailom, ktorý už odoberá: kód na obrazovke a veta, že nový e-mail nepríde.

**1. Publiká** (Publiká → Vytvoriť publikum → Vlastné publikum → Webová stránka, zdroj Pixel `712209907542673`):
- „Web 30 dní“: všetci návštevníci webovej stránky, 30 dní.
- „Nákup nad 100 € 180 dní“: udalosť `Purchase`, spresniť parametrom `value` väčší ako 100, 180 dní (prečo, pozri časť 2).
- Voliteľne „Tím Orostone“: `PageView` spresnené parametrom `internal_traffic`.
- „Newsletter – web (Klaviyo)“ len po rozhodnutí podľa časti 2.

**2. Kampaň:** cieľ **Návštevnosť** (Traffic), názov „Retargeting – zľava 5 % (WELCOME5)“, bez osobitnej kategórie reklám, rozpočet na úrovni kampane (Advantage+ campaign budget).

Prečo Návštevnosť a nie Predaj:
- Optimalizácia na nákup potrebuje desiatky udalostí `Purchase` týždenne. Platne sa kupujú zriedka a Pixel vidí len časť nákupov.
- Odber newslettera Pixel nezaznamenáva (ani v popupe B), takže sa naň nedá optimalizovať.
- Pri malom publiku rozhoduje najmä frekvencia, nie algoritmus.

K cieľu Predaj (optimalizácia na odber alebo nákup) sa oplatí vrátiť, keď web bude posielať udalosť odberu a bude jej dosť.

**3. Sady reklám:** dve, líšia sa len platformou, aby `utm_source` bol `facebook` alebo `instagram`.
- Miesto konverzie Webová stránka. Cieľ výkonu: Maximalizovať počet zobrazení vstupnej stránky (počíta sa len vtedy, keď sa Pixel na stránke načíta; nevadí to).
- Publikum podľa časti 2, rozšírenie publika vypnuté.
- Umiestnenia ručne. Sada „Facebook“: kanál, Stories, Reels. Sada „Instagram“: kanál, Stories, Reels, Preskúmať.
- Vypnúť: Audience Network, Messenger, Threads, pravý stĺpec, Marketplace, vyhľadávanie a in-stream videá.
- Jednoduchšia možnosť: jedna sada s `utm_source={{site_source_name}}`. Meta vtedy vloží `fb` alebo `ig` namiesto `facebook` a `instagram`, s tým treba počítať v prehľadoch GA4.

**4. Reklamy:** v každej sade tri reklamy (A, B, C), jeden obrázok, prispôsobenie podľa umiestnenia:
- 4:5 pre kanály, 9:16 pre Stories a Reels, 1:1 ako záloha.
- Webová stránka: `https://orostone.sk/produkt/<dekor>`. Do poľa Parametre URL vložiť celý reťazec, `<variant>` podľa tabuľky textov:
  - sada Facebook: `ponuka=zlava5&utm_source=facebook&utm_medium=paid_social&utm_campaign=retargeting-zlava5&utm_content=<variant>`
  - sada Instagram: `ponuka=zlava5&utm_source=instagram&utm_medium=paid_social&utm_campaign=retargeting-zlava5&utm_content=<variant>`
- Zobrazený odkaz: `orostone.sk`. Sledovanie: Pixel zapnutý.
- **Vypnúť všetky vylepšenia Advantage+ kreatívy** (úpravy textu, prekrytia, hudba, animácia, rozšírenie obrázka) aj **reklamy viacerých inzerentov**. Inak Meta pridá text, ktorý neprešiel kontrolou značky.

**5. Kontrola:** náhľad každého umiestnenia (text a popisok mimo zakrytých zón), odkaz otvoriť z náhľadu na mobile. Potom **Uložiť ako koncept** a poslať Martinovi.

### Rozpočet (NÁVRH, rozhoduje Martin)

- Rozpočet sa odvíja od veľkosti publika, ktorú Ads Manager ukáže až po vytvorení publika: týždenný rozpočet ≈ počet ľudí × cieľová frekvencia × CPM / 1 000.
- Pri frekvencii 2 za týždeň a CPM 6 € (orientačný odhad, nie údaj z účtu): 1 000 ľudí ≈ 1,70 € denne, 3 000 ľudí ≈ 5 € denne, 6 000 ľudí ≈ 10 € denne.
- 10 € denne teda až od približne 6 000 ľudí. Pri publiku pod asi 4 000 ľudí by 10 € denne prekročilo strop 3 za 7 dní; medzi 4 000 a 6 000 ľuďmi vyjde frekvencia nad plánované 2.
- Začať podľa vzorca, po 7 dňoch upraviť podľa skutočnej frekvencie a CPM v Ads Manageri.

### Frekvencia, obmena, harmonogram

- **Frekvencia:** pevný strop pri cieli Návštevnosť Meta neponúka (len pri cieli Povedomie s cieľom výkonu Dosah, overte v rozhraní). Frekvenciu preto drží rozpočet. Cieľ je 1,5–2,5 zobrazenia za 7 dní. Pri viac ako 3 za 7 dní alebo 6 za 30 dní znížiť rozpočet.
- **Obmena:** pri malom publiku každé 2–3 týždne, alebo keď CTR klesne o viac ako 20 % oproti prvému týždňu. Najprv vymeniť nadpis alebo text na obrázku, potom fotku.
- **Harmonogram:** spustiť až po splnení bodu 0, bez dátumu konca. Prvá kontrola po 7 dňoch, rozhodnutie po 14 dňoch (skôr sa nevyhodnocuje, Meta sa učí). Rozvrh hodín nenastavovať: pri dennom rozpočte nejde a publikum je malé.

## 5. Voliteľne: remarketing v Google Ads

Nie je súčasťou tohto zadania. Ak by sa Martin rozhodol, treba:
- **Kampaň Display** s publikom „návštevníci orostone.sk za 30 dní“ v režime Zacielenie, nie Pozorovanie. Performance Max nie je čistý remarketing: publikum berie len ako signál a míňa aj na nových ľudí.
- **Zber publika:** prepojiť GA4 (`G-W3ZPVYZ9HQ`) s Google Ads a zapnúť signály pre personalizovanú reklamu, alebo pridať značku Google Ads do GTM (`GTM-WVQWKLMZ`). Či ju GTM už má, v repozitári nevidno, treba overiť v GTM.
- **Pozor na GTM:** `index.html` ho načíta na každej stránke 2 s po načítaní alebo pri prvej interakcii, bez ohľadu na súhlas a bez predvoleného stavu súhlasu (`gtag('consent', 'default', …)` nastaví až `hooks/useAnalytics.ts`, neskôr a predvolene „granted“). Značka Google Ads v GTM by sa spustila pred súhlasom. Naživo môže ísť len s kontrolou súhlasu (`ad_storage`, `ad_user_data`) a až keď sa pred načítaním GTM nastaví predvolené „denied“.
- **Súhlas:** web posiela `ad_storage`, `ad_user_data` a `ad_personalization` podľa marketingových cookies a GA4 načíta podľa analytických (`hooks/useAnalytics.ts`). Oboje je predvolene zapnuté, kým návštevník na lištu neodpovie (časť 2), hoci zásady ochrany súkromia píšu, že sa Google Analytics „aktivuje iba po súhlase“. Rozhodnutie z 15. 10. 2026 (časť Rozhodnuté) sa týka Meta Pixelu; o Google Ads by Martin rozhodol zvlášť. Remarketing cez Google Ads zásady už uvádzajú.
- **Veľkosť:** Display potrebuje aspoň 100 aktívnych používateľov za 30 dní.
- **Kreatívy:** responzívna obsahová reklama. Obrázky 1200 × 628 a 1200 × 1200, logo 1200 × 1200, krátke nadpisy do 30 znakov, dlhý nadpis a popisy do 90 znakov. Texty prevziať z variantov A–C.
- **Odkaz:** vstupná stránka s `?ponuka=zlava5`. Atribúciu rieši automatické označovanie (gclid), UTM netreba.

## 6. Meranie

| Kde | Čo sledovať | Pozor |
|---|---|---|
| **GA4** | Prehľady → Akvizícia → Akvizícia návštevnosti, kampaň relácie `retargeting-zlava5`. Varianty porovná dimenzia s `utm_content`. Udalosti `sign_up` a `purchase` v týchto reláciách. Popup B posiela `sign_up` s `method: newsletter_popup_zlava5` a parametrom `offer_source` (`reklama` pri návšteve z reklamy, inak `web`). Popup A posiela `method: newsletter_popup`. | Len návštevníci, ktorí analytické cookies neodmietli (predvolene zapnuté, časť 2). `offer_source` treba v GA4 zaregistrovať ako vlastnú dimenziu (rozsah udalosť), inak ho prehľady neukážu. |
| **Shopify** | Zľavy → WELCOME5: počet použití. Analytika → Prehľady → Predaj podľa zľavy. | Počet zahŕňa všetkých nových odberateľov z akéhokoľvek formulára, nielen ľudí z reklamy. UTM do objednávky prenáša web len pri košíku platní (`context/CartContext.tsx`). |
| **Klaviyo** | Segment s vlastnosťou `zdroj_odberu` = `popup_zlava5_reklama` (popup B v návšteve z reklamy) a pre porovnanie `popup_zlava5` (popup B mimo reklamy). Rast zoznamu Newsletter – web. | `subscribe-newsletter` zapisuje `zdroj_odberu` len novému profilu, preto je počet dolný odhad. Nezávisí od súhlasu s cookies. |
| **Meta** | Dosah, frekvencia, CTR (odkaz), zobrazenia vstupnej stránky a cena za ne, porovnanie A, B, C. | Nákupy v Mete sú len orientačné: Pixel ich posiela zo stránky poďakovania, aj pri vzorkách. Či prichádzajú aj cez Conversions API zo Shopify, overiť v Events Manageri. Popup B Mete žiadnu udalosť neposiela. |

**Výsledok po 14 dňoch:** cena za odberateľa z reklamy = útrata ÷ počet nových profilov so `zdroj_odberu` = `popup_zlava5_reklama` (Klaviyo). Pre kontrolu `sign_up` s `offer_source` = `reklama` v GA4. K tomu objednávky s WELCOME5 a víťazný variant na ďalšiu obmenu.

## Rozhodnuté

**Pixel bez odpovede na lištu cookies (Martin, 15. 10. 2026).** Kampaň ide so súčasným nastavením: Pixel sa načíta aj vtedy, keď návštevník na lištu cookies ešte neodpovedal (časť 2). Veta v zásadách ochrany súkromia „Meta Pixel sa aktivuje iba po vašom súhlase s marketingovými cookies.“ (`pages/PrivacyPolicy.tsx`) ostáva bez zmeny. Riziko berie na seba majiteľ. Martinove slová: „ano chcem aby sa meta pixel nacital aj bez suhlasu, nemen to je to na moje triskko“ a k vete v zásadách „nechaj tak tu vetu nemen“.

## Na rozhodnutie pre Martina

1. Rozpočet podľa veľkosti publika (vzorec v časti 4; 10 € denne až od približne 6 000 ľudí) a dátum spustenia po splnení bodu 0.
2. Česko áno alebo nie (platne doručujeme len na Slovensku, odporúčam nie).
3. Vylúčenie odberateľov: doplniť zásady a potom synchronizovať zoznam z Klaviya, alebo udalosť Pixelu pri odbere (zmena webu), alebo zatiaľ bez vylúčenia.
4. Dve sady reklám (`utm_source` = `facebook` / `instagram`), alebo jedna sada s `{{site_source_name}}` (`fb` / `ig`).
5. Pri publiku pod 1 000 ľudí predĺžiť okno z 30 na 60 dní.
