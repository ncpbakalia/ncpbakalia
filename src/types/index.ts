export type RoleType =
  | 'super_admin'
  | 'convener'
  | 'member_secretary'
  | 'committee_admin'
  | 'officer'
  | 'member'
  | 'public';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  name_en?: string;
  role: RoleType;
  position_bn: string;
  phone?: string;
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
}

export type CommitteeStatus = 'সক্রিয়' | 'অব্যাহতি' | 'মেয়াদোত্তীর্ণ' | 'স্থগিত';

export interface CommitteeMember {
  id: string;
  name_bn: string;
  name_en: string;
  position_bn: string;
  position_en: string;
  role: RoleType;
  ward_no?: string;
  phone_public?: string;
  phone_private?: string; // Internal only, never exposed publicly
  nid_number?: string;    // Internal only, never exposed publicly
  email?: string;
  avatar_url?: string;
  bio_bn?: string;
  appointment_date: string;
  term_start: string;
  term_end?: string;
  status: CommitteeStatus;
  is_public: boolean;
  order_index: number;
}

export type NoticeCategory =
  | 'সভা বিজ্ঞপ্তি'
  | 'সাংগঠনিক ঘোষণা'
  | 'জনগুরুত্বপূর্ণ নোটিশ'
  | 'প্রেস বিজ্ঞপ্তি'
  | 'অন্যান্য';

export type NoticeStatus = 'খসড়া' | 'পর্যালোচনাধীন' | 'অনুমোদিত' | 'প্রকাশিত' | 'আর্কাইভকৃত';

export interface Notice {
  id: string;
  ref_number: string;
  title_bn: string;
  title_en?: string;
  category: NoticeCategory;
  summary_bn: string;
  body_bn: string;
  issued_by: string;
  issued_by_role: string;
  issue_date: string;
  expiry_date?: string;
  status: NoticeStatus;
  attachment_url?: string;
  attachment_name?: string;
  is_public: boolean;
  views_count: number;
  created_at: string;
  updated_at: string;
  approved_by?: string;
  approved_at?: string;
}

export type CorrespondenceType = 'আগত (Incoming)' | 'প্রেরিত (Outgoing)';
export type ConfidentialityLevel = 'সাধারণ (Public/General)' | 'গোপনীয় (Confidential)' | 'অতি গোপনীয় (Strictly Confidential)';
export type DeliveryMethod = 'হাতে হাতে (By Hand)' | 'ইমেইল (Email)' | 'কুরিয়ার / ডাক (Courier/Post)' | 'ডিজিটাল পোর্টাল (Portal)';

export interface CorrespondenceRecord {
  id: string;
  ref_number: string;
  type: CorrespondenceType;
  date: string;
  sender: string;
  recipient: string;
  subject: string;
  category: string;
  responsible_officer: string;
  dispatch_method: DeliveryMethod;
  confidentiality: ConfidentialityLevel;
  follow_up_deadline?: string;
  delivery_status: 'বিতরিত' | 'প্রক্রিয়াধীন' | 'স্বীকৃতি প্রাপ্ত' | 'অমীমাংসিত';
  acknowledgment_details?: string;
  attachment_name?: string;
  notes?: string;
  created_at: string;
}

export type DisciplinaryStatus =
  | 'খসড়া'
  | 'পর্যালোচনাধীন'
  | 'কারণ দর্শানোর নোটিশ জারি'
  | 'জবাব অপেক্ষমান'
  | 'জবাব পর্যালোচনা'
  | 'শুনানি অনুষ্ঠিত'
  | 'চূড়ান্ত সিদ্ধান্ত'
  | 'নিষ্পত্তিকৃত ও আর্কাইভ';

export interface DisciplinaryCase {
  id: string;
  case_number: string;
  subject: string;
  accused_member_name: string;
  accused_member_id?: string;
  complainant_name: string;
  incident_date: string;
  allegation_details: string;
  show_cause_ref?: string;
  show_cause_date?: string;
  response_deadline?: string;
  written_reply?: string;
  reply_received_date?: string;
  evidence_summary?: string;
  review_notes?: string;
  final_decision?: string;
  decision_date?: string;
  authorized_by?: string;
  status: DisciplinaryStatus;
  confidentiality: 'অতি গোপনীয়';
  created_at: string;
  updated_at: string;
}

