# Plán automatizácií v Klaviyu (A2–A5, A7, A8)

Stav k 14. 10. 2026. Klaviyo som read-only overil okolo 10:50 UTC. Podkladom je read-only kontrola Klaviya (účet RxkFZa), repozitárov Orostone-WEB a orostone-crm a playbooku (`#program` PB:1095-1101 s poznámkou PB:1105, `#stav` PB:444-479). Dokument je návod pre reláciu, ktorá bude flowy stavať. O všetkom, čo má ísť naživo, rozhoduje Martin.

Skratky: N = `marketing/newsletter`, B = `N/nastroje/build_emails.py`, PB = playbook `index.html`. **Š** = štandardný odosielateľ: from_label „Marián z Orostone“, from_email `ahoj@orostone.sk`, reply_to `ahoj@orostone.sk`. Majú ho všetky štyri správy v SNJKTh a je aj predvolený v účte.

> **Hneď pre Martina, ešte pred stavbou čohokoľvek.** Rozhodnuté 14. 10.: kampaň 03 ide podľa plánu 21. 10. Shopify pripojil Martin zámerne. Synchronizácia odberateľov zo Shopify je vypnutá (screenshot od Martina, 14. 10.: „Sync your Shopify email subscribers to Klaviyo“ nezaškrtnuté, Shopify Markets nezaškrtnuté).
> 1. **Odhlásenia po kampani 35:** 3 odhlásenia z 52 príjemcov, teda 5,8 %. Hranica na hlásenie je 1 % (README:112). Sťažnosti na spam: 0. Kampaň 03 je naplánovaná na 21. 10. o 07:00 UTC. Martin rozhodne, či 03 pôjde. Bez jeho rozhodnutia kampaň nemeniť ani nerušiť. Čísla sa ešte menia, preto ich pred odovzdaním plánu treba znova skontrolovať (`get_campaign_report`).
> 2. **Shopify je pripojený ku Klaviyu** od 14. 10. 08:25 UTC. Martin potvrdí, že pripojenie bolo zámerné. V UI Klaviya skontroluje, do ktorého zoznamu zapisuje synchronizácia odberateľov zo Shopify: musí byť vypnutá alebo zapisovať do samostatného zoznamu, nikdy nie do VSrLFs. Treba to potvrdiť pred ďalšou objednávkou vzorky.

## Urobené a rozhodnuté 14. 10. (session Automatizácie v Klavyo)

- **Rozhodnutia Martina:** tlačidlo „Ostať v odbere“ v 24 ostáva obyčajný odkaz (bez `update_property_link` a bez úpravy webu). A3 (12–14) a A5 (08, 17, 06) pôjdu z CRM ako schvaľované koncepty, rovnako ako e-mail 34, nie z Klaviya.
- **Integrácia Shopify** (nastavená v UI 14. 10.): synchronizácia odberateľov zo Shopify vypnutá, synchronizácia profilov z Klaviya do Shopify vypnutá, Shopify access (Sidekick) vypnutý, onsite tracking zapnutý (týka sa len témy Shopify, nie headless webu). Meta Ads a Google Ads sú znova „Enabled“. Wix integrácia už nie je pripojená, jeho staré metriky ostávajú.
- **Nahrané v Klaviyu z main** (nič neodoslané, žiadny flow):

  | Šablóna | ID |
  |---|---|
  | 05 Vzorka je doma | Vfw2VY |
  | 11 Pomôžem vám s výberom? | Sze5Hr |
  | 22 Riešite ešte kuchyňu? | X8jULq |
  | 23 Tri realizácie | RpGJMA |
  | 24 Máme vám ešte písať? | YjhfKT |

- **Segment VGyNMu „Reaktivácia (A7): newsletter 90+ dní bez otvorenia a kliku“:** člen VSrLFs aspoň 90 dní, 0× Opened Email (TqZ5Tp) a 0× Clicked Email (VdqXpS) za posledných 90 dní, nie je v TKAHuh, email subscribed.
- **Deľba práce:** všetko, čo sa v Klaviyu stavia alebo nastavuje (flowy, šablóny, segmenty, zoznamy, integrácie), a tento plán robí session Automatizácie v Klavyo. Naplánované kampane, ich kontroly a výsledky, UHSrFj, Resend a playbook robí session newsletter.
- **Otvorené:** zapnutie synchronizácie odberateľov zo Shopify do nového samostatného zoznamu (nie VSrLFs). Čaká na read-only kontrolu session newsletter (`claude/shopify-sync-kontrola`) a Martinovo potvrdenie.

## Súčasný stav

**Naživo**
- **SNJKTh „Uvítacia séria – Newsletter web“ (A1):**
  - Spúšťa ho zoznam VSrLFs, flow nemá filter.
  - Poradie: 01 (správa VLzuhC, šablóna XkFccQ, smart sending vypnutý) → 2 dni → 02 (RyGEE3 / VtY4mS) → 3 dni → 07 (QVFC3q / YrVwKF) → 4 dni → 09 (S76sVg / Y5SfdX).
  - Čakania končia o 09:00 v časovom pásme profilu.
  - Odosiela Š, transactional false, UTM `klaviyo / email / uvitacia-seria / NN-slug`.
  - Každá zo 4 akcií má vlastný status `live`.
  - Nastavenie re-entry: neoverené (API pole odmietlo).
- **UHSrFj „Upozornenie Mariánovi: kuchyňa do 3 mesiacov“:**
  - Spúšťa ho segment XF7U3i (`horizont = do-3-mesiacov`).
  - Jediná akcia je interný alert (správa Sirvyd, šablóna U6Rp4G) na marian.brazdil@orostone.sk. Je jediná transakčná správa v účte.
  - Telo alertu je vyplnené (šablóna U6Rp4G, aktualizovaná 13. 10. o 11:41 UTC, overené cez API). Marián 13. 10. potvrdil opt-in alertov (podľa Martina, API to neukáže). Flow aj akcia sú `live`.
- RreX6Y je starý prázdny draft bez spúšťača.

**Shopify → Klaviyo (nové 14. 10. 2026)**
- **Integrácia:** 0eMvjm „Shopify“. Všetky jej metriky vznikli 14. 10. o 08:25 UTC:

  | Metrika | ID |
  |---|---|
  | Placed Order | Uu5JLg |
  | Fulfilled Order | Y4VvMe |
  | Checkout Started | TR4G9D |
  | Added to Cart | VDuzE8 |
  | Ordered Product | XwxHvZ |
  | Cancelled Order | WgvCgK |
  | Refunded Order | S4CNDa |
  | Viewed Product | Te3Dx2 |

- **História sa synchronizovala:**
  - Uu5JLg má 13 udalostí: 6 v marci, 3 v apríli a 4 v októbri 2026 (ORO-1010–1013).
  - Y4VvMe má 4 udalosti: ORO-1010 a 1011 z 8. 10., ORO-1012 a 1013 zo 14. 10. o 08:20 UTC.
  - TR4G9D má 13 udalostí: 4 so vzorkami (5.–9. 10.) a 9 s platňami (marec – apríl 2026).
- **Mapované metriky:**
  - `started_checkout` → TR4G9D a `added_to_cart` → VDuzE8 (Shopify).
  - `revenue` stále ukazuje na Wix TSzMKT a `ordered_product` na Wix Y6sBpu.
  - V reportoch kampaní a flowov používať ako konverznú metriku Uu5JLg. Prepnutie mapovania je zmena v účte, ide len so súhlasom Martina.
- **Staré Wix metriky** (Placed Order TSzMKT, Fulfilled Order XtryLR a ďalšie) ostávajú v účte, bez udalostí.
- **Automatické segmenty:** vzniklo 5 segmentov s príponou „(Shopify)“: RNK3AY Churn Risks, SB2AUp VIP Customers, TFNbsR Win-Back Opportunities, VyRjiJ Repeat Buyers, XYifrQ Potential Purchasers. Nepoužívať ich.
- **Synchronizácia odberateľov:**
  - Nový zoznam nevznikol.
  - 14. 10. nie je žiadna udalosť Subscribed to List (SKUGUP) ani Subscribed to Email Marketing (WkLtVM) a do VSrLFs nikto nepribudol.
  - Ako je synchronizácia nastavená v UI: neoverené.
- **Údaje v Klaviyu:** sú tam objednávky a zákazníci, vrátane kupujúceho ORO-1010, ktorý v checkoute súhlas nedal (`buyer_accepts_marketing=false`).

**Kampane**
- **Kampaň 35** odišla 14. 10. o 07:00 UTC na VSrLFs. Vylúčený bol segment U7xJVv (prihlásení po spustení uvítacej série 12. 10.).

  | Ukazovateľ | Hodnota |
  |---|---|
  | Príjemcovia | 52 |
  | Doručené | 50 |
  | Nedoručené (bounce) | 2 |
  | Unikátne otvorenia | 16 |
  | Unikátne kliky | 3 |
  | Odhlásenia | **3 (5,8 %)** |
  | Sťažnosti na spam | 0 |

  Odhlásenia prišli 14. 10.: 1 o 08:00 a 2 o 10:00 UTC (UHCLGf).
