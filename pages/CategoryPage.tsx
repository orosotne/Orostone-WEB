import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  getVisibleCategories,
  getProductColorCategory,
  sortSinteredByColorThenName,
  type ColorCategory,
} from '../components/Eshop/EshopMegaMenu';
import { useShopifyProducts } from '../hooks/useShopifyProducts';
import { useCart } from '../context/CartContext';
import { ProductCard } from '../components/Shop/ProductCard';
import { CATALOG_GRID } from '../components/Shop/catalogGrid';
import { SEOHead } from '../components/UI/SEOHead';
import { CatalogOfflineNotice } from '../components/UI/CatalogOfflineNotice';
import { CatalogGridSkeleton } from '../components/UI/Skeleton';
import { CATEGORY_SEO } from '../data/seo';
import { BULK_DISCOUNT } from '../data/pricing';
import {
  ActionButton,
  chipClass,
  Container,
  GoldBand,
  PageHero,
  Section,
  SectionHeader,
  TextLink,
} from '../components/Design';

const HELP = [
  {
    title: 'Vzorka domov',
    text: 'Dekor posúďte pri svojom svetle a vedľa dvierok kuchyne. Prvú vzorku máte zadarmo.',
    link: { to: '/vzorky', label: 'Objednať vzorku' },
  },
  {
    title: 'Dekory v kuchyniach',
    text: 'Malý výrez nestačí. V realizáciách vidíte, ako kresba pôsobí na celej doske a ostrovčeku.',
    link: { to: '/realizacie', label: 'Pozrieť realizácie' },
  },
  {
    title: 'Celé platne v Bošanoch',
    text: 'V showroome v renesančnom kaštieli si platne pozriete naživo a poradíme vám s výberom.',
    link: { to: '/kontakt', label: 'Dohodnúť návštevu' },
  },
];

// ===========================================
// CATEGORY PAGE
// ===========================================

