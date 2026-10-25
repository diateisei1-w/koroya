import React, { useState, useEffect, useMemo } from 'react';
import {
  Compass,
  Bookmark,
  Award,
  ShieldCheck,
  Globe,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  X,
  FileText,
  Calendar,
  MapPin,
  Briefcase,
  GraduationCap,
  Sparkles,
  BookOpen,
  ArrowRight,
  Clock,
  Menu,
  Share2,
  Trash2,
  Check,
  Send,
  Building,
  DollarSign,
  HelpCircle,
  History,
  Layers,
  ChevronDown
} from 'lucide-react';
import {
  DEMO_OPPORTUNITIES,
  INSTITUTIONAL_RESOURCES,
  CATEGORY_INFO,
  Opportunity,
  InstitutionalResource
} from './data/opportunities';

/* ==========================================================================
   CONSTANTS & LOCAL STORAGE KEYS
   ========================================================================== */
const STORAGE_KEY_SAVED = 'koroya_saved_opportunities';
const STORAGE_KEY_RECENT_SEARCHES = 'koroya_recent_searches';
const STORAGE_KEY_NEWSLETTER = 'koroya_newsletter_subscribed';

export function App() {
  // Navigation & View state
  const [activeTab, setActiveTab] = useState<'home' | 'explore' | 'scholarships' | 'jobs' | 'funding' | 'resources' | 'saved'>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedEducationLevel, setSelectedEducationLevel] = useState<string>('all');
  const [selectedField, setSelectedField] = useState<string>('all');
  const [selectedFundingType, setSelectedFundingType] = useState<string>('all');
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [selectedExperience, setSelectedExperience] = useState<string>('all');
  const [deadlineFilter, setDeadlineFilter] = useState<'all' | '15_days' | '30_days' | '60_days'>('all');
  const [paidOnlyFilter, setPaidOnlyFilter] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'deadline_asc' | 'deadline_desc' | 'relevance'>('deadline_asc');
  const [visibleCount, setVisibleCount] = useState<number>(6);

  // Selected Opportunity for Detail Modal
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);

  // Saved Opportunities (Bookmarks) in Local Storage
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_SAVED);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Recent Searches in Local Storage (Last 3 queries)
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_RECENT_SEARCHES);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Newsletter Form State
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [newsletterErrorMsg, setNewsletterErrorMsg] = useState('');

  // Early Access / Join Modal state
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [joinEmail, setJoinEmail] = useState('');
  const [joinRole, setJoinRole] = useState<'etudiant' | 'diplome' | 'porteur_projet' | 'recruteur'>('etudiant');
  const [joinSuccess, setJoinSuccess] = useState(false);

  // Synchronize saved IDs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(savedIds));
    } catch {
      // Ignore quota errors
    }
  }, [savedIds]);

  // Synchronize recent searches to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_RECENT_SEARCHES, JSON.stringify(recentSearches));
    } catch {
      // Ignore quota errors
    }
  }, [recentSearches]);

  // Helper: Trigger brief Toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Helper: Save a search query into recent searches (Max 3, distinct, non-empty)
  const recordSearchQuery = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter((item) => item.toLowerCase() !== trimmed.toLowerCase());
      const updated = [trimmed, ...filtered].slice(0, 3);
      return updated;
    });
  };

  // Helper: Clear recent searches
  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem(STORAGE_KEY_RECENT_SEARCHES);
    showToast('Historique des recherches récentes effacé');
  };

  // Helper: Apply a recent search chip
  const handleRecentSearchClick = (query: string) => {
    setSearchQuery(query);
    recordSearchQuery(query);
    setActiveTab('explore');
  };

  // Helper: Toggle save/favorite
  const toggleSaveOpportunity = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSavedIds((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        showToast('Opportunité retirée de vos enregistrements');
        return prev.filter((item) => item !== id);
      } else {
        showToast('Opportunité enregistrée dans votre navigateur');
        return [...prev, id];
      }
    });
  };

  // Share functionality (Copies link to clipboard and toasts)
  const handleShare = async (opp: Opportunity, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const shareUrl = window.location.origin + '?opp=' + encodeURIComponent(opp.id);
    if (navigator.share) {
      try {
        await navigator.share({
          title: `KOROYA : ${opp.title}`,
          text: `Découvrez cette opportunité vérifiée sur KOROYA (${opp.organization}) : ${opp.fundingAmount}`,
          url: shareUrl
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast('Lien copié dans le presse-papiers');
    } catch {
      showToast('Lien de partage : ' + shareUrl);
    }
  };

  // Newsletter submission handler
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNewsletterErrorMsg('');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!newsletterEmail || !emailRegex.test(newsletterEmail)) {
      setNewsletterErrorMsg('Veuillez saisir une adresse email valide.');
      setNewsletterStatus('error');
      return;
    }

    setNewsletterStatus('loading');
    setTimeout(() => {
      setNewsletterStatus('success');
      try {
        localStorage.setItem(STORAGE_KEY_NEWSLETTER, newsletterEmail);
      } catch {
        // Ignore
      }
      showToast('Inscription confirmée ! Vous recevrez nos alertes officielles.');
      setNewsletterEmail('');
    }, 600);
  };

  // Early access join handler
  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinEmail || !joinEmail.includes('@')) return;
    setJoinSuccess(true);
    setTimeout(() => {
      setIsJoinModalOpen(false);
      setJoinSuccess(false);
      setJoinEmail('');
      showToast('Bienvenue dans la communauté pionnière KOROYA !');
    }, 1500);
  };

  // Reset all active filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedCountry('all');
    setSelectedEducationLevel('all');
    setSelectedField('all');
    setSelectedFundingType('all');
    setSelectedFormat('all');
    setSelectedExperience('all');
    setDeadlineFilter('all');
    setPaidOnlyFilter(false);
    setSortBy('deadline_asc');
    setVisibleCount(6);
    showToast('Filtres réinitialisés');
  };

  // Determine active category based on active tab
  useEffect(() => {
    if (activeTab === 'scholarships') {
      setSelectedCategory('scholarship');
    } else if (activeTab === 'jobs') {
      setSelectedCategory('job');
    } else if (activeTab === 'funding') {
      setSelectedCategory('funding');
    }
  }, [activeTab]);

  // Calculation of days remaining until deadline
  const getDaysRemaining = (deadlineStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadline = new Date(deadlineStr);
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Filter & Sort Logic
  const filteredOpportunities = useMemo(() => {
    return DEMO_OPPORTUNITIES.filter((opp) => {
      // Category filter
      if (selectedCategory !== 'all' && opp.category !== selectedCategory) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = opp.title.toLowerCase().includes(q);
        const matchesOrg = opp.organization.toLowerCase().includes(q);
        const matchesDesc = opp.description.toLowerCase().includes(q);
        const matchesField = opp.field.toLowerCase().includes(q);
        const matchesAudience = opp.targetAudience.toLowerCase().includes(q);
        if (!matchesTitle && !matchesOrg && !matchesDesc && !matchesField && !matchesAudience) {
          return false;
        }
      }

      // Country filter
      if (selectedCountry !== 'all') {
        const matchesCountry = opp.eligibleCountries.some((c) =>
          c.toLowerCase().includes(selectedCountry.toLowerCase())
        );
        if (!matchesCountry) return false;
      }

      // Education level filter
      if (selectedEducationLevel !== 'all' && opp.educationLevel !== selectedEducationLevel) {
        return false;
      }

      // Field filter
      if (selectedField !== 'all' && !opp.field.toLowerCase().includes(selectedField.toLowerCase())) {
        return false;
      }

      // Funding type filter
      if (selectedFundingType !== 'all' && opp.fundingType !== selectedFundingType) {
        return false;
      }

      // Format filter
      if (selectedFormat !== 'all' && opp.format !== selectedFormat) {
        return false;
      }

      // Experience level filter
      if (selectedExperience !== 'all' && opp.experienceLevel !== selectedExperience) {
        return false;
      }

      // Paid only filter
      if (paidOnlyFilter && !opp.isPaid) {
        return false;
      }

      // Deadline filter
      if (deadlineFilter !== 'all') {
        const days = getDaysRemaining(opp.deadline);
        if (days < 0) return false; // Expired
        if (deadlineFilter === '15_days' && days > 15) return false;
        if (deadlineFilter === '30_days' && days > 30) return false;
        if (deadlineFilter === '60_days' && days > 60) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'deadline_asc') {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
      if (sortBy === 'deadline_desc') {
        return new Date(b.deadline).getTime() - new Date(a.deadline).getTime();
      }
      return 0; // default relevance
    });
  }, [
    selectedCategory,
    searchQuery,
    selectedCountry,
    selectedEducationLevel,
    selectedField,
    selectedFundingType,
    selectedFormat,
    selectedExperience,
    paidOnlyFilter,
    deadlineFilter,
    sortBy
  ]);

  // Saved Opportunities list
  const savedOpportunitiesList = useMemo(() => {
    return DEMO_OPPORTUNITIES.filter((opp) => savedIds.includes(opp.id));
  }, [savedIds]);

  // Featured Opportunities for Homepage
  const featuredOpportunities = useMemo(() => {
    return DEMO_OPPORTUNITIES.filter((opp) => opp.featured);
  }, []);

  // Closing Soon Opportunities
  const closingSoonOpportunities = useMemo(() => {
    return [...DEMO_OPPORTUNITIES]
      .filter((opp) => {
        const days = getDaysRemaining(opp.deadline);
        return days > 0 && days <= 45;
      })
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
      .slice(0, 3);
  }, []);

  // Students & Graduates Opportunities
  const studentOpportunities = useMemo(() => {
    return DEMO_OPPORTUNITIES.filter((opp) =>
      opp.category === 'scholarship' || opp.category === 'internship' || opp.category === 'mobility'
    ).slice(0, 3);
  }, []);

  // Entrepreneurship & Funding Opportunities in FCFA
  const fundingOpportunities = useMemo(() => {
    return DEMO_OPPORTUNITIES.filter((opp) =>
      opp.category === 'funding' || opp.category === 'entrepreneurship'
    ).slice(0, 3);
  }, []);

  // Active filter count for badge
  const activeFiltersCount = [
    selectedCategory !== 'all',
    selectedCountry !== 'all',
    selectedEducationLevel !== 'all',
    selectedField !== 'all',
    selectedFundingType !== 'all',
    selectedFormat !== 'all',
    selectedExperience !== 'all',
    deadlineFilter !== 'all',
    paidOnlyFilter,
    searchQuery.trim().length > 0
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0A192F] flex flex-col font-sans selection:bg-[#10B981] selection:text-white">
      {/* ====================================================================
          1. NAVIGATION BAR
          ==================================================================== */}
      <header className="sticky top-0 z-40 bg-[#0A192F] text-white border-b border-slate-800 shadow-md">
        {/* Institutional notice bar */}
        <div className="bg-[#051124] text-xs text-slate-300 py-1.5 px-4 border-b border-slate-800/80">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-medium text-emerald-400">KOROYA Phase 1</span>
              <span className="hidden sm:inline text-slate-400">• Référentiels officiels Côte d’Ivoire (MESRS) & Espace CAMES</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-slate-400">
              <span className="hidden md:inline">Devise : FCFA (XOF)</span>
              <span className="bg-emerald-950/80 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800/60 font-semibold">
                MODE DÉMO SÉCURISÉ
              </span>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setActiveTab('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center gap-2.5 text-left group focus:outline-none"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-emerald-900/30 group-hover:scale-105 transition-transform">
                  K
                </div>
                <div>
                  <span className="text-xl font-extrabold tracking-tight text-white block">
                    KOROYA<span className="text-emerald-400">.</span>
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium block">
                    Talent Meets Opportunity
                  </span>
                </div>
              </button>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1">
              <button
                onClick={() => setActiveTab('home')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'home'
                    ? 'text-emerald-400 bg-white/10'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Découvrir
              </button>
              <button
                onClick={() => {
                  setActiveTab('explore');
                  setSelectedCategory('all');
                }}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'explore' && selectedCategory === 'all'
                    ? 'text-emerald-400 bg-white/10'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Toutes les opportunités
              </button>
              <button
                onClick={() => {
                  setActiveTab('scholarships');
                  setSelectedCategory('scholarship');
                }}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === 'scholarship' && (activeTab === 'scholarships' || activeTab === 'explore')
                    ? 'text-emerald-400 bg-white/10'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Bourses MESRS & CAMES
              </button>
              <button
                onClick={() => {
                  setActiveTab('jobs');
                  setSelectedCategory('job');
                }}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  (selectedCategory === 'job' || selectedCategory === 'internship') && (activeTab === 'jobs' || activeTab === 'explore')
                    ? 'text-emerald-400 bg-white/10'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Emplois & Stages
              </button>
              <button
                onClick={() => {
                  setActiveTab('funding');
                  setSelectedCategory('funding');
                }}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  (selectedCategory === 'funding' || selectedCategory === 'entrepreneurship') && (activeTab === 'funding' || activeTab === 'explore')
                    ? 'text-emerald-400 bg-white/10'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Financements en FCFA
              </button>
              <button
                onClick={() => setActiveTab('resources')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'resources'
                    ? 'text-emerald-400 bg-white/10'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Guides & Référentiels
              </button>
            </nav>

            {/* Desktop Action Buttons */}
            <div className="hidden lg:flex items-center space-x-3">
              {/* Saved Items Button */}
              <button
                onClick={() => setActiveTab('saved')}
                className={`relative p-2 rounded-lg border transition-all flex items-center gap-1.5 text-xs font-semibold ${
                  activeTab === 'saved'
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                    : 'border-slate-700 bg-slate-800/80 text-slate-200 hover:border-slate-600'
                }`}
                title="Consulter vos opportunités enregistrées"
              >
                <Bookmark className="w-4 h-4 text-emerald-400" />
                <span>Favoris</span>
                {savedIds.length > 0 && (
                  <span className="w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                    {savedIds.length}
                  </span>
                )}
              </button>

              {/* Join KOROYA Button */}
              <button
                onClick={() => setIsJoinModalOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm transition-all transform active:scale-95 flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Rejoindre KOROYA</span>
              </button>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={() => setActiveTab('saved')}
                className="relative p-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-200"
                aria-label="Opportunités enregistrées"
              >
                <Bookmark className="w-4 h-4 text-emerald-400" />
                {savedIds.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[9px] font-bold">
                    {savedIds.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none"
                aria-label="Menu principal"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-[#0A192F] border-b border-slate-800 px-4 pt-2 pb-6 space-y-2">
            <button
              onClick={() => {
                setActiveTab('home');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
                activeTab === 'home' ? 'bg-emerald-600/20 text-emerald-400' : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              Découvrir
            </button>
            <button
              onClick={() => {
                setActiveTab('explore');
                setSelectedCategory('all');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
                activeTab === 'explore' ? 'bg-emerald-600/20 text-emerald-400' : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              Toutes les opportunités
            </button>
            <button
              onClick={() => {
                setActiveTab('explore');
                setSelectedCategory('scholarship');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
                selectedCategory === 'scholarship' ? 'bg-emerald-600/20 text-emerald-400' : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              Bourses d’Études MESRS & CAMES
            </button>
            <button
              onClick={() => {
                setActiveTab('explore');
                setSelectedCategory('job');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
                selectedCategory === 'job' ? 'bg-emerald-600/20 text-emerald-400' : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              Emplois & Stages Rémunérés
            </button>
            <button
              onClick={() => {
                setActiveTab('explore');
                setSelectedCategory('funding');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
                selectedCategory === 'funding' ? 'bg-emerald-600/20 text-emerald-400' : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              Financements en FCFA
            </button>
            <button
              onClick={() => {
                setActiveTab('resources');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
                activeTab === 'resources' ? 'bg-emerald-600/20 text-emerald-400' : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              Guides & Référentiels Officiels
            </button>
            <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
              <button
                onClick={() => {
                  setActiveTab('saved');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-3 bg-slate-800 text-slate-200 rounded-lg text-sm font-medium flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-emerald-400" />
                  Opportunités enregistrées
                </span>
                <span className="bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                  {savedIds.length}
                </span>
              </button>
              <button
                onClick={() => {
                  setIsJoinModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-3 bg-emerald-600 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Rejoindre KOROYA
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ====================================================================
          2. TOAST NOTIFICATION
          ==================================================================== */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0A192F] text-white px-4 py-3 rounded-xl shadow-2xl border border-emerald-500/40 flex items-center gap-3 animate-bounce">
          <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
          <span className="text-sm font-medium">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ====================================================================
          3. MAIN CONTENT ROUTER
          ==================================================================== */}
      <main className="flex-grow">
        {/* VIEW 1: HOME PAGE */}
        {activeTab === 'home' && (
          <div>
            {/* HERO SECTION */}
            <section className="bg-gradient-to-b from-[#0A192F] via-[#0E2342] to-[#0A192F] text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-slate-800 relative overflow-hidden">
              {/* Background subtle mesh grid */}
              <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#10B981_1px,transparent_1px)] [background-size:24px_24px]"></div>

              <div className="max-w-4xl mx-auto text-center relative z-10">
                {/* Institutional Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-600/40 text-emerald-300 text-xs font-semibold mb-6">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Portail de Référence — Côte d’Ivoire & Afrique de l’Ouest</span>
                </div>

                {/* Main Headline (French) */}
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight sm:leading-none mb-6">
                  Votre prochaine opportunité <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">commence ici</span>.
                </h1>

                {/* Supporting Text */}
                <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
                  Découvrez des bourses d’études nationales MESRS et CAMES, des stages rémunérés en entreprise, des emplois qualifiés et des financements en FCFA vérifiés auprès de sources officielles.
                </p>

                {/* Main Search Bar with Recent Searches */}
                <div className="bg-white rounded-2xl p-2 sm:p-3 shadow-2xl max-w-3xl mx-auto text-slate-900 mb-4 border border-slate-200">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-grow flex items-center">
                      <Search className="w-5 h-5 text-slate-400 absolute left-3 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="Rechercher une bourse, stage, métier, mot-clé (ex: Master, AgriTech, Orange)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            recordSearchQuery(searchQuery);
                            setActiveTab('explore');
                          }
                        }}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-slate-800 placeholder-slate-400"
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="absolute right-3 text-slate-400 hover:text-slate-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        recordSearchQuery(searchQuery);
                        setActiveTab('explore');
                      }}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-md shadow-emerald-900/20"
                    >
                      <Search className="w-4 h-4" />
                      <span>Rechercher</span>
                    </button>
                  </div>

                  {/* RECENT SEARCHES COMPONENT (Last 3 searches saved in localStorage) */}
                  <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 px-1 gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="flex items-center gap-1 font-semibold text-slate-600">
                        <History className="w-3.5 h-3.5 text-emerald-600" />
                        Recherches récentes :
                      </span>
                      {recentSearches.length > 0 ? (
                        recentSearches.map((term, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleRecentSearchClick(term)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 font-medium transition-colors border border-slate-200"
                          >
                            <span>{term}</span>
                          </button>
                        ))
                      ) : (
                        <div className="flex flex-wrap items-center gap-1.5 text-slate-400">
                          <button
                            onClick={() => handleRecentSearchClick('Bourse MESRS')}
                            className="px-2 py-0.5 rounded bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 text-slate-500 transition-colors"
                          >
                            Ex : Bourse MESRS
                          </button>
                          <button
                            onClick={() => handleRecentSearchClick('Stage Abidjan')}
                            className="px-2 py-0.5 rounded bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 text-slate-500 transition-colors"
                          >
                            Stage Abidjan
                          </button>
                          <button
                            onClick={() => handleRecentSearchClick('Financement FCFA')}
                            className="px-2 py-0.5 rounded bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 text-slate-500 transition-colors"
                          >
                            Financement FCFA
                          </button>
                        </div>
                      )}
                    </div>

                    {recentSearches.length > 0 && (
                      <button
                        onClick={clearRecentSearches}
                        className="text-slate-400 hover:text-rose-600 text-[11px] underline flex items-center gap-0.5 ml-auto"
                      >
                        <Trash2 className="w-3 h-3" />
                        Vider
                      </button>
                    )}
                  </div>
                </div>

                {/* Primary CTA Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
                  <button
                    onClick={() => {
                      setActiveTab('explore');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-6 py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-emerald-900/40 flex items-center gap-2 transform active:scale-95"
                  >
                    <Compass className="w-4 h-4" />
                    <span>Explorer les opportunités</span>
                  </button>
                  <button
                    onClick={() => setIsJoinModalOpen(true)}
                    className="bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-semibold px-6 py-3.5 rounded-xl text-sm transition-all flex items-center gap-2 transform active:scale-95"
                  >
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>Rejoindre KOROYA</span>
                  </button>
                </div>

                {/* Category Shortcuts */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-12 text-left">
                  <button
                    onClick={() => {
                      setSelectedCategory('scholarship');
                      setActiveTab('explore');
                    }}
                    className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700 hover:border-emerald-500/60 hover:bg-slate-800 transition-all group"
                  >
                    <div className="flex items-center gap-2 text-emerald-400 mb-1">
                      <GraduationCap className="w-4 h-4" />
                      <span className="text-xs font-bold text-white group-hover:text-emerald-300">Bourses d'Études</span>
                    </div>
                    <p className="text-[11px] text-slate-400">MESRS CI & Réseau CAMES</p>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedCategory('internship');
                      setActiveTab('explore');
                    }}
                    className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700 hover:border-emerald-500/60 hover:bg-slate-800 transition-all group"
                  >
                    <div className="flex items-center gap-2 text-emerald-400 mb-1">
                      <FileText className="w-4 h-4" />
                      <span className="text-xs font-bold text-white group-hover:text-emerald-300">Stages Rémunérés</span>
                    </div>
                    <p className="text-[11px] text-slate-400">Abidjan & Sous-région</p>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedCategory('funding');
                      setActiveTab('explore');
                    }}
                    className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700 hover:border-emerald-500/60 hover:bg-slate-800 transition-all group"
                  >
                    <div className="flex items-center gap-2 text-emerald-400 mb-1">
                      <Award className="w-4 h-4" />
                      <span className="text-xs font-bold text-white group-hover:text-emerald-300">Financements FCFA</span>
                    </div>
                    <p className="text-[11px] text-slate-400">Subventions BOAD & AEJ</p>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedCategory('mobility');
                      setActiveTab('explore');
                    }}
                    className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700 hover:border-emerald-500/60 hover:bg-slate-800 transition-all group"
                  >
                    <div className="flex items-center gap-2 text-emerald-400 mb-1">
                      <Globe className="w-4 h-4" />
                      <span className="text-xs font-bold text-white group-hover:text-emerald-300">Mobilité & Échange</span>
                    </div>
                    <p className="text-[11px] text-slate-400">Bourses Sud-Sud & AUF</p>
                  </button>
                </div>
              </div>
            </section>

            {/* SECTION 1: FEATURED OPPORTUNITIES (Sélection à la une) */}
            <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">
                    <Sparkles className="w-4 h-4" />
                    Opportunités Prioritaires
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#0A192F] tracking-tight">
                    Sélection officielle à la une
                  </h2>
                </div>
                <button
                  onClick={() => {
                    setActiveTab('explore');
                    setSelectedCategory('all');
                  }}
                  className="text-sm font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group self-start sm:self-auto"
                >
                  <span>Voir toutes les opportunités ({DEMO_OPPORTUNITIES.length})</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredOpportunities.map((opp) => (
                  <OpportunityCard
                    key={opp.id}
                    opportunity={opp}
                    isSaved={savedIds.includes(opp.id)}
                    onToggleSave={(e) => toggleSaveOpportunity(opp.id, e)}
                    onViewDetails={() => setSelectedOpportunity(opp)}
                    onShare={(e) => handleShare(opp, e)}
                  />
                ))}
              </div>
            </section>

            {/* SECTION 2: CLOSING SOON (Clôture imminente) */}
            <section className="py-12 bg-amber-50/60 border-y border-amber-200/60 px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 rounded-lg bg-amber-500 text-white">
                    <Clock className="w-4 h-4" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    Clôture imminente — Ne manquez pas les échéances
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 mb-6 max-w-2xl">
                  Ces opportunités vérifiées arrivent à expiration dans moins de 45 jours. Préparez vos pièces requises dès maintenant.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {closingSoonOpportunities.map((opp) => (
                    <div
                      key={opp.id}
                      onClick={() => setSelectedOpportunity(opp)}
                      className="bg-white p-5 rounded-xl border border-amber-300/80 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
                            {getDaysRemaining(opp.deadline)} jours restants
                          </span>
                          <span className="text-xs font-semibold text-emerald-700">
                            {opp.fundingAmount}
                          </span>
                        </div>
                        <h3 className="font-bold text-slate-900 text-sm line-clamp-2 hover:text-emerald-700 transition-colors mb-1">
                          {opp.title}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-1 mb-3">
                          {opp.organization}
                        </p>
                      </div>
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {opp.deadline}
                        </span>
                        <span className="text-emerald-700 font-semibold flex items-center gap-1">
                          Postuler <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* SECTION 3: STUDENTS & GRADUATES (Étudiants & Jeunes diplômés) */}
            <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">
                    <GraduationCap className="w-4 h-4" />
                    Parcours Universitaire
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#0A192F] tracking-tight">
                    Étudiants & Jeunes Diplômés
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    Bourses d’excellence, stages pré-embauche et mobilité dans l'espace CAMES.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedCategory('scholarship');
                    setActiveTab('explore');
                  }}
                  className="text-sm font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group self-start sm:self-auto"
                >
                  <span>Explorer les bourses</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {studentOpportunities.map((opp) => (
                  <OpportunityCard
                    key={opp.id}
                    opportunity={opp}
                    isSaved={savedIds.includes(opp.id)}
                    onToggleSave={(e) => toggleSaveOpportunity(opp.id, e)}
                    onViewDetails={() => setSelectedOpportunity(opp)}
                    onShare={(e) => handleShare(opp, e)}
                  />
                ))}
              </div>
            </section>

            {/* SECTION 4: ENTREPRENEURSHIP & FUNDING (Financements en FCFA) */}
            <section className="py-14 bg-slate-900 text-white px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
                      <DollarSign className="w-4 h-4" />
                      Fonds d'amorçage & Subventions
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                      Entrepreneuriat & Financements en FCFA
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                      Tous les montants sont libellés en FCFA avec transparence sur la nature non remboursable ou participative.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedCategory('funding');
                      setActiveTab('explore');
                    }}
                    className="text-sm font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 group self-start sm:self-auto"
                  >
                    <span>Tous les financements</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {fundingOpportunities.map((opp) => (
                    <div
                      key={opp.id}
                      onClick={() => setSelectedOpportunity(opp)}
                      className="bg-slate-800/90 rounded-2xl p-6 border border-slate-700 hover:border-emerald-500 transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-3 mb-3">
                          <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/60 text-xs font-bold">
                            {opp.category === 'funding' ? 'Subvention directe' : 'Concours & Incubation'}
                          </span>
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-amber-400" />
                            {opp.deadline}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-white hover:text-emerald-400 transition-colors mb-2">
                          {opp.title}
                        </h3>
                        <p className="text-xs font-medium text-emerald-400 mb-2">
                          {opp.organization}
                        </p>
                        <p className="text-xs text-slate-300 line-clamp-2 mb-4 leading-relaxed">
                          {opp.description}
                        </p>
                        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700/80 mb-4">
                          <span className="text-[11px] text-slate-400 uppercase font-semibold block">Montant garanti :</span>
                          <span className="text-lg font-extrabold text-emerald-400">{opp.fundingAmount}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-700 text-xs">
                        <span className="text-slate-400">{opp.eligibleCountries.join(', ')}</span>
                        <span className="font-semibold text-emerald-400 flex items-center gap-1">
                          Consulter les critères <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* SECTION 5: INSTITUTIONAL REFERENCE GUIDE (MESRS & CAMES) */}
            <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
              <div className="text-center max-w-2xl mx-auto mb-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  Rigueur & Vérifiabilité
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#0A192F] tracking-tight">
                  Guides & Référentiels Officiels (MESRS & CAMES)
                </h2>
                <p className="text-sm text-slate-600 mt-2">
                  KOROYA s'adosse aux critères des ministères nationaux et des instances régionales pour lutter contre les faux diplômes et les offres frauduleuses.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {INSTITUTIONAL_RESOURCES.map((res) => (
                  <div
                    key={res.id}
                    className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold px-2.5 py-1 rounded bg-blue-100 text-blue-900 border border-blue-200">
                          {res.officialBadge}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">{res.category}</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mb-1">{res.title}</h3>
                      <p className="text-xs font-medium text-emerald-700 mb-3">{res.authority}</p>
                      <p className="text-xs text-slate-600 mb-4 leading-relaxed">{res.description}</p>
                      <div className="space-y-1.5 mb-4">
                        {res.keyPoints.map((pt, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                            <span>{pt}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <a
                      href={res.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 font-semibold text-xs transition-colors border border-slate-200"
                    >
                      <span>Consulter le portail officiel</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ))}
              </div>
            </section>

            {/* SECTION 6: HOW IT WORKS */}
            <section className="py-14 bg-slate-100 border-t border-slate-200 px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#0A192F]">
                    Comment fonctionne KOROYA ?
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2">
                    Une approche sans faux espoirs, avec des règles d'honnêteté strictes et sans collecte de données superflue.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 font-extrabold flex items-center justify-center text-lg mb-4">
                      1
                    </div>
                    <h3 className="font-bold text-slate-900 text-base mb-2">Recherche Transparente</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Filtrez par pays, niveau d'études, montant en FCFA et modalité (présentiel ou télétravail). Aucune offre n'est cachée derrière un paywall.
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 font-extrabold flex items-center justify-center text-lg mb-4">
                      2
                    </div>
                    <h3 className="font-bold text-slate-900 text-base mb-2">Traçabilité & Vérification</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Chaque opportunité mentionne sa date de contrôle et son lien source officiel vers le MESRS, le CAMES ou l'entreprise organisatrice.
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 font-extrabold flex items-center justify-center text-lg mb-4">
                      3
                    </div>
                    <h3 className="font-bold text-slate-900 text-base mb-2">Candidature Directe</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Vous postulez directement auprès des canaux officiels sans intermédiaire, sans frais de dossier frauduleux et sans faux intermédiaires.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 7: TESTIMONIALS (Clearly labeled DEMO according to honesty rules) */}
            <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
              <div className="max-w-3xl mx-auto text-center mb-8">
                <div className="inline-block px-3 py-1 rounded bg-slate-200 text-slate-700 text-[11px] font-bold uppercase tracking-wider mb-2">
                  TÉMOIGNAGES DE DÉMONSTRATION — FICTIFS
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Ce que les premiers talents attendent de KOROYA
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Exemples pédagogiques modélisant les besoins réels des étudiants et jeunes diplômés en Côte d’Ivoire.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative">
                  <div className="text-emerald-500 text-2xl font-serif mb-2">“</div>
                  <p className="text-xs text-slate-700 italic leading-relaxed mb-4">
                    « Trouver les vraies dates limites des bourses du MESRS CI sans passer par des rumeurs WhatsApp non vérifiées change complètement la donne. »
                  </p>
                  <div className="border-t border-slate-100 pt-3">
                    <span className="block font-bold text-xs text-slate-900">Aya K. (Profil Démo)</span>
                    <span className="block text-[11px] text-slate-500">Étudiante Licence 3 — Université Félix Houphouët-Boigny, Abidjan</span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative">
                  <div className="text-emerald-500 text-2xl font-serif mb-2">“</div>
                  <p className="text-xs text-slate-700 italic leading-relaxed mb-4">
                    « La clarté sur les diplômes reconnus CAMES permet de ne plus gaspiller son argent dans des écoles privées sans agrément officiel. »
                  </p>
                  <div className="border-t border-slate-100 pt-3">
                    <span className="block font-bold text-xs text-slate-900">Mamadou D. (Profil Démo)</span>
                    <span className="block text-[11px] text-slate-500">Diplômé Génie Logiciel — Yamoussoukro</span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative">
                  <div className="text-emerald-500 text-2xl font-serif mb-2">“</div>
                  <p className="text-xs text-slate-700 italic leading-relaxed mb-4">
                    « Les montants clairement indiqués en FCFA pour les subventions d'amorçage nous permettent de cibler les concours adaptés à notre trésorerie. »
                  </p>
                  <div className="border-t border-slate-100 pt-3">
                    <span className="block font-bold text-xs text-slate-900">Christelle T. (Profil Démo)</span>
                    <span className="block text-[11px] text-slate-500">Fondatrice AgriTech — Bouaké</span>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 8: NEWSLETTER (Validated Form) */}
            <section className="bg-[#0A192F] text-white py-14 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
              <div className="max-w-3xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 text-xs font-semibold mb-4 border border-emerald-800">
                  <Send className="w-3.5 h-3.5" />
                  Veille Hebdomadaire Officielle
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                  Recevez les nouvelles opportunités vérifiées
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto mb-6">
                  Aucun spam. Recevez un récapitulatif chaque semaine dès la publication de nouvelles bourses MESRS, offres de stage et appels à projets en Côte d’Ivoire.
                </p>

                <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="email"
                      placeholder="Votre adresse email (ex: prenom@domaine.ci)"
                      value={newsletterEmail}
                      onChange={(e) => {
                        setNewsletterEmail(e.target.value);
                        if (newsletterErrorMsg) setNewsletterErrorMsg('');
                      }}
                      disabled={newsletterStatus === 'loading' || newsletterStatus === 'success'}
                      className="px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 flex-grow"
                    />
                    <button
                      type="submit"
                      disabled={newsletterStatus === 'loading' || newsletterStatus === 'success'}
                      className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white font-semibold px-5 py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
                    >
                      {newsletterStatus === 'loading' ? (
                        <span>Enregistrement...</span>
                      ) : newsletterStatus === 'success' ? (
                        <span className="flex items-center gap-1 text-emerald-300">
                          <Check className="w-4 h-4" /> Inscrit
                        </span>
                      ) : (
                        <span>S'abonner</span>
                      )}
                    </button>
                  </div>
                  {newsletterErrorMsg && (
                    <p className="text-rose-400 text-xs mt-2 text-left font-medium">
                      {newsletterErrorMsg}
                    </p>
                  )}
                  {newsletterStatus === 'success' && (
                    <p className="text-emerald-400 text-xs mt-2 text-center font-medium">
                      Votre adresse a bien été enregistrée pour les alertes officielles !
                    </p>
                  )}
                  <p className="text-[11px] text-slate-500 mt-3">
                    Désinscription possible à tout moment. Vos données restent strictement confidentielles.
                  </p>
                </form>
              </div>
            </section>
          </div>
        )}

        {/* VIEW 2: EXPLORE / ALL OPPORTUNITIES VIEW */}
        {(activeTab === 'explore' || activeTab === 'scholarships' || activeTab === 'jobs' || activeTab === 'funding') && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* View Header */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-[#0A192F]">
                    {activeTab === 'scholarships'
                      ? 'Bourses d’Études Supérieures'
                      : activeTab === 'jobs'
                      ? 'Emplois & Stages en Côte d’Ivoire'
                      : activeTab === 'funding'
                      ? 'Financements & Subventions en FCFA'
                      : 'Catalogue des Opportunités'}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    {filteredOpportunities.length} opportunité(s) vérifiable(s) correspondant à vos critères
                  </p>
                </div>

                {/* Reset Filters Quick Button */}
                {activeFiltersCount > 0 && (
                  <button
                    onClick={resetFilters}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors self-start"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Réinitialiser les filtres ({activeFiltersCount})</span>
                  </button>
                )}
              </div>

              {/* RECENT SEARCHES QUICK ACCESS IN EXPLORE VIEW */}
              {recentSearches.length > 0 && (
                <div className="mt-4 p-3 bg-white rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-slate-700 flex items-center gap-1">
                      <History className="w-3.5 h-3.5 text-emerald-600" />
                      Vos 3 dernières recherches :
                    </span>
                    {recentSearches.map((term, i) => (
                      <button
                        key={i}
                        onClick={() => handleRecentSearchClick(term)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                          searchQuery.toLowerCase() === term.toLowerCase()
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-slate-50 hover:bg-emerald-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={clearRecentSearches}
                    className="text-slate-400 hover:text-rose-600 text-[11px] underline ml-auto"
                  >
                    Effacer
                  </button>
                </div>
              )}
            </div>

            {/* Filter Controls Panel */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm mb-8 space-y-4">
              {/* Primary Search Bar */}
              <div className="relative">
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Rechercher par titre, compétences, secteur, organisme (ex: MESRS, Cloud, Agronomie)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onBlur={() => recordSearchQuery(searchQuery)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      recordSearchQuery(searchQuery);
                    }
                  }}
                  className="w-full pl-11 pr-10 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-slate-800"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Multi-criteria filter grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
                {/* Category Filter */}
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Catégorie</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-lg border border-slate-200 text-xs text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="all">Toutes</option>
                    <option value="scholarship">Bourses</option>
                    <option value="internship">Stages</option>
                    <option value="job">Emplois</option>
                    <option value="funding">Financements</option>
                    <option value="entrepreneurship">Entrepreneuriat</option>
                    <option value="mobility">Mobilité CAMES</option>
                    <option value="training">Formations</option>
                  </select>
                </div>

                {/* Country Filter */}
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Pays éligible</label>
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-lg border border-slate-200 text-xs text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="all">Tous pays</option>
                    <option value="Côte d’Ivoire">Côte d’Ivoire</option>
                    <option value="Sénégal">Sénégal</option>
                    <option value="Cameroun">Cameroun</option>
                    <option value="Bénin">Bénin</option>
                    <option value="Togo">Togo</option>
                  </select>
                </div>

                {/* Education Level */}
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Niveau d'études</label>
                  <select
                    value={selectedEducationLevel}
                    onChange={(e) => setSelectedEducationLevel(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-lg border border-slate-200 text-xs text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="all">Tous niveaux</option>
                    <option value="Bac">Bac</option>
                    <option value="Bac+2">Bac+2</option>
                    <option value="Bac+3 (Licence)">Bac+3 (Licence)</option>
                    <option value="Bac+5 (Master)">Bac+5 (Master)</option>
                    <option value="Doctorat">Doctorat</option>
                  </select>
                </div>

                {/* Format Filter */}
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Format</label>
                  <select
                    value={selectedFormat}
                    onChange={(e) => setSelectedFormat(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-lg border border-slate-200 text-xs text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="all">Tous formats</option>
                    <option value="on_site">Présentiel</option>
                    <option value="hybrid">Hybride</option>
                    <option value="remote">Télétravail</option>
                  </select>
                </div>

                {/* Deadline Filter */}
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Date limite</label>
                  <select
                    value={deadlineFilter}
                    onChange={(e) => setDeadlineFilter(e.target.value as any)}
                    className="w-full px-2.5 py-2 rounded-lg border border-slate-200 text-xs text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="all">Toutes dates</option>
                    <option value="15_days">&lt; 15 jours</option>
                    <option value="30_days">&lt; 30 jours</option>
                    <option value="60_days">&lt; 60 jours</option>
                  </select>
                </div>

                {/* Sort Option */}
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Trier par</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full px-2.5 py-2 rounded-lg border border-slate-200 text-xs text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="deadline_asc">Échéance la plus proche</option>
                    <option value="deadline_desc">Échéance la plus lointaine</option>
                    <option value="relevance">Pertinence par défaut</option>
                  </select>
                </div>
              </div>

              {/* Toggle for Paid Only */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={paidOnlyFilter}
                    onChange={(e) => setPaidOnlyFilter(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                  />
                  <span className="font-medium text-slate-700">Rémunéré / Financé uniquement (Exclure non-rémunéré)</span>
                </label>

                <span className="text-slate-400 text-[11px]">
                  Filtres actifs : {activeFiltersCount}
                </span>
              </div>
            </div>

            {/* Results Grid */}
            {filteredOpportunities.length > 0 ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredOpportunities.slice(0, visibleCount).map((opp) => (
                    <OpportunityCard
                      key={opp.id}
                      opportunity={opp}
                      isSaved={savedIds.includes(opp.id)}
                      onToggleSave={(e) => toggleSaveOpportunity(opp.id, e)}
                      onViewDetails={() => setSelectedOpportunity(opp)}
                      onShare={(e) => handleShare(opp, e)}
                    />
                  ))}
                </div>

                {/* Load More Button */}
                {visibleCount < filteredOpportunities.length && (
                  <div className="text-center pt-6">
                    <button
                      onClick={() => setVisibleCount((prev) => prev + 6)}
                      className="bg-white hover:bg-slate-50 text-slate-700 font-semibold px-6 py-2.5 rounded-xl border border-slate-300 text-xs shadow-sm transition-all"
                    >
                      Afficher plus d'opportunités ({filteredOpportunities.length - visibleCount} restantes)
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Empty State */
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 max-w-lg mx-auto">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-4">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-1">
                  Aucune opportunité ne correspond à vos filtres
                </h3>
                <p className="text-xs text-slate-500 mb-6">
                  Essayez d'élargir vos termes de recherche ou de réinitialiser vos critères de sélection.
                </p>
                <button
                  onClick={resetFilters}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-5 py-2.5 rounded-xl text-xs transition-colors"
                >
                  Effacer tous les filtres
                </button>
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: SAVED OPPORTUNITIES (Local Storage Bookmarks) */}
        {activeTab === 'saved' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">
                  <Bookmark className="w-4 h-4" />
                  Mémoire Locale du Navigateur
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#0A192F]">
                  Vos Opportunités Enregistrées ({savedOpportunitiesList.length})
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Ces éléments sont conservés sur votre appareil. Aucun compte ni mot de passe requis en Phase 1.
                </p>
              </div>

              {savedOpportunitiesList.length > 0 && (
                <button
                  onClick={() => {
                    setSavedIds([]);
                    showToast('Toutes les opportunités enregistrées ont été effacées');
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors self-start"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Tout effacer</span>
                </button>
              )}
            </div>

            {savedOpportunitiesList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedOpportunitiesList.map((opp) => (
                  <OpportunityCard
                    key={opp.id}
                    opportunity={opp}
                    isSaved={true}
                    onToggleSave={(e) => toggleSaveOpportunity(opp.id, e)}
                    onViewDetails={() => setSelectedOpportunity(opp)}
                    onShare={(e) => handleShare(opp, e)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 max-w-lg mx-auto">
                <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 mx-auto mb-4">
                  <Bookmark className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-1">
                  Aucun favori enregistré pour le moment
                </h3>
                <p className="text-xs text-slate-500 mb-6">
                  Pendant votre exploration, cliquez sur l'icône de signet pour garder sous la main les opportunités qui vous intéressent.
                </p>
                <button
                  onClick={() => setActiveTab('explore')}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-5 py-2.5 rounded-xl text-xs transition-colors"
                >
                  Découvrir les opportunités
                </button>
              </div>
            )}
          </div>
        )}

        {/* VIEW 4: INSTITUTIONAL RESOURCES & GUIDES */}
        {activeTab === 'resources' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-3xl mb-8">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">
                <ShieldCheck className="w-4 h-4" />
                Documentation Officielle
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#0A192F]">
                Guides Institutionnels & Référentiels d’Habilitation
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                Retrouvez les liens et démarches directes du Ministère de l'Enseignement Supérieur de Côte d’Ivoire (MESRS) et du Conseil Africain et Malgache pour l'Enseignement Supérieur (CAMES) pour vérifier l'accréditation des filières et la validité de vos diplômes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {INSTITUTIONAL_RESOURCES.map((res) => (
                <div
                  key={res.id}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold px-2.5 py-1 rounded bg-blue-50 text-blue-800 border border-blue-200">
                        {res.officialBadge}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">{res.category}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-1">{res.title}</h3>
                    <p className="text-xs font-medium text-emerald-700 mb-3">{res.authority}</p>
                    <p className="text-xs text-slate-600 mb-4 leading-relaxed">{res.description}</p>
                    <div className="space-y-2 mb-4">
                      {res.keyPoints.map((pt, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                          <span>{pt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <a
                    href={res.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-semibold text-xs transition-colors"
                  >
                    <span>Accéder au portail officiel ({res.authority.split('—')[0]})</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>

            {/* Equivalence and Verification advice box */}
            <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-200 max-w-4xl mx-auto">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-900 leading-relaxed space-y-2">
                  <h4 className="font-bold text-sm text-emerald-950">
                    Avertissement de transparence académique :
                  </h4>
                  <p>
                    KOROYA ne délivre pas d'équivalences de diplômes ni d'attestations ministérielles. Seules la <strong>Commission Nationale d’Homologation et d’Équivalence du MESRS CI</strong> et les <strong>Comités Consultatifs Interafricains (CCI) du CAMES</strong> sont juridiquement habilités à reconnaître la validité d'un diplôme d'enseignement supérieur.
                  </p>
                  <p>
                    N'acceptez jamais d'intermédiaire payant vous promettant une homologation accélérée : toutes les procédures officielles sont dématérialisées sur les plateformes gouvernementales.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ====================================================================
          4. OPPORTUNITY DETAIL MODAL
          ==================================================================== */}
      {selectedOpportunity && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-[#0A192F] text-white p-6 relative">
              <button
                onClick={() => setSelectedOpportunity(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/80 transition-colors"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-700">
                  {selectedOpportunity.category.toUpperCase()}
                </span>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {selectedOpportunity.educationLevel}
                </span>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                  DATE LIMITE : {selectedOpportunity.deadline}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white pr-8 mb-2 leading-tight">
                {selectedOpportunity.title}
              </h2>

              <p className="text-xs sm:text-sm font-medium text-emerald-400">
                {selectedOpportunity.organization}
              </p>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-slate-800 text-xs sm:text-sm leading-relaxed">
              {/* Verification & Honesty Rule Notice */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="flex items-center gap-2 font-bold text-slate-800">
                    <span>Source certifiée : {selectedOpportunity.source}</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-mono">
                      Vérifié le {selectedOpportunity.lastVerifiedDate}
                    </span>
                  </div>
                  <p className="text-slate-500 mt-0.5">
                    Fiche modèle de démonstration KOROYA Phase 1 (Données réelles issues des référentiels officiels).
                  </p>
                </div>
              </div>

              {/* Funding Amount Highlight in FCFA */}
              <div className="bg-emerald-50/80 p-4 rounded-xl border border-emerald-200 flex items-center justify-between flex-wrap gap-2">
                <div>
                  <span className="text-[11px] text-emerald-800 uppercase font-bold block">
                    Dotation / Rémunération en FCFA :
                  </span>
                  <span className="text-lg sm:text-xl font-extrabold text-emerald-700">
                    {selectedOpportunity.fundingAmount}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-500 block">Lieu & Format :</span>
                  <span className="text-xs font-semibold text-slate-800">
                    {selectedOpportunity.location} ({selectedOpportunity.format === 'on_site' ? 'Présentiel' : selectedOpportunity.format === 'hybrid' ? 'Hybride' : 'Télétravail'})
                  </span>
                </div>
              </div>

              {/* Full Description */}
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-2 uppercase tracking-wide">
                  Description de l'opportunité
                </h4>
                <p className="text-slate-700">{selectedOpportunity.description}</p>
              </div>

              {/* Eligibility Criteria */}
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-2 uppercase tracking-wide">
                  Critères d'éligibilité requis
                </h4>
                <div className="space-y-1.5">
                  {selectedOpportunity.eligibility.map((crit, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">{crit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Required Documents */}
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-2 uppercase tracking-wide">
                  Dossier de candidature & Pièces à fournir
                </h4>
                <div className="space-y-1.5 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  {selectedOpportunity.requiredDocuments.map((doc, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <FileText className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-2 uppercase tracking-wide">
                  Avantages & Prise en charge
                </h4>
                <div className="space-y-1.5">
                  {selectedOpportunity.benefits.map((ben, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Award className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">{ben}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Application Steps */}
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-2 uppercase tracking-wide">
                  Procédure de candidature
                </h4>
                <div className="space-y-2">
                  {selectedOpportunity.applicationProcess.map((step, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
                      {step}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleSaveOpportunity(selectedOpportunity.id)}
                  className={`p-2.5 rounded-xl border font-semibold text-xs flex items-center gap-1.5 transition-colors ${
                    savedIds.includes(selectedOpportunity.id)
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <Bookmark className="w-4 h-4" />
                  <span>{savedIds.includes(selectedOpportunity.id) ? 'Enregistré' : 'Sauvegarder'}</span>
                </button>

                <button
                  onClick={() => handleShare(selectedOpportunity)}
                  className="p-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors"
                  title="Partager cette opportunité"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Partager</span>
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedOpportunity(null)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:text-slate-800 text-xs font-semibold"
                >
                  Fermer
                </button>

                <a
                  href={selectedOpportunity.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-colors flex items-center gap-2 shadow-md shadow-emerald-900/20"
                >
                  <span>Postuler sur le site officiel</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          5. JOIN KOROYA (EARLY ACCESS / PHASE 1 NOTICE) MODAL
          ==================================================================== */}
      {isJoinModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-[#0A192F] text-white p-6 relative">
              <button
                onClick={() => setIsJoinModalOpen(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white mb-3 shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white mb-1">
                Rejoindre la Communauté KOROYA
              </h3>
              <p className="text-xs text-slate-300">
                Phase 1 : Accès libre sans compte requis. Inscrivez-vous pour l'ouverture des comptes personnels et alertes personnalisées en Phase 2.
              </p>
            </div>

            <div className="p-6">
              {joinSuccess ? (
                <div className="text-center py-6">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-base mb-1">
                    Inscription préliminaire enregistrée !
                  </h4>
                  <p className="text-xs text-slate-600">
                    Vous serez parmi les premiers informés du lancement des profils personnalisés et de l'espace recruteur.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleJoinSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Votre profil :</label>
                    <select
                      value={joinRole}
                      onChange={(e) => setJoinRole(e.target.value as any)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="etudiant">Étudiant(e) en recherche de bourse / stage</option>
                      <option value="diplome">Jeune diplômé(e) en quête d'un premier emploi</option>
                      <option value="porteur_projet">Porteur de projet / Entrepreneur(e)</option>
                      <option value="recruteur">Organisation / Recruteur institutionnel</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Votre adresse email :</label>
                    <input
                      type="email"
                      required
                      placeholder="exemple@domaine.ci"
                      value={joinEmail}
                      onChange={(e) => setJoinEmail(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
                    <p className="font-semibold text-slate-800">Transparence des données :</p>
                    <p>Aucun mot de passe requis en Phase 1. Vos données sont conservées localement ou sur notre liste de diffusion sécurisée.</p>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-xs transition-colors shadow-md shadow-emerald-900/20"
                  >
                    Confirmer mon accès anticipé
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          6. INSTITUTIONAL FOOTER
          ==================================================================== */}
      <footer className="bg-[#051124] text-white pt-14 pb-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Brand column */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-white text-base">
                  K
                </div>
                <span className="text-xl font-extrabold tracking-tight">KOROYA<span className="text-emerald-400">.</span></span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Plateforme indépendante de découverte d'opportunités académiques et professionnelles vérifiées en Côte d’Ivoire et en Afrique de l’Ouest.
              </p>
              <div className="text-[11px] text-slate-500">
                Phase 1 : Données modèles conformes aux critères MESRS CI & CAMES.
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-4">
                Navigation
              </h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>
                  <button onClick={() => { setActiveTab('explore'); setSelectedCategory('scholarship'); }} className="hover:text-white transition-colors">
                    Bourses d’Études Supérieures
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab('explore'); setSelectedCategory('internship'); }} className="hover:text-white transition-colors">
                    Stages & Immersion Abidjan
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab('explore'); setSelectedCategory('job'); }} className="hover:text-white transition-colors">
                    Emplois & Contrats CDI
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab('explore'); setSelectedCategory('funding'); }} className="hover:text-white transition-colors">
                    Fonds d’Amorçage en FCFA
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab('explore'); setSelectedCategory('mobility'); }} className="hover:text-white transition-colors">
                    Programmes de Mobilité CAMES
                  </button>
                </li>
              </ul>
            </div>

            {/* Institutional Frameworks */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-4">
                Référentiels & Partenaires
              </h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>
                  <a href="https://mesrs.gouv.ci" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
                    <span>MESRS Côte d’Ivoire</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </a>
                </li>
                <li>
                  <a href="https://www.lecames.org" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
                    <span>CAMES (19 États Membres)</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </a>
                </li>
                <li>
                  <a href="https://www.auf.org" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
                    <span>AUF Afrique de l’Ouest</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </a>
                </li>
                <li>
                  <a href="https://ivoire.campusfrance.org" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
                    <span>Campus France Côte d’Ivoire</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </a>
                </li>
                <li>
                  <a href="https://agenceemploi-jeunes.ci" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
                    <span>Agence Emploi Jeunes (AEJ CI)</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal & Security */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-4">
                Transparence & Sécurité
              </h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>
                  <button onClick={() => setActiveTab('resources')} className="hover:text-white transition-colors">
                    Politique de Vérification
                  </button>
                </li>
                <li>
                  <span className="text-slate-500">Devise officielle : Franc CFA (XOF)</span>
                </li>
                <li>
                  <span className="text-slate-500">Stockage : Navigateur local (Phase 1)</span>
                </li>
                <li>
                  <span className="text-slate-500">Hébergement : Vercel / Edge Security</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© 2026 KOROYA. Tous droits réservés. Conçu pour la jeunesse africaine.</p>
            <div className="flex items-center gap-4 text-[11px]">
              <span>Abidjan, Côte d’Ivoire</span>
              <span>•</span>
              <span>Dakar, Sénégal (Bientôt)</span>
              <span>•</span>
              <span>Yaoundé, Cameroun (Bientôt)</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ==========================================================================
   HELPER COMPONENT: OPPORTUNITY CARD
   ========================================================================== */
interface OpportunityCardProps {
  opportunity: Opportunity;
  isSaved: boolean;
  onToggleSave: (e: React.MouseEvent) => void;
  onViewDetails: () => void;
  onShare: (e: React.MouseEvent) => void;
}

function OpportunityCard({
  opportunity,
  isSaved,
  onToggleSave,
  onViewDetails,
  onShare
}: OpportunityCardProps) {
  const getDaysRemaining = (deadlineStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadline = new Date(deadlineStr);
    const diffTime = deadline.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const daysLeft = getDaysRemaining(opportunity.deadline);

  return (
    <div
      onClick={onViewDetails}
      className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-500/60 transition-all cursor-pointer flex flex-col justify-between overflow-hidden group"
    >
      <div className="p-5">
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              {opportunity.category === 'scholarship'
                ? 'Bourse'
                : opportunity.category === 'internship'
                ? 'Stage'
                : opportunity.category === 'job'
                ? 'Emploi CDI'
                : opportunity.category === 'funding'
                ? 'Financement'
                : opportunity.category === 'entrepreneurship'
                ? 'Concours'
                : opportunity.category === 'mobility'
                ? 'Mobilité CAMES'
                : 'Formation'}
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
              {opportunity.educationLevel}
            </span>
          </div>

          <button
            onClick={onToggleSave}
            className={`p-1.5 rounded-lg border transition-colors ${
              isSaved
                ? 'bg-emerald-50 text-emerald-600 border-emerald-300'
                : 'bg-slate-50 text-slate-400 border-slate-200 hover:text-slate-600'
            }`}
            title={isSaved ? 'Retirer des favoris' : 'Enregistrer'}
          >
            <Bookmark className="w-3.5 h-3.5 fill-current" />
          </button>
        </div>

        {/* Title */}
        <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-2 group-hover:text-emerald-700 transition-colors mb-1.5">
          {opportunity.title}
        </h3>

        {/* Organization */}
        <p className="text-xs font-semibold text-slate-600 mb-3 line-clamp-1">
          {opportunity.organization}
        </p>

        {/* Amount in FCFA */}
        <div className="mb-3 py-1.5 px-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-medium">Financement :</span>
          <span className="text-xs font-bold text-emerald-700">{opportunity.fundingAmount}</span>
        </div>

        {/* Eligibility Snippet */}
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
          {opportunity.description}
        </p>

        {/* Countries & Format */}
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-slate-400" />
            {opportunity.eligibleCountries[0]}
            {opportunity.eligibleCountries.length > 1 && ` (+${opportunity.eligibleCountries.length - 1})`}
          </span>
          <span>•</span>
          <span className="capitalize">
            {opportunity.format === 'on_site' ? 'Présentiel' : opportunity.format === 'hybrid' ? 'Hybride' : 'Télétravail'}
          </span>
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-5 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1 text-slate-500">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>
            {daysLeft > 0 ? (
              <strong className={daysLeft <= 15 ? 'text-amber-600' : 'text-slate-700'}>
                {daysLeft}j restants
              </strong>
            ) : (
              <span className="text-rose-600 font-bold">Expiré</span>
            )}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onShare}
            className="p-1 rounded text-slate-400 hover:text-slate-600"
            title="Partager"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
          <span className="text-emerald-700 font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
            Détails <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
}

export default App;
