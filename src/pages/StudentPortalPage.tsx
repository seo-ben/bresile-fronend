import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './StudentPortalPage.css';
import { API_ENDPOINTS } from '../config/api';

type TabKey =
  | 'overview'
  | 'profile'
  | 'journey'
  | 'payments'
  | 'courses'
  | 'visa'
  | 'requests'
  | 'refund';

interface EnrollmentInfo {
  id: number;
  level_name: string;
  study_mode: string;
  target_university?: string;
  city_name: string;
  city_state: string;
  status: string;
  status_reason?: string;
  rhythm: string;
  enrolled_at?: string;
  installments?: Array<{
    id: number;
    installment_no: number;
    due_date?: string;
    amount: number;
    currency: string;
    status: string;
    paid_at?: string;
  }>;
}

interface StudentUser {
  id: number;
  email: string;
  role: string;
  status: string;
  profile?: {
    first_name?: string;
    last_name?: string;
    phone?: string;
    country_code?: string;
  };
  enrollments?: EnrollmentInfo[];
  visa_applications?: Array<{
    id: number;
    status: string;
    visa_outcome: string;
  }>;
}

export const StudentPortalPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<StudentUser | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [isProcessingStripe, setIsProcessingStripe] = useState(false);
  const [stripeSuccessMsg, setStripeSuccessMsg] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('student_token');
    const storedUserJson = localStorage.getItem('student_user');

    if (!token && !storedUserJson) {
      navigate('/connexion');
      return;
    }

    if (storedUserJson) {
      try {
        setUser(JSON.parse(storedUserJson));
      } catch {
        // fallback
      }
    }

    // Gestion du retour Stripe Checkout
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment') === 'success' && params.get('session_id') && token) {
      const sessionId = params.get('session_id')!;
      fetch(API_ENDPOINTS.stripeVerify, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ session_id: sessionId }),
      })
        .then((res) => res.json())
        .then(() => {
          setStripeSuccessMsg('Paiement Stripe confirmé avec succès ! Votre attestation d’inscription officielle est en cours d’émission sous 48h.');
        })
        .catch(() => {});
    } else if (params.get('payment') === 'simulation') {
      setStripeSuccessMsg('Simulation Stripe validée avec succès ! Votre dossier est maintenant actif.');
    }

    if (token) {
      fetch(API_ENDPOINTS.me, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((payload) => {
          if (payload?.data) {
            setUser(payload.data);
            localStorage.setItem('student_user', JSON.stringify(payload.data));
          }
        })
        .catch(() => {
          // offline fallback
        });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('student_token');
    localStorage.removeItem('student_user');
    navigate('/connexion');
  };

  const handleStripePayment = async (amount: number, description: string) => {
    setIsProcessingStripe(true);
    const token = localStorage.getItem('student_token');
    try {
      const res = await fetch(API_ENDPOINTS.stripeCheckout, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          enrollment_id: latestEnrollment?.id || 85,
          amount: amount,
          currency: 'EUR',
          description: description,
        }),
      });

      const data = await res.json();
      if (data?.data?.checkout_url) {
        window.location.href = data.data.checkout_url;
      } else {
        alert(data?.message || 'Erreur lors de la génération de la session Stripe.');
      }
    } catch {
      alert('Impossible de contacter le serveur de paiement Stripe.');
    } finally {
      setIsProcessingStripe(false);
    }
  };

  const firstName = user?.profile?.first_name || 'Komi';
  const lastName = user?.profile?.last_name || 'Lakimi';
  const fullName = `${firstName} ${lastName}`.trim();
  const initials = firstName.charAt(0) + (lastName ? lastName.charAt(0) : '');
  const candidateNumber = `BE-2026-${String(user?.id || 45).padStart(4, '0')}`;

  const latestEnrollment =
    user?.enrollments && user.enrollments.length > 0
      ? user.enrollments[user.enrollments.length - 1]
      : null;

  const formationTitle = latestEnrollment?.level_name || 'Niveau A1 — Débutant';
  const studyModeLabel =
    latestEnrollment?.study_mode === 'remote_home_country'
      ? 'En ligne (Depuis votre pays)'
      : 'Présentiel au Brésil (Visa VITEM IV)';
  const cityName = latestEnrollment?.city_name || 'Brasília';
  const cityState = latestEnrollment?.city_state || 'DF';
  const rhythmLabel =
    latestEnrollment?.rhythm === 'evening'
      ? 'Cours du soir'
      : 'Cours de jour (Matin / Après-midi)';

  return (
    <div className="portal-layout-direct">
      {/* ====================================================================
          1. SIDEBAR OFFICIELLE (8 RUBRIQUES SELON CAHIER DES CHARGES SECTION 14.1)
          ==================================================================== */}
      <aside className="portal-sidebar-direct">
        <div className="portal-sidebar-header">
          <Link to="/" className="portal-brand-link">
            <span>Brasil</span>
            <span className="dot">·</span>
            <span>É</span>
          </Link>
          <span className="portal-brand-badge">Espace Étudiant</span>
        </div>

        <nav className="portal-sidebar-menu">
          <button
            type="button"
            className={`portal-menu-link ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <i className="fa-solid fa-house-chimney"></i>
            <span>Mon Espace</span>
          </button>

          <button
            type="button"
            className={`portal-menu-link ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <i className="fa-solid fa-id-card-clip"></i>
            <span>Mes Informations</span>
          </button>

          <button
            type="button"
            className={`portal-menu-link ${activeTab === 'journey' ? 'active' : ''}`}
            onClick={() => setActiveTab('journey')}
          >
            <i className="fa-solid fa-route"></i>
            <span>Mon Parcours (6 étapes)</span>
          </button>

          <button
            type="button"
            className={`portal-menu-link ${activeTab === 'payments' ? 'active' : ''}`}
            onClick={() => setActiveTab('payments')}
          >
            <i className="fa-solid fa-credit-card"></i>
            <span>Mes Paiements & Échéances</span>
          </button>

          <button
            type="button"
            className={`portal-menu-link ${activeTab === 'courses' ? 'active' : ''}`}
            onClick={() => setActiveTab('courses')}
          >
            <i className="fa-solid fa-graduation-cap"></i>
            <span>Mes Cours & Assiduité</span>
          </button>

          <button
            type="button"
            className={`portal-menu-link ${activeTab === 'visa' ? 'active' : ''}`}
            onClick={() => setActiveTab('visa')}
          >
            <i className="fa-solid fa-passport"></i>
            <span>Visa & Documents</span>
          </button>

          <button
            type="button"
            className={`portal-menu-link ${activeTab === 'requests' ? 'active' : ''}`}
            onClick={() => setActiveTab('requests')}
          >
            <i className="fa-solid fa-comments"></i>
            <span>Mes Demandes</span>
          </button>

          <button
            type="button"
            className={`portal-menu-link ${activeTab === 'refund' ? 'active' : ''}`}
            onClick={() => setActiveTab('refund')}
          >
            <i className="fa-solid fa-shield-halved"></i>
            <span>Garantie & Remboursement</span>
          </button>
        </nav>

        {/* Profil de l'étudiant connecté */}
        <div className="portal-sidebar-bottom">
          <div className="portal-user-brief">
            <div className="portal-user-brief-info">
              <div className="portal-avatar-letter">
                {initials.toUpperCase() || 'KL'}
              </div>
              <div className="portal-user-brief-text">
                <div className="name">{fullName || 'Komi Lakimi'}</div>
                <div className="ref">{candidateNumber}</div>
              </div>
            </div>
            <button
              type="button"
              className="portal-logout-action"
              onClick={handleLogout}
              title="Déconnexion"
              aria-label="Déconnexion"
            >
              <i className="fa-solid fa-arrow-right-from-bracket"></i>
            </button>
          </div>
        </div>
      </aside>

      {/* ====================================================================
          2. ESPACE CENTRAL : TOPBAR + CONTENU ORGANISÉ SELON LE CAHIER DES CHARGES
          ==================================================================== */}
      <div className="portal-content-direct">
        <header className="portal-topbar-direct">
          <div className="portal-topbar-title">
            <h1>
              {activeTab === 'overview' && 'Mon Espace — Tableau de bord'}
              {activeTab === 'profile' && 'Mes Informations d’Inscription'}
              {activeTab === 'journey' && 'Mon Parcours Étudiant (Les 6 Étapes)'}
              {activeTab === 'payments' && 'Mes Paiements & Suivi des Échéances'}
              {activeTab === 'courses' && 'Mes Cours & Contrôle d’Assiduité'}
              {activeTab === 'visa' && 'Démarches Visa VITEM IV & Documents Officiels'}
              {activeTab === 'requests' && 'Mes Demandes à l’Administration'}
              {activeTab === 'refund' && 'Garantie Contractuelle de Remboursement (85%)'}
            </h1>
            <span className="portal-status-tag">
              <i className="fa-solid fa-circle-check"></i>
              <span>Candidature 2026-2027</span>
            </span>
          </div>

          <div className="portal-topbar-actions">
            <Link to="/" className="portal-site-link">
              <i className="fa-solid fa-house"></i>
              <span>Site Public</span>
            </Link>
          </div>
        </header>

        {/* Barre de navigation horizontale pour mobile (défilement fluide) */}
        <div className="portal-mobile-nav-bar">
          <div className="portal-mobile-nav-scroll">
            <button
              type="button"
              className={`portal-mobile-nav-pill ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <i className="fa-solid fa-house"></i>
              <span>Mon Espace</span>
            </button>
            <button
              type="button"
              className={`portal-mobile-nav-pill ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <i className="fa-solid fa-user"></i>
              <span>Mes Infos</span>
            </button>
            <button
              type="button"
              className={`portal-mobile-nav-pill ${activeTab === 'journey' ? 'active' : ''}`}
              onClick={() => setActiveTab('journey')}
            >
              <i className="fa-solid fa-route"></i>
              <span>Parcours</span>
            </button>
            <button
              type="button"
              className={`portal-mobile-nav-pill ${activeTab === 'payments' ? 'active' : ''}`}
              onClick={() => setActiveTab('payments')}
            >
              <i className="fa-solid fa-credit-card"></i>
              <span>Paiements</span>
            </button>
            <button
              type="button"
              className={`portal-mobile-nav-pill ${activeTab === 'courses' ? 'active' : ''}`}
              onClick={() => setActiveTab('courses')}
            >
              <i className="fa-solid fa-graduation-cap"></i>
              <span>Cours</span>
            </button>
            <button
              type="button"
              className={`portal-mobile-nav-pill ${activeTab === 'visa' ? 'active' : ''}`}
              onClick={() => setActiveTab('visa')}
            >
              <i className="fa-solid fa-passport"></i>
              <span>Visa</span>
            </button>
            <button
              type="button"
              className={`portal-mobile-nav-pill ${activeTab === 'requests' ? 'active' : ''}`}
              onClick={() => setActiveTab('requests')}
            >
              <i className="fa-solid fa-comments"></i>
              <span>Demandes</span>
            </button>
            <button
              type="button"
              className={`portal-mobile-nav-pill ${activeTab === 'refund' ? 'active' : ''}`}
              onClick={() => setActiveTab('refund')}
            >
              <i className="fa-solid fa-shield-halved"></i>
              <span>Garantie 85%</span>
            </button>
          </div>
        </div>

        <main className="portal-page-body">
          {/* ================================================================
              ONGLET 1 : MON ESPACE (VUE D'ENSEMBLE)
              ================================================================ */}
          {activeTab === 'overview' && (
            <>
              {/* Prochaine action obligatoire (Section 14.1) */}
              <div className="portal-action-banner">
                <div className="portal-action-content">
                  <i className="fa-solid fa-circle-exclamation portal-action-icon"></i>
                  <div>
                    <div className="portal-action-title">
                      Prochaine action requise : Règlement de la 1ère tranche (Niveau A1)
                    </div>
                    <div className="portal-action-desc">
                      Votre dossier d'inscription a été vérifié par l'école. Réglez votre première tranche mensuelle (ou le montant comptant) pour générer votre attestation d'inscription officielle sous 48h ouvrées.
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="portal-action-btn"
                  onClick={() => setActiveTab('payments')}
                >
                  <i className="fa-solid fa-credit-card"></i> Régler la 1ère tranche
                </button>
              </div>

              {/* 3 Cartes de statut directes */}
              <div className="portal-summary-strip">
                <div className="portal-summary-card">
                  <div className="portal-summary-icon blue">
                    <i className="fa-solid fa-book-open"></i>
                  </div>
                  <div className="portal-summary-content">
                    <div className="caption">Formation & Ville</div>
                    <div className="title">{formationTitle}</div>
                    <div className="sub">
                      Ville d'accueil : {cityName} ({cityState})
                    </div>
                  </div>
                </div>

                <div className="portal-summary-card">
                  <div className="portal-summary-icon green">
                    <i className="fa-solid fa-user-check"></i>
                  </div>
                  <div className="portal-summary-content">
                    <div className="caption">Statut de l'inscription</div>
                    <div className="title">Validé & Enregistré</div>
                    <div className="sub">Réf : {candidateNumber}</div>
                  </div>
                </div>

                <div className="portal-summary-card">
                  <div className="portal-summary-icon purple">
                    <i className="fa-solid fa-shield-halved"></i>
                  </div>
                  <div className="portal-summary-content">
                    <div className="caption">Garantie Contractuelle</div>
                    <div className="title">85% Remboursé</div>
                    <div className="sub">Protection écrite en cas de refus consulaire</div>
                  </div>
                </div>
              </div>

              {/* Frise des 6 étapes officielles (Section 7 du cahier des charges) */}
              <div className="portal-journey-card">
                <div className="portal-journey-header">
                  <h2>Les 6 Étapes Officielles de votre Parcours Étudiant</h2>
                  <span className="portal-status-tag">Étape 2 en cours</span>
                </div>
                <div className="portal-journey-grid">
                  <div className="portal-journey-step completed">
                    <span className="portal-step-pill completed">
                      <i className="fa-solid fa-check"></i>
                    </span>
                    <div className="portal-journey-step-title">1. Inscription</div>
                    <div className="portal-journey-step-desc">Dossier reçu & validé</div>
                  </div>

                  <div className="portal-journey-step active">
                    <span className="portal-step-pill active">2</span>
                    <div className="portal-journey-step-title">2. Paiement A1</div>
                    <div className="portal-journey-step-desc">1 tranche ou 3 fois</div>
                  </div>

                  <div className="portal-journey-step">
                    <span className="portal-step-pill pending">3</span>
                    <div className="portal-journey-step-title">3. Cours & Assiduité</div>
                    <div className="portal-journey-step-desc">Limite 4h d'absences</div>
                  </div>

                  <div className="portal-journey-step">
                    <span className="portal-step-pill pending">4</span>
                    <div className="portal-journey-step-title">4. Examens & Moyenne</div>
                    <div className="portal-journey-step-desc">Validation A1 (14/20)</div>
                  </div>

                  <div className="portal-journey-step">
                    <span className="portal-step-pill pending">5</span>
                    <div className="portal-journey-step-title">5. Choix Niveau A2</div>
                    <div className="portal-journey-step-desc">Brésil ou à distance</div>
                  </div>

                  <div className="portal-journey-step">
                    <span className="portal-step-pill pending">6</span>
                    <div className="portal-journey-step-title">6. Règlement & Visa</div>
                    <div className="portal-journey-step-desc">Consulat & Garantie 85%</div>
                  </div>
                </div>
              </div>

              {/* 2 Colonnes : Dossier académique + Documents */}
              <div className="portal-main-grid">
                <div className="portal-section-card">
                  <h3 className="portal-section-card-title">
                    <i className="fa-solid fa-address-card"></i>
                    <span>Informations du Dossier Académique</span>
                  </h3>
                  <table className="portal-clean-table">
                    <tbody>
                      <tr>
                        <td className="prop">Étudiant titulaire</td>
                        <td className="val">{fullName}</td>
                      </tr>
                      <tr>
                        <td className="prop">Identifiant étudiant</td>
                        <td className="val">{candidateNumber}</td>
                      </tr>
                      <tr>
                        <td className="prop">Adresse e-mail</td>
                        <td className="val">{user?.email || 'komlakimi@gmail.com'}</td>
                      </tr>
                      <tr>
                        <td className="prop">Téléphone enregistré</td>
                        <td className="val">{user?.profile?.phone || '+228 90 0998898'}</td>
                      </tr>
                      <tr>
                        <td className="prop">Niveau de formation</td>
                        <td className="val">{formationTitle}</td>
                      </tr>
                      <tr>
                        <td className="prop">Modalité d'études</td>
                        <td className="val">{studyModeLabel}</td>
                      </tr>
                      <tr>
                        <td className="prop">Ville d'accueil au Brésil</td>
                        <td className="val">
                          {cityName} ({cityState})
                        </td>
                      </tr>
                      <tr>
                        <td className="prop">Rythme des cours</td>
                        <td className="val">{rhythmLabel}</td>
                      </tr>
                      <tr>
                        <td className="prop">Diplôme national visé</td>
                        <td className="val">Certificat d'État CELPE-Bras (MEC)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="portal-section-card">
                  <h3 className="portal-section-card-title">
                    <i className="fa-solid fa-file-pdf"></i>
                    <span>Documents Officiels & Attestations</span>
                  </h3>
                  <div className="portal-docs-stack">
                    <div className="portal-doc-entry">
                      <div className="portal-doc-info-block">
                        <i className="fa-solid fa-file-lines portal-doc-icon-red"></i>
                        <div>
                          <div className="title">Attestation d'Inscription Provisoire</div>
                          <div className="status">Délivrée sous 48h ouvrées après 1er versement</div>
                        </div>
                      </div>
                      <span className="portal-badge-pending-tag">En attente de paiement</span>
                    </div>

                    <a href="#garantie" className="portal-doc-entry">
                      <div className="portal-doc-info-block">
                        <i
                          className="fa-solid fa-file-shield"
                          style={{ color: '#00a859', fontSize: '1.2rem' }}
                        ></i>
                        <div>
                          <div className="title">Contrat & Garantie 85% de Remboursement</div>
                          <div className="status">Clause légale de protection visa</div>
                        </div>
                      </div>
                      <span className="portal-btn-download-pill">
                        <i className="fa-solid fa-download"></i> Télécharger
                      </span>
                    </a>

                    <a href="#fiche" className="portal-doc-entry">
                      <div className="portal-doc-info-block">
                        <i className="fa-solid fa-file-pdf portal-doc-icon-red"></i>
                        <div>
                          <div className="title">Fiche de Candidature Officielle</div>
                          <div className="status">Réf {candidateNumber}</div>
                        </div>
                      </div>
                      <span className="portal-btn-download-pill">
                        <i className="fa-solid fa-download"></i> Télécharger
                      </span>
                    </a>

                    <a href="#guide" className="portal-doc-entry">
                      <div className="portal-doc-info-block">
                        <i
                          className="fa-solid fa-book"
                          style={{ color: '#1877f2', fontSize: '1.2rem' }}
                        ></i>
                        <div>
                          <div className="title">Guide d'Installation & Visa au Brésil</div>
                          <div className="status">Démarches VITEM IV, logement & CPF</div>
                        </div>
                      </div>
                      <span className="portal-btn-download-pill">
                        <i className="fa-solid fa-download"></i> Consulter
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ================================================================
              ONGLET 2 : MES INFORMATIONS (SECTION 14.1 DU CAHIER)
              ================================================================ */}
          {activeTab === 'profile' && (
            <div className="portal-section-card">
              <h3 className="portal-section-card-title">
                <i className="fa-solid fa-id-card-clip"></i>
                <span>Mes Informations Personnelles et Projet d'Avenir</span>
              </h3>

              <div className="portal-info-box" style={{ marginBottom: '1.25rem' }}>
                <i className="fa-solid fa-circle-info"></i> <strong>Règle de l'école :</strong> Les informations d'état civil et de candidature sont verrouillées en lecture seule après enregistrement pour garantir la conformité avec votre passeport et vos futures démarches de visa. Pour solliciter une modification, veuillez ouvrir une requête dans l'onglet <strong>Mes Demandes</strong>.
              </div>

              <table className="portal-clean-table">
                <tbody>
                  <tr>
                    <td className="prop">Prénom</td>
                    <td className="val">{firstName}</td>
                  </tr>
                  <tr>
                    <td className="prop">Nom de famille</td>
                    <td className="val">{lastName}</td>
                  </tr>
                  <tr>
                    <td className="prop">Adresse e-mail de connexion</td>
                    <td className="val">{user?.email || 'komlakimi@gmail.com'}</td>
                  </tr>
                  <tr>
                    <td className="prop">Téléphone / WhatsApp</td>
                    <td className="val">{user?.profile?.phone || '+228 90 0998898'}</td>
                  </tr>
                  <tr>
                    <td className="prop">Pays d'origine (Code ISO)</td>
                    <td className="val">{user?.profile?.country_code || 'TG (Togo)'}</td>
                  </tr>
                  <tr>
                    <td className="prop">Projet d'avenir déclaré</td>
                    <td className="val">Études supérieures et mobilité universitaire au Brésil</td>
                  </tr>
                  <tr>
                    <td className="prop">Lieu d'apprentissage souhaité</td>
                    <td className="val">{studyModeLabel}</td>
                  </tr>
                  <tr>
                    <td className="prop">Première option de ville au Brésil</td>
                    <td className="val">{cityName} ({cityState})</td>
                  </tr>
                  <tr>
                    <td className="prop">Préférence d'horaires</td>
                    <td className="val">{rhythmLabel}</td>
                  </tr>
                  <tr>
                    <td className="prop">Date d'enregistrement</td>
                    <td className="val">{latestEnrollment?.enrolled_at || '05/11/2026'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* ================================================================
              ONGLET 3 : MON PARCOURS (DÉTAIL DES 6 ÉTAPES)
              ================================================================ */}
          {activeTab === 'journey' && (
            <div className="portal-section-card">
              <h3 className="portal-section-card-title">
                <i className="fa-solid fa-route"></i>
                <span>Parcours Pédagogique & Administratif en 6 Étapes</span>
              </h3>
              <p style={{ fontSize: '0.86rem', color: '#64748b', marginBottom: '1.25rem' }}>
                Ce parcours reprend intégralement les règles de l'école. Chaque étape valide le passage vers la suivante.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="portal-journey-step completed" style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                    <span className="portal-step-pill completed"><i className="fa-solid fa-check"></i></span>
                    <strong style={{ fontSize: '0.92rem' }}>Étape 1 : Inscription Initiale</strong>
                    <span className="portal-status-tag" style={{ marginLeft: 'auto' }}>Validée</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#475569', margin: 0 }}>
                    Création du compte, projet d'avenir renseigné, choix du lieu d'étude ({studyModeLabel}) et de la ville d'accueil ({cityName}).
                  </p>
                </div>

                <div className="portal-journey-step active" style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                    <span className="portal-step-pill active">2</span>
                    <strong style={{ fontSize: '0.92rem' }}>Étape 2 : Premier Paiement (Niveau A1)</strong>
                    <span className="portal-badge-pending-tag" style={{ marginLeft: 'auto' }}>En cours de règlement</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#475569', margin: 0 }}>
                    Paiement par carte Visa ou par virement bancaire. Choix entre paiement comptant ou en 3 tranches mensuelles. Dès réception, l'attestation officielle sous 48h est générée.
                  </p>
                </div>

                <div className="portal-journey-step" style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                    <span className="portal-step-pill pending">3</span>
                    <strong style={{ fontSize: '0.92rem' }}>Étape 3 : Début des Cours & Contrôle d'Assiduité</strong>
                    <span style={{ fontSize: '0.74rem', color: '#94a3b8', marginLeft: 'auto' }}>Après paiement</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
                    Intégration de la liste des professeurs. Règle stricte des absences : limite de 4 heures d'absence autorisées. En cas de dépassement, l'étudiant est déclaré en état d'échec.
                  </p>
                </div>

                <div className="portal-journey-step" style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                    <span className="portal-step-pill pending">4</span>
                    <strong style={{ fontSize: '0.92rem' }}>Étape 4 : Examens en Classe & Validation du A1</strong>
                    <span style={{ fontSize: '0.74rem', color: '#94a3b8', marginLeft: 'auto' }}>Étape suivante</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
                    Examens réguliers. Moyenne minimale de réussite fixée par l'administration (14/20 requise) pour valider le niveau et passer au niveau supérieur.
                  </p>
                </div>

                <div className="portal-journey-step" style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                    <span className="portal-step-pill pending">5</span>
                    <strong style={{ fontSize: '0.92rem' }}>Étape 5 : Réinscription et Choix du Niveau A2</strong>
                    <span style={{ fontSize: '0.74rem', color: '#94a3b8', marginLeft: 'auto' }}>À venir</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
                    Suite normale du cursus en présentiel au Brésil, ou en ligne à distance si l'étudiant n'a pas les moyens de voyager. Confirmation ou modification de la ville.
                  </p>
                </div>

                <div className="portal-journey-step" style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                    <span className="portal-step-pill pending">6</span>
                    <strong style={{ fontSize: '0.92rem' }}>Étape 6 : Règlement Final & Procédure de Visa (Étape N)</strong>
                    <span style={{ fontSize: '0.74rem', color: '#94a3b8', marginLeft: 'auto' }}>Étape finale</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
                    Délivrance de l'ensemble des pièces consulaires pour le Visa VITEM IV. Garantie contractuelle de remboursement de 85% de la somme versée en cas de refus consulaire.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================
              ONGLET 4 : MES PAIEMENTS (PLAN EN 3 TRANCHES & VIREMENTS)
              ================================================================ */}
          {activeTab === 'payments' && (
            <div className="portal-section-card">
              <h3 className="portal-section-card-title">
                <i className="fa-solid fa-credit-card"></i>
                <span>Plan de Règlement & Suivi des Échéances (Stripe & Virement)</span>
              </h3>

              {stripeSuccessMsg && (
                <div className="portal-info-box" style={{ background: '#ecfdf5', borderColor: '#bbf7d0', color: '#166534', marginBottom: '1.25rem', fontWeight: 700 }}>
                  <i className="fa-solid fa-circle-check"></i> {stripeSuccessMsg}
                </div>
              )}

              <div className="portal-warning-box" style={{ marginBottom: '1.25rem' }}>
                <i className="fa-solid fa-triangle-exclamation"></i>
                <div>
                  <strong>Règle d'exclusion automatique :</strong> Conformément au règlement de l'école, si la mensualité du mois suivant n'est pas réglée à la date d'échéance, le nom de l'étudiant est immédiatement retiré de la liste transmise aux enseignants jusqu'à régularisation.
                </div>
              </div>

              <div className="portal-installments-grid">
                <div className="portal-installment-card active-due">
                  <div className="portal-inst-header">
                    <span className="portal-inst-title">Tranche 1 (Mois 1)</span>
                    <span className="portal-badge-pending-tag">À régler</span>
                  </div>
                  <div className="portal-inst-amount">170,00 €</div>
                  <div className="portal-inst-due">Échéance : Immédiate (Validation)</div>
                  <div style={{ fontSize: '0.75rem', color: '#475569' }}>
                    Déclenche l'édition sous 48h de votre attestation officielle d'inscription.
                  </div>
                  <button
                    type="button"
                    className="portal-action-btn"
                    style={{ marginTop: '0.5rem', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                    disabled={isProcessingStripe}
                    onClick={() => handleStripePayment(170, 'Tranche 1 (Mois 1) — Scolarité Niveau A1')}
                  >
                    <i className="fa-brands fa-stripe" style={{ fontSize: '1.4rem' }}></i>
                    <span>{isProcessingStripe ? 'Connexion à Stripe...' : 'Payer 170,00 € par Carte (Stripe)'}</span>
                  </button>
                </div>

                <div className="portal-installment-card">
                  <div className="portal-inst-header">
                    <span className="portal-inst-title">Tranche 2 (Mois 2)</span>
                    <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>À venir</span>
                  </div>
                  <div className="portal-inst-amount">165,00 €</div>
                  <div className="portal-inst-due">Échéance : +30 jours après rentrée</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Maintien de l'inscription sur la liste des cours des enseignants.
                  </div>
                </div>

                <div className="portal-installment-card">
                  <div className="portal-inst-header">
                    <span className="portal-inst-title">Tranche 3 (Mois 3)</span>
                    <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>À venir</span>
                  </div>
                  <div className="portal-inst-amount">165,00 €</div>
                  <div className="portal-inst-due">Échéance : +60 jours après rentrée</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Solde final de la formation Niveau A1.
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid #f1f5f9' }}>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 750, color: '#0f172a', marginBottom: '0.75rem' }}>
                  Option de Règlement par Virement Bancaire
                </h4>
                <div className="portal-info-box">
                  Si vous effectuez un virement bancaire sur le compte officiel de l'école (IBAN transmis par e-mail), veuillez renseigner votre référence de virement bancaire pour confirmation manuelle par l'administrateur.
                </div>
              </div>
            </div>
          )}

          {/* ================================================================
              ONGLET 5 : MES COURS & ASSIDUITÉ (RÈGLE DES 4H & EXAMENS)
              ================================================================ */}
          {activeTab === 'courses' && (
            <div className="portal-section-card">
              <h3 className="portal-section-card-title">
                <i className="fa-solid fa-graduation-cap"></i>
                <span>Suivi Pédagogique, Assiduité & Examens</span>
              </h3>

              <div className="portal-summary-strip" style={{ marginBottom: '1.5rem' }}>
                <div className="portal-summary-card">
                  <div className="portal-summary-icon blue">
                    <i className="fa-solid fa-clock"></i>
                  </div>
                  <div className="portal-summary-content">
                    <div className="caption">Compteur d'Assiduité</div>
                    <div className="title">0h d'absence</div>
                    <div className="sub">Limite autorisée par l'admin : 4h max</div>
                  </div>
                </div>

                <div className="portal-summary-card">
                  <div className="portal-summary-icon green">
                    <i className="fa-solid fa-award"></i>
                  </div>
                  <div className="portal-summary-content">
                    <div className="caption">Moyenne Générale</div>
                    <div className="title">— / 20</div>
                    <div className="sub">Seuil de réussite fixé à 14/20</div>
                  </div>
                </div>

                <div className="portal-summary-card">
                  <div className="portal-summary-icon purple">
                    <i className="fa-solid fa-school"></i>
                  </div>
                  <div className="portal-summary-content">
                    <div className="caption">Campus / Ville</div>
                    <div className="title">{cityName} ({cityState})</div>
                    <div className="sub">{rhythmLabel}</div>
                  </div>
                </div>
              </div>

              <div className="portal-warning-box">
                <i className="fa-solid fa-triangle-exclamation"></i>
                <div>
                  <strong>Règle d'état d'échec pour absence :</strong> L'étudiant est informé dès le départ que le dépassement de la limite d'absence (4 heures) entraîne automatiquement le passage en <strong>état d'échec</strong>, conformément au règlement pédagogique défini par l'administrateur.
                </div>
              </div>
            </div>
          )}

          {/* ================================================================
              ONGLET 6 : VISA & DOCUMENTS OFFICIELS
              ================================================================ */}
          {activeTab === 'visa' && (
            <div className="portal-section-card">
              <h3 className="portal-section-card-title">
                <i className="fa-solid fa-passport"></i>
                <span>Dossier Consulaire Visa VITEM IV & Pièces Délivrées</span>
              </h3>

              <div className="portal-info-box" style={{ marginBottom: '1.25rem' }}>
                Pour votre demande de Visa d'études (VITEM IV) auprès de la section consulaire de l'Ambassade du Brésil, l'école Brasil·É délivre l'ensemble des attestations officielles requises dès confirmation du premier règlement.
              </div>

              <div className="portal-docs-stack">
                <div className="portal-doc-entry">
                  <div className="portal-doc-info-block">
                    <i className="fa-solid fa-file-pdf portal-doc-icon-red"></i>
                    <div>
                      <div className="title">Attestation d'Inscription Officielle (MEC / Brasil·É)</div>
                      <div className="status">Délivrée sous 48h ouvrées</div>
                    </div>
                  </div>
                  <span className="portal-badge-pending-tag">Génération après 1er versement</span>
                </div>

                <a href="#garantie-pdf" className="portal-doc-entry">
                  <div className="portal-doc-info-block">
                    <i className="fa-solid fa-file-shield" style={{ color: '#00a859', fontSize: '1.2rem' }}></i>
                    <div>
                      <div className="title">Engagement Écrit de Remboursement 85%</div>
                      <div className="status">Clause légale de protection en cas de refus</div>
                    </div>
                  </div>
                  <span className="portal-btn-download-pill">
                    <i className="fa-solid fa-download"></i> Télécharger
                  </span>
                </a>

                <a href="#guide-consulaire" className="portal-doc-entry">
                  <div className="portal-doc-info-block">
                    <i className="fa-solid fa-book" style={{ color: '#1877f2', fontSize: '1.2rem' }}></i>
                    <div>
                      <div className="title">Guide Officiel des Démarches Consulaires VITEM IV</div>
                      <div className="status">Casier judiciaire, légalisation & prise en charge</div>
                    </div>
                  </div>
                  <span className="portal-btn-download-pill">
                    <i className="fa-solid fa-download"></i> Consulter
                  </span>
                </a>
              </div>
            </div>
          )}

          {/* ================================================================
              ONGLET 7 : MES DEMANDES (SECTION 9 DU CAHIER)
              ================================================================ */}
          {activeTab === 'requests' && (
            <div className="portal-section-card">
              <h3 className="portal-section-card-title">
                <i className="fa-solid fa-comments"></i>
                <span>Mes Demandes à l'Administration</span>
              </h3>

              <div className="portal-info-box" style={{ marginBottom: '1.25rem' }}>
                Conformément à la section 9 du cahier des charges, toutes vos demandes spécifiques (demande d'admission dérogatoire au niveau A1 au Brésil, changement de ville d'accueil en cours d'année, réclamation administrative) se font directement ici via un fil d'échange officiel avec l'école.
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div className="portal-doc-entry">
                  <div className="portal-doc-info-block">
                    <i className="fa-solid fa-envelope-open-text" style={{ color: '#1877f2', fontSize: '1.15rem' }}></i>
                    <div>
                      <div className="title">Demande N° DEM-2026-0045 : Validation initiale de dossier</div>
                      <div className="status">Créée le 05/11/2026 • Réponse du secrétariat : Dossier conforme</div>
                    </div>
                  </div>
                  <span className="portal-status-tag">Traité & Conforme</span>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================
              ONGLET 8 : GARANTIE & REMBOURSEMENT (85%)
              ================================================================ */}
          {activeTab === 'refund' && (
            <div className="portal-section-card">
              <h3 className="portal-section-card-title">
                <i className="fa-solid fa-shield-halved"></i>
                <span>Garantie Contractuelle de Remboursement (85%)</span>
              </h3>

              <div className="portal-info-box" style={{ marginBottom: '1.25rem' }}>
                <strong>Principe fondateur de l'école (Section 12.2 du cahier des charges) :</strong> En cas de refus de visa par les autorités consulaires brésiliennes (motif justifié par le document officiel du Consulat), l'école Brasil·É rembourse <strong>85% de la somme totale versée</strong>. La garantie protège chaque candidat engagé.
              </div>

              <table className="portal-clean-table">
                <tbody>
                  <tr>
                    <td className="prop">Taux contractuel de remboursement</td>
                    <td className="val" style={{ color: '#00a859' }}>85 % de la somme versée</td>
                  </tr>
                  <tr>
                    <td className="prop">Motif éligible</td>
                    <td className="val">Refus officiel de visa délivré par le Consulat du Brésil</td>
                  </tr>
                  <tr>
                    <td className="prop">Pièce justificative requise</td>
                    <td className="val">Notification officielle de refus du visa VITEM IV</td>
                  </tr>
                  <tr>
                    <td className="prop">Délai de traitement</td>
                    <td className="val">Sous 15 jours ouvrés après examen par l'administration</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default StudentPortalPage;
