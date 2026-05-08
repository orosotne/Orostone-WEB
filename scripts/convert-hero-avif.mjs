import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const homeDir = path.resolve(__dirname, '..', 'public/images/home');
const inspirationDir = path.resolve(__dirname, '..', 'public/images/inspiration');

const files = [
  ...['hero-1.webp', 'hero-2.webp', 'hero-3.webp', 'hero-4.webp', 'hero-5.webp']
    .map(f => path.join(homeDir, f)),
  ...['inspiration-1.webp', 'inspiration-2.webp', 'inspiration-4.webp', 'inspiration-5.webp', 'inspiration-6.webp', 'inspiration-7.webp', 'inspiration-8.webp']
    .map(f => path.join(inspirationDir, f)),
];

let totalSaved = 0;
let totalConverted = 0;
for (const src of files) {
  if (!fs.existsSync(src)) {
    console.log(`SKIP (missing): ${path.basename(src)}`);
    continue;
  }
  const dst = src.replace(/\.webp$/, '.avif');
  if (fs.existsSync(dst)) {
    const dstStats = fs.statSync(dst);
    const srcStats = fs.statSync(src);
    console.log(`SKIP (exists): ${path.basename(src)} ${(srcStats.size/1024).toFixed(0)}K | ${path.basename(dst)} ${(dstStats.size/1024).toFixed(0)}K`);
    continue;
  }
  const srcStats = fs.statSync(src);
  await sharp(src).avif({ quality: 70, effort: 6 }).toFile(dst);
  const dstStats = fs.statSync(dst);
  const savedKB = ((srcStats.size - dstStats.size) / 1024).toFixed(1);
  const pct = ((1 - dstStats.size / srcStats.size) * 100).toFixed(1);
  totalSaved += srcStats.size - dstStats.size;
  totalConverted++;
  console.log(`${path.basename(src)} ${(srcStats.size/1024).toFixed(0)}K → ${path.basename(dst)} ${(dstStats.size/1024).toFixed(0)}K (-${savedKB}K, -${pct}%)`);
}
console.log(`\nTotal: ${totalConverted} new conversions, ${(totalSaved/1024).toFixed(1)} KB saved`);
