import React, { useState, useMemo, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { 
  Search, X, ShoppingBag, Grid3X3, LayoutGrid, 
  ChevronRight, Truck, ArrowUpDown, SlidersHorizontal, CheckCircle
} from 'lucide-react';
import { ShopProduct, ProductCategory } from '../constants';
import { useShopifyProducts } from '../hooks/useShopifyProducts';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { SEOHead, createBreadcrumbLD } from '../components/UI/SEOHead';

gsap.registerPlugin(ScrollTrigger);

// ===========================================
// CATEGORIES — dynamicky počítané z produktov
// ===========================================
const CATEGORY_LABELS: Record<ProductCategory, string> = {
  mramor: 'Mramor',
  granit: 'Granit',
  beton: 'Betón',
  drevo: 'Drevo',
  jednofarebne: 'Jednofarebné',
};

function buildCategories(products: ShopProduct[]) {
  return [
    { id: 'all' as const, name: 'Všetky produkty', count: products.length },
    ...Object.entries(CATEGORY_LABELS)
      .map(([id, name]) => ({
        id: id as ProductCategory,
        name,
        count: products.filter(p => p.category === id).length,
      }))
      .filter(cat => cat.count > 0),
  ];
}

// ===========================================
// PRODUCT CARD COMPONENT
// ===========================================
interface ProductCardProps {
  product: ShopProduct;
  compact?: boolean;
  onAddToCart: () => void;
  inCart: boolean;
  quantity: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  compact = false, 
  onAddToCart,
  inCart,
  quantity 
}) => {
  return (
    <div className="shop-product-card group bg-[#F9F9F7] rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
      <Link to={`/produkt/${product.id}`} className="block">
        {/* Image Container */}
        <div className={cn(
          "relative overflow-hidden",
          compact ? "aspect-square" : "aspect-[4/5]"
        )}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          
          {/* Stock Badge */}
          {product.inStock && (
            <div className="absolute top-3 left-3">
              <span className="inline-flex items-center gap-1.5 bg-green-500 text-white text-[10px] tracking-wider uppercase px-2.5 py-1 font-bold rounded-full shadow-sm">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                Skladom
              </span>
            </div>
          )}
          
          {/* Thickness Badge */}
          <div className="absolute top-3 right-3">
            <span className="bg-white/95 backdrop-blur-sm text-[10px] tracking-wider uppercase px-2.5 py-1.5 font-bold text-brand-dark rounded-full shadow-sm border border-black/5">
              {product.thickness}
            </span>
          </div>

          {/* Quick Add */}
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onAddToCart();
              }}
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-lg",
                inCart 
                  ? "bg-brand-gold text-brand-dark" 
                  : "bg-white text-brand-dark hover:bg-brand-gold"
              )}
              aria-label={inCart ? "V košíku" : "Pridať do košíka"}
            >
              {inCart ? (
                <span className="text-xs font-bold">{quantity}</span>
              ) : (
                <ShoppingBag size={18} strokeWidth={1.5} />
              )}
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className={cn("px-4 pt-4", compact ? "pb-3" : "pb-5")}>
          <h3 className={cn(
            "font-medium text-brand-dark mb-1 group-hover:text-brand-gold transition-colors",
            compact ? "text-sm" : "text-base"
          )}>
            {product.name}
          </h3>
          
          {!compact && (
            <p className="text-sm text-gray-500 mb-2 line-clamp-1">
              {product.description}
            </p>
          )}
          
          <div className="flex items-baseline gap-2">
            <span className="text-[11px] tracking-wider uppercase text-gray-400">Cena</span>
            <span className={cn(
              "font-semibold text-brand-dark",
              compact ? "text-sm" : "text-lg"
            )}>
              €{product.pricePerM2}
            </span>
            <span className="text-sm text-gray-400">/m²</span>
          </div>

          {/* Add to Cart CTA */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onAddToCart();
            }}
            className={cn(
              "mt-3 w-full py-2.5 rounded-lg text-[11px] tracking-wider uppercase font-semibold transition-all",
              inCart 
                ? "bg-brand-gold text-brand-dark" 
                : "bg-brand-dark text-white hover:bg-brand-gold hover:text-brand-dark"
            )}
          >
            {inCart ? `V košíku (${quantity})` : "Pridať do košíka"}
          </button>
        </div>
      </Link>
    </div>
  );
};

