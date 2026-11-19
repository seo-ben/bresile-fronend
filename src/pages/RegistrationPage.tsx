import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import './RegistrationPage.css';
import {
  Eye,
  EyeOff,
  CheckCircle,
  Upload,
  FileCheck2,
  X,
} from 'lucide-react';
import { API_ENDPOINTS } from '../config/api';
import { useLanguage } from '../i18n/LanguageContext';
import { useToast } from '../components/ToastContext';

interface PartnerOption {
  sigle: string;
  name: string;
  city: string;
}

interface LevelOption {
  id: number;
  code: string;
  name: string;
}

interface CityOption {
  id: number;
  name: string;
  state_code?: string;
}

const defaultUniversityOptions: PartnerOption[] = [
  { sigle: 'UnB', name: 'Universidade de Brasília', city: 'Brasília' },
  { sigle: 'USP', name: 'Universidade de São Paulo', city: 'São Paulo' },
  { sigle: 'UNICAMP', name: 'Univ. Estadual de Campinas', city: 'Campinas' },
  { sigle: 'UFRJ', name: 'Univ. Federal do Rio de Janeiro', city: 'Rio de Janeiro' },
  { sigle: 'UFMG', name: 'Univ. Federal de Minas Gerais', city: 'Belo Horizonte' },
  { sigle: 'UFRGS', name: 'Univ. Federal do Rio Grande do Sul', city: 'Porto Alegre' },
];

const defaultLevelOptions: LevelOption[] = [
  { id: 1, code: 'A1', name: 'Niveau A1 — Débutant' },
  { id: 2, code: 'A2', name: 'Niveau A2 — Élémentaire' },
  { id: 3, code: 'B1', name: 'Niveau B1 — Intermédiaire' },
  { id: 4, code: 'B2', name: 'Niveau B2 — Avancé' },
  { id: 5, code: 'CELPE', name: 'Préparation Intensive CELPE-Bras' },
];

const defaultCityOptions: CityOption[] = [
  { id: 1, name: 'Brasília', state_code: 'DF' },
  { id: 2, name: 'São Paulo', state_code: 'SP' },
  { id: 3, name: 'Campinas', state_code: 'SP' },
  { id: 4, name: 'Rio de Janeiro', state_code: 'RJ' },
  { id: 5, name: 'Belo Horizonte', state_code: 'MG' },
  { id: 6, name: 'Porto Alegre', state_code: 'RS' },
  { id: 7, name: 'Salvador', state_code: 'BA' },
  { id: 8, name: 'Curitiba', state_code: 'PR' },
];

const countryDialCodes: Record<string, string> = {
  'Sénégal': '+221',
  "Côte d'Ivoire": '+225',
  'Cameroun': '+237',
  'Guinée': '+224',
  'Mali': '+223',
  'Bénin': '+229',
  'Togo': '+228',
  'Congo': '+242',
  'RD Congo': '+243',
  'Burkina Faso': '+226',
  'Gabon': '+241',
  'Brésil': '+55',
  'France': '+33',
  'Autre pays': '+1',
};

const dialCodeList = [
  { code: '+221', flag: '🇸🇳', label: '+221' },
  { code: '+225', flag: '🇨🇮', label: '+225' },
  { code: '+237', flag: '🇨🇲', label: '+237' },
  { code: '+224', flag: '🇬🇳', label: '+224' },
  { code: '+223', flag: '🇲🇱', label: '+223' },
  { code: '+229', flag: '🇧🇯', label: '+229' },
  { code: '+228', flag: '🇹🇬', label: '+228' },
  { code: '+242', flag: '🇨🇬', label: '+242' },
  { code: '+243', flag: '🇨🇩', label: '+243' },
  { code: '+226', flag: '🇧🇫', label: '+226' },
  { code: '+241', flag: '🇬🇦', label: '+241' },
  { code: '+55', flag: '🇧🇷', label: '+55' },
  { code: '+33', flag: '🇫🇷', label: '+33' },
  { code: '+1', flag: '🇺🇸', label: '+1' },
  { code: '+', flag: '🌐', label: '+' },
];

