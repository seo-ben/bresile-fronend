import React from 'react';
import type { Currency } from '../types';
import { formatDualPrice } from '../utils/currency';
import { ShieldCheck, Check, Clock, RefreshCw } from 'lucide-react';

interface GuaranteeSectionProps {
  currency: Currency;
  onOpenRegister: () => void;
}

export const GuaranteeSection: React.FC<GuaranteeSectionProps> = ({ currency, onOpenRegister }) => {
  const exampleAmount = 850;
  const refundAmount = Math.round(exampleAmount * 0.85);
  const dualTotal = formatDualPrice(exampleAmount, currency);
  const dualRefund = formatDualPrice(refundAmount, currency);

  return (
    <section id="garantie" className="guarantee-section">
      <div className="guarantee-container">
        <div className="guarantee-badge-top">
          <ShieldCheck size={18} />
          <span>SÉCURITÉ FINANCIÈRE MAXIMALE</span>
        </div>

        <h2 className="guarantee-title">
          Partez l’esprit serein avec notre <span className="text-amber-400">Garantie 85%</span>
        </h2>
        <p className="guarantee-sub">
          Nous sommes tellement confiants dans la conformité de nos dossiers académiques auprès des services consulaires brésiliens que nous inscrivons cet engagement noir sur blanc dans votre contrat d’inscription.
        </p>

        {/* Calculation Box Comparison */}
        <div className="guarantee-calc-card">
          <div className="calc-col">
            <span className="calc-label">Exemple sur un pack semestriel :</span>
            <div className="calc-amount">{dualTotal.primary}</div>
            <span className="calc-sub">{dualTotal.secondary}</span>
          </div>

          <div className="calc-divider">
            <div className="calc-badge-percent">85% REMBOURSÉS</div>
            <span className="calc-condition">En cas de refus du visa VITEM IV</span>
          </div>

          <div className="calc-col calc-highlight">
            <span className="calc-label">Montant restitué sur votre compte :</span>
            <div className="calc-amount text-emerald-400">{dualRefund.primary}</div>
            <span className="calc-sub text-emerald-200">{dualRefund.secondary}</span>
          </div>
        </div>

        {/* Key Points Grid */}
        <div className="guarantee-points-grid">
          <div className="guarantee-point">
            <div className="point-icon-wrap">
              <Check size={20} className="text-emerald-400" />
            </div>
            <div>
              <h4>Engagement Contractuel Écrit</h4>
              <p>La clause de garantie 85% figure expressément dans vos conditions générales de vente et votre reçu officiel d’inscription.</p>
            </div>
          </div>

          <div className="guarantee-point">
            <div className="point-icon-wrap">
              <Clock size={20} className="text-amber-400" />
            </div>
            <div>
              <h4>Remboursement Rapide sous 14 jours</h4>
              <p>Dès transmission de la notification consulaire de refus, notre service financier déclenche le virement de restitution sous 14 jours ouvrés.</p>
            </div>
          </div>

          <div className="guarantee-point">
            <div className="point-icon-wrap">
              <RefreshCw size={20} className="text-blue-400" />
            </div>
            <div>
              <h4>Option de Report Gratuite</h4>
              <p>Vous pouvez également choisir de reporter votre session sur la rentrée suivante ou basculer en formation 100% en ligne sans aucun frais supplémentaire.</p>
            </div>
          </div>
        </div>

        <div className="guarantee-cta-wrap">
          <button type="button" className="btn-guarantee-cta" onClick={onOpenRegister}>
            Démarrer mon inscription protégée par la garantie 85% →
          </button>
        </div>
      </div>
    </section>
  );
};
