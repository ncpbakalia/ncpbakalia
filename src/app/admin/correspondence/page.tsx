'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import OfficialDocumentPrint from '@/components/common/OfficialDocumentPrint';
import { useAuth } from '@/lib/auth-context';
import {
  getStoredCorrespondence,
  saveStoredCorrespondence,
  generateNextCorrespondenceRef,
  recordAuditLog,
} from '@/lib/storage';
import {
  CorrespondenceRecord,
  CorrespondenceType,
  ConfidentialityLevel,
  DeliveryMethod,
} from '@/types';
import { formatBengaliDate, toBengaliDigits } from '@/lib/constants';
import {
  MailCheck,
  Plus,
  Search,
  Filter,
  Download,
  Printer,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldAlert,
  Calendar,
  X,
  Save,
} from 'lucide-react';

export default function AdminCorrespondencePage() {
  const { user } = useAuth();
  const [records, setRecords] = useState<CorrespondenceRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<CorrespondenceRecord | null>(null);
  const [activePrintLetter, setActivePrintLetter] = useState<CorrespondenceRecord | null>(null);

  useEffect(() => {
    refreshList();
  }, []);

  const refreshList = () => {
    setRecords(getStoredCorrespondence());
  };

  const handleOpenAdd = () => {
    const nextRef = generateNextCorrespondenceRef();
    setEditingRecord({
      id: `cor-${Date.now()}`,
      ref_number: nextRef,
      type: 'প্রেরিত (Outgoing)',
      date: new Date().toISOString().split('T')[0],
      sender: 'সদস্য সচিব, বাকলিয়া থানা আহ্বায়ক কমিটি',
      recipient: '',
      subject: '',
      category: 'প্রাতিষ্ঠানিক পত্র',
      responsible_officer: user?.name || 'মোঃ আরিফ মাঈনুদ্দীন',
      dispatch_method: 'হাতে হাতে (By Hand)',
      confidentiality: 'সাধারণ (Public/General)',
      delivery_status: 'প্রক্রিয়াধীন',
      created_at: new Date().toISOString(),
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecord || !editingRecord.recipient || !editingRecord.subject) {
      alert('প্রাপক ও বিষয় আবশ্যক');
      return;
    }

    saveStoredCorrespondence(editingRecord);
    recordAuditLog(
      'CORRESPONDENCE_SAVED',
      'correspondence',
      `পত্র নথিভুক্ত: ${editingRecord.ref_number} (${editingRecord.type}) - ${editingRecord.subject}`,
      user?.name,
      user?.position_bn,
      editingRecord.id
    );

    setIsModalOpen(false);
    setEditingRecord(null);
    refreshList();
  };

  const exportCSV = () => {
    const headers = [
      'স্মারক নং',
      'ধরন',
      'তারিখ',
      'প্রেরক',
      'প্রাপক',
      'বিষয়',
      'ক্যাটাগরি',
      'দায়িত্বপ্রাপ্ত কর্মকর্তা',
      'বিতরণ পদ্ধতি',
      'গোপনীয়তা',
      'স্ট্যাটাস',
    ];
    const rows = records.map((r) => [
      r.ref_number,
      r.type,
      r.date,
      r.sender,
      r.recipient,
      `"${r.subject}"`,
      r.category,
      r.responsible_officer,
      r.dispatch_method,
      r.confidentiality,
      r.delivery_status,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `NCP_Bakalia_Correspondence_Register_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      r.ref_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.recipient.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType =
      selectedType === 'all' ||
      (selectedType === 'incoming' && r.type.includes('Incoming')) ||
      (selectedType === 'outgoing' && r.type.includes('Outgoing'));

    return matchesSearch && matchesType;
  });

  return (
    <div className="flex min-h-screen bg-[#F5F8F6]">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-y-auto">
        <AdminHeader
          title="পত্র আদান-প্রদান রেজিস্টার (Correspondence Register)"
          subtitle="বাকলিয়া থানা আহ্বায়ক কমিটির অফিসিয়াল ইনওয়ার্ড ও আউটওয়ার্ড রেজিস্ট্রি ব্যবস্থা"
        />

        <main className="p-6 md:p-8 space-y-6 max-w-7xl w-full">
          {/* Top Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="স্মারক, বিষয় বা প্রেরক খুঁজুন..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#F5F8F6] border border-gray-200 rounded-xl pl-10 pr-3.5 py-2 text-xs focus:outline-hidden focus:border-[#075E3B]"
                />
              </div>

              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-[#F5F8F6] border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 cursor-pointer"
              >
                <option value="all">আগত ও প্রেরিত (সকল)</option>
                <option value="incoming">আগত পত্র (Incoming)</option>
                <option value="outgoing">প্রেরিত পত্র (Outgoing)</option>
              </select>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={exportCSV}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>CSV ডাউনলোড</span>
              </button>

              <button
                onClick={handleOpenAdd}
                className="bg-[#075E3B] hover:bg-[#064E31] text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>নতুন চিঠি নথিভুক্ত করুন</span>
              </button>
            </div>
          </div>

          {/* Table View */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F5F8F6] text-gray-700 font-bold border-b border-gray-200">
                  <tr>
                    <th className="py-3.5 px-4">স্মারক নং ও ধরন</th>
                    <th className="py-3.5 px-4">তারিখ</th>
                    <th className="py-3.5 px-4">প্রেরক ও প্রাপক</th>
                    <th className="py-3.5 px-4">বিষয় ও ক্যাটাগরি</th>
                    <th className="py-3.5 px-4">পদ্ধতি ও গোপনীয়তা</th>
                    <th className="py-3.5 px-4">স্ট্যাটাস</th>
                    <th className="py-3.5 px-4 text-right">লেটারহেড</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredRecords.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50/80 transition">
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-[#075E3B] bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200 block w-fit">
                          {r.ref_number}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] font-semibold text-gray-500 mt-1">
                          {r.type.includes('Outgoing') ? (
                            <ArrowUpRight className="w-3 h-3 text-[#075E3B]" />
                          ) : (
                            <ArrowDownLeft className="w-3 h-3 text-blue-600" />
                          )}
                          <span>{r.type}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-gray-600 whitespace-nowrap">
                        {formatBengaliDate(r.date)}
                        {r.follow_up_deadline && (
                          <div className="text-[10px] text-red-600 font-medium">
                            মেয়াদ: {formatBengaliDate(r.follow_up_deadline)}
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="text-gray-900 font-semibold truncate">
                          <span className="text-gray-400 font-normal">থেকে:</span> {r.sender}
                        </div>
                        <div className="text-gray-700 truncate">
                          <span className="text-gray-400 font-normal">প্রতি:</span> {r.recipient}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-bold text-gray-900 leading-snug">{r.subject}</div>
                        <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded mt-0.5 inline-block">
                          {r.category}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-gray-600">
                        <div>{r.dispatch_method}</div>
                        <span className="text-[10px] text-gray-400">{r.confidentiality}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                          {r.delivery_status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setActivePrintLetter(r)}
                          className="bg-gray-100 hover:bg-emerald-50 text-gray-700 hover:text-[#075E3B] p-2 rounded-lg transition cursor-pointer"
                          title="অফিসিয়াল লেটার প্রিন্ট"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredRecords.length === 0 && (
              <div className="p-8 text-center text-gray-500 text-xs">
                কোনো চিঠিপত্রের রেকর্ড পাওয়া যায়নি।
              </div>
            )}
          </div>
        </main>
      </div>

      {/* New Letter Register Modal */}
      {isModalOpen && editingRecord && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-bold text-base text-gray-900">
                  নতুন চিঠিপত্র রেজিস্টার ভুক্তি (Register Entry)
                </h3>
                <span className="font-mono text-xs text-[#075E3B] font-bold">
                  স্মারক নং: {editingRecord.ref_number}
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
                  <label className="font-bold text-gray-700">ধরন (Type)</label>
                  <select
                    value={editingRecord.type}
                    onChange={(e) =>
                      setEditingRecord({
                        ...editingRecord,
                        type: e.target.value as CorrespondenceType,
                      })
                    }
                    className="w-full bg-[#F5F8F6] border border-gray-200 rounded-xl p-2.5 font-bold"
                  >
                    <option value="প্রেরিত (Outgoing)">প্রেরিত (Outgoing)</option>
                    <option value="আগত (Incoming)">আগত (Incoming)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700">তারিখ</label>
                  <input
                    type="date"
                    value={editingRecord.date}
                    onChange={(e) =>
                      setEditingRecord({ ...editingRecord, date: e.target.value })
                    }
                    className="w-full bg-[#F5F8F6] border border-gray-200 rounded-xl p-2.5"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700">বিতরণ পদ্ধতি</label>
                  <select
                    value={editingRecord.dispatch_method}
                    onChange={(e) =>
                      setEditingRecord({
                        ...editingRecord,
                        dispatch_method: e.target.value as DeliveryMethod,
                      })
                    }
                    className="w-full bg-[#F5F8F6] border border-gray-200 rounded-xl p-2.5"
                  >
                    <option value="হাতে হাতে (By Hand)">হাতে হাতে (By Hand)</option>
                    <option value="ইমেইল (Email)">ইমেইল (Email)</option>
                    <option value="কুরিয়ার / ডাক (Courier/Post)">কুরিয়ার / ডাক (Courier/Post)</option>
                    <option value="ডিজিটাল পোর্টাল (Portal)">ডিজিটাল পোর্টাল (Portal)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">প্রেরক (Sender) *</label>
                  <input
                    type="text"
                    required
                    value={editingRecord.sender}
                    onChange={(e) =>
                      setEditingRecord({ ...editingRecord, sender: e.target.value })
                    }
                    className="w-full bg-[#F5F8F6] border border-gray-200 rounded-xl p-2.5"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700">প্রাপক (Recipient) *</label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: প্রধান প্রকৌশলী, চসিক"
                    value={editingRecord.recipient}
                    onChange={(e) =>
                      setEditingRecord({ ...editingRecord, recipient: e.target.value })
                    }
                    className="w-full bg-[#F5F8F6] border border-gray-200 rounded-xl p-2.5"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">পত্রের বিষয় (Subject) *</label>
                <input
                  type="text"
                  required
                  placeholder="চিঠির মূল বিষয়বস্তু..."
                  value={editingRecord.subject}
                  onChange={(e) =>
                    setEditingRecord({ ...editingRecord, subject: e.target.value })
                  }
                  className="w-full bg-[#F5F8F6] border border-gray-200 rounded-xl p-2.5 font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">ক্যাটাগরি</label>
                  <input
                    type="text"
                    value={editingRecord.category}
                    onChange={(e) =>
                      setEditingRecord({ ...editingRecord, category: e.target.value })
                    }
                    placeholder="যেমন: প্রাতিষ্ঠানিক স্মারকলিপি"
                    className="w-full bg-[#F5F8F6] border border-gray-200 rounded-xl p-2.5"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700">গোপনীয়তার স্তর</label>
                  <select
                    value={editingRecord.confidentiality}
                    onChange={(e) =>
                      setEditingRecord({
                        ...editingRecord,
                        confidentiality: e.target.value as ConfidentialityLevel,
                      })
                    }
                    className="w-full bg-[#F5F8F6] border border-gray-200 rounded-xl p-2.5"
                  >
                    <option value="সাধারণ (Public/General)">সাধারণ (Public/General)</option>
                    <option value="গোপনীয় (Confidential)">গোপনীয় (Confidential)</option>
                    <option value="অতি গোপনীয় (Strictly Confidential)">অতি গোপনীয়</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700">দায়িত্বপ্রাপ্ত কর্মকর্তা</label>
                  <input
                    type="text"
                    value={editingRecord.responsible_officer}
                    onChange={(e) =>
                      setEditingRecord({ ...editingRecord, responsible_officer: e.target.value })
                    }
                    className="w-full bg-[#F5F8F6] border border-gray-200 rounded-xl p-2.5"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">প্রাপ্তিস্বীকার বা ডেলিভারি বিবরণ (ঐচ্ছিক)</label>
                <input
                  type="text"
                  placeholder="যেমন: ডকেট নং বা রিসিভ কপি সিলমোহর..."
                  value={editingRecord.acknowledgment_details || ''}
                  onChange={(e) =>
                    setEditingRecord({ ...editingRecord, acknowledgment_details: e.target.value })
                  }
                  className="w-full bg-[#F5F8F6] border border-gray-200 rounded-xl p-2.5"
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
                  <span>রেজিস্টার সংরক্ষণ করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Printable Sheet Preview */}
      {activePrintLetter && (
        <OfficialDocumentPrint
          documentType="পত্র"
          refNumber={activePrintLetter.ref_number}
          date={activePrintLetter.date}
          recipient={activePrintLetter.recipient}
          subject={activePrintLetter.subject}
          bodyContent={`বরাবর,\n${activePrintLetter.recipient}\n\nবিষয়: ${activePrintLetter.subject}\n\nজাতীয় নাগরিক পার্টি (এনসিপি) বাকলিয়া থানা আহ্বায়ক কমিটির পক্ষ থেকে জানানো যাচ্ছে যে, অত্র অঞ্চলের নাগরিক স্বার্থ ও প্রাতিষ্ঠানিক দায়িত্বের অংশ হিসেবে এই পত্রটি প্রেরণ করা হলো। প্রয়োজনীয় পদক্ষেপ গ্রহণের জন্য বিনীত অনুরোধ জানাচ্ছি।`}
          signatoryLeft={{
            name: 'মোঃ আরিফ মাঈনুদ্দীন',
            designation: 'সদস্য সচিব\nবাকলিয়া থানা আহ্বায়ক কমিটি',
          }}
          notes={activePrintLetter.acknowledgment_details}
          onClose={() => setActivePrintLetter(null)}
        />
      )}
    </div>
  );
}
