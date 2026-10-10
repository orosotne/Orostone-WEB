import React from 'react';
import { m } from 'framer-motion';
import { Package, Clock, Truck, MapPin } from 'lucide-react';
import type { ShopProduct } from '../../constants';
import { Container, Eyebrow, TextLink } from '../Design';
import { REVEAL } from '../../lib/motion';
import { LIGHT_TONE_BG, type LightTone } from './types';

interface LogisticsSectionProps {
  product: ShopProduct;
  tone?: LightTone;
}

export const LogisticsSection: React.FC<LogisticsSectionProps> = ({ product, tone = 'chalk' }) => {
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
    <section className={`py-10 lg:py-16 ${LIGHT_TONE_BG[tone]}`}>
      <Container>
        <m.div {...REVEAL}>
          <Eyebrow as="h2" className="mb-8 text-brand-dark">
            Dodanie a logistika
          </Eyebrow>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {logistics.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="border border-brand-line bg-white p-4 lg:p-6">
                  <Icon size={20} className="mb-4 text-brand-dark" aria-hidden="true" />
                  <span className="mb-2 block text-os-eyebrow uppercase text-brand-muted">{item.label}</span>
                  <span className="font-medium text-brand-dark">{item.value}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex flex-col gap-3 border border-brand-line bg-white p-4 sm:flex-row sm:items-center sm:justify-between lg:p-5">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-brand-dark">Doprava od 150 EUR s DPH</p>
              <p className="text-xs text-brand-muted">Presná cena sa potvrdí v pokladni podľa adresy a počtu platní.</p>
            </div>
            <TextLink to="/doprava" className="whitespace-nowrap">
              Viac o doprave
            </TextLink>
          </div>

          {product.handlingNotes && (
            <div className="mt-4 border-l-2 border-brand-dark bg-brand-sand p-4 text-sm text-brand-dark">
              <strong>Upozornenie:</strong> {product.handlingNotes}
            </div>
          )}
        </m.div>
      </Container>
    </section>
  );
};
