import React, { useState, useEffect, useMemo } from 'react';
import {
  Compass,
  Bookmark,
  Award,
  BarChart3,
  Building2,
  ShieldCheck,
  Info,
  Globe,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  X,
  FileText,
  UserCheck,
  Send,
  Calendar,
  MapPin,
  Briefcase,
  GraduationCap,
  Sparkles,
  BookOpen,
  ArrowRight,
  RefreshCw,
  Eye,
  AlertCircle,
  Check,
  Layers,
  Clock,
  Heart,
  Menu
} from 'lucide-react';

/* ==========================================================================
   1. TYPES & DATA STRUCTURES
   ========================================================================== */

export type Language = 'fr' | 'en' | 'ar' | 'pt' | 'es' | 'zh' | 'de';

export type Category =
  | 'job'
  | 'internship'
  | 'scholarship'
  | 'training'
  | 'funding'
  | 'call_for_projects'
  | 'volunteering'
  | 'partnership';

export type VerificationStatus =
  | 'documented_official'
  | 'pending_confirmation'
  | 'anomaly_detected'
  | 'not_confirmed'
  | 'not_performed';

export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  category: Category;
  sector: string;
  audience: string;
  location: string;
  deadline: string;
  originalLanguage: string;
  officialSource: string;
  sourceUrl: string;
  lastCheckedDate: string;
  verificationStatus: VerificationStatus;
  description: string;
  eligibility: string[];
  requiredSkills: string[];
  isDemo: boolean;
}

export interface SubmittedOpportunity {
  id: string;
  title: string;
  organization: string;
  category: Category;
  sector: string;
  audience: string;
  location: string;
  deadline: string;
  officialUrl: string;
  description: string;
  submittedAt: string;
  status: 'PENDING_REVIEW';
}

export interface VerificationCheckResult {
  country: string;
  institution: string;
  qualification: string;
  field: string;
  awardingBody: string;
  graduationYear: string;
  status: VerificationStatus;
  evidenceSource: string;
  accessDate: string;
  scopeNotes: string;
  limitations: string;
}

/* ==========================================================================
   2. LOCALIZATION DICTIONARY (7 LANGUAGES)
   ========================================================================== */

