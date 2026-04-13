"use client";
import { GoogleLogin } from "@react-oauth/google";
import Link from "next/link";

export default function LoginForm() {
  return (
    <form className="space-y-5 py-2">
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

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Password
        </label>
        <input
          type="password"
          placeholder="Enter your password"
          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#286ef0] transition-colors"
        />
      </div>

      {/* Forgot password */}
      <div className="text-right -mt-2">
        <Link href="" className="text-sm text-[#286ef0] hover:text-[#2566de]">
          Forgot Your Password?
        </Link>
      </div>

      {/* Login button */}
      <button
        type="submit"
        className="w-full py-3 bg-[#286ef0] text-white font-medium rounded-lg hover:bg-[#2566de] transition-colors"
      >
        Login
      </button>

      <div className="flex items-center gap-4  mb-5 text-black/50">
        <div className="w-full h-px bg-black/50" />
        <span>Or</span>
        <div className="w-full h-px bg-black/50" />
      </div>

      <GoogleLogin
        onSuccess={(credentialResponse) => {
          console.log(credentialResponse);
        }}
        onError={() => {
          console.log("Login Failed");
        }}
      />

      <div className="text-center mt-2">
        <span className="text-sm w-full">
          Don't have an account?{" "}
          <Link
            href="/dashboard/auth/register"
            className="text-[#286ef0] font-semibold hover:text-[#286ef0]/80"
          >
            Signup Now
          </Link>
        </span>
      </div>
    </form>
  );
}
