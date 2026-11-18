import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'fr' | 'en' | 'pt';

export const LANGUAGE_LABELS: Record<Language, { short: string; label: string; flag: string }> = {
  fr: { short: 'FR', label: 'Français', flag: '🇫🇷' },
  en: { short: 'EN', label: 'English', flag: '🇬🇧' },
  pt: { short: 'PT', label: 'Português (BR)', flag: '🇧🇷' },
};

export const translations = {
  fr: {
    nav: {
      tagline: 'ÉCOLE DE PORTUGAIS & MOBILITÉ AU BRÉSIL',
      programs: 'Nos formations',
      universities: 'Universités',
      login: 'Connexion',
      registerCta: 'Commencer mon inscription',
      registerShort: "S'inscrire",
      drawerPrograms: 'Nos Formations (A1, A2, CELPE-Bras)',
      drawerTimeline: "Processus d'admission en 4 étapes",
      drawerUniversities: 'Universités partenaires (USP, UnB...)',
      drawerGuarantee: 'Garantie de Remboursement (85%)',
      drawerFaq: 'Questions fréquentes (FAQ)',
      drawerPortal: 'Espace Étudiant',
      drawerLogin: 'Connexion',
    },
    hero: {
      titleBefore: 'La référence pour apprendre le portugais et la culture ',
      titleHighlight: 'brésilienne',
      searchPlaceholder: 'Quel est votre projet ? (Niveau, visa...)',
      searchBtnFull: 'Choisir ma formation',
      searchBtnShort: 'Choisir',
      scrollIndicator: 'Découvrir nos cursus',
      categories: [
        { label: 'Niveau A1 (En Ligne)', shortLabel: 'A1 En Ligne', q: 'A1-ligne' },
        { label: 'Niveau A1 (Au Brésil)', shortLabel: 'A1 au Brésil', q: 'A1-bresil' },
        { label: 'Niveau A2 (Au Brésil)', shortLabel: 'A2 au Brésil', q: 'A2-bresil' },
        { label: 'Diplôme CELPE-Bras', shortLabel: 'CELPE-Bras', q: 'celpe-bras' },
        { label: 'Campus Brasília', shortLabel: 'Brasília (DF)', q: 'brasilia' },
      ],
    },
    showcase: {
      slides: [
        {
          titleLine1: 'Immersion Linguistique',
          ampersand: '&',
          titleLine2: 'Culturelle',
          tabLabel: 'Immersion au Brésil',
          subtitleHtml:
            'Apprenez le portugais à <strong>Brasilia</strong> ou <strong>São Paulo</strong> en immersion totale, au contact direct d’enseignants natifs et de la vie locale.',
          ctaText: "Choisir l'immersion au Brésil",
        },
        {
          titleLine1: 'Cours de Portugais',
          ampersand: '&',
          titleLine2: 'En Ligne Direct',
          tabLabel: 'Cours en Ligne',
          subtitleHtml:
            'Validez les fondamentaux du portugais brésilien depuis chez vous en <strong>Afrique</strong> avec nos professeurs natifs en visioconférence directe.',
          ctaText: 'Démarrer les cours en ligne',
        },
        {
          titleLine1: 'Diplôme CELPE-Bras',
          ampersand: '&',
          titleLine2: 'Cursus Universitaire',
          tabLabel: 'Diplôme CELPE-Bras',
          subtitleHtml:
            'Perfectionnement académique au <strong>Brésil</strong> pour réussir le diplôme d’État officiel et intégrer les <strong>universités partenaires</strong>.',
          ctaText: 'Postuler au cursus universitaire',
        },
      ],
    },
    timeline: {
      title: 'De votre pays d’origine jusqu’à votre première rentrée au Brésil',
      subtitle: "Un processus d'admission et de mobilité clair, rapide et sécurisé en 4 étapes.",
      steps: [
        {
          number: '01',
          title: 'Inscription & Choix du Cursus',
          description: 'Choix de votre formation (présentiel ou en ligne) et validation de votre dossier.',
          tags: 'En Ligne • Gratuit & Immédiat',
        },
        {
          number: '02',
          title: 'Attestation Officielle sous 48h',
          description: 'Certificat de scolarité certifié conforme délivré par le secrétariat à Brasília.',
          tags: 'Normes MEC / INEP • Conforme Consulat',
        },
        {
          number: '03',
          title: 'Dépôt Visa VITEM IV & Garantie 85%',
          description: 'Dépôt consulaire sécurisé avec clause contractuelle de remboursement en cas de refus.',
          tags: 'Garantie 85% • Assistance Visa',
        },
        {
          number: '04',
          title: 'Arrivée, Logement & Rentrée au Brésil',
          description: 'Accueil à l’aéroport à Brasília ou São Paulo, CPF, démarches et début des cours.',
          tags: 'Brasília / SP • Accueil Garanti',
        },
      ],
    },
    academic: {
      title: "L'excellence académique brésilienne à votre portée",
      leadHtml:
        'Brasil·É prépare rigoureusement ses étudiants à réussir l’examen officiel du <strong>CELPE-Bras</strong>, le certificat d’État officiel qui ouvre les portes des facultés fédérales et d’État du Brésil sans passer par le concours local brésilien.',
      ctaBtn: 'Admissibilité CELPE-Bras',
      uniTranslations: {
        UnB: {
          fullName: 'Université Fédérale de Brasília',
          highlight: 'Campus Oscar Niemeyer • Admission sur dossier CELPE-Bras',
        },
        USP: {
          fullName: 'Université d’État de São Paulo',
          highlight: 'Leader mondial de recherche et d’innovation académique',
        },
        UNICAMP: {
          fullName: 'Université d’État de Campinas',
          highlight: '15% de l’ensemble des brevets tech et recherche du Brésil',
        },
        UFRJ: {
          fullName: 'Université Fédérale de Rio de Janeiro',
          highlight: 'Plus ancienne et illustre institution fédérale du Brésil',
        },
        UFMG: {
          fullName: 'Université Fédérale de Minas Gerais',
          highlight: 'Campus d’excellence de 8,7 millions de m² à Pampulha',
        },
        UFRGS: {
          fullName: 'Université Fédérale du Rio Grande do Sul',
          highlight: 'Centre universitaire de pointe du Sud brésilien',
        },
      } as Record<string, { fullName: string; highlight: string }>,
    },
    guarantee: {
      caption: 'remboursés si le visa est refusé',
      title: 'La seule école qui sécurise financièrement votre projet d’études',
      text: 'Refus de visa par le consulat ? 85 % des montants réglés vous sont restitués. C’est écrit dans votre contrat.',
      points: [
        'Clause signée dès l’inscription',
        'Virement sous 14 jours ouvrés',
        'Dossiers officiels conformes',
      ],
    },
    testimonials: {
      title: 'Comment nous avons conduit leurs parcours jusqu’à la réussite',
      subtitleHtml:
        'Découvrez comment <strong>Brasil·É</strong> a pris en charge, structuré et mené chaque dossier étudiant de son pays d’origine jusqu’à son intégration effective au Brésil.',
      items: [
        {
          name: 'Dossier Aminata K.',
          country: 'Départ : Sénégal (Dakar) → Brasília',
          currentStatus: 'Aboutissement : Admise en Master à l’Université de Brasília (UnB)',
          quote:
            'Prise en charge sans aucun prérequis en portugais. Nous avons émis son attestation officielle en 48h pour son visa VITEM IV, organisé son accueil et son logement à Brasília ainsi que son CPF, puis assuré 5 mois d’immersion intensive quotidienne jusqu’à sa validation académique.',
        },
        {
          name: 'Dossier Jean-Marc T.',
          country: 'Départ : Côte d’Ivoire (Abidjan) → São Paulo',
          currentStatus: 'Aboutissement : Intégré en Génie Civil à l’USP (São Paulo)',
          quote:
            'Mise en place d’un parcours hybride adapté : nous l’avons d’abord formé au Niveau A1 en cours du soir en ligne depuis Abidjan pendant sa licence, avant de constituer son dossier consulaire accepté dès le premier dépôt et d’organiser sa transition vers le Niveau A2 à São Paulo.',
        },
        {
          name: 'Dossier Emmanuel M.',
          country: 'Départ : Cameroun (Douala) → Brésil',
          currentStatus: 'Aboutissement : Diplôme d’État CELPE-Bras obtenu dès la 1ère session',
          quote:
            'Sécurisation financière complète de sa famille grâce à notre garantie contractuelle écrite de remboursement à 85%. Nous avons supervisé toute sa procédure consulaire jusqu’à l’obtention du visa étudiant, puis encadré sa préparation intensive aux épreuves officielles du MEC.',
        },
      ],
    },
    faq: {
      title: 'Questions fréquentes',
      subtitle:
        'Tout ce que vous devez savoir pour préparer sereinement votre inscription, vos démarches consulaires et votre départ au Brésil.',
      items: [
        {
          q: 'Quelles sont les conditions pour s’inscrire à Brasil·É ?',
          a: 'L’inscription est ouverte à toute personne motivée désirant apprendre le portugais brésilien ou poursuivre ses études au Brésil. Aucun prérequis linguistique n’est demandé pour débuter au Niveau A1. Pour le parcours en immersion au Brésil, vous devez être titulaire d’un passeport en cours de validité pour engager la demande de visa d’études.',
        },
        {
          q: 'En combien de mensualités puis-je régler ma formation ?',
          a: 'Nous proposons une formule de paiement échelonné en 3 mensualités sans frais : un premier acompte lors de la validation du dossier pour émettre votre attestation officielle, puis deux mensualités réparties au cours des mois suivants.',
        },
        {
          q: 'Comment s’applique exactement la garantie de remboursement de 85% ?',
          a: 'Cette protection est une clause contractuelle formelle inscrite directement dans votre contrat de scolarité. Si, après avoir déposé un dossier complet et conforme, le consulat du Brésil venait à rejeter votre demande de visa d’études, 85% des sommes que vous avez réglées à l’école vous sont restituées par virement bancaire sous 14 jours ouvrés suivant la notification du refus consulaire.',
        },
        {
          q: 'En combien de temps l’attestation officielle d’inscription est-elle délivrée ?',
          a: 'Dès que votre dossier d’inscription est validé par le secrétariat administratif à Brasília, votre attestation d’inscription certifiée conforme aux exigences consulaires est émise sous 48 heures ouvrées et mise à disposition dans votre espace étudiant pour votre rendez-vous à l’Ambassade.',
        },
        {
          q: 'Le diplôme CELPE-Bras permet-il d’entrer dans n’importe quelle université au Brésil ?',
          a: 'Oui. Le CELPE-Bras est le seul certificat de compétence en langue portugaise pour étrangers officiellement reconnu par le gouvernement brésilien (Ministério da Educação - MEC). Il est requis par toutes les universités publiques et privées du pays pour les étudiants internationaux.',
        },
      ],
    },
    footer: {
      ctaHeadline: "Lancez dès aujourd'hui votre projet d'études au Brésil !",
      ctaSubhead:
        'Votre attestation officielle d’inscription et votre accompagnement visa délivrés en moins de 48 heures.',
      inputPlaceholder: 'Entrez votre adresse e-mail ou numéro WhatsApp...',
      submitBtn: 'Commencer mon inscription',
      bio: 'Brasil·É offre un accompagnement d’excellence aux étudiants africains : apprentissage immersif du portugais, préparation au diplôme d’État CELPE-Bras et mobilité académique vers les meilleures universités du Brésil.',
      colPrograms: 'Nos Formations',
      programsList: [
        'Immersion Linguistique (Brasília)',
        'Cours de Portugais en Ligne Direct',
        'Préparation Diplôme CELPE-Bras',
        'Cursus Pré-Universitaire Partenaire',
        'Phonétique & Pratique Orale',
      ],
      colAbout: 'À Propos de Brasil·É',
      aboutList: [
        { label: 'Pourquoi Choisir le Brésil', href: '#formations' },
        { label: 'Universités Partenaires', href: '#partenaires' },
        { label: 'Garantie Contractuelle 85%', href: '#garantie' },
        { label: 'Démarches Visa VITEM IV', href: '#timeline' },
        { label: 'Questions Fréquentes (FAQ)', href: '#faq' },
        { label: 'Mentions Légales & Confidentialité', href: '#garantie' },
      ],
      colCampuses: 'Nos Campus',
      campusOnline: 'CAMPUS EN LIGNE',
    },
    auth: {
      loginTitle: 'Connexion',
      loginSubtitle: 'Entrez vos identifiants pour accéder à votre espace étudiant.',
      emailLabel: 'Adresse e-mail',
      passwordLabel: 'Mot de passe',
      passwordPlaceholder: 'Votre mot de passe',
      rememberMe: 'Se souvenir de moi',
      forgotPassword: 'Mot de passe oublié ?',
      forgotAlert: 'Contactez le secrétariat pédagogique Brasil·É pour réinitialiser vos accès.',
      loginBtn: 'Se connecter',
      loggingIn: 'Connexion en cours...',
      noAccount: "Vous n'avez pas encore de compte ?",
      createAccount: 'Créer un compte',
      welcomeBack: 'Bon retour',
      sessionOpen: 'Votre session est ouverte. Vous pouvez accéder à votre planning et vos attestations.',
      accessPortal: 'Accéder à mon espace',
      regTitle: 'Commencer mon inscription',
      regSubtitle: "Remplissez vos informations pour commencer vos démarches d'études.",
      firstName: 'Prénom *',
      lastName: 'Nom de famille *',
      phone: 'Téléphone / WhatsApp *',
      levelTarget: 'Niveau CECRL visé *',
      studyMode: "Modalité d'études *",
      modeInPerson: 'Présentiel au Brésil (Visa VITEM IV)',
      modeOnline: '100% En Ligne (À distance)',
      hostCity: "Ville d'accueil au Brésil *",
      targetUni: 'Université cible (Optionnel)',
      chooseLater: '-- Choisir plus tard --',
      otherUni: 'Autre université brésilienne',
      residenceCountry: 'Pays de résidence actuel *',
      accountPassword: 'Mot de passe pour mon compte *',
      minChars: 'Min. 8 caractères',
      submitReg: 'Valider mon inscription',
      submittingReg: 'Validation en cours...',
      alreadyAccount: 'Vous avez déjà un compte ?',
      regSuccessTitle: 'Inscription Réussie !',
      backHome: "Retourner à l'accueil",
    },
  },
  en: {
    nav: {
      tagline: 'PORTUGUESE SCHOOL & STUDENT MOBILITY IN BRAZIL',
      programs: 'Our Programs',
      universities: 'Universities',
      login: 'Sign In',
      registerCta: 'Start My Application',
      registerShort: 'Apply',
      drawerPrograms: 'Our Programs (A1, A2, CELPE-Bras)',
      drawerTimeline: '4-Step Admission Process',
      drawerUniversities: 'Partner Universities (USP, UnB...)',
      drawerGuarantee: '85% Refund Guarantee',
      drawerFaq: 'Frequently Asked Questions (FAQ)',
      drawerPortal: 'Student Portal',
      drawerLogin: 'Sign In',
    },
    hero: {
      titleBefore: 'The leading academy to learn Portuguese and ',
      titleHighlight: 'Brazilian culture',
      searchPlaceholder: 'What is your study goal? (Level, visa...)',
      searchBtnFull: 'Find My Program',
      searchBtnShort: 'Select',
      scrollIndicator: 'Explore our programs',
      categories: [
        { label: 'Level A1 (Online)', shortLabel: 'A1 Online', q: 'A1-ligne' },
        { label: 'Level A1 (In Brazil)', shortLabel: 'A1 in Brazil', q: 'A1-bresil' },
        { label: 'Level A2 (In Brazil)', shortLabel: 'A2 in Brazil', q: 'A2-bresil' },
        { label: 'CELPE-Bras Diploma', shortLabel: 'CELPE-Bras', q: 'celpe-bras' },
        { label: 'Brasília Campus', shortLabel: 'Brasília (DF)', q: 'brasilia' },
      ],
    },
    showcase: {
      slides: [
        {
          titleLine1: 'Linguistic',
          ampersand: '&',
          titleLine2: 'Cultural Immersion',
          tabLabel: 'Immersion in Brazil',
          subtitleHtml:
            'Learn Portuguese in <strong>Brasília</strong> or <strong>São Paulo</strong> through full immersion with native teachers and authentic local life.',
          ctaText: 'Choose Immersion in Brazil',
        },
        {
          titleLine1: 'Portuguese Courses',
          ampersand: '&',
          titleLine2: 'Live Online Classes',
          tabLabel: 'Online Courses',
          subtitleHtml:
            'Master the fundamentals of Brazilian Portuguese from home in <strong>Africa</strong> with our native teachers in live video classes.',
          ctaText: 'Start Online Courses',
        },
        {
          titleLine1: 'CELPE-Bras Diploma',
          ampersand: '&',
          titleLine2: 'University Pathway',
          tabLabel: 'CELPE-Bras Diploma',
          subtitleHtml:
            'Academic preparation in <strong>Brazil</strong> to pass the official state exam and enter our <strong>partner universities</strong>.',
          ctaText: 'Apply for University Pathway',
        },
      ],
    },
    timeline: {
      title: 'From your home country to your first semester in Brazil',
      subtitle: 'A clear, fast, and secure 4-step admission and student mobility process.',
      steps: [
        {
          number: '01',
          title: 'Application & Program Selection',
          description: 'Select your study track (in-person in Brazil or online) and validate your application.',
          tags: 'Online • Free & Immediate',
        },
        {
          number: '02',
          title: 'Official Certificate within 48h',
          description: 'Certified enrollment certificate issued by our academic office in Brasília.',
          tags: 'MEC / INEP Standards • Consulate Approved',
        },
        {
          number: '03',
          title: 'VITEM IV Visa & 85% Guarantee',
          description: 'Secure consulate visa filing backed by a written 85% refund clause in case of refusal.',
          tags: '85% Guarantee • Visa Support',
        },
        {
          number: '04',
          title: 'Arrival, Housing & Start in Brazil',
          description: 'Airport pickup in Brasília or São Paulo, CPF registration, housing and first classes.',
          tags: 'Brasília / SP • Guaranteed Welcome',
        },
      ],
    },
    academic: {
      title: 'Brazilian academic excellence within your reach',
      leadHtml:
        'Brasil·É rigorously prepares students to pass the official <strong>CELPE-Bras</strong> exam, the state certificate that opens the doors to federal and state universities in Brazil without taking the local entrance exam.',
      ctaBtn: 'CELPE-Bras Eligibility',
      uniTranslations: {
        UnB: {
          fullName: 'Federal University of Brasília',
          highlight: 'Oscar Niemeyer Campus • Direct CELPE-Bras admission',
        },
        USP: {
          fullName: 'University of São Paulo',
          highlight: '#1 leader in research and academic innovation in Latin America',
        },
        UNICAMP: {
          fullName: 'State University of Campinas',
          highlight: 'Accounts for 15% of all tech patents and research in Brazil',
        },
        UFRJ: {
          fullName: 'Federal University of Rio de Janeiro',
          highlight: 'Oldest and most prestigious federal institution in Brazil',
        },
        UFMG: {
          fullName: 'Federal University of Minas Gerais',
          highlight: '8.7 million m² campus of excellence in Pampulha',
        },
        UFRGS: {
          fullName: 'Federal University of Rio Grande do Sul',
          highlight: 'Leading technological university hub in Southern Brazil',
        },
      } as Record<string, { fullName: string; highlight: string }>,
    },
    guarantee: {
      caption: 'refunded if your visa is denied',
      title: 'The only school that financially secures your study abroad project',
      text: 'Visa refused by the consulate? 85% of your paid tuition fees are refunded. It is written into your contract.',
      points: [
        'Contractual clause signed upon enrollment',
        'Bank transfer within 14 business days',
        'Official consulate-compliant files',
      ],
    },
    testimonials: {
      title: 'How we guided their pathways to success',
      subtitleHtml:
        'See how <strong>Brasil·É</strong> structured, managed, and led each student file from their home country all the way to academic integration in Brazil.',
      items: [
        {
          name: 'Case Study: Aminata K.',
          country: 'Origin: Senegal (Dakar) → Brasília',
          currentStatus: 'Outcome: Admitted to Master’s at University of Brasília (UnB)',
          quote:
            'Onboarded with zero prior Portuguese knowledge. We issued her official certificate within 48h for her VITEM IV visa, coordinated airport pickup, housing, and CPF registration in Brasília, and delivered 5 months of daily intensive training up to university placement.',
        },
        {
          name: 'Case Study: Jean-Marc T.',
          country: 'Origin: Ivory Coast (Abidjan) → São Paulo',
          currentStatus: 'Outcome: Enrolled in Civil Engineering at USP (São Paulo)',
          quote:
            'Designed a tailored hybrid pathway: we first trained him to Level A1 through evening online classes from Abidjan while he completed his degree, then prepared his consulate file—approved on the first appointment—and managed his transition to Level A2 in São Paulo.',
        },
        {
          name: 'Case Study: Emmanuel M.',
          country: 'Origin: Cameroon (Douala) → Brazil',
          currentStatus: 'Outcome: Official CELPE-Bras State Diploma passed on 1st attempt',
          quote:
            'Provided full financial security to his family through our written 85% refund guarantee clause. We supervised his entire consular application until student visa issuance, then guided his intensive preparation for the official MEC state exam.',
        },
      ],
    },
    faq: {
      title: 'Frequently Asked Questions',
      subtitle:
        'Everything you need to know to prepare your enrollment, consulate visa application, and departure to Brazil.',
      items: [
        {
          q: 'What are the requirements to enroll at Brasil·É?',
          a: 'Enrollment is open to any motivated student wishing to learn Brazilian Portuguese or pursue higher education in Brazil. No prior language level is required to start at Level A1. For the in-person track in Brazil, you must hold a valid passport to apply for a student visa.',
        },
        {
          q: 'In how many installments can I pay for my tuition?',
          a: 'We offer an interest-free 3-installment payment plan: an initial deposit upon file validation to issue your official enrollment certificate, followed by two monthly installments.',
        },
        {
          q: 'How does the 85% refund guarantee work?',
          a: 'This protection is a formal contractual clause included in your enrollment contract. If the Brazilian consulate denies your student visa after submitting a complete application, 85% of the fees paid are refunded via bank transfer within 14 business days of the official refusal notice.',
        },
        {
          q: 'How fast is the official enrollment certificate issued?',
          a: 'As soon as your enrollment file is validated by our academic office in Brasília, your consulate-compliant certificate is issued within 48 business hours and made available in your student portal.',
        },
        {
          q: 'Does the CELPE-Bras diploma grant access to any university in Brazil?',
          a: 'Yes. CELPE-Bras is the only certificate of Portuguese proficiency for foreigners officially recognized by the Brazilian Ministry of Education (MEC). It is accepted by all public and private universities in Brazil.',
        },
      ],
    },
    footer: {
      ctaHeadline: 'Start your study project in Brazil today!',
      ctaSubhead:
        'Your official enrollment certificate and visa support delivered in under 48 hours.',
      inputPlaceholder: 'Enter your email address or WhatsApp number...',
      submitBtn: 'Start My Application',
      bio: 'Brasil·É provides world-class support to international students: immersive Portuguese training, CELPE-Bras state exam preparation, and academic mobility to Brazil’s top universities.',
      colPrograms: 'Our Programs',
      programsList: [
        'Linguistic Immersion (Brasília)',
        'Live Online Portuguese Courses',
        'CELPE-Bras Exam Preparation',
        'Partner Pre-University Pathway',
        'Phonetics & Speaking Practice',
      ],
      colAbout: 'About Brasil·É',
      aboutList: [
        { label: 'Why Choose Brazil', href: '#formations' },
        { label: 'Partner Universities', href: '#partenaires' },
        { label: '85% Contractual Guarantee', href: '#garantie' },
        { label: 'VITEM IV Visa Process', href: '#timeline' },
        { label: 'Frequently Asked Questions', href: '#faq' },
        { label: 'Legal Notice & Privacy', href: '#garantie' },
      ],
      colCampuses: 'Our Campuses',
      campusOnline: 'ONLINE CAMPUS',
    },
    auth: {
      loginTitle: 'Sign In',
      loginSubtitle: 'Enter your credentials to access your student portal.',
      emailLabel: 'Email address',
      passwordLabel: 'Password',
      passwordPlaceholder: 'Your password',
      rememberMe: 'Remember me',
      forgotPassword: 'Forgot password?',
      forgotAlert: 'Please contact the Brasil·É academic office to reset your password.',
      loginBtn: 'Sign In',
      loggingIn: 'Signing in...',
      noAccount: "Don't have an account yet?",
      createAccount: 'Create an account',
      welcomeBack: 'Welcome back',
      sessionOpen: 'Your session is active. You can now access your schedule and certificates.',
      accessPortal: 'Go to Student Portal',
      regTitle: 'Start My Application',
      regSubtitle: 'Fill in your details to begin your study application.',
      firstName: 'First Name *',
      lastName: 'Last Name *',
      phone: 'Phone / WhatsApp *',
      levelTarget: 'Target CEFR Level *',
      studyMode: 'Study Mode *',
      modeInPerson: 'In-Person in Brazil (VITEM IV Visa)',
      modeOnline: '100% Online (Remote)',
      hostCity: 'Host City in Brazil *',
      targetUni: 'Target University (Optional)',
      chooseLater: '-- Choose later --',
      otherUni: 'Other Brazilian university',
      residenceCountry: 'Current Country of Residence *',
      accountPassword: 'Password for my account *',
      minChars: 'Min. 8 characters',
      submitReg: 'Submit My Application',
      submittingReg: 'Submitting...',
      alreadyAccount: 'Already have an account?',
      regSuccessTitle: 'Application Submitted!',
      backHome: 'Back to Home',
    },
  },
  pt: {
    nav: {
      tagline: 'ESCOLA DE PORTUGUÊS & MOBILIDADE NO BRASIL',
      programs: 'Nossos Cursos',
      universities: 'Universidades',
      login: 'Entrar',
      registerCta: 'Iniciar minha inscrição',
      registerShort: 'Inscrever-se',
      drawerPrograms: 'Nossos Cursos (A1, A2, CELPE-Bras)',
      drawerTimeline: 'Processo de admissão em 4 etapas',
      drawerUniversities: 'Universidades parceiras (USP, UnB...)',
      drawerGuarantee: 'Garantia de Reembolso (85%)',
      drawerFaq: 'Perguntas Frequentes (FAQ)',
      drawerPortal: 'Portal do Estudante',
      drawerLogin: 'Entrar',
    },
    hero: {
      titleBefore: 'A referência para aprender português e a cultura ',
      titleHighlight: 'brasileira',
      searchPlaceholder: 'Qual é o seu projeto? (Nível, visto...)',
      searchBtnFull: 'Escolher meu curso',
      searchBtnShort: 'Escolher',
      scrollIndicator: 'Conheça nossos cursos',
      categories: [
        { label: 'Nível A1 (Online)', shortLabel: 'A1 Online', q: 'A1-ligne' },
        { label: 'Nível A1 (No Brasil)', shortLabel: 'A1 no Brasil', q: 'A1-bresil' },
        { label: 'Nível A2 (No Brasil)', shortLabel: 'A2 no Brasil', q: 'A2-bresil' },
        { label: 'Diploma CELPE-Bras', shortLabel: 'CELPE-Bras', q: 'celpe-bras' },
        { label: 'Campus Brasília', shortLabel: 'Brasília (DF)', q: 'brasilia' },
      ],
    },
    showcase: {
      slides: [
        {
          titleLine1: 'Imersão Linguística',
          ampersand: '&',
          titleLine2: 'Cultural',
          tabLabel: 'Imersão no Brasil',
          subtitleHtml:
            'Aprenda português em <strong>Brasília</strong> ou <strong>São Paulo</strong> em imersão total, em contato direto com professores nativos e a vida local.',
          ctaText: 'Escolher imersão no Brasil',
        },
        {
          titleLine1: 'Curso de Português',
          ampersand: '&',
          titleLine2: 'Online ao Vivo',
          tabLabel: 'Curso Online',
          subtitleHtml:
            'Domine os fundamentos do português brasileiro sem sair de casa na <strong>África</strong> com nossos professores nativos por videoconferência ao vivo.',
          ctaText: 'Começar curso online',
        },
        {
          titleLine1: 'Diploma CELPE-Bras',
          ampersand: '&',
          titleLine2: 'Acesso Universitário',
          tabLabel: 'Diploma CELPE-Bras',
          subtitleHtml:
            'Aperfeiçoamento acadêmico no <strong>Brasil</strong> para conquistar o certificado oficial do MEC e ingressar nas <strong>universidades parceiras</strong>.',
          ctaText: 'Candidatar-se ao curso universitário',
        },
      ],
    },
    timeline: {
      title: 'Do seu país de origem até o seu primeiro semestre no Brasil',
      subtitle: 'Um processo de admissão e mobilidade estudantil claro, rápido e seguro em 4 etapas.',
      steps: [
        {
          number: '01',
          title: 'Inscrição & Escolha do Curso',
          description: 'Escolha da modalidade (presencial no Brasil ou online) e validação do seu processo.',
          tags: 'Online • Gratuito & Imediato',
        },
        {
          number: '02',
          title: 'Declaração Oficial em até 48h',
          description: 'Certificado de matrícula autenticado emitido pela secretaria acadêmica em Brasília.',
          tags: 'Normas MEC / INEP • Padrão Consular',
        },
        {
          number: '03',
          title: 'Visto VITEM IV & Garantia de 85%',
          description: 'Solicitação consular segura com cláusula contratual de reembolso em caso de recusa.',
          tags: 'Garantia 85% • Assessoria de Visto',
        },
        {
          number: '04',
          title: 'Chegada, Moradia & Início das Aulas',
          description: 'Recepção no aeroporto em Brasília ou São Paulo, emissão de CPF, moradia e início das aulas.',
          tags: 'Brasília / SP • Recepção Garantida',
        },
      ],
    },
    academic: {
      title: 'A excelência acadêmica brasileira ao seu alcance',
      leadHtml:
        'A Brasil·É prepara rigorosamente seus estudantes para aprovação no exame oficial do <strong>CELPE-Bras</strong>, o certificado oficial do MEC que abre as portas das universidades federais e estaduais do Brasil sem necessidade de vestibular.',
      ctaBtn: 'Admissibilidade CELPE-Bras',
      uniTranslations: {
        UnB: {
          fullName: 'Universidade Federal de Brasília',
          highlight: 'Campus Oscar Niemeyer • Admissão via certificado CELPE-Bras',
        },
        USP: {
          fullName: 'Universidade de São Paulo',
          highlight: 'Líder número 1 em pesquisa e inovação acadêmica na América Latina',
        },
        UNICAMP: {
          fullName: 'Universidade Estadual de Campinas',
          highlight: 'Responsável por 15% das patentes tecnológicas e pesquisas do Brasil',
        },
        UFRJ: {
          fullName: 'Universidade Federal do Rio de Janeiro',
          highlight: 'A mais tradicional e prestigiada instituição federal do Brasil',
        },
        UFMG: {
          fullName: 'Universidade Federal de Minas Gerais',
          highlight: 'Campus de excelência com 8,7 milhões de m² na Pampulha',
        },
        UFRGS: {
          fullName: 'Universidade Federal do Rio Grande do Sul',
          highlight: 'Polo universitário tecnológico de ponta no Sul do Brasil',
        },
      } as Record<string, { fullName: string; highlight: string }>,
    },
    guarantee: {
      caption: 'reembolsados se o visto for negado',
      title: 'A única escola que protege financeiramente o seu projeto de estudos',
      text: 'Visto negado pelo consulado? 85% dos valores pagos são devolvidos. Isso está garantido em contrato.',
      points: [
        'Cláusula assinada no ato da matrícula',
        'Transferência em até 14 dias úteis',
        'Documentação oficial padrão consular',
      ],
    },
    testimonials: {
      title: 'Como conduzimos cada trajetória até o resultado final',
      subtitleHtml:
        'Veja como a <strong>Brasil·É</strong> planejou, acompanhou e conduziu cada processo estudantil desde o país de origem até o ingresso efetivo no Brasil.',
      items: [
        {
          name: 'Processo Aminata K.',
          country: 'Origem: Senegal (Dakar) → Brasília',
          currentStatus: 'Resultado: Aprovada no Mestrado na Universidade de Brasília (UnB)',
          quote:
            'Acolhimento sem conhecimento prévio de português. Emitimos sua declaração oficial em 48h para o visto VITEM IV, organizamos sua recepção, moradia e CPF em Brasília, e conduzimos 5 meses de imersão intensiva diária até a aprovação acadêmica.',
        },
        {
          name: 'Processo Jean-Marc T.',
          country: 'Origem: Costa do Marfim (Abidjan) → São Paulo',
          currentStatus: 'Resultado: Ingressou em Engenharia Civil na USP (São Paulo)',
          quote:
            'Estruturação de um percurso híbrido sob medida: iniciamos sua formação no Nível A1 em aulas noturnas online a partir de Abidjan durante sua graduação, preparamos seu dossiê consular aprovado de primeira e coordenamos sua transição presencial para São Paulo.',
        },
        {
          name: 'Processo Emmanuel M.',
          country: 'Origem: Camarões (Douala) → Brasil',
          currentStatus: 'Resultado: Certificado Oficial CELPE-Bras conquistado na 1ª edição',
          quote:
            'Garantia financeira integral para sua família por meio da nossa cláusula contratual de reembolso de 85%. Supervisionamos todo o trâmite consular até a emissão do visto de estudante e conduzimos sua preparação intensiva para o exame oficial do MEC.',
        },
      ],
    },
    faq: {
      title: 'Perguntas Frequentes',
      subtitle:
        'Tudo o que você precisa saber para preparar com tranquilidade sua matrícula, seu visto consular e seu embarque para o Brasil.',
      items: [
        {
          q: 'Quais são os requisitos para se inscrever na Brasil·É?',
          a: 'A inscrição está aberta a qualquer estudante motivado que deseje aprender português brasileiro ou cursar o ensino superior no Brasil. Não é exigido conhecimento prévio do idioma para iniciar no Nível A1. Para a modalidade presencial no Brasil, é necessário possuir passaporte válido para solicitar o visto de estudante.',
        },
        {
          q: 'Em quantas parcelas posso pagar a minha formação?',
          a: 'Oferecemos parcelamento em 3 mensalidades sem juros: uma primeira parcela na validação do processo para emissão da declaração oficial de matrícula, e duas parcelas nos meses seguintes.',
        },
        {
          q: 'Como funciona exatamente a garantia de reembolso de 85%?',
          a: 'Essa proteção é uma cláusula contratual formal incluída diretamente no seu contrato educacional. Caso o consulado do Brasil recuse o visto de estudante após a entrega da documentação completa, 85% dos valores pagos à escola são restituídos por transferência bancária em até 14 dias úteis após a notificação oficial.',
        },
        {
          q: 'Em quanto tempo a declaração oficial de matrícula é emitida?',
          a: 'Assim que o seu processo de inscrição é validado pela secretaria acadêmica em Brasília, sua declaração oficial autenticada conforme as exigências consulares é emitida em até 48 horas úteis e disponibilizada no seu portal do estudante.',
        },
        {
          q: 'O certificado CELPE-Bras permite ingressar em qualquer universidade no Brasil?',
          a: 'Sim. O CELPE-Bras é o único certificado de proficiência em língua portuguesa para estrangeiros reconhecido oficialmente pelo Ministério da Educação (MEC) do Brasil, sendo aceito por todas as universidades públicas e privadas do país.',
        },
      ],
    },
    footer: {
      ctaHeadline: 'Comece hoje mesmo o seu projeto de estudos no Brasil!',
      ctaSubhead:
        'Sua declaração oficial de matrícula e assessoria de visto entregues em menos de 48 horas.',
      inputPlaceholder: 'Digite seu e-mail ou número de WhatsApp...',
      submitBtn: 'Iniciar minha inscrição',
      bio: 'A Brasil·É oferece acompanhamento de excelência a estudantes internacionais: imersão em língua portuguesa, preparação para o exame oficial CELPE-Bras e mobilidade acadêmica para as melhores universidades do Brasil.',
      colPrograms: 'Nossos Cursos',
      programsList: [
        'Imersão Linguística (Brasília)',
        'Curso de Português Online ao Vivo',
        'Preparação Exame CELPE-Bras',
        'Curso Pré-Universitário Parceiro',
        'Fonética & Conversação',
      ],
      colAbout: 'Sobre a Brasil·É',
      aboutList: [
        { label: 'Por que Escolher o Brasil', href: '#formations' },
        { label: 'Universidades Parceiras', href: '#partenaires' },
        { label: 'Garantia Contratual de 85%', href: '#garantie' },
        { label: 'Processo de Visto VITEM IV', href: '#timeline' },
        { label: 'Perguntas Frequentes (FAQ)', href: '#faq' },
        { label: 'Termos Legais & Privacidade', href: '#garantie' },
      ],
      colCampuses: 'Nossos Campi',
      campusOnline: 'CAMPUS ONLINE',
    },
    auth: {
      loginTitle: 'Entrar',
      loginSubtitle: 'Digite suas credenciais para acessar o portal do estudante.',
      emailLabel: 'Endereço de e-mail',
      passwordLabel: 'Senha',
      passwordPlaceholder: 'Sua senha',
      rememberMe: 'Lembrar de mim',
      forgotPassword: 'Esqueceu a senha?',
      forgotAlert: 'Entre em contato com a secretaria pedagógica da Brasil·É para redefinir seu acesso.',
      loginBtn: 'Entrar',
      loggingIn: 'Entrando...',
      noAccount: 'Ainda não tem uma conta?',
      createAccount: 'Criar uma conta',
      welcomeBack: 'Bem-vindo(a) de volta',
      sessionOpen: 'Sua sessão está ativa. Você já pode acessar seu cronograma e declarações.',
      accessPortal: 'Acessar meu portal',
      regTitle: 'Iniciar minha inscrição',
      regSubtitle: 'Preencha seus dados para iniciar seu processo de estudos.',
      firstName: 'Nome *',
      lastName: 'Sobrenome *',
      phone: 'Telefone / WhatsApp *',
      levelTarget: 'Nível CECRL desejado *',
      studyMode: 'Modalidade de estudos *',
      modeInPerson: 'Presencial no Brasil (Visto VITEM IV)',
      modeOnline: '100% Online (À distância)',
      hostCity: 'Cidade de destino no Brasil *',
      targetUni: 'Universidade desejada (Opcional)',
      chooseLater: '-- Escolher depois --',
      otherUni: 'Outra universidade brasileira',
      residenceCountry: 'País de residência atual *',
      accountPassword: 'Senha para minha conta *',
      minChars: 'Mín. 8 caracteres',
      submitReg: 'Confirmar minha inscrição',
      submittingReg: 'Validando...',
      alreadyAccount: 'Já possui uma conta?',
      regSuccessTitle: 'Inscrição Realizada!',
      backHome: 'Voltar ao início',
    },
  },
};

interface LanguageContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  t: typeof translations.fr;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'fr',
  setLang: () => {},
  t: translations.fr,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('brasile_lang') as Language | null;
      if (saved === 'fr' || saved === 'en' || saved === 'pt') {
        return saved;
      }
    }
    return 'fr';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('brasile_lang', newLang);
      document.documentElement.lang = newLang === 'pt' ? 'pt-BR' : newLang;
    }
  };

  useEffect(() => {
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : lang;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
