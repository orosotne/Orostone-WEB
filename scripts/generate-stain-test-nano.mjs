/**
 * generate-stain-test-nano.mjs
 * ----------------------------
 * Generates a photorealistic stain-test image (coffee + red wine + turmeric)
 * using Google model `nano-banana-pro`.
 *
 * Output:
 *  - public/images/blog/stain-test-before-cleaning-nano.webp
 *
 * Prerequisites:
 *  - GEMINI_API_KEY in .env
 *
 * Usage:
 *  node scripts/generate-stain-test-nano.mjs
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

const MODEL = 'nano-banana-pro';

const OUT_DIR = path.join(ROOT, 'public', 'images', 'blog');
const OUT_WEBP = path.join(OUT_DIR, 'stain-test-before-cleaning-nano.webp');

const W = 1600;
const H = 1000; // 16:10

const PROMPT =
  'Photorealistic premium editorial kitchen countertop photo, close-up, no text. ' +
  'A light warm-white sintered stone / porcelain stone countertop surface with subtle beige veining. ' +
  'Show dried stains after long exposure BEFORE cleaning: (1) a dark coffee cup ring, (2) a deep red wine spill with a slightly dried edge, ' +
  '(3) a vivid yellow turmeric + oil smear. ' +
  'Soft natural daylight, minimal neutral background, sharp realistic texture, no people, no logos, no brands, no watermark.';

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const response = await ai.models.generateImages({
    model: MODEL,
    prompt: PROMPT,
    config: { numberOfImages: 1, aspectRatio: '4:3' },
  });

  const images = response.generatedImages;
  if (!images || images.length === 0) {
    console.error('❌  No images returned.');
    process.exit(1);
  }

  const buffer = Buffer.from(images[0].image.imageBytes, 'base64');
  const tmpPng = path.join(OUT_DIR, '.__tmp-stain-nano.png');
  fs.writeFileSync(tmpPng, buffer);

  await sharp(tmpPng)
    .resize(W, H, { fit: 'cover', position: 'centre' })
    .webp({ quality: 88 })
    .toFile(OUT_WEBP);

  fs.unlinkSync(tmpPng);

  const stats = fs.statSync(OUT_WEBP);
  console.log(`✅  Saved: ${OUT_WEBP} (${Math.round(stats.size / 1024)} KB)`);
}

main().catch((err) => {
  // Surface the exact API error to the terminal output.
  console.error('Fatal error:', err);
  process.exit(1);
});

