'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import {
  saveStoredFeedback,
  generateNextFeedbackTrackingNumber,
  recordAuditLog,
} from '@/lib/storage';
import { CivicCategory, CivicFeedbackItem } from '@/types';
import { BAKALIA_WARDS, CIVIC_ISSUE_CATEGORIES } from '@/lib/constants';
import OfficialDocumentPrint from '@/components/common/OfficialDocumentPrint';
import {
  MessageSquareWarning,
  Send,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Printer,
  Search,
} from 'lucide-react';

export default function CitizenFeedbackPage() {
  const [category, setCategory] = useState<CivicCategory>('নিষ্কাশন ও জলাবদ্ধতা');
  const [ward, setWard] = useState(BAKALIA_WARDS[0].name_bn);
  const [locationDetail, setLocationDetail] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [citizenName, setCitizenName] = useState('');
  const [citizenPhone, setCitizenPhone] = useState('');
  const [isConfidential, setIsConfidential] = useState(false);
  const [submittedItem, setSubmittedItem] = useState<CivicFeedbackItem | null>(null);
  const [showPrintModal, setShowPrintModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !locationDetail.trim()) {
      alert('অনুগ্রহ করে শিরোনাম, স্থান ও বিস্তারিত বিবরণ পূরণ করুন।');
      return;
    }

    const trackingNumber = generateNextFeedbackTrackingNumber();
    const newItem: CivicFeedbackItem = {
      id: `cf-${Date.now()}`,
      tracking_number: trackingNumber,
      category,
      ward,
      location_detail: locationDetail,
      title,
      description,
      citizen_name: citizenName || 'অজ্ঞাত নাগরিক',
      citizen_phone: citizenPhone || undefined,
      is_confidential: isConfidential,
      status: 'গৃহীত',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    saveStoredFeedback(newItem);
    recordAuditLog(
      'CITIZEN_FEEDBACK_SUBMITTED',
      'civic_feedback',
      `নাগরিক অভিযোগ জমা: ${trackingNumber} (${category})`,
      'নাগরিক (পাবলিক)',
      'public',
      newItem.id
    );

    setSubmittedItem(newItem);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F8F6]">
      <Navbar />

      {/* Header */}
      <section className="bg-gradient-to-r from-[#075E3B] to-[#13804A] text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold">
            <MessageSquareWarning className="w-3.5 h-3.5" />
            <span>নাগরিক অধিকার ও সেবা সেল</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold">
            নাগরিক সমস্যা ও পরামর্শ দাখিল
          </h1>
          <p className="text-emerald-100 text-xs md:text-sm max-w-2xl">
            বাকলিয়া থানা এলাকার রাস্তাঘাট, ড্রেনেজ, বর্জ্য ব্যবস্থাপনা বা জননিরাপত্তা সংক্রান্ত অভিযোগ সরাসরি আমাদের নিকট জানান।
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-8">
        {/* Important Disclaimer Card */}
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-xl text-xs text-amber-900 space-y-1">
          <div className="flex items-center gap-2 font-bold text-amber-800">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>জরুরি নিরাপত্তা ও সেবা সংক্রান্ত বিজ্ঞপ্তি:</span>
          </div>
          <p className="leading-relaxed">
            এটি কোনো জরুরি পুলিশ বা দমকল পরিষেবা নয়। তাৎক্ষণিক অগ্নিকাণ্ড, জীবনসংকট বা পুলিশি সহায়তার জন্য সরাসরি রাষ্ট্রীয় জরুরি হেল্পলাইন <strong>৯৯৯</strong> এ যোগাযোগ করুন।
          </p>
        </div>

        {/* Confirmation Screen if submitted */}
        {submittedItem ? (
          <div className="bg-white rounded-2xl p-8 border border-emerald-200 shadow-md text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#075E3B] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">
                আপনার অভিযোগ সফলভাবে সংরক্ষিত হয়েছে
              </h2>
              <p className="text-xs text-gray-600">
                বাকলিয়া থানা আহ্বায়ক কমিটির নাগরিক সহায়তা সেলে আপনার তথ্য লিপিবদ্ধ করা হয়েছে।
              </p>
            </div>

            {/* Tracking Code Highlight */}
            <div className="bg-emerald-50 border-2 border-dashed border-[#075E3B] p-5 rounded-2xl max-w-md mx-auto">
              <span className="text-xs text-gray-500 block">আপনার ট্র্যাকিং নম্বর (Tracking No)</span>
              <span className="text-2xl font-mono font-extrabold text-[#075E3B] tracking-wider block mt-1">
                {submittedItem.tracking_number}
              </span>
              <span className="text-[11px] text-gray-500 block mt-2">
                পরবর্তীতে অগ্রগতির খোঁজ নিতে এই নম্বরটি সংরক্ষণ করুন।
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setShowPrintModal(true)}
                className="bg-[#075E3B] hover:bg-[#064E31] text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-xs transition cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>প্রাপ্তিস্বীকার রশিদ প্রিন্ট করুন</span>
              </button>

              <Link
                href="/citizen-feedback/track"
                className="bg-emerald-100 hover:bg-emerald-200 text-[#075E3B] font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 transition"
              >
                <Search className="w-4 h-4" />
                <span>স্ট্যাটাস ট্র্যাকিং পেজে যান</span>
              </Link>

              <button
                onClick={() => {
                  setSubmittedItem(null);
                  setTitle('');
                  setDescription('');
                  setLocationDetail('');
                }}
                className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold px-4 py-2.5 rounded-xl text-xs transition cursor-pointer"
              >
                নতুন আরেকটি ফর্ম পূরণ করুন
              </button>
            </div>
          </div>
        ) : (
          /* Submission Form */
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 shadow-xs space-y-6"
          >
            <div className="border-b pb-4">
              <h2 className="text-lg font-bold text-gray-900">নাগরিক সমস্যার বিবরণ</h2>
              <p className="text-xs text-gray-500">
                সঠিক তথ্য দিলে সংশ্লিষ্ট ওয়ার্ডের প্রতিনিধির পক্ষে সরেজমিনে পরিদর্শন সহজ হয়।
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 block">
                  সমস্যার ক্যাটাগরি <span className="text-red-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CivicCategory)}
                  className="w-full bg-[#F5F8F6] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs md:text-sm font-semibold text-gray-800 focus:outline-hidden focus:border-[#075E3B]"
                >
                  {CIVIC_ISSUE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Ward */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 block">
                  এলাকা / ওয়ার্ড <span className="text-red-500">*</span>
                </label>
                <select
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  className="w-full bg-[#F5F8F6] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs md:text-sm font-semibold text-gray-800 focus:outline-hidden focus:border-[#075E3B]"
                >
                  {BAKALIA_WARDS.map((w) => (
                    <option key={w.id} value={w.name_bn}>
                      {w.name_bn}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Location detail */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 block">
                সুনির্দিষ্ট অবস্থান / ল্যান্ডমার্ক <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="যেমন: মিয়াখান নগর প্রধান সড়ক, চামড়ার গুদাম সংলগ্ন ড্রেন"
                value={locationDetail}
                onChange={(e) => setLocationDetail(e.target.value)}
                className="w-full bg-[#F5F8F6] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs md:text-sm focus:outline-hidden focus:border-[#075E3B]"
              />
            </div>

            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 block">
                সংক্ষিপ্ত শিরোনাম <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="যেমন: বৃষ্টির পানিতে রাস্তা প্লাবিত ও ম্যানহোল উন্মুক্ত"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#F5F8F6] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs md:text-sm focus:outline-hidden focus:border-[#075E3B]"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 block">
                বিস্তারিত বিবরণ <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                placeholder="সমস্যাটির পরিধি, কতদিন ধরে হচ্ছে এবং স্থানীয় নাগরিকদের ভোগান্তির বিস্তারিত উল্লেখ করুন..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#F5F8F6] border border-gray-200 rounded-xl p-3.5 text-xs md:text-sm focus:outline-hidden focus:border-[#075E3B]"
              />
            </div>

            {/* Citizen Details (Optional) */}
            <div className="border-t pt-4 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-gray-800">
                  যোগাযোগের তথ্য (ঐচ্ছিক / স্বেচ্ছাপ্রণোদিত)
                </h3>
                <p className="text-[11px] text-gray-500">
                  অগ্রগতি জানাতে বা তথ্য স্পষ্টীকরণে আপনার সাথে যোগাযোগের জন্য ব্যবহৃত হতে পারে।
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="আপনার নাম (ঐচ্ছিক)"
                  value={citizenName}
                  onChange={(e) => setCitizenName(e.target.value)}
                  className="bg-[#F5F8F6] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs md:text-sm focus:outline-hidden focus:border-[#075E3B]"
                />
                <input
                  type="tel"
                  placeholder="মোবাইল নম্বর (ঐচ্ছিক)"
                  value={citizenPhone}
                  onChange={(e) => setCitizenPhone(e.target.value)}
                  className="bg-[#F5F8F6] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs md:text-sm focus:outline-hidden focus:border-[#075E3B]"
                />
              </div>

              <label className="flex items-center gap-2.5 text-xs text-gray-700 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={isConfidential}
                  onChange={(e) => setIsConfidential(e.target.checked)}
                  className="w-4 h-4 text-[#075E3B] rounded focus:ring-0"
                />
                <span>
                  <strong>গোপনীয় হ্যান্ডলিং:</strong> আমার নাম ও মোবাইল নম্বর কঠোরভাবে গোপন রাখতে চাই।
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-[#E32636] hover:bg-[#c91e2c] text-white font-bold py-3.5 px-6 rounded-xl text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>অভিযোগ / মতামত সাবমিট করুন</span>
              </button>
            </div>
          </form>
        )}
      </main>

      {/* Acknowledgment Receipt Print Modal */}
      {showPrintModal && submittedItem && (
        <OfficialDocumentPrint
          documentType="নাগরিক প্রাপ্তিস্বীকার"
          refNumber={submittedItem.tracking_number}
          date={submittedItem.created_at}
          recipient={`${submittedItem.citizen_name || 'সম্মানিত নাগরিক'}\nস্থান: ${submittedItem.location_detail}, ${submittedItem.ward}`}
          subject={`নাগরিক অভিযোগ প্রাপ্তিস্বীকার: ${submittedItem.title}`}
          bodyContent={`জাতীয় নাগরিক পার্টি (এনসিপি) বাকলিয়া থানা আহ্বায়ক কমিটির নাগরিক সেবা ডেস্কে আপনার প্রেরিত সমস্যা ও মতামত অন্তর্ভুক্ত করা হয়েছে।\n\nসমস্যার ধরন: ${submittedItem.category}\nওয়ার্ড ও অবস্থান: ${submittedItem.ward}, ${submittedItem.location_detail}\nবিবরণ: ${submittedItem.description}\nবর্তমান স্ট্যাটাস: ${submittedItem.status}\n\nআমাদের সংশ্লিষ্ট ওয়ার্ড পর্যবেক্ষণ সেল ও দায়িত্বপ্রাপ্ত প্রতিনিধি সরেজমিনে তথ্য যাচাই করে প্রয়োজনীয় প্রাতিষ্ঠানিক পদক্ষেপ গ্রহণ করবেন।`}
          notes="এই রসিদটি একটি স্বয়ংক্রিয় প্রাতিষ্ঠানিক প্রাপ্তিস্বীকার কপি। অভিযোগের অগ্রগতি ট্র্যাক করতে https://ncp-bakalia.org/citizen-feedback/track ব্যবহার করুন।"
          onClose={() => setShowPrintModal(false)}
        />
      )}

      <Footer />
    </div>
  );
}
