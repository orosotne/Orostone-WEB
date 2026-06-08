import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { lazy, type ComponentType } from "react"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatPrice = (price: number): string =>
  new Intl.NumberFormat('sk-SK', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(price);

export function onIdle(fn: () => void, timeout: number): () => void {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    const id = (window as any).requestIdleCallback(fn, { timeout });
    return () => (window as any).cancelIdleCallback(id);
  }
  const id = setTimeout(fn, timeout);
  return () => clearTimeout(id);
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 2,
  backoffMs = 500,
): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    if (retries === 0) throw err;
    await new Promise(r => setTimeout(r, backoffMs));
    return withRetry(fn, retries - 1, backoffMs * 2);
  }
}

/**
 * Wrapper around React.lazy that retries failed dynamic imports.
 * After a deployment, old chunk URLs become 404. React.lazy caches the
 * rejected promise, so a simple ErrorBoundary reset won't fix it.
 * This wrapper retries up to `maxRetries` times with exponential backoff,
 * then forces a full page reload as a last resort (once per session).
 */
export function lazyWithRetry<T extends ComponentType<unknown>>(
  factory: () => Promise<{ default: T }>,
  maxRetries = 2,
): ReturnType<typeof lazy> {
  return lazy(() => retryImport(factory, maxRetries));
}

async function retryImport<T extends ComponentType<unknown>>(
  factory: () => Promise<{ default: T }>,
  maxRetries: number,
): Promise<{ default: T }> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await factory();
    } catch (err) {
      if (attempt === maxRetries) {
        const reloadKey = 'orostone_chunk_reload';
        const alreadyReloaded = sessionStorage.getItem(reloadKey);
        if (!alreadyReloaded) {
          sessionStorage.setItem(reloadKey, '1');
          window.location.reload();
          return new Promise(() => {});
        }
        throw err;
      }
      await new Promise((r) => setTimeout(r, 1000 * 2 ** attempt));
    }
  }
  throw new Error('Unreachable');
}
