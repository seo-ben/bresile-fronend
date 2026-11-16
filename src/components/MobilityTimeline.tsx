import React, { useEffect, useRef, useState } from 'react';

interface TimelineStep {
  number: string;
  title: string;
  description: string;
  tags: string;
}

const timelineSteps: TimelineStep[] = [
  {
    number: '01',
    title: 'Inscription & Choix du Cursus',
    description: 'Choix de votre formation (présentiel ou en ligne) et validation de votre dossier.',
    tags: 'En Ligne • Gratuit & Immédiat',
  },
  {
    number: '02',
    title: 'Attestation Officielle sous 48h',
    description: 'Certificat de scolarité certifié conforme délivré par le secrétariat à Brasília.',
    tags: 'Normes MEC / INEP • Conforme Consulat',
  },
  {
    number: '03',
    title: 'Dépôt Visa VITEM IV & Garantie 85%',
    description: 'Dépôt consulaire sécurisé avec clause contractuelle de remboursement en cas de refus.',
    tags: 'Garantie 85% • Assistance Visa',
  },
  {
    number: '04',
    title: 'Arrivée, Logement & Rentrée au Brésil',
    description: 'Accueil à l’aéroport à Brasília ou São Paulo, CPF, démarches et début des cours.',
    tags: 'Brasília / SP • Accueil Garanti',
  },
];

export const MobilityTimeline: React.FC = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState<0 | 1 | 2 | 3>(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const trackHeight = trackRef.current.offsetHeight - window.innerHeight;
      if (trackHeight <= 0) return;

      // Progression du scroll de 0 à 1 dans la piste
      const progress = Math.min(Math.max(-rect.top / trackHeight, 0), 1);

      if (progress < 0.18) {
        setActiveStep(0);
      } else if (progress < 0.42) {
        setActiveStep(1);
      } else if (progress < 0.66) {
        setActiveStep(2);
      } else {
        setActiveStep(3);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={trackRef} id="timeline" className="stacking-timeline-track reveal-section">
      <div className="stacking-timeline-sticky">
        <div className="stacking-timeline-header">
          <h2 className="timeline-main-title reveal-left">
            De votre pays d’origine jusqu’à votre première rentrée au Brésil
          </h2>
          <p className="timeline-lead-desc reveal-right">
            Un processus d'admission et de mobilité clair, rapide et sécurisé en 4 étapes.
          </p>
        </div>

        {/* Espace scénique où les cartes s'empilent au fil du scroll sur desktop et mobile */}
        <div className="sleek-deck-stage">
          {timelineSteps.map((step, idx) => {
            const isVisible = activeStep >= idx;
            return (
              <div
                key={idx}
                className={`sleek-deck-card ${isVisible ? 'is-stacked' : 'is-hidden'}`}
                style={{
                  transform: isVisible
                    ? `translateY(${idx * 14}px)`
                    : `translateY(${110 + idx * 24}px)`,
                  opacity: isVisible ? 1 : 0,
                  zIndex: idx + 1,
                  pointerEvents: isVisible ? 'auto' : 'none',
                }}
              >
                <div className="card-left-group">
                  <span className="card-step-num">{step.number}</span>
                  <div className="card-text-block">
                    <h3 className="card-title-text">{step.title}</h3>
                    <p className="card-desc-short">{step.description}</p>
                  </div>
                </div>

                <div className="card-right-group">
                  <span className="card-tag-keywords">{step.tags}</span>
                  <span className="card-arrow-icon" aria-hidden="true">
                    ↗
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
