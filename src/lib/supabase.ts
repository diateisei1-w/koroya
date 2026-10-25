import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { Opportunity, DEMO_OPPORTUNITIES } from '../data/opportunities';

const getEnvVar = (key: string): string => {
  if (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env[key]) {
    return (import.meta as any).env[key];
  }
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key] as string;
  }
  return '';
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY');

// Verify if Supabase environment variables are properly configured
export const isSupabaseConfigured: boolean = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project-id.supabase.co' &&
  supabaseAnonKey !== 'your-supabase-anon-key-here' &&
  supabaseUrl.startsWith('https://')
);

// Instantiate Supabase client only with public anon key
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  : null;

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  educationLevel: 'Bac' | 'Bac+2' | 'Bac+3 (Licence)' | 'Bac+5 (Master)' | 'Doctorat' | 'Autre';
  interests: string[];
  preferredCountries: string[];
  phone?: string;
  createdAt?: string;
}

export type ApplicationStatus = 'to_do' | 'submitted' | 'pending' | 'accepted' | 'rejected';

export interface UserApplication {
  id: string;
  userId: string;
  opportunityId: string;
  status: ApplicationStatus;
  notes?: string;
  appliedDate?: string;
  updatedAt?: string;
}

export interface OpportunityReport {
  id: string;
  opportunityId: string;
  opportunityTitle?: string;
  reporterId?: string;
  reporterEmail?: string;
  reason: 'broken_link' | 'expired' | 'inaccurate' | 'fraudulent' | 'other';
  details: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  adminNotes?: string;
  createdAt: string;
}

export interface AuditLogEntry {
  id: string;
  actorId?: string;
  actorEmail: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  details?: Record<string, any>;
  createdAt: string;
}

export interface UserNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  opportunityId?: string;
  type: 'deadline_reminder' | 'new_match' | 'status_update' | 'general';
  isRead: boolean;
  createdAt: string;
}

export interface NotificationPreferences {
  emailWeeklyDigest: boolean;
  emailDeadlineReminders: boolean;
  emailMatchingAlerts: boolean;
  inAppAlerts: boolean;
}

// Local Storage Keys for Demo / Fallback
const STORAGE_DEMO_USER = 'koroya_demo_auth_user';
const STORAGE_DEMO_PROFILE = 'koroya_demo_auth_profile';
const STORAGE_DEMO_IS_ADMIN = 'koroya_demo_is_admin';
const STORAGE_DEMO_OPPORTUNITIES = 'koroya_demo_opportunities_list';
const STORAGE_DEMO_APPLICATIONS = 'koroya_demo_applications_list';
const STORAGE_DEMO_REPORTS = 'koroya_demo_reports_list';
const STORAGE_DEMO_AUDIT = 'koroya_demo_audit_logs';
const STORAGE_DEMO_NOTIFICATIONS = 'koroya_demo_notifications';
const STORAGE_DEMO_NOTIF_PREFS = 'koroya_demo_notif_prefs';
const STORAGE_RECENTLY_VIEWED = 'koroya_recently_viewed_ids';

/**
 * Service Layer for Authentication & User Profiles with transparent Demo Mode fallback.
 */
