# -*- coding: utf-8 -*-
"""Generátor e-mailových šablón Orostone (blokový systém).

Každá šablóna sa skladá z blokov s inline štýlmi podľa skillu orostone-newsletter
(600 px kontajner, tabuľkový layout, VML fallback pre CTA).

Použitie:
    python3 marketing/newsletter/nastroje/build_emails.py          # zapíše do ../sablony
    python3 marketing/newsletter/nastroje/extract_copy.py          # obnoví ../texty

Texty e-mailov sa upravujú tu; `sablony/` a `texty/` sa z neho generujú.
"""
import os
import sys

OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "sablony")
os.makedirs(OUT, exist_ok=True)

F = "'Montserrat',Helvetica,Arial,sans-serif"
INK = "#1A1A1A"
BODY = "#2A2A2A"
GRAY = "#6B7280"
GOLD = "#ECD488"
GOLD_INK = "#7A6A2E"  # zlatý atrament: zlatý text na svetlom pozadí (kontrast 5.1:1)
CARD = "#FAFAF7"
PAGE = "#E8E5DE"
ALT = "#F5F5F0"
LINE = "rgba(26,26,26,0.08)"

IMG = "https://orostone.sk/images/email/"
SITE = "https://orostone.sk"
SHOP_CDN = "https://cdn.shopify.com/s/files/1/1013/8642/0570/files/"


def shop_img(name, v, w=1040):
    return f"{SHOP_CDN}{name}?v={v}&width={w}&format=pjpg"


CSS = """
  body,table,td,p,a,li{ -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
  table,td{ mso-table-lspace:0pt; mso-table-rspace:0pt; border-collapse:collapse; }
  img{ -ms-interpolation-mode:bicubic; border:0; outline:none; text-decoration:none; display:block; }
  a{ text-decoration:none; }
  body{ margin:0 !important; padding:0 !important; width:100% !important; background:#E8E5DE; }

  @media screen and (max-width:620px){
    .container{ width:100% !important; max-width:100% !important; }
    .px-40{ padding-left:20px !important; padding-right:20px !important; }
    .band-pad{ padding:32px 20px 28px !important; }
    .h1{ font-size:26px !important; line-height:32px !important; }
    .h1-dark{ font-size:27px !important; line-height:33px !important; }
    .h2{ font-size:20px !important; line-height:26px !important; }
    .pull{ font-size:15px !important; line-height:23px !important; }
    .hero-wrap{ padding:0 16px !important; }
    .meta-right{ display:none !important; }
    .header-logo{ height:24px !important; }
    .cta-btn{ padding:13px 22px !important; font-size:10.5px !important; letter-spacing:0.14em !important; }
    .facts-cell{ display:inline-block !important; width:50% !important; box-sizing:border-box !important; padding:12px 10px 12px 0 !important; border-left:0 !important; }
    .pair-col{ display:block !important; width:100% !important; padding:0 0 12px 0 !important; }
    .pair-col img{ width:100% !important; max-width:100% !important; height:auto !important; }
    .split-col{ display:block !important; width:100% !important; padding:0 0 12px 0 !important; }
    .swatch-col{ width:33.33% !important; }
    .product-img-col{ display:block !important; width:100% !important; padding:0 0 16px 0 !important; }
    .product-img-col img{ width:100% !important; height:auto !important; }
    .product-txt-col{ display:block !important; width:100% !important; padding:0 !important; }
    .footer-brand{ display:block !important; width:100% !important; text-align:center !important; padding-bottom:14px !important; }
    .footer-brand img{ margin:0 auto !important; }
    .footer-socials{ display:block !important; width:100% !important; text-align:center !important; }
    .footer-socials table{ float:none !important; margin:0 auto !important; }
    .footer-col{ display:block !important; width:100% !important; padding:0 0 16px 0 !important; }
    .badge-divider{ width:104px !important; height:104px !important; margin-top:-52px !important; padding:0 14px !important; }
    .list-num{ width:30px !important; }
    .ps-cell{ padding:18px 18px !important; }
    .letter{ font-size:15px !important; line-height:25px !important; }
  }
  @media screen and (max-width:400px){
    .h1{ font-size:23px !important; line-height:29px !important; }
    .h1-dark{ font-size:24px !important; line-height:30px !important; }
    .ps-avatar{ width:42px !important; height:42px !important; }
    .badge-divider{ width:92px !important; height:92px !important; margin-top:-46px !important; }
  }
"""


# ---------------------------------------------------------------------------
# Kostra
# ---------------------------------------------------------------------------

def doc(meta, title, preheader, rows):
    """meta: dict s PREDMET/PREHEADER/TYP/... — zapíše sa ako komentár na začiatok."""
    meta_lines = "\n".join(f"  {k:<10} {v}" for k, v in meta.items())
    pre_pad = "&nbsp;&zwnj;" * 40
    return f"""<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<!--
  OROSTONE — e-mailová šablóna (skill orostone-newsletter)
{meta_lines}
  Obrázky z orostone.sk/images/email/ nahraj zo skillu: assets/email-images/
-->
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="sk">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="x-apple-disable-message-reformatting" />
<meta name="color-scheme" content="light only" />
<meta name="supported-color-schemes" content="light" />
<title>{title}</title>
<!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
<link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400&display=swap" rel="stylesheet" type="text/css" />
<style type="text/css">{CSS}</style>
</head>

<body style="margin:0; padding:0; background:{PAGE}; font-family:{F}; color:{INK};">

<!-- Preheader -->
<div style="display:none; max-height:0; overflow:hidden; mso-hide:all; font-size:1px; line-height:1px; color:{PAGE};">
  {preheader}
  {pre_pad}
</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:{PAGE};">
  <tr>
    <td align="center" style="padding:32px 12px;">

      <table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px; max-width:600px; background:{CARD}; border-radius:16px; overflow:hidden;">
{''.join(rows)}
      </table>

    </td>
  </tr>
</table>

</body>
</html>
"""


def header(series, date=""):
    right = f"{series}" + (f' <span style="color:{GOLD_INK};">· {date}</span>' if date else "")
    return f"""
        <!-- HEADER -->
        <tr>
          <td class="px-40" style="padding:24px 40px; border-bottom:1px solid {LINE};">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td align="left" valign="middle">
                  <a href="{SITE}" target="_blank"><img class="header-logo" src="{SITE}/images/orostone-logo-hd.png" alt="Orostone" height="28" style="display:block; height:28px; width:auto; border:0;" /></a>
                </td>
                <td class="meta-right" align="right" valign="middle" style="font-family:{F}; font-size:10px; font-weight:700; letter-spacing:0.22em; text-transform:uppercase; color:{GRAY};">
                  {right}
                </td>
              </tr>
            </table>
          </td>
        </tr>
"""


def _pill(text, dark=False):
    bg = "rgba(255,255,255,0.10)" if dark else INK
    return f"""<table role="presentation" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="background:{bg}; padding:8px 14px; border-radius:9999px;">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td valign="middle" style="padding-right:8px; line-height:0;"><div style="width:6px; height:6px; background:{GOLD}; border-radius:50%;">&nbsp;</div></td>
                      <td valign="middle" style="font-family:{F}; font-size:10px; font-weight:700; letter-spacing:0.24em; text-transform:uppercase; color:#FFFFFF; line-height:1;">{text}</td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>"""


def eyebrow(text, note=None, top=32):
    note_html = ""
    if note:
        note_html = f"""
            <div style="font-family:{F}; font-size:12.5px; font-weight:400; line-height:19px; color:{GRAY}; margin-top:12px;">{note}</div>"""
    return f"""
        <!-- EYEBROW (séria) -->
        <tr>
          <td class="px-40" style="padding:{top}px 40px 0;">
            {_pill(text)}{note_html}
          </td>
        </tr>
"""


def accent_light(text):
    """Akcent v headline na SVETLOM pozadí: tmavá kurzíva + zlatá linka (zlatá nikdy nie je text na svetlom)."""
    return f'<em style="font-weight:300; font-style:italic; color:{INK}; border-bottom:3px solid {GOLD}; padding-bottom:1px;">{text}</em>'


def accent_dark(text):
    """Akcent v headline na TMAVOM pozadí: zlatá kurzíva (kontrast 11.9:1)."""
    return f'<em style="font-weight:300; font-style:italic; color:{GOLD};">{text}</em>'


def headline(html, top=18, bottom=8):
    return f"""
        <!-- HEADLINE -->
        <tr>
          <td class="px-40 h1" style="padding:{top}px 40px {bottom}px; font-family:{F}; font-size:34px; font-weight:700; line-height:40px; letter-spacing:-0.005em; color:{INK};">
            {html}
          </td>
        </tr>
"""


def dark_band(pill_text, headline_html, sub=None, image=None, cta=None, note=None):
    """Tmavý pás (color blocking): séria + headline so zlatou kurzívou, voliteľne obrázok a CTA."""
    sub_html = f"""
                  <div style="font-family:{F}; font-size:15px; font-weight:300; line-height:25px; color:#E5E7EB; margin-top:14px;">{sub}</div>""" if sub else ""
    note_html = f"""
                  <div style="font-family:{F}; font-size:12px; font-weight:400; line-height:18px; color:#9CA3AF; margin-top:12px;">{note}</div>""" if note else ""
    img_html = ""
    if image:
        src, alt = image
        img_html = f"""
                  <div style="margin-top:24px; line-height:0;"><img src="{src}" alt="{alt}" width="520" style="width:100%; max-width:520px; height:auto; display:block; border-radius:12px;" /></div>"""
    cta_html = ""
    if cta:
        cta_html = f"""
                  <div style="margin-top:24px;">{button(cta[0], cta[1], gold=True)}</div>"""
    return f"""
        <!-- TMAVÝ PÁS -->
        <tr>
          <td class="band-pad" style="background:{INK}; padding:40px 40px 36px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td>
                  {_pill(pill_text, dark=True)}
                  <div class="h1-dark" style="font-family:{F}; font-size:34px; font-weight:700; line-height:40px; letter-spacing:-0.005em; color:#FFFFFF; margin-top:18px;">{headline_html}</div>{sub_html}{note_html}{img_html}{cta_html}
                </td>
              </tr>
            </table>
          </td>
        </tr>
"""


def hero(src, alt, capsule=None, w=520, top=8):
    cap = ""
    if capsule:
        cap = f"""
              <div style="position:absolute; bottom:14px; left:14px; padding:6px 12px; background:rgba(26,26,26,0.78); border-radius:9999px; font-family:{F}; font-size:9.5px; font-weight:700; letter-spacing:0.22em; text-transform:uppercase; color:#FFFFFF; line-height:1;"><span style="color:{GOLD};">&#9679;</span>&nbsp; {capsule}</div>"""
    return f"""
        <!-- HERO IMAGE -->
        <tr>
          <td class="hero-wrap" style="padding:{top}px 40px 0; line-height:0;">
            <!--[if !mso]><!-- -->
            <div style="position:relative;">
              <img src="{src}" alt="{alt}" width="{w}" style="width:100%; max-width:{w}px; height:auto; display:block; border-radius:12px;" />{cap}
            </div>
            <!--<![endif]-->
            <!--[if mso]>
            <img src="{src}" alt="{alt}" width="{w}" style="width:{w}px; height:auto; display:block;" />
            <![endif]-->
          </td>
        </tr>
"""


def strip(src, alt):
    """Kamenný pás — makro kresba cez celú šírku ako oddeľovač sekcií (Orostone 'ilustrácia')."""
    return f"""
        <!-- KAMENNÝ PÁS -->
        <tr>
          <td style="padding:0; line-height:0;">
            <img src="{src}" alt="{alt}" width="600" style="width:100%; max-width:600px; height:auto; display:block;" />
          </td>
        </tr>
"""


def text(paragraphs, greeting="Dobrý deň,", top=24, bottom=8):
    g = f'<p style="margin:0 0 16px; font-weight:500; color:{INK};">{greeting}</p>' if greeting else ""
    ps = "".join(f'<p style="margin:0 0 16px;">{p}</p>' for p in paragraphs)
    return f"""
        <!-- TEXT -->
        <tr>
          <td class="px-40" style="padding:{top}px 40px {bottom}px; font-family:{F}; font-size:15px; font-weight:300; line-height:26px; color:{BODY};">
            {g}{ps}
          </td>
        </tr>
"""