- **Naplánované kampane**, všetky na VSrLFs bez RdLKj8 a TKAHuh:

  | Kampaň | Dátum odoslania |
  |---|---|
  | 03 | 21. 10. |
  | 04 | 30. 10. |
  | 19 | 13. 11. |
  | 18 | 24. 11. |
  | 20 | 3. 12. |
  | 21 | 15. 12. |
  | 28 | 12. 1. 2027 |
  | 29 | 26. 1. 2027 |

**Čo chýba pre A2–A8**
- **Šablóny:** žiadna zo 17 šablón (05, 06, 08, 10–17, 22–27) nie je v Klaviyu nahraná. V repozitári sú hotové a označené ako skontrolované (README:59-75, `jazykova-kontrola.md` nemá otvorené riadky).
- **Web:** do Klaviya posiela len prihlásenie na odber (`supabase/functions/subscribe-newsletter`). Kľúč má podľa komentára v kóde scope „Lists, Profiles, Subscriptions: Full“, teda bez Events (`_shared/klaviyo.ts:12-13`). Skutočné scopes kľúča sú neoverené.
- **CRM:** Klaviyo nevolá vôbec. Nemá vlastné metriky, webhooky ani Klaviyo.js.
- **Limity za obdobie 8. 10.–8. 11.:**
  - Aktívne profily 429/500 (k 14. 10. 10:49 UTC). Či číslo už zahŕňa zákazníkov zo Shopify: neoverené.
  - E-maily 58/5 000.
  - Plán účtu je neoverený. Kontext uvádza free, ale limit 5 000 e-mailov zodpovedá platenému Email tieru.
- **Sending doména:** ahoj.orostone.sk je „active“, ale jej DNS záznamy majú verified:false. Skutočný stav autentifikácie je neoverený.
- **A6** (Tip po pol roku / Výročie) sa zámerne neposiela.

## Pravidlá (platia pre všetko nižšie)

1. **Odosielanie:** nič neodosielať, neplánovať a neposielať náhľady ani testy bez Martinovho výslovného súhlasu v relácii. `render_email_template` nič neodosiela, ten je v poriadku.
2. **Draft a live:** flowy stavať ako draft. Naživo ide flow len po Martinovom výslovnom OK, pre každý flow zvlášť.
3. **Bez Martina nemeniť:** spúšťač, časovanie ani vypnutie SNJKTh, typ opt-inu VSrLFs, Supabase secrets ani kód Turnstile.
4. **Profily:**
   - Nikdy hromadne nepridávať ľudí do VSrLFs. Nikdy nemazať a znova nepridávať.
   - Neprihlasovať, neodhlasovať, nesuppressovať ani nemazať profily.
   - Žiadne testovacie riadky v produkčnej DB (web ani CRM).
5. **Dopyty (TKAHuh):**
   - Nedostávajú kampane ani uvítaciu sériu. E-maily pre dopyty vždy vylučujú VSrLFs.
   - Miesto pod limitom 500 sa uvoľňuje len mazaním dopytov a len so súhlasom Martina, nikdy mazaním odberateľov.
6. **Hlásenia:** odhlásenie nad 1 % alebo akúkoľvek sťažnosť na spam hneď povedať Martinovi. Teraz to platí pre kampaň 35.
7. **Slovenský text:**
   - Mení sa len v B. Potom sa pregenerujú `N/sablony/` a `N/texty/`.
   - Ide cez PR s `@codex review` (pravidlá v `N/AGENTS.md`).
   - Po zmene šablón zosúladiť šablóny skillu `orostone-newsletter`.
8. **Nasadenie kódu:**
   - Supabase funkcie len z main, po merge a po dohode.
   - CRM: PR → zelený `typecheck-build` → vyriešené komentáre Codex/CodeRabbit → merge. Pred migráciou sa opýtať. Nové env premenné nastavuje Martin.

## Poradie a odporúčanie

| Automatizácia | Zdroj spúšťača | Je v Klaviyu dnes | Čo blokuje | Čo sa dá urobiť hneď |
|---|---|---|---|---|
| A2 Vzorky | Shopify Fulfilled Order Y4VvMe | áno, od 14. 10. (4 udalosti) | PR na dynamický blok v 10; rozhodnutia o súhlase a synchronizácii odberateľov | nahrať 05 a 11; PR pre 10 |
| A7 Reaktivácia | segment VGyNMu (Opened TqZ5Tp, Clicked VdqXpS) | áno | nič, 24 rozhodnuté 14. 10. | šablóny 22–24 a segment hotové 14. 10.; zostáva draft flowu |
| A4 Opustený košík | Shopify Checkout Started TR4G9D | áno (13 udalostí) | PR na 15 a 16 (URL košíka, text o doprave); vypnutie Shopify e-mailu; súhlas | PR pre 15 a 16 spolu s 10 |
| A3 Dopyt → ponuka | CRM, fáza „Finálna ponuka odoslaná“ | nie | rozhodnutie Klaviyo vs. CRM; CRM kód; nový kľúč | nič |
| A5 Po realizácii | CRM, montáž so stavom `dokoncene` | nie | CRM kód; fotky pre 08; súhlas | nič |
| A8 B2B | neexistuje | nie | model súhlasu a zdroj kontaktov | nič |

Playbook radí ako prvé A1, A2, A3 a A5 (PB:1105). A3 a A5 sú zablokované, A2 má od 14. 10. spúšťač. Žiadny flow sa nevytvára, kým nie sú hotové všetky jeho správy (pozri spoločný postup). Odporúčané poradie:

1. **A2.** Objednávky vzoriek už prichádzajú (4 za 5.–9. 10.).
   - PR pre 10 začať hneď a do toho istého PR dať aj 15 a 16.
   - Flow postaviť po merge a po Martinových rozhodnutiach o súhlase a synchronizácii odberateľov.
   - 05 a 11 sa dajú použiť bez zmeny textu.
2. **A7.** Nepotrebuje nové dáta, iba Martinovo rozhodnutie o 24. Potom sa postaví naraz celý.
   - Prví odberatelia dosiahnu 90 dní vo VSrLFs okolo 8. 1. 2027 (prenos 10. 10. 2026).
   - Segmentový flow nepridá ľudí, ktorí už v segmente sú, preto musí byť naživo pred týmto dátumom.
   - Ak Martin o 24 rozhodne skôr, než sa zmerguje PR pre 10, A7 sa môže postaviť skôr než A2. Na priorite to nič nemení.
3. **A4** po merge 15 a 16 a po vypnutí vlastného e-mailu Shopify.
4. **A3 a A5** po rozhodnutí, či pôjdu z Klaviya (CRM udalosti cez Create Event API), alebo z CRM ako schvaľované koncepty v `lead_drafts`, rovnako ako e-mail 34.
   - **Odporúčanie pre 08:** z CRM so schválením, lebo potrebuje fotky konkrétnej montáže.
   - **A3 tiež skôr z CRM:** odpovede sa naviažu na lead, uplatní sa brána `inquiryQuestionGate`, e-mail 14 sa prekrýva so 34 a väčšina dopytov nemá marketingový súhlas.
   - **17 a 06** môžu ísť z Klaviya, ak CRM začne posielať udalosť „Montáž dokončená“.
5. **A8** až keď Martin určí, ako sa B2B kontakt so súhlasom dostane do Klaviya.

## A2 Vzorky (05, 10, 11)

### 1. Spúšťač a zdroj udalosti
- **Spúšťač:** Fulfilled Order **Y4VvMe** z integrácie Shopify, nie Wix XtryLR.
- **Existuje v Klaviyu dnes: áno.** Metrika je od 14. 10. 08:25 UTC a má 4 udalosti (ORO-1010–1013).
- **Filter spúšťača:**
  - SKU (`ORO-SAMPLE-1/2/3`) aj atribút `_orostone_flow=samples` sú v udalosti len vnútri `$extra` (`line_items[].sku`, `note_attributes`). Na najvyššej úrovni nie sú, preto sa na ne filter spúšťača pravdepodobne nastaviť nedá.
  - Na najvyššej úrovni sú napríklad `Items`, `ShippingRate`, `Item Count`, `Collections` a `$value`.
  - Návrh: `Items` obsahuje „Vzorky Orostone“ (platí pre všetky 4 objednávky), alebo `ShippingRate` = „Doručenie vzoriek“. Ktoré filtre builder naozaj ponúka, overiť.
