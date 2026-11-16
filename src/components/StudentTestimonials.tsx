import React from 'react';

export const StudentTestimonials: React.FC = () => {
  const testimonials = [
    {
      name: 'Aminata K.',
      country: 'Sénégal (Dakar)',
      program: 'Niveau A1 & A2 en Immersion',
      currentStatus: 'Admise en Master à l’Université de Brasília (UnB)',
      quote:
        'Arrivée à Brasília sans parler un mot de portugais, j’ai atteint le niveau intermédiaire en 5 mois grâce aux cours intensifs quotidiens. L’équipe m’a accompagnée pour trouver mon logement et obtenir mon CPF brésilien. Aujourd’hui je débute mon Master en relations internationales.',
      rating: 5,
    },
    {
      name: 'Jean-Marc T.',
      country: 'Côte d’Ivoire (Abidjan)',
      program: 'Formation A1 en Ligne puis A2 sur place',
      currentStatus: 'Étudiant en Génie Civil à l’USP (São Paulo)',
      quote:
        'J’ai débuté les cours du soir en ligne depuis Abidjan tout en terminant ma licence. Les professeurs brésiliens sont exceptionnels de patience. Quand je suis arrivé à São Paulo, j’étais déjà capable d’échanger en portugais. Mon attestation sous 48h a été acceptée dès le premier dépôt au consulat.',
      rating: 5,
    },
    {
      name: 'Emmanuel M.',
      country: 'Cameroun (Douala)',
      program: 'Préparation Diplôme CELPE-Bras',
      currentStatus: 'Diplôme CELPE-Bras obtenu avec mention',
      quote:
        'Ce qui a totalement rassuré mes parents, c’est la garantie contractuelle écrite de remboursement à 85%. Aucune autre école ne propose une telle sécurité financière. J’ai obtenu mon visa étudiant sans le moindre obstacle et j’ai réussi l’examen du CELPE-Bras du premier coup.',
      rating: 5,
    },
  ];

  return (
    <section className="testimonials-section reveal-section">
      <div className="testimonials-inner">
        <div className="testimonials-header-center">
          <h3 className="testimonials-title reveal-left">
            Ils ont franchi le pas vers le Brésil
          </h3>
          <p className="testimonials-subtitle reveal-right">
            Découvrez les retours d'expérience d'étudiants d'Afrique francophone qui ont concrétisé leur projet linguistique et universitaire avec <strong>Brasil·É</strong>.
          </p>
        </div>

        <div className="testimonials-grid reveal-grid">
          {testimonials.map((item, idx) => (
            <div key={idx} className="testimonial-card-clean">
              {/* Étoiles de satisfaction */}
              <div className="testimonial-stars-row">
                {[...Array(item.rating)].map((_, sIdx) => (
                  <i key={sIdx} className="fa-solid fa-star text-amber-400"></i>
                ))}
              </div>

              {/* Citation de l'étudiant */}
              <blockquote className="testimonial-quote">
                « {item.quote} »
              </blockquote>

              {/* Profil & Destination */}
              <div className="testimonial-author-block">
                <div className="author-avatar-initials">
                  {item.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
                <div className="author-meta">
                  <div className="author-name-bold">{item.name}</div>
                  <div className="author-origin">
                    <i className="fa-solid fa-earth-africa"></i> {item.country}
                  </div>
                  <div className="author-badge-status">
                    <i className="fa-solid fa-check text-emerald-500"></i> {item.currentStatus}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
