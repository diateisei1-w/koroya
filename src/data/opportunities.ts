export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  category: 'scholarship' | 'job' | 'internship' | 'entrepreneurship' | 'funding' | 'training' | 'mobility';
  eligibleCountries: string[];
  location: string;
  targetAudience: string;
  educationLevel: 'Bac' | 'Bac+2' | 'Bac+3 (Licence)' | 'Bac+5 (Master)' | 'Doctorat' | 'Tous niveaux';
  field: string;
  deadline: string; // YYYY-MM-DD
  fundingAmount: string; // In FCFA or detailed description
  fundingType: 'full' | 'partial' | 'grant' | 'salary' | 'stipend' | 'unpaid';
  format: 'remote' | 'hybrid' | 'on_site';
  experienceLevel: 'student' | 'beginner' | 'intermediate' | 'senior';
  isPaid: boolean;
  description: string;
  eligibility: string[];
  requiredDocuments: string[];
  benefits: string[];
  applicationProcess: string[];
  officialUrl: string;
  source: string;
  lastVerifiedDate: string;
  isVerified: boolean;
  isDemo: boolean;
  featured?: boolean;
}

export interface InstitutionalResource {
  id: string;
  title: string;
  authority: string;
  category: 'MESRS' | 'CAMES' | 'International' | 'Equivalence';
  description: string;
  link: string;
  keyPoints: string[];
  officialBadge: string;
}

