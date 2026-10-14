import { SiteSettings } from '@/types';

export const INITIAL_SITE_SETTINGS: SiteSettings = {
  org_name_bn: 'জাতীয় নাগরিক পার্টি (এনসিপি)',
  org_name_en: 'National Citizen Party (NCP)',
  committee_name_bn: 'বাকলিয়া থানা আহ্বায়ক কমিটি',
  committee_name_en: 'Bakalia Thana Convening Committee',
  area_bn: 'বাকলিয়া, চট্টগ্রাম মহানগর, বাংলাদেশ',
  area_en: 'Bakalia, Chattogram Metropolitan, Bangladesh',
  approval_date: '2026-09-19',
  term_months: 6,
  term_status: 'চলমান মেয়াদ (Active Term)',
  member_secretary_name_bn: 'মোঃ আরিফ মাঈনুদ্দীন',
  member_secretary_name_en: 'Md. Arif Mainuddin',
  convener_name_bn: 'মোহাম্মদ রাশেদুল ইসলাম (ভারপ্রাপ্ত/প্রস্তাবিত)',
  convener_name_en: 'Mohammad Rashedul Islam',
  office_address_bn: 'বাকলিয়া থানা কার্যালয়, চট্টগ্রাম মহানগর (প্রশাসনিক অনুমোদনে নির্ধারিত)',
  official_email: 'contact@ncp-bakalia.org',
  official_helpline: '+880 1800-000000',
  ref_prefix: 'NCP/BAKALIA/2026/',
  logo_url: '/logo-placeholder.svg',
  facebook_url: 'https://facebook.com',
  disclaimer_bn:
    'এই পোর্টালটি জাতীয় নাগরিক পার্টি (এনসিপি) বাকলিয়া থানা আহ্বায়ক কমিটির একটি প্রাতিষ্ঠানিক অভ্যন্তরীণ ও জনসম্পর্ক পোর্টাল। যেকোনো প্রাতিষ্ঠানিক নোটিশ ও সিদ্ধান্ত কেবল অনুমোদিত কর্তৃপক্ষের স্বাক্ষরে কার্যকর হবে।',
};

export const BAKALIA_WARDS = [
  { id: 'ward-17', name_bn: '১৭ নং পশ্চিম বাকলিয়া ওয়ার্ড', name_en: 'Ward 17 - West Bakalia' },
  { id: 'ward-18', name_bn: '১৮ নং পূর্ব বাকলিয়া ওয়ার্ড', name_en: 'Ward 18 - East Bakalia' },
  { id: 'ward-19', name_bn: '১৯ নং দক্ষিণ বাকলিয়া ওয়ার্ড', name_en: 'Ward 19 - South Bakalia' },
  { id: 'area-chaktai', name_bn: 'চাক্তাই বাণিজ্যিক এলাকা ও খাল সংলগ্ন অঞ্চল', name_en: 'Chaktai Commercial Area' },
  { id: 'area-rajakhali', name_bn: 'রাজাখালী ও কর্ণফুলী বেড়িবাঁধ অঞ্চল', name_en: 'Rajakhali & Embankment' },
  { id: 'area-kalamian', name_bn: 'কালামিয়া বাজার ও শাহ আমানত সেতু সংযোগ', name_en: 'Kalamia Bazar & Bridge Link' },
];

export const CIVIC_ISSUE_CATEGORIES = [
  'সড়ক ও যোগাযোগ',
  'নিষ্কাশন ও জলাবদ্ধতা',
  'বর্জ্য ব্যবস্থাপনা',
  'জননিরাপত্তা ও আইন-শৃঙ্খলা',
  'শিক্ষা ও স্বাস্থ্য',
  'বিদ্যুৎ ও পানি সেবা',
  'অন্যান্য নাগরিক সমস্যা',
] as const;

export const NAV_LINKS = [
  { href: '/', label_bn: 'মূলপাতা', label_en: 'Home' },
  { href: '/about', label_bn: 'পরিচিতি ও ম্যান্ডেট', label_en: 'About' },
  { href: '/committee', label_bn: 'কমিটি ডিরেক্টরি', label_en: 'Committee' },
  { href: '/notices', label_bn: 'অফিসিয়াল নোটিশ', label_en: 'Notices' },
  { href: '/activities', label_bn: 'কার্যক্রম ও রিপোর্ট', label_en: 'Activities' },
  { href: '/meetings', label_bn: 'সভা ও কার্যবিবরণী', label_en: 'Meetings' },
  { href: '/citizen-feedback', label_bn: 'নাগরিক সেবা ও মতামত', label_en: 'Citizen Feedback' },
  { href: '/contact', label_bn: 'যোগাযোগ', label_en: 'Contact' },
];

export const ADMIN_NAV_LINKS = [
  { href: '/admin', label: 'ড্যাশবোর্ড ওভারভিউ', icon: 'LayoutDashboard' },
  { href: '/admin/committee', label: 'কমিটি ব্যবস্থাপনা', icon: 'Users' },
  { href: '/admin/notices', label: 'নোটিশ ব্যবস্থাপনা', icon: 'FileText' },
  { href: '/admin/correspondence', label: 'পত্র আদান-প্রদান রেজিস্টার', icon: 'MailCheck' },
  { href: '/admin/disciplinary', label: 'শৃঙ্খলা ও তদন্ত সেল', icon: 'ShieldAlert', restricted: true },
  { href: '/admin/meetings', label: 'সভা ও কার্যবিবরণী', icon: 'CalendarDays' },
  { href: '/admin/tasks', label: 'সাংগঠনিক দায়িত্ব/টাস্ক', icon: 'CheckSquare' },
  { href: '/admin/civic-issues', label: 'নাগরিক সমস্যা নিষ্পত্তি', icon: 'MessageSquareWarning' },
  { href: '/admin/reports', label: 'রিপোর্ট ও রফতানি', icon: 'BarChart3' },
  { href: '/admin/audit-logs', label: 'অডিট লগ', icon: 'History' },
  { href: '/admin/settings', label: 'সিস্টেম সেটিংস', icon: 'Settings' },
];

// Bengali number translation
export function toBengaliDigits(input: string | number): string {
  const bengaliNumbers = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(input).replace(/[0-9]/g, (digit) => bengaliNumbers[parseInt(digit, 10)]);
}

// Bengali date formatting helper
export function formatBengaliDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    const months = [
      'জানুয়ারি',
      'ফেব্রুয়ারি',
      'মার্চ',
      'এপ্রিল',
      'মে',
      'জুন',
      'জুলাই',
      'আগস্ট',
      'সেপ্টেম্বর',
      'অক্টোবর',
      'নভেম্বর',
      'ডিসেম্বর',
    ];
    const day = toBengaliDigits(d.getDate());
    const month = months[d.getMonth()];
    const year = toBengaliDigits(d.getFullYear());
    return `${day} ${month} ${year}`;
  } catch {
    return dateStr;
  }
}
