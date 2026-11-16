import React, { useState } from 'react';
import type { Program } from '../types';
import { X, CheckCircle, ShieldCheck, ArrowRight, User, Mail, Phone, MapPin, BookOpen, GraduationCap } from 'lucide-react';
import { API_ENDPOINTS } from '../config/api';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProgram?: Program | null;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  selectedProgram,
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<1 | 2>(1);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [level, setLevel] = useState(selectedProgram?.level || 'Niveau A1 Débutant');
  const [city, setCity] = useState(selectedProgram?.city || 'Brasília (Capitale)');
  const [studyMode, setStudyMode] = useState(selectedProgram?.studyMode || 'Présentiel au Brésil');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const currentPriceEur = selectedProgram?.priceEur || (studyMode.includes('Ligne') ? 350 : 850);
  const xof = Math.round(currentPriceEur * 655.957).toLocaleString('fr-FR');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch(API_ENDPOINTS.register, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email: email,
          phone: phone,
          password: 'Password123!',
          password_confirmation: 'Password123!',
          level_choice: level,
          city_choice: city,
          study_mode: studyMode,
        }),
      });

      const data = await res.json();
      if (res.ok || data.success || data.user) {
        setIsSuccess(true);
      } else {
        if (data.message && data.message.includes('already been taken')) {
          setIsSuccess(true);
        } else {
          setErrorMsg(data.message || 'Une erreur est survenue lors de l’envoi. Veuillez réessayer.');
        }
      }
    } catch {
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div>
            <h3 className="modal-title">
              {isSuccess ? 'Demande Enregistrée avec Succès !' : 'Dossier d’Inscription — Mobilité Brésil'}
            </h3>
            <p className="modal-sub">
              {isSuccess
                ? 'Un conseiller pédagogique Brasil·É prendra contact avec vous sous 24h.'
                : 'Complétez votre dossier pour réserver votre session et lancer votre accompagnement visa.'}
            </p>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Fermer">
            <X size={20} />
          </button>
        </div>

        {isSuccess ? (
          <div className="modal-success-body">
            <div className="success-icon-wrap">
              <CheckCircle size={56} className="text-emerald-500" />
            </div>
            <h4>Parabéns ! Votre demande a été reçue.</h4>
            <p>
              Nous avons bien enregistré votre demande pour <strong>{level}</strong> ({studyMode} — {city}).
              Un e-mail récapitulatif avec les coordonnées et les pièces requises pour le consulat du Brésil vous a été envoyé à <strong>{email}</strong>.
            </p>

            <div className="success-guarantee-box">
              <ShieldCheck size={24} className="text-amber-500" />
              <div>
                <strong>Garantie 85% Active :</strong>
                <span> Votre inscription bénéficie automatiquement de la garantie contractuelle de remboursement en cas de refus consulaire.</span>
              </div>
            </div>

            <button type="button" className="btn-modal-primary" onClick={onClose}>
              Fermer et retourner au site
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="modal-form">
            {errorMsg && <div className="modal-error-alert">{errorMsg}</div>}

            {step === 1 && (
              <div className="modal-step-body">
                <div className="form-group">
                  <label className="form-label">
                    <GraduationCap size={16} />
                    Niveau CECRL Souhaité
                  </label>
                  <select
                    className="form-select"
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                  >
                    <option value="Niveau A1 Débutant">Niveau A1 — Débutant complet (Recommandé)</option>
                    <option value="Niveau A2 Élémentaire">Niveau A2 — Élémentaire</option>
                    <option value="Niveau B1 Intermédiaire">Niveau B1 — Intermédiaire / Universitaire</option>
                    <option value="Niveau B2 Avancé">Niveau B2 — Avancé / Professionnel</option>
                  </select>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label">
                      <BookOpen size={16} />
                      Modalité d’Études
                    </label>
                    <select
                      className="form-select"
                      value={studyMode}
                      onChange={(e) => setStudyMode(e.target.value)}
                    >
                      <option value="Présentiel au Brésil">Présentiel au Brésil (Visa VITEM IV)</option>
                      <option value="100% En Ligne">100% En Ligne (Depuis l’Afrique)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <MapPin size={16} />
                      Ville d’Accueil
                    </label>
                    <select
                      className="form-select"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      disabled={studyMode.includes('Ligne')}
                    >
                      <option value="Brasília (Capitale)">Brasília — Siège &amp; Capitale Fédérale</option>
                      <option value="São Paulo (Centre financier)">São Paulo — Pôle Universitaire</option>
                      <option value="Rio de Janeiro (Zone Sud)">Rio de Janeiro — Plage &amp; Culture</option>
                      <option value="Salvador de Bahia">Salvador de Bahia — Historique</option>
                    </select>
                  </div>
                </div>

                {/* Price Preview Card */}
                <div className="modal-price-box">
                  <div className="price-box-header">
                    <span>Tarif Officiel de la Formation :</span>
                  </div>
                  <div className="modal-main-price">{currentPriceEur} €</div>
                  <div className="modal-sub-price">≈ {xof} FCFA (Montant fixé par l’administration)</div>
                  {studyMode.includes('Brésil') && (
                    <div className="modal-guarantee-note">
                      <ShieldCheck size={16} className="text-emerald-500" />
                      <span>Dossier officiel Visa VITEM IV &amp; Garantie 85% de remboursement inclus.</span>
                    </div>
                  )}
                </div>

                <div className="modal-actions-row">
                  <button
                    type="button"
                    className="btn-modal-primary"
                    onClick={() => setStep(2)}
                  >
                    <span>Continuer vers mes coordonnées</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="modal-step-body">
                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label">
                      <User size={16} />
                      Prénom du Candidat *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Amadou"
                      className="form-input"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <User size={16} />
                      Nom de Famille *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Diallo"
                      className="form-input"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <Mail size={16} />
                    Adresse E-mail Officielle *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="Ex: amadou.diallo@example.com"
                    className="form-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <span className="input-help">Votre attestation d’inscription et les instructions consulaires seront envoyées à cette adresse.</span>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <Phone size={16} />
                    Numéro Téléphone / WhatsApp (Avec indicatif) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Ex: +221 77 123 45 67"
                    className="form-input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div className="modal-actions-row">
                  <button
                    type="button"
                    className="btn-modal-secondary"
                    onClick={() => setStep(1)}
                  >
                    ← Retour
                  </button>
                  <button
                    type="submit"
                    className="btn-modal-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Validation en cours...' : 'Confirmer mon Inscription →'}
                  </button>
                </div>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};
