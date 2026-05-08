import { useEffect, useRef, useState, type ReactNode } from 'react';

interface DeferUntilVisibleProps {
  children: ReactNode;
  /**
   * Placeholder rendered while the section is below the fold and not yet
   * mounted. MUST reserve approximate final height (e.g. min-h-[1400px])
   * to keep CLS at zero — without it, content jumps when children mount.
   */
  fallback: ReactNode;
  /**
   * IntersectionObserver rootMargin. Defaults to "600px 0px" so the chunk
   * starts loading ~600px before the section enters the viewport — enough
   * runway to parse + execute before the user actually sees it.
   */
  rootMargin?: string;
  /**
   * If true, mount immediately without observing. Useful for tests or when
   * IO is unsupported (handled internally as a fallback already).
   */
  forceRender?: boolean;
}

/**
 * Defers mounting `children` until a sentinel element scrolls within
 * `rootMargin` of the viewport. This is layered ON TOP of React.lazy:
 * `lazyWithRetry()` defines the chunk; this component prevents the lazy
 * component from being rendered (and therefore prevents the dynamic
 * import() from firing) until the user is actually scrolling toward it.
 *
 * Why both lazy + DeferUntilVisible? React.lazy alone fires the import
 * the moment the component is rendered. If you put `<LazySection />`
 * inline in the home page, the chunk downloads on first render —
 * defeating the purpose of code-splitting for above-the-fold INP wins.
 */
export function DeferUntilVisible({
  children,
  fallback,
  rootMargin = '600px 0px 600px 0px',
  forceRender = false,
}: DeferUntilVisibleProps) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState<boolean>(forceRender);

  useEffect(() => {
    if (visible) return;
    if (typeof IntersectionObserver === 'undefined') {
      // Old browsers — render immediately. We never block content forever.
      setVisible(true);
      return;
    }
    const node = sentinelRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [visible, rootMargin]);

  if (visible) {
    return <>{children}</>;
  }

  return <div ref={sentinelRef}>{fallback}</div>;
}
