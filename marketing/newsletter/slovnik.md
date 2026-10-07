# Slovník a jazykové pravidlá – newsletter Orostone

Spoločný zdroj pre Claude aj Codex. Platí pre všetky texty v `texty/` a `sablony/`.
Keď sa chyba opakuje, doplňte sem pravidlo s príkladom (sekcia 7).

Podrobný manuál značky: skill `copy-orostone`. Tento súbor z neho preberá to, čo platí pre e-maily.

---

## 1. Oslovenie a tón

- **Vykáme.** V hromadných e-mailoch píšeme *vy, vám, váš* **s malým v**. Veľké „Vy“ patrí do osobného listu jednému adresátovi.
- **Oslovenie:** „Dobrý deň,“ a text pokračuje na ďalšom riadku **malým písmenom** („ďakujeme, že…“).
- **Rozlúčka:** „S pozdravom“ bez čiarky, pod ňou meno.
- **Tón:** pokojne, vecne, presne. Kratšie až stredne dlhé vety. Bez pátosu, bez výpredajového tónu, bez ospravedlňovania ceny.
- Každé tvrdenie má dôvod: *vlastnosť → praktický dôsledok → význam pre klienta*.

## 2. Gramatika, na ktorú si dávame pozor

| Pravidlo | Správne | Nesprávne |
|---|---|---|
| **svoj / váš** – ak je vlastník podmetom vety, použite *svoj* | Pozrite si vzorku pri **svojom** svetle. | ~~pri vašom svetle~~ |
| *váš* ostáva, keď podmetom je niekto iný | Pripravíme cenu pre **váš** projekt. | – |
| zvratné *si* pri slovesách ako *pozrieť si, objednať si* | Medzitým **si** môžete pozrieť realizácie. | ~~môžete pozrieť realizácie~~ |
| predložky so/zo/vo/ku pred ťažkou výslovnosťou | **so** sinterovaným, **vo** veľkej ploche, **ku** krémovým | ~~s sinterovaným~~ |
| čiarka pred vedľajšou vetou (že, aby, keď, ak, ktorý…) | Budeme radi, **ak** nám napíšete. | – |
| porovnanie bez slovesa je bez čiarky | viac než katalóg · tvrdší než oceľ | ~~viac, než katalóg~~ |
| *odpovedzte* (od *odpovedieť*) je správne | Odpovedzte na tento e-mail. | – |
| *kvôli* je spisovné | kvôli nožom | – |

## 3. Typografia

| Prvok | Správne | Nesprávne |
|---|---|---|
| Úvodzovky | „text“ | ~~"text"~~ · ~~“text”~~ · ~~»text«~~ |
| Pomlčka vo vete | slovo – slovo (krátka pomlčka s medzerami) | ~~—~~ (dlhá anglická) · ~~-~~ (spojovník) |
| Rozsah čísel | 1–2 vety (bez medzier) | ~~1-2~~ |
| Spojovník | e-mail · e-shop | ~~email~~ · ~~eshop~~ |
| Rozmer | 3200 × 1600 mm (znak ×, medzery) | ~~3200x1600mm~~ |
| Percentá | 5 % · pod 0,1 % (medzera pred %) | ~~5%~~ · ~~0.1%~~ |
| Cena | 2,50 € | ~~2.50€~~ · ~~€2.50~~ |
| Násobok | 2× mesačne | ~~2x mesačne~~ |
| Dátum | 7. októbra 2026 · 7. 10. 2026 | ~~7.10.2026~~ |
| Skratky | P. S. · s. r. o. · napr. | ~~PS~~ · ~~s.r.o.~~ |

Nezlomiteľné medzery (napr. za predložkou „v“ na konci riadku) rieši Claude v HTML šablónach. V `texty/` ich nekontrolujte.

## 4. Slovník značky

### Používame

sinterovaný kameň · pracovná doska · ostrovček · zástena · dekor · povrch · platňa · vzorka · veľká plocha · nízka nasiakavosť · bez impregnácie · každodenné používanie · orientačné cenové rozpätie · pôdorys · realizácia · showroom · kamenár

- **doska × platňa:** *pracovná doska* je hotový výrobok v kuchyni. *Platňa* je celý formát materiálu (3200 × 1600 mm). Dosku na krájanie voláme *doštička*, aby sa to neplietlo.
- **realizácia** = hotová kuchyňa u klienta (skutočné fotky, nie render).
- **showroom** = Bošany, renesančný kaštieľ.
- **kamenár** = partner, ktorý dosku vyrobí a namontuje. Orostone sám nemontuje.

### Opatrne – iba s konkrétnym dôvodom v tej istej vete

luxus · prémiový · exkluzívny · nadčasový · ikonický

### Nepoužívame

absolútny luxus · wow efekt · interiér vašich snov · revolučné riešenie · nezničiteľný · úplne bezúdržbový · navždy ako nový · dizajnový statement · posledná šanca · len dnes · výpredaj

### Trhové výrazy – nie v e-mailoch

umelý kameň · keramická doska · technický kameň · veľkoformátová keramika. Tieto výrazy patria do SEO. V e-mailoch píšeme *sinterovaný kameň*.

### Názvy dekorov a povrchov

- V texte: **Taj Mahal, Roman Travertine, Calacatta Gold** (veľké začiatočné písmená). VEĽKÝMI písmenami len v štítku produktovej karty.
- Názvy dekorov a povrchov (Silk, Matt Ultrasoft) sa neprekladajú ani neskloňujú: *v dekore Taj Mahal*, *povrch Silk*.

## 5. Tlačidlá (CTA)

Neurčitok, ktorý hovorí, čo sa stane po kliknutí:

