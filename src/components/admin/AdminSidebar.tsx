'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
  LayoutDashboard,
  Users,
  FileText,
  MailCheck,
  ShieldAlert,
  CalendarDays,
  CheckSquare,
  MessageSquareWarning,
  BarChart3,
  History,
  Settings,
  LogOut,
  ExternalLink,
  ShieldCheck,
  User,
} from 'lucide-react';

const ADMIN_LINKS = [
  { href: '/admin', label: 'ড্যাশবোর্ড ওভারভিউ', icon: LayoutDashboard },
  { href: '/admin/committee', label: 'কমিটি ব্যবস্থাপনা', icon: Users },
  { href: '/admin/notices', label: 'নোটিশ ব্যবস্থাপনা', icon: FileText },
  { href: '/admin/correspondence', label: 'পত্র রেজিস্টার (In/Out)', icon: MailCheck },
  {
    href: '/admin/disciplinary',
    label: 'শৃঙ্খলা ও তদন্ত সেল',
    icon: ShieldAlert,
    restricted: true,
  },
  { href: '/admin/meetings', label: 'সভা ও কার্যবিবরণী', icon: CalendarDays },
  { href: '/admin/tasks', label: 'সাংগঠনিক দায়িত্ব/টাস্ক', icon: CheckSquare },
  { href: '/admin/civic-issues', label: 'নাগরিক সেবা নিষ্পত্তি', icon: MessageSquareWarning },
  { href: '/admin/reports', label: 'রিপোর্ট ও রফতানি', icon: BarChart3 },
  { href: '/admin/audit-logs', label: 'নিরাপত্তা ও অডিট লগ', icon: History },
  { href: '/admin/settings', label: 'সিস্টেম সেটিংস', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout, canAccessDisciplinary } = useAuth();

  return (
    <aside className="w-64 bg-[#17211B] text-gray-200 min-h-screen flex flex-col border-r border-[#075E3B]/40 shrink-0">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-800 bg-[#075E3B]/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#075E3B] to-[#13804A] flex items-center justify-center text-white font-bold text-xs border border-emerald-500 shadow-sm">
            NCP
          </div>
          <div>
            <h2 className="font-bold text-sm text-white leading-tight">অ্যাডমিন পোর্টাল</h2>
            <p className="text-[11px] text-emerald-400 font-medium">
              বাকলিয়া থানা আহ্বায়ক কমিটি
            </p>
          </div>
        </div>
      </div>

      {/* User Status Bar */}
      {user && (
        <div className="p-3 bg-gray-900/60 border-b border-gray-800 mx-2 mt-2 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#075E3B] text-white flex items-center justify-center font-bold text-xs">
              <User className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{user.name}</p>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <p className="text-[10px] text-gray-400 font-medium capitalize">
                  {user.position_bn || user.role}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {ADMIN_LINKS.map((link) => {
          // If restricted and user cannot access disciplinary, don't show or mark badge
          if (link.restricted && !canAccessDisciplinary()) {
            return null;
          }

          const isActive = pathname === link.href;
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                isActive
                  ? 'bg-[#075E3B] text-white shadow-sm'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={`w-4 h-4 ${
                    isActive
                      ? 'text-white'
                      : link.restricted
                      ? 'text-[#E32636]'
                      : 'text-emerald-400'
                  }`}
                />
                <span>{link.label}</span>
              </div>
              {link.restricted && (
                <span className="bg-[#E32636]/20 text-[#E32636] border border-[#E32636]/40 text-[9px] px-1.5 py-0.5 rounded font-bold">
                  গোপনীয়
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Footer Actions */}
      <div className="p-3 border-t border-gray-800 bg-gray-900/40 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
            <span>পাবলিক ওয়েবসাইট</span>
          </span>
          <span className="text-[10px] bg-gray-800 px-1.5 py-0.5 rounded">লাইভ</span>
        </Link>

        {user && (
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-red-300 hover:bg-red-950/40 hover:text-red-200 transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 text-red-400" />
            <span>লগআউট করুন</span>
          </button>
        )}
      </div>
    </aside>
  );
}
