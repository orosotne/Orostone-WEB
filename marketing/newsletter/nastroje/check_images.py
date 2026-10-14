"""Overí, že každý obrázok v šablónach je na orostone.sk a jeho súbor je v repozitári.

    python3 marketing/newsletter/nastroje/check_images.py

Cudzí hosting (GitHub, CDN e-shopu) e-mailom škodí a súbor, ktorý nie je v public/,
sa po nasadení webu zobrazí ako rozbitý obrázok. Vráti 1, ak niečo nesedí.
Dynamickú adresu s Klaviyo značkou {{ … }} (fotka dekoru podľa vzorky) overí pre každý
dekor z data/shop-products-fallback.json.
"""
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parents[3]
SABLONY = ROOT / "marketing" / "newsletter" / "sablony"
PUBLIC = ROOT / "public"
DEKORY = [p["id"] for p in json.loads((ROOT / "data" / "shop-products-fallback.json").read_text(encoding="utf-8"))]

problems = []
for f in sorted(SABLONY.glob("*.html")):
    html = f.read_text(encoding="utf-8")
    srcs = set()
    for src in re.findall(r'<img[^>]+src="([^"]+)"', html):
        if "{{" in src:
            srcs.update(re.sub(r"\{\{[^}]*\}\}", d, src) for d in DEKORY)
        else:
            srcs.add(src)
    for src in sorted(srcs):
        m = re.fullmatch(r"https://orostone\.sk/(images/[^?#\"]+)", src)
        if not m:
            problems.append(f"{f.name}: obrázok mimo orostone.sk: {src}")
        elif not (PUBLIC / m.group(1)).is_file():
            problems.append(f"{f.name}: chýba súbor public/{m.group(1)}")

print("\n".join(problems) if problems else "OK: všetky obrázky sú na orostone.sk a v public/images/")
sys.exit(1 if problems else 0)