def section_title(num, title, top=28):
    if num is None:
        return f"""
        <!-- NADPIS SEKCIE -->
        <tr>
          <td class="px-40 h2" style="padding:{top}px 40px 4px; font-family:{F}; font-size:22px; font-weight:700; line-height:28px; color:{INK};">{title}</td>
        </tr>
"""
    num = f"{num} &ndash;"
    return f"""
        <!-- NADPIS SEKCIE -->
        <tr>
          <td class="px-40" style="padding:{top}px 40px 4px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td valign="baseline" width="50" style="font-family:{F}; font-size:11px; font-weight:700; letter-spacing:0.22em; text-transform:uppercase; color:{GOLD_INK};">{num}</td>
                <td valign="baseline" class="h2" style="font-family:{F}; font-size:22px; font-weight:700; line-height:28px; color:{INK};">{title}</td>
              </tr>
            </table>
          </td>
        </tr>
"""


def numbered(items, top=12, note=None):
    rows = []
    for i, (t, d) in enumerate(items, 1):
        rows.append(f"""
              <tr>
                <td valign="top" style="padding:18px 0; border-top:1px solid {LINE};">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td class="list-num" valign="top" width="44" style="font-family:{F}; font-size:11px; font-weight:700; letter-spacing:0.22em; color:{GOLD_INK}; padding-top:3px;">{i:02d}</td>
                      <td valign="top">
                        <div style="font-family:{F}; font-size:15px; font-weight:700; line-height:22px; color:{INK};">{t}</div>
                        <div style="font-family:{F}; font-size:13.5px; font-weight:400; line-height:22px; color:{GRAY}; margin-top:4px;">{d}</div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>""")
    note_html = f"""
            <div style="font-family:{F}; font-size:12px; font-weight:400; line-height:18px; color:{GRAY}; margin-top:2px;">{note}</div>""" if note else ""
    return f"""
        <!-- ČÍSLOVANÝ ZOZNAM -->
        <tr>
          <td class="px-40" style="padding:{top}px 40px 0;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">{''.join(rows)}
            </table>{note_html}
          </td>
        </tr>
"""


def facts(items, top=20):
    """Spec/fact strip: 4 bunky (na mobile 2×2). items = [(label, value)]"""
    cells = []
    for i, (label, value) in enumerate(items):
        bl = "" if i == 0 else f" border-left:1px solid {LINE};"
        pl = "0" if i == 0 else "14px"
        cells.append(f"""
                <td class="facts-cell" valign="top" width="{100 // len(items)}%" style="padding:14px 10px 14px {pl};{bl}">
                  <div style="font-family:{F}; font-size:9px; font-weight:700; letter-spacing:0.2em; text-transform:uppercase; color:{GRAY};">{label}</div>
                  <div style="font-family:{F}; font-size:13px; font-weight:700; line-height:18px; color:{INK}; margin-top:5px;">{value}</div>
                </td>""")
    return f"""
        <!-- FACTS STRIP -->
        <tr>
          <td class="px-40" style="padding:{top}px 40px 0;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid {LINE}; border-bottom:1px solid {LINE};">
              <tr>{''.join(cells)}
              </tr>
            </table>
          </td>
        </tr>
"""


def quote_dark(label, body_html, attribution=None, top=24):
    att = f"""
                  <div style="font-family:{F}; font-size:11px; font-weight:500; letter-spacing:0.12em; text-transform:uppercase; color:#9CA3AF; margin-top:14px;">{attribution}</div>""" if attribution else ""
    return f"""
        <!-- CITÁT / HLAVNÁ MYŠLIENKA (tmavá karta) -->
        <tr>
          <td class="px-40" style="padding:{top}px 40px 4px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="background:{INK}; border-radius:16px; padding:24px 28px;">
                  <div style="font-family:{F}; font-size:10px; font-weight:700; letter-spacing:0.24em; text-transform:uppercase; color:{GOLD}; margin-bottom:10px;">{label}</div>
                  <div class="pull" style="font-family:{F}; font-size:18px; font-weight:300; font-style:italic; line-height:27px; color:#FFFFFF;">{body_html}</div>{att}
                </td>
              </tr>
            </table>
          </td>
        </tr>
"""


def pair(img1, img2, caption=None, top=24):
    (s1, a1), (s2, a2) = img1, img2
    cap = f"""
            <div style="font-family:{F}; font-size:10px; font-weight:500; letter-spacing:0.18em; text-transform:uppercase; color:{GRAY}; margin-top:2px; line-height:15px;">{caption}</div>""" if caption else ""
    return f"""
        <!-- DVOJICA FOTIEK -->
        <tr>
          <td class="px-40" style="padding:{top}px 40px 0;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td class="pair-col" valign="top" width="50%" style="padding:0 6px 12px 0; line-height:0;"><img src="{s1}" alt="{a1}" width="254" style="width:100%; max-width:254px; height:auto; display:block; border-radius:12px;" /></td>
                <td class="pair-col" valign="top" width="50%" style="padding:0 0 12px 6px; line-height:0;"><img src="{s2}" alt="{a2}" width="254" style="width:100%; max-width:254px; height:auto; display:block; border-radius:12px;" /></td>
              </tr>
            </table>{cap}
          </td>
        </tr>
"""


def figure(src, alt, caption=None, top=20, w=520):
    cap = f"""
            <div style="font-family:{F}; font-size:10px; font-weight:500; letter-spacing:0.18em; text-transform:uppercase; color:{GRAY}; margin-top:10px; line-height:15px;">{caption}</div>""" if caption else ""
    return f"""
        <!-- OBRÁZOK S POPISOM -->
        <tr>
          <td class="px-40" style="padding:{top}px 40px 0; line-height:0;">
            <img src="{src}" alt="{alt}" width="{w}" style="width:100%; max-width:{w}px; height:auto; display:block; border-radius:12px;" />
            <div style="line-height:normal;">{cap}</div>
          </td>
        </tr>
"""


def split(left, right, top=16):
    """Dve karty vedľa seba: (title, [items]) — napr. Kde funguje / Na čo myslieť."""
    def card(title, items, dark_label):
        lis = "".join(f"""
                    <tr><td valign="top" width="16" style="font-family:{F}; font-size:13px; font-weight:700; color:{GOLD_INK}; padding:6px 0;">&ndash;</td><td valign="top" style="font-family:{F}; font-size:13.5px; font-weight:400; line-height:21px; color:{BODY}; padding:6px 0 6px 6px;">{it}</td></tr>""" for it in items)
        return f"""<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FFFFFF; border:1px solid {LINE}; border-radius:14px; border-collapse:separate; border-spacing:0;">
                    <tr><td style="padding:20px 20px 14px;">
                      <div style="font-family:{F}; font-size:10px; font-weight:700; letter-spacing:0.22em; text-transform:uppercase; color:{dark_label};">{title}</div>
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:8px;">{lis}
                      </table>
                    </td></tr>
                  </table>"""
    return f"""
        <!-- DVE KARTY -->
        <tr>
          <td class="px-40" style="padding:{top}px 40px 0;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td class="split-col" valign="top" width="50%" style="padding:0 6px 0 0;">
                  {card(left[0], left[1], GOLD_INK)}
                </td>
                <td class="split-col" valign="top" width="50%" style="padding:0 0 0 6px;">
                  {card(right[0], right[1], GRAY)}
                </td>
              </tr>
            </table>
          </td>
        </tr>
"""


def swatches(items, top=16):
    cells = "".join(f"""
                <td class="swatch-col" align="center" valign="top" width="33%" style="padding:0 4px;">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center"><tr><td width="44" height="44" style="width:44px; height:44px; background:{hexv}; border-radius:9999px; border:1px solid {LINE}; font-size:0; line-height:0;">&nbsp;</td></tr></table>
                  <div style="font-family:{F}; font-size:11.5px; font-weight:500; line-height:16px; color:{INK}; margin-top:8px;">{label}</div>
                </td>""" for hexv, label in items)
    return f"""
        <!-- KOMBINÁCIE (swatche) -->
        <tr>
          <td class="px-40" style="padding:{top}px 40px 0;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>{cells}
              </tr>
            </table>
          </td>
        </tr>
"""


def media_row(img, alt, items, top=18):
    """Obrázok vľavo (moodboard) + zoznam kombinácií so swatchmi vpravo. items = [(hex, label, popis)]"""
    rows = "".join(f"""
                        <tr>
                          <td valign="top" width="34" style="padding:8px 0;"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td width="22" height="22" style="width:22px; height:22px; background:{hexv}; border-radius:9999px; border:1px solid {LINE}; font-size:0; line-height:0;">&nbsp;</td></tr></table></td>
                          <td valign="top" style="padding:8px 0;">
                            <div style="font-family:{F}; font-size:14px; font-weight:700; line-height:20px; color:{INK};">{label}</div>
                            <div style="font-family:{F}; font-size:12.5px; font-weight:400; line-height:19px; color:{GRAY}; margin-top:2px;">{desc}</div>
                          </td>
                        </tr>""" for hexv, label, desc in items)
    return f"""
        <!-- MOODBOARD + KOMBINÁCIE -->
        <tr>
          <td class="px-40" style="padding:{top}px 40px 0;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td class="product-img-col" valign="top" width="210" style="padding-right:22px; line-height:0;">
                  <img src="{img}" alt="{alt}" width="210" style="width:210px; max-width:100%; height:auto; display:block; border-radius:12px;" />
                </td>
                <td class="product-txt-col" valign="top">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">{rows}
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
"""


def choices(question, note, options, top=28):
    """Preferenčný blok: otázka + 3 tlačidlá-obrysy. Každé tlačidlo je samostatný odkaz → segment podľa kliku v ESP."""
    btns = "".join(f"""
                  <tr><td style="padding:0 0 10px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
                      <td align="left" style="font-family:{F}; font-size:13px; font-weight:600; line-height:18px;">
                        <a href="{href}" target="_blank" style="display:block; border:1px solid {INK}; border-radius:9999px; padding:13px 20px; color:{INK}; text-decoration:none;">{label} <span style="color:{GOLD_INK};">&rarr;</span></a>
                      </td>
                    </tr></table>
                  </td></tr>""" for label, href in options)
    return f"""
        <!-- VOĽBA (preferencia / segmentácia klikom) -->
        <tr>
          <td class="px-40" style="padding:{top}px 40px 4px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FFFFFF; border:1px solid {LINE}; border-radius:16px; border-collapse:separate; border-spacing:0;">
              <tr>
                <td style="padding:24px 24px 14px;">
                  <div style="font-family:{F}; font-size:10px; font-weight:700; letter-spacing:0.24em; text-transform:uppercase; color:{GOLD_INK}; margin-bottom:10px;">Jedna otázka pre nás</div>
                  <div style="font-family:{F}; font-size:20px; font-weight:700; line-height:26px; color:{INK};">{question}</div>
                  <div style="font-family:{F}; font-size:13.5px; font-weight:400; line-height:21px; color:{GRAY}; margin:8px 0 16px;">{note}</div>
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">{btns}
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
"""


def button(label, href, gold=False, width=260):
    bg = GOLD if gold else INK
    fg = INK if gold else "#FFFFFF"
    arrow = INK if gold else GOLD
    return f"""<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0;">
              <tr>
                <td align="center" style="background:{bg}; border-radius:9999px;">
                  <!--[if mso]>
                  <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="{href}" style="height:46px;v-text-anchor:middle;width:{width}px;" arcsize="50%" stroke="f" fillcolor="{bg}">
                    <w:anchorlock/>
                    <center style="color:{fg};font-family:Arial,sans-serif;font-size:11px;font-weight:bold;letter-spacing:2px;">{label.upper()} &rarr;</center>
                  </v:roundrect>
                  <![endif]-->
                  <!--[if !mso]><!-- -->
                  <a class="cta-btn" href="{href}" target="_blank" style="display:inline-block; padding:15px 28px; font-family:{F}; font-size:11px; font-weight:700; letter-spacing:0.18em; text-transform:uppercase; color:{fg}; text-decoration:none; line-height:1; border-radius:9999px;">{label} <span style="color:{arrow};">&rarr;</span></a>
                  <!--<![endif]-->
                </td>
              </tr>
            </table>"""


def cta(label, href, sub=None, link=None, top=28, width=260):
    sub_html = f"""
            <div style="margin-top:10px; font-family:{F}; font-size:12px; font-weight:400; line-height:18px; color:{GRAY};">{sub}</div>""" if sub else ""
    link_html = ""
    if link:
        link_html = f"""
            <div style="margin-top:14px; font-family:{F}; font-size:12px; font-weight:700; letter-spacing:0.08em;"><a href="{link[1]}" target="_blank" style="color:{INK}; text-decoration:underline;">{link[0]}</a> <span style="color:{GOLD_INK};">&rarr;</span></div>"""
    return f"""
        <!-- CTA -->
        <tr>
          <td class="px-40" style="padding:{top}px 40px 4px;">
            {button(label, href, width=width)}{sub_html}{link_html}
          </td>
        </tr>
"""


