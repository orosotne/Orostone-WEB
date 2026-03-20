/**
 * Stiahne produkty cez Storefront API a uloží ich do data/shop-products-fallback.json.
 * Použi po zmene katalógu v Shopify alebo pred release (offline / výpadok API).
 *
 * Vyžaduje .env s VITE_SHOPIFY_STORE_DOMAIN a VITE_SHOPIFY_STOREFRONT_TOKEN.
 */
import 'dotenv/config';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fetchProducts } from '../services/shopify.service';

const FIRST = Math.min(Number(process.env.SHOPIFY_FALLBACK_PRODUCT_LIMIT) || 250, 250);

async function main() {
  const products = await fetchProducts(FIRST);
  const out = resolve(process.cwd(), 'data/shop-products-fallback.json');
  writeFileSync(out, `${JSON.stringify(products, null, 2)}\n`, 'utf-8');
  console.log(`OK: ${products.length} produktov → ${out}`);
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