export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  fr: {
    app_name: 'KOROYA',
    slogan: 'Talent Meets Opportunity.',
    demo_badge: 'DONNÉES DE DÉMO — NON VÉRIFIÉES',
    disclaimer_banner: 'PROTOCOLE D’ESSAI V1 : KOROYA utilise des données de simulation locales. Aucun diplôme réel n’est certifié sur ce prototype.',
    nav_home: 'Accueil',
    nav_explore: 'Opportunités',
    nav_saved: 'Favoris',
    nav_career: 'Mon Parcours',
    nav_skills: 'Compétences',
    nav_verify: 'Contrôle Diplômes',
    nav_radar: 'Radar Emploi',
    nav_org: 'Espace Organisations',
    nav_trust: 'Politique & Vérification',
    nav_about: 'À propos',
    hero_title: 'Découvrez des opportunités fiables et construisez votre avenir.',
    hero_desc: 'Plateforme institutionnelle ouest-africaine pour accéder aux emplois, bourses, formations et consulter les informations académiques avec rigueur et transparence.',
    hero_cta_explore: 'Explorer les opportunités',
    hero_cta_verify: 'Contrôler un établissement',
    search_placeholder: 'Rechercher par titre, compétences, mot-clé...',
    filter_category: 'Catégorie',
    filter_all_categories: 'Toutes les catégories',
    filter_sector: 'Secteur',
    filter_all_sectors: 'Tous les secteurs',
    filter_audience: 'Public cible',
    filter_all_audiences: 'Tous les publics',
    filter_status: 'Statut de vérification',
    filter_all_statuses: 'Tous les statuts',
    filter_reset: 'Réinitialiser les filtres',
    results_count: 'opportunité(s) de démonstration affichée(s)',
    category_job: 'Emploi',
    category_internship: 'Stage',
    category_scholarship: 'Bourse',
    category_training: 'Formation',
    category_funding: 'Financement',
    category_call_for_projects: 'Appel à projets',
    category_volunteering: 'Bénévolat',
    category_partnership: 'Partenariat',
    deadline_label: 'Date limite',
    last_verified: 'Dernière vérification',
    official_source: 'Source officielle',
    original_lang: 'Langue originale',
    view_details: 'Consulter la fiche',
    save_opp: 'Sauvegarder',
    saved_opp: 'Enregistré',
    remove_saved: 'Retirer des favoris',
    no_results_title: 'Aucune opportunité ne correspond à vos filtres',
    no_results_desc: 'Essayez d’élargir vos termes de recherche ou de réinitialiser les critères.',
    no_saved_title: 'Aucun favori enregistré',
    no_saved_desc: 'Marquez des opportunités lors de votre exploration pour les retrouver facilement ici.',
    apply_modal_title: 'Action désactivée pour la démonstration',
    apply_modal_desc: 'Cet enregistrement est un exemple pédagogique fictif ("DEMO DATA — NOT VERIFIED"). Aucune candidature réelle ne peut être traitée.',
    status_documented: 'Reconnaissance documentée par source officielle',
    status_pending: 'Confirmation en attente',
    status_anomaly: 'Anomalie détectée dans les documents',
    status_not_confirmed: 'Reconnaissance non confirmée par la source consultée',
    status_not_performed: 'Vérification non effectuée',
    check_form_title: 'Contrôle de Référence des Établissements & Diplômes',
    check_form_subtitle: 'Consultez les informations documentées auprès des répertoires officiels ivoiriens et sous-régionaux.',
    check_disclaimer: 'Avis V1 : Cet outil illustre la démarche méthodologique. Il ne remplace en aucun cas les services officiels d’équivalence du Ministère de l’Enseignement Supérieur.',
    country_label: 'Pays de délivrance',
    inst_label: 'Nom de l’établissement',
    qual_label: 'Titre exact du diplôme',
    field_label: 'Filière d’études',
    awarding_body_label: 'Organisme de tutelle / Délivrance',
    year_label: 'Année d’obtention',
    btn_verify: 'Inspecter les références documentées',
    btn_reset: 'Effacer',
    result_card_title: 'Fiche Documentaire de Référence',
    result_waiting: 'Remplissez le formulaire ci-contre pour afficher les éléments d’habilitation documentés.',
    scope_notes_label: 'Portée et habilitation documentée',
    limitations_label: 'Limites et réserves d’usage',
    skills_title: 'Analyseur de Compétences & Adéquation',
    skills_subtitle: 'Comparez vos compétences déclarées aux exigences explicites d’un poste, sans jugement sur votre école ou parcours.',
    select_opp_label: '1. Opportunité ou métier de référence',
    required_skills_label: '2. Exigences explicites du poste',
    declared_skills_label: '3. Vos compétences déclarées (séparées par une virgule)',
    skills_match_rate: 'Taux d’adéquation explicite',
    matched_skills: 'Compétences alignées',
    gap_skills: 'Compétences à consolider ou clarifier',
    learning_paths: 'Activités d’apprentissage suggérées',
    radar_title: 'Radar Éducation-Emploi (Observatoire Pilote)',
    radar_subtitle: 'Agrégation indicative des compétences demandées sur un échantillon de 150 annonces locales modélisées.',
    radar_sample_note: 'Avis méthodologique : Cet échantillon restreint illustre la distribution sectorielle et ne prétend pas représenter l’intégralité du marché ivoirien.',
    org_title: 'Portail des Organisations',
    org_subtitle: 'Déposez une opportunité institutionnelle pour revue humaine préalable avant référencement.',
    submit_opp_title: 'Titre de l’opportunité',
    submit_opp_org: 'Structure organisatrice',
    submit_opp_url: 'Lien direct vers l’annonce officielle',
    submit_opp_desc: 'Description succincte et critères d’éligibilité',
    submit_opp_btn: 'Soumettre pour examen humain',
    pending_submissions: 'Vos dépôts en attente de vérification locale',
    report_issue: 'Signaler une inexactitude',
    official_ci_services: 'Portail du Service Public CI',
    official_ci_higher_ed: 'Ministère Enseignement Supérieur (MESRS CI)',
    mark_as_favorite: 'Marquer comme favori',
    favorited: 'Favori',
    filter_favorites_only: 'Favoris uniquement',
    toast_favorite_added: 'Offre ajoutée à vos favoris',
    toast_favorite_removed: 'Offre retirée des favoris',
    favorites_tab_all: 'Tous les enregistrés',
    favorites_tab_favs: 'Favoris marqués',
    nav_more: 'Plus',
    welcome_banner_title: 'Phase de Lancement Initial • Bienvenue sur KOROYA',
    welcome_banner_desc: 'Vous visitez un nouveau service ouvert aux premiers talents et organisations partenaires. Aucune inscription préalable requise.',
    welcome_tour_btn: 'Guide Premier Visiteur',
    pioneer_org_badge: 'Organisations Pionnières',
    pioneer_org_title: 'Participez au lancement en publiant vos premières opportunités officielles',
    pioneer_org_desc: 'KOROYA démarre sans utilisateurs historiques. Les institutions et entreprises pionnières bénéficient d’une mise en avant de référence auprès des talents de Côte d’Ivoire et de l’Afrique de l’Ouest.',
    onboarding_modal_title: 'Bienvenue sur KOROYA • Guide de Démarrage',
    onboarding_modal_subtitle: 'Découvrez en 4 étapes clés comment utiliser ce nouveau service en toute autonomie et transparence.',
    onboarding_privacy_note: 'Confidentialité Totale : Aucun compte à créer, aucun mot de passe, aucune collecte d’identité. Tout est conservé localement sur votre appareil.'
  },
  en: {
    app_name: 'KOROYA',
    slogan: 'Talent Meets Opportunity.',
    demo_badge: 'DEMO DATA — NOT VERIFIED',
    disclaimer_banner: 'PILOT PROTOTYPE V1: KOROYA operates using local demonstration records. No actual degrees are officially certified on this prototype.',
    nav_home: 'Home',
    nav_explore: 'Opportunities',
    nav_saved: 'Saved',
    nav_career: 'My Career Path',
    nav_skills: 'KOROYA Skills',
    nav_verify: 'Diploma Check',
    nav_radar: 'Employment Radar',
    nav_org: 'Organization Portal',
    nav_trust: 'Trust & Verification',
    nav_about: 'About',
    hero_title: 'Discover reliable opportunities and shape your professional trajectory.',
    hero_desc: 'West African institutional platform to discover jobs, scholarships, trainings, and consult documented academic credentials with transparency.',
    hero_cta_explore: 'Explore Opportunities',
    hero_cta_verify: 'Check an Institution',
    search_placeholder: 'Search by title, skills, keywords...',
    filter_category: 'Category',
    filter_all_categories: 'All Categories',
    filter_sector: 'Sector',
    filter_all_sectors: 'All Sectors',
    filter_audience: 'Target Audience',
    filter_all_audiences: 'All Audiences',
    filter_status: 'Verification Status',
    filter_all_statuses: 'All Statuses',
    filter_reset: 'Reset Filters',
    results_count: 'demo opportunity record(s) shown',
    category_job: 'Job',
    category_internship: 'Internship',
    category_scholarship: 'Scholarship',
    category_training: 'Training',
    category_funding: 'Funding',
    category_call_for_projects: 'Call for Projects',
    category_volunteering: 'Volunteering',
    category_partnership: 'Partnership',
    deadline_label: 'Deadline',
    last_verified: 'Last Checked',
    official_source: 'Official Source',
    original_lang: 'Original Language',
    view_details: 'View Record',
    save_opp: 'Save',
    saved_opp: 'Saved',
    remove_saved: 'Remove from Saved',
    no_results_title: 'No opportunities match your current filters',
    no_results_desc: 'Try broadening your search keywords or resetting active filter selections.',
    no_saved_title: 'No saved opportunities yet',
    no_saved_desc: 'Bookmark opportunities while exploring to access them anytime in your local browser.',
    apply_modal_title: 'Action Disabled for Demonstration',
    apply_modal_desc: 'This record is an educational simulation ("DEMO DATA — NOT VERIFIED"). Real applications cannot be submitted here.',
    status_documented: 'Recognition documented by an identified official source',
    status_pending: 'Pending confirmation',
    status_anomaly: 'Anomaly detected in record',
    status_not_confirmed: 'Recognition not confirmed by the consulted source',
    status_not_performed: 'Verification not performed',
    check_form_title: 'Academic & Institutional Reference Check',
    check_form_subtitle: 'Inspect documented accreditation data from public registries in Côte d’Ivoire and the West African region.',
    check_disclaimer: 'V1 Notice: This tool illustrates the workflow methodology. It does not replace the official equivalency services of the Ministry of Higher Education.',
    country_label: 'Country of Issuance',
    inst_label: 'Institution Name',
    qual_label: 'Exact Degree / Diploma Title',
    field_label: 'Field of Study',
    awarding_body_label: 'Awarding Body / Ministry',
    year_label: 'Graduation Year',
    btn_verify: 'Inspect Documented Records',
    btn_reset: 'Clear Form',
    result_card_title: 'Documentary Reference File',
    result_waiting: 'Fill in the form to view documented institutional accreditation items.',
    scope_notes_label: 'Documented Scope & Recognition',
    limitations_label: 'Limitations & Usage Reserves',
    skills_title: 'Skills & Readiness Matcher',
    skills_subtitle: 'Compare self-declared skills against stated job expectations fairly, without arbitrary institutional bias.',
    select_opp_label: '1. Benchmark Opportunity or Occupation',
    required_skills_label: '2. Explicit Role Requirements',
    declared_skills_label: '3. Your Declared Skills (comma-separated)',
    skills_match_rate: 'Explicit Alignment Rate',
    matched_skills: 'Directly Aligned Skills',
    gap_skills: 'Skills to Develop or Validate',
    learning_paths: 'Suggested Learning Pathways',
    radar_title: 'Education-to-Employment Radar (Pilot Observatory)',
    radar_subtitle: 'Aggregated demand metrics across a simulated sample of 150 local job postings.',
    radar_sample_note: 'Methodological note: This modest sample illustrates sector dynamics and does not claim to represent the whole Ivorian economy.',
    org_title: 'Organization Submission Portal',
    org_subtitle: 'Submit institutional postings for human compliance review prior to public listing.',
    submit_opp_title: 'Opportunity Title',
    submit_opp_org: 'Issuing Organization',
    submit_opp_url: 'Direct Link to Official Notice',
    submit_opp_desc: 'Summary Description and Eligibility Requirements',
    submit_opp_btn: 'Submit for Human Review',
    pending_submissions: 'Your Submissions Awaiting Local Verification',
    report_issue: 'Report an Inaccuracy',
    official_ci_services: 'Côte d’Ivoire Public Services Portal',
    official_ci_higher_ed: 'Ministry of Higher Education (MESRS CI)',
    mark_as_favorite: 'Mark as Favorite',
    favorited: 'Favorited',
    filter_favorites_only: 'Favorites only',
    toast_favorite_added: 'Opportunity marked as favorite',
    toast_favorite_removed: 'Opportunity removed from favorites',
    favorites_tab_all: 'All Bookmarked',
    favorites_tab_favs: 'Marked Favorites',
    nav_more: 'More',
    welcome_banner_title: 'Initial Launch Phase • Welcome to KOROYA',
    welcome_banner_desc: 'You are among the first visitors to this new platform for West African talent. No prior account or registration required.',
    welcome_tour_btn: 'First-Time Visitor Guide',
    pioneer_org_badge: 'Pioneer Organizations',
    pioneer_org_title: 'Join our launch by submitting your first verified institutional opportunities',
    pioneer_org_desc: 'KOROYA is launching as a new platform with 0 legacy users. Pioneer universities, NGOs, and employers receive prime visibility among rising talents in Côte d’Ivoire and West Africa.',
    onboarding_modal_title: 'Welcome to KOROYA • Quick Start Guide',
    onboarding_modal_subtitle: 'Discover how to navigate this new service independently and transparently in 4 practical steps.',
    onboarding_privacy_note: 'Total Privacy Guarantee: No account creation, no passwords, and no personal data collection. Everything is securely stored in your local browser.'
  },
  ar: {
    app_name: 'كورويا',
    slogan: 'Talent Meets Opportunity.',
    demo_badge: 'بيانات تجريبية — غير مؤكدة',
    disclaimer_banner: 'تنبيه النموذج التجريبي V1: تعمل منصة كورويا ببيانات محلية للمحاكاة. لا يتم اعتماد أي شهادات رسمية هنا.',
    nav_home: 'الرئيسية',
    nav_explore: 'الفرص المتاحة',
    nav_saved: 'المحفوظات',
    nav_career: 'مساري المهني',
    nav_skills: 'مواءمة المهارات',
    nav_verify: 'فحص الشهادات',
    nav_radar: 'رادار التوظيف',
    nav_org: 'بوابة الهيئات',
    nav_trust: 'الشفافية والتحقق',
    nav_about: 'عن كورويا',
    hero_title: 'اكتشف فرصاً موثوقة وابنِ مستقبلك الأكاديمي والمهني بثقة.',
    hero_desc: 'المنصة المؤسسية لغرب أفريقيا للاطلاع على الوظائف والمنح والتكوينات والتحقق من المراجع الأكاديمية بشفافية.',
    hero_cta_explore: 'استكشاف الفرص',
    hero_cta_verify: 'فحص مؤسسة تعليمية',
    search_placeholder: 'ابحث بالعنوان، المهارة، الكلمات المفتاحية...',
    filter_category: 'الفئة',
    filter_all_categories: 'جميع الفئات',
    filter_sector: 'القطاع',
    filter_all_sectors: 'جميع القطاعات',
    filter_audience: 'الجمهور المستهدف',
    filter_all_audiences: 'جميع الفئات المستهدفة',
    filter_status: 'حالة التحقق',
    filter_all_statuses: 'جميع الحالات',
    filter_reset: 'إعادة ضبط التصفية',
    results_count: 'فرصة تجريبية معروضة',
    category_job: 'وظيفة',
    category_internship: 'تدريب مهني',
    category_scholarship: 'منحة دراسية',
    category_training: 'تكوين',
    category_funding: 'تمويل',
    category_call_for_projects: 'طلب مشاريع',
    category_volunteering: 'تطوع',
    category_partnership: 'شراكة',
    deadline_label: 'آخر موعد',
    last_verified: 'تاريخ آخر فحص',
    official_source: 'المصدر الرسمي',
    original_lang: 'اللغة الأصلية',
    view_details: 'عرض التفاصيل',
    save_opp: 'حفظ',
    saved_opp: 'تم الحفظ',
    remove_saved: 'إزالة من المحفوظات',
    no_results_title: 'لا توجد نتائج مطابقة لخيارات البحث',
    no_results_desc: 'يرجى تجربة كلمات بحث أخرى أو إلغاء تطبيق الفلاتر الحالية.',
    no_saved_title: 'لا توجد عناصر محفوظة حتى الآن',
    no_saved_desc: 'قم بتمييز الفرص أثناء التصفح للوصول إليها لاحقاً عبر متصفحك المحلي.',
    apply_modal_title: 'التقديم معطل في النسخة التجريبية',
    apply_modal_desc: 'هذا السجل هو نموذج محاكاة تعليمي خيالي ("بيانات تجريبية"). لا يمكن تقديم طلب حقيقي من خلال هذا العرض.',
    status_documented: 'اعتراف موثق بمصدر رسمي معتمد',
    status_pending: 'قيد التأكيد والمطابقة',
    status_anomaly: 'تم رصد ملاحظة أو عدم تطابق في الوثيقة',
    status_not_confirmed: 'الاعتراف غير مؤكد في المصدر المتاح',
    status_not_performed: 'لم يتم التحقق بعد',
    check_form_title: 'الاستعلام المرجعي عن المؤسسات والشهادات',
    check_form_subtitle: 'مراجعة بيانات الاعتماد الأكاديمي استناداً إلى السجلات الرسمية في كوت ديفوار وغرب أفريقيا.',
    check_disclaimer: 'إشعار النموذج V1: هذه الأداة توضح خطوات العمل التوثيقية فقط، ولا تحل محل خدمات معادلة الشهادات الرسمية في وزارة التعليم العالي.',
    country_label: 'دولة الإصدار',
    inst_label: 'اسم المؤسسة التعليمية',
    qual_label: 'المسمى الدقيق للشهادة',
    field_label: 'مجال الدراسة',
    awarding_body_label: 'الجهة المانحة / الوزارة المشرفة',
    year_label: 'سنة التخرج',
    btn_verify: 'فحص السجلات الموثقة',
    btn_reset: 'مسح الحقول',
    result_card_title: 'بطاقة الفحص التوثيقية',
    result_waiting: 'يرجى تعبئة النموذج للاطلاع على بيانات الاعتماد المسجلة.',
    scope_notes_label: 'نطاق الاعتراف الموثق',
    limitations_label: 'الحدود والتحفظات القانونية',
    skills_title: 'أداة تحليل ومطابقة المهارات',
    skills_subtitle: 'قارن مهاراتك الذاتية بالمتطلبات المحددة للوظيفة دون أحكام مسبقة أو تحيز جغرافي.',
    select_opp_label: '1. فرصة المقارنة المرجعية',
    required_skills_label: '2. المهارات المطلوبة صراحة',
    declared_skills_label: '3. مهاراتك المصرح بها (مفصولة بفاصلة)',
    skills_match_rate: 'نسبة التوافق الصريح',
    matched_skills: 'المهارات المتطابقة مباشرة',
    gap_skills: 'مهارات تحتاج إلى تطوير أو إثبات',
    learning_paths: 'مسارات التعلم والتطوير المقترحة',
    radar_title: 'رادار التعليم وسوق العمل (لوحة تجريبية)',
    radar_subtitle: 'مؤشرات الطلب على المهارات مجمعة من عينة افتراضية تشمل 150 إعلاناً وظيفياً.',
    radar_sample_note: 'ملاحظة منهجية: هذه العينة التجريبية توضح أسلوب التحليل ولا تمثل بالضرورة كامل الاقتصاد الإيفواري.',
    org_title: 'بوابة الهيئات لنشر الفرص',
    org_subtitle: 'تقديم الإعلانات للمراجعة البشرية والتدقيق قبل إتاحتها للعموم.',
    submit_opp_title: 'عنوان الفرصة',
    submit_opp_org: 'الجهة المعلنة',
    submit_opp_url: 'رابط الإعلان الرسمي المباشر',
    submit_opp_desc: 'الوصف وشروط الأهلية',
    submit_opp_btn: 'إرسال للمراجعة والتدقيق',
    pending_submissions: 'إعلاناتك المقدمة بانتظار التحقق المحلي',
    report_issue: 'الإبلاغ عن عدم دقة',
    official_ci_services: 'بوابة الخدمات العامة لكوت ديفوار',
    official_ci_higher_ed: 'وزارة التعليم العالي (MESRS CI)',
    mark_as_favorite: 'تحديد كمفضل',
    favorited: 'مفضل',
    filter_favorites_only: 'المفضلة فقط',
    toast_favorite_added: 'تمت إضافة الفرصة إلى المفضلة',
    toast_favorite_removed: 'تمت إزالة الفرصة من المفضلة',
    favorites_tab_all: 'جميع المحفوظات',
    favorites_tab_favs: 'المفضلة المحددة',
    nav_more: 'المزيد',
    welcome_banner_title: 'مرحلة الإطلاق الأولي • مرحباً بكم في كورويا',
    welcome_banner_desc: 'أنتم من أوائل زوار هذه المنصة الجديدة الموجهة لكفاءات غرب أفريقيا. لا يلزم أي تسجيل مسبق.',
    welcome_tour_btn: 'دليل الزائر الجديد',
    pioneer_org_badge: 'الهيئات الرائدة',
    pioneer_org_title: 'شاركوا في مرحلة الإطلاق بنشر أولى الفرص المؤسسية المعتمدة',
    pioneer_org_desc: 'تنطلق كورويا كمنصة جديدة دون مستخدمين مسبقين. تمنح الهيئات والجامعات والشركات الرائدة أولوية الظهور أمام الكفاءات في كوت ديفوار وغرب أفريقيا.',
    onboarding_modal_title: 'مرحباً بكم في كورويا • دليل البداية السريعة',
    onboarding_modal_subtitle: 'تعرفوا على كيفية الاستفادة من المنصة الجديدة بأمان وشفافية في 4 خطوات عملية.',
    onboarding_privacy_note: 'خصوصية تامة: لا يلزم إنشاء حساب أو كلمة مرور أو إدخال بيانات شخصية. تحفظ تفضيلاتكم محلياً في متصفحكم فقط.'
  },
  pt: {
    app_name: 'KOROYA',
    slogan: 'Talent Meets Opportunity.',
    demo_badge: 'DADOS DEMO — NÃO VERIFICADOS',
    disclaimer_banner: 'AVISO DE PROTÓTIPO V1: O KOROYA opera com registros de demonstração locais. Nenhum diploma real é certificado neste protótipo.',
    nav_home: 'Início',
    nav_explore: 'Oportunidades',
    nav_saved: 'Salvos',
    nav_career: 'Meu Percurso',
    nav_skills: 'Competências',
    nav_verify: 'Consulta de Diplomas',
    nav_radar: 'Radar do Emprego',
    nav_org: 'Portal das Organizações',
    nav_trust: 'Transparência e Política',
    nav_about: 'Sobre',
    hero_title: 'Descubra oportunidades confiáveis e construa seu futuro profissional.',
    hero_desc: 'Plataforma institucional da África Ocidental para bolsas, empregos, capacitação e consulta rigorosa de referências acadêmicas.',
    hero_cta_explore: 'Explorar Oportunidades',
    hero_cta_verify: 'Consultar Instituição',
    search_placeholder: 'Pesquisar por título, competências, palavras-chave...',
    filter_category: 'Categoria',
    filter_all_categories: 'Todas as categorias',
    filter_sector: 'Setor',
    filter_all_sectors: 'Todos os setores',
    filter_audience: 'Público-alvo',
    filter_all_audiences: 'Todos os públicos',
    filter_status: 'Status de Verificação',
    filter_all_statuses: 'Todos os status',
    filter_reset: 'Redefinir filtros',
    results_count: 'registro(s) de demonstração exibido(s)',
    category_job: 'Emprego',
    category_internship: 'Estágio',
    category_scholarship: 'Bolsa de Estudo',
    category_training: 'Formação',
    category_funding: 'Financiamento',
    category_call_for_projects: 'Chamada de Projetos',
    category_volunteering: 'Voluntariado',
    category_partnership: 'Parceria',
    deadline_label: 'Prazo',
    last_verified: 'Última verificação',
    official_source: 'Fonte oficial',
    original_lang: 'Idioma original',
    view_details: 'Ver detalhes',
    save_opp: 'Salvar',
    saved_opp: 'Salvo',
    remove_saved: 'Remover dos salvos',
    no_results_title: 'Nenhuma oportunidade corresponde aos filtros',
    no_results_desc: 'Tente termos de busca mais amplos ou redefina os filtros.',
    no_saved_title: 'Nenhum favorito salvo',
    no_saved_desc: 'Marque oportunidades durante a exploração para consultá-las a qualquer momento.',
    apply_modal_title: 'Ação desativada para demonstração',
    apply_modal_desc: 'Este registro é um exemplo educacional simulado ("DEMO DATA — NOT VERIFIED"). Nenhuma candidatura real é processada.',
    status_documented: 'Reconhecimento documentado por fonte oficial',
    status_pending: 'Confirmação pendente',
    status_anomaly: 'Anomalia detectada no registro',
    status_not_confirmed: 'Reconhecimento não confirmado pela fonte consultada',
    status_not_performed: 'Verificação não realizada',
    check_form_title: 'Consulta de Referência de Instituições e Diplomas',
    check_form_subtitle: 'Consulte registros oficiais documentados em Côte d’Ivoire e na região oeste-africana.',
    check_disclaimer: 'Aviso V1: Esta ferramenta demonstra o fluxo de trabalho e não substitui os órgãos oficiais de equivalência ministerial.',
    country_label: 'País de emissão',
    inst_label: 'Nome da instituição',
    qual_label: 'Título exato do diploma',
    field_label: 'Área de estudos',
    awarding_body_label: 'Órgão de tutela / Emissor',
    year_label: 'Ano de conclusão',
    btn_verify: 'Inspecionar registros documentados',
    btn_reset: 'Limpar formulário',
    result_card_title: 'Ficha Documental de Referência',
    result_waiting: 'Preencha o formulário para visualizar os registros de credenciamento.',
    scope_notes_label: 'Escopo e reconhecimento documentado',
    limitations_label: 'Limitações e ressalvas legais',
    skills_title: 'Análise de Competências e Compatibilidade',
    skills_subtitle: 'Compare suas habilidades auto-declaradas com as exigências do cargo de forma transparente.',
    select_opp_label: '1. Oportunidade de referência',
    required_skills_label: '2. Requisitos explícitos da vaga',
    declared_skills_label: '3. Suas competências declaradas (separadas por vírgula)',
    skills_match_rate: 'Taxa de alinhamento explícito',
    matched_skills: 'Competências alinhadas',
    gap_skills: 'Competências a desenvolver',
    learning_paths: 'Trilhas de aprendizado sugeridas',
    radar_title: 'Radar Educação-Emprego (Observatório Piloto)',
    radar_subtitle: 'Métricas agregadas a partir de amostra simulada de 150 ofertas locais.',
    radar_sample_note: 'Nota metodológica: Esta amostra é ilustrativa e não pretende representar todo o mercado ivoiriano.',
    org_title: 'Portal de Envio para Organizações',
    org_subtitle: 'Submeta oportunidades para revisão humana antes da publicação.',
    submit_opp_title: 'Título da oportunidade',
    submit_opp_org: 'Organização emissora',
    submit_opp_url: 'Link direto do anúncio oficial',
    submit_opp_desc: 'Resumo e critérios de elegibilidade',
    submit_opp_btn: 'Enviar para revisão humana',
    pending_submissions: 'Suas submissões pendentes de análise local',
    report_issue: 'Reportar inconsistência',
    official_ci_services: 'Portal de Serviços Públicos de Côte d’Ivoire',
    official_ci_higher_ed: 'Ministério do Ensino Superior (MESRS CI)',
    mark_as_favorite: 'Marcar como favorito',
    favorited: 'Favorito',
    filter_favorites_only: 'Apenas favoritos',
    toast_favorite_added: 'Oportunidade adicionada aos favoritos',
    toast_favorite_removed: 'Oportunidade removida dos favoritos',
    favorites_tab_all: 'Todos os salvos',
    favorites_tab_favs: 'Favoritos marcados',
    nav_more: 'Mais',
    welcome_banner_title: 'Fase de Lançamento Inicial • Bem-vindo ao KOROYA',
    welcome_banner_desc: 'Você é um dos primeiros visitantes desta nova plataforma para a África Ocidental. Nenhum cadastro prévio necessário.',
    welcome_tour_btn: 'Guia do Novo Visitante',
    pioneer_org_badge: 'Organizações Pioneiras',
    pioneer_org_title: 'Participe do lançamento publicando suas primeiras oportunidades oficiais',
    pioneer_org_desc: 'O KOROYA é um site novo com zero usuários legados. Empresas, universidades e ONGs pioneiras recebem destaque privilegiado para os talentos da região.',
    onboarding_modal_title: 'Bem-vindo ao KOROYA • Guia Rápido de Início',
    onboarding_modal_subtitle: 'Descubra como explorar este novo serviço com total transparência em 4 etapas práticas.',
    onboarding_privacy_note: 'Privacidade Total: Sem cadastro, sem senhas e sem coleta de identidade. Todos os dados permanecem no seu navegador.'
  },
  es: {
    app_name: 'KOROYA',
    slogan: 'Talent Meets Opportunity.',
    demo_badge: 'DATOS DE DEMO — NO VERIFICADOS',
    disclaimer_banner: 'AVISO DE PROTOTIPO V1: KOROYA opera con registros de simulación local. No se certifican títulos reales en este prototipo.',
    nav_home: 'Inicio',
    nav_explore: 'Oportunidades',
    nav_saved: 'Guardados',
    nav_career: 'Mi Trayectoria',
    nav_skills: 'Habilidades',
    nav_verify: 'Consulta de Títulos',
    nav_radar: 'Radar Laboral',
    nav_org: 'Portal Organizaciones',
    nav_trust: 'Confianza y Normas',
    nav_about: 'Acerca de',
    hero_title: 'Encuentre oportunidades fiables y desarrolle su trayectoria profesional.',
    hero_desc: 'Plataforma institucional de África Occidental para becas, empleos, formación y verificación rigurosa de referencias académicas.',
    hero_cta_explore: 'Explorar Oportunidades',
    hero_cta_verify: 'Consultar una Institución',
    search_placeholder: 'Buscar por título, competencias, palabras clave...',
    filter_category: 'Categoría',
    filter_all_categories: 'Todas las categorías',
    filter_sector: 'Sector',
    filter_all_sectors: 'Todos los sectores',
    filter_audience: 'Público objetivo',
    filter_all_audiences: 'Todos los públicos',
    filter_status: 'Estado de Verificación',
    filter_all_statuses: 'Todos los estados',
    filter_reset: 'Restablecer filtros',
    results_count: 'registro(s) de demostración mostrado(s)',
    category_job: 'Empleo',
    category_internship: 'Pasantía',
    category_scholarship: 'Beca',
    category_training: 'Capacitación',
    category_funding: 'Financiamiento',
    category_call_for_projects: 'Convocatoria de Proyectos',
    category_volunteering: 'Voluntariado',
    category_partnership: 'Alianza',
    deadline_label: 'Fecha límite',
    last_verified: 'Última verificación',
    official_source: 'Fuente oficial',
    original_lang: 'Idioma original',
    view_details: 'Ver detalles',
    save_opp: 'Guardar',
    saved_opp: 'Guardado',
    remove_saved: 'Quitar de guardados',
    no_results_title: 'Ninguna oportunidad coincide con sus filtros',
    no_results_desc: 'Pruebe con otros términos de búsqueda o restablezca los filtros.',
    no_saved_title: 'No hay elementos guardados',
    no_saved_desc: 'Guarde oportunidades mientras navega para acceder a ellas en cualquier momento.',
    apply_modal_title: 'Acción deshabilitada para la demostración',
    apply_modal_desc: 'Este registro es un ejemplo pedagógico ficticio ("DEMO DATA — NOT VERIFIED"). No se procesan postulaciones reales.',
    status_documented: 'Reconocimiento documentado por fuente oficial',
    status_pending: 'Confirmación pendiente',
    status_anomaly: 'Anomalía detectada en el registro',
    status_not_confirmed: 'Reconocimiento no confirmado por la fuente consultada',
    status_not_performed: 'Verificación no realizada',
    check_form_title: 'Consulta de Referencia de Instituciones y Títulos',
    check_form_subtitle: 'Coteje registros de acreditación frente a directorios oficiales de Costa de Marfil y la región.',
    check_disclaimer: 'Aviso V1: Esta herramienta demuestra el flujo de trabajo y no sustituye los servicios ministeriales oficiales.',
    country_label: 'País de emisión',
    inst_label: 'Nombre de la institución',
    qual_label: 'Título exacto del grado',
    field_label: 'Campo de estudio',
    awarding_body_label: 'Organismo de tutela / Emisor',
    year_label: 'Año de graduación',
    btn_verify: 'Inspeccionar registros documentados',
    btn_reset: 'Borrar formulario',
    result_card_title: 'Ficha Documental de Referencia',
    result_waiting: 'Complete el formulario para visualizar los elementos de acreditación documentados.',
    scope_notes_label: 'Alcance y reconocimiento documentado',
    limitations_label: 'Limitaciones y reservas de uso',
    skills_title: 'Analizador de Competencias y Ajuste',
    skills_subtitle: 'Compare sus competencias declaradas con los requisitos del puesto con total claridad y sin sesgos.',
    select_opp_label: '1. Puesto u oportunidad de referencia',
    required_skills_label: '2. Requisitos explícitos del puesto',
    declared_skills_label: '3. Sus competencias declaradas (separadas por coma)',
    skills_match_rate: 'Tasa de ajuste explícito',
    matched_skills: 'Competencias coincidentes',
    gap_skills: 'Competencias por desarrollar',
    learning_paths: 'Rutas de aprendizaje sugeridas',
    radar_title: 'Radar Educación-Empleo (Muestra Piloto)',
    radar_subtitle: 'Tendencias sobre una muestra didáctica de 150 ofertas de empleo modeladas.',
    radar_sample_note: 'Nota metodológica: Esta muestra ilustra el método de agregación y no abarca la totalidad del mercado laboral marfileño.',
    org_title: 'Portal de Envío para Organizaciones',
    org_subtitle: 'Envíe convocatorias institucionales para revisión humana antes de su publicación.',
    submit_opp_title: 'Título de la oportunidad',
    submit_opp_org: 'Organización responsable',
    submit_opp_url: 'Enlace directo al anuncio oficial',
    submit_opp_desc: 'Descripción y criterios de elegibilidad',
    submit_opp_btn: 'Enviar para revisión humana',
    pending_submissions: 'Sus convocatorias enviadas para revisión local',
    report_issue: 'Informar de un error',
    official_ci_services: 'Portal de Servicios Públicos de Costa de Marfil',
    official_ci_higher_ed: 'Ministerio de Educación Superior (MESRS CI)',
    mark_as_favorite: 'Marcar como favorito',
    favorited: 'Favorito',
    filter_favorites_only: 'Solo favoritos',
    toast_favorite_added: 'Oportunidad añadida a favoritos',
    toast_favorite_removed: 'Oportunidad eliminada de favoritos',
    favorites_tab_all: 'Todos los guardados',
    favorites_tab_favs: 'Favoritos marcados',
    nav_more: 'Más',
    welcome_banner_title: 'Fase de Lanzamiento Inicial • Bienvenido a KOROYA',
    welcome_banner_desc: 'Es uno de los primeros visitantes en esta nueva plataforma para África Occidental. No requiere registro previo.',
    welcome_tour_btn: 'Guía del Nuevo Visitante',
    pioneer_org_badge: 'Organizaciones Pioneras',
    pioneer_org_title: 'Participe en el lanzamiento publicando sus primeras convocatorias oficiales',
    pioneer_org_desc: 'KOROYA inicia como una nueva web sin usuarios previos. Las instituciones y empresas pioneras obtienen máxima visibilidad ante el talento de Costa de Marfil y la región.',
    onboarding_modal_title: 'Bienvenido a KOROYA • Guía de Inicio Rápido',
    onboarding_modal_subtitle: 'Descubra cómo utilizar este nuevo servicio de manera transparente y autónoma en 4 pasos.',
    onboarding_privacy_note: 'Privacidad Total: Sin cuentas, sin contraseñas ni recopilación de identidad. Todo permanece localmente en su navegador.'
  },
  zh: {
    app_name: 'KOROYA',
    slogan: 'Talent Meets Opportunity.',
    demo_badge: '演示数据 — 未经官方核验',
    disclaimer_banner: 'V1试验原型提示：KOROYA仅在浏览器本地运行模拟数据。本原型不颁发任何官方学历认证。',
    nav_home: '首页',
    nav_explore: '探索机遇',
    nav_saved: '我的收藏',
    nav_career: '职业路径',
    nav_skills: '技能匹配',
    nav_verify: '文凭核实参考',
    nav_radar: '就业雷达',
    nav_org: '机构入口',
    nav_trust: '信任与准则',
    nav_about: '关于KOROYA',
    hero_title: '发现严谨核实的优质机遇，开启西非未来新篇章。',
    hero_desc: '面向科特迪瓦及西非地区的专业化平台，提供可靠奖学金、全职岗位、培训以及权威院校资质参考查询。',
    hero_cta_explore: '浏览机会',
    hero_cta_verify: '核验院校记录',
    search_placeholder: '按标题、技能、关键词搜索...',
    filter_category: '类别',
    filter_all_categories: '全部类别',
    filter_sector: '行业领域',
    filter_all_sectors: '全部行业',
    filter_audience: '目标受众',
    filter_all_audiences: '全部受众',
    filter_status: '核验状态',
    filter_all_statuses: '全部状态',
    filter_reset: '重置筛选',
    results_count: '条模拟机会记录展示中',
    category_job: '工作岗位',
    category_internship: '实习机会',
    category_scholarship: '奖学金',
    category_training: '专业培训',
    category_funding: '项目资助',
    category_call_for_projects: '项目征集',
    category_volunteering: '志愿服务',
    category_partnership: '机构合作',
    deadline_label: '截止时间',
    last_verified: '最近查验',
    official_source: '官方源',
    original_lang: '原始语言',
    view_details: '查看详情',
    save_opp: '收藏',
    saved_opp: '已收藏',
    remove_saved: '取消收藏',
    no_results_title: '未找到符合条件的条目',
    no_results_desc: '请尝试扩大搜索词或重置筛选条件。',
    no_saved_title: '暂无收藏条目',
    no_saved_desc: '在浏览时点击书签标记，即可在本地随时调阅。',
    apply_modal_title: '演示原型：申请投递已禁用',
    apply_modal_desc: '本条目仅为模拟展示（"DEMO DATA — NOT VERIFIED"）。本原型不支持真实投递。',
    status_documented: '官方指定渠道已查实认可',
    status_pending: '资质确认等待中',
    status_anomaly: '记录中存在异常或不一致',
    status_not_confirmed: '所查数据源未确认认可',
    status_not_performed: '未执行核验',
    check_form_title: '院校与学历参考核验',
    check_form_subtitle: '查验科特迪瓦及西非地区官方教育目录登记与认可信息。',
    check_disclaimer: 'V1声明：此工具演示标准核查流程，不可替代高等教育与科研部的官方文凭对等认证公函。',
    country_label: '颁发国家',
    inst_label: '机构/大学全称',
    qual_label: '文凭/学位精确名称',
    field_label: '专业领域',
    awarding_body_label: '主管机构 / 颁发部委',
    year_label: '毕业年份',
    btn_verify: '查验官方登记记录',
    btn_reset: '清空表单',
    result_card_title: '官方档案记录参考卡',
    result_waiting: '请填写左侧表单以调阅对应资质登记状态。',
    scope_notes_label: '登记认可范围',
    limitations_label: '适用限制与法定说明',
    skills_title: '技能评估与岗位匹配',
    skills_subtitle: '客观比对自主申报技能与岗位公开要求，不因毕业院校或地域产生偏见。',
    select_opp_label: '1. 对标岗位或职位',
    required_skills_label: '2. 岗位明确列出的技能要求',
    declared_skills_label: '3. 您的技能清单（逗号分隔）',
    skills_match_rate: '明确契合度',
    matched_skills: '高度契合技能',
    gap_skills: '待提升或待核实技能',
    learning_paths: '推荐学习路径',
    radar_title: '教育-就业雷达（试点仪表板）',
    radar_subtitle: '基于150份模拟岗位样本的技能需求聚合分析。',
    radar_sample_note: '方法论说明：本演示样本仅用于展示趋势分析模型，不构成对科特迪瓦宏观就业市场的完整统计。',
    org_title: '机构信息发布通道',
    org_subtitle: '提交拟发布信息以供专人合规审查后方可列出。',
    submit_opp_title: '机会标题',
    submit_opp_org: '发布机构全称',
    submit_opp_url: '官方公告直接链接',
    submit_opp_desc: '简要描述与资格条件',
    submit_opp_btn: '提交人工核验',
    pending_submissions: '待审核的本地提交记录',
    report_issue: '反馈信息偏差',
    official_ci_services: '科特迪瓦公共服务官方门户',
    official_ci_higher_ed: '科特迪瓦高等教育与科研部 (MESRS CI)',
    mark_as_favorite: '标为偏好',
    favorited: '已设偏好',
    filter_favorites_only: '仅看偏好',
    toast_favorite_added: '已添加至偏好列表',
    toast_favorite_removed: '已从偏好列表移除',
    favorites_tab_all: '全部已存',
    favorites_tab_favs: '标记偏好',
    nav_more: '更多',
    welcome_banner_title: '初始上线发布阶段 • 欢迎访问 KOROYA',
    welcome_banner_desc: '您是本西非人才全新平台的首批访客之一。无需预先注册任何账户。',
    welcome_tour_btn: '新访客快速指引',
    pioneer_org_badge: '先锋入驻机构',
    pioneer_org_title: '参与首发上线：发布首批官方审核机会',
    pioneer_org_desc: 'KOROYA 是全新上线的平台（初始0用户积累）。首批入驻的高校、非政府组织与雇主将在科特迪瓦及西非青年人才中获得首推关注。',
    onboarding_modal_title: '欢迎体验 KOROYA • 入门操作指引',
    onboarding_modal_subtitle: '通过4个核心步骤，快速掌握如何自主透明地使用这一新服务。',
    onboarding_privacy_note: '隐私全面保障：无需注册、无密码、不采集身份信息。所有偏好均仅保存在您的本地浏览器中。'
  },
  de: {
    app_name: 'KOROYA',
    slogan: 'Talent Meets Opportunity.',
    demo_badge: 'DEMODATEN — NICHT VERIFIZIERT',
    disclaimer_banner: 'PROTOTYP-HINWEIS V1: KOROYA nutzt lokale Demodaten. Auf diesem Prototyp werden keine echten Diplome beglaubigt.',
    nav_home: 'Startseite',
    nav_explore: 'Möglichkeiten',
    nav_saved: 'Gemerkt',
    nav_career: 'Karrierepfad',
    nav_skills: 'Kompetenz-Match',
    nav_verify: 'Diplom-Prüfung',
    nav_radar: 'Arbeitsmarkt-Radar',
    nav_org: 'Organisations-Portal',
    nav_trust: 'Transparenz & Richtlinien',
    nav_about: 'Über uns',
    hero_title: 'Zuverlässige Chancen entdecken und die berufliche Zukunft sichern.',
    hero_desc: 'Die westafrikanische Plattform für Stipendien, Arbeitsplätze, Weiterbildung und verlässliche akademische Referenzprüfungen.',
    hero_cta_explore: 'Möglichkeiten erkunden',
    hero_cta_verify: 'Einrichtung prüfen',
    search_placeholder: 'Nach Titel, Qualifikationen, Stichworten suchen...',
    filter_category: 'Kategorie',
    filter_all_categories: 'Alle Kategorien',
    filter_sector: 'Branche',
    filter_all_sectors: 'Alle Branchen',
    filter_audience: 'Zielgruppe',
    filter_all_audiences: 'Alle Zielgruppen',
    filter_status: 'Verifikationsstatus',
    filter_all_statuses: 'Alle Status',
    filter_reset: 'Filter zurücksetzen',
    results_count: 'Demo-Ausschreibung(en) angezeigt',
    category_job: 'Arbeitsplatz',
    category_internship: 'Praktikum',
    category_scholarship: 'Stipendium',
    category_training: 'Weiterbildung',
    category_funding: 'Förderung',
    category_call_for_projects: 'Projektaufruf',
    category_volunteering: 'Freiwilligendienst',
    category_partnership: 'Partnerschaft',
    deadline_label: 'Frist',
    last_verified: 'Zuletzt geprüft',
    official_source: 'Offizielle Quelle',
    original_lang: 'Originalsprache',
    view_details: 'Details ansehen',
    save_opp: 'Merken',
    saved_opp: 'Gemerkt',
    remove_saved: 'Aus Gemerkt entfernen',
    no_results_title: 'Keine Angebote entsprechen den Kriterien',
    no_results_desc: 'Erweitern Sie Ihre Suchbegriffe oder setzen Sie aktive Filter zurück.',
    no_saved_title: 'Noch keine Einträge gemerkt',
    no_saved_desc: 'Merken Sie interessante Ausschreibungen, um sie jederzeit lokal wiederzufinden.',
    apply_modal_title: 'Bewerbung im Demomodus deaktiviert',
    apply_modal_desc: 'Dieser Eintrag dient didaktischen Testzwecken ("DEMODATEN — NICHT VERIFIZIERT"). Reale Bewerbungen sind nicht möglich.',
    status_documented: 'Offiziell dokumentierte Anerkennung',
    status_pending: 'Bestätigung ausstehend',
    status_anomaly: 'Auffälligkeit im Datensatz festgestellt',
    status_not_confirmed: 'Anerkennung durch Quelle nicht bestätigt',
    status_not_performed: 'Prüfung nicht durchgeführt',
    check_form_title: 'Akademische & Institutionelle Referenzprüfung',
    check_form_subtitle: 'Prüfen Sie dokumentierte Akkreditierungsdaten anhand offizieller ivorischer und regionaler Register.',
    check_disclaimer: 'Hinweis V1: Dieses Tool illustriert die Prüfmethodik und ersetzt keinesfalls ministerielle Gleichwertigkeitsbescheinigungen.',
    country_label: 'Ausstellungsland',
    inst_label: 'Name der Bildungseinrichtung',
    qual_label: 'Exakte Abschlussbezeichnung',
    field_label: 'Studienfach',
    awarding_body_label: 'Zuständiges Ministerium / Träger',
    year_label: 'Abschlussjahr',
    btn_verify: 'Dokumentierte Einträge einsehen',
    btn_reset: 'Formular leeren',
    result_card_title: 'Dokumentarischer Referenznachweis',
    result_waiting: 'Füllen Sie das Formular aus, um Akkreditierungsangaben einzusehen.',
    scope_notes_label: 'Umfang der dokumentierten Anerkennung',
    limitations_label: 'Einschränkungen & Vorbehalte',
    skills_title: 'Kompetenz- und Anforderungsabgleich',
    skills_subtitle: 'Gleichen Sie selbstdeklarierte Fähigkeiten transparent und vorurteilsfrei mit Stellenausschreibungen ab.',
    select_opp_label: '1. Referenzstelle oder Beruf',
    required_skills_label: '2. Explizite Anforderungen des Inserats',
    declared_skills_label: '3. Ihre deklarierten Fähigkeiten (kommagetrennt)',
    skills_match_rate: 'Expliziter Deckungsgrad',
    matched_skills: 'Direkt übereinstimmende Fähigkeiten',
    gap_skills: 'Zu vertiefende Fähigkeiten',
    learning_paths: 'Empfohlene Lernpfade',
    radar_title: 'Bildung-zu-Beschäftigung-Radar (Pilot)',
    radar_subtitle: 'Aggregierte Nachfrage-Indikatoren basierend auf einer Teststichprobe von 150 Ausschreibungen.',
    radar_sample_note: 'Methodischer Hinweis: Diese Stichprobe veranschaulicht das Dashboard-Konzept und bildet nicht die gesamte Volkswirtschaft ab.',
    org_title: 'Portal für ausschreibende Institutionen',
    org_subtitle: 'Reichen Sie Ausschreibungen zur redaktionellen Vorprüfung vor Veröffentlichung ein.',
    submit_opp_title: 'Titel der Ausschreibung',
    submit_opp_org: 'Ausschreibende Organisation',
    submit_opp_url: 'Direkter Link zur Originalanzeige',
    submit_opp_desc: 'Kurzbeschreibung und Zulassungskriterien',
    submit_opp_btn: 'Zur Prüfung einreichen',
    pending_submissions: 'Ihre lokal eingereichten Ausschreibungen',
    report_issue: 'Unstimmigkeit melden',
    official_ci_services: 'Portal der öffentlichen Dienste der Côte d’Ivoire',
    official_ci_higher_ed: 'Ministerium für Hochschulbildung (MESRS CI)',
    mark_as_favorite: 'Als Favorit markieren',
    favorited: 'Favorisiert',
    filter_favorites_only: 'Nur Favoriten',
    toast_favorite_added: 'Zu Favoriten hinzugefügt',
    toast_favorite_removed: 'Aus Favoriten entfernt',
    favorites_tab_all: 'Alle Gemerkten',
    favorites_tab_favs: 'Markierte Favoriten',
    nav_more: 'Mehr',
    welcome_banner_title: 'Initiale Startphase • Willkommen bei KOROYA',
    welcome_banner_desc: 'Sie gehören zu den ersten Besuchern dieser neuen westafrikanischen Plattform. Keine vorherige Registrierung erforderlich.',
    welcome_tour_btn: 'Leitfaden für Erstbesucher',
    pioneer_org_badge: 'Pionier-Organisationen',
    pioneer_org_title: 'Gestalten Sie den Start mit und reichen Sie erste offizielle Angebote ein',
    pioneer_org_desc: 'KOROYA startet als neue Plattform ohne Altnutzer. Pionier-Institutionen und Unternehmen erhalten vorrangige Sichtbarkeit bei Fachkräften in der Region.',
    onboarding_modal_title: 'Willkommen bei KOROYA • Schnellstart-Anleitung',
    onboarding_modal_subtitle: 'Erfahren Sie in 4 praktischen Schritten, wie Sie das neue Angebot transparent nutzen.',
    onboarding_privacy_note: 'Vollständige Privatsphäre: Keine Registrierung, keine Passwörter, keine Identitätserfassung. Alle Daten verbleiben lokal in Ihrem Browser.'
  }
};