def card_offer(label, title, body, cta_label, href, note=None, top=28):
    note_html = f"""
                  <div style="font-family:{F}; font-size:12px; font-weight:400; line-height:19px; color:{GRAY}; margin-top:14px; padding-top:14px; border-top:1px solid {LINE};">{note}</div>""" if note else ""
    return f"""
        <!-- PONUKA (biela karta) -->
        <tr>
          <td class="px-40" style="padding:{top}px 40px 4px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FFFFFF; border:1px solid {LINE}; border-radius:16px; border-collapse:separate; border-spacing:0;">
              <tr>
                <td style="padding:26px 28px 24px;">
                  <div style="font-family:{F}; font-size:10px; font-weight:700; letter-spacing:0.24em; text-transform:uppercase; color:{GOLD_INK}; margin-bottom:10px;">{label}</div>
                  <div style="font-family:{F}; font-size:22px; font-weight:700; line-height:28px; color:{INK};">{title}</div>
                  <p style="margin:10px 0 18px; font-family:{F}; font-size:14px; font-weight:400; line-height:23px; color:{BODY};">{body}</p>
                  {button(cta_label, href)}{note_html}
                </td>
              </tr>
            </table>
          </td>
        </tr>
"""


def product(img, alt, name, desc, spec, cta_label, href, link=None, top=28):
    link_html = f"""
                        <div style="margin-top:12px; font-family:{F}; font-size:12px; font-weight:700; letter-spacing:0.08em;"><a href="{link[1]}" target="_blank" style="color:{INK}; text-decoration:underline;">{link[0]}</a> <span style="color:{GOLD_INK};">&rarr;</span></div>""" if link else ""
    return f"""
        <!-- PRODUKTOVÁ KARTA -->
        <tr>
          <td class="px-40" style="padding:{top}px 40px 4px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FFFFFF; border:1px solid {LINE}; border-radius:16px; border-collapse:separate; border-spacing:0;">
              <tr>
                <td style="padding:20px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td class="product-img-col" valign="top" width="180" style="padding-right:20px; line-height:0;">
                        <img src="{img}" alt="{alt}" width="180" style="width:180px; max-width:100%; height:auto; display:block; border-radius:10px;" />
                      </td>
                      <td class="product-txt-col" valign="top">
                        <div style="font-family:{F}; font-size:10px; font-weight:700; letter-spacing:0.24em; text-transform:uppercase; color:{GOLD_INK};">Dekor v e-shope</div>
                        <div style="font-family:{F}; font-size:20px; font-weight:700; line-height:26px; letter-spacing:0.04em; color:{INK}; margin-top:6px;">{name}</div>
                        <div style="font-family:{F}; font-size:13.5px; font-weight:400; line-height:21px; color:{BODY}; margin-top:8px;">{desc}</div>
                        <div style="font-family:{F}; font-size:10px; font-weight:700; letter-spacing:0.18em; text-transform:uppercase; color:{GRAY}; margin-top:10px;">{spec}</div>
                        <div style="margin-top:16px;">{button(cta_label, href, width=220)}</div>{link_html}
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
"""


def letter(paragraphs, signoff, name, role, avatar, top=22):
    ps = "".join(f'<p style="margin:0 0 18px;">{p}</p>' for p in paragraphs)
    return f"""
        <!-- LIST (osobný tón, bez dekorácií) -->
        <tr>
          <td class="px-40 letter" style="padding:{top}px 40px 4px; font-family:{F}; font-size:16px; font-weight:300; line-height:27px; color:{BODY};">
            {ps}
            <p style="margin:0 0 14px;">{signoff}</p>
            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td valign="middle" width="64" style="padding-right:14px;"><img class="ps-avatar" src="{avatar}" alt="{name}" width="52" height="52" style="display:block; width:52px; height:52px; border-radius:9999px; border:0;" /></td>
                <td valign="middle">
                  <div style="font-family:{F}; font-size:16px; font-weight:700; color:{INK};">{name}</div>
                  <div style="font-family:{F}; font-size:12px; font-weight:400; color:{GRAY}; margin-top:2px;">{role}</div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
"""


def ps(html, who="Marián, Orostone", top=28, bottom=36, avatar=True):
    av = f"""
                      <td valign="top" width="56" style="padding-right:14px;">
                        <img class="ps-avatar" src="{SITE}/images/marian-brazdil.png" alt="Marián, Orostone" width="48" height="48" style="display:block; width:48px; height:48px; border-radius:9999px; border:0;" />
                      </td>""" if avatar else ""
    return f"""
        <!-- P.S. -->
        <tr>
          <td class="px-40" style="padding:{top}px 40px {bottom}px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FBF7EA; border-left:3px solid {GOLD}; border-radius:0 12px 12px 0;">
              <tr>
                <td class="ps-cell" style="padding:20px 24px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>{av}
                      <td valign="top">
                        <div style="font-family:{F}; font-size:9.5px; font-weight:700; letter-spacing:0.24em; text-transform:uppercase; color:{GOLD_INK}; margin-bottom:8px;">P.&nbsp;S. &middot; {who}</div>
                        <div style="font-family:{F}; font-size:13.5px; font-weight:400; line-height:22px; color:#3d3729;">{html}</div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
"""


def signature(top=8):
    """Podpisový blok — opakuje sa v každom e-maile (ako Graza 'Squeezable / Single Origin…')."""
    return f"""
        <!-- PODPIS ZNAČKY -->
        <tr>
          <td style="padding:{top}px 40px 0;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr><td style="border-bottom:1px solid rgba(26,26,26,0.10); font-size:0; line-height:0; height:52px;">&nbsp;</td></tr>
              <tr>
                <td align="center" style="line-height:0;">
                  <img class="badge-divider" src="https://raw.githubusercontent.com/orosotne/orostone-assets/master/orostone-badge-ig-post-transparent.png" alt="Krása kameňa, sila technológie" width="112" height="112" style="display:inline-block; width:112px; height:112px; margin-top:-56px; border:0; background:{CARD}; padding:0 18px;" />
                </td>
              </tr>
              <tr>
                <td align="center" style="padding:14px 0 36px; font-family:{F}; font-size:18px; line-height:26px; color:{INK};">
                  <span style="font-weight:700;">Krása kameňa.</span><br />
                  <span style="font-weight:300; font-style:italic;">Sila technológie.</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
"""


def footer(reason="Tento e-mail ste dostali, pretože ste sa prihlásili na odber noviniek Orostone."):
    return f"""
        <!-- FOOTER -->
        <tr>
          <td class="px-40" style="padding:28px 40px 20px; background:{INK};">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td class="footer-brand" align="left" valign="middle" style="padding-bottom:18px;">
                  <img src="{IMG}orostone-logo-white.png" alt="Orostone" height="26" style="display:block; height:26px; width:auto; border:0;" />
                  <div style="font-family:{F}; font-weight:300; font-size:11px; color:#9CA3AF; margin-top:8px;">Sinterovaný kameň &middot; pracovné dosky</div>
                </td>
                <td class="footer-socials" align="right" valign="middle" style="padding-bottom:18px;">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="right">
                    <tr>
                      <td style="padding-left:8px;"><a href="https://www.instagram.com/orostone_/" target="_blank" style="display:inline-block; width:34px; height:34px; border:1px solid rgba(255,255,255,0.18); border-radius:9999px; text-decoration:none;"><img src="https://cdn.simpleicons.org/instagram/white" alt="Instagram" width="16" height="16" style="display:block; margin:8px auto; border:0;" /></a></td>
                      <td style="padding-left:8px;"><a href="https://www.facebook.com/orostone.sk/" target="_blank" style="display:inline-block; width:34px; height:34px; border:1px solid rgba(255,255,255,0.18); border-radius:9999px; text-decoration:none;"><img src="https://cdn.simpleicons.org/facebook/white" alt="Facebook" width="16" height="16" style="display:block; margin:8px auto; border:0;" /></a></td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr><td colspan="2" style="border-top:1px solid rgba(255,255,255,0.10); font-size:0; line-height:0;">&nbsp;</td></tr>
              <tr>
                <td colspan="2" style="padding:18px 0 6px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td class="footer-col" valign="top" width="50%" style="padding-right:12px; font-family:{F}; font-size:10px; font-weight:700; letter-spacing:0.22em; text-transform:uppercase; color:{GOLD};">
                        Showroom
                        <div style="font-weight:300; letter-spacing:0; text-transform:none; font-size:12px; color:#E5E7EB; margin-top:6px; line-height:18px;">SNP 113/1<br />956 18 Bošany</div>
                      </td>
                      <td class="footer-col" valign="top" width="50%" style="padding-left:12px; font-family:{F}; font-size:10px; font-weight:700; letter-spacing:0.22em; text-transform:uppercase; color:{GOLD};">
                        Kontakt
                        <div style="font-weight:300; letter-spacing:0; text-transform:none; font-size:12px; color:#E5E7EB; margin-top:6px; line-height:18px;"><a href="tel:+421917588738" style="color:#E5E7EB; text-decoration:none;">+421 917 588 738</a><br /><a href="{SITE}" style="color:#E5E7EB; text-decoration:underline;">orostone.sk</a></div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- LEGAL / UNSUB -->
        <tr>
          <td class="px-40" style="padding:18px 40px 26px; background:#0F0F0F;">
            <div style="font-family:{F}; font-size:10.5px; font-weight:300; line-height:16px; color:#9CA3AF;">{reason}</div>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:10px;">
              <tr>
                <td align="left" style="font-family:{F}; font-size:10.5px; font-weight:300; color:#9CA3AF;">&copy; 2026 Orostone, s.&nbsp;r.&nbsp;o.</td>
                <td align="right" style="font-family:{F}; font-size:10.5px; font-weight:300;"><a href="{{% unsubscribe %}}" style="color:#E5E7EB; text-decoration:underline;">Odhlásiť odber</a></td>
              </tr>
            </table>
          </td>
        </tr>
"""


def case_card(img, alt, label, title, body, top=24):
    """Realizácia / krok: fotka cez celú šírku, pod ňou štítok, nadpis a jedna veta."""
    return f"""
        <!-- REALIZÁCIA (karta) -->
        <tr>
          <td class="px-40" style="padding:{top}px 40px 0;">
            <img src="{img}" alt="{alt}" width="520" style="width:100%; max-width:520px; height:auto; display:block; border-radius:12px;" />
            <div style="font-family:{F}; font-size:10px; font-weight:700; letter-spacing:0.22em; text-transform:uppercase; color:{GOLD_INK}; margin-top:14px; line-height:15px;">{label}</div>
            <div style="font-family:{F}; font-size:18px; font-weight:700; line-height:24px; color:{INK}; margin-top:6px;">{title}</div>
            <div style="font-family:{F}; font-size:14px; font-weight:400; line-height:22px; color:{BODY}; margin-top:6px;">{body}</div>
          </td>
        </tr>
"""


def note(html, top=12):
    """Drobná poznámka pod blokom (napr. ilustračné zábery)."""
    return f"""
        <!-- POZNÁMKA -->
        <tr>
          <td class="px-40" style="padding:{top}px 40px 0; font-family:{F}; font-size:12px; font-weight:400; line-height:18px; color:{GRAY};">{html}</td>
        </tr>
"""


PLAIN_F = "Helvetica,Arial,sans-serif"


def plain(meta, title, preheader, paragraphs, reason, greeting="Dobrý deň,",
          sign=("S pozdravom", "Marián Brázdil", "Orostone · sinterovaný kameň", "+421 917 588 738")):
    """Čistý text bez dizajnu: osobný e-mail od Mariána (Graza ~1 z 5)."""
    meta_lines = "\n".join(f"  {k:<10} {v}" for k, v in meta.items())
    pre_pad = "&nbsp;&zwnj;" * 40
    ps_html = "".join(f'<p style="margin:0 0 16px;">{x}</p>' for x in paragraphs)
    s1, s2, s3, s4 = sign
    return f"""<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<!--
  OROSTONE – e-mailová šablóna (skill orostone-newsletter), čistý text
{meta_lines}
-->
<html xmlns="http://www.w3.org/1999/xhtml" lang="sk">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="color-scheme" content="light only" />
<title>{title}</title>
</head>
<body style="margin:0; padding:0; background:#FFFFFF;">

<!-- Preheader -->
<div style="display:none; max-height:0; overflow:hidden; mso-hide:all; font-size:1px; line-height:1px; color:#FFFFFF;">
  {preheader}
  {pre_pad}
</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FFFFFF;">
  <tr>
    <td align="left" style="padding:24px 20px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">
        <!-- LIST (osobný tón, bez dekorácií) -->
        <tr>
          <td style="font-family:{PLAIN_F}; font-size:15px; line-height:24px; color:#1A1A1A;">
            <p style="margin:0 0 16px;">{greeting}</p>
            {ps_html}
            <p style="margin:24px 0 0;">{s1}<br />{s2}<br />{s3}<br /><a href="tel:+421917588738" style="color:#1A1A1A; text-decoration:none;">{s4}</a></p>
          </td>
        </tr>
        <!-- LEGAL / UNSUB -->
        <tr>
          <td style="padding-top:32px; font-family:{PLAIN_F}; font-size:11px; line-height:17px; color:#6B7280;">
            {reason} <a href="{{% unsubscribe %}}" style="color:#6B7280; text-decoration:underline;">Odhlásiť odber</a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>

</body>
</html>
"""


