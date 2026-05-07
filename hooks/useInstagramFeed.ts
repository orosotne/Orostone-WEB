import { useState, useEffect } from 'react';

export interface InstagramPost {
  id: string;
  caption?: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
}

const FALLBACK_IMAGES = [
  '/images/instagram-fallback/ig-fallback-1.webp',
  '/images/instagram-fallback/ig-fallback-2.webp',
  '/images/instagram-fallback/ig-fallback-3.webp',
  '/images/instagram-fallback/ig-fallback-4.webp',
  '/images/instagram-fallback/ig-fallback-5.webp',
  '/images/instagram-fallback/ig-fallback-6.webp',
  '/images/instagram-fallback/ig-fallback-7.webp',
  '/images/instagram-fallback/ig-fallback-8.webp',
];

const FALLBACK_POSTS: InstagramPost[] = FALLBACK_IMAGES.map((url, i) => ({
  id: `fallback-${i}`,
  media_type: 'IMAGE',
  media_url: url,
  permalink: 'https://www.instagram.com/orostone_/',
  timestamp: new Date().toISOString(),
}));

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

export function useInstagramFeed(limit: number = 8, enabled: boolean = true) {
  const [posts, setPosts] = useState<InstagramPost[]>(FALLBACK_POSTS.slice(0, limit));
  // Štart s isLoading=false — fallback posts sú dostupné ihneď, takže grid môže
  // renderovať fallback bez skeleton flickeru. setIsLoading(true) sa nastaví v
  // fetchPosts() po IO triggeri, ale grid môže medzitým ukázať fallback (lepšie
  // UX než nekonečný skeleton ak IO nezatriguje, napr. keď user nikdy nedoscrolluje).
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUsingFallback, setIsUsingFallback] = useState(true);

  useEffect(() => {
    if (!enabled) return;

    if (!SUPABASE_URL) {
      console.warn('[Instagram Feed] SUPABASE_URL chýba — používam fallback');
      setPosts(FALLBACK_POSTS.slice(0, limit));
      setIsUsingFallback(true);
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    const fetchPosts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const url = `${SUPABASE_URL}/functions/v1/instagram-feed?limit=${limit}`;
        const response = await fetch(url, {
          headers: {
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY || '',
          },
        });

        if (!response.ok) {
          throw new Error(`Edge function error: ${response.status}`);
        }

        const json = await response.json();

        if (!cancelled && json.data && json.data.length > 0) {
          setPosts(json.data);
          setIsUsingFallback(false);
        } else if (!cancelled) {
          console.warn('[Instagram Feed] Prázdne dáta — používam fallback');
          setPosts(FALLBACK_POSTS.slice(0, limit));
          setIsUsingFallback(true);
        }
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : 'Unknown error';
          console.error('[Instagram Feed] Chyba:', message);
          setError(message);
          setPosts(FALLBACK_POSTS.slice(0, limit));
          setIsUsingFallback(true);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchPosts();

    return () => {
      cancelled = true;
    };
  }, [limit, enabled]);

  return { posts, isLoading, error, isUsingFallback };
}

/**
 * Vráti URL obrázku pre zobrazenie v gride.
 * Pre VIDEO použije thumbnail_url, pre IMAGE použije media_url.
 */
export function getPostImageUrl(post: InstagramPost): string {
  if (post.media_type === 'VIDEO' && post.thumbnail_url) {
    return post.thumbnail_url;
  }
  return post.media_url;
}
