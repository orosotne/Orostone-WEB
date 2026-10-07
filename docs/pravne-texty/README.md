# Právne texty – jazyková kontrola

Kópia viditeľného textu právnych dokumentov webu orostone.sk. Slúži len na jazykovú kontrolu v pull requeste (`@codex review`), lebo Codex vidí iba zmenené riadky a samotné stránky sú v kóde.

- **Zdroj pravdy sú stránky** v `pages/`: `VOP.tsx`, `PrivacyPolicy.tsx`, `CookiesPolicy.tsx`, `OdstupeniOdZmluvy.tsx`, `ReklamacieAVratenie.tsx`, `DopravaAPlatba.tsx`, `PodmienkyRezervaceCeny.tsx`.
- Súbory v `texty/` sa ručne neupravujú. Opravy idú do stránok a kópia sa obnoví skriptom `export.cjs` (návod je v jeho hlavičke) po `npm run build`.
- Pripomienky a ich stav sa zapisujú do `jazykova-kontrola.md`: `nové` → `prijaté` / `zamietnuté` (s dôvodom) → `zapracované`. Zapracúva Claude, sporné prípady a všetko, čo by menilo právny význam, rozhoduje majiteľ.

## Pravidlá kontroly

- **Kontroluje sa jazyk:** pravopis, gramatika, interpunkcia, typografia, spisovnosť a zrozumiteľnosť. Právny význam, rozsah práv a povinností ani lehoty sa nemenia. Pri pochybnosti stačí otázka.
- **Definované pojmy s veľkým začiatočným písmenom sú zámerné:** Klient, Spotrebiteľ, Tovar, VOP, ARS (VOP) a Zákon (ochrana osobných údajov).
- **Citácie predpisov:** zákon č. 108/2024 Z. z., § 3 ods. 1 písm. i), čl. 6 ods. 1 písm. b) GDPR.
- **Typografia:** slovenské úvodzovky „…“, krátka pomlčka s medzerami ( – ), nezlomiteľná medzera v číslach a pri jednotkách (150 €, 50 km), dátumy v tvare 7. 10. 2026, „e-mail“.
- **Texty o súhlase s cookies** sú rozhodnutím majiteľa. Hodnotí sa len ich jazyk, nie súlad so správaním webu.
