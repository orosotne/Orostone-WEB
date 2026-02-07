import { useEffect } from 'react';
import Lenis from 'lenis';

export const SmoothScroll = () => {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            // orientation: 'vertical', // 'direction' in older versions
            // gestureOrientation: 'vertical',
            // smoothWheel: true, // 'smooth' is deprecated/renamed or default
            // wheelMultiplier: 1, // mouseMultiplier
            // touchMultiplier: 2,
            // For v1 basic usage with defaults is often sufficient, but keeping explicit:
            autoResize: true,
        });

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        };
    }, []);

    return null;
};
