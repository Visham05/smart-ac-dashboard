
"use client";

import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gray-50">

      {/* Login Card */}
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-5 sm:p-6 md:p-8">

        {/* Heading */}
        <div className="text-center">
          <h3 className="text-2xl sm:text-3xl font-black text-gray-900">
            Sign In
          </h3>

          <p className="text-sm sm:text-base mt-2 text-gray-600">
            Welcome Back!
          </p>
        </div>

        {/* Email */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm sm:text-base outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>

        {/* Password */}
        <div className="mt-5">

          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>

          <div className="relative">

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-16 text-sm sm:text-base outline-none focus:ring-2 focus:ring-cyan-400"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-gray-800"
            >
              {showPassword ? "Hide" : "Show"}
            </button>

          </div>

          {/* Forgot Password */}
          <div className="text-right mt-3">
  <Link
    href="/ForgotPassword"
    className="text-sm text-cyan-600 hover:underline"
  >
    Forgot Password?
  </Link>
</div>

        </div>

        {/* Login Button */}
        <button
          type="button"
          className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition"
        >
          Sign In
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">

          <div className="h-px bg-gray-300 flex-1"></div>

          <span className="text-gray-400 text-sm">
            OR
          </span>

          <div className="h-px bg-gray-300 flex-1"></div>

        </div>

        {/* Signup */}
        <p className="text-center text-sm sm:text-base text-gray-600">
          Don't have an account?{" "}

          <Link
            href="/Signup"
            className="text-cyan-600 font-semibold hover:underline"
          >
            Create Account
          </Link>
        </p>

      </div>
    </div>
  );
}




