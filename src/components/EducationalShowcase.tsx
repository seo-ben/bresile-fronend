import React, { useState, useEffect, useRef } from 'react';
import type { Program } from '../types';

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

interface SlideData {
  titleLine1: string;
  ampersand: string;
  titleLine2: string;
  subtitle: React.ReactNode;
  bgUrl: string;
  ctaText: string;
  programIndex: number;
  tabLabel: string;
  icon: string;
}

const showcaseSlides: SlideData[] = [
  {
    titleLine1: 'Immersion Linguistique',
    ampersand: '&',
    titleLine2: 'Culturelle',
    tabLabel: 'Immersion au Brésil',
    icon: 'fa-solid fa-plane-departure',
    subtitle: (
      <>
        Apprenez le portugais à <strong>Brasilia</strong> ou <strong>São Paulo</strong> en immersion totale, au contact direct d’enseignants natifs et de la vie locale.
      </>
    ),
    bgUrl: '/images/showcase-immersion.jpg',
    ctaText: "Choisir l'immersion au Brésil",
    programIndex: 0,
  },
  {
    titleLine1: 'Cours de Portugais',
    ampersand: '&',
    titleLine2: 'En Ligne Direct',
    tabLabel: 'Cours en Ligne',
    icon: 'fa-solid fa-laptop',
    subtitle: (
      <>
        Validez les fondamentaux du portugais brésilien depuis chez vous en <strong>Afrique</strong> avec nos professeurs natifs en visioconférence directe.
      </>
    ),
    bgUrl: '/images/showcase-online.jpg',
    ctaText: 'Démarrer les cours en ligne',
    programIndex: 1,
  },
  {
    titleLine1: 'Diplôme CELPE-Bras',
    ampersand: '&',
    titleLine2: 'Cursus Universitaire',
    tabLabel: 'Diplôme CELPE-Bras',
    icon: 'fa-solid fa-graduation-cap',
    subtitle: (
      <>
        Perfectionnement académique au <strong>Brésil</strong> pour réussir le diplôme d’État officiel et intégrer les <strong>universités partenaires</strong>.
      </>
    ),
    bgUrl: '/images/showcase-university.jpg',
    ctaText: 'Postuler au cursus universitaire',
    programIndex: 2,
  },
];

export const EducationalShowcase: React.FC<EducationalShowcaseProps> = ({ onSelectProgram }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState<0 | 1 | 2>(0);

  // Détection du scroll fluide sur grand écran et mobile
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
      {/* ====================================================================
          SESSION 2 : SCROLL-DRIVEN BANNER PANORAMIQUE HAUTE FIDÉLITÉ
          ==================================================================== */}
      <div ref={trackRef} className="scroll-showcase-track">
        <div className="scroll-showcase-sticky">
          {/* Images d'arrière-plan en fondu enchaîné (1: Immersion, 2: Online, 3: University) */}
          <div className="showcase-bg-stack" aria-hidden="true">
            {showcaseSlides.map((slide, idx) => (
              <div
                key={idx}
                className={`showcase-bg-layer ${activeStep === idx ? 'is-active' : ''}`}
                style={{ backgroundImage: `url(${slide.bgUrl})` }}
              />
            ))}
            <div className="showcase-bg-scrim-light" />
          </div>

          {/* Contenu textuel pour chaque slide */}
          <div className="showcase-slides-container">
            {showcaseSlides.map((slide, idx) => (
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

                  <p className="showcase-lead-description">
                    {slide.subtitle}
                  </p>

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

                  {/* Bouton d'action pour chaque formation */}
                  <div className="showcase-action-row">
                    <button
                      type="button"
                      className="btn-showcase-action"
                      onClick={() => onSelectProgram?.(defaultPrograms[slide.programIndex])}
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