export const authService = {
  /**
   * Check current authenticated session
   */
  async getSession(): Promise<{ user: User | { id: string; email: string } | null; isDemo: boolean }> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data } = await supabase.auth.getSession();
        if (data?.session?.user) {
          return { user: data.session.user, isDemo: false };
        }
      } catch (err) {
        console.warn('Supabase session fetch error, falling back to local state:', err);
      }
    }

    // Demo Mode session check
    try {
      const demoUserJson = localStorage.getItem(STORAGE_DEMO_USER);
      if (demoUserJson) {
        return { user: JSON.parse(demoUserJson), isDemo: true };
      }
    } catch {
      // Ignore
    }

    return { user: null, isDemo: !isSupabaseConfigured };
  },

  /**
   * Check if user has admin role (enforced server-side via user_roles or demo flag)
   */
  async checkIsAdmin(userId: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', userId)
          .in('role', ['admin', 'super_admin'])
          .limit(1);

        if (!error && data && data.length > 0) {
          return true;
        }
      } catch (err) {
        console.warn('Admin check error:', err);
      }
      return false;
    }

    // Demo mode admin flag
    return localStorage.getItem(STORAGE_DEMO_IS_ADMIN) === 'true';
  },

  /**
   * Set Demo Mode Admin toggle
   */
  setDemoAdmin(isAdmin: boolean) {
    if (isAdmin) {
      localStorage.setItem(STORAGE_DEMO_IS_ADMIN, 'true');
    } else {
      localStorage.removeItem(STORAGE_DEMO_IS_ADMIN);
    }
  },

  /**
   * Sign Up with Email, Password and Full Name
   */
  async signUp(email: string, password: string, fullName: string) {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });
      if (error) throw error;
      return { user: data.user, isDemo: false };
    }

    // Demo Mode registration
    const demoId = 'demo-user-' + Date.now().toString(36);
    const demoUser = { id: demoId, email };
    const demoProfile: UserProfile = {
      id: demoId,
      email,
      fullName: fullName || email.split('@')[0],
      educationLevel: 'Bac+3 (Licence)',
      interests: ['Bourses d’Études MESRS', 'Stages Abidjan'],
      preferredCountries: ['Côte d’Ivoire'],
      createdAt: new Date().toISOString()
    };

    localStorage.setItem(STORAGE_DEMO_USER, JSON.stringify(demoUser));
    localStorage.setItem(STORAGE_DEMO_PROFILE, JSON.stringify(demoProfile));

    return { user: demoUser, isDemo: true };
  },

  /**
   * Sign In with Email & Password
   */
  async signIn(email: string, password: string) {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      return { user: data.user, isDemo: false };
    }

    // Demo Mode login
    const demoId = 'demo-user-ci';
    const demoUser = { id: demoId, email };
    const existingProfile = localStorage.getItem(STORAGE_DEMO_PROFILE);
    if (!existingProfile) {
      const initialProfile: UserProfile = {
        id: demoId,
        email,
        fullName: email.split('@')[0],
        educationLevel: 'Bac+3 (Licence)',
        interests: ['Bourses d’Études MESRS', 'Financements en FCFA'],
        preferredCountries: ['Côte d’Ivoire'],
        createdAt: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_DEMO_PROFILE, JSON.stringify(initialProfile));
    }

    localStorage.setItem(STORAGE_DEMO_USER, JSON.stringify(demoUser));
    return { user: demoUser, isDemo: true };
  },

  /**
   * Sign Out
   */
  async signOut() {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem(STORAGE_DEMO_USER);
  },

  /**
   * Request Password Reset Email
   */
  async resetPassword(email: string) {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin
      });
      if (error) throw error;
      return { success: true, isDemo: false };
    }

    return { success: true, isDemo: true };
  },

  /**
   * Fetch User Profile
   */
  async getProfile(userId: string): Promise<UserProfile | null> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) {
          console.warn('Profile fetch error, initializing fallback:', error);
        } else if (data) {
          return {
            id: data.id,
            email: data.email,
            fullName: data.full_name || '',
            educationLevel: data.education_level || 'Bac+3 (Licence)',
            interests: data.interests || [],
            preferredCountries: data.preferred_countries || ['Côte d’Ivoire'],
            phone: data.phone || '',
            createdAt: data.created_at
          };
        }
      } catch (err) {
        console.warn('Error reading from profiles table:', err);
      }
    }

    try {
      const stored = localStorage.getItem(STORAGE_DEMO_PROFILE);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Ignore
    }

    return null;
  },

  /**
   * Update User Profile
   */
  async updateProfile(userId: string, profileData: Partial<UserProfile>): Promise<UserProfile> {
    if (isSupabaseConfigured && supabase) {
      const payload: Record<string, any> = {
        updated_at: new Date().toISOString()
      };
      if (profileData.fullName !== undefined) payload.full_name = profileData.fullName;
      if (profileData.educationLevel !== undefined) payload.education_level = profileData.educationLevel;
      if (profileData.interests !== undefined) payload.interests = profileData.interests;
      if (profileData.preferredCountries !== undefined) payload.preferred_countries = profileData.preferredCountries;
      if (profileData.phone !== undefined) payload.phone = profileData.phone;

      const { data, error } = await supabase
        .from('profiles')
        .update(payload)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        email: data.email,
        fullName: data.full_name,
        educationLevel: data.education_level,
        interests: data.interests,
        preferredCountries: data.preferred_countries,
        phone: data.phone
      };
    }

    const currentStored = localStorage.getItem(STORAGE_DEMO_PROFILE);
    const current: UserProfile = currentStored
      ? JSON.parse(currentStored)
      : {
          id: userId,
          email: 'demo@koroya.ci',
          fullName: 'Talent KOROYA',
          educationLevel: 'Bac+3 (Licence)',
          interests: [],
          preferredCountries: ['Côte d’Ivoire']
        };

    const updated: UserProfile = { ...current, ...profileData };
    localStorage.setItem(STORAGE_DEMO_PROFILE, JSON.stringify(updated));
    return updated;
  },

  /**
   * Bookmarks Synchronization
   */
  async syncLocalSavedToDatabase(userId: string, localIds: string[]): Promise<string[]> {
    if (!localIds || localIds.length === 0) return [];
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: existing } = await supabase
          .from('saved_opportunities')
          .select('opportunity_id')
          .eq('user_id', userId);

        const existingSet = new Set(existing ? existing.map((r) => r.opportunity_id) : []);
        const toInsert = localIds
          .filter((id) => !existingSet.has(id))
          .map((id) => ({
            user_id: userId,
            opportunity_id: id
          }));

        if (toInsert.length > 0) {
          await supabase.from('saved_opportunities').insert(toInsert);
        }

        const { data: updated } = await supabase
          .from('saved_opportunities')
          .select('opportunity_id')
          .eq('user_id', userId);

        return updated ? updated.map((r) => r.opportunity_id) : localIds;
      } catch (err) {
        console.warn('Sync to database failed:', err);
      }
    }
    return localIds;
  },

  async saveOpportunityCloud(userId: string, opportunityId: string) {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('saved_opportunities').upsert({
        user_id: userId,
        opportunity_id: opportunityId
      });
    }
  },

  async removeOpportunityCloud(userId: string, opportunityId: string) {
    if (isSupabaseConfigured && supabase) {
      await supabase
        .from('saved_opportunities')
        .delete()
        .eq('user_id', userId)
        .eq('opportunity_id', opportunityId);
    }
  }
};

