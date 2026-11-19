import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './RegistrationPage.css';
import { API_ENDPOINTS } from '../config/api';
import { useLanguage } from '../i18n/LanguageContext';
import { useToast } from '../components/ToastContext';
import {
  Eye,
  EyeOff,
  CheckCircle,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const toast = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [studentName, setStudentName] = useState('');

  // Scroll to top
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch(API_ENDPOINTS.login, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      const token = data?.data?.token || data?.token;
      const user = data?.data?.user || data?.user;

      if (res.ok && (token || user)) {
        if (token) {
          localStorage.setItem('student_token', token);
        }
        if (user) {
          localStorage.setItem('student_user', JSON.stringify(user));
        }
        const name = user?.profile?.first_name || user?.first_name || 'Étudiant';
        setStudentName(name);
        setIsSuccess(true);
        toast.success(`${t.auth.welcomeBack}, ${name} !`);
        // Transition fluide et directe vers le portail étudiant
        setTimeout(() => {
          navigate('/portail');
        }, 800);
      } else {
        toast.error(data?.message || 'Identifiants incorrects. Veuillez vérifier votre adresse e-mail et votre mot de passe.');
      }
    } catch {
      toast.error('Impossible de contacter le serveur. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-auth-viewport">
      {/* Background layer: aerial drone view of Brazilian university */}
      <div className="glass-auth-bg-layer" />

      {/* Ripple concentric rings (matching reference design) */}
      <div className="glass-auth-ripple-rings" aria-hidden="true">
        <div className="ripple-ring ring-1" />
        <div className="ripple-ring ring-2" />
        <div className="ripple-ring ring-3" />
        <div className="ripple-ring ring-4" />
        <div className="ripple-ring ring-5" />
      </div>

      {/* Main Centered Frosted Glass Card */}
      <main className="glass-auth-main">
        <div className="glass-card glass-card-login">
          {isSuccess ? (
            <div className="glass-success-view">
              <div className="glass-icon-badge success">
                <CheckCircle size={36} className="text-emerald-600" />
              </div>
              <h1 className="glass-card-title">{t.auth.welcomeBack}, {studentName} !</h1>
              <p className="glass-card-subtitle">
                {t.auth.sessionOpen}
              </p>
              <div className="glass-action-buttons">
                <button
                  type="button"
                  className="glass-btn-primary"
                  onClick={() => navigate('/portail')}
                >
                  {t.auth.accessPortal}
                </button>
              </div>
            </div>
          ) : (
            <div className="glass-form-inner">
              {/* Title & Subtitle */}
              <h1 className="glass-card-title">{t.auth.loginTitle}</h1>
              <p className="glass-card-subtitle">
                {t.auth.loginSubtitle}
              </p>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="glass-actual-form">
                <div className="glass-field-group">
                  <label className="glass-label">{t.auth.emailLabel}</label>
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
                  <label className="glass-label">{t.auth.passwordLabel}</label>
                  <div className="glass-password-wrap">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder={t.auth.passwordPlaceholder}
                      className="glass-input glass-password-input"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="glass-eye-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label="Afficher ou masquer le mot de passe"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Remember me & Forgot password */}
                <div className="glass-options-row">
                  <label className="glass-checkbox-label">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="glass-checkbox"
                    />
                    <span>{t.auth.rememberMe}</span>
                  </label>

                  <a
                    href="#forgot"
                    className="glass-forgot-link"
                    onClick={(e) => {
                      e.preventDefault();
                      toast.info(t.auth.forgotAlert);
                    }}
                  >
                    {t.auth.forgotPassword}
                  </a>
                </div>

                {/* Dark submit button */}
                <button
                  type="submit"
                  className="glass-btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t.auth.loggingIn : t.auth.loginBtn}
                </button>

                {/* Footer link to registration */}
                <div className="glass-footer-link-row">
                  <span>{t.auth.noAccount}</span>{' '}
                  <Link to="/inscription" className="glass-text-link">
                    {t.auth.createAccount}
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
