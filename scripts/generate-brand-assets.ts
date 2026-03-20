/**
 * Generuje OG obrázok (1200×630), favicon PNG a apple-touch z orostone-circle.png.
 * Spustenie: npx tsx scripts/generate-brand-assets.ts
 */
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const circle = path.join(root, 'public/images/brand/orostone-circle.png');
const BRAND = { r: 26, g: 26, b: 26 };

async function main() {
  const logoBuf = await sharp(circle)
    .resize({ height: 520, fit: 'inside' })
    .toBuffer();
  const { width: lw = 0, height: lh = 0 } = await sharp(logoBuf).metadata();
  const left = Math.round((1200 - lw) / 2);
  const top = Math.round((630 - lh) / 2);

  await sharp({
    create: { width: 1200, height: 630, channels: 3, background: BRAND },
  })
    .composite([{ input: logoBuf, left, top }])
    .png()
    .toFile(path.join(root, 'public/images/og-orostone.png'));

  await sharp(circle).resize(32, 32).png().toFile(path.join(root, 'public/favicon-32x32.png'));
  await sharp(circle).resize(16, 16).png().toFile(path.join(root, 'public/favicon-16x16.png'));

  const touchInner = await sharp(circle).resize(160, 160, { fit: 'inside' }).toBuffer();
  const { width: tw = 160, height: th = 160 } = await sharp(touchInner).metadata();
  const tLeft = Math.round((180 - tw) / 2);
  const tTop = Math.round((180 - th) / 2);
  await sharp({
    create: { width: 180, height: 180, channels: 3, background: BRAND },
  })
    .composite([{ input: touchInner, left: tLeft, top: tTop }])
    .png()
    .toFile(path.join(root, 'public/apple-touch-icon.png'));

  console.log('OK: og-orostone.png, favicon-16/32, apple-touch-icon.png');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
