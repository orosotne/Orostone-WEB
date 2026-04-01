/**
 * generate-article-03-nano-banana.mjs
 * ----------------------------------
 * Generates two local images for ARTICLE_03 using "Nano Banana" model
 * available in this account: `gemini-3.1-flash-image-preview`.
 *
 * Output (public/images/blog):
 *  - article-03-stains.webp
 *  - article-03-cleaning.webp
 *
 * Notes:
 *  - No text/logos/watermarks are requested in prompt.
 *  - Image bytes are returned via inlineData (jpeg) from generateContent.
 *
 * Usage:
 *  node scripts/generate-article-03-nano-banana.mjs
 */
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

dotenv.config({ path: path.join(ROOT, '.env') });

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY || API_KEY === 'PLACEHOLDER_API_KEY') {
  console.error('❌  GEMINI_API_KEY is not set or is still a placeholder.');
  process.exit(1);
}

const MODEL = 'gemini-3.1-flash-image-preview';
const OUT_DIR = path.join(ROOT, 'public', 'images', 'blog');
const W = 1600;
const H = 1000; // 16:10

function pickInlineImageData(res) {
  const parts = res?.candidates?.[0]?.content?.parts ?? [];
  const imgPart = parts.find((p) => p?.inlineData?.data && p?.inlineData?.mimeType?.startsWith('image/'));
  return imgPart?.inlineData ?? null;
}

async function generateImageToWebp({ prompt, outWebp }) {
  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const res = await ai.models.generateContent({
    model: MODEL,
    contents: [
      {
        role: 'user',
        parts: [{ text: prompt }],
      },
    ],
  });

  const inline = pickInlineImageData(res);
  if (!inline) {
    console.error('❌  No inline image returned. Response keys:', Object.keys(res ?? {}));
    console.error(JSON.stringify(res, null, 2).slice(0, 2000));
    process.exit(1);
  }

  const buffer = Buffer.from(inline.data, 'base64');
  const tmp = path.join(OUT_DIR, outWebp.replace(/\.webp$/, '.__tmp.jpg'));
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(tmp, buffer);

  await sharp(tmp)
    .resize(W, H, { fit: 'cover', position: 'centre' })
    .webp({ quality: 88 })
    .toFile(path.join(OUT_DIR, outWebp));

  fs.unlinkSync(tmp);
  const stats = fs.statSync(path.join(OUT_DIR, outWebp));
  console.log(`✅  Saved: ${path.join(OUT_DIR, outWebp)} (${Math.round(stats.size / 1024)} KB)`);
}

async function main() {
  const stainsPrompt =
    'Photorealistic premium editorial kitchen countertop photo, close-up, no text. ' +
    'A light warm-white sintered stone / porcelain stone countertop surface with subtle beige veining. ' +
    'Show DRIED stains after long exposure BEFORE cleaning: (1) a dark coffee cup ring, (2) a deep red wine spill with a slightly dried edge, ' +
    '(3) a vivid yellow turmeric + oil smear. ' +
    'Soft natural window daylight, minimal neutral background, sharp realistic texture. ' +
    'Negative constraints: no text, no logos, no brands, no watermark, no labels, no arrows, no circles, no split-screen, no people.';

  const cleaningPrompt =
    'Photorealistic premium editorial kitchen photo of a modern kitchen island. ' +
    'The worktop must be a REALISTIC slim 12 mm sintered stone / porcelain stone slab: visible edge looks truly thin and technically correct (12mm). ' +
    'A female hand wipes a small red wine stain with a damp white microfiber cloth; show the stain disappearing (subtle before/after in one frame). ' +
    'Soft natural daylight, minimal European styling, shallow depth of field, realistic stone texture. ' +
    'Negative constraints: no text, no logos, no watermark, no labels, no arrows, no circles, no split-screen, no thick countertop, no CGI look, no overprocessed colors.';

  await generateImageToWebp({ prompt: stainsPrompt, outWebp: 'article-03-stains.webp' });
  await generateImageToWebp({ prompt: cleaningPrompt, outWebp: 'article-03-cleaning.webp' });
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});

