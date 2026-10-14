'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import {
  getStoredMembers,
  getStoredNotices,
  getStoredMeetings,
  getStoredTasks,
  getStoredFeedback,
  getStoredCorrespondence,
  getStoredDisciplinary,
  getStoredAuditLogs,
} from '@/lib/storage';
import { toBengaliDigits, formatBengaliDate } from '@/lib/constants';
import {
  Users,
  FileText,
  CalendarDays,
  CheckSquare,
  MessageSquareWarning,
  MailCheck,
  ShieldAlert,
  ArrowRight,
  Clock,
  AlertTriangle,
  History,
  TrendingUp,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { user, canAccessDisciplinary } = useAuth();

  const [activeMembersCount, setActiveMembersCount] = useState(0);
  const [upcomingMeetingsCount, setUpcomingMeetingsCount] = useState(0);
  const [pendingNoticesCount, setPendingNoticesCount] = useState(0);
  const [inProgressTasksCount, setInProgressTasksCount] = useState(0);
  const [overdueTasksCount, setOverdueTasksCount] = useState(0);
  const [unresolvedFeedbackCount, setUnresolvedFeedbackCount] = useState(0);
  const [incomingCorrCount, setIncomingCorrCount] = useState(0);
  const [outgoingCorrCount, setOutgoingCorrCount] = useState(0);
  const [disciplinaryCount, setDisciplinaryCount] = useState(0);
  const [recentAudits, setRecentAudits] = useState<any[]>([]);

  useEffect(() => {
    // Dynamic queries from active storage repository
    const members = getStoredMembers();
    setActiveMembersCount(members.filter((m) => m.status === 'সক্রিয়').length);

    const meetings = getStoredMeetings();
    setUpcomingMeetingsCount(meetings.filter((m) => m.status === 'নির্ধারিত').length);

    const notices = getStoredNotices();
    setPendingNoticesCount(
      notices.filter((n) => n.status === 'খসড়া' || n.status === 'পর্যালোচনাধীন').length
    );

    const tasks = getStoredTasks();
    setInProgressTasksCount(tasks.filter((t) => t.status === 'চলমান').length);
    setOverdueTasksCount(tasks.filter((t) => t.status === 'বিলম্বিত').length);

    const feedback = getStoredFeedback();
    setUnresolvedFeedbackCount(
      feedback.filter((f) => f.status !== 'সমাধানকৃত' && f.status !== 'অযৌক্তিক / বাতিল').length
    );

    const corr = getStoredCorrespondence();
    setIncomingCorrCount(corr.filter((c) => c.type.includes('Incoming')).length);
    setOutgoingCorrCount(corr.filter((c) => c.type.includes('Outgoing')).length);

    const disc = getStoredDisciplinary();
    setDisciplinaryCount(disc.length);

    const audits = getStoredAuditLogs();
    setRecentAudits(audits.slice(0, 5));
  }, []);

  return (
    <div className="flex min-h-screen bg-[#F5F8F6]">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-y-auto">
        <AdminHeader
          title="প্রশাসনিক ড্যাশবোর্ড ওভারভিউ"
          subtitle="বাকলিয়া থানা আহ্বায়ক কমিটির সামগ্রিক প্রাতিষ্ঠানিক কার্যক্রম ও পরিসংখ্যান"
        />

        <main className="p-6 md:p-8 space-y-8 max-w-7xl w-full">
          {/* Welcome User Banner */}
          <div className="bg-gradient-to-r from-[#075E3B] to-[#13804A] text-white p-6 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs bg-white/20 px-2.5 py-0.5 rounded-full font-semibold">
                স্বাগতম
              </span>
              <h2 className="text-xl md:text-2xl font-bold">
                {user ? user.name : 'সদস্য সচিব দপ্তর'}
              </h2>
              <p className="text-xs md:text-sm text-emerald-100">
                দায়িত্ব: <strong>{user?.position_bn || 'সদস্য সচিব'}</strong> • জাতীয় নাগরিক পার্টি, বাকলিয়া থানা আহ্বায়ক কমিটি
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/admin/notices"
                className="bg-white hover:bg-emerald-50 text-[#075E3B] text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-xs"
              >
                নতুন নোটিশ লিখুন
              </Link>
              <Link
                href="/admin/correspondence"
                className="bg-emerald-950/70 hover:bg-emerald-950 text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-white/20 transition"
              >
                চিঠিপত্র রেজিস্টার
              </Link>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {/* Card 1: Active Members */}
            <Link
              href="/admin/committee"
              className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-2xs hover:shadow-md transition flex items-center justify-between group"
            >
              <div>
                <span className="text-xs text-gray-500 font-medium">মোট সক্রিয় সদস্য</span>
                <p className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-1">
                  {toBengaliDigits(activeMembersCount)} জন
                </p>
                <span className="text-[11px] text-[#075E3B] font-semibold flex items-center gap-1 mt-1">
                  <span>ডিরেক্টরি পরিচালনা</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition" />
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#075E3B] flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
            </Link>

            {/* Card 2: Upcoming Meetings */}
            <Link
              href="/admin/meetings"
              className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-2xs hover:shadow-md transition flex items-center justify-between group"
            >
              <div>
                <span className="text-xs text-gray-500 font-medium">নির্ধারিত আসন্ন সভা</span>
                <p className="text-2xl md:text-3xl font-extrabold text-[#075E3B] mt-1">
                  {toBengaliDigits(upcomingMeetingsCount)} টি
                </p>
                <span className="text-[11px] text-gray-500 flex items-center gap-1 mt-1">
                  <span>সূচি ও রেজুলেশন</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition" />
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <CalendarDays className="w-6 h-6" />
              </div>
            </Link>

            {/* Card 3: Notices Pending */}
            <Link
              href="/admin/notices"
              className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-2xs hover:shadow-md transition flex items-center justify-between group"
            >
              <div>
                <span className="text-xs text-gray-500 font-medium">অনুমোদনাধীন নোটিশ</span>
                <p className="text-2xl md:text-3xl font-extrabold text-amber-600 mt-1">
                  {toBengaliDigits(pendingNoticesCount)} টি
                </p>
                <span className="text-[11px] text-amber-700 flex items-center gap-1 mt-1">
                  <span>পর্যালোচনা ও অনুমোদন</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition" />
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
            </Link>

            {/* Card 4: Unresolved Feedback */}
            <Link
              href="/admin/civic-issues"
              className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-2xs hover:shadow-md transition flex items-center justify-between group"
            >
              <div>
                <span className="text-xs text-gray-500 font-medium">অমীমাংসিত নাগরিক মতামত</span>
                <p className="text-2xl md:text-3xl font-extrabold text-[#E32636] mt-1">
                  {toBengaliDigits(unresolvedFeedbackCount)} টি
                </p>
                <span className="text-[11px] text-[#E32636] font-semibold flex items-center gap-1 mt-1">
                  <span>তদারকি ও পদক্ষেপ</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition" />
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-red-50 text-[#E32636] flex items-center justify-center">
                <MessageSquareWarning className="w-6 h-6" />
              </div>
            </Link>
          </div>

          {/* Secondary Stats Row: Tasks, Correspondence & Disciplinary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Task Tracking Summary */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-[#075E3B]" />
                  <h3 className="font-bold text-sm text-gray-900">সাংগঠনিক দায়িত্ব/টাস্ক</h3>
                </div>
                <Link
                  href="/admin/tasks"
                  className="text-xs text-[#075E3B] font-bold hover:underline"
                >
                  বিস্তারিত
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                  <span className="text-xs text-emerald-800">চলমান কাজ</span>
                  <p className="text-xl font-bold text-[#075E3B] mt-1">
                    {toBengaliDigits(inProgressTasksCount)} টি
                  </p>
                </div>
                <div className="bg-red-50 p-3 rounded-xl border border-red-100">
                  <span className="text-xs text-red-800">সময়োত্তীর্ণ (Overdue)</span>
                  <p className="text-xl font-bold text-[#E32636] mt-1">
                    {toBengaliDigits(overdueTasksCount)} টি
                  </p>
                </div>
              </div>
            </div>

            {/* Correspondence Register Summary */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <MailCheck className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-sm text-gray-900">পত্র আদান-প্রদান রেজিস্টার</h3>
                </div>
                <Link
                  href="/admin/correspondence"
                  className="text-xs text-blue-600 font-bold hover:underline"
                >
                  রেজিস্টার
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                  <span className="text-xs text-blue-800">আগত পত্র (Inward)</span>
                  <p className="text-xl font-bold text-blue-700 mt-1">
                    {toBengaliDigits(incomingCorrCount)} টি
                  </p>
                </div>
                <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                  <span className="text-xs text-emerald-800">প্রেরিত পত্র (Outward)</span>
                  <p className="text-xl font-bold text-[#075E3B] mt-1">
                    {toBengaliDigits(outgoingCorrCount)} টি
                  </p>
                </div>
              </div>
            </div>

            {/* Disciplinary Security Cell (Restricted role display) */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-[#E32636]" />
                  <h3 className="font-bold text-sm text-gray-900">শৃঙ্খলা ও তদন্ত নথি</h3>
                </div>
                <span className="text-[10px] bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded">
                  গোপনীয়
                </span>
              </div>

              {canAccessDisciplinary() ? (
                <div className="space-y-3">
                  <div className="bg-[#F5F8F6] p-3 rounded-xl border border-gray-200 flex justify-between items-center">
                    <span className="text-xs text-gray-600">তদন্তাধীন / সক্রিয় কেস:</span>
                    <span className="text-xl font-bold text-gray-900">
                      {toBengaliDigits(disciplinaryCount)} টি
                    </span>
                  </div>
                  <Link
                    href="/admin/disciplinary"
                    className="w-full bg-[#E32636]/10 hover:bg-[#E32636]/20 text-[#E32636] font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                  >
                    <span>শৃঙ্খলা সেল মডিউল খুলুন</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
                <div className="bg-gray-50 p-3 rounded-xl text-xs text-gray-500 text-center">
                  আপনার অ্যাকাউন্টে এই গোপনীয় মডিউল দেখার অনুমতি নেই। (সদস্য সচিব / আহ্বায়ক সংরক্ষিত)
                </div>
              )}
            </div>
          </div>

          {/* Recent Audit Log Preview */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-[#075E3B]" />
                <h3 className="font-bold text-sm text-gray-900">
                  সাম্প্রতিক নিরাপত্তা ও সিস্টেম অডিট লগ
                </h3>
              </div>
              <Link
                href="/admin/audit-logs"
                className="text-xs text-[#075E3B] font-bold hover:underline"
              >
                সকল অডিট লগ
              </Link>
            </div>

            <div className="divide-y divide-gray-100">
              {recentAudits.map((log) => (
                <div key={log.id} className="py-2.5 flex items-center justify-between text-xs gap-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-700 font-bold">
                      {log.action}
                    </span>
                    <span className="text-gray-800">{log.details}</span>
                  </div>
                  <div className="text-right shrink-0 text-[11px] text-gray-400">
                    <span className="text-gray-600 font-semibold">{log.user_name}</span> •{' '}
                    {formatBengaliDate(log.timestamp)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
