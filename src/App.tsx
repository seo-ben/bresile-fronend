import { Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import { useScrollReveal } from './hooks/useScrollReveal';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { EducationalShowcase } from './components/EducationalShowcase';
import { MobilityTimeline } from './components/MobilityTimeline';
import { AcademicPartners } from './components/AcademicPartners';
import { TrustGuarantee } from './components/TrustGuarantee';
import { StudentTestimonials } from './components/StudentTestimonials';
import { FaqAndCta } from './components/FaqAndCta';
import { Footer } from './components/Footer';
import { RegistrationPage } from './pages/RegistrationPage';
import { LoginPage } from './pages/LoginPage';
import { StudentPortalPage } from './pages/StudentPortalPage';

export function HomePage() {
  const navigate = useNavigate();
  useScrollReveal();

  const handleGoToRegister = (targetUni?: string) => {
    if (targetUni) {
      navigate(`/inscription?universite=${encodeURIComponent(targetUni)}`);
    } else {
      navigate('/inscription');
    }
  };

  const handleSearch = (_query: string) => {
    const elem = document.getElementById('formations');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="portal-app">
      {/* 1. Navbar transparente épurée (Style Codeur.com avec identité Brasil·É) */}
      <Navbar
        onOpenRegister={() => handleGoToRegister()}
      />

      {/* SESSION 1 : Hero Lumineux avec Aura Circulaire */}
      <Hero
        onSearch={handleSearch}
        onTagClick={handleSearch}
      />

      {/* SESSION 2 : Espace Cursus Éditorial Panoramique (Scroll-driven 300vh) */}
      <EducationalShowcase
        onSelectProgram={() => handleGoToRegister()}
      />

      {/* SESSION 3 : La Frise Chronologique de Mobilité (Processus en 4 étapes) */}
      <MobilityTimeline />

      {/* SESSION 4 : Preuve Académique & Grandes Universités Brésiliennes */}
      <AcademicPartners
        onSelectUniversity={(sigle) => handleGoToRegister(sigle)}
      />

      {/* SESSION 5 : Manifeste de Confiance & Garantie Contractuelle 85% */}
      <TrustGuarantee />

      {/* SESSION 6 : Témoignages & Preuve Sociale d'Étudiants Africains */}
      <StudentTestimonials />

      {/* SESSION 7 : FAQ Interactive & Grand Appel à l'Action de Conversion */}
      <FaqAndCta
        onOpenRegister={() => handleGoToRegister()}
      />

      {/* VRAI FOOTER INSTITUTIONNEL COMPLET */}
      <Footer onOpenRegister={() => handleGoToRegister()} />
    </div>
  );
}

export function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/inscription" element={<RegistrationPage />} />
      <Route path="/connexion" element={<LoginPage />} />
      <Route path="/portail" element={<StudentPortalPage />} />
      <Route path="/espace-etudiant" element={<StudentPortalPage />} />
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
}

export default App;
