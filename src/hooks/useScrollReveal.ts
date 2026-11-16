import { useEffect } from 'react';

/**
 * Hook d'animation au défilement bidirectionnel (Scroll Reveal)
 * Active les animations "gauche" et "droite" lorsque les sections entrent
 * dans le champ de vision, aussi bien en descendant qu'en montant.
 */
export function useScrollReveal() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Respect des préférences d'accessibilité (prefers-reduced-motion)
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      document
        .querySelectorAll('.reveal-section, .reveal-left, .reveal-right, .reveal-grid')
        .forEach((el) => {
          el.classList.add('is-revealed');
        });
      return;
    }

    const observedElements = new WeakSet<Element>();

    const isMobile = window.innerWidth <= 768;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // L'élément entre dans l'écran : on lance l'animation
            entry.target.classList.add('is-revealed');
          } else if (!isMobile) {
            // Sur desktop uniquement, on retire la classe pour rejouer l'animation
            entry.target.classList.remove('is-revealed');
          }
        });
      },
      {
        threshold: isMobile ? 0.02 : 0.12,
        rootMargin: isMobile ? '50px 0px 50px 0px' : '0px 0px -40px 0px',
      }
    );

    const scanAndObserve = () => {
      const targets = document.querySelectorAll(
        '.reveal-section, .reveal-left, .reveal-right, .reveal-grid'
      );
      targets.forEach((el) => {
        if (!observedElements.has(el)) {
          observedElements.add(el);
          observer.observe(el);
        }
      });
    };

    scanAndObserve();

    // Observe les modifications DOM pour supporter les données asynchrones (ex: universités via API)
    const mutationObserver = new MutationObserver(() => {
      scanAndObserve();
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);
}
