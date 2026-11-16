import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

interface FooterProps {
  onOpenRegister: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenRegister }) => {
  const { t } = useLanguage();
  const [leadInput, setLeadInput] = useState('');

  const handleCtaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onOpenRegister();
  };

  return (
    <footer className="footer-container-styled">
      <div className="footer-glowing-cta-section reveal-section">
        <div className="footer-cta-inner-content">
          <h2 className="footer-cta-headline reveal-left">
            {t.footer.ctaHeadline}
          </h2>

          <p className="footer-cta-subhead reveal-right">
            {t.footer.ctaSubhead}
          </p>

          <form className="footer-cta-capsule-bar reveal-left reveal-delay-1" onSubmit={handleCtaSubmit}>
            <div className="capsule-input-prefix">
              <i className="fa-solid fa-globe"></i>
            </div>
            <input
              type="text"
              className="capsule-text-input"
              placeholder={t.footer.inputPlaceholder}
              value={leadInput}
              onChange={(e) => setLeadInput(e.target.value)}
            />
            <button type="submit" className="capsule-submit-action-btn">
              <span>{t.footer.submitBtn}</span>
            </button>
          </form>

          <div className="footer-cta-partners-row reveal-grid">
            <div className="cta-partner-logo-item">
              <i className="fa-solid fa-building-columns"></i>
              <span>UnB Brasília</span>
            </div>
            <div className="cta-partner-logo-item">
              <i className="fa-solid fa-graduation-cap"></i>
              <span>USP São Paulo</span>
            </div>
            <div className="cta-partner-logo-item">
              <i className="fa-solid fa-award"></i>
              <span>MEC / INEP Brasil</span>
            </div>
            <div className="cta-partner-logo-item">
              <i className="fa-solid fa-certificate"></i>
              <span>CELPE-Bras Officiel</span>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-dark-body reveal-section">
        <div className="footer-dark-inner">
          <div className="footer-grid-four-columns">
            <div className="footer-col-identity reveal-left">
              <div className="footer-brand-title">
                <span className="brand-primary-white">Brasil</span>
                <span className="brand-dot-green">·</span>
                <span className="brand-accent-green">É</span>
              </div>

              <p className="footer-identity-bio">
                {t.footer.bio}
              </p>

              <div className="footer-social-circles-list">
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="footer-social-round-btn" aria-label="Facebook">
                  <i className="fa-brands fa-facebook-f"></i>
                </a>
                <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="footer-social-round-btn" aria-label="TikTok">
                  <i className="fa-brands fa-tiktok"></i>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="footer-social-round-btn" aria-label="Instagram">
                  <i className="fa-brands fa-instagram"></i>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="footer-social-round-btn" aria-label="LinkedIn">
                  <i className="fa-brands fa-linkedin-in"></i>
                </a>
              </div>
            </div>

            <div className="footer-col-nav reveal-left reveal-delay-1">
              <h4 className="footer-column-heading">{t.footer.colPrograms}</h4>
              <ul className="footer-plain-nav-list">
                {t.footer.programsList.map((label, idx) => (
                  <li key={idx}><a href="#formations">{label}</a></li>
                ))}
              </ul>
            </div>

            <div className="footer-col-nav reveal-right reveal-delay-1">
              <h4 className="footer-column-heading">{t.footer.colAbout}</h4>
              <ul className="footer-plain-nav-list">
                {t.footer.aboutList.map((item, idx) => (
                  <li key={idx}><a href={item.href}>{item.label}</a></li>
                ))}
              </ul>
            </div>

            <div className="footer-col-departments reveal-right">
              <h4 className="footer-column-heading">{t.footer.colCampuses}</h4>
              <div className="footer-campus-pills-list">
                <div className="campus-badge-pill" onClick={onOpenRegister}>
                  <div className="campus-monogram-circle bg-gold">DF</div>
                  <span className="campus-name-label">CAMPUS BRASÍLIA</span>
                </div>

                <div className="campus-badge-pill" onClick={onOpenRegister}>
                  <div className="campus-monogram-circle bg-purple">SP</div>
                  <span className="campus-name-label">CAMPUS SÃO PAULO</span>
                </div>

                <div className="campus-badge-pill" onClick={onOpenRegister}>
                  <div className="campus-monogram-circle bg-indigo">OL</div>
                  <span className="campus-name-label">{t.footer.campusOnline}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-sub-bottom-bar">
          <div className="footer-sub-bottom-inner">
            <span className="footer-copy-text">
              Copyright © 2026 Brasil·É
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
