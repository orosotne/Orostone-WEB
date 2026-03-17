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
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=400&auto=format&fit=crop',
];

const FALLBACK_POSTS: InstagramPost[] = FALLBACK_IMAGES.map((url, i) => ({
  id: `fallback-${i}`,
  media_type: 'IMAGE',
  media_url: url,
  permalink: 'https://www.instagram.com/orostone_/',
  timestamp: new Date().toISOString(),
}));

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

export function useInstagramFeed(limit: number = 8) {
  const [posts, setPosts] = useState<InstagramPost[]>(FALLBACK_POSTS.slice(0, limit));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  useEffect(() => {
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
  }, [limit]);

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