def write(name, html):
    p = os.path.join(OUT, name)
    with open(p, "w", encoding="utf-8") as fh:
        fh.write(html)
    print(f"{name}: {len(html.encode('utf-8')) // 1024} KB")


# ---------------------------------------------------------------------------
# Šablóny
# ---------------------------------------------------------------------------

# 1 — Welcome 1/4: Vitajte
write("01-welcome-vitajte.html", doc(
    {
        "TYP:": "Automatizácia · Welcome séria 1/4",
        "SPÚŠŤAČ:": "Hneď po prihlásení na odber (popup, pätička, sekcia vzoriek)",
        "PREDMET:": "Vitajte v Orostone. Toto vám budeme posielať",
        "PREHEADER:": "Dvakrát do mesiaca vám pošleme jednu vec, ktorá pomôže pri výbere pracovnej dosky. Výpredaje neposielame.",
        "CIEĽ:": "Nastaviť očakávania + prvý krok: objednať vzorku",
        "POZNÁMKA:": "Kód WELCOME5 nechaj, kým ho sľubuje popup na webe.",
    },
    "Vitajte v Orostone",
    "Dvakrát do mesiaca vám pošleme jednu vec, ktorá pomôže pri výbere pracovnej dosky. Výpredaje neposielame.",
    [
        header("Vitajte", "1 / 4"),
        dark_band("Vitajte v Orostone",
                  "Pracovná doska<br />" + accent_dark("sa vyberá raz."),
                  sub="Preto vám budeme posielať len to, čo pri tom rozhodnutí naozaj pomôže."),
        hero(IMG + "uvitanie-ostrovcek.jpg", "Ostrovček zo sinterovaného kameňa v svetlej kuchyni", capsule="Realizácia Orostone", top=32),
        text([
            "ďakujeme, že ste sa prihlásili. Orostone je sinterovaný kameň pre kuchyne a interiéry – pracovné dosky, ostrovčeky a zásteny.",
            "Newsletter píšeme pre ľudí, ktorí dosku práve vyberajú alebo ju budú vyberať o pár mesiacov. Výpredaje v ňom nenájdete. Nájdete v ňom to, čo pomáha rozhodnúť sa rozumne.",
        ]),
        section_title(None, "Čo vám budeme posielať", top=16),
        numbered([
            ("Realizácie", "Skutočné kuchyne: zadanie, zvolený dekor a výsledok vo veľkej ploche."),
            ("Dekory v detaile", "Jeden dekor bez prikrášľovania – kresba, kombinácie so skrinkami a miesta, kde funguje najlepšie."),
            ("Sprievodcovia", "Hrúbka, hrany, údržba aj cena. Vecne a bez technického žargónu."),
        ], note="Približne dvakrát do mesiaca. Odhlásiť sa dá jedným kliknutím v pätičke."),
        card_offer("Prvý krok", "Vzorka na stôl",
                   "Kresbu kameňa najlepšie posúdite doma – pri svojom svetle a vedľa svojich skriniek. Vzorku vám pošleme, platíte iba poštovné 2,50&nbsp;€.",
                   "Objednať vzorku", SITE + "/vzorky",
                   note='Sľúbený uvítací kód: <strong style="font-weight:700; color:#1A1A1A;">WELCOME5</strong> – 5&nbsp;% na prvý nákup v e-shope orostone.sk.'),
        ps('Ak už máte pôdorys kuchyne, pošlite nám ho v odpovedi na tento e-mail. <strong style="font-weight:700; color:#1A1A1A;">Pripravíme orientačné cenové rozpätie</strong> pre váš projekt – nezáväzne.'),
        signature(top=0),
        footer(),
    ]))

# 2 – Welcome 2/4: List od Mariána
write("02-welcome-list-od-mariana.html", doc(
    {
        "TYP:": "Automatizácia · Welcome séria 2/4",
        "SPÚŠŤAČ:": "2 dni po e-maile 1/4",
        "PREDMET:": "Krátky list namiesto reklamy",
        "PREHEADER:": "Vysvetlím, prečo pri pracovnej doske nestačí malá vzorka a cena za meter – a čo s tým robíme.",
        "CIEĽ:": "Dôvera + odpoveď (reply). Vizuálne čo najjednoduchší – má pôsobiť ako osobný e-mail.",
        "POZNÁMKA:": "Text musí Marián prečítať a upraviť vlastnými slovami – je to jeho list.",
    },
    "Krátky list namiesto reklamy",
    "Vysvetlím, prečo pri pracovnej doske nestačí malá vzorka a cena za meter – a čo s tým robíme.",
    [
        header("Vitajte", "2 / 4"),
        strip(IMG + "pas-givenchy-gold.jpg", "Detail kresby sinterovaného kameňa Givenchy Gold"),
        eyebrow("List od Mariána", top=30),
        headline("Krátky list<br />" + accent_light("namiesto reklamy."), top=18, bottom=0),
        letter([
            "Dobrý deň,",
            "volám sa Marián Brázdil a v Orostone pomáham ľuďom vybrať sinterovaný kameň do kuchyne.",
            "Pri pracovných doskách vidíme dookola dve chyby. Prvá: rozhodnutie podľa vzorky veľkej ako dlaň. Kresba, ktorá na vzorke pôsobí pokojne, môže byť na troch metroch výrazná – a naopak. Druhá: porovnávanie ceny za meter bez ohľadu na to, čo cena zahŕňa a čo nie.",
            "Preto vám pred rozhodnutím ukážeme celé platne. V showroome v Bošanoch, v renesančnom kaštieli, ich uvidíte vo formáte 3200 × 1600&nbsp;mm – tak, ako budú pôsobiť vo vašej kuchyni.",
            "Výrobu a montáž robia kamenári, s ktorými spolupracujeme a ktorí so sinterovaným kameňom vedia pracovať. Vy riešite jedno: aby výsledok dobre vyzeral, bol praktický v každodennom používaní a mal rozumnú cenu.",
            'Ak sa chcete na niečo spýtať, odpovedzte na tento e-mail. Číta ho človek. Medzitým si môžete <a href="' + SITE + '/realizacie" target="_blank" style="color:#1A1A1A; font-weight:500; text-decoration:underline;">pozrieť realizácie</a>.',
        ], "S pozdravom", "Marián Brázdil", "Orostone · sinterovaný kameň", SITE + "/images/marian-brazdil.png"),
        ps("Ak plánujete návštevu showroomu, napíšte nám vopred, ktoré dekory vás zaujímajú. Pripravíme vám platne s týmito dekormi.", who="Marián", top=28, avatar=False),
        signature(top=0),
        footer(),
    ]))

# 3 – Kampaň: Realizácia mesiaca
write("03-kampan-realizacia-mesiaca.html", doc(
    {
        "TYP:": "Kampaň · séria Realizácia mesiaca (1× mesačne)",
        "SEGMENT:": "Všetci odberatelia; mimo zákazníkov po realizácii",
        "PREDMET:": "Taj Mahal na dlhom ostrovčeku s drezom",
        "PREHEADER:": "V realizácii mesiaca ukážeme, prečo padla voľba na krémový dekor a ako pôsobí vo veľkej ploche.",
        "CIEĽ:": "Ukázať výsledok vo veľkej ploche → vzorka dekoru / pôdorys",
        "POZNÁMKA:": "Hranaté zátvorky [ ] nahraď skutočnými údajmi a citátom klienta (so súhlasom).",
    },
    "Realizácia mesiaca: Taj Mahal",
    "V realizácii mesiaca ukážeme, prečo padla voľba na krémový dekor a ako pôsobí vo veľkej ploche.",
    [
        header("Realizácia mesiaca", "október 2026"),
        eyebrow("Realizácia mesiaca", note="Raz mesačne jedna skutočná kuchyňa: zadanie, dekor a výsledok."),
        headline("Taj Mahal<br />" + accent_light("na dlhom ostrovčeku.")),
        hero(IMG + "realizacia-taj-mahal-hero.jpg", "Dlhý ostrovček s drezom v dekore Taj Mahal", capsule="Taj Mahal", top=14),
        facts([("Dekor", "Taj Mahal"), ("Aplikácia", "Ostrovček s drezom"), ("Lokalita", "[doplniť]"), ("Montáž", "[partner kamenár]")]),
        text([
            "tentoraz ukazujeme kuchyňu, v ktorej celému priestoru dominuje jeden prvok: dlhý ostrovček s drezom v dekore Taj Mahal.",
        ], top=22),
        numbered([
            ("Zadanie", "[1–2 vety: čo klient riešil – priestor, štýl, čo nechcel.]"),
            ("Prečo Taj Mahal", "Teplý krémový základ s jemným žilkovaním. Na veľkej ploche pôsobí pokojne a ladí so svetlými frontami aj teplým drevom."),
            ("Výsledok", "[1–2 vety: ako sa s doskou žije po pár mesiacoch používania.]"),
        ], top=4),
        pair((IMG + "realizacia-taj-mahal-1.jpg", "Ostrovček Taj Mahal – pohľad od drezu"),
             (IMG + "realizacia-taj-mahal-2.jpg", "Ostrovček Taj Mahal – pracovná plocha"),
             caption="Jedna kresba po celej dĺžke ostrovčeka"),
        quote_dark("Slovami klienta", "„[Citát klienta – jedna konkrétna veta o tom, ako sa s doskou žije.]“", attribution="[Meno, mesto]", top=20),
        product(shop_img("Taj_Mahal_6.png", "1776676422", 360), "Dekor Taj Mahal – detail ostrovčeka", "TAJ MAHAL",
                "Krémové a béžové odtiene, jemné žilky a vrstvená kresba. Povrch Silk.",
                "3200 × 1600 mm · 12 mm", "Objednať vzorku", SITE + "/vzorky",
                link=("Pozrieť dekor", SITE + "/produkt/taj-mahal")),
        ps('Zvažujete podobný ostrovček? Pošlite pôdorys s rozmermi – <strong style="font-weight:700; color:#1A1A1A;">pripravíme orientačné cenové rozpätie</strong> presne pre váš rozmer.'),
        signature(top=0),
        footer(),
    ]))

# 4 – Kampaň: Dekor v detaile
write("04-kampan-dekor-v-detaile.html", doc(
    {
        "TYP:": "Kampaň · séria Dekor v detaile (1× mesačne, strieda sa s Realizáciou)",
        "PREDMET:": "Roman Travertine: travertín bez impregnácie",
        "PREHEADER:": "Ukážeme, ako dekor vyzerá na celej platni, s čím ho kombinovať a na čo myslieť pri smere kresby.",
        "CIEĽ:": "Pomôcť rozhodnúť sa o jednom dekore → objednať vzorku",
        "POZNÁMKA:": "Fakty berieme z produktových dát (rozmer, hrúbka, povrch, nasiakavosť).",
    },
    "Dekor v detaile: Roman Travertine",
    "Ukážeme, ako dekor vyzerá na celej platni, s čím ho kombinovať a na čo myslieť pri smere kresby.",
    [
        header("Dekor v detaile", "október 2026"),
        dark_band("Dekor v detaile",
                  "Roman Travertine.<br />" + accent_dark("Travertín bez impregnácie."),
                  sub="Teplé krémové odtiene a pozdĺžna kresba travertínu – na povrchu s nasiakavosťou pod 0,1&nbsp;%.",
                  image=(shop_img("Roman_Travertine_1.png", "1776676498"), "Kuchyňa s ostrovčekom a pracovnou doskou Roman Travertine")),
        text([
            "Roman Travertine je dekor s architektonickým charakterom. Pripomína vrstvenie travertínu, no na rozdiel od pravého travertínu nepotrebuje impregnáciu.",
            "Funguje tam, kde má povrch priniesť textúru a dojem prírodného materiálu bez prehnaného efektu.",
        ], top=28),
        section_title("01", "Vo veľkej ploche", top=8),
        figure(shop_img("mockup-ROMAN-TRAVERTINE.webp", "1773771257"), "Celá platňa Roman Travertine vedľa človeka pre mierku",
               caption="Celá platňa 3200 × 1600 mm · dlhé línie kresby na malej vzorke neuvidíte", top=16),
        section_title("02", "Kde funguje a na čo myslieť"),
        split(("Kde funguje", ["Pracovné dosky a ostrovčeky", "Obklad steny za linkou", "Interiéry s prírodným drevom a textúrovanou omietkou"]),
              ("Na čo myslieť", ["Smer kresby: pozdĺžne pásiky pôsobia inak na doske a na boku ostrovčeka.", "Rozloženie: pozrite si fotku celej platne a rezy naplánujte s kamenárom."])),
        pair((shop_img("Roman_Travertine_2.png", "1776676498", 520), "Bok ostrovčeka v dekore Roman Travertine"),
             (shop_img("Roman_Travertine_3.png", "1776676485", 520), "Ostrovček Roman Travertine zhora"),
             caption="Bok a vrch ostrovčeka · pásiky menia smer", top=16),
        section_title("03", "S čím ho kombinovať"),
        media_row(shop_img("Roman_Travertine_5.png", "1776676484", 420), "Moodboard: Roman Travertine s drevom, čiernym kovom a mosadzou", [
            ("#9A7552", "Prírodné drevo", "Dub alebo orech v teplých tónoch."),
            ("#D8D0C2", "Textúrovaná omietka", "Matné steny, ktoré nesúperia s kresbou."),
            ("#2B2B2B", "Tmavý kov", "Čierna batéria alebo úchytky ku krémovým dvierkam."),
        ]),
        facts([("Rozmer", "3200 × 1600 mm"), ("Hrúbka", "12 mm"), ("Povrch", "Matt Ultrasoft"), ("Nasiakavosť", "&lt; 0,1 %")], top=26),
        cta("Objednať vzorku", SITE + "/vzorky", link=("Pozrieť dekor v e-shope", SITE + "/produkt/roman-travertine"), top=26),
        ps('Rozloženie kresby travertínu na veľkej ploche najlepšie naplánujete podľa pôdorysu. Pošlite ho – <strong style="font-weight:700; color:#1A1A1A;">pripravíme orientačné cenové rozpätie</strong> aj odporúčanie, koľko platní budete potrebovať.'),
        signature(top=0),
        footer(),
    ]))