/**
 * Phase 3: Administration & Quality Control Service
 */
export const adminService = {
  /**
   * Get all opportunities (including unpublished/drafts)
   */
  async getAllOpportunities(): Promise<Opportunity[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('opportunities')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          return data.map((d) => ({
            id: d.id,
            title: d.title,
            organization: d.organization_name,
            category: d.category,
            eligibleCountries: d.eligible_countries || ['Côte d’Ivoire'],
            location: d.location,
            targetAudience: d.target_audience || '',
            educationLevel: d.education_level || 'Tous niveaux',
            field: d.field,
            deadline: d.deadline,
            fundingAmount: d.funding_amount,
            fundingType: d.funding_type || 'full',
            format: d.format || 'on_site',
            experienceLevel: d.experience_level || 'student',
            isPaid: d.is_paid || false,
            description: d.description,
            eligibility: d.eligibility || [],
            requiredDocuments: d.required_documents || [],
            benefits: d.benefits || [],
            applicationProcess: d.application_process || [],
            officialUrl: d.official_url,
            source: d.source,
            lastVerifiedDate: d.last_verified_date,
            isVerified: d.is_verified || false,
            isDemo: d.is_demo !== false,
            featured: false
          }));
        }
      } catch (err) {
        console.warn('Admin fetch opportunities error:', err);
      }
    }

    // Demo Mode persistent opportunities
    const stored = localStorage.getItem(STORAGE_DEMO_OPPORTUNITIES);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // Fallback
      }
    }
    return [...DEMO_OPPORTUNITIES];
  },

  /**
   * Create or Save Opportunity (Admin only)
   */
  async saveOpportunity(opp: Opportunity, actorEmail: string): Promise<Opportunity> {
    if (isSupabaseConfigured && supabase) {
      const payload: Record<string, any> = {
        title: opp.title,
        organization_name: opp.organization,
        category: opp.category,
        category_id: opp.category,
        eligible_countries: opp.eligibleCountries,
        location: opp.location,
        target_audience: opp.targetAudience,
        education_level: opp.educationLevel,
        field: opp.field,
        deadline: opp.deadline,
        funding_amount: opp.fundingAmount,
        funding_type: opp.fundingType,
        format: opp.format,
        experience_level: opp.experienceLevel,
        is_paid: opp.isPaid,
        description: opp.description,
        eligibility: opp.eligibility,
        required_documents: opp.requiredDocuments,
        benefits: opp.benefits,
        application_process: opp.applicationProcess,
        official_url: opp.officialUrl,
        source: opp.source,
        last_verified_date: opp.lastVerifiedDate,
        is_verified: opp.isVerified,
        is_published: true,
        is_demo: opp.isDemo
      };

      if (opp.id && !opp.id.startsWith('opp-demo-new-')) {
        payload.id = opp.id;
      }

      const { data, error } = await supabase
        .from('opportunities')
        .upsert(payload)
        .select()
        .single();

      if (error) throw error;

      await this.recordAudit(actorEmail, 'SAVE_OPPORTUNITY', 'opportunities', data.id, { title: opp.title });
      return opp;
    }

    // Demo storage update
    const currentList = await this.getAllOpportunities();
    const existingIndex = currentList.findIndex((item) => item.id === opp.id);
    let updatedList: Opportunity[];

    if (existingIndex >= 0) {
      updatedList = currentList.map((item, idx) => (idx === existingIndex ? opp : item));
    } else {
      const newOpp = { ...opp, id: opp.id || 'opp-demo-new-' + Date.now().toString(36) };
      updatedList = [newOpp, ...currentList];
    }

    localStorage.setItem(STORAGE_DEMO_OPPORTUNITIES, JSON.stringify(updatedList));
    await this.recordAudit(actorEmail, existingIndex >= 0 ? 'UPDATE_OPPORTUNITY' : 'CREATE_OPPORTUNITY', 'opportunities', opp.id, { title: opp.title });
    return opp;
  },

  /**
   * Delete an opportunity
   */
  async deleteOpportunity(oppId: string, actorEmail: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('opportunities').delete().eq('id', oppId);
      if (error) throw error;
      await this.recordAudit(actorEmail, 'DELETE_OPPORTUNITY', 'opportunities', oppId);
      return;
    }

    const currentList = await this.getAllOpportunities();
    const filtered = currentList.filter((item) => item.id !== oppId);
    localStorage.setItem(STORAGE_DEMO_OPPORTUNITIES, JSON.stringify(filtered));
    await this.recordAudit(actorEmail, 'DELETE_OPPORTUNITY', 'opportunities', oppId);
  },

  /**
   * Mark an opportunity as verified (Strict Honesty Rule: requires source and date)
   */
  async markAsVerified(oppId: string, verificationSource: string, verificationDate: string, actorEmail: string): Promise<void> {
    if (!verificationSource.trim()) {
      throw new Error('La source officielle est obligatoire pour certifier une opportunité.');
    }
    if (!verificationDate) {
      throw new Error('La date de vérification effective est obligatoire.');
    }

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('opportunities')
        .update({
          is_verified: true,
          source: verificationSource,
          last_verified_date: verificationDate
        })
        .eq('id', oppId);

      if (error) throw error;
      await this.recordAudit(actorEmail, 'VERIFY_OPPORTUNITY', 'opportunities', oppId, { source: verificationSource, date: verificationDate });
      return;
    }

    const currentList = await this.getAllOpportunities();
    const updated = currentList.map((opp) => {
      if (opp.id === oppId) {
        return {
          ...opp,
          isVerified: true,
          source: verificationSource,
          lastVerifiedDate: verificationDate
        };
      }
      return opp;
    });

    localStorage.setItem(STORAGE_DEMO_OPPORTUNITIES, JSON.stringify(updated));
    await this.recordAudit(actorEmail, 'VERIFY_OPPORTUNITY', 'opportunities', oppId, { source: verificationSource, date: verificationDate });
  },

  /**
   * Reports Review & Moderation
   */
  async getReports(): Promise<OpportunityReport[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('opportunity_reports')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          return data.map((r) => ({
            id: r.id,
            opportunityId: r.opportunity_id,
            reporterId: r.reporter_id,
            reason: r.reason,
            details: r.details,
            status: r.status,
            adminNotes: r.admin_notes,
            createdAt: r.created_at
          }));
        }
      } catch (err) {
        console.warn('Reports fetch error:', err);
      }
    }

    const stored = localStorage.getItem(STORAGE_DEMO_REPORTS);
    if (stored) {
      return JSON.parse(stored);
    }

    // Default sample report for demo testing
    const sampleReports: OpportunityReport[] = [
      {
        id: 'rep-sample-01',
        opportunityId: 'opp-orange-fab-03',
        opportunityTitle: 'Stage Développeur Cloud Orange CI',
        reporterEmail: 'etudiant@ufhb.ci',
        reason: 'broken_link',
        details: 'Le lien vers le formulaire carrières Orange CI a été actualisé pour la session 2026.',
        status: 'pending',
        createdAt: new Date().toISOString()
      }
    ];
    return sampleReports;
  },

  async submitReport(opportunityId: string, reason: OpportunityReport['reason'], details: string, reporterId?: string, reporterEmail?: string): Promise<void> {
    const newReport: OpportunityReport = {
      id: 'rep-' + Date.now().toString(36),
      opportunityId,
      reporterId,
      reporterEmail: reporterEmail || 'anonyme@koroya.ci',
      reason,
      details,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      await supabase.from('opportunity_reports').insert({
        opportunity_id: opportunityId,
        reporter_id: reporterId,
        reason,
        details,
        status: 'pending'
      });
      return;
    }

    const current = await this.getReports();
    localStorage.setItem(STORAGE_DEMO_REPORTS, JSON.stringify([newReport, ...current]));
  },

  async updateReportStatus(reportId: string, status: OpportunityReport['status'], adminNotes: string, actorEmail: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase
        .from('opportunity_reports')
        .update({
          status,
          admin_notes: adminNotes,
          resolved_at: status === 'resolved' ? new Date().toISOString() : null
        })
        .eq('id', reportId);

      await this.recordAudit(actorEmail, 'RESOLVE_REPORT', 'reports', reportId, { status, adminNotes });
      return;
    }

    const current = await this.getReports();
    const updated = current.map((r) => (r.id === reportId ? { ...r, status, adminNotes } : r));
    localStorage.setItem(STORAGE_DEMO_REPORTS, JSON.stringify(updated));
    await this.recordAudit(actorEmail, 'RESOLVE_REPORT', 'reports', reportId, { status, adminNotes });
  },

  /**
   * Audit Log Service (Who, What, When)
   */
  async getAuditLogs(): Promise<AuditLogEntry[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('audit_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(30);

        if (!error && data) {
          return data.map((d) => ({
            id: d.id,
            actorId: d.actor_id,
            actorEmail: d.actor_email,
            action: d.action,
            resourceType: d.resource_type,
            resourceId: d.resource_id,
            details: d.details,
            createdAt: d.created_at
          }));
        }
      } catch (err) {
        console.warn('Audit logs fetch error:', err);
      }
    }

    const stored = localStorage.getItem(STORAGE_DEMO_AUDIT);
    if (stored) {
      return JSON.parse(stored);
    }
    return [
      {
        id: 'audit-init-01',
        actorEmail: 'admin@koroya.ci',
        action: 'SYSTEM_BOOTSTRAP_PHASE3',
        resourceType: 'system',
        createdAt: new Date().toISOString(),
        details: { note: 'Initialisation de la surveillance et audit log KOROYA' }
      }
    ];
  },

  async recordAudit(actorEmail: string, action: string, resourceType: string, resourceId?: string, details?: Record<string, any>) {
    const entry: AuditLogEntry = {
      id: 'audit-' + Date.now().toString(36),
      actorEmail: actorEmail || 'system@koroya.ci',
      action,
      resourceType,
      resourceId,
      details,
      createdAt: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('audit_logs').insert({
          actor_email: actorEmail || 'system@koroya.ci',
          action,
          resource_type: resourceType,
          resource_id: resourceId,
          details
        });
      } catch {
        // Ignore audit insert errors
      }
      return;
    }

    const current = await this.getAuditLogs();
    const updated = [entry, ...current].slice(0, 50);
    localStorage.setItem(STORAGE_DEMO_AUDIT, JSON.stringify(updated));
  }
};

