# Meta reklama: zľava 5 % na váš dekor (retargeting)

Podklad na nastavenie reklamy na Facebooku a Instagrame. Stav k 15. 10. 2026: **nič nie je spustené ani vytvorené v Ads Manageri.** Kampaň spúšťa len Martin a rozpočet určuje on.

Súvisí s rozhodnutím Martina z 15. 10. 2026: popup B „5 % na kameň“ (kód WELCOME5) a uvítací e-mail, v ktorom každý nový odberateľ dostane oba kódy, VITAJTE aj WELCOME5.

## 1. Cieľ a ponuka

**Cieľ:** priviesť späť ľudí, ktorí boli na orostone.sk za posledných 30 dní, a získať ich ako odberateľov newslettera. Kód WELCOME5 im potom pomôže dokončiť objednávku platní.

**Ponuka v reklame:** „5 % zľava na váš dekor“. Kód človek dostane za prihlásenie na newsletter v popupe B a príde mu e-mailom.

**Vstupná stránka:** detail dekoru s parametrom `ponuka=zlava5`. Ten zobrazí popup B 3 s po načítaní aj bez pravidla troch dní. Odberateľom ani na pokladni a právnych stránkach sa popup nezobrazí.

| Variant | Vstupná stránka (`utm_source` je `facebook` alebo `instagram` podľa sady reklám) |
|---|---|
| A | `https://orostone.sk/produkt/appennino?ponuka=zlava5&utm_source=facebook&utm_medium=paid_social&utm_campaign=retargeting-zlava5&utm_content=a-appennino` |
| B | `https://orostone.sk/produkt/roman-travertine?ponuka=zlava5&utm_source=facebook&utm_medium=paid_social&utm_campaign=retargeting-zlava5&utm_content=b-roman-travertine` |
| C | `https://orostone.sk/produkt/wild-forest?ponuka=zlava5&utm_source=facebook&utm_medium=paid_social&utm_campaign=retargeting-zlava5&utm_content=c-wild-forest` |

Všetky tri stránky odpovedajú 200 (overené 15. 10. 2026). `utm_medium=paid_social` zaradí GA4 návštevy do kanála Paid Social.

**Prečo kód v reklame nie je:**
- WELCOME5 je odmena za prihlásenie na newsletter. Vytlačený v reklame by sa šíril bez prihlásenia (zdieľanie, zľavové weby) a reklama by prestala privádzať odberateľov.
- Shopify ho pustí raz na zákazníka. To bráni opakovanému použitiu, nie tomu, aby ho použil ktokoľvek bez súhlasu.
- Reklama má tak jeden ďalší krok: otvoriť dekor, prihlásiť sa v popupe. Kód príde e-mailom spolu s VITAJTE.

**Čo reklama nesmie sľúbiť:** zľava platí na platne (12 dekorov), nie na vzorky ani dopravu. Nekombinuje sa s inými zľavami vrátane automatickej 20 % pri 3 a viac platniach, VITAJTE ani KOSIK5. Platí len pri objednávke v e-shope orostone.sk, nie pri objednávke telefonicky ani na cenovú ponuku. Preto píšeme „zľava 5 % na platne“, nikdy „5 % navyše“ ani „na celý nákup“. Podmienky ukáže popup B a uvítací e-mail.

## 2. Publikum

| | Nastavenie |
|---|---|
| **Zahrnúť** | Vlastné publikum z webu: Meta Pixel `712209907542673` (ID z produkčného webu, overené 15. 10. 2026), všetci návštevníci za posledných 30 dní |
| **Vylúčiť** | Nákup (udalosť `Purchase`) za posledných 180 dní |
| **Vylúčiť, ak sa schváli** | Odberatelia newslettera, zoznam Newsletter – web (`VSrLFs`) synchronizovaný z Klaviya (integrácia Meta Ads je v Klaviyu zapnutá, stav 14. 10. 2026). Pozor na zásady ochrany súkromia nižšie. |
| **Vylúčiť (voliteľné)** | Tím Orostone: `PageView` s parametrom `internal_traffic` (web ho posiela pri cookie `orostone_internal`) |
| **Krajina** | Slovensko (ľudia, ktorí tu žijú). Česko rozhodne Martin, pozri nižšie. |
| **Vek** | 25–65 |
| **Rozšírenie publika** | Vypnuté. Advantage+ publikum by reklamu ukázalo aj mimo návštevníkov webu, preto použiť pôvodné možnosti publika. |

