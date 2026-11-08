
"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Leaf, Lock, ShieldCheck, ArrowRight } from "lucide-react";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (new TextEncoder().encode(password).length > 72) {
      setError("Password is too long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            password,
            confirmPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Password reset failed");
      }

      setSuccess(true);
      sessionStorage.removeItem("resetEmail");
      sessionStorage.removeItem("verifiedOtpDemo");

      setPassword("");
      setConfirmPassword("");

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to connect to the server."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md">

        {/* Logo */}
        <Link
          href="/"
          className="mb-8 flex items-center justify-center gap-2"
        >
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

        {/* Reset Password Card */}
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

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Create a new secure password for your Smart AC account.
            </p>
          </div>

          {success ? (
            <div className="space-y-5 text-center">

              <div className="rounded-xl bg-emerald-50 p-4 text-emerald-700">
                <p className="font-bold">
                  Password Reset Successfully!
                </p>

                <p className="mt-2 text-sm">
                  Your new password has been saved. You can now sign in.
                </p>
              </div>

              <Link
                href="/Login"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-600 py-3 font-semibold text-white hover:bg-cyan-700"
              >
                Return to Sign In
                <ArrowRight size={18} />
              </Link>

            </div>
          ) : (

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
                  Use at least 8 characters.
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

              {/* Error */}
              {error && (
                <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">
                  {error}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-600 py-3 font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Updating Password..." : "Reset Password"}
                {!loading && <ArrowRight size={18} />}
              </button>

            </form>
          )}

          {!success && (
            <div className="mt-6 text-center">
              <Link
                href="/Login"
                className="text-sm font-semibold text-cyan-700 hover:underline"
              >
                Return to Sign In
              </Link>
            </div>
          )}

        </section>

        <p className="mt-6 text-center text-xs text-slate-400">
          Smart AC · Energy-aware comfort
        </p>

      </div>
    </main>
  );
}
