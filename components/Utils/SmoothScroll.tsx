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

        // #region agent log
        let lastScrollLog = 0;
        const unsubScroll = import.meta.env.DEV
            ? lenis.on('scroll', (l: Lenis) => {
                const now = Date.now();
                if (now - lastScrollLog < 320) return;
                lastScrollLog = now;
                const payload = {
                    sessionId: '0e45ef',
                    location: 'SmoothScroll:lenis',
                    message: 'scroll tick',
                    data: {
                        scroll: l.scroll,
                        animatedScroll: l.animatedScroll,
                        targetScroll: l.targetScroll,
                        velocity: l.velocity,
                        direction: l.direction,
                        isTouching: l.isTouching,
                        isStopped: l.isStopped,
                        isLocked: l.isLocked,
                        winScrollY: typeof window !== 'undefined' ? window.scrollY : null,
                    },
                    timestamp: now,
                    hypothesisId: 'HOME_L1',
                };
                console.debug('[orostone-debug]', payload);
                void fetch('http://127.0.0.1:7731/ingest/fe10e622-0fa2-40d2-8709-73e6a557fd3f', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '0e45ef' },
                    body: JSON.stringify(payload),
                }).catch(() => {});
            })
            : () => {};
        // #endregion

        return () => {
            unsubScroll();
            lenis.destroy();
        };
    }, []);

    return null;
};
