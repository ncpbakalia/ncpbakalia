'use client';

import React, { useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import OfficialDocumentPrint from '@/components/common/OfficialDocumentPrint';
import {
  getStoredMembers,
  getStoredNotices,
  getStoredMeetings,
  getStoredTasks,
  getStoredFeedback,
  getStoredCorrespondence,
} from '@/lib/storage';
import { formatBengaliDate, toBengaliDigits } from '@/lib/constants';
import {
  BarChart3,
  FileSpreadsheet,
  Printer,
  Download,
  Users,
  FileText,
  Calendar,
  CheckSquare,
  MessageSquare,
  MailCheck,
} from 'lucide-react';

export default function AdminReportsPage() {
  const [printDocument, setPrintDocument] = useState<{
    type: any;
    ref: string;
    subject: string;
    body: string;
  } | null>(null);

  const exportGeneralCSV = (filename: string, headers: string[], rows: any[][]) => {
    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportMembers = () => {
    const members = getStoredMembers();
    exportGeneralCSV(
      'NCP_Bakalia_Members',
      ['নাম', 'পদবি', 'ওয়ার্ড', 'অনুমোদনের তারিখ', 'স্ট্যাটাস'],
      members.map((m) => [m.name_bn, m.position_bn, m.ward_no || 'বাকলিয়া', m.appointment_date, m.status])
    );
  };

  const handleExportNotices = () => {
    const notices = getStoredNotices();
    exportGeneralCSV(
      'NCP_Bakalia_Notices',
      ['স্মারক নং', 'শিরোনাম', 'ক্যাটাগরি', 'তারিখ', 'স্ট্যাটাস', 'স্বাক্ষরকারী'],
      notices.map((n) => [n.ref_number, `"${n.title_bn}"`, n.category, n.issue_date, n.status, n.issued_by])
    );
  };

  const handleExportCorrespondence = () => {
    const corr = getStoredCorrespondence();
    exportGeneralCSV(
      'NCP_Bakalia_Correspondence',
      ['স্মারক', 'ধরন', 'তারিখ', 'প্রেরক', 'প্রাপক', 'বিষয়', 'পদ্ধতি'],
      corr.map((c) => [c.ref_number, c.type, c.date, c.sender, c.recipient, `"${c.subject}"`, c.dispatch_method])
    );
  };

  const handleExportFeedback = () => {
    const fb = getStoredFeedback();
    exportGeneralCSV(
      'NCP_Bakalia_Civic_Feedback',
      ['ট্র্যাকিং নং', 'ক্যাটাগরি', 'ওয়ার্ড', 'শিরোনাম', 'স্ট্যাটাস', 'দায়িত্বপ্রাপ্ত'],
      fb.map((f) => [f.tracking_number, f.category, f.ward, `"${f.title}"`, f.status, f.assigned_to || 'অনির্ধারিত'])
    );
  };

  const handlePrintMonthlyReport = () => {
    const members = getStoredMembers();
    const notices = getStoredNotices();
    const meetings = getStoredMeetings();
    const tasks = getStoredTasks();
    const fb = getStoredFeedback();
    const corr = getStoredCorrespondence();

    const reportContent = `জাতীয় নাগরিক পার্টি (এনসিপি) বাকলিয়া থানা আহ্বায়ক কমিটির আনুষ্ঠানিক মাসিক সার্বিক প্রতিবেদন:

১. সাংগঠনিক কাঠামো ও সক্রিয় জনবল:
   - মোট সক্রিয় কমিটির সদস্য: ${toBengaliDigits(members.length)} জন
   - কমিটি অনুমোদনের তারিখ: ১৯ সেপ্টেম্বর ২০২৬ (প্রাথমিক মেয়াদ: ৬ মাস)
   - দায়িত্বপ্রাপ্ত সমন্বয়ক ও সদস্য সচিব: মোঃ আরিফ মাঈনুদ্দীন

২. বিজ্ঞপ্তি ও প্রাতিষ্ঠানিক নোটিশ:
   - মোট ইস্যুকৃত নোটিশ সংখ্যা: ${toBengaliDigits(notices.length)} টি
   - সর্বশেষ স্মারক নম্বর: ${notices[0]?.ref_number || 'NCP/BAKALIA/2026/001'}

৩. সভা ও রেজুলেশন অগ্রগতি:
   - সম্পন্ন ও নির্ধারিত সভা সংখ্যা: ${toBengaliDigits(meetings.length)} টি
   - ওয়ার্ড ১৭, ১৮ ও ১৯ এর সমন্বয় কার্যক্রম চলমান।

৪. পত্র আদান-প্রদান ও যোগাযোগ রেজিস্টার:
   - আগত ও প্রেরিত মোট চিঠি: ${toBengaliDigits(corr.length)} টি
   - সিটি কর্পোরেশন ও থানা প্রশাসনের সাথে স্মারকলিপি যোগাযোগ সম্পন্ন।

৫. নাগরিক সেবা সেল ও অভিযোগ নিষ্পত্তি:
   - সর্বমোট প্রাপ্ত অভিযোগ: ${toBengaliDigits(fb.length)} টি
   - সমাধানকৃত ও প্রক্রিয়াধীন: ${toBengaliDigits(fb.filter((f) => f.status === 'সমাধানকৃত' || f.status === 'সংশ্লিষ্ট দপ্তরে প্রেরণ').length)} টি

৬. টাস্ক ও দায়িত্ব বণ্টন:
   - চলমান ও সম্পন্ন সাংগঠনিক দায়িত্ব: ${toBengaliDigits(tasks.length)} টি

এই মাসিক প্রতিবেদনটি বাকলিয়া থানা আহ্বায়ক কমিটির সমন্বয় সভার সিদ্ধান্তের ভিত্তিতে চূড়ান্ত করা হলো।`;

    setPrintDocument({
      type: 'পত্র',
      ref: 'NCP/BAK/REP-2026/01',
      subject: 'বাকলিয়া থানা আহ্বায়ক কমিটির মাসিক প্রাতিষ্ঠানিক ও নাগরিক সেবা সমন্বয় প্রতিবেদন',
      body: reportContent,
    });
  };

  return (
    <div className="flex min-h-screen bg-[#F5F8F6]">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-y-auto">
        <AdminHeader
          title="রিপোর্ট ও এক্সপোর্ট সেন্টার (Reports & Data Export)"
          subtitle="সাংগঠনিক মূল্যায়ন, নাগরিক সেবা পরিসংখ্যান ও এ-৪ অফিশিয়াল রিপোর্ট উৎপাদন"
        />

        <main className="p-6 md:p-8 space-y-6 max-w-7xl w-full">
          {/* Highlight Master Monthly Report */}
          <div className="bg-gradient-to-r from-[#075E3B] to-[#13804A] text-white p-6 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1">
              <span className="text-xs bg-white/20 px-2.5 py-0.5 rounded-full font-bold">
                সমন্বিত প্রতিবেদন
              </span>
              <h2 className="text-xl font-bold">
                কমিটির আনুষ্ঠানিক মাসিক সার্বিক মূল্যায়ন প্রতিবেদন
              </h2>
              <p className="text-xs text-emerald-100 max-w-xl">
                সদস্য তালিকা, নোটিশ, রেজুলেশন, পত্র যোগাযোগ ও নাগরিক সেবার পরিসংখ্যান সম্বলিত পূর্ণাঙ্গ লেটারহেড প্রিন্ট প্রস্তুত।
              </p>
            </div>

            <button
              onClick={handlePrintMonthlyReport}
              className="bg-white hover:bg-emerald-50 text-[#075E3B] font-bold px-5 py-3 rounded-xl text-xs flex items-center gap-2 shadow-sm transition cursor-pointer shrink-0"
            >
              <Printer className="w-4 h-4" />
              <span>মাসিক প্রতিবেদন প্রিন্ট / PDF</span>
            </button>
          </div>

          {/* Module-wise Exports */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: Committee Roster */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2.5 text-[#075E3B]">
                  <Users className="w-5 h-5" />
                  <h3 className="font-bold text-base text-gray-900">কমিটি সদস্য ডিরেক্টরি</h3>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  সকল পদাধিকারী, কার্যকরী সদস্য, ওয়ার্ড বণ্টন ও স্ট্যাটাস সম্বলিত আনুষ্ঠানিক তালিকা।
                </p>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={handleExportMembers}
                  className="bg-emerald-50 hover:bg-emerald-100 text-[#075E3B] font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 border border-emerald-200 transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>CSV রফতানি</span>
                </button>
              </div>
            </div>

            {/* Card 2: Notice Register */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2.5 text-[#075E3B]">
                  <FileText className="w-5 h-5" />
                  <h3 className="font-bold text-base text-gray-900">নোটিশ রেজিস্ট্রি ও লগ</h3>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  অনুমোদিত ও প্রকাশিত সকল নোটিশের ক্রমিক স্মারক, ইস্যুর তারিখ ও বিবরণী।
                </p>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={handleExportNotices}
                  className="bg-emerald-50 hover:bg-emerald-100 text-[#075E3B] font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 border border-emerald-200 transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>CSV রফতানি</span>
                </button>
              </div>
            </div>

            {/* Card 3: Correspondence Register */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2.5 text-blue-600">
                  <MailCheck className="w-5 h-5" />
                  <h3 className="font-bold text-base text-gray-900">চিঠিপত্র আদান-প্রদান লগ</h3>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  ইনওয়ার্ড এবং আউটওয়ার্ড রেজিস্টারের সম্পূর্ণ ডেটাবেজ এক্সপোর্ট।
                </p>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={handleExportCorrespondence}
                  className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 border border-blue-200 transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>CSV রফতানি</span>
                </button>
              </div>
            </div>

            {/* Card 4: Civic Feedback Export */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2.5 text-[#E32636]">
                  <MessageSquare className="w-5 h-5" />
                  <h3 className="font-bold text-base text-gray-900">নাগরিক সেবা ও অভিযোগ সারাংশ</h3>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  ওয়ার্ড ভিত্তিক প্রাপ্ত অভিযোগ, সমস্যার ধরন ও গৃহীত সমাধান সমূহের সামগ্রিক লগ।
                </p>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={handleExportFeedback}
                  className="bg-red-50 hover:bg-red-100 text-[#E32636] font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 border border-red-200 transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>CSV রফতানি</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Print Document Modal */}
      {printDocument && (
        <OfficialDocumentPrint
          documentType={printDocument.type}
          refNumber={printDocument.ref}
          date={new Date().toISOString().split('T')[0]}
          subject={printDocument.subject}
          bodyContent={printDocument.body}
          signatoryLeft={{
            name: 'মোঃ আরিফ মাঈনুদ্দীন',
            designation: 'সদস্য সচিব\nবাকলিয়া থানা আহ্বায়ক কমিটি',
          }}
          onClose={() => setPrintDocument(null)}
        />
      )}
    </div>
  );
}
