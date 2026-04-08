import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, ArrowRight, Package } from 'lucide-react';
import {
  getVisibleCategories,
  getProductColorCategory,
  sortSinteredByColorThenName,
  type ColorCategory,
} from '../components/Eshop/EshopMegaMenu';
import { useShopifyProducts } from '../hooks/useShopifyProducts';
import { useCart } from '../context/CartContext';
import { ProductCard } from './ProductCatalog';
import { SEOHead } from '../components/UI/SEOHead';

// ===========================================
// CATEGORY PAGE
// ===========================================

export const CategoryPage: React.FC = () => {
  const { slug, subCategory } = useParams<{ slug: string; subCategory?: string }>();
  const { products, isLoading } = useShopifyProducts(50, { shopifyOnly: true });
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

  // Filter products by category slug a voliteľne podľa farebnej podkategórie
  const filteredProducts = useMemo(() => {
    // Filter by main category
    let result = products.filter((p) => p.category === mainCategory);
    
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
  }, [products, mainCategory, subCategory]);

  // Category not found (neznámy slug, skrytá kategória, neplatná subkategória)
  if (!category || !isValidSubCategory) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <SEOHead
          title="Kategória nenájdená | OROSTONE E-Shop"
          description="Kategória s týmto názvom neexistuje alebo bola presunutá."
          noindex={true}
        />
        <div className="text-center px-6">
          <h1 className="text-2xl font-bold text-brand-dark mb-3">
            Kategória nenájdená
          </h1>
          <p className="text-gray-500 mb-6">
            Kategória s týmto názvom neexistuje.
          </p>
          <Link
            to="/kategoria/sintered-stone"
            className="inline-flex items-center gap-2 bg-brand-dark text-white px-6 py-3 rounded-lg text-sm tracking-wider uppercase font-semibold hover:bg-brand-gold hover:text-brand-dark transition-all"
          >
            Všetky produkty
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  const hasProducts = filteredProducts.length > 0;

  return (
    <>
      <SEOHead
        title={`${category.name} | OROSTONE E-Shop`}
        description={category.description || `${category.name} — prémiové produkty od OROSTONE.`}
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

      {/* ==================== HERO ==================== */}
      <section
        className="relative h-[320px] md:h-[400px] overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #F5E9B8 0%, #ECD488 50%, #C9A85C 100%)' }}
      >
        {/* Dark overlay at bottom for text readability */}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"
          aria-hidden
        />

        {/* Content */}
        <div className="relative h-full container mx-auto px-6 lg:px-8 flex flex-col justify-end pb-10 md:pb-14">
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase text-white/60 mb-4"
          >
            <Link to="/" className="hover:text-white transition-colors">
              E-Shop
            </Link>
            <ChevronRight size={12} />
            <Link to={`/kategoria/${category.slug}`} className="hover:text-white transition-colors">
              {category.name}
            </Link>
            {subCategoryName && (
              <>
                <ChevronRight size={12} />
                <span className="text-white">{subCategoryName}</span>
              </>
            )}
          </motion.nav>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-3"
          >
            {subCategoryName ? `${category.name} — ${subCategoryName}` : category.name}
          </motion.h1>

          {/* Description */}
          {category.description && (
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="text-base md:text-lg text-white/80 max-w-xl"
            >
              {category.description}
            </motion.p>
          )}

          {/* Product count */}
          {hasProducts && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-3 text-[11px] tracking-[0.15em] uppercase text-white/50"
            >
              {filteredProducts.length} {filteredProducts.length === 1 ? 'produkt' : filteredProducts.length < 5 ? 'produkty' : 'produktov'}
            </motion.p>
          )}
        </div>
      </section>

      {/* ==================== PRODUCT GRID or EMPTY STATE ==================== */}
      <section className="container mx-auto px-6 lg:px-8 py-12 md:py-16">
        {isLoading ? (
          /* Loading skeleton — 8 tiles to approximate real grid height (reduces CLS vs 4 placeholders) */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-2xl animate-pulse">
                <div className="aspect-[4/5]" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-10 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : hasProducts ? (
          /* Product Grid */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
          >
            {filteredProducts.map((product) => {
              const inCart = isInCart(product.id);
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={() => {
                    if (product.shopifyVariantId) {
                      addItem(product.shopifyVariantId, 1);
                    }
                  }}
                  inCart={inCart}
                  quantity={getItemQuantity(product.id)}
                />
              );
            })}
          </motion.div>
        ) : (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col items-center justify-center py-16 md:py-24 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
              <Package size={36} strokeWidth={1.2} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-brand-dark mb-3">
              Pripravujeme pre vás
            </h2>
            <p className="text-gray-500 max-w-md mb-8 leading-relaxed">
              Produkty v kategórii <strong>{category.name}</strong> budú čoskoro dostupné.
              Pracujeme na rozšírení našej ponuky — sledujte novinky.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/kategoria/sintered-stone"
                className="inline-flex items-center justify-center gap-2 bg-brand-dark text-white px-6 py-3 rounded-lg text-[11px] tracking-wider uppercase font-semibold hover:bg-brand-gold hover:text-brand-dark transition-all"
              >
                Prehliadnuť produkty
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 border border-gray-300 text-brand-dark px-6 py-3 rounded-lg text-[11px] tracking-wider uppercase font-semibold hover:border-brand-dark transition-all"
              >
                Späť na e-shop
              </Link>
            </div>
          </motion.div>
        )}
      </section>
    </>
  );
};