# 5 – Automatizácia: Vzorka doma
write("05-automatizacia-vzorka-doma.html", doc(
    {
        "TYP:": "Automatizácia · Vzorky 2/4",
        "SPÚŠŤAČ:": "2 dni po doručení vzorky (Shopify fulfillment / Packeta delivered)",
        "PREDMET:": "Vzorka je doma. Skúste s ňou 4 veci",
        "PREHEADER:": "Stačí víno, citrón, hrnček horúcej vody a vaše svetlo. Za desať minút zistíte viac než z katalógu.",
        "CIEĽ:": "Zapojiť zákazníka do testovania → pôdorys / orientačná cena",
        "POZNÁMKA:": "Pri viacerých vzorkách použi názov dekoru v úvode (dynamický blok).",
    },
    "Vzorka je doma",
    "Stačí víno, citrón, hrnček horúcej vody a vaše svetlo. Za desať minút zistíte viac než z katalógu.",
    [
        header("Vaša vzorka", "tip"),
        eyebrow("Vzorka doma"),
        headline("Vzorka nie je suvenír.<br />" + accent_light("Vyskúšajte ju.")),
        hero(IMG + "vzorka-balicek.jpg", "Balíček so vzorkou sinterovaného kameňa Orostone", capsule="Vzorka 12 mm", top=14),
        text([
            "vzorka by už mala byť u vás. Skôr než ju niekam odložíte, venujte jej desať minút. Tieto štyri skúšky vám o doske povedia viac než katalóg.",
        ], top=24),
        numbered([
            ("Červené víno alebo káva", "Pár kvapiek dajte na vzorku a nechajte ich hodinu pôsobiť. Potom vzorku utrite vlhkou utierkou. Pri nasiakavosti pod 0,1&nbsp;% sa škvrna do povrchu nevpije."),
            ("Citrón", "Položte polovicu citróna reznou stranou na vzorku. Po utretí sa pozrite na povrch proti svetlu."),
            ("Hrnček horúcej vody", "Postavte na vzorku hrnček s vriacou vodou. V kuchyni to znamená menej starostí pri varení."),
            ("Vaše svetlo", "Pozrite sa na vzorku ráno aj večer, vedľa dvierok skriniek a podlahy. Dekor pôsobí inak pri dennom a inak pri teplom umelom svetle."),
        ], top=4),
        quote_dark("Dôležité", 'Malá vzorka nestačí na veľké rozhodnutie. <strong style="font-weight:700; font-style:normal; color:#ECD488;">Kresbu vo veľkej ploche</strong> uvidíte na celej platni – v showroome alebo na fotkách realizácií.', top=24),
        cta("Získať orientačnú cenu", SITE + "/cennik", sub="Stačí pôdorys alebo základné rozmery kuchyne.", link=("Pozrieť realizácie", SITE + "/realizacie"), width=280),
        ps("Váhate medzi dvoma dekormi? Pošlite nám fotku oboch vzoriek vo svojej kuchyni. Poradíme, ktorý bude vo veľkej ploche fungovať lepšie."),
        signature(top=0),
        footer(reason="Tento e-mail ste dostali, pretože ste si v e-shope orostone.sk objednali vzorku."),
    ]))

# 6 – Automatizácia: Po realizácii
write("06-automatizacia-po-realizacii.html", doc(
    {
        "TYP:": "Automatizácia · Po realizácii 3/4 (30 dní po montáži)",
        "SPÚŠŤAČ:": "30 dní po montáži (dátum montáže z CRM)",
        "PREDMET:": "Ako sa vám žije s novou doskou?",
        "PREHEADER:": "Hodnotenie vám zaberie dve minúty a pomôže ďalším pri výbere. Budeme radi aj za jednu fotku.",
        "CIEĽ:": "Recenzia na Google + fotka do série Realizácia mesiaca",
        "POZNÁMKA:": "Doplň odkaz na Google recenzie a pravidlá zverejnenia fotky (súhlas).",
    },
    "Ako sa vám žije s novou doskou?",
    "Hodnotenie vám zaberie dve minúty a pomôže ďalším pri výbere. Budeme radi aj za jednu fotku.",
    [
        header("Po realizácii"),
        dark_band("Mesiac po montáži",
                  "Ako sa vám žije<br />" + accent_dark("s novou doskou?"),
                  image=(IMG + "po-realizacii-zlatobiely.jpg", "Ostrovček a zástena zo sinterovaného kameňa po montáži")),
        text([
            "od montáže uplynul približne mesiac – dosť na to, aby ste dosku poznali v každodennom používaní.",
            "Budeme radi, ak nám napíšete, ako ste s doskou spokojní. Ľuďom, ktorí sa práve rozhodujú, pomôže skúsenosť skutočného zákazníka viac než čokoľvek, čo napíšeme my.",
        ], top=28),
        card_offer("Dve minúty", "Napíšte hodnotenie",
                   "Pár viet na Google: aký dekor ste vybrali, ako prebehla montáž a ako sa doska správa v kuchyni.",
                   "Napísať hodnotenie", "[ODKAZ NA GOOGLE RECENZIE]"),
        card_offer("Realizácia mesiaca", "Pošlite fotku kuchyne",
                   "Ak súhlasíte, ukážeme vašu kuchyňu v sérii Realizácia mesiaca. Stačí fotka z mobilu pri dennom svetle.",
                   "Poslať fotku", "mailto:info@orostone.sk?subject=Fotka%20kuchyne",
                   note="Fotku zverejníme len s vaším súhlasom a bez adresy.", top=16),
        section_title(None, "Starostlivosť v skratke"),
        numbered([
            ("Bežné čistenie", "Vlhká utierka a jemný čistiaci prostriedok. Bez impregnácie – povrch ju nepotrebuje."),
            ("Krájajte na doštičke", "Nie kvôli povrchu, ale kvôli nožom: sinterovaný kameň je tvrdší než oceľ čepele."),
        ], top=8),
        ps("Ak by vás čokoľvek trápilo, odpovedzte na tento e-mail. Ozveme sa a vyriešime to."),
        signature(top=0),
        footer(reason="Tento e-mail ste dostali ako zákazník Orostone po realizácii pracovnej dosky."),
    ]))


# 7 – Welcome 3/4: Ako vybrať dekor (+ preferencia horizontu)
write("07-welcome-ako-vybrat-dekor.html", doc(
    {
        "TYP:": "Automatizácia · Welcome séria 3/4",
        "SPÚŠŤAČ:": "5 dní po prihlásení (3 dni po e-maile 2/4)",
        "PREDMET:": "Tri otázky pred výberom dekoru",
        "PREHEADER:": "Týkajú sa svetla, skriniek a veľkosti plochy. Na konci sa vás opýtame, kedy plánujete novú kuchyňu.",
        "CIEĽ:": "Edukácia + zistiť horizont projektu (klik = segment)",
        "POZNÁMKA:": "Každé tlačidlo voľby je samostatný odkaz s parametrom horizont=…; v ESP vytvor segment podľa kliku na odkaz.",
    },
    "Tri otázky pred výberom dekoru",
    "Týkajú sa svetla, skriniek a veľkosti plochy. Na konci sa vás opýtame, kedy plánujete novú kuchyňu.",
    [
        header("Vitajte", "3 / 4"),
        eyebrow("Ako vybrať dekor", note="Tri otázky, ktoré si pred výberom dekoru prejdeme s každým klientom."),
        headline("Tri otázky<br />" + accent_light("pred výberom dekoru.")),
        hero(shop_img("mockup-TAJ-MAHAL.webp", "1773771257"), "Celá platňa Taj Mahal vedľa človeka pre mierku", capsule="Taj Mahal · 3200 × 1600 mm", top=14),
        text([
            "dekor sa najčastejšie vyberá podľa vzorky a fotky na mobile. Vo veľkej ploche a vo vašej kuchyni sa však môže správať inak. Tieto tri otázky vám pomôžu zúžiť výber skôr, než si objednáte vzorky.",
        ], top=24),
        numbered([
            ("Aké svetlo máte v kuchyni?", "Denné svetlo z juhu zosvetlí aj teplé dekory, večer pri teplých žiarovkách vyniknú béžové tóny. Vzorku si preto pozrite pri svojom svetle, nie v obchode."),
            ("Aké budú skrinky a podlaha?", "Dekor vyberajte k frontom, nie samostatne. Výrazná kresba potrebuje pokojné matné fronty, pokojný dekor znesie výraznejšie drevo."),
            ("Aká veľká bude plocha?", "Na ostrovčeku vynikne kresba, ktorú na vzorke nevidno. Pri veľkej ploche si pozrite fotku celej platne, aby ste vedeli, kde budú žily a kde rezy."),
        ], top=4),
        quote_dark("Pravidlo", 'Najdrahší kompromis pri pracovnej doske býva ten, <strong style="font-weight:700; font-style:normal; color:#ECD488;">ktorý na začiatku vyzeral ako úspora.</strong>', top=24),
        choices("Kedy plánujete novú kuchyňu?",
                "Kliknite na jednu možnosť. Podľa nej vám budeme posielať to, čo práve potrebujete – nič viac.",
                [("Do 3 mesiacov", SITE + "/realizacie?horizont=do-3-mesiacov"),
                 ("O 3 až 12 mesiacov", SITE + "/realizacie?horizont=3-12-mesiacov"),
                 ("Zatiaľ sa len inšpirujem", SITE + "/realizacie?horizont=inspiracia")]),
        cta("Pozrieť dekory", SITE + "/", link=("Objednať vzorky", SITE + "/vzorky")),
        ps("Ak si nie ste istí, pošlite fotku kuchyne alebo vizualizáciu. Poradíme, ktoré dva až tri dekory má zmysel objednať ako vzorky."),
        signature(top=0),
        footer(),
    ]))

