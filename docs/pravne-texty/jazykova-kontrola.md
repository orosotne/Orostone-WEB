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
