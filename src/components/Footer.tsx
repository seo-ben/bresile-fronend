import React, { useState } from 'react';

interface FooterProps {
  onOpenRegister: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenRegister }) => {
  const [leadInput, setLeadInput] = useState('');

  const handleCtaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onOpenRegister();
  };

  return (
    <footer className="footer-container-styled">
      {/* ====================================================================
          PARTIE 1 : GRAND BANDEAU CTA BLANC ÉPURÉ
          ==================================================================== */}
      <div className="footer-glowing-cta-section reveal-section">
        <div className="footer-cta-inner-content">
          <h2 className="footer-cta-headline reveal-left">
            Lancez dès aujourd'hui votre projet d'études au Brésil !
          </h2>

          <p className="footer-cta-subhead reveal-right">
            Votre attestation officielle d’inscription et votre accompagnement visa délivrés en moins de 48 heures.
          </p>

          {/* Capsule de saisie blanche avec bouton sombre arrondi */}
          <form className="footer-cta-capsule-bar reveal-left reveal-delay-1" onSubmit={handleCtaSubmit}>
            <div className="capsule-input-prefix">
              <i className="fa-solid fa-globe"></i>
            </div>
            <input
              type="text"
              className="capsule-text-input"
              placeholder="Entrez votre adresse e-mail ou numéro WhatsApp..."
              value={leadInput}
              onChange={(e) => setLeadInput(e.target.value)}
            />
            <button type="submit" className="capsule-submit-action-btn">
              <span>Commencer mon inscription</span>
            </button>
          </form>

          {/* Ligne des partenaires et accréditations officielles */}
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

      {/* ====================================================================
          PARTIE 2 : CORPS DU FOOTER EN 4 COLONNES (FOND BLANC POINTILLÉ)
          ==================================================================== */}
      <div className="footer-dark-body reveal-section">
        <div className="footer-dark-inner">
          <div className="footer-grid-four-columns">
            {/* Colonne 1 : Brand, Présentation & Réseaux Sociaux */}
            <div className="footer-col-identity reveal-left">
              <div className="footer-brand-title">
                <span className="brand-primary-white">Brasil</span>
                <span className="brand-dot-green">·</span>
                <span className="brand-accent-green">É</span>
              </div>

              <p className="footer-identity-bio">
                Brasil·É offre un accompagnement d’excellence aux étudiants africains : apprentissage immersif du portugais, préparation au diplôme d’État CELPE-Bras et mobilité académique vers les meilleures universités du Brésil.
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

            {/* Colonne 2 : Nos Formations */}
            <div className="footer-col-nav reveal-left reveal-delay-1">
              <h4 className="footer-column-heading">Nos Formations</h4>
              <ul className="footer-plain-nav-list">
                <li><a href="#formations">Immersion Linguistique (Brasília)</a></li>
                <li><a href="#formations">Cours de Portugais en Ligne Direct</a></li>
                <li><a href="#formations">Préparation Diplôme CELPE-Bras</a></li>
                <li><a href="#formations">Cursus Pré-Universitaire Partenaire</a></li>
                <li><a href="#formations">Phonétique &amp; Pratique Orale</a></li>
              </ul>
            </div>

            {/* Colonne 3 : À Propos de Brasil·É */}
            <div className="footer-col-nav reveal-right reveal-delay-1">
              <h4 className="footer-column-heading">À Propos de Brasil·É</h4>
              <ul className="footer-plain-nav-list">
                <li><a href="#formations">Pourquoi Choisir le Brésil</a></li>
                <li><a href="#partenaires">Universités Partenaires</a></li>
                <li><a href="#garantie">Garantie Contractuelle 85%</a></li>
                <li><a href="#timeline">Démarches Visa VITEM IV</a></li>
                <li><a href="#faq">Questions Fréquentes (FAQ)</a></li>
                <li><a href="#garantie">Mentions Légales &amp; Confidentialité</a></li>
              </ul>
            </div>

            {/* Colonne 4 : Nos Campus (Style Pills Badges comme Sigma Hotel / Techt / Call) */}
            <div className="footer-col-departments reveal-right">
              <h4 className="footer-column-heading">Nos Campus</h4>
              <div className="footer-campus-pills-list">
                {/* Pill 1 : Brasília */}
                <div className="campus-badge-pill" onClick={onOpenRegister}>
                  <div className="campus-monogram-circle bg-gold">DF</div>
                  <span className="campus-name-label">CAMPUS BRASÍLIA</span>
                </div>

                {/* Pill 2 : São Paulo */}
                <div className="campus-badge-pill" onClick={onOpenRegister}>
                  <div className="campus-monogram-circle bg-purple">SP</div>
                  <span className="campus-name-label">CAMPUS SÃO PAULO</span>
                </div>

                {/* Pill 3 : En Ligne */}
                <div className="campus-badge-pill" onClick={onOpenRegister}>
                  <div className="campus-monogram-circle bg-indigo">OL</div>
                  <span className="campus-name-label">CAMPUS EN LIGNE</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ====================================================================
            PARTIE 3 : BARRE INFÉRIEURE COPYRIGHT
            ==================================================================== */}
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
