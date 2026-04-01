/**
 * generate-blog-stain-cleaning-image.mjs
 * -------------------------------------
 * Generates a local blog image for ARTICLE_03 (cleaning demo) using Google Imagen.
 *
 * Prerequisites:
 *   - GEMINI_API_KEY in .env
 *
 * Usage:
 *   node scripts/generate-blog-stain-cleaning-image.mjs
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
 
const OUTPUT_DIR = path.join(ROOT, 'public', 'images', 'blog');
const OUT_WEBP = path.join(OUTPUT_DIR, 'stain-test-cleaning-damp-cloth-v2.webp');
 
const PRIMARY_MODEL = 'nano-banana-pro';
const FALLBACK_MODEL = 'imagen-4.0-generate-001';

const PROMPT =
  'Photorealistic, premium editorial kitchen photography showing how easy it is to clean sintered stone. ' +
  'Close-up of a light warm-white sintered stone countertop with subtle mineral texture. ' +
  'A deep red wine stain is being wiped with a damp white microfiber cloth; show clear before/after in one frame: ' +
  'one side visibly clean and dry, the other side with the wine stain mid-wipe. ' +
  'Add a few realistic water droplets on the cloth edge to communicate "damp". ' +
  'Soft natural window daylight, minimal neutral background, shallow depth of field. ' +
  'No text, no logos, no brands, no faces, no hands if possible (cloth only). ' +
  '16:10 composition, focus on the stain disappearing.';
 
async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
 
  const ai = new GoogleGenAI({ apiKey: API_KEY });
 
  console.log('');
  console.log('='.repeat(60));
  console.log('  Imagen — Blog Image Generator (Cleaning Demo)');
  console.log('='.repeat(60));
  console.log('');
  console.log(`📝  Prompt: "${PROMPT}"`);
  console.log('');
 
  const config = {
    numberOfImages: 1,
    aspectRatio: '4:3',
  };

  let response;
  try {
    response = await ai.models.generateImages({
      model: PRIMARY_MODEL,
      prompt: PROMPT,
      config,
    });
    console.log(`✅  Model used: ${PRIMARY_MODEL}`);
  } catch (err) {
    console.warn(`⚠️  Failed with model "${PRIMARY_MODEL}", falling back to "${FALLBACK_MODEL}".`);
    response = await ai.models.generateImages({
      model: FALLBACK_MODEL,
      prompt: PROMPT,
      config,
    });
    console.log(`✅  Model used: ${FALLBACK_MODEL}`);
  }
 
  const images = response.generatedImages;
  if (!images || images.length === 0) {
    console.error('❌  No images returned.');
    process.exit(1);
  }
 
  const imageBytes = images[0].image.imageBytes;
  const buffer = Buffer.from(imageBytes, 'base64');
 
  const tmp = path.join(
    OUTPUT_DIR,
    `.__tmp-${crypto.randomBytes(6).toString('hex')}.png`,
  );
  fs.writeFileSync(tmp, buffer);
 
  await sharp(tmp)
    .resize(1600, 1000, { fit: 'cover', position: 'centre' })
    .webp({ quality: 85 })
    .toFile(OUT_WEBP);
 
  fs.unlinkSync(tmp);
 
  const stats = fs.statSync(OUT_WEBP);
  console.log(`✅  Saved: ${OUT_WEBP} (${(stats.size / 1024).toFixed(0)} KB)`);
}
 
main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});

