import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { lazy, type ComponentType } from "react"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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
