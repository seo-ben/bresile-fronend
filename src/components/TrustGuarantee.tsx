import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';

const pointIcons = ['fa-file-signature', 'fa-building-columns', 'fa-shield-halved', 'fa-credit-card'];

export const TrustGuarantee: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="garantie" className="guarantee-flat reveal-section">
      <div className="guarantee-flat-inner">
        <div className="guarantee-flat-figure reveal-left">
          <span className="guarantee-flat-number">85%</span>
          <span className="guarantee-flat-caption">{t.guarantee.caption}</span>
        </div>

        <div className="guarantee-flat-copy reveal-right">
          <h3 className="guarantee-flat-title">
            {t.guarantee.title}
          </h3>
          <p className="guarantee-flat-text">
            {t.guarantee.text}
          </p>

          <ul className="guarantee-flat-points">
            {t.guarantee.points.map((text, idx) => (
              <li key={idx}>
                <i className={`fa-solid ${pointIcons[idx]}`}></i>
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