Na čo myslieť:
- **Pixel sa načíta len návštevníkom, ktorí prijali marketingové cookies** (`hooks/useMetaPixel.ts`). Publikum je preto menšie ako návštevnosť webu. Veľkosť ukáže Ads Manager po vytvorení publika. Pod 100 ľudí Meta reklamu nedoručí. Pri publiku pod 1 000 ľudí treba rozhodnúť, či okno predĺžiť na 60 dní.
- **Vylúčenie kupujúcich je neúplné.** `Purchase` posiela web zo stránky poďakovania (`pages/ThankYou.tsx`), len so súhlasom s marketingovými cookies. Serverová záloha (`api/shopify-order-webhook.ts`) posiela nákupy len do GA4, nie do Mety.
- **Prečo vylúčiť odberateľov:** kto už odoberá, druhý uvítací e-mail nedostane (`subscribe-newsletter` ho do zoznamu znova neprihlási), teda nedostane ani WELCOME5. Web si stav popupov pamätá len v prehliadači, kde sa človek prihlásil (popup A v `localStorage`). Vstavaný prehliadač Facebooku a Instagramu má vlastné úložisko, takže odberateľ z reklamy môže popup B vidieť a kód nedostane.
- **Synchronizácia zoznamu z Klaviya do Mety nie je v zásadách ochrany súkromia.** Zásady pri Mete uvádzajú len Meta Pixel so súhlasom, nie odovzdanie e-mailových adries na tvorbu publík. Pred zapnutím synchronizácie treba zásady doplniť. Je to právny text, rozhoduje Martin. Druhá možnosť je udalosť Pixelu pri odbere a vylúčenie podľa nej. Pätička ani popup A ju dnes neposielajú. Či ju bude posielať popup B, treba overiť v jeho implementácii.
- **Česko:** e-shop doručuje platne výlučne na území Slovenska (stránka Doprava a platba). Na začiatok odporúčam len Slovensko.

## 3. Kreatíva

Každý variant ide v troch formátoch. Copy sa riadi skillom `copy-orostone` (najprv hodnota, potom cena, bez výkričníkov, bez falošnej naliehavosti, bez slova luxus), vizuál skillom `orostone-kreativy`.

### Texty

| | A – Appennino | B – Roman Travertine | C – Wild Forest |
|---|---|---|---|
| **Hlavný text** (do 125 znakov, celý viditeľný) | Pracovnú dosku budete denne používať aj vidieť. Za prihlásenie na newsletter dostanete zľavu 5 % na platne svojho dekoru. (121) | Roman Travertine má kresbu travertínu a nepotrebuje impregnáciu. Za prihlásenie na newsletter dostanete na platne zľavu 5 %. (124) | Wild Forest sa naplno ukáže až vo veľkej ploche, nie na vzorke. Za prihlásenie na newsletter dostanete na platne zľavu 5 %. (123) |
| **Nadpis** (do 40) | 5 % zľava na váš dekor (22) | Roman Travertine so zľavou 5 % (30) | Zľava 5 % na platne Wild Forest (31) |
| **Popis** (do 30) | Pri objednávke na orostone.sk (29) | Kód vám príde e-mailom (22) | Platí pre objednávky v e-shope (30) |
| **Tlačidlo** | Get offer („Získať ponuku“) | Shop now („Nakupovať“) | Learn more („Zistiť viac“) |
| **Text na obrázku**, riadok 1: Montserrat Bold | 5 % na váš dekor | Travertín bez impregnácie | Kresba pre veľkú plochu |
| riadok 2: Montserrat Light Italic | za odber newslettera | 5 % za odber newslettera | 5 % za odber newslettera |
| **`utm_content`** | `a-appennino` | `b-roman-travertine` | `c-wild-forest` |

