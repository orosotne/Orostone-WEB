/**
 * Stiahne posledné príspevky z Instagramu (edge funkcia instagram-feed), zmenší ich
 * obrázky na dlaždice 600×750 webp do public/images/instagram/ a zoznam uloží do
 * data/instagram-feed.json. Homepage ich tak ukáže hneď z vlastnej domény, bez
 * čakania na Instagram API a bez 1080px originálov z cdninstagram.com.
 *
 * Beží pri každom builde. Pri chybe ostáva posledná uložená verzia.
 */
import 'dotenv/config';
import { mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import sharp from 'sharp';

const TILES = 8;
// A carousel that opens with a video has no still image; ask for a few extra posts to fill 8 tiles.
const FETCH = 12;
// Tiles are at most 280 px wide on desktop (2x = 560) and 200 px on phones (3x = 600).
const WIDTH = 600;
const HEIGHT = 750;
const IMG_DIR = resolve(process.cwd(), 'public/images/instagram');
const DATA_FILE = resolve(process.cwd(), 'data/instagram-feed.json');

interface FeedPost {
  id: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url?: string;
  thumbnail_url?: string;
  permalink: string;
}

async function tile(post: FeedPost): Promise<Buffer | null> {
  const src = post.media_type === 'VIDEO' ? post.thumbnail_url : post.media_url;
  if (!src || !/^\d+$/.test(post.id)) return null;
  try {
    const res = await fetch(src, { signal: AbortSignal.timeout(20_000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await sharp(Buffer.from(await res.arrayBuffer()))
      .resize(WIDTH, HEIGHT, { fit: 'cover' })
      .webp({ quality: 72 })
      .toBuffer();
  } catch (e) {
    console.warn(`⚠ sync-instagram: preskakujem ${post.id} (${e instanceof Error ? e.message : e})`);
    return null;
  }
}

async function main() {
  const base = process.env.VITE_SUPABASE_URL;
  if (!base) throw new Error('chýba VITE_SUPABASE_URL');
  const res = await fetch(`${base}/functions/v1/instagram-feed?limit=${FETCH}`, {
    headers: { apikey: process.env.VITE_SUPABASE_ANON_KEY || '' },
    signal: AbortSignal.timeout(20_000),
  });
  if (!res.ok) throw new Error(`instagram-feed HTTP ${res.status}`);
  const json = (await res.json()) as { data?: FeedPost[]; error?: string };
  if (json.error) throw new Error(`instagram-feed: ${json.error}`);

  // Everything is downloaded before anything is written, so a failure keeps the old snapshot whole
  const posts = json.data || [];
  const images = await Promise.all(posts.map(tile));
  const tiles = posts
    .map((post, i) => ({ post, webp: images[i] }))
    .filter((t): t is { post: FeedPost; webp: Buffer } => t.webp !== null)
    .slice(0, TILES);
  if (tiles.length < TILES) throw new Error(`len ${tiles.length} z ${TILES} obrázkov`);

  mkdirSync(IMG_DIR, { recursive: true });
  const keep = new Set(tiles.map((t) => `${t.post.id}.webp`));
  for (const file of readdirSync(IMG_DIR)) if (!keep.has(file)) rmSync(resolve(IMG_DIR, file));
  for (const t of tiles) writeFileSync(resolve(IMG_DIR, `${t.post.id}.webp`), t.webp);

  const feed = tiles.map((t) => ({
    id: t.post.id,
    permalink: t.post.permalink,
    image: `/images/instagram/${t.post.id}.webp`,
  }));
  writeFileSync(DATA_FILE, `${JSON.stringify(feed, null, 2)}\n`, 'utf-8');
  const kb = Math.round(tiles.reduce((sum, t) => sum + t.webp.length, 0) / 1024);
  console.log(`OK: ${tiles.length} príspevkov z Instagramu (${kb} kB) → ${DATA_FILE}`);
}

main().catch((e) => {
  console.warn(`⚠ sync-instagram: ${e instanceof Error ? e.message : e}`);
  console.warn('Pokračujem s existujúcou verziou príspevkov.');
  // Do NOT process.exit(1) during build — a few days old posts are better than no build
});
