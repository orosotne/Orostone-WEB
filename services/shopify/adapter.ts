import { SAMPLE_VARIANT_KEYWORD } from '../../constants';
import { type ShopProduct, type ProductCategory } from '../../constants';
import { getProductSEOContent } from '../../data/product-seo-content';
import type { ShopifyProduct, ShopifyProductVariant } from './types';
import { getMetafieldValue, resolveColorCategoryFromShopifyProduct } from './color';

// ===========================================
// PARSER: Extract tech specs from descriptionHtml
// ===========================================
// Shopify descriptions contain embedded "Technické parametre" sections.
// This parser extracts structured data and returns clean marketing HTML.

interface ParsedDescriptionSpecs {
  dimensions?: string;
  thickness?: string;
  finish?: string;
  weight?: number;
  sku?: string;
  countryOfOrigin?: string;
}

interface ParsedDescription {
  marketingHtml: string;
  specs: ParsedDescriptionSpecs;
}

export function parseShopifyDescription(descriptionHtml: string): ParsedDescription {
  const specs: ParsedDescriptionSpecs = {};
  let marketingHtml = descriptionHtml;

  if (!descriptionHtml) {
    return { marketingHtml: '', specs };
  }

  const headingPattern = /<(?:h[2-6]|p)>\s*(?:<(?:strong|b)>\s*)?Technick[eéẽ]\s+parametre:?\s*(?:<\/(?:strong|b)>\s*)?<\/(?:h[2-6]|p)>/i;
  const headingMatch = marketingHtml.match(headingPattern);

  if (headingMatch && headingMatch.index !== undefined) {
    const headingStart = headingMatch.index;
    const headingEnd = headingStart + headingMatch[0].length;

    const afterHeading = marketingHtml.substring(headingEnd);
    const ulMatch = afterHeading.match(/^\s*<ul>([\s\S]*?)<\/ul>/i);

    if (ulMatch && ulMatch.index !== undefined) {
      const liRegex = /<li>([\s\S]*?)<\/li>/gi;
      let liMatch;
      while ((liMatch = liRegex.exec(ulMatch[1])) !== null) {
        const liText = liMatch[1]
          .replace(/<\/?(?:strong|b|em|i|span)[^>]*>/gi, '')
          .replace(/\n/g, ' ')
          .trim();

        const colonIdx = liText.indexOf(':');
        if (colonIdx <= 0) continue;

        const label = liText.substring(0, colonIdx).trim().toLowerCase();
        const value = liText.substring(colonIdx + 1).trim();
        if (!value) continue;

        if (/rozmer/.test(label)) {
          const threeDims = value.match(/(\d+)\s*[×x]\s*(\d+)\s*[×x]\s*(\d+)\s*mm/i);
          if (threeDims) {
            const nums = [parseInt(threeDims[1]), parseInt(threeDims[2]), parseInt(threeDims[3])];
            nums.sort((a, b) => b - a);
            specs.dimensions = `${nums[0]} x ${nums[1]} mm`;
            specs.thickness = `${nums[2]}mm`;
          } else {
            const twoDims = value.match(/(\d+)\s*(?:mm)?\s*[×x]\s*(\d+)\s*(?:mm)?/i);
            if (twoDims) {
              const a = parseInt(twoDims[1]);
              const b = parseInt(twoDims[2]);
              specs.dimensions = `${Math.max(a, b)} x ${Math.min(a, b)} mm`;
            } else {
              specs.dimensions = value;
            }
          }
        } else if (/hr[uú]bka/.test(label)) {
          specs.thickness = value.replace(/\s+/g, '').replace(/(\d+)mm/i, '$1mm');
          const thickMatch = value.match(/(\d+)\s*mm/i);
          if (thickMatch) {
            specs.thickness = `${thickMatch[1]}mm`;
          }
        } else if (/povrch/.test(label)) {
          specs.finish = value;
        } else if (/hmotnos/.test(label)) {
          const weightMatch = value.match(/(\d+(?:[.,]\d+)?)/);
          if (weightMatch) {
            specs.weight = parseFloat(weightMatch[1].replace(',', '.'));
          }
        } else if (/k[oó]d/.test(label) || /sku/i.test(label)) {
          specs.sku = value;
        } else if (/p[oôu]vod/.test(label) || /krajina/.test(label) || /origin/i.test(label)) {
          specs.countryOfOrigin = value;
        }
      }

      const fullTechSection = marketingHtml.substring(headingStart, headingEnd + ulMatch.index + ulMatch[0].length);
      marketingHtml = marketingHtml.replace(fullTechSection, '');
      marketingHtml = marketingHtml.replace(/\n{3,}/g, '\n\n').trim();
    }
  }

  // Fallback: scan whole HTML for specs not under a "Technické parametre" heading
  if (!specs.finish) {
    const finishMatch = descriptionHtml.match(/Povrchov[aá]\s+[uú]prava\s*:\s*([^<\n]+)/i);
    if (finishMatch) specs.finish = finishMatch[1].trim();
  }
  if (!specs.dimensions) {
    const dimsMatch = descriptionHtml.match(/Rozmer\s*:\s*([^<\n]+)/i);
    if (dimsMatch) {
      const val = dimsMatch[1].trim();
      const threeDims = val.match(/(\d+)\s*[×x]\s*(\d+)\s*[×x]\s*(\d+)\s*mm/i);
      if (threeDims) {
        const nums = [parseInt(threeDims[1]), parseInt(threeDims[2]), parseInt(threeDims[3])];
        nums.sort((a, b) => b - a);
        specs.dimensions = `${nums[0]} x ${nums[1]} mm`;
        specs.thickness = `${nums[2]}mm`;
      } else {
        const twoDims = val.match(/(\d+)\s*(?:mm)?\s*[×x]\s*(\d+)\s*(?:mm)?/i);
        if (twoDims) {
          const a = parseInt(twoDims[1]);
          const b = parseInt(twoDims[2]);
          specs.dimensions = `${Math.max(a, b)} x ${Math.min(a, b)} mm`;
        }
      }
    }
  }
  if (!specs.thickness) {
    const thickMatch = descriptionHtml.match(/Hr[uú]bka\s*:\s*([^<\n]+)/i);
    if (thickMatch) {
      const m = thickMatch[1].match(/(\d+)\s*mm/i);
      specs.thickness = m ? `${m[1]}mm` : thickMatch[1].trim();
    }
  }

  // Post-process: highlight key selling phrases with <strong> tags (renders as gold bold)
  const highlightPhrases = [
    'výnimočný dizajn s luxusným zlatým akcentom a haute couture eleganciou',
    'čistého, minimalistického dizajnu s klasickým mramorovým charakterom',
    'teplý, prirodzený dizajn s charakterom historického kameňa',
    'čistý, minimalistický dizajn s ľadovou eleganciou',
    'jemnými šedými žilami na snežobielom podklade',
    'klasický Calacatta dizajn s výrazným žilkovaním',
    'ikonický mramorový dizajn so zlatými akcentmi',
    'výnimočný dizajn s teplými tónmi a luxusným charakterom',
    'prirodzený vzhľad, odolnosť a nadčasový dizajn',
    'sofistikovanú eleganciu s teplým charakterom',
    'dramatickú eleganciu a sofistikovaný charakter',
    'dramatickú eleganciu a luxusný charakter',
    'nadčasovú eleganciu a luxusný vzhľad',
    'čistotu, svetlosť a nadčasovú eleganciu',
    'harmonický a sofistikovaný priestor',
    'teplými béžovými tónmi a prirodzenou textúrou',
    'medeno-hnedé tóny s kovovým efektom',
    'zlato-šedými žilami na krémovom podklade',
    'čistotu bielej farby s bohatými zlatými žilami',
    'jemné krémové tóny s bohatými zlatými žilami',
    'bohatými šedými a zlatými žilami',
    'čistý, minimalistický a sofistikovaný dizajn',
    'sofistikovaný a nadčasový dizajn',
    'historickú krásu antických stavieb',
    'snežobielu farbu s jemnými šedými odtieňmi',
    'luxusnú krásu exotického kameňa',
    'autentický, surovo-luxusný vzhľad',
    'jedinečný statement piece s módnym šarmom',
    'statement piece s nadčasovým šarmom',
    'vrchol elegancie a čistoty',
    'luxus talianskeho mramoru Calacatta',
    'najluxusnejším talianskym mramorom',
    'slavným talianskym mramorom Calacatta',
    'najkrajších odrôd prírodného kameňa',
    'prírodného mramoru bez jeho nevýhod',
    'výrazným mramorovým dizajnom',
    'výrazným zlatým žilkovaním',
    'luxusným zlatým žilkovaním',
    'klasickým rímskym travertínom',
    'industriálnym charakterom',
    'haute couture eleganciu',
    'čistou, ľadovou eleganciou',
    'krásu arktických ľadovcov',
    'sviežu, modernú atmosféru',
    'teplú, zemitú eleganciu',
    'luxusný a dramatický dizajn',
    'sofistikovaný a luxusný dizajn',
    'prirodzenú patinu kovu',
    'výraznými zlatými žilami',
    'jedinečnosť a charakter',
    'funkčnosť s estetikou',
    'nadčasovú sofistikovanosť',
    'výnimočný statement piece',
    'výrazný statement piece',
    'odvážny dizajn',
    'jedinečný a výnimočný dizajn',
    'jedinečný a výrazný dizajn',
    'dokonalou voľbou',
    'perfektným riešením',
  ];

  for (const phrase of highlightPhrases) {
    const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    marketingHtml = marketingHtml.replace(regex, (match, _p1, offset) => {
      const before = marketingHtml.substring(0, offset);
      const lastOpenStrong = before.lastIndexOf('<strong');
      const lastCloseStrong = before.lastIndexOf('</strong>');
      if (lastOpenStrong > lastCloseStrong) return match;
      return `<strong>${match}</strong>`;
    });
  }

  return { marketingHtml, specs };
}