// ===========================================
// MAIN CATALOG COMPONENT
// ===========================================
export const ProductCatalog = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { addItem, isInCart } = useCart();
  const { products: SHOP_PRODUCTS } = useShopifyProducts();
  const CATEGORIES = useMemo(() => buildCategories(SHOP_PRODUCTS), [SHOP_PRODUCTS]);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([100, 400]);
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'name'>('name');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid');
  
  // Mobile filter drawer state
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  // Cart error notification
  const [cartError, setCartError] = useState<string | null>(null);
  
  // Sort popup state
  const [sortPopupOpen, setSortPopupOpen] = useState(false);

  // Price range bounds
  const MIN_PRICE = 100;
  const MAX_PRICE = 400;

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return SHOP_PRODUCTS
      .filter(p => {
        // Kategóriový filter
        if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
        // Textové vyhľadávanie
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          if (!p.name.toLowerCase().includes(query) && !p.description.toLowerCase().includes(query)) return false;
        }
        // Cenový rozsah
        if (p.pricePerM2 < priceRange[0] || p.pricePerM2 > priceRange[1]) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.pricePerM2 - b.pricePerM2;
        if (sortBy === 'price-desc') return b.pricePerM2 - a.pricePerM2;
        return a.name.localeCompare(b.name, 'sk');
      });
  }, [searchQuery, priceRange, sortBy, selectedCategory]);

  const hasActiveFilters = searchQuery !== '' || priceRange[0] > MIN_PRICE || priceRange[1] < MAX_PRICE || selectedCategory !== 'all';

  const clearFilters = () => {
    setSearchQuery('');
    setPriceRange([MIN_PRICE, MAX_PRICE]);
    setSortBy('name');
    setSelectedCategory('all');
  };

  const handleAddToCart = (product: ShopProduct) => {
    if (product.shopifyVariantId) {
      setCartError(null);
      addItem(product.shopifyVariantId, 1);
    } else {
      console.warn('Produkt nemá shopifyVariantId, nie je možné pridať do košíka:', product.id);
      setCartError('Tento produkt momentálne nie je možné pridať do košíka.');
      setTimeout(() => setCartError(null), 5000);
    }
  };

  useGSAP(() => {
    gsap.utils.toArray('.shop-product-card').forEach((card: any) => {
      gsap.fromTo(card,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          scrollTrigger: {
            trigger: card,
            start: 'top 90%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });
  }, { scope: containerRef, dependencies: [filteredProducts] });

  // ===========================================
  // SIDEBAR COMPONENT
  // ===========================================
  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={cn("space-y-8", mobile ? "" : "sticky top-36")}>
      {/* Categories */}
      <div>
        <h3 className="text-[11px] tracking-[0.2em] uppercase text-brand-gold font-bold mb-4">
          Kategórie
        </h3>
        <ul className="space-y-1">
          {CATEGORIES.map((cat) => (
            <li key={cat.id}>
              <button
                onClick={() => {
                  setSelectedCategory(cat.id);
                  if (mobile) setMobileFiltersOpen(false);
                }}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all text-left",
                  selectedCategory === cat.id
                    ? "bg-brand-gold/10 text-brand-dark font-semibold"
                    : "text-gray-600 hover:bg-gray-50 hover:text-brand-dark"
                )}
              >
                <span className="text-[13px]">{cat.name}</span>
                <span className={cn(
                  "text-[11px] px-2 py-0.5 rounded-full",
                  selectedCategory === cat.id ? "bg-brand-gold text-brand-dark" : "bg-gray-100 text-gray-500"
                )}>
                  {cat.count}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Price Filter */}
      <div>
        <h3 className="text-[11px] tracking-[0.2em] uppercase text-gray-400 font-bold mb-4">
          Cena za m²
        </h3>
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] font-medium text-brand-dark">€{priceRange[0]}</span>
            <span className="text-[11px] text-gray-400">—</span>
            <span className="text-[13px] font-medium text-brand-dark">€{priceRange[1]}</span>
          </div>
          <div className="relative h-1.5">
            <div className="absolute inset-0 bg-gray-200 rounded-full" />
            <div 
              className="absolute h-full bg-brand-gold rounded-full"
              style={{
                left: `${((priceRange[0] - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100}%`,
                right: `${100 - ((priceRange[1] - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100}%`
              }}
            />
            <input
              type="range"
              min={MIN_PRICE}
              max={MAX_PRICE}
              step={10}
              value={priceRange[0]}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (value < priceRange[1]) setPriceRange([value, priceRange[1]]);
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              style={{ zIndex: priceRange[0] > MAX_PRICE - 50 ? 5 : 3 }}
            />
            <input
              type="range"
              min={MIN_PRICE}
              max={MAX_PRICE}
              step={10}
              value={priceRange[1]}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (value > priceRange[0]) setPriceRange([priceRange[0], value]);
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              style={{ zIndex: 4 }}
            />
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-brand-gold rounded-full shadow-sm pointer-events-none"
              style={{ left: `calc(${((priceRange[0] - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100}% - 8px)` }}
            />
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-brand-gold rounded-full shadow-sm pointer-events-none"
              style={{ left: `calc(${((priceRange[1] - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100}% - 8px)` }}
            />
          </div>
        </div>
      </div>

      {/* Quick Info */}
      <div className="bg-gray-50 rounded-xl p-4 space-y-3">
        <div className="flex items-start gap-3">
          <Truck size={18} className="text-brand-gold flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-[13px] font-medium text-brand-dark">Doprava od €49</p>
            <p className="text-[11px] text-gray-500">Paušál na celé Slovensko</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-[13px] font-medium text-brand-dark">Expedícia do 5 dní</p>
            <p className="text-[11px] text-gray-500">Po prijatí platby</p>
          </div>
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-[12px] text-gray-500 hover:text-brand-dark border border-gray-200 rounded-lg transition-all"
        >
          <X size={14} />
          Zrušiť filtre
        </button>
      )}

      {/* Custom Project CTA */}
      <div className="bg-brand-dark rounded-xl p-5 text-white">
        <h4 className="text-[14px] font-semibold mb-2">Projekt na mieru?</h4>
        <p className="text-[12px] text-gray-300 mb-4">
          Potrebujete rezanie alebo špeciálne rozmery?
        </p>
        <Link to="/kontakt?openWizard=true" onClick={() => setMobileFiltersOpen(false)}>
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-gold text-brand-dark text-[11px] tracking-[0.1em] uppercase rounded-lg font-semibold hover:bg-white transition-colors">
            Nezáväzný dopyt
            <ChevronRight size={14} />
          </button>
        </Link>
      </div>
    </div>
  );

  return (
    <main ref={containerRef} className="bg-white min-h-screen">
      {/* Cart Error Toast */}
      <AnimatePresence>
        {cartError && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-red-600 text-white px-6 py-3 rounded-lg shadow-xl text-sm font-medium max-w-md text-center"
          >
            {cartError}
          </motion.div>
        )}
      </AnimatePresence>

      <SEOHead
        title="Všetky produkty | OROSTONE E-Shop"
        description="Kompletná ponuka sinterovaných kameňov — mramor, granit, betón a jednofarebné. Dosky 3200x1600mm s dopravou po celom Slovensku."
        structuredData={createBreadcrumbLD([
          { name: 'E-Shop', url: 'https://eshop.orostone.sk/' },
          { name: 'Všetky produkty', url: 'https://eshop.orostone.sk/#/vsetky-produkty' },
        ])}
      />
      {/* Page Header */}
      <div className="bg-gray-50 py-8 lg:py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-brand-dark mb-2">
            Všetky produkty
          </h1>
          <p className="text-gray-500">
            Kompletná ponuka sinterovaných kameňov a povrchov
          </p>
        </div>
      </div>

      {/* Products Section */}
      <section className="py-8 lg:py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex gap-8 lg:gap-12">
            
            {/* Products Area */}
            <div className="flex-1 min-w-0 w-full">
              
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-6 py-2">
                {/* Left: Filter icon + Product count */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setMobileFiltersOpen(true)}
                    className="relative p-2 text-gray-500 hover:text-brand-dark transition-colors"
                    aria-label="Filtre"
                  >
                    <SlidersHorizontal size={20} strokeWidth={1.5} />
                    {hasActiveFilters && (
                      <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-brand-gold rounded-full" />
                    )}
                  </button>
                  
                  <span className="text-[11px] tracking-wide text-gray-400 uppercase">
                    {filteredProducts.length} produktov
                  </span>
                </div>

                {/* Right: Sort + View */}
                <div className="flex items-center gap-1">
                  {/* Sort Popup */}
                  <div className="relative">
                    <button
                      onClick={() => setSortPopupOpen(!sortPopupOpen)}
                      className="p-2 text-gray-500 hover:text-brand-dark transition-colors"
                      aria-label="Zoradiť"
                    >
                      <ArrowUpDown size={20} strokeWidth={1.5} />
                    </button>
                    
                    <AnimatePresence>
                      {sortPopupOpen && (
                        <>
                          <div 
                            className="fixed inset-0 z-40" 
                            onClick={() => setSortPopupOpen(false)} 
                          />
                          <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-0 top-full mt-1 w-44 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-50"
                          >
                            {[
                              { value: 'name', label: 'Názov A-Z' },
                              { value: 'price-asc', label: 'Cena: najnižšia' },
                              { value: 'price-desc', label: 'Cena: najvyššia' },
                            ].map((option) => (
                              <button
                                key={option.value}
                                onClick={() => {
                                  setSortBy(option.value as typeof sortBy);
                                  setSortPopupOpen(false);
                                }}
                                className={cn(
                                  "w-full text-left px-4 py-2 text-[12px] tracking-wide transition-colors",
                                  sortBy === option.value 
                                    ? "text-brand-dark font-medium bg-gray-50" 
                                    : "text-gray-600 hover:bg-gray-50"
                                )}
                              >
                                {option.label}
                              </button>
                            ))}
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="w-px h-5 bg-gray-200 mx-1" />

                  {/* View Toggle */}
                  <button
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      "p-2 transition-colors",
                      viewMode === 'grid' ? "text-brand-dark" : "text-gray-400 hover:text-gray-600"
                    )}
                    aria-label="Grid view"
                  >
                    <LayoutGrid size={20} strokeWidth={1.5} />
                  </button>
                  <button
                    onClick={() => setViewMode('compact')}
                    className={cn(
                      "p-2 transition-colors",
                      viewMode === 'compact' ? "text-brand-dark" : "text-gray-400 hover:text-gray-600"
                    )}
                    aria-label="Compact view"
                  >
                    <Grid3X3 size={20} strokeWidth={1.5} />
                  </button>
                </div>
              </div>

              {/* Product Grid */}
              {filteredProducts.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                    <Search size={32} className="text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-brand-dark mb-3">Žiadne produkty</h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    Vášmu vyhľadávaniu nevyhovuje žiadny produkt.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="px-6 py-3 bg-brand-dark text-white rounded-full hover:bg-brand-gold hover:text-brand-dark transition-all font-medium"
                  >
                    Zrušiť filtre
                  </button>
                </div>
              ) : (
                <div className={cn(
                  "grid gap-6",
                  viewMode === 'grid' 
                    ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" 
                    : "grid-cols-2 sm:grid-cols-3 xl:grid-cols-4"
                )}>
                  {filteredProducts.map((product) => (
                    <ProductCard 
                      key={product.id}
                      product={product}
                      compact={viewMode === 'compact'}
                      onAddToCart={() => handleAddToCart(product)}
                      inCart={isInCart(product.id)}
                      quantity={0}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Filter Drawer */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setMobileFiltersOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed left-0 top-0 bottom-0 w-full max-w-sm bg-white z-50 overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-brand-dark">Filtre</h2>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-2 text-gray-500 hover:text-brand-dark"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6">
                <Sidebar mobile />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
};

export default ProductCatalog;
