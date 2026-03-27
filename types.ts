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

