'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { useAuth } from '@/lib/auth-context';
import {
  getStoredFeedback,
  saveStoredFeedback,
  getStoredMembers,
  recordAuditLog,
} from '@/lib/storage';
import { CivicFeedbackItem, CivicStatus } from '@/types';
import { formatBengaliDate, toBengaliDigits, BAKALIA_WARDS } from '@/lib/constants';
import {
  MessageSquareWarning,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  User,
  MapPin,
  Lock,
  Edit2,
  Send,
  X,
  Save,
  Shield,
} from 'lucide-react';

export default function AdminCivicIssuesPage() {
  const { user } = useAuth();
  const [feedbackList, setFeedbackList] = useState<CivicFeedbackItem[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [wardFilter, setWardFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingItem, setEditingItem] = useState<CivicFeedbackItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    refreshList();
    setMembers(getStoredMembers());
  }, []);

  const refreshList = () => {
    setFeedbackList(getStoredFeedback());
  };

  const handleEdit = (item: CivicFeedbackItem) => {
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    saveStoredFeedback(editingItem);
    recordAuditLog(
      'UPDATE_CIVIC_FEEDBACK',
      'civic_feedback',
      `নাগরিক অভিযোগ আপডেট: ${editingItem.tracking_number} -> ${editingItem.status}`,
      user?.name,
      user?.position_bn,
      editingItem.id
    );

    setIsModalOpen(false);
    setEditingItem(null);
    refreshList();
  };

  const filteredList = feedbackList.filter((f) => {
    const matchesSearch =
      f.tracking_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.location_detail.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesWard = wardFilter === 'all' || f.ward === wardFilter;
    const matchesStatus = statusFilter === 'all' || f.status === statusFilter;

    return matchesSearch && matchesWard && matchesStatus;
  });

  return (
    <div className="flex min-h-screen bg-[#F5F8F6]">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-y-auto">
        <AdminHeader
          title="নাগরিক সেবা ও অভিযোগ নিষ্পত্তি (Civic Issue Management)"
          subtitle="বাকলিয়া থানা এলাকার সাধারণ বাসিন্দাদের দাখিলকৃত সমস্যা পর্যালোচনা, দায়িত্ব প্রদান ও অগ্রগতি ট্র্যাকিং"
        />

        <main className="p-6 md:p-8 space-y-6 max-w-7xl w-full">
          {/* Filter Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="ট্র্যাকিং নং, শিরোনাম বা অবস্থান খুঁজুন..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#F5F8F6] border border-gray-200 rounded-xl pl-10 pr-3.5 py-2 text-xs focus:outline-hidden focus:border-[#075E3B]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end text-xs">
              <select
                value={wardFilter}
                onChange={(e) => setWardFilter(e.target.value)}
                className="bg-[#F5F8F6] border border-gray-200 rounded-xl px-3 py-2 text-gray-700 font-semibold cursor-pointer"
              >
                <option value="all">সকল ওয়ার্ড</option>
                {BAKALIA_WARDS.map((w) => (
                  <option key={w.id} value={w.name_bn}>
                    {w.name_bn}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#F5F8F6] border border-gray-200 rounded-xl px-3 py-2 text-gray-700 font-semibold cursor-pointer"
              >
                <option value="all">সকল স্ট্যাটাস</option>
                <option value="গৃহীত">গৃহীত</option>
                <option value="যাচাইাধীন">যাচাইাধীন</option>
                <option value="মাঠ পর্যায়ে পর্যবেক্ষণ">মাঠ পর্যায়ে পর্যবেক্ষণ</option>
                <option value="সংশ্লিষ্ট দপ্তরে প্রেরণ">সংশ্লিষ্ট দপ্তরে প্রেরণ</option>
                <option value="সমাধানকৃত">সমাধানকৃত</option>
                <option value="অযৌক্তিক / বাতিল">অযৌক্তিক / বাতিল</option>
              </select>
            </div>
          </div>

          {/* Issue Cards */}
          <div className="space-y-4">
            {filteredList.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-6 border border-gray-200 shadow-2xs space-y-4 hover:border-[#075E3B]/40 transition"
              >
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-[#075E3B] bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200">
                      {item.tracking_number}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-full font-bold">
                      {item.category}
                    </span>
                    {item.is_confidential && (
                      <span className="text-[10px] bg-red-50 text-red-700 px-2 py-0.5 rounded flex items-center gap-1 font-bold">
                        <Lock className="w-3 h-3" />
                        <span>গোপনীয়</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <span
                      className={`font-bold px-3 py-0.5 rounded-full border ${
                        item.status === 'সমাধানকৃত'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                          : 'bg-amber-50 text-amber-700 border-amber-300'
                      }`}
                    >
                      {item.status}
                    </span>
                    <span className="text-gray-500">
                      তারিখ: {formatBengaliDate(item.created_at)}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 text-base">{item.title}</h3>
                  <div className="text-xs text-gray-600 flex items-center gap-2 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-[#075E3B] shrink-0" />
                    <span>
                      {item.ward} • {item.location_detail}
                    </span>
                  </div>
                  <p className="text-xs text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100 mt-2.5 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Internal Officer & Notes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-[#F5F8F6] p-3.5 rounded-xl border border-gray-100">
                  <div>
                    <span className="text-gray-500 font-medium">দায়িত্বপ্রাপ্ত সমন্বয়ক:</span>
                    <p className="font-bold text-gray-900 mt-0.5">
                      {item.assigned_to || 'এখনও ন্যস্ত করা হয়নি'}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500 font-medium">দাখিলকারী নাগরিক:</span>
                    <p className="font-bold text-gray-900 mt-0.5">
                      {item.is_confidential ? 'গোপনীয় রাখা হয়েছে' : item.citizen_name || 'অজ্ঞাত'}
                      {item.citizen_phone && ` (${item.citizen_phone})`}
                    </p>
                  </div>
                </div>

                {item.resolution_summary && (
                  <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 text-xs space-y-1">
                    <strong className="text-emerald-900">নাগরিককে প্রদর্শিত সমাধানের বিবরণ:</strong>
                    <p className="text-emerald-950">{item.resolution_summary}</p>
                  </div>
                )}

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => handleEdit(item)}
                    className="bg-[#075E3B] hover:bg-[#064E31] text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>স্ট্যাটাস পরিবর্তন ও দায়িত্ব অর্পণ</span>
                  </button>
                </div>
              </div>
            ))}

            {filteredList.length === 0 && (
              <div className="bg-white rounded-2xl p-10 text-center text-gray-500 text-xs">
                কোনো নাগরিক অভিযোগ পাওয়া যায়নি।
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Edit Issue Modal */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-bold text-base text-gray-900">
                  নাগরিক অভিযোগ পরিচালনা ও পদক্ষেপ
                </h3>
                <span className="font-mono text-xs text-[#075E3B] font-bold">
                  ট্র্যাকিং নং: {editingItem.tracking_number}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">স্ট্যাটাস পরিবর্তন</label>
                  <select
                    value={editingItem.status}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        status: e.target.value as CivicStatus,
                      })
                    }
                    className="w-full bg-[#F5F8F6] border border-gray-200 rounded-xl p-2.5 font-bold"
                  >
                    <option value="গৃহীত">গৃহীত</option>
                    <option value="যাচাইাধীন">যাচাইাধীন</option>
                    <option value="মাঠ পর্যায়ে পর্যবেক্ষণ">মাঠ পর্যায়ে পর্যবেক্ষণ</option>
                    <option value="সংশ্লিষ্ট দপ্তরে প্রেরণ">সংশ্লিষ্ট দপ্তরে প্রেরণ</option>
                    <option value="সমাধানকৃত">সমাধানকৃত</option>
                    <option value="অযৌক্তিক / বাতিল">অযৌক্তিক / বাতিল</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700">দায়িত্বপ্রাপ্ত সমন্বয়ক / কর্মকর্তা</label>
                  <select
                    value={editingItem.assigned_to || ''}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, assigned_to: e.target.value })
                    }
                    className="w-full bg-[#F5F8F6] border border-gray-200 rounded-xl p-2.5"
                  >
                    <option value="">নির্বাচন করুন</option>
                    {members.map((m) => (
                      <option key={m.id} value={m.name_bn}>
                        {m.name_bn} ({m.position_bn})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">
                  অভ্যন্তরীণ নোট (Internal Private Notes - নাগরিকদের নিকট অপ্রদর্শিত)
                </label>
                <textarea
                  rows={3}
                  placeholder="সরকারি দপ্তরের সাথে যোগাযোগ, প্রকৌশলীদের মতামত বা তদন্ত নোট..."
                  value={editingItem.internal_notes || ''}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, internal_notes: e.target.value })
                  }
                  className="w-full bg-[#F5F8F6] border border-gray-200 rounded-xl p-2.5"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">
                  নাগরিকদের দৃশ্যমান নিষ্পত্তির বিবরণ (Public Resolution Summary)
                </label>
                <textarea
                  rows={3}
                  placeholder="ট্র্যাকিং পেজে নাগরিকের সুবিধার্থে দৃশ্যমান তথ্য যেমন: চসিকের মাধ্যমে কাজ শুরু হয়েছে..."
                  value={editingItem.resolution_summary || ''}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, resolution_summary: e.target.value })
                  }
                  className="w-full bg-[#F5F8F6] border border-gray-200 rounded-xl p-2.5 font-semibold text-emerald-900"
                />
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
                  <span>সংরক্ষণ করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
