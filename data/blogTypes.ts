// Blog article types for Orostone eshop blog

export type BlogCategory = 
  | 'risk-killers'
  | 'trust-builders' 
  | 'identity-aesthetics'
  | 'friction-removers'
  | 'value-comparisons'
  | 'control-care';

export type BlogLanguage = 'sk' | 'en';

export interface BlogFAQ {
  question: string;
  answer: string;
}

export interface BlogArticle {
  id: string;
  slug: string;
  category: BlogCategory;
  publishDate: string;
  /** ISO date of last content update — signals freshness to LLMs and search engines */
  lastModified?: string;
  readTimeMinutes: number;
  heroImage: string;
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  tags: string[];
  sk: {
    title: string;
    subtitle: string;
    excerpt: string;
    directAnswer: string; // 2-3 line direct answer for AI snippets
    content: string; // Full HTML content
    faqs: BlogFAQ[];
  };
  en: {
    title: string;
    subtitle: string;
    excerpt: string;
    directAnswer: string;
    content: string;
    faqs: BlogFAQ[];
  };
}

export const BLOG_CATEGORY_LABELS: Record<BlogCategory, { sk: string; en: string }> = {
  'risk-killers': { sk: 'Riziká a prevencia', en: 'Risk Prevention' },
  'trust-builders': { sk: 'Dôvera a kvalita', en: 'Trust & Quality' },
  'identity-aesthetics': { sk: 'Dizajn a estetika', en: 'Design & Aesthetics' },
  'friction-removers': { sk: 'Proces a pohodlie', en: 'Process & Convenience' },
  'value-comparisons': { sk: 'Hodnota a porovnania', en: 'Value & Comparisons' },
  'control-care': { sk: 'Údržba a starostlivosť', en: 'Care & Maintenance' },
};

export const BLOG_AUTHOR_OROSTONE = {
  name: 'OROSTONE tím',
  role: 'Odborníci na sinterovaný kameň',
  avatar: '/images/logo-circle.png',
};
