import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Clock,
  Calendar,
  ChevronDown,
  Globe,
  Share2,
  Linkedin,
  Facebook,
  Twitter,
  LinkIcon,
  Check,
} from 'lucide-react';
import type { BlogLanguage } from '../data/blogTypes';
import { BLOG_CATEGORY_LABELS } from '../data/blogTypes';
import { BLOG_ARTICLES } from '../data/blogArticles';
import { SEOHead, createBreadcrumbLD, OROSTONE_ORGANIZATION_LD } from '../components/UI/SEOHead';

gsap.registerPlugin(ScrollTrigger);

// ===========================================
// HELPERS
// ===========================================

/** Extract headings from HTML content for table of contents */
const extractHeadings = (html: string): { id: string; text: string; level: number }[] => {
  const headings: { id: string; text: string; level: number }[] = [];
  const regex = /<h([2-3])[^>]*id=["']([^"']*)["'][^>]*>(.*?)<\/h[2-3]>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    headings.push({
      level: parseInt(match[1], 10),
      id: match[2],
      text: match[3].replace(/<[^>]*>/g, ''),
    });
  }
  return headings;
};

const formatDate = (dateStr: string, lang: BlogLanguage) => {
  const locale = lang === 'sk' ? 'sk-SK' : 'en-US';
  return new Date(dateStr).toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

// ===========================================
// COMPONENT
// ===========================================

export const BlogArticle: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const containerRef = useRef<HTMLDivElement>(null);
  const [lang, setLang] = useState<BlogLanguage>('sk');
  const [activeHeading, setActiveHeading] = useState<string>('');
  const [directAnswerOpen, setDirectAnswerOpen] = useState(true);
  const [readProgress, setReadProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [mobileTocOpen, setMobileTocOpen] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  // Find article
  const article = useMemo(
    () => BLOG_ARTICLES.find((a) => a.slug === slug),
    [slug],
  );

  // Related articles (same category, exclude current)
  const relatedArticles = useMemo(() => {
    if (!article) return [];
    return BLOG_ARTICLES.filter(
      (a) => a.category === article.category && a.id !== article.id,
    ).slice(0, 3);
  }, [article]);

  // Table of contents
  const headings = useMemo(() => {
    if (!article) return [];
    return extractHeadings(article[lang].content);
  }, [article, lang]);

  // Labels
  const labels = {
    backToBlog: lang === 'sk' ? 'Späť na blog' : 'Back to blog',
    readTime: lang === 'sk' ? 'min čítania' : 'min read',
    directAnswer: lang === 'sk' ? 'Rýchla odpoveď' : 'Quick answer',
    toc: lang === 'sk' ? 'Obsah článku' : 'Table of contents',
    related: lang === 'sk' ? 'Súvisiace články' : 'Related articles',
    readMore: lang === 'sk' ? 'Čítať viac' : 'Read more',
    notFoundTitle: lang === 'sk' ? 'Článok nebol nájdený' : 'Article not found',
    notFoundText:
      lang === 'sk'
        ? 'Článok, ktorý hľadáte, neexistuje alebo bol odstránený.'
        : 'The article you are looking for does not exist or has been removed.',
    goBack: lang === 'sk' ? 'Späť na blog' : 'Back to blog',
  };

  // ===========================================
  // SCROLL PROGRESS + BACK TO TOP
  // ===========================================

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0;
      setReadProgress(progress);
      setShowBackToTop(scrollTop > 500);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const copyLink = useCallback(() => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    });
  }, []);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = article ? article[lang].title : '';

  // ===========================================
  // GSAP ANIMATIONS
  // ===========================================

  useGSAP(
    () => {
      if (!containerRef.current || !article) return;

      gsap.fromTo(
        '.article-hero-content',
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.2 },
      );

      gsap.fromTo(
        '.article-body',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.article-body',
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        },
      );

      gsap.fromTo(
        '.related-section',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.related-section',
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        },
      );
    },
    { scope: containerRef, dependencies: [article, lang] },
  );

  // ===========================================
  // INTERSECTION OBSERVER FOR TOC
  // ===========================================

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHeading(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px' },
    );

    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  // ===========================================
  // 404 STATE
  // ===========================================

  if (!article) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4">
        <SEOHead
          title="Článok nebol nájdený | OROSTONE Blog"
          description="Článok, ktorý hľadáte, neexistuje."
        />
        <div className="text-center max-w-md">
          <span className="text-6xl font-bold text-brand-gold/30 block mb-4">404</span>
          <h1 className="text-2xl font-bold text-brand-dark mb-3">{labels.notFoundTitle}</h1>
          <p className="text-gray-400 font-light mb-8">{labels.notFoundText}</p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 bg-brand-dark text-white px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wider hover:bg-brand-gold hover:text-brand-dark transition-all duration-300"
          >
            <ArrowLeft size={16} />
            {labels.goBack}
          </Link>
        </div>
      </div>
    );
  }

  const content = article[lang];

  // Canonical URL
  const canonicalUrl = `https://www.orostone.sk/#/blog/${article.slug}`;

  // Estimate word count from HTML content (strip tags)
  const wordCount = useMemo(() => {
    const text = content.content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    return text.split(' ').length;
  }, [content.content]);

  return (
    <div ref={containerRef} className="min-h-screen bg-white">
      {/* ==================== SEO HEAD ==================== */}
      <SEOHead
        title={`${content.title} | OROSTONE Blog`}
        description={content.directAnswer || content.excerpt}
        ogType="article"
        ogImage={article.heroImage}
        canonical={canonicalUrl}
      />

      {/* ==================== BlogPosting JSON-LD ==================== */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: content.title,
            description: content.directAnswer || content.excerpt,
            image: article.heroImage.startsWith('http')
              ? article.heroImage
              : `https://www.orostone.sk${article.heroImage}`,
            datePublished: article.publishDate,
            dateModified: article.lastModified || article.publishDate,
            wordCount,
            inLanguage: lang === 'sk' ? 'sk-SK' : 'en-US',
            articleSection: BLOG_CATEGORY_LABELS[article.category]?.[lang] ?? article.category,
            keywords: article.tags.join(', '),
            author: {
              '@type': 'Person',
              name: article.author?.name || 'OROSTONE tím',
              jobTitle: article.author?.role || 'Odborníci na sinterovaný kameň',
              url: 'https://www.orostone.sk',
              image: article.author?.avatar
                ? `https://www.orostone.sk${article.author.avatar}`
                : undefined,
              worksFor: {
                '@type': 'Organization',
                name: 'OROSTONE',
                url: 'https://www.orostone.sk',
              },
            },
            publisher: {
              '@type': 'Organization',
              name: 'OROSTONE',
              url: 'https://www.orostone.sk',
              logo: {
                '@type': 'ImageObject',
                url: 'https://www.orostone.sk/images/logo.png',
              },
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': canonicalUrl,
            },
          }),
        }}
      />

      {/* ==================== FAQPage JSON-LD ==================== */}
      {content.faqs && content.faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: content.faqs.map((faq) => ({
                '@type': 'Question',
                name: faq.question,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: faq.answer,
                },
              })),
            }),
          }}
        />
      )}

      {/* ==================== BreadcrumbList JSON-LD ==================== */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            createBreadcrumbLD([
              { name: 'OROSTONE', url: 'https://www.orostone.sk/' },
              { name: 'Blog', url: 'https://www.orostone.sk/#/blog' },
              { name: content.title, url: canonicalUrl },
            ]),
          ),
        }}
      />

      {/* ==================== READING PROGRESS BAR ==================== */}
      <div
        className="fixed top-0 left-0 h-[3px] bg-brand-gold z-[100] transition-[width] duration-150 ease-out"
        style={{ width: `${readProgress}%` }}
      />

      {/* ==================== SEMANTIC ARTICLE WRAPPER ==================== */}
      <article itemScope itemType="https://schema.org/BlogPosting">

      {/* ==================== HERO ==================== */}
      <header className="relative h-[50vh] min-h-[400px] lg:h-[60vh] overflow-hidden">
        <img
          src={article.heroImage}
          alt={content.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

        {/* Back Link */}
        <div className="absolute top-6 left-6 z-20">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium transition-colors duration-300"
          >
            <ArrowLeft size={16} />
            {labels.backToBlog}
          </Link>
        </div>

        {/* Language Toggle */}
        <div className="absolute top-6 right-6 z-20">
          <button
            onClick={() => setLang((prev) => (prev === 'sk' ? 'en' : 'sk'))}
            className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium transition-colors duration-300 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full"
          >
            <Globe size={14} />
            {lang === 'sk' ? 'EN' : 'SK'}
          </button>
        </div>

        {/* Hero Content */}
        <div className="article-hero-content absolute bottom-0 left-0 right-0 p-6 lg:p-12">
          <div className="max-w-3xl mx-auto">
            <span className="inline-block text-[10px] tracking-[0.2em] uppercase text-brand-gold font-bold mb-3">
              {BLOG_CATEGORY_LABELS[article.category]?.[lang] ?? article.category}
            </span>
            <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white font-sans mb-4 leading-tight">
              {content.title}
            </h1>
            {content.subtitle && (
              <p className="text-white/60 text-base lg:text-lg font-light mb-4 max-w-2xl">
                {content.subtitle}
              </p>
            )}
            <div className="flex items-center gap-4 text-white/40 text-sm">
              <time dateTime={article.publishDate} itemProp="datePublished" className="flex items-center gap-1.5">
                <Calendar size={14} strokeWidth={1.5} />
                {formatDate(article.publishDate, lang)}
              </time>
              {article.lastModified && article.lastModified !== article.publishDate && (
                <time dateTime={article.lastModified} itemProp="dateModified" className="hidden" />
              )}
              <span className="flex items-center gap-1.5">
                <Clock size={14} strokeWidth={1.5} />
                {article.readTimeMinutes} {labels.readTime}
              </span>
              {article.author && (
                <span className="hidden sm:flex items-center gap-2" itemProp="author" itemScope itemType="https://schema.org/Person">
                  {article.author.avatar && (
                    <img
                      src={article.author.avatar}
                      alt={article.author.name}
                      className="w-6 h-6 rounded-full object-cover border border-white/20"
                    />
                  )}
                  <span itemProp="name">{article.author.name}</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ==================== ARTICLE BODY ==================== */}
      <section className="article-body py-12 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex gap-12 lg:gap-16 relative">
            {/* Sticky Table of Contents — Desktop Only */}
            {headings.length > 0 && (
              <aside className="hidden xl:block w-56 flex-shrink-0">
                <div className="sticky top-32">
                  <p className="text-[10px] tracking-[0.2em] uppercase text-brand-gold font-bold mb-4">
                    {labels.toc}
                  </p>
                  <nav className="flex flex-col gap-1">
                    {headings.map((h) => (
                      <a
                        key={h.id}
                        href={`#${h.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          document
                            .getElementById(h.id)
                            ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }}
                        className={`text-sm font-light transition-colors duration-200 py-1 border-l-2 ${
                          h.level === 3 ? 'pl-6' : 'pl-4'
                        } ${
                          activeHeading === h.id
                            ? 'border-brand-gold text-brand-dark font-medium'
                            : 'border-transparent text-gray-400 hover:text-brand-dark hover:border-gray-300'
                        }`}
                      >
                        {h.text}
                      </a>
                    ))}
                  </nav>
                </div>
              </aside>
            )}

            {/* Main Content */}
            <div className="flex-1 max-w-3xl mx-auto min-w-0">
              {/* Direct Answer Box */}
              {content.directAnswer && (
                <div className="mb-10 border-l-4 border-brand-gold bg-brand-gold/5 rounded-r-2xl overflow-hidden">
                  <button
                    onClick={() => setDirectAnswerOpen(!directAnswerOpen)}
                    className="w-full flex items-center justify-between p-5 lg:p-6 text-left group"
                  >
                    <p className="text-[10px] tracking-[0.2em] uppercase text-brand-gold font-bold">
                      {labels.directAnswer}
                    </p>
                    <ChevronDown
                      size={18}
                      className={`flex-shrink-0 text-brand-gold transition-transform duration-300 ${
                        directAnswerOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {directAnswerOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <p className="text-brand-dark text-base lg:text-lg font-medium leading-relaxed px-5 lg:px-6 pb-5 lg:pb-6">
                          {content.directAnswer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Mobile Table of Contents */}
              {headings.length > 0 && (
                <div className="xl:hidden mb-10">
                  <button
                    onClick={() => setMobileTocOpen(!mobileTocOpen)}
                    className="w-full flex items-center justify-between py-4 px-5 bg-[#FAFAFA] rounded-2xl text-left group"
                  >
                    <span className="text-[10px] tracking-[0.2em] uppercase text-brand-gold font-bold">
                      {labels.toc}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`text-brand-gold transition-transform duration-300 ${
                        mobileTocOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {mobileTocOpen && (
                      <motion.nav
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden bg-[#FAFAFA] rounded-b-2xl -mt-2 px-5 pb-4"
                      >
                        <div className="flex flex-col gap-1 pt-2 border-t border-gray-200/50">
                          {headings.map((h) => (
                            <a
                              key={h.id}
                              href={`#${h.id}`}
                              onClick={(e) => {
                                e.preventDefault();
                                setMobileTocOpen(false);
                                setTimeout(() => {
                                  document
                                    .getElementById(h.id)
                                    ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }, 300);
                              }}
                              className={`text-sm font-light transition-colors duration-200 py-1.5 ${
                                h.level === 3 ? 'pl-5' : 'pl-1'
                              } ${
                                activeHeading === h.id
                                  ? 'text-brand-dark font-medium'
                                  : 'text-gray-400 hover:text-brand-dark'
                              }`}
                            >
                              {h.text}
                            </a>
                          ))}
                        </div>
                      </motion.nav>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* HTML Content */}
              <div
                className="
                  prose prose-lg max-w-none

                  prose-headings:font-sans prose-headings:font-bold prose-headings:text-brand-dark
                  prose-h2:text-[1.65rem] prose-h2:lg:text-[2rem] prose-h2:mt-20 prose-h2:lg:mt-24 prose-h2:mb-10 prose-h2:leading-tight prose-h2:font-bold
                  prose-h3:text-xl prose-h3:lg:text-[1.35rem] prose-h3:mt-12 prose-h3:mb-6 prose-h3:leading-snug
                  prose-p:text-gray-600 prose-p:font-light prose-p:leading-[1.9] prose-p:mb-8 prose-p:text-[1.05rem] prose-p:lg:text-[1.1rem]
                  prose-a:text-brand-gold prose-a:no-underline hover:prose-a:underline prose-a:font-medium
                  prose-strong:text-brand-dark prose-strong:font-semibold
                  [&_.gold]:text-brand-gold [&_.gold]:font-bold
                  prose-ul:my-6 prose-ul:space-y-2 prose-li:text-gray-600 prose-li:font-light prose-li:leading-relaxed prose-li:text-[1.05rem]
                  prose-img:rounded-2xl prose-img:my-12 prose-img:shadow-lg
                  prose-blockquote:border-brand-gold prose-blockquote:text-gray-500 prose-blockquote:font-light prose-blockquote:italic prose-blockquote:my-12
                  prose-table:text-sm prose-th:bg-gray-50 prose-th:py-3 prose-th:px-4 prose-td:py-3 prose-td:px-4

                  [&_.article-tldr]:list-none [&_.article-tldr]:pl-0 [&_.article-tldr]:my-0 [&_.article-tldr]:mb-12
                  [&_.article-tldr]:rounded-2xl [&_.article-tldr]:py-5 [&_.article-tldr]:px-6
                  [&_.article-tldr>li]:text-brand-dark [&_.article-tldr>li]:font-bold [&_.article-tldr>li]:text-base
                  [&_.article-tldr>li]:pl-0 [&_.article-tldr>li]:mb-1.5 [&_.article-tldr>li:last-child]:mb-0
                  [&_.article-tldr>li]:before:content-['◆'] [&_.article-tldr>li]:before:text-brand-gold
                  [&_.article-tldr>li]:before:text-lg [&_.article-tldr>li]:before:mr-3

                  [&_.article-highlight]:bg-brand-gold/[0.08] [&_.article-highlight]:border-l-4 [&_.article-highlight]:border-brand-gold
                  [&_.article-highlight]:rounded-r-2xl [&_.article-highlight]:py-5 [&_.article-highlight]:px-6 [&_.article-highlight]:my-10
                  [&_.article-highlight]:not-prose
                  [&_.article-highlight_p]:text-brand-dark [&_.article-highlight_p]:font-medium [&_.article-highlight_p]:text-[1.05rem]
                  [&_.article-highlight_p]:leading-relaxed [&_.article-highlight_p]:mb-3 [&_.article-highlight_p:last-child]:mb-0
                  [&_.article-highlight_strong]:text-brand-dark [&_.article-highlight_strong]:font-bold
                  [&_.article-highlight_ul]:mt-3 [&_.article-highlight_ul]:mb-0 [&_.article-highlight_ul]:space-y-1.5 [&_.article-highlight_ul]:list-disc [&_.article-highlight_ul]:pl-5
                  [&_.article-highlight_li]:text-brand-dark [&_.article-highlight_li]:font-medium [&_.article-highlight_li]:text-[1rem] [&_.article-highlight_li]:leading-relaxed

                  [&_.article-tip]:bg-brand-dark [&_.article-tip]:text-white [&_.article-tip]:rounded-2xl
                  [&_.article-tip]:py-7 [&_.article-tip]:px-7 [&_.article-tip]:my-12
                  [&_.article-tip]:not-prose
                  [&_.article-tip_p]:text-white/80 [&_.article-tip_p]:font-light [&_.article-tip_p]:text-[0.95rem]
                  [&_.article-tip_p]:leading-relaxed [&_.article-tip_p]:mb-3 [&_.article-tip_p:last-of-type]:mb-0
                  [&_.article-tip_strong]:text-brand-gold [&_.article-tip_strong]:font-bold [&_.article-tip_strong]:text-base
                  [&_.article-tip_ul]:mt-3 [&_.article-tip_ul]:mb-0 [&_.article-tip_ul]:space-y-1
                  [&_.article-tip_li]:text-white/80 [&_.article-tip_li]:font-light [&_.article-tip_li]:text-[0.95rem]
                  [&_.article-tip_a.tip-btn]:inline-flex [&_.article-tip_a.tip-btn]:items-center [&_.article-tip_a.tip-btn]:gap-2
                  [&_.article-tip_a.tip-btn]:bg-brand-gold [&_.article-tip_a.tip-btn]:text-brand-dark [&_.article-tip_a.tip-btn]:no-underline
                  [&_.article-tip_a.tip-btn]:px-6 [&_.article-tip_a.tip-btn]:py-3 [&_.article-tip_a.tip-btn]:rounded-full
                  [&_.article-tip_a.tip-btn]:text-sm [&_.article-tip_a.tip-btn]:font-bold [&_.article-tip_a.tip-btn]:uppercase [&_.article-tip_a.tip-btn]:tracking-wider
                  [&_.article-tip_a.tip-btn]:mt-4 hover:[&_.article-tip_a.tip-btn]:bg-white [&_.article-tip_a.tip-btn]:transition-all [&_.article-tip_a.tip-btn]:duration-300

                  [&_.article-quote]:border-l-4 [&_.article-quote]:border-brand-gold [&_.article-quote]:pl-6 [&_.article-quote]:pr-2
                  [&_.article-quote]:py-4 [&_.article-quote]:my-12 [&_.article-quote]:bg-transparent
                  [&_.article-quote_p]:text-brand-dark [&_.article-quote_p]:text-lg [&_.article-quote_p]:lg:text-xl
                  [&_.article-quote_p]:font-medium [&_.article-quote_p]:italic [&_.article-quote_p]:leading-relaxed [&_.article-quote_p]:mb-0

                  [&_.article-figure]:my-12 [&_.article-figure]:lg:my-16 [&_.article-figure]:not-prose
                  [&_.article-figure_img]:w-full [&_.article-figure_img]:rounded-2xl [&_.article-figure_img]:shadow-lg [&_.article-figure_img]:mb-3
                  [&_.article-figure_figcaption]:text-center [&_.article-figure_figcaption]:text-gray-400
                  [&_.article-figure_figcaption]:text-sm [&_.article-figure_figcaption]:font-light [&_.article-figure_figcaption]:italic

                  [&_.article-case-study]:bg-[#FAFAFA] [&_.article-case-study]:border-l-4 [&_.article-case-study]:border-brand-gold
                  [&_.article-case-study]:rounded-r-2xl [&_.article-case-study]:py-6 [&_.article-case-study]:px-7 [&_.article-case-study]:my-12
                  [&_.article-case-study]:not-prose
                  [&_.article-case-study_.case-study-label]:text-[10px] [&_.article-case-study_.case-study-label]:tracking-[0.2em]
                  [&_.article-case-study_.case-study-label]:uppercase [&_.article-case-study_.case-study-label]:text-brand-gold
                  [&_.article-case-study_.case-study-label]:font-bold [&_.article-case-study_.case-study-label]:mb-3 [&_.article-case-study_.case-study-label]:block
                  [&_.article-case-study_h3]:text-xl [&_.article-case-study_h3]:font-bold [&_.article-case-study_h3]:text-brand-dark
                  [&_.article-case-study_h3]:mb-3 [&_.article-case-study_h3]:mt-0
                  [&_.article-case-study_p]:text-gray-600 [&_.article-case-study_p]:font-light [&_.article-case-study_p]:text-[1.05rem]
                  [&_.article-case-study_p]:leading-relaxed [&_.article-case-study_p]:mb-3 [&_.article-case-study_p:last-child]:mb-0
                  [&_.article-case-study_strong]:text-brand-dark [&_.article-case-study_strong]:font-semibold
                  [&_.article-case-study_ul]:mt-2 [&_.article-case-study_ul]:mb-0 [&_.article-case-study_ul]:space-y-1
                  [&_.article-case-study_li]:text-gray-600 [&_.article-case-study_li]:font-light [&_.article-case-study_li]:text-[0.95rem]

                  [&_.article-cta]:bg-brand-gold/10 [&_.article-cta]:border [&_.article-cta]:border-brand-gold/20
                  [&_.article-cta]:rounded-2xl [&_.article-cta]:py-8 [&_.article-cta]:px-7 [&_.article-cta]:my-12 [&_.article-cta]:text-center
                  [&_.article-cta]:not-prose
                  [&_.article-cta_p]:text-brand-dark [&_.article-cta_p]:text-lg [&_.article-cta_p]:font-medium
                  [&_.article-cta_p]:leading-relaxed [&_.article-cta_p]:mb-4 [&_.article-cta_p:last-child]:mb-0
                  [&_.article-cta_a.cta-btn]:inline-flex [&_.article-cta_a.cta-btn]:items-center [&_.article-cta_a.cta-btn]:gap-2
                  [&_.article-cta_a.cta-btn]:bg-brand-dark [&_.article-cta_a.cta-btn]:text-white [&_.article-cta_a.cta-btn]:no-underline
                  [&_.article-cta_a.cta-btn]:px-7 [&_.article-cta_a.cta-btn]:py-3.5 [&_.article-cta_a.cta-btn]:rounded-full
                  [&_.article-cta_a.cta-btn]:text-sm [&_.article-cta_a.cta-btn]:font-bold [&_.article-cta_a.cta-btn]:uppercase [&_.article-cta_a.cta-btn]:tracking-wider
                  hover:[&_.article-cta_a.cta-btn]:bg-brand-gold hover:[&_.article-cta_a.cta-btn]:text-brand-dark
                  [&_.article-cta_a.cta-btn]:transition-all [&_.article-cta_a.cta-btn]:duration-300

                  [&_.article-tldr-label]:text-[10px] [&_.article-tldr-label]:tracking-[0.2em] [&_.article-tldr-label]:uppercase
                  [&_.article-tldr-label]:text-brand-gold [&_.article-tldr-label]:font-bold [&_.article-tldr-label]:mb-3 [&_.article-tldr-label]:block
                "
                dangerouslySetInnerHTML={{ __html: content.content }}
              />

              {/* ==================== TAGS ==================== */}
              {article.tags && article.tags.length > 0 && (
                <div className="mt-14 pt-8 border-t border-gray-100">
                  <p className="text-[10px] tracking-[0.2em] uppercase text-brand-gold font-bold mb-4">
                    {lang === 'sk' ? 'Štítky' : 'Tags'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                      <Link
                        key={tag}
                        to={`/blog?tag=${encodeURIComponent(tag)}`}
                        className="inline-block text-sm font-light text-gray-500 bg-[#FAFAFA] hover:bg-brand-gold/10 hover:text-brand-dark px-4 py-1.5 rounded-full transition-all duration-300"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* ==================== FAQ SECTION ==================== */}
              {content.faqs && content.faqs.length > 0 && (
                <div className="mt-14 pt-8 border-t border-gray-100">
                  <p className="text-[10px] tracking-[0.2em] uppercase text-brand-gold font-bold mb-6">
                    {lang === 'sk' ? 'Časté otázky' : 'Frequently Asked Questions'}
                  </p>
                  <div className="space-y-4">
                    {content.faqs.map((faq, idx) => (
                      <details
                        key={idx}
                        className="group bg-[#FAFAFA] rounded-2xl overflow-hidden"
                      >
                        <summary className="flex items-center justify-between cursor-pointer p-5 lg:p-6 text-brand-dark font-semibold text-[1.05rem] leading-snug list-none [&::-webkit-details-marker]:hidden">
                          <span className="pr-4">{faq.question}</span>
                          <ChevronDown
                            size={18}
                            className="flex-shrink-0 text-brand-gold transition-transform duration-300 group-open:rotate-180"
                          />
                        </summary>
                        <div className="px-5 lg:px-6 pb-5 lg:pb-6 -mt-1">
                          <p className="text-gray-600 font-light text-[1.05rem] leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              )}

              {/* ==================== SOCIAL SHARE ==================== */}
              <div className="mt-10 pt-8 border-t border-gray-100">
                <p className="text-[10px] tracking-[0.2em] uppercase text-brand-gold font-bold mb-4">
                  {lang === 'sk' ? 'Zdieľať článok' : 'Share article'}
                </p>
                <div className="flex items-center gap-3">
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-[#FAFAFA] hover:bg-[#0077B5] hover:text-white flex items-center justify-center text-gray-400 transition-all duration-300"
                    aria-label="Share on LinkedIn"
                  >
                    <Linkedin size={18} />
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-[#FAFAFA] hover:bg-[#1877F2] hover:text-white flex items-center justify-center text-gray-400 transition-all duration-300"
                    aria-label="Share on Facebook"
                  >
                    <Facebook size={18} />
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-[#FAFAFA] hover:bg-black hover:text-white flex items-center justify-center text-gray-400 transition-all duration-300"
                    aria-label="Share on X"
                  >
                    <Twitter size={18} />
                  </a>
                  <button
                    onClick={copyLink}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      linkCopied
                        ? 'bg-green-500 text-white'
                        : 'bg-[#FAFAFA] text-gray-400 hover:bg-brand-gold hover:text-brand-dark'
                    }`}
                    aria-label={linkCopied ? 'Link copied!' : 'Copy link'}
                  >
                    {linkCopied ? <Check size={18} /> : <LinkIcon size={18} />}
                  </button>
                </div>
              </div>

              {/* ==================== AUTHOR BIO ==================== */}
              {article.author && (
                <div className="mt-10 pt-8 border-t border-gray-100">
                  <div className="bg-[#FAFAFA] rounded-2xl p-6 lg:p-8 flex flex-col sm:flex-row gap-5 items-start">
                    {article.author.avatar && (
                      <img
                        src={article.author.avatar}
                        alt={article.author.name}
                        className="w-16 h-16 rounded-full object-cover flex-shrink-0 border-2 border-brand-gold/20"
                      />
                    )}
                    <div>
                      <p className="text-[10px] tracking-[0.2em] uppercase text-brand-gold font-bold mb-1">
                        {lang === 'sk' ? 'Autor článku' : 'Written by'}
                      </p>
                      <p className="text-lg font-bold text-brand-dark mb-2">
                        {article.author.name}
                      </p>
                      <p className="text-gray-500 text-sm font-light leading-relaxed mb-3">
                        {lang === 'sk'
                          ? 'Tím OROSTONE sa špecializuje na sinterovaný kameň a povrchové materiály prémiového segmentu. S dlhoročnými skúsenosťami v oblasti interiérového dizajnu a materiálového inžinierstva vám pomôžeme nájsť ideálne riešenie.'
                          : 'The OROSTONE team specializes in sintered stone and premium surface materials. With years of experience in interior design and material engineering, we help you find the ideal solution.'}
                      </p>
                      <Link
                        to="/kontakt"
                        className="inline-flex items-center gap-2 text-brand-gold text-sm font-bold hover:underline"
                      >
                        {lang === 'sk' ? 'Kontaktovať nás' : 'Contact us'}
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      </article>
      {/* End semantic article wrapper */}

      {/* ==================== BACK TO TOP BUTTON ==================== */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full bg-brand-dark text-white shadow-lg hover:bg-brand-gold hover:text-brand-dark transition-all duration-300 flex items-center justify-center"
            aria-label="Back to top"
          >
            <ArrowUp size={18} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ==================== RELATED ARTICLES ==================== */}
      {relatedArticles.length > 0 && (
        <section className="related-section py-16 lg:py-24 bg-[#FAFAFA] border-t border-gray-100">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-10 lg:mb-14">
              <span className="text-[11px] tracking-[0.3em] uppercase text-brand-gold font-bold mb-3 block">
                {labels.related}
              </span>
              <h2 className="text-2xl lg:text-3xl font-sans font-bold text-brand-dark">
                {labels.related}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {relatedArticles.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/blog/${rel.slug}`}
                  className="group"
                >
                  <article className="bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-500 h-full flex flex-col">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={rel.heroImage}
                        alt={rel[lang].title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                      <span className="absolute top-4 left-4 inline-block text-[10px] tracking-[0.15em] uppercase font-bold text-brand-dark bg-brand-gold/90 px-3 py-1 rounded-full">
                        {BLOG_CATEGORY_LABELS[rel.category]?.[lang] ?? rel.category}
                      </span>
                    </div>
                    <div className="p-5 lg:p-6 flex flex-col flex-grow">
                      <h3 className="text-lg font-bold text-brand-dark font-sans mb-2 leading-snug group-hover:text-brand-gold transition-colors duration-300">
                        {rel[lang].title}
                      </h3>
                      <p className="text-gray-400 text-sm font-light leading-relaxed line-clamp-2 mb-4 flex-grow">
                        {rel[lang].excerpt}
                      </p>
                      <div className="flex items-center gap-1.5 text-brand-gold text-xs font-bold uppercase tracking-[0.15em] group-hover:gap-2.5 transition-all duration-300 mt-auto">
                        {labels.readMore}
                        <ArrowRight size={13} />
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