/* ==========================================================================
   3. DEMONSTRATION DATA (CLEARLY LABELED FICTIONAL RECORDS)
   ========================================================================== */

const INITIAL_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-ci-01',
    title: 'Ingénieur Junior Réseaux Électriques & Énergie Solaire',
    organization: 'Compagnie Ivoirienne d’Énergies Propres (Fictive)',
    category: 'job',
    sector: 'Énergies Renouvelables',
    audience: 'Diplômés Ingénieurs & Masters',
    location: 'Abidjan, Cocody (Côte d’Ivoire)',
    deadline: '2026-11-30',
    originalLanguage: 'Français',
    officialSource: 'Ministère des Mines, du Pétrole et de l’Énergie (Simulation)',
    sourceUrl: 'https://servicepublic.gouv.ci/',
    lastCheckedDate: '2026-10-15',
    verificationStatus: 'documented_official',
    description: 'Poste junior visant à modéliser la distribution photovoltaïque en zone périurbaine et rurale dans la région des Lagunes.',
    eligibility: [
      'Diplôme d’Ingénieur ou Master en Génie Électrique / Énergétique',
      'Nationalité CEDEAO ou titre de séjour régulier',
      'Maîtrise d’outils de modélisation PV'
    ],
    requiredSkills: ['Dimensionnement PV', 'Autocad', 'Analyse de données énergétiques', 'Français professionnel', 'Gestion de projet agile'],
    isDemo: true
  },
  {
    id: 'opp-ci-02',
    title: 'Programme de Bourses d’Excellence en Agronomie Numérique',
    organization: 'Fondation Ouest-Africaine du Cacao Durable (Simulation)',
    category: 'scholarship',
    sector: 'Agriculture & Agro-industrie',
    audience: 'Étudiants en Master 1 ou 2',
    location: 'Yamoussoukro / Daloa (Côte d’Ivoire)',
    deadline: '2026-12-15',
    originalLanguage: 'Français',
    officialSource: 'Direction Générale de la Recherche Scientifique CI (Simulation)',
    sourceUrl: 'https://enseignement.gouv.ci/services',
    lastCheckedDate: '2026-10-20',
    verificationStatus: 'documented_official',
    description: 'Bourse d’appui à la recherche appliquée couvrant les droits universitaires et une allocation mensuelle pour l’application de capteurs IoT aux vergers de cacao.',
    eligibility: [
      'Inscrit dans un établissement supérieur agréé en Côte d’Ivoire',
      'Moyenne générale académique supérieure à 14/20',
      'Sujet validé par une unité de recherche reconnue'
    ],
    requiredSkills: ['Agronomie', 'Capteurs IoT', 'Analyse statistique (R ou Python)', 'Rédaction scientifique'],
    isDemo: true
  },
  {
    id: 'opp-ci-03',
    title: 'Stage Professionnel Développeur Mobile Flutter & Systèmes de Paiement',
    organization: 'Abidjan Fintech Labs (Fictif)',
    category: 'internship',
    sector: 'Technologies Numériques',
    audience: 'Étudiants en fin de cycle ou autodidactes avec portfolio',
    location: 'Abidjan, Plateau / Hybride',
    deadline: '2026-11-10',
    originalLanguage: 'Français',
    officialSource: 'Guichet Emploi Jeunes CI (Simulation)',
    sourceUrl: 'https://servicepublic.gouv.ci/',
    lastCheckedDate: '2026-10-18',
    verificationStatus: 'pending_confirmation',
    description: 'Stage de 6 mois avec indemnité réglementaire pour participer à la création de portefeuilles mobiles et micro-crédits adaptés au secteur informel.',
    eligibility: [
      'Connaissance pratique de Flutter et Dart',
      'Répertoire GitHub public démontrant des projets concrets',
      'Sensibilité à la sécurité des transactions bancaires'
    ],
    requiredSkills: ['Flutter', 'Dart', 'API REST', 'Git', 'Sécurité des données'],
    isDemo: true
  },
  {
    id: 'opp-ci-04',
    title: 'Subvention d’Amorçage pour Entrepreneures Rurales de l’Agro-transformation',
    organization: 'Fonds d’Appui Régional à l’Autonomisation Féminine (Simulation)',
    category: 'funding',
    sector: 'Entrepreneuriat & Artisanat',
    audience: 'Femmes dirigeantes de coopératives',
    location: 'Bouaké & Korhogo (Côte d’Ivoire)',
    deadline: '2027-01-20',
    originalLanguage: 'Français',
    officialSource: 'Conseil Régional du Gbêkê (Simulation)',
    sourceUrl: 'https://servicepublic.gouv.ci/',
    lastCheckedDate: '2026-10-02',
    verificationStatus: 'documented_official',
    description: 'Dotation financière non remboursable jusqu’à 5 000 000 FCFA avec mentorat technique de 12 mois pour l’équipement de séchage et broyage de manioc.',
    eligibility: [
      'Groupement ou coopérative enregistré(e) au RCCM depuis au moins 12 mois',
      'Tenue d’un registre financier simplifié',
      'Activité située en zone périurbaine ou rurale'
    ],
    requiredSkills: ['Tenue de trésorerie', 'Gestion de coopérative', 'Transformation agroalimentaire', 'Hygiène alimentaire'],
    isDemo: true
  },
  {
    id: 'opp-ci-05',
    title: 'West Africa Coastal Climate Resilience Fellowship',
    organization: 'Sahel & Coastal Environmental Consortium (Simulation)',
    category: 'training',
    sector: 'Environnement & Climat',
    audience: 'Chercheurs, doctorants et cadres ministériels',
    location: 'Abidjan & Grand-Bassam (Côte d’Ivoire)',
    deadline: '2026-12-31',
    originalLanguage: 'English',
    officialSource: 'Regional Environmental Research Board (Simulation)',
    sourceUrl: 'https://servicepublic.gouv.ci/',
    lastCheckedDate: '2026-10-10',
    verificationStatus: 'documented_official',
    description: 'Intensive 4-month technical fellowship focusing on coastal erosion monitoring using Sentinel satellite imagery and GIS systems in the Gulf of Guinea.',
    eligibility: [
      'Master degree or higher in Earth Sciences, Environmental Engineering or Geography',
      'Demonstrated competence in GIS packages',
      'Fluency in either French or English'
    ],
    requiredSkills: ['GIS', 'QGIS', 'Remote Sensing', 'Python for Geospatial', 'Technical English'],
    isDemo: true
  },
  {
    id: 'opp-ci-06',
    title: 'Appel à Projets : Valorisation Numérique des Traditions Orales & Musées',
    organization: 'Alliance Régionale pour les Arts et le Patrimoine (Fictif)',
    category: 'call_for_projects',
    sector: 'Culture & Tourisme',
    audience: 'Associations culturelles, archivistes, studios créatifs',
    location: 'Grand-Bassam, Man & Korhogo',
    deadline: '2027-02-15',
    originalLanguage: 'Français',
    officialSource: 'Direction Régionale de la Culture et de la Francophonie (Simulation)',
    sourceUrl: 'https://servicepublic.gouv.ci/',
    lastCheckedDate: '2026-09-28',
    verificationStatus: 'pending_confirmation',
    description: 'Soutien aux projets combinant captation sonore haute fidélité en langues locales, archives photographiques et modélisation 3D d’objets d’art.',
    eligibility: [
      'Structure à but non lucratif ou entreprise culturelle déclarée',
      'Implication formelle des détenteurs de savoirs communautaires'
    ],
    requiredSkills: ['Production multimédia', 'Numérisation 3D', 'Médiation culturelle', 'Archivage documentaire'],
    isDemo: true
  },
  {
    id: 'opp-ci-07',
    title: 'Mission Volontaire d’Appui à la Santé Maternelle & Infantile',
    organization: 'Corps Sanitaire Communautaire Ouest-Africain (Simulation)',
    category: 'volunteering',
    sector: 'Santé Publique',
    audience: 'Infirmiers, sages-femmes et étudiants en médecine',
    location: 'Région du Poro (Korhogo & localités proches)',
    deadline: '2026-11-25',
    originalLanguage: 'Français',
    officialSource: 'Coordination Régionale de Santé (Simulation)',
    sourceUrl: 'https://servicepublic.gouv.ci/',
    lastCheckedDate: '2026-10-12',
    verificationStatus: 'documented_official',
    description: 'Mission terrain de 3 mois pour appuyer la sensibilisation prénatale, la distribution de carnets de santé et les campagnes de vaccination de premier contact.',
    eligibility: [
      'Formation médicale, maïeutique ou paramédicale certifiée',
      'Aptitude au travail en zone rurale et sens du dialogue communautaire'
    ],
    requiredSkills: ['Sensibilisation sanitaire', 'Premiers secours', 'Communication interpersonnelle', 'Santé maternelle'],
    isDemo: true
  },
  {
    id: 'opp-ci-08',
    title: 'Partenariat Industriel & Transfert Technologique en Agro-Machinisme',
    organization: 'Chambre Mixte d’Industrie et d’Artisanat (Simulation)',
    category: 'partnership',
    sector: 'Industrie & Mécanique',
    audience: 'PME métallurgiques et ateliers de maintenance mécanique',
    location: 'San Pedro (Côte d’Ivoire)',
    deadline: '2027-03-01',
    originalLanguage: 'Français',
    officialSource: 'Bureau d’Appui aux PME Industrielles (Simulation)',
    sourceUrl: 'https://servicepublic.gouv.ci/',
    lastCheckedDate: '2026-10-01',
    verificationStatus: 'not_performed',
    description: 'Programme de co-conception de mini-décortiqueuses de café et d’unités solaires de séchage pour les coopératives du Bas-Sassandra.',
    eligibility: [
      'Atelier disposant d’un outillage certifié',
      'Expérience avérée en chaudronnerie ou maintenance industrielle'
    ],
    requiredSkills: ['Dessin industriel', 'Usinage mécanique', 'Chaudronnerie', 'Contrôle qualité'],
    isDemo: true
  }
];

