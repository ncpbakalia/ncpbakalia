'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import OfficialDocumentPrint from '@/components/common/OfficialDocumentPrint';
import { useAuth } from '@/lib/auth-context';
import {
  getStoredMembers,
  saveStoredMember,
  deleteStoredMember,
  recordAuditLog,
} from '@/lib/storage';
import { CommitteeMember, RoleType, CommitteeStatus } from '@/types';
import { formatBengaliDate, toBengaliDigits, BAKALIA_WARDS } from '@/lib/constants';
import {
  Users,
  UserPlus,
  Edit2,
  Trash2,
  Download,
  Printer,
  Search,
  Filter,
  CheckCircle2,
  Shield,
  Eye,
  X,
  Save,
} from 'lucide-react';

export default function AdminCommitteePage() {
  const { user } = useAuth();
  const [members, setMembers] = useState<CommitteeMember[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [editingMember, setEditingMember] = useState<CommitteeMember | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showRosterPrint, setShowRosterPrint] = useState(false);

  useEffect(() => {
    refreshList();
  }, []);

  const refreshList = () => {
    setMembers(getStoredMembers());
  };

  const handleOpenAdd = () => {
    setEditingMember({
      id: `mem-${Date.now()}`,
      name_bn: '',
      name_en: '',
      position_bn: 'কার্যকরী সদস্য',
      position_en: 'Executive Member',
      role: 'member',
      ward_no: BAKALIA_WARDS[0].name_bn,
      phone_public: '',
      phone_private: '',
      nid_number: '',
      email: '',
      bio_bn: '',
      appointment_date: '2026-09-19',
      term_start: '2026-09-19',
      status: 'সক্রিয়',
      is_public: true,
      order_index: members.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (member: CommitteeMember) => {
    setEditingMember({ ...member });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`আপনি কি নিশ্চিতভাবে "${name}" এর সদস্য রেকর্ড মুছে ফেলতে চান?`)) {
      deleteStoredMember(id);
      recordAuditLog(
        'DELETE_MEMBER',
        'committee_members',
        `সদস্য পদ বা রেকর্ড বাতিল: ${name}`,
        user?.name,
        user?.position_bn,
        id
      );
      refreshList();
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember || !editingMember.name_bn) {
      alert('সদস্যের নাম বাংলা আবশ্যক');
      return;
    }

    saveStoredMember(editingMember);
    recordAuditLog(
      editingMember.id.startsWith('mem-0') ? 'UPDATE_MEMBER' : 'CREATE_MEMBER',
      'committee_members',
      `সদস্য তথ্য সংরক্ষণ: ${editingMember.name_bn} (${editingMember.position_bn})`,
      user?.name,
      user?.position_bn,
      editingMember.id
    );

    setIsModalOpen(false);
    setEditingMember(null);
    refreshList();
  };

  const exportCSV = () => {
    const headers = [
      'ক্রমিক',
      'নাম (বাংলা)',
      'পদবি',
      'ওয়ার্ড/এলাকা',
      'পাবলিক ফোন',
      'অভ্যন্তরীণ ফোন (Internal)',
      'এনআইডি (Internal)',
      'অনুমোদনের তারিখ',
      'স্ট্যাটাস',
    ];
    const rows = members.map((m, idx) => [
      idx + 1,
      m.name_bn,
      m.position_bn,
      m.ward_no || 'বাকলিয়া',
      m.phone_public || 'অপ্রকাশিত',
      m.phone_private || 'অপ্রকাশিত',
      m.nid_number || 'অপ্রকাশিত',
      m.appointment_date,
      m.status,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `NCP_Bakalia_Admin_Roster_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.name_bn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.position_bn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.ward_no && m.ward_no.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = selectedStatus === 'all' || m.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const rosterPrintContent = `জাতীয় নাগরিক পার্টি (এনসিপি) বাকলিয়া থানা আহ্বায়ক কমিটির অনুমোদিত পদাধিকারী ও সদস্যবৃন্দের তালিকা:\n\n${filteredMembers
    .map(
      (m, i) =>
        `${i + 1}. ${m.name_bn} — ${m.position_bn} (${m.ward_no || 'বাকলিয়া'}) | অনুমোদন: ${formatBengaliDate(
          m.appointment_date
        )} | স্ট্যাটাস: ${m.status}`
    )
    .join('\n')}\n\nসদস্য সচিব ও ভারপ্রাপ্ত আহ্বায়ক স্বাক্ষরিত আনুষ্ঠানিক ডাটাবেজ থেকে প্রস্তুতকৃত।`;

  return (
    <div className="flex min-h-screen bg-[#F5F8F6]">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-y-auto">
        <AdminHeader
          title="কমিটি ব্যবস্থাপনা ও সদস্য তালিকা"
          subtitle="বাকলিয়া থানা আহ্বায়ক কমিটির সদস্য রেকর্ড, দায়িত্ব ও পদমর্যাদা নিয়ন্ত্রণ"
        />

        <main className="p-6 md:p-8 space-y-6 max-w-7xl w-full">
          {/* Top Actions Bar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="নাম, পদবি বা ওয়ার্ড খুঁজুন..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#F5F8F6] border border-gray-200 rounded-xl pl-10 pr-3.5 py-2 text-xs focus:outline-hidden focus:border-[#075E3B]"
                />
              </div>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-[#F5F8F6] border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 cursor-pointer"
              >
                <option value="all">সকল স্ট্যাটাস</option>
                <option value="সক্রিয়">সক্রিয়</option>
                <option value="অব্যাহতি">অব্যাহতি</option>
                <option value="মেয়াদোত্তীর্ণ">মেয়াদোত্তীর্ণ</option>
                <option value="স্থগিত">স্থগিত</option>
              </select>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
              <button
                onClick={exportCSV}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>CSV রফতানি</span>
              </button>

              <button
                onClick={() => setShowRosterPrint(true)}
                className="bg-emerald-50 hover:bg-emerald-100 text-[#075E3B] font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 border border-emerald-200 transition cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>রোস্টার প্রিন্ট</span>
              </button>

              <button
                onClick={handleOpenAdd}
                className="bg-[#075E3B] hover:bg-[#064E31] text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>নতুন সদস্য যুক্ত করুন</span>
              </button>
            </div>
          </div>

          {/* Members Table */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F5F8F6] text-gray-700 font-bold border-b border-gray-200">
                  <tr>
                    <th className="py-3.5 px-4">নাম ও পরিচয়</th>
                    <th className="py-3.5 px-4">পদবি ও রোল</th>
                    <th className="py-3.5 px-4">ওয়ার্ড/অঞ্চল</th>
                    <th className="py-3.5 px-4">অভ্যন্তরীণ ফোন ও এনআইডি</th>
                    <th className="py-3.5 px-4">অনুমোদনের তারিখ</th>
                    <th className="py-3.5 px-4">স্ট্যাটাস</th>
                    <th className="py-3.5 px-4 text-right">কার্যক্রম</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50/80 transition">
                      <td className="py-3 px-4">
                        <div className="font-bold text-gray-900">{member.name_bn}</div>
                        <div className="text-[11px] text-gray-400 font-sans">{member.name_en}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-[#075E3B] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                          {member.position_bn}
                        </span>
                        <div className="text-[10px] text-gray-400 capitalize mt-0.5">
                          {member.role}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {member.ward_no || 'বাকলিয়া থানা'}
                      </td>
                      <td className="py-3 px-4 text-gray-600 font-mono text-[11px]">
                        <div>{member.phone_private || member.phone_public || 'অনির্ধারিত'}</div>
                        <div className="text-[10px] text-gray-400">
                          NID: {member.nid_number || 'সংরক্ষিত নেই'}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {formatBengaliDate(member.appointment_date)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                            member.status === 'সক্রিয়'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {member.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-1">
                        <button
                          onClick={() => handleEdit(member)}
                          className="p-1.5 text-gray-600 hover:text-[#075E3B] hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                          title="সম্পাদনা করুন"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(member.id, member.name_bn)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredMembers.length === 0 && (
              <div className="p-8 text-center text-gray-500 text-xs">
                কোনো সদস্য তথ্য পাওয়া যায়নি।
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Member Edit / Create Modal */}
      {isModalOpen && editingMember && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-gray-900">
                {editingMember.name_bn ? 'সদস্য তথ্য সম্পাদনা' : 'নতুন সদস্য অন্তর্ভুক্তি'}
              </h3>
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
                  <label className="font-bold text-gray-700">নাম (বাংলা) *</label>
                  <input
                    type="text"
                    required
                    value={editingMember.name_bn}
                    onChange={(e) =>
                      setEditingMember({ ...editingMember, name_bn: e.target.value })
                    }
                    className="w-full bg-[#F5F8F6] border border-gray-200 rounded-xl p-2.5 focus:outline-hidden focus:border-[#075E3B]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Name (English)</label>
                  <input
                    type="text"
                    value={editingMember.name_en}
                    onChange={(e) =>
                      setEditingMember({ ...editingMember, name_en: e.target.value })
                    }
                    className="w-full bg-[#F5F8F6] border border-gray-200 rounded-xl p-2.5 focus:outline-hidden focus:border-[#075E3B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">পদবি (বাংলা) *</label>
                  <input
                    type="text"
                    required
                    value={editingMember.position_bn}
                    onChange={(e) =>
                      setEditingMember({ ...editingMember, position_bn: e.target.value })
                    }
                    className="w-full bg-[#F5F8F6] border border-gray-200 rounded-xl p-2.5 focus:outline-hidden focus:border-[#075E3B]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">ওয়ার্ড / এলাকা</label>
                  <select
                    value={editingMember.ward_no}
                    onChange={(e) =>
                      setEditingMember({ ...editingMember, ward_no: e.target.value })
                    }
                    className="w-full bg-[#F5F8F6] border border-gray-200 rounded-xl p-2.5 focus:outline-hidden focus:border-[#075E3B]"
                  >
                    {BAKALIA_WARDS.map((w) => (
                      <option key={w.id} value={w.name_bn}>
                        {w.name_bn}
                      </option>
                    ))}
                    <option value="বাকলিয়া থানা">বাকলিয়া থানা (সার্বিক)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">অভ্যন্তরীণ ফোন (Internal)</label>
                  <input
                    type="text"
                    value={editingMember.phone_private || ''}
                    onChange={(e) =>
                      setEditingMember({ ...editingMember, phone_private: e.target.value })
                    }
                    className="w-full bg-[#F5F8F6] border border-gray-200 rounded-xl p-2.5 font-mono focus:outline-hidden focus:border-[#075E3B]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">জাতীয় পরিচয়পত্র নম্বর (NID)</label>
                  <input
                    type="text"
                    value={editingMember.nid_number || ''}
                    onChange={(e) =>
                      setEditingMember({ ...editingMember, nid_number: e.target.value })
                    }
                    className="w-full bg-[#F5F8F6] border border-gray-200 rounded-xl p-2.5 font-mono focus:outline-hidden focus:border-[#075E3B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">অনুমোদনের তারিখ</label>
                  <input
                    type="date"
                    value={editingMember.appointment_date}
                    onChange={(e) =>
                      setEditingMember({ ...editingMember, appointment_date: e.target.value })
                    }
                    className="w-full bg-[#F5F8F6] border border-gray-200 rounded-xl p-2.5 focus:outline-hidden focus:border-[#075E3B]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700">কমিটি স্ট্যাটাস</label>
                  <select
                    value={editingMember.status}
                    onChange={(e) =>
                      setEditingMember({
                        ...editingMember,
                        status: e.target.value as CommitteeStatus,
                      })
                    }
                    className="w-full bg-[#F5F8F6] border border-gray-200 rounded-xl p-2.5 focus:outline-hidden focus:border-[#075E3B]"
                  >
                    <option value="সক্রিয়">সক্রিয়</option>
                    <option value="অব্যাহতি">অব্যাহতি</option>
                    <option value="মেয়াদোত্তীর্ণ">মেয়াদোত্তীর্ণ</option>
                    <option value="স্থগিত">স্থগিত</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700">সিস্টেম রোল (Role)</label>
                  <select
                    value={editingMember.role}
                    onChange={(e) =>
                      setEditingMember({
                        ...editingMember,
                        role: e.target.value as RoleType,
                      })
                    }
                    className="w-full bg-[#F5F8F6] border border-gray-200 rounded-xl p-2.5 focus:outline-hidden focus:border-[#075E3B]"
                  >
                    <option value="member">সদস্য (Member)</option>
                    <option value="officer">দায়িত্বপ্রাপ্ত কর্মকর্তা (Officer)</option>
                    <option value="member_secretary">সদস্য সচিব (Member Secretary)</option>
                    <option value="convener">আহ্বায়ক (Convener)</option>
                  </select>
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
                  <span>সংরক্ষণ করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Roster A4 Print Preview */}
      {showRosterPrint && (
        <OfficialDocumentPrint
          documentType="পত্র"
          refNumber="NCP/BAKALIA/ROSTER/2026/01"
          date="2026-09-19"
          subject="বাকলিয়া থানা আহ্বায়ক কমিটির আনুষ্ঠানিক সদস্য রোস্টার ও কার্যতালিকা"
          bodyContent={rosterPrintContent}
          onClose={() => setShowRosterPrint(false)}
        />
      )}
    </div>
  );
}
