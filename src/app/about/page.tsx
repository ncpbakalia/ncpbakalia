'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import {
  ShieldCheck,
  Calendar,
  Users,
  Target,
  FileCheck2,
  Building,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Mail,
  Phone,
} from 'lucide-react';
import { BAKALIA_WARDS } from '@/lib/constants';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F8F6]">
      <Navbar />

      {/* Header Banner */}
      <section className="bg-gradient-to-r from-[#075E3B] to-[#13804A] text-white py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-xs">
            <span className="w-2 h-2 rounded-full bg-[#E32636]"></span>
            <span>প্রাতিষ্ঠানিক পরিচিতি ও ম্যান্ডেট</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold">
            জাতীয় নাগরিক পার্টি (এনসিপি) — বাকলিয়া থানা আহ্বায়ক কমিটি
          </h1>
          <p className="text-emerald-100 text-sm md:text-base max-w-3xl leading-relaxed">
            চট্টগ্রাম মহানগরীর বাকলিয়া থানায় সমতা, মানবিক মর্যাদা ও নাগরিক অধিকার প্রতিষ্ঠার সুনির্দিষ্ট লক্ষ্য নিয়ে গঠিত অন্তর্বর্তী আহ্বায়ক কমিটির ভূমিকা ও কর্মপরিধি।
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 space-y-12">
        {/* Committee Formation & Approval Block */}
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 shadow-xs">
          <div className="flex items-center gap-3 border-b pb-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#075E3B] flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                কমিটি অনুমোদন ও মেয়াদ সংক্রান্ত তথ্য
              </h2>
              <p className="text-xs text-gray-500">
                বিধিবদ্ধ প্রাতিষ্ঠানিক রেকর্ড ও সিদ্ধান্ত
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#F5F8F6] p-5 rounded-xl border border-gray-200">
              <span className="text-xs text-gray-500 block">অনুমোদনের তারিখ</span>
              <span className="text-lg font-bold text-[#075E3B] mt-1 block">
                ১৯ সেপ্টেম্বর ২০২৬
              </span>
              <p className="text-xs text-gray-600 mt-2">
                কেন্দ্রীয় ও মহানগর সমন্বয়ক পর্ষদের অনুমোদনে কার্যকর হয়েছে।
              </p>
            </div>

            <div className="bg-[#F5F8F6] p-5 rounded-xl border border-gray-200">
              <span className="text-xs text-gray-500 block">কার্যকাল ও স্থায়িত্ব</span>
              <span className="text-lg font-bold text-[#E32636] mt-1 block">
                ৬ (ছয়) মাস প্রাথমিক মেয়াদ
              </span>
              <p className="text-xs text-gray-600 mt-2">
                বিধিবদ্ধ মেয়াদ শেষে সাংগঠনিক মূল্যায়নে নবায়ন বা পূর্ণাঙ্গ কমিটি গঠিত হবে।
              </p>
            </div>

            <div className="bg-[#F5F8F6] p-5 rounded-xl border border-gray-200">
              <span className="text-xs text-gray-500 block">প্রধান নির্বাহী সমন্বয়</span>
              <span className="text-lg font-bold text-gray-900 mt-1 block">
                মোঃ আরিফ মাঈনুদ্দীন
              </span>
              <p className="text-xs text-gray-600 mt-2">
                সদস্য সচিব, বাকলিয়া থানা আহ্বায়ক কমিটি, চট্টগ্রাম মহানগর।
              </p>
            </div>
          </div>
        </div>

        {/* Mandate & Scope */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#075E3B] flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">প্রাতিষ্ঠানিক ম্যান্ডেট ও লক্ষ্য</h2>
            </div>
            <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
              জাতীয় নাগরিক পার্টির কেন্দ্রীয় ঘোষণার আলোকে বাকলিয়া থানা আহ্বায়ক কমিটির মূল উদ্দেশ্য হলো ১৭, ১৮ ও ১৯ নং ওয়ার্ডে গণতান্ত্রিক ও নাগরিক সচেতনতা বৃদ্ধি করা।
            </p>
            <ul className="space-y-3 text-xs md:text-sm text-gray-700">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#075E3B] shrink-0 mt-0.5" />
                <span>
                  <strong>ওয়ার্ড ভিত্তিক পুনর্গঠন:</strong> তৃণমূল পর্যায়ে স্বচ্ছ প্রক্রিয়ায় নাগরিক ফোরাম গঠন ও সদস্য তালিকা প্রণয়ন।
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#075E3B] shrink-0 mt-0.5" />
                <span>
                  <strong>স্থানীয় সমস্যা চিহ্নিতকরণ:</strong> বাকলিয়ার জলাবদ্ধতা, রাস্তাঘাটের ভাঙন ও ড্রেনেজ সমস্যা সমাধানে যথাযথ কর্তৃপক্ষের কাছে নাগরিক দাবি উপস্থাপন।
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#075E3B] shrink-0 mt-0.5" />
                <span>
                  <strong>সামাজিক ন্যায়বিচার ও নিরাপত্তা:</strong> মাদক ও অপরাধমুক্ত পরিবেশ বজায় রাখতে স্থানীয় প্রশাসন ও সাধারণ নাগরিকদের সেতুবন্ধন হিসেবে কাজ করা।
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-[#E32636] flex items-center justify-center">
                <Building className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">আওতাভুক্ত ভৌগোলিক অঞ্চল</h2>
            </div>
            <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
              চট্টগ্রাম সিটি কর্পোরেশনের গুরুত্বপূর্ণ আবাসিক ও প্রাচীন বাণিজ্যিক কেন্দ্রের সমন্বয়ে গঠিত বাকলিয়া থানা:
            </p>
            <div className="space-y-2">
              {BAKALIA_WARDS.map((ward) => (
                <div
                  key={ward.id}
                  className="bg-[#F5F8F6] p-3 rounded-lg border border-gray-100 flex items-center justify-between text-xs"
                >
                  <span className="font-semibold text-gray-800">{ward.name_bn}</span>
                  <span className="text-gray-400 font-mono text-[11px]">{ward.name_en}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Accountability & Transparency Guidelines */}
        <div className="bg-emerald-950 text-white rounded-2xl p-8 space-y-4">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase">
            <ShieldCheck className="w-4 h-4" />
            <span>জবাবদিহিতা ও সাংগঠনিক শৃঙ্খলা</span>
          </div>
          <h3 className="text-xl font-bold">
            স্বচ্ছতা, প্রাতিষ্ঠানিক অনুমোদন ও গোপনীয়তা নীতি
          </h3>
          <p className="text-xs md:text-sm text-emerald-100 leading-relaxed max-w-3xl">
            বাকলিয়া থানা আহ্বায়ক কমিটির কোনো সদস্য ব্যক্তিগত স্বার্থে দলীয় পদবি ব্যবহার করতে পারবে না। যেকোনো লিখিত নোটিশ, অর্থসংক্রান্ত বিষয়, বা বহিঃযোগাযোগে সদস্য সচিব ও আহ্বায়কের বিধিবদ্ধ অনুমোদন বাধ্যতামূলক। শৃঙ্খলাভঙ্গ সংক্রান্ত যেকোনো অভিযোগ অভ্যন্তরীণ তদন্ত সেলের মাধ্যমে সর্বোচ্চ গোপনীয়তার সাথে যাচাই করা হয়।
          </p>
          <div className="pt-2">
            <Link
              href="/committee"
              className="inline-flex items-center gap-2 bg-[#E32636] hover:bg-[#c91e2c] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition"
            >
              <span>কমিটি ডিরেক্টরি দেখুন</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