- **Čo filter nepokryje:** vzorky kúpené cez košík platní. Je to variant vzorky produktu dekoru (`components/ProductDetail/ArchitectBlock.tsx:100`), takže v `Items` majú názov dekoru.
- **Cesta objednávky:**
  1. `/vzorky` spustí Shopify cartCreate s atribútom košíka `_orostone_flow=samples` (`services/shopify/samples.ts:212`). Položka nesie vlastnosti „Počet vzoriek“, „Rozmer vzorky“, „Vzorka N“ a `_sample_handle_N` (`:190`).
     - `_sample_code_N` pribudne len vtedy, keď má produkt v popise kód (`:193`, od commitu 935cb53). Žiadna zo 4 objednávok ho nemá.
  2. Návštevník ide do Shopify checkoutu (`components/Shop/SampleOrderSection.tsx:106`).
  3. Shopify `orders/paid` → `supabase/functions/alfapureo-order` → expedícia cez GLS.
  4. `alfapureo-tracking` urobí fulfillmentCreate s tracking URL (`index.ts:136-145`).
- **„Fulfilled“ znamená odoslané, nie doručené.**
  - Všetky 4 fulfillmenty majú prázdne `tracking_company`, `tracking_url` aj `shipment_status`, takže udalosť Delivered Shipment pre ne prísť nemôže.
  - Prvá objednávka s GLS trackingom od Alfapurea ukáže, či sa Delivered Shipment vôbec synchronizuje.
