import React from 'react';
import { Link } from 'react-router-dom';
import { keepUnits } from '../../lib/utils';

interface BlogCardProps {
  slug: string;
  image: string;
  title: string;
  excerpt: string;
  category: string;
  /** Already formatted, e.g. "5. októbra 2026" */
  date: string;
  minutes: number;
  minutesLabel?: string;
}

/** Article card for the blog list and related articles: photo, category, H3 title, two-line excerpt, date and reading time. */
export const BlogCard: React.FC<BlogCardProps> = ({ slug, image, title, excerpt, category, date, minutes, minutesLabel = 'min čítania' }) => (
  <Link to={`/blog/${slug}`} className="group block h-full no-underline">
    <article className="grid h-full content-start gap-3">
      <span className="mb-2 block overflow-hidden rounded-[3px] bg-brand-sand">
        <img
          src={image}
          alt={title}
          width={1200}
          height={800}
          loading="lazy"
          decoding="async"
          className="aspect-[3/2] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
      </span>
      <span className="text-os-eyebrow uppercase text-brand-muted">{category}</span>
      <h3 className="text-[1.2rem] font-semibold leading-snug decoration-1 underline-offset-4 group-hover:underline">{keepUnits(title)}</h3>
      <p className="line-clamp-2 font-light text-brand-muted">{excerpt}</p>
      <span className="text-[0.84rem] font-normal tabular-nums text-brand-muted">
        {date} · {minutes} {minutesLabel}
      </span>
    </article>
  </Link>
);
