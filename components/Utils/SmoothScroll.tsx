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
            cancelAnimationFrame(rafId);
            lenis.destroy();
        };
    }, []);

    return null;
};