Objednať vzorku · Získať orientačnú cenu · Poslať pôdorys · Pozrieť dekory · Pozrieť realizácie · Dohodnúť obhliadku · Napísať hodnotenie · Poslať fotku

Nie: ~~Kliknite sem~~ · ~~Zistiť viac~~ · ~~Neváhajte~~

Platí to aj pre textový odkaz pod tlačidlom (*Pozrieť cenník*, nie ~~Cenník~~). Text tlačidla nech má do ~25 znakov, dlhší sa na úzkom mobile zalomí do dvoch riadkov.

## 6. Predmet a preheader

- Predmet má približne do 50 znakov, bez výkričníka, bez emoji, bez VEĽKÝCH PÍSMEN a bez bodky na konci.
- Preheader predmet dopĺňa, neopakuje ho. Je to celá veta s bodkou.
- Veta nie je ani samostatný výpočet („Svetlo, skrinky a veľkosť plochy.“), ani nepriama otázka s bodkou („Prečo doska nepotrebuje impregnáciu.“). Pomôže sloveso: *Vysvetlíme, prečo…* · *Ukážeme, ako…* · *Doske stačí…*
- Preheader má približne do 100 znakov. Dlhší text e-mailový klient aj tak skráti.

## 7. Čo nie je chyba

- „Dobrý deň,“ a malé písmeno na ďalšom riadku.
- *vy, vám, váš* s malým v.
- Anglické názvy dekorov a povrchov.
- Zástupné texty v [hranatých zátvorkách] – doplní ich Marián pred odoslaním.
- *showroom, newsletter, e-shop* – zaužívané slová v komunikácii značky.
- Riadky „[alt fotky: …]“ sú popisy obrázkov pre čítačky. Kontrolujte ich jazyk, nie formu.

## 8. Rozhodnutia z kontrol

Pravidlá, ktoré vznikli pri kontrole a platia ďalej. Najnovšie hore.

| Dátum | Pravidlo | Príklad |
|---|---|---|
| 7. 10. 2026 | Viacnásobný podmet: ak prísudok stojí **za** podmetom, je v množnom čísle. Ak stojí **pred** ním, môže sa zhodovať s najbližším členom (obe podoby sú správne). Pri *každý … a každý* je prísudok v jednotnom čísle. | Utierka a saponát stačia. · Stačí víno, citrón a vaše svetlo. · Každá otázka a každá fotka nám pomáha. |
| 7. 10. 2026 | Tlačidlo aj textový odkaz pod ním je neurčitok (sekcia 5) | Prečítať celý návod · Prečítať viac o sinterovanom kameni |
| 7. 10. 2026 | Medzi dvoma vetnými členmi spojenými jednoduchým *alebo* čiarku nepíšeme | či sú všetky ceny s DPH alebo bez nej |
| 7. 10. 2026 | Podmienky spracovania nie sú suroviny: výpočet nesmie miešať, z čoho vec je a ako vzniká | vzniká pôsobením tlaku a teploty na minerály |
| 7. 10. 2026 | Preheader je celá veta. Výpočet alebo nepriama otázka s bodkou nestačí (sekcia 6). | Vysvetlíme, čo je v cene, čo porovnávať a na čo sa pýtať… |
| 7. 10. 2026 | Prísudkové prídavné meno sa zhoduje s podmetom | Ktorá z troch kuchýň je vám najbližšia? |
| 7. 10. 2026 | *sprievodca* sa skloňuje podľa vzoru hrdina | Prečítať celého sprievodcu |
| 7. 10. 2026 | Kalky: nie *fungovať k niečomu*, ale *hodiť sa k niečomu*; nie *robiť rozdiel*, ale *rozhodovať o…* | dekory, ktoré sa k nej hodia najlepšie |
| 7. 10. 2026 | *v odpovedi*, nie *odpoveďou* | V odpovedi mi pošlite fotku kuchyne. |
| 7. 10. 2026 | *chémia* je odbor. Pri konkrétnych látkach píšeme *prostriedky*, *látky* | jediné bežne dostupné prostriedky, ktoré povrch poškodia |
| 7. 10. 2026 | Výpočet má jednotnú stavbu: buď samé menné spojenia, alebo samé vety | zadanie, zvolený dekor a výsledok vo veľkej ploche |
| 7. 10. 2026 | Namiesto „dávať zmysel v…“ a úradného „z hľadiska…“ radšej slovesá | aby výsledok dobre vyzeral, bol praktický v každodennom používaní a mal rozumnú cenu |
| 7. 10. 2026 | Väzby *spokojný s niečím* a *prejsť si niečo s niekým* | ako ste s doskou spokojní · otázky, ktoré si prejdeme s každým klientom |
| 7. 10. 2026 | Nie „materiálový pocit“, ale „dojem prírodného materiálu“ | priniesť textúru a dojem prírodného materiálu |
| 7. 10. 2026 | Pri slovese v rozkaze nevynechávajte predmet | Pár kvapiek dajte na vzorku… Potom vzorku utrite. |
| 7. 10. 2026 | Pomlčka vo vete je krátka (–) s medzerami | Orostone je sinterovaný kameň pre kuchyne a interiéry – pracovné dosky, ostrovčeky a zásteny. |
| 7. 10. 2026 | *svoj*, ak je vlastník podmetom | Vzorku si preto pozrite pri svojom svetle. |
| 7. 10. 2026 | Doska na krájanie = *doštička* | Krájajte na doštičke. |
| 7. 10. 2026 | *kliknutie* namiesto hovorového *klik*; *zásuvka* namiesto *šuplík* | Odhlásiť sa dá jedným kliknutím. |
