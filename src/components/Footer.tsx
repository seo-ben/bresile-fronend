import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { API_ENDPOINTS } from '../config/api';

interface FooterProps {
  onOpenRegister: () => void;
}

const whatsappDialCodes = [
  { code: '+221', flag: '🇸🇳', country: 'Sénégal' },
  { code: '+225', flag: '🇨🇮', country: "Côte d'Ivoire" },
  { code: '+237', flag: '🇨🇲', country: 'Cameroun' },
  { code: '+224', flag: '🇬🇳', country: 'Guinée' },
  { code: '+223', flag: '🇲🇱', country: 'Mali' },
  { code: '+229', flag: '🇧🇯', country: 'Bénin' },
  { code: '+228', flag: '🇹🇬', country: 'Togo' },
  { code: '+242', flag: '🇨🇬', country: 'Congo' },
  { code: '+243', flag: '🇨🇩', country: 'RD Congo' },
  { code: '+226', flag: '🇧🇫', country: 'Burkina Faso' },
  { code: '+241', flag: '🇬🇦', country: 'Gabon' },
  { code: '+55', flag: '🇧🇷', country: 'Brésil' },
  { code: '+33', flag: '🇫🇷', country: 'France' },
  { code: '+1', flag: '🇺🇸', country: 'International' },
];

export const Footer: React.FC<FooterProps> = ({ onOpenRegister }) => {
  const { lang, t } = useLanguage();
  const [dialCode, setDialCode] = useState('+221');
  const [phoneInput, setPhoneInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleCtaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = phoneInput.replace(/[^0-9\s-]/g, '').trim();
    if (cleaned.length < 5) return;

    setIsSending(true);
    setSentSuccess(false);

    const selectedCountry = whatsappDialCodes.find((d) => d.code === dialCode)?.country || '';

    try {
      await fetch(`${API_ENDPOINTS.whatsappLead}?lang=${lang}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          dial_code: dialCode,
          country_name: selectedCountry,
          phone_number: cleaned,
          locale: lang,
        }),
      });
      setSentSuccess(true);
      setPhoneInput('');
    } catch {
      setSentSuccess(true);
      setPhoneInput('');
    } finally {
      setIsSending(false);
    }
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
            <div className="capsule-input-prefix" style={{ paddingRight: '0.25rem', display: 'flex', alignItems: 'center' }}>
              <select
                value={dialCode}
                onChange={(e) => setDialCode(e.target.value)}
                aria-label="Indicatif pays WhatsApp"
                style={{
                  border: 'none',
                  background: '#f1f5f9',
                  borderRadius: '999px',
                  padding: '0.45rem 0.65rem',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  color: '#0f172a',
                  cursor: 'pointer',
                  outline: 'none',
                }}
              >
                {whatsappDialCodes.map((d) => (
                  <option key={d.code} value={d.code}>
                    {d.flag} {d.code}
                  </option>
                ))}
              </select>
            </div>
            <input
              type="tel"
              inputMode="tel"
              required
              className="capsule-text-input"
              placeholder={t.footer.inputPlaceholder}
              value={phoneInput}
              onChange={(e) => {
                // Autoriser uniquement les chiffres, espaces et tirets (aucun email)
                setPhoneInput(e.target.value.replace(/[^0-9\s-]/g, ''));
                if (sentSuccess) setSentSuccess(false);
              }}
            />
            <button type="submit" className="capsule-submit-action-btn" disabled={isSending}>
              <i className="fa-brands fa-whatsapp" style={{ marginRight: '0.4rem', fontSize: '1.05rem' }}></i>
              <span>{isSending ? t.footer.sendingBtn : t.footer.submitBtn}</span>
            </button>
          </form>

          {sentSuccess && (
            <div
              style={{
                marginTop: '0.85rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: '#ecfdf5',
                border: '1px solid #10b981',
                color: '#065f46',
                padding: '0.6rem 1.15rem',
                borderRadius: '999px',
                fontSize: '0.88rem',
                fontWeight: 600,
              }}
            >
              <i className="fa-solid fa-circle-check"></i>
              <span>{t.footer.successMsg}</span>
            </div>
          )}

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
