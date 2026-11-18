import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';

const caseInitials = ['AK', 'JT', 'EM'];

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
              <div className="testimonial-quote" style={{ fontStyle: 'normal' }}>
                {item.quote}
              </div>

              <div className="testimonial-author-block">
                <div className="author-avatar-initials">
                  {caseInitials[idx] || 'BE'}
                </div>
                <div className="author-meta">
                  <div className="author-name-bold">{item.name}</div>
                  <div className="author-origin">
                    <i className="fa-solid fa-route"></i> {item.country}
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
