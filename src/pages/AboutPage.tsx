import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useLanguage } from '../i18n/LanguageContext';
import { useSiteSettings } from '../components/SiteSettingsContext';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { API_ENDPOINTS } from '../config/api';

interface CmsPageData {
  title: string;
  body: string;
}

const FALLBACK_ABOUT: Record<'fr' | 'en' | 'pt', CmsPageData> = {
  fr: {
    title: 'À propos de Brasil·É — Notre mission et nos engagements',
    body: `<h2>Pourquoi nous avons créé ce projet</h2>
<p><strong>Brasil·É</strong> est né d’un constat simple : de nombreux étudiants francophones et internationaux souhaitent apprendre le portugais brésilien et réussir leur mobilité au Brésil, mais manquent d’un accompagnement sérieux, officiel et transparent.</p>
<h2>Nos engagements clés</h2>
<ul>
  <li><strong>Formation CECRL (A1 à B2) & CELPE-Bras</strong> en présentiel au Brésil ou 100 % en ligne.</li>
  <li><strong>Garantie contractuelle de remboursement 85 %</strong> en cas de refus officiel de visa.</li>
  <li><strong>Suivi complet</strong> : attestations consulaires conformes, reçus officiels et accompagnement à l’installation.</li>
</ul>`,
  },
  en: {
    title: 'About Brasil·É — Our Mission & Commitments',
    body: `<h2>Why we built this project</h2>
<p><strong>Brasil·É</strong> was created to provide international students with a trusted, transparent, and officially structured bridge to learn Brazilian Portuguese and study in Brazil.</p>
<h2>Our Core Commitments</h2>
<ul>
  <li><strong>CEFR Courses (A1 to B2) & CELPE-Bras</strong> in-person in Brazil or 100% online.</li>
  <li><strong>Contractual 85% Refund Guarantee</strong> in case of official consular visa refusal.</li>
  <li><strong>End-to-End Support</strong>: compliant visa documents, downloadable official receipts, and arrival guidance.</li>
</ul>`,
  },
  pt: {
    title: 'Sobre a Brasil·É — Nossa Missão e Compromissos',
    body: `<h2>Por que criamos este projeto</h2>
<p>A <strong>Brasil·É</strong> nasceu para oferecer aos estudantes internacionais uma ponte segura, transparente e oficialmente estruturada para aprender português brasileiro e estudar no Brasil.</p>
<h2>Nossos Compromissos</h2>
<ul>
  <li><strong>Cursos CECRL (A1 a B2) & CELPE-Bras</strong> presenciais no Brasil ou 100% online.</li>
  <li><strong>Garantia contratual de reembolso de 85%</strong> em caso de recusa consular oficial do visto.</li>
  <li><strong>Acompanhamento completo</strong>: declarações oficiais, recibos para download e apoio na chegada ao Brasil.</li>
</ul>`,
  },
};

