'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import OfficialDocumentPrint from '@/components/common/OfficialDocumentPrint';
import { getStoredNotices } from '@/lib/storage';
import { Notice } from '@/types';
import { formatBengaliDate, toBengaliDigits } from '@/lib/constants';
import {
  Search,
  Filter,
  FileText,
  Printer,
  Calendar,
  Eye,
  CheckCircle2,
  Clock,
  Shield,
} from 'lucide-react';

export default function PublicNoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activePrintNotice, setActivePrintNotice] = useState<Notice | null>(null);

  useEffect(() => {
    // Only published notices for public board
    const list = getStoredNotices().filter((n) => n.is_public && n.status === 'প্রকাশিত');
    setNotices(list);
  }, []);

  const filteredNotices = notices.filter((n) => {
    const matchesSearch =
      n.title_bn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.ref_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.summary_bn.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || n.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F8F6]">
      <Navbar />

      {/* Header */}
      <section className="bg-gradient-to-r from-[#075E3B] to-[#13804A] text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold">
            <FileText className="w-3.5 h-3.5" />
            <span>অফিসিয়াল নোটিশ বোর্ড</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold">
            বাকলিয়া থানা আহ্বায়ক কমিটির নোটিশ আর্কাইভ
          </h1>
          <p className="text-emerald-100 text-xs md:text-sm max-w-2xl">
            সদস্য সচিব ও ভারপ্রাপ্ত আহ্বায়কের অনুমোদনে প্রকাশিত বিজ্ঞপ্তি, সাধারণ সভা এবং জনগুরুত্বপূর্ণ নোটিশসমূহ।
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-8">
        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="স্মারক নম্বর বা শিরোনাম দিয়ে খুঁজুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#F5F8F6] border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-xs md:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#075E3B]/20 focus:border-[#075E3B]"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end text-xs">
            <Filter className="w-3.5 h-3.5 text-gray-500" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[#F5F8F6] border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 focus:outline-hidden focus:border-[#075E3B] cursor-pointer"
            >
              <option value="all">সকল ক্যাটাগরি</option>
              <option value="সাংগঠনিক ঘোষণা">সাংগঠনিক ঘোষণা</option>
              <option value="সভা বিজ্ঞপ্তি">সভা বিজ্ঞপ্তি</option>
              <option value="জনগুরুত্বপূর্ণ নোটিশ">জনগুরুত্বপূর্ণ নোটিশ</option>
              <option value="প্রেস বিজ্ঞপ্তি">প্রেস বিজ্ঞপ্তি</option>
            </select>
          </div>
        </div>

        {/* Notices List */}
        <div className="space-y-4">
          {filteredNotices.map((notice) => (
            <div
              key={notice.id}
              className="bg-white p-6 rounded-2xl border border-gray-200/90 shadow-2xs hover:border-[#075E3B]/40 transition space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold bg-emerald-50 text-[#075E3B] px-3 py-1 rounded-md border border-emerald-200">
                    {notice.ref_number}
                  </span>
                  <span className="bg-gray-100 text-gray-700 text-xs px-2.5 py-0.5 rounded-full font-medium">
                    {notice.category}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  <span>তারিখ: {formatBengaliDate(notice.issue_date)}</span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 leading-snug">
                  {notice.title_bn}
                </h3>
                <p className="text-xs md:text-sm text-gray-600 mt-2 leading-relaxed whitespace-pre-line">
                  {notice.summary_bn}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <div className="text-xs text-gray-500">
                  <span>অনুমোদনকারী: </span>
                  <strong className="text-gray-800">{notice.issued_by}</strong> ({notice.issued_by_role})
                </div>

                <button
                  onClick={() => setActivePrintNotice(notice)}
                  className="bg-[#075E3B] hover:bg-[#064E31] text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 transition cursor-pointer shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>অফিসিয়াল লেটারহেড ও প্রিন্ট</span>
                </button>
              </div>
            </div>
          ))}

          {filteredNotices.length === 0 && (
            <div className="bg-white rounded-2xl p-12 text-center text-gray-500">
              কোনো নোটিশ পাওয়া যায়নি।
            </div>
          )}
        </div>
      </main>

      {/* Official Printable Sheet Modal */}
      {activePrintNotice && (
        <OfficialDocumentPrint
          documentType="নোটিশ"
          refNumber={activePrintNotice.ref_number}
          date={activePrintNotice.issue_date}
          subject={activePrintNotice.title_bn}
          bodyContent={activePrintNotice.body_bn}
          signatoryLeft={{
            name: activePrintNotice.issued_by,
            designation: `${activePrintNotice.issued_by_role}\nবাকলিয়া থানা আহ্বায়ক কমিটি`,
          }}
          onClose={() => setActivePrintNotice(null)}
        />
      )}

      <Footer />
    </div>
  );
}