export const RegistrationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const toast = useToast();

  const preselectedUniversity = searchParams.get('universite') || '';
  const preselectedLevel = searchParams.get('niveau') || 'Niveau A1 — Débutant';
  const preselectedMode = searchParams.get('mode') || 'Présentiel au Brésil';

  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [email, setEmail] = useState('');
  const [dialCode, setDialCode] = useState('+221');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [country, setCountry] = useState('Sénégal');
  const [desiredLevel, setDesiredLevel] = useState(preselectedLevel);
  const [previousLevelFile, setPreviousLevelFile] = useState<File | null>(null);
  const [studyMode, setStudyMode] = useState(preselectedMode);
  const [studyPurpose, setStudyPurpose] = useState('etudes_superieures');
  const [cityChoice, setCityChoice] = useState('Brasília (Capitale)');
  const [targetUniversity, setTargetUniversity] = useState(preselectedUniversity);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [universities, setUniversities] = useState<PartnerOption[]>(defaultUniversityOptions);
  const [levels, setLevels] = useState<LevelOption[]>(defaultLevelOptions);
  const [cities, setCities] = useState<CityOption[]>(defaultCityOptions);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Déterminer si le niveau sélectionné est supérieur à A1 et quel niveau précédent justifier
  const selectedLevelIdx = levels.findIndex((l) => l.name === desiredLevel || l.code === desiredLevel);
  const requiredPreviousLevel = selectedLevelIdx > 0 ? levels[selectedLevelIdx - 1] : null;

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  // Fetch live universities, levels, and cities from database API (auto-translated per lang)
  useEffect(() => {
    // 1. Universités partenaires
    fetch(`${API_ENDPOINTS.academicUniversities}?lang=${lang}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((payload) => {
        if (payload?.data && Array.isArray(payload.data) && payload.data.length > 0) {
          const list = payload.data.map((u: any) => ({
            sigle: u.sigle,
            name: u.name,
            city: u.city,
          }));
          setUniversities(list);
        }
      })
      .catch(() => {});

    // 2. Niveaux d'études (gérés par l'admin dans Filament et traduits automatiquement)
    fetch(`${API_ENDPOINTS.academicLevels}?lang=${lang}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((payload) => {
        if (payload?.data && Array.isArray(payload.data) && payload.data.length > 0) {
          const list = payload.data.map((l: any) => ({
            id: l.id,
            code: l.code,
            name: l.name,
          }));
          setLevels(list);
          setDesiredLevel((prev) => {
            const matchById = list.find((item: LevelOption) => item.name === prev);
            return matchById ? matchById.name : list[0].name;
          });
        }
      })
      .catch(() => {});

    // 3. Villes d'accueil (gérées par l'admin dans Filament)
    fetch(`${API_ENDPOINTS.academicCities}?lang=${lang}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((payload) => {
        if (payload?.data && Array.isArray(payload.data) && payload.data.length > 0) {
          const list = payload.data.map((c: any) => ({
            id: c.id,
            name: c.name,
            state_code: c.state_code,
          }));
          setCities(list);
        }
      })
      .catch(() => {});
  }, [lang]);

  // Auto-sync city when university changes
  useEffect(() => {
    if (targetUniversity) {
      const match = universities.find((u) => u.sigle === targetUniversity);
      if (match) {
        setCityChoice(match.city);
      }
    }
  }, [targetUniversity, universities]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const fullPhone = dialCode === '+' ? phoneNumber : `${dialCode} ${phoneNumber}`.trim();

      // Résoudre les IDs sélectionnés pour lier directement aux tables de la base de données
      const selectedLevelObj = levels.find((l) => l.name === desiredLevel || l.code === desiredLevel);
      const selectedCityObj = cities.find((c) => c.name === cityChoice || cityChoice.includes(c.name));

      const formData = new FormData();
      formData.append('first_name', firstName);
      formData.append('last_name', lastName);
      if (birthDate) formData.append('birth_date', birthDate);
      formData.append('email', email);
      formData.append('phone', fullPhone);
      formData.append('dial_code', dialCode);
      formData.append('phone_number', phoneNumber);
      formData.append('password', password || 'Password123!');
      formData.append('preferred_locale', lang);
      if (selectedLevelObj?.id) formData.append('level_id', String(selectedLevelObj.id));
      formData.append('level_choice', desiredLevel);
      formData.append('study_mode', studyMode);
      formData.append('study_purpose', studyPurpose);
      if (!studyMode.includes('Ligne') && selectedCityObj?.id) {
        formData.append('brazil_city_id', String(selectedCityObj.id));
      }
      formData.append('city_choice', studyMode.includes('Ligne') ? 'En ligne' : cityChoice);
      formData.append('target_university', targetUniversity || 'Non spécifiée');
      formData.append('country', country);
      if (requiredPreviousLevel && previousLevelFile) {
        formData.append('previous_level_certificate', previousLevelFile);
      }

      const res = await fetch(API_ENDPOINTS.register, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData,
      });

      const data = await res.json();
      const token = data?.data?.token || data?.token;
      const user = data?.data?.user || data?.user;

      if (res.ok || data?.success || user) {
        if (token) {
          localStorage.setItem('student_token', token);
        }
        if (user) {
          localStorage.setItem('student_user', JSON.stringify(user));
        }
        toast.success(t.auth.regSuccessTitle);
        setIsSuccess(true);
      } else {
        if (data?.message && (data.message.includes('already been taken') || data.message.includes('unique'))) {
          toast.error('Cette adresse e-mail est déjà associée à un compte. Veuillez vous connecter sur la page Connexion.');
        } else {
          toast.error(data?.message || 'Une erreur est survenue lors de l’inscription. Veuillez vérifier vos données.');
        }
      }
    } catch {
      toast.error('Impossible de contacter le serveur. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-auth-viewport">
      {/* Background layer: aerial drone view of Brazilian university campus */}
      <div className="glass-auth-bg-layer" />

      {/* Ripple concentric rings (matching reference design) */}
      <div className="glass-auth-ripple-rings" aria-hidden="true">
        <div className="ripple-ring ring-1" />
        <div className="ripple-ring ring-2" />
        <div className="ripple-ring ring-3" />
        <div className="ripple-ring ring-4" />
        <div className="ripple-ring ring-5" />
      </div>

      {/* Centered Glassmorphism Card */}
      <main className="glass-auth-main">
        <div className="glass-card glass-card-registration">
          {isSuccess ? (
            <div className="glass-success-view">
              <div className="glass-icon-badge success">
                <CheckCircle size={36} className="text-emerald-600" />
              </div>
              <h1 className="glass-card-title">{t.auth.regSuccessTitle}</h1>
              <p className="glass-card-subtitle">
                <strong>{firstName} {lastName}</strong> — <strong>{desiredLevel}</strong> ({studyMode})
              </p>
              <div className="glass-action-buttons">
                <button
                  type="button"
                  className="glass-btn-primary"
                  onClick={() => navigate('/portail')}
                >
                  {t.auth.accessPortal}
                </button>
                <button
                  type="button"
                  className="glass-btn-secondary"
                  onClick={() => navigate('/')}
                >
                  {t.auth.backHome}
                </button>
              </div>
            </div>
          ) : (
            <div className="glass-form-inner">
              {/* Title & Subtitle */}
              <h1 className="glass-card-title">{t.auth.regTitle}</h1>
              <p className="glass-card-subtitle">
                {t.auth.regSubtitle}
              </p>

              {/* Registration Form */}
              <form onSubmit={handleSubmit} className="glass-actual-form">
                {/* Row 1: Prénom & Nom */}
                <div className="glass-form-row">
                  <div className="glass-field-group">
                    <label className="glass-label">{t.auth.firstName}</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Ibrahima"
                      className="glass-input"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>

                  <div className="glass-field-group">
                    <label className="glass-label">{t.auth.lastName}</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Sow"
                      className="glass-input"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>

                {/* Row 1b: Date de naissance & Objet d'étude */}
                <div className="glass-form-row">
                  <div className="glass-field-group">
                    <label className="glass-label">{t.auth.birthDate}</label>
                    <input
                      type="date"
                      required
                      className="glass-input"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                    />
                  </div>

                  <div className="glass-field-group">
                    <label className="glass-label">{t.auth.studyPurpose}</label>
                    <select
                      className="glass-input glass-select"
                      value={studyPurpose}
                      onChange={(e) => setStudyPurpose(e.target.value)}
                      required
                    >
                      <option value="etudes_superieures">{t.auth.purposeStudies}</option>
                      <option value="business_affaires">{t.auth.purposeBusiness}</option>
                      <option value="travail">{t.auth.purposeWork}</option>
                      <option value="conversation">{t.auth.purposeConversation}</option>
                      <option value="celpe_bras">{t.auth.purposeCelpe}</option>
                      <option value="tourisme_immersion">{t.auth.purposeImmersion}</option>
                      <option value="autre">{t.auth.purposeOther}</option>
                    </select>
                  </div>
                </div>

                {/* Row 2: Email & Téléphone/WhatsApp */}
                <div className="glass-form-row">
                  <div className="glass-field-group">
                    <label className="glass-label">{t.auth.emailLabel} *</label>
                    <input
                      type="email"
                      required
                      placeholder="votre.email@example.com"
                      className="glass-input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="glass-field-group">
                    <label className="glass-label">{t.auth.phone}</label>
                    <div className="glass-phone-combined">
                      <select
                        className="glass-input glass-select glass-dial-select"
                        value={dialCode}
                        onChange={(e) => setDialCode(e.target.value)}
                        aria-label="Indicatif pays"
                      >
                        {dialCodeList.map((item) => (
                          <option key={item.code} value={item.code}>
                            {item.flag} {item.label}
                          </option>
                        ))}
                      </select>
                      <input
                        type="tel"
                        required
                        placeholder="77 123 45 67"
                        className="glass-input glass-phone-input"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Row 3: Niveau CECRL & Modalité */}
                <div className="glass-form-row">
                  <div className="glass-field-group">
                    <label className="glass-label">{t.auth.levelTarget}</label>
                    <select
                      className="glass-input glass-select"
                      value={desiredLevel}
                      onChange={(e) => {
                        setDesiredLevel(e.target.value);
                        setPreviousLevelFile(null);
                      }}
                    >
                      {levels.map((lvl) => (
                        <option key={lvl.id || lvl.code} value={lvl.name}>
                          {lvl.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="glass-field-group">
                    <label className="glass-label">{t.auth.studyMode}</label>
                    <select
                      className="glass-input glass-select"
                      value={studyMode}
                      onChange={(e) => setStudyMode(e.target.value)}
                    >
                      <option value="Présentiel au Brésil">{t.auth.modeInPerson}</option>
                      <option value="Présentiel au Brésil (Visa Visiteur)">{t.auth.modeVisitor}</option>
                      <option value="100% En Ligne">{t.auth.modeOnline}</option>
                    </select>
                  </div>
                </div>

                {/* Champ conditionnel : justificatif du niveau précédent pour tout niveau supérieur à A1 */}
                {requiredPreviousLevel && (
                  <div className="glass-field-group">
                    <label className="glass-label">
                      {t.auth.prevLevelCertPrefix} {requiredPreviousLevel.code || requiredPreviousLevel.name} *
                    </label>
                    <label
                      className={`glass-file-dropzone ${previousLevelFile ? 'has-file' : ''}`}
                    >
                      <input
                        type="file"
                        required
                        accept=".pdf,.jpg,.jpeg,.png,.webp"
                        className="glass-file-native-input"
                        onChange={(e) => setPreviousLevelFile(e.target.files?.[0] || null)}
                      />
                      <div className="glass-file-dropzone-icon">
                        {previousLevelFile ? (
                          <FileCheck2 size={16} />
                        ) : (
                          <Upload size={16} />
                        )}
                      </div>
                      <div className="glass-file-dropzone-text">
                        {previousLevelFile ? (
                          <>
                            <span className="glass-file-name">{previousLevelFile.name}</span>
                            <span className="glass-file-meta">
                              {(previousLevelFile.size / 1024 / 1024).toFixed(2)} Mo
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="glass-file-cta">
                              {lang === 'en'
                                ? 'Click to upload your certificate'
                                : lang === 'pt'
                                ? 'Clique para enviar seu certificado'
                                : 'Cliquez pour importer votre justificatif'}
                            </span>
                            <span className="glass-file-meta">{t.auth.prevLevelCertHint}</span>
                          </>
                        )}
                      </div>
                      {previousLevelFile && (
                        <button
                          type="button"
                          className="glass-file-clear-btn"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setPreviousLevelFile(null);
                          }}
                          aria-label="Retirer le fichier"
                        >
                          <X size={15} />
                        </button>
                      )}
                    </label>
                  </div>
                )}

                {/* Row 4: Ville d'accueil & Université cible */}
                <div className="glass-form-row">
                  <div className="glass-field-group">
                    <label className="glass-label">{t.auth.hostCity}</label>
                    <select
                      className="glass-input glass-select"
                      value={cityChoice}
                      onChange={(e) => setCityChoice(e.target.value)}
                      disabled={studyMode.includes('Ligne')}
                    >
                      {cities.map((c) => (
                        <option key={c.id || c.name} value={c.name}>
                          {c.name}{c.state_code ? ` (${c.state_code})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="glass-field-group">
                    <label className="glass-label">{t.auth.targetUni}</label>
                    <select
                      className="glass-input glass-select"
                      value={targetUniversity}
                      onChange={(e) => setTargetUniversity(e.target.value)}
                    >
                      <option value="">{t.auth.chooseLater}</option>
                      {universities.map((uni) => (
                        <option key={uni.sigle} value={uni.sigle}>
                          {uni.sigle} — {uni.name} ({uni.city})
                        </option>
                      ))}
                      <option value="Autre faculté">{t.auth.otherUni}</option>
                    </select>
                  </div>
                </div>

                {/* Row 5: Pays de résidence & Mot de passe */}
                <div className="glass-form-row">
                  <div className="glass-field-group">
                    <label className="glass-label">{t.auth.residenceCountry}</label>
                    <select
                      className="glass-input glass-select"
                      value={country}
                      onChange={(e) => {
                        const newCountry = e.target.value;
                        setCountry(newCountry);
                        if (countryDialCodes[newCountry]) {
                          setDialCode(countryDialCodes[newCountry]);
                        }
                      }}
                    >
                      <option value="Sénégal">Sénégal</option>
                      <option value="Côte d'Ivoire">Côte d'Ivoire</option>
                      <option value="Cameroun">Cameroun</option>
                      <option value="Guinée">Guinée</option>
                      <option value="Mali">Mali</option>
                      <option value="Bénin">Bénin</option>
                      <option value="Togo">Togo</option>
                      <option value="Congo">Congo</option>
                      <option value="RD Congo">RD Congo</option>
                      <option value="Burkina Faso">Burkina Faso</option>
                      <option value="Gabon">Gabon</option>
                      <option value="Autre pays">Autre pays</option>
                    </select>
                  </div>

                  <div className="glass-field-group">
                    <label className="glass-label">{t.auth.accountPassword}</label>
                    <div className="glass-password-wrap">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder={t.auth.minChars}
                        className="glass-input glass-password-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="glass-eye-btn"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label="Afficher ou masquer mot de passe"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="glass-btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t.auth.submittingReg : t.auth.submitReg}
                </button>

                {/* Footer Link to Student Login */}
                <div className="glass-footer-link-row">
                  <span>{t.auth.alreadyAccount}</span>{' '}
                  <Link to="/connexion" className="glass-text-link">
                    {t.auth.loginBtn}
                  </Link>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