export const DEMO_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-ci-mesrs-01',
    title: 'Programme National de Bourses d’Excellence Master & Doctorat 2026',
    organization: 'MESRS CI — Direction Générale de l’Enseignement Supérieur',
    category: 'scholarship',
    eligibleCountries: ['Côte d’Ivoire'],
    location: 'Abidjan / Universités Publiques de Côte d’Ivoire',
    targetAudience: 'Étudiants ivoiriens titulaires d’une Licence ou d’un Master avec mention',
    educationLevel: 'Bac+5 (Master)',
    field: 'Sciences, Technologies, Ingénierie & Mathématiques (STIM)',
    deadline: '2026-05-30',
    fundingAmount: '1 800 000 FCFA / an + exonération scolarité',
    fundingType: 'full',
    format: 'on_site',
    experienceLevel: 'student',
    isPaid: true,
    description: 'Le Ministère de l’Enseignement Supérieur et de la Recherche Scientifique de Côte d’Ivoire attribue des allocations d’études supérieures aux étudiants ivoiriens méritants inscrits dans les universités publiques et écoles nationales supérieures pour les cycles Master recherche et Doctorat.',
    eligibility: [
      'Nationalité ivoirienne exclusive au moment du dépôt',
      'Âgé de 28 ans au plus pour le Master et 32 ans au plus pour le Doctorat',
      'Avoir obtenu au minimum une mention Assez Bien en Licence ou Master 1',
      'Inscription effective dans un établissement public accrédité MESRS / CAMES'
    ],
    requiredDocuments: [
      'Certificat de nationalité ivoirienne (original ou copie certifiée)',
      'Relevés de notes universitaires de la L1 à la L3 certifiés par la scolarité centrale',
      'Attestation de réussite ou diplôme de Licence',
      'Projet de recherche visé par le directeur de laboratoire / école doctorale (Doctorat)',
      'Curriculum Vitae actualisé et lettre de motivation motivant le choix de la filière prioritaire'
    ],
    benefits: [
      'Allocation financière annuelle de 1 800 000 FCFA versée trimestriellement',
      'Prise en charge intégrale des frais institutionnels d’inscription universitaire',
      'Subvention de recherche documentaire et accès prioritaire aux bibliothèques universitaires'
    ],
    applicationProcess: [
      'Étape 1 : Pré-inscription sur la plateforme dématérialisée de la Direction des Bourses du MESRS (bourses.enseignement.gouv.ci)',
      'Étape 2 : Dépôt physique du dossier vérifié à la scolarité de votre université d’attache',
      'Étape 3 : Examen par la Commission Nationale d’Attribution des Bourses',
      'Étape 4 : Publication officielle des résultats sur le portail ministériel et affichage sur campus'
    ],
    officialUrl: 'https://mesrs.gouv.ci/bourses-et-aides-aux-etudiants',
    source: 'Direction des Bourses d’Études et Secours — MESRS Côte d’Ivoire',
    lastVerifiedDate: '2026-04-12',
    isVerified: true,
    isDemo: true,
    featured: true
  },
  {
    id: 'opp-cames-pred-02',
    title: 'Bourses d’Excellence Universitaire Sous-Régionale CAMES 2026',
    organization: 'CAMES (Conseil Africain et Malgache pour l’Enseignement Supérieur)',
    category: 'mobility',
    eligibleCountries: ['Côte d’Ivoire', 'Sénégal', 'Cameroun', 'Bénin', 'Togo', 'Burkina Faso', 'Mali', 'Niger', 'Guinée'],
    location: 'Réseau des Universités membres de l’Espace CAMES',
    targetAudience: 'Étudiants en Master 2 et jeunes chercheurs ressortissants des 19 États membres du CAMES',
    educationLevel: 'Bac+5 (Master)',
    field: 'Santé Publique, Agro-développement, Énergies Renouvelables',
    deadline: '2026-06-15',
    fundingAmount: '3 600 000 FCFA / an + frais de mobilité',
    fundingType: 'full',
    format: 'on_site',
    experienceLevel: 'student',
    isPaid: true,
    description: 'Le Conseil Africain et Malgache pour l’Enseignement Supérieur (CAMES) encourage la mobilité académique intra-africaine par le biais de son Programme de Bourses de Recherche Sud-Sud, récompensant les programmes reconnus par le PRED (Programme de Reconnaissance et d’Équivalence des Diplômes).',
    eligibility: [
      'Être ressortissant de l’un des 19 États membres signataires de la Convention de Lomé (CAMES)',
      'Être titulaire d’un diplôme de Master délivré par une filière accréditée CAMES',
      'Présenter un projet de recherche portant sur les défis prioritaires du développement africain',
      'Justifier d’un accord d’accueil d’une université partenaire dans un autre pays de l’Espace CAMES'
    ],
    requiredDocuments: [
      'Formulaire officiel de candidature CAMES dument renseigné',
      'Copie légalisée de l’attestation d’équivalence ou de reconnaissance CAMES du diplôme',
      'Lettre d’acceptation formelle du laboratoire d’accueil sous-régional',
      'Protocole de recherche succinct (5 pages maximum)',
      'Deux lettres de recommandation académiques signées par des professeurs de rang A'
    ],
    benefits: [
      'Indemnité mensuelle de subsistance de 300 000 FCFA (soit 3 600 000 FCFA pour l’année académique)',
      'Billet d’avion aller-retour pays d’origine - pays d’accueil',
      'Couverture d’assurance santé et rapatriement sanitaire pendant la durée de la mobilité'
    ],
    applicationProcess: [
      'Étape 1 : Création du compte candidat sur la plateforme institutionnelle CAMES (lecames.org)',
      'Étape 2 : Transmission en ligne du dossier documentaire certifié conforme',
      'Étape 3 : Évaluation par les experts des Comités Consultatifs Interafricains (CCI)',
      'Étape 4 : Notification individuelle et délivrance de l’attestation de bourse de mobilité'
    ],
    officialUrl: 'https://www.lecames.org/programmes/bourses-et-mobilite',
    source: 'Secrétariat Général du CAMES — Département de l’Assurance Qualité',
    lastVerifiedDate: '2026-04-05',
    isVerified: true,
    isDemo: true,
    featured: true
  },
  {
    id: 'opp-orange-fab-03',
    title: 'Stage Professionnel Pré-Embauche : Développeur Cloud & Sécurité Web',
    organization: 'Orange Digital Center & Orange Côte d’Ivoire',
    category: 'internship',
    eligibleCountries: ['Côte d’Ivoire'],
    location: 'Abidjan — Plateau / Hybride',
    targetAudience: 'Étudiants en fin de cycle ingénieur ou jeunes diplômés en informatique',
    educationLevel: 'Bac+3 (Licence)',
    field: 'Informatique & Numérique',
    deadline: '2026-05-18',
    fundingAmount: '250 000 FCFA / mois + transport & cantine',
    fundingType: 'stipend',
    format: 'hybrid',
    experienceLevel: 'beginner',
    isPaid: true,
    description: 'Orange Digital Center Abidjan recrute 8 stagiaires pour une immersion pratique de 6 mois au sein du pôle Cyber-résilience et Cloud. Le stage comporte une perspective directe d’intégration en CDI pour les candidats performants.',
    eligibility: [
      'Niveau Bac+3 à Bac+5 en Informatique, Télécoms ou Génie Logiciel (ESATIC, INP-HB, UFHB ou équivalent)',
      'Maîtrise des bases de TypeScript / JavaScript moderne, Linux, protocoles HTTP et sécurité applicative (OWASP)',
      'Capacité démontrée à collaborer au sein d’une équipe agile',
      'Disponibilité immédiate à temps plein à Abidjan'
    ],
    requiredDocuments: [
      'CV synthétique mentionnant les projets personnels ou académiques (lien GitHub bienvenu)',
      'Lettre de motivation exposant l’intérêt pour les télécommunications et le Cloud',
      'Copie du dernier diplôme ou attestation d’inscription de l’année académique'
    ],
    benefits: [
      'Indemnité mensuelle de stage garantie de 250 000 FCFA',
      'Pass mensuel de transport urbain Abidjanais (SOTRA / VTC) pris en charge',
      'Mentorat technique direct assuré par des ingénieurs seniors certifiés Cloud & DevSecOps',
      'Évaluation à 6 mois pour proposition de contrat à durée indéterminée (CDI)'
    ],
    applicationProcess: [
      'Étape 1 : Dépôt du CV et portfolio sur le portail carrières Orange CI',
      'Étape 2 : Test technique en ligne (45 min d’algorithmique et sécurité web)',
      'Étape 3 : Entretien technique et RH dans les locaux de l’Orange Digital Center Abidjan',
      'Étape 4 : Démarrage de la cohorte le premier jour ouvré du mois suivant'
    ],
    officialUrl: 'https://orangedigitalcenters.com/country/ci',
    source: 'Orange Digital Center Abidjan — Pôle Talents',
    lastVerifiedDate: '2026-04-18',
    isVerified: true,
    isDemo: true,
    featured: true
  },
  {
    id: 'opp-boad-agri-04',
    title: 'Fonds d’Amorçage AgriTech & Climat pour Jeunes Entrepreneurs UEMOA',
    organization: 'Banque Ouest Africaine de Développement (BOAD)',
    category: 'funding',
    eligibleCountries: ['Côte d’Ivoire', 'Sénégal', 'Bénin', 'Togo', 'Burkina Faso', 'Mali', 'Niger', 'Guinée-Bissau'],
    location: 'Zone UEMOA (Projets implantés localement)',
    targetAudience: 'Fondateurs de startups et PME innovantes âgés de 18 à 35 ans',
    educationLevel: 'Tous niveaux',
    field: 'Agronomie & Environnement',
    deadline: '2026-06-30',
    fundingAmount: '15 000 000 FCFA (Subvention non remboursable)',
    fundingType: 'grant',
    format: 'hybrid',
    experienceLevel: 'intermediate',
    isPaid: true,
    description: 'Facilité financière d’appui direct pour les projets émergents qui déploient des solutions technologiques ou durables pour accroître la souveraineté alimentaire, la valorisation des récoltes et l’irrigation solaire dans les pays membres de l’UEMOA.',
    eligibility: [
      'Avoir entre 18 et 35 ans révolus à la date de soumission',
      'Entreprise ou coopérative légalement enregistrée dans un État membre de l’UEMOA (ex: RCCM en Côte d’Ivoire)',
      'Avoir développé au minimum un prototype opérationnel (MVP) ou un premier niveau de traction commerciale',
      'Démontrer un impact environnemental mesurable et la création d’emplois pour les jeunes'
    ],
    requiredDocuments: [
      'Extrait du Registre de Commerce et du Crédit Mobilier (RCCM) ou Déclaration fiscale d’existence',
      'Business Plan et prévisionnel financier sur 3 exercices comptables',
      'Fiche technique du projet (maximum 10 pages) précisant la méthodologie et l’impact social',
      'Pièces d’identité officielles des fondateurs dirigeants'
    ],
    benefits: [
      'Subvention directe d’amorçage de 15 000 000 FCFA non remboursable et sans prise de participation',
      'Programme d’accélération de 6 mois avec des experts agronomes et banquiers d’affaires',
      'Mise en relation avec le pool de banques commerciales partenaires de la BOAD pour financements complémentaires'
    ],
    applicationProcess: [
      'Étape 1 : Renseignement du formulaire de candidature sur la plateforme de la BOAD',
      'Étape 2 : Pré-sélection sur dossier par le comité technique d’évaluation des risques',
      'Étape 3 : Session de pitch devant le jury d’investissement réuni à Abidjan et en visio-conférence',
      'Étape 4 : Audit de conformité juridique et décaissement échelonné des fonds'
    ],
    officialUrl: 'https://www.boad.org/projets-financements',
    source: 'BOAD — Département Développement Durable & PME',
    lastVerifiedDate: '2026-04-10',
    isVerified: true,
    isDemo: true,
    featured: true
  },
  {
    id: 'opp-auf-mobilite-05',
    title: 'Programme d’Échange et Bourse de Mobilité Doctorale Afrique-France',
    organization: 'AUF (Agence Universitaire de la Francophonie) Afrique de l’Ouest',
    category: 'mobility',
    eligibleCountries: ['Côte d’Ivoire', 'Sénégal', 'Cameroun', 'Bénin', 'Togo'],
    location: 'Côte d’Ivoire / France (Séjour de recherche de 6 mois)',
    targetAudience: 'Doctorants inscrits en cotutelle ou codirection dans un établissement membre de l’AUF',
    educationLevel: 'Doctorat',
    field: 'Sciences de la Santé, Biotechnologies & Transition Écologique',
    deadline: '2026-05-25',
    fundingAmount: '5 500 000 FCFA forfait global séjour',
    fundingType: 'full',
    format: 'hybrid',
    experienceLevel: 'student',
    isPaid: true,
    description: 'Soutien aux thèses en cotutelle internationale pour faciliter l’accès aux plateformes techniques de pointe et renforcer les partenariats scientifiques entre les laboratoires ouest-africains et les institutions francophones partenaires.',
    eligibility: [
      'Être inscrit en 2e ou 3e année de doctorat dans une université ivoirienne ou ouest-africaine membre de l’AUF',
      'Convention de cotutelle signée ou en cours d’homologation par les deux universités partenaires',
      'Avoir un avis favorable motivé des deux codirecteurs de thèse',
      'Niveau de langue française C1 certifié ou attesté par la scolarité'
    ],
    requiredDocuments: [
      'Copie de la convention de thèse signée',
      'Avis circonstancié et motivé des codirecteurs de recherche',
      'Calendrier détaillé des travaux de laboratoire prévus durant la mobilité de 6 mois',
      'Relevés de notes de Master et diplôme d’Ingénieur ou de Master'
    ],
    benefits: [
      'Bourse forfaitaire de 900 000 FCFA par mois de présence effective au laboratoire hôte (soit 5 400 000 FCFA)',
      'Billet d’avion aller-retour Abidjan - Paris pris en charge directement par l’AUF',
      'Assurance responsabilité civile, santé et assistance rapatriement'
    ],
    applicationProcess: [
      'Étape 1 : Dépôt de candidature sur le portail régional AUF (auf.org/bourses)',
      'Étape 2 : Transmission de la validation institutionnelle par la Présidence de l’Université d’origine',
      'Étape 3 : Délibération de la commission scientifique régionale',
      'Étape 4 : Signature de la convention tripartite et délivrance des attestations consulaires'
    ],
    officialUrl: 'https://www.auf.org/moyen-orient-afrique/bourses-et-appels/',
    source: 'Direction Régionale Afrique de l’Ouest — AUF',
    lastVerifiedDate: '2026-04-14',
    isVerified: true,
    isDemo: true
  },
  {
    id: 'opp-job-inphb-tech-06',
    title: 'Ingénieur DevOps & Infrastructure Réseau (CDI)',
    organization: 'FinTech Panafricaine & Partenaires UEMOA',
    category: 'job',
    eligibleCountries: ['Côte d’Ivoire', 'Sénégal'],
    location: 'Abidjan — Cocody Deux-Plateaux',
    targetAudience: 'Ingénieurs diplômés avec 2 à 4 ans d’expérience',
    educationLevel: 'Bac+5 (Master)',
    field: 'Informatique & Numérique',
    deadline: '2026-05-10',
    fundingAmount: '1 200 000 FCFA à 1 600 000 FCFA net / mois',
    fundingType: 'salary',
    format: 'hybrid',
    experienceLevel: 'intermediate',
    isPaid: true,
    description: 'Poste en CDI pour piloter la résilience des microservices de paiement instantané mobile money et cartes bancaires. Gestion des clusters Kubernetes, intégration continue et conformité de sécurité bancaire PCI-DSS.',
    eligibility: [
      'Diplôme d’Ingénieur d’État ou Master 2 en Informatique (INP-HB, ESATIC, 2iE ou équivalent reconnu CAMES)',
      'Minimum 2 années d’expérience concrète sur des environnements de production Cloud (AWS, GCP ou bare-metal)',
      'Connaissance solide de Docker, Kubernetes, Terraform et des pipelines GitLab CI / GitHub Actions',
      'Rigueur exemplaire en matière de sécurité des transactions financières'
    ],
    requiredDocuments: [
      'CV à jour détaillé avec liste des architectures déployées',
      'Lettre de motivation',
      'Copies certifiées des diplômes académiques et attestations de travail'
    ],
    benefits: [
      'Rémunération nette de 1 200 000 à 1 600 000 FCFA par mois selon profil et expérience',
      'Assurance santé famille prise en charge à 90% (cliniques de référence à Abidjan)',
      'Budget annuel de formation et certification professionnelle (AWS / CKA)',
      'Politique de télétravail flexible (2 jours par semaine)'
    ],
    applicationProcess: [
      'Étape 1 : Transmission de candidature sur la plateforme recrutement',
      'Étape 2 : Échange téléphonique RH de qualification',
      'Étape 3 : Challenge technique pratique sur infrastructure bac à sable',
      'Étape 4 : Entretien avec le Directeur Technique (CTO) et offre contractuelle'
    ],
    officialUrl: 'https://emploici.com/recrutement-technologie',
    source: 'Portail Recrutement Cadres & Experts CI',
    lastVerifiedDate: '2026-04-16',
    isVerified: true,
    isDemo: true
  },
  {
    id: 'opp-campfrance-master-07',
    title: 'Bourses d’Études Eiffel & Coopération Franco-Ivoirienne 2026-2027',
    organization: 'Campus France Côte d’Ivoire & Ambassade de France',
    category: 'scholarship',
    eligibleCountries: ['Côte d’Ivoire'],
    location: 'Universités et Grandes Écoles en France',
    targetAudience: 'Étudiants ivoiriens de niveau Licence 3 ou Master 1 en cours',
    educationLevel: 'Bac+3 (Licence)',
    field: 'Ingénierie, Économie, Droit & Sciences Politiques',
    deadline: '2026-06-01',
    fundingAmount: '780 000 FCFA / mois (allocation de vie) + voyage',
    fundingType: 'full',
    format: 'on_site',
    experienceLevel: 'student',
    isPaid: true,
    description: 'Programme de bourses d’excellence financé par le Ministère de l’Europe et des Affaires Étrangères pour permettre aux meilleurs talents ivoiriens de poursuivre un cursus de Master 2 ou d’Ingénieur dans un établissement d’enseignement supérieur français.',
    eligibility: [
      'Nationalité ivoirienne',
      'Être âgé de 25 ans au maximum pour le niveau Master à la date de sélection',
      'Excellence académique : moyenne générale supérieure ou égale à 14/20 tout au long du cursus universitaire',
      'Candidature obligatoirement présentée par un établissement d’enseignement supérieur français d’accueil'
    ],
    requiredDocuments: [
      'Dossier de candidature Campus France Côte d’Ivoire complet',
      'Tous les relevés de notes de l’enseignement supérieur (BAC jusqu’à la dernière année validée)',
      'Projet professionnel argumenté et cohérent avec les besoins économiques de la Côte d’Ivoire',
      'Test de français ou attestation de scolarité dans un cursus francophone'
    ],
    benefits: [
      'Allocation mensuelle de subsistance de 1 181 € (environ 775 000 FCFA / mois)',
      'Billet d’avion international aller-retour',
      'Prise en charge de la couverture sociale et des activités culturelles',
      'Statut de boursier du Gouvernement Français ouvrant droit aux résidences universitaires CROUS'
    ],
    applicationProcess: [
      'Étape 1 : Prise de contact avec les universités françaises et acceptation académique',
      'Étape 2 : Transmission du dossier par l’université d’accueil à Campus France Paris',
      'Étape 3 : Commission d’attribution par jury d’experts indépendants',
      'Étape 4 : Démarches visas simplifiées auprès de Campus France Abidjan'
    ],
    officialUrl: 'https://ivoire.campusfrance.org/bourses-d-etudes',
    source: 'Campus France Abidjan — Espace Études Supérieures',
    lastVerifiedDate: '2026-04-11',
    isVerified: true,
    isDemo: true
  },
  {
    id: 'opp-concours-crea-ci-08',
    title: 'Concours National de l’Innovation & Entrepreneuriat Jeunes (Édition 2026)',
    organization: 'Agence Emploi Jeunes (AEJ Côte d’Ivoire) & Ministère Promotion Jeunesse',
    category: 'entrepreneurship',
    eligibleCountries: ['Côte d’Ivoire'],
    location: 'Abidjan / Bouaké / Korhogo / San-Pedro',
    targetAudience: 'Jeunes Ivoiriens âgés de 18 à 35 ans porteurs d’un projet d’entreprise viable',
    educationLevel: 'Tous niveaux',
    field: 'Artisanat moderne, Agro-industrie, Économie circulaire & TIC',
    deadline: '2026-05-15',
    fundingAmount: 'Prix 1er Lauréat : 10 000 000 FCFA + Accompagnement',
    fundingType: 'grant',
    format: 'on_site',
    experienceLevel: 'beginner',
    isPaid: true,
    description: 'Concours officiel d’impulsion économique organisé par l’Agence Emploi Jeunes pour primer les 20 meilleurs projets d’entreprises portés par des jeunes Ivoiriens sur l’ensemble du territoire national avec un appui direct au plan de financement.',
    eligibility: [
      'Être de nationalité ivoirienne et âgé de 18 à 35 ans',
      'Être inscrit sur la plateforme de l’Agence Emploi Jeunes (agenceemploi-jeunes.ci)',
      'Avoir une idée d’entreprise innovante ou une unité de production en phase de démarrage',
      'S’engager à suivre le programme de renforcement des capacités en gestion d’entreprise'
    ],
    requiredDocuments: [
      'Fiche de synthèse du projet d’entreprise (modèle téléchargeable sur le site AEJ)',
      'Copie de la Carte Nationale d’Identité (CNI) ou Passeport ivoirien',
      'Devis estimatif des équipements ou investissements matériels sollicités',
      'Curriculum Vitae du porteur de projet'
    ],
    benefits: [
      'Dotations financières : 1er prix (10 000 000 FCFA), 2e prix (7 000 000 FCFA), 3e prix (5 000 000 FCFA)',
      '17 prix d’encouragement de 2 000 000 FCFA chacun',
      'Hébergement en pépinière d’entreprises pendant 1 an offert',
      'Coaching personnalisé en gestion comptable et formalisation administrative'
    ],
    applicationProcess: [
      'Étape 1 : Inscription en ligne sur la plateforme du concours (agenceemploi-jeunes.ci/concours)',
      'Étape 2 : Dépôt du plan d’affaires simplifié dans l’une des agences régionales AEJ',
      'Étape 3 : Boot-camp de préparation pour les 50 demi-finalistes régionaux',
      'Étape 4 : Grande finale nationale à Abidjan retransmise en direct'
    ],
    officialUrl: 'https://agenceemploi-jeunes.ci',
    source: 'Agence Emploi Jeunes (AEJ) — Ministère de la Promotion de la Jeunesse CI',
    lastVerifiedDate: '2026-04-15',
    isVerified: true,
    isDemo: true
  },
  {
    id: 'opp-training-ia-09',
    title: 'Programme de Certification Intensive en Intelligence Artificielle & Data',
    organization: 'Institut National Polytechnique Félix Houphouët-Boigny (INP-HB) & Partenaires',
    category: 'training',
    eligibleCountries: ['Côte d’Ivoire', 'Sénégal', 'Cameroun', 'Bénin', 'Togo'],
    location: 'Yamoussoukro / Hybride',
    targetAudience: 'Étudiants et professionnels désireux de maîtriser la science des données et le Machine Learning',
    educationLevel: 'Bac+2',
    field: 'Informatique & Numérique',
    deadline: '2026-06-10',
    fundingAmount: 'Prise en charge à 80% (Reste à charge étudiant : 50 000 FCFA)',
    fundingType: 'partial',
    format: 'hybrid',
    experienceLevel: 'beginner',
    isPaid: false,
    description: 'Bootcamp immersif de 12 semaines certifié par l’INP-HB et reconnu par le réseau des écoles d’ingénieurs de l’Espace CAMES. Couvre Python scientifique, SQL avancé, modélisation prédictive et déploiement de modèles d’IA.',
    eligibility: [
      'Niveau minimum Bac+2 en filière scientifique, mathématique ou informatique',
      'Réussite au test de positionnement en ligne (bases d’algorithmique et calcul matriciel)',
      'Disposer d’un ordinateur portable fonctionnel et d’une connexion Internet stable'
    ],
    requiredDocuments: [
      'Copie du diplôme de Baccalauréat et dernier relevé de notes',
      'Pièce d’identité officielle en cours de validité',
      'Lettre d’engagement d’assiduité pour la durée complète du bootcamp'
    ],
    benefits: [
      'Certificat d’aptitude professionnelle conjoint INP-HB et partenaires industriels',
      'Subvention de 80% des frais pédagogiques habituels',
      'Accès aux serveurs GPU de calcul de l’INP-HB Yamoussoukro pour les projets pratiques',
      'Session de job dating avec 15 entreprises du secteur bancaire, télécoms et logistique'
    ],
    applicationProcess: [
      'Étape 1 : Candidature sur le portail de formation continue de l’INP-HB',
      'Étape 2 : Test technique d’aptitude en ligne (Python / logique mathématique)',
      'Étape 3 : Confirmation de sélection et règlement des frais d’inscription réduits',
      'Étape 4 : Début des sessions le 1er juillet 2026'
    ],
    officialUrl: 'https://inphb.ci/formations-certifiantes',
    source: 'Direction de la Formation Continue — INP-HB Yamoussoukro',
    lastVerifiedDate: '2026-04-08',
    isVerified: true,
    isDemo: true
  }
];

