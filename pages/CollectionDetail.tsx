import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ShareButton } from '../components/UI/ShareButton';
import { motion } from 'framer-motion';
import { COLLECTIONS, PRODUCTS } from '../constants';
import { TextReveal } from '../components/UI/TextReveal';
import { GalleryGrid } from '../components/Collections/GalleryGrid';
import { Button } from '../components/UI/Button';
import { useCollectionGallery } from '../hooks/useCollectionGallery';

export const CollectionDetail = () => {
  const { collectionId } = useParams();
  const collection = COLLECTIONS.find(c => c.id === collectionId);

  // Načítaj galériu obrázkov
  const { images, loading, error } = useCollectionGallery(collection?.galleryFolder);

  // Filtruj produkty z tejto kolekcie
  const collectionProducts = PRODUCTS.filter(p => p.collectionId === collectionId);

  if (!collection) {
    return (
      <div className="pt-32 text-center">
        <p className="text-gray-500">Kolekcia sa nenašla</p>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-24">
      {/* Breadcrumb */}
      <div className="container mx-auto px-6 mb-8 flex justify-between items-center">
        <Link
          to="/kolekcie"
          className="text-xs text-gray-500 hover:text-brand-dark uppercase tracking-widest flex items-center gap-2 group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Späť na kolekcie
        </Link>
        <ShareButton title={collection.name} variant="gold" />
      </div>

      {/* Hero sekcia */}
      <div className="container mx-auto px-6 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Obrázok kolekcie */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative aspect-[3/4] overflow-hidden rounded-orostone"
          >
            <img
              src={collection.heroImage}
              alt={collection.name}
              className="w-full h-full object-cover"
            />
            
            {/* Initial reveal curtain effect */}
            <motion.div 
              initial={{ scaleY: 1 }}
              animate={{ scaleY: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut", delay: 0.2 }}
              className="absolute inset-0 bg-[#F9F9F7] origin-bottom z-20 pointer-events-none"
            />
          </motion.div>

          {/* Info o kolekcii */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <div className="mb-4">
                <TextReveal variant="h1" className="text-5xl md:text-6xl lg:text-7xl font-sans font-bold mb-2">
                  {collection.name}
                </TextReveal>
              </div>
              <p className="font-sans font-light text-gray-600 text-lg leading-relaxed">
                {collection.description}
              </p>
            </div>

            {/* Štatistiky */}
            <div className="grid grid-cols-2 gap-6 py-8 border-y border-gray-200">
              <div>
                <div className="text-3xl font-sans font-bold text-brand-dark mb-1">
                  {collectionProducts.length}
                </div>
                <div className="font-sans text-xs font-bold uppercase tracking-widest text-gray-500">
                  Produktov v kolekcii
                </div>
              </div>
              <div>
                <div className="text-3xl font-sans font-bold text-brand-dark mb-1">
                  {images.length}
                </div>
                <div className="font-sans text-xs font-bold uppercase tracking-widest text-gray-500">
                  Fotografií v galérii
                </div>
              </div>
            </div>

            {/* CTA tlačidlá */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/kontakt" className="flex-1">
                <Button variant="primary" className="w-full">
                  Požiadať o cenovú ponuku
                </Button>
              </Link>
              <Link to="/vizualizator" className="flex-1">
                <Button variant="outline" className="w-full">
                  Vizualizovať
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Galéria obrázkov */}
      <div className="container mx-auto px-6 mb-24">
        <div className="mb-12 text-center">
          <TextReveal variant="h2" className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold mb-4">
            Galéria
          </TextReveal>
          <p className="text-gray-500 text-lg font-light">
            Inšpirácie, realizácie a detailné zábery z kolekcie {collection.name}
          </p>
        </div>

        {error && (
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        <GalleryGrid images={images} loading={loading} />
      </div>

      {/* Produkty z kolekcie */}
      {collectionProducts.length > 0 && (
        <div className="container mx-auto px-6">
          <div className="mb-12 text-center">
          <TextReveal variant="h2" className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold mb-4">
            Produkty z kolekcie
          </TextReveal>
          <p className="text-gray-500 text-lg font-light">
            Objavte všetky dizajny z kolekcie {collection.name}
          </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {collectionProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link to={`/produkt/${product.id}`} className="group block">
                  <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-4 rounded-orostone">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 backdrop-blur text-[10px] font-bold tracking-wider px-3 py-1 uppercase">
                        {product.bodyType}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                      <span className="bg-white text-brand-dark px-6 py-3 text-sm uppercase tracking-widest font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        Detail Produktu
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-sans font-bold text-brand-dark group-hover:text-brand-gold transition-colors mb-1">
                      {product.name}
                    </h3>
                    <p className="text-base text-gray-500 line-clamp-2 font-light mb-3">
                      {product.description}
                    </p>
                    {/* Technické informácie */}
                    <div className="space-y-2 pt-3 border-t border-gray-100">
                      <div className="flex items-start gap-2">
                        <span className="text-xs text-gray-400 uppercase tracking-wider min-w-[60px]">Hrúbka:</span>
                        <span className="text-xs text-brand-dark font-medium">{product.thickness.join(', ')}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-xs text-gray-400 uppercase tracking-wider min-w-[60px]">Povrch:</span>
                        <span className="text-xs text-brand-dark font-medium">{product.finish}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-xs text-gray-400 uppercase tracking-wider min-w-[60px]">Aplikácia:</span>
                        <span className="text-xs text-brand-dark font-medium">{product.application.join(', ')}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* CTA sekcia na konci */}
      <div className="container mx-auto px-6 mt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-brand-dark text-white p-12 text-center"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold mb-4">
            Zaujala vás kolekcia {collection.name}?
          </h2>
          <p className="text-gray-300 text-lg mb-8 font-light max-w-2xl mx-auto">
            Kontaktujte nás pre cenovú ponuku, technické konzultácie alebo objednajte si vzorky materiálu.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/kontakt">
              <Button variant="primary">Kontaktovať nás</Button>
            </Link>
            <Link to="/online-kalkulacka">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-brand-dark">
                Online kalkulačka
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