/* Reference registry entries for demonstration check */
const DEMO_REGISTRY_DATABASE: Record<string, VerificationCheckResult> = {
  INPHB: {
    country: 'Côte d’Ivoire',
    institution: 'Institut National Polytechnique Félix Houphouët-Boigny (INP-HB Yamoussoukro)',
    qualification: 'Diplôme d’Ingénieur de Conception',
    field: 'Génie Électrique et Énergétique',
    awardingBody: 'Ministère de l’Enseignement Supérieur et de la Recherche Scientifique (MESRS CI)',
    graduationYear: '2024',
    status: 'documented_official',
    evidenceSource: 'Arrêté ministériel d’habilitation & Annuaire Officiel MESRS Côte d’Ivoire',
    accessDate: '2026-10-24',
    scopeNotes: 'Habilitation ministérielle confirmée pour le cycle ingénieur de l’ESIE à Yamoussoukro.',
    limitations: 'La reconnaissance de l’établissement ne garantit pas automatiquement que chaque option récente ou extension est couverte sans visa de la commission.'
  },
  UFHB: {
    country: 'Côte d’Ivoire',
    institution: 'Université Félix Houphouët-Boigny (UFHB Abidjan-Cocody)',
    qualification: 'Master Professionnel',
    field: 'Sciences Économiques et Gestion',
    awardingBody: 'MESRS CI / Reconnaissance CAMES',
    graduationYear: '2023',
    status: 'documented_official',
    evidenceSource: 'Répertoire national des diplômes habilités (MESRS CI)',
    accessDate: '2026-10-24',
    scopeNotes: 'Programme LMD homologué par le conseil académique et accrédité au niveau régional.',
    limitations: 'Ne préjuge pas de la délivrance individuelle du diplôme à un tiers sans authentification du relevé sécurisé.'
  },
  UNIV_SAN_PEDRO: {
    country: 'Côte d’Ivoire',
    institution: 'Université de San Pedro (USP)',
    qualification: 'Licence Professionnelle',
    field: 'Logistique Portuaire et Maritime',
    awardingBody: 'MESRS CI',
    graduationYear: '2025',
    status: 'documented_official',
    evidenceSource: 'Décret de création & Cartographie Universitaire MESRS',
    accessDate: '2026-10-24',
    scopeNotes: 'Établissement public d’enseignement supérieur opérationnel avec filières maritimes habilitées.',
    limitations: 'Les premières promotions de masters spécialisés restent soumises aux décrets d’homologation terminale.'
  },
  ANOMALY_TEST: {
    country: 'Côte d’Ivoire',
    institution: 'Institut Privé Non Homologué de l’Atlantique (Exemple)',
    qualification: 'Doctorat en Gestion Privée',
    field: 'Management International',
    awardingBody: 'Déclaration sous seing privé',
    graduationYear: '2024',
    status: 'anomaly_detected',
    evidenceSource: 'Audit de conformité des arrêtés d’agrément d’établissements privés',
    accessDate: '2026-10-24',
    scopeNotes: 'L’établissement dispose d’une autorisation pour les cycles BTS uniquement.',
    limitations: 'Le cursus de cycle doctoral mentionné ne figure sur aucun arrêté ministériel d’autorisation d’ouverture.'
  },
  PENDING_TEST: {
    country: 'Côte d’Ivoire',
    institution: 'École Supérieure des Métiers du Numérique (Simulation)',
    qualification: 'Licence Informatique et Cloud',
    field: 'Systèmes d’Information & Réseaux',
    awardingBody: 'Direction Générale de l’Enseignement Supérieur (DGES)',
    graduationYear: '2026',
    status: 'pending_confirmation',
    evidenceSource: 'Commission nationale d’habilitation des filières privées (Session 2026 en cours)',
    accessDate: '2026-10-24',
    scopeNotes: 'Dossier d’agrément technique recevable et programmé pour évaluation sur site.',
    limitations: 'L’arrêté d’homologation terminale n’est pas encore publié au Journal Officiel.'
  },
  NOT_CONFIRMED_TEST: {
    country: 'Côte d’Ivoire',
    institution: 'Académie Panafricaine du Leadership Moderne (Exemple)',
    qualification: 'Certificat Supérieur de Gouvernance',
    field: 'Sciences Politiques Appliquées',
    awardingBody: 'Organisme associatif non homologué',
    graduationYear: '2023',
    status: 'not_confirmed',
    evidenceSource: 'Base publique du Ministère de l’Enseignement Supérieur (MESRS CI)',
    accessDate: '2026-10-24',
    scopeNotes: 'Aucun enregistrement actif identifié dans la cartographie officielle des établissements agréés.',
    limitations: 'La formation peut avoir une valeur professionnelle interne, mais ne confère aucun grade universitaire officiel.'
  }
};

/* ==========================================================================
   4. MAIN REACT COMPONENT
   ========================================================================== */

