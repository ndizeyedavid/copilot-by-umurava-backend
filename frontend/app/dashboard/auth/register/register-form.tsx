"use client";
import { GoogleLogin } from "@react-oauth/google";
import Link from "next/link";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

export default function RegisterForm() {
  return (
    <form className="space-y-4 py-2">
      {/* First Name & Last Name */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name
          </label>
          <input
            type="text"
            placeholder="John"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#286ef0] transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name
          </label>
          <input
            type="text"
            placeholder="Doe"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#286ef0] transition-colors"
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>
        <input
          type="email"
          placeholder="Enter your email address"
          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#286ef0] transition-colors"
        />
      </div>

      {/* Phone Number */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number
        </label>
        <PhoneInput
          international
          defaultCountry="RW"
          onChange={() => {}}
          placeholder="Enter phone number"
          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus-within:border-[#286ef0] transition-colors bg-white"
        />
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Password
        </label>
        <input
          type="password"
          placeholder="Create a password"
          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#286ef0] transition-colors"
        />
      </div>

      {/* Register button */}
      <button
        type="submit"
        className="w-full py-3 bg-[#286ef0] text-white font-medium rounded-lg hover:bg-[#2566de] transition-colors"
      >
        Create Account
      </button>

      <div className="text-center mt-2">
        <span className="text-sm w-full">
          Already have an account?{" "}
          <Link
            href="/dashboard/auth/login"
            className="text-[#286ef0] font-semibold hover:text-[#286ef0]/80"
          >
            Login
          </Link>
        </span>
      </div>
    </form>
  );
}
