'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { getStoredMembers } from '@/lib/storage';
import { CommitteeMember } from '@/types';
import { formatBengaliDate, toBengaliDigits } from '@/lib/constants';
import {
  Search,
  Filter,
  Download,
  Users,
  Shield,
  MapPin,
  Calendar,
  CheckCircle2,
  Mail,
  Phone,
} from 'lucide-react';

export default function CommitteeDirectoryPage() {
  const [members, setMembers] = useState<CommitteeMember[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('all');

  useEffect(() => {
    // Only fetch public approved members
    const list = getStoredMembers().filter((m) => m.is_public && m.status === 'সক্রিয়');
    setMembers(list);
  }, []);

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name_bn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.name_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.position_bn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (member.ward_no && member.ward_no.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesPosition =
      selectedPosition === 'all' ||
      (selectedPosition === 'lead' && (member.role === 'member_secretary' || member.role === 'convener')) ||
      (selectedPosition === 'officer' && member.role === 'officer') ||
      (selectedPosition === 'member' && member.role === 'member');

    return matchesSearch && matchesPosition;
  });

  const exportCSV = () => {
    const headers = ['ক্রমিক', 'নাম (বাংলা)', 'Name (English)', 'পদবি (বাংলা)', 'এলাকা/ওয়ার্ড', 'অনুমোদনের তারিখ'];
    const rows = filteredMembers.map((m, idx) => [
      idx + 1,
      m.name_bn,
      m.name_en,
      m.position_bn,
      m.ward_no || 'বাকলিয়া',
      m.appointment_date,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `NCP_Bakalia_Committee_Directory_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F8F6]">
      <Navbar />

      {/* Header */}
      <section className="bg-gradient-to-r from-[#075E3B] to-[#13804A] text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold">
            <Users className="w-3.5 h-3.5" />
            <span>অনুমোদিত ডিরেক্টরি</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold">
            বাকলিয়া থানা আহ্বায়ক কমিটি ডিরেক্টরি
          </h1>
          <p className="text-emerald-100 text-xs md:text-sm max-w-2xl">
            ১৯ সেপ্টেম্বর ২০২৬ তারিখে অনুমোদিত বাকলিয়া থানা আহ্বায়ক কমিটির বর্তমান পদাধিকারীদের তথ্য তালিকা।
          </p>
        </div>
      </section>

      {/* Main Directory Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-8">
        {/* Search, Filter & Export Bar */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="নাম, পদবি বা ওয়ার্ড দিয়ে খুঁজুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#F5F8F6] border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-xs md:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#075E3B]/20 focus:border-[#075E3B]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
            <div className="flex items-center gap-2 text-xs">
              <Filter className="w-3.5 h-3.5 text-gray-500" />
              <select
                value={selectedPosition}
                onChange={(e) => setSelectedPosition(e.target.value)}
                className="bg-[#F5F8F6] border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 focus:outline-hidden focus:border-[#075E3B] cursor-pointer"
              >
                <option value="all">সকল পদবি</option>
                <option value="lead">মূল নেতৃত্ব (আহ্বায়ক / সদস্য সচিব)</option>
                <option value="officer">যুগ্ম আহ্বায়কবৃন্দ</option>
                <option value="member">কার্যকরী সদস্যবৃন্দ</option>
              </select>
            </div>

            <button
              onClick={exportCSV}
              className="bg-[#075E3B]/10 hover:bg-[#075E3B]/20 text-[#075E3B] font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV ডাউনলোড</span>
            </button>
          </div>
        </div>

        {/* Notice on Privacy */}
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-xs text-emerald-900 flex items-start gap-2.5">
          <Shield className="w-4 h-4 text-[#075E3B] shrink-0 mt-0.5" />
          <p>
            <strong>ব্যক্তিগত তথ্য সুরক্ষানীতি:</strong> প্রাতিষ্ঠানিক নির্দেশিকা অনুযায়ী সম্মানিত সদস্যদের জাতীয় পরিচয়পত্র (এনআইডি), ব্যক্তিগত ফোন নম্বর ও পারিবারিক তথ্য পাবলিক ডিরেক্টরিতে উন্মুক্ত করা হয় না। যোগাযোগের জন্য নির্ধারিত প্রাতিষ্ঠানিক চ্যানেল ব্যবহার করুন।
          </p>
        </div>

        {/* Member Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-2xl p-6 border border-gray-200/90 shadow-2xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="space-y-4 text-center">
                {/* Avatar Badge */}
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-[#075E3B] to-[#13804A] flex items-center justify-center text-white text-2xl font-bold border-4 border-emerald-50 shadow-xs">
                  {member.name_bn.slice(0, 1)}
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 text-base">{member.name_bn}</h3>
                  <p className="text-xs text-gray-500 font-medium font-sans">{member.name_en}</p>
                </div>

                <div className="bg-[#F5F8F6] p-2.5 rounded-xl border border-gray-100">
                  <span className="text-xs font-bold text-[#075E3B] block">
                    {member.position_bn}
                  </span>
                  <span className="text-[11px] text-gray-500 font-medium">
                    {member.ward_no || 'বাকলিয়া থানা'}
                  </span>
                </div>

                {member.bio_bn && (
                  <p className="text-xs text-gray-600 line-clamp-2 italic">
                    {member.bio_bn}
                  </p>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 space-y-2 text-xs">
                <div className="flex items-center justify-between text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span>অনুমোদন:</span>
                  </span>
                  <span className="font-semibold text-gray-700">
                    {formatBengaliDate(member.appointment_date)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-gray-500">
                  <span>স্ট্যাটাস:</span>
                  <span className="text-emerald-700 bg-emerald-50 font-bold px-2 py-0.5 rounded text-[11px] border border-emerald-200">
                    {member.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredMembers.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center text-gray-500">
            অনুসন্ধানের সাথে মেলে এমন কোনো সদস্য পাওয়া যায়নি।
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
