export type Language = 'fr' | 'en';

export interface Translations {
  // Brand
  brandName: string;
  brandTagline: string;
  brandTaglineLong: string;

  // Navigation
  navDiscover: string;
  navAllOpportunities: string;
  navScholarships: string;
  navJobs: string;
  navFunding: string;
  navResources: string;
  navMyTracking: string;
  navSaved: string;
  navAdmin: string;

  // Mobile Bottom Bar
  mobileHome: string;
  mobileExplore: string;
  mobileTracking: string;
  mobileProfile: string;

  // Hero & Immediate Value Proposition
  heroBadge: string;
  heroTitlePrefix: string;
  heroTitleHighlight: string;
  heroTitleSuffix: string;
  heroSubtitle: string;
  heroCtaExplore: string;
  heroCtaTracking: string;
  heroCtaJoin: string;

  // Value Proposition Banner
  valPropHeading: string;
  valPropSubheading: string;
  valPillar1Title: string;
  valPillar1Desc: string;
  valPillar2Title: string;
  valPillar2Desc: string;
  valPillar3Title: string;
  valPillar3Desc: string;
  valPillar4Title: string;
  valPillar4Desc: string;

  // Audience Profiles
  profileStudent: string;
  profileGraduate: string;
  profileEntrepreneur: string;

  // Search & Filters
  searchPlaceholder: string;
  searchButton: string;
  recentSearches: string;
  activeSearchBadge: string;
  foundCount: string;
  clearSearch: string;
  filtersTitle: string;
  resetAllFilters: string;
  categoryLabel: string;
  countryLabel: string;
  levelLabel: string;
  fundingTypeLabel: string;
  formatLabel: string;
  paidOnly: string;
  deadlineLabel: string;
  sortByLabel: string;
  sortRelevance: string;
  sortDeadlineAsc: string;
  sortDeadlineDesc: string;

  // Empty states
  noResultsTitle: string;
  noResultsDesc: string;
  noResultsResetBtn: string;

  // Card & Detail
  verified: string;
  unverified: string;
  demoLabel: string;
  daysRemaining: string;
  daysPassed: string;
  saveBtn: string;
  savedBtn: string;
  viewDetailsBtn: string;
  addToTrackingBtn: string;
  appliedBtn: string;

  // Detail Modal
  modalDescription: string;
  modalEligibility: string;
  modalDocuments: string;
  modalBenefits: string;
  modalProcess: string;
  modalApplyOfficial: string;
  modalSource: string;
  modalAuditDate: string;
  modalReport: string;
  modalClose: string;
  modalShare: string;

  // Tracking Pipeline
  trackingTitle: string;
  trackingSubtitle: string;
  statusToDo: string;
  statusSubmitted: string;
  statusPending: string;
  statusAccepted: string;
  statusRejected: string;

  // Recommendations
  recommendationsTitle: string;
  recommendationsSubtitle: string;
  recommendationScore: string;

  // Android & Connectivity
  offlineNotice: string;
  onlineNotice: string;

  // Language switch
  switchLang: string;
}

