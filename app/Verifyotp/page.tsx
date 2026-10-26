export default function VerifyOtpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-white">
      <section className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-8">
        <h1 className="text-3xl font-bold">Verify OTP</h1>
        <p className="mt-3 text-slate-300">
          OTP verification will be available soon.
        </p>
        <a className="mt-6 inline-block text-blue-400 underline" href="/Login">
          Back to Login
        </a>
      </section>
    </main>
  );
}
