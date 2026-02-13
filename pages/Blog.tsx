import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowRight, Clock, Calendar, Tag, X } from 'lucide-react';
import {
  BlogCategory,
  BLOG_CATEGORY_LABELS,
} from '../data/blogTypes';
import { BLOG_ARTICLES } from '../data/blogArticles';
import { SEOHead, createBreadcrumbLD } from '../components/UI/SEOHead';

gsap.registerPlugin(ScrollTrigger);

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

// ===========================================
// COMPONENT
// ===========================================

export const Blog: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState<BlogCategory | 'all'>('all');

  // Read ?tag= query parameter from hash-based URL
  const activeTag = useMemo(() => {
    const search = location.search || (location.hash?.split('?')[1] ? '?' + location.hash.split('?')[1] : '');
    return new URLSearchParams(search).get('tag') || null;
  }, [location]);

  const filteredArticles = useMemo(() => {
    let articles = activeCategory === 'all'
      ? BLOG_ARTICLES
      : BLOG_ARTICLES.filter((a) => a.category === activeCategory);
    if (activeTag) {
      articles = articles.filter((a) => a.tags.some((t) => t.toLowerCase() === activeTag.toLowerCase()));
    }
    return articles;
  }, [activeCategory, activeTag]);

  // Format date helper
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('sk-SK', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  // ===========================================
  // GSAP ANIMATIONS
  // ===========================================

  useGSAP(
    () => {
      if (!containerRef.current) return;

      // Page header reveal
      gsap.fromTo(
        '.blog-page-header',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          delay: 0.1,
        },
      );

      // Filter tabs reveal
      gsap.fromTo(
        '.blog-filter-tab',
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: 'power3.out',
          stagger: 0.06,
          delay: 0.3,
        },
      );

      // Cards reveal
      gsap.fromTo(
        '.blog-grid-card',
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: '.blog-grid',
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        },
      );
    },
    { scope: containerRef },
  );

  // Re-animate cards when filter changes
  useEffect(() => {
    const cards = containerRef.current?.querySelectorAll('.blog-grid-card');
    if (!cards || cards.length === 0) return;

    gsap.fromTo(
      cards,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.4,
        ease: 'power3.out',
        stagger: 0.06,
      },
    );
  }, [activeCategory]);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#FAFAFA]">
      <SEOHead
        title="Blog | OROSTONE — Odborné rady pre váš projekt"
        description="Odborné rady, porovnania a tipy pre váš projekt so sinterovaným kameňom. Čítajte náš blog."
        ogType="website"
        canonical="https://www.orostone.sk/#/blog"
        structuredData={createBreadcrumbLD([
          { name: 'OROSTONE', url: 'https://www.orostone.sk/' },
          { name: 'Blog', url: 'https://www.orostone.sk/#/blog' },
        ])}
      />

      {/* ==================== PAGE HEADER ==================== */}
      <section className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 lg:px-8 py-16 lg:py-24">
          <div className="blog-page-header max-w-2xl mx-auto text-center">
            <span className="text-[11px] tracking-[0.3em] uppercase text-brand-gold font-bold mb-3 block">
              Blog
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold text-brand-dark mb-4">
              Blog
            </h1>
            <p className="text-gray-400 text-base lg:text-lg font-light leading-relaxed">
              Odborné rady, porovnania a tipy pre váš projekt
            </p>
          </div>
        </div>
      </section>

      {/* ==================== CATEGORY FILTERS ==================== */}
      <section className="bg-white border-b border-gray-100 sticky top-[56px] lg:top-[112px] z-30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center gap-2 py-4 overflow-x-auto scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
            {/* All tab */}
            <button
              onClick={() => setActiveCategory('all')}
              className={`blog-filter-tab flex-shrink-0 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-[0.1em] transition-all duration-300 ${
                activeCategory === 'all'
                  ? 'bg-brand-dark text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-brand-dark'
              }`}
            >
              Všetko
            </button>

            {ALL_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`blog-filter-tab flex-shrink-0 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-[0.1em] transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-brand-dark text-white'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-brand-dark'
                }`}
              >
                {BLOG_CATEGORY_LABELS[cat]?.sk ?? cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== ACTIVE TAG BADGE ==================== */}
      {activeTag && (
        <div className="container mx-auto px-4 lg:px-8 pt-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400 font-light">Filtrované podľa tagu:</span>
            <Link
              to="/blog"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-dark bg-brand-gold/15 px-3 py-1 rounded-full hover:bg-brand-gold/25 transition-colors duration-200"
            >
              {activeTag}
              <X size={13} strokeWidth={2} />
            </Link>
          </div>
        </div>
      )}

      {/* ==================== ARTICLES GRID ==================== */}
      <section className="py-12 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          {filteredArticles.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg font-light">
                {activeTag
                  ? `Žiadne články s tagom "${activeTag}".`
                  : 'Zatiaľ žiadne články v tejto kategórii.'}
              </p>
            </div>
          ) : (
            <div className="blog-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredArticles.map((article) => (
                <Link
                  key={article.id}
                  to={`/blog/${article.slug}`}
                  className="blog-grid-card group"
                >
                  <article className="bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-500 h-full flex flex-col">
                    {/* Hero Image */}
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={article.heroImage}
                        alt={article.sk.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      {/* Category Badge */}
                      <span className="absolute top-4 left-4 inline-block text-[10px] tracking-[0.15em] uppercase font-bold text-brand-dark bg-brand-gold/90 px-3 py-1 rounded-full">
                        {BLOG_CATEGORY_LABELS[article.category]?.sk ?? article.category}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-5 lg:p-6 flex flex-col flex-grow">
                      <h3 className="text-lg font-bold text-brand-dark font-sans mb-2 leading-snug group-hover:text-brand-gold transition-colors duration-300">
                        {article.sk.title}
                      </h3>
                      <p className="text-gray-400 text-sm font-light leading-relaxed line-clamp-2 mb-4 flex-grow">
                        {article.sk.excerpt}
                      </p>

                      {/* Meta Row */}
                      <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                        <span className="flex items-center gap-1.5">
                          <Calendar size={12} strokeWidth={1.5} />
                          {formatDate(article.publishDate)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock size={12} strokeWidth={1.5} />
                          {article.readTimeMinutes} min
                        </span>
                      </div>

                      {/* Tags */}
                      {article.tags.length > 0 && (
                        <div className="flex items-center gap-2 flex-wrap mb-4">
                          {article.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center gap-1 text-[10px] text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full"
                            >
                              <Tag size={9} strokeWidth={1.5} />
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Read More */}
                      <div className="flex items-center gap-1.5 text-brand-gold text-xs font-bold uppercase tracking-[0.15em] group-hover:gap-2.5 transition-all duration-300 mt-auto">
                        Čítať viac
                        <ArrowRight size={13} />
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
