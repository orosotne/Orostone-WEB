/**
 * generate-blog-stain-images-texture-transfer.mjs
 * ----------------------------------------------
 * Generates photorealistic blog images (via Google Imagen) and then
 * imprints a REAL stone design texture over them (texture transfer),
 * to avoid "cartoon overlays" while keeping your real stone pattern.
 *
 * Output (public/images/blog):
 *  - stain-test-before-cleaning-v5.webp
 *  - stain-test-cleaning-damp-cloth-v5.webp
 *
 * Prerequisites:
 *  - GEMINI_API_KEY in .env
 *  - Real stone texture at public/images/blog/taj-mahal-texture-source.png
 *
 * Usage:
 *  node scripts/generate-blog-stain-images-texture-transfer.mjs
 */
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

dotenv.config({ path: path.join(ROOT, '.env') });

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY || API_KEY === 'PLACEHOLDER_API_KEY') {
  console.error('❌  GEMINI_API_KEY is not set or is still a placeholder.');
  process.exit(1);
}

const OUT_DIR = path.join(ROOT, 'public', 'images', 'blog');
const TEXTURE_SRC = path.join(OUT_DIR, 'taj-mahal-texture-source.png');

const W = 1600;
const H = 1000; // 16:10

const MODEL = 'imagen-4.0-generate-001';

const PROMPT_BEFORE =
  'Photorealistic premium editorial kitchen countertop photo, close-up. ' +
  'A light warm-white sintered stone countertop surface with subtle beige veining. ' +
  'Show three realistic stains before cleaning: a dark coffee cup ring, a deep red wine spill with a slightly dried edge, ' +
  'and a vivid yellow turmeric + oil smear. ' +
  'Soft natural window daylight, minimal neutral background, shallow depth of field. ' +
  'No text, no logos, no brands, no people.';

const PROMPT_CLEAN =
  'Photorealistic premium editorial kitchen countertop photo demonstrating cleaning sintered stone. ' +
  'A light warm-white sintered stone countertop surface with subtle beige veining. ' +
  'A deep red wine stain is being wiped with a damp white microfiber cloth. ' +
  'Show clear before/after in one frame: an area already clean and dry next to the stain mid-wipe. ' +
  'Soft natural window daylight, minimal neutral background, shallow depth of field. ' +
  'No text, no logos, no brands, no people, no hands, no arms, no fingers, no skin.';

function tmpPng(name) {
  return path.join(OUT_DIR, `.__tmp-${name}-${crypto.randomBytes(6).toString('hex')}.png`);
}

async function generatePng(prompt, outTmpPath) {
  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const config = { numberOfImages: 1, aspectRatio: '4:3' };

  const maxAttempts = 4;
  let lastErr;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await ai.models.generateImages({
        model: MODEL,
        prompt,
        config,
      });

      const images = response.generatedImages;
      if (!images || images.length === 0) {
        throw new Error('No images returned');
      }

      const buffer = Buffer.from(images[0].image.imageBytes, 'base64');
      fs.writeFileSync(outTmpPath, buffer);
      return;
    } catch (err) {
      lastErr = err;
      const status = err?.status;
      // Transient Imagen infra hiccups happen; backoff a bit and retry.
      const retryable = status === 429 || status === 500 || status === 502 || status === 503 || status === 504;
      if (!retryable || attempt === maxAttempts) break;
      const waitMs = 1200 * attempt * attempt;
      await new Promise((r) => setTimeout(r, waitMs));
    }
  }
  throw lastErr ?? new Error('Image generation failed');
}

async function textureTransfer(inputPng, outWebp) {
  const texture = await sharp(TEXTURE_SRC).resize(W, H, { fit: 'cover', position: 'centre' }).png().toBuffer();

  // Resize/crop source to target ratio first
  const base = sharp(inputPng).resize(W, H, { fit: 'cover', position: 'centre' });

  // Imprint real texture while keeping lighting/stains from generated photo.
  // overlay = adds veining; multiply = subtly blends texture into shadows.
  let pipeline = base
    .composite([
      { input: texture, blend: 'overlay', opacity: 0.38 },
      { input: texture, blend: 'multiply', opacity: 0.14 },
    ])
    .modulate({ saturation: 0.88 })
    .webp({ quality: 88 });

  // Imagen keeps sneaking in hands/arms for the cleaning scene.
  // Patch the top-right area back to pure stone texture to guarantee "no people".
  if (outWebp.includes('cleaning')) {
    const maskSvg = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <filter id="mblur" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="18"/>
    </filter>
  </defs>
  <!-- feathered mask region over typical hand/arm placement -->
  <rect x="980" y="0" width="620" height="520" fill="white" filter="url(#mblur)"/>
</svg>`);

    const texRegion = await sharp(texture)
      .composite([{ input: maskSvg, blend: 'dest-in' }])
      .png()
      .toBuffer();

    pipeline = sharp(await pipeline.toBuffer()).composite([
      { input: texRegion, blend: 'over', opacity: 1.0 },
    ]).webp({ quality: 88 });
  }

  await pipeline.toFile(outWebp);
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  if (!fs.existsSync(TEXTURE_SRC)) {
    console.error(`❌  Texture missing: ${TEXTURE_SRC}`);
    process.exit(1);
  }

  const tmpBefore = tmpPng('before');
  const tmpClean = tmpPng('clean');

  const outBefore = path.join(OUT_DIR, 'stain-test-before-cleaning-v5.webp');
  const outClean = path.join(OUT_DIR, 'stain-test-cleaning-damp-cloth-v5.webp');

  const onlyArg = process.argv.find((a) => a.startsWith('--only='));
  const only = onlyArg ? onlyArg.split('=')[1] : 'all'; // all | before | clean

  console.log('🎨  Generating base photos via Imagen...');
  if (only === 'all' || only === 'before') await generatePng(PROMPT_BEFORE, tmpBefore);
  if (only === 'all' || only === 'clean') await generatePng(PROMPT_CLEAN, tmpClean);

  console.log('🪨  Applying real stone texture transfer...');
  if (only === 'all' || only === 'before') await textureTransfer(tmpBefore, outBefore);
  if (only === 'all' || only === 'clean') await textureTransfer(tmpClean, outClean);

  if (fs.existsSync(tmpBefore)) fs.unlinkSync(tmpBefore);
  if (fs.existsSync(tmpClean)) fs.unlinkSync(tmpClean);

  console.log(`✅  Saved: ${outBefore}`);
  console.log(`✅  Saved: ${outClean}`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});