# 8 – Automatizácia: Dokončená zákazka (deň montáže)
write("08-automatizacia-dokoncena-zakazka.html", doc(
    {
        "TYP:": "Automatizácia · Po realizácii 1/4 (deň montáže)",
        "SPÚŠŤAČ:": "Marián označí zákazku v CRM ako dokončenú a nahrá fotky z montáže",
        "PREDMET:": "Hotovo: fotky z vašej montáže",
        "PREHEADER:": "Ďakujeme za dôveru. Posielame fotky z prvého dňa a prehľad toho, čo bude nasledovať.",
        "CIEĽ:": "Poďakovanie, súhlas so zverejnením fotiek (IG + newsletter), nastaviť očakávania",
        "FOTKY:": "Pre každého klienta iné: Marián ich vloží ručne (duplikát šablóny), alebo ich CRM zapíše do profilu ako foto_1–foto_3 (URL) a šablóna použije {{ person|lookup:'foto_1' }}.",
        "POZNÁMKA:": "Hranaté zátvorky nahraď údajmi zákazky. Tlačidlá súhlasu = samostatné odkazy → segment/vlastnosť profilu.",
    },
    "Hotovo: fotky z vašej montáže",
    "Ďakujeme za dôveru. Posielame fotky z prvého dňa a prehľad toho, čo bude nasledovať.",
    [
        header("Vaša kuchyňa", "deň montáže"),
        dark_band("Hotovo",
                  "Vaša doska<br />" + accent_dark("je na svojom mieste."),
                  sub="Posielame fotky z dnešnej montáže. Ďakujeme, že ste si vybrali Orostone.",
                  image=(IMG + "zakazka-hotovo-hero.jpg", "Ostrovček a kamenná stena v dekore Calacatta Gold v deň montáže")),
        text([
            "montáž je za nami. Fotky sme urobili hneď po dokončení – takto vyzerala vaša kuchyňa v prvý deň.",
        ], top=28),
        pair((IMG + "zakazka-hotovo-1.jpg", "Ostrovček s varnou doskou po montáži"),
             (IMG + "zakazka-hotovo-2.jpg", "Pracovná doska s drezom po montáži"),
             caption="Prvý deň po montáži", top=8),
        facts([("Dekor", "[Calacatta Gold]"), ("Aplikácia", "[ostrovček + stena]"), ("Montáž", "[dátum]"), ("Kamenár", "[meno]")], top=16),
        section_title(None, "Čo bude nasledovať"),
        numbered([
            ("O týždeň: starostlivosť v skratke", "Krátky návod, ako dosku čistiť a čomu sa vyhnúť."),
            ("O mesiac: ako sa vám žije s doskou", "Jedna otázka a prosba o hodnotenie, ak budete spokojní."),
            ("Kedykoľvek: napíšte nám", "Ak by čokoľvek nesedelo, odpovedzte na tento e-mail. Vyriešime to s kamenárom."),
        ], top=8),
        choices("Môžeme vašu kuchyňu ukázať ďalším?",
                "Fotky by sme zverejnili na Instagrame a v newsletteri – bez adresy a bez mien. Stačí jedno kliknutie.",
                [("Áno, môžete ich zverejniť", SITE + "/realizacie?suhlas=ano"),
                 ("Áno, ale najprv mi ich ukážte", SITE + "/realizacie?suhlas=najprv-ukazat"),
                 ("Radšej nie", SITE + "/realizacie?suhlas=nie")]),
        ps("Ak poznáte niekoho, kto práve rieši kuchyňu, pokojne mu dajte náš kontakt. Rád poradím aj jemu."),
        signature(top=0),
        footer(reason="Tento e-mail ste dostali ako zákazník Orostone po dokončení montáže."),
    ]))

# ===========================================================================
# Do konca decembra 2026: 9 automatizácií + 4 kampane (09–21)
# Fotky označené „návrh“ potvrdí Martin; nové zábery sú z Higgsfield (Nano Banana 2,
# metóda zero distortion: vzor dekoru podľa referencie, priamy pohľad, bez skreslenia).
# ===========================================================================

SIGN_REASON = "Tento e-mail ste dostali, pretože ste sa prihlásili na odber noviniek Orostone."
REASON_VZORKA = "Tento e-mail ste dostali, pretože ste si v e-shope orostone.sk objednali vzorku."
REASON_PONUKA = "Tento e-mail ste dostali, pretože ste od Orostone dostali cenovú ponuku."
REASON_KOSIK = "Tento e-mail ste dostali, pretože ste v e-shope orostone.sk začali objednávať vzorku."
REASON_ZAKAZNIK = "Tento e-mail ste dostali ako zákazník Orostone po dokončení montáže."

# 9 – Welcome 4/4: Tri kuchyne, tri rôzne rozhodnutia
write("09-welcome-tri-kuchyne.html", doc(
    {
        "TYP:": "Automatizácia · Welcome séria 4/4",
        "SPÚŠŤAČ:": "9 dní po prihlásení (4 dni po e-maile 3/4)",
        "PREDMET:": "Tri kuchyne, tri rôzne rozhodnutia",
        "PREHEADER:": "Pri jednej rozhodla pokojná plocha, pri druhej tmavý kontrast a pri tretej výrazná kresba.",
        "CIEĽ:": "Ukázať, že dekor je rozhodnutie o celej kuchyni → pôdorys a orientačná cena",
        "POZNÁMKA:": "Realizácie a ich dekory potvrdí Martin (návrh). Potom odberateľ prechádza do kampaní; s horizontom do-3-mesiacov dostane pozvanie do showroomu (13).",
    },
    "Tri kuchyne, tri rôzne rozhodnutia",
    "Pri jednej rozhodla pokojná plocha, pri druhej tmavý kontrast a pri tretej výrazná kresba.",
    [
        header("Vitajte", "4 / 4"),
        eyebrow("Tri realizácie", note="Posledný e-mail uvítacej série: tri skutočné kuchyne a jedno rozhodnutie v každej z nich."),
        headline("Tri kuchyne,<br />" + accent_light("tri rôzne rozhodnutia.")),
        text([
            "v predchádzajúcom e-maile sme písali, že dekor sa vyberá k frontom, svetlu a veľkosti plochy. Takto to vyzerá v praxi – v troch kuchyniach, do ktorých sme dodali sinterovaný kameň.",
        ], top=20),
        case_card(IMG + "realizacia-kniznica.jpg", "Veľký ostrovček zo svetlého sinterovaného kameňa v otvorenom priestore",
                  "01 · Ostrovček v otvorenom priestore", "Pokojná kresba na veľkej ploche",
                  "Ostrovček je prvé, čo vidno z obývačky. Svetlý pokojný dekor drží priestor pokope a nesúperí s knižnicou ani s drevenou podlahou.", top=20),
        case_card(IMG + "realizacia-tmavoseda.jpg", "Tmavosivá pracovná doska v kuchyni s bielymi kazetovými skrinkami",
                  "02 · Klasická kuchyňa", "Tmavá doska k bielym frontom",
                  "Tmavosivá matná doska vytvára jasný kontrast s bielymi kazetovými dvierkami. Pracovná plocha je zreteľne ohraničená a kuchyňa pôsobí pokojne."),
        case_card(IMG + "realizacia-arden-gold.jpg", "Ostrovček a stena v dekore s výraznými zlatými žilami",
                  "03 · Ostrovček a stena", "Výrazná kresba ako stredobod",
                  "Zlaté žily na ostrovčeku aj na stene sú hlavným prvkom celej kuchyne. Ostatné povrchy preto ostali tiché – tmavé drevo a jednoduché fronty."),
        quote_dark("Čo majú spoločné", 'Každá kuchyňa má jeden hlavný prvok. Ak je kresba výrazná, okolie je tiché – <strong style="font-weight:700; font-style:normal; color:#ECD488;">a naopak</strong>.', top=28),
        cta("Poslať pôdorys a získať orientačnú cenu", SITE + "/cennik", sub="Stačí náčrt alebo základné rozmery kuchyne.", link=("Pozrieť všetky realizácie", SITE + "/realizacie"), width=320),
        ps("Ktorá z troch kuchýň je vám najbližšia? Odpovedzte jedným číslom – 1, 2 alebo 3. Pošlem vám dekory, ktoré sa k nej hodia najlepšie."),
        signature(top=0),
        footer(),
    ]))

# 10 – Vzorky 3/4: Ako dekor vyzerá vo veľkej ploche
write("10-automatizacia-vzorka-velka-plocha.html", doc(
    {
        "TYP:": "Automatizácia · Vzorky 3/4",
        "SPÚŠŤAČ:": "7 dní po doručení vzorky",
        "PREDMET:": "Ako váš dekor vyzerá vo veľkej ploche",
        "PREHEADER:": "Kresbu v mierke kuchyne uvidíte na fotke celej platne, v realizáciách alebo v showroome.",
        "CIEĽ:": "Ukázať dekor v mierke → stránka dekoru, ďalšia vzorka alebo pôdorys",
        "POZNÁMKA:": "V Klaviyo nahradiť názov dekoru, fotku celej platne a odkaz podľa objednanej vzorky (dynamický blok). Predvolený je Taj Mahal.",
    },
    "Ako váš dekor vyzerá vo veľkej ploche",
    "Kresbu v mierke kuchyne uvidíte na fotke celej platne, v realizáciách alebo v showroome.",
    [
        header("Vaša vzorka", "7 dní"),
        eyebrow("Vzorka doma"),
        headline("Malá vzorka,<br />" + accent_light("veľká plocha.")),
        hero(shop_img("mockup-TAJ-MAHAL.webp", "1773771257"), "Celá platňa Taj Mahal vedľa človeka pre mierku", capsule="Taj Mahal · 3200 × 1600 mm", top=14),
        text([
            "vzorku máte doma už týždeň. Farbu a povrch ste si overili, no jedno vám malý štvorec neukáže: ako sa kresba rozloží na troch metroch pracovnej dosky alebo na ostrovčeku.",
        ], top=24),
        section_title(None, "Tri spôsoby, ako vidieť dekor vo veľkej ploche", top=12),
        numbered([
            ("Fotka celej platne", "Na stránke dekoru je platňa 3200 × 1600&nbsp;mm vedľa človeka. Uvidíte, aká hustá je kresba a ako sa mení po celej dĺžke."),
            ("Realizácie s rovnakým dekorom", "Pozrite si dekor v skutočných kuchyniach – na doske, ostrovčeku aj na stene."),
            ("Celé platne v showroome", "V Bošanoch vám pripravíme platne vášho dekoru. Ak prinesiete vzorku frontu, porovnáte ich priamo vedľa seba."),
        ], top=8),
        figure(IMG + "vzorka-pri-dvierkach.jpg", "Vzorka sinterovaného kameňa priložená k dubovým dvierkam kuchynskej skrinky", caption="Vzorka pri dvierkach skrinky · dekor Appennino", top=24),
        cta("Pozrieť dekor vo veľkej ploche", SITE + "/produkt/taj-mahal", sub="Na stránke dekoru je fotka celej platne aj cena.", link=("Objednať ďalšiu vzorku", SITE + "/vzorky"), width=300),
        ps("Ak už viete, ktorý dekor to bude, pošlite pôdorys. Navrhneme rozloženie platní tak, aby žily išli tam, kde ich chcete mať, a pripravíme orientačné cenové rozpätie."),
        signature(top=0),
        footer(reason=REASON_VZORKA),
    ]))

# 11 – Vzorky 4/4: osobný e-mail od Mariána (čistý text)
write("11-automatizacia-vzorka-marian.html", plain(
    {
        "TYP:": "Automatizácia · Vzorky 4/4 (čistý text)",
        "SPÚŠŤAČ:": "14 dní po doručení vzorky; neposielať, ak klient medzitým poslal dopyt",
        "PREDMET:": "Pomôžem vám s výberom?",
        "PREHEADER:": "Stačí odpovedať na tento e-mail.",
        "CIEĽ:": "Odpoveď (reply) → osobná rada a dopyt",
    },
    "Pomôžem vám s výberom?",
    "Stačí odpovedať na tento e-mail.",
    [
        "pred dvoma týždňami vám prišla vzorka. Chcel som sa len opýtať, ako ste s výberom pokročili.",
        "Ak váhate, pomôžem. Odpovedzte na tento e-mail a napíšte mi tri veci: aký dekor zvažujete, aké budú fronty skriniek a aké svetlo máte v kuchyni. Ak máte fotku kuchyne alebo vizualizáciu, pošlite aj tú.",
        "Odpíšem vám, ktorý dekor bude podľa mňa vo veľkej ploche fungovať najlepšie. Ak budete chcieť, pripravím aj orientačné cenové rozpätie.",
    ],
    REASON_VZORKA,
))