function getDesignInsight(handle: string): string | undefined {
  return getProductSEOContent(handle)?.longDescription;
}

function mapProductTypeToCategory(productType: string): ProductCategory {
  const typeMap: Record<string, ProductCategory> = {
    'sintered-stone': 'sintered-stone',
    'sintered stone': 'sintered-stone',
    'sinterovaný kameň': 'sintered-stone',
    'tables': 'tables',
    'stoly': 'tables',
    'invisible-cooktop': 'invisible-cooktop',
    'invisible cooktop': 'invisible-cooktop',
    'accessories': 'accessories',
    'doplnky': 'accessories',
  };
  return typeMap[productType.toLowerCase()] || 'sintered-stone';
}

export function shopifyProductToShopProduct(product: ShopifyProduct): ShopProduct {
  const sampleKeyword = SAMPLE_VARIANT_KEYWORD.toLowerCase();
  const allVariants = product.variants.edges.map(({ node }) => node);
  const firstVariant: ShopifyProductVariant | undefined = allVariants.find(v => !v.title.toLowerCase().includes(sampleKeyword)) || allVariants[0];
  const sampleVariant = allVariants.find(v => v.title.toLowerCase().includes(sampleKeyword));
  const images = product.images.edges.map(({ node }) => node.url);

  const { marketingHtml, specs: parsedSpecs } = parseShopifyDescription(product.descriptionHtml || '');

  const dims = getMetafieldValue(product, 'dimensions')
    || parsedSpecs.dimensions
    || '3200 x 1600 mm';

  const slabPrice = firstVariant ? parseFloat(firstVariant.price.amount) : 0;
  const dimMatch = dims.match(/(\d+)\s*[×x]\s*(\d+)/i);
  const slabArea = dimMatch
    ? (parseInt(dimMatch[1]) / 1000) * (parseInt(dimMatch[2]) / 1000)
    : 5.12;
  const pricePerM2 = slabArea > 0 ? Math.round((slabPrice / slabArea) * 100) / 100 : slabPrice;

  const metafieldWeight = getMetafieldValue(product, 'weight');
  let resolvedWeight: number | undefined;
  if (metafieldWeight) {
    resolvedWeight = parseFloat(metafieldWeight);
  } else if (firstVariant?.weight) {
    resolvedWeight = firstVariant.weight;
  } else if (parsedSpecs.weight) {
    resolvedWeight = parsedSpecs.weight;
  }

  const resolvedSku = firstVariant?.sku || parsedSpecs.sku || undefined;

  const category = mapProductTypeToCategory(product.productType);
  const rawCountry = getMetafieldValue(product, 'country_of_origin') || parsedSpecs.countryOfOrigin;
  const trimmedCountry = rawCountry?.trim() || undefined;
  const countryOfOrigin = trimmedCountry || (category === 'sintered-stone' ? 'CN' : undefined);

  return {
    id: product.handle,
    name: product.title,
    description: product.description,
    descriptionHtml: marketingHtml || undefined,
    pricePerM2,
    image: images[0] || '/images/logo.png',
    gallery: images,
    category,
    dimensions: dims,
    thickness: getMetafieldValue(product, 'thickness') || parsedSpecs.thickness || '12mm',
    finish: getMetafieldValue(product, 'finish') || parsedSpecs.finish || 'Leštený',
    material: getMetafieldValue(product, 'material') || 'Sinterovaný kameň',
    inStock: product.availableForSale,
    stockQuantity: 0,
    vendor: product.vendor,
    heatResistance: getMetafieldValue(product, 'heat_resistance') || 'Do 300°C',
    weight: resolvedWeight,
    countryOfOrigin,
    sku: resolvedSku,
    designInsight: getDesignInsight(product.handle),
    metaTitle: getProductSEOContent(product.handle)?.metaTitle,
    metaDescription: getProductSEOContent(product.handle)?.metaDescription,
    keywords: getProductSEOContent(product.handle)?.keywords,
    keyBenefits: getProductSEOContent(product.handle)?.keyBenefits,
    shopifyVariantId: firstVariant?.id || '',
    sampleShopifyVariantId: sampleVariant?.id || undefined,
    scratchResistance: 'Mohs 7+',
    stainResistance: 'Nenasiakavý',
    uvResistance: true,
    porosity: '< 0.1%',
    edgeStyle: 'Rovná hrana',
    applications: ['Kuchynské dosky', 'Ostrovčeky', 'Kúpeľne', 'Obklad stien', 'Komerčné interiéry', 'Fasády', 'Podlahy', 'Nábytok'],
    deliveryTimeframe: '5 pracovných dní',
    colorCategory: resolveColorCategoryFromShopifyProduct(product, firstVariant),
  };
}
