'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { getStoredFeedback } from '@/lib/storage';
import { CivicFeedbackItem } from '@/types';
import { formatBengaliDate } from '@/lib/constants';
import {
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  Building2,
  FileText,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export default function TrackFeedbackPage() {
  const [trackingInput, setTrackingInput] = useState('');
  const [result, setResult] = useState<CivicFeedbackItem | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingInput.trim()) return;

    const all = getStoredFeedback();
    const found = all.find(
      (item) =>
        item.tracking_number.toLowerCase().trim() ===
        trackingInput.toLowerCase().trim()
    );
    setResult(found || null);
    setHasSearched(true);
  };

  const handleQuickDemo = (code: string) => {
    setTrackingInput(code);
    const all = getStoredFeedback();
    const found = all.find((item) => item.tracking_number === code);
    setResult(found || null);
    setHasSearched(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F8F6]">
      <Navbar />

      <section className="bg-gradient-to-r from-[#075E3B] to-[#13804A] text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold">
            <Search className="w-3.5 h-3.5" />
            <span>নাগরিক ট্র্যাকিং পোর্টাল</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold">
            অভিযোগ ও মতামতের বর্তমান অগ্রগতি
          </h1>
          <p className="text-emerald-100 text-xs md:text-sm max-w-2xl">
            সাবমিশনের সময় প্রাপ্ত রেফারেন্স বা ট্র্যাকিং নম্বরটি প্রবেশ করিয়ে আপনার অভিযোগের প্রাতিষ্ঠানিক স্ট্যাটাস পর্যবেক্ষণ করুন।
          </p>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-8">
        {/* Tracking Search Card */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-xs space-y-4">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-4 top-3.5" />
              <input
                type="text"
                placeholder="যেমন: CF-BAK-2026-1001"
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value)}
                className="w-full bg-[#F5F8F6] border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-xs md:text-sm font-mono focus:outline-hidden focus:border-[#075E3B]"
              />
            </div>
            <button
              type="submit"
              className="bg-[#075E3B] hover:bg-[#064E31] text-white font-bold px-6 py-3 rounded-xl text-xs md:text-sm transition cursor-pointer flex items-center justify-center gap-2 shrink-0 shadow-xs"
            >
              <span>অনুসন্ধান করুন</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Tracking Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
            <span>দ্রুত টেস্ট কোড:</span>
            <button
              type="button"
              onClick={() => handleQuickDemo('CF-BAK-2026-1001')}
              className="font-mono bg-emerald-50 text-[#075E3B] px-2.5 py-1 rounded-md border border-emerald-200 hover:bg-emerald-100 transition cursor-pointer"
            >
              CF-BAK-2026-1001 (ড্রেনেজ)
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('CF-BAK-2026-1002')}
              className="font-mono bg-emerald-50 text-[#075E3B] px-2.5 py-1 rounded-md border border-emerald-200 hover:bg-emerald-100 transition cursor-pointer"
            >
              CF-BAK-2026-1002 (সড়ক)
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('CF-BAK-2026-1003')}
              className="font-mono bg-emerald-50 text-[#075E3B] px-2.5 py-1 rounded-md border border-emerald-200 hover:bg-emerald-100 transition cursor-pointer"
            >
              CF-BAK-2026-1003 (নিরাপত্তা)
            </button>
          </div>
        </div>

        {/* Search Result */}
        {hasSearched && (
          <div>
            {result ? (
              <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
                  <div>
                    <span className="text-xs text-gray-500">ট্র্যাকিং নম্বর:</span>
                    <h3 className="text-xl font-mono font-bold text-[#075E3B]">
                      {result.tracking_number}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">বর্তমান স্ট্যাটাস:</span>
                    <span className="bg-emerald-100 text-[#075E3B] font-bold text-xs px-3 py-1 rounded-full border border-emerald-300">
                      {result.status}
                    </span>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-[#F5F8F6] p-4 rounded-xl border border-gray-100">
                  <div>
                    <span className="text-gray-500">বিষয় / ক্যাটাগরি:</span>
                    <p className="font-bold text-gray-900 mt-0.5">{result.category}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">এলাকা ও ওয়ার্ড:</span>
                    <p className="font-bold text-gray-900 mt-0.5">{result.ward}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">অবস্থান:</span>
                    <p className="font-semibold text-gray-800 mt-0.5">{result.location_detail}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">দাখিলের তারিখ:</span>
                    <p className="font-semibold text-gray-800 mt-0.5">
                      {formatBengaliDate(result.created_at)}
                    </p>
                  </div>
                </div>

                {/* Issue Description */}
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-gray-900">{result.title}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                    {result.description}
                  </p>
                </div>

                {/* Official Action / Progress Update */}
                <div className="bg-emerald-950 text-white p-5 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase">
                    <ShieldCheck className="w-4 h-4" />
                    <span>কমিটির প্রাতিষ্ঠানিক ফলো-আপ ও অগ্রগতি</span>
                  </div>
                  <p className="text-xs md:text-sm text-emerald-100 leading-relaxed">
                    {result.resolution_summary ||
                      'আপনার অভিযোগটি বর্তমানে সংশ্লিষ্ট ওয়ার্ড পর্যবেক্ষণ টিমের নিকট পর্যালোচনাধীন রয়েছে। প্রয়োজনীয় পদক্ষেপের বিষয়ে খুব শীঘ্রই হালনাগাদ জানানো হবে।'}
                  </p>
                  {result.assigned_to && (
                    <p className="text-[11px] text-emerald-300 pt-1">
                      দায়িত্বপ্রাপ্ত কর্মকর্তা: <strong>{result.assigned_to}</strong>
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-10 text-center border border-gray-200 shadow-2xs space-y-3">
                <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
                <h3 className="text-base font-bold text-gray-900">
                  নম্বরটি মেলানো সম্ভব হয়নি
                </h3>
                <p className="text-xs text-gray-500 max-w-md mx-auto">
                  অনুগ্রহ করে আপনার ট্র্যাকিং নম্বরটি পুনরায় যাচাই করুন অথবা উপরে প্রদর্শিত টেস্ট কোডগুলো ব্যবহার করে প্রক্রিয়াটি পর্যবেক্ষণ করুন।
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
