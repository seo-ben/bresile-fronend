import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

interface HeroProps {
  onSearch: (query: string) => void;
  onTagClick: (tag: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onSearch, onTagClick }) => {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const categoryIcons = [
    <i className="fa-solid fa-globe"></i>,
    <i className="fa-solid fa-plane-departure"></i>,
    <i className="fa-solid fa-graduation-cap"></i>,
    <i className="fa-solid fa-award"></i>,
    <i className="fa-solid fa-building-columns"></i>,
  ];

  return (
    <section className="hero-wrapper reveal-section">
      {/* L'ellipse concentrique exacte de Codeur.com */}
      <img
        src="/home-elipse.svg"
        alt=""
        className="hero-ellipse-codeur"
        aria-hidden="true"
      />

      <div className="hero-inner">
        {/* Titre Hero Épuré */}
        <h1 className="hero-title reveal-left">
          {t.hero.titleBefore}
          <span className="underline-wrapper">
            {t.hero.titleHighlight}
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
              placeholder={t.hero.searchPlaceholder}
            />
          </div>
          <button type="submit" className="btn-search-orange">
            <span className="btn-search-text-full">{t.hero.searchBtnFull}</span>
            <span className="btn-search-text-short">{t.hero.searchBtnShort}</span>
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        </form>

        {/* Pills Catégories */}
        <div className="category-pills-row reveal-left reveal-delay-2">
          {t.hero.categories.map((cat, idx) => (
            <button
              key={idx}
              type="button"
              className="cat-pill"
              onClick={() => onTagClick(cat.q)}
            >
              <span>{categoryIcons[idx]}</span>
              <span className="cat-pill-full">{cat.label}</span>
              <span className="cat-pill-short">{cat.shortLabel}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Indicateur de défilement vers la session des formations */}
      <a href="#formations" className="hero-scroll-indicator" aria-label={t.hero.scrollIndicator}>
        <span>{t.hero.scrollIndicator}</span>
        <i className="fa-solid fa-chevron-down hero-scroll-icon"></i>
      </a>
    </section>
  );
};
