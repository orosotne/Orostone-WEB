import { useState, useEffect } from 'react';

// ===========================================
// Hook: useInstagramFeed
// ===========================================
// Nacita posty z Instagram Graph API.
// Ak token chyba alebo je expirnuty,
// pouzije fallback placeholder obrazky.

export interface InstagramPost {
  id: string;
  caption?: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
}

// Fallback placeholder obrazky (pouzite ak API nefunguje)
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

const INSTAGRAM_TOKEN = import.meta.env.VITE_INSTAGRAM_ACCESS_TOKEN;
const INSTAGRAM_ACCOUNT_ID = import.meta.env.VITE_INSTAGRAM_ACCOUNT_ID;
const GRAPH_API_VERSION = 'v24.0';
const FIELDS = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp';

export function useInstagramFeed(limit: number = 8) {
  const [posts, setPosts] = useState<InstagramPost[]>(FALLBACK_POSTS.slice(0, limit));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  useEffect(() => {
    if (!INSTAGRAM_TOKEN || !INSTAGRAM_ACCOUNT_ID) {
      console.warn('[Instagram Feed] Token alebo Account ID chyba v .env — pouzivam fallback obrazky');
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
        const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${INSTAGRAM_ACCOUNT_ID}/media?fields=${FIELDS}&limit=${limit}&access_token=${INSTAGRAM_TOKEN}`;
        const response = await fetch(url);

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(
            errorData?.error?.message || `Instagram API error: ${response.status}`
          );
        }

        const data = await response.json();

        if (!cancelled && data.data && data.data.length > 0) {
          setPosts(data.data);
          setIsUsingFallback(false);
        } else if (!cancelled) {
          console.warn('[Instagram Feed] API vratilo prazdne data — pouzivam fallback');
          setPosts(FALLBACK_POSTS.slice(0, limit));
          setIsUsingFallback(true);
        }
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : 'Unknown error';
          console.error('[Instagram Feed] Chyba pri nacitavani:', message);
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
 * Vrati URL obrazku pre zobrazenie v gride.
 * Pre VIDEO pouzije thumbnail_url, pre IMAGE pouzije media_url.
 */
export function getPostImageUrl(post: InstagramPost): string {
  if (post.media_type === 'VIDEO' && post.thumbnail_url) {
    return post.thumbnail_url;
  }
  return post.media_url;
}
