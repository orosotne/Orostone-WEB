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

/**
 * Image used by the collection gallery / Lightbox component.
 * Source can be a Supabase storage URL or a local public path.
 */
export interface CollectionGalleryImage {
  /** Public URL of the image (Supabase signed URL, public bucket URL, or /images/... path) */
  publicUrl: string;
  /** Filename or display name shown as alt + lightbox label */
  name: string;
  /** Optional categorization shown in lightbox top-bar */
  category?: 'inspiration' | 'realization' | 'detail';
}

