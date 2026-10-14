'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import OfficialDocumentPrint from '@/components/common/OfficialDocumentPrint';
import { useAuth } from '@/lib/auth-context';
import {
  getStoredMeetings,
  saveStoredMeeting,
  getStoredMembers,
  recordAuditLog,
} from '@/lib/storage';
import { Meeting, MeetingType, MeetingStatus, MeetingResolution } from '@/types';
import { formatBengaliDate, toBengaliDigits } from '@/lib/constants';
import {
  CalendarDays,
  Plus,
  Edit,
  Printer,
  CheckCircle2,
  Clock,
  MapPin,
  Users,
  CheckSquare,
  FileCheck,
  X,
  Save,
} from 'lucide-react';

export default function AdminMeetingsPage() {
  const { user } = useAuth();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);
  const [activePrintMinutes, setActivePrintMinutes] = useState<Meeting | null>(null);

  useEffect(() => {
    refreshList();
    setMembers(getStoredMembers());
  }, []);

  const refreshList = () => {
    setMeetings(getStoredMeetings());
  };

  const handleOpenAdd = () => {
    const meetingCount = meetings.length + 1;
    const seq = String(meetingCount).padStart(2, '0');
    setEditingMeeting({
      id: `meet-${Date.now()}`,
      title: 'বাকলিয়া থানা আহ্বায়ক কমিটির সমন্বয় সভা',
      meeting_no: `MT-BAK-2026-${seq}`,
      type: 'মাসিক সমন্বয় সভা',
      date: new Date().toISOString().split('T')[0],
      time: 'বিকেল ০৪:৩০',
      venue: 'থানা সমন্বয় কার্যালয়, বাকলিয়া, চট্টগ্রাম',
      is_virtual: false,
      presided_by: 'মোহাম্মদ রাশেদুল ইসলাম',
      recorded_by: user?.name || 'মোঃ আরিফ মাঈনুদ্দীন (সদস্য সচিব)',
      status: 'নির্ধারিত',
      is_public_announcement: true,
      public_summary: '',
      agendas: [
        { id: 'ag-1', title: 'বিগত সভার কার্যবিবরণী নিশ্চিতকরণ' },
        { id: 'ag-2', title: 'ওয়ার্ড ভিত্তিক সাংগঠনিক মূল্যায়ন ও নাগরিক সমস্যা পর্যালোচনা' },
      ],
      attendees: members.map((m) => ({
        member_id: m.id,
        member_name: m.name_bn,
        status: 'উপস্থিত',
      })),
      resolutions: [],
      minutes_bn: '',
      minutes_approved: false,
      created_at: new Date().toISOString(),
    });
    setIsModalOpen(true);
  };

  const handleEdit = (m: Meeting) => {
    setEditingMeeting({ ...m });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMeeting || !editingMeeting.title) {
      alert('সভার শিরোনাম আবশ্যক');
      return;
    }

    saveStoredMeeting(editingMeeting);
    recordAuditLog(
      'SAVE_MEETING',
      'meetings',
      `সভা ও কার্যবিবরণী সংরক্ষণ: ${editingMeeting.meeting_no} - ${editingMeeting.title}`,
      user?.name,
      user?.position_bn,
      editingMeeting.id
    );

    setIsModalOpen(false);
    setEditingMeeting(null);
    refreshList();
  };

  return (
    <div className="flex min-h-screen bg-[#F5F8F6]">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-y-auto">
        <AdminHeader
          title="সভা ও কার্যবিবরণী ব্যবস্থাপনা (Meetings & Minutes)"
          subtitle="বাকলিয়া থানা আহ্বায়ক কমিটির সভা আহ্বান, আলোচ্যসূচি, উপস্থিতি ও রেজুলেশন অনুমোদন"
        />

        <main className="p-6 md:p-8 space-y-6 max-w-7xl w-full">
          {/* Action Header */}
          <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
            <span className="text-xs font-semibold text-gray-600">
              মোট নথিভুক্ত সভা: <strong>{toBengaliDigits(meetings.length)}</strong> টি
            </span>
            <button
              onClick={handleOpenAdd}
              className="bg-[#075E3B] hover:bg-[#064E31] text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন সভা শিডিউল করুন</span>
            </button>
          </div>

          {/* Meetings List */}
          <div className="space-y-4">
            {meetings.map((m) => (
              <div
                key={m.id}
                className="bg-white rounded-2xl p-6 border border-gray-200 shadow-2xs space-y-4 hover:border-[#075E3B]/40 transition"
              >
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold bg-emerald-50 text-[#075E3B] px-3 py-1 rounded-md border border-emerald-200">
                      {m.meeting_no}
                    </span>
                    <span className="text-xs font-bold text-gray-700 bg-gray-100 px-2.5 py-0.5 rounded-full">
                      {m.type}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <span
                      className={`font-bold px-3 py-0.5 rounded-full border ${
                        m.status === 'সম্পন্ন'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                          : 'bg-blue-50 text-blue-700 border-blue-300'
                      }`}
                    >
                      {m.status}
                    </span>
                    <span className="text-gray-500">তারিখ: {formatBengaliDate(m.date)}</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 text-base">{m.title}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 mt-2">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      <span>{m.time}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      <span>{m.venue}</span>
                    </span>
                    <span>
                      সভাপতি: <strong>{m.presided_by}</strong>
                    </span>
                  </div>
                </div>

                {/* Agendas Preview */}
                <div className="bg-[#F5F8F6] p-3.5 rounded-xl border border-gray-100 text-xs space-y-1">
                  <span className="font-bold text-gray-700 block">আলোচ্যসূচি:</span>
                  <ul className="list-disc list-inside text-gray-600 space-y-0.5">
                    {m.agendas.map((ag) => (
                      <li key={ag.id}>{ag.title}</li>
                    ))}
                  </ul>
                </div>

                {m.minutes_bn && (
                  <div className="text-xs text-gray-700 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100 space-y-1">
                    <div className="flex justify-between items-center">
                      <strong className="text-emerald-900">গৃহীত কার্যবিবরণী:</strong>
                      <span className="text-[10px] text-emerald-800 font-bold bg-white px-2 py-0.5 rounded border border-emerald-200">
                        {m.minutes_approved ? 'অনুমোদিত' : 'অনুমোদনাধীন'}
                      </span>
                    </div>
                    <p className="text-gray-700 whitespace-pre-line">{m.minutes_bn}</p>
                  </div>
                )}

                <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <span className="text-gray-500">
                    উপস্থিতি নথিভুক্ত: <strong>{toBengaliDigits(m.attendees?.length || 0)}</strong> জন
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActivePrintMinutes(m)}
                      className="bg-emerald-50 hover:bg-emerald-100 text-[#075E3B] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-emerald-200 transition cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>কার্যবিবরণী প্রিন্ট (A4)</span>
                    </button>
                    <button
                      onClick={() => handleEdit(m)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold px-3 py-1.5 rounded-lg transition cursor-pointer"
                    >
                      সম্পাদনা ও রেজুলেশন
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Meeting Editor Modal */}
      {isModalOpen && editingMeeting && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 space-y-5 shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-bold text-base text-gray-900">
                  সভা ও কার্যবিবরণী লিপিবদ্ধকরণ
                </h3>
                <span className="font-mono text-xs text-[#075E3B] font-bold">
                  সভা নম্বর: {editingMeeting.meeting_no}
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
              <div className="space-y-1">
                <label className="font-bold text-gray-700">সভার শিরোনাম *</label>
                <input
                  type="text"
                  required
                  value={editingMeeting.title}
                  onChange={(e) =>
                    setEditingMeeting({ ...editingMeeting, title: e.target.value })
                  }
                  className="w-full bg-[#F5F8F6] border border-gray-200 rounded-xl p-2.5 font-semibold text-xs md:text-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">সভার ধরন</label>
                  <select
                    value={editingMeeting.type}
                    onChange={(e) =>
                      setEditingMeeting({
                        ...editingMeeting,
                        type: e.target.value as MeetingType,
                      })
                    }
                    className="w-full bg-[#F5F8F6] border border-gray-200 rounded-xl p-2.5"
                  >
                    <option value="মাসিক সমন্বয় সভা">মাসিক সমন্বয় সভা</option>
                    <option value="সাধারণ সভা">সাধারণ সভা</option>
                    <option value="জরুরি সভা">জরুরি সভা</option>
                    <option value="নাগরিক মতবিনিময় সভা">নাগরিক মতবিনিময় সভা</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700">তারিখ</label>
                  <input
                    type="date"
                    value={editingMeeting.date}
                    onChange={(e) =>
                      setEditingMeeting({ ...editingMeeting, date: e.target.value })
                    }
                    className="w-full bg-[#F5F8F6] border border-gray-200 rounded-xl p-2.5"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700">সময়</label>
                  <input
                    type="text"
                    value={editingMeeting.time}
                    onChange={(e) =>
                      setEditingMeeting({ ...editingMeeting, time: e.target.value })
                    }
                    className="w-full bg-[#F5F8F6] border border-gray-200 rounded-xl p-2.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">স্থান (Venue)</label>
                  <input
                    type="text"
                    value={editingMeeting.venue}
                    onChange={(e) =>
                      setEditingMeeting({ ...editingMeeting, venue: e.target.value })
                    }
                    className="w-full bg-[#F5F8F6] border border-gray-200 rounded-xl p-2.5"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700">সভাপতিত্বকারী</label>
                  <input
                    type="text"
                    value={editingMeeting.presided_by}
                    onChange={(e) =>
                      setEditingMeeting({ ...editingMeeting, presided_by: e.target.value })
                    }
                    className="w-full bg-[#F5F8F6] border border-gray-200 rounded-xl p-2.5"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">সভার বিস্তারিত কার্যবিবরণী (Minutes Text)</label>
                <textarea
                  rows={4}
                  placeholder="উপস্থিতি, আলোচনা ও সর্বসম্মত সিদ্ধান্তসমূহ..."
                  value={editingMeeting.minutes_bn || ''}
                  onChange={(e) =>
                    setEditingMeeting({ ...editingMeeting, minutes_bn: e.target.value })
                  }
                  className="w-full bg-[#F5F8F6] border border-gray-200 rounded-xl p-3 leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-700">
                  <input
                    type="checkbox"
                    checked={editingMeeting.minutes_approved}
                    onChange={(e) =>
                      setEditingMeeting({ ...editingMeeting, minutes_approved: e.target.checked })
                    }
                    className="w-4 h-4 text-[#075E3B] rounded"
                  />
                  <span>কার্যবিবরণী আনুষ্ঠানিকভাবে অনুমোদিত</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-700">
                  <input
                    type="checkbox"
                    checked={editingMeeting.is_public_announcement}
                    onChange={(e) =>
                      setEditingMeeting({
                        ...editingMeeting,
                        is_public_announcement: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-[#075E3B] rounded"
                  />
                  <span>পাবলিক সভার তালিকায় প্রদর্শন</span>
                </label>
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

      {/* Minutes Printable Preview */}
      {activePrintMinutes && (
        <OfficialDocumentPrint
          documentType="কার্যবিবরণী"
          refNumber={activePrintMinutes.meeting_no}
          date={activePrintMinutes.date}
          subject={`কার্যবিবরণী: ${activePrintMinutes.title}`}
          bodyContent={`স্থান: ${activePrintMinutes.venue}\nসময়: ${activePrintMinutes.time}\nসভাপতিত্ব: ${activePrintMinutes.presided_by}\nকার্যবিবরণী লিপিবদ্ধকারী: ${activePrintMinutes.recorded_by}\n\nআলোচ্যসূচি:\n${activePrintMinutes.agendas
            .map((a, i) => `${i + 1}. ${a.title}`)
            .join('\n')}\n\nকার্যবিবরণী ও সিদ্ধান্তসমূহ:\n${activePrintMinutes.minutes_bn || 'কার্যবিবরণী প্রস্তুত প্রক্রিয়াধীন।'}`}
          signatoryLeft={{
            name: 'মোঃ আরিফ মাঈনুদ্দীন',
            designation: 'সদস্য সচিব\nবাকলিয়া থানা আহ্বায়ক কমিটি',
          }}
          signatoryRight={{
            name: activePrintMinutes.presided_by,
            designation: 'আহ্বায়ক / সভাপতি\nবাকলিয়া থানা আহ্বায়ক কমিটি',
          }}
          onClose={() => setActivePrintMinutes(null)}
        />
      )}
    </div>
  );
}
