'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import OfficialDocumentPrint from '@/components/common/OfficialDocumentPrint';
import Link from 'next/link';
import { getStoredNotices } from '@/lib/storage';
import { Notice } from '@/types';
import { formatBengaliDate } from '@/lib/constants';
import { useParams } from 'next/navigation';
import {
  FileText,
  Printer,
  Calendar,
  ChevronLeft,
  CheckCircle2,
  Clock,
  Shield,
} from 'lucide-react';

function NoticeDetailContent() {
  const params = useParams();
  const id = params?.id as string;
  const [notice, setNotice] = useState<Notice | null>(null);
  const [showPrintModal, setShowPrintModal] = useState(false);

  useEffect(() => {
    if (id) {
      const all = getStoredNotices();
      const found = all.find((n) => n.id === id || n.ref_number.replace(/\//g, '-') === id);
      if (found) {
        setNotice(found);
      }
    }
  }, [id]);

  if (!notice) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F5F8F6]">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-20 text-center flex-1 space-y-4">
          <FileText className="w-12 h-12 text-gray-400 mx-auto" />
          <h2 className="text-xl font-bold text-gray-800">নোটিশটি লোড হচ্ছে অথবা পাওয়া যায়নি</h2>
          <p className="text-xs text-gray-500">
            অনুগ্রহ করে অপেক্ষা করুন অথবা নোটিশ বোর্ডে ফিরে যান।
          </p>
          <Link
            href="/notices"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#075E3B] hover:underline"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>নোটিশ বোর্ডে ফিরে যান</span>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F8F6]">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-6">
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/notices"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#075E3B] hover:underline"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>সকল নোটিশ</span>
          </Link>

          <button
            onClick={() => setShowPrintModal(true)}
            className="bg-[#075E3B] hover:bg-[#064E31] text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>অফিসিয়াল লেটারহেড প্রিন্ট (A4)</span>
          </button>
        </div>

        {/* Notice Content Card */}
        <div className="bg-white rounded-3xl p-6 md:p-10 border border-gray-200 shadow-xs space-y-6">
          <div className="border-b pb-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-xs font-bold bg-emerald-50 text-[#075E3B] px-3 py-1 rounded-md border border-emerald-200">
                স্মারক নং: {notice.ref_number}
              </span>
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                <span>ইস্যুর তারিখ: {formatBengaliDate(notice.issue_date)}</span>
              </span>
            </div>

            <div className="inline-block bg-gray-100 text-gray-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              {notice.category}
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-snug">
              {notice.title_bn}
            </h1>
          </div>

          {notice.summary_bn && (
            <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-100 text-xs md:text-sm text-emerald-950 font-medium leading-relaxed">
              <strong>সারসংক্ষেপ:</strong> {notice.summary_bn}
            </div>
          )}

          {/* Main Notice Body */}
          <div className="text-xs md:text-sm text-gray-800 leading-relaxed space-y-4 whitespace-pre-line min-h-[200px]">
            {notice.body_bn}
          </div>

          {/* Signatory Box */}
          <div className="pt-8 border-t border-gray-100 flex justify-end">
            <div className="text-right text-xs">
              <p className="font-serif italic text-emerald-800 pb-1">(অনুমোদিত স্বাক্ষরিত কপি)</p>
              <p className="font-bold text-gray-900 text-sm">{notice.issued_by}</p>
              <p className="text-gray-600">{notice.issued_by_role}</p>
              <p className="text-[11px] text-gray-400">বাকলিয়া থানা আহ্বায়ক কমিটি, চট্টগ্রাম মহানগর</p>
            </div>
          </div>
        </div>
      </main>

      {/* Official Printable Sheet Modal */}
      {showPrintModal && (
        <OfficialDocumentPrint
          documentType="নোটিশ"
          refNumber={notice.ref_number}
          date={notice.issue_date}
          subject={notice.title_bn}
          bodyContent={notice.body_bn}
          signatoryLeft={{
            name: notice.issued_by,
            designation: `${notice.issued_by_role}\nবাকলিয়া থানা আহ্বায়ক কমিটি`,
          }}
          onClose={() => setShowPrintModal(false)}
        />
      )}

      <Footer />
    </div>
  );
}

export default function NoticeDetailPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-gray-500 text-sm">লোড হচ্ছে...</div>}>
      <NoticeDetailContent />
    </Suspense>
  );
}
