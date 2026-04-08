import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TruthLens — AI Deepfake Detection Engine",
  description:
    "Detect deepfakes in images, videos, and audio using advanced ML models. Powered by DeepTrace ML Engine.",
  keywords: ["deepfake", "detection", "AI", "media integrity", "TruthLens"],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex flex-col min-h-full bg-[#060912] text-slate-100">
        <Navbar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
