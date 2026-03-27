import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }) {
    useEffect(() => {
        // Initialize Lenis for premium momentum scrolling
        const lenis = new Lenis({
            duration: 1.0,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smooth: true,
            smoothTouch: false,
            touchMultiplier: 1.5,
        });

        // Expose to window for imperative scroll control
        window.lenis = lenis;

        // Expose a reset helper: scrolls to top + recalculates dimensions for the new page
        window.scrollReset = () => {
            if (!window.lenis) return;
            window.lenis.scrollTo(0, { immediate: true });
            // Let the new page DOM fully paint and image placeholders render
            setTimeout(() => {
                if (window.lenis) window.lenis.resize();
                if (window.ScrollTrigger) ScrollTrigger.refresh();
            }, 100);
        };

        // Sync Lenis with GSAP ScrollTrigger
        lenis.on('scroll', ScrollTrigger.update);

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);

        return () => {
            lenis.destroy();
            gsap.ticker.remove(lenis.raf);
            delete window.lenis;
            delete window.scrollReset;
        };
    }, []);

    return children;
}
