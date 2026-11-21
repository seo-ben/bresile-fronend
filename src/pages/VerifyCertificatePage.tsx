import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { API_ENDPOINTS } from '../config/api';
import { useLanguage } from '../i18n/LanguageContext';
import { useScrollReveal } from '../hooks/useScrollReveal';

interface VerifiedCertificate {
  valid: boolean;
  certificate_code: string;
  issued_at: string;
  student_name: string;
  student_ref: string;
  birth_date?: string | null;
  level_name: string;
  study_mode: string;
  city: string;
  status: string;
  payment_verified: boolean;
}

export const VerifyCertificatePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { lang } = useLanguage();
  useScrollReveal();

  const initialCode = searchParams.get('code') || '';
  const [codeInput, setCodeInput] = useState(initialCode);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<VerifiedCertificate | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const runVerification = async (codeToVerify: string) => {
    const clean = codeToVerify.trim().toUpperCase();
    if (!clean) return;
    setIsLoading(true);
    setErrorMsg('');
    setResult(null);

    try {
      const res = await fetch(API_ENDPOINTS.verifyCertificate(clean), {
        headers: { Accept: 'application/json' },
      });
      const payload = await res.json();
      if (res.ok && payload?.data?.valid) {
        setResult(payload.data);
      } else {
        setErrorMsg(
          payload?.message ||
            (lang === 'en'
              ? 'No official enrollment certificate found for this verification code.'
              : lang === 'pt'
              ? 'Nenhuma declaração oficial encontrada para este código.'
              : 'Aucune attestation officielle ne correspond à ce code de vérification.')
        );
      }
    } catch {
      setErrorMsg('Impossible de contacter le serveur de vérification.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (initialCode) {
      runVerification(initialCode);
    }
  }, [initialCode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = codeInput.trim().toUpperCase();
    if (!clean) return;
    setSearchParams({ code: clean });
    runVerification(clean);
  };

  return (
    <div className="portal-app" style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <Navbar onOpenRegister={() => navigate('/inscription')} forceSolid />

      <main style={{ paddingTop: '118px', paddingBottom: '72px' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: '0 1.25rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <Link to="/" style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', textDecoration: 'none' }}>
              <i className="fa-solid fa-arrow-left"></i>{' '}
              {lang === 'en' ? 'Back to Home' : lang === 'pt' ? 'Voltar ao início' : 'Retour à l’accueil'}
            </Link>
          </div>

          <div
            style={{
              background: '#ffffff',
              borderRadius: '22px',
              padding: '2.25rem',
              border: '1px solid #e2e8f0',
              boxShadow: '0 12px 32px rgba(15, 23, 42, 0.06)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.75rem' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: '#ecfdf5',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                }}
              >
                <i className="fa-solid fa-qrcode"></i>
              </div>
              <div>
                <h1 style={{ fontSize: '1.45rem', fontWeight: 850, color: '#0f172a', margin: 0 }}>
                  {lang === 'en'
                    ? 'Verify an Enrollment Certificate'
                    : lang === 'pt'
                    ? 'Verificar Declaração de Matrícula'
                    : 'Vérifier une Attestation d’Inscription'}
                </h1>
                <p style={{ fontSize: '0.86rem', color: '#64748b', margin: '2px 0 0 0' }}>
                  {lang === 'en'
                    ? 'Consulates, universities, and families can verify the authenticity of any official certificate.'
                    : lang === 'pt'
                    ? 'Consulados, universidades e famílias podem confirmar a autenticidade de qualquer declaração.'
                    : 'Consulats, universités et familles peuvent contrôler instantanément l’authenticité d’une attestation.'}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', marginTop: '1.35rem' }}>
              <input
                type="text"
                required
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
                placeholder="Ex: BE-CERT-2026-A1B2C3D4"
                style={{
                  flex: '1 1 260px',
                  padding: '0.75rem 1rem',
                  borderRadius: '12px',
                  border: '1px solid #cbd5e1',
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  color: '#0f172a',
                }}
              />
              <button
                type="submit"
                className="btn-orange-pill"
                disabled={isLoading}
                style={{ borderRadius: '12px' }}
              >
                {isLoading ? '...' : lang === 'en' ? 'Verify' : lang === 'pt' ? 'Verificar' : 'Vérifier'}
              </button>
            </form>

            {errorMsg && (
              <div
                style={{
                  marginTop: '1.35rem',
                  padding: '1rem 1.15rem',
                  borderRadius: '12px',
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  color: '#991b1b',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                }}
              >
                <i className="fa-solid fa-circle-xmark" style={{ marginRight: '8px' }}></i>
                {errorMsg}
              </div>
            )}

            {result && (
              <div
                style={{
                  marginTop: '1.5rem',
                  padding: '1.35rem',
                  borderRadius: '16px',
                  background: '#ecfdf5',
                  border: '1.5px solid #6ee7b7',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#065f46', fontWeight: 850, fontSize: '1rem', marginBottom: '1rem' }}>
                  <i className="fa-solid fa-shield-check" style={{ fontSize: '1.2rem' }}></i>
                  <span>
                    {lang === 'en'
                      ? 'Official Certificate Authenticated'
                      : lang === 'pt'
                      ? 'Declaração Oficial Autenticada'
                      : 'Attestation Officielle Authentifiée'}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', fontSize: '0.86rem' }}>
                  <div><span style={{ color: '#047857' }}>Code :</span> <strong>{result.certificate_code}</strong></div>
                  <div><span style={{ color: '#047857' }}>Date d’émission :</span> <strong>{result.issued_at}</strong></div>
                  <div><span style={{ color: '#047857' }}>Étudiant :</span> <strong>{result.student_name}</strong></div>
                  <div><span style={{ color: '#047857' }}>Référence :</span> <strong>{result.student_ref}</strong></div>
                  <div><span style={{ color: '#047857' }}>Formation :</span> <strong>{result.level_name}</strong></div>
                  <div><span style={{ color: '#047857' }}>Modalité :</span> <strong>{result.study_mode}</strong></div>
                  <div><span style={{ color: '#047857' }}>Campus :</span> <strong>{result.city}</strong></div>
                  <div><span style={{ color: '#047857' }}>Paiement :</span> <strong>{result.payment_verified ? '✓ Validé' : 'En cours'}</strong></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer onOpenRegister={() => navigate('/inscription')} />
    </div>
  );
};
