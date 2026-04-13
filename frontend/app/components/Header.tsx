"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between transition-all duration-300 ${
        scrolled
          ? "w-[80%] px-6 py-3 bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-gray-100"
          : "w-full px-[122px] py-5 bg-[#f8f8fd]"
      }`}
    >
      <div className="flex items-center gap-8">
        <Image
          src="/images/logo/logo.svg"
          alt="Copilot By Umurava Logo"
          width={110}
          height={34}
        />

        <nav className="flex items-center gap-6 text-sm text-gray-700">
          <a href="" className="hover:text-gray-900">
            Find Jobs
          </a>
          <a href="" className="hover:text-gray-900">
            About
          </a>
          <a href="" className="hover:text-gray-900">
            Contact
          </a>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/auth/login"
          className="text-sm font-bold text-[#286ef0] hover:text-[#4338CA]"
        >
          Login
        </Link>
        <a
          href=""
          className="px-5 py-2.5 text-sm font-medium text-white bg-[#286ef0]  hover:bg-[#2566de]"
        >
          Sign Up
        </a>
      </div>
    </header>
  );
}
