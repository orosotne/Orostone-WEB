export type ProductBodyType = 'FULL BODY' | 'COLOR BODY' | 'WHITE BODY';

export interface Product {
  id: string;
  name: string;
  collectionId: string;
  bodyType: ProductBodyType;
  image: string;
  description: string;
  thickness: string[]; // e.g., ['6mm', '12mm', '20mm']
  finish: string; // e.g., 'Matný', 'Leštený'
  application: string[]; // e.g., ['Kuchyňa', 'Fasáda']
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  heroImage: string;
  galleryFolder?: string;
}

export interface Realization {
  id: string;
  title: string;
  location: string;
  image: string;
  images?: string[];  // pole ďalších obrázkov pre lightbox galériu
  category: 'Kuchyňa' | 'Kúpeľňa' | 'Fasáda' | 'Obývačka';
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface CollectionGalleryImage {
  name: string;
  url: string;
  publicUrl: string;
  category?: 'inspiration' | 'realization' | 'detail';
}