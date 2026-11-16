import React from 'react';
import { FileText, Award, Plane, CheckCircle2 } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Inscription & Choix de Formation',
      subtitle: 'Sélectionnez votre niveau (A1 débutant à B2) et votre modalité (présentiel au Brésil ou cours en ligne). Remplissez le formulaire en 5 minutes.',
      icon: <FileText size={28} className="text-emerald-600" />,
      badges: ['Formulaire simplifié', 'Sans frais de dossier cachés'],
    },
    {
      num: '02',
      title: 'Attestation & Dossier Consulaire',
      subtitle: 'Notre secrétariat académique émet votre attestation officielle d’acceptation et de charge horaire certifiée, indispensable pour votre demande de visa.',
      icon: <Award size={28} className="text-amber-500" />,
      badges: ['Conforme exigences consulaires', 'Délivrée sous 48h'],
    },
    {
      num: '03',
      title: 'Visa VITEM IV & Arrivée au Brésil',
      subtitle: 'Vous déposez votre dossier au Consulat du Brésil avec notre accompagnement. En cas de refus consulaire, 85% de vos frais vous sont restitués par contrat.',
      icon: <Plane size={28} className="text-blue-600" />,
      badges: ['Garantie 85% contractuelle', 'Accueil à l’aéroport'],
    },
  ];

  return (
    <section id="visa" className="how-it-works-section">
      <div className="section-title-center">
        <span className="section-pill-badge">PROCÉDURE CLAIRE &amp; TRANSPARENTE</span>
        <h2 className="section-h2">Votre départ vers le Brésil en 3 étapes simples</h2>
        <p className="section-p">
          Nous simplifions chaque étape de votre mobilité pour vous permettre de vous concentrer sur votre apprentissage linguistique.
        </p>
      </div>

      <div className="steps-grid">
        {steps.map((st, idx) => (
          <div key={idx} className="step-card">
            <div className="step-number-tag">{st.num}</div>
            <div className="step-icon-bubble">{st.icon}</div>
            <h3 className="step-card-title">{st.title}</h3>
            <p className="step-card-desc">{st.subtitle}</p>
            <div className="step-badges">
              {st.badges.map((b, bIdx) => (
                <div key={bIdx} className="step-badge-item">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