Čísla v zátvorkách sú počty znakov. Slovenské popisy tlačidiel sa riadia rozhraním Mety, vyberá sa z jej zoznamu. Popis sa na Instagrame často nezobrazí, preto to, že zľava je za prihlásenie na newsletter a na platne, hovorí už hlavný text.

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
- Súbory v `public/images/kuchyne/` sú vizualizácie z Higgsfieldu so skutočným dekorom (`data/pillars/kuchyne.ts`). V reklame ich nevolajte realizácia ani kuchyňa klienta.
- Nepoužívať: `public/images/email/kosik-zlava-5-*.jpg` (1040 px, patria k e-mailu s kódom KOSIK5), `public/images/vzorky/*.webp` (400 px), `public/images/home/dekory/*.webp` (520 px).
- **Finálna grafika príde neskôr z Higgsfieldu.** Rovnakú hlavnú fotku má mať popup B (cesta k obrázku je v jednej konštante v jeho kóde), aby vstupná stránka nadväzovala na reklamu.

### Pravidlá vizuálu

- Text najviac 20 % plochy, žiadne VEĽKÉ PÍSMENÁ vo vetách, žiadny výkričník a žiadny kód na obrázku.
- Písmo len Montserrat. Paleta: `#1A1A1A`, `#F9F9F7`, `#F5F5F0`, jediný akcent zlatá `#ECD488`. Zlatý text len na tmavom podklade (graphite pás alebo tmavý prechod cez fotku), nikdy na svetlom.
- Export PNG (ostrý text). Pred odovzdaním prejsť checklist zo skillu `orostone-kreativy`.

## 4. Postup v Meta Ads Manageri

Celý postup končí uložením konceptu. Zverejniť (Publish) môže len Martin.

**0. Pred spustením musí platiť všetko:**
- Popup B je na produkcii a reaguje na `?ponuka=zlava5`. V tej istej návšteve sa nezobrazí popup A.
- WELCOME5 je v Shopify aktívny s dohodnutými podmienkami.
- Uvítací e-mail s oboma kódmi beží v Klaviyu.
- Veta o zľave pre nových odberateľov je v zásadách ochrany súkromia na produkcii.
- Test na mobile, vo vstavanom prehliadači Instagramu aj Facebooku: lišta cookies, potom popup B, prihlásenie, e-mail s kódmi, WELCOME5 v pokladni pri jednej platni.

**1. Publiká** (Publiká → Vytvoriť publikum → Vlastné publikum → Webová stránka, zdroj Pixel `712209907542673`):
- „Web 30 dní“: všetci návštevníci webovej stránky, 30 dní.
- „Nákup 180 dní“: udalosť `Purchase`, 180 dní.
- Voliteľne „Tím Orostone“: `PageView` spresnené parametrom `internal_traffic`.
- „Newsletter – web (Klaviyo)“ len po rozhodnutí podľa časti 2.

**2. Kampaň:** cieľ **Návštevnosť** (Traffic), názov „Retargeting – zľava 5 % (WELCOME5)“, bez osobitnej kategórie reklám, rozpočet na úrovni kampane (Advantage+ campaign budget).

Prečo Návštevnosť a nie Predaj:
- Optimalizácia na nákup potrebuje desiatky udalostí `Purchase` týždenne. Platne sa kupujú zriedka a Pixel vidí len časť nákupov.
- Odber newslettera Pixel dnes nezaznamenáva, takže sa naň nedá optimalizovať.
- Pri malom publiku rozhoduje najmä frekvencia, nie algoritmus.

K cieľu Predaj (optimalizácia na odber alebo nákup) sa oplatí vrátiť, keď web bude posielať udalosť odberu a bude jej dosť.