- **Bezplatné vzorky** (formulár #vzorka → `SampleLeadForm` → `submit-quote` → CRM `/api/sample-confirmation`) nemajú stav „odoslaná“ ani „doručená“ a do Klaviya nejdú. Bez novej CRM udalosti pokrýva A2 len platené vzorky.

### 2. Kroky, oneskorenia, filtre, podmienky ukončenia

| Krok | Čas | Šablóna | Podmienka |
|---|---|---|---|
| 1 | pri objednávke | potvrdenie posiela Shopify (mimo flowu) | – |
| 2 | Fulfilled + 4 dni, 09:00 (návrh, ≈ 2 dni po doručení) | 05 | tranzit GLS overiť na prvých udalostiach |
| 3 | o 5 dní, 09:00 (≈ 7 dní po doručení) | 10 | len s dynamickým dekorom |
| 4 | o 7 dní, 09:00 (≈ 14 dní po doručení) | 11 | neposielať, ak klient medzitým poslal dopyt (B:1277) |

Hodnoty time-delay akcií: 4 d → 5 d → 7 d, každá do 09:00, `timezone=profile`.

Filtre a ukončenie:
- **Spúšťač:** len objednávky vzoriek (pozri bod 1).
- **Súhlas:**
  - Draft vždy s `profile_filter` „can receive email marketing, subscription=subscribed“. Odstrániť ho len po Martinovom písomnom rozhodnutí a po úprave zásad.
  - Kým je synchronizácia odberateľov zo Shopify vypnutá, súhlas z checkoutu sa do Klaviya nedostane. Filter vtedy prepustí len ľudí prihlásených v Klaviyu, prakticky VSrLFs.
  - So samostatným zoznamom by A2 dostali aj kupujúci, ktorí dali súhlas v checkoute.
- **Re-entry:** `reentry_criteria` {duration: 30, unit: day}, aby ďalšia objednávka sériu nereštartovala.
- **Pred e-mailom 11:**
  - Signál „poslal dopyt“ v Klaviyu neexistuje a nové dopyty sa nepridávajú ani do TKAHuh (README:103).
  - Možnosti: CRM udalosť o dopyte, alebo 11 poslať bez tejto podmienky. Rozhodne Martin.
- **Prekryv s A1:** nový odberateľ v uvítacej sérii (RdLKj8), ktorý si objedná vzorku, dostane obe série. Tlmí to len smart sending s oknom 16 h. Rozhodne Martin.
- **Prekryv s A4:** kto objednávku dokončí, vypadne z A4 cez filter Placed Order Uu5JLg. A2 začne až pri Fulfilled.

### 3. Šablóny, odosielateľ, predmet, preheader

| Šablóna | Odosielateľ | Predmet | Preheader | Dynamické dáta |
|---|---|---|---|---|
| `N/sablony/05-automatizacia-vzorka-doma.html` (dizajn, P. S. Marián) | Š | Vzorka je doma. Skúste s ňou 4 veci | 🪨 Stačí víno, citrón, hrnček horúcej vody a vaše svetlo. Za desať minút zistíte viac než z katalógu. | voliteľne názov dekoru v úvode (TODO B:1054, neimplementované) |
| `N/sablony/10-automatizacia-vzorka-velka-plocha.html` (dizajn) | Š | Ako váš dekor vyzerá vo veľkej ploche | 🪨 Kresbu v mierke kuchyne uvidíte na fotke celej platne, v realizáciách alebo v showroome. | **povinné** (TODO B:1248), dnes natvrdo Taj Mahal: názov dekoru z „Vzorka 1“, URL produktu z `_sample_handle_1` (pravdepodobne `/produkt/<handle>`); fotku celej platne udalosť nenesie |
| `N/sablony/11-automatizacia-vzorka-marian.html` (čistý text) | Š, podpis Marián Brázdil, +421 917 588 738 | Pomôžem vám s výberom? | Stačí odpovedať na tento e-mail. | príznak „poslal dopyt“ pre ukončenie |

Poznámky k dynamickým dátam v 10 (a voliteľne v 05):
- **Kde sú dáta:** v `event.extra.line_items[].properties`, čo je zoznam dvojíc name/value, nie slovník.
- **Viac vzoriek v objednávke:** ORO-1011 má 2 vzorky, ORO-1013 má 3. Text musí fungovať pre 1–3 vzorky, napríklad prvý dekor a „a ďalšie“.
- **Obrázok:** položka objednávky je produkt „Vzorky Orostone“, nie dekor, preto fotku celej platne treba vyriešiť v PR.
- **Kontrola:** pred nahraním overiť cestu k dátam na historickej udalosti Y4VvMe a šablónu vyrenderovať s kontextom tej udalosti.

UTM, návrh: `utm_campaign=vzorky`, `utm_content=05-vzorka-doma`, `10-vzorka-velka-plocha`, `11-vzorka-marian`.

### 4. Draft vs. live a schválenia
- **V Klaviyu hneď (nič neodíde):** nahrať 05 a 11 ako šablóny.
- **Flow:** vytvoriť až vtedy, keď sú všetky tri správy finálne (10 po merge), alebo keď Martin písomne rozhodne, že A2 pôjde natrvalo bez 10. Krok sa cez API dodatočne pridať nedá.
- **V repozitári hneď:** dynamický blok v 10, voliteľne aj v 05. Ide cez B, Codex a merge, spolu s 15 a 16.
- **Martin rozhodne:**
  - **Synchronizácia odberateľov zo Shopify:**
    - Zapnutie, do akéhokoľvek zoznamu, prihlasuje profily, preto je to jeho rozhodnutie.
    - Klaviyo pri zapnutí synchronizuje aj historických odberateľov. Kto sa v Klaviyu odhlásil a v checkoute dá súhlas, bude znova prihlásený (Klaviyo Help 115005080667).
    - Pred zapnutím porovnať zákazníkov Shopify s 13 potlačenými alebo odhlásenými profilmi (README:115).
    - Nikdy do VSrLFs. Išlo by o hromadný prídavok, ktorý spustí SNJKTh.
  - **Súhlasový základ pre kupujúcich.** Zásady sľubujú marketing len s výslovným súhlasom (`docs/pravne-texty/texty/ochrana-sukromia.md:41`).
  - **Platnosť súhlasu zo Shopify:** skôr než ho začneme brať ako platný, Martin overí v Shopify › Settings › Checkout › Marketing options, že je vypnuté predvolené zaškrtnutie súhlasu a že text zodpovedá zásadám.
- **Súhlas príjemcov:**
  - Checkout zaznamenáva `buyer_accepts_marketing`: ORO-1011, 1012 a 1013 majú true, ORO-1010 false.
  - Do profilov v Klaviyu sa súhlas zatiaľ nepreniesol (14. 10. nie sú žiadne udalosti prihlásenia).
- **Naživo** len po Martinovom OK.

### 5. Pasce
- **Duplicitné metriky:** Placed Order Uu5JLg (Shopify) vs. TSzMKT (Wix), Fulfilled Order Y4VvMe vs. XtryLR. Vyberať podľa ID.
- **Historické udalosti** flow nespustia, takže ORO-1010–1013 do A2 nevojdú.
- **Limit profilov:** každý nový zákazník zo Shopify je nový aktívny profil. Zostáva 71 miest.
- **E-mail 10** bez dynamického bloku hovorí „váš dekor“, ale ukazuje Taj Mahal (kapsula „Taj Mahal · 3200 × 1600 mm“). Takto nesmie ísť naživo.
- **E-mail 11:**
  - Veta „pred dvoma týždňami vám prišla vzorka“ sedí len pri správnom odhade doručenia.
  - Telefón v podpise sa líši od e-mailu 34 (+421 911 891 875, B:2056).
- **UTM:** checkout vzoriek UTM nenesie (pozri spoločné pasce). Udalosti ORO-1010–1013 majú `landing_site` prázdne.

## A3 Dopyt → ponuka (12, 13, 14)

### 1. Spúšťač a zdroj udalosti
- **Udalosť v CRM:** Marián pošle ponuku mimo CRM a presunie obchod do fázy „Finálna ponuka odoslaná“ (`orostone-crm/web/lib/types.ts:8`).
  - Zmena sa zapisuje do append-only tabuľky `deal_events` so skutočným dátumom (`supabase/migrations/0010_deal_events.sql:17, 53-64`).
  - `stage_changed_at` nepoužívať. Hromadná úprava 19. 8. ho prepísala (`20261009160000_otazka_k_dopytu.sql:29-33`).
  - DB trigger už zakladá aktivitu „Zavolať ohľadom ponuky“ o 3 dni (`0017_audit_hardening.sql:225-243`).
- **Existuje v Klaviyu dnes: nie.** Vlastná metrika neexistuje a CRM nemá Klaviyo integráciu.
- **Variant Klaviyo:**
  - Outbox v CRM (trigger na `deal_events` alebo server action) a route, ktorá volá Create Event API: `POST /api/events`, scope `events:write`.
  - Metrika „Ponuka odoslaná“ s `deal_id`, dekorom a dátumom, `unique_id` = deal_id.
  - Druhá udalosť alebo vlastnosť „Obchod uzavretý“ na predčasné ukončenie.
  - Samostatný Klaviyo kľúč ako env premenná CRM na Verceli.
- **Variant CRM:** koncepty v `lead_drafts` so schválením Mariána, odoslanie cez Resend z `dopyt@orostone.sk` (`web/lib/leadOutbound.ts`), rovnako ako e-mail 34.
- **Krok 1, potvrdenie dopytu,** už posiela web (PB `#stav`).

### 2. Kroky, oneskorenia, filtre, podmienky ukončenia

| Krok | Čas | Šablóna | Podmienka |
|---|---|---|---|
| 1 | pri dopyte | potvrdenie posiela web | – |
| 2 | +1 deň po ponuke, 09:00 | 12 | zastaviť pri objednávke alebo odpovedi klienta (B:1296) |
| 3 | +5 dní po ponuke, 09:00 | 13 | rovnako |
| 4 | +14 dní po ponuke, 09:00 | 14 | rovnako |

Hodnoty time-delay akcií: 1 d → 4 d → 9 d, každá do 09:00, `timezone=profile`. Pri pevnej hodine Klaviyo ráta kalendárne dni, takže 12 odíde nasledujúci deň o 09:00 a „včera“ v texte sedí.

Filtre a ukončenie:
- **Nie je vo VSrLFs** (pravidlo vlastníka). Odberateľ, ktorý dostane ponuku, teda A3 nedostane. README:103 počíta s tým, že dopyty dostanú „napríklad 12–14“. Martin to potvrdí.
- **Súhlas:**
  - Draft vždy s filtrom „can receive email marketing, subscribed“, kým Martin písomne nerozhodne inak.
  - S filtrom flow nedostane takmer nikto, lebo väčšina dopytov súhlas nemá. Bez filtra by išlo o marketing bez súhlasu.
- **Ukončenie:**
  - Udalosť „Obchod uzavretý“, pri výhre aj pri prehre.
  - Odpoveď klienta Klaviyo nevidí, odpovede idú do schránky ahoj@.
- **Re-entry:**
  - `reentry_criteria` platí pre profil. `unique_id` len odstraňuje duplicitné udalosti a nezaručí pravidlo „jeden obchod = jedna séria“.
  - Ten istý človek s druhou ponukou je podľa nastavenia buď blokovaný, alebo vstúpi znova. Rozhodne Martin.
- **Kolízia s CRM:** Klaviyo e-maily nevidí `inquiryQuestionGate` (`web/app/(crm)/leads/draftActions.ts:132`) ani pravidlo „3 a viac správ bez odpovede“. E-mail 14 sa prekrýva s e-mailom 34.

### 3. Šablóny, odosielateľ, predmet, preheader

| Šablóna | Odosielateľ | Predmet | Preheader | Dynamické dáta |
|---|---|---|---|---|
| `N/sablony/12-automatizacia-ponuka-ako-citat.html` (dizajn) | Š (vo variante CRM dopyt@, rozhodne Martin) | Ako čítať cenovú ponuku | 🪨 Vysvetlíme, čo je v cene, čo porovnávať a na čo sa pýtať, keď máte na stole viac ponúk. | dátum ponuky (text „včera sme vám poslali“) |
| `N/sablony/13-automatizacia-ponuka-showroom.html` (dizajn) | Š | Pozrite si platne naživo | 🪨 V showroome v Bošanoch vám pripravíme celé platne. Uvidíte kresbu v skutočnej veľkosti. | dátum ponuky; dekor z ponuky („celé platne vášho dekoru“ dnes nie je personalizované) |
| `N/sablony/14-automatizacia-ponuka-marian.html` (čistý text) | Š, podpis Marián Brázdil, +421 917 588 738 | Je niečo, čo vám bráni rozhodnúť sa? | Nechcem na vás tlačiť, len sa pýtam. | dátum ponuky („pred dvoma týždňami“) |

Otvorené TODO v 13 (B:1335): P. S. sľubuje fotky celej platne, treba to potvrdiť s Mariánom. UTM, návrh: `utm_campaign=dopyt-ponuka`.

### 4. Draft vs. live a schválenia
- **Nič sa nedá postaviť.** Metrika vznikne až prvou udalosťou.
- **Šablóny nenahrávať,** kým Martin nerozhodne medzi Klaviyom a CRM.
- **CRM kód:** PR, zelený `typecheck-build`, vyriešené Codex/CodeRabbit, merge. Migráciu (napríklad tabuľku outbox) pridať len po opýtaní. Klaviyo kľúč v env nastavuje Martin.
- **Tvrdé pravidlo pre variant Klaviyo:**
  - CRM pošle udalosť len pre kontakt, ktorý Martin schválil pre Klaviyo (napríklad už je v Klaviyu alebo má súhlas).
  - Nikdy nie pre 142 dopytov zmazaných 12. 10. (69 + 73, README:117-118) ani pre iné kontakty bez súhlasu. Create Event by profil založil znova, čím by vrátil Martinovo rozhodnutie a mohol prekročiť limit 500.
  - Pred zapnutím odhadnúť počet nových profilov, porovnať ho s voľným miestom (71) a mať Martinovo OK. Ak by sa prekročilo 500, Martin najprv určí, ktoré dopyty zmazať.
- **Súhlas:** TKAHuh má 373 profilov, väčšinou bez marketingového súhlasu. Zásady uvádzajú Klaviyo len pre newsletter (`ochrana-sukromia.md:94-100`).
- **Naživo** len po Martinovom OK.

### 5. Pasce
- **Čas udalosti:** posielať hneď s `time=now`. Klaviyo nespúšťa metrikové flowy pre udalosti oneskorené o 6 h a viac a `backfill:true` flow nespustí nikdy.
- **Prvá udalosť:**
  - So súhlasom Martina ju poslať priamo cez Create Event API (jednorazový skript alebo curl, `time=now`) pre interný profil zo zoznamu ThRq8q („Interný test – len vlastné adresy“), s finálnou schémou payloadu.
  - Nikdy nezakladať testovací obchod ani riadok v `deal_events` v produkčnom CRM.
  - Kód outboxu testovať len v CI alebo na neprodukčnej vetve Supabase.
- **Kľúč webu** nemá scope Events a jeho zmena je Supabase secret, teda Martinova vec. Použiť samostatný kľúč pre CRM.
- **Filter na TKAHuh** nepokrýva nové dopyty (README:103).

## A4 Opustený košík (15, 16)

### 1. Spúšťač a zdroj udalosti
- **Spúšťač:** Checkout Started **TR4G9D** zo Shopify. Shopify ju posiela zo servera, keď zákazník v checkoute zadá e-mail.
- **Existuje v Klaviyu dnes: áno.**
  - Má 13 udalostí: 4 so vzorkami (5.–9. 10., všetky skončili objednávkou) a 9 s platňami z marca – apríla 2026.
  - `started_checkout` je namapovaná na TR4G9D.
- **URL košíka:** všetky udalosti majú v `$extra` polia `checkout_url` aj `responsive_checkout_url`.
- **Výber vzoriek je anonymný.** Na `/vzorky` sa posiela len Meta AddToCart a GA4 add_to_cart (`SampleOrderSection.tsx:76-77`).
  - Shopify košík vzniká až pri pokračovaní a e-mail až v Shopify checkoute.
  - Košík platní môže obsahovať aj varianty vzoriek (`ArchitectBlock.tsx:100`).
- **Added to Cart (VDuzE8) sa neodporúča.** Metrika existuje, ale jej udalosti sú neoverené. Na headless webe vyžaduje Klaviyo.js, identifikovaného návštevníka, cookie súhlas a úpravu zásad.

### 2. Kroky, oneskorenia, filtre, podmienky ukončenia

| Krok | Čas | Šablóna | Podmienka |
|---|---|---|---|
| 1 | 1 h po Checkout Started | 15 | bez objednávky od vstupu |
| 2 | nasledujúci kalendárny deň o 09:00 po 15 | 16 | bez objednávky od vstupu |

Hodnoty time-delay akcií:
- Odporúčanie: 1 h → 1 d do 09:00 (`timezone=profile`). „Včera“ v 16 vtedy sedí a 16 neodíde v noci.
- Alternatíva podľa playbooku: 1 h → 23 h. „Včera“ sedí tiež, ale 16 môže odísť v noci.

Filtre a ukončenie:
- **Filter spúšťača:** `Items` obsahuje „Vzorky Orostone“ a `Items` má jednu položku. Tým sa vylúčia checkouty s platňami, ku ktorým by text o vzorke nesedel. Dostupnosť filtra overiť v builderi.
- **Ukončenie:** „Placed Order Uu5JLg zero times since starting this flow“.
- **Súhlas: povinný.** Meta e-mailu 15 hovorí „Posielať len kontaktom so súhlasom s e-mailovým marketingom“ (B:1386). Kým je synchronizácia odberateľov vypnutá, dostanú 15 a 16 len ľudia prihlásení v Klaviyu.
- **Re-entry:** `reentry_criteria` {duration: 30, unit: day}.
- **Smart sending pri 15:** nastaviť výslovne a zvážiť vypnutie. Okno 16 h (napríklad po kampani) môže 1-hodinový e-mail preskočiť.
- **Shopify e-mail:** vypnúť vlastný e-mail Shopify o opustenom checkoute (Martin), inak príde zákazníkovi dvakrát.
- **Medzera pri bezplatnej vzorke:** kto opustí checkout a potom si objedná bezplatnú vzorku cez #vzorka, Placed Order nevznikne a dostane 15 aj 16. Buď to prijať, alebo neskôr pridať CRM signál „Vzorka objednaná“. Rozhodne Martin.

### 3. Šablóny, odosielateľ, predmet, preheader

| Šablóna | Odosielateľ | Predmet | Preheader | Dynamické dáta |
|---|---|---|---|---|
| `N/sablony/15-automatizacia-kosik-vzorka.html` (dizajn, bez P. S.) | Š | Vaša vzorka zostala v košíku | 🪨 Objednávku dokončíte jedným kliknutím. Prvá vzorka je zadarmo, platíte iba dopravu. | `event.extra.checkout_url` alebo `responsive_checkout_url` (dnes CTA na statické `/vzorky`); vybrané dekory (hero `vzorky-tri.jpg` je natvrdo) |
| `N/sablony/16-automatizacia-kosik-marian.html` (čistý text) | Š, podpis Marián Brázdil, +421 917 588 738 | Váhate medzi dekormi? | Pošlite fotku kuchyne, poradíme. | URL košíka pre odkaz „tu“ (TODO B:1411) |

UTM, návrh: `utm_campaign=opusteny-kosik`.

### 4. Draft vs. live a schválenia
- **Spúšťač existuje.** Blokujú zmeny 15 a 16 (URL košíka, text o doprave), ktoré idú cez B, Codex a merge spolu s 10.
- **Flow** vytvoriť až s finálnymi 15 a 16.
- **Martin:** vypnutie e-mailu Shopify, rozhodnutie o súhlase a o synchronizácii odberateľov, spustenie naživo.
- **Súhlas príjemcov:** len kontakty s marketingovým súhlasom.

### 5. Pasce
- **Doprava:** 15 tvrdí „platíte iba dopravu“, kým odberatelia majú kód VITAJTE na dopravu zdarma. Kampane sa kvôli tomu prepisovali v Kole 22. Príjemcovia so súhlasom budú často práve odberatelia.
- **Kto odíde pred zadaním e-mailu,** udalosť nevznikne.
- **Placed Order:** vyberať Uu5JLg (Shopify), nie Wix TSzMKT.
- **Nočné odoslanie:** 15 o hodinu po vstupe môže odísť v noci. Tichý režim pre e-mail v Klaviyu neexistuje, `sms_quiet_hours_enabled` je len pri SMS.
- **UTM:** checkout vzoriek UTM nenesie (pozri spoločné pasce).

## A5 Po realizácii (08, 17, 06)

### 1. Spúšťač a zdroj udalosti
- **CRM má dátum montáže na dvoch miestach:**
  - `deals.realization_date` a `realization_date_confirmed` (`0138_realization_date_lifecycle.sql:27`).
  - Kalendár `calendar_events` s `type='montaz'` a stavom naplanovane / potvrdene / prebieha / dokoncene / zrusene (`0150_calendar_events.sql:29-36`). Na obchod pripadá najviac jedna aktívna montáž (`:96-99`).
- **Stav `dokoncene` nastavuje Marián ručne** v `/kalendar/montaze` (`web/lib/calendarEvents.ts:45, 67-69`).
- **Existuje v Klaviyu dnes: nie.**
- **Návrh:** CRM udalosť „Montáž dokončená“ pri prechode na `dokoncene` (dekor, dátum, krstné meno). Alternatíva je vlastnosť profilu `datum_montaze` a flow podľa dátumu.
- **Fotky z montáže** dnes Marián posiela cez WhatsApp (PB:1305).

### 2. Kroky, oneskorenia, filtre, podmienky ukončenia

| Krok | Čas | Šablóna | Podmienka |
|---|---|---|---|
| 1 | deň montáže (po označení `dokoncene` a nahratí fotiek) | 08 | len so skutočnými fotkami a údajmi; návrh: z CRM so schválením |
| 2 | +7 dní od montáže, 09:00 | 17 | montáž nie je zrušená |
| 3 | +30 dní od montáže, 09:00 | 06 | montáž nie je zrušená |

Hodnoty time-delay akcií, ak 17 a 06 idú z Klaviya: 7 d → 23 d, do 09:00, `timezone=profile`.

Filtre a ukončenie:
- **Súhlas:** draft vždy s filtrom „can receive email marketing, subscribed“. Iný právny základ len po Martinovom písomnom rozhodnutí a úprave zásad.
- **VSrLFs:** väčšina zákazníkov s montážou pochádza z dopytov. Podľa pravidla vlastníka dať do draftu podmienku „nie je vo VSrLFs“, alebo inú, ktorú Martin výslovne určí.
- **Re-entry:** `reentry_criteria` platí pre profil (pozri A3). Rozhodne Martin.
- **Zrušenie alebo preplánovanie:** sériu treba zastaviť.

### 3. Šablóny, odosielateľ, predmet, preheader

| Šablóna | Odosielateľ | Predmet | Preheader | Dynamické dáta |
|---|---|---|---|---|
| `N/sablony/08-automatizacia-dokoncena-zakazka.html` (dizajn) | Š | Hotovo: fotky z vašej montáže | 🪨 Ďakujeme za dôveru. Posielame fotky z prvého dňa a prehľad toho, čo bude nasledovať. | fotky montáže (hero + 2), dekor, aplikácia, dátum, meno kamenára; dnes zástupné texty [Calacatta Gold], [ostrovček + stena], [dátum], [meno] |
| `N/sablony/17-automatizacia-starostlivost.html` (dizajn) | Š | Starostlivosť o dosku v skratke | 🪨 Doske stačí utierka a saponát. Pozor si dajte len na štyri veci. | dátum montáže („doska je u vás týždeň“) |
| `N/sablony/06-automatizacia-po-realizacii.html` (dizajn) | Š | Ako sa vám žije s novou doskou? | 🪨 Hodnotenie vám zaberie dve minúty a pomôže ďalším pri výbere. Budeme radi aj za jednu fotku. | dátum montáže; Google place ID je natvrdo |

UTM, návrh: `utm_campaign=po-realizacii`.

### 4. Draft vs. live a schválenia
- **Nič sa nedá postaviť,** kým neexistuje udalosť alebo vlastnosť.
- **E-mail 08:**
  - Realisticky z CRM s Mariánovým schválením, alebo Marián ručne upraví duplikát šablóny (B:1163).
  - Variant v Klaviyu vyžaduje, aby CRM zapisovalo `foto_1` až `foto_3` do profilu.
- **E-maily 17 a 06:** Klaviyo flow na CRM udalosť (vyžaduje CRM PR), alebo tiež z CRM.
- **Ako pri A3:** tvrdé pravidlo pre profily a postup pri prvej udalosti. Žiadna testovacia montáž v produkčnom CRM.
- **Súhlas so zverejnením fotiek v 08 dnes nefunguje.** Oprava znamená zmenu textu (`update_property_link`) cez Codex a web PR, ktorý spracuje `?suhlas`.
- **Martin:** marketingový súhlas zákazníkov, úprava zásad (`ochrana-sukromia.md:94-100`), podmienka k VSrLFs, spustenie naživo.

### 5. Pasce
- **Tlačidlá súhlasu v 08** (`/realizacie?suhlas=ano|najprv-ukazat|nie`) sú obyčajné odkazy.
  - `choices()` sa volá bez `prop=` (B:1183-1186), takže sa súhlas do profilu nezapíše.
  - Web `?suhlas` ignoruje (`pages/Realizacie.tsx:533`), zákazník teda nevidí ani potvrdenie.
  - Je to v rozpore s meta poznámkou B:1164.
- **HTML komentár v 08:** riadok `sablony/08…:9` obsahuje `{{ person|lookup:'foto_1' }}`. Klaviyo ho môže vyhodnotiť, preto ho pred nahraním odstrániť alebo overiť renderom.
- **Vzorové fotky v 08** majú alt texty s Calacatta Gold.
- **E-mail 06:** odkaz „Poslať fotku“ vedie na `mailto:info@orostone.sk`, nie na reply-to ahoj@.
- **Ručný stav:** ak Marián montáž neoznačí ako `dokoncene`, nič neodíde.
- **Nočné odoslanie:** 08 nemá pred sebou dňové oneskorenie, takže môže odísť v noci.

## A7 Reaktivácia (22, 23, 24)

### 1. Spúšťač a zdroj udalosti
- **Spúšťač:** nový segment, dnes neexistuje.
  - Podmienky: člen VSrLFs dlhšie ako 90 dní A 0× Opened Email A 0× Clicked Email za posledných 90 dní, bez TKAHuh.
  - RdLKj8 používa podobnú časovú podmienku členstva, zostaviteľnosť segmentu v Klaviyu však treba overiť.
- **Zdroj:** Klaviyo. Metriky existujú (RCzcnU, TqZ5Tp, VdqXpS), segment ani flow nie.
- **Active on Site (VQs22v) nepoužívať.** Od marca 2026 nemá dáta a na webe nie je Klaviyo.js.
- **Segmentový flow nepridáva súčasných členov.** Prvý vstup bude okolo 8. 1. 2027.

### 2. Kroky, oneskorenia, filtre, podmienky ukončenia

| Krok | Čas | Šablóna | Podmienka |
|---|---|---|---|
| 1 | vstup do segmentu (90 dní) | 22 | – |
| 2 | o 30 dní, 09:00 (120 dní) | 23 | 0 otvorení a 0 klikov od vstupu do flowu |
| 3 | o 60 dní, 09:00 (180 dní) | 24 | 0 otvorení a 0 klikov od vstupu do flowu |
| po 24 | – | – | žiadne automatické suppress ani odhlásenie; meta B:1703 je v rozpore s pravidlami, rozhodne Martin |

Hodnoty time-delay akcií: 0 → 30 d → 60 d, do 09:00, `timezone=profile`.
- 22 odíde v okamihu vstupu do segmentu, teda aj v noci.
- Ak to nemá byť, pred 22 dať čakanie zarovnané na 09:00 (napríklad 1 d do 09:00), alebo nočné odoslanie prijať.

Filtre a ukončenie:
- **Flow filter:** „Opened Email zero times since starting this flow“ a „Clicked Email zero times since starting this flow“. Kontroluje sa pred každým krokom.
- **Bez TKAHuh.**
- **Súhlas:** filter „can receive email marketing, subscribed“. VSrLFs sú prihlásení (single opt-in), takže filter nikoho z nich nevyradí.
- **Re-entry:** návrh `reentry_criteria` {duration: 1, unit: alltime}, teda bez opakovaného vstupu.
- **Smart sending:** výslovne zapnutý.

### 3. Šablóny, odosielateľ, predmet, preheader

| Šablóna | Odosielateľ | Predmet | Preheader | Dynamické dáta |
|---|---|---|---|---|
| `N/sablony/22-automatizacia-reaktivacia-otazka.html` (dizajn) | Š | Riešite ešte kuchyňu? | 🪨 Jedným kliknutím nám dáte vedieť, v akej fáze ste, a budeme písať len to, čo sa vám hodí. | žiadne; 3× `{% update_property_link 'horizont' … %}` (do-3-mesiacov, 3-12-mesiacov, hotovo) → `/realizacie?horizont=…`, web zobrazí poďakovanie (`pages/Realizacie.tsx:533-543`) |
| `N/sablony/23-automatizacia-reaktivacia-realizacie.html` (dizajn) | Š | Tri realizácie, na ktoré sme hrdí | 🪨 Ukážeme kamenný krb, teplý travertín na tmavom ostrovčeku a svetlú dosku pri dreve. | žiadne; súhlas klientov z 7. 10. 2026 (B:1668) |
| `N/sablony/24-automatizacia-reaktivacia-rozlucka.html` (dizajn) | Š | Máme vám ešte písať? | 🪨 Ak chcete e-maily od nás dostávať ďalej, stačí jedno kliknutie. | žiadne; tlačidlo „Ostať v odbere“ je obyčajný odkaz na `https://orostone.sk/?odber=ponechat` |

UTM, návrh: `utm_campaign=reaktivacia`. Či Klaviyo pridá UTM aj k cieľu `update_property_link`: neoverené.

### 4. Draft vs. live a schválenia
- **Hotové 14. 10.:** šablóny 22 X8jULq, 23 RpGJMA, 24 YjhfKT a segment VGyNMu. 24 = obyčajný odkaz (Martin, 14. 10.).
- **Flow:** postaviť ako draft zo segmentu VGyNMu (pôvodne podmienené rozhodnutím o 24). Buď ostane obyčajný odkaz, alebo pribudne `update_property_link 'odber'`, čo znamená zmenu textu cez B a Codex a web PR, ktorý spracuje `?odber`. Potom postaviť flow naraz celý, so všetkými tromi správami.
- **Pred spustením:**
  1. Martinovo OK na spustenie, pred 8. 1. 2027. (Alert UHSrFj je pripravený: telo vyplnené, Marián opt-in potvrdil 13. 10. Klik v 22 ho spustí.)
- **Ak A7 nestihne 8. 1.:** ručné pridanie súčasných členov segmentu (v UI „add past profiles“) je odoslanie a potrebuje Martinovo výslovné OK.

### 5. Pasce
- **Klik na „do 3 mesiacov“ v 22** zaradí profil do XF7U3i a spustí alert UHSrFj Mariánovi.
- **horizont = hotovo:** naplánované kampane nevylučujú segment W8zMyZ, hoci meta B:1637 hovorí, že odberateľ s horizontom hotovo nedostáva e-maily o výbere dosky. Zmena publika naplánovaných kampaní je na Martinovi.
- **E-mail 24:** meta (B:1703) sľubuje vlastnosť `odber=ponechat`, ale tlačidlo ju nenastaví a homepage `?odber` nespracúva. Klik sa aspoň započíta ako klik.
- **Apple Mail** nafukuje otvorenia, takže časť neaktívnych do segmentu nevojde.
- **Limit profilov:** neaktívni zaberajú miesto, ale mazať odberateľov sa nesmie.

## A8 B2B (25, 26, 27)

### 1. Spúšťač a zdroj udalosti
- **Zdroj neexistuje.**
  - **Web:** len žiadosť o BIM/CAD v `ArchitectBlock`. Uloží sa ako quote s menom 'BIM/CAD Request' (`ArchitectBlock.tsx:71`) a nemá checkbox marketingového súhlasu. B2B stránka ani formulár nie sú.
  - **CRM:** heuristika `classifyLead` → 'b2b' (`web/lib/leadComm.ts:403-413`). Uloží sa len do `lead_drafts.lead_type` (`0157_lead_drafts.sql:69-71`), nie ako tag kontaktu.
  - **Klaviyo:** žiadny B2B zoznam, segment, vlastnosť ani formulár. Pole Organization je prázdne u všetkých 53 kontaktov vo VSrLFs. Jediný formulár VFvXjv je vzorový draft.
- **Existuje v Klaviyu dnes: nie.**
- **Klaviyo nemá tagy profilov.** „Tag B2B“ treba nahradiť novým zoznamom (flow spúšťaný zoznamom), alebo vlastnosťou `typ_kontaktu=b2b` so segmentom. Návrh: zoznam, lebo má jednoduchší spúšťač a jasný súhlas.

### 2. Kroky, oneskorenia, filtre, podmienky ukončenia

| Krok | Čas | Šablóna | Podmienka |
|---|---|---|---|
| 1 | hneď po vstupe | 25 | – |
| 2 | +7 dní, 09:00 | 26 | – |
| 3 | +21 dní, 09:00 | 27 | – |

Hodnoty time-delay akcií: 0 → 7 d → 14 d, do 09:00, `timezone=profile`. 25 môže odísť v noci, ak sa pred ňu nedá čakanie zarovnané na 09:00.

Filtre a ukončenie:
- **Súhlas:** filter „can receive email marketing, subscribed“.
- **Re-entry:** `reentry_criteria` {duration: 1, unit: alltime}.
- **Ukončenie:** playbook podmienku ukončenia nedefinuje.
- **Zoznamový flow** zachytí len ľudí pridaných po spustení.

### 3. Šablóny, odosielateľ, predmet, preheader

| Šablóna | Odosielateľ | Predmet | Preheader | Dynamické dáta |
|---|---|---|---|---|
| `N/sablony/25-automatizacia-b2b-podklady.html` (dizajn) | Š | Technický list a textúry pre váš projekt | 🪨 Posielame parametre podľa noriem EN, formáty, hrúbky a textúry dekorov na jednom mieste. | B2B príznak |
| `N/sablony/26-automatizacia-b2b-vzorky.html` (dizajn) | Š | Vzorky dekorov pre vaše štúdio | 🪨 Pošleme vám vzorky, ktoré klient vezme do ruky a uvidí pri svojom svetle. | B2B príznak |
| `N/sablony/27-automatizacia-b2b-showroom.html` (dizajn) | Š | Príďte s klientom vybrať konkrétnu platňu | 🪨 V kaštieli v Bošanoch pripravíme celé platne dekorov, ktoré pre klienta zvažujete. | B2B príznak |

UTM, návrh: `utm_campaign=b2b`.

### 4. Draft vs. live a schválenia
- **Blokuje to Martinovo rozhodnutie o vstupe a súhlase.** Možnosti:
  - B2B checkbox alebo formulár na webe cez `subscribe-newsletter` do nového zoznamu. Znamená to web PR (Turnstile sa nemení), Codex na text a deploy z main po dohode. Ak ID zoznamu pôjde cez Supabase secret, mení ho Martin.
  - Marián pridáva kontakty ručne.
- **Po rozhodnutí:**
  1. Vytvoriť prázdny zoznam.
  2. Vyriešiť TODO v 25 a 26 a šablóny nahrať.
  3. Postaviť draft so všetkými tromi správami.
  4. Naživo len po Martinovom OK.
- **Hromadný import** alebo tlačidlo v CRM by boli hromadným prídavkom do nového zoznamu. Len so súhlasom kontaktov a Martina.
- **E-mail 25 ako odpoveď na BIM/CAD žiadosť** (bez marketingového súhlasu) patrí do odpovede 1:1, nie do flowu. Rozhodne Martin.

### 5. Pasce
- **Hrúbky:** 25 uvádza „Hrúbky 6–30 mm“, e-shop predáva len 12 mm. Dostupnosť ďalších hrúbok potvrdí Marián (TODO B:1730).
- **Podmienky vzoriek pre štúdiá** (počet, cena, doprava) nie sú potvrdené (TODO B:1770).
- **CTA v 26** „Pozrieť dekory“ vedie na `/vzorky`.
- **BIM/CAD textúry:** e-mail 25 ich sľubuje na odpoveď. Treba určiť, kto ich posiela.
- **VSrLFs:** pridanie B2B kontaktu aj do VSrLFs by spustilo uvítaciu sériu a kampane.

## Spoločné pasce a postup v Klaviyu

### Postup stavby jedného flowu
1. **Predpoklady:**
   - Martin o danej automatizácii rozhodol.
   - Spúšťač existuje a má aspoň jednu reálnu udalosť (`get_metrics`, `query_metric_aggregates`).
   - Vlastnosti udalostí pre dynamické bloky sú skontrolované (`get_events`).
   - Každé Klaviyo MCP volanie má `model="claude-opus-5-5"`.
   - **Všetky správy flowu sú finálne a schválené.** Do flowu, ktorý môže ísť naživo, nepatrí zástupná ani nerozhodnutá správa.
2. **Text a HTML:**
   1. Finálny text v B.
   2. Pregenerovať `sablony/` a `texty/`.
   3. `nastroje/check_images.py` musí vypísať OK. Skript kontroluje hosting na orostone.sk a existenciu súboru pod `public/images/`. Že nové obrázky ležia v `public/images/email/`, treba skontrolovať ručne.
   4. PR s `@codex review`, merge do main.
   5. Nahrávať len verziu z main.
3. **Nahranie šablóny:** `create_email_template` s celým HTML zo `sablony/NN-*.html`.
   - Musí obsahovať PRE_PAD (90 × `&#847;&zwnj;&nbsp;&#8199;&shy;`, B:105), `{% unsubscribe_link %}` a pri 22 aj `{% update_property_link %}`.
   - Nič neskracovať ani ručne neprepisovať.
   - Potom skontrolovať `get_email_template` a `render_email_template`, pri dynamických blokoch s kontextom reálnej udalosti.
4. **Vytvorenie flowu:** `create_flow` naraz so všetkými akciami, každá akcia so statusom draft.
   - **Spúšťač, filtre a oneskorenia:** spúšťač a filtre podľa sekcie automatizácie. Oneskorenia s `timezone=profile` a `delay_until_time` 09:00 ako v SNJKTh.
   - **Výslovne nastaviť:**
     - `profile_filter` so súhlasom.
     - `reentry_criteria`.
     - Odosielateľa Š.
     - `transactional=false`.
     - `smart_sending_enabled` podľa sekcie (predvolená hodnota v API je true).
     - `add_tracking_params=true` (predvolená hodnota je false) a UTM.
   - **Preview text:** nastaviť ako v SNJKTh (overiť `get_flow_message` VLzuhC), aby sa preheader nezdvojil.
5. **Kontrola po vytvorení:** `get_flow` s `additional_fields=definition`, potom `get_flow_action` a `get_flow_message`.
   - `create_flow` šablónu klonuje. Zapísať nové ID šablóny a skontrolovať klon: PRE_PAD, odkazy, tagy.
   - Skontrolovať aj odosielateľa, `transactional=false` na každej správe, UTM, smart sending, oneskorenia a re-entry.
6. **Chyba po vytvorení:**
   - `update_email_template` vráti 404 a `update_flow_action` šablónu nezmení.
   - Krok sa ku existujúcemu flowu cez API pridať nedá. Ide to len v UI (Martin), alebo novým vytvorením flowu, pri ktorom vypadnú všetci, ktorí v ňom práve sú.
   - Postup: opraviť v repozitári, nahrať novú šablónu a draft vytvoriť znova.
   - Starý draft zmazať len vtedy, ak ho vytvorila tá istá relácia a nikdy nebol naživo. Inak sa opýtať Martina.
7. **Náhľady:** flow ostáva v drafte. Náhľady a testy (`create_template_preview_send_job`) len so súhlasom Martina, na kontrolu stačí render.
8. **Spustenie** len po Martinovom OK pre daný flow:
   - `update_flow` status=live nastaví flow **aj všetky jeho akcie**.
   - Hneď potom `get_flow` s `additional_fields=definition`: flow aj každá akcia send-email musia mať `live` a žiadna nesmie mať neočakávaný status.
   - PATCH vráti 200 aj vtedy, keď flow ostane v drafte kvôli nenakonfigurovanej akcii. Takú akciu nájsť a opraviť.
   - Ak má niektorá správa ostať vypnutá, hneď jej nastaviť `manual` cez `update_flow_action` a status znova prečítať.
9. **Interný alert:** `create_flow` vytvorí prázdnu notifikačnú šablónu, telo sa dá vyplniť len v UI. Príjemca musí opt-in potvrdiť e-mailom.
10. **Po spustení:**
    - Zapísať ID flowu, akcií, správ a šablón do `N/README.md` a do playbooku (`#stav`, `#program`).
    - Po 1–2 dňoch skontrolovať `get_flow_report` s konverznou metrikou Uu5JLg. Odhlásenia nad 1 % alebo sťažnosť na spam hlásiť Martinovi.

### Súhlas a transakčný status
- **Marketingový flow:** Klaviyo do neho pustí aj profily, ktoré sa nikdy neprihlásili. Každý draft preto dostane filter „can receive email marketing, subscription=subscribed“. Odstrániť ho možno len po Martinovom písomnom rozhodnutí a po úprave zásad.
- **Transakčný status:**
  - Všetkých 17 e-mailov (05, 06, 08, 10–17, 22–27) má `transactional=false` a transakčný status sa nežiada pre žiadny z nich.
  - Všetky majú marketingové CTA a odhlasovací odkaz.
  - Jediná transakčná správa v účte je interný alert UHSrFj.
- **Zásady ochrany súkromia** uvádzajú Klaviyo len pre newsletter (`ochrana-sukromia.md:94-100`) a marketing len s výslovným súhlasom (`:41`).
  - Od 14. 10. už v Klaviyu sú údaje o objednávkach a zákazníkoch zo Shopify, takže úprava zásad sa týka dát, ktoré už prúdia (Martin).
  - Údaje o ponukách a montážach z CRM by znamenali ďalšiu úpravu.

### Smart sending, časy, UTM
- **Smart sending** (pri e-maile okno 16 h):
  - V SNJKTh je vypnutý na 01 a zapnutý na 02, 07 a 09.
  - Na každej správe ho nastaviť výslovne.
  - Preskočené odoslania sa zapisujú do metriky Skipped Send (Uxmqfu).
- **Časy:**
  - Čakanie „X dní“ bez hodiny = X × 24 h. Čakanie „X dní do 09:00“ = X kalendárnych dní, odoslanie o 09:00 (Klaviyo Help 115002774932).
  - Texty s „včera“, „pred dvoma týždňami“ a „týždeň“ (11, 12, 14, 16, 17) preto sedia pri oneskoreniach do 09:00, ako sú uvedené vyššie.
  - Tichý režim pre e-mail v Klaviyu neexistuje, `sms_quiet_hours_enabled` je len pri SMS.
  - V noci môžu odísť správy bez dňového oneskorenia do 09:00: 15 (po 1 h), 22 (pri vstupe do segmentu), 25 (hneď) a 08.
- **UTM:**
  - Šablóny nemajú UTM natvrdo (grep `utm_` = 0).
  - Na správe nastaviť `add_tracking_params`, `utm_source=klaviyo`, `utm_medium=email`, `utm_campaign=<slug automatizácie>` a `utm_content=NN-slug`.
  - Web prenáša UTM do Shopify checkoutu len pri košíku platní (`context/CartContext.tsx:431-436`).
  - Checkout vzoriek (`createSampleCheckout`, `services/shopify/samples.ts:171-229`, `SampleOrderSection.tsx:106`) UTM nemá. Atribúcia z e-mailov sa pri vzorkách dostane po `/vzorky`, nie do objednávky. Zmena by bola web PR, ak ju Martin chce.

### Limit profilov
- **Stav:** 429 z 500 aktívnych profilov. Nové pridáva Shopify (každý nový zákazník) a pridávali by ich CRM udalosti.
- **Pred zapnutím každého nového zdroja udalostí:** odhadnúť počet nových profilov, porovnať s voľným miestom (71) a mať Martinovo OK.
- **CRM:** nikdy neposielať udalosti pre dopyty zmazané 12. 10.
- **Uvoľnenie miesta:** len mazaním dopytov (TKAHuh) so súhlasom Martina, nikdy mazaním odberateľov.

### Repozitár ↔ Klaviyo
- **Repozitár je zdroj pravdy.** Šablóny sa do Klaviya nahrávajú len z main a každá zmena textu ide najprv do repozitára.
- **`jazykova-kontrola.md`:** pred nahraním doplniť dve nezapísané zmeny.
  - 97e2bb2: pätička „Sídlo: Landererova 8…“ a riadok s firmou v 11, 14 a 16.
  - 53ffaf3: prefix 🪨 v preheaderoch.
- **README:89 (riadok 34)** hovorí, že e-mail 34 „do CRM ho treba ešte zapojiť“.
  - V skutočnosti je zapojený a nasadený v CRM: dávky so schválením cez `/komunikacia` (CRM `CLAUDE.md:78-82`, `docs/otazka-k-dopytu-2026-10-09.md`).
  - Opraviť na „zapojené v CRM“. Či už nejaká dávka odišla, overiť v CRM pred úpravou.
- **ID zo 14. 10.:** zapísať do README a playbooku integráciu 0eMvjm, Shopify metriky a automatické segmenty.

## Otvorené otázky pre Martina

1. **Kampaň 35:** 3 odhlásenia z 52 (5,8 %), sťažnosti 0. Rozhodnuté 14. 10.: kampaň 03 odíde podľa plánu 21. 10.
2. **Shopify → Klaviyo (pripojené 14. 10. 08:25 UTC):**
   - Pripojenie bolo zámerné (Martin, 14. 10.). Synchronizácia odberateľov zo Shopify je vypnutá (14. 10.), takže A2 a A4 zatiaľ dostanú len ľudia prihlásení v Klaviyu. Zapnúť ju do samostatného zoznamu je samostatné rozhodnutie.
   - Ako je nastavená synchronizácia odberateľov zo Shopify? Musí byť vypnutá alebo zapisovať do samostatného zoznamu, nikdy nie do VSrLFs.
   - Zapnutie prihlasuje profily vrátane historických a môže znova prihlásiť tých, ktorí sa v Klaviyu odhlásili. Ak ju chcete zapnúť, najprv porovnáme zákazníkov s 13 potlačenými profilmi (README:115).
   - Rozdiel v praxi: keď je vypnutá, A2 a A4 dostanú len ľudia prihlásení v Klaviyu (prakticky VSrLFs). So samostatným zoznamom ich dostanú aj kupujúci, ktorí dali súhlas v checkoute.
   - Je v Shopify › Settings › Checkout › Marketing options vypnuté predvolené zaškrtnutie súhlasu? Zodpovedá text zásadám (`:41`)? Súhlas dali 3 zo 4 kupujúcich vzoriek.
3. **Mapovanie revenue** ukazuje na Wix TSzMKT. Máme ho prepnúť na Shopify Uu5JLg?
4. **Plán Klaviya:** je to free, alebo platený Email s 5 000 e-mailmi?
5. **Súhlas pri A2, A4 a A5:**
   - Smú tieto e-maily ísť aj ľuďom bez marketingového súhlasu? Dovtedy majú všetky drafty súhlasový filter.
   - Kto upraví zásady (`:41`, `:94-100`)? Údaje zo Shopify už v Klaviyu sú.
6. **A2:**
   - Len platené vzorky, alebo aj bezplatné? Bezplatné potrebujú v CRM nový stav „Vzorka odoslaná“.
   - Platí odhad „Fulfilled + 4 dni“ ako „2 dni po doručení“?
   - Má 11 ísť bez podmienky „neposlal dopyt“?
   - Čakáme s A2 na dynamický blok v 10, alebo pôjde A2 natrvalo bez 10?
   - Vzorky z košíka platní A2 nepokryje. Vadí to?
7. **A2 a uvítacia séria:** má nový odberateľ v RdLKj8, ktorý si objedná vzorku, dostať aj A2?
8. **A4:**
   - Vypnúť vlastný e-mail Shopify o opustenom checkoute?
   - Ako má 15 hovoriť o doprave vzhľadom na kód VITAJTE?
   - Prijímame medzeru pri bezplatnej vzorke (15 a 16 môžu prísť aj tomu, kto si ju objednal cez #vzorka)?
9. **A3:** rozhodnuté 14. 10.: z CRM so schválením (ako e-mail 34).
   - Z Klaviya (CRM udalosti, nový Klaviyo kľúč v env CRM na Verceli), alebo z CRM ako schvaľované koncepty ako e-mail 34?
   - Čo s prekryvom 14 a 34?
   - Platí, že odberateľ VSrLFs, ktorý dostane ponuku, A3 nedostane? README:103 počíta s tým, že dopyty dostanú 12–14.
   - Má človek s druhou ponukou dostať sériu znova?
10. **A5:** rozhodnuté 14. 10.: 08, 17 aj 06 z CRM so schválením.
    - Pôjde 08 z CRM s Mariánovým schválením?
    - Pôjdu 17 a 06 z Klaviya, alebo z CRM?
    - Vylúčiť z A5 odberateľov VSrLFs, ako káže pravidlo pre dopyty?
    - Má sa súhlas so zverejnením fotiek ukladať do profilu (`update_property_link` a spracovanie `?suhlas` na webe)?
11. **A7, rozhodnúť pred stavbou:** tlačidlo v 24 = obyčajný odkaz (Martin, 14. 10.).
    - Má tlačidlo v 24 nastavovať `odber=ponechat` a má homepage spracovať `?odber`, alebo ostane obyčajný odkaz?
    - Čo s ľuďmi, ktorí nereagujú ani na 24? Meta B:1703 navrhuje suppress, podľa pravidiel to ide len s vaším súhlasom.
    - Vylúčiť segment W8zMyZ (horizont = hotovo) z naplánovaných kampaní?
12. **UHSrFj:** vyriešené 13. 10. Telo alertu je vyplnené a Marián opt-in potvrdil. Netreba nič.
13. **A8:**
    - Ako sa B2B kontakt so súhlasom dostane do Klaviya: formulár alebo checkbox na webe do nového zoznamu, alebo ho ručne pridá Marián?
    - Má sa 25 posielať aj ako odpoveď na BIM/CAD žiadosť mimo flowu?
14. **Na potvrdenie od Mariána:**
    - Hrúbky 6–30 mm (B:1730).
    - Podmienky vzoriek pre štúdiá (B:1770).
    - Fotky celej platne v P. S. e-mailu 13 (B:1335).
    - Telefón v podpise: +421 917 588 738, alebo +421 911 891 875 ako v e-maile 34?
    - `mailto:info@` v 06, alebo ahoj@?
15. **Sending doména:** overíte v UI Klaviya autentifikáciu domény ahoj.orostone.sk? API ukazuje DNS záznamy ako neoverené.