/**
 * Phase 4: Tracking, Personalization, Notifications & Recommendations Service
 */
export const trackingService = {
  /**
   * Get all tracked applications for a user
   */
  async getUserApplications(userId: string): Promise<UserApplication[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('applications')
          .select('*')
          .eq('user_id', userId)
          .order('updated_at', { ascending: false });

        if (!error && data) {
          return data.map((d) => ({
            id: d.id,
            userId: d.user_id,
            opportunityId: d.opportunity_id,
            status: d.status,
            notes: d.notes,
            appliedDate: d.applied_date,
            updatedAt: d.updated_at
          }));
        }
      } catch (err) {
        console.warn('Applications fetch error:', err);
      }
    }

    const stored = localStorage.getItem(STORAGE_DEMO_APPLICATIONS);
    if (stored) {
      const list: UserApplication[] = JSON.parse(stored);
      return list.filter((app) => app.userId === userId);
    }
    return [];
  },

  /**
   * Save or Update an application tracking state
   */
  async setApplicationStatus(userId: string, opportunityId: string, status: ApplicationStatus, notes?: string, appliedDate?: string): Promise<UserApplication> {
    const now = new Date().toISOString();
    const appRecord: UserApplication = {
      id: 'app-' + userId + '-' + opportunityId,
      userId,
      opportunityId,
      status,
      notes,
      appliedDate: appliedDate || (status === 'submitted' ? now : undefined),
      updatedAt: now
    };

    if (isSupabaseConfigured && supabase) {
      await supabase.from('applications').upsert({
        user_id: userId,
        opportunity_id: opportunityId,
        status,
        notes,
        applied_date: appRecord.appliedDate,
        updated_at: now
      });
      return appRecord;
    }

    const allStored: UserApplication[] = (() => {
      try {
        const s = localStorage.getItem(STORAGE_DEMO_APPLICATIONS);
        return s ? JSON.parse(s) : [];
      } catch {
        return [];
      }
    })();

    const filtered = allStored.filter((a) => !(a.userId === userId && a.opportunityId === opportunityId));
    const updated = [appRecord, ...filtered];
    localStorage.setItem(STORAGE_DEMO_APPLICATIONS, JSON.stringify(updated));
    return appRecord;
  },

  /**
   * Delete an application tracking record
   */
  async removeApplication(userId: string, opportunityId: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase
        .from('applications')
        .delete()
        .eq('user_id', userId)
        .eq('opportunity_id', opportunityId);
      return;
    }

    const allStored: UserApplication[] = (() => {
      try {
        const s = localStorage.getItem(STORAGE_DEMO_APPLICATIONS);
        return s ? JSON.parse(s) : [];
      } catch {
        return [];
      }
    })();

    const updated = allStored.filter((a) => !(a.userId === userId && a.opportunityId === opportunityId));
    localStorage.setItem(STORAGE_DEMO_APPLICATIONS, JSON.stringify(updated));
  },

  /**
   * Manage Recently Viewed Opportunities in Local Storage (Last 5 items)
   */
  getRecentlyViewedIds(): string[] {
    try {
      const s = localStorage.getItem(STORAGE_RECENTLY_VIEWED);
      return s ? JSON.parse(s) : [];
    } catch {
      return [];
    }
  },

  recordRecentlyViewed(oppId: string): string[] {
    try {
      const current = this.getRecentlyViewedIds().filter((id) => id !== oppId);
      const updated = [oppId, ...current].slice(0, 5);
      localStorage.setItem(STORAGE_RECENTLY_VIEWED, JSON.stringify(updated));
      return updated;
    } catch {
      return [oppId];
    }
  },

  /**
   * Deterministic Matching Engine: Computes a relevance score (0-100%)
   * and explanation based on user profile and opportunity parameters.
   */
  calculateOpportunityMatch(profile: UserProfile | null, opportunity: Opportunity): { score: number; reasons: string[] } {
    if (!profile) {
      return { score: 70, reasons: ['Recommandation générale KOROYA'] };
    }

    let score = 40; // baseline
    const reasons: string[] = [];

    // 1. Education Level Match (+30)
    if (
      opportunity.educationLevel === 'Tous niveaux' ||
      opportunity.educationLevel.toLowerCase().includes(profile.educationLevel.toLowerCase().slice(0, 4))
    ) {
      score += 30;
      reasons.push(`Niveau d'études adapté (${profile.educationLevel})`);
    }

    // 2. Preferred Countries Match (+20)
    const hasCountryMatch = profile.preferredCountries.some((c) =>
      opportunity.eligibleCountries.some((ec) => ec.toLowerCase().includes(c.toLowerCase()))
    );
    if (hasCountryMatch) {
      score += 20;
      reasons.push(`Pays éligible (${profile.preferredCountries.join(', ')})`);
    }

    // 3. Thematic / Category Interests Match (+20)
    if (profile.interests && profile.interests.length > 0) {
      const oppText = (opportunity.title + ' ' + opportunity.field + ' ' + opportunity.description).toLowerCase();
      const matchedInterest = profile.interests.find((interest) =>
        oppText.includes(interest.toLowerCase().split(' ')[0])
      );
      if (matchedInterest) {
        score += 20;
        reasons.push(`Aligné avec votre intérêt pour ${matchedInterest}`);
      }
    }

    const finalScore = Math.min(100, Math.max(30, score));
    return { score: finalScore, reasons };
  },

  /**
   * In-App Notifications
   */
  async getUserNotifications(userId: string): Promise<UserNotification[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('user_notifications')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (!error && data) {
          return data.map((d) => ({
            id: d.id,
            userId: d.user_id,
            title: d.title,
            message: d.message,
            opportunityId: d.opportunity_id,
            type: d.type,
            isRead: d.is_read,
            createdAt: d.created_at
          }));
        }
      } catch (err) {
        console.warn('Notifications fetch error:', err);
      }
    }

    const stored = localStorage.getItem(STORAGE_DEMO_NOTIFICATIONS);
    if (stored) {
      return JSON.parse(stored);
    }

    // Default welcoming notifications
    const defaultNotifs: UserNotification[] = [
      {
        id: 'notif-01',
        userId,
        title: 'Bourses d’Excellence MESRS CI ouvertes',
        message: 'Le dépôt des dossiers pour le cycle Master & Doctorat est en cours jusqu’au 30 Mai 2026.',
        opportunityId: 'opp-ci-mesrs-01',
        type: 'deadline_reminder',
        isRead: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 'notif-02',
        userId,
        title: 'Nouvelle recommandation de stage',
        message: 'Orange Digital Center recrute des stagiaires en Cloud & DevSecOps à Abidjan.',
        opportunityId: 'opp-orange-fab-03',
        type: 'new_match',
        isRead: false,
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
      }
    ];
    return defaultNotifs;
  },

  async markNotificationRead(notifId: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('user_notifications').update({ is_read: true }).eq('id', notifId);
      return;
    }

    const stored = localStorage.getItem(STORAGE_DEMO_NOTIFICATIONS);
    if (stored) {
      const list: UserNotification[] = JSON.parse(stored);
      const updated = list.map((n) => (n.id === notifId ? { ...n, isRead: true } : n));
      localStorage.setItem(STORAGE_DEMO_NOTIFICATIONS, JSON.stringify(updated));
    }
  },

  /**
   * Notification Preferences
   */
  async getNotificationPreferences(userId: string): Promise<NotificationPreferences> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('user_notification_preferences')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (!error && data) {
          return {
            emailWeeklyDigest: data.email_weekly_digest ?? true,
            emailDeadlineReminders: data.email_deadline_reminders ?? true,
            emailMatchingAlerts: data.email_matching_alerts ?? true,
            inAppAlerts: data.in_app_alerts ?? true
          };
        }
      } catch (err) {
        console.warn('Prefs fetch error:', err);
      }
    }

    const stored = localStorage.getItem(STORAGE_DEMO_NOTIF_PREFS);
    if (stored) {
      return JSON.parse(stored);
    }
    return {
      emailWeeklyDigest: true,
      emailDeadlineReminders: true,
      emailMatchingAlerts: true,
      inAppAlerts: true
    };
  },

  async saveNotificationPreferences(userId: string, prefs: NotificationPreferences): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('user_notification_preferences').upsert({
        user_id: userId,
        email_weekly_digest: prefs.emailWeeklyDigest,
        email_deadline_reminders: prefs.emailDeadlineReminders,
        email_matching_alerts: prefs.emailMatchingAlerts,
        in_app_alerts: prefs.inAppAlerts,
        updated_at: new Date().toISOString()
      });
      return;
    }

    localStorage.setItem(STORAGE_DEMO_NOTIF_PREFS, JSON.stringify(prefs));
  }
};
