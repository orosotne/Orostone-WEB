/**
 * build-blog-stain-images-from-texture.mjs
 * ---------------------------------------
 * Creates blog images for ARTICLE_03 using a REAL stone texture image (no AI).
 *
 * Inputs:
 *   - Stone texture file in assets/ (PNG/JPG)
 *
 * Outputs (public/images/blog):
 *   - stain-test-before-cleaning-v3.webp
 *   - stain-test-cleaning-damp-cloth-v3.webp
 *
 * Usage:
 *   node scripts/build-blog-stain-images-from-texture.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const TEXTURE_SRC = path.join(
  ROOT,
  'public',
  'images',
  'blog',
  'taj-mahal-texture-source.png',
);

const OUT_DIR = path.join(ROOT, 'public', 'images', 'blog');
const OUT_BEFORE = path.join(OUT_DIR, 'stain-test-before-cleaning-v4.webp');
const OUT_CLEAN = path.join(OUT_DIR, 'stain-test-cleaning-damp-cloth-v4.webp');

const W = 1600;
const H = 1000; // 16:10

function svgBuffer(svg) {
  return Buffer.from(svg);
}

function stainOverlayBefore() {
  // Coffee ring + wine puddle + turmeric smear. No text, no logos.
  // Use subtle blur + multiply blending at composite time.
  return svgBuffer(`
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <filter id="softShadow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="10" result="blur"/>
      <feOffset dx="0" dy="10" result="off"/>
      <feColorMatrix in="off" type="matrix"
        values="0 0 0 0 0
                0 0 0 0 0
                0 0 0 0 0
                0 0 0 0.18 0" result="shadow"/>
      <feMerge>
        <feMergeNode in="shadow"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <filter id="organicEdge" x="-25%" y="-25%" width="150%" height="150%">
      <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="3" seed="9" result="noise"/>
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="18" xChannelSelector="R" yChannelSelector="G"/>
    </filter>

    <filter id="liquidBlur" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="8"/>
    </filter>

    <radialGradient id="wineGrad" cx="50%" cy="45%" r="65%">
      <stop offset="0" stop-color="rgba(120,0,24,0.55)"/>
      <stop offset="0.65" stop-color="rgba(120,0,24,0.38)"/>
      <stop offset="1" stop-color="rgba(75,0,18,0.10)"/>
    </radialGradient>

    <linearGradient id="turmGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="rgba(214,146,10,0.42)"/>
      <stop offset="0.55" stop-color="rgba(214,146,10,0.30)"/>
      <stop offset="1" stop-color="rgba(255,255,255,0.10)"/>
    </linearGradient>

    <filter id="grain" x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="2" result="g"/>
      <feColorMatrix in="g" type="matrix"
        values="1 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0
                0 0 0 0.08 0" result="ga"/>
      <feBlend in="SourceGraphic" in2="ga" mode="multiply"/>
    </filter>
  </defs>

  <!-- Wine puddle -->
  <g filter="url(#softShadow)" opacity="0.92">
    <path filter="url(#organicEdge)"
          d="M880 560 C900 430 1060 390 1190 460 C1335 540 1290 710 1125 740 C965 768 840 690 880 560 Z"
          fill="url(#wineGrad)"/>
    <!-- specular highlight -->
    <path filter="url(#liquidBlur)"
          d="M980 520 C1040 470 1150 470 1210 525 C1120 545 1050 555 980 520 Z"
          fill="rgba(255,255,255,0.10)"/>
    <!-- darker dried rim -->
    <path filter="url(#organicEdge)"
          d="M900 585 C930 470 1070 440 1185 495 C1280 545 1260 675 1135 705 C1015 730 885 675 900 585 Z"
          fill="rgba(60,0,16,0.12)"/>
  </g>

  <!-- Coffee ring -->
  <g opacity="0.88" filter="url(#softShadow)">
    <circle cx="545" cy="520" r="118" fill="none" stroke="rgba(45,28,22,0.30)" stroke-width="22" filter="url(#organicEdge)"/>
    <circle cx="545" cy="520" r="86" fill="none" stroke="rgba(45,28,22,0.14)" stroke-width="14" filter="url(#organicEdge)"/>
    <ellipse cx="560" cy="545" rx="46" ry="34" fill="rgba(45,28,22,0.06)" filter="url(#liquidBlur)"/>
  </g>

  <!-- Turmeric + oil smear -->
  <g opacity="0.88" filter="url(#softShadow)">
    <path filter="url(#organicEdge)"
          d="M260 710 C340 650 430 630 520 650 C610 670 660 720 730 750
             C800 780 870 770 940 735 C980 715 1030 720 1080 750
             C1010 820 930 865 830 880
             C690 900 560 875 440 845
             C350 820 290 780 260 710 Z"
          fill="url(#turmGrad)"/>
    <!-- small granules -->
    <g filter="url(#grain)" opacity="0.9">
      <ellipse cx="420" cy="760" rx="140" ry="55" fill="rgba(214,146,10,0.14)"/>
      <ellipse cx="560" cy="790" rx="180" ry="70" fill="rgba(214,146,10,0.10)"/>
      <ellipse cx="690" cy="800" rx="160" ry="60" fill="rgba(214,146,10,0.08)"/>
    </g>
    <!-- oily sheen highlight -->
    <path filter="url(#liquidBlur)"
          d="M360 760 C520 710 690 740 820 800 C720 835 560 845 420 820 C390 815 370 795 360 760 Z"
          fill="rgba(255,255,255,0.10)"/>
  </g>
</svg>`);
}

function stainOverlayCleaning() {
  // Wine stain partly wiped + damp cloth shape (no hands, no people).
  return svgBuffer(`
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <filter id="blur4" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="4"/>
    </filter>
    <filter id="blur10" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="10"/>
    </filter>
    <filter id="clothShadow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="12" result="b"/>
      <feOffset dx="0" dy="14" result="o"/>
      <feColorMatrix in="o" type="matrix"
        values="0 0 0 0 0
                0 0 0 0 0
                0 0 0 0 0
                0 0 0 0.22 0" result="s"/>
      <feMerge>
        <feMergeNode in="s"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <filter id="fabric" x="-20%" y="-20%" width="140%" height="140%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" result="n"/>
      <feColorMatrix in="n" type="matrix"
        values="1 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0
                0 0 0 0.12 0" result="na"/>
      <feBlend in="SourceGraphic" in2="na" mode="multiply"/>
    </filter>
    <linearGradient id="clothGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="rgba(255,255,255,0.92)"/>
      <stop offset="1" stop-color="rgba(235,235,235,0.85)"/>
    </linearGradient>
    <linearGradient id="wipeGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="rgba(255,255,255,0.70)"/>
      <stop offset="0.55" stop-color="rgba(255,255,255,0.25)"/>
      <stop offset="1" stop-color="rgba(255,255,255,0.0)"/>
    </linearGradient>

    <filter id="organicEdge2" x="-25%" y="-25%" width="150%" height="150%">
      <feTurbulence type="fractalNoise" baseFrequency="0.014" numOctaves="3" seed="12" result="noise"/>
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="16" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
  </defs>

  <!-- Wine stain base -->
  <g filter="url(#blur10)" opacity="0.88">
    <path filter="url(#organicEdge2)"
          d="M780 565 C820 430 1030 410 1165 495 C1290 575 1250 720 1080 750 C920 778 740 705 780 565 Z"
          fill="rgba(120,0,24,0.42)"/>
    <ellipse cx="1035" cy="610" rx="140" ry="86" fill="rgba(120,0,24,0.26)"/>
  </g>

  <!-- Wiped clean area overlay -->
  <g filter="url(#blur4)">
    <path d="M690 520 C760 450 910 430 1040 460 C1140 482 1200 540 1230 610
             C1120 640 1010 650 900 640
             C810 630 740 600 690 520 Z"
          fill="url(#wipeGrad)" opacity="0.95"/>
  </g>

  <!-- Cloth -->
  <g filter="url(#clothShadow)">
    <path d="M360 720 C430 640 530 600 660 590
             C780 582 900 608 1030 640
             C1120 662 1210 700 1290 760
             C1220 845 1120 900 980 920
             C800 945 610 910 450 860
             C390 842 350 805 330 770
             C320 752 330 735 360 720 Z"
          fill="url(#clothGrad)" opacity="0.92"/>
    <!-- fabric grain -->
    <path d="M360 720 C430 640 530 600 660 590
             C780 582 900 608 1030 640
             C1120 662 1210 700 1290 760
             C1220 845 1120 900 980 920
             C800 945 610 910 450 860
             C390 842 350 805 330 770
             C320 752 330 735 360 720 Z"
          fill="rgba(255,255,255,0.85)" opacity="0.55" filter="url(#fabric)"/>
    <!-- cloth folds -->
    <path d="M460 820 C560 780 690 770 820 800 C920 823 1020 860 1120 900"
          fill="none" stroke="rgba(200,200,200,0.55)" stroke-width="6" filter="url(#blur4)"/>
    <path d="M520 700 C660 660 820 670 980 720"
          fill="none" stroke="rgba(205,205,205,0.45)" stroke-width="5" filter="url(#blur4)"/>
    <!-- damp edge highlight -->
    <path d="M520 760 C650 735 820 750 960 800"
          fill="none" stroke="rgba(180,210,230,0.35)" stroke-width="7" filter="url(#blur4)"/>
  </g>
</svg>`);
}

async function main() {
  if (!fs.existsSync(TEXTURE_SRC)) {
    console.error(`❌  Texture not found: ${TEXTURE_SRC}`);
    process.exit(1);
  }
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const base = sharp(TEXTURE_SRC).resize(W, H, { fit: 'cover', position: 'centre' });

  // BEFORE cleaning
  await base
    .clone()
    .composite([
      { input: stainOverlayBefore(), blend: 'multiply' },
      { input: stainOverlayBefore(), blend: 'overlay', opacity: 0.18 },
    ])
    .webp({ quality: 88 })
    .toFile(OUT_BEFORE);

  // CLEANING demo
  await base
    .clone()
    .composite([
      { input: stainOverlayCleaning(), blend: 'multiply' },
      { input: stainOverlayCleaning(), blend: 'overlay', opacity: 0.20 },
    ])
    .webp({ quality: 88 })
    .toFile(OUT_CLEAN);

  const s1 = fs.statSync(OUT_BEFORE);
  const s2 = fs.statSync(OUT_CLEAN);
  console.log(`✅  Saved: ${OUT_BEFORE} (${Math.round(s1.size / 1024)} KB)`);
  console.log(`✅  Saved: ${OUT_CLEAN} (${Math.round(s2.size / 1024)} KB)`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});

