/**
 * generate-sample-image.mjs
 * -------------------------
 * Generates candidate images for the "free samples" lead section using
 * Google Imagen 3. Produces 4 PNG variants; after choosing the best one,
 * run with --convert=N to create an optimised WebP and clean up PNGs.
 *
 * Prerequisites:
 *   1. Set GEMINI_API_KEY in your .env
 *
 * Usage:
 *   node scripts/generate-sample-image.mjs            # generate 4 PNGs
 *   node scripts/generate-sample-image.mjs --convert=2 # pick #2 → WebP
 */

import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

dotenv.config({ path: path.join(ROOT, '.env') });

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY || API_KEY === 'PLACEHOLDER_API_KEY') {
  console.error('❌  GEMINI_API_KEY is not set or is still a placeholder.');
  process.exit(1);
}

const OUTPUT_DIR = path.join(ROOT, 'public', 'images');
const BASENAME = 'sample-lead';

const PROMPT =
  'Professional product photography of premium sintered stone material samples arranged ' +
  'on a clean white marble surface. Two small square stone sample tiles (100mm × 100mm × 12mm) ' +
  'in warm creamy white with subtle beige veining (similar to natural travertine or warm marble). ' +
  'One sample is slightly tilted against the other to show the 12mm thickness and edge profile. ' +
  'Next to them sits an elegant matte black gift box with minimal gold foil "OROSTONE" branding, ' +
  'lid partially open with black tissue paper peeking out. A small kraft card reading "Your free sample" ' +
  'leans against the box. Soft diffused studio lighting, shallow depth of field, luxurious premium feel, ' +
  'clean composition, no people, shot from a slightly elevated 45-degree angle. ' +
  'Photorealistic, high resolution, editorial product photography style.';

// ---------------------------------------------------------------------------
// --convert=N  mode: pick winner, convert to WebP, delete PNGs
// ---------------------------------------------------------------------------
const convertArg = process.argv.find((a) => a.startsWith('--convert='));
if (convertArg) {
  const pick = parseInt(convertArg.split('=')[1], 10);
  if (isNaN(pick) || pick < 1 || pick > 4) {
    console.error('Usage: --convert=N where N is 1-4');
    process.exit(1);
  }

  const sharp = (await import('sharp')).default;
  const src = path.join(OUTPUT_DIR, `${BASENAME}-${pick}.png`);
  const dest = path.join(OUTPUT_DIR, `${BASENAME}.webp`);

  if (!fs.existsSync(src)) {
    console.error(`❌  Source not found: ${src}`);
    process.exit(1);
  }

  console.log(`🔄  Converting ${BASENAME}-${pick}.png → ${BASENAME}.webp (quality 85)...`);
  await sharp(src).webp({ quality: 85 }).toFile(dest);

  const stats = fs.statSync(dest);
  console.log(`✅  Saved: ${dest} (${(stats.size / 1024).toFixed(0)} KB)`);

  for (let i = 1; i <= 4; i++) {
    const f = path.join(OUTPUT_DIR, `${BASENAME}-${i}.png`);
    if (fs.existsSync(f)) {
      fs.unlinkSync(f);
      console.log(`🗑   Deleted ${BASENAME}-${i}.png`);
    }
  }

  console.log('Done!');
  process.exit(0);
}

// ---------------------------------------------------------------------------
// Generate mode (default)
// ---------------------------------------------------------------------------
async function main() {
  const ai = new GoogleGenAI({ apiKey: API_KEY });

  console.log('');
  console.log('='.repeat(60));
  console.log('  Imagen 3 — Sample Lead Image Generator');
  console.log('='.repeat(60));
  console.log('');
  console.log(`📝  Prompt: "${PROMPT}"`);
  console.log('');
  console.log('🎨  Generating 4 candidate images...');

  const response = await ai.models.generateImages({
    model: 'imagen-4.0-generate-001',
    prompt: PROMPT,
    config: {
      numberOfImages: 4,
      aspectRatio: '3:4',
    },
  });

  const images = response.generatedImages;
  if (!images || images.length === 0) {
    console.error('❌  No images returned.');
    process.exit(1);
  }

  console.log(`✅  Received ${images.length} images. Saving...`);

  for (let i = 0; i < images.length; i++) {
    const outPath = path.join(OUTPUT_DIR, `${BASENAME}-${i + 1}.png`);
    const imageBytes = images[i].image.imageBytes;
    const buffer = Buffer.from(imageBytes, 'base64');
    fs.writeFileSync(outPath, buffer);
    const sizeMB = (buffer.length / 1024 / 1024).toFixed(1);
    console.log(`   💾  ${BASENAME}-${i + 1}.png (${sizeMB} MB)`);
  }

  console.log('');
  console.log('='.repeat(60));
  console.log('  Done! Review images in public/images/');
  console.log('  Then run:  node scripts/generate-sample-image.mjs --convert=N');
  console.log('  (where N is the image number you want to keep)');
  console.log('='.repeat(60));
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
