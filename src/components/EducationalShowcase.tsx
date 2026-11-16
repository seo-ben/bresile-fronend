import React, { useState, useEffect, useRef } from 'react';
import type { Program } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface EducationalShowcaseProps {
  onSelectProgram: (program: Program) => void;
}

export const defaultPrograms: Program[] = [
  {
    id: 1,
    title: 'Niveau A1 — Immersion au Brésil',
    category: 'in_person',
    categoryLabel: 'Immersion Brésil',
    level: 'Niveau A1',
    city: 'Brasília ou São Paulo',
    studyMode: 'Présentiel au Brésil',
    duration: '6 mois',
    hours: 240,
    priceEur: 500,
    isGuaranteed: true,
    statusBadge: 'Présentiel au Brésil',
    description: 'Immersion linguistique et culturelle complète avec cours intensifs au Brésil.',
    features: [
      'Attestation d’inscription officielle certifiée',
      '240h de cours intensifs en immersion (15h à 20h/semaine)',
      'Garantie académique et de remboursement à 85%',
      'Assistance hébergement et démarches à l’arrivée',
    ],
  },
  {
    id: 2,
    title: 'Niveau A1 — Cours en Ligne',
    category: 'online',
    categoryLabel: 'Cours en ligne',
    level: 'Niveau A1',
    city: 'En Ligne',
    studyMode: 'À distance',
    duration: '3 mois',
    hours: 120,
    priceEur: 350,
    isGuaranteed: false,
    statusBadge: 'Démarrage immédiat',
    description: 'Acquérez les bases du portugais brésilien depuis chez vous avec nos professeurs natifs.',
    features: [
      '120h de visioconférences en direct avec professeurs natifs',
      'Créneaux adaptés (cours du soir ou du samedi)',
      'Accès illimité à la plateforme e-learning et exercices corrigés',
      'Certification officielle de fin de niveau A1',
    ],
  },
  {
    id: 3,
    title: 'Niveau A2 & Diplôme CELPE-Bras',
    category: 'in_person',
    categoryLabel: 'Universitaire',
    level: 'Niveau A2',
    city: 'Brésil',
    studyMode: 'Présentiel au Brésil',
    duration: '6 mois',
    hours: 280,
    priceEur: 500,
    isGuaranteed: true,
    statusBadge: 'Accès Université',
    description: 'Perfectionnement académique et préparation intensive aux examens du CELPE-Bras.',
    features: [
      'Préparation intensive aux épreuves d’État du CELPE-Bras',
      'Certificats d’assiduité et dossiers académiques',
      'Accompagnement aux candidatures dans les universités brésiliennes',
    ],
  },
];

const slideBackgrounds = [
  '/images/showcase-immersion.jpg',
  '/images/showcase-online.jpg',
  '/images/showcase-university.jpg',
];

export const EducationalShowcase: React.FC<EducationalShowcaseProps> = ({ onSelectProgram }) => {
  const { t } = useLanguage();
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState<0 | 1 | 2>(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const trackHeight = trackRef.current.offsetHeight - window.innerHeight;
      if (trackHeight <= 0) return;

      const progress = Math.min(Math.max(-rect.top / trackHeight, 0), 1);

      if (progress < 0.35) {
        setActiveStep(0);
      } else if (progress < 0.70) {
        setActiveStep(1);
      } else {
        setActiveStep(2);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div id="formations" className="educational-editorial-section">
      <div ref={trackRef} className="scroll-showcase-track">
        <div className="scroll-showcase-sticky">
          <div className="showcase-bg-stack" aria-hidden="true">
            {slideBackgrounds.map((bgUrl, idx) => (
              <div
                key={idx}
                className={`showcase-bg-layer ${activeStep === idx ? 'is-active' : ''}`}
                style={{ backgroundImage: `url(${bgUrl})` }}
              />
            ))}
            <div className="showcase-bg-scrim-light" />
          </div>

          <div className="showcase-slides-container">
            {t.showcase.slides.map((slide, idx) => (
              <div
                key={idx}
                className={`showcase-slide-wrapper ${activeStep === idx ? 'is-active' : ''}`}
              >
                <div className="showcase-editorial-content">
                  <h2 className="showcase-main-title">
                    <span className="title-line-straight">{slide.titleLine1}</span>
                    <span className="title-line-straight">
                      <span className="accent-green">{slide.ampersand}</span> {slide.titleLine2}
                    </span>
                  </h2>

                  <p
                    className="showcase-lead-description"
                    dangerouslySetInnerHTML={{ __html: slide.subtitleHtml }}
                  />

                  <div className="showcase-stroke-container" aria-hidden="true">
                    <svg
                      className="yellow-brush-swoosh"
                      viewBox="0 0 200 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2 11C40 4 110 3 195 7C140 11 60 13 2 11Z"
                        fill="#F59E0B"
                      />
                    </svg>
                  </div>

                  <div className="showcase-action-row">
                    <button
                      type="button"
                      className="btn-showcase-action"
                      onClick={() => onSelectProgram?.(defaultPrograms[idx])}
                    >
                      <span>{slide.ctaText}</span>
                      <i className="fa-solid fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
