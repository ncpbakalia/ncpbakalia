'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import OfficialDocumentPrint from '@/components/common/OfficialDocumentPrint';
import { useAuth } from '@/lib/auth-context';
import {
  getStoredDisciplinary,
  saveStoredDisciplinary,
  recordAuditLog,
} from '@/lib/storage';
import { DisciplinaryCase, DisciplinaryStatus } from '@/types';
import { formatBengaliDate, toBengaliDigits } from '@/lib/constants';
import {
  ShieldAlert,
  Plus,
  Eye,
  FileWarning,
  Clock,
  Printer,
  CheckCircle,
  AlertOctagon,
  Lock,
  Search,
  X,
  Save,
  ShieldCheck,
} from 'lucide-react';

export default function AdminDisciplinaryPage() {
  const { user, canAccessDisciplinary } = useAuth();
  const [cases, setCases] = useState<DisciplinaryCase[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCase, setActiveCase] = useState<DisciplinaryCase | null>(null);
  const [activePrintNotice, setActivePrintNotice] = useState<DisciplinaryCase | null>(null);

  useEffect(() => {
    if (canAccessDisciplinary()) {
      refreshList();
      recordAuditLog(
        'ACCESS_DISCIPLINARY_MODULE',
        'disciplinary_cases',
        'গোপনীয় শৃঙ্খলা ও তদন্ত সেল পরিদর্শন',
        user?.name,
        user?.position_bn
      );
    }
  }, [user]);

  const refreshList = () => {
    setCases(getStoredDisciplinary());
  };

  const handleOpenAdd = () => {
    const caseCount = cases.length + 1;
    const seq = String(caseCount).padStart(2, '0');
    setActiveCase({
      id: `disc-${Date.now()}`,
      case_number: `NCP/BAK/DISC-2026/${seq}`,
      subject: '',
      accused_member_name: '',
      complainant_name: '',
      incident_date: new Date().toISOString().split('T')[0],
      allegation_details: '',
      show_cause_ref: `NCP/BAK/SC-2026/${seq}`,
      show_cause_date: new Date().toISOString().split('T')[0],
      response_deadline: '',
      written_reply: '',
      evidence_summary: '',
      review_notes: '',
      final_decision: '',
      status: 'খসড়া',
      confidentiality: 'অতি গোপনীয়',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    setIsModalOpen(true);
  };

  const handleEdit = (c: DisciplinaryCase) => {
    setActiveCase({ ...c });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCase || !activeCase.subject || !activeCase.accused_member_name) {
      alert('অভিযোগের বিষয় ও অভিযুক্তের নাম আবশ্যক');
      return;
    }

    saveStoredDisciplinary(activeCase);
    recordAuditLog(
      'DISCIPLINARY_CASE_UPDATED',
      'disciplinary_cases',
      `শৃঙ্খলা নথি হালনাগাদ: ${activeCase.case_number} (${activeCase.status})`,
      user?.name,
      user?.position_bn,
      activeCase.id
    );

    setIsModalOpen(false);
    setActiveCase(null);
    refreshList();
  };

  if (!canAccessDisciplinary()) {
    return (
      <div className="flex min-h-screen bg-[#F5F8F6]">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <AdminHeader title="শৃঙ্খলা ও তদন্ত সেল" />
          <main className="p-8 flex items-center justify-center flex-1">
            <div className="bg-white p-10 rounded-3xl border border-red-200 max-w-md text-center shadow-lg space-y-4">
              <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                <Lock className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">অ্যাক্সেস সংরক্ষিত</h2>
              <p className="text-xs text-gray-600 leading-relaxed">
                শৃঙ্খলা ও তদন্ত সংক্রান্ত নথিগুলো সর্বোচ্চ প্রাতিষ্ঠানিক গোপনীয়তায় সংরক্ষিত। কেবলমাত্র সদস্য সচিব, আহ্বায়ক ও সুপার অ্যাডমিন এই মডিউলে প্রবেশ করতে পারবেন।
              </p>
              <div className="pt-2 text-[11px] text-gray-400 font-mono">
                আপনার বর্তমান ভূমিকা: {user?.position_bn || user?.role}
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const filteredCases = cases.filter(
    (c) =>
      c.case_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.accused_member_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#F5F8F6]">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-y-auto">
        <AdminHeader
          title="শৃঙ্খলা ও অভ্যন্তরীণ তদন্ত সেল (Disciplinary & Investigation Cell)"
          subtitle="কারণ দর্শানোর নোটিশ, জবাব পর্যালোচনা ও বিধিবদ্ধ প্রাতিষ্ঠানিক তদন্ত নথি"
        />

        <main className="p-6 md:p-8 space-y-6 max-w-7xl w-full">
          {/* Security Alert Header */}
          <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-xl text-xs text-red-900 flex items-start justify-between gap-4">
            <div className="flex items-start gap-2.5">
              <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">কঠোর গোপনীয়তা সতর্কতা (Strictly Confidential):</strong>
                <span>
                  কোনো অভিযোগ প্রমাণিত না হওয়া পর্যন্ত তা ব্যক্তিগত সম্মানহানির কাজে ব্যবহার করা দণ্ডনীয়। কারণ দর্শানোর সুযোগ প্রদান ব্যতীত একতরফা সিদ্ধান্ত গ্রহণ সাংগঠনিক নীতিমালার পরিপন্থী।
                </span>
              </div>
            </div>
            <button
              onClick={handleOpenAdd}
              className="bg-[#E32636] hover:bg-[#c91e2c] text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shrink-0 transition shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন তদন্ত কেস খুলুন</span>
            </button>
          </div>

          {/* Cases List */}
          <div className="space-y-4">
            {filteredCases.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-2xl p-6 border border-gray-200 shadow-2xs space-y-4 hover:border-red-300 transition"
              >
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-red-700 bg-red-50 px-3 py-1 rounded-md border border-red-200">
                      {c.case_number}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-full font-bold">
                      {c.status}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    ঘটনার তারিখ: {formatBengaliDate(c.incident_date)}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 text-base">{c.subject}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 bg-[#F5F8F6] p-3.5 rounded-xl text-xs border border-gray-100">
                    <div>
                      <span className="text-gray-500">অভিযুক্ত কর্মী/সদস্য:</span>
                      <p className="font-bold text-gray-900 mt-0.5">{c.accused_member_name}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">অভিযোগকারী:</span>
                      <p className="font-bold text-gray-900 mt-0.5">{c.complainant_name}</p>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-gray-700 space-y-1">
                  <strong className="text-gray-900">অভিযোগের বিবরণ:</strong>
                  <p className="text-gray-600 leading-relaxed">{c.allegation_details}</p>
                </div>

                {c.written_reply && (
                  <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200 text-xs space-y-1">
                    <strong className="text-amber-900">লিখিত জবাব / ব্যাখ্যা:</strong>
                    <p className="text-gray-700">{c.written_reply}</p>
                  </div>
                )}

                {c.final_decision && (
                  <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-xs space-y-1">
                    <strong className="text-emerald-900">অনুমোদিত চূড়ান্ত সিদ্ধান্ত:</strong>
                    <p className="text-emerald-950 font-semibold">{c.final_decision}</p>
                    <p className="text-[11px] text-emerald-700 pt-0.5">
                      অনুমোদনকারী: {c.authorized_by} • তারিখ: {formatBengaliDate(c.decision_date || '')}
                    </p>
                  </div>
                )}

                <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <span className="text-gray-500 font-mono text-[11px]">
                    কারণ দর্শানোর স্মারক: {c.show_cause_ref || 'অপ্রযোজ্য'}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActivePrintNotice(c)}
                      className="bg-red-50 hover:bg-red-100 text-[#E32636] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-red-200 transition cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>কারণ দর্শানোর নোটিশ প্রিন্ট</span>
                    </button>
                    <button
                      onClick={() => handleEdit(c)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold px-3 py-1.5 rounded-lg transition cursor-pointer"
                    >
                      হালনাগাদ / সম্পাদনা
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredCases.length === 0 && (
              <div className="bg-white rounded-2xl p-10 text-center text-gray-500 text-xs">
                কোনো শৃঙ্খলাভঙ্গের তদন্ত কেস নেই।
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Case Editor / Create Modal */}
      {isModalOpen && activeCase && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 space-y-5 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-bold text-base text-gray-900">
                  শৃঙ্খলা মামলার নথি ও পদক্ষেপ ফরম
                </h3>
                <span className="font-mono text-xs text-red-600 font-bold">
                  কেস নং: {activeCase.case_number}
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
                  <label className="font-bold text-gray-700">অভিযুক্ত সদস্য / কর্মীর নাম *</label>
                  <input
                    type="text"
                    required
                    value={activeCase.accused_member_name}
                    onChange={(e) =>
                      setActiveCase({ ...activeCase, accused_member_name: e.target.value })
                    }
                    className="w-full bg-[#F5F8F6] border border-gray-200 rounded-xl p-2.5"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700">অভিযোগকারী / সূত্রের নাম *</label>
                  <input
                    type="text"
                    required
                    value={activeCase.complainant_name}
                    onChange={(e) =>
                      setActiveCase({ ...activeCase, complainant_name: e.target.value })
                    }
                    className="w-full bg-[#F5F8F6] border border-gray-200 rounded-xl p-2.5"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">অভিযোগের বিষয়বস্তু *</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: অননুমোদিত চাঁদা দাবি বা শৃঙ্খলা পরিপন্থী কার্যকলাপ..."
                  value={activeCase.subject}
                  onChange={(e) => setActiveCase({ ...activeCase, subject: e.target.value })}
                  className="w-full bg-[#F5F8F6] border border-gray-200 rounded-xl p-2.5 font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">ঘটনার বিস্তারিত বিবরণ *</label>
                <textarea
                  required
                  rows={3}
                  value={activeCase.allegation_details}
                  onChange={(e) =>
                    setActiveCase({ ...activeCase, allegation_details: e.target.value })
                  }
                  className="w-full bg-[#F5F8F6] border border-gray-200 rounded-xl p-2.5"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">ওয়ার্কফ্লো ধাপ</label>
                  <select
                    value={activeCase.status}
                    onChange={(e) =>
                      setActiveCase({
                        ...activeCase,
                        status: e.target.value as DisciplinaryStatus,
                      })
                    }
                    className="w-full bg-[#F5F8F6] border border-gray-200 rounded-xl p-2.5 font-bold"
                  >
                    <option value="খসড়া">খসড়া (Draft)</option>
                    <option value="পর্যালোচনাধীন">পর্যালোচনাধীন (In Review)</option>
                    <option value="কারণ দর্শানোর নোটিশ জারি">কারণ দর্শানোর নোটিশ জারি</option>
                    <option value="জবাব অপেক্ষমান">জবাব অপেক্ষমান (Awaiting Reply)</option>
                    <option value="জবাব পর্যালোচনা">জবাব পর্যালোচনা</option>
                    <option value="শুনানি অনুষ্ঠিত">শুনানি অনুষ্ঠিত</option>
                    <option value="চূড়ান্ত সিদ্ধান্ত">চূড়ান্ত সিদ্ধান্ত</option>
                    <option value="নিষ্পত্তিকৃত ও আর্কাইভ">নিষ্পত্তিকৃত ও আর্কাইভ</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700">জবাবের শেষ সময়সীমা</label>
                  <input
                    type="date"
                    value={activeCase.response_deadline || ''}
                    onChange={(e) =>
                      setActiveCase({ ...activeCase, response_deadline: e.target.value })
                    }
                    className="w-full bg-[#F5F8F6] border border-gray-200 rounded-xl p-2.5"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700">শোকজ স্মারক নং</label>
                  <input
                    type="text"
                    value={activeCase.show_cause_ref || ''}
                    onChange={(e) =>
                      setActiveCase({ ...activeCase, show_cause_ref: e.target.value })
                    }
                    className="w-full bg-[#F5F8F6] border border-gray-200 rounded-xl p-2.5 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">অভিযুক্তের লিখিত ব্যাখ্যা (যদি প্রাপ্ত হয়)</label>
                <textarea
                  rows={2}
                  value={activeCase.written_reply || ''}
                  onChange={(e) =>
                    setActiveCase({ ...activeCase, written_reply: e.target.value })
                  }
                  className="w-full bg-[#F5F8F6] border border-gray-200 rounded-xl p-2.5"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">অনুমোদিত চূড়ান্ত সিদ্ধান্ত (যৌথ পর্ষদ)</label>
                <textarea
                  rows={2}
                  placeholder="সদস্য সচিব ও ভারপ্রাপ্ত আহ্বায়ক স্বাক্ষরিত চূড়ান্ত সিদ্ধান্ত..."
                  value={activeCase.final_decision || ''}
                  onChange={(e) =>
                    setActiveCase({ ...activeCase, final_decision: e.target.value })
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
                  <span>কেস ফাইল সংরক্ষণ করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Show-Cause Notice Printable Sheet Preview */}
      {activePrintNotice && (
        <OfficialDocumentPrint
          documentType="কারণ দর্শানোর নোটিশ"
          refNumber={activePrintNotice.show_cause_ref || activePrintNotice.case_number}
          date={activePrintNotice.show_cause_date || new Date().toISOString()}
          recipient={`জনাব ${activePrintNotice.accused_member_name}\nবাকলিয়া থানা আহ্বায়ক কমিটি, চট্টগ্রাম মহানগর`}
          subject={`কারণ দর্শানোর নোটিশ: ${activePrintNotice.subject}`}
          bodyContent={`আপনার অবগতির জন্য জানানো যাচ্ছে যে, অত্র কমিটির গোচরে এসেছে যে আপনি নিম্নোক্ত দলীয় শৃঙ্খলা পরিপন্থী বিষয়ে যুক্ত ছিলেন মর্মে অভিযোগ উত্থাপিত হয়েছে:\n\n"${activePrintNotice.allegation_details}"\n\nএমতাবস্থায়, আগামী ${formatBengaliDate(
            activePrintNotice.response_deadline || ''
          )} খ্রি. তারিখের মধ্যে নিম্নস্বাক্ষরকারীদ্বয়ের নিকট আপনার লিখিত ব্যাখ্যা প্রদান করার জন্য নির্দেশ প্রদান করা হলো। নির্ধারিত সময়ের মধ্যে সন্তোষজনক ব্যাখ্যা প্রদানে ব্যর্থ হলে আপনার বিরুদ্ধে সাংগঠনিক সিদ্ধান্ত গ্রহণ করা হবে।`}
          isConfidential={true}
          notes="এই নোটিশটি একটি অভ্যন্তরীণ গোপনীয় প্রাতিষ্ঠানিক নথি। জনসমক্ষে বা সামাজিক মাধ্যমে প্রচার করা নিষিদ্ধ।"
          onClose={() => setActivePrintNotice(null)}
        />
      )}
    </div>
  );
}
