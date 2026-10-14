'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_LINKS } from '@/lib/constants';
import {
  Menu,
  X,
  Shield,
  FileText,
  UserCheck,
  PhoneCall,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#075E3B]/10 shadow-xs">
      {/* Top Notice / Status Bar */}
      <div className="bg-[#075E3B] text-white text-xs py-1.5 px-4 font-medium">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#E32636] animate-pulse"></span>
            <span>
              জাতীয় নাগরিক পার্টি (এনসিপি) • বাকলিয়া থানা আহ্বায়ক কমিটি, চট্টগ্রাম মহানগর
            </span>
            <span className="hidden md:inline-block bg-[#13804A] px-2 py-0.5 rounded-full text-[11px]">
              অনুমোদন: ১৯ সেপ্টেম্বর ২০২৬ (মেয়াদ: ৬ মাস)
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <Link
              href="/citizen-feedback"
              className="text-[#E2ECE6] hover:text-white flex items-center gap-1 font-semibold underline underline-offset-2"
            >
              নাগরিক মতামত ও অভিযোগ দাখিল
            </Link>
            <span className="text-white/40">|</span>
            <Link
              href="/admin"
              className="bg-white/10 hover:bg-white/20 text-white px-2.5 py-0.5 rounded-md flex items-center gap-1 transition"
            >
              <Shield className="w-3 h-3 text-[#E32636]" />
              <span>{user ? `ড্যাশবোর্ড (${user.name})` : 'প্রশাসনিক লগইন'}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Brand Logo & Name */}
          <Link href="/" className="flex items-center gap-3 group">
            {/* Logo Emblem Placeholder with Bangladesh & NCP Colors */}
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#075E3B] to-[#13804A] flex items-center justify-center p-1.5 shadow-md shadow-[#075E3B]/20 border-2 border-[#E32636]/30 group-hover:scale-105 transition">
              <div className="w-full h-full rounded-lg border border-white/30 flex flex-col items-center justify-center text-white">
                <span className="font-bold text-xs tracking-wider">NCP</span>
                <span className="text-[8px] -mt-1 font-medium text-emerald-200">বাকলিয়া</span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-bold text-[#075E3B] tracking-tight group-hover:text-[#13804A] transition">
                  জাতীয় নাগরিক পার্টি
                </h1>
                <span className="bg-[#E32636] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                  এনসিপি
                </span>
              </div>
              <p className="text-xs text-[#17211B]/80 font-medium">
                বাকলিয়া থানা আহ্বায়ক কমিটি • চট্টগ্রাম মহানগর
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {NAV_LINKS.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors duration-150 ${
                    isActive
                      ? 'bg-[#075E3B] text-white shadow-xs'
                      : 'text-[#17211B] hover:text-[#075E3B] hover:bg-[#075E3B]/5'
                  }`}
                >
                  {link.label_bn}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Button */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/citizen-feedback"
              className="bg-[#E32636] hover:bg-[#c91e2c] text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-sm hover:shadow transition flex items-center gap-1.5"
            >
              <span>নাগরিক সেবা</span>
              <span className="text-xs opacity-90 bg-white/20 px-1.5 py-0.5 rounded">অভিযোগ</span>
            </Link>
          </div>

          {/* Mobile menu trigger button */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              href="/admin"
              className="p-2 text-[#075E3B] bg-[#075E3B]/10 rounded-lg text-xs font-semibold"
            >
              লগইন
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#17211B] hover:bg-gray-100 focus:outline-hidden"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white px-4 pt-3 pb-6 shadow-xl">
          <div className="space-y-1">
            {NAV_LINKS.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2.5 rounded-lg text-base font-semibold ${
                    isActive
                      ? 'bg-[#075E3B] text-white'
                      : 'text-[#17211B] hover:bg-[#075E3B]/5'
                  }`}
                >
                  {link.label_bn}
                </Link>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-2">
            <Link
              href="/citizen-feedback"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center bg-[#E32636] text-white py-2.5 rounded-lg font-semibold shadow-xs"
            >
              নাগরিক মতামত ও অভিযোগ দাখিল
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center bg-[#075E3B]/10 text-[#075E3B] py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2"
            >
              <Shield className="w-4 h-4 text-[#075E3B]" />
              <span>প্রশাসনিক ড্যাশবোর্ড</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
