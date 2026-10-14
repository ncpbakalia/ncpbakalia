'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { useAuth } from '@/lib/auth-context';
import { getStoredSettings, saveStoredSettings, recordAuditLog } from '@/lib/storage';
import { SiteSettings } from '@/types';
import { Settings, Save, CheckCircle2, Shield, Building2 } from 'lucide-react';

export default function AdminSettingsPage() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setSettings(getStoredSettings());
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    saveStoredSettings(settings);
    recordAuditLog(
      'UPDATE_SETTINGS',
      'site_settings',
      'কমিটি ও সিস্টেম কনফিগারেশন সেটিংস হালনাগাদ',
      user?.name,
      user?.position_bn
    );

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  if (!settings) return null;

  return (
    <div className="flex min-h-screen bg-[#F5F8F6]">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-y-auto">
        <AdminHeader
          title="সিস্টেম ও প্রাতিষ্ঠানিক সেটিংস (System Settings)"
          subtitle="বাকলিয়া থানা আহ্বায়ক কমিটির আনুষ্ঠানিক নীতিমালা, মেয়াদ ও তথ্য কনফিগারেশন"
        />

        <main className="p-6 md:p-8 space-y-6 max-w-4xl w-full">
          {savedSuccess && (
            <div className="bg-emerald-50 border border-emerald-300 text-[#075E3B] p-4 rounded-xl text-xs flex items-center gap-2 font-bold animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>সেটিংস সফলভাবে সংরক্ষিত হয়েছে।</span>
            </div>
          )}

          <form onSubmit={handleSave} className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-xs space-y-6 text-xs">
            {/* Committee Term & Approval */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b pb-2 text-sm font-bold text-gray-900">
                <Building2 className="w-4 h-4 text-[#075E3B]" />
                <span>কমিটি অনুমোদন ও মেয়াদ কনফিগারেশন</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">অনুমোদনের তারিখ</label>
                  <input
                    type="date"
                    value={settings.approval_date}
                    onChange={(e) =>
                      setSettings({ ...settings, approval_date: e.target.value })
                    }
                    className="w-full bg-[#F5F8F6] border border-gray-200 rounded-xl p-2.5 font-bold text-[#075E3B]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700">মেয়াদকাল (মাস)</label>
                  <input
                    type="number"
                    value={settings.term_months}
                    onChange={(e) =>
                      setSettings({ ...settings, term_months: parseInt(e.target.value, 10) })
                    }
                    className="w-full bg-[#F5F8F6] border border-gray-200 rounded-xl p-2.5 font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700">কমিটি মেয়াদ স্ট্যাটাস</label>
                  <select
                    value={settings.term_status}
                    onChange={(e) =>
                      setSettings({ ...settings, term_status: e.target.value })
                    }
                    className="w-full bg-[#F5F8F6] border border-gray-200 rounded-xl p-2.5 font-bold"
                  >
                    <option value="চলমান মেয়াদ (Active Term)">চলমান মেয়াদ (Active Term)</option>
                    <option value="মেয়াদ সমাপ্ত (Expired)">মেয়াদ সমাপ্ত (Expired)</option>
                    <option value="নবায়নকৃত মেয়াদ (Renewed)">নবায়নকৃত মেয়াদ (Renewed)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Official Leadership Names */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 border-b pb-2 text-sm font-bold text-gray-900">
                <Shield className="w-4 h-4 text-[#075E3B]" />
                <span>দায়িত্বপ্রাপ্ত নেতৃত্ব (Authorized Signatories)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">সদস্য সচিব (Member Secretary) *</label>
                  <input
                    type="text"
                    required
                    value={settings.member_secretary_name_bn}
                    onChange={(e) =>
                      setSettings({ ...settings, member_secretary_name_bn: e.target.value })
                    }
                    className="w-full bg-[#F5F8F6] border border-gray-200 rounded-xl p-2.5 font-bold text-gray-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700">ভারপ্রাপ্ত আহ্বায়ক (Convener) *</label>
                  <input
                    type="text"
                    required
                    value={settings.convener_name_bn}
                    onChange={(e) =>
                      setSettings({ ...settings, convener_name_bn: e.target.value })
                    }
                    className="w-full bg-[#F5F8F6] border border-gray-200 rounded-xl p-2.5 font-bold text-gray-900"
                  />
                </div>
              </div>
            </div>

            {/* Official Contact & Office */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 border-b pb-2 text-sm font-bold text-gray-900">
                <Settings className="w-4 h-4 text-[#075E3B]" />
                <span>দপ্তর ও যোগাযোগ চ্যানেল</span>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">দপ্তর কার্যালয় ঠিকানা</label>
                <input
                  type="text"
                  value={settings.office_address_bn}
                  onChange={(e) =>
                    setSettings({ ...settings, office_address_bn: e.target.value })
                  }
                  className="w-full bg-[#F5F8F6] border border-gray-200 rounded-xl p-2.5"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">অফিসিয়াল ইমেইল</label>
                  <input
                    type="email"
                    value={settings.official_email}
                    onChange={(e) =>
                      setSettings({ ...settings, official_email: e.target.value })
                    }
                    className="w-full bg-[#F5F8F6] border border-gray-200 rounded-xl p-2.5 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700">অফিসিয়াল হেল্পলাইন</label>
                  <input
                    type="text"
                    value={settings.official_helpline}
                    onChange={(e) =>
                      setSettings({ ...settings, official_helpline: e.target.value })
                    }
                    className="w-full bg-[#F5F8F6] border border-gray-200 rounded-xl p-2.5 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">স্মারক নম্বর প্রথমাংশ (Ref Prefix)</label>
                <input
                  type="text"
                  value={settings.ref_prefix}
                  onChange={(e) =>
                    setSettings({ ...settings, ref_prefix: e.target.value })
                  }
                  className="w-full bg-[#F5F8F6] border border-gray-200 rounded-xl p-2.5 font-mono font-bold text-[#075E3B]"
                />
              </div>
            </div>

            <div className="pt-4 border-t flex justify-end">
              <button
                type="submit"
                className="bg-[#075E3B] hover:bg-[#064E31] text-white font-bold px-6 py-2.5 rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>সেটিংস হালনাগাদ করুন</span>
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
