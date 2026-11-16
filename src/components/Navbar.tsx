import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  onOpenRegister: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenRegister }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  // Fermer le menu mobile lors d'un clic sur un lien
  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
  };

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
              <span className="brand-tagline">ÉCOLE DE PORTUGAIS &amp; MOBILITÉ AU BRÉSIL</span>
            </div>
          </Link>

          {/* Menu Desktop */}
          <div className="header-right header-desktop-nav">
            <a href="#formations" className="header-link">Nos formations</a>
            <a href="#partenaires" className="header-link">Universités</a>
            <Link to="/connexion" className="header-link">Connexion</Link>

            <button
              type="button"
              className="btn-orange-pill"
              onClick={onOpenRegister}
            >
              Commencer mon inscription
            </button>
          </div>

          {/* Actions Navbar Mobile (Complète & Haut de Gamme) */}
          <div className="header-mobile-actions">
            <Link to="/connexion" className="mobile-nav-link-connexion">
              Connexion
            </Link>

            <button
              type="button"
              className="btn-mobile-inscription"
              onClick={onOpenRegister}
            >
              S'inscrire
            </button>

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
                  <span className="brand-tagline">ÉCOLE DE PORTUGAIS &amp; MOBILITÉ AU BRÉSIL</span>
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

            <nav className="mobile-drawer-links">
              <a href="#formations" className="drawer-link-item" onClick={handleNavClick}>
                <i className="fa-solid fa-graduation-cap"></i>
                <span>Nos Formations (A1, A2, CELPE-Bras)</span>
              </a>
              <a href="#timeline" className="drawer-link-item" onClick={handleNavClick}>
                <i className="fa-solid fa-route"></i>
                <span>Processus d'admission en 4 étapes</span>
              </a>
              <a href="#partenaires" className="drawer-link-item" onClick={handleNavClick}>
                <i className="fa-solid fa-building-columns"></i>
                <span>Universités partenaires (USP, UnB...)</span>
              </a>
              <a href="#garantie" className="drawer-link-item" onClick={handleNavClick}>
                <i className="fa-solid fa-shield-halved"></i>
                <span>Garantie de Remboursement (85%)</span>
              </a>
              <a href="#faq" className="drawer-link-item" onClick={handleNavClick}>
                <i className="fa-solid fa-circle-question"></i>
                <span>Questions fréquentes (FAQ)</span>
              </a>
              <Link to="/portail" className="drawer-link-item link-highlight" onClick={handleNavClick}>
                <i className="fa-solid fa-id-card"></i>
                <span>Espace Étudiant</span>
              </Link>
              <Link to="/connexion" className="drawer-link-item" onClick={handleNavClick}>
                <i className="fa-solid fa-arrow-right-to-bracket"></i>
                <span>Connexion</span>
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
                <span>Commencer mon inscription</span>
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
