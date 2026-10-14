'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { DEMO_USERS } from '@/lib/mock-data';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  UserCheck,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { user, login, loginAsDemo } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('অনুগ্রহ করে ইমেইল ঠিকানা প্রদান করুন');
      return;
    }
    const success = login(email);
    if (success) {
      router.push('/admin');
    } else {
      setError('লগইন ব্যর্থ হয়েছে। সঠিক তথ্য প্রদান করুন।');
    }
  };

  const handleDemoSelect = (userId: string) => {
    loginAsDemo(userId);
    router.push('/admin');
  };

  return (
    <div className="min-h-screen bg-[#F5F8F6] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        {/* Emblem */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#075E3B] to-[#13804A] flex items-center justify-center text-white font-extrabold text-xl mx-auto shadow-md border-2 border-[#E32636]/40">
          NCP
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900">প্রশাসনিক অভ্যন্তরীণ পোর্টাল</h2>
          <p className="text-xs text-[#075E3B] font-semibold mt-0.5">
            বাকলিয়া থানা আহ্বায়ক কমিটি • জাতীয় নাগরিক পার্টি (এনসিপি)
          </p>
          <p className="text-[11px] text-gray-500 mt-1">
            অনুমোদনের তারিখ: ১৯ সেপ্টেম্বর ২০২৬ • চট্টগ্রাম মহানগর
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg px-4">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-gray-200 shadow-xl space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Demo Accounts Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-[#075E3B]" />
                <span>দ্রুত টেস্ট অ্যাক্সেস (ভূমিকা নির্বাচন):</span>
              </span>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                ডেমো মোড
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {DEMO_USERS.map((demo) => (
                <button
                  key={demo.id}
                  type="button"
                  onClick={() => handleDemoSelect(demo.id)}
                  className="w-full text-left p-3 rounded-xl border border-gray-200 hover:border-[#075E3B] hover:bg-emerald-50/50 transition flex items-center justify-between group cursor-pointer"
                >
                  <div>
                    <p className="text-xs font-bold text-gray-900 group-hover:text-[#075E3B]">
                      {demo.name}
                    </p>
                    <p className="text-[11px] text-gray-500">
                      {demo.position_bn} • <span className="font-mono">{demo.email}</span>
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-[#075E3B] opacity-0 group-hover:opacity-100 transition flex items-center gap-1">
                    <span>প্রবেশ</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-gray-400 font-semibold">অথবা ম্যানুয়াল লগইন</span>
            </div>
          </div>

          {/* Manual Input Form */}
          <form onSubmit={handleManualLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 block">ইমেইল ঠিকানা</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ncp-bakalia.org"
                  className="w-full bg-[#F5F8F6] border border-gray-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs focus:outline-hidden focus:border-[#075E3B]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 block">পাসওয়ার্ড</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#F5F8F6] border border-gray-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs focus:outline-hidden focus:border-[#075E3B]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#075E3B] hover:bg-[#064E31] text-white font-bold py-3 rounded-xl text-xs md:text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>লগইন করুন</span>
            </button>
          </form>

          <div className="pt-2 text-center">
            <Link
              href="/"
              className="text-xs text-gray-500 hover:text-[#075E3B] inline-flex items-center gap-1 font-medium"
            >
              <span>পাবলিক ওয়েবসাইটে ফিরে যান</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
