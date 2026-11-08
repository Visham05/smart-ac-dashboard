
"use client";

import Link from "next/link";
import { useState } from "react";
import { Leaf, Lock, ShieldCheck, ArrowRight } from "lucide-react";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password.length < 8) {
      setMessage("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    // Actual password reset will be connected to the backend later.
    setMessage("Password details accepted for demo. Backend connection is pending.");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md">

        {/* Logo */}
        <Link href="/" className="mb-8 flex items-center justify-center gap-2">
          <span className="rounded-full bg-emerald-100 p-3 text-emerald-700">
            <Leaf size={25} />
          </span>
          <span>
            <span className="block text-xl font-bold text-[#061A3A]">
              Smart AC
            </span>
            <span className="text-xs text-slate-500">
              Save Energy · Save Money
            </span>
          </span>
        </Link>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8">

          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-emerald-100 p-4 text-emerald-700">
              <ShieldCheck size={32} />
            </div>
          </div>

          <div className="mb-7 text-center">
            <h1 className="text-2xl font-bold text-[#061A3A]">
              Reset Your Password
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Create a new secure password for your Smart AC account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* New Password */}
            <div>
              <label className="mb-2 block text-sm font-semibold">
                New Password
              </label>

              <div className="flex items-center rounded-xl border border-slate-300 px-3">
                <Lock size={19} className="text-slate-400" />

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  minLength={8}
                  className="w-full bg-transparent p-3 outline-none"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs font-semibold text-cyan-700"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <p className="mt-1 text-xs text-slate-400">
                Minimum 8 characters.
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Confirm New Password
              </label>

              <div className="flex items-center rounded-xl border border-slate-300 px-3">
                <Lock size={19} className="text-slate-400" />

                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                  minLength={8}
                  className="w-full bg-transparent p-3 outline-none"
                />
              </div>
            </div>

            {message && (
              <p className="rounded-lg bg-sky-50 p-3 text-sm text-sky-700">
                {message}
              </p>
            )}

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-600 py-3 font-semibold text-white transition hover:bg-cyan-700"
            >
              Reset Password
              <ArrowRight size={18} />
            </button>

          </form>

          <div className="mt-6 text-center">
            <Link
              href="/Login"
              className="text-sm font-semibold text-cyan-700 hover:underline"
            >
              Return to Sign In
            </Link>
          </div>

        </section>

        <p className="mt-6 text-center text-xs text-slate-400">
          Smart AC · Energy-aware comfort
        </p>

      </div>
    </main>
  );
}
