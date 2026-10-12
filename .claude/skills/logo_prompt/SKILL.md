---
description: Pôvodných 7 promptov na návrh loga s Claude z Instagramu (@godofprompt). Spusti /logo_prompt na ich výpis, alebo /logo_prompt <značka a jej popis> na verziu vyplnenú pre konkrétnu značku.
argument-hint: "[značka a jej popis]"
disable-model-invocation: true
---

# Logo prompty: 7 krokov od nápadu po kritiku

Zdroj: Instagram [@godofprompt](https://www.instagram.com/p/DeSWi1XFovF/), 9. 10. 2026 (pôvodne @MusfaraAi na X). Prompty nižšie sú v pôvodnom znení.

## Čo urobiť po spustení

- **Bez argumentu:** Vypíš všetkých 7 promptov presne v pôvodnom znení, každý v samostatnom bloku kódu, aby sa dali skopírovať. Pod ne pridaj krátky postup zo sekcie „Ako ich používať“.
- **S argumentom** (`$ARGUMENTS` je názov alebo popis značky): Vypíš prompty vyplnené pre túto značku. Nahraď všetky hranaté zátvorky a pod prompty vymenuj, čo si doplnil odhadom, aby to používateľ mohol opraviť. Prompty nechaj po anglicky, vysvetlenia píš po slovensky.

## Pôvodné prompty

### Before you start

Claude plans your logo on paper: the concept, shapes, colors, and type. To see it drawn, paste the Step 7 prompt into an image tool.

### Step 1. Define the brand idea

This sets the concept and the color palette together, with a reason behind every choice.

```text
Act as a senior brand identity designer. I need a logo concept for [brand name] that expresses [core value] and appeals to [audience]. It should feel [emotion/quality], look timeless, and be recognizable anywhere in the world, with no trendy effects or cliché imagery. Describe the concept, the shapes you would use, and a color palette (primary, secondary, accent) with hex codes. For every choice, explain why it fits the brand and what it makes people feel.
```

### Step 2. Find the symbol

It builds a simple symbol around your brand's mission and explains what it stands for.

```text
Propose a logo symbol for [brand name] drawn from [idea/mission]. Keep it simple enough to recognize at a glance, but with a deeper meaning that tells the brand's story. Tell me what the symbol stands for, how it ties back to the brand, and how it could be built from basic shapes.
```

### Step 3. Design the wordmark

This designs a name-only logo that works without a symbol, using letter spacing and negative space.

```text
Create a wordmark for [brand name] that works without any symbol. Build it around distinctive letterforms, careful spacing between letters, and a smart use of negative space. Recommend the typeface style, weight, and letter spacing, and name any custom tweaks to individual letters that would make it unique.
```

### Step 4. Refine to luxury minimal

It strips the design down to clean geometry in black, white, and a touch of gold.

```text
Refine the logo for [brand name] into a minimalist luxury version: clean geometry, exact spacing, and a restrained palette of black, white, and a touch of gold. Match the polish of the best luxury brands. Describe the final mark, its proportions, and the exact hex codes.
```

### Step 5. Make it scale

This turns the logo into a system with a primary, secondary, and icon version that holds up at any size.

```text
Turn the logo for [brand name] into a flexible system that holds up everywhere, from a favicon and app icon to a website header and printed merchandise. It must stay clear and recognizable at tiny and huge sizes. Define the primary logo, a secondary logo, and an icon-only version, and say when to use each.
```

### Step 6. Pressure test it

It reviews your concept like a creative director and lists what's generic, what won't scale, and what to change.

```text
Act as a creative director at a leading branding agency. Review this logo concept for [brand name]: [paste concept]. Point out what feels generic, what is memorable, what will not scale, and what a client would push back on. Then list the 3 changes that would make it feel like a premium, agency level logo.
```

### Step 7. Turn it into an image prompt

The last step turns your final concept into one detailed prompt to paste into an image generator.

```text
Using the final logo concept for [brand name] above, write 1 detailed prompt I can paste into an image generator. Include the style, the shapes, the exact hex codes, the background, and the composition. Also list 3 things the generator should avoid, such as extra text, gradients, or clutter.
```

## Ako ich používať

- Prompty vkladaj postupne, jeden po druhom, a všetky do jedného chatu. Kroky 4 až 7 nadväzujú na predchádzajúce odpovede.
- Po každej odpovedi vyber, čo sa ti páči, a dolaď to, kým pôjdeš ďalej.
- Kroky 2 a 3 sú dve cesty, symbol a logo len z písmen. Jednu z nich môžeš vynechať.
- V kroku 6 môžeš namiesto `[paste concept]` napísať „the concept above“. Potom pošli `Apply those 3 changes and summarize the final concept.`, aby krok 7 vychádzal z opravenej verzie.
- Krok 4 ťahá logo k luxusu v čiernej, bielej a zlatej. Pri hravej značke ho uprav, napríklad na „bold, cheerful palette, playful and confident, not like a luxury brand“.
- Nástroje, ktoré vedia kresliť, môžu obrázok vytvoriť hneď po kroku 1. Krok 7 potom netreba, stačí napísať `Draw the final logo on a plain white background.`
