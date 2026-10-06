import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowUp,
  Linkedin,
  Facebook,
  Twitter,
  LinkIcon,
  Check,
} from 'lucide-react';
import type { BlogLanguage } from '../data/blogTypes';
import { BLOG_CATEGORY_LABELS } from '../data/blogTypes';
import { BLOG_ARTICLES } from '../data/blogArticles';
import { SEOHead } from '../components/UI/SEOHead';
import { ActionButton, Container, Eyebrow, FaqList, GoldBand, Section, SectionHeader, TextLink } from '../components/Design';
import { BlogCard } from '../components/Blog/BlogCard';
import { keepUnits } from '../lib/utils';

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

/**
 * Several articles open their content with the hero photo again. The head already shows it, so that first
 * figure is taken out of the body and its alt text and caption move to the head image (no text is lost).
 */
const FIRST_FIGURE = /<figure class="article-figure">\s*<img([^>]*)>([\s\S]*?)<\/figure>/;
const splitHeroFigure = (html: string, heroImage: string) => {
  const m = FIRST_FIGURE.exec(html);
  const src = m?.[1].match(/src="([^"]+)"/)?.[1];
  if (!m || src !== heroImage) return { html, alt: undefined, caption: undefined };
  return {
    html: html.slice(0, m.index) + html.slice(m.index + m[0].length),
    alt: m[1].match(/alt="([^"]*)"/)?.[1],
    caption: m[2].match(/<figcaption>([\s\S]*?)<\/figcaption>/)?.[1].replace(/<[^>]*>/g, '').trim(),
  };
};

/** Header grid shared by the article head and body, so the H1 and the text start on the same line from 1280 px. */
const ARTICLE_GRID = 'xl:grid xl:grid-cols-[220px_minmax(0,760px)] xl:justify-center xl:gap-x-20';

const label = 'text-os-eyebrow uppercase text-brand-muted';

/**
 * Typography of the article HTML (data/articles): body text, headings, links, tables and the
 * content blocks the articles use (.article-tldr, -highlight, -tip, -quote, -figure, -case-study, -cta).
 * Gold stays an accent: the .gold emphasis is graphite text on a gold marker, never gold text on white.
 */
