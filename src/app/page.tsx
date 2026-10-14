'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import OfficialDocumentPrint from '@/components/common/OfficialDocumentPrint';
import {
  getStoredNotices,
  getStoredMeetings,
  getStoredActivities,
  getStoredMembers,
} from '@/lib/storage';
import { Notice, Meeting, ActivityReport, CommitteeMember } from '@/types';
import { formatBengaliDate, toBengaliDigits, BAKALIA_WARDS } from '@/lib/constants';
import {
  FileText,
  Calendar,
  Users,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Clock,
  Printer,
  ChevronRight,
  Building2,
  AlertTriangle,
  Send,
  Eye,
} from 'lucide-react';

export default function HomePage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [activities, setActivities] = useState<ActivityReport[]>([]);
  const [members, setMembers] = useState<CommitteeMember[]>([]);
  const [selectedNoticeForPrint, setSelectedNoticeForPrint] = useState<Notice | null>(null);

  useEffect(() => {
    // Load published data only for public view
    const allNotices = getStoredNotices().filter((n) => n.is_public && n.status === 'প্রকাশিত');
    setNotices(allNotices.slice(0, 3));

    const allMeetings = getStoredMeetings().filter((m) => m.is_public_announcement);
    setMeetings(allMeetings.slice(0, 2));

    const allActivities = getStoredActivities().filter((a) => a.is_published);
    setActivities(allActivities.slice(0, 3));

    const allMembers = getStoredMembers().filter((m) => m.is_public && m.status === 'সক্রিয়');
    setMembers(allMembers.slice(0, 4));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F8F6]">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#075E3B] via-[#085235] to-[#043d26] text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Subtle geometric pattern background */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-8 space-y-6">
              {/* Committee Formation Badge */}
              <div className="inline-flex items-center gap-2 bg-emerald-950/70 border border-emerald-400/30 px-3.5 py-1.5 rounded-full text-xs font-semibold backdrop-blur-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E32636] animate-ping"></span>
                <span>অনুমোদনের তারিখ: ১৯ সেপ্টেম্বর ২০২৬</span>
                <span className="text-emerald-400">•</span>
                <span className="text-emerald-200">মেয়াদ: ৬ মাস (চলমান)</span>
              </div>

              {/* Main Heading */}
              <div className="space-y-2">
                <p className="text-emerald-300 font-bold text-sm md:text-base tracking-wide uppercase">
                  জাতীয় নাগরিক পার্টি (এনসিপি) • চট্টগ্রাম মহানগর
                </p>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
                  বাকলিয়া থানা আহ্বায়ক কমিটি
                </h1>
                <p className="text-emerald-100 text-sm md:text-lg max-w-2xl font-normal leading-relaxed pt-2">
                  জনগণের অধিকার প্রতিষ্ঠা, নাগরিক দুর্ভোগ নিরসন ও জবাবদিহিতামূলক সমাজ বিনির্মাণে বাকলিয়া থানা আহ্বায়ক কমিটির আনুষ্ঠানিক সমন্বয় ও নাগরিক পোর্টাল।
                </p>
              </div>

              {/* Official Key Role Box */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl max-w-xl flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-emerald-300 font-semibold uppercase block">
                    দায়িত্বপ্রাপ্ত সমন্বয়ক ও সদস্য সচিব
                  </span>
                  <span className="text-base md:text-lg font-bold text-white">
                    মোঃ আরিফ মাঈনুদ্দীন
                  </span>
                  <p className="text-xs text-emerald-200">
                    বাকলিয়া থানা আহ্বায়ক কমিটি, চট্টগ্রাম মহানগর
                  </p>
                </div>
                <div className="bg-[#E32636] text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
                  সদস্য সচিব দপ্তর
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/citizen-feedback"
                  className="bg-[#E32636] hover:bg-[#c91e2c] text-white font-bold px-6 py-3.5 rounded-xl text-sm shadow-lg hover:shadow-xl transition flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>নাগরিক সমস্যা ও মতামত জানান</span>
                </Link>
                <Link
                  href="/notices"
                  className="bg-white/15 hover:bg-white/25 text-white font-bold px-5 py-3.5 rounded-xl text-sm backdrop-blur-md border border-white/20 transition flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>অফিসিয়াল নোটিশ বোর্ড</span>
                </Link>
                <Link
                  href="/committee"
                  className="bg-emerald-950/60 hover:bg-emerald-950 text-emerald-200 font-semibold px-4 py-3.5 rounded-xl text-sm border border-emerald-700/50 transition flex items-center gap-1.5"
                >
                  <Users className="w-4 h-4" />
                  <span>কমিটি ডিরেক্টরি</span>
                </Link>
              </div>
            </div>

            {/* Right Quick Summary Card */}
            <div className="lg:col-span-4">
              <div className="bg-white text-[#17211B] p-6 rounded-2xl shadow-2xl border-t-4 border-[#075E3B] space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#075E3B]" />
                    <h3 className="font-bold text-base text-gray-900">কমিটি স্ট্যাটাস তথ্য</h3>
                  </div>
                  <span className="bg-emerald-100 text-[#075E3B] font-bold text-xs px-2.5 py-1 rounded-full">
                    সক্রিয়
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-500 font-medium">সংগঠন:</span>
                    <span className="font-bold text-gray-800">জাতীয় নাগরিক পার্টি (এনসিপি)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-500 font-medium">কমিটি:</span>
                    <span className="font-bold text-gray-800">বাকলিয়া থানা আহ্বায়ক কমিটি</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-500 font-medium">এলাকা:</span>
                    <span className="font-bold text-gray-800">বাকলিয়া, চট্টগ্রাম মহানগর</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-500 font-medium">অনুমোদনের তারিখ:</span>
                    <span className="font-bold text-[#075E3B]">১৯ সেপ্টেম্বর ২০২৬</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-500 font-medium">অনুমোদিত মেয়াদ:</span>
                    <span className="font-bold text-[#E32636]">৬ (ছয়) মাস</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-500 font-medium">সদস্য সচিব:</span>
                    <span className="font-bold text-gray-900">মোঃ আরিফ মাঈনুদ্দীন</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-500 font-medium">আওতাভুক্ত ওয়ার্ড:</span>
                    <span className="font-bold text-gray-800">১৭, ১৮ ও ১৯ নং ওয়ার্ড</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/citizen-feedback/track"
                    className="w-full bg-[#075E3B]/10 hover:bg-[#075E3B]/20 text-[#075E3B] font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>অভিযোগের অগ্রগতি ট্র্যাক করুন</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK METRICS & CIVIC COMMITMENT */}
      <section className="bg-white border-b border-gray-200 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div className="bg-[#F5F8F6] p-5 rounded-xl border border-[#075E3B]/10 text-center">
              <span className="text-2xl md:text-3xl font-extrabold text-[#075E3B] block">
                {toBengaliDigits(3)}টি
              </span>
              <span className="text-xs font-semibold text-gray-600 mt-1 block">
                আওতাধীন পৌর ওয়ার্ড (১৭, ১৮, ১৯)
              </span>
            </div>
            <div className="bg-[#F5F8F6] p-5 rounded-xl border border-[#075E3B]/10 text-center">
              <span className="text-2xl md:text-3xl font-extrabold text-[#075E3B] block">
                ১৯ সেপ ২০২৬
              </span>
              <span className="text-xs font-semibold text-gray-600 mt-1 block">
                বিধিবদ্ধ কমিটি অনুমোদন
              </span>
            </div>
            <div className="bg-[#F5F8F6] p-5 rounded-xl border border-[#075E3B]/10 text-center">
              <span className="text-2xl md:text-3xl font-extrabold text-[#E32636] block">
                {toBengaliDigits(6)} মাস
              </span>
              <span className="text-xs font-semibold text-gray-600 mt-1 block">
                প্রাথমিক সমন্বয় মেয়াদ
              </span>
            </div>
            <div className="bg-[#F5F8F6] p-5 rounded-xl border border-[#075E3B]/10 text-center">
              <span className="text-2xl md:text-3xl font-extrabold text-[#075E3B] block">
                ১০০%
              </span>
              <span className="text-xs font-semibold text-gray-600 mt-1 block">
                ডিজিটাল অডিট ও জবাবদিহিতা
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: LATEST OFFICIAL NOTICES */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#E32636] uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#E32636]"></span>
              <span>যাচাইকৃত তথ্য ও ঘোষণা</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#075E3B] mt-1">
              সাম্প্রতিক অফিসিয়াল নোটিশ
            </h2>
            <p className="text-xs md:text-sm text-gray-600 mt-1">
              বাকলিয়া থানা আহ্বায়ক কমিটির সদস্য সচিব ও আহ্বায়কের অনুমোদনে প্রকাশিত বিজ্ঞপ্তি।
            </p>
          </div>
          <Link
            href="/notices"
            className="text-xs md:text-sm font-bold text-[#075E3B] hover:text-[#13804A] flex items-center gap-1.5 transition"
          >
            <span>সকল নোটিশ দেখুন</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {notices.map((notice) => (
            <div
              key={notice.id}
              className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono bg-emerald-50 text-[#075E3B] px-2 py-0.5 rounded font-bold border border-emerald-200">
                    {notice.ref_number}
                  </span>
                  <span className="text-gray-500 font-medium">
                    {formatBengaliDate(notice.issue_date)}
                  </span>
                </div>

                <div className="inline-block bg-gray-100 text-gray-700 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                  {notice.category}
                </div>

                <h3 className="font-bold text-base text-gray-900 leading-snug hover:text-[#075E3B] transition">
                  {notice.title_bn}
                </h3>

                <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                  {notice.summary_bn}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[11px] text-gray-500">
                  স্বাক্ষর: <strong className="text-gray-800">{notice.issued_by}</strong>
                </span>
                <button
                  onClick={() => setSelectedNoticeForPrint(notice)}
                  className="text-xs font-bold text-[#075E3B] hover:bg-[#075E3B]/10 px-3 py-1.5 rounded-lg flex items-center gap-1 transition cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>বিস্তারিত ও প্রিন্ট</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION: CITIZEN FEEDBACK TEASER BANNER */}
      <section className="bg-gradient-to-r from-[#075E3B] to-[#13804A] text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-3">
            <span className="bg-[#E32636] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              নাগরিক অধিকার ও সেবা ডেস্ক
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold leading-tight">
              বাকলিয়ার স্থানীয় নাগরিক সমস্যা ও পরামর্শ সরাসরি জমা দিন
            </h2>
            <p className="text-xs md:text-sm text-emerald-100 max-w-2xl leading-relaxed">
              সড়ক সংস্কার, চাক্তাই-রাজাখালী খালের বর্জ্য ও জলাবদ্ধতা, ড্রেনেজ ব্যবস্থা, কিংবা নিরাপত্তা বিষয়ক যেকোনো অভিযোগ আমাদের দায়িত্বপ্রাপ্ত দলের নিকট পৌঁছে দিন। প্রতিটি অভিযোগের একটি অনন্য ট্র্যাকিং নম্বর দেওয়া হয়।
            </p>
            <div className="flex flex-wrap gap-2 pt-2 text-xs">
              <span className="bg-white/10 px-3 py-1 rounded-full">#১৭_নং_পশ্চিম_বাকলিয়া</span>
              <span className="bg-white/10 px-3 py-1 rounded-full">#১৮_নং_পূর্ব_বাকলিয়া</span>
              <span className="bg-white/10 px-3 py-1 rounded-full">#১৯_নং_দক্ষিণ_বাকলিয়া</span>
              <span className="bg-white/10 px-3 py-1 rounded-full">#চাক্তাই_ও_রাজাখালী</span>
            </div>
          </div>
          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
            <Link
              href="/citizen-feedback"
              className="w-full text-center bg-white hover:bg-emerald-50 text-[#075E3B] font-extrabold py-3.5 px-6 rounded-xl shadow-lg transition flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4 text-[#E32636]" />
              <span>মতামত / অভিযোগ ফরম খুলুন</span>
            </Link>
            <Link
              href="/citizen-feedback/track"
              className="w-full text-center bg-emerald-950/60 hover:bg-emerald-950 text-white font-bold py-3 px-6 rounded-xl border border-white/20 transition flex items-center justify-center gap-2 text-xs"
            >
              <span>পূর্বের ট্র্যাকিং কোড দিয়ে স্ট্যাটাস দেখুন</span>
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION: UPCOMING MEETINGS & ACTIVITIES */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Column: Meetings */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-[#075E3B]">সভা ও নাগরিক ফোরাম</h3>
                <p className="text-xs text-gray-500">অনুমোদিত প্রকাশ্য সভার তথ্য</p>
              </div>
              <Link href="/meetings" className="text-xs font-bold text-[#075E3B] hover:underline">
                সকল সভা
              </Link>
            </div>

            <div className="space-y-4">
              {meetings.map((m) => (
                <div
                  key={m.id}
                  className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-2 hover:border-[#075E3B]/40 transition"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#075E3B] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      {m.type}
                    </span>
                    <span className="text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      {formatBengaliDate(m.date)}
                    </span>
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm md:text-base leading-snug">
                    {m.title}
                  </h4>
                  <div className="text-xs text-gray-600 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span>{m.venue}</span>
                  </div>
                  {m.public_summary && (
                    <p className="text-xs text-gray-600 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                      {m.public_summary}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Recent Activities */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-[#075E3B]">সাম্প্রতিক সাংগঠনিক কার্যক্রম</h3>
                <p className="text-xs text-gray-500">বাকলিয়া থানা এলাকায় পরিচালিত উদ্যোগ</p>
              </div>
              <Link href="/activities" className="text-xs font-bold text-[#075E3B] hover:underline">
                সকল কার্যক্রম
              </Link>
            </div>

            <div className="space-y-4">
              {activities.map((act) => (
                <div
                  key={act.id}
                  className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-2 hover:border-[#075E3B]/40 transition"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-xs font-bold text-[#E32636] bg-red-50 px-2 py-0.5 rounded border border-red-100">
                      {act.category}
                    </span>
                    <span className="text-gray-500">{formatBengaliDate(act.date)}</span>
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm leading-snug">{act.title}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">{act.summary}</p>
                  <div className="text-[11px] text-gray-500 flex items-center gap-1.5 pt-1">
                    <MapPin className="w-3 h-3 text-[#075E3B]" />
                    <span>{act.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: COMMITTEE LEADERSHIP SPOTLIGHT */}
      <section className="bg-white py-14 px-4 sm:px-6 lg:px-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-bold text-[#075E3B] uppercase tracking-wider">
              সাংগঠনিক কাঠামো
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">
              বাকলিয়া থানা আহ্বায়ক কমিটির নেতৃত্ব
            </h2>
            <p className="text-xs md:text-sm text-gray-600">
              ১৯ সেপ্টেম্বর ২০২৬ তারিখে অনুমোদিত সমন্বয়ক পর্ষদের সদস্যবৃন্দ।
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {members.map((member) => (
              <div
                key={member.id}
                className="bg-[#F5F8F6] p-5 rounded-2xl border border-gray-200 text-center space-y-3 hover:shadow-sm transition"
              >
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-[#075E3B] to-[#13804A] flex items-center justify-center text-white font-bold text-xl border-4 border-white shadow-xs">
                  {member.name_bn.slice(0, 1)}
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 text-sm md:text-base">
                    {member.name_bn}
                  </h3>
                  <p className="text-xs font-bold text-[#075E3B] mt-0.5">{member.position_bn}</p>
                  <p className="text-[11px] text-gray-500 font-medium">{member.ward_no}</p>
                </div>

                <div className="pt-2 border-t border-gray-200 text-xs">
                  <span className="inline-block bg-white text-gray-700 px-3 py-1 rounded-full border border-gray-200 font-semibold text-[11px]">
                    মেয়াদ: ১৯ সেপ ২০২৬ হতে
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/committee"
              className="inline-flex items-center gap-2 bg-[#075E3B] hover:bg-[#064E31] text-white font-bold px-6 py-3 rounded-xl text-xs md:text-sm shadow-xs transition"
            >
              <span>সম্পূর্ণ কমিটি ডিরেক্টরি দেখুন</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* PRINT PREVIEW MODAL */}
      {selectedNoticeForPrint && (
        <OfficialDocumentPrint
          documentType="নোটিশ"
          refNumber={selectedNoticeForPrint.ref_number}
          date={selectedNoticeForPrint.issue_date}
          subject={selectedNoticeForPrint.title_bn}
          bodyContent={selectedNoticeForPrint.body_bn}
          signatoryLeft={{
            name: selectedNoticeForPrint.issued_by,
            designation: `${selectedNoticeForPrint.issued_by_role}\nবাকলিয়া থানা আহ্বায়ক কমিটি`,
          }}
          onClose={() => setSelectedNoticeForPrint(null)}
        />
      )}

      <Footer />
    </div>
  );
}
