#!/usr/bin/env node
import sharp from 'sharp';
import { readdir, mkdir } from 'fs/promises';
import { join, resolve } from 'path';

const SRC_BASE = '/Users/martinmiskeje/Documents/Claude/Projects/FOTKY/FOTO REALIZACII/OneDrive_2026-03-29';
const OUT_DIR = resolve(import.meta.dirname, '../public/images/realizacie');

const HERO_WIDTH = 1200;
const HERO_QUALITY = 82;
const GALLERY_WIDTH = 800;
const GALLERY_QUALITY = 80;

// "files" = exact filenames; "allFiles" = use all files from dir sorted alphabetically (for dirs with special chars)
// "fileIndices" = pick specific indices from sorted dir listing
const PROJECTS = [
  // ── EXISTING 12 ──
  {
    folder: 'Projekt_11_Calacatta_Gold_kamenna_stena',
    slug: 'calacatta-gold-stena',
    files: [
      'WhatsApp Image 2026-04-12 at 15.16.01.jpeg',
      'WhatsApp Image 2026-04-12 at 15.16.01 (2).jpeg',
      'WhatsApp Image 2026-04-12 at 15.16.01 (1).jpeg',
      'WhatsApp Image 2026-04-12 at 15.19.59 (8).jpeg',
    ],
  },
  {
    folder: 'Projekt_02_Biely_Statuario',
    slug: 'biely-statuario',
    files: [
      'Polaris Statuario White 1 .jpeg',
      'Polaris Statuario White 2.jpeg',
      'Polaris Statuario White 3.jpeg',
    ],
  },
  {
    folder: 'Projekt_08_Krb_zeleny_mramor',
    slug: 'krb-zeleny-mramor',
    files: [
      'WhatsApp Image 2026-04-12 at 15.19.52.jpeg',
      'WhatsApp Image 2026-04-12 at 15.19.52 (1).jpeg',
      'WhatsApp Image 2026-04-12 at 15.19.52 (2).jpeg',
      'WhatsApp Image 2026-04-12 at 15.19.55 (4).jpeg',
    ],
  },
  {
    folder: 'Projekt_09_Svetly_onyx_showroom',
    slug: 'svetly-onyx-showroom',
    files: [
      'WhatsApp Image 2026-04-12 at 15.19.52 (3).jpeg',
      'WhatsApp Image 2026-04-12 at 15.19.52 (4).jpeg',
      'WhatsApp Image 2026-04-12 at 15.19.52 (5).jpeg',
      'WhatsApp Image 2026-04-12 at 15.19.53 (1).jpeg',
    ],
  },
  {
    folder: 'Projekt_01_Sivy_kamen_kuchyna',
    slug: 'sivy-kamen-kuchyna',
    files: [
      'WhatsApp Image 2026-04-09 at 10.35.08.jpeg',
      'WhatsApp Image 2026-04-09 at 10.35.09.jpeg',
      'WhatsApp Image 2026-04-09 at 10.35.09 (1).jpeg',
    ],
  },
  {
    folder: 'Projekt_04_Biely_mramor_sive_zilky',
    slug: 'biely-mramor-sive-zilky',
    files: [
      'WhatsApp Image 2026-04-12 at 15.14.25 (3).jpeg',
      'WhatsApp Image 2026-04-12 at 15.14.25 (2).jpeg',
      'WhatsApp Image 2026-04-12 at 15.14.25.jpeg',
    ],
  },
  {
    folder: 'Projekt_03_Biela_doska_ruzova_kuchyna',
    slug: 'biela-doska-ruzova-kuchyna',
    files: [
      'WhatsApp Image 2026-04-12 at 15.19.55 (5).jpeg',
      'WhatsApp Image 2026-04-12 at 15.19.55 (6).jpeg',
      'WhatsApp Image 2026-04-12 at 15.19.46 (1).jpeg',
    ],
  },
  {
    folder: 'Projekt_14_Calacatta_Oro_lustre',
    slug: 'calacatta-oro-lustre',
    files: [
      'WhatsApp Image 2026-04-12 at 15.19.56 (1).jpeg',
      'WhatsApp Image 2026-04-12 at 15.19.56 (2).jpeg',
      'WhatsApp Image 2026-04-12 at 15.19.56 (3).jpeg',
    ],
  },
  {
    folder: 'Projekt_30_Calacatta_Verde',
    slug: 'calacatta-verde',
    files: [
      'WhatsApp Image 2026-04-12 at 15.19.59 (3).jpeg',
      'WhatsApp Image 2026-04-12 at 15.19.59 (2).jpeg',
      'WhatsApp Image 2026-04-12 at 15.19.59 (4).jpeg',
    ],
  },
  {
    folder: 'Projekt_05_Tmavoseda_doska',
    slug: 'tmavoseda-doska',
    files: [
      'WhatsApp Image 2026-04-12 at 15.15.58.jpeg',
      'WhatsApp Image 2026-04-12 at 15.15.58 (1).jpeg',
      'WhatsApp Image 2026-04-12 at 15.15.59 (1).jpeg',
    ],
  },
  {
    folder: 'Projekt_07_Krb_biely_mramor',
    slug: 'krb-biely-mramor',
    files: [
      'krb Bianco.jpg',
    ],
  },
  {
    folder: 'Projekt_26_Bezovy_travertin_mix',
    slug: 'bezovy-travertin-mix',
    files: [
      'WhatsApp Image 2026-04-12 at 15.19.59 (1).jpeg',
      'WhatsApp Image 2026-04-12 at 15.16.00 (2).jpeg',
      'WhatsApp Image 2026-04-12 at 15.16.00 (3).jpeg',
    ],
  },
  // ── NEW 17 ──
  {
    folder: 'Projekt_06_Biely_mramor_montaz',
    slug: 'biely-mramor-montaz',
    files: [
      'WhatsApp Image 2026-04-12 at 15.15.59 (2).jpeg',
      'WhatsApp Image 2026-04-12 at 15.15.59 (3).jpeg',
      'WhatsApp Image 2026-04-12 at 15.15.59 (7).jpeg',
    ],
  },
  {
    folder: 'Projekt_10_Bezovy_mramor_FENIX',
    slug: 'bezovy-mramor-fenix',
    files: [
      'WhatsApp Image 2026-04-12 at 15.19.51 (1).jpeg',
      'WhatsApp Image 2026-04-12 at 15.19.51 (2).jpeg',
      'WhatsApp Image 2026-04-12 at 15.19.51 (3).jpeg',
    ],
  },
  {
    folder: 'Projekt_12_Calacatta_Gold_montaz',
    slug: 'calacatta-gold-montaz',
    files: [
      'WhatsApp Image 2026-04-12 at 15.14.26 (1).jpeg',
      'WhatsApp Image 2026-04-12 at 15.14.26 (2).jpeg',
      'WhatsApp Image 2026-04-12 at 15.14.26 (3).jpeg',
    ],
  },
  {
    folder: 'Projekt_13_Cierny_kamen_kuchyna',
    slug: 'cierny-kamen-kuchyna',
    files: [
      'WhatsApp Image 2026-04-12 at 15.19.57 (2).jpeg',
      'WhatsApp Image 2026-04-12 at 15.16.00 (1).jpeg',
      'WhatsApp Image 2026-04-12 at 15.19.57 (4).jpeg',
    ],
  },
  {
    folder: 'Projekt_15_Sivy_kamen_kniznica',
    slug: 'sivy-kamen-kniznica',
    files: [
      '81706d23-1db3-47e5-8739-6c3c06212821.JPG',
    ],
  },
  {
    folder: 'Projekt_16_Biely_mramor_drevena_stena',
    slug: 'biely-mramor-drevena-stena',
    allFiles: true, // use all files sorted (special chars in filenames)
  },
  {
    folder: 'Projekt_17_Sivy_kamen_stolicky',
    slug: 'sivy-kamen-stolicky',
    allFiles: true,
  },
  {
    folder: 'Projekt_18_Svetly_mramor_lamely',
    slug: 'svetly-mramor-lamely',
    allFiles: true,
  },
  {
    folder: 'Projekt_19_Calacatta_Gold_hex',
    slug: 'calacatta-gold-hex',
    allFiles: true,
  },
  {
    folder: 'Projekt_20_Biely_mramor_cierne_skrinky',
    slug: 'biely-mramor-cierne-skrinky',
    allFiles: true,
  },
  {
    folder: 'Projekt_22_Bezovy_kamen_stol',
    slug: 'bezovy-kamen-stol',
    allFiles: true,
  },
  {
    folder: 'Projekt_23_Sivy_mramor_modre_skrinky',
    slug: 'sivy-mramor-modre-skrinky',
    files: [
      'WhatsApp Image 2026-04-12 at 15.19.50.jpeg',
      'WhatsApp Image 2026-04-12 at 15.19.51.jpeg',
    ],
  },
  {
    folder: 'Projekt_24_Tmavy_kamen_zelene_skrinky',
    slug: 'tmavy-kamen-zelene-skrinky',
    allFiles: true,
  },
  {
    folder: 'Projekt_25_Zlatobiely_mramor',
    slug: 'zlatobiely-mramor',
    allFiles: true,
  },
  {
    folder: 'Projekt_27_Sivy_mramor_U_kuchyna',
    slug: 'sivy-mramor-u-kuchyna',
    files: [
      'WhatsApp Image 2026-04-12 at 15.19.58.jpeg',
      'WhatsApp Image 2026-04-12 at 15.19.57 (8).jpeg',
      'WhatsApp Image 2026-04-12 at 15.19.58 (1).jpeg',
    ],
  },
  {
    folder: 'Projekt_28_Biela_doska_LED',
    slug: 'biela-doska-led',
    files: [
      'WhatsApp Image 2026-04-12 at 15.19.56 (5).jpeg',
      'WhatsApp Image 2026-04-12 at 15.19.56 (6).jpeg',
      'WhatsApp Image 2026-04-12 at 15.19.56 (7).jpeg',
    ],
  },
  {
    folder: 'Projekt_29_Biely_Calacatta_chevron',
    slug: 'biely-calacatta-chevron',
    files: [
      'WhatsApp Image 2026-04-12 at 15.19.58 (4).jpeg',
      'WhatsApp Image 2026-04-12 at 15.19.58 (2).jpeg',
      'WhatsApp Image 2026-04-12 at 15.19.58 (5).jpeg',
    ],
  },
];

