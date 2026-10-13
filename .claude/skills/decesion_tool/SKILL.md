---
description: Pôvodných 5 premortem promptov z Instagramu (@getintoai) na preverenie plánu alebo rozhodnutia s Claude. Spusti /decesion_tool na ich výpis, alebo /decesion_tool <plán> a premortem prebehne rovno na tvojom pláne.
argument-hint: "[plán: čo, termín, rozpočet, čo je úspech]"
disable-model-invocation: true
---

# Decision tool: premortem v 5 krokoch

Zdroj: Instagram [@getintoai](https://www.instagram.com/p/DePKBh4GCQF/), 8. 10. 2026. Prompty nižšie sú v pôvodnom znení.

## Čo urobiť po spustení

- **Bez argumentu:** Vypíš všetkých 5 promptov presne v pôvodnom znení, každý v samostatnom bloku kódu, aby sa dali skopírovať. Pod ne pridaj krátky postup zo sekcie „Ako ich používať“.
- **S argumentom** (`$ARGUMENTS` je plán alebo rozhodnutie): Premortem urob rovno tu a odpovedaj po slovensky.
  1. Ak v pláne chýba termín, rozpočet alebo to, ako vyzerá úspech, opýtaj sa na chýbajúce údaje jednou otázkou a počkaj na odpoveď. Prompt z kroku 1 ich vyžaduje.
  2. Potom urob krok 1, akoby používateľ poslal jeho prompt s plánom namiesto hranatej zátvorky. Drž sa ho doslova: 7 príčin zoradených od najpravdepodobnejšej, pri každej všetky štyri body, žiadne všeobecné rady a žiadne upokojovanie.
  3. Kroky 2 až 5 rob po jednom, keď o ďalší krok používateľ požiada. Na konci každého kroku jednou vetou ponúkni ten nasledujúci.

## Pôvodné prompty

### Why you need this

Ask Claude "Is this a good plan?" and it hunts for reasons to say yes. So you execute on something broken and find out weeks later.

A premortem flips it: You tell Claude the plan already failed and make it explain why.

Google, Goldman Sachs, and Procter & Gamble run it before every major launch.

### 1. The premortem prompt

```text
You're a forensic failure analyst. My plan: [Describe it in full, with timeline, budget, and what success looks like]. It's 6 months from today and this plan failed completely. Write the autopsy.

Give me the 7 most likely causes of death, ranked, and for each: what killed it, how it unfolded month by month, the assumption I held that allowed it, and the first warning sign I'd have seen. Every failure traces back to a detail I gave you or you cut it. No generic advice. Never reassure me.
```

### 2. The verdict

Now make it commit instead of handing you a list.

```text
From those 7 failures, tell me which is most likely and which is most dangerous, and explain why they're different. Then name the single biggest hidden assumption I'm making that I don't realise is an assumption. Be blunt. If my plan has a fatal flaw, say the words.
```

### 3. The rebuild

Turn the autopsy into a plan that survives it.

```text
Rewrite my plan with every one of those failure modes closed off. Show me what changed and why. Then give me a pre-launch checklist of 3 to 5 things I must verify before I execute anything, and tell me what result on each would mean I should walk away entirely.
```

### 4. The adversary

The upgrade almost nobody runs. Point it at the person who wins if you lose.

```text
Now play the person who benefits most from my plan failing. A competitor, a rival, someone who wants my spot. You've seen my plan. Tell me exactly where you'd attack it, what you'd do the week I launch, and the move I'd never see coming.
```

### 5. The tripwire

So you catch it while there is still time to change course.

```text
For each failure mode, give me one measurable signal that would tell me it's starting to happen, and the exact week I should check for it. I want tripwires, not vibes.
```

## Ako ich používať

- Prompty vkladaj postupne, jeden po druhom, a všetky do jedného chatu. Kroky 2 až 5 nadväzujú na odpoveď z kroku 1.
- V kroku 1 opíš plán celý: čo presne chceš urobiť, termín, rozpočet a ako vyzerá úspech. Prompt zakazuje všeobecné rady, takže Claude pracuje len s detailmi, ktoré mu dáš.
- Ak chceš odpovede po slovensky, pridaj na koniec prvého promptu vetu `Reply in Slovak.`
- Týždne z kroku 5 si hneď zapíš do kalendára.
