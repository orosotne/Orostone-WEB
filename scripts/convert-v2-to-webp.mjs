import sharp from 'sharp';
import path from 'path';

const srcDir = 'C:\\Users\\Martin\\.cursor\\projects\\c-Projekty-Orostone-5\\assets';
const destDir = path.resolve('public', 'images', 'resistance');

const files = [
  { src: 'scratch-resistance-v2.png', dest: 'scratch-resistance.webp' },
  { src: 'stain-resistance-v2.png', dest: 'stain-resistance.webp' },
];

for (const { src, dest } of files) {
  const srcPath = path.join(srcDir, src);
  const destPath = path.join(destDir, dest);
  
  const info = await sharp(srcPath)
    .webp({ quality: 85 })
    .toFile(destPath);
  console.log(`✓ ${src} -> ${dest} (${(info.size / 1024).toFixed(0)} KB)`);
}

console.log('Done!');