export type MeetingType = 'সাধারণ সভা' | 'জরুরি সভা' | 'মাসিক সমন্বয় সভা' | 'নাগরিক মতবিনিময় সভা';
export type MeetingStatus = 'নির্ধারিত' | 'চলমান' | 'সম্পন্ন' | 'স্থগিত';

export interface MeetingAgendaItem {
  id: string;
  title: string;
  description?: string;
  duration_minutes?: number;
}

export interface MeetingAttendance {
  member_id: string;
  member_name: string;
  status: 'উপস্থিত' | 'অনুপস্থিত' | 'ছুটি';
  remarks?: string;
}

export interface MeetingResolution {
  id: string;
  resolution_no: string;
  topic: string;
  decision: string;
  responsible_person: string;
  deadline?: string;
}

export interface Meeting {
  id: string;
  title: string;
  meeting_no: string;
  type: MeetingType;
  date: string;
  time: string;
  venue: string;
  is_virtual: boolean;
  virtual_link?: string;
  presided_by: string;
  recorded_by: string;
  status: MeetingStatus;
  is_public_announcement: boolean;
  public_summary?: string;
  agendas: MeetingAgendaItem[];
  attendees: MeetingAttendance[];
  resolutions: MeetingResolution[];
  minutes_bn?: string;
  minutes_approved: boolean;
  approved_by?: string;
  approved_at?: string;
  created_at: string;
}

export type TaskPriority = 'উচ্চ (High)' | 'মধ্যম (Medium)' | 'সাধারণ (Normal)';
export type TaskStatus = 'অপেক্ষমান' | 'চলমান' | 'পর্যালোচনাধীন' | 'সম্পন্ন' | 'বিলম্বিত';

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  assigned_to_name: string;
  assigned_to_id: string;
  priority: TaskPriority;
  start_date: string;
  due_date: string;
  status: TaskStatus;
  progress_percent: number;
  reviewer_name: string;
  completion_date?: string;
  updates: Array<{
    id: string;
    date: string;
    author: string;
    note: string;
    progress: number;
  }>;
  created_at: string;
}

export type CivicCategory =
  | 'সড়ক ও যোগাযোগ'
  | 'নিষ্কাশন ও জলাবদ্ধতা'
  | 'বর্জ্য ব্যবস্থাপনা'
  | 'জননিরাপত্তা ও আইন-শৃঙ্খলা'
  | 'শিক্ষা ও স্বাস্থ্য'
  | 'বিদ্যুৎ ও পানি সেবা'
  | 'অন্যান্য নাগরিক সমস্যা';

export type CivicStatus =
  | 'গৃহীত'
  | 'যাচাইাধীন'
  | 'মাঠ পর্যায়ে পর্যবেক্ষণ'
  | 'সংশ্লিষ্ট দপ্তরে প্রেরণ'
  | 'সমাধানকৃত'
  | 'অযৌক্তিক / বাতিল';

export interface CivicFeedbackItem {
  id: string;
  tracking_number: string;
  category: CivicCategory;
  ward: string;
  location_detail: string;
  title: string;
  description: string;
  citizen_name?: string;
  citizen_phone?: string;
  is_confidential: boolean;
  attachment_url?: string;
  status: CivicStatus;
  assigned_to?: string;
  internal_notes?: string;
  resolution_summary?: string;
  created_at: string;
  updated_at: string;
}

export interface ActivityReport {
  id: string;
  title: string;
  date: string;
  location: string;
  summary: string;
  details: string;
  image_url: string;
  gallery_urls?: string[];
  category: string;
  is_published: boolean;
  created_at: string;
}

export interface AuditLogItem {
  id: string;
  action: string;
  entity: string;
  record_id?: string;
  user_name: string;
  user_role: string;
  details: string;
  ip_address: string;
  timestamp: string;
}

export interface SiteSettings {
  org_name_bn: string;
  org_name_en: string;
  committee_name_bn: string;
  committee_name_en: string;
  area_bn: string;
  area_en: string;
  approval_date: string;
  term_months: number;
  term_status: string;
  member_secretary_name_bn: string;
  member_secretary_name_en: string;
  convener_name_bn: string;
  convener_name_en: string;
  office_address_bn: string;
  official_email: string;
  official_helpline: string;
  ref_prefix: string;
  logo_url: string;
  facebook_url?: string;
  disclaimer_bn: string;
}
