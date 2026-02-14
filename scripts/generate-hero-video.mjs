/**
 * generate-hero-video.mjs
 * -----------------------
 * Generates an epic 8-second hero video of a dark stone shattering
 * into fragments using Google Veo 3.1 API.
 *
 * Uses the reference image (intact stone on black background) as the
 * starting frame, then animates it exploding outward.
 *
 * Prerequisites:
 *   1. Set GEMINI_API_KEY in your .env (must have Veo access)
 *   2. Reference image at public/images/hero-stone-ref.png
 *
 * Usage:
 *   node scripts/generate-hero-video.mjs
 */

import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// ---------------------------------------------------------------------------
// Resolve paths
// ---------------------------------------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

// Load .env from project root
dotenv.config({ path: path.join(ROOT, '.env') });

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY || API_KEY === 'PLACEHOLDER_API_KEY') {
  console.error('❌  GEMINI_API_KEY is not set or is still a placeholder.');
  console.error('   Set a valid key in .env and try again.');
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const INPUT_IMAGE = path.join(ROOT, 'public', 'images', 'hero-stone-ref.png');
const OUTPUT_DIR = path.join(ROOT, 'public', 'videos');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'hero-stone-shatter.mp4');

const PROMPT =
  'Dramatic cinematic slow motion shot of this dark stone slab floating in a black void. ' +
  'The stone begins to crack with glowing fissures of light appearing along its surface, ' +
  'then suddenly explodes and shatters into hundreds of fragments and sharp debris flying ' +
  'outward in all directions. Fine dust particles and small rock chips scatter through the air. ' +
  'Pure black background, dramatic rim lighting highlighting the stone edges, ' +
  'volumetric dust clouds, epic and powerful atmosphere. 8 seconds.';

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const ai = new GoogleGenAI({ apiKey: API_KEY });

  console.log('');
  console.log('='.repeat(60));
  console.log('  VEO 3.1 — Hero Stone Shatter Video Generator');
  console.log('='.repeat(60));
  console.log('');

  // Skip if output already exists
  if (fs.existsSync(OUTPUT_FILE)) {
    console.log(`⏭  Output already exists: ${OUTPUT_FILE}`);
    console.log('   Delete it first if you want to regenerate.');
    process.exit(0);
  }

  // Check input exists
  if (!fs.existsSync(INPUT_IMAGE)) {
    console.error(`❌  Reference image not found: ${INPUT_IMAGE}`);
    process.exit(1);
  }

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log(`📷  Reference image: ${path.basename(INPUT_IMAGE)}`);
  console.log(`🎬  Prompt: "${PROMPT}"`);
  console.log('');

  // 1. Generate video (returns an async operation)
  console.log('📤  Starting Veo 3.1 video generation...');

  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-generate-preview',
    image: {
      imageBytes: fs.readFileSync(INPUT_IMAGE).toString('base64'),
      mimeType: 'image/png',
    },
    prompt: PROMPT,
    config: {
      aspectRatio: '16:9',
      numberOfVideos: 1,
    },
  });

  console.log('   Operation started. Polling for completion...');
  console.log('');

  // 2. Poll until done (every 15 seconds)
  const startTime = Date.now();
  while (!operation.done) {
    const elapsed = Math.round((Date.now() - startTime) / 1000);
    process.stdout.write(`   ⏳ Waiting... (${elapsed}s elapsed)\r`);
    await new Promise((resolve) => setTimeout(resolve, 15000));
    operation = await ai.operations.getVideosOperation({ operation });
  }

  const totalTime = Math.round((Date.now() - startTime) / 1000);
  console.log(`   ✅ Generation complete in ${totalTime}s`);
  console.log('');

  // Check for errors
  if (operation.error) {
    console.error('   ❌ Error:', JSON.stringify(operation.error, null, 2));
    process.exit(1);
  }

  // 3. Download the generated video
  const generatedVideos = operation.response?.generatedVideos;
  if (!generatedVideos || generatedVideos.length === 0) {
    console.error('   ❌ No videos in the response.');
    if (operation.response?.raiMediaFilteredReasons?.length) {
      console.error(
        '   Filtered reasons:',
        operation.response.raiMediaFilteredReasons
      );
    }
    process.exit(1);
  }

  console.log(`💾  Downloading to ${path.basename(OUTPUT_FILE)}...`);

  const generatedVideo = generatedVideos[0];
  await ai.files.download({
    file: generatedVideo,
    downloadPath: OUTPUT_FILE,
  });

  const stats = fs.statSync(OUTPUT_FILE);
  const sizeMB = (stats.size / 1024 / 1024).toFixed(1);

  console.log(`   ✅ Saved: ${OUTPUT_FILE} (${sizeMB} MB)`);
  console.log('');
  console.log('='.repeat(60));
  console.log('  Done! Video saved to public/videos/hero-stone-shatter.mp4');
  console.log('='.repeat(60));
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
