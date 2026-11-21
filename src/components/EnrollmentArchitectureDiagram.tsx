import React, { useEffect, useRef, useState } from 'react';
import { API_ENDPOINTS } from '../config/api';
import { useLanguage } from '../i18n/LanguageContext';

interface StepBranch {
  label: string;
  tone: 'emerald' | 'sky' | 'amber' | 'rose' | string;
}

interface EnrollmentStepItem {
  id: number;
  position: number;
  title: string;
  subtitle: string;
  icon: string;
  accent_color: 'navy' | 'emerald' | 'sky' | 'amber' | string;
  branches: StepBranch[];
}

const DEFAULT_STEPS: EnrollmentStepItem[] = [
  {
    id: 1,
    position: 1,
    title: 'Inscription & Dossier en Ligne',
    subtitle: 'Création de votre espace étudiant, choix du niveau CECRL (A1 à B2) et de votre objet d’étude.',
    icon: 'file-signature',
    accent_color: 'navy',
    branches: [
      { label: 'Niveau A1 : Accès direct', tone: 'emerald' },
      { label: 'Niveaux A2 / B1 / B2 : Justificatif du niveau précédent', tone: 'sky' },
    ],
  },
  {
    id: 2,
    position: 2,
    title: 'Choix du Parcours & Visa',
    subtitle: 'Sélectionnez la formule adaptée à votre projet académique ou professionnel au Brésil.',
    icon: 'compass',
    accent_color: 'sky',
    branches: [
      { label: 'Présentiel Brésil — Visa VITEM IV', tone: 'emerald' },
      { label: 'Présentiel Brésil — Visa Visiteur', tone: 'amber' },
      { label: '100 % En Ligne depuis votre pays', tone: 'sky' },
    ],
  },
  {
    id: 3,
    position: 3,
    title: 'Frais de Service & Scolarité',
    subtitle: 'Paiement sécurisé par carte bancaire ou virement avec reçus officiels PDF immédiats.',
    icon: 'credit-card',
    accent_color: 'amber',
    branches: [
      { label: 'Frais de Service (Plateforme & Démarches)', tone: 'sky' },
      { label: 'Scolarité : Comptant (1 fois) ou 3 Tranches', tone: 'emerald' },
    ],
  },
  {
    id: 4,
    position: 4,
    title: 'Documents Officiels & Consulat',
    subtitle: 'L’école délivre vos attestations officielles et suit votre demande de visa étape par étape.',
    icon: 'passport',
    accent_color: 'emerald',
    branches: [
      { label: 'Visa Accordé → Départ & Cours au Brésil', tone: 'emerald' },
      { label: 'Visa Refusé → Garantie 85 % remboursés sous 14 jours', tone: 'rose' },
    ],
  },
  {
    id: 5,
    position: 5,
    title: 'Intégration & Diplôme CELPE-Bras',
    subtitle: 'Accueil sur campus (logement, CPF, Police Fédérale) et passerelle vers les universités fédérales.',
    icon: 'graduation-cap',
    accent_color: 'navy',
    branches: [
      { label: 'UnB, USP, UNICAMP, UFRJ, UFMG, UFRGS', tone: 'emerald' },
    ],
  },
];

const ACCENT_LIGHT: Record<string, { stroke: string; badge: string; softBg: string }> = {
  navy: { stroke: '#0f172a', badge: '#0f172a', softBg: '#f1f5f9' },
  emerald: { stroke: '#059669', badge: '#059669', softBg: '#ecfdf5' },
  sky: { stroke: '#0284c7', badge: '#0284c7', softBg: '#f0f9ff' },
  amber: { stroke: '#ea580c', badge: '#ea580c', softBg: '#fff7ed' },
};

const BRANCH_TONE: Record<string, { stroke: string; dot: string; bg: string; text: string }> = {
  emerald: { stroke: '#10b981', dot: '#10b981', bg: '#ecfdf5', text: '#065f46' },
  sky: { stroke: '#0284c7', dot: '#0284c7', bg: '#f0f9ff', text: '#075985' },
  amber: { stroke: '#f59e0b', dot: '#f59e0b', bg: '#fffbeb', text: '#92400e' },
  rose: { stroke: '#e11d48', dot: '#e11d48', bg: '#fff1f2', text: '#9f1239' },
};

interface EnrollmentArchitectureDiagramProps {
  onOpenRegister?: () => void;
}

