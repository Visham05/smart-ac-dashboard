
"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Leaf, Mail, Lock, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Login succeeded. Navigate to the dashboard.
      window.location.href = "/Dashboard";

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to connect to the server"
      );
    } finally {
      setLoading(false);
    }
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

        {/* Login Card */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8">

          <div className="mb-7 text-center">
            <h1 className="text-2xl font-bold text-[#061A3A]">
              Welcome Back!
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Sign in to monitor your AC and energy usage.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Registered Email Address
              </label>

              <div className="flex items-center rounded-xl border border-slate-300 px-3">
                <Mail size={19} className="text-slate-400" />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your registered email"
                  required
                  className="w-full bg-transparent p-3 outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-semibold">
                  Password
                </label>

                <Link
                  href="/ForgotPassword"
                  className="text-xs font-semibold text-cyan-700 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              <div className="flex items-center rounded-xl border border-slate-300 px-3">
                <Lock size={19} className="text-slate-400" />

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full bg-transparent p-3 outline-none"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs font-semibold text-sky-600"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">
                {error}
              </p>
            )}

            {/* Sign In */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-600 py-3 font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing In..." : "Sign In"}
              {!loading && <ArrowRight size={18} />}
            </button>

          </form>

          <div className="mt-6 text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link
              href="/Signup"
              className="font-bold text-cyan-700 hover:underline"
            >
              Create Account
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
