# Audit webu podľa Modern Web Guidance

Dátum: 15. 11. 2026 · nástroj: [Modern Web Guidance](https://github.com/GoogleChrome/modern-web-guidance) 1.0.0 od Google Chrome (skill verzia 2026_11_09) · kód: vetva `main` (commit acc44b4)

## V skratke

Web je s Modern Web Guidance **väčšinou v súlade**. Automatická kontrola (`legacy-scan`) našla jedinú vec a tá je falošný poplach. Pri ručnej kontrole podľa návodov som našiel **3 rýchle opravy** (formuláre, farebný režim prehliadača), **3 väčšie témy na neskôr** (dialógy, karusely, bezpečnostná hlavička CSP) a jednu upratovaciu drobnosť. Nič z toho nie je havária a nič som zatiaľ neopravoval.

Výkon (rýchlosť načítania, skákanie stránky) je na tom veľmi dobre, tam návody nič podstatné nepridávajú.

## Ako som postupoval

1. Spustil som `npx modern-web-guidance@latest legacy-scan .`. Kontroluje 33 návodov (35 pravidiel), čo je asi 20 % celého katalógu, a hľadá v kóde staré vzory, ktoré sa dnes robia inak.
2. Zvyšok som prešiel ručne: prečítal som návody pre oblasti, ktoré e-shop používa (formuláre, dialógy a vysúvacie panely, karusely, obrázky a priority načítania, písmo, prístupnosť, farebný režim prehliadača, bezpečnosť) a porovnal ich s kódom.
3. Nespúšťal som Lighthouse ani meranie na živom webe a neskúšal som nič na reálnom telefóne. Všetko vychádza z čítania kódu.

## Výsledok automatickej kontroly

| Nález | Súbor | Verdikt |
|---|---|---|
| `dark-mode-toggle`: prepínač témy ukladá voľbu do localStorage a nemení `<meta name="color-scheme">` | `context/ThemeContext.tsx:32` | **Falošný poplach.** Nejde o svetlý a tmavý režim, ale o dve palety „classic“ a „organic“. Návod sám hovorí, že prepínanie paliet sa nepočíta. Navyše tú tému dnes nič nepoužíva (pozri bod 7). |

**Stav k 15. 11. 2026:** body 1 až 3 sú opravené v tom istom PR (#198), so súhlasom Martina.

## Zistenia podľa priority

### Vysoká priorita (malá práca, hneď to pomôže)

**1. Formulár „Odstúpenie od zmluvy“ má popisky neprepojené s políčkami**
`pages/OdstupeniOdZmluvy.tsx` (meno, adresa, e-mail, telefón, IBAN a ďalšie)

- Čo je zle: `<label>` nemá `htmlFor` a `<input>` nemá `id`. Čítačka obrazovky pri políčku nepovie, čo doň patrí, a klik na popisok nepresunie kurzor do políčka. Chýba aj `autoComplete`, takže prehliadač nevie ponúknuť uložené meno, adresu, e-mail a telefón.
- Čo spraviť: každej dvojici dať `id` a `htmlFor` a doplniť `autoComplete="name"`, `"street-address"`, `"email"`, `"tel"`.
- Prečo: návod `forms` hovorí „DO always associate `<label>` with its input using `for` and `id`“ a „DO use the `autocomplete` attribute to specify expected data“. Je to zákonný formulár, takže má byť použiteľný pre každého.

**2. Povedať prehliadaču, že web je len svetlý**
`index.html`, `index.css`

- Čo je zle: web nikde nemá `color-scheme`. Niektoré prehliadače (Chrome s automatickým tmavým režimom, Samsung Internet, časť vstavaných prehliadačov v aplikáciách) si potom web „stmavia“ samy a farby kameňov aj zlatá vyzerajú inak, než ste navrhli. Systémové prvky (posuvníky, políčka formulárov) sa môžu prefarbiť na tmavo.
- Čo spraviť: do `<head>` pridať `<meta name="color-scheme" content="light">` a do CSS `:root { color-scheme: light; }`. Navyše odporúčam (to je moja rada, nie z návodu) `<meta name="theme-color" content="#FFFFFF">`, aby horná lišta prehliadača na mobile mala farbu webu.
- Prečo: návod `browser-ui-theming`: „Use `color-scheme` to have browser UI adapt to light/dark mode.“ Pre web, ktorý má len svetlú verziu, je správna hodnota `light`.

**3. Drobnosti vo formulároch v pätičke a vo vyhľadávaní**

- `components/Layout/Footer.tsx:105` (prihlásenie na novinky): chýba `autoComplete="email"`. Políčko má písmo 14 px (`text-sm`), takže iPhone pri ťuknutí stránku priblíži. Stačí na mobile 16 px.
- `components/Layout/SiteHeader.tsx:285` (vyhľadávanie): `type="text"` zmeniť na `type="search"` a pridať `enterKeyHint="search"`, aby klávesnica na mobile ukázala tlačidlo „Hľadať“.
- Prečo: návod `forms` („DO use `enterkeyhint` to set the Enter key label“, príklad vyhľadávania s `type="search"`). Priblíženie pri 14 px je známe správanie iOS (skill `mobile-native`).

### Stredná priorita (väčší zásah, oplatí sa naplánovať)

**4. Dialógy a vysúvacie panely postavené ručne namiesto natívneho `<dialog>`**
Košík (`CartDrawer`), galéria (`ProductLightbox`), nastavenia cookies (`CookieSettings`), vyskakovacie okná (`NewsletterPopup`, `DiscountPopup`), `ArchitectBlock`, `Realizacie`

- Ako je to dnes: každý je `div` s `role="dialog"` a `aria-modal`, s ručne napísaným Escape, presunom kurzora a zamknutím posúvania. Funguje to a je to spravené starostlivo.
- Čo odporúča návod: natívny `<dialog>` otvorený cez `showModal()`. Prehliadač sám spraví zvyšok stránky „neaktívnym“ (Tab ani čítačka obrazovky sa nedostanú za dialóg, čo ručné riešenie úplne nezaručí), vráti kurzor tam, odkiaľ sa dialóg otvoril, a podporí aj gesto späť na Androide. Návod `dialog`: „The browser provides: inert page, focus containment, top layer, `::backdrop`, `Esc` and back-gesture dismissal, and focus return to the invoker.“
- Na čo dať pozor: prechod zasiahne animácie (Framer Motion pri zatváraní), pravidlá pre chat (`data-aipredajca-hide`) a testy v `scripts/tests`. Odporúčam začať jedným jednoduchým dialógom (nastavenia cookies), overiť ho na iPhone a Androide a až potom ostatné.
- Zamknutie posúvania (`hooks/useScrollLock.ts`) zatiaľ **nechať**. Návod síce neodporúča `overflow: hidden` na `body`, ale jeho náhrada (`overscroll-behavior` na pozadí dialógu) podľa samotného návodu v Safari zatiaľ nefunguje, a väčšina vašich návštevníkov z reklám je na iPhone.

**5. Karusely so skrytým posuvníkom**
`ProductSwitcher`, `ApplicationSection`, galéria v `HeroSection`, rad dekorov a Instagram na domovskej stránke (`home.css`), mega menu

- Čo je zle: posuvník je skrytý (`scrollbar-hide`, `::-webkit-scrollbar { display: none }`). Na dotyku to nevadí, ale na počítači bez touchpadu sa dá posúvať len vtedy, ak sú vedľa šípky alebo body. Produktová galéria šípky má, pri ostatných treba overiť.
- Čo spraviť: pri každom karuseli overiť, že má tlačidlá Predchádzajúci/Ďalší (natívne `<button>` s popisom), a karuselom, ktoré sú samostatnou sekciou, doplniť `aria-roledescription="carousel"` a popis slidov (dnes to nemá žiadny).
- Prečo: návod `browser-ui-theming` („DON'T use the `scrollbar-width` with any value other than `auto`, unless another accessible option is provided to scroll content“) a návod `carousel` („Use HTML `<button>` elements for previous/next controls … in every browser“).

**6. Chýba bezpečnostná hlavička Content-Security-Policy**
`vercel.json`

- Ako je to dnes: web posiela dobré základné hlavičky (HSTS, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy), ale nie CSP. CSP je zoznam, odkiaľ smie stránka načítať skripty, a je to hlavná obrana, keby sa do stránky niekedy dostal cudzí kód.
- Čo spraviť: kvôli GTM, Meta Pixelu, Klaviyu, Turnstile a chatu začať hlavičkou `Content-Security-Policy-Report-Only` (len hlási, nič neblokuje), pár týždňov zbierať hlásenia a až potom ju zapnúť naostro. Je to zmena na produkcii, takže až s vaším súhlasom.
- HTML z Shopify (popis produktu) a z blogu sa vkladá cez `dangerouslySetInnerHTML` bez čistenia. Obsah je váš, takže riziko je nízke. Ak by sa tam raz dostal obsah od tretích strán (recenzie, komentáre), treba ho čistiť (návod `sanitize-untrusted-html`).

### Nízka priorita (upratovanie)

**7. Nepoužívaná téma „classic/organic“**
`context/ThemeContext.tsx` nastavuje `data-theme` na `body`, ale žiadne CSS ani komponent ho nepoužíva a `toggleTheme` nikto nevolá. Dá sa odstrániť. Zmizne tým aj falošný nález z automatickej kontroly.

## Čo je už v súlade

- **Hlavný obrázok (LCP):** hero na domovskej stránke sa prednačítava v AVIF s `fetchpriority="high"`, prvé fotky produktu a kariet tiež. Ostatné obrázky majú `loading="lazy"`, `decoding="async"` a rozmery, takže stránka neskáče.
- **Písmo:** Montserrat je na vlastnom serveri, prednačítaný, s `font-display: swap` a s upraveným záložným písmom (`size-adjust`, `ascent-override`), aby sa text pri načítaní nehýbal.
- **Posúvanie:** všetky „scroll“ poslucháče sú `passive`, takže nespomaľujú posúvanie.
- **Pohyb:** animácie rešpektujú „obmedziť pohyb“ (`prefers-reduced-motion`) na zhruba 30 miestach.
- **Hlavné formuláre** (vzorky, B2B pre kamenárstva, vyskakovacie okná) majú prepojené popisky, správne typy políčok a `autoComplete`.
- **Dialógy** majú Escape, presun kurzora a návrat kurzora, hoci ručne (pozri bod 4).
- **Súkromie:** analytika sa spúšťa až po súhlase (Consent Mode s predvoleným „denied“).
- `lang="sk"`, `viewport-fit=cover`, preconnect na Shopify CDN, dlhé cache pre písma a assety.

## Navrhované poradie

1. Body 1 až 3 v jednom malom PR (asi hodina práce, žiadne riziko pre SEO ani tracking).
2. Bod 7 pri najbližšej príležitosti.
3. Bod 5 (overenie šípok pri karuseloch).
4. Bod 4 postupne, jeden dialóg za druhým, s testom na telefóne.
5. Bod 6 najprv v režime „len hlásiť“, až potom naostro.

## Ako skill používať ďalej

Skill je v repe (`.agents/skills/modern-web-guidance`, odkaz v `.claude/skills/modern-web-guidance`). Claude ho pri práci na HTML, CSS a JavaScripte zavolá sám, vyhľadá si návod (`npx -y modern-web-guidance@latest search "…"`) a pri výsledku napíše, ktorý návod použil. Pravidlá z CLAUDE.md a STYLE_GUIDE.md majú stále prednosť.
