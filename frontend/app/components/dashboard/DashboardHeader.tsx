"use client";

import Image from "next/image";
import Link from "next/link";
import { Bell, Search } from "lucide-react";

export default function DashboardHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
      <div className="flex items-center justify-between px-8 py-4">
        <Link href="/dashboard" className="shrink-0">
          <Image
            src="/images/logo/logo.svg"
            alt="Copilot By Umurava Logo"
            width={110}
            height={20}
          />
        </Link>

        <div className="mx-8 w-full max-w-xl">
          <div className="flex items-center gap-2 rounded-full bg-white px-4 py-3 shadow-sm border border-gray-100">
            <Search className="h-4 w-4 text-gray-400" />
            <input
              placeholder="Search..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
            />
          </div>
        </div>

        <button className="h-10 w-10 rounded-full bg-white border border-gray-100 shadow-sm grid place-items-center hover:bg-gray-50 transition-colors">
          <Bell className="h-5 w-5 text-gray-600" />
        </button>
      </div>
    </header>
  );
}
