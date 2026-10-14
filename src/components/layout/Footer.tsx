import React from 'react';
import Link from 'next/link';
import { BAKALIA_WARDS } from '@/lib/constants';
import { Shield, MapPin, Mail, Phone, Calendar, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#17211B] text-gray-300 mt-auto border-t border-[#075E3B]/40">
      {/* Top Banner inside Footer */}
      <div className="bg-[#075E3B] text-white py-4 px-4 sm:px-6 lg:px-8 border-b border-emerald-900">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#E32636] flex items-center justify-center font-bold text-white shadow-xs">
              ★
            </div>
            <div>
              <p className="font-bold text-base">
                বাকলিয়া থানা আহ্বায়ক কমিটি • চট্টগ্রাম মহানগর
              </p>
              <p className="text-xs text-emerald-100">
                অনুমোদনের তারিখ: ১৯ সেপ্টেম্বর ২০২৬ | সদস্য সচিব: মোঃ আরিফ মাঈনুদ্দীন
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-[#13804A] text-white text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1.5 border border-emerald-400/30">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
              <span>প্রাতিষ্ঠানিক মেয়াদ: ৬ মাস (চলমান)</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Organization About */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#075E3B] flex items-center justify-center text-white font-bold text-sm border border-emerald-600">
                NCP
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">জাতীয় নাগরিক পার্টি</h3>
                <p className="text-xs text-emerald-400">বাকলিয়া থানা আহ্বায়ক কমিটি</p>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-gray-400">
              চট্টগ্রাম মহানগরীর বাকলিয়া থানা এলাকার সাধারণ নাগরিকদের অধিকার প্রতিষ্ঠা, সুশাসন, নাগরিক সমস্যা সমাধান এবং সংগঠনিক পুনর্গঠনের লক্ষ্যে গঠিত আহ্বায়ক কমিটি।
            </p>
            <div className="text-xs text-gray-400 space-y-1 pt-2">
              <p className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                <span>অনুমোদন: ১৯ সেপ্টেম্বর ২০২৬</span>
              </p>
              <p className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>দায়িত্বপ্রাপ্ত সদস্য সচিব: মোঃ আরিফ মাঈনুদ্দীন</span>
              </p>
            </div>
          </div>

          {/* Column 2: Ward Areas */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white border-b border-gray-700 pb-2">
              আওতাধীন এলাকা ও ওয়ার্ড
            </h4>
            <ul className="space-y-2 text-xs">
              {BAKALIA_WARDS.map((ward) => (
                <li key={ward.id} className="text-gray-400 hover:text-emerald-300 transition">
                  • {ward.name_bn}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white border-b border-gray-700 pb-2">
              গুরুত্বপূর্ণ লিঙ্কসমূহ
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/about" className="hover:text-emerald-400 transition">
                  কমিটি পরিচিতি ও ম্যান্ডেট
                </Link>
              </li>
              <li>
                <Link href="/committee" className="hover:text-emerald-400 transition">
                  সদস্য ডিরেক্টরি
                </Link>
              </li>
              <li>
                <Link href="/notices" className="hover:text-emerald-400 transition">
                  অফিসিয়াল নোটিশ বোর্ড
                </Link>
              </li>
              <li>
                <Link href="/meetings" className="hover:text-emerald-400 transition">
                  কার্যবিবরণী ও সভার সূচি
                </Link>
              </li>
              <li>
                <Link href="/citizen-feedback" className="hover:text-emerald-400 transition">
                  নাগরিক সমস্যা ও মতামত সাবমিশন
                </Link>
              </li>
              <li>
                <Link href="/citizen-feedback/track" className="hover:text-emerald-400 transition text-emerald-400 font-semibold">
                  অভিযোগের অগ্রগতি ট্র্যাক করুন
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Disclaimer */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white border-b border-gray-700 pb-2">
              অফিসিয়াল যোগাযোগ ও তথ্য
            </h4>
            <div className="space-y-2 text-xs text-gray-400">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>বাকলিয়া, চট্টগ্রাম মহানগর, বাংলাদেশ</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>contact@ncp-bakalia.org</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>হেল্পলাইন: +880 1800-000000</span>
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 text-xs bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-700/50 px-3 py-1.5 rounded transition"
              >
                <Shield className="w-3.5 h-3.5 text-[#E32636]" />
                <span>প্রশাসনিক অভ্যন্তরীণ লগইন</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Disclaimer & Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-gray-800 text-xs text-gray-400 space-y-2">
          <p className="bg-gray-900/80 p-3 rounded-lg border border-gray-800 text-[11px] leading-relaxed">
            <span className="text-emerald-400 font-semibold">গুরুত্বপূর্ণ সতর্কতা:</span> এই পোর্টালটি বাকলিয়া থানা আহ্বায়ক কমিটির অভ্যন্তরীণ প্রশাসন ও নাগরিক সমন্বয়ের জন্য পরিচালিত। কোনো ব্যক্তি বা অননুমোদিত ফোরামের নিজস্ব বিবৃতি বা সিদ্ধান্ত দলের আনুষ্ঠানিক সিদ্ধান্ত হিসেবে গণ্য হবে না। প্রকাশিত সকল নোটিশ ও কার্যবিবরণী সদস্য সচিব ও আহ্বায়কের বিধিবদ্ধ অনুমোদন সাপেক্ষে প্রযোজ্য।
          </p>
          <div className="flex flex-col md:flex-row justify-between items-center pt-2 text-[11px]">
            <p>© ২০২৬ জাতীয় নাগরিক পার্টি (এনসিপি) - বাকলিয়া থানা আহ্বায়ক কমিটি। সর্বস্বত্ব সংরক্ষিত।</p>
            <p className="text-gray-400">ডিজিটাল সাংগঠনিক গভর্নেন্স ও নাগরিক সেবা সিস্টেম</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