const PROSE = `
  prose prose-lg max-w-none
  prose-headings:font-sans prose-headings:font-semibold prose-headings:text-brand-dark prose-headings:tracking-[-0.01em]
  prose-h2:text-[clamp(1.45rem,2vw,1.85rem)] prose-h2:mt-16 prose-h2:mb-6 prose-h2:leading-tight prose-h2:scroll-mt-28
  prose-h3:text-[1.22rem] prose-h3:mt-10 prose-h3:mb-4 prose-h3:leading-snug prose-h3:scroll-mt-28
  prose-p:text-brand-dark/85 prose-p:font-light prose-p:leading-[1.8] prose-p:mb-7 prose-p:text-[1.06rem]
  prose-a:font-medium prose-a:text-brand-dark prose-a:underline prose-a:decoration-brand-gold prose-a:decoration-2 prose-a:underline-offset-4 hover:prose-a:decoration-brand-dark
  prose-strong:text-brand-dark prose-strong:font-semibold
  [&_.gold]:font-semibold [&_.gold]:text-brand-dark [&_.gold]:[background:linear-gradient(transparent_62%,rgba(236,212,136,0.65)_0)]
  prose-ul:my-6 prose-ul:space-y-2 prose-ol:my-6 prose-li:text-brand-dark/85 prose-li:font-light prose-li:leading-relaxed prose-li:text-[1.04rem] prose-li:marker:text-brand-muted
  prose-img:rounded-[3px] prose-img:my-12 prose-img:aspect-[16/10] prose-img:object-cover prose-img:bg-brand-sand
  prose-blockquote:border-l-2 prose-blockquote:border-brand-dark prose-blockquote:text-brand-dark/80 prose-blockquote:font-light prose-blockquote:italic prose-blockquote:my-12
  prose-table:text-[0.95rem] prose-thead:border-b prose-thead:border-brand-dark prose-th:py-3 prose-th:px-3 prose-th:font-semibold prose-th:text-left
  prose-tr:border-brand-line prose-td:py-3 prose-td:px-3 prose-td:font-light

  [&_.article-tldr-label]:mb-3 [&_.article-tldr-label]:block [&_.article-tldr-label]:text-[0.74rem] [&_.article-tldr-label]:font-bold
  [&_.article-tldr-label]:uppercase [&_.article-tldr-label]:tracking-[0.2em] [&_.article-tldr-label]:text-brand-muted

  [&_.article-tldr]:my-0 [&_.article-tldr]:mb-12 [&_.article-tldr]:list-none [&_.article-tldr]:rounded-[3px] [&_.article-tldr]:bg-brand-sand
  [&_.article-tldr]:px-7 [&_.article-tldr]:py-6 [&_.article-tldr]:pl-7
  [&_.article-tldr>li]:mb-2 [&_.article-tldr>li:last-child]:mb-0 [&_.article-tldr>li]:pl-0 [&_.article-tldr>li]:text-base
  [&_.article-tldr>li]:font-medium [&_.article-tldr>li]:text-brand-dark
  [&_.article-tldr>li]:before:mr-3 [&_.article-tldr>li]:before:text-brand-gold [&_.article-tldr>li]:before:content-['◆']

  [&_.article-highlight]:not-prose [&_.article-highlight]:my-10 [&_.article-highlight]:rounded-r-[3px] [&_.article-highlight]:border-l-2
  [&_.article-highlight]:border-brand-dark [&_.article-highlight]:bg-brand-sand [&_.article-highlight]:px-6 [&_.article-highlight]:py-5
  [&_.article-highlight_p]:mb-3 [&_.article-highlight_p:last-child]:mb-0 [&_.article-highlight_p]:text-[1.04rem]
  [&_.article-highlight_p]:font-medium [&_.article-highlight_p]:leading-relaxed [&_.article-highlight_p]:text-brand-dark
  [&_.article-highlight_strong]:font-semibold [&_.article-highlight_strong]:text-brand-dark
  [&_.article-highlight_ul]:mb-0 [&_.article-highlight_ul]:mt-3 [&_.article-highlight_ul]:list-disc [&_.article-highlight_ul]:space-y-1.5 [&_.article-highlight_ul]:pl-5
  [&_.article-highlight_li]:text-[1rem] [&_.article-highlight_li]:font-medium [&_.article-highlight_li]:leading-relaxed [&_.article-highlight_li]:text-brand-dark

  [&_.article-tip]:not-prose [&_.article-tip]:my-12 [&_.article-tip]:rounded-[3px] [&_.article-tip]:bg-brand-dark [&_.article-tip]:px-7
  [&_.article-tip]:py-7 [&_.article-tip]:text-brand-light
  [&_.article-tip_p]:mb-3 [&_.article-tip_p:last-of-type]:mb-0 [&_.article-tip_p]:text-[0.98rem] [&_.article-tip_p]:font-light
  [&_.article-tip_p]:leading-relaxed [&_.article-tip_p]:text-brand-light/80
  [&_.article-tip_strong]:font-semibold [&_.article-tip_strong]:text-brand-gold
  [&_.article-tip_ul]:mb-0 [&_.article-tip_ul]:mt-3 [&_.article-tip_ul]:space-y-1
  [&_.article-tip_li]:text-[0.98rem] [&_.article-tip_li]:font-light [&_.article-tip_li]:text-brand-light/80
  [&_.article-tip_a]:text-brand-light [&_.article-tip_a]:underline [&_.article-tip_a]:decoration-brand-gold [&_.article-tip_a]:underline-offset-4
  [&_.article-tip_a.tip-btn]:mt-4 [&_.article-tip_a.tip-btn]:inline-flex [&_.article-tip_a.tip-btn]:min-h-[48px] [&_.article-tip_a.tip-btn]:items-center
  [&_.article-tip_a.tip-btn]:gap-2 [&_.article-tip_a.tip-btn]:rounded-[10px] [&_.article-tip_a.tip-btn]:bg-brand-light [&_.article-tip_a.tip-btn]:px-6
  [&_.article-tip_a.tip-btn]:text-[0.78rem] [&_.article-tip_a.tip-btn]:font-bold [&_.article-tip_a.tip-btn]:uppercase [&_.article-tip_a.tip-btn]:tracking-[0.12em]
  [&_.article-tip_a.tip-btn]:text-brand-dark [&_.article-tip_a.tip-btn]:no-underline [&_.article-tip_a.tip-btn]:transition-colors hover:[&_.article-tip_a.tip-btn]:bg-white

  [&_.article-quote]:my-12 [&_.article-quote]:border-l-2 [&_.article-quote]:border-brand-dark [&_.article-quote]:bg-transparent [&_.article-quote]:py-2 [&_.article-quote]:pl-6
  [&_.article-quote_p]:mb-0 [&_.article-quote_p]:text-[1.2rem] [&_.article-quote_p]:font-light [&_.article-quote_p]:italic
  [&_.article-quote_p]:leading-relaxed [&_.article-quote_p]:text-brand-dark

  [&_.article-figure]:not-prose [&_.article-figure]:my-12 [&_.article-figure]:lg:my-14
  [&_.article-figure_img]:mb-3 [&_.article-figure_img]:aspect-[16/10] [&_.article-figure_img]:w-full [&_.article-figure_img]:rounded-[3px]
  [&_.article-figure_img]:bg-brand-sand [&_.article-figure_img]:object-cover
  [&_.article-figure_figcaption]:text-[0.84rem] [&_.article-figure_figcaption]:font-normal [&_.article-figure_figcaption]:text-brand-muted

  [&_.article-case-study]:not-prose [&_.article-case-study]:my-12 [&_.article-case-study]:rounded-r-[3px] [&_.article-case-study]:border-l-2
  [&_.article-case-study]:border-brand-dark [&_.article-case-study]:bg-brand-sand [&_.article-case-study]:px-7 [&_.article-case-study]:py-6
  [&_.article-case-study_.case-study-label]:mb-3 [&_.article-case-study_.case-study-label]:block [&_.article-case-study_.case-study-label]:text-[0.74rem]
  [&_.article-case-study_.case-study-label]:font-bold [&_.article-case-study_.case-study-label]:uppercase [&_.article-case-study_.case-study-label]:tracking-[0.2em]
  [&_.article-case-study_.case-study-label]:text-brand-muted
  [&_.article-case-study_h3]:mb-3 [&_.article-case-study_h3]:mt-0 [&_.article-case-study_h3]:text-[1.22rem] [&_.article-case-study_h3]:font-semibold
  [&_.article-case-study_p]:mb-3 [&_.article-case-study_p:last-child]:mb-0 [&_.article-case-study_p]:text-[1.04rem] [&_.article-case-study_p]:font-light
  [&_.article-case-study_p]:leading-relaxed [&_.article-case-study_p]:text-brand-dark/85
  [&_.article-case-study_strong]:font-semibold [&_.article-case-study_strong]:text-brand-dark
  [&_.article-case-study_ul]:mb-0 [&_.article-case-study_ul]:mt-2 [&_.article-case-study_ul]:space-y-1
  [&_.article-case-study_li]:text-[0.98rem] [&_.article-case-study_li]:font-light [&_.article-case-study_li]:text-brand-dark/85

  [&_.article-cta]:not-prose [&_.article-cta]:my-12 [&_.article-cta]:rounded-[3px] [&_.article-cta]:border [&_.article-cta]:border-brand-line
  [&_.article-cta]:bg-brand-sand [&_.article-cta]:px-7 [&_.article-cta]:py-8
  [&_.article-cta_p]:mb-4 [&_.article-cta_p:last-child]:mb-0 [&_.article-cta_p]:text-[1.1rem] [&_.article-cta_p]:font-medium
  [&_.article-cta_p]:leading-relaxed [&_.article-cta_p]:text-brand-dark
  [&_.article-cta_a.cta-btn]:inline-flex [&_.article-cta_a.cta-btn]:min-h-[52px] [&_.article-cta_a.cta-btn]:items-center [&_.article-cta_a.cta-btn]:gap-2
  [&_.article-cta_a.cta-btn]:rounded-[10px] [&_.article-cta_a.cta-btn]:bg-brand-dark [&_.article-cta_a.cta-btn]:px-7 [&_.article-cta_a.cta-btn]:text-[0.78rem]
  [&_.article-cta_a.cta-btn]:font-bold [&_.article-cta_a.cta-btn]:uppercase [&_.article-cta_a.cta-btn]:tracking-[0.12em] [&_.article-cta_a.cta-btn]:text-brand-light
  [&_.article-cta_a.cta-btn]:no-underline [&_.article-cta_a.cta-btn]:transition-colors hover:[&_.article-cta_a.cta-btn]:bg-[#333331]
`;

