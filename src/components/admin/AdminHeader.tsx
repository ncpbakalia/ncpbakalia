'use client';

import React from 'react';
import { useAuth } from '@/lib/auth-context';
import { DEMO_USERS } from '@/lib/mock-data';
import { Bell, ShieldCheck, UserCheck, Calendar } from 'lucide-react';
import Link from 'next/link';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
}

export default function AdminHeader({ title, subtitle }: AdminHeaderProps) {
  const { user, loginAsDemo } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 sticky top-0 z-30 shadow-2xs">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-[#075E3B]">{title}</h1>
        {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Quick Role Switcher for Tester Convenience */}
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg text-xs">
          <ShieldCheck className="w-4 h-4 text-[#075E3B]" />
          <span className="text-gray-600 font-medium">ভূমিকা পরিবর্তন:</span>
          <select
            value={user?.id || ''}
            onChange={(e) => loginAsDemo(e.target.value)}
            className="bg-white border border-emerald-300 rounded px-2 py-1 text-xs font-semibold text-[#075E3B] focus:outline-hidden focus:ring-1 focus:ring-[#075E3B] cursor-pointer"
          >
            {DEMO_USERS.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.position_bn})
              </option>
            ))}
          </select>
        </div>

        {/* Current Term Badge */}
        <div className="hidden lg:flex items-center gap-1.5 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-medium">
          <Calendar className="w-3.5 h-3.5 text-[#075E3B]" />
          <span>মেয়াদ: ১৯ সেপ্টেম্বর ২০২৬ হতে ৬ মাস</span>
        </div>
      </div>
    </header>
  );
}