**3. Sady reklám:** dve, líšia sa len platformou, aby `utm_source` bol `facebook` alebo `instagram`.
- Miesto konverzie Webová stránka. Cieľ výkonu: Maximalizovať počet zobrazení vstupnej stránky (počíta sa len pri súhlase s cookies, nevadí to).
- Publikum podľa časti 2, rozšírenie publika vypnuté.
- Umiestnenia ručne. Sada „Facebook“: kanál, Stories, Reels. Sada „Instagram“: kanál, Stories, Reels, Preskúmať.
- Vypnúť: Audience Network, Messenger, Threads, pravý stĺpec, Marketplace, vyhľadávanie a in-stream videá.
- Jednoduchšia možnosť: jedna sada s `utm_source={{site_source_name}}`. Meta vtedy vloží `fb` alebo `ig` namiesto `facebook` a `instagram`, s tým treba počítať v prehľadoch GA4.

**4. Reklamy:** v každej sade tri reklamy (A, B, C), jeden obrázok, prispôsobenie podľa umiestnenia:
- 4:5 pre kanály, 9:16 pre Stories a Reels, 1:1 ako záloha.
- Webová stránka: `https://orostone.sk/produkt/<dekor>`. Do poľa Parametre URL vložiť `ponuka=zlava5&utm_source=facebook&utm_medium=paid_social&utm_campaign=retargeting-zlava5&utm_content=<variant>`. V sade Instagram vložiť `utm_source=instagram`.
- Zobrazený odkaz: `orostone.sk`. Sledovanie: Pixel zapnutý.
- **Vypnúť všetky vylepšenia Advantage+ kreatívy** (úpravy textu, prekrytia, hudba, animácia, rozšírenie obrázka) aj **reklamy viacerých inzerentov**. Inak Meta pridá text, ktorý neprešiel kontrolou značky.

**5. Kontrola:** náhľad každého umiestnenia (text mimo zakrytých zón), odkaz otvoriť z náhľadu na mobile. Potom **Uložiť ako koncept** a poslať Martinovi.

### Rozpočet (NÁVRH, rozhoduje Martin)

- Návrh: **5–10 € denne za celú kampaň**, teda 150–300 € za prvý mesiac. Začať pri dolnej hranici.
- Prečo tak málo: publikum je malé (len návštevníci so súhlasom s marketingovými cookies). Viac peňazí do malého publika nezvýši dosah, len frekvenciu.
- Prepočet podľa skutočnej veľkosti publika: týždenný rozpočet ≈ počet ľudí × cieľová frekvencia × CPM / 1 000.
- Príklad: 3 000 ľudí, frekvencia 2 za týždeň a CPM 6 € (orientačný odhad, nie údaj z účtu) dávajú 36 € týždenne, teda okolo 5 € denne.

### Frekvencia, obmena, harmonogram

- **Frekvencia:** pevný strop pri cieli Návštevnosť Meta neponúka (len pri cieli Povedomie s cieľom výkonu Dosah, overte v rozhraní). Frekvenciu preto drží rozpočet. Cieľ je 1,5–2,5 zobrazenia za 7 dní. Pri viac ako 3 za 7 dní alebo 6 za 30 dní znížiť rozpočet.
- **Obmena:** pri malom publiku každé 2–3 týždne, alebo keď CTR klesne o viac ako 20 % oproti prvému týždňu. Najprv vymeniť nadpis alebo text na obrázku, potom fotku.
- **Harmonogram:** spustiť až po splnení bodu 0, bez dátumu konca. Prvá kontrola po 7 dňoch, rozhodnutie po 14 dňoch (skôr sa nevyhodnocuje, Meta sa učí). Rozvrh hodín nenastavovať: pri dennom rozpočte nejde a publikum je malé.

## 5. Voliteľne: remarketing v Google Ads

