'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import OfficialDocumentPrint from '@/components/common/OfficialDocumentPrint';
import { useAuth } from '@/lib/auth-context';
import {
  getStoredNotices,
  saveStoredNotice,
  deleteStoredNotice,
  generateNextNoticeRef,
  recordAuditLog,
} from '@/lib/storage';
import { Notice, NoticeCategory, NoticeStatus } from '@/types';
import { formatBengaliDate, toBengaliDigits } from '@/lib/constants';
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  Printer,
  Eye,
  CheckCircle,
  Clock,
  Send,
  X,
  Save,
  Search,
} from 'lucide-react';

export default function AdminNoticesPage() {
  const { user } = useAuth();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [activePrintNotice, setActivePrintNotice] = useState<Notice | null>(null);

  useEffect(() => {
    refreshList();
  }, []);

  const refreshList = () => {
    setNotices(getStoredNotices());
  };

  const handleOpenCreate = () => {
    const nextRef = generateNextNoticeRef();
    setEditingNotice({
      id: `not-${Date.now()}`,
      ref_number: nextRef,
      title_bn: '',
      category: 'সাংগঠনিক ঘোষণা',
      summary_bn: '',
      body_bn: '',
      issued_by: user?.name || 'মোঃ আরিফ মাঈনুদ্দীন',
      issued_by_role: user?.position_bn || 'সদস্য সচিব',
      issue_date: new Date().toISOString().split('T')[0],
      status: 'খসড়া',
      is_public: false,
      views_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    setIsModalOpen(true);
  };

  const handleEdit = (notice: Notice) => {
    setEditingNotice({ ...notice });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, ref: string) => {
    if (confirm(`আপনি কি নিশ্চিতভাবে স্মারক "${ref}" নোটিশটি ডিলিট করতে চান?`)) {
      deleteStoredNotice(id);
      recordAuditLog(
        'DELETE_NOTICE',
        'notices',
        `নোটিশ বাতিল: ${ref}`,
        user?.name,
        user?.position_bn,
        id
      );
      refreshList();
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNotice || !editingNotice.title_bn || !editingNotice.body_bn) {
      alert('অনুগ্রহ করে শিরোনাম ও মূল বিবরণ পূরণ করুন');
      return;
    }

    // Set is_public true only if status is প্রকাশিত
    const updatedNotice = {
      ...editingNotice,
      is_public: editingNotice.status === 'প্রকাশিত',
      approved_by:
        editingNotice.status === 'অনুমোদিত' || editingNotice.status === 'প্রকাশিত'
          ? user?.name || 'সদস্য সচিব'
          : undefined,
      approved_at:
        editingNotice.status === 'অনুমোদিত' || editingNotice.status === 'প্রকাশিত'
          ? new Date().toISOString()
          : undefined,
    };

    saveStoredNotice(updatedNotice);
    recordAuditLog(
      'SAVE_NOTICE',
      'notices',
      `নোটিশ হালনাগাদ: ${updatedNotice.ref_number} (${updatedNotice.status})`,
      user?.name,
      user?.position_bn,
      updatedNotice.id
    );

    setIsModalOpen(false);
    setEditingNotice(null);
    refreshList();
  };

  const filteredNotices = notices.filter(
    (n) =>
      n.title_bn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.ref_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#F5F8F6]">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-y-auto">
        <AdminHeader
          title="নোটিশ ব্যবস্থাপনা (Notice Management)"
          subtitle="স্বয়ংক্রিয় স্মারক নম্বর, খসড়া, অনুমোদন ও লেটারহেড পাবলিকেশন ওয়ার্কফ্লো"
        />

        <main className="p-6 md:p-8 space-y-6 max-w-7xl w-full">
          {/* Action Header */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="স্মারক নম্বর বা শিরোনাম খুঁজুন..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#F5F8F6] border border-gray-200 rounded-xl pl-10 pr-3.5 py-2 text-xs focus:outline-hidden focus:border-[#075E3B]"
              />
            </div>

            <button
              onClick={handleOpenCreate}
              className="bg-[#075E3B] hover:bg-[#064E31] text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-xs transition cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন নোটিশ তৈরি করুন</span>
            </button>
          </div>

          {/* Notices Grid */}
          <div className="space-y-4">
            {filteredNotices.map((notice) => (
              <div
                key={notice.id}
                className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-4 hover:border-[#075E3B]/40 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold bg-emerald-50 text-[#075E3B] px-3 py-1 rounded-md border border-emerald-200">
                      {notice.ref_number}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-full font-semibold">
                      {notice.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-bold px-3 py-0.5 rounded-full border ${
                        notice.status === 'প্রকাশিত'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                          : notice.status === 'অনুমোদিত'
                          ? 'bg-blue-50 text-blue-700 border-blue-300'
                          : notice.status === 'পর্যালোচনাধীন'
                          ? 'bg-amber-50 text-amber-700 border-amber-300'
                          : 'bg-gray-100 text-gray-600 border-gray-300'
                      }`}
                    >
                      {notice.status}
                    </span>
                    <span className="text-xs text-gray-500">
                      তারিখ: {formatBengaliDate(notice.issue_date)}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 text-base leading-snug">
                    {notice.title_bn}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2 leading-relaxed">
                    {notice.summary_bn}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-gray-500 border-t border-gray-100">
                  <div>
                    <span>ইস্যুকারী: </span>
                    <strong className="text-gray-800">{notice.issued_by}</strong> ({notice.issued_by_role})
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActivePrintNotice(notice)}
                      className="bg-emerald-50 hover:bg-emerald-100 text-[#075E3B] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-emerald-200 transition cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>লেটারহেড প্রিন্ট</span>
                    </button>
                    <button
                      onClick={() => handleEdit(notice)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 transition cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>সম্পাদনা</span>
                    </button>
                    <button
                      onClick={() => handleDelete(notice.id, notice.ref_number)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                      title="মুছে ফেলুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredNotices.length === 0 && (
              <div className="bg-white rounded-2xl p-10 text-center text-gray-500 text-xs">
                কোনো নোটিশ পাওয়া যায়নি।
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Notice Editor Modal */}
      {isModalOpen && editingNotice && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 space-y-5 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-bold text-base text-gray-900">
                  অফিসিয়াল নোটিশ সম্পাদন ও খসড়া প্রস্তুত
                </h3>
                <span className="font-mono text-xs text-[#075E3B] font-bold">
                  স্বয়ংক্রিয় স্মারক নং: {editingNotice.ref_number}
                </span>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">স্মারক নম্বর (Ref No)</label>
                  <input
                    type="text"
                    required
                    value={editingNotice.ref_number}
                    onChange={(e) =>
                      setEditingNotice({ ...editingNotice, ref_number: e.target.value })
                    }
                    className="w-full bg-[#F5F8F6] border border-gray-200 rounded-xl p-2.5 font-mono font-bold text-[#075E3B]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700">ক্যাটাগরি</label>
                  <select
                    value={editingNotice.category}
                    onChange={(e) =>
                      setEditingNotice({
                        ...editingNotice,
                        category: e.target.value as NoticeCategory,
                      })
                    }
                    className="w-full bg-[#F5F8F6] border border-gray-200 rounded-xl p-2.5"
                  >
                    <option value="সাংগঠনিক ঘোষণা">সাংগঠনিক ঘোষণা</option>
                    <option value="সভা বিজ্ঞপ্তি">সভা বিজ্ঞপ্তি</option>
                    <option value="জনগুরুত্বপূর্ণ নোটিশ">জনগুরুত্বপূর্ণ নোটিশ</option>
                    <option value="প্রেস বিজ্ঞপ্তি">প্রেস বিজ্ঞপ্তি</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700">ওয়ার্কফ্লো স্ট্যাটাস</label>
                  <select
                    value={editingNotice.status}
                    onChange={(e) =>
                      setEditingNotice({
                        ...editingNotice,
                        status: e.target.value as NoticeStatus,
                      })
                    }
                    className="w-full bg-[#F5F8F6] border border-gray-200 rounded-xl p-2.5 font-bold text-gray-800"
                  >
                    <option value="খসড়া">খসড়া (Draft)</option>
                    <option value="পর্যালোচনাধীন">পর্যালোচনাধীন (In Review)</option>
                    <option value="অনুমোদিত">অনুমোদিত (Approved)</option>
                    <option value="প্রকাশিত">প্রকাশিত (Published to Public)</option>
                    <option value="আর্কাইভকৃত">আর্কাইভকৃত (Archived)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">নোটিশের শিরোনাম (বাংলা) *</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: বাকলিয়া থানা আহ্বায়ক কমিটির ১ম সাধারণ সভা সংক্রান্ত..."
                  value={editingNotice.title_bn}
                  onChange={(e) =>
                    setEditingNotice({ ...editingNotice, title_bn: e.target.value })
                  }
                  className="w-full bg-[#F5F8F6] border border-gray-200 rounded-xl p-2.5 text-xs md:text-sm font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">সংক্ষিপ্ত সারসংক্ষেপ</label>
                <input
                  type="text"
                  placeholder="নোটিশের ১-২ লাইনের সারমর্ম..."
                  value={editingNotice.summary_bn}
                  onChange={(e) =>
                    setEditingNotice({ ...editingNotice, summary_bn: e.target.value })
                  }
                  className="w-full bg-[#F5F8F6] border border-gray-200 rounded-xl p-2.5"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">মূল নোটিশের বিবরণী (Body Content) *</label>
                <textarea
                  required
                  rows={6}
                  placeholder="পূর্ণাঙ্গ নোটিশের বিষয়বস্তু, তারিখ, সময় ও সিদ্ধান্ত..."
                  value={editingNotice.body_bn}
                  onChange={(e) =>
                    setEditingNotice({ ...editingNotice, body_bn: e.target.value })
                  }
                  className="w-full bg-[#F5F8F6] border border-gray-200 rounded-xl p-3 leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">ইস্যুর তারিখ</label>
                  <input
                    type="date"
                    value={editingNotice.issue_date}
                    onChange={(e) =>
                      setEditingNotice({ ...editingNotice, issue_date: e.target.value })
                    }
                    className="w-full bg-[#F5F8F6] border border-gray-200 rounded-xl p-2.5"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">স্বাক্ষরকারী ও পদবি</label>
                  <input
                    type="text"
                    value={`${editingNotice.issued_by} (${editingNotice.issued_by_role})`}
                    disabled
                    className="w-full bg-gray-100 border border-gray-200 rounded-xl p-2.5 text-gray-600"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-xl transition cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="bg-[#075E3B] hover:bg-[#064E31] text-white font-bold px-5 py-2 rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>নোটিশ সংরক্ষণ করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
    </div>
  );
}
