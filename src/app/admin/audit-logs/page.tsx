'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { getStoredAuditLogs } from '@/lib/storage';
import { AuditLogItem } from '@/types';
import { formatBengaliDate, toBengaliDigits } from '@/lib/constants';
import { History, Search, ShieldCheck, Filter } from 'lucide-react';

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setLogs(getStoredAuditLogs());
  }, []);

  const filteredLogs = logs.filter(
    (l) =>
      l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.entity.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#F5F8F6]">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-y-auto">
        <AdminHeader
          title="নিরাপত্তা ও অডিট লগ (Security & Audit Trail)"
          subtitle="প্রশাসনিক পোর্টালের প্রতিটি সংবেদনশীল কর্মকাণ্ড ও পরিবর্তনের নির্ভরযোগ্য রেকর্ড"
        />

        <main className="p-6 md:p-8 space-y-6 max-w-7xl w-full">
          {/* Search Header */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="অ্যাকশন, ব্যবহারকারী বা বিবরণী খুঁজুন..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#F5F8F6] border border-gray-200 rounded-xl pl-10 pr-3.5 py-2 text-xs focus:outline-hidden focus:border-[#075E3B]"
              />
            </div>

            <div className="text-xs text-gray-500 font-semibold">
              মোট রেকর্ডকৃত ইভেন্ট: <strong>{toBengaliDigits(logs.length)}</strong> টি
            </div>
          </div>

          {/* Audit Logs Table */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F5F8F6] text-gray-700 font-bold border-b border-gray-200">
                  <tr>
                    <th className="py-3.5 px-4">অ্যাকশন (Event)</th>
                    <th className="py-3.5 px-4">টেবিল / মডিউল</th>
                    <th className="py-3.5 px-4">ব্যবহারকারী ও পদবি</th>
                    <th className="py-3.5 px-4">বিস্তারিত কার্যক্রম</th>
                    <th className="py-3.5 px-4">আইপি ও সময়</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50/80 transition">
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold bg-emerald-50 text-[#075E3B] px-2 py-0.5 rounded text-[11px] border border-emerald-200">
                          {log.action}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono text-gray-600">
                        {log.entity}
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-gray-900">{log.user_name}</div>
                        <div className="text-[10px] text-gray-500">{log.user_role}</div>
                      </td>

                      <td className="py-3 px-4 text-gray-800 max-w-md">
                        {log.details}
                      </td>

                      <td className="py-3 px-4 text-gray-500 font-mono text-[11px] whitespace-nowrap">
                        <div>{formatBengaliDate(log.timestamp)}</div>
                        <div className="text-[10px] text-gray-400">IP: {log.ip_address}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredLogs.length === 0 && (
              <div className="p-8 text-center text-gray-500 text-xs">
                কোনো অডিট লগ পাওয়া যায়নি।
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
