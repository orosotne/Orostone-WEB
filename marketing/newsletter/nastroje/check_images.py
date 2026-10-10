"""Overí, že každý obrázok v šablónach je na orostone.sk a jeho súbor je v repozitári.

    python3 marketing/newsletter/nastroje/check_images.py

Cudzí hosting (GitHub, CDN e-shopu) e-mailom škodí a súbor, ktorý nie je v public/,
sa po nasadení webu zobrazí ako rozbitý obrázok. Vráti 1, ak niečo nesedí.
"""
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parents[3]
SABLONY = ROOT / "marketing" / "newsletter" / "sablony"
PUBLIC = ROOT / "public"

problems = []
for f in sorted(SABLONY.glob("*.html")):
    html = f.read_text(encoding="utf-8")
    for src in sorted(set(re.findall(r'<img[^>]+src="([^"]+)"', html))):
        m = re.fullmatch(r"https://orostone\.sk/(images/[^?#\"]+)", src)
        if not m:
            problems.append(f"{f.name}: obrázok mimo orostone.sk: {src}")
        elif not (PUBLIC / m.group(1)).is_file():
            problems.append(f"{f.name}: chýba súbor public/{m.group(1)}")

print("\n".join(problems) if problems else "OK: všetky obrázky sú na orostone.sk a v public/images/")
sys.exit(1 if problems else 0)
