import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = 'C:\\Users\\Martin\\.cursor\\projects\\c-Projekty-Orostone-5\\assets';
const destDir = path.join(__dirname, '..', 'public', 'images', 'resistance');

const files = [
  'heat-resistance.png',
  'food-safety.png',
  'scratch-resistance.png',
  'stain-resistance.png',
];

for (const file of files) {
  const srcPath = path.join(srcDir, file);
  const webpName = file.replace('.png', '.webp');
  const destPath = path.join(destDir, webpName);
  
  try {
    const info = await sharp(srcPath)
      .webp({ quality: 85 })
      .toFile(destPath);
    console.log(`✓ ${file} -> ${webpName} (${(info.size / 1024).toFixed(0)} KB)`);
  } catch (err) {
    console.error(`✗ ${file}: ${err.message}`);
  }
}

console.log('\nDone!');
