
"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { Leaf, Mail, ShieldCheck, ArrowLeft } from "lucide-react";

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Read email after the browser has mounted.
  useEffect(() => {
    const savedEmail = sessionStorage.getItem("resetEmail");

    if (!savedEmail) {
      window.location.replace("/ForgotPassword");
      return;
    }

    setEmail(savedEmail);
  }, []);

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");

    const enteredOtp = otp.join("");

    if (!email) {
      setError("Email address not found. Please request a new OTP.");
      return;
    }

    if (enteredOtp.length !== 6) {
      setError("Please enter the complete 6-digit OTP.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email,
            otp: enteredOtp,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "OTP verification failed");
      }

      // Backend has verified the OTP and set the reset cookie.
      window.location.href = "/ResetPassword";

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to verify OTP. Please try again."
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

        {/* OTP Card */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8">

          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-emerald-100 p-4 text-emerald-700">
              <ShieldCheck size={32} />
            </div>
          </div>

          <div className="mb-7 text-center">
            <h1 className="text-2xl font-bold text-[#061A3A]">
              Verify Your Email
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Enter the 6-digit verification code sent to:
            </p>

            <p className="mt-2 flex items-center justify-center gap-2 text-sm font-semibold text-slate-700">
              <Mail size={16} />
              {email || "Loading email..."}
            </p>
          </div>

          <form onSubmit={handleSubmit}>

            <label className="mb-3 block text-center text-sm font-semibold">
              Enter OTP
            </label>

            <div className="mb-6 flex justify-center gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={1}
                  value={digit}
                  onChange={(e) =>
                    handleChange(e.target.value, index)
                  }
                  onKeyDown={(e) => {
                    if (
                      e.key === "Backspace" &&
                      !otp[index] &&
                      index > 0
                    ) {
                      document
                        .getElementById(`otp-${index - 1}`)
                        ?.focus();
                    }
                  }}
                  className="h-12 w-11 rounded-xl border border-slate-300 text-center text-xl font-bold outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                />
              ))}
            </div>

            {error && (
              <p className="mb-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-cyan-600 py-3 font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Verifying OTP..." : "Verify OTP"}
            </button>

          </form>

          <p className="mt-5 text-center text-sm text-slate-500">
            Didn't receive the code?{" "}
            <Link
              href="/ForgotPassword"
              className="font-bold text-cyan-700 hover:underline"
            >
              Request another OTP
            </Link>
          </p>

          <div className="mt-6 text-center">
            <Link
              href="/ForgotPassword"
              className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-700 hover:underline"
            >
              <ArrowLeft size={16} />
              Back
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