# 12 – Dopyt → ponuka 2/4: Ako čítať cenovú ponuku
write("12-automatizacia-ponuka-ako-citat.html", doc(
    {
        "TYP:": "Automatizácia · Dopyt → ponuka 2/4",
        "SPÚŠŤAČ:": "1 deň po odoslaní cenovej ponuky; zastaviť pri objednávke alebo odpovedi klienta",
        "PREDMET:": "Ako čítať cenovú ponuku",
        "PREHEADER:": "Vysvetlíme, čo je v cene, čo porovnávať a na čo sa pýtať, keď máte na stole viac ponúk.",
        "CIEĽ:": "Znížiť neistotu pri porovnávaní ponúk → otázka alebo rozhodnutie",
    },
    "Ako čítať cenovú ponuku",
    "Vysvetlíme, čo je v cene, čo porovnávať a na čo sa pýtať, keď máte na stole viac ponúk.",
    [
        header("Vaša ponuka", "sprievodca"),
        eyebrow("Cenová ponuka", note="Krátky sprievodca k ponuke, ktorú ste od nás dostali."),
        headline("Cena za meter<br />" + accent_light("nepovie všetko.")),
        hero(IMG + "podorys-vzorka.jpg", "Ručne kreslený pôdorys kuchyne, vzorka sinterovaného kameňa a skladací meter", capsule="Pôdorys a vzorka", top=14),
        text([
            "včera sme vám poslali cenovú ponuku. Pri pracovnej doske nedáva zmysel čítať cenu izolovane: dve ponuky na tú istú kuchyňu sa môžu líšiť o stovky eur a lacnejšia môže byť nakoniec drahšia. Preto stručne, čo v ponuke hľadať.",
        ], top=24),
        section_title("01", "Čo je v cene", top=12),
        numbered([
            ("Materiál", "Dekor, počet platní a ich cena. Platne 3200 × 1600&nbsp;mm sa kupujú celé, preto rozhoduje aj to, ako dobre sa využijú."),
            ("Opracovanie", "Rezanie, výrezy pre drez, varnú dosku a batériu a profil hrany. Každý výrez má byť v ponuke zvlášť."),
            ("Doprava a montáž", "Výnos na miesto, osadenie a lepenie spojov. Montáž robia kamenári, s ktorými spolupracujeme."),
            ("DPH", "Pri porovnávaní si overte, či sú všetky ceny s DPH, alebo bez nej."),
        ], top=8),
        section_title("02", "Keď porovnávate s inou ponukou", top=28),
        split(("Porovnávajte", ["rozpis položiek, nielen súčet", "počet platní a ich využitie", "profil hrany a počet výrezov"]),
              ("Pýtajte sa", ["Čo ak pribudne výrez?", "Je v cene výnos na poschodie?", "Kto robí zameranie a montáž?"]), top=14),
        cta("Prečítať celého sprievodcu", SITE + "/blog/transparentne-ceny-cenova-ponuka", link=("Pozrieť cenník", SITE + "/cennik"), width=320),
        ps("Ak vám v ponuke čokoľvek nie je jasné, odpovedzte na tento e-mail alebo zavolajte. Prejdeme ju spolu položku po položke."),
        signature(top=0),
        footer(reason=REASON_PONUKA),
    ]))

# 13 – Dopyt → ponuka 3/4: Realizácia a pozvanie do showroomu
write("13-automatizacia-ponuka-showroom.html", doc(
    {
        "TYP:": "Automatizácia · Dopyt → ponuka 3/4",
        "SPÚŠŤAČ:": "5 dní po odoslaní cenovej ponuky; zastaviť pri objednávke alebo odpovedi klienta",
        "PREDMET:": "Pozrite si platne naživo",
        "PREHEADER:": "Ukážeme realizáciu s podobným riešením. V showroome v Bošanoch vám pripravíme celé platne.",
        "CIEĽ:": "Návšteva showroomu → rozhodnutie",
        "POZNÁMKA:": "Realizáciu ideálne podľa dekoru alebo aplikácie z ponuky. Fotku showroomu dodá Martin. P. S. sľubuje fotky celej platne – potvrdiť s Mariánom.",
    },
    "Pozrite si platne naživo",
    "Ukážeme realizáciu s podobným riešením. V showroome v Bošanoch vám pripravíme celé platne.",
    [
        header("Vaša ponuka", "showroom"),
        eyebrow("Pozvanie do showroomu", note="Celé platne vášho dekoru uvidíte v renesančnom kaštieli v Bošanoch."),
        headline("Rozhodnite sa<br />" + accent_light("pri celej platni.")),
        hero(IMG + "realizacia-u-kuchyna.jpg", "Kuchyňa v tvare U so svetlou pracovnou doskou zo sinterovaného kameňa", capsule="Realizácia", top=14),
        text([
            "ponuku máte u seba už pár dní. Ak ešte váhate, najviac pomôže vidieť dekor v skutočnej veľkosti. Malá vzorka ukáže farbu a povrch, celá platňa ukáže kresbu – a tá pri pracovnej doske rozhoduje.",
        ], top=24),
        section_title(None, "Čo vás v showroome čaká", top=12),
        numbered([
            ("Celé platne vášho dekoru", "Pripravíme platne 3200 × 1600&nbsp;mm, aby ste videli, kde budú žily a kde rezy."),
            ("Rozloženie na vašom pôdoryse", "Ukážeme, ako sa platne rozrežú na dosku, ostrovček alebo zástenu."),
            ("Čas na otázky", "Hrany, výrezy, údržba aj termíny. Bez ponáhľania."),
        ], top=8),
        cta("Dohodnúť návštevu showroomu", SITE + "/kontakt", sub="SNP 113/1, Bošany. Návšteva je bezplatná a nezáväzná.", link=("Pozrieť ďalšie realizácie", SITE + "/realizacie"), width=300),
        ps("Ak sa vám cesta do Bošian nehodí, odpovedzte na tento e-mail. Pošleme vám fotky celej platne vášho dekoru."),
        signature(top=0),
        footer(reason=REASON_PONUKA),
    ]))

# 14 – Dopyt → ponuka 4/4: osobný e-mail od Mariána (čistý text)
write("14-automatizacia-ponuka-marian.html", plain(
    {
        "TYP:": "Automatizácia · Dopyt → ponuka 4/4 (čistý text)",
        "SPÚŠŤAČ:": "14 dní po odoslaní cenovej ponuky; zastaviť pri objednávke alebo odpovedi klienta",
        "PREDMET:": "Je niečo, čo vám bráni rozhodnúť sa?",
        "PREHEADER:": "Nechcem na vás tlačiť, len sa pýtam.",
        "CIEĽ:": "Zistiť námietku a ponúknuť riešenie. Bez zľavy.",
    },
    "Je niečo, čo vám bráni rozhodnúť sa?",
    "Nechcem na vás tlačiť, len sa pýtam.",
    [
        "pred dvoma týždňami sme vám poslali cenovú ponuku a chcel som sa ozvať osobne.",
        "Pri pracovnej doske je úplne bežné, že rozhodnutie chvíľu trvá. Ak vám však niečo bráni rozhodnúť sa (cena, dekor, termín alebo čokoľvek iné), napíšte mi. Často sa to dá vyriešiť jednoduchšie, než sa zdá: iným rozložením platní, iným dekorom alebo návštevou showroomu, kde si všetko pozriete naživo.",
        "Stačí odpovedať na tento e-mail, pokojne aj jednou vetou.",
    ],
    REASON_PONUKA,
))

# 15 – Opustený košík 1/2
write("15-automatizacia-kosik-vzorka.html", doc(
    {
        "TYP:": "Automatizácia · Opustený košík 1/2",
        "SPÚŠŤAČ:": "1 hodinu po začatí objednávky bez dokončenia (Klaviyo: Checkout Started)",
        "PREDMET:": "Vaša vzorka zostala v košíku",
        "PREHEADER:": "Objednávku dokončíte jedným kliknutím. Prvá vzorka je zadarmo, platíte iba dopravu.",
        "CIEĽ:": "Dokončiť objednávku vzorky. Bez zľavy.",
        "POZNÁMKA:": "Posielať len kontaktom so súhlasom s e-mailovým marketingom. Odkaz tlačidla v Klaviyo: adresa košíka z udalosti; obrázok môže byť dynamický podľa vzorky.",
    },
    "Vaša vzorka zostala v košíku",
    "Objednávku dokončíte jedným kliknutím. Prvá vzorka je zadarmo, platíte iba dopravu.",
    [
        header("Vaša vzorka", "košík"),
        headline("Vzorka čaká<br />" + accent_light("v košíku."), top=30),
        hero(IMG + "vzorky-tri.jpg", "Tri vzorky sinterovaného kameňa vedľa seba: Calacatta Top, Astrana Grey a Gothic Gold", top=14),
        text([
            "objednávka vzorky ostala nedokončená. Ak vás niečo vyrušilo, košík sme vám uložili – stačí jedno kliknutie.",
        ], top=24),
        facts([("Rozmer", "10 × 10 cm"), ("Hrúbka", "12 mm"), ("Prvá vzorka", "zadarmo"), ("Doprava", "2,50 €")], top=8),
        cta("Dokončiť objednávku", SITE + "/vzorky", width=260),
        signature(top=28),
        footer(reason=REASON_KOSIK),
    ]))

# 16 – Opustený košík 2/2: Marián (čistý text)
write("16-automatizacia-kosik-marian.html", plain(
    {
        "TYP:": "Automatizácia · Opustený košík 2/2 (čistý text)",
        "SPÚŠŤAČ:": "24 hodín po začatí objednávky bez dokončenia",
        "PREDMET:": "Váhate medzi dekormi?",
        "PREHEADER:": "Pošlite fotku kuchyne, poradíme.",
        "CIEĽ:": "Odpoveď s fotkou kuchyne → osobná rada → objednávka vzoriek",
        "POZNÁMKA:": "Odkaz „tu“ v Klaviyo nahradiť adresou košíka z udalosti.",
    },
    "Váhate medzi dekormi?",
    "Pošlite fotku kuchyne, poradíme.",
    [
        "včera ste si v e-shope vyberali vzorku, ale objednávka ostala nedokončená. Ak je dôvodom to, že neviete, ktorý dekor zvoliť, pomôžem vám.",
        "V odpovedi mi pošlite fotku kuchyne alebo vizualizáciu a napíšte, aké budú skrinky a podlaha. Odporučím vám dva až tri dekory, ktoré má zmysel objednať ako vzorky.",
        'Ak ste si už vybrali, objednávku dokončíte <a href="' + SITE + '/vzorky" style="color:#1A1A1A; text-decoration:underline;">tu</a>.',
    ],
    REASON_KOSIK,
))

# 17 – Po realizácii 2/4: Starostlivosť
write("17-automatizacia-starostlivost.html", doc(
    {
        "TYP:": "Automatizácia · Po realizácii 2/4",
        "SPÚŠŤAČ:": "7 dní po dátume montáže",
        "PREDMET:": "Starostlivosť o dosku v skratke",
        "PREHEADER:": "Doske stačí utierka a saponát. Pozor si dajte len na štyri veci.",
        "CIEĽ:": "Splniť sľub z e-mailu 08, predísť poškodeniu a reklamáciám",
    },
    "Starostlivosť o dosku v skratke",
    "Doske stačí utierka a saponát. Pozor si dajte len na štyri veci.",
    [
        header("Vaša kuchyňa", "týždeň po montáži"),
        eyebrow("Starostlivosť", note="Ako sme sľúbili v deň montáže: krátky návod, ako dosku čistiť a čomu sa vyhnúť."),
        headline("Utierka a saponát.<br />" + accent_light("Viac netreba.")),
        hero(IMG + "starostlivost-utierka.jpg", "Ruka utiera pracovnú dosku zo sinterovaného kameňa utierkou z mikrovlákna", capsule="Denné čistenie", top=14),
        text([
            "doska je u vás týždeň. Dobrá správa: sinterovaný kameň má nasiakavosť pod 0,1&nbsp;%, takže škvrny ostávajú na povrchu a nevpíjajú sa do neho. Impregnáciu nepotrebuje – ani teraz, ani o pár rokov.",
        ], top=24),
        section_title("01", "Denná rutina", top=12),
        numbered([
            ("Teplá voda a kvapka saponátu", "Stačí bežný prostriedok na riad a mäkká utierka z mikrovlákna."),
            ("Utrite dosucha", "Zabránite mapám z tvrdej vody, najmä na tmavých dekoroch."),
            ("Čerstvú škvrnu hneď zotrite", "Káva, víno či kurkuma sa do povrchu nevpijú. Zaschnuté zvyšky odstráni neabrazívny čistič."),
        ], top=8),
        pair((IMG + "kvapky-na-doske.jpg", "Kvapky vody na čiernej lesklej doske zo sinterovaného kameňa"),
             (IMG + "horuca-panvica.jpg", "Liatinová panvica položená na tmavej pracovnej doske"),
             caption="Tekutiny sa nevpíjajú · teplo nad 300 °C doske neublíži"),
        section_title("02", "Čomu sa vyhnúť", top=28),
        numbered([
            ("Drôtenky a brúsne hubky", "Kameň nepoškriabu, ale môžu zmatniť lesklý povrch a zanechať kovové stopy."),
            ("Prostriedky s kyselinou fluorovodíkovou", "Sú to jediné bežne dostupné prostriedky, ktoré povrch poškodia. Patria k nim niektoré odstraňovače hrdze – čítajte etikety."),
            ("Údery do hrany", "Hrana a rohy sú najcitlivejšie miesta. Ťažký hrniec na dosku položte, nespúšťajte ho na hranu."),
            ("Krájanie priamo na doske", "Povrchu neublíži, ale nože sa rýchlo otupia. Krájajte na doštičke."),
        ], top=8),
        cta("Celý návod na čistenie", SITE + "/blog/ako-cistit-sinterovany-kamen", sub="Postupy na konkrétne škvrny: káva, mastnota, vodný kameň aj fixka.", width=260),
        ps("Odložte si tento e-mail. A ak by sa na doske čokoľvek objavilo, odpovedzte naň – vyriešime to s kamenárom."),
        signature(top=0),
        footer(reason=REASON_ZAKAZNIK),
    ]))