export const CategoryPage: React.FC = () => {
  const { slug, subCategory } = useParams<{ slug: string; subCategory?: string }>();
  const { products, isLoading, usingFallback } = useShopifyProducts(50);
  const { addItem, isInCart, getItemQuantity } = useCart();

  const mainCategory = slug || '';

  // Find category metadata from visible categories only (vždy podľa hlavnej kategórie)
  const category = useMemo(
    () => getVisibleCategories().find((c) => c.slug === mainCategory),
    [mainCategory]
  );

  // Nájdi názov podkategórie
  const subCategoryName = useMemo(() => {
    if (!category || !subCategory) return null;
    const sub = category.subcategories.find(s => s.slug.endsWith(subCategory));
    return sub?.name || null;
  }, [category, subCategory]);

  // Validuj, že subkategória je platná (predíde indexovaniu /kategoria/:slug/:nahodny-string)
  const isValidSubCategory = useMemo(() => {
    if (!category || !subCategory) return true;
    return category.subcategories.some(s => s.slug.endsWith(subCategory));
  }, [category, subCategory]);

  const categoryProducts = useMemo(
    () => products.filter((p) => p.category === mainCategory),
    [products, mainCategory]
  );

  // Filter products by category slug a voliteľne podľa farebnej podkategórie
  const filteredProducts = useMemo(() => {
    let result = categoryProducts;

    // Ak je podkategória farby, filtruj podľa farby
    if (mainCategory === 'sintered-stone' && subCategory) {
      const colorCat = subCategory as ColorCategory;
      result = result.filter(p => getProductColorCategory(p) === colorCat);
    }

    if (mainCategory === 'sintered-stone') {
      result =
        subCategory
          ? [...result].sort((a, b) => a.name.localeCompare(b.name, 'sk', { sensitivity: 'base' }))
          : sortSinteredByColorThenName(result);
    } else {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name, 'sk', { sensitivity: 'base' }));
    }

    return result;
  }, [categoryProducts, mainCategory, subCategory]);

  // Number of products behind each colour chip ("Biele 5")
  const countFor = (subSlug: string): number | null => {
    if (isLoading) return null;
    const color = subSlug.split('/')[1];
    if (!color) return categoryProducts.length;
    return mainCategory === 'sintered-stone'
      ? categoryProducts.filter((p) => getProductColorCategory(p) === color).length
      : null;
  };

  // Category not found (neznámy slug, skrytá kategória, neplatná subkategória)
  if (!category || !isValidSubCategory) {
    return (
      <Section tone="chalk" className="flex min-h-[calc(100svh-4rem)] items-center lg:min-h-[calc(100svh-5rem)]">
        <SEOHead
          title="Kategória nenájdená | OROSTONE E-Shop"
          description="Kategória s týmto názvom neexistuje alebo bola presunutá."
          noindex={true}
        />
        <Container className="grid justify-items-start gap-5">
          <h1 className="text-os-h1">Kategória nenájdená</h1>
          <p className="text-os-lead font-light text-brand-muted">Kategória s týmto názvom neexistuje.</p>
          <ActionButton to="/kategoria/sintered-stone" arrow className="mt-3">
            Všetky produkty
          </ActionButton>
        </Container>
      </Section>
    );
  }

  const hasProducts = filteredProducts.length > 0;

  // Resolve Vera FINAL meta for this category / subcategory; fall back to
  // generated copy for any slug that isn't yet in the override table (keeps
  // the page safe if a new category lands before the SEO copy does).
  const seoLookupKey = subCategory ? `${slug}/${subCategory}` : (slug || '');
  const seoOverride = CATEGORY_SEO[seoLookupKey];
  const seoTitle = seoOverride?.title || `${category.name} | OROSTONE`;
  const seoDescription =
    seoOverride?.description ||
    category.description ||
    `${category.name} — produkty od OROSTONE.`;

  const isSintered = mainCategory === 'sintered-stone';
  const lead =
    isSintered && !subCategory
      ? 'Celé platne 3 200 × 1 600 mm. Pri každom dekore vidíte cenu za m² aj cenu celej platne.'
      : seoDescription;
  const activeSlug = subCategory ? `${mainCategory}/${subCategory}` : mainCategory;

  return (
    <>
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        canonical={`https://orostone.sk/kategoria/${slug}${subCategory ? '/' + subCategory : ''}`}
        noindex={!isLoading && !hasProducts}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'E-Shop', item: 'https://orostone.sk/' },
            { '@type': 'ListItem', position: 2, name: category.name, item: `https://orostone.sk/kategoria/${slug}` },
            ...(subCategoryName ? [{ '@type': 'ListItem', position: 3, name: subCategoryName, item: `https://orostone.sk/kategoria/${slug}/${subCategory}` }] : []),
          ],
        }}
      />

      <PageHero
        breadcrumb={[
          { label: 'E-shop', to: '/' },
          subCategoryName ? { label: category.name, to: `/kategoria/${slug}` } : { label: category.name },
          ...(subCategoryName ? [{ label: subCategoryName }] : []),
        ]}
        title={subCategoryName ? `${category.name} — ${subCategoryName}` : category.name}
        lead={lead}
      />

      {/* ==================== COLOUR FILTER (links to the indexable subcategory URLs) ==================== */}
      {category.subcategories.length > 1 && (
        <div className="sticky top-16 z-30 border-y border-brand-line bg-brand-light lg:top-20">
          <Container>
            <nav
              className="-mx-[var(--os-edge)] flex items-center gap-2 overflow-x-auto overscroll-x-contain px-[var(--os-edge)] py-3 [scrollbar-width:none]"
              aria-label={isSintered ? 'Farby dekorov' : 'Podkategórie'}
            >
              {category.subcategories.map((sub) => {
                const active = sub.slug === activeSlug;
                const count = countFor(sub.slug);
                return (
                  <Link
                    key={sub.id}
                    to={`/kategoria/${sub.slug}`}
                    className={chipClass(active)}
                    aria-current={active ? 'page' : undefined}
                  >
                    {sub.name}
                    {count !== null && (
                      <span className={`tabular-nums ${active ? 'text-brand-light/60' : 'text-brand-muted'}`}>{count}</span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </Container>
        </div>
      )}

      {/* ==================== PRODUCT GRID or EMPTY STATE ==================== */}
      <Section tone="chalk" className="!pt-[clamp(40px,5vw,72px)]">
        <Container>
          {isLoading ? (
            <CatalogGridSkeleton />
          ) : hasProducts ? (
            <>
              <h2 className="sr-only">{subCategoryName ? `${subCategoryName} dekory` : isSintered ? 'Všetky dekory' : category.name}</h2>
              {usingFallback && <CatalogOfflineNotice />}
              {/* Product Grid — plain div (no framer-motion wrap to avoid 50-card reconciliation cost on INP) */}
              <div className={CATALOG_GRID}>
                {filteredProducts.map((product, i) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    priority={i < 4}
                    onAddToCart={() => (product.shopifyVariantId ? addItem(product.shopifyVariantId, 1) : undefined)}
                    inCart={isInCart(product.id)}
                    quantity={getItemQuantity(product.id)}
                  />
                ))}
              </div>

              {isSintered && (
                <div className="mt-[clamp(56px,6vw,88px)] flex flex-wrap items-center justify-between gap-x-10 gap-y-4 border-t border-brand-line pt-7">
                  <p className="font-light">
                    Ceny sú s DPH. Predávame celé platne, od {BULK_DISCOUNT.quantity} platní so zľavou{' '}
                    {BULK_DISCOUNT.discountPercent}&nbsp;%.
                  </p>
                  <div className="flex flex-wrap gap-x-8 gap-y-3">
                    <TextLink to="/cennik">Celý cenník</TextLink>
                    <TextLink to="/doprava">Doprava a platba</TextLink>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Empty State */
            <div className="grid max-w-[640px] justify-items-start gap-5 py-6">
              <h2 className="text-os-h2">Pripravujeme pre vás</h2>
              <p className="text-os-lead font-light text-brand-muted">
                Produkty v kategórii <strong className="font-semibold text-brand-dark">{category.name}</strong> budú čoskoro dostupné.
                Pracujeme na rozšírení našej ponuky — sledujte novinky.
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-x-8 gap-y-4">
                <ActionButton to="/kategoria/sintered-stone" arrow>
                  Prehliadnuť produkty
                </ActionButton>
                <TextLink to="/">Späť na e-shop</TextLink>
              </div>
            </div>
          )}
        </Container>
      </Section>

      {/* ==================== HELP WITH THE CHOICE ==================== */}
      {isSintered && (
        <Section tone="sand">
          <Container>
            <SectionHeader
              eyebrow="Výber dekoru"
              title="Neviete sa rozhodnúť?"
              lead="Pri pracovnej doske rozhoduje kresba vo veľkej ploche a svetlo vo vašej kuchyni. Toto vám pomôže vybrať."
            />
            <ul className="mt-[clamp(40px,5vw,64px)] grid gap-10 border-t border-brand-line pt-10 md:grid-cols-3 md:gap-12">
              {HELP.map((item) => (
                <li key={item.title} className="grid content-start justify-items-start gap-3">
                  <h3 className="text-os-h3">{item.title}</h3>
                  <p className="font-light text-brand-muted">{item.text}</p>
                  <TextLink to={item.link.to} className="mt-1">{item.link.label}</TextLink>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      <GoldBand od="kategoria" />
    </>
  );
};
