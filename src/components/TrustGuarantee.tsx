import React from 'react';

const points = [
  { icon: 'fa-file-signature', text: 'Clause signée dès l’inscription' },
  { icon: 'fa-building-columns', text: 'Virement sous 14 jours ouvrés' },
  { icon: 'fa-shield-halved', text: 'Dossiers officiels conformes' },
];

export const TrustGuarantee: React.FC = () => {
  return (
    <section id="garantie" className="guarantee-flat reveal-section">
      <div className="guarantee-flat-inner">
        <div className="guarantee-flat-figure reveal-left">
          <span className="guarantee-flat-number">85%</span>
          <span className="guarantee-flat-caption">remboursés si le visa est refusé</span>
        </div>

        <div className="guarantee-flat-copy reveal-right">
          <h3 className="guarantee-flat-title">
            La seule école qui sécurise financièrement votre projet d’études
          </h3>
          <p className="guarantee-flat-text">
            Refus de visa par le consulat ? 85 % des montants réglés vous sont restitués.
            C’est écrit dans votre contrat.
          </p>

          <ul className="guarantee-flat-points">
            {points.map((p) => (
              <li key={p.text}>
                <i className={`fa-solid ${p.icon}`}></i>
                <span>{p.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
