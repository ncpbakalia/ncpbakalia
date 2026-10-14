'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { getStoredActivities } from '@/lib/storage';
import { ActivityReport } from '@/types';
import { formatBengaliDate } from '@/lib/constants';
import { Calendar, MapPin, Tag, Sparkles } from 'lucide-react';

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<ActivityReport[]>([]);

  useEffect(() => {
    const list = getStoredActivities().filter((a) => a.is_published);
    setActivities(list);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F8F6]">
      <Navbar />

      <section className="bg-gradient-to-r from-[#075E3B] to-[#13804A] text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>মাঠ পর্যায়ের কার্যক্রম</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold">
            সাংগঠনিক কার্যক্রম ও জনকল্যাণমূলক উদ্যোগ
          </h1>
          <p className="text-emerald-100 text-xs md:text-sm max-w-2xl">
            বাকলিয়া থানা আহ্বায়ক কমিটির উদ্যোগে পরিচালিত মতবিনিময়, পরিদর্শন এবং নাগরিক অধিকার সচেতনতামূলক কার্যক্রমের সচিত্র বিবরণ।
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activities.map((act) => (
            <div
              key={act.id}
              className="bg-white rounded-2xl overflow-hidden border border-gray-200/90 shadow-2xs hover:shadow-md transition flex flex-col justify-between"
            >
              {/* Image banner simulation */}
              <div className="h-48 bg-gradient-to-br from-emerald-800 to-[#075E3B] flex items-center justify-center p-6 text-white text-center relative">
                <div className="space-y-1">
                  <span className="text-xs bg-white/20 px-2.5 py-1 rounded-full font-semibold">
                    {act.category}
                  </span>
                  <p className="text-xs text-emerald-200 font-mono mt-2">
                    {formatBengaliDate(act.date)}
                  </p>
                </div>
              </div>

              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <MapPin className="w-3.5 h-3.5 text-[#075E3B]" />
                    <span>{act.location}</span>
                  </div>

                  <h3 className="font-bold text-gray-900 text-base leading-snug">
                    {act.title}
                  </h3>

                  <p className="text-xs text-gray-600 leading-relaxed">
                    {act.details}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                  <span>অনুমোদিত প্রাতিষ্ঠানিক প্রতিবেদন</span>
                  <span className="text-emerald-600 font-bold">প্রকাশিত</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
