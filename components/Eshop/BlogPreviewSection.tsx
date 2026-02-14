import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { BlogArticle, BLOG_CATEGORY_LABELS } from '../../data/blogTypes';

// ===========================================
// TYPES
// ===========================================

interface BlogPreviewSectionProps {
  articles: BlogArticle[];
  lang?: 'sk' | 'en';
}

// ===========================================
// COMPONENT
// ===========================================

export const BlogPreviewSection: React.FC<BlogPreviewSectionProps> = ({
  articles,
  lang = 'sk',
}) => {
  const displayArticles = articles;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  if (displayArticles.length === 0) return null;

  const sectionTitle = lang === 'sk' ? 'Rady od odborníkov' : 'Expert Advice';
  const moreArticlesLabel = lang === 'sk' ? 'Zobraziť viac článkov' : 'View more articles';
  const readTimeLabel = lang === 'sk' ? 'min čítania' : 'min read';

  const updateScrollButtons = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollButtons();
    el.addEventListener('scroll', updateScrollButtons, { passive: true });
    window.addEventListener('resize', updateScrollButtons);
    return () => {
      el.removeEventListener('scroll', updateScrollButtons);
      window.removeEventListener('resize', updateScrollButtons);
    };
  }, [displayArticles]);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector('a')?.offsetWidth ?? 300;
    const gap = 16;
    const amount = direction === 'left' ? -(cardWidth + gap) : (cardWidth + gap);
    el.scrollBy({ left: amount, behavior: 'smooth' });
  };

  return (
    <section className="blog-section py-12 lg:py-16 bg-brand-gold">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="section-reveal flex items-end justify-between gap-4 mb-6 lg:mb-8">
          <div>
            <span className="text-[11px] tracking-[0.3em] uppercase text-brand-dark/60 font-bold mb-2 block">
              Blog
            </span>
            <h2 className="text-2xl lg:text-3xl font-sans font-bold text-brand-dark">
              {sectionTitle}
            </h2>
          </div>

          {/* Desktop scroll arrows */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="w-10 h-10 rounded-full border-2 border-brand-dark/20 flex items-center justify-center text-brand-dark/60 hover:bg-brand-dark hover:text-white hover:border-brand-dark disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
              aria-label="Scroll left"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="w-10 h-10 rounded-full border-2 border-brand-dark/20 flex items-center justify-center text-brand-dark/60 hover:bg-brand-dark hover:text-white hover:border-brand-dark disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
              aria-label="Scroll right"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Horizontal scroll container */}
        <div
          ref={scrollRef}
          className="blog-scroll-container flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 -mx-4 px-4 lg:-mx-0 lg:px-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <style>{`
            .blog-scroll-container::-webkit-scrollbar { display: none; }
          `}</style>
          {displayArticles.map((article) => (
            <Link
              key={article.id}
              to={`/blog/${article.slug}`}
              className="blog-card group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 snap-start shrink-0 w-[75vw] sm:w-[320px] lg:w-[300px]"
            >
              {/* Image */}
              <div className="relative aspect-[3/2] overflow-hidden">
                <img
                  src={article.heroImage}
                  alt={article[lang].title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Content */}
              <div className="p-4 lg:p-5">
                <span className="inline-block text-[10px] tracking-[0.2em] uppercase text-brand-dark/50 font-bold mb-2">
                  {BLOG_CATEGORY_LABELS[article.category]?.[lang] ?? article.category}
                </span>
                <h3 className="text-[14px] lg:text-[15px] font-bold text-brand-dark font-sans leading-snug line-clamp-2 mb-2.5">
                  {article[lang].title}
                </h3>
                <div className="flex items-center gap-1.5 text-brand-dark/35 text-xs">
                  <Clock size={12} strokeWidth={1.5} />
                  <span>{article.readTimeMinutes} {readTimeLabel}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* "View more articles" button */}
        <div className="flex justify-center mt-8">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 bg-brand-dark text-white px-7 py-3 rounded-full text-[11px] tracking-[0.15em] uppercase font-bold hover:bg-white hover:text-brand-dark transition-all duration-300 group"
          >
            {moreArticlesLabel}
            <ArrowRight
              size={14}
              className="group-hover:translate-x-1 transition-transform duration-300"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};
