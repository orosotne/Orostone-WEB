import React, { useState, startTransition } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { Maximize2, Search, Layers, GitMerge, ZoomIn, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useScrollLock } from '../../hooks/useScrollLock';
import type { ShopProduct } from '../../constants';

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

export const MaterialPerspectivesViewer: React.FC<MaterialPerspectivesViewerProps> = ({ product }) => {
  const [activeTab, setActiveTab] = useState<string>('space');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  React.useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsLightboxOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen]);

  useScrollLock(isLightboxOpen);

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
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="!mt-[73px]"
    >
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-brand-dark mb-2">
          Objavte krásu z každého uhla
        </h3>
        <p className="text-sm text-gray-500">
          Buďte si istí svojou voľbou ešte pred nákupom.
        </p>
      </div>

      <div className="flex justify-center gap-2 mb-4">
        {perspectives.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => startTransition(() => setActiveTab(tab.id))}
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

      <div
        className="relative rounded-xl overflow-hidden bg-gray-900 cursor-pointer group"
        onClick={() => startTransition(() => setIsLightboxOpen(true))}
      >
        <AnimatePresence mode="wait">
          <m.div
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
            <div className="absolute top-4 left-4">
              <span className="bg-white/90 backdrop-blur text-brand-dark text-xs lg:text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded">
                {activePerspective.badge}
              </span>
            </div>
            <div className="absolute top-4 right-4">
              <button
                className="w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-brand-dark hover:bg-white transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  startTransition(() => setIsLightboxOpen(true));
                }}
              >
                <ZoomIn size={18} />
              </button>
            </div>
          </m.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isLightboxOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
              onClick={() => startTransition(() => setIsLightboxOpen(false))}
            />

            <m.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 w-full max-w-6xl mx-4 max-h-[90vh] flex flex-col"
            >
              <button
                onClick={() => startTransition(() => setIsLightboxOpen(false))}
                className="absolute -top-12 right-0 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <X size={20} />
              </button>

              <div className="relative rounded-xl overflow-hidden bg-gray-900">
                <AnimatePresence mode="wait">
                  <m.div
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
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 backdrop-blur text-brand-dark text-xs lg:text-[10px] font-bold uppercase tracking-wider px-4 py-2 rounded">
                        {activePerspective.badge}
                      </span>
                    </div>
                  </m.div>
                </AnimatePresence>
              </div>

              <div className="flex justify-center gap-2 mt-6">
                {perspectives.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => startTransition(() => setActiveTab(tab.id))}
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

              <div className="text-center mt-4 px-4">
                <p className="text-white/80 text-base leading-relaxed max-w-2xl mx-auto">
                  {activePerspective.description}
                </p>
              </div>
            </m.div>
          </div>
        )}
      </AnimatePresence>
    </m.div>
  );
};