export const EnrollmentArchitectureDiagram: React.FC<EnrollmentArchitectureDiagramProps> = ({
  onOpenRegister,
}) => {
  const { lang } = useLanguage();
  const [steps, setSteps] = useState<EnrollmentStepItem[]>(DEFAULT_STEPS);
  const [visibleStages, setVisibleStages] = useState<Record<number, boolean>>({});
  const stageRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    fetch(`${API_ENDPOINTS.enrollmentSteps}?lang=${lang}`, {
      headers: { Accept: 'application/json' },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((payload) => {
        if (Array.isArray(payload?.data) && payload.data.length > 0) {
          setSteps(payload.data);
        }
      })
      .catch(() => {});
  }, [lang]);

  // Animation progressive au chargement et au scroll pour chaque étape
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idxAttr = entry.target.getAttribute('data-stage-index');
          if (idxAttr === null) return;
          const idx = Number(idxAttr);
          if (entry.isIntersecting) {
            setVisibleStages((prev) => (prev[idx] ? prev : { ...prev, [idx]: true }));
          }
        });
      },
      { threshold: 0.16, rootMargin: '0px 0px -40px 0px' }
    );

    stageRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [steps]);

  const heading =
    lang === 'en'
      ? 'Architecture of Your Procedure'
      : lang === 'pt'
      ? 'Esquema de Arquitetura do Seu Procedimento'
      : 'Schéma d’architecture de votre procédure';

  const subheading =
    lang === 'en'
      ? 'A clear visual diagram of every stage, decision branch, and guarantee from application to campus.'
      : lang === 'pt'
      ? 'Um diagrama claro de cada etapa, ramificação e garantia oficial da inscrição até o campus.'
      : 'Un organigramme clair de chaque étape, chaque embranchement et nos garanties officielles jusqu’au campus.';

  const ctaLabel =
    lang === 'en'
      ? 'Start My Application'
      : lang === 'pt'
      ? 'Iniciar minha inscrição'
      : 'Commencer mon inscription';

  return (
    <section id="schema" className="bp-section reveal-section">
      <div className="bp-outer">
        <div className="bp-board">
          {/* En-tête */}
          <div className="bp-header">
            <h2 className="bp-title">{heading}</h2>
            <p className="bp-subtitle">{subheading}</p>
          </div>

          {/* Organigramme sur fond blanc sans bordure, animé au scroll & chargement */}
          <div className="bp-flowchart">
            {steps.map((step, idx) => {
              const accent = ACCENT_LIGHT[step.accent_color] || ACCENT_LIGHT.emerald;
              const num = String(step.position || idx + 1).padStart(2, '0');
              const hasBranches = Array.isArray(step.branches) && step.branches.length > 0;
              const isLast = idx === steps.length - 1;
              const isVisible = Boolean(visibleStages[idx]);

              return (
                <div
                  key={step.id}
                  ref={(el) => {
                    stageRefs.current[idx] = el;
                  }}
                  data-stage-index={idx}
                  className={`bp-stage ${isVisible ? 'is-visible' : ''}`}
                  style={{ transitionDelay: `${Math.min(idx * 90, 360)}ms` }}
                >
                  {/* Nœud principal de l'organigramme */}
                  <div className="bp-node-row">
                    <div className="bp-node-box">
                      <div className="bp-node-left">
                        <div
                          className="bp-node-index"
                          style={{ background: accent.badge }}
                        >
                          {num}
                        </div>
                        <div
                          className="bp-node-icon"
                          style={{ background: accent.softBg, color: accent.stroke }}
                        >
                          <i className={`fa-solid fa-${step.icon || 'file-signature'}`}></i>
                        </div>
                      </div>

                      <div className="bp-node-body">
                        <h3 className="bp-node-title">{step.title}</h3>
                        {step.subtitle && <p className="bp-node-desc">{step.subtitle}</p>}
                      </div>
                    </div>

                    {/* Branches SVG courbes animées */}
                    {hasBranches && (
                      <div className="bp-branches-col">
                        <svg
                          className="bp-branch-svg"
                          width="52"
                          height="100%"
                          viewBox="0 0 52 100"
                          preserveAspectRatio="none"
                          aria-hidden="true"
                        >
                          {step.branches.map((b, bIdx) => {
                            const count = step.branches.length;
                            const targetY =
                              count === 1
                                ? 50
                                : 18 + (bIdx * 64) / (count - 1);
                            const tone = BRANCH_TONE[b.tone] || BRANCH_TONE.emerald;
                            return (
                              <path
                                key={bIdx}
                                className="bp-animated-dash"
                                d={`M 0 50 C 24 50, 24 ${targetY}, 51 ${targetY}`}
                                fill="none"
                                stroke={tone.stroke}
                                strokeWidth="1.9"
                                strokeDasharray="5 4"
                                opacity="0.85"
                              />
                            );
                          })}
                        </svg>

                        <div className="bp-branch-stack">
                          {step.branches.map((branch, bIdx) => {
                            const tone = BRANCH_TONE[branch.tone] || BRANCH_TONE.emerald;
                            return (
                              <div
                                key={bIdx}
                                className="bp-branch-box"
                                style={{
                                  background: tone.bg,
                                  color: tone.text,
                                  transitionDelay: `${Math.min(idx * 90 + (bIdx + 1) * 70, 520)}ms`,
                                }}
                              >
                                <span
                                  className="bp-branch-dot"
                                  style={{ background: tone.dot }}
                                />
                                <span>{branch.label}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Flèche SVG verticale animée vers le nœud suivant */}
                  {!isLast && (
                    <div className="bp-down-connector" aria-hidden="true">
                      <svg width="26" height="42" viewBox="0 0 26 42" fill="none">
                        <line
                          className="bp-animated-dash"
                          x1="13"
                          y1="0"
                          x2="13"
                          y2="34"
                          stroke={accent.stroke}
                          strokeWidth="2"
                          strokeDasharray="5 4"
                          opacity="0.7"
                        />
                        <path
                          d="M7 29L13 37L19 29"
                          stroke={accent.stroke}
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {onOpenRegister && (
            <div className="bp-footer">
              <button type="button" className="btn-orange-pill" onClick={onOpenRegister}>
                <span>{ctaLabel}</span>
                <i className="fa-solid fa-arrow-right" style={{ marginLeft: '8px' }}></i>
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .bp-section {
          padding: 4.5rem 1.25rem;
          background: #ffffff;
        }
        .bp-outer {
          max-width: 1120px;
          margin: 0 auto;
        }
        .bp-board {
          background: #ffffff;
          border: none;
          box-shadow: none;
          padding: 0.5rem 0;
        }
        .bp-header {
          text-align: center;
          max-width: 680px;
          margin: 0 auto 3.25rem auto;
          animation: bpFadeDown 0.65s ease-out both;
        }
        .bp-title {
          font-size: clamp(1.75rem, 3.1vw, 2.45rem);
          font-weight: 850;
          color: #0f172a;
          letter-spacing: -0.025em;
          margin: 0 0 0.7rem 0;
          line-height: 1.18;
        }
        .bp-subtitle {
          font-size: 0.96rem;
          color: #475569;
          line-height: 1.6;
          margin: 0;
        }
        .bp-flowchart {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          max-width: 960px;
          margin: 0 auto;
        }
        .bp-stage {
          display: flex;
          flex-direction: column;
          opacity: 0;
          transform: translateY(28px) scale(0.985);
          transition: opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1), transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .bp-stage.is-visible {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
        .bp-node-row {
          display: grid;
          grid-template-columns: minmax(320px, 1.15fr) minmax(260px, 0.95fr);
          align-items: stretch;
        }
        .bp-node-box {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1.35rem 1.45rem;
          border-radius: 18px;
          background: #f8fafc;
          border: none;
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.045);
          transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
        }
        .bp-node-box:hover {
          transform: translateY(-3px);
          background: #ffffff;
          box-shadow: 0 14px 32px rgba(15, 23, 42, 0.09);
        }
        .bp-node-left {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.45rem;
          flex-shrink: 0;
        }
        .bp-node-index {
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 0.72rem;
          font-weight: 800;
          color: #ffffff;
          padding: 3px 9px;
          border-radius: 7px;
          letter-spacing: 0.06em;
        }
        .bp-node-icon {
          width: 40px;
          height: 40px;
          border-radius: 11px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 1.02rem;
        }
        .bp-node-body {
          min-width: 0;
          flex: 1;
        }
        .bp-node-title {
          font-size: 1.04rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 0.35rem 0;
          line-height: 1.3;
        }
        .bp-node-desc {
          font-size: 0.84rem;
          color: #475569;
          line-height: 1.55;
          margin: 0;
        }
        .bp-branches-col {
          display: flex;
          align-items: stretch;
        }
        .bp-branch-svg {
          flex-shrink: 0;
          min-height: 76px;
        }
        .bp-animated-dash {
          animation: bpDashFlow 1.6s linear infinite;
        }
        .bp-branch-stack {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 0.5rem;
          flex: 1;
        }
        .bp-branch-box {
          display: flex;
          align-items: center;
          gap: 0.55rem;
          padding: 0.55rem 0.9rem;
          border-radius: 11px;
          border: none;
          font-size: 0.8rem;
          font-weight: 700;
          line-height: 1.3;
          opacity: 0;
          transform: translateX(14px);
          transition: opacity 0.45s ease, transform 0.45s ease;
        }
        .bp-stage.is-visible .bp-branch-box {
          opacity: 1;
          transform: translateX(0);
        }
        .bp-branch-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .bp-down-connector {
          display: flex;
          justify-content: flex-start;
          padding-left: 160px;
          height: 42px;
        }
        .bp-footer {
          margin-top: 2.75rem;
          display: flex;
          justify-content: center;
        }
        @keyframes bpDashFlow {
          from {
            stroke-dashoffset: 18;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
        @keyframes bpFadeDown {
          from {
            opacity: 0;
            transform: translateY(-12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @media (max-width: 860px) {
          .bp-node-row {
            grid-template-columns: 1fr;
            gap: 0.65rem;
          }
          .bp-branch-svg {
            display: none;
          }
          .bp-branches-col {
            padding-left: 1.15rem;
            border-left: 2px dashed #cbd5e1;
            margin-left: 1.15rem;
          }
          .bp-down-connector {
            padding-left: 24px;
          }
        }
      `}</style>
    </section>
  );
};
