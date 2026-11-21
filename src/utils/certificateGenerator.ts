import type { SiteSettings } from '../components/SiteSettingsContext';
import type { Language } from '../i18n/LanguageContext';

export interface SecureCertificateData {
  certificateCode: string;
  issuedAt: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  studentRef: string;
  birthDate?: string | null;
  levelName: string;
  studyMode: string;
  cityLabel: string;
  rhythmLabel: string;
}

export function openSecureEnrollmentCertificate(
  cert: SecureCertificateData,
  site: SiteSettings,
  lang: Language
): void {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://bresile.wasmer.app';
  const verifyUrl = `${origin}/verifier-attestation?code=${encodeURIComponent(cert.certificateCode)}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&margin=4&color=1b3668&bgcolor=ffffff&data=${encodeURIComponent(verifyUrl)}`;
  const safeLogo = site.logo_url || `${origin}/logo.png`;

  const directorName = site.cert_director_name || `Direction Pédagogique ${site.site_name}`;
  const directorTitle =
    site.cert_director_title ||
    (lang === 'en'
      ? 'Admissions & International Mobility Office'
      : lang === 'pt'
      ? 'Diretoria de Admissões e Mobilidade Internacional'
      : 'Direction des Admissions & Mobilité Internationale');
  const weeklyHours =
    site.cert_weekly_hours ||
    (lang === 'en'
      ? '20 hours / week (VITEM IV consular requirement)'
      : lang === 'pt'
      ? '20 horas / semana (Exigência consular VITEM IV)'
      : '20 heures / semaine (Minimum consulaire VITEM IV)');

  const cleanWebsite = (site.website_url || 'www.brasil-e.com').replace(/^https?:\/\//i, '');
  const cityIssued = (site.contact_address || 'Brasília, DF').split(',')[0].trim() || 'Brasília';

  const t =
    lang === 'en'
      ? {
          topBoxCaption: 'STUDENT FILE REF.',
          certNoLabel: 'No.',
          titleTop: 'OFFICIAL CERTIFICATE OF ENROLLMENT',
          titleConnector: 'for',
          titleMain: 'PORTUGUESE LANGUAGE & ACADEMIC MOBILITY',
          prefixName: 'Mr. / Ms.',
          prefixContact: 'Contact',
          birthPrefix: 'Born',
          holderLine: 'holder of Student File No.',
          campusLabel: 'Campus',
          registeredLine: `has been officially registered today in the records of ${site.site_name} for:`,
          directorHeader: 'THE ACADEMIC DIRECTOR',
          directorSub: 'or by delegation',
          orderNo: 'SERIAL No.',
          issuedConnector: 'on',
          printBtn: 'Download / Print Official PDF',
        }
      : lang === 'pt'
      ? {
          topBoxCaption: 'MATRÍCULA / REGISTRO',
          certNoLabel: 'N°',
          titleTop: 'DECLARAÇÃO OFICIAL DE MATRÍCULA',
          titleConnector: 'em',
          titleMain: 'PORTUGUÊS BRASILEIRO & MOBILIDADE ACADÊMICA',
          prefixName: 'Sr. / Sra.',
          prefixContact: 'Contato',
          birthPrefix: 'Nascido(a) em',
          holderLine: 'titular do Registro Acadêmico N°',
          campusLabel: 'Campus',
          registeredLine: `encontra-se regularmente matriculado(a) nesta data nos registros da ${site.site_name} para:`,
          directorHeader: 'A DIRETORIA ACADÊMICA',
          directorSub: 'ou por delegação',
          orderNo: 'N° DE ORDEM',
          issuedConnector: 'em',
          printBtn: 'Baixar / Imprimir PDF Oficial',
        }
      : {
          topBoxCaption: 'DOSSIER ÉTUDIANT',
          certNoLabel: 'N°',
          titleTop: 'ATTESTATION OFFICIELLE D’INSCRIPTION',
          titleConnector: 'de',
          titleMain: 'FORMATION EN PORTUGAIS & MOBILITÉ AU BRÉSIL',
          prefixName: 'M. / Mme',
          prefixContact: 'Coordonnées',
          birthPrefix: 'Né(e) le',
          holderLine: 'titulaire du Dossier Étudiant N°',
          campusLabel: 'Campus',
          registeredLine: `a été inscrit(e) ce jour sur les registres officiels de l’établissement ${site.site_name} pour :`,
          directorHeader: 'LA DIRECTION PÉDAGOGIQUE',
          directorSub: 'ou par délégation',
          orderNo: 'N° D’ORDRE',
          issuedConnector: 'le',
          printBtn: 'Télécharger / Imprimer en PDF',
        };

  const contactSummaryParts = [
    cert.studentEmail,
    cert.studentPhone && cert.studentPhone !== '—' ? cert.studentPhone : '',
    cert.birthDate ? `${t.birthPrefix} ${cert.birthDate}` : '',
  ].filter(Boolean);
  const contactSummary = contactSummaryParts.join('  ·  ') || '—';

  const html = `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8" />
  <title>${t.titleTop} — ${cert.certificateCode}</title>
  <style>
    @page {
      size: A4 landscape;
      margin: 0;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      font-family: Georgia, "Times New Roman", Times, serif;
      background: #e5e7eb;
      color: #1b2a4a;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 20px;
    }

    .toolbar {
      width: 297mm;
      max-width: 100%;
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-bottom: 12px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }

    .btn-print {
      background: #1b3668;
      color: #ffffff;
      border: none;
      padding: 10px 22px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(27, 54, 104, 0.28);
      letter-spacing: 0.02em;
    }

    .btn-print:hover {
      background: #12254a;
    }

    .sheet {
      width: 297mm;
      height: 210mm;
      background: #ffffff;
      position: relative;
      padding: 12mm 14mm 10mm 14mm;
      box-shadow: 0 18px 50px rgba(15, 23, 42, 0.22);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;
    }

    /* Cadre guilloché bleu officiel */
    .guilloche-frame {
      position: relative;
      flex: 1;
      width: 100%;
      padding: 10.5mm;
      background: #ffffff;
      display: flex;
    }

    .guilloche-svg {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1;
    }

    /* Fond rayonnement solaire doré fidèle au modèle */
    .cert-inner {
      position: relative;
      z-index: 2;
      flex: 1;
      width: 100%;
      border: 1.2px solid #2c4e94;
      background-color: #fffdf4;
      background-image:
        radial-gradient(circle at 50% 48%, rgba(242, 206, 82, 0.72) 0%, rgba(246, 219, 118, 0.34) 16%, rgba(255, 252, 235, 0) 44%),
        repeating-conic-gradient(
          from -4deg at 50% 48%,
          rgba(235, 198, 72, 0.34) 0deg 3.2deg,
          rgba(255, 253, 244, 0.08) 3.2deg 7.5deg
        );
      padding: 9mm 15mm 8mm 15mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    /* Rangée supérieure : Logo + Cartouche gauche + N° unique à droite */
    .top-bar {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
    }

    .top-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .school-logo {
      height: 38px;
      width: auto;
      max-width: 110px;
      object-fit: contain;
      filter: drop-shadow(0 1px 2px rgba(27, 54, 104, 0.14));
    }

    .blue-box-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .blue-box {
      background: rgba(154, 178, 220, 0.78);
      border: 1px solid rgba(44, 78, 148, 0.45);
      min-width: 42mm;
      height: 8mm;
      padding: 0 10px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-family: "Courier New", Courier, monospace;
      font-size: 11.5px;
      font-weight: 700;
      color: #14264a;
      letter-spacing: 0.06em;
    }

    .blue-box-caption {
      margin-top: 3px;
      font-size: 7.5px;
      letter-spacing: 0.09em;
      text-transform: uppercase;
      color: #273c66;
      font-weight: 700;
    }

    .top-right {
      display: flex;
      align-items: center;
      gap: 8px;
      padding-top: 2px;
    }

    .cert-no-label {
      font-size: 13px;
      font-weight: 700;
      color: #1b2a4a;
      letter-spacing: 0.03em;
    }

    .cert-no-box {
      min-width: 56mm;
      font-size: 12px;
    }

    /* En-tête officiel centré */
    .cert-heading {
      text-align: center;
      margin: 4mm 0 5mm 0;
    }

    .cert-heading-top {
      font-size: 15.5px;
      font-weight: 700;
      letter-spacing: 0.22em;
      color: #1b2a4a;
      text-transform: uppercase;
    }

    .cert-heading-connector {
      font-size: 13px;
      font-style: italic;
      color: #2c3e66;
      margin: 2px 0;
    }

    .cert-heading-main {
      font-size: 18px;
      font-weight: 700;
      letter-spacing: 0.16em;
      color: #14264a;
      text-transform: uppercase;
    }

    /* Corps du certificat sur lignes officielles soulignées */
    .cert-body {
      width: 88%;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 4.5mm;
    }

    .form-line {
      display: flex;
      align-items: baseline;
      gap: 8px;
      font-size: 13px;
      color: #1f3054;
    }

    .form-label {
      white-space: nowrap;
      font-weight: 600;
      color: #23365e;
    }

    .form-value {
      flex: 1;
      border-bottom: 1px solid #4a5f8c;
      padding: 0 8px 2px 8px;
      font-size: 14px;
      font-weight: 700;
      color: #0f1f40;
      letter-spacing: 0.02em;
    }

    .form-value-normal {
      font-size: 12.5px;
      font-weight: 600;
    }

    .form-line-split {
      display: flex;
      align-items: baseline;
      gap: 12px;
      font-size: 12.5px;
      color: #1f3054;
    }

    .form-line-split .segment {
      display: flex;
      align-items: baseline;
      gap: 8px;
      flex: 1;
    }

    .registered-phrase {
      font-size: 12.5px;
      color: #1f3054;
      letter-spacing: 0.04em;
      margin-top: 1mm;
    }

    /* Bandeau bleu central officiel (comme sur le modèle) */
    .program-band {
      width: 100%;
      background: rgba(154, 178, 220, 0.78);
      border-top: 1px solid rgba(44, 78, 148, 0.35);
      border-bottom: 1px solid rgba(44, 78, 148, 0.35);
      padding: 7px 14px;
      text-align: center;
      font-size: 14.5px;
      font-weight: 700;
      color: #102042;
      letter-spacing: 0.05em;
    }

    /* Sous-ligne programme + bloc Direction à droite */
    .meta-and-director {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;
      margin-top: 1mm;
    }

    .program-subdetails {
      font-size: 12px;
      color: #22355c;
      line-height: 1.5;
      max-width: 58%;
    }

    .director-block {
      text-align: center;
      min-width: 70mm;
    }

    .director-title-upper {
      font-size: 11.5px;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #16284c;
    }

    .director-sub-italic {
      font-size: 11px;
      font-style: italic;
      color: #2c3e66;
      margin-top: 1px;
    }

    .director-name {
      margin-top: 8mm;
      font-size: 12px;
      font-weight: 700;
      color: #0f1f40;
      border-top: 1px solid #4a5f8c;
      padding-top: 3px;
    }

    .director-role {
      font-size: 10px;
      color: #364b75;
      margin-top: 1px;
    }

    /* Pied intérieur : QR code seul + N° D'ORDRE + Date */
    .bottom-inside {
      width: 88%;
      margin: 2mm auto 0 auto;
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 16px;
    }

    .order-and-date {
      display: flex;
      align-items: flex-end;
      gap: 14px;
      flex: 1;
    }

    .qr-only {
      width: 19mm;
      height: 19mm;
      background: #ffffff;
      border: 1px solid #2c4e94;
      padding: 1.5mm;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .qr-only img {
      width: 100%;
      height: 100%;
      display: block;
    }

    .order-line {
      display: flex;
      align-items: baseline;
      gap: 8px;
      font-size: 11.5px;
      color: #1b2a4a;
      flex: 1;
      padding-bottom: 2px;
    }

    .order-code {
      border-bottom: 1px solid #4a5f8c;
      padding: 0 8px 2px 8px;
      font-family: "Courier New", Courier, monospace;
      font-size: 11.5px;
      font-weight: 700;
      color: #102042;
      min-width: 44mm;
      text-align: center;
    }

    .date-field {
      border-bottom: 1px solid #4a5f8c;
      padding: 0 10px 2px 10px;
      font-size: 12px;
      font-weight: 600;
      color: #102042;
      min-width: 32mm;
      text-align: center;
    }

    /* Petite ligne de référence hors cadre en bas (comme RÉF. 3960...) */
    .outer-ref {
      text-align: center;
      margin-top: 2.5mm;
      font-size: 8.5px;
      letter-spacing: 0.08em;
      color: #2c4e94;
      font-weight: 600;
    }

    @media print {
      body {
        background: #ffffff;
        padding: 0;
        display: block;
      }
      .toolbar {
        display: none;
      }
      .sheet {
        box-shadow: none;
        width: 297mm;
        height: 210mm;
      }
    }
  </style>
</head>
<body>
  <div class="toolbar">
    <button class="btn-print" onclick="window.print()">${t.printBtn}</button>
  </div>

  <div class="sheet">
    <div class="guilloche-frame">
      <!-- Bordure guillochée bleue vectorielle haute définition -->
      <svg class="guilloche-svg" viewBox="0 0 1000 680" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="guillocheMesh" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M0 12 Q6 0 12 12 T24 12" fill="none" stroke="#284c96" stroke-width="1.15" opacity="0.88" />
            <path d="M0 12 Q6 24 12 12 T24 12" fill="none" stroke="#3b63b5" stroke-width="1.05" opacity="0.82" />
            <path d="M12 0 Q0 6 12 12 T12 24" fill="none" stroke="#284c96" stroke-width="1.15" opacity="0.85" />
            <path d="M12 0 Q24 6 12 12 T12 24" fill="none" stroke="#537bc9" stroke-width="1" opacity="0.78" />
            <circle cx="12" cy="12" r="4.5" fill="none" stroke="#1e3c7a" stroke-width="0.75" opacity="0.65" />
            <circle cx="0" cy="0" r="3" fill="none" stroke="#284c96" stroke-width="0.7" opacity="0.6" />
            <circle cx="24" cy="24" r="3" fill="none" stroke="#284c96" stroke-width="0.7" opacity="0.6" />
          </pattern>
        </defs>
        <!-- Bande extérieure guillochée -->
        <rect x="2" y="2" width="996" height="676" fill="url(#guillocheMesh)" stroke="#1f3e82" stroke-width="2" />
        <rect x="7" y="7" width="986" height="666" fill="none" stroke="#3a61b2" stroke-width="0.9" stroke-dasharray="4 2" />
        <!-- Zone intérieure découpée -->
        <rect x="34" y="34" width="932" height="612" fill="#ffffff" stroke="#1f3e82" stroke-width="1.8" />
        <!-- Ornements d'angle guillochés -->
        <rect x="5" y="5" width="29" height="29" fill="url(#guillocheMesh)" stroke="#1f3e82" stroke-width="1.2" />
        <rect x="966" y="5" width="29" height="29" fill="url(#guillocheMesh)" stroke="#1f3e82" stroke-width="1.2" />
        <rect x="5" y="646" width="29" height="29" fill="url(#guillocheMesh)" stroke="#1f3e82" stroke-width="1.2" />
        <rect x="966" y="646" width="29" height="29" fill="url(#guillocheMesh)" stroke="#1f3e82" stroke-width="1.2" />
      </svg>

      <div class="cert-inner">
        <!-- Haut : Logo + Dossier Étudiant + Numéro unique de l'attestation -->
        <div class="top-bar">
          <div class="top-left">
            <img src="${safeLogo}" alt="${site.site_name}" class="school-logo" />
            <div class="blue-box-wrap">
              <div class="blue-box">${cert.studentRef}</div>
              <div class="blue-box-caption">${t.topBoxCaption}</div>
            </div>
          </div>
          <div class="top-right">
            <span class="cert-no-label">${t.certNoLabel}</span>
            <div class="blue-box cert-no-box">${cert.certificateCode}</div>
          </div>
        </div>

        <!-- Titre officiel centré -->
        <div class="cert-heading">
          <div class="cert-heading-top">${t.titleTop}</div>
          <div class="cert-heading-connector">${t.titleConnector}</div>
          <div class="cert-heading-main">${t.titleMain}</div>
        </div>

        <!-- Corps officiel sur lignes soulignées -->
        <div class="cert-body">
          <div class="form-line">
            <span class="form-label">${t.prefixName}</span>
            <span class="form-value">${cert.studentName}</span>
          </div>

          <div class="form-line">
            <span class="form-label">${t.prefixContact}</span>
            <span class="form-value form-value-normal">${contactSummary}</span>
          </div>

          <div class="form-line-split">
            <div class="segment">
              <span class="form-label">${t.holderLine}</span>
              <span class="form-value form-value-normal">${cert.studentRef}</span>
            </div>
            <div class="segment">
              <span class="form-label">${t.campusLabel} :</span>
              <span class="form-value form-value-normal">${cert.cityLabel}</span>
            </div>
          </div>

          <div class="registered-phrase">${t.registeredLine}</div>

          <div class="program-band">
            ${cert.levelName} &nbsp;—&nbsp; ${cert.studyMode}
          </div>

          <div class="meta-and-director">
            <div class="program-subdetails">
              <div><strong>${cert.rhythmLabel}</strong></div>
              <div>${weeklyHours}</div>
            </div>

            <div class="director-block">
              <div class="director-title-upper">${t.directorHeader}</div>
              <div class="director-sub-italic">${t.directorSub}</div>
              <div class="director-name">${directorName}</div>
              <div class="director-role">${directorTitle}</div>
            </div>
          </div>
        </div>

        <!-- Bas intérieur : QR Code sobre (sans texte ni URL) + N° D'ORDRE + Date -->
        <div class="bottom-inside">
          <div class="order-and-date">
            <div class="qr-only">
              <img src="${qrUrl}" alt="${cert.certificateCode}" />
            </div>
            <div class="order-line">
              <span class="form-label">${t.orderNo}</span>
              <span class="order-code">${cert.certificateCode}</span>
              <span class="date-field">${cityIssued}</span>
              <span>, ${t.issuedConnector}</span>
              <span class="date-field">${cert.issuedAt}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="outer-ref">
      RÉF. ${cert.certificateCode} &nbsp;·&nbsp; ${site.site_name.toUpperCase()} &nbsp;·&nbsp; ${site.contact_address} &nbsp;·&nbsp; ${cleanWebsite}
    </div>
  </div>
</body>
</html>`;

  const win = window.open('', '_blank', 'width=1160,height=840');
  if (win) {
    win.document.open();
    win.document.write(html);
    win.document.close();
  }
}
