# 36 – Váš dekor čaká v košíku, so zľavou 5 %

- **Typ:** Automatizácia · Košík z webu
- **Kedy sa posiela:** 2 hodiny po vložení dekoru do košíka na orostone.sk bez začatia pokladne a bez objednávky (Klaviyo: Added to Cart z webu)
- **Predmet:** Váš dekor čaká v košíku, so zľavou 5 %
- **Preheader:** 🪨 Košík sme vám uložili. Ako odberateľ noviniek máte na jeho dokončenie 5 % zľavu s kódom KOSIK5.
- **Šablóna:** `sablony/36-automatizacia-kosik-dekor.html`

## Text e-mailu v poradí, ako sa zobrazí

### Séria (pill) a veta pod ňou
Váš košík na orostone.sk

### Nadpis
{{ event.AddedItemProductName|default:'Taj Mahal'|title }} čaká
v košíku.

### Hlavná fotka (popis pod fotkou)
[alt fotky: Celá platňa {{ event.AddedItemProductName|default:'Taj Mahal'|title }} vedľa človeka na porovnanie veľkosti]
● {{ event.AddedItemProductName|default:'Taj Mahal'|title }} · celá platňa 3200 × 1600 mm

### Text
Dobrý deň,
dekor {{ event.AddedItemProductName|default:'Taj Mahal'|title }} ste si na orostone.sk vložili do košíka a objednávku ste zatiaľ nedokončili. Košík sme vám uložili, nič sa nestratilo.
Ak ste sa ešte nerozhodli, je to v poriadku. Pracovná doska sa vyberá raz a nerozhoduje o nej malá vzorka ani cena, ale to, ako kresba vyzerá na celej ploche a ako sa doska používa každý deň.

### Položky košíka
V košíku máte
{% for item in event.Items %}
{{ item.ProductName|title }}
{% if item.VariantName and item.VariantName != 'Default Title' %}{{ item.VariantName }} · {% endif %}{{ item.Quantity }} ks
{% endfor %}

### Ponuka
Pre odberateľov noviniek
5 % na dokončenie objednávky
Rozhodnutie vám chceme uľahčiť: s kódom KOSIK5 je celá objednávka o 5 % lacnejšia. Kód dostávate ako odberateľ noviniek Orostone a platí na jednu objednávku. Tlačidlo otvorí váš uložený košík v pokladni a kód doplní samo; inak ho zadáte do poľa „Zľavový kód“.
Dokončiť objednávku so zľavou
Zľava sa počíta z ceny tovaru bez dopravy. Ak si chcete dekor najprv overiť na vzorke, kód vám ostáva. Pozrieť dekor znova

### Nadpis sekcie
Ak ešte váhate

### Číslovaný zoznam
01
Vzorka v rukách
Prvá vzorka je zadarmo. Priložte ju k dvierkam a k podlahe pri svojom svetle – uvidíte viac než na obrazovke.
02
Celá platňa
Na stránke dekoru je fotka platne 3200 × 1600 mm vedľa človeka. Ukáže, ako sa kresba rozloží po dĺžke pracovnej dosky.
03
Pôdorys
Pošlite pôdorys alebo rozmery v odpovedi na tento e-mail. Navrhneme rozloženie platní a pripravíme orientačné cenové rozpätie.

### P. S.
P. S. · Marián, Orostone
Ak váhate medzi dvoma dekormi, odpovedzte na tento e-mail a napíšte, ktoré to sú. Poradím, ktorý z nich bude vo veľkej ploche vašej kuchyne fungovať lepšie.

### Podpis značky
Krása kameňa.
Sila technológie.

### Pätička — dôvod a odhlásenie
Tento e-mail ste dostali, pretože odoberáte novinky Orostone a v e-shope orostone.sk ste si vložili dekor do košíka.
© 2026 Orostone, s. r. o.
Sídlo: Landererova 8, 811 09 Bratislava
Odhlásiť odber
