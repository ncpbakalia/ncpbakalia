'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { getStoredMeetings } from '@/lib/storage';
import { Meeting } from '@/types';
import { formatBengaliDate } from '@/lib/constants';
import { useAuth } from '@/lib/auth-context';
import {
  CalendarDays,
  MapPin,
  Clock,
  ShieldLock,
  CheckCircle2,
  Lock,
  ExternalLink,
  Users,
  FileSpreadsheet,
} from 'lucide-react';

export default function PublicMeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'public' | 'internal'>('public');

  useEffect(() => {
    setMeetings(getStoredMeetings());
  }, []);

  const publicMeetings = meetings.filter((m) => m.is_public_announcement);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F8F6]">
      <Navbar />

      <section className="bg-gradient-to-r from-[#075E3B] to-[#13804A] text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold">
            <CalendarDays className="w-3.5 h-3.5" />
            <span>সভা ও সমন্বয় পর্ষদ</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold">
            বাকলিয়া থানা আহ্বায়ক কমিটির সভা ও কার্যবিবরণী
          </h1>
          <p className="text-emerald-100 text-xs md:text-sm max-w-2xl">
            সাধারণ নাগরিক মতবিনিময় সভার সূচি এবং কমিটির অভ্যন্তরীণ প্রাতিষ্ঠানিক সমন্বয় সভার কার্যবিবরণী।
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-8">
        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('public')}
            className={`py-3 px-6 text-sm font-bold border-b-2 transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'public'
                ? 'border-[#075E3B] text-[#075E3B]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            <span>প্রকাশ্য নাগরিক সভা ও ঘোষণা</span>
          </button>
          <button
            onClick={() => setActiveTab('internal')}
            className={`py-3 px-6 text-sm font-bold border-b-2 transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'internal'
                ? 'border-[#075E3B] text-[#075E3B]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <ShieldLock className="w-4 h-4" />
            <span>অভ্যন্তরীণ কার্যবিবরণী ও রেজুলেশন (কমিটি)</span>
          </button>
        </div>

        {/* Tab 1: Public Meetings */}
        {activeTab === 'public' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {publicMeetings.map((m) => (
                <div
                  key={m.id}
                  className="bg-white rounded-2xl p-6 border border-gray-200 shadow-2xs space-y-4 hover:border-[#075E3B]/40 transition"
                >
                  <div className="flex items-center justify-between border-b pb-3">
                    <span className="text-xs font-bold text-[#075E3B] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      {m.type}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">
                      সভা নং: {m.meeting_no}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 leading-snug">{m.title}</h3>

                  <div className="space-y-2 text-xs text-gray-600 bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-4 h-4 text-[#075E3B]" />
                      <span>
                        তারিখ: <strong>{formatBengaliDate(m.date)}</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#075E3B]" />
                      <span>সময়: {m.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#075E3B]" />
                      <span>স্থান: {m.venue}</span>
                    </div>
                  </div>

                  {m.public_summary && (
                    <p className="text-xs text-gray-600 leading-relaxed pt-1">
                      {m.public_summary}
                    </p>
                  )}

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                    <span>
                      সভাপতি: <strong>{m.presided_by}</strong>
                    </span>
                    <span className="text-emerald-700 bg-emerald-50 font-bold px-2 py-0.5 rounded text-[11px]">
                      {m.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Internal Committee Minutes */}
        {activeTab === 'internal' && (
          <div className="space-y-6">
            {!user ? (
              <div className="bg-white rounded-2xl p-10 text-center max-w-xl mx-auto border border-gray-200 shadow-sm space-y-4">
                <div className="w-14 h-14 mx-auto rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Lock className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  অভ্যন্তরীণ সংরক্ষিত কার্যবিবরণী
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  কমিটির বিস্তারিত উপস্থিতি রেজিস্টার, অভ্যন্তরীণ রেজুলেশন ও প্রস্তাবনাসমূহ কেবলমাত্র অনুমোদিত কমিটির সদস্যদের জন্য সংরক্ষিত। অনুগ্রহ করে আপনার অ্যাকাউন্ট দিয়ে প্রবেশ করুন।
                </p>
                <Link
                  href="/admin/login"
                  className="inline-flex items-center gap-2 bg-[#075E3B] hover:bg-[#064E31] text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-xs transition"
                >
                  <ShieldLock className="w-4 h-4" />
                  <span>কমিটি পোর্টালে লগইন করুন</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-xs text-emerald-900 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-[#075E3B]" />
                    <span>
                      আপনি <strong>{user.name}</strong> ({user.position_bn}) হিসেবে অভ্যন্তরীণ রেকর্ডসমূহ পর্যালোচনা করছেন।
                    </span>
                  </div>
                  <Link
                    href="/admin/meetings"
                    className="text-xs font-bold text-[#075E3B] bg-white px-3 py-1.5 rounded-lg border border-emerald-300 hover:bg-emerald-100 flex items-center gap-1"
                  >
                    <span>অ্যাডমিন ম্যানেজমেন্ট খুলুন</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="space-y-4">
                  {meetings.map((m) => (
                    <div
                      key={m.id}
                      className="bg-white rounded-2xl p-6 border border-gray-200 space-y-4 shadow-2xs"
                    >
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b pb-3">
                        <div>
                          <span className="font-mono text-xs font-bold text-[#075E3B]">
                            {m.meeting_no}
                          </span>
                          <h4 className="text-base font-bold text-gray-900">{m.title}</h4>
                        </div>
                        <span className="text-xs text-gray-500">
                          {formatBengaliDate(m.date)} • {m.venue}
                        </span>
                      </div>

                      {/* Agendas */}
                      <div>
                        <h5 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                          আলোচ্যসূচি (Agendas):
                        </h5>
                        <ul className="list-decimal list-inside text-xs text-gray-600 space-y-1">
                          {m.agendas.map((ag) => (
                            <li key={ag.id}>{ag.title}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Resolutions if approved */}
                      {m.resolutions && m.resolutions.length > 0 && (
                        <div className="bg-[#F5F8F6] p-4 rounded-xl border border-gray-200">
                          <h5 className="text-xs font-bold text-[#075E3B] uppercase tracking-wider mb-2">
                            গৃহীত সিদ্ধান্ত ও রেজুলেশন:
                          </h5>
                          <div className="space-y-2">
                            {m.resolutions.map((res) => (
                              <div
                                key={res.id}
                                className="text-xs bg-white p-3 rounded-lg border border-gray-200 space-y-1"
                              >
                                <div className="flex justify-between font-bold text-gray-800">
                                  <span>{res.topic}</span>
                                  <span className="font-mono text-emerald-800">
                                    {res.resolution_no}
                                  </span>
                                </div>
                                <p className="text-gray-600">{res.decision}</p>
                                <div className="text-[11px] text-gray-500 pt-1 flex justify-between">
                                  <span>দায়িত্বপ্রাপ্ত: {res.responsible_person}</span>
                                  <span>সময়সীমা: {res.deadline || 'জরুরি'}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="pt-2 text-xs text-gray-500 flex justify-between">
                        <span>কার্যবিবরণী লিপিবদ্ধকারী: {m.recorded_by}</span>
                        <span className="text-emerald-700 font-bold">
                          {m.minutes_approved ? 'অনুমোদিত কার্যবিবরণী' : 'অনুমোদনাধীন'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
