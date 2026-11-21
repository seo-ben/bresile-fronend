/**
 * Configuration centralisée des endpoints API.
 * Utilise VITE_API_URL défini dans .env, avec repli automatique sur le port 8000 en local.
 */
const isLocalhost =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const envApiUrl = import.meta.env.VITE_API_URL || '';

export const API_BASE_URL: string = (
  !isLocalhost && (!envApiUrl || envApiUrl.includes('127.0.0.1') || envApiUrl.includes('localhost'))
    ? 'https://bresileapi.wasmer.app'
    : envApiUrl || 'http://127.0.0.1:8000'
).replace(/\/$/, '');

export const API_ENDPOINTS = {
  academicUniversities: `${API_BASE_URL}/api/v1/academic/universities`,
  academicLevels: `${API_BASE_URL}/api/v1/academic/levels`,
  academicCities: `${API_BASE_URL}/api/v1/academic/cities`,
  enrollmentSteps: `${API_BASE_URL}/api/v1/academic/enrollment-steps`,
  register: `${API_BASE_URL}/api/v1/auth/register`,
  login: `${API_BASE_URL}/api/v1/auth/login`,
  me: `${API_BASE_URL}/api/v1/auth/me`,
  updateProfile: `${API_BASE_URL}/api/v1/auth/profile`,
  stripeCheckout: `${API_BASE_URL}/api/v1/payments/stripe/checkout`,
  stripeVerify: `${API_BASE_URL}/api/v1/payments/stripe/verify`,
  whatsappLead: `${API_BASE_URL}/api/v1/leads/whatsapp`,
  siteSettings: `${API_BASE_URL}/api/v1/site/settings`,
  studentRequests: `${API_BASE_URL}/api/v1/student-requests`,
  cmsContent: (key: string) => `${API_BASE_URL}/api/v1/academic/cms/${encodeURIComponent(key)}`,
  verifyCertificate: (code: string) => `${API_BASE_URL}/api/v1/certificates/verify/${encodeURIComponent(code)}`,
} as const;
