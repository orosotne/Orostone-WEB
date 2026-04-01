/**
 * generate-inspiration-thumbnails.mjs
 *
 * Generates two sets of optimised assets for the InspirationSection marquee:
 *   1. Resized image thumbnails: 440px wide webp @ q80
 *      → public/images/inspiration/thumb-inspiration-{1-7}.webp
 *   2. Video poster frames (first frame extracted via ffmpeg):
 *      → public/images/inspiration/poster-inspiration-{1-7}.webp
 *
 * Usage: node scripts/generate-inspiration-thumbnails.mjs
 */

import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const execFileAsync = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PUB = path.join(ROOT, 'public');

const THUMB_WIDTH = 440;
const INDICES = [1, 2, 3, 4, 5, 6, 7];

async function generateThumbs() {
  console.log('📸 Generating image thumbnails (440px wide)…');
  await Promise.all(
    INDICES.map(async (i) => {
      const src = path.join(PUB, 'images', 'inspiration', `inspiration-${i}.webp`);
      const dst = path.join(PUB, 'images', 'inspiration', `thumb-inspiration-${i}.webp`);
      await sharp(src)
        .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(dst);
      const { size } = (await import('node:fs')).statSync(dst);
      console.log(`  ✓ thumb-inspiration-${i}.webp — ${(size / 1024).toFixed(0)} KB`);
    })
  );
}

async function generatePosters() {
  console.log('🎬 Extracting video poster frames…');
  await Promise.all(
    INDICES.map(async (i) => {
      const src = path.join(PUB, 'videos', 'inspiration', `inspiration-${i}.mp4`);
      const tmpPng = path.join(PUB, 'images', 'inspiration', `._tmp_poster_${i}.png`);
      const dst = path.join(PUB, 'images', 'inspiration', `poster-inspiration-${i}.webp`);

      // Extract first frame with ffmpeg
      await execFileAsync('ffmpeg', [
        '-y',
        '-i', src,
        '-frames:v', '1',
        '-vf', `scale=${THUMB_WIDTH}:-2`,
        tmpPng,
      ]);

      // Convert to webp with sharp
      await sharp(tmpPng)
        .webp({ quality: 80 })
        .toFile(dst);

      // Clean up tmp png
      const { unlinkSync } = await import('node:fs');
      if (existsSync(tmpPng)) unlinkSync(tmpPng);

      const { size } = (await import('node:fs')).statSync(dst);
      console.log(`  ✓ poster-inspiration-${i}.webp — ${(size / 1024).toFixed(0)} KB`);
    })
  );
}

try {
  await generateThumbs();
  await generatePosters();
  console.log('\n✅ All assets generated successfully.');
} catch (err) {
  console.error('❌ Error:', err.message);
  process.exit(1);
}
