import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

export const MobilityTimeline: React.FC = () => {
  const { t } = useLanguage();
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState<0 | 1 | 2 | 3>(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const trackHeight = trackRef.current.offsetHeight - window.innerHeight;
      if (trackHeight <= 0) return;

      const progress = Math.min(Math.max(-rect.top / trackHeight, 0), 1);

      if (progress < 0.18) {
        setActiveStep(0);
      } else if (progress < 0.42) {
        setActiveStep(1);
      } else if (progress < 0.66) {
        setActiveStep(2);
      } else {
        setActiveStep(3);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={trackRef} id="timeline" className="stacking-timeline-track reveal-section">
      <div className="stacking-timeline-sticky">
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
