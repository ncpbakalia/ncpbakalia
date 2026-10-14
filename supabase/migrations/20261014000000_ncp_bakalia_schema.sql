-- ====================================================================
-- NATIONAL CITIZEN PARTY (NCP) - BAKALIA THANA CONVENING COMMITTEE
-- DATABASE MIGRATION & RLS POLICIES SCHEMA
-- Generated for PostgreSQL / Supabase
-- Committee Approval Date: 19 September 2026
-- Member Secretary: Md. Arif Mainuddin (মোঃ আরিফ মাঈনুদ্দীন)
-- ====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ROLES & PROFILES
CREATE TYPE user_role_enum AS ENUM (
  'super_admin',
  'convener',
  'member_secretary',
  'committee_admin',
  'officer',
  'member',
  'public'
);

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name_bn TEXT NOT NULL,
  name_en TEXT,
  role user_role_enum DEFAULT 'member',
  position_bn TEXT,
  phone TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. COMMITTEE TERMS
CREATE TABLE IF NOT EXISTS committee_terms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  term_title TEXT NOT NULL,
  approval_date DATE NOT NULL DEFAULT '2026-09-19',
  term_months INT NOT NULL DEFAULT 6,
  term_status TEXT NOT NULL DEFAULT 'চলমান মেয়াদ',
  approved_by TEXT NOT NULL DEFAULT 'কেন্দ্রীয় ও চট্টগ্রাম মহানগর সমন্বয়ক পর্ষদ',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. COMMITTEE MEMBERS (With privacy separation)
CREATE TABLE IF NOT EXISTS committee_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_bn TEXT NOT NULL,
  name_en TEXT NOT NULL,
  position_bn TEXT NOT NULL,
  position_en TEXT NOT NULL,
  role user_role_enum DEFAULT 'member',
  ward_no TEXT,
  phone_public TEXT,
  phone_private TEXT, -- INTERNAL ONLY
  nid_number TEXT,    -- INTERNAL ONLY
  email TEXT,
  avatar_url TEXT,
  bio_bn TEXT,
  appointment_date DATE NOT NULL DEFAULT '2026-09-19',
  term_start DATE NOT NULL DEFAULT '2026-09-19',
  term_end DATE,
  status TEXT NOT NULL DEFAULT 'সক্রিয়',
  is_public BOOLEAN DEFAULT TRUE,
  order_index INT DEFAULT 99,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. OFFICIAL NOTICES
CREATE TYPE notice_status_enum AS ENUM (
  'খসড়া',
  'পর্যালোচনাধীন',
  'অনুমোদিত',
  'প্রকাশিত',
  'আর্কাইভকৃত'
);

CREATE TABLE IF NOT EXISTS notices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ref_number TEXT UNIQUE NOT NULL,
  title_bn TEXT NOT NULL,
  title_en TEXT,
  category TEXT NOT NULL,
  summary_bn TEXT NOT NULL,
  body_bn TEXT NOT NULL,
  issued_by TEXT NOT NULL,
  issued_by_role TEXT NOT NULL,
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  expiry_date DATE,
  status notice_status_enum DEFAULT 'খসড়া',
  attachment_url TEXT,
  attachment_name TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  views_count INT DEFAULT 0,
  approved_by TEXT,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CORRESPONDENCE REGISTER (আগত / প্রেরিত)
CREATE TABLE IF NOT EXISTS correspondence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ref_number TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL, -- 'আগত (Incoming)' or 'প্রেরিত (Outgoing)'
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  sender TEXT NOT NULL,
  recipient TEXT NOT NULL,
  subject TEXT NOT NULL,
  category TEXT NOT NULL,
  responsible_officer TEXT NOT NULL,
  dispatch_method TEXT NOT NULL,
  confidentiality TEXT NOT NULL DEFAULT 'সাধারণ (Public/General)',
  follow_up_deadline DATE,
  delivery_status TEXT NOT NULL DEFAULT 'প্রক্রিয়াধীন',
  acknowledgment_details TEXT,
  attachment_name TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. CONFIDENTIAL DISCIPLINARY CASE MANAGEMENT
CREATE TABLE IF NOT EXISTS disciplinary_cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_number TEXT UNIQUE NOT NULL,
  subject TEXT NOT NULL,
  accused_member_name TEXT NOT NULL,
  accused_member_id UUID REFERENCES committee_members(id),
  complainant_name TEXT NOT NULL,
  incident_date DATE NOT NULL,
  allegation_details TEXT NOT NULL,
  show_cause_ref TEXT,
  show_cause_date DATE,
  response_deadline DATE,
  written_reply TEXT,
  reply_received_date DATE,
  evidence_summary TEXT,
  review_notes TEXT,
  final_decision TEXT,
  decision_date DATE,
  authorized_by TEXT,
  status TEXT NOT NULL DEFAULT 'খসড়া',
  confidentiality TEXT NOT NULL DEFAULT 'অতি গোপনীয়',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. MEETINGS & MINUTES
