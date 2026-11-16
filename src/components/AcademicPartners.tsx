import React, { useEffect, useState } from 'react';
import { API_ENDPOINTS } from '../config/api';

interface UniversityItem {
  id?: number;
  sigle: string;
  name: string;
  fullName: string;
  city: string;
  state: string;
  highlight: string;
  badgeGradient: string;
}

const fallbackUniversities: UniversityItem[] = [
  {
    sigle: 'UnB',
    name: 'Universidade de Brasília',
    fullName: 'Université Fédérale de Brasília',
    city: 'Brasília',
    state: 'Distrito Federal',
    highlight: 'Campus Oscar Niemeyer • Admission sur dossier CELPE-Bras',
    badgeGradient: 'linear-gradient(135deg, #091e42 0%, #1877f2 100%)',
  },
  {
    sigle: 'USP',
    name: 'Universidade de São Paulo',
    fullName: 'Université d’État de São Paulo',
    city: 'São Paulo',
    state: 'São Paulo (SP)',
    highlight: 'Leader mondial de recherche et d’innovation académique',
    badgeGradient: 'linear-gradient(135deg, #064e3b 0%, #00a859 100%)',
  },
  {
    sigle: 'UNICAMP',
    name: 'Univ. Estadual de Campinas',
    fullName: 'Université d’État de Campinas',
    city: 'Campinas',
    state: 'São Paulo (SP)',
    highlight: '15% de l’ensemble des brevets tech et recherche du Brésil',
    badgeGradient: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%)',
  },
  {
    sigle: 'UFRJ',
    name: 'Univ. Federal do Rio de Janeiro',
    fullName: 'Université Fédérale de Rio de Janeiro',
    city: 'Rio de Janeiro',
    state: 'Rio de Janeiro (RJ)',
    highlight: 'Plus ancienne et illustre institution fédérale du Brésil',
    badgeGradient: 'linear-gradient(135deg, #0f172a 0%, #0284c7 100%)',
  },
  {
    sigle: 'UFMG',
    name: 'Univ. Federal de Minas Gerais',
    fullName: 'Université Fédérale de Minas Gerais',
    city: 'Belo Horizonte',
    state: 'Minas Gerais (MG)',
    highlight: 'Campus d’excellence de 8,7 millions de m² à Pampulha',
    badgeGradient: 'linear-gradient(135deg, #78350f 0%, #d97706 100%)',
  },
  {
    sigle: 'UFRGS',
    name: 'Univ. Federal do Rio Grande do Sul',
    fullName: 'Université Fédérale du Rio Grande do Sul',
    city: 'Porto Alegre',
    state: 'Rio Grande do Sul (RS)',
    highlight: 'Centre universitaire de pointe du Sud brésilien',
    badgeGradient: 'linear-gradient(135deg, #1e1b4b 0%, #4338ca 100%)',
  },
];

interface AcademicPartnersProps {
  onSelectUniversity?: (sigle: string) => void;
}

export const AcademicPartners: React.FC<AcademicPartnersProps> = ({ onSelectUniversity }) => {
  const [universities, setUniversities] = useState<UniversityItem[]>(fallbackUniversities);

  useEffect(() => {
    let isMounted = true;
    fetch(API_ENDPOINTS.academicUniversities)
      .then((res) => (res.ok ? res.json() : null))
      .then((payload) => {
        if (!isMounted || !payload?.data || !Array.isArray(payload.data) || payload.data.length === 0) {
          return;
        }
        const mapped: UniversityItem[] = payload.data.map((item: any) => ({
          id: item.id,
          sigle: item.sigle,
          name: item.name,
          fullName: item.full_name,
          city: item.city,
          state: item.state || '',
          highlight: item.highlight || '',
          badgeGradient: item.badge_gradient || 'linear-gradient(135deg, #091e42 0%, #1877f2 100%)',
        }));
        setUniversities(mapped);
      })
      .catch(() => {
        // En cas d'erreur de connexion, les données de secours restent affichées
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section id="partenaires" className="academic-prestigious-section reveal-section">
      <div className="academic-prestigious-inner">
        {/* Titre et sous-titre */}
        <div className="academic-prestigious-header">
          <h2 className="academic-header-title reveal-left">
            L'excellence académique brésilienne à votre portée
          </h2>
          <p className="academic-header-lead reveal-right">
            Brasil·É prépare rigoureusement ses étudiants à réussir l’examen officiel du <strong>CELPE-Bras</strong>, le certificat d’État officiel qui ouvre les portes des facultés fédérales et d’État du Brésil sans passer par le concours local brésilien.
          </p>
        </div>

        {/* Grille de cartes directes avec alternance gauche/droite automatique */}
        <div className="prestigious-unis-grid reveal-grid">
          {universities.map((uni, idx) => (
            <div key={uni.id ?? idx} className="prestigious-uni-card">
              {/* Ligne haute : Monogramme + Localisation */}
              <div className="uni-card-top-row">
                <div
                  className="uni-monogram-box"
                  style={{ background: uni.badgeGradient }}
                >
                  <span>{uni.sigle}</span>
                </div>

                <span className="uni-location-pill">
                  <i className="fa-solid fa-location-dot"></i>
                  <span>{uni.city}</span>
                </span>
              </div>

              {/* Titre officiel de l'université */}
              <div className="uni-card-body">
                <h3 className="uni-card-name">{uni.name}</h3>
                <div className="uni-card-fullname">{uni.fullName}</div>
              </div>

              {/* Ligne basse : Atout clé & Passerelle vers la page d'inscription dédiée */}
              <div className="uni-card-bottom-bar">
                <div className="uni-highlight-line">
                  <i className="fa-solid fa-circle-check text-emerald-500"></i>
                  <span>{uni.highlight}</span>
                </div>
                <button
                  type="button"
                  className="uni-arrow-action-btn"
                  onClick={() =>
                    onSelectUniversity
                      ? onSelectUniversity(uni.sigle)
                      : (window.location.href = `/inscription?universite=${encodeURIComponent(uni.sigle)}`)
                  }
                >
                  <span>Admissibilité CELPE-Bras</span>
                  <i className="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
