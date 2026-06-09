import React from 'react';
import { m } from 'framer-motion';
import { Package, Clock, Truck, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { ShopProduct } from '../../constants';

interface LogisticsSectionProps {
  product: ShopProduct;
}

export const LogisticsSection: React.FC<LogisticsSectionProps> = ({ product }) => {
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
      value: 'Špeciálna preprava na vozíku'
    },
    {
      icon: MapPin,
      label: 'Balenie',
      value: product.packagingInfo || 'Prepravný vozík, ochranná fólia, popruhy'
    },
  ];

  return (
    <section className="py-10 lg:py-16 bg-[#F9F9F7]">
      <div className="container mx-auto px-6">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-xs lg:text-[11px] font-bold tracking-[0.2em] uppercase text-brand-gold mb-8">
            Dodanie a logistika
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
            {logistics.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="bg-white p-4 lg:p-6 border border-gray-200">
                  <Icon size={20} className="text-brand-gold mb-4" />
                  <span className="text-xs lg:text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400 block mb-2">
                    {item.label}
                  </span>
                  <span className="text-brand-dark font-medium">
                    {item.value}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-4 lg:p-5 bg-white border border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-brand-dark">
                Doprava od 150 EUR s DPH
              </p>
              <p className="text-xs text-gray-500">
                Presná cena sa potvrdí v pokladni podľa adresy a počtu platní.
              </p>
            </div>
            <Link
              to="/doprava"
              className="text-xs font-semibold text-brand-gold hover:text-brand-dark transition-colors uppercase tracking-wider whitespace-nowrap"
            >
              Viac o doprave →
            </Link>
          </div>

          {product.handlingNotes && (
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 text-amber-800 text-sm">
              <strong>Upozornenie:</strong> {product.handlingNotes}
            </div>
          )}
        </m.div>
      </div>
    </section>
  );
};