Nie je súčasťou tohto zadania. Ak by sa Martin rozhodol, treba:
- **Kampaň Display** s publikom „návštevníci orostone.sk za 30 dní“ v režime Zacielenie, nie Pozorovanie. Performance Max nie je čistý remarketing: publikum berie len ako signál a míňa aj na nových ľudí.
- **Zber publika:** prepojiť GA4 (`G-W3ZPVYZ9HQ`) s Google Ads a zapnúť signály pre personalizovanú reklamu, alebo pridať značku Google Ads do GTM (`GTM-WVQWKLMZ`). Či ju GTM už má, v repozitári nevidno, treba overiť v GTM.
- **Súhlas:** web posiela `ad_storage`, `ad_user_data` a `ad_personalization` podľa marketingových cookies (`hooks/useAnalytics.ts`). Značku GA však načíta len so súhlasom s analytickými cookies, takže publikum zbiera len pri oboch súhlasoch. Zásady ochrany súkromia remarketing cez Google Ads už uvádzajú.
- **Veľkosť:** Display potrebuje aspoň 100 aktívnych používateľov za 30 dní.
- **Kreatívy:** responzívna obsahová reklama. Obrázky 1200 × 628 a 1200 × 1200, logo 1200 × 1200, krátke nadpisy do 30 znakov, dlhý nadpis a popisy do 90 znakov. Texty prevziať z variantov A–C.
- **Odkaz:** vstupná stránka s `?ponuka=zlava5`. Atribúciu rieši automatické označovanie (gclid), UTM netreba.

## 6. Meranie

| Kde | Čo sledovať | Pozor |
|---|---|---|
| **GA4** | Prehľady → Akvizícia → Akvizícia návštevnosti, kampaň relácie `retargeting-zlava5`. Varianty porovná dimenzia s `utm_content`. Udalosti `sign_up` a `purchase` v týchto reláciách. | Len návštevníci so súhlasom s analytickými cookies. Popup A posiela `sign_up` s `method: newsletter_popup`, hodnotu pre popup B treba overiť v jeho kóde. |
| **Shopify** | Zľavy → WELCOME5: počet použití. Analytika → Prehľady → Predaj podľa zľavy. | Počet zahŕňa všetkých nových odberateľov z akéhokoľvek formulára, nielen ľudí z reklamy. UTM do objednávky prenáša web len pri košíku platní (`context/CartContext.tsx`). |
| **Klaviyo** | Segment s vlastnosťou `zdroj_odberu` = `popup_zlava5` a rast zoznamu Newsletter – web. | `subscribe-newsletter` zapisuje `zdroj_odberu` len novému profilu, preto je počet dolný odhad. Popup B sa ukazuje aj bez reklamy, preto počet `popup_zlava5` zahŕňa aj odbery mimo reklamy. |
| **Meta** | Dosah, frekvencia, CTR (odkaz), zobrazenia vstupnej stránky a cena za ne, porovnanie A, B, C. | Nákupy v Mete sú len orientačné (Pixel so súhlasom, bez serverových udalostí). |

**Výsledok po 14 dňoch:** cena za odberateľa z reklamy = útrata ÷ počet `sign_up` v reláciách `retargeting-zlava5` (GA4). K tomu objednávky s WELCOME5 a víťazný variant na ďalšiu obmenu.

## Na rozhodnutie pre Martina

1. Rozpočet (návrh 5–10 € denne) a dátum spustenia po splnení bodu 0.
2. Česko áno alebo nie (platne doručujeme len na Slovensku, odporúčam nie).
3. Vylúčenie odberateľov: doplniť zásady a synchronizovať zoznam z Klaviya, alebo udalosť Pixelu pri odbere (zmena webu), alebo zatiaľ bez vylúčenia.
4. Dve sady reklám (`utm_source` = `facebook` / `instagram`), alebo jedna sada s `{{site_source_name}}` (`fb` / `ig`).
5. Pri publiku pod 1 000 ľudí predĺžiť okno z 30 na 60 dní.
