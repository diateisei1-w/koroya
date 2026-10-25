-- ==============================================================================
-- KOROYA DATABASE SCHEMA (Phase 2, 3 & 4: Accounts, Admin & Personalization)
-- Target Platform: Supabase (PostgreSQL 15+)
-- Launch Market: Côte d'Ivoire (MESRS) & Espace Sous-Régional (CAMES, UEMOA)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS & CONSTRAINTS
DO $$ BEGIN
    CREATE TYPE education_level_enum AS ENUM (
        'Bac',
        'Bac+2',
        'Bac+3 (Licence)',
        'Bac+5 (Master)',
        'Doctorat',
        'Tous niveaux'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE funding_type_enum AS ENUM (
        'full',
        'partial',
        'grant',
        'salary',
        'stipend',
        'unpaid'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE opportunity_format_enum AS ENUM (
        'remote',
        'hybrid',
        'on_site'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE application_status_enum AS ENUM (
        'draft',
        'to_do',
        'submitted',
        'pending',
        'accepted',
        'rejected'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE user_role_enum AS ENUM (
        'user',
        'moderator',
        'admin',
        'super_admin'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE report_status_enum AS ENUM (
        'pending',
        'reviewed',
        'resolved',
        'dismissed'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES TABLE (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    education_level TEXT DEFAULT 'Bac+3 (Licence)',
    interests TEXT[] DEFAULT '{}',
    preferred_countries TEXT[] DEFAULT '{"Côte d’Ivoire"}',
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. USER ROLES TABLE (Phase 3: Administration Server-Side RBAC)
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'moderator', 'admin', 'super_admin')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, role)
);

-- Helper Security Definer function to verify Admin rights without bypass
CREATE OR REPLACE FUNCTION public.is_admin(check_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = check_user_id
          AND role IN ('admin', 'super_admin')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ORGANIZATIONS TABLE
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    country TEXT NOT NULL DEFAULT 'Côte d’Ivoire',
    website TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_source TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. OPPORTUNITIES TABLE
CREATE TABLE IF NOT EXISTS public.opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
    organization_name TEXT NOT NULL,
    category_id TEXT REFERENCES public.categories(id) ON DELETE RESTRICT,
    category TEXT NOT NULL,
    eligible_countries TEXT[] NOT NULL DEFAULT '{"Côte d’Ivoire"}',
    location TEXT NOT NULL,
    target_audience TEXT,
    education_level TEXT NOT NULL DEFAULT 'Tous niveaux',
    field TEXT NOT NULL,
    deadline DATE NOT NULL,
    funding_amount TEXT NOT NULL,
    funding_type TEXT NOT NULL DEFAULT 'full',
    format TEXT NOT NULL DEFAULT 'on_site',
    experience_level TEXT NOT NULL DEFAULT 'student',
    is_paid BOOLEAN DEFAULT FALSE,
    description TEXT NOT NULL,
    eligibility TEXT[] NOT NULL DEFAULT '{}',
    required_documents TEXT[] NOT NULL DEFAULT '{}',
    benefits TEXT[] NOT NULL DEFAULT '{}',
    application_process TEXT[] NOT NULL DEFAULT '{}',
    official_url TEXT NOT NULL,
    source TEXT NOT NULL,
    last_verified_date DATE NOT NULL DEFAULT CURRENT_DATE,
    is_verified BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT TRUE,
    is_demo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. SAVED OPPORTUNITIES TABLE (User Bookmarks)
CREATE TABLE IF NOT EXISTS public.saved_opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, opportunity_id)
);

-- 9. APPLICATIONS TRACKING TABLE (Phase 4: Candidate Pipeline)
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'to_do' CHECK (status IN ('to_do', 'submitted', 'pending', 'accepted', 'rejected')),
    notes TEXT,
    applied_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, opportunity_id)
);

-- 10. OPPORTUNITY REPORTS (Phase 3: Quality Control & Community Reporting)
CREATE TABLE IF NOT EXISTS public.opportunity_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
    reporter_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    reason TEXT NOT NULL CHECK (reason IN ('broken_link', 'expired', 'inaccurate', 'fraudulent', 'other')),
    details TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

-- 11. AUDIT LOGS (Phase 3: Immutable Trail)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    actor_email TEXT NOT NULL,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id TEXT,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. NOTIFICATIONS & PREFERENCES (Phase 4: Alerts & Reminders)
CREATE TABLE IF NOT EXISTS public.user_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    opportunity_id UUID REFERENCES public.opportunities(id) ON DELETE CASCADE,
    type TEXT NOT NULL DEFAULT 'general' CHECK (type IN ('deadline_reminder', 'new_match', 'status_update', 'general')),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_notification_preferences (
    user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    email_weekly_digest BOOLEAN DEFAULT TRUE,
    email_deadline_reminders BOOLEAN DEFAULT TRUE,
    email_matching_alerts BOOLEAN DEFAULT TRUE,
    in_app_alerts BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 13. PERFORMANCE INDEXES
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_opportunities_category ON public.opportunities(category);
CREATE INDEX IF NOT EXISTS idx_opportunities_deadline ON public.opportunities(deadline);
CREATE INDEX IF NOT EXISTS idx_opportunities_published ON public.opportunities(is_published);
CREATE INDEX IF NOT EXISTS idx_opportunities_countries ON public.opportunities USING GIN (eligible_countries);
CREATE INDEX IF NOT EXISTS idx_saved_user_id ON public.saved_opportunities(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON public.applications(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_opp ON public.opportunity_reports(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_audit_created ON public.audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.user_notifications(user_id, is_read);

-- ==============================================================================
-- 14. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunity_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notification_preferences ENABLE ROW LEVEL SECURITY;

-- PROFILES
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.is_admin(auth.uid()));

-- USER ROLES (Admins only, never public)
CREATE POLICY "Users can read own role" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (public.is_admin(auth.uid()));

-- CATEGORIES
CREATE POLICY "Categories readable by all" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins can insert categories" ON public.categories FOR INSERT WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admins can update categories" ON public.categories FOR UPDATE USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can delete categories" ON public.categories FOR DELETE USING (public.is_admin(auth.uid()));

-- ORGANIZATIONS
CREATE POLICY "Organizations readable by all" ON public.organizations FOR SELECT USING (true);
CREATE POLICY "Admins can manage organizations" ON public.organizations FOR ALL USING (public.is_admin(auth.uid()));

-- OPPORTUNITIES
CREATE POLICY "Public can view published opportunities" ON public.opportunities FOR SELECT USING (is_published = true OR public.is_admin(auth.uid()));
CREATE POLICY "Admins can insert opportunities" ON public.opportunities FOR INSERT WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admins can update opportunities" ON public.opportunities FOR UPDATE USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can delete opportunities" ON public.opportunities FOR DELETE USING (public.is_admin(auth.uid()));

-- SAVED OPPORTUNITIES
CREATE POLICY "Users can read own bookmarks" ON public.saved_opportunities FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own bookmarks" ON public.saved_opportunities FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own bookmarks" ON public.saved_opportunities FOR DELETE USING (auth.uid() = user_id);

-- APPLICATIONS TRACKER
CREATE POLICY "Users can read own applications" ON public.applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own applications" ON public.applications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own applications" ON public.applications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own applications" ON public.applications FOR DELETE USING (auth.uid() = user_id);

-- OPPORTUNITY REPORTS
CREATE POLICY "Anyone authenticated can report" ON public.opportunity_reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can read reports" ON public.opportunity_reports FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can update reports" ON public.opportunity_reports FOR UPDATE USING (public.is_admin(auth.uid()));

-- AUDIT LOGS
CREATE POLICY "Admins can view audit logs" ON public.audit_logs FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "Service or triggers can insert audit logs" ON public.audit_logs FOR INSERT WITH CHECK (true);

-- NOTIFICATIONS
CREATE POLICY "Users can view own notifications" ON public.user_notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.user_notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own preferences" ON public.user_notification_preferences FOR ALL USING (auth.uid() = user_id);

-- ==============================================================================
-- 15. AUTOMATIC PROFILE & PREFERENCES TRIGGER
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
    );

    INSERT INTO public.user_notification_preferences (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 16. MANUAL COMMAND TO CREATE THE FIRST ADMIN (DOCUMENTED PER MASTER PROMPT)
-- ==============================================================================
-- Execute this once in the Supabase SQL editor using the UUID of your administrator:
--
-- INSERT INTO public.user_roles (user_id, role)
-- VALUES ('VOTRE_USER_UUID_ICI', 'admin')
-- ON CONFLICT (user_id, role) DO NOTHING;
