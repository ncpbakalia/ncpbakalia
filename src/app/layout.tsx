import type { Metadata } from "next";
import { Hind_Siliguri, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

const hindSiliguri = Hind_Siliguri({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["bengali", "latin"],
  variable: "--font-bengali",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "জাতীয় নাগরিক পার্টি (এনসিপি) | বাকলিয়া থানা আহ্বায়ক কমিটি, চট্টগ্রাম মহানগর",
  description:
    "জাতীয় নাগরিক পার্টি (এনসিপি) - বাকলিয়া থানা আহ্বায়ক কমিটি, চট্টগ্রাম মহানগর। সদস্য সচিব: মোঃ আরিফ মাঈনুদ্দীন। অনুমোদনের তারিখ: ১৯ সেপ্টেম্বর ২০২৬।",
  keywords: [
    "জাতীয় নাগরিক পার্টি",
    "এনসিপি",
    "NCP",
    "Bakalia NCP",
    "বাকলিয়া থানা আহ্বায়ক কমিটি",
    "চট্টগ্রাম মহানগর",
    "মোঃ আরিফ মাঈনুদ্দীন",
    "Member Secretary Bakalia",
  ],
  authors: [{ name: "National Citizen Party - Bakalia Thana" }],
  openGraph: {
    title: "জাতীয় নাগরিক পার্টি (এনসিপি) - বাকলিয়া থানা আহ্বায়ক কমিটি",
    description: "অফিসিয়াল ওয়েবসাইট ও সাংগঠনিক ব্যবস্থাপনা পোর্টাল - বাকলিয়া, চট্টগ্রাম মহানগর।",
    siteName: "NCP Bakalia Thana",
    locale: "bn_BD",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" className={`${hindSiliguri.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-[#F5F8F6] text-[#17211B] font-bengali antialiased flex flex-col selection:bg-[#075E3B]/20 selection:text-[#075E3B]">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