export const AboutPage: React.FC = () => {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const siteSettings = useSiteSettings();
  useScrollReveal();

  const [cmsData, setCmsData] = useState<CmsPageData>(FALLBACK_ABOUT[lang]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  useEffect(() => {
    setIsLoading(true);
    fetch(`${API_ENDPOINTS.cmsContent('about_us')}?lang=${lang}`, {
      headers: { Accept: 'application/json' },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((payload) => {
        if (payload?.data?.title && payload?.data?.body) {
          setCmsData({
            title: payload.data.title,
            body: payload.data.body,
          });
        } else {
          setCmsData(FALLBACK_ABOUT[lang]);
        }
      })
      .catch(() => {
        setCmsData(FALLBACK_ABOUT[lang]);
      })
      .finally(() => setIsLoading(false));
  }, [lang]);

  const backLabel =
    lang === 'en' ? 'Back to Home' : lang === 'pt' ? 'Voltar ao início' : 'Retour à l’accueil';
  const ctaBtnLabel =
    lang === 'en'
      ? 'Start My Application'
      : lang === 'pt'
      ? 'Iniciar minha inscrição'
      : 'Commencer mon inscription';

  const pillars =
    lang === 'en'
      ? [
          { icon: 'fa-shield-halved', title: '85% Visa Guarantee', desc: 'Written contractual refund clause within 14 business days in case of visa refusal.' },
          { icon: 'fa-award', title: 'Official MEC / CELPE-Bras', desc: 'Structured CEFR curriculum aligned with Brazilian federal university requirements.' },
          { icon: 'fa-receipt', title: '100% Transparent Fees', desc: 'Flexible installments and instant official PDF receipts in your student portal.' },
        ]
      : lang === 'pt'
      ? [
          { icon: 'fa-shield-halved', title: 'Garantia de 85%', desc: 'Cláusula contratual escrita de reembolso em até 14 dias úteis em caso de recusa.' },
          { icon: 'fa-award', title: 'Preparação CELPE-Bras', desc: 'Currículo CECRL alinhado às exigências das universidades federais do Brasil.' },
          { icon: 'fa-receipt', title: 'Transparência Total', desc: 'Parcelamento flexível e recibos oficiais em PDF disponíveis no portal do aluno.' },
        ]
      : [
          { icon: 'fa-shield-halved', title: 'Garantie Visa 85 %', desc: 'Clause contractuelle écrite de remboursement sous 14 jours ouvrés en cas de refus.' },
          { icon: 'fa-award', title: 'Cadre Officiel CELPE-Bras', desc: 'Cursus CECRL reconnu et aligné sur les exigences des universités fédérales.' },
          { icon: 'fa-receipt', title: 'Transparence Totale', desc: 'Paiement échelonné et reçus officiels PDF disponibles dans votre espace étudiant.' },
        ];

  return (
    <div className="portal-app" style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <Navbar onOpenRegister={() => navigate('/inscription')} forceSolid />

      <main style={{ paddingTop: '112px', paddingBottom: '64px' }}>
        <div style={{ maxWidth: '940px', margin: '0 auto', padding: '0 1.25rem' }}>
          {/* Fil d'Ariane */}
          <div style={{ marginBottom: '1.25rem' }}>
            <Link
              to="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#475569',
                textDecoration: 'none',
              }}
            >
              <i className="fa-solid fa-arrow-left"></i>
              <span>{backLabel}</span>
            </Link>
          </div>

          {/* En-tête */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '22px',
              padding: '2.5rem 2.25rem',
              border: '1px solid #e2e8f0',
              boxShadow: '0 10px 30px rgba(15, 23, 42, 0.05)',
              marginBottom: '1.75rem',
            }}
          >
            <h1
              style={{
                fontSize: 'clamp(1.65rem, 3vw, 2.35rem)',
                fontWeight: 850,
                color: '#0f172a',
                lineHeight: 1.2,
                margin: '0 0 1rem 0',
              }}
            >
              {cmsData.title}
            </h1>

            {/* 3 Piliers de réassurance */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1rem',
                margin: '1.5rem 0 2rem 0',
              }}
            >
              {pillars.map((p, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '1rem 1.1rem',
                    borderRadius: '14px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      background: '#d1fae5',
                      color: '#059669',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '0.65rem',
                      fontSize: '1rem',
                    }}
                  >
                    <i className={`fa-solid ${p.icon}`}></i>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a', marginBottom: '0.3rem' }}>
                    {p.title}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.45 }}>
                    {p.desc}
                  </div>
                </div>
              ))}
            </div>

            {/* Contenu dynamique éditable depuis l'admin CMS */}
            {isLoading ? (
              <div style={{ color: '#64748b', fontSize: '0.9rem', padding: '1rem 0' }}>
                ...
              </div>
            ) : (
              <div
                className="about-cms-prose"
                dangerouslySetInnerHTML={{ __html: cmsData.body }}
              />
            )}

            {/* Bloc Contact & CTA */}
            <div
              style={{
                marginTop: '2.25rem',
                paddingTop: '1.5rem',
                borderTop: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.86rem', color: '#334155' }}>
                <strong style={{ color: '#0f172a' }}>{siteSettings.site_name}</strong>
                <span>
                  <i className="fa-solid fa-envelope" style={{ color: '#059669', marginRight: '6px' }}></i>
                  {siteSettings.contact_email}
                </span>
                <span>
                  <i className="fa-solid fa-phone" style={{ color: '#059669', marginRight: '6px' }}></i>
                  {siteSettings.contact_phone}
                </span>
              </div>

              <button
                type="button"
                className="btn-orange-pill"
                onClick={() => navigate('/inscription')}
              >
                {ctaBtnLabel}
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer onOpenRegister={() => navigate('/inscription')} />

      <style>{`
        .about-cms-prose {
          color: #334155;
          font-size: 0.96rem;
          line-height: 1.75;
        }
        .about-cms-prose h2 {
          font-size: 1.25rem;
          font-weight: 800;
          color: #0f172a;
          margin: 1.75rem 0 0.65rem 0;
        }
        .about-cms-prose h3 {
          font-size: 1.05rem;
          font-weight: 750;
          color: #0f172a;
          margin: 1.25rem 0 0.5rem 0;
        }
        .about-cms-prose p {
          margin: 0 0 0.95rem 0;
        }
        .about-cms-prose ul,
        .about-cms-prose ol {
          padding-left: 1.35rem;
          margin: 0 0 1rem 0;
        }
        .about-cms-prose li {
          margin-bottom: 0.45rem;
        }
        .about-cms-prose strong {
          color: #0f172a;
        }
      `}</style>
    </div>
  );
};
