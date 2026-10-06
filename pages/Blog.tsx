import React, { useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import {
  BlogCategory,
  BLOG_CATEGORY_LABELS,
} from '../data/blogTypes';
import { BLOG_ARTICLES_LISTING } from '../data/blogArticlesMeta';
import { SEOHead, createBreadcrumbLD } from '../components/UI/SEOHead';
import { Container, GoldBand, PageHero, Section } from '../components/Design';
import { BlogCard } from '../components/Blog/BlogCard';

// ===========================================
// CONSTANTS
// ===========================================

const ALL_CATEGORIES: BlogCategory[] = [
  'risk-killers',
  'trust-builders',
  'identity-aesthetics',
  'friction-removers',
  'value-comparisons',
  'control-care',
];

const chip = (active: boolean) =>
  `min-h-[44px] flex-none rounded-full border px-4 text-[0.84rem] font-medium transition-colors duration-200 ${
    active ? 'border-brand-dark bg-brand-dark text-brand-light' : 'border-brand-line text-brand-dark hover:border-brand-dark'
  }`;

// Format date helper
const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('sk-SK', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

// ===========================================
// COMPONENT
// ===========================================

export const Blog: React.FC = () => {
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState<BlogCategory | 'all'>('all');

  // Read ?tag= query parameter from hash-based URL
  const activeTag = useMemo(() => {
    const search = location.search || (location.hash?.split('?')[1] ? '?' + location.hash.split('?')[1] : '');
    return new URLSearchParams(search).get('tag') || null;
  }, [location]);

  const filteredArticles = useMemo(() => {
    let articles = activeCategory === 'all'
      ? BLOG_ARTICLES_LISTING
      : BLOG_ARTICLES_LISTING.filter((a) => a.category === activeCategory);
    if (activeTag) {
      articles = articles.filter((a) => a.tags.some((t) => t.toLowerCase() === activeTag.toLowerCase()));
    }
    return articles;
  }, [activeCategory, activeTag]);

  return (
    <div>
      <SEOHead
        title="Blog o sinterovanom kameni | OROSTONE"
        description="Články o sinterovanom kameni — cena, údržba, hrúbka, porovnania s keramikou a technickým kameňom. Pre tých, kto si vyberá dlhodobé riešenie."
        ogType="website"
        canonical="https://orostone.sk/blog"
        structuredData={createBreadcrumbLD([
          { name: 'OROSTONE', url: 'https://orostone.sk/' },
          { name: 'Blog', url: 'https://orostone.sk/blog' },
        ])}
      />

      <PageHero eyebrow="Poradňa" title="Blog" lead="Odborné rady, porovnania a tipy pre váš projekt" />

      {/* ==================== CATEGORY FILTERS ==================== */}
      <div className="sticky top-16 z-30 border-y border-brand-line bg-brand-light lg:top-20">
        <Container>
          <div
            className="-mx-[var(--os-edge)] flex items-center gap-2 overflow-x-auto overscroll-x-contain px-[var(--os-edge)] py-3 [scrollbar-width:none] [touch-action:manipulation]"
            role="group"
            aria-label="Kategórie článkov"
          >
            <button type="button" onClick={() => setActiveCategory('all')} className={chip(activeCategory === 'all')} aria-pressed={activeCategory === 'all'}>
              Všetko
            </button>
            {ALL_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={chip(activeCategory === cat)}
                aria-pressed={activeCategory === cat}
              >
                {BLOG_CATEGORY_LABELS[cat]?.sk ?? cat}
              </button>
            ))}
          </div>
        </Container>
      </div>

      {/* ==================== ARTICLES GRID ==================== */}
      <Section tone="chalk" className="!pt-[clamp(32px,4vw,56px)]">
        <Container>
          {/* Always render container to avoid CLS when tag badge appears/disappears */}
          <div className="overflow-hidden transition-all duration-200" style={{ maxHeight: activeTag ? '72px' : '0px' }}>
            <div className="flex items-center gap-3 pb-8">
              <span className="text-[0.9rem] font-normal text-brand-muted">Filtrované podľa tagu:</span>
              {activeTag && (
                <Link
                  to="/blog"
                  className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-brand-dark px-4 text-[0.88rem] font-medium no-underline"
                >
                  {activeTag}
                  <X size={14} strokeWidth={1.75} aria-hidden="true" />
                  <span className="sr-only">zrušiť filter</span>
                </Link>
              )}
            </div>
          </div>

          {filteredArticles.length === 0 ? (
            <p className="py-16 text-os-lead font-light text-brand-muted">
              {activeTag
                ? `Žiadne články s tagom "${activeTag}".`
                : 'Zatiaľ žiadne články v tejto kategórii.'}
            </p>
          ) : (
            <ul className="grid gap-x-5 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {filteredArticles.map((article) => (
                <li key={article.id}>
                  <BlogCard
                    slug={article.slug}
                    image={article.heroImage}
                    title={article.sk.title}
                    excerpt={article.sk.excerpt}
                    category={BLOG_CATEGORY_LABELS[article.category]?.sk ?? article.category}
                    date={formatDate(article.publishDate)}
                    minutes={article.readTimeMinutes}
                  />
                </li>
              ))}
            </ul>
          )}
        </Container>
      </Section>

      <GoldBand od="blog" />
    </div>
  );
};
