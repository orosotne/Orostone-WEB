import { useEffect } from 'react';
import Lenis from 'lenis';

export const SmoothScroll = () => {
    useEffect(() => {
        // Lenis smooth scroll len na desktop — na touch zariadeniach (mobile/tablet)
        // natívny scroll prehliadača je plynulý a Lenis spôsobuje freezing/konflikty s touch eventmi
        const isTouchDevice = navigator.maxTouchPoints > 0 || window.matchMedia('(pointer: coarse)').matches;
        if (isTouchDevice) return;

        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothTouch: false,
            gestureOrientation: 'vertical',
            autoResize: true,
        });

        let rafId: number;
        function raf(time: number) {
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
        }

        rafId = requestAnimationFrame(raf);

        return () => {
            cancelAnimationFrame(rafId);
            lenis.destroy();
        };
    }, []);

    return null;
};
