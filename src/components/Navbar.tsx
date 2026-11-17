import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage, LANGUAGE_LABELS, type Language } from '../i18n/LanguageContext';

interface NavbarProps {
  onOpenRegister: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenRegister }) => {
  const { lang, setLang, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const hasAuth = Boolean(
        localStorage.getItem('student_token') || localStorage.getItem('student_user')
      );
      setIsLoggedIn(hasAuth);
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 25) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  const languages: Language[] = ['fr', 'en', 'pt'];

  return (
    <>
      <header className={`site-header ${isScrolled ? 'is-scrolled' : ''}`}>
        <div className="header-inner">
          {/* Logo Brasil·É avec B Majuscule */}
          <Link to="/" className="brand-logo" onClick={handleNavClick}>
            <div className="brand-icon-circle">
              <img src="/logo.png" alt="Brasil·É" />
            </div>
            <div className="brand-text-block">
              <span className="brand-name">
                Brasil<span className="accent">·É</span>
              </span>
              <span className="brand-tagline">{t.nav.tagline}</span>
            </div>
          </Link>

          {/* Menu Desktop */}
          <div className="header-right header-desktop-nav">
            <a href="#formations" className="header-link">{t.nav.programs}</a>
            <a href="#partenaires" className="header-link">{t.nav.universities}</a>
            {!isLoggedIn && (
              <Link to="/connexion" className="header-link">{t.nav.login}</Link>
            )}

            {/* Sélecteur de langue FR / EN / PT */}
            <div className="lang-switcher-pill" role="group" aria-label="Langue">
              {languages.map((code) => (
                <button
                  key={code}
                  type="button"
                  className={`lang-btn-item ${lang === code ? 'is-active' : ''}`}
                  onClick={() => setLang(code)}
                  title={LANGUAGE_LABELS[code].label}
                >
                  {LANGUAGE_LABELS[code].short}
                </button>
              ))}
            </div>

            {isLoggedIn ? (
              <Link
                to="/portail"
                className="btn-orange-pill"
                style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
              >
                <i className="fa-solid fa-gauge-high"></i>
                <span>{t.nav.drawerPortal}</span>
              </Link>
            ) : (
              <button
                type="button"
                className="btn-orange-pill"
                onClick={onOpenRegister}
              >
                {t.nav.registerCta}
              </button>
            )}
          </div>

          {/* Actions Navbar Mobile */}
          <div className="header-mobile-actions">
            {/* Sélecteur compact mobile */}
            <select
              className="mobile-lang-select"
              value={lang}
              onChange={(e) => setLang(e.target.value as Language)}
              aria-label="Langue"
            >
              {languages.map((code) => (
                <option key={code} value={code}>
                  {LANGUAGE_LABELS[code].short}
                </option>
              ))}
            </select>

            {isLoggedIn ? (
              <Link
                to="/portail"
                className="btn-mobile-inscription"
                style={{ textDecoration: 'none' }}
              >
                {t.nav.drawerPortal}
              </Link>
            ) : (
              <>
                <Link to="/connexion" className="mobile-nav-link-connexion">
                  {t.nav.login}
                </Link>

                <button
                  type="button"
                  className="btn-mobile-inscription"
                  onClick={onOpenRegister}
                >
                  {t.nav.registerShort}
                </button>
              </>
            )}

            <button
              type="button"
              className="btn-mobile-burger"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            >
              <i className={isMobileMenuOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'}></i>
            </button>
          </div>
        </div>
      </header>

      {/* Tiroir / Drawer Menu Mobile Plein Écran */}
      {isMobileMenuOpen && (
        <div className="mobile-drawer-overlay" onClick={handleNavClick}>
          <div className="mobile-drawer-panel" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-drawer-header">
              <div className="brand-logo">
                <div className="brand-icon-circle">
                  <img src="/logo.png" alt="Brasil·É" />
                </div>
                <div className="brand-text-block">
                  <span className="brand-name">
                    Brasil<span className="accent">·É</span>
                  </span>
                  <span className="brand-tagline">{t.nav.tagline}</span>
                </div>
              </div>
              <button
                type="button"
                className="btn-drawer-close"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Fermer"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {/* Choix de la langue dans le drawer */}
            <div className="drawer-lang-bar">
              {languages.map((code) => (
                <button
                  key={code}
                  type="button"
                  className={`drawer-lang-btn ${lang === code ? 'is-active' : ''}`}
                  onClick={() => setLang(code)}
                >
                  <span>{LANGUAGE_LABELS[code].flag}</span>
                  <span>{LANGUAGE_LABELS[code].label}</span>
                </button>
              ))}
            </div>

            <nav className="mobile-drawer-links">
              <a href="#formations" className="drawer-link-item" onClick={handleNavClick}>
                <i className="fa-solid fa-graduation-cap"></i>
                <span>{t.nav.drawerPrograms}</span>
              </a>
              <a href="#timeline" className="drawer-link-item" onClick={handleNavClick}>
                <i className="fa-solid fa-route"></i>
                <span>{t.nav.drawerTimeline}</span>
              </a>
              <a href="#partenaires" className="drawer-link-item" onClick={handleNavClick}>
                <i className="fa-solid fa-building-columns"></i>
                <span>{t.nav.drawerUniversities}</span>
              </a>
              <a href="#garantie" className="drawer-link-item" onClick={handleNavClick}>
                <i className="fa-solid fa-shield-halved"></i>
                <span>{t.nav.drawerGuarantee}</span>
              </a>
              <a href="#faq" className="drawer-link-item" onClick={handleNavClick}>
                <i className="fa-solid fa-circle-question"></i>
                <span>{t.nav.drawerFaq}</span>
              </a>
              <Link to="/portail" className="drawer-link-item link-highlight" onClick={handleNavClick}>
                <i className="fa-solid fa-id-card"></i>
                <span>{t.nav.drawerPortal}</span>
              </Link>
              <Link to="/connexion" className="drawer-link-item" onClick={handleNavClick}>
                <i className="fa-solid fa-arrow-right-to-bracket"></i>
                <span>{t.nav.drawerLogin}</span>
              </Link>
            </nav>

            <div className="mobile-drawer-footer">
              <button
                type="button"
                className="btn-drawer-cta"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenRegister();
                }}
              >
                <span>{t.nav.registerCta}</span>
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
