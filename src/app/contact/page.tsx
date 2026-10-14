'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import {
  MapPin,
  Mail,
  Phone,
  Clock,
  Send,
  CheckCircle2,
  AlertTriangle,
  Building,
} from 'lucide-react';
import { BAKALIA_WARDS } from '@/lib/constants';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F8F6]">
      <Navbar />

      <section className="bg-gradient-to-r from-[#075E3B] to-[#13804A] text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold">
            <Phone className="w-3.5 h-3.5" />
            <span>অফিসিয়াল যোগাযোগ</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold">
            যোগাযোগ ও দপ্তর সংক্রান্ত তথ্য
          </h1>
          <p className="text-emerald-100 text-xs md:text-sm max-w-2xl">
            বাকলিয়া থানা আহ্বায়ক কমিটির সমন্বয় দপ্তর, অফিসিয়াল হেল্পলাইন ও সাধারণ যোগাযোগ চ্যানেল।
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Official Contact Channels */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
              <h2 className="text-lg font-bold text-gray-900 border-b pb-3">
                অনুমোদিত প্রাতিষ্ঠানিক ঠিকানা
              </h2>

              <div className="space-y-4 text-xs md:text-sm text-gray-700">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#075E3B] flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-gray-900 block">দপ্তর কার্যালয়</span>
                    <p className="text-gray-600 mt-0.5">
                      বাকলিয়া সমন্বয় কার্যালয়, চট্টগ্রাম মহানগর, বাংলাদেশ। (পূর্ণাঙ্গ প্রশাসনিক দপ্তর প্রক্রিয়াধীন)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#075E3B] flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-gray-900 block">অফিসিয়াল ইমেইল</span>
                    <p className="text-gray-600 mt-0.5 font-mono">contact@ncp-bakalia.org</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#075E3B] flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-gray-900 block">প্রাতিষ্ঠানিক হেল্পলাইন</span>
                    <p className="text-gray-600 mt-0.5 font-mono">+880 1800-000000</p>
                    <span className="text-[10px] text-gray-400 block mt-0.5">
                      সকাল ১০:০০ হতে সন্ধ্যা ০৭:০০ ঘটিকা পর্যন্ত
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Wards list box */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Building className="w-4 h-4 text-[#075E3B]" />
                <span>আওতাভুক্ত ওয়ার্ড প্রতিনিধি সমন্বয়</span>
              </h3>
              <p className="text-xs text-gray-500">
                ওয়ার্ডভিত্তিক যোগাযোগের জন্য আমাদের সিটিজেন ফিডব্যাক ফর্মের মাধ্যমে বার্তা প্রেরণের অনুরোধ করা হচ্ছে।
              </p>
              <div className="space-y-1.5 pt-1 text-xs">
                {BAKALIA_WARDS.map((w) => (
                  <div
                    key={w.id}
                    className="bg-[#F5F8F6] p-2 rounded-lg border border-gray-100 flex justify-between"
                  >
                    <span className="font-medium text-gray-800">{w.name_bn}</span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                      সক্রিয়
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Contact Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-xs space-y-6">
              <div className="border-b pb-3">
                <h2 className="text-lg font-bold text-gray-900">সাধারণ বার্তা প্রেরণ করুন</h2>
                <p className="text-xs text-gray-500">
                  সংগঠন সংক্রান্ত যেকোনো পরামর্শ বা অফিশিয়াল অনুসন্ধান এখানে দাখিল করতে পারেন।
                </p>
              </div>

              {submitted ? (
                <div className="bg-emerald-50 border border-emerald-200 p-8 rounded-2xl text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-[#075E3B] mx-auto" />
                  <h3 className="text-lg font-bold text-gray-900">আপনার বার্তা গৃহীত হয়েছে</h3>
                  <p className="text-xs text-gray-600 max-w-md mx-auto">
                    ধন্যবাদ। সদস্য সচিব দপ্তরের সমন্বয়ক দল আপনার বার্তা পর্যালোচনা করে প্রয়োজনবোধে যোগাযোগ করবেন।
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-xs font-bold text-[#075E3B] hover:underline pt-2 cursor-pointer"
                  >
                    আরেকটি বার্তা পাঠান
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700">আপনার নাম *</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="আপনার পূর্ণ নাম"
                        className="w-full bg-[#F5F8F6] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-hidden focus:border-[#075E3B]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700">ইমেইল / মোবাইল নম্বর *</label>
                      <input
                        type="text"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="যোগাযোগের নম্বর বা ইমেইল"
                        className="w-full bg-[#F5F8F6] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-hidden focus:border-[#075E3B]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">বিষয় *</label>
                    <input
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="বার্তার মূল বিষয়বস্তু"
                      className="w-full bg-[#F5F8F6] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-hidden focus:border-[#075E3B]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">বিস্তারিত বার্তা *</label>
                    <textarea
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="আপনার বার্তা লিখুন..."
                      className="w-full bg-[#F5F8F6] border border-gray-200 rounded-xl p-3.5 text-xs focus:outline-hidden focus:border-[#075E3B]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#075E3B] hover:bg-[#064E31] text-white font-bold py-3 px-6 rounded-xl text-xs md:text-sm shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>বার্তা প্রেরণ করুন</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
