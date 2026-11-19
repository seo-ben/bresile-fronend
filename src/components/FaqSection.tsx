import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Qu’est-ce que le visa étudiant VITEM IV et qui peut en bénéficier ?',
      a: 'Le visa temporaire VITEM IV est le visa officiel délivré par les consulats généraux du Brésil aux étrangers inscrits dans un programme académique ou de formation linguistique certifiée. Brasil·É fournit l’ensemble des pièces obligatoires (attestation officielle d’acceptation, charge horaire hebdomadaire minimale de 15h, inscription au registre académique). Tout candidat titulaire d’un passeport valide peut postuler.',
    },
    {
      q: 'Comment s’applique exactement la Garantie de Remboursement 85% ?',
      a: 'Si après avoir déposé un dossier complet votre demande de visa venait à faire l’objet d’un refus consulaire officiel, 85% du total des sommes réglées à l’école vous sont immédiatement restituées par virement bancaire sous 14 jours ouvrés. Les 15% restants couvrent les frais incompressibles d’émission et de secrétariat.',
    },
    {
      q: 'Puis-je commencer par le niveau A1 en ligne et continuer au Brésil ?',
      a: 'Absolument ! C’est même le parcours recommandé pour de nombreux étudiants. Vous suivez le niveau A1 depuis votre pays d’origine tout en préparant sereinement votre demande de visa pour rejoindre les niveaux A2 et B1 en présentiel à Brasília, São Paulo ou Rio de Janeiro.',
    },
    {
      q: 'Quels sont les modes de paiement acceptés et en quelles devises ?',
      a: 'Nous acceptons les règlements par virement bancaire international ainsi que les règlements par carte bancaire. Tous les tarifs peuvent être affichés et réglés en Euros (€), en Francs CFA (XOF) ou en Real Brésilien (BRL / R$) selon le taux officiel internet en temps réel. Des facilités de paiement échelonné sont également accordées sur demande.',
    },
    {
      q: 'L’école aide-t-elle à trouver un logement et à s’installer au Brésil ?',
      a: 'Oui. Nos équipes locales vous assistent pour la recherche de logement étudiant (résidences partenaires, collocations sécurisées ou familles d’accueil) et vous guident lors de votre arrivée pour l’enregistrement auprès de la Police Fédérale (obtention du RNE / CRNM) et la création de votre CPF (numéro d’identification fiscal brésilien).',
    },
  ];

  return (
    <section id="faq" className="faq-section">
      <div className="section-title-center">
        <span className="section-pill-badge">RÉPONSES À VOS QUESTIONS</span>
        <h2 className="section-h2">Foire Aux Questions</h2>
        <p className="section-p">
          Retrouvez les réponses aux interrogations les plus fréquentes concernant les cours, les visas et la vie au Brésil.
        </p>
      </div>

      <div className="faq-accordion-wrap">
        {faqs.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={idx} className={`faq-item ${isOpen ? 'open' : ''}`}>
              <button
                type="button"
                className="faq-question-btn"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                aria-expanded={isOpen}
              >
                <div className="faq-q-left">
                  <HelpCircle size={18} className="text-emerald-500" />
                  <span>{item.q}</span>
                </div>
                <ChevronDown size={20} className={`faq-chevron ${isOpen ? 'rotate' : ''}`} />
              </button>
              {isOpen && (
                <div className="faq-answer-body">
                  <p>{item.a}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