export const App: React.FC = () => {
  // Navigation & View
  const [activeTab, setActiveTab] = useState<string>('home');
  const [currentLang, setCurrentLang] = useState<Language>('fr');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Persistence States
  const [savedOppIds, setSavedOppIds] = useState<string[]>([]);
  const [favoriteOppIds, setFavoriteOppIds] = useState<string[]>([]);
  const [favoriteToast, setFavoriteToast] = useState<string | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(false);
  const [savedViewFilter, setSavedViewFilter] = useState<'all' | 'favorites'>('all');
  const [submittedOpps, setSubmittedOpps] = useState<SubmittedOpportunity[]>([]);
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    step1: true,
    step2: false,
    step3: false,
    step4: false
  });

  // Modal States
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [reportModalOpen, setReportModalOpen] = useState<boolean>(false);
  const [reportTargetTitle, setReportTargetTitle] = useState<string>('');
  const [reportFeedback, setReportFeedback] = useState<string | null>(null);
  const [onboardingOpen, setOnboardingOpen] = useState<boolean>(false);
  const [showWelcomeBanner, setShowWelcomeBanner] = useState<boolean>(true);

  // Filter States for Opportunity Explorer
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [selectedAudience, setSelectedAudience] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Diploma Check Form States
  const [checkCountry, setCheckCountry] = useState('Côte d’Ivoire');
  const [checkInst, setCheckInst] = useState('');
  const [checkQual, setCheckQual] = useState('');
  const [checkField, setCheckField] = useState('');
  const [checkAwardingBody, setCheckAwardingBody] = useState('MESRS CI');
  const [checkYear, setCheckYear] = useState('2024');
  const [verificationResult, setVerificationResult] = useState<VerificationCheckResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Skills Matcher States
  const [selectedSkillsOppId, setSelectedSkillsOppId] = useState<string>(INITIAL_OPPORTUNITIES[0].id);
  const [declaredSkillsInput, setDeclaredSkillsInput] = useState<string>(
    'Dimensionnement PV, Gestion de projet agile, Français professionnel, Autocad'
  );

  // Organization Form States
  const [newTitle, setNewTitle] = useState('');
  const [newOrg, setNewOrg] = useState('');
  const [newCategory, setNewCategory] = useState<Category>('job');
  const [newSector, setNewSector] = useState('');
  const [newAudience, setNewAudience] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newDeadline, setNewDeadline] = useState('');
  const [newOfficialUrl, setNewOfficialUrl] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [submissionFeedback, setSubmissionFeedback] = useState<string | null>(null);

  // Initialize from LocalStorage
  useEffect(() => {
    try {
      const storedLang = localStorage.getItem('koroya_lang') as Language;
      if (storedLang && TRANSLATIONS[storedLang]) {
        setCurrentLang(storedLang);
      }
      const storedSaved = localStorage.getItem('koroya_saved');
      if (storedSaved) {
        setSavedOppIds(JSON.parse(storedSaved));
      }
      const storedFavorites = localStorage.getItem('koroya_favorites');
      if (storedFavorites) {
        setFavoriteOppIds(JSON.parse(storedFavorites));
      }
      const storedSubmissions = localStorage.getItem('koroya_org_submissions');
      if (storedSubmissions) {
        setSubmittedOpps(JSON.parse(storedSubmissions));
      }
      const storedChecklist = localStorage.getItem('koroya_checklist');
      if (storedChecklist) {
        setChecklist(JSON.parse(storedChecklist));
      }
    } catch (e) {
      console.warn('Storage read failed', e);
    }
  }, []);

  // Update HTML lang and direction (RTL for Arabic)
  useEffect(() => {
    const isRtl = currentLang === 'ar';
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang;
  }, [currentLang]);

  // Keyboard Escape key to close open modals & drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (reportModalOpen) setReportModalOpen(false);
        else if (onboardingOpen) setOnboardingOpen(false);
        else if (selectedOpp) setSelectedOpp(null);
        else if (mobileMenuOpen) setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [reportModalOpen, onboardingOpen, selectedOpp, mobileMenuOpen]);

  // Translation Helper
  const t = (key: string): string => {
    return TRANSLATIONS[currentLang]?.[key] || TRANSLATIONS.fr[key] || key;
  };

  const handleLanguageChange = (lang: Language) => {
    setCurrentLang(lang);
    try {
      localStorage.setItem('koroya_lang', lang);
    } catch (e) {
      console.warn(e);
    }
  };

  const toggleSaveOpp = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSavedOppIds((prev) => {
      const updated = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem('koroya_saved', JSON.stringify(updated));
      } catch (err) {
        console.warn(err);
      }
      return updated;
    });
  };

  // 'Mark as Favorite' specific handler with localStorage persistence
  const toggleFavoriteOpp = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFavoriteOppIds((prev) => {
      const isFav = prev.includes(id);
      const updated = isFav ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem('koroya_favorites', JSON.stringify(updated));
      } catch (err) {
        console.warn(err);
      }
      setFavoriteToast(isFav ? t('toast_favorite_removed') : t('toast_favorite_added'));
      setTimeout(() => setFavoriteToast(null), 2500);
      return updated;
    });
  };

  const toggleChecklist = (id: string) => {
    setChecklist((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem('koroya_checklist', JSON.stringify(updated));
      } catch (e) {
        console.warn(e);
      }
      return updated;
    });
  };

  // Filtered Opportunities List (including Favorites-only filter)
  const filteredOpportunities = useMemo(() => {
    return INITIAL_OPPORTUNITIES.filter((opp) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        opp.title.toLowerCase().includes(q) ||
        opp.organization.toLowerCase().includes(q) ||
        opp.description.toLowerCase().includes(q) ||
        opp.sector.toLowerCase().includes(q) ||
        opp.requiredSkills.some((s) => s.toLowerCase().includes(q));

      const matchesCategory = selectedCategory === 'all' || opp.category === selectedCategory;
      const matchesSector = selectedSector === 'all' || opp.sector === selectedSector;
      const matchesAudience = selectedAudience === 'all' || opp.audience.toLowerCase().includes(selectedAudience.toLowerCase());
      const matchesStatus = selectedStatus === 'all' || opp.verificationStatus === selectedStatus;
      const matchesFavoritesOnly = !showFavoritesOnly || favoriteOppIds.includes(opp.id);

      return matchesSearch && matchesCategory && matchesSector && matchesAudience && matchesStatus && matchesFavoritesOnly;
    });
  }, [searchQuery, selectedCategory, selectedSector, selectedAudience, selectedStatus, showFavoritesOnly, favoriteOppIds]);

  // Distinct sectors and audiences for dropdowns
  const availableSectors = useMemo(() => {
    return Array.from(new Set(INITIAL_OPPORTUNITIES.map((o) => o.sector)));
  }, []);

  const availableAudiences = useMemo(() => {
    return Array.from(new Set(INITIAL_OPPORTUNITIES.map((o) => o.audience)));
  }, []);

  // Current Opportunity for Skills Matcher
  const currentSkillsOpp = useMemo(() => {
    return INITIAL_OPPORTUNITIES.find((o) => o.id === selectedSkillsOppId) || INITIAL_OPPORTUNITIES[0];
  }, [selectedSkillsOppId]);

  // Skills Alignment Computation
  const skillsAnalysis = useMemo(() => {
    const userTokens = declaredSkillsInput
      .split(/[,;\n]+/)
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);

    const required = currentSkillsOpp.requiredSkills;
    const matched: string[] = [];
    const missing: string[] = [];

    required.forEach((req) => {
      const reqLower = req.toLowerCase();
      const hasMatch = userTokens.some((tok) => tok.includes(reqLower) || reqLower.includes(tok));
      if (hasMatch) {
        matched.push(req);
      } else {
        missing.push(req);
      }
    });

    const matchRate = Math.round((matched.length / Math.max(required.length, 1)) * 100);
    return { matched, missing, matchRate };
  }, [declaredSkillsInput, currentSkillsOpp]);

  // Execute Diploma Reference Check Workflow
  const handlePerformDiplomaCheck = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setVerificationResult(null);

    setTimeout(() => {
      setIsVerifying(false);
      const query = (checkInst + ' ' + checkQual).toUpperCase();

      if (query.includes('INP') || query.includes('POLYTECHNIQUE')) {
        setVerificationResult(DEMO_REGISTRY_DATABASE.INPHB);
      } else if (query.includes('UFHB') || query.includes('COCODY') || query.includes('FELIX')) {
        setVerificationResult(DEMO_REGISTRY_DATABASE.UFHB);
      } else if (query.includes('SAN PEDRO') || query.includes('USP')) {
        setVerificationResult(DEMO_REGISTRY_DATABASE.UNIV_SAN_PEDRO);
      } else if (query.includes('ATTENTE') || query.includes('PENDING') || query.includes('NUMERIQUE')) {
        setVerificationResult(DEMO_REGISTRY_DATABASE.PENDING_TEST);
      } else if (query.includes('INCONNU') || query.includes('LEADERSHIP') || query.includes('NON CONFIRME')) {
        setVerificationResult(DEMO_REGISTRY_DATABASE.NOT_CONFIRMED_TEST);
      } else if (query.includes('ANOMALIE') || query.includes('DOCTORAT PRIVE') || query.includes('NON HOMOLOGUE')) {
        setVerificationResult(DEMO_REGISTRY_DATABASE.ANOMALY_TEST);
      } else {
        // Fallback realistic informative record
        setVerificationResult({
          country: checkCountry,
          institution: checkInst || 'Établissement Renseigné',
          qualification: checkQual || 'Titre de Diplôme',
          field: checkField || 'Filière Spécifiée',
          awardingBody: checkAwardingBody || 'Ministère de tutelle',
          graduationYear: checkYear,
          status: 'not_confirmed',
          evidenceSource: 'Répertoire Public MESRS (Simulation V1)',
          accessDate: new Date().toISOString().split('T')[0],
          scopeNotes: 'Aucun enregistrement actif n’a été identifié pour cette combinaison exacte dans la base de référence de démonstration.',
          limitations: 'Ce résultat d’essai ne constitue ni une invalidation légale ni un refus d’équivalence. Une démarche formelle auprès du MESRS Côte d’Ivoire est indispensable.'
        });
      }
    }, 400);
  };

  // Submit Organization Opportunity (Local Demonstration)
  const handleOrgSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newOrg.trim() || !newOfficialUrl.trim()) return;

    const newSub: SubmittedOpportunity = {
      id: `sub-${Date.now()}`,
      title: newTitle.trim(),
      organization: newOrg.trim(),
      category: newCategory,
      sector: newSector.trim() || 'Multisectoriel',
      audience: newAudience.trim() || 'Tout public',
      location: newLocation.trim() || 'Côte d’Ivoire',
      deadline: newDeadline || 'À déterminer',
      officialUrl: newOfficialUrl.trim(),
      description: newDesc.trim() || 'Description en attente de vérification.',
      submittedAt: new Date().toISOString().split('T')[0],
      status: 'PENDING_REVIEW'
    };

    const updated = [newSub, ...submittedOpps];
    setSubmittedOpps(updated);
    try {
      localStorage.setItem('koroya_org_submissions', JSON.stringify(updated));
    } catch (err) {
      console.warn(err);
    }

    setSubmissionFeedback(
      `Votre proposition « ${newSub.title} » est enregistrée localement au statut PENDING REVIEW. Aucun serveur externe n'a été contacté.`
    );
    setNewTitle('');
    setNewOrg('');
    setNewSector('');
    setNewAudience('');
    setNewLocation('');
    setNewDeadline('');
    setNewOfficialUrl('');
    setNewDesc('');
    setTimeout(() => setSubmissionFeedback(null), 6000);
  };

  // Report Issue
  const triggerReport = (title: string) => {
    setReportTargetTitle(title);
    setReportFeedback(null);
    setReportModalOpen(true);
  };

  const handleSendReport = (reason: string) => {
    setReportFeedback(`Signalement enregistré : "${reason}". Les équipes de modération KOROYA examineront la source originale.`);
    setTimeout(() => {
      setReportModalOpen(false);
      setReportFeedback(null);
    }, 2500);
  };

  // Format Status Badge
  const renderStatus = (status: VerificationStatus) => {
    switch (status) {
      case 'documented_official':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-900 bg-emerald-100 px-2.5 py-1 rounded">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>{t('status_documented')}</span>
          </span>
        );
      case 'pending_confirmation':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-900 bg-amber-100 px-2.5 py-1 rounded">
            <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
            <span>{t('status_pending')}</span>
          </span>
        );
      case 'anomaly_detected':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-900 bg-rose-100 px-2.5 py-1 rounded">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-700" />
            <span>{t('status_anomaly')}</span>
          </span>
        );
      case 'not_confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-700 bg-stone-200 px-2.5 py-1 rounded">
            <AlertCircle className="w-3.5 h-3.5 text-stone-600" />
            <span>{t('status_not_confirmed')}</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700 bg-gray-100 px-2.5 py-1 rounded">
            <Info className="w-3.5 h-3.5 text-gray-500" />
            <span>{t('status_not_performed')}</span>
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F1E5] text-[#25364A] selection:bg-[#C7AA6A] selection:text-[#102C27]">
      {/* ==========================================================================
          HEADER: STRICT TOP BAR CONTRACT (3 ZONES)
          Zone 1: Brand wordmark
          Zone 2: Clean single-line nav links with subtle underlines
          Zone 3: Primary action & language selector
          ========================================================================== */}
      <header className="sticky top-0 z-40 bg-[#102C27] text-[#F6F1E5] border-b border-[#C7AA6A]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-8 h-18">
            {/* Zone 1: Single text element wordmark */}
            <div
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-2.5 cursor-pointer shrink-0 focus:outline-none"
              tabIndex={0}
              role="button"
              aria-label="KOROYA Accueil"
            >
              <div className="w-9 h-9 rounded bg-[#C7AA6A] text-[#102C27] flex items-center justify-center font-serif font-black text-xl">
                K
              </div>
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#F6F1E5] whitespace-nowrap">
                {t('app_name')}
              </span>
            </div>

            {/* Zone 2: Clean single-line nav links */}
            <nav className="hidden lg:flex items-center gap-5 xl:gap-6 text-sm font-medium text-[#F6F1E5]/80">
              {[
                { id: 'explore', label: t('nav_explore') },
                { id: 'skills', label: t('nav_skills') },
                { id: 'verify', label: t('nav_verify') },
                { id: 'radar', label: t('nav_radar') },
                { id: 'career', label: t('nav_career') },
                { id: 'org', label: t('nav_org') },
                { id: 'trust', label: t('nav_trust') },
                { id: 'about', label: t('nav_about') }
              ].map((link) => {
                const isActive = activeTab === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => {
                      setActiveTab(link.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`whitespace-nowrap transition-colors py-1 ${
                      isActive
                        ? 'text-[#C7AA6A] font-semibold border-b-2 border-[#C7AA6A]'
                        : 'hover:text-white'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
            </nav>

            {/* Zone 3: Language Selector & Saved Shortcut */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => {
                  setActiveTab('saved');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="relative p-2 text-[#F6F1E5] hover:text-[#C7AA6A] transition-colors"
                title={t('nav_saved')}
                aria-label={t('nav_saved')}
              >
                <Bookmark className="w-5 h-5" />
                {savedOppIds.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#C7AA6A] text-[#102C27] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {savedOppIds.length}
                  </span>
                )}
              </button>

              {/* Working 7-Language Selector */}
              <div className="relative inline-flex items-center">
                <Globe className="w-4 h-4 absolute start-2 text-[#C7AA6A] pointer-events-none" />
                <select
                  value={currentLang}
                  onChange={(e) => handleLanguageChange(e.target.value as Language)}
                  className="ps-7 pe-2.5 py-1.5 text-xs sm:text-sm rounded bg-black/40 border border-[#C7AA6A]/40 text-[#F6F1E5] focus:outline-none focus:border-[#C7AA6A] cursor-pointer"
                  aria-label="Sélectionner la langue"
                >
                  <option value="fr" className="bg-[#102C27] text-white">Français</option>
                  <option value="en" className="bg-[#102C27] text-white">English</option>
                  <option value="ar" className="bg-[#102C27] text-white">العربية (RTL)</option>
                  <option value="pt" className="bg-[#102C27] text-white">Português</option>
                  <option value="es" className="bg-[#102C27] text-white">Español</option>
                  <option value="zh" className="bg-[#102C27] text-white">中文 (简体)</option>
                  <option value="de" className="bg-[#102C27] text-white">Deutsch</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Global Prototype Disclaimer Banner */}
        <div className="bg-[#25364A] border-t border-[#C7AA6A]/20 px-4 py-1.5 text-center text-xs text-[#F6F1E5]/90">
          <span className="font-bold text-[#C7AA6A] uppercase me-2">[{t('demo_badge')}]</span>
          <span>{t('disclaimer_banner')}</span>
        </div>
      </header>

      {/* ==========================================================================
          MOBILE NAVIGATION BAR (THUMB ZONE) & DRAWER
          ========================================================================== */}
      <nav className="lg:hidden fixed bottom-0 start-0 end-0 z-40 bg-[#102C27] border-t border-[#C7AA6A]/30 px-2 py-2 flex justify-around items-center text-[10px] text-[#F6F1E5] shadow-2xl">
        <button
          onClick={() => {
            setActiveTab('home');
            setMobileMenuOpen(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-1 ${activeTab === 'home' && !mobileMenuOpen ? 'text-[#C7AA6A] font-bold' : 'text-gray-300'}`}
        >
          <Compass className="w-5 h-5" />
          <span>{t('nav_home')}</span>
        </button>
        <button
          onClick={() => {
            setActiveTab('explore');
            setMobileMenuOpen(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-1 ${activeTab === 'explore' && !mobileMenuOpen ? 'text-[#C7AA6A] font-bold' : 'text-gray-300'}`}
        >
          <Search className="w-5 h-5" />
          <span>{t('nav_explore')}</span>
        </button>
        <button
          onClick={() => {
            setActiveTab('saved');
            setMobileMenuOpen(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`relative flex flex-col items-center gap-1 ${activeTab === 'saved' && !mobileMenuOpen ? 'text-[#C7AA6A] font-bold' : 'text-gray-300'}`}
        >
          <Bookmark className="w-5 h-5" />
          {savedOppIds.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#C7AA6A] text-[#102C27] text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
              {savedOppIds.length}
            </span>
          )}
          <span>{t('nav_saved')}</span>
        </button>
        <button
          onClick={() => {
            setActiveTab('verify');
            setMobileMenuOpen(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-1 ${activeTab === 'verify' && !mobileMenuOpen ? 'text-[#C7AA6A] font-bold' : 'text-gray-300'}`}
        >
          <ShieldCheck className="w-5 h-5" />
          <span>{t('nav_verify')}</span>
        </button>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`flex flex-col items-center gap-1 transition-colors ${mobileMenuOpen ? 'text-[#C7AA6A] font-bold' : 'text-gray-300'}`}
          aria-label={t('nav_more')}
        >
          <Menu className="w-5 h-5" />
          <span>{t('nav_more')}</span>
        </button>
      </nav>

      {/* Mobile Drawer Sheet for all Views */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[#102C27] text-[#F6F1E5] rounded-t-3xl border-t border-[#C7AA6A]/30 p-6 max-h-[82vh] overflow-y-auto space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-[#C7AA6A] text-[#102C27] font-serif font-black flex items-center justify-center text-sm">
                  K
                </div>
                <span className="font-serif font-bold text-base text-white">Menu Navigation KOROYA</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-xl text-stone-300 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Fermer le menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-xs">
              {[
                { id: 'skills', label: t('nav_skills'), icon: Sparkles },
                { id: 'career', label: t('nav_career'), icon: BookOpen },
                { id: 'radar', label: t('nav_radar'), icon: BarChart3 },
                { id: 'org', label: t('nav_org'), icon: Building2 },
                { id: 'trust', label: t('nav_trust'), icon: FileText },
                { id: 'about', label: t('nav_about'), icon: Info }
              ].map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`flex items-center gap-2 p-3 rounded-xl border text-start transition-colors ${
                      activeTab === item.id
                        ? 'bg-[#C7AA6A] text-[#102C27] font-bold border-[#C7AA6A]'
                        : 'bg-white/5 border-white/10 hover:bg-white/10 text-gray-200'
                    }`}
                  >
                    <IconComponent className="w-4 h-4 shrink-0 text-[#C7AA6A]" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Quick Language switch inside drawer */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-gray-300 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#C7AA6A]" />
                <span>Langue / Language :</span>
              </span>
              <select
                value={currentLang}
                onChange={(e) => handleLanguageChange(e.target.value as Language)}
                className="ps-2 pe-6 py-1.5 text-xs rounded bg-white/10 border border-[#C7AA6A]/40 text-white focus:outline-none"
              >
                <option value="fr" className="bg-[#102C27] text-white">Français</option>
                <option value="en" className="bg-[#102C27] text-white">English</option>
                <option value="ar" className="bg-[#102C27] text-white">العربية (RTL)</option>
                <option value="pt" className="bg-[#102C27] text-white">Português</option>
                <option value="es" className="bg-[#102C27] text-white">Español</option>
                <option value="zh" className="bg-[#102C27] text-white">中文 (简体)</option>
                <option value="de" className="bg-[#102C27] text-white">Deutsch</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================================================
          MAIN VIEWPORT CONTAINER
          ========================================================================== */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28 lg:pb-16">
        {/* ======================================================================
            VIEW 1: HOME
            ====================================================================== */}
        {activeTab === 'home' && (
          <div className="space-y-10">
            {/* Launch Phase Banner (Zero User / Day 0 Welcome) */}
            {showWelcomeBanner && (
              <div className="bg-gradient-to-r from-[#102C27] via-[#1a3d36] to-[#25364A] text-[#F6F1E5] p-4 sm:p-5 rounded-2xl border border-[#C7AA6A]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#C7AA6A] text-[#102C27] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-5 h-5 text-[#102C27]" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-[#C7AA6A] tracking-wider uppercase">
                        {t('welcome_banner_title')}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#C7AA6A]/20 text-[#C7AA6A] border border-[#C7AA6A]/30">
                        V1.0 • Accès Libre
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-200 leading-relaxed max-w-2xl">
                      {t('welcome_banner_desc')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => setOnboardingOpen(true)}
                    className="px-4 py-2 rounded-xl bg-[#C7AA6A] text-[#102C27] text-xs font-bold hover:bg-[#d5ba7a] transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{t('welcome_tour_btn')}</span>
                  </button>
                  <button
                    onClick={() => setShowWelcomeBanner(false)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                    aria-label="Masquer la bannière"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Institutional Hero Section */}
            <section className="bg-[#102C27] text-[#F6F1E5] rounded-3xl p-6 sm:p-12 border border-[#C7AA6A]/30 relative overflow-hidden">
              <div className="max-w-3xl space-y-5 relative z-10">
                <div className="text-xs uppercase tracking-widest text-[#C7AA6A] font-semibold">
                  Côte d’Ivoire &bull; Afrique de l’Ouest &bull; CEDEAO
                </div>
                <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight leading-tight text-wrap">
                  {t('hero_title')}
                </h1>
                <p className="text-base sm:text-lg text-gray-200 leading-relaxed max-w-2xl">
                  {t('hero_desc')}
                </p>

                <div className="pt-3 flex flex-wrap items-center gap-4">
                  <button
                    onClick={() => setActiveTab('explore')}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#C7AA6A] text-[#102C27] font-bold text-sm hover:bg-[#d5ba7a] transition-colors"
                  >
                    <Search className="w-4 h-4" />
                    <span>{t('hero_cta_explore')}</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('verify')}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-[#F6F1E5] font-semibold text-sm border border-[#C7AA6A]/40 transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#C7AA6A]" />
                    <span>{t('hero_cta_verify')}</span>
                  </button>
                  <button
                    onClick={() => setOnboardingOpen(true)}
                    className="inline-flex items-center gap-1.5 text-xs text-[#C7AA6A] hover:underline font-semibold"
                  >
                    <Info className="w-4 h-4" />
                    <span>{t('welcome_tour_btn')}</span>
                  </button>
                </div>
              </div>

              {/* Decorative Subtle Insignia */}
              <div className="absolute end-6 -bottom-8 opacity-10 pointer-events-none text-[#C7AA6A]">
                <Award className="w-72 h-72" />
              </div>
            </section>

            {/* Quick Pathways: 3 Pillars */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div
                onClick={() => setActiveTab('skills')}
                className="bg-white p-6 rounded-2xl border border-stone-200 hover:border-[#102C27] transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#102C27]/10 text-[#102C27] flex items-center justify-center mb-4 group-hover:bg-[#102C27] group-hover:text-[#C7AA6A] transition-colors">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-lg text-[#102C27] mb-2">
                  {t('skills_title')}
                </h3>
                <p className="text-sm text-stone-600 mb-4">{t('skills_subtitle')}</p>
                <span className="text-xs font-bold text-[#102C27] inline-flex items-center gap-1">
                  Accéder à l’outil <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>

              <div
                onClick={() => setActiveTab('radar')}
                className="bg-white p-6 rounded-2xl border border-stone-200 hover:border-[#25364A] transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#25364A]/10 text-[#25364A] flex items-center justify-center mb-4 group-hover:bg-[#25364A] group-hover:text-white transition-colors">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-lg text-[#102C27] mb-2">
                  {t('radar_title')}
                </h3>
                <p className="text-sm text-stone-600 mb-4">{t('radar_subtitle')}</p>
                <span className="text-xs font-bold text-[#25364A] inline-flex items-center gap-1">
                  Consulter les données <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>

              <div
                onClick={() => setActiveTab('org')}
                className="bg-white p-6 rounded-2xl border border-stone-200 hover:border-[#C7AA6A] transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#C7AA6A]/20 text-[#102C27] flex items-center justify-center mb-4 group-hover:bg-[#102C27] group-hover:text-[#C7AA6A] transition-colors">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-lg text-[#102C27] mb-2">
                  {t('org_title')}
                </h3>
                <p className="text-sm text-stone-600 mb-4">{t('org_subtitle')}</p>
                <span className="text-xs font-bold text-[#102C27] inline-flex items-center gap-1">
                  Déposer une offre <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </section>

            {/* Featured Documented Opportunities */}
            <section className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-[#102C27]">
                    Dernières opportunités référencées
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-600">
                    Exemples pédagogiques annotés avec indicateurs de vérification.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('explore')}
                  className="text-xs sm:text-sm font-semibold text-[#102C27] hover:text-[#C7AA6A] inline-flex items-center gap-1"
                >
                  Tout parcourir <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {INITIAL_OPPORTUNITIES.slice(0, 3).map((opp) => (
                  <article
                    key={opp.id}
                    className="bg-white rounded-2xl border border-stone-200 p-6 flex flex-col justify-between hover:shadow-md transition-shadow"
                  >
                    <div className="space-y-3">
                      <div className="text-xs text-stone-500 flex items-center gap-2">
                        <span>{t(`category_${opp.category}`)}</span>
                        <span>·</span>
                        <span className="text-amber-800 font-semibold">{t('demo_badge')}</span>
                      </div>

                      <h3
                        onClick={() => setSelectedOpp(opp)}
                        className="font-serif font-bold text-lg text-[#102C27] hover:text-[#C7AA6A] transition-colors cursor-pointer line-clamp-2"
                      >
                        {opp.title}
                      </h3>

                      <p className="text-xs text-stone-600 font-medium">{opp.organization}</p>
                      <p className="text-xs sm:text-sm text-stone-600 line-clamp-3 leading-relaxed">
                        {opp.description}
                      </p>

                      <div className="pt-2 text-xs text-stone-500 space-y-1">
                        <div>{opp.location}</div>
                        <div>
                          {t('deadline_label')} : <span className="text-stone-800 font-medium">{opp.deadline}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
                      <button
                        onClick={() => setSelectedOpp(opp)}
                        className="text-xs font-bold text-[#102C27] hover:text-[#C7AA6A] inline-flex items-center gap-1"
                      >
                        {t('view_details')} <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => toggleFavoriteOpp(opp.id, e)}
                          className={`p-2 rounded-lg border transition-colors ${
                            favoriteOppIds.includes(opp.id)
                              ? 'bg-rose-50 text-rose-600 border-rose-300'
                              : 'border-stone-200 text-stone-400 hover:text-rose-600'
                          }`}
                          title={favoriteOppIds.includes(opp.id) ? t('favorited') : t('mark_as_favorite')}
                          aria-label={favoriteOppIds.includes(opp.id) ? t('favorited') : t('mark_as_favorite')}
                        >
                          <Heart
                            className={`w-4 h-4 ${
                              favoriteOppIds.includes(opp.id)
                                ? 'fill-rose-600 text-rose-600'
                                : ''
                            }`}
                          />
                        </button>

                        <button
                          onClick={() => toggleSaveOpp(opp.id)}
                          className={`p-2 rounded-lg border transition-colors ${
                            savedOppIds.includes(opp.id)
                              ? 'bg-[#102C27] text-[#C7AA6A] border-[#102C27]'
                              : 'border-stone-200 text-stone-500 hover:text-stone-800'
                          }`}
                          title={savedOppIds.includes(opp.id) ? t('saved_opp') : t('save_opp')}
                        >
                          <Bookmark className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ======================================================================
            VIEW 2: EXPLORE OPPORTUNITIES
            ====================================================================== */}
        {activeTab === 'explore' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#102C27]">
                  {t('nav_explore')}
                </h1>
                <p className="text-sm text-stone-600">
                  Filtres multicritères et fiches d’opportunités annotées.
                </p>
              </div>

              <div className="text-xs bg-amber-50 border border-amber-300 text-amber-900 px-3.5 py-2 rounded-xl flex items-center gap-2 max-w-md">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                <span>
                  Tous les enregistrements présentés sont des démonstrations pédagogiques non vérifiées.
                </span>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-4">
              <div className="relative">
                <Search className="w-5 h-5 absolute start-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('search_placeholder')}
                  className="w-full ps-10 pe-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#102C27]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {/* Category */}
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">
                    {t('filter_category')}
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-200 text-sm bg-stone-50 focus:ring-2 focus:ring-[#102C27]"
                  >
                    <option value="all">{t('filter_all_categories')}</option>
                    <option value="job">{t('category_job')}</option>
                    <option value="internship">{t('category_internship')}</option>
                    <option value="scholarship">{t('category_scholarship')}</option>
                    <option value="training">{t('category_training')}</option>
                    <option value="funding">{t('category_funding')}</option>
                    <option value="call_for_projects">{t('category_call_for_projects')}</option>
                    <option value="volunteering">{t('category_volunteering')}</option>
                    <option value="partnership">{t('category_partnership')}</option>
                  </select>
                </div>

                {/* Sector */}
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">
                    {t('filter_sector')}
                  </label>
                  <select
                    value={selectedSector}
                    onChange={(e) => setSelectedSector(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-200 text-sm bg-stone-50 focus:ring-2 focus:ring-[#102C27]"
                  >
                    <option value="all">{t('filter_all_sectors')}</option>
                    {availableSectors.map((sec) => (
                      <option key={sec} value={sec}>
                        {sec}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Audience */}
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">
                    {t('filter_audience')}
                  </label>
                  <select
                    value={selectedAudience}
                    onChange={(e) => setSelectedAudience(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-200 text-sm bg-stone-50 focus:ring-2 focus:ring-[#102C27]"
                  >
                    <option value="all">{t('filter_all_audiences')}</option>
                    {availableAudiences.map((aud) => (
                      <option key={aud} value={aud}>
                        {aud}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">
                    {t('filter_status')}
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-200 text-sm bg-stone-50 focus:ring-2 focus:ring-[#102C27]"
                  >
                    <option value="all">{t('filter_all_statuses')}</option>
                    <option value="documented_official">{t('status_documented')}</option>
                    <option value="pending_confirmation">{t('status_pending')}</option>
                    <option value="anomaly_detected">{t('status_anomaly')}</option>
                    <option value="not_confirmed">{t('status_not_confirmed')}</option>
                    <option value="not_performed">{t('status_not_performed')}</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs transition-all ${
                    showFavoritesOnly
                      ? 'bg-rose-100 text-rose-900 border border-rose-300 font-bold shadow-xs'
                      : 'bg-stone-50 border border-stone-200 text-stone-700 hover:bg-stone-100 font-medium'
                  }`}
                  aria-pressed={showFavoritesOnly}
                >
                  <Heart className={`w-3.5 h-3.5 ${showFavoritesOnly ? 'fill-rose-600 text-rose-600' : 'text-stone-400'}`} />
                  <span>{t('filter_favorites_only')}</span>
                  <span className="px-1.5 py-0.5 rounded bg-white text-stone-800 font-bold text-[10px] border border-stone-200 tabular-nums">
                    {favoriteOppIds.length}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setSelectedSector('all');
                    setSelectedAudience('all');
                    setSelectedStatus('all');
                    setShowFavoritesOnly(false);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors"
                >
                  {t('filter_reset')}
                </button>
              </div>
            </div>

            {/* Results Counter */}
            <div className="flex items-center justify-between text-xs text-stone-600 font-medium px-1">
              <span>
                {filteredOpportunities.length} {t('results_count')}
                {showFavoritesOnly && ' (filtré sur vos favoris)'}
              </span>
              {favoriteOppIds.length > 0 && (
                <span className="text-stone-500 text-[11px] flex items-center gap-1">
                  <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                  <strong className="text-stone-700">{favoriteOppIds.length}</strong> favori(s) enregistré(s) localement
                </span>
              )}
            </div>

            {/* Card Grid */}
            {filteredOpportunities.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-dashed border-stone-300 text-center space-y-3">
                <HelpCircle className="w-10 h-10 text-stone-400 mx-auto" />
                <h3 className="font-serif font-bold text-lg text-stone-800">{t('no_results_title')}</h3>
                <p className="text-sm text-stone-500">{t('no_results_desc')}</p>
                {showFavoritesOnly && (
                  <button
                    onClick={() => setShowFavoritesOnly(false)}
                    className="mt-2 px-4 py-2 text-xs font-bold bg-[#102C27] text-[#C7AA6A] rounded-xl hover:bg-[#1b433c]"
                  >
                    Afficher toutes les opportunités
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredOpportunities.map((opp) => {
                  const isFavorited = favoriteOppIds.includes(opp.id);
                  const isSaved = savedOppIds.includes(opp.id);

                  return (
                    <article
                      key={opp.id}
                      className={`bg-white rounded-2xl border p-6 flex flex-col justify-between hover:shadow-md transition-all ${
                        isFavorited ? 'border-rose-300/80 ring-1 ring-rose-200' : 'border-stone-200'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="text-xs text-stone-500 flex items-center gap-1.5">
                            <span>{t(`category_${opp.category}`)}</span>
                            <span>·</span>
                            <span>{opp.sector}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {isFavorited && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                                <Heart className="w-3 h-3 fill-rose-600 text-rose-600" />
                                <span>{t('favorited')}</span>
                              </span>
                            )}
                            {renderStatus(opp.verificationStatus)}
                          </div>
                        </div>

                        <h2
                          onClick={() => setSelectedOpp(opp)}
                          className="text-lg font-serif font-bold text-[#102C27] hover:text-[#C7AA6A] transition-colors cursor-pointer"
                        >
                          {opp.title}
                        </h2>

                        <p className="text-xs text-stone-600 font-semibold">{opp.organization}</p>
                        <p className="text-xs sm:text-sm text-stone-600 line-clamp-3 leading-relaxed">
                          {opp.description}
                        </p>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {opp.requiredSkills.slice(0, 3).map((sk) => (
                            <span
                              key={sk}
                              className="text-xs px-2 py-0.5 rounded bg-stone-100 text-stone-700"
                            >
                              {sk}
                            </span>
                          ))}
                          {opp.requiredSkills.length > 3 && (
                            <span className="text-xs px-1.5 py-0.5 text-stone-400">
                              +{opp.requiredSkills.length - 3}
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-stone-500 space-y-1 pt-2 border-t border-stone-100">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[#C7AA6A]" />
                            <span>{opp.location}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-[#C7AA6A]" />
                            <span>
                              {t('deadline_label')} : <strong className="text-stone-800">{opp.deadline}</strong>
                            </span>
                          </div>
                          <div className="text-[11px] text-stone-400 flex items-center gap-2">
                            <span>{t('original_lang')} : {opp.originalLanguage}</span>
                            <span>·</span>
                            <span>{t('last_verified')} : {opp.lastCheckedDate}</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 mt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
                        <button
                          onClick={() => setSelectedOpp(opp)}
                          className="px-4 py-2 rounded-xl bg-[#102C27] text-white hover:bg-[#1b433c] text-xs font-semibold transition-colors inline-flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{t('view_details')}</span>
                        </button>

                        <div className="flex items-center gap-2">
                          {/* Specifically implemented 'Mark as Favorite' action for opportunity/job cards */}
                          <button
                            onClick={(e) => toggleFavoriteOpp(opp.id, e)}
                            className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-all ${
                              isFavorited
                                ? 'bg-rose-50 border-rose-300 text-rose-700 font-semibold shadow-2xs'
                                : 'border-stone-200 text-stone-600 hover:text-stone-900 hover:border-stone-300 bg-white'
                            }`}
                            title={isFavorited ? t('favorited') : t('mark_as_favorite')}
                            aria-label={isFavorited ? t('favorited') : t('mark_as_favorite')}
                          >
                            <Heart
                              className={`w-3.5 h-3.5 transition-transform ${
                                isFavorited
                                  ? 'fill-rose-600 text-rose-600 scale-110'
                                  : 'text-stone-400 hover:text-rose-600'
                              }`}
                            />
                            <span>{isFavorited ? t('favorited') : t('mark_as_favorite')}</span>
                          </button>

                          {/* Existing Bookmark / Save control */}
                          <button
                            onClick={(e) => toggleSaveOpp(opp.id, e)}
                            className={`p-2 rounded-lg border transition-colors ${
                              isSaved
                                ? 'bg-[#C7AA6A] text-[#102C27] border-[#C7AA6A]'
                                : 'border-stone-200 text-stone-500 hover:text-stone-800'
                            }`}
                            title={isSaved ? t('saved_opp') : t('save_opp')}
                            aria-label={isSaved ? t('saved_opp') : t('save_opp')}
                          >
                            <Bookmark className="w-4 h-4" />
                          </button>

                          {/* Report Issue */}
                          <button
                            onClick={() => triggerReport(opp.title)}
                            className="p-2 text-stone-400 hover:text-stone-700 rounded-lg transition-colors"
                            title={t('report_issue')}
                            aria-label={t('report_issue')}
                          >
                            <AlertTriangle className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ======================================================================
            VIEW 3: SAVED OPPORTUNITIES & FAVORITES
            ====================================================================== */}
        {activeTab === 'saved' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#102C27]">
                  {t('nav_saved')}
                </h1>
                <p className="text-sm text-stone-600">
                  Vos opportunités et favoris conservés localement sur votre navigateur.
                </p>
              </div>

              {/* Segmented Filter: All Bookmarks vs Marked Favorites */}
              <div className="inline-flex items-center gap-1 p-1 bg-stone-200/80 rounded-xl text-xs">
                <button
                  onClick={() => setSavedViewFilter('all')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                    savedViewFilter === 'all'
                      ? 'bg-white text-[#102C27] font-bold shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>{t('favorites_tab_all')} ({savedOppIds.length})</span>
                  </span>
                </button>
                <button
                  onClick={() => setSavedViewFilter('favorites')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                    savedViewFilter === 'favorites'
                      ? 'bg-white text-rose-700 font-bold shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 fill-rose-600 text-rose-600" />
                    <span>{t('favorites_tab_favs')} ({favoriteOppIds.length})</span>
                  </span>
                </button>
              </div>
            </div>

            {(() => {
              const displayedOpps =
                savedViewFilter === 'favorites'
                  ? INITIAL_OPPORTUNITIES.filter((o) => favoriteOppIds.includes(o.id))
                  : INITIAL_OPPORTUNITIES.filter((o) => savedOppIds.includes(o.id));

              if (displayedOpps.length === 0) {
                return (
                  <div className="bg-white p-12 rounded-3xl border border-dashed border-stone-300 text-center space-y-4">
                    {savedViewFilter === 'favorites' ? (
                      <Heart className="w-12 h-12 text-rose-300 mx-auto" />
                    ) : (
                      <Bookmark className="w-12 h-12 text-stone-300 mx-auto" />
                    )}
                    <h3 className="font-serif font-bold text-lg text-stone-800">
                      {savedViewFilter === 'favorites' ? 'Aucun favori marqué pour le moment' : t('no_saved_title')}
                    </h3>
                    <p className="text-sm text-stone-500 max-w-md mx-auto">
                      {savedViewFilter === 'favorites'
                        ? 'Cliquez sur « Marquer comme favori » sur n’importe quelle carte de l’explorateur pour la retrouver ici.'
                        : t('no_saved_desc')}
                    </p>
                    <button
                      onClick={() => setActiveTab('explore')}
                      className="px-5 py-2.5 rounded-xl bg-[#102C27] text-[#C7AA6A] text-sm font-semibold hover:bg-[#1b433c]"
                    >
                      {t('hero_cta_explore')}
                    </button>
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {displayedOpps.map((opp) => {
                    const isFavorited = favoriteOppIds.includes(opp.id);
                    const isSaved = savedOppIds.includes(opp.id);

                    return (
                      <article
                        key={opp.id}
                        className={`bg-white rounded-2xl border p-6 flex flex-col justify-between hover:shadow-md transition-all ${
                          isFavorited ? 'border-rose-300/80 ring-1 ring-rose-200' : 'border-stone-200'
                        }`}
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs text-stone-500 font-medium">
                              {t(`category_${opp.category}`)} &bull; {opp.sector}
                            </span>
                            <div className="flex items-center gap-2">
                              {isFavorited && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                                  <Heart className="w-3 h-3 fill-rose-600 text-rose-600" />
                                  <span>{t('favorited')}</span>
                                </span>
                              )}
                              {renderStatus(opp.verificationStatus)}
                            </div>
                          </div>

                          <h3 className="font-serif font-bold text-lg text-[#102C27]">{opp.title}</h3>
                          <p className="text-xs text-stone-600 font-semibold">{opp.organization}</p>
                          <p className="text-xs sm:text-sm text-stone-600 line-clamp-2">{opp.description}</p>
                        </div>

                        <div className="pt-4 mt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
                          <button
                            onClick={() => setSelectedOpp(opp)}
                            className="text-xs font-bold text-[#102C27] hover:text-[#C7AA6A] inline-flex items-center gap-1"
                          >
                            {t('view_details')} <ArrowRight className="w-3.5 h-3.5" />
                          </button>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => toggleFavoriteOpp(opp.id, e)}
                              className={`p-2 rounded-lg border transition-colors ${
                                isFavorited
                                  ? 'bg-rose-50 border-rose-300 text-rose-700'
                                  : 'border-stone-200 text-stone-500 hover:text-stone-800'
                              }`}
                              title={isFavorited ? t('favorited') : t('mark_as_favorite')}
                            >
                              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-600 text-rose-600' : ''}`} />
                            </button>

                            <button
                              onClick={(e) => toggleSaveOpp(opp.id, e)}
                              className={`p-2 rounded-lg border transition-colors ${
                                isSaved
                                  ? 'bg-[#102C27] text-[#C7AA6A] border-[#102C27]'
                                  : 'border-stone-200 text-stone-500 hover:text-stone-800'
                              }`}
                              title={isSaved ? t('saved_opp') : t('save_opp')}
                            >
                              <Bookmark className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        )}

        {/* ======================================================================
            VIEW 4: MY CAREER PATH & CHECKLIST
            ====================================================================== */}
        {activeTab === 'career' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#102C27]">
                {t('nav_career')}
              </h1>
              <p className="text-sm text-stone-600">
                Plan de progression, checklist de préparation administrative et répertoires publics.
              </p>
            </div>

            {/* Profile Overview (Non-sensitive simulation) */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#102C27] text-[#C7AA6A] font-serif font-bold text-2xl flex items-center justify-center">
                  CI
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#102C27]">
                    Profil Candidat Démonstration
                  </h3>
                  <p className="text-xs text-stone-500">
                    Données locales stockées sur cet appareil &bull; Aucun document d’identité collecté
                  </p>
                  <span className="inline-block mt-1 text-xs font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    Statut : Prêt pour candidatures ciblées
                  </span>
                </div>
              </div>
              <div className="text-xs text-stone-500 border-s-0 sm:border-s border-stone-200 ps-0 sm:ps-4 space-y-1">
                <div>{t('favorites_tab_all')} : <strong className="text-stone-800">{savedOppIds.length}</strong></div>
                <div>{t('favorites_tab_favs')} : <strong className="text-rose-700">{favoriteOppIds.length}</strong></div>
                <div>{t('pending_submissions')} : <strong className="text-stone-800">{submittedOpps.length}</strong></div>
              </div>
            </div>

            {/* Preparation Checklist */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4">
              <h3 className="font-serif font-bold text-lg text-[#102C27] flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#C7AA6A]" />
                <span>Checklist de préparation aux opportunités institutionnelles</span>
              </h3>
              <p className="text-xs sm:text-sm text-stone-600">
                Suivez ces étapes concrètes pour maximiser l’intégrité de vos candidatures auprès d’organismes formels.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  {
                    id: 'step1',
                    title: 'Vérifier la validité des dates limites et sources officielles',
                    detail: 'Toujours remonter au portail public ou à l’organisme de tutelle avant tout versement ou dépôt.'
                  },
                  {
                    id: 'step2',
                    title: 'Faire certifier vos diplômes auprès du service ministériel habilité',
                    detail: 'Pour la Côte d’Ivoire : Guichet des équivalences du MESRS.'
                  },
                  {
                    id: 'step3',
                    title: 'Aligner votre CV sur les compétences explicites requises',
                    detail: 'Utilisez l’analyseur KOROYA pour combler les écarts avant transmission.'
                  },
                  {
                    id: 'step4',
                    title: 'Préparer un portfolio de réalisations concrètes',
                    detail: 'Rapports techniques, projets GitHub, certificats de bénévolat documentés.'
                  }
                ].map((item) => (
                  <label
                    key={item.id}
                    className="flex items-start gap-3 p-3.5 rounded-xl border border-stone-200 hover:bg-stone-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={!!checklist[item.id]}
                      onChange={() => toggleChecklist(item.id)}
                      className="mt-1 h-4 w-4 rounded text-[#102C27] focus:ring-[#102C27] cursor-pointer"
                    />
                    <div>
                      <div
                        className={`text-sm font-semibold ${
                          checklist[item.id] ? 'line-through text-stone-400' : 'text-[#102C27]'
                        }`}
                      >
                        {item.title}
                      </div>
                      <div className="text-xs text-stone-500 mt-0.5">{item.detail}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Official External Directories */}
            <div className="bg-[#25364A] text-[#F6F1E5] p-6 rounded-2xl space-y-4">
              <h3 className="font-serif font-bold text-lg text-white">
                Guichets administratifs officiels recommandés
              </h3>
              <p className="text-xs sm:text-sm text-gray-200">
                KOROYA est un facilitateur indépendant et ne remplace pas les autorités régaliennes :
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <a
                  href="https://servicepublic.gouv.ci/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-between text-sm font-semibold transition-colors"
                >
                  <span>{t('official_ci_services')}</span>
                  <ExternalLink className="w-4 h-4 text-[#C7AA6A]" />
                </a>
                <a
                  href="https://enseignement.gouv.ci/services"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-between text-sm font-semibold transition-colors"
                >
                  <span>{t('official_ci_higher_ed')}</span>
                  <ExternalLink className="w-4 h-4 text-[#C7AA6A]" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================================
            VIEW 5: KOROYA SKILLS & MATCHING
            ====================================================================== */}
        {activeTab === 'skills' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#102C27]">
                {t('skills_title')}
              </h1>
              <p className="text-sm text-stone-600 max-w-3xl">
                {t('skills_subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Form Input Column */}
              <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-stone-200 space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase text-stone-600 mb-1.5">
                    {t('select_opp_label')}
                  </label>
                  <select
                    value={selectedSkillsOppId}
                    onChange={(e) => setSelectedSkillsOppId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#102C27]"
                  >
                    {INITIAL_OPPORTUNITIES.map((opp) => (
                      <option key={opp.id} value={opp.id}>
                        {opp.title} ({opp.organization})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-stone-600 mb-1.5">
                    {t('required_skills_label')}
                  </label>
                  <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-stone-50 border border-stone-200">
                    {currentSkillsOpp.requiredSkills.map((sk) => (
                      <span
                        key={sk}
                        className="text-xs px-2.5 py-1 rounded bg-white text-[#102C27] font-semibold border border-stone-200"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-stone-600 mb-1.5">
                    {t('declared_skills_label')}
                  </label>
                  <textarea
                    rows={4}
                    value={declaredSkillsInput}
                    onChange={(e) => setDeclaredSkillsInput(e.target.value)}
                    className="w-full p-3 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#102C27]"
                    placeholder="Ex: Autocad, Gestion de projet agile, Anglais technique..."
                  />
                  <p className="text-[11px] text-stone-500 mt-1">
                    Auto-évaluation déclarative distincte des compétences certifiées par un organisme indépendant.
                  </p>
                </div>
              </div>

              {/* Comparative Assessment Column */}
              <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-stone-200 space-y-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-200">
                    <div>
                      <h3 className="font-serif font-bold text-lg text-[#102C27]">
                        Bilan d’Adéquation Structuré
                      </h3>
                      <p className="text-xs text-stone-500">
                        Comparaison stricte avec les mentions de l’annonce
                      </p>
                    </div>
                    <div className="text-end">
                      <div className="text-2xl font-serif font-bold text-[#102C27]">
                        {skillsAnalysis.matchRate}%
                      </div>
                      <span className="text-[10px] text-stone-500 font-semibold uppercase">
                        {t('skills_match_rate')}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden mb-6">
                    <div
                      className="h-full bg-[#102C27] transition-all duration-300"
                      style={{ width: `${skillsAnalysis.matchRate}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Aligned */}
                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
                      <h4 className="text-xs font-bold uppercase text-emerald-900 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                        <span>{t('matched_skills')} ({skillsAnalysis.matched.length})</span>
                      </h4>
                      {skillsAnalysis.matched.length === 0 ? (
                        <p className="text-xs text-emerald-700 italic">Aucune correspondance directe trouvée.</p>
                      ) : (
                        <ul className="space-y-1">
                          {skillsAnalysis.matched.map((m) => (
                            <li key={m} className="text-xs text-emerald-900 font-medium">
                              &bull; {m}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* Gaps */}
                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
                      <h4 className="text-xs font-bold uppercase text-amber-900 flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-amber-700" />
                        <span>{t('gap_skills')} ({skillsAnalysis.missing.length})</span>
                      </h4>
                      {skillsAnalysis.missing.length === 0 ? (
                        <p className="text-xs text-amber-800 italic">Toutes les compétences requises sont déclarées.</p>
                      ) : (
                        <ul className="space-y-1">
                          {skillsAnalysis.missing.map((g) => (
                            <li key={g} className="text-xs text-amber-900 font-medium">
                              &bull; {g}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                  <h4 className="text-xs font-bold uppercase text-[#102C27] mb-1">
                    {t('learning_paths')}
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Pour combler les compétences non acquises, orientez-vous vers les certificats ouverts d’universités ou plateformes publiques régionales (UVCI, CAMES, formations professionnelles FDFP en Côte d’Ivoire).
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================================
            VIEW 6: DIPLOMA & INSTITUTION REFERENCE CHECK
            ====================================================================== */}
        {activeTab === 'verify' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#102C27]">
                {t('check_form_title')}
              </h1>
              <p className="text-sm text-stone-600 max-w-3xl">
                {t('check_form_subtitle')}
              </p>
            </div>

            {/* Essential Scope & Limitation Box */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs sm:text-sm space-y-1">
              <strong>Notice d’intégrité V1 :</strong> {t('check_disclaimer')}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Form */}
              <form
                onSubmit={handlePerformDiplomaCheck}
                className="lg:col-span-6 bg-white p-6 rounded-2xl border border-stone-200 space-y-4"
              >
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {t('country_label')}
                  </label>
                  <select
                    value={checkCountry}
                    onChange={(e) => setCheckCountry(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#102C27]"
                  >
                    <option value="Côte d’Ivoire">Côte d’Ivoire</option>
                    <option value="Sénégal">Sénégal</option>
                    <option value="Burkina Faso">Burkina Faso</option>
                    <option value="Bénin">Bénin</option>
                    <option value="Togo">Togo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {t('inst_label')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={checkInst}
                    onChange={(e) => setCheckInst(e.target.value)}
                    placeholder="Ex: INP-HB, UFHB Cocody, Université San Pedro"
                    className="w-full p-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#102C27]"
                  />
                  <div className="flex flex-wrap gap-2 mt-1.5 text-xs">
                    <span className="text-stone-500">Exemples de test :</span>
                    <button
                      type="button"
                      onClick={() => {
                        setCheckInst('INP-HB');
                        setCheckQual('Diplôme d’Ingénieur de Conception');
                      }}
                      className="text-[#102C27] font-semibold underline"
                    >
                      INP-HB
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCheckInst('UFHB');
                        setCheckQual('Master Professionnel');
                      }}
                      className="text-[#102C27] font-semibold underline"
                    >
                      UFHB
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCheckInst('San Pedro');
                        setCheckQual('Licence Professionnelle');
                      }}
                      className="text-[#102C27] font-semibold underline"
                    >
                      San Pedro
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCheckInst('École Numérique (Attente)');
                        setCheckQual('Licence Informatique et Cloud');
                      }}
                      className="text-amber-800 font-semibold underline"
                    >
                      En attente
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCheckInst('Académie Leadership (Inconnu)');
                        setCheckQual('Certificat Supérieur');
                      }}
                      className="text-stone-600 font-semibold underline"
                    >
                      Non confirmé
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCheckInst('Doctorat Privé Non Homologué');
                        setCheckQual('Doctorat en Gestion Privée');
                      }}
                      className="text-rose-700 font-semibold underline"
                    >
                      Anomalie
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {t('qual_label')}
                  </label>
                  <input
                    type="text"
                    value={checkQual}
                    onChange={(e) => setCheckQual(e.target.value)}
                    placeholder="Ex: Diplôme d’Ingénieur de Conception, Master, Licence"
                    className="w-full p-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#102C27]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      {t('field_label')}
                    </label>
                    <input
                      type="text"
                      value={checkField}
                      onChange={(e) => setCheckField(e.target.value)}
                      placeholder="Ex: Génie Électrique"
                      className="w-full p-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#102C27]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      {t('awarding_body_label')}
                    </label>
                    <input
                      type="text"
                      value={checkAwardingBody}
                      onChange={(e) => setCheckAwardingBody(e.target.value)}
                      placeholder="Ex: MESRS CI, CAMES"
                      className="w-full p-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#102C27]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {t('year_label')}
                  </label>
                  <input
                    type="number"
                    value={checkYear}
                    onChange={(e) => setCheckYear(e.target.value)}
                    min="1970"
                    max="2026"
                    className="w-full p-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#102C27]"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="submit"
                    disabled={isVerifying}
                    className="flex-1 py-3 rounded-xl bg-[#102C27] text-[#C7AA6A] font-bold text-sm hover:bg-[#1b433c] transition-colors flex items-center justify-center gap-2"
                  >
                    {isVerifying ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Consultation en cours...</span>
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4" />
                        <span>{t('btn_verify')}</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCheckInst('');
                      setCheckQual('');
                      setCheckField('');
                      setVerificationResult(null);
                    }}
                    className="px-4 py-3 border border-stone-300 text-stone-700 rounded-xl text-sm font-semibold hover:bg-stone-50"
                  >
                    {t('btn_reset')}
                  </button>
                </div>
              </form>

              {/* Result Preview Box */}
              <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-stone-200 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#102C27] mb-3">
                    {t('result_card_title')}
                  </h3>

                  {!verificationResult && !isVerifying && (
                    <div className="text-center py-12 text-stone-400 space-y-3">
                      <GraduationCap className="w-12 h-12 mx-auto text-stone-300" />
                      <p className="text-xs sm:text-sm max-w-sm mx-auto">
                        {t('result_waiting')}
                      </p>
                    </div>
                  )}

                  {verificationResult && (
                    <div className="space-y-4">
                      <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                        <div className="text-xs text-stone-500 mb-1">Statut d’Habilitation Documenté :</div>
                        <div>{renderStatus(verificationResult.status)}</div>
                      </div>

                      <div className="space-y-2 text-xs sm:text-sm">
                        <div>
                          <span className="text-stone-500">Établissement :</span>{' '}
                          <strong className="text-[#102C27]">{verificationResult.institution}</strong>
                        </div>
                        <div>
                          <span className="text-stone-500">Titre & Filière :</span>{' '}
                          <span className="text-stone-800 font-medium">
                            {verificationResult.qualification} &bull; {verificationResult.field}
                          </span>
                        </div>
                        <div>
                          <span className="text-stone-500">Organisme / Source :</span>{' '}
                          <span className="text-stone-800 font-medium">
                            {verificationResult.evidenceSource} (Consulté le {verificationResult.accessDate})
                          </span>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-stone-100 text-stone-800 text-xs space-y-1">
                        <strong>{t('scope_notes_label')} :</strong>
                        <p className="leading-relaxed">{verificationResult.scopeNotes}</p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs space-y-1">
                        <strong>{t('limitations_label')} :</strong>
                        <p className="leading-relaxed">{verificationResult.limitations}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 mt-4 border-t border-stone-100 text-center">
                  <span className="text-[11px] text-stone-400">
                    Répertoire officiel public de référence : Ministère de l’Enseignement Supérieur (MESRS CI).
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================================
            VIEW 7: EDUCATION-TO-EMPLOYMENT RADAR
            ====================================================================== */}
        {activeTab === 'radar' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#102C27]">
                {t('radar_title')}
              </h1>
              <p className="text-sm text-stone-600 max-w-3xl">
                {t('radar_subtitle')}
              </p>
            </div>

            {/* Indicator Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-stone-200">
                <span className="text-xs text-stone-500 font-medium">Échantillon observé</span>
                <div className="text-2xl font-serif font-bold text-[#102C27] mt-1 tabular-nums">150 offres</div>
                <span className="text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded font-bold">
                  Modélisation Fictive
                </span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-stone-200">
                <span className="text-xs text-stone-500 font-medium">Secteur leader</span>
                <div className="text-2xl font-serif font-bold text-[#102C27] mt-1">Agro / Numérique</div>
                <span className="text-[10px] text-stone-500">38% de l’échantillon</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-stone-200">
                <span className="text-xs text-stone-500 font-medium">Période d'indexation</span>
                <div className="text-2xl font-serif font-bold text-[#102C27] mt-1">Q3-Q4 2026</div>
                <span className="text-[10px] text-stone-500">Collecte trimestrielle</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-stone-200">
                <span className="text-xs text-stone-500 font-medium">Rigueur de l'échantillon</span>
                <div className="text-2xl font-serif font-bold text-emerald-800 mt-1">Pilote V1</div>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">
                  Démonstration
                </span>
              </div>
            </div>

            {/* Radar Distribution Panels */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4">
                <h3 className="font-serif font-bold text-base text-[#102C27]">
                  Compétences les plus requises (Échantillon Démo)
                </h3>
                <div className="space-y-3">
                  {[
                    { skill: 'Gestion de projet & Méthodes agiles', pct: 72 },
                    { skill: 'Analyse de données (Excel, Python, PowerBI)', pct: 64 },
                    { skill: 'Développement d’Applications Web & Mobiles', pct: 51 },
                    { skill: 'Énergies Renouvelables & Audit Carbone', pct: 43 },
                    { skill: 'Transformation Agro-industrielle & Normes ISO', pct: 39 }
                  ].map((row) => (
                    <div key={row.skill} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-stone-800">{row.skill}</span>
                        <span className="text-stone-500 tabular-nums">{row.pct}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                        <div
                          className="h-full bg-[#102C27] rounded-full"
                          style={{ width: `${row.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4">
                <h3 className="font-serif font-bold text-base text-[#102C27]">
                  Répartition Géographique Indicative
                </h3>
                <div className="space-y-3">
                  {[
                    { pole: 'Abidjan Métropole (Services, Fintech, Sièges)', count: '55%' },
                    { pole: 'San Pedro (Agro-export, Logistique portuaire)', count: '18%' },
                    { pole: 'Bouaké & Vallée du Bandama (Textile, Agro)', count: '14%' },
                    { pole: 'Korhogo & Région du Poro (Énergie, Mines, Coton)', count: '13%' }
                  ].map((p) => (
                    <div
                      key={p.pole}
                      className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between text-xs"
                    >
                      <span className="font-semibold text-[#102C27]">{p.pole}</span>
                      <span className="font-bold text-[#102C27] bg-[#C7AA6A]/30 px-2.5 py-1 rounded tabular-nums">
                        {p.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-stone-100 text-stone-600 text-xs">
              <strong>Notice méthodologique :</strong> {t('radar_sample_note')}
            </div>
          </div>
        )}

        {/* ======================================================================
            VIEW 8: ORGANIZATION PORTAL
            ====================================================================== */}
        {activeTab === 'org' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#102C27]">
                {t('org_title')}
              </h1>
              <p className="text-sm text-stone-600 max-w-3xl">
                {t('org_subtitle')}
              </p>
            </div>

            {submissionFeedback && (
              <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                <span>{submissionFeedback}</span>
              </div>
            )}

            {/* Pioneer Organization Launch Callout (0 User / Early Launch Phase) */}
            <div className="bg-[#102C27] text-[#F6F1E5] p-5 sm:p-6 rounded-2xl border border-[#C7AA6A]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
              <div className="space-y-1.5">
                <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#C7AA6A] text-[#102C27] uppercase tracking-wider">
                  {t('pioneer_org_badge')}
                </span>
                <h3 className="font-serif font-bold text-base sm:text-lg text-white">
                  {t('pioneer_org_title')}
                </h3>
                <p className="text-xs text-gray-200 leading-relaxed max-w-2xl">
                  {t('pioneer_org_desc')}
                </p>
              </div>
              <div className="shrink-0 px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-xs text-[#C7AA6A] font-semibold text-center">
                0 Frais &bull; Indexation Prioritaire
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Submission Form */}
              <form
                onSubmit={handleOrgSubmit}
                className="lg:col-span-7 bg-white p-6 rounded-2xl border border-stone-200 space-y-4"
              >
                <h3 className="font-serif font-bold text-lg text-[#102C27]">
                  Dépôt d’une Opportunité pour Examen
                </h3>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {t('submit_opp_title')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Ex: Responsable Suivi-Évaluation Projets Climat"
                    className="w-full p-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#102C27]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      {t('submit_opp_org')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={newOrg}
                      onChange={(e) => setNewOrg(e.target.value)}
                      placeholder="Nom officiel de votre structure"
                      className="w-full p-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#102C27]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      {t('filter_category')}
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as Category)}
                      className="w-full p-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#102C27]"
                    >
                      <option value="job">{t('category_job')}</option>
                      <option value="internship">{t('category_internship')}</option>
                      <option value="scholarship">{t('category_scholarship')}</option>
                      <option value="training">{t('category_training')}</option>
                      <option value="funding">{t('category_funding')}</option>
                      <option value="call_for_projects">{t('category_call_for_projects')}</option>
                      <option value="volunteering">{t('category_volunteering')}</option>
                      <option value="partnership">{t('category_partnership')}</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      {t('filter_sector')}
                    </label>
                    <input
                      type="text"
                      value={newSector}
                      onChange={(e) => setNewSector(e.target.value)}
                      placeholder="Ex: Énergie, Agro"
                      className="w-full p-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#102C27]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Localisation
                    </label>
                    <input
                      type="text"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      placeholder="Ex: Abidjan, Bouaké"
                      className="w-full p-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#102C27]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      {t('deadline_label')}
                    </label>
                    <input
                      type="date"
                      value={newDeadline}
                      onChange={(e) => setNewDeadline(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#102C27]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {t('submit_opp_url')} *
                  </label>
                  <input
                    type="url"
                    required
                    value={newOfficialUrl}
                    onChange={(e) => setNewOfficialUrl(e.target.value)}
                    placeholder="https://votrestructure.org/recrutement-officiel"
                    className="w-full p-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#102C27]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {t('submit_opp_desc')}
                  </label>
                  <textarea
                    rows={4}
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Présentez les missions principales et les critères d’éligibilité..."
                    className="w-full p-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#102C27]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#102C27] text-[#C7AA6A] font-bold text-sm hover:bg-[#1b433c] transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{t('submit_opp_btn')}</span>
                </button>
              </form>

              {/* Submissions Queue Preview */}
              <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-stone-200 space-y-4">
                <h3 className="font-serif font-bold text-lg text-[#102C27]">
                  {t('pending_submissions')}
                </h3>

                {submittedOpps.length === 0 ? (
                  <p className="text-xs text-stone-500 italic">
                    Aucune opportunité soumise pour le moment sur ce navigateur.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {submittedOpps.map((sub) => (
                      <div
                        key={sub.id}
                        className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                            {sub.status}
                          </span>
                          <span className="text-[11px] text-stone-400">{sub.submittedAt}</span>
                        </div>
                        <h4 className="font-serif font-bold text-sm text-[#102C27]">{sub.title}</h4>
                        <div className="text-xs text-stone-600">
                          {sub.organization} &bull; {sub.location}
                        </div>
                        <div className="text-[11px] text-stone-500 truncate">Source : {sub.officialUrl}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================================
            VIEW 9: TRUST & VERIFICATION POLICY
            ====================================================================== */}
        {activeTab === 'trust' && (
          <div className="space-y-8 max-w-4xl mx-auto">
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#102C27]">
                {t('nav_trust')}
              </h1>
              <p className="text-sm text-stone-600">
                Principes déontologiques, transparence des sources et protection des usagers.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 space-y-6 text-sm text-stone-700 leading-relaxed">
              <section className="space-y-2">
                <h3 className="font-serif font-bold text-lg text-[#102C27]">
                  1. Rôle de Facilitateur Indépendant
                </h3>
                <p>
                  KOROYA ne délivre pas d’agréments, ne confère pas de bourses en son nom propre et ne se substitue à aucune administration publique. Notre vocation est d’indexer, clarifier et documenter les opportunités en renvoyant rigoureusement aux sources officielles identifiables.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-serif font-bold text-lg text-[#102C27]">
                  2. Statuts de Documentation et Limites
                </h3>
                <p>
                  L’attribution d’un statut de reconnaissance repose exclusivement sur la présence d’un acte réglementaire (décret, arrêté, répertoire officiel du MESRS ou du CAMES). L’absence de reconnaissance documentée ne constitue pas une preuve de fraude, mais invite l’usager à une vérification directe auprès des services étatiques.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-serif font-bold text-lg text-[#102C27]">
                  3. Protection des Données et Vie Privée
                </h3>
                <p>
                  Cette version V1 n’exige aucun mot de passe, ne recueille aucun numéro de téléphone, aucune pièce d’identité, ni aucun document numérisé. Vos préférences et sauvegardes demeurent strictement cantonnées au stockage local de votre navigateur.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-serif font-bold text-lg text-[#102C27]">
                  4. Signalement d’Inexactitude et Droit de Rectification
                </h3>
                <p>
                  Tout usager ou représentant d'organisme peut signaler à tout moment une opportunité expirée, un lien défectueux ou une anomalie de libellé via le bouton dédié présent sur chaque fiche.
                </p>
                <button
                  onClick={() => triggerReport('Politique Générale')}
                  className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-colors"
                >
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Ouvrir le formulaire de signalement</span>
                </button>
              </section>
            </div>
          </div>
        )}

        {/* ======================================================================
            VIEW 10: ABOUT KOROYA
            ====================================================================== */}
        {activeTab === 'about' && (
          <div className="space-y-8 max-w-4xl mx-auto">
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#102C27]">
                {t('nav_about')}
              </h1>
              <p className="text-sm text-stone-600">
                Genèse, vision panafricaine et feuille de route technologique.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 space-y-6 text-sm text-stone-700 leading-relaxed">
              <div className="space-y-2">
                <h3 className="font-serif font-bold text-lg text-[#102C27]">
                  L’Esprit KOROYA
                </h3>
                <p>
                  « KOROYA » puise son inspiration dans les valeurs ouest-africaines de dignité, de transmission du savoir et de mérite. En reliant le potentiel individuel aux exigences concrètes des projets de développement, KOROYA ambitionne de lever l’opacité informationnelle qui pénalise souvent la jeunesse ouest-africaine.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-serif font-bold text-lg text-[#102C27]">
                  Architecture Technique V1
                </h3>
                <ul className="list-disc ps-5 space-y-1 text-stone-600">
                  <li>Application React modulaire avec TypeScript et Tailwind CSS.</li>
                  <li>Système de traduction centralisé sur 7 langues majeures avec prise en charge intégrale de la disposition RTL pour l’arabe.</li>
                  <li>Zéro dépendance à des API payantes ou bases de données propriétaires tierces.</li>
                  <li>Conformité stricte aux critères d'accessibilité numérique et design mobile-first.</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-serif font-bold text-lg text-[#102C27]">
                  Feuille de Route pour le Déploiement en Production
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                    <strong className="block text-stone-800 text-xs uppercase mb-1">Étape 1</strong>
                    <span className="text-xs">Signature de protocoles d'échanges de données avec les ministères de tutelle.</span>
                  </div>
                  <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                    <strong className="block text-stone-800 text-xs uppercase mb-1">Étape 2</strong>
                    <span className="text-xs">Mise en place d'un back-office sécurisé pour la modération humaine assermentée.</span>
                  </div>
                  <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                    <strong className="block text-stone-800 text-xs uppercase mb-1">Étape 3</strong>
                    <span className="text-xs">Interfaçage avec les observatoires de l’emploi de l’UEMOA et de la CEDEAO.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ==========================================================================
          MODAL: OPPORTUNITY DETAILS
          ========================================================================== */}
      {selectedOpp && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs text-stone-500 font-semibold uppercase">
                  {t(`category_${selectedOpp.category}`)} &bull; {selectedOpp.sector}
                </span>
                <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#102C27] mt-1">
                  {selectedOpp.title}
                </h2>
                <p className="text-xs sm:text-sm font-semibold text-stone-600">
                  {selectedOpp.organization}
                </p>
              </div>
              <button
                onClick={() => setSelectedOpp(null)}
                className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                aria-label="Fermer la fiche"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status & Indicators */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-stone-500">{t('filter_status')} :</span>
                {renderStatus(selectedOpp.verificationStatus)}
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-stone-500">{t('official_source')} :</span>
                <span className="font-semibold text-stone-800">{selectedOpp.officialSource}</span>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-stone-500">{t('last_verified')} :</span>
                <span className="font-medium text-stone-700">{selectedOpp.lastCheckedDate}</span>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-stone-500">{t('original_lang')} :</span>
                <span className="font-medium text-stone-700">{selectedOpp.originalLanguage}</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h4 className="font-serif font-bold text-sm text-[#102C27]">Description</h4>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                {selectedOpp.description}
              </p>
            </div>

            {/* Eligibility */}
            <div className="space-y-2">
              <h4 className="font-serif font-bold text-sm text-[#102C27]">Critères d’Éligibilité</h4>
              <ul className="space-y-1">
                {selectedOpp.eligibility.map((crit, idx) => (
                  <li key={idx} className="text-xs sm:text-sm text-stone-600 flex items-start gap-2">
                    <span className="text-[#C7AA6A] font-bold">&bull;</span>
                    <span>{crit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <h4 className="font-serif font-bold text-sm text-[#102C27]">Compétences Attendues</h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedOpp.requiredSkills.map((sk) => (
                  <span
                    key={sk}
                    className="text-xs px-2.5 py-1 rounded bg-[#102C27]/5 text-[#102C27] font-medium border border-[#102C27]/10"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            {/* Demonstration Action Notice */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs space-y-1">
              <strong>{t('apply_modal_title')} :</strong>
              <p>{t('apply_modal_desc')}</p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-stone-200">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => toggleSaveOpp(selectedOpp.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-colors ${
                    savedOppIds.includes(selectedOpp.id)
                      ? 'bg-[#102C27] text-[#C7AA6A] border-[#102C27]'
                      : 'border-stone-300 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <Bookmark className="w-4 h-4" />
                  <span>{savedOppIds.includes(selectedOpp.id) ? t('saved_opp') : t('save_opp')}</span>
                </button>

                <button
                  onClick={() => toggleFavoriteOpp(selectedOpp.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all ${
                    favoriteOppIds.includes(selectedOpp.id)
                      ? 'bg-rose-50 text-rose-700 border-rose-300 font-bold'
                      : 'border-stone-300 text-stone-700 hover:bg-stone-50'
                  }`}
                  aria-label={favoriteOppIds.includes(selectedOpp.id) ? t('favorited') : t('mark_as_favorite')}
                >
                  <Heart
                    className={`w-4 h-4 transition-transform ${
                      favoriteOppIds.includes(selectedOpp.id)
                        ? 'fill-rose-600 text-rose-600 scale-105'
                        : 'text-stone-400'
                    }`}
                  />
                  <span>
                    {favoriteOppIds.includes(selectedOpp.id) ? t('favorited') : t('mark_as_favorite')}
                  </span>
                </button>
              </div>

              <button
                disabled
                className="px-6 py-2.5 rounded-xl bg-stone-300 text-stone-500 text-xs font-bold cursor-not-allowed"
                title="Action désactivée pour données de démonstration"
              >
                Postuler via le portail officiel (Désactivé)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================================================
          MODAL: REPORT INACCURACY
          ========================================================================== */}
      {reportModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-base text-[#102C27] flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <span>{t('report_issue')}</span>
              </h3>
              <button
                onClick={() => setReportModalOpen(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-stone-600">
              Cible : <strong className="text-stone-800">{reportTargetTitle}</strong>
            </p>

            {reportFeedback ? (
              <div className="p-3 rounded-xl bg-emerald-100 text-emerald-900 text-xs">
                {reportFeedback}
              </div>
            ) : (
              <div className="space-y-2">
                <span className="block text-xs font-semibold text-stone-700">Sélectionnez le motif :</span>
                {[
                  'Date limite expirée ou introuvable',
                  'Lien vers la source officielle brisé',
                  'Filière ou critères non conformes au texte légal',
                  'Autre anomalie de transcription'
                ].map((reason) => (
                  <button
                    key={reason}
                    onClick={() => handleSendReport(reason)}
                    className="w-full text-start p-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs text-stone-800 transition-colors"
                  >
                    {reason}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==========================================================================
          MODAL: FIRST-TIME VISITOR / DAY-0 ONBOARDING GUIDE
          ========================================================================== */}
      {onboardingOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#102C27] text-[#C7AA6A] font-serif font-black flex items-center justify-center text-xl shrink-0">
                  K
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-[#C7AA6A] bg-[#102C27] px-2 py-0.5 rounded">
                    Lancement V1.0 • Accès Libre
                  </span>
                  <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#102C27] mt-1">
                    {t('onboarding_modal_title')}
                  </h2>
                </div>
              </div>
              <button
                onClick={() => setOnboardingOpen(false)}
                className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                aria-label="Fermer le guide"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {t('onboarding_modal_subtitle')}
            </p>

            {/* 4 Interactive Guided Steps */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => {
                  setActiveTab('explore');
                  setOnboardingOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="p-4 rounded-2xl border border-stone-200 hover:border-[#102C27] bg-stone-50 hover:bg-stone-100/80 cursor-pointer transition-all group space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="w-6 h-6 rounded-full bg-[#102C27] text-white text-xs font-bold flex items-center justify-center">1</span>
                  <Search className="w-4 h-4 text-[#C7AA6A]" />
                </div>
                <h4 className="font-serif font-bold text-sm text-[#102C27] group-hover:text-[#C7AA6A] transition-colors">
                  {t('nav_explore')}
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Consultez 8 opportunités types (emplois, bourses, formations) étiquetées et annotées avec sources officielles.
                </p>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#102C27]">
                  Explorer <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>

              <div
                onClick={() => {
                  setActiveTab('verify');
                  setOnboardingOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="p-4 rounded-2xl border border-stone-200 hover:border-[#102C27] bg-stone-50 hover:bg-stone-100/80 cursor-pointer transition-all group space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="w-6 h-6 rounded-full bg-[#102C27] text-white text-xs font-bold flex items-center justify-center">2</span>
                  <ShieldCheck className="w-4 h-4 text-[#C7AA6A]" />
                </div>
                <h4 className="font-serif font-bold text-sm text-[#102C27] group-hover:text-[#C7AA6A] transition-colors">
                  {t('nav_verify')}
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Testez en direct les 5 statuts d’habilitation documentaire et répertoires publics MESRS Côte d’Ivoire.
                </p>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#102C27]">
                  Tester un établissement <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>

              <div
                onClick={() => {
                  setActiveTab('skills');
                  setOnboardingOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="p-4 rounded-2xl border border-stone-200 hover:border-[#102C27] bg-stone-50 hover:bg-stone-100/80 cursor-pointer transition-all group space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="w-6 h-6 rounded-full bg-[#102C27] text-white text-xs font-bold flex items-center justify-center">3</span>
                  <Sparkles className="w-4 h-4 text-[#C7AA6A]" />
                </div>
                <h4 className="font-serif font-bold text-sm text-[#102C27] group-hover:text-[#C7AA6A] transition-colors">
                  {t('nav_skills')}
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Comparez vos compétences déclarées aux exigences d'un poste, sans jugement sur votre école d’origine.
                </p>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#102C27]">
                  Calculer l’adéquation <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>

              <div
                onClick={() => {
                  setActiveTab('org');
                  setOnboardingOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="p-4 rounded-2xl border border-stone-200 hover:border-[#102C27] bg-stone-50 hover:bg-stone-100/80 cursor-pointer transition-all group space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="w-6 h-6 rounded-full bg-[#102C27] text-white text-xs font-bold flex items-center justify-center">4</span>
                  <Building2 className="w-4 h-4 text-[#C7AA6A]" />
                </div>
                <h4 className="font-serif font-bold text-sm text-[#102C27] group-hover:text-[#C7AA6A] transition-colors">
                  {t('nav_org')}
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Vous représentez une entreprise, une université ou une ONG ? Déposez la première opportunité pour revue.
                </p>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#102C27]">
                  Déposer une offre <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            {/* Privacy Guarantee Box */}
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <strong className="block text-emerald-900 font-bold">Garantie Souveraine & Confidentialité</strong>
                <p className="text-emerald-800 leading-relaxed">{t('onboarding_privacy_note')}</p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setOnboardingOpen(false)}
                className="px-6 py-2.5 rounded-xl bg-[#102C27] text-[#C7AA6A] font-bold text-xs hover:bg-[#1b433c] transition-colors"
              >
                Commencer l’exploration
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================================================
          FOOTER: INSTITUTIONAL ATTRIBUTIONS & OFFICIAL LINKS
          ========================================================================== */}
      <footer className="bg-[#102C27] text-[#F6F1E5] border-t border-[#C7AA6A]/30 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-[#C7AA6A] text-[#102C27] font-serif font-black flex items-center justify-center text-lg">
                  K
                </div>
                <span className="font-serif font-bold text-xl text-white">KOROYA</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                Plateforme d’accès aux opportunités professionnelles, académiques et entrepreneuriales pour la Côte d’Ivoire et l’Afrique de l’Ouest.
              </p>
            </div>

            <div>
              <h4 className="font-serif font-bold text-sm text-[#C7AA6A] mb-3">Navigation</h4>
              <ul className="space-y-1.5 text-xs text-gray-300">
                <li>
                  <button onClick={() => setActiveTab('explore')} className="hover:text-white">
                    {t('nav_explore')}
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('verify')} className="hover:text-white">
                    {t('nav_verify')}
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('skills')} className="hover:text-white">
                    {t('nav_skills')}
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('radar')} className="hover:text-white">
                    {t('nav_radar')}
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-serif font-bold text-sm text-[#C7AA6A] mb-3">
                Références Officielles
              </h4>
              <ul className="space-y-1.5 text-xs text-gray-300">
                <li>
                  <a
                    href="https://servicepublic.gouv.ci/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white flex items-center gap-1"
                  >
                    <span>Portail Service Public CI</span>
                    <ExternalLink className="w-3 h-3 text-[#C7AA6A]" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://enseignement.gouv.ci/services"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white flex items-center gap-1"
                  >
                    <span>Ministère Enseignement Supérieur (MESRS)</span>
                    <ExternalLink className="w-3 h-3 text-[#C7AA6A]" />
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-serif font-bold text-sm text-[#C7AA6A] mb-3">
                Garantie de Transparence
              </h4>
              <p className="text-[11px] text-gray-300 leading-normal">
                Prototype fonctionnel V1 avec persistance locale sécurisée. Ne traite aucun paiement et ne remplace pas les certifications d’État.
              </p>
              <div className="text-[11px] text-[#C7AA6A]">
                Abidjan &bull; Yamoussoukro &bull; Région Ouest-Africaine
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-2">
            <div>&copy; 2026 KOROYA. Talent Meets Opportunity. Tous droits réservés.</div>
            <div className="flex gap-4">
              <button onClick={() => setActiveTab('trust')} className="hover:text-white">
                Politique & Déontologie
              </button>
              <button onClick={() => setActiveTab('about')} className="hover:text-white">
                À propos
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* ==========================================================================
          FLOATING ACCESSIBLE TOAST (FAVORITES & SAVED ACTIONS)
          ========================================================================== */}
      {favoriteToast && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed bottom-6 end-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#102C27] text-white shadow-2xl border border-[#C7AA6A]/40 text-xs font-medium animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          <Heart className="w-4 h-4 text-rose-400 fill-rose-400 shrink-0" />
          <span>{favoriteToast}</span>
        </aside>
      )}
    </div>
  );
};

export default App;
