
"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Leaf, User, Mail, Lock, ArrowRight } from "lucide-react";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setSuccess(true);
      setName("");
      setEmail("");
      setPassword("");

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

        {/* Signup Card */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8">

          <div className="mb-7 text-center">
            <h1 className="text-2xl font-bold text-[#061A3A]">
              Create Your Account
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Join Smart AC and start managing your energy.
            </p>
          </div>

          {success ? (
            <div className="space-y-5 text-center">
              <div className="rounded-xl bg-emerald-50 p-4 text-emerald-700">
                <p className="font-bold">
                  Account created successfully!
                </p>
                <p className="mt-2 text-sm">
                  Your account has been saved. You can now sign in.
                </p>
              </div>

              <Link
                href="/Login"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-600 py-3 font-semibold text-white hover:bg-cyan-700"
              >
                Continue to Sign In
                <ArrowRight size={18} />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Name */}
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Full Name
                </label>

                <div className="flex items-center rounded-xl border border-slate-300 px-3">
                  <User size={19} className="text-slate-400" />

                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    required
                    maxLength={100}
                    className="w-full bg-transparent p-3 outline-none"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Email Address
                </label>

                <div className="flex items-center rounded-xl border border-slate-300 px-3">
                  <Mail size={19} className="text-slate-400" />

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full bg-transparent p-3 outline-none"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Password
                </label>

                <div className="flex items-center rounded-xl border border-slate-300 px-3">
                  <Lock size={19} className="text-slate-400" />

                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    required
                    minLength={8}
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

                <p className="mt-1 text-xs text-slate-400">
                  Use at least 8 characters.
                </p>
              </div>

              {/* Error message */}
              {error && (
                <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">
                  {error}
                </p>
              )}

              {/* Create Account */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-600 py-3 font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating Account..." : "Create Account"}
                {!loading && <ArrowRight size={18} />}
              </button>

            </form>
          )}

          {!success && (
            <p className="mt-6 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                href="/Login"
                className="font-bold text-cyan-700 hover:underline"
              >
                Sign In
              </Link>
            </p>
          )}

        </section>

        <p className="mt-6 text-center text-xs text-slate-400">
          Smart AC · Energy-aware comfort
        </p>

      </div>
    </main>
  );
}
