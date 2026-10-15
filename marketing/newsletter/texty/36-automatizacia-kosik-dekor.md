# 36 – Zľava 5 % na dekor vo vašom košíku

- **Typ:** Automatizácia · Košík z webu
- **Kedy sa posiela:** Na druhý deň o 9:00 po vložení dekoru do košíka na orostone.sk, ak človek nezačal pokladňu, neobjednal ani košík nevyprázdnil (Klaviyo: Added to Cart z webu)
- **Predmet:** Zľava 5 % na dekor vo vašom košíku
- **Preheader:** 🪨 Kód KOSIK5 platí na celú objednávku. Košík sme vám uložili. K objednávke sa vrátite jedným kliknutím.
- **Šablóna:** `sablony/36-automatizacia-kosik-dekor.html`

## Text e-mailu v poradí, ako sa zobrazí

### Hlavička
Zľava 5 % · kód KOSIK5

### Tmavý pás (úvod)
Zľava pre odberateľov
{{ event.AddedItemProductName|default:'Taj Mahal'|title }}
o 5 % lacnejšie.
Košík sme vám uložili. Kód KOSIK5 platí na celú objednávku na orostone.sk.
[alt fotky: Zľava 5 % na celú objednávku s kódom KOSIK5. Vizualizácia kuchyne s dekorom {{ event.AddedItemProductName|default:'Taj Mahal'|title }}]
Dokončiť so zľavou 5 %

### Text
Dobrý deň,
dekor {{ event.AddedItemProductName|default:'Taj Mahal'|title }} ste si na orostone.sk vložili do košíka a objednávku ste zatiaľ nedokončili. Ako odberateľovi noviniek vám na ňu dávame zľavu 5 %, aby sa vám rozhodovalo ľahšie.
Pracovná doska sa vyberá raz. Nerozhoduje o nej malá vzorka ani cena, ale to, ako kresba vyzerá na celej ploche a ako sa doska používa každý deň.

### Položky košíka
V košíku máte
{% for item in event.Items %}
{{ item.ProductName|title }}
{% if item.VariantName and item.VariantName != 'Default Title' %}{{ item.VariantName }} · {% endif %}{{ item.Quantity }} ks
{% endfor %}

### Hlavná fotka (popis pod fotkou)
[alt fotky: Celá platňa {{ event.AddedItemProductName|default:'Taj Mahal'|title }} vedľa človeka na porovnanie veľkosti]
● {{ event.AddedItemProductName|default:'Taj Mahal'|title }} · celá platňa

### Ponuka
Váš zľavový kód
KOSIK5
Odpočíta 5 % z ceny všetkého tovaru v košíku a platí na jednu objednávku na orostone.sk. Dostávate ho ako odberateľ noviniek Orostone. Tlačidlo otvorí váš uložený košík v pokladni a kód doplní samo; inak ho zadajte do poľa „Zľavový kód“.
Dokončiť objednávku
Zľavu uplatníte len pri objednávke na orostone.sk. Ak objednávate po telefóne alebo na základe cenovej ponuky, kód použiť nemôžeme. Zľava sa počíta z ceny tovaru, nie z dopravy. Ak si chcete dekor najprv overiť na vzorke, kód si nechajte na objednávku platne – platí len raz. Pozrieť dekor znova

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
Ak váhate medzi dvoma dekormi, odpovedzte na tento e-mail a napíšte, ktoré to sú. Poradím, ktorý z nich bude na veľkej ploche vo vašej kuchyni vyzerať lepšie. Kód KOSIK5 platí aj na dekor, ktorý si nakoniec vyberiete, ak ho objednáte na orostone.sk.

### Podpis značky
Krása kameňa.
Sila technológie.

### Pätička — dôvod a odhlásenie
Tento e-mail ste dostali, pretože odoberáte novinky Orostone a v e-shope orostone.sk ste si vložili dekor do košíka.
© 2026 Orostone, s. r. o.
Sídlo: Landererova 8, 811 09 Bratislava
Odhlásiť odber
