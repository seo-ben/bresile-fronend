import React from 'react';
import { Users, Sun, Building } from 'lucide-react';

export const CitiesSection: React.FC = () => {
  const cities = [
    {
      name: 'Brasília',
      state: 'Distrito Federal (DF)',
      role: 'Siège Académique & Capitale Fédérale',
      description: 'Ville moderne et cosmopolite, siège de toutes les ambassades et ministères. Idéale pour étudier dans un cadre sécurisé, aéré et propice à la réussite académique.',
      image: 'https://images.unsplash.com/photo-1543051932-6ef9fecfbc80?w=600&h=400&fit=crop',
      stats: { students: '450+ étudiants', vibe: 'Calme & Studieux', weather: 'Ensoleillé toute l’année' },
      isMain: true,
    },
    {
      name: 'São Paulo',
      state: 'São Paulo (SP)',
      role: 'Centre Économique & Universitaire',
      description: 'Le cœur battant de l’Amérique latine. Une vie culturelle sans égale, des universités de renommée mondiale (USP, UNICAMP) et d’immenses opportunités professionnelles.',
      image: 'https://images.unsplash.com/photo-1578637387939-43c525550085?w=600&h=400&fit=crop',
      stats: { students: '380+ étudiants', vibe: 'Dynamique & Business', weather: 'Climat tempéré' },
      isMain: false,
    },
    {
      name: 'Rio de Janeiro',
      state: 'Rio de Janeiro (RJ)',
      role: 'Capitale Culturelle & Touristique',
      description: 'Étudiez entre mer et montagnes dans la Cidade Maravilhosa. Une immersion linguistique chaleureuse au contact des Cariocas et des grandes facultés fédérales.',
      image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=600&h=400&fit=crop',
      stats: { students: '290+ étudiants', vibe: 'Chaleureux & Festif', weather: 'Tropical & Plage' },
      isMain: false,
    },
    {
      name: 'Salvador de Bahia',
      state: 'Bahia (BA)',
      role: 'Berceau Historique & Afro-Brésilien',
      description: 'Plongez dans les racines historiques et musicales du Brésil. Une ambiance accueillante, un coût de la vie très avantageux et un accueil légendaire.',
      image: 'https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?w=600&h=400&fit=crop',
      stats: { students: '180+ étudiants', vibe: 'Culturel & Historique', weather: 'Chaud & Océanique' },
      isMain: false,
    },
  ];

  return (
    <section id="villes" className="cities-section">
      <div className="section-title-center">
        <span className="section-pill-badge">VIVRE &amp; ÉTUDIER AU BRÉSIL</span>
        <h2 className="section-h2">Choisissez votre ville de destination</h2>
        <p className="section-p">
          Nos centres partenaires et équipes d’accueil sont implantés dans les principales métropoles brésiliennes pour vous accompagner dès votre descente d’avion.
        </p>
      </div>

      <div className="cities-grid">
        {cities.map((city, idx) => (
          <div key={idx} className="city-card">
            <div className="city-image-wrap">
              <img src={city.image} alt={city.name} className="city-img" />
              {city.isMain && <span className="city-ribbon">Campus Principal</span>}
              <div className="city-overlay">
                <span className="city-name">{city.name}</span>
                <span className="city-state">{city.state}</span>
              </div>
            </div>

            <div className="city-body">
              <span className="city-role-badge">{city.role}</span>
              <p className="city-desc">{city.description}</p>

              <div className="city-stats-row">
                <div className="city-stat">
                  <Users size={14} />
                  <span>{city.stats.students}</span>
                </div>
                <div className="city-stat">
                  <Building size={14} />
                  <span>{city.stats.vibe}</span>
                </div>
                <div className="city-stat">
                  <Sun size={14} />
                  <span>{city.stats.weather}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