# 18 – Kampaň: Zo zákulisia – Ako vzniká sinterovaný kameň (november)
write("18-kampan-zo-zakulisia.html", doc(
    {
        "TYP:": "Kampaň · séria Zo zákulisia (1× za štvrťrok)",
        "SEGMENT:": "Všetci odberatelia",
        "PREDMET:": "Ako vzniká sinterovaný kameň",
        "PREHEADER:": "Minerály sa lisujú a potom spekajú pri teplote nad 1 200 °C. Preto doska nepotrebuje impregnáciu.",
        "CIEĽ:": "Dôvera cez vysvetlenie materiálu → vzorka",
        "POZNÁMKA:": "Fotky výroby sú ilustračné (tie isté ako na stránke Sinterovaný kameň). Ak budú skutočné zábery od výrobcu alebo kamenára, nahradiť.",
    },
    "Ako vzniká sinterovaný kameň",
    "Minerály sa lisujú a potom spekajú pri teplote nad 1 200 °C. Preto doska nepotrebuje impregnáciu.",
    [
        header("Zo zákulisia", "november 2026"),
        eyebrow("Zo zákulisia", note="Raz za štvrťrok: odkiaľ kameň pochádza a kto s ním pracuje."),
        headline("Z minerálov<br />" + accent_light("za pár hodín.")),
        text([
            "prírodný kameň sa tvorí milióny rokov. Sinterovaný kameň vzniká podobne, z minerálov, tlaku a teploty. Celý proces však trvá len pár hodín. Takto prebieha.",
        ], top=20),
        case_card(IMG + "proces-mineraly.jpg", "Prírodné minerály: kremeň, živec, íl a kovové oxidy",
                  "01 · Suroviny", "Prírodné minerály",
                  "Kremeň, živec, íl a kovové oxidy. Žiadne živice ani syntetické spojivá.", top=20),
        case_card(IMG + "proces-lisovanie.jpg", "Lis, ktorý stlačí minerálnu zmes do veľkoformátovej platne",
                  "02 · Lisovanie", "Tlak 10&nbsp;000 až 25&nbsp;000 ton",
                  "Minerálna zmes sa zlisuje do veľkoformátovej platne."),
        case_card(IMG + "proces-spekanie.jpg", "Pec, v ktorej sa platne spekajú pri teplote nad 1 200 °C",
                  "03 · Spekanie", "Viac než 1&nbsp;200&nbsp;°C",
                  "Častice sa spoja a vznikne celistvý povrch bez pórov."),
        note("Ilustračné zábery výroby."),
        section_title(None, "Čo to znamená pre vašu kuchyňu", top=28),
        facts([("Nasiakavosť", "< 0,1 %"), ("Tepelná odolnosť", "> 300 °C"), ("Tvrdosť", "6–8 Mohs"), ("Zloženie", "100 % minerály")], top=12),
        quote_dark("Prečo na tom záleží", 'Bez živíc a bez pórov nemá škvrna kam vniknúť a teplo nemá čo roztaviť. Preto doska <strong style="font-weight:700; font-style:normal; color:#ECD488;">nepotrebuje impregnáciu</strong> a horúci hrniec jej neublíži.', top=24),
        cta("Objednať vzorku", SITE + "/vzorky", sub="Prvá vzorka je zadarmo, platíte iba dopravu 2,50 €.", link=("Viac o sinterovanom kameni", SITE + "/sinterovany-kamen"), width=260),
        ps("Nabudúce v tejto sérii: ako kamenár premení platňu na hotovú dosku – od zamerania po montáž."),
        signature(top=0),
        footer(),
    ]))

# 19 – Kampaň: Sprievodca – Čo je v cene pracovnej dosky (november)
write("19-kampan-sprievodca-cena.html", doc(
    {
        "TYP:": "Kampaň · séria Sprievodca",
        "SEGMENT:": "Všetci odberatelia; mimo kontaktov v automatizácii Dopyt → ponuka",
        "PREDMET:": "Čo je v cene pracovnej dosky",
        "PREHEADER:": "Cenu tvorí materiál, opracovanie, doprava a montáž. Ukážeme, ako porovnať dve ponuky.",
        "CIEĽ:": "Transparentná cena → cenník, pôdorys",
        "POZNÁMKA:": "Trhový rozsah 400–600 €/bm je z článku Transparentné ceny (data/pricing.ts). Pri zmene ho aktualizovať.",
    },
    "Čo je v cene pracovnej dosky",
    "Cenu tvorí materiál, opracovanie, doprava a montáž. Ukážeme, ako porovnať dve ponuky.",
    [
        header("Sprievodca", "november 2026"),
        eyebrow("Sprievodca", note="Raz za čas jedna odborná téma: hrúbka, hrany, údržba alebo cena."),
        headline("Čo je v cene<br />" + accent_light("pracovnej dosky.")),
        hero(IMG + "posuvne-meradlo.jpg", "Posuvné meradlo meria hrúbku vzorky sinterovaného kameňa", capsule="Hrúbka 12 mm", top=14),
        text([
            "pri pracovnej doske sa najčastejšie pýtate na cenu. Odpoveď „od … do …“ veľa nepovie, preto skúsime inak: z čoho sa cena skladá a ako porovnať dve ponuky.",
            "Hotová doska zo sinterovaného kameňa vychádza na trhu orientačne na 400–600&nbsp;€ za bežný meter vrátane výroby a montáže. O tom, či bude cena pri spodnej alebo hornej hranici, rozhodujú tieto tri položky.",
        ], top=24),
        numbered([
            ("Materiál", "Platne 3200 × 1600&nbsp;mm sa kupujú celé. Ceny všetkých dekorov nájdete v cenníku na webe."),
            ("Opracovanie", "Rezanie, výrezy pre drez, varnú dosku a batériu, profil hrany a leštenie."),
            ("Doprava a montáž", "Výnos na miesto, osadenie a lepenie spojov."),
        ], top=4),
        quote_dark("Prečo sa ponuky líšia", 'Ponuka s jedným číslom môže vyzerať lacnejšie, kým sa pri montáži nedoúčtujú výrezy alebo výnos. Pýtajte si <strong style="font-weight:700; font-style:normal; color:#ECD488;">rozpis položiek</strong> – len tak dve ponuky porovnáte.', top=24),
        cta("Prečítať celého sprievodcu", SITE + "/blog/transparentne-ceny-cenova-ponuka", link=("Pozrieť cenník", SITE + "/cennik"), width=320),
        ps("Chcete vedieť, koľko platní by potrebovala vaša kuchyňa? Pošlite pôdorys – pripravíme orientačné cenové rozpätie aj návrh rozloženia."),
        signature(top=0),
        footer(),
    ]))

# 20 – Kampaň: Realizácia mesiaca – december
write("20-kampan-realizacia-december.html", doc(
    {
        "TYP:": "Kampaň · séria Realizácia mesiaca (1× mesačne)",
        "SEGMENT:": "Všetci odberatelia; mimo zákazníkov po realizácii",
        "PREDMET:": "Biela doska a tmavé drevo",
        "PREHEADER:": "V realizácii mesiaca ukážeme ostrovček, kde kontrast drží celý priestor pokope.",
        "CIEĽ:": "Dôkaz z reálnej kuchyne → vzorka dekoru alebo pôdorys",
        "POZNÁMKA:": "Realizáciu (návrh: biely ostrovček s orechom) a dekor potvrdí Martin. Fakty a citát doplní Marián; potrebný súhlas klienta.",
    },
    "Biela doska a tmavé drevo",
    "V realizácii mesiaca ukážeme ostrovček, kde kontrast drží celý priestor pokope.",
    [
        header("Realizácia mesiaca", "december 2026"),
        eyebrow("Realizácia mesiaca", note="Raz mesačne jedna skutočná kuchyňa: zadanie, dekor a výsledok."),
        headline("Biela doska<br />" + accent_light("a tmavé drevo.")),
        hero(IMG + "realizacia-statuario.jpg", "Biely ostrovček zo sinterovaného kameňa s orechovými bokmi", capsule="[Dekor]", top=14),
        facts([("Dekor", "[doplniť]"), ("Aplikácia", "ostrovček a zástena"), ("Lokalita", "[doplniť]"), ("Montáž", "[partner kamenár]")]),
        text([
            "v decembri ukazujeme kuchyňu, kde sa stretáva biela doska s výraznou kresbou a tmavé orechové drevo. Kontrast drží celý priestor pokope.",
        ], top=24),
        numbered([
            ("Zadanie", "[1–2 vety: čo klient riešil – priestor, štýl, čo nechcel.]"),
            ("Prečo tento dekor", "Biely základ s jemnými sivými žilami vyvažuje tmavé drevo ostrovčeka aj skriniek. Kresba je výrazná, no na veľkej ploche nepôsobí nepokojne."),
            ("Výsledok", "[1–2 vety: ako sa s doskou žije po pár mesiacoch používania.]"),
        ], top=4),
        pair((IMG + "realizacia-statuario-1.jpg", "Ostrovček s varnou doskou a orechovými bokmi"),
             (IMG + "realizacia-statuario-2.jpg", "Biela doska ostrovčeka a zástena za linkou"),
             caption="Ostrovček a zástena v jednom dekore"),
        quote_dark("Slovami klienta", "„[Citát klienta – jedna konkrétna veta o tom, ako sa s doskou žije.]“", attribution="[Meno, mesto]", top=20),
        cta("Objednať vzorku", SITE + "/vzorky", sub="Prvá vzorka je zadarmo, platíte iba dopravu 2,50 €.", link=("Pozrieť ďalšie realizácie", SITE + "/realizacie"), width=260),
        ps('Zvažujete podobný ostrovček? Pošlite pôdorys s rozmermi – <strong style="font-weight:700; color:#1A1A1A;">pripravíme orientačné cenové rozpätie</strong> presne pre váš rozmer.'),
        signature(top=0),
        footer(),
    ]))

# 21 – Kampaň: December – poďakovanie a otváracie hodiny
write("21-kampan-december-podakovanie.html", doc(
    {
        "TYP:": "Kampaň · Sezónne (december)",
        "SEGMENT:": "Všetci odberatelia a zákazníci",
        "PREDMET:": "Ďakujeme za rok 2026",
        "PREHEADER:": "Posielame otváracie hodiny cez sviatky a jednu radu, ak plánujete kuchyňu na jar.",
        "CIEĽ:": "Vzťah a informácia. Bez zľavy.",
        "POZNÁMKA:": "Otváracie hodiny a termín odoslania vzoriek doplní Martin.",
    },
    "Ďakujeme za rok 2026",
    "Posielame otváracie hodiny cez sviatky a jednu radu, ak plánujete kuchyňu na jar.",
    [
        header("Sezónne", "december 2026"),
        dark_band("Ďakujeme",
                  "Ďakujeme<br />" + accent_dark("za rok 2026."),
                  sub="Za otázky, vzorky aj fotky hotových kuchýň. Pekné sviatky z Bošian.",
                  image=(IMG + "december-doska.jpg", "Zimný aranžmán na pracovnej doske zo sinterovaného kameňa: jedľové vetvičky, sviečky a mandarínky")),
        text([
            "ďakujeme, že ste s nami tento rok premýšľali nad kuchyňou, vzorkami a dekormi. Každá otázka a každá fotka hotovej kuchyne nám pomáha robiť veci lepšie.",
        ], top=28),
        section_title(None, "Otváracie hodiny cez sviatky", top=12),
        numbered([
            ("Showroom v Bošanoch", "[doplniť: dni a hodiny počas sviatkov]"),
            ("E-shop a vzorky", "Objednávky prijímame aj cez sviatky. Vzorky odošleme od [doplniť dátum]."),
        ], top=8),
        quote_dark("Rada na január", "Ak plánujete novú kuchyňu na jar, január je dobrý čas začať: objednať si vzorky, poslať pôdorys a v pokoji si vybrať dekor.", top=24),
        cta("Pozrieť realizácie", SITE + "/realizacie", width=240),
        ps("Ak máte novú kuchyňu a doska je cez sviatky v plnom nasadení, pošlite nám fotku. Potešíme sa."),
        signature(top=0),
        footer(),
    ]))

print("hotovo →", OUT)