// ===========================================
// COMPONENT
// ===========================================

export const BlogArticle: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const progressBarRef = useRef<HTMLDivElement>(null);
  const showBackToTopRef = useRef(false);
  const [lang, setLang] = useState<BlogLanguage>('sk');
  const [activeHeading, setActiveHeading] = useState<string>('');
  const [showBackToTop, setShowBackToTop] = useState(false);
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

  // Inject loading="lazy" + decoding="async" into inline <img> tags BEFORE first paint.
  // Previously this was done post-mount in a useEffect, which forced an extra layout
  // pass and downloaded above-the-fold images eagerly on mobile (LCP regression).
  const { articleHtml, heroAlt, heroCaption } = useMemo(() => {
    if (!article) return { articleHtml: '', heroAlt: undefined, heroCaption: undefined };
    const { html, alt, caption } = splitHeroFigure(article[lang].content, article.heroImage);
    return {
      articleHtml: html.replace(/<img\s+(?![^>]*\bloading=)/gi, '<img loading="lazy" decoding="async" '),
      heroAlt: alt,
      heroCaption: caption,
    };
  }, [article, lang]);

  // Labels
  const labels = {
    backToBlog: lang === 'sk' ? 'Späť na blog' : 'Back to blog',
    readTime: lang === 'sk' ? 'min čítania' : 'min read',
    directAnswer: lang === 'sk' ? 'Rýchla odpoveď' : 'Quick answer',
    toc: lang === 'sk' ? 'Obsah článku' : 'Table of contents',
    related: lang === 'sk' ? 'Súvisiace články' : 'Related articles',
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
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0;

        if (progressBarRef.current) {
          progressBarRef.current.style.width = `${progress}%`;
        }

        const shouldShow = scrollTop > 500;
        if (shouldShow !== showBackToTopRef.current) {
          showBackToTopRef.current = shouldShow;
          setShowBackToTop(shouldShow);
        }
        ticking = false;
      });
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

  const goToHeading = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // ===========================================
  // 404 STATE
  // ===========================================

  if (!article) {
    return (
      <Section tone="chalk" className="min-h-[60dvh]">
        <SEOHead
          title="Článok nebol nájdený | OROSTONE Blog"
          description="Článok, ktorý hľadáte, neexistuje."
          noindex={true}
        />
        <Container className="grid justify-items-start gap-5">
          <Eyebrow>404</Eyebrow>
          <h1 className="text-os-h1">{labels.notFoundTitle}</h1>
          <p className="max-w-[54ch] text-os-lead font-light text-brand-muted">{labels.notFoundText}</p>
          <ActionButton variant="dark" to="/blog">
            {labels.goBack}
          </ActionButton>
        </Container>
      </Section>
    );
  }

  const content = article[lang];

  // Canonical URL
  const canonicalUrl = `https://orostone.sk/blog/${article.slug}`;

  return (
    <div>
      {/* ==================== SEO HEAD ==================== */}
      {/* Prefer per-article Vera FINAL meta (Phase 2/3 metaTitle/metaDescription
          fields on each article SK locale) with safe fallback to legacy shape
          for any article that does not yet have them populated. */}
      <SEOHead
        title={content.metaTitle || `${content.title} | OROSTONE`}
        description={content.metaDescription || content.directAnswer || content.excerpt}
        ogType="article"
        ogImage={article.heroImage}
        canonical={canonicalUrl}
      />

      {/* BlogPosting + BreadcrumbList + FAQPage JSON-LD are generated
          by prerender.ts and injected into <head> at build time.
          Do NOT duplicate them here — React hydration would create
          a second copy of each script tag. */}

      {/* ==================== READING PROGRESS BAR ==================== */}
      <div
        ref={progressBarRef}
        className="fixed left-0 top-0 z-[100] h-[2px] bg-brand-gold will-change-[width]"
        style={{ width: '0%' }}
        aria-hidden="true"
      />

      {/* ==================== SEMANTIC ARTICLE WRAPPER ==================== */}
      <article itemScope itemType="https://schema.org/BlogPosting">
        {/* ==================== HEAD ==================== */}
        <header className="bg-brand-light pt-[clamp(28px,4vw,56px)]">
          <Container className={ARTICLE_GRID}>
            <div className="mb-8 flex items-center justify-between gap-6 xl:col-span-2">
              <Link
                to="/blog"
                className="inline-flex min-h-[44px] items-center gap-2 text-[0.9rem] font-medium no-underline hover:underline"
              >
                <ArrowLeft size={16} strokeWidth={1.75} aria-hidden="true" />
                {labels.backToBlog}
              </Link>
              <button
                type="button"
                onClick={() => setLang((prev) => (prev === 'sk' ? 'en' : 'sk'))}
                className="min-h-[44px] rounded-full border border-brand-line px-4 text-[0.82rem] font-semibold tracking-[0.08em] transition-colors hover:border-brand-dark"
                aria-label={lang === 'sk' ? 'Read in English' : 'Čítať po slovensky'}
              >
                {lang === 'sk' ? 'EN' : 'SK'}
              </button>
            </div>
            <div className="xl:col-start-2">
              <div className="grid justify-items-start gap-5">
                <Eyebrow>{BLOG_CATEGORY_LABELS[article.category]?.[lang] ?? article.category}</Eyebrow>
                <h1 className="max-w-[24ch] text-[clamp(1.95rem,3.1vw,3.2rem)] font-semibold leading-[1.1] tracking-[-0.02em] [text-wrap:balance]">
                  {keepUnits(content.title)}
                </h1>
                {content.subtitle && <p className="max-w-[58ch] text-os-lead font-light text-brand-muted">{content.subtitle}</p>}
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.88rem] font-normal text-brand-muted">
                  <time dateTime={article.publishDate} itemProp="datePublished">
                    {formatDate(article.publishDate, lang)}
                  </time>
                  {article.lastModified && article.lastModified !== article.publishDate && (
                    <time dateTime={article.lastModified} itemProp="dateModified" className="hidden" />
                  )}
                  <span className="tabular-nums">
                    {article.readTimeMinutes} {labels.readTime}
                  </span>
                  {article.author && (
                    <span className="flex items-center gap-2" itemProp="author" itemScope itemType="https://schema.org/Person">
                      {article.author.avatar && (
                        <img src={article.author.avatar} alt={article.author.name} width={24} height={24} className="h-6 w-6 rounded-full object-cover" />
                      )}
                      <span itemProp="name">{article.author.name}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
            <figure className="m-0 mt-[clamp(32px,4vw,56px)] xl:col-span-2">
              <img
                src={article.heroImage}
                alt={heroAlt || content.title}
                width={1376}
                height={768}
                fetchPriority="high"
                decoding="async"
                loading="eager"
                className="aspect-[16/9] w-full rounded-[3px] bg-brand-sand object-cover"
              />
              {heroCaption && <figcaption className="mt-3 text-[0.84rem] font-normal text-brand-muted">{heroCaption}</figcaption>}
            </figure>
          </Container>
        </header>

        {/* ==================== ARTICLE BODY ==================== */}
        <Section tone="chalk" className="!pt-[clamp(40px,5vw,72px)]">
          <Container className={ARTICLE_GRID}>
            {/* Sticky Table of Contents — Desktop Only */}
            <aside className="hidden xl:block">
              {headings.length > 0 && (
                <div className="sticky top-28">
                  <p className={`${label} mb-4`}>{labels.toc}</p>
                  <nav className="flex flex-col border-l border-brand-line" aria-label={labels.toc}>
                    {headings.map((h) => (
                      <a
                        key={h.id}
                        href={`#${h.id}`}
                        onClick={goToHeading(h.id)}
                        className={`-ml-px border-l-2 py-1.5 text-[0.88rem] leading-snug no-underline transition-colors duration-200 ${
                          h.level === 3 ? 'pl-7' : 'pl-4'
                        } ${
                          activeHeading === h.id
                            ? 'border-brand-dark font-medium text-brand-dark'
                            : 'border-transparent font-normal text-brand-muted hover:text-brand-dark'
                        }`}
                      >
                        {h.text}
                      </a>
                    ))}
                  </nav>
                </div>
              )}
            </aside>

            {/* Main Content */}
            <div className="min-w-0 max-w-[760px]">
              {/* Direct Answer — native details: the answer stays in the DOM even when folded */}
              {content.directAnswer && (
                <details open className="group mb-10 rounded-[3px] bg-brand-sand">
                  <summary className="flex min-h-[48px] cursor-pointer list-none items-center justify-between gap-4 px-6 pt-5 [&::-webkit-details-marker]:hidden">
                    <span className={label}>{labels.directAnswer}</span>
                    <span
                      aria-hidden="true"
                      className="relative h-3 w-3 flex-none before:absolute before:left-0 before:top-1/2 before:h-px before:w-full before:bg-current after:absolute after:left-1/2 after:top-0 after:h-full after:w-px after:bg-current after:transition-transform group-open:after:scale-y-0"
                    />
                  </summary>
                  <p className="px-6 pb-6 pt-2 text-[1.08rem] font-medium leading-relaxed text-brand-dark">{content.directAnswer}</p>
                </details>
              )}

              {/* Mobile Table of Contents */}
              {headings.length > 0 && (
                <details className="group mb-10 border-y border-brand-line xl:hidden">
                  <summary className="flex min-h-[52px] cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                    <span className={label}>{labels.toc}</span>
                    <span
                      aria-hidden="true"
                      className="relative h-3 w-3 flex-none before:absolute before:left-0 before:top-1/2 before:h-px before:w-full before:bg-current after:absolute after:left-1/2 after:top-0 after:h-full after:w-px after:bg-current after:transition-transform group-open:after:scale-y-0"
                    />
                  </summary>
                  <nav className="flex flex-col pb-4" aria-label={labels.toc}>
                    {headings.map((h) => (
                      <a
                        key={h.id}
                        href={`#${h.id}`}
                        onClick={(e) => {
                          (e.currentTarget.closest('details') as HTMLDetailsElement | null)?.removeAttribute('open');
                          goToHeading(h.id)(e);
                        }}
                        className={`py-2 text-[0.95rem] leading-snug no-underline ${h.level === 3 ? 'pl-5' : ''} ${
                          activeHeading === h.id ? 'font-medium text-brand-dark' : 'font-normal text-brand-muted'
                        }`}
                      >
                        {h.text}
                      </a>
                    ))}
                  </nav>
                </details>
              )}

              {/* HTML Content */}
              <div className={PROSE} dangerouslySetInnerHTML={{ __html: articleHtml }} />

              {/* ==================== TAGS ==================== */}
              {article.tags && article.tags.length > 0 && (
                <div className="mt-14 border-t border-brand-line pt-8">
                  <p className={`${label} mb-4`}>{lang === 'sk' ? 'Štítky' : 'Tags'}</p>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                      <Link
                        key={tag}
                        to={`/blog?tag=${encodeURIComponent(tag)}`}
                        className="inline-flex min-h-[40px] items-center rounded-full border border-brand-line px-4 text-[0.88rem] font-normal no-underline transition-colors hover:border-brand-dark"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* ==================== FAQ SECTION ==================== */}
              {content.faqs && content.faqs.length > 0 && (
                <div className="mt-14">
                  <p className={`${label} mb-2`}>{lang === 'sk' ? 'Časté otázky' : 'Frequently Asked Questions'}</p>
                  <FaqList items={content.faqs} />
                </div>
              )}

              {/* ==================== SOCIAL SHARE ==================== */}
              <div className="mt-12 flex flex-wrap items-center justify-between gap-5 border-t border-brand-line pt-8">
                <p className={label}>{lang === 'sk' ? 'Zdieľať článok' : 'Share article'}</p>
                <div className="flex items-center gap-2">
                  {[
                    { href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, label: 'Share on LinkedIn', Icon: Linkedin },
                    { href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, label: 'Share on Facebook', Icon: Facebook },
                    { href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`, label: 'Share on X', Icon: Twitter },
                  ].map(({ href, label: aria, Icon }) => (
                    <a
                      key={aria}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="grid h-11 w-11 place-items-center rounded-full border border-brand-line transition-colors hover:border-brand-dark"
                      aria-label={aria}
                    >
                      <Icon size={17} strokeWidth={1.6} />
                    </a>
                  ))}
                  <button
                    type="button"
                    onClick={copyLink}
                    className={`grid h-11 w-11 place-items-center rounded-full border transition-colors ${
                      linkCopied ? 'border-brand-dark bg-brand-dark text-brand-light' : 'border-brand-line hover:border-brand-dark'
                    }`}
                    aria-label={linkCopied ? 'Link copied!' : 'Copy link'}
                  >
                    {linkCopied ? <Check size={17} strokeWidth={1.75} /> : <LinkIcon size={17} strokeWidth={1.6} />}
                  </button>
                </div>
              </div>

              {/* ==================== AUTHOR BIO ==================== */}
              {article.author && (
                <div className="mt-10 flex flex-col items-start gap-5 rounded-[3px] bg-brand-sand p-[clamp(24px,3vw,36px)] sm:flex-row">
                  {article.author.avatar && (
                    <img
                      src={article.author.avatar}
                      alt={article.author.name}
                      width={64}
                      height={64}
                      loading="lazy"
                      className="h-16 w-16 flex-none rounded-full object-cover"
                    />
                  )}
                  <div className="grid justify-items-start gap-2">
                    <p className={label}>{lang === 'sk' ? 'Autor článku' : 'Written by'}</p>
                    <p className="text-[1.15rem] font-semibold">{article.author.name}</p>
                    <p className="max-w-[60ch] text-[0.96rem] font-light leading-relaxed text-brand-muted">
                      {lang === 'sk'
                        ? 'Tím OROSTONE sa špecializuje na sinterovaný kameň a povrchové materiály prémiového segmentu. S dlhoročnými skúsenosťami v oblasti interiérového dizajnu a materiálového inžinierstva vám pomôžeme nájsť ideálne riešenie.'
                        : 'The OROSTONE team specializes in sintered stone and premium surface materials. With years of experience in interior design and material engineering, we help you find the ideal solution.'}
                    </p>
                    <TextLink to="/kontakt">{lang === 'sk' ? 'Kontaktovať nás' : 'Contact us'}</TextLink>
                  </div>
                </div>
              )}
            </div>
          </Container>
        </Section>
      </article>
      {/* End semantic article wrapper */}

      {/* ==================== BACK TO TOP BUTTON ==================== */}
      <button
        type="button"
        onClick={scrollToTop}
        className={`fixed bottom-[calc(84px+env(safe-area-inset-bottom,0px))] right-5 z-50 grid h-11 w-11 lg:bottom-6 lg:right-6 place-items-center rounded-full bg-brand-dark text-brand-light shadow-[0_8px_24px_rgba(26,26,26,0.18)] transition-[opacity,transform] duration-200 hover:bg-[#333331] ${
          showBackToTop ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0'
        }`}
        aria-label="Back to top"
        tabIndex={showBackToTop ? 0 : -1}
      >
        <ArrowUp size={18} strokeWidth={1.75} />
      </button>

      {/* ==================== RELATED ARTICLES ==================== */}
      {relatedArticles.length > 0 && (
        <Section tone="sand">
          <Container>
            <SectionHeader eyebrow="Blog" title={labels.related} />
            <ul className="mt-[clamp(40px,5vw,64px)] grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {relatedArticles.map((rel) => (
                <li key={rel.id}>
                  <BlogCard
                    slug={rel.slug}
                    image={rel.heroImage}
                    title={rel[lang].title}
                    excerpt={rel[lang].excerpt}
                    category={BLOG_CATEGORY_LABELS[rel.category]?.[lang] ?? rel.category}
                    date={formatDate(rel.publishDate, lang)}
                    minutes={rel.readTimeMinutes}
                    minutesLabel={labels.readTime}
                  />
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      <GoldBand od="blog-clanok" />
    </div>
  );
};
