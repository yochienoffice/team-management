import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";
import React from "react";

const inter = Inter({ subsets: ["latin"] });
export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: "壘球黑狗球隊管理 v1.0.0",
  description: "球隊管理網站",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} xl:h-full w-full flex flex-col bg-hs-main-bg xl:flex-row overflow-x-hidden`}
      >
        <Navbar />
        <div className={`bg-hs-main-bg min-h-screen py-6 md:py-0 xl:ml-70 w-full flex flex-col gap-8`}>
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  );
}