async function convert() {
  await mkdir(OUT_DIR, { recursive: true });

  let totalFiles = 0;
  let totalBytes = 0;

  for (const project of PROJECTS) {
    const srcDir = join(SRC_BASE, project.folder);

    // Resolve file list: either explicit or read from dir
    let fileList = project.files;
    if (project.allFiles) {
      const dirFiles = await readdir(srcDir);
      fileList = dirFiles
        .filter(f => /\.(jpe?g|png)$/i.test(f))
        .sort();
    }

    for (let i = 0; i < fileList.length; i++) {
      const srcFile = join(srcDir, fileList[i]);
      const isHero = i === 0;
      const outName = isHero
        ? `${project.slug}-hero.webp`
        : `${project.slug}-${i}.webp`;
      const outPath = join(OUT_DIR, outName);

      try {
        const result = await sharp(srcFile)
          .resize({ width: isHero ? HERO_WIDTH : GALLERY_WIDTH, withoutEnlargement: true })
          .webp({ quality: isHero ? HERO_QUALITY : GALLERY_QUALITY })
          .toFile(outPath);

        totalFiles++;
        totalBytes += result.size;
        console.log(`  ✓ ${outName}  (${(result.size / 1024).toFixed(0)} KB, ${result.width}×${result.height})`);
      } catch (err) {
        console.error(`  ✗ FAILED: ${project.folder}/${fileList[i]} → ${err.message}`);
      }
    }
  }

  console.log(`\nDone: ${totalFiles} files, ${(totalBytes / 1024 / 1024).toFixed(1)} MB total`);
}

convert().catch(console.error);
