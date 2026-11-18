import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './StudentPortalPage.css';
import { API_ENDPOINTS } from '../config/api';
import { useLanguage, type Language } from '../i18n/LanguageContext';

type TabKey =
  | 'overview'
  | 'profile'
  | 'journey'
  | 'payments'
  | 'courses'
  | 'visa'
  | 'requests'
  | 'refund';

interface EnrollmentInfo {
  id: number;
  level_id?: number;
  level_name: string;
  study_mode: string;
  total_price?: number;
  split_total_price?: number;
  currency?: string;
  target_university?: string;
  city_name: string;
  city_state: string;
  status: string;
  status_reason?: string;
  rhythm: string;
  enrolled_at?: string;
  installments?: Array<{
    id: number | null;
    installment_no: number;
    due_date?: string | null;
    amount: number;
    currency: string;
    status: string;
    paid_at?: string | null;
  }>;
}

interface StudentUser {
  id: number;
  email: string;
  role: string;
  status: string;
  profile?: {
    first_name?: string;
    last_name?: string;
    phone?: string;
    country_code?: string;
  };
  enrollments?: EnrollmentInfo[];
  visa_applications?: Array<{
    id: number;
    status: string;
    visa_outcome: string;
  }>;
}

const portalI18n: Record<Language, Record<string, string>> = {
  fr: {
    badgePortal: 'Espace Étudiant',
    menuOverview: 'Mon Espace',
    menuProfile: 'Mes Informations',
    menuJourney: 'Mon Parcours (6 étapes)',
    menuPayments: 'Mes Paiements & Échéances',
    menuCourses: 'Mes Cours & Assiduité',
    menuVisa: 'Visa & Documents',
    menuRequests: 'Mes Demandes',
    menuRefund: 'Garantie & Remboursement',
    mobileProfile: 'Mes Infos',
    mobileJourney: 'Parcours',
    mobilePayments: 'Paiements',
    mobileCourses: 'Cours',
    mobileVisa: 'Visa',
    mobileRequests: 'Demandes',
    mobileRefund: 'Garantie 85%',
    logout: 'Déconnexion',
    topOverview: 'Mon Espace — Tableau de bord',
    topProfile: 'Mes Informations d’Inscription',
    topJourney: 'Mon Parcours Étudiant (Les 6 Étapes)',
    topPayments: 'Mes Paiements & Suivi des Échéances',
    topCourses: 'Mes Cours & Contrôle d’Assiduité',
    topVisa: 'Démarches Visa VITEM IV & Documents Officiels',
    topRequests: 'Mes Demandes à l’Administration',
    topRefund: 'Garantie Contractuelle de Remboursement (85%)',
    candidacyTag: 'Candidature 2026-2027',
    publicSite: 'Site Public',
    defaultLevel: 'Niveau A1 — Débutant',
    modeRemote: 'En ligne (Depuis votre pays)',
    modeBrazil: 'Présentiel au Brésil (Visa VITEM IV)',
    rhythmEvening: 'Cours du soir',
    rhythmDay: 'Cours de jour (Matin / Après-midi)',
    actionTitle: 'Prochaine action requise : Règlement de la 1ère tranche (Niveau A1)',
    actionDesc:
      "Votre dossier d'inscription a été vérifié par l'école. Réglez votre première tranche mensuelle (ou le montant comptant) pour générer votre attestation d'inscription officielle sous 48h ouvrées.",
    actionBtn: 'Régler la 1ère tranche',
    cardProgramCaption: 'Formation & Ville',
    hostCityPrefix: "Ville d'accueil :",
    cardStatusCaption: "Statut de l'inscription",
    cardStatusTitle: 'Validé & Enregistré',
    cardGuaranteeCaption: 'Garantie Contractuelle',
    cardGuaranteeTitle: '85% Remboursé',
    cardGuaranteeSub: 'Protection écrite en cas de refus consulaire',
    journeyHeader: 'Les 6 Étapes Officielles de votre Parcours Étudiant',
    journeyStep2Active: 'Étape 2 en cours',
    step1Title: '1. Inscription',
    step1Desc: 'Dossier reçu & validé',
    step2Title: '2. Paiement A1',
    step2Desc: '1 tranche ou 3 fois',
    step3Title: '3. Cours & Assiduité',
    step3Desc: "Limite 4h d'absences",
    step4Title: '4. Examens & Moyenne',
    step4Desc: 'Validation A1 (14/20)',
    step5Title: '5. Choix Niveau A2',
    step5Desc: 'Brésil ou à distance',
    step6Title: '6. Règlement & Visa',
    step6Desc: 'Consulat & Garantie 85%',
    academicFileTitle: 'Informations du Dossier Académique',
    propHolder: 'Étudiant titulaire',
    propStudentId: 'Identifiant étudiant',
    propEmail: 'Adresse e-mail',
    propPhone: 'Téléphone enregistré',
    propLevel: 'Niveau de formation',
    propMode: "Modalité d'études",
    propHostCity: "Ville d'accueil au Brésil",
    propRhythm: 'Rythme des cours',
    propDiploma: 'Diplôme national visé',
    valDiploma: "Certificat d'État CELPE-Bras (MEC)",
    docsTitle: 'Documents Officiels & Attestations',
    doc1Title: "Attestation d'Inscription Provisoire",
    doc1Sub: 'Délivrée sous 48h ouvrées après 1er versement',
    doc1Badge: 'En attente de paiement',
    doc2Title: 'Contrat & Garantie 85% de Remboursement',
    doc2Sub: 'Clause légale de protection visa',
    doc3Title: 'Fiche de Candidature Officielle',
    doc4Title: "Guide d'Installation & Visa au Brésil",
    doc4Sub: 'Démarches VITEM IV, logement & CPF',
    download: 'Télécharger',
    consult: 'Consulter',
    profileTitle: "Mes Informations Personnelles et Projet d'Avenir",
    profileRule:
      "Règle de l'école : Les informations d'état civil et de candidature sont verrouillées en lecture seule après enregistrement pour garantir la conformité avec votre passeport et vos futures démarches de visa. Pour solliciter une modification, veuillez ouvrir une requête dans l'onglet Mes Demandes.",
    propFirstName: 'Prénom',
    propLastName: 'Nom de famille',
    propCountryIso: "Pays d'origine (Code ISO)",
    propFutureProject: "Projet d'avenir déclaré",
    valFutureProject: 'Études supérieures et mobilité universitaire au Brésil',
    propRegDate: "Date d'enregistrement",
    journeyTabTitle: 'Parcours Pédagogique & Administratif en 6 Étapes',
    journeyTabLead: "Ce parcours reprend intégralement les règles de l'école. Chaque étape valide le passage vers la suivante.",
    j1Title: 'Étape 1 : Inscription Initiale',
    j1Tag: 'Validée',
    j1Desc: "Création du compte, projet d'avenir renseigné, choix du lieu d'étude et de la ville d'accueil.",
    j2Title: 'Étape 2 : Premier Paiement (Niveau A1)',
    j2Tag: 'En cours de règlement',
    j2Desc:
      "Paiement par carte Visa ou par virement bancaire. Choix entre paiement comptant ou en 3 tranches mensuelles. Dès réception, l'attestation officielle est générée.",
    j3Title: "Étape 3 : Début des Cours & Contrôle d'Assiduité",
    j3Tag: 'Après paiement',
    j3Desc:
      "Intégration de la liste des professeurs. Règle stricte des absences : limite de 4 heures d'absence autorisées. En cas de dépassement, l'étudiant est déclaré en état d'échec.",
    j4Title: 'Étape 4 : Examens en Classe & Validation du A1',
    j4Tag: 'Étape suivante',
    j4Desc:
      "Examens réguliers. Moyenne minimale de réussite fixée par l'administration (14/20 requise) pour valider le niveau et passer au niveau supérieur.",
    j5Title: 'Étape 5 : Réinscription et Choix du Niveau A2',
    j5Tag: 'À venir',
    j5Desc:
      "Suite normale du cursus en présentiel au Brésil, ou en ligne à distance si l'étudiant n'a pas les moyens de voyager.",
    j6Title: 'Étape 6 : Règlement Final & Procédure de Visa',
    j6Tag: 'Étape finale',
    j6Desc:
      "Délivrance de l'ensemble des pièces consulaires pour le Visa VITEM IV. Garantie contractuelle de remboursement de 85% de la somme versée en cas de refus consulaire.",
    payTabTitle: 'Plan de Règlement & Suivi des Échéances (Stripe & Virement)',
    payModeLabel: 'Choisissez votre mode de règlement :',
    payModeFullTitle: 'Payer la totalité (Comptant — 1 seule fois)',
    payModeFullSub: 'Règlement intégral du niveau en un seul versement • Attestation immédiate',
    payModeSplitTitle: 'Payer en partie (Échelonné en 3 tranches)',
    payModeSplitSub: '1ère tranche maintenant, puis 2 mensualités sur les mois suivants',
    fullCardTitle: 'Règlement Intégral (100% de la Scolarité)',
    fullCardBadge: 'Paiement unique',
    fullCardDue: 'Validation complète du niveau sans échéance mensuelle',
    fullCardDesc:
      "En réglant la totalité en une seule fois, vous êtes définitivement inscrit sur la liste des cours sans risque de suspension mensuelle et votre attestation officielle est délivrée sous 48h.",
    stripeFullBtn: 'Payer la totalité (500,00 €) par Carte (Stripe)',
    payWarning:
      "Règle d'exclusion automatique : Conformément au règlement de l'école, si la mensualité du mois suivant n'est pas réglée à la date d'échéance, le nom de l'étudiant est immédiatement retiré de la liste transmise aux enseignants jusqu'à régularisation.",
    inst1Title: 'Tranche 1 (Mois 1)',
    inst1Badge: 'À régler',
    inst1Due: 'Échéance : Immédiate (Validation)',
    inst1Desc: "Déclenche l'édition sous 48h de votre attestation officielle d'inscription.",
    stripeBtn: 'Payer 170,00 € par Carte (Stripe)',
    stripeLoading: 'Connexion à Stripe...',
    inst2Title: 'Tranche 2 (Mois 2)',
    inst2Due: 'Échéance : +30 jours après rentrée',
    inst2Desc: "Maintien de l'inscription sur la liste des cours des enseignants.",
    inst3Title: 'Tranche 3 (Mois 3)',
    inst3Due: 'Échéance : +60 jours après rentrée',
    inst3Desc: 'Solde final de la formation Niveau A1.',
    wireTitle: 'Option de Règlement par Virement Bancaire',
    wireDesc:
      "Si vous effectuez un virement bancaire sur le compte officiel de l'école (IBAN transmis par e-mail), veuillez renseigner votre référence de virement bancaire pour confirmation manuelle par l'administrateur.",
    coursesTabTitle: 'Suivi Pédagogique, Assiduité & Examens',
    attCaption: "Compteur d'Assiduité",
    attVal: "0h d'absence",
    attSub: "Limite autorisée par l'admin : 4h max",
    avgCaption: 'Moyenne Générale',
    avgSub: 'Seuil de réussite fixé à 14/20',
    campusCaption: 'Campus / Ville',
    coursesWarning:
      "Règle d'état d'échec pour absence : L'étudiant est informé dès le départ que le dépassement de la limite d'absence (4 heures) entraîne automatiquement le passage en état d'échec, conformément au règlement pédagogique défini par l'administrateur.",
    visaTabTitle: 'Dossier Consulaire Visa VITEM IV & Pièces Délivrées',
    visaInfo:
      "Pour votre demande de Visa d'études (VITEM IV) auprès de la section consulaire de l'Ambassade du Brésil, l'école Brasil·É délivre l'ensemble des attestations officielles requises dès confirmation du premier règlement.",
    reqTabTitle: "Mes Demandes à l'Administration",
    reqInfo:
      "Toutes vos demandes spécifiques (demande d'admission dérogatoire au niveau A1 au Brésil, changement de ville d'accueil en cours d'année, réclamation administrative) se font directement ici via un fil d'échange officiel avec l'école.",
    reqItemTitle: 'Demande N° DEM-2026-0045 : Validation initiale de dossier',
    reqItemSub: 'Créée le 05/11/2026 • Réponse du secrétariat : Dossier conforme',
    reqItemTag: 'Traité & Conforme',
    refundTabTitle: 'Garantie Contractuelle de Remboursement (85%)',
    refundInfo:
      "Principe fondateur de l'école : En cas de refus de visa par les autorités consulaires brésiliennes (motif justifié par le document officiel du Consulat), l'école Brasil·É rembourse 85% de la somme totale versée.",
    refPropRate: 'Taux contractuel de remboursement',
    refValRate: '85 % de la somme versée',
    refPropReason: 'Motif éligible',
    refValReason: 'Refus officiel de visa délivré par le Consulat du Brésil',
    refPropDoc: 'Pièce justificative requise',
    refValDoc: 'Notification officielle de refus du visa VITEM IV',
    refPropDelay: 'Délai de traitement',
    refValDelay: "Sous 15 jours ouvrés après examen par l'administration",
  },
  en: {
    badgePortal: 'Student Portal',
    menuOverview: 'Dashboard',
    menuProfile: 'My Information',
    menuJourney: 'My Journey (6 steps)',
    menuPayments: 'Payments & Schedule',
    menuCourses: 'Classes & Attendance',
    menuVisa: 'Visa & Documents',
    menuRequests: 'My Requests',
    menuRefund: '85% Refund Guarantee',
    mobileProfile: 'Profile',
    mobileJourney: 'Journey',
    mobilePayments: 'Payments',
    mobileCourses: 'Classes',
    mobileVisa: 'Visa',
    mobileRequests: 'Requests',
    mobileRefund: '85% Guarantee',
    logout: 'Sign Out',
    topOverview: 'Student Portal — Dashboard',
    topProfile: 'My Enrollment Information',
    topJourney: 'My Student Journey (6 Official Steps)',
    topPayments: 'My Payments & Installment Schedule',
    topCourses: 'My Classes & Attendance Tracking',
    topVisa: 'VITEM IV Visa Process & Official Documents',
    topRequests: 'My Requests to the Academic Office',
    topRefund: 'Contractual Refund Guarantee (85%)',
    candidacyTag: '2026-2027 Application',
    publicSite: 'Public Website',
    defaultLevel: 'Level A1 — Beginner',
    modeRemote: 'Online (From your home country)',
    modeBrazil: 'In-Person in Brazil (VITEM IV Visa)',
    rhythmEvening: 'Evening classes',
    rhythmDay: 'Daytime classes (Morning / Afternoon)',
    actionTitle: 'Next required action: Pay 1st installment (Level A1)',
    actionDesc:
      'Your enrollment file has been verified by the school. Pay your first monthly installment (or full tuition) to generate your official enrollment certificate within 48 business hours.',
    actionBtn: 'Pay 1st Installment',
    cardProgramCaption: 'Program & City',
    hostCityPrefix: 'Host city:',
    cardStatusCaption: 'Enrollment Status',
    cardStatusTitle: 'Verified & Registered',
    cardGuaranteeCaption: 'Contractual Guarantee',
    cardGuaranteeTitle: '85% Refunded',
    cardGuaranteeSub: 'Written protection in case of consulate refusal',
    journeyHeader: 'The 6 Official Steps of Your Student Journey',
    journeyStep2Active: 'Step 2 in progress',
    step1Title: '1. Registration',
    step1Desc: 'File received & verified',
    step2Title: '2. A1 Payment',
    step2Desc: '1 payment or 3 installments',
    step3Title: '3. Classes & Attendance',
    step3Desc: 'Max 4h absence limit',
    step4Title: '4. Exams & Grade',
    step4Desc: 'A1 validation (14/20)',
    step5Title: '5. Level A2 Choice',
    step5Desc: 'In Brazil or remote',
    step6Title: '6. Final Payment & Visa',
    step6Desc: 'Consulate & 85% Guarantee',
    academicFileTitle: 'Academic File Information',
    propHolder: 'Enrolled Student',
    propStudentId: 'Student ID',
    propEmail: 'Email address',
    propPhone: 'Registered phone',
    propLevel: 'Training level',
    propMode: 'Study mode',
    propHostCity: 'Host city in Brazil',
    propRhythm: 'Class schedule',
    propDiploma: 'Target national diploma',
    valDiploma: 'Official CELPE-Bras State Certificate (MEC)',
    docsTitle: 'Official Documents & Certificates',
    doc1Title: 'Provisional Enrollment Certificate',
    doc1Sub: 'Issued within 48 business hours after 1st payment',
    doc1Badge: 'Awaiting payment',
    doc2Title: 'Contract & 85% Refund Guarantee',
    doc2Sub: 'Legal visa protection clause',
    doc3Title: 'Official Application Summary',
    doc4Title: 'Brazil Settlement & Visa Guide',
    doc4Sub: 'VITEM IV visa steps, housing & CPF',
    download: 'Download',
    consult: 'View',
    profileTitle: 'My Personal Information & Future Study Plan',
    profileRule:
      'School Policy: Personal and enrollment information is locked as read-only after registration to ensure compliance with your passport and visa application. To request changes, please open a ticket under My Requests.',
    propFirstName: 'First Name',
    propLastName: 'Last Name',
    propCountryIso: 'Country of origin (ISO Code)',
    propFutureProject: 'Declared future goal',
    valFutureProject: 'Higher education and university mobility in Brazil',
    propRegDate: 'Registration date',
    journeyTabTitle: '6-Step Academic & Administrative Pathway',
    journeyTabLead: 'This pathway reflects the official school regulations. Each step unlocks the next.',
    j1Title: 'Step 1: Initial Application',
    j1Tag: 'Completed',
    j1Desc: 'Account created, future study plan submitted, choice of study mode and host city.',
    j2Title: 'Step 2: First Tuition Payment (Level A1)',
    j2Tag: 'Awaiting payment',
    j2Desc:
      'Payment by card (Stripe) or bank wire. Choose between full payment or 3 monthly installments. Once received, your official certificate is issued within 48h.',
    j3Title: 'Step 3: Start of Classes & Attendance Tracking',
    j3Tag: 'After payment',
    j3Desc:
      'Added to teacher class rosters. Strict attendance policy: maximum 4 hours of unexcused absence allowed.',
    j4Title: 'Step 4: Class Exams & Level A1 Validation',
    j4Tag: 'Next step',
    j4Desc:
      'Regular assessments. Minimum passing grade set by the administration (14/20 required) to advance to the next level.',
    j5Title: 'Step 5: Re-enrollment & Level A2 Selection',
    j5Tag: 'Upcoming',
    j5Desc:
      'Continue your studies in-person in Brazil, or remotely online if you prefer.',
    j6Title: 'Step 6: Final Settlement & Visa Process',
    j6Tag: 'Final step',
    j6Desc:
      'Issuance of all consulate documents for the VITEM IV Visa. Contractual 85% refund guarantee in case of visa denial.',
    payTabTitle: 'Payment Plan & Installment Schedule (Stripe & Bank Wire)',
    payModeLabel: 'Choose your payment option:',
    payModeFullTitle: 'Pay in Full (Single lump-sum payment)',
    payModeFullSub: 'Full level tuition in one payment • Immediate certificate issuance',
    payModeSplitTitle: 'Pay in Installments (3 monthly payments)',
    payModeSplitSub: '1st installment now, followed by 2 monthly payments',
    fullCardTitle: 'Full Tuition Payment (100% of Level)',
    fullCardBadge: 'Single payment',
    fullCardDue: 'Complete level validation with no monthly due dates',
    fullCardDesc:
      'By paying the full tuition at once, your enrollment on class rosters is permanently secured with no monthly suspension risk, and your official certificate is issued within 48h.',
    stripeFullBtn: 'Pay Full Amount (€500.00) by Card (Stripe)',
    payWarning:
      'Automatic suspension rule: In accordance with school regulations, if the next monthly installment is not paid by the due date, the student is temporarily removed from teacher rosters until settled.',
    inst1Title: 'Installment 1 (Month 1)',
    inst1Badge: 'Due now',
    inst1Due: 'Due: Immediately (Upon validation)',
    inst1Desc: 'Triggers the issuance of your official enrollment certificate within 48h.',
    stripeBtn: 'Pay €170.00 by Card (Stripe)',
    stripeLoading: 'Connecting to Stripe...',
    inst2Title: 'Installment 2 (Month 2)',
    inst2Due: 'Due: +30 days after start',
    inst2Desc: 'Maintains active enrollment on teacher class rosters.',
    inst3Title: 'Installment 3 (Month 3)',
    inst3Due: 'Due: +60 days after start',
    inst3Desc: 'Final balance for Level A1 tuition.',
    wireTitle: 'Bank Wire Transfer Option',
    wireDesc:
      'If you make a bank wire transfer to the official school account (IBAN sent by email), please submit your transfer reference for manual confirmation by the administrator.',
    coursesTabTitle: 'Academic Tracking, Attendance & Exams',
    attCaption: 'Attendance Counter',
    attVal: '0h absence',
    attSub: 'Maximum limit allowed: 4h max',
    avgCaption: 'Overall Average',
    avgSub: 'Passing grade threshold: 14/20',
    campusCaption: 'Campus / City',
    coursesWarning:
      'Attendance failure rule: Exceeding the 4-hour absence limit automatically places the student in failure status in accordance with academic rules.',
    visaTabTitle: 'VITEM IV Consulate File & Issued Documents',
    visaInfo:
      'For your student visa application (VITEM IV) at the Brazilian Embassy, Brasil·É issues all required official certificates upon confirmation of your first payment.',
    reqTabTitle: 'My Requests to the Administration',
    reqInfo:
      'All specific requests (special Level A1 admission in Brazil, host city change, administrative inquiry) can be tracked here with the academic office.',
    reqItemTitle: 'Request #DEM-2026-0045: Initial file validation',
    reqItemSub: 'Created on 05/11/2026 • Academic office reply: File approved',
    reqItemTag: 'Processed & Approved',
    refundTabTitle: 'Contractual Refund Guarantee (85%)',
    refundInfo:
      'Founding school principle: In case of visa refusal by Brazilian consular authorities (supported by the official consulate refusal notice), Brasil·É refunds 85% of the total amount paid.',
    refPropRate: 'Contractual refund rate',
    refValRate: '85% of paid tuition fees',
    refPropReason: 'Eligible reason',
    refValReason: 'Official visa refusal issued by the Consulate of Brazil',
    refPropDoc: 'Required supporting document',
    refValDoc: 'Official VITEM IV visa refusal notification',
    refPropDelay: 'Processing time',
    refValDelay: 'Within 15 business days after verification',
  },
  pt: {
    badgePortal: 'Portal do Estudante',
    menuOverview: 'Meu Painel',
    menuProfile: 'Meus Dados',
    menuJourney: 'Meu Percurso (6 etapas)',
    menuPayments: 'Pagamentos & Parcelas',
    menuCourses: 'Aulas & Frequência',
    menuVisa: 'Visto & Documentos',
    menuRequests: 'Minhas Solicitações',
    menuRefund: 'Garantia & Reembolso',
    mobileProfile: 'Dados',
    mobileJourney: 'Percurso',
    mobilePayments: 'Pagamentos',
    mobileCourses: 'Aulas',
    mobileVisa: 'Visto',
    mobileRequests: 'Solicitações',
    mobileRefund: 'Garantia 85%',
    logout: 'Sair',
    topOverview: 'Portal do Estudante — Painel Geral',
    topProfile: 'Meus Dados de Matrícula',
    topJourney: 'Meu Percurso Estudantil (As 6 Etapas)',
    topPayments: 'Meus Pagamentos & Controle de Parcelas',
    topCourses: 'Minhas Aulas & Controle de Frequência',
    topVisa: 'Processo de Visto VITEM IV & Documentos Oficiais',
    topRequests: 'Minhas Solicitações à Secretaria',
    topRefund: 'Garantia Contratual de Reembolso (85%)',
    candidacyTag: 'Candidatura 2026-2027',
    publicSite: 'Site Público',
    defaultLevel: 'Nível A1 — Iniciante',
    modeRemote: 'Online (A partir do seu país)',
    modeBrazil: 'Presencial no Brasil (Visto VITEM IV)',
    rhythmEvening: 'Aulas noturnas',
    rhythmDay: 'Aulas diurnas (Manhã / Tarde)',
    actionTitle: 'Próxima ação necessária: Pagamento da 1ª parcela (Nível A1)',
    actionDesc:
      'Seu processo de inscrição foi validado pela escola. Realize o pagamento da primeira parcela mensal (ou valor à vista) para emitir sua declaração oficial de matrícula.',
    actionBtn: 'Pagar 1ª parcela',
    cardProgramCaption: 'Formação & Cidade',
    hostCityPrefix: 'Cidade de destino:',
    cardStatusCaption: 'Status da matrícula',
    cardStatusTitle: 'Validado & Registrado',
    cardGuaranteeCaption: 'Garantia Contratual',
    cardGuaranteeTitle: '85% Reembolsado',
    cardGuaranteeSub: 'Proteção contratual em caso de recusa consular',
    journeyHeader: 'As 6 Etapas Oficiais do seu Percurso Estudantil',
    journeyStep2Active: 'Etapa 2 em andamento',
    step1Title: '1. Inscrição',
    step1Desc: 'Processo recebido & validado',
    step2Title: '2. Pagamento A1',
    step2Desc: 'À vista ou em 3x',
    step3Title: '3. Aulas & Frequência',
    step3Desc: 'Limite de 4h de faltas',
    step4Title: '4. Provas & Média',
    step4Desc: 'Aprovação A1 (14/20)',
    step5Title: '5. Escolha Nível A2',
    step5Desc: 'No Brasil ou online',
    step6Title: '6. Quitação & Visto',
    step6Desc: 'Consulado & Garantia 85%',
    academicFileTitle: 'Informações do Processo Acadêmico',
    propHolder: 'Estudante titular',
    propStudentId: 'Código do estudante',
    propEmail: 'Endereço de e-mail',
    propPhone: 'Telefone cadastrado',
    propLevel: 'Nível de formação',
    propMode: 'Modalidade de estudos',
    propHostCity: 'Cidade de destino no Brasil',
    propRhythm: 'Turno das aulas',
    propDiploma: 'Certificado nacional visado',
    valDiploma: 'Certificado Oficial CELPE-Bras (MEC)',
    docsTitle: 'Documentos Oficiais & Declarações',
    doc1Title: 'Declaração Provisória de Matrícula',
    doc1Sub: 'Emitida em até 48h úteis após o 1º pagamento',
    doc1Badge: 'Aguardando pagamento',
    doc2Title: 'Contrato & Garantia de 85% de Reembolso',
    doc2Sub: 'Cláusula legal de proteção de visto',
    doc3Title: 'Ficha Oficial de Candidatura',
    doc4Title: 'Guia de Instalação & Visto no Brasil',
    doc4Sub: 'Trâmites VITEM IV, moradia & CPF',
    download: 'Baixar',
    consult: 'Consultar',
    profileTitle: 'Meus Dados Pessoais e Projeto de Futuro',
    profileRule:
      'Regra da escola: Os dados pessoais e de candidatura ficam protegidos em modo somente leitura após o registro para garantir conformidade com seu passaporte e processo de visto. Para solicitar alterações, abra um chamado na aba Minhas Solicitações.',
    propFirstName: 'Nome',
    propLastName: 'Sobrenome',
    propCountryIso: 'País de origem (Código ISO)',
    propFutureProject: 'Projeto de futuro declarado',
    valFutureProject: 'Ensino superior e mobilidade universitária no Brasil',
    propRegDate: 'Data de registro',
    journeyTabTitle: 'Percurso Pedagógico & Administrativo em 6 Etapas',
    journeyTabLead: 'Este percurso segue integralmente o regulamento da escola. Cada etapa valida a passagem para a seguinte.',
    j1Title: 'Etapa 1: Inscrição Inicial',
    j1Tag: 'Validada',
    j1Desc: 'Criação da conta, projeto de futuro informado, escolha da modalidade e cidade de destino.',
    j2Title: 'Etapa 2: Primeiro Pagamento (Nível A1)',
    j2Tag: 'Em aberto',
    j2Desc:
      'Pagamento por cartão (Stripe) ou transferência bancária. Opção à vista ou em 3 parcelas mensais. Após confirmação, a declaração oficial é gerada em até 48h.',
    j3Title: 'Etapa 3: Início das Aulas & Controle de Frequência',
    j3Tag: 'Após pagamento',
    j3Desc:
      'Inclusão na lista de chamada dos professores. Regra rigorosa de presença: limite máximo de 4 horas de faltas.',
    j4Title: 'Etapa 4: Avaliações & Validação do Nível A1',
    j4Tag: 'Próxima etapa',
    j4Desc:
      'Provas regulares. Média mínima de aprovação exigida pela coordenação (14/20) para avançar ao próximo nível.',
    j5Title: 'Etapa 5: Rematrícula e Escolha do Nível A2',
    j5Tag: 'Futuro',
    j5Desc:
      'Continuidade do curso presencialmente no Brasil ou online à distância.',
    j6Title: 'Etapa 6: Quitação Final & Processo de Visto',
    j6Tag: 'Etapa final',
    j6Desc:
      'Emissão de toda a documentação consular para o Visto VITEM IV. Garantia contratual de reembolso de 85% em caso de recusa consular.',
    payTabTitle: 'Plano de Pagamento & Controle de Parcelas (Stripe & Transferência)',
    payModeLabel: 'Escolha sua forma de pagamento:',
    payModeFullTitle: 'Pagar o valor total (À vista — parcela única)',
    payModeFullSub: 'Quitação integral do nível de uma só vez • Declaração imediata',
    payModeSplitTitle: 'Pagar parcelado (Em 3 parcelas mensais)',
    payModeSplitSub: '1ª parcela agora e 2 mensalidades nos meses seguintes',
    fullCardTitle: 'Pagamento Integral (100% do Curso)',
    fullCardBadge: 'Parcela única',
    fullCardDue: 'Validação completa do nível sem mensalidades futuras',
    fullCardDesc:
      'Ao quitar o valor total de uma só vez, sua matrícula fica garantida durante todo o nível sem risco de suspensão mensal e sua declaração oficial é emitida em até 48h.',
    stripeFullBtn: 'Pagar Valor Total (500,00 €) com Cartão (Stripe)',
    payWarning:
      'Regra de suspensão automática: Conforme o regulamento escolar, caso a parcela mensal seguinte não seja quitada até o vencimento, o nome do estudante é temporariamente retirado da lista de presença até a regularização.',
    inst1Title: 'Parcela 1 (Mês 1)',
    inst1Badge: 'A pagar',
    inst1Due: 'Vencimento: Imediato (Validação)',
    inst1Desc: 'Libera a emissão em até 48hda sua declaração oficial de matrícula.',
    stripeBtn: 'Pagar 170,00 € com Cartão (Stripe)',
    stripeLoading: 'Conectando ao Stripe...',
    inst2Title: 'Parcela 2 (Mês 2)',
    inst2Due: 'Vencimento: +30 dias após início',
    inst2Desc: 'Manutenção da matrícula ativa na lista dos professores.',
    inst3Title: 'Parcela 3 (Mês 3)',
    inst3Due: 'Vencimento: +60 dias após início',
    inst3Desc: 'Saldo final da formação Nível A1.',
    wireTitle: 'Opção de Pagamento por Transferência Bancária',
    wireDesc:
      'Caso realize transferência bancária para a conta oficial da escola (IBAN enviado por e-mail), informe o comprovante para confirmação manual pela administração.',
    coursesTabTitle: 'Acompanhamento Pedagógico, Frequência & Avaliações',
    attCaption: 'Contador de Frequência',
    attVal: '0h de falta',
    attSub: 'Limite máximo permitido: 4h',
    avgCaption: 'Média Geral',
    avgSub: 'Média mínima de aprovação: 14/20',
    campusCaption: 'Campus / Cidade',
    coursesWarning:
      'Regra de reprovação por faltas: O estudante é informado desde o início que ultrapassar o limite de 4 horas de faltas implica reprovação automática por frequência.',
    visaTabTitle: 'Processo Consular Visto VITEM IV & Documentos Emitidos',
    visaInfo:
      'Para sua solicitação de Visto de Estudante (VITEM IV) junto à Embaixada do Brasil, a Brasil·É emite todas as declarações oficiais necessárias após a confirmação do primeiro pagamento.',
    reqTabTitle: 'Minhas Solicitações à Administração',
    reqInfo:
      'Todas as solicitações específicas (pedido de admissão presencial no nível A1 no Brasil, mudança de cidade, atendimento administrativo) são acompanhadas diretamente aqui.',
    reqItemTitle: 'Solicitação Nº DEM-2026-0045: Validação inicial de matrícula',
    reqItemSub: 'Criada em 05/11/2026 • Resposta da secretaria: Processo aprovado',
    reqItemTag: 'Concluído & Aprovado',
    refundTabTitle: 'Garantia Contratual de Reembolso (85%)',
    refundInfo:
      'Princípio fundador da escola: Em caso de recusa de visto pelas autoridades consulares brasileiras (comprovada pelo documento oficial do Consulado), a Brasil·É reembolsa 85% do valor total pago.',
    refPropRate: 'Taxa contratual de reembolso',
    refValRate: '85% do valor pago',
    refPropReason: 'Motivo elegível',
    refValReason: 'Recusa oficial de visto emitida pelo Consulado do Brasil',
    refPropDoc: 'Documento comprobatório exigido',
    refValDoc: 'Notificação oficial de recusa do visto VITEM IV',
    refPropDelay: 'Prazo de processamento',
    refValDelay: 'Em até 15 dias úteis após análise da administração',
  },
};

