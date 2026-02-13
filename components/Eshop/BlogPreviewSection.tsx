import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
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
  const displayArticles = articles.slice(0, 4);

  if (displayArticles.length === 0) return null;

  const sectionTitle = lang === 'sk' ? 'Rady od odborníkov' : 'Expert Advice';
  const allArticlesLabel = lang === 'sk' ? 'Všetky články' : 'All articles';
  const readTimeLabel = lang === 'sk' ? 'min čítania' : 'min read';

  return (
    <section className="blog-section py-20 lg:py-28 bg-brand-gold">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header — title left, CTA right */}
        <div className="section-reveal flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12 lg:mb-16">
          <div>
            <span className="text-[11px] tracking-[0.3em] uppercase text-brand-dark/60 font-bold mb-3 block">
              Blog
            </span>
            <h2 className="text-3xl lg:text-4xl font-sans font-bold text-brand-dark">
              {sectionTitle}
            </h2>
          </div>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 bg-brand-dark text-white px-7 py-3 rounded-full text-[11px] tracking-[0.15em] uppercase font-bold hover:bg-white hover:text-brand-dark transition-all duration-300 group shrink-0"
          >
            {allArticlesLabel}
            <ArrowRight
              size={14}
              className="group-hover:translate-x-1 transition-transform duration-300"
            />
          </Link>
        </div>

        {/* Blog Cards — 4 equal white cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {displayArticles.map((article) => (
            <Link
              key={article.id}
              to={`/blog/${article.slug}`}
              className="blog-card group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={article.heroImage}
                  alt={article[lang].title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Content */}
              <div className="p-5 lg:p-6">
                <span className="inline-block text-[10px] tracking-[0.2em] uppercase text-brand-dark/50 font-bold mb-2.5">
                  {BLOG_CATEGORY_LABELS[article.category]?.[lang] ?? article.category}
                </span>
                <h3 className="text-[15px] lg:text-base font-bold text-brand-dark font-sans leading-snug line-clamp-2 mb-3">
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
      </div>
    </section>
  );
};
