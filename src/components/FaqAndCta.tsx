import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

interface FaqAndCtaProps {
  onOpenRegister?: () => void;
}

export const FaqAndCta: React.FC<FaqAndCtaProps> = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Quelles sont les conditions pour s’inscrire à Brasil·É ?',
      a: 'L’inscription est ouverte à toute personne motivée désirant apprendre le portugais brésilien ou poursuivre ses études au Brésil. Aucun prérequis linguistique n’est demandé pour débuter au Niveau A1. Pour le parcours en immersion au Brésil, vous devez être titulaire d’un passeport en cours de validité pour engager la demande de visa d’études.',
    },
    {
      q: 'En combien de mensualités puis-je régler ma formation ?',
      a: 'Nous proposons une formule de paiement échelonné en 3 mensualités sans frais : un premier acompte lors de la validation du dossier pour émettre votre attestation officielle, puis deux mensualités réparties au cours des mois suivants.',
    },
    {
      q: 'Comment s’applique exactement la garantie de remboursement de 85% ?',
      a: 'Cette protection est une clause contractuelle formelle inscrite directement dans votre contrat de scolarité. Si, après avoir déposé un dossier complet et conforme, le consulat du Brésil venait à rejeter votre demande de visa d’études, 85% des sommes que vous avez réglées à l’école vous sont restituées par virement bancaire sous 14 jours ouvrés suivant la notification du refus consulaire.',
    },
    {
      q: 'En combien de temps l’attestation officielle d’inscription est-elle délivrée ?',
      a: 'Dès que votre dossier d’inscription est validé par le secrétariat administratif à Brasília, votre attestation d’inscription certifiée conforme aux exigences consulaires est émise sous 48 heures ouvrées et mise à disposition dans votre espace étudiant pour votre rendez-vous à l’Ambassade.',
    },
    {
      q: 'Le diplôme CELPE-Bras permet-il d’entrer dans n’importe quelle université au Brésil ?',
      a: 'Oui. Le CELPE-Bras est le seul certificat de compétence en langue portugaise pour étrangers officiellement reconnu par le gouvernement brésilien (Ministério da Educação - MEC). Il est requis par toutes les universités publiques et privées du pays pour les étudiants internationaux.',
    },
  ];

  const toggleFaq = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="faq-editorial-section reveal-section">
      <div className="faq-editorial-container">
        {/* Colonne Gauche : Titre Éditorial */}
        <div className="faq-editorial-sidebar reveal-left">
          <div className="faq-editorial-sidebar-sticky">
            <h2 className="faq-editorial-title">Questions fréquentes</h2>
            <p className="faq-editorial-subtitle">
              Tout ce que vous devez savoir pour préparer sereinement votre inscription, vos démarches consulaires et votre départ au Brésil.
            </p>
          </div>
        </div>

        {/* Colonne Droite : Liste Accordéon Épurée (Zéro carte, lignes fines) */}
        <div className="faq-editorial-content reveal-right">
          <div className="faq-line-list">
            {faqs.map((faq, idx) => {
              const isOpen = openIdx === idx;
              return (
                <div
                  key={idx}
                  className={`faq-line-item ${isOpen ? 'is-open' : ''}`}
                >
                  <button
                    type="button"
                    className="faq-line-trigger"
                    onClick={() => toggleFaq(idx)}
                    aria-expanded={isOpen}
                  >
                    <span className="faq-line-question">{faq.q}</span>
                    <span className="faq-line-icon" aria-hidden="true">
                      {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="faq-line-answer-pane">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
