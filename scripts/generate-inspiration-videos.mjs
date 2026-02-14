/**
 * generate-inspiration-videos.mjs
 * --------------------------------
 * One-time script that converts the 5 inspiration images into short
 * 5-second videos using Google VEO 3 (via the @google/genai SDK).
 *
 * Prerequisites:
 *   1. Set GEMINI_API_KEY in your .env (must have Veo access)
 *   2. Ensure images exist at public/images/inspiration/inspiration-{1..5}.webp
 *
 * Usage:
 *   node scripts/generate-inspiration-videos.mjs
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
// Image → prompt mapping (camera movement descriptions)
// ---------------------------------------------------------------------------
const IMAGES = [
  {
    file: 'inspiration-1.webp',
    prompt:
      'Slow cinematic dolly forward, camera gradually zooming into the kitchen countertop, smooth steady motion, natural ambient lighting, 5 seconds',
  },
  {
    file: 'inspiration-2.webp',
    prompt:
      'Slow close-in shot focusing on the sintered stone slab surface, camera steadily moving closer to reveal the stone texture and material details, ignoring the surroundings, cinematic shallow depth of field, 5 seconds',
  },
  {
    file: 'inspiration-3.webp',
    prompt:
      'Slow close-in shot, camera steadily moving closer to reveal the stone surface texture and details, cinematic shallow depth of field, 5 seconds',
  },
  {
    file: 'inspiration-4.webp',
    prompt:
      'Elegant slow pan right to left across the luxury kitchen, smooth parallax motion, warm ambient lighting, 5 seconds',
  },
  {
    file: 'inspiration-5.webp',
    prompt:
      'Cinematic zoom in on the kitchen workspace, shallow depth of field effect, smooth forward camera motion, 5 seconds',
  },
];

const INPUT_DIR = path.join(ROOT, 'public', 'images', 'inspiration');
const OUTPUT_DIR = path.join(ROOT, 'public', 'videos', 'inspiration');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const ai = new GoogleGenAI({ apiKey: API_KEY });

  console.log('');
  console.log('='.repeat(60));
  console.log('  VEO 3 — Inspiration Video Generator');
  console.log('='.repeat(60));
  console.log('');

  for (let i = 0; i < IMAGES.length; i++) {
    const { file: filename, prompt } = IMAGES[i];
    const inputPath = path.join(INPUT_DIR, filename);
    const outputFilename = filename.replace('.webp', '.mp4');
    const outputPath = path.join(OUTPUT_DIR, outputFilename);

    // Skip if output already exists
    if (fs.existsSync(outputPath)) {
      console.log(`⏭  [${i + 1}/5] ${outputFilename} already exists, skipping.`);
      continue;
    }

    // Check input exists
    if (!fs.existsSync(inputPath)) {
      console.error(`❌  [${i + 1}/5] Input image not found: ${inputPath}`);
      continue;
    }

    console.log(`📤  [${i + 1}/5] Uploading ${filename}...`);

    // 1. Upload image to Gemini Files API
    const uploadedFile = await ai.files.upload({
      file: inputPath,
      config: { mimeType: 'image/webp' },
    });

    console.log(`   Uploaded as: ${uploadedFile.name}`);
    console.log(`🎬  [${i + 1}/5] Generating video with prompt:`);
    console.log(`   "${prompt}"`);

    // 2. Generate video (returns an async operation)
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-generate-preview',
      image: {
        imageBytes: fs.readFileSync(inputPath).toString('base64'),
        mimeType: 'image/webp',
      },
      prompt,
      config: {
        aspectRatio: '16:9',
        numberOfVideos: 1,
      },
    });

    console.log(`   Operation started. Polling for completion...`);

    // 3. Poll until done (every 15 seconds)
    const startTime = Date.now();
    while (!operation.done) {
      const elapsed = Math.round((Date.now() - startTime) / 1000);
      process.stdout.write(`   ⏳ Waiting... (${elapsed}s elapsed)\r`);
      await new Promise((resolve) => setTimeout(resolve, 15000));
      operation = await ai.operations.getVideosOperation({ operation });
    }

    const totalTime = Math.round((Date.now() - startTime) / 1000);
    console.log(`   ✅ Generation complete in ${totalTime}s`);

    // Check for errors
    if (operation.error) {
      console.error(`   ❌ Error:`, JSON.stringify(operation.error, null, 2));
      continue;
    }

    // 4. Download the generated video
    const generatedVideos = operation.response?.generatedVideos;
    if (!generatedVideos || generatedVideos.length === 0) {
      console.error(`   ❌ No videos in the response.`);
      if (operation.response?.raiMediaFilteredReasons?.length) {
        console.error(`   Filtered reasons:`, operation.response.raiMediaFilteredReasons);
      }
      continue;
    }

    console.log(`💾  [${i + 1}/5] Downloading to ${outputFilename}...`);

    const generatedVideo = generatedVideos[0];
    await ai.files.download({
      file: generatedVideo,
      downloadPath: outputPath,
    });

    console.log(`   ✅ Saved: ${outputPath}`);
    console.log('');
  }

  console.log('='.repeat(60));
  console.log('  Done! Videos saved to public/videos/inspiration/');
  console.log('='.repeat(60));
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
