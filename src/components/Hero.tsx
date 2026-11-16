import React, { useState } from 'react';

interface HeroProps {
  onSearch: (query: string) => void;
  onTagClick: (tag: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onSearch, onTagClick }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const categories = [
    { label: 'Niveau A1 (En Ligne)', shortLabel: 'A1 En Ligne', icon: <i className="fa-solid fa-globe"></i>, q: 'A1-ligne' },
    { label: 'Niveau A1 (Au Brésil)', shortLabel: 'A1 au Brésil', icon: <i className="fa-solid fa-plane-departure"></i>, q: 'A1-bresil' },
    { label: 'Niveau A2 (Au Brésil)', shortLabel: 'A2 au Brésil', icon: <i className="fa-solid fa-graduation-cap"></i>, q: 'A2-bresil' },
    { label: 'Diplôme CELPE-Bras', shortLabel: 'CELPE-Bras', icon: <i className="fa-solid fa-award"></i>, q: 'celpe-bras' },
    { label: 'Campus Brasília', shortLabel: 'Brasília (DF)', icon: <i className="fa-solid fa-building-columns"></i>, q: 'brasilia' },
  ];

  return (
    <section className="hero-wrapper reveal-section">
      {/* L'ellipse concentrique exacte de Codeur.com pointée par l'utilisateur */}
      <img
        src="/home-elipse.svg"
        alt=""
        className="hero-ellipse-codeur"
        aria-hidden="true"
      />

      <div className="hero-inner">
        {/* Titre Hero Épuré */}
        <h1 className="hero-title reveal-left">
          La référence pour apprendre le portugais et la culture{' '}
          <span className="underline-wrapper">
            brésilienne
            <svg
              className="drawn-stroke"
              viewBox="0 0 240 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M4 14C60 6 180 8 236 12C170 16 70 18 10 20"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </h1>

        {/* Grande Capsule Blanche de Recherche */}
        <form className="search-capsule-white reveal-right" onSubmit={handleSubmit}>
          <div className="search-input-wrap">
            <i className="fa-solid fa-magnifying-glass search-icon-left" aria-hidden="true"></i>
            <input
              type="text"
              className="search-input-field"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Quel est votre projet ? (Niveau, visa...)"
            />
          </div>
          <button type="submit" className="btn-search-orange">
            <span className="btn-search-text-full">Choisir ma formation</span>
            <span className="btn-search-text-short">Choisir</span>
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        </form>

        {/* Pills Catégories (Défilement fluide horizontal sur mobile) */}
        <div className="category-pills-row reveal-left reveal-delay-2">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              type="button"
              className="cat-pill"
              onClick={() => onTagClick(cat.q)}
            >
              <span>{cat.icon}</span>
              <span className="cat-pill-full">{cat.label}</span>
              <span className="cat-pill-short">{cat.shortLabel}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Indicateur de défilement vers la session des formations */}
      <a href="#formations" className="hero-scroll-indicator" aria-label="Découvrir les formations">
        <span>Découvrir nos cursus</span>
        <i className="fa-solid fa-chevron-down hero-scroll-icon"></i>
      </a>
    </section>
  );
};