export const translations: Record<Language, Translations> = {
  fr: {
    brandName: 'KOROYA',
    brandTagline: 'L\'Accélérateur d\'Opportunités Africaines',
    brandTaglineLong: 'Plateforme Panafricaine des Bourses, Carrières & Financements Vérifiés',

    navDiscover: 'Découvrir',
    navAllOpportunities: 'Toutes les opportunités',
    navScholarships: 'Bourses',
    navJobs: 'Emplois & Stages',
    navFunding: 'Entrepreneuriat',
    navResources: 'Ressources Officielles',
    navMyTracking: 'Mon Suivi',
    navSaved: 'Favoris',
    navAdmin: 'Administration',

    mobileHome: 'Accueil',
    mobileExplore: 'Explorer',
    mobileTracking: 'Mon Suivi',
    mobileProfile: 'Compte',

    heroBadge: 'RÉFÉRENTIEL OFFICIEL AFRIQUE DE L\'OUEST · CÔTE D\'IVOIRE & CAMES',
    heroTitlePrefix: 'Votre tremplin vers les',
    heroTitleHighlight: 'meilleures opportunités',
    heroTitleSuffix: 'en Afrique et dans le monde.',
    heroSubtitle: 'Bourses d’excellence vérifiées (MESRS Côte d’Ivoire, CAMES, Campus France), stages rémunérés, emplois qualifiés et financements d’amorçage en FCFA. 100% transparent, sans intermédiaires.',
    heroCtaExplore: 'Explorer les opportunités',
    heroCtaTracking: 'Suivre mes candidatures',
    heroCtaJoin: 'Créer mon profil gratuit',

    valPropHeading: 'La Garantie KOROYA : 4 Piliers Sans Compromis',
    valPropSubheading: 'Une plateforme conçue pour protéger et propulser la jeunesse africaine sans fausses promesses.',
    valPillar1Title: 'Bourses d\'Études Certifiées',
    valPillar1Desc: 'Alignement direct avec les programmes officiels du MESRS CI et de l\'Espace CAMES avec contrôle des dates réelles.',
    valPillar2Title: 'Emplois & Stages Rémunérés',
    valPillar2Desc: 'Postes qualifiés à Abidjan, Yamoussoukro, et missions en télétravail international avec montants en FCFA clairs.',
    valPillar3Title: 'Financements d\'Amorçage Réels',
    valPillar3Desc: 'Subventions d\'entrepreneuriat jusqu\'à 25 000 000 FCFA avec règlements de concours vérifiés par nos soins.',
    valPillar4Title: '100% Gratuit & Anti-Arnaque',
    valPillar4Desc: 'Zéro frais de dossier cachés. Tous les liens redirigent directement vers les formulaires des institutions d\'origine.',

    profileStudent: 'Étudiant & Chercheur',
    profileGraduate: 'Jeune Diplômé',
    profileEntrepreneur: 'Porteur de Projet',

    searchPlaceholder: 'Rechercher par mot-clé (ex: MESRS, CAMES, ingénieur, informatique, FCFA...)',
    searchButton: 'Rechercher',
    recentSearches: 'Recherches récentes',
    activeSearchBadge: 'Recherche active :',
    foundCount: 'opportunité(s) trouvée(s)',
    clearSearch: 'Effacer la recherche',
    filtersTitle: 'Filtrer avec précision',
    resetAllFilters: 'Réinitialiser tous les filtres',
    categoryLabel: 'Catégorie',
    countryLabel: 'Pays éligible',
    levelLabel: 'Niveau académique',
    fundingTypeLabel: 'Type de financement',
    formatLabel: 'Modalité de travail',
    paidOnly: 'Opportunités rémunérées en priorité',
    deadlineLabel: 'Délai restant',
    sortByLabel: 'Trier par',
    sortRelevance: 'Pertinence & Recommandation',
    sortDeadlineAsc: 'Clôture la plus proche',
    sortDeadlineDesc: 'Clôture la plus éloignée',

    noResultsTitle: 'Aucune opportunité ne correspond à ces critères',
    noResultsDesc: 'Essayez de simplifier vos termes de recherche ou de retirer certains filtres.',
    noResultsResetBtn: 'Réinitialiser tous les critères',

    verified: 'Vérifié',
    unverified: 'Contrôle en cours',
    demoLabel: 'DEMO',
    daysRemaining: 'j restants',
    daysPassed: 'Clôturé',
    saveBtn: 'Sauvegarder',
    savedBtn: 'Sauvegardé',
    viewDetailsBtn: 'Consulter la fiche',
    addToTrackingBtn: 'Ajouter à mon suivi',
    appliedBtn: 'Candidature enregistrée',

    modalDescription: 'Description & Contexte',
    modalEligibility: 'Critères d\'éligibilité stricts',
    modalDocuments: 'Pièces justificatives requises',
    modalBenefits: 'Prise en charge & Avantages',
    modalProcess: 'Procédure officielle de candidature',
    modalApplyOfficial: 'Postuler sur le portail officiel',
    modalSource: 'Source officielle documentée',
    modalAuditDate: 'Dernier contrôle documentaire',
    modalReport: 'Signaler un lien brisé ou une anomalie',
    modalClose: 'Fermer',
    modalShare: 'Partager cette opportunité',

    trackingTitle: 'Mon Pipeline Personnel de Candidatures',
    trackingSubtitle: 'Gérez vos démarches académiques et professionnelles avec rigueur et recevez des alertes avant les échéances.',
    statusToDo: 'À préparer',
    statusSubmitted: 'Candidature déposée',
    statusPending: 'En attente de réponse',
    statusAccepted: 'Retenue / Acceptée',
    statusRejected: 'Non retenue',

    recommendationsTitle: 'Opportunités Recommandées Pour Vous',
    recommendationsSubtitle: 'Sélectionnées par notre algorithme déterministe selon votre niveau, votre pays et vos centres d\'intérêt.',
    recommendationScore: 'Score de compatibilité',

    offlineNotice: 'Mode basse consommation / Connexion lente activée',
    onlineNotice: 'Connexion rétablie',

    switchLang: 'EN'
  },
  en: {
    brandName: 'KOROYA',
    brandTagline: 'Pan-African Opportunity Accelerator',
    brandTaglineLong: 'Pan-African Gateway for Verified Scholarships, Careers & Venture Funding',

    navDiscover: 'Discover',
    navAllOpportunities: 'All Opportunities',
    navScholarships: 'Scholarships',
    navJobs: 'Jobs & Internships',
    navFunding: 'Entrepreneurship',
    navResources: 'Official Resources',
    navMyTracking: 'My Applications',
    navSaved: 'Saved',
    navAdmin: 'Administration',

    mobileHome: 'Home',
    mobileExplore: 'Explore',
    mobileTracking: 'Tracking',
    mobileProfile: 'Account',

    heroBadge: 'OFFICIAL WEST AFRICAN DIRECTORY · CÔTE D\'IVOIRE & CAMES ACCORD',
    heroTitlePrefix: 'Your Launchpad for',
    heroTitleHighlight: 'Top Opportunities',
    heroTitleSuffix: 'in Africa and Beyond.',
    heroSubtitle: 'Verified academic scholarships (MESRS Ivory Coast, CAMES, Campus France), paid internships, graduate careers and seed funding in FCFA (XOF). 100% transparent, zero middlemen.',
    heroCtaExplore: 'Explore Opportunities',
    heroCtaTracking: 'Track My Applications',
    heroCtaJoin: 'Create Free Profile',

    valPropHeading: 'The KOROYA Guarantee: 4 Uncompromised Pillars',
    valPropSubheading: 'Engineered to safeguard and propel African youth with rigorous documentary proof.',
    valPillar1Title: 'Certified Scholarships',
    valPillar1Desc: 'Direct integration with official MESRS CI & CAMES institutional registries with strict deadline tracking.',
    valPillar2Title: 'Paid Internships & Careers',
    valPillar2Desc: 'High-caliber tech and business roles in Abidjan, Yamoussoukro, and global remote opportunities with transparent FCFA compensation.',
    valPillar3Title: 'Real Venture Seed Grants',
    valPillar3Desc: 'Non-dilutive entrepreneurship grants up to 25,000,000 FCFA backed by audited pan-African challenge terms.',
    valPillar4Title: '100% Free & Anti-Fraud',
    valPillar4Desc: 'Zero hidden application fees. Every listing routes directly to the verified original institution forms.',

    profileStudent: 'Student & Researcher',
    profileGraduate: 'Recent Graduate',
    profileEntrepreneur: 'Founder & Innovator',

    searchPlaceholder: 'Search by keyword (e.g. MESRS, CAMES, engineer, software, FCFA...)',
    searchButton: 'Search',
    recentSearches: 'Recent searches',
    activeSearchBadge: 'Active query:',
    foundCount: 'opportunity(ies) found',
    clearSearch: 'Clear search',
    filtersTitle: 'Filter with Precision',
    resetAllFilters: 'Reset all filters',
    categoryLabel: 'Category',
    countryLabel: 'Eligible Country',
    levelLabel: 'Academic Degree Level',
    fundingTypeLabel: 'Funding Type',
    formatLabel: 'Work Format',
    paidOnly: 'Paid opportunities only',
    deadlineLabel: 'Time Remaining',
    sortByLabel: 'Sort by',
    sortRelevance: 'Relevance & Best Match',
    sortDeadlineAsc: 'Closing Soonest',
    sortDeadlineDesc: 'Closing Furthest',

    noResultsTitle: 'No opportunities match your current filters',
    noResultsDesc: 'Try simplifying your search query or relaxing some of your filter criteria.',
    noResultsResetBtn: 'Reset all filters',

    verified: 'Verified',
    unverified: 'Under review',
    demoLabel: 'DEMO',
    daysRemaining: 'd remaining',
    daysPassed: 'Closed',
    saveBtn: 'Save',
    savedBtn: 'Saved',
    viewDetailsBtn: 'View Details',
    addToTrackingBtn: 'Add to My Tracking',
    appliedBtn: 'Application Tracked',

    modalDescription: 'Full Description & Context',
    modalEligibility: 'Strict Eligibility Criteria',
    modalDocuments: 'Required Supporting Documents',
    modalBenefits: 'Coverage & Financial Benefits',
    modalProcess: 'Official Application Procedure',
    modalApplyOfficial: 'Apply on Official Portal',
    modalSource: 'Audited Official Source',
    modalAuditDate: 'Last Documentary Audit',
    modalReport: 'Report Broken Link or Discrepancy',
    modalClose: 'Close',
    modalShare: 'Share this opportunity',

    trackingTitle: 'My Application Tracker & Pipeline',
    trackingSubtitle: 'Manage your academic and career applications with structured tracking and timely deadline reminders.',
    statusToDo: 'To Prepare',
    statusSubmitted: 'Submitted',
    statusPending: 'Awaiting Feedback',
    statusAccepted: 'Accepted / Selected',
    statusRejected: 'Not Selected',

    recommendationsTitle: 'Recommended Opportunities For You',
    recommendationsSubtitle: 'Curated by our deterministic scoring engine matching your degree level, priority countries, and interests.',
    recommendationScore: 'Match Score',

    offlineNotice: 'Low-bandwidth mode / Slow connection detected',
    onlineNotice: 'Back online',

    switchLang: 'FR'
  }
};