export const INSTITUTIONAL_RESOURCES: InstitutionalResource[] = [
  {
    id: 'res-mesrs-bourses',
    title: 'Portail des Bourses et Aides aux Étudiants — MESRS Côte d’Ivoire',
    authority: 'Ministère de l’Enseignement Supérieur et de la Recherche Scientifique (Côte d’Ivoire)',
    category: 'MESRS',
    description: 'Source officielle des critères d’attribution des bourses nationales, bourses de coopération bilatérale (France, Maroc, Chine, Tunisie) et secours financiers pour les étudiants ivoiriens.',
    link: 'https://mesrs.gouv.ci',
    officialBadge: 'Source d’État CI',
    keyPoints: [
      'Conditions d’âge strictes : 26 ans max en Licence, 28 ans max en Master, 32 ans en Doctorat',
      'Calendrier officiel annuel des commissions nationales d’attribution',
      'Procédure de réclamation et de contrôle des listes d’attribution publiées',
      'Service d’équivalence des diplômes étrangers délivrés par la commission officielle du MESRS'
    ]
  },
  {
    id: 'res-cames-reconnaissance',
    title: 'Programme de Reconnaissance et d’Équivalence des Diplômes (PRED) — CAMES',
    authority: 'Secrétariat Général du CAMES (19 États Membres)',
    category: 'CAMES',
    description: 'Référentiel académique supranational garantissant qu’une filière d’études ou un diplôme délivré par un établissement privé ou public respecte les normes de qualité du CAMES.',
    link: 'https://www.lecames.org',
    officialBadge: 'Organisation Panafricaine',
    keyPoints: [
      'Consultez la liste des diplômes homologués PRED avant toute inscription dans le privé',
      'Garantie de poursuite d’études sans obstacle dans les 19 pays signataires de la convention',
      'Reconnaissance automatique des grades de Professeurs et Maîtres de Conférences (CCI)',
      'Guide du système LMD (Licence en 180 crédits, Master en 120 crédits, Doctorat)'
    ]
  },
  {
    id: 'res-mesrs-etablissements',
    title: 'Répertoire Officiel des Établissements Privés Autorisés d’Enseignement Supérieur',
    authority: 'Direction Générale de l’Enseignement Supérieur (DGES-MESRS)',
    category: 'Equivalence',
    description: 'Liste actualisée des grandes écoles et universités privées détenant un agrément d’ouverture et d’habilitation de filières délivré par le gouvernement ivoirien.',
    link: 'https://mesrs.gouv.ci/etablissements-agrees',
    officialBadge: 'Registre Public',
    keyPoints: [
      'Vérifiez impérativement si la filière spécifique est habilitée, et pas seulement l’établissement',
      'Seuls les diplômes d’établissements agréés peuvent prétendre aux concours de la fonction publique ivoirienne',
      'Différence entre autorisation de création (étape 1) et arrêté d’homologation des diplômes (étape 2)'
    ]
  },
  {
    id: 'res-auf-campus',
    title: 'Agence Universitaire de la Francophonie & Campus France Côte d’Ivoire',
    authority: 'Organisations de Coopération Universitaire Internationale',
    category: 'International',
    description: 'Guides pratiques pour préparer un dossier de mobilité internationale, obtenir des certifications de langue et postuler aux programmes de bourses d’études d’excellence.',
    link: 'https://ivoire.campusfrance.org',
    officialBadge: 'Coopération Internationale',
    keyPoints: [
      'Procédure Études en France obligatoire pour les candidatures universitaires en France',
      'Centres d’Employabilité Francophones (CEF) de l’AUF à Abidjan (UFHB Cocody)',
      'Accompagnement gratuit pour la structuration de projets de recherche et d’entrepreneuriat étudiant'
    ]
  }
];

