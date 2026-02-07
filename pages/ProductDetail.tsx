import React, { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Check, Maximize2, Layers, Download, FileText, Share2 } from 'lucide-react';
import { PRODUCTS, COLLECTIONS } from '../constants';
import { Button } from '../components/UI/Button';
import { motion } from 'framer-motion';
import { TextReveal } from '../components/UI/TextReveal';

export const ProductDetail = () => {
  const { id } = useParams();
  const product = PRODUCTS.find(p => p.id === id);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);

  if (!product) return <div className="pt-32 text-center">Produkt sa nenašiel</div>;

  const collection = COLLECTIONS.find(c => c.id === product.collectionId);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!imageRef.current) return;
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div className="pt-24 pb-24">
      {/* Breadcrumb */}
      <div className="container mx-auto px-6 mb-8 flex justify-between items-center">
        <Link to="/kolekcie" className="text-xs text-gray-500 hover:text-brand-dark uppercase tracking-widest flex items-center gap-2 group">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform"/> Späť na kolekcie
        </Link>
        <button className="text-xs text-gray-400 hover:text-brand-gold uppercase tracking-widest flex items-center gap-2">
          <Share2 size={14} /> Zdieľať
        </button>
      </div>

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Gallery Side with Reveal Animation */}
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative"
            >
              <div
                ref={imageRef}
                className="aspect-[3/4] bg-gray-100 overflow-hidden relative cursor-crosshair group rounded-orostone"
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
                onMouseMove={handleMouseMove}
              >
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-opacity duration-300"
                  style={{ opacity: isZoomed ? 0 : 1 }}
                />
                
                {/* Magnified View */}
                <div 
                  className="absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-300"
                  style={{
                    opacity: isZoomed ? 1 : 0,
                    backgroundImage: `url(${product.image})`,
                    backgroundPosition: `${mousePos.x}% ${mousePos.y}%`,
                    backgroundSize: '250%' // Zoom level
                  }}
                />

                <div className={`absolute bottom-6 right-6 bg-white/90 backdrop-blur px-4 py-2 text-[10px] uppercase tracking-widest transition-opacity duration-300 ${isZoomed ? 'opacity-0' : 'opacity-100'}`}>
                  <Maximize2 size={14} className="inline mr-2"/>
                  Priblížiť
                </div>
              </div>
              
              {/* Initial reveal curtain effect */}
              <motion.div 
                initial={{ scaleY: 1 }}
                animate={{ scaleY: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut", delay: 0.2 }}
                className="absolute inset-0 bg-[#F9F9F7] origin-bottom z-20 pointer-events-none"
              />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-3 gap-4"
            >
               {/* Thumbnails */}
               {[1, 2, 3].map((i) => (
                 <div key={i} className="aspect-[3/4] bg-gray-100 cursor-pointer border border-transparent hover:border-brand-gold transition-all overflow-hidden group rounded-orostone">
                    <img src={`https://picsum.photos/600/400?random=${product.id}${i}`} className="w-full h-full object-cover opacity-80 hover:opacity-100 hover:scale-110 transition-all duration-500"/>
                 </div>
               ))}
            </motion.div>
          </div>

          {/* Info Side */}
          <div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.4 }}
              className="flex items-center gap-4 mb-4"
            >
              <span className="bg-brand-gold/10 text-brand-gold px-3 py-1 text-[10px] font-bold tracking-widest uppercase">{collection?.name} Collection</span>
              <span className="text-gray-400 text-[10px] font-bold tracking-widest uppercase">{product.bodyType}</span>
            </motion.div>
            
            <div className="mb-6">
              <TextReveal variant="h1" className="text-5xl md:text-6xl lg:text-7xl font-sans font-bold text-brand-dark leading-[1]">
                {product.name}
              </TextReveal>
            </div>
            
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="font-sans font-light text-lg text-gray-600 leading-relaxed mb-8 border-l-2 border-brand-gold pl-6"
            >
              {product.description}
            </motion.p>

            {/* Technical Specs Table */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-[#F9F9F7] p-8 border border-gray-200 mb-10 rounded-orostone"
            >
              <h3 className="font-sans text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                <Layers size={16} /> Technické Parametre
              </h3>
              <div className="grid grid-cols-2 gap-y-6">
                <div className="border-b border-gray-200 pb-2">
                   <span className="font-sans text-xs text-gray-400 block mb-1 uppercase tracking-wider">Hrúbka</span>
                   <span className="font-sans font-bold text-brand-dark">{product.thickness.join(', ')}</span>
                </div>
                <div className="border-b border-gray-200 pb-2">
                   <span className="font-sans text-xs text-gray-400 block mb-1 uppercase tracking-wider">Povrch</span>
                   <span className="font-sans font-bold text-brand-dark">{product.finish}</span>
                </div>
                <div className="border-b border-gray-200 pb-2">
                   <span className="font-sans text-xs text-gray-400 block mb-1 uppercase tracking-wider">Formát dosky</span>
                   <span className="font-sans font-bold text-brand-dark">3200 x 1600 mm</span>
                </div>
                <div className="border-b border-gray-200 pb-2">
                   <span className="font-sans text-xs text-gray-400 block mb-1 uppercase tracking-wider">Aplikácia</span>
                   <span className="font-sans font-bold text-brand-dark">{product.application.join(', ')}</span>
                </div>
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
               <Link to="/kontakt?openWizard=true" className="flex-1">
                 <Button variant="primary" className="w-full !py-5 shadow-xl shadow-brand-gold/10">Mám záujem o tento dekor</Button>
               </Link>
               <Button variant="outline" className="flex-1 !py-5">Objednať fyzickú vzorku</Button>
            </motion.div>

            {/* Architect Downloads Section */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="border border-dashed border-gray-300 p-6 bg-white rounded-orostone"
            >
              <h4 className="text-xs font-sans font-bold uppercase tracking-widest mb-4 text-gray-400">Pre Architektov & Dizajnérov</h4>
              <div className="space-y-3">
                <button className="flex items-center justify-between w-full p-3 bg-gray-50 hover:bg-gray-100 transition-colors text-sm group">
                  <span className="flex items-center gap-3 text-brand-dark font-sans font-bold">
                    <FileText size={16} className="text-brand-gold"/>
                    Technický list (TDS)
                  </span>
                  <Download size={14} className="text-gray-400 group-hover:text-brand-dark"/>
                </button>
                <button className="flex items-center justify-between w-full p-3 bg-gray-50 hover:bg-gray-100 transition-colors text-sm group">
                  <span className="flex items-center gap-3 text-brand-dark font-sans font-bold">
                    <FileText size={16} className="text-brand-gold"/>
                    BIM / CAD Textúry (High-Res)
                  </span>
                  <Download size={14} className="text-gray-400 group-hover:text-brand-dark"/>
                </button>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
};
