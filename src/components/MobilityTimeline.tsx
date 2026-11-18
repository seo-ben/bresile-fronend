import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

export const MobilityTimeline: React.FC = () => {
  const { t } = useLanguage();
  const trackRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const [targetStep, setTargetStep] = useState<0 | 1 | 2 | 3>(0);
  const [activeStep, setActiveStep] = useState<0 | 1 | 2 | 3>(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const stickyHeight = stickyRef.current ? stickyRef.current.offsetHeight : 440;
      const stickyTop = window.innerWidth <= 900 ? 60 : 85;

      // Distance exacte pendant laquelle le bloc sticky reste épinglé avant que la section suivante n'arrive juste en dessous
      const scrollRunway = Math.max(trackRef.current.offsetHeight - stickyHeight - stickyTop, 400);
      const scrolled = -rect.top + stickyTop;
      const progress = Math.min(Math.max(scrolled / scrollRunway, 0), 1);

      if (progress < 0.25) {
        setTargetStep(0);
      } else if (progress < 0.52) {
        setTargetStep(1);
      } else if (progress < 0.78) {
        setTargetStep(2);
      } else {
        setTargetStep(3);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // Progression séquentielle étape par étape (0 -> 1 -> 2 -> 3) pour ne jamais sauter les étapes 2 et 3 même en cas de scroll rapide
  useEffect(() => {
    if (activeStep === targetStep) return;

    const timer = window.setTimeout(() => {
      setActiveStep((prev) => {
        if (prev < targetStep) return (prev + 1) as 0 | 1 | 2 | 3;
        if (prev > targetStep) return (prev - 1) as 0 | 1 | 2 | 3;
        return prev;
      });
    }, 240);

    return () => window.clearTimeout(timer);
  }, [activeStep, targetStep]);

  return (
    <section ref={trackRef} id="timeline" className="stacking-timeline-track reveal-section">
      <div ref={stickyRef} className="stacking-timeline-sticky">
        <div className="stacking-timeline-header">
          <h2 className="timeline-main-title reveal-left">
            {t.timeline.title}
          </h2>
          <p className="timeline-lead-desc reveal-right">
            {t.timeline.subtitle}
          </p>
        </div>

        <div className="sleek-deck-stage">
          {t.timeline.steps.map((step, idx) => {
            const isVisible = activeStep >= idx;
            return (
              <div
                key={idx}
                className={`sleek-deck-card ${isVisible ? 'is-stacked' : 'is-hidden'}`}
                style={{
                  transform: isVisible
                    ? `translateY(${idx * 14}px)`
                    : `translateY(${110 + idx * 24}px)`,
                  opacity: isVisible ? 1 : 0,
                  zIndex: idx + 1,
                  pointerEvents: isVisible ? 'auto' : 'none',
                }}
              >
                <div className="card-left-group">
                  <span className="card-step-num">{step.number}</span>
                  <div className="card-text-block">
                    <h3 className="card-title-text">{step.title}</h3>
                    <p className="card-desc-short">{step.description}</p>
                  </div>
                </div>

                <div className="card-right-group">
                  <span className="card-tag-keywords">{step.tags}</span>
                  <span className="card-arrow-icon" aria-hidden="true">
                    ↗
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
