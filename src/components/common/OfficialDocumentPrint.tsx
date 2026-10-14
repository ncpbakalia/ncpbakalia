'use client';

import React from 'react';
import { Printer, Download, CheckCircle2, ShieldAlert } from 'lucide-react';
import { toBengaliDigits, formatBengaliDate } from '@/lib/constants';

interface OfficialDocumentPrintProps {
  documentType: 'নোটিশ' | 'পত্র' | 'কার্যবিবরণী' | 'কারণ দর্শানোর নোটিশ' | 'নাগরিক প্রাপ্তিস্বীকার';
  refNumber: string;
  date: string;
  recipient?: string;
  subject: string;
  bodyContent: string;
  signatoryLeft?: {
    name: string;
    designation: string;
  };
  signatoryRight?: {
    name: string;
    designation: string;
  };
  isConfidential?: boolean;
  notes?: string;
  onClose?: () => void;
}

export default function OfficialDocumentPrint({
  documentType,
  refNumber,
  date,
  recipient,
  subject,
  bodyContent,
  signatoryLeft = {
    name: 'মোঃ আরিফ মাঈনুদ্দীন',
    designation: 'সদস্য সচিব\nবাকলিয়া থানা আহ্বায়ক কমিটি',
  },
  signatoryRight = {
    name: 'মোহাম্মদ রাশেদুল ইসলাম',
    designation: 'আহ্বায়ক (ভারপ্রাপ্ত)\nবাকলিয়া থানা আহ্বায়ক কমিটি',
  },
  isConfidential = false,
  notes,
  onClose,
}: OfficialDocumentPrintProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      {/* Container */}
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        {/* Top Action Bar (Hidden during print) */}
        <div className="no-print bg-[#075E3B] text-white px-6 py-4 flex items-center justify-between border-b border-emerald-800">
          <div className="flex items-center gap-3">
            <Printer className="w-5 h-5 text-emerald-300" />
            <div>
              <h3 className="font-bold text-base">অফিসিয়াল এ-৪ (A4) প্রিন্ট ও প্রিভিউ</h3>
              <p className="text-xs text-emerald-100">
                স্মারক নং: {refNumber} • {documentType}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="bg-white hover:bg-emerald-50 text-[#075E3B] font-bold px-4 py-2 rounded-lg text-sm flex items-center gap-2 shadow-xs transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>প্রিন্ট / PDF সংরক্ষণ করুন</span>
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="bg-emerald-800/80 hover:bg-emerald-800 text-white font-medium px-3 py-2 rounded-lg text-sm transition cursor-pointer"
              >
                বন্ধ করুন
              </button>
            )}
          </div>
        </div>

        {/* Printable Sheet (Standard A4 Simulation) */}
        <div className="overflow-y-auto p-6 md:p-12 bg-gray-100 flex justify-center">
          <div
            id="printable-area"
            className="print-container bg-white w-full max-w-[210mm] min-h-[297mm] p-8 md:p-12 shadow-md relative text-[#17211B] flex flex-col justify-between"
          >
            {/* Watermark for confidential documents */}
            {isConfidential && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.06] select-none rotate-[-30deg]">
                <span className="text-8xl font-black text-red-600">গোপনীয়</span>
              </div>
            )}

            {/* Document Header / Letterhead */}
            <div>
              <div className="border-b-2 border-[#075E3B] pb-4 mb-6">
                <div className="flex items-start justify-between gap-4">
                  {/* Seal / Logo */}
                  <div className="w-20 h-20 rounded-full border-2 border-[#075E3B] p-1 flex items-center justify-center shrink-0">
                    <div className="w-full h-full rounded-full bg-[#075E3B] flex flex-col items-center justify-center text-white text-center">
                      <span className="font-bold text-sm tracking-wider">NCP</span>
                      <span className="text-[9px] -mt-0.5 text-emerald-200">বাকলিয়া</span>
                    </div>
                  </div>

                  {/* Organization Title */}
                  <div className="text-center flex-1">
                    <p className="text-xs font-semibold text-[#E32636] tracking-wider uppercase">
                      জাতীয় ঐক্য, সাম্য ও নাগরিক অধিকার
                    </p>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-[#075E3B] leading-tight">
                      জাতীয় নাগরিক পার্টি (এনসিপি)
                    </h1>
                    <p className="text-sm md:text-base font-bold text-gray-800">
                      বাকলিয়া থানা আহ্বায়ক কমিটি • চট্টগ্রাম মহানগর
                    </p>
                    <p className="text-[11px] text-gray-600 mt-1">
                      অনুমোদনের তারিখ: ১৯ সেপ্টেম্বর ২০২৬ • কার্যকাল: ৬ মাস • বাকলিয়া, চট্টগ্রাম
                    </p>
                    <p className="text-[10px] text-gray-500 font-mono">
                      ওয়েবসাইট ও ইমেইল: contact@ncp-bakalia.org | হেল্পলাইন: +880 1800-000000
                    </p>
                  </div>

                  {/* Red Emblem Accent */}
                  <div className="w-16 h-16 rounded-full bg-[#E32636]/10 border border-[#E32636]/30 flex flex-col items-center justify-center text-center p-1 shrink-0">
                    <span className="text-[9px] text-[#E32636] font-bold">অনুমোদিত</span>
                    <span className="text-xs font-bold text-[#E32636]">কমিটি</span>
                  </div>
                </div>
              </div>

              {/* Reference and Date */}
              <div className="flex justify-between items-center text-xs md:text-sm font-semibold border-b border-gray-200 pb-3 mb-6">
                <div>
                  <span className="text-gray-600">স্মারক নং: </span>
                  <span className="font-mono text-[#075E3B] font-bold">{refNumber}</span>
                </div>
                <div>
                  <span className="text-gray-600">তারিখ: </span>
                  <span className="font-medium">{formatBengaliDate(date)} খ্রি.</span>
                </div>
              </div>

              {/* Recipient If applicable */}
              {recipient && (
                <div className="mb-4 text-xs md:text-sm text-gray-800">
                  <p className="font-bold">বরাবর,</p>
                  <p className="whitespace-pre-line font-medium leading-relaxed">{recipient}</p>
                </div>
              )}

              {/* Subject */}
              <div className="mb-6 bg-gray-50 p-3 rounded-lg border-l-4 border-[#075E3B]">
                <p className="text-xs md:text-sm font-bold text-gray-900 leading-snug">
                  <span className="text-[#075E3B]">বিষয়: </span>
                  {subject}
                </p>
              </div>

              {/* Main Document Body */}
              <div className="text-xs md:text-sm leading-relaxed text-gray-800 space-y-4 whitespace-pre-line min-h-[350px]">
                {bodyContent}
              </div>

              {notes && (
                <div className="mt-6 pt-4 border-t border-dashed border-gray-300 text-xs text-gray-600 italic">
                  বিশেষ দ্রষ্টব্য: {notes}
                </div>
              )}
            </div>

            {/* Signature & Seal Block */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex justify-between items-end gap-8">
                {/* Left Signatory (Member Secretary) */}
                <div className="text-center w-52">
                  <div className="h-14 flex items-center justify-center">
                    <div className="text-xs font-serif text-emerald-800 opacity-70 italic border-b border-gray-400 w-36 pb-1">
                      (অনুমোদিত স্বাক্ষর)
                    </div>
                  </div>
                  <p className="font-bold text-sm text-gray-900">{signatoryLeft.name}</p>
                  <p className="text-xs text-gray-600 whitespace-pre-line leading-tight">
                    {signatoryLeft.designation}
                  </p>
                </div>

                {/* Central Seal Placeholder */}
                <div className="text-center shrink-0">
                  <div className="w-20 h-20 rounded-full border border-dashed border-gray-400 flex items-center justify-center text-[10px] text-gray-400">
                    প্রাতিষ্ঠানিক সিল
                  </div>
                </div>

                {/* Right Signatory (Convener) */}
                <div className="text-center w-52">
                  <div className="h-14 flex items-center justify-center">
                    <div className="text-xs font-serif text-emerald-800 opacity-70 italic border-b border-gray-400 w-36 pb-1">
                      (অনুমোদিত স্বাক্ষর)
                    </div>
                  </div>
                  <p className="font-bold text-sm text-gray-900">{signatoryRight.name}</p>
                  <p className="text-xs text-gray-600 whitespace-pre-line leading-tight">
                    {signatoryRight.designation}
                  </p>
                </div>
              </div>

              {/* Document Security Footer */}
              <div className="mt-8 pt-3 border-t border-gray-200 flex justify-between items-center text-[10px] text-gray-500">
                <p>
                  এই কপিটি জাতীয় নাগরিক পার্টি বাকলিয়া থানা আহ্বায়ক কমিটির কেন্দ্রীয় ডিজিটাল ম্যানেজমেন্ট সিস্টেম থেকে জেনারেটকৃত।
                </p>
                <p className="font-mono">যাচাইকরণ কোড: {refNumber.replace(/[^A-Za-z0-9]/g, '')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
