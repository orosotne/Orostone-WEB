import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Check, 
  Share2,
  Minus,
  Plus,
  ShoppingBag,
  ChevronRight,
  ChevronLeft,
  X,
  ZoomIn,
  Maximize2,
  Search,
  Layers,
  GitMerge,
  Droplets,
  // Icons for ApplicationSection
  Utensils,
  LayoutGrid,
  Bath,
  Grid3x3,
  Building2,
  Building,
  Armchair,
  LucideIcon,
  // Icons for other sections
  Flame,
  Sun,
  Shield,
  Package,
  Clock,
  Truck,
  MapPin,
  FileText,
  MessageSquare,
  Download
} from 'lucide-react';
import { SHOP_PRODUCTS, ShopProduct } from '../constants';
import { Button } from '../components/UI/Button';
import { useCart, formatPrice } from '../context/CartContext';
import { cn } from '@/lib/utils';

// ===========================================
// HELPER: Calculate total price
// ===========================================
const calculateSlabPrice = (pricePerM2: number, dimensions: string): number => {
  // Parse dimensions like "3200 x 1600 mm"
  const match = dimensions.match(/(\d+)\s*x\s*(\d+)/i);
  if (match) {
    const width = parseInt(match[1]) / 1000; // Convert mm to m
    const height = parseInt(match[2]) / 1000;
    return pricePerM2 * width * height;
  }
  return pricePerM2 * 5.12; // Default 3200x1600 = 5.12m²
};

// ===========================================
// COMPONENT: Product Switcher
// ===========================================
interface ProductSwitcherProps {
  currentProductId: string;
  products: ShopProduct[];
}

