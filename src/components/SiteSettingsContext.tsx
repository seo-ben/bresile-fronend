import React, { createContext, useContext, useEffect, useState } from 'react';
import { API_ENDPOINTS } from '../config/api';
import { useLanguage } from '../i18n/LanguageContext';

export interface SiteSettings {
  site_name: string;
  tagline: string;
  tagline_fr: string;
  tagline_en: string;
  tagline_pt: string;
  logo_url: string;
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  website_url: string;
  cert_director_name?: string;
  cert_director_title?: string;
  cert_weekly_hours?: string;
  cert_legal_footer?: string;
}

const DEFAULT_SETTINGS: SiteSettings = {
  site_name: 'Brasil·É',
  tagline: 'ÉCOLE DE PORTUGAIS & MOBILITÉ AU BRÉSIL',
  tagline_fr: 'ÉCOLE DE PORTUGAIS & MOBILITÉ AU BRÉSIL',
  tagline_en: 'PORTUGUESE SCHOOL & STUDENT MOBILITY IN BRAZIL',
  tagline_pt: 'ESCOLA DE PORTUGUÊS & MOBILIDADE NO BRASIL',
  logo_url: '/logo.png',
  contact_email: 'contact@brasil-e.com',
  contact_phone: '+55 61 99999-0000',
  contact_address: 'Brasília, Distrito Federal — Brésil',
  website_url: 'www.brasil-e.com',
};

const SiteSettingsContext = createContext<SiteSettings>(DEFAULT_SETTINGS);

export const SiteSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { lang } = useLanguage();
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    const fetchSettings = () => {
      fetch(`${API_ENDPOINTS.siteSettings}?lang=${lang}&_t=${Date.now()}`, {
        headers: { Accept: 'application/json' },
        cache: 'no-store',
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((payload) => {
          if (payload?.data) {
            setSettings({
              ...DEFAULT_SETTINGS,
              ...payload.data,
            });
          }
        })
        .catch(() => {});
    };

    fetchSettings();
    window.addEventListener('focus', fetchSettings);
    return () => window.removeEventListener('focus', fetchSettings);
  }, [lang]);

  // Synchroniser le titre et le favicon de l'onglet du navigateur avec le nom et le logo configurés par l'admin
  useEffect(() => {
    if (settings.site_name) {
      document.title = `${settings.site_name} — ${settings.tagline || DEFAULT_SETTINGS.tagline}`;
    }
    if (settings.logo_url) {
      const favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
      if (favicon) {
        favicon.href = settings.logo_url;
      }
    }
  }, [settings.site_name, settings.tagline, settings.logo_url]);

  return (
    <SiteSettingsContext.Provider value={settings}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => useContext(SiteSettingsContext);
