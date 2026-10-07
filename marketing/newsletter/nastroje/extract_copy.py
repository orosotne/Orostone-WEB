"""Vytiahne slovenské texty z HTML šablón do Markdownu (podklad pre jazykovú kontrolu).

Použitie: python3 marketing/newsletter/nastroje/extract_copy.py [sablony] [texty]
"""
import sys, os, re, html
from html.parser import HTMLParser

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, "..", "sablony")
OUT = sys.argv[2] if len(sys.argv) > 2 else os.path.join(HERE, "..", "texty")
NAMES = {
 'HEADER':'Hlavička','EYEBROW (séria)':'Séria (pill) a veta pod ňou','HEADLINE':'Nadpis','TMAVÝ PÁS':'Tmavý pás (úvod)',
 'HERO IMAGE':'Hlavná fotka (popis na fotke)','KAMENNÝ PÁS':None,'TEXT':'Text','NADPIS SEKCIE':'Nadpis sekcie',
 'ČÍSLOVANÝ ZOZNAM':'Číslovaný zoznam','FACTS STRIP':'Fakty','CITÁT / HLAVNÁ MYŠLIENKA (tmavá karta)':'Citát / dôležitá myšlienka',
 'DVOJICA FOTIEK':'Dvojica fotiek (popis)','OBRÁZOK S POPISOM':'Obrázok (popis)','DVE KARTY':'Dve karty',
 'MOODBOARD + KOMBINÁCIE':'Kombinácie','KOMBINÁCIE (swatche)':'Kombinácie','PONUKA (biela karta)':'Ponuka',
 'PRODUKTOVÁ KARTA':'Produktová karta','CTA':'Tlačidlo (CTA)','LIST (osobný tón, bez dekorácií)':'List',
 'P.S.':'P. S.','PODPIS ZNAČKY':'Podpis značky','FOOTER':None,'LEGAL / UNSUB':'Pätička — dôvod a odhlásenie',
 'VOĽBA (preferencia / segmentácia klikom)':'Voľba (tlačidlá)',
 'REALIZÁCIA (karta)':'Karta (fotka, štítok, nadpis, veta)','POZNÁMKA':'Poznámka'}

class Blocks(HTMLParser):
    def __init__(s):
        super().__init__(); s.blocks=[]; s.cur=None; s.skip=0
    def handle_comment(s, data):
        name=data.strip()
        if name in NAMES:
            s.cur=[name, []]; s.blocks.append(s.cur)
    def handle_starttag(s,t,a):
        if t in ('style','title'): s.skip+=1
        if t in ('p','div','td','tr','br','center') and s.cur: s.cur[1].append('\n')
        if t=='img' and s.cur:
            alt=dict(a).get('alt','')
            if alt and s.cur[0] in ('HERO IMAGE','DVOJICA FOTIEK','OBRÁZOK S POPISOM','TMAVÝ PÁS','PRODUKTOVÁ KARTA','MOODBOARD + KOMBINÁCIE','REALIZÁCIA (karta)'):
                s.cur[1].append(f'\n[alt fotky: {alt}]\n')
    def handle_endtag(s,t):
        if t in ('style','title'): s.skip-=1
    def handle_data(s,d):
        if s.cur and not s.skip: s.cur[1].append(d)

for f in sorted(os.listdir(SRC)):
    if not f.endswith('.html'): continue
    raw=open(os.path.join(SRC,f),encoding='utf-8').read()
    meta=dict(re.findall(r'^\s{2}([A-ZÁ-Ž]+):\s+(.+)$', raw.split('-->',1)[0], re.M))
    pre=re.search(r'<!-- Preheader -->\s*<div[^>]*>\s*(.*?)\s*&nbsp;', raw, re.S)
    body=re.sub(r'<!--\[if mso\]>.*?<!\[endif\]-->','',raw,flags=re.S)
    p=Blocks(); p.feed(body)
    title=re.search(r'<title>(.*?)</title>', raw).group(1)
    lines=[f'# {f[:2]} – {html.unescape(title)}', '',
           f'- **Typ:** {meta.get("TYP","")}',
           (f'- **Kedy sa posiela:** {meta["SPÚŠŤAČ"]}' if "SPÚŠŤAČ" in meta else f'- **Kedy sa posiela:** kampaň podľa kalendára (2× mesačne)'),
           *( [f'- **Komu:** {meta["SEGMENT"]}'] if "SEGMENT" in meta else [] ),
           f'- **Predmet:** {meta.get("PREDMET","")}',
           f'- **Preheader:** {html.unescape(pre.group(1).strip()) if pre else meta.get("PREHEADER","")}',
           f'- **Šablóna:** `sablony/{f}`', '', '## Text e-mailu v poradí, ako sa zobrazí', '']
    seen_footer=False
    for name, parts in p.blocks:
        label=NAMES.get(name)
        if label is None: continue
        txt=html.unescape(''.join(parts))
        txt='\n'.join(re.sub(r'[ \t ‌]+',' ',l).strip() for l in txt.split('\n'))
        txt='\n'.join(l for l in txt.split('\n') if l and l not in ('→','&rarr;'))
        txt=txt.replace(' →','').replace('→','')
        txt=re.sub(r'^(\d\d) –\n', r'\1 – ', txt, flags=re.M)
        txt=re.sub(r'^–\n', '– ', txt, flags=re.M)
        if not txt.strip(): continue
        lines += [f'### {label}', txt, '']
    open(os.path.join(OUT, f.replace('.html','.md')),'w',encoding='utf-8').write('\n'.join(lines).rstrip()+'\n')
    print(f, '->', len(p.blocks), 'blokov')