const ProductSwitcher: React.FC<ProductSwitcherProps> = ({ currentProductId, products }) => {
  const navigate = useNavigate();

  const handleProductClick = (productId: string) => {
    // AJAX-like navigation - React Router handles this without full page reload
    navigate(`/produkt/${productId}`);
  };

  return (
    <div className="mb-8">
      <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase text-brand-gold mb-4">
        Ďalšie produkty
      </h3>
      <div className="grid grid-cols-4 gap-2">
        {products.map((product) => {
          const isActive = product.id === currentProductId;
          return (
            <button
              key={product.id}
              onClick={() => handleProductClick(product.id)}
              className={cn(
                "group flex flex-col items-center p-2 transition-all rounded-lg",
                isActive 
                  ? "ring-2 ring-brand-gold bg-brand-gold/5" 
                  : "ring-1 ring-gray-200 hover:ring-brand-gold/50 bg-white"
              )}
            >
              <div className="aspect-square w-full overflow-hidden bg-gray-100 mb-2 rounded-md">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <span className={cn(
                "text-[10px] font-medium text-center leading-tight line-clamp-2",
                isActive ? "text-brand-dark" : "text-gray-600 group-hover:text-brand-dark"
              )}>
                {product.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ===========================================
// COMPONENT: Bundle Selector
// ===========================================
interface BundleOption {
  quantity: number;
  discountPercent: number;
  label: string;
  isBestValue?: boolean;
}

const BUNDLE_OPTIONS: BundleOption[] = [
  { quantity: 1, discountPercent: 0, label: 'štandard' },
  { quantity: 2, discountPercent: 20, label: '-20%' },
  { quantity: 3, discountPercent: 30, label: '-30%', isBestValue: true },
];

interface BundleSelectorProps {
  pricePerSlab: number;
  selectedBundle: BundleOption;
  onBundleChange: (bundle: BundleOption) => void;
}

const BundleSelector: React.FC<BundleSelectorProps> = ({ 
  pricePerSlab, 
  selectedBundle, 
  onBundleChange 
}) => {
  const calculateBundlePrice = (bundle: BundleOption) => {
    const basePrice = pricePerSlab * bundle.quantity;
    const discount = bundle.discountPercent / 100;
    return basePrice * (1 - discount);
  };

  const calculateSavings = (bundle: BundleOption) => {
    const basePrice = pricePerSlab * bundle.quantity;
    const discountedPrice = calculateBundlePrice(bundle);
    return basePrice - discountedPrice;
  };

  return (
    <div className="mb-8">
      <h3 className="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400 mb-4">
        Počet platní
      </h3>
      <div className="space-y-3">
        {BUNDLE_OPTIONS.map((bundle) => {
          const isSelected = selectedBundle.quantity === bundle.quantity;
          const bundlePrice = calculateBundlePrice(bundle);
          const savings = calculateSavings(bundle);
          const pricePerSlabInBundle = bundlePrice / bundle.quantity;

          return (
            <button
              key={bundle.quantity}
              onClick={() => onBundleChange(bundle)}
              className={cn(
                "w-full p-4 border transition-all text-left relative",
                isSelected 
                  ? "border-brand-dark bg-white ring-1 ring-brand-dark" 
                  : "border-gray-200 bg-white hover:border-gray-400"
              )}
            >
              {/* Best Value Badge */}
              {bundle.isBestValue && (
                <span className="absolute -top-2.5 right-4 bg-brand-gold text-brand-dark text-[9px] font-bold tracking-wider uppercase px-2 py-0.5">
                  Najlepšia hodnota
                </span>
              )}

              <div className="flex items-start justify-between gap-4">
                {/* Left: Radio + Label */}
                <div className="flex items-start gap-3">
                  {/* Custom Radio */}
                  <div className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0",
                    isSelected ? "border-brand-dark" : "border-gray-300"
                  )}>
                    {isSelected && (
                      <div className="w-2.5 h-2.5 rounded-full bg-brand-dark" />
                    )}
                  </div>

                  {/* Bundle Info */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-brand-dark">
                        {bundle.quantity} {bundle.quantity === 1 ? 'platňa' : bundle.quantity < 5 ? 'platne' : 'platní'}
                      </span>
                      {bundle.discountPercent > 0 && (
                        <span className="text-emerald-600 text-sm font-semibold">
                          {bundle.label}
                        </span>
                      )}
                      {bundle.discountPercent === 0 && (
                        <span className="text-gray-400 text-sm">
                          — {bundle.label}
                        </span>
                      )}
                    </div>
                    {bundle.discountPercent > 0 && (
                      <div className="text-xs text-gray-500">
                        Cena za 1 platňu: {formatPrice(pricePerSlabInBundle)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Price */}
                <div className="text-right flex-shrink-0">
                  <div className="font-bold text-brand-dark text-lg">
                    {formatPrice(bundlePrice)}
                  </div>
                  {savings > 0 && (
                    <div className="text-emerald-600 text-xs font-medium">
                      Ušetríš: {formatPrice(savings)}
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ===========================================
// COMPONENT: Product Image Lightbox
// ===========================================
interface ProductLightboxProps {
  images: string[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
  productName: string;
}

const ProductLightbox: React.FC<ProductLightboxProps> = ({
  images,
  currentIndex,
  isOpen,
  onClose,
  onPrevious,
  onNext,
  productName,
}) => {
  // Keyboard navigation
  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') onPrevious();
      else if (e.key === 'ArrowRight') onNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onPrevious, onNext]);

  // Prevent body scroll when open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen || !images[currentIndex]) return null;

  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < images.length - 1;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
          onClick={onClose}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-50 text-white hover:text-brand-gold transition-colors p-2"
            aria-label="Zatvoriť"
          >
            <X size={32} />
          </button>

          {/* Image counter */}
          <div className="absolute top-6 left-6 z-50 text-white text-sm font-light">
            {currentIndex + 1} / {images.length}
          </div>

          {/* Previous button */}
          {hasPrevious && (
            <button
              onClick={(e) => { e.stopPropagation(); onPrevious(); }}
              className="absolute left-6 z-50 text-white hover:text-brand-gold transition-colors p-2"
              aria-label="Predchádzajúci obrázok"
            >
              <ChevronLeft size={48} />
            </button>
          )}

          {/* Next button */}
          {hasNext && (
            <button
              onClick={(e) => { e.stopPropagation(); onNext(); }}
              className="absolute right-6 z-50 text-white hover:text-brand-gold transition-colors p-2"
              aria-label="Ďalší obrázok"
            >
              <ChevronRight size={48} />
            </button>
          )}

          {/* Image */}
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="max-w-7xl max-h-[90vh] px-20"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[currentIndex]}
              alt={`${productName} - ${currentIndex + 1}`}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ===========================================
// COMPONENT: Material Perspectives Viewer
// ===========================================
interface PerspectiveTab {
  id: string;
  label: string;
  icon: React.ElementType;
  image: string;
  badge: string;
  description: string;
}

interface MaterialPerspectivesViewerProps {
  product: ShopProduct;
}

const MaterialPerspectivesViewer: React.FC<MaterialPerspectivesViewerProps> = ({ product }) => {
  const [activeTab, setActiveTab] = useState<string>('space');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Close lightbox on ESC key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsLightboxOpen(false);
    };
    if (isLightboxOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isLightboxOpen]);

  // Define perspectives with product-aware data
  const perspectives: PerspectiveTab[] = [
    {
      id: 'space',
      label: 'V priestore',
      icon: Maximize2,
      image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1200&auto=format&fit=crop',
      badge: 'Realizácia',
      description: `${product.name} v elegantnej kuchyni. Materiál dokonale ladí s modernými spotrebičmi a prináša pocit luxusu.`
    },
    {
      id: 'detail',
      label: 'Detail',
      icon: Search,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1200&auto=format&fit=crop',
      badge: 'Detail povrchu',
      description: `Žilkovanie je ${product.finish === 'Matný' ? 'jemné a subtílne' : 'výrazné a kontrastné'} – neprebíja nábytok, ale pri bližšom pohľade odhaľuje hĺbku prírodného kameňa.`
    },
    {
      id: 'edge',
      label: 'Hrana',
      icon: Layers,
      image: 'https://images.unsplash.com/photo-1615529162924-f8605388461d?q=80&w=1200&auto=format&fit=crop',
      badge: `${product.edgeStyle || 'Rovná hrana'}`,
      description: 'Investícia, ktorá sa vracia. Prémiový povrch zvyšuje hodnotu vašej nehnuteľnosti a robí dojem na každého, kto vojde.'
    },
    {
      id: 'joints',
      label: 'Spoje',
      icon: GitMerge,
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop',
      badge: 'Neviditeľné spoje',
      description: `Pri správnej inštalácii sú spoje takmer neviditeľné. Hrúbka ${product.thickness} umožňuje precízne napojenie bez viditeľných prechodov.`
    }
  ];

  const activePerspective = perspectives.find(p => p.id === activeTab) || perspectives[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="mt-8"
    >
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-brand-dark mb-2">
          Objavte krásu z každého uhla
        </h3>
        <p className="text-sm text-gray-500">
          Buďte si istí svojou voľbou ešte pred nákupom.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center gap-2 mb-4">
        {perspectives.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all",
                isActive 
                  ? "bg-brand-dark text-white" 
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              )}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Image Display */}
      <div 
        className="relative rounded-xl overflow-hidden bg-gray-900 cursor-pointer group"
        onClick={() => setIsLightboxOpen(true)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="aspect-[16/9] relative"
          >
            <img 
              src={activePerspective.image}
              alt={activePerspective.label}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {/* Badge */}
            <div className="absolute top-4 left-4">
              <span className="bg-white/90 backdrop-blur text-brand-dark text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded">
                {activePerspective.badge}
              </span>
            </div>

            {/* Zoom button */}
            <div className="absolute top-4 right-4">
              <button 
                className="w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-brand-dark hover:bg-white transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLightboxOpen(true);
                }}
              >
                <ZoomIn size={18} />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
              onClick={() => setIsLightboxOpen(false)}
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 w-full max-w-6xl mx-4 max-h-[90vh] flex flex-col"
            >
              {/* Close button */}
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="absolute -top-12 right-0 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <X size={20} />
              </button>

              {/* Image */}
              <div className="relative rounded-xl overflow-hidden bg-gray-900">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="relative"
                  >
                    <img 
                      src={activePerspective.image.replace('w=1200', 'w=2000')}
                      alt={activePerspective.label}
                      className="w-full h-auto max-h-[60vh] object-contain"
                    />
                    
                    {/* Badge in lightbox */}
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 backdrop-blur text-brand-dark text-xs font-bold uppercase tracking-wider px-4 py-2 rounded">
                        {activePerspective.badge}
                      </span>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Tab Navigation in lightbox */}
              <div className="flex justify-center gap-2 mt-6">
                {perspectives.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all",
                        isActive 
                          ? "bg-white text-brand-dark" 
                          : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
                      )}
                    >
                      <Icon size={16} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Description in lightbox */}
              <div className="text-center mt-4 px-4">
                <p className="text-white/80 text-base leading-relaxed max-w-2xl mx-auto">
                  {activePerspective.description}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ===========================================
// SECTION: Hero
// ===========================================
interface HeroSectionProps {
  product: ShopProduct;
  allProducts: ShopProduct[];
  selectedBundle: BundleOption;
  onBundleChange: (bundle: BundleOption) => void;
  onAddToCart: () => void;
  isInCart: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({ 
  product, 
  allProducts,
  selectedBundle,
  onBundleChange, 
  onAddToCart,
  isInCart 
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showAllImages, setShowAllImages] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const images = product.gallery && product.gallery.length > 0 
    ? product.gallery 
    : [product.image];

  const currentImage = images[selectedImageIndex];
  const singleSlabPrice = calculateSlabPrice(product.pricePerM2, product.dimensions);
  
  // Calculate bundle price with discount
  const bundleTotalPrice = singleSlabPrice * selectedBundle.quantity * (1 - selectedBundle.discountPercent / 100);

  // Lightbox handlers
  const openLightbox = (index?: number) => {
    if (index !== undefined) setSelectedImageIndex(index);
    setIsLightboxOpen(true);
  };
  const closeLightbox = () => setIsLightboxOpen(false);
  const goToPreviousLightbox = () => setSelectedImageIndex((prev) => Math.max(0, prev - 1));
  const goToNextLightbox = () => setSelectedImageIndex((prev) => Math.min(images.length - 1, prev + 1));

  // Carousel navigation
  const goToPrevious = () => {
    setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Show only first 2 thumbnails unless "Show more" is clicked
  const visibleThumbnails = showAllImages ? images : images.slice(0, 2);

  return (
    <section className="pt-8 pb-16 bg-gradient-to-br from-white via-[#FAFAF8] to-[#F5F5F0]">
      <div className="container mx-auto px-6">
        {/* Breadcrumb */}
        <div className="flex items-center justify-between mb-8">
          <nav className="flex items-center gap-2 text-xs text-gray-500">
            <Link to="/" className="hover:text-brand-dark transition-colors">Shop</Link>
            <ChevronRight size={12} />
            <Link to="/" className="hover:text-brand-dark transition-colors">Kolekcie</Link>
            <ChevronRight size={12} />
            <span className="text-brand-dark font-medium">{product.name}</span>
          </nav>
          <button className="text-xs text-gray-400 hover:text-brand-dark uppercase tracking-widest flex items-center gap-2 transition-colors">
            <Share2 size={14} /> Zdieľať
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left: Image Gallery */}
          <div className="hidden lg:block lg:order-1 lg:col-span-7 space-y-4">
            {/* Main Image with Carousel Arrows */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div 
                className="aspect-square bg-[#F5F5F3] overflow-hidden relative group rounded-xl cursor-pointer"
                onClick={() => openLightbox()}
              >
                {/* Main Image */}
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={selectedImageIndex}
                    src={currentImage} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </AnimatePresence>

                {/* Zoom indicator */}
                <div className="absolute bottom-4 right-4 w-10 h-10 bg-white/90 backdrop-blur rounded-lg flex items-center justify-center text-brand-dark opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn size={18} />
                </div>

                {/* Carousel Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    {/* Left Arrow */}
                    <button
                      onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur rounded-lg flex items-center justify-center text-brand-dark hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
                      aria-label="Predchádzajúci obrázok"
                    >
                      <ChevronRight size={20} className="rotate-180" />
                    </button>

                    {/* Right Arrow */}
                    <button
                      onClick={(e) => { e.stopPropagation(); goToNext(); }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur rounded-lg flex items-center justify-center text-brand-dark hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
                      aria-label="Ďalší obrázok"
                    >
                      <ChevronRight size={20} />
                    </button>

                    {/* Image Counter */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg text-[11px] tracking-wider text-brand-dark font-medium">
                      {selectedImageIndex + 1} / {images.length}
                    </div>
                  </>
                )}

                {/* Stock badge */}
                {product.inStock && (
                  <div className="absolute top-4 left-4 bg-emerald-600 text-white px-3 py-1 rounded-md text-[10px] uppercase tracking-widest font-medium">
                    Skladom
                  </div>
                )}
              </div>
            </motion.div>

            {/* Thumbnails - 2 visible + Show More button */}
            {images.length > 1 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-3"
              >
                <div className={cn(
                  "grid gap-3",
                  showAllImages ? "grid-cols-4" : "grid-cols-2"
                )}>
                  {visibleThumbnails.map((img, index) => {
                    // When showing all, use actual index; when showing limited, find actual index
                    const actualIndex = showAllImages ? index : images.indexOf(img);
                    return (
                      <button
                        key={actualIndex}
                        onClick={() => setSelectedImageIndex(actualIndex)}
                        className={cn(
                          "aspect-square bg-[#F5F5F3] overflow-hidden transition-all rounded-lg",
                          selectedImageIndex === actualIndex 
                            ? "ring-2 ring-brand-dark" 
                            : "ring-1 ring-gray-200 hover:ring-gray-400"
                        )}
                      >
                        <img 
                          src={img} 
                          alt={`${product.name} - ${actualIndex + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    );
                  })}
                </div>

                {/* Show More / Show Less Button */}
                {images.length > 2 && (
                  <button
                    onClick={() => setShowAllImages(!showAllImages)}
                    className="w-full py-3 border border-gray-300 rounded-lg text-sm font-medium text-brand-dark hover:border-brand-dark transition-colors flex items-center justify-center gap-2"
                  >
                    {showAllImages ? (
                      <>
                        <Minus size={16} />
                        Skryť
                      </>
                    ) : (
                      <>
                        <Plus size={16} />
                        Ukázať viac
                      </>
                    )}
                  </button>
                )}
              </motion.div>
            )}

            {/* Lightbox */}
            <ProductLightbox
              images={images}
              currentIndex={selectedImageIndex}
              isOpen={isLightboxOpen}
              onClose={closeLightbox}
              onPrevious={goToPreviousLightbox}
              onNext={goToNextLightbox}
              productName={product.name}
            />

            {/* Material Perspectives Viewer */}
            <MaterialPerspectivesViewer product={product} />
          </div>

          {/* Right: Product Info */}
          <div className="lg:order-2 lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {/* Collection badge */}
              {product.vendor && (
                <div className="mb-4">
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-brand-gold">
                    {product.vendor}
                  </span>
                </div>
              )}

              {/* Spec Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 bg-brand-dark text-brand-gold px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-wide uppercase">
                  <Layers size={14} />
                  {product.thickness}
                </span>
                <span className="inline-flex items-center gap-1.5 bg-brand-dark text-brand-gold px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-wide uppercase">
                  <Maximize2 size={14} />
                  {product.dimensions}
                </span>
                <span className="inline-flex items-center gap-1.5 bg-brand-dark text-brand-gold px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-wide uppercase">
                  <Droplets size={14} />
                  {product.finish || 'Leštený'}
                </span>
              </div>

              {/* Product Title */}
              <h1 className="text-4xl md:text-5xl font-sans font-bold text-brand-dark leading-tight mb-4">
                {product.name}
              </h1>

              {/* Short Description */}
              <p className="text-gray-600 font-light leading-relaxed mb-8 text-lg">
                {product.description}
              </p>

              {/* Key Specs Quick View */}
              <div className="grid grid-cols-2 gap-4 mb-8 pb-8 border-b border-gray-200">
                <div>
                  <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400 block mb-1">Rozmery</span>
                  <span className="text-brand-dark font-medium">{product.dimensions}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400 block mb-1">Hrúbka</span>
                  <span className="text-brand-dark font-medium">{product.thickness}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400 block mb-1">Povrch</span>
                  <span className="text-brand-dark font-medium">{product.finish || 'Leštený'}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400 block mb-1">Materiál</span>
                  <span className="text-brand-dark font-medium">{product.material || 'Sinterovaný kameň'}</span>
                </div>
              </div>

              {/* Mobile Image Gallery - visible only on small screens */}
              <div className="lg:hidden mb-8 space-y-3">
                {/* Main Image */}
                <div 
                  className="aspect-square bg-[#F5F5F3] overflow-hidden relative group rounded-xl cursor-pointer"
                  onClick={() => openLightbox()}
                >
                  <AnimatePresence mode="wait">
                    <motion.img 
                      key={selectedImageIndex}
                      src={currentImage} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </AnimatePresence>

                  {/* Zoom indicator */}
                  <div className="absolute bottom-4 right-4 w-10 h-10 bg-white/90 backdrop-blur rounded-lg flex items-center justify-center text-brand-dark opacity-0 group-hover:opacity-100 transition-opacity">
                    <ZoomIn size={18} />
                  </div>

                  {/* Carousel Navigation Arrows */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur rounded-lg flex items-center justify-center text-brand-dark hover:bg-white transition-colors"
                        aria-label="Predchádzajúci obrázok"
                      >
                        <ChevronRight size={20} className="rotate-180" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); goToNext(); }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur rounded-lg flex items-center justify-center text-brand-dark hover:bg-white transition-colors"
                        aria-label="Ďalší obrázok"
                      >
                        <ChevronRight size={20} />
                      </button>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg text-[11px] tracking-wider text-brand-dark font-medium">
                        {selectedImageIndex + 1} / {images.length}
                      </div>
                    </>
                  )}

                  {/* Stock badge */}
                  {product.inStock && (
                    <div className="absolute top-4 left-4 bg-emerald-600 text-white px-3 py-1 rounded-md text-[10px] uppercase tracking-widest font-medium">
                      Skladom
                    </div>
                  )}
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className={cn(
                    "grid gap-3",
                    showAllImages ? "grid-cols-4" : "grid-cols-2"
                  )}>
                    {visibleThumbnails.map((img, index) => {
                      const actualIndex = showAllImages ? index : images.indexOf(img);
                      return (
                        <button
                          key={actualIndex}
                          onClick={() => setSelectedImageIndex(actualIndex)}
                          className={cn(
                            "aspect-square bg-[#F5F5F3] overflow-hidden transition-all rounded-lg",
                            selectedImageIndex === actualIndex 
                              ? "ring-2 ring-brand-dark" 
                              : "ring-1 ring-gray-200 hover:ring-gray-400"
                          )}
                        >
                          <img 
                            src={img} 
                            alt={`${product.name} - ${actualIndex + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Show More / Show Less */}
                {images.length > 2 && (
                  <button
                    onClick={() => setShowAllImages(!showAllImages)}
                    className="w-full py-3 border border-gray-300 rounded-lg text-sm font-medium text-brand-dark hover:border-brand-dark transition-colors flex items-center justify-center gap-2"
                  >
                    {showAllImages ? (
                      <>
                        <Minus size={16} />
                        Skryť
                      </>
                    ) : (
                      <>
                        <Plus size={16} />
                        Ukázať viac
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Product Switcher */}
              <ProductSwitcher 
                currentProductId={product.id} 
                products={allProducts} 
              />

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-4xl font-bold text-brand-dark">
                    {formatPrice(bundleTotalPrice)}
                  </span>
                  {selectedBundle.quantity > 1 && (
                    <span className="text-sm text-emerald-600 font-semibold">
                      -{selectedBundle.discountPercent}%
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  {formatPrice(singleSlabPrice)} / doska • {formatPrice(product.pricePerM2)} / m²
                </div>
                {product.stockQuantity && (
                  <div className="text-sm text-gray-500 mt-1">
                    {product.stockQuantity} ks skladom
                  </div>
                )}
              </div>

              {/* Bundle Selector */}
              <BundleSelector 
                pricePerSlab={singleSlabPrice}
                selectedBundle={selectedBundle}
                onBundleChange={onBundleChange}
              />

              {/* CTAs */}
              <div className="space-y-3 mb-8">
                <button
                  onClick={onAddToCart}
                  className={cn(
                    "w-full py-4 px-8 text-sm font-semibold tracking-widest uppercase transition-all flex items-center justify-center gap-3",
                    isInCart 
                      ? "bg-emerald-600 text-white hover:bg-emerald-700" 
                      : "bg-brand-dark text-white hover:bg-black"
                  )}
                >
                  {isInCart ? (
                    <>
                      <Check size={18} />
                      V košíku
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={18} />
                      Pridať do košíka
                    </>
                  )}
                </button>
                <Link to="/kontakt?openWizard=true" className="block">
                  <button className="w-full py-4 px-8 text-sm font-semibold tracking-widest uppercase border border-gray-300 text-brand-dark hover:border-brand-gold hover:text-brand-gold transition-all flex items-center justify-center gap-3">
                    <Package size={18} />
                    Objednať vzorku
                  </button>
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-3">
                  <Truck size={16} className="text-brand-gold" />
                  <span>Expedícia do {product.deliveryTimeframe || '5 pracovných dní'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield size={16} className="text-brand-gold" />
                  <span>Záruka 24 mesiacov na materiál</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ===========================================
// SECTION: Product Story (Rich Description)
// ===========================================
interface ProductStorySectionProps {
  product: ShopProduct;
}

const ProductStorySection: React.FC<ProductStorySectionProps> = ({ product }) => {
  const rd = product.richDescription;
  if (!rd) return null;

  const highlightsTitle = rd.highlightsTitle || `Prečo si vybrať ${product.name}?`;

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          {/* Section Label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-[11px] font-bold tracking-[0.2em] uppercase text-brand-gold mb-8">
              O produkte
            </h2>
          </motion.div>

          {/* Intro Paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg md:text-xl text-gray-700 leading-relaxed mb-12 border-l-2 border-brand-gold pl-6"
          >
            {rd.intro}
          </motion.p>

          {/* Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <h3 className="text-lg font-bold text-brand-dark mb-6">
              {highlightsTitle}
            </h3>
            <ul className="space-y-3">
              {rd.highlights.map((highlight, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.07 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-5 h-5 rounded-full bg-brand-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check size={12} className="text-brand-gold" />
                  </div>
                  <span className="text-gray-700 leading-relaxed">{highlight}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Closing Paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-base md:text-lg text-gray-600 leading-relaxed italic"
          >
            {rd.closing}
          </motion.p>
        </div>
      </div>
    </section>
  );
};

// ===========================================
// SECTION: Technical Overview
// ===========================================
interface TechnicalOverviewProps {
  product: ShopProduct;
}

const TechnicalOverview: React.FC<TechnicalOverviewProps> = ({ product }) => {
  const specs = [
    { label: 'Materiál', value: product.material || 'Sinterovaný kameň' },
    { label: 'Hrúbka', value: product.thickness },
    { label: 'Rozmery', value: product.dimensions },
    { label: 'Povrch', value: product.finish || '—' },
    { label: 'Hrana', value: product.edgeStyle || 'Rovná hrana' },
    { label: 'Hmotnosť', value: product.weight ? `${product.weight} kg` : '—' },
    { label: 'Krajina pôvodu', value: product.countryOfOrigin || '—' },
    { label: 'SKU', value: product.sku || '—' },
  ];

  return (
    <section className="py-16 bg-[#F9F9F7]">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-[11px] font-bold tracking-[0.2em] uppercase text-brand-gold mb-8">
            Technické parametre
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200">
            {specs.map((spec, index) => (
              <div 
                key={index}
                className="bg-white p-6"
              >
                <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400 block mb-2">
                  {spec.label}
                </span>
                <span className="text-lg font-medium text-brand-dark">
                  {spec.value}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ===========================================
// SECTION: Application & Usage
// ===========================================
interface ApplicationSectionProps {
  product: ShopProduct;
}

// Icon map for each application type
const applicationIcons: Record<string, LucideIcon> = {
  'Kuchynské dosky': Utensils,
  'Ostrovčeky': LayoutGrid,
  'Kúpeľne': Bath,
  'Obklad stien': Grid3x3,
  'Komerčné interiéry': Building2,
  'Fasády': Building,
  'Podlahy': Layers,
  'Nábytok': Armchair,
};

const ApplicationSection: React.FC<ApplicationSectionProps> = ({ product }) => {
  const allApplications = [
    'Kuchynské dosky',
    'Ostrovčeky',
    'Kúpeľne',
    'Obklad stien',
    'Komerčné interiéry',
    'Fasády',
    'Podlahy',
    'Nábytok',
  ];

  const productApplications = product.applications || ['Kuchynské dosky', 'Kúpeľne', 'Obklad stien'];

  return (
    <section className="py-16">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-[11px] font-bold tracking-[0.2em] uppercase text-brand-gold mb-12">
            Vhodné použitie
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-6 lg:gap-4">
            {allApplications.map((app, index) => {
              const isSupported = productApplications.includes(app);
              const Icon = applicationIcons[app] || Layers;
              return (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className={cn(
                    "flex flex-col items-center text-center transition-all",
                    !isSupported && "opacity-40"
                  )}
                >
                  {/* Circular icon container */}
                  <div className={cn(
                    "w-20 h-20 lg:w-24 lg:h-24 rounded-full flex items-center justify-center mb-4 transition-colors",
                    isSupported 
                      ? "bg-gray-100" 
                      : "bg-gray-50"
                  )}>
                    <Icon 
                      size={36} 
                      strokeWidth={1.5}
                      className={cn(
                        "transition-colors",
                        isSupported ? "text-brand-dark" : "text-gray-300"
                      )} 
                    />
                  </div>
                  {/* Label */}
                  <span className={cn(
                    "text-sm font-medium leading-tight",
                    isSupported ? "text-brand-dark" : "text-gray-400"
                  )}>
                    {app}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ===========================================
// SECTION: Resistance Parameters
// ===========================================
interface ResistanceParametersProps {
  product: ShopProduct;
}

const ResistanceParameters: React.FC<ResistanceParametersProps> = ({ product }) => {
  const parameters = [
    {
      icon: Flame,
      title: 'Odolnosť voči teplu',
      value: product.heatResistance || 'Do 300°C',
      description: 'Horúce nádoby môžete položiť priamo na povrch'
    },
    {
      icon: Sun,
      title: 'UV stabilita',
      value: product.uvResistance ? 'Áno' : 'Nie',
      description: 'Farba zostáva nemenná aj pri priamom slnečnom žiarení'
    },
    {
      icon: Shield,
      title: 'Odolnosť voči škrabancom',
      value: product.scratchResistance || 'Mohs 7+',
      description: 'Tvrdosť blízka diamantu'
    },
    {
      icon: Droplets,
      title: 'Odolnosť voči škvrnám',
      value: product.stainResistance || 'Nenasiakavý',
      description: `Porozita ${product.porosity || '< 0.1%'}`
    },
  ];

  return (
    <section className="py-16 bg-brand-dark text-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-[11px] font-bold tracking-[0.2em] uppercase text-brand-gold mb-12">
            Odolnosť materiálu
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {parameters.map((param, index) => {
              const Icon = param.icon;
              return (
                <div key={index} className="space-y-4">
                  <div className="w-12 h-12 border border-brand-gold/30 flex items-center justify-center">
                    <Icon size={24} className="text-brand-gold" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-white/60 mb-1">{param.title}</h3>
                    <p className="text-xl font-bold text-white mb-2">{param.value}</p>
                    <p className="text-sm text-white/50">{param.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ===========================================
// SECTION: Logistics & Delivery
// ===========================================
interface LogisticsSectionProps {
  product: ShopProduct;
}

const LogisticsSection: React.FC<LogisticsSectionProps> = ({ product }) => {
  const logistics = [
    {
      icon: Package,
      label: 'Dostupnosť',
      value: product.inStock 
        ? `Skladom${product.stockQuantity ? ` (${product.stockQuantity} ks)` : ''}`
        : 'Na objednávku'
    },
    {
      icon: Clock,
      label: 'Expedícia',
      value: product.deliveryTimeframe || 'Do 5 pracovných dní'
    },
    {
      icon: Truck,
      label: 'Doprava',
      value: 'Paletová preprava'
    },
    {
      icon: MapPin,
      label: 'Balenie',
      value: product.packagingInfo || 'Drevená paleta, ochranná fólia'
    },
  ];

  return (
    <section className="py-16 bg-[#F9F9F7]">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-[11px] font-bold tracking-[0.2em] uppercase text-brand-gold mb-8">
            Dodanie a logistika
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {logistics.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="bg-white p-6 border border-gray-200">
                  <Icon size={20} className="text-brand-gold mb-4" />
                  <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400 block mb-2">
                    {item.label}
                  </span>
                  <span className="text-brand-dark font-medium">
                    {item.value}
                  </span>
                </div>
              );
            })}
          </div>

          {product.handlingNotes && (
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 text-amber-800 text-sm">
              <strong>Upozornenie:</strong> {product.handlingNotes}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

// ===========================================
// SECTION: Architect Block (Samples & Downloads)
// ===========================================
interface ArchitectBlockProps {
  product: ShopProduct;
}

const ArchitectBlock: React.FC<ArchitectBlockProps> = ({ product }) => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="border border-gray-200 bg-white">
            <div className="p-8 border-b border-gray-200">
              <h2 className="text-[11px] font-bold tracking-[0.2em] uppercase text-brand-gold mb-2">
                Pre architektov a dizajnérov
              </h2>
              <p className="text-gray-600">
                Materiály a podpora pre profesionálov
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200">
              {/* Left: Sample Request */}
              <div className="p-8">
                <h3 className="font-bold text-brand-dark mb-4">Vzorky materiálu</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Objednajte si fyzickú vzorku pre presné posúdenie farby, textúry a povrchu.
                </p>
                <Link to="/kontakt?openWizard=true">
                  <button className="flex items-center gap-3 px-6 py-3 bg-brand-dark text-white text-sm font-semibold tracking-wider uppercase hover:bg-black transition-colors">
                    <Package size={16} />
                    Objednať vzorku
                  </button>
                </Link>
              </div>

              {/* Right: Downloads */}
              <div className="p-8">
                <h3 className="font-bold text-brand-dark mb-4">Technická dokumentácia</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors group">
                    <span className="flex items-center gap-3 text-sm text-brand-dark">
                      <FileText size={16} className="text-brand-gold" />
                      Technický list (TDS)
                    </span>
                    <Download size={14} className="text-gray-400 group-hover:text-brand-dark" />
                  </button>
                  <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors group">
                    <span className="flex items-center gap-3 text-sm text-brand-dark">
                      <FileText size={16} className="text-brand-gold" />
                      BIM / CAD Textúry (High-Res)
                    </span>
                    <Download size={14} className="text-gray-400 group-hover:text-brand-dark" />
                  </button>
                </div>
              </div>
            </div>

            {/* Contact CTA */}
            <div className="p-8 bg-gray-50 border-t border-gray-200">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h4 className="font-medium text-brand-dark mb-1">Potrebujete konzultáciu?</h4>
                  <p className="text-sm text-gray-600">Poradíme s výberom materiálu pre váš projekt.</p>
                </div>
                <Link to="/kontakt">
                  <button className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-brand-dark text-sm font-semibold tracking-wider uppercase hover:border-brand-gold hover:text-brand-gold transition-colors">
                    <MessageSquare size={16} />
                    Kontaktovať
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ===========================================
// SECTION: Product Schema (JSON-LD for SEO)
// ===========================================
interface ProductSchemaProps {
  product: ShopProduct;
  totalPrice: number;
}

const ProductSchema: React.FC<ProductSchemaProps> = ({ product, totalPrice }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.seoDescription || 
      `${product.name} je prémiový sinterovaný kameň s rozmermi ${product.dimensions}. Tento ${product.material || 'sinterovaný kameň'} s povrchom ${product.finish || 'leštený'} je ideálny pre ${(product.applications || ['kuchyne', 'kúpeľne']).slice(0, 3).join(', ').toLowerCase()}. Materiál ponúka výnimočnú odolnosť voči teplu (${product.heatResistance || 'do 300°C'}), škrabancom a škvrnám.`,
    "image": product.gallery && product.gallery.length > 0 ? product.gallery : [product.image],
    "sku": product.sku || product.id,
    "brand": {
      "@type": "Brand",
      "name": product.vendor || "OROSTONE"
    },
    "manufacturer": {
      "@type": "Organization",
      "name": "OROSTONE"
    },
    "material": product.material || "Sinterovaný kameň",
    "size": product.dimensions,
    "weight": product.weight ? `${product.weight} kg` : undefined,
    "countryOfOrigin": product.countryOfOrigin || "Slovensko",
    "offers": {
      "@type": "Offer",
      "url": `https://eshop.orostone.sk/produkt/${product.id}`,
      "priceCurrency": "EUR",
      "price": totalPrice.toFixed(2),
      "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      "availability": product.inStock 
        ? "https://schema.org/InStock" 
        : "https://schema.org/PreOrder",
      "itemCondition": "https://schema.org/NewCondition",
      "seller": {
        "@type": "Organization",
        "name": "OROSTONE s.r.o."
      },
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingDestination": {
          "@type": "DefinedRegion",
          "addressCountry": "SK"
        },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "handlingTime": {
            "@type": "QuantitativeValue",
            "minValue": 1,
            "maxValue": 5,
            "unitCode": "d"
          }
        }
      }
    },
    "additionalProperty": [
      {
        "@type": "PropertyValue",
        "name": "Hrúbka",
        "value": product.thickness
      },
      {
        "@type": "PropertyValue",
        "name": "Povrch",
        "value": product.finish || "Leštený"
      },
      {
        "@type": "PropertyValue",
        "name": "Odolnosť voči teplu",
        "value": product.heatResistance || "Do 300°C"
      },
      {
        "@type": "PropertyValue",
        "name": "Tvrdosť",
        "value": product.scratchResistance || "Mohs 7+"
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

// ===========================================
// MAIN COMPONENT: ShopProductDetail
// ===========================================
export const ShopProductDetail: React.FC = () => {
  const { id } = useParams();
  const { addItem, isInCart } = useCart();
  // Default to 2 platne for higher AOV
  const [selectedBundle, setSelectedBundle] = useState<BundleOption>(BUNDLE_OPTIONS[1]);

  const product = useMemo(() => 
    SHOP_PRODUCTS.find(p => p.id === id), 
    [id]
  );

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-brand-dark mb-4">Produkt nenájdený</h1>
          <p className="text-gray-600 mb-8">Požadovaný produkt neexistuje alebo bol odstránený.</p>
          <Link to="/">
            <Button variant="primary">
              <ArrowLeft size={16} />
              Späť na shop
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    // Calculate surface area from dimensions
    const match = product.dimensions.match(/(\d+)\s*x\s*(\d+)/i);
    let surfaceArea = 5.12; // Default
    if (match) {
      const width = parseInt(match[1]) / 1000;
      const height = parseInt(match[2]) / 1000;
      surfaceArea = width * height;
    }

    // Bundle name for cart display
    const bundleName = selectedBundle.quantity > 1 
      ? `${product.name} (${selectedBundle.quantity}x, -${selectedBundle.discountPercent}%)`
      : product.name;

    addItem({
      productId: product.id,
      name: bundleName,
      slug: product.id,
      image: product.image,
      price: product.pricePerM2,
      quantity: selectedBundle.quantity,
      dimensions: product.dimensions,
      thickness: product.thickness,
      surfaceArea: surfaceArea,
      discountPercent: selectedBundle.discountPercent,
    });
  };

  return (
    <main className="bg-white min-h-screen">
      {/* Section 1: Hero */}
      <HeroSection 
        product={product}
        allProducts={SHOP_PRODUCTS}
        selectedBundle={selectedBundle}
        onBundleChange={setSelectedBundle}
        onAddToCart={handleAddToCart}
        isInCart={isInCart(product.id)}
      />

      {/* Section 2: Product Story (Rich Description) */}
      <ProductStorySection product={product} />

      {/* Section 3: Technical Overview */}
      <TechnicalOverview product={product} />

      {/* Section 4: Application & Usage */}
      <ApplicationSection product={product} />

      {/* Section 5: Resistance Parameters */}
      <ResistanceParameters product={product} />

      {/* Section 6: Logistics & Delivery */}
      <LogisticsSection product={product} />

      {/* Section 7: Architect Block */}
      <ArchitectBlock product={product} />

      {/* JSON-LD Structured Data for SEO (invisible to users, visible to Google) */}
      <ProductSchema product={product} totalPrice={calculateSlabPrice(product.pricePerM2, product.dimensions)} />
    </main>
  );
};

export default ShopProductDetail;