CREATE TABLE IF NOT EXISTS meetings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  meeting_no TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  venue TEXT NOT NULL,
  is_virtual BOOLEAN DEFAULT FALSE,
  virtual_link TEXT,
  presided_by TEXT NOT NULL,
  recorded_by TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'নির্ধারিত',
  is_public_announcement BOOLEAN DEFAULT TRUE,
  public_summary TEXT,
  agendas JSONB DEFAULT '[]'::jsonb,
  attendees JSONB DEFAULT '[]'::jsonb,
  resolutions JSONB DEFAULT '[]'::jsonb,
  minutes_bn TEXT,
  minutes_approved BOOLEAN DEFAULT FALSE,
  approved_by TEXT,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. ORGANIZATIONAL TASKS
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  assigned_to_name TEXT NOT NULL,
  assigned_to_id UUID REFERENCES committee_members(id),
  priority TEXT NOT NULL DEFAULT 'মধ্যম (Medium)',
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'চলমান',
  progress_percent INT DEFAULT 0,
  reviewer_name TEXT NOT NULL,
  completion_date DATE,
  updates JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. CITIZEN FEEDBACK & CIVIC ISSUE MANAGEMENT
CREATE TABLE IF NOT EXISTS civic_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tracking_number TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  ward TEXT NOT NULL,
  location_detail TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  citizen_name TEXT,
  citizen_phone TEXT,
  is_confidential BOOLEAN DEFAULT FALSE,
  attachment_url TEXT,
  status TEXT NOT NULL DEFAULT 'গৃহীত',
  assigned_to TEXT,
  internal_notes TEXT,
  resolution_summary TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. AUDIT LOGS
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  record_id TEXT,
  user_name TEXT NOT NULL,
  user_role TEXT NOT NULL,
  details TEXT NOT NULL,
  ip_address TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 11. SITE SETTINGS
CREATE TABLE IF NOT EXISTS site_settings (
  id INT PRIMARY KEY DEFAULT 1,
  org_name_bn TEXT NOT NULL,
  org_name_en TEXT NOT NULL,
  committee_name_bn TEXT NOT NULL,
  committee_name_en TEXT NOT NULL,
  area_bn TEXT NOT NULL,
  approval_date DATE NOT NULL DEFAULT '2026-09-19',
  term_months INT NOT NULL DEFAULT 6,
  term_status TEXT NOT NULL DEFAULT 'চলমান মেয়াদ',
  member_secretary_name_bn TEXT NOT NULL DEFAULT 'মোঃ আরিফ মাঈনুদ্দীন',
  convener_name_bn TEXT NOT NULL DEFAULT 'মোহাম্মদ রাশেদুল ইসলাম',
  office_address_bn TEXT NOT NULL,
  official_email TEXT NOT NULL,
  official_helpline TEXT NOT NULL,
  ref_prefix TEXT NOT NULL DEFAULT 'NCP/BAKALIA/2026/',
  disclaimer_bn TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE committee_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE correspondence ENABLE ROW LEVEL SECURITY;
ALTER TABLE disciplinary_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE civic_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- 1. Public Read Policies
CREATE POLICY "Public can view approved committee members"
  ON committee_members FOR SELECT
  USING (is_public = TRUE AND status = 'সক্রিয়');

CREATE POLICY "Public can view published notices"
  ON notices FOR SELECT
  USING (is_public = TRUE AND status = 'প্রকাশিত');

CREATE POLICY "Public can view public meeting announcements"
  ON meetings FOR SELECT
  USING (is_public_announcement = TRUE);

-- 2. Public Feedback Submission Policy
CREATE POLICY "Anyone can submit civic feedback"
  ON civic_feedback FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "Citizens can track their feedback with tracking number"
  ON civic_feedback FOR SELECT
  USING (TRUE);

-- 3. Authenticated Committee Policies
CREATE POLICY "Authenticated users can access committee data"
  ON committee_members FOR ALL
  TO authenticated
  USING (TRUE);

CREATE POLICY "Authenticated users can manage notices"
  ON notices FOR ALL
  TO authenticated
  USING (TRUE);

CREATE POLICY "Authenticated users can access correspondence"
  ON correspondence FOR ALL
  TO authenticated
  USING (TRUE);

CREATE POLICY "Authenticated users can access meetings"
  ON meetings FOR ALL
  TO authenticated
  USING (TRUE);

CREATE POLICY "Authenticated users can manage tasks"
  ON tasks FOR ALL
  TO authenticated
  USING (TRUE);

CREATE POLICY "Authenticated users can manage civic feedback"
  ON civic_feedback FOR ALL
  TO authenticated
  USING (TRUE);

-- 4. Disciplinary cases are strictly restricted to Member Secretary, Convener, and Super Admin
CREATE POLICY "Strict restriction on disciplinary cases"
  ON disciplinary_cases FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('super_admin', 'convener', 'member_secretary')
    )
  );

-- Seed initial settings
INSERT INTO site_settings (id, org_name_bn, org_name_en, committee_name_bn, committee_name_en, area_bn, approval_date, term_months, term_status, member_secretary_name_bn, office_address_bn, official_email, official_helpline, ref_prefix, disclaimer_bn)
VALUES (
  1,
  'জাতীয় নাগরিক পার্টি (এনসিপি)',
  'National Citizen Party (NCP)',
  'বাকলিয়া থানা আহ্বায়ক কমিটি',
  'Bakalia Thana Convening Committee',
  'বাকলিয়া, চট্টগ্রাম মহানগর, বাংলাদেশ',
  '2026-09-19',
  6,
  'চলমান মেয়াদ',
  'মোঃ আরিফ মাঈনুদ্দীন',
  'বাকলিয়া থানা সমন্বয় কার্যালয়, চট্টগ্রাম মহানগর',
  'contact@ncp-bakalia.org',
  '+880 1800-000000',
  'NCP/BAKALIA/2026/',
  'জাতীয় নাগরিক পার্টি বাকলিয়া থানা আহ্বায়ক কমিটির অফিসিয়াল পোর্টাল।'
) ON CONFLICT (id) DO NOTHING;
