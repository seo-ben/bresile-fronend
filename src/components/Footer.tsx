import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { API_ENDPOINTS } from '../config/api';
import { useSiteSettings } from './SiteSettingsContext';

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
  const siteSettings = useSiteSettings();
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
              onClick={() => setSentSuccess(false)}
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(15, 23, 42, 0.45)',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999,
                padding: '1rem',
              }}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  position: 'relative',
                  background: '#ffffff',
                  borderRadius: '24px',
                  padding: '2.25rem 2rem 2rem',
                  maxWidth: '400px',
                  width: '100%',
                  textAlign: 'center',
                  boxShadow: '0 24px 48px rgba(15, 23, 42, 0.18)',
                  border: '1px solid #e2e8f0',
                }}
              >
                <button
                  type="button"
                  onClick={() => setSentSuccess(false)}
                  aria-label="Fermer"
                  style={{
                    position: 'absolute',
                    top: '0.85rem',
                    right: '0.85rem',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: 'none',
                    background: '#f1f5f9',
                    color: '#475569',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                  }}
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>

                <div
                  style={{
                    width: '84px',
                    height: '84px',
                    borderRadius: '50%',
                    background: '#ecfdf5',
                    color: '#059669',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2.5rem',
                    margin: '0.5rem auto',
                  }}
                >
                  <i className="fa-solid fa-check"></i>
                </div>
              </div>
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
              <div className="footer-brand-title" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <img
                  src={siteSettings.logo_url || '/logo.png'}
                  alt={siteSettings.site_name}
                  style={{ width: '32px', height: '32px', objectFit: 'contain', borderRadius: '8px' }}
                />
                {siteSettings.site_name === 'Brasil·É' ? (
                  <span>
                    <span className="brand-primary-white">Brasil</span>
                    <span className="brand-dot-green">·</span>
                    <span className="brand-accent-green">É</span>
                  </span>
                ) : (
                  <span className="brand-primary-white">{siteSettings.site_name}</span>
                )}
              </div>

              <p className="footer-identity-bio">
                {t.footer.bio}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', marginTop: '1rem' }}>
                {siteSettings.contact_email && (
                  <a
                    href={`mailto:${siteSettings.contact_email}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.55rem',
                      fontSize: '0.84rem',
                      fontWeight: 600,
                      color: '#334155',
                      textDecoration: 'none',
                    }}
                  >
                    <span
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        background: '#f1f5f9',
                        color: '#059669',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <i className="fa-solid fa-envelope" style={{ fontSize: '0.78rem' }}></i>
                    </span>
                    <span>{siteSettings.contact_email}</span>
                  </a>
                )}

                {siteSettings.contact_phone && (
                  <a
                    href={`tel:${siteSettings.contact_phone.replace(/\s+/g, '')}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.55rem',
                      fontSize: '0.84rem',
                      fontWeight: 600,
                      color: '#334155',
                      textDecoration: 'none',
                    }}
                  >
                    <span
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        background: '#f1f5f9',
                        color: '#059669',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <i className="fa-solid fa-phone" style={{ fontSize: '0.78rem' }}></i>
                    </span>
                    <span>{siteSettings.contact_phone}</span>
                  </a>
                )}
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
              <h4 className="footer-column-heading">
                <Link to="/a-propos" style={{ color: 'inherit', textDecoration: 'none' }}>
                  {t.footer.colAbout}
                </Link>
              </h4>
              <ul className="footer-plain-nav-list">
                <li>
                  <Link to="/a-propos">
                    {lang === 'en' ? 'About the Project' : lang === 'pt' ? 'Sobre o Projeto' : 'À Propos du Projet'}
                  </Link>
                </li>
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
                  <div className="campus-monogram-circle bg-emerald">RJ</div>
                  <span className="campus-name-label">CAMPUS RIO DE JANEIRO</span>
                </div>

                <div className="campus-badge-pill" onClick={onOpenRegister}>
                  <div className="campus-monogram-circle bg-teal">MG</div>
                  <span className="campus-name-label">CAMPUS BELO HORIZONTE</span>
                </div>

                <div className="campus-badge-pill" onClick={onOpenRegister}>
                  <div className="campus-monogram-circle bg-rose">RS</div>
                  <span className="campus-name-label">CAMPUS PORTO ALEGRE</span>
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
              Copyright © 2026 {siteSettings.site_name}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