export const StudentPortalPage: React.FC = () => {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const pt = portalI18n[lang];

  const [user, setUser] = useState<StudentUser | null>(null);
  const [adminOfferPrice, setAdminOfferPrice] = useState<{ total: number; currency: string } | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [paymentPlanChoice, setPaymentPlanChoice] = useState<'full' | 'installments'>('installments');
  const [isProcessingStripe, setIsProcessingStripe] = useState(false);
  const [stripeSuccessMsg, setStripeSuccessMsg] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('student_token');
    const storedUserJson = localStorage.getItem('student_user');

    if (!token && !storedUserJson) {
      navigate('/connexion');
      return;
    }

    if (storedUserJson) {
      try {
        setUser(JSON.parse(storedUserJson));
      } catch {
        // fallback
      }
    }

    const params = new URLSearchParams(window.location.search);
    if (params.get('payment') === 'success' && params.get('session_id') && token) {
      const sessionId = params.get('session_id')!;
      fetch(API_ENDPOINTS.stripeVerify, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ session_id: sessionId }),
      })
        .then((res) => res.json())
        .then(() => {
          setStripeSuccessMsg('Stripe OK');
        })
        .catch(() => {});
    } else if (params.get('payment') === 'simulation') {
      setStripeSuccessMsg('Stripe OK');
    }

    if (token) {
      fetch(`${API_ENDPOINTS.me}?lang=${lang}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((payload) => {
          if (payload?.data) {
            setUser(payload.data);
            localStorage.setItem('student_user', JSON.stringify(payload.data));
          }
        })
        .catch(() => {});
    }

    // Récupérer en direct les tarifs définis par l'admin dans Filament (Tarifs & Scolarités)
    fetch(`${API_ENDPOINTS.academicLevels}?lang=${lang}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((payload) => {
        if (payload?.data && Array.isArray(payload.data) && payload.data.length > 0) {
          const firstLevel = payload.data[0];
          const offers = firstLevel?.offers || [];
          const inPersonOffer = offers.find((o: any) => o.study_mode === 'in_person_brazil') || offers[0];
          if (inPersonOffer && Number(inPersonOffer.base_price) > 0) {
            setAdminOfferPrice({
              total: Number(inPersonOffer.base_price),
              currency: inPersonOffer.currency || 'EUR',
            });
          }
        }
      })
      .catch(() => {});
  }, [navigate, lang]);

  const handleLogout = () => {
    localStorage.removeItem('student_token');
    localStorage.removeItem('student_user');
    navigate('/connexion');
  };

  const handleStripePayment = async (amount: number, description: string, currency = 'EUR') => {
    setIsProcessingStripe(true);
    const token = localStorage.getItem('student_token');
    try {
      const res = await fetch(API_ENDPOINTS.stripeCheckout, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          enrollment_id: latestEnrollment?.id || 85,
          amount: amount,
          currency: currency,
          description: description,
        }),
      });

      const data = await res.json();
      if (data?.data?.checkout_url) {
        window.location.href = data.data.checkout_url;
      } else {
        alert(data?.message || 'Stripe error');
      }
    } catch {
      alert('Stripe error');
    } finally {
      setIsProcessingStripe(false);
    }
  };

  const firstName = user?.profile?.first_name || 'Komi';
  const lastName = user?.profile?.last_name || 'Lakimi';
  const fullName = `${firstName} ${lastName}`.trim();
  const initials = firstName.charAt(0) + (lastName ? lastName.charAt(0) : '');
  const candidateNumber = `BE-2026-${String(user?.id || 45).padStart(4, '0')}`;

  const latestEnrollment =
    user?.enrollments && user.enrollments.length > 0
      ? user.enrollments[user.enrollments.length - 1]
      : null;

  const formationTitle = latestEnrollment?.level_name || pt.defaultLevel;
  const studyModeLabel =
    latestEnrollment?.study_mode === 'remote_home_country'
      ? pt.modeRemote
      : pt.modeBrazil;
  const cityName = latestEnrollment?.city_name || 'Brasília';
  const cityState = latestEnrollment?.city_state || 'DF';
  const rhythmLabel =
    latestEnrollment?.rhythm === 'evening'
      ? pt.rhythmEvening
      : pt.rhythmDay;

  // Calcul dynamique des montants à partir des tarifs fixés par l'admin dans Filament (Tarifs & Scolarités)
  const currencyCode = latestEnrollment?.currency || adminOfferPrice?.currency || 'EUR';
  const totalPrice =
    (latestEnrollment?.total_price && Number(latestEnrollment.total_price) > 0
      ? Number(latestEnrollment.total_price)
      : adminOfferPrice?.total) || 500;

  const splitTotalPrice =
    (latestEnrollment?.split_total_price && Number(latestEnrollment.split_total_price) > 0
      ? Number(latestEnrollment.split_total_price)
      : totalPrice);

  const rawInstallments = latestEnrollment?.installments || [];
  const defaultInst2 = Math.floor(splitTotalPrice / 3 / 5) * 5 || Math.round((splitTotalPrice / 3) * 100) / 100;
  const defaultInst3 = defaultInst2;
  const defaultInst1 = Math.round((splitTotalPrice - defaultInst2 - defaultInst3) * 100) / 100;

  const inst1Amount = rawInstallments[0]?.amount ? Number(rawInstallments[0].amount) : defaultInst1;
  const inst2Amount = rawInstallments[1]?.amount ? Number(rawInstallments[1].amount) : defaultInst2;
  const inst3Amount = rawInstallments[2]?.amount ? Number(rawInstallments[2].amount) : defaultInst3;

  const formatMoney = (val: number, curr = currencyCode, decimals = true) => {
    if (curr === 'XOF' || curr === 'FCFA') {
      return `${Math.round(val).toLocaleString('fr-FR')} FCFA`;
    }
    const formatted = decimals
      ? val.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : val.toLocaleString('fr-FR', { maximumFractionDigits: 2 });
    return `${formatted} €`;
  };

  const payFullActionText =
    lang === 'en'
      ? `Pay Full Amount (${formatMoney(totalPrice)}) by Card (Stripe)`
      : lang === 'pt'
      ? `Pagar Valor Total (${formatMoney(totalPrice)}) com Cartão (Stripe)`
      : `Payer la totalité (${formatMoney(totalPrice)}) par Carte (Stripe)`;

  const payInst1ActionText =
    lang === 'en'
      ? `Pay ${formatMoney(inst1Amount)} by Card (Stripe)`
      : lang === 'pt'
      ? `Pagar ${formatMoney(inst1Amount)} com Cartão (Stripe)`
      : `Payer ${formatMoney(inst1Amount)} par Carte (Stripe)`;

  return (
    <div className="portal-layout-direct">
      {/* 1. SIDEBAR */}
      <aside className="portal-sidebar-direct">
        <div className="portal-sidebar-header">
          <Link to="/" className="portal-brand-link">
            <span>Brasil</span>
            <span className="dot">·</span>
            <span>É</span>
          </Link>
          <span className="portal-brand-badge">{pt.badgePortal}</span>
        </div>

        <nav className="portal-sidebar-menu">
          <button
            type="button"
            className={`portal-menu-link ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <i className="fa-solid fa-house-chimney"></i>
            <span>{pt.menuOverview}</span>
          </button>

          <button
            type="button"
            className={`portal-menu-link ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <i className="fa-solid fa-id-card-clip"></i>
            <span>{pt.menuProfile}</span>
          </button>

          <button
            type="button"
            className={`portal-menu-link ${activeTab === 'journey' ? 'active' : ''}`}
            onClick={() => setActiveTab('journey')}
          >
            <i className="fa-solid fa-route"></i>
            <span>{pt.menuJourney}</span>
          </button>

          <button
            type="button"
            className={`portal-menu-link ${activeTab === 'payments' ? 'active' : ''}`}
            onClick={() => setActiveTab('payments')}
          >
            <i className="fa-solid fa-credit-card"></i>
            <span>{pt.menuPayments}</span>
          </button>

          <button
            type="button"
            className={`portal-menu-link ${activeTab === 'courses' ? 'active' : ''}`}
            onClick={() => setActiveTab('courses')}
          >
            <i className="fa-solid fa-graduation-cap"></i>
            <span>{pt.menuCourses}</span>
          </button>

          <button
            type="button"
            className={`portal-menu-link ${activeTab === 'visa' ? 'active' : ''}`}
            onClick={() => setActiveTab('visa')}
          >
            <i className="fa-solid fa-passport"></i>
            <span>{pt.menuVisa}</span>
          </button>

          <button
            type="button"
            className={`portal-menu-link ${activeTab === 'requests' ? 'active' : ''}`}
            onClick={() => setActiveTab('requests')}
          >
            <i className="fa-solid fa-comments"></i>
            <span>{pt.menuRequests}</span>
          </button>

          <button
            type="button"
            className={`portal-menu-link ${activeTab === 'refund' ? 'active' : ''}`}
            onClick={() => setActiveTab('refund')}
          >
            <i className="fa-solid fa-shield-halved"></i>
            <span>{pt.menuRefund}</span>
          </button>
        </nav>

        <div className="portal-sidebar-bottom">
          <div className="portal-user-brief">
            <div className="portal-user-brief-info">
              <div className="portal-avatar-letter">
                {initials.toUpperCase() || 'KL'}
              </div>
              <div className="portal-user-brief-text">
                <div className="name">{fullName || 'Komi Lakimi'}</div>
                <div className="ref">{candidateNumber}</div>
              </div>
            </div>
            <button
              type="button"
              className="portal-logout-action"
              onClick={handleLogout}
              title={pt.logout}
              aria-label={pt.logout}
            >
              <i className="fa-solid fa-arrow-right-from-bracket"></i>
            </button>
          </div>
        </div>
      </aside>

      {/* 2. ESPACE CENTRAL */}
      <div className="portal-content-direct">
        <header className="portal-topbar-direct">
          <div className="portal-topbar-title">
            <h1>
              {activeTab === 'overview' && pt.topOverview}
              {activeTab === 'profile' && pt.topProfile}
              {activeTab === 'journey' && pt.topJourney}
              {activeTab === 'payments' && pt.topPayments}
              {activeTab === 'courses' && pt.topCourses}
              {activeTab === 'visa' && pt.topVisa}
              {activeTab === 'requests' && pt.topRequests}
              {activeTab === 'refund' && pt.topRefund}
            </h1>
            <span className="portal-status-tag">
              <i className="fa-solid fa-circle-check"></i>
              <span>{pt.candidacyTag}</span>
            </span>
          </div>

          <div className="portal-topbar-actions">
            <Link to="/" className="portal-site-link">
              <i className="fa-solid fa-house"></i>
              <span>{pt.publicSite}</span>
            </Link>
          </div>
        </header>

        {/* Barre mobile */}
        <div className="portal-mobile-nav-bar">
          <div className="portal-mobile-nav-scroll">
            <button
              type="button"
              className={`portal-mobile-nav-pill ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <i className="fa-solid fa-house"></i>
              <span>{pt.menuOverview}</span>
            </button>
            <button
              type="button"
              className={`portal-mobile-nav-pill ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <i className="fa-solid fa-user"></i>
              <span>{pt.mobileProfile}</span>
            </button>
            <button
              type="button"
              className={`portal-mobile-nav-pill ${activeTab === 'journey' ? 'active' : ''}`}
              onClick={() => setActiveTab('journey')}
            >
              <i className="fa-solid fa-route"></i>
              <span>{pt.mobileJourney}</span>
            </button>
            <button
              type="button"
              className={`portal-mobile-nav-pill ${activeTab === 'payments' ? 'active' : ''}`}
              onClick={() => setActiveTab('payments')}
            >
              <i className="fa-solid fa-credit-card"></i>
              <span>{pt.mobilePayments}</span>
            </button>
            <button
              type="button"
              className={`portal-mobile-nav-pill ${activeTab === 'courses' ? 'active' : ''}`}
              onClick={() => setActiveTab('courses')}
            >
              <i className="fa-solid fa-graduation-cap"></i>
              <span>{pt.mobileCourses}</span>
            </button>
            <button
              type="button"
              className={`portal-mobile-nav-pill ${activeTab === 'visa' ? 'active' : ''}`}
              onClick={() => setActiveTab('visa')}
            >
              <i className="fa-solid fa-passport"></i>
              <span>{pt.mobileVisa}</span>
            </button>
            <button
              type="button"
              className={`portal-mobile-nav-pill ${activeTab === 'requests' ? 'active' : ''}`}
              onClick={() => setActiveTab('requests')}
            >
              <i className="fa-solid fa-comments"></i>
              <span>{pt.mobileRequests}</span>
            </button>
            <button
              type="button"
              className={`portal-mobile-nav-pill ${activeTab === 'refund' ? 'active' : ''}`}
              onClick={() => setActiveTab('refund')}
            >
              <i className="fa-solid fa-shield-halved"></i>
              <span>{pt.mobileRefund}</span>
            </button>
          </div>
        </div>

        <main className="portal-page-body">
          {/* ONGLET 1 : OVERVIEW */}
          {activeTab === 'overview' && (
            <>
              <div className="portal-action-banner">
                <div className="portal-action-content">
                  <i className="fa-solid fa-circle-exclamation portal-action-icon"></i>
                  <div>
                    <div className="portal-action-title">
                      {pt.actionTitle}
                    </div>
                    <div className="portal-action-desc">
                      {pt.actionDesc}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="portal-action-btn"
                  onClick={() => setActiveTab('payments')}
                >
                  <i className="fa-solid fa-credit-card"></i> {pt.actionBtn}
                </button>
              </div>

              <div className="portal-summary-strip">
                <div className="portal-summary-card">
                  <div className="portal-summary-icon blue">
                    <i className="fa-solid fa-book-open"></i>
                  </div>
                  <div className="portal-summary-content">
                    <div className="caption">{pt.cardProgramCaption}</div>
                    <div className="title">{formationTitle}</div>
                    <div className="sub">
                      {pt.hostCityPrefix} {cityName} ({cityState})
                    </div>
                  </div>
                </div>

                <div className="portal-summary-card">
                  <div className="portal-summary-icon green">
                    <i className="fa-solid fa-user-check"></i>
                  </div>
                  <div className="portal-summary-content">
                    <div className="caption">{pt.cardStatusCaption}</div>
                    <div className="title">{pt.cardStatusTitle}</div>
                    <div className="sub">Réf : {candidateNumber}</div>
                  </div>
                </div>

                <div className="portal-summary-card">
                  <div className="portal-summary-icon purple">
                    <i className="fa-solid fa-shield-halved"></i>
                  </div>
                  <div className="portal-summary-content">
                    <div className="caption">{pt.cardGuaranteeCaption}</div>
                    <div className="title">{pt.cardGuaranteeTitle}</div>
                    <div className="sub">{pt.cardGuaranteeSub}</div>
                  </div>
                </div>
              </div>

              <div className="portal-journey-card">
                <div className="portal-journey-header">
                  <h2>{pt.journeyHeader}</h2>
                  <span className="portal-status-tag">{pt.journeyStep2Active}</span>
                </div>
                <div className="portal-journey-grid">
                  <div className="portal-journey-step completed">
                    <span className="portal-step-pill completed">
                      <i className="fa-solid fa-check"></i>
                    </span>
                    <div className="portal-journey-step-title">{pt.step1Title}</div>
                    <div className="portal-journey-step-desc">{pt.step1Desc}</div>
                  </div>

                  <div className="portal-journey-step active">
                    <span className="portal-step-pill active">2</span>
                    <div className="portal-journey-step-title">{pt.step2Title}</div>
                    <div className="portal-journey-step-desc">{pt.step2Desc}</div>
                  </div>

                  <div className="portal-journey-step">
                    <span className="portal-step-pill pending">3</span>
                    <div className="portal-journey-step-title">{pt.step3Title}</div>
                    <div className="portal-journey-step-desc">{pt.step3Desc}</div>
                  </div>

                  <div className="portal-journey-step">
                    <span className="portal-step-pill pending">4</span>
                    <div className="portal-journey-step-title">{pt.step4Title}</div>
                    <div className="portal-journey-step-desc">{pt.step4Desc}</div>
                  </div>

                  <div className="portal-journey-step">
                    <span className="portal-step-pill pending">5</span>
                    <div className="portal-journey-step-title">{pt.step5Title}</div>
                    <div className="portal-journey-step-desc">{pt.step5Desc}</div>
                  </div>

                  <div className="portal-journey-step">
                    <span className="portal-step-pill pending">6</span>
                    <div className="portal-journey-step-title">{pt.step6Title}</div>
                    <div className="portal-journey-step-desc">{pt.step6Desc}</div>
                  </div>
                </div>
              </div>

              <div className="portal-main-grid">
                <div className="portal-section-card">
                  <h3 className="portal-section-card-title">
                    <i className="fa-solid fa-address-card"></i>
                    <span>{pt.academicFileTitle}</span>
                  </h3>
                  <table className="portal-clean-table">
                    <tbody>
                      <tr>
                        <td className="prop">{pt.propHolder}</td>
                        <td className="val">{fullName}</td>
                      </tr>
                      <tr>
                        <td className="prop">{pt.propStudentId}</td>
                        <td className="val">{candidateNumber}</td>
                      </tr>
                      <tr>
                        <td className="prop">{pt.propEmail}</td>
                        <td className="val">{user?.email || 'komlakimi@gmail.com'}</td>
                      </tr>
                      <tr>
                        <td className="prop">{pt.propPhone}</td>
                        <td className="val">{user?.profile?.phone || '+228 90 0998898'}</td>
                      </tr>
                      <tr>
                        <td className="prop">{pt.propLevel}</td>
                        <td className="val">{formationTitle}</td>
                      </tr>
                      <tr>
                        <td className="prop">{pt.propMode}</td>
                        <td className="val">{studyModeLabel}</td>
                      </tr>
                      <tr>
                        <td className="prop">{pt.propHostCity}</td>
                        <td className="val">
                          {cityName} ({cityState})
                        </td>
                      </tr>
                      <tr>
                        <td className="prop">{pt.propRhythm}</td>
                        <td className="val">{rhythmLabel}</td>
                      </tr>
                      <tr>
                        <td className="prop">{pt.propDiploma}</td>
                        <td className="val">{pt.valDiploma}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="portal-section-card">
                  <h3 className="portal-section-card-title">
                    <i className="fa-solid fa-file-pdf"></i>
                    <span>{pt.docsTitle}</span>
                  </h3>
                  <div className="portal-docs-stack">
                    <div className="portal-doc-entry">
                      <div className="portal-doc-info-block">
                        <i className="fa-solid fa-file-lines portal-doc-icon-red"></i>
                        <div>
                          <div className="title">{pt.doc1Title}</div>
                          <div className="status">{pt.doc1Sub}</div>
                        </div>
                      </div>
                      <span className="portal-badge-pending-tag">{pt.doc1Badge}</span>
                    </div>

                    <a href="#garantie" className="portal-doc-entry">
                      <div className="portal-doc-info-block">
                        <i
                          className="fa-solid fa-file-shield"
                          style={{ color: '#00a859', fontSize: '1.2rem' }}
                        ></i>
                        <div>
                          <div className="title">{pt.doc2Title}</div>
                          <div className="status">{pt.doc2Sub}</div>
                        </div>
                      </div>
                      <span className="portal-btn-download-pill">
                        <i className="fa-solid fa-download"></i> {pt.download}
                      </span>
                    </a>

                    <a href="#fiche" className="portal-doc-entry">
                      <div className="portal-doc-info-block">
                        <i className="fa-solid fa-file-pdf portal-doc-icon-red"></i>
                        <div>
                          <div className="title">{pt.doc3Title}</div>
                          <div className="status">Réf {candidateNumber}</div>
                        </div>
                      </div>
                      <span className="portal-btn-download-pill">
                        <i className="fa-solid fa-download"></i> {pt.download}
                      </span>
                    </a>

                    <a href="#guide" className="portal-doc-entry">
                      <div className="portal-doc-info-block">
                        <i
                          className="fa-solid fa-book"
                          style={{ color: '#1877f2', fontSize: '1.2rem' }}
                        ></i>
                        <div>
                          <div className="title">{pt.doc4Title}</div>
                          <div className="status">{pt.doc4Sub}</div>
                        </div>
                      </div>
                      <span className="portal-btn-download-pill">
                        <i className="fa-solid fa-download"></i> {pt.consult}
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ONGLET 2 : PROFILE */}
          {activeTab === 'profile' && (
            <div className="portal-section-card">
              <h3 className="portal-section-card-title">
                <i className="fa-solid fa-id-card-clip"></i>
                <span>{pt.profileTitle}</span>
              </h3>

              <div className="portal-info-box" style={{ marginBottom: '1.25rem' }}>
                <i className="fa-solid fa-circle-info"></i> {pt.profileRule}
              </div>

              <table className="portal-clean-table">
                <tbody>
                  <tr>
                    <td className="prop">{pt.propFirstName}</td>
                    <td className="val">{firstName}</td>
                  </tr>
                  <tr>
                    <td className="prop">{pt.propLastName}</td>
                    <td className="val">{lastName}</td>
                  </tr>
                  <tr>
                    <td className="prop">{pt.propEmail}</td>
                    <td className="val">{user?.email || 'komlakimi@gmail.com'}</td>
                  </tr>
                  <tr>
                    <td className="prop">{pt.propPhone}</td>
                    <td className="val">{user?.profile?.phone || '+228 90 0998898'}</td>
                  </tr>
                  <tr>
                    <td className="prop">{pt.propCountryIso}</td>
                    <td className="val">{user?.profile?.country_code || 'TG (Togo)'}</td>
                  </tr>
                  <tr>
                    <td className="prop">{pt.propFutureProject}</td>
                    <td className="val">{pt.valFutureProject}</td>
                  </tr>
                  <tr>
                    <td className="prop">{pt.propMode}</td>
                    <td className="val">{studyModeLabel}</td>
                  </tr>
                  <tr>
                    <td className="prop">{pt.propHostCity}</td>
                    <td className="val">{cityName} ({cityState})</td>
                  </tr>
                  <tr>
                    <td className="prop">{pt.propRhythm}</td>
                    <td className="val">{rhythmLabel}</td>
                  </tr>
                  <tr>
                    <td className="prop">{pt.propRegDate}</td>
                    <td className="val">{latestEnrollment?.enrolled_at || '05/11/2026'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* ONGLET 3 : JOURNEY */}
          {activeTab === 'journey' && (
            <div className="portal-section-card">
              <h3 className="portal-section-card-title">
                <i className="fa-solid fa-route"></i>
                <span>{pt.journeyTabTitle}</span>
              </h3>
              <p style={{ fontSize: '0.86rem', color: '#64748b', marginBottom: '1.25rem' }}>
                {pt.journeyTabLead}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="portal-journey-step completed" style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                    <span className="portal-step-pill completed"><i className="fa-solid fa-check"></i></span>
                    <strong style={{ fontSize: '0.92rem' }}>{pt.j1Title}</strong>
                    <span className="portal-status-tag" style={{ marginLeft: 'auto' }}>{pt.j1Tag}</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#475569', margin: 0 }}>
                    {pt.j1Desc} ({studyModeLabel} — {cityName}).
                  </p>
                </div>

                <div className="portal-journey-step active" style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                    <span className="portal-step-pill active">2</span>
                    <strong style={{ fontSize: '0.92rem' }}>{pt.j2Title}</strong>
                    <span className="portal-badge-pending-tag" style={{ marginLeft: 'auto' }}>{pt.j2Tag}</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#475569', margin: 0 }}>
                    {pt.j2Desc}
                  </p>
                </div>

                <div className="portal-journey-step" style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                    <span className="portal-step-pill pending">3</span>
                    <strong style={{ fontSize: '0.92rem' }}>{pt.j3Title}</strong>
                    <span style={{ fontSize: '0.74rem', color: '#94a3b8', marginLeft: 'auto' }}>{pt.j3Tag}</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
                    {pt.j3Desc}
                  </p>
                </div>

                <div className="portal-journey-step" style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                    <span className="portal-step-pill pending">4</span>
                    <strong style={{ fontSize: '0.92rem' }}>{pt.j4Title}</strong>
                    <span style={{ fontSize: '0.74rem', color: '#94a3b8', marginLeft: 'auto' }}>{pt.j4Tag}</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
                    {pt.j4Desc}
                  </p>
                </div>

                <div className="portal-journey-step" style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                    <span className="portal-step-pill pending">5</span>
                    <strong style={{ fontSize: '0.92rem' }}>{pt.j5Title}</strong>
                    <span style={{ fontSize: '0.74rem', color: '#94a3b8', marginLeft: 'auto' }}>{pt.j5Tag}</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
                    {pt.j5Desc}
                  </p>
                </div>

                <div className="portal-journey-step" style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                    <span className="portal-step-pill pending">6</span>
                    <strong style={{ fontSize: '0.92rem' }}>{pt.j6Title}</strong>
                    <span style={{ fontSize: '0.74rem', color: '#94a3b8', marginLeft: 'auto' }}>{pt.j6Tag}</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
                    {pt.j6Desc}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ONGLET 4 : PAYMENTS */}
          {activeTab === 'payments' && (
            <div className="portal-section-card">
              <h3 className="portal-section-card-title">
                <i className="fa-solid fa-credit-card"></i>
                <span>{pt.payTabTitle}</span>
              </h3>

              {stripeSuccessMsg && (
                <div className="portal-info-box" style={{ background: '#ecfdf5', borderColor: '#bbf7d0', color: '#166534', marginBottom: '1.25rem', fontWeight: 700 }}>
                  <i className="fa-solid fa-circle-check"></i> {stripeSuccessMsg}
                </div>
              )}

              {/* Sélecteur : Payer la totalité OU Payer en 3 tranches */}
              <div style={{ marginBottom: '1.35rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.65rem' }}>
                  {pt.payModeLabel}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '0.85rem' }}>
                  <button
                    type="button"
                    onClick={() => setPaymentPlanChoice('full')}
                    style={{
                      textAlign: 'left',
                      padding: '1rem 1.15rem',
                      borderRadius: '14px',
                      border: paymentPlanChoice === 'full' ? '2px solid #059669' : '1px solid #cbd5e1',
                      background: paymentPlanChoice === 'full' ? '#ecfdf5' : '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <strong style={{ fontSize: '0.92rem', color: '#0f172a' }}>{pt.payModeFullTitle}</strong>
                      <span style={{ fontWeight: 800, color: '#059669', fontSize: '0.95rem' }}>{formatMoney(totalPrice)}</span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#475569' }}>{pt.payModeFullSub}</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentPlanChoice('installments')}
                    style={{
                      textAlign: 'left',
                      padding: '1rem 1.15rem',
                      borderRadius: '14px',
                      border: paymentPlanChoice === 'installments' ? '2px solid #ea580c' : '1px solid #cbd5e1',
                      background: paymentPlanChoice === 'installments' ? '#fff7ed' : '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <strong style={{ fontSize: '0.92rem', color: '#0f172a' }}>{pt.payModeSplitTitle}</strong>
                      <span style={{ fontWeight: 800, color: '#ea580c', fontSize: '0.95rem' }}>
                        {formatMoney(inst1Amount, currencyCode, false)} + 2×{formatMoney(inst2Amount, currencyCode, false)}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#475569' }}>{pt.payModeSplitSub}</div>
                  </button>
                </div>
              </div>

              {paymentPlanChoice === 'full' ? (
                <div className="portal-installment-card active-due" style={{ maxWidth: '520px', borderColor: '#10b981', background: '#f0fdf4' }}>
                  <div className="portal-inst-header">
                    <span className="portal-inst-title">{pt.fullCardTitle}</span>
                    <span className="portal-status-tag">{pt.fullCardBadge}</span>
                  </div>
                  <div className="portal-inst-amount" style={{ color: '#065f46' }}>{formatMoney(totalPrice)}</div>
                  <div className="portal-inst-due">{pt.fullCardDue}</div>
                  <div style={{ fontSize: '0.8rem', color: '#334155', lineHeight: 1.5, marginBottom: '0.5rem' }}>
                    {pt.fullCardDesc}
                  </div>
                  <button
                    type="button"
                    className="portal-action-btn"
                    style={{ marginTop: '0.5rem', width: '100%', background: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                    disabled={isProcessingStripe}
                    onClick={() => handleStripePayment(totalPrice, `${pt.fullCardTitle} — ${formationTitle}`, currencyCode)}
                  >
                    <i className="fa-brands fa-stripe" style={{ fontSize: '1.4rem' }}></i>
                    <span>{isProcessingStripe ? pt.stripeLoading : payFullActionText}</span>
                  </button>
                </div>
              ) : (
                <>
                  <div className="portal-warning-box" style={{ marginBottom: '1.25rem' }}>
                    <i className="fa-solid fa-triangle-exclamation"></i>
                    <div>{pt.payWarning}</div>
                  </div>

                  <div className="portal-installments-grid">
                    <div className="portal-installment-card active-due">
                      <div className="portal-inst-header">
                        <span className="portal-inst-title">{pt.inst1Title}</span>
                        <span className="portal-badge-pending-tag">{pt.inst1Badge}</span>
                      </div>
                      <div className="portal-inst-amount">{formatMoney(inst1Amount)}</div>
                      <div className="portal-inst-due">{pt.inst1Due}</div>
                      <div style={{ fontSize: '0.75rem', color: '#475569' }}>
                        {pt.inst1Desc}
                      </div>
                      <button
                        type="button"
                        className="portal-action-btn"
                        style={{ marginTop: '0.5rem', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                        disabled={isProcessingStripe}
                        onClick={() => handleStripePayment(inst1Amount, pt.inst1Title, currencyCode)}
                      >
                        <i className="fa-brands fa-stripe" style={{ fontSize: '1.4rem' }}></i>
                        <span>{isProcessingStripe ? pt.stripeLoading : payInst1ActionText}</span>
                      </button>
                    </div>

                    <div className="portal-installment-card">
                      <div className="portal-inst-header">
                        <span className="portal-inst-title">{pt.inst2Title}</span>
                        <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>{pt.j5Tag}</span>
                      </div>
                      <div className="portal-inst-amount">{formatMoney(inst2Amount)}</div>
                      <div className="portal-inst-due">{pt.inst2Due}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        {pt.inst2Desc}
                      </div>
                    </div>

                    <div className="portal-installment-card">
                      <div className="portal-inst-header">
                        <span className="portal-inst-title">{pt.inst3Title}</span>
                        <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>{pt.j5Tag}</span>
                      </div>
                      <div className="portal-inst-amount">{formatMoney(inst3Amount)}</div>
                      <div className="portal-inst-due">{pt.inst3Due}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        {pt.inst3Desc}
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid #f1f5f9' }}>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 750, color: '#0f172a', marginBottom: '0.75rem' }}>
                  {pt.wireTitle}
                </h4>
                <div className="portal-info-box">
                  {pt.wireDesc}
                </div>
              </div>
            </div>
          )}

          {/* ONGLET 5 : COURSES */}
          {activeTab === 'courses' && (
            <div className="portal-section-card">
              <h3 className="portal-section-card-title">
                <i className="fa-solid fa-graduation-cap"></i>
                <span>{pt.coursesTabTitle}</span>
              </h3>

              <div className="portal-summary-strip" style={{ marginBottom: '1.5rem' }}>
                <div className="portal-summary-card">
                  <div className="portal-summary-icon blue">
                    <i className="fa-solid fa-clock"></i>
                  </div>
                  <div className="portal-summary-content">
                    <div className="caption">{pt.attCaption}</div>
                    <div className="title">{pt.attVal}</div>
                    <div className="sub">{pt.attSub}</div>
                  </div>
                </div>

                <div className="portal-summary-card">
                  <div className="portal-summary-icon green">
                    <i className="fa-solid fa-award"></i>
                  </div>
                  <div className="portal-summary-content">
                    <div className="caption">{pt.avgCaption}</div>
                    <div className="title">— / 20</div>
                    <div className="sub">{pt.avgSub}</div>
                  </div>
                </div>

                <div className="portal-summary-card">
                  <div className="portal-summary-icon purple">
                    <i className="fa-solid fa-school"></i>
                  </div>
                  <div className="portal-summary-content">
                    <div className="caption">{pt.campusCaption}</div>
                    <div className="title">{cityName} ({cityState})</div>
                    <div className="sub">{rhythmLabel}</div>
                  </div>
                </div>
              </div>

              <div className="portal-warning-box">
                <i className="fa-solid fa-triangle-exclamation"></i>
                <div>{pt.coursesWarning}</div>
              </div>
            </div>
          )}

          {/* ONGLET 6 : VISA */}
          {activeTab === 'visa' && (
            <div className="portal-section-card">
              <h3 className="portal-section-card-title">
                <i className="fa-solid fa-passport"></i>
                <span>{pt.visaTabTitle}</span>
              </h3>

              <div className="portal-info-box" style={{ marginBottom: '1.25rem' }}>
                {pt.visaInfo}
              </div>

              <div className="portal-docs-stack">
                <div className="portal-doc-entry">
                  <div className="portal-doc-info-block">
                    <i className="fa-solid fa-file-pdf portal-doc-icon-red"></i>
                    <div>
                      <div className="title">{pt.doc1Title}</div>
                      <div className="status">{pt.doc1Sub}</div>
                    </div>
                  </div>
                  <span className="portal-badge-pending-tag">{pt.doc1Badge}</span>
                </div>

                <a href="#garantie-pdf" className="portal-doc-entry">
                  <div className="portal-doc-info-block">
                    <i className="fa-solid fa-file-shield" style={{ color: '#00a859', fontSize: '1.2rem' }}></i>
                    <div>
                      <div className="title">{pt.doc2Title}</div>
                      <div className="status">{pt.doc2Sub}</div>
                    </div>
                  </div>
                  <span className="portal-btn-download-pill">
                    <i className="fa-solid fa-download"></i> {pt.download}
                  </span>
                </a>

                <a href="#guide-consulaire" className="portal-doc-entry">
                  <div className="portal-doc-info-block">
                    <i className="fa-solid fa-book" style={{ color: '#1877f2', fontSize: '1.2rem' }}></i>
                    <div>
                      <div className="title">{pt.doc4Title}</div>
                      <div className="status">{pt.doc4Sub}</div>
                    </div>
                  </div>
                  <span className="portal-btn-download-pill">
                    <i className="fa-solid fa-download"></i> {pt.consult}
                  </span>
                </a>
              </div>
            </div>
          )}

          {/* ONGLET 7 : REQUESTS */}
          {activeTab === 'requests' && (
            <div className="portal-section-card">
              <h3 className="portal-section-card-title">
                <i className="fa-solid fa-comments"></i>
                <span>{pt.reqTabTitle}</span>
              </h3>

              <div className="portal-info-box" style={{ marginBottom: '1.25rem' }}>
                {pt.reqInfo}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div className="portal-doc-entry">
                  <div className="portal-doc-info-block">
                    <i className="fa-solid fa-envelope-open-text" style={{ color: '#1877f2', fontSize: '1.15rem' }}></i>
                    <div>
                      <div className="title">{pt.reqItemTitle}</div>
                      <div className="status">{pt.reqItemSub}</div>
                    </div>
                  </div>
                  <span className="portal-status-tag">{pt.reqItemTag}</span>
                </div>
              </div>
            </div>
          )}

          {/* ONGLET 8 : REFUND */}
          {activeTab === 'refund' && (
            <div className="portal-section-card">
              <h3 className="portal-section-card-title">
                <i className="fa-solid fa-shield-halved"></i>
                <span>{pt.refundTabTitle}</span>
              </h3>

              <div className="portal-info-box" style={{ marginBottom: '1.25rem' }}>
                {pt.refundInfo}
              </div>

              <table className="portal-clean-table">
                <tbody>
                  <tr>
                    <td className="prop">{pt.refPropRate}</td>
                    <td className="val" style={{ color: '#00a859' }}>{pt.refValRate}</td>
                  </tr>
                  <tr>
                    <td className="prop">{pt.refPropReason}</td>
                    <td className="val">{pt.refValReason}</td>
                  </tr>
                  <tr>
                    <td className="prop">{pt.refPropDoc}</td>
                    <td className="val">{pt.refValDoc}</td>
                  </tr>
                  <tr>
                    <td className="prop">{pt.refPropDelay}</td>
                    <td className="val">{pt.refValDelay}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default StudentPortalPage;
