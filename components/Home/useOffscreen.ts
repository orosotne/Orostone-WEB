import { useEffect, useRef, useState } from 'react';

/** True while the element is outside the viewport — continuous animations pause then. */
export function useOffscreen<T extends Element>() {
  const ref = useRef<T>(null);
  const [off, setOff] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) {
      setOff(false);
      return;
    }
    const io = new IntersectionObserver(([entry]) => setOff(!entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, off };
}
