import Lenis from "lenis";
import { gsap } from "gsap";
document.addEventListener("DOMContentLoaded", () => {
    // Mobile check for poster fallback instead of autoplaying videos (handled mostly via CSS, but good to know)
    const isMobile = window.innerWidth <= 768;

    // 1. Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
    });
    window.lenis = lenis; gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // 3. Navigation Behaviors
    const topNav = document.getElementById("top-nav");
    const topLinks = document.querySelectorAll(".nav-links a[data-target]");
    const bottomLinks = document.querySelectorAll(".bottom-nav-inner a[data-target]");

    // Top nav background blur on scroll
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            topNav.classList.add("scrolled");
        } else {
            topNav.classList.remove("scrolled");
        }
    });

    // Intersection Observer for highlighting active sections
    const observerOptions = {
        root: null,
        rootMargin: "-40% 0px -40% 0px", // triggers when section is near middle of screen
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;

                // Map quote-panel-hook back to 'quote' or just ignore it
                const targetId = id === 'quote-panel-hook' ? 'quote' : id;

                // Update Top Nav
                topLinks.forEach(link => {
                    link.classList.remove("active");
                    if (link.getAttribute("data-target") === targetId) {
                        link.classList.add("active");
                    }
                });

                // Update Bottom Nav
                bottomLinks.forEach(link => {
                    link.classList.remove("active");
                    if (link.getAttribute("data-target") === targetId) {
                        link.classList.add("active");
                    }
                });

                // Autoplay video for active section (optimization)
                const video = entry.target.querySelector('video');
                if (video && !isMobile) {
                    video.play().catch(e => console.warn("Autoplay prevented:", e));
                }
            } else {
                // Pause video when out of viewport
                const video = entry.target.querySelector('video');
                if (video) {
                    video.pause();
                }
            }
        });
    }, observerOptions);

    sections.forEach(sec => sectionObserver.observe(sec));

    // Connect clicks to Lenis scroll
    const allNavLinks = document.querySelectorAll('a[href^="#"]:not(.quote-trigger)');
    allNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
                lenis.scrollTo(targetEl, { duration: 1.2, offset: 0 });
            }
        });
    });

});