export const CATEGORY_INFO: Record<string, { label: string; icon: string; count: number; color: string; desc: string }> = {
  all: { label: 'Toutes les opportunités', icon: 'Compass', count: DEMO_OPPORTUNITIES.length, color: 'bg-emerald-500', desc: 'Découvrez l’intégralité des bourses, emplois et financements.' },
  scholarship: { label: 'Bourses d’Études', icon: 'GraduationCap', count: DEMO_OPPORTUNITIES.filter(o => o.category === 'scholarship').length, color: 'bg-blue-600', desc: 'Bourses d’excellence nationales MESRS et coopération internationale.' },
  internship: { label: 'Stages & Alternance', icon: 'FileText', count: DEMO_OPPORTUNITIES.filter(o => o.category === 'internship').length, color: 'bg-emerald-600', desc: 'Stages rémunérés en entreprise et immersion professionnelle.' },
  job: { label: 'Emplois & CDI', icon: 'Briefcase', count: DEMO_OPPORTUNITIES.filter(o => o.category === 'job').length, color: 'bg-indigo-600', desc: 'Postes qualifiés et opportunités de carrière en Côte d’Ivoire.' },
  funding: { label: 'Financements & Subventions', icon: 'Award', count: DEMO_OPPORTUNITIES.filter(o => o.category === 'funding').length, color: 'bg-amber-600', desc: 'Subventions en FCFA pour projets agricoles, tech et innovants.' },
  entrepreneurship: { label: 'Entrepreneuriat & Concours', icon: 'Sparkles', count: DEMO_OPPORTUNITIES.filter(o => o.category === 'entrepreneurship').length, color: 'bg-purple-600', desc: 'Prix, incubation et concours pour jeunes créateurs d’entreprises.' },
  mobility: { label: 'Mobilité Internationale', icon: 'Globe', count: DEMO_OPPORTUNITIES.filter(o => o.category === 'mobility').length, color: 'bg-teal-600', desc: 'Séjours de recherche et programmes d’échange CAMES & AUF.' },
  training: { label: 'Formations & Certifications', icon: 'BookOpen', count: DEMO_OPPORTUNITIES.filter(o => o.category === 'training').length, color: 'bg-rose-600', desc: 'Formations intensives aux métiers porteurs du numérique.' }
};
