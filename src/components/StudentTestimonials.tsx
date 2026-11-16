import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';

export const StudentTestimonials: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="testimonials-section reveal-section">
      <div className="testimonials-inner">
        <div className="testimonials-header-center">
          <h3 className="testimonials-title reveal-left">
            {t.testimonials.title}
          </h3>
          <p
            className="testimonials-subtitle reveal-right"
            dangerouslySetInnerHTML={{ __html: t.testimonials.subtitleHtml }}
          />
        </div>

        <div className="testimonials-grid reveal-grid">
          {t.testimonials.items.map((item, idx) => (
            <div key={idx} className="testimonial-card-clean">
              <div className="testimonial-stars-row">
                {[...Array(5)].map((_, sIdx) => (
                  <i key={sIdx} className="fa-solid fa-star text-amber-400"></i>
                ))}
              </div>

              <blockquote className="testimonial-quote">
                « {item.quote} »
              </blockquote>

              <div className="testimonial-author-block">
                <div className="author-avatar-initials">
                  {item.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
                <div className="author-meta">
                  <div className="author-name-bold">{item.name}</div>
                  <div className="author-origin">
                    <i className="fa-solid fa-earth-africa"></i> {item.country}
                  </div>
                  <div className="author-badge-status">
                    <i className="fa-solid fa-check text-emerald-500"></i> {item.currentStatus}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
